# ACCESSIBILITY / PLATFORM / RELEASE UX

Status: WORK SPECIFICATION COMPLETE / IMPLEMENTATION EVIDENCE NOT COLLECTED / RELEASE BLOCKED  
Source commit: 69b36a6ac59f1fad8157cb7ceb46ba352c476710  
Authority owner: SAKIYA STUDIO / Work  
Owner gates: commercial/public mobile package, controller support claim, supported-device promise; full mobile play itself is accepted

## 1. Purpose and evidence boundary

The complete game must remain understandable and operable when a player changes screen size, input, motion, sound, reading speed, contrast, or number notation. Accessibility is a product contract, not a release-week overlay.

This document separates three different claims:

| Claim | Current state | What would change it |
|---|---|---|
| accessibility and release-UX requirements are specified | SPECIFIED | this document is accepted into the Forge handoff |
| an implementation conforms to WCAG 2.2 Level AA | NOT TESTED | criterion-by-criterion audit of the exact release candidate, including assistive technology and manual testing |
| a platform build is release-ready | BLOCKED | Owner platform choice, implementation, device evidence, rights/privacy gates, regression, and release authorization |

No implementation, browser build, packaged build, screen-reader recording, device run, or audit report was inspected to create this specification. Therefore `PASS`, `WCAG conformant`, `accessible`, and `controller supported` must not be used as current product claims.

Equivalent player-visible access, supported-surface truth, failure/recovery behavior, and evidence categories are Binding Creative / Binding Test Intent. Framework, semantic implementation, device-lab plan, exact test cases/tools, packaging, and platform Engineering remain Forge-owned.

## 2. Accepted mobile premise and open delivery boundary

This section summarizes canonical `ODG-09` and `ODG-11`; `DECISION_REGISTER.md` controls state, safe default, evidence, and resolver authority.

`ODG-11` is now Owner accepted for its Creative requirement: the full product must be playable on supported mobile hardware from first launch through Main Completion, Continue, and Strong New Game. Mobile portrait and touch are primary; mobile landscape and lifecycle interruption are required supported states. A desktop-only product plus responsive mobile demo cannot pass.

Forge owns the technical alternative analysis. Its repository-grounded plan must compare at least the applicable classes below or propose a stronger route:

| Delivery class | Full-mobile requirement | Entitlement/save questions | Main risk to prove |
|---|---|---|---|
| installable entitled web/PWA | complete full product on supported mobile browsers/install mode | purchase/access authority, offline entitlement, local save, optional sync | cache/direct-URL bypass, platform variance, storage eviction, update and account/privacy scope |
| native-store mobile package | complete full product in selected mobile-store packages | purchase/restore, local save, optional cross-platform transfer | multiple builds/stores, review policy, signing, restore/refund, device/support burden |
| shared core with native wrapper or other Forge proposal | complete full product with one creative/system rule set | wrapper entitlement, migration/export, desktop relation if any | architecture/toolchain fit, platform APIs, performance, maintenance and rollback |

The exact architecture, framework, packaging, store integration, entitlement, and cross-device-sync design are not selected by Work. SAKIYA selects the commercial/public promise through `ODG-09` after Forge returns tradeoffs and evidence. Cross-device sync is optional; a complete local-first mobile save is sufficient unless the accepted public promise adds sync. A supplementary demo may exist, but never substitutes for the full mobile artifact.

## 3. Conformance target

The release target is **WCAG 2.2 Level AA for player-facing web UI or an equivalent outcome for packaged/native surfaces**. That target is a requirement; conformance is not a current result.

The player-visible conformance contract is below. Forge owns the semantic implementation. Native semantic HTML controls/landmarks and a parallel semantic surface for a custom renderer are reference approaches, not mandated architecture; any selected mechanism must expose equivalent actions, names, values, relationships, errors, and current state:

- prefer native platform semantics where they fit the selected runtime, or prove an equivalent semantic mechanism;
- when a canvas or custom renderer is used, preserve an equivalent operable and perceivable control/status outcome through the Forge-selected mechanism;
- preserve reading order, focus order, and action order across responsive rearrangement;
- expose every interactive control with a unique accessible name, role, state, value, and purpose;
- announce important async state without moving focus unexpectedly;
- keep instructions independent of color, shape, sound, position, hover, drag, or timing alone;
- test all applicable WCAG 2.2 A and AA success criteria; mark a criterion `N/A` only with written rationale and reviewer identity.

Primary actions, routine actions, pause, back, save recovery, Broadcast choices, comment choices, and all touch controls use a **minimum 44×44 CSS-pixel activation area**. Secondary controls may use the WCAG 2.2 AA 24×24 CSS-pixel minimum only where the criterion's spacing or equivalent-target exception is explicitly met and recorded. Visual glyphs may be smaller than their activation area.

## 4. Supported-layout contract

Mobile rows are mandatory full-product surfaces. Desktop rows apply if desktop is included in the accepted commercial package.

| Surface | Layout expectation | Required behavior | Release meaning |
|---|---|---|---|
| supported phone portrait | room anchor plus lower task sheet | safe areas, 44×44 targets, no horizontal core-flow scroll; all activities/Scale/history/completion reachable | mandatory full product / primary |
| supported phone landscape | adaptive split or focus mode | rotation does not lose pending choice, state, event order, or focus; no landscape-only advantage | mandatory full product / secondary |
| supported tablet portrait/landscape | adaptive split or sheet | same complete rules and decisions; larger area improves breathing room, not information authority | mandatory if tablet is claimed; scope stated explicitly |
| installed web app | standalone lifecycle | install, offline, storage, audio unlock, background/resume, update and eviction states explicit | mandatory if web/PWA route selected |
| native/wrapper app | mobile lifecycle | pause/background/termination/resume, purchase restore, storage/update and OS interruption are recoverable | mandatory if native/wrapper route selected |
| mobile browser fallback | browser chrome present | no essential fullscreen, hover, or install dependency; entitlement state truthful | full or unsupported according to accepted route; never silently a demo substitute |
| desktop 1366×768 / 1920×1080+ | room-centered landscape | no clipped number, choice, save state, or return path | full product only if desktop is claimed |

At 400% zoom or a 320 CSS-pixel-wide equivalent viewport, core task flows reflow to one dimension without losing content or requiring two-dimensional scrolling, except content that genuinely requires two-dimensional presentation and has an accessible alternative. At 200% text size, current action, result, save state, and way back remain visible and operable.

## 5. Semantic, focus, and status contract

### 5.1 Structure and names

- One visible page title and one programmatic page/surface heading identify the current surface.
- Navigation, main play area, event log, profile/status, and settings use landmarks or an equivalent hierarchy.
- Repeated listener comments are list/feed items; their speaker, time/order, type, and relationship to the Broadcast are programmatically available.
- Icon-only controls have visible or programmatic names that describe the action, not the icon shape.
- Numeric controls expose full values and units; abbreviations and animated counters do not replace the accessible value.
- Validation errors identify the field, error, and repair path and are associated with the field.

### 5.2 Focus order and restoration

- Focus follows logical reading/action order, not absolute visual coordinates.
- Opening a modal, sheet, menu, event detail, or confirmation moves focus to its heading or first relevant control.
- Closing it restores focus to the invoking control; after that control disappears, focus moves to the nearest logical successor with a status announcement.
- No keyboard, screen-reader, pointer, or gamepad focus trap is permitted. A true modal traps focus only while open and always has an operable close/back route.
- Route, responsive, speed, pause, update, and reconnect changes never reset focus to the document start without explanation.
- Skip links or equivalent shortcuts reach the current decision, event log, and settings without traversing the complete comment feed.

### 5.3 Status announcements and comment-spam control

