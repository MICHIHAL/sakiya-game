import {
  ACTIVITY_DEFINITIONS,
  ACTIVITY_IDS,
  BREAKPOINTS,
  BROADCAST_PLANS,
  COMPLETION_CANDIDATE,
  FICTIONAL_PEOPLE,
  P0_AXIS_DEFINITIONS,
  P0_TEST_DEPENDENT_TUNING,
  SCALE_PEAKS,
  UNIT_LABELS,
  activityById,
  broadcastPlanById,
  completionChoiceById,
} from "./current-content.js";

export const CURRENT_SCHEMA = 1;
export const OFFLINE_CAP_SECONDS = 8 * 60 * 60;

const MAX_EVENT_HISTORY = 480;
const MAX_RECENT_EVENTS = 48;
const MAX_WORKS = 240;
const MAX_PEOPLE = FICTIONAL_PEOPLE.length;

const COMMAND_ALIASES = Object.freeze({
  FIRST_LAUNCH: "FIRST_LAUNCH",
  PROFILE: "PROFILE",
  PROFILE_CREATE: "PROFILE",
  SKIP_PROFILE: "SKIP_PROFILE",
  BROADCAST: "BROADCAST_BEFORE",
  START_BROADCAST: "BROADCAST_BEFORE",
  BROADCAST_BEFORE: "BROADCAST_BEFORE",
  BEFORE: "BROADCAST_BEFORE",
  BROADCAST_LIVE: "BROADCAST_LIVE",
  LIVE: "BROADCAST_LIVE",
  BROADCAST_AFTER: "BROADCAST_AFTER",
  AFTER: "BROADCAST_AFTER",
  SILENT: "SILENT_PRESENCE",
  SILENT_PRESENCE: "SILENT_PRESENCE",
  OBSERVE: "SILENT_PRESENCE",
  REACT: "REACT",
  COMMENT: "COMMENT",
  PRESERVE: "PRESERVE_MOMENT",
  PRESERVE_MOMENT: "PRESERVE_MOMENT",
  CREATE_VIDEO: "CREATE_VIDEO",
  VIDEO: "CREATE_VIDEO",
  PRACTICE_SINGING: "PRACTICE_SINGING",
  SINGING: "PRACTICE_SINGING",
  ARRANGE_MUSIC: "ARRANGE_MUSIC",
  MUSIC: "ARRANGE_MUSIC",
  POST_SNS: "POST_SNS",
  SNS: "POST_SNS",
  HOST_LIVE_EVENT: "HOST_LIVE_EVENT",
  LIVE_EVENT: "HOST_LIVE_EVENT",
  BRIDGE: "CREATE_BRIDGE",
  CREATE_BRIDGE: "CREATE_BRIDGE",
  CONNECT_BRIDGE: "CREATE_BRIDGE",
  AUTOMATION: "ENABLE_AUTOMATION",
  ENABLE_AUTOMATION: "ENABLE_AUTOMATION",
  SET_AUTOMATION: "ENABLE_AUTOMATION",
  PRESTIGE: "PRESTIGE",
  SCALE: "SCALE_CANDIDATE",
  SCALE_PEAK: "SCALE_CANDIDATE",
  SCALE_CANDIDATE: "SCALE_CANDIDATE",
  FINAL_ANCHOR_BROADCAST: "FINAL_ANCHOR_BROADCAST",
  BEGIN_FINAL_ANCHOR_BROADCAST: "FINAL_ANCHOR_BROADCAST",
  ANCHOR_BROADCAST: "FINAL_ANCHOR_BROADCAST",
  COMPLETION_CHOICE: "RECORD_COMPLETION_CHOICE",
  FINAL_CHOICE: "RECORD_COMPLETION_CHOICE",
  RECORD_COMPLETION_CHOICE: "RECORD_COMPLETION_CHOICE",
  COMPLETION: "COMPLETION_CANDIDATE",
  COMPLETION_CANDIDATE: "COMPLETION_CANDIDATE",
  CONTINUE: "CONTINUE",
  STRONG_NEW_GAME: "STRONG_NEW_GAME",
  SETTINGS: "UPDATE_SETTINGS",
  UPDATE_SETTINGS: "UPDATE_SETTINGS",
  SETTING: "UPDATE_SETTINGS",
  MARK_ABSENT: "MARK_ABSENT",
  WELCOME_BACK: "WELCOME_BACK",
  GIFT_OBSERVED: "GIFT_OBSERVED",
  ACK_ENTRY_CHIME_PLAYED: "ACK_ENTRY_CHIME_PLAYED",
  ENTRY_CHIME_PLAYED: "ACK_ENTRY_CHIME_PLAYED",
});

