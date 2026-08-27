# GAME AUDIO & MOTION DIRECTION — v1.0

## Experience promise

画面を見なくても「通常区間／新エリア／BOSS／FEVER／敗北・勝利」が耳で分かり、静止画でも「右へ進んでいる」「攻撃が当たった」「前回より強い」が動きの方向から分かる。

## Audio grammar

| State | Music role | SFX role | Transition |
| --- | --- | --- | --- |
| AREA 1 | 明るいsquare lead、122 BPM | 軽い撃破音、上昇gift arpeggio | 配信開始stinger |
| AREA 2 | 密度を上げたsaw bass、130 BPM | attack/coinの粒度上昇 | harmonyを保ちつつfilter crossfade |
| AREA 3 | 暗いtriangle、136 BPM | telegraphとhurtを前景化 | 低域を残して高域を絞る |
| FINAL | 不穏な低root、144 BPM | crown/breakへ最大weight | 専用final chord |
| BOSS | tempoを少し落とし低域と緊張layerを増やす | 予告、BREAK、撃破を固有音にする | music duck後にstinger |
| FEVER | +12 BPM相当、hat/lead/高域を開く | gift、kill、critを鮮明化 | 開始・終了を別stinger |
| DEFEAT / VICTORY | transportを止める | 下行／上行の結果motif | Resultへ余韻を残す |

### Mix rules

- Master compressorで多数同時発音時のclipを抑える。
- 主要SEはBGMを短くduckし、情報を音量競争にしない。
- attack/kill/coinはcooldownを持ち、4× speedでも音の壁にしない。
- BGMとSFXは0–100%で個別保存。Sound OFFは即時muteし、再開時にrampする。
- 外部楽曲や第三者melodyを使用せず、WebAudio上の短いprocedural phraseとして構成する。

## Motion grammar

| Event | Motion | Meaning |
| --- | --- | --- |
| Walking | low-amplitude bob + background travel | 常に右へ進む |
| Attack | forward lean + neon arc | 自動攻撃の発射点 |
| Critical / overkill | squash, radial impact, larger number | 成長と桁の快感 |
| Dodge | short backward displacement | 愛を守ったこと |
| Hurt | recoil + camera impulse + flash | 損失の原因 |
| Enemy spawn | eased scale-in | 右側からの新しい脅威 |
| BOSS entrance | slower scale/weight | 通常敵との格差 |
| FEVER | screen blend, hearts, motion streaks | 全systemの同時加速 |
| AREA transition | previous/current background crossfade + title slide | 距離が景色になった証拠 |

## Hierarchy

1. 危険予告とBOSS HP
2. player damage/love/yani
3. FEVERとBREAK
4. gift/revenue/combo
5. decorative hearts and streaks

装飾は1–3を覆わない。reduced motionではbob、streak、impact ray、shakeを停止し、状態textとmeterは残す。

## Acceptance evidence

- 60fps modeでCanvas animationがrequestAnimationFrame追従し、30fps fallbackが保存される。
- AREA切替中に旧背景から新背景へ1.15秒以内でcrossfadeする。
- FEVER、BOSS、area、hurt、gift、BREAK、victory/defeatが別のsound signatureを持つ。
- 4× speedでもattack/kill soundのcooldownが働く。
- OS reduced-motionとgame内「視覚効果を抑える」の両方がanimationを抑制する。
