# Design QA — 八乙女さきやの ヤニ切れ大パニック！

## Visual truth and evidence

- Primary source: `design-references/run-area3.png`
- Supporting sources: `design-references/run-area1.png`, `run-area2.png`, `run-fever.png`, `run-final-boss.png`, `result-upgrade.png`
- Source dimensions: 1024 × 1536 px
- Browser implementation capture: `artifacts/run-implementation-final.jpg`
- Combined comparison: `artifacts/qa-comparison-final.jpg`
- Landscape adaptation keeps the route, broadcast telemetry and combat readable above the fold instead of copying the portrait stack literally.

## Visual inspection

The implementation preserves the reference's pink/black/purple pixel-art hierarchy, three primary character gauges, listener/LIVE/support/gift/ranking telemetry, FEVER strip, live comments, Sakiya silhouette, right-originating enemies and bosses, damage-number spectacle, and kawaii-gothic broadcast-city atmosphere.

Four world images provide distinct streamer city, elevated arcade, dark broadcast district and final neon fortress palettes. Area transition crossfade, boss entrance weight, hit squash, player recoil/dodge, impact rays, FEVER hearts and motion streaks add continuity without replacing the supplied visual identity.

## Interaction and state verification

Verified in the cloud browser:

- Title, first-broadcast onboarding, 4 strategy selections and 3 FEVER SCRIPT selections.
- Automatic movement, combat, Yani refill, temporary upgrades, gifts, FEVER, ranking and area progression.
- Optional Ikevobo, 1×/2×/4× speed, pause/resume and voluntary stream end.
- Settings modal, BGM/SFX mix, reduced motion, shake, contrast, text scale, number density and save management.
- Separate RUN RESULT, previous-run comparison and permanent UPGRADE screens.
- Permanent upgrade followed by a stronger restart.
- AREA 1 → AREA 2 transition and visually distinct area presentation.
- FINAL BOSS victory, ENDING, Archive and Encore through browser/simulation evidence.

## Comparison history and fixes

1. Route bar below fold: fixed with a persistent RUN route dock.
2. Initial rank/LIVE mismatch: fixed by initializing both from carried listeners.
3. Missing top-gauge parity: fixed by adding Ikevobo alongside Love and Yani.
4. Static combat feel: fixed with eased spawn, bob, lean, recoil, dodge, hit squash, boss entrance and event banners.
5. World cuts felt abrupt: fixed with area crossfade and music scene transitions.
6. Strategy intent was hidden: fixed with metrics, risk, best-for and FEVER SCRIPT cards.
7. Bosses read mainly as HP tiers: fixed at the system layer with 7 distinct streaming disruptions and phase labels.

## Automated verification

- Game engine tests: 11 passed, 0 failed.
- Sites/static routing tests: 4 passed, 0 failed.
- Production Vite build: passed.
- Sites packaging preparation: passed.
- App-origin console errors: none observed. Browser-extension-only metadata errors are excluded from application evidence.

## Residual notes

- Boss rule identity is stronger than boss animation identity; dedicated choreography remains a premium-content gate.
- Exact audio quality requires human monitored audition even though event routing is technically verified.
- Cloud Chromium does not replace physical iPhone/Android verification; mobile CSS and touch affordances are structurally audited only.

final result: passed with documented commercial-release gates
