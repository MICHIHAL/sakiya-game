# TEST STRATEGY AND QUALITY GATES

Status: WORK-APPROVED BINDING TEST INTENT + NON-BINDING COVERAGE REFERENCES / NO CURRENT-PRODUCT PASS CLAIM  
Source commit: 69b36a6ac59f1fad8157cb7ceb46ba352c476710  
Creative authority owner: SAKIYA STUDIO / Work  
Technical verification owner: Implementation Forge / Codex  
Final authority: SAKIYA

Governing source set:

- `SRC-OWNER-MOBILE-01` — current explicit SAKIYA instruction, 2026-08-27: 「モバイルでのプレイを前提に設計してください。」 — highest current Creative/platform authority; full beginning-to-post-goal mobile play is binding.
- `SRC-AUTH-01` — `docs/work/FORGE_EXECUTION_AUTHORITY_CONTRACT.md`, blob `8bc028197ed8747cce62d28ac9cbc4e527bb82cc` — active authority contract.
- `SRC-WORK-12` — `docs/work/WORK_PROMPT_COMPLETE_GAME_FORGE_HANDOFF_v1.2.md`, blob `4b14c98ef5e247c03a71458c8cf56c9b64475139` — active Work finalization prompt.
- `SRC-WORK-11-REPO` — repository v1.1, blob `8dfe9d9c99857b2b367ec509611c31bbac8a9f32` — superseded lineage.
- `SRC-WORK-11-UPLOAD` — uploaded pre-pause v1.1, SHA-256 `471757c8a0f3525a8d7b0dae8b7ddb5e3b37520c4120c8bc6b95b6805deee542` — superseded lineage; only stricter non-conflicting coverage detail may be retained.

## 1. Current validation status

The current repository contains specifications and a superseded legacy runtime. It does not contain a verified current-product P0, feature-complete build, release candidate, final audio assets, final rights ledger, or release package.

Therefore:

- this document defines test intent and evidence contracts;
- it does not claim that P0-SIM, P0-FEEL, Technical PASS, Creative PASS, SAKIYA Final Acceptance, or Release-ready has occurred;
- every product gate after the specification gate is currently `UNKNOWN` or `BLOCKED` until fresh evidence from an exact current-product artifact exists.

## 2. Quality model

| Layer | Question | PASS meaning |
|---|---|---|
| Q1 Core Integrity | Can the economy, save, and full journey function? | no softlock, save destruction, or unreachable Main Goal |
| Q2 Clarity | Can the player explain what happened and what can be chosen next? | causality, unit, state change, and next action remain legible |
| Q3 Feel | Do participation, revisit, acceleration, and bridges feel meaningful? | the North Star is enacted through visible action and response |
| Q4 Delight | Does the work contain authored, memorable contrast? | room, ENTRY CHIME, Flavor, activity identity, and Scale change do not become generic polish |
| Q5 Resilience | Does meaning survive duration, failure, settings, and devices? | save, offline, recovery, accessibility, and low-end behavior remain complete |
| Q6 Release Trust | Can a buyer trust the artifact and its claims? | rights, privacy, package, limitations, and rollback close with evidence |

Q1 alone is not commercial quality.

## 3. Authority boundary

- `C`: SAKIYA STUDIO defines Intended Experience and issues Creative verdicts from the exact artifact.
- `T`: Implementation Forge chooses test framework, code, CI, profiling method, load generation, and implementation, then issues an Engineering verdict.
- `O`: SAKIYA accepts creative decisions, waivers, the exact final artifact, and any public release action.
- `C/T` means distinct Creative and Technical authority verdicts/evidence are required. They may share a delivery package, but one verdict never implies the other.
- build success, logs, automated tests, or simulation cannot establish Creator Fidelity or Creative PASS.
- a Creative Reviewer cannot establish runtime correctness, data integrity, performance, security, technical accessibility conformance, or Release-ready.

`BINDING TEST INTENT` in this document is limited to what must be proven, the player-visible expected outcome, the forbidden/failure outcome, the required Evidence category, and any Creative Review PASS condition. Accepted player-visible numerical requirements retain the authority label of their originating Creative source.

`NON-BINDING ENGINEERING RECOMMENDATION` includes every exact Test/HP/Evidence ID, test layer, phase, scenario decomposition, fixture, seed/sample count, Bot, framework, automation, device/browser procedure, technical threshold, technical attack method, regression implementation, and execution order written below. Forge may combine, split, rename, replace, or add tests after repository audit, provided every binding proof obligation is demonstrably covered and no Creative Intent or player-visible specification is silently changed.

> **Suggested execution decomposition only. Implementation Forge may reorganize this work based on repository state, architecture, dependencies and risk.**

## 4. Completion claim ladder

1. Implemented
2. Automated checks passed
3. Runtime behavior checked
4. Visual and interaction checked
5. Engineering criteria verified
6. Creative Review completed
7. SAKIYA Final Acceptance
8. Release-ready
9. Publicly released
10. Post-release verified

`UNKNOWN`, `BLOCKED`, `SKIPPED`, and stale evidence do not count as PASS. A lower stage never implies a higher stage.

## 5. Binding proof fields and non-binding test-record template

