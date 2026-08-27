import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const serviceWorkerPath = path.join(root, "public", "sw.js");
const builtServiceWorkerPath = path.join(root, "dist", "client", "sw.js");
const builtIndexPath = path.join(root, "dist", "client", "index.html");
const runFile = promisify(execFile);

async function loadServiceWorker(workerPath = serviceWorkerPath) {
  const source = await readFile(workerPath, "utf8");
  const listeners = new Map();
  const cacheAdds = [];
  const deletedCaches = [];
  let skipWaitingCalls = 0;
  let claimCalls = 0;

  const context = vm.createContext({
    URL,
    caches: {
      async open(name) {
        return {
          async addAll(paths) {
            cacheAdds.push({ name, paths: [...paths] });
          },
          async put() {},
          async match() {
            return undefined;
          },
        };
      },
      async keys() {
        return ["sakiya-creator-incremental-v3-8bit", "retired-cache"];
      },
      async delete(name) {
        deletedCaches.push(name);
        return true;
      },
    },
    fetch: async () => new Response("network", { status: 200 }),
    self: {
      location: { origin: "https://game.example.test" },
      clients: {
        claim() {
          claimCalls += 1;
          return Promise.resolve();
        },
      },
      addEventListener(type, listener) {
        listeners.set(type, listener);
      },
      skipWaiting() {
        skipWaitingCalls += 1;
        return Promise.resolve();
      },
    },
  });
  vm.runInContext(source, context, { filename: "sw.js" });

  return {
    cacheAdds,
    deletedCaches,
    dispatch(type, event) {
      const listener = listeners.get(type);
      assert.ok(listener, `${type} listener is registered`);
      listener(event);
    },
    get claimCalls() {
      return claimCalls;
    },
    get skipWaitingCalls() {
      return skipWaitingCalls;
    },
    source,
  };
}

function extractHashedViteEntryAssets(indexHtml) {
  const assets = new Set();
  const attributes = /\b(?:src|href)\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = attributes.exec(indexHtml))) {
    if (/^\/assets\/.+\.(?:js|css)$/.test(match[1])) assets.add(match[1]);
  }
  return [...assets].sort();
}

async function buildSitesOutput() {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  await runFile(npm, ["run", "build"], { cwd: root, maxBuffer: 32 * 1024 * 1024 });
}

test("installs the current 8-bit app shell without taking over an active client", async () => {
  const worker = await loadServiceWorker();
  let installWork;

  worker.dispatch("install", {
    waitUntil(work) {
      installWork = work;
    },
  });

  assert.equal(worker.skipWaitingCalls, 0, "install must leave the new worker waiting");
  await installWork;
  assert.deepEqual(worker.cacheAdds, [{
    name: "sakiya-creator-incremental-v3-8bit-__PWA_BUILD_CACHE_ID__",
    paths: [
      "/",
      "/manifest.webmanifest",
      "/assets/current/entry-chime.wav",
      "/assets/current/audio-assets.json",
      "/assets/current/activity-home-8bit-coarse-v3.png",
      "/icon-8bit-192.png",
      "/icon-8bit-512.png",
    ],
  }]);
});

test("activation retains versioned caches and never claims a live play session", async () => {
  const worker = await loadServiceWorker();
  let activationWaits = 0;

  worker.dispatch("activate", {
    waitUntil() {
      activationWaits += 1;
    },
  });

  assert.equal(activationWaits, 0, "activation must not delete or migrate versioned caches");
  assert.deepEqual(worker.deletedCaches, []);
  assert.equal(worker.claimCalls, 0, "activation must not automatically control existing tabs");
});

test("only an explicit APPLY_UPDATE message activates the waiting worker", async () => {
  const worker = await loadServiceWorker();
  const ignoredWaits = [];
  worker.dispatch("message", {
    data: { type: "UNRELATED_MESSAGE" },
    waitUntil(work) {
      ignoredWaits.push(work);
    },
  });
  assert.equal(worker.skipWaitingCalls, 0);
  assert.deepEqual(ignoredWaits, []);

  let updateWork;
  worker.dispatch("message", {
    data: { type: "APPLY_UPDATE" },
    waitUntil(work) {
      updateWork = work;
    },
  });
  await updateWork;

  assert.equal(worker.skipWaitingCalls, 1);
});

test("GET_UPDATE_METADATA reports the release contract without activating the waiting worker", async () => {
  const worker = await loadServiceWorker();
  const responses = [];
  const waits = [];

  worker.dispatch("message", {
    data: { type: "GET_UPDATE_METADATA" },
    ports: [{
      postMessage(response) {
        responses.push(JSON.parse(JSON.stringify(response)));
      },
    }],
    waitUntil(work) {
      waits.push(work);
    },
  });

  assert.equal(worker.skipWaitingCalls, 0);
  assert.deepEqual(waits, []);
  assert.deepEqual(responses, [{
    type: "UPDATE_METADATA",
    metadata: {
      version: "0.8.0-candidate.1",
      releaseType: "ローカル完成候補版",
      requiresReload: true,
      saveSchema: 1,
      migration: {
        required: false,
        fromSchema: 1,
        toSchema: 1,
        summary: "schema 1 のまま。セーブ変換は不要",
      },
    },
  }]);
});

test("keeps the explicit update protocol and does not contain automatic takeover or cross-version cache calls", async () => {
  const source = await readFile(serviceWorkerPath, "utf8");

  assert.match(source, /event\.data\?\.type !== "APPLY_UPDATE"/);
  assert.match(source, /event\.waitUntil\(self\.skipWaiting\(\)\)/);
  assert.doesNotMatch(source, /self\.clients\.claim\s*\(/);
  assert.doesNotMatch(source, /caches\.delete\s*\(/);
  assert.doesNotMatch(source, /caches\.match\s*\(/);
  assert.doesNotMatch(source, /reload\s*\(/);
});

test("completed build injects its Vite-hashed JS and CSS into a versioned offline shell", { concurrency: false }, async () => {
  await buildSitesOutput();
  const [index, workerSource] = await Promise.all([
    readFile(builtIndexPath, "utf8"),
    readFile(builtServiceWorkerPath, "utf8"),
  ]);
  const entryAssets = extractHashedViteEntryAssets(index);

  assert.ok(entryAssets.some((asset) => asset.endsWith(".js")), "build emits a hashed JavaScript entry");
  assert.ok(entryAssets.some((asset) => asset.endsWith(".css")), "build emits a hashed CSS entry");
  for (const asset of entryAssets) {
    await access(path.join(root, "dist", "client", asset.slice(1)));
    assert.match(workerSource, new RegExp(`(?:^|\\n)  "${asset.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}",`));
  }
  assert.doesNotMatch(workerSource, /__VITE_ENTRY_ASSETS__|__PWA_BUILD_CACHE_ID__/);
  assert.match(workerSource, /const CACHE_NAME = "sakiya-creator-incremental-v3-8bit-[a-f0-9]{16}";/);

  const worker = await loadServiceWorker(builtServiceWorkerPath);
  let installWork;
  worker.dispatch("install", {
    waitUntil(work) {
      installWork = work;
    },
  });
  await installWork;
  const installedShell = worker.cacheAdds[0]?.paths ?? [];
  for (const asset of entryAssets) {
    assert.ok(installedShell.includes(asset), `${asset} is pre-cached for the first offline shell`);
  }
});
