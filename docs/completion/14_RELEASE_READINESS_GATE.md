# RELEASE READINESS GATE

Status: WORK-APPROVED BINDING RELEASE STATE/EVIDENCE GATE + FORGE-OWNED RELEASE ENGINEERING / CURRENT VERDICT BLOCKED  
Source commit: 69b36a6ac59f1fad8157cb7ceb46ba352c476710  
Creative authority owner: SAKIYA STUDIO  
Technical verification owner: Implementation Forge / Codex  
Final acceptance and public release authority: SAKIYA

Governing source set:

- `SRC-OWNER-MOBILE-01` — current explicit SAKIYA instruction, 2026-08-27: 「モバイルでのプレイを前提に設計してください。」 — highest current Creative/platform authority; full beginning-to-post-goal mobile play is binding.
- `SRC-AUTH-01` — `docs/work/FORGE_EXECUTION_AUTHORITY_CONTRACT.md`, blob `8bc028197ed8747cce62d28ac9cbc4e527bb82cc` — active authority contract.
- `SRC-WORK-12` — `docs/work/WORK_PROMPT_COMPLETE_GAME_FORGE_HANDOFF_v1.2.md`, blob `4b14c98ef5e247c03a71458c8cf56c9b64475139` — active Work finalization prompt.
- `SRC-WORK-11-REPO` — repository v1.1, blob `8dfe9d9c99857b2b367ec509611c31bbac8a9f32` — superseded lineage.
- `SRC-WORK-11-UPLOAD` — uploaded pre-pause v1.1, SHA-256 `471757c8a0f3525a8d7b0dae8b7ddb5e3b37520c4120c8bc6b95b6805deee542` — superseded lineage; only stricter non-conflicting coverage detail may be retained.

## 1. Current verdict

`BLOCKED`

Reason:

- there is no current-product P0 or production artifact;
- the playable repository runtime is the superseded horizontal action/RUN implementation;
- no current-product full-mobile build/path, touch/interruption/save/performance, real-device, audio, offline, accessibility, content, rights, entitlement, package, or rollback Evidence exists;
- Creative PASS, Technical PASS, SAKIYA Final Acceptance, and Release-ready have not occurred.

This verdict is expected for the current design phase. It must not be rewritten as PASS from plans or legacy evidence.

## 2. Verdict vocabulary

- `PASS`: every required criterion is confirmed with fresh evidence.
- `PASS WITH KNOWN GAPS`: only explicitly optional, non-release-critical gaps remain.
- `FAIL`: a required criterion is violated by evidence.
- `BLOCKED`: required artifact, decision, environment, permission, or evidence is unavailable.
- `UNKNOWN`: the item was not executed or observed.

Required `BLOCKED`, `UNKNOWN`, `SKIPPED`, or stale items prevent Release-ready PASS.

## 3. Authority classification

- `BINDING ACCEPTANCE INTENT`: the current release verdict, full beginning-to-post-goal mobile product, distinct completion/release states, required Evidence categories, exact-artifact identity, non-waivable failures, truthful public claims, Creative/Technical/Owner authority separation, and explicit Owner permission for Public Release.
- `FORGE-OWNED / NON-BINDING ENGINEERING RECOMMENDATION`: gate execution schedule, `A–I` labels, technical sequencing, build/signing/package method, device/browser procedure, measurement tooling, rollout mechanics, rollback implementation, release engineering, CI, branch/commit strategy, and post-release technical workflow.
- Forge may reorganize procedures and evidence capture, but may not collapse distinct authority states, omit a required Evidence category, weaken a visible release promise, or infer Owner permission.

> **Suggested execution decomposition only. Implementation Forge may reorganize this work based on repository state, architecture, dependencies and risk.**

## 4. Acceptance-state coverage reference

The state distinctions and required proof are binding. Gate letters, exact sequence, scheduling, technical routes, and reporting/mapping form below are replaceable Forge planning references; Forge must demonstrably cover the obligations without using any prescribed mapping artifact.

