# FORGE IMPLEMENTATION PLAN — 2026-08-27

Status: IMPLEMENTED / AUTOMATED AND INDEPENDENT STATIC PASS / RUNTIME, CREATIVE, OWNER, AND RELEASE GATES OPEN
Branch: `codex/complete-creator-incremental`
Rollback source: `77c93a3f663769f3c16edb242fc6a66c850efc70`
Legacy implementation source: `4cc2eab`

## 1. Outcome

Replace the player-facing legacy horizontal RUN with a reversible, mobile-first implementation candidate of **「八乙女さきや 活動者育成インクリメンタル」** while preserving the accepted creative core:

- North Star: **一緒にデカくする。**
- `Presence → Co-creation → Shared Expansion`.
- Session / Asset Idle / Meta Incremental remain distinct.
- Broadcast, Video, Singing, Music, SNS, and Live Event have different verbs and decisions.
- People are history-bearing participants, never rarity, labor, sacrifice, or paid power.
- Gifts are optional and never a progression gate.
- The room remains Activity Home through U0–U10.
- 24 Breakpoints and 10 Scale Peaks remain distinct.
- Scale uses Semantic Retirement rather than hidden production in obsolete units.
- The first external fictional arrival uses one exact ENTRY CHIME identity once per save lineage, with caption, visual cue, and history.
- The complete implemented path is operable on mobile portrait/touch as the primary condition.

This branch may reach `Implemented and self-checked` and an independently verified technical verdict. It must not claim Creative PASS, SAKIYA Final Acceptance, Release-ready, or Public Release without their separate evidence and decisions.

## 2. Non-goals and protected boundaries

- Do not publish, deploy, replace the existing hosted runtime, push, or create a public listing in this implementation pass.
- Do not convert legacy saves into current progression. Preserve legacy keys as untouched lineage.
- Do not ship the legacy RUN as a hidden current mode.
- Do not add real-person data, accounts, cloud sync, telemetry, advertising, microtransactions, paid relationship paths, or voice imitation.
- Do not promote Work-recommended BP4–24 names, SP1/SP7 thresholds, Main Completion, Strong New Game, content counts, duration, visual likeness, or commercial route to Owner-accepted Canon.
- Do not treat generated or existing legacy visual assets as a final approved Sakiya likeness without ODG-07.

## 3. Repository and legacy audit

| Area | Decision | Current action | Rollback / evidence |
| --- | --- | --- | --- |
| React 19 / Vite 6 entry | KEEP / ADAPT | retain runtime and replace app composition | source commit above |
| Sites worker and build packaging | KEEP / ADAPT | retain SPA fallback and package checks | `worker/index.js`, `scripts/prepare-sites-build.mjs` |
| Legacy `App.jsx` and 4,257-line RUN CSS | REPLACE | current product UI becomes the only imported application | Git history; no deployment |
| Legacy combat engine/config/canvas | ARCHIVE IN GIT | do not import into current application | `4cc2eab`, `legacy/README.md` |
| Save validation/backup/export patterns | ADAPT | new namespace and schema; no semantic conversion | legacy keys remain untouched |
| WebAudio lifecycle/bus/ducking patterns | ADAPT | new semantic events and invariant chime route | new audio registry/evidence |
| PWA manifest/service worker | REPLACE / ADAPT | new identity, cache name, complete shell, update-safe behavior | source commit above |
| Legacy tests and reports | ARCHIVE AS EVIDENCE | replace game tests; retain generic Sites worker tests | `legacy/README.md` boundary |
| Legacy visual assets | CANDIDATE / LINEAGE ONLY | inspect before any use; no final-likeness claim | asset provenance gate remains open |

The working tree was clean before the branch was created. No tag, push, deployment, or irreversible save operation is part of this plan.

## 4. Architecture decision

### Alternatives considered

