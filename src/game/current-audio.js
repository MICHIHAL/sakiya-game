export const ENTRY_CHIME_URL = "/assets/current/entry-chime.wav";

const NO_VOICE = "NO_VOICE";
const PRIORITY_RANK = Object.freeze({ M0: 0, M1: 1, M2: 2, M3: 3, M4: 4 });
const SUMMARY_CUE_IDS = new Set(["S2_OFFLINE_SUMMARY", "S2_RESUME_STATE"]);

function cue({
  cueId,
  semanticClass,
  eventTypes,
  triggerIds = [],
  caption,
  visualSignal,
  bus,
  priority,
  cooldownMs = 0,
  synthesis,
  adoptionRequired = false,
}) {
  return {
    cueId,
    assetId: cueId,
    semanticClass,
    eventTypes,
    triggerIds,
    caption,
    visualSignal,
    bus,
    priority,
    cooldownMs,
    voiceIdentity: NO_VOICE,
    provenance: "project-original deterministic audio direction; no voice and no third-party sample",
    rightsBasis: "project-original generated signal",
    resumePolicy: SUMMARY_CUE_IDS.has(cueId) ? "one-summary-maximum" : "never-queue",
    concurrency: cueId === "S0_ENTRY_CHIME" ? 1 : "semantic-event-scoped",
    adoptionRequired,
    synthesis,
  };
}

const scaleTransitionCues = Object.fromEntries(
  Array.from({ length: 10 }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    const cueId = "S2_SP" + number + "_TRANSITION";
    return [
      cueId,
      cue({
        cueId,
        semanticClass: "S2",
        eventTypes: ["SP" + number + "_TRANSITION"],
        caption: "尺度の切り替わり " + number,
        visualSignal: {
          kind: "transition-marker",
          glyph: "⇢",
          label: "尺度 " + number + " の移行を履歴に記録",
        },
        bus: "sfx",
        priority: "M2",
        cooldownMs: 800,
        synthesis: {
          waveform: "triangle",
          frequency: 278 + index * 19,
          glideFrequency: 392 + index * 23,
          duration: 0.18,
          volume: 0.045,
        },
      }),
    ];
  }),
);

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

