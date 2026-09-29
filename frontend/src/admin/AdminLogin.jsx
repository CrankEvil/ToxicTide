
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveAdminSession } from "../adminApi";

import "../App.css";

/* ══════════════════════════════════════════════════════════════════════════
   ① CONFIGURATION  —  unchanged from your file
   ══════════════════════════════════════════════════════════════════════════ */

const API_BASE = "http://localhost:5000/api";

// Set true to show the small request-trace panel under the console.
const DEBUG = false;

/* ══════════════════════════════════════════════════════════════════════════
   ② EMBEDDED STYLESHEET  —  prefix tt-, cannot collide with App.css
   ══════════════════════════════════════════════════════════════════════════ */

const TT_CSS = `/* ============================================================
   TOXICTIDE — SECURE ACCESS TERMINAL
   Cinematic cricket command-center login.
   Zero dependencies. CSS 3D + a single 2D canvas.
   ============================================================ */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

.tt-root {
  /* ---- palette ---- */
  --midnight: #020617;
  --abyss: #030712;
  --cyan: #22d3ee;
  --blue: #3b82f6;
  --violet: #8b5cf6;
  --ice: #a5f3fc;
  --gold: #fbbf24;
  --green: #34d399;

  --ink-1: #eaf6fb;
  --ink-2: #9fb6c8;
  --ink-3: #5b7286;

  /* ---- live state (written by JS) ---- */
  --px: 0;            /* pointer x, -1..1   */
  --py: 0;            /* pointer y, -1..1   */
  --cam: 0;           /* intro push-in 0..1 */
  --heat: 0;          /* stadium intensity 0..1 */
  --dive: 0;          /* cinematic camera dive 0..1 */

  --ease: cubic-bezier(0.22, 1, 0.36, 1);

  position: fixed;
  inset: 0;
  overflow: hidden;
  background: var(--abyss);
  color: var(--ink-1);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  font-feature-settings: 'ss01', 'cv05', 'tnum';
  -webkit-font-smoothing: antialiased;
  user-select: none;
}

.tt-root *,
.tt-root *::before,
.tt-root *::after { box-sizing: border-box; }

/* ============================================================
   STAGE / CAMERA
   ============================================================ */

.tt-stage {
  position: absolute;
  inset: 0;
  perspective: 1400px;
  perspective-origin: calc(50% + var(--px) * 3%) calc(46% + var(--py) * 2.5%);
  transform-style: preserve-3d;
}

.tt-world {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform:
    translateZ(calc(-620px + var(--cam) * 620px + var(--dive) * 900px))
    rotateX(calc(var(--py) * -1.1deg))
    rotateY(calc(var(--px) * 1.6deg));
  transition: transform 140ms linear;
}

/* every environment plane */
.tt-plane {
  position: absolute;
  left: 50%;
  top: 50%;
  transform-style: preserve-3d;
  will-change: transform;
  backface-visibility: hidden;
}

/* ---- sky / void ---- */
.tt-sky {
  width: 300vw; height: 220vh;
  margin: -110vh 0 0 -150vw;
  transform: translateZ(-2200px) scale(1.9) translate3d(calc(var(--px) * -8px), calc(var(--py) * -5px), 0);
  background:
    radial-gradient(120% 90% at 50% 88%, rgba(34, 211, 238, calc(0.10 + var(--heat) * 0.22)) 0%, transparent 58%),
    radial-gradient(80% 60% at 18% 30%, rgba(59, 130, 246, 0.14) 0%, transparent 62%),
    radial-gradient(70% 55% at 84% 26%, rgba(139, 92, 246, 0.13) 0%, transparent 60%),
    linear-gradient(180deg, #01030c 0%, #020617 46%, #04101f 100%);
}

.tt-sky::after {
  content: '';
  position: absolute; inset: 0;
  background-image:
    radial-gradient(1.4px 1.4px at 12% 18%, rgba(165, 243, 252, 0.7), transparent 60%),
    radial-gradient(1px 1px at 34% 9%, rgba(255, 255, 255, 0.45), transparent 60%),
    radial-gradient(1.6px 1.6px at 61% 22%, rgba(165, 243, 252, 0.5), transparent 60%),
    radial-gradient(1px 1px at 78% 12%, rgba(255, 255, 255, 0.4), transparent 60%),
    radial-gradient(1.2px 1.2px at 89% 31%, rgba(165, 243, 252, 0.45), transparent 60%),
    radial-gradient(1px 1px at 23% 37%, rgba(255, 255, 255, 0.3), transparent 60%);
  opacity: 0.8;
  animation: tt-twinkle 7s ease-in-out infinite;
}

@keyframes tt-twinkle {
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 0.95; }
}

/* ---- the bowl: far stand ---- */
.tt-bowl {
  width: 260vw; height: 92vh;
  margin: -66vh 0 0 -130vw;
  transform: translateZ(-1750px) translate3d(calc(var(--px) * -16px), calc(var(--py) * -9px), 0);
  border-radius: 50% 50% 14% 14% / 62% 62% 8% 8%;
  background:
    linear-gradient(180deg, rgba(3, 9, 22, 0) 0%, rgba(4, 12, 28, 0.82) 34%, rgba(2, 6, 18, 0.98) 100%);
  box-shadow: inset 0 -60px 120px rgba(2, 6, 23, 0.9);
  overflow: hidden;
}

/* stand seating — tiered rows with crowd speckle */
.tt-bowl::before {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: 0; height: 58%;
  background:
    repeating-linear-gradient(
      180deg,
      rgba(148, 197, 224, calc(0.055 + var(--heat) * 0.06)) 0px,
      rgba(148, 197, 224, calc(0.055 + var(--heat) * 0.06)) 1px,
      transparent 1px,
      transparent 13px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(2, 6, 23, 0.55) 0px,
      rgba(2, 6, 23, 0.55) 2px,
      transparent 2px,
      transparent 46px
    );
  mask-image: radial-gradient(120% 140% at 50% 100%, #000 18%, transparent 78%);
  -webkit-mask-image: radial-gradient(120% 140% at 50% 100%, #000 18%, transparent 78%);
}

/* crowd shimmer — reacts during the cinematic */
.tt-crowd {
  position: absolute;
  left: 0; right: 0; bottom: 0; height: 52%;
  background-image:
    radial-gradient(1.5px 1.5px at 8% 40%, rgba(165, 243, 252, 0.5), transparent 60%),
    radial-gradient(1.5px 1.5px at 21% 66%, rgba(251, 191, 36, 0.4), transparent 60%),
    radial-gradient(1.5px 1.5px at 37% 28%, rgba(255, 255, 255, 0.45), transparent 60%),
    radial-gradient(1.5px 1.5px at 52% 72%, rgba(165, 243, 252, 0.4), transparent 60%),
    radial-gradient(1.5px 1.5px at 66% 44%, rgba(255, 255, 255, 0.4), transparent 60%),
    radial-gradient(1.5px 1.5px at 79% 61%, rgba(251, 191, 36, 0.35), transparent 60%),
    radial-gradient(1.5px 1.5px at 91% 33%, rgba(165, 243, 252, 0.45), transparent 60%);
  opacity: calc(0.25 + var(--heat) * 0.75);
  animation: tt-crowd-shimmer 2.6s steps(6) infinite;
  transition: opacity 600ms ease;
}

@keyframes tt-crowd-shimmer {
  0%   { transform: translate3d(0, 0, 0); filter: brightness(1); }
  33%  { transform: translate3d(1px, -1px, 0); filter: brightness(1.5); }
  66%  { transform: translate3d(-1px, 1px, 0); filter: brightness(0.8); }
  100% { transform: translate3d(0, 0, 0); filter: brightness(1.2); }
}

/* ---- floodlight rigs ---- */
.tt-rig {
  position: absolute;
  bottom: 0;
  transform-origin: 50% 100%;
  transform-style: preserve-3d;
}

.tt-rig-mast {
  position: absolute;
  bottom: 0; left: 50%;
  width: 8px; height: 100%;
  margin-left: -4px;
  background: linear-gradient(90deg, #060d1c 0%, #1d2d45 42%, #2f4463 50%, #16233a 60%, #050b17 100%);
  box-shadow: 0 0 22px rgba(2, 6, 23, 0.9);
}

.tt-rig-head {
  position: absolute;
  top: 0; left: 50%;
  width: 118px; height: 54px;
  margin-left: -59px;
  border-radius: 5px;
  background:
    repeating-linear-gradient(90deg,
      rgba(165, 243, 252, calc(0.40 + var(--heat) * 0.60)) 0 7px,
      rgba(3, 10, 22, 0.94) 7px 14px),
    #0a1425;
  box-shadow:
    0 0 26px rgba(165, 243, 252, calc(0.28 + var(--heat) * 0.5)),
    0 0 90px rgba(34, 211, 238, calc(0.20 + var(--heat) * 0.55)),
    inset 0 0 12px rgba(2, 6, 23, 0.8);
  filter: brightness(calc(0.7 + var(--heat) * 0.9));
  transition: filter 700ms ease, box-shadow 700ms ease;
}

.tt-rig[data-lit='0'] .tt-rig-head { filter: brightness(0.32); }
.tt-rigs.is-igniting .tt-rig[data-lit='1'] .tt-rig-head {
  filter: brightness(1.9);
  animation: tt-strike 900ms var(--ease);
}

@keyframes tt-strike {
  0%   { filter: brightness(0.3); }
  12%  { filter: brightness(4.2); }
  20%  { filter: brightness(1.1); }
  34%  { filter: brightness(3.4); }
  100% { filter: brightness(1.9); }
}

/* the volumetric beam */
.tt-beam {
  position: absolute;
  top: 46px; left: 50%;
  width: 300px; height: 1400px;
  margin-left: -150px;
  transform-origin: 50% 0;
  clip-path: polygon(41% 0%, 59% 0%, 100% 100%, 0% 100%);
  background: linear-gradient(180deg,
    rgba(186, 246, 255, calc(0.30 + var(--heat) * 0.35)) 0%,
    rgba(34, 211, 238, 0.13) 32%,
    rgba(59, 130, 246, 0.05) 64%,
    transparent 100%);
  filter: blur(10px);
  mix-blend-mode: screen;
  opacity: calc(0.42 + var(--heat) * 0.58);
  transition: opacity 800ms ease;
  pointer-events: none;
}

.tt-rig[data-lit='0'] .tt-beam { opacity: 0.06; }

.tt-beam::after {
  content: '';
  position: absolute; inset: 0;
  background: repeating-linear-gradient(180deg,
    rgba(255, 255, 255, 0.05) 0 2px, transparent 2px 9px);
  mix-blend-mode: overlay;
  animation: tt-beam-drift 9s linear infinite;
}

@keyframes tt-beam-drift {
  from { transform: translateY(0); }
  to   { transform: translateY(9px); }
}

/* ---- distant holographic displays ---- */
.tt-holo {
  position: absolute;
  border: 1px solid rgba(34, 211, 238, 0.28);
  border-radius: 3px;
  background:
    repeating-linear-gradient(180deg,
      rgba(34, 211, 238, 0.11) 0 2px, transparent 2px 6px),
    linear-gradient(140deg, rgba(34, 211, 238, 0.14), rgba(139, 92, 246, 0.09));
  box-shadow: 0 0 40px rgba(34, 211, 238, 0.22), inset 0 0 30px rgba(34, 211, 238, 0.1);
  opacity: calc(0.4 + var(--heat) * 0.5);
  overflow: hidden;
}

.tt-holo::after {
  content: '';
  position: absolute; left: 8%; right: 8%; top: 18%;
  height: 4px;
  background: linear-gradient(90deg, transparent, rgba(165, 243, 252, 0.85), transparent);
  filter: blur(1px);
  animation: tt-holo-scan 5.5s linear infinite;
}

@keyframes tt-holo-scan {
  0%   { top: 8%;  opacity: 0; }
  12%  { opacity: 0.9; }
  88%  { opacity: 0.9; }
  100% { top: 88%; opacity: 0; }
}

/* ---- the scoreboard ---- */
.tt-board {
  width: 640px; height: 210px;
  margin: -560px 0 0 -320px;
  transform: translateZ(-1500px) translate3d(calc(var(--px) * -22px), calc(var(--py) * -12px), 0) scale(1.35);
  border: 1px solid rgba(34, 211, 238, 0.3);
  border-radius: 8px;
  background: linear-gradient(160deg, rgba(4, 14, 30, 0.9), rgba(2, 6, 23, 0.95));
  box-shadow:
    0 0 60px rgba(34, 211, 238, calc(0.10 + var(--heat) * 0.45)),
    inset 0 0 60px rgba(34, 211, 238, 0.06);
  padding: 20px 26px;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 14px;
  opacity: calc(0.42 + var(--heat) * 0.58);
  transition: opacity 700ms ease;
}

.tt-board-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  letter-spacing: 0.34em;
  color: rgba(165, 243, 252, 0.55);
  border-bottom: 1px solid rgba(34, 211, 238, 0.18);
  padding-bottom: 10px;
}

.tt-board-main {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 46px;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: rgba(165, 243, 252, 0.9);
  text-shadow: 0 0 26px rgba(34, 211, 238, 0.7);
  font-variant-numeric: tabular-nums;
}

.tt-board.is-victory {
  border-color: rgba(251, 191, 36, 0.55);
  box-shadow: 0 0 110px rgba(251, 191, 36, 0.45), inset 0 0 70px rgba(251, 191, 36, 0.12);
}
.tt-board.is-victory .tt-board-main {
  color: var(--gold);
  text-shadow: 0 0 34px rgba(251, 191, 36, 0.8);
}

/* ---- the field ---- */
.tt-field {
  width: 3400px; height: 2600px;
  margin: -900px 0 0 -1700px;
  transform:
    translateZ(-760px)
    translateY(560px)
    rotateX(76deg)
    translate3d(calc(var(--px) * -26px), 0, 0);
  transform-origin: 50% 0;
  background:
    radial-gradient(60% 46% at 50% 26%, rgba(34, 211, 238, calc(0.10 + var(--heat) * 0.18)) 0%, transparent 70%),
    repeating-linear-gradient(90deg,
      rgba(16, 52, 48, 0.55) 0 120px,
      rgba(10, 38, 36, 0.55) 120px 240px),
    radial-gradient(70% 60% at 50% 30%, #0b2b2a 0%, #05161c 52%, #020a14 100%);
  border-radius: 50%;
  box-shadow: inset 0 0 300px rgba(2, 6, 23, 0.95);
  mask-image: radial-gradient(58% 52% at 50% 26%, #000 22%, rgba(0, 0, 0, 0.35) 62%, transparent 86%);
  -webkit-mask-image: radial-gradient(58% 52% at 50% 26%, #000 22%, rgba(0, 0, 0, 0.35) 62%, transparent 86%);
}

/* wet-turf specular sheen — sells the reflection */
.tt-field::before {
  content: '';
  position: absolute;
  left: 22%; top: 8%; width: 56%; height: 44%;
  background: radial-gradient(50% 50% at 50% 50%, rgba(165, 243, 252, calc(0.14 + var(--heat) * 0.2)), transparent 72%);
  filter: blur(40px);
  mix-blend-mode: screen;
}

/* boundary rope */
.tt-rope {
  position: absolute;
  left: 50%; top: 26%;
  width: 2100px; height: 1500px;
  margin: -750px 0 0 -1050px;
  border: 3px solid rgba(165, 243, 252, calc(0.22 + var(--heat) * 0.4));
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(34, 211, 238, 0.35);
}

/* the pitch */
.tt-pitch {
  position: absolute;
  left: 50%; top: 26%;
  width: 190px; height: 900px;
  margin: -450px 0 0 -95px;
  background:
    repeating-linear-gradient(180deg,
      rgba(255, 255, 255, 0.015) 0 3px, transparent 3px 7px),
    linear-gradient(180deg, #4a4033 0%, #6b5b46 18%, #7a6850 50%, #6b5b46 82%, #4a4033 100%);
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.7), inset 0 0 40px rgba(0, 0, 0, 0.45);
  opacity: 0.82;
}

.tt-pitch::before,
.tt-pitch::after {
  content: '';
  position: absolute;
  left: 8%; right: 8%;
  height: 2px;
  background: rgba(240, 245, 250, 0.5);
}
.tt-pitch::before { top: 14%; }
.tt-pitch::after  { bottom: 14%; }

/* ---- athlete ---- */
.tt-athlete {
  width: 460px; height: 620px;
  margin: -430px 0 0 -30px;
  transform:
    translateZ(-620px)
    translate3d(calc(var(--px) * -40px), calc(var(--py) * -14px), 0)
    scale(1.15);
  filter: drop-shadow(0 34px 44px rgba(0, 0, 0, 0.75));
  opacity: calc(0.74 + var(--heat) * 0.26);
}

.tt-athlete svg { width: 100%; height: 100%; overflow: visible; }

.tt-breathe { animation: tt-breathe 5.2s ease-in-out infinite; transform-origin: 50% 100%; }

@keyframes tt-breathe {
  0%, 100% { transform: translateY(0) scaleY(1) rotate(0deg); }
  38%      { transform: translateY(-4px) scaleY(1.012) rotate(-0.5deg); }
  70%      { transform: translateY(1px) scaleY(0.996) rotate(0.3deg); }
}

.tt-swing-group { transform-origin: 232px 250px; }
.tt-athlete.is-swinging .tt-swing-group { animation: tt-swing 760ms cubic-bezier(0.5, 0, 0.2, 1); }

@keyframes tt-swing {
  0%   { transform: rotate(0deg); }
  22%  { transform: rotate(-58deg); }
  54%  { transform: rotate(96deg); }
  100% { transform: rotate(18deg); }
}

/* ---- haze ---- */
.tt-haze {
  position: absolute; inset: -20%;
  pointer-events: none;
  background:
    radial-gradient(44% 34% at 26% 62%, rgba(59, 130, 246, 0.14), transparent 70%),
    radial-gradient(40% 30% at 74% 54%, rgba(139, 92, 246, 0.12), transparent 70%),
    radial-gradient(60% 40% at 50% 86%, rgba(34, 211, 238, calc(0.10 + var(--heat) * 0.2)), transparent 72%);
  filter: blur(28px);
  mix-blend-mode: screen;
  animation: tt-haze-drift 26s ease-in-out infinite alternate;
}

@keyframes tt-haze-drift {
  from { transform: translate3d(-2%, 0, 0) scale(1); }
  to   { transform: translate3d(2%, -2%, 0) scale(1.06); }
}

/* ============================================================
   PARTICLE CANVAS
   ============================================================ */

.tt-canvas {
  position: absolute;
  inset: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 4;
}

/* foreground bokeh — the only truly "in front of you" layer */
.tt-bokeh {
  position: absolute; inset: -10%;
  pointer-events: none;
  z-index: 9;
  mix-blend-mode: screen;
  transform: translate3d(calc(var(--px) * 34px), calc(var(--py) * 24px), 0);
  transition: transform 220ms var(--ease);
}

.tt-bokeh i {
  position: absolute;
  display: block;
  border-radius: 50%;
  background: radial-gradient(50% 50% at 50% 50%, rgba(165, 243, 252, 0.5), transparent 70%);
  filter: blur(6px);
  animation: tt-float linear infinite;
}

@keyframes tt-float {
  0%   { transform: translate3d(0, 20px, 0); opacity: 0; }
  14%  { opacity: 0.65; }
  86%  { opacity: 0.4; }
  100% { transform: translate3d(28px, -180px, 0); opacity: 0; }
}

/* ============================================================
   HUD
   ============================================================ */

.tt-hud {
  position: absolute; inset: 0;
  z-index: 6;
  pointer-events: none;
  transform: translate3d(calc(var(--px) * 10px), calc(var(--py) * 7px), 0);
  transition: transform 260ms var(--ease);
}

.tt-hud-item {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.3em;
  color: rgba(159, 182, 200, 0.5);
  white-space: nowrap;
}

.tt-hud-item::before {
  content: '';
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--cyan);
  box-shadow: 0 0 8px var(--cyan);
  animation: tt-pulse 3s ease-in-out infinite;
}

.tt-hud-item.is-gold::before { background: var(--gold); box-shadow: 0 0 8px var(--gold); }
.tt-hud-item.is-green::before { background: var(--green); box-shadow: 0 0 8px var(--green); }

@keyframes tt-pulse {
  0%, 100% { opacity: 0.35; transform: scale(0.8); }
  50%      { opacity: 1; transform: scale(1.15); }
}

.tt-hud-rule {
  position: absolute;
  height: 1px;
  background: linear-gradient(90deg, rgba(34, 211, 238, 0.35), transparent);
}

/* slow orbital ring behind everything */
.tt-orbit {
  position: absolute;
  left: 50%; top: 50%;
  width: 1180px; height: 1180px;
  margin: -590px 0 0 -590px;
  border: 1px solid rgba(34, 211, 238, 0.09);
  border-radius: 50%;
  animation: tt-spin 90s linear infinite;
}
.tt-orbit::before {
  content: '';
  position: absolute; left: 50%; top: -4px;
  width: 7px; height: 7px; margin-left: -3px;
  border-radius: 50%;
  background: var(--cyan);
  box-shadow: 0 0 16px var(--cyan);
}
.tt-orbit.is-inner {
  width: 880px; height: 880px; margin: -440px 0 0 -440px;
  animation-duration: 64s;
  animation-direction: reverse;
  border-color: rgba(139, 92, 246, 0.09);
}
.tt-orbit.is-inner::before { background: var(--violet); box-shadow: 0 0 16px var(--violet); }

@keyframes tt-spin { to { transform: rotate(360deg); } }

/* ============================================================
   CONSOLE
   ============================================================ */

.tt-console-wrap {
  position: absolute;
  inset: 0;
  z-index: 8;
  display: grid;
  place-items: center;
  perspective: 1500px;
  padding: 24px;
}

.tt-console {
  position: relative;
  width: min(470px, 100%);
  transform-style: preserve-3d;
  transform:
    rotateY(calc(var(--px) * 5.2deg))
    rotateX(calc(var(--py) * -3.6deg))
    translateZ(60px);
  transition: transform 180ms var(--ease);
  animation: tt-console-in 1500ms 900ms var(--ease) both;
}

@keyframes tt-console-in {
  from { opacity: 0; transform: translateY(46px) translateZ(-140px) rotateX(9deg); filter: blur(14px); }
  to   { opacity: 1; }
}

/* the glass body */
.tt-console-body {
  position: relative;
  padding: 34px 34px 30px;
  background:
    linear-gradient(158deg, rgba(14, 32, 58, 0.62) 0%, rgba(3, 9, 24, 0.74) 44%, rgba(8, 20, 42, 0.66) 100%);
  backdrop-filter: blur(22px) saturate(140%);
  -webkit-backdrop-filter: blur(22px) saturate(140%);
  border: 1px solid rgba(125, 211, 252, 0.16);
  clip-path: polygon(
    22px 0, calc(100% - 78px) 0, 100% 34px,
    100% calc(100% - 22px), calc(100% - 22px) 100%,
    78px 100%, 0 calc(100% - 46px), 0 22px
  );
  box-shadow:
    0 60px 120px -30px rgba(0, 0, 0, 0.9),
    0 0 0 1px rgba(2, 6, 23, 0.6),
    inset 0 1px 0 rgba(186, 246, 255, 0.14),
    inset 0 0 90px rgba(34, 211, 238, 0.05);
}

/* metallic top edge */
.tt-console-body::before {
  content: '';
  position: absolute;
  left: 22px; right: 78px; top: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(186, 246, 255, 0.85), rgba(59, 130, 246, 0.3), transparent);
}

/* traveling scan line */
.tt-console-body::after {
  content: '';
  position: absolute;
  left: 0; right: 0; top: 0; height: 90px;
  background: linear-gradient(180deg, rgba(34, 211, 238, 0.08), transparent);
  pointer-events: none;
  animation: tt-console-scan 9s ease-in-out infinite;
}

@keyframes tt-console-scan {
  0%, 100% { transform: translateY(-90px); opacity: 0; }
  20%      { opacity: 0.9; }
  80%      { transform: translateY(560px); opacity: 0; }
}

/* the halo sitting behind the glass — depth separation */
.tt-console-halo {
  position: absolute;
  inset: -46px -40px -56px;
  transform: translateZ(-70px);
  background:
    radial-gradient(56% 50% at 50% 42%, rgba(34, 211, 238, 0.24), transparent 72%),
    radial-gradient(70% 60% at 50% 88%, rgba(59, 130, 246, 0.18), transparent 74%);
  filter: blur(34px);
  pointer-events: none;
}

/* animated light streak around the border */
.tt-console-edge {
  position: absolute;
  inset: -1px;
  pointer-events: none;
  clip-path: inherit;
  overflow: hidden;
}

.tt-console-edge i {
  position: absolute;
  width: 190px; height: 2px;
  top: 0; left: -190px;
  background: linear-gradient(90deg, transparent, var(--ice), transparent);
  filter: blur(0.6px);
  animation: tt-edge-run 6.5s linear infinite;
}
.tt-console-edge i:nth-child(2) {
  top: auto; bottom: 0;
  animation-delay: 3.25s;
  background: linear-gradient(90deg, transparent, var(--violet), transparent);
}

@keyframes tt-edge-run {
  0%   { transform: translateX(0); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateX(760px); opacity: 0; }
}

/* corner brackets */
.tt-bracket {
  position: absolute;
  width: 16px; height: 16px;
  border: 1px solid rgba(34, 211, 238, 0.55);
  pointer-events: none;
}
.tt-bracket.tl { top: 8px; left: 8px; border-right: 0; border-bottom: 0; }
.tt-bracket.tr { top: 8px; right: 8px; border-left: 0; border-bottom: 0; }
.tt-bracket.bl { bottom: 8px; left: 8px; border-right: 0; border-top: 0; }
.tt-bracket.br { bottom: 8px; right: 8px; border-left: 0; border-top: 0; }

/* ---- header ---- */
.tt-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 9.5px;
  font-weight: 500;
  letter-spacing: 0.32em;
  color: var(--ink-3);
  margin-bottom: 22px;
}

.tt-meta span { display: flex; align-items: center; gap: 7px; }

.tt-led {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 10px var(--green);
  animation: tt-pulse 2.4s ease-in-out infinite;
}

.tt-title {
  margin: 0;
  font-size: clamp(34px, 5.6vw, 46px);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 0.92;
  background: linear-gradient(176deg, #ffffff 0%, #cfeefb 40%, #6ba8cf 74%, #2f5c86 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 26px rgba(34, 211, 238, 0.35));
}

.tt-subtitle {
  margin: 12px 0 30px;
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.4em;
  color: rgba(159, 182, 200, 0.62);
  display: flex;
  align-items: center;
  gap: 12px;
}

.tt-subtitle::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(34, 211, 238, 0.4), transparent);
}

/* ---- fields ---- */
.tt-field-group { margin-bottom: 16px; }

.tt-label {
  display: block;
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: var(--ink-3);
  margin-bottom: 8px;
  transition: color 260ms ease;
}

.tt-field-group:focus-within .tt-label { color: var(--ice); }

.tt-input-shell {
  position: relative;
  border: 1px solid rgba(125, 211, 252, 0.14);
  background: linear-gradient(180deg, rgba(2, 6, 23, 0.7), rgba(6, 16, 34, 0.55));
  transition: border-color 300ms ease, box-shadow 300ms ease, background 300ms ease;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
}

.tt-input-shell::after {
  content: '';
  position: absolute;
  left: 0; bottom: 0; height: 1px; width: 0;
  background: linear-gradient(90deg, var(--cyan), var(--ice), transparent);
  transition: width 520ms var(--ease);
}

.tt-field-group:focus-within .tt-input-shell {
  border-color: rgba(34, 211, 238, 0.55);
  background: linear-gradient(180deg, rgba(4, 16, 36, 0.8), rgba(8, 24, 48, 0.62));
  box-shadow:
    0 0 0 3px rgba(34, 211, 238, 0.08),
    0 0 34px rgba(34, 211, 238, 0.22),
    inset 0 0 26px rgba(34, 211, 238, 0.07);
}

.tt-field-group:focus-within .tt-input-shell::after { width: 100%; }

.tt-field-group.is-secure:focus-within .tt-input-shell {
  border-color: rgba(139, 92, 246, 0.6);
  box-shadow:
    0 0 0 3px rgba(139, 92, 246, 0.09),
    0 0 34px rgba(139, 92, 246, 0.24),
    inset 0 0 26px rgba(139, 92, 246, 0.08);
}
.tt-field-group.is-secure .tt-input-shell::after {
  background: linear-gradient(90deg, var(--violet), var(--blue), transparent);
}
.tt-field-group.is-secure:focus-within .tt-label { color: #d6ccff; }

/* the rotating holographic ring that activates on focus */
.tt-ring {
  position: absolute;
  inset: -14px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 340ms ease;
}
.tt-field-group:focus-within .tt-ring { opacity: 1; }

.tt-ring::before,
.tt-ring::after {
  content: '';
  position: absolute;
  width: 26px; height: 26px;
  border: 1px solid rgba(34, 211, 238, 0.7);
  animation: tt-ring-breathe 2.6s ease-in-out infinite;
}
.tt-ring::before { left: 0; top: 0; border-right: 0; border-bottom: 0; }
.tt-ring::after  { right: 0; bottom: 0; border-left: 0; border-top: 0; }

.tt-field-group.is-secure .tt-ring::before,
.tt-field-group.is-secure .tt-ring::after { border-color: rgba(139, 92, 246, 0.75); }

@keyframes tt-ring-breathe {
  0%, 100% { opacity: 0.4; transform: translate(0, 0); }
  50%      { opacity: 1; transform: translate(2px, 2px); }
}
.tt-ring::after { animation-direction: reverse; }

.tt-input {
  width: 100%;
  padding: 15px 16px;
  border: 0;
  background: transparent;
  color: var(--ink-1);
  font-family: inherit;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.06em;
  outline: none;
}

.tt-input::placeholder { color: rgba(91, 114, 134, 0.7); letter-spacing: 0.12em; font-weight: 400; }
.tt-input:-webkit-autofill {
  -webkit-text-fill-color: var(--ink-1);
  -webkit-box-shadow: 0 0 0 1000px rgba(4, 14, 32, 0.98) inset;
  caret-color: var(--ink-1);
}

.tt-input-shell.has-action .tt-input { padding-right: 52px; }

.tt-reveal {
  position: absolute;
  right: 8px; top: 50%;
  transform: translateY(-50%);
  width: 36px; height: 36px;
  display: grid; place-items: center;
  border: 0; border-radius: 4px;
  background: transparent;
  color: var(--ink-3);
  cursor: pointer;
  transition: color 240ms ease, background 240ms ease;
}
.tt-reveal:hover { color: var(--ice); background: rgba(34, 211, 238, 0.09); }
.tt-reveal:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }
.tt-reveal svg { width: 18px; height: 18px; }
.tt-reveal .tt-slash {
  transition: stroke-dashoffset 380ms var(--ease);
  stroke-dasharray: 26;
  stroke-dashoffset: 26;
}
.tt-reveal.is-on .tt-slash { stroke-dashoffset: 0; }

/* ---- error ---- */
.tt-alert {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: start;
  margin: 4px 0 18px;
  padding: 12px 14px;
  border: 1px solid rgba(248, 113, 113, 0.42);
  background: linear-gradient(180deg, rgba(60, 10, 22, 0.55), rgba(24, 6, 14, 0.4));
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  animation: tt-alert-in 420ms var(--ease);
}

@keyframes tt-alert-in {
  from { opacity: 0; transform: translateY(-8px); }
}

.tt-alert-mark {
  width: 18px; height: 18px;
  border: 1px solid rgba(248, 113, 113, 0.8);
  border-radius: 50%;
  display: grid; place-items: center;
  font-size: 11px; font-weight: 700;
  color: #fca5a5;
  animation: tt-pulse 1.4s ease-in-out infinite;
}

.tt-alert-head {
  font-size: 9.5px; font-weight: 600;
  letter-spacing: 0.3em;
  color: #fca5a5;
  margin-bottom: 4px;
}

.tt-alert-body { font-size: 13px; color: rgba(254, 226, 226, 0.82); line-height: 1.45; }

.tt-console.is-rejected { animation: tt-reject 560ms cubic-bezier(0.36, 0.07, 0.19, 0.97); }

@keyframes tt-reject {
  10%, 90% { transform: translateX(-3px) rotateY(calc(var(--px) * 5.2deg)); }
  20%, 80% { transform: translateX(6px) rotateY(calc(var(--px) * 5.2deg)); }
  30%, 50%, 70% { transform: translateX(-9px) rotateY(calc(var(--px) * 5.2deg)); }
  40%, 60% { transform: translateX(9px) rotateY(calc(var(--px) * 5.2deg)); }
}

.tt-console.is-rejected .tt-console-body {
  box-shadow:
    0 60px 120px -30px rgba(0, 0, 0, 0.9),
    0 0 90px rgba(248, 113, 113, 0.42),
    inset 0 0 70px rgba(248, 113, 113, 0.13);
  border-color: rgba(248, 113, 113, 0.5);
}

/* ---- ignition button ---- */
.tt-ignite {
  position: relative;
  width: 100%;
  margin-top: 8px;
  padding: 17px 24px;
  border: 1px solid rgba(34, 211, 238, 0.45);
  background: linear-gradient(180deg, rgba(8, 40, 62, 0.85), rgba(4, 18, 36, 0.9));
  color: var(--ink-1);
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.34em;
  cursor: pointer;
  overflow: hidden;
  clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
  transition: transform 260ms var(--ease), box-shadow 320ms ease, border-color 320ms ease;
  box-shadow: 0 0 26px rgba(34, 211, 238, 0.14), inset 0 0 26px rgba(34, 211, 238, 0.08);
}

.tt-ignite-core {
  position: absolute;
  left: 50%; top: 50%;
  width: 180px; height: 180px;
  margin: -90px 0 0 -90px;
  border-radius: 50%;
  background: radial-gradient(50% 50% at 50% 50%, rgba(34, 211, 238, 0.42), transparent 70%);
  filter: blur(16px);
  transition: transform 420ms var(--ease), opacity 420ms ease;
  transform: scale(0.55);
  opacity: 0.55;
  pointer-events: none;
}

.tt-ignite-sweep {
  position: absolute;
  top: 0; bottom: 0; left: -60%;
  width: 55%;
  background: linear-gradient(90deg, transparent, rgba(186, 246, 255, 0.28), transparent);
  transform: skewX(-18deg);
  pointer-events: none;
  transition: left 720ms var(--ease);
}

.tt-ignite-label {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.tt-ignite:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: rgba(165, 243, 252, 0.85);
  box-shadow:
    0 14px 40px -12px rgba(34, 211, 238, 0.55),
    0 0 60px rgba(34, 211, 238, 0.3),
    inset 0 0 40px rgba(34, 211, 238, 0.16);
}
.tt-ignite:hover:not(:disabled) .tt-ignite-core { transform: scale(1.15); opacity: 1; }
.tt-ignite:hover:not(:disabled) .tt-ignite-sweep { left: 110%; }

.tt-ignite:focus-visible { outline: 2px solid var(--ice); outline-offset: 3px; }
.tt-ignite:active:not(:disabled) { transform: translateY(1px) scale(0.985); }
.tt-ignite:disabled { cursor: progress; }

.tt-ignite.is-working {
  border-color: rgba(165, 243, 252, 0.9);
  box-shadow: 0 0 80px rgba(34, 211, 238, 0.45), inset 0 0 60px rgba(34, 211, 238, 0.25);
}
.tt-ignite.is-working .tt-ignite-core {
  animation: tt-core-throb 1.05s ease-in-out infinite;
}

@keyframes tt-core-throb {
  0%, 100% { transform: scale(0.85); opacity: 0.6; }
  50%      { transform: scale(1.5); opacity: 1; }
}

/* the scan that passes over the locked console */
.tt-lockscan {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  clip-path: inherit;
}
.tt-lockscan::before {
  content: '';
  position: absolute;
  left: -20%; right: -20%;
  height: 160px;
  background: linear-gradient(180deg, transparent, rgba(34, 211, 238, 0.22), rgba(165, 243, 252, 0.5), rgba(34, 211, 238, 0.22), transparent);
  filter: blur(2px);
  animation: tt-lockscan 1.5s linear infinite;
}

@keyframes tt-lockscan {
  from { transform: translateY(-200px); }
  to   { transform: translateY(640px); }
}

.tt-console.is-locked .tt-console-body { border-color: rgba(34, 211, 238, 0.55); }
.tt-console.is-locked .tt-input { opacity: 0.45; }

/* status readout under the button */
.tt-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(125, 211, 252, 0.1);
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.28em;
  color: var(--ink-3);
}

.tt-status b { color: rgba(165, 243, 252, 0.72); font-weight: 600; }
.tt-status .is-live { color: var(--green); }

/* dissolve on success */
.tt-console.is-dissolving {
  animation: tt-dissolve 1100ms var(--ease) forwards;
  pointer-events: none;
}

@keyframes tt-dissolve {
  0%   { opacity: 1; filter: blur(0) brightness(1); transform: translateZ(60px) scale(1); }
  30%  { opacity: 1; filter: blur(0) brightness(2.4); }
  100% { opacity: 0; filter: blur(26px) brightness(4); transform: translateZ(360px) scale(1.14); }
}

/* ============================================================
   CINEMATIC OVERLAY
   ============================================================ */

.tt-cine {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  display: grid;
  place-items: center;
}

/* white-out flash on bat impact */
.tt-flash {
  position: absolute; inset: 0;
  background: radial-gradient(40% 40% at 50% 52%, #ffffff, rgba(165, 243, 252, 0.85) 34%, transparent 72%);
  opacity: 0;
}
.tt-flash.is-firing { animation: tt-flash 820ms var(--ease); }

@keyframes tt-flash {
  0%   { opacity: 0; transform: scale(0.4); }
  8%   { opacity: 1; transform: scale(1.3); }
  100% { opacity: 0; transform: scale(2.2); }
}

/* shockwave ring */
.tt-shock {
  position: absolute;
  left: 50%; top: 50%;
  width: 140px; height: 140px;
  margin: -70px 0 0 -70px;
  border: 3px solid rgba(165, 243, 252, 0.9);
  border-radius: 50%;
  opacity: 0;
}
.tt-shock.is-firing { animation: tt-shock 1000ms cubic-bezier(0.15, 0.9, 0.3, 1); }

@keyframes tt-shock {
  0%   { opacity: 1; transform: scale(0.1); border-width: 10px; }
  100% { opacity: 0; transform: scale(14); border-width: 1px; }
}

.tt-shake { animation: tt-shake 620ms cubic-bezier(0.36, 0.07, 0.19, 0.97); }

@keyframes tt-shake {
  0%, 100% { transform: translate3d(0, 0, 0); }
  15% { transform: translate3d(-14px, 8px, 0) rotate(-0.4deg); }
  32% { transform: translate3d(12px, -10px, 0) rotate(0.35deg); }
  52% { transform: translate3d(-9px, 5px, 0) rotate(-0.25deg); }
  74% { transform: translate3d(6px, -4px, 0); }
}

/* ---- cinematic captions ---- */
.tt-caption {
  position: absolute;
  top: 16%;
  text-align: center;
  font-size: clamp(16px, 2.6vw, 26px);
  font-weight: 700;
  letter-spacing: 0.46em;
  text-indent: 0.46em;
  color: rgba(224, 247, 255, 0.95);
  text-shadow: 0 0 40px rgba(34, 211, 238, 0.85);
  animation: tt-caption-in 620ms var(--ease) both;
}

.tt-caption small {
  display: block;
  margin-top: 14px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.4em;
  color: rgba(159, 182, 200, 0.7);
  text-shadow: none;
}

@keyframes tt-caption-in {
  from { opacity: 0; letter-spacing: 0.9em; filter: blur(10px); }
}

/* ---- the SIX ---- */
.tt-six {
  position: relative;
  display: grid;
  place-items: center;
  animation: tt-six-in 1300ms var(--ease) both;
}

@keyframes tt-six-in {
  0%   { opacity: 0; transform: scale(2.3) translateZ(0); filter: blur(30px); }
  55%  { opacity: 1; filter: blur(0); }
  100% { opacity: 1; transform: scale(1); }
}

.tt-six-word {
  position: relative;
  font-size: clamp(90px, 22vw, 290px);
  font-weight: 900;
  letter-spacing: -0.045em;
  line-height: 0.82;
  background: linear-gradient(174deg,
    #ffffff 0%,
    #fff3d0 16%,
    var(--gold) 34%,
    #b17f18 50%,
    #fde9b4 62%,
    var(--gold) 74%,
    #8a5f0d 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 60px rgba(251, 191, 36, 0.55)) drop-shadow(0 18px 40px rgba(0, 0, 0, 0.7));
}

/* extruded depth — stacked shadow clone behind the metal face */
.tt-six-word::before {
  content: attr(data-word);
  position: absolute;
  inset: 0;
  z-index: -1;
  background: none;
  color: #0a1a2e;
  -webkit-text-fill-color: #0a1a2e;
  text-shadow:
    1px 1px 0 #0a1a2e, 2px 2px 0 #091728, 3px 3px 0 #081525,
    4px 4px 0 #071322, 5px 5px 0 #06111f, 6px 6px 0 #050f1c,
    7px 7px 0 #040d19, 8px 8px 0 #030b16, 9px 9px 0 #020913,
    10px 10px 0 #020710, 11px 11px 24px rgba(0, 0, 0, 0.9);
}

.tt-six-sub {
  margin-top: 6px;
  font-size: clamp(9px, 1.4vw, 13px);
  font-weight: 600;
  letter-spacing: 0.68em;
  text-indent: 0.68em;
  color: rgba(253, 230, 180, 0.72);
}

.tt-six-rule {
  width: min(420px, 62vw);
  height: 1px;
  margin: 22px 0 0;
  background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.85), transparent);
}

/* ---- victory interface ---- */
.tt-victory {
  display: grid;
  gap: 26px;
  justify-items: center;
  padding: 44px 54px;
  border: 1px solid rgba(251, 191, 36, 0.4);
  background: linear-gradient(160deg, rgba(28, 20, 4, 0.5), rgba(2, 6, 23, 0.72));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  clip-path: polygon(26px 0, calc(100% - 26px) 0, 100% 26px, 100% calc(100% - 26px), calc(100% - 26px) 100%, 26px 100%, 0 calc(100% - 26px), 0 26px);
  box-shadow: 0 0 140px rgba(251, 191, 36, 0.28), inset 0 0 80px rgba(251, 191, 36, 0.06);
  animation: tt-victory-in 900ms var(--ease) both;
  max-width: min(680px, 90vw);
}

@keyframes tt-victory-in {
  from { opacity: 0; transform: translateY(30px) scale(0.94); filter: blur(12px); }
}

.tt-victory-rows { display: grid; gap: 12px; width: 100%; }

.tt-victory-row {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 18px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(251, 191, 36, 0.14);
  font-size: clamp(10px, 1.5vw, 12px);
  font-weight: 600;
  letter-spacing: 0.3em;
  color: rgba(253, 230, 180, 0.62);
  animation: tt-row-in 520ms var(--ease) both;
}
.tt-victory-row:nth-child(1) { animation-delay: 120ms; }
.tt-victory-row:nth-child(2) { animation-delay: 300ms; }
.tt-victory-row:nth-child(3) { animation-delay: 480ms; }

.tt-victory-row b { color: var(--green); font-weight: 700; }

@keyframes tt-row-in {
  from { opacity: 0; transform: translateX(-16px); }
}

.tt-victory-head {
  font-size: clamp(22px, 4.4vw, 40px);
  font-weight: 800;
  letter-spacing: 0.1em;
  text-align: center;
  line-height: 1.1;
  background: linear-gradient(176deg, #fffdf6, var(--gold) 54%, #a9741a);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 34px rgba(251, 191, 36, 0.6));
}

/* ---- final collapse into the dashboard ---- */
.tt-collapse {
  position: absolute;
  inset: 0;
  z-index: 40;
  background: radial-gradient(60% 60% at 50% 50%, rgba(165, 243, 252, 0.95), rgba(34, 211, 238, 0.55) 30%, rgba(2, 6, 23, 0.98) 72%);
  opacity: 0;
  animation: tt-collapse 900ms var(--ease) forwards;
}

@keyframes tt-collapse {
  0%   { opacity: 0; transform: scale(0.6); }
  45%  { opacity: 1; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); background: #020617; }
}

/* skip affordance */
.tt-skip {
  position: absolute;
  right: 26px; bottom: 24px;
  z-index: 50;
  pointer-events: auto;
  padding: 9px 16px;
  border: 1px solid rgba(125, 211, 252, 0.28);
  background: rgba(2, 6, 23, 0.5);
  color: rgba(159, 182, 200, 0.85);
  font-family: inherit;
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.3em;
  cursor: pointer;
  transition: color 200ms ease, border-color 200ms ease;
}
.tt-skip:hover { color: var(--ice); border-color: rgba(34, 211, 238, 0.7); }
.tt-skip:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }

/* screen-reader only */
.tt-sr {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

/* vignette + film grain, sits above everything visual */
.tt-grade {
  position: absolute;
  inset: 0;
  z-index: 12;
  pointer-events: none;
  background:
    radial-gradient(120% 90% at 50% 46%, transparent 38%, rgba(2, 6, 23, 0.55) 78%, rgba(1, 3, 12, 0.92) 100%);
}

.tt-grade::after {
  content: '';
  position: absolute; inset: -50%;
  opacity: 0.16;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  animation: tt-grain 700ms steps(4) infinite;
}

@keyframes tt-grain {
  0%   { transform: translate(0, 0); }
  25%  { transform: translate(-3%, 2%); }
  50%  { transform: translate(2%, -3%); }
  75%  { transform: translate(-2%, -2%); }
  100% { transform: translate(3%, 1%); }
}

/* ============================================================
   RESPONSIVE
   ============================================================ */

@media (max-width: 1024px) {
  .tt-orbit { display: none; }
  .tt-board { transform: translateZ(-1500px) scale(1.05); }
  .tt-athlete { opacity: 0.5; margin-left: -140px; }
}

@media (max-width: 760px) {
  .tt-stage { perspective: 1100px; }
  .tt-console-wrap { padding: 18px; align-items: end; padding-bottom: 34px; }
  .tt-console { transform: none !important; animation-duration: 900ms; }
  .tt-console-body { padding: 26px 22px 24px; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
  .tt-bokeh { display: none; }
  .tt-board { display: none; }
  .tt-athlete { opacity: 0.3; margin-top: -560px; }
  .tt-hud-item { font-size: 8.5px; letter-spacing: 0.22em; }
  .tt-hud-item[data-hide-mobile='1'] { display: none; }
  .tt-grade::after { display: none; }
  .tt-subtitle { margin-bottom: 24px; }
  .tt-six-word { letter-spacing: -0.02em; }
  .tt-victory { padding: 30px 24px; gap: 20px; }
}

/* ============================================================
   REDUCED MOTION — everything still looks expensive, nothing moves
   ============================================================ */

@media (prefers-reduced-motion: reduce) {
  .tt-root * {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
  .tt-world, .tt-console, .tt-bokeh, .tt-hud { transition: none; }
  .tt-grade::after { display: none; }
  .tt-bokeh { display: none; }
}

/* ---- guard against App.css element rules bleeding in ---- */
.tt-root :where(h1, h2, h3, p, span, small, strong, b, i, em, label, div, button, input) {
  color: inherit;
}

/* ---- caps lock ---- */
.tt-caps {
  display: flex; align-items: center; gap: 7px;
  margin: 9px 0 0;
  font-size: 9.5px; font-weight: 600; letter-spacing: 0.26em;
  color: var(--gold);
}

/* ---- console footer ---- */
.tt-foot {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; flex-wrap: wrap;
  margin-top: 16px;
}

.tt-back {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 13px;
  border: 1px solid rgba(125, 211, 252, 0.16);
  background: rgba(2, 6, 23, 0.5);
  color: var(--ink-2);
  font-family: inherit;
  font-size: 9.5px; font-weight: 600; letter-spacing: 0.2em;
  cursor: pointer;
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  transition: color 200ms ease, border-color 200ms ease, background 200ms ease;
}
.tt-back:hover { color: var(--ink-1); border-color: rgba(34, 211, 238, 0.6); background: rgba(34, 211, 238, 0.08); }
.tt-back:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }

.tt-secure {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 9px; font-weight: 500; letter-spacing: 0.22em;
  color: var(--ink-3);
}

/* ---- debug trace ---- */
.tt-trace {
  margin-top: 14px; padding-top: 12px;
  border-top: 1px solid rgba(125, 211, 252, 0.1);
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 11px; line-height: 1.7;
  color: var(--ink-2);
}
.tt-trace b { color: var(--cyan); }
`;

