# UI / VISUAL / MOTION DIRECTION

Status: WORK SPECIFICATION COMPLETE / VISUAL CREATIVE PASS: **INSUFFICIENT EVIDENCE**  
Source commit: 69b36a6ac59f1fad8157cb7ceb46ba352c476710  
Authority owner: SAKIYA STUDIO / Work  
Engineering owner: Implementation Forge / Codex  
Method: design-game-interface for interface contracts; direct-game-visuals for game-only visual, motion, and asset direction

## 1. Purpose and current verdict

The interface must make a very large incremental game readable without turning the work into a detached spreadsheet. The same room remains the visual horizon from the first quiet Broadcast to U10. Panels support decisions; they do not replace the room as the product’s face.

This document is complete enough to commission wireframes, visual-development boards, motion prototypes, and implementation. It does **not** grant a visual Creative PASS. There is no canonical Owner-approved Sakiya likeness, costume, room reference, final typeface, final palette, representative gameplay mock, or multi-viewport capture in evidence. Those items remain **UNKNOWN / OWNER GATE**, and section 20 defines the evidence required to close them.

## 2. Accepted invariants and responsibility boundary

- PC-camera view of Sakiya’s room is the permanent Activity Home.
- Camera angle, desk, main Sakiya silhouette, face-safe zone, Broadcast HUD zone, activity-display zone, and world-intrusion zone remain recognizable.
- World growth appears through the room rather than replacing it.
- U0–U10 are semantic units, not eleven reskins or number abbreviations.
- Different activities must not become identical card grids or recolored progress bars.
- Important events remain reviewable through pause, history, receipts, and replayable summaries.
- UI never assigns rarity, sale value, performance rank, desirability tier, or optimization score to a person.
- Every accepted ENTRY CHIME use resolves to the exact same canonical source asset and a visual/caption equivalent. Document 07 fixes the first external arrival once per lineage as eligible and separately governs TEST-DEPENDENT later triggers; this document does not make every arrival eligible.
- A1/A2/A3 changes LIVE participation opportunities, not Sakiya’s personhood or the player’s authority over her.
- Information conveyed by color, sound, motion, hover, or spatial position has a text/shape/focus equivalent.
- The room, Sakiya, people/history, accepted works, firsts, and Scale-retirement receipts survive Prestige, Scale Peak, completion, Continue, and Strong New Game.
- Mobile portrait/touch is the primary complete-product condition from UI-00 through U10, Main Completion, Continue, and Strong New Game; desktop cannot hold exclusive information, efficiency, or strategy.

This document owns screens, navigation, information order, responsive behavior, visual grammar, motion arbitration, asset inventory, and visual acceptance. Economy numbers remain owned by documents 03/05; activity rules remain owned by 04; sound identity remains owned by 07; input/accessibility minimums remain owned by 09. If those sources do not define a rule, UI labels it UNKNOWN rather than inventing it.

Player-visible hierarchy, states, continuity, equivalence, visual/motion intent, forbidden outcomes, and evidence categories are Binding Creative / Binding Test Intent. Component architecture, rendering stack, breakpoint implementation, animation engine, capture tooling, exact executable tests, and visual-regression method are non-binding Engineering Recommendations owned by Forge.

## 3. Screen inventory and critical-state matrix

### 3.1 Common state contract

Every root or task surface implements the following state families, even when a family resolves to “not applicable.”

| State family | Required visible contract |
|---|---|
| READY | current purpose, current state, primary action, secondary/detail access, persistent way back |
| LOADING / CALCULATING | named operation, determinate progress when knowable, safe cancel when available, no false completion |
| EMPTY / FIRST USE | why the surface exists, one appropriate first action, no shame or fake content |
| LOCKED / UNAVAILABLE | semantic unlock reason in player language; no unexplained disabled control or hidden monetization |
| OFFLINE / STALE | what is local, what cannot refresh, timestamp/version, safe action; promised local-first play remains available |
| ERROR / RECOVERY | plain cause category, preserved work, retry/restore/export/report path, incident/reference ID where useful |
| PENDING / UNCONFIRMED | exact gain, loss, uncertainty, and reversible back path before commitment |
| SUCCESS / RECEIPT | what changed, why, what persisted, archive/history link, next meaningful action |

Critical states never depend on a toast alone. A toast may announce; the destination surface or event ledger retains the state.

### 3.2 UI-00–UI-20 × critical-state matrix