- `polite`-priority announcements cover autosave completion, non-critical gains, new optional events, offline summary readiness, and filter changes.
- `assertive`-priority announcements are reserved for failed save/import, destructive confirmation, blocked progression, or a decision requiring immediate repair.
- Animated resource ticks and ordinary comments are **not** announced one by one. They are aggregated into player-selected intervals, a digest, or on-demand history.
- Comment arrival frequency, announcement frequency, visual density, and auto-scroll are separately controllable. Pausing or reading older comments prevents focus theft and forced scroll.
- Critical visual/audio cues also create a durable log entry that can be revisited after the announcement.

## 6. Input matrix and gamepad gate

| Action | Touch | Mouse | Keyboard | Required result |
|---|---|---|---|---|
| navigate surfaces | tap / sheet | click / wheel | Tab, arrows where conventional, Enter, Escape | same reachable destinations and state |
| choose Before / After | tap | click | focus and confirm | option, consequence, and cancel are readable |
| A2 reaction | single tap | click | remappable key plus confirmation | no rapid-tap or timing advantage |
| A3 comment choice | tap choice | click choice | focus or arrows plus confirm | no free-text requirement |
| pause / resume | persistent control | persistent control | visible control plus shortcut | state announced and preserved |
| speed | segmented control | click | visible control plus shortcut | current speed exposed as state |
| inspect event / number | tap detail | click/focus, never hover-only | focus and expand | exact value and cause available |
| cancel / back | visible back | visible back; right-click optional only | Escape plus visible control | never gesture-only |

No release-critical action requires gesture-only input, multi-touch, precise drag, rapid tapping, voice, color recognition, or hearing.

**Gamepad is an Owner/platform claim gate.** Keyboard and pointer parity are baseline. Before store copy, settings, or badges claim controller support, Forge must provide a complete action map, remapping policy, visible device-appropriate prompts, focus navigation, disconnect/reconnect and hot-swap recovery, vibration controls, pause access, text-entry fallback, and end-to-end evidence with each promised controller class. If that evidence is absent, controller support is explicitly `not supported` in public requirements rather than partially claimed.

## 7. Timing, reading, and cognition

- Every Broadcast state can pause without losing a pending choice.
- Important event text does not expire while focused or while a screen reader is reading it.
- Comment flow offers at least three player-selectable speeds, pause, history, and digest.
- ×2, ×4, and Digest never remove history, causality, or review access.
- Any creatively necessary time limit can be extended, paused, or disabled.
- Offline return is summarized before another timed activity begins.
- Instructions use stable terms from the product ontology and do not require remembering a prior transient toast.
- Destructive and irreversible-seeming choices provide consequence, scope, and recovery information before confirmation.

## 8. Contrast, text, reflow, color, and flash

- Normal text meets at least 4.5:1 contrast; large text meets at least 3:1, subject to the WCAG definitions and applicable exceptions.
- Essential non-text controls, focus indicators, and state boundaries meet at least 3:1 against adjacent colors.
- Hover, focus, selected, disabled, error, Critical, and Scale states remain distinguishable in high contrast and without color.
- Browser zoom and OS text scaling are supported; text is not baked into production images when it conveys essential information.
- Text presets, line/paragraph spacing, high-contrast mode, plain/scientific/engineering/game-suffix notation, grouping, and precision controls are available.
- The current Scale Unit is written beside newly introduced magnitudes; exact values and definitions are available on demand.
- No release effect intentionally flashes more than three times in one second. Any unavoidable flashing content must also pass the applicable WCAG flash threshold, and this requires measured evidence.

## 9. Motion and audio alternatives

- Reduced Motion is available before the first animated scene and initially follows `prefers-reduced-motion` or the platform equivalent.
- It replaces camera travel, shake, large zoom, parallax, particle fields, pulsing, and animated number travel with cuts, short fades, outlines, and static before/after comparison.
- Animation never blocks input, save recovery, or reading; essential state is present after motion is disabled.
- Music, SFX, ambience, voice if any, and critical cues have independent controls plus master mute.
- S0–S2 cues have captions or labels, a visual equivalent, and a durable event-log entry.
- Caption size, background, speaker, and non-speech cue display can be configured.
- Mute has no gameplay penalty and speech recognition is not required.

