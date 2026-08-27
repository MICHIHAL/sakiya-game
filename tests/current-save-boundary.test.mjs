import assert from "node:assert/strict";
import test from "node:test";
import {
  CURRENT_SCHEMA,
  createGameState,
  runCommand,
  simulateJourney,
} from "../src/game/current-engine.js";
import {
  CURRENT_SAVE_BACKUP_KEY,
  CURRENT_SAVE_KEY,
  CURRENT_SAVE_RESET_SNAPSHOT_KEY,
  CURRENT_SAVE_SLOT_PREFIX,
  deserializeCurrentSave,
  exportCurrentSave,
  exportCurrentCorruptSave,
  importCurrentSave,
  listCurrentCorruptSaves,
  listCurrentSaveSlots,
  loadCurrentSaveWithStatus,
  loadCurrentSaveSlot,
  normalizeCurrentSave,
  previewCurrentImport,
  resetCurrentSaveWithStatus,
  restoreCurrentSaveSlotBackup,
  writeCurrentSaveSlotWithStatus,
  writeCurrentSaveWithStatus,
} from "../src/game/current-save.js";

function currentPayload(overrides = {}) {
  return { schema: CURRENT_SCHEMA, ...overrides };
}

function assertSafeCurrentPreview(candidate, label) {
  let preview;
  assert.doesNotThrow(() => {
    preview = previewCurrentImport(candidate);
  }, label);
  assert.equal(preview.ok, true, label);
  assert.equal(preview.state.schema, CURRENT_SCHEMA, label);
  assert.ok(
    preview.state.phase &&
      typeof preview.state.phase === "object" &&
      !Array.isArray(preview.state.phase),
    `${label}: phase object`,
  );
  assert.ok(
    preview.state.resources.currentUnit &&
      typeof preview.state.resources.currentUnit === "object",
    `${label}: current unit object`,
  );
  assert.ok(
    preview.state.resources.session &&
      typeof preview.state.resources.session === "object",
    `${label}: session object`,
  );
  assert.ok(
    preview.state.pending.preserve == null ||
      (typeof preview.state.pending.preserve === "object" &&
        !Array.isArray(preview.state.pending.preserve)),
    `${label}: pending preserve object`,
  );
  assert.doesNotThrow(
    () => JSON.stringify(preview.state),
    `${label}: serializable normalized state`,
  );
  return preview;
}

test("current-schema malformed phase values cannot escape preview or dry-run import", () => {
  const malformed = '{"schema":1,"phase":"no"}';
  const preview = assertSafeCurrentPreview(malformed, "string phase preview");
  assert.equal(preview.state.phase.kind, "profile");

  let imported;
  assert.doesNotThrow(() => {
    imported = importCurrentSave(malformed, undefined, { commit: false });
  }, "string phase dry-run import");
  assert.equal(imported.ok, true);
  assert.equal(imported.committed, false);
  assert.equal(imported.state.phase.kind, "profile");
});

