import { useEffect, useRef } from "react";
import { AREAS, areaForDistance, compact } from "./config.js";

const WIDTH = 960;
const HEIGHT = 540;
const PLAYER_X = 176;
const GROUND_Y = 420;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const easeOutCubic = (value) => 1 - (1 - clamp(value)) ** 3;
const easeInOutCubic = (value) => {
  const t = clamp(value);
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
};

const IMAGE_SOURCES = [
  ...AREAS.map((area) => area.background),
  "/assets/sakiya-atlas.webp",
  "/assets/heart-particle.webp",
  "/assets/items/gift.webp",
  "/assets/items/yani-pack.webp",
  "/assets/items/energy-can.webp",
  "/assets/items/rabbit-charm.webp",
  "/assets/sprites/enemy-chibi.webp",
  "/assets/sprites/enemy-flying.webp",
  "/assets/sprites/enemy-rusher.webp",
  "/assets/sprites/enemy-caster.webp",
  "/assets/sprites/enemy-tank.webp",
  "/assets/sprites/enemy-gift.webp",
  "/assets/sprites/boss-area1.webp",
  "/assets/sprites/boss-area2.webp",
  "/assets/sprites/boss-area3.webp",
  "/assets/sprites/boss-final.webp",
];

function fitImage(context, image, x, y, width, height, alpha = 1) {
  if (!image?.complete || !image.naturalWidth) return;
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  context.save();
  context.globalAlpha = alpha;
  context.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight), drawWidth, drawHeight);
  context.restore();
}

function drawBackdrop(context, image, run, reducedMotion, alpha = 1, phaseOffset = 0) {
  if (!image?.complete || !image.naturalWidth) {
    context.fillStyle = "#241128";
    context.fillRect(0, 0, WIDTH, HEIGHT);
    return;
  }
  const overscan = 1.12;
  const drawWidth = WIDTH * overscan;
  const drawHeight = drawWidth * (image.naturalHeight / image.naturalWidth);
  const travel = drawWidth - WIDTH;
  const phase = reducedMotion ? 0.5 : (run.distance * 0.003 + phaseOffset) % 1;
  const x = -travel * phase;
  const y = (HEIGHT - drawHeight) / 2 - 28;
  context.save();
  context.globalAlpha = alpha;
  context.drawImage(image, x, y, drawWidth, drawHeight);
  context.restore();
}

function playerFrame(run) {
  if (run.status === "victory") return 5;
  if (run.panicTime > 0) return 4;
  if (run.refilling) return 0;
  if (run.enemies?.length) return Math.floor(run.elapsed * 7) % 3 === 0 ? 2 : 1;
  return Math.floor(run.elapsed * 6) % 2 ? 1 : 3;
}

