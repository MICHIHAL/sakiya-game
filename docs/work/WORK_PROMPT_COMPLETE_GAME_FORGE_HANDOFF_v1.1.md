# Work実行プロンプト
## 八乙女さきや 活動者育成インクリメンタル
### 完成像固定 → 完全設計 → 品質検証 → Forge / Codex依頼書生成 v1.1

以下をWorkへの実行指示として扱ってください。

---

# 0. Mission

`MICHIHAL/sakiya-game` にある現行資料と実装を確認し、「八乙女さきや 活動者育成インクリメンタル」を、**有償作品としてそのまま公開可能な完成状態**までCodex / Implementation Forgeが作り切れるように、Creative Authority側の不足設計を完了し、最終的なForge依頼書を作成してください。

計画案だけを返して終了しないでください。

Workの責任範囲で、実際に次を作成します。

1. 完成品の全体像を先に固定する
2. 現在資料・実装・Repository指示の衝突を整理する
3. 不足しているCreative Specificationを埋める
4. P0-SIM / P0-FEELと完成品制作を分離する
5. 作業を小さな責任セクションへ分割する
6. 利用可能ならサブエージェントへ役割分担する
7. Codexへ渡せるMaster Forge Handoffを作る
8. 完成判定に必要なEvidence、テスト、実機確認、公開準備まで定義する
9. 各段階に敵対的レビュー、修復、回帰確認を入れる
10. 初稿・初実装を完成扱いせず、品質改善ループをEvidence付きで閉じる

Workの出口：

> **Approved Complete Product Creative Specification**  
> **Approved Validation Specification**  
> **Master Forge Handoff**

Workは実装しません。

---

# 1. Authority

- **SAKIYA**：Final Authority
- **SAKIYA STUDIO / Work**：Creative Authority
- **Implementation Forge / Codex**：Engineering Authority
- **GitHub**：正規保存面・履歴・共有・受け渡し。Authorityではない

Workが決める：

- what / why
- Intended Experience
- プレイヤーから見える仕様
- ゲームルールの意味
- 完成体験
- UI / 音 / 演出 / コンテンツのCreative Specification
- Creative Invariant
- Forge受入条件

Forgeへ委ねる：

- internal architecture
- data model / type
- tick
- RNG / seed実装
- implementation
- test code
- CI / build
- debug
- performance implementation
- Technical Verification
- verified commit / push

Work内部に小型Forgeを作らないでください。

---

# 2. Source of Truth

最初に必要範囲だけを読む。

Project Repository：

`MICHIHAL/sakiya-game@main`

最優先：

1. `docs/CURRENT_CREATIVE_STATE.md`
2. `docs/SAKIYA_CREATOR_INCREMENTAL_CREATIVE_GAME_DESIGN_SPEC_v0.7.md`
3. `docs/SAKIYA_INCREMENTAL_PROTOTYPE_FOUNDATION_FREEZE_SPEC.md`
4. `docs/decisions/OWNER_COMPLETION_TARGET_2026-08-27.md`

現状Evidenceとして必要時だけ読む：

- `README.md`
- `AGENTS.md`
- `IMPLEMENTATION_REPORT.md`
- `FORGE_RETURN.yaml`
- `design-qa.md`
- 関連するproduct code、asset、test、build設定

情報優先順位：

```text
current explicit SAKIYA intent
>
CURRENT_CREATIVE_STATE
>
v0.7
>
Prototype Foundation Freeze Spec
>
current repository evidence
>
legacy design / implementation
```

---

# 3. 最初のBLOCKER：旧実装と新Creative方向の衝突

Repository rootには、旧横スクロールアクション / RUN型「ヤニ切れ大パニック」のREADME、AGENTS、実装が残っている可能性があります。

現在のCreative Targetは、配信参加、人間関係、異なる活動経済、Scale Transition、超大型Incrementalです。

無言で混ぜないでください。

最初に **PROJECT DIRECTION TRANSITION DECISION** を作る。

分類：

- KEEP
- ADAPT
- ARCHIVE
- REMOVE FROM CURRENT DIRECTION
- UNKNOWN