test("current-schema nested malformed values normalize to bounded state shapes", () => {
  const malformedValues = [
    null,
    false,
    19,
    "not-an-object",
    [],
    ["nested"],
    {},
    { nested: ["wrong"] },
  ];
  const nestedRoots = [
    "clock",
    "profile",
    "progression",
    "resources",
    "activities",
    "people",
    "works",
    "bridges",
    "automation",
    "history",
    "receipts",
    "pending",
    "settings",
    "meta",
    "recentEvents",
  ];

  for (const root of nestedRoots) {
    for (const [index, malformed] of malformedValues.entries()) {
      assertSafeCurrentPreview(
        JSON.stringify(currentPayload({ [root]: malformed })),
        `${root} root shape ${index}`,
      );
    }
  }

  for (const [index, malformed] of malformedValues.entries()) {
    const candidate = currentPayload({
      phase: malformed,
      clock: {
        now: malformed,
        lastAdvancedAt: malformed,
        lastForegroundAt: malformed,
      },
      profile: {
        status: malformed,
        displayName: malformed,
        anonymous: malformed,
        createdAt: malformed,
      },
      progression: {
        mode: malformed,
        breakpointIndex: malformed,
        currentUnit: malformed,
      },
      resources: {
        currentUnit: malformed,
        unitValues: malformed,
        retiredUnits: malformed,
        session: malformed,
        materials: malformed,
      },
      activities: { broadcast: malformed, video: malformed },
      people: {
        known: malformed,
        firstExternalArrivalId: malformed,
        reversibleAbsences: malformed,
      },
      works: [{ type: "video", provenance: malformed, assetIdle: malformed }],
      bridges: { routes: malformed, completed: malformed },
      automation: { clip: malformed },
      history: malformed,
      receipts: {
        breakpoints: malformed,
        scalePeaks: malformed,
        prestige: malformed,
        completion: malformed,
      },
      pending: {
        preserve: malformed,
        namedPersonEvents: malformed,
        offlineEvidence: malformed,
      },
      settings: { fontScale: malformed, numberNotation: malformed },
      meta: { rng: malformed, firsts: malformed },
      recentEvents: malformed,
    });
    const preview = assertSafeCurrentPreview(
      JSON.stringify(candidate),
      `malformed shape ${index}`,
    );
    assert.equal(
      preview.state.pending.preserve,
      null,
      `malformed shape ${index}: preserve reset`,
    );
    assert.equal(
      preview.state.works.length,
      1,
      `malformed shape ${index}: work kept`,
    );
    assert.ok(
      preview.state.works[0].provenance &&
        typeof preview.state.works[0].provenance === "object" &&
        !Array.isArray(preview.state.works[0].provenance),
      `malformed shape ${index}: provenance object`,
    );
  }
});

test("normalization drops dangerous prototype keys from loose retained records", () => {
  const dangerous =
    '{"schema":1,"phase":{"kind":"room","__proto__":{"polluted":true},"constructor":{"polluted":true},"prototype":{"polluted":true}},"works":[{"type":"video","provenance":{"__proto__":{"polluted":true},"constructor":{"polluted":true},"prototype":{"polluted":true}}}],"history":[{"__proto__":{"polluted":true},"constructor":{"polluted":true},"prototype":{"polluted":true},"type":"safe"}]}';
  const preview = assertSafeCurrentPreview(dangerous, "prototype keys");

  assert.equal(Object.prototype.polluted, undefined);
  assert.equal(
    Object.hasOwn(preview.state.works[0].provenance, "__proto__"),
    false,
  );
  assert.equal(
    Object.hasOwn(preview.state.works[0].provenance, "constructor"),
    false,
  );
  assert.equal(Object.hasOwn(preview.state.history[0], "prototype"), false);
});

test("valid current saves round-trip while legacy and oversized imports remain rejected", () => {
  let source = createGameState({
    seed: 207,
    now: 10,
    profile: { displayName: "テスト" },
  });
  source = runCommand(
    source,
    { type: "BROADCAST_BEFORE", planId: "room-talk" },
    { now: 11 },
  ).state;
  source = runCommand(source, { type: "BROADCAST_LIVE" }, { now: 12 }).state;

  const exported = exportCurrentSave(source, { now: 99 });
  const preview = previewCurrentImport(exported);
  const restored = deserializeCurrentSave(exported);
  assert.equal(preview.ok, true);
  assert.deepEqual(restored, normalizeCurrentSave(source));
  assert.equal(restored.lineageId, source.lineageId);
  assert.equal(restored.people.known[0].id, source.people.known[0].id);
  assert.equal(preview.state.phase.kind, "broadcast-live");
  assert.equal(preview.state.phase.id, source.phase.id);

  const oversized = previewCurrentImport("x".repeat(2_000_001));
  assert.deepEqual(oversized.errors, ["import-too-large"]);
  assert.equal(oversized.ok, false);

  const legacy = JSON.stringify({ schema: 3, followers: 999, memories: 999 });
  assert.equal(previewCurrentImport(legacy).ok, false);
  assert.equal(deserializeCurrentSave(legacy), null);
});