| ID / surface | READY and primary intent | LOADING / EMPTY / LOCKED | OFFLINE / ERROR | PENDING / IRREVERSIBLE | SUCCESS / RETURN |
|---|---|---|---|---|---|
| UI-00 Launch / Continue | New, Continue, Restore; show last safe save and version | first run explains local save; loading names migration/validation step | corrupted/incompatible save offers non-overwriting recovery, export, and fresh-profile path | migration preview names schema change and backup; reset needs deliberate confirmation | land in UI-02 with migration/restore receipt available in UI-17/19 |
| UI-01 Participation Profile | choose named, anonymous, or skip; explain where it appears | no field is mandatory unless justified; unavailable characters explain format | write failure preserves draft; offline has no penalty | preview exact fictional-facing display; cancel restores previous profile | saved profile announces edit-later path and returns to origin |
| UI-02 Activity Home / Room | understand now, change, next 2–3 actions, bottleneck | first use gives room-led orientation; locked activities show prerequisite; catch-up can pause for review | stale/offline banner does not cover room; recovery anchors to affected system | major event pending stays visible without blocking history/settings; destructive task routes to preview | receipt appears in room object/event ledger; focus returns to initiating affordance |
| UI-03 Broadcast Before | select purpose and 2–4 meaningful preparation choices | no viable plan explains missing input; locked option shows reason/consequence | draft persists on error, rotation, and offline | plan shows projected range, uncertainty, and possible consumption; Back preserves draft | Start moves to UI-04; cancel returns UI-02 with retained plan unless explicitly discarded |
| UI-04 Broadcast LIVE | observe; A2/A3 may offer at most 1–2 contextual actions; topic/person event readable | waiting remains a living room, not spinner; unavailable A2/A3 is not framed as failure | render/audio interruption retains simulation/event ledger; resume at semantic boundary | Pause/speed shows presentation mode; leaving offers leave-and-summarize | UI-05 receives ordered events; arrival/exit/revisit/CRITICAL remain inspectable |
| UI-05 Broadcast After | decide what to preserve, connect, archive, or leave | no highlight still states what happened; locked bridge explains future possibility | write/publish failure preserves selections and source events | compare preserve/do-not-preserve, downstream use, and capacity; no false urgency | receipt identifies archive/material/relationship change; Home and next-hook available |
| UI-06 People & Continuity | recall who appeared and shared history without optimization stats | empty says no arrivals recorded; absent/revisit are states, not locks | damaged/missing record shows uncertainty and never fabricates a person state | merge/import conflict needs side-by-side provenance and non-destructive choice | return restores filter/focus; change has audit entry |
| UI-07 Video Workspace | choose material, shape, publish, inspect reach/long tail | empty material points to Broadcast After; processing has named stage; locked publication explains why | offline draft remains editable; failed render/publish keeps source and settings | publish preview shows material, route, cost/time range; replacing a cut preserves a version | completed work becomes a room/catalog object with route/history link |
| UI-08 Singing Workspace | choose practice focus, improve/accelerate/master, preserve take | no take or condition explains next action; process never implies fake perfection | device/audio failure offers no-audio/text path and preserves state | keep/replace compares expression evidence and downstream use without ranking Sakiya | breakthrough/take updates object, capability, and archive; return retains focus |
| UI-09 Music Workspace | assemble fragments, complete, release, read long tail | empty points to valid source; arrangement stage explicit; locked distribution explains why | local arrangement survives offline/failure; render/release retry preserves sources | release preview names fragments, catalog effect, time/cost; replacement is versioned | durable catalog object, listening state, and bridges persist |
| UI-10 SNS Workspace | choose short-cycle action and read temporary context/effect | no useful context is valid; cooldown shows time and alternative, not engagement bait | offline queue explicit/cancellable; failed action preserves draft | confirm context and decay window; no dark-pattern countdown | receipt separates temporary signal from durable work and returns Home |
| UI-11 Live-event Workspace | combine accepted systems into a bounded event | planning gaps are named readiness dimensions; lock explains missing venue/system | interruption preserves plan and creates recovery/after record; offline limits stated | Start shows dependencies/fallback; abandoning creates honest closure | afterglow/record routes to UI-05/17, not generic reward |
| UI-12 Cross-activity Map | decide which output becomes another input and why | unavailable/one bridge/bottleneck/saturation each distinct | stale route marks calculation basis; failure leaves sources unchanged | compare current/candidate, gain/loss, delay, and reversibility | one causal bridge changes, ledger updates, focus returns to changed node |
| UI-13 Automation | compress work already understood; configure boundaries | missing manual proof names requirement; paused/conflict first-class | error pauses affected automation without deleting config; catch-up uncertainty visible | preview names compressed work, retained choice, limit, and rollback | receipt shows summarized work and next higher-order decision |
| UI-14 Prestige | compare current economy release with preserved meaning | unavailable shows semantic conditions; calculation exposes uncertainty | failure restores pre-Prestige snapshot; export/incident path visible | compare RELEASE / PRESERVE / GAIN / RECOVERY; two-step confirmation | result shows causal change and preserved evidence; recovery orientation remains |
| UI-15 Scale Transition | understand old unit, Moment, Retirement, new unit | blocked until evidence contract; orientation replayable | interruption resumes from checkpoint; failure cannot partially retire data | preview names frozen values, permanent history, new decision, UNKNOWN thresholds; SP1 disabled in P0 | receipt records old/new unit, Moment, preservation, time; room gains persistent delta |
| UI-16 Analysis | understand bottleneck, contribution, forecast, uncertainty | insufficient data says so; debug facts are not implied | stale basis/partial-data warning attaches to forecast | scenarios remain previews until applied; hostile-path warning stays traceable | applied decision links to result; Back restores filters |
| UI-17 Archive / History | revisit people, works, firsts, BP/SP, Prestige, receipts | empty sections explain source action; imported history shows provenance | damaged/missing entry marked, never synthesized; archive works offline | delete/reset/export routes to UI-19 confirmation; merge conflict non-destructive | return preserves filter, scroll, selected item, and origin |
| UI-18 Goals / Records | see current possibility, completed proof, discovery, post-goal | hidden discovery avoids spoiler; no current goal supports meaningful free play | stale/failed evaluation shows basis/retry, never silently revokes proof | Challenge/Strong NG previews persistence and exclusions | proof links to receipt/history and next mode; no automatic U11 |
| UI-19 Settings / Accessibility / Save | live-preview legibility, audio, motion, input, data | unavailable device feature has alternative; presets never forced | save/export/import failure preserves save and names recovery; offline expected | import/reset/overwrite has backup, diff/version, explicit confirmation | applied setting perceivable; focus returns to control; save receipt inspectable |
| UI-20 Main Completion / Credits | final Anchor Broadcast, last choice, Continue/Strong NG | missing SP10/stable-U10 precondition explicit; assets load progressively | interruption resumes; any final person event is a real system event, not a fabricated fallback; invalid completion stays unclaimed | final U10 choice and Strong NG persistence previewed; optional completion-chime use remains an Owner gate | receipt, U0–U10 basis, credits, Continue, Strong NG; if Owner adopts a qualifying completion event, it references the same canonical ENTRY CHIME |

## 4. Activity Home as the root

### 4.1 Root navigation map

Activity Home is both a place and the navigation root. Opening a panel never turns the fiction into a separate operating-system dashboard.

| Root destination | Room entry affordance | Screens reached | Persistent return target |
|---|---|---|---|
| NOW / ROOM | room, current event, next-action cluster | UI-02, UI-03, UI-04, UI-05 | last stable state in UI-02 |
| ACTIVITIES | distinct work objects, not six identical tiles | UI-07–UI-11 | originating object in UI-02 |
| CONNECTIONS | route surface / evidence object | UI-12, UI-13, UI-16 | originating bridge/automation/bottleneck |
| CONTINUITY | people/history/archive shelf or device | UI-06, UI-17, UI-18 | prior filter/item or room affordance |
| CHANGE SCALE | pending BP/Prestige/SP evidence object; never a flashing permanent CTA | UI-14, UI-15, UI-20 | exact pre-preview state |
| SYSTEM | stable settings/save affordance | UI-19, UI-00 recovery routes | prior screen and focused control |

Desktop may use a compact labeled rail plus in-room affordances. Portrait uses a labeled 3–5 item bottom/root bar and a More sheet only when all targets stay reachable; Room remains the first destination. Icon-only root navigation is forbidden.

### 4.2 Back, Escape, focus, modal, and deep-link contract

| Concern | Contract |
|---|---|
| Back | returns to the immediately meaningful parent, not only browser history; restores filter, scroll, selection, sheet height, and focus; never discards an unconfirmed draft |
| Escape | dismisses tooltip/popover, then non-critical modal/sheet; leaving an active presentation requires its leave summary; never confirms Prestige/Scale/reset |
| Focus entry | panel title or first error summary receives focus only when context changes; ordinary updates do not steal focus |
| Focus return | close returns to invoker; if it vanished, use nearest stable parent and announce why |
| Focus trap | only a genuine modal traps focus; drawers and analysis surfaces remain in document order |
| Modal use | only destructive/meaning-retiring decisions, blocking permission/system failure, or a required confirmation; no nested modals |
| Deep link | validates save/profile/version, opens target with breadcrumb/back to UI-02; locked target shows reason/next action; missing record never redirects silently |
| Browser/system Back | mirrors app Back where safe; draft/active LIVE gets one non-dark-pattern safeguard |
| Rotation/resize | preserves active state, text, selection, timeline position, modal semantics, and focus ownership |

### 4.3 Tutorial and first-run contract

