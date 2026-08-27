# AUDIO / MUSIC / SFX DIRECTION

Status: WORK CREATIVE DIRECTION / CURRENT EVIDENCE: **INSUFFICIENT EVIDENCE**  
Source commit: 69b36a6ac59f1fad8157cb7ceb46ba352c476710  
Authority owner: SAKIYA STUDIO / Work

## 1. Purpose and current verdict

Audio must make quiet arrival, activity identity, acceleration, retirement, recovery, and impossible scale legible. It must not become a constant reward machine. Silence and contrast are part of the score.

This file fixes semantic responsibilities and production/evidence coverage. Its named artifacts, identity-proof techniques, durations, cases, and field layouts are replaceable references. It does **not** approve an audio implementation. No final source audio, unchanged packaged/runtime identity proof, queryable asset record, rights record, integrated build, or listening report is available in this completion package. Therefore the current audio verdict is **INSUFFICIENT EVIDENCE**. Every PASS statement below is a future acceptance condition, not a result.

Audible meaning, identity/trigger invariants, priority/equivalence, forbidden outcomes, and listening-evidence categories are Binding Creative / Binding Test Intent. Audio engine, codec, bus implementation, registry schema, exact technical cases, measurement/capture tools, and production sequence are Forge-owned.

Mobile is a full-product listening surface. Phone speaker, supported wired/Bluetooth output, mute/silent mode, denied audio unlock, call/alarm interruption, background/resume, route change, and low-power/thermal conditions must preserve event order and non-audio equivalence from first arrival through post-goal. Desktop listening cannot substitute for final mobile evidence.

## 2. ENTRY CHIME — asset identity invariant

`S0_ENTRY_CHIME` is one asset identity for the entire product. Identity and trigger are separate contracts: this section defines what the asset is; §3 defines when it may play.

The Binding Creative invariant requires one unchanged asset identity; Forge owns how packaged/runtime identity is proved. Cryptographic hashing of packaged bytes is a strong reference technique, not the mandated mechanism. Required outcomes are:

- one approved master source and one canonical asset ID;
- every accepted packaged/runtime use provably resolves to that unchanged approved source identity;
- no pitch change, remix, “deluxe” replacement, layer-specific version, longer version, alternate instrument, synthetic recreation, or separately rendered look-alike;
- no use of musical layering to imply that a changed chime is still the same asset.

Permitted runtime treatment does not create a new identity:

- device-safe gain adjustment;
- ducking of lower-priority buses;
- a short preceding gap;
- a synchronized caption, visual mark, and history record.

The canonical file, provenance, rights basis, and unchanged packaged/runtime identity proof are currently **UNKNOWN**. A label such as `S0_ENTRY_CHIME` is not evidence that the asset exists.

## 3. ENTRY CHIME — accepted first trigger and provisional later-trigger policy

`TRG-ENTRY-01` is **Binding Creative**. `TRG-ENTRY-02`, exact later-event selection, and cross-event cooldown remain **HYPOTHESIS / TEST-DEPENDENT** until Owner adoption and integrated-event evidence. The two statuses must not be collapsed:

| Trigger ID | Status | Eligible event | Boundary |
|---|---|---|---|
| TRG-ENTRY-01 | BINDING CREATIVE | first external arrival | the first fictional person external to the starting room pair becomes an individual foreground arrival in the preserved history; fires once per save lineage, not once per Prestige or Scale |
| TRG-ENTRY-02 | HYPOTHESIS / TEST-DEPENDENT | explicitly foreground fictional-person arrival | a later fictional person is intentionally presented as a discrete foreground arrival; the content event opts in explicitly and has person/event identity |

“External” refers to a fictional in-world person arriving from outside the starting room context. It does not authorize collecting or representing a real listener’s identity.

Forbidden triggers:

- anonymous or aggregate viewer-count changes;
- batched comments, passive resource ticks, or hidden simulation;
- offline gains, background progress, or app resume;
- Breakpoint, Prestige, Scale Peak, SP transition, fanfare, save, recovery, or completion merely because it is important;
- a later visit or return unless that event independently satisfies TRG-ENTRY-02;
- replaying queued arrivals after foreground resume.

