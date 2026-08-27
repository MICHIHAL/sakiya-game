import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ACTIVITY_DEFINITIONS,
  ACTIVITY_IDS,
  BREAKPOINTS,
  BROADCAST_PLANS,
  FICTIONAL_PEOPLE,
  SCALE_PEAKS,
  UNIT_LABELS,
  activityById,
  broadcastPlanById,
  isWorkingHypothesis,
} from "./game/current-content.js";
import {
  advanceGame,
  formatMagnitude,
  getProgressSummary,
  runCommand,
} from "./game/current-engine.js";
import {
  createCurrentAudioDirector,
  mapCurrentGameEventsToAudio,
} from "./game/current-audio.js";
import {
  exportCurrentCorruptSave,
  exportCurrentSave,
  importCurrentSave,
  listCurrentCorruptSaves,
  listCurrentSaveSlots,
  loadCurrentBackup,
  loadCurrentSaveWithStatus,
  loadCurrentSaveSlot,
  previewCurrentImport,
  CURRENT_SAVE_SCHEMA,
  resetCurrentSaveWithStatus,
  restoreCurrentSaveSlotBackup,
  writeCurrentSaveSlotWithStatus,
  writeCurrentSaveWithStatus,
} from "./game/current-save.js";

const ROOM_IMAGE = "/assets/current/activity-home-8bit-coarse-v3.png";

const CURRENT_RELEASE = Object.freeze({
  version: "0.8.0-candidate.1",
  releaseType: "ローカル完成候補版",
  saveSchema: CURRENT_SAVE_SCHEMA,
});

const ROOM_UNIT_DELTAS = Object.freeze([
  {
    id: "U0",
    mark: "▤",
    title: "ひとりの記録盤",
    detail: "名前と入退室を、ひとりずつ消さずに残す。",
  },
  {
    id: "U1",
    mark: "▦",
    title: "同時の気配メーター",
    detail: "名前を人数に潰さず、留まる流れが光る。",
  },
  {
    id: "U2",
    mark: "▨",
    title: "また来た記憶の布",
    detail: "再訪と共通のことばが、机の横に縫い足される。",
  },
  {
    id: "U3",
    mark: "⌘",
    title: "作品のケーブル",
    detail: "どの作品がどこへ去ったか、部屋の端に経路が残る。",
  },
  {
    id: "U4",
    mark: "⇄",
    title: "六つの作業の交換口",
    detail: "活動同士の材料と詰まりが、道具として見える。",
  },
  {
    id: "U5",
    mark: "±",
    title: "違う反応のテープ",
    detail: "同じ届き方でも、真似・反対・共同は別の色で残る。",
  },
  {
    id: "U6",
    mark: "≡",
    title: "続く約束のボード",
    detail: "予定や決めごとが、次の活動を変える道具になる。",
  },
  {
    id: "U7",
    mark: "◒",
    title: "異なる時間の窓",
    detail: "地域と時間の違いを、一枚の数字に平らにしない。",
  },
  {
    id: "U8",
    mark: "◉",
    title: "観測条件のプリズム",
    detail: "見る側の条件で、届け方と残し方が変わる。",
  },
  {
    id: "U9",
    mark: "⋯",
    title: "遅れを含む星間線",
    detail: "異なる遅延と条件を持つ地帯を、同時だと偽らない。",
  },
  {
    id: "U10",
    mark: "※",
    title: "部屋から広がる反響",
    detail: "机と人の通り道を残したまま、意味の伝わり方が境界を越える。",
  },
]);

const REACTION_OPTIONS = ["拍手", "わかる", "そっと見守る"];
const COMMENT_OPTIONS = [
  "その話、もう少し聞きたい",
  "その場面を覚えておきたい",
  "今日はここにいる",
];

const ROOT_NAV = [
  { id: "room", label: "部屋", note: "いまの活動" },
  { id: "create", label: "つくる", note: "作品と場" },
  { id: "connections", label: "つなぐ", note: "因果を結ぶ" },
  { id: "progress", label: "積み上げ", note: "手入れと転換" },
  { id: "library", label: "記録", note: "人・履歴・分析" },
  { id: "settings", label: "この端末", note: "保存と見え方" },
];

const CREATE_ITEMS = [
  { id: "video", label: "動画", small: "場面を時間の外へ残す" },
  { id: "singing", label: "歌唱", small: "表現を確かめる" },
  { id: "music", label: "音楽", small: "断片を編む" },
  { id: "sns", label: "SNS", small: "文脈を短く送る" },
  { id: "liveEvent", label: "ライブイベント", small: "いまあるものを集める" },
];

const PROGRESS_ITEMS = [
  { id: "automation", label: "手入れ" },
  { id: "prestige", label: "引き継ぎ" },
  { id: "scale", label: "尺度" },
  { id: "goals", label: "節目" },
  { id: "completion", label: "続き" },
];

const LIBRARY_ITEMS = [
  { id: "people", label: "人" },
  { id: "archive", label: "アーカイブ" },
  { id: "analysis", label: "いまを見る" },
];

const ROOT_VIEW_IDS = new Set(ROOT_NAV.map((item) => item.id));

function parseAppRoute(hash = "") {
  let parts;
  try {
    parts = String(hash)
      .replace(/^#\/?/, "")
      .split("/")
      .map((part) => decodeURIComponent(part))
      .filter(Boolean);
  } catch {
    return { view: "room", invalid: true };
  }
  const view = ROOT_VIEW_IDS.has(parts[0]) ? parts[0] : "room";
  const route = {
    view,
    invalid: Boolean(parts[0] && view === "room" && parts[0] !== "room"),
  };
  if (view === "create" && CREATE_ITEMS.some((item) => item.id === parts[1]))
    route.createTab = parts[1];
  if (
    view === "progress" &&
    PROGRESS_ITEMS.some((item) => item.id === parts[1])
  )
    route.progressTab = parts[1];
  if (view === "library" && LIBRARY_ITEMS.some((item) => item.id === parts[1]))
    route.libraryTab = parts[1];
  return route;
}

function appRouteHash(surface) {
  const detail =
    surface.view === "create"
      ? surface.createTab
      : surface.view === "progress"
        ? surface.progressTab
        : surface.view === "library"
          ? surface.libraryTab
          : null;
  return `#${surface.view}${detail ? `/${detail}` : ""}`;
}

function requestUpdateMetadata(worker, timeoutMs = 1200) {
  return new Promise((resolve) => {
    if (!worker || typeof MessageChannel === "undefined") {
      resolve(null);
      return;
    }
    const channel = new MessageChannel();
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      channel.port1.close();
      resolve(value);
    };
    const timer = setTimeout(() => finish(null), timeoutMs);
    channel.port1.onmessage = (event) => {
      const payload = event.data;
      finish(payload?.type === "UPDATE_METADATA" ? payload.metadata : null);
    };
    try {
      worker.postMessage({ type: "GET_UPDATE_METADATA" }, [channel.port2]);
    } catch {
      finish(null);
    }
  });
}

const AUTOMATION_COPY = {
  clip: {
    label: "クリップの手入れ",
    proof: "動画を一本残す",
    effect: "理解した動画の手入れだけを、留守中にも進められる。",
  },
  archive: {
    label: "アーカイブの手入れ",
    proof: "場面を残し、配信を二回ひらく",
    effect: "分かった記録整理を圧縮して、次の共同判断へ戻れる。",
  },
  snsSchedule: {
    label: "SNS の予定",
    proof: "SNS を一度、文脈つきで送る",
    effect: "理解した短い発信を、人物の出来事と混ぜずに扱える。",
  },
};

const BLOCKED_COPY = {
  "profile-required": "先に、この端末だけの参加方法を選んでね。",
  "broadcast-already-active": "いまの配信を閉じてから、次の枠を始めよう。",
  "before-required": "配信前に、今日話したいことを選ぼう。",
  "live-required": "LIVE のあいだに選べることだよ。",
  "live-participation-limit":
    "言葉やリアクションは、この枠では二回まで残せるよ。",
  "after-preservation-required": "配信を終えたら、残す場面をひとつ選ぼう。",
  "moment-already-preserved": "この枠の場面は、もう残してあるよ。",
  "video-one-per-broadcast-cycle": "同じ枠からは、まず一本だけ形にしよう。",
  "singing-focus-already-used":
    "この枠では、ひとつの表現に集中した。次の枠で確かめよう。",
  "music-one-draft-per-broadcast-cycle":
    "同じ枠では、曲の断片を一本だけ編める。",
  "sns-window-closed": "この枠の文脈は、もう一度に絞って送った。",
  "live-event-commitment-already-used":
    "この枠では、ひとつの場だけを約束できる。",
  "material-required": "先に、配信から残したい場面をひとつ作ろう。",
  "vocal-and-material-required": "歌の手がかりと、残した場面のどちらかが必要。",
  "eligible-context-required":
    "動画・曲・場面のどれかを、先に文脈として残そう。",
  "cross-activity-input-required": "動画か曲を、先にこの場へ持ち込もう。",
  "automation-not-understood":
    "手入れを任せる前に、一度は自分で意味を確かめよう。",
  "automation-already-enabled": "この手入れは、もう有効になっている。",
  "bridge-already-exists": "そのつながりは、すでに部屋の記録にある。",
  "typed-activities-required": "異なる二つの活動を選ぼう。",
  "breakpoint-three-required": "引き継ぎは、三つ目の節目を記録してから選べる。",
  "finish-broadcast-before-prestige":
    "配信の最中には、引き継ぎを始められない。",
  "breakpoint-requirement-not-met":
    "この尺度へ移る理由になる節目が、まだ足りない。",
  "scale-unit-mismatch": "いまの尺度から続く転換だけを記録できる。",
  "scale-deferred-in-p0": "この候補では、P0 中に尺度転換は記録しない。",
  "full-journey-required":
    "すべての尺度候補を、意味つきで通ってから続きの候補が現れる。",
  "completion-candidate-required": "続きは、完成候補を記録してから選べる。",
};

function newest(items, predicate = () => true) {
  return [...(items ?? [])].reverse().find(predicate) ?? null;
}

function formatTime(timestamp) {
  const number = Number(timestamp);
  if (!Number.isFinite(number) || number <= 0) return "いま";
  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(number));
}

function formatDuration(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function formatExact(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric)
    ? numeric.toLocaleString("ja-JP", { maximumFractionDigits: 2 })
    : "0";
}

function persistenceStatus(result, success) {
  if (result?.persisted && result?.recoverySafe !== false) return success;
  if (result?.blockedByCorruptPrimary)
    return "破損した主保存を隔離できないため、上書きを停止。JSON を保存してから復旧してね。";
  if (result?.blockedByBackupFailure)
    return "安全バックアップを作れなかったため、現在の保存は上書きしていない。空き容量を確認するか JSON を保存してね。";
  return "端末への保存に失敗。この起動中の状態は表示中だけど、閉じると消える可能性がある。JSON を保存してね。";
}

function activityLabel(id) {
  return ACTIVITY_DEFINITIONS[id]?.label ?? id;
}

function workTypeLabel(type) {
  return (
    {
      material: "残した場面",
      video: "動画",
      take: "歌の手がかり",
      music: "曲の断片",
      "event-record": "ライブの記録",
    }[type] ?? "記録"
  );
}

function eventText(event) {
  switch (event?.type) {
    case "profile-ready":
      return "この端末で活動を始めた。";
    case "profile-skipped":
      return "名前を残さず、この端末で活動を始めた。";
    case "broadcast-before":
      return "次の配信で話すことを選んだ。";
    case "broadcast-live":
      return "配信がはじまった。";
    case "silent-presence":
      return "静かにその場にいた。";
    case "broadcast-reaction":
      return `「${event.reaction ?? "拍手"}」という反応が残った。`;
    case "broadcast-comment":
      return `「${event.comment ?? "その話もっと聞きたい"}」と伝えた。`;
    case "broadcast-after":
      return "配信を閉じて、残す場面を選べるようになった。";
    case "material-preserved":
      return "配信の場面を残した。";
    case "video-created":
      return "残した場面を動画にして、次の枠へつなげた。";
    case "video-context-returned":
      return "動画の向こうの話が、次の枠へ戻ってきた。";
    case "singing-practiced":
      return "歌の表現を確かめ、手がかりを残した。";
    case "music-arranged":
      return "断片を曲のかたちへ編んだ。";
    case "sns-posted":
      return "選んだ文脈だけを短く送った。";
    case "live-event-hosted":
      return "いまあるものを集めて、ひとつの場をひらいた。";
    case "activity-bridge-created":
      return `${activityLabel(event.from)}から${activityLabel(event.to)}へのつながりを残した。`;
    case "automation-enabled":
      return "理解した手入れを任せられるようになった。";
    case "prestige-complete":
      return "積み上げを意味として引き継いだ。";
    case "semantic-retirement":
      return `${UNIT_LABELS[event.retiredUnit] ?? event.retiredUnit}を履歴として残し、リアルタイム生成を終えた。`;
    case "scale-peak-candidate":
      return `尺度候補「${event.id ?? ""}」を記録した。`;
    case "completion-candidate-ready":
      return "続きの候補を記録できるところまで来た。";
    case "completion-candidate-recorded":
      return "完成候補を記録した。これは公開や最終承認ではない。";
    case "journey-continued":
      return "これまでの証拠を残して、部屋で活動を続ける。";
    case "strong-new-game-started":
      return "人・作品・履歴を残したまま、新しい旅を始めた。";
    case "external-fictional-arrival":
      return `誰か来た。${event.displayName ?? "フィクションの参加者"}が静かにいる。`;
    case "fictional-person-revisit":
      return `${event.displayName ?? "いつもの人"}が、また来てくれた。`;
    case "fictional-person-away":
      return `${event.displayName ?? "フィクションの参加者"}は、また会える距離へ移った。`;
    case "fictional-person-returned":
      return "また会える距離から、部屋へ戻った。";
    case "entry-chime":
      return "入室音を、この活動の最初の記録として残した。";
    case "offline-summary":
      return "留守中に届いた変化を、人物の出来事と混ぜずに記録した。";
    case "breakpoint-reached":
      return `節目「${event.id ?? ""}」を、履歴に残した。`;
    case "settings-updated":
      return "この端末での見え方を更新した。";
    case "command-blocked":
      return BLOCKED_COPY[event.reason] ?? "いまは、その選択を進められない。";
    default:
      return "部屋に新しい記録が残った。";
  }
}

function eventMark(event) {
  if (event?.type === "external-fictional-arrival") return "✦";
  if (event?.type === "entry-chime") return "♪";
  if (
    ["material-preserved", "video-created", "music-arranged"].includes(
      event?.type,
    )
  )
    return "▣";
  if (
    ["activity-bridge-created", "video-context-returned"].includes(event?.type)
  )
    return "⌁";
  if (event?.type === "breakpoint-reached") return "◇";
  if (["scale-peak-candidate", "semantic-retirement"].includes(event?.type))
    return "⇢";
  if (event?.type === "prestige-complete") return "↧";
  if (event?.type === "offline-summary") return "◷";
  return "·";
}

function currentIntent(state) {
  const latestMaterial = newest(
    state.works,
    (work) => work.type === "material",
  );
  const returningVideo = newest(
    state.works,
    (work) => work.type === "video" && !work.returnObserved,
  );
  if (returningVideo)
    return {
      eyebrow: "次の配信に返ってくるもの",
      title: "動画の向こうから来た話を受け取る",
      detail: "前に残した場面が、次の枠の会話へ戻る準備ができている。",
      action: "broadcast",
      planId: "video-return",
      actionLabel: "次の枠を準備する",
    };
  if (
    latestMaterial &&
    state.activities.video.unlocked &&
    !newest(state.works, (work) => work.type === "video")
  )
    return {
      eyebrow: "残した場面から",
      title: "部屋の外へ届く形にする",
      detail: "配信で残した場面を、次の配信にも返ってくる動画へつなげられる。",
      action: "video",
      actionLabel: "動画にして送り出す",
    };
  if (latestMaterial)
    return {
      eyebrow: "部屋に残ったもの",
      title: "残した場面の続きを話す",
      detail: "前の枠で選んだ場面を、今夜の会話の手がかりにできる。",
      action: "broadcast",
      planId: "material-return",
      actionLabel: "次の枠を準備する",
    };
  return {
    eyebrow: "いまの意図",
    title: "部屋で近況をほどく",
    detail: "まずは、さきやが今話したいことから枠を始める。",
    action: "broadcast",
    planId: "room-talk",
    actionLabel: "配信の前を整える",
  };
}

function StateChip({ kind = "ready", children }) {
  const label =
    {
      ready: "READY",
      locked: "LOCKED",
      empty: "EMPTY",
      offline: "OFFLINE",
      error: "ERROR",
      pending: "PENDING",
      receipt: "RECEIPT",
      candidate: "CANDIDATE",
    }[kind] ?? kind.toUpperCase();
  return (
    <span className={`state-chip state-chip--${kind}`}>
      <b aria-hidden="true">
        {kind === "ready"
          ? "●"
          : kind === "locked"
            ? "×"
            : kind === "receipt"
              ? "▤"
              : "!"}
      </b>
      {children ?? label}
    </span>
  );
}

function PixelPage({ eyebrow, title, detail, onRoom, children }) {
  return (
    <section className="pixel-page" aria-labelledby="pixel-page-title">
      <header className="pixel-page__head">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="pixel-page-title" data-route-focus tabIndex={-1}>
            {title}
          </h1>
          {detail && <p>{detail}</p>}
        </div>
        <button
          type="button"
          className="pixel-button pixel-button--quiet"
          onClick={() => onRoom()}
        >
          部屋へ戻る
        </button>
      </header>
      {children}
    </section>
  );
}

