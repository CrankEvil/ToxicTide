import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAdminSession } from "../adminApi";

import "../App.css";


const TC_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

.tc-root {
  --abyss: #020914;
  --deep: #041a2f;
  --cyan: #00e5ff;
  --aqua: #00ffd5;
  --electric: #147dff;
  --violet: #725cff;
  --warn: #ffb547;
  --danger: #ff5c6c;

  --ink-1: #e8fbff;
  --ink-2: #93b4c8;
  --ink-3: #5c7d94;

  --ease: cubic-bezier(0.22, 1, 0.36, 1);

  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background: var(--abyss);
  color: var(--ink-1);
  color-scheme: dark;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  font-feature-settings: 'ss01', 'tnum';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.tc-root *, .tc-root *::before, .tc-root *::after {
  box-sizing: border-box;
}

.tc-root :where(h1, h2, h3, h4, p, span, small, strong, b, em, i, li, label, div, button) {
  color: inherit;
}


/* ============================================================
   ENVIRONMENT
   ============================================================ */

.tc-env {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.tc-env-deep {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(90% 60% at 50% 108%, rgba(0, 229, 255, 0.16) 0%, transparent 62%),
    radial-gradient(60% 46% at 12% 8%, rgba(20, 125, 255, 0.16) 0%, transparent 64%),
    radial-gradient(52% 44% at 88% 14%, rgba(114, 92, 255, 0.13) 0%, transparent 66%),
    linear-gradient(180deg, #010509 0%, #020914 38%, #041a2f 100%);
}

.tc-env-shafts {
  position: absolute;
  left: -10%;
  right: -10%;
  top: -20%;
  height: 130%;
  background:
    linear-gradient(97deg, transparent 18%, rgba(0, 229, 255, 0.07) 24%, transparent 30%),
    linear-gradient(86deg, transparent 44%, rgba(0, 255, 213, 0.05) 49%, transparent 55%),
    linear-gradient(94deg, transparent 68%, rgba(20, 125, 255, 0.06) 74%, transparent 80%);
  filter: blur(22px);
  mix-blend-mode: screen;
  animation: tcShafts 34s ease-in-out infinite alternate;
}

@keyframes tcShafts {
  from {
    transform: translate3d(-2%, 0, 0) scaleY(1);
    opacity: 0.8;
  }

  to {
    transform: translate3d(2%, -3%, 0) scaleY(1.06);
    opacity: 1;
  }
}

.tc-env-water {
  position: absolute;
  inset: -30%;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.012 0.03' numOctaves='3' seed='7'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23w)'/%3E%3C/svg%3E");
  animation: tcWater 46s linear infinite alternate;
}

@keyframes tcWater {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }

  to {
    transform: translate3d(3%, -4%, 0) scale(1.12);
  }
}

.tc-env-motes {
  position: absolute;
  inset: 0;
}

.tc-env-motes i {
  position: absolute;
  bottom: -6vh;
  border-radius: 50%;
  background: radial-gradient(
    50% 50% at 50% 50%,
    rgba(0, 255, 213, 0.55),
    rgba(0, 229, 255, 0.05) 70%,
    transparent
  );
  animation: tcRise linear infinite;
}

@keyframes tcRise {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 0;
  }

  12% {
    opacity: 0.7;
  }

  84% {
    opacity: 0.5;
  }

  100% {
    transform: translate3d(34px, -108vh, 0);
    opacity: 0;
  }
}

.tc-env-grade {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    130% 90% at 50% 40%,
    transparent 42%,
    rgba(1, 5, 9, 0.6) 82%,
    rgba(1, 4, 8, 0.94) 100%
  );
}


/* ============================================================
   SHELL
   ============================================================ */

.tc-shell {
  position: relative;
  z-index: 1;
  width: min(1240px, 100%);
  margin: 0 auto;
  padding: 0 clamp(16px, 3vw, 40px) 80px;
}

.tc-stage {
  opacity: 0;
  transform: translateY(22px);
}

.tc-root.is-ready .tc-stage {
  animation: tcStageIn 900ms var(--ease) both;
  animation-delay: var(--tc-delay, 0ms);
}

@keyframes tcStageIn {
  from {
    opacity: 0;
    transform: translateY(22px);
    filter: blur(8px);
  }

  to {
    opacity: 1;
    transform: none;
    filter: blur(0);
  }
}

.tc-reveal {
  opacity: 0;
  transform: translateY(26px);
  transition:
    opacity 700ms var(--ease),
    transform 700ms var(--ease);
}

.tc-reveal.is-in {
  opacity: 1;
  transform: none;
}


/* ============================================================
   HEADER
   ============================================================ */

.tc-header {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: clamp(30px, 6vh, 64px);
  padding: 16px 0;
  background: linear-gradient(
    180deg,
    rgba(2, 9, 20, 0.92) 40%,
    rgba(2, 9, 20, 0)
  );
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.tc-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.tc-brand-mark {
  position: relative;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border: 1px solid rgba(0, 229, 255, 0.28);
  background: linear-gradient(
    150deg,
    rgba(0, 229, 255, 0.14),
    rgba(114, 92, 255, 0.1)
  );
  clip-path: polygon(
    50% 0,
    100% 26%,
    100% 74%,
    50% 100%,
    0 74%,
    0 26%
  );
  box-shadow:
    0 0 26px rgba(0, 229, 255, 0.22),
    inset 0 0 18px rgba(0, 229, 255, 0.12);
}

.tc-brand-mark svg {
  width: 22px;
  height: 22px;
}

.tc-brand-name {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.24em;
  line-height: 1;
  color: var(--ink-1);
}

.tc-brand-sub {
  margin: 5px 0 0;
  font-size: 8.5px;
  font-weight: 600;
  letter-spacing: 0.34em;
  color: var(--ink-3);
}

.tc-header-right {
  display: flex;
  align-items: center;
  gap: clamp(10px, 2vw, 22px);
}

.tc-readouts {
  display: flex;
  gap: 22px;
}

.tc-readout {
  display: grid;
  gap: 5px;
}

.tc-readout-key {
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: var(--ink-3);
}

.tc-readout-val {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--ink-2);
}

.tc-dot {
  width: 6px;
  height: 6px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--aqua);
  box-shadow: 0 0 10px var(--aqua);
  animation: tcBreath 2.8s ease-in-out infinite;
}

.tc-dot.is-cyan {
  background: var(--cyan);
  box-shadow: 0 0 10px var(--cyan);
}

.tc-dot.is-violet {
  background: var(--violet);
  box-shadow: 0 0 10px var(--violet);
}

.tc-dot.is-warn {
  background: var(--warn);
  box-shadow: 0 0 10px var(--warn);
}

@keyframes tcBreath {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(0.82);
  }

  50% {
    opacity: 1;
    transform: scale(1.12);
  }
}


/* ============================================================
   TERMINATE BUTTON
   ============================================================ */

