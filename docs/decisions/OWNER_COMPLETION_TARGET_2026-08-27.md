# OWNER COMPLETION TARGET — 2026-08-27

Status: OWNER ACCEPTED DIRECTION
Project: `MICHIHAL/sakiya-game`
Owner: SAKIYA

## Decision 1 — Codex / Implementation Forge will be used to finish the product

The intended production path is to complete the current creator-incremental game through Implementation Forge / Codex after SAKIYA STUDIO / Work finishes the required Creative Specification and validation contracts.

Work does not implement the product. Work defines the complete intended experience, creative rules, quality gates, acceptance evidence, and Forge handoff.

Implementation Forge / Codex owns technical architecture, implementation, test code, build, debug, performance, Technical Verification, and verified repository changes.

## Decision 2 — Complete means release-ready product quality

For this project, "complete" does not mean:

- prototype exists
- vertical slice exists
- first 30 minutes work
- foundation exists
- build succeeds
- automated tests pass once
- UI mock exists
- core systems exist without final presentation

Completion means a product that can proceed directly to paid-publication judgment and includes the full accepted experience.

At minimum, completion requires:

### Experience

- first launch through accepted Main Goal
- defined Ending / completion moment
- accepted Post-goal / Strong New Game state
- complete accepted activities
- complete progression, Breakpoints, Automation, Prestige, Scale Transition
- intended participation arc from Presence to Co-creation to Shared Expansion

### Presentation

- final UI
- final responsive layouts
- final art / room evolution / world intrusion
- final motion and feedback hierarchy
- final BGM
- final SFX
- final audio transitions and mix
- unchanged ENTRY CHIME invariant
- no unfinished placeholder presentation

### Systems and reliability

- complete economy and balance
- save / backup / recovery
- export / import if retained
- offline progression
- large-number behavior
- error recovery
- performance appropriate to the selected release target
- long-session stability

### Accessibility

- reduced motion
- non-color-only state communication
- audio-independent critical information
- captions / event history as specified
- readable speed controls
- input alternatives required by the target platform
- readable large-number notation

### Content

- required Anchor Events
- Systemic Flavor
- comment / news / reaction coverage
- accepted archives / records / achievements
- Ending and post-goal content
- help / credits / user-facing explanatory text
- no unresolved generic placeholder AI prose in release content

### Release preparation

- real-device verification
- final audio listening review
- rights and provenance review
- privacy review
- credits and licenses
- deployable or distributable production package
- public-facing screenshots / description / release notes as required
- known limitations
- rollback / recovery plan

### Separate approvals

The following are separate and cannot substitute for each other:

- Creative PASS
- Technical PASS
- SAKIYA Final Acceptance
- Release Gate PASS

Public release itself requires explicit Owner authorization.

## Decision 3 — Complete product vision is fixed before detailed Forge production

Before large-scale implementation, Work must first define the complete product image.

The Final Product Lock must describe, at minimum:

- Product Promise
- Player Role
- first 5 minutes
- first 30 minutes
- early, middle, late, Main Goal and post-goal experience
- accepted activities and their distinct verbs
- complete Broadcast experience
- progression and economy
- Breakpoint / Scale / Prestige structure
- final UI
- final visual direction
- final music / SFX direction
- content volume
- accessibility
- release target
- Definition of Complete
- explicit exclusions
- Owner Decision Gates

P0 and P1 exist to validate this target, not to redefine the target downward into an MVP by default.

## Decision 4 — Work must be modular and may use subagents for role separation

The Work creation process should be divided into small responsibility areas instead of one undifferentiated mega-document.

When subagents are actually available, they may be used for temporary specialist roles such as:

- source / conflict audit
- experience direction
- broadcast / relationship design
- incremental economy
- activities / synergy
- scale / prestige / world ontology
- UI / UX / visual / motion
- audio / music / SFX
- flavor / tone / content
- accessibility / platform UX
- rights / privacy / release planning
- quality / test design
- adversarial review
- final integration / Forge handoff

If subagents are not actually used, the Work must not report that they were used.

No permanent mega-router or new authority is created by this role split.

## Decision 5 — Quality requires tests, adversarial review, repair, and regression

The quality process is not complete after first implementation.

The production loop must include:

```text
Creative Specification
↓
Probe / Prototype
↓
Implementation
↓
Verification
↓
Adversarial Review
↓
Repair
↓
Regression
↓
Evidence
↓
Acceptance
```

Adversarial reviews must occur at multiple stages, not only immediately before release.

Review must include perspectives such as:

- incremental veteran
- light / casual player
- streaming-culture outsider
- player unfamiliar with Sakiya
- existing listener
- monetization skeptic
- tone / self-deification critic
- accessibility reviewer
- mobile-only reviewer
- content / UI / audio fatigue reviewer
- save / migration destroyer
- rights / privacy / release reviewer
- hostile third-party product reviewer

BLOCKER findings must be resolved or explicitly rejected by the responsible authority with evidence before the relevant gate passes.

Repairs require regression evidence. A finding list by itself is not completion.

## Decision 6 — Current old implementation is a transition input, not an automatic creative requirement

The repository contains an older horizontal-scrolling action / RUN-oriented implementation and supporting documentation.

That work must not silently override the current creator-incremental direction.

Before destructive migration, Work must create a Project Direction Transition Decision classifying existing areas as:

- KEEP
- ADAPT
- ARCHIVE
- REMOVE FROM CURRENT DIRECTION
- UNKNOWN

Reusable technical capability may be preserved without preserving the old game experience.

## References

Current creative entry:

- `docs/CURRENT_CREATIVE_STATE.md`
- `docs/SAKIYA_CREATOR_INCREMENTAL_CREATIVE_GAME_DESIGN_SPEC_v0.7.md`
- `docs/SAKIYA_INCREMENTAL_PROTOTYPE_FOUNDATION_FREEZE_SPEC.md`
- `docs/work/WORK_PROMPT_COMPLETE_GAME_FORGE_HANDOFF_v1.1.md`