| Gate | Required state | Authority and evidence | Current state |
|---|---|---|---|
| A Creative Completion | 01–10 integrated; full-mobile Main Goal/post-goal, UI, audio, content, accessibility, rights, platform, and exclusions defined | C; approved specification and Decision Register | IN PROGRESS / BLOCKED by remaining Owner and test-dependent decisions; full-mobile scope itself is fixed |
| B P0 Validation | P0-SIM, P0-FEEL, Pareto integration, structural blocker 0 | separate C and T evidence | BLOCKED: no current-product P0 artifact |
| C1 Integrated First 30 Minutes | integrated mobile-first slice proves touch/interruption, timing, comprehension, participation/feel, and representative visual/audio experience | C+T separate | BLOCKED: implementation absent |
| C2 Integrated Full Product | accepted activities, Scale, content, beginning-to-post-goal full-mobile journey, resilience, and final surfaces exist as one candidate | C+T separate | BLOCKED: implementation absent |
| D Technical PASS | build, full-mobile runtime/device/touch, save/interruption/update/offline, accessibility, performance, recovery, package/license inventory | T; E-TVER and E-MOBILE-FULL | BLOCKED: no current-product artifact/evidence |
| E Creative PASS | North Star, role, Personhood, activities, Scale meaning, tone, and full-mobile visual/audio/content experience | C; E-CREV and E-MOBILE-FULL | BLOCKED: no release candidate |
| F SAKIYA Final Acceptance | SAKIYA accepts the exact RC artifact and remaining decisions | O; E-OWNER | BLOCKED: no RC |
| G Release-ready | full-mobile product/access surface, exact commercial package/public assets, rights/privacy, entitlement, limitations, support, rollback | C/T/O evidence | BLOCKED |
| H Public Release | explicit Owner permission followed by authorized external action | O plus launch evidence | NOT AUTHORIZED |
| I Post-release Verification | deployed full-mobile artifact smoke/access, save/update, copy/privacy/support, and monitoring check | T/O | NOT APPLICABLE |

## 5. Gate ownership must remain separate

- Gate D verifies the technical asset/license inventory and package behavior. It does not establish commercial/legal rights sufficiency.
- Gate E reviews Creator Fidelity and Domain Craft. It does not establish build, save, privacy, performance, or package correctness.
- Gate F accepts an exact artifact. It does not rewrite a failed Technical, rights, privacy, or entitlement result.
- Gate G prepares publication. It does not authorize Gate H.
- a commit, handoff, private preview, store draft, or deployed private build is not Public Release permission.

## 6. Release Candidate entry proof obligations

An artifact may be called a Release Candidate only when all listed proof subjects are present. Exact tools, commands, file formats, technical thresholds, fixture decomposition, definition timing, and release-engineering procedure are Forge-owned. Forge establishes defensible Engineering criteria; Studio reviews only changes to player-visible impact.

- exact source identity and reproducible artifact identity through a Forge-selected mechanism;
- approved transition from the legacy runtime and rollback lineage;
- feature and content lock;
- supported-mobile fresh start through Main Goal and accepted post-goal with no desktop handoff or demo boundary;
- no placeholder, TODO, dead control, raw key, debug-only screen, or missing asset;
- locked, recoverable mobile interruption/save/migration/offline/update behavior with no unresolved destructive risk;
- truthful full-mobile supported-surface and runtime promise; PWA/native/hybrid architecture remains Forge-owned;
- Forge-selected Engineering acceptance criteria sufficient to prove performance, audio delivery, accessibility, and reliability obligations;
- complete provenance linkage for the package and every public-facing asset;
- approved entitlement and distribution contract;
- final privacy/data inventory;
- every open finding and missing Evidence obligation visible to the relevant authority;
- credible recoverability/containment path, with architecture and procedure owned by Forge.

