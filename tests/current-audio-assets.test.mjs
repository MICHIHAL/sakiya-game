import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  AUDIO_CUE_DEFINITIONS,
  createCurrentAudioDirector,
  ENTRY_CHIME_URL,
  mapCurrentGameEventsToAudio,
} from "../src/game/current-audio.js";
import {
  advanceGame,
  createGameState,
  runCommand,
  simulateJourney,
} from "../src/game/current-engine.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const audioDirectory = path.join(root, "public", "assets", "current");
const entryChimePath = path.join(root, "public", ENTRY_CHIME_URL);
const audioManifestPath = path.join(audioDirectory, "audio-assets.json");

const CURRENT_ENGINE_AUDIO_ROUTES = Object.freeze([
  { engineType: "entry-chime", audioType: "ENTRY_CHIME", cueId: "S0_ENTRY_CHIME" },
  { engineType: "fictional-person-revisit", audioType: "FICTIONAL_PERSON_REVISIT", cueId: "S1_FIRST_REVISIT" },
  { engineType: "fictional-person-returned", audioType: "FICTIONAL_PERSON_RETURNED", cueId: "S1_FIRST_REVISIT" },
  { engineType: "fictional-person-away", audioType: "FICTIONAL_PERSON_AWAY", cueId: "S1_PERSON_CRITICAL" },
  { engineType: "material-preserved", audioType: "MATERIAL_PRESERVED", cueId: "S2_BROADCAST_PRESERVE" },
  { engineType: "video-created", audioType: "VIDEO_CREATED", cueId: "S2_VIDEO_CREATED" },
  { engineType: "singing-practiced", audioType: "SINGING_PRACTICED", cueId: "S2_SINGING_PRACTICED" },
  { engineType: "music-arranged", audioType: "MUSIC_ARRANGED", cueId: "S2_MUSIC_ARRANGED" },
  { engineType: "sns-posted", audioType: "SNS_POSTED", cueId: "S2_SNS_POSTED" },
  { engineType: "live-event-hosted", audioType: "LIVE_EVENT_HOSTED", cueId: "S2_LIVE_EVENT_HOSTED" },
  { engineType: "activity-bridge-created", audioType: "ACTIVITY_BRIDGE_CREATED", cueId: "S2_ACTIVITY_BRIDGE" },
  { engineType: "breakpoint-reached", audioType: "BREAKPOINT_REACHED", cueId: "S2_BREAKPOINT" },
  { engineType: "prestige-complete", audioType: "PRESTIGE_COMPLETE", cueId: "S2_PRESTIGE_RELEASE" },
  { engineType: "scale-peak-candidate", audioType: "SCALE_PEAK_CANDIDATE", cueId: "S2_SP01_TRANSITION" },
  { engineType: "completion-candidate-recorded", audioType: "COMPLETION_CANDIDATE_RECORDED", cueId: "S2_MAIN_COMPLETION" },
  { engineType: "offline-summary", audioType: "OFFLINE_SUMMARY", cueId: "S2_OFFLINE_SUMMARY" },
]);

const currentEngineAudioRouteByType = new Map(
  CURRENT_ENGINE_AUDIO_ROUTES.map((route) => [route.engineType, route]),
);

function expectedCueId(route, event) {
  if (route.engineType !== "scale-peak-candidate") return route.cueId;
  const peakId = String(event.peakId ?? event.scalePeakId ?? event.id);
  const number = Number(peakId.replace(/^SP/i, ""));
  return "S2_SP" + String(number).padStart(2, "0") + "_TRANSITION";
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  }));
  return nested.flat();
}

async function flushAudioTasks() {
  for (let index = 0; index < 3; index += 1) {
    await new Promise((resolve) => setImmediate(resolve));
  }
}

async function withFakeBrowserAudio(run) {
  const hadWindow = Object.prototype.hasOwnProperty.call(globalThis, "window");
  const hadFetch = Object.prototype.hasOwnProperty.call(globalThis, "fetch");
  const originalWindow = globalThis.window;
  const originalFetch = globalThis.fetch;
  let starts = 0;

  class FakeAudioParam {
    cancelScheduledValues() {}
    setTargetAtTime() {}
    setValueAtTime() {}
    exponentialRampToValueAtTime() {}
  }

  class FakeAudioContext {
    constructor() {
      this.currentTime = 0;
      this.destination = {};
      this.state = "suspended";
    }

    createGain() {
      return { gain: new FakeAudioParam(), connect() {} };
    }

    createBufferSource() {
      return {
        buffer: null,
        connect() {},
        start() {
          starts += 1;
        },
        stop() {
          this.onended?.();
        },
        onended: null,
      };
    }

    decodeAudioData() {
      return Promise.resolve({ decoded: true });
    }

    resume() {
      this.state = "running";
      return Promise.resolve();
    }

    suspend() {
      this.state = "suspended";
      return Promise.resolve();
    }

    close() {
      this.state = "closed";
      return Promise.resolve();
    }
  }

  globalThis.window = { AudioContext: FakeAudioContext };
  globalThis.fetch = async () => ({
    ok: true,
    arrayBuffer: async () => new ArrayBuffer(8),
  });
  try {
    await run({ starts: () => starts });
  } finally {
    if (hadWindow) globalThis.window = originalWindow;
    else delete globalThis.window;
    if (hadFetch) globalThis.fetch = originalFetch;
    else delete globalThis.fetch;
  }
}