1. **Extend the legacy RUN engine.** Rejected because its combat, boss, FEVER, distance, and restart ontology directly conflicts with the current product.
2. **Replace the framework.** Rejected for this pass because React/Vite/Sites already provide a working mobile web, build, offline-shell, and test base; replacement adds release risk without satisfying a creative requirement.
3. **Introduce a current-domain deterministic core inside the existing shell.** Selected. It preserves useful infrastructure while keeping the new creative model independent from legacy state and files.

### Selected boundaries

```text
src/
  game/
    current-content.js     authored definitions and working-hypothesis labels
    current-engine.js      pure state, commands, events, progression, offline advance
    current-save.js        schema validation, autosave, backup, slots, export/import
    current-audio.js       semantic mixer, exact chime route, captions and cooldowns
  App.jsx                  mobile-first surface composition and lifecycle integration
  styles.css               room-led visual system, responsive and accessibility states
tests/
  current-engine.test.mjs  deterministic, zero-gift, activity, Scale, save/offline tests
  sites-worker.test.mjs    packaging/routing regression
public/
  assets/current/          project-bound current visual/audio candidates and provenance
  manifest.webmanifest     current identity
  sw.js                    current shell/version behavior
```

The domain core accepts explicit commands and emits ordered semantic events. UI does not mutate nested state directly. Time advancement is deterministic and separates foreground Session behavior from offline Asset Idle/understood Automation behavior. Named-person decisions never complete invisibly offline.

The current save uses a new namespace and schema. Each write validates bounds, preserves the previous valid snapshot, and records version/time. Import previews data before overwrite in the UI. Legacy keys are never read as current progression.

## 5. Candidate and unknown handling

| Open decision | Safe implementation behavior |
| --- | --- |
| ODG-01 legacy access | preserve Git lineage and old browser-storage namespace; do not deploy over the current host |
| ODG-02 A1/A2/A3 | engine and UI retain silent observation, reaction, and bounded comment-choice probes; no single mode is declared Canon |
| ODG-03 departure | use reversible distance/absence only |
| ODG-04 duration | keep thresholds data-driven; do not make a 100-hour release claim |
| ODG-05 / ODG-06 | keep SP1/SP7 triggers marked working hypotheses and test them; do not label them accepted Canon |
| ODG-07 likeness | produce only a reviewable candidate; preserve face-safe composition and avoid a final-likeness claim |
| ODG-08 ending/post-goal | implement the Work-recommended completion as a reviewable candidate with Continue and Strong New Game; preserve evidence and do not claim Owner acceptance |
| ODG-09 commercial route | build an installable local-first web candidate; do not claim entitlement/store readiness |
| ODG-10 public release | no public action |
| ODG-12 language | implement current Japanese content and keep data separated for later localization; no launch-language claim |

## 6. Execution graph

1. **Evidence lock and rollback**
   - Confirm clean source, branch, legacy/current pointers, full-document reading, baseline checks.
2. **Current deterministic core and save boundary**
   - New schema, command/event loop, foreground/offline advance, six activities, bridges, automation, Prestige, 24 BP, 10 SP, completion candidate.
   - Unit/simulation checks include 27 P0 configurations and zero-gift/no-wait/personhood invariants.
3. **First meaningful current-product preview**
   - Launch → Room → Broadcast Before/LIVE/After → first arrival/chime-equivalent → preserve material.
   - Compile and non-error local response before expanding the UI.
4. **Full mobile product surfaces**
   - UI-00–UI-20 responsibilities, including People, six activity workspaces, Connections, Automation, Prestige, Scale, Analysis, Archive, Goals, Settings/Save, Completion/Continue/Strong New Game.
5. **Visual, motion, audio, and PWA integration**
   - Room-led art candidate, causal world intrusions, reduced-motion equivalent, semantic cues, exact invariant chime identity, captions/history, current metadata/cache.
6. **Self-check and independent verification**
   - Build, tests, deterministic long-run, corruption/import/offline/lifecycle checks, keyboard/touch-sized controls, narrow/large viewport runtime, visual/interaction review, accessibility and console checks.
7. **Repair and same-condition regression**
   - Freeze each failure before changes, repair the smallest boundary, rerun the same check plus adjacent regression.
