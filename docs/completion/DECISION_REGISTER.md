# DECISION REGISTER

Status: LIVE WORK REGISTER  
Source commit: 69b36a6ac59f1fad8157cb7ceb46ba352c476710  
Last integrated: 2026-08-27

This register prevents recommendations, hypotheses, test results, and Work-authored Engineering suggestions from silently becoming Canon or technical mandates. A decision changes state only with the authority and evidence named below.

## 1. Decision-state rules

| State | Meaning | May close it |
|---|---|---|
| OWNER ACCEPTED | explicit Sakiya decision in an authoritative source | Sakiya |
| ACCEPTED CORE | fixed by the adopted current direction | Sakiya; Work may only clarify |
| ACCEPTED OPERATIONAL | active authority/division contract for this completion and Forge handoff; not a new Owner Creative acceptance | Work Prompt v1.2 / Authority Contract or a later explicit Sakiya instruction |
| WORK RECOMMENDED | Creative proposal or non-binding Engineering recommendation | Sakiya or named Creative evidence gate; Forge independently decides Engineering method |
| TEST-DEPENDENT | candidates remain open until a named test | specified gate; Owner accepts creative result where required |
| UNKNOWN | evidence or definition is absent | named research, Forge return, or Owner |
| OWNER DECISION NEEDED | evidence cannot replace the required player-visible, commercial, rights, or release choice | SAKIYA only |
| REJECTED | conflicts with current creative invariants | Sakiya may reopen explicitly |
| SUPERSEDED | replaced but retained for lineage | later authoritative decision |
| WAIVED | defect accepted with scope, impact, expiry, and Owner approval | Sakiya only for HIGH; BLOCKER cannot be implicit |

## 2. Authority reclassification

Work Prompt v1.2 and `FORGE_EXECUTION_AUTHORITY_CONTRACT.md` are the active highest operational contract for this completion/handoff, subject to Sakiya Final authority. The Authority Contract governs any interpretation conflict about Engineering ownership.

| ID | Classification / decision | Status | Binding consequence |
|---|---|---|---|
| DAU-01 | Work Prompt v1.2 plus the Forge Execution Authority Contract are active; both v1.1 prompts are lineage/non-conflicting detail | ACCEPTED OPERATIONAL | v1.1 cannot override v1.2 or the Authority Contract; the version collision is CLOSED |
| DAU-02 | BINDING CREATIVE | ACCEPTED OPERATIONAL | Work / Studio bind Creative Intent, player-visible rules and specification, Creative Invariants/failure conditions, completion scope, UI hierarchy/information intent, audio/visual obligations, content/accessibility obligations, personhood/gift/monetization meaning, Scale/Prestige meaning, and tone |
| DAU-03 | BINDING TEST INTENT | ACCEPTED OPERATIONAL | Work / Studio bind what must be proved, forbidden outcomes, evidence categories, and player-visible pass/failure conditions |
| DAU-04 | NON-BINDING ENGINEERING RECOMMENDATION | ACCEPTED OPERATIONAL | Work-suggested WPs, agents, file ownership, parallelization, sequence, architecture, internal model/tick/RNG, exact test cases/layers/counts/framework, CI, technical review schedule/method, regression implementation, release engineering, and branch/commit procedure are coverage/risk references only |
| DAU-05 | Forge owns Engineering execution | ACCEPTED OPERATIONAL | Forge independently designs repository audit, technical migration/reuse, architecture, implementation/dependency/work breakdown, subagent plan, integration, test strategy and executable tests, simulation implementation, technical adversarial review, repair/regression, CI/build, performance, save/migration verification, release engineering, and verified commit/push workflow |
| DAU-06 | Creative-boundary changes return to Studio / Sakiya | ACCEPTED OPERATIONAL | Forge does not silently change North Star, player role, accepted activity meanings, player-visible rules, completion scope, UI/audio/visual/content/accessibility obligations, personhood/gift/monetization constraints, Scale/Prestige meaning, or tone |
| DAU-07 | README / AGENTS / CURRENT root-priority pointers remain circular | OPEN DOCUMENTATION CONFLICT | use the scoped source reading in `00_SOURCE_LEDGER_AND_TRANSITION.md`; pointers do not gain authority over their targets |

