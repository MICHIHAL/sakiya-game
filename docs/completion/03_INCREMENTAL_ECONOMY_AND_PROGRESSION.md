# INCREMENTAL ECONOMY AND PROGRESSION

Status: WORK RECOMMENDED CREATIVE SPECIFICATION / P0 VALIDATION REQUIRED  
Project: MICHIHAL/sakiya-game  
Source commit: 69b36a6ac59f1fad8157cb7ceb46ba352c476710  
Authority owner: SAKIYA STUDIO / Work for Creative meaning; Implementation Forge for technical implementation

## 1. Purpose

This document defines the player-visible meaning of the economy, Main Progression, bottleneck transitions, Breakpoints, Automation, Prestige, and the P0-SIM validation contract.

It does not define internal data structures, tick rate, RNG implementation, simulator architecture, test framework, or source-code design.

## 2. Sources and state

Source IDs refer to `00_SOURCE_LEDGER_AND_TRANSITION.md`.

| Source | Use |
|---|---|
| SRC-01 | current authorization to execute this Work |
| SRC-02 | Owner-accepted release-ready completion target |
| SRC-03 | current product direction and accepted core |
| SRC-04 | v0.7 economy, time, activity, Prestige, P0, and invariant definitions |
| SRC-05 | Foundation Freeze P0 domain and prototype boundary |
| SRC-08 | repository Work completion lineage; its v1.2 authority correction is active as recorded in document 00 |

The repository v1.2 prompt and `FORGE_EXECUTION_AUTHORITY_CONTRACT.md` are the active operational contract. The attached v1.1 and earlier same-name prompts remain lineage/supplementary detail only, as resolved in document 00.

### FACT

- Main Progression's final bottleneck resource is UNKNOWN in v0.7 and the Foundation Freeze.
- The accepted time economies are Session, Asset Idle, and Meta Incremental.
- P0-SIM compares A1–A3, B1–B3, and C1–C3: 27 configurations.
- The active Work contract requires BP1–BP3, video, and first synergy in its Integrated First 30 Minutes test.
- v0.7 gives L1 a two-hour budget, three Breakpoints, and a 40-minute average BP interval as an unvalidated hypothesis.
- Existing runtime economy evidence belongs to the legacy RUN product and cannot validate this economy.

### ACCEPTED CORE

- North Star: 「一緒にデカくする」.
- Participation changes from Presence to Co-creation to Shared Expansion.
- Relationships are not rarity, performance, gift, or payment resources.
- Gifts are not the dominant growth route.
- Breakpoint, Automation, Prestige, and Scale Transition are Meta Incremental systems with different meanings.
- Prestige preserves people, relationship history, major events, representative Archives, and room evidence.
- Scale Peak performs Semantic Retirement instead of keeping every old economy live.
- P0-SIM cannot select the Creative result alone; P0-FEEL and Pareto review are required.

### HYPOTHESIS / TEST-DEPENDENT

- approximately 100 hours to the Main Scale Goal;
- all Layer durations and Broadcast Loop distributions;
- LIVE 1, A1–A3, B1–B3, C1–C3;
- CRITICAL weighting and milestone distributions;
- the bottleneck model proposed in this document;
- specific resource names and numerical coefficients.

### UNKNOWN

- final Main Goal duration;
- final BP4–BP24 rules and thresholds;
- final Prestige layers, names, and whether a dedicated Prestige currency exists;
- SP1 and SP7 triggers;
- exact Layer 2–Layer 5 active-time allocation;
- final activity-resource names.

## 3. Creative Economy Contract

The `ECO-*` identifiers below are document IDs, not in-game terminology.

### ECO-01 — Progress by transformation, not one universal counter

**WORK RECOMMENDED**

Main Progression is not a single Fame-like currency. A major progression event becomes eligible when the current form of participation has produced all evidence needed for a new kind of decision.

```text
Progress eligibility
=
relationship / continuity evidence
AND
current activity-specific evidence
AND
cross-activity bridge evidence when applicable
AND
a genuinely new player decision after the transition
```

The active bottleneck is the slowest unmet evidence. It changes as the player solves each production law.

This prevents streaming frequency, video output, gifts, or a horizontal resource from bypassing the rest of the game.