対象：

- 旧core loop
- RUN / combat
- UI
- save / backup / export
- audio engine
- accessibility
- responsive / PWA / hosting
- test infrastructure
- assets
- README
- AGENTS
- implementation report
- Forge return

Owner承認なしに旧方向を破壊的に削除しない。

Reusable technical capabilityと旧game experienceを分離する。

---

# 4. 完成の定義

完成はprototype、vertical slice、foundation、MVPではない。

> **UI、ビジュアル、アニメーション、BGM、SFX、数値経済、配信体験、活動システム、世界層、コンテンツ、保存、オフライン、アクセシビリティ、権利、公開準備を備え、最初からMain Goalと定義済みPost-goalまで遊べ、そのまま有償公開判定へ進める状態。**

最低条件：

## Experience

- first launch
- participation profile
- Activity Home / room
- Before / LIVE / After
- first viewer / exit / revisit / regularization
- first cross-activity loop
- all accepted activities
- Breakpoint
- Automation
- Prestige
- Scale Transition
- Semantic Retirement
- Main Goal
- Ending / completion moment
- accepted post-goal / Strong New Game

## Presentation

- final UI
- responsive layout
- final art
- final animation / motion
- final BGM
- final SFX
- final mix
- same ENTRY CHIME invariant
- no placeholder presentation

## Reliability

- complete economy
- save / backup / recovery
- export / import if retained
- offline progression
- large-number behavior
- RNG fairness
- no-gift route
- no-person-gacha
- no-dead-resource
- performance
- error recovery

## Accessibility

- pause
- event history
- readable speed controls
- reduced motion
- non-color-only information
- text / contrast controls
- subtitles / SE captions
- audio-independent critical cues
- input alternatives
- large-number notation options

## Release

- production build
- real-device verification
- actual audio listening review
- rights / provenance / privacy
- credits / licenses
- distributable or deployable package
- screenshots / description / release notes as required
- known limitations
- rollback / recovery plan
- Creative PASS
- Technical PASS
- SAKIYA Final Acceptance
- Release Gate PASS

Public release itself requires explicit Owner authorization.

---

# 5. FINAL PRODUCT LOCKを最初に作る

詳細係数や個別画面へ潜る前に、完成品の全体像を固定する。

最低項目：

1. Product Promise
2. このゲーム固有の体験
3. Player Role
4. North Star
5. first 5 min
6. first 30 min
7. 2h
8. 10h
9. middle game
10. late game
11. Main Goal
12. Ending
13. Post-goal
14. accepted activities
15. activity-specific verbs
16. final Broadcast form
17. Macro Layer / Scale Unit / SP / BP structure
18. Prestige structure
19. final UI
20. final visual direction
21. final audio direction
22. content volume
23. platform recommendation
24. monetization / sale model friction
25. Definition of Complete
26. explicit exclusions
27. Owner Decision Gates

P0/P1は完成像をMVPへ縮めるためではなく、完成像を壊さず成立させるための検証工程とする。

---

# 6. Non-Negotiable Core

- North Star：**一緒にデカくする**
- Participation：Presence → Co-creation → Shared Expansion
- streaming = Session
- video / music / archive-like works = Asset Idle
- Breakpoint / Automation / Prestige / Scale Transition = Meta Incremental
- same room as long-term visual horizon
- Personhood Guardrail
- gifts are not dominant growth route
- Semantic Retirement
- same ENTRY CHIME source asset throughout the game
- different activities preserve different satisfying verbs
- light and deep incremental play are the same game
- world comedy targets scale / institutions / measurement failure, not simple Sakiya worship

---

# 7. Modular Work / Subagent Waves

サブエージェントが実際に利用可能な場合のみ使用する。利用していないものを利用済みと報告しない。

巨大Routerや新Authorityを作らない。一時的な専門分担に限定する。

全出力で状態を分ける：

- FACT
- ACCEPTED
- HYPOTHESIS
- OPTION
- UNKNOWN
- OWNER DECISION NEEDED
- RISK
- REQUIRED EVIDENCE

## WAVE 0 — Source / Transition