- Tutorial is a contextual layer over real UI, not a fake parallel sequence.
- Each instruction binds to one stable semantic target and works for keyboard, pointer, touch, and assistive technology.
- Skip now, Show again, and Reset hints are always available.
- Skipping never hides unlocks, removes resources, punishes the player, or labels them unprepared.
- First run teaches Room as root → Before choice → LIVE observation/optional participation → After preservation → History/way back.
- Tutorial masks never obscure Sakiya’s face, a person event, an accepted ENTRY CHIME visual/caption cue, or critical recovery.
- At 200% text and portrait width, instruction reflows into a sheet while retaining target relation.
- A hint cannot demand a locked, offscreen, hover-only, or absent A1/A2/A3 control.
- Completion is recorded per semantic lesson, not screen coordinate.

## 5. Information hierarchy and comparison grammar

### Activity Home

1. What is happening now.
2. What changed since the last meaningful choice.
3. The next two or three meaningful actions.
4. The current bottleneck in player language.
5. Optional exact numbers, uncertainty, history, and analysis.

The default does not show every currency. A resource appears when it affects the current decision. Retired resources move to history with a receipt.

### Broadcast LIVE

1. Sakiya and the room.
2. Named arrival / exit / revisit; separately, any accepted ENTRY CHIME event uses its unchanged canonical asset and cue.
3. Current topic and readable event flow.
4. A1/A2/A3 opportunity, if present.
5. LIVE/HYPE or equivalent supporting state, never the sole emotional content.

No popup, number burst, tooltip, comment wall, world effect, or tutorial mask covers Sakiya’s face or the named-person event. Accelerated presentation retains person-event order and identity rather than converting it to a total.

### Comparison

Every economic, route, automation, Prestige, Scale, import, reset, or Strong New Game comparison follows:

CURRENT → PROPOSED → GAIN → RELEASE / LOSS → PERSISTS → UNCERTAINTY → CONFIRM / BACK

Missing terms show UNKNOWN and the decision owner. Green/red alone is forbidden; labels, values, shapes, and accessible descriptions carry meaning.

## 6. Spatial invariants and responsive safe zones

Coordinates are normalized to the content-safe viewport after cutouts, browser chrome, and platform insets. They constrain prototypes but do not substitute for canonical art.

### 6.1 Cross-viewport invariants

- R0 Room Anchor: desk edge, primary light source, and one persistent landmark remain identifiable in UI-02–05 and major transitions.
- R1 Sakiya Anchor: face/head-and-shoulder silhouette stays in the same compositional neighborhood within each viewport mode; exact likeness remains UNKNOWN / OWNER GATE.
- R2 Face-safe zone: no text, badge, toast, particle, unrelated focus ring, tooltip, or root navigation overlaps the approved face polygon plus breathing margin.
- R3 Event lane: genuine arrival/exit/revisit has a reserved name/event/caption lane outside routine gain queues.
- R4 Decision lane: primary decision and confirm/back pair remain available together without horizontal scrolling.
- R5 World-intrusion zone: Scale imagery enters through approved windows, displays, seams, reflected light, or depth boundaries and cannot erase R0–R4.
- R6 System-safe zone: offline/save/update/error status remains visible but never masquerades as world fiction.

### 6.2 Wide desktop / landscape

| Zone | Normalized allocation | Invariant |
|---|---|---|
| Room field | at least 58% width and full available height behind/alongside bounded UI | room remains dominant, never a thumbnail |
| Sakiya / face-safe | within room’s central 45% width; exact polygon derives from final rig/reference | no overlay; named event uses adjacent lane |
| Decision panel | up to 36% width, side or lower dock; may collapse to labeled handle | title, state, primary action, Back visible at default text |
| Event lane | room-adjacent; at most two simultaneous semantic cards before ledger queue | ordered, non-overlapping, names readable |
| Root navigation | stable edge outside face/event zones | labels visible or exposed on focus, never hover-only |
| Analysis/history | non-modal side layer or task view | active context remains perceivable and never gets deleted |

At 1366×768 and 1920×1080, standard Activity Home shows Room, Sakiya anchor, current state, one primary action, and Back/root without scrolling. Ultrawide adds breathing room rather than scattering related controls.

### 6.3 Mobile portrait

This is the primary full-product profile under Owner-accepted `ODG-11`. Every activity, comparison, history/receipt, Prestige/SP, U10 decision, completion, Continue, Strong New Game, settings, save/recovery, credits, and support route must be reachable here without desktop-only information or controls.

| Zone | Normalized allocation | Invariant |
|---|---|---|
| Room anchor | top 38–48% of content-safe height in UI-02/04; may expand at rest | Sakiya and one room landmark stay legible, not wallpaper |
| Face-safe | upper-room center with reference-derived polygon | no sheet, comments, tutorial, or toast crosses it |
| Event lane | directly below/alongside room, one semantic event at a time | later events queue in ledger; critical person event cannot be swiped away |
| Decision sheet | lower 40–52%; peek/task/expanded-detail snap points | primary action and Back share a snap point; only focused creation tasks may hide room temporarily |
| Root navigation | labeled bottom safe edge; focused mode has explicit Home/Back | targets meet document 09 minimum and safe inset |
| Keyboard/input | sheet/field moves above software keyboard | focus, text, confirm, cancel remain visible; task never restarts |

At 390×844 and 430×932, current state, room/Sakiya anchor, primary action, and way back appear in the first viewport at default text. At 200% text the task may scroll, but a sticky labeled summary keeps current context with confirm/back.

### 6.4 Tablet, narrow landscape, and interruption safe areas

- Tablet/narrow landscape uses desktop hierarchy with a collapsible decision drawer.
- Mobile landscape uses that contract and treats notches/gesture regions as unusable.
- System banners occupy R6, push content rather than overlay face/action, and collapse into a reopenable status item.
- Picture-in-picture, browser zoom, text scaling, and split-screen cannot make Confirm overlap Back or place critical information under a cutout.
- If height is too small to show the room meaningfully, use a labeled room/Sakiya continuity strip rather than pretending the full invariant remains.

## 7. Visual direction and quality axes

### 7.1 Visual proposition

> An ordinary, lived-in activity room stays emotionally close while the world’s methods of measuring it become increasingly inadequate.

The first reading order is Sakiya here → activity in progress → someone/something changed → choice available. Cosmic or numerical spectacle may never invert that order into effect → number → dashboard → person.

### 7.2 WORK-recommended quality balance

- 55% lived daily room and human presence.
- 25% playful, high-energy activity identity.
- 20% precise world anomaly and scale intrusion.

These are direction ratios, not pixel quotas. Owner may amend them after visual comparison evidence.

### 7.3 Material and edge hierarchy

- Room: physical, imperfect, touched, accumulated through use; variation follows history rather than random clutter.
- Sakiya: strongest intentional silhouette and expression readability; no plastic-smooth “AI idol” rendering.
- Activity workspaces: distinct materials and causal objects, not a universal dashboard.
- World intrusion: cleaner/stranger than the room, attached to current Unit inadequacy, never ornamental mystery.
- UI: crisp enough for large numbers, long Japanese labels, uncertainty, focus, and comparison; no generic neon glass.
- VFX: follows event source → path → changed receiver; particles without a causal origin are rejected.
- Scale change: expressed through what current measuring objects cannot contain, not by increasing bloom or particle count.

