export const WORLD_END = 1000;

export const AREAS = [
  {
    id: 1,
    name: "AREA 1",
    subtitle: "ストリーマーシティ",
    stage: "きらめき配信街",
    start: 0,
    end: 250,
    background: "/assets/world-area1.webp",
    accent: "#ff66bd",
    soft: "#ffd5ee",
    enemyHpScale: 1,
    enemyAttackScale: 1,
    income: 1,
  },
  {
    id: 2,
    name: "AREA 2",
    subtitle: "ネオン高架街",
    stage: "ランキング繁華街",
    start: 250,
    end: 500,
    background: "/assets/world-area2.webp",
    accent: "#b866ff",
    soft: "#aeeeff",
    enemyHpScale: 28,
    enemyAttackScale: 3.2,
    income: 14,
  },
  {
    id: 3,
    name: "AREA 3",
    subtitle: "闇の放送塔地区",
    stage: "ブラックアウト回線",
    start: 500,
    end: 780,
    background: "/assets/world-area3.webp",
    accent: "#ff3f9a",
    soft: "#d9a4ff",
    enemyHpScale: 760,
    enemyAttackScale: 10,
    income: 185,
  },
  {
    id: 4,
    name: "FINAL AREA",
    subtitle: "最終ライブ要塞",
    stage: "クラウン・ステージ",
    start: 780,
    end: WORLD_END + 1,
    background: "/assets/world-final.webp",
    accent: "#ffc65b",
    soft: "#fff1bd",
    enemyHpScale: 22000,
    enemyAttackScale: 29,
    income: 2800,
  },
];

export const MILESTONES = [
  { distance: 115, type: "mid", area: 1, name: "ノイズ・キャット", sprite: "/assets/sprites/enemy-caster.webp", hp: 950, attack: 16, reward: 1500, mechanic: "noise", mechanicLabel: "FEVER NOISE" },
  { distance: 235, type: "area", area: 1, name: "黒猫ジャマー", sprite: "/assets/sprites/boss-area1.webp", hp: 6800, attack: 30, reward: 8400, mechanic: "jam", mechanicLabel: "SIGNAL JAM" },
  { distance: 360, type: "mid", area: 2, name: "ギフト・イーター", sprite: "/assets/sprites/enemy-gift.webp", hp: 52000, attack: 58, reward: 72000, mechanic: "steal", mechanicLabel: "GIFT STEAL" },
  { distance: 485, type: "area", area: 2, name: "ランク・デヴァウラー", sprite: "/assets/sprites/boss-area2.webp", hp: 390000, attack: 88, reward: 560000, mechanic: "rank", mechanicLabel: "LIVE DROP" },
  { distance: 620, type: "mid", area: 3, name: "デッドエアDJ", sprite: "/assets/sprites/enemy-flying.webp", hp: 2400000, attack: 142, reward: 4400000, mechanic: "dry", mechanicLabel: "YANI DRAIN" },
  { distance: 760, type: "area", area: 3, name: "放送塔の番猫", sprite: "/assets/sprites/boss-area3.webp", hp: 18000000, attack: 218, reward: 38000000, mechanic: "signal", mechanicLabel: "MOMENTUM DOWN" },
  { distance: 970, type: "final", area: 4, name: "KING YAMIGURO", sprite: "/assets/sprites/boss-final.webp", hp: 210000000, attack: 365, reward: 680000000, mechanic: "crown", mechanicLabel: "CROWN PHASES" },
];

export const ENEMY_TYPES = [
  { id: "chibi", name: "ちびノイズ", sprite: "/assets/sprites/enemy-chibi.webp", hp: 32, attack: 6, speed: 62, reward: 30, minArea: 1, role: "swarm" },
  { id: "flying", name: "フライング・ニャ", sprite: "/assets/sprites/enemy-flying.webp", hp: 58, attack: 8, speed: 76, reward: 52, minArea: 1, role: "flying" },
  { id: "rusher", name: "突進ネコ", sprite: "/assets/sprites/enemy-rusher.webp", hp: 92, attack: 13, speed: 108, reward: 84, minArea: 1, role: "rush" },
  { id: "caster", name: "コメ荒らし", sprite: "/assets/sprites/enemy-caster.webp", hp: 165, attack: 18, speed: 48, reward: 145, minArea: 2, role: "ranged" },
  { id: "tank", name: "アーマーキャット", sprite: "/assets/sprites/enemy-tank.webp", hp: 350, attack: 27, speed: 35, reward: 310, minArea: 2, role: "tank" },
  { id: "gift", name: "ギフト泥棒", sprite: "/assets/sprites/enemy-gift.webp", hp: 590, attack: 34, speed: 72, reward: 610, minArea: 3, role: "gift" },
];

