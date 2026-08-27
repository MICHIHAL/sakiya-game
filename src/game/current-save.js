import {
  ACTIVITY_IDS,
  BROADCAST_PLANS,
  FICTIONAL_PEOPLE,
  UNIT_LABELS,
} from "./current-content.js";
import {
  CURRENT_SCHEMA,
  buildFinalAnchorActivityContributions,
  completionRequirementsSatisfied,
  createGameState,
  getValidCompletionCandidateReceipt,
  getValidCompletionChoiceReceipt,
  getValidFinalAnchorReceipt,
  hasRecordedCompletionCandidate,
} from "./current-engine.js";

// Deliberately unrelated to the archived RUN save namespace.
export const CURRENT_SAVE_NAMESPACE = "sakiya-creator-incremental:current:v1";
export const CURRENT_SAVE_KEY = `${CURRENT_SAVE_NAMESPACE}:primary`;
export const CURRENT_SAVE_BACKUP_KEY = `${CURRENT_SAVE_NAMESPACE}:backup`;
export const CURRENT_SAVE_SLOT_PREFIX = `${CURRENT_SAVE_NAMESPACE}:slot:`;
export const CURRENT_SAVE_SLOT_BACKUP_PREFIX = `${CURRENT_SAVE_NAMESPACE}:slot-backup:`;
export const CURRENT_SAVE_SLOT_STAGING_PREFIX = `${CURRENT_SAVE_NAMESPACE}:slot-staging:`;
export const CURRENT_SAVE_CORRUPT_PREFIX = `${CURRENT_SAVE_NAMESPACE}:corrupt-primary:`;
export const CURRENT_SAVE_RESET_SNAPSHOT_KEY = `${CURRENT_SAVE_NAMESPACE}:reset-snapshot`;
export const CURRENT_SAVE_SCHEMA = CURRENT_SCHEMA;
export const CURRENT_SAVE_FORMAT = "sakiya-current-save";

const MAX_IMPORT_BYTES = 2_000_000;
const MAX_HISTORY = 480;
const MAX_WORKS = 240;
const MAX_EVENTS = 80;
const MAX_CORRUPT_SAVES = 3;
const FICTIONAL_PERSON_IDS = new Set(
  FICTIONAL_PEOPLE.map((person) => person.id),
);
const UNIT_IDS = new Set(Object.keys(UNIT_LABELS));
const BROADCAST_PLAN_IDS = new Set(BROADCAST_PLANS.map((plan) => plan.id));
const PHASE_KINDS = new Set([
  "profile",
  "room",
  "broadcast-before",
  "broadcast-live",
  "broadcast-after",
  "completion",
]);
const ACTIVE_BROADCAST_PHASE_KINDS = new Set([
  "broadcast-before",
  "broadcast-live",
  "broadcast-after",
]);
const BLOCKED_OBJECT_KEYS = new Set(["__proto__", "constructor", "prototype"]);
const noStorageMemory = new Map();
const storageFallbacks = new WeakMap();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function safeNumber(value, fallback = 0, min = 0, max = 1e100) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function safeInteger(value, fallback = 0, min = 0, max = 1e9) {
  return Math.floor(safeNumber(value, fallback, min, max));
}

function safeString(value, fallback = "", max = 240) {
  if (typeof value !== "string") return fallback;
  return (
    value
      .replace(/[\u0000-\u001f]/g, "")
      .trim()
      .slice(0, max) || fallback
  );
}

function arrayLimit(path) {
  if (path.endsWith(".history")) return 24;
  if (path === "history") return MAX_HISTORY;
  if (path === "works") return MAX_WORKS;
  if (path === "recentEvents") return 48;
  if (path.includes("receipts")) return MAX_EVENTS;
  if (path === "people.known") return FICTIONAL_PEOPLE.length;
  return 128;
}

function sanitizeLoose(value, path = "", depth = 0) {
  if (depth > 8 || value == null) return null;
  if (typeof value === "number") return safeNumber(value, 0, 0, 1e100);
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return safeString(value, "", 240);
  if (Array.isArray(value))
    return value
      .slice(0, arrayLimit(path))
      .map((entry) => sanitizeLoose(entry, `${path}[]`, depth + 1));
  if (!isObject(value)) return null;
  const result = {};
  for (const [key, entry] of Object.entries(value).slice(0, 80)) {
    if (!/^[A-Za-z0-9_:-]{1,80}$/.test(key) || BLOCKED_OBJECT_KEYS.has(key))
      continue;
    result[key] = sanitizeLoose(
      entry,
      path ? `${path}.${key}` : key,
      depth + 1,
    );
  }
  return result;
}

function sanitizeObject(value, path) {
  const sanitized = sanitizeLoose(value, path);
  return isObject(sanitized) ? sanitized : null;
}

function mergeKnown(base, source, path = "") {
  if (typeof base === "number") return safeNumber(source, base, 0, 1e100);
  if (typeof base === "boolean")
    return typeof source === "boolean" ? source : base;
  if (typeof base === "string") return safeString(source, base, 240);
  if (Array.isArray(base)) {
    if (!Array.isArray(source)) return clone(base);
    return source
      .slice(0, arrayLimit(path))
      .map((entry) => sanitizeLoose(entry, path));
  }
  if (!isObject(base)) return clone(base);
  if (!isObject(source)) return clone(base);
  const result = {};
  for (const key of Object.keys(base))
    result[key] = mergeKnown(
      base[key],
      source[key],
      path ? `${path}.${key}` : key,
    );
  if (path === "resources.unitValues") {
    for (const unitId of UNIT_IDS) {
      if (Object.prototype.hasOwnProperty.call(source, unitId))
        result[unitId] = safeNumber(source[unitId], 0, 0, 1e100);
    }
  }
  return result;
}

function normalizeSettings(settings, defaults) {
  return {
    sound: settings?.sound == null ? defaults.sound : Boolean(settings.sound),
    captions:
      settings?.captions == null
        ? defaults.captions
        : Boolean(settings.captions),
    reducedMotion:
      settings?.reducedMotion == null
        ? defaults.reducedMotion
        : Boolean(settings.reducedMotion),
    highContrast:
      settings?.highContrast == null
        ? defaults.highContrast
        : Boolean(settings.highContrast),
    fontScale: [1, 1.1, 1.2].includes(Number(settings?.fontScale))
      ? Number(settings.fontScale)
      : defaults.fontScale,
    numberNotation: ["short", "full", "scientific"].includes(
      settings?.numberNotation,
    )
      ? settings.numberNotation
      : defaults.numberNotation,
  };
}