For each obligation, the retained binding acceptance information is: purpose, player-visible result, forbidden result, Evidence category, and applicable Creative PASS condition. Forge must demonstrably cover those obligations; the form of its coverage index or report is Forge-owned.

The following is a `NON-BINDING ENGINEERING RECOMMENDATION` for a convenient executable or human test record, not a mandated schema:

- Test ID;
- purpose;
- authority owner;
- applicable phase;
- preconditions;
- scenario or player action;
- expected player-visible result;
- quantitative threshold or Creative PASS condition;
- forbidden outcome;
- required evidence;
- regression scope;
- failure severity;
- re-test condition.

Work defines visible intent, failure, and Evidence categories. Forge owns the executable schema, technical measurement details, case decomposition, and any platform-dependent numerical budget. Studio accepts any change to player-visible impact; Forge does not need Studio permission merely to use a better technical method.

The following values are `WORK RECOMMENDATION`, not current Source facts:

- a default of at least 1,000 seeds per P0 configuration and strategy;
- a formal P0-FEEL comparison population of at least 12 completed sessions;
- the 75% unaided-comprehension thresholds below;
- provisional cold-start, response, frame, and soak budgets.

Forge may adopt these values or replace them through its own Engineering strategy. Preregistration, confidence statements, tail-risk rationale, and rerun treatment are recommended robustness practices only; Forge owns the validity method and may use stronger alternatives. None of these Work-authored technical practices binds Forge.

## 6. Acceptance scenario catalog

The catalog is a `NON-BINDING ENGINEERING RECOMMENDATION` and coverage cross-reference. IDs, phase names, owners-in-the-row, preconditions, exact cases, seed/sample choices, thresholds identified as technical or `WORK RECOMMENDATION`, and regression/re-test decomposition are replaceable by Forge. The player-visible expected result, forbidden outcome, required Evidence category, and Creative PASS condition are the binding Test Intent where supported by the accepted Creative Specification. `TEST-DEPENDENT`, `UNKNOWN`, and `WORK RECOMMENDATION` values remain explicitly non-accepted.

**Binding Test Intent — Shared Agency and Sakiya independent intent across all activities and late Scale:** across Broadcast, Video, Singing, Music, SNS, Live/Event, their bridges, Automation, and late-Scale decisions, every consequential action must visibly derive from Sakiya's current intent, a previously accepted shared policy, or an explicit player-visible reason that no new input was sought. At representative checkpoints, the player must be able to explain what Sakiya wanted and what they contributed. Creative FAIL occurs if the player assigns activities, voice, or world strategy as Sakiya's manager while Sakiya is only a visual reactor. Exact checkpoints, case decomposition, observation method, samples, and technical implementation are Forge-owned.

**Binding Test Intent — zero-gift full-journey viability:** zero gifts must remain viable through every Main Progression and Scale path and through Main Completion, not only in P0 or the first two hours. Every accepted SP and completion state must be reachable within the accepted layer and Main Goal time-budget intent without hidden gifts, paid relief, or gift-dependent shortcuts. Required proof categories are paired long-duration economic/distribution Evidence plus human player-experience checkpoints or an explicitly accepted equivalent coverage basis. Exact simulation model, coefficients, samples, human protocol, acceleration, instrumentation, and case split are Forge-owned.

**Binding Test Intent — full-arc strategy health:** from the first state through every Main Progression/Scale path, accepted SP, and Main Completion, pool exhaustion or slow progress must still leave a meaningful action; no resource may cross a whole BP/Scale interval without affecting a choice/result or entering explicit Semantic Retirement; person churn, Video, gifts, or another route must not strictly or de facto near-dominate the meaningful alternatives. Required proof must expose tail and route behavior rather than only a successful optimizer. Regret, ablation, route share, sensitivity analysis, and similar techniques are non-binding examples; Forge owns the operational model, near-dominance criterion, thresholds, protocol, and tooling while Studio judges whether visible choices retain meaning.

**Binding Test Intent — mobile-first full-product path:** a player must be able to play the accepted experience from first entry through Main Completion and post-goal on supported mobile with touch, mobile-first information hierarchy, interruption/resume, durable save/update behavior, accessibility, and sufficient performance. No accepted activity, Scale state, decision, archive/history surface, Ending, credits, Continue, or Strong New Game may be desktop-only. A complete desktop build plus a mobile demo does not pass. PWA, native, hybrid, store, authentication, entitlement implementation, supported model/OS details, and Technical thresholds are Forge-owned; the commercial package and public promise remain an Owner Gate.

### 6.1 T0–T2: direction and P0