function drawPlayer(context, image, run, reducedMotion) {
  if (!image?.complete || !image.naturalWidth) return;
  const frame = playerFrame(run);
  const sourceX = (frame % 3) * 512;
  const sourceY = Math.floor(frame / 3) * 512;
  const attack = easeOutCubic((run.playerAttackTime ?? 0) / 0.2);
  const dodge = easeOutCubic((run.playerDodgeTime ?? 0) / 0.32);
  const hurt = easeOutCubic((run.playerHurtTime ?? 0) / 0.28);
  const bob = reducedMotion ? 0 : run.refilling ? 2 : Math.sin(run.elapsed * 8) * 3;
  const size = 252;
  const drawX = PLAYER_X - 116 + attack * 18 - dodge * 24 - hurt * 9;
  const drawY = GROUND_Y - size + bob + attack * 3;
  const scaleX = 1 + attack * 0.055 - hurt * 0.04;
  const scaleY = 1 - attack * 0.045 + hurt * 0.035;

  context.save();
  context.globalAlpha = 0.36;
  context.fillStyle = "#09020d";
  context.beginPath();
  context.ellipse(PLAYER_X + 8, GROUND_Y + 4, 73 + attack * 7, 14, 0, 0, Math.PI * 2);
  context.fill();
  context.restore();

  context.save();
  if (run.flash > 0) context.filter = "brightness(1.8) saturate(0.2)";
  context.translate(drawX + size / 2, drawY + size);
  context.scale(scaleX, scaleY);
  context.drawImage(image, sourceX, sourceY, 512, 512, -size / 2, -size, size, size);
  context.restore();

  if (attack > 0.03 && !reducedMotion) {
    context.save();
    context.globalAlpha = attack * 0.75;
    context.strokeStyle = run.feverTime > 0 ? "#fff0a6" : "#ff72c2";
    context.lineWidth = 5 + attack * 5;
    context.shadowColor = "#ff47aa";
    context.shadowBlur = 18;
    context.beginPath();
    context.arc(PLAYER_X + 92, GROUND_Y - 118, 76 + attack * 18, -1.15, 0.78);
    context.stroke();
    context.restore();
  }

  if (run.refilling) {
    context.fillStyle = "rgba(18, 6, 22, 0.9)";
    context.fillRect(PLAYER_X - 52, GROUND_Y - 212, 124, 24);
    context.strokeStyle = "#ff69bc";
    context.lineWidth = 2;
    context.strokeRect(PLAYER_X - 52, GROUND_Y - 212, 124, 24);
    context.fillStyle = "#ff69bc";
    const fill = Math.min(1, run.refillTimer / Math.max(0.1, run.refillDuration));
    context.fillRect(PLAYER_X - 48, GROUND_Y - 208, 116 * fill, 16);
    context.fillStyle = "#fff4fb";
    context.font = "16px DotGothic16, monospace";
    context.textAlign = "center";
    context.fillText("ヤニ補給中", PLAYER_X + 10, GROUND_Y - 222);
  }
}