function normalizePeople(people, defaults) {
  const known = Array.isArray(people?.known)
    ? people.known
        .filter(
          (person) => isObject(person) && FICTIONAL_PERSON_IDS.has(person.id),
        )
        .slice(0, FICTIONAL_PEOPLE.length)
        .map((person) => ({
          id: person.id,
          displayName: safeString(
            person.displayName,
            FICTIONAL_PEOPLE.find((item) => item.id === person.id)
              ?.displayName ?? "",
            48,
          ),
          fictional: true,
          status: person.status === "away" ? "away" : "present",
          firstSeenAt: safeInteger(person.firstSeenAt, 0, 0, 9e12),
          lastSeenAt: safeInteger(person.lastSeenAt, 0, 0, 9e12),
          visits: safeInteger(person.visits, 0, 0, 1e9),
          history: Array.isArray(person.history)
            ? person.history
                .filter((event) => typeof event === "string")
                .map((event) => safeString(event, "", 32))
                .filter(Boolean)
                .slice(-16)
            : [],
        }))
    : clone(defaults.known);
  const knownIds = new Set(known.map((person) => person.id));
  const firstExternalArrivalId = knownIds.has(people?.firstExternalArrivalId)
    ? people.firstExternalArrivalId
    : null;
  const reversibleAbsences = Array.isArray(people?.reversibleAbsences)
    ? [
        ...new Set(people.reversibleAbsences.filter((id) => knownIds.has(id))),
      ].slice(0, FICTIONAL_PEOPLE.length)
    : [];
  return { known, firstExternalArrivalId, reversibleAbsences };
}

function normalizeWorks(works) {
  if (!Array.isArray(works)) return [];
  const allowedTypes = new Set([
    "material",
    "video",
    "take",
    "music",
    "event-record",
  ]);
  return works
    .filter((work) => isObject(work) && allowedTypes.has(work.type))
    .slice(0, MAX_WORKS)
    .map((work, index) => ({
      id: safeString(work.id, `restored-work-${index}`, 120),
      type: work.type,
      title: safeString(work.title, "残した記録", 80),
      createdAt: safeInteger(work.createdAt, 0, 0, 9e12),
      provenance: sanitizeObject(work.provenance, "works.provenance") ?? {},
      assetIdle: isObject(work.assetIdle)
        ? {
            rate: safeNumber(work.assetIdle.rate, 0, 0, 1e6),
            accumulated: safeNumber(work.assetIdle.accumulated, 0, 0, 1e100),
          }
        : null,
      returnObserved: Boolean(work.returnObserved),
      usedByVideo: Boolean(work.usedByVideo),
    }));
}

function normalizePhase(phase, profile) {
  const source = sanitizeObject(phase, "phase");
  const fallbackKind = profile.status === "ready" ? "room" : "profile";
  let kind = PHASE_KINDS.has(source?.kind) ? source.kind : fallbackKind;

  // A profile gate cannot safely resume a room or broadcast, and a ready
  // profile never leaves the interface on a blank profile-only surface.
  if (profile.status !== "ready") kind = "profile";
  else if (kind === "profile") kind = "room";

  if (!ACTIVE_BROADCAST_PHASE_KINDS.has(kind)) return { kind };

  const id = safeString(source?.id, "", 120);
  if (!id) return { kind: fallbackKind };

  return {
    kind,
    id,
    planId: BROADCAST_PLAN_IDS.has(source?.planId)
      ? source.planId
      : BROADCAST_PLANS[0].id,
    participation: ["silent", "react", "comment"].includes(
      source?.participation,
    )
      ? source.participation
      : "silent",
    liveActions: safeInteger(source?.liveActions, 0, 0, 2),
    preserved: Boolean(source?.preserved),
  };
}

function normalizePendingPreserve(value) {
  const source = sanitizeObject(value, "pending.preserve");
  if (!source) return null;
  const broadcastId = safeString(source.broadcastId, "", 120);
  if (!broadcastId) return null;
  return {
    broadcastId,
    planId: BROADCAST_PLAN_IDS.has(source.planId)
      ? source.planId
      : BROADCAST_PLANS[0].id,
    atmosphere: safeNumber(source.atmosphere, 0, 0, 1e100),
  };
}

function normalizeEvents(events, limit = MAX_EVENTS) {
  if (!Array.isArray(events)) return [];
  return events
    .slice(-limit)
    .map((event) => sanitizeLoose(event, "event"))
    .filter(isObject);
}

function normalizeBridges(routes, state) {
  if (!Array.isArray(routes)) return [];
  const activityIds = new Set(ACTIVITY_IDS);
  const seen = new Set();
  const normalized = [];
  for (const route of routes.slice(0, 32)) {
    if (!isObject(route)) continue;
    const from = safeString(route.from, "", 32);
    const to = safeString(route.to, "", 32);
    const sourceWorkId = safeString(route.sourceWorkId, "", 120);
    if (
      !activityIds.has(from) ||
      !activityIds.has(to) ||
      from === to ||
      !sourceWorkId
    )
      continue;
    const sourceOpen =
      from === "broadcast" || Boolean(state.activities[from]?.unlocked);
    const targetOpen =
      to === "broadcast" || Boolean(state.activities[to]?.unlocked);
    const sourceWork = state.works.find((work) => work.id === sourceWorkId);
    if (!sourceOpen || !targetOpen || sourceWork?.provenance?.activity !== from)
      continue;
    const key = `${from}->${to}`;
    if (seen.has(key)) continue;
    seen.add(key);
    normalized.push({
      id: safeString(route.id, `restored-bridge-${normalized.length}`, 120),
      key,
      from,
      to,
      sourceWorkId,
      createdAt: safeInteger(route.createdAt, 0, 0, 9e12),
    });
  }
  return normalized;
}