function storageAdapter(map = new Map()) {
  return {
    map,
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => map.set(key, value),
    removeItem: (key) => map.delete(key),
  };
}

test("occupied slot overwrite creates a recoverable prior-slot backup", () => {
  const storage = storageAdapter();
  const first = createGameState({
    seed: 301,
    now: 10,
    profile: { displayName: "first" },
  });
  const second = {
    ...first,
    progression: { ...first.progression, journeyNumber: 2 },
    resources: { ...first.resources, gifts: 7 },
  };

  const initial = writeCurrentSaveSlotWithStatus(first, 0, storage, {
    now: 11,
  });
  assert.equal(initial.persisted, true);
  assert.equal(initial.backupAttempted, false);

  const overwrite = writeCurrentSaveSlotWithStatus(second, 0, storage, {
    now: 12,
  });
  assert.equal(overwrite.persisted, true);
  assert.equal(overwrite.backupPersisted, true);
  assert.equal(overwrite.recoverySafe, true);
  assert.equal(listCurrentSaveSlots(storage)[0].backupAvailable, true);
  assert.equal(loadCurrentSaveSlot(0, storage).progression.journeyNumber, 2);

  const restored = restoreCurrentSaveSlotBackup(0, storage, { now: 13 });
  assert.equal(restored.ok, true);
  assert.equal(restored.persisted, true);
  assert.equal(restored.recoverySafe, true);
  assert.equal(loadCurrentSaveSlot(0, storage).progression.journeyNumber, 1);

  const redone = restoreCurrentSaveSlotBackup(0, storage, { now: 14 });
  assert.equal(redone.ok, true);
  assert.equal(loadCurrentSaveSlot(0, storage).resources.gifts, 7);
});

test("durable storage failures are reported instead of being presented as saved", () => {
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
  const state = createGameState({
    seed: 401,
    now: 10,
    profile: { displayName: "session-only" },
  });

  const primary = writeCurrentSaveWithStatus(state, failedStorage, { now: 11 });
  assert.equal(primary.persisted, false);
  assert.equal(primary.sessionFallback, true);
  assert.equal(primary.recoverySafe, false);

  const slot = writeCurrentSaveSlotWithStatus(state, 1, failedStorage, {
    now: 12,
  });
  assert.equal(slot.persisted, false);
  assert.equal(slot.sessionFallback, true);

  const imported = importCurrentSave(exportCurrentSave(state), failedStorage, {
    now: 13,
  });
  assert.equal(imported.committed, true);
  assert.equal(imported.persisted, false);
  assert.equal(imported.sessionFallback, true);

  const reset = resetCurrentSaveWithStatus(failedStorage);
  assert.equal(reset.persisted, false);
  assert.equal(reset.sessionFallback, true);
});

test("a failed multi-key reset rolls every removed save back before reporting failure", () => {
  const map = new Map();
  const base = storageAdapter(map);
  const first = createGameState({
    seed: 451,
    now: 10,
    profile: { displayName: "first" },
  });
  const second = {
    ...first,
    progression: { ...first.progression, journeyNumber: 2 },
  };
  assert.equal(
    writeCurrentSaveWithStatus(first, base, { now: 11 }).persisted,
    true,
  );
  assert.equal(
    writeCurrentSaveWithStatus(second, base, { now: 12 }).persisted,
    true,
  );
  assert.equal(
    writeCurrentSaveSlotWithStatus(second, 0, base, { now: 13 }).persisted,
    true,
  );

  const before = new Map(map);
  const partialFailure = {
    getItem: base.getItem,
    setItem: base.setItem,
    removeItem: (key) => {
      if (key === `${CURRENT_SAVE_SLOT_PREFIX}0`)
        throw new Error("slot removal denied");
      map.delete(key);
    },
  };
  const result = resetCurrentSaveWithStatus(partialFailure);

  assert.equal(result.persisted, false);
  assert.equal(result.rolledBack, true);
  assert.equal(result.recoverySafe, true);
  assert.equal(map.get(CURRENT_SAVE_KEY), before.get(CURRENT_SAVE_KEY));
  assert.equal(
    map.get(CURRENT_SAVE_BACKUP_KEY),
    before.get(CURRENT_SAVE_BACKUP_KEY),
  );
  assert.equal(
    map.get(`${CURRENT_SAVE_SLOT_PREFIX}0`),
    before.get(`${CURRENT_SAVE_SLOT_PREFIX}0`),
  );
  assert.equal(map.has(CURRENT_SAVE_RESET_SNAPSHOT_KEY), false);
  assert.equal(
    loadCurrentSaveWithStatus(base).state.progression.journeyNumber,
    2,
  );
  assert.equal(loadCurrentSaveSlot(0, base).progression.journeyNumber, 2);
});