Final character appearance, costume, body proportions, exact room arrangement, illustration/3D/2D technique, and canonical palette remain UNKNOWN / OWNER GATE.

## 8. U0–U10 Room Delta Ledger

Every Unit has one persistent, inspectable room delta. Deltas accumulate or are archived into a visible continuity object; they do not replace the room master. Exact art is a WORK hypothesis pending canonical reference.

| Unit | Current meaning | Persistent room delta | Active-state proof | Must remain | Visual failure |
|---|---|---|---|---|---|
| U0 | individual participation | ordinary desk, PC-camera framing, one-person event ledger, first-name trace | arrival/exit/revisit appears individually | original room master and first-event position | empty tutorial showroom or collectible-person slots |
| U1 | stream viewers | one display/object represents simultaneous presence and stay flow | occupancy/attention changes read without listing everyone | named firsts and person histories one action away | replacing people with one crowd number |
| U2 | community | repeated-return traces, shared phrases/actions, continuity occupy a lived surface | differing community responses leave distinct marks | individual events and Broadcast history | fan-wall trophies, rarity frames, worship imagery |
| U3 | content network | screens/shelves/cables/routes expose durable works moving between activities | source work visibly connects to receiver | room, people, community traces | generic node graph covering the room |
| U4 | activity ecosystem | work surfaces exchange materials; bottlenecks become physical/digital constraints | player can point to what feeds/blocks another activity | representative works and routes | six identical production bars |
| U5 | cultural reach | window/monitor/seam shows imitation, opposition, institutions, shared action as different effects | equal reach produces visibly different cultural responses | ecosystem routes and original context | one applause meter or fame aura |
| U6 | social infrastructure | schedules, standards, institutions, durable systems touch room through purposeful instruments | rules/coordination change future activity | cultural-response plurality | office-dashboard takeover |
| U7 | planetary attention | exterior/context surfaces show regions/time/context without flattening | same total has different planetary compositions/choices | social systems and room-local anchors | globe hologram as bigger number |
| U8 | civilization observation | room receives multiple civilization-scale interpretations/observation conditions | delivery/preservation changes by observer context | planetary plurality | faceless species icons or worshippers |
| U9 | interstellar observation | depth/seams/displays connect zones with different delay/conditions | propagation and Anchor Session synchronization visible | civilization contexts and local history | star map replacing Activity Home |
| U10 | cosmic resonance | boundaries briefly become ambiguous through propagation/resonance while desk, silhouette, real-arrival lane stay fixed | inspect how meaning propagates, not only how far | complete U0–U9 basis, receipts, first arrival, room | cosmic backdrop, deification, automatic U11 tease |

DAY 1 / ORIGINAL ROOM is directly reachable from U2 onward and remains one action away at U10. It is a preserved historical state with current navigation, not a newly staged nostalgic recreation.

## 9. Ten Scale Peak visual deltas

Each SP has four beats: Inadequacy → Moment → Semantic Retirement → New Orientation. The Moment cannot be a number burst; the result persists in the Room Delta Ledger and UI-15 receipt.

| SP | Transition | Pre-peak inadequacy shown | Non-skippable semantic beat | Persistent post-peak delta | Compression / replay |
|---|---|---|---|---|---|
| SP1 | U0→U1 | individual event listing cannot describe simultaneous/stay flow | UNKNOWN: P0 records candidates and does **not fire SP1** | first stream-level measuring object while names/history persist | no production animation until trigger accepted |
| SP2 | U1→U2 | viewer flow cannot explain return/shared behavior | community relationship becomes a decision input | shared-continuity surface beside person ledger | replay names individual basis |
| SP3 | U2→U3 | community state cannot explain durable works/routes | a work becomes an independently circulating causal object | first cross-activity route/object | community source → work → route |
| SP4 | U3→U4 | content paths cannot explain mutual production/bottleneck | several activities become an ecosystem | multi-workspace flow and bottleneck evidence | preserve representative route, not every particle |
| SP5 | U4→U5 | throughput cannot explain shared meaning/behavior | cultural consequence diverges from reach | plural cultural-response surfaces | contrast same reach/different consequence |
| SP6 | U5→U6 | cultural effect cannot explain durable rules/systems | social infrastructure changes future activity | standards/institution/coordination instrument | consequence → rule → changed activity |
| SP7 | U6→U7 | UNKNOWN numeric trigger; equal totals with different connections must differ | planetary context becomes necessary for a new choice | plural region/context surface | blocked until Forge evidence and Owner decision |
| SP8 | U7→U8 | planetary totals cannot explain civilization observation | observer context changes delivery/preservation | civilization-observation surface | preserve context disagreement |
| SP9 | U8→U9 | one civilization cannot contain all observation conditions | interstellar conditions become composition decisions | depth/seam/zone synchronization surface | follow selected Anchor Session basis |
| SP10 | U9→U10 | zone count cannot explain self-propagating resonance | final retirement, stable U10 choice, room basis, and a real person event; completion use of ENTRY CHIME is conditional on document 07 Owner gate | cosmic-resonance delta with ordinary room and person lane intact | credits/Continue/Strong NG retain receipt; any adopted chime use references the canonical asset; no U11 |

Skip after first view may compress staging, but still shows old Unit, new Unit, persistence, and receipt. Reduced Motion uses cuts/value/outline and a four-step textual receipt; it cannot reduce SP to “Unlocked.”

## 10. Six activity visual grammars

Shared shell elements—Back, state, compare, accessibility, history—may stay consistent. The causal workspace may not be a recolored clone.

| Activity | Material metaphor | Object family | Workspace/layout grammar | Success grammar | Failure/constraint grammar | Forbidden clone |
|---|---|---|---|---|---|---|
| Broadcast | time, presence, topic, shared room air | microphone, camera frame, topic notes, event ledger, LIVE clock | Before plan objects → room-dominant LIVE → After preservation table; people use reserved lane | genuine arrival/revisit, carried topic, retained highlight, or continuity changes room/history | quiet/exit/missed chance remains humane and legible; no red “bad viewer” | Video timeline with LIVE badge; tap-to-fill HYPE |
| Video | selected material shaped through cuts and publication | source clips, cut markers, sequence strip, contact sheet, publish route | edit sequence with source provenance and long-tail response; draft version visible | coherent cut locks, work becomes durable object, route reaches distinct context | missing source, incoherent cut, render/publish delay are repairable states | queue cards or Music arrangement recolor |
| Singing | repetition, breath/condition, embodied mastery, preserved take | lyric/practice sheet, breath phrase, take marker, condition cue | focused phrase/take lane with improve/accelerate/master; expression not score rank | expression/capability expands; exceptional take becomes preservable and reusable | fatigue/unstable take shown without humiliation or fake perfection | rhythm-game judgment lane; star rating |
| Music | fragments assembled into durable arrangement/catalog | motifs, stems/fragments, arrangement lanes, work object, catalog shelf | multi-source composition with versioned arrangement and long-tail listening | fragments become a completed work with identity and continuing use | incompatible/missing fragment, unfinished structure, release delay reversible | Video editor recolor; crafting recipe grid |
| SNS | short-cycle context, timing, response, decay | draft note, context window, route/thread, response pulse, decay trail | compose/context → live response window → decay/result; temporary versus durable clear | right context exposes/accelerates route or reveals response without pretending permanence | no useful context, cooldown, opposition, decay; no streak-loss bait | “post for +X followers” button |
| Live event | bounded orchestration of works, people, place/time, readiness | run-of-show, venue plan, labeled dependencies, rehearsal/checklist, record | causal planning board → event room/stage → afterglow/record; fallback visible | several activity strengths combine into a bounded event and durable record | readiness gap, interruption, cancellation/recovery, aftercare; no shame spectacle | bigger Broadcast skin or one composite bar |

