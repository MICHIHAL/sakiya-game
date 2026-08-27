# Legacy Map — Superseded Horizontal Action Version

この領域は、`MICHIHAL/sakiya-game`の旧「横スクロールアクション版 ヤニ切れ大パニック！」と、その制作・検証Evidenceの系譜を扱います。

## Current status

旧横スクロールアクション版は、現在のCreative Productではありません。

状態：

> **SUPERSEDED CREATIVE DIRECTION / LEGACY IMPLEMENTATION / MIGRATION INPUT**

Current Creative Productは、

> **八乙女さきや 活動者育成インクリメンタル**

です。

Current entry：

- `README.md`
- `AGENTS.md`
- `docs/CURRENT_CREATIVE_STATE.md`
- `docs/SAKIYA_CREATOR_INCREMENTAL_CREATIVE_GAME_DESIGN_SPEC_v0.7.md`
- `docs/SAKIYA_INCREMENTAL_PROTOTYPE_FOUNDATION_FREEZE_SPEC.md`
- `docs/decisions/OWNER_COMPLETION_TARGET_2026-08-27.md`

---

## Legacy creative documents

次は現行Creative Sourceとして使用しません。

- `docs/GAME_DESIGN_PLAYER_GROWTH_v0.1.md`
- `docs/GAME_DESIGN_BIBLE_PREMIUM_v0.2.md`
- 旧RUN / combat / boss / FEVER / Director Strategyを前提とする資料
- 旧横スクロール版のvisual / interaction QA

Allowed use：

- lineage確認
- 旧判断のEvidence
- 再利用可能な知見の抽出
- anti-reference

Forbidden use：

- Current Core Loopとして復帰
- 新仕様の上書き
- 旧ゲームを保存するためのCreative縮退

---

## Legacy implementation evidence

次は過去revisionの実装Evidenceとして保持します。

- `IMPLEMENTATION_REPORT.md`
- `FORGE_RETURN.yaml`
- `design-qa.md`
- 旧実装時のtest結果、build結果、screenshots、assets

これらが過去にPASSしていても、Current Creator IncrementalのTechnical PASSにはなりません。

過去のCreative PASS、Technical PASS、build成功、Ending到達を、新Productの完成Evidenceとして再利用しないでください。

---

## Legacy product code

現在の`src/`、`public/`、`tests/`等には旧ゲーム実装が残っている可能性があります。

状態：

> **MIGRATION INPUT**

Creative behaviorとしては継承義務がありません。

### Reuse candidate

Forge Technical Auditで再利用可能性を確認するもの：

- save / backup / export-import
- local persistence
- responsive layout infrastructure
- PWA / hosting
- accessibility settings
- audio engine / WebAudio utilities
- performance settings
- test infrastructure
- build / worker / deployment foundation

### Do not preserve by default

- move-right combat loop
- enemy / boss progression
- defeat → permanent upgrade → restart RUN
- FEVER combat script
- old Director Strategy
- old area / boss campaign
- old HUD meaning

旧機能を新ゲームへ入れる場合は、存在していたからではなく、Current Creative Specificationに必要だから採用します。

---

## Migration rule

旧コード・旧資料を削除、移動、大規模置換する前に、Forgeは次を返します。

- KEEP / ADAPT / REPLACE / ARCHIVE map
- branch / backup plan
- migration risk
- data / save compatibility impact
- rollback method
- tests that must remain valid
- current Creative Specificationへの影響

Creative Intent変更が必要な場合は、Forge単独で採用せずSAKIYA STUDIOへ戻します。

---

## Preservation rule

Legacyは「削除待ちゴミ箱」ではありません。

歴史、Evidence、再利用知見として保持します。

ただし、Current判断へ自動合成しません。