test("load repairs a prepared reset snapshot left by an interrupted deletion", () => {
  const map = new Map();
  const storage = storageAdapter(map);
  const state = createGameState({
    seed: 452,
    now: 10,
    profile: { displayName: "recover-reset" },
  });
  assert.equal(
    writeCurrentSaveWithStatus(state, storage, { now: 11 }).persisted,
    true,
  );
  const original = map.get(CURRENT_SAVE_KEY);
  map.set(
    CURRENT_SAVE_RESET_SNAPSHOT_KEY,
    JSON.stringify({
      format: "sakiya-current-reset-snapshot",
      phase: "prepared",
      values: { [CURRENT_SAVE_KEY]: original },
    }),
  );
  map.delete(CURRENT_SAVE_KEY);

  const loaded = loadCurrentSaveWithStatus(storage);
  assert.equal(loaded.source, "primary");
  assert.equal(loaded.state.lineageId, state.lineageId);
  assert.equal(loaded.resetRecovery.found, true);
  assert.equal(loaded.resetRecovery.recovered, true);
  assert.equal(map.has(CURRENT_SAVE_RESET_SNAPSHOT_KEY), false);
});

test("a new reset cannot overwrite an interrupted reset snapshot that still needs recovery", () => {
  const map = new Map();
  const base = storageAdapter(map);
  const state = createGameState({ seed: 453, now: 10, profile: { displayName: "blocked-reset" } });
  assert.equal(writeCurrentSaveWithStatus(state, base, { now: 11 }).persisted, true);
  const original = map.get(CURRENT_SAVE_KEY);
  map.set(
    CURRENT_SAVE_RESET_SNAPSHOT_KEY,
    JSON.stringify({
      format: "sakiya-current-reset-snapshot",
      phase: "prepared",
      values: { [CURRENT_SAVE_KEY]: original },
    }),
  );
  map.delete(CURRENT_SAVE_KEY);
  const restoreDenied = {
    getItem: base.getItem,
    setItem: (key, value) => {
      if (key === CURRENT_SAVE_KEY) throw new Error("primary restore denied");
      map.set(key, value);
    },
    removeItem: base.removeItem,
  };

  const result = resetCurrentSaveWithStatus(restoreDenied);
  assert.equal(result.persisted, false);
  assert.equal(result.recoverySafe, false);
  assert.equal(result.blockedByInterruptedReset, true);
  assert.equal(map.has(CURRENT_SAVE_RESET_SNAPSHOT_KEY), true);
});