.tc-terminate {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 11px 18px;
  border: 1px solid rgba(255, 92, 108, 0.32);
  background: linear-gradient(
    180deg,
    rgba(38, 10, 18, 0.5),
    rgba(10, 6, 14, 0.4)
  );
  color: #ffc3ca;
  font-family: inherit;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.26em;
  cursor: pointer;
  clip-path: polygon(
    0 0,
    calc(100% - 11px) 0,
    100% 11px,
    100% 100%,
    11px 100%,
    0 calc(100% - 11px)
  );
  transition:
    color 240ms ease,
    border-color 240ms ease,
    box-shadow 300ms ease,
    transform 240ms var(--ease);
}

.tc-terminate svg {
  width: 14px;
  height: 14px;
}

.tc-terminate::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: -70%;
  width: 50%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 190, 200, 0.3),
    transparent
  );
  transform: skewX(-18deg);
  transition: left 700ms var(--ease);
}

.tc-terminate:hover {
  color: #fff;
  border-color: rgba(255, 92, 108, 0.85);
  box-shadow:
    0 0 34px rgba(255, 92, 108, 0.28),
    inset 0 0 26px rgba(255, 92, 108, 0.12);
  transform: translateY(-1px);
}

.tc-terminate:hover::after {
  left: 120%;
}

.tc-terminate:focus-visible {
  outline: 2px solid var(--danger);
  outline-offset: 3px;
}

.tc-terminate.is-firing {
  animation: tcTerminate 260ms ease-in both;
}

@keyframes tcTerminate {
  0% {
    transform: scale(1);
  }

  40% {
    transform: scale(0.94);
    box-shadow: 0 0 60px rgba(255, 92, 108, 0.6);
  }

  100% {
    transform: scale(0.9);
    opacity: 0.4;
  }
}


/* ============================================================
   HERO
   ============================================================ */

.tc-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 480px);
  align-items: center;
  gap: clamp(24px, 4vw, 60px);
  padding-bottom: clamp(40px, 8vh, 90px);
}

.tc-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 20px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.4em;
  color: var(--cyan);
}

.tc-eyebrow::after {
  content: "";
  flex: 1;
  height: 1px;
  max-width: 120px;
  background: linear-gradient(
    90deg,
    rgba(0, 229, 255, 0.6),
    transparent
  );
}