function uniqueWorkById(works, id) {
  if (typeof id !== "string" || !id || !Array.isArray(works)) return null;
  const matches = works.filter((work) => work?.id === id);
  return matches.length === 1 ? matches[0] : null;
}

function uniqueCurrentCompletionReceipt(state, kind) {
  const matches = state.receipts.completion.filter(
    (receipt) =>
      receipt?.journeyNumber === state.progression.journeyNumber &&
      receipt?.kind === kind,
  );
  return matches.length === 1 ? matches[0] : null;
}

function contributionIdentifiers(contributions) {
  return contributions.map((entry) => ({
    activity: entry.activity,
    ...(typeof entry.workId === "string"
      ? { workId: entry.workId }
      : { recordId: entry.recordId }),
  }));
}

function upgradeLegacyAnchorContributionSnapshot(state) {
  const anchor = uniqueCurrentCompletionReceipt(
    state,
    "completion-anchor-broadcast-candidate",
  );
  const anchorWork = uniqueWorkById(state.works, anchor?.workId);
  if (!anchor || !anchorWork?.provenance) return;

  const receiptAlreadyCarriesSnapshot = Object.hasOwn(
    anchor,
    "activityContributions",
  );
  const workAlreadyCarriesSnapshot = Object.hasOwn(
    anchorWork.provenance,
    "activityContributions",
  );
  // Both snapshots absent is the only legacy form we upgrade.  A partial or
  // malformed supplied snapshot is deliberately left invalid for the engine
  // validator to reject rather than being overwritten by imported data.
  if (receiptAlreadyCarriesSnapshot || workAlreadyCarriesSnapshot) return;

  const contributions = buildFinalAnchorActivityContributions(state, anchorWork);
  if (!contributions) return;
  anchor.activityContributions = clone(contributions);
  anchorWork.provenance.activityContributions = clone(contributions);
}

function upgradeLegacyCompletionRuntimeBasis(state) {
  const anchor = getValidFinalAnchorReceipt(state);
  const candidate = uniqueCurrentCompletionReceipt(
    state,
    "completion-candidate",
  );
  if (!anchor || !candidate || !Array.isArray(candidate.provenance)) return;
  const bases = candidate.provenance.filter(
    (entry) => entry?.id === "runtime-completion-basis",
  );
  if (bases.length !== 1 || !isObject(bases[0])) return;
  const basis = bases[0];
  const suppliedContributionSnapshot =
    Object.hasOwn(basis, "activityContributions") ||
    Object.hasOwn(basis, "activityContributionIds");
  if (
    suppliedContributionSnapshot ||
    basis.anchorWorkId !== anchor.workId ||
    (Object.hasOwn(basis, "anchorReceiptId") &&
      basis.anchorReceiptId !== anchor.id)
  )
    return;

  basis.anchorReceiptId = anchor.id;
  basis.activityContributionIds = contributionIdentifiers(
    anchor.activityContributions,
  );
  basis.activityContributions = clone(anchor.activityContributions);
}

function pruneInvalidCurrentCompletionChain(state) {
  const anchor = getValidFinalAnchorReceipt(state);
  const choice = getValidCompletionChoiceReceipt(state, anchor);
  const candidate = getValidCompletionCandidateReceipt(state, anchor, choice);
  const retainedIds = new Set(
    [anchor, choice, candidate].filter(Boolean).map((receipt) => receipt.id),
  );
  const chainKinds = new Set([
    "completion-anchor-broadcast-candidate",
    "completion-choice-candidate",
    "completion-candidate",
  ]);
  state.receipts.completion = state.receipts.completion.filter((receipt) => {
    if (receipt?.journeyNumber !== state.progression.journeyNumber) return true;
    return !chainKinds.has(receipt?.kind) || retainedIds.has(receipt.id);
  });
}

/**
 * Pure, bounded normalizer used by both browser persistence and Node tests.
 * It accepts only the current schema; old RUN keys/schema are never converted.
 */