/** Injects the stylesheet once, at the top of the page. */
function TTStyles() {
  return <style>{TT_CSS}</style>;
}

/* ══════════════════════════════════════════════════════════════════════════
   ③ ENVIRONMENT CONSTANTS
   ══════════════════════════════════════════════════════════════════════════ */

const RIGS = [
  { left: "7%", height: "40vh", scale: 0.85 },
  { left: "21%", height: "52vh", scale: 1 },
  { left: "37%", height: "60vh", scale: 1.1 },
  { left: "63%", height: "60vh", scale: 1.1 },
  { left: "79%", height: "52vh", scale: 1 },
  { left: "93%", height: "40vh", scale: 0.85 },
];

const HOLO_SCREENS = [
  { left: "6%", top: "22%", width: "180px", height: "96px", rot: 26 },
  { left: "82%", top: "18%", width: "210px", height: "112px", rot: -28 },
  { left: "17%", top: "44%", width: "130px", height: "74px", rot: 18 },
  { left: "74%", top: "46%", width: "148px", height: "82px", rot: -16 },
];

const HUD = [
  { label: "STADIUM NETWORK", style: { left: "3.5%", top: "7%" } },
  { label: "AUTH NODE 01", style: { left: "3.5%", top: "11.4%" }, tone: "is-green" },
  { label: "ENCRYPTION ACTIVE", style: { left: "3.5%", top: "15.8%" }, hideMobile: true },
  { label: "SECURE CONNECTION", style: { right: "3.5%", top: "7%" }, tone: "is-green" },
  { label: "CORE ONLINE", style: { right: "3.5%", top: "11.4%" }, hideMobile: true },
  { label: "ACCESS LEVEL / ADMIN", style: { right: "3.5%", top: "15.8%" }, tone: "is-gold", hideMobile: true },
  { label: "LIVE SYSTEM", style: { left: "3.5%", bottom: "7%" }, hideMobile: true },
  { label: "FLOODLIGHT ARRAY / 06", style: { right: "3.5%", bottom: "7%" }, hideMobile: true },
];