const SETTINGS_DEFAULTS = Object.freeze({
  sound: true,
  captions: true,
  reducedMotion: false,
  highContrast: false,
  fontScale: 1,
  numberNotation: "short",
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function finite(value, fallback = 0, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function integer(value, fallback = 0, min = 0, max = Number.MAX_SAFE_INTEGER) {
  return Math.floor(finite(value, fallback, min, max));
}

function compactText(value, fallback = "", limit = 120) {
  if (typeof value !== "string") return fallback;
  return value.replace(/[\u0000-\u001f]/g, "").trim().slice(0, limit) || fallback;
}

function normalizeSeed(value) {
  const seed = Number(value);
  return Number.isFinite(seed) ? (Math.floor(seed) >>> 0) || 1 : 1;
}

function stateNow(state, options = {}) {
  const supplied = Number(options.now);
  if (!Number.isFinite(supplied)) return state.clock.now;
  return Math.max(state.clock.now, Math.floor(supplied));
}

function makeActivityState(id, unlocked = false) {
  const definition = ACTIVITY_DEFINITIONS[id];
  return {
    id,
    unlocked,
    totalActions: 0,
    output: 0,
    lastCycle: -1,
    limiter: {
      label: definition.limiter,
      usedThisCycle: 0,
      maxPerCycle: id === "broadcast" ? 2 : 1,
    },
  };
}

function createResources() {
  return {
    currentUnit: { id: "U0", value: 0, liveRate: 0 },
    unitValues: { U0: 0 },
    retiredUnits: [],
    materials: 0,
    videoReach: 0,
    vocalMastery: 0,
    musicResonance: 0,
    snsSignal: 0,
    eventAfterglow: 0,
    gifts: 0,
    session: {
      active: false,
      atmosphere: 0,
      attention: 0,
      reactions: 0,
      comments: 0,
    },
  };
}

function createAutomationState() {
  return {
    clip: { available: false, understood: false, enabled: false, completed: 0 },
    archive: { available: false, understood: false, enabled: false, completed: 0 },
    snsSchedule: { available: false, understood: false, enabled: false, completed: 0 },
  };
}

function createProfile(options, now) {
  const supplied = options.profile && typeof options.profile === "object" ? options.profile : null;
  const anonymous = Boolean(options.anonymous || supplied?.anonymous);
  const displayName = compactText(supplied?.displayName ?? options.displayName, "", 48);
  const ready = Boolean(supplied || anonymous || displayName);
  return {
    status: ready ? "ready" : "needs-profile",
    displayName: displayName || (anonymous ? "匿名の参加者" : ""),
    anonymous,
    createdAt: ready ? now : null,
    localOnly: true,
  };
}

export function createGameState(options = {}) {
  const now = integer(options.now, 0, 0, 9_000_000_000_000);
  const seed = normalizeSeed(options.seed);
  const profile = createProfile(options, now);
  const activities = Object.fromEntries(
    ACTIVITY_IDS.map((id) => [id, makeActivityState(id, id === "broadcast")]),
  );

  return {
    schema: CURRENT_SCHEMA,
    lineageId: compactText(options.lineageId, `lineage-${seed.toString(36)}-${now.toString(36)}`, 80),
    clock: {
      now,
      lastAdvancedAt: now,
      lastForegroundAt: now,
    },
    profile,
    phase: profile.status === "ready" ? { kind: "room" } : { kind: "profile" },
    progression: {
      mode: options.p0 ? "p0" : "journey",
      presence: 0,
      coCreation: 0,
      sharedExpansion: 0,
      evidence: 0,
      breakpointIndex: 0,
      scaleIndex: 0,
      currentUnit: "U0",
      macroLayer: 1,
      videoReturnObserved: false,
      completionEligible: false,
      completionCandidate: false,
      journeyNumber: integer(options.journeyNumber, 1, 1, 999),
    },
    resources: createResources(),
    activities,
    people: {
      known: [],
      firstExternalArrivalId: null,
      reversibleAbsences: [],
    },
    works: [],
    bridges: {
      routes: [],
      completed: 0,
    },
    automation: createAutomationState(),
    history: [],
    receipts: {
      breakpoints: [],
      scalePeaks: [],
      prestige: [],
      completion: [],
    },
    pending: {
      preserve: null,
      namedPersonEvents: [],
      offlineEvidence: 0,
      completionCandidate: false,
    },
    settings: { ...SETTINGS_DEFAULTS, ...(options.settings ?? {}) },
    meta: {
      rng: seed,
      eventSerial: 0,
      workSerial: 0,
      broadcastSerial: 0,
      firstArrivalChimePlayed: false,
      // Emitted and heard are intentionally separate. The browser confirms
      // this only after WebAudio actually starts, so a locked/muted/failed
      // first arrival can be retried without inventing another arrival event.
      firstArrivalChimeHeard: false,
      firsts: {
        arrival: false,
        material: false,
        video: false,
        bridge: false,
        automation: false,
      },
      prestigeCount: 0,
      continued: false,
      strongNewGameCount: 0,
    },
    recentEvents: [],
  };
}

function emit(state, events, type, detail = {}, durable = false) {
  state.meta.eventSerial += 1;
  const event = {
    id: `${state.lineageId}:e${state.meta.eventSerial}`,
    type,
    at: state.clock.now,
    ...detail,
  };
  events.push(event);
  state.recentEvents.push(event);
  if (state.recentEvents.length > MAX_RECENT_EVENTS) state.recentEvents.splice(0, state.recentEvents.length - MAX_RECENT_EVENTS);
  if (durable) {
    state.history.push(event);
    if (state.history.length > MAX_EVENT_HISTORY) state.history.splice(0, state.history.length - MAX_EVENT_HISTORY);
  }
  return event;
}

function reject(state, events, command, reason) {
  emit(state, events, "command-blocked", { command, reason });
}

function nextRandom(state) {
  state.meta.rng = (state.meta.rng * 1664525 + 1013904223) >>> 0;
  return state.meta.rng / 4294967296;
}

function nextId(state, prefix) {
  state.meta.workSerial += 1;
  return `${prefix}-${state.progression.journeyNumber}-${state.meta.workSerial}`;
}

function p0AxisValue(value, prefix, fallback) {
  const id = String(value ?? "");
  return id.startsWith(prefix) && P0_AXIS_DEFINITIONS[id] ? id : fallback;
}

function p0ConfigDescriptor(config = {}) {
  const a = p0AxisValue(config.a, "A", "A1");
  const b = p0AxisValue(config.b, "B", "B1");
  const c = p0AxisValue(config.c, "C", "C1");
  return { a, b, c, id: `${a}-${b}-${c}` };
}

function initializeP0Runtime(state, config) {
  const descriptor = p0ConfigDescriptor(config);
  const arrival = P0_TEST_DEPENDENT_TUNING.arrival;
  state.meta.p0 = {
    fixtureId: P0_TEST_DEPENDENT_TUNING.id,
    tuningStatus: P0_TEST_DEPENDENT_TUNING.status,
    config: descriptor,
    axes: {
      a: P0_AXIS_DEFINITIONS[descriptor.a].label,
      b: P0_AXIS_DEFINITIONS[descriptor.b].label,
      c: P0_AXIS_DEFINITIONS[descriptor.c].label,
    },
    participation: { silent: 0, reactions: 0, comments: 0 },
    arrival: {
      supplyModel: P0_AXIS_DEFINITIONS[descriptor.b].pool,
      constantUses: 0,
      sharedPool: descriptor.b === "B2" ? arrival.sharedPoolCapacity : null,
      interestPools:
        descriptor.b === "B3"
          ? { room: arrival.interestPoolCapacity, video: arrival.interestPoolCapacity, archive: arrival.interestPoolCapacity }
          : {},
      consumed: 0,
      recovered: 0,
      blocked: 0,
      videoOpportunities: 0,
    },
    video: {
      nestingModel: P0_AXIS_DEFINITIONS[descriptor.c].nesting,
      created: 0,
      directReach: 0,
      interestReach: 0,
      subscriberEvidence: 0,
      longTailBase: 0,
      producerBoost: 0,
      boundedOpportunity: 0,
    },
    actionTrace: [],
    forcedWaitSeconds: 0,
  };
}

function p0Runtime(state) {
  const runtime = state.progression.mode === "p0" ? state.meta?.p0 : null;
  return runtime && runtime.config ? runtime : null;
}

function p0Round(value) {
  return Number(Number(value).toFixed(4));
}

function p0RecordAction(state, action) {
  const runtime = p0Runtime(state);
  if (!runtime) return;
  runtime.actionTrace.push(action);
  if (runtime.actionTrace.length > 48) runtime.actionTrace.splice(0, runtime.actionTrace.length - 48);
}

function p0InterestKey(state) {
  if (state.phase?.planId === "video-return") return "video";
  if (state.phase?.planId === "material-return") return "archive";
  return "room";
}

function consumeP0ArrivalOpportunity(state, events, source) {
  const runtime = p0Runtime(state);
  if (!runtime) return true;
  const { arrival } = runtime;
  const { b } = runtime.config;
  const interest = p0InterestKey(state);

  if (b === "B1") {
    arrival.constantUses += 1;
    p0RecordAction(state, "arrival:constant");
    return true;
  }

  if (b === "B2") {
    if (arrival.sharedPool >= 1) {
      arrival.sharedPool = p0Round(arrival.sharedPool - 1);
      arrival.consumed += 1;
      p0RecordAction(state, "arrival:shared-pool");
      return true;
    }
  } else {
    const available = arrival.interestPools[interest] ?? 0;
    if (available >= 1) {
      arrival.interestPools[interest] = p0Round(available - 1);
      arrival.consumed += 1;
      p0RecordAction(state, `arrival:interest-${interest}`);
      return true;
    }
  }

  arrival.blocked += 1;
  p0RecordAction(state, "arrival:pool-held;asset-route-remains");
  emit(state, events, "p0-arrival-pool-held", {
    source,
    pool: b === "B2" ? "shared" : interest,
    meaningfulAlternative: "preserve-or-publish-asset",
    testDependent: true,
  });
  return false;
}

function grantP0VideoOpportunity(state, events, source, requested, interest = "video") {
  const runtime = p0Runtime(state);
  if (!runtime) return 0;
  const requestedAmount = finite(requested, 0, 0, P0_TEST_DEPENDENT_TUNING.limiter.maxArrivalOpportunityPerCycle);
  const amount = Math.min(requestedAmount, P0_TEST_DEPENDENT_TUNING.limiter.maxArrivalOpportunityPerCycle);
  const { arrival } = runtime;
  arrival.videoOpportunities += amount;
  runtime.video.boundedOpportunity += amount;
  const { b } = runtime.config;

  // B2's opportunity returns through the Asset Idle recovery path below,
  // rather than as an immediate replacement arrival. This makes recovery
  // observable and keeps a Broadcast from being a self-refilling source.
  if (b === "B3") {
    const capacity = P0_TEST_DEPENDENT_TUNING.arrival.interestPoolCapacity;
    const current = arrival.interestPools[interest] ?? 0;
    const added = Math.min(amount, Math.max(0, capacity - current));
    arrival.interestPools[interest] = p0Round(current + added);
  }

  emit(state, events, "p0-video-arrival-opportunity", {
    source,
    amount,
    interest,
    bounded: true,
    testDependent: true,
  });
  return amount;
}

function applyP0VideoNesting(state, events, work) {
  const runtime = p0Runtime(state);
  if (!runtime) return;
  const video = runtime.video;
  const { c } = runtime.config;
  let reach = 0;
  let source = "direct-video";

  video.created += 1;
  if (c === "C1") {
    reach = P0_TEST_DEPENDENT_TUNING.video.c1DirectReach;
    video.directReach += reach;
    grantP0VideoOpportunity(state, events, source, P0_TEST_DEPENDENT_TUNING.arrival.directVideoOpportunity);
  } else if (c === "C2") {
    reach = P0_TEST_DEPENDENT_TUNING.video.c2InterestReach;
    source = "shallow-interest-video";
    video.interestReach += reach;
    video.subscriberEvidence += 1;
    grantP0VideoOpportunity(state, events, source, P0_TEST_DEPENDENT_TUNING.arrival.directVideoOpportunity, "video");
  } else {
    const boost = Math.min(
      video.longTailBase,
      P0_TEST_DEPENDENT_TUNING.video.c3ProducerBoostCap,
      P0_TEST_DEPENDENT_TUNING.limiter.maxDeepProducerBoostPerVideo,
    );
    reach = P0_TEST_DEPENDENT_TUNING.video.c3InitialReach + boost;
    source = "deep-constrained-video";
    video.interestReach += reach;
    video.subscriberEvidence += 1;
    video.producerBoost += boost;
    video.longTailBase = Math.min(
      P0_TEST_DEPENDENT_TUNING.video.c3LongTailCap,
      video.longTailBase + P0_TEST_DEPENDENT_TUNING.video.c3LongTailPerVideo,
    );
    grantP0VideoOpportunity(state, events, source, P0_TEST_DEPENDENT_TUNING.arrival.directVideoOpportunity, "video");
  }

  state.resources.videoReach = finite(state.resources.videoReach + reach, 0, 0, 1e100);
  work.provenance.p0 = {
    fixtureId: runtime.fixtureId,
    configId: runtime.config.id,
    nesting: video.nestingModel,
    initialReach: reach,
  };
  p0RecordAction(state, `video:${video.nestingModel}`);
  emit(state, events, "p0-video-nesting-applied", {
    workId: work.id,
    config: runtime.config.id,
    nesting: video.nestingModel,
    reach,
    bounded: true,
    testDependent: true,
  }, true);
}

function recoverP0ArrivalPools(state, assetOutput, seconds) {
  const runtime = p0Runtime(state);
  if (!runtime || assetOutput <= 0 || seconds <= 0) return;
  const { arrival } = runtime;
  const { b } = runtime.config;
  if (b === "B2") {
    const recovery = Math.min(
      P0_TEST_DEPENDENT_TUNING.arrival.sharedPoolRecoveryPerAssetSecond * seconds,
      Math.max(0, P0_TEST_DEPENDENT_TUNING.arrival.sharedPoolCapacity - arrival.sharedPool),
    );
    arrival.sharedPool = p0Round(arrival.sharedPool + recovery);
    arrival.recovered = p0Round(arrival.recovered + recovery);
  } else if (b === "B3") {
    for (const interest of Object.keys(arrival.interestPools)) {
      const recovery = Math.min(
        P0_TEST_DEPENDENT_TUNING.arrival.interestPoolRecoveryPerAssetSecond * seconds,
        Math.max(0, P0_TEST_DEPENDENT_TUNING.arrival.interestPoolCapacity - arrival.interestPools[interest]),
      );
      arrival.interestPools[interest] = p0Round(arrival.interestPools[interest] + recovery);
      arrival.recovered = p0Round(arrival.recovered + recovery);
    }
  }
}

function incrementActiveUnit(state, amount) {
  const gain = finite(amount, 0, 0, 1e100);
  const current = state.resources.currentUnit;
  current.value = finite(current.value + gain, 0, 0, 1e100);
  state.resources.unitValues[current.id] = current.value;
}

function addEvidence(state, amount, kind = "shared") {
  const gain = finite(amount, 0, 0, 1e6);
  state.progression.evidence = finite(state.progression.evidence + gain, 0, 0, 1e9);
  if (kind === "presence") state.progression.presence += gain;
  if (kind === "coCreation") state.progression.coCreation += gain;
  if (kind === "shared") state.progression.sharedExpansion += gain;
}

function knownPerson(state, personId) {
  return state.people.known.find((person) => person.id === personId) ?? null;
}

function addOrReturnPerson(state, events, source) {
  if (!consumeP0ArrivalOpportunity(state, events, source)) return;
  const first = !state.meta.firsts.arrival;
  if (first) {
    const person = FICTIONAL_PEOPLE[Math.floor(nextRandom(state) * FICTIONAL_PEOPLE.length)] ?? FICTIONAL_PEOPLE[0];
    const entry = {
      id: person.id,
      displayName: person.displayName,
      fictional: true,
      status: "present",
      firstSeenAt: state.clock.now,
      lastSeenAt: state.clock.now,
      visits: 1,
      history: ["arrival"],
    };
    state.people.known.push(entry);
    state.people.firstExternalArrivalId = entry.id;
    state.meta.firsts.arrival = true;
    addEvidence(state, 1, "presence");
    emit(state, events, "external-fictional-arrival", {
      personId: entry.id,
      displayName: entry.displayName,
      source,
      caption: "誰か来た。",
      visualCue: "entry-marker",
    }, true);
    if (!state.meta.firstArrivalChimePlayed) {
      state.meta.firstArrivalChimePlayed = true;
      emit(state, events, "entry-chime", {
        audioKey: "entry-chime-canonical",
        caption: "入室音",
        visualCue: "entry-marker",
        lineageOnce: true,
      }, true);
    }
    return;
  }

  const people = state.people.known;
  if (!people.length) return;
  const person = people[Math.floor(nextRandom(state) * people.length)] ?? people[0];
  person.status = "present";
  person.lastSeenAt = state.clock.now;
  person.visits += 1;
  person.history.push("revisit");
  person.history = person.history.slice(-16);
  emit(state, events, "fictional-person-revisit", {
    personId: person.id,
    displayName: person.displayName,
    source,
  }, true);
}

function markOnePersonAway(state, events) {
  const person = state.people.known.find((candidate) => candidate.status === "present");
  if (!person) return;
  person.status = "away";
  person.history.push("away");
  person.history = person.history.slice(-16);
  state.people.reversibleAbsences = [...new Set([...state.people.reversibleAbsences, person.id])].slice(-MAX_PEOPLE);
  emit(state, events, "fictional-person-away", {
    personId: person.id,
    displayName: person.displayName,
    reversible: true,
  }, true);
}

function hasWork(state, type) {
  return state.works.some((work) => work.type === type);
}

function hasRequirement(state, requirement) {
  switch (requirement) {
    case "first-arrival":
      return state.meta.firsts.arrival;
    case "broadcast":
      return state.activities.broadcast.totalActions > 0;
    case "material":
      return hasWork(state, "material");
    case "video":
      return hasWork(state, "video");
    case "video-return":
      return state.progression.videoReturnObserved;
    case "singing":
      return state.activities.singing.totalActions > 0;
    case "music":
      return hasWork(state, "music");
    case "sns":
      return state.activities.sns.totalActions > 0;
    case "liveEvent":
      return state.activities.liveEvent.totalActions > 0;
    case "bridge":
      return state.bridges.routes.length > 0;
    case "automation":
      return Object.values(state.automation).some((entry) => entry.enabled);
    default:
      return false;
  }
}

function updateAvailability(state) {
  const breakpointIndex = state.progression.breakpointIndex;
  state.activities.video.unlocked = state.resources.materials > 0 || breakpointIndex >= 2;
  state.activities.singing.unlocked = breakpointIndex >= 3;
  state.activities.music.unlocked = breakpointIndex >= 4;
  state.activities.sns.unlocked = breakpointIndex >= 5;
  state.activities.liveEvent.unlocked = breakpointIndex >= 6;

  state.automation.clip.available = breakpointIndex >= 2;
  state.automation.archive.available = breakpointIndex >= 6;
  state.automation.snsSchedule.available = breakpointIndex >= 7;
  state.automation.clip.understood = state.activities.video.totalActions > 0;
  state.automation.archive.understood = hasWork(state, "material") && state.activities.broadcast.totalActions >= 2;
  state.automation.snsSchedule.understood = state.activities.sns.totalActions > 0;
}

function evaluateBreakpoints(state, events) {
  let advanced = false;
  while (state.progression.breakpointIndex < BREAKPOINTS.length) {
    const breakpoint = BREAKPOINTS[state.progression.breakpointIndex];
    const ready =
      state.progression.evidence >= breakpoint.threshold &&
      breakpoint.requires.every((requirement) => hasRequirement(state, requirement));
    if (!ready) break;

    state.progression.breakpointIndex += 1;
    const receipt = {
      id: breakpoint.id,
      kind: "breakpoint",
      at: state.clock.now,
      layer: breakpoint.layer,
      change: breakpoint.change,
      evidence: state.progression.evidence,
    };
    state.receipts.breakpoints.push(receipt);
    emit(state, events, "breakpoint-reached", receipt, true);
    advanced = true;
    updateAvailability(state);
  }
  return advanced;
}

function normalizeCommand(command, options) {
  const raw = typeof command === "string" ? { type: command, ...options } : { ...(command ?? {}) };
  const normalized = String(raw.type ?? raw.command ?? "").trim().toUpperCase().replace(/[ -]/g, "_");
  return { ...raw, type: COMMAND_ALIASES[normalized] ?? normalized };
}

function profileReady(state, events, command) {
  if (state.profile.status === "ready") return true;
  reject(state, events, command, "profile-required");
  return false;
}

function activeBroadcast(state) {
  return ["broadcast-before", "broadcast-live", "broadcast-after"].includes(state.phase.kind);
}

function completionReceiptsForCurrentJourney(state) {
  return state.receipts.completion.filter((receipt) => receipt?.journeyNumber === state.progression.journeyNumber);
}

function isFinalAnchorPlan(planId) {
  return planId === COMPLETION_CANDIDATE.anchorPlanId;
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function workWithId(works, id) {
  if (!hasText(id) || !Array.isArray(works)) return null;
  const matches = works.filter((work) => work?.id === id);
  return matches.length === 1 ? matches[0] : null;
}

function recordWithId(records, id) {
  if (!hasText(id) || !Array.isArray(records)) return null;
  const matches = records.filter((record) => record?.id === id);
  return matches.length === 1 ? matches[0] : null;
}

function workHasActivity(work, activity, type) {
  return (
    work?.type === type &&
    work?.provenance?.activity === activity &&
    hasText(work.id)
  );
}

function activityHasAction(state, activity) {
  return Number(state?.activities?.[activity]?.totalActions) > 0;
}

function isBroadcastMaterial(work) {
  return (
    workHasActivity(work, "broadcast", "material") &&
    hasText(work.provenance.broadcastId)
  );
}

function isVideoContributionWork(work, works) {
  return (
    workHasActivity(work, "video", "video") &&
    isBroadcastMaterial(workWithId(works, work.provenance.materialId))
  );
}

function isSingingContributionWork(work) {
  return (
    workHasActivity(work, "singing", "take") &&
    hasText(work.provenance.focus)
  );
}

function isMusicContributionWork(work, works) {
  if (!workHasActivity(work, "music", "music")) return false;
  const source = workWithId(works, work.provenance.sourceWorkId);
  return isSingingContributionWork(source) || isBroadcastMaterial(source);
}

function latestMatching(records, predicate) {
  if (!Array.isArray(records)) return null;
  for (let index = records.length - 1; index >= 0; index -= 1) {
    if (predicate(records[index])) return records[index];
  }
  return null;
}

function liveEventSourceWorks(work, works) {
  const provenance = work?.provenance ?? {};
  const hasVideoId = hasText(provenance.videoWorkId);
  const hasMusicId = hasText(provenance.musicWorkId);
  if (hasVideoId || hasMusicId) {
    if (!hasVideoId || !hasMusicId) return null;
    const video = workWithId(works, provenance.videoWorkId);
    const music = workWithId(works, provenance.musicWorkId);
    return isVideoContributionWork(video, works) && isMusicContributionWork(music, works)
      ? { video, music }
      : null;
  }
  // Pre-snapshot local saves did not retain the two source ids on an event
  // record.  They can be upgraded only when the retained works still prove
  // both inputs; otherwise this is not a valid completion contribution.
  const video = latestMatching(works, (candidate) =>
    isVideoContributionWork(candidate, works),
  );
  const music = latestMatching(works, (candidate) =>
    isMusicContributionWork(candidate, works),
  );
  return video && music ? { video, music } : null;
}

function isLiveEventContributionWork(work, works) {
  return (
    workHasActivity(work, "liveEvent", "event-record") &&
    Boolean(liveEventSourceWorks(work, works))
  );
}

function snsSourceWorkId(record) {
  if (record?.provenance != null) {
    if (record.provenance?.activity !== "sns") return null;
    const sourceWorkId = record.provenance.sourceWorkId;
    if (!hasText(sourceWorkId)) return null;
    if (hasText(record.sourceWorkId) && record.sourceWorkId !== sourceWorkId)
      return null;
    return sourceWorkId;
  }
  // Before the explicit SNS provenance object was introduced, the durable
  // `sourceWorkId` was the provenance-bearing relation.  Keep that local
  // save format resumable only when it still resolves below.
  return hasText(record?.sourceWorkId) ? record.sourceWorkId : null;
}

function isSnsContributionRecord(record, works) {
  if (record?.type !== "sns-posted" || !hasText(record.id)) return false;
  const source = workWithId(works, snsSourceWorkId(record));
  return (
    isBroadcastMaterial(source) ||
    isVideoContributionWork(source, works) ||
    isMusicContributionWork(source, works)
  );
}

function contributionBasisForWork(activity, work, works) {
  switch (activity) {
    case "broadcast":
      return isBroadcastMaterial(work)
        ? {
            activity: "broadcast",
            broadcastId: work.provenance.broadcastId,
            planId: hasText(work.provenance.planId)
              ? work.provenance.planId
              : null,
          }
        : null;
    case "video":
      return isVideoContributionWork(work, works)
        ? {
            activity: "video",
            materialId: work.provenance.materialId,
            sourceBroadcastId: hasText(work.provenance.sourceBroadcastId)
              ? work.provenance.sourceBroadcastId
              : null,
          }
        : null;
    case "singing":
      return isSingingContributionWork(work)
        ? { activity: "singing", focus: work.provenance.focus }
        : null;
    case "music":
      return isMusicContributionWork(work, works)
        ? { activity: "music", sourceWorkId: work.provenance.sourceWorkId }
        : null;
    case "liveEvent": {
      const sources = isLiveEventContributionWork(work, works)
        ? liveEventSourceWorks(work, works)
        : null;
      return sources
        ? {
            activity: "liveEvent",
            videoWorkId: sources.video.id,
            musicWorkId: sources.music.id,
          }
        : null;
    }
    default:
      return null;
  }
}

function contributionForWork(state, activity, work) {
  if (!activityHasAction(state, activity)) return null;
  const basis = contributionBasisForWork(activity, work, state?.works ?? []);
  return basis && hasText(work?.id)
    ? { activity, workId: work.id, provenance: basis }
    : null;
}

function contributionForSnsRecord(state, record) {
  if (!activityHasAction(state, "sns")) return null;
  const sourceWorkId = snsSourceWorkId(record);
  return isSnsContributionRecord(record, state?.works ?? [])
    ? {
        activity: "sns",
        recordId: record.id,
        provenance: { activity: "sns", sourceWorkId },
      }
    : null;
}

function latestContributionForActivity(state, activity) {
  if (activity === "sns") {
    const record = latestMatching(state?.history, (candidate) =>
      Boolean(contributionForSnsRecord(state, candidate)),
    );
    return record ? contributionForSnsRecord(state, record) : null;
  }
  const work = latestMatching(state?.works, (candidate) =>
    Boolean(contributionForWork(state, activity, candidate)),
  );
  return work ? contributionForWork(state, activity, work) : null;
}

function isFinalAnchorMaterial(work) {
  return (
    isBroadcastMaterial(work) &&
    work.provenance.planId === COMPLETION_CANDIDATE.anchorPlanId
  );
}

function activityContributionEqual(actual, expected) {
  if (!isRecord(actual) || !isRecord(expected)) return false;
  if (actual.activity !== expected.activity) return false;
  const idKey = hasText(expected.workId) ? "workId" : "recordId";
  const otherIdKey = idKey === "workId" ? "recordId" : "workId";
  if (!hasText(actual[idKey]) || actual[idKey] !== expected[idKey]) return false;
  if (hasText(actual[otherIdKey])) return false;
  if (!isRecord(actual.provenance) || !isRecord(expected.provenance)) return false;
  const actualKeys = Object.keys(actual.provenance).sort();
  const expectedKeys = Object.keys(expected.provenance).sort();
  return (
    actualKeys.length === expectedKeys.length &&
    actualKeys.every(
      (key, index) =>
        key === expectedKeys[index] &&
        actual.provenance[key] === expected.provenance[key],
    )
  );
}

function contributionForSnapshotEntry(state, activity, entry, anchorWork) {
  if (!isRecord(entry) || entry.activity !== activity) return null;
  if (activity === "sns") {
    return contributionForSnsRecord(
      state,
      recordWithId(state?.history, entry.recordId),
    );
  }
  const work = workWithId(state?.works, entry.workId);
  if (activity === "broadcast" && work !== anchorWork) return null;
  return contributionForWork(state, activity, work);
}

function hasValidAnchorContributionSnapshot(state, anchorWork, contributions) {
  return (
    isFinalAnchorMaterial(anchorWork) &&
    Array.isArray(contributions) &&
    contributions.length === ACTIVITY_IDS.length &&
    ACTIVITY_IDS.every((activity, index) => {
      const expected = contributionForSnapshotEntry(
        state,
        activity,
        contributions[index],
        anchorWork,
      );
      return Boolean(expected && activityContributionEqual(contributions[index], expected));
    })
  );
}

export function buildFinalAnchorActivityContributions(state, anchorWork) {
  if (!isFinalAnchorMaterial(anchorWork)) return null;
  const contributions = ACTIVITY_IDS.map((activity) => {
    if (activity === "broadcast")
      return contributionForWork(state, activity, anchorWork);
    return latestContributionForActivity(state, activity);
  });
  return contributions.every(Boolean) ? contributions : null;
}

/**
 * Completion is backed by retained, inspectable contribution records rather
 * than the convenience counters in `activities`.  This is deliberately
 * structural: a saved U10 flag cannot stand in for the work that got there.
 */
export function getCompletionActivityContributions(state) {
  return Object.fromEntries(
    ACTIVITY_IDS.map((id) => [
      id,
      Boolean(latestContributionForActivity(state, id)),
    ]),
  );
}

export function hasCompletionActivityContributions(state) {
  return Object.values(getCompletionActivityContributions(state)).every(Boolean);
}

export function completionRequirementsSatisfied(state) {
  const requirements = COMPLETION_CANDIDATE.requires;
  return (
    state?.progression?.currentUnit === requirements.currentUnit &&
    state?.receipts?.breakpoints?.length >= requirements.breakpointCount &&
    state?.receipts?.scalePeaks?.length >= requirements.scalePeakCount &&
    hasCompletionActivityContributions(state)
  );
}

function completionReceiptsByKind(state, kind) {
  return completionReceiptsForCurrentJourney(state).filter(
    (receipt) => receipt?.kind === kind,
  );
}

function materialAnchorMatches(work, anchor) {
  return Boolean(
    isFinalAnchorMaterial(work) &&
      anchor?.workId === work.id &&
      hasText(anchor?.sourceBroadcastId) &&
      work.provenance.broadcastId === anchor.sourceBroadcastId,
  );
}

export function getValidFinalAnchorReceipt(state) {
  const anchors = completionReceiptsByKind(
    state,
    "completion-anchor-broadcast-candidate",
  );
  if (anchors.length !== 1) return null;
  const anchor = anchors[0];
  const anchorWork = workWithId(state?.works, anchor?.workId);
  return (
    hasText(anchor?.id) &&
    anchor?.planId === COMPLETION_CANDIDATE.anchorPlanId &&
    materialAnchorMatches(anchorWork, anchor) &&
    hasValidAnchorContributionSnapshot(
      state,
      anchorWork,
      anchor.activityContributions,
    ) &&
    hasValidAnchorContributionSnapshot(
      state,
      anchorWork,
      anchorWork.provenance.activityContributions,
    ) &&
    anchor.activityContributions.every((entry, index) =>
      activityContributionEqual(
        entry,
        anchorWork.provenance.activityContributions[index],
      ),
    )
  )
    ? anchor
    : null;
}

export function getValidCompletionChoiceReceipt(state, anchor = getValidFinalAnchorReceipt(state)) {
  if (!anchor) return null;
  const choices = completionReceiptsByKind(
    state,
    "completion-choice-candidate",
  );
  if (choices.length !== 1) return null;
  const choice = choices[0];
  return (
    hasText(choice?.id) &&
    choice.anchorReceiptId === anchor.id &&
    Boolean(completionChoiceById(choice.choiceId))
  )
    ? choice
    : null;
}

function contributionIdentifiers(contributions) {
  return contributions.map((entry) => ({
    activity: entry.activity,
    ...(hasText(entry.workId) ? { workId: entry.workId } : { recordId: entry.recordId }),
  }));
}

function contributionIdentifierListsMatch(actual, expected) {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    actual.every((entry, index) => {
      const expectedEntry = expected[index];
      return (
        isRecord(entry) &&
        entry.activity === expectedEntry.activity &&
        entry.workId === expectedEntry.workId &&
        entry.recordId === expectedEntry.recordId &&
        Object.keys(entry).length === Object.keys(expectedEntry).length
      );
    })
  );
}

function runtimeCompletionBasisMatches(state, candidate, anchor) {
  const anchorWork = workWithId(state?.works, anchor?.workId);
  const basis = Array.isArray(candidate?.provenance)
    ? candidate.provenance.filter(
        (entry) => entry?.id === "runtime-completion-basis",
      )
    : [];
  return (
    basis.length === 1 &&
    basis[0].anchorReceiptId === anchor.id &&
    basis[0].anchorWorkId === anchor.workId &&
    hasValidAnchorContributionSnapshot(
      state,
      anchorWork,
      basis[0].activityContributions,
    ) &&
    basis[0].activityContributions.every((entry, index) =>
      activityContributionEqual(entry, anchor.activityContributions[index]),
    ) &&
    contributionIdentifierListsMatch(
      basis[0].activityContributionIds,
      contributionIdentifiers(anchor.activityContributions),
    )
  );
}

export function getValidCompletionCandidateReceipt(
  state,
  anchor = getValidFinalAnchorReceipt(state),
  choice = getValidCompletionChoiceReceipt(state, anchor),
) {
  if (!anchor || !choice || !completionRequirementsSatisfied(state)) return null;
  const candidates = completionReceiptsByKind(state, "completion-candidate");
  if (candidates.length !== 1) return null;
  const candidate = candidates[0];
  return (
    hasText(candidate?.id) &&
    candidate.anchorReceiptId === anchor.id &&
    candidate.choiceReceiptId === choice.id &&
    candidate.choiceId === choice.choiceId &&
    runtimeCompletionBasisMatches(state, candidate, anchor)
  )
    ? candidate
    : null;
}

export function hasRecordedCompletionCandidate(state) {
  return Boolean(getValidCompletionCandidateReceipt(state));
}

function refreshCompletionEligibility(state, events) {
  const eligible = completionRequirementsSatisfied(state);
  const wasEligible = state.progression.completionEligible;
  state.progression.completionEligible = eligible;
  const recorded = hasRecordedCompletionCandidate(state);
  if (state.progression.completionCandidate && !recorded) {
    state.progression.completionCandidate = false;
    if (state.phase.kind === "completion") state.phase = { kind: "room" };
  }
  if (recorded) {
    state.pending.completionCandidate = false;
    return;
  }
  state.pending.completionCandidate = eligible;
  if (eligible && !wasEligible) {
    emit(state, events, "completion-candidate-ready", {
      breakpointCount: state.receipts.breakpoints.length,
      scalePeakCount: state.receipts.scalePeaks.length,
    }, true);
  }
}

function completionStage(state) {
  if (state.progression.completionCandidate && hasRecordedCompletionCandidate(state))
    return "recorded";
  if (!completionRequirementsSatisfied(state)) return "locked";
  const anchor = getValidFinalAnchorReceipt(state);
  if (!anchor) return "anchor-required";
  if (!getValidCompletionChoiceReceipt(state, anchor)) return "choice-required";
  return "receipt-ready";
}

function choosePlan(state, requestedId, allowCompletionAnchor = false) {
  const requested = broadcastPlanById(requestedId);
  if (requested.requires?.workType && !hasWork(state, requested.requires.workType)) return BROADCAST_PLANS[0];
  if (requested.requires?.completionEligible && !completionRequirementsSatisfied(state)) return BROADCAST_PLANS[0];
  if (isFinalAnchorPlan(requested.id) && !allowCompletionAnchor) return BROADCAST_PLANS[0];
  return requested;
}

function beginBroadcast(state, events, command) {
  if (!profileReady(state, events, command.type) || activeBroadcast(state)) {
    if (activeBroadcast(state)) reject(state, events, command.type, "broadcast-already-active");
    return;
  }
  state.meta.broadcastSerial += 1;
  const requested = broadcastPlanById(command.planId ?? command.plan);
  const plan = choosePlan(state, requested.id, Boolean(command.completionAnchor));
  if (plan.id !== requested.id) emit(state, events, "broadcast-plan-fallback", { requested: requested.id, selected: plan.id });
  state.phase = {
    kind: "broadcast-before",
    id: `broadcast-${state.progression.journeyNumber}-${state.meta.broadcastSerial}`,
    planId: plan.id,
    participation: "silent",
    liveActions: 0,
    preserved: false,
    completionAnchor: Boolean(command.completionAnchor && isFinalAnchorPlan(plan.id)),
  };
  emit(state, events, "broadcast-before", {
    broadcastId: state.phase.id,
    planId: plan.id,
    sakiyaIntent: plan.sakiyaIntent,
  }, true);
}

function beginFinalAnchorBroadcast(state, events, command) {
  if (!profileReady(state, events, command.type)) return;
  if (!completionRequirementsSatisfied(state)) {
    reject(state, events, command.type, "full-u10-journey-required");
    return;
  }
  if (getValidFinalAnchorReceipt(state)) {
    reject(state, events, command.type, "final-anchor-already-recorded");
    return;
  }
  beginBroadcast(state, events, {
    ...command,
    planId: COMPLETION_CANDIDATE.anchorPlanId,
    completionAnchor: true,
  });
}

function startBroadcastLive(state, events, command) {
  if (!profileReady(state, events, command.type) || state.phase.kind !== "broadcast-before") {
    if (state.profile.status === "ready") reject(state, events, command.type, "before-required");
    return;
  }
  state.phase.kind = "broadcast-live";
  state.activities.broadcast.totalActions += 1;
  state.activities.broadcast.output += 1;
  state.activities.broadcast.lastCycle = state.meta.broadcastSerial;
  state.resources.session = {
    active: true,
    atmosphere: 1,
    attention: 1,
    reactions: 0,
    comments: 0,
  };
  incrementActiveUnit(state, 1);
  addEvidence(state, 1, "presence");
  emit(state, events, "broadcast-live", {
    broadcastId: state.phase.id,
    planId: state.phase.planId,
  }, true);
  addOrReturnPerson(state, events, "broadcast");

  const returningVideo = state.works.find((work) => work.type === "video" && !work.returnObserved);
  if (returningVideo) {
    returningVideo.returnObserved = true;
    state.progression.videoReturnObserved = true;
    incrementActiveUnit(state, 1);
    addEvidence(state, 2, "coCreation");
    emit(state, events, "video-context-returned", {
      workId: returningVideo.id,
      caption: "動画の向こうの話が、次の枠へ戻った。",
    }, true);
  }
  if (state.activities.broadcast.totalActions > 2 && state.activities.broadcast.totalActions % 4 === 0) {
    markOnePersonAway(state, events);
  }
  evaluateBreakpoints(state, events);
  updateAvailability(state);
}

function liveParticipation(state, events, command, type) {
  if (!profileReady(state, events, command.type) || state.phase.kind !== "broadcast-live") {
    if (state.profile.status === "ready") reject(state, events, command.type, "live-required");
    return;
  }
  if (type !== "silent" && state.phase.liveActions >= 2) {
    reject(state, events, command.type, "live-participation-limit");
    return;
  }
  if (type === "silent") {
    state.phase.participation = "silent";
    state.resources.session.atmosphere += 0.5;
    addEvidence(state, 0.5, "presence");
    const runtime = p0Runtime(state);
    if (runtime) runtime.participation.silent += 1;
    p0RecordAction(state, "live:silent");
    emit(state, events, "silent-presence", { broadcastId: state.phase.id });
    return;
  }
  state.phase.liveActions += 1;
  state.phase.participation = type;
  if (type === "react") {
    state.resources.session.reactions += 1;
    state.resources.session.atmosphere += 1;
    addEvidence(state, 0.75, "coCreation");
    const runtime = p0Runtime(state);
    if (runtime) runtime.participation.reactions += 1;
    p0RecordAction(state, "live:react");
    emit(state, events, "broadcast-reaction", {
      broadcastId: state.phase.id,
      reaction: compactText(command.reaction, "拍手", 32),
    }, true);
  } else {
    state.resources.session.comments += 1;
    state.resources.session.attention += 1;
    addEvidence(state, 1, "coCreation");
    const runtime = p0Runtime(state);
    if (runtime) runtime.participation.comments += 1;
    p0RecordAction(state, "live:comment");
    emit(state, events, "broadcast-comment", {
      broadcastId: state.phase.id,
      comment: compactText(command.comment ?? command.text, "その話もっと聞きたい", 80),
    }, true);
  }
  evaluateBreakpoints(state, events);
}

function endBroadcast(state, events, command) {
  if (!profileReady(state, events, command.type) || state.phase.kind !== "broadcast-live") {
    if (state.profile.status === "ready") reject(state, events, command.type, "live-required");
    return;
  }
  state.phase.kind = "broadcast-after";
  state.resources.session.active = false;
  state.pending.preserve = {
    broadcastId: state.phase.id,
    planId: state.phase.planId,
    atmosphere: state.resources.session.atmosphere,
    completionAnchor: isFinalAnchorPlan(state.phase.planId),
  };
  emit(state, events, "broadcast-after", {
    broadcastId: state.phase.id,
    planId: state.phase.planId,
    nextDecision: "preserve-or-return",
  }, true);
}

function preserveMoment(state, events, command) {
  if (!profileReady(state, events, command.type) || state.phase.kind !== "broadcast-after" || !state.pending.preserve) {
    if (state.profile.status === "ready") reject(state, events, command.type, "after-preservation-required");
    return;
  }
  if (state.phase.preserved) {
    reject(state, events, command.type, "moment-already-preserved");
    return;
  }
  const pending = state.pending.preserve;
  const completionAnchor = isFinalAnchorPlan(pending.planId);
  const work = {
    id: nextId(state, "material"),
    type: "material",
    title: compactText(command.title, completionAnchor ? "最後のアンカー記録（候補）" : "残した場面", 80),
    createdAt: state.clock.now,
    provenance: { activity: "broadcast", broadcastId: pending.broadcastId, planId: pending.planId },
    assetIdle: null,
    returnObserved: false,
  };
  state.works.push(work);
  if (state.works.length > MAX_WORKS) state.works.splice(0, state.works.length - MAX_WORKS);
  const activityContributions = completionAnchor
    ? buildFinalAnchorActivityContributions(state, work)
    : null;
  if (activityContributions) {
    work.provenance.activityContributions = clone(activityContributions);
  }
  state.resources.materials += 1;
  state.activities.broadcast.output += 1;
  state.meta.firsts.material = true;
  incrementActiveUnit(state, 1);
  addEvidence(state, 2, "coCreation");
  state.phase.preserved = true;
  state.phase = { kind: "room" };
  state.pending.preserve = null;
  emit(state, events, "material-preserved", {
    workId: work.id,
    sourceBroadcastId: work.provenance.broadcastId,
  }, true);
  if (
    completionAnchor &&
    activityContributions &&
    completionRequirementsSatisfied(state) &&
    !getValidFinalAnchorReceipt(state)
  ) {
    const receipt = {
      id: `completion-anchor-${state.progression.journeyNumber}`,
      kind: "completion-anchor-broadcast-candidate",
      at: state.clock.now,
      journeyNumber: state.progression.journeyNumber,
      planId: COMPLETION_CANDIDATE.anchorPlanId,
      workId: work.id,
      sourceBroadcastId: work.provenance.broadcastId,
      activityContributions: clone(activityContributions),
      status: COMPLETION_CANDIDATE.status,
      ownerGate: COMPLETION_CANDIDATE.ownerGate,
      candidate: true,
    };
    state.receipts.completion.push(receipt);
    emit(state, events, "final-anchor-broadcast-recorded", receipt, true);
  }
  updateAvailability(state);
  evaluateBreakpoints(state, events);
}

function assertActivityAvailable(state, events, command, id) {
  if (!profileReady(state, events, command.type)) return false;
  if (!state.activities[id]?.unlocked) {
    reject(state, events, command.type, `${id}-locked`);
    return false;
  }
  return true;
}

function createVideo(state, events, command) {
  if (!assertActivityAvailable(state, events, command, "video")) return;
  const material = state.works.find((work) => work.type === "material" && !work.usedByVideo) ?? state.works.find((work) => work.type === "material");
  if (!material) {
    reject(state, events, command.type, "material-required");
    return;
  }
  const activity = state.activities.video;
  if (activity.lastCycle === state.meta.broadcastSerial) {
    reject(state, events, command.type, "video-one-per-broadcast-cycle");
    return;
  }
  material.usedByVideo = true;
  const work = {
    id: nextId(state, "video"),
    type: "video",
    title: compactText(command.title, "場面をつなぐ動画", 80),
    createdAt: state.clock.now,
    provenance: { activity: "video", materialId: material.id, sourceBroadcastId: material.provenance.broadcastId },
    assetIdle: { rate: 0.08, accumulated: 0 },
    returnObserved: false,
  };
  state.works.push(work);
  activity.totalActions += 1;
  activity.output += 1;
  activity.lastCycle = state.meta.broadcastSerial;
  activity.limiter.usedThisCycle = 1;
  state.meta.firsts.video = true;
  incrementActiveUnit(state, 1);
  addEvidence(state, 2, "shared");
  applyP0VideoNesting(state, events, work);
  emit(state, events, "video-created", {
    workId: work.id,
    materialId: material.id,
    limiter: "one-per-broadcast-cycle",
  }, true);
  updateAvailability(state);
  evaluateBreakpoints(state, events);
}

function practiceSinging(state, events, command) {
  if (!assertActivityAvailable(state, events, command, "singing")) return;
  const activity = state.activities.singing;
  if (activity.lastCycle === state.meta.broadcastSerial) {
    reject(state, events, command.type, "singing-focus-already-used");
    return;
  }
  activity.totalActions += 1;
  activity.output += 1;
  activity.lastCycle = state.meta.broadcastSerial;
  activity.limiter.usedThisCycle = 1;
  state.resources.vocalMastery += 1;
  const take = {
    id: nextId(state, "take"),
    type: "take",
    title: compactText(command.title, "今日の歌の手がかり", 80),
    createdAt: state.clock.now,
    provenance: { activity: "singing", focus: compactText(command.focus, "表現", 48) },
    assetIdle: null,
  };
  state.works.push(take);
  incrementActiveUnit(state, 1);
  addEvidence(state, 2, "coCreation");
  emit(state, events, "singing-practiced", {
    takeId: take.id,
    focus: take.provenance.focus,
    limiter: "one-focus-per-broadcast-cycle",
  }, true);
  updateAvailability(state);
  evaluateBreakpoints(state, events);
}

function arrangeMusic(state, events, command) {
  if (!assertActivityAvailable(state, events, command, "music")) return;
  if (state.resources.vocalMastery < 1 || !state.works.some((work) => work.type === "take" || work.type === "material")) {
    reject(state, events, command.type, "vocal-and-material-required");
    return;
  }
  const activity = state.activities.music;
  if (activity.lastCycle === state.meta.broadcastSerial) {
    reject(state, events, command.type, "music-one-draft-per-broadcast-cycle");
    return;
  }
  const source = state.works.find((work) => work.type === "take") ?? state.works.find((work) => work.type === "material");
  const work = {
    id: nextId(state, "music"),
    type: "music",
    title: compactText(command.title, "断片からできた曲", 80),
    createdAt: state.clock.now,
    provenance: { activity: "music", sourceWorkId: source?.id ?? null },
    assetIdle: { rate: 0.05, accumulated: 0 },
    returnObserved: false,
  };
  state.works.push(work);
  activity.totalActions += 1;
  activity.output += 1;
  activity.lastCycle = state.meta.broadcastSerial;
  activity.limiter.usedThisCycle = 1;
  state.resources.musicResonance += 1;
  incrementActiveUnit(state, 1.5);
  addEvidence(state, 3, "shared");
  emit(state, events, "music-arranged", {
    workId: work.id,
    sourceWorkId: work.provenance.sourceWorkId,
    limiter: "one-draft-per-broadcast-cycle",
  }, true);
  updateAvailability(state);
  evaluateBreakpoints(state, events);
}

function postSns(state, events, command) {
  if (!assertActivityAvailable(state, events, command, "sns")) return;
  const source = state.works.find((work) => ["video", "music", "material"].includes(work.type));
  if (!source) {
    reject(state, events, command.type, "eligible-context-required");
    return;
  }
  const activity = state.activities.sns;
  if (activity.lastCycle === state.meta.broadcastSerial) {
    reject(state, events, command.type, "sns-window-closed");
    return;
  }
  activity.totalActions += 1;
  activity.output += 1;
  activity.lastCycle = state.meta.broadcastSerial;
  activity.limiter.usedThisCycle = 1;
  state.resources.snsSignal = Math.min(12, state.resources.snsSignal + 2);
  incrementActiveUnit(state, 0.5);
  addEvidence(state, 1.5, "shared");
  emit(state, events, "sns-posted", {
    sourceWorkId: source.id,
    provenance: { activity: "sns", sourceWorkId: source.id },
    context: compactText(command.context, "いま伝えたいこと", 80),
    limiter: "one-context-window-per-broadcast-cycle",
  }, true);
  updateAvailability(state);
  evaluateBreakpoints(state, events);
}

function hostLiveEvent(state, events, command) {
  if (!assertActivityAvailable(state, events, command, "liveEvent")) return;
  const videoWork = latestMatching(state.works, (work) =>
    isVideoContributionWork(work, state.works),
  );
  const musicWork = latestMatching(state.works, (work) =>
    isMusicContributionWork(work, state.works),
  );
  const hasVideo = Boolean(videoWork);
  const hasMusic = Boolean(musicWork);
  if (!hasVideo && !hasMusic) {
    reject(state, events, command.type, "cross-activity-input-required");
    return;
  }
  const activity = state.activities.liveEvent;
  if (activity.lastCycle === state.meta.broadcastSerial) {
    reject(state, events, command.type, "live-event-commitment-already-used");
    return;
  }
  const eventWork = {
    id: nextId(state, "event"),
    type: "event-record",
    title: compactText(command.title, "集めてひらいた場", 80),
    createdAt: state.clock.now,
    provenance: {
      activity: "liveEvent",
      hasVideo,
      hasMusic,
      videoWorkId: videoWork?.id ?? null,
      musicWorkId: musicWork?.id ?? null,
    },
    assetIdle: null,
  };
  state.works.push(eventWork);
  activity.totalActions += 1;
  activity.output += 1;
  activity.lastCycle = state.meta.broadcastSerial;
  activity.limiter.usedThisCycle = 1;
  state.resources.eventAfterglow += 1;
  incrementActiveUnit(state, 2);
  addEvidence(state, 3, "shared");
  emit(state, events, "live-event-hosted", {
    recordId: eventWork.id,
    purpose: compactText(command.purpose, "いまあるものを集める", 80),
    limiter: "one-commitment-per-broadcast-cycle",
  }, true);
  updateAvailability(state);
  evaluateBreakpoints(state, events);
}

function createBridge(state, events, command) {
  if (!profileReady(state, events, command.type)) return;
  const from = command.from ?? "broadcast";
  const to = command.to ?? "video";
  if (!activityById(from) || !activityById(to) || from === to) {
    reject(state, events, command.type, "typed-activities-required");
    return;
  }
  if (!state.activities[from]?.unlocked) {
    reject(state, events, command.type, "bridge-source-activity-locked");
    return;
  }
  if (!state.activities[to]?.unlocked) {
    reject(state, events, command.type, "bridge-target-activity-locked");
    return;
  }
  const key = `${from}->${to}`;
  if (state.bridges.routes.some((route) => route.key === key)) {
    reject(state, events, command.type, "bridge-already-exists");
    return;
  }
  const sourceWorkId = compactText(command.sourceWorkId, "", 120);
  if (!sourceWorkId) {
    reject(state, events, command.type, "bridge-source-work-required");
    return;
  }
  const sourceWork = state.works.find((work) => work.id === sourceWorkId);
  if (!sourceWork) {
    reject(state, events, command.type, "bridge-source-work-unknown");
    return;
  }
  if (sourceWork.provenance?.activity !== from) {
    reject(state, events, command.type, "bridge-source-provenance-mismatch");
    return;
  }
  const route = {
    id: nextId(state, "bridge"),
    key,
    from,
    to,
    sourceWorkId: sourceWork.id,
    createdAt: state.clock.now,
  };
  state.bridges.routes.push(route);
  state.bridges.completed += 1;
  state.meta.firsts.bridge = true;
  incrementActiveUnit(state, 1);
  addEvidence(state, 2, "shared");
  emit(state, events, "activity-bridge-created", route, true);
  evaluateBreakpoints(state, events);
}

function enableAutomation(state, events, command) {
  if (!profileReady(state, events, command.type)) return;
  const id = compactText(command.id ?? command.automationId, "clip", 32);
  const automation = state.automation[id];
  if (!automation) {
    reject(state, events, command.type, "automation-unknown");
    return;
  }
  if (!automation.available || !automation.understood) {
    reject(state, events, command.type, "automation-not-understood");
    return;
  }
  if (automation.enabled) {
    reject(state, events, command.type, "automation-already-enabled");
    return;
  }
  automation.enabled = true;
  state.meta.firsts.automation = true;
  addEvidence(state, 2, "shared");
  emit(state, events, "automation-enabled", {
    automationId: id,
    understood: true,
    offlineEligible: true,
  }, true);
  evaluateBreakpoints(state, events);
}

function prestige(state, events, command) {
  if (!profileReady(state, events, command.type)) return;
  if (state.progression.breakpointIndex < 3) {
    reject(state, events, command.type, "breakpoint-three-required");
    return;
  }
  if (activeBroadcast(state)) {
    reject(state, events, command.type, "finish-broadcast-before-prestige");
    return;
  }
  state.meta.prestigeCount += 1;
  const receipt = {
    id: `prestige-${state.meta.prestigeCount}`,
    kind: "prestige",
    at: state.clock.now,
    preservedPeople: state.people.known.map((person) => person.id),
    preservedWorks: state.works.map((work) => work.id).slice(-24),
    preservedHistory: state.history.length,
    surrenderedUnitValue: state.resources.currentUnit.value,
  };
  state.receipts.prestige.push(receipt);
  state.resources.currentUnit.value = 0;
  state.resources.unitValues[state.resources.currentUnit.id] = 0;
  state.resources.session = { active: false, atmosphere: 0, attention: 0, reactions: 0, comments: 0 };
  state.phase = { kind: "room" };
  emit(state, events, "prestige-complete", receipt, true);
}

function scaleCandidate(state, events, command) {
  if (!profileReady(state, events, command.type)) return;
  if (state.progression.mode === "p0") {
    reject(state, events, command.type, "scale-deferred-in-p0");
    return;
  }
  const peak = SCALE_PEAKS[state.progression.scaleIndex];
  if (!peak) {
    reject(state, events, command.type, "all-scale-peaks-complete");
    return;
  }
  if (state.progression.breakpointIndex < peak.requiredBreakpoint) {
    reject(state, events, command.type, "breakpoint-requirement-not-met");
    return;
  }
  if (state.progression.currentUnit !== peak.fromUnit) {
    reject(state, events, command.type, "scale-unit-mismatch");
    return;
  }
  const oldUnit = state.resources.currentUnit;
  const retirement = {
    id: `retirement-${peak.id}`,
    peakId: peak.id,
    retiredUnit: peak.fromUnit,
    finalValue: oldUnit.value,
    at: state.clock.now,
    retired: true,
    liveProductionStopped: true,
    people: state.people.known.map((person) => person.id),
    representativeWorks: state.works.slice(-8).map((work) => work.id),
    basis: {
      breakpoints: state.receipts.breakpoints.map((receipt) => receipt.id),
      bridges: state.bridges.routes.map((route) => route.key),
    },
  };
  state.resources.retiredUnits.push(retirement);
  state.resources.unitValues[peak.fromUnit] = oldUnit.value;
  state.resources.currentUnit = { id: peak.toUnit, value: 0, liveRate: 0 };
  state.resources.unitValues[peak.toUnit] = 0;
  state.progression.currentUnit = peak.toUnit;
  state.progression.macroLayer = peak.layer;
  state.progression.scaleIndex += 1;
  const receipt = {
    id: peak.id,
    kind: "scale-peak",
    at: state.clock.now,
    fromUnit: peak.fromUnit,
    toUnit: peak.toUnit,
    meaning: peak.meaning,
    retirementId: retirement.id,
    candidate: true,
  };
  state.receipts.scalePeaks.push(receipt);
  state.phase = { kind: "room" };
  emit(state, events, "semantic-retirement", retirement, true);
  emit(state, events, "scale-peak-candidate", receipt, true);
}

function recordCompletionChoice(state, events, command) {
  if (!profileReady(state, events, command.type)) return;
  if (!completionRequirementsSatisfied(state)) {
    reject(state, events, command.type, "full-u10-journey-required");
    return;
  }
  const anchor = getValidFinalAnchorReceipt(state);
  if (!anchor) {
    reject(state, events, command.type, "final-anchor-broadcast-required");
    return;
  }
  if (getValidCompletionChoiceReceipt(state, anchor)) {
    reject(state, events, command.type, "completion-choice-already-recorded");
    return;
  }
  const choiceId = compactText(command.choiceId ?? command.choice, "", 80);
  const choice = completionChoiceById(choiceId);
  if (!choice) {
    reject(state, events, command.type, "completion-choice-required");
    return;
  }
  const receipt = {
    id: `completion-choice-${state.progression.journeyNumber}`,
    kind: "completion-choice-candidate",
    at: state.clock.now,
    journeyNumber: state.progression.journeyNumber,
    choiceId: choice.id,
    anchorReceiptId: anchor.id,
    sakiyaIntent: choice.sakiyaIntent,
    participantContribution: choice.participantContribution,
    status: COMPLETION_CANDIDATE.status,
    ownerGate: COMPLETION_CANDIDATE.ownerGate,
    candidate: true,
  };
  state.receipts.completion.push(receipt);
  emit(state, events, "completion-choice-recorded", receipt, true);
}

function completionCandidate(state, events, command) {
  if (!profileReady(state, events, command.type)) return;
  if (!completionRequirementsSatisfied(state)) {
    reject(state, events, command.type, "full-journey-required");
    return;
  }
  const anchor = getValidFinalAnchorReceipt(state);
  if (!anchor) {
    reject(state, events, command.type, "final-anchor-broadcast-required");
    return;
  }
  const choice = getValidCompletionChoiceReceipt(state, anchor);
  if (!choice) {
    reject(state, events, command.type, "completion-choice-required");
    return;
  }
  if (hasRecordedCompletionCandidate(state)) {
    reject(state, events, command.type, "completion-already-recorded");
    return;
  }
  state.progression.completionCandidate = true;
  state.pending.completionCandidate = false;
  state.phase = { kind: "completion" };
  const receipt = {
    id: `completion-${state.progression.journeyNumber}`,
    kind: "completion-candidate",
    at: state.clock.now,
    journeyNumber: state.progression.journeyNumber,
    preservedPeople: state.people.known.map((person) => person.id),
    preservedWorks: state.works.map((work) => work.id),
    scalePeakCount: state.receipts.scalePeaks.length,
    anchorReceiptId: anchor.id,
    choiceReceiptId: choice.id,
    choiceId: choice.choiceId,
    status: COMPLETION_CANDIDATE.status,
    ownerGate: COMPLETION_CANDIDATE.ownerGate,
    credits: clone(COMPLETION_CANDIDATE.credits),
    provenance: [
      ...clone(COMPLETION_CANDIDATE.provenance),
      {
        id: "runtime-completion-basis",
        source: "current journey receipts",
        breakpoints: state.receipts.breakpoints.map((receipt) => receipt.id),
        scalePeaks: state.receipts.scalePeaks.map((receipt) => receipt.id),
        anchorReceiptId: anchor.id,
        anchorWorkId: anchor.workId,
        activityContributionIds: contributionIdentifiers(
          anchor.activityContributions,
        ),
        activityContributions: clone(anchor.activityContributions),
      },
    ],
    ownerAccepted: false,
    publicReleasePerformed: false,
    arrivalStaged: false,
    arrivalPolicy: "owner-conditional; no fabricated arrival",
  };
  state.receipts.completion.push(receipt);
  emit(state, events, "completion-candidate-recorded", receipt, true);
}

function continueJourney(state, events, command) {
  if (!profileReady(state, events, command.type)) return;
  if (!hasRecordedCompletionCandidate(state)) {
    reject(state, events, command.type, "completion-candidate-required");
    return;
  }
  state.meta.continued = true;
  state.phase = { kind: "room" };
  emit(state, events, "journey-continued", { unit: state.progression.currentUnit }, true);
}

function strongNewGame(state, events, command) {
  if (!profileReady(state, events, command.type)) return;
  if (!hasRecordedCompletionCandidate(state)) {
    reject(state, events, command.type, "completion-candidate-required");
    return;
  }
  const previousJourney = state.progression.journeyNumber;
  const previousRetirements = state.resources.retiredUnits;
  const previousValues = state.resources.unitValues;
  state.progression = {
    ...state.progression,
    mode: "journey",
    presence: 0,
    coCreation: 0,
    sharedExpansion: 0,
    evidence: 0,
    breakpointIndex: 0,
    scaleIndex: 0,
    currentUnit: "U0",
    macroLayer: 1,
    videoReturnObserved: false,
    completionEligible: false,
    completionCandidate: false,
    journeyNumber: previousJourney + 1,
  };
  state.resources = {
    ...createResources(),
    retiredUnits: previousRetirements,
    unitValues: { ...previousValues, U0: 0 },
  };
  state.activities = Object.fromEntries(
    ACTIVITY_IDS.map((id) => [id, makeActivityState(id, id === "broadcast")]),
  );
  state.automation = createAutomationState();
  state.bridges = { routes: [], completed: 0 };
  state.pending = { preserve: null, namedPersonEvents: [], offlineEvidence: 0, completionCandidate: false };
  state.phase = { kind: "room" };
  state.meta.strongNewGameCount += 1;
  // `firstArrivalChimePlayed` intentionally remains true for this lineage.
  emit(state, events, "strong-new-game-started", {
    fromJourney: previousJourney,
    toJourney: state.progression.journeyNumber,
    preservedPeople: state.people.known.map((person) => person.id),
    preservedWorks: state.works.map((work) => work.id).slice(-24),
    retainedReceipts: state.receipts.scalePeaks.length,
  }, true);
}

function updateSettings(state, events, command) {
  const supplied = command.settings && typeof command.settings === "object" ? command.settings : command;
  const next = {
    sound: supplied.sound == null ? state.settings.sound : Boolean(supplied.sound),
    captions: supplied.captions == null ? state.settings.captions : Boolean(supplied.captions),
    reducedMotion: supplied.reducedMotion == null ? state.settings.reducedMotion : Boolean(supplied.reducedMotion),
    highContrast: supplied.highContrast == null ? state.settings.highContrast : Boolean(supplied.highContrast),
    fontScale: [1, 1.1, 1.2].includes(Number(supplied.fontScale)) ? Number(supplied.fontScale) : state.settings.fontScale,
    numberNotation: ["short", "full", "scientific"].includes(supplied.numberNotation)
      ? supplied.numberNotation
      : state.settings.numberNotation,
  };
  state.settings = next;
  emit(state, events, "settings-updated", { settings: next });
}

function setPersonPresence(state, events, command, desiredStatus) {
  if (!profileReady(state, events, command.type)) return;
  const person = knownPerson(state, compactText(command.personId, state.people.firstExternalArrivalId, 64));
  if (!person) {
    reject(state, events, command.type, "known-fictional-person-required");
    return;
  }
  person.status = desiredStatus;
  person.lastSeenAt = state.clock.now;
  person.history.push(desiredStatus === "away" ? "away" : "return");
  person.history = person.history.slice(-16);
  if (desiredStatus === "away") {
    state.people.reversibleAbsences = [...new Set([...state.people.reversibleAbsences, person.id])].slice(-MAX_PEOPLE);
  } else {
    state.people.reversibleAbsences = state.people.reversibleAbsences.filter((id) => id !== person.id);
  }
  emit(state, events, desiredStatus === "away" ? "fictional-person-away" : "fictional-person-returned", {
    personId: person.id,
    reversible: true,
  }, true);
}

function recordOptionalGift(state, events, command) {
  if (!profileReady(state, events, command.type)) return;
  const amount = finite(command.amount, 0, 0, 1e12);
  state.resources.gifts += amount;
  // Gifts are observed presentation events only; no required gate reads them.
  emit(state, events, "optional-gift-observed", { amount, progressionGate: false }, true);
}

function acknowledgeEntryChimePlayed(state, events, command) {
  if (!profileReady(state, events, command.type)) return;
  if (!state.meta.firstArrivalChimePlayed || !state.people.firstExternalArrivalId) {
    reject(state, events, command.type, "entry-chime-not-emitted");
    return;
  }
  // This command is dispatched only by the presentation layer after an actual
  // AudioContext/WebAudio start succeeds. Repeated acknowledgements are a no-op
  // so resumes cannot duplicate history or playback intent.
  if (state.meta.firstArrivalChimeHeard) return;
  state.meta.firstArrivalChimeHeard = true;
  emit(state, events, "entry-chime-playback-confirmed", {
    sourceAsset: "entry-chime-canonical",
    firstArrivalId: state.people.firstExternalArrivalId,
    playbackStarted: true,
  }, true);
}

export function runCommand(inputState, command, options = {}) {
  const state = clone(inputState ?? createGameState(options));
  const events = [];
  state.clock.now = stateNow(state, options);
  state.clock.lastForegroundAt = state.clock.now;
  const normalized = normalizeCommand(command, options);

  switch (normalized.type) {
    case "FIRST_LAUNCH":
      emit(state, events, "first-launch", { phase: state.phase.kind });
      break;
    case "PROFILE": {
      const displayName = compactText(normalized.displayName ?? normalized.name ?? normalized.profile?.displayName, "", 48);
      state.profile = {
        status: "ready",
        displayName: displayName || "匿名の参加者",
        anonymous: Boolean(normalized.anonymous || !displayName),
        createdAt: state.clock.now,
        localOnly: true,
      };
      state.phase = { kind: "room" };
      emit(state, events, "profile-ready", { anonymous: state.profile.anonymous }, true);
      break;
    }
    case "SKIP_PROFILE":
      state.profile = {
        status: "ready",
        displayName: "匿名の参加者",
        anonymous: true,
        createdAt: state.clock.now,
        localOnly: true,
      };
      state.phase = { kind: "room" };
      emit(state, events, "profile-skipped", { anonymous: true }, true);
      break;
    case "BROADCAST_BEFORE":
      beginBroadcast(state, events, normalized);
      break;
    case "FINAL_ANCHOR_BROADCAST":
      beginFinalAnchorBroadcast(state, events, normalized);
      break;
    case "BROADCAST_LIVE":
      startBroadcastLive(state, events, normalized);
      break;
    case "SILENT_PRESENCE":
      liveParticipation(state, events, normalized, "silent");
      break;
    case "REACT":
      liveParticipation(state, events, normalized, "react");
      break;
    case "COMMENT":
      liveParticipation(state, events, normalized, "comment");
      break;
    case "BROADCAST_AFTER":
      endBroadcast(state, events, normalized);
      break;
    case "PRESERVE_MOMENT":
      preserveMoment(state, events, normalized);
      break;
    case "CREATE_VIDEO":
      createVideo(state, events, normalized);
      break;
    case "PRACTICE_SINGING":
      practiceSinging(state, events, normalized);
      break;
    case "ARRANGE_MUSIC":
      arrangeMusic(state, events, normalized);
      break;
    case "POST_SNS":
      postSns(state, events, normalized);
      break;
    case "HOST_LIVE_EVENT":
      hostLiveEvent(state, events, normalized);
      break;
    case "CREATE_BRIDGE":
      createBridge(state, events, normalized);
      break;
    case "ENABLE_AUTOMATION":
      enableAutomation(state, events, normalized);
      break;
    case "PRESTIGE":
      prestige(state, events, normalized);
      break;
    case "SCALE_CANDIDATE":
      scaleCandidate(state, events, normalized);
      break;
    case "RECORD_COMPLETION_CHOICE":
      recordCompletionChoice(state, events, normalized);
      break;
    case "COMPLETION_CANDIDATE":
      completionCandidate(state, events, normalized);
      break;
    case "CONTINUE":
      continueJourney(state, events, normalized);
      break;
    case "STRONG_NEW_GAME":
      strongNewGame(state, events, normalized);
      break;
    case "UPDATE_SETTINGS":
      updateSettings(state, events, normalized);
      break;
    case "MARK_ABSENT":
      setPersonPresence(state, events, normalized, "away");
      break;
    case "WELCOME_BACK":
      setPersonPresence(state, events, normalized, "present");
      break;
    case "GIFT_OBSERVED":
      recordOptionalGift(state, events, normalized);
      break;
    case "ACK_ENTRY_CHIME_PLAYED":
      acknowledgeEntryChimePlayed(state, events, normalized);
      break;
    default:
      reject(state, events, normalized.type || "unknown", "unknown-command");
      break;
  }
  refreshCompletionEligibility(state, events);
  return { state, events };
}

function applyAssetIdle(state, seconds) {
  let assetOutput = 0;
  for (const work of state.works) {
    if (!work.assetIdle?.rate) continue;
    const gain = work.assetIdle.rate * seconds;
    work.assetIdle.accumulated = finite(work.assetIdle.accumulated + gain, 0, 0, 1e100);
    assetOutput += gain;
    if (work.type === "video") state.resources.videoReach = finite(state.resources.videoReach + gain, 0, 0, 1e100);
    if (work.type === "music") state.resources.musicResonance = finite(state.resources.musicResonance + gain, 0, 0, 1e100);
  }
  if (assetOutput > 0) {
    incrementActiveUnit(state, assetOutput * 0.1);
    addEvidence(state, Math.min(8, assetOutput * 0.02), "shared");
  }

  let automationOutput = 0;
  for (const automation of Object.values(state.automation)) {
    if (!automation.enabled || !automation.understood) continue;
    const cycles = Math.floor(seconds / 60);
    if (cycles <= 0) continue;
    automation.completed += cycles;
    automationOutput += cycles;
  }
  if (automationOutput > 0) {
    incrementActiveUnit(state, automationOutput * 0.05);
    addEvidence(state, Math.min(4, automationOutput * 0.1), "shared");
  }
  recoverP0ArrivalPools(state, assetOutput, seconds);
  state.resources.snsSignal = Math.max(0, state.resources.snsSignal - seconds * 0.008);
  return { assetOutput, automationOutput };
}

export function advanceGame(inputState, seconds, options = {}) {
  const state = clone(inputState ?? createGameState(options));
  const events = [];
  const requestedSeconds = finite(seconds, 0, 0, 31_536_000);
  const offline = Boolean(options.offline);
  const cap = integer(options.offlineCapSeconds, OFFLINE_CAP_SECONDS, 1, 7 * 24 * 60 * 60);
  const appliedSeconds = offline ? Math.min(requestedSeconds, cap) : requestedSeconds;
  const startedAt = state.clock.now;
  state.clock.now = Math.max(startedAt + appliedSeconds, stateNow(state, options));
  state.clock.lastAdvancedAt = state.clock.now;
  if (!offline) state.clock.lastForegroundAt = state.clock.now;

  const { assetOutput, automationOutput } = applyAssetIdle(state, appliedSeconds);
  if (offline) {
    state.pending.offlineEvidence = finite(state.pending.offlineEvidence + assetOutput + automationOutput, 0, 0, 1e100);
    emit(state, events, "offline-summary", {
      requestedSeconds,
      appliedSeconds,
      capped: requestedSeconds > appliedSeconds,
      assetOutput,
      automationOutput,
      namedPersonEventsDeferred: true,
      entryChimeFired: false,
    }, true);
  } else {
    if (assetOutput || automationOutput) {
      emit(state, events, "asset-idle-advanced", {
        seconds: appliedSeconds,
        assetOutput,
        automationOutput,
      });
    }
    // A foreground state can show non-person economy progress, but it never invents
    // a named arrival or its chime. Named changes require a Broadcast command.
    evaluateBreakpoints(state, events);
    updateAvailability(state);
  }
  return { state, events };
}

function availableActions(state) {
  if (state.profile.status !== "ready") return ["PROFILE", "SKIP_PROFILE"];
  if (state.phase.kind === "broadcast-before") return ["BROADCAST_LIVE"];
  if (state.phase.kind === "broadcast-live") return ["SILENT_PRESENCE", "REACT", "COMMENT", "BROADCAST_AFTER"];
  if (state.phase.kind === "broadcast-after") return ["PRESERVE_MOMENT"];
  if (state.phase.kind === "completion") return ["CONTINUE", "STRONG_NEW_GAME"];
  const actions = ["BROADCAST_BEFORE"];
  for (const id of ACTIVITY_IDS) {
    if (id !== "broadcast" && state.activities[id].unlocked) actions.push(ACTIVITY_DEFINITIONS[id].command.split(" ")[0]);
  }
  if (state.bridges.routes.length < ACTIVITY_IDS.length - 1) actions.push("CREATE_BRIDGE");
  if (Object.values(state.automation).some((automation) => automation.available && automation.understood && !automation.enabled)) actions.push("ENABLE_AUTOMATION");
  const peak = SCALE_PEAKS[state.progression.scaleIndex];
  if (peak && state.progression.breakpointIndex >= peak.requiredBreakpoint && state.progression.mode !== "p0") actions.push("SCALE_CANDIDATE");
  const completion = completionStage(state);
  if (completion === "anchor-required") actions.push("FINAL_ANCHOR_BROADCAST");
  if (completion === "choice-required") actions.push("RECORD_COMPLETION_CHOICE");
  if (completion === "receipt-ready") actions.push("COMPLETION_CANDIDATE");
  if (hasRecordedCompletionCandidate(state))
    actions.push("CONTINUE", "STRONG_NEW_GAME");
  return [...new Set(actions)];
}

export function getCompletionCandidateData(state) {
  const safeState = state ?? createGameState();
  const anchor = getValidFinalAnchorReceipt(safeState);
  const choiceReceipt = getValidCompletionChoiceReceipt(safeState, anchor);
  const choice = choiceReceipt ? completionChoiceById(choiceReceipt.choiceId) : null;
  const receipt = getValidCompletionCandidateReceipt(
    safeState,
    anchor,
    choiceReceipt,
  );
  return {
    id: COMPLETION_CANDIDATE.id,
    status: COMPLETION_CANDIDATE.status,
    sourceStatus: COMPLETION_CANDIDATE.sourceStatus,
    ownerGate: COMPLETION_CANDIDATE.ownerGate,
    stage: completionStage(safeState),
    eligible: completionRequirementsSatisfied(safeState),
    requirements: clone(COMPLETION_CANDIDATE.requires),
    choices: clone(COMPLETION_CANDIDATE.choices),
    anchor: anchor ? clone(anchor) : null,
    choice: choice ? clone(choice) : null,
    choiceReceipt: choiceReceipt ? clone(choiceReceipt) : null,
    receipt: receipt ? clone(receipt) : null,
    credits: clone(COMPLETION_CANDIDATE.credits),
    provenance: clone(COMPLETION_CANDIDATE.provenance),
    ownerAccepted: false,
    publicReleasePerformed: false,
  };
}

export function getProgressSummary(state) {
  const safeState = state ?? createGameState();
  const nextBreakpoint = BREAKPOINTS[safeState.progression.breakpointIndex] ?? null;
  const nextScalePeak = SCALE_PEAKS[safeState.progression.scaleIndex] ?? null;
  const actions = availableActions(safeState);
  return {
    phase: safeState.phase.kind,
    currentUnit: safeState.progression.currentUnit,
    currentUnitLabel: UNIT_LABELS[safeState.progression.currentUnit] ?? safeState.progression.currentUnit,
    activeUnitValue: safeState.resources.currentUnit.value,
    breakpoints: {
      reached: safeState.receipts.breakpoints.length,
      total: BREAKPOINTS.length,
      next: nextBreakpoint ? { id: nextBreakpoint.id, label: nextBreakpoint.label, threshold: nextBreakpoint.threshold } : null,
    },
    scalePeaks: {
      reached: safeState.receipts.scalePeaks.length,
      total: SCALE_PEAKS.length,
      next: nextScalePeak ? { id: nextScalePeak.id, fromUnit: nextScalePeak.fromUnit, toUnit: nextScalePeak.toUnit } : null,
    },
    people: {
      known: safeState.people.known.length,
      present: safeState.people.known.filter((person) => person.status === "present").length,
    },
    works: safeState.works.length,
    activeActions: actions,
    hasActiveChoice: actions.length > 0,
    completionCandidate: safeState.progression.completionCandidate,
    completion: getCompletionCandidateData(safeState),
  };
}

export function formatMagnitude(value, notation = "short") {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  const absolute = Math.abs(number);
  if (notation === "full" || absolute < 1000) {
    return Number(number.toFixed(absolute < 10 ? 2 : absolute < 100 ? 1 : 0)).toLocaleString("en-US");
  }
  if (notation === "scientific") return number.toExponential(2).replace("e+", "e");
  const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
  const group = Math.min(suffixes.length - 1, Math.floor(Math.log10(absolute) / 3));
  const scaled = number / 1000 ** group;
  const precision = Math.abs(scaled) >= 100 ? 0 : Math.abs(scaled) >= 10 ? 1 : 2;
  return `${Number(scaled.toFixed(precision))}${suffixes[group]}`;
}

function apply(state, command, now) {
  return runCommand(state, command, { now }).state;
}

function p0Cycle(state, config, cycle, now) {
  let next = state;
  next = apply(next, { type: "BROADCAST_BEFORE", planId: cycle > 0 && hasWork(next, "video") ? "video-return" : "room-talk" }, now);
  next = apply(next, { type: "BROADCAST_LIVE" }, now + 1);
  if (config.a === "A1") p0RecordAction(next, "live:observe-no-input");
  if (config.a === "A2") next = apply(next, { type: "REACT", reaction: "拍手" }, now + 2);
  if (config.a === "A3") next = apply(next, { type: "COMMENT", comment: "その話もっと聞きたい" }, now + 2);
  next = apply(next, { type: "BROADCAST_AFTER" }, now + 3);
  next = apply(next, { type: "PRESERVE_MOMENT" }, now + 4);
  next = apply(next, { type: "CREATE_VIDEO" }, now + 5);
  p0RecordAction(next, "asset-idle:video-route");
  next = advanceGame(next, 20, { now: now + 25 }).state;
  return next;
}

function p0MilestoneAt(state, type) {
  return state.history.find((event) => event.type === type)?.at ?? null;
}

function p0RunEvidence(state, seed) {
  const runtime = p0Runtime(state);
  const arrival = runtime?.arrival ?? {};
  const video = runtime?.video ?? {};
  const participation = runtime?.participation ?? {};
  const sp1Fired = state.receipts.scalePeaks.some((receipt) => receipt.id === "SP1");
  const outcome = {
    seed,
    config: clone(runtime?.config ?? {}),
    testDependentFixture: {
      id: runtime?.fixtureId ?? P0_TEST_DEPENDENT_TUNING.id,
      status: runtime?.tuningStatus ?? P0_TEST_DEPENDENT_TUNING.status,
    },
    milestoneAt: {
      firstArrival: p0MilestoneAt(state, "external-fictional-arrival"),
      firstVideo: p0MilestoneAt(state, "video-created"),
      videoReturn: p0MilestoneAt(state, "video-context-returned"),
      firstSynergy: p0MilestoneAt(state, "video-context-returned"),
      bp1: state.receipts.breakpoints.find((receipt) => receipt.id === "BP1")?.at ?? null,
      bp2: state.receipts.breakpoints.find((receipt) => receipt.id === "BP2")?.at ?? null,
      bp3: state.receipts.breakpoints.find((receipt) => receipt.id === "BP3")?.at ?? null,
    },
    liveParticipation: clone(participation),
    arrivalSupply: clone(arrival),
    nestedProduction: clone(video),
    resourceTrace: {
      evidence: state.progression.evidence,
      videoReach: state.resources.videoReach,
      materials: state.resources.materials,
      works: state.works.length,
    },
    actionTrace: clone(runtime?.actionTrace ?? []),
    forcedWaitSeconds: runtime?.forcedWaitSeconds ?? 0,
    noWait: (runtime?.forcedWaitSeconds ?? 0) === 0 && (runtime?.actionTrace ?? []).some((action) => action === "asset-idle:video-route"),
    zeroGift: state.resources.gifts === 0,
    sp1Fired,
    scaleDeferred: state.receipts.scalePeaks.length === 0,
  };
  const interestPoolSignature = Object.entries(outcome.arrivalSupply.interestPools ?? {})
    .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
    .map(([interest, value]) => `${interest}:${value}`)
    .join(",");
  // This intentionally excludes config ID and axis labels: a changed signature
  // is evidence of observed modeled behavior, not merely of a different name.
  outcome.signature = [
    `live:${outcome.liveParticipation.silent ?? 0}/${outcome.liveParticipation.reactions ?? 0}/${outcome.liveParticipation.comments ?? 0}`,
    `arrival:${outcome.arrivalSupply.constantUses ?? 0}/${outcome.arrivalSupply.sharedPool ?? "none"}/${interestPoolSignature}/${outcome.arrivalSupply.consumed ?? 0}/${outcome.arrivalSupply.recovered ?? 0}/${outcome.arrivalSupply.videoOpportunities ?? 0}`,
    `video:${outcome.nestedProduction.directReach ?? 0}/${outcome.nestedProduction.interestReach ?? 0}/${outcome.nestedProduction.subscriberEvidence ?? 0}/${outcome.nestedProduction.longTailBase ?? 0}/${outcome.nestedProduction.producerBoost ?? 0}/${outcome.nestedProduction.boundedOpportunity ?? 0}`,
  ].join("|");
  return outcome;
}

export function simulateP0(options = {}) {
  const rawSeeds = Array.isArray(options.seeds) ? options.seeds : [options.seed ?? 1];
  const seeds = rawSeeds.map((seed) => normalizeSeed(seed)).slice(0, 64);
  const resolvedSeeds = seeds.length ? seeds : [1];
  const configurations = [];
  for (const a of ["A1", "A2", "A3"]) {
    for (const b of ["B1", "B2", "B3"]) {
      for (const c of ["C1", "C2", "C3"]) {
        const config = p0ConfigDescriptor({ a, b, c });
        const runs = resolvedSeeds.map((seed) => {
          let state = createGameState({ seed, now: 0, p0: true, profile: { anonymous: true } });
          initializeP0Runtime(state, config);
          for (let cycle = 0; cycle < P0_TEST_DEPENDENT_TUNING.harnessCycles; cycle += 1) {
            state = p0Cycle(state, config, cycle, state.clock.now + 1);
          }
          const evidence = p0RunEvidence(state, seed);
          return {
            ...evidence,
            breakpointCount: state.receipts.breakpoints.length,
            scalePeakCount: state.receipts.scalePeaks.length,
            firstArrival: state.meta.firsts.arrival,
            videoReturnObserved: state.progression.videoReturnObserved,
            gifts: state.resources.gifts,
            summary: getProgressSummary(state),
          };
        });
        configurations.push({
          ...config,
          runs,
          deterministic: true,
          scaleDeferred: true,
          testDependentFixture: P0_TEST_DEPENDENT_TUNING.id,
          outcomeDimensions: {
            a: "liveParticipation",
            b: "arrivalSupply",
            c: "nestedProduction",
          },
        });
      }
    }
  }
  return {
    version: CURRENT_SCHEMA,
    count: configurations.length,
    comparison: {
      status: P0_TEST_DEPENDENT_TUNING.status,
      fixtureId: P0_TEST_DEPENDENT_TUNING.id,
      fixedMatrix: "A1-A3 × B1-B3 × C1-C3",
      axes: clone(P0_AXIS_DEFINITIONS),
      tuning: clone(P0_TEST_DEPENDENT_TUNING),
      reportedOutcomes: {
        A: "liveParticipation",
        B: "arrivalSupply",
        C: "nestedProduction",
      },
      sp1Policy: "P0 never fires SP1",
      zeroGiftPolicy: "zero-gift fixture; no GIFT_OBSERVED command is issued",
    },
    configurations,
    results: configurations,
    byId: Object.fromEntries(configurations.map((configuration) => [configuration.id, configuration])),
  };
}

function journeyCycle(state, index, now) {
  let next = state;
  next = apply(next, { type: "BROADCAST_BEFORE", planId: hasWork(next, "video") ? "video-return" : "room-talk" }, now);
  next = apply(next, { type: "BROADCAST_LIVE" }, now + 1);
  if (index % 3 === 0) next = apply(next, { type: "REACT", reaction: "拍手" }, now + 2);
  if (index % 3 === 1) next = apply(next, { type: "COMMENT", comment: "その話もっと聞きたい" }, now + 2);
  next = apply(next, { type: "BROADCAST_AFTER" }, now + 3);
  next = apply(next, { type: "PRESERVE_MOMENT" }, now + 4);
  next = apply(next, { type: "CREATE_VIDEO" }, now + 5);
  next = apply(next, { type: "PRACTICE_SINGING", focus: "響き" }, now + 6);
  next = apply(next, { type: "ARRANGE_MUSIC" }, now + 7);
  next = apply(next, { type: "POST_SNS" }, now + 8);
  next = apply(next, { type: "HOST_LIVE_EVENT" }, now + 9);
  const routes = [
    ["broadcast", "video"],
    ["singing", "music"],
    ["music", "sns"],
    ["video", "liveEvent"],
    ["broadcast", "liveEvent"],
  ];
  const route = routes[index % routes.length];
  const sourceWork = next.works.find((work) => work.provenance?.activity === route[0]);
  if (sourceWork) {
    next = apply(next, { type: "CREATE_BRIDGE", from: route[0], to: route[1], sourceWorkId: sourceWork.id }, now + 10);
  }
  for (const id of Object.keys(next.automation)) {
    next = apply(next, { type: "ENABLE_AUTOMATION", id }, now + 11);
  }
  next = advanceGame(next, 60, { now: now + 72 }).state;
  while (next.progression.scaleIndex < SCALE_PEAKS.length) {
    const peak = SCALE_PEAKS[next.progression.scaleIndex];
    if (next.progression.breakpointIndex < peak.requiredBreakpoint) break;
    const before = next.progression.scaleIndex;
    next = apply(next, { type: "SCALE_CANDIDATE" }, now + 73 + before);
    if (next.progression.scaleIndex === before) break;
  }
  return next;
}

function recordJourneyCompletionCandidate(state, now) {
  let next = state;
  next = apply(next, { type: "FINAL_ANCHOR_BROADCAST" }, now);
  next = apply(next, { type: "BROADCAST_LIVE" }, now + 1);
  next = apply(next, { type: "BROADCAST_AFTER" }, now + 2);
  next = apply(next, { type: "PRESERVE_MOMENT", title: "最後のアンカー記録（候補）" }, now + 3);
  next = apply(next, { type: "RECORD_COMPLETION_CHOICE", choiceId: "carry-room-record" }, now + 4);
  next = apply(next, { type: "COMPLETION_CANDIDATE" }, now + 5);
  return next;
}

export function simulateJourney(options = {}) {
  const seed = normalizeSeed(options.seed ?? 1);
  const maximumCycles = integer(options.maximumCycles, 64, 1, 400);
  const recordCompletionCandidate = options.recordCompletionCandidate !== false;
  let state = createGameState({ seed, now: 0, profile: { anonymous: true } });
  const trace = [];
  for (let index = 0; index < maximumCycles && !state.progression.completionCandidate; index += 1) {
    trace.push({ index, availableActions: getProgressSummary(state).activeActions });
    state = journeyCycle(state, index, state.clock.now + 1);
    if (state.progression.completionEligible && !state.progression.completionCandidate) {
      if (recordCompletionCandidate) state = recordJourneyCompletionCandidate(state, state.clock.now + 1);
      else break;
    }
  }
  return {
    state,
    summary: getProgressSummary(state),
    trace,
    zeroGift: state.resources.gifts === 0,
    noWait: trace.every((entry) => entry.availableActions.length > 0),
    complete: state.progression.completionCandidate,
  };
}
