import assert from "node:assert/strict";
import test from "node:test";
import { AREAS, ENCORE_MODIFIERS, FEVER_SCRIPTS, MILESTONES, STRATEGIES, WORLD_END } from "../src/game/config.js";
import { buildRunObjectives, calculateRunResult, createRun, endRun, stepRun } from "../src/game/engine.js";
import { DEFAULT_SAVE, deserializeSave, normalizeSave, serializeSave } from "../src/game/save.js";

function makeSave(level = 0) {
  const save = structuredClone(DEFAULT_SAVE);
  for (const key of Object.keys(save.upgrades)) save.upgrades[key] = level;
  save.followers = level * 200_000;
  return save;
}

function simulate(save, seed = 9031) {
  const run = createRun(save, { seed });
  let steps = 0;
  while (run.status === "running" && steps < 100_000) {
    stepRun(run, 0.05);
    steps += 1;
  }
  assert.notEqual(run.status, "running", "RUN should always resolve without player input");
  return { run, result: calculateRunResult(run) };
}

test("a fresh passive RUN earns, grows, fevers, and loses at a meaningful wall", () => {
  const { result } = simulate(makeSave(0));
  assert.equal(result.status, "defeat");
  assert.ok(result.distance >= 450 && result.distance < 500);
  assert.equal(result.bossName, "ランク・デヴァウラー");
  assert.ok(result.coins > 1_000_000);
  assert.ok(result.followers > 10_000);
  assert.ok(result.feverCount > 0);
  assert.ok(Object.values(result.levels).every((level) => level > 0));
  assert.ok(result.memories > 100);
});

test("permanent growth moves the wall through Area 3 and into the final fight", () => {
  const levelOne = simulate(makeSave(1)).result;
  const levelTwo = simulate(makeSave(2)).result;
  assert.ok(levelOne.distance >= 700 && levelOne.distance < 800);
  assert.equal(levelOne.bossName, "放送塔の番猫");
  assert.equal(levelTwo.distance, 970);
  assert.equal(levelTwo.bossName, "KING YAMIGURO");
  assert.ok(levelTwo.bossRemaining > 0);
});

test("a sufficiently strengthened automatic RUN defeats the final boss", () => {
  const { run, result } = simulate(makeSave(3));
  assert.equal(result.status, "victory");
  assert.equal(result.distance, WORLD_END);
  assert.equal(result.bossRemaining, 0);
  assert.ok(result.defeatedBosses.includes("KING YAMIGURO"));
  assert.ok(result.memories >= 500);
  assert.equal(run.endReason, "final-boss");
});

test("every district has a distinct background and the full boss route is present", () => {
  assert.equal(new Set(AREAS.map((area) => area.background)).size, 4);
  assert.deepEqual(MILESTONES.map((boss) => boss.type), ["mid", "area", "mid", "area", "mid", "area", "final"]);
  assert.equal(new Set(MILESTONES.map((boss) => boss.mechanic)).size, MILESTONES.length);
  assert.equal(MILESTONES.at(-1).distance, 970);
});

test("manual stream end produces a result instead of discarding the RUN", () => {
  const run = createRun(makeSave(0), { seed: 42 });
  for (let index = 0; index < 200; index += 1) stepRun(run, 0.05);
  assert.equal(endRun(run), true);
  const result = calculateRunResult(run);
  assert.equal(result.status, "defeat");
  assert.equal(result.endReason, "retire");
  assert.ok(result.memories >= 18);
});

test("every director strategy changes a real combat or economy tradeoff", () => {
  const baseline = createRun(makeSave(0), { seed: 100 });
  for (const strategy of Object.values(STRATEGIES)) {
    const save = makeSave(0);
    save.loadout.strategy = strategy.id;
    const run = createRun(save, { seed: 100 });
    assert.equal(run.strategy.id, strategy.id);
    assert.equal(run.objectives.length, 3);
  }
  const rushSave = makeSave(0);
  rushSave.loadout.strategy = "rush";
  const rush = createRun(rushSave, { seed: 100 });
  const safeSave = makeSave(0);
  safeSave.loadout.strategy = "safe";
  const safe = createRun(safeSave, { seed: 100 });
  assert.ok(rush.attack > baseline.attack);
  assert.ok(rush.maxLove < baseline.maxLove);
  assert.ok(safe.maxLove > baseline.maxLove);
  assert.ok(safe.strategy.viewerLossModifier < rush.strategy.viewerLossModifier);
});