export const AUDIO_CUE_DEFINITIONS = deepFreeze({
  S0_ENTRY_CHIME: cue({
    cueId: "S0_ENTRY_CHIME",
    semanticClass: "S0",
    eventTypes: ["FIRST_EXTERNAL_ARRIVAL", "ENTRY_CHIME"],
    triggerIds: ["TRG-ENTRY-01"],
    caption: "はじめての来訪",
    visualSignal: {
      kind: "arrival-mark",
      glyph: "✦",
      label: "最初の外部からの来訪を履歴に記録",
    },
    bus: "sfx",
    priority: "M1",
    synthesis: null,
  }),
  S1_FIRST_REVISIT: cue({
    cueId: "S1_FIRST_REVISIT",
    semanticClass: "S1",
    eventTypes: ["FIRST_REVISIT", "FICTIONAL_PERSON_REVISIT", "FICTIONAL_PERSON_RETURNED"],
    caption: "また来てくれた",
    visualSignal: {
      kind: "person-history-mark",
      glyph: "↺",
      label: "最初の再訪を履歴に記録",
    },
    bus: "sfx",
    priority: "M1",
    cooldownMs: 700,
    synthesis: {
      waveform: "sine",
      frequency: 523.25,
      glideFrequency: 659.25,
      duration: 0.12,
      volume: 0.035,
    },
  }),
  S1_PERSON_CRITICAL: cue({
    cueId: "S1_PERSON_CRITICAL",
    semanticClass: "S1",
    eventTypes: ["PERSON_CRITICAL", "FICTIONAL_PERSON_AWAY"],
    caption: "大切な変化",
    visualSignal: {
      kind: "person-state-mark",
      glyph: "!",
      label: "人物に関する大切な変化を履歴に記録",
    },
    bus: "sfx",
    priority: "M1",
    cooldownMs: 900,
    synthesis: {
      waveform: "triangle",
      frequency: 392,
      glideFrequency: 293.66,
      duration: 0.16,
      volume: 0.04,
    },
  }),
  S2_ACTIVITY_PUBLISH: cue({
    cueId: "S2_ACTIVITY_PUBLISH",
    semanticClass: "S2",
    eventTypes: ["ACTIVITY_PUBLISH", "PUBLISH"],
    caption: "作品を公開した",
    visualSignal: {
      kind: "asset-state-mark",
      glyph: "▣",
      label: "公開した作品の状態を履歴に記録",
    },
    bus: "sfx",
    priority: "M2",
    cooldownMs: 450,
    synthesis: {
      waveform: "sine",
      frequency: 440,
      glideFrequency: 587.33,
      duration: 0.13,
      volume: 0.035,
    },
  }),
  S2_BROADCAST_PRESERVE: cue({
    cueId: "S2_BROADCAST_PRESERVE",
    semanticClass: "S2",
    eventTypes: ["MATERIAL_PRESERVED"],
    caption: "枠の場面を残した",
    visualSignal: {
      kind: "material-mark",
      glyph: "▤",
      label: "残した場面を履歴に記録",
    },
    bus: "sfx",
    priority: "M2",
    cooldownMs: 450,
    synthesis: {
      waveform: "triangle",
      frequency: 293.66,
      glideFrequency: 369.99,
      duration: 0.11,
      volume: 0.03,
    },
  }),
  S2_VIDEO_CREATED: cue({
    cueId: "S2_VIDEO_CREATED",
    semanticClass: "S2",
    eventTypes: ["VIDEO_CREATED"],
    caption: "動画をつないだ",
    visualSignal: {
      kind: "video-mark",
      glyph: "▱",
      label: "作った動画を履歴に記録",
    },
    bus: "sfx",
    priority: "M2",
    cooldownMs: 450,
    synthesis: {
      waveform: "sine",
      frequency: 349.23,
      glideFrequency: 523.25,
      duration: 0.13,
      volume: 0.032,
    },
  }),
  S2_SINGING_PRACTICED: cue({
    cueId: "S2_SINGING_PRACTICED",
    semanticClass: "S2",
    eventTypes: ["SINGING_PRACTICED"],
    caption: "歌の手がかりを残した",
    visualSignal: {
      kind: "practice-mark",
      glyph: "♪",
      label: "歌の作業状態を履歴に記録",
    },
    bus: "sfx",
    priority: "M2",
    cooldownMs: 450,
    synthesis: {
      waveform: "sine",
      frequency: 261.63,
      glideFrequency: 329.63,
      duration: 0.12,
      volume: 0.026,
    },
  }),
  S2_MUSIC_ARRANGED: cue({
    cueId: "S2_MUSIC_ARRANGED",
    semanticClass: "S2",
    eventTypes: ["MUSIC_ARRANGED"],
    caption: "曲の断片を組み立てた",
    visualSignal: {
      kind: "arrangement-mark",
      glyph: "≋",
      label: "曲づくりの状態を履歴に記録",
    },
    bus: "sfx",
    priority: "M2",
    cooldownMs: 450,
    synthesis: {
      waveform: "triangle",
      frequency: 329.63,
      glideFrequency: 440,
      duration: 0.14,
      volume: 0.03,
    },
  }),
  S2_SNS_POSTED: cue({
    cueId: "S2_SNS_POSTED",
    semanticClass: "S2",
    eventTypes: ["SNS_POSTED"],
    caption: "いま伝えたいことを届けた",
    visualSignal: {
      kind: "post-mark",
      glyph: "↗",
      label: "投稿した内容を履歴に記録",
    },
    bus: "sfx",
    priority: "M2",
    cooldownMs: 400,
    synthesis: {
      waveform: "sine",
      frequency: 493.88,
      glideFrequency: 587.33,
      duration: 0.08,
      volume: 0.022,
    },
  }),
  S2_LIVE_EVENT_HOSTED: cue({
    cueId: "S2_LIVE_EVENT_HOSTED",
    semanticClass: "S2",
    eventTypes: ["LIVE_EVENT_HOSTED"],
    caption: "集めてひらいた場が残った",
    visualSignal: {
      kind: "event-mark",
      glyph: "⌁",
      label: "ひらいた場の記録を表示",
    },
    bus: "sfx",
    priority: "M2",
    cooldownMs: 650,
    synthesis: {
      waveform: "triangle",
      frequency: 246.94,
      glideFrequency: 369.99,
      duration: 0.16,
      volume: 0.032,
    },
  }),
  S2_ACTIVITY_BRIDGE: cue({
    cueId: "S2_ACTIVITY_BRIDGE",
    semanticClass: "S2",
    eventTypes: ["ACTIVITY_BRIDGE", "ACTIVITY_BRIDGE_CREATED", "WORKS_CONNECTED"],
    caption: "活動がつながった",
    visualSignal: {
      kind: "connection-mark",
      glyph: "⌁",
      label: "活動どうしの接続を履歴に記録",
    },
    bus: "sfx",
    priority: "M2",
    cooldownMs: 500,
    synthesis: {
      waveform: "triangle",
      frequency: 329.63,
      glideFrequency: 493.88,
      duration: 0.16,
      volume: 0.04,
    },
  }),
  S2_BREAKPOINT: cue({
    cueId: "S2_BREAKPOINT",
    semanticClass: "S2",
    eventTypes: ["BREAKPOINT_REACHED", "BREAKPOINT"],
    caption: "節目に到達した",
    visualSignal: {
      kind: "breakpoint-mark",
      glyph: "◇",
      label: "到達した節目を履歴に記録",
    },
    bus: "sfx",
    priority: "M2",
    cooldownMs: 700,
    synthesis: {
      waveform: "triangle",
      frequency: 369.99,
      glideFrequency: 554.37,
      duration: 0.2,
      volume: 0.045,
    },
  }),
  S2_PRESTIGE_CONFIRM: cue({
    cueId: "S2_PRESTIGE_CONFIRM",
    semanticClass: "S2",
    eventTypes: ["PRESTIGE_CONFIRM"],
    caption: "切り替え前の確認",
    visualSignal: {
      kind: "decision-mark",
      glyph: "?",
      label: "引き継ぐものと変わるものを確認",
    },
    bus: "sfx",
    priority: "M0",
    cooldownMs: 800,
    synthesis: {
      waveform: "sine",
      frequency: 220,
      glideFrequency: 196,
      duration: 0.14,
      volume: 0.035,
    },
  }),
  S2_PRESTIGE_RELEASE: cue({
    cueId: "S2_PRESTIGE_RELEASE",
    semanticClass: "S2",
    eventTypes: ["PRESTIGE_RELEASE", "PRESTIGE_COMPLETE"],
    caption: "積み上げを意味として残した",
    visualSignal: {
      kind: "retirement-mark",
      glyph: "↧",
      label: "残した履歴と変わる法則を記録",
    },
    bus: "sfx",
    priority: "M2",
    cooldownMs: 900,
    synthesis: {
      waveform: "triangle",
      frequency: 246.94,
      glideFrequency: 329.63,
      duration: 0.19,
      volume: 0.04,
    },
  }),
  S2_PRESTIGE_AFTER: cue({
    cueId: "S2_PRESTIGE_AFTER",
    semanticClass: "S2",
    eventTypes: ["PRESTIGE_AFTER"],
    caption: "新しい活動の法則が始まった",
    visualSignal: {
      kind: "orientation-mark",
      glyph: "→",
      label: "新しい活動の法則を履歴に記録",
    },
    bus: "sfx",
    priority: "M2",
    cooldownMs: 900,
    synthesis: {
      waveform: "sine",
      frequency: 293.66,
      glideFrequency: 440,
      duration: 0.18,
      volume: 0.035,
    },
  }),
  ...scaleTransitionCues,
  S2_MAIN_COMPLETION: cue({
    cueId: "S2_MAIN_COMPLETION",
    semanticClass: "S2",
    eventTypes: ["MAIN_COMPLETION", "COMPLETION_CANDIDATE_RECORDED"],
    caption: "活動の記録を結んだ",
    visualSignal: {
      kind: "completion-mark",
      glyph: "◎",
      label: "完了候補と引き継いだ履歴を表示",
    },
    bus: "sfx",
    priority: "M2",
    cooldownMs: 1200,
    synthesis: {
      waveform: "sine",
      frequency: 261.63,
      glideFrequency: 392,
      duration: 0.24,
      volume: 0.04,
    },
  }),
  S2_SAVE_FAILURE: cue({
    cueId: "S2_SAVE_FAILURE",
    semanticClass: "S2",
    eventTypes: ["SAVE_FAILURE", "SAVE_FAIL"],
    caption: "保存できなかった",
    visualSignal: {
      kind: "recovery-mark",
      glyph: "!",
      label: "保存できなかった理由と復帰手段を表示",
    },
    bus: "sfx",
    priority: "M0",
    cooldownMs: 1000,
    synthesis: {
      waveform: "square",
      frequency: 174.61,
      glideFrequency: 146.83,
      duration: 0.13,
      volume: 0.03,
    },
  }),
  S2_RECOVERY_OPEN: cue({
    cueId: "S2_RECOVERY_OPEN",
    semanticClass: "S2",
    eventTypes: ["RECOVERY_OPEN"],
    caption: "復旧内容を確認する",
    visualSignal: {
      kind: "recovery-mark",
      glyph: "↺",
      label: "復旧前の確認内容を表示",
    },
    bus: "sfx",
    priority: "M0",
    cooldownMs: 800,
    synthesis: {
      waveform: "sine",
      frequency: 233.08,
      glideFrequency: 196,
      duration: 0.12,
      volume: 0.025,
    },
  }),
  S2_RECOVERY_RESULT: cue({
    cueId: "S2_RECOVERY_RESULT",
    semanticClass: "S2",
    eventTypes: ["RECOVERY_RESULT"],
    caption: "復旧結果を記録した",
    visualSignal: {
      kind: "recovery-mark",
      glyph: "✓",
      label: "復旧した範囲と次の行動を表示",
    },
    bus: "sfx",
    priority: "M0",
    cooldownMs: 800,
    synthesis: {
      waveform: "triangle",
      frequency: 246.94,
      glideFrequency: 293.66,
      duration: 0.13,
      volume: 0.028,
    },
  }),
  S2_OFFLINE_SUMMARY: cue({
    cueId: "S2_OFFLINE_SUMMARY",
    semanticClass: "S2",
    eventTypes: ["OFFLINE_SUMMARY"],
    caption: "留守中の変化をまとめた",
    visualSignal: {
      kind: "summary-mark",
      glyph: "≡",
      label: "留守中の変化を一件の要約として表示",
    },
    bus: "sfx",
    priority: "M2",
    cooldownMs: 1200,
    synthesis: {
      waveform: "sine",
      frequency: 293.66,
      glideFrequency: 349.23,
      duration: 0.15,
      volume: 0.028,
    },
  }),
  S2_RESUME_STATE: cue({
    cueId: "S2_RESUME_STATE",
    semanticClass: "S2",
    eventTypes: ["RESUME_STATE"],
    caption: "戻ってきたあとの変化をまとめた",
    visualSignal: {
      kind: "summary-mark",
      glyph: "↩",
      label: "復帰後の変化を一件の要約として表示",
    },
    bus: "sfx",
    priority: "M2",
    cooldownMs: 1200,
    synthesis: {
      waveform: "sine",
      frequency: 329.63,
      glideFrequency: 392,
      duration: 0.15,
      volume: 0.028,
    },
  }),
  S3_UI_SELECT: cue({
    cueId: "S3_UI_SELECT",
    semanticClass: "S3",
    eventTypes: ["UI_SELECT"],
    caption: "選択した",
    visualSignal: {
      kind: "selection-mark",
      glyph: "›",
      label: "選択中の項目を表示",
    },
    bus: "sfx",
    priority: "M3",
    cooldownMs: 80,
    synthesis: {
      waveform: "sine",
      frequency: 554.37,
      glideFrequency: 493.88,
      duration: 0.045,
      volume: 0.014,
    },
  }),
  S3_UI_CONFIRM: cue({
    cueId: "S3_UI_CONFIRM",
    semanticClass: "S3",
    eventTypes: ["UI_CONFIRM"],
    caption: "決定した",
    visualSignal: {
      kind: "selection-mark",
      glyph: "✓",
      label: "決定した内容を表示",
    },
    bus: "sfx",
    priority: "M3",
    cooldownMs: 120,
    synthesis: {
      waveform: "sine",
      frequency: 659.25,
      glideFrequency: 783.99,
      duration: 0.06,
      volume: 0.018,
    },
  }),
  S3_SAVE_OK: cue({
    cueId: "S3_SAVE_OK",
    semanticClass: "S3",
    eventTypes: ["SAVE_OK"],
    caption: "保存した",
    visualSignal: {
      kind: "save-mark",
      glyph: "▤",
      label: "保存時刻を表示",
    },
    bus: "sfx",
    priority: "M3",
    cooldownMs: 900,
    synthesis: {
      waveform: "triangle",
      frequency: 493.88,
      glideFrequency: 587.33,
      duration: 0.07,
      volume: 0.016,
    },
  }),
  S4_ROOM_FIELD: cue({
    cueId: "S4_ROOM_FIELD",
    semanticClass: "S4",
    eventTypes: ["ROOM_FIELD"],
    caption: "部屋の気配",
    visualSignal: {
      kind: "room-state-mark",
      glyph: "⌂",
      label: "いまいる部屋の状態を表示",
    },
    bus: "ambience",
    priority: "M4",
    synthesis: null,
  }),
  S4_SCORE_FIELD: cue({
    cueId: "S4_SCORE_FIELD",
    semanticClass: "S4",
    eventTypes: ["SCORE_FIELD"],
    caption: "活動の気配",
    visualSignal: {
      kind: "activity-state-mark",
      glyph: "≈",
      label: "活動の場の状態を表示",
    },
    bus: "music",
    priority: "M4",
    synthesis: null,
  }),
});

