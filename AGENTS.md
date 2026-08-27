# Project Instructions — 八乙女さきや 活動者育成インクリメンタル

このRepositoryのCurrent Creative Productは、旧横スクロールアクション版ではありません。

現在の対象は、

> **八乙女さきや 活動者育成インクリメンタル**

です。

North Star：

> **一緒にデカくする。**

プレイヤーの参加は、

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

と変化します。

---

## 1. Authority

- SAKIYA：Final Authority
- SAKIYA STUDIO / Chat / Work：Creative Authority
- Implementation Forge / Codex：Engineering Authority
- GitHub：正規保存面、履歴、共有、受け渡し。Authorityではない

Creative Intentを技術都合だけで変更しないでください。

Creative変更が必要な場合はSAKIYA STUDIOへ返します。

---

## 2. Current creative source priority

Project固有のCreative判断は、SAKIYAの新しい明示意思がない限り、次の順で解決します。

1. 現在のSAKIYAの明示意思
2. `docs/CURRENT_CREATIVE_STATE.md`
3. `docs/SAKIYA_CREATOR_INCREMENTAL_CREATIVE_GAME_DESIGN_SPEC_v0.7.md`
4. `docs/SAKIYA_INCREMENTAL_PROTOTYPE_FOUNDATION_FREEZE_SPEC.md`
5. `docs/decisions/OWNER_COMPLETION_TARGET_2026-08-27.md`
6. WorkでOwner採用されたComplete Product Creative Specification / Forge Handoff
7. 旧企画、旧実装、旧検証資料

Work用の現行制作契約：

- `docs/work/WORK_PROMPT_COMPLETE_GAME_FORGE_HANDOFF_v1.1.md`

旧`GAME_DESIGN_BIBLE_PREMIUM_v0.2.md`、旧RUN設計、旧Implementation Report等をCurrent Creative Authorityとして扱わないでください。

---

## 3. Legacy implementation

現在の`src/`、旧assets、旧testsの一部は、以前の横スクロールアクション版を実装したものです。

状態：

> **LEGACY IMPLEMENTATION / MIGRATION INPUT**

次を禁止します。

- 旧コードがあることを理由に旧コアループを保存する
- `move right → fight → lose → restart`をCurrent Core Loopとして扱う
- 旧RUN / combat / boss構造を新企画へ無断で混ぜる
- 旧READMEや旧レポートから新仕様を上書きする

一方、次の技術能力は再利用候補です。

- save / backup / export-import
- responsive / PWA / hosting
- accessibility
- audio infrastructure
- performance settings
- test infrastructure

再利用可否はForgeがTechnical Auditで判断します。

旧実装を削除・大規模変更する前に、branch / commit / migration Evidenceを残してください。

Legacy map：`legacy/README.md`

---

## 4. Fixed creative core

実装・Prototype・UI変更で次を壊してはいけません。

### North Star

**一緒にデカくする。**

### Time economies

- 配信：Session
- 動画、楽曲、アーカイブ等：Asset Idle
- Breakpoint、Automation、Prestige、Scale Transition：Meta Incremental

### Player Participation

- Presence
- Co-creation
- Shared Expansion

### Personhood

- 人物をレア度や生産倍率へ還元しない
- SSRリスナーを作らない
- 低反応人物を売却・素材化しない
- 課金で関係進行を買わせない

### Gift

ギフトを主要成長経路、最短ルート、課金誘導の中心にしない。

### Room

PCカメラから見た、いつものさきやの部屋をActivity Homeとして維持する。

### Semantic Retirement

Scale Unit移行時は旧経済をリアルタイム生成し続けず、最終値、人物、履歴、成立基盤を保存し、新Unitへ意味として内包する。

### ENTRY CHIME

最初の外部リスナーが来た時の音は、最後まで同一音源。

豪華版、音程変更、世界層版、リミックスは禁止。

### Tone

世界観の笑いを、さきやの自己神格化へ寄せない。

尺度、制度、集計、科学、言葉が活動規模を処理できなくなることを中心にする。

### Activities

活動ごとに異なる動詞を持つ。

全活動を同じプログレスバーの色違いにしない。

---

## 5. Completion target

このProjectでcompleteと言えるのは、公開判定へそのまま進めるRelease-ready品質のみです。

次はcompleteではありません。

- prototype
- vertical slice
- first 30 minutes
- foundation
- build success
- automated tests pass
- UI mock
- system-only implementation

Completionには、最終UI、art、motion、BGM、SFX、mix、content、save、offline、accessibility、performance、rights、privacy、release package、Creative PASS、Technical PASS、SAKIYA Final Acceptanceが必要です。

詳細：`docs/decisions/OWNER_COMPLETION_TARGET_2026-08-27.md`

---

## 6. Production order

本格完成を一括実装しないでください。

基本順序：

1. Source / migration audit
2. Final Product Lock
3. P0-FEEL
4. P0-SIM
5. Pareto integration
6. First 30 minutes
7. core product systems
8. activities / synergy
9. scale / prestige / world
10. final UI / visual / motion
11. final audio
12. content completion
13. QA / accessibility / performance
14. release preparation
15. Final Acceptance

最新のWork Handoffがこの順序を更新した場合はそちらを使います。

---

## 7. Quality loop

各重要段階を、

```text
Creative Specification
↓
Implementation / Probe
↓
Verification
↓
Adversarial Review
↓
Repair
↓
Regression
↓
Evidence
↓
Acceptance
```

で閉じます。

初稿・初実装をcompleteと報告しないでください。

BLOCKER / HIGH findingを黙って残さないでください。

Creative ReviewとTechnical Verificationを分離します。

---

## 8. Implementation behavior

実装作業では、可能な場合はlocal serverを自分で起動し、利用可能なbrowserで実際に操作してください。

ユーザーに手動起動を求める前に、自分で実行できないか確認してください。

大きなvisual変更では、採用済みCreative Sourceとmockを確認し、layout、density、hierarchy、visible contentを無断で変えないでください。

ただし旧横スクロール版のvisualやmockは、新Current Creative Directionのsource of truthではありません。

---

## 9. Existing hosting / build assets

現RepositoryにはSites / Web build用の既存資産があります。

`.openai/hosting.json`、`worker/`、`scripts/prepare-sites-build.mjs`、Sites test等を再利用できる可能性があります。

しかし、現状の存在だけを理由に永久保持しないでください。

Migration / Technical Auditで、

- KEEP
- ADAPT
- REPLACE
- ARCHIVE

をEvidence付きで判断してください。

---

## 10. Reporting truth

次を混同しないでください。

- Creative PASS
- Technical PASS
- SAKIYA Final Acceptance
- Release-ready
- Public release

未検証の内容をPASS、complete、commercial qualityと報告しないでください。

実際に使用していないSkill、sub-agent、toolを使用済みと報告しないでください。