| ID | Phase / owner | Scenario and preconditions | Expected visible result | Threshold or Creative PASS | Forbidden outcome | Required evidence | Regression / severity / re-test |
|---|---|---|---|---|---|---|---|
| T0-DIR-01 | Transition / C+T | Build and open the exact current source, including its mobile entry, after the approved transition | creator-incremental room and participation entry on mobile, not the legacy RUN product | unlabeled legacy behavior 0 | combat, boss, RUN, legacy gift optimization, or demo-only mobile entry silently mixed into the current loop | E-SRC, E-BUILD, E-UI-STATE, E-MOBILE-FULL | root instructions, entry, runtime; BLOCKER; method Forge-owned |
| T1-SIM-01 | P0-SIM / T | Run A1–3 × B1–3 × C1–3 with every required strategy Bot and registered seed set | all 27 structures expose milestone, resource, strategy, and failure distributions | 27 configurations present; fixed seed/config/version rerun identical; default sample is WORK RECOMMENDATION ≥1,000 seeds per configuration and strategy unless Forge preregisters stronger statistical rationale | missing configuration, failed seeds discarded, averages without tails, post-result sample change | E-SIM-RAW, manifest, rerun hash | economy/RNG; BLOCKER; rerun complete matrix after change |
| T1-SIM-02 | P0-SIM / C+T | Measure revisit, regularization, first Video, and first synergy for every seed | early quiet remains while the first cross-activity loop emerges | revisit P50 5–8m/P90 ≤15m; regular P10 ≥8m, P50 12–15m, P90 ≤25m plus ≥2 Broadcasts/≥3 meaningful contacts; Video/synergy P50 20–30m/P90 ≤45m | regular given before person recognition, only mean reported | E-SIM-DIST | relationship/economy/timing; HIGH; rerun same and adjacent seeds |
| T1-SIM-03 | P0-SIM / C+T | Force gifts to zero through BP3 and first synergy | the same product remains playable without gifts | no softlock; first synergy P90 ≤45m; Creative multi-proof/time-budget intent is preserved; if Forge operational model, coefficients, or observability are absent, result is BLOCKED | hidden gift injection, paid wait relief, gift as sole bridge | E-SIM-NOGIFT | gift/milestone/bottleneck; BLOCKER; method Forge-owned |
| T1-SIM-04 | P0-SIM / C+T | Exhaust inflow pools, use high-frequency Broadcast, and include slow seeds | another meaningful action exists instead of a wait wall | manual Broadcasts between major BP: P90 ≤70/max ≤80; continuous wait 60s warning/180s FAIL; pool exhaustion still leaves a meaningful action | idle-only state or forced repetition | E-SIM-WAIT, action trace | pool/speed/Automation; HIGH; failure seeds and P90 rerun |
| T1-SIM-05 | P0-SIM / C+T | Compare person churn, Video-only, gift-heavy, Broadcast-heavy, and balanced strategies | no person or activity becomes a universal optimal route | person churn or Video fails if it Pareto-dominates every other legal strategy across all major objectives | rerolling high-performance people, universal Video multiplier, gift shortest path | E-SIM-PARETO | person generation/Video/gift; BLOCKER; full strategy comparison |
| T1-SIM-06 | P0-SIM / C+T | Trace every resource and bridge across BP intervals | bottlenecks and decisions change without dead resources | a resource is FAIL if it crosses one whole BP interval without affecting a choice, result, or explicit Semantic Retirement; no unbounded positive loop | decorative currency, retired economy still generating, unexplained bottleneck | E-SIM-FLOW | resource/bridge/BP; HIGH; affected and neighboring interval |
| T1-SIM-07 | P0 integration / C | Compare surviving candidates with P0-FEEL | candidates remain for distinct reasons | no single aggregate score; if only one survives, ESCALATE instead of auto-adoption | numeric winner declared Creative winner | E-SIM-PARETO, selection memo | evaluation axes; BLOCKER; repeat Pareto integration |
| T2-FEEL-01 | P0-FEEL / C | Counterbalanced A1/A2/A3 with the same 3–5m event script, ×1/×2, and exact four source perspectives | player says they participated, recalls a person/event, and has a relational or result-based reason for another Broadcast | pilot includes all four required perspectives; formal n≥12 and ≥75% unaided comprehension are WORK RECOMMENDATION; SAKIYA verdict is not overwritten by percentages | Builder explanation, leading question, different events per candidate | E-FEEL-REC, input/event log | Broadcast/UI/content; BLOCKER; exact-condition replay |
| T2-FEEL-02 | P0-FEEL / C | Quiet A stays/exits/revisits, active B contrasts, then causal CRITICAL | the same person returns and accumulated fit is understood | WORK RECOMMENDATION ≥75% identify same person and explain accumulated cause; repeated “weak/garbage/gacha/random jackpot” interpretation blocks the candidate | income rank, rarity, disposal, random-win framing | E-FEEL-PERSON, immediate speech | person state/CRITICAL/copy; BLOCKER; same people/order |
| T2-FEEL-03 | P0-FEEL / C+T | Prove the Binding first-lineage external-arrival trigger and compare it with a candidate late foreground Anchor arrival, with sound on and mute | the fixed first-arrival anchor remains recognizable, while any adopted later-trigger density does not create spam | first qualifying arrival invokes the canonical unchanged asset once; prohibited transformation/substitution 0; mute cue/history misses 0; packaged/runtime identity-proof technique is Forge-owned; WORK RECOMMENDATION ≥75% recognize the anchor | missing/replaced first trigger, deluxe/remix/substitute, every simulated external arrival automatically chiming, sound-only meaning | E-AUD-CHIME, E-FEEL-REC | fixed first trigger plus test-dependent later policy; BLOCKER; all approved trigger locations |
| T2-FEEL-04 | P0-FEEL / C | Ignore A2/A3 opportunities and observe A1 through repeated Broadcasts | optional participation does not become waiting, tapping, or command selection | LIVE input remains 0–2 per Broadcast; WORK RECOMMENDATION: candidate blocks if ≥25% call it waiting, grind, or correct command | silence penalty, HYPE tapping, Sakiya command | E-FEEL-REC | input/reward/timing; HIGH; candidate and adjacent candidate |