function RootNavigation({ active, phase, onNavigate }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const morePanelRef = useRef(null);
  const moreToggleRef = useRef(null);
  const lockedByLive = phase === "broadcast-live";
  const primaryItems = ROOT_NAV.slice(0, 4);
  const overflowItems = ROOT_NAV.slice(4);
  useEffect(() => {
    if (!moreOpen) return undefined;
    const frame = window.requestAnimationFrame(() => {
      morePanelRef.current?.querySelector("button")?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [moreOpen]);
  const itemButton = (item, overflow = false) => {
    const asksBeforeLeaving = lockedByLive && item.id !== "room";
    return (
      <button
        type="button"
        key={item.id}
        data-nav-view={item.id}
        className={`root-navigation__item${overflow ? " root-navigation__item--overflow" : ""}${active === item.id ? " is-current" : ""}`}
        aria-current={active === item.id ? "page" : undefined}
        onClick={() => {
          setMoreOpen(false);
          onNavigate(item.id);
        }}
      >
        <strong>{item.label}</strong>
        <small>{asksBeforeLeaving ? "LIVEの保持方法を確認" : item.note}</small>
      </button>
    );
  };
  return (
    <nav
      className={`root-navigation${moreOpen ? " is-more-open" : ""}`}
      aria-label="活動の場所"
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !moreOpen) return;
        event.preventDefault();
        event.stopPropagation();
        setMoreOpen(false);
        window.requestAnimationFrame(() => moreToggleRef.current?.focus());
      }}
    >
      {primaryItems.map((item) => itemButton(item))}
      <div
        className="root-navigation__overflow"
        id="root-navigation-more"
        aria-label="その他の場所"
        ref={morePanelRef}
      >
        {overflowItems.map((item) => itemButton(item, true))}
      </div>
      <button
        type="button"
        className={`root-navigation__item root-navigation__more-toggle${overflowItems.some((item) => item.id === active) ? " is-current" : ""}`}
        ref={moreToggleRef}
        aria-expanded={moreOpen}
        aria-controls="root-navigation-more"
        aria-current={
          overflowItems.some((item) => item.id === active) ? "page" : undefined
        }
        onClick={() => setMoreOpen((current) => !current)}
      >
        <strong>その他</strong>
        <small>{moreOpen ? "閉じる" : "記録・保存"}</small>
      </button>
    </nav>
  );
}

function LiveLeaveSafeguard({ intent, onResume, onPauseAndOpen, onSummarize }) {
  const target = ROOT_NAV.find((item) => item.id === intent?.view);
  return (
    <section
      className="room-panel phase-panel pixel-frame"
      aria-labelledby="live-leave-heading"
    >
      <p className="eyebrow">LIVE SAFEGUARD</p>
      <h2 id="live-leave-heading" data-pending-focus tabIndex={-1}>
        LIVE を、どう保って移動する？
      </h2>
      <p>
        {target?.label ?? "別の場所"}
        を開いても、今の参加や順番は捨てない。要約へ進むときだけ配信を閉じる。
      </p>
      <div className="button-stack">
        <button
          type="button"
          className="pixel-button pixel-button--primary"
          onClick={onResume}
        >
          LIVE に戻る
        </button>
        <button
          type="button"
          className="pixel-button pixel-button--quiet"
          onClick={onPauseAndOpen}
        >
          LIVE を一時停止して{target?.label ?? "別の場所"}を開く
        </button>
        <button
          type="button"
          className="pixel-button pixel-button--gold"
          onClick={onSummarize}
        >
          配信を閉じて、場面の要約へ
        </button>
      </div>
    </section>
  );
}

function ActivityHeader({ state, summary, onUpdateSettings }) {
  const [toolsOpen, setToolsOpen] = useState(false);
  return (
    <header className="room-header">
      <div className="room-header__title">
        <p className="eyebrow">8-BIT ACTIVITY ROOM</p>
        <h1>活動のはじまる場所</h1>
        <p id="visual-candidate-note" className="candidate-note">
          八乙女さきや（成人男性）と豚のぶー子の8-bit候補ビジュアル表示中。最終の肖像・採用判断ではありません。
        </p>
      </div>
      <div className="room-header__right">
        <dl className="quiet-metric" aria-label="現在の尺度">
          <dt>いまの尺度</dt>
          <dd>{summary.currentUnitLabel}</dd>
        </dl>
        <details
          className="access-tools"
          open={toolsOpen}
          onToggle={(event) => setToolsOpen(event.currentTarget.open)}
        >
          <summary>表示と音</summary>
          <div className="access-tools__body">
            <button
              type="button"
              className="pixel-button pixel-button--small"
              aria-pressed={state.settings.sound}
              onClick={() => onUpdateSettings({ sound: !state.settings.sound })}
            >
              音 {state.settings.sound ? "ON" : "OFF"}
            </button>
            <button
              type="button"
              className="pixel-button pixel-button--small"
              aria-pressed={state.settings.reducedMotion}
              onClick={() =>
                onUpdateSettings({
                  reducedMotion: !state.settings.reducedMotion,
                })
              }
            >
              動き {state.settings.reducedMotion ? "固定" : "ぴこぴこ"}
            </button>
            <button
              type="button"
              className="pixel-button pixel-button--small"
              aria-pressed={state.settings.highContrast}
              onClick={() =>
                onUpdateSettings({ highContrast: !state.settings.highContrast })
              }
            >
              見やすさ {state.settings.highContrast ? "強" : "標準"}
            </button>
            <button
              type="button"
              className="pixel-button pixel-button--small"
              onClick={() =>
                onUpdateSettings({
                  fontScale:
                    state.settings.fontScale >= 1.2
                      ? 1
                      : state.settings.fontScale === 1
                        ? 1.1
                        : 1.2,
                })
              }
            >
              文字 {state.settings.fontScale >= 1.2 ? "標準" : "大きく"}
            </button>
          </div>
        </details>
      </div>
    </header>
  );
}

function StartupRecoveryGate({
  load,
  state,
  surface,
  setSurface,
  corruptSaves,
  onConfirm,
  onDownloadCorrupt,
  onReset,
  onBeginFresh,
}) {
  const usingBackup = load.source === "backup";
  return (
    <section
      className="launch-gate pixel-frame"
      aria-labelledby="recovery-heading"
    >
      <p className="eyebrow">RECOVERY REQUIRED</p>
      <h2 id="recovery-heading" data-entry-focus tabIndex={-1}>
        主保存をそのまま上書きせず、復旧を選ぶ
      </h2>
      <p role="alert">
        主保存の JSON が壊れていた。
        {load.corruptPreserved
          ? "破損した原文は別枠に隔離し、自動上書きを停めている。"
          : "破損した原文を端末に隔離できないため、保存を停止している。"}
      </p>
      {usingBackup ? (
        <div className="workspace-readout">
          <span>読み込めるバックアップ</span>
          <strong>
            旅 {state.progression.journeyNumber} · BP{" "}
            {state.receipts.breakpoints.length} · SP{" "}
            {state.receipts.scalePeaks.length}
          </strong>
          <small>確認後にだけ主保存へ復旧する。</small>
        </div>
      ) : (
        <p>
          使えるバックアップはない。隔離原文を残したまま、新規開始はできる。
        </p>
      )}
      <div className="launch-actions">
        {corruptSaves.map((entry) => (
          <button
            type="button"
            className="pixel-button pixel-button--quiet"
            key={entry.index}
            onClick={() => onDownloadCorrupt(entry.index)}
          >
            破損原文 {entry.index + 1} を JSON で保存
          </button>
        ))}
        {usingBackup && load.corruptPreserved && (
          <button
            type="button"
            className="pixel-button pixel-button--primary"
            onClick={onConfirm}
          >
            このバックアップを主保存へ復旧
          </button>
        )}
        {!usingBackup && load.corruptPreserved && (
          <button
            type="button"
            className="pixel-button pixel-button--primary"
            onClick={onBeginFresh}
          >
            隔離原文を残して新しく始める
          </button>
        )}
        {!load.corruptPreserved &&
          (surface.save.resetArmed ? (
            <>
              <p>
                最後の手段。主保存・バックアップ・全スロット・破損原文を消し、復元できなくなる。
              </p>
              <button
                type="button"
                className="pixel-button pixel-button--danger"
                onClick={onReset}
              >
                すべて消して新しく始める
              </button>
              <button
                type="button"
                className="pixel-button pixel-button--quiet"
                onClick={() =>
                  setSurface((current) => ({
                    ...current,
                    save: { ...current.save, resetArmed: false },
                  }))
                }
              >
                やめる
              </button>
            </>
          ) : (
            <button
              type="button"
              className="pixel-button pixel-button--danger"
              onClick={() =>
                setSurface((current) => ({
                  ...current,
                  save: { ...current.save, resetArmed: true },
                }))
              }
            >
              全保存を消す前に確認
            </button>
          ))}
      </div>
    </section>
  );
}

function LaunchGate({
  state,
  profileName,
  setProfileName,
  onCreateProfile,
  onSkipProfile,
  onContinue,
}) {
  const hasSavedJourney = state.profile.status === "ready";
  return (
    <section
      className="room-panel launch-gate pixel-frame"
      aria-labelledby="launch-heading"
    >
      <p className="eyebrow">LOCAL SAVE / NO ACCOUNT</p>
      <h2 id="launch-heading" data-entry-focus tabIndex={-1}>
        {hasSavedJourney ? "部屋に戻る" : "この部屋から、始める"}
      </h2>
      {hasSavedJourney ? (
        <>
          <p>前に残した人・場面・履歴は、この端末に保存されています。</p>
          <button
            type="button"
            className="pixel-button pixel-button--primary"
            onClick={onContinue}
          >
            続きから部屋へ
          </button>
        </>
      ) : (
        <>
          <p>名前は任意。この端末の中だけに残ります。</p>
          <label className="text-field" htmlFor="local-profile-name">
            <span>呼ばれたい名前（任意）</span>
            <input
              id="local-profile-name"
              value={profileName}
              maxLength={48}
              autoComplete="off"
              onChange={(event) => setProfileName(event.target.value)}
              placeholder="書かなくても始められる"
            />
          </label>
          <div className="button-stack">
            <button
              type="button"
              className="pixel-button pixel-button--primary"
              onClick={() => onCreateProfile(profileName)}
            >
              この名前で始める
            </button>
            <button
              type="button"
              className="pixel-button pixel-button--quiet"
              onClick={onSkipProfile}
            >
              名前を残さず始める
            </button>
          </div>
        </>
      )}
    </section>
  );
}

