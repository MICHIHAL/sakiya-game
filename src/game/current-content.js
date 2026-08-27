/**
 * Authored, local-only content for the creator incremental candidate.
 *
 * The later breakpoint and Scale labels deliberately carry their status in
 * metadata.  They are useful deterministic fixtures, not a promotion of a
 * working hypothesis to Owner Canon.
 */

export const CONTENT_STATUS = Object.freeze({
  ACCEPTED_STRUCTURE: "accepted-structure",
  WORKING_HYPOTHESIS: "working-hypothesis",
  TEST_DEPENDENT: "test-dependent",
});

export const UNIT_LABELS = Object.freeze({
  U0: "個人の参加",
  U1: "枠の視聴者",
  U2: "コミュニティ",
  U3: "コンテンツ網",
  U4: "活動エコシステム",
  U5: "文化的到達圏",
  U6: "社会的インフラ",
  U7: "惑星的注目",
  U8: "文明的観測",
  U9: "星間観測",
  U10: "宇宙的反響",
});

export const FICTIONAL_PEOPLE = Object.freeze([
  {
    id: "mado",
    displayName: "まど",
    fictional: true,
    arrivalStyle: "quiet-stay",
    interests: ["雑談", "アーカイブ"],
    note: "静かに最後までいる。反応の量ではなく、居た時間が記憶になる。",
  },
  {
    id: "nagi",
    displayName: "なぎ",
    fictional: true,
    arrivalStyle: "late-revisit",
    interests: ["動画", "曲"],
    note: "動画経由で戻り、前の話題を覚えている。",
  },
  {
    id: "tsumugi",
    displayName: "つむぎ",
    fictional: true,
    arrivalStyle: "small-comment",
    interests: ["歌", "制作"],
    note: "短い言葉で、その場の空気を残す。",
  },
  {
    id: "riku",
    displayName: "りく",
    fictional: true,
    arrivalStyle: "event-visitor",
    interests: ["ライブ", "SNS"],
    note: "特別な場に現れるが、参加の強さでは分類されない。",
  },
  {
    id: "sui",
    displayName: "すい",
    fictional: true,
    arrivalStyle: "regular-listener",
    interests: ["配信", "音楽"],
    note: "何度かの枠を通って、いつもの名前になる。",
  },
  {
    id: "koto",
    displayName: "こと",
    fictional: true,
    arrivalStyle: "shared-context",
    interests: ["動画", "ライブ"],
    note: "作品の文脈から来て、別の活動へ話をつなぐ。",
  },
]);

/**
 * P0 is a comparison fixture, not an adopted balance sheet.  These values are
 * deliberately exported so a report can identify the exact test-dependent
 * model it ran.  They do not promote A/B/C, timing, or coefficients to Canon.
 */
export const P0_TEST_DEPENDENT_TUNING = Object.freeze({
  id: "p0-comparison-fixture-v2",
  status: CONTENT_STATUS.TEST_DEPENDENT,
  decisionGates: Object.freeze(["DTD-01", "DTD-02", "DTD-03", "ODG-02"]),
  harnessCycles: 3,
  arrival: Object.freeze({
    sharedPoolCapacity: 2,
    sharedPoolRecoveryPerAssetSecond: 0.04,
    interestPoolCapacity: 2,
    interestPoolRecoveryPerAssetSecond: 0.03,
    directVideoOpportunity: 1,
  }),
  video: Object.freeze({
    c1DirectReach: 2,
    c2InterestReach: 3,
    c3InitialReach: 2,
    c3LongTailPerVideo: 1,
    c3LongTailCap: 3,
    c3ProducerBoostCap: 2,
  }),
  limiter: Object.freeze({
    maxArrivalOpportunityPerCycle: 2,
    maxDeepProducerBoostPerVideo: 2,
  }),
  notes: "Forge-owned comparison coefficients. Re-run and replace with evidence; no value is Owner-approved Canon.",
});