.tc-hero-title {
  margin: 0;
  font-size: clamp(46px, 8.4vw, 104px);
  font-weight: 900;
  letter-spacing: -0.045em;
  line-height: 0.86;
  background: linear-gradient(
    174deg,
    #ffffff 0%,
    #c8f6ff 34%,
    #4fa9c9 72%,
    #1c5170 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 40px rgba(0, 229, 255, 0.28));
}

.tc-hero-line {
  margin: 18px 0 0;
  font-size: clamp(11px, 1.5vw, 14px);
  font-weight: 600;
  letter-spacing: 0.28em;
  color: var(--ink-2);
}

.tc-hero-rule {
  width: 100%;
  max-width: 420px;
  height: 1px;
  margin: 28px 0;
  background: linear-gradient(
    90deg,
    rgba(0, 229, 255, 0.5),
    rgba(114, 92, 255, 0.18),
    transparent
  );
}

.tc-hero-verbs {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(14px, 3vw, 34px);
}

.tc-hero-verb {
  margin: 0;
  font-size: clamp(16px, 2.3vw, 26px);
  font-weight: 300;
  letter-spacing: 0.02em;
  color: var(--ink-2);
}

.tc-hero-verb b {
  font-weight: 700;
  color: var(--ink-1);
}

.tc-hero-note {
  margin: 30px 0 0;
  max-width: 46ch;
  font-size: 14px;
  line-height: 1.65;
  color: var(--ink-2);
}


/* ============================================================
   HYDRO CORE
   ============================================================ */

.tc-core-wrap {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  width: 100%;
  max-width: 460px;
  justify-self: center;
  perspective: 900px;
}

.tc-core-glow {
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  background:
    radial-gradient(
      50% 50% at 50% 50%,
      rgba(0, 229, 255, 0.3),
      transparent 68%
    ),
    radial-gradient(
      60% 60% at 40% 74%,
      rgba(0, 255, 213, 0.22),
      transparent 72%
    );
  filter: blur(30px);
  animation: tcBreath 7s ease-in-out infinite;
}

.tc-core {
  position: relative;
  width: 62%;
  aspect-ratio: 1;
  transform-style: preserve-3d;
  transform: rotateX(16deg) rotateZ(-8deg);
  animation: tcCoreSpin 42s linear infinite;
}

@keyframes tcCoreSpin {
  from {
    transform: rotateX(16deg) rotateZ(-8deg) rotateY(0deg);
  }

  to {
    transform: rotateX(16deg) rotateZ(-8deg) rotateY(360deg);
  }
}

.tc-core-meridian {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 50%;
  transform-style: preserve-3d;
}

.tc-core-meridian:nth-child(odd) {
  border-color: rgba(0, 255, 213, 0.13);
}

.tc-core-parallel {
  position: absolute;
  left: 50%;
  top: 50%;
  border: 1px solid rgba(20, 125, 255, 0.18);
  border-radius: 50%;
  transform-style: preserve-3d;
}

.tc-core-body {
  position: absolute;
  inset: 6%;
  border-radius: 50%;
  background:
    radial-gradient(
      42% 38% at 32% 28%,
      rgba(180, 250, 255, 0.5),
      transparent 62%
    ),
    radial-gradient(
      70% 70% at 62% 72%,
      rgba(0, 120, 160, 0.42),
      transparent 72%
    ),
    linear-gradient(
      160deg,
      rgba(4, 40, 62, 0.86),
      rgba(2, 12, 26, 0.94)
    );
  box-shadow:
    inset -18px -22px 60px rgba(0, 0, 0, 0.75),
    inset 12px 14px 44px rgba(0, 229, 255, 0.16),
    0 0 70px rgba(0, 229, 255, 0.2);
}

.tc-core-scan {
  position: absolute;
  left: 6%;
  right: 6%;
  height: 16%;
  border-radius: 50%;
  background: linear-gradient(
    180deg,
    transparent,
    rgba(0, 255, 213, 0.32),
    transparent
  );
  filter: blur(3px);
  animation: tcScan 6s ease-in-out infinite;
}

@keyframes tcScan {
  0%,
  100% {
    top: 4%;
    opacity: 0;
  }

  20% {
    opacity: 1;
  }

  80% {
    opacity: 1;
  }

  92% {
    top: 80%;
    opacity: 0;
  }
}

.tc-core-node {
  position: absolute;
  width: 7px;
  height: 7px;
  margin: -3.5px 0 0 -3.5px;
  border-radius: 50%;
  background: var(--aqua);
  box-shadow: 0 0 12px var(--aqua);
  animation: tcBreath 3.4s ease-in-out infinite;
}

.tc-core-node::after {
  content: "";
  position: absolute;
  inset: -6px;
  border: 1px solid rgba(0, 255, 213, 0.5);
  border-radius: 50%;
  animation: tcPing 3.4s ease-out infinite;
}

@keyframes tcPing {
  0% {
    transform: scale(0.4);
    opacity: 0.9;
  }

  70% {
    transform: scale(2.2);
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

.tc-core-orbit {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(0, 229, 255, 0.16);
  border-radius: 50%;
  animation: tcOrbit 26s linear infinite;
}

.tc-core-orbit::before {
  content: "";
  position: absolute;
  left: 50%;
  top: -4px;
  width: 8px;
  height: 8px;
  margin-left: -4px;
  border-radius: 50%;
  background: var(--cyan);
  box-shadow: 0 0 16px var(--cyan);
}

.tc-core-orbit.is-b {
  inset: -9%;
  border-color: rgba(114, 92, 255, 0.16);
  animation-duration: 38s;
  animation-direction: reverse;
  transform: rotate(18deg);
}

.tc-core-orbit.is-b::before {
  background: var(--violet);
  box-shadow: 0 0 16px var(--violet);
}

.tc-core-orbit.is-c {
  inset: 12%;
  border-color: rgba(0, 255, 213, 0.13);
  border-style: dashed;
  animation-duration: 54s;
}

.tc-core-orbit.is-c::before {
  display: none;
}

@keyframes tcOrbit {
  to {
    transform: rotate(360deg);
  }
}

.tc-core-orbit.is-b {
  animation-name: tcOrbitB;
}

@keyframes tcOrbitB {
  from {
    transform: rotate(18deg);
  }

  to {
    transform: rotate(378deg);
  }
}

.tc-core-hud {
  position: absolute;
  display: grid;
  gap: 4px;
  padding: 9px 12px;
  border-left: 1px solid rgba(0, 229, 255, 0.4);
  background: linear-gradient(
    90deg,
    rgba(2, 12, 26, 0.72),
    transparent
  );
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.tc-core-hud span {
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.26em;
  color: var(--ink-3);
}

.tc-core-hud b {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--ink-2);
}


/* ============================================================
   SECTIONS
   ============================================================ */

.tc-section {
  padding-top: clamp(36px, 7vh, 76px);
}

.tc-section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: clamp(22px, 4vh, 40px);
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(0, 229, 255, 0.12);
}

.tc-section-title {
  margin: 0;
  font-size: clamp(22px, 3.4vw, 36px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--ink-1);
}

.tc-section-note {
  margin: 8px 0 0;
  font-size: 13.5px;
  color: var(--ink-2);
}

.tc-section-count {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: var(--ink-3);
}


/* ============================================================
   MODULE GRID
   ============================================================ */

.tc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: clamp(14px, 1.8vw, 22px);
}

.tc-module.is-wide {
  grid-column: span 2;
}

.tc-module {
  --tc-rx: 0deg;
  --tc-ry: 0deg;
  --tc-mx: 50%;
  --tc-my: 50%;
  --tc-accent: 0, 229, 255;
  --tc-accent-2: 0, 255, 213;

  position: relative;
  display: block;
  width: 100%;
  min-height: 220px;
  padding: 26px 26px 22px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background:
    linear-gradient(
      158deg,
      rgba(10, 32, 54, 0.6),
      rgba(3, 12, 26, 0.75)
    );
  color: inherit;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  transform-style: preserve-3d;
  transform:
    perspective(1000px)
    rotateX(var(--tc-rx))
    rotateY(var(--tc-ry))
    translateZ(0);
  transition:
    transform 260ms var(--ease),
    border-color 320ms ease,
    box-shadow 380ms ease;
  clip-path: polygon(
    0 0,
    calc(100% - 22px) 0,
    100% 22px,
    100% 100%,
    22px 100%,
    0 calc(100% - 22px)
  );
  box-shadow: 0 24px 50px -30px rgba(0, 0, 0, 0.9);
}

.tc-module-sheen {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  background:
    radial-gradient(
      240px 240px at var(--tc-mx) var(--tc-my),
      rgba(var(--tc-accent), 0.16),
      transparent 70%
    );
  transition: opacity 340ms ease;
}

.tc-module-glow {
  position: absolute;
  left: -20%;
  bottom: -60%;
  width: 140%;
  height: 120%;
  pointer-events: none;
  background:
    radial-gradient(
      50% 50% at 50% 50%,
      rgba(var(--tc-accent), 0.22),
      transparent 70%
    );
  filter: blur(30px);
  opacity: 0.3;
  transition:
    opacity 420ms ease,
    transform 620ms var(--ease);
}

.tc-module-edge {
  position: absolute;
  inset: 0;
  pointer-events: none;
  clip-path: inherit;
  overflow: hidden;
  opacity: 0;
  transition: opacity 320ms ease;
}

.tc-module-edge i {
  position: absolute;
  top: 0;
  left: -40%;
  width: 40%;
  height: 1.5px;
  background:
    linear-gradient(
      90deg,
      transparent,
      rgb(var(--tc-accent-2)),
      transparent
    );
  animation: tcEdge 2.6s linear infinite;
}

.tc-module-edge i:nth-child(2) {
  top: auto;
  bottom: 0;
  animation-delay: 1.3s;
}

@keyframes tcEdge {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(350%);
  }
}

.tc-module:hover,
.tc-module:focus-visible {
  border-color: rgba(var(--tc-accent), 0.5);
  box-shadow:
    0 40px 70px -34px rgba(0, 0, 0, 0.95),
    0 0 60px -14px rgba(var(--tc-accent), 0.4),
    inset 0 0 50px rgba(var(--tc-accent), 0.07);
}

.tc-module:focus-visible {
  outline: 2px solid rgb(var(--tc-accent));
  outline-offset: 3px;
}

.tc-module:hover .tc-module-sheen {
  opacity: 1;
}

.tc-module:hover .tc-module-edge {
  opacity: 1;
}

.tc-module:hover .tc-module-glow {
  opacity: 0.85;
  transform: translateY(-14px);
}

.tc-module.is-selected {
  border-color: rgb(var(--tc-accent));
  box-shadow:
    0 0 0 1px rgb(var(--tc-accent)),
    0 0 90px -10px rgba(var(--tc-accent), 0.7);
  transform: perspective(1000px) scale(0.985);
}

.tc-module.is-selected .tc-module-ring {
  animation: tcSelect 420ms var(--ease) forwards;
}

.tc-module-ring {
  position: absolute;
  left: var(--tc-mx);
  top: var(--tc-my);
  width: 10px;
  height: 10px;
  margin: -5px 0 0 -5px;
  border: 1.5px solid rgb(var(--tc-accent-2));
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
}

@keyframes tcSelect {
  0% {
    opacity: 1;
    transform: scale(0.4);
  }

  100% {
    opacity: 0;
    transform: scale(60);
  }
}