### 6.2 T3–T4: first 30 minutes through post-goal

The 10h/late checkpoint must cover the all-activity Shared Agency and Sakiya-independent-intent obligation above. Its exact execution remains Forge-owned.

| ID | Phase / owner | Scenario and preconditions | Expected visible result | Threshold or Creative PASS | Forbidden outcome | Required evidence | Regression / severity / re-test |
|---|---|---|---|---|---|---|---|
| T3-030-01 | First 30m / C+T | Fresh player on supported mobile/touch, no facilitator: profile named/skipped/anonymous → Broadcast → history → Video bridge, including interruption/resume | player begins, resumes, and recovers from uncertainty without instruction or mobile-navigation dead-end | facilitator intervention 0; critical dead-end 0; WORK RECOMMENDATION first meaningful choice ≤2m; back/help available | debug explanation, hover-only help, desktop detour, mobile demo boundary, instruction wall | E-JOURNEY-30, E-MOBILE-FULL | onboarding/navigation/mobile; BLOCKER; method Forge-owned |
| T3-030-02 | First 30m / C+T | Human plus simulation distribution for BP1–3, first Video, first bridge | a majority experiences the first cross-activity loop around 20–30m without deleting early quiet | Video/synergy P50 20–30m/P90 ≤45m; “all BP1–3 within 30m” remains BLOCKED until P0 resolves its conflict with the L1 average; 40m is not an equal-spacing Gate | shortening quiet only to satisfy a document line | E-SIM-DIST, E-JOURNEY-30 | BP/Video/timing; BLOCKER; rerun full early curve |
| T3-030-03 | First 30m / C+T | Compound route: 0 gift + mostly silent participation + Video-light play | relation, causality, and another meaningful action remain | hardlock 0; gift pressure 0; quiet person retains meaning; no universal Video requirement | gift/Video coercion, quiet person losing value | E-JOURNEY-HOSTILE | gift/person/Video; HIGH; compound route |
| T3-030-04 | First 30m / C | Exact mobile-first room, arrival, and first bridge surfaces at representative final-quality direction | UI, sound, touch response, and motion strengthen the cause and result | debug-only presentation, generic AI copy, dead control 0 on reviewed surfaces | presentation deferred wholesale to “later polish” or desktop treated as the only final-quality surface | E-UI-STATE, E-UI-VIEW, E-AUD-LISTEN, E-CREV | presentation/mobile; HIGH; exact artifact re-review |
| T4-2H-01 | 2h / C+T | Fresh supported-mobile path plus 0-gift checkpoint, with ordinary interruption/resume | cohort, archive, Video loop, touch flow, and continuity make the stream feel like a place | player explains BP1–3 and preserved relation history; forced wait/data loss 0; 2h/L1 timing itself remains HYPOTHESIS until accepted; SP1 not silently fixed | number-only progress, unapproved SP1 trigger, desktop-only recovery | E-JOURNEY-2H, E-SAVE-ROUNDTRIP, E-MOBILE-FULL | L1/economy/SP1/mobile; HIGH; method Forge-owned |
| T4-10H-01 | 10h / C+T | Continue one mobile save across short-daily and binge patterns, interruptions, speed, and Automation | understood work compresses; higher-order decisions and mobile continuity remain; consequential action visibly follows Sakiya intent, an accepted shared policy, or an explicit no-input reason | player can explain what Sakiya wanted and what they contributed; representative 20m Shared Agency ≥65% / pure management ≤15% is a replaceable WORK RECOMMENDATION; every activity is described with a different verb | player assigns activities, voice, or world strategy as manager while Sakiya only reacts; Automation leaves only management; progress depends on uninterrupted foreground play or desktop | E-JOURNEY-10H, E-AGENCY, E-MOBILE-FULL | Automation/activity/bridge/independent intent/mobile; HIGH; method Forge-owned |
| T4-LONG-01 | Feature complete / C+T | Mobile human checkpoints at every mechanic/Scale Transition plus full-arc strategy evidence and a paired zero-gift route | mobile touch, interruption/save continuity, bottleneck, activity verb, world meaning, viable action, resource meaning/retirement, and strategic choice change across L1–L6 | every accepted BP/SP/path has mobile reachability and strategy-health Evidence within accepted budgets; no wait-only state, dead resource, or strict/de facto near-dominance; no understood system disappears before comprehension | desktop-only system/Scale, mobile demo wall, gift-required path, idle-only wall, decorative live resource, near-monopoly, economic proof used as sole human evidence | E-LONG-SIM, E-LONG-NOGIFT, E-JOURNEY-LONG, E-MOBILE-FULL | progression/Scale/activity/gift/strategy/mobile; BLOCKER; method Forge-owned |
| T4-MAIN-01 | Main Goal / C+T+O | Fresh supported-mobile save through accepted Main Completion using player-available speeds, paired with zero-gift and full-arc strategy-health proof | Semantic Retirement, meaningful actions/alternatives, mobile continuity, same room, early history, Ending, credits, and zero-gift viability connect | Main Completion is reachable on mobile without gifts within the accepted Main Goal budget; full-arc Evidence exposes wait, dead-resource, churn, dominance/near-dominance, and route sensitivity; human end-to-end/equivalent and economic Evidence categories both exist | desktop handoff, mobile demo boundary, gift-required completion, wait wall, dead resource, de facto single route, console unlock, simulation-only Creative claim, erased history | E-LONG-SIM, E-LONG-NOGIFT, E-JOURNEY-MAIN, E-MOBILE-FULL, E-CREV, E-TVER | Main/Scale/save/content/gift/strategy/mobile; BLOCKER; method Forge-owned |
| T4-POST-01 | Post-goal / C+T+O | Enter Continue and Strong New Game on mobile from an exact completion save | profile, people, firsts, room, works, completion proof, touch access, and save continuity remain | retained-item loss 0; Continue does not invent U11; SNG does not reroll people for performance | relation as reset currency, completion dead end, desktop-only post-goal | E-POST, E-SAVE-ROUNDTRIP, E-MOBILE-FULL | completion/SNG/save/mobile; BLOCKER; method Forge-owned |

