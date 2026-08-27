# ACCEPTANCE EVIDENCE MATRIX

Status: WORK-APPROVED BINDING EVIDENCE CATEGORIES + NON-BINDING CAPTURE REFERENCE / EVIDENCE NOT YET PRODUCED  
Source commit: 69b36a6ac59f1fad8157cb7ceb46ba352c476710  
Creative authority owner: SAKIYA STUDIO / Work  
Technical evidence owner: Implementation Forge / Codex  
Final authority: SAKIYA

Governing source set:

- `SRC-OWNER-MOBILE-01` — current explicit SAKIYA instruction, 2026-08-27: 「モバイルでのプレイを前提に設計してください。」 — highest current Creative/platform authority; full beginning-to-post-goal mobile play is binding.
- `SRC-AUTH-01` — `docs/work/FORGE_EXECUTION_AUTHORITY_CONTRACT.md`, blob `8bc028197ed8747cce62d28ac9cbc4e527bb82cc` — active authority contract.
- `SRC-WORK-12` — `docs/work/WORK_PROMPT_COMPLETE_GAME_FORGE_HANDOFF_v1.2.md`, blob `4b14c98ef5e247c03a71458c8cf56c9b64475139` — active Work finalization prompt.
- `SRC-WORK-11-REPO` — repository v1.1, blob `8dfe9d9c99857b2b367ec509611c31bbac8a9f32` — superseded lineage.
- `SRC-WORK-11-UPLOAD` — uploaded pre-pause v1.1, SHA-256 `471757c8a0f3525a8d7b0dae8b7ddb5e3b37520c4120c8bc6b95b6805deee542` — superseded lineage; only stricter non-conflicting coverage detail may be retained.

## 1. Current evidence verdict

This document defines what future evidence must contain. Current specifications, legacy implementation reports, plans, and checklists are not evidence that the current creator-incremental product passes.

At current state:

- P0-SIM evidence: `MISSING`;
- P0-FEEL evidence: `MISSING`;
- current-product build/runtime evidence: `MISSING`;
- full beginning-to-post-goal mobile, touch/interruption/save/performance, real-device, accessibility, audio, offline, long-play, rights, package, and rollback evidence: `MISSING`;
- post-release verification evidence: `NOT APPLICABLE BEFORE GATE H`; after an authorized deployment it remains `MISSING` until Gate I proof exists;
- Creative PASS, Technical PASS, SAKIYA Final Acceptance, and Release-ready: `NOT ESTABLISHED`.

Authority classification:

- `BINDING ACCEPTANCE INTENT`: the Evidence categories that must exist, the player-visible or authority-visible proof obligation, exact-artifact identity, separation of Creative/Technical/Owner evidence, invalid-evidence rules, and truthful `MISSING/BLOCKED/UNKNOWN/STALE` handling.
- `NON-BINDING ENGINEERING RECOMMENDATION`: every `E-*` ID, file/field schema, log or recording format, capture tool, command, seed/fixture layout, exact device procedure, technical sample/duration/threshold, storage layout, and mapping to `T-*` IDs.
- Forge may combine, split, rename, replace, or add Evidence artifacts and capture methods. Its Evidence set must still prove every binding obligation against the exact product artifact and expose missing or contradictory proof; no particular index or mapping artifact is mandated.

> **Suggested execution decomposition only. Implementation Forge may reorganize this work based on repository state, architecture, dependencies and risk.**

## 2. Binding evidence identity; non-binding packet schema

Every accepted Evidence item must identify the exact artifact and criterion, distinguish expected from observed, state its authority and result, and expose missing/invalidated scope. The following fields are a `NON-BINDING ENGINEERING RECOMMENDATION` for achieving that traceability:

- Evidence ID;
- criterion and Test ID;
- exact repository, branch, and commit;
- exact build, package, content set, or asset hash;
- date, operator, reviewer/verifier, and authority class;
- environment, device model, OS/browser/runtime version, viewport, input, and settings;
- preconditions, seed, strategy, save fixture, and content version where applicable;
- exact scenario and reproduction;
- expected, observed, result, and confidence/measurement uncertainty where applicable;
- raw artifact path: dataset, log, recording, screenshot, trace, save, manifest, or report;
- skipped, missing, blocked, or invalidated evidence;
- linked finding and repair commit;
- regression result and closure authority;
- retention location and stale-evidence rule.

Evidence is tied to the exact artifact. A code, content, asset, configuration, entitlement, or accepted baseline change invalidates affected evidence until the affected obligation is freshly proven. Forge owns invalidation automation and regression implementation.

## 3. Evidence category ledger — binding obligations, replaceable capture recipes

In the table, `Contents` names the binding Evidence category and its proof subject. `Minimum evidence` describes a strong but replaceable capture recipe unless another accepted Creative or Owner source explicitly fixes a visible requirement. `Evidence ID`, exact file form, duration, configuration count, seed arrangement, tool, and gate mapping are coverage handles, not mandated Engineering structure. Forge may substitute equivalent or stronger proof; the obligation is demonstrable coverage, not a prescribed mapping document.

