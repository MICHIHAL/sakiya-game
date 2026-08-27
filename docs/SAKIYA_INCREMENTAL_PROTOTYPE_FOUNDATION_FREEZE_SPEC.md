# 八乙女さきや 活動者育成インクリメンタル
## PROTOTYPE FOUNDATION FREEZE SPEC

**文書状態:** Prototype Foundation Freeze Candidate  
**参照正本:** `CREATIVE GAME DESIGN SPECIFICATION v0.7`  
**参照blob:** `b32210d45beaa27482694825b366ff4041951dcd`  
**Authority:** さきや = Final Authority / SAKIYA STUDIO = Creative Authority / Implementation Forge・Codex = Engineering Authority  
**目的:** 企画の骨格を固定し、P0-SIMとP0-FEELの設計・実装へ進める境界を明確にする  
**非目的:** v0.7本文の改版、GitHubへの書き込み、完成ゲームの実装仕様、SP1 Triggerの強制確定  
**Canon状態:** Owner採用とRepository保存前はNon-Canonical Candidate

---

# 0. Prototype Readiness Verdict

## 判定

| 対象 | 判定 |
|---|---|
| 企画のCreative Skeleton | **FREEZE可能** |
| P0-FEEL Creative Probe | **GO** |
| P0-SIM Economy Prototype | **条件付きGO** |
| 30分遊べるP1 | **P0結果までSTOP** |
| Scale Transition実装 | **SP1 Trigger解決までSTOP** |
| 完成ゲームのCodex投入 | **STOP** |
| GitHub commit | **本書では行わない** |

## 結論

本企画は、完成版の実装へ入る段階ではない。

一方で、次の二本は開始できる。

1. **P0-FEEL**  
   「自分もその枠に参加している」「誰か来た」「また来た」を3〜5分で検証するCreative Probe。

2. **P0-SIM**  
   配信と動画の最初の一循環を、画面なしで比較する経済シミュレーション。

P0-SIMは、Main Progressionの律速資源と具体的な資源フローが未定義のため、そのCreative Contractを先に埋めることを条件とする。

---

# 1. 絶対に固定する企画の核

## 1.1 North Star

> # **一緒にデカくする。**

プレイヤーは、さきやの活動へ参加する。

```text
Presence
その場にいる
↓
Co-creation
一緒に枠や作品を作る
↓
Shared Expansion
活動を接続し、新しい尺度へ広げる
```

## 1.2 中心体験

### 序盤

> **自分もここにいる。誰か来た。楽しい。**

### 中盤

> **一緒に作ったものが、次の人を連れてきた。**

### 後半

> **育てた活動をどうつなげれば、次の尺度へ届くか。**

### 深層

> **積み上げた何を、新しい世界の意味へ変換するか。**

## 1.3 人物性

PersonhoodはNorth Starではない。

> **参加と共同成長が、人間を性能、課金、レア度で厳選するゲームへ腐ることを防ぐGuardrail**

として扱う。

## 1.4 世界観

笑いの標的は、さきやの自己神格化ではない。

> **活動規模を、世界の尺度、制度、集計、言葉が処理できなくなること。**

さきやは人間的に反応するが、活動する理由と本人らしさを失わない。

---

# 2. 固定するゲーム構造

## 2.1 三つの時間経済

### Session

- 配信
- ライブ
- 特別イベント

始まりと終わりがあり、人、関係、空気が動く。

### Asset Idle

- 動画
- 楽曲
- アーカイブ
- 切り抜き

公開後、時間経過とオフラインで働く。

### Meta Incremental

- シナジー
- Breakpoint
- Automation
- Prestige
- Scale Transition

成長法則そのものを更新する。

## 2.2 メイン画面

PCカメラから見た、さきやの部屋を常設ホームにする。

固定するもの：

- カメラ角度
- 机
- さきやの主要シルエット
- 顔を隠さない領域
- 配信HUD領域
- 活動資産の展示領域
- 世界異常が侵入する領域

## 2.3 Auditory Invariant

最初の外部リスナーが来た瞬間のENTRY CHIMEを、ゲーム全体で同一音源として使用する。

禁止：

- 音程変更
- 豪華版
- リミックス
- 世界層別版
- 長尺化
- 別音源への置換

許可：

- 周囲のducking
- 鳴る前の余白
- 現在世界の音響との対比
- 音量調整

---

# 3. プレイヤーと参加プロフィール

## 3.1 Player Role

プレイヤーは、ゲーム世界内のマネージャー、神、運営者ではない。

> **さきやの活動上の意思と試行錯誤を操作へ翻訳しながら、感情的には最初から活動へ参加している存在。**