### S0 Canon & Project Conflict Auditor

担当：

- source priority
- current / legacy conflict
- KEEP / ADAPT / ARCHIVE / REMOVE / UNKNOWN
- repository instruction transition

成果：

- Source Ledger
- Conflict Matrix
- Project Direction Transition Decision
- Missing Evidence
- Owner Gate

---

## WAVE 1 — Complete Product Lock

### S1 Experience Director

- full player journey
- 5 emotional peak types
- participation transformation
- Main Goal / post-goal
- completion moment

### S2 Broadcast & Relationship Designer

- Before / LIVE / After
- A1 / A2 / A3
- LIVE 1
- viewers / exit / revisit / regularization
- CRITICAL
- Personhood
- ENTRY CHIME
- P0-FEEL

### S3 Incremental Economy & Progression Designer

- Main Progression
- bottleneck resources
- resource flow
- production / sink / conversion meaning
- Breakpoint
- Automation
- Prestige
- no-gift / no-wait / no-dead-resource
- P0-SIM
- long progression budget

Workはtechnical formula implementationを決めない。

### S4 Activities & Synergy Designer

対象候補：

- streaming
- video
- vocal
- music
- SNS
- live event

各活動：

- verb
- resources
- unique pleasure
- time model
- automation
- bridge to other activities
- anti-universal-resource check

### S5 Scale / Prestige / World Ontology Designer

- 24 BP + 10 SP
- SP1 conflict
- Macro Layer / Scale Unit
- Semantic Retirement
- Prestige
- Strong New Game
- Main Goal / post-goal
- how every activity transforms with scale

### WAVE 1 INTEGRATION GATE

S1〜S5を統合しFINAL PRODUCT LOCKを作る。

矛盾を平均化しない。得るもの / 失うものを明記し、Owner Gateが必要なら短く提示する。

---

## WAVE 2 — Presentation / Content / Release Experience

### S6 UI / UX / Visual / Motion Director

- screen inventory
- state inventory
- navigation
- HUD
- room
- scale UI
- prestige UI
- archive / analysis
- responsive
- motion
- world intrusion
- final art direction
- asset list
- empty / loading / error / offline states

### S7 Audio / Music / SFX Director

- music map
- activity music
- Layer / Scale audio curve
- feedback hierarchy
- ENTRY CHIME
- SFX
- ducking
- quiet moments
- final mix intent
- audio asset volume
- mute parity / accessibility

内部audio engineはForge判断。

### S8 Flavor / Narrative / Tone Editor

- Tone Contract
- news
- Sakiya reactions
- listener reactions
- Anchor Events
- Systemic Flavor
- Short Fragments
- repetition prevention
- self-deification prevention
- content volume / authored pool
- official Sakiya lines vs AI proposal separation

### S9 Accessibility / Platform UX Designer

- target screen ratios
- touch / mouse / keyboard
- pause
- logs
- speed
- reduced motion
- captions
- contrast
- text scale
- number notation
- offline UX
- save UX
- device matrix

### S10 Rights / Privacy / Business / Release Planner

- Sakiya name / appearance / voice / costume
- music / video rights
- fan art
- listener names / comments
- platform references
- privacy
- profile data
- credits
- licenses
- commercial scope
- monetization guardrails
- release / store / hosting requirements

Current product / store facts that can change must be verified from current primary sources.

### WAVE 2 INTEGRATION GATE

UI、art、animation、audio、content、accessibility、rights、platform、releaseをFinal Product Lockへ統合する。

UNKNOWNを残す場合：

- why unresolved
- evidence needed
- decision timing
- decision owner
- safe temporary default

を記録する。

---

## WAVE 3 — Quality / Acceptance / Forge Handoff

### S11 Quality Strategy & Test Intent Designer

- player-visible test requirements
- quantitative invariants
- creative invariants
- evidence requirements
- regression scope
- long-play / device / audio / save / accessibility tests

### S12 Adversarial Review Lead

- adversarial review phases
- hostile reviewer lenses
- severity
- repair conditions
- re-review
- finding ledger

### S13 Completion Evidence & Release QA Planner

