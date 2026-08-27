# SOURCE LEDGER AND PROJECT TRANSITION

Status: WORK-APPROVED SOURCE RESOLUTION / AUTHORITY RECLASSIFIED / DESTRUCTIVE MIGRATION NOT AUTHORIZED  
Repository: MICHIHAL/sakiya-game  
Verified main HEAD: 69b36a6ac59f1fad8157cb7ceb46ba352c476710  
Verified at: 2026-08-27  
Authority owner: SAKIYA / SAKIYA STUDIO

## 1. Current-state verdict

### FACT

- README.md and AGENTS.md already describe the creator-incremental direction.
- Current product direction is 「八乙女さきや 活動者育成インクリメンタル」.
- North Star is 「一緒にデカくする」.
- src, public assets, tests, runtime reports, manifest, and the existing hosted build still implement the superseded horizontal action / RUN product.
- No docs/completion directory existed at the audited HEAD.
- No current-product P0-SIM, P0-FEEL, build, device, audio, save, accessibility, or release evidence exists.
- SAKIYA's current explicit instruction requires the complete game to be designed on the premise of mobile play; a desktop-only full product plus mobile demo is superseded.

### ACCEPTED

- The old RUN game is a legacy implementation and migration input, not the current creative target.
- Reusable technical capability may be adapted without retaining old gameplay.
- Creative PASS, Technical PASS, Sakiya Final Acceptance, Release-ready, and Public Release are separate.
- Work / Studio bind Creative Intent, player-visible specification, Creative Invariants, completion meaning, Test Intent, proof obligations, evidence categories, and player-visible pass conditions.
- Forge owns repository audit, technical architecture, implementation planning, work breakdown, agents, file ownership, sequencing, executable test design, technical adversarial review, repair, regression, CI, performance, packaging, and release engineering.
- A Work-suggested WP, test case, agent roster, sequence, architecture, or technical method is not an Engineering mandate.
- Full beginning-to-post-goal mobile play is an Owner-accepted Creative requirement. PWA/native/wrapper architecture, entitlement implementation, store packaging, technical device strategy, and release engineering remain Forge-owned; commercial selection and Public Release remain Owner gates.

### CURRENT CLAIM

Source/version identity and authority-resolution audit: PASS.  
Project-direction transition execution / aggregate `source_transition` gate: BLOCKED — legacy-preservation Owner boundary, current-product transition artifact, and transition Evidence are not yet available.  
New product completion: NOT IMPLEMENTED / NOT VERIFIED.  
Public release: NOT AUTHORIZED.

## 2. State-label contract

| Label | Meaning |
|---|---|
| FACT | directly verified evidence |
| OWNER ACCEPTED | explicit Sakiya decision |
| ACCEPTED CORE | fixed by current adopted project direction |
| WORK RECOMMENDED | Creative proposal or non-binding Engineering recommendation; not Owner acceptance and not a Forge implementation mandate |
| HYPOTHESIS / TEST-DEPENDENT | retained only until named evidence exists |
| OPTION | compare without adoption |
| UNKNOWN | evidence absent or contradictory |
| OWNER DECISION NEEDED | only Sakiya may close |
| RISK | failure that may block a later gate |
| REQUIRED EVIDENCE | evidence needed to pass |

Migration labels are separate: KEEP, ADAPT, ARCHIVE, REMOVE FROM CURRENT DIRECTION, UNKNOWN.

## 3. Prompt-version resolution

The active contract now has a unique version and an explicit Engineering-authority correction:

| Source | Identity | Operational status |
|---|---|---|
| repository Work Prompt v1.2 | `docs/work/WORK_PROMPT_COMPLETE_GAME_FORGE_HANDOFF_v1.2.md`, blob `4b14c98ef5e247c03a71458c8cf56c9b64475139` | ACTIVE; highest operational handoff contract together with the Authority Contract |
| Forge Execution Authority Contract | `docs/work/FORGE_EXECUTION_AUTHORITY_CONTRACT.md`, blob `8bc028197ed8747cce62d28ac9cbc4e527bb82cc` | ACTIVE; controls Engineering-authority interpretation and overrides conflicting technical prescriptions |
| repository Work Prompt v1.1 | blob `8dfe9d9c99857b2b367ec509611c31bbac8a9f32` | LINEAGE; retain non-conflicting Creative and Test-Intent coverage detail only |
| uploaded pre-pause v1.1 | 1,958 lines, 42,482 bytes, SHA-256 `471757c8a0f3525a8d7b0dae8b7ddb5e3b37520c4120c8bc6b95b6805deee542` | LINEAGE; retain non-conflicting Creative and coverage detail only; it is not an execution contract |

Resolution: the v1.1 name collision is **CLOSED** by the unique v1.2 document. Neither v1.1 source may override v1.2 or the Authority Contract. If retained detail conflicts with either active document, it is superseded.

## 4. Operational authority and source order

### Active operational authority

Subject to Sakiya's final authority, Work Prompt v1.2 and the Forge Execution Authority Contract are the joint highest active operational contract for this completion/handoff. The Authority Contract controls any dispute about whether a statement binds Creative meaning, Test Intent, or Engineering execution.

| Classification | Binding effect | Examples |
|---|---|---|
| BINDING CREATIVE | Work / Studio define what the finished game must mean and show | Creative Intent, player-visible rules, Creative Invariants, failure conditions, completion scope, UI/audio/content obligations |
| BINDING TEST INTENT | Work / Studio define what must be proved and what player-visible failure means | proof obligations, evidence categories, forbidden outcomes, player-visible pass conditions |
| NON-BINDING ENGINEERING RECOMMENDATION | Forge may adopt, reorganize, merge, split, replace, or reject based on repository evidence and risk | WP names, agent roster, file ownership, sequence, architecture, test framework/case decomposition/counts, CI, technical review method, regression implementation, branch/commit procedure |

The current pointer files still contain a circular root priority list. Until that pointer defect is repaired, use this scope-specific reading order without allowing a pointer to outrank the decision it points to:

### Creative meaning

1. current explicit Sakiya decision;
2. Work Prompt v1.2 plus the Forge Execution Authority Contract for active operational classification;
3. Owner completion directive;
4. v0.7 Owner Decisions and fixed accepted core;
5. Foundation FIXED boundary where non-conflicting;
6. WORK-APPROVED docs/completion specifications, interpreted through v1.2 / the Authority Contract;
7. v0.7 / Foundation hypotheses and unknowns, retaining their labels;
8. v1.1 sources only for non-conflicting lineage, Creative detail, and Test-Intent coverage;
9. legacy material only as lineage, evidence, or anti-reference.

### Repository and technical fact

1. verified main HEAD and tree;
2. current code, build, tests, assets, and hosted-state evidence;
3. historical reports only for the legacy product.

Pointer files do not gain authority over the decisions they point to.

## 5. Source ledger