/* ============================================================
   MODULE CONTENT
   ============================================================ */

.tc-module-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.tc-module-index {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.2em;
  color: rgba(var(--tc-accent), 0.85);
  font-variant-numeric: tabular-nums;
}

.tc-module-icon {
  position: relative;
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(var(--tc-accent), 0.28);
  background:
    linear-gradient(
      150deg,
      rgba(var(--tc-accent), 0.14),
      rgba(var(--tc-accent-2), 0.06)
    );
  clip-path: polygon(
    0 0,
    calc(100% - 12px) 0,
    100% 12px,
    100% 100%,
    12px 100%,
    0 calc(100% - 12px)
  );
  transition:
    transform 340ms var(--ease),
    box-shadow 340ms ease;
}

.tc-module-icon svg {
  width: 26px;
  height: 26px;
  color: rgb(var(--tc-accent-2));
}

.tc-module:hover .tc-module-icon {
  transform: translateY(-5px) translateZ(30px);
  box-shadow: 0 14px 30px -12px rgba(var(--tc-accent), 0.6);
}

.tc-module-code {
  display: block;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: var(--ink-3);
  margin-top: 6px;
}

.tc-module-title {
  display: block;
  margin: 0 0 6px;
  font-size: clamp(18px, 2vw, 22px);
  font-weight: 800;
  letter-spacing: -0.015em;
  line-height: 1.15;
  color: var(--ink-1);
}

.tc-module-kicker {
  display: block;
  margin: 0 0 12px;
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: rgba(var(--tc-accent), 0.75);
}

.tc-module-desc {
  display: block;
  margin: 0;
  max-width: 44ch;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--ink-2);
}

.tc-module-go {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 22px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.28em;
  color: rgba(var(--tc-accent-2), 0.9);
}

.tc-module-go svg {
  width: 16px;
  height: 16px;
  transition: transform 320ms var(--ease);
}

.tc-module:hover .tc-module-go svg {
  transform: translateX(6px);
}


/* ============================================================
   MODULE ARTWORK
   ============================================================ */

.tc-art {
  position: absolute;
  right: -10px;
  bottom: -10px;
  width: 168px;
  height: 138px;
  pointer-events: none;
  opacity: 0.4;
  transition:
    opacity 420ms ease,
    transform 620ms var(--ease);
}

.tc-module:hover .tc-art {
  opacity: 0.95;
  transform: translate(-6px, -4px);
}

.tc-art svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.tc-art-radar {
  transform-origin: 50% 100%;
  animation: tcRadar 4.4s linear infinite;
}

@keyframes tcRadar {
  to {
    transform: rotate(360deg);
  }
}

.tc-art-wave {
  animation: tcWave 7s ease-in-out infinite alternate;
}

@keyframes tcWave {
  from {
    transform: translateX(-10px);
  }

  to {
    transform: translateX(10px);
  }
}

.tc-art-node {
  animation: tcBreath 3.2s ease-in-out infinite;
}

.tc-art-node:nth-child(2) {
  animation-delay: 0.5s;
}

.tc-art-node:nth-child(3) {
  animation-delay: 1s;
}

.tc-art-node:nth-child(4) {
  animation-delay: 1.5s;
}

.tc-art-shield {
  animation: tcBreath 5s ease-in-out infinite;
}


/* ============================================================
   STATUS + SESSION
   ============================================================ */

.tc-panels {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: clamp(14px, 1.8vw, 22px);
}

.tc-panel {
  position: relative;
  padding: 26px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background:
    linear-gradient(
      158deg,
      rgba(8, 26, 44, 0.5),
      rgba(2, 10, 22, 0.7)
    );
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  clip-path: polygon(
    0 0,
    calc(100% - 20px) 0,
    100% 20px,
    100% 100%,
    20px 100%,
    0 calc(100% - 20px)
  );
  overflow: hidden;
}

.tc-panel::before {
  content: "";
  position: absolute;
  left: 0;
  right: 20px;
  top: 0;
  height: 1px;
  background:
    linear-gradient(
      90deg,
      rgba(0, 229, 255, 0.7),
      transparent
    );
}

.tc-panel-title {
  margin: 0 0 20px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.34em;
  color: var(--ink-3);
}

.tc-statuses {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(170px, 1fr)
  );
  gap: 16px;
}

.tc-status {
  display: grid;
  gap: 7px;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(2, 10, 22, 0.5);
  transition:
    border-color 280ms ease,
    background 280ms ease;
}

.tc-status:hover {
  border-color: rgba(0, 229, 255, 0.28);
  background: rgba(0, 229, 255, 0.05);
}

.tc-status-key {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.26em;
  color: var(--ink-3);
}

.tc-status-val {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--ink-1);
}

.tc-session {
  display: grid;
  gap: 18px;
}

.tc-session-id {
  display: flex;
  align-items: center;
  gap: 14px;
}

.tc-session-avatar {
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border: 1px solid rgba(0, 255, 213, 0.3);
  background:
    linear-gradient(
      150deg,
      rgba(0, 255, 213, 0.12),
      rgba(20, 125, 255, 0.1)
    );
  clip-path: polygon(
    50% 0,
    100% 26%,
    100% 74%,
    50% 100%,
    0 74%,
    0 26%
  );
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: var(--aqua);
}

.tc-session-name {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--ink-1);
  word-break: break-word;
}

.tc-session-role {
  margin: 5px 0 0;
  font-size: 8.5px;
  font-weight: 600;
  letter-spacing: 0.28em;
  color: var(--ink-3);
}

.tc-session-rows {
  display: grid;
  gap: 10px;
}

.tc-session-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding-bottom: 9px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.22em;
  color: var(--ink-3);
}

.tc-session-row b {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--ink-2);
  font-weight: 700;
}


/* ============================================================
   RESPONSIVE
   ============================================================ */

@media (max-width: 1080px) {
  .tc-hero {
    grid-template-columns: 1fr;
  }

  .tc-core-wrap {
    max-width: 380px;
    order: -1;
  }

  .tc-module.is-wide {
    grid-column: span 1;
  }

  .tc-panels {
    grid-template-columns: 1fr;
  }

  .tc-readouts {
    gap: 16px;
  }
}

@media (max-width: 760px) {
  .tc-header {
    padding: 12px 0;
    gap: 10px;
  }

  .tc-readouts {
    display: none;
  }

  .tc-brand-mark {
    width: 36px;
    height: 36px;
  }

  .tc-brand-name {
    font-size: 13px;
    letter-spacing: 0.18em;
  }

  .tc-hero {
    padding-bottom: 40px;
    gap: 28px;
  }

  .tc-core-wrap {
    max-width: 260px;
  }

  .tc-hero-verbs {
    gap: 14px;
  }

  .tc-module {
    min-height: 0;
    padding: 22px 20px 20px;
    transform: none !important;
  }

  .tc-art {
    width: 120px;
    height: 100px;
    opacity: 0.28;
  }

  .tc-module-icon {
    width: 46px;
    height: 46px;
  }

  .tc-module-icon svg {
    width: 22px;
    height: 22px;
  }

  .tc-terminate {
    padding: 12px 14px;
  }

  .tc-terminate span {
    display: none;
  }

  .tc-env-motes {
    display: none;
  }
}