Before P0 implementation, Forge must propose an operational formula/model, coefficients or search ranges, and observability plan for this conjunction. Creative Review confirms only that the proposal implements the player-visible multi-proof contract, moving bottleneck, and no-bypass rule. The formula, coefficient search, simulator design, and executable test method remain Forge-owned and replaceable.

### ECO-02 — Relationships are states and histories, not spendable currency

- Relationship depth remains Persistent / Masked.
- A regular cohort is a set of people and continuity, not a production unit.
- First arrival, exit, revisit, regularization, and CRITICAL are events.
- People, visits, time present, or relationship depth are never consumed to craft, unlock, Prestige, or reroll.
- Listener differences affect events, interests, attendance patterns, and relationship paths, not a single power score.

### ECO-03 — Every visible resource has a lifetime

Each visible resource or state must declare:

1. where it comes from;
2. what current or next decision it changes;
3. how it converts, aggregates, expires, or retires;
4. when it leaves the primary HUD;
5. what historical evidence remains.

A state or record does not need a spend sink. It must still change an outcome, interpretation, or future decision.

### ECO-04 — Bridges preserve provenance

An output crossing from one activity to another keeps enough provenance to explain its effect: source activity, source context, interest direction, or originating event.

Bridge outputs change at least one of:

- who is likely to arrive;
- what they react to;
- what can be made next;
- what bottleneck can be broken;
- what new build or circulation becomes possible.

Flattening every output into a generic multiplier violates this contract.

### ECO-05 — Gift optionality

Zero-gift play must reach every accepted Main Progression milestone within the same time budget class as ordinary play.

Allowed gift roles:

- temporary Session excitement;
- a special presentation event;
- an activity-specific temporary change;
- an event that may leave an activity asset.

Forbidden gift roles:

- exclusive progression gates;
- relationship purchase;
- the fastest required route;
- required Automation unlocks;
- making high-gift people the optimal listener type.

### ECO-06 — No forced waiting

While an Asset Idle process or arrival pool is recovering, active play must still offer a meaningful choice:

- perform another accepted activity;
- prepare a future Session;
- choose an asset or Bridge destination;
- inspect evidence and make a next decision;
- configure an understood Automation;
- revisit an Archive or relationship history when that information changes a decision.

If the only rational action is to watch a timer, the structure fails even if the timer is short.

Mobile touch input and short-session return are part of this rule. Progress cannot require rapid tapping, precision dragging, a permanently open foreground app, desktop hover, or an information-dense desktop-only optimizer. A return after interruption shows what changed, what was preserved, and the next meaningful choice without duplicating rewards.

Short-daily and binge play must remain the same economy: ordinary mobile interruptions cause no progression penalty, missed person event, or coerced foreground time. Automation compresses repeated touch burden after understanding while preserving Sakiya/player intent, bottleneck judgment, and consequential routing. Forge owns lifecycle implementation and performance method; these player-visible outcomes are Binding Creative / Binding Test Intent.

### ECO-07 — No dead resources

**Inherited stricter validation detail; non-conflicting with SRC-08.**

A visible resource is a failure candidate when it persists across one Breakpoint interval without changing a choice, outcome, explanation, conversion, or retirement path.

Repair may be:

- a meaningful transformation;
- automatic aggregation;
- removal from the primary HUD;
- historical preservation;
- Semantic Retirement.

Do not invent a tax or arbitrary sink solely to keep an obsolete currency alive.

### ECO-08 — Every positive loop has a continuation control

Every positive loop uses at least one control separate from its unlock condition:

- diminishing returns;
- cap;
- another activity-specific input;
- recovering pool;
- temporary state;
- Prestige boundary.

The streaming → material → video → new arrival loop must not grow without bound or make all other activities irrelevant.

### ECO-09 — Offline progression respects the three time economies

**WORK RECOMMENDED**

- Asset Idle continues offline.
- Session-only HYPE and condition states are not banked as permanent progress.
- Important named-person relationship events do not silently complete unseen.
- If automated Sessions are later accepted, important events enter history and replay/focus presentation.
- Return summaries identify which activity or asset caused each material result.

### ECO-10 — Horizontal resources have narrow authority

| Working Name | Allowed meaning | Forbidden authority |
|---|---|---|
| 認知 | discovery context and current-scale explanation | buying mastery, relationship, or all activity output |
| ファン | cross-medium continuity summary | spendable people, labor units, universal producer |
| 熱量 | temporary Session / Event condition | permanent bank, Prestige currency, global multiplier |
| 再生 / Reach / Followers | medium-specific reach evidence | instant conversion into one universal reach value |
| Scale Unit | what the current economy counts as one unit | spendable currency |