## 3. Owner Accepted / Accepted Core

| ID | Decision | Evidence / authority | Consequence |
|---|---|---|---|
| DAC-01 | Current product is 「八乙女さきや 活動者育成インクリメンタル」 | current README, AGENTS, Current Creative State, v0.7 | legacy RUN is not the current product |
| DAC-02 | North Star is 「一緒にデカくする。」 | v0.7 OD-01 and current direction | all systems and polish must preserve shared growth |
| DAC-03 | Participation evolves Presence → Co-creation → Shared Expansion | accepted core | player role and experience gates use this arc |
| DAC-04 | Player is an emotionally participating translator, not manager/god/operator/owner | accepted core | role-breaking UI and copy fail Creative Review |
| DAC-05 | Session / Asset Idle / Meta Incremental form the product structure | accepted core | activities cannot collapse into one idle counter |
| DAC-06 | Broadcast is Before / LIVE / After | v0.7 | each phase has a separate purpose; understood LIVE alone compresses |
| DAC-07 | People are not rarity, performance, labor, sacrifice, or paid power | current guardrails | person-gacha and paid relationship are BLOCKER defects |
| DAC-08 | Gifts are not the dominant or required route | current guardrails | zero-gift path is mandatory evidence |
| DAC-09 | The room remains the Activity Home | accepted core | later scale intrudes into rather than replaces it |
| DAC-10 | There are 24 Breakpoints and 10 Scale Peaks | v0.7 OD-04 | 34 Major Events; concepts remain distinct |
| DAC-11 | Scale Peak performs Semantic Retirement | accepted core | retired-unit live production stops; history remains |
| DAC-12 | Every accepted ENTRY CHIME use resolves to the exact same source asset | accepted invariant | trigger policy is separate; no variants, remix, pitch, layer, or finale imitation |
| DAC-13 | Activities include streaming, video, singing, music, SNS, and live event | v0.7 | each receives a distinct action/economy contract |
| DAC-14 | P0 compares A1–A3 × B1–B3 × C1–C3 | Foundation boundary | 27 configurations; no premature winner |
| DAC-15 | Creative PASS, Technical PASS, Sakiya Final Acceptance, Release-ready, and Public Release are separate | current direction | no PASS substitutes for another gate |
| DAC-16 | Public Release requires explicit Owner permission | Work contract | branch, preview, or deployable package is not release authorization |
| DAC-17 | The first external fictional-person arrival invokes the exact ENTRY CHIME once per save lineage | accepted first-five-minute experience | Binding Creative trigger; runtime asset/provenance/integration evidence is still missing |
| DAC-18 | Full beginning-to-post-goal play is mobile-first, with portrait/touch primary; desktop may also be full | `SRC-OWNER-MOBILE-01` / canonical `ODG-11` | Owner-accepted Binding Creative requirement; Forge owns delivery architecture/evidence and `ODG-09` retains the commercial route |

## 4. Work Recommended

