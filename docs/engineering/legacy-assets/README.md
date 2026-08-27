# Archived legacy public assets

The tracked `icon-192.png` and `icon-512.png` files were moved here without
deleting them. They belong to the superseded cat-eared legacy identity, are not
referenced by the current manifest, and must not be copied into the current
production package.

- `icon-192.png`: SHA-256 `9c43ecad2ab25d1d335d73e720e22e4017055f381a2d17d35bc7ca8d0c99ac0c`
- `icon-512.png`: SHA-256 `d2a0a96868907e2ae6b7baa6a424bdef5581d55de50362c1eb166ab1a9067825`

Active current icons are `public/icon-8bit-192.png` and
`public/icon-8bit-512.png` and remain reviewable candidates rather than
Owner-approved final character art.

The superseded side-scrolling RUN package was also moved intact from
`public/assets/` to `run-public/assets/`. Its logo, cat/rabbit identity,
worlds, items, enemies, and player atlas are still available to inspect in Git,
but Vite no longer copies them into the current creator-incremental build.
Their original authorship/right-to-ship provenance is not established by the
completion corpus, so they must not be restored to `public/` without a separate
rights decision.

`run-public/SHA256SUMS` records the exact archived bytes.
