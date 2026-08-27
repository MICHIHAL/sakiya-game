# 八乙女さきや 活動者育成インクリメンタル

> **North Star: 一緒にデカくする。**

`MICHIHAL/sakiya-game` は、八乙女さきやの活動へプレイヤーが参加し、静かな配信から作品・コミュニティ・複数活動・Prestige・Scale Transitionへ成長し、最終的に世界の尺度そのものが追いつかなくなる超大型インクリメンタルゲームのCanonical Project Repositoryです。

現在のCreative Directionは、旧「横スクロールアクション版 ヤニ切れ大パニック！」ではありません。

## Current product direction

プレイヤーの参加は、ゲームの進行とともに次のように変化します。

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

中心体験は次です。

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

Project固有のCreative判断は、SAKIYAの新しい明示意思がない限り、次の順で扱います。

1. 現在のSAKIYAの明示意思
2. [`docs/CURRENT_CREATIVE_STATE.md`](docs/CURRENT_CREATIVE_STATE.md)
3. [`docs/SAKIYA_CREATOR_INCREMENTAL_CREATIVE_GAME_DESIGN_SPEC_v0.7.md`](docs/SAKIYA_CREATOR_INCREMENTAL_CREATIVE_GAME_DESIGN_SPEC_v0.7.md)
4. [`docs/SAKIYA_INCREMENTAL_PROTOTYPE_FOUNDATION_FREEZE_SPEC.md`](docs/SAKIYA_INCREMENTAL_PROTOTYPE_FOUNDATION_FREEZE_SPEC.md)
5. [`docs/decisions/OWNER_COMPLETION_TARGET_2026-08-27.md`](docs/decisions/OWNER_COMPLETION_TARGET_2026-08-27.md)
6. Repository内の旧企画・旧実装・過去検証資料

Workで完成仕様を作る場合は、次を使用します。

- [`docs/work/WORK_PROMPT_COMPLETE_GAME_FORGE_HANDOFF_v1.1.md`](docs/work/WORK_PROMPT_COMPLETE_GAME_FORGE_HANDOFF_v1.1.md)

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
- 完整な成長経済、Breakpoint、Automation、Prestige、Scale Transition
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

**現在の`src/`、旧README系資料、旧実装レポートには、以前の横スクロールアクション版の実装が残っています。**

これはCurrent Creative Productではありません。

状態は、

> **LEGACY IMPLEMENTATION / MIGRATION INPUT**

です。

旧コードが存在することを理由に、新しいCreative Specificationを旧コアループへ寄せてはいけません。

一方、旧実装に存在する次の能力は再利用候補です。

- save / backup / export/import
- responsive / PWA / hosting
- accessibility settings
- audio infrastructure
- performance settings
- test infrastructure

再利用・破棄・移行はImplementation ForgeがTechnical Auditを行い、Creative Intentを変える必要がある場合はSAKIYA STUDIOへ戻します。

旧実装と旧資料の扱いは [`legacy/README.md`](legacy/README.md) を参照してください。

## Authority

- SAKIYA：Final Authority
- SAKIYA STUDIO / Chat / Work：Creative Authority
- Implementation Forge / Codex：Engineering Authority
- GitHub：正規保存面、履歴、共有、受け渡し。Authorityではない

Creative PASS、Technical PASS、Owner Acceptance、Release状態を互いに代用しません。

## Development

現行コードはLegacy実装を含むため、現在の起動結果を新ゲーム完成状態と解釈しないでください。

Repositoryのbuild / hosting / test基盤を調査する場合は、既存scriptを壊す前にEvidenceを残し、Migration Work Packageの中で変更します。

新方向の本格実装は、Complete Product Creative Specification、P0 Validation、Forge Handoffに従って段階的に進めます。