/* ══════════════════════════════════════════════════════════════════════════
   ④ HOOKS
   ══════════════════════════════════════════════════════════════════════════ */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/** Rough device tier so we never ship a 900-particle field to a budget phone. */
function useDeviceTier() {
  return useMemo(() => {
    if (typeof window === "undefined") return "high";
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const cores = navigator.hardwareConcurrency || 4;
    const narrow = window.innerWidth < 760;
    if (narrow || (coarse && cores <= 4)) return "low";
    if (coarse || cores <= 6 || window.innerWidth < 1280) return "mid";
    return "high";
  }, []);
}

/**
 * Pointer parallax. Writes damped --px/--py straight onto the root node so the
 * whole scene re-composites on the GPU without a single React re-render.
 */
function usePointerParallax(rootRef, enabled) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let raf = 0;
    let idle = true;

    const onMove = (e) => {
      const p = e.touches ? e.touches[0] : e;
      target.x = (p.clientX / window.innerWidth) * 2 - 1;
      target.y = (p.clientY / window.innerHeight) * 2 - 1;
      if (idle) {
        idle = false;
        raf = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      root.style.setProperty("--px", current.x.toFixed(4));
      root.style.setProperty("--py", current.y.toFixed(4));
      const settled =
        Math.abs(target.x - current.x) < 0.0015 &&
        Math.abs(target.y - current.y) < 0.0015;
      if (settled) {
        idle = true;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [rootRef, enabled]);
}

/** Animates a numeric CSS custom property on the root over a duration. */
function useCssRamp(rootRef) {
  const frames = useRef({});
  return useCallback(
    (name, to, duration = 900) => {
      const root = rootRef.current;
      if (!root) return;
      cancelAnimationFrame(frames.current[name]);
      const from = parseFloat(getComputedStyle(root).getPropertyValue(name)) || 0;
      if (duration <= 0) {
        root.style.setProperty(name, String(to));
        return;
      }
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        root.style.setProperty(name, (from + (to - from) * eased).toFixed(4));
        if (t < 1) frames.current[name] = requestAnimationFrame(step);
      };
      frames.current[name] = requestAnimationFrame(step);
    },
    [rootRef]
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ⑤ PARTICLE + BALL ENGINE  (one canvas, one rAF loop, no libraries)
   ══════════════════════════════════════════════════════════════════════════ */

const TIER_COUNTS = { low: 90, mid: 220, high: 420 };

function StadiumCanvas({ engineRef, tier, paused }) {
  const canvasRef = useRef(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();

    const state = {
      mode: "idle",
      energy: 0,      // 0..1 — global intensity
      pointer: { x: 0.5, y: 0.5 },
      streaks: [],
      sparks: [],
      time: 0,
    };

    const dust = [];
    const COUNT = TIER_COUNTS[tier] ?? 220;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, tier === "low" ? 1.5 : 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      resetBall();
    };

    const rand = (a, b) => a + Math.random() * (b - a);

    function seed() {
      dust.length = 0;
      for (let i = 0; i < COUNT; i++) {
        // three depth bands: far dust, mid glow, near bokeh
        const band = i < COUNT * 0.55 ? 0 : i < COUNT * 0.88 ? 1 : 2;
        dust.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: band,
          r: band === 0 ? rand(0.4, 1) : band === 1 ? rand(0.9, 2) : rand(2.4, 5),
          vx: rand(-4, 4) * (band + 0.5),
          vy: rand(-14, -3) * (band * 0.5 + 0.6),
          a: band === 0 ? rand(0.12, 0.34) : band === 1 ? rand(0.2, 0.6) : rand(0.06, 0.2),
          hue: Math.random() < 0.78 ? "cyan" : Math.random() < 0.6 ? "violet" : "gold",
          ph: Math.random() * Math.PI * 2,
        });
      }
    }

    /* ── the cricket ball ─────────────────────────────────────────────── */
    const ball = { x: 0, y: 0, r: 26, rot: 0, vx: 0, vy: 0, trail: [], alpha: 1 };

    function resetBall() {
      ball.x = w * 0.74;
      ball.y = h * 0.42;
      ball.r = Math.max(16, Math.min(30, w * 0.019));
      ball.vx = 0;
      ball.vy = 0;
      ball.alpha = 1;
      ball.trail.length = 0;
    }

    const COLORS = {
      cyan: [34, 211, 238],
      violet: [139, 92, 246],
      gold: [251, 191, 36],
    };

    function drawBall(dt) {
      if (ball.alpha <= 0.01) return;
      const { x, y, r } = ball;

      // motion trail
      if (state.mode === "launch" || state.mode === "ascend") {
        ball.trail.push({ x, y, r, a: 1 });
        if (ball.trail.length > 26) ball.trail.shift();
      } else if (ball.trail.length) {
        ball.trail.shift();
      }

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < ball.trail.length; i++) {
        const t = ball.trail[i];
        const k = i / ball.trail.length;
        const g = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.r * (1.6 + k));
        g.addColorStop(0, `rgba(251,191,36,${0.32 * k * ball.alpha})`);
        g.addColorStop(0.5, `rgba(34,211,238,${0.16 * k * ball.alpha})`);
        g.addColorStop(1, "rgba(34,211,238,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r * (1.6 + k), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // bloom
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const bloom = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 3.4);
      bloom.addColorStop(0, `rgba(248,113,113,${0.3 * ball.alpha})`);
      bloom.addColorStop(0.45, `rgba(251,191,36,${0.12 * ball.alpha})`);
      bloom.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bloom;
      ctx.beginPath();
      ctx.arc(x, y, r * 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = ball.alpha;

      // leather body — light comes from upper left
      const body = ctx.createRadialGradient(
        x - r * 0.42, y - r * 0.46, r * 0.08,
        x, y, r * 1.06
      );
      body.addColorStop(0, "#c2483f");
      body.addColorStop(0.36, "#8e2420");
      body.addColorStop(0.74, "#4e1210");
      body.addColorStop(1, "#1d0707");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      // seam — an ellipse whose width tracks rotation, clipped to the sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.clip();

      const seamW = Math.abs(Math.cos(ball.rot)) * r * 0.92 + 0.6;
      const facing = Math.cos(ball.rot) > 0;
      ctx.translate(x, y);
      ctx.rotate(-0.34);
      ctx.strokeStyle = facing ? "rgba(255,244,232,0.85)" : "rgba(120,46,40,0.6)";
      ctx.lineWidth = Math.max(1.4, r * 0.075);
      ctx.beginPath();
      ctx.ellipse(0, 0, seamW, r * 0.985, 0, 0, Math.PI * 2);
      ctx.stroke();

      // stitching
      if (facing && r > 14) {
        ctx.strokeStyle = "rgba(255,238,220,0.7)";
        ctx.lineWidth = Math.max(0.8, r * 0.04);
        const steps = 16;
        for (let i = 0; i < steps; i++) {
          const a = (i / steps) * Math.PI * 2;
          const px = Math.cos(a) * seamW;
          const py = Math.sin(a) * r * 0.985;
          ctx.beginPath();
          ctx.moveTo(px - 1.6, py);
          ctx.lineTo(px + 1.6, py);
          ctx.stroke();
        }
      }

      // scuff / imperfection
      ctx.globalAlpha = ball.alpha * 0.25;
      ctx.fillStyle = "#2a0d0b";
      ctx.beginPath();
      ctx.ellipse(r * 0.34, r * 0.3, r * 0.3, r * 0.17, 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // specular highlight + rim light
      ctx.globalAlpha = ball.alpha;
      const spec = ctx.createRadialGradient(
        x - r * 0.4, y - r * 0.44, 0,
        x - r * 0.4, y - r * 0.44, r * 0.62
      );
      spec.addColorStop(0, "rgba(255,255,255,0.72)");
      spec.addColorStop(0.35, "rgba(255,220,200,0.16)");
      spec.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = spec;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(165,243,252,${0.42 + state.energy * 0.4})`;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.99, Math.PI * 0.62, Math.PI * 1.72);
      ctx.stroke();
      ctx.restore();

      ball.rot += dt * (state.mode === "idle" ? 0.5 : 4.5);
    }

    /* ── physics per mode ─────────────────────────────────────────────── */
    function stepBall(dt) {
      if (state.mode === "idle" || state.mode === "auth") {
        ball.x += (w * 0.74 - ball.x) * 0.04;
        ball.y = h * 0.42 + Math.sin(state.time * 0.9) * 10;
      } else if (state.mode === "launch") {
        // ball drives toward the batsman's contact point
        const tx = w * 0.4;
        const ty = h * 0.54;
        ball.x += (tx - ball.x) * dt * 4.2;
        ball.y += (ty - ball.y) * dt * 4.2;
        ball.r += (Math.min(w, h) * 0.05 - ball.r) * dt * 2.4;
      } else if (state.mode === "ascend") {
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
        ball.vy += 260 * dt; // gravity, losing to the launch velocity
        ball.r = Math.max(2, ball.r - dt * 26);
        if (ball.y < -h * 0.5) ball.alpha = Math.max(0, ball.alpha - dt * 1.4);
      } else if (state.mode === "dissolve") {
        ball.alpha = Math.max(0, ball.alpha - dt * 2);
      }
    }

    /* ── light streaks past camera during the dive ───────────────────── */
    function spawnStreak() {
      const edge = Math.random();
      state.streaks.push({
        x: w * 0.5 + (Math.random() - 0.5) * w * 1.2,
        y: h * 0.5 + (Math.random() - 0.5) * h * 1.2,
        len: rand(60, 260),
        a: 1,
        s: rand(900, 2200),
        c: edge > 0.75 ? "gold" : "cyan",
      });
    }

    function burst(x, y, n, power) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = rand(140, 1000) * power;
        state.sparks.push({
          x, y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v - rand(0, 200),
          r: rand(1, 3.6),
          a: 1,
          c: Math.random() < 0.55 ? "gold" : Math.random() < 0.6 ? "cyan" : "violet",
        });
      }
    }

    /* ── main loop ────────────────────────────────────────────────────── */
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      state.time += dt;

      ctx.clearRect(0, 0, w, h);

      const speed = 1 + state.energy * 7;
      const cx = state.pointer.x * w;
      const cy = state.pointer.y * h;

      // dust
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < dust.length; i++) {
        const p = dust[i];
        p.x += (p.vx * dt * speed) + Math.sin(state.time * 0.5 + p.ph) * 0.24;
        p.y += p.vy * dt * speed;

        // gentle pointer repulsion, near layers react most
        if (p.z > 0) {
          const dx = p.x - cx;
          const dy = p.y - cy;
          const d2 = dx * dx + dy * dy;
          if (d2 < 26000) {
            const f = (1 - d2 / 26000) * p.z * 0.6;
            p.x += dx * f * dt * 3;
            p.y += dy * f * dt * 3;
          }
        }

        if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        const [r, g, b] = COLORS[p.hue];
        const tw = 0.6 + Math.sin(state.time * 1.6 + p.ph) * 0.4;
        const alpha = p.a * tw * (0.7 + state.energy * 0.6);

        if (p.z === 2) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
          grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
          grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // streaks
      if (state.mode === "auth" || state.mode === "launch") {
        if (Math.random() < 0.5) spawnStreak();
      }
      if (state.streaks.length) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.lineCap = "round";
        for (let i = state.streaks.length - 1; i >= 0; i--) {
          const s = state.streaks[i];
          const dx = s.x - w * 0.5;
          const dy = s.y - h * 0.5;
          const dist = Math.hypot(dx, dy) || 1;
          const ux = dx / dist;
          const uy = dy / dist;
          s.x += ux * s.s * dt;
          s.y += uy * s.s * dt;
          s.a -= dt * 1.1;
          if (s.a <= 0) { state.streaks.splice(i, 1); continue; }
          const [r, g, b] = COLORS[s.c];
          ctx.strokeStyle = `rgba(${r},${g},${b},${s.a * 0.75})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - ux * s.len, s.y - uy * s.len);
          ctx.stroke();
        }
        ctx.restore();
      }

      // sparks
      if (state.sparks.length) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (let i = state.sparks.length - 1; i >= 0; i--) {
          const s = state.sparks[i];
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          s.vy += 420 * dt;
          s.vx *= 0.985;
          s.a -= dt * 0.75;
          if (s.a <= 0) { state.sparks.splice(i, 1); continue; }
          const [r, g, b] = COLORS[s.c];
          ctx.fillStyle = `rgba(${r},${g},${b},${s.a})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      stepBall(dt);
      drawBall(dt);
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);

    const onPointer = (e) => {
      state.pointer.x = e.clientX / window.innerWidth;
      state.pointer.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // imperative handle used by the cinematic timeline
    engineRef.current = {
      setMode(mode) {
        state.mode = mode;
        if (mode === "ascend") {
          ball.vx = -w * 0.26;
          ball.vy = -h * 1.5;
        }
        if (mode === "idle") resetBall();
      },
      setEnergy(v) { state.energy = v; },
      impact() {
        burst(ball.x, ball.y, TIER_COUNTS[tier] > 200 ? 160 : 70, 1);
        for (let i = 0; i < 26; i++) spawnStreak();
      },
      dissolve() {
        state.mode = "dissolve";
        burst(w * 0.5, h * 0.5, TIER_COUNTS[tier] > 200 ? 220 : 90, 1.6);
      },
      nudge() { burst(ball.x, ball.y, 24, 0.5); },
    };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      engineRef.current = null;
    };
  }, [engineRef, tier]);

  return <canvas ref={canvasRef} className="tt-canvas" aria-hidden="true" style={{ opacity: paused ? 0.35 : 1 }} />;
}

/* ══════════════════════════════════════════════════════════════════════════
   ⑥ ATHLETE  —  stylised silhouette, no likeness, rim-lit
   ══════════════════════════════════════════════════════════════════════════ */

function Athlete({ swinging }) {
  return (
    <div className={`tt-plane tt-athlete${swinging ? " is-swinging" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 460 620" fill="none">
        <defs>
          <linearGradient id="ttBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0b1a2e" />
            <stop offset="55%" stopColor="#050d1c" />
            <stop offset="100%" stopColor="#01050e" />
          </linearGradient>
          <linearGradient id="ttRim" x1="0" y1="0" x2="1" y2="0.4">
            <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#22d3ee" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="ttBat" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#233247" />
            <stop offset="34%" stopColor="#7e8fa6" />
            <stop offset="52%" stopColor="#e8f4ff" />
            <stop offset="70%" stopColor="#5d6e85" />
            <stop offset="100%" stopColor="#111d2e" />
          </linearGradient>
          <linearGradient id="ttHelmet" x1="0.2" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="#dff4ff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#254058" />
            <stop offset="100%" stopColor="#040b16" />
          </linearGradient>
          <radialGradient id="ttShadow" cx="0.5" cy="0.5">
            <stop offset="0%" stopColor="#000" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* contact shadow */}
        <ellipse cx="228" cy="592" rx="150" ry="26" fill="url(#ttShadow)" />

        <g className="tt-breathe">
          {/* back leg + pad */}
          <path d="M196 352 L176 470 Q170 520 182 566 L224 566 Q218 510 224 466 L244 360 Z"
            fill="url(#ttBody)" stroke="url(#ttRim)" strokeWidth="1.6" />
          {/* front leg + pad */}
          <path d="M246 352 L282 468 Q292 516 286 566 L246 566 Q252 512 240 470 L214 362 Z"
            fill="url(#ttBody)" stroke="url(#ttRim)" strokeWidth="1.6" />
          {/* pad straps */}
          <g stroke="#22d3ee" strokeOpacity="0.4" strokeWidth="1.4">
            <path d="M180 442 L232 438" /><path d="M176 486 L230 484" /><path d="M180 528 L228 528" />
            <path d="M250 444 L288 452" /><path d="M246 490 L290 496" /><path d="M248 532 L288 536" />
          </g>
          {/* boots */}
          <path d="M178 566 Q164 578 166 590 L232 590 L232 566 Z" fill="#020914" stroke="url(#ttRim)" strokeWidth="1.2" />
          <path d="M246 566 L246 590 L312 590 Q310 576 292 566 Z" fill="#020914" stroke="url(#ttRim)" strokeWidth="1.2" />

          {/* torso */}
          <path d="M198 186 Q176 206 172 262 L182 356 Q222 372 262 354 L270 258 Q266 204 244 186 Z"
            fill="url(#ttBody)" stroke="url(#ttRim)" strokeWidth="2" />
          {/* chest rim highlight */}
          <path d="M200 192 Q182 216 180 262 L186 344" stroke="#a5f3fc" strokeOpacity="0.55" strokeWidth="2.4" fill="none" />

          {/* head + helmet */}
          <g>
            <path d="M206 128 Q206 96 232 96 Q258 96 258 128 L256 150 Q232 164 208 150 Z"
              fill="url(#ttHelmet)" stroke="url(#ttRim)" strokeWidth="1.8" />
            {/* peak */}
            <path d="M202 122 L268 116 L266 128 L204 132 Z" fill="#071426" stroke="url(#ttRim)" strokeWidth="1.2" />
            {/* grille */}
            <g stroke="#a5f3fc" strokeOpacity="0.6" strokeWidth="1.5">
              <path d="M240 136 L266 134" /><path d="M240 146 L266 144" /><path d="M244 156 L264 154" />
            </g>
            {/* helmet specular */}
            <path d="M212 108 Q224 100 238 102" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            {/* neck / shoulders */}
            <path d="M216 158 L216 186 L248 186 L248 158 Z" fill="#030a16" />
          </g>

          {/* arms + bat — rotates on impact */}
          <g className="tt-swing-group">
            <path d="M200 196 Q166 226 168 268 L182 300 Q198 296 200 276 L206 232 Z"
              fill="url(#ttBody)" stroke="url(#ttRim)" strokeWidth="1.6" />
            <path d="M244 196 Q278 226 276 268 L262 300 Q246 296 244 276 L238 232 Z"
              fill="url(#ttBody)" stroke="url(#ttRim)" strokeWidth="1.6" />
            {/* gloves */}
            <rect x="166" y="288" width="34" height="30" rx="10" fill="#0b1a2e" stroke="url(#ttRim)" strokeWidth="1.4" />
            <rect x="248" y="288" width="34" height="30" rx="10" fill="#0b1a2e" stroke="url(#ttRim)" strokeWidth="1.4" />
            {/* bat handle */}
            <rect x="200" y="300" width="14" height="70" rx="6" fill="#16202f" stroke="url(#ttRim)" strokeWidth="1.2" />
            {/* bat blade */}
            <path d="M194 366 L222 366 L228 492 Q208 502 188 492 Z"
              fill="url(#ttBat)" stroke="#dff4ff" strokeOpacity="0.5" strokeWidth="1.4" />
            <path d="M206 372 L210 486" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ⑦ ENVIRONMENT
   ══════════════════════════════════════════════════════════════════════════ */

function Environment({ litCount, swinging, tier, igniting }) {
  return (
    <div className="tt-stage" aria-hidden="true">
      <div className="tt-world">
        <div className="tt-plane tt-sky" />

        <div className="tt-plane tt-bowl">
          <div className="tt-crowd" />
        </div>

        {/* floodlight rigs */}
        <div
          className={`tt-plane tt-rigs${igniting ? " is-igniting" : ""}`}
          style={{
            width: "240vw",
            height: "70vh",
            margin: "-72vh 0 0 -120vw",
            transform: "translateZ(-1600px) translate3d(calc(var(--px) * -18px), calc(var(--py) * -10px), 0)",
          }}
        >
          {RIGS.map((rig, i) => (
            <div
              key={rig.left}
              className="tt-rig"
              data-lit={i < litCount ? 1 : 0}
              style={{ left: rig.left, height: rig.height, width: "120px", marginLeft: "-60px", transform: `scale(${rig.scale})` }}
            >
              <div className="tt-rig-mast" />
              <div className="tt-rig-head" />
              {tier !== "low" && <div className="tt-beam" />}
            </div>
          ))}
        </div>

        {/* distant holographic displays */}
        <div
          className="tt-plane"
          style={{
            width: "180vw",
            height: "80vh",
            margin: "-56vh 0 0 -90vw",
            transform: "translateZ(-1400px) translate3d(calc(var(--px) * -24px), calc(var(--py) * -13px), 0)",
          }}
        >
          {HOLO_SCREENS.map((s) => (
            <div
              key={s.left + s.top}
              className="tt-holo"
              style={{
                left: s.left,
                top: s.top,
                width: s.width,
                height: s.height,
                transform: `rotateY(${s.rot}deg)`,
              }}
            />
          ))}
        </div>

        <div className="tt-plane tt-field">
          <div className="tt-rope" />
          <div className="tt-pitch" />
        </div>

        <Athlete swinging={swinging} />

        <div className="tt-haze" />
      </div>
    </div>
  );
}

function Scoreboard({ line, victory }) {
  return (
    <div className={`tt-plane tt-board${victory ? " is-victory" : ""}`} aria-hidden="true">
      <div className="tt-board-strip">
        <span>TOXICTIDE ARENA</span>
        <span>NIGHT SESSION</span>
      </div>
      <div className="tt-board-main">{line}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ⑧ CINEMATIC TIMELINE
   ══════════════════════════════════════════════════════════════════════════ */

const CINEMATIC = [
  { at: 0, phase: "awaken", board: "AUTHENTICATION VERIFIED" },
  { at: 1200, board: "ACCESS GRANTED" },
  { at: 1900, phase: "dive" },
  { at: 2700, phase: "ball" },
  { at: 3100, swing: true },
  { at: 3520, phase: "impact" },
  { at: 3700, phase: "ascend" },
  { at: 4700, phase: "six" },
  { at: 6500, phase: "champion" },
  { at: 8700, phase: "collapse" },
  { at: 9500, phase: "done" },
];

/* ══════════════════════════════════════════════════════════════════════════
   ⑨ THE PAGE
   ══════════════════════════════════════════════════════════════════════════ */

export default function AdminLogin() {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const engineRef = useRef(null);
  const timers = useRef([]);

  const reduced = useReducedMotion();
  const tier = useDeviceTier();
  const ramp = useCssRamp(rootRef);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rejected, setRejected] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [trace, setTrace] = useState([]);

  const addTrace = (step, detail) => setTrace((t) => [...t, { step, detail }]);

  const [phase, setPhase] = useState("idle");
  const [boardLine, setBoardLine] = useState("SYSTEM STANDBY");
  const [litCount, setLitCount] = useState(RIGS.length);
  const [swinging, setSwinging] = useState(false);
  const [shock, setShock] = useState(false);

  const cinematic = phase !== "idle";

  usePointerParallax(rootRef, !reduced && tier !== "low");

  // intro camera push-in
  useEffect(() => {
    ramp("--cam", 1, reduced ? 0 : 3600);
  }, [ramp, reduced]);

  // Caps Lock watcher — the commonest cause of a "wrong password" that was
  // actually typed correctly, so it is worth surfacing.
  useEffect(() => {
    const check = (e) => {
      if (typeof e.getModifierState === "function") {
        setCapsLock(e.getModifierState("CapsLock"));
      }
    };
    window.addEventListener("keydown", check);
    window.addEventListener("keyup", check);
    return () => {
      window.removeEventListener("keydown", check);
      window.removeEventListener("keyup", check);
    };
  }, []);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const schedule = (fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  };

  /* ── the success cinematic ──────────────────────────────────────────── */
  const runCinematic = useCallback(() => {
    if (reduced) {
      setPhase("collapse");
      schedule(() => navigate("/admin", { replace: true }), 450);
      return;
    }

    setPhase("awaken");
    setLitCount(0);

    // floodlights strike one by one
    RIGS.forEach((_, i) => schedule(() => setLitCount(i + 1), 160 + i * 130));
    ramp("--heat", 1, 2200);

    CINEMATIC.forEach((cue) => {
      schedule(() => {
        if (cue.board) setBoardLine(cue.board);
        if (cue.swing) setSwinging(true);
        if (!cue.phase) return;

        setPhase(cue.phase);
        const e = engineRef.current;

        switch (cue.phase) {
          case "dive":
            ramp("--dive", 1, 2400);
            e?.setEnergy(0.75);
            e?.setMode("auth");
            break;
          case "ball":
            e?.setMode("launch");
            break;
          case "impact":
            e?.impact();
            e?.setEnergy(1);
            setShock(true);
            schedule(() => setShock(false), 950);
            break;
          case "ascend":
            e?.setMode("ascend");
            break;
          case "six":
            setBoardLine("SIX");
            break;
          case "champion":
            setBoardLine("CHAMPION MODE");
            break;
          case "collapse":
            e?.dissolve();
            break;
          case "done":
            navigate("/admin", { replace: true });
            break;
          default:
            break;
        }
      }, cue.at);
    });
  }, [navigate, ramp, reduced]);

  const skip = useCallback(() => {
    clearTimers();
    navigate("/admin", { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (!cinematic) return;
    const onKey = (e) => { if (e.key === "Escape") skip(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cinematic, skip]);

  /* ── submit — YOUR ORIGINAL LOGIC, unchanged in every observable way ─── */
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Never fire a second request while one is in flight — a double click on a
    // slow connection would otherwise open two sessions.
    if (loading || cinematic) return;

    setError("");
    setRejected(false);
    setTrace([]);

    if (!username.trim() || !password) {
      setError("Please enter both your username and password.");
      setRejected(true);
      setTimeout(() => setRejected(false), 620);
      return;
    }

    setLoading(true);
    engineRef.current?.nudge();
    engineRef.current?.setEnergy(0.45);
    ramp("--heat", 0.45, 500);

    const url = `${API_BASE}/admin/login`;
    const startedAt = Date.now();
    if (DEBUG) addTrace("Request", `POST ${url}`);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (DEBUG) addTrace("Response", `${response.status} in ${Date.now() - startedAt}ms`);

      // Guarded parse: if the server is down or a proxy returns an HTML error
      // page, response.json() throws, and the catch below would blame the
      // connection for what is really a server fault.
      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        // A rejected login gets the security response — NOT the cinematic.
        fail(data.error || "Invalid admin username or password.");
        setPassword("");
        return;
      }

      // ── SUCCESS — identical keys and values to your original ────────────
      if (!data.token) {
  fail("Login succeeded but no token was returned.");
  return;
}
saveAdminSession(data.token, data.admin?.username ?? username);
      if (DEBUG) addTrace("Session", "Saved toxictideAdmin = true");

      runCinematic();
    } catch (err) {
      console.error("Admin login error:", err);
      if (DEBUG) addTrace("FAILED", String(err?.message || err));

      // A rejected fetch means no response arrived at all. In order of
      // likelihood: CORS is not enabled on the backend, the backend is not
      // running, the port is wrong, or an extension blocked the request.
      fail(
        "Unable to connect to the ToxicTide server. Check that the backend is " +
          "running on port 5000 and that CORS is enabled on it."
      );
    }
  };

  /** Security-failure response: red pulse, shake, message, back to normal. */
  function fail(message) {
    setLoading(false);
    setError(message);
    setRejected(true);
    engineRef.current?.setEnergy(0);
    ramp("--heat", 0, 600);
    setTimeout(() => setRejected(false), 620);
  }

  const statusText = cinematic
    ? "ACCESS GRANTED"
    : loading
    ? "AUTHENTICATING"
    : error
    ? "SECURITY CHECK FAILED"
    : "AWAITING CREDENTIALS";

  const bokeh = useMemo(
    () =>
      Array.from({ length: tier === "high" ? 14 : 7 }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        size: 10 + ((i * 13) % 26),
        dur: 16 + ((i * 7) % 18),
        delay: -(i * 3.1),
      })),
    [tier]
  );

  return (
    <div className={`tt-root${shock ? " tt-shake" : ""}`} ref={rootRef}>
      <TTStyles />
      <Environment litCount={litCount} swinging={swinging} tier={tier} igniting={cinematic} />

      <div className="tt-stage" aria-hidden="true">
        <div className="tt-world">
          <Scoreboard line={boardLine} victory={phase === "champion" || phase === "six"} />
        </div>
      </div>

      <StadiumCanvas engineRef={engineRef} tier={tier} paused={false} />

      {tier === "high" && !reduced && (
        <div className="tt-bokeh" aria-hidden="true">
          {bokeh.map((b, i) => (
            <i
              key={i}
              style={{
                left: b.left,
                top: b.top,
                width: b.size,
                height: b.size,
                animationDuration: `${b.dur}s`,
                animationDelay: `${b.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="tt-hud" aria-hidden="true">
        {!reduced && tier === "high" && (
          <>
            <div className="tt-orbit" />
            <div className="tt-orbit is-inner" />
          </>
        )}
        {HUD.map((item) => (
          <div
            key={item.label}
            className={`tt-hud-item ${item.tone || ""}`}
            data-hide-mobile={item.hideMobile ? 1 : 0}
            style={item.style}
          >
            {item.label}
          </div>
        ))}
        <div className="tt-hud-rule" style={{ left: "3.5%", top: "20.4%", width: "150px" }} />
        <div
          className="tt-hud-rule"
          style={{ right: "3.5%", top: "20.4%", width: "150px", transform: "scaleX(-1)" }}
        />
      </div>

      <div className="tt-grade" aria-hidden="true" />

      {/* ── console ─────────────────────────────────────────────────────── */}
      <div className="tt-console-wrap">
        <div
          className={`tt-console${rejected ? " is-rejected" : ""}${loading ? " is-locked" : ""}${
            cinematic ? " is-dissolving" : ""
          }`}
        >
          <div className="tt-console-halo" aria-hidden="true" />

          <form className="tt-console-body" onSubmit={handleSubmit} noValidate>
            <div className="tt-console-edge" aria-hidden="true">
              <i /><i />
            </div>
            <span className="tt-bracket tl" aria-hidden="true" />
            <span className="tt-bracket tr" aria-hidden="true" />
            <span className="tt-bracket bl" aria-hidden="true" />
            <span className="tt-bracket br" aria-hidden="true" />
            {loading && <div className="tt-lockscan" aria-hidden="true" />}

            <div className="tt-meta">
              <span><i className="tt-led" />NODE 01 / ONLINE</span>
              <span>TLS 1.3</span>
            </div>

            <h1 className="tt-title">TOXICTIDE</h1>
            <p className="tt-subtitle">SECURE ACCESS TERMINAL</p>

            {error && (
              <div className="tt-alert" role="alert">
                <span className="tt-alert-mark" aria-hidden="true">!</span>
                <div>
                  <div className="tt-alert-head">SECURITY CHECK FAILED</div>
                  <div className="tt-alert-body">{error}</div>
                </div>
              </div>
            )}

            <div className="tt-field-group">
              <label className="tt-label" htmlFor="tt-username">OPERATOR ID</label>
              <div className="tt-input-shell">
                <span className="tt-ring" aria-hidden="true" />
                <input
                  id="tt-username"
                  className="tt-input"
                  type="text"
                  name="username"
                  autoComplete="username"
                  spellCheck="false"
                  autoFocus
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading || cinematic}
                  required
                />
              </div>
            </div>

            <div className="tt-field-group is-secure">
              <label className="tt-label" htmlFor="tt-password">ACCESS KEY</label>
              <div className="tt-input-shell has-action">
                <span className="tt-ring" aria-hidden="true" />
                <input
                  id="tt-password"
                  className="tt-input"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || cinematic}
                  required
                />
                <button
                  type="button"
                  className={`tt-reveal${showPassword ? " is-on" : ""}`}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                    <path d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                    <path className="tt-slash" d="M4 20 20 4" />
                  </svg>
                </button>
              </div>
              {capsLock && (
                <p className="tt-caps">
                  <span aria-hidden="true">&#8682;</span> CAPS LOCK IS ON
                </p>
              )}
            </div>

            <button
              type="submit"
              className={`tt-ignite${loading ? " is-working" : ""}`}
              disabled={loading || cinematic}
            >
              <span className="tt-ignite-core" aria-hidden="true" />
              <span className="tt-ignite-sweep" aria-hidden="true" />
              <span className="tt-ignite-label">
                {loading ? "AUTHENTICATING" : "INITIATE ACCESS"}
              </span>
            </button>

            <div className="tt-status">
              <span>STATUS / <b className={!loading && !error ? "is-live" : ""}>{statusText}</b></span>
              <span>ENCRYPTED</span>
            </div>

            <div className="tt-foot">
              <button type="button" className="tt-back" onClick={() => navigate("/")}>
                <span aria-hidden="true">&#8592;</span> Back to ToxicTide
              </button>
              <span className="tt-secure">
                <span aria-hidden="true">&#128274;</span> Authorised personnel only
              </span>
            </div>

            {DEBUG && trace.length > 0 && (
              <div className="tt-trace">
                {trace.map((t, i) => (
                  <div key={i}><b>{t.step}</b> {t.detail}</div>
                ))}
              </div>
            )}

            <p className="tt-sr" role="status" aria-live="polite">
              {cinematic
                ? "Authentication verified. Opening the admin dashboard."
                : loading
                ? "Verifying your credentials."
                : error || "Sign in to the admin dashboard."}
            </p>
          </form>
        </div>
      </div>

      {/* ── cinematic overlay ───────────────────────────────────────────── */}
      {cinematic && (
        <div className="tt-cine">
          <div className={`tt-flash${shock ? " is-firing" : ""}`} aria-hidden="true" />
          <div className={`tt-shock${shock ? " is-firing" : ""}`} aria-hidden="true" />

          {(phase === "awaken" || phase === "dive") && (
            <div className="tt-caption">
              {boardLine}
              <small>TOXICTIDE SECURE CORE / SESSION ESTABLISHED</small>
            </div>
          )}

          {phase === "six" && (
            <div className="tt-six">
              <div className="tt-six-word" data-word="SIX">SIX</div>
              <div className="tt-six-rule" />
              <div className="tt-six-sub">CLEARED THE ROOF</div>
            </div>
          )}

          {phase === "champion" && (
            <div className="tt-victory">
              <div className="tt-victory-head">CHAMPION MODE ACTIVATED</div>
              <div className="tt-victory-rows">
                <div className="tt-victory-row"><span>ACCESS GRANTED</span><b>VERIFIED</b></div>
                <div className="tt-victory-row"><span>SYSTEM ONLINE</span><b>ALL NODES</b></div>
                <div className="tt-victory-row">
                  <span>WELCOME BACK</span>
                  <b>{(username || "ADMIN").toUpperCase()}</b>
                </div>
              </div>
            </div>
          )}

          {phase === "collapse" && <div className="tt-collapse" aria-hidden="true" />}

          <button type="button" className="tt-skip" onClick={skip}>
            SKIP / ESC
          </button>
        </div>
      )}
    </div>
  );
}