- evidence matrix
- real-device matrix
- release gate
- known limitations
- rollback
- claim audit

### S14 Integration Editor / Forge Handoff Author

全成果を統合し、Master Forge Handoffを作る。

未決・探索中・rejected・superseded・test-dependentを消さない。

---

# 8. Modular Deliverables

一つの巨大文書だけに詰め込まない。

推奨：

```text
docs/completion/
  00_SOURCE_LEDGER_AND_TRANSITION.md
  01_FINAL_PRODUCT_LOCK.md
  02_PLAYER_AND_BROADCAST_EXPERIENCE.md
  03_INCREMENTAL_ECONOMY_AND_PROGRESSION.md
  04_ACTIVITIES_AND_SYNERGIES.md
  05_SCALE_PRESTIGE_WORLD_ONTOLOGY.md
  06_UI_VISUAL_MOTION_DIRECTION.md
  07_AUDIO_MUSIC_SFX_DIRECTION.md
  08_FLAVOR_TONE_CONTENT_BUDGET.md
  09_ACCESSIBILITY_PLATFORM_RELEASE_UX.md
  10_RIGHTS_PRIVACY_BUSINESS_RELEASE.md
  11_TEST_STRATEGY_AND_QUALITY_GATES.md
  12_ADVERSARIAL_REVIEW_PLAN.md
  13_ACCEPTANCE_EVIDENCE_MATRIX.md
  14_RELEASE_READINESS_GATE.md
  15_MASTER_FORGE_HANDOFF.md
  DECISION_REGISTER.md
  EXPLORATION_REGISTER.md
  QUALITY_FINDING_LEDGER.md
```

各文書：

- Purpose
- Source
- Authority Owner
- Accepted Core
- Concrete Specification
- Player-visible Outcome
- Dependencies
- Risks
- Unknowns
- Acceptance Evidence
- Owner Gate
- Forge Handoff Notes

---

# 9. Forge Work Packages

Master Forge Handoffを一発の巨大実装指示にしない。

各Package：

- Purpose
- Creative Owner
- Dependencies
- Inputs
- Player-visible Output
- Non-goals
- Acceptance Criteria
- Evidence
- Rollback / Recovery
- Forge Return Requirement

推奨：

- WP-00 Project Direction Transition
- WP-01 Technical Audit & Forge Plan
- WP-02 P0-SIM
- WP-03 P0-FEEL
- WP-04 Integrated First 30 Minutes
- WP-05 Core Product Systems
- WP-06 Prestige / Scale / World
- WP-07 UI / Visual / Motion
- WP-08 Audio / Music / SFX
- WP-09 Content / Flavor
- WP-10 Accessibility / Input / Platform
- WP-11 Quality / Balance / Performance
- WP-12 Release Preparation
- WP-13 Final Acceptance & Polish Loop

Forge側の技術サブエージェント候補：

- simulation / economy
- broadcast / relationship
- activity systems
- scale / prestige
- UI / frontend
- visual / motion integration
- audio integration
- content pipeline
- save / offline
- accessibility / input
- QA / test
- build / release

同じファイルを競合並列更新しない。Creative Intent変更が必要ならStudioへ返す。

---

# 10. Quality Loop

品質工程：