## 7. Release Candidate exit proof obligations

Release-ready requires the following Evidence categories and authority verdicts. Named durations, IDs, case lists, device procedure, and capture mechanics are coverage references that Forge may replace with justified equivalent or stronger proof; player-visible obligations and non-waivable failures remain binding.

- `BLOCKER = 0`;
- `unwaived HIGH = 0`;
- every remaining MEDIUM recorded as a Known Limitation with impact and workaround;
- P0, first 30m, 2h, 10h, every Scale/mechanic, Main Goal, and post-goal evidence;
- `E-MOBILE-FULL`: beginning-to-post-goal mobile touch, mobile-first hierarchy, every accepted activity/Scale/state, interruption/resume, save/update continuity, accessibility, and performance; desktop full plus mobile demo cannot substitute;
- Shared Agency and Sakiya-independent-intent Evidence across every activity, bridge/Automation state, and late Scale;
- paired zero-gift economic and player-experience Evidence proving every Main Progression/Scale path, accepted SP, and Main Completion within accepted budgets;
- full-arc no-wait, resource contribution/Semantic Retirement, person-churn, route dominance, and de facto near-dominance Evidence through Main Completion; analysis method and thresholds Forge-owned;
- at least one end-to-end human Main journey or an exact Owner-approved equivalent coverage map;
- complete physical device/runtime matrix;
- final full listening and one-hour audio fatigue evidence;
- save/export/import/migration/corruption/atomic-boundary/offline/clock/PWA-cache evidence;
- keyboard, mouse, touch, focus, screen-reader, zoom, text, contrast, target, Reduced Motion, mute, and compound-setting evidence;
- performance and physical-device soak evidence;
- defined and validated content units, exposure, repetition, major-event, ending, help, credits, and recovery copy;
- rights/provenance `UNKNOWN = 0` across shipped and public assets;
- privacy/network/log/export/reset evidence;
- paid/free entitlement promise verified without direct-URL or cache bypass contradiction;
- clean-machine install/start/update/uninstall, signing/integrity, and system-requirement evidence;
- rollback rehearsal and save-restore smoke PASS;
- Creative PASS;
- Technical PASS;
- SAKIYA Final Acceptance of the same artifact;
- store/distribution rules rechecked from current primary sources during WP-12.

## 8. Source resolution and current blocking Gate Gaps

### GG-01R: Work prompt version collision — VERIFIED CLOSED

`SRC-WORK-12` is the uniquely versioned active Work prompt at blob `4b14c98ef5e247c03a71458c8cf56c9b64475139`, governed by `SRC-AUTH-01` at blob `8bc028197ed8747cce62d28ac9cbc4e527bb82cc`, both unchanged at source baseline `69b36a6ac59f1fad8157cb7ceb46ba352c476710`. Repository v1.1 blob `8dfe9d9c99857b2b367ec509611c31bbac8a9f32` and uploaded pre-pause v1.1 SHA-256 `471757c8a0f3525a8d7b0dae8b7ddb5e3b37520c4120c8bc6b95b6805deee542` are recorded as superseded lineage. The same-name active-version collision is closed; neither v1.1 source is promoted back to active.

### GG-01: circular root source pointers — OPEN

The version collision closure does not normalize the circular priority text among current root pointer files. Until those pointers are repaired, `SRC-AUTH-01` governs Engineering-authority interpretation and `SRC-WORK-12` governs this Work finalization, while accepted Creative/Owner sources retain their domain authority. Canon handoff still requires one non-circular root precedence statement; this is a separate Gate Gap, not a reason to reopen the v1.1 collision.

### GG-02: legacy preservation and destructive migration

Owner approval is required for how much of the legacy playable runtime remains accessible and for any destructive action that changes that accepted preservation outcome. Forge owns branch, backup, save, rollback, and deployment procedure; it must prove preservation/recoverability and obtain only the Owner/Creative decisions that change visible scope or authorize destruction/public action.