At L4–L6, each grammar scales by changing what its native object means—such as a Video route becoming a cultural route—rather than replacing all six with one cosmic control panel.

## 11. Sakiya expression, pose, and interruption matrix

This is an animation/state requirement, not a likeness sheet. Face shape, costume, proportions, line/render technique, and exact gestures remain UNKNOWN / OWNER GATE.

| State | Expression intent | Body/pose intent | May interrupt | Must not imply | Reduced/static equivalent |
|---|---|---|---|---|---|
| room idle / waiting | present, self-directed, not frozen | independent small activity; breathing/desk interaction | M0–M3 semantic events | doll awaiting orders | meaningful idle key poses plus environment/state cue |
| speaking / hosting | active ownership of Broadcast | forward/engaged mic-camera orientation | genuine arrival may create glance/pause | player ventriloquism | mouth/pose key, speaker label, transcript/event |
| listening / reading | attention toward person/topic | gaze/upper-body shift to source | M0 arrival can begin state | evaluation of person quality | source marker plus listening pose |
| amused / energized | spontaneous causal response | open/contained motion proportional to event | higher person/critical event transitions naturally | loot celebration on every gain | expression key plus event text |
| surprised | event-specific recognition | short recoil/turn, then recover | M0/M1 only while active | exaggerated endless loop | key-pose contrast plus emphasis line/value |
| troubled / uncertain | concern about situation, not punishment | pause, reduced motion, look to relevant object | recovery/error can take UI focus | morale meter optimized by gifts | object emphasis, restrained pose, state label |
| tired / condition change | bounded human condition with response | slower posture, stretch/rest/desk change | safety/system and arrival remain perceivable | player-caused penalty or purchasable affection | condition icon/text and pose swap |
| breakthrough / mastery | recognition of learned capability | activity-native decisive gesture | M0 waits for semantic beat unless safety requires | perfection/rank judgment | before/after pose/object plus capability receipt |
| reflective / After | processing what happened | review posture toward preserved material/history | M0 or blocking recovery; M4 aggregates | empty reward-claim screen | key pose plus ordered ledger |
| Scale inadequacy | measure no longer explains world | attention between room anchor and failing measure | M0 real arrival remains highest; SP resumes | fear/awe as sole scale emotion | object contradiction plus text |
| Main Completion | full continuity, not deification | returns from U10 scale to ordinary room relation | real person event takes focus; ENTRY CHIME participates only if document 07 Owner gate adopts that event | goddess/idol worship tableau | original-room composition, person card/caption, receipt; optional accepted canonical-chime cue |

### Interruption rules

- Sakiya never snaps between unrelated emotions because a routine resource event fired.
- A reaction cites its causal event ID in animation/debug evidence.
- High-priority interruption exits at a tagged semantic boundary; resumption uses a plausible bridging pose or cut.
- A1 displays autonomous behavior. A2/A3 may acknowledge optional participation but never becomes a command animation.
- Silence under A2/A3 produces no disappointment, penalty, or manipulative reminder.
- Named-person events never choose a “better person” expression from hidden value.

## 12. Typography, palette, icon, title, VFX, and store inventory

Final fonts, colors, likeness, logo drawing, and key art remain unapproved. The inventory defines responsibility and proof, not final appearance.

### 12.1 Typography

| Token/family | Use | Required behavior | Evidence |
|---|---|---|---|
| TYPE-DISPLAY | title, rare BP/SP/completion headings | Japanese/Latin harmony, small-capture clarity, no ambiguous novelty glyphs | licensed font/provenance and title comparisons |
| TYPE-UI | navigation, controls, body, errors | full supported Japanese coverage, readable punctuation/numerals, 100–200% scaling | glyph audit and viewport captures |
| TYPE-NUMERIC | rates, ranges, large values, comparisons | tabular figures where needed; abbreviation/exponent has spoken label; no clipping | extreme-value matrix and accessible names |
| TYPE-EVENT | names, arrivals/revisits, receipts, captions | hierarchy without rarity ornament; robust wrapping | long-name/two-line/zoom captures |
| TYPE-CODE/META | save/version/incident IDs only | distinct but readable; not used to make ordinary UI look technical | recovery captures |

Forge proposes candidates with commercial embedding rights, glyph evidence, fallback behavior, and bundle/performance cost. Text baked into raster gameplay art requires an equivalent live-text layer.

### 12.2 Functional palette tokens

| Token | Semantic role | Constraint |
|---|---|---|
| ROOM-BASE / LIGHT / SHADOW | lived-in continuity | derived from canonical room reference; stable across Units |
| SAKIYA-SILHOUETTE / FACE-SEPARATION | character readability | works across intrusion states without halo treatment |
| ACTION-PRIMARY / SECONDARY | interaction hierarchy | label, shape, focus, and position also carry state |
| STATE-INFO / SUCCESS / CAUTION / ERROR | system status | contrast verified in every composite; no red/green-only pair |
| PERSON-EVENT | arrival/exit/revisit lane | no rarity colors; text/shape names event type |
| ACT-BROADCAST / VIDEO / SINGING / MUSIC / SNS / LIVE-EVENT | activity wayfinding | accents only; material/object/layout works without color |
| UNIT-U0…U10 | measurement context | world-intrusion behavior, not full-screen hue swap |
| FOCUS / SELECTION / DISABLED | input state | visible over all materials and under Reduced Motion |

Exact values require canonical art and contrast captures over room, Sakiya, activity, event, error, and Scale screens.

### 12.3 Icon and state-mark inventory

- Root marks: Now/Room, Activities, Connections, Continuity, Change Scale, System.
- Six activity marks derived from causal objects, not arbitrary symbols.
- Person events: arrival, exit, revisit, first, history—neutral shape plus text, no star/gem/rarity border.
- Work states: source, draft, processing, complete, released, long-tail, failed/recoverable, unavailable.
- System states: offline, stale, saving, saved, recovery, migration, warning, error, update.
- Controls: play, pause, resume, ×1, ×2, ×4, Digest, skip staging, replay, history, compare, undo.
- Progression: BP evidence, Prestige preview/receipt, SP inadequacy/Moment/retirement/new Unit; no crown/deity shorthand.
- Accessibility: captions, text cue, Reduced Motion, contrast, text size, input mode.

Every icon has a semantic name, live label, monochrome proof, small-size legibility proof at each actual use, focus/disabled/selected states, and directionally correct behavior.

### 12.4 Title and in-product brand