/* ============================================================
   REDUCED MOTION
   ============================================================ */

@media (prefers-reduced-motion: reduce) {
  .tc-root *,
  .tc-root *::before,
  .tc-root *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }

  .tc-stage,
  .tc-reveal {
    opacity: 1 !important;
    transform: none !important;
  }

  .tc-module {
    transform: none !important;
  }

  .tc-env-motes {
    display: none;
  }
}
`;


function CommandStyles() {
  return <style>{TC_CSS}</style>;
}


/* ============================================================
   ICONS
   ============================================================ */

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};


function IconDroplet() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        {...S}
        d="M12 3.2c3.4 3.9 5.6 6.8 5.6 9.4a5.6 5.6 0 1 1-11.2 0c0-2.6 2.2-5.5 5.6-9.4Z"
      />
      <path
        {...S}
        strokeWidth="1.2"
        opacity="0.65"
        d="M9.2 13.4a2.8 2.8 0 0 0 2.4 3.3"
      />
      <circle
        cx="12"
        cy="12.6"
        r="1.1"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}


function IconStation() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path {...S} d="M12 21V12" />
      <path {...S} d="M7.6 20.4 12 12l4.4 8.4" />
      <circle {...S} cx="12" cy="8.4" r="2.2" />
      <path {...S} opacity="0.7" d="M7.8 4.2a6.4 6.4 0 0 0 0 8.4" />
      <path {...S} opacity="0.7" d="M16.2 4.2a6.4 6.4 0 0 1 0 8.4" />
    </svg>
  );
}


function IconMolecule() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle {...S} cx="12" cy="6" r="2.1" />
      <circle {...S} cx="5.6" cy="16.4" r="2.1" />
      <circle {...S} cx="18.4" cy="16.4" r="2.1" />
      <path
        {...S}
        opacity="0.75"
        d="M10.6 7.8 7 14.6M13.4 7.8 17 14.6M7.7 16.4h8.6"
      />
    </svg>
  );
}


function IconShield() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        {...S}
        d="M12 3 19 6v6c0 4.3-3 7.4-7 9-4-1.6-7-4.7-7-9V6l7-3Z"
      />
      <path
        {...S}
        strokeWidth="1.8"
        d="m9 12 2.2 2.3L15.3 10"
      />
    </svg>
  );
}


function IconGeo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        {...S}
        d="M3.4 6.6 9 4.4l6 2.2 5.6-2.2v13l-5.6 2.2-6-2.2-5.6 2.2v-13Z"
      />
      <path {...S} opacity="0.7" d="M9 4.4v13M15 6.6v13" />
    </svg>
  );
}


/* NEW: Community Reports icon */
function IconReport() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        {...S}
        d="M5 4.5h14v15H5z"
      />
      <path {...S} d="M8 8h8M8 12h8M8 16h5" />
      <path {...S} d="M9 4.5V3h6v1.5" />
    </svg>
  );
}


function IconArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        {...S}
        strokeWidth="1.8"
        d="M4 12h14M13 6.5 18.5 12 13 17.5"
      />
    </svg>
  );
}


function IconPower() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path {...S} strokeWidth="1.8" d="M12 3.5v8" />
      <path
        {...S}
        strokeWidth="1.8"
        d="M7.2 6.6a7.4 7.4 0 1 0 9.6 0"
      />
    </svg>
  );
}


function IconWave() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        {...S}
        d="M2.5 9c1.6-1.8 3.2-1.8 4.8 0s3.2 1.8 4.8 0 3.2-1.8 4.8 0 3.2 1.8 4.6 0"
      />
      <path
        {...S}
        opacity="0.6"
        d="M2.5 14.4c1.6-1.8 3.2-1.8 4.8 0s3.2 1.8 4.8 0 3.2-1.8 4.8 0 3.2 1.8 4.6 0"
      />
      <path
        {...S}
        opacity="0.3"
        d="M2.5 19.4c1.6-1.8 3.2-1.8 4.8 0s3.2 1.8 4.8 0 3.2-1.8 4.8 0 3.2 1.8 4.6 0"
      />
    </svg>
  );
}


/* ============================================================
   MODULE DEFINITIONS
   ============================================================ */

const MODULES = [
  {
    index: "01",
    code: "HYD / CLASS",
    title: "Water Types",
    kicker: "HYDROLOGICAL CLASSIFICATION",
    description: "Manage the water body types used by monitoring stations.",
    path: "/admin/water-types",
    accent: "0, 255, 213",
    accent2: "0, 229, 255",
    Icon: IconDroplet,
    art: "wave",
  },

  {
    index: "02",
    code: "NET / NODES",
    title: "Monitoring Stations",
    kicker: "FIELD SENSOR NETWORK",
    description: "Add, update, and manage official monitoring stations.",
    path: "/admin/stations",
    accent: "0, 229, 255",
    accent2: "0, 255, 213",
    Icon: IconStation,
    art: "radar",
  },

  {
    index: "03",
    code: "LAB / MCYST",
    title: "Cyanotoxin Measurements",
    kicker: "MICROCYSTIN RECORD ARCHIVE",
    description: "Manage official microcystin measurement records.",
    path: "/admin/measurements",
    accent: "0, 229, 255",
    accent2: "255, 181, 71",
    Icon: IconMolecule,
    art: "molecule",
    wide: true,
  },

  {
    index: "04",
    code: "SEC / THRSH",
    title: "Safety Standards",
    kicker: "ADVISORY THRESHOLDS",
    description: "Manage user-specific safety thresholds and advisories.",
    path: "/admin/safety-standards",
    accent: "20, 125, 255",
    accent2: "255, 181, 71",
    Icon: IconShield,
    art: "shield",
  },

  {
    index: "05",
    code: "GEO / REGION",
    title: "Counties",
    kicker: "GEOGRAPHIC REGISTRY",
    description: "Manage county and state information connected to stations.",
    path: "/admin/counties",
    accent: "114, 92, 255",
    accent2: "20, 125, 255",
    Icon: IconGeo,
    art: "grid",
  },

  // NEW MODULE
  {
    index: "06",
    code: "CIV / REPORT",
    title: "Community Reports",
    kicker: "PUBLIC INCIDENT REPORTS",
    description: "Review and manage reports submitted by ToxicTide users.",
    path: "/admin/community-reports",
    accent: "255, 181, 71",
    accent2: "255, 92, 108",
    Icon: IconReport,
    art: "report",
  },
];


/* ============================================================
   ENVIRONMENT
   ============================================================ */

const MOTES = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 41.3) % 100,
  size: 3 + ((i * 7) % 9),
  duration: 26 + ((i * 11) % 24),
  delay: -(i * 2.7),
}));


function Environment() {
  return (
    <div className="tc-env" aria-hidden="true">
      <div className="tc-env-deep" />
      <div className="tc-env-shafts" />

      <div className="tc-env-water" />

      <div className="tc-env-motes">
        {MOTES.map((m, i) => (
          <i
            key={i}
            style={{
              left: `${m.left}%`,
              width: m.size,
              height: m.size,
              animationDuration: `${m.duration}s`,
              animationDelay: `${m.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="tc-env-grade" />
    </div>
  );
}