The exact ENTRY CHIME audio remains the canonical source asset across scale. Its critical meaning must also be available as text/state; the accessibility alternative does not remix or replace the canonical audible asset for players who keep it enabled.

## 10. Install, audio, cache, storage, autosave, and update states

Every applicable runtime exposes the following player-visible states. A state may be omitted only when the selected platform cannot enter it.

### 10.1 Install and launch

| State | Required UX |
|---|---|
| install unavailable | normal browser play remains possible for the demo; no dead install button |
| install available | optional install action explains what is installed and whether it is demo or full |
| install in progress / failed | progress or failure plus retry/browser continuation |
| installed / standalone | visible version and access to update, storage, export, and uninstall guidance |
| offline launch unavailable | reason and recovery; never a blank shell |

### 10.2 Audio unlock

| State | Required UX |
|---|---|
| audio locked by browser/OS | explicit player gesture such as `Start with sound`; visual game state remains valid |
| unlocked | settings reflect actual channels and volume |
| muted by player/system | visible mute state and caption parity |
| decode/load failure | non-audio play continues; durable warning and retry path |

No important cue fires only during the pre-unlock gap. The first ENTRY CHIME either waits for a valid unlock or is replayable from its event without changing its canonical source.

### 10.3 Cache and offline readiness

| State | Required UX |
|---|---|
| first load / caching | progress and online requirement are explicit |
| offline-ready | exact content/version boundary is recorded |
| partially cached | not described as offline-ready; missing scope and repair shown |
| stale cache / version mismatch | preserve save, defer play if incompatible, offer update or safe old version |
| cache failure | browser continuation or retry; no false success |

### 10.4 Storage and autosave

| State | Required UX |
|---|---|
| storage available | last successful save time/version is inspectable |
| persistence request unavailable/denied | explain eviction risk and offer export without coercion |
| quota low / eviction risk | warning before data loss; cleanup and export route |
| saving | non-blocking status; repeat actions do not corrupt state |
| saved | polite confirmation and durable timestamp |
| save failed | assertive notice, retry, export where possible, and no false saved state |
| recovery required | preserve last known-good save and show source/version before restore |

### 10.5 Update and migration

| State | Required UX |
|---|---|
| update found | release type, version, and whether reload/migration is needed |
| downloaded / waiting | player chooses a safe apply point; no mid-Broadcast reload |
| applying | backup created before migration and progress is visible |
| migration succeeded | new version plus preserved profile/history summary |
| migration failed | old save/build path retained, rollback offered, diagnostic export separated from profile text |
| unsupported old version | readable reason, backup, supported conversion route, and support path |

An update never starts a Broadcast, accepts a choice, clears history, changes entitlement, or silently overwrites the only recoverable save.

## 11. Save and offline behavior

- Quit after a meaningful decision cannot silently lose it.
- Export identifies included profile/history data; import previews version, date, profile, origin, and compatibility before overwrite.
- Reset uses two-step confirmation, names the affected scope, and identifies recovery availability.
- Offline return separates elapsed time, asset contribution, caps, and exceptional events.
- Offline progress never fabricates named-person relationship events that required witnessed participation.
- Clock anomalies produce a recoverable notice, not punishment or save deletion.
- A phone call, notification, lock, app switch, low-memory termination, orientation change, or OS background suspension cannot accept a choice, duplicate offline reward, lose a witnessed event, or corrupt the save.
- Short mobile sessions resume into a concise causal orientation: what completed, what paused, what changed offline, and what consequential choice remains.
- If any supplementary demo can export to the full build, import accepts data only, validates schema and bounds, strips executable content, never grants entitlement, and records the transfer result.