## 3.2 参加プロフィール

任意作成：

- 表示名
- 呼ばれ方
- アイコン
- コメントの雰囲気
- 一言プロフィール

性能を持たせない。

禁止：

- レア度
- ギフト率
- 生産倍率
- 初期能力
- 当たり外れ
- 課金性能

## 3.3 LIVE 1

`LIVE 1`がプレイヤー自身の参加を表す案は、P0-FEELで検証するHYPOTHESIS。

採用確定ではない。

---

# 4. Broadcast Loop Contract

## 4.1 Nominal Loop

×1時の基準：

```text
Before 15秒
LIVE   30秒
After  15秒
合計   60秒
```

最終時間はP0-FEELで変更可能。

## 4.2 Before

目的：

> **一緒に何をやるか決める。**

動詞：

- 選ぶ
- 持ち込む
- 組み合わせる
- 目的を決める

## 4.3 LIVE Participation Axis

P0-SIMとP0-FEELで共通IDを使う。

### A1｜Co-plan + Observe

Beforeで選び、LIVEは観察。

### A2｜Co-plan + React

LIVE中に1〜2回、参加プロフィール側から軽いリアクションを送る。

- 拍手
- 草
- 驚き
- ハート
- 好き

連打資源にしない。

### A3｜Co-plan + Comment

LIVE中に1〜2回、短いコメントや注目対象を選ぶ。

- 「それ好き」
- 「初見さんきた」
- 「888888」
- 「その話もっと聞きたい」

さきやへの命令コマンドにはしない。

## 4.4 After

目的：

> **何を残し、次へつなげるか決める。**

動詞：

- 選ぶ
- 残す
- 振り返る
- 次へつなぐ

候補：

- 印象に残った場面
- 好きだった場面
- アーカイブ
- 見どころ
- 動画素材

## 4.5 速度

LIVE部分のみを圧縮する。

| Mode | Before | LIVE | After | Loop |
|---|---:|---:|---:|---:|
| ×1 | 15秒 | 30秒 | 15秒 | 60秒 |
| ×2 | 15秒 | 15秒 | 15秒 | 45秒 |
| ×4 | 15秒 | 7.5秒 | 15秒 | 37.5秒 |
| Digest | 15秒 | 3秒 | 15秒 | 33秒 |

P0-FEELでは×1と×2のみを扱う。

---

# 5. 人物と関係のContract

## 5.1 禁止する最適化

- SSRリスナー
- 高性能初見の厳選
- 低反応人物の売却
- 人物の素材化
- ギフト型だけを当たりにする
- 課金で高性能人物を出す
- 課金で関係進行を購入する

## 5.2 保持する多様性

- よく喋る
- 静かに見る
- 時々戻る
- 特定活動へ反応する
- 常連化は遅いが長く残る
- コメントは少ないが滞在する

違いは強さではなく、出来事と関係の育ち方へ出す。

## 5.3 CRITICAL

CRITICALはガチャ当選ではない。

```text
過去の接触
＋
現在の話題
＋
コメントへの反応
＋
枠の空気
↓
積み上げが噛み合う
↓
CRITICAL TALK
```

通常UIでは正確な確率を見せない。

配信中に前兆を間接可視化し、Afterで理由を説明する。

P0開始仮説：

- 状態と蓄積：80〜90%
- 乱数揺らぎ：10〜20%
- 最低2回のBroadcast
- 最低3回の意味ある接触

---

# 6. 最初の活動循環

P0は配信と動画に限定する。

```text
参加して配信する
↓
初見・退出・再訪・関係の出来事
↓
見どころ / 神回素材
↓
動画制作
↓
動画公開
↓
再生
↓
違う興味層へ届く
↓
次の配信に新しい人が来る
```

中心体験：

> **「さっき一緒にいた枠から作った動画で、次の枠に新しい人が来た。」**

動画は万能な初見増加装置にしない。

動画が変えるもの：

- どんな人が来るか
- 何へ反応しやすいか
- 次枠で何が起きやすいか
- 何が次の素材になるか

---

# 7. Prototype Domain Contract

正式名称ではなく、v0.7で使用済みのWorking Nameを使う。

## 7.1 配信

| 状態・資産 | 寿命 | 役割 |
|---|---|---|
| LIVE | Session | 現在の参加規模 |
| HYPE | Session | 現在の盛り上がり |
| 初見 | Session / Cohort入口 | 新しい人との接触 |
| 常連コホート | Persistent | 見知った名前のいる枠 |
| 関係深度 | Persistent / Masked | 再訪・常連化の蓄積 |
| 見どころ | Persistent Material | 動画への橋 |
| アーカイブ | Asset Idle | 配信後も働く資産 |