function drawEnemy(context, images, enemy, run, reducedMotion) {
  const image = images.get(enemy.sprite);
  const size = enemy.size ?? 96;
  const height = size * (enemy.boss ? 1.05 : 1);
  const spawnDuration = enemy.boss ? 0.9 : 0.34;
  const spawnProgress = easeOutCubic(1 - (enemy.spawnTime ?? 0) / spawnDuration);
  const hit = clamp((enemy.hitFlash ?? 0) / (enemy.boss ? 0.24 : 0.12));
  const hover = reducedMotion ? 0 : Math.sin(run.elapsed * (enemy.role === "flying" ? 6.5 : 4.2) + (enemy.hoverSeed ?? 0)) * (enemy.role === "flying" ? 8 : 2);
  const entrance = enemy.boss ? easeOutCubic(1 - (run.bossEntranceTime ?? 0) / 1.1) : 1;
  const scale = Math.max(0.05, spawnProgress * entrance);

  context.save();
  if (enemy.hitFlash > 0) context.filter = "brightness(2.1) saturate(0.25)";
  if (enemy.brokenTime > 0) {
    context.globalAlpha = 0.82;
    context.translate(Math.sin(run.elapsed * 32) * 4, 0);
  }
  context.translate(enemy.x + hit * 8, enemy.y + hover);
  context.scale(scale * (1 + hit * 0.08), scale * (1 - hit * 0.11));
  fitImage(context, image, -size / 2, -height, size, height);
  context.restore();

  if (enemy.telegraph > 0) {
    const pulse = reducedMotion ? 0.72 : 0.55 + Math.sin(run.elapsed * 30) * 0.25;
    context.save();
    context.globalAlpha = pulse;
    context.strokeStyle = enemy.boss ? "#ffdc6e" : "#ff4b9b";
    context.lineWidth = enemy.boss ? 6 : 4;
    context.setLineDash([10, 8]);
    context.beginPath();
    context.arc(enemy.x, enemy.y - height * 0.45, size * 0.62, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  }

  if (!enemy.boss) {
    const ratio = Math.max(0, enemy.hp / enemy.maxHp);
    context.fillStyle = "rgba(18, 4, 22, 0.88)";
    context.fillRect(enemy.x - size * 0.42, enemy.y - height - 12 + hover, size * 0.84, 8);
    context.fillStyle = ratio > 0.45 ? "#ff70bd" : "#ff4d72";
    context.fillRect(enemy.x - size * 0.42 + 2, enemy.y - height - 10 + hover, (size * 0.84 - 4) * ratio, 4);
  }
}

function drawFever(context, images, run, reducedMotion) {
  if (run.feverTime <= 0) return;
  context.save();
  context.globalCompositeOperation = "screen";
  context.fillStyle = `rgba(255, 50, 164, ${reducedMotion ? 0.08 : 0.07 + Math.sin(run.elapsed * 6) * 0.025})`;
  context.fillRect(0, 0, WIDTH, HEIGHT);
  const heart = images.get("/assets/heart-particle.webp");
  if (!reducedMotion && heart?.complete) {
    for (let index = 0; index < 14; index += 1) {
      const x = (index * 103 + run.elapsed * (26 + (index % 4) * 8)) % (WIDTH + 70) - 35;
      const y = (index * 67 + Math.sin(run.elapsed * 2 + index) * 24) % 360 + 70;
      const size = 18 + (index % 4) * 7;
      context.globalAlpha = 0.28 + (index % 3) * 0.16;
      context.drawImage(heart, x, y, size, size);
    }
  }
  context.restore();
}

function effectColor(type) {
  if (type === "hurt") return "#ff7b83";
  if (type === "disrupt") return "#9cf5ff";
  if (type === "dodge") return "#aaf7ff";
  if (type === "upgrade") return "#ffd66c";
  if (type === "overkill" || type === "ikebo") return "#fff1a8";
  if (type === "damage") return "#fff5fb";
  return "#ff91ca";
}

function drawMotionField(context, run, reducedMotion) {
  if (reducedMotion || run.status !== "running" || run.boss) return;
  const intensity = clamp(((run.momentum ?? 1) - 1) / 4) * 0.55 + (run.feverTime > 0 ? 0.38 : 0);
  if (intensity <= 0.04) return;
  context.save();
  context.globalCompositeOperation = "screen";
  context.strokeStyle = run.feverTime > 0 ? "rgba(255, 214, 104, 0.52)" : "rgba(255, 100, 189, 0.32)";
  context.lineWidth = 2;
  for (let index = 0; index < 11; index += 1) {
    const phase = (run.elapsed * (160 + index * 13) + index * 97) % (WIDTH + 160);
    const x = WIDTH + 80 - phase;
    const y = 102 + ((index * 41) % 275);
    context.globalAlpha = intensity * (0.35 + (index % 3) * 0.2);
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x - 34 - intensity * 72, y);
    context.stroke();
  }
  context.restore();
}

function drawImpact(context, effect, progress, reducedMotion) {
  if (reducedMotion || !["damage", "overkill", "ikebo", "hurt", "disrupt"].includes(effect.type)) return;
  const strength = effect.type === "ikebo" ? 1.4 : effect.type === "overkill" ? 1.15 : effect.crit ? 1 : 0.54;
  const radius = 13 + easeOutCubic(progress) * 34 * strength;
  context.save();
  context.translate(effect.x, effect.y + 14);
  context.strokeStyle = effect.type === "hurt" ? "#ff7b83" : effect.type === "disrupt" ? "#9cf5ff" : effect.crit ? "#fff0a6" : "#ff6db9";
  context.lineWidth = 3;
  context.globalAlpha = (1 - progress) * 0.72;
  for (let ray = 0; ray < 7; ray += 1) {
    const angle = (Math.PI * 2 * ray) / 7 + effect.x * 0.01;
    context.beginPath();
    context.moveTo(Math.cos(angle) * radius * 0.42, Math.sin(angle) * radius * 0.42);
    context.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    context.stroke();
  }
  context.restore();
}

