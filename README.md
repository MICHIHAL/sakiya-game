# 八乙女さきやの ヤニ切れ大パニック！

配信 × 横スクロールアクション × インクリメンタル成長を統合した、ブラウザで最初からFINAL BOSS撃破まで遊べるゲームです。

## Core loop

右へ進む → 敵を倒して配信を盛り上げる → リスナー・ギフト・応援を稼ぐ → 壁で配信終了 → 永続強化 → STARTから再配信 → 前回より遠くへ進む。

RUN中の前進、戦闘、ヤニ補給、一時強化、FEVERは自動進行です。プレイヤーは4つの配信方針と3つのFEVER SCRIPTを組み合わせ、必要ならイケボを早撃ちし、進行速度を切り替えます。

## Playable features

- 4地区、6つのMID/AREA BOSS、3phase FINAL BOSS、固有妨害mechanic
- listener / LIVE人数 / gift / comment / ranking / support income / FEVERの連鎖経済
- 4 Director strategy × 3 FEVER SCRIPT × 3 Director Goals
- RUN RESULT、前回比較、8系統の永久強化、具体的な次値preview
- Archive、12 achievements、直近20 RUN履歴、Ending、Encore levelと3 modifiers
- schema validation、auto backup、3 manual slots、save export/import
- area・boss・FEVERへ追従するprocedural BGM、個別SFX、BGM/SE volume
- 60/30fps、reduced motion、shake、contrast、text scale、number density
- responsive UI、PWA manifest、offline shell

## Controls

- RUNは自動進行
- `Space` / `Enter`: イケボ早撃ち（50以上）
- `1` / `2` / `4`: 進行速度
- `Esc`: pause
- 画面上のbuttonはPC・touchの両方に対応

## Run locally

```sh
npm install
npm run dev -- --host 127.0.0.1
```

## Verify

```sh
node --test tests/game-engine.test.mjs
node --test tests/sites-worker.test.mjs
node node_modules/vite/bin/vite.js build
```

## Documentation

- `docs/GAME_DESIGN_PLAYER_GROWTH_v0.1.md` — UX・成長フロー
- `docs/GAME_DESIGN_BIBLE_PREMIUM_v0.2.md` — プレミアム設計書
- `IMPLEMENTATION_REPORT.md` — 実装範囲と検証結果
- `design-qa.md` — ビジュアル比較と操作QA
- `FORGE_RETURN.yaml` — SAKIYA STUDIO Implementation Forge返却記録
- `docs/quality/REFERENCE_RESEARCH_PACK_2026-08-23.md` — 同系統作品から採用した原理とanti-reference
- `docs/quality/GAME_AUDIO_MOTION_DIRECTION.md` — BGM・SFX・motionの演出規則

永続成長、loadout、最高記録、FINAL BOSS撃破、Encore、履歴、設定はブラウザのlocalStorageへ保存されます。

現在のrevisionは、最初からEnding・Encoreまで通して遊べるcommercial-quality experience foundationです。正式なストア販売判定には、実機mobile/desktop、実聴mix、長時間content volume、store packageの別工程が必要です。
