import assert from "node:assert/strict";
import test from "node:test";
import {
  ACTIVITY_DEFINITIONS,
  BREAKPOINTS,
  COMPLETION_CANDIDATE,
  P0_TEST_DEPENDENT_TUNING,
  SCALE_PEAKS,
  UNIT_LABELS,
} from "../src/game/current-content.js";
import {
  CURRENT_SCHEMA,
  OFFLINE_CAP_SECONDS,
  advanceGame,
  completionRequirementsSatisfied,
  createGameState,
  getCompletionActivityContributions,
  getCompletionCandidateData,
  getProgressSummary,
  runCommand,
  simulateJourney,
  simulateP0,
} from "../src/game/current-engine.js";
import {
  CURRENT_SAVE_KEY,
  deserializeCurrentSave,
  exportCurrentSave,
  importCurrentSave,
  listCurrentSaveSlots,
  loadCurrentBackup,
  loadCurrentSave,
  normalizeCurrentSave,
  previewCurrentImport,
  resetCurrentSave,
  serializeCurrentSave,
  writeCurrentSave,
  writeCurrentSaveSlot,
} from "../src/game/current-save.js";

function issue(state, command, now) {
  return runCommand(state, command, { now }).state;
}

function issueWithEvents(state, command, now) {
  return runCommand(state, command, { now });
}

function firstBroadcast(state, at = 1) {
  let next = issue(state, { type: "SKIP_PROFILE" }, at);
  next = issue(next, { type: "BROADCAST_BEFORE", planId: "room-talk" }, at + 1);
  return issueWithEvents(next, { type: "BROADCAST_LIVE" }, at + 2);
}

function firstVideoLoop(seed = 44) {
  let state = createGameState({ seed, now: 0 });
  ({ state } = firstBroadcast(state));
  state = issue(state, { type: "BROADCAST_AFTER" }, 4);
  state = issue(state, { type: "PRESERVE_MOMENT", title: "最初の見どころ" }, 5);
  state = issue(state, { type: "CREATE_VIDEO", title: "残した動画" }, 6);
  return state;
}

test("current content exposes the fixed 24+10 structure and U0–U10", () => {
  assert.equal(BREAKPOINTS.length, 24);
  assert.equal(SCALE_PEAKS.length, 10);
  assert.deepEqual(Object.keys(UNIT_LABELS), Array.from({ length: 11 }, (_, index) => `U${index}`));
  assert.equal(new Set(Object.values(ACTIVITY_DEFINITIONS).map((activity) => activity.command)).size, 6);
  assert.ok(BREAKPOINTS.slice(3).every((breakpoint) => breakpoint.metadata.internalOnly));
  assert.ok(SCALE_PEAKS.every((peak) => peak.metadata.internalOnly));
});

test("first Broadcast and first external fictional arrival are deterministic and immutable", () => {
  const initial = createGameState({ seed: 991, now: 0 });
  const before = structuredClone(initial);
  const a = firstBroadcast(initial);
  const b = firstBroadcast(initial);

  assert.deepEqual(initial, before, "commands never mutate their input state");
  assert.deepEqual(a.events, b.events);
  assert.equal(a.state.phase.kind, "broadcast-live");
  assert.equal(a.state.people.known.length, 1);
  assert.equal(a.state.people.known[0].fictional, true);
  assert.ok(a.events.some((event) => event.type === "external-fictional-arrival"));
  assert.equal(a.events.filter((event) => event.type === "entry-chime").length, 1);
  assert.equal(a.state.meta.firstArrivalChimeHeard, false);
});

test("the ENTRY CHIME is semantic and exactly once for a save lineage", () => {
  let state = createGameState({ seed: 12 });
  const first = firstBroadcast(state);
  state = first.state;
  state = issue(state, { type: "BROADCAST_AFTER" }, 4);
  state = issue(state, { type: "PRESERVE_MOMENT" }, 5);
  state = issue(state, { type: "BROADCAST_BEFORE" }, 6);
  const second = issueWithEvents(state, { type: "BROADCAST_LIVE" }, 7);

  assert.equal(first.events.filter((event) => event.type === "entry-chime").length, 1);
  assert.equal(second.events.filter((event) => event.type === "entry-chime").length, 0);
  assert.equal(second.state.history.filter((event) => event.type === "entry-chime").length, 1);
  assert.equal(second.state.meta.firstArrivalChimePlayed, true);
});

