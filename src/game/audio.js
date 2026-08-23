const clamp01 = (value, fallback = 1) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(1, Math.max(0, parsed));
};

const AREA_MUSIC = {
  1: { bpm: 122, root: 110, bass: [0, 0, 7, 9, 0, 12, 7, 9], sparkle: [12, 16, 19, 16, 14, 19, 21, 19], wave: "square", filter: 3400 },
  2: { bpm: 130, root: 98, bass: [0, 7, 10, 7, 3, 10, 12, 10], sparkle: [12, 15, 19, 22, 19, 15, 17, 22], wave: "sawtooth", filter: 3000 },
  3: { bpm: 136, root: 82.41, bass: [0, 0, 3, 1, 0, -2, 3, 6], sparkle: [12, 15, 13, 18, 15, 13, 10, 13], wave: "triangle", filter: 2300 },
  4: { bpm: 144, root: 73.42, bass: [0, -1, 3, 6, 0, 11, 6, 3], sparkle: [12, 15, 18, 23, 18, 15, 13, 18], wave: "sawtooth", filter: 2800 },
};

function semitone(root, offset) {
  return root * 2 ** (offset / 12);
}

export function createAudioDirector() {
  let context = null;
  let compressor = null;
  let master = null;
  let musicBus = null;
  let musicCore = null;
  let musicHeat = null;
  let musicFilter = null;
  let sfxBus = null;
  let noiseBuffer = null;
  let enabled = true;
  let transport = false;
  let musicVolume = 0.72;
  let sfxVolume = 0.88;
  let nextStep = 0;
  let step = 0;
  let sceneKey = "";
  const lastSfx = new Map();

  function safeRamp(param, value, when, timeConstant = 0.04) {
    if (!param) return;
    param.cancelScheduledValues(when);
    param.setTargetAtTime(Math.max(0.0001, value), when, timeConstant);
  }

  function ensure() {
    if (!enabled || typeof window === "undefined") return null;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (!context) {
      context = new AudioContext();

      compressor = context.createDynamicsCompressor();
      compressor.threshold.value = -18;
      compressor.knee.value = 16;
      compressor.ratio.value = 7;
      compressor.attack.value = 0.004;
      compressor.release.value = 0.18;

      master = context.createGain();
      master.gain.value = 0.62;
      master.connect(compressor);
      compressor.connect(context.destination);

      musicBus = context.createGain();
      musicBus.gain.value = musicVolume * 0.34;
      musicFilter = context.createBiquadFilter();
      musicFilter.type = "lowpass";
      musicFilter.frequency.value = 3400;
      musicFilter.Q.value = 0.8;
      musicCore = context.createGain();
      musicCore.gain.value = 1;
      musicHeat = context.createGain();
      musicHeat.gain.value = 0.0001;
      musicCore.connect(musicFilter);
      musicHeat.connect(musicFilter);
      musicFilter.connect(musicBus);
      musicBus.connect(master);

      sfxBus = context.createGain();
      sfxBus.gain.value = sfxVolume * 0.52;
      sfxBus.connect(master);

      noiseBuffer = context.createBuffer(1, Math.floor(context.sampleRate * 0.45), context.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let index = 0; index < noiseData.length; index += 1) noiseData[index] = Math.random() * 2 - 1;
    }
    if (context.state === "suspended") context.resume().catch(() => {});
    return context;
  }

  function oscillatorTone({
    frequency,
    duration = 0.1,
    volume = 0.08,
    type = "square",
    when,
    destination = sfxBus,
    detune = 0,
    glide = null,
    attack = 0.008,
    pan = 0,
  }) {
    const ctx = ensure();
    if (!ctx || !destination) return;
    const start = Math.max(ctx.currentTime, when ?? ctx.currentTime);
    const end = start + Math.max(0.025, duration);
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = typeof ctx.createStereoPanner === "function" ? ctx.createStereoPanner() : null;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(Math.max(24, frequency), start);
    if (glide) oscillator.frequency.exponentialRampToValueAtTime(Math.max(24, glide), end);
    oscillator.detune.value = detune;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, volume), start + Math.min(attack, duration * 0.35));
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    oscillator.connect(gain);
    if (panner) {
      panner.pan.value = Math.min(0.8, Math.max(-0.8, pan));
      gain.connect(panner);
      panner.connect(destination);
    } else {
      gain.connect(destination);
    }
    oscillator.start(start);
    oscillator.stop(end + 0.025);
  }

  function noise({ duration = 0.08, volume = 0.05, when, frequency = 5000, type = "highpass", destination = sfxBus }) {
    const ctx = ensure();
    if (!ctx || !noiseBuffer || !destination) return;
    const start = Math.max(ctx.currentTime, when ?? ctx.currentTime);
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = noiseBuffer;
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = 0.7;
    gain.gain.setValueAtTime(Math.max(0.001, volume), start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(destination);
    source.start(start);
    source.stop(start + duration + 0.02);
  }

  function chord(notes, options = {}) {
    const ctx = ensure();
    if (!ctx) return;
    const start = options.when ?? ctx.currentTime;
    notes.forEach((frequency, index) => oscillatorTone({
      frequency,
      duration: options.duration ?? 0.25,
      volume: (options.volume ?? 0.07) / Math.sqrt(notes.length),
      type: options.type ?? "triangle",
      when: start + index * (options.spread ?? 0.018),
      destination: options.destination ?? sfxBus,
      detune: index % 2 ? 3 : -3,
    }));
  }

  function kick(when, volume = 0.11, destination = musicCore) {
    oscillatorTone({ frequency: 118, glide: 43, duration: 0.13, volume, type: "sine", when, destination, attack: 0.004 });
  }

  function hat(when, volume = 0.025, destination = musicCore) {
    noise({ duration: 0.035, volume, when, frequency: 6500, destination });
  }

  function snare(when, volume = 0.045, destination = musicCore) {
    noise({ duration: 0.105, volume, when, frequency: 1300, type: "bandpass", destination });
    oscillatorTone({ frequency: 176, glide: 112, duration: 0.08, volume: volume * 0.42, type: "triangle", when, destination });
  }

  function duck(amount = 0.45, duration = 0.16) {
    const ctx = ensure();
    if (!ctx || !musicBus) return;
    const normal = musicVolume * 0.34;
    safeRamp(musicBus.gain, normal * amount, ctx.currentTime, 0.008);
    musicBus.gain.setTargetAtTime(Math.max(0.0001, normal), ctx.currentTime + duration, 0.07);
  }

  function canPlay(key, gap) {
    const ctx = ensure();
    if (!ctx) return false;
    const previous = lastSfx.get(key) ?? -Infinity;
    if (ctx.currentTime - previous < gap) return false;
    lastSfx.set(key, ctx.currentTime);
    return true;
  }

  function stinger(notes, options = {}) {
    const ctx = ensure();
    if (!ctx) return;
    const start = ctx.currentTime + 0.015;
    notes.forEach((frequency, index) => oscillatorTone({
      frequency,
      duration: options.duration ?? 0.18,
      volume: options.volume ?? 0.1,
      type: options.type ?? "square",
      when: start + index * (options.step ?? 0.075),
      destination: sfxBus,
      pan: (index - (notes.length - 1) / 2) * 0.08,
    }));
  }

  function handle(event) {
    if (!event || !enabled) return;
    const ctx = ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    switch (event.type) {
      case "ui":
        if (canPlay("ui", 0.045)) oscillatorTone({ frequency: 740, glide: 620, duration: 0.045, volume: 0.032, type: "triangle", when: now });
        break;
      case "run-start":
        duck(0.3, 0.28);
        stinger([220, 330, 440, 659], { duration: 0.2, volume: 0.075, step: 0.07, type: "square" });
        break;
      case "attack":
        if (event.crit || canPlay("attack", 0.085)) {
          oscillatorTone({ frequency: event.crit ? 1047 : 460, glide: event.crit ? 740 : 340, duration: event.crit ? 0.085 : 0.045, volume: event.crit ? 0.08 : 0.027, type: "square", when: now, pan: 0.22 });
          if (event.crit) noise({ duration: 0.055, volume: 0.052, when: now, frequency: 3200 });
        }
        break;
      case "telegraph":
        if (event.boss && canPlay("boss-telegraph", 0.38)) oscillatorTone({ frequency: 740, glide: 988, duration: 0.2, volume: 0.065, type: "sine", when: now });
        break;
      case "kill":
        if (event.boss) {
          duck(0.22, 0.35);
          noise({ duration: 0.28, volume: 0.17, when: now, frequency: 580, type: "lowpass" });
          chord([110, 165, 220, 330], { duration: 0.5, volume: 0.095, type: "sawtooth", spread: 0.028 });
        } else if (event.overkill || canPlay("kill", 0.07)) {
          oscillatorTone({ frequency: event.overkill ? 784 : 560, glide: event.overkill ? 1175 : 670, duration: event.overkill ? 0.11 : 0.045, volume: event.overkill ? 0.07 : 0.027, type: "square", when: now, pan: 0.3 });
        }
        break;
      case "coin":
        if (event.source === "gift" && canPlay("gift-coin", 0.08)) stinger([660, 880], { duration: 0.075, volume: 0.042, step: 0.035, type: "triangle" });
        break;
      case "gift":
        if (canPlay("gift", 0.14)) stinger([523, 659, 784, 1047], { duration: 0.18, volume: 0.07, step: 0.045, type: "triangle" });
        break;
      case "dodge":
        stinger([740, 988, 1319], { duration: 0.085, volume: 0.06, step: 0.025, type: "sine" });
        break;
      case "hurt":
        duck(0.4, 0.14);
        oscillatorTone({ frequency: 118, glide: 62, duration: 0.17, volume: 0.13, type: "sawtooth", when: now, pan: -0.3 });
        noise({ duration: 0.09, volume: 0.08, when: now, frequency: 720, type: "lowpass" });
        break;
      case "disrupt":
        if (canPlay(`disrupt-${event.kind}`, 0.18)) {
          oscillatorTone({ frequency: event.kind === "steal" ? 620 : 310, glide: event.kind === "steal" ? 220 : 96, duration: 0.2, volume: event.boss ? 0.09 : 0.052, type: "sawtooth", when: now, pan: -0.2 });
          noise({ duration: 0.08, volume: event.boss ? 0.07 : 0.04, when: now, frequency: 1700, type: "bandpass" });
        }
        break;
      case "upgrade":
        if (canPlay("upgrade", 0.11)) stinger([392, 523, 659], { duration: 0.13, volume: 0.05, step: 0.032, type: "square" });
        break;
      case "ikebo":
        duck(0.2, 0.3);
        chord([98, 196, 392, 784], { duration: 0.38, volume: 0.12, type: "sawtooth", spread: 0.016 });
        oscillatorTone({ frequency: 1400, glide: 190, duration: 0.38, volume: 0.085, type: "square", when: now });
        break;
      case "break":
        duck(0.18, 0.4);
        noise({ duration: 0.32, volume: 0.16, when: now, frequency: 920, type: "bandpass" });
        stinger([165, 247, 494, 659], { duration: 0.32, volume: 0.09, step: 0.025, type: "square" });
        break;
      case "fever-start":
        duck(0.12, 0.26);
        stinger([392, 523, 659, 784, 1047], { duration: 0.34, volume: 0.105, step: 0.052, type: "sawtooth" });
        break;
      case "fever-end":
        stinger([784, 659, 523], { duration: 0.13, volume: 0.045, step: 0.06, type: "triangle" });
        break;
      case "boss-start":
        duck(0.08, 0.46);
        chord(event.bossType === "final" ? [55, 82.41, 110, 138.59] : [73.42, 110, 146.83], { duration: 0.8, volume: 0.14, type: "sawtooth", spread: 0.035 });
        noise({ duration: 0.34, volume: 0.12, when: now, frequency: 520, type: "lowpass" });
        break;
      case "boss-phase":
        duck(0.18, 0.32);
        stinger(event.phase === 3 ? [146.83, 138.59, 110, 220] : [196, 185, 277.18], { duration: 0.3, volume: 0.09, step: 0.055, type: "sawtooth" });
        break;
      case "boss-clear":
        duck(0.12, 0.42);
        stinger([261.63, 329.63, 392, 523.25, 659.25], { duration: 0.45, volume: 0.1, step: 0.055, type: "square" });
        break;
      case "area":
        duck(0.18, 0.4);
        stinger([293.66, 392, 587.33, 783.99], { duration: 0.4, volume: 0.09, step: 0.065, type: "triangle" });
        nextStep = now + 0.42;
        step = 0;
        break;
      case "last-wall":
        duck(0.2, 0.35);
        stinger([440, 554.37, 659.25, 880], { duration: 0.3, volume: 0.1, step: 0.055, type: "square" });
        break;
      case "refill-start":
        if (canPlay("refill", 0.4)) oscillatorTone({ frequency: 124, glide: 196, duration: 0.24, volume: 0.05, type: "triangle", when: now });
        break;
      case "refill-complete":
        stinger([392, 587], { duration: 0.1, volume: 0.045, step: 0.04, type: "sine" });
        break;
      case "panic":
        duck(0.22, 0.32);
        stinger([118, 109, 96, 82], { duration: 0.23, volume: 0.09, step: 0.055, type: "sawtooth" });
        break;
      case "defeat":
        transport = false;
        duck(0.05, 0.7);
        stinger([220, 185, 146.83, 110], { duration: 0.62, volume: 0.105, step: 0.12, type: "triangle" });
        break;
      case "victory":
        transport = false;
        duck(0.05, 0.8);
        stinger([261.63, 329.63, 392, 523.25, 659.25, 783.99], { duration: 0.75, volume: 0.12, step: 0.09, type: "square" });
        break;
      default:
        break;
    }
  }

  function scheduleMusicStep(run, when) {
    const area = AREA_MUSIC[Math.max(1, Math.min(4, run.areaId ?? 1))] ?? AREA_MUSIC[1];
    const fever = run.feverTime > 0;
    const boss = Boolean(run.boss);
    const index = step % area.bass.length;
    const barStep = step % 16;
    const heat = fever ? 1 : boss ? 0.72 : Math.min(0.42, 0.12 + (run.momentum ?? 1) * 0.055);
    if (!context || !musicCore || !musicHeat || !musicFilter) return;

    safeRamp(musicHeat.gain, heat, when, 0.12);
    safeRamp(musicFilter.frequency, area.filter + (fever ? 2100 : boss ? -600 : 0), when, 0.18);

    if (barStep % 4 === 0) kick(when, boss ? 0.12 : 0.085, musicCore);
    if (barStep % 8 === 4) snare(when, fever ? 0.055 : 0.038, musicCore);
    if (barStep % 2 === 1) hat(when, fever ? 0.032 : 0.018, fever ? musicHeat : musicCore);
    if (fever && barStep % 2 === 0) hat(when + 0.035, 0.025, musicHeat);

    if (barStep % 2 === 0) {
      oscillatorTone({ frequency: semitone(area.root, area.bass[index]), duration: boss ? 0.28 : 0.18, volume: boss ? 0.085 : 0.058, type: area.wave, when, destination: musicCore, attack: 0.012 });
    }

    if ((fever || boss || run.areaId >= 3) && barStep % 2 === 1) {
      oscillatorTone({ frequency: semitone(area.root, area.sparkle[index] + (boss ? -12 : 0)), duration: fever ? 0.1 : 0.17, volume: fever ? 0.045 : 0.028, type: fever ? "square" : "triangle", when, destination: musicHeat, pan: index % 2 ? 0.28 : -0.22 });
    }

    if (barStep === 0) {
      const chordOffsets = run.areaId === 1 ? [0, 4, 7] : run.areaId === 2 ? [0, 3, 7] : run.areaId === 3 ? [0, 3, 6] : [0, 3, 7, 11];
      chord(chordOffsets.map((offset) => semitone(area.root * 2, offset)), { duration: boss ? 0.9 : 0.62, volume: boss ? 0.045 : 0.025, type: "triangle", when, spread: 0.012, destination: boss ? musicHeat : musicCore });
    }
  }

  function tick(run) {
    const ctx = ensure();
    if (!ctx || !run || run.status !== "running" || !transport) return;
    const fever = run.feverTime > 0;
    const boss = Boolean(run.boss);
    const currentScene = `${run.areaId ?? 1}:${boss ? run.boss.milestone?.type ?? "boss" : "road"}:${fever ? "fever" : "normal"}`;
    if (sceneKey !== currentScene) {
      sceneKey = currentScene;
      safeRamp(musicHeat?.gain, fever ? 1 : boss ? 0.72 : 0.18, ctx.currentTime, 0.18);
    }

    if (!Number.isFinite(nextStep) || nextStep < ctx.currentTime - 0.3) nextStep = ctx.currentTime + 0.02;
    const area = AREA_MUSIC[Math.max(1, Math.min(4, run.areaId ?? 1))] ?? AREA_MUSIC[1];
    const bpm = area.bpm + (fever ? 12 : boss ? -4 : 0);
    const interval = 60 / bpm / 2;
    while (nextStep < ctx.currentTime + 0.11) {
      scheduleMusicStep(run, nextStep);
      nextStep += interval;
      step += 1;
    }
  }

  function setMix(next = {}) {
    musicVolume = clamp01(next.music, musicVolume);
    sfxVolume = clamp01(next.sfx, sfxVolume);
    if (!context) return;
    safeRamp(musicBus?.gain, musicVolume * 0.34, context.currentTime, 0.035);
    safeRamp(sfxBus?.gain, sfxVolume * 0.52, context.currentTime, 0.035);
  }

  function setTransport(value) {
    transport = Boolean(value);
    if (!context || !musicBus) return;
    safeRamp(musicBus.gain, transport && enabled ? musicVolume * 0.34 : 0.0001, context.currentTime, transport ? 0.08 : 0.045);
    if (transport && nextStep < context.currentTime) nextStep = context.currentTime + 0.03;
  }

  return {
    start() {
      const ctx = ensure();
      if (ctx) {
        transport = true;
        nextStep = ctx.currentTime + 0.03;
        step = 0;
      }
      return ctx;
    },
    event: handle,
    tick,
    setMix,
    setTransport,
    setEnabled(value) {
      enabled = Boolean(value);
      if (!context || !master) return;
      safeRamp(master.gain, enabled ? 0.62 : 0.0001, context.currentTime, 0.035);
      if (!enabled) transport = false;
    },
    async destroy() {
      if (context) await context.close();
      context = null;
      compressor = null;
      master = null;
      musicBus = null;
      musicCore = null;
      musicHeat = null;
      musicFilter = null;
      sfxBus = null;
      noiseBuffer = null;
    },
  };
}