export function normalizeCurrentSave(parsed, options = {}) {
  const base = createGameState({ now: safeInteger(options.now, 0, 0, 9e12) });
  if (!isObject(parsed) || Number(parsed.schema) !== CURRENT_SCHEMA)
    return base;
  const state = mergeKnown(base, parsed);
  state.schema = CURRENT_SCHEMA;
  state.lineageId = safeString(parsed.lineageId, base.lineageId, 80);
  state.clock = {
    now: safeInteger(parsed.clock?.now, base.clock.now, 0, 9e12),
    lastAdvancedAt: safeInteger(
      parsed.clock?.lastAdvancedAt,
      base.clock.lastAdvancedAt,
      0,
      9e12,
    ),
    lastForegroundAt: safeInteger(
      parsed.clock?.lastForegroundAt,
      base.clock.lastForegroundAt,
      0,
      9e12,
    ),
  };
  state.profile = {
    status: parsed.profile?.status === "ready" ? "ready" : "needs-profile",
    displayName: safeString(parsed.profile?.displayName, "", 48),
    anonymous: Boolean(parsed.profile?.anonymous),
    createdAt:
      parsed.profile?.createdAt == null
        ? null
        : safeInteger(parsed.profile.createdAt, 0, 0, 9e12),
    localOnly: true,
  };
  state.phase = normalizePhase(parsed.phase, state.profile);
  state.progression = {
    ...state.progression,
    mode: parsed.progression?.mode === "p0" ? "p0" : "journey",
    breakpointIndex: safeInteger(parsed.progression?.breakpointIndex, 0, 0, 24),
    scaleIndex: safeInteger(parsed.progression?.scaleIndex, 0, 0, 10),
    currentUnit: UNIT_IDS.has(parsed.progression?.currentUnit)
      ? parsed.progression.currentUnit
      : "U0",
    macroLayer: safeInteger(parsed.progression?.macroLayer, 1, 1, 6),
    journeyNumber: safeInteger(parsed.progression?.journeyNumber, 1, 1, 999),
    videoReturnObserved: Boolean(parsed.progression?.videoReturnObserved),
    completionEligible: Boolean(parsed.progression?.completionEligible),
    completionCandidate: Boolean(parsed.progression?.completionCandidate),
  };
  state.resources.currentUnit = {
    id: UNIT_IDS.has(parsed.resources?.currentUnit?.id)
      ? parsed.resources.currentUnit.id
      : state.progression.currentUnit,
    value: safeNumber(parsed.resources?.currentUnit?.value, 0, 0, 1e100),
    liveRate: safeNumber(parsed.resources?.currentUnit?.liveRate, 0, 0, 1e100),
  };
  state.resources.unitValues = Object.fromEntries(
    [...UNIT_IDS].map((unitId) => [
      unitId,
      safeNumber(
        parsed.resources?.unitValues?.[unitId],
        unitId === state.resources.currentUnit.id
          ? state.resources.currentUnit.value
          : 0,
        0,
        1e100,
      ),
    ]),
  );
  state.resources.retiredUnits = Array.isArray(parsed.resources?.retiredUnits)
    ? parsed.resources.retiredUnits
        .slice(0, 10)
        .map((entry) => sanitizeLoose(entry, "resources.retiredUnits"))
        .filter(isObject)
    : [];
  state.resources.materials = safeInteger(
    parsed.resources?.materials,
    0,
    0,
    MAX_WORKS,
  );
  state.resources.videoReach = safeNumber(
    parsed.resources?.videoReach,
    0,
    0,
    1e100,
  );
  state.resources.vocalMastery = safeNumber(
    parsed.resources?.vocalMastery,
    0,
    0,
    1e100,
  );
  state.resources.musicResonance = safeNumber(
    parsed.resources?.musicResonance,
    0,
    0,
    1e100,
  );
  state.resources.snsSignal = safeNumber(
    parsed.resources?.snsSignal,
    0,
    0,
    1e100,
  );
  state.resources.eventAfterglow = safeNumber(
    parsed.resources?.eventAfterglow,
    0,
    0,
    1e100,
  );
  state.resources.gifts = safeNumber(parsed.resources?.gifts, 0, 0, 1e100);
  state.resources.session = {
    active: Boolean(parsed.resources?.session?.active),
    atmosphere: safeNumber(parsed.resources?.session?.atmosphere, 0, 0, 1e100),
    attention: safeNumber(parsed.resources?.session?.attention, 0, 0, 1e100),
    reactions: safeInteger(parsed.resources?.session?.reactions, 0, 0, 1e9),
    comments: safeInteger(parsed.resources?.session?.comments, 0, 0, 1e9),
  };
  state.activities = Object.fromEntries(
    Object.entries(base.activities).map(([id, defaultActivity]) => {
      const source = parsed.activities?.[id];
      return [
        id,
        {
          ...defaultActivity,
          unlocked: Boolean(source?.unlocked),
          totalActions: safeInteger(source?.totalActions, 0, 0, 1e9),
          output: safeNumber(source?.output, 0, 0, 1e100),
          lastCycle: safeInteger(source?.lastCycle, -1, -1, 1e9),
          limiter: {
            ...defaultActivity.limiter,
            usedThisCycle: safeInteger(source?.limiter?.usedThisCycle, 0, 0, 2),
            maxPerCycle: safeInteger(
              source?.limiter?.maxPerCycle,
              defaultActivity.limiter.maxPerCycle,
              1,
              2,
            ),
          },
        },
      ];
    }),
  );
  state.people = normalizePeople(parsed.people, base.people);
  state.works = normalizeWorks(parsed.works);
  const bridgeRoutes = normalizeBridges(parsed.bridges?.routes, state);
  state.bridges = { routes: bridgeRoutes, completed: bridgeRoutes.length };
  state.automation = Object.fromEntries(
    Object.keys(base.automation).map((id) => [
      id,
      {
        available: Boolean(parsed.automation?.[id]?.available),
        understood: Boolean(parsed.automation?.[id]?.understood),
        enabled:
          Boolean(parsed.automation?.[id]?.enabled) &&
          Boolean(parsed.automation?.[id]?.understood),
        completed: safeInteger(parsed.automation?.[id]?.completed, 0, 0, 1e9),
      },
    ]),
  );
  state.history = normalizeEvents(parsed.history, MAX_HISTORY);
  state.receipts = {
    breakpoints: normalizeEvents(parsed.receipts?.breakpoints, 24),
    scalePeaks: normalizeEvents(parsed.receipts?.scalePeaks, 10),
    prestige: normalizeEvents(parsed.receipts?.prestige, 80),
    completion: normalizeEvents(parsed.receipts?.completion, 80),
  };
  state.pending = {
    preserve: normalizePendingPreserve(parsed.pending?.preserve),
    namedPersonEvents: [],
    offlineEvidence: safeNumber(parsed.pending?.offlineEvidence, 0, 0, 1e100),
    completionCandidate: Boolean(parsed.pending?.completionCandidate),
  };
  state.settings = normalizeSettings(parsed.settings, base.settings);
  state.meta = {
    ...base.meta,
    rng: safeInteger(parsed.meta?.rng, base.meta.rng, 1, 0xffffffff),
    eventSerial: safeInteger(parsed.meta?.eventSerial, 0, 0, 1e9),
    workSerial: safeInteger(parsed.meta?.workSerial, 0, 0, 1e9),
    broadcastSerial: safeInteger(parsed.meta?.broadcastSerial, 0, 0, 1e9),
    firstArrivalChimePlayed: Boolean(parsed.meta?.firstArrivalChimePlayed),
    firstArrivalChimeHeard: Boolean(parsed.meta?.firstArrivalChimeHeard),
    firsts: {
      arrival: Boolean(parsed.meta?.firsts?.arrival),
      material: Boolean(parsed.meta?.firsts?.material),
      video: Boolean(parsed.meta?.firsts?.video),
      bridge: Boolean(parsed.meta?.firsts?.bridge),
      automation: Boolean(parsed.meta?.firsts?.automation),
    },
    prestigeCount: safeInteger(parsed.meta?.prestigeCount, 0, 0, 1e9),
    continued: Boolean(parsed.meta?.continued),
    strongNewGameCount: safeInteger(parsed.meta?.strongNewGameCount, 0, 0, 999),
  };
  state.recentEvents = normalizeEvents(parsed.recentEvents, 48);

  // Relationship state is never fabricated by import. A chime needs both the
  // saved lineage flag and a fictional first-arrival record to be considered used.
  if (!state.people.firstExternalArrivalId) {
    state.meta.firstArrivalChimePlayed = false;
    state.meta.firstArrivalChimeHeard = false;
  }
  if (!state.meta.firstArrivalChimePlayed)
    state.meta.firstArrivalChimeHeard = false;
  if (state.progression.currentUnit !== state.resources.currentUnit.id) {
    state.progression.currentUnit = state.resources.currentUnit.id;
  }

  // Legacy local saves can have a structurally valid final Anchor chain from
  // before contribution snapshots existed.  When both snapshots are absent,
  // derive the same deterministic six-entry record from retained data.  Any
  // supplied partial or malformed list remains invalid and is pruned below.
  upgradeLegacyAnchorContributionSnapshot(state);
  upgradeLegacyCompletionRuntimeBasis(state);
  pruneInvalidCurrentCompletionChain(state);

  // Eligibility is derived from retained contributions and milestones, never
  // from imported UI convenience flags.  A completion screen is similarly
  // retained only when its anchor/choice/receipt chain still resolves.
  const completionEligible = completionRequirementsSatisfied(state);
  const completionCandidate = hasRecordedCompletionCandidate(state);
  state.progression.completionEligible = completionEligible;
  state.progression.completionCandidate = completionCandidate;
  state.pending.completionCandidate = completionEligible && !completionCandidate;
  if (!completionCandidate && state.phase.kind === "completion") {
    state.phase = { kind: "room" };
  }
  return state;
}