/* ============================================================
   HYDRO CORE
   ============================================================ */

const MERIDIANS = Array.from(
  { length: 12 },
  (_, i) => i * 15
);

const PARALLELS = [
  { scale: 0.34, y: -34 },
  { scale: 0.68, y: -19 },
  { scale: 0.86, y: 0 },
  { scale: 0.68, y: 19 },
  { scale: 0.34, y: 34 },
];

const NODES = [
  { left: "28%", top: "34%" },
  { left: "62%", top: "26%" },
  { left: "44%", top: "58%" },
  { left: "72%", top: "64%" },
];


function HydroCore() {
  return (
    <div className="tc-core-wrap">

      <div
        className="tc-core-glow"
        aria-hidden="true"
      />

      <div
        className="tc-core-orbit"
        aria-hidden="true"
      />

      <div
        className="tc-core-orbit is-b"
        aria-hidden="true"
      />

      <div
        className="tc-core-orbit is-c"
        aria-hidden="true"
      />

      <div
        className="tc-core"
        aria-hidden="true"
      >

        <div className="tc-core-body" />

        {MERIDIANS.map((deg) => (
          <div
            key={deg}
            className="tc-core-meridian"
            style={{
              transform: `rotateY(${deg}deg)`
            }}
          />
        ))}

        {PARALLELS.map((p, i) => (
          <div
            key={i}
            className="tc-core-parallel"
            style={{
              width: `${p.scale * 100}%`,
              height: `${p.scale * 100}%`,
              marginLeft: `${(-p.scale * 100) / 2}%`,
              marginTop: `${(-p.scale * 100) / 2}%`,
              transform: `translateY(${p.y}%) rotateX(90deg)`,
            }}
          />
        ))}

        <div className="tc-core-scan" />

        {NODES.map((n, i) => (
          <div
            key={i}
            className="tc-core-node"
            style={{
              left: n.left,
              top: n.top,
              animationDelay: `${i * 0.7}s`
            }}
          />
        ))}

      </div>


      <div
        className="tc-core-hud"
        style={{
          left: "-2%",
          top: "14%"
        }}
      >
        <span>WATER QUALITY</span>

        <b>
          <i className="tc-dot" />
          MONITORING ACTIVE
        </b>
      </div>


      <div
        className="tc-core-hud"
        style={{
          right: "-4%",
          top: "34%"
        }}
      >
        <span>TOXIN ANALYSIS</span>

        <b>
          <i className="tc-dot is-cyan" />
          OPERATIONAL
        </b>
      </div>


      <div
        className="tc-core-hud"
        style={{
          left: "-6%",
          bottom: "20%"
        }}
      >
        <span>MONITORING NETWORK</span>

        <b>
          <i className="tc-dot" />
          CONNECTED
        </b>
      </div>


      <div
        className="tc-core-hud"
        style={{
          right: "0%",
          bottom: "8%"
        }}
      >
        <span>DATABASE</span>

        <b>
          <i className="tc-dot is-violet" />
          ACCESS GRANTED
        </b>
      </div>

    </div>
  );
}


/* ============================================================
   MODULE ARTWORK
   ============================================================ */

function ModuleArt({ kind, accent }) {

  const c = `rgb(${accent})`;


  if (kind === "radar") {
    return (
      <div className="tc-art">
        <svg viewBox="0 0 160 140">

          <g
            stroke={c}
            fill="none"
            opacity="0.45"
          >
            <circle cx="80" cy="130" r="34" />
            <circle cx="80" cy="130" r="62" />
            <circle cx="80" cy="130" r="92" />
          </g>

          <g
            className="tc-art-radar"
            style={{
              transformOrigin: "80px 130px"
            }}
          >
            <path
              d="M80 130 L80 34 A96 96 0 0 1 150 60 Z"
              fill={c}
              opacity="0.18"
            />

            <line
              x1="80"
              y1="130"
              x2="80"
              y2="34"
              stroke={c}
              strokeWidth="1.4"
              opacity="0.8"
            />
          </g>

        </svg>
      </div>
    );
  }


  if (kind === "wave") {
    return (
      <div className="tc-art">
        <svg viewBox="0 0 160 140">

          <g
            className="tc-art-wave"
            fill="none"
            stroke={c}
          >
            <path
              d="M-20 74 q22 -16 44 0 t44 0 t44 0 t44 0"
              opacity="0.7"
            />

            <path
              d="M-20 96 q22 -16 44 0 t44 0 t44 0 t44 0"
              opacity="0.45"
            />

            <path
              d="M-20 118 q22 -16 44 0 t44 0 t44 0 t44 0"
              opacity="0.25"
            />
          </g>

        </svg>
      </div>
    );
  }


  if (kind === "molecule") {
    return (
      <div className="tc-art">
        <svg viewBox="0 0 160 140">

          <g
            stroke={c}
            opacity="0.5"
            fill="none"
          >
            <path d="M40 106 L74 62 L110 88 L134 44" />
            <path
              d="M40 106 L110 88"
              opacity="0.4"
            />
          </g>

          <g fill={c}>

            <circle
              className="tc-art-node"
              cx="40"
              cy="106"
              r="5"
            />

            <circle
              className="tc-art-node"
              cx="74"
              cy="62"
              r="4"
            />

            <circle
              className="tc-art-node"
              cx="110"
              cy="88"
              r="5.5"
            />

            <circle
              className="tc-art-node"
              cx="134"
              cy="44"
              r="3.5"
            />

          </g>

        </svg>
      </div>
    );
  }


  if (kind === "shield") {
    return (
      <div className="tc-art">
        <svg viewBox="0 0 160 140">

          <g
            className="tc-art-shield"
            fill="none"
            stroke={c}
          >
            <path
              d="M84 24 L128 44 v34c0 28-19 47-44 57-25-10-44-29-44-57V44l44-20Z"
              opacity="0.5"
            />

            <path
              d="M84 40 L114 54 v24c0 20-13 33-30 40-17-7-30-20-30-40V54l30-14Z"
              opacity="0.28"
            />
          </g>

        </svg>
      </div>
    );
  }


  /* Community report / geographic artwork */
  return (
    <div className="tc-art">

      <svg viewBox="0 0 160 140">

        <g
          stroke={c}
          opacity="0.35"
          fill="none"
        >

          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={`h${i}`}
              x1="10"
              y1={38 + i * 24}
              x2="170"
              y2={26 + i * 24}
            />
          ))}

          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line
              key={`v${i}`}
              x1={18 + i * 28}
              y1="26"
              x2={30 + i * 28}
              y2="140"
            />
          ))}

        </g>


        <g fill={c}>

          <circle
            className="tc-art-node"
            cx="66"
            cy="70"
            r="4"
          />

          <circle
            className="tc-art-node"
            cx="118"
            cy="98"
            r="4"
          />

        </g>

      </svg>

    </div>
  );
}