function drawEffects(context, images, run, numberDensity, reducedMotion) {
  const gift = images.get("/assets/items/gift.webp");
  for (const [index, effect] of (run.effects ?? []).entries()) {
    if (numberDensity === "reduced" && effect.type === "damage" && !effect.crit && index % 3 !== 0) continue;
    const progress = clamp(1 - effect.ttl / Math.max(0.001, effect.life ?? 1));
    drawImpact(context, effect, progress, reducedMotion);
    if (effect.type === "gift" && gift?.complete) {
      const pop = easeOutCubic(Math.min(1, progress * 2.6));
      const size = (46 + (1 - Math.abs(pop - 0.76)) * 18) * (reducedMotion ? 1 : 1 + Math.sin(effect.ttl * 10) * 0.06);
      fitImage(context, gift, effect.x - size / 2, effect.y - 34 - easeOutCubic(progress) * 48, size, size, Math.min(1, effect.ttl * 1.45));
    }
    if (effect.type === "banner") {
      context.save();
      const width = Math.min(720, Math.max(320, effect.text.length * 46));
      const reveal = easeOutCubic(Math.min(1, progress * 4));
      const dismiss = clamp(effect.ttl / 0.22);
      context.globalAlpha = Math.min(reveal, dismiss);
      context.translate((1 - reveal) * 60, 0);
      context.fillStyle = "rgba(18, 4, 24, 0.9)";
      context.fillRect(WIDTH / 2 - width / 2, effect.y - 38, width, 76);
      context.strokeStyle = effect.text.includes("FINAL") ? "#ffd46d" : "#ff65b5";
      context.lineWidth = 4;
      context.strokeRect(WIDTH / 2 - width / 2 + 5, effect.y - 33, width - 10, 66);
      context.fillStyle = "#fff7fc";
      context.font = "32px DotGothic16, monospace";
      context.textAlign = "center";
      context.fillText(effect.text, WIDTH / 2, effect.y + 11);
      context.restore();
      continue;
    }
    if (!effect.text) continue;
    context.save();
    const reveal = easeOutCubic(Math.min(1, progress * 4.5));
    context.globalAlpha = Math.min(reveal, effect.ttl * 1.7);
    context.fillStyle = effectColor(effect.type);
    context.strokeStyle = "rgba(18, 4, 24, 0.95)";
    context.lineWidth = effect.crit || effect.type === "overkill" ? 6 : 4;
    context.font = `${effect.crit || effect.type === "overkill" ? 25 : 20}px DotGothic16, monospace`;
    context.textAlign = "center";
    const y = effect.y - easeOutCubic(progress) * 48;
    const scale = 0.72 + reveal * 0.28 + (effect.crit ? (1 - progress) * 0.14 : 0);
    context.translate(effect.x, y);
    context.scale(scale, scale);
    context.strokeText(effect.text, 0, 0);
    context.fillText(effect.text, 0, 0);
    context.restore();
  }
}

function drawRunLabels(context, run) {
  context.save();
  context.textBaseline = "middle";
  if (run.areaTransition) {
    const reveal = easeInOutCubic(clamp((3.6 - run.transitionTimer) / 0.72));
    const dismiss = clamp(run.transitionTimer / 0.45);
    context.globalAlpha = Math.min(reveal, dismiss);
    context.translate(0, (1 - reveal) * 26);
    context.fillStyle = "rgba(14, 3, 20, 0.9)";
    context.fillRect(0, 186, WIDTH, 114);
    context.fillStyle = "#fff4fb";
    context.font = "31px DotGothic16, monospace";
    context.textAlign = "center";
    context.fillText(run.areaTransition, WIDTH / 2, 230);
    context.fillStyle = "#ff78bd";
    context.font = "17px DotGothic16, monospace";
    context.fillText("NEXT STREAMING DISTRICT UNLOCKED", WIDTH / 2, 273);
  }
  if (run.boss) {
    context.fillStyle = "rgba(12, 3, 18, 0.82)";
    context.fillRect(250, 22, 460, 54);
    context.strokeStyle = run.boss.milestone?.type === "final" ? "#ffd46d" : "#ff5caf";
    context.lineWidth = 3;
    context.strokeRect(254, 26, 452, 46);
    context.fillStyle = "#fff5fb";
    context.font = "18px DotGothic16, monospace";
    context.textAlign = "center";
    context.fillText(`${run.bossName} · PHASE ${run.bossPhase}   ${compact(run.boss.hp)} / ${compact(run.boss.maxHp)}`, WIDTH / 2, 48);
  }
  context.restore();
}

