# FORGE EXECUTION AUTHORITY CONTRACT

**Project:** `MICHIHAL/sakiya-game`  
**Status:** OWNER-DIRECTED EXECUTION AUTHORITY CORRECTION  
**Applies to:** all current and future Work / SAKIYA STUDIO outputs for this project  
**Purpose:** preserve the value of the nearly completed Work while restoring Engineering Authority to Implementation Forge / Codex

---

# 1. Contract precedence

This contract governs how Work outputs are interpreted when they are handed to Implementation Forge / Codex.

If a Work document contains detailed proposals for implementation order, subagent roles, test methods, CI, branch strategy, technical architecture, or QA execution, those details do **not** override this contract.

The Work does not need to be discarded or repeated.

Its contents are reclassified according to the rules below.

---

# 2. Authority model

- **SAKIYA:** Final Authority
- **SAKIYA STUDIO / Chat / Work:** Creative Authority
- **Implementation Forge / Codex:** Engineering Authority
- **GitHub:** canonical storage surface, history, collaboration and handoff surface; not an authority

Creative PASS, Technical PASS, SAKIYA Final Acceptance, Release-ready, and Public Release remain separate states.

---

# 3. Binding Work outputs

The following Work outputs are binding unless SAKIYA changes them.

## 3.1 Creative Intent

- North Star
- intended player experience
- player role
- accepted activity meanings
- world and tone rules
- personhood guardrails
- accepted completion scope
- accepted product promise

## 3.2 Player-visible specification

- what the player can see, hear and do
- visible state transitions
- gameplay rule meanings
- UI and information requirements
- audio and visual invariants
- content and accessibility requirements
- completion and release-facing experience

## 3.3 Creative Invariants and failure conditions

- what must remain true
- what would constitute a Creative failure
- what must not become a dominant strategy
- what evidence is needed for Creative Review

## 3.4 Acceptance intent

- what must be proven before a stage can pass
- required evidence categories
- player-visible acceptance outcomes
- Owner Decision Gates

These items describe **what must be true**, not the internal mechanism used to make or test it.

---

# 4. Non-binding Work recommendations

The following material may remain in Work documents, but it is advisory unless separately accepted by Implementation Forge as its own plan.

- implementation sequence
- technical work breakdown
- subagent composition
- number and names of agents
- parallelization plan
- file ownership plan
- architecture proposal
- component structure
- internal data model
- tick or update strategy
- RNG / seed implementation
- test framework
- exact test case decomposition
- CI design
- branch and commit strategy
- adversarial review scheduling
- regression execution method
- performance tooling
- release engineering procedure

Where a Work document uses imperative wording for these areas, interpret it as:

> **Suggested decomposition or quality coverage. Implementation Forge may replace it with a better technical plan, provided the binding Creative Intent, Acceptance Intent, and required evidence remain satisfied.**

---

# 5. Test intent versus test implementation

Work owns **Test Intent**.

Examples:

- save corruption must be recoverable
- no-gift progression must remain viable
- listener rerolling must not be the dominant strategy
- ENTRY CHIME must remain perceptually identical
- the first 30 minutes must establish participation and cross-activity causality
- reduced-motion players must receive equivalent gameplay information

Implementation Forge owns **Test Implementation**.

Forge decides:

- unit, integration, simulation, browser, device and soak test mix
- test framework
- seed count
- Bot design
- fixtures
- automation
- CI
- coverage strategy
- performance measurements
- regression suite
- failure reproduction method

Work-authored test IDs, layer names, counts or schedules are coverage references, not mandatory technical structures.

Forge may combine, split, rename or replace them while preserving the proof obligation.

---

# 6. Adversarial review ownership

Work may define:

- adversarial questions
- player-experience risks
- Creator Fidelity risks
- ethical and tone risks
- expected evidence
- Creative re-review conditions

Implementation Forge owns:

- when technical adversarial review is run
- which subagents or tools perform it
- fuzzing, load, save-destruction and hostile-path techniques
- technical repair plan
- regression implementation
- CI enforcement

Forge must not omit adversarial review merely because Work did not prescribe a particular technical method.