export const P0_AXIS_DEFINITIONS = Object.freeze({
  A1: Object.freeze({ id: "A1", axis: "LIVE agency", label: "観察", liveInput: "silent" }),
  A2: Object.freeze({ id: "A2", axis: "LIVE agency", label: "反応", liveInput: "react" }),
  A3: Object.freeze({ id: "A3", axis: "LIVE agency", label: "コメント", liveInput: "comment" }),
  B1: Object.freeze({ id: "B1", axis: "arrival supply", label: "一定の到着機会", pool: "constant" }),
  B2: Object.freeze({ id: "B2", axis: "arrival supply", label: "共有・回復プール", pool: "shared-recovering" }),
  B3: Object.freeze({ id: "B3", axis: "arrival supply", label: "関心別・回復プール", pool: "interest-recovering" }),
  C1: Object.freeze({ id: "C1", axis: "video loop", label: "直接到達", nesting: "none" }),
  C2: Object.freeze({ id: "C2", axis: "video loop", label: "浅い関心の戻り", nesting: "shallow" }),
  C3: Object.freeze({ id: "C3", axis: "video loop", label: "制限付き長尾", nesting: "deep-constrained" }),
});

export const COMPLETION_CANDIDATE = Object.freeze({
  id: "u10-anchor-completion-candidate",
  status: CONTENT_STATUS.WORKING_HYPOTHESIS,
  ownerGate: "ODG-08",
  sourceStatus: "work-recommended",
  anchorPlanId: "final-anchor-candidate",
  requires: Object.freeze({
    breakpointCount: 24,
    scalePeakCount: 10,
    currentUnit: "U10",
    finalAnchorBroadcast: true,
    finalPlayerChoice: true,
  }),
  choices: Object.freeze([
    Object.freeze({
      id: "carry-room-record",
      label: "部屋から続く記録を先に残す（候補）",
      sakiyaIntent: "残した理由が見える形を、先に選びたい。",
      participantContribution: "どの記録を接続へ持ち出すか、一緒に確かめる。",
    }),
    Object.freeze({
      id: "keep-one-route-local",
      label: "一つの経路を、まだ近くに置く（候補）",
      sakiyaIntent: "全部を同じ場所へ送らず、近くに残す理由も守りたい。",
      participantContribution: "広げない経路の意味を、一緒に言葉にする。",
    }),
  ]),
  credits: Object.freeze([
    Object.freeze({ id: "owner-credit", role: "最終クレジット", value: "Owner review pending", status: "owner-gated" }),
    Object.freeze({ id: "content-credit", role: "候補テキストと記録", value: "runtime provenance attached", status: "candidate-only" }),
    Object.freeze({ id: "rights-credit", role: "権利・公開表記", value: "not established", status: "rights-gated" }),
  ]),
  provenance: Object.freeze([
    Object.freeze({ id: "completion-source", source: "DWR-06 / section 05 §14", status: "work-recommended" }),
    Object.freeze({ id: "completion-owner-gate", source: "ODG-08", status: "owner-decision-needed" }),
    Object.freeze({ id: "arrival-stage", source: "later ENTRY CHIME policy", status: "owner-conditional; no fabricated arrival" }),
  ]),
});

