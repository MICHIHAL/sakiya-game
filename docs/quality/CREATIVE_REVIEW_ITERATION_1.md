# CREATIVE REVIEW — Commercial Quality Iteration 1

## Review Contract

- Purpose: プレイヤーが「前回の壁を次の配信で踏み潰し、もっと右へ行きたい」と感じ続ける、買い切り型のプレミアムゲーム。
- Accepted Core: 一本の右進行、敗北を強化へ変えるRun型成長、配信システムが戦闘と経済を動かすこと、kawaii × gothic × cyber × streamer、見守り主体の自動RUN。
- Editable Surface: 初回理解、戦略の意味、結果比較、永久強化情報、長期記録、保存・復帰、クリア後、HUD情報、演出密度。
- Prohibited Normalization: 汎用放置ゲーム化、広告・ガチャ・ログイン報酬、忙しい手動アクション化、主人公デザイン変更、同じ背景と敵の数字だけを増やす反復。
- Evidence: 現行ブラウザ実画面、`src/`、自動シミュレーション、添付ビジュアル比較。

## Verdict

`CREATIVE BLOCK` — コアループは成立しているが、現行版を有償完成品として提示するには、発見・判断・比較・長期記憶の層が不足している。

## Creator Fidelity

固定コアは保持されている。右進行、敗北後の成長、配信数値の循環、自動RUN、4地域、最右端の巨大黒猫はいずれも実物に存在する。一方、プレミアム化のための修正で手動操作量を増やすと最新Owner Decisionへ回帰違反するため禁止する。

## Domain Craft findings

### Major 1 — Vertical sliceがCampaign全体に見える

- Expected: 右側への発見、Runごとの新しい方針、Ending後にも任意の再訪理由がある。
- Actual: テスト上は全永久強化Lv.3相当でFINAL BOSSを撃破でき、Titleでは最初から全戦略と最終ボスを見せる。Ending後のEncoreは同じRunの再開のみ。
- Evidence: `tests/game-engine.test.mjs`、Title実画面、`unlocks.encore`の利用状態。
- Root cause: 通し動作を優先した縦切りが、発見と横成長を持たないままCampaignの外形を担っている。
- Repair direction: 本編尺を勝手に確定せず、戦略実績、配信アーカイブ、Run目標、明示的なEncore Setlistを追加し、正式コンテンツ拡張が接続できる土台へ変える。
- Regression risk: 既存の短い再挑戦速度を長いメニューで壊さない。

### Major 2 — 敗北が次の勝ち筋へ十分に翻訳されない

- Expected: Resultで前Run差、壁の残り、次の一手による具体差が順番に分かる。
- Actual: 記録とBOSS残HPはあるが、前Run比較がなく、永久強化カードは固定説明のみで現在値→次値を示さない。
- Evidence: `ResultScreen`、`UpgradeScreen`の実装。
- Root cause: リザルト集計と強化購入が別々に成立し、因果の橋が欠けている。
- Repair direction: 前回比・新記録・目標達成をResultへ、現在値→次値・推奨理由・解放条件をUpgradeへ追加する。
- Regression risk: 自動推薦を正解の強制にしない。

### Major 3 — 配信方針が説明文以上の違いとして読めない

- Expected: RUN前の選択で何を得て何を失い、どの壁に向くか判断できる。
- Actual: 四方針は購入順、補給閾値、FEVER、回避率に差があるが、UIは一文説明だけで実際のtrade-offを開示しない。一部名称と効果の因果も弱い。
- Evidence: `STRATEGIES`と`StrategyCards`。
- Root cause: 内部パラメータとプレイヤーの意思決定表示が分離している。
- Repair direction: 火力・速度・継続・FEVER・危険度の明示、方針固有のRun目標、Run中のDirector Plan表示を追加する。
- Regression risk: 数字の比較UIでタイトルの勢いを失わない。

## Creative Repair Brief

- Preserve: 自動で進む爽快感、30秒以内の再挑戦、旧壁の瞬殺、現行のピンク／黒／紫の情報密度。
- Change: 初回導入、戦略の実効果と説明、Result比較、Upgradeプレビュー、Archive、Encore、保存復帰。
- Proof: 初見状態・敗北状態・強化状態・クリア後状態を実ブラウザで確認し、同じ自動シミュレーションで進行不能がないこと。
- Owning production: `finish-app`。修正後、同条件でCreative self-reviewを再実施する。