| ID | Source | Evidence | Role and limit |
|---|---|---|---|
| SRC-01 | current explicit instructions | execute after repository rewrite; design on the premise of mobile play | active authorization and Owner-accepted full-mobile Creative requirement |
| SRC-02 | OWNER_COMPLETION_TARGET_2026-08-27.md | blob 83c0300fbf06e96c19880837397b643776b1181f | Owner-accepted release-ready completion target |
| SRC-03 | CURRENT_CREATIVE_STATE.md | blob e0ba8a72934265d75f41eb839fc868e7e88fda34 | current / legacy pointer and authority correction; root priority remains circular |
| SRC-04 | v0.7 | blob b32210d45beaa27482694825b366ff4041951dcd | OD-01–05 and fixed core accepted; explicit hypotheses remain hypotheses |
| SRC-05 | Foundation Freeze | blob 164b06b2efd298ffe18a0d3d55195c54e849ca97 | validation boundary; header still says Candidate |
| SRC-06 | README.md | blob 0a67a1cfa02a25397d3b38ea79047b2f33682f31 | correct current direction and v1.2 / Authority pointers; root priority still needs normalization |
| SRC-07 | AGENTS.md | blob 7be62ef8206427ec0a3a53c092cabee94882d8e6 | current guardrails and explicit Forge-authority correction |
| SRC-08 | Work Prompt v1.2 | blob 4b14c98ef5e247c03a71458c8cf56c9b64475139 | active highest operational handoff contract; reclassifies v1.1 prescriptions |
| SRC-09 | legacy/README.md | blob 503a6a7d90f7a7fb26f77cf040c22fd7e9657b4a | lineage map |
| SRC-10 | IMPLEMENTATION_REPORT.md | blob 3d9b1f461e9516d460e75bbb80758fe701c2bd13 | legacy implementation evidence only |
| SRC-11 | FORGE_RETURN.yaml | blob 5b81390a38d1dcc280711aa827cd5ae930cad624 | legacy return only; current Creative PASS not implied |
| SRC-12 | design-qa.md | blob 726220bc5fcfcc028096de15fbed21d4ae17d449 | legacy QA only |
| SRC-13 | current code / assets / tests / hosted build | main tree at `69b36a6ac59f1fad8157cb7ceb46ba352c476710` | migration input, not new-product evidence |
| SRC-14 | Forge Execution Authority Contract | blob 8bc028197ed8747cce62d28ac9cbc4e527bb82cc | active highest authority for Engineering ownership and Work/Forge boundary |
| SRC-15 | repository Work Prompt v1.1 | blob 8dfe9d9c99857b2b367ec509611c31bbac8a9f32 | lineage plus non-conflicting Creative / Test-Intent coverage detail |
| SRC-16 | uploaded pre-pause Work Prompt v1.1 | SHA-256 471757c8a0f3525a8d7b0dae8b7ddb5e3b37520c4120c8bc6b95b6805deee542 | lineage plus non-conflicting Creative / coverage detail; never technical authority |
| SRC-OWNER-MOBILE-01 | current explicit SAKIYA mobile instruction | 2026-08-27: 「モバイルでのプレイを前提に設計してください。」 | highest current Creative/platform authority; OWNER ACCEPTED full beginning-to-post-goal mobile play; delivery architecture remains Forge-owned |

## 6. Current implementation evidence

| Area | Verified legacy behavior | Current-product interpretation |
|---|---|---|
| UI | Title, RUN, Result, Upgrade, Ending, Archive, Settings | remove old meaning; new inventory comes from 06 |
| core | seeded 1,000m RUN, combat, areas, bosses, loss/restart | direct creative conflict |
| relationship | aggregate listeners, LIVE, rank, comments, gifts | lacks named continuity, revisit, cohort, Personhood |
| economy | combat coins, gifts, rank multipliers, combat upgrades | direct conflict; gift/rank emphasis is unsafe |
| save | local primary, backup, slots, export/import, normalization | pattern may be adapted under new namespace/schema |
| large numbers | JavaScript Number with bounded formatter | insufficient evidence for the target economy |
| audio | WebAudio buses, compressor, ducking, cooldown | infrastructure candidate; no accepted ENTRY CHIME |
| accessibility | motion, contrast, font, comments, frame rate, volume | partial foundation only |
| build / hosting | React/Vite, worker, Sites packaging | Forge audit decides keep/replace |
| PWA | manifest, service worker, app shell | metadata and cache are legacy; not offline progression |
| tests | legacy engine and worker tests | do not prove the current product |
| assets | old areas, enemies, bosses, items, RUN mockups | archive by default; reuse needs fit and rights review |
| hosted version | owner-only legacy runtime | preserve as lineage/rollback until migration decision |

## 7. Conflict matrix

