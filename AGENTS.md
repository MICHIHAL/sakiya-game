# Project Instructions — 八乙女さきや 活動者育成インクリメンタル

このRepositoryのCurrent Creative Productは、旧横スクロールアクション版ではありません。

現在の対象：

> **八乙女さきや 活動者育成インクリメンタル**

North Star：

> **一緒にデカくする。**

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

---

## 1. Authority

- SAKIYA：Final Authority
- SAKIYA STUDIO / Chat / Work：Creative Authority
- Implementation Forge / Codex：Engineering Authority
- GitHub：正規保存面、履歴、共有、受け渡し。Authorityではない

Creative Intentを技術都合だけで変更しないでください。

Creative変更が必要な場合はSAKIYA STUDIOへ返します。

### 1.1 Forge Execution Authority

必ず次を参照してください。

- `docs/work/FORGE_EXECUTION_AUTHORITY_CONTRACT.md`

Workが拘束できるもの：

- 完成像
- Creative Intent
- player-visible specification
- Creative Invariant
- Test Intent
- Acceptance Criteria
- 必要Evidence
- Owner Decision Gate

Implementation Forge / Codexが所有するもの：

- repository audit
- technical architecture
- implementation plan
- work breakdown
- subagent composition
- file ownership
- parallelization
- test strategy
- executable tests
- simulation implementation
- adversarial technical review
- regression
- CI / build
- performance verification
- release engineering
- branch / commit / PR strategy
- verified commit / push

Work文書内の具体的な技術工程、分担、テスト手法は参考案です。より良い方法へ再設計してよいですが、Creative Intentまたはplayer-visible specificationを変更する場合は独断で置換せずSAKIYA STUDIOへ返してください。

「Workに書かれていないためテストしなかった」は認めません。Release-ready品質に必要なTechnical VerificationはForge自身の責任で補完してください。

---

## 2. Current creative source priority

SAKIYAの新しい明示意思がない限り、次の順で解決します。

1. 現在のSAKIYAの明示意思
2. `docs/CURRENT_CREATIVE_STATE.md`
3. 本`AGENTS.md`
4. `docs/SAKIYA_CREATOR_INCREMENTAL_CREATIVE_GAME_DESIGN_SPEC_v0.7.md`
5. `docs/SAKIYA_INCREMENTAL_PROTOTYPE_FOUNDATION_FREEZE_SPEC.md`
6. `docs/decisions/OWNER_COMPLETION_TARGET_2026-08-27.md`
7. Owner採用済みComplete Product Lock / Creative Specification / Forge Handoff
8. 旧企画、旧実装、旧検証資料

Work最終化用：

- `docs/work/WORK_PROMPT_COMPLETE_GAME_FORGE_HANDOFF_v1.2.md`

Authority契約：

- `docs/work/FORGE_EXECUTION_AUTHORITY_CONTRACT.md`

`docs/work/WORK_PROMPT_COMPLETE_GAME_FORGE_HANDOFF_v1.1.md`は品質観点と探索履歴として残しますが、Engineering Authorityに関する解釈はv1.2とAuthority Contractが優先します。

旧`GAME_DESIGN_BIBLE_PREMIUM_v0.2.md`、旧RUN設計、旧Implementation Report等をCurrent Creative Authorityとして扱わないでください。

---

## 3. Legacy implementation

現在の`src/`、旧assets、旧testsの一部は、以前の横スクロールアクション版を実装したものです。

状態：

> **LEGACY IMPLEMENTATION / MIGRATION INPUT**

禁止：

- 旧コードがあることを理由に旧コアループを保存する
- `move right → fight → lose → restart`をCurrent Core Loopとして扱う
- 旧RUN / combat / boss構造を新企画へ無断で混ぜる
- 旧READMEや旧レポートから新仕様を上書きする

再利用候補：

- save / backup / export-import
- responsive / PWA / hosting
- accessibility
- audio infrastructure
- performance settings
- test infrastructure

再利用可否はForgeがTechnical Auditで判断します。

旧実装を削除・大規模変更する前に、branch / commit / migration Evidence、rollback方法、Creative impactを残してください。

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

completeと言えるのは、公開判定へそのまま進めるRelease-ready品質のみです。

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

## 6. Production behavior

Workが示した工程・Work Package・サブエージェント・テスト階層は、Creative coverageと依存関係の参考です。Engineering実行計画ではありません。

Implementation Forgeは実装開始時にRepositoryを監査し、自ら次を作成して実行してください。

1. migration / reuse audit
2. architecture proposal
3. dependency graph
4. work breakdown
5. actual subagent and file ownership plan
6. test and evidence strategy
7. adversarial review and regression plan
8. branch / commit / return plan

P0-FEEL、P0-SIM、First 30 Minutes等のCreative milestonesは維持しますが、その技術的実装順、並列化、テスト構成はForgeが決めます。

---

## 7. Quality loop

各重要段階を、

```text
Creative Requirement
↓
Forge Technical Plan
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
Forge Return
↓
Creative Review / Owner Gate
```

で閉じます。

初稿・初実装をcompleteと報告しないでください。

BLOCKER / HIGH findingを黙って残さないでください。

Workのテスト一覧はTest Intentです。具体的なテストコード、ケース分解、seed数、CI、device matrix、soak方法はForgeが設計します。

---

## 8. Implementation behavior

可能な場合はlocal serverを自分で起動し、利用可能なbrowserで実際に操作してください。

ユーザーに手動起動を求める前に、自分で実行できないか確認してください。

大きなvisual変更では、採用済みCreative Sourceとmockを確認し、layout、density、hierarchy、visible contentを無断で変えないでください。

旧横スクロール版のvisualやmockは、新Current Creative Directionのsource of truthではありません。

---

## 9. Existing hosting / build assets

現RepositoryにはSites / Web build用の既存資産があります。

`.openai/hosting.json`、`worker/`、`scripts/prepare-sites-build.mjs`、Sites test等を再利用できる可能性があります。

現状の存在だけを理由に永久保持せず、Migration / Technical AuditでKEEP / ADAPT / REPLACE / ARCHIVEをEvidence付きで判断してください。

---

## 10. Reporting truth

次を混同しないでください。

- Creative PASS
- Technical PASS
- SAKIYA Final Acceptance
- Release-ready
- Public release

未検証の内容をPASS、complete、commercial qualityと報告しないでください。

実際に使用していないSkill、subagent、toolを使用済みと報告しないでください。