export const BROADCAST_PLANS = Object.freeze([
  {
    id: "room-talk",
    label: "部屋で近況をほどく",
    sakiyaIntent: "今日は近況をゆっくり話したい。",
    participantContribution: "一緒に話題を選び、その場にいる。",
    output: "atmosphere",
    metadata: { status: CONTENT_STATUS.ACCEPTED_STRUCTURE },
  },
  {
    id: "material-return",
    label: "残した場面を手がかりにする",
    sakiyaIntent: "前に残した場面の続きを話したい。",
    participantContribution: "残した文脈を持ち込み、今の枠へつなぐ。",
    output: "continuity",
    metadata: { status: CONTENT_STATUS.WORKING_HYPOTHESIS },
  },
  {
    id: "video-return",
    label: "動画の向こうから来た話を受け取る",
    sakiyaIntent: "動画を見た人とも、同じ話をしたい。",
    participantContribution: "動画由来の話題を見つけ、枠の空気へ戻す。",
    output: "crossActivityContext",
    requires: { workType: "video" },
    metadata: { status: CONTENT_STATUS.WORKING_HYPOTHESIS },
  },
  {
    id: COMPLETION_CANDIDATE.anchorPlanId,
    label: "最初の部屋から、残すものを選ぶ（候補）",
    sakiyaIntent: "ここまでの記録を、もう一度部屋から確かめたい。",
    participantContribution: "どの経路を残すか、最後に一緒に考える。",
    output: "completionAnchor",
    requires: { completionEligible: true },
    metadata: {
      status: CONTENT_STATUS.WORKING_HYPOTHESIS,
      internalOnly: true,
      ownerGate: "ODG-08",
      candidateOnly: true,
    },
  },
]);

export const ACTIVITY_DEFINITIONS = Object.freeze({
  broadcast: Object.freeze({
    id: "broadcast",
    label: "配信",
    verb: "その場にいて、選び、残す",
    timeEconomy: "session",
    command: "BROADCAST_BEFORE / BROADCAST_LIVE / BROADCAST_AFTER",
    output: "session atmosphere, relationship events, material",
    limiter: "Before/LIVE/After の順序と、LIVEごとの軽い参加回数",
    intent: "さきやが今話したいことを持ち込む。",
  }),
  video: Object.freeze({
    id: "video",
    label: "動画",
    verb: "素材を形にして、時間の外へ届かせる",
    timeEconomy: "asset-idle",
    command: "CREATE_VIDEO",
    output: "provenance-bearing video asset and delayed reach",
    limiter: "残した素材と編集枠",
    intent: "さきやが残したい場面を、別の文脈へ届ける。",
  }),
  singing: Object.freeze({
    id: "singing",
    label: "歌唱",
    verb: "練習して聴き、表現を残す",
    timeEconomy: "session",
    command: "PRACTICE_SINGING",
    output: "vocal mastery and a take record",
    limiter: "一枠で扱える表現の焦点",
    intent: "今日はこの表現を確かめたい。",
  }),
  music: Object.freeze({
    id: "music",
    label: "音楽",
    verb: "断片を編み、作品として仕上げる",
    timeEconomy: "asset-idle",
    command: "ARRANGE_MUSIC",
    output: "music work with long-tail propagation",
    limiter: "歌唱の手がかりと未完成の断片",
    intent: "この断片を曲として残したい。",
  }),
  sns: Object.freeze({
    id: "sns",
    label: "SNS",
    verb: "文脈を選んで、短く送る",
    timeEconomy: "asset-idle",
    command: "POST_SNS",
    output: "short-lived source-specific signal",
    limiter: "送る文脈と投稿ウィンドウ",
    intent: "このことだけは、今の言葉で伝えたい。",
  }),
  liveEvent: Object.freeze({
    id: "liveEvent",
    label: "ライブイベント",
    verb: "複数の活動を集め、場を閉じる",
    timeEconomy: "session",
    command: "HOST_LIVE_EVENT",
    output: "bounded event record and typed afterglow",
    limiter: "約束できる準備と、複数活動の入力",
    intent: "いまあるものを集めて、一度ちゃんと場にしたい。",
  }),
});