### GG-03: P0 Economy measurability

The Creative multi-proof and zero-gift/time-budget intent is fixed through every Main Progression/Scale path and Main Completion. Forge operational model, coefficients, observability, and execution Evidence are absent. Forge proposes them; Studio reviews any player-visible contract before P0; the Gate remains `OPEN / INSUFFICIENT EVIDENCE` until the obligation is proven by Forge-owned methods.

### GG-04: first-30-minute timing

The BP1–3/Video requirement, P50 20–30/P90 45 first-synergy target, and L1 timing hypothesis require P0 plus human evidence. None is silently promoted.

### GG-05: open creative decisions

- A1/A2/A3 adoption;
- SP1 and SP7 triggers;
- approximately 100-hour Main Goal;
- Main Completion and Continue/Strong New Game contract;
- permanent departure;
- exact Scale/activity naming where required;
- canonical visual reference and fiction/reality distance.

Safe defaults permit conditional probes but not final claims.

### GG-06: ENTRY CHIME

The asset identity invariant and `TRG-ENTRY-01` are fixed: the first external fictional-person arrival fires the same asset once per save lineage. The actual cleared source asset, runtime provenance, unchanged packaged/runtime identity proof, and integrated proof do not yet exist. Later-arrival eligibility and cooldown remain separate and TEST-DEPENDENT; the provisional late-game policy foregrounds selected Anchor arrivals instead of chiming every external arrival.

### GG-07: Flavor units

The 1,200 pool and 698/712 exposure values are TEST-DEPENDENT and use unresolved units/selection assumptions. 712 is not recommended into acceptance by default. Content-unit and novel-exposure definitions plus long-play Evidence are required.

### GG-08R: full-mobile Creative/platform scope — OWNER RESOLVED

`SRC-OWNER-MOBILE-01` supersedes the former bounded Option A desktop-full/mobile-demo default. Full beginning-to-post-goal mobile play is Binding Creative: touch, mobile-first UI, interruption/resume, save/update continuity, accessibility, performance, Main Completion, and post-goal. Desktop full plus mobile demo cannot pass.

### GG-08: full-mobile artifact and Engineering Evidence — BLOCKED

No full-mobile product or `E-MOBILE-FULL` exists. PWA/native/hybrid choice, exact supported models/versions, migration/update design, performance/audio/accessibility/reliability thresholds, soak design, entitlement implementation, and tooling are Forge-owned rather than Owner decisions. Forge must prove the fixed mobile promise and return to Studio/Owner only if it cannot do so without changing player-visible scope or the public promise.

### GG-09: rights and provenance

Canonical likeness/costume, voice, music/video, generated assets, public screenshots/trailer, and all third-party assets require exact asset identity plus evidenced commercial scope. Paths, hashes, manifests, and capture tooling are replaceable technical methods. UNKNOWN provenance blocks packaging.

### GG-10: full-mobile commercial package and entitlement Owner Gate

The former Option A recommendation—paid desktop full product plus public responsive mobile demo with no full-mobile promise—is superseded by `SRC-OWNER-MOBILE-01` and cannot be selected as the completion scope. The original paid-desktop/public-full-access contradiction remains a regression risk, but it does not cancel the binding full-mobile requirement.

The remaining Owner Gate is the truthful commercial package/public promise: paid/free/store scope, purchase/access promise, and whether cross-device save continuity is publicly promised. PWA/native/hybrid/auth/entitlement architecture and hostile verification method are Forge-owned. Until the commercial package is accepted and evidenced:

- full-mobile product implementation and private verification proceed as Binding Creative work, but Release-ready remains BLOCKED;
- no release copy invents price, store, entitlement, or cross-device continuity;
- desktop full plus mobile demo cannot be used as a fallback completion claim;
- any paid promise must match actual full-mobile access and cannot rely on an unenforced honor-system boundary.