const cueAliases = new Map();
for (const definition of Object.values(AUDIO_CUE_DEFINITIONS)) {
  for (const key of [definition.cueId, ...definition.eventTypes, ...definition.triggerIds]) {
    cueAliases.set(normalizeSemanticKey(key), definition);
  }
}

function normalizeSemanticKey(value) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function clamp01(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(1, Math.max(0, parsed));
}

function firstIdentifier(values, fallback) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (Number.isFinite(value)) return String(value);
  }
  return fallback;
}

function findDefinition(event) {
  if (!event || typeof event !== "object") return null;
  if (normalizeSemanticKey(event.type) === "SCALE_PEAK_CANDIDATE") {
    const peakId = normalizeSemanticKey(event.peakId ?? event.scalePeakId ?? event.id);
    const peakMatch = /^SP(\d{1,2})$/.exec(peakId);
    if (peakMatch) {
      const number = Number(peakMatch[1]);
      const canonicalPeakId = "SP" + String(number).padStart(2, "0");
      return AUDIO_CUE_DEFINITIONS["S2_" + canonicalPeakId + "_TRANSITION"] ?? null;
    }
  }
  const keys = [
    event.cueId,
    event.audioCueId,
    event.triggerId,
    event.type,
    event.kind,
    event.name,
    event.audio?.cueId,
    event.audio?.triggerId,
  ];
  for (const key of keys) {
    const definition = cueAliases.get(normalizeSemanticKey(key));
    if (definition) return definition;
  }
  return null;
}