const BREAKPOINT_DRAFTS = [
  {
    id: "BP1",
    label: "枠ができる",
    layer: 1,
    threshold: 2,
    requires: ["first-arrival", "broadcast"],
    change: "次の枠へ、見知った名前と空気が残る。",
    status: CONTENT_STATUS.ACCEPTED_STRUCTURE,
  },
  {
    id: "BP2",
    label: "配信が残る",
    layer: 1,
    threshold: 4,
    requires: ["material"],
    change: "選んだ場面が、枠の外でも手がかりになる。",
    status: CONTENT_STATUS.ACCEPTED_STRUCTURE,
  },
  {
    id: "BP3",
    label: "枠の外へ届く",
    layer: 1,
    threshold: 7,
    requires: ["video", "video-return"],
    change: "配信→動画→次の配信の循環が生まれる。",
    status: CONTENT_STATUS.ACCEPTED_STRUCTURE,
  },
  {
    id: "BP4",
    label: "歌の手がかりを残す",
    layer: 2,
    threshold: 10,
    requires: ["singing"],
    change: "練習の変化を、次の制作へ持ち込める。",
  },
  {
    id: "BP5",
    label: "再訪の文脈が育つ",
    layer: 2,
    threshold: 13,
    requires: ["broadcast", "video"],
    change: "同じ数でも、戻り方によって次の話が変わる。",
  },
  {
    id: "BP6",
    label: "短い言葉を届ける",
    layer: 2,
    threshold: 16,
    requires: ["sns"],
    change: "短い発信が、選んだ文脈だけを一時的に広げる。",
  },
  {
    id: "BP7",
    label: "記録を見返す",
    layer: 2,
    threshold: 19,
    requires: ["material", "broadcast"],
    change: "履歴が次の選択の理由になる。",
  },
  {
    id: "BP8",
    label: "一度の場を集める",
    layer: 2,
    threshold: 22,
    requires: ["liveEvent"],
    change: "複数活動を、一つの出来事として閉じられる。",
  },
  {
    id: "BP9",
    label: "続く場の手入れ",
    layer: 2,
    threshold: 25,
    requires: ["automation"],
    change: "理解した手入れを圧縮し、次の接続を選べる。",
  },
  {
    id: "BP10",
    label: "作品の道筋",
    layer: 3,
    threshold: 29,
    requires: ["music", "video"],
    change: "作品同士の経路が、別の到着理由になる。",
  },
  {
    id: "BP11",
    label: "歌から曲へ",
    layer: 3,
    threshold: 33,
    requires: ["singing", "music"],
    change: "表現と制作が、説明できる橋になる。",
  },
  {
    id: "BP12",
    label: "活動の橋を選ぶ",
    layer: 3,
    threshold: 37,
    requires: ["bridge"],
    change: "同じ総量でも、どこをつなぐかが変わる。",
  },
  {
    id: "BP13",
    label: "手入れを譲る",
    layer: 3,
    threshold: 41,
    requires: ["automation", "bridge"],
    change: "分かった作業を譲り、共同の判断へ戻れる。",
  },
  {
    id: "BP14",
    label: "交差するライブ",
    layer: 3,
    threshold: 45,
    requires: ["liveEvent", "music"],
    change: "イベントの余韻が、複数活動へ別々に戻る。",
  },
  {
    id: "BP15",
    label: "共有される振る舞い",
    layer: 4,
    threshold: 50,
    requires: ["broadcast", "sns"],
    change: "繰り返しが、外の振る舞いにも意味を持ち始める。",
  },
  {
    id: "BP16",
    label: "世界側の反応",
    layer: 4,
    threshold: 55,
    requires: ["liveEvent", "bridge"],
    change: "同じ活動にも、異なる外側の反応が返る。",
  },
  {
    id: "BP17",
    label: "返ってくる条件",
    layer: 4,
    threshold: 60,
    requires: ["automation", "music"],
    change: "外の変化が、活動条件を変え始める。",
  },
  {
    id: "BP18",
    label: "続ける前提",
    layer: 4,
    threshold: 65,
    requires: ["bridge", "liveEvent"],
    change: "複数の場が、活動を前提として動き始める。",
  },
  {
    id: "BP19",
    label: "つながりの重なり",
    layer: 5,
    threshold: 71,
    requires: ["music", "sns", "bridge"],
    change: "別々の仕組みを足すだけでは、次を説明できなくなる。",
  },
  {
    id: "BP20",
    label: "文脈の違いを残す",
    layer: 5,
    threshold: 77,
    requires: ["video", "liveEvent"],
    change: "同じ届き方でも、受け取られ方を選ぶ必要がある。",
  },
  {
    id: "BP21",
    label: "観測が返事になる",
    layer: 5,
    threshold: 83,
    requires: ["broadcast", "music", "bridge"],
    change: "反応そのものが、次の選択の原因になる。",
  },
  {
    id: "BP22",
    label: "異なる観測へ届ける",
    layer: 6,
    threshold: 90,
    requires: ["video", "sns", "bridge"],
    change: "届く条件の違いを、活動ごとに編める。",
  },
  {
    id: "BP23",
    label: "場を同期する",
    layer: 6,
    threshold: 97,
    requires: ["broadcast", "liveEvent"],
    change: "一つの配信が、複数の場を同時に結べる。",
  },
  {
    id: "BP24",
    label: "残す意味を選ぶ",
    layer: 6,
    threshold: 104,
    requires: ["music", "bridge", "liveEvent"],
    change: "到達した量ではなく、残る意味を選ぶ。",
  },
];

