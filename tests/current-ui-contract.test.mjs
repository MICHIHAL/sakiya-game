import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const appPath = new URL("../src/App.jsx", import.meta.url);
const stylesPath = new URL("../src/styles.css", import.meta.url);
const publicPath = new URL("../public/", import.meta.url);
const packagePath = new URL("../package.json", import.meta.url);
const serviceWorkerPath = new URL("../public/sw.js", import.meta.url);

test("current App statically wires the repaired save, audio, bridge, and completion seams", async () => {
  const app = await readFile(appPath, "utf8");

  for (const required of [
    "loadCurrentSaveWithStatus",
    "writeCurrentSaveWithStatus",
    "writeCurrentSaveSlotWithStatus",
    "resetCurrentSaveWithStatus",
    "restoreCurrentSaveSlotBackup",
    "blockedByBackupFailure",
    "StartupRecoveryGate",
    "onEntryPlayback",
    "firstArrivalChimeHeard",
    "ACK_ENTRY_CHIME_PLAYED",
    "sourceWorkId: sourceWork.id",
    "FINAL_ANCHOR_BROADCAST",
    "RECORD_COMPLETION_CHOICE",
    "summary.completion",
    "CURRENT_RELEASE",
    "GET_UPDATE_METADATA",
    "updateMigration",
  ]) {
    assert.match(
      app,
      new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      required,
    );
  }

  assert.doesNotMatch(app, /\bwriteCurrentSave\(/);
  assert.doesNotMatch(app, /\bwriteCurrentSaveSlot\(/);
  assert.doesNotMatch(app, /\bresetCurrentSave\(/);
  assert.doesNotMatch(
    app,
    /playedEntryLineages:\s*saved\.meta\.firstArrivalChimePlayed/,
  );
  assert.match(app, /slot\.occupied\s*\?\s*onRequestSlotAction\("save"/);
  assert.match(app, /backupPreview/);
  assert.match(app, /role="alert"/);
  assert.match(
    app,
    /<CompletionPanel[\s\S]{0,420}onRoom=\{onRoom\}/,
    "completion route must receive the central Room transition",
  );
});

test("current public package sources contain only the active coarse 8-bit identity", async () => {
  const files = await readdir(publicPath);
  assert.ok(files.includes("icon-8bit-192.png"));
  assert.ok(files.includes("icon-8bit-512.png"));
  for (const rejected of [
    "icon-192.png",
    "icon-512.png",
    "icon-pixel-192.png",
    "icon-pixel-512.png",
  ]) {
    assert.ok(
      !files.includes(rejected),
      `${rejected} must stay outside public`,
    );
  }

  const currentAssets = await readdir(
    new URL("../public/assets/current/", import.meta.url),
  );
  assert.deepEqual(
    currentAssets.sort(),
    [
      "activity-home-8bit-coarse-v3.png",
      "app-icon-8bit-master-v2.png",
      "audio-assets.json",
      "entry-chime.wav",
    ].sort(),
  );
  await access(
    new URL(
      "../docs/engineering/visual-candidates/activity-home-pixel-16bit-candidate.png",
      import.meta.url,
    ),
  );
  await access(
    new URL("../docs/engineering/legacy-assets/icon-512.png", import.meta.url),
  );
  const shipped = await readdir(publicPath, { recursive: true });
  assert.ok(
    !shipped.some((entry) => entry.endsWith(".webp")),
    "legacy RUN webp art must stay outside public",
  );
  await access(
    new URL(
      "../docs/engineering/legacy-assets/run-public/assets/sakiya-avatar.webp",
      import.meta.url,
    ),
  );
  await access(
    new URL(
      "../docs/engineering/legacy-assets/run-public/assets/items/rabbit-charm.webp",
      import.meta.url,
    ),
  );
});

test("coarse 8-bit visual and motion rules include pixelated art, stepped motion, and narrow reflow", async () => {
  const styles = await readFile(stylesPath, "utf8");
  assert.match(styles, /image-rendering:\s*pixelated/);
  assert.match(styles, /steps\(/);
  assert.match(styles, /@media\s*\(max-width:\s*380px\)/);
  assert.match(
    styles,
    /\.workspace-tabs\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)/,
  );
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
  assert.match(styles, /\.pixel-button--small\s*\{[\s\S]*?min-height:\s*44px/);
  assert.match(styles, /\.room-unit-artifact--u10/);
  assert.match(styles, /\.root-navigation__overflow/);
  assert.match(
    styles,
    /@media\s*\(max-width:\s*760px\)[\s\S]*?\.root-navigation\s*\{[\s\S]*?grid-template-columns:\s*repeat\(5,/,
  );
  assert.doesNotMatch(styles, /backdrop-filter/);
});

test("current App exposes U0-U10 room continuity and safe navigation/update controls", async () => {
  const app = await readFile(appPath, "utf8");
  for (const required of [
    "ROOM_UNIT_DELTAS",
    "RoomUnitArtifacts",
    "DAY 1 の部屋を見る",
    "parseAppRoute",
    "appRouteHash",
    "popstate",
    'event.key !== "Escape"',
    "data-route-focus",
    'postMessage({ type: "APPLY_UPDATE" })',
    "updateCanReload",
    "LiveLeaveSafeguard",
    "allowDuringLive",
    "root-navigation__more-toggle",
    "onRoute={navigate}",
  ]) {
    assert.match(
      app,
      new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      required,
    );
  }
});

test("candidate release version and migration metadata stay visible and consistent", async () => {
  const [app, worker, packageSource] = await Promise.all([
    readFile(appPath, "utf8"),
    readFile(serviceWorkerPath, "utf8"),
    readFile(packagePath, "utf8"),
  ]);
  const packageJson = JSON.parse(packageSource);

  assert.equal(packageJson.version, "0.8.0-candidate.1");
  assert.match(app, /version:\s*"0\.8\.0-candidate\.1"/);
  assert.match(worker, /version:\s*"0\.8\.0-candidate\.1"/);
  assert.match(worker, /requiresReload:\s*true/);
  assert.match(worker, /required:\s*false/);
  assert.match(app, /\u73fe\u5728\u306e\u7248/);
  assert.match(app, /\u30bb\u30fc\u30d6\u79fb\u884c/);
});

test("local launch uses a dedicated non-PWA development origin", async () => {
  const [main, packageSource] = await Promise.all([
    readFile(new URL("../src/main.jsx", import.meta.url), "utf8"),
    readFile(packagePath, "utf8"),
  ]);
  const packageJson = JSON.parse(packageSource);

  assert.equal(
    packageJson.scripts.start,
    "vite --host 127.0.0.1 --port 42681 --strictPort",
  );
  assert.equal(packageJson.scripts.dev, packageJson.scripts.start);
  assert.equal(
    packageJson.scripts.preview,
    "vite preview --host 127.0.0.1 --port 42682 --strictPort",
  );
  assert.match(main, /import\.meta\.env\.PROD\s*&&\s*"serviceWorker" in navigator/);
});