test("entry chime playback acknowledgement records actual-start success once and survives Strong New Game", () => {
  let state = firstBroadcast(createGameState({ seed: 49 })).state;
  const beforeArrival = issueWithEvents(issue(createGameState({ seed: 50 }), { type: "SKIP_PROFILE" }, 1), { type: "ACK_ENTRY_CHIME_PLAYED" }, 2);
  assert.equal(beforeArrival.events.at(-1)?.type, "command-blocked");
  assert.equal(beforeArrival.state.meta.firstArrivalChimeHeard, false);

  const acknowledged = issueWithEvents(state, { type: "ACK_ENTRY_CHIME_PLAYED" }, 3);
  state = acknowledged.state;
  assert.equal(state.meta.firstArrivalChimePlayed, true);
  assert.equal(state.meta.firstArrivalChimeHeard, true);
  assert.equal(acknowledged.events.filter((event) => event.type === "entry-chime-playback-confirmed").length, 1);

  const repeated = issueWithEvents(state, { type: "ACK_ENTRY_CHIME_PLAYED" }, 4);
  assert.equal(repeated.state.meta.firstArrivalChimeHeard, true);
  assert.equal(repeated.events.length, 0, "a resumed audio callback is idempotent");

  let completed = simulateJourney({ seed: 49, maximumCycles: 64 }).state;
  completed = issue(completed, { type: "ACK_ENTRY_CHIME_PLAYED" }, completed.clock.now + 1);
  completed = issue(completed, { type: "STRONG_NEW_GAME" }, completed.clock.now + 2);
  assert.equal(completed.meta.firstArrivalChimeHeard, true);
  assert.equal(completed.meta.firstArrivalChimePlayed, true);
});

test("Before/LIVE/After then preservation and Video changes the next Broadcast", () => {
  let state = firstVideoLoop();
  assert.equal(state.phase.kind, "room");
  assert.equal(state.works.filter((work) => work.type === "material").length, 1);
  assert.equal(state.works.filter((work) => work.type === "video").length, 1);

  state = issue(state, { type: "BROADCAST_BEFORE", planId: "video-return" }, 10);
  const result = issueWithEvents(state, { type: "BROADCAST_LIVE" }, 11);
  assert.ok(result.events.some((event) => event.type === "video-context-returned"));
  assert.equal(result.state.progression.videoReturnObserved, true);
  assert.ok(result.state.receipts.breakpoints.some((receipt) => receipt.id === "BP3"));
});

test("six activities retain distinct commands, outputs, and limiter state", () => {
  const journey = simulateJourney({ seed: 30, maximumCycles: 64 }).state;
  const definitions = Object.values(ACTIVITY_DEFINITIONS);
  assert.equal(definitions.length, 6);
  assert.equal(new Set(definitions.map((activity) => activity.command)).size, 6);
  assert.equal(new Set(definitions.map((activity) => activity.output)).size, 6);
  assert.equal(new Set(definitions.map((activity) => activity.limiter)).size, 6);
  for (const activity of definitions) {
    const runtime = journey.activities[activity.id];
    assert.ok(runtime.totalActions > 0, `${activity.id} was used by the journey`);
    assert.equal(runtime.limiter.label, activity.limiter);
  }
  assert.ok(journey.works.some((work) => work.type === "video"));
  assert.ok(journey.works.some((work) => work.type === "music"));
  assert.ok(journey.history.some((event) => event.type === "sns-posted"));
  assert.ok(journey.history.some((event) => event.type === "live-event-hosted"));
});