export const BREAKPOINTS = Object.freeze(
  BREAKPOINT_DRAFTS.map((breakpoint) =>
    Object.freeze({
      ...breakpoint,
      metadata: Object.freeze({
        status: breakpoint.status ?? CONTENT_STATUS.WORKING_HYPOTHESIS,
        internalOnly: breakpoint.status == null,
      }),
    }),
  ),
);

const SCALE_PEAK_DRAFTS = [
  ["SP1", 1, "U0", "U1", 3, "個人の入室を、枠の流れとして扱い始める"],
  ["SP2", 2, "U1", "U2", 9, "再訪と関係が、新しい参加の基盤になる"],
  ["SP3", 3, "U2", "U3", 10, "作品の経路が、コミュニティを越えて続く"],
  ["SP4", 3, "U3", "U4", 14, "活動同士が、互いの材料になる"],
  ["SP5", 4, "U4", "U5", 16, "活動の繰り返しが、共有された意味を生む"],
  ["SP6", 4, "U5", "U6", 18, "文化的な到達が、社会の前提として働く"],
  ["SP7", 5, "U6", "U7", 19, "複数の仕組みが、惑星的な総体として結ばれる"],
  ["SP8", 5, "U7", "U8", 21, "人数ではない観測と応答が、原因になる"],
  ["SP9", 6, "U8", "U9", 22, "複数の観測圏が、異なる条件で接続する"],
  ["SP10", 6, "U9", "U10", 24, "反響そのものが、長く伝播する"],
];

export const SCALE_PEAKS = Object.freeze(
  SCALE_PEAK_DRAFTS.map(([id, layer, fromUnit, toUnit, requiredBreakpoint, meaning]) =>
    Object.freeze({
      id,
      layer,
      fromUnit,
      toUnit,
      requiredBreakpoint,
      meaning,
      metadata: Object.freeze({
        status: CONTENT_STATUS.WORKING_HYPOTHESIS,
        internalOnly: true,
        trigger: "reviewable-candidate-only",
      }),
    }),
  ),
);

export function activityById(id) {
  return ACTIVITY_DEFINITIONS[id] ?? null;
}

export function broadcastPlanById(id) {
  return BROADCAST_PLANS.find((plan) => plan.id === id) ?? BROADCAST_PLANS[0];
}

export function breakpointById(id) {
  return BREAKPOINTS.find((breakpoint) => breakpoint.id === id) ?? null;
}

export function scalePeakById(id) {
  return SCALE_PEAKS.find((peak) => peak.id === id) ?? null;
}

export function completionChoiceById(id) {
  return COMPLETION_CANDIDATE.choices.find((choice) => choice.id === id) ?? null;
}

export function isWorkingHypothesis(item) {
  return item?.metadata?.status === CONTENT_STATUS.WORKING_HYPOTHESIS;
}

export const ACTIVITY_IDS = Object.freeze(Object.keys(ACTIVITY_DEFINITIONS));