test("run objectives are strategy-aware and pay only when completed", () => {
  const save = makeSave(0);
  save.loadout.strategy = "fever";
  const objectives = buildRunObjectives(save);
  assert.equal(objectives.length, 3);
  assert.ok(objectives.some((objective) => objective.metric === "feverCount"));
  const run = createRun(save, { seed: 7 });
  run.rank = 1;
  run.bestRank = 1;
  const result = calculateRunResult(run);
  assert.equal(result.objectiveClears, 1);
  assert.ok(result.objectiveReward > 0);
});

test("FEVER scripts create distinct automatic timing tradeoffs", () => {
  const chainSave = makeSave(0);
  chainSave.loadout.feverScript = "chain";
  const chain = createRun(chainSave, { seed: 17 });
  chain.fever = FEVER_SCRIPTS.chain.threshold;
  stepRun(chain, 0.05);
  assert.ok(chain.feverTime > 0);
  assert.ok(chain.feverPower < chain.permanent.feverPower);

  const climaxSave = makeSave(0);
  climaxSave.loadout.feverScript = "climax";
  const climax = createRun(climaxSave, { seed: 17 });
  climax.fever = 100;
  stepRun(climax, 0.05);
  assert.equal(climax.feverTime, 0, "boss script should hold a full gauge on the road");
  assert.ok(climax.feverPower > climax.permanent.feverPower);
});

test("final clear unlocks explicit Encore scaling and selected modifiers", () => {
  const save = makeSave(3);
  save.records.finalBossDefeated = true;
  save.postgame.encoreLevel = 2;
  save.loadout.encoreModifiers = ["panic", "spotlight"];
  const run = createRun(save, { seed: 91 });
  assert.equal(run.mode, "encore");
  assert.equal(run.difficulty.tier, 3);
  assert.deepEqual(run.difficulty.modifiers, ["panic", "spotlight"]);
  assert.ok(run.difficulty.enemyHp > 1);
  assert.ok(run.difficulty.reward > ENCORE_MODIFIERS.panic.reward);
  assert.ok(run.difficulty.yaniDrain > 1);
  assert.ok(run.difficulty.viewerLoss > 1);
});

test("save export round-trips permanent progress and records", () => {
  const save = makeSave(2);
  save.memories = 4321;
  save.records.maxDistance = 760;
  save.records.maxHit = 987654;
  save.records.bossesDefeated = ["黒猫ジャマー"];
  save.profile.onboardingSeen = true;
  save.loadout.encoreModifiers = ["blackout", "panic"];
  save.lastResult = { status: "defeat", distance: 700, bestRank: 8, endReason: "love" };
  const restored = deserializeSave(serializeSave(save));
  assert.ok(restored);
  assert.equal(restored.memories, 4321);
  assert.equal(restored.upgrades.voice, 2);
  assert.equal(restored.records.maxDistance, 760);
  assert.equal(restored.records.maxHit, 987654);
  assert.deepEqual(restored.records.bossesDefeated, ["黒猫ジャマー"]);
  assert.deepEqual(restored.loadout.encoreModifiers, ["blackout", "panic"]);
  assert.equal(restored.profile.onboardingSeen, true);
  assert.equal(restored.lastResult.endReason, "love");
});

test("malformed or legacy save values are normalized into safe paid-build bounds", () => {
  const restored = normalizeSave({
    runCount: -9,
    memories: Number.POSITIVE_INFINITY,
    upgrades: { voice: 999, drag: -20 },
    records: { bestRank: -2, maxDistance: 9000, finalBossDefeated: true },
    settings: { speed: 99, frameRate: 12, fontScale: 8, numberDensity: "none", musicVolume: 8, sfxVolume: -3 },
    loadout: { strategy: "cheat", feverScript: "unknown", encoreModifiers: ["panic", "panic", "unknown", "spotlight", "blackout"] },
  });
  assert.equal(restored.schema, 3);
  assert.equal(restored.runCount, 0);
  assert.equal(restored.memories, 0);
  assert.equal(restored.upgrades.voice, 18);
  assert.equal(restored.upgrades.drag, 0);
  assert.equal(restored.loadout.strategy, "balanced");
  assert.equal(restored.loadout.feverScript, "instant");
  assert.deepEqual(restored.loadout.encoreModifiers, ["panic", "spotlight"]);
  assert.equal(restored.records.bestRank, 1);
  assert.equal(restored.records.maxDistance, 1000);
  assert.equal(restored.unlocks.encore, true);
  assert.equal(restored.settings.speed, 1);
  assert.equal(restored.settings.frameRate, 60);
  assert.equal(restored.settings.musicVolume, 1);
  assert.equal(restored.settings.sfxVolume, 0);
});