| Evidence ID | Contents | Minimum evidence | Required gate | Not sufficient |
|---|---|---|---|---|
| E-SRC | source and transition identity | current `SRC-OWNER-MOBILE-01` full-mobile instruction; baseline commit `69b36a6ac59f1fad8157cb7ceb46ba352c476710`; active v1.2 blob `4b14c98ef5e247c03a71458c8cf56c9b64475139`; authority-contract blob `8bc028197ed8747cce62d28ac9cbc4e527bb82cc`; repository v1.1 blob `8dfe9d9c99857b2b367ec509611c31bbac8a9f32` and uploaded SHA-256 `471757c8a0f3525a8d7b0dae8b7ddb5e3b37520c4120c8bc6b95b6805deee542` as lineage; version collision CLOSED and circular root pointers OPEN | T0 / Gate A | filename, old report, or README alone |
| E-BUILD | build evidence | clean environment, exact command, dependency lock, output log, artifact hash, reproduction | Gate D/G | “build succeeded” in prose |
| E-SIM-RAW | simulation dataset | all 27 configs, strategy IDs, registered seeds, raw rows, failure rows, version | P0-SIM | chart or aggregate only |
| E-SIM-DIST | milestone/tail distributions | P10/P50/P90/max, denominators, censored/failed runs, confidence rationale | P0-SIM / first 30m | P50 alone |
| E-SIM-PARETO | strategy comparison | objective definitions, frontier, dominated cases, rejected candidates, no aggregate-score selection | Gate B | one ranked score |
| E-SIM-NOGIFT | no-gift route | zero-gift fixture, full milestone/timing output, bottleneck and failure rows | Gate B | one successful seed |
| E-SIM-WAIT | wait/manual burden | continuous inactive intervals, action alternatives, manual Broadcast distribution, pool exhaustion cases | Gate B | total playtime only |
| E-SIM-FLOW | resource/bottleneck trace | per-resource sources/sinks/contribution, BP intervals, retirement, positive-loop and dead-resource results | Gate B | currency list |
| E-FEEL-REC | human creative probe | exact build, counterbalanced candidate, unedited recording, event/input log, immediate response, audience lens | P0-FEEL | Builder demonstration or delayed survey only |
| E-FEEL-PERSON | Personhood/CRITICAL probe | same-person fixture, quiet/active contrast, before/after cause evidence, verbatim immediate interpretation | Gate B/E | relationship statistics alone |
| E-JOURNEY-30 | first 30 minutes | fresh supported-mobile/touch player, interruption/resume, intervention count, timestamps, save, immediate comprehension | Gate C1 | desktop run or mobile demo alone |
| E-JOURNEY-HOSTILE | compound early route | 0-gift+silent+Video-light unedited path, decisions, dead ends, immediate interpretation | Gate C1 | three isolated toggle screenshots |
| E-JOURNEY-2H | two-hour journey | supported-mobile fresh/0-gift paths, interruption/resume, checkpoint saves, BP understanding, fatigue and free response | Gate C2/E | desktop or accelerated simulation only |
| E-JOURNEY-10H | ten-hour journey | supported-mobile short-daily and binge pattern, interruptions, action coding, Automation/bridge response, save continuity | Gate C2/E | one late-game screenshot or desktop-only continuation |
| E-AGENCY | Shared Agency and Sakiya independent intent | direct player-experience proof across Broadcast, Video, Singing, Music, SNS, Live/Event, bridges, Automation, and late Scale that consequential action follows visible Sakiya intent, accepted prior policy, or an explicit no-input reason; player explains Sakiya intent and own contribution | Gate C2/E | action counts, management UI, or Sakiya reaction animation alone |
| E-JOURNEY-LONG | long human coverage | supported-mobile coverage of every accepted mechanic, activity, Scale transition, interruption/save state, and post-goal; exact checkpoints and missing human evidence | Gate C2/E | selected highlight reel or desktop completion |
| E-LONG-SIM | full-arc economy and strategy health | first state through every Main Progression/Scale path, accepted SP, Main Completion/post-goal; reachability/tails, meaningful no-wait alternatives, resource contribution/Semantic Retirement, person-churn and activity-route dominance/de facto near-dominance; regret/ablation/route-share/sensitivity are replaceable example techniques | Gate C2/D | one successful optimizer, averages only, or P0-only strategy proof |
| E-LONG-NOGIFT | zero-gift full-journey viability | paired economic/distribution and player-experience proof covering every Main Progression/Scale path, accepted SP, Main Completion, and accepted layer/Main Goal budget without gifts | Gate C2/D/E | P0 or two-hour zero-gift evidence alone |
| E-JOURNEY-MAIN | Main Goal | supported-mobile end-to-end human path or Owner-approved equivalent coverage basis, completion save, Ending/credits/post-goal proof | Gate C2/E/F | console unlock, simulator result, or desktop-only journey |
| E-POST | Continue/SNG | mobile completion save, retained/reset comparison, both post-goal paths, history/person/touch/save proof | Gate C2/E/F | design document or desktop-only post-goal |
| E-MOBILE-FULL | full mobile product | beginning-to-post-goal mobile play with touch, mobile-first hierarchy, every accepted activity/Scale/decision/archive/Ending/credits/Continue/SNG, ordinary interruption/resume, durable save/update, accessibility, and sufficient performance on Forge-selected supported mobile classes | Gate C1/C2/D/E/G/I | desktop full build plus mobile demo, companion, screenshot set, or partial journey |
| E-UI-STATE | screen/state inventory | UI-00–20 mobile-first, real long data, new/save/migration/recovery/empty/loading/error/offline/locked states | Gate C1/C2/E | hero screens or desktop-only states |
| E-UI-VIEW | mobile-first hierarchy/overflow | supported mobile viewports, safe areas, touch, long names, huge numbers, text settings, rotation/interruption/pending choice; larger promised surfaces retain meaning | Gate C1/D/E | desktop resized screenshot or mobile demo only |
| E-MOTION | motion hierarchy | exact M0–M5 event recordings in default and Reduced Motion, meaning comparison | Gate E | animation prompt or still |
| E-AUD-CHIME | Auditory Invariant | canonical unchanged source identity, Forge-selected packaged/runtime identity proof, prohibited-transformation result, approved trigger coverage, every accepted runtime use | Gate B/D/E | similar waveform, label alone, or separate render |
| E-AUD-LISTEN | final listening | exact build, device/output/settings, complete ranges, listener, findings and repair regression | Gate D/E | waveform, mix notes, or headphones only |
| E-AUD-FATIGUE | routine/failure listening | one-hour play, mute/captions, load/decode/autoplay failure, speed/pause/background-resume | Gate D/E | short montage |
| E-SAVE-ROUNDTRIP | mobile save/update continuity | before/after logical state across mobile close/OS interruption/relaunch/update and any offered export/import/migration | Gate D | normal desktop quit or unit test only |
| E-SAVE-RECOVERY | mobile corruption/recovery | truncated/out-of-range/partial mobile save, prior recovery state, failed/interrupted migration/update, retry, and visible mobile recovery without desktop | Gate D/G | recovery design document or desktop-only recovery |
| E-SAVE-ATOMIC | transaction boundaries | mobile background/OS kill/low-memory/forced exit at choice/autosave/Prestige/SP/Main/SNG/import/migration; idempotence and architecture-relevant concurrency | Gate D | normal quit or uninterrupted foreground play only |
| E-OFFLINE | mobile offline/clock | mobile 0/near/max/beyond cap, background/relaunch, forward/back/timezone anomaly, reconnect/reload, return summary and state delta | Gate D | time-skip screenshot or desktop-only path |
| E-OFFLINE-PWA | mobile offline/update/storage resilience | architecture-relevant uninstalled/uncached and installed/primed launch, mixed-version update, failed update, storage pressure/eviction/private mode where applicable, double-credit checks | Gate D/G | service-worker registration or happy-path update alone |
| E-A11Y-INPUT | input/focus | touch-only full mobile path plus any separately promised keyboard/mouse path, focus order/visibility/restore where applicable, pause, no trap | Gate D | automated scan or “core flow” only |
| E-A11Y-VISUAL | text/contrast/target/notation | 200%, max text, contrast measurement, target dimensions/exceptions, non-color cues, notation | Gate D | default screenshot |
| E-A11Y-COMBINED | compound settings | max text + zoom + contrast + Reduced Motion + mute + captions + mobile portrait | Gate D/E | isolated toggle tests only |
| E-A11Y-SR | assistive technology | semantic names/roles/live announcements and real screen-reader run for claimed platforms or explicit limitation | Gate D | DOM inspection alone |
| E-DEVICE | supported mobile device classes | full beginning-to-post-goal product on Forge-selected mobile model/OS/runtime classes with touch, interruption/save, accessibility, performance, and truthful limitations; any desktop promise separately evidenced | Gate D/G | simulator/emulator, flagship-only, desktop, or mobile demo evidence alone |
| E-PERF | mobile performance | Forge-selected Engineering criteria and representative lower supported mobile evidence for start/touch response/frame/load/interruption/event burst, errors, thermal/battery impact where relevant | Gate D | a fast development desktop or default flagship only |
| E-SOAK | mobile resilience/long session | sustained mobile foreground/background use, interruption/resume, memory/thermal/battery observation, huge-number/event/save/update stress and recovery | Gate D | accelerated simulation or desktop soak only |
| E-CONTENT-MANIFEST | authored content | operational definition of content unit/exposure, source/status/hash/layer/type/privacy tags, unresolved 1,200/698/712 decision | Gate C2/E | count without unit definition |
| E-CONTENT-SAMPLE | content fatigue | normal/0-gift/silent/Video-light/offline/high-speed/post-goal samples, 60m/10h raw selection output | Gate E | curated best lines |
| E-CONTENT-COVERAGE | major-event/help coverage | 24 BP, 10 SP, Ending, credits, help, recovery, response surfaces, official-line status | Gate C2/E | manifest row without runtime state |
| E-RIGHTS | shipped/public provenance | exact path+hash for package, screenshots, trailer, copy, credits; creator/source/commercial scope/attribution/replacement | Gate D/G | checked box or assumed ownership |
| E-RIGHTS-WITHDRAW | withdrawal/remap | consent fixture removal from every mapped surface with save/economy continuity | Gate G | policy statement only |
| E-PRIVACY | data-flow evidence | data inventory, first-run/play/error/update/offline network capture, log inspection, export warning, local reset | Gate D/G | privacy notice alone |
| E-ENTITLEMENT | full-mobile access/business evidence | binding full-mobile path, Owner-approved commercial package/public promise, actual mobile access boundary, save continuity, and Forge-chosen PWA/native/hybrid/auth/entitlement privacy/security proof | Gate G | price/store choice, desktop full plus mobile demo, or architecture claim alone |
| E-RELEASE | mobile-capable release artifact/access surface | reproducible exact-product identity, chosen mobile distribution launch/update/removal where applicable, integrity/system requirements, and public assets from the same accepted full product | Gate G | source commit, desktop package, or mobile demo existence alone |
| E-ROLLBACK | rollback/recovery | previous/current hashes, version mapping, backup, executed rollback, restore proof, smoke result, owner-visible steps | Gate G | rollback plan without rehearsal |
| E-CREV | Creative Review | Review Contract, exact artifact, inspected evidence, Creator Fidelity, Domain Craft, findings, Repair Brief, verdict | Gate E | Technical report |
| E-TVER | Technical Verification | commands, runtime/device checks, raw evidence, findings, Engineering verdict, unknowns | Gate D | Creative report or Builder self-report |
| E-OWNER | Owner decision | exact artifact/version, accepted scope, date, decisions, waiver scope/expiry, release permission where applicable | Gate F/H | inferred approval or conversation summary |
| E-POSTRELEASE | deployed full-mobile verification | exact deployed identity and fresh mobile proof of launch/access, beginning-to-post-goal availability, existing-save continuity, update behavior, public copy, privacy surface, support route, and monitoring/error outcome after authorized Gate H | Gate I | desktop deployment, mobile demo, package existence, deployment response, or public URL alone |