export function validateCurrentSave(parsed) {
  const errors = [];
  if (!isObject(parsed)) errors.push("save-not-an-object");
  else if (Number(parsed.schema) !== CURRENT_SCHEMA)
    errors.push("unsupported-current-schema");
  return {
    valid: errors.length === 0,
    errors,
    state: normalizeCurrentSave(parsed),
  };
}

export function serializeCurrentSave(state, options = {}) {
  const payload = {
    format: CURRENT_SAVE_FORMAT,
    schema: CURRENT_SCHEMA,
    exportedAt: safeInteger(options.now, 0, 0, 9e12),
    state: normalizeCurrentSave(state, options),
  };
  return JSON.stringify(payload);
}

export function deserializeCurrentSave(value, options = {}) {
  if (typeof value !== "string" || value.length > MAX_IMPORT_BYTES) return null;
  try {
    const parsed = JSON.parse(value);
    if (isObject(parsed) && parsed.format === CURRENT_SAVE_FORMAT) {
      const validation = validateCurrentSave(parsed.state);
      return validation.valid ? validation.state : null;
    }
    const validation = validateCurrentSave(parsed);
    return validation.valid ? validation.state : null;
  } catch {
    return null;
  }
}

export function previewCurrentImport(value, options = {}) {
  if (typeof value === "string" && value.length > MAX_IMPORT_BYTES) {
    return {
      ok: false,
      errors: ["import-too-large"],
      state: null,
      summary: null,
    };
  }
  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return {
        ok: false,
        errors: ["invalid-json"],
        state: null,
        summary: null,
      };
    }
  }
  const wrapped = isObject(parsed) && parsed.format === CURRENT_SAVE_FORMAT;
  const candidate = wrapped ? parsed.state : parsed;
  const validation = validateCurrentSave(candidate);
  if (!validation.valid)
    return { ok: false, errors: validation.errors, state: null, summary: null };
  const state = validation.state;
  return {
    ok: true,
    errors: [],
    state,
    summary: {
      schema: state.schema,
      source: wrapped ? CURRENT_SAVE_FORMAT : "current-state-json",
      exportedAt: wrapped ? safeInteger(parsed.exportedAt, 0, 0, 9e12) : null,
      lineageId: state.lineageId,
      profileName: state.profile.anonymous
        ? "名前を保存しない参加"
        : state.profile.displayName || "未設定",
      journeyNumber: state.progression.journeyNumber,
      breakpointCount: state.receipts.breakpoints.length,
      scalePeakCount: state.receipts.scalePeaks.length,
      people: state.people.known.length,
      works: state.works.length,
    },
  };
}

