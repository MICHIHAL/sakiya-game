const SAVE_KEY = "yaotome-sakiya-yani-panic:v1";
const SAVE_BACKUP_KEY = "yaotome-sakiya-yani-panic:backup";
const SAVE_SLOT_PREFIX = "yaotome-sakiya-yani-panic:slot:";
const SAVE_SCHEMA = 3;
const STRATEGY_IDS = new Set(["balanced", "rush", "fever", "safe"]);
const FEVER_SCRIPT_IDS = new Set(["instant", "chain", "climax"]);
const ENCORE_IDS = new Set(["blackout", "panic", "spotlight"]);
const UPGRADE_LIMITS = {
  voice: 18,
  drag: 18,
  retention: 15,
  gift: 15,
  feverRate: 12,
  feverPower: 12,
  ranking: 12,
  starter: 16,
};

export const DEFAULT_SAVE = {
  schema: SAVE_SCHEMA,
  runCount: 0,
  memories: 0,
  followers: 0,
  upgrades: {
    voice: 0,
    drag: 0,
    retention: 0,
    gift: 0,
    feverRate: 0,
    feverPower: 0,
    ranking: 0,
    starter: 0,
  },
  loadout: {
    strategy: "balanced",
    feverScript: "instant",
    encoreModifiers: [],
  },
  unlocks: {
    area2: false,
    area3: false,
    final: false,
    encore: false,
  },
  records: {
    maxDistance: 0,
    bestRank: 50,
    maxListeners: 0,
    maxCombo: 0,
    maxHit: 0,
    finalBossDefeated: false,
    fastestClearMs: null,
    bossesDefeated: [],
  },
  postgame: {
    encoreLevel: 0,
    crowns: 0,
  },
  profile: {
    onboardingSeen: false,
    contentNoteSeen: false,
    totalPlaySeconds: 0,
    lastSavedAt: null,
  },
  lastResult: null,
  history: [],
  settings: {
    sound: true,
    musicVolume: 0.72,
    sfxVolume: 0.88,
    reducedMotion: false,
    shake: true,
    comments: true,
    highContrast: false,
    speed: 1,
    fontScale: 1,
    numberDensity: "full",
    frameRate: 60,
  },
};

function cloneDefault() {
  return JSON.parse(JSON.stringify(DEFAULT_SAVE));
}

function finite(value, fallback = 0, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function integer(value, fallback = 0, min = 0, max = Number.MAX_SAFE_INTEGER) {
  return Math.floor(finite(value, fallback, min, max));
}

function normalizeResult(result) {
  if (!result || typeof result !== "object") return null;
  return {
    status: result.status === "victory" ? "victory" : "defeat",
    distance: finite(result.distance, 0, 0, 1000),
    bestRank: integer(result.bestRank, 50, 1, 50),
    memories: integer(result.memories, 0),
    maxHit: integer(result.maxHit, 0),
    followers: integer(result.followers, 0),
    combo: integer(result.combo, 0),
    bossName: typeof result.bossName === "string" ? result.bossName.slice(0, 80) : null,
    bossRemaining: result.bossRemaining == null ? null : finite(result.bossRemaining, 1, 0, 1),
    elapsed: finite(result.elapsed, 0, 0, 24 * 60 * 60),
    objectiveClears: integer(result.objectiveClears, 0, 0, 3),
    mode: result.mode === "encore" ? "encore" : "campaign",
    endReason: ["love", "boss", "retire", "final-boss"].includes(result.endReason) ? result.endReason : null,
  };
}

function normalizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history.slice(0, 20).map((entry, index) => ({
    id: typeof entry?.id === "string" ? entry.id.slice(0, 120) : `legacy-${index}`,
    at: typeof entry?.at === "string" ? entry.at : null,
    distance: integer(entry?.distance, 0, 0, 1000),
    rank: integer(entry?.rank, 50, 1, 50),
    memories: integer(entry?.memories, 0),
    status: entry?.status === "victory" ? "victory" : "defeat",
    maxHit: integer(entry?.maxHit, 0),
    followers: integer(entry?.followers, 0),
    combo: integer(entry?.combo, 0),
    bossName: typeof entry?.bossName === "string" ? entry.bossName.slice(0, 80) : null,
    bossRemaining: entry?.bossRemaining == null ? null : finite(entry.bossRemaining, 1, 0, 1),
    elapsed: finite(entry?.elapsed, 0, 0, 24 * 60 * 60),
    objectiveClears: integer(entry?.objectiveClears, 0, 0, 3),
    mode: entry?.mode === "encore" ? "encore" : "campaign",
    endReason: ["love", "boss", "retire", "final-boss"].includes(entry?.endReason) ? entry.endReason : null,
  }));
}