| ID | Asset | Variants / layers | Acceptance |
|---|---|---|---|
| TTL-01 | primary Japanese title lockup | horizontal, compact, monochrome, high/low contrast | readable at launch and thumbnail scale; no misleading genre badge |
| TTL-02 | optional Latin/romanized companion | horizontal/stacked relation to TTL-01 | never competes with or renames Japanese title |
| TTL-03 | launch-title composition | room/Sakiya-safe placement, save/state-overlay safe | UI-00 states remain readable |
| TTL-04 | BP/SP/completion title cards | live text plus motion/static templates | Unit, cause, receipt path legible |
| TTL-05 | app/store icon | small silhouette, monochrome mask, safe crop | no tiny-face dependence or unreadable text |

### 12.5 VFX inventory

- VFX-EVENT: arrival/exit/revisit/CRITICAL localization; preserves name and source.
- VFX-WORK: activity-native completion/bridge/long-tail; one causal path and changed receiver.
- VFX-BP: evidence-object change, not generic explosion.
- VFX-PRESTIGE: release/preserve/new-rule comparison.
- VFX-SP01–10: ten distinct inadequacy/Moment/retirement/orientation packages.
- VFX-WORLD-U0–10: persistent intrusion with low-motion and low-performance variants.
- VFX-ERROR/RECOVERY: system-only, never confused with story anomaly.
- VFX-COMPLETION: U0–U10 basis, room return, real-person-event focus; include the canonical-chime visual equivalent only if its document 07 Owner gate is adopted.

Each package needs full, Reduced Motion, static-capture, low-performance, high-contrast, and no-audio evidence, including flash/pattern review.

### 12.6 Store and release-facing assets

| ID | Asset family | Required content | Prohibition |
|---|---|---|---|
| STORE-01 | hero/key art | canonical Sakiya, recognizable room, one truthful scale intrusion | no non-game costume/room, fake roster/co-op, or deification |
| STORE-02 | gameplay captures | Home; Before/LIVE/After; two distinct activities; cross-activity; Scale; portrait/desktop | no mock UI presented as shipped gameplay |
| STORE-03 | short trailer/capture | first room → human arrival → work continuity → impossible scale → same room | no ENTRY CHIME variant or spectacle-only misrepresentation |
| STORE-04 | capsule/thumbnail crops | title, silhouette/room landmark, safe crops, locale variants | no unreadable logo or unapproved face crop |
| STORE-05 | feature panels | Shared Agency, six activities, Asset Idle/Meta, Retirement, accessibility/offline/save | no unverified claim |
| STORE-06 | accessibility/media kit | captions, alt text, transcript, input/platform statement | no image-only claim |

Exact dimensions follow the selected storefront’s current official specification at production time. Masters retain layered sources, safe guides, rights/provenance, locale separation, alt text, capture build/version, and concept-versus-gameplay disclosure.

## 13. Anti-reference and rejection tests

| Anti-reference | Why it fails | Review question |
|---|---|---|
| generic neon-glass incremental dashboard | erases lived room/activity identity | could the shot belong to any idle game after title swap? |
| uniform AI glow/rim light/particles | destroys hierarchy and causality | why does each luminous element exist? |
| card wall with six colored activity tabs | treats verbs as database categories | can each activity be recognized in grayscale without title? |
| rarity frames/hearts/affection meters for people | violates Personhood | does any person look collectible or optimizable? |
| Sakiya as controllable doll/mascot | makes participation command/ownership | does silence or choice force an obedient emotion? |
| corporate control-room late game | replaces co-creation with management | are room and Sakiya still the emotional center? |
| worship/throne/halo/deity finale | turns scale into deification | could the image read as worship? |
| generic starfield/planet hologram | treats scale as backdrop | what old unit failed and what new decision appeared? |
| loot explosion for BP/Prestige/SP | hides release/persistence/meaning | can player explain what retired and remained? |
| number confetti/red failure shake | fatigue and access risk | is meaning complete with motion/audio off? |
| social-media engagement bait | makes SNS compulsive | are streak, urgency, or follower totals manipulating return? |
| fake nostalgia recreation | weakens continuity proof | is DAY 1 preserved state rather than newly staged art? |
| marketing art substituted for gameplay | blocks honest validation | is capture from cited build? |

Review includes grayscale activity recognition, a five-second who/where/what-changed/what-next test, Personhood red team, and side-by-side anti-reference rejection sheet.

## 14. Motion priority and arbitration

### 14.1 Priority lanes

Lower number is higher priority.

| Priority | Event | Presentation contract |
|---|---|---|
| M0 | accepted ENTRY CHIME use; blocking safety/data-loss recovery | brief environmental space, one clear visual/caption cue; accepted chime use references the exact canonical asset; system recovery uses a separate lane and no chime |
| M1 | Main Completion / active Scale Peak Moment | staged semantic transition with retirement/new orientation; pauses at inspectable boundaries |
| M2 | Prestige / Breakpoint / first critical activity completion | clear before-and-after causality, never a generic explosion |
| M3 | person revisit / CRITICAL / first synergy / mastery breakthrough | localized emphasis around person, object, or bridge |
| M4 | ordinary work completion / resource change | restrained, aggregatable, suppressible, ledgered |
| M5 | ambient room / decorative loop | slow, nonessential, immediately cancellable |

An ENTRY CHIME use receives M0 presentation space because it is a human anchor. Document 07 makes the first external fictional-person arrival once per lineage a Binding Creative trigger; later qualifying events remain under its test-dependent policy and Owner gates. This visual document does not infer that every arrival qualifies. A safety/data-loss block may share M0 priority but never the chime treatment.

### 14.2 Arbiter states

| Arbiter state | Entry | Behavior | Exit |
|---|---|---|---|
| IDLE | no semantic motion active | M5 ambient may run | next event |
| PLAYING [event, boundary] | event accepted | event owns one semantic focus lane; unrelated M4 aggregates | completed boundary/event |
| PREEMPTING | higher-priority event arrives | finish one approved micro-boundary or cut for safety; snapshot resumable meaning | new event begins |
| QUEUED | equal/lower semantic event arrives | persist event ID/time/cause; present critical items in order; only routine M4 may aggregate | lane available or Digest |
| PAUSED | user/system pause | freeze presentation clock; preserve queue/boundary; state reason | Resume, Digest, leave-and-summarize |
| DIGESTING | user selects Digest or backlog needs review | ordered cause/result/person/receipt list; no false real-time animation | mandatory items acknowledged or recorded |
| CANCELLED | cancellable decorative/preview motion stops | apply final readable state or restore preview origin | stable UI |

Implementation may choose queue architecture, but cannot drop M0–M3 identity, reorder person events, or merge BP/Prestige/SP silently. Routine M4 may aggregate by source/interval only when exact detail remains in history. M5 never queues.

### 14.3 Queue, cancel, pause, resume, and navigation