One qualifying event may request the chime once. Duplicate requests for the same event collapse. A second request while the cue is active is suppressed and recorded rather than stacked. `TRG-ENTRY-01` cannot be removed or replaced because of a later-trigger cooldown. Exact cross-event cooldown for `TRG-ENTRY-02` remains **UNKNOWN** and must be selected from sufficient sustained-use fatigue/continuity evidence; a one-hour session is a replaceable reference probe. “Event-scoped, no stacking” is the minimum visible rule.

### Main Completion gate

A Main Completion arrival may invoke `S0_ENTRY_CHIME` only if the Owner adopts both the final arrival scene and its later-arrival chime trigger. Because it is not the lineage's first external arrival, that adoption must identify the exact completion event and accept it under `TRG-ENTRY-02`. Until then, the completion plan uses silence plus its own completion cue; it must not reserve or fake an ENTRY CHIME. If adopted, the completion scene still resolves to the unchanged canonical asset through the Forge-selected identity-proof mechanism.

## 4. Audio asset evidence contract — replaceable schema

Forge must make the following required meanings queryable and auditable for every shipping audio asset. The table is a **replaceable reference schema**: file format, registry name, field names, row shape, tool, and storage layout are Forge-owned. An equivalent or stronger Forge mechanism passes when it preserves every listed meaning, exact packaged-asset traceability, and the release-blocking checks below.

| Field | Required meaning |
|---|---|
| `asset_id` / `semantic_class` | stable ID and S0–S4 responsibility; aliases cannot conceal replacements |
| `state_ids` / `trigger_ids` | exact state/event map; no “global celebration” wildcard |
| packaged-artifact locator / identity proof | distributable asset and end-to-end proof that runtime uses the approved unchanged identity; path plus packaged-byte hash is a replaceable reference |
| `source_master` / `edit_lineage` | originating recording/render and every material transformation |
| `creator` / `created_at` / `tool_version` | provenance sufficient to reproduce and audit |
| `rights_basis` / `attribution` / `territory_term` | commercial permission, obligations, and limits |
| `voice_identity` / `owner_adoption_id` | `NO_VOICE`, named authorized voice, or blocked; see §7 |
| `mix_bus` / `priority` / `duck_targets` | collision behavior and what yields |
| `cooldown` / `concurrency` / `resume_policy` | repetition, stacking, queued-event, and background rules |
| `caption_key` / `visual_signal_id` | no-audio equivalent; null requires an approved inapplicability reason |
| `loop_points` / `interrupt_policy` | safe looping and state exit behavior |
| `implementation_status` / `evidence_refs` | planned, present, accepted, rejected; listening/build proof IDs |
| `replacement_withdrawal_path` | safe removal if rights, quality, or Owner permission changes |

No asset is release-eligible with a missing right, unchanged packaged/runtime identity proof, trigger, priority, cooldown, caption/visual mapping, or evidence linkage.

## 5. Semantic class and mix priority

Semantic class and mix priority are independent:

| Semantic class | Job | Minimum rule |
|---|---|---|
| S0 invariant | ENTRY CHIME | unique identity and restricted trigger policy |
| S1 relationship | first revisit, CRITICAL, accepted arrival emphasis | discrete, person/event-bound, never aggregate spam |
| S2 structural | publish, bridge, Breakpoint, Prestige, SP, completion | communicates cause and state change |
| S3 routine | select, confirm, grouped resource result | quiet, short, burst-collapsible |
| S4 ambience/score | room, device, activity bed, scale field | loop-safe, interruptible, independently adjustable |

| Mix priority | Content | Collision rule |
|---|---|---|
| M0 safety/data | save failure, recovery decision, destructive confirmation | cannot be masked; interrupts M2–M4 |
| M1 invariant/relationship | ENTRY CHIME, critical person-state meaning, adopted completion anchor | ducks M2–M4; never stacks |
| M2 structural | activity release, Prestige, SP, completion transition | one event cue at a time; lower M2 queues collapse to state summary |
| M3 action | player confirmation and routine result | short; rapid repeats collapse |
| M4 field | score and ambience | always yields to M0–M3 |

