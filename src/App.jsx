import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ArrowClockwise,
  BookOpen,
  Broadcast,
  ChartLineUp,
  CheckCircle,
  Cigarette,
  ClockCountdown,
  Coins,
  Copy,
  Crown,
  DownloadSimple,
  FastForward,
  FloppyDisk,
  Gauge,
  GearSix,
  Gift,
  HardDrives,
  Heart,
  Lightning,
  ListChecks,
  LockKey,
  Medal,
  MicrophoneStage,
  Pause,
  Play,
  ShieldCheck,
  Sparkle,
  SpeakerHigh,
  SpeakerSlash,
  Star,
  Target,
  Trash,
  Trophy,
  UploadSimple,
  UsersThree,
  Warning,
  X,
} from "@phosphor-icons/react";
import "@fontsource/dotgothic16/japanese.css";
import { GameCanvas } from "./game/GameCanvas.jsx";
import {
  ARCHIVE_ACHIEVEMENTS,
  AREAS,
  ENCORE_MODIFIERS,
  FEVER_SCRIPTS,
  MILESTONES,
  PERMANENT_UPGRADES,
  RUN_LEVEL_CAPS,
  RUN_UPGRADES,
  STRATEGIES,
  WORLD_END,
  compact,
  permanentUpgradeCost,
  rankTier,
  runUpgradeCost,
} from "./game/config.js";
import {
  buildRunObjectives,
  calculateRunResult,
  activateIkebo,
  createRun,
  endRun,
  publicRunSnapshot,
  stepRun,
} from "./game/engine.js";
import { createAudioDirector } from "./game/audio.js";
import {
  clearSave,
  deserializeSave,
  listSaveSlots,
  loadSave,
  loadAutoBackup,
  loadSaveSlot,
  permanentMultipliers,
  serializeSave,
  writeSaveSlot,
  writeSave,
} from "./game/save.js";

const UPGRADE_ICONS = {
  voice: MicrophoneStage,
  drag: Cigarette,
  retention: UsersThree,
  gift: Gift,
  feverRate: Gauge,
  feverPower: Lightning,
  ranking: Trophy,
  starter: Coins,
  love: Heart,
};

const ROUTE_MARKERS = [
  { distance: 0, label: "START", type: "start" },
  ...MILESTONES.map((milestone) => ({
    distance: milestone.distance,
    label: milestone.type === "final" ? "FINAL BOSS" : milestone.type === "area" ? `AREA ${milestone.area} BOSS` : `MID ${milestone.area}`,
    type: milestone.type,
  })),
];

function formatTime(seconds) {
  const safe = Math.max(0, Math.floor(seconds || 0));
  const minutes = Math.floor(safe / 60).toString().padStart(2, "0");
  const remaining = (safe % 60).toString().padStart(2, "0");
  return `${minutes}:${remaining}`;
}

function mergeUnique(first = [], second = []) {
  return [...new Set([...first, ...second])];
}