test("a malformed primary is quarantined before any fresh-state overwrite", () => {
  const storage = storageAdapter();
  const malformedRaw = '{"schema":1,"phase":';
  storage.setItem(
    "sakiya-creator-incremental:current:v1:primary",
    malformedRaw,
  );

  const loaded = loadCurrentSaveWithStatus(storage);
  assert.equal(loaded.source, "fresh-after-corruption");
  assert.equal(loaded.recoveryRequired, true);
  assert.equal(loaded.corruptPrimary, true);
  assert.equal(loaded.corruptPreserved, true);
  assert.equal(listCurrentCorruptSaves(storage).length, 1);
  assert.equal(exportCurrentCorruptSave(0, storage), malformedRaw);

  const replacement = writeCurrentSaveWithStatus(loaded.state, storage, {
    now: 99,
  });
  assert.equal(replacement.persisted, true);
  assert.equal(replacement.corruptPreserved, true);
  assert.equal(exportCurrentCorruptSave(0, storage), malformedRaw);
});

test("a malformed primary is not durably overwritten when quarantine cannot be written", () => {
  const map = new Map([
    ["sakiya-creator-incremental:current:v1:primary", "{broken"],
  ]);
  const storage = {
    getItem: (key) => map.get(key) ?? null,
    setItem: () => {
      throw new Error("quota denied");
    },
    removeItem: (key) => map.delete(key),
  };
  const loaded = loadCurrentSaveWithStatus(storage);
  assert.equal(loaded.corruptPreserved, false);

  const result = writeCurrentSaveWithStatus(loaded.state, storage, {
    now: 100,
  });
  assert.equal(result.persisted, false);
  assert.equal(result.blockedByCorruptPrimary, true);
  assert.equal(
    map.get("sakiya-creator-incremental:current:v1:primary"),
    "{broken",
  );
});

test("primary and occupied slot stay unchanged when their safety backup cannot be written", () => {
  const map = new Map();
  const base = storageAdapter(map);
  const first = createGameState({
    seed: 501,
    now: 10,
    profile: { displayName: "first" },
  });
  const second = {
    ...first,
    progression: { ...first.progression, journeyNumber: 2 },
  };
  assert.equal(
    writeCurrentSaveWithStatus(first, base, { now: 11 }).persisted,
    true,
  );
  assert.equal(
    writeCurrentSaveSlotWithStatus(first, 0, base, { now: 12 }).persisted,
    true,
  );
  const primaryBefore = map.get(
    "sakiya-creator-incremental:current:v1:primary",
  );
  const slotBefore = map.get("sakiya-creator-incremental:current:v1:slot:0");

  const backupDenied = {
    getItem: base.getItem,
    setItem: (key, value) => {
      if (key.includes(":backup") || key.includes(":slot-backup:"))
        throw new Error("backup quota denied");
      map.set(key, value);
    },
    removeItem: base.removeItem,
  };
  const primary = writeCurrentSaveWithStatus(second, backupDenied, { now: 13 });
  const slot = writeCurrentSaveSlotWithStatus(second, 0, backupDenied, {
    now: 14,
  });
  assert.equal(primary.persisted, false);
  assert.equal(primary.blockedByBackupFailure, true);
  assert.equal(slot.persisted, false);
  assert.equal(slot.blockedByBackupFailure, true);
  assert.equal(
    map.get("sakiya-creator-incremental:current:v1:primary"),
    primaryBefore,
  );
  assert.equal(
    map.get("sakiya-creator-incremental:current:v1:slot:0"),
    slotBefore,
  );
});

test("import drops forged bridge routes without unlocked endpoints and matching work provenance", () => {
  const forged = currentPayload({
    profile: { status: "ready" },
    phase: { kind: "room" },
    bridges: {
      completed: 1,
      routes: [
        {
          id: "forged",
          from: "music",
          to: "liveEvent",
          sourceWorkId: "no-work",
          createdAt: 12,
        },
      ],
    },
    works: [],
  });
  const preview = previewCurrentImport(forged);
  assert.equal(preview.ok, true);
  assert.deepEqual(preview.state.bridges.routes, []);
  assert.equal(preview.state.bridges.completed, 0);
});