- One semantic focus lane plays at a time. A distinct system-recovery lane can interrupt without pretending to be a story event.
- Equal-priority person events preserve event-time order. A repeated request for the same event ID deduplicates and logs the suppression.
- Cancel may stop ambient motion, travel between already-known values, uncommitted preview, tooltip/sheet transition, or routine aggregation.
- Cancel cannot abort committed save/migration/Prestige/Scale without an explicit transaction rollback contract.
- Pause freezes the presentation timeline at a semantic boundary. Whether Asset Idle simulation continues is owned by system rules; UI states the rule and elapsed basis.
- Resume re-establishes current person/topic/object context before motion continues; it never jumps straight into reaction.
- Leaving UI-04 offers Resume LIVE, Leave and summarize, or Stay as appropriate. Browser/system interruption takes a safe snapshot.
- Opening Settings does not discard the queue. Enabling Reduced Motion converts current presentation at the next safe boundary with no semantic loss.
- A modal cannot let hidden animation complete invisibly. The result waits or appears as an explicit receipt on return.
- The queue has no silent overflow. If presentation falls behind, mandatory events move to Digest with count and oldest/newest time; this is not a dropped-event success state.

## 15. ×1 / ×2 / ×4 / Digest equivalence

P0-FEEL accepts only ×1 and ×2 for comparison. ×4 and Digest remain later candidates until event memory, causality, fatigue, and Shared Agency gates pass.

| Semantic element | ×1 | ×2 | ×4 candidate | Digest candidate | Invariant |
|---|---|---|---|---|---|
| Before choice | full | full; transition durations shorten | full; no auto-choice | selected choice shown with edit path | decision and uncertainty |
| Sakiya state | continuous readable motion | fewer in-betweens/shorter holds | key poses and semantic cuts | ordered still/key-pose summary | no random emotion or player puppeting |
| accepted ENTRY CHIME event | full presentation space and cue | same source; surrounding ambience alone shortens | same source and minimum readable visual/caption hold | ordered qualifying-event card; cue only represents the actual accepted event, never UI click | event ID, order, exact source asset, trigger log |
| other arrival / exit / revisit | full | shorter transition | semantic card/key pose | ordered card/ledger item | identity and relationship meaning; no implied chime eligibility |
| A1/A2/A3 opportunity | normal window | tested readable window; no reaction-rate advantage | disabled until input/fatigue proof; cannot demand reflex | chosen/silent result, no fabricated input | silence unpunished; no command |
| CRITICAL / first synergy | localized beat | shorter nonsemantic travel | key before/after | cause/result pair | cause, receiver, persistence |
| routine gain | individual/short aggregate | stronger aggregation | bounded aggregate | totals by source/time with drill-down | exact detail in ledger |
| BP / Prestige / SP | full semantic sequence | transitions may shorten after first view | four required beats remain | inadequacy/Moment/retirement/orientation receipt | gain, loss, persistence, new decision |
| After | full review | full decision; motion shorter | full decision | ordered outcome with preserve/connect choice | preservation agency |

Speed changes apply at a semantic boundary, show active mode in live text, and are reversible. No mode changes economic yield merely because the player watches faster. When simulation and presentation time differ, UI-16/17 exposes both bases.

## 16. Reduced Motion equivalence

| Full presentation | Reduced Motion replacement | Meaning that survives |
|---|---|---|
| camera pan/zoom to object | immediate cut plus outline/value emphasis | source object and changed receiver |
| parallax/world-depth intrusion | static layer change plus labeled seam/thumbnail | current Unit and room continuity |
| screen shake/impact bounce | border/shape/value change and concise label | importance without vestibular load |
| traveling route particles | static highlighted path with ordered endpoints | causal route direction |
| number fly-up/confetti | anchored delta and receipt | prior value, new value, cause |
| animated comment/event stream | one stable card at a time plus ledger count | order, identity, unread items |
| Sakiya transition animation | key-pose crossfade or hard cut at semantic boundary | expression intent and cause |
| BP/Prestige/SP staging | user-paced four-panel sequence | inadequacy, Moment, release/preserve, new orientation |
| completion expansion/contraction | original-room/U10 matched cuts plus basis panel | full-scale continuity returning to one person event |
| pulsing warning/cooldown | static icon/label/timestamp | severity and action |

Reduced Motion is a live setting, not restart-only. It applies to current/queued events without loss, suppresses nonessential autoplay, preserves control timing, and never removes VFX-only information without equivalent text/shape.

## 17. Performance and capture modes

- Low-performance mode reduces density, shader/effect complexity, simultaneous routine motion, and ambient animation; it retains person events, causal paths, focus, room anchor, and Scale meaning.
- Static capture mode pauses ambient M5 and records build/version, viewport, input, text scale, motion, audio, and Unit outside the player-facing crop.
- Evidence uses deterministic seed/state where possible and identifies mock, concept, or composited elements.
- Loading placeholders preserve final zones/accessibility names and do not shift face/action positions after load.
- If the approved art technique cannot meet low-end/portrait readability, return the technique to Owner review rather than silently reducing the portrait experience.

## 18. Production asset manifest

Counts remain planning estimates until canonical reference and animation technique are approved.

The package names and record fields below are a replaceable production reference, not a mandated file/schema decomposition. Forge may reorganize them if every required visual surface/state, source/right, accessibility meaning, build link, and rollback route remains traceable.

| Package | Required contents |
|---|---|
| ART-ROOM | canonical room master; safe-zone map; responsive crops; U0–U10 persistent deltas; DAY 1 state; low-performance/static variants |
| ART-SAKIYA | approved model/sheet; costume; pose-angle needs; face-safe polygons; section 11 states; interruption bridges; portrait/desktop proofs |
| ART-ACTIVITY | six distinct object/material/layout kits; empty/active/success/failure/recovery; U4/U7/U10 transformations |
| ART-PERSON-EVENT | arrival/exit/revisit/first/history marks; long-name/caption variants; zero rarity/performance encoding |
| ART-PROGRESSION | BP1–24 evidence templates/objects; Prestige preview/result/receipt; SP1–10 packages; U0–U10 marks |
| ART-UI | root nav; panels/sheets/modals; comparison; focus/input states; loading/empty/locked/offline/error/pending/success; icon/type/palette tokens |
| ART-VFX | M0–M5; Full/Reduced/static/low-performance/high-contrast/no-audio proofs |
| ART-COMPLETION | final Anchor Broadcast; U0–U10 basis; eligible real-arrival lane if Owner adopted; receipt; credits; Continue; Strong NG; no U11 asset |
| ART-TITLE/STORE | TTL-01–05 and STORE-01–06 with layered masters, rights, crop/localization guides, truthful captures |

Whatever representation Forge selects must make stable identity, owner, source/rights, creation method, canonical-reference version, dimensions/density, color profile, alpha behavior, safe crop, states/variants, localization dependency, accessibility description, build introduction, and replacement/rollback meaning retrievable.

## 19. Acceptance tests

### 19.1 Interface and responsive

- UI-00–20 each demonstrate every applicable section 3 state and screen-specific recovery/return.
- At 390×844, 430×932 and the accepted lower-bound phone viewport, plus selected tablet/desktop/low-end/split-screen viewports, state, primary action, and way back have no clipping/overlap. Mobile evidence uses the full-product artifact and covers beginning-to-post-goal states; an optional demo cannot substitute.
- Room/Sakiya/event/decision/system zones are machine-checkable where possible and reviewed over final art.
- Back, Escape, browser Back, deep link, rotation, keyboard, modal focus/return, tutorial skip/replay pass keyboard, touch, pointer, and assistive-technology runs.
- At 200% text, no information/action loss occurs; scrolling and sticky summaries remain truthful.