function formatSavedAt(value) {
  if (!value) return "未保存";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "保存済み";
  return new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

function upgradeUnlocked(key, save) {
  if (["voice", "drag", "retention", "gift"].includes(key)) return { unlocked: true, reason: "" };
  if (["feverRate", "feverPower"].includes(key)) {
    return save.unlocks.area2
      ? { unlocked: true, reason: "" }
      : { unlocked: false, reason: "AREA 1 BOSS撃破で解放" };
  }
  return save.unlocks.area3
    ? { unlocked: true, reason: "" }
    : { unlocked: false, reason: "AREA 2 BOSS撃破で解放" };
}

function permanentPreview(save, key) {
  const current = permanentMultipliers(save);
  const nextSave = {
    ...save,
    upgrades: { ...save.upgrades, [key]: (save.upgrades[key] ?? 0) + 1 },
  };
  const next = permanentMultipliers(nextSave);
  const previews = {
    voice: ["初期攻撃", `×${compact(current.attack, 2)}`, `×${compact(next.attack, 2)}`],
    drag: ["最大愛", `×${compact(current.maxLove, 2)}`, `×${compact(next.maxLove, 2)}`],
    retention: ["リスナー増加", `×${compact(current.listener, 2)}`, `×${compact(next.listener, 2)}`],
    gift: ["ギフト価値", `×${compact(current.gift, 2)}`, `×${compact(next.gift, 2)}`],
    feverRate: ["FEVER加速", `×${current.feverRate.toFixed(2)}`, `×${next.feverRate.toFixed(2)}`],
    feverPower: ["FEVER倍率", `×${current.feverPower.toFixed(1)}`, `×${next.feverPower.toFixed(1)}`],
    ranking: ["順位収益", `×${current.ranking.toFixed(2)}`, `×${next.ranking.toFixed(2)}`],
    starter: ["開始支援金", compact(current.starterCoins), compact(next.starterCoins)],
  };
  return previews[key];
}

function recommendedUpgrade(save, lastResult) {
  const candidates = Object.keys(PERMANENT_UPGRADES).filter((key) => {
    const item = PERMANENT_UPGRADES[key];
    const level = save.upgrades[key] ?? 0;
    return level < item.max && upgradeUnlocked(key, save).unlocked && permanentUpgradeCost(key, level) <= save.memories;
  });
  if (!candidates.length) return null;
  const preferred = lastResult?.endReason === "love"
    ? ["drag", "retention", "voice", "gift"]
    : lastResult?.bossRemaining != null && lastResult.bossRemaining > 0.4
      ? ["voice", "feverPower", "drag", "gift"]
      : lastResult?.bestRank > 20
        ? ["retention", "ranking", "gift", "voice"]
        : ["voice", "gift", "drag", "retention"];
  return preferred.find((key) => candidates.includes(key)) ?? candidates[0];
}

function resultDelta(current, previous, key, lowerIsBetter = false) {
  if (!previous || !Number.isFinite(Number(previous[key]))) return null;
  const now = Number(current[key]) || 0;
  const before = Number(previous[key]) || 0;
  const delta = now - before;
  const improved = lowerIsBetter ? delta < 0 : delta > 0;
  return { delta, improved };
}

function Logo({ compactMode = false }) {
  return (
    <img
      className={compactMode ? "game-logo game-logo--compact" : "game-logo"}
      src="/assets/game-logo.webp"
      alt="八乙女さきやの ヤニ切れ大パニック！"
    />
  );
}

function IconButton({ label, children, className = "", ...props }) {
  return (
    <button className={`icon-button ${className}`} aria-label={label} title={label} type="button" {...props}>
      {children}
    </button>
  );
}

function Meter({ label, value, max = 100, tone = "pink", icon: Icon, detail }) {
  const ratio = Math.max(0, Math.min(1, value / Math.max(1, max)));
  return (
    <div className={`meter meter--${tone}`}>
      <div className="meter__line">
        <span>{Icon ? <Icon weight="fill" aria-hidden="true" /> : null}{label}</span>
        <strong>{detail ?? `${Math.floor(ratio * 100)}%`}</strong>
      </div>
      <div className="meter__track" aria-hidden="true">
        <span style={{ width: `${ratio * 100}%` }} />
      </div>
    </div>
  );
}

function StatChip({ icon: Icon, label, value, delta, tone = "pink" }) {
  return (
    <div className={`stat-chip stat-chip--${tone}`}>
      <Icon weight="fill" aria-hidden="true" />
      <span>
        <small>{label}</small>
        <strong>{value}</strong>
        {delta ? <em>{delta}</em> : null}
      </span>
    </div>
  );
}

function StrategyCards({ selected, onSelect, compactMode = false }) {
  return (
    <div className={`strategy-grid ${compactMode ? "strategy-grid--compact" : ""}`}>
      {Object.values(STRATEGIES).map((strategy) => {
        const isSelected = selected === strategy.id;
        return (
          <button
            key={strategy.id}
            type="button"
            className={`strategy-card ${isSelected ? "is-selected" : ""}`}
            onClick={() => onSelect(strategy.id)}
            aria-pressed={isSelected}
          >
            <span className="strategy-card__radio">{isSelected ? <ShieldCheck weight="fill" /> : <Gauge />}</span>
            <span className="strategy-card__body">
              <strong>{strategy.name}</strong>
              <small>{strategy.description}</small>
              <span className="strategy-card__meta"><em>向き：{strategy.bestFor}</em><b>危険度 {strategy.risk}</b></span>
              {!compactMode ? (
                <span className="strategy-card__meters" aria-label={`${strategy.name}の性能`}>
                  {Object.entries(strategy.metrics).map(([label, value]) => (
                    <span key={label}><small>{label}</small><i>{Array.from({ length: 5 }, (_, index) => <b className={index < value ? "is-on" : ""} key={index} />)}</i></span>
                  ))}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function FeverScriptCards({ selected, onSelect, compactMode = false }) {
  const icons = { instant: Lightning, chain: Gift, climax: Crown };
  return (
    <section className={`fever-script-panel ${compactMode ? "fever-script-panel--compact" : ""}`} aria-label="FEVER発動台本">
      <header><Sparkle weight="fill" /><span><strong>FEVER SCRIPT</strong><small>発動タイミングもオート監督へ予約</small></span></header>
      <div>
        {Object.values(FEVER_SCRIPTS).map((script) => {
          const Icon = icons[script.id] ?? Lightning;
          const active = selected === script.id;
          return (
            <button type="button" className={active ? "is-selected" : ""} aria-pressed={active} onClick={() => onSelect(script.id)} key={script.id}>
              <Icon weight="fill" /><span><strong>{script.name}</strong><small>{script.description}</small></span><em>{script.tag}</em>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function RouteMap({ distance, lastWall = 0, cleared = [], condensed = false }) {
  const progress = Math.max(0, Math.min(100, (distance / WORLD_END) * 100));
  const wall = Math.max(0, Math.min(100, (lastWall / WORLD_END) * 100));
  return (
    <section className={`route-map ${condensed ? "route-map--condensed" : ""}`} aria-label="ワールド進行状況">
      <div className="route-map__heading">
        <span>NEXT GOAL</span>
        <strong>{Math.floor(distance)} / {WORLD_END}m</strong>
      </div>
      <div className="route-map__track">
        <span className="route-map__fill" style={{ width: `${progress}%` }} />
        {lastWall > 0 ? <span className="route-map__wall" style={{ left: `${wall}%` }} title="前回の到達地点" /> : null}
        {ROUTE_MARKERS.map((marker, index) => {
          const markerLeft = Math.min(98, Math.max(1, (marker.distance / WORLD_END) * 100));
          const complete = marker.distance === 0 || marker.distance < distance || cleared.includes(marker.distance);
          return (
            <span
              className={`route-map__marker route-map__marker--${marker.type} ${complete ? "is-complete" : ""}`}
              style={{ left: `${markerLeft}%` }}
              key={`${marker.distance}-${marker.label}`}
            >
              <i>{marker.type === "final" ? <Crown weight="fill" /> : marker.type === "area" ? <Medal weight="fill" /> : <Heart weight="fill" />}</i>
              {!condensed || index === 0 || marker.type === "area" || marker.type === "final" ? <small>{marker.label}</small> : null}
            </span>
          );
        })}
        <img
          className="route-map__player"
          src="/assets/sakiya-avatar.webp"
          alt="現在地"
          style={{ left: `${Math.min(97, Math.max(1.5, progress))}%` }}
        />
      </div>
      <div className="route-map__legend">
        <span><i className="legend-dot legend-dot--current" />現在地</span>
        {lastWall > 0 ? <span><i className="legend-dot legend-dot--wall" />前回の壁 {Math.floor(lastWall)}m</span> : <span>最初の景色へ</span>}
      </div>
    </section>
  );
}

function OpeningModal({ onBegin }) {
  return (
    <div className="modal-backdrop opening-backdrop" role="presentation">
      <section className="opening-modal" role="dialog" aria-modal="true" aria-labelledby="opening-title">
        <div className="opening-modal__art" aria-hidden="true"><img src="/assets/sakiya-avatar.webp" alt="" /></div>
        <div className="opening-modal__content">
          <span className="eyebrow">FIRST BROADCAST</span>
          <h1 id="opening-title">負けた配信は、<br />次の最強になる。</h1>
          <p>さきやは自動で右へ進み、戦い、補給し、配信を育てます。あなたは配信方針を決め、数字と歓声が前回の壁を壊す瞬間を見届けます。</p>
          <div className="opening-promises">
            <div><Target weight="fill" /><span><strong>もっと右へ</strong><small>景色・敵・収益帯が更新</small></span></div>
            <div><Heart weight="fill" /><span><strong>敗北を持ち帰る</strong><small>配信メモリーで永久強化</small></span></div>
            <div><Sparkle weight="fill" /><span><strong>前回を踏み潰す</strong><small>旧敵・旧BOSSが一瞬で溶ける</small></span></div>
          </div>
          <div className="content-note"><Warning weight="fill" /><span><strong>表現について</strong><small>喫煙を題材にしたフィクションです。実在銘柄、摂取方法、現実の効能表現は含みません。</small></span></div>
          <button className="primary-button primary-button--hero" type="button" onClick={onBegin} autoFocus>
            <span><Broadcast weight="fill" />配信スタジオへ</span><small>オートセーブはいつでも設定からバックアップできます</small>
          </button>
        </div>
      </section>
    </div>
  );
}

function RunBrief({ save }) {
  const objectives = buildRunObjectives(save);
  return (
    <section className="run-brief" aria-label="次の配信目標">
      <header><ListChecks weight="fill" /><span><strong>NEXT STREAM BRIEF</strong><small>方針に合わせた3つの配信目標</small></span></header>
      <div>
        {objectives.map((objective) => (
          <span key={objective.id}><i /><strong>{objective.name}</strong><small>{objective.direction === "lte" ? `${objective.target}位以内` : `${objective.target}${objective.unit}`}</small><em>+{objective.reward}</em></span>
        ))}
      </div>
    </section>
  );
}

function EncoreSetlist({ save, onToggle }) {
  const selected = save.loadout.encoreModifiers ?? [];
  const reward = selected.reduce((value, id) => value * (ENCORE_MODIFIERS[id]?.reward ?? 1), 1) * (1 + ((save.postgame?.encoreLevel ?? 0) + 1) * 0.18);
  return (
    <section className="encore-setlist">
      <header><Crown weight="fill" /><span><strong>ENCORE SETLIST — Lv.{(save.postgame?.encoreLevel ?? 0) + 1}</strong><small>Ending後だけの明示的な高難度再配信。最大2曲。</small></span><em>記憶 ×{reward.toFixed(2)}</em></header>
      <div>
        {Object.values(ENCORE_MODIFIERS).map((modifier) => {
          const active = selected.includes(modifier.id);
          return (
            <button key={modifier.id} type="button" className={active ? "is-selected" : ""} onClick={() => onToggle(modifier.id)} aria-pressed={active}>
              {active ? <CheckCircle weight="fill" /> : <Star />}
              <span><strong>{modifier.name}</strong><small>{modifier.description}</small></span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SettingsModal({ save, onSettings, onImport, onReset, onClose }) {
  const [transfer, setTransfer] = useState(() => serializeSave(save));
  const [notice, setNotice] = useState("");
  const [resetArmed, setResetArmed] = useState(false);
  const [slots, setSlots] = useState(listSaveSlots);
  const backup = loadAutoBackup();

  const copySave = async () => {
    const code = serializeSave(save);
    setTransfer(code);
    try {
      await navigator.clipboard.writeText(code);
      setNotice("セーブコードをコピーしました");
    } catch {
      setNotice("下のコードを選択してコピーしてください");
    }
  };

  const importSave = () => {
    const parsed = deserializeSave(transfer);
    if (!parsed) {
      setNotice("セーブコードを読み込めませんでした");
      return;
    }
    onImport(parsed);
    setNotice("セーブを読み込みました");
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <div><span className="eyebrow">SYSTEM</span><h2 id="settings-title">配信設定</h2></div>
          <IconButton label="閉じる" onClick={onClose}><X /></IconButton>
        </header>
        <div className="settings-list">
          <button type="button" onClick={() => onSettings("sound", !save.settings.sound)}>
            {save.settings.sound ? <SpeakerHigh weight="fill" /> : <SpeakerSlash weight="fill" />}
            <span><strong>サウンド</strong><small>配信SEとリアクティブBGM</small></span><b>{save.settings.sound ? "ON" : "OFF"}</b>
          </button>
          <button type="button" onClick={() => onSettings("reducedMotion", !save.settings.reducedMotion)}>
            <Gauge weight="fill" /><span><strong>視覚効果を抑える</strong><small>点滅と粒子の移動量を減らします</small></span><b>{save.settings.reducedMotion ? "ON" : "OFF"}</b>
          </button>
          <button type="button" onClick={() => onSettings("shake", !save.settings.shake)}>
            <Lightning weight="fill" /><span><strong>画面揺れ</strong><small>被弾・必殺・ボス撃破の衝撃</small></span><b>{save.settings.shake ? "ON" : "OFF"}</b>
          </button>
          <button type="button" onClick={() => onSettings("comments", !save.settings.comments)}>
            <Broadcast weight="fill" /><span><strong>コメント欄</strong><small>ゲーム状態に反応する配信コメント</small></span><b>{save.settings.comments ? "ON" : "OFF"}</b>
          </button>
          <button type="button" onClick={() => onSettings("highContrast", !save.settings.highContrast)}>
            <ShieldCheck weight="duotone" /><span><strong>高コントラスト</strong><small>HUD境界と文字を強調します</small></span><b>{save.settings.highContrast ? "ON" : "OFF"}</b>
          </button>
        </div>

        <div className="audio-mix" aria-label="音量バランス">
          <label>
            <span><strong>BGM</strong><small>エリア・ボス・FEVERで変化する楽曲</small></span>
            <input type="range" min="0" max="100" step="1" value={Math.round(save.settings.musicVolume * 100)} onChange={(event) => onSettings("musicVolume", Number(event.target.value) / 100)} disabled={!save.settings.sound} />
            <b>{Math.round(save.settings.musicVolume * 100)}%</b>
          </label>
          <label>
            <span><strong>効果音</strong><small>攻撃・被弾・ギフト・UIフィードバック</small></span>
            <input type="range" min="0" max="100" step="1" value={Math.round(save.settings.sfxVolume * 100)} onChange={(event) => onSettings("sfxVolume", Number(event.target.value) / 100)} disabled={!save.settings.sound} />
            <b>{Math.round(save.settings.sfxVolume * 100)}%</b>
          </label>
        </div>

        <div className="accessibility-grid">
          <div><span><strong>文字サイズ</strong><small>主要テキストの読みやすさ</small></span><div>{[1, 1.1, 1.2].map((scale) => <button type="button" className={save.settings.fontScale === scale ? "is-active" : ""} onClick={() => onSettings("fontScale", scale)} key={scale}>{scale === 1 ? "標準" : scale === 1.1 ? "大" : "特大"}</button>)}</div></div>
          <div><span><strong>ダメージ数字</strong><small>FEVER中の情報量</small></span><div><button type="button" className={save.settings.numberDensity === "full" ? "is-active" : ""} onClick={() => onSettings("numberDensity", "full")}>すべて</button><button type="button" className={save.settings.numberDensity === "reduced" ? "is-active" : ""} onClick={() => onSettings("numberDensity", "reduced")}>抑える</button></div></div>
          <div><span><strong>描画モード</strong><small>端末負荷と滑らかさ</small></span><div>{[30, 60].map((fps) => <button type="button" className={save.settings.frameRate === fps ? "is-active" : ""} onClick={() => onSettings("frameRate", fps)} key={fps}>{fps}fps</button>)}</div></div>
        </div>

        <div className="save-transfer">
          <div className="section-label"><span>SAVE DATA</span><small>ブラウザ保存済み</small></div>
          <textarea value={transfer} onChange={(event) => setTransfer(event.target.value)} aria-label="セーブコード" />
          <div className="button-row button-row--compact">
            <button className="secondary-button" type="button" onClick={copySave}><Copy />コピー</button>
            <button className="secondary-button" type="button" onClick={importSave}><UploadSimple />読み込み</button>
          </div>
          {notice ? <p className="inline-notice" role="status">{notice}</p> : null}
        </div>
        <div className="save-slots">
          <div className="section-label"><span>LOCAL BACKUP</span><small>3つの手動スロット＋自動バックアップ</small></div>
          <div className="save-slot-grid">
            {slots.map((slot) => (
              <div key={slot.index}>
                <span><FloppyDisk weight="fill" /><strong>SLOT {slot.index + 1}</strong><small>{slot.occupied ? `RUN ${slot.runCount} / ${Math.floor(slot.distance)}m` : "空きスロット"}</small></span>
                <button type="button" onClick={() => { writeSaveSlot(save, slot.index); setSlots(listSaveSlots()); setNotice(`SLOT ${slot.index + 1}へ保存しました`); }}>保存</button>
                <button type="button" disabled={!slot.occupied} onClick={() => { const stored = loadSaveSlot(slot.index); if (stored) onImport(stored); }}>読込</button>
              </div>
            ))}
          </div>
          <button className="backup-restore" type="button" disabled={!backup} onClick={() => backup && onImport(backup)}><HardDrives weight="fill" />自動バックアップから一つ前へ戻す</button>
        </div>
        <div className="settings-content-note"><Warning weight="fill" /><span><strong>Content note</strong><small>本作は喫煙を題材にしたフィクションです。現実の喫煙を推奨するものではありません。</small></span></div>
        <button
          className={`danger-button ${resetArmed ? "is-armed" : ""}`}
          type="button"
          onClick={() => {
            if (!resetArmed) {
              setResetArmed(true);
              setNotice("もう一度押すと、永続強化と記録を消去します");
              return;
            }
            onReset();
          }}
        >
          <Trash />{resetArmed ? "本当に最初から始める" : "セーブデータを初期化"}
        </button>
      </section>
    </div>
  );
}

function TitleScreen({ save, onStart, onUpgrade, onStrategy, onFeverScript, onSettings, onEnding, onArchive, onEncoreModifier }) {
  const multipliers = permanentMultipliers(save);
  const nextArea = save.records.finalBossDefeated ? `ENCORE Lv.${(save.postgame?.encoreLevel ?? 0) + 1}` : save.records.maxDistance >= 780 ? "FINAL AREA" : save.records.maxDistance >= 500 ? "AREA 3" : save.records.maxDistance >= 250 ? "AREA 2" : "AREA 1";
  return (
    <main className="title-screen">
      <header className="title-topbar">
        <span className="studio-mark"><Broadcast weight="fill" /> SAKIYA LIVE STUDIO</span>
        <div className="title-topbar__actions">
          <button className="title-archive-button" type="button" onClick={onArchive}><BookOpen weight="fill" />ARCHIVE</button>
          <span className="save-state"><ShieldCheck weight="fill" /> {formatSavedAt(save.profile.lastSavedAt)}</span>
          <IconButton label="設定" onClick={onSettings}><GearSix /></IconButton>
        </div>
      </header>

      <section className="title-hero">
        <div className="title-hero__world" aria-hidden="true" />
        <div className="title-hero__content">
          <Logo />
          <p className="title-hero__promise">次の景色は、前回の壁の向こう。</p>
          <div className="title-avatar-card">
            <img src="/assets/sakiya-avatar.webp" alt="八乙女さきや" />
            <span><small>STREAMER</small><strong>八乙女さきや</strong><em>LIVE READY</em></span>
          </div>
        </div>
        <div className="title-hero__boss" aria-hidden="true">
          <img src="/assets/sprites/boss-final.webp" alt="" />
          <span><Crown weight="fill" /> 最も右に待つもの</span>
        </div>
      </section>

      <section className="title-dashboard">
        <div className="title-dashboard__main">
          <div className="section-label"><span>次の配信方針</span><small>RUN中の成長・補給・FEVERを自動監督</small></div>
          <StrategyCards selected={save.loadout.strategy} onSelect={onStrategy} />
          <FeverScriptCards selected={save.loadout.feverScript} onSelect={onFeverScript} />
          <RunBrief save={save} />
          {save.records.finalBossDefeated ? <EncoreSetlist save={save} onToggle={onEncoreModifier} /> : null}
          <button className="primary-button primary-button--hero" type="button" onClick={onStart}>
            <span><Play weight="fill" />{save.records.finalBossDefeated ? "アンコール開始" : "配信開始"}</span><small>RUN #{save.runCount + 1} — {nextArea}へ</small>
          </button>
          <p className="watch-note"><FastForward weight="fill" /> 前進・戦闘・補給・強化は自動。見守るだけで最後まで進行します。</p>
        </div>

        <aside className="title-records">
          <div className="section-label"><span>配信記録</span><small>前回より右へ</small></div>
          <div className="record-grid">
            <StatChip icon={ChartLineUp} label="最高到達" value={`${Math.floor(save.records.maxDistance)}m`} tone="purple" />
            <StatChip icon={Trophy} label="最高順位" value={`#${save.records.bestRank}`} tone="gold" />
            <StatChip icon={UsersThree} label="定着リスナー" value={compact(save.followers)} tone="cyan" />
            <StatChip icon={Lightning} label="永久火力" value={`×${compact(multipliers.attack)}`} />
          </div>
          <RouteMap distance={save.records.maxDistance} lastWall={save.records.maxDistance} condensed />
          <div className="memory-wallet">
            <img src="/assets/items/rabbit-charm.webp" alt="配信の記憶" />
            <span><small>配信の記憶</small><strong>{compact(save.memories)}</strong></span>
            <button type="button" onClick={onUpgrade}>永続強化</button>
          </div>
          <button className="archive-cta" type="button" onClick={onArchive}><BookOpen weight="fill" /><span><strong>配信アーカイブ</strong><small>旅・BOSS・RUN履歴・実績を確認</small></span></button>
          {save.records.finalBossDefeated ? <button className="ending-replay" type="button" onClick={onEnding}><Crown weight="fill" />エンディングをもう一度見る</button> : null}
        </aside>
      </section>
    </main>
  );
}

function RunScreen({ view, engineRef, save, paused, onPause, onSpeed, onIkebo, onSettings, onEnd }) {
  if (!view) return null;
  const totalListeners = view.followersStart + view.followersGained;
  const area = AREAS.find((item) => item.id === view.areaId) ?? AREAS[0];
  const nextGoal = view.nextGoal;
  const rank = rankTier(view.rank);
  const ikeboReady = view.ikebo >= 50;
  return (
    <main className={`run-screen ${view.feverTime > 0 ? "is-fever" : ""}`}>
      <p className="sr-only" aria-live="polite">{view.areaTransition ?? (view.bossName ? `${view.bossName}とのボス戦` : `${area.name} ${area.subtitle}を進行中`)}</p>
      <header className="run-header">
        <Logo compactMode />
        <div className="streamer-card">
          <img src="/assets/sakiya-avatar.webp" alt="八乙女さきや" />
          <span><small><i /> LIVE</small><strong>八乙女さきや</strong></span>
        </div>
        <div className="core-meters">
          <Meter label="イケボ" value={view.ikebo} max={100} tone="gold" icon={MicrophoneStage} detail={`${Math.floor(view.ikebo)} / 100`} />
          <Meter label="リスナーの愛" value={view.love} max={view.maxLove} tone="pink" icon={Heart} detail={`${compact(view.love)} / ${compact(view.maxLove)}`} />
          <Meter label="ヤニ" value={view.yani} max={view.yaniMax} tone="purple" icon={Cigarette} detail={view.refilling ? "補給中" : `${Math.floor(view.yani)}%`} />
        </div>
        <div className="run-header__actions">
          <IconButton label={save.settings.sound ? "サウンドON" : "サウンドOFF"} onClick={onSettings}>{save.settings.sound ? <SpeakerHigh /> : <SpeakerSlash />}</IconButton>
          <IconButton label="一時停止" onClick={() => onPause(true)}><Pause weight="fill" /></IconButton>
        </div>
      </header>

      <section className="run-stats">
        <StatChip icon={UsersThree} label="リスナー" value={compact(totalListeners)} delta={`+${compact(view.followersGained)}`} tone="cyan" />
        <StatChip icon={Broadcast} label="LIVE人数" value={compact(view.liveViewers)} delta={`PEAK ${compact(view.peakLive)}`} />
        <StatChip icon={Coins} label="応援" value={compact(view.coins)} delta={`+${compact(view.incomePerSecond)} / 秒`} tone="gold" />
        <StatChip icon={Gift} label="ギフト" value={compact(view.gifts)} delta={view.feverTime > 0 ? "FEVER倍率中" : "配信中"} tone="purple" />
        <StatChip icon={Trophy} label="配信ランキング" value={`#${view.rank}`} delta={`${rank.label} ×${rank.multiplier}`} tone="gold" />
      </section>

      <section className="fever-strip">
        <div className="fever-strip__title"><Lightning weight="fill" /><strong>{view.feverTime > 0 ? "FEVER!!" : "FEVER"}</strong></div>
        <div className="fever-strip__track"><span style={{ width: `${view.feverTime > 0 ? 100 : view.fever}%` }} /></div>
        <span>{view.feverTime > 0 ? `${view.feverTime.toFixed(1)}秒 / 応援・火力 ×${view.feverPower.toFixed(1)}` : view.feverScript.bossOnly && view.fever >= 100 ? "BOSSまで温存中" : `${Math.floor(view.fever)}%`}</span>
      </section>

      <section className="run-body">
        {save.settings.comments ? (
          <aside className="comment-panel" aria-label="リアルタイムコメント">
            <header><Broadcast weight="fill" /><span>LIVE COMMENT</span><i /></header>
            <div className="comment-list">
              {view.comments.map((comment, index) => (
                <div className={`comment comment--${comment.type}`} key={comment.id} style={{ opacity: 1 - index * 0.08 }}>
                  <img src="/assets/sakiya-avatar.webp" alt="" />
                  <span><small>{comment.user}</small><strong>{comment.text}</strong></span>
                </div>
              ))}
            </div>
            <footer><span>視聴者が配信状態に反応中</span><strong>{compact(view.liveViewers)}</strong></footer>
          </aside>
        ) : null}

        <div className="arena-column">
          <div className="area-ribbon">
            <span><small>{area.name}</small><strong>{area.subtitle}</strong></span>
            <em>{view.boss ? `${view.bossName} · PHASE ${view.bossPhase}` : view.mode === "encore" ? `ENCORE Lv.${view.difficulty.tier} / ${area.stage}` : area.stage}</em>
            <span><small>COMBO</small><strong>{view.combo}</strong></span>
          </div>
          <GameCanvas engineRef={engineRef} reducedMotion={save.settings.reducedMotion} shake={save.settings.shake} numberDensity={save.settings.numberDensity} frameRate={save.settings.frameRate} />
          <div className="arena-controls">
            <div className="auto-status"><span><i /> AUTO DIRECTOR</span><strong>{view.strategy.name} · {view.feverScript.name}</strong></div>
            <div className="speed-control" aria-label="ゲーム速度">
              {[1, 2, 4].map((speed) => <button key={speed} type="button" className={save.settings.speed === speed ? "is-active" : ""} onClick={() => onSpeed(speed)}>{speed}×</button>)}
            </div>
            <button className={`ikebo-button ${ikeboReady ? "is-ready" : ""}`} type="button" onClick={onIkebo} disabled={!ikeboReady}>
              <MicrophoneStage weight="fill" /><span><strong>イケボ早撃ち</strong><small>{ikeboReady ? "任意介入 / 50消費" : `${Math.floor(view.ikebo)} / 50`}</small></span>
            </button>
          </div>
          <div className="director-objectives" aria-label="配信目標">
            <header><ListChecks weight="fill" /><span><strong>DIRECTOR GOALS</strong><small>達成すると配信メモリー追加</small></span></header>
            <div>{view.objectives.map((objective) => (
              <span className={objective.complete ? "is-complete" : ""} key={objective.id}>
                {objective.complete ? <CheckCircle weight="fill" /> : <Target />}
                <i><strong>{objective.name}</strong><small>{objective.direction === "lte" ? `現在 #${objective.value} / #${objective.target}` : `${objective.value} / ${objective.target}${objective.unit}`}</small><b><em style={{ width: `${objective.ratio * 100}%` }} /></b></i>
                <mark>+{objective.reward}</mark>
              </span>
            ))}</div>
          </div>
        </div>
      </section>

      <section className="run-footer">
        <div className="run-growth">
          <div className="run-growth__heading">
            <span><ChartLineUp weight="fill" /> RUN内自動成長</span>
            <small>{nextGoal ? `${nextGoal.name}まで残り ${Math.max(0, Math.ceil(nextGoal.distance - view.distance))}m` : "最終決戦"}</small>
          </div>
          <div className="run-upgrade-grid">
            {Object.entries(RUN_UPGRADES).map(([key, item]) => {
              const Icon = UPGRADE_ICONS[key] ?? Gauge;
              const cost = runUpgradeCost(key, view.levels[key]);
              const capped = view.levels[key] >= (RUN_LEVEL_CAPS[view.areaId] ?? 21);
              return (
                <div className="run-upgrade-card" key={key}>
                  <Icon weight="fill" /><span><small>{item.short}</small><strong>{item.name} Lv.{view.levels[key]}</strong></span><em>{capped ? "AREA MAX" : `AUTO ${compact(cost)}`}</em>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <div className="run-route-dock">
        <RouteMap distance={view.distance} lastWall={view.lastWall} cleared={view.clearedMilestones} condensed />
      </div>

      {paused ? (
        <div className="pause-overlay" role="dialog" aria-modal="true" aria-label="配信一時停止">
          <div>
            <Pause weight="fill" /><span className="eyebrow">STREAM PAUSED</span><h2>配信準備中</h2>
            <p>進行と戦闘を一時停止しています。記録は失われません。</p>
            <button className="primary-button" type="button" onClick={() => onPause(false)}><Play weight="fill" />配信へ戻る</button>
            <button className="secondary-button" type="button" onClick={onSettings}><GearSix />設定</button>
            <button className="text-button" type="button" onClick={onEnd}>ここまでで配信終了</button>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function ResultScreen({ result, save, onUpgrade, onRestart, onTitle, onEnding }) {
  if (!result) return null;
  const isVictory = result.status === "victory";
  const area = result.area ?? AREAS[0];
  const distanceDelta = resultDelta(result, result.previous, "distance");
  const rankDelta = resultDelta(result, result.previous, "bestRank", true);
  const hitDelta = resultDelta(result, result.previous, "maxHit");
  const bossCopy = result.bossName && result.bossRemaining != null && result.bossRemaining > 0
    ? `${result.bossName} 残り ${Math.ceil(result.bossRemaining * 100)}%`
    : result.defeatedBosses.length
      ? `${result.defeatedBosses.at(-1)} を撃破`
      : `${area.subtitle}で配信終了`;
  const records = [
    [Coins, "獲得応援", compact(result.coins)],
    [Gift, "獲得ギフト", result.gifts.toLocaleString("ja-JP")],
    [ChartLineUp, "最大COMBO", result.combo.toLocaleString("ja-JP")],
    [Broadcast, "到達地点", `${Math.floor(result.distance)}m`],
    [Medal, "倒した敵", result.kills.toLocaleString("ja-JP")],
    [Lightning, "FEVER回数", result.feverCount.toLocaleString("ja-JP")],
    [Trophy, "最高ランキング", `#${result.bestRank}`],
    [UsersThree, "増加リスナー", `+${compact(result.followers)}`],
  ];
  return (
    <main className="result-screen" style={{ "--result-background": `url(${area.background})` }}>
      <header><Logo compactMode /><button className="secondary-button" type="button" onClick={onTitle}>配信トップへ</button></header>
      <section className="result-card">
        <div className="result-card__heading">
          <span className="eyebrow">{result.mode === "encore" ? `ENCORE Lv.${result.encoreTier}` : isVictory ? "LEGENDARY STREAM" : "STREAM OFFLINE"}</span>
          <h1>{isVictory ? "FINAL BOSS 撃破" : "配信終了"}</h1><p>RUN RESULT — #{save.runCount}</p>
        </div>
        <div className="result-location">
          <div><span>{isVictory ? <Crown weight="fill" /> : <Heart weight="fill" />}</span><div><small>今回の配信記録</small><strong>{bossCopy}</strong></div></div>
          {result.bossName && result.bossRemaining != null && result.bossRemaining > 0 ? (
            <div className="boss-remain"><span style={{ width: `${result.bossRemaining * 100}%` }} /><em>BOSS HP {Math.ceil(result.bossRemaining * 100)}%</em></div>
          ) : null}
        </div>
        <div className="result-comparison" aria-label="前回の配信との比較">
          <header><ChartLineUp weight="fill" /><span><strong>前回より、どこが強くなった？</strong><small>{result.previous ? "直前の配信と比較" : "最初の比較基準を記録しました"}</small></span></header>
          <div>
            <span className={distanceDelta?.improved ? "is-improved" : ""}><small>到達距離</small><strong>{distanceDelta ? `${distanceDelta.delta >= 0 ? "+" : ""}${Math.floor(distanceDelta.delta)}m` : "BASELINE"}</strong></span>
            <span className={rankDelta?.improved ? "is-improved" : ""}><small>最高順位</small><strong>{rankDelta ? `${rankDelta.delta < 0 ? "▲" : rankDelta.delta > 0 ? "▼" : "±"}${Math.abs(rankDelta.delta)}` : `#${result.bestRank}`}</strong></span>
            <span className={hitDelta?.improved ? "is-improved" : ""}><small>最大ダメージ</small><strong>{hitDelta && result.previous?.maxHit > 0 ? `×${(result.maxHit / result.previous.maxHit).toFixed(1)}` : compact(result.maxHit)}</strong></span>
            <span className={result.objectiveClears > 0 ? "is-improved" : ""}><small>配信目標</small><strong>{result.objectiveClears} / {result.objectives.length}</strong></span>
          </div>
        </div>
        <div className="result-grid">
          {records.map(([Icon, label, value]) => <div key={label}><Icon weight="fill" /><span><small>{label}</small><strong>{value}</strong></span></div>)}
        </div>
        <div className="result-objectives">
          <div className="section-label"><span>DIRECTOR GOALS</span><small>目標報酬 +{result.objectiveReward} メモリー</small></div>
          <div>{result.objectives.map((objective) => <span className={objective.complete ? "is-complete" : ""} key={objective.id}>{objective.complete ? <CheckCircle weight="fill" /> : <Target />}<i><strong>{objective.name}</strong><small>{objective.direction === "lte" ? `#${objective.value} / #${objective.target}` : `${objective.value} / ${objective.target}${objective.unit}`}</small></i><em>+{objective.reward}</em></span>)}</div>
        </div>
        <div className="memory-result">
          <img src="/assets/items/rabbit-charm.webp" alt="配信の記憶" />
          <span><small>永久強化へ持ち帰る</small><strong>配信の記憶 +{result.memories}</strong><em>所持 {compact(save.memories)}</em></span>
        </div>
        <div className="result-extra">
          <span>最大ダメージ <strong>{compact(result.maxHit)}</strong></span>
          <span>PERFECT <strong>{result.perfectDodges}</strong></span>
          <span>OVERKILL <strong>{result.overkills}</strong></span>
          <span>配信時間 <strong>{formatTime(result.elapsed)}</strong></span>
        </div>
        <div className="loop-promise"><span>稼ぐ</span><i /><span>負ける</span><i /><strong>強化</strong><i /><span>再スタート</span></div>
        <div className="result-actions">
          {isVictory ? (
            <button className="primary-button primary-button--hero" type="button" onClick={onEnding}><span><Crown weight="fill" />エンディングへ</span><small>長い旅の、一番右へ</small></button>
          ) : (
            <button className="primary-button primary-button--hero" type="button" onClick={onUpgrade}><span><ChartLineUp weight="fill" />永久強化へ</span><small>次の配信を、明らかに強くする</small></button>
          )}
          <button className="secondary-button" type="button" onClick={onRestart}><ArrowClockwise />そのまま再スタート</button>
        </div>
      </section>
    </main>
  );
}

function UpgradeScreen({ save, onBuy, onStrategy, onFeverScript, onRestart, onTitle }) {
  const multipliers = permanentMultipliers(save);
  const recommended = recommendedUpgrade(save, save.lastResult);
  return (
    <main className="upgrade-screen">
      <header className="upgrade-header">
        <Logo compactMode />
        <div className="upgrade-wallet"><img src="/assets/items/rabbit-charm.webp" alt="" /><span><small>配信の記憶</small><strong>{compact(save.memories)}</strong></span></div>
        <button className="secondary-button" type="button" onClick={onTitle}>配信トップへ</button>
      </header>
      <section className="upgrade-intro">
        <span className="eyebrow">PERMANENT GROWTH</span><h1>次の配信は、最初から強い。</h1>
        <p>前回の敗北を火力・継続・盛り上がりへ変換します。強化はブラウザを閉じても保持されます。</p>
        <div className="power-preview">
          <div><MicrophoneStage weight="fill" /><span><small>初期攻撃</small><strong>×{compact(multipliers.attack)}</strong></span></div>
          <div><Heart weight="fill" /><span><small>最大愛</small><strong>×{compact(multipliers.maxLove)}</strong></span></div>
          <div><Gift weight="fill" /><span><small>応援倍率</small><strong>×{compact(multipliers.gift)}</strong></span></div>
          <div><Coins weight="fill" /><span><small>開始支援金</small><strong>{compact(multipliers.starterCoins)}</strong></span></div>
        </div>
      </section>

      <section className="upgrade-list-section">
        <div className="section-label"><span>永続強化</span><small>1レベルでも序盤の手触りが変わる</small></div>
        <div className="permanent-grid">
          {Object.entries(PERMANENT_UPGRADES).map(([key, upgrade]) => {
            const Icon = UPGRADE_ICONS[key] ?? Gauge;
            const level = save.upgrades[key] ?? 0;
            const maxed = level >= upgrade.max;
            const cost = permanentUpgradeCost(key, level);
            const affordable = save.memories >= cost;
            const unlock = upgradeUnlocked(key, save);
            const preview = permanentPreview(save, key);
            return (
              <article className={`permanent-card ${maxed ? "is-maxed" : ""} ${!unlock.unlocked ? "is-locked" : ""} ${recommended === key ? "is-recommended" : ""}`} key={key}>
                <div className="permanent-card__icon"><Icon weight="fill" /></div>
                <div className="permanent-card__content">
                  <span><small>{recommended === key ? "NEXT WALL PICK" : !unlock.unlocked ? "LOCKED BRANCH" : "PERMANENT"}</small><em>Lv.{level} / {upgrade.max}</em></span><h3>{upgrade.name}</h3><p>{unlock.unlocked ? upgrade.effect : unlock.reason}</p>
                  {unlock.unlocked && !maxed ? <div className="upgrade-preview"><small>{preview[0]}</small><strong>{preview[1]} <i>→</i> {preview[2]}</strong></div> : null}
                  <div className="level-pips">{Array.from({ length: Math.min(upgrade.max, 12) }, (_, index) => <i className={index < level ? "is-filled" : ""} key={index} />)}</div>
                </div>
                <button type="button" disabled={maxed || !affordable || !unlock.unlocked} onClick={() => onBuy(key)}>
                  {!unlock.unlocked ? <><LockKey weight="fill" />未解放</> : maxed ? <><ShieldCheck weight="fill" />MAX</> : <><img src="/assets/items/rabbit-charm.webp" alt="" />{compact(cost)}</>}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="restart-panel">
        <div><span className="eyebrow">AUTO DIRECTOR</span><h2>次の配信方針</h2><p>選んだ方針に沿って、RUN中の購入・ヤニ補給・FEVER加速が自動進行します。</p></div>
        <StrategyCards selected={save.loadout.strategy} onSelect={onStrategy} compactMode />
        <FeverScriptCards selected={save.loadout.feverScript} onSelect={onFeverScript} compactMode />
        <button className="primary-button primary-button--hero" type="button" onClick={onRestart}>
          <span><ArrowClockwise weight="fill" />再スタート!!</span><small>強化した力で、もっと先へ行こう！</small>
        </button>
      </section>
    </main>
  );
}

function EndingScreen({ result, save, onRestart, onUpgrade, onTitle }) {
  return (
    <main className="ending-screen">
      <div className="ending-screen__world" aria-hidden="true" />
      <header><Logo compactMode /><span><Crown weight="fill" /> FINAL STREAM ARCHIVE</span></header>
      <section className="ending-content">
        <div className="ending-crown"><img src="/assets/sprites/boss-final.webp" alt="撃破されたKING YAMIGURO" /></div>
        <span className="eyebrow">THE FARTHEST RIGHT</span><h1>一番右まで、配信した。</h1>
        <p>街の光も、崩れたLIVE看板も、負けた配信も。すべてがこの神回につながった。</p>
        <div className="ending-quote"><img src="/assets/sakiya-avatar.webp" alt="八乙女さきや" /><blockquote>「配信は終わらない。次は、もっと壊れた数字を見せにいこ。」</blockquote></div>
        <div className="ending-records">
          <span><small>RUN</small><strong>{save.runCount}</strong></span><span><small>FINAL TIME</small><strong>{formatTime(result?.elapsed ?? 0)}</strong></span>
          <span><small>LISTENERS</small><strong>{compact(save.followers)}</strong></span><span><small>BEST RANK</small><strong>#{save.records.bestRank}</strong></span>
        </div>
        <div className="ending-actions">
          <button className="primary-button primary-button--hero" type="button" onClick={onRestart}><span><ArrowClockwise weight="fill" />ENCORE RUN</span><small>最初の敵が、どれだけ弱くなったか確かめる</small></button>
          <button className="secondary-button" type="button" onClick={onUpgrade}><ChartLineUp />さらに強化</button>
          <button className="text-button" type="button" onClick={onTitle}>配信トップへ戻る</button>
        </div>
      </section>
    </main>
  );
}

function ArchiveScreen({ save, onBack, onStart, onUpgrade }) {
  const clearedAchievements = ARCHIVE_ACHIEVEMENTS.filter((achievement) => achievement.test(save));
  const totalUpgradeLevels = Object.values(save.upgrades).reduce((sum, level) => sum + level, 0);
  const channelLevel = 1 + totalUpgradeLevels + save.records.bossesDefeated.length * 3 + (save.postgame?.crowns ?? 0) * 5;
  const areaUnlocked = (area) => area.id === 1
    || (area.id === 2 && save.unlocks.area2)
    || (area.id === 3 && save.unlocks.area3)
    || (area.id === 4 && save.unlocks.final);
  const areaProgress = (area) => area.id === 4 && save.records.finalBossDefeated
    ? 1
    : Math.max(0, Math.min(1, (save.records.maxDistance - area.start) / Math.max(1, area.end - area.start)));

  return (
    <main className="archive-screen">
      <header className="archive-header">
        <Logo compactMode />
        <div><span className="eyebrow">STREAM ARCHIVE</span><h1>配信アーカイブ</h1><p>負けた記録も、越えた街も、すべて次の強さになる。</p></div>
        <button className="secondary-button" type="button" onClick={onBack}>配信トップへ</button>
      </header>

      <section className="archive-profile">
        <div className="archive-profile__avatar"><img src="/assets/sakiya-avatar.webp" alt="八乙女さきや" /><i><Broadcast weight="fill" /> LIVE CHANNEL</i></div>
        <div className="archive-profile__level"><small>CHANNEL LEVEL</small><strong>{channelLevel}</strong><span><i style={{ width: `${Math.min(100, ((totalUpgradeLevels % 10) / 10) * 100)}%` }} /></span><em>永久強化 {totalUpgradeLevels} Lv.</em></div>
        <div className="archive-profile__records">
          <span><ChartLineUp weight="fill" /><i><small>最長配信</small><strong>{Math.floor(save.records.maxDistance)}m</strong></i></span>
          <span><Trophy weight="fill" /><i><small>最高ランキング</small><strong>#{save.records.bestRank}</strong></i></span>
          <span><UsersThree weight="fill" /><i><small>定着リスナー</small><strong>{compact(save.followers)}</strong></i></span>
          <span><ClockCountdown weight="fill" /><i><small>総配信時間</small><strong>{formatTime(save.profile.totalPlaySeconds)}</strong></i></span>
        </div>
      </section>

      <section className="archive-world">
        <div className="section-label"><span>WORLD JOURNEY</span><small>右へ進むほど色と収益帯が変わる</small></div>
        <div className="archive-area-rail">
          {AREAS.map((area) => {
            const unlocked = areaUnlocked(area);
            const progress = areaProgress(area);
            return (
              <article className={unlocked ? "is-unlocked" : "is-locked"} key={area.id} style={{ "--archive-area": `url(${area.background})`, "--area-accent": area.accent }}>
                <div className="archive-area-card__image">{!unlocked ? <LockKey weight="fill" /> : progress >= 1 ? <CheckCircle weight="fill" /> : <Heart weight="fill" />}</div>
                <div className="archive-area-card__copy"><small>{area.name}</small><strong>{unlocked ? area.subtitle : "未到達エリア"}</strong><span>{unlocked ? area.stage : "さらに右へ進んで解放"}</span><b><i style={{ width: `${progress * 100}%` }} /></b><em>{unlocked ? `${Math.floor(progress * 100)}% 探索` : "LOCKED"}</em></div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="archive-bosses">
        <div className="section-label"><span>BOSS SIGNALS</span><small>{save.records.bossesDefeated.length} / {MILESTONES.length} 記録済み</small></div>
        <div className="archive-boss-grid">
          {MILESTONES.map((boss) => {
            const defeated = save.records.bossesDefeated.includes(boss.name);
            return (
              <article className={defeated ? "is-recorded" : "is-unknown"} key={boss.name}>
                <div><img src={boss.sprite} alt={defeated ? boss.name : "未記録のボス"} />{defeated ? <CheckCircle weight="fill" /> : <LockKey weight="fill" />}</div>
                <small>{boss.type === "final" ? "FINAL BOSS" : boss.type === "area" ? `AREA ${boss.area} BOSS` : `AREA ${boss.area} MID`}</small>
                <strong>{defeated ? boss.name : "UNKNOWN SIGNAL"}</strong><span>{boss.distance}m</span><em>{defeated ? boss.mechanicLabel : "LOCKED"}</em>
              </article>
            );
          })}
        </div>
      </section>

      <section className="archive-lower-grid">
        <div className="archive-achievements">
          <div className="section-label"><span>CHANNEL BADGES</span><small>{clearedAchievements.length} / {ARCHIVE_ACHIEVEMENTS.length}</small></div>
          <div>
            {ARCHIVE_ACHIEVEMENTS.map((achievement) => {
              const complete = achievement.test(save);
              return <span className={complete ? "is-complete" : ""} key={achievement.id}>{complete ? <Medal weight="fill" /> : <LockKey />}<i><strong>{achievement.name}</strong><small>{achievement.description}</small></i></span>;
            })}
          </div>
        </div>
        <div className="archive-history">
          <div className="section-label"><span>RECENT RUNS</span><small>直近20配信</small></div>
          {save.history.length ? (
            <div>{save.history.map((entry, index) => (
              <article key={entry.id}>
                <span className={entry.status === "victory" ? "is-victory" : ""}>{entry.status === "victory" ? <Crown weight="fill" /> : <Heart weight="fill" />}</span>
                <div><small>RUN #{Math.max(1, save.runCount - index)} · {entry.mode === "encore" ? "ENCORE" : "CAMPAIGN"}</small><strong>{entry.bossName ? `${entry.bossName} ${entry.status === "victory" ? "撃破" : `残り${Math.ceil((entry.bossRemaining ?? 1) * 100)}%`}` : `${entry.distance}mで配信終了`}</strong><em>{entry.at ? formatSavedAt(entry.at) : "記録時刻不明"}</em></div>
                <div><small>RANK</small><strong>#{entry.rank}</strong><em>+{entry.memories}</em></div>
              </article>
            ))}</div>
          ) : <div className="archive-empty"><Broadcast weight="fill" /><strong>最初の配信を待っています</strong><span>RUNを終えると、ここに壁と成長の記録が残ります。</span></div>}
        </div>
      </section>

      <section className="archive-actions">
        <button className="primary-button primary-button--hero" type="button" onClick={onStart}><span><Play weight="fill" />次の配信を始める</span><small>記録の一番右を更新する</small></button>
        <button className="secondary-button" type="button" onClick={onUpgrade}><ChartLineUp />永久強化を確認</button>
      </section>
    </main>
  );
}

export function App() {
  const [save, setSave] = useState(loadSave);
  const [screen, setScreen] = useState("title");
  const [view, setView] = useState(null);
  const [result, setResult] = useState(null);
  const [paused, setPaused] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const engineRef = useRef(null);
  const saveRef = useRef(save);
  const audioRef = useRef(null);
  const finishHandledRef = useRef(false);
  const finishTimeoutRef = useRef(null);
  const committedRunsRef = useRef(new Set());

  if (!audioRef.current) audioRef.current = createAudioDirector();

  useEffect(() => {
    saveRef.current = save;
    audioRef.current?.setEnabled(save.settings.sound);
    audioRef.current?.setMix({ music: save.settings.musicVolume, sfx: save.settings.sfxVolume });
    document.documentElement.dataset.contrast = save.settings.highContrast ? "high" : "normal";
    document.documentElement.dataset.motion = save.settings.reducedMotion ? "reduced" : "full";
    document.documentElement.dataset.numberDensity = save.settings.numberDensity;
    document.documentElement.dataset.frameRate = String(save.settings.frameRate);
    document.documentElement.style.setProperty("--user-font-scale", String(save.settings.fontScale));
  }, [save]);

  useEffect(() => {
    audioRef.current?.setTransport(screen === "run" && !paused && save.settings.sound);
  }, [paused, save.settings.sound, screen]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [screen]);

  useEffect(() => () => {
    if (finishTimeoutRef.current) window.clearTimeout(finishTimeoutRef.current);
    audioRef.current?.destroy();
  }, []);

  const persist = useCallback((updater) => {
    setSave((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      const written = writeSave(next);
      saveRef.current = written;
      return written;
    });
  }, []);

  const commitRun = useCallback((run) => {
    if (!run || committedRunsRef.current.has(run.id)) return;
    committedRunsRef.current.add(run.id);
    const runResult = calculateRunResult(run);
    const current = saveRef.current;
    runResult.previous = current.lastResult;
    const fastest = runResult.status === "victory"
      ? current.records.fastestClearMs == null
        ? Math.floor(runResult.elapsed * 1000)
        : Math.min(current.records.fastestClearMs, Math.floor(runResult.elapsed * 1000))
      : current.records.fastestClearMs;
    const next = {
      ...current,
      runCount: current.runCount + 1,
      memories: current.memories + runResult.memories,
      followers: current.followers + runResult.followers,
      profile: {
        ...current.profile,
        totalPlaySeconds: current.profile.totalPlaySeconds + runResult.elapsed,
      },
      postgame: {
        ...current.postgame,
        encoreLevel: current.postgame.encoreLevel + (runResult.status === "victory" && runResult.mode === "encore" ? 1 : 0),
        crowns: current.postgame.crowns + (runResult.status === "victory" && runResult.mode === "encore" ? 1 : 0),
      },
      unlocks: {
        ...current.unlocks,
        area2: current.unlocks.area2 || runResult.distance >= 250,
        area3: current.unlocks.area3 || runResult.distance >= 500,
        final: current.unlocks.final || runResult.distance >= 780,
        encore: current.unlocks.encore || runResult.status === "victory",
      },
      records: {
        ...current.records,
        maxDistance: Math.max(current.records.maxDistance, runResult.distance),
        bestRank: Math.min(current.records.bestRank, runResult.bestRank),
        maxListeners: Math.max(current.records.maxListeners, runResult.peakLive),
        maxCombo: Math.max(current.records.maxCombo, runResult.combo),
        maxHit: Math.max(current.records.maxHit, runResult.maxHit),
        finalBossDefeated: current.records.finalBossDefeated || runResult.status === "victory",
        fastestClearMs: fastest,
        bossesDefeated: mergeUnique(current.records.bossesDefeated, runResult.defeatedBosses),
      },
      lastResult: {
        status: runResult.status,
        distance: runResult.distance,
        bestRank: runResult.bestRank,
        memories: runResult.memories,
        maxHit: runResult.maxHit,
        followers: runResult.followers,
        combo: runResult.combo,
        bossName: runResult.bossName,
        bossRemaining: runResult.bossRemaining,
        elapsed: runResult.elapsed,
        objectiveClears: runResult.objectiveClears,
        mode: runResult.mode,
        endReason: runResult.endReason,
      },
      history: [
        {
          id: run.id,
          at: new Date().toISOString(),
          distance: Math.floor(runResult.distance),
          rank: runResult.bestRank,
          memories: runResult.memories,
          status: runResult.status,
          maxHit: runResult.maxHit,
          followers: runResult.followers,
          combo: runResult.combo,
          bossName: runResult.bossName,
          bossRemaining: runResult.bossRemaining,
          elapsed: runResult.elapsed,
          objectiveClears: runResult.objectiveClears,
          mode: runResult.mode,
          endReason: runResult.endReason,
        },
        ...current.history,
      ].slice(0, 20),
    };
    const written = writeSave(next);
    saveRef.current = written;
    setSave(written);
    setResult(runResult);
    setPaused(false);
    setScreen("result");
  }, []);

  const startRun = useCallback(() => {
    if (finishTimeoutRef.current) window.clearTimeout(finishTimeoutRef.current);
    finishHandledRef.current = false;
    const run = createRun(saveRef.current);
    engineRef.current = run;
    setResult(null);
    setView(publicRunSnapshot(run));
    setPaused(false);
    setScreen("run");
    audioRef.current?.setEnabled(saveRef.current.settings.sound);
    audioRef.current?.start();
    audioRef.current?.event({ type: "run-start" });
  }, []);

  useEffect(() => {
    if (screen !== "run" || paused) return undefined;
    let frame = 0;
    let previous = performance.now();
    let uiElapsed = 0;
    const animate = (now) => {
      const run = engineRef.current;
      if (!run) return;
      const realDt = Math.min(0.05, Math.max(0, (now - previous) / 1000));
      previous = now;
      const speed = Math.max(1, Number(saveRef.current.settings.speed) || 1);
      for (let tick = 0; tick < speed; tick += 1) {
        const events = stepRun(run, realDt);
        for (const event of events) audioRef.current?.event(event);
        if (run.status !== "running") break;
      }
      audioRef.current?.tick(run);
      uiElapsed += realDt;
      if (uiElapsed >= 0.065 || run.status !== "running") {
        setView(publicRunSnapshot(run));
        uiElapsed = 0;
      }
      if (run.status !== "running" && !finishHandledRef.current) {
        finishHandledRef.current = true;
        finishTimeoutRef.current = window.setTimeout(() => commitRun(run), saveRef.current.settings.reducedMotion ? 220 : 1050);
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [commitRun, paused, screen]);

  useEffect(() => {
    const onKey = (event) => {
      if (screen !== "run" || settingsOpen) return;
      if (event.code === "Escape") {
        event.preventDefault();
        setPaused((current) => !current);
      }
      if ((event.code === "Space" || event.code === "Enter") && !paused) {
        event.preventDefault();
        const run = engineRef.current;
        if (activateIkebo(run, true)) {
          audioRef.current?.event({ type: "ikebo", manual: true });
          setView(publicRunSnapshot(run));
        }
      }
      if (["Digit1", "Digit2", "Digit4"].includes(event.code)) {
        const speed = Number(event.code.at(-1));
        persist((current) => ({ ...current, settings: { ...current.settings, speed } }));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paused, persist, screen, settingsOpen]);

  const selectStrategy = (strategy) => {
    if (!STRATEGIES[strategy]) return;
    persist((current) => ({ ...current, loadout: { ...current.loadout, strategy } }));
  };

  const selectFeverScript = (feverScript) => {
    if (!FEVER_SCRIPTS[feverScript]) return;
    persist((current) => ({ ...current, loadout: { ...current.loadout, feverScript } }));
  };

  const selectEncoreModifier = (modifier) => {
    if (!ENCORE_MODIFIERS[modifier] || !saveRef.current.records.finalBossDefeated) return;
    persist((current) => {
      const selected = current.loadout.encoreModifiers ?? [];
      const next = selected.includes(modifier)
        ? selected.filter((id) => id !== modifier)
        : [...selected, modifier].slice(-2);
      return { ...current, loadout: { ...current.loadout, encoreModifiers: next } };
    });
  };

  const updateSetting = (key, value) => {
    persist((current) => ({ ...current, settings: { ...current.settings, [key]: value } }));
  };

  const buyPermanent = (key) => {
    const upgrade = PERMANENT_UPGRADES[key];
    if (!upgrade) return;
    const current = saveRef.current;
    const currentLevel = current.upgrades[key] ?? 0;
    const currentCost = permanentUpgradeCost(key, currentLevel);
    if (!upgradeUnlocked(key, current).unlocked || currentLevel >= upgrade.max || current.memories < currentCost) return;
    persist((current) => {
      const level = current.upgrades[key] ?? 0;
      const cost = permanentUpgradeCost(key, level);
      if (!upgradeUnlocked(key, current).unlocked || level >= upgrade.max || current.memories < cost) return current;
      return { ...current, memories: current.memories - cost, upgrades: { ...current.upgrades, [key]: level + 1 } };
    });
    audioRef.current?.event({ type: "upgrade" });
  };

  const resetAll = () => {
    const clean = clearSave();
    saveRef.current = clean;
    setSave(clean);
    setView(null);
    setResult(null);
    setPaused(false);
    setSettingsOpen(false);
    setScreen("title");
  };

  const mainScreen = useMemo(() => {
    if (screen === "run") {
      return (
        <RunScreen
          view={view}
          engineRef={engineRef}
          save={save}
          paused={paused}
          onPause={setPaused}
          onSpeed={(speed) => updateSetting("speed", speed)}
          onIkebo={() => {
            const run = engineRef.current;
            if (activateIkebo(run, true)) {
              audioRef.current?.event({ type: "ikebo", manual: true });
              setView(publicRunSnapshot(run));
            }
          }}
          onSettings={() => setSettingsOpen(true)}
          onEnd={() => {
            if (endRun(engineRef.current)) {
              audioRef.current?.event({ type: "defeat", reason: "retire" });
              setView(publicRunSnapshot(engineRef.current));
              setPaused(false);
            }
          }}
        />
      );
    }
    if (screen === "result") return <ResultScreen result={result} save={save} onUpgrade={() => setScreen("upgrade")} onRestart={startRun} onTitle={() => setScreen("title")} onEnding={() => setScreen("ending")} />;
    if (screen === "upgrade") return <UpgradeScreen save={save} onBuy={buyPermanent} onStrategy={selectStrategy} onFeverScript={selectFeverScript} onRestart={startRun} onTitle={() => setScreen("title")} />;
    if (screen === "ending") return <EndingScreen result={result} save={save} onRestart={startRun} onUpgrade={() => setScreen("upgrade")} onTitle={() => setScreen("title")} />;
    if (screen === "archive") return <ArchiveScreen save={save} onBack={() => setScreen("title")} onStart={startRun} onUpgrade={() => setScreen("upgrade")} />;
    return <TitleScreen save={save} onStart={startRun} onUpgrade={() => setScreen("upgrade")} onStrategy={selectStrategy} onFeverScript={selectFeverScript} onSettings={() => setSettingsOpen(true)} onEnding={() => setScreen("ending")} onArchive={() => setScreen("archive")} onEncoreModifier={selectEncoreModifier} />;
  }, [paused, result, save, screen, startRun, view]);

  return (
    <div className="app-root" onPointerDownCapture={(event) => {
      if (event.target.closest?.("button:not(:disabled)")) audioRef.current?.event({ type: "ui" });
    }}>
      {mainScreen}
      {settingsOpen ? (
        <SettingsModal
          save={save}
          onSettings={updateSetting}
          onImport={(next) => {
            persist(next);
            setResult(null);
            setScreen("title");
            setSettingsOpen(false);
          }}
          onReset={resetAll}
          onClose={() => setSettingsOpen(false)}
        />
      ) : null}
      {!save.profile.onboardingSeen ? (
        <OpeningModal onBegin={() => persist((current) => ({
          ...current,
          profile: { ...current.profile, onboardingSeen: true, contentNoteSeen: true },
        }))} />
      ) : null}
    </div>
  );
}