### 6.3 T5–T11: presentation, reliability, rights, and release

| ID | Phase / owner | Scenario and preconditions | Expected visible result | Threshold or Creative PASS | Forbidden outcome | Required evidence | Regression / severity / re-test |
|---|---|---|---|---|---|---|---|
| T5-UI-01 | Feature/RC / C+T | Traverse UI-00–20 mobile-first with real long data and new/save/migration/recovery/empty/loading/error/offline/locked states | current state, change, next touch action, and way back remain clear throughout the full product | missing screen/state/dead control 0 | debug panel, blank failure, desktop-only accepted screen, or demo-only mobile substitute | E-UI-STATE, E-MOBILE-FULL | UI/state/data/mobile; HIGH; method Forge-owned |
| T5-UI-02 | RC / C+T | 390×844, 430×932, 768×1024, 1366×768, 1920×1080, selected lower mobile viewport, long names, huge numbers, safe areas | mobile-first full-product decisions remain visible and touch-usable; larger surfaces retain the same meaning | text/number clipping 0; face and named-event overlap 0; hover-only information 0; pending choice survives rotation/interruption | any accepted information/action deleted or demo-gated on mobile | E-UI-VIEW, E-MOBILE-FULL | layout/content/touch; HIGH; method Forge-owned |
| T5-UI-03 | Feature/RC / C | Hide screen titles and compare activities and every Macro Layer | room and activity-specific verbs remain recognizable | first-time reviewer distinguishes Broadcast/Video/Singing/Music/SNS/Live-event without title; room recognized at every layer | equal card grid, generic glow, full cosmic replacement | E-UI-VIEW, E-CREV | art/layout/activity; HIGH; comparison review |
| T5-MOT-01 | Feature/RC / C+T | Play M0–M5 events in default and Reduced Motion | causal priority and meaning remain equivalent | critical event loss 0; travel/shake/zoom/particle dependence 0 in Reduced Motion | routine gain covering Anchor event | E-MOTION | motion/event priority; HIGH; both modes |
| T6-AUD-01 | Audio gates / C+T | Resolve the Binding first-lineage external-arrival use and every separately approved later ENTRY CHIME use through release evidence | the exact same unchanged source asset anchors the fixed first arrival and approved later foreground arrivals | first qualifying arrival fires once per lineage; unchanged packaged/runtime identity is proven by a Forge-selected mechanism; prohibited transformation/substitution 0; later trigger policy remains a separate TEST-DEPENDENT contract and does not mean all external arrivals | missing/replaced first trigger, remix, substitute, all-arrival spam, Scale fanfare use | E-AUD-CHIME | fixed first trigger plus test-dependent later policy; BLOCKER; every approved use |
| T6-AUD-02 | RC / C+T | Full listening of all activities, Prestige, ten SP packages, Main Completion on mobile speaker, headphones, desktop speaker | each activity/process and priority is identifiable | missing/placeholder/clipping/painful transient/priority collision 0; Forge owns technical loudness/dynamics budgets, while Studio judges only audible/player-visible Creative impact through listening | constant reward wall or undifferentiated L6 loudness | E-AUD-LISTEN | audio/music/event; HIGH; affected suite and neighbors |
| T6-AUD-03 | RC / C+T | One hour routine, autoplay/decode/load failure, mute, speed/pause churn, background/resume | no fatigue, duplicate burst, or lost critical meaning | fatigue HIGH 0; S0–S2 visual/caption/history parity 100%; duplicate/queued burst 0; failed asset is visible and recoverable | one cue per simulated unit, silent missing asset | E-AUD-FATIGUE | notification/load/resume; HIGH; one-hour and failure rerun |
| T7-SAVE-01 | P2/RC / T | Mobile new save, autosave, app/browser close, OS interruption, export/import if offered, supported migration, and update | profile, people, history, works, retirement, settings, and mobile continuity remain coherent | progress loss 0; logical round-trip equality; meaningful decision followed by mobile termination loses nothing | silent reset, incompatible overwrite, or desktop required for recovery | E-SAVE-ROUNDTRIP, E-MOBILE-FULL | save/state/economy/mobile; BLOCKER; method Forge-owned |
| T7-SAVE-02 | RC / T | Corrupted, truncated, out-of-range, huge-number, partial-write mobile save; recovery, failed/interrupted migration/update, and retry | old save remains and the recovery path is usable on mobile without desktop | unrecoverable loss 0; backup not overwritten; retry idempotent | delete-first migration, corrupted-primary backup overwrite, or desktop-only recovery | E-SAVE-RECOVERY, E-MOBILE-FULL | save/migration/update/mobile; BLOCKER; method Forge-owned |
| T7-SAVE-03 | RC / T | Mobile background/foreground, OS kill/low-memory termination, force quit/crash at meaningful choice, Prestige, Scale Peak, Main Completion, SNG, import/migration where offered; concurrency if architecture permits | each transaction and mobile resume is atomic or visibly recoverable | duplicate consequence 0; partial commit 0; idempotent resume; concurrency cannot silently fork/overwrite progress | double Prestige/SP, missing person/history, foreground-only save correctness | E-SAVE-ATOMIC, E-MOBILE-FULL | transaction/save/UI/mobile; BLOCKER; method Forge-owned |
| T7-OFF-01 | P2/RC / C+T | Mobile offline/background return at 0/near/max/beyond cap, forward/back clock, timezone anomaly, repeated relaunch/reconnect | mobile return summary separates elapsed time, contribution, cap, and anomalies | fabricated named-person event 0; double credit 0; clock punishment/save deletion 0 | unwitnessed relation progression, clock exploit explosion, or desktop required to recover | E-OFFLINE, E-MOBILE-FULL | offline/clock/save/mobile; BLOCKER; method Forge-owned |
| T7-OFF-02 | RC / T | Chosen mobile architecture under uncached/uninstalled state where relevant, installed/primed launch, mixed-version update, failed update, storage pressure/eviction/private mode where applicable | supported full-mobile mode starts or gives a recoverable explanation without split-version state | mixed-schema execution 0; background update starts Broadcast/accepts choice 0; double offline credit 0 | stale client with new data, silent storage loss, desktop-only recovery | E-OFFLINE-PWA, E-MOBILE-FULL | update/storage/mobile; BLOCKER; architecture/method Forge-owned |
| T8-INP-01 | P1/RC / C+T | Complete the full accepted mobile path touch-only; separately cover any promised keyboard/mouse path | every critical action from first entry through post-goal is touch-available with equivalent meaning | inaccessible critical action 0; visible focus where applicable; pause persistent; rapid tap/hover/precision gesture required 0 | touch dead end, desktop handoff, focus trap, hearing/color-only action | E-A11Y-INPUT, E-MOBILE-FULL | controls/UI/touch; HIGH; method Forge-owned |
| T8-A11Y-01 | P1/RC / C+T | 200% zoom, max text, high contrast, all notation modes | action/result/back and exact units remain readable | core flows need no two-dimensional page scroll; important targets aim 44×44 CSS px; controls below 24×24 require documented valid exception/equivalent; color-only state 0 | truncated unit or abbreviation-only meaning | E-A11Y-VISUAL | typography/UI/content; HIGH; all core screens |
| T8-A11Y-02 | P1/RC / C+T | Compound mobile portrait route: max text + 200% + high contrast + Reduced Motion + mute + captions + slow reading | critical events and choices retain equivalent meaning | S0–S2 parity 100%; important text does not expire while focused/paused; creative time limits extend/pause/disable | settings conflict or inaccessible lower sheet | E-A11Y-COMBINED | motion/audio/timing/layout; HIGH; combined route |
| T8-A11Y-03 | RC / T | Inspect semantic names, roles, focus order/restore, live-region/event announcement, and an actual screen reader on each claimed supported platform class | core state and critical event can be understood without visual inference | unlabeled critical control 0; lost focus 0; duplicate/unbounded announcement 0; screen-reader result or explicit Owner-approved support limitation required | automated scan alone used as PASS | E-A11Y-SR | DOM/UI/content; HIGH; real assistive-tech rerun |
| T8-DEV-01 | RC / T | Prove the full beginning-to-post-goal product on Forge-selected supported mobile model/OS classes, plus any separately promised desktop surface | each supported mobile surface delivers full scope, touch, interruption/save continuity, and truthful limitations | claimed full-mobile matrix complete under Forge-selected criteria; model/OS/build/settings recorded by Forge's chosen method | mobile demo counted as full support, desktop completion required, current flagship or one runtime used to justify every claim | E-DEVICE, E-MOBILE-FULL | release target/UI/performance/mobile; BLOCKER; method Forge-owned |
| T9-PERF-01 | RC / C+T | Forge-selected lower supported physical mobile device: start, navigation/touch response, interruption/resume, asset failure, huge-number/event burst | immediate feedback and no lost important event throughout the full mobile product | numeric criteria are Forge-owned; WORK RECOMMENDATION defaults remain non-binding | desktop performance substituted, budget invented to excuse unusable mobile behavior, or missing criterion marked PASS | E-PERF, E-MOBILE-FULL | runtime/assets/UI/mobile; HIGH; method Forge-owned |
| T9-SOAK-01 | RC / T | Sustained supported-mobile use with background/resume, thermal/battery observation, event burst, save/update stress, plus full-arc journey coverage | no crash, silent error, material leak, audio burst, save damage, or mobile-only collapse | exact duration/memory/thermal/battery criteria Forge-owned; crash/data loss/unhandled visible error 0 | desktop or simulator used as sole full-mobile resilience proof | E-SOAK, E-MOBILE-FULL | runtime/save/audio/large-number/mobile; BLOCKER; method Forge-owned |
| T10-CNT-01 | Content complete / C+T+O | Audit content-unit definition, manifest, layer/type/status, and exposure measurement | the authored body has known units and traceable coverage | 1,200 pool and 698/712 exposure values all remain TEST-DEPENDENT until “content unit” and “novel exposure” are operationally defined and long-play tested; none is promoted by count alone | 712 silently recommended as accepted, noun-swap count inflation, UNKNOWN Sakiya line shipped | E-CONTENT-MANIFEST | content definition/pool/status; HIGH; full manifest after definition lock |
| T10-CNT-02 | Content complete/RC / C+T | Sample normal, 0-gift, silent, Video-light, long-offline, high-speed, and post-goal for 60m/10h | each layer keeps a distinct problem engine without fatigue | Anchor repeated as new 0/60m; same syntax skeleton three visible times in sequence 0; ten-hour layer identity remains; exact statistical selector threshold proposed by Forge | self-deification, generic AI filler, same huge-number joke | E-CONTENT-SAMPLE, E-CREV | copy/selector/cooldown; HIGH; same and adjacent variants |
| T10-CNT-03 | RC / C+T | Check 24 BP, 10 SP, Ending, Help, Credits, recovery copy, and archive | cause, world response, and record exist where promised | BP uses ≥4 response surfaces; SP uses all 6 or records intentional omission; raw key/placeholder/missing text/private name/contradictory unit 0; only OWNER ORIGINAL/OWNER ACCEPTED Sakiya lines ship | AI proposal presented as official wording | E-CONTENT-COVERAGE | events/content/status; BLOCKER; all major events |
| T11-RGT-01 | Asset lock/RC / C+T+O | Compare exact packaged artifact plus store screenshots, trailer, copy, and credits to per-path/hash provenance | every public and shipped surface has commercial scope, attribution, and replacement route | UNKNOWN or unapproved public/commercial scope 0 | fan art/listener/platform imitation without permission | E-RIGHTS | asset/package/store; BLOCKER; every changed asset/public surface |
| T11-RGT-02 | RC / C+T+O | Withdraw or remap a consented real-person surface in a test fixture | removal does not break save, economy, or archive integrity | identity removed/remapped from every approved surface; progress retained | consent bundled with participation or withdrawal deleting progress | E-RIGHTS-WITHDRAW | identity/content/save; BLOCKER; all mapped surfaces |
| T11-PRV-01 | RC / T+O | Capture network/log behavior on first run, play, error, update, offline; inspect export and reset-local-data | local-first profile with no hidden upload or needless permission | unexpected network/profile upload 0; telemetry default off; free-text excluded from logs; export warning and local reset verified | hidden analytics, microphone/camera/contacts/location request | E-PRIVACY | data/network/log; BLOCKER; final build |
| T11-ENT-01 | Business/Release / C+T+O | Prove the Owner-approved commercial package and actual full-mobile access boundary across every promised path; PWA/native/auth/entitlement attack method Forge-owned | full beginning-to-post-goal mobile access and public copy match the commercial promise | full-mobile Creative scope fixed; commercial package Owner decision exists; Forge proves its chosen entitlement/security/privacy design | desktop full plus mobile demo, paid promise contradicted by unentitled public full access, or save state minting entitlement | E-ENTITLEMENT, E-MOBILE-FULL | distribution/access/copy/mobile; BLOCKER; method Forge-owned |
| T11-REL-01 | Release Gate / C+T+O | Build/install/launch/update/remove the chosen full-mobile distribution where applicable and verify integrity/system requirements/public assets | accepted mobile-capable package/access surface and public claims identify the same full product | exact release-engineering method Forge-owned; required credits/privacy/licenses/notes/limitations/support complete | build-success-only claim, different-build public assets, desktop-only package presented as completion, or mobile demo-only release | E-RELEASE, E-MOBILE-FULL | build/config/package/mobile; BLOCKER; method Forge-owned |
| T11-RBK-01 | Release Gate / T+O | Rehearse bad update, failed migration, rollback, old-save restore, and smoke test | previous known-good artifact and data recover in practice | rollback rehearsal PASS with version mapping, package hash, restore proof, and owner-visible steps | package existence without recovery rehearsal | E-ROLLBACK | update/deploy/save; BLOCKER; each RC |