export const RUN_UPGRADES = {
  voice: { name: "イケボ", short: "攻撃力", icon: "MicrophoneStage", baseCost: 180, growth: 1.58, multiplier: 1.34 },
  drag: { name: "ヤニ吸引力", short: "連射・補給", icon: "Cigarette", baseCost: 155, growth: 1.56, multiplier: 1.1 },
  love: { name: "リスナーの愛", short: "配信継続力", icon: "Heart", baseCost: 210, growth: 1.61, multiplier: 1.27 },
  gift: { name: "応援ボーナス", short: "収益・ギフト", icon: "Gift", baseCost: 145, growth: 1.54, multiplier: 1.3 },
};

// Area-by-area ceilings keep a single lucky gift from skipping the whole journey.
// Crossing into a new district visibly opens the next band of explosive RUN growth.
export const RUN_LEVEL_CAPS = { 1: 6, 2: 11, 3: 16, 4: 21 };

export const STRATEGIES = {
  balanced: {
    id: "balanced",
    name: "いつもの配信",
    description: "火力・継続・収益を均等に伸ばす",
    bestFor: "初見区間と迷った時",
    risk: "安定",
    order: ["voice", "gift", "drag", "love"],
    refillAt: 0.28,
    feverGain: 1,
    dodgeBonus: 0,
    attackModifier: 1,
    loveModifier: 1,
    incomeModifier: 1,
    progressModifier: 1,
    viewerLossModifier: 1,
    giftChanceBonus: 0,
    metrics: { 火力: 3, 速度: 3, 継続: 3, 神回: 3 },
  },
  rush: {
    id: "rush",
    name: "ヤニ切れ上等",
    description: "愛を削って、旧区間を最速で踏み潰す",
    bestFor: "前回の壁まで高速到達",
    risk: "高",
    order: ["voice", "drag", "voice", "gift", "love"],
    refillAt: 0.1,
    feverGain: 1.08,
    dodgeBonus: -0.04,
    attackModifier: 1.08,
    loveModifier: 0.88,
    incomeModifier: 1.02,
    progressModifier: 1.18,
    viewerLossModifier: 1.18,
    giftChanceBonus: 0,
    metrics: { 火力: 4, 速度: 5, 継続: 1, 神回: 3 },
  },
  fever: {
    id: "fever",
    name: "神回ねらい",
    description: "平常火力を抑え、ギフトとFEVERを連鎖させる",
    bestFor: "収益とランキングの爆発",
    risk: "中",
    order: ["gift", "voice", "gift", "drag", "love"],
    refillAt: 0.22,
    feverGain: 1.35,
    dodgeBonus: 0,
    attackModifier: 0.94,
    loveModifier: 0.96,
    incomeModifier: 1.12,
    progressModifier: 0.98,
    viewerLossModifier: 1,
    giftChanceBonus: 0.12,
    metrics: { 火力: 2, 速度: 2, 継続: 3, 神回: 5 },
  },
  safe: {
    id: "safe",
    name: "古参と完走",
    description: "速度を譲り、愛とLIVE人数を守って長く戦う",
    bestFor: "初遭遇BOSSと惜敗後",
    risk: "低",
    order: ["love", "drag", "gift", "voice"],
    refillAt: 0.42,
    feverGain: 0.92,
    dodgeBonus: 0.1,
    attackModifier: 0.92,
    loveModifier: 1.28,
    incomeModifier: 0.98,
    progressModifier: 0.93,
    viewerLossModifier: 0.5,
    giftChanceBonus: 0.02,
    metrics: { 火力: 2, 速度: 1, 継続: 5, 神回: 2 },
  },
};

export const FEVER_SCRIPTS = {
  instant: {
    id: "instant",
    name: "即点火",
    description: "100%で即発動。どの区間でも腐らない標準演出",
    threshold: 100,
    duration: 11.5,
    power: 1,
    bossOnly: false,
    tag: "BALANCED",
  },
  chain: {
    id: "chain",
    name: "ショート連鎖",
    description: "82%で短く発動。ギフトとコメントを細かく回す",
    threshold: 82,
    duration: 8.2,
    power: 0.86,
    bossOnly: false,
    tag: "ECONOMY",
  },
  climax: {
    id: "climax",
    name: "ボス温存",
    description: "MAXをBOSSまで保持。長く強い決戦FEVERへ",
    threshold: 100,
    duration: 13.8,
    power: 1.16,
    bossOnly: true,
    tag: "BOSS",
  },
};