## 6. Required state-to-asset map

IDs below are replaceable cross-reference labels for required semantic responsibilities, not mandated registry structure and not proof of produced files. Every `MISSING — production/evidence required` state means that the actual asset, unchanged-identity proof, rights record, or integrated proof is absent.

| State | Required asset responsibility | Priority / cooldown and concurrency | Caption and visual equivalent | Current evidence |
|---|---|---|---|---|
| Room / Activity Home | `ROOM_FIELD_*`: stable room identity and quiet pre-arrival state | M4; loop-safe; immediate state exit | ambience label plus room-state mark when meaning changes | MISSING — production/evidence required |
| Broadcast | `ACT_BROADCAST_*`: plan, LIVE response, end/After | M2/M3/M4; action repeats collapse; no sound per viewer/comment | action/result caption and broadcast-state change | MISSING — production/evidence required |
| Video | `ACT_VIDEO_*`: select, edit, publish, long-tail state | M2/M3/M4; one publish cue; rapid edit cues collapse | publish/result caption and asset-idle mark | MISSING — production/evidence required |
| Singing | `ACT_SINGING_*`: preparation, diegetic performance, mastery response | diegetic bus plus M2; no stacked score; event-scoped | performance/state caption without judging “perfect” | MISSING — production/evidence required |
| Music production | `ACT_MUSIC_*`: fragment, arrangement, release, asset-idle | diegetic bus plus M2; one release cue; stem changes state-bound | work-state/release caption and arrangement-state mark | MISSING — production/evidence required |
| SNS | `ACT_SNS_*`: compose, publish, short-cycle decay | M3/M4; burst-collapse; dry and interruptible | publish/decay caption and state mark | MISSING — production/evidence required |
| Live event | `ACT_LIVE_EVENT_*`: prepare, anticipation, bounded peak, afterglow | M2/M4; one peak per event; no undifferentiated mash-up | phase caption and venue/event-state mark | MISSING — production/evidence required |
| Prestige | `PRESTIGE_CONFIRM`, `PRESTIGE_RELEASE`, `PRESTIGE_AFTER` | M0 confirmation then M2; no replay on reload; mandatory silence boundary | explicit loss/preservation/changed-law text and transition mark | MISSING — production/evidence required |
| SP1 | `SP01_TRANSITION` with SP1’s adopted meaning | M2; once per transition ID; reload-safe | SP1 retirement/orientation caption and visual | MISSING — production/evidence required; trigger itself UNKNOWN |
| SP2 | `SP02_TRANSITION` | M2; once per transition ID; reload-safe | SP2 retirement/orientation caption and visual | MISSING — production/evidence required |
| SP3 | `SP03_TRANSITION` | M2; once per transition ID; reload-safe | SP3 retirement/orientation caption and visual | MISSING — production/evidence required |
| SP4 | `SP04_TRANSITION` | M2; once per transition ID; reload-safe | SP4 retirement/orientation caption and visual | MISSING — production/evidence required |
| SP5 | `SP05_TRANSITION` | M2; once per transition ID; reload-safe | SP5 retirement/orientation caption and visual | MISSING — production/evidence required |
| SP6 | `SP06_TRANSITION` | M2; once per transition ID; reload-safe | SP6 retirement/orientation caption and visual | MISSING — production/evidence required |
| SP7 | `SP07_TRANSITION` with adopted numeric/semantic trigger | M2; once per transition ID; reload-safe | SP7 retirement/orientation caption and visual | MISSING — production/evidence required; numeric trigger UNKNOWN |
| SP8 | `SP08_TRANSITION` | M2; once per transition ID; reload-safe | SP8 retirement/orientation caption and visual | MISSING — production/evidence required |
| SP9 | `SP09_TRANSITION` | M2; once per transition ID; reload-safe | SP9 retirement/orientation caption and visual | MISSING — production/evidence required |
| SP10 | `SP10_TRANSITION` | M2; once per transition ID; reload-safe | SP10 retirement/orientation caption and visual | MISSING — production/evidence required |
| Main Completion | `MAIN_COMPLETION_*`, credits, Continue / Strong New Game orientation | M1/M2/M4; scene-scoped; ENTRY CHIME excluded unless §3 Owner gate passes | completion facts, credits, choice labels, preserved-history mark | MISSING — production/evidence required; structure Owner gate open |
| Save success | `SAVE_OK` | M3; collapse repeated autosaves; never interrupt M0–M2 | persistent saved-state indicator | MISSING — production/evidence required |
| Save failure | `SAVE_FAIL` | M0; immediate; duplicate errors coalesce without disappearing | error text, cause if known, recovery action | MISSING — production/evidence required |
| Recovery | `RECOVERY_OPEN`, `RECOVERY_RESULT` | M0; decision-scoped; no celebratory masking | restored checkpoint/time, preserved/lost scope, next action | MISSING — production/evidence required |
| Offline start/summary | `OFFLINE_SUMMARY` only; no per-tick cues | M2/M3; one bounded summary; never ENTRY CHIME | elapsed period, gains/changes, caps, person-state exceptions | MISSING — production/evidence required |
| Foreground resume | `RESUME_STATE` only when state meaning changed | M2/M3; one summary maximum; no queued replay | concise changed-state summary and history link | MISSING — production/evidence required |