If P0 does not require 認知, ファン, or 熱量, it must not add them merely to make the simulator look complete.

## 4. Main Progression and bottleneck transition

### 4.1 P0 and L1

| Phase | Bottleneck candidate | Evidence of completion | New decision after completion |
|---|---|---|---|
| Presence | meaningful named contact and continuity | arrival, exit, revisit, and remembered context are legible | what kind of Session to build with known people |
| BP1 枠ができる | relationship continuity | initial cohort, known names at start, previous atmosphere persists, listener-to-listener reaction begins | how to grow a continuing Session rather than acquire anonymous volume |
| BP2 配信が残る | Session output becomes persistent | After produces Highlight, Material, or Archive that works outside the Session | what to preserve and where to route it |
| BP3 枠の外へ届く | first two-way activity bridge | streaming output becomes a video; video reaches a different interest; the next stream changes | which interest and activity path to expand |

BP1 is not paid for with relationship depth. BP2 is not merely a material-count threshold. BP3 requires visible return to the next stream, not just a view count.

### 4.2 Layer 2–Layer 6 candidate bottlenecks

The following map is HYPOTHESIS and uses no new canonical resource names.

| Layer | Bottleneck movement |
|---|---|
| L2 | individual revisit → relationships and community can generate new activity inputs and continued participation |
| L3 | amount of assets → choosing durable work paths and activity bridges |
| L4 | number of activities → an activity ecosystem responding to different cultural and institutional constraints |
| L5 | total reach → choosing what remains meaningful across planetary and civilization contexts |
| L6 | number of observations → synchronizing different observation conditions through Anchor Sessions and durable signals |

A Scale trigger requires all of the following meaning conditions before a numerical threshold is proposed:

- the old Unit no longer explains the main decision;
- the new Unit has its own production, use, and decision;
- more than one accepted activity needs the new Unit;
- Continuity and Semantic Retirement can both be demonstrated.

## 5. Event semantics

| Event type | Player-visible meaning | What may be lost | What must remain | Invalid implementation |
|---|---|---|---|---|
| First Event | emotional first occurrence | nothing | event history | treating it as a mandatory rule unlock |
| Breakpoint | production, conversion, decision, or play changes | normally nothing | understanding of the previous rule | threshold followed only by global +10% |
| Automation | understood repetition is compressed | manual repetition | first-time, important, and causal choices | automating every new or named event |
| Prestige | current economy and growth law are surrendered for a new law | current live values, current infrastructure, current-layer economy, temporary rank | people, relationship history, major events, representative Archives, room evidence | universal Prestige token with only ×N output |
| Scale Peak | the counted Unit changes and old Unit is semantically retired | old Unit live generation | final value, history, people, basis of the new Unit | every old counter remains live forever |

Prestige and Scale Peak may occur near each other but remain different structures. They do not change the accepted 24 BP + 10 SP count.

Every Prestige must create at least one new conversion, allocation, abstraction, or parallelization decision. Faster re-traversal alone is insufficient.

## 6. P0-SIM resource flow

```text
Before: choose Theme / Intent
↓
existing cohort + B arrival supply + A participation behavior
↓
LIVE / HYPE / arrival / exit / contact / revisit events
↓
masked relationship depth and event history
↓
After: choose Highlight / Material / Archive
↓
create and publish video from provenance-bearing Material
↓
public video creates views, subscribers, and interest-specific reach over time
↓
bounded arrival opportunity returns to the B supply
↓
next stream receives different people, context, or reactions
↓
first cross-activity synergy
```

### 6.1 P0 resource lifetime table