8. **Forge return**
   - Files, commands, runtime evidence, generated-asset provenance, open Owner gates, Technical verdict, and explicit no-publication state.

## 7. Subagent and file ownership

The main integrator owns creative boundaries, architecture, cross-file contracts, integration, final state, Owner gates, and all publication decisions.

| Responsibility | Allowed files | Protected scope | Mechanical acceptance |
| --- | --- | --- | --- |
| Core bounded builder | `src/game/current-content.js`, `src/game/current-engine.js`, `src/game/current-save.js`, `tests/current-engine.test.mjs` | no UI, legacy file edits, Canon promotion, or package changes | Node tests; deterministic fixtures; zero-gift completion; schema/offline checks |
| UI bounded builder | `src/App.jsx`, `src/styles.css` | consume fixed core API; no core/save/public/package edits or creative-scope reduction | production compile; named UI responsibilities; keyboard/touch semantics |
| Platform/audio bounded builder | `src/game/current-audio.js`, `public/manifest.webmanifest`, `public/sw.js`, new current asset/evidence files | no UI/core changes; no deployment; no voice or chime variants | build/package tests; one chime identity; caption/event mapping; current cache identity |
| Independent verifier | read-only whole artifact | no fixes or acceptance changes | reproducible findings and verdict against fixed criteria |

No two builders may edit the same file or redefine another builder's contract.

## 8. Test and evidence strategy

### Structure and static

- Current metadata contains no legacy product identity.
- No current import reaches legacy combat/config/canvas modules.
- Production build and Sites package succeed from a clean dependency install.
- Current asset registry records provenance and runtime path.

### Behavior and simulation

- First launch, first external arrival, one lineage chime event, Before/LIVE/After, preservation, Video bridge, changed next Broadcast.
- Six distinct activity commands, outputs, limiters, failure/recovery, and cross-activity provenance.
- 24 BP and 10 SP are distinct ordered receipts; retired units stop live production while history remains.
- Zero-gift bot reaches every mandatory progression gate and the completion candidate.
- No-wait bot always has an active decision while Asset Idle runs.
- Silent/observe, react, and comment-choice paths remain viable without forcing input.
- Prestige/Scale/Strong New Game preserve people, history, room, firsts, works, receipts, and settings.

### Persistence and resilience

- New, malformed, previous-current-schema, backup, slots, export/import, reset, clock anomaly, duplicate offline claim, background resume.
- Offline advances Asset Idle/understood Automation only, caps elapsed time, and defers named-person events to foreground summaries.

### Runtime, visual, interaction, accessibility

- Mobile portrait is the primary path; mobile landscape and desktop remain complete.
- Narrow width, 200% text, reduced motion, high contrast, mute/captions, keyboard-only, focus restoration, no horizontal core-flow scroll.
- Room and current decision remain primary; named arrivals and Scale changes never become generic counters or equal-card dashboards.
- Critical state survives reload and appears in durable history, not only a toast.

### Audio

- One approved implementation-candidate chime file/identity, one allowed first-arrival trigger per lineage, no variant or pitch route.
- S0–S2 cues have text, non-color visual, and history equivalents.
- Routine bursts collapse and resume never replays a queued audio wall.

## 9. Adversarial review and regression

Independent review will attack:

- legacy ontology leakage;
- manager/god/dashboard framing;
- gift, Video, person selection, or one activity becoming dominant;
- waiting-only states;
- reset/Scale/history loss;
- fake semantic Scale made only from larger numbers;
- mobile-only omissions, clipped controls, motion/sound-only meaning;
- save corruption, duplicate offline reward, import overwrite, update/cache mismatch;
- generated-text authorship confusion, real-person implication, missing rights/provenance;
- evidence-free `complete`, release-ready, or public claims.

BLOCKER findings cannot be waived. Unwaived HIGH findings block the corresponding technical gate. Repairs rerun the exact failing condition and broad affected regression.

## 10. Stop conditions

Stop and return to SAKIYA / SAKIYA STUDIO if implementation would require:

- destructive legacy migration or hosted-runtime replacement;
- declaring a canonical Sakiya likeness or rights basis without Owner evidence;
- changing player role, activity meanings, UI hierarchy, personhood, gift, Scale/Prestige meaning, tone, completion scope, or mobile completeness;
- public deployment, store/price/entitlement claims, real-person data, account/cloud scope, voice, or irreversible external action;
- concealing a BLOCKER/HIGH finding or calling unavailable evidence PASS.

## 11. Commit and return plan

- Work only on `codex/complete-creator-incremental`.
- Keep source changes reviewable by responsibility; do not push without a separate explicit decision.
- Preserve `77c93a3` as the current-document rollback point and `4cc2eab` as legacy runtime lineage.
- Return a Build Result first, then an independent Verification Report.
- Report Creative PASS, Owner Acceptance, Release-ready, and Public Release as separate and unchanged unless their own evidence/authorization exists.

## 12. Implementation result — 2026-08-28

The current branch now contains the full local implementation candidate described by this plan. All files under `docs/`, including every completion document and register, were read before integration. This result preserves the document labels `ACCEPTED CORE`, `OWNER ACCEPTED`, `WORK RECOMMENDED`, `TEST-DEPENDENT`, and `UNKNOWN`; implementation does not promote an open Owner gate.

Implemented boundaries:

- deterministic P0 A1–A3 × B1–B3 × C1–C3 comparison behavior, first Broadcast, fictional arrival, zero-gift progression, six distinct activities, bridges, Automation, Prestige, 24 BP, 10 SP, U0–U10 Semantic Retirement, offline caps, Continue, and Strong New Game;
- a candidate-only Main Completion flow with an ordinary final Anchor Broadcast, explicit final choice, credits, and an auditable fixed-order snapshot of provenance-bearing contributions from all six activities on the Anchor work, Anchor receipt, and completion basis;
- a new bounded local save namespace with durable primary/backup/three-slot safety, non-destructive previews, corrupt-source quarantine/export, forged-import normalization, interrupted-reset recovery, and explicit failed-persistence UI;
- one generated canonical implementation-candidate ENTRY CHIME route whose intent survives mute, autoplay lock, load failure, and reload, and is acknowledged only after actual playback start;
- Room-led coarse vivid 8-bit UI, U0–U10 accumulated Room evidence, responsive 44 px controls, reduced-motion/high-contrast equivalents, route/deep-link/Back/Escape/focus handling, mobile five-item root navigation with More sheet, and a LIVE leave/pause/summarize safeguard;
- build-version and save-migration metadata plus an explicit safe PWA update handshake. Final Vite JS/CSS entries are injected into the offline shell after build; new and old workers use separate caches and never auto-claim, auto-reload, or delete an open older session's cache;
- current-only public assets. Superseded visual candidates and the legacy RUN art are outside the served package under `docs/engineering/` with lineage/provenance notes.

Self-check and independent read-only evidence at this result boundary:

- `npm run check`: current `56/56`, Sites `4/4`, and production build PASS;
- `npm run test:legacy`: `11/11` PASS;
- `git diff --check`: clean;
- the independent verifier found no new P0/P1 source defect in the final implementation snapshot and confirmed that the served package contains only the current coarse 8-bit identity assets.

These results establish implementation and automated/static verification only. They do not promote any open runtime, creative, Owner, rights, or release gate.

Evidence intentionally still open:

- real-browser mobile/desktop interaction, device rotation/background/termination, screen-reader/assistive-technology, and audible listening evidence are `UNKNOWN` where the available browser policy did not permit the required run;
- the generated Sakiya likeness, supplied-reference/public-commercial rights scope, Creative PASS, SAKIYA Final Acceptance, late working-hypothesis values, commercial route, release readiness, and publication remain separate Owner/evidence gates;
- older versioned PWA caches are retained to protect active mixed-version sessions and rollback. A user-safe cache-retention/cleanup policy remains a release-gate decision rather than an automatic deletion in this candidate;
- no commit, push, deploy, store action, or public release was performed.