test("activity bridges require unlocked ends and an explicit, provenance-matching source work", () => {
  let state = firstVideoLoop(61);
  const material = state.works.find((work) => work.type === "material");
  const video = state.works.find((work) => work.type === "video");
  assert.ok(material);
  assert.ok(video);
  assert.equal(state.activities.video.unlocked, true);
  assert.equal(state.activities.liveEvent.unlocked, false);

  const lockedTarget = issueWithEvents(state, { type: "CREATE_BRIDGE", from: "broadcast", to: "liveEvent", sourceWorkId: material.id }, 20);
  assert.equal(lockedTarget.events.at(-1)?.reason, "bridge-target-activity-locked");
  const lockedSource = issueWithEvents(state, { type: "CREATE_BRIDGE", from: "music", to: "video", sourceWorkId: material.id }, 21);
  assert.equal(lockedSource.events.at(-1)?.reason, "bridge-source-activity-locked");
  const missingSource = issueWithEvents(state, { type: "CREATE_BRIDGE", from: "broadcast", to: "video" }, 22);
  assert.equal(missingSource.events.at(-1)?.reason, "bridge-source-work-required");
  const unknownSource = issueWithEvents(state, { type: "CREATE_BRIDGE", from: "broadcast", to: "video", sourceWorkId: "missing-work" }, 23);
  assert.equal(unknownSource.events.at(-1)?.reason, "bridge-source-work-unknown");
  const mismatchedSource = issueWithEvents(state, { type: "CREATE_BRIDGE", from: "broadcast", to: "video", sourceWorkId: video.id }, 24);
  assert.equal(mismatchedSource.events.at(-1)?.reason, "bridge-source-provenance-mismatch");

  state = issue(state, { type: "CREATE_BRIDGE", from: "broadcast", to: "video", sourceWorkId: material.id }, 25);
  assert.equal(state.bridges.routes.length, 1);
  assert.equal(state.bridges.routes[0].sourceWorkId, material.id);
  assert.equal(state.bridges.routes[0].from, "broadcast");
  assert.equal(state.bridges.routes[0].to, "video");
});

test("journey simulation earns all BP/SP receipts and semantically retires each old unit", () => {
  const { state, complete } = simulateJourney({ seed: 17, maximumCycles: 64 });
  assert.equal(complete, true);
  assert.equal(state.receipts.breakpoints.length, 24);
  assert.equal(state.receipts.scalePeaks.length, 10);
  assert.equal(state.resources.retiredUnits.length, 10);
  assert.deepEqual(state.receipts.breakpoints.map((receipt) => receipt.id), BREAKPOINTS.map((breakpoint) => breakpoint.id));
  assert.deepEqual(state.receipts.scalePeaks.map((receipt) => receipt.id), SCALE_PEAKS.map((peak) => peak.id));
  assert.ok(state.resources.retiredUnits.every((retirement) => retirement.liveProductionStopped && retirement.retired));
  assert.equal(state.resources.retiredUnits.at(-1).retiredUnit, "U9");
  assert.equal(state.progression.currentUnit, "U10");
  assert.equal(state.resources.currentUnit.id, "U10");
  assert.equal(state.resources.unitValues.U9, state.resources.retiredUnits.at(-1).finalValue);
});

test("the full simulated completion route is zero-gift and never has a wait-only state", () => {
  const journey = simulateJourney({ seed: 71, maximumCycles: 64 });
  assert.equal(journey.complete, true);
  assert.equal(journey.zeroGift, true);
  assert.equal(journey.state.resources.gifts, 0);
  assert.equal(journey.noWait, true);
  assert.ok(journey.trace.length > 0);
  assert.ok(journey.trace.every((entry) => entry.availableActions.length > 0));
  assert.equal(getProgressSummary(journey.state).completionCandidate, true);
});