| State / asset | Source status | Lifetime | Decision or transformation | Forbidden use |
|---|---|---|---|---|
| LIVE | v0.7 Working Name | Session | read current participation | spendable currency |
| HYPE | v0.7 Working Name | Session | read atmosphere and event precursor | permanent bank |
| 初見 | accepted concept | Event / cohort entry | understand who arrived and why | gacha reward |
| 関係深度 | v0.7 Working Name | Persistent / Masked | revisit, CRITICAL, regularization causality | visible optimization score or spend |
| 常連コホート | accepted concept | Persistent | continuing Session and relationship behavior | production-multiplier bundle |
| 見どころ | v0.7 Working Name | Persistent Material | route to Archive or video | context-free universal material |
| 素材 | v0.7 Working Name | Persistent Material | transform into a video while retaining source | infinite unused stock |
| Archive | accepted asset | Asset Idle / history | long-term context and later activity input | permanent primary-HUD clutter |
| 公開動画 | accepted asset | Asset Idle | creates medium-specific reach over time | global activity multiplier |
| 再生 | v0.7 Working Name | Accumulating result | video-side reach and discovery evidence | substitute for relationship or mastery |
| 登録者 | v0.7 Working Name | Persistent video base | video-side continuity | identical to cross-medium fans |
| B arrival pool | HYPOTHESIS simulator state | recovering opportunity | supplies and shapes first arrivals | high-performance-person lottery |
| Gift event | conditional observation | Session / Event | temporary presentation or activity output | required progress |

### 6.2 A axis — Broadcast Participation

- A1 Co-plan + Observe: no LIVE input; Before and After choices must still create legible causality.
- A2 Co-plan + React: one or two reactions affect atmosphere, Highlight distribution, or relationship events, not universal yield.
- A3 Co-plan + Comment: one or two comments / attention choices affect topic, response, and future Material; they never command Sakiya directly.

### 6.3 B axis — first-arrival supply

- B1 infinite / constant: arrival volume does not deplete. Video may change interest or context, not permanently multiply all arrivals.
- B2 shared recovering pool: all Themes draw from one pool; activities can restore or reshape opportunity so waiting is not required.
- B3 interest-specific recovering pools: Theme and provenance-bearing assets act on different interest pools.

If B2 or B3 makes waiting for recovery the only meaningful action, that configuration fails.

### 6.4 C axis — nested production

The concrete mappings below are HYPOTHESIS for the simulator.

- C1 none: a public video directly creates bounded reach and a bounded next-stream opportunity; no producer strengthens a future producer.
- C2 shallow: public video → views → bounded interest-specific opportunity. Subscribers remain continuity evidence and do not yet improve future asset production.
- C3 deep: public video → views → subscriber / long-tail base → later video initial or long-tail response → bounded arrival opportunity. Every second-order edge requires continuation control.

C3 is a structural failure if it creates video universality, unbounded positive feedback, or automatic dominance.

## 7. The 27 P0-SIM configurations

| A × B | C1 | C2 | C3 |
|---|---|---|---|
| A1-B1 | A1-B1-C1 | A1-B1-C2 | A1-B1-C3 |
| A1-B2 | A1-B2-C1 | A1-B2-C2 | A1-B2-C3 |
| A1-B3 | A1-B3-C1 | A1-B3-C2 | A1-B3-C3 |
| A2-B1 | A2-B1-C1 | A2-B1-C2 | A2-B1-C3 |
| A2-B2 | A2-B2-C1 | A2-B2-C2 | A2-B2-C3 |
| A2-B3 | A2-B3-C1 | A2-B3-C2 | A2-B3-C3 |
| A3-B1 | A3-B1-C1 | A3-B1-C2 | A3-B1-C3 |
| A3-B2 | A3-B2-C1 | A3-B2-C2 | A3-B2-C3 |
| A3-B3 | A3-B3-C1 | A3-B3-C2 | A3-B3-C3 |

Every configuration is tested with multiple legal strategies, adversarial strategies, zero-gift overlays, and deterministic seed reruns.

## 8. Bot and strategy contract

| Bot / scenario | Behavior represented |
|---|---|
| streaming-focused | prioritizes Sessions whenever available |
| video-focused | prioritizes Material conversion, publication, and asset operation |
| balanced | changes activity based on the current visible bottleneck |
| high-frequency streaming | starts the next stream at the shortest legal interval |
| pool-recovery focused | changes activity before or during pool depletion |
| almost-no-video hostile path | tests whether video is required too rigidly or streaming softlocks |
| Light approximation | uses only visible information and immediate recommendations |
| legal optimizer | optimizes separate objectives using only player-visible state |
| oracle stress bot | may inspect hidden state to find structural exploits; never represents normal play |
| person-churn adversary | attempts high-volume first-arrival cycling and neglect of familiar people |
| zero-gift overlay | sets all gift occurrence and contribution to zero over every base strategy |

The optimizer does not use one global score. At minimum, it reports separately:

- milestone time;
- manual Broadcast count;
- relationship continuity;
- video-side reach;
- forced wait;
- repeated-action burden.

## 9. P0-SIM required output

For every configuration × strategy × seed:

- deterministic rerun identity;
- time and Broadcast count for first arrival, exit, revisit, regularization, Highlight, BP1, BP2, BP3, first video, video-sourced arrival, and first synergy;
- P10 / P50 / P90 / max distributions;
- source, generation, conversion, contribution, and unused remainder of every resource;
- dominant bottleneck and bottleneck-change time;
- forced-wait duration;
- repeated identical-action count;
- paired ordinary / zero-gift result;
- person-churn advantage or disadvantage;
- video-focused Pareto result;
- seed sensitivity;
- positive-loop stability.

Forge proposes seed count and statistical method. The proposal must show that P90 estimates are stable enough for the Gate; Work does not invent an unsupported sample count.

## 10. Quantitative and structural Gates

### ACCEPTED / RETAINED HYPOTHESES FROM v0.7

| Gate | Threshold |
|---|---|
| manual Broadcasts between major Breakpoints | P90 <= 70; max <= 80 |
| forced waiting | >=60 seconds warning; >=180 seconds FAIL candidate |
| first revisit | P50 5–8 minutes; P90 <=15 minutes |
| first regular | P10 no earlier than 8 minutes; P50 12–15 minutes; P90 <=25 minutes |
| regularization minimum | at least 2 Broadcasts and 3 meaningful contacts |
| first video and first synergy | P50 20–30 minutes; P90 <=45 minutes |
| zero gift | satisfies the same Main Progression time budget |
| person gacha | mass first-arrival cycling does not persistently dominate ordinary play |

### WORK RECOMMENDED STRUCTURAL TESTS

- No-dead-resource FAIL candidate: a visible resource crosses one BP interval without changing a choice, result, explanation, conversion, or retirement.
- Video-universality FAIL: the video-focused legal strategy Pareto-dominates every other legal strategy across all P0 major objectives.
- Near-dominance FAIL candidate: one legal route is the rational default across nearly every meaningful context because a small efficiency advantage has no opportunity cost, robustness loss, or later tradeoff. Review use-share, regret, marginal choices, and sensitivity—not strict Pareto dominance alone. Forge chooses the statistical method and proposes thresholds; Creative Review judges whether distinct viable strategies remain player-visible.
- Person-gacha FAIL: the person-churn strategy Pareto-dominates a relationship-preserving legal strategy on Main Progression without a compensating loss.
- No-wait FAIL: pool depletion leaves no meaningful non-wait action even before the 180-second duration threshold.
- Activity Bridge FAIL: the bridge changes only quantity and creates no new choice, context, build, or circulation.

## 11. Time and milestone budget

### 11.1 Current 100-hour hypothesis

| Layer | Time | Broadcast Loops | BP | SP | Bottleneck candidate |
|---|---:|---:|---:|---:|---|
| L1 | 2h | 84 | 3 | 1 | relationship continuity → Session asset → video Bridge |
| L2 | 8h | 192 | 6 | 1 | community continuity and feedback |
| L3 | 15h | 225 | 5 | 2 | durable works and activity bridges |
| L4 | 20h | 216 | 4 | 2 | ecosystem allocation and cultural / institutional response |
| L5 | 25h | 180 | 3 | 2 | planetary and civilization context |
| L6 | 30h | 144 | 3 | 2 | observation synchronization and long transmission |
| Total | 100h | 1,041 | 24 | 10 | |

The v0.7 expected speed curve produces 13.21 hours of actual Broadcast Loop time within the 100-hour hypothesis. The remaining time must contain activity-specific play, bridge decisions, world / Prestige decisions, community / Archive review, and preparation rather than waiting or pure management.

For any sampled 20 minutes of active play, the current hypothesis remains:

- meaningful co-creation and expansion decisions: at least 65%;
- receptive participation: approximately 20%;
- pure management: no more than 15%;
- forced waiting: 0%.

### 11.2 First-30-minute timing conflict

#### FACT

- Active SRC-08 T3 requires BP1–BP3, video, and first synergy in the Integrated First 30 Minutes.
- v0.7 places three Breakpoints in a two-hour L1 and reports a 40-minute average BP interval.
- v0.7 also targets first video / first synergy at P50 20–30 minutes and P90 <=45 minutes.
- Foundation P1 mentions an initial Breakpoint rather than all three.