function isEntryTriggerAccepted(event) {
  const cueId = normalizeSemanticKey(event?.cueId ?? event?.audioCueId ?? event?.audio?.cueId);
  const type = normalizeSemanticKey(event?.type ?? event?.kind ?? event?.name);
  const trigger = normalizeSemanticKey(event?.triggerId ?? event?.audio?.triggerId);
  const audioKey = normalizeSemanticKey(event?.audioKey);
  if (trigger && trigger !== "TRG_ENTRY_01") return false;
  return cueId === "S0_ENTRY_CHIME"
    || type === "FIRST_EXTERNAL_ARRIVAL"
    || type === "ENTRY_CHIME"
    || trigger === "TRG_ENTRY_01"
    || audioKey === "ENTRY_CHIME_CANONICAL";
}

function isResumeContext(event, state) {
  return Boolean(
    event?.fromBackground
      || event?.background
      || event?.resume
      || state?.resuming
      || state?.resume?.active
      || state?.resumeState === "resuming"
      || state?.backgroundResume,
  );
}

const CURRENT_ENGINE_AUDIO_EVENT_TYPES = Object.freeze({
  ENTRY_CHIME: "ENTRY_CHIME",
  FICTIONAL_PERSON_REVISIT: "FICTIONAL_PERSON_REVISIT",
  FICTIONAL_PERSON_RETURNED: "FICTIONAL_PERSON_RETURNED",
  FICTIONAL_PERSON_AWAY: "FICTIONAL_PERSON_AWAY",
  MATERIAL_PRESERVED: "MATERIAL_PRESERVED",
  VIDEO_CREATED: "VIDEO_CREATED",
  SINGING_PRACTICED: "SINGING_PRACTICED",
  MUSIC_ARRANGED: "MUSIC_ARRANGED",
  SNS_POSTED: "SNS_POSTED",
  LIVE_EVENT_HOSTED: "LIVE_EVENT_HOSTED",
  ACTIVITY_BRIDGE_CREATED: "ACTIVITY_BRIDGE_CREATED",
  BREAKPOINT_REACHED: "BREAKPOINT_REACHED",
  PRESTIGE_COMPLETE: "PRESTIGE_COMPLETE",
  SCALE_PEAK_CANDIDATE: "SCALE_PEAK_CANDIDATE",
  COMPLETION_CANDIDATE_RECORDED: "COMPLETION_CANDIDATE_RECORDED",
  OFFLINE_SUMMARY: "OFFLINE_SUMMARY",
});