test("the bounded completion candidate requires an Anchor Broadcast and explicit final choice before its receipt", () => {
  let state = simulateJourney({ seed: 72, maximumCycles: 64, recordCompletionCandidate: false }).state;
  assert.equal(state.progression.completionEligible, true);
  assert.equal(state.progression.completionCandidate, false);
  assert.equal(getCompletionCandidateData(state).stage, "anchor-required");
  assert.ok(getProgressSummary(state).activeActions.includes("FINAL_ANCHOR_BROADCAST"));

  const missingAnchor = issueWithEvents(state, { type: "COMPLETION_CANDIDATE" }, state.clock.now + 1);
  assert.equal(missingAnchor.events.at(-1)?.reason, "final-anchor-broadcast-required");

  state = issue(state, { type: "FINAL_ANCHOR_BROADCAST" }, state.clock.now + 2);
  assert.equal(state.phase.kind, "broadcast-before");
  assert.equal(state.phase.planId, COMPLETION_CANDIDATE.anchorPlanId);
  state = issue(state, { type: "BROADCAST_LIVE" }, state.clock.now + 3);
  state = issue(state, { type: "BROADCAST_AFTER" }, state.clock.now + 4);
  const anchor = issueWithEvents(state, { type: "PRESERVE_MOMENT" }, state.clock.now + 5);
  state = anchor.state;
  assert.ok(anchor.events.some((event) => event.type === "final-anchor-broadcast-recorded"));
  assert.equal(getCompletionCandidateData(state).stage, "choice-required");
  assert.ok(getProgressSummary(state).activeActions.includes("RECORD_COMPLETION_CHOICE"));

  const missingChoice = issueWithEvents(state, { type: "COMPLETION_CANDIDATE" }, state.clock.now + 6);
  assert.equal(missingChoice.events.at(-1)?.reason, "completion-choice-required");
  const invalidChoice = issueWithEvents(state, { type: "RECORD_COMPLETION_CHOICE", choiceId: "not-a-choice" }, state.clock.now + 7);
  assert.equal(invalidChoice.events.at(-1)?.reason, "completion-choice-required");

  state = issue(state, { type: "RECORD_COMPLETION_CHOICE", choiceId: "carry-room-record" }, state.clock.now + 8);
  assert.equal(getCompletionCandidateData(state).stage, "receipt-ready");
  const final = issueWithEvents(state, { type: "COMPLETION_CANDIDATE" }, state.clock.now + 9);
  state = final.state;
  const completion = getCompletionCandidateData(state);
  assert.equal(state.phase.kind, "completion");
  assert.equal(completion.stage, "recorded");
  assert.equal(completion.status, "working-hypothesis");
  assert.equal(completion.ownerGate, "ODG-08");
  assert.equal(completion.ownerAccepted, false);
  assert.equal(completion.publicReleasePerformed, false);
  assert.equal(completion.choice?.id, "carry-room-record");
  assert.equal(completion.choices.length, COMPLETION_CANDIDATE.choices.length);
  assert.equal(completion.credits.length, COMPLETION_CANDIDATE.credits.length);
  assert.ok(completion.provenance.some((entry) => entry.status === "owner-decision-needed"));
  const contributionOrder = [
    "broadcast",
    "video",
    "singing",
    "music",
    "sns",
    "liveEvent",
  ];
  assert.deepEqual(
    completion.anchor?.activityContributions?.map((entry) => entry.activity),
    contributionOrder,
  );
  const anchorWork = state.works.find(
    (work) => work.id === completion.anchor?.workId,
  );
  assert.deepEqual(
    anchorWork?.provenance?.activityContributions,
    completion.anchor?.activityContributions,
  );
  const runtimeBasis = completion.receipt?.provenance?.find(
    (entry) => entry.id === "runtime-completion-basis",
  );
  assert.deepEqual(
    runtimeBasis?.activityContributions,
    completion.anchor?.activityContributions,
  );
  assert.deepEqual(
    runtimeBasis?.activityContributionIds?.map((entry) => entry.activity),
    contributionOrder,
  );
  assert.equal(final.events.some((event) => event.type === "entry-chime"), false, "completion never fabricates a later arrival/chime");
});

test("completion requires retained provenance-bearing contributions from all six activities", () => {
  const eligible = simulateJourney({
    seed: 732,
    maximumCycles: 64,
    recordCompletionCandidate: false,
  }).state;
  assert.equal(completionRequirementsSatisfied(eligible), true);
  assert.deepEqual(getCompletionActivityContributions(eligible), {
    broadcast: true,
    video: true,
    singing: true,
    music: true,
    sns: true,
    liveEvent: true,
  });

  const missingSnsRecord = structuredClone(eligible);
  missingSnsRecord.history = missingSnsRecord.history.filter(
    (event) => event.type !== "sns-posted",
  );
  const blocked = issueWithEvents(
    missingSnsRecord,
    { type: "FINAL_ANCHOR_BROADCAST" },
    missingSnsRecord.clock.now + 1,
  );
  assert.equal(completionRequirementsSatisfied(blocked.state), false);
  assert.equal(blocked.events.at(-1)?.reason, "full-u10-journey-required");
  assert.equal(blocked.state.phase.kind, "room");
});

test("Prestige, Scale, Continue, and Strong New Game preserve room, people, works, history, and receipts", () => {
  let state = simulateJourney({ seed: 88, maximumCycles: 64 }).state;
  const people = structuredClone(state.people);
  const works = structuredClone(state.works);
  const historyLength = state.history.length;
  const scaleReceipts = state.receipts.scalePeaks.length;
  const chimeLineageFlag = state.meta.firstArrivalChimePlayed;

  state = issue(state, { type: "PRESTIGE" }, state.clock.now + 1);
  assert.deepEqual(state.people, people);
  assert.deepEqual(state.works, works);
  assert.ok(state.history.length > historyLength);
  assert.equal(state.receipts.scalePeaks.length, scaleReceipts);

  state = issue(state, { type: "CONTINUE" }, state.clock.now + 1);
  assert.equal(state.phase.kind, "room");
  state = issue(state, { type: "STRONG_NEW_GAME" }, state.clock.now + 2);
  assert.equal(state.progression.currentUnit, "U0");
  assert.equal(state.progression.journeyNumber, 2);
  assert.deepEqual(state.people, people);
  assert.deepEqual(state.works, works);
  assert.equal(state.receipts.scalePeaks.length, scaleReceipts);
  assert.equal(state.meta.firstArrivalChimePlayed, chimeLineageFlag);
  assert.equal(state.phase.kind, "room");
});