The chosen commercial design must pass its applicable account, privacy, security, store, recovery, entitlement, and save-continuity obligations before public full-mobile release.

### GG-11: no current-product evidence

No current reproducible full-mobile artifact, independent Technical PASS, Creative PASS, Owner Acceptance, full-journey mobile/device/touch/interruption/save/performance check, screen-reader check, listening review, offline recovery, rights review, entitlement evidence, or rollback rehearsal exists.

## 9. Severity and waiver rule

- a Gate with any BLOCKER cannot pass;
- High requires verified repair or an explicit eligible Owner waiver;
- a waiver records artifact, scope, impact, workaround, expiry/review trigger, and Known Limitation;
- a waiver never rewrites FAIL as PASS;
- severity cannot be downgraded to pass a Gate without counter-evidence and independent re-verification;
- recurring LOW findings with one root cause may aggregate into a MEDIUM/HIGH craft defect.

Non-waivable for Release-ready:

- missing rights or consent;
- privacy exposure or unapproved data flow;
- destructive save/migration risk;
- absent rollback/recovery proof;
- Main Goal unreachable;
- any accepted activity, Scale state, Main Completion, or post-goal path unavailable on supported mobile, including a desktop-full/mobile-demo substitution;
- North Star or Personhood destroyed;
- paid entitlement contradicted by public full-product access;
- public package cannot be tied to accepted source/build;
- unauthorized publication.

## 10. Rollback and recovery proof gate

Actual recovery of the accepted artifact/data is a binding release Evidence obligation. The following is a strong coverage reference; Forge owns the rollback architecture, commands, distribution procedure, fixtures, scheduling, and regression implementation. It may use an equivalent or stronger rehearsal, but a plan or package without demonstrated recovery remains insufficient:

- previous known-good package/source identity through a Forge-selected mechanism;
- current RC package/source identity through the same or equivalently auditable mechanism;
- store/deployment version mapping;
- save backup before migration;
- failed migration leaves old save intact;
- executed rollback on the selected distribution surface;
- restored save and fresh-start smoke tests;
- downgrade compatibility statement;
- support and recovery path;
- Owner-visible decision path for stopping rollout.

Package existence without rehearsal is insufficient.

## 11. Public release state model

The distinctions among prepared, submitted, deployed-but-not-public, public-but-unverified, verified release, rollback, and blocked are binding. The following labels are non-binding examples; Forge may rename or add operational states while keeping the distinctions truthful:

1. `PREPARED`
2. `SUBMITTED / REVIEW PENDING`
3. `DEPLOYED NOT PUBLIC`
4. `PUBLIC NOT VERIFIED`
5. `RELEASED AND VERIFIED`
6. `ROLLED BACK`
7. `BLOCKED`

Do not collapse the underlying distinctions into a false “released” claim.

## 12. Public Release and post-release

- no upload, submission, pricing publication, entitlement activation, or public release occurs without explicit Owner permission;
- **Binding Gate I Test Intent:** after authorized publication, `E-POSTRELEASE` and `E-MOBILE-FULL` must prove the exact deployed full-mobile artifact/access surface, mobile first launch/access, beginning-to-post-goal availability, existing-save continuity, update behavior, public copy/screenshots, privacy surface, support route, and current monitoring/error outcome. Desktop-only/mobile-demo deployment, wrong artifact/entitlement, inaccessible promised access, save loss, unsafe update, misleading copy, undisclosed data flow, absent support, or an uncontained non-waivable defect prevents `RELEASED AND VERIFIED` meaning;
- Forge owns every deployment, smoke, access probe, save/update case, capture, monitoring, containment, recovery, and post-release Technical Verification method; the labels and procedure are non-binding even though the proof subjects and truthful state are binding;
- a public URL is not post-release verification;
- if a non-waivable defect appears, Forge contains and recovers through its chosen procedure under applicable Owner authorization, and reports the resulting state truthfully rather than preserving a false release claim.