export function mapCurrentGameEventsToAudio(events, state = {}) {
  const input = Array.isArray(events) ? events : [events];
  const lineageId = state?.lineageId;
  const mapped = [];
  const seenEngineEvents = new Set();

  for (const event of input) {
    if (!event || typeof event !== "object") continue;
    const sourceType = normalizeSemanticKey(event.type);
    const mappedType = CURRENT_ENGINE_AUDIO_EVENT_TYPES[sourceType];
    if (!mappedType) continue;

    const sourceKey = event.id == null ? null : sourceType + ":" + String(event.id);
    if (sourceKey && seenEngineEvents.has(sourceKey)) continue;

    const mappedEvent = { type: mappedType, id: event.id, lineageId };
    if (mappedType === "ENTRY_CHIME") mappedEvent.audioKey = event.audioKey;
    if (mappedType === "SCALE_PEAK_CANDIDATE") {
      mappedEvent.peakId = event.peakId ?? event.scalePeakId ?? event.id;
    }
    if (mappedType === "OFFLINE_SUMMARY") mappedEvent.fromBackground = true;

    // This bridge only forwards actual engine event types to registered cues.
    // It deliberately does not invent generic aliases or turn an external
    // arrival record into the protected S0 entry chime.
    if (!findDefinition(mappedEvent)) continue;
    if (sourceKey) seenEngineEvents.add(sourceKey);
    mapped.push(mappedEvent);
  }

  return mapped;
}

function historyContainsEntryChime(state, lineageId, eventId) {
  if (
    state?.entryChimeHeard === true
    || state?.audio?.entryChimeHeard === true
    || state?.audio?.entryChime?.heard === true
    || state?.meta?.firstArrivalChimeHeard === true
  ) {
    return true;
  }

  const histories = [state?.audioHistory, state?.audio?.history, state?.history, state?.currentAudio?.history];
  return histories.some((history) => Array.isArray(history) && history.some((record) => {
    if (record?.cueId !== "S0_ENTRY_CHIME" || record?.heard !== true) return false;
    const sameLineage = !record.lineageId || record.lineageId === lineageId;
    const recordedEventId = record.eventId ?? record.id;
    const sameEvent = !recordedEventId || recordedEventId === eventId;
    return sameLineage && sameEvent;
  }));
}

function audioContextConstructor() {
  if (typeof window === "undefined") return null;
  return window.AudioContext ?? window.webkitAudioContext ?? null;
}

function decodeAudioData(context, bytes) {
  if (!context?.decodeAudioData) return Promise.resolve(null);
  try {
    const result = context.decodeAudioData(bytes);
    if (result && typeof result.then === "function") return result;
  } catch {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      context.decodeAudioData(bytes, resolve, () => resolve(null));
    } catch {
      resolve(null);
    }
  });
}