function BeforeChoices({ state, preferredPlanId, onChoosePlan, onCancel }) {
  return (
    <section
      className="room-panel phase-panel pixel-frame"
      aria-labelledby="before-heading"
    >
      <p className="eyebrow">配信前</p>
      <h2 id="before-heading" data-route-focus tabIndex={-1}>
        今夜、何から話す？
      </h2>
      <p>選んだ話題が、LIVE の空気と次に残す場面の入口になる。</p>
      <div className="plan-choices" role="group" aria-label="配信で話すこと">
        {BROADCAST_PLANS.map((plan) => {
          const needsMaterial = plan.id === "material-return";
          const available =
            (!plan.requires?.workType ||
              state.works.some(
                (work) => work.type === plan.requires.workType,
              )) &&
            (!needsMaterial ||
              state.works.some((work) => work.type === "material"));
          return (
            <button
              type="button"
              key={plan.id}
              className={`plan-choice${plan.id === preferredPlanId ? " plan-choice--suggested" : ""}`}
              disabled={!available}
              onClick={() => onChoosePlan(plan.id)}
            >
              <span>{plan.label}</span>
              <small>
                {available
                  ? plan.sakiyaIntent
                  : plan.id === "material-return"
                    ? "先に配信から場面を残すと選べる"
                    : "先に動画を残すと選べる"}
              </small>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="pixel-button pixel-button--quiet"
        onClick={onCancel}
      >
        いったん部屋へ戻る
      </button>
    </section>
  );
}

function BroadcastBefore({ state, onStartLive }) {
  const plan = broadcastPlanById(state.phase.planId);
  return (
    <section
      className="room-panel phase-panel pixel-frame"
      aria-labelledby="before-confirm-heading"
    >
      <p className="eyebrow">配信前 · 選んだこと</p>
      <h2 id="before-confirm-heading" data-route-focus tabIndex={-1}>
        {plan.label}
      </h2>
      <blockquote>{plan.sakiyaIntent}</blockquote>
      <p className="participation-copy">
        あなたは、{plan.participantContribution}
      </p>
      <button
        type="button"
        className="pixel-button pixel-button--primary"
        onClick={onStartLive}
      >
        LIVE を始める
      </button>
    </section>
  );
}

function ArrivalCue({ event, person, cue }) {
  if (!event) return null;
  return (
    <aside
      className="arrival-cue"
      aria-label="最初のフィクションの参加者が来た記録"
    >
      <span className="arrival-cue__burst" aria-hidden="true">
        ✦
      </span>
      <div>
        <p>誰か来た。</p>
        <strong>
          {person?.displayName ?? event.displayName ?? "フィクションの参加者"}
        </strong>
        <small>
          {cue?.eventId === event.id ? `${cue.caption} · ` : ""}
          フィクションの参加者 · 入室音と一緒に履歴へ記録
        </small>
      </div>
    </aside>
  );
}

function BroadcastLive({ state, surface, setSurface, onCommand }) {
  const latestLive = newest(
    state.history,
    (event) =>
      event.type === "broadcast-live" && event.broadcastId === state.phase.id,
  );
  const arrival = newest(
    state.history,
    (event) => event.type === "external-fictional-arrival",
  );
  const arrivalInThisLive =
    arrival && latestLive && arrival.at === latestLive.at ? arrival : null;
  const person = state.people.known.find(
    (entry) => entry.id === arrival?.personId,
  );
  const plan = broadcastPlanById(state.phase.planId);
  const elapsed = Math.max(
    0,
    state.clock.now - (latestLive?.at ?? state.clock.now),
  );
  const canParticipate = state.phase.liveActions < 2;
  const comments =
    surface.commentDensity === "compact"
      ? COMMENT_OPTIONS.slice(0, 2)
      : COMMENT_OPTIONS;
  return (
    <section
      className="room-panel phase-panel live-panel pixel-frame"
      aria-labelledby="live-heading"
    >
      <div className="live-panel__heading">
        <div>
          <p className="eyebrow">LIVE</p>
          <h2 id="live-heading" data-route-focus tabIndex={-1}>
            {plan.label}
          </h2>
        </div>
        <output
          className="live-clock"
          aria-label={`配信経過 ${formatDuration(elapsed)}`}
        >
          {formatDuration(elapsed)}
        </output>
      </div>
      <p className="live-intent">{plan.sakiyaIntent}</p>
      <ArrivalCue event={arrivalInThisLive} person={person} cue={surface.cue} />
      <div className="live-controls">
        <div className="control-row" role="group" aria-label="配信の時間">
          <button
            type="button"
            className="pixel-button"
            aria-pressed={surface.paused}
            onClick={() =>
              setSurface((current) => ({ ...current, paused: !current.paused }))
            }
          >
            {surface.paused ? "再開" : "一時停止"}
          </button>
          <button
            type="button"
            className="pixel-button"
            aria-pressed={surface.speed === 1}
            onClick={() => setSurface((current) => ({ ...current, speed: 1 }))}
          >
            ×1
          </button>
          <button
            type="button"
            className="pixel-button"
            aria-pressed={surface.speed === 2}
            onClick={() => setSurface((current) => ({ ...current, speed: 2 }))}
          >
            ×2
          </button>
        </div>
        <div className="presence-actions">
          <button
            type="button"
            className="pixel-button pixel-button--mint"
            onClick={() => onCommand({ type: "SILENT_PRESENCE" })}
          >
            静かにいる
          </button>
          <span>
            言葉・反応はあと {Math.max(0, 2 - state.phase.liveActions)} 回
          </span>
        </div>
        <div className="participation-actions" aria-label="この枠に残す反応">
          <div>
            <p>短い反応</p>
            {REACTION_OPTIONS.map((reaction) => (
              <button
                type="button"
                key={reaction}
                disabled={!canParticipate}
                onClick={() => onCommand({ type: "REACT", reaction })}
              >
                {reaction}
              </button>
            ))}
          </div>
          <div>
            <p>短い言葉</p>
            <label className="comment-choice" htmlFor="comment-choice">
              <span className="sr-only">残す言葉</span>
              <select
                id="comment-choice"
                value={surface.comment}
                disabled={!canParticipate}
                onChange={(event) =>
                  setSurface((current) => ({
                    ...current,
                    comment: event.target.value,
                  }))
                }
              >
                {comments.map((comment) => (
                  <option key={comment} value={comment}>
                    {comment}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!canParticipate}
                onClick={() =>
                  onCommand({ type: "COMMENT", comment: surface.comment })
                }
              >
                残す
              </button>
            </label>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="pixel-button pixel-button--primary"
        onClick={() => onCommand({ type: "BROADCAST_AFTER" })}
      >
        配信を閉じて、場面を選ぶ
      </button>
    </section>
  );
}

function BroadcastAfter({ state, surface, setSurface, onPreserve }) {
  const plan = broadcastPlanById(state.phase.planId);
  return (
    <section
      className="room-panel phase-panel pixel-frame"
      aria-labelledby="after-heading"
    >
      <p className="eyebrow">配信のあと</p>
      <h2 id="after-heading" data-route-focus tabIndex={-1}>
        今日の場面を、ひとつだけ残す
      </h2>
      <p>
        「{plan.label}」の空気は、次の活動の材料になる。数字だけにはしない。
      </p>
      <label className="text-field" htmlFor="preserved-moment-title">
        <span>残す場面の名前</span>
        <input
          id="preserved-moment-title"
          value={surface.materialTitle}
          maxLength={80}
          onChange={(event) =>
            setSurface((current) => ({
              ...current,
              materialTitle: event.target.value,
            }))
          }
        />
      </label>
      <button
        type="button"
        className="pixel-button pixel-button--primary"
        onClick={() => onPreserve(surface.materialTitle)}
      >
        この場面を残す
      </button>
    </section>
  );
}

function ActivityHome({
  state,
  intent,
  roomView,
  onRoomView,
  onPrepare,
  onCreateVideo,
  onNavigate,
}) {
  const material = newest(state.works, (work) => work.type === "material");
  const video = newest(state.works, (work) => work.type === "video");
  const unitIndex = Math.max(
    0,
    ROOM_UNIT_DELTAS.findIndex(
      (delta) => delta.id === state.progression.currentUnit,
    ),
  );
  const delta = ROOM_UNIT_DELTAS[unitIndex];
  return (
    <section
      className="room-panel phase-panel home-panel pixel-frame"
      aria-labelledby="intent-heading"
    >
      <p className="eyebrow">{intent.eyebrow}</p>
      <h2 id="intent-heading" data-route-focus tabIndex={-1}>
        {intent.title}
      </h2>
      <p>{intent.detail}</p>
      <details className="room-delta-ledger">
        <summary>
          <span>{delta.id}</span>
          <strong>{delta.title}</strong>
        </summary>
        <p>{delta.detail}</p>
        <small>
          {roomView === "day-one"
            ? "DAY 1 の部屋。現在の操作と履歴はそのまま。"
            : `${unitIndex + 1} 枚の部屋変化を重ねて表示中。`}
        </small>
        {unitIndex >= 2 && (
          <button
            type="button"
            className="pixel-button pixel-button--small pixel-button--quiet"
            onClick={() =>
              onRoomView(roomView === "day-one" ? "current" : "day-one")
            }
          >
            {roomView === "day-one" ? "いまの部屋へ" : "DAY 1 の部屋を見る"}
          </button>
        )}
      </details>
      {intent.action === "video" ? (
        <button
          type="button"
          className="pixel-button pixel-button--primary"
          onClick={onCreateVideo}
        >
          {intent.actionLabel}
        </button>
      ) : (
        <button
          type="button"
          className="pixel-button pixel-button--primary"
          onClick={() => onPrepare(intent.planId)}
        >
          {intent.actionLabel}
        </button>
      )}
      {material && (
        <div className="causal-thread" aria-label="活動のつながり">
          <p>残した場面</p>
          <strong>{material.title}</strong>
          <small>
            {video
              ? "動画になり、次の配信へ返る。"
              : "動画にして、次の配信へ返せる。"}
          </small>
        </div>
      )}
      <button
        type="button"
        className="pixel-button pixel-button--quiet room-more-button"
        onClick={() => onNavigate("create")}
      >
        他の活動を見る
      </button>
    </section>
  );
}

function RoomUnitArtifacts({ unitId, dayOne }) {
  const unitIndex = Math.max(
    0,
    ROOM_UNIT_DELTAS.findIndex((delta) => delta.id === unitId),
  );
  return (
    <div
      className={`room-unit-artifacts${dayOne ? " is-day-one" : ""}`}
      data-current-unit={unitId}
      aria-hidden="true"
    >
      {ROOM_UNIT_DELTAS.slice(0, unitIndex + 1).map((delta, index) => (
        <span
          className={`room-unit-artifact room-unit-artifact--${delta.id.toLowerCase()}`}
          key={delta.id}
          style={{ "--delta-order": index }}
        >
          {delta.mark}
        </span>
      ))}
    </div>
  );
}

function DurableEvidence({ state, summary, onPeople, onArchive }) {
  const events = [...state.history].slice(-5).reverse();
  const works = [...state.works].slice(-3).reverse();
  const firstPerson =
    state.people.known.find(
      (person) => person.id === state.people.firstExternalArrivalId,
    ) ?? state.people.known[0];
  return (
    <div className="durable-evidence">
      <section
        className="evidence-panel evidence-panel--history pixel-frame"
        aria-labelledby="history-heading"
      >
        <div className="panel-heading">
          <div>
            <p className="eyebrow">保存済み</p>
            <h2 id="history-heading">部屋に残ったこと</h2>
          </div>
          <span>{state.history.length} 件</span>
        </div>
        {events.length ? (
          <ol className="event-feed">
            {events.map((event) => (
              <li key={event.id}>
                <span className="event-mark" aria-hidden="true">
                  {eventMark(event)}
                </span>
                <div>
                  <p>{eventText(event)}</p>
                  <time
                    dateTime={new Date(Number(event.at) || 0).toISOString()}
                  >
                    {formatTime(event.at)}
                  </time>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="empty-copy">
            最初の配信が終わると、ここに場面と出会いが残る。
          </p>
        )}
        <button
          type="button"
          className="pixel-button pixel-button--quiet"
          onClick={onArchive}
        >
          すべての記録を見る
        </button>
      </section>
      <section
        className="evidence-panel evidence-panel--people pixel-frame"
        aria-labelledby="presence-heading"
      >
        <p className="eyebrow">いまの気配</p>
        <h2 id="presence-heading">
          {firstPerson
            ? `${firstPerson.displayName}が${firstPerson.status === "away" ? "離れている" : "いる"}`
            : "まだ、誰も来ていない"}
        </h2>
        <p>
          {firstPerson
            ? "フィクションの参加者。レア度や生産力ではなく、来た記録を残す。"
            : "配信を始めると、最初のフィクションの参加者が来ることがある。"}
        </p>
        <dl className="subtle-stats">
          <div>
            <dt>残した場面</dt>
            <dd>{state.resources.materials}</dd>
          </div>
          <div>
            <dt>次の節目</dt>
            <dd>{summary.breakpoints.next?.label ?? "すべて記録済み"}</dd>
          </div>
        </dl>
        <button
          type="button"
          className="pixel-button pixel-button--quiet"
          onClick={onPeople}
        >
          人の記録を見る
        </button>
      </section>
      <section
        className="evidence-panel evidence-panel--works pixel-frame"
        aria-labelledby="works-heading"
      >
        <p className="eyebrow">残したもの</p>
        <h2 id="works-heading">次に持ち込める手がかり</h2>
        {works.length ? (
          <ul className="work-list">
            {works.map((work) => (
              <li key={work.id}>
                <span>{workTypeLabel(work.type)}</span>
                <strong>{work.title}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-copy">配信のあとで選んだ場面が、ここに残る。</p>
        )}
        {state.resources.videoReach > 0 && (
          <p className="quiet-reach">
            動画からの届き:{" "}
            {formatMagnitude(
              state.resources.videoReach,
              state.settings.numberNotation,
            )}
          </p>
        )}
      </section>
    </div>
  );
}

function LockedState({ title = "まだ開いていない", reason, next }) {
  return (
    <div className="locked-state pixel-frame">
      <StateChip kind="locked" /> <h3>{title}</h3>
      <p>{reason}</p>
      {next && (
        <p className="next-action">
          <b>次にすること:</b> {next}
        </p>
      )}
    </div>
  );
}

function CreateScreen({
  state,
  surface,
  setSurface,
  onCommand,
  onRoom,
  onRoute,
}) {
  const selected = surface.createTab;
  const draft = surface.drafts;
  const setDraft = (key, value) =>
    setSurface((current) => ({
      ...current,
      drafts: { ...current.drafts, [key]: value },
    }));
  return (
    <PixelPage
      eyebrow="CREATE"
      title="つくる"
      detail="活動ごとに違う手つきで、部屋の外へ残していく。"
      onRoom={onRoom}
    >
      <nav className="workspace-tabs" aria-label="活動を選ぶ">
        {CREATE_ITEMS.map((item) => (
          <button
            type="button"
            key={item.id}
            className={selected === item.id ? "is-current" : ""}
            aria-current={selected === item.id ? "page" : undefined}
            onClick={() => {
              if (selected !== item.id)
                onRoute("create", { route: { createTab: item.id } });
            }}
          >
            <b>{item.label}</b>
            <small>{item.small}</small>
          </button>
        ))}
      </nav>
      <ActivityWorkspace
        id={selected}
        state={state}
        draft={draft}
        setDraft={setDraft}
        onCommand={onCommand}
      />
    </PixelPage>
  );
}

function ActivityWorkspace({ id, state, draft, setDraft, onCommand }) {
  const activity = state.activities[id];
  const locked = !activity?.unlocked;
  const sourceMaterial = newest(
    state.works,
    (work) => work.type === "material",
  );
  const sourceTake = newest(state.works, (work) => work.type === "take");
  const sourceVideo = newest(state.works, (work) => work.type === "video");
  const sourceMusic = newest(state.works, (work) => work.type === "music");
  const sourceWork = newest(state.works, (work) =>
    ["video", "music", "material"].includes(work.type),
  );
  const limiterUsed = activity?.lastCycle === state.meta.broadcastSerial;

  if (id === "video")
    return (
      <section className="activity-workspace activity-workspace--video pixel-frame">
        <p className="eyebrow">VIDEO · 素材を形にする</p>
        <h2>場面を、時間の外へ届ける</h2>
        <p>残した配信の場面から一本だけ作り、次の配信へ文脈を返す。</p>
        {locked || !sourceMaterial ? (
          <LockedState
            reason={
              locked
                ? "動画は、配信から場面を残した後に開く。"
                : "動画にする場面がまだない。"
            }
            next="部屋で配信を閉じ、場面をひとつ残す"
          />
        ) : (
          <>
            <div className="workspace-readout">
              <span>入力</span>
              <strong>{sourceMaterial.title}</strong>
              <small>出力: 動画 / 枠ごとに一本</small>
            </div>
            <label className="text-field" htmlFor="video-title">
              <span>動画の名前</span>
              <input
                id="video-title"
                value={draft.videoTitle}
                maxLength={80}
                onChange={(event) => setDraft("videoTitle", event.target.value)}
              />
            </label>
            {limiterUsed ? (
              <LockedState
                title="この枠では一本作った"
                reason="同じ配信の文脈からは、一度だけ動画を形にできる。"
                next="次の配信を始めるか、別の場面を残す"
              />
            ) : (
              <button
                type="button"
                className="pixel-button pixel-button--primary"
                onClick={() =>
                  onCommand({ type: "CREATE_VIDEO", title: draft.videoTitle })
                }
              >
                動画にして送り出す
              </button>
            )}
          </>
        )}
        <WorkspaceOutput state={state} types={["video"]} label="動画の記録" />
      </section>
    );
  if (id === "singing")
    return (
      <section className="activity-workspace activity-workspace--singing pixel-frame">
        <p className="eyebrow">SINGING · 表現を確かめる</p>
        <h2>今日は、この響きを聴く</h2>
        <p>歌を数値の生産にせず、一つの表現を確かめて手がかりを残す。</p>
        {locked ? (
          <LockedState
            reason="歌唱は、配信と動画の循環ができた後に開く。"
            next="部屋で場面を残し、動画にして次の配信へ返す"
          />
        ) : (
          <>
            <div className="workspace-readout">
              <span>いまの手がかり</span>
              <strong>{formatExact(state.resources.vocalMastery)}</strong>
              <small>入力: 表現の焦点 / 出力: テイク記録</small>
            </div>
            <label className="text-field" htmlFor="singing-focus">
              <span>確かめる焦点</span>
              <input
                id="singing-focus"
                value={draft.singingFocus}
                maxLength={48}
                onChange={(event) =>
                  setDraft("singingFocus", event.target.value)
                }
              />
            </label>
            {limiterUsed ? (
              <LockedState
                title="この枠では焦点を決めた"
                reason="同じ配信のまとまりでは、表現を一つだけ丁寧に扱う。"
                next="次の配信のあとで、別の焦点を選ぶ"
              />
            ) : (
              <button
                type="button"
                className="pixel-button pixel-button--primary"
                onClick={() =>
                  onCommand({
                    type: "PRACTICE_SINGING",
                    focus: draft.singingFocus,
                    title: draft.singingTitle,
                  })
                }
              >
                この表現を確かめる
              </button>
            )}
          </>
        )}
        <WorkspaceOutput state={state} types={["take"]} label="歌の手がかり" />
      </section>
    );
  if (id === "music")
    return (
      <section className="activity-workspace activity-workspace--music pixel-frame">
        <p className="eyebrow">MUSIC · 断片を編む</p>
        <h2>手がかりを、曲のかたちへ</h2>
        <p>歌や残した場面を入力にして、部屋の外でも続く作品へ編む。</p>
        {locked ||
        (!sourceTake && !sourceMaterial) ||
        state.resources.vocalMastery < 1 ? (
          <LockedState
            reason={
              locked
                ? "音楽は、歌の手がかりを残した後に開く。"
                : "歌の手がかりと残した場面のどちらかが必要。"
            }
            next="歌唱で表現を確かめ、配信から場面を残す"
          />
        ) : (
          <>
            <div className="workspace-readout">
              <span>編む素材</span>
              <strong>{(sourceTake ?? sourceMaterial).title}</strong>
              <small>出力: 曲の断片 / 枠ごとに一本</small>
            </div>
            <label className="text-field" htmlFor="music-title">
              <span>曲の断片の名前</span>
              <input
                id="music-title"
                value={draft.musicTitle}
                maxLength={80}
                onChange={(event) => setDraft("musicTitle", event.target.value)}
              />
            </label>
            {limiterUsed ? (
              <LockedState
                title="この枠では一本編んだ"
                reason="同じ配信のまとまりでは、曲の断片を一つだけ仕上げる。"
                next="次の配信で、別の断片を扱う"
              />
            ) : (
              <button
                type="button"
                className="pixel-button pixel-button--primary"
                onClick={() =>
                  onCommand({ type: "ARRANGE_MUSIC", title: draft.musicTitle })
                }
              >
                曲の断片を編む
              </button>
            )}
          </>
        )}
        <WorkspaceOutput state={state} types={["music"]} label="曲の断片" />
      </section>
    );
  if (id === "sns")
    return (
      <section className="activity-workspace activity-workspace--sns pixel-frame">
        <p className="eyebrow">SNS · 文脈を短く送る</p>
        <h2>このことだけを、今の言葉で</h2>
        <p>どこから来た話かを残したまま、短い発信として外へ置く。</p>
        {locked || !sourceWork ? (
          <LockedState
            reason={
              locked
                ? "SNS は、活動の文脈を一つ残した後に開く。"
                : "動画・曲・場面のどれかが、まだない。"
            }
            next="場面を残すか、動画や曲を作る"
          />
        ) : (
          <>
            <div className="workspace-readout">
              <span>送る文脈</span>
              <strong>{sourceWork.title}</strong>
              <small>出力: 短い信号 / 枠ごとに一度</small>
            </div>
            <label className="text-field" htmlFor="sns-context">
              <span>いま伝えたいこと</span>
              <input
                id="sns-context"
                value={draft.snsContext}
                maxLength={80}
                onChange={(event) => setDraft("snsContext", event.target.value)}
              />
            </label>
            {limiterUsed ? (
              <LockedState
                title="この枠では送った"
                reason="文脈を薄めないため、この枠では一度だけ送る。"
                next="次の配信で、別の文脈を選ぶ"
              />
            ) : (
              <button
                type="button"
                className="pixel-button pixel-button--primary"
                onClick={() =>
                  onCommand({ type: "POST_SNS", context: draft.snsContext })
                }
              >
                この文脈を短く送る
              </button>
            )}
          </>
        )}
        <p className="signal-readout">
          いま残っている信号: {formatExact(state.resources.snsSignal)}
        </p>
      </section>
    );
  return (
    <section className="activity-workspace activity-workspace--event pixel-frame">
      <p className="eyebrow">LIVE EVENT · 場を閉じる</p>
      <h2>いまあるものを集めて、ひとつの場にする</h2>
      <p>動画や曲を持ち込み、ただ大きな数にせず、出来事として閉じる。</p>
      {locked || (!sourceVideo && !sourceMusic) ? (
        <LockedState
          reason={
            locked
              ? "ライブイベントは、複数の活動を持ち寄れる段階で開く。"
              : "動画か曲を、先に一つ持ち込もう。"
          }
          next="動画を作るか、歌の手がかりから曲を編む"
        />
      ) : (
        <>
          <div className="workspace-readout">
            <span>持ち込むもの</span>
            <strong>{sourceVideo?.title ?? sourceMusic?.title}</strong>
            <small>出力: 場の記録 / 枠ごとに一度</small>
          </div>
          <label className="text-field" htmlFor="event-purpose">
            <span>この場で約束すること</span>
            <input
              id="event-purpose"
              value={draft.eventPurpose}
              maxLength={80}
              onChange={(event) => setDraft("eventPurpose", event.target.value)}
            />
          </label>
          {limiterUsed ? (
            <LockedState
              title="この枠では場をひらいた"
              reason="約束できる場は、一つずつ丁寧に閉じる。"
              next="次の配信で、別の持ち寄りを選ぶ"
            />
          ) : (
            <button
              type="button"
              className="pixel-button pixel-button--primary"
              onClick={() =>
                onCommand({
                  type: "HOST_LIVE_EVENT",
                  purpose: draft.eventPurpose,
                  title: draft.eventTitle,
                })
              }
            >
              この場をひらく
            </button>
          )}
        </>
      )}
      <WorkspaceOutput
        state={state}
        types={["event-record"]}
        label="ライブの記録"
      />
    </section>
  );
}

function WorkspaceOutput({ state, types, label }) {
  const works = state.works
    .filter((work) => types.includes(work.type))
    .slice(-3)
    .reverse();
  return (
    <section className="workspace-output" aria-label={label}>
      <p>{label}</p>
      {works.length ? (
        <ul>
          {works.map((work) => (
            <li key={work.id}>
              <strong>{work.title}</strong>
              <small>
                {formatTime(work.createdAt)} ·{" "}
                {work.returnObserved ? "次の枠へ返った" : "記録済み"}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-copy">まだ記録はない。</p>
      )}
    </section>
  );
}

function PeopleScreen({ state, surface, setSurface, onCommand, onRoom }) {
  const selectedId =
    surface.selectedPersonId ??
    state.people.firstExternalArrivalId ??
    FICTIONAL_PEOPLE[0]?.id;
  const people = FICTIONAL_PEOPLE.map((definition) => ({
    ...definition,
    record:
      state.people.known.find((person) => person.id === definition.id) ?? null,
  }));
  const selected =
    people.find((person) => person.id === selectedId) ?? people[0];
  return (
    <PixelPage
      eyebrow="PEOPLE & CONTINUITY"
      title="人と、続いていくこと"
      detail="フィクションの参加者は、強さではなく来た時間と文脈を残す。"
      onRoom={onRoom}
    >
      <div className="people-layout">
        <nav className="people-list" aria-label="フィクションの参加者">
          {people.map((person) => (
            <button
              type="button"
              key={person.id}
              className={selected?.id === person.id ? "is-current" : ""}
              aria-current={selected?.id === person.id ? "page" : undefined}
              onClick={() =>
                setSurface((current) => ({
                  ...current,
                  selectedPersonId: person.id,
                }))
              }
            >
              <span aria-hidden="true">
                {person.record?.status === "away"
                  ? "○"
                  : person.record
                    ? "●"
                    : "·"}
              </span>
              <strong>{person.displayName}</strong>
              <small>
                {person.record
                  ? `${person.record.visits} 回 · ${person.record.status === "away" ? "また会える距離" : "この部屋にいる"}`
                  : "まだ出会っていない"}
              </small>
            </button>
          ))}
        </nav>
        {selected && (
          <section className="person-detail pixel-frame">
            <p className="eyebrow">FICTIONAL PERSON</p>
            <h2>{selected.displayName}</h2>
            <p>{selected.note}</p>
            <p className="interest-row">
              話の手がかり: {selected.interests.join(" / ")}
            </p>
            {selected.record ? (
              <>
                <dl className="person-facts">
                  <div>
                    <dt>最初に来た</dt>
                    <dd>{formatTime(selected.record.firstSeenAt)}</dd>
                  </div>
                  <div>
                    <dt>来た回数</dt>
                    <dd>{selected.record.visits} 回</dd>
                  </div>
                  <div>
                    <dt>いま</dt>
                    <dd>
                      {selected.record.status === "away"
                        ? "また会える距離"
                        : "この部屋にいる"}
                    </dd>
                  </div>
                </dl>
                <section className="moment-list">
                  <h3>残った瞬間</h3>
                  <ul>
                    {selected.record.history.map((moment, index) => (
                      <li key={`${moment}-${index}`}>
                        {moment === "arrival"
                          ? "最初に来た"
                          : moment === "revisit"
                            ? "また来た"
                            : moment === "away"
                              ? "少し離れた"
                              : "部屋へ戻った"}
                      </li>
                    ))}
                  </ul>
                </section>
                {selected.record.status === "away" ? (
                  <button
                    type="button"
                    className="pixel-button pixel-button--mint"
                    onClick={() =>
                      onCommand({ type: "WELCOME_BACK", personId: selected.id })
                    }
                  >
                    また会う
                  </button>
                ) : (
                  <button
                    type="button"
                    className="pixel-button pixel-button--quiet"
                    onClick={() =>
                      onCommand({ type: "MARK_ABSENT", personId: selected.id })
                    }
                  >
                    また会える距離へする
                  </button>
                )}
              </>
            ) : (
              <LockedState
                title="まだ出会っていない"
                reason="この人は、決められた順序で出現する素材ではない。"
                next="部屋で配信を始め、来た記録を待つ"
              />
            )}
          </section>
        )}
      </div>
    </PixelPage>
  );
}

function ConnectionsScreen({ state, surface, setSurface, onCommand, onRoom }) {
  const draft = surface.drafts;
  const from = draft.bridgeFrom;
  const to = draft.bridgeTo;
  const hasProof = (id) => {
    return state.works.some((work) => work.provenance?.activity === id);
  };
  const sourceWork = newest(
    state.works,
    (work) => work.provenance?.activity === from,
  );
  const routeKey = `${from}->${to}`;
  const exists = state.bridges.routes.some((route) => route.key === routeKey);
  const sourceOpen = from === "broadcast" || state.activities[from]?.unlocked;
  const targetOpen = to === "broadcast" || state.activities[to]?.unlocked;
  const ready =
    from !== to && sourceOpen && targetOpen && Boolean(sourceWork) && !exists;
  return (
    <PixelPage
      eyebrow="CONNECTIONS"
      title="活動どうしを、理由つきでつなぐ"
      detail="つながりは数値の装飾ではなく、どこから来てどこへ返るかの記録。"
      onRoom={onRoom}
    >
      <div className="connections-layout">
        <section className="bridge-maker pixel-frame">
          <p className="eyebrow">NEW BRIDGE</p>
          <h2>次の因果を選ぶ</h2>
          <label className="text-field" htmlFor="bridge-from">
            <span>どこから</span>
            <select
              id="bridge-from"
              value={from}
              onChange={(event) =>
                setSurface((current) => ({
                  ...current,
                  drafts: { ...current.drafts, bridgeFrom: event.target.value },
                }))
              }
            >
              {ACTIVITY_IDS.map((id) => (
                <option value={id} key={id}>
                  {activityLabel(id)}
                  {hasProof(id) ? "" : "（まだ証拠なし）"}
                </option>
              ))}
            </select>
          </label>
          <label className="text-field" htmlFor="bridge-to">
            <span>どこへ</span>
            <select
              id="bridge-to"
              value={to}
              onChange={(event) =>
                setSurface((current) => ({
                  ...current,
                  drafts: { ...current.drafts, bridgeTo: event.target.value },
                }))
              }
            >
              {ACTIVITY_IDS.map((id) => (
                <option value={id} key={id}>
                  {activityLabel(id)}
                  {id !== "broadcast" && !state.activities[id]?.unlocked
                    ? "（未解放）"
                    : ""}
                </option>
              ))}
            </select>
          </label>
          {ready ? (
            <>
              <div className="workspace-readout">
                <span>根拠になる記録</span>
                <strong>{sourceWork?.title ?? "配信の記録"}</strong>
                <small>作ると、履歴にも同じ因果が残る。</small>
              </div>
              <button
                type="button"
                className="pixel-button pixel-button--primary"
                onClick={() =>
                  onCommand({
                    type: "CREATE_BRIDGE",
                    from,
                    to,
                    sourceWorkId: sourceWork.id,
                  })
                }
              >
                この因果を結ぶ
              </button>
            </>
          ) : (
            <LockedState
              title={exists ? "すでに結ばれている" : "まだ結べない"}
              reason={
                exists
                  ? "同じ向きのつながりは、重ねずに一つの記録として残す。"
                  : !sourceOpen
                    ? `${activityLabel(from)}はまだ活動として開いていない。`
                    : !hasProof(from)
                      ? `${activityLabel(from)}から来た作品や場の証拠がまだない。`
                      : !targetOpen
                        ? `${activityLabel(to)}はまだ活動として開いていない。`
                        : "異なる二つの活動を選ぶ。"
              }
              next={
                !hasProof(from)
                  ? `${activityLabel(from)}で、まず一つ記録を残す`
                  : "別の向きか、別の活動を選ぶ"
              }
            />
          )}
        </section>
        <section className="bridge-history pixel-frame">
          <p className="eyebrow">DURABLE ROUTES</p>
          <h2>すでに残った因果</h2>
          {state.bridges.routes.length ? (
            <ul>
              {[...state.bridges.routes].reverse().map((route) => (
                <li key={route.id}>
                  <span>{activityLabel(route.from)}</span>
                  <b aria-hidden="true">→</b>
                  <span>{activityLabel(route.to)}</span>
                  <small>
                    {route.sourceWorkId
                      ? `根拠: ${route.sourceWorkId}`
                      : "根拠の作品はまだ特定されていない"}{" "}
                    · {formatTime(route.createdAt)}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-copy">
              まだ因果は結ばれていない。活動を一つずつ残すと、理由を持った接続を選べる。
            </p>
          )}
        </section>
      </div>
    </PixelPage>
  );
}

function ProgressScreen({
  state,
  summary,
  surface,
  setSurface,
  onCommand,
  onRoom,
  onRoute,
}) {
  return (
    <PixelPage
      eyebrow="PROGRESS"
      title="積み上げを、意味として残す"
      detail="自動化・引き継ぎ・尺度は、人物や部屋を置き換える操作ではない。"
      onRoom={onRoom}
    >
      <nav
        className="workspace-tabs workspace-tabs--compact"
        aria-label="積み上げの画面"
      >
        {PROGRESS_ITEMS.map((item) => (
          <button
            type="button"
            key={item.id}
            className={surface.progressTab === item.id ? "is-current" : ""}
            aria-current={surface.progressTab === item.id ? "page" : undefined}
            onClick={() => {
              if (surface.progressTab !== item.id)
                onRoute("progress", { route: { progressTab: item.id } });
            }}
          >
            <b>{item.label}</b>
          </button>
        ))}
      </nav>
      {surface.progressTab === "automation" && (
        <AutomationPanel state={state} onCommand={onCommand} />
      )}
      {surface.progressTab === "prestige" && (
        <PrestigePanel
          state={state}
          surface={surface}
          setSurface={setSurface}
          onCommand={onCommand}
        />
      )}
      {surface.progressTab === "scale" && (
        <ScalePanel
          state={state}
          surface={surface}
          setSurface={setSurface}
          onCommand={onCommand}
        />
      )}
      {surface.progressTab === "goals" && (
        <GoalsPanel state={state} summary={summary} />
      )}
      {surface.progressTab === "completion" && (
        <CompletionPanel
          state={state}
          summary={summary}
          surface={surface}
          setSurface={setSurface}
          onCommand={onCommand}
          onRoom={onRoom}
        />
      )}
    </PixelPage>
  );
}

function AutomationPanel({ state, onCommand }) {
  return (
    <section className="automation-panel">
      <div className="section-copy">
        <p className="eyebrow">AUTOMATION</p>
        <h2>分かった手入れだけを、任せる</h2>
        <p>
          人物の到着や大切な判断は、自動で完了しない。留守中にも進められるのは、理解済みの手入れだけ。
        </p>
      </div>
      <div className="automation-list">
        {Object.entries(state.automation).map(([id, entry]) => {
          const copy = AUTOMATION_COPY[id] ?? {
            label: id,
            proof: "手動の証拠",
            effect: "記録を残す",
          };
          const latest = newest(
            state.history,
            (event) =>
              event.type === "automation-enabled" && event.automationId === id,
          );
          return (
            <article className="automation-item pixel-frame" key={id}>
              <div>
                <p className="eyebrow">
                  {entry.enabled
                    ? "RECEIPT"
                    : entry.understood
                      ? "READY"
                      : entry.available
                        ? "MANUAL PROOF"
                        : "LOCKED"}
                </p>
                <h3>{copy.label}</h3>
                <p>{copy.effect}</p>
              </div>
              {!entry.available ? (
                <LockedState
                  title="まだ使える時期ではない"
                  reason="次の節目に到達すると、この手入れを考えられる。"
                  next={copy.proof}
                />
              ) : !entry.understood ? (
                <LockedState
                  title="まず手で確かめる"
                  reason="自動化は、理解した行為だけに限る。"
                  next={copy.proof}
                />
              ) : entry.enabled ? (
                <div className="receipt-box">
                  <StateChip kind="receipt" />{" "}
                  <p>有効 · 完了 {entry.completed} 回</p>
                  <small>
                    {latest
                      ? `${formatTime(latest.at)} に記録`
                      : "履歴に保存済み"}
                  </small>
                </div>
              ) : (
                <div className="ready-box">
                  <StateChip kind="ready" /> <p>手で確かめた記録がある。</p>
                  <button
                    type="button"
                    className="pixel-button pixel-button--primary"
                    onClick={() => onCommand({ type: "ENABLE_AUTOMATION", id })}
                  >
                    この手入れを任せる
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PrestigePanel({ state, surface, setSurface, onCommand }) {
  const available =
    state.progression.breakpointIndex >= 3 &&
    !["broadcast-before", "broadcast-live", "broadcast-after"].includes(
      state.phase.kind,
    );
  const last = newest(state.receipts.prestige);
  return (
    <section className="transition-panel">
      <p className="eyebrow">PRESTIGE · REVIEWABLE</p>
      <h2>引き継ぐものと、置いていく値を比べる</h2>
      <p>
        これは人物を消費する操作ではない。部屋・人・作品・履歴は残し、現在の尺度の値だけを手放す候補。
      </p>
      <div className="comparison-grid">
        <article className="comparison-box comparison-box--release">
          <h3>RELEASE</h3>
          <p>
            {UNIT_LABELS[state.resources.currentUnit.id] ??
              state.resources.currentUnit.id}{" "}
            の現在値
          </p>
          <strong>{formatExact(state.resources.currentUnit.value)}</strong>
        </article>
        <article className="comparison-box">
          <h3>PRESERVE</h3>
          <p>
            人 {state.people.known.length} 人 / 作品 {state.works.length} 件 /
            履歴 {state.history.length} 件
          </p>
          <strong>そのまま残る</strong>
        </article>
        <article className="comparison-box comparison-box--gain">
          <h3>GAIN</h3>
          <p>引き継ぎのレシートを残し、部屋へ戻る。</p>
          <strong>意味を持ち越す</strong>
        </article>
        <article className="comparison-box">
          <h3>RECOVERY</h3>
          <p>実行後も部屋とアーカイブで証拠を確認できる。</p>
          <strong>復元ではなく記録</strong>
        </article>
      </div>
      {available ? (
        surface.prestigeArmed ? (
          <div className="confirm-strip">
            <StateChip kind="pending" />{" "}
            <p>現在の尺度の値を手放し、上の証拠を残す。</p>
            <button
              type="button"
              className="pixel-button pixel-button--primary"
              onClick={() => {
                onCommand({ type: "PRESTIGE" });
                setSurface((current) => ({ ...current, prestigeArmed: false }));
              }}
            >
              引き継ぎを記録する
            </button>
            <button
              type="button"
              className="pixel-button pixel-button--quiet"
              onClick={() =>
                setSurface((current) => ({ ...current, prestigeArmed: false }))
              }
            >
              やめる
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="pixel-button pixel-button--primary"
            onClick={() =>
              setSurface((current) => ({ ...current, prestigeArmed: true }))
            }
          >
            引き継ぎを確認する
          </button>
        )
      ) : (
        <LockedState
          title="まだ引き継げない"
          reason={
            state.progression.breakpointIndex < 3
              ? "三つ目の節目を記録すると、何を残すかを比べられる。"
              : "配信を閉じてから、引き継ぎを確認する。"
          }
          next={
            state.progression.breakpointIndex < 3
              ? "配信・保存・動画の循環を続ける"
              : "いまの配信を閉じる"
          }
        />
      )}
      {last && (
        <section className="receipt-box pixel-frame">
          <StateChip kind="receipt">PREVIOUS RECEIPT</StateChip>
          <p>
            {formatTime(last.at)} · 人 {last.preservedPeople.length} 人、作品{" "}
            {last.preservedWorks.length} 件、履歴 {last.preservedHistory}{" "}
            件を残した。
          </p>
        </section>
      )}
    </section>
  );
}

function ScalePanel({ state, surface, setSurface, onCommand }) {
  const peak = SCALE_PEAKS[state.progression.scaleIndex];
  const available =
    Boolean(peak) &&
    state.progression.mode !== "p0" &&
    state.progression.breakpointIndex >= peak.requiredBreakpoint &&
    state.progression.currentUnit === peak.fromUnit;
  const latestRetirement = newest(state.resources.retiredUnits);
  return (
    <section className="transition-panel">
      <p className="eyebrow">SCALE · WORKING HYPOTHESIS</p>
      <h2>尺度を切り替える前に、意味を読む</h2>
      {peak ? (
        <>
          <div className="scale-preview pixel-frame">
            <div>
              <span>OLD UNIT</span>
              <strong>{UNIT_LABELS[peak.fromUnit] ?? peak.fromUnit}</strong>
              <small>この値はリアルタイム生成を終え、履歴に残る。</small>
            </div>
            <b aria-hidden="true">⇢</b>
            <div>
              <span>NEW UNIT</span>
              <strong>{UNIT_LABELS[peak.toUnit] ?? peak.toUnit}</strong>
              <small>次の活動を、別の意味の単位で扱い始める。</small>
            </div>
          </div>
          <p className="candidate-warning">
            候補 {peak.id} · {peak.meaning}。これは作業仮説であり、Owner
            承認済み Canon ではありません。
          </p>
          {available ? (
            surface.scaleArmed ? (
              <div className="confirm-strip">
                <StateChip kind="pending" />{" "}
                <p>
                  旧単位の最終値・人・作品・根拠をレシートへ残して切り替える。
                </p>
                <button
                  type="button"
                  className="pixel-button pixel-button--primary"
                  onClick={() => {
                    onCommand({ type: "SCALE_CANDIDATE" });
                    setSurface((current) => ({
                      ...current,
                      scaleArmed: false,
                    }));
                  }}
                >
                  この尺度候補を記録する
                </button>
                <button
                  type="button"
                  className="pixel-button pixel-button--quiet"
                  onClick={() =>
                    setSurface((current) => ({ ...current, scaleArmed: false }))
                  }
                >
                  やめる
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="pixel-button pixel-button--primary"
                onClick={() =>
                  setSurface((current) => ({ ...current, scaleArmed: true }))
                }
              >
                尺度の切り替えを確認する
              </button>
            )
          ) : (
            <LockedState
              title="まだ切り替えない"
              reason={
                state.progression.mode === "p0"
                  ? "P0 では尺度転換を記録しない。"
                  : state.progression.breakpointIndex < peak.requiredBreakpoint
                    ? `必要な節目: ${peak.requiredBreakpoint} 件。いまは ${state.progression.breakpointIndex} 件。`
                    : "いまの単位から続く候補ではない。"
              }
              next="活動と節目の証拠を増やし、この候補の理由を作る"
            />
          )}
        </>
      ) : (
        <section className="receipt-box pixel-frame">
          <StateChip kind="receipt" /> <h3>すべての尺度候補を記録済み</h3>
          <p>次の U11 は自動では始まらない。完成候補の画面で、続け方を選ぶ。</p>
        </section>
      )}
      {latestRetirement && (
        <section className="receipt-box pixel-frame">
          <StateChip kind="receipt">SEMANTIC RETIREMENT</StateChip>
          <p>
            {UNIT_LABELS[latestRetirement.retiredUnit] ??
              latestRetirement.retiredUnit}{" "}
            · 最終値 {formatExact(latestRetirement.finalValue)} · 人{" "}
            {latestRetirement.people.length} 人と作品の根拠を履歴へ保存済み。
          </p>
        </section>
      )}
    </section>
  );
}

function GoalsPanel({ state, summary }) {
  const breakpointIds = new Set(
    state.receipts.breakpoints.map((receipt) => receipt.id),
  );
  const peakIds = new Set(
    state.receipts.scalePeaks.map((receipt) => receipt.id),
  );
  return (
    <section className="goals-panel">
      <section className="goals-summary pixel-frame">
        <p className="eyebrow">GOALS / RECORDS</p>
        <h2>節目は、数字だけでなく理由を残す</h2>
        <p>
          いまの次:{" "}
          {summary.breakpoints.next
            ? `${summary.breakpoints.next.id} ${summary.breakpoints.next.label}`
            : "すべての節目を記録済み"}
        </p>
        <StateChip
          kind={state.progression.completionCandidate ? "candidate" : "pending"}
        >
          {state.progression.completionCandidate
            ? "COMPLETION CANDIDATE"
            : "JOURNEY CONTINUES"}
        </StateChip>
      </section>
      <div className="records-columns">
        <section className="record-list pixel-frame">
          <h3>24 Breakpoints</h3>
          <ol>
            {BREAKPOINTS.map((breakpoint) => (
              <li
                key={breakpoint.id}
                className={breakpointIds.has(breakpoint.id) ? "is-reached" : ""}
              >
                <span>{breakpointIds.has(breakpoint.id) ? "✓" : "·"}</span>
                <div>
                  <strong>
                    {breakpoint.id} · {breakpoint.label}
                  </strong>
                  <small>{breakpoint.change}</small>
                  <small>
                    必要: {breakpoint.requires.join(" / ")} · 証拠{" "}
                    {breakpoint.threshold}
                  </small>
                </div>
                {isWorkingHypothesis(breakpoint) && (
                  <StateChip kind="candidate">仮説</StateChip>
                )}
              </li>
            ))}
          </ol>
        </section>
        <section className="record-list pixel-frame">
          <h3>10 Scale Peaks</h3>
          <ol>
            {SCALE_PEAKS.map((peak) => (
              <li
                key={peak.id}
                className={peakIds.has(peak.id) ? "is-reached" : ""}
              >
                <span>{peakIds.has(peak.id) ? "✓" : "·"}</span>
                <div>
                  <strong>
                    {peak.id} · {peak.fromUnit} → {peak.toUnit}
                  </strong>
                  <small>{peak.meaning}</small>
                  <small>必要 BP: {peak.requiredBreakpoint}</small>
                </div>
                <StateChip kind="candidate">候補</StateChip>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  );
}

function CompletionPanel({
  state,
  summary,
  surface,
  setSurface,
  onCommand,
  onRoom,
}) {
  const completion = summary.completion;
  const recorded = newest(
    state.receipts.completion,
    (receipt) => receipt.kind === "completion-candidate",
  );
  const startAnchor = () => {
    const next = onCommand({ type: "FINAL_ANCHOR_BROADCAST" });
    if (next.phase.kind === "broadcast-before")
      onRoom({
        history: "replace",
        surface: { beforeOpen: false, paused: false },
      });
  };
  return (
    <section className="completion-panel pixel-frame">
      <p className="eyebrow">MAIN COMPLETION · CANDIDATE</p>
      <h2>ここまで残したものを、続け方へ渡す</h2>
      <p>
        これは完成候補の記録。Owner の最終承認、公開、次の U11
        を自動で始めることではない。
      </p>
      <div className="completion-proof">
        <div>
          <span>人</span>
          <strong>{state.people.known.length}</strong>
        </div>
        <div>
          <span>作品</span>
          <strong>{state.works.length}</strong>
        </div>
        <div>
          <span>節目</span>
          <strong>{state.receipts.breakpoints.length}/24</strong>
        </div>
        <div>
          <span>尺度</span>
          <strong>{state.receipts.scalePeaks.length}/10</strong>
        </div>
      </div>
      {completion.stage === "anchor-required" ? (
        <button
          type="button"
          className="pixel-button pixel-button--primary"
          onClick={startAnchor}
        >
          最後の配信を、部屋から始める
        </button>
      ) : completion.stage === "choice-required" ? (
        <section className="receipt-box pixel-frame">
          <StateChip kind="candidate">FINAL CHOICE · CANDIDATE</StateChip>
          <h3>最後の配信で残したものを、どちらへ渡す？</h3>
          <p>
            正解を当てる選択ではない。さきやの意図と、一緒に残す理由を読んで選ぶ。
          </p>
          <div className="completion-actions">
            {completion.choices.map((choice) => (
              <button
                type="button"
                className="pixel-button pixel-button--primary"
                key={choice.id}
                onClick={() =>
                  onCommand({
                    type: "RECORD_COMPLETION_CHOICE",
                    choiceId: choice.id,
                  })
                }
              >
                <strong>{choice.label}</strong>
                <small>
                  {choice.sakiyaIntent} {choice.participantContribution}
                </small>
              </button>
            ))}
          </div>
        </section>
      ) : completion.stage === "receipt-ready" ? (
        <section className="receipt-box pixel-frame">
          <StateChip kind="receipt">ANCHOR + CHOICE RECORDED</StateChip>
          <h3>最後の配信と選択を、候補クレジットへ閉じる</h3>
          <p>
            ここで残すのは作品内の完成候補。Owner承認や公開を実行する操作ではない。
          </p>
          <button
            type="button"
            className="pixel-button pixel-button--primary"
            onClick={() => onCommand({ type: "COMPLETION_CANDIDATE" })}
          >
            完成候補とクレジットを記録する
          </button>
        </section>
      ) : completion.stage === "recorded" ? (
        <>
          <StateChip kind="candidate">RECORDED CANDIDATE</StateChip>
          <p className="candidate-warning">
            {recorded
              ? `${formatTime(recorded.at)} に、人物・作品・尺度の証拠を保存した。`
              : "証拠を保存済み。"}
          </p>
          <section className="receipt-box pixel-frame">
            <h3>候補クレジットと来歴</h3>
            <ul>
              {completion.credits.map((credit) => (
                <li key={credit.id}>
                  <strong>{credit.role}</strong> · {credit.value}（
                  {credit.status}）
                </li>
              ))}
            </ul>
            <p className="candidate-warning">
              Owner accepted: NO · Public release: NO · Gate:{" "}
              {completion.ownerGate}
            </p>
          </section>
          <div
            className="completion-actions"
            data-pending-focus={surface.strongNewGameArmed || undefined}
            tabIndex={surface.strongNewGameArmed ? -1 : undefined}
          >
            <button
              type="button"
              className="pixel-button pixel-button--primary"
              onClick={() => {
                const next = onCommand({ type: "CONTINUE" });
                if (next.phase.kind === "room")
                  onRoom({ history: "replace" });
              }}
            >
              部屋で続ける
            </button>
            {surface.strongNewGameArmed ? (
              <>
                <button
                  type="button"
                  className="pixel-button pixel-button--gold"
                  onClick={() => {
                    const next = onCommand({ type: "STRONG_NEW_GAME" });
                    if (
                      next.progression.journeyNumber >
                      state.progression.journeyNumber
                    )
                      onRoom({
                        history: "replace",
                        surface: { strongNewGameArmed: false },
                      });
                  }}
                >
                  証拠を残して新しい旅へ
                </button>
                <button
                  type="button"
                  className="pixel-button pixel-button--quiet"
                  onClick={() =>
                    setSurface((current) => ({
                      ...current,
                      strongNewGameArmed: false,
                    }))
                  }
                >
                  やめる
                </button>
              </>
            ) : (
              <button
                type="button"
                className="pixel-button pixel-button--quiet"
                onClick={() =>
                  setSurface((current) => ({
                    ...current,
                    strongNewGameArmed: true,
                  }))
                }
              >
                Strong New Game を確認する
              </button>
            )}
          </div>
        </>
      ) : (
        <LockedState
          title="続きの候補はまだ記録できない"
          reason={`節目 ${state.receipts.breakpoints.length}/24 · 尺度候補 ${state.receipts.scalePeaks.length}/10 · 現在 ${state.progression.currentUnit}。全てを理由つきで記録すると、最後の配信が開く。`}
          next="節目と尺度の候補を、履歴に残す"
        />
      )}
    </section>
  );
}

function LibraryScreen({
  state,
  summary,
  surface,
  setSurface,
  onCommand,
  onRoom,
  onRoute,
}) {
  return (
    <PixelPage
      eyebrow="LIBRARY"
      title="人・記録・いまを見る"
      detail="ここは管理画面ではなく、部屋に残した理由を読み直す場所。"
      onRoom={onRoom}
    >
      <nav
        className="workspace-tabs workspace-tabs--compact"
        aria-label="記録を見る場所"
      >
        {LIBRARY_ITEMS.map((item) => (
          <button
            type="button"
            key={item.id}
            className={surface.libraryTab === item.id ? "is-current" : ""}
            aria-current={surface.libraryTab === item.id ? "page" : undefined}
            onClick={() => {
              if (surface.libraryTab !== item.id)
                onRoute("library", { route: { libraryTab: item.id } });
            }}
          >
            <b>{item.label}</b>
          </button>
        ))}
      </nav>
      {surface.libraryTab === "people" && (
        <PeopleLibrary
          state={state}
          surface={surface}
          setSurface={setSurface}
          onCommand={onCommand}
        />
      )}
      {surface.libraryTab === "archive" && (
        <ArchivePanel state={state} surface={surface} setSurface={setSurface} />
      )}
      {surface.libraryTab === "analysis" && (
        <AnalysisPanel state={state} summary={summary} />
      )}
    </PixelPage>
  );
}

function PeopleLibrary({ state, surface, setSurface, onCommand }) {
  const selectedId =
    surface.selectedPersonId ??
    state.people.firstExternalArrivalId ??
    FICTIONAL_PEOPLE[0]?.id;
  const people = FICTIONAL_PEOPLE.map((definition) => ({
    ...definition,
    record:
      state.people.known.find((person) => person.id === definition.id) ?? null,
  }));
  const selected =
    people.find((person) => person.id === selectedId) ?? people[0];
  return (
    <div className="people-layout">
      <nav className="people-list" aria-label="フィクションの参加者">
        {people.map((person) => (
          <button
            type="button"
            key={person.id}
            className={selected?.id === person.id ? "is-current" : ""}
            aria-current={selected?.id === person.id ? "page" : undefined}
            onClick={() =>
              setSurface((current) => ({
                ...current,
                selectedPersonId: person.id,
              }))
            }
          >
            <span aria-hidden="true">
              {person.record?.status === "away"
                ? "○"
                : person.record
                  ? "●"
                  : "·"}
            </span>
            <strong>{person.displayName}</strong>
            <small>
              {person.record
                ? `${person.record.visits} 回 · ${person.record.status === "away" ? "また会える距離" : "この部屋にいる"}`
                : "まだ出会っていない"}
            </small>
          </button>
        ))}
      </nav>
      {selected && (
        <section className="person-detail pixel-frame">
          <p className="eyebrow">FICTIONAL PERSON</p>
          <h2>{selected.displayName}</h2>
          <p>{selected.note}</p>
          <p className="interest-row">
            話の手がかり: {selected.interests.join(" / ")}
          </p>
          {selected.record ? (
            <>
              <dl className="person-facts">
                <div>
                  <dt>最初に来た</dt>
                  <dd>{formatTime(selected.record.firstSeenAt)}</dd>
                </div>
                <div>
                  <dt>来た回数</dt>
                  <dd>{selected.record.visits} 回</dd>
                </div>
                <div>
                  <dt>いま</dt>
                  <dd>
                    {selected.record.status === "away"
                      ? "また会える距離"
                      : "この部屋にいる"}
                  </dd>
                </div>
              </dl>
              <section className="moment-list">
                <h3>残った瞬間</h3>
                <ul>
                  {selected.record.history.map((moment, index) => (
                    <li key={`${moment}-${index}`}>
                      {moment === "arrival"
                        ? "最初に来た"
                        : moment === "revisit"
                          ? "また来た"
                          : moment === "away"
                            ? "少し離れた"
                            : "部屋へ戻った"}
                    </li>
                  ))}
                </ul>
              </section>
              {selected.record.status === "away" ? (
                <button
                  type="button"
                  className="pixel-button pixel-button--mint"
                  onClick={() =>
                    onCommand({ type: "WELCOME_BACK", personId: selected.id })
                  }
                >
                  また会う
                </button>
              ) : (
                <button
                  type="button"
                  className="pixel-button pixel-button--quiet"
                  onClick={() =>
                    onCommand({ type: "MARK_ABSENT", personId: selected.id })
                  }
                >
                  また会える距離へする
                </button>
              )}
            </>
          ) : (
            <LockedState
              title="まだ出会っていない"
              reason="この人は、決められた順序で出現する素材ではない。"
              next="部屋で配信を始め、来た記録を待つ"
            />
          )}
        </section>
      )}
    </div>
  );
}

function ArchivePanel({ state, surface, setSurface }) {
  const filter = surface.archiveFilter;
  const personEvents = new Set([
    "external-fictional-arrival",
    "fictional-person-revisit",
    "fictional-person-away",
    "fictional-person-returned",
  ]);
  const eventVisible = (event) =>
    filter === "all" ||
    (filter === "people" && personEvents.has(event.type)) ||
    (filter === "events" && !personEvents.has(event.type));
  const worksVisible = filter === "all" || filter === "works";
  const recordsVisible = (kind) => filter === "all" || filter === kind;
  return (
    <section className="archive-panel">
      <div className="archive-controls pixel-frame">
        <label htmlFor="archive-filter">
          <span>表示する記録</span>
          <select
            id="archive-filter"
            value={filter}
            onChange={(event) =>
              setSurface((current) => ({
                ...current,
                archiveFilter: event.target.value,
              }))
            }
          >
            <option value="all">すべて</option>
            <option value="people">人の瞬間</option>
            <option value="events">活動の出来事</option>
            <option value="works">作品</option>
            <option value="breakpoints">節目</option>
            <option value="scalePeaks">尺度</option>
            <option value="prestige">引き継ぎ</option>
            <option value="completion">続きの候補</option>
          </select>
        </label>
        <p>フィルタは画面を移動しても、この起動中は保たれる。</p>
      </div>
      <div className="archive-stream">
        {eventVisible &&
          state.history
            .filter(eventVisible)
            .slice()
            .reverse()
            .map((event) => (
              <article className="archive-entry pixel-frame" key={event.id}>
                <span>{eventMark(event)}</span>
                <div>
                  <p>{eventText(event)}</p>
                  <small>{formatTime(event.at)} · EVENT</small>
                </div>
              </article>
            ))}
        {worksVisible &&
          [...state.works].reverse().map((work) => (
            <article className="archive-entry pixel-frame" key={work.id}>
              <span>▣</span>
              <div>
                <p>
                  {workTypeLabel(work.type)} · {work.title}
                </p>
                <small>
                  {formatTime(work.createdAt)} ·{" "}
                  {work.provenance?.activity
                    ? `${activityLabel(work.provenance.activity)} から`
                    : "由来を確認中"}
                </small>
              </div>
            </article>
          ))}
        {recordsVisible("breakpoints") &&
          [...state.receipts.breakpoints].reverse().map((receipt) => (
            <article className="archive-entry pixel-frame" key={receipt.id}>
              <span>◇</span>
              <div>
                <p>
                  {receipt.id} · {receipt.change}
                </p>
                <small>{formatTime(receipt.at)} · BREAKPOINT</small>
              </div>
            </article>
          ))}
        {recordsVisible("scalePeaks") &&
          [...state.receipts.scalePeaks].reverse().map((receipt) => (
            <article className="archive-entry pixel-frame" key={receipt.id}>
              <span>⇢</span>
              <div>
                <p>
                  {receipt.id} · {UNIT_LABELS[receipt.fromUnit]} →{" "}
                  {UNIT_LABELS[receipt.toUnit]}
                </p>
                <small>{formatTime(receipt.at)} · CANDIDATE RECEIPT</small>
              </div>
            </article>
          ))}
        {recordsVisible("prestige") &&
          [...state.receipts.prestige].reverse().map((receipt) => (
            <article className="archive-entry pixel-frame" key={receipt.id}>
              <span>↧</span>
              <div>
                <p>
                  引き継ぎ · 人 {receipt.preservedPeople.length} 人 / 作品{" "}
                  {receipt.preservedWorks.length} 件
                </p>
                <small>{formatTime(receipt.at)} · PRESTIGE RECEIPT</small>
              </div>
            </article>
          ))}
        {recordsVisible("completion") &&
          [...state.receipts.completion].reverse().map((receipt) => (
            <article className="archive-entry pixel-frame" key={receipt.id}>
              <span>★</span>
              <div>
                <p>
                  完成候補 · 人 {receipt.preservedPeople.length} 人 / 作品{" "}
                  {receipt.preservedWorks.length} 件
                </p>
                <small>{formatTime(receipt.at)} · NOT OWNER ACCEPTANCE</small>
              </div>
            </article>
          ))}
        {!state.history.length && !state.works.length && (
          <p className="empty-copy">
            まだ記録はない。部屋で始まる最初の配信が、ここにも残る。
          </p>
        )}
      </div>
    </section>
  );
}

function AnalysisPanel({ state, summary }) {
  const next = BREAKPOINTS[state.progression.breakpointIndex] ?? null;
  const activityRows = ACTIVITY_IDS.map((id) => ({
    id,
    ...state.activities[id],
  }));
  const contributions = [
    ["Presence", state.progression.presence, "その場にいる記録"],
    ["Co-creation", state.progression.coCreation, "一緒に選んだ・残した記録"],
    [
      "Shared Expansion",
      state.progression.sharedExpansion,
      "活動どうしを外へつないだ記録",
    ],
  ];
  return (
    <section className="analysis-panel">
      <section className="analysis-hero pixel-frame">
        <p className="eyebrow">CURRENT BOTTLENECK</p>
        <h2>
          {next ? `${next.id} · ${next.label}` : "次の節目はすべて記録済み"}
        </h2>
        <p>
          {next
            ? `${next.change} / 必要な証拠 ${next.threshold}。いまの証拠は ${formatExact(state.progression.evidence)}。`
            : "次は完成候補の続き方を確認する。"}
        </p>
        <StateChip kind={next ? "pending" : "candidate"}>
          {next ? "NEXT RECORD" : "ALL BREAKPOINTS"}
        </StateChip>
      </section>
      <div className="analysis-grid">
        <section className="pixel-frame">
          <h3>貢献の内訳</h3>
          <dl>
            {contributions.map(([label, value, note]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{formatExact(value)}</dd>
                <small>{note}</small>
              </div>
            ))}
          </dl>
        </section>
        <section className="pixel-frame">
          <h3>活動の記録</h3>
          <ul>
            {activityRows.map((row) => (
              <li key={row.id}>
                <span>{activityLabel(row.id)}</span>
                <strong>
                  操作 {row.totalActions} / 出力 {formatExact(row.output)}
                </strong>
                <small>
                  {row.unlocked ? row.limiter.label : "まだ開いていない"}
                </small>
              </li>
            ))}
          </ul>
        </section>
        <section className="pixel-frame">
          <h3>正確な値と不確実さ</h3>
          <dl>
            <div>
              <dt>{summary.currentUnitLabel}</dt>
              <dd>{formatExact(state.resources.currentUnit.value)}</dd>
            </div>
            <div>
              <dt>動画からの届き</dt>
              <dd>{formatExact(state.resources.videoReach)}</dd>
            </div>
            <div>
              <dt>曲の反響</dt>
              <dd>{formatExact(state.resources.musicResonance)}</dd>
            </div>
          </dl>
          <p className="candidate-warning">
            BP4 以降と全 SP の名前・閾値は作業仮説を含む。数値が Owner 承認済み
            Canon を意味するわけではない。
          </p>
        </section>
      </div>
    </section>
  );
}

function SettingsScreen({
  state,
  surface,
  setSurface,
  slots,
  corruptSaves,
  environment,
  onUpdateSettings,
  onSaveSlot,
  onRequestSlotAction,
  onConfirmSlotAction,
  onBuildExport,
  onDownloadExport,
  onImportText,
  onCommitImport,
  onPreviewBackup,
  onConfirmBackup,
  onDownloadCorrupt,
  onApplyUpdate,
  onReloadUpdate,
  onReset,
  onRoom,
}) {
  const save = surface.save;
  const audioMix = surface.audioMix;
  const setAudioMix = (key, value) =>
    setSurface((current) => ({
      ...current,
      audioMix: { ...current.audioMix, [key]: Number(value) },
    }));
  return (
    <PixelPage
      eyebrow="LOCAL SETTINGS"
      title="この端末の保存と見え方"
      detail="アカウント・クラウド同期・実在人物データは使わない。"
      onRoom={onRoom}
    >
      <div className="settings-grid">
        <section className="settings-section pixel-frame">
          <p className="eyebrow">ACCESSIBILITY</p>
          <h2>見え方と操作</h2>
          <div className="settings-actions">
            <button
              type="button"
              className="pixel-button"
              aria-pressed={state.settings.reducedMotion}
              onClick={() =>
                onUpdateSettings({
                  reducedMotion: !state.settings.reducedMotion,
                })
              }
            >
              動き: {state.settings.reducedMotion ? "固定フレーム" : "ぴこぴこ"}
            </button>
            <button
              type="button"
              className="pixel-button"
              aria-pressed={state.settings.highContrast}
              onClick={() =>
                onUpdateSettings({ highContrast: !state.settings.highContrast })
              }
            >
              高コントラスト: {state.settings.highContrast ? "ON" : "OFF"}
            </button>
            <button
              type="button"
              className="pixel-button"
              onClick={() =>
                onUpdateSettings({
                  fontScale:
                    state.settings.fontScale >= 1.2
                      ? 1
                      : state.settings.fontScale === 1
                        ? 1.1
                        : 1.2,
                })
              }
            >
              文字: {state.settings.fontScale >= 1.2 ? "標準" : "大きく"}
            </button>
            <button
              type="button"
              className="pixel-button"
              aria-pressed={state.settings.captions}
              onClick={() =>
                onUpdateSettings({ captions: !state.settings.captions })
              }
            >
              字幕: {state.settings.captions ? "ON" : "OFF"}
            </button>
          </div>
          <p>
            字幕を OFF にしても、重要な人・作品・転換はアーカイブに文字で残る。
          </p>
        </section>
        <section className="settings-section pixel-frame">
          <p className="eyebrow">SOUND / LIVE</p>
          <h2>この起動中の音と配信操作</h2>
          <button
            type="button"
            className="pixel-button"
            aria-pressed={state.settings.sound}
            onClick={() => onUpdateSettings({ sound: !state.settings.sound })}
          >
            音: {state.settings.sound ? "ON" : "OFF"}
          </button>
          <label className="range-field">
            音楽{" "}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioMix.musicVolume}
              onChange={(event) =>
                setAudioMix("musicVolume", event.target.value)
              }
            />
            <output>{Math.round(audioMix.musicVolume * 100)}%</output>
          </label>
          <label className="range-field">
            効果音{" "}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioMix.sfxVolume}
              onChange={(event) => setAudioMix("sfxVolume", event.target.value)}
            />
            <output>{Math.round(audioMix.sfxVolume * 100)}%</output>
          </label>
          <label className="range-field">
            部屋の気配{" "}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioMix.ambienceVolume}
              onChange={(event) =>
                setAudioMix("ambienceVolume", event.target.value)
              }
            />
            <output>{Math.round(audioMix.ambienceVolume * 100)}%</output>
          </label>
          <div className="settings-actions">
            <button
              type="button"
              className="pixel-button"
              aria-pressed={surface.speed === 1}
              onClick={() =>
                setSurface((current) => ({ ...current, speed: 1 }))
              }
            >
              LIVE ×1
            </button>
            <button
              type="button"
              className="pixel-button"
              aria-pressed={surface.speed === 2}
              onClick={() =>
                setSurface((current) => ({ ...current, speed: 2 }))
              }
            >
              LIVE ×2
            </button>
            <button
              type="button"
              className="pixel-button"
              aria-pressed={surface.commentDensity === "compact"}
              onClick={() =>
                setSurface((current) => ({
                  ...current,
                  commentDensity:
                    current.commentDensity === "compact"
                      ? "standard"
                      : "compact",
                }))
              }
            >
              短文候補:{" "}
              {surface.commentDensity === "compact" ? "少なめ" : "標準"}
            </button>
          </div>
          <label className="text-field" htmlFor="notation">
            <span>数字の見せ方</span>
            <select
              id="notation"
              value={state.settings.numberNotation}
              onChange={(event) =>
                onUpdateSettings({ numberNotation: event.target.value })
              }
            >
              <option value="short">短縮</option>
              <option value="full">そのまま</option>
              <option value="scientific">指数</option>
            </select>
          </label>
          <small>
            音量・LIVE
            速度・短文候補は、この起動中だけの設定。保存スキーマは増やさない。
          </small>
        </section>
        <section className="settings-section settings-section--save pixel-frame">
          <p className="eyebrow">SAVE / RECOVERY</p>
          <h2>この端末の保存</h2>
          <p>
            自動保存:{" "}
            {surface.lastSavedAt
              ? `${formatTime(surface.lastSavedAt)} に保存を試行`
              : "まだ保存を試行していない"}{" "}
            · {surface.saveStatus}
          </p>
          {surface.saveProblem && (
            <p className="candidate-warning" role="alert">
              {surface.saveStatus}
            </p>
          )}
          <StateChip kind={environment.online ? "ready" : "offline"}>
            {environment.online ? "ONLINE / LOCAL" : "OFFLINE / LOCAL"}
          </StateChip>
          <div className="slot-list">
            {slots.map((slot) => {
              const action =
                save.slotAction?.index === slot.index ? save.slotAction : null;
              return (
                <article key={slot.index}>
                  <div>
                    <strong>スロット {slot.index + 1}</strong>
                    <small>
                      {slot.occupied
                        ? `旅 ${slot.journeyNumber} · BP ${slot.breakpoints} · SP ${slot.scalePeaks}`
                        : "EMPTY"}
                    </small>
                    {slot.backupAvailable && (
                      <small>
                        直前バックアップ: 旅 {slot.backupJourneyNumber} · BP{" "}
                        {slot.backupBreakpoints} · SP {slot.backupScalePeaks}
                      </small>
                    )}
                  </div>
                  <button
                    type="button"
                    className="pixel-button pixel-button--small"
                    onClick={() =>
                      slot.occupied
                        ? onRequestSlotAction("save", slot.index)
                        : onSaveSlot(slot.index)
                    }
                  >
                    {slot.occupied ? "上書きを確認" : "ここへ保存"}
                  </button>
                  {slot.occupied && (
                    <button
                      type="button"
                      className="pixel-button pixel-button--small"
                      onClick={() => onRequestSlotAction("load", slot.index)}
                    >
                      読み込みを確認
                    </button>
                  )}
                  {slot.backupAvailable && (
                    <button
                      type="button"
                      className="pixel-button pixel-button--small pixel-button--quiet"
                      onClick={() => onRequestSlotAction("restore", slot.index)}
                    >
                      直前の内容に戻す
                    </button>
                  )}
                  {action && (
                    <div className="confirm-strip">
                      <StateChip kind="pending">CONFIRM</StateChip>
                      <p>
                        {action.type === "save"
                          ? `現在の旅 ${state.progression.journeyNumber}を、旅 ${slot.journeyNumber}のスロットへ上書きする。今のスロットは直前バックアップに残す。`
                          : action.type === "load"
                            ? `現在の旅 ${state.progression.journeyNumber}を安全バックアップして、旅 ${slot.journeyNumber}を読み込む。`
                            : `スロットの旅 ${slot.journeyNumber}と、直前バックアップの旅 ${slot.backupJourneyNumber}を入れ替える。`}
                      </p>
                      <button
                        type="button"
                        className="pixel-button pixel-button--primary"
                        onClick={onConfirmSlotAction}
                      >
                        この内容で実行
                      </button>
                      <button
                        type="button"
                        className="pixel-button pixel-button--quiet"
                        onClick={() =>
                          setSurface((current) => ({
                            ...current,
                            save: { ...current.save, slotAction: null },
                          }))
                        }
                      >
                        やめる
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          <div className="save-row">
            <button
              type="button"
              className="pixel-button"
              onClick={onBuildExport}
            >
              エクスポート文を作る
            </button>
            <button
              type="button"
              className="pixel-button"
              disabled={!save.exportText}
              onClick={onDownloadExport}
            >
              JSON を保存
            </button>
          </div>
          {save.exportText && (
            <label className="text-field" htmlFor="export-text">
              <span>エクスポート内容（この端末で作成）</span>
              <textarea
                id="export-text"
                value={save.exportText}
                readOnly
                rows={4}
              />
            </label>
          )}
          <label className="text-field" htmlFor="import-text">
            <span>インポートする JSON（まず確認だけ）</span>
            <textarea
              id="import-text"
              value={save.importText}
              onChange={(event) => onImportText(event.target.value)}
              rows={5}
              placeholder="ここへ貼り付ける"
            />
          </label>
          {save.importText && (
            <div className="import-preview">
              <StateChip kind={save.importPreview?.ok ? "ready" : "error"}>
                {save.importPreview?.ok ? "VALID PREVIEW" : "INVALID"}
              </StateChip>
              {save.importPreview?.ok ? (
                <p>
                  形式 {save.importPreview.summary.source} · schema{" "}
                  {save.importPreview.summary.schema} · 出力日時{" "}
                  {save.importPreview.summary.exportedAt
                    ? formatTime(save.importPreview.summary.exportedAt)
                    : "記録なし"}{" "}
                  · 参加 {save.importPreview.summary.profileName} · 旅{" "}
                  {save.importPreview.summary.journeyNumber} · 人{" "}
                  {save.importPreview.summary.people} · 作品{" "}
                  {save.importPreview.summary.works}
                  。適用すると現在データはバックアップされる。
                </p>
              ) : (
                <p>
                  {save.importPreview?.errors?.join(" / ") ??
                    "JSON を確認できない。現在データは変更しない。"}
                </p>
              )}
              {save.importPreview?.ok &&
                (save.importArmed ? (
                  <div className="confirm-strip">
                    <button
                      type="button"
                      className="pixel-button pixel-button--primary"
                      onClick={onCommitImport}
                    >
                      確認して読み込む
                    </button>
                    <button
                      type="button"
                      className="pixel-button pixel-button--quiet"
                      onClick={() =>
                        setSurface((current) => ({
                          ...current,
                          save: { ...current.save, importArmed: false },
                        }))
                      }
                    >
                      やめる
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="pixel-button"
                    onClick={() =>
                      setSurface((current) => ({
                        ...current,
                        save: { ...current.save, importArmed: true },
                      }))
                    }
                  >
                    読み込みを確認する
                  </button>
                ))}
            </div>
          )}
          <div className="recovery-row">
            {save.backupPreview ? (
              <div className="confirm-strip">
                <StateChip kind="pending">BACKUP PREVIEW</StateChip>
                <p>
                  旅 {save.backupPreview.journeyNumber} · BP{" "}
                  {save.backupPreview.breakpoints} · SP{" "}
                  {save.backupPreview.scalePeaks} · 人{" "}
                  {save.backupPreview.people} · 作品 {save.backupPreview.works}
                  。現在データは安全バックアップしてから入れ替える。
                </p>
                <button
                  type="button"
                  className="pixel-button pixel-button--primary"
                  onClick={onConfirmBackup}
                >
                  このバックアップを復旧
                </button>
                <button
                  type="button"
                  className="pixel-button pixel-button--quiet"
                  onClick={() =>
                    setSurface((current) => ({
                      ...current,
                      save: { ...current.save, backupPreview: null },
                    }))
                  }
                >
                  やめる
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="pixel-button pixel-button--quiet"
                onClick={onPreviewBackup}
              >
                バックアップの内容を確認
              </button>
            )}
            {corruptSaves.map((entry) => (
              <button
                type="button"
                className="pixel-button pixel-button--quiet"
                key={entry.index}
                onClick={() => onDownloadCorrupt(entry.index)}
              >
                隔離した破損 JSON {entry.index + 1} を保存（
                {entry.bytes} bytes・
                {entry.durable ? "端末保存" : "この起動中のみ"}）
              </button>
            ))}
            {save.resetArmed ? (
              <>
                <p role="alert" data-pending-focus tabIndex={-1}>
                  主保存、バックアップ、3スロットとその直前版、隔離した破損 JSON
                  をすべて消す。実行後は復元できない。
                </p>
                <button
                  type="button"
                  className="pixel-button pixel-button--danger"
                  onClick={onReset}
                >
                  この端末の保存を消して最初から
                </button>
                <button
                  type="button"
                  className="pixel-button pixel-button--quiet"
                  onClick={() =>
                    setSurface((current) => ({
                      ...current,
                      save: { ...current.save, resetArmed: false },
                    }))
                  }
                >
                  やめる
                </button>
              </>
            ) : (
              <button
                type="button"
                className="pixel-button pixel-button--danger"
                onClick={() =>
                  setSurface((current) => ({
                    ...current,
                    save: { ...current.save, resetArmed: true },
                  }))
                }
              >
                保存を消す前に確認する
              </button>
            )}
          </div>
        </section>
        <section className="settings-section pixel-frame">
          <p className="eyebrow">PWA / STORAGE</p>
          <h2>この端末での状態</h2>
          <dl className="environment-list">
            <div>
              <dt>現在の版</dt>
              <dd>{environment.releaseVersion}</dd>
            </div>
            <div>
              <dt>公開種別</dt>
              <dd>{environment.releaseType}</dd>
            </div>
            <div>
              <dt>保存形式</dt>
              <dd>schema {environment.saveSchema}</dd>
            </div>
            <div>
              <dt>接続</dt>
              <dd>{environment.online ? "オンライン" : "オフライン"}</dd>
            </div>
            <div>
              <dt>オフラインシェル</dt>
              <dd>{environment.serviceWorker}</dd>
            </div>
            <div>
              <dt>更新</dt>
              <dd>{environment.update}</dd>
            </div>
            <div>
              <dt>保存域</dt>
              <dd>{environment.storage}</dd>
            </div>
            {(environment.updateReady || environment.updateCanReload) && (
              <>
                <div>
                  <dt>待機中の版</dt>
                  <dd>
                    {environment.updateVersion ?? "版番号を取得できない"}
                    {environment.updateType ? ` · ${environment.updateType}` : ""}
                  </dd>
                </div>
                <div>
                  <dt>切り替え</dt>
                  <dd>
                    {environment.updateReloadRequired
                      ? "安全保存後の再読み込みが必要"
                      : "再読み込みは不要"}
                  </dd>
                </div>
                <div>
                  <dt>セーブ移行</dt>
                  <dd>{environment.updateMigration}</dd>
                </div>
              </>
            )}
          </dl>
          <p>
            アカウント、クラウド同期、広告、課金、実在人物データは使わない。
          </p>
          {environment.updateReady && (
            <button
              type="button"
              className="pixel-button pixel-button--primary"
              onClick={onApplyUpdate}
            >
              安全保存して更新を適用
            </button>
          )}
          {environment.updateCanReload && (
            <button
              type="button"
              className="pixel-button pixel-button--gold"
              onClick={onReloadUpdate}
            >
              保存を確認して新しい版で開き直す
            </button>
          )}
          {(environment.updateReady || environment.updateCanReload) && (
            <small>
              配信中には適用しない。現在データの安全保存が成功した後だけ、あなたの操作で版を切り替える。
            </small>
          )}
        </section>
      </div>
    </PixelPage>
  );
}

export function App() {
  const initialLoadRef = useRef(null);
  if (!initialLoadRef.current)
    initialLoadRef.current = loadCurrentSaveWithStatus();
  const initialLoad = initialLoadRef.current;
  const initialRouteRef = useRef(null);
  if (!initialRouteRef.current)
    initialRouteRef.current = parseAppRoute(
      typeof window === "undefined" ? "" : window.location.hash,
    );
  const initialRoute = initialRouteRef.current;
  const [state, setState] = useState(() => initialLoad.state);
  const stateRef = useRef(state);
  const audioRef = useRef(null);
  const waitingWorkerRef = useRef(null);
  const navigationInvokerRef = useRef(null);
  const pendingInvokerRef = useRef(null);
  const pendingWasOpenRef = useRef(false);
  const focusRouteRef = useRef(false);
  const routeTransitionRef = useRef(null);
  const [profileName, setProfileName] = useState("");
  const [liveMessage, setLiveMessage] = useState(
    initialRoute.invalid
      ? "そのリンク先は見つからないため、部屋を開いた。"
      : "",
  );
  const [slots, setSlots] = useState(() => listCurrentSaveSlots());
  const [corruptSaves, setCorruptSaves] = useState(() =>
    listCurrentCorruptSaves(),
  );
  const [environment, setEnvironment] = useState({
    online: typeof navigator === "undefined" ? true : navigator.onLine,
    releaseVersion: CURRENT_RELEASE.version,
    releaseType: CURRENT_RELEASE.releaseType,
    saveSchema: CURRENT_RELEASE.saveSchema,
    serviceWorker: "確認中",
    update: "未確認",
    updateReady: false,
    updateCanReload: false,
    updateVersion: null,
    updateType: null,
    updateReloadRequired: false,
    updateMigration: "待機中の更新なし",
    storage: "確認中",
  });
  const [surface, setSurface] = useState({
    entryOpen: true,
    view: initialRoute.view,
    beforeOpen: false,
    preferredPlanId: "room-talk",
    paused: false,
    speed: 1,
    comment: COMMENT_OPTIONS[0],
    commentDensity: "standard",
    materialTitle: "今夜の場面",
    createTab: initialRoute.createTab ?? "video",
    progressTab: initialRoute.progressTab ?? "automation",
    libraryTab: initialRoute.libraryTab ?? "people",
    selectedPersonId: null,
    archiveFilter: "all",
    prestigeArmed: false,
    scaleArmed: false,
    strongNewGameArmed: false,
    leaveIntent: null,
    cue: null,
    lastSavedAt: null,
    saveStatus: initialLoad.recoveryRequired
      ? initialLoad.corruptPreserved
        ? "破損した主保存を隔離。復旧の確認待ち"
        : "破損した主保存を隔離できないため上書き停止中"
      : initialLoad.persisted
        ? "この端末に保存済み"
        : "この起動中のみ（未保存）",
    saveProblem: initialLoad.recoveryRequired,
    recoveryOpen: initialLoad.recoveryRequired,
    roomView: "current",
    audioMix: { musicVolume: 0.7, sfxVolume: 0.82, ambienceVolume: 0.45 },
    drafts: {
      videoTitle: "場面をつなぐ動画",
      singingFocus: "表現",
      singingTitle: "今日の歌の手がかり",
      musicTitle: "断片からできた曲",
      snsContext: "いま伝えたいこと",
      eventPurpose: "いまあるものを集める",
      eventTitle: "集めてひらいた場",
      bridgeFrom: "broadcast",
      bridgeTo: "video",
    },
    save: {
      exportText: "",
      importText: "",
      importPreview: null,
      importArmed: false,
      resetArmed: false,
      slotAction: null,
      backupPreview: null,
    },
  });
  const surfaceRef = useRef(surface);

  const refreshSlots = useCallback(() => {
    setSlots(listCurrentSaveSlots());
    setCorruptSaves(listCurrentCorruptSaves());
  }, []);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    surfaceRef.current = surface;
  }, [surface]);

  const handleSemanticEvents = useCallback((events, nextState) => {
    const audioEvents = mapCurrentGameEventsToAudio(events, nextState);
    if (audioEvents.length) audioRef.current?.handle(audioEvents, nextState);
    const chime = events.find((event) => event.type === "entry-chime");
    const notable =
      chime ??
      events.find((event) =>
        [
          "breakpoint-reached",
          "scale-peak-candidate",
          "prestige-complete",
          "completion-candidate-recorded",
          "offline-summary",
        ].includes(event.type),
      );
    if (notable) {
      const caption =
        notable.type === "entry-chime" ? "入室音" : eventText(notable);
      setSurface((current) => ({
        ...current,
        cue: { eventId: notable.id, caption, type: notable.type },
      }));
    }
  }, []);

  const commit = useCallback(
    (result) => {
      const now = Date.now();
      const previousPhase = stateRef.current.phase.kind;
      const saveResult = writeCurrentSaveWithStatus(result.state, undefined, {
        now,
      });
      const next = saveResult.state;
      if (next.phase.kind !== previousPhase) focusRouteRef.current = true;
      stateRef.current = next;
      setState(next);
      refreshSlots();
      setSurface((current) => ({
        ...current,
        lastSavedAt: saveResult.persisted ? now : current.lastSavedAt,
        saveStatus: persistenceStatus(saveResult, "この端末に保存した"),
        saveProblem: !saveResult.persisted,
      }));
      const messages = result.events.map(eventText).filter(Boolean);
      if (messages.length) setLiveMessage(messages.slice(-2).join(" "));
      handleSemanticEvents(result.events, next);
      if (next.phase.kind === "completion")
        routeTransitionRef.current?.("progress", {
          history: "replace",
          route: { progressTab: "completion" },
        });
      return next;
    },
    [handleSemanticEvents, refreshSlots],
  );

  useEffect(() => {
    const saved = stateRef.current;
    const director = createCurrentAudioDirector({
      lineageId: saved.lineageId,
      playedEntryLineages: saved.meta.firstArrivalChimeHeard
        ? [saved.lineageId]
        : [],
      onEntryPlayback: () => {
        const snapshot = stateRef.current;
        if (snapshot.meta.firstArrivalChimeHeard) return;
        commit(
          runCommand(
            snapshot,
            { type: "ACK_ENTRY_CHIME_PLAYED" },
            { now: Date.now() },
          ),
        );
      },
    });
    audioRef.current = director;

    if (
      saved.meta.firstArrivalChimePlayed &&
      !saved.meta.firstArrivalChimeHeard
    ) {
      const recorded = [...saved.recentEvents, ...saved.history]
        .reverse()
        .find((event) => event.type === "entry-chime");
      const pendingEvent = recorded ?? {
        type: "entry-chime",
        id: `entry-chime-replay-${saved.lineageId}`,
        audioKey: "entry-chime-canonical",
      };
      director.handle(
        mapCurrentGameEventsToAudio([pendingEvent], saved),
        saved,
      );
    }

    return () => {
      audioRef.current = null;
      void director.destroy();
    };
  }, [commit]);

  const sendCommand = useCallback(
    (command) => {
      void audioRef.current?.unlock();
      return commit(runCommand(stateRef.current, command, { now: Date.now() }));
    },
    [commit],
  );

  const reconcileOffline = useCallback(() => {
    if (surface.recoveryOpen) return;
    const snapshot = stateRef.current;
    if (snapshot.profile.status !== "ready") return;
    const elapsed = Math.floor(
      Math.max(0, Date.now() - snapshot.clock.lastAdvancedAt) / 1000,
    );
    if (elapsed < 2) return;
    commit(advanceGame(snapshot, elapsed, { now: Date.now(), offline: true }));
  }, [commit, surface.recoveryOpen]);

  useEffect(() => {
    reconcileOffline();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") reconcileOffline();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [reconcileOffline]);

  useEffect(() => {
    audioRef.current?.setSettings({
      sound: state.settings.sound,
      muted: !state.settings.sound,
      reducedMotion: state.settings.reducedMotion,
      ...surface.audioMix,
    });
  }, [state.settings.reducedMotion, state.settings.sound, surface.audioMix]);

  useEffect(() => {
    const scene =
      state.phase.kind === "broadcast-live"
        ? "BROADCAST"
        : surface.view === "create" && surface.createTab === "liveEvent"
          ? "LIVE_EVENT"
          : "ROOM";
    audioRef.current?.setScene(scene);
  }, [state.phase.kind, surface.createTab, surface.view]);

  useEffect(() => {
    if (state.phase.kind !== "broadcast-live") {
      setSurface((current) =>
        current.paused ? { ...current, paused: false } : current,
      );
      return undefined;
    }
    if (surface.paused) return undefined;
    const timer = window.setInterval(() => {
      const snapshot = stateRef.current;
      if (snapshot.phase.kind !== "broadcast-live") return;
      commit(
        advanceGame(snapshot, surface.speed, {
          now: snapshot.clock.now + surface.speed,
        }),
      );
    }, 1000);
    return () => window.clearInterval(timer);
  }, [commit, state.phase.kind, surface.paused, surface.speed]);

  useEffect(() => {
    let cancelled = false;
    let registration = null;
    let watchedInstalling = null;
    const onInstallingState = () => void refreshEnvironment();
    const watchInstalling = (worker) => {
      if (watchedInstalling === worker) return;
      watchedInstalling?.removeEventListener("statechange", onInstallingState);
      watchedInstalling = worker;
      watchedInstalling?.addEventListener("statechange", onInstallingState);
    };
    const onUpdateFound = () => {
      watchInstalling(registration?.installing ?? null);
      void refreshEnvironment();
    };
    const bindRegistration = (next) => {
      if (registration === next) return;
      registration?.removeEventListener("updatefound", onUpdateFound);
      registration = next;
      registration?.addEventListener("updatefound", onUpdateFound);
      watchInstalling(registration?.installing ?? null);
    };
    const refreshEnvironment = async () => {
      let storage = "利用量を確認できない";
      try {
        const estimate = await navigator.storage?.estimate?.();
        if (estimate?.usage != null)
          storage = `${Math.round(estimate.usage / 1024)} KB 使用`;
      } catch {
        storage = "ブラウザにより確認できない";
      }
      let serviceWorker = "対応なし";
      let update = "未確認";
      let updateMetadata = null;
      try {
        if ("serviceWorker" in navigator) {
          const currentRegistration =
            await navigator.serviceWorker.getRegistration();
          bindRegistration(currentRegistration ?? null);
          waitingWorkerRef.current = currentRegistration?.waiting ?? null;
          updateMetadata = await requestUpdateMetadata(
            currentRegistration?.waiting ?? null,
          );
          serviceWorker = navigator.serviceWorker.controller
            ? "有効"
            : currentRegistration
              ? "待機中"
              : "未登録";
          update = currentRegistration?.waiting
            ? updateMetadata
              ? `更新待ち · ${updateMetadata.version}`
              : "更新待ち・版情報は取得できない"
            : currentRegistration
              ? "最新版を確認中"
              : "未登録";
        }
      } catch {
        serviceWorker = "状態を確認できない";
      }
      if (!cancelled)
        setEnvironment((current) => {
          const keepActivatedMetadata =
            current.updateCanReload && !waitingWorkerRef.current;
          const metadata =
            updateMetadata ??
            (keepActivatedMetadata
              ? {
                  version: current.updateVersion,
                  releaseType: current.updateType,
                  requiresReload: current.updateReloadRequired,
                  migration: { summary: current.updateMigration },
                }
              : null);
          return {
            ...current,
            online: navigator.onLine,
            serviceWorker,
            update: current.updateCanReload ? current.update : update,
            updateReady: Boolean(waitingWorkerRef.current),
            updateVersion: metadata?.version ?? null,
            updateType: metadata?.releaseType ?? null,
            updateReloadRequired: Boolean(metadata?.requiresReload),
            updateMigration:
              metadata?.migration?.summary ?? "待機中の更新なし",
            storage,
          };
        });
    };
    void refreshEnvironment();
    if ("serviceWorker" in navigator)
      void navigator.serviceWorker.ready.then(() => refreshEnvironment()).catch(() => {});
    const online = () =>
      setEnvironment((current) => ({ ...current, online: true }));
    const offline = () =>
      setEnvironment((current) => ({ ...current, online: false }));
    const afterLoad = () => window.setTimeout(() => void refreshEnvironment(), 250);
    const controllerChanged = () => void refreshEnvironment();
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    window.addEventListener("load", afterLoad);
    navigator.serviceWorker?.addEventListener(
      "controllerchange",
      controllerChanged,
    );
    return () => {
      cancelled = true;
      registration?.removeEventListener("updatefound", onUpdateFound);
      watchedInstalling?.removeEventListener("statechange", onInstallingState);
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
      window.removeEventListener("load", afterLoad);
      navigator.serviceWorker?.removeEventListener(
        "controllerchange",
        controllerChanged,
      );
    };
  }, []);

  const summary = useMemo(() => getProgressSummary(state), [state]);
  const intent = useMemo(() => currentIntent(state), [state]);
  const appClass = [
    "current-app",
    state.settings.reducedMotion ? "reduce-motion" : "",
    state.settings.highContrast ? "high-contrast" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const navigate = useCallback((view, options = {}) => {
    const current = surfaceRef.current;
    const liveActive = stateRef.current.phase.kind === "broadcast-live";
    if (
      liveActive &&
      current.view === "room" &&
      view !== "room" &&
      !options.allowDuringLive
    ) {
      if (typeof document !== "undefined")
        pendingInvokerRef.current = document.activeElement;
      const guarded = {
        ...current,
        leaveIntent: { view, route: options.route ?? null },
      };
      surfaceRef.current = guarded;
      focusRouteRef.current = true;
      setSurface(guarded);
      setLiveMessage(
        "LIVE の参加と順番を捨てない移動方法を選んでね。",
      );
      return false;
    }
    if (typeof document !== "undefined")
      navigationInvokerRef.current = document.activeElement;
    const next = {
      ...current,
      ...options.route,
      view,
      beforeOpen: view === "room" ? current.beforeOpen : false,
      prestigeArmed: false,
      scaleArmed: false,
      strongNewGameArmed: false,
      leaveIntent: null,
      ...options.surface,
      save: {
        ...current.save,
        ...options.surface?.save,
        importArmed: false,
        resetArmed: false,
        slotAction: null,
        backupPreview: null,
      },
    };
    surfaceRef.current = next;
    focusRouteRef.current = true;
    setSurface(next);
    if (typeof window !== "undefined" && options.history !== "none") {
      const method =
        options.history === "replace" ? "replaceState" : "pushState";
      window.history[method](null, "", appRouteHash(next));
    }
    return true;
  }, []);
  routeTransitionRef.current = navigate;

  const pendingSurfaceOpen = Boolean(
    surface.beforeOpen ||
      surface.prestigeArmed ||
      surface.scaleArmed ||
      surface.strongNewGameArmed ||
      surface.save.importArmed ||
      surface.save.resetArmed ||
      surface.save.slotAction ||
      surface.save.backupPreview ||
      surface.leaveIntent,
  );

  useEffect(() => {
    const wasOpen = pendingWasOpenRef.current;
    pendingWasOpenRef.current = pendingSurfaceOpen;
    if (!wasOpen && pendingSurfaceOpen) {
      if (focusRouteRef.current) return undefined;
      const frame = window.requestAnimationFrame(() => {
        const explicit = [...document.querySelectorAll("[data-pending-focus]")]
          .reverse()
          .find((element) => element instanceof HTMLElement && element.offsetParent);
        const strip = [...document.querySelectorAll(".confirm-strip")]
          .reverse()
          .find((element) => element instanceof HTMLElement && element.offsetParent);
        const target = explicit ?? strip?.querySelector("button");
        if (target instanceof HTMLElement) target.focus({ preventScroll: true });
      });
      return () => window.cancelAnimationFrame(frame);
    }
    if (!wasOpen || pendingSurfaceOpen || focusRouteRef.current) return undefined;
    const frame = window.requestAnimationFrame(() => {
      pendingInvokerRef.current?.focus?.({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pendingSurfaceOpen]);

  useEffect(() => {
    if (!focusRouteRef.current) return undefined;
    focusRouteRef.current = false;
    const frame = window.requestAnimationFrame(() => {
      const target = document.querySelector(
        surface.entryOpen
          ? "[data-entry-focus]"
          : surface.leaveIntent
            ? "[data-pending-focus]"
            : "[data-route-focus]",
      );
      if (target instanceof HTMLElement) target.focus({ preventScroll: true });
      else {
        const fallback = document.querySelector(
          `[data-nav-view="${surface.view}"]`,
        );
        if (fallback instanceof HTMLElement)
          fallback.focus({ preventScroll: true });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [
    surface.beforeOpen,
    surface.createTab,
    surface.entryOpen,
    surface.libraryTab,
    surface.leaveIntent,
    surface.progressTab,
    surface.recoveryOpen,
    surface.view,
    state.phase.kind,
  ]);

  useEffect(() => {
    if (surface.entryOpen || typeof window === "undefined") return;
    const expected = appRouteHash(surface);
    if (window.location.hash !== expected)
      window.history.replaceState(null, "", expected);
  }, [
    surface.createTab,
    surface.entryOpen,
    surface.libraryTab,
    surface.progressTab,
    surface.view,
  ]);

  useEffect(() => {
    const onPopState = () => {
      const route = parseAppRoute(window.location.hash);
      const liveActive = stateRef.current.phase.kind === "broadcast-live";
      if (liveActive && route.view !== "room") {
        setLiveMessage(
          "システムの戻る操作を保留。LIVE を保つ方法を選べる。",
        );
        window.history.pushState(null, "", "#room");
        navigate(route.view, { history: "none", route });
        return;
      }
      navigate(route.view, { history: "none", route });
      if (route.invalid)
        setLiveMessage("そのリンク先は見つからないため、部屋を開いた。");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [navigate]);

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key !== "Escape" || surfaceRef.current.entryOpen) return;
      const openDetails = [...document.querySelectorAll("details[open]")].pop();
      if (openDetails instanceof HTMLDetailsElement) {
        event.preventDefault();
        openDetails.open = false;
        openDetails.querySelector("summary")?.focus();
        return;
      }
      const current = surfaceRef.current;
      const hasPending =
        current.beforeOpen ||
        current.prestigeArmed ||
        current.scaleArmed ||
        current.strongNewGameArmed ||
        current.save.importArmed ||
        current.save.resetArmed ||
        current.save.slotAction ||
        current.save.backupPreview ||
        current.leaveIntent;
      if (hasPending) {
        event.preventDefault();
        setSurface((value) => ({
          ...value,
          beforeOpen: false,
          prestigeArmed: false,
          scaleArmed: false,
          strongNewGameArmed: false,
          leaveIntent: null,
          save: {
            ...value.save,
            importArmed: false,
            resetArmed: false,
            slotAction: null,
            backupPreview: null,
          },
        }));
        pendingInvokerRef.current?.focus?.({ preventScroll: true });
        return;
      }
      if (current.view !== "room") {
        event.preventDefault();
        navigate("room");
      } else if (stateRef.current.phase.kind === "broadcast-live") {
        setLiveMessage(
          "LIVE は Escape だけでは閉じない。終了後の要約まで進めてね。",
        );
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [navigate]);
  const prepareBroadcast = (planId) => {
    if (typeof document !== "undefined")
      navigationInvokerRef.current = document.activeElement;
    focusRouteRef.current = true;
    setSurface((current) => ({
      ...current,
      beforeOpen: true,
      preferredPlanId: planId,
    }));
  };
  const choosePlan = (planId) => {
    const next = sendCommand({ type: "BROADCAST_BEFORE", planId });
    if (next.phase.kind === "broadcast-before")
      navigate("room", {
        history: "replace",
        surface: { beforeOpen: false, paused: false },
      });
  };
  const updateSettings = (settings) =>
    sendCommand({ type: "UPDATE_SETTINGS", settings });

  const applyWaitingUpdate = () => {
    const activeBroadcast = [
      "broadcast-before",
      "broadcast-live",
      "broadcast-after",
    ].includes(stateRef.current.phase.kind);
    if (activeBroadcast) {
      setEnvironment((current) => ({
        ...current,
        update: "配信を閉じた後に更新できる",
      }));
      setLiveMessage(
        "更新は待機中。配信を閉じて安全保存した後にだけ適用できる。",
      );
      return;
    }
    const worker = waitingWorkerRef.current;
    if (!worker) {
      setEnvironment((current) => ({
        ...current,
        update: "待機中の更新は見つからない",
        updateReady: false,
      }));
      return;
    }
    const now = Date.now();
    const saved = writeCurrentSaveWithStatus(stateRef.current, undefined, {
      now,
    });
    if (!saved.persisted || saved.recoverySafe === false) {
      setSurface((current) => ({
        ...current,
        lastSavedAt: current.lastSavedAt,
        saveStatus: persistenceStatus(saved, "更新前の安全保存を作成した"),
        saveProblem: true,
      }));
      setEnvironment((current) => ({
        ...current,
        update: "安全保存に失敗したため適用していない",
      }));
      return;
    }

    stateRef.current = saved.state;
    setState(saved.state);
    refreshSlots();
    const markActivated = () => {
      if (worker.state !== "activated") return;
      worker.removeEventListener("statechange", markActivated);
      waitingWorkerRef.current = null;
      setEnvironment((current) => ({
        ...current,
        update: "新しい版の準備完了。開き直しはまだしていない",
        updateReady: false,
        updateCanReload: true,
      }));
    };
    worker.addEventListener("statechange", markActivated);
    try {
      worker.postMessage({ type: "APPLY_UPDATE" });
      setSurface((current) => ({
        ...current,
        lastSavedAt: now,
        saveStatus: "更新前の安全バックアップを保存した",
        saveProblem: false,
      }));
      setEnvironment((current) => ({
        ...current,
        update: "安全保存済み。新しい版を準備中",
        updateReady: false,
      }));
      markActivated();
    } catch {
      worker.removeEventListener("statechange", markActivated);
      setEnvironment((current) => ({
        ...current,
        update: "更新の適用要求に失敗。現在の版を継続中",
        updateReady: true,
      }));
    }
  };

  const reloadIntoUpdate = () => {
    const now = Date.now();
    const saved = writeCurrentSaveWithStatus(stateRef.current, undefined, {
      now,
    });
    if (!saved.persisted || saved.recoverySafe === false) {
      setSurface((current) => ({
        ...current,
        saveStatus: persistenceStatus(saved, "開き直す前に保存した"),
        saveProblem: true,
      }));
      setEnvironment((current) => ({
        ...current,
        update: "再読み込み前の保存に失敗。現在の版を継続中",
      }));
      return;
    }
    window.location.reload();
  };

  const adoptPersistedState = (next, status, now = Date.now()) => {
    stateRef.current = next;
    setState(next);
    refreshSlots();
    navigate("room", {
      history: "replace",
      surface: {
        entryOpen: false,
        recoveryOpen: false,
        roomView: "current",
        lastSavedAt: now,
        saveStatus: status,
        saveProblem: false,
      },
    });
  };
  const replaceSaveState = (next, status, semantic = "RECOVERY_RESULT") => {
    const now = Date.now();
    const result = writeCurrentSaveWithStatus(next, undefined, { now });
    if (!result.persisted) {
      setSurface((current) => ({
        ...current,
        saveStatus: persistenceStatus(result, status),
        saveProblem: true,
        save: {
          ...current.save,
          slotAction: null,
          backupPreview: null,
        },
      }));
      return false;
    }
    adoptPersistedState(result.state, status, now);
    handleSemanticEvents([{ type: semantic, id: `ui-${now}` }], result.state);
    return true;
  };
  const saveSlot = (index) => {
    const now = Date.now();
    const result = writeCurrentSaveSlotWithStatus(
      stateRef.current,
      index,
      undefined,
      {
        now,
      },
    );
    refreshSlots();
    setSurface((current) => ({
      ...current,
      lastSavedAt: result.persisted ? now : current.lastSavedAt,
      saveStatus: persistenceStatus(result, `スロット ${index + 1} に保存した`),
      saveProblem: !result.persisted,
      save: { ...current.save, slotAction: null },
    }));
    if (result.persisted)
      handleSemanticEvents(
        [{ type: "SAVE_OK", id: `slot-${index}-${now}` }],
        stateRef.current,
      );
  };
  const requestSlotAction = (type, index) =>
    setSurface((current) => ({
      ...current,
      save: { ...current.save, slotAction: { type, index } },
    }));
  const confirmSlotAction = () => {
    const action = surface.save.slotAction;
    if (!action) return;
    if (action.type === "save") {
      saveSlot(action.index);
      return;
    }
    if (action.type === "load") {
      const loaded = loadCurrentSaveSlot(action.index);
      if (loaded)
        replaceSaveState(loaded, `スロット ${action.index + 1} を読み込んだ`);
      else
        setSurface((current) => ({
          ...current,
          saveStatus: "スロットを読み込めない。現在データは変更していない。",
          saveProblem: true,
          save: { ...current.save, slotAction: null },
        }));
      return;
    }
    if (action.type === "restore") {
      const result = restoreCurrentSaveSlotBackup(action.index, undefined, {
        now: Date.now(),
      });
      refreshSlots();
      setSurface((current) => ({
        ...current,
        saveStatus:
          result.ok && result.persisted
            ? `スロット ${action.index + 1} の直前バックアップを復旧した`
            : "スロットの復旧に失敗。現在データは読み込んでいない。",
        saveProblem: !(result.ok && result.persisted),
        save: { ...current.save, slotAction: null },
      }));
    }
  };
  const buildExport = () =>
    setSurface((current) => ({
      ...current,
      save: {
        ...current.save,
        exportText: exportCurrentSave(stateRef.current, { now: Date.now() }),
      },
    }));
  const downloadJson = (text, filename) => {
    if (!text || typeof document === "undefined") return;
    const url = URL.createObjectURL(
      new Blob([text], { type: "application/json" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };
  const downloadExport = () =>
    downloadJson(surface.save.exportText, "sakiya-creator-save.json");
  const downloadCorrupt = (index) =>
    downloadJson(
      exportCurrentCorruptSave(index),
      `sakiya-corrupt-primary-${index + 1}.json`,
    );
  const setImportText = (text) =>
    setSurface((current) => ({
      ...current,
      save: {
        ...current.save,
        importText: text,
        importPreview: previewCurrentImport(text),
        importArmed: false,
      },
    }));
  const commitImport = () => {
    const result = importCurrentSave(surface.save.importText, undefined, {
      now: Date.now(),
    });
    if (result.ok && result.committed && result.persisted)
      adoptPersistedState(
        result.state,
        "インポートを安全バックアップ後に読み込んだ",
      );
    else
      setSurface((current) => ({
        ...current,
        saveStatus: result.ok
          ? persistenceStatus(result, "インポートを読み込んだ")
          : "インポートできない。現在データは変更しない。",
        saveProblem: true,
      }));
  };
  const previewBackup = () => {
    const backup = loadCurrentBackup();
    if (backup)
      setSurface((current) => ({
        ...current,
        save: {
          ...current.save,
          backupPreview: {
            journeyNumber: backup.progression.journeyNumber,
            breakpoints: backup.receipts.breakpoints.length,
            scalePeaks: backup.receipts.scalePeaks.length,
            people: backup.people.known.length,
            works: backup.works.length,
          },
        },
      }));
    else
      setSurface((current) => ({
        ...current,
        saveStatus: "復旧できるバックアップはない",
        saveProblem: true,
      }));
  };
  const confirmBackup = () => {
    const backup = loadCurrentBackup();
    if (backup) replaceSaveState(backup, "バックアップを復旧した");
    else
      setSurface((current) => ({
        ...current,
        saveStatus: "復旧できるバックアップはない",
        saveProblem: true,
        save: { ...current.save, backupPreview: null },
      }));
  };
  const resetSave = () => {
    const result = resetCurrentSaveWithStatus();
    if (!result.persisted) {
      setSurface((current) => ({
        ...current,
        saveStatus: result.recoverySafe
          ? "端末の保存を消去できなかった。削除済みの内容は元へ戻し、現在の状態は変えていない。"
          : "前回の消去中断を安全に復旧できないため停止した。タブを閉じず、現在表示中の JSON を保存してね。",
        saveProblem: true,
        save: { ...current.save, resetArmed: false },
      }));
      return;
    }
    stateRef.current = result.state;
    setState(result.state);
    refreshSlots();
    focusRouteRef.current = true;
    setSurface((current) => ({
      ...current,
      entryOpen: true,
      recoveryOpen: false,
      view: "room",
      roomView: "current",
      lastSavedAt: null,
      saveStatus:
        "主保存・バックアップ・3スロット・隔離JSONを消去。復元はできない。",
      saveProblem: false,
      save: {
        ...current.save,
        resetArmed: false,
        importArmed: false,
        slotAction: null,
        backupPreview: null,
      },
    }));
  };
  const confirmStartupRecovery = () =>
    replaceSaveState(
      stateRef.current,
      "バックアップを主保存として復旧した",
      "RECOVERY_RESULT",
    );

  let roomSurface = null;
  if (state.phase.kind === "room")
    roomSurface = surface.beforeOpen ? (
      <BeforeChoices
        state={state}
        preferredPlanId={surface.preferredPlanId}
        onChoosePlan={choosePlan}
        onCancel={() =>
          setSurface((current) => ({ ...current, beforeOpen: false }))
        }
      />
    ) : (
      <ActivityHome
        state={state}
        intent={intent}
        roomView={surface.roomView}
        onRoomView={(roomView) =>
          setSurface((current) => ({ ...current, roomView }))
        }
        onPrepare={prepareBroadcast}
        onCreateVideo={() =>
          sendCommand({
            type: "CREATE_VIDEO",
            title: surface.drafts.videoTitle,
          })
        }
        onNavigate={navigate}
      />
    );
  else if (state.phase.kind === "broadcast-before")
    roomSurface = (
      <BroadcastBefore
        state={state}
        onStartLive={() => sendCommand({ type: "BROADCAST_LIVE" })}
      />
    );
  else if (state.phase.kind === "broadcast-live")
    roomSurface = (
      <BroadcastLive
        state={state}
        surface={surface}
        setSurface={setSurface}
        onCommand={sendCommand}
      />
    );
  else if (state.phase.kind === "broadcast-after")
    roomSurface = (
      <BroadcastAfter
        state={state}
        surface={surface}
        setSurface={setSurface}
        onPreserve={(title) => sendCommand({ type: "PRESERVE_MOMENT", title })}
      />
    );
  else if (state.phase.kind === "completion")
    roomSurface = (
      <section className="room-panel pixel-frame">
        <p className="eyebrow">COMPLETION CANDIDATE</p>
        <h2>続き方を選べる</h2>
        <p>人・作品・履歴の証拠を残した候補。公開や最終承認ではない。</p>
        <button
          type="button"
          className="pixel-button pixel-button--primary"
          onClick={() => navigate("progress")}
        >
          続きの候補を見る
        </button>
      </section>
    );

  let page = null;
  if (surface.view === "create")
    page = (
      <CreateScreen
        state={state}
        surface={surface}
        setSurface={setSurface}
        onCommand={sendCommand}
        onRoom={(options) => navigate("room", options)}
        onRoute={navigate}
      />
    );
  if (surface.view === "connections")
    page = (
      <ConnectionsScreen
        state={state}
        surface={surface}
        setSurface={setSurface}
        onCommand={sendCommand}
        onRoom={() => navigate("room")}
      />
    );
  if (surface.view === "progress")
    page = (
      <ProgressScreen
        state={state}
        summary={summary}
        surface={surface}
        setSurface={setSurface}
        onCommand={sendCommand}
        onRoom={(options) => navigate("room", options)}
        onRoute={navigate}
      />
    );
  if (surface.view === "library")
    page = (
      <LibraryScreen
        state={state}
        summary={summary}
        surface={surface}
        setSurface={setSurface}
        onCommand={sendCommand}
        onRoom={(options) => navigate("room", options)}
        onRoute={navigate}
      />
    );
  if (surface.view === "settings")
    page = (
      <SettingsScreen
        state={state}
        surface={surface}
        setSurface={setSurface}
        slots={slots}
        corruptSaves={corruptSaves}
        environment={environment}
        onUpdateSettings={updateSettings}
        onSaveSlot={saveSlot}
        onRequestSlotAction={requestSlotAction}
        onConfirmSlotAction={confirmSlotAction}
        onBuildExport={buildExport}
        onDownloadExport={downloadExport}
        onImportText={setImportText}
        onCommitImport={commitImport}
        onPreviewBackup={previewBackup}
        onConfirmBackup={confirmBackup}
        onDownloadCorrupt={downloadCorrupt}
        onApplyUpdate={applyWaitingUpdate}
        onReloadUpdate={reloadIntoUpdate}
        onReset={resetSave}
        onRoom={() => navigate("room")}
      />
    );

  return (
    <main
      className={appClass}
      style={{ "--ui-font-scale": state.settings.fontScale }}
      aria-describedby="visual-candidate-note"
      onClickCapture={(event) => {
        if (pendingSurfaceOpen) return;
        const control = event.target.closest?.("button, summary, input, select");
        if (control instanceof HTMLElement) pendingInvokerRef.current = control;
      }}
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>
      {surface.cue && state.settings.captions && (
        <div className="cue-caption" role="status">
          <span aria-hidden="true">
            {surface.cue.type === "entry-chime" ? "♪" : "✦"}
          </span>
          {surface.cue.caption}
        </div>
      )}
      {surface.saveProblem && !surface.recoveryOpen && (
        <div className="save-alert pixel-frame" role="alert">
          <div>
            <strong>端末に保存できていない</strong>
            <small>{surface.saveStatus}</small>
          </div>
          <button
            type="button"
            className="pixel-button pixel-button--small"
            onClick={() => navigate("settings")}
          >
            復旧と JSON 保存を確認
          </button>
        </div>
      )}
      <section
        className="room-stage"
        aria-label="いつもの部屋から活動を進める画面"
      >
        <img
          className="room-stage__image"
          src={ROOM_IMAGE}
          alt="八乙女さきやの候補ビジュアル。ピンクの乱れた左右非対称の結び髪、黒い眼鏡と小さな牙、ピアス、ピンクの裏地とストラップのある黒いオーバーサイズフーディーを着た細身の成人男性が、ピンクの豚のマスコット、ぶー子とPC机にいる、粗い8-bit風の夜の部屋。最終採用前の候補。"
        />
        <div className="room-stage__shade" aria-hidden="true" />
        <RoomUnitArtifacts
          unitId={state.progression.currentUnit}
          dayOne={surface.roomView === "day-one"}
        />
        <div className="pixel-stars pixel-stars--window" aria-hidden="true" />
        <div className="pixel-stars pixel-stars--monitor" aria-hidden="true" />
        <div className="face-safe-zone" aria-hidden="true" />
        <ActivityHeader
          state={state}
          summary={summary}
          onUpdateSettings={updateSettings}
        />
        {surface.recoveryOpen ? (
          <StartupRecoveryGate
            load={initialLoad}
            state={state}
            surface={surface}
            setSurface={setSurface}
            corruptSaves={corruptSaves}
            onConfirm={confirmStartupRecovery}
            onDownloadCorrupt={downloadCorrupt}
            onReset={resetSave}
            onBeginFresh={() => {
              focusRouteRef.current = true;
              setSurface((current) => ({
                ...current,
                recoveryOpen: false,
                entryOpen: true,
                saveProblem: false,
                saveStatus: "破損原文を隔離したまま、新規開始を選択",
              }));
            }}
          />
        ) : surface.entryOpen ? (
          <LaunchGate
            state={state}
            profileName={profileName}
            setProfileName={setProfileName}
            onCreateProfile={(name) => {
              sendCommand({ type: "PROFILE", displayName: name });
              focusRouteRef.current = true;
              setSurface((current) => ({ ...current, entryOpen: false }));
            }}
            onSkipProfile={() => {
              sendCommand({ type: "SKIP_PROFILE" });
              focusRouteRef.current = true;
              setSurface((current) => ({ ...current, entryOpen: false }));
            }}
            onContinue={() => {
              focusRouteRef.current = true;
              setSurface((current) => ({ ...current, entryOpen: false }));
            }}
          />
        ) : surface.leaveIntent && state.phase.kind === "broadcast-live" ? (
          <LiveLeaveSafeguard
            intent={surface.leaveIntent}
            onResume={() => {
              focusRouteRef.current = true;
              setSurface((current) => ({ ...current, leaveIntent: null }));
            }}
            onPauseAndOpen={() => {
              const pending = surfaceRef.current.leaveIntent;
              if (!pending) return;
              navigate(pending.view, {
                route: pending.route ?? undefined,
                allowDuringLive: true,
                surface: { paused: true, leaveIntent: null },
              });
              setLiveMessage(
                "LIVE を意味の境目で一時停止。部屋に戻ると再開できる。",
              );
            }}
            onSummarize={() => {
              setSurface((current) => ({ ...current, leaveIntent: null }));
              sendCommand({ type: "BROADCAST_AFTER" });
            }}
          />
        ) : surface.view === "room" ? (
          roomSurface
        ) : (
          <div className="room-stage__away-note pixel-frame">
            <p className="eyebrow">ROOM STILL HERE</p>
            <strong>部屋に戻ると、いまの意図と人の気配が待っている。</strong>
          </div>
        )}
      </section>
      {!surface.entryOpen && (
        <>
          <RootNavigation
            active={surface.view}
            phase={state.phase.kind}
            onNavigate={navigate}
          />
          {surface.view === "room" ? (
            <DurableEvidence
              state={state}
              summary={summary}
              onPeople={() =>
                navigate("library", { route: { libraryTab: "people" } })
              }
              onArchive={() =>
                navigate("library", { route: { libraryTab: "archive" } })
              }
            />
          ) : (
            page
          )}
        </>
      )}
    </main>
  );
}