### 6.4 Gate I: post-release verification

**Binding Test Intent:** after an explicitly authorized Gate H action, fresh Evidence must establish the identity and usable state of the deployed full-mobile product, mobile launch/access path, existing-save continuity, update behavior, public copy, privacy surface, support route, and current monitoring/error outcome. FAIL includes desktop-only/mobile-demo deployment, wrong artifact or entitlement, inaccessible promised mobile path, save loss, unsafe update, misleading public copy, undisclosed data flow, missing support route, or an observed non-waivable defect left in a false “released” state. This obligation activates only after Gate H; deployment, smoke, monitoring, containment, and recovery methods are Forge-owned.

| ID | Phase / owner | Scenario and preconditions | Expected visible result | Threshold or Creative PASS | Forbidden outcome | Required evidence | Regression / severity / re-test |
|---|---|---|---|---|---|---|---|
| T11-POSTREL-01 | Gate I / C+T+O | Observe the authorized deployed full-mobile product and its actual access/save/update/public/support surfaces | the public mobile product and promise are usable, coherent, recoverable, and truthful | binding Gate I proof subjects above are satisfied; all technical thresholds and case decomposition Forge-owned | any listed Gate I failure or inferred Owner approval | E-POSTRELEASE, E-MOBILE-FULL | deployed mobile/access/save/update/copy/privacy/support; BLOCKER; method Forge-owned |