export function createCurrentAudioDirector(options = {}) {
  let context = null;
  let masterBus = null;
  let buses = null;
  let destroyed = false;
  let unlocked = false;
  let scene = null;
  let entryBuffer = null;
  let entryLoad = null;
  let entryPlaybackPending = false;
  let entryPlaybackActive = false;
  let pendingEntry = null;
  let ambienceSource = null;
  let musicSource = null;
  const activeSources = new Set();
  const lastCueAt = new Map();
  const seenEntryLineages = new Map();
  const seenEntryEvents = new Set();
  const notifiedEntryEvents = new Set();
  const initialLineage = firstIdentifier([options.lineageId], "session");
  let settings = normalizeSettings(options.settings);

  for (const lineage of options.playedEntryLineages ?? []) {
    if (typeof lineage === "string" && lineage) seenEntryLineages.set(lineage, "persisted");
  }

  function normalizeSettings(next = {}) {
    return {
      sound: next.sound !== false && next.enabled !== false,
      muted: Boolean(next.muted),
      musicVolume: clamp01(next.musicVolume, 0.7),
      sfxVolume: clamp01(next.sfxVolume, 0.82),
      ambienceVolume: clamp01(next.ambienceVolume, 0.45),
      reducedMotion: Boolean(next.reducedMotion),
    };
  }

  function hasAudibleOutput() {
    return !destroyed && unlocked && settings.sound && !settings.muted && context?.state === "running";
  }

  function setGain(gain, value) {
    if (!gain) return;
    const now = context?.currentTime ?? 0;
    gain.cancelScheduledValues?.(now);
    gain.setTargetAtTime?.(Math.max(0.0001, value), now, 0.025);
  }

  function updateBusGains() {
    if (!buses) return;
    const output = settings.sound && !settings.muted ? 1 : 0;
    setGain(masterBus?.gain, 0.6 * output);
    setGain(buses.music?.gain, settings.musicVolume * 0.28);
    setGain(buses.sfx?.gain, settings.sfxVolume * 0.48);
    setGain(buses.ambience?.gain, settings.ambienceVolume * 0.16);
  }

  function ensureContext() {
    if (destroyed || context) return context;
    const AudioContext = audioContextConstructor();
    if (!AudioContext) return null;
    try {
      context = new AudioContext();
      masterBus = context.createGain();
      buses = {
        music: context.createGain(),
        sfx: context.createGain(),
        ambience: context.createGain(),
      };
      for (const bus of Object.values(buses)) bus.connect(masterBus);
      masterBus.connect(context.destination);
      updateBusGains();
      return context;
    } catch {
      context = null;
      buses = null;
      masterBus = null;
      return null;
    }
  }

  async function loadEntryChime() {
    if (entryBuffer || entryLoad || destroyed) return entryBuffer ?? entryLoad;
    const activeContext = ensureContext();
    if (!activeContext || typeof fetch !== "function") return null;

    entryLoad = fetch(ENTRY_CHIME_URL)
      .then((response) => (response.ok ? response.arrayBuffer() : null))
      .then((bytes) => (bytes ? decodeAudioData(activeContext, bytes) : null))
      .then((decoded) => {
        entryBuffer = decoded;
        return decoded;
      })
      .catch(() => null)
      .finally(() => {
        entryLoad = null;
      });
    return entryLoad;
  }

  function trackSource(source, onEnded) {
    activeSources.add(source);
    source.onended = () => {
      activeSources.delete(source);
      onEnded?.();
    };
  }

  function stopSource(source) {
    try {
      source?.stop?.();
    } catch {
      // Sources may already be stopped.
    }
  }

  function stopSceneFields() {
    stopSource(ambienceSource);
    stopSource(musicSource);
    ambienceSource = null;
    musicSource = null;
  }

  function stopAllSources() {
    stopSceneFields();
    for (const source of activeSources) stopSource(source);
    activeSources.clear();
    entryPlaybackActive = false;
  }

  function playSynthesizedCue(definition) {
    const synthesis = definition.synthesis;
    const destination = buses?.[definition.bus];
    if (!hasAudibleOutput() || !synthesis || !destination) return false;

    const start = context.currentTime + 0.008;
    const end = start + synthesis.duration;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = synthesis.waveform;
    oscillator.frequency.setValueAtTime(synthesis.frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(32, synthesis.glideFrequency), end);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, synthesis.volume), start + Math.min(0.018, synthesis.duration / 3));
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    oscillator.connect(gain);
    gain.connect(destination);
    trackSource(oscillator);
    oscillator.start(start);
    oscillator.stop(end + 0.02);
    return true;
  }

  function playPendingEntryChime() {
    if (!pendingEntry || !hasAudibleOutput() || entryPlaybackPending || entryPlaybackActive) return false;
    entryPlaybackPending = true;
    void loadEntryChime().then((buffer) => {
      entryPlaybackPending = false;
      const pending = pendingEntry;
      if (!pending || !buffer || !hasAudibleOutput() || entryPlaybackActive || !buses?.sfx) {
        if (pending && !destroyed) {
          pending.record.playback = !buffer
            ? "pending-retry"
            : settings.sound && !settings.muted
              ? "pending-unlock"
              : "pending-muted";
        }
        return;
      }
      let source = null;
      try {
        source = context.createBufferSource();
        const gain = context.createGain();
        gain.gain.setValueAtTime(0.96, context.currentTime);
        source.buffer = buffer;
        source.connect(gain);
        gain.connect(buses.sfx);
        trackSource(source, () => {
          entryPlaybackActive = false;
        });
        source.start(context.currentTime + 0.008);
        entryPlaybackActive = true;
        markEntryRecord(pending.record);
        pending.record.pending = false;
        pending.record.playback = "played";
        pendingEntry = null;
        const playbackKey = pending.record.lineageId + ":" + pending.record.eventId;
        if (!notifiedEntryEvents.has(playbackKey)) {
          notifiedEntryEvents.add(playbackKey);
          try {
            options.onEntryPlayback?.(pending.record);
          } catch {
            // A persistence acknowledgement must not break the completed playback.
          }
        }
      } catch {
        activeSources.delete(source);
        entryPlaybackActive = false;
        pending.record.playback = "pending-retry";
      }
    });
    return true;
  }

  function queueEntryChime(record) {
    if (!pendingEntry) {
      pendingEntry = { record };
      record.pending = true;
    }
    if (playPendingEntryChime()) return "scheduled";
    return settings.sound && !settings.muted ? "pending-unlock" : "pending-muted";
  }

  function cueNow() {
    return context?.currentTime ?? Date.now() / 1000;
  }

  function canPlayRoutine(definition) {
    const previous = lastCueAt.get(definition.cueId) ?? Number.NEGATIVE_INFINITY;
    const now = cueNow();
    if (now - previous < definition.cooldownMs / 1000) return false;
    lastCueAt.set(definition.cueId, now);
    return true;
  }

  function makeRecord(definition, event, state) {
    const eventId = firstIdentifier(
      [event?.eventId, event?.id, event?.arrivalId, event?.personEventId],
      definition.cueId + ":" + normalizeSemanticKey(event?.type ?? event?.kind ?? event?.name ?? "event"),
    );
    const lineageId = firstIdentifier(
      [event?.lineageId, state?.saveLineageId, state?.lineageId, state?.save?.lineageId, options.lineageId],
      initialLineage,
    );
    const visualSignal = {
      ...definition.visualSignal,
      motion: settings.reducedMotion ? "static" : "brief-static-mark",
    };
    return {
      cueId: definition.cueId,
      semanticClass: definition.semanticClass,
      eventId,
      lineageId,
      caption: definition.caption,
      visualSignal,
      durableHistory: {
        type: "audio-semantic-event",
        cueId: definition.cueId,
        semanticClass: definition.semanticClass,
        eventId,
        lineageId,
        caption: definition.caption,
        visualSignal,
      },
      playback: "metadata-only",
      pending: false,
      suppressed: false,
      reason: null,
    };
  }

  function markEntryRecord(record) {
    seenEntryLineages.set(record.lineageId, record.eventId);
    seenEntryEvents.add(record.lineageId + ":" + record.eventId);
  }

  function entrySuppressionReason(event, state, record, resumeContext) {
    if (!isEntryTriggerAccepted(event)) return "entry-trigger-not-accepted";
    const eventKey = record.lineageId + ":" + record.eventId;
    if (seenEntryEvents.has(eventKey)) return "duplicate-event";
    if (seenEntryLineages.has(record.lineageId)) return "duplicate-lineage";
    if (pendingEntry) {
      if (pendingEntry.record.lineageId === record.lineageId && pendingEntry.record.eventId === record.eventId) {
        return "entry-pending";
      }
      if (pendingEntry.record.lineageId === record.lineageId) return "pending-lineage";
    }
    if (historyContainsEntryChime(state, record.lineageId, record.eventId)) return "already-recorded-in-lineage";
    if (resumeContext) {
      return "resume-policy";
    }
    if (entryPlaybackPending || entryPlaybackActive) return "entry-active";
    return null;
  }

  function emitHistory(record) {
    try {
      options.onHistoryRecord?.(record.durableHistory, record);
    } catch {
      // A consumer callback must never break game progression.
    }
  }

  async function unlock() {
    const activeContext = ensureContext();
    if (!activeContext || destroyed) return false;
    try {
      if (activeContext.state === "suspended") await activeContext.resume();
      unlocked = activeContext.state === "running";
      if (unlocked) {
        void loadEntryChime();
        playPendingEntryChime();
        if (scene) startSceneFields();
      }
      return unlocked;
    } catch {
      unlocked = false;
      return false;
    }
  }

  function startField(kind, destination, frequency, volume) {
    if (!hasAudibleOutput() || !destination) return null;
    try {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      gain.gain.setValueAtTime(Math.max(0.0001, volume), context.currentTime);
      oscillator.connect(gain);
      gain.connect(destination);
      trackSource(oscillator);
      oscillator.start();
      return oscillator;
    } catch {
      return null;
    }
  }

  function startSceneFields() {
    stopSceneFields();
    if (!scene || !hasAudibleOutput()) return;
    const sceneKey = normalizeSemanticKey(typeof scene === "string" ? scene : scene.id ?? scene.kind ?? "ROOM");
    if (sceneKey === "SILENT") return;
    const ambienceFrequency = sceneKey === "LIVE_EVENT" ? 82.41 : sceneKey === "BROADCAST" ? 92.5 : 73.42;
    ambienceSource = startField("ambience", buses?.ambience, ambienceFrequency, 0.012);
    if (typeof scene === "object" && (scene.score === true || scene.music === true)) {
      musicSource = startField("music", buses?.music, ambienceFrequency * 2, 0.006);
    }
  }

  function setSettings(nextSettings = {}) {
    settings = {
      ...settings,
      ...normalizeSettings({ ...settings, ...nextSettings }),
    };
    updateBusGains();
    if (!settings.sound || settings.muted) stopAllSources();
    else playPendingEntryChime();
    return { ...settings };
  }

  function setScene(nextScene) {
    scene = nextScene ?? null;
    startSceneFields();
    return {
      scene: typeof scene === "string" ? scene : scene?.id ?? scene?.kind ?? null,
      audible: hasAudibleOutput(),
      reducedMotion: settings.reducedMotion,
    };
  }

  function handle(events, state = {}) {
    const input = Array.isArray(events) ? events : [events];
    const items = input
      .filter((event) => event && typeof event === "object")
      .map((event) => {
        const definition = findDefinition(event);
        return definition ? { event, definition, record: makeRecord(definition, event, state) } : null;
      })
      .filter(Boolean);

    const resumeContext = Boolean(state?.resuming || state?.resume?.active || state?.backgroundResume)
      || items.some(({ event, definition }) => isResumeContext(event, state) || SUMMARY_CUE_IDS.has(definition.cueId));
    const safetyPresent = items.some(({ definition }) => definition.priority === "M0");

    for (const item of items) {
      if (item.definition.cueId === "S0_ENTRY_CHIME") {
        const reason = entrySuppressionReason(item.event, state, item.record, resumeContext);
        if (reason) {
          item.record.suppressed = true;
          item.record.reason = reason;
        }
      }
    }

    const playable = items.filter(({ record }) => !record.suppressed);
    if (resumeContext) {
      const summary = playable.find(({ definition }) => SUMMARY_CUE_IDS.has(definition.cueId));
      for (const item of playable) {
        const isSafety = item.definition.priority === "M0";
        const isSummary = item === summary && !safetyPresent;
        if (!isSafety && !isSummary) {
          item.record.suppressed = true;
          item.record.reason = "resume-policy";
        }
        if (SUMMARY_CUE_IDS.has(item.definition.cueId) && !isSummary) {
          item.record.suppressed = true;
          item.record.reason = safetyPresent ? "safety-overrides-summary" : "summary-collapsed";
        }
      }
    } else {
      const foreground = playable
        .filter(({ definition }) => ["M0", "M1", "M2"].includes(definition.priority))
        .sort((left, right) => PRIORITY_RANK[left.definition.priority] - PRIORITY_RANK[right.definition.priority]);
      const selected = foreground[0] ?? null;
      for (const item of foreground) {
        if (item !== selected) {
          item.record.suppressed = true;
          item.record.reason = "priority-collision";
        }
      }
    }

    const routineCueIds = new Set();
    for (const item of items) {
      if (item.record.suppressed || item.definition.priority !== "M3") continue;
      if (routineCueIds.has(item.definition.cueId) || !canPlayRoutine(item.definition)) {
        item.record.suppressed = true;
        item.record.reason = "routine-burst-collapsed";
      } else {
        routineCueIds.add(item.definition.cueId);
      }
    }

    for (const item of items) {
      const { definition, record } = item;
      if (record.suppressed) {
        record.playback = "suppressed";
      } else if (definition.cueId === "S0_ENTRY_CHIME") {
        record.playback = queueEntryChime(record);
      } else if (!hasAudibleOutput()) {
        record.playback = settings.sound && !settings.muted ? "awaiting-unlock" : "muted";
      } else {
        record.playback = playSynthesizedCue(definition) ? "scheduled" : "metadata-only";
      }
      emitHistory(record);
    }

    return items.map(({ record }) => record);
  }

  async function suspend() {
    stopAllSources();
    if (!context || destroyed) return false;
    try {
      if (context.state === "running") await context.suspend();
      unlocked = false;
      return context.state === "suspended";
    } catch {
      return false;
    }
  }

  async function destroy() {
    if (destroyed) return;
    destroyed = true;
    stopAllSources();
    pendingEntry = null;
    if (context?.close) {
      try {
        await context.close();
      } catch {
        // Closing a browser context can race with page teardown.
      }
    }
    context = null;
    buses = null;
    masterBus = null;
  }

  return {
    unlock,
    handle,
    setSettings,
    setScene,
    suspend,
    destroy,
  };
}