function render(context, images, run, reducedMotion, allowShake, numberDensity) {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  if (!run) {
    context.fillStyle = "#170b1d";
    context.fillRect(0, 0, WIDTH, HEIGHT);
    return;
  }
  const area = areaForDistance(run.distance);
  const background = images.get(area.background);
  const shake = allowShake && !reducedMotion ? run.shake * 12 : 0;
  context.save();
  if (shake > 0) context.translate(Math.sin(run.elapsed * 87) * shake, Math.cos(run.elapsed * 71) * shake * 0.45);
  if (run.areaTransition && run.previousAreaId !== run.areaId) {
    const previousArea = AREAS.find((item) => item.id === run.previousAreaId);
    const previous = images.get(previousArea?.background);
    const reveal = easeInOutCubic(clamp((3.6 - run.transitionTimer) / 1.15));
    drawBackdrop(context, previous, run, reducedMotion, 1, -0.018);
    drawBackdrop(context, background, run, reducedMotion, reveal);
  } else {
    drawBackdrop(context, background, run, reducedMotion);
  }
  context.fillStyle = "rgba(15, 5, 22, 0.18)";
  context.fillRect(0, 0, WIDTH, HEIGHT);
  context.fillStyle = "rgba(12, 3, 18, 0.34)";
  context.fillRect(0, 330, WIDTH, HEIGHT - 330);
  drawFever(context, images, run, reducedMotion);
  drawMotionField(context, run, reducedMotion);

  context.strokeStyle = "rgba(255, 111, 190, 0.34)";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(0, GROUND_Y + 12);
  context.lineTo(WIDTH, GROUND_Y + 12);
  context.stroke();

  drawPlayer(context, images.get("/assets/sakiya-atlas.webp"), run, reducedMotion);
  for (const enemy of run.enemies ?? []) drawEnemy(context, images, enemy, run, reducedMotion);
  drawEffects(context, images, run, numberDensity, reducedMotion);
  drawRunLabels(context, run);
  context.restore();

  if (run.flash > 0) {
    context.fillStyle = `rgba(255, 220, 240, ${run.flash})`;
    context.fillRect(0, 0, WIDTH, HEIGHT);
  }
  if (run.status !== "running") {
    context.fillStyle = "rgba(9, 2, 14, 0.56)";
    context.fillRect(0, 0, WIDTH, HEIGHT);
    context.fillStyle = run.status === "victory" ? "#ffd878" : "#fff4fb";
    context.font = "42px DotGothic16, monospace";
    context.textAlign = "center";
    context.fillText(run.status === "victory" ? "FINAL BOSS DEFEATED" : "配信終了", WIDTH / 2, HEIGHT / 2);
  }
}

export function GameCanvas({ engineRef, reducedMotion = false, shake = true, numberDensity = "full", frameRate = 60 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;
    const images = new Map();
    for (const source of IMAGE_SOURCES) {
      const image = new Image();
      image.src = source;
      images.set(source, image);
    }

    let frame = 0;
    let lastDraw = -Infinity;
    const draw = (now) => {
      const interval = 1000 / (frameRate === 30 ? 30 : 60);
      if (now - lastDraw < interval) {
        frame = window.requestAnimationFrame(draw);
        return;
      }
      lastDraw = now;
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      if (canvas.width !== WIDTH * ratio || canvas.height !== HEIGHT * ratio) {
        canvas.width = WIDTH * ratio;
        canvas.height = HEIGHT * ratio;
        canvas.style.aspectRatio = `${WIDTH} / ${HEIGHT}`;
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.imageSmoothingEnabled = false;
      render(context, images, engineRef.current, reducedMotion, shake, numberDensity);
      frame = window.requestAnimationFrame(draw);
    };
    frame = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(frame);
  }, [engineRef, frameRate, numberDensity, reducedMotion, shake]);

  return (
    <canvas
      ref={canvasRef}
      className="game-canvas"
      role="img"
      aria-label="八乙女さきやが右へ進み、配信を盛り上げながら猫型ノイズと戦うゲーム画面"
      width={WIDTH}
      height={HEIGHT}
    />
  );
}