## 7. Non-binding compound hostile-path coverage reference

The compound risks and forbidden outcomes are binding coverage obligations. `HP-*` grouping, required-test mapping, route construction, tools, and execution order are Forge-owned and replaceable.

| ID | Compound route | Required tests |
|---|---|---|
| HP-01 | 0 gift + mostly silent + Video-light | T1-SIM-03/05, T3-030-03, T10-CNT-02 |
| HP-02 | max text + 200% zoom + high contrast + Reduced Motion + mute + mobile portrait | T5-UI-02, T8-A11Y-01/02/03, T8-DEV-01 |
| HP-03 | speed/pause churn + rotation + background/resume during pending choice | T5-UI-02, T6-AUD-03, T7-SAVE-03, T9-SOAK-01 |
| HP-04 | long offline + clock anomaly + update/reconnect | T7-OFF-01/02, T7-SAVE-02 |
| HP-05 | force quit during Prestige, Scale, Main Completion, SNG, import, and migration | T7-SAVE-02/03, T4-MAIN-01, T4-POST-01 |
| HP-06 | mixed old/new PWA cache + storage eviction/private mode + repeated resume | T7-OFF-02, T11-REL-01 |
| HP-07 | short daily sessions versus one long binge on the same progression range | T4-10H-01, T7-SAVE-01, T10-CNT-02 |
| HP-08 | person churn + gift-heavy + Video-only optimizer | T1-SIM-05/06 |
| HP-09 | extreme huge numbers + event burst + low-end physical device | T5-UI-02, T9-PERF-01, T9-SOAK-01 |
| HP-10 | outsider who knows neither Sakiya nor streaming culture | T2-FEEL-01, T3-030-01, AR outsider lens |
| HP-11 | full mobile journey + touch-only + repeated interruption/OS termination + storage pressure + lower supported performance | T3-030-01/04, T4-2H/10H/LONG/MAIN/POST, T7-SAVE/OFF, T8-INP/DEV, T9-PERF/SOAK, T11-ENT/REL/POSTREL |

