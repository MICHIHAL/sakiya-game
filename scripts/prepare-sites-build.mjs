#!/usr/bin/env node
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const client = path.join(dist, "client");
const index = path.join(client, "index.html");
const serviceWorker = path.join(client, "sw.js");
const worker = path.join(root, "worker", "index.js");
const hosting = path.join(root, ".openai", "hosting.json");
const VITE_ENTRY_ASSETS_MARKER = "  /*__VITE_ENTRY_ASSETS__*/";
const PWA_BUILD_CACHE_ID_MARKER = "__PWA_BUILD_CACHE_ID__";

for (const file of [index, serviceWorker, worker, hosting]) {
  if (!existsSync(file)) throw new Error("Missing Sites build input: " + file);
}

function extractViteEntryAssets(indexHtml) {
  const assets = new Set();
  const attributes = /\b(?:src|href)\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = attributes.exec(indexHtml))) {
    const url = match[1];
    if (!/^\/assets\/.+\.(?:js|css)$/.test(url)) continue;
    assets.add(url);
  }
  const orderedAssets = [...assets].sort();
  if (orderedAssets.length === 0) {
    throw new Error("Missing Vite JS/CSS entry assets in Sites index.html");
  }
  return orderedAssets;
}

function assertClientAssetExists(assetUrl) {
  const asset = path.resolve(client, "." + assetUrl);
  if (!asset.startsWith(client + path.sep) || !existsSync(asset)) {
    throw new Error("Missing Vite entry asset for service-worker shell: " + assetUrl);
  }
}

function listClientFiles(directory, prefix = "") {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const relative = path.posix.join(prefix, entry.name);
      if (entry.isDirectory()) return listClientFiles(path.join(directory, entry.name), relative);
      return entry.isFile() && relative !== "sw.js" ? [relative] : [];
    })
    .sort();
}

function createBuildCacheId(workerSource) {
  const hash = createHash("sha256");
  for (const relative of listClientFiles(client)) {
    hash.update(relative);
    hash.update("\0");
    hash.update(readFileSync(path.join(client, relative)));
    hash.update("\0");
  }
  // Include the worker before its cache-id replacement so behavior changes also
  // get a distinct cache namespace without creating a self-referential hash.
  hash.update("sw.js");
  hash.update("\0");
  hash.update(workerSource);
  return hash.digest("hex").slice(0, 16);
}

function injectPwaBuildData() {
  const entryAssets = extractViteEntryAssets(readFileSync(index, "utf8"));
  entryAssets.forEach(assertClientAssetExists);

  const source = readFileSync(serviceWorker, "utf8");
  if (source.split(VITE_ENTRY_ASSETS_MARKER).length !== 2) {
    throw new Error("Service-worker Vite entry-assets marker must appear exactly once");
  }
  if (source.split(PWA_BUILD_CACHE_ID_MARKER).length !== 2) {
    throw new Error("Service-worker cache-id marker must appear exactly once");
  }

  const injectedEntries = entryAssets.map((asset) => `  ${JSON.stringify(asset)},`).join("\n");
  const preparedSource = source.replace(VITE_ENTRY_ASSETS_MARKER, injectedEntries);
  const cacheId = createBuildCacheId(preparedSource);
  const output = preparedSource.replace(PWA_BUILD_CACHE_ID_MARKER, cacheId);

  if (output.includes(VITE_ENTRY_ASSETS_MARKER) || output.includes(PWA_BUILD_CACHE_ID_MARKER)) {
    throw new Error("Service-worker build data injection was incomplete");
  }
  writeFileSync(serviceWorker, output);
  return { cacheId, entryAssets };
}

const pwaBuild = injectPwaBuildData();

mkdirSync(path.join(dist, "server"), { recursive: true });
mkdirSync(path.join(dist, ".openai"), { recursive: true });
copyFileSync(worker, path.join(dist, "server", "index.js"));
copyFileSync(hosting, path.join(dist, ".openai", "hosting.json"));

console.log(
  `Prepared Sites build: dist/server/index.js, dist/.openai/hosting.json, and PWA shell (${pwaBuild.entryAssets.length} Vite assets; cache ${pwaBuild.cacheId}).`,
);