export function normalizeSave(parsed) {
  const base = cloneDefault();
  if (!parsed || typeof parsed !== "object") return base;
  const upgrades = Object.fromEntries(
    Object.entries(UPGRADE_LIMITS).map(([key, max]) => [key, integer(parsed.upgrades?.[key], 0, 0, max)]),
  );
  const bossesDefeated = Array.isArray(parsed.records?.bossesDefeated)
    ? [...new Set(parsed.records.bossesDefeated.filter((value) => typeof value === "string").map((value) => value.slice(0, 80)))].slice(0, 40)
    : [];
  const strategy = STRATEGY_IDS.has(parsed.loadout?.strategy) ? parsed.loadout.strategy : "balanced";
  const feverScript = FEVER_SCRIPT_IDS.has(parsed.loadout?.feverScript) ? parsed.loadout.feverScript : "instant";
  const encoreModifiers = Array.isArray(parsed.loadout?.encoreModifiers)
    ? [...new Set(parsed.loadout.encoreModifiers.filter((id) => ENCORE_IDS.has(id)))].slice(0, 2)
    : [];
  const speed = [1, 2, 4].includes(Number(parsed.settings?.speed)) ? Number(parsed.settings.speed) : 1;
  const fontScale = [1, 1.1, 1.2].includes(Number(parsed.settings?.fontScale)) ? Number(parsed.settings.fontScale) : 1;
  const frameRate = [30, 60].includes(Number(parsed.settings?.frameRate)) ? Number(parsed.settings.frameRate) : 60;
  const numberDensity = parsed.settings?.numberDensity === "reduced" ? "reduced" : "full";
  return {
    ...base,
    schema: SAVE_SCHEMA,
    runCount: integer(parsed.runCount, 0, 0, 1_000_000),
    memories: integer(parsed.memories, 0),
    followers: integer(parsed.followers, 0),
    upgrades,
    loadout: { strategy, feverScript, encoreModifiers },
    unlocks: {
      area2: Boolean(parsed.unlocks?.area2),
      area3: Boolean(parsed.unlocks?.area3),
      final: Boolean(parsed.unlocks?.final),
      encore: Boolean(parsed.unlocks?.encore || parsed.records?.finalBossDefeated),
    },
    records: {
      maxDistance: finite(parsed.records?.maxDistance, 0, 0, 1000),
      bestRank: integer(parsed.records?.bestRank, 50, 1, 50),
      maxListeners: integer(parsed.records?.maxListeners, 0),
      maxCombo: integer(parsed.records?.maxCombo, 0),
      maxHit: integer(parsed.records?.maxHit, 0),
      finalBossDefeated: Boolean(parsed.records?.finalBossDefeated),
      fastestClearMs: parsed.records?.fastestClearMs == null ? null : integer(parsed.records.fastestClearMs, 0, 0),
      bossesDefeated,
    },
    postgame: {
      encoreLevel: integer(parsed.postgame?.encoreLevel, 0, 0, 999),
      crowns: integer(parsed.postgame?.crowns, 0, 0, 999),
    },
    profile: {
      onboardingSeen: Boolean(parsed.profile?.onboardingSeen),
      contentNoteSeen: Boolean(parsed.profile?.contentNoteSeen),
      totalPlaySeconds: finite(parsed.profile?.totalPlaySeconds, 0, 0, 100_000_000),
      lastSavedAt: typeof parsed.profile?.lastSavedAt === "string" ? parsed.profile.lastSavedAt : null,
    },
    lastResult: normalizeResult(parsed.lastResult),
    history: normalizeHistory(parsed.history),
    settings: {
      sound: parsed.settings?.sound !== false,
      musicVolume: finite(parsed.settings?.musicVolume, 0.72, 0, 1),
      sfxVolume: finite(parsed.settings?.sfxVolume, 0.88, 0, 1),
      reducedMotion: Boolean(parsed.settings?.reducedMotion),
      shake: parsed.settings?.shake !== false,
      comments: parsed.settings?.comments !== false,
      highContrast: Boolean(parsed.settings?.highContrast),
      speed,
      fontScale,
      numberDensity,
      frameRate,
    },
  };
}