export const ENCORE_MODIFIERS = {
  blackout: {
    id: "blackout",
    name: "BLACKOUT",
    description: "攻撃予告が短い。配信メモリー ×1.30",
    reward: 1.3,
    telegraph: 0.76,
    yaniDrain: 1,
    enemyAttack: 1.08,
    viewerLoss: 1,
  },
  panic: {
    id: "panic",
    name: "DRY STREAM",
    description: "ヤニ消費が速い。配信メモリー ×1.35",
    reward: 1.35,
    telegraph: 1,
    yaniDrain: 1.48,
    enemyAttack: 1,
    viewerLoss: 1,
  },
  spotlight: {
    id: "spotlight",
    name: "SPOTLIGHT",
    description: "被弾でLIVE人数が大きく離脱。配信メモリー ×1.45",
    reward: 1.45,
    telegraph: 1,
    yaniDrain: 1,
    enemyAttack: 1.12,
    viewerLoss: 1.9,
  },
};

export const ARCHIVE_ACHIEVEMENTS = [
  { id: "first-run", name: "初配信アーカイブ", description: "最初のRUNを終える", test: (save) => save.runCount >= 1 },
  { id: "area-1", name: "ストリーマーシティ突破", description: "AREA 1 BOSSを倒す", test: (save) => save.records.bossesDefeated.includes("黒猫ジャマー") },
  { id: "area-2", name: "高架街の主役", description: "AREA 2 BOSSを倒す", test: (save) => save.records.bossesDefeated.includes("ランク・デヴァウラー") },
  { id: "area-3", name: "放送塔を奪還", description: "AREA 3 BOSSを倒す", test: (save) => save.records.bossesDefeated.includes("放送塔の番猫") },
  { id: "final", name: "一番右まで配信した", description: "FINAL BOSSを倒す", test: (save) => save.records.finalBossDefeated },
  { id: "rank-one", name: "世界一の神回", description: "配信ランキング1位になる", test: (save) => save.records.bestRank <= 1 },
  { id: "million", name: "百万人のLIVE", description: "最高LIVE人数100万人", test: (save) => save.records.maxListeners >= 1_000_000 },
  { id: "combo", name: "切れないコメント欄", description: "最大COMBO 100", test: (save) => save.records.maxCombo >= 100 },
  { id: "ten-runs", name: "配信は生活", description: "10回配信する", test: (save) => save.runCount >= 10 },
  { id: "all-bosses", name: "黒猫退治専門", description: "7体のMain Bossを記録する", test: (save) => save.records.bossesDefeated.length >= 7 },
  { id: "encore", name: "終わらないアンコール", description: "Encoreを1回完走する", test: (save) => (save.postgame?.crowns ?? 0) >= 1 },
  { id: "collector", name: "CHANNEL COMPLETE", description: "永久強化を合計40Lvにする", test: (save) => Object.values(save.upgrades).reduce((sum, level) => sum + level, 0) >= 40 },
];

export const PERMANENT_UPGRADES = {
  voice: { name: "永久イケボ", effect: "開始攻撃力 ×2.25", baseCost: 34, growth: 2.02, max: 18 },
  drag: { name: "永久ヤニ吸引力", effect: "最大愛・攻撃速度UP", baseCost: 28, growth: 1.94, max: 18 },
  retention: { name: "リスナー定着率", effect: "リスナー増加 ×1.58", baseCost: 30, growth: 1.98, max: 15 },
  gift: { name: "ギフト倍率", effect: "ギフト価値 ×1.72", baseCost: 40, growth: 2.08, max: 15 },
  feverRate: { name: "FEVER効率", effect: "ゲージ加速 +22%", baseCost: 32, growth: 1.98, max: 12 },
  feverPower: { name: "FEVER倍率", effect: "FEVER効果 +0.40", baseCost: 44, growth: 2.12, max: 12 },
  ranking: { name: "ランキング営業", effect: "順位ボーナス +10%", baseCost: 38, growth: 2.02, max: 12 },
  starter: { name: "スタート支援金", effect: "初期応援を持ち込む", baseCost: 22, growth: 1.82, max: 16 },
};

export const RANK_TIERS = [
  { max: 1, multiplier: 2.5, label: "KING BONUS" },
  { max: 3, multiplier: 2, label: "TOP 3 BONUS" },
  { max: 10, multiplier: 1.8, label: "TOP 10 BONUS" },
  { max: 20, multiplier: 1.5, label: "TOP 20 BONUS" },
  { max: 30, multiplier: 1.3, label: "TOP 30 BONUS" },
  { max: 50, multiplier: 1, label: "RISING" },
];