### 19.2 Visual identity and Personhood

- A five-second reviewer identifies who / where / current activity / what changed / what next.
- Reviewers distinguish all six activities without titles and in grayscale above a predeclared test threshold.
- U0–U10 captures preserve original room anchors and show a causal Unit-specific delta.
- Ten SP captures/replays show inadequacy, Moment, Retirement, orientation, and receipt; SP1 remains absent in P0.
- No person uses rarity/performance/value ornament; no Sakiya state implies ownership, gift obligation, silence punishment, or deification.
- Anti-reference red team finds no generic dashboard/card-wall/AI-glow/cosmic-backdrop substitution.

### 19.3 Motion and equivalence

- Deterministic event storms prove M0–M3 identity/order are not dropped; M4 aggregation drills into ledger; M5 never queues.
- Preemption, pause, resume, cancel, modal interruption, background interruption, and mid-event Reduced Motion preserve boundary and receipt.
- ×1/×2 passes P0 memory/fatigue/Shared Agency before selection; ×4/Digest stay disabled until their own evidence passes.
- Full, Reduced, no-audio, high-contrast, and low-performance modes communicate the same event cause/result/person/order.
- Every accepted ENTRY CHIME use in eligible scenes resolves to the same unchanged canonical asset through document 07's Forge-selected packaged/runtime identity proof; trigger decisions and suppression evidence match document 07.

### 19.4 Assets and store truthfulness

- Canonical Sakiya/room reference, Owner record, rights/provenance, and replacement policy exist before final production.
- Typography passes Japanese glyph, long-name, extreme-number, fallback, embedding-rights, and 100–200% tests.
- Palette/icon/VFX pass contrast, monochrome, non-color, flash/pattern, small-size, focus, and no-audio checks in real composites.
- Store captures cite build/version and label concept/mock versus gameplay; claims match implementation.
- No placeholder art, dead control, debug panel, generic AI prose, missing-state icon, unlicensed font, or uncited generated/third-party asset remains in a release candidate.

## 20. Required evidence and open Owner gate

### 20.1 Evidence ledger

The evidence categories and acceptance coverage are Binding Test Intent. `EV-*` IDs, artifact forms, storage paths, fixture structure, and capture/report schema below are replaceable references owned by Forge; equivalent evidence passes only when it supports the same player-visible verdicts and traceability.

| Evidence ID | Artifact required | Minimum coverage | Gate closed |
|---|---|---|---|
| EV-UI-01 | interactive navigation prototype + focus trace | UI-00–20; Back/Escape/modal/deep-link/tutorial; keyboard/touch/pointer/AT | interface topology |
| EV-UI-02 | critical-state contact sheet/video | each applicable section 3 state for UI-00–20 with recovery/return | state completeness |
| EV-VIS-01 | canonical Sakiya/costume/room reference + Owner approval | likeness, silhouette, face polygon, room anchors, rights/provenance | final character/room production |
| EV-VIS-02 | three-direction comparison board | room/person-first ratio, activity identity, intrusion; anti-reference sheet | art direction and quality balance |
| EV-VIS-03 | representative gameplay mock/capture set | Home; Before/LIVE/After; six activities; UI states; desktop/portrait | visual Creative review |
| EV-VIS-04 | U0–U10 Room Delta captures | eleven matched-angle states plus DAY 1 access | continuity and scale language |
| EV-VIS-05 | SP1–10 storyboard/prototype | four beats, persistent delta, replay/skip/Reduced; SP1 held pending | Scale Peak language |
| EV-CHR-01 | expression/pose/interruption sheet + state capture | each section 11 row; A1/A2/A3; silence; preemption; Reduced | personhood/character motion |
| EV-ACT-01 | activity identity boards + grayscale test | six material/object/layout/success/failure systems at room/late scale | non-clone activity language |
| EV-MOT-01 | deterministic arbiter capture/log | M0–M5 storm, queue, preempt, cancel, pause/resume, modal/background | event integrity |
| EV-MOT-02 | speed/equivalence study | ×1/×2; later ×4/Digest; Full/Reduced/no-audio/low-performance | mode acceptance |
| EV-TYPE-01 | typography/extreme-content matrix | Japanese glyphs, long names, large numbers, 200%, fallback, rights | type acceptance |
| EV-COLOR-01 | palette/icon/VFX composite audit | room/activity/error/Scale; contrast, monochrome, focus, flash | visual accessibility |
| EV-STORE-01 | title/store pack + capture manifest | TTL-01–05, STORE-01–06, build/version, crop, locale, rights, alt text | truthful release art |
| EV-REG-01 | approved baseline + regression report | representative viewports/states/modes after later changes | Quality Ratchet |

Evidence must make artifact location, build/commit, viewport/device, fixture/seed or equivalent reproducibility basis, input, text scale, motion/audio/contrast settings, capture date, reviewer, finding linkage, disposition, and rerun result retrievable. Storage schema is Forge-owned.

### 20.2 Current verdict

| Review target | Verdict | Reason |
|---|---|---|
| interface specification | READY FOR PROTOTYPE / FORGE REVIEW | screen/state/navigation/responsive/motion contracts explicit |
| final character and room direction | **INSUFFICIENT EVIDENCE** | canonical Owner-approved reference absent |
| activity visual distinctness | **INSUFFICIENT EVIDENCE** | grammars exist; six-activity image set/grayscale result absent |
| U0–U10 and SP continuity | **INSUFFICIENT EVIDENCE** | ledgers exist; matched room states/SP prototypes absent |
| motion Creative PASS | **INSUFFICIENT EVIDENCE** | arbitration contract exists; deterministic captures/logs absent |
| store/release visual readiness | **INSUFFICIENT EVIDENCE** | title/store masters and truthful gameplay captures absent |
| overall visual Creative PASS | **INSUFFICIENT EVIDENCE** | EV-VIS-01 through EV-REG-01 remain open |

### 20.3 Owner decisions before final-art production

These are sub-decisions/evidence under canonical `ODG-07` (production reference), accepted `ODG-11` (full-mobile premise), and open `ODG-09` (commercial/delivery promise), not a second Owner register. `DECISION_REGISTER.md` controls status and authority.

1. Provide or approve canonical Sakiya character, costume, and room references with rights/provenance and repository path.
2. Approve or amend the WORK-recommended 55/25/20 balance after EV-VIS-02.
3. Select art/animation technique only after portrait, desktop, low-performance, Reduced Motion, and interruption proof.
4. Confirm the final commercial/mobile delivery route under `ODG-09` after Forge compares PWA/native/shared-core tradeoffs. `ODG-11` already requires full mobile play; this decision may alter packaging, entitlement and support, never reduce mobile to a demo.

Until these decisions and artifacts exist, prototypes are labeled CONCEPT / NOT FINAL ART, carry stable comparison IDs, and cannot be cited as Creative PASS or store-ready evidence.