The ten SP cues must remain ten separately addressable semantic events in whichever representation Forge selects, even if they share production material. “One stinger pitched up ten times” fails semantic identity review.

## 7. Voice / no-voice change gate

The default implementation assumption is **NO_VOICE**. Text, abstract non-verbal sound, music, and captions may carry the required meaning without implying an authentic Sakiya performance.

This is not an additional standing Owner decision in the canonical `ODG-01`–`ODG-12` register. If a proposal adds spoken/sung Sakiya voice, Work must first return the Creative/rights expansion to SAKIYA and create a new canonical ODG entry; until then `NO_VOICE` is the only allowed production scope.

Any spoken or sung Sakiya recording requires an Owner gate that names:

- exact clip/script and context;
- performer/source identity;
- creation or recording provenance;
- commercial scope and withdrawal path;
- permitted edits, timing, localization, and reuse;
- unchanged packaged/runtime identity proof and auditable state/trigger evidence references.

Existing music, streams, speech, likeness-derived voice, and synthetic or imitative voice are not assumed licensed. Synthetic imitation is forbidden unless a later explicit Owner decision and rights/safety review supersede this block. A generic “voice approved” flag is insufficient.

## 8. Diegetic singing/music versus score

Singing and music-production outputs are activity content inside the world. They use a **diegetic** bus and may be the object the player is observing, shaping, releasing, or remembering. The non-diegetic score supports state and scale from a separate bus.

Rules:

- score ducks or stops when diegetic content needs intelligibility;
- score must not falsely imply mastery, quality, or completion of an unfinished singing/music state;
- an activity work is not repackaged as background score without its own rights and Owner authorization;
- muting score must not mute diegetic content silently; controls label the distinction;
- if both play, the selected audio evidence representation preserves precedence, duck target, and exit behavior;
- a listener can identify Singing and Music production by their process/result grammar, not merely by swapping melodies.

## 9. Music and layer curve

- L1: room tone, PC fan, microphone state, isolated notification. The eligible first chime is a major event.
- L2: individual comments remain distinguishable; community presence creates a gentle bed.
- L3: activity-specific layers and bridge sounds coexist; routine notifications begin grouping.
- L4: crowd texture and institutional/media sounds intrude; the room reference remains audible.
- L5: low-frequency scale motion represents huge systems; only named or exceptional events enter the foreground.
- L6: wide field and synchronized activity resonance; a meaningful foreground event clears space rather than becoming merely louder.

