# REPOSITORY AUDIT — Premium Experience Revision

## Outcome

`START → RUN → DEFEAT → RESULT → PERMANENT UPGRADE → RESTART → FINAL BOSS → ENDING → ENCORE` は、同じ決定的simulationとsave contract上で実装されている。現revisionは、買い切りゲームの中核体験を最後まで試せるcommercial-quality foundationであり、静的mockやclick demoではない。

正式な¥9,800販売版として残る差分は、基礎systemではなく、採用するcampaign尺に応じたauthoring物量、boss固有animation、実機・実聴、native store運用である。

## Observed system

- Stack: React 19、Vite 6、Canvas 2D、WebAudio、localStorage、service worker。
- Entry: `src/main.jsx` → `src/App.jsx`。画面状態はtitle / run / result / upgrade / ending。
- Simulation: `src/game/engine.js`の決定的step関数。UIとgameplay stateを分離。
- Content: `src/game/config.js`にarea、enemy、boss、strategy、FEVER SCRIPT、Encore modifier、achievementをdata-driven定義。
- Persistence: schema 3。primary、auto backup、3 manual slots、export/import、validation/migration。
- Presentation: 4地域の実画像、sprite、Canvas combat、procedural music、event SFX、responsive DOM HUD。
- Verification: Node tests、Vite production build、Sites worker tests、cloud browser interaction。
- Canonical remote: `MICHIHAL/sakiya-game`。working branchは`feat/premium-experience`。

## Requirement delta

| Requirement | State | Evidence | Remaining gate |
| --- | --- | --- | --- |
| 完結するCore Run | Implemented | engine tests / browser | regression protection only |
| 配信systemの因果統合 | Implemented | engine / HUD / comments | tuning through wider playtest |
| 敗北→次の勝ち筋 | Implemented | Result comparison / exact upgrade preview | cohort balance evidence |
| 戦略的loadout | Implemented | 4 strategies × 3 FEVER SCRIPT | unlock pacing if campaign expands |
| Boss identity | Implemented in rules | 7 unique disruption mechanics / 3 phases | unique animation and attack grammar assets |
| Long-tail | Implemented foundation | Archive / 12 achievements / Encore / modifiers | authored volume for selected price promise |
| Save recovery | Implemented | schema 3 / backup / slots / export | cross-device/cloud policy |
| Audio and motion | Implemented technically | WebAudio director / Canvas motion / settings | monitored audition and loudness pass |
| Mobile and accessibility | Implemented structurally | responsive CSS / touch / reduced motion / scale | physical-device matrix |
| Offline shell | Implemented | manifest / service worker | production HTTPS install test |
| Store release | Not in this revision | no native package or listing | owner decisions, rights, rating, support |

## Protected core

- 一本の右進行と「もっと右へ行きたい」という欲求。
- 敗北を価値に変える、短いRESULT→UPGRADE→RESTART。
- 見守り主体の自動RUN。手動操作は補助であり、忙しいaction gameへ変えない。
- 配信数値がcombat・economy・FEVER・rankingを一本で動かす構造。
- pink / black / purple、kawaii × gothic × cyber × streamerのvisual identity。
- 既存saveを失わないnormalizationとmigration。

## Maximum implementation risk

有償尺を敵HPと永久upgrade costだけで引き延ばすこと。次のproduction phaseは、数値grindではなく、固有event、build unlock、boss choreography、area内の見せ場、配信archiveの発見を増やすべきである。

## First commercial vertical slice

`初回導入 → 方針とFEVER台本を選ぶ → 自動RUN目標を追う → 固有妨害BOSSに敗北 → 前回比較 → exact upgrade preview → 再配信で旧壁を瞬殺`。この一本は現revisionでtouchableかつend-to-endに成立している。