## 8. Binding long-play proof obligations; methods replaceable

- deterministic accelerated simulation and human play are separate evidence classes;
- at least 2h, 10h, every mechanic/Scale transition, Main Goal, and post-goal require human evidence or an explicitly approved equivalent coverage map;
- a complete human journey is the default requirement for Main Goal acceptance;
- beginning-to-post-goal mobile play, touch, interruption/resume, save/update continuity, and mobile performance must be represented; desktop completion plus a mobile demo is never equivalent coverage;
- short-daily, binge, and long-offline patterns must be represented;
- simulation cannot establish fatigue, comprehension, delight, Creator Fidelity, or audio/visual quality;
- human play cannot replace tail-distribution, seed, precision, or long-state simulation.

## 9. Binding baseline protection; regression implementation Forge-owned

Once accepted, these outcome/evidence categories must remain protected against regression. Forge owns baseline storage, test code, tooling, selection, and rerun implementation:

- milestone P10/P50/P90 and manual Broadcast distributions;
- accepted A1/A2/A3 event script and human evidence;
- visual state, hierarchy, overflow, and interaction outcomes across every promised surface;
- ENTRY CHIME perceptual/source identity separately from its accepted trigger behavior;
- audio identity, no-audio information equivalence, failure recovery, and sustained-use fatigue outcome;
- save continuity, transaction integrity, migration/recovery, offline, update, and cache-mixing outcomes;
- keyboard/touch/mouse, screen-reader, 200% text, and compound accessibility behavior;
- accepted player-visible performance and promised-device support outcomes;
- content-unit meaning, repetition control, and major-event coverage outcomes;
- rights/provenance, public-promise, entitlement, package identity, and demonstrated rollback outcomes.

Any changed accepted numerical baseline must remain auditable to its old value, new value, reason, authority, and fresh proof. The exact record format, percentage calculation where inapplicable, and re-test decomposition are Forge-owned.