## 7.2 動画

| 状態・資産 | 寿命 | 役割 |
|---|---|---|
| 素材 | Persistent Material | 動画制作に使う |
| 公開動画 | Asset Idle | 長期的に再生される |
| 再生 | Accumulating | 届いた規模 |
| 登録者 | Persistent | 動画側の継続基盤 |

## 7.3 横断候補

| 資源 | 状態 |
|---|---|
| 認知 | Candidate |
| ファン | Candidate |
| 熱量 | Candidate / Short State |

Main Progressionの律速資源はUNKNOWN。

QINV-NO-GIFTを実行可能にするには、P0 ECONOMY SPECでMain ProgressionのMilestone要件と律速構造を定義する必要がある。

---

# 8. Event Taxonomy

## 8.1 First Event

感情的な初回。

- 初入室
- 初コメント
- 初退出
- 初再訪
- 初常連
- 初CRITICAL
- 初ギフト。条件付き観測

ゲームルール変更を必須としない。

## 8.2 Breakpoint

到達後、生産構造、判断、変換、遊び方のいずれかが変わる。

v0.7構造：

- 24 Breakpoint

## 8.3 Scale Peak

Scale Unitが次の単位へ遷移するイベント。

Semantic Retirementを伴う。

v0.7構造：

- 10 Scale Peak

## 8.4 計数

```text
24 Breakpoint
+
10 Scale Peak
=
34 Major Events
```

次は34へ含めない。

- First Event
- Milestone
- Unlock
- Acceleration Peak
- Challenge
- Automation解放

## 8.5 SPとBP

現行v0.7では独立計数。

SP1〜SP10をBPへ同一化しない。

---

# 9. L1 Breakpoint

## BP1｜枠ができる

- 初期コホート成立
- 見知った名前が開始時にいる
- 前枠の空気が次枠へ残る
- リスナー同士の反応が始まる

## BP2｜配信が残る

- アーカイブ
- 見どころ
- 神回素材
- After行動
- Session成果が枠外で働く

## BP3｜枠の外へ届く

- 動画活動解放
- 配信→動画→別興味層→次配信
- 最初の複数経済循環完成

---

# 10. Scale Transition Freeze State

## 10.1 SP↔BP

全SPを独立イベントとして扱う。

| SP | Macro Layer | Transition | BP対応 |
|---|---|---|---|
| SP1 | L1 | U0 個人の参加 → U1 枠の視聴者 | なし |
| SP2 | L2 | U1 枠の視聴者 → U2 コミュニティ | なし |
| SP3 | L3 | U2 コミュニティ → U3 コンテンツ網 | なし |
| SP4 | L3 | U3 コンテンツ網 → U4 活動エコシステム | なし |
| SP5 | L4 | U4 活動エコシステム → U5 文化的到達圏 | なし |
| SP6 | L4 | U5 文化的到達圏 → U6 社会的インフラ | なし |
| SP7 | L5 | U6 社会的インフラ → U7 惑星的注目 | なし |
| SP8 | L5 | U7 惑星的注目 → U8 文明的観測 | なし |
| SP9 | L6 | U8 文明的観測 → U9 星間観測 | なし |
| SP10 | L6 | U9 星間観測 → U10 宇宙的反響 | なし |

## 10.2 SP1

状態：

> **HYPOTHESIS / Trigger衝突未解消**

競合候補：

1. 初外部リスナー  
   `LIVE 1 → LIVE 2`、ENTRY CHIME。

2. BP1「枠ができる」  
   初期コホート成立、空気の継続。

現行v0.7の独立計数を守るため、SP1をBP1へ統合しない。

P0ではSP1を発火させない。

P0は二つの候補イベントを記録し、Creative Review材料にする。

## 10.3 SP7

状態：

> **HYPOTHESIS / 数値Trigger UNKNOWN**

意味上の境界：

```text
U6
制度や社会が活動を前提に動く
↓
U7
地球規模の総体として観測される
```

具体的な資源、閾値、換算式は未定義。

P0対象外。

## 10.4 Semantic Retirement

Scale Peak時：

- 旧Unitのリアルタイム生成を終了
- 最終値を保存
- 履歴を保存
- 名前付き人物を保存
- 成立基盤として新Unitへ内包
- 旧カウンタを増やし続けない

---

# 11. P0-FEEL Specification

## 11.1 目的

経済的に正しいが無感情な案を、数値だけで採用しない。

## 11.2 長さ

3〜5分。

## 11.3 必須要素