/* ============================================================
   MODULE CARD
   ============================================================ */

function ModuleCard({
  module,
  selected,
  onSelect,
  tilt
}) {

  const ref = useRef(null);
  const frame = useRef(0);

  const { Icon } = module;


  const handleMove = useCallback(
    (e) => {

      if (!tilt) return;

      const el = ref.current;

      if (!el || frame.current) return;

      const {
        clientX,
        clientY
      } = e;


      frame.current = requestAnimationFrame(() => {

        frame.current = 0;

        const r = el.getBoundingClientRect();

        const x =
          (clientX - r.left) / r.width;

        const y =
          (clientY - r.top) / r.height;


        el.style.setProperty(
          "--tc-ry",
          `${(x - 0.5) * 6}deg`
        );

        el.style.setProperty(
          "--tc-rx",
          `${(0.5 - y) * 4}deg`
        );

        el.style.setProperty(
          "--tc-mx",
          `${x * 100}%`
        );

        el.style.setProperty(
          "--tc-my",
          `${y * 100}%`
        );

      });

    },
    [tilt]
  );


  const handleLeave = useCallback(() => {

    const el = ref.current;

    if (!el) return;

    cancelAnimationFrame(frame.current);

    frame.current = 0;

    el.style.setProperty(
      "--tc-ry",
      "0deg"
    );

    el.style.setProperty(
      "--tc-rx",
      "0deg"
    );

  }, []);


  useEffect(
    () => () => cancelAnimationFrame(frame.current),
    []
  );


  return (
    <button
      ref={ref}
      type="button"
      className={
        `tc-module` +
        `${module.wide ? " is-wide" : ""}` +
        `${selected ? " is-selected" : ""}`
      }
      style={{
        "--tc-accent": module.accent,
        "--tc-accent-2": module.accent2
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={() => onSelect(module)}
      aria-label={`${module.title} — ${module.description}`}
    >

      <span
        className="tc-module-glow"
        aria-hidden="true"
      />

      <ModuleArt
        kind={module.art}
        accent={module.accent2}
      />

      <span
        className="tc-module-sheen"
        aria-hidden="true"
      />

      <span
        className="tc-module-edge"
        aria-hidden="true"
      >
        <i />
        <i />
      </span>

      <span
        className="tc-module-ring"
        aria-hidden="true"
      />


      <span className="tc-module-top">

        <span>

          <span className="tc-module-icon">
            <Icon />
          </span>

          <span className="tc-module-code">
            {module.code}
          </span>

        </span>


        <span className="tc-module-index">
          {module.index}
        </span>

      </span>


      <span className="tc-module-title">
        {module.title}
      </span>

      <span className="tc-module-kicker">
        {module.kicker}
      </span>

      <span className="tc-module-desc">
        {module.description}
      </span>


      <span className="tc-module-go">
        ACCESS MODULE
        <IconArrow />
      </span>

    </button>
  );
}


/* ============================================================
   SCROLL REVEAL
   ============================================================ */

function useReveal() {

  const ref = useRef(null);


  useEffect(() => {

    const el = ref.current;

    if (!el) return;


    if (!("IntersectionObserver" in window)) {

      el.classList.add("is-in");

      return;
    }


    const io = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "is-in"
            );

            io.unobserve(entry.target);
          }

        });

      },
      {
        rootMargin:
          "0px 0px -12% 0px",
        threshold: 0.08
      }
    );


    io.observe(el);


    return () => io.disconnect();

  }, []);


  return ref;
}


/* ============================================================
   ADMIN DASHBOARD
   ============================================================ */