test("import rederives U10 completion eligibility from retained activity provenance", () => {
  const eligibleJourney = simulateJourney({
    seed: 733,
    maximumCycles: 64,
    recordCompletionCandidate: false,
  }).state;
  const resumed = previewCurrentImport(JSON.stringify(eligibleJourney));
  assert.equal(resumed.ok, true);
  assert.equal(resumed.state.progression.completionEligible, true);
  assert.equal(resumed.state.pending.completionCandidate, true);

  let resumedState = resumed.state;
  const anchor = runCommand(
    resumedState,
    { type: "FINAL_ANCHOR_BROADCAST" },
    { now: resumedState.clock.now + 1 },
  );
  assert.equal(anchor.state.phase.kind, "broadcast-before");
  assert.equal(anchor.state.phase.planId, "final-anchor-candidate");
  resumedState = anchor.state;
  resumedState = runCommand(
    resumedState,
    { type: "BROADCAST_LIVE" },
    { now: resumedState.clock.now + 1 },
  ).state;
  resumedState = runCommand(
    resumedState,
    { type: "BROADCAST_AFTER" },
    { now: resumedState.clock.now + 1 },
  ).state;
  resumedState = runCommand(
    resumedState,
    { type: "PRESERVE_MOMENT" },
    { now: resumedState.clock.now + 1 },
  ).state;
  resumedState = runCommand(
    resumedState,
    { type: "RECORD_COMPLETION_CHOICE", choiceId: "carry-room-record" },
    { now: resumedState.clock.now + 1 },
  ).state;
  resumedState = runCommand(
    resumedState,
    { type: "COMPLETION_CANDIDATE" },
    { now: resumedState.clock.now + 1 },
  ).state;
  assert.equal(resumedState.phase.kind, "completion");
  assert.equal(resumedState.progression.completionCandidate, true);

  const forged = structuredClone(eligibleJourney);
  forged.works = [];
  forged.activities = {};
  forged.bridges = { routes: [], completed: 0 };
  forged.progression.completionEligible = true;
  forged.progression.completionCandidate = true;
  forged.pending.completionCandidate = true;
  forged.phase = { kind: "completion" };

  const stripped = previewCurrentImport(JSON.stringify(forged));
  assert.equal(stripped.ok, true);
  assert.equal(stripped.state.progression.completionEligible, false);
  assert.equal(stripped.state.progression.completionCandidate, false);
  assert.equal(stripped.state.pending.completionCandidate, false);
  assert.equal(stripped.state.phase.kind, "room");

  const blocked = runCommand(
    stripped.state,
    { type: "FINAL_ANCHOR_BROADCAST" },
    { now: stripped.state.clock.now + 1 },
  );
  assert.equal(blocked.state.phase.kind, "room");
  assert.equal(blocked.events.at(-1)?.reason, "full-u10-journey-required");
});

test("import rejects a forged final-Anchor contribution list, including a forged SNS source relation", () => {
  const completed = simulateJourney({
    seed: 734,
    maximumCycles: 64,
  }).state;
  const forged = structuredClone(completed);
  const anchor = forged.receipts.completion.find(
    (receipt) => receipt.kind === "completion-anchor-broadcast-candidate",
  );
  const anchorWork = forged.works.find((work) => work.id === anchor?.workId);
  assert.ok(anchor);
  assert.ok(anchorWork);

  for (const contributions of [
    anchor.activityContributions,
    anchorWork.provenance.activityContributions,
  ]) {
    const sns = contributions.find((entry) => entry.activity === "sns");
    assert.ok(sns);
    sns.provenance.sourceWorkId = "forged-missing-source";
  }

  const preview = previewCurrentImport(JSON.stringify(forged));
  assert.equal(preview.ok, true);
  assert.equal(preview.state.progression.completionCandidate, false);
  assert.equal(preview.state.phase.kind, "room");
  assert.equal(
    preview.state.receipts.completion.some(
      (receipt) => receipt.kind === "completion-anchor-broadcast-candidate",
    ),
    false,
  );
});