function browserStorage(explicitStorage) {
  if (explicitStorage) return explicitStorage;
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function fallbackMemory(storage) {
  if (
    !storage ||
    (typeof storage !== "object" && typeof storage !== "function")
  )
    return noStorageMemory;
  let memory = storageFallbacks.get(storage);
  if (!memory) {
    memory = new Map();
    storageFallbacks.set(storage, memory);
  }
  return memory;
}

function readRaw(key, explicitStorage) {
  const storage = browserStorage(explicitStorage);
  const memory = fallbackMemory(storage);
  if (storage) {
    try {
      const value = storage.getItem(key);
      if (typeof value === "string") return value;
    } catch {
      // Fall through to the in-memory session copy.
    }
  }
  return memory.get(key) ?? null;
}

function readDurableRaw(key, explicitStorage) {
  const storage = browserStorage(explicitStorage);
  if (!storage) return null;
  try {
    const value = storage.getItem(key);
    return typeof value === "string" ? value : null;
  } catch {
    return null;
  }
}

function writeSessionRaw(key, value, explicitStorage) {
  const storage = browserStorage(explicitStorage);
  fallbackMemory(storage).set(key, value);
}

function writeRaw(key, value, explicitStorage) {
  const storage = browserStorage(explicitStorage);
  fallbackMemory(storage).set(key, value);
  if (!storage) return false;
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function removeRaw(key, explicitStorage) {
  const storage = browserStorage(explicitStorage);
  fallbackMemory(storage).delete(key);
  if (!storage) return false;
  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function decodeStored(raw) {
  if (!raw) return null;
  return deserializeCurrentSave(raw);
}

function corruptKey(index) {
  return `${CURRENT_SAVE_CORRUPT_PREFIX}${safeInteger(index, 0, 0, MAX_CORRUPT_SAVES - 1)}`;
}

function resetTargetKeys() {
  const keys = [CURRENT_SAVE_KEY, CURRENT_SAVE_BACKUP_KEY];
  for (let slot = 0; slot < 3; slot += 1) {
    keys.push(`${CURRENT_SAVE_SLOT_PREFIX}${slot}`);
    keys.push(`${CURRENT_SAVE_SLOT_BACKUP_PREFIX}${slot}`);
    keys.push(`${CURRENT_SAVE_SLOT_STAGING_PREFIX}${slot}`);
  }
  for (let index = 0; index < MAX_CORRUPT_SAVES; index += 1)
    keys.push(corruptKey(index));
  return keys;
}

function createResetSnapshot(explicitStorage, phase = "prepared") {
  const values = {};
  for (const key of resetTargetKeys()) {
    const raw = readRaw(key, explicitStorage);
    if (typeof raw === "string") values[key] = raw;
  }
  return {
    format: "sakiya-current-reset-snapshot",
    phase,
    values,
  };
}

function decodeResetSnapshot(raw) {
  if (typeof raw !== "string" || raw.length > MAX_IMPORT_BYTES * 16)
    return null;
  try {
    const parsed = JSON.parse(raw);
    if (!isObject(parsed) || parsed.format !== "sakiya-current-reset-snapshot")
      return null;
    if (
      !isObject(parsed.values) ||
      !["prepared", "committed"].includes(parsed.phase)
    )
      return null;
    const allowed = new Set(resetTargetKeys());
    const values = {};
    for (const [key, value] of Object.entries(parsed.values)) {
      if (allowed.has(key) && typeof value === "string") values[key] = value;
    }
    return { format: parsed.format, phase: parsed.phase, values };
  } catch {
    return null;
  }
}

function restoreResetSnapshot(snapshot, explicitStorage) {
  let restored = true;
  for (const key of resetTargetKeys()) {
    const operation = Object.prototype.hasOwnProperty.call(snapshot.values, key)
      ? writeRaw(key, snapshot.values[key], explicitStorage)
      : removeRaw(key, explicitStorage);
    restored = operation && restored;
  }
  return restored;
}

function recoverInterruptedReset(explicitStorage) {
  const raw = readDurableRaw(CURRENT_SAVE_RESET_SNAPSHOT_KEY, explicitStorage);
  if (!raw)
    return {
      found: false,
      recovered: false,
      cleanupPersisted: true,
      safeToContinue: true,
    };
  const snapshot = decodeResetSnapshot(raw);
  if (!snapshot) {
    const cleanupPersisted = removeRaw(
      CURRENT_SAVE_RESET_SNAPSHOT_KEY,
      explicitStorage,
    );
    return {
      found: true,
      recovered: false,
      cleanupPersisted,
      safeToContinue: cleanupPersisted,
    };
  }
  if (snapshot.phase === "committed") {
    return {
      found: true,
      recovered: false,
      cleanupPersisted: removeRaw(
        CURRENT_SAVE_RESET_SNAPSHOT_KEY,
        explicitStorage,
      ),
      safeToContinue: true,
    };
  }
  const recovered = restoreResetSnapshot(snapshot, explicitStorage);
  const cleanupPersisted = recovered
    ? removeRaw(CURRENT_SAVE_RESET_SNAPSHOT_KEY, explicitStorage)
    : false;
  return {
    found: true,
    recovered,
    cleanupPersisted,
    safeToContinue: recovered,
  };
}

function quarantineCorruptRaw(raw, explicitStorage) {
  if (typeof raw !== "string" || decodeStored(raw)) {
    return {
      needed: false,
      persisted: true,
      index: null,
      alreadyPreserved: false,
      full: false,
    };
  }
  for (let index = 0; index < MAX_CORRUPT_SAVES; index += 1) {
    if (readDurableRaw(corruptKey(index), explicitStorage) === raw) {
      return {
        needed: true,
        persisted: true,
        index,
        alreadyPreserved: true,
        full: false,
      };
    }
  }
  for (let index = 0; index < MAX_CORRUPT_SAVES; index += 1) {
    const key = corruptKey(index);
    if (readDurableRaw(key, explicitStorage) == null) {
      const persisted = writeRaw(key, raw, explicitStorage);
      return {
        needed: true,
        persisted,
        index,
        alreadyPreserved: false,
        full: false,
      };
    }
  }
  return {
    needed: true,
    persisted: false,
    index: null,
    alreadyPreserved: false,
    full: true,
  };
}

export function listCurrentCorruptSaves(explicitStorage) {
  const entries = [];
  for (let index = 0; index < MAX_CORRUPT_SAVES; index += 1) {
    const raw = readRaw(corruptKey(index), explicitStorage);
    if (typeof raw === "string") {
      entries.push({
        index,
        bytes: new TextEncoder().encode(raw).length,
        durable: readDurableRaw(corruptKey(index), explicitStorage) === raw,
      });
    }
  }
  return entries;
}

export function exportCurrentCorruptSave(index, explicitStorage) {
  return readRaw(corruptKey(index), explicitStorage);
}

export function loadCurrentSaveWithStatus(explicitStorage) {
  const resetRecovery = recoverInterruptedReset(explicitStorage);
  const primaryRaw = readRaw(CURRENT_SAVE_KEY, explicitStorage);
  const primary = decodeStored(primaryRaw);
  if (primary) {
    return {
      state: primary,
      source: "primary",
      persisted:
        readDurableRaw(CURRENT_SAVE_KEY, explicitStorage) === primaryRaw,
      recoveryRequired: false,
      corruptPrimary: false,
      corruptPreserved: false,
      resetRecovery,
    };
  }

  const corrupt = primaryRaw
    ? quarantineCorruptRaw(primaryRaw, explicitStorage)
    : null;
  const backupRaw = readRaw(CURRENT_SAVE_BACKUP_KEY, explicitStorage);
  const backup = decodeStored(backupRaw);
  if (backup) {
    return {
      state: backup,
      source: "backup",
      persisted:
        readDurableRaw(CURRENT_SAVE_BACKUP_KEY, explicitStorage) === backupRaw,
      recoveryRequired: true,
      corruptPrimary: Boolean(primaryRaw),
      corruptPreserved: Boolean(corrupt?.persisted),
      corruptIndex: corrupt?.index ?? null,
      resetRecovery,
    };
  }

  return {
    state: createGameState(),
    source: primaryRaw ? "fresh-after-corruption" : "fresh",
    persisted: false,
    recoveryRequired: Boolean(primaryRaw),
    corruptPrimary: Boolean(primaryRaw),
    corruptPreserved: Boolean(corrupt?.persisted),
    corruptIndex: corrupt?.index ?? null,
    resetRecovery,
  };
}

export function loadCurrentSave(explicitStorage) {
  return loadCurrentSaveWithStatus(explicitStorage).state;
}

export function loadCurrentBackup(explicitStorage) {
  return decodeStored(readRaw(CURRENT_SAVE_BACKUP_KEY, explicitStorage));
}

export function writeCurrentSaveWithStatus(
  state,
  explicitStorage,
  options = {},
) {
  const serialized = serializeCurrentSave(state, options);
  const previous = readRaw(CURRENT_SAVE_KEY, explicitStorage);
  const corrupt =
    previous && !decodeStored(previous)
      ? quarantineCorruptRaw(previous, explicitStorage)
      : null;
  if (corrupt && !corrupt.persisted) {
    writeSessionRaw(CURRENT_SAVE_KEY, serialized, explicitStorage);
    return {
      state: normalizeCurrentSave(state, options),
      persisted: false,
      sessionFallback: true,
      backupAttempted: false,
      backupPersisted: null,
      recoverySafe: false,
      blockedByCorruptPrimary: true,
      corruptPreserved: false,
    };
  }
  const backupAttempted = Boolean(
    previous && previous !== serialized && decodeStored(previous),
  );
  const backupPersisted = backupAttempted
    ? writeRaw(CURRENT_SAVE_BACKUP_KEY, previous, explicitStorage)
    : null;
  if (backupAttempted && !backupPersisted) {
    return {
      state: normalizeCurrentSave(state, options),
      persisted: false,
      sessionFallback: true,
      backupAttempted,
      backupPersisted: false,
      recoverySafe: false,
      blockedByBackupFailure: true,
      blockedByCorruptPrimary: false,
      corruptPreserved: Boolean(corrupt?.persisted),
    };
  }
  const persisted = writeRaw(CURRENT_SAVE_KEY, serialized, explicitStorage);
  return {
    state: normalizeCurrentSave(state, options),
    persisted,
    sessionFallback: !persisted,
    backupAttempted,
    backupPersisted,
    recoverySafe: persisted && (!backupAttempted || backupPersisted),
    blockedByBackupFailure: false,
    blockedByCorruptPrimary: false,
    corruptPreserved: Boolean(corrupt?.persisted),
  };
}

export function writeCurrentSave(state, explicitStorage, options = {}) {
  return writeCurrentSaveWithStatus(state, explicitStorage, options).state;
}

export function writeCurrentSaveSlotWithStatus(
  state,
  slot,
  explicitStorage,
  options = {},
) {
  const index = safeInteger(slot, 0, 0, 2);
  const key = `${CURRENT_SAVE_SLOT_PREFIX}${index}`;
  const backupKey = `${CURRENT_SAVE_SLOT_BACKUP_PREFIX}${index}`;
  const serialized = serializeCurrentSave(state, options);
  const previous = readRaw(key, explicitStorage);
  const backupAttempted = Boolean(
    previous && previous !== serialized && decodeStored(previous),
  );
  const backupPersisted = backupAttempted
    ? writeRaw(backupKey, previous, explicitStorage)
    : null;
  if (backupAttempted && !backupPersisted) {
    return {
      state: normalizeCurrentSave(state, options),
      slot: index,
      persisted: false,
      sessionFallback: false,
      backupAttempted,
      backupPersisted: false,
      recoverySafe: false,
      blockedByBackupFailure: true,
    };
  }
  const persisted = writeRaw(key, serialized, explicitStorage);
  return {
    state: normalizeCurrentSave(state, options),
    slot: index,
    persisted,
    sessionFallback: !persisted,
    backupAttempted,
    backupPersisted,
    recoverySafe: persisted && (!backupAttempted || backupPersisted),
    blockedByBackupFailure: false,
  };
}

export function writeCurrentSaveSlot(
  state,
  slot,
  explicitStorage,
  options = {},
) {
  return writeCurrentSaveSlotWithStatus(state, slot, explicitStorage, options)
    .state;
}

export function loadCurrentSaveSlot(slot, explicitStorage) {
  const index = safeInteger(slot, 0, 0, 2);
  return decodeStored(
    readRaw(`${CURRENT_SAVE_SLOT_PREFIX}${index}`, explicitStorage),
  );
}

export function loadCurrentSaveSlotBackup(slot, explicitStorage) {
  const index = safeInteger(slot, 0, 0, 2);
  return (
    decodeStored(
      readRaw(`${CURRENT_SAVE_SLOT_STAGING_PREFIX}${index}`, explicitStorage),
    ) ??
    decodeStored(
      readRaw(`${CURRENT_SAVE_SLOT_BACKUP_PREFIX}${index}`, explicitStorage),
    )
  );
}

export function restoreCurrentSaveSlotBackup(
  slot,
  explicitStorage,
  options = {},
) {
  const index = safeInteger(slot, 0, 0, 2);
  const key = `${CURRENT_SAVE_SLOT_PREFIX}${index}`;
  const backupKey = `${CURRENT_SAVE_SLOT_BACKUP_PREFIX}${index}`;
  const stagingKey = `${CURRENT_SAVE_SLOT_STAGING_PREFIX}${index}`;
  const existingStagingRaw = readRaw(stagingKey, explicitStorage);
  const existingStaging = decodeStored(existingStagingRaw);
  const backupRaw = existingStaging
    ? existingStagingRaw
    : readRaw(backupKey, explicitStorage);
  const backup = decodeStored(backupRaw);
  if (!backup || !backupRaw) {
    return {
      ok: false,
      state: null,
      slot: index,
      persisted: false,
      sessionFallback: false,
      recoverySafe: false,
    };
  }

  const currentRaw = readRaw(key, explicitStorage);
  const current = decodeStored(currentRaw);
  if (existingStaging && existingStagingRaw) {
    const backupPersisted =
      current && currentRaw
        ? writeRaw(backupKey, currentRaw, explicitStorage)
        : removeRaw(backupKey, explicitStorage);
    if (!backupPersisted) {
      return {
        ok: false,
        state: null,
        slot: index,
        persisted: false,
        sessionFallback: false,
        recoverySafe: true,
      };
    }
    const persisted = writeRaw(key, existingStagingRaw, explicitStorage);
    if (persisted) removeRaw(stagingKey, explicitStorage);
    return {
      ok: persisted,
      state: persisted ? normalizeCurrentSave(existingStaging, options) : null,
      slot: index,
      persisted,
      sessionFallback: !persisted,
      backupPersisted,
      recoverySafe: backupPersisted,
    };
  }

  const stagingPersisted =
    current && currentRaw
      ? writeRaw(stagingKey, currentRaw, explicitStorage)
      : true;
  if (!stagingPersisted) {
    return {
      ok: false,
      state: null,
      slot: index,
      persisted: false,
      sessionFallback: false,
      recoverySafe: false,
    };
  }
  const persisted = writeRaw(key, backupRaw, explicitStorage);
  if (!persisted) {
    if (current && currentRaw) removeRaw(stagingKey, explicitStorage);
    return {
      ok: false,
      state: null,
      slot: index,
      persisted: false,
      sessionFallback: true,
      recoverySafe: true,
    };
  }
  const backupPersisted =
    current && currentRaw
      ? writeRaw(backupKey, currentRaw, explicitStorage)
      : removeRaw(backupKey, explicitStorage);
  if (backupPersisted && current && currentRaw)
    removeRaw(stagingKey, explicitStorage);
  return {
    ok: true,
    state: normalizeCurrentSave(backup, options),
    slot: index,
    persisted,
    sessionFallback: !persisted,
    backupPersisted,
    stagingPersisted,
    recoverySafe: persisted && (backupPersisted || stagingPersisted),
  };
}

export function listCurrentSaveSlots(explicitStorage) {
  return [0, 1, 2].map((index) => {
    const state = loadCurrentSaveSlot(index, explicitStorage);
    const backup = loadCurrentSaveSlotBackup(index, explicitStorage);
    return state
      ? {
          index,
          occupied: true,
          lineageId: state.lineageId,
          journeyNumber: state.progression.journeyNumber,
          breakpoints: state.receipts.breakpoints.length,
          scalePeaks: state.receipts.scalePeaks.length,
          backupAvailable: Boolean(backup),
          backupJourneyNumber: backup?.progression.journeyNumber ?? 0,
          backupBreakpoints: backup?.receipts.breakpoints.length ?? 0,
          backupScalePeaks: backup?.receipts.scalePeaks.length ?? 0,
        }
      : {
          index,
          occupied: false,
          lineageId: null,
          journeyNumber: 0,
          breakpoints: 0,
          scalePeaks: 0,
          backupAvailable: Boolean(backup),
          backupJourneyNumber: backup?.progression.journeyNumber ?? 0,
          backupBreakpoints: backup?.receipts.breakpoints.length ?? 0,
          backupScalePeaks: backup?.receipts.scalePeaks.length ?? 0,
        };
  });
}

export function exportCurrentSave(state, options = {}) {
  return serializeCurrentSave(state, options);
}

export function importCurrentSave(value, explicitStorage, options = {}) {
  const preview = previewCurrentImport(value, options);
  if (!preview.ok || options.commit === false)
    return { ...preview, committed: false };
  const result = writeCurrentSaveWithStatus(
    preview.state,
    explicitStorage,
    options,
  );
  return { ...preview, ...result, committed: true };
}

export function resetCurrentSaveWithStatus(explicitStorage) {
  // localStorage has no transaction primitive. Keep a durable, bounded undo
  // record until every key is gone so a thrown removeItem cannot leave a
  // half-reset lineage while the UI reports that reset failed.
  const interrupted = recoverInterruptedReset(explicitStorage);
  if (!interrupted.safeToContinue) {
    return {
      state: createGameState(),
      persisted: false,
      sessionFallback: true,
      recoverySafe: false,
      rolledBack: false,
      blockedByInterruptedReset: true,
    };
  }
  const snapshot = createResetSnapshot(explicitStorage);
  const prepared = writeRaw(
    CURRENT_SAVE_RESET_SNAPSHOT_KEY,
    JSON.stringify(snapshot),
    explicitStorage,
  );
  if (!prepared) {
    removeRaw(CURRENT_SAVE_RESET_SNAPSHOT_KEY, explicitStorage);
    return {
      state: createGameState(),
      persisted: false,
      sessionFallback: true,
      recoverySafe: true,
      rolledBack: true,
    };
  }

  let removed = true;
  for (const key of resetTargetKeys()) {
    if (!removeRaw(key, explicitStorage)) {
      removed = false;
      break;
    }
  }
  if (!removed) {
    const rolledBack = restoreResetSnapshot(snapshot, explicitStorage);
    if (rolledBack) removeRaw(CURRENT_SAVE_RESET_SNAPSHOT_KEY, explicitStorage);
    return {
      state: createGameState(),
      persisted: false,
      sessionFallback: true,
      recoverySafe: rolledBack,
      rolledBack,
    };
  }

  const committed = writeRaw(
    CURRENT_SAVE_RESET_SNAPSHOT_KEY,
    JSON.stringify({ ...snapshot, phase: "committed" }),
    explicitStorage,
  );
  if (!committed) {
    const rolledBack = restoreResetSnapshot(snapshot, explicitStorage);
    if (rolledBack) removeRaw(CURRENT_SAVE_RESET_SNAPSHOT_KEY, explicitStorage);
    return {
      state: createGameState(),
      persisted: false,
      sessionFallback: true,
      recoverySafe: rolledBack,
      rolledBack,
    };
  }

  const snapshotCleanupPersisted = removeRaw(
    CURRENT_SAVE_RESET_SNAPSHOT_KEY,
    explicitStorage,
  );
  return {
    state: createGameState(),
    persisted: true,
    sessionFallback: false,
    recoverySafe: true,
    rolledBack: false,
    snapshotCleanupPersisted,
  };
}

export function resetCurrentSave(explicitStorage) {
  return resetCurrentSaveWithStatus(explicitStorage).state;
}

// Concise aliases make the persistence boundary easy to consume without ever
// touching the archived legacy save module.
export const normalizeSave = normalizeCurrentSave;
export const serializeSave = serializeCurrentSave;
export const deserializeSave = deserializeCurrentSave;
export const previewImport = previewCurrentImport;
