# 八乙女さきや 活動者育成インクリメンタル

> **North Star: 一緒にデカくする。**

`MICHIHAL/sakiya-game` は、八乙女さきやの活動へプレイヤーが参加し、静かな配信から作品・コミュニティ・複数活動・Prestige・Scale Transitionへ成長し、最終的に世界の尺度そのものが追いつかなくなる超大型インクリメンタルゲームのCanonical Project Repositoryです。

現在のCreative Directionは、旧「横スクロールアクション版 ヤニ切れ大パニック！」ではありません。

## 起動

```sh
npm install
npm start
```

ブラウザで **http://127.0.0.1:42681/** を開きます。`npm run dev` も同じURLです。

開発版は、ほかのローカルPWAが使いがちな既定ポートを避けた専用originで起動します。production previewは、先に`npm run build`を実行してから`npm run preview`を使い、**http://127.0.0.1:42682/** を開きます。

## Current product direction

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

中心体験：

- 初期：`自分もここにいる。誰か来た。楽しい。`
- 中盤：`一緒に作ったものが、次の人を連れてきた。`
- 後半：`育てた活動をどうつなげれば、次の尺度へ届くか。`
- 深層：`積み上げた何を、新しい世界の意味へ変換するか。`

配信だけを題材にしたIdleではありません。

- 配信：Session型Social Simulation
- 動画・楽曲・アーカイブ等：Asset Idle
- Breakpoint / Automation / Prestige / Scale Transition：Meta Incremental

を同じ作品の中で接続します。

## Current creative source priority

SAKIYAの新しい明示意思がない限り、Project固有のCreative判断は次の順で扱います。

1. 現在のSAKIYAの明示意思
2. [`docs/CURRENT_CREATIVE_STATE.md`](docs/CURRENT_CREATIVE_STATE.md)
3. [`AGENTS.md`](AGENTS.md)
4. [`docs/SAKIYA_CREATOR_INCREMENTAL_CREATIVE_GAME_DESIGN_SPEC_v0.7.md`](docs/SAKIYA_CREATOR_INCREMENTAL_CREATIVE_GAME_DESIGN_SPEC_v0.7.md)
5. [`docs/SAKIYA_INCREMENTAL_PROTOTYPE_FOUNDATION_FREEZE_SPEC.md`](docs/SAKIYA_INCREMENTAL_PROTOTYPE_FOUNDATION_FREEZE_SPEC.md)
6. [`docs/decisions/OWNER_COMPLETION_TARGET_2026-08-27.md`](docs/decisions/OWNER_COMPLETION_TARGET_2026-08-27.md)
7. Owner採用済みのComplete Product Lock / Creative Specification / Forge Handoff
8. Repository内の旧企画・旧実装・過去検証資料

Workを最終化する場合：

- [`docs/work/WORK_PROMPT_COMPLETE_GAME_FORGE_HANDOFF_v1.2.md`](docs/work/WORK_PROMPT_COMPLETE_GAME_FORGE_HANDOFF_v1.2.md)

Work成果をCodexへ渡す際のAuthority契約：

- [`docs/work/FORGE_EXECUTION_AUTHORITY_CONTRACT.md`](docs/work/FORGE_EXECUTION_AUTHORITY_CONTRACT.md)

`v1.1`は品質観点と探索履歴として保持しますが、実装分担・テスト手法・工程のAuthority解釈は`v1.2`とForge Execution Authority Contractが優先します。

## Fixed creative core

- North Star：**一緒にデカくする**
- Player Participation：`Presence → Co-creation → Shared Expansion`
- Personhoodは性能厳選ゲーム化を防ぐGuardrail
- ギフトを主要最適解にしない
- 部屋をActivity Homeとして最後まで維持する
- Scale Unit移行時は**Semantic Retirement**を行う
- 最初の外部リスナーの**ENTRY CHIMEは最後まで同一音源**
- 活動ごとに異なる気持ちいい動詞を持たせる
- 世界観の笑いは、さきやの自己神格化ではなく、世界の尺度・制度・集計が活動規模を処理できなくなることに置く
- P0-SIMだけでCreative案を選ばず、P0-FEELとParetoで判断する

## Completion target

このProjectで「完成」と呼ぶのは、prototype、vertical slice、foundation、build成功ではありません。

完成には、少なくとも次を含みます。

- 新規開始からMain Goal / Endingまで遊べる
- accepted Post-goal / Strong New Gameが成立する
- 完成版UI、アート、モーション
- 完成版BGM、SFX、mix
- accepted activity systems
- 完成した成長経済、Breakpoint、Automation、Prestige、Scale Transition
- save、backup、export/import、offline progression、復旧
- accessibility、Reduced Motion、音なし通知、イベントログ
- responsive / target device verification
- content / flavor volume
- rights、privacy、credits、license compliance
- production build / distributable package
- Creative PASS
- Technical PASS
- SAKIYA Final Acceptance
- Release Gate PASS

詳細：[`docs/decisions/OWNER_COMPLETION_TARGET_2026-08-27.md`](docs/decisions/OWNER_COMPLETION_TARGET_2026-08-27.md)

## Current implementation status

現在の`src/`は、Roomを主面とする粗く鮮やかな8-bit版のローカル完成候補です。新規開始から24 BP / 10 SP / U10、最終Anchor Broadcast、最後の選択、Continue / Strong New Gameまで実装しています。

状態：

> **IMPLEMENTED / AUTOMATED AND INDEPENDENT STATIC PASS / RUNTIME, CREATIVE, OWNER, AND RELEASE GATES OPEN**

以前の横スクロールアクション版は`legacy/`と`docs/engineering/legacy-assets/`へ分離し、現行の公開assetには含めません。

再利用候補：

- save / backup / export-import
- responsive / PWA / hosting
- accessibility settings
- audio infrastructure
- performance settings
- test infrastructure

再利用・破棄・移行はImplementation ForgeがTechnical Auditを行い、Creative Intent変更が必要ならSAKIYA STUDIOへ戻します。

Legacy map：[`legacy/README.md`](legacy/README.md)

## Authority

- SAKIYA：Final Authority
- SAKIYA STUDIO / Chat / Work：Creative Authority
- Implementation Forge / Codex：Engineering Authority
- GitHub：正規保存面、履歴、共有、受け渡し。Authorityではない

Workは完成像、Creative Intent、player-visible specification、Test Intent、Acceptance Evidenceを定義します。

Codexはtechnical architecture、実装計画、作業分解、サブエージェント、テスト戦略、敵対的技術レビュー、回帰、CI、Release Engineering、commit計画を自ら設計・実行します。

Work内のEngineering詳細は参考案であり、Forgeを拘束しません。Creative変更が必要な場合はSAKIYA STUDIOへ返します。

Creative PASS、Technical PASS、Owner Acceptance、Release状態を互いに代用しません。