test("import invalidates an Anchor chain with one activity omitted from its contribution snapshot", () => {
  const completed = simulateJourney({
    seed: 7341,
    maximumCycles: 64,
  }).state;
  const missingSnapshotEntry = structuredClone(completed);
  const anchor = missingSnapshotEntry.receipts.completion.find(
    (receipt) => receipt.kind === "completion-anchor-broadcast-candidate",
  );
  const anchorWork = missingSnapshotEntry.works.find(
    (work) => work.id === anchor?.workId,
  );
  assert.ok(anchor);
  assert.ok(anchorWork);
  anchor.activityContributions = anchor.activityContributions.filter(
    (entry) => entry.activity !== "music",
  );
  anchorWork.provenance.activityContributions =
    anchorWork.provenance.activityContributions.filter(
      (entry) => entry.activity !== "music",
    );

  const preview = previewCurrentImport(JSON.stringify(missingSnapshotEntry));
  assert.equal(preview.ok, true);
  assert.equal(preview.state.progression.completionEligible, true);
  assert.equal(preview.state.progression.completionCandidate, false);
  assert.equal(preview.state.phase.kind, "room");
  assert.equal(
    preview.state.receipts.completion.some(
      (receipt) => receipt.kind === "completion-anchor-broadcast-candidate",
    ),
    false,
  );
});

test("import invalidates a completed Anchor chain when one activity contribution record is missing", () => {
  const completed = simulateJourney({
    seed: 735,
    maximumCycles: 64,
  }).state;
  const missing = structuredClone(completed);
  const anchor = missing.receipts.completion.find(
    (receipt) => receipt.kind === "completion-anchor-broadcast-candidate",
  );
  const liveEvent = anchor?.activityContributions.find(
    (entry) => entry.activity === "liveEvent",
  );
  assert.ok(liveEvent?.workId);
  missing.works = missing.works.filter((work) => work.type !== "event-record");

  const preview = previewCurrentImport(JSON.stringify(missing));
  assert.equal(preview.ok, true);
  assert.equal(preview.state.progression.completionEligible, false);
  assert.equal(preview.state.progression.completionCandidate, false);
  assert.equal(preview.state.phase.kind, "room");
  assert.equal(
    preview.state.receipts.completion.some(
      (receipt) => receipt.kind === "completion-anchor-broadcast-candidate",
    ),
    false,
  );
});

test("a normal six-activity legacy completion save resumes through deterministic Anchor snapshot migration", () => {
  const legacy = simulateJourney({
    seed: 736,
    maximumCycles: 64,
  }).state;
  const anchor = legacy.receipts.completion.find(
    (receipt) => receipt.kind === "completion-anchor-broadcast-candidate",
  );
  const anchorWork = legacy.works.find((work) => work.id === anchor?.workId);
  const candidate = legacy.receipts.completion.find(
    (receipt) => receipt.kind === "completion-candidate",
  );
  const runtimeBasis = candidate?.provenance.find(
    (entry) => entry.id === "runtime-completion-basis",
  );
  assert.ok(anchor);
  assert.ok(anchorWork);
  assert.ok(runtimeBasis);
  delete anchor.activityContributions;
  delete anchorWork.provenance.activityContributions;
  delete runtimeBasis.anchorReceiptId;
  delete runtimeBasis.activityContributionIds;
  delete runtimeBasis.activityContributions;

  const resumed = previewCurrentImport(JSON.stringify(legacy));
  assert.equal(resumed.ok, true);
  assert.equal(resumed.state.progression.completionCandidate, true);
  assert.equal(resumed.state.phase.kind, "completion");
  const resumedAnchor = resumed.state.receipts.completion.find(
    (receipt) => receipt.kind === "completion-anchor-broadcast-candidate",
  );
  assert.deepEqual(
    resumedAnchor?.activityContributions?.map((entry) => entry.activity),
    ["broadcast", "video", "singing", "music", "sns", "liveEvent"],
  );
  const continued = runCommand(
    resumed.state,
    { type: "CONTINUE" },
    { now: resumed.state.clock.now + 1 },
  );
  assert.equal(continued.state.phase.kind, "room");
});
