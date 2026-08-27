# Work最終化プロンプト
## 八乙女さきや 活動者育成インクリメンタル
### Creative成果を保全し、Forgeへ正しく渡すためのAuthority修正版 v1.2

この指示は、`docs/work/WORK_PROMPT_COMPLETE_GAME_FORGE_HANDOFF_v1.1.md`を最初からやり直すためのものではありません。

Workがほぼ完成していることを前提に、既存成果を保全しながら、Engineering AuthorityだけをImplementation Forge / Codexへ戻してください。

最優先で参照する追加契約：

- `docs/work/FORGE_EXECUTION_AUTHORITY_CONTRACT.md`

この契約は、v1.1およびWork成果物内の技術実行・分担・テスト手法に関する記述より優先します。

---

# 1. 今回のMission

既存Work成果を破棄・全面再作成せず、次の4つへ整理してください。

1. **FINAL PRODUCT LOCK**
   - 完成品の姿
   - 最初からMain Goal / Post-goalまでの体験
   - UI、アート、音、活動、Scale、Prestige、アクセシビリティ、公開品質

2. **COMPLETE CREATIVE SPECIFICATION**
   - What / Why / Intended Experience
   - player-visible rules
   - accepted invariants
   - completion obligations

3. **OWNER DECISION / EXPLORATION / UNKNOWN REGISTER**
   - Owner Accepted
   - Work Recommended
   - Test-dependent
   - Unknown
   - Rejected / Superseded

4. **MASTER FORGE HANDOFF**
   - Codexへ完成責任を渡す契約
   - Creative requirements
   - acceptance intent
   - evidence requirements
   - Owner return gates

Workは、技術組織の作り方まで確定しません。

---

# 2. Reclassification

既存Work内の内容を、次へ再分類してください。

## BINDING CREATIVE

- Product Promise
- North Star
- player role
- experience arc
- player-visible game rules
- activity meanings
- UI / audio / visual / content requirements
- personhood / gift / tone guardrails
- completion definition
- Creative Invariants
- Owner Decisions

## BINDING TEST INTENT

- 何を証明すべきか
- 何が失敗か
- どのEvidence categoryが必要か
- Creative ReviewのPASS条件

## NON-BINDING ENGINEERING RECOMMENDATION

- implementation sequence
- Work Packageの切り方
- subagent編成
- agent名
- parallelization
- exact test cases
- test framework
- seed数
- CI
- branch / commit戦略
- architecture
- internal model
- adversarial reviewの技術的実施方法
- regression実装
- release engineering

Non-binding項目は削除しなくてよいですが、必ず明示的に次の注記を付けます。

> **Suggested execution decomposition only. Implementation Forge may reorganize this work based on repository state, architecture, dependencies and risk.**

---

# 3. Workのテスト責任

Workはテストコードや技術的テスト計画を設計しません。

Workが確定するのは、Test Intentです。

例：

- 0ギフトでも進行できること
- 人物厳選が支配戦略にならないこと
- save破損から復旧できること
- ENTRY CHIMEが知覚上同一であること
- 初30分で参加感と活動間因果が成立すること
- 音なし、Reduced Motionでも情報を失わないこと

Forgeが決めるもの：

- test layers
- test framework
- case decomposition
- Bot
- seeds
- CI
- browser / device test
- soak
- performance measurement
- regression suite

v1.1のT0〜T11等は、**coverage checklist / proof obligation**として保持し、必須の技術構造とは扱わないでください。

---

# 4. Workの分担責任

Work自身がCreative文書をまとめるためにサブエージェントを使った場合、その事実は正確に記録してください。

ただし、Codex実装時のサブエージェント構成はWorkが固定しません。

v1.1のS0〜S14、WP-00〜WP-13等は、

- 責任領域の漏れを防ぐための参考
- Creative依存関係の候補

として保持できます。

CodexはRepository監査後に、実際に利用可能な能力を使い、自ら次を設計します。

- work breakdown
- subagent composition
- file ownership
- parallelization
- integration order
- test strategy
- adversarial review
- regression
- commit plan
- release engineering

---

# 5. Master Forge Handoffへ必ず追加する節

Master Forge Handoffの末尾に、`FORGE EXECUTION AUTHORITY`を追加してください。

最低限、次を含めます。

> Workが定義したものは、完成像、Creative Intent、プレイヤーから見える仕様、Invariant、Acceptance Criteria、必要Evidenceである。
>
> Implementation Forge / Codexは、それらを満たすためのtechnical architecture、implementation plan、work breakdown、subagent composition、parallelization、test strategy、executable tests、simulation、adversarial technical review、regression、CI、performance verification、release engineering、commit / branch strategyを所有する。
>
> Work文書内にこれらの具体案が存在する場合、それらは参考案でありEngineering Authorityを拘束しない。
>
> Codexはより良い技術的手法へ変更できる。ただしCreative Intentまたはplayer-visible specificationを変更する必要がある場合は、独断で代替せずSAKIYA STUDIOへ返す。
>
> Codexは実装開始時にRepositoryを監査し、自ら実装計画、役割分担、テスト戦略を作成してから実行する。
>
> 「Workに書かれていないためテストしなかった」は認めない。Release-ready品質に必要なTechnical VerificationはForge自身の責任で補完する。

---

# 6. Workの最終出力

Workの最終回答は、次へ絞ってよいです。

## 6.1 Final Product Lock

## 6.2 Complete Creative Specification

## 6.3 Owner Decisions / Unknowns

## 6.4 Master Forge Handoff

## 6.5 Reclassification Note

次を一覧化します。

- Binding Creative
- Binding Test Intent
- Non-binding Engineering Recommendation
- Returned Owner Gates

## 6.6 Actual Tool / Subagent Report

実際に使ったものだけを報告します。

---

# 7. 禁止事項

- ほぼ完成したWorkをAuthority修正だけのために全面破棄しない
- 既存の品質観点を削除しない
- Test Intentを曖昧にしない
- Workがtechnical architectureを確定しない
- WorkがCodexのsubagent編成を拘束しない
- Workがexact test strategyを拘束しない
- CodexへCreative Intent変更権限を渡さない
- Evidenceなしにcompleteとしない

---

# 8. 最終固定文

> **Workは、完成するゲームと、成立させる体験と、証明すべき品質を定義する。**
>
> **Codexは、その要求を満たすための開発組織、技術設計、作業分解、サブエージェント、テスト、敵対レビュー、修復、回帰、CI、Release Engineeringを自ら設計し、実行する。**
>
> Workが先回りして書いたEngineering案は捨てない。ただし、命令ではなく参考案として扱う。
>
> Creative Intentを守る限り、Codexはより良い完成経路を選べる。
