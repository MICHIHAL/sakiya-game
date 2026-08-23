import {
  AREAS,
  COMMENT_POOLS,
  ENCORE_MODIFIERS,
  ENEMY_TYPES,
  FEVER_SCRIPTS,
  MILESTONES,
  RUN_LEVEL_CAPS,
  RUN_UPGRADES,
  STRATEGIES,
  WORLD_END,
  areaForDistance,
  rankTier,
  rankingForListeners,
  runUpgradeCost,
} from "./config.js";
import { permanentMultipliers } from "./save.js";

const PLAYER_X = 190;
const BOSS_X = 790;
const MAX_ENEMIES = 5;

const OBJECTIVE_COPY = {
  distance: { name: "前回の壁を越える", unit: "m" },
  kills: { name: "敵をまとめて片づける", unit: "体" },
  overkills: { name: "OVERKILLを決める", unit: "回" },
  feverCount: { name: "FEVERを起こす", unit: "回" },
  perfectDodges: { name: "愛を守って回避する", unit: "回" },
  bestRank: { name: "ランキングを押し上げる", unit: "位" },
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function random(run) {
  run.rng = (run.rng * 1664525 + 1013904223) >>> 0;
  return run.rng / 4294967296;
}

function choose(run, list) {
  return list[Math.floor(random(run) * list.length)] ?? list[0];
}

function uid(run, prefix) {
  run.serial += 1;
  return `${prefix}-${run.serial}`;
}

function pushEffect(run, effect) {
  const life = effect.ttl ?? 1;
  run.effects.push({
    id: uid(run, "fx"),
    x: 520,
    y: 250,
    ttl: 1,
    life,
    ...effect,
  });
  if (run.effects.length > 42) run.effects.splice(0, run.effects.length - 42);
}

function pushComment(run, type = "normal", forceText) {
  const base = COMMENT_POOLS[type] ?? COMMENT_POOLS.normal;
  const areaPool = type === "normal" ? COMMENT_POOLS[`area${run.areaId ?? 1}`] ?? [] : [];
  const pool = [...base, ...areaPool];
  const recent = new Set(run.comments.slice(0, 4).map((comment) => comment.text));
  const available = pool.filter((text) => !recent.has(text));
  const text = forceText ?? choose(run, available.length ? available : pool);
  if (!text || recent.has(text)) return;
  run.comments.unshift({
    id: uid(run, "comment"),
    text,
    type,
    user: `listener_${Math.floor(10 + random(run) * 989)}`,
  });
  run.comments = run.comments.slice(0, 7);
}

function emit(run, type, detail = {}) {
  run.pendingEvents.push({ type, ...detail });
}

function currentArea(run) {
  return areaForDistance(run.distance);
}

export function computePlayerStats(run) {
  const levels = run.levels;
  const p = run.permanent;
  const attack = 14 * p.attack * RUN_UPGRADES.voice.multiplier ** levels.voice * run.strategy.attackModifier;
  const attackInterval = clamp(
    0.82 / (p.attackSpeed * (1 + levels.drag * 0.08)),
    0.11,
    0.82,
  );
  const maxLove = 260 * p.maxLove * RUN_UPGRADES.love.multiplier ** levels.love * run.strategy.loveModifier;
  const incomeMultiplier = p.gift * RUN_UPGRADES.gift.multiplier ** levels.gift * run.strategy.incomeModifier;
  return { attack, attackInterval, maxLove, incomeMultiplier };
}

function objectiveValue(run, objective) {
  if (objective.metric === "distance") return Math.floor(run.distance);
  return Math.floor(run[objective.metric] ?? 0);
}

export function objectiveProgress(run, objective) {
  const value = objectiveValue(run, objective);
  const complete = objective.direction === "lte" ? value <= objective.target : value >= objective.target;
  const ratio = objective.direction === "lte"
    ? complete ? 1 : clamp((51 - value) / Math.max(1, 51 - objective.target), 0, 1)
    : clamp(value / Math.max(1, objective.target), 0, 1);
  return { ...objective, value, complete, ratio };
}

export function buildRunObjectives(save, strategyId = save.loadout?.strategy) {
  const strategy = STRATEGIES[strategyId] ?? STRATEGIES.balanced;
  const previousWall = Math.floor(save.records?.maxDistance ?? 0);
  const frontierTarget = previousWall > 0 && previousWall < WORLD_END
    ? Math.min(WORLD_END, previousWall + 1)
    : previousWall >= WORLD_END ? WORLD_END : 115;
  const rankTarget = previousWall >= 760 ? 10 : previousWall >= 485 ? 20 : previousWall >= 235 ? 30 : 40;
  const strategyObjective = strategy.id === "rush"
    ? { metric: "overkills", target: 8 + Math.min(12, save.runCount * 2), reward: 28 }
    : strategy.id === "fever"
      ? { metric: "feverCount", target: previousWall >= 500 ? 4 : 2, reward: 30 }
      : strategy.id === "safe"
        ? { metric: "perfectDodges", target: previousWall >= 500 ? 10 : 5, reward: 28 }
        : { metric: "kills", target: previousWall >= 500 ? 75 : 40, reward: 26 };
  return [
    { id: "frontier", metric: "distance", target: frontierTarget, reward: previousWall > 0 ? 38 : 24 },
    { id: `strategy-${strategy.id}`, ...strategyObjective },
    { id: "ranking", metric: "bestRank", target: rankTarget, direction: "lte", reward: 32 },
  ].map((objective) => ({
    ...objective,
    name: OBJECTIVE_COPY[objective.metric].name,
    unit: OBJECTIVE_COPY[objective.metric].unit,
  }));
}

function createDifficulty(save) {
  const mode = save.records?.finalBossDefeated ? "encore" : "campaign";
  if (mode === "campaign") {
    return { mode, tier: 0, enemyHp: 1, enemyAttack: 1, reward: 1, telegraph: 1, yaniDrain: 1, viewerLoss: 1, modifiers: [] };
  }
  const tier = Math.max(1, (save.postgame?.encoreLevel ?? 0) + 1);
  const selected = (save.loadout?.encoreModifiers ?? []).map((id) => ENCORE_MODIFIERS[id]).filter(Boolean).slice(0, 2);
  return selected.reduce((difficulty, modifier) => ({
    ...difficulty,
    reward: difficulty.reward * modifier.reward,
    telegraph: difficulty.telegraph * modifier.telegraph,
    yaniDrain: difficulty.yaniDrain * modifier.yaniDrain,
    enemyAttack: difficulty.enemyAttack * modifier.enemyAttack,
    viewerLoss: difficulty.viewerLoss * modifier.viewerLoss,
    modifiers: [...difficulty.modifiers, modifier.id],
  }), {
    mode,
    tier,
    enemyHp: 1 + tier * 0.55,
    enemyAttack: 1 + tier * 0.12,
    reward: 1 + tier * 0.18,
    telegraph: 1,
    yaniDrain: 1,
    viewerLoss: 1,
    modifiers: [],
  });
}

function refreshDerivedStats(run, healShare = 0) {
  const before = run.maxLove;
  const stats = computePlayerStats(run);
  run.attack = stats.attack;
  run.attackInterval = stats.attackInterval;
  run.incomeMultiplier = stats.incomeMultiplier;
  run.maxLove = stats.maxLove;
  if (before && stats.maxLove > before) {
    run.love = Math.min(stats.maxLove, run.love + (stats.maxLove - before) * healShare);
  }
}

function startingLiveViewers(save, p) {
  const followerBase = Math.sqrt(Math.max(0, save.followers ?? 0)) * 2.8;
  const previousRank = Math.max(1, save.records?.bestRank ?? 50);
  const rankCarry = previousRank <= 1 ? 1.75 : previousRank <= 3 ? 1.5 : previousRank <= 10 ? 1.35 : previousRank <= 20 ? 1.2 : previousRank <= 30 ? 1.1 : 1;
  return Math.floor((75 + followerBase) * p.listener ** 0.18 * rankCarry);
}

export function createRun(save, options = {}) {
  const permanent = permanentMultipliers(save);
  const strategy = STRATEGIES[save.loadout?.strategy] ?? STRATEGIES.balanced;
  const difficulty = createDifficulty(save);
  const feverScript = FEVER_SCRIPTS[save.loadout?.feverScript] ?? FEVER_SCRIPTS.instant;
  const initialLiveViewers = Math.floor(startingLiveViewers(save, permanent) * (strategy.id === "safe" ? 1.12 : 1));
  const initialRank = rankingForListeners((save.followers ?? 0) + initialLiveViewers * 2);
  const run = {
    id: `run-${Date.now()}-${save.runCount + 1}`,
    serial: 0,
    rng: options.seed ?? ((Date.now() ^ ((save.runCount + 1) * 2654435761)) >>> 0),
    status: "running",
    endReason: null,
    mode: difficulty.mode,
    difficulty,
    elapsed: 0,
    distance: 0,
    areaId: 1,
    previousAreaId: 1,
    areaTransition: null,
    transitionTimer: 0,
    lastWall: save.records?.maxDistance ?? 0,
    lastWallPassed: (save.records?.maxDistance ?? 0) <= 0,
    coins: permanent.starterCoins,
    coinsEarned: 0,
    incomePerSecond: 0,
    memoriesPreview: 0,
    followersStart: save.followers ?? 0,
    followersGained: 0,
    liveViewers: initialLiveViewers,
    peakLive: initialLiveViewers,
    gifts: 0,
    kills: 0,
    combo: 0,
    maxCombo: 0,
    rank: initialRank,
    bestRank: initialRank,
    fever: 0,
    feverTime: 0,
    feverCount: 0,
    ikebo: 0,
    yani: 100,
    yaniMax: 100,
    refilling: false,
    refillTimer: 0,
    refillDuration: 2.2,
    panicTime: 0,
    love: 260 * permanent.maxLove * strategy.loveModifier,
    maxLove: 260 * permanent.maxLove * strategy.loveModifier,
    attack: 14 * permanent.attack * strategy.attackModifier,
    attackInterval: 0.82 / permanent.attackSpeed,
    incomeMultiplier: permanent.gift,
    permanent,
    strategy,
    feverScript,
    feverPower: permanent.feverPower * feverScript.power,
    objectives: buildRunObjectives(save, strategy.id),
    strategyCursor: 0,
    levels: { voice: 0, drag: 0, love: 0, gift: 0 },
    enemies: [],
    effects: [],
    comments: [],
    pendingEvents: [],
    clearedMilestones: [],
    boss: null,
    bossName: null,
    bossMaxHp: 0,
    bossRemaining: null,
    bossPhase: 0,
    bossElapsed: 0,
    attackTimer: 0.2,
    spawnTimer: 0.5,
    incomeTimer: 0,
    autoBuyTimer: 0,
    commentTimer: 0.6,
    giftTimer: 4,
    momentum: 1,
    shake: 0,
    flash: 0,
    playerAttackTime: 0,
    playerDodgeTime: 0,
    playerHurtTime: 0,
    bossEntranceTime: 0,
    totalDamage: 0,
    maxHit: 0,
    perfectDodges: 0,
    overkills: 0,
    feverCoins: 0,
    defeatedBosses: [],
    nextGoal: MILESTONES[0],
  };
  refreshDerivedStats(run);
  pushComment(run, "normal", "配信はじまった！ 右へいこ！");
  emit(run, "run-start");
  return run;
}

function enemyPoolFor(run) {
  const area = currentArea(run);
  const local = (run.distance - area.start) / Math.max(1, area.end - area.start);
  return ENEMY_TYPES.filter((enemy, index) => enemy.minArea <= area.id && index <= area.id + 1 + Math.floor(local * 2));
}

function normalEnemyScale(run, area) {
  const local = clamp((run.distance - area.start) / Math.max(1, area.end - area.start), 0, 1);
  return area.enemyHpScale * (1 + local * (3.4 + area.id * 0.9)) * run.difficulty.enemyHp;
}

function spawnEnemy(run) {
  const area = currentArea(run);
  const template = choose(run, enemyPoolFor(run));
  const scale = normalEnemyScale(run, area);
  const hp = template.hp * scale;
  const enemy = {
    id: uid(run, "enemy"),
    templateId: template.id,
    name: template.name,
    sprite: template.sprite,
    role: template.role,
    hp,
    maxHp: hp,
    attack: template.attack * area.enemyAttackScale * run.difficulty.enemyAttack,
    speed: template.speed * (0.86 + random(run) * 0.25),
    reward: template.reward * area.income,
    x: 990 + random(run) * 110,
    y: template.role === "flying" ? 275 + random(run) * 35 : 355,
    size: template.role === "tank" ? 126 : template.role === "flying" ? 98 : 88,
    attackTimer: 0.9 + random(run) * 1.2,
    telegraph: 0,
    boss: false,
    dead: false,
    hitFlash: 0,
    spawnTime: 0.34,
    hoverSeed: random(run) * Math.PI * 2,
  };
  run.enemies.push(enemy);
  emit(run, "spawn", { enemy: template.id });
}

function spawnBoss(run, milestone) {
  const scaledHp = milestone.hp * run.difficulty.enemyHp;
  const enemy = {
    id: uid(run, "boss"),
    templateId: `boss-${milestone.distance}`,
    name: milestone.name,
    sprite: milestone.sprite,
    role: milestone.type,
    hp: scaledHp,
    maxHp: scaledHp,
    attack: milestone.attack * run.difficulty.enemyAttack,
    speed: milestone.type === "final" ? 22 : 30,
    reward: milestone.reward,
    x: BOSS_X,
    y: milestone.type === "final" ? 315 : 340,
    size: milestone.type === "final" ? 260 : milestone.type === "area" ? 205 : 155,
    attackTimer: 1.4,
    telegraph: 0,
    boss: true,
    milestone,
    dead: false,
    hitFlash: 0,
    break: 0,
    brokenTime: 0,
    spawnTime: 0.9,
    hoverSeed: random(run) * Math.PI * 2,
  };
  run.enemies = run.enemies.filter((item) => item.x < 560);
  run.enemies.push(enemy);
  run.boss = enemy;
  run.bossName = milestone.name;
  run.bossMaxHp = scaledHp;
  run.bossRemaining = 1;
  run.bossPhase = 1;
  run.bossElapsed = 0;
  run.bossEntranceTime = 1.1;
  run.momentum = 1;
  pushComment(run, "boss");
  pushEffect(run, { type: "banner", text: milestone.type === "final" ? "FINAL BOSS" : milestone.type === "area" ? "AREA BOSS" : "MID BOSS", ttl: 2.1, x: 480, y: 120 });
  emit(run, "boss-start", { name: milestone.name, bossType: milestone.type });
}

function addFollowers(run, amount) {
  const gained = Math.max(1, Math.floor(amount * run.permanent.listener));
  run.followersGained += gained;
  run.liveViewers += Math.max(1, Math.floor(gained * (0.14 + random(run) * 0.12)));
  run.peakLive = Math.max(run.peakLive, run.liveViewers);
}

function awardCoins(run, amount, source = "enemy") {
  const rankMultiplier = rankTier(run.rank).multiplier * run.permanent.ranking;
  const feverMultiplier = run.feverTime > 0 ? run.feverPower : 1;
  const final = Math.max(1, Math.floor(amount * run.incomeMultiplier * rankMultiplier * feverMultiplier * run.difficulty.reward));
  run.coins += final;
  run.coinsEarned += final;
  if (run.feverTime > 0) run.feverCoins += final;
  pushEffect(run, { type: "coin", text: `+${Math.floor(final).toLocaleString("ja-JP")}`, ttl: 1.15, x: 540 + random(run) * 130, y: 170 + random(run) * 160 });
  emit(run, "coin", { value: final, source });
  return final;
}

function dropGift(run, enemy) {
  const area = currentArea(run);
  const value = Math.max(20, enemy.reward * (2.2 + random(run) * 2.8) * area.income ** 0.15);
  run.gifts += 1;
  awardCoins(run, value, "gift");
  run.fever = clamp(run.fever + 10 * run.permanent.feverRate * run.strategy.feverGain, 0, 100);
  const heal = run.maxLove * 0.035;
  run.love = Math.min(run.maxLove, run.love + heal);
  pushEffect(run, { type: "gift", text: "GIFT", ttl: 1.6, x: enemy.x, y: enemy.y - 75 });
  if (random(run) < 0.45) pushComment(run, "gift");
  emit(run, "gift", { value });
}

function killEnemy(run, enemy, hitDamage) {
  enemy.dead = true;
  run.kills += 1;
  run.combo += enemy.boss ? 8 : 1;
  run.maxCombo = Math.max(run.maxCombo, run.combo);
  const overkillRatio = hitDamage / Math.max(1, enemy.maxHp);
  const overkill = overkillRatio >= 2.2;
  if (overkill) {
    run.overkills += 1;
    run.momentum = clamp(run.momentum + 0.22 + Math.log10(Math.max(1, overkillRatio)) * 0.12, 1, 5);
    pushEffect(run, { type: "overkill", text: "OVERKILL", ttl: 0.95, x: enemy.x, y: enemy.y - 70 });
    if (random(run) < 0.22) pushComment(run, "overkill");
  } else {
    run.momentum = clamp(run.momentum + 0.07, 1, 5);
  }
  awardCoins(run, enemy.reward, enemy.boss ? "boss" : "enemy");
  const area = currentArea(run);
  const followerBase = Math.sqrt(Math.max(1, enemy.reward)) * area.income * (enemy.boss ? 42 : 4.4);
  addFollowers(run, followerBase * (1 + run.combo * 0.012));
  run.fever = clamp(run.fever + (enemy.boss ? 34 : 4.2) * run.permanent.feverRate * run.strategy.feverGain, 0, 100);
  run.ikebo = clamp(run.ikebo + (enemy.boss ? 50 : 13), 0, 100);
  const giftChance = clamp(0.12 + run.levels.gift * 0.012 + run.strategy.giftChanceBonus + (run.feverTime > 0 ? 0.25 : 0), 0.12, 0.78);
  if (random(run) < giftChance || enemy.role === "gift" || enemy.boss) dropGift(run, enemy);
  emit(run, "kill", { boss: enemy.boss, overkill });

  if (enemy.boss) {
    const milestone = enemy.milestone;
    run.clearedMilestones.push(milestone.distance);
    run.defeatedBosses.push(milestone.name);
    run.boss = null;
    run.bossRemaining = 0;
    run.bossPhase = 0;
    run.nextGoal = MILESTONES.find((item) => !run.clearedMilestones.includes(item.distance)) ?? null;
    pushComment(run, "victory");
    pushEffect(run, { type: "banner", text: milestone.type === "final" ? "CROWN BREAK" : "BOSS CLEAR", ttl: 2.2, x: 480, y: 120 });
    emit(run, "boss-clear", { name: milestone.name, bossType: milestone.type });
    if (milestone.type === "final") {
      run.distance = WORLD_END;
      run.status = "victory";
      run.endReason = "final-boss";
      run.finishedAt = run.elapsed;
      run.memoriesPreview = calculateRunResult(run).memories;
      emit(run, "victory", { name: milestone.name });
    }
  }
}

function dealPlayerAttack(run) {
  const targets = run.enemies.filter((enemy) => !enemy.dead).sort((a, b) => a.x - b.x);
  if (!targets.length) return;
  const target = targets[0];
  const yaniRatio = run.yani / run.yaniMax;
  const panicMultiplier = run.panicTime > 0 || yaniRatio <= 0.08 ? 1.75 : yaniRatio <= 0.22 ? 1.28 : yaniRatio <= 0.5 ? 1.08 : 1;
  const feverMultiplier = run.feverTime > 0 ? run.feverPower : 1;
  const crit = random(run) < clamp(0.11 + run.combo * 0.0012, 0.11, 0.32);
  const variance = 0.88 + random(run) * 0.24;
  const damage = run.attack * panicMultiplier * feverMultiplier * variance * (crit ? 2.15 : 1);
  target.hp -= damage;
  target.hitFlash = 0.12;
  run.playerAttackTime = crit ? 0.2 : 0.13;
  run.totalDamage += damage;
  run.maxHit = Math.max(run.maxHit, damage);
  run.ikebo = clamp(run.ikebo + 3.8, 0, 100);
  run.fever = clamp(run.fever + 0.75 * run.permanent.feverRate * run.strategy.feverGain, 0, 100);
  run.yani = Math.max(0, run.yani - 0.62 / (1 + run.levels.drag * 0.055));
  pushEffect(run, { type: "damage", text: `${crit ? "CRITICAL " : ""}${Math.max(1, Math.floor(damage)).toLocaleString("ja-JP")}`, ttl: 0.75, x: target.x, y: target.y - target.size * 0.65, crit });
  emit(run, "attack", { crit, damage });

  if (target.boss) {
    target.break = clamp(target.break + 3.2 + (crit ? 4 : 0), 0, 100);
    if (target.break >= 100 && target.brokenTime <= 0) {
      target.break = 0;
      target.brokenTime = 3.2;
      run.ikebo = clamp(run.ikebo + 25, 0, 100);
      run.fever = clamp(run.fever + 18, 0, 100);
      pushEffect(run, { type: "banner", text: "BOSS BREAK", ttl: 1.15, x: 600, y: 175 });
      emit(run, "break");
    }
    run.bossRemaining = clamp(target.hp / target.maxHp, 0, 1);
    const nextPhase = run.bossRemaining > 0.66 ? 1 : run.bossRemaining > 0.33 ? 2 : 3;
    if (nextPhase > run.bossPhase && target.hp > 0) {
      run.bossPhase = nextPhase;
      run.shake = Math.max(run.shake, 0.2);
      pushEffect(run, { type: "banner", text: `BOSS PHASE ${nextPhase}`, ttl: 1.05, x: 480, y: 138 });
      pushComment(run, "boss", nextPhase === 3 ? "最終PHASE！ ここ耐えて！" : "PHASE変わった、攻撃くるよ！");
      emit(run, "boss-phase", { phase: nextPhase, name: target.name });
    } else {
      run.bossPhase = nextPhase;
    }
  }
  if (target.hp <= 0) killEnemy(run, target, damage);
}

export function activateIkebo(run, manual = false) {
  const cost = manual ? 50 : 100;
  if (!run || run.status !== "running" || run.ikebo < cost) return false;
  run.ikebo -= cost;
  const targets = run.enemies.filter((enemy) => !enemy.dead);
  if (!targets.length) return false;
  const multiplier = manual ? 5.5 : 9.5;
  for (const target of targets) {
    const damage = run.attack * multiplier * (run.feverTime > 0 ? run.feverPower : 1);
    target.hp -= damage;
    target.hitFlash = 0.24;
    run.totalDamage += damage;
    run.maxHit = Math.max(run.maxHit, damage);
    if (target.boss) {
      target.break = clamp(target.break + (manual ? 28 : 52), 0, 100);
      run.bossRemaining = clamp(target.hp / target.maxHp, 0, 1);
    }
    pushEffect(run, { type: "ikebo", text: manual ? "イケボ！" : "SUPER IKEBO!", ttl: 1.1, x: target.x, y: target.y - target.size * 0.75 });
    if (target.hp <= 0) killEnemy(run, target, damage);
  }
  run.shake = 0.35;
  emit(run, "ikebo", { manual });
  return true;
}

function applyEnemyDisruption(run, enemy) {
  let kind = null;
  let text = null;
  let comment = null;
  if (enemy.boss) {
    kind = enemy.milestone?.mechanic;
    if (kind === "crown") kind = run.bossPhase === 1 ? "rank" : run.bossPhase === 2 ? "jam" : "dry";
  } else if (enemy.role === "ranged") {
    kind = "noise";
  } else if (enemy.role === "gift") {
    kind = "steal";
  } else if (enemy.role === "tank") {
    kind = "signal";
  }

  if (kind === "noise") {
    run.fever = Math.max(0, run.fever - (enemy.boss ? 9 : 3.5));
    text = "FEVER NOISE";
    comment = "FEVER妨害きた、立て直そ！";
  } else if (kind === "jam") {
    run.fever = Math.max(0, run.fever - 14);
    run.ikebo = Math.max(0, run.ikebo - 8);
    text = "SIGNAL JAM";
    comment = "ゲージ吸われた！ BREAK狙って！";
  } else if (kind === "steal") {
    const stolen = Math.min(run.coins, Math.max(60, run.incomePerSecond * (enemy.boss ? 1.1 : 0.35)));
    run.coins = Math.max(0, run.coins - stolen);
    if (enemy.boss && run.gifts > 0) run.gifts -= 1;
    text = `-${Math.floor(stolen).toLocaleString("ja-JP")} GIFT`;
    comment = "ギフト泥棒！ 取り返せー！";
  } else if (kind === "rank") {
    run.liveViewers = Math.max(1, Math.floor(run.liveViewers * (enemy.boss ? 0.94 : 0.98)));
    text = "LIVE DROP";
    comment = "まだ離れないよ、ここから神回！";
  } else if (kind === "dry") {
    run.yani = Math.max(0, run.yani - (enemy.boss ? 10 : 5));
    text = "YANI DRAIN";
    comment = "補給タイミング崩された！";
  } else if (kind === "signal") {
    run.momentum = Math.max(1, run.momentum - (enemy.boss ? 0.8 : 0.35));
    run.ikebo = Math.max(0, run.ikebo - (enemy.boss ? 12 : 4));
    text = "MOMENTUM DOWN";
    comment = "押し戻された、でも右へ！";
  }

  if (!kind || !text) return;
  pushEffect(run, { type: "disrupt", text, ttl: 0.95, x: PLAYER_X + 74, y: 205 });
  if (enemy.boss || random(run) < 0.34) pushComment(run, "damage", comment);
  emit(run, "disrupt", { kind, boss: enemy.boss });
}

function resolveEnemyAttack(run, enemy) {
  const dodgeChance = clamp(0.18 + run.levels.drag * 0.012 + run.strategy.dodgeBonus, 0.08, 0.62);
  if (random(run) < dodgeChance) {
    run.perfectDodges += 1;
    run.playerDodgeTime = 0.32;
    run.combo += 1;
    run.maxCombo = Math.max(run.maxCombo, run.combo);
    run.fever = clamp(run.fever + 5.5 * run.permanent.feverRate, 0, 100);
    pushEffect(run, { type: "dodge", text: "PERFECT", ttl: 0.8, x: PLAYER_X + 60, y: 250 });
    if (random(run) < 0.3) pushComment(run, "dodge");
    emit(run, "dodge");
    return;
  }
  const bossPressure = enemy.boss ? 1 + Math.max(0, run.bossElapsed - 55) * 0.014 : 1;
  const damage = enemy.attack * bossPressure * (0.86 + random(run) * 0.3);
  run.love = Math.max(0, run.love - damage);
  run.combo = Math.floor(run.combo * 0.35);
  run.momentum = Math.max(1, run.momentum - 0.45);
  const viewerLoss = 0.025 * run.strategy.viewerLossModifier * run.difficulty.viewerLoss;
  run.liveViewers = Math.max(1, Math.floor(run.liveViewers * Math.max(0.82, 1 - viewerLoss)));
  run.shake = Math.min(0.5, run.shake + 0.2);
  run.flash = Math.min(0.35, run.flash + 0.18);
  run.playerHurtTime = 0.28;
  applyEnemyDisruption(run, enemy);
  pushEffect(run, { type: "hurt", text: `-${Math.floor(damage).toLocaleString("ja-JP")}`, ttl: 0.8, x: PLAYER_X + 40, y: 245 });
  if (random(run) < 0.24) pushComment(run, "damage");
  emit(run, "hurt", { damage });
}

function updateEnemies(run, dt) {
  for (const enemy of run.enemies) {
    if (enemy.dead) continue;
    enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
    enemy.spawnTime = Math.max(0, (enemy.spawnTime ?? 0) - dt);
    if (enemy.brokenTime > 0) {
      enemy.brokenTime -= dt;
      continue;
    }
    const attackRange = enemy.boss ? 650 : enemy.role === "ranged" ? 700 : 205;
    if (!enemy.boss && enemy.x - PLAYER_X > attackRange) {
      enemy.x -= enemy.speed * dt * (1 + (run.areaId - 1) * 0.05);
      continue;
    }
    enemy.attackTimer -= dt;
    if (enemy.telegraph > 0) {
      enemy.telegraph -= dt;
      if (enemy.telegraph <= 0) {
        resolveEnemyAttack(run, enemy);
      enemy.attackTimer = enemy.boss ? Math.max(0.72, 1.56 - run.bossPhase * 0.17) + random(run) * 0.82 : 1.8 + random(run) * 1.5;
      }
    } else if (enemy.attackTimer <= 0) {
      enemy.telegraph = (enemy.boss ? 0.72 : enemy.role === "rush" ? 0.34 : 0.48) * run.difficulty.telegraph;
      emit(run, "telegraph", { boss: enemy.boss });
    }
  }
  run.enemies = run.enemies.filter((enemy) => !enemy.dead);
}

function beginRefill(run) {
  if (run.refilling || run.panicTime > 0) return;
  run.refilling = true;
  run.refillTimer = 0;
  run.refillDuration = clamp(2.25 / (run.permanent.attackSpeed * (1 + run.levels.drag * 0.05)), 0.65, 2.25);
  emit(run, "refill-start");
}

function updateYani(run, dt) {
  if (run.refilling) {
    run.refillTimer += dt;
    run.yani = clamp(run.yani + (run.yaniMax / run.refillDuration) * dt, 0, run.yaniMax);
    if (run.refillTimer >= run.refillDuration || run.yani >= run.yaniMax) {
      run.refilling = false;
      run.yani = run.yaniMax;
      run.refillTimer = 0;
      emit(run, "refill-complete");
    }
    return;
  }
  run.yani = Math.max(0, run.yani - 0.26 * run.difficulty.yaniDrain * dt);
  if (run.yani <= 0 && run.panicTime <= 0) {
    run.panicTime = run.strategy.id === "rush" ? 4.2 : 2.2;
    pushComment(run, "panic");
    pushEffect(run, { type: "banner", text: "ヤニ切れ大パニック！", ttl: 1.4, x: 480, y: 130 });
    emit(run, "panic");
  }
  if (run.panicTime > 0) {
    run.panicTime -= dt;
    run.love = Math.max(0, run.love - run.maxLove * 0.014 * dt);
    if (run.panicTime <= 0) beginRefill(run);
  } else if (run.yani / run.yaniMax <= run.strategy.refillAt) {
    beginRefill(run);
  }
}

function updateFever(run, dt) {
  if (run.feverTime > 0) {
    run.feverTime -= dt;
    if (run.feverTime <= 0) {
      run.feverTime = 0;
      run.fever = 0;
      emit(run, "fever-end");
    }
    return;
  }
  const script = run.feverScript ?? FEVER_SCRIPTS.instant;
  const ready = run.fever >= script.threshold;
  const timingReady = !script.bossOnly || Boolean(run.boss);
  if (ready && timingReady) {
    run.fever = 100;
    run.feverTime = script.duration + run.levels.gift * 0.1;
    run.feverCount += 1;
    pushComment(run, "fever");
    pushEffect(run, { type: "banner", text: "FEVER!!", ttl: 1.5, x: 480, y: 112 });
    run.shake = 0.3;
    emit(run, "fever-start");
  }
}

function autoBuy(run) {
  const order = run.strategy.order;
  const levelCap = RUN_LEVEL_CAPS[run.areaId] ?? 21;
  for (let offset = 0; offset < order.length; offset += 1) {
    const index = (run.strategyCursor + offset) % order.length;
    const key = order[index];
    if (run.levels[key] >= levelCap) continue;
    const cost = runUpgradeCost(key, run.levels[key]);
    if (run.coins >= cost) {
      run.coins -= cost;
      run.levels[key] += 1;
      run.strategyCursor = (index + 1) % order.length;
      refreshDerivedStats(run, key === "love" ? 0.72 : 0.18);
      pushEffect(run, { type: "upgrade", text: `${RUN_UPGRADES[key].name} Lv.${run.levels[key]}`, ttl: 1.05, x: 330 + random(run) * 280, y: 410 });
      if (random(run) < 0.22) pushComment(run, "upgrade");
      emit(run, "upgrade", { key, level: run.levels[key] });
      return true;
    }
  }
  const affordable = Object.keys(RUN_UPGRADES)
    .filter((key) => run.levels[key] < levelCap)
    .map((key) => ({ key, cost: runUpgradeCost(key, run.levels[key]) }))
    .filter((item) => item.cost <= run.coins)
    .sort((a, b) => a.cost - b.cost)[0];
  if (!affordable) return false;
  run.coins -= affordable.cost;
  run.levels[affordable.key] += 1;
  refreshDerivedStats(run, affordable.key === "love" ? 0.72 : 0.18);
  emit(run, "upgrade", { key: affordable.key, level: run.levels[affordable.key] });
  return true;
}

function updateIncomeAndRank(run, dt) {
  const area = currentArea(run);
  const rankMultiplier = rankTier(run.rank).multiplier * run.permanent.ranking;
  const feverMultiplier = run.feverTime > 0 ? run.feverPower : 1;
  const baseIncome = area.income * (3 + Math.sqrt(Math.max(1, run.liveViewers)) * 0.32);
  run.incomePerSecond = baseIncome * run.incomeMultiplier * rankMultiplier * feverMultiplier;
  const earned = run.incomePerSecond * dt;
  run.coins += earned;
  run.coinsEarned += earned;
  if (run.feverTime > 0) run.feverCoins += earned;
  run.rank = rankingForListeners(run.followersStart + run.followersGained + run.liveViewers * 2);
  run.bestRank = Math.min(run.bestRank, run.rank);
  run.peakLive = Math.max(run.peakLive, run.liveViewers);
}

function updateProgress(run, dt) {
  if (run.boss || run.status !== "running") return;
  const blockers = run.enemies.filter((enemy) => !enemy.dead && enemy.x < 680).length;
  const speed = (8.2 * run.momentum * run.strategy.progressModifier) / (1 + blockers * 0.38);
  run.distance = Math.min(WORLD_END, run.distance + speed * dt);

  if (!run.lastWallPassed && run.distance > run.lastWall + 1) {
    run.lastWallPassed = true;
    pushComment(run, "victory", "前回の到達地点を越えた！");
    pushEffect(run, { type: "banner", text: "LAST RUN BREAK!", ttl: 1.7, x: 480, y: 130 });
    emit(run, "last-wall");
  }

  const area = currentArea(run);
  if (area.id !== run.areaId) {
    run.previousAreaId = run.areaId;
    run.areaId = area.id;
    run.areaTransition = `${area.name} — ${area.subtitle}`;
    run.transitionTimer = 3.6;
    run.momentum = Math.max(1, run.momentum * 0.55);
    pushComment(run, "victory", "景色変わった！ 新エリアだ！");
    emit(run, "area", { area: area.id });
  }

  const milestone = MILESTONES.find(
    (item) => run.distance >= item.distance && !run.clearedMilestones.includes(item.distance),
  );
  if (milestone) {
    run.distance = milestone.distance;
    spawnBoss(run, milestone);
  }
}

function updateTimers(run, dt) {
  run.shake = Math.max(0, run.shake - dt);
  run.flash = Math.max(0, run.flash - dt);
  run.playerAttackTime = Math.max(0, run.playerAttackTime - dt);
  run.playerDodgeTime = Math.max(0, run.playerDodgeTime - dt);
  run.playerHurtTime = Math.max(0, run.playerHurtTime - dt);
  run.bossEntranceTime = Math.max(0, run.bossEntranceTime - dt);
  run.transitionTimer = Math.max(0, run.transitionTimer - dt);
  if (run.transitionTimer <= 0) run.areaTransition = null;
  for (const effect of run.effects) effect.ttl -= dt;
  run.effects = run.effects.filter((effect) => effect.ttl > 0);
}

function finishDefeat(run, reason = null) {
  if (run.status !== "running") return;
  run.status = "defeat";
  run.endReason = reason ?? (run.boss ? "boss" : "love");
  run.finishedAt = run.elapsed;
  if (run.boss) {
    run.bossRemaining = clamp(run.boss.hp / run.boss.maxHp, 0, 1);
    run.bossName = run.boss.name;
  }
  run.memoriesPreview = calculateRunResult(run).memories;
  pushComment(run, "defeat");
  emit(run, "defeat", { reason: run.endReason });
}

export function endRun(run) {
  if (!run || run.status !== "running") return false;
  finishDefeat(run, "retire");
  return true;
}

export function stepRun(run, rawDt) {
  if (!run || run.status !== "running") return [];
  const dt = clamp(rawDt, 0, 0.08);
  run.pendingEvents = [];
  run.elapsed += dt;
  updateTimers(run, dt);
  updateYani(run, dt);
  updateFever(run, dt);
  updateIncomeAndRank(run, dt);
  updateEnemies(run, dt);

  if (!run.refilling) {
    run.attackTimer -= dt;
    if (run.attackTimer <= 0) {
      dealPlayerAttack(run);
      run.attackTimer += run.attackInterval;
    }
  }

  if (run.ikebo >= 100 && run.enemies.length) activateIkebo(run, false);

  run.spawnTimer -= dt;
  if (!run.boss && run.spawnTimer <= 0 && run.enemies.length < MAX_ENEMIES) {
    spawnEnemy(run);
    const density = run.feverTime > 0 ? 0.62 : 1;
    run.spawnTimer = (1.05 + random(run) * 0.72) * density / Math.sqrt(run.momentum);
  }

  run.autoBuyTimer -= dt;
  if (run.autoBuyTimer <= 0) {
    autoBuy(run);
    run.autoBuyTimer = 0.32;
  }

  run.commentTimer -= dt;
  if (run.commentTimer <= 0) {
    pushComment(run, run.boss ? "boss" : run.feverTime > 0 ? "fever" : "normal");
    run.commentTimer = run.feverTime > 0 ? 1.25 + random(run) : 2.5 + random(run) * 2.5;
  }

  if (run.boss) {
    run.bossElapsed += dt;
    run.bossRemaining = clamp(run.boss.hp / run.boss.maxHp, 0, 1);
  }

  updateProgress(run, dt);
  if (run.love <= 0) finishDefeat(run);
  run.memoriesPreview = calculateRunResult(run).memories;
  return run.pendingEvents;
}

export function calculateRunResult(run) {
  const progressValue = Math.floor(run.distance * 0.22);
  const bossProgress = run.bossRemaining == null ? 0 : Math.floor((1 - run.bossRemaining) * 52);
  const bossValue = run.defeatedBosses.length * 18;
  const rankValue = Math.max(0, 50 - run.bestRank);
  const recordValue = run.lastWallPassed ? 22 : 0;
  const victoryValue = run.status === "victory" ? 520 : 0;
  const objectives = run.objectives.map((objective) => objectiveProgress(run, objective));
  const objectiveValueTotal = objectives.filter((objective) => objective.complete).reduce((sum, objective) => sum + objective.reward, 0);
  const baseMemories = 12 + progressValue + bossProgress + bossValue + rankValue + recordValue + victoryValue + objectiveValueTotal;
  const memories = Math.max(18, Math.floor(baseMemories * run.difficulty.reward));
  return {
    status: run.status,
    mode: run.mode,
    encoreTier: run.difficulty.tier,
    encoreModifiers: [...run.difficulty.modifiers],
    memories,
    distance: run.distance,
    area: currentArea(run),
    elapsed: run.elapsed,
    coins: Math.floor(run.coinsEarned),
    gifts: run.gifts,
    kills: run.kills,
    combo: run.maxCombo,
    feverCount: run.feverCount,
    bestRank: run.bestRank,
    followers: Math.floor(run.followersGained),
    peakLive: Math.floor(run.peakLive),
    bossName: run.bossName,
    bossRemaining: run.bossRemaining,
    defeatedBosses: [...run.defeatedBosses],
    maxHit: Math.floor(run.maxHit),
    perfectDodges: run.perfectDodges,
    overkills: run.overkills,
    objectives,
    objectiveClears: objectives.filter((objective) => objective.complete).length,
    objectiveReward: objectiveValueTotal,
    endReason: run.endReason,
    levels: { ...run.levels },
  };
}

export function publicRunSnapshot(run) {
  if (!run) return null;
  return {
    ...run,
    strategy: { ...run.strategy },
    levels: { ...run.levels },
    enemies: run.enemies.map((enemy) => ({ ...enemy })),
    effects: run.effects.map((effect) => ({ ...effect })),
    comments: run.comments.map((comment) => ({ ...comment })),
    objectives: run.objectives.map((objective) => objectiveProgress(run, objective)),
    difficulty: { ...run.difficulty, modifiers: [...run.difficulty.modifiers] },
    clearedMilestones: [...run.clearedMilestones],
    defeatedBosses: [...run.defeatedBosses],
    pendingEvents: [],
  };
}

export function nextMilestoneForDistance(distance, cleared = []) {
  return MILESTONES.find((item) => item.distance >= distance && !cleared.includes(item.distance)) ?? null;
}

export const GAME_CONSTANTS = { PLAYER_X, BOSS_X };
