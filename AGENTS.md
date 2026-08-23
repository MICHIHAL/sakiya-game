# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Owner decisions for this game

- The canonical Project Repository is `MICHIHAL/sakiya-game`. Product code, assets, tests, and Forge evidence belong there; `MICHIHAL/sakiya-studio` remains the Studio Canon and receives only a locator when appropriate.
- The explicit target is a paid application whose details, reliability, and player experience justify purchase. A technically complete vertical slice is not sufficient evidence of commercial completion.
- Sakiya explicitly authorized implementation after the player-experience and growth-flow discussion; the implementation stop is lifted.
- The current local implementation skeleton and generated asset work are provisional and are not accepted creative specifications.
- Treat the target as a full-price, approximately ¥9,800-class premium game. Do not frame or scope it as a short web mini-game.
- The earlier 30–45 minute campaign hypothesis is superseded. Any replacement playtime, run count, content volume, or premium-system proposal remains a draft until Sakiya accepts it.
- Preserve the fixed core loop: move right, earn, lose, permanently strengthen, restart, and visibly surpass the previous wall.
- Treat streaming systems as gameplay systems, not decorative HUD.
- RUN is watch-first: forward movement, combat, Yani refill, FEVER, and temporary purchases are automatic. The player chooses a strategy before the RUN and may optionally fire Ikevobo early or change speed; do not turn the core RUN into a busy action game.