| ID | Recommendation | Why | Acceptance route |
|---|---|---|---|
| DWR-01 | Main Progression is a conjunction of relationship, activity proof, provenance bridge, and new decision—not one currency | preserves different activities and moving bottlenecks | P0-SIM and long-run balance, then Owner review |
| DWR-02 | Absence/distance is reversible; permanent departure is excluded by default | preserves personhood and recovery | Owner decision ODG-03 |
| DWR-03 | SP1 occurs only after individual events and a simultaneous/stay-flow rule first change stream-level judgment | distinct from first arrival and BP1 | P0 evidence; no SP1 firing in P0 |
| DWR-04 | BP4–BP24 use the working slots in 05 | gives Forge a complete testable vision without false Canon | revise with P0/full-system evidence and Owner review |
| DWR-05 | U0–U10 working ontology ends in cosmic resonance | supplies semantic rather than numeric scale | Scale prototype and Owner review |
| DWR-06 | Main Completion is SP10 + stable U10 choice + final Anchor Broadcast + same real arrival/chime + retirement receipt | resolves the full emotional/system arc | Sakiya Final Acceptance |
| DWR-07 | Post-goal offers Continue and Strong New Game; no automatic U11 | preserves completion and replay without padding | Sakiya Final Acceptance |
| DWR-09 | Buy-to-play with no microtransactions or paid relationship path | aligns commercial model with personhood | Owner commercial decision |
| DWR-10 | Local-first save; no account, cloud, telemetry, or real-person ingestion by default | privacy, resilience, and scope clarity | technical/security review |
| DWR-11 | Minimum primary target is 44 × 44 CSS px, with keyboard/pointer/touch parity | mobile and accessibility safety | device/accessibility evidence |
| DWR-12 | Treat 919/1,200 authored-unit and 698/712 exposure figures as separate HYPOTHESIS candidates until unit definitions and coverage inventory reconcile | prevents a count from hiding missing activities/surfaces or multiplying production accidentally | content schema, top-down/bottom-up reconciliation, long-play test |
| DWR-15 | In addition to fixed `DAC-17`, permit ENTRY CHIME only for an adopted deliberately foregrounded named fictional-person arrival; never anonymous/bulk/offline/Scale output | protects the exact asset from notification spam without weakening the first-arrival anchor | P0/L6 60-minute fatigue and event-routing evidence; all later triggers, including Main Completion, remain Owner-conditional |
| DWR-13 | Preserve owner-only legacy source/runtime/save lineage, but do not ship an in-product legacy mode | rollback without creative contamination | Owner transition gate |
| DWR-14 | Final character production waits for one Owner-approved canonical Sakiya visual reference and rights record | avoids aesthetic drift and rights ambiguity | Owner visual gate |

## 5. Test-dependent decisions

The proof obligation and player-visible decision criteria below are BINDING TEST INTENT. Test framework, test-layer split, exact case decomposition, bots, fixtures, seed count, automation, CI, and technical execution order are Forge-owned. Any concrete method named below is a coverage reference, not a mandatory implementation structure.

| ID | Candidates | Required evidence | Decision owner |
|---|---|---|---|
| DTD-01 | A1 observe / A2 react / A3 comment | comparable evidence across the accepted 27-config creative space plus human-feel proof for role, recall, fatigue, and repeat desire; Pareto report | Work recommends; Sakiya accepts |
| DTD-02 | B1 constant / B2 shared recovering / B3 interest pools | no-wait, churn, revisit, bridge, dominance, and timing evidence using a Forge-chosen reproducible method | Work + Forge return; Sakiya accepts material feel |
| DTD-03 | C1 none / C2 shallow / C3 deep positive loop | convergence, limiter, strategy diversity, causality evidence | Work + Forge return |
| DTD-04 | first-30-minute milestone timing | P10/P50/P90/max for BP1–3, first Video, first Synergy; human pacing | Work Change Audit + Sakiya acceptance |
| DTD-05 | Broadcast ×1 / ×2 and later compression | event recall, fatigue, Shared Agency, loop budget | P0-FEEL then later playtest |
| DTD-06 | singing-first vs SNS-first growth order | activity distinction, choice value, route dominance | integrated system test |
| DTD-07 | approximately 100-hour Main Goal | long-run simulation, soak, content fatigue, human time samples | Sakiya |
| DTD-08 | final mobile delivery/store/entitlement combination | Forge compares repository-grounded full-mobile routes such as entitled installable PWA, native-store package, or shared core/wrapper; include offline/update/save, privacy/security, performance, support, fees, and rollback | Forge recommends technical route; SAKIYA accepts commercial/public promise through ODG-09 |
| DTD-09 | content production and novel-exposure counts | defined Package/Payload/Exposure units; layer/activity/state coverage; two-way inventory; long-play repetition | Work recommends; Sakiya accepts scope/language |

## 6. Unknown