---

# 7. Implementation Forge execution authority

Implementation Forge / Codex owns and must actively design:

- repository audit
- migration and reuse plan
- technical architecture
- implementation plan
- dependency graph
- task decomposition
- subagent composition
- agent responsibilities
- parallelization
- integration order
- test strategy
- simulation implementation
- adversarial technical review
- repair and regression strategy
- build and CI strategy
- performance verification
- save and migration verification
- release engineering
- branch, commit and PR strategy
- verified commit / push

Codex must not wait for Work to prescribe every technical detail.

> **“Work did not specify the test” is not a valid reason to omit Technical Verification required for release-ready quality.**

---

# 8. Mandatory Codex planning output before substantial implementation

Before major product migration or implementation, Codex must produce and then execute an evidence-based plan containing at least:

1. **Repository and legacy audit**
   - KEEP / ADAPT / REPLACE / ARCHIVE
   - migration risks
   - rollback and preservation plan

2. **Technical architecture proposal**
   - alternatives considered
   - selected approach
   - tradeoffs
   - conflicts with Creative Specification

3. **Execution graph**
   - milestones
   - dependencies
   - integration order
   - critical path

4. **Subagent and ownership plan**
   - only agents actually available and used
   - non-overlapping file and responsibility boundaries
   - integration owner

5. **Test and evidence strategy**
   - how each acceptance obligation will be proven
   - simulation, functional, visual, audio, accessibility, reliability and release evidence

6. **Adversarial review and regression plan**

7. **Commit and return plan**
   - branch / commit strategy
   - evidence files
   - Forge Return format

This planning output is Engineering work and does not require Work to rewrite its Creative Specification.

---

# 9. Creative change return rule

Forge may change technical methods freely within its Authority.

Forge must return to SAKIYA STUDIO before changing:

- North Star
- player role
- accepted activity meanings
- player-visible rules
- completion scope
- UI hierarchy or visible information intent
- audio or visual invariants
- personhood, gift or monetization guardrails
- Scale / Prestige meaning
- tone
- accepted content or accessibility obligation

The return must state:

- current Creative requirement
- technical conflict
- evidence
- options
- what each option gains and loses
- Forge recommendation

Forge must not silently substitute a technically easier game.

---

# 10. Reclassification of the existing Work package

The nearly completed Work remains useful.

Interpret its outputs as follows:

| Work material | New classification |
|---|---|
| Final Product Lock | Binding Creative candidate, subject to Owner acceptance |
| Complete Creative Specification | Binding once accepted |
| UI / audio / content completion requirements | Binding player-visible obligations |
| Creative Invariants | Binding Creative review obligations |
| Test coverage topics | Binding proof obligations / Test Intent |
| Specific test methods and case decomposition | Non-binding recommendation |
| Suggested Work Packages | Non-binding decomposition |
| Suggested subagent roster | Non-binding recommendation |
| Suggested review schedule | Non-binding recommendation |
| Technical sequencing | Forge-owned and replaceable |
| CI / architecture / commit procedure | Forge-owned |

No existing Work effort needs to be deleted merely because some sections crossed the Authority boundary.

---

# 11. Execution quality loop

Forge must close significant work through:

```text
Repository Audit
↓
Technical Plan
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
Forge Return
↓
Creative Review / Owner Gate where required
```

An initial implementation, a passing build, or one successful test run is not completion.

---

# 12. Required Forge Return

For each major stage, Forge must return:

- implemented scope
- files and commits
- tests actually run
- results
- screenshots / recordings where relevant
- audio evidence where relevant
- performance evidence
- unresolved findings
- known limitations
- Creative conflicts
- Technical PASS status
- recommended next stage

Forge must state accurately whether subagents, tools or formal skills were actually used.

---

# 13. Final contract statement

> **Work determines the finished game that must exist and the experience that must be proven.**
>
> **Implementation Forge determines how to organize, implement, test, attack, repair, verify, commit and package it.**
>
> Work recommendations about technical execution are useful input, not Engineering Authority.
>
> Forge technical freedom does not include freedom to replace the accepted game with an easier one.