function readStored(key) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? normalizeSave(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function loadSave() {
  return readStored(SAVE_KEY) ?? readStored(SAVE_BACKUP_KEY) ?? cloneDefault();
}

export function writeSave(save) {
  const normalized = normalizeSave(save);
  normalized.profile.lastSavedAt = new Date().toISOString();
  if (typeof window !== "undefined") {
    try {
      const previous = window.localStorage.getItem(SAVE_KEY);
      const next = JSON.stringify(normalized);
      if (previous && previous !== next) window.localStorage.setItem(SAVE_BACKUP_KEY, previous);
      window.localStorage.setItem(SAVE_KEY, next);
    } catch {
      // The in-memory game remains playable when browser storage is unavailable.
    }
  }
  return normalized;
}

export function loadAutoBackup() {
  return readStored(SAVE_BACKUP_KEY);
}

export function writeSaveSlot(save, slot) {
  const index = integer(slot, 0, 0, 2);
  const normalized = normalizeSave(save);
  normalized.profile.lastSavedAt = new Date().toISOString();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(`${SAVE_SLOT_PREFIX}${index}`, JSON.stringify(normalized));
    } catch {
      // A failed manual backup must never interrupt the current run.
    }
  }
  return normalized;
}

export function loadSaveSlot(slot) {
  return readStored(`${SAVE_SLOT_PREFIX}${integer(slot, 0, 0, 2)}`);
}

export function listSaveSlots() {
  return [0, 1, 2].map((index) => {
    const save = loadSaveSlot(index);
    return save
      ? { index, occupied: true, runCount: save.runCount, distance: save.records.maxDistance, savedAt: save.profile.lastSavedAt }
      : { index, occupied: false, runCount: 0, distance: 0, savedAt: null };
  });
}

export function clearSave() {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(SAVE_KEY);
      window.localStorage.removeItem(SAVE_BACKUP_KEY);
      for (let index = 0; index < 3; index += 1) window.localStorage.removeItem(`${SAVE_SLOT_PREFIX}${index}`);
    } catch {
      // Ignore storage errors and still return a clean session.
    }
  }
  return cloneDefault();
}

export function serializeSave(save) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(normalizeSave(save)))));
}

export function deserializeSave(value) {
  if (typeof value !== "string" || value.length > 2_000_000) return null;
  try {
    return normalizeSave(JSON.parse(decodeURIComponent(escape(atob(value.trim())))));
  } catch {
    return null;
  }
}

export function permanentMultipliers(save) {
  const u = { ...DEFAULT_SAVE.upgrades, ...save.upgrades };
  return {
    attack: 2.25 ** u.voice,
    maxLove: 1.5 ** u.drag,
    attackSpeed: 1 + u.drag * 0.115,
    listener: 1.58 ** u.retention,
    gift: 1.72 ** u.gift,
    feverRate: 1 + u.feverRate * 0.22,
    feverPower: 2.5 + u.feverPower * 0.4,
    ranking: 1 + u.ranking * 0.1,
    starterCoins: u.starter ? Math.floor(260 * 2.12 ** u.starter) : 0,
  };
}

export function freshSave() {
  return cloneDefault();
}