test("offline advancement is capped and cannot complete named-person events or fire a chime", () => {
  const state = firstVideoLoop(51);
  const knownPeople = structuredClone(state.people);
  const chimeCount = state.history.filter((event) => event.type === "entry-chime").length;
  const result = advanceGame(state, OFFLINE_CAP_SECONDS * 100, {
    offline: true,
    offlineCapSeconds: 120,
    now: 5_000,
  });
  const summary = result.events.find((event) => event.type === "offline-summary");

  assert.equal(summary.appliedSeconds, 120);
  assert.equal(summary.capped, true);
  assert.equal(summary.namedPersonEventsDeferred, true);
  assert.equal(summary.entryChimeFired, false);
  assert.deepEqual(result.state.people, knownPeople);
  assert.equal(result.events.some((event) => event.type === "entry-chime"), false);
  assert.equal(result.state.history.filter((event) => event.type === "entry-chime").length, chimeCount);
  assert.ok(result.state.resources.videoReach > state.resources.videoReach);
});

test("current saves are bounded, use a new namespace, preserve backups/slots, and round-trip export", () => {
  assert.equal(CURRENT_SCHEMA, 1);
  assert.ok(!CURRENT_SAVE_KEY.includes("yani"));
  const malformed = normalizeCurrentSave({
    schema: CURRENT_SCHEMA,
    lineageId: "x".repeat(999),
    resources: {
      currentUnit: { id: "not-a-unit", value: Number.POSITIVE_INFINITY, liveRate: -9 },
      gifts: -500,
      materials: 999_999,
      session: { atmosphere: Number.NaN },
    },
    progression: { breakpointIndex: 999, scaleIndex: -9, currentUnit: "oops", journeyNumber: -4 },
    people: { known: [{ id: "not-real", displayName: "drop me" }] },
    settings: { fontScale: 999, numberNotation: "bad" },
  });
  assert.equal(malformed.progression.breakpointIndex, 24);
  assert.equal(malformed.progression.scaleIndex, 0);
  assert.equal(malformed.resources.currentUnit.id, "U0");
  assert.equal(malformed.resources.currentUnit.value, 0);
  assert.equal(malformed.resources.gifts, 0);
  assert.equal(malformed.resources.materials, 240);
  assert.equal(malformed.people.known.length, 0);
  assert.equal(malformed.settings.fontScale, 1);

  const storage = new Map();
  const adapter = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  };
  const source = firstVideoLoop(103);
  const exported = exportCurrentSave(source, { now: 1234 });
  const restored = deserializeCurrentSave(exported);
  assert.ok(restored);
  assert.equal(restored.lineageId, source.lineageId);
  assert.equal(restored.works.length, source.works.length);
  assert.equal(previewCurrentImport(exported).ok, true);
  assert.equal(previewCurrentImport("{oops").ok, false);
  assert.equal(importCurrentSave(exported, adapter).committed, true);
  writeCurrentSave({ ...restored, resources: { ...restored.resources, gifts: 9 } }, adapter);
  assert.equal(loadCurrentSave(adapter).resources.gifts, 9);
  assert.equal(loadCurrentBackup(adapter).resources.gifts, 0);
  writeCurrentSaveSlot(restored, 2, adapter);
  assert.equal(listCurrentSaveSlots(adapter)[2].occupied, true);
  const failedStorage = {
    getItem: () => {
      throw new Error("storage unavailable");
    },
    setItem: () => {
      throw new Error("storage unavailable");
    },
    removeItem: () => {
      throw new Error("storage unavailable");
    },
  };
  writeCurrentSave(restored, failedStorage);
  assert.equal(loadCurrentSave(failedStorage).lineageId, restored.lineageId);
  assert.equal(resetCurrentSave(adapter).schema, CURRENT_SCHEMA);
  assert.equal(listCurrentSaveSlots(adapter).every((slot) => !slot.occupied), true);
  assert.equal(deserializeCurrentSave(serializeCurrentSave(source)).schema, CURRENT_SCHEMA);
});