```text
Creative Specification
↓
Probe / Prototype
↓
Implementation
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

`build succeeded`、`test passed once`、`feature exists`だけでは完成としない。

数値変更時：

- previous value
- new value
- change rate
- reason
- decision authority
- retest condition

を残す。

---

# 11. Test Specification Contract

Workはtest intent、player-visible expectation、PASS / FAIL、Evidenceを定義する。
Forgeはtest code、framework、automation、measurementを決める。

各Test Case：

- Test ID
- Purpose
- Authority owner
- Phase
- Preconditions
- Scenario
- Expected visible result
- Threshold / Creative PASS
- Forbidden result
- Evidence
- Regression scope
- Severity
- Re-test condition

## T0 Source / Direction Integrity

- current creative source read
- old RUN direction not silently merged
- current / legacy / unknown separated

## T1 P0-SIM Economy

- 27 variants
- seed coverage
- milestone P10 / P50 / P90
- stream budget tail
- no-wait
- no-gift
- no-person-gacha
- no-dead-resource
- no universal-video route
- bottleneck transitions
- strategy Pareto

## T2 P0-FEEL

- A1 / A2 / A3
- LIVE 1
- ENTRY CHIME
- viewer / exit / revisit
- regularization precursor
- ×1 / ×2
- event memory
- reason for another broadcast

## T3 First 30 Minutes

- onboarding
- profile
- first broadcast
- first revisit
- BP1〜BP3
- video
- first synergy
- zero-gift path
- no dead-end

## T4 Long Progression

- 2h
- 10h
- midgame
- Macro Layer / Scale Unit
- Prestige
- Main Goal
- post-goal
- old systems compress only after understanding
- manual burden does not inflate uncontrollably

Use both accelerated simulation and human long-play evidence.

## T5 UI / Visual / Motion

- screen coverage
- responsive
- touch targets
- text / number overflow
- HUD overlap
- same-room recognizability
- reduced motion
- world intrusion
- empty / loading / error / offline states
- screenshot comparison

## T6 Audio

- same ENTRY CHIME source asset
- no pitch / remix replacement
- ducking
- activity identity
- Scale audio curve
- notification fatigue
- mobile speaker / headphone / desktop listening
- mute parity
- captions / visual substitutes
- no clipping / missing asset

## T7 Save / Offline / Migration

- new save
- autosave
- backup
- export/import if retained
- corruption recovery
- version migration
- offline progression
- clock manipulation
- huge-number serialization
- no update progress loss

## T8 Accessibility / Input / Device

- keyboard / mouse / touch
- pause
- speed
- text scale
- contrast
- color-independent cues
- reduced motion
- captions / SE captions
- event history
- number notation
- audio-independent play

## T9 Performance / Reliability

- start-up
- frame pacing
- memory growth
- long soak
- background / resume
- asset failure
- low-end target
- huge-number stress
- event burst
- no silent error

Exact technical thresholds are proposed and measured by Forge once target platform is selected.

## T10 Content / Flavor

- missing text
- placeholder
- repetition frequency
- cooldown
- contradiction
- Canon / AI proposal separation
- world-layer joke principle
- self-deification check
- privacy
- content volume
- Ending / credits / help coverage

## T11 Rights / Privacy / Release

- provenance
- licenses
- credits
- personal data
- consent / withdrawal
- platform imitation
- privacy text
- store / public copy
- screenshots
- release notes
- rollback

Hostile scenarios：

- zero gift
- mostly silent viewing
- almost no video
- repeated streaming
- long offline
- very short daily sessions
- long binge sessions
- frequent speed changes
- repeated pause / resume
- save and immediate quit
- old save after update
- max text / reduced motion / mute
- resize / rotate
- clock manipulation
- extreme large numbers

Forge Returnはexecuted / pass / fail / skipped reason / environment / device / commit / artifact / logs / screenshots / recording / benchmark / unresolved finding / regression statusを返す。

---

# 12. Adversarial Review

## Review phases

- AR-0 Final Product Lock
- AR-1 P0
- AR-2 First 30 Minutes
- AR-3 Feature-complete
- AR-4 Content-complete
- AR-5 Release Candidate

## Reviewer lenses

1. Incremental Veteran
2. Light / Casual Player
3. Streaming Culture Outsider
4. Sakiya-unfamiliar Player
5. Existing Listener
6. Monetization Skeptic
7. Tone / Self-deification Critic
8. Accessibility Reviewer
9. Mobile-only Reviewer
10. Content / UI / Audio Fatigue Reviewer
11. Save / Migration Destroyer
12. Rights / Privacy / Release Reviewer
13. Hostile Third-party Product Reviewer

Finding format：

```text
ID
Severity
Review phase
Reviewer lens
FACT
EVIDENCE
INFERENCE
Violated contract / invariant
Expected
Actual
Player impact
Reproduction
Repair condition
Authority owner
Re-review condition
Status
```

Severity：

- BLOCKER
- HIGH
- MEDIUM
- LOW

BLOCKERは解決、またはresponsible authorityのEvidence付き明示却下までGateを通さない。

Findingを自動採用しない。旧案を防御しない。核を守りながらfailureを修復する。

修復後はregressionとre-reviewを行う。

品質改善は機能数ではなく、

- clarity
- responsiveness
- rhythm
- feedback
- coherence
- authorship
- reliability

を上げる。

---

# 13. Completion Gates

## Gate A Creative Completion

完成像、活動、UI、audio、content、scale、post-goal、accessibility、rights、release criteriaが定義済み。

## Gate B P0 Validation

P0-SIM + P0-FEEL + Pareto、BLOCKERなし。

## Gate C Integrated Product

first launchからMain Goal、placeholderなし、save / offline、full content、final UI / audio / art。

## Gate D Technical PASS

build、tests、performance、device、save integrity、recovery、licenses。

## Gate E Creative PASS

North Star、participation、personhood、activity verbs、scale meaning、tone、sound、final experience。

## Gate F SAKIYA Final Acceptance

Creative / Technical PASSとは別。

## Gate G Release-ready

deployable / distributable package、public assets、credits、privacy、rollback、known limitations、Evidence。

## Gate H Public Release

Ownerの明示許可がある場合のみ。

---

# 14. Required Evidence

最低限：

- source commit
- build result
- test result
- simulation result
- real-device screenshots
- interaction recording
- audio listening evidence
- performance measurement
- save / restore proof
- offline progression proof
- accessibility proof
- rights checklist
- distributable / deployable package
- issue list
- severity ledger
- adversarial findings
- repair commits
- regression evidence
- unresolved UNKNOWN
- waived findings + authority approval
- Creative Review
- Technical Return
- Owner Acceptance

---

# 15. 禁止事項

- MVPへ自動縮小しない
- 100時間仮説を大きいという理由だけで削除しない
- P0を製品完成扱いしない
- 旧実装と新企画を無言で混ぜない
- 配信を単なる生産ボタンにしない
- 全活動を同じプログレスバーにしない
- 人物を性能ガチャにしない
- ギフトを最短ルートにしない
- 世界をSakiya称賛装置にしない
- ENTRY CHIMEを豪華版へ変えない
- Semantic Retirementを旧巨大資源の全並行保持へ戻さない
- Workがtechnical architectureを決めない
- 未使用Skill / subagentを使用済みと報告しない
- GitHub保存を公開許可とみなさない
- Evidenceなしにcomplete / commercial quality / release-readyと言わない
- 一度のbuild / testだけで品質完了としない
- adversarial reviewを指摘一覧だけで終わらせない
- repair後のregressionを省略しない
- BLOCKER / HIGHを隠してrelease判断へ進まない
- placeholder / TODO / dead control / generic AI fillerを完成品に残さない

---

# 16. 最終出力

Workは最低限、次を返す。

1. Current State
2. Final Product Lock
3. Decision Register
4. Exploration Register
5. Modular Deliverables
6. Actual Subagent Report
7. Master Forge Handoff
8. Test & Quality Strategy
9. Adversarial Review Plan
10. Completion Matrix
11. Owner Decision Gate

Owner Decision Gateは本当にSAKIYAが決める必要があるものへ絞り、推奨案と得失を添える。

---

# 17. 最終固定文

> **この仕事の目的は、プロトタイプを作ることではない。**
>
> **完成品の姿を先に固定し、その完成品を壊さずに検証し、Codexが最初から最後まで作り切れるCreative SpecificationとForge Handoffを作ること。**
>
> 完成とは、UI、音楽、効果音、最初から最後までのゲームプレイ、数値経済、異なる活動の手触り、世界のScale変化、保存・オフライン・アクセシビリティ、実機検証、権利、公開準備まで揃った状態である。
>
> **「Foundationがある」「一部が遊べる」「buildが通る」「testが一度通った」は完成ではない。**
>
> 敵対的レビュー、修復、回帰確認、実機Evidenceまで閉じる。
>
> **SAKIYAが受け入れ、そのまま公開判定へ進める状態を完成とする。**