#### RISK

Treating the 40-minute average as evenly spaced makes the active First 30 Minutes contract impossible. Silently discarding the two-hour L1 budget creates a different long-arc risk.

#### WORK RECOMMENDED RESOLUTION

- Preserve BP1 meaning as relationship continuity.
- Preserve BP2 meaning as a Session result working outside the Session.
- Preserve BP3 meaning as the first streaming → video → next-stream circulation.
- Test BP1–BP3 as an early cluster with P50 around the active 30-minute target and P90 no later than the existing 45-minute first-synergy target.
- Do not use the 40-minute average as an equal-spacing Gate.
- After P0, rebuild the L1 schedule from observed distributions while preserving the two-hour L1 as a test hypothesis, not an accepted fact.

Any timing change records previous value, new value, change, reason, decision authority, and retest condition.

## 12. Risks and failure conditions

| ID | Severity candidate | Risk |
|---|---|---|
| ECO-R01 | HIGH | first-30-minute BP requirement and L1 timing hypothesis remain unresolved |
| ECO-R02 | HIGH | B2 / B3 creates forced pool-recovery waiting |
| ECO-R03 | HIGH | C3 turns video into the universal route |
| ECO-R04 | BLOCKER | visible relationship depth enables person gacha or discard optimization |
| ECO-R05 | HIGH | a horizontal resource replaces all activity-specific decisions |
| ECO-R06 | HIGH | old resources remain live after Automation, Prestige, or Scale Peak |
| ECO-R07 | HIGH | Prestige becomes a repetitive universal multiplier reset |
| ECO-R08 | HIGH | offline progress silently erases named-person events or causality |
| ECO-R09 | HIGH | the light player cannot progress without hidden-state optimization |

## 13. Acceptance evidence

### P0-SIM

- full 27-configuration deterministic report;
- seed and strategy distributions;
- bottleneck-transition evidence;
- resource-lifetime and no-dead-resource audit;
- zero-gift paired result;
- person-churn adversary result;
- video-focused Pareto result;
- wait and repeated-action report;
- positive-loop stability report.

### First 30 minutes

- BP1–BP3 event times and meanings;
- video creation and video-sourced next-stream change;
- zero-gift completion;
- no instruction dead-end;
- P0-SIM / P0-FEEL Pareto integration decision.

### Long progression

- accelerated simulation and human 2h / 10h / midgame / Main Goal samples;
- paired ordinary / zero-gift coverage through every accepted SP and Main Completion within the accepted Layer/Main Goal time-budget class;
- full-arc no-wait, dead-resource, person-churn, and de facto near-dominance evidence, including opportunity cost/sensitivity rather than strict Pareto dominance alone;
- full mobile artifact coverage for short-session and long-session patterns, background/resume, touch manual burden, thermal/memory constraints, and no desktop-only strategy advantage;
- activity-time, management-time, and forced-wait classification;
- manual burden by Layer;
- Prestige loss / continuity comparison;
- Semantic Retirement resource and HUD audit;
- offline return causality report.

## 14. Owner Gate

### ODG-04 / DTD-07 summary — Main Goal duration

`DECISION_REGISTER.md` is canonical for this gate's state, safe default, evidence, and resolver authority.

Should approximately 100 hours remain the Main Scale Goal target?

**WORK RECOMMENDATION:** retain it as the complete-product target through P0 and early long-form simulation, then confirm or revise using milestone density, manual burden, content repetition, and Layer-specific choice evidence.

Gain: preserves the intended超大型Incremental arc.  
Loss: requires strong content, Automation, and bottleneck transitions to avoid length without novelty.

This decision does not authorize reducing the vision to an MVP.

## 15. Forge Handoff Notes

The Creative Economy Contract, player-visible failure conditions, and evidence categories are Binding Creative / Binding Test Intent. The following are non-binding Engineering Recommendations and may be reorganized by Forge with equivalent or stronger traceability.

Forge must propose, not receive as Creative mandate:

- simulator architecture;
- numerical formulas and coefficient-search method;
- seed sample size and confidence method;
- Bot implementation;
- large-number representation;
- save / offline technical model;
- executable test framework.

Forge Return must separate executed, failed, skipped, and unverified work and include commit, environment, artifacts, logs, and deterministic reproduction information.