| ID | Severity | State | Conflict | Resolution / handling |
|---|---|---|---|---|
| CON-00 | formerly HIGH | CLOSED | same v1.1 name identifies two prompt generations | unique Work Prompt v1.2 is active; both v1.1 documents are lineage/non-conflicting coverage only |
| CON-01 | BLOCKER for Canon clarity | OPEN | README / AGENTS / CURRENT root source order is circular | use the scope-specific reading above; repair pointers without changing underlying authority |
| CON-02 | formerly HIGH | CLOSED | Work-authored S/WP order could be read as a mandated Engineering sequence | v1.2 / Authority Contract make it reference coverage only; Forge owns actual dependency graph, decomposition, parallelization, and integration order |
| CON-03 | formerly HIGH | CLOSED | Creative migration labels and technical replacement actions were mixed | Work classifies Creative direction as KEEP/ADAPT/ARCHIVE/REMOVE/UNKNOWN; Forge independently decides technical reuse/replacement after repository audit |
| CON-04 | BLOCKER for implementation | OPEN | runtime is the old RUN game | preserve lineage; Forge audits infrastructure and determines the safe technical migration plan |
| CON-05 | HIGH | OPEN | legacy reports contain positive PASS wording | add superseded banners; never ingest as current evidence |
| CON-06 | HIGH | OPEN | Foundation is prioritized but header remains Candidate | use fixed/test boundary; do not promote hypotheses |
| CON-07 | HIGH | OPEN | Flavor exposure is 698 in v0.7 and 712 in Foundation; `content unit`, `surface payload`, and `novel exposure` are not defined as the same quantity | retain both as TEST-DEPENDENT; 08 defines separate counting units and requires a two-way inventory reconciliation before adoption |
| CON-08 | HIGH | OPEN | first-30-minute BP3 conflicts with L1 2h / 40-minute BP average | Test Intent requires resolution; Forge chooses executable simulation/test method; no silent timing claim |
| CON-09 | HIGH | OPEN | old save semantics cannot map safely to new progress | Forge audits schema; safe default is a new namespace/schema and separate legacy preservation |
| CON-10 | HIGH | OPEN | existing hosted identity is legacy | preserve rollback; no overwrite before migration evidence and deployment gate |
| CON-11 | formerly BLOCKER for authority | CLOSED | v1.1 could be read as binding exact WPs, agents, architecture, tests, CI, review schedule, or commit procedure | Authority Contract reclassifies those items as NON-BINDING ENGINEERING RECOMMENDATION and assigns their actual design to Forge |

## 8. Project Direction Transition Decision

| Target | Classification | Creative decision |
|---|---|---|
| Work Prompt v1.2 | KEEP | active highest operational handoff contract |
| Forge Execution Authority Contract | KEEP | active highest Engineering-authority interpretation |
| repository Work Prompt v1.1 | ARCHIVE | lineage; reuse only non-conflicting Creative and Test-Intent detail |
| uploaded pre-pause Work Prompt v1.1 | ARCHIVE | lineage; reuse only non-conflicting Creative and coverage detail |
| Work-suggested WPs, agents, file ownership, technical sequence, exact tests, architecture, CI, review and commit methods | ADAPT | coverage/risk references only; Forge independently chooses the implementation |
| old move / fight / lose / upgrade RUN loop | REMOVE FROM CURRENT DIRECTION | archive lineage; never current core |
| combat, enemies, bosses, areas, old FEVER script | REMOVE FROM CURRENT DIRECTION | no automatic reuse |
| old screen semantics | REMOVE FROM CURRENT DIRECTION | new screen inventory replaces them |
| responsive layout patterns | ADAPT | only if they satisfy 06 and 09 |
| save / backup / slots / export-import pattern | ADAPT | new domain, namespace, recovery and migration |
| old save data | UNKNOWN | recommended: legacy-only preservation, no semantic conversion |
| audio buses / compressor / ducking / cooldown | ADAPT | technical candidate; current audio grammar replaces content |
| combat music / SFX | ARCHIVE | not final current audio |
| accessibility settings | ADAPT | extend to current full contract |
| generic Sites worker / packaging | KEEP | subject to technical audit |
| current React / Vite architecture | UNKNOWN | Forge Authority; Work does not prescribe keep/replace |
| service worker / PWA shell | ADAPT | new cache, update, offline behavior |
| legacy manifest / product metadata / icons | REMOVE FROM CURRENT DIRECTION | replace after platform and art gates |
| test runner / generic worker tests | KEEP | infrastructure only |
| legacy game tests | ARCHIVE | old-product regression only |
| deterministic simulation patterns | ADAPT | use only if technically appropriate |
| legacy visual assets | ARCHIVE | reuse remains UNKNOWN until art and rights review |
| current Sakiya assets | UNKNOWN | canonical visual and rights evidence required |
| README current direction | KEEP | correct |
| README source order | ADAPT | remove circularity |
| AGENTS guardrails and reporting truth | KEEP | correct |
| AGENTS order / taxonomy | ADAPT | align with this transition |
| CURRENT direction / legacy status | KEEP | correct |
| CURRENT priority / sequence | ADAPT | distinguish audit from mutation |
| old implementation reports and QA | ARCHIVE | add superseded status |
| owner-only legacy hosted version | ARCHIVE | retain rollback/playable lineage |