## 4. Acceptance coverage mapping — non-binding IDs

Completion areas and their required Evidence categories are binding. `T-*`, `AR-*`, `Gate *`, and `E-*` names and the row decomposition are replaceable cross-references.

| Completion area | Test IDs | Required evidence |
|---|---|---|
| Source / direction | T0 | E-SRC, E-BUILD, E-UI-STATE, E-MOBILE-FULL |
| P0-SIM | T1 | E-SIM-RAW, E-SIM-DIST, E-SIM-PARETO, E-SIM-NOGIFT, E-SIM-WAIT, E-SIM-FLOW |
| P0-FEEL | T2 | E-FEEL-REC, E-FEEL-PERSON, E-AUD-CHIME |
| First 30m | T3 | E-SIM-DIST, E-JOURNEY-30, E-JOURNEY-HOSTILE, E-UI-STATE, E-UI-VIEW, E-AUD-LISTEN, E-CREV, E-MOBILE-FULL |
| 2h / 10h / long play | T4 | E-JOURNEY-2H, E-JOURNEY-10H, E-JOURNEY-LONG, E-JOURNEY-MAIN, E-AGENCY, E-LONG-SIM, E-LONG-NOGIFT, E-POST, E-SAVE-ROUNDTRIP, E-CREV, E-TVER, E-MOBILE-FULL |
| UI / visual / motion | T5 | E-UI-STATE, E-UI-VIEW, E-MOTION, E-CREV, E-MOBILE-FULL |
| Audio | T6 | E-AUD-CHIME, E-AUD-LISTEN, E-AUD-FATIGUE |
| Save / offline / update | T7 | E-SAVE-ROUNDTRIP, E-SAVE-RECOVERY, E-SAVE-ATOMIC, E-OFFLINE, E-OFFLINE-PWA, E-MOBILE-FULL |
| Accessibility / device | T8 | E-A11Y-INPUT, E-A11Y-VISUAL, E-A11Y-COMBINED, E-A11Y-SR, E-DEVICE, E-MOBILE-FULL |
| Performance / reliability | T9 | E-PERF, E-SOAK, E-MOBILE-FULL |
| Content / Flavor | T10 | E-CONTENT-MANIFEST, E-CONTENT-SAMPLE, E-CONTENT-COVERAGE, E-CREV |
| Rights / privacy | T11-RGT/PRV | E-RIGHTS, E-RIGHTS-WITHDRAW, E-PRIVACY |
| Entitlement / package / rollback | T11-ENT/REL/RBK | E-ENTITLEMENT, E-RELEASE, E-ROLLBACK, E-MOBILE-FULL |
| Creative PASS | AR-5 | E-CREV |
| Technical PASS | Gate D | E-TVER |
| SAKIYA Final Acceptance | Gate F | E-OWNER |
| Public Release | Gate H | E-OWNER plus authorized launch evidence; publication permission is not inferred |
| Post-release verification | Gate I | E-POSTRELEASE, E-MOBILE-FULL; capture and technical verification method Forge-owned |