function firstEntryEvent(id = "lineage-001:e2") {
  const lineageId = id.split(":")[0];
  const engineEvent = {
    type: "entry-chime",
    audioKey: "entry-chime-canonical",
    id,
  };
  return {
    event: {
      type: "ENTRY_CHIME",
      audioKey: engineEvent.audioKey,
      id: engineEvent.id,
      lineageId,
    },
    state: {
      lineageId,
      meta: { firstArrivalChimePlayed: true },
      recentEvents: [engineEvent],
    },
  };
}

test("has exactly one canonical S0 entry chime with a valid WAV identity record", async () => {
  const [wav, manifestText, files] = await Promise.all([
    readFile(entryChimePath),
    readFile(audioManifestPath, "utf8"),
    listFiles(audioDirectory),
  ]);
  const manifest = JSON.parse(manifestText);
  const entryAssets = manifest.assets.filter((asset) => asset.semanticClass === "S0");
  const entryLikeFiles = files
    .map((file) => path.basename(file))
    .filter((name) => /entry|chime/i.test(name));

  assert.equal(entryAssets.length, 1);
  assert.equal(entryAssets[0].assetId, "S0_ENTRY_CHIME");
  assert.equal(entryAssets[0].runtimePath, ENTRY_CHIME_URL);
  assert.equal(entryAssets[0].voiceIdentity, "NO_VOICE");
  assert.equal(entryAssets[0].rightsBasis, "project-original generated signal");
  assert.equal(entryAssets[0].trigger.id, "TRG-ENTRY-01");
  assert.equal(entryAssets[0].caption, "はじめての来訪");
  assert.equal(typeof entryAssets[0].visualSignal?.kind, "string");
  assert.deepEqual(entryLikeFiles, ["entry-chime.wav"]);

  assert.equal(wav.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(wav.subarray(8, 12).toString("ascii"), "WAVE");
  assert.equal(wav.readUInt32LE(4) + 8, wav.length);
  assert.equal(createHash("sha256").update(wav).digest("hex"), entryAssets[0].sha256);
});

test("keeps every S0 through S2 semantic cue accessible without sound or color alone", () => {
  const requiredCues = Object.values(AUDIO_CUE_DEFINITIONS)
    .filter((definition) => ["S0", "S1", "S2"].includes(definition.semanticClass));

  assert.ok(requiredCues.length > 0);
  assert.equal(requiredCues.filter((definition) => definition.semanticClass === "S0").length, 1);
  for (const definition of requiredCues) {
    assert.equal(typeof definition.caption, "string", definition.cueId + " needs a caption");
    assert.ok(definition.caption.length > 0, definition.cueId + " needs a non-empty caption");
    assert.equal(typeof definition.visualSignal?.kind, "string", definition.cueId + " needs a visual signal kind");
    assert.equal(typeof definition.visualSignal?.label, "string", definition.cueId + " needs a visual signal label");
    assert.ok(definition.visualSignal.label.length > 0, definition.cueId + " needs a non-empty visual signal label");
    assert.equal("color" in definition.visualSignal, false, definition.cueId + " cannot rely on color alone");
  }
});

test("is safe to import under Node and retains an unavailable entry chime as pending", async () => {
  const director = createCurrentAudioDirector();
  const { event, state } = firstEntryEvent();
  const first = director.handle(event, state);

  assert.equal(first.length, 1);
  assert.equal(first[0].cueId, "S0_ENTRY_CHIME");
  assert.equal(first[0].caption, "はじめての来訪");
  assert.equal(typeof first[0].durableHistory.visualSignal.kind, "string");
  assert.equal(first[0].suppressed, false);
  assert.equal(first[0].pending, true);
  assert.equal(first[0].playback, "pending-unlock");
  await director.destroy();
});

test("maps the engine entry-chime itself without conflating the external arrival", async () => {
  let state = createGameState({ seed: 91, now: 0 });
  state = runCommand(state, { type: "SKIP_PROFILE" }, { now: 1 }).state;
  state = runCommand(state, { type: "BROADCAST_BEFORE", planId: "room-talk" }, { now: 2 }).state;
  const live = runCommand(state, { type: "BROADCAST_LIVE" }, { now: 3 });
  const entryChime = live.events.find((event) => event.type === "entry-chime");
  const externalArrival = live.events.find((event) => event.type === "external-fictional-arrival");

  assert.ok(entryChime);
  assert.ok(externalArrival);
  const mapped = mapCurrentGameEventsToAudio(live.events, live.state);
  assert.deepEqual(mapped.find((event) => event.type === "ENTRY_CHIME"), {
    type: "ENTRY_CHIME",
    id: entryChime.id,
    audioKey: entryChime.audioKey,
    lineageId: live.state.lineageId,
  });
  assert.deepEqual(mapCurrentGameEventsToAudio([externalArrival], live.state), []);

  const director = createCurrentAudioDirector();
  const first = director.handle(mapped, live.state).find((record) => record.cueId === "S0_ENTRY_CHIME");
  assert.ok(first);
  assert.equal(first.suppressed, false);
  assert.equal(first.pending, true);
  await director.destroy();
});

test("maps a real preserved broadcast material and its breakpoint once each", async () => {
  let state = createGameState({ seed: 92, now: 0 });
  state = runCommand(state, { type: "SKIP_PROFILE" }, { now: 1 }).state;
  state = runCommand(state, { type: "BROADCAST_BEFORE", planId: "room-talk" }, { now: 2 }).state;
  state = runCommand(state, { type: "BROADCAST_LIVE" }, { now: 3 }).state;
  state = runCommand(state, { type: "BROADCAST_AFTER" }, { now: 4 }).state;
  const preserved = runCommand(state, { type: "PRESERVE_MOMENT" }, { now: 5 });
  const material = preserved.events.find((event) => event.type === "material-preserved");
  const breakpoint = preserved.events.find((event) => event.type === "breakpoint-reached");

  assert.ok(material);
  assert.ok(breakpoint);
  const mapped = mapCurrentGameEventsToAudio(preserved.events, preserved.state);
  assert.deepEqual(mapped, [
    { type: "MATERIAL_PRESERVED", id: material.id, lineageId: preserved.state.lineageId },
    { type: "BREAKPOINT_REACHED", id: breakpoint.id, lineageId: preserved.state.lineageId },
  ]);
  assert.equal(mapped.filter((event) => event.type === "MATERIAL_PRESERVED").length, 1);
  assert.equal(mapped.filter((event) => event.type === "BREAKPOINT_REACHED").length, 1);

  const director = createCurrentAudioDirector();
  const records = director.handle(mapped, preserved.state);
  const preserveRecord = records.find((record) => record.cueId === "S2_BROADCAST_PRESERVE");
  assert.ok(preserveRecord);
  assert.equal(preserveRecord.caption, "枠の場面を残した");
  assert.deepEqual(preserveRecord.durableHistory.visualSignal, {
    kind: "material-mark",
    glyph: "▤",
    label: "残した場面を履歴に記録",
    motion: "brief-static-mark",
  });
  assert.equal(records.filter((record) => record.cueId === "S2_BREAKPOINT").length, 1);
  await director.destroy();
});

test("maps every declared current-engine audio route to one registered cue", async () => {
  const lineageId = "audio-route-table";
  const engineEvents = CURRENT_ENGINE_AUDIO_ROUTES.map((route, index) => {
    const scaleCandidate = route.engineType === "scale-peak-candidate";
    return {
      type: route.engineType,
      id: scaleCandidate ? "SP1" : `audio-route-${index + 1}`,
      ...(route.engineType === "entry-chime" ? { audioKey: "entry-chime-canonical" } : {}),
      ...(scaleCandidate ? { peakId: "SP1" } : {}),
    };
  });
  const mapped = mapCurrentGameEventsToAudio(
    [...engineEvents, engineEvents[0]],
    { lineageId, meta: { firstArrivalChimeHeard: false } },
  );

  assert.equal(mapped.length, CURRENT_ENGINE_AUDIO_ROUTES.length);
  assert.deepEqual(
    mapped.map((event) => [event.type, event.id]),
    engineEvents.map((event, index) => [CURRENT_ENGINE_AUDIO_ROUTES[index].audioType, event.id]),
  );
  assert.equal(new Set(mapped.map((event) => `${event.type}:${event.id}`)).size, mapped.length);
  assert.equal(mapped.find((event) => event.type === "ENTRY_CHIME")?.audioKey, "entry-chime-canonical");
  assert.equal(mapped.find((event) => event.type === "SCALE_PEAK_CANDIDATE")?.peakId, "SP1");
  assert.equal(mapped.find((event) => event.type === "OFFLINE_SUMMARY")?.fromBackground, true);

  const director = createCurrentAudioDirector();
  const records = director.handle(mapped, { lineageId, meta: { firstArrivalChimeHeard: false } });
  assert.deepEqual(
    records.map((record) => record.cueId),
    engineEvents.map((event, index) => expectedCueId(CURRENT_ENGINE_AUDIO_ROUTES[index], event)),
  );
  assert.equal(records.length, mapped.length);
  await director.destroy();
});

test("real engine history reaches each declared cue once without synthesizing aliases", async () => {
  let state = simulateJourney({ seed: 71, maximumCycles: 64 }).state;
  const journeyEvents = [...state.history];
  const personId = state.people.firstExternalArrivalId;
  const away = runCommand(state, { type: "MARK_ABSENT", personId }, { now: state.clock.now + 1 });
  state = away.state;
  const returned = runCommand(state, { type: "WELCOME_BACK", personId }, { now: state.clock.now + 2 });
  state = returned.state;
  const prestige = runCommand(state, { type: "PRESTIGE" }, { now: state.clock.now + 3 });
  state = prestige.state;
  const offline = advanceGame(state, 120, {
    offline: true,
    offlineCapSeconds: 120,
    now: state.clock.now + 121,
  });
  state = offline.state;

  const engineEvents = [...journeyEvents, ...away.events, ...returned.events, ...prestige.events, ...offline.events];
  const routableEvents = engineEvents.filter((event) => currentEngineAudioRouteByType.has(event.type));
  assert.deepEqual(
    [...new Set(routableEvents.map((event) => event.type))].sort(),
    [...currentEngineAudioRouteByType.keys()].sort(),
  );

  const mapped = mapCurrentGameEventsToAudio(engineEvents, state);
  assert.equal(mapped.length, routableEvents.length);
  assert.deepEqual(
    mapped.map((event) => [event.type, event.id]),
    routableEvents.map((event) => [currentEngineAudioRouteByType.get(event.type).audioType, event.id]),
  );
  assert.equal(new Set(mapped.map((event) => `${event.type}:${event.id}`)).size, mapped.length);

  const director = createCurrentAudioDirector();
  const records = director.handle(mapped, state);
  assert.deepEqual(
    records.map((record) => record.cueId),
    routableEvents.map((event) => expectedCueId(currentEngineAudioRouteByType.get(event.type), event)),
  );
  await director.destroy();

  const externalArrival = journeyEvents.find((event) => event.type === "external-fictional-arrival");
  assert.ok(externalArrival);
  assert.deepEqual(mapCurrentGameEventsToAudio([
    externalArrival,
    { type: "first-external-arrival", id: "not-an-engine-event" },
    { type: "activity-publish", id: "not-an-engine-event" },
    { type: "prestige-confirm", id: "not-an-engine-event" },
    { type: "prestige-after", id: "not-an-engine-event" },
    { type: "main-completion", id: "not-an-engine-event" },
    { type: "resume-state", id: "not-an-engine-event" },
  ], state), []);
});

test("retains the first chime while sound is disabled and plays it after sound is enabled", async () => {
  await withFakeBrowserAudio(async ({ starts }) => {
    const director = createCurrentAudioDirector({ settings: { sound: false } });
    const { event, state } = firstEntryEvent("lineage-002:e1");
    const first = director.handle(event, state)[0];
    assert.equal(first.suppressed, false);
    assert.equal(first.pending, true);
    assert.equal(first.playback, "pending-muted");

    await director.unlock();
    await flushAudioTasks();
    assert.equal(starts(), 0);

    director.setSettings({ sound: true });
    await flushAudioTasks();
    assert.equal(starts(), 1);
    assert.equal(first.pending, false);
    assert.equal(first.playback, "played");

    const duplicate = director.handle(event, state)[0];
    assert.equal(duplicate.suppressed, true);
    assert.equal(duplicate.reason, "duplicate-event");
    await director.destroy();
  });
});

test("keeps a locked first chime pending until unlock and then plays it once", async () => {
  await withFakeBrowserAudio(async ({ starts }) => {
    const director = createCurrentAudioDirector();
    const { event, state } = firstEntryEvent("lineage-003:e1");
    const first = director.handle(event, state)[0];
    assert.equal(first.suppressed, false);
    assert.equal(first.pending, true);
    assert.equal(first.playback, "pending-unlock");
    assert.equal(starts(), 0);

    await director.unlock();
    await flushAudioTasks();
    assert.equal(starts(), 1);
    assert.equal(first.pending, false);
    assert.equal(first.playback, "played");
    await director.destroy();
  });
});

test("suppresses duplicate entry playback only after the first attempt starts successfully", async () => {
  await withFakeBrowserAudio(async ({ starts }) => {
    const director = createCurrentAudioDirector();
    await director.unlock();
    await flushAudioTasks();
    const { event, state } = firstEntryEvent("lineage-004:e1");
    const first = director.handle(event, state)[0];
    assert.equal(first.suppressed, false);
    assert.equal(first.playback, "scheduled");

    await flushAudioTasks();
    assert.equal(starts(), 1);
    const duplicate = director.handle(event, state)[0];
    assert.equal(duplicate.suppressed, true);
    assert.equal(duplicate.reason, "duplicate-event");
    await director.destroy();
  });
});

test("replays an emitted-but-unheard entry after reload and acknowledges only successful playback", async () => {
  await withFakeBrowserAudio(async ({ starts }) => {
    const callbackObservations = [];
    const director = createCurrentAudioDirector({
      onEntryPlayback(record) {
        callbackObservations.push({ starts: starts(), playback: record.playback, eventId: record.eventId });
        throw new Error("ack failure must not break playback");
      },
    });
    await director.unlock();
    await flushAudioTasks();

    const { event, state } = firstEntryEvent("lineage-005:e1");
    state.meta.firstArrivalChimeHeard = false;
    state.recentEvents = [];
    state.history = [{
      type: "entry-chime",
      id: event.id,
      audioKey: event.audioKey,
    }];
    const pendingReload = director.handle(event, state)[0];
    assert.equal(pendingReload.suppressed, false);
    assert.equal(pendingReload.playback, "scheduled");

    await flushAudioTasks();
    assert.equal(starts(), 1);
    assert.equal(pendingReload.playback, "played");
    assert.equal(pendingReload.pending, false);
    assert.deepEqual(callbackObservations, [{
      starts: 1,
      playback: "played",
      eventId: event.id,
    }]);

    const duplicate = director.handle(event, state)[0];
    assert.equal(duplicate.suppressed, true);
    assert.equal(duplicate.reason, "duplicate-event");
    assert.equal(callbackObservations.length, 1);
    await director.destroy();

    const heardDirector = createCurrentAudioDirector();
    const heardState = {
      ...state,
      meta: {
        firstArrivalChimePlayed: true,
        firstArrivalChimeHeard: true,
      },
    };
    const heard = heardDirector.handle(event, heardState)[0];
    assert.equal(heard.suppressed, true);
    assert.equal(heard.reason, "already-recorded-in-lineage");
    await heardDirector.destroy();

    const persistedLineageDirector = createCurrentAudioDirector({
      playedEntryLineages: [event.lineageId],
    });
    const persisted = persistedLineageDirector.handle(event, state)[0];
    assert.equal(persisted.suppressed, true);
    assert.equal(persisted.reason, "duplicate-lineage");
    await persistedLineageDirector.destroy();
  });
});

test("PWA identity and shell paths contain only the current product foundation", async () => {
  const [manifest, index, serviceWorker] = await Promise.all([
    readFile(path.join(root, "public", "manifest.webmanifest"), "utf8"),
    readFile(path.join(root, "index.html"), "utf8"),
    readFile(path.join(root, "public", "sw.js"), "utf8"),
  ]);
  const legacyIdentity = /(?:yani|ヤニ切れ|combat|\bRUN\b)/i;

  for (const [name, source] of [["manifest", manifest], ["index", index], ["service worker", serviceWorker]]) {
    assert.doesNotMatch(source, legacyIdentity, name + " contains retired product identity");
  }
  assert.match(manifest, /八乙女さきや 活動者育成インクリメンタル/);
  assert.match(index, /八乙女さきや 活動者育成インクリメンタル/);
  assert.match(serviceWorker, /sakiya-creator-incremental-v3-8bit/);
  assert.match(serviceWorker, /"\/manifest\.webmanifest"/);
  assert.match(serviceWorker, /"\/assets\/current\/entry-chime\.wav"/);
  assert.match(serviceWorker, /"\/assets\/current\/activity-home-8bit-coarse-v3\.png"/);
  assert.match(manifest, /"\/icon-8bit-192\.png"/);
  assert.match(manifest, /"\/icon-8bit-512\.png"/);
});