test("P0 comparison harness runs a deterministic, test-dependent A×B×C matrix with distinct A/B/C outcomes", () => {
  const first = simulateP0({ seeds: [1, 2] });
  const second = simulateP0({ seeds: [1, 2] });
  assert.equal(first.count, 27);
  assert.equal(first.configurations.length, 27);
  assert.deepEqual(first, second);
  assert.equal(first.comparison.status, "test-dependent");
  assert.equal(first.comparison.fixtureId, P0_TEST_DEPENDENT_TUNING.id);
  assert.equal(first.comparison.fixedMatrix, "A1-A3 × B1-B3 × C1-C3");
  assert.equal(new Set(first.configurations.map((configuration) => configuration.id)).size, 27);
  assert.ok(first.configurations.every((configuration) => configuration.runs.length === 2));
  assert.ok(first.configurations.every((configuration) => configuration.runs.every((run) => run.firstArrival)));
  assert.ok(first.configurations.every((configuration) => configuration.runs.every((run) => run.videoReturnObserved)));
  assert.ok(first.configurations.every((configuration) => configuration.runs.every((run) => run.scalePeakCount === 0)));
  assert.ok(first.configurations.every((configuration) => configuration.runs.every((run) => run.gifts === 0)));
  assert.ok(first.configurations.every((configuration) => configuration.runs.every((run) => run.zeroGift && run.noWait)));
  assert.ok(first.configurations.every((configuration) => configuration.runs.every((run) => !run.sp1Fired && run.scaleDeferred)));
  assert.equal(
    new Set(first.configurations.map((configuration) => configuration.runs[0].signature)).size,
    27,
    "the comparison reports behavior signatures, not only configuration labels",
  );

  const a1 = first.byId["A1-B1-C1"].runs[0];
  const a2 = first.byId["A2-B1-C1"].runs[0];
  const a3 = first.byId["A3-B1-C1"].runs[0];
  assert.deepEqual(a1.liveParticipation, { silent: 0, reactions: 0, comments: 0 }, "A1 observes without LIVE input");
  assert.equal(a2.liveParticipation.reactions, P0_TEST_DEPENDENT_TUNING.harnessCycles);
  assert.equal(a3.liveParticipation.comments, P0_TEST_DEPENDENT_TUNING.harnessCycles);
  assert.equal(new Set([a1.signature, a2.signature, a3.signature]).size, 3);

  const b1 = first.byId["A1-B1-C1"].runs[0];
  const b2 = first.byId["A1-B2-C1"].runs[0];
  const b3 = first.byId["A1-B3-C1"].runs[0];
  assert.equal(b1.arrivalSupply.supplyModel, "constant");
  assert.equal(b2.arrivalSupply.supplyModel, "shared-recovering");
  assert.equal(b3.arrivalSupply.supplyModel, "interest-recovering");
  assert.ok(b2.arrivalSupply.consumed > 0);
  assert.ok(b2.arrivalSupply.recovered > 0, "B2 recovery is exercised through Asset Idle");
  assert.ok(Object.keys(b3.arrivalSupply.interestPools).length > 1);
  assert.equal(new Set([b1.signature, b2.signature, b3.signature]).size, 3);

  const c1 = first.byId["A1-B1-C1"].runs[0];
  const c2 = first.byId["A1-B1-C2"].runs[0];
  const c3 = first.byId["A1-B1-C3"].runs[0];
  assert.equal(c1.nestedProduction.nestingModel, "none");
  assert.equal(c2.nestedProduction.nestingModel, "shallow");
  assert.equal(c3.nestedProduction.nestingModel, "deep-constrained");
  assert.ok(c1.nestedProduction.directReach > 0);
  assert.ok(c2.nestedProduction.subscriberEvidence > 0);
  assert.ok(c3.nestedProduction.producerBoost > 0);
  assert.ok(c3.nestedProduction.producerBoost <= P0_TEST_DEPENDENT_TUNING.harnessCycles * P0_TEST_DEPENDENT_TUNING.limiter.maxDeepProducerBoostPerVideo);
  assert.equal(new Set([c1.signature, c2.signature, c3.signature]).size, 3);
});