- 参加プロフィール
- LIVE 1仮説
- ENTRY CHIME
- 最初の外部初見
- コメントまたは無言滞在
- 一時退出
- 再訪
- 常連化前兆
- ×1 / ×2
- Before / LIVE / After
- 因果ログ
- A1 / A2 / A3

## 11.4 観測

- 自分が参加したと感じたか
- 一人以上の名前や出来事を覚えたか
- 退出が気になったか
- 再訪が嬉しかったか
- 次枠を始めたい理由に関係への期待があったか
- 倍速しても出来事が消えなかったか
- 参加者側の動詞が作業にならなかったか

## 11.5 初期テスト構成

**HYPOTHESIS**

最低4名：

- さきや
- 配信文化を知る人
- Incrementalを好む人
- さきやを知らない人

正式Gate前に人数と募集方法を確定する。

---

# 12. P0-SIM Specification

## 12.1 比較軸

### A：Broadcast Participation

- A1 Observe
- A2 React
- A3 Comment

### B：初見流入

- B1 無限・一定
- B2 共有回復型プール
- B3 興味別回復型プール

### C：入れ子生産

- C1 なし
- C2 浅い
- C3 深い

```text
3 × 3 × 3 = 27構成
```

## 12.2 必須出力

### Milestone

- 初見
- 初退出
- 初再訪
- 初常連
- 初見どころ
- BP1
- BP2
- BP3
- 初動画
- 動画経由の初見
- 初シナジー

各項目：

- 到達時間
- Broadcast Loop数
- seed分布
- 戦略分布

### Economy

- 資源生成量
- 資源寄与率
- 消費先
- 支配ボトルネック
- ボトルネック交代時刻

### Strategy

- 配信特化
- 動画特化
- バランス
- 0ギフト
- 高頻度配信
- プール回復重視
- 最適化Bot
- ライト近似Bot

### Stagnation

- 待つだけ時間
- 同操作連続回数
- Breakpointまでの手動Loop
- 動画一強
- 人物厳選優位

## 12.3 Gate

### Stream Budget

```text
P90 <= 70 Loop
max <= 80 Loop
```

### Wait

- 60秒以上：警告
- 180秒以上：FAIL候補

### Person Gacha

初見大量回転戦略が恒常的に支配しない。

### Milestone仮説

初再訪：

- P50：5〜8分
- P90：15分以内

初常連：

- P10：8分以降
- P50：12〜15分
- P90：25分以内

初動画・初シナジー：

- P50：20〜30分
- P90：45分以内

---

# 13. Pareto Selection

27構成を単一総合点で順位付けしない。

評価軸：

- 経済安定
- 戦略多様性
- seed耐性
- 停滞
- Loop疲労
- 因果理解
- 参加感
- 名前付き人物の意味
- 観察価値
- さきやらしさ
- 実装複雑性

残す候補：

- 最も安定した案
- 最も参加感が強い案
- 最も因果が分かりやすい案
- 最も戦略的な案
- 最も異質だが化ける案
- 最も軽く検証できる案

P0-SIMだけでCreative候補を落とさない。

---

# 14. Time and Flavor Freeze State

## 14.1 100時間

Main Scale Goal 約100時間はHYPOTHESIS。

P0の合否には使用しない。

## 14.2 Flavor

Authored Pool：

```text
1,200
```

Novel Exposureの現行修正案：

| Layer | Density | Exposure |
|---|---:|---:|
| L1 | 21/h | 42 |
| L2 | 10/h | 80 |
| L3 | 8/h | 120 |
| L4 | 7/h | 140 |
| L5 | 6/h | 150 |
| L6 | 6/h | 180 |
| **計** |  | **712** |

L1必須露出：

```text
First Event 7種 × 2文脈 = 14
3 BP × 4反応面 = 12
初期コホート4人 × 4主要状態 = 16
合計 = 42
```

Authored Pool余裕：

```text
1,200 - 712 = 488
```

## 14.3 非Broadcast時間

L1仮内訳：

- 意味を与える選択・制作：24分
- 受容的参加：7.2分
- 管理・整理：4.8分
- 強制待機：0分

L6仮内訳：

- 意味を与える選択・制作：8.6分
- 受容的参加：2.3分
- 管理・整理：1.0分
- 強制待機：0分

L2〜L5の帰属はUNKNOWN。

A1 / A2 / A3のLIVE時間をShared Agency区分へどう帰属させるかもUNKNOWN。

---

# 15. Quantitative and Creative Invariants

## 15.1 Quantitative

Forgeが測定する。

- Stream Budget
- No Gift
- No Wait
- Person Gacha
- Milestone Distribution
- First Synergy