## 12. Required accessibility proof subjects — replaceable coverage reference

Binding Test Intent requires full-mobile, claimed-input, assistive-technology, compound-setting, lifecycle, and real-device evidence sufficient for truthful supported-surface claims. Forge owns the device-lab matrix, exact OS/browser/runtime/AT versions, tools, case split, sample/duration, and result/report schema. The list below is a strong replaceable coverage reference, not a mandated minimum case matrix:

- current and older supported iPhone/iOS plus current and lower-bound supported Android hardware, with exact mobile runtime/package;
- touch-only complete critical path and representative first-30m, every Layer/SP, Main Completion, Continue, and Strong New Game checkpoints on the full-product mobile artifact;
- portrait/landscape, safe-area, software-keyboard, interruption/background/resume, storage pressure, thermal/memory, audio unlock, offline/update and low-power cases;
- desktop configurations, keyboard-only, and mouse-only full core-flow runs only if desktop is publicly claimed;
- NVDA with a supported Windows browser and VoiceOver with the relevant Apple surface, plus any platform-native screen reader required by the selected option;
- mute, headphones, speaker, and audio-unlock-denied runs;
- 200% text, 400% zoom/320 CSS-pixel equivalent, high contrast, Reduced Motion, captions, and non-color cue runs;
- **combined-settings runs**: screen reader + keyboard + 200% text; Reduced Motion + high contrast + mute; maximum text + narrow viewport + comment digest; offline + storage denial + update waiting;
- automated scanning followed by manual criterion review; automation alone is insufficient;
- focus order/restoration recording, status-announcement transcript, comment-spam test, and flashing measurement;
- controller runs only if controller support is selected and publicly claimed.

Simulator-only evidence is insufficient for any promised physical-device gate. Evidence must identify the exact artifact, claimed physical-device/assistive context, reproducibility basis, expected and observed outcomes, findings, and regression result; concrete fields and report organization are Forge-owned.

## 13. Current primary references

- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- W3C WCAG 2.2 target size minimum: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- W3C WCAG 2.2 enhanced 44×44 target: https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html
- W3C Reduced Motion technique: https://www.w3.org/WAI/WCAG22/Techniques/css/C39
- Apple button hit-region guidance: https://developer.apple.com/design/human-interface-guidelines/buttons
- Apple Home Screen web apps: https://developer.apple.com/videos/play/wwdc2023/10120/
- PWA installation guidance: https://web.dev/learn/pwa/installation
- itch.io HTML5 payments: https://itch.io/docs/creators/html5
- Steam Direct fee: https://partner.steamgames.com/doc/gettingstarted/appfee

Platform behavior and store facts are time-sensitive. The linked primary Steam and itch.io sources were checked for this Work on 2026-08-27. Any later platform decision, evidence, or public claim must be supported by then-current authoritative rules; Forge and the qualified reviewer own recheck timing, cadence, and procedure according to change risk.

## 14. Gates

P1 cannot pass until pause, history, readable speed, non-color cues, Reduced Motion, mute parity, keyboard, mouse, text scale, number notation, offline summary, and save recovery exist as working player-visible behavior with evidence.

Release remains **BLOCKED** until all of the following are true:

1. Forge returns and implements an accepted full-mobile delivery/entitlement/save boundary; the commercial/public promise is accepted through ODG-09.
2. Supported OS, browser, device, input, assistive technology, and minimum hardware claims are explicit.
3. Applicable WCAG 2.2 A/AA review has no unresolved blocker and no unwaived high-severity defect.
4. All promised devices and combined settings have real-build evidence and repaired defects have regression evidence.
5. Install, audio unlock, cache, storage, autosave, offline, update, migration, and rollback states applicable to the chosen route are evidenced.
6. Rights, privacy, security, commercial, and public-release gates in document 10 pass.
7. Sakiya provides Final Acceptance and a separate public release authorization.