KEEP means migration preservation, not Creative acceptance. This table gives Creative transition direction; it does not bind Forge's technical reuse classification, architecture, or execution order.

## 9. Migration coverage obligations — Forge owns the sequence

The items below are coverage and proof obligations, not a mandatory WP list or execution order. Forge may merge, split, reorder, parallelize, or replace the technical method based on repository state, dependencies, and risk.

| Coverage obligation | Authority class |
|---|---|
| preserve an identified source commit, legacy save namespace, and owner-accessible legacy build/runtime consistent with the Owner gate | BINDING CREATIVE outcome; Forge-owned preservation method |
| retain the accepted Product Lock and Creative Invariants through migration | BINDING CREATIVE |
| obtain the Owner decision about legacy-runtime accessibility before an irreversible product/deployment choice | OWNER DECISION GATE |
| produce repository-backed backup, rollback, save, asset, test, and deployment evidence | BINDING TEST INTENT; Forge-owned implementation |
| prevent legacy PASS wording from being mistaken for current evidence | BINDING TEST INTENT; Forge-owned documentation method |
| isolate current-product save meaning from legacy save meaning unless honest migration is proved | BINDING CREATIVE / TEST INTENT; Forge-owned schema and migration method |
| replace the player-visible legacy product with the accepted current product | BINDING CREATIVE outcome; Forge-owned architecture and work breakdown |
| return fresh, reproducible current-product evidence and any relevant lineage regression evidence | BINDING TEST INTENT; Forge-owned test strategy |

## 10. Missing evidence

Before destructive migration:

- Owner decision on old playable-runtime accessibility;
- source tag / branch / archive plan;
- reproducible legacy build or rollback package;
- old-save compatibility decision;
- exact hosted version-to-source mapping;
- asset provenance;

Closed since the prior audit: a uniquely named active Work contract now exists as v1.2, and the Forge Execution Authority Contract explicitly resolves Engineering ownership.

Before P0:

- approved P0-FEEL event sequence and evaluation sheet;
- P0 economy contract and measurable Main Progression;
- executable A/B/C comparison contract;
- explicit SP1 exclusion from P0.

Before full production:

- this complete modular specification;
- P0-SIM and P0-FEEL results;
- Pareto decision;
- platform and commercial decision;
- rights matrix;
- canonical visual reference;
- current-product save / offline / large-number specification.

## 11. Owner gate

`ODG-01`: How accessible should the old playable runtime remain? `DECISION_REGISTER.md` is the canonical state/resolver/evidence record; this section is only its source-transition summary.

WORK RECOMMENDATION:

- preserve the legacy source/result commit;
- preserve the current owner-only hosted version or a distributable legacy build;
- preserve old saves under their old namespace;
- keep reports/assets/QA as legacy evidence;
- do not include an old-combat mode inside the new product;
- allow Forge to replace root product code after Forge has verified preservation/rollback and this Owner gate is answered.

Gain: clean new direction with full recoverability.  
Loss: old game is not a selectable mode inside the new product.

This does not block Creative specification. It blocks destructive code or deployment replacement.