QINV-NO-GIFTは、Main ProgressionのMilestone要件と律速資源が定義されるまで測定不能。

## 15.2 Creative

Studioが人間評価する。

各Invariantへ次を持たせる。

- When
- Who
- Evidence
- PASS Condition

対象：

- Participation
- Shared Agency
- Personhood
- Continuity
- Tone
- Activity Verbs

---

# 16. Freeze Boundary

## 16.1 FIXED

- North Star「一緒にデカくする」
- Presence → Co-creation → Shared Expansion
- Session / Asset Idle / Meta Incremental
- 部屋を常設ホームにする
- Personhood Guardrail
- ギフトを主要最適解にしない
- ENTRY CHIME同一音源
- Semantic Retirement
- SPとBPは独立計数
- 24 BP + 10 SP = 34 Major Events
- P0-SIMとP0-FEELの二本立て
- Work / Forge Authority境界

## 16.2 HYPOTHESIS

- LIVE 1
- A1 / A2 / A3
- 60秒Nominal Loop
- CRITICAL比率
- 初再訪・初常連時間
- 初見流入B1 / B2 / B3
- 入れ子C1 / C2 / C3
- Flavor Exposure 712
- Main Goal 100時間
- L1 / L6 Agency帰属

## 16.3 UNKNOWN

- SP1 Trigger
- SP7数値Trigger
- 永久離脱の有無
- Main Progressionの律速資源
- L2〜L5非Broadcast時間
- A1 / A2 / A3のShared Agency帰属
- 正式な活動固有資源
- Scale構造案B / Cの具体内容
- 販売方式
- 対象プラットフォーム
- Technical Architecture

---

# 17. Prototype開始前に必要なCreative成果物

## 17.1 P0-FEEL Creative Probe Specification

- 3〜5分の具体的な出来事順
- A1 / A2 / A3
- ENTRY CHIME
- 退出と再訪
- 前兆と因果ログ
- 評価シート

## 17.2 P0 ECONOMY SPEC

言語非依存。

- 資源フロー
- 資源の意味
- Milestone要件
- Main Progression
- 律速候補
- B1 / B2 / B3
- C1 / C2 / C3
- Botが表すプレイスタイル
- 必須出力

## 17.3 Forge Handoff

Creative Authorityが渡すもの：

- Intended Experience
- Domain Contract
- Time Budget
- Invariant
- Output Requirement
- Creative Return Gate

Forgeへ委ねるもの：

- 内部型
- tick
- seed / RNG
- simulator
- Bot code
- executable tests
- Technical Verification

---

# 18. Prototypeの中止・構造見直し条件

次の場合、係数調整だけで済ませない。

- 初見が名前ではなく確率変数にしか感じられない
- A2 / A3がクリック作業になる
- A1が即座に倍速したくなる
- 退出しても何も感じない
- 動画を作っても次の配信の質が変わらない
- 動画だけが全戦略を支配する
- 人物厳選が強い
- 0ギフトで進行できない
- 3〜5分で「自分も参加した」が成立しない
- P0-SIM最良案とP0-FEEL最良案が大きく乖離し、統合理由を説明できない

---

# 19. Current Exploration Register

既存§32へ保持する。

- 離脱 A / B / C
- LIVE 1
- A1 / A2 / A3
- B1 / B2 / B3
- C1 / C2 / C3
- Main Progressionの律速資源
- L2〜L5非Broadcast時間
- L1 Shared Agency帰属
- SP1 Trigger
- SP7 Trigger
- Scale構造案B：現行v0.7へ未採用、内容UNKNOWN
- Scale構造案C：現行v0.7へ未採用、内容UNKNOWN
- Flavor 1,200 / Exposure 712
- 100時間
- 正式資源名
- 販売方式
- 対象プラットフォーム
- Rights Matrix

探索中の項目を、統合時に削除してはならない。

---

# 20. 最終判定

> ## **企画の骨格は、P0プロトタイプへ進める程度には固定できている。**
>
> ただし、いきなり完成ゲームを作る状態ではない。
>
> 次に作るべきものは、画面を豪華にした縦切り試作ではなく、
>
> 1. **配信の参加感を測るP0-FEEL**
> 2. **配信と動画の経済を壊すP0-SIM**
>
> の二本である。

P0ではSP1を確定しない。

最初の数分の参加感と、最初の30分の経済循環を別々に検証し、Paretoで残った構造をP1へ統合する。

> **最初は「自分もここにいる。誰か来た。」**
>
> **次に「一緒にいた枠が、別の人へ届いた。」**
>
> この二つが数字とボタンだけでも成立した時、初めて本格プロトタイプへ進む。