Scale transitions resolve the old unit and introduce a changed field. They do not certify progress by adding bass, loudness, or more simultaneous notifications.

## 10. Background, offline, and resume burst policy

Background simulation produces state, not a queue of audible events. On resume:

1. discard all routine queued audio requests;
2. compute one state summary;
3. play at most one `RESUME_STATE` or `OFFLINE_SUMMARY` cue if a player-visible change occurred;
4. let save failure/recovery M0 meaning override the summary;
5. do not infer arrivals, ENTRY CHIME, BP/SP fanfares, or person events from aggregate deltas;
6. expose skipped major events through readable history and deliberate foreground replay only where the event contract permits it.

Rapid UI actions and resource bundles use the same burst-collapse principle. Sustained use must not build delayed notification debt; Forge chooses sufficient duration and hostile conditions.

## 11. Quiet moments and no-audio equivalence

Mandatory quiet moments include before an eligible first external arrival, after a meaningful exit, before Prestige confirmation, between unit retirement and new orientation, and after credits before Continue / Strong New Game. A quiet moment is an authored state, not missing audio.

Every S0–S2 cue has:

- a concise SE caption;
- a non-color-only visual signal;
- an event-history record;
- sufficient display time or pause support.

Mute mode cannot lose arrival, exit, revisit, CRITICAL precursor, Breakpoint, Prestige, SP transition, save failure, recovery, offline summary, or completion information. Caption and visual-equivalent mappings are required auditable meanings, not late accessibility annotations; their field names and storage schema are Forge-owned.

## 12. Rights gate

Before any audio acceptance, every recording, loop, voice, generated source, sample, and plugin-rendered asset requires the auditable meanings in §4 through a Forge-selected representation. Shared source recordings are permitted only when each state retains distinct meaning and the rights allow every use. A missing provenance or right is a release blocker, even if the file sounds complete.

## 13. Listening evidence and acceptance

Binding proof subjects are full-mobile listening, claimed output routes, mute/non-audio equivalence, interruption/resume, recovery, Reduced Motion interaction, sustained-use fatigue, and priority collisions. Forge owns devices, outputs, duration, case decomposition, capture, and report schema. The following is a replaceable coverage reference:

- selected iPhone-class mobile speaker;
- headphones;
- desktop or laptop speakers;
- mute with captions and visual signals;
- Reduced Motion plus captions;
- background/offline/resume and recovery paths;
- a sustained routine-play sample long enough to expose fatigue/queue debt; one continuous hour is a reference option.

Acceptance requires Forge-selected end-to-end proof of unchanged packaged/runtime asset identity; no clipping or painful transient; intelligible priority collisions; activity distinction; meaningful L1 quiet; non-fatiguing L6; no queued resume burst; and exact ENTRY CHIME identity/trigger evidence. Evidence must preserve exact-artifact identity, conditions, listener/reviewer basis, observed range, relevant asset set, finding status, repair, and regression result; concrete metadata fields, record schema, and capture layout are Forge-owned.

Current evidence inventory:

| Evidence | Status |
|---|---|
| final ENTRY CHIME source and unchanged packaged/runtime identity proof | MISSING |
| queryable packaged-audio identity/rights/trigger inventory; representation Forge-owned | MISSING |
| state-to-packaged-asset resolution | MISSING |
| base production scope | `NO_VOICE` — no standing Owner gate; any spoken/sung Sakiya voice expansion requires a new canonical ODG plus rights/Creative approval |
| Main Completion chime adoption | OPEN GATE |
| asset rights/provenance matrix | MISSING |
| device listening runs | NOT RUN |
| mute/caption/visual equivalence run | NOT RUN |
| sufficient sustained-use fatigue and resume-burst proof; duration Forge-owned | NOT RUN |

**Verdict: INSUFFICIENT EVIDENCE.** Forge may implement against this direction, but neither Creative Audio PASS nor release readiness may be claimed until the missing evidence exists and all BLOCKER/HIGH findings are closed.