| ID | Unknown | Required resolver | Safe default |
|---|---|---|---|
| DUN-01 | formal Main Progression bottleneck variables and coefficients | P0-SIM model and result | multi-proof contract only; no guessed coefficients |
| DUN-02 | formal SP1 trigger | P0 evidence | do not fire in P0 |
| DUN-03 | SP7 numeric trigger | U6/U7 prototype and long-run evidence | structural trigger contract only |
| DUN-04 | BP4–BP24 final names, thresholds, and order | integrated balance + creative review | use HYPOTHESIS slots |
| DUN-05 | Prestige count, formal names, and dedicated currencies | economy/scale implementation proposal | no universal Prestige currency |
| DUN-06 | final activity resource names | content/UI localization review | Working Names remain labeled |
| DUN-07 | accepted canonical Sakiya visual production reference | Owner-provided/approved reference and rights | no final character assets |
| DUN-08 | whether old saves have any safe semantic migration | Forge schema audit + Owner gate | preserve separately; no conversion |
| DUN-09 | current architecture/toolchain reuse | Forge technical audit | no Work architecture decision |
| DUN-10 | release date, price, store, entitlement, launch languages, public URL | completed evidence and Owner approval | no public action; full-mobile Creative requirement remains, but no unevidenced store/architecture claim |

## 7. Rejected

| ID | Rejected direction | Reason |
|---|---|---|
| DRJ-01 | old horizontal action / RUN / combat loop as current core | superseded product direction |
| DRJ-02 | player as manager, god, factory operator, or owner | breaks participation promise |
| DRJ-03 | listener rarity, performance gacha, labor, sacrifice, or paid affinity | breaks personhood |
| DRJ-04 | gifts as gate, fastest route, Automation key, or relationship purchase | breaks optionality and trust |
| DRJ-05 | one universal currency/resource/progress bar across activities | erases activity identity and decisions |
| DRJ-06 | waiting as the only action | breaks active incremental play |
| DRJ-07 | Prestige or Strong New Game deleting people/history/room/works | breaks continuity |
| DRJ-08 | Scale as only larger digits or renamed counter | breaks semantic scale |
| DRJ-09 | ENTRY CHIME variants or finale recreation | violates exact-source invariant |
| DRJ-10 | U11 as default post-goal padding | weakens completion meaning |
| DRJ-11 | unreviewed generated assets/text or placeholders as final | fails authorship, rights, and polish |
| DRJ-12 | evidence-free complete/release-ready/public claims | violates truth and release gates |

## 8. Superseded

| ID | Prior claim | Replacement | Notes |
|---|---|---|---|
| DSP-01 | legacy RUN game is the product | creator-incremental direction | preserve only as lineage/migration input |
| DSP-02 | legacy reports/tests prove current PASS | current-product Evidence Pack | old reports remain historical only |
| DSP-03 | 698 or 712 was treated as a settled first-play exposure count | neither is accepted until `Package`, `Payload`, and `Exposure` units are reconciled | 698→712 is +14 (+2.01%); L1 28→42 is +14 (+50%); both remain lineage candidates |
| DSP-04 | L1 Breakpoints are evenly spaced at ~40 minutes | first-30-minute distribution is test-dependent | original 2h layer budget remains hypothesis pending Change Audit |
| DSP-05 | two different documents named Work Prompt v1.1 | uniquely named repository Work Prompt v1.2 plus the Forge Execution Authority Contract are active | CLOSED: both v1.1 prompts are lineage/non-conflicting Creative and Test-Intent coverage detail only |

## 9. Canonical Owner Decision Gate register

This table is the single canonical store for every `ODG-*` question, state, safe default, resolver, required evidence, and acceptance authority. Summaries in other modules are navigation copies; any difference is a defect and does not create a second decision record. Do not ask SAKIYA to decide values that evidence can answer or technical methods assigned to Forge.

