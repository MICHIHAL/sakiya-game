#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SAMPLE_RATE = 48_000;
const CHANNELS = 1;
const BITS_PER_SAMPLE = 16;
const DURATION_SECONDS = 0.72;
const FRAME_COUNT = Math.round(SAMPLE_RATE * DURATION_SECONDS);
const RUNTIME_PATH = "/assets/current/entry-chime.wav";
const ASSET_ID = "S0_ENTRY_CHIME";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(root, "public", "assets", "current");
const wavPath = path.join(outputDirectory, "entry-chime.wav");
const manifestPath = path.join(outputDirectory, "audio-assets.json");

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function envelope(time, start, duration, peak) {
  const local = time - start;
  if (local < 0 || local >= duration) return 0;
  const attack = Math.min(0.018, duration * 0.16);
  if (local < attack) return peak * (local / attack);
  const decay = (local - attack) / Math.max(0.001, duration - attack);
  return peak * Math.pow(1 - decay, 2.2);
}

function makeEntryChimePcm() {
  const dataBytes = FRAME_COUNT * CHANNELS * (BITS_PER_SAMPLE / 8);
  const wav = Buffer.alloc(44 + dataBytes);
  wav.write("RIFF", 0, 4, "ascii");
  wav.writeUInt32LE(wav.length - 8, 4);
  wav.write("WAVE", 8, 4, "ascii");
  wav.write("fmt ", 12, 4, "ascii");
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(CHANNELS, 22);
  wav.writeUInt32LE(SAMPLE_RATE, 24);
  wav.writeUInt32LE(SAMPLE_RATE * CHANNELS * (BITS_PER_SAMPLE / 8), 28);
  wav.writeUInt16LE(CHANNELS * (BITS_PER_SAMPLE / 8), 32);
  wav.writeUInt16LE(BITS_PER_SAMPLE, 34);
  wav.write("data", 36, 4, "ascii");
  wav.writeUInt32LE(dataBytes, 40);

  for (let frame = 0; frame < FRAME_COUNT; frame += 1) {
    const time = frame / SAMPLE_RATE;
    const sample =
      Math.sin(2 * Math.PI * 659.255 * time) * envelope(time, 0, 0.48, 0.38)
      + Math.sin(2 * Math.PI * 987.767 * time + 0.18) * envelope(time, 0.07, 0.49, 0.23)
      + Math.sin(2 * Math.PI * 1318.51 * time + 0.41) * envelope(time, 0.14, 0.42, 0.11);
    const normalized = clamp(sample * 0.78, -0.92, 0.92);
    wav.writeInt16LE(Math.round(normalized * 32767), 44 + frame * 2);
  }

  return wav;
}

function createAssetManifest(wav, sha256) {
  return {
    schemaVersion: 1,
    product: "八乙女さきや 活動者育成インクリメンタル",
    voiceIdentity: "NO_VOICE",
    generatedBy: {
      script: "scripts/generate-current-audio.mjs",
      generatorVersion: "1.0.0",
      deterministic: true,
    },
    assets: [
      {
        assetId: ASSET_ID,
        semanticClass: "S0",
        runtimePath: RUNTIME_PATH,
        sha256,
        byteLength: wav.length,
        durationSeconds: DURATION_SECONDS,
        format: {
          container: "WAV",
          encoding: "PCM_S16LE",
          channels: CHANNELS,
          sampleRate: SAMPLE_RATE,
          bitsPerSample: BITS_PER_SAMPLE,
        },
        sourceMaster: "scripts/generate-current-audio.mjs:S0_ENTRY_CHIME_V1",
        editLineage: ["project-original deterministic render", "no post-render edits"],
        creator: "Sakiya Game Forge",
        provenance: "Project-original deterministic generated signal rendered from source code in this repository; no third-party sample or voice input.",
        rightsBasis: "project-original generated signal",
        attribution: "No third-party attribution required.",
        territoryTerm: "Project-owned use; no external sample license dependency.",
        voiceIdentity: "NO_VOICE",
        trigger: {
          id: "TRG-ENTRY-01",
          event: "first external fictional arrival",
          oncePerSaveLineage: true,
          laterArrivalPolicy: "not adopted",
        },
        caption: "はじめての来訪",
        visualSignal: {
          kind: "arrival-mark",
          glyph: "✦",
          label: "最初の外部からの来訪を履歴に記録",
        },
        mix: {
          bus: "sfx",
          priority: "M1",
          duckTargets: ["music", "ambience"],
          concurrency: 1,
          cooldown: "event-scoped",
          resumePolicy: "never-queue",
        },
        implementationStatus: "present; listening acceptance not yet run",
        evidenceRefs: ["generated asset hash", "current-audio semantic registry"],
        replacementWithdrawalPath: "Remove this asset and its registry record together if a later approved replacement is required; do not create a variant.",
      },
    ],
  };
}

async function main() {
  const wav = makeEntryChimePcm();
  const sha256 = createHash("sha256").update(wav).digest("hex");
  const manifest = createAssetManifest(wav, sha256);
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(wavPath, wav);
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log("Generated " + RUNTIME_PATH + " (" + sha256 + ")");
}

await main();