## 5. Invalid evidence rules

Category errors are binding: a plan is not execution, legacy evidence is not current evidence, and Creative/Technical/Owner proof cannot substitute for another authority. Capture-specific examples below—such as screenshot count, emulator use, automated scans, or particular rehearsal form—are strong but non-binding cautions. Forge may use different technology when the resulting Evidence directly proves the same exact-artifact behavior.

- A prompt is not an artifact.
- A plan or checklist is not execution evidence.
- A single screenshot is not interaction evidence.
- A screenshot is not proof of save, input, network, or runtime success.
- build success is not proof of player behavior.
- HTTP success is not proof of a usable UI.
- simulation is not human comprehension, fatigue, or Creative evidence.
- human play is not seed-tail, precision, or deterministic evidence.
- an emulator is not final real-device evidence.
- an automated accessibility scan is not keyboard, screen-reader, zoom, motion, or audio-equivalence evidence.
- an asset being in the repository is not commercial provenance.
- a rollback package is not rollback evidence until recovery is rehearsed.
- an old or legacy report cannot establish current-product PASS.
- a private preview, commit, or upload does not establish Release-ready or authorize release.
- a complete desktop artifact plus a mobile demo, companion, screenshot set, or partial journey does not establish `E-MOBILE-FULL`.

## 6. Missing, blocked, and stale evidence