export const COMMENT_POOLS = {
  normal: ["右！ もっと先まで見せて！", "今日のさきや、つよい", "その猫かわいいのに物騒", "初見です。もう神回？", "ヤニ残量みて！", "流れきてるよ", "応援置いとくね", "888888888", "この配信ずっと見ちゃう", "次の看板までいこ", "数字の伸び方すき", "白うさぎ今日もいるね"],
  area1: ["街ぜんぶさきや色じゃん", "LIVE看板かわいい", "ペンライト振っとく", "最初の猫もう怖くないね"],
  area2: ["高架街きたー！", "ゲーセンの光すご", "ランキング看板抜いてこ", "景色の密度上がったな"],
  area3: ["放送塔ノイズやばい", "空暗くなってきた…", "ここから本番って顔してる", "壊れたLIVE看板こわ"],
  area4: ["最終ステージ見えた！", "観客の数えぐい", "王冠の信号きてる", "ここが一番右だ"],
  dodge: ["今の避けた！", "自動回避うますぎ", "ノーダメ継続！", "その間合い好き", "愛を守った！", "PERFECT助かる", "今の予告見えてたね"],
  damage: ["まだいける！", "愛が削れてるよ", "補給して立て直そ", "ここ耐えどころ", "コメントで支えるぞ", "一発重い、でも返せる", "配信切るなー！"],
  gift: ["ギフトきた！", "受け取ってー！", "ナイスギフト回収", "画面がピンクになってきた", "回復も入った！", "プレゼント飛んでる！", "応援間に合った"],
  upgrade: ["火力伸びた！", "オート監督有能", "数字が育ってる", "次の敵もう溶けそう", "Lv上がる音きもちいい", "愛の上限でか", "その強化、壁に刺さる"],
  fever: ["FEVERきちゃああ！", "画面うるさくて最高", "ギフトの雨だ！", "数字こわれてる", "さきやしか勝たん", "コメント追いつかんｗ", "神回確定です", "このままBOSSまで！"],
  boss: ["ボスいけるぞ！", "あとちょっと！", "イケボ合わせて！", "ここ越えたら新エリア！", "諦めんなあああ", "予告きた、耐えて！", "BREAKまで押せ！", "PHASE変わるぞ！"],
  victory: ["うおおおお！", "前回の壁を越えた！", "新しい景色だ！", "完全勝利！", "888888888888", "この瞬間待ってた", "右側ひらいた！", "BOSSが雑魚になってるｗ"],
  defeat: ["惜しい！ 次はいける", "前回より削れてる", "この配信が次の力になる", "強化してまた行こう", "残りHP覚えた", "次は絶対抜ける", "今日の記憶、持って帰ろ"],
  overkill: ["前ここで負けたよね？", "敵が溶けた", "成長えぐい", "一瞬だったんだけど", "桁が違うｗ", "旧BOSS泣いてる", "これが永久強化か"],
  panic: ["ヤニないぞ！", "大パニックきた", "そのまま押し切る気？", "火力やばいけど愛みて！", "補給まで耐えて", "危険だけど伸びてる", "この綱渡り好き"],
};

export function areaForDistance(distance) {
  return AREAS.find((area) => distance >= area.start && distance < area.end) ?? AREAS.at(-1);
}

export function rankingForListeners(listeners) {
  if (listeners >= 12000000) return 1;
  if (listeners >= 6000000) return 3;
  if (listeners >= 2200000) return 7;
  if (listeners >= 800000) return 14;
  if (listeners >= 260000) return 22;
  if (listeners >= 90000) return 30;
  return Math.max(31, 50 - Math.floor(listeners / 5000));
}

export function rankTier(rank) {
  return RANK_TIERS.find((tier) => rank <= tier.max) ?? RANK_TIERS.at(-1);
}

export function compact(value, digits = 1) {
  if (!Number.isFinite(value)) return "0";
  const abs = Math.abs(value);
  const units = [[1e30, "No"], [1e27, "Oc"], [1e24, "Sp"], [1e21, "Sx"], [1e18, "Qi"], [1e15, "Qa"], [1e12, "T"], [1e9, "B"], [1e6, "M"], [1e3, "K"]];
  for (const [threshold, suffix] of units) {
    if (abs >= threshold) {
      const scaled = value / threshold;
      return `${scaled.toFixed(scaled >= 100 ? 0 : digits).replace(/\.0$/, "")}${suffix}`;
    }
  }
  return Math.floor(value).toLocaleString("ja-JP");
}

export function runUpgradeCost(key, level) {
  const item = RUN_UPGRADES[key];
  return Math.floor(item.baseCost * item.growth ** level);
}

export function permanentUpgradeCost(key, level) {
  const item = PERMANENT_UPGRADES[key];
  return Math.floor(item.baseCost * item.growth ** level);
}