function AdminDashboard() {

  // Used to move between admin pages.
  const navigate = useNavigate();


  const [ready, setReady] =
    useState(false);

  const [selected, setSelected] =
    useState(null);

  const [terminating, setTerminating] =
    useState(false);

  const [reduced, setReduced] =
    useState(false);

  const timer = useRef(0);


  const modulesRef =
    useReveal();

  const panelsRef =
    useReveal();


  // Get the username stored during admin login.
  const adminName = useMemo(() => {

    const stored =
      sessionStorage.getItem(
        "toxictideAdminUsername"
      );

    return stored && stored.trim()
      ? stored.trim()
      : "ADMINISTRATOR";

  }, []);


  // Check whether the browser session is authenticated.
  const sessionAuthorised = useMemo(
    () =>
      sessionStorage.getItem(
        "toxictideAdmin"
      ) === "true",
    []
  );


  // Create initials for the session card.
  const initials = useMemo(
    () =>
      adminName
        .replace(/[^A-Za-z0-9]/g, "")
        .slice(0, 2)
        .toUpperCase() || "AD",
    [adminName]
  );


  useEffect(() => {

    const mq =
      window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
      );

    setReduced(
      Boolean(mq?.matches)
    );


    // Release the dashboard entry animation.
    const id =
      requestAnimationFrame(
        () => setReady(true)
      );


    return () =>
      cancelAnimationFrame(id);

  }, []);


  useEffect(
    () => () =>
      clearTimeout(timer.current),
    []
  );


  /* ============================================================
     MODULE NAVIGATION
     ============================================================ */

  const handleSelect =
    useCallback(
      (module) => {

        // Prevent multiple clicks while
        // the selection animation is running.
        if (selected) return;

        setSelected(module.path);


        const delay =
          reduced ? 0 : 150;


        timer.current =
          setTimeout(
            () =>
              navigate(module.path),
            delay
          );

      },
      [
        navigate,
        reduced,
        selected
      ]
    );


  /* ============================================================
     LOGOUT
     ============================================================ */

  const handleLogout = () => {

    if (terminating) return;

    setTerminating(true);


    const finish = () => {

      // Clear the existing admin session.
      clearAdminSession();

      // Return to admin login.
      navigate("/admin/login");

    };


    if (reduced) {

      finish();

    } else {

      timer.current =
        setTimeout(
          finish,
          260
        );

    }

  };


  return (
    <div
      className={
        `tc-root${
          ready ? " is-ready" : ""
        }`
      }
    >

      <CommandStyles />

      <Environment />


      <div className="tc-shell">


        {/* =====================================================
            HEADER
            ===================================================== */}

        <header
          className="tc-header tc-stage"
          style={{
            "--tc-delay": "300ms"
          }}
        >

          <div className="tc-brand">

            <span
              className="tc-brand-mark"
              aria-hidden="true"
            >
              <IconWave />
            </span>


            <div>

              <p className="tc-brand-name">
                TOXICTIDE
              </p>

              <p className="tc-brand-sub">
                ENVIRONMENTAL INTELLIGENCE
              </p>

            </div>

          </div>


          <div className="tc-header-right">

            <div className="tc-readouts">

              <div className="tc-readout">

                <span className="tc-readout-key">
                  SYSTEM
                </span>

                <span className="tc-readout-val">
                  <i className="tc-dot" />
                  ONLINE
                </span>

              </div>


              <div className="tc-readout">

                <span className="tc-readout-key">
                  DATABASE
                </span>

                <span className="tc-readout-val">
                  <i className="tc-dot is-cyan" />
                  ACCESS GRANTED
                </span>

              </div>


              <div className="tc-readout">

                <span className="tc-readout-key">
                  SESSION
                </span>

                <span className="tc-readout-val">

                  <i
                    className={
                      `tc-dot ${
                        sessionAuthorised
                          ? "is-violet"
                          : "is-warn"
                      }`
                    }
                  />

                  {
                    sessionAuthorised
                      ? "AUTHORIZED"
                      : "UNVERIFIED"
                  }

                </span>

              </div>

            </div>


            <button
              type="button"
              className={
                `tc-terminate${
                  terminating
                    ? " is-firing"
                    : ""
                }`
              }
              onClick={handleLogout}
              aria-label="Terminate session and sign out"
            >

              <IconPower />

              <span>
                TERMINATE SESSION
              </span>

            </button>

          </div>

        </header>


        {/* =====================================================
            HERO
            ===================================================== */}

        <section className="tc-hero">

          <div>

            <p
              className="tc-eyebrow tc-stage"
              style={{
                "--tc-delay": "500ms"
              }}
            >
              ADMIN COMMAND CENTER
            </p>


            <h1
              className="tc-hero-title tc-stage"
              style={{
                "--tc-delay": "620ms"
              }}
            >
              TOXICTIDE
            </h1>


            <p
              className="tc-hero-line tc-stage"
              style={{
                "--tc-delay": "760ms"
              }}
            >
              ENVIRONMENTAL INTELLIGENCE NETWORK
            </p>


            <div
              className="tc-hero-rule tc-stage"
              style={{
                "--tc-delay": "860ms"
              }}
              aria-hidden="true"
            />


            <div
              className="tc-hero-verbs tc-stage"
              style={{
                "--tc-delay": "920ms"
              }}
            >

              <p className="tc-hero-verb">
                <b>Monitor.</b>
              </p>

              <p className="tc-hero-verb">
                Analyze.
              </p>

              <p className="tc-hero-verb">
                Protect.
              </p>

            </div>


            <p
              className="tc-hero-note tc-stage"
              style={{
                "--tc-delay": "1020ms"
              }}
            >
              You are signed in to the administration
              layer of the ToxicTide monitoring network.
              Every record the public system reads is
              maintained from here.
            </p>

          </div>


          <div
            className="tc-stage"
            style={{
              "--tc-delay": "900ms"
            }}
          >
            <HydroCore />
          </div>

        </section>


        {/* =====================================================
            ADMIN MODULES
            ===================================================== */}

        <section className="tc-section">

          <div
            className="tc-section-head tc-stage"
            style={{
              "--tc-delay": "1200ms"
            }}
          >

            <div>

              <h2 className="tc-section-title">
                Administration modules
              </h2>

              <p className="tc-section-note">
                Select a module to manage its database records.
              </p>

            </div>


            <span className="tc-section-count">
              {MODULES.length} MODULES / ALL ONLINE
            </span>

          </div>


          <div
            className="tc-grid tc-reveal"
            ref={modulesRef}
          >

            {MODULES.map((module) => (

              <ModuleCard
                key={module.path}
                module={module}
                selected={
                  selected === module.path
                }
                onSelect={handleSelect}
                tilt={!reduced}
              />

            ))}

          </div>

        </section>


        {/* =====================================================
            SYSTEM STATUS
            ===================================================== */}

        <section className="tc-section">

          <div
            className="tc-panels tc-reveal"
            ref={panelsRef}
          >


            <div className="tc-panel">

              <p className="tc-panel-title">
                SYSTEM STATUS
              </p>


              <div className="tc-statuses">


                <div className="tc-status">

                  <span className="tc-status-key">
                    <i className="tc-dot" />
                    CORE SYSTEM
                  </span>

                  <span className="tc-status-val">
                    OPERATIONAL
                  </span>

                </div>


                <div className="tc-status">

                  <span className="tc-status-key">
                    <i className="tc-dot is-cyan" />
                    DATABASE
                  </span>

                  <span className="tc-status-val">
                    ACCESS GRANTED
                  </span>

                </div>


                <div className="tc-status">

                  <span className="tc-status-key">
                    <i className="tc-dot" />
                    MANAGEMENT MODULES
                  </span>

                  <span className="tc-status-val">
                    {MODULES.length} AVAILABLE
                  </span>

                </div>


                <div className="tc-status">

                  <span className="tc-status-key">

                    <i
                      className={
                        `tc-dot ${
                          sessionAuthorised
                            ? "is-violet"
                            : "is-warn"
                        }`
                      }
                    />

                    ADMIN SESSION

                  </span>


                  <span className="tc-status-val">

                    {
                      sessionAuthorised
                        ? "AUTHORIZED"
                        : "UNVERIFIED"
                    }

                  </span>

                </div>


              </div>

            </div>


            {/* =================================================
                SESSION IDENTITY
                ================================================= */}

            <div className="tc-panel">

              <p className="tc-panel-title">
                SESSION IDENTITY
              </p>


              <div className="tc-session">

                <div className="tc-session-id">

                  <span
                    className="tc-session-avatar"
                    aria-hidden="true"
                  >
                    {initials}
                  </span>


                  <div>

                    <p className="tc-session-name">
                      {adminName}
                    </p>

                    <p className="tc-session-role">
                      AUTHORIZED ADMINISTRATOR
                    </p>

                  </div>

                </div>


                <div className="tc-session-rows">

                  <div className="tc-session-row">

                    <span>
                      ACCESS LEVEL
                    </span>

                    <b>
                      FULL
                    </b>

                  </div>


                  <div className="tc-session-row">

                    <span>
                      SESSION
                    </span>

                    <b>
                      <i className="tc-dot" />
                      ACTIVE
                    </b>

                  </div>


                  <div className="tc-session-row">

                    <span>
                      SCOPE
                    </span>

                    <b>
                      BROWSER SESSION
                    </b>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            FOOTER NAVIGATION REMOVED

            The public-system shortcut and footer metadata were
            removed to keep administration navigation focused.
            Module navigation and the header logout remain unchanged.
            ===================================================== */}

      </div>

    </div>
  );
}


export default AdminDashboard;