These truth-state meanings are binding. Forge may implement them in any tracker or report format.

- missing artifact or context: `INSUFFICIENT_EVIDENCE`;
- missing Owner/Creative decision, permission, product artifact, or Forge-selected condition necessary to prove an obligation: `BLOCKED`;
- obligation not executed or observed by any valid method: `UNKNOWN`;
- changed code, asset, content, config, entitlement, target device, or baseline: affected evidence becomes `STALE` until regression passes;
- omitted, renamed, or combined tests are allowed, but missing proof of a binding obligation cannot satisfy a required Gate.

## 7. Waiver evidence

Every waiver must prove the failed criterion, authority, exact scope, impact, workaround/limitation, review trigger, and eligibility. The following field layout is a non-binding reporting template:

- finding and failed criterion;
- authority and date;
- exact scope and artifact;
- impact and affected users/data;
- workaround and Known Limitation copy;
- expiry or re-evaluation trigger;
- why the item is waiver-eligible;
- evidence that the waiver does not hide a separate non-waivable failure.

BLOCKER is not waived. A false or inapplicable finding is instead `REJECTED WITH COUNTER-EVIDENCE`.

Non-waivable Release-ready gaps include:

- rights or consent not established;
- privacy exposure or unapproved external data flow;
- destructive save/migration risk;
- absent rollback/recovery evidence;
- Main Goal unreachable;
- North Star or Personhood destruction;
- paid-entitlement/public-access contradiction;
- unauthorized public upload or publication.