| ID | Decision / question | State | Safe default while open | Resolver / evidence / authority |
|---|---|---|---|---|
| ODG-01 | How accessible should the legacy playable runtime and old saves remain? | OWNER DECISION NEEDED | no destructive migration | Work recommendation: preserve owner-only playable/source/save lineage and do not place a legacy mode in the new product. Forge supplies preservation/rollback evidence; SAKIYA accepts the accessibility boundary. |
| ODG-02 | Which A1/A2/A3 LIVE-agency candidate best expresses participation? | TEST-DEPENDENT | test all candidates; adopt none | Comparable P0-SIM + P0-FEEL Pareto evidence across the accepted comparison space; Creative Review recommends from non-dominated candidates; SAKIYA accepts the player-visible choice. |
| ODG-03 | May a fictional person depart permanently? | OWNER DECISION NEEDED | no permanent deletion; use reversible distance/absence | Work recommendation: preserve reversibility and continuity. Creative Review presents player-visible gains/losses; SAKIYA accepts any permanent-departure Canon. |
| ODG-04 | Does approximately 100 hours remain the Main Goal target? | TEST-DEPENDENT | HYPOTHESIS | Forge returns long-run simulation/soak and human pacing/content-fatigue evidence; Creative Review recommends; SAKIYA accepts the player-visible duration target. |
| ODG-05 | What is the final SP1 trigger? | TEST-DEPENDENT | UNKNOWN; SP1 does not fire in P0 | Forge returns P0 proof that the trigger is distinct from first arrival and BP1 and represents a stream-level judgment change; Creative Review recommends; SAKIYA accepts the player-visible Canon. |
| ODG-06 | What is the final SP7 numeric/technical trigger? | TEST-DEPENDENT | UNKNOWN; retain only the structural U6→U7 contract | Forge proposes the technical threshold after U6/U7 proof; Creative Review checks the player-visible meaning; SAKIYA accepts any player-visible Canon. |
| ODG-07 | Which canonical Sakiya visual reference governs final production? | OWNER DECISION NEEDED | no final character production | Owner-supplied or comparison-set evidence must include rights/provenance and required expression/state coverage; SAKIYA approves one production reference and rights record. |
| ODG-08 | Are the proposed Main Completion and Strong New Game accepted, amended, or rejected? | OWNER DECISION NEEDED | proposed section 14 outcome is not Canon | Complete-arc, continuity, completion-feel, save/restart, and final-evidence review; Creative Review recommends; SAKIYA accepts or amends the player-visible ending/replay contract. |
| ODG-09 | What full-mobile commercial package, price/store arrangement, and additional supported surfaces ship? | OWNER DECISION NEEDED | no public listing | The package must satisfy SRC-OWNER-MOBILE-01/ODG-11 full-mobile play. Forge supplies PWA/native/shared-core alternatives plus entitlement, privacy/security, store, support, performance, offline/update/save and rollback evidence; SAKIYA accepts the commercial package. |
| ODG-10 | Is Public Release authorized? | OWNER DECISION NEEDED; GATE-BLOCKED | forbidden | Release-ready Gate G and every required Creative/Technical/rights/release evidence gate must pass first; only explicit SAKIYA authorization may permit Public Release Gate H. |
| ODG-11 | Must the complete product be playable on mobile, and what delivery boundary implements it? | OWNER ACCEPTED for full-mobile Creative requirement; Engineering/commercial route OPEN | full beginning-to-post-goal mobile play; mobile portrait/touch primary; no public distribution or cross-device-sync assumption | Current explicit SAKIYA instruction accepts mobile completeness. Forge compares PWA/native/shared-core delivery, entitlement, offline/update/save, privacy/security, performance, support and rollback; SAKIYA accepts commercial/store promise through ODG-09. |
| ODG-12 | Which launch language(s) are in scope? | OWNER DECISION NEEDED | UNKNOWN; no count-based completion claim | Content inventory, localization/QA, typography/accessibility, rights, cost, and schedule evidence must precede the production-count lock; SAKIYA accepts launch-language scope. |

## 10. Change audit contract

Every status change records:

- decision ID;
- old state/value;
- new state/value;
- source evidence;
- reason and player-visible consequence;
- authority/approver;
- affected modules/tests;
- required regression;
- date and commit.

Forge chooses the technical change-log, test, and regression implementation. No numeric balance change, acceptance-waiver, or Canon promotion is valid through an unlogged edit.
