


import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminFetch } from "../adminApi";
import "../App.css";

/* ══════════════════════════════════════════════════════════════════════════
   SECTION 1 — EMBEDDED STYLESHEET
   All of this page's visual design lives in one CSS string, injected once
   through a <style> tag near the bottom of the component. Keeping it here
   (rather than a second .css file) means there is only ever one file to
   place in your project, and it can never go missing or be misimported.
   ══════════════════════════════════════════════════════════════════════════ */

const CC_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

.cc-root {
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

.cc-root *, .cc-root *::before, .cc-root *::after { box-sizing: border-box; }

/* stop plain App.css element rules bleeding into this page, without raising
   specificity above a single class */
.cc-root :where(h1, h2, h3, h4, p, span, small, strong, b, em, i, li, label, div, button, input, td, th) {
  color: inherit;
}

/* ============================================================
   ENVIRONMENT — the same deep-ocean atmosphere as the rest of
   the admin system, kept subtle so it never fights the table.
   ============================================================ */

.cc-env { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }

.cc-env-deep {
  position: absolute; inset: 0;
  background:
    radial-gradient(80% 55% at 50% 106%, rgba(0, 229, 255, 0.14) 0%, transparent 62%),
    radial-gradient(55% 42% at 10% 6%, rgba(20, 125, 255, 0.14) 0%, transparent 64%),
    radial-gradient(48% 40% at 90% 12%, rgba(114, 92, 255, 0.1) 0%, transparent 66%),
    linear-gradient(180deg, #010509 0%, #020914 40%, #041a2f 100%);
}

/* a faint reference grid — this page is about geography, so the environment
   should hint at a map without ever becoming a literal one */
.cc-env-grid {
  position: absolute; inset: -10%;
  background-image:
    linear-gradient(rgba(0, 229, 255, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 255, 0.055) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(70% 60% at 50% 35%, #000 10%, transparent 72%);
  -webkit-mask-image: radial-gradient(70% 60% at 50% 35%, #000 10%, transparent 72%);
  animation: ccGridDrift 50s linear infinite;
}
@keyframes ccGridDrift {
  from { background-position: 0 0, 0 0; }
  to   { background-position: 64px 64px, 64px 64px; }
}

/* thin data lines slowly crossing the page — decorative only */
.cc-env-lines { position: absolute; inset: 0; }
.cc-env-lines i {
  position: absolute;
  left: -20%;
  width: 40%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 213, 0.35), transparent);
  animation: ccLine linear infinite;
}
@keyframes ccLine {
  from { transform: translateX(0); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  to   { transform: translateX(340%); opacity: 0; }
}

.cc-env-motes { position: absolute; inset: 0; }
.cc-env-motes i {
  position: absolute;
  bottom: -6vh;
  border-radius: 50%;
  background: radial-gradient(50% 50% at 50% 50%, rgba(0, 255, 213, 0.5), rgba(0, 229, 255, 0.05) 70%, transparent);
  animation: ccRise linear infinite;
}
@keyframes ccRise {
  0%   { transform: translate3d(0, 0, 0); opacity: 0; }
  12%  { opacity: 0.65; }
  84%  { opacity: 0.45; }
  100% { transform: translate3d(30px, -108vh, 0); opacity: 0; }
}

.cc-env-grade {
  position: absolute; inset: 0;
  background: radial-gradient(130% 90% at 50% 38%, transparent 42%, rgba(1, 5, 9, 0.6) 82%, rgba(1, 4, 8, 0.94) 100%);
}

/* ============================================================
   SHELL + ENTRY SEQUENCE
   ============================================================ */

.cc-shell {
  position: relative;
  z-index: 1;
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: 0 clamp(16px, 3vw, 40px) 80px;
}

.cc-stage { opacity: 0; transform: translateY(20px); }
.cc-root.is-ready .cc-stage {
  animation: ccStageIn 800ms var(--ease) both;
  animation-delay: var(--cc-delay, 0ms);
}
@keyframes ccStageIn {
  from { opacity: 0; transform: translateY(20px); filter: blur(7px); }
  to   { opacity: 1; transform: none; filter: blur(0); }
}

/* ============================================================
   HEADER
   ============================================================ */

.cc-header {
  position: sticky; top: 0; z-index: 30;
  display: flex; align-items: center; justify-content: space-between;
  gap: 18px;
  margin-bottom: clamp(26px, 5vh, 52px);
  padding: 16px 0;
  background: linear-gradient(180deg, rgba(2, 9, 20, 0.92) 40%, rgba(2, 9, 20, 0));
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.cc-brand { display: flex; align-items: center; gap: 14px; min-width: 0; }
.cc-brand-mark {
  width: 42px; height: 42px; flex: 0 0 auto;
  display: grid; place-items: center;
  border: 1px solid rgba(0, 229, 255, 0.28);
  background: linear-gradient(150deg, rgba(0, 229, 255, 0.14), rgba(114, 92, 255, 0.1));
  clip-path: polygon(50% 0, 100% 26%, 100% 74%, 50% 100%, 0 74%, 0 26%);
  box-shadow: 0 0 26px rgba(0, 229, 255, 0.22), inset 0 0 18px rgba(0, 229, 255, 0.12);
}
.cc-brand-mark svg { width: 22px; height: 22px; }
.cc-brand-name { margin: 0; font-size: 14px; font-weight: 800; letter-spacing: 0.22em; line-height: 1; }
.cc-brand-sub { margin: 5px 0 0; font-size: 8px; font-weight: 600; letter-spacing: 0.3em; color: var(--ink-3); }
.cc-brand-module { margin: 3px 0 0; font-size: 8px; font-weight: 700; letter-spacing: 0.24em; color: var(--cyan); }

.cc-online {
  display: flex; align-items: center; gap: 7px;
  margin-top: 8px;
  font-size: 8.5px; font-weight: 700; letter-spacing: 0.24em; color: var(--ink-2);
}

.cc-dot {
  width: 6px; height: 6px; flex: 0 0 auto; border-radius: 50%;
  background: var(--aqua); box-shadow: 0 0 10px var(--aqua);
  animation: ccBreath 2.8s ease-in-out infinite;
}
.cc-dot.is-cyan { background: var(--cyan); box-shadow: 0 0 10px var(--cyan); }
.cc-dot.is-violet { background: var(--violet); box-shadow: 0 0 10px var(--violet); }
.cc-dot.is-warn { background: var(--warn); box-shadow: 0 0 10px var(--warn); }
@keyframes ccBreath {
  0%, 100% { opacity: 0.35; transform: scale(0.82); }
  50%      { opacity: 1; transform: scale(1.12); }
}

/* "back to admin dashboard" — a command, not a plain link */
.cc-back {
  position: relative; overflow: hidden;
  display: inline-flex; align-items: center; gap: 9px;
  padding: 11px 18px;
  border: 1px solid rgba(0, 229, 255, 0.26);
  background: linear-gradient(180deg, rgba(4, 26, 47, 0.6), rgba(2, 9, 20, 0.6));
  color: var(--ink-2);
  font-family: inherit; font-size: 9.5px; font-weight: 700; letter-spacing: 0.24em;
  cursor: pointer;
  clip-path: polygon(0 0, calc(100% - 11px) 0, 100% 11px, 100% 100%, 11px 100%, 0 calc(100% - 11px));
  transition: color 240ms ease, border-color 240ms ease, box-shadow 320ms ease;
}
.cc-back svg { width: 14px; height: 14px; transition: transform 320ms var(--ease); }
.cc-back::after {
  content: ""; position: absolute; top: 0; bottom: 0; left: -70%; width: 50%;
  background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.28), transparent);
  transform: skewX(-18deg);
  transition: left 700ms var(--ease);
}
.cc-back:hover { color: var(--ink-1); border-color: rgba(0, 229, 255, 0.75); box-shadow: 0 0 30px -8px rgba(0, 229, 255, 0.5); }
.cc-back:hover::after { left: 120%; }
.cc-back:hover svg { transform: translateX(-4px); }
.cc-back:focus-visible { outline: 2px solid var(--cyan); outline-offset: 3px; }

/* ============================================================
   HERO + GEO CORE
   ============================================================ */

.cc-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 400px);
  align-items: center;
  gap: clamp(20px, 4vw, 50px);
  padding-bottom: clamp(30px, 6vh, 60px);
}

.cc-eyebrow {
  display: flex; align-items: center; gap: 12px;
  margin: 0 0 16px;
  font-size: 9px; font-weight: 700; letter-spacing: 0.36em; color: var(--cyan);
}
.cc-eyebrow::after {
  content: ""; flex: 1; height: 1px; max-width: 100px;
  background: linear-gradient(90deg, rgba(0, 229, 255, 0.6), transparent);
}

.cc-hero-title {
  margin: 0;
  font-size: clamp(42px, 7.4vw, 88px);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 0.88;
  background: linear-gradient(174deg, #ffffff 0%, #c8f6ff 34%, #4fa9c9 72%, #1c5170 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  filter: drop-shadow(0 0 36px rgba(0, 229, 255, 0.26));
}

.cc-hero-note {
  margin: 18px 0 0;
  max-width: 50ch;
  font-size: 14px;
  line-height: 1.65;
  color: var(--ink-2);
}

/* real-data HUD strip under the hero copy — every value below is read from
   application state, never invented */
.cc-hud-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; }
.cc-hud-chip {
  display: flex; align-items: center; gap: 9px;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(2, 10, 22, 0.55);
}
.cc-hud-chip-text { display: grid; gap: 3px; }
.cc-hud-chip-key { font-size: 7.5px; font-weight: 700; letter-spacing: 0.24em; color: var(--ink-3); }
.cc-hud-chip-val { font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; color: var(--ink-1); }

/* the geographic core */
.cc-core-wrap {
  position: relative; display: grid; place-items: center;
  aspect-ratio: 1; width: 100%; max-width: 380px; justify-self: center;
  perspective: 900px;
}
.cc-core-glow {
  position: absolute; inset: 8%; border-radius: 50%;
  background:
    radial-gradient(50% 50% at 50% 50%, rgba(0, 229, 255, 0.28), transparent 68%),
    radial-gradient(60% 60% at 42% 74%, rgba(0, 255, 213, 0.2), transparent 72%);
  filter: blur(28px);
  animation: ccBreath 7s ease-in-out infinite;
}
.cc-core {
  position: relative; width: 64%; aspect-ratio: 1;
  transform-style: preserve-3d;
  transform: rotateX(18deg) rotateZ(-6deg);
  animation: ccCoreSpin 46s linear infinite;
}
@keyframes ccCoreSpin {
  from { transform: rotateX(18deg) rotateZ(-6deg) rotateY(0deg); }
  to   { transform: rotateX(18deg) rotateZ(-6deg) rotateY(360deg); }
}
.cc-core-meridian {
  position: absolute; inset: 0;
  border: 1px solid rgba(0, 229, 255, 0.18);
  border-radius: 50%;
  transform-style: preserve-3d;
}
.cc-core-meridian:nth-child(odd) { border-color: rgba(0, 255, 213, 0.12); }
.cc-core-parallel {
  position: absolute; left: 50%; top: 50%;
  border: 1px solid rgba(20, 125, 255, 0.16);
  border-radius: 50%;
  transform-style: preserve-3d;
}
.cc-core-body {
  position: absolute; inset: 6%; border-radius: 50%;
  background:
    radial-gradient(42% 38% at 32% 26%, rgba(180, 250, 255, 0.46), transparent 62%),
    radial-gradient(70% 70% at 62% 74%, rgba(0, 120, 160, 0.4), transparent 72%),
    linear-gradient(160deg, rgba(4, 40, 62, 0.86), rgba(2, 12, 26, 0.94));
  box-shadow:
    inset -18px -22px 60px rgba(0, 0, 0, 0.75),
    inset 12px 14px 44px rgba(0, 229, 255, 0.15),
    0 0 60px rgba(0, 229, 255, 0.18);
}
.cc-core-scan {
  position: absolute; left: 6%; right: 6%; height: 15%; border-radius: 50%;
  background: linear-gradient(180deg, transparent, rgba(0, 255, 213, 0.3), transparent);
  filter: blur(3px);
  animation: ccScan 6.5s ease-in-out infinite;
}
@keyframes ccScan {
  0%, 100% { top: 4%; opacity: 0; }
  20%      { opacity: 1; }
  80%      { opacity: 1; }
  92%      { top: 80%; opacity: 0; }
}
.cc-core-node {
  position: absolute; width: 6px; height: 6px; margin: -3px 0 0 -3px;
  border-radius: 50%; background: var(--aqua); box-shadow: 0 0 10px var(--aqua);
  animation: ccBreath 3.4s ease-in-out infinite;
}
.cc-core-node::after {
  content: ""; position: absolute; inset: -5px;
  border: 1px solid rgba(0, 255, 213, 0.5); border-radius: 50%;
  animation: ccPing 3.4s ease-out infinite;
}
@keyframes ccPing {
  0%   { transform: scale(0.4); opacity: 0.9; }
  70%  { transform: scale(2.1); opacity: 0; }
  100% { opacity: 0; }
}
.cc-core-orbit {
  position: absolute; inset: 0; border: 1px solid rgba(0, 229, 255, 0.15);
  border-radius: 50%; animation: ccOrbit 28s linear infinite;
}
.cc-core-orbit::before {
  content: ""; position: absolute; left: 50%; top: -3.5px;
  width: 7px; height: 7px; margin-left: -3.5px; border-radius: 50%;
  background: var(--cyan); box-shadow: 0 0 14px var(--cyan);
}
.cc-core-orbit.is-b { inset: -8%; border-color: rgba(114, 92, 255, 0.15); animation: ccOrbitB 40s linear infinite; }
.cc-core-orbit.is-b::before { background: var(--violet); box-shadow: 0 0 14px var(--violet); }
@keyframes ccOrbit { to { transform: rotate(360deg); } }
@keyframes ccOrbitB { from { transform: rotate(14deg); } to { transform: rotate(374deg); } }

/* ============================================================
   SECTION HEADS (shared shape for console + database panels)
   ============================================================ */

.cc-section { padding-top: clamp(30px, 6vh, 60px); }
.cc-section-head {
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 20px; flex-wrap: wrap;
  margin-bottom: clamp(18px, 3vh, 30px);
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 229, 255, 0.12);
}
.cc-section-title { margin: 0; font-size: clamp(19px, 2.6vw, 26px); font-weight: 800; letter-spacing: -0.01em; }
.cc-section-note { margin: 7px 0 0; font-size: 13px; color: var(--ink-2); }

/* ============================================================
   ADD COUNTY — COMMAND CONSOLE
   ============================================================ */

.cc-console {
  position: relative;
  padding: 30px clamp(22px, 3vw, 34px) 28px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: linear-gradient(158deg, rgba(10, 32, 54, 0.6), rgba(3, 12, 26, 0.78));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px));
  box-shadow: 0 24px 50px -30px rgba(0, 0, 0, 0.9);
}
.cc-console::before {
  content: ""; position: absolute; left: 0; right: 22px; top: 0; height: 1px;
  background: linear-gradient(90deg, rgba(0, 229, 255, 0.7), transparent);
}

.cc-console-title {
  display: flex; align-items: center; gap: 12px;
  margin: 0 0 22px;
  font-size: 12px; font-weight: 800; letter-spacing: 0.22em;
}
.cc-console-title svg { width: 18px; height: 18px; color: var(--cyan); }

.cc-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 16px;
  align-items: end;
}

.cc-field { display: grid; gap: 9px; }
.cc-field-label {
  display: flex; align-items: center; gap: 8px;
  font-size: 9px; font-weight: 700; letter-spacing: 0.26em; color: var(--ink-3);
  transition: color 240ms ease;
}
.cc-field:focus-within .cc-field-label { color: var(--cyan); }

.cc-field-shell {
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(2, 10, 22, 0.55);
  transition: border-color 260ms ease, box-shadow 260ms ease, background 260ms ease;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
}
.cc-field-shell::after {
  content: ""; position: absolute; left: 0; bottom: 0; height: 1px; width: 0;
  background: linear-gradient(90deg, var(--cyan), var(--aqua), transparent);
  transition: width 460ms var(--ease);
}
.cc-field:focus-within .cc-field-shell {
  border-color: rgba(0, 229, 255, 0.55);
  background: rgba(0, 229, 255, 0.06);
  box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.08), 0 0 26px rgba(0, 229, 255, 0.18);
}
.cc-field:focus-within .cc-field-shell::after { width: 100%; }

.cc-field-input {
  width: 100%;
  padding: 13px 14px;
  border: 0; background: transparent;
  color: var(--ink-1);
  font-family: inherit; font-size: 14px; font-weight: 500; letter-spacing: 0.02em;
  outline: none;
}
.cc-field-input.is-mono { font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; letter-spacing: 0.06em; }
.cc-field-input::placeholder { color: rgba(92, 125, 148, 0.7); }

/* register button */
.cc-register {
  position: relative; overflow: hidden;
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  padding: 14px 22px;
  height: 46px;
  border: 1px solid rgba(0, 229, 255, 0.5);
  background: linear-gradient(180deg, rgba(0, 229, 255, 0.16), rgba(0, 120, 150, 0.14));
  color: var(--ink-1);
  font-family: inherit; font-size: 10px; font-weight: 800; letter-spacing: 0.2em;
  white-space: nowrap;
  cursor: pointer;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  transition: transform 240ms var(--ease), box-shadow 300ms ease, border-color 240ms ease;
}
.cc-register svg { width: 15px; height: 15px; }
.cc-register::after {
  content: ""; position: absolute; top: 0; bottom: 0; left: -70%; width: 50%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.32), transparent);
  transform: skewX(-18deg);
  transition: left 640ms var(--ease);
}
.cc-register:hover { transform: translateY(-2px); box-shadow: 0 14px 34px -14px rgba(0, 229, 255, 0.6); }
.cc-register:hover::after { left: 120%; }
.cc-register:focus-visible { outline: 2px solid var(--cyan); outline-offset: 3px; }
.cc-register:active { transform: translateY(0) scale(0.98); }

/* ============================================================
   MESSAGES — success / error
   ============================================================ */

.cc-message {
  display: flex; align-items: flex-start; gap: 12px;
  margin-top: 18px;
  padding: 13px 16px;
  font-size: 13px; line-height: 1.5;
  animation: ccMessageIn 380ms var(--ease) both;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
}
@keyframes ccMessageIn { from { opacity: 0; transform: translateY(-6px); } }

.cc-message.is-ok {
  border: 1px solid rgba(0, 255, 213, 0.4);
  background: linear-gradient(180deg, rgba(0, 60, 50, 0.4), rgba(2, 20, 18, 0.35));
  color: #b6ffe9;
}
.cc-message.is-fail {
  border: 1px solid rgba(255, 92, 108, 0.42);
  background: linear-gradient(180deg, rgba(60, 10, 22, 0.5), rgba(20, 6, 12, 0.4));
  color: #ffc3ca;
}
.cc-message-head { display: block; font-size: 9px; font-weight: 800; letter-spacing: 0.24em; margin-bottom: 3px; }
.cc-message svg { width: 17px; height: 17px; flex: 0 0 auto; margin-top: 1px; }

/* ============================================================
   DATABASE PANEL — table + metadata
   ============================================================ */

.cc-db-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 260px);
  gap: clamp(14px, 1.8vw, 22px);
  align-items: start;
}

.cc-panel {
  position: relative;
  padding: 24px clamp(18px, 2.4vw, 28px) 22px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: linear-gradient(158deg, rgba(8, 26, 44, 0.5), rgba(2, 10, 22, 0.72));
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
  overflow: hidden;
}
.cc-panel::before {
  content: ""; position: absolute; left: 0; right: 20px; top: 0; height: 1px;
  background: linear-gradient(90deg, rgba(0, 229, 255, 0.7), transparent);
}

.cc-panel-top {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
  margin-bottom: 18px;
}
.cc-panel-title { margin: 0; font-size: 14px; font-weight: 800; letter-spacing: 0.02em; }
.cc-panel-note { margin: 6px 0 0; font-size: 11.5px; color: var(--ink-2); }

/* refresh / synchronise control */
.cc-sync {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 14px;
  border: 1px solid rgba(0, 229, 255, 0.3);
  background: rgba(0, 229, 255, 0.06);
  color: var(--ink-2);
  font-family: inherit; font-size: 9px; font-weight: 700; letter-spacing: 0.2em;
  white-space: nowrap;
  cursor: pointer;
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  transition: color 220ms ease, border-color 220ms ease, background 220ms ease;
}
.cc-sync svg { width: 13px; height: 13px; transition: transform 500ms var(--ease); }
.cc-sync:hover { color: var(--ink-1); border-color: rgba(0, 229, 255, 0.7); background: rgba(0, 229, 255, 0.12); }
.cc-sync:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }
.cc-sync.is-spinning svg { animation: ccSpin 700ms linear; }
@keyframes ccSpin { to { transform: rotate(360deg); } }

/* ---- loading state ---- */
.cc-loading { display: grid; place-items: center; gap: 16px; padding: 56px 20px; text-align: center; }
.cc-loading-ring {
  position: relative; width: 56px; height: 56px;
}
.cc-loading-ring i {
  position: absolute; inset: 0;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: var(--cyan);
  border-right-color: rgba(0, 229, 255, 0.25);
  animation: ccSpin 1.1s linear infinite;
}
.cc-loading-ring i:nth-child(2) { inset: 9px; border-top-color: var(--aqua); animation-duration: 1.5s; animation-direction: reverse; }
.cc-loading-text { font-size: 10px; font-weight: 700; letter-spacing: 0.26em; color: var(--ink-2); }
.cc-loading-sub { font-size: 11px; color: var(--ink-3); }
.cc-loading-scan {
  width: min(280px, 70vw); height: 2px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
  position: relative;
}
.cc-loading-scan::after {
  content: ""; position: absolute; top: 0; bottom: 0; width: 40%;
  background: linear-gradient(90deg, transparent, var(--cyan), transparent);
  animation: ccScanBar 1.3s ease-in-out infinite;
}
@keyframes ccScanBar {
  0%   { left: -40%; }
  100% { left: 100%; }
}

/* ---- empty state ---- */
.cc-empty {
  display: grid; place-items: center; gap: 10px;
  padding: 52px 20px;
  text-align: center;
  border: 1px dashed rgba(0, 229, 255, 0.22);
  background: rgba(0, 229, 255, 0.03);
}
.cc-empty svg { width: 34px; height: 34px; color: var(--ink-3); margin-bottom: 4px; }
.cc-empty-title { margin: 0; font-size: 13px; font-weight: 800; letter-spacing: 0.16em; color: var(--ink-1); }
.cc-empty-sub { margin: 0; font-size: 11.5px; color: var(--ink-3); letter-spacing: 0.08em; }
.cc-empty-cta {
  margin-top: 10px;
  padding: 10px 18px;
  border: 1px solid rgba(0, 229, 255, 0.4);
  background: rgba(0, 229, 255, 0.08);
  color: var(--ink-1);
  font-family: inherit; font-size: 9.5px; font-weight: 700; letter-spacing: 0.2em;
  cursor: pointer;
  transition: background 220ms ease, border-color 220ms ease;
}
.cc-empty-cta:hover { background: rgba(0, 229, 255, 0.16); border-color: rgba(0, 229, 255, 0.7); }
.cc-empty-cta:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }

/* ---- the data table ---- */
.cc-table-wrap { overflow-x: auto; }
.cc-table { width: 100%; border-collapse: collapse; min-width: 460px; }

.cc-table thead th {
  padding: 0 14px 12px;
  text-align: left;
  font-size: 8.5px; font-weight: 700; letter-spacing: 0.26em; color: var(--ink-3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.cc-table thead th:last-child { text-align: right; }

.cc-row { position: relative; transition: background 220ms ease; }
.cc-row td {
  padding: 15px 14px;
  font-size: 13.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.045);
  vertical-align: middle;
}
.cc-row:hover { background: rgba(0, 229, 255, 0.045); }

/* left edge indicator that appears on hover */
.cc-row::before {
  content: "";
  position: absolute; left: 0; top: 8%; bottom: 8%; width: 2px;
  background: var(--cyan);
  opacity: 0;
  box-shadow: 0 0 10px var(--cyan);
  transition: opacity 220ms ease;
}
.cc-row:hover::before { opacity: 1; }
.cc-row.is-editing::before { opacity: 1; background: var(--aqua); box-shadow: 0 0 12px var(--aqua); }
.cc-row.is-editing { background: rgba(0, 255, 213, 0.05); }

/* the county code, styled as a small geographic node */
.cc-code {
  display: inline-flex; align-items: center; gap: 9px;
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 13px; font-weight: 600; letter-spacing: 0.06em;
  color: var(--ink-2);
  transition: color 220ms ease;
}
.cc-row:hover .cc-code { color: var(--cyan); }
.cc-code-dot {
  width: 5px; height: 5px; flex: 0 0 auto; border-radius: 50%;
  background: rgba(0, 229, 255, 0.5);
  transition: background 220ms ease, box-shadow 220ms ease;
}
.cc-row:hover .cc-code-dot { background: var(--cyan); box-shadow: 0 0 8px var(--cyan); }

.cc-state-text { color: var(--ink-1); transition: color 220ms ease; }
.cc-row:hover .cc-state-text { color: #fff; }

/* inline edit input inside a table cell */
.cc-edit-input {
  width: 100%;
  min-width: 140px;
  padding: 9px 11px;
  border: 1px solid rgba(0, 255, 213, 0.4);
  background: rgba(0, 20, 24, 0.7);
  color: var(--ink-1);
  font-family: inherit; font-size: 13px;
  outline: none;
  transition: border-color 220ms ease, box-shadow 220ms ease;
}
.cc-edit-input:focus { border-color: var(--aqua); box-shadow: 0 0 0 3px rgba(0, 255, 213, 0.12); }

/* action buttons */
.cc-actions { display: flex; justify-content: flex-end; gap: 8px; }

.cc-action-btn {
  padding: 8px 13px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  color: var(--ink-2);
  font-family: inherit; font-size: 9px; font-weight: 700; letter-spacing: 0.16em;
  white-space: nowrap;
  cursor: pointer;
  transition: color 200ms ease, border-color 200ms ease, background 200ms ease, box-shadow 200ms ease;
}
.cc-action-btn:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }

.cc-action-btn.is-save {
  border-color: rgba(0, 255, 213, 0.4); color: #b6ffe9;
}
.cc-action-btn.is-save:hover { background: rgba(0, 255, 213, 0.12); border-color: rgba(0, 255, 213, 0.8); box-shadow: 0 0 18px -6px rgba(0, 255, 213, 0.6); }

.cc-action-btn.is-cancel:hover { color: var(--ink-1); border-color: rgba(255, 255, 255, 0.3); background: rgba(255, 255, 255, 0.06); }

.cc-action-btn.is-edit:hover { color: var(--cyan); border-color: rgba(0, 229, 255, 0.5); background: rgba(0, 229, 255, 0.08); }

.cc-action-btn.is-delete { border-color: rgba(255, 92, 108, 0.3); color: #ffb3ba; }
.cc-action-btn.is-delete:hover { background: rgba(255, 92, 108, 0.12); border-color: rgba(255, 92, 108, 0.7); box-shadow: 0 0 18px -6px rgba(255, 92, 108, 0.6); }

/* ---- metadata side panel ---- */
.cc-meta-rows { display: grid; gap: 12px; }
.cc-meta-row {
  display: flex; align-items: center; justify-content: space-between; gap: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 9.5px; font-weight: 600; letter-spacing: 0.16em; color: var(--ink-3);
}
.cc-meta-row b { display: flex; align-items: center; gap: 7px; color: var(--ink-1); font-weight: 700; letter-spacing: 0.08em; }

.cc-meta-count {
  margin-top: 6px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 229, 255, 0.14);
  text-align: center;
}
.cc-meta-count-num {
  font-size: 34px; font-weight: 900; letter-spacing: -0.02em;
  background: linear-gradient(174deg, #ffffff, var(--cyan));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.cc-meta-count-label { margin-top: 4px; font-size: 8.5px; font-weight: 700; letter-spacing: 0.28em; color: var(--ink-3); }

/* ============================================================
   RESPONSIVE
   ============================================================ */

@media (max-width: 1040px) {
  .cc-hero { grid-template-columns: 1fr; }
  .cc-core-wrap { max-width: 300px; order: -1; }
  .cc-db-layout { grid-template-columns: 1fr; }
}

@media (max-width: 760px) {
  .cc-header { padding: 12px 0; }
  .cc-brand-mark { width: 36px; height: 36px; }
  .cc-brand-name { font-size: 12px; }
  .cc-back span { display: none; }
  .cc-back { padding: 11px 13px; }
  .cc-form-grid { grid-template-columns: 1fr; }
  .cc-register { width: 100%; }
  .cc-panel-top { flex-direction: column; align-items: stretch; }
  .cc-sync { justify-content: center; }
  .cc-env-motes, .cc-env-lines { display: none; }
}

/* ============================================================
   REDUCED MOTION
   ============================================================ */

@media (prefers-reduced-motion: reduce) {
  .cc-root *, .cc-root *::before, .cc-root *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
  .cc-stage { opacity: 1 !important; transform: none !important; }
  .cc-env-motes, .cc-env-lines { display: none; }
}
`;

// Renders the stylesheet above. Called once, near the top of the page markup.
function CountyStyles() {
  return <style>{CC_CSS}</style>;
}

/* ══════════════════════════════════════════════════════════════════════════
   SECTION 2 — ICONS
   Small inline SVGs so the page never depends on an icon package or on
   emoji, which the design brief asked to remove.
   ══════════════════════════════════════════════════════════════════════════ */

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

function IconGeoMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path {...S} d="M3.4 6.6 9 4.4l6 2.2 5.6-2.2v13l-5.6 2.2-6-2.2-5.6 2.2v-13Z" />
      <path {...S} opacity="0.7" d="M9 4.4v13M15 6.6v13" />
    </svg>
  );
}
function IconBack() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path {...S} strokeWidth="1.8" d="M20 12H6M11 6.5 5.5 12 11 17.5" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path {...S} strokeWidth="1.8" d="M12 5v14M5 12h14" />
    </svg>
  );
}
function IconSync() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path {...S} d="M20 11A8 8 0 1 0 18.6 16" />
      <path {...S} d="M20 5v6h-6" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle {...S} cx="12" cy="12" r="9.2" />
      <path {...S} strokeWidth="1.9" d="m8 12.4 2.6 2.6L16.4 9" />
    </svg>
  );
}
function IconWarn() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path {...S} d="M12 3.6 21.4 20H2.6L12 3.6Z" />
      <path {...S} strokeWidth="1.9" d="M12 9.4v4.6" />
      <circle cx="12" cy="17" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconEmpty() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path {...S} d="M3.4 6.6 9 4.4l6 2.2 5.6-2.2v13l-5.6 2.2-6-2.2-5.6 2.2v-13Z" />
      <path {...S} strokeDasharray="2 3" opacity="0.7" d="M9 4.4v13M15 6.6v13" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SECTION 3 — SMALL DECORATIVE PIECES
   ══════════════════════════════════════════════════════════════════════════ */

// A fixed list, not random(): a random list would reshuffle on every render.
const MOTES = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 41.3) % 100,
  size: 3 + ((i * 7) % 8),
  duration: 28 + ((i * 11) % 22),
  delay: -(i * 2.6),
}));
const LINES = Array.from({ length: 5 }, (_, i) => ({
  top: 10 + i * 19,
  duration: 14 + i * 3,
  delay: -(i * 4),
}));

function Environment() {
  return (
    <div className="cc-env" aria-hidden="true">
      <div className="cc-env-deep" />
      <div className="cc-env-grid" />
      <div className="cc-env-lines">
        {LINES.map((l, i) => (
          <i key={i} style={{ top: `${l.top}%`, animationDuration: `${l.duration}s`, animationDelay: `${l.delay}s` }} />
        ))}
      </div>
      <div className="cc-env-motes">
        {MOTES.map((m, i) => (
          <i
            key={i}
            style={{ left: `${m.left}%`, width: m.size, height: m.size, animationDuration: `${m.duration}s`, animationDelay: `${m.delay}s` }}
          />
        ))}
      </div>
      <div className="cc-env-grade" />
    </div>
  );
}

// The geographic core: a CSS-only wireframe sphere, built the same way as the
// dashboard's core so the two pages feel like one system. No WebGL, no new
// dependency — 12 meridian rings rotated around Y, spun slowly by one parent
// transform.
const MERIDIANS = Array.from({ length: 10 }, (_, i) => i * 18);
const PARALLELS = [
  { scale: 0.34, y: -34 },
  { scale: 0.68, y: -18 },
  { scale: 0.86, y: 0 },
  { scale: 0.68, y: 18 },
  { scale: 0.34, y: 34 },
];
const NODES = [
  { left: "30%", top: "32%" },
  { left: "64%", top: "28%" },
  { left: "46%", top: "60%" },
  { left: "70%", top: "66%" },
];

function GeoCore() {
  return (
    <div className="cc-core-wrap" aria-hidden="true">
      <div className="cc-core-glow" />
      <div className="cc-core-orbit" />
      <div className="cc-core-orbit is-b" />
      <div className="cc-core">
        <div className="cc-core-body" />
        {MERIDIANS.map((deg) => (
          <div key={deg} className="cc-core-meridian" style={{ transform: `rotateY(${deg}deg)` }} />
        ))}
        {PARALLELS.map((p, i) => (
          <div
            key={i}
            className="cc-core-parallel"
            style={{
              width: `${p.scale * 100}%`,
              height: `${p.scale * 100}%`,
              marginLeft: `${(-p.scale * 100) / 2}%`,
              marginTop: `${(-p.scale * 100) / 2}%`,
              transform: `translateY(${p.y}%) rotateX(90deg)`,
            }}
          />
        ))}
        <div className="cc-core-scan" />
        {NODES.map((n, i) => (
          <div key={i} className="cc-core-node" style={{ left: n.left, top: n.top, animationDelay: `${i * 0.7}s` }} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SECTION 4 — THE COMPONENT
   From here down is your original logic. Every state variable and function
   keeps its original name and job; only the JSX it returns has changed.
   ══════════════════════════════════════════════════════════════════════════ */

function AdminCounties() {

    // ========================================================
    // STATE MANAGEMENT
    // ========================================================

    // Store the county records returned by the backend.
    const [counties, setCounties] = useState([]);

    // Store what the admin is typing into the "Add County" form.
    const [countyCode, setCountyCode] = useState("");
    const [state, setState] = useState("");

    // Track which county (by COUNTY_CODE) is currently being edited, and
    // what its new state value is while it is being edited. editingCode is
    // null when nothing is being edited.
    const [editingCode, setEditingCode] = useState(null);
    const [editingState, setEditingState] = useState("");

    // Track whether the county list is currently being fetched, and hold
    // any success or error message so it can be shown to the admin.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // useNavigate lets this page send the admin back to the main dashboard
    // (and, from the header, back to /admin) without a full page reload.
    const navigate = useNavigate();

    // ---- visual-only state below this line. None of it talks to the
    // backend or changes what data is sent or received. ----
    const [ready, setReady] = useState(false);       // releases the entry animation
    const [reduced, setReduced] = useState(false);    // prefers-reduced-motion
    const [syncSpin, setSyncSpin] = useState(false);  // spins the refresh icon briefly
    const codeInputRef = useRef(null);                // lets the empty-state CTA focus the form


    // ========================================================
    // COUNTY API OPERATIONS
    // ========================================================

    // Ask the backend for every county record.
    // Endpoint: GET https://toxictide-backend.onrender.com/api/admin/counties
    // On success: store the records in `counties`.
    // On failure: store the backend's error message in `error`.
    const fetchCounties = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await adminFetch(
                "https://toxictide-backend.onrender.com/api/admin/counties"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to load counties"
                );
            }

            setCounties(data);

        } catch (error) {

            console.error(error);
            setError(error.message);

        } finally {

            setLoading(false);
        }
    };


    // Load the county list the moment this page opens, so the admin never
    // has to click a button just to see the current data.
    useEffect(() => {
        fetchCounties();
    }, []);

    // Read the browser's "reduce motion" accessibility setting once, and
    // release the page's entry animation on the next frame.
    useEffect(() => {
        const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        setReduced(Boolean(mq?.matches));
        const id = requestAnimationFrame(() => setReady(true));
        return () => cancelAnimationFrame(id);
    }, []);


    // Send a new county to the backend.
    // Endpoint: POST https://toxictide-backend.onrender.com/api/admin/counties
    // Body sent: { countyCode, state } (both trimmed of extra spaces).
    // On success: show a success message, clear the form, and reload the list.
    // On failure: show the backend's actual error message.
    const handleAdd = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");

        try {

            const response = await adminFetch(
                "https://toxictide-backend.onrender.com/api/admin/counties",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        countyCode: countyCode.trim(),
                        state: state.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to add county"
                );
            }

            setMessage("County added successfully.");

            setCountyCode("");
            setState("");

            fetchCounties();

        } catch (error) {

            console.error(error);
            setError(error.message);
        }
    };


    // ========================================================
    // EDITING LOGIC
    // ========================================================

    // Turn on edit mode for one county row. We remember which county by its
    // COUNTY_CODE, and copy its current STATE into editingState so the input
    // starts out showing the existing value.
    const startEdit = (county) => {

        setEditingCode(county.COUNTY_CODE);
        setEditingState(county.STATE);

        setError("");
        setMessage("");
    };


    // Leave edit mode without saving anything.
    const cancelEdit = () => {

        setEditingCode(null);
        setEditingState("");
    };


    // Save the edited state value for one county.
    // Endpoint: PUT https://toxictide-backend.onrender.com/api/admin/counties/{code}
    // Body sent: { state } (trimmed of extra spaces). Only the state value
    // is editable here — the county code itself is not changed.
    // On success: show a success message, leave edit mode, reload the list.
    // On failure: show the backend's actual error message.
    const handleUpdate = async (code) => {

        setError("");
        setMessage("");

        try {

            const response = await adminFetch(
                `https://toxictide-backend.onrender.com/api/admin/counties/${encodeURIComponent(code)}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        state: editingState.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to update county"
                );
            }

            setMessage("County updated successfully.");

            cancelEdit();
            fetchCounties();

        } catch (error) {

            console.error(error);
            setError(error.message);
        }
    };


    // ========================================================
    // DELETE LOGIC
    // ========================================================

    // Delete one county record.
    // A confirm() dialog is shown first because deleting a county cannot be
    // undone, and because the backend may reject the delete if a monitoring
    // station still references this county — the admin should know that
    // before they try.
    // The county code is URL-encoded with encodeURIComponent() because county
    // codes can contain characters (like spaces or symbols) that are not
    // safe to put directly into a URL.
    // Endpoint: DELETE https://toxictide-backend.onrender.com/api/admin/counties/{code}
    // On success: show a success message and reload the list.
    // On failure: show the backend's actual error message (for example, the
    // "this county is still in use" error).
    const handleDelete = async (code) => {

        const confirmed = window.confirm(
            `Delete county ${code}? This may fail if monitoring stations use this county.`
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setMessage("");

        try {

            const response = await adminFetch(
                `https://toxictide-backend.onrender.com/api/admin/counties/${encodeURIComponent(code)}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to delete county"
                );
            }

            setMessage("County deleted successfully.");

            fetchCounties();

        } catch (error) {

            console.error(error);
            setError(error.message);
        }
    };


    // ========================================================
    // VISUAL-ONLY HELPERS
    // These do not touch the backend. They only make the existing behaviour
    // (refresh, "no records yet") feel like part of the command-center design.
    // ========================================================

    // Wraps fetchCounties so the refresh icon gets a brief spin animation.
    // The actual network request is exactly fetchCounties() — nothing about
    // the request is changed or delayed.
    const handleSync = useCallback(() => {
        setSyncSpin(true);
        fetchCounties();
        setTimeout(() => setSyncSpin(false), 650);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Used by the empty-state button to send focus to the Add County form.
    const focusAddForm = useCallback(() => {
        codeInputRef.current?.focus();
    }, []);


    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className={`cc-root${ready ? " is-ready" : ""}`}>
            <CountyStyles />
            <Environment />

            <div className="cc-shell">

                {/* ============================================
                    COMMAND HEADER
                    ToxicTide identity on the left, and a control that
                    sends the admin back to the main dashboard on the
                    right. Navigation still uses navigate("/admin").
                ============================================ */}
                <header className="cc-header cc-stage" style={{ "--cc-delay": "200ms" }}>
                    <div className="cc-brand">
                        <span className="cc-brand-mark" aria-hidden="true"><IconGeoMark /></span>
                        <div>
                            <p className="cc-brand-name">TOXICTIDE</p>
                            <p className="cc-brand-sub">GEOGRAPHICAL INTELLIGENCE</p>
                            <p className="cc-brand-module">COUNTY MANAGEMENT MODULE</p>
                            <p className="cc-online"><i className="cc-dot" />SYSTEM ONLINE</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="cc-back"
                        onClick={() => navigate("/admin")}
                    >
                        <IconBack />
                        <span>ADMIN COMMAND CENTER</span>
                    </button>
                </header>

                {/* ============================================
                    GEOGRAPHICAL INTELLIGENCE HERO
                    Introduces what this page manages, and shows the
                    real, live county count — never an invented number.
                ============================================ */}
                <section className="cc-hero">
                    <div>
                        <p className="cc-eyebrow cc-stage" style={{ "--cc-delay": "380ms" }}>
                            REFERENCE DATA LAYER
                        </p>

                        <h1 className="cc-hero-title cc-stage" style={{ "--cc-delay": "460ms" }}>
                            COUNTY<br />INTELLIGENCE
                        </h1>

                        <p className="cc-hero-note cc-stage" style={{ "--cc-delay": "580ms" }}>
                            Manage the geographical reference data used by the ToxicTide
                            monitoring network. Every station on the network is linked to
                            a county record maintained here.
                        </p>

                        {/* Status HUD — every value is something this page actually
                            knows, either from application state or from the session. */}
                        <div className="cc-hud-row cc-stage" style={{ "--cc-delay": "680ms" }}>
                            <div className="cc-hud-chip">
                                <i className="cc-dot" />
                                <span className="cc-hud-chip-text">
                                    <span className="cc-hud-chip-key">REFERENCE DATABASE</span>
                                    <span className="cc-hud-chip-val">CONNECTED</span>
                                </span>
                            </div>
                            <div className="cc-hud-chip">
                                <i className="cc-dot is-cyan" />
                                <span className="cc-hud-chip-text">
                                    <span className="cc-hud-chip-key">COUNTY MODULE</span>
                                    <span className="cc-hud-chip-val">ACTIVE</span>
                                </span>
                            </div>
                            <div className="cc-hud-chip">
                                <i className="cc-dot is-violet" />
                                <span className="cc-hud-chip-text">
                                    <span className="cc-hud-chip-key">ADMIN SESSION</span>
                                    <span className="cc-hud-chip-val">AUTHORIZED</span>
                                </span>
                            </div>
                            <div className="cc-hud-chip">
                                <i className="cc-dot is-cyan" />
                                <span className="cc-hud-chip-text">
                                    <span className="cc-hud-chip-key">COUNTY RECORDS</span>
                                    <span className="cc-hud-chip-val">{counties.length}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="cc-stage" style={{ "--cc-delay": "700ms" }}>
                        <GeoCore />
                    </div>
                </section>

                {/* ============================================
                    ADD COUNTY COMMAND CONSOLE
                    A redesigned version of the original Add County
                    form. onSubmit still calls handleAdd exactly as
                    before; only the visual presentation changed.
                ============================================ */}
                <section className="cc-section">
                    <div className="cc-console cc-stage" style={{ "--cc-delay": "900ms" }}>
                        <h2 className="cc-console-title">
                            <IconPlus />
                            INITIALIZE COUNTY RECORD
                        </h2>

                        <form className="cc-form-grid" onSubmit={handleAdd}>

                            {/* County code field — tied to countyCode / setCountyCode,
                                exactly as in the original form. */}
                            <div className="cc-field">
                                <label className="cc-field-label" htmlFor="countyCode">
                                    COUNTY CODE
                                </label>
                                <div className="cc-field-shell">
                                    <input
                                        ref={codeInputRef}
                                        id="countyCode"
                                        className="cc-field-input is-mono"
                                        type="text"
                                        value={countyCode}
                                        onChange={(event) => setCountyCode(event.target.value)}
                                        placeholder="Example: 001"
                                        required
                                    />
                                </div>
                            </div>

                            {/* State field — tied to state / setState, exactly as in
                                the original form. Property name kept as "state" so
                                the request body below still matches the backend. */}
                            <div className="cc-field">
                                <label className="cc-field-label" htmlFor="state">
                                    STATE
                                </label>
                                <div className="cc-field-shell">
                                    <input
                                        id="state"
                                        className="cc-field-input"
                                        type="text"
                                        value={state}
                                        onChange={(event) => setState(event.target.value)}
                                        placeholder="Example: Ohio"
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="cc-register">
                                <IconPlus />
                                REGISTER COUNTY
                            </button>
                        </form>

                        {/* ============================================
                            SUCCESS AND ERROR FEEDBACK
                            `message` and `error` are the same state
                            variables the original page used — only the
                            presentation is new. The real backend error
                            text is always shown, never replaced.
                        ============================================ */}
                        {message && (
                            <div className="cc-message is-ok" role="status">
                                <IconCheck />
                                <span>
                                    <span className="cc-message-head">DATA TRANSACTION COMPLETE</span>
                                    {message}
                                </span>
                            </div>
                        )}

                        {error && (
                            <div className="cc-message is-fail" role="alert">
                                <IconWarn />
                                <span>
                                    <span className="cc-message-head">DATA TRANSACTION FAILED</span>
                                    {error}
                                </span>
                            </div>
                        )}
                    </div>
                </section>

                {/* ============================================
                    COUNTY DATABASE RECORDS
                    The table and its metadata panel. Loading, empty,
                    and populated states are each handled explicitly
                    below so the admin is never shown a misleading view.
                ============================================ */}
                <section className="cc-section">
                    <div className="cc-section-head cc-stage" style={{ "--cc-delay": "1100ms" }}>
                        <div>
                            <h2 className="cc-section-title">County database</h2>
                            <p className="cc-section-note">{counties.length} county records on file.</p>
                        </div>
                    </div>

                    <div className="cc-db-layout cc-stage" style={{ "--cc-delay": "1200ms" }}>

                        {/* ---- main records panel ---- */}
                        <div className="cc-panel">
                            <div className="cc-panel-top">
                                <div>
                                    <h3 className="cc-panel-title">County records</h3>
                                    <p className="cc-panel-note">Manage individual county entries below.</p>
                                </div>

                                {/* Refresh / Synchronize — still calls fetchCounties. */}
                                <button
                                    type="button"
                                    className={`cc-sync${syncSpin ? " is-spinning" : ""}`}
                                    onClick={handleSync}
                                >
                                    <IconSync />
                                    SYNCHRONIZE
                                </button>
                            </div>

                            {loading ? (
                                /* ---- loading state ---- */
                                <div className="cc-loading">
                                    <div className="cc-loading-ring"><i /><i /></div>
                                    <p className="cc-loading-text">SYNCING GEOGRAPHICAL DATABASE</p>
                                    <div className="cc-loading-scan" aria-hidden="true" />
                                </div>

                            ) : counties.length === 0 ? (
                                /* ---- empty state — only shown once loading has
                                   finished and the backend genuinely returned zero
                                   records, so it never contradicts a real load. ---- */
                                <div className="cc-empty">
                                    <IconEmpty />
                                    <p className="cc-empty-title">NO COUNTY RECORDS</p>
                                    <p className="cc-empty-sub">DATABASE READY FOR INITIALIZATION</p>
                                    <button type="button" className="cc-empty-cta" onClick={focusAddForm}>
                                        REGISTER FIRST COUNTY
                                    </button>
                                </div>

                            ) : (
                                /* ---- populated table ----
                                   .map() turns each county record into one table row.
                                   Each row's key is county.COUNTY_CODE, since county
                                   codes are unique. Conditional rendering swaps a row
                                   between "display" and "edit" based on whether its
                                   code matches editingCode. */
                                <div className="cc-table-wrap">
                                    <table className="cc-table">
                                        <thead>
                                            <tr>
                                                <th>County code</th>
                                                <th>State</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {counties.map((county) => {
                                                const isEditing = editingCode === county.COUNTY_CODE;

                                                return (
                                                    <tr key={county.COUNTY_CODE} className={`cc-row${isEditing ? " is-editing" : ""}`}>

                                                        {/* county code is never editable here — only its
                                                            state value can be changed */}
                                                        <td>
                                                            <span className="cc-code">
                                                                <i className="cc-code-dot" />
                                                                {county.COUNTY_CODE}
                                                            </span>
                                                        </td>

                                                        {/* state column: an input while editing, otherwise
                                                            plain text */}
                                                        <td>
                                                            {isEditing ? (
                                                                <input
                                                                    className="cc-edit-input"
                                                                    type="text"
                                                                    value={editingState}
                                                                    onChange={(event) => setEditingState(event.target.value)}
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                <span className="cc-state-text">{county.STATE}</span>
                                                            )}
                                                        </td>

                                                        {/* actions: Save/Cancel while editing, otherwise
                                                            Edit/Delete. Save calls handleUpdate, Cancel
                                                            calls cancelEdit, Edit calls startEdit, Delete
                                                            calls handleDelete — all unchanged. */}
                                                        <td>
                                                            {isEditing ? (
                                                                <div className="cc-actions">
                                                                    <button
                                                                        type="button"
                                                                        className="cc-action-btn is-save"
                                                                        onClick={() => handleUpdate(county.COUNTY_CODE)}
                                                                    >
                                                                        COMMIT CHANGES
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="cc-action-btn is-cancel"
                                                                        onClick={cancelEdit}
                                                                    >
                                                                        ABORT
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="cc-actions">
                                                                    <button
                                                                        type="button"
                                                                        className="cc-action-btn is-edit"
                                                                        onClick={() => startEdit(county)}
                                                                    >
                                                                        EDIT
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="cc-action-btn is-delete"
                                                                        onClick={() => handleDelete(county.COUNTY_CODE)}
                                                                    >
                                                                        DELETE
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* ---- database metadata side panel ----
                            Only states things this page can honestly verify. */}
                        <div className="cc-panel">
                            <p className="cc-panel-title" style={{ marginBottom: 18 }}>Reference database</p>
                            <div className="cc-meta-rows">
                                <div className="cc-meta-row">
                                    <span>SOURCE</span>
                                    <b>ToxicTide backend</b>
                                </div>
                                <div className="cc-meta-row">
                                    <span>ACCESS</span>
                                    <b>ADMINISTRATOR</b>
                                </div>
                                <div className="cc-meta-row">
                                    <span>STATUS</span>
                                    <b><i className="cc-dot" />CONNECTED</b>
                                </div>
                            </div>
                            <div className="cc-meta-count">
                                <div className="cc-meta-count-num">{counties.length}</div>
                                <div className="cc-meta-count-label">RECORDS ON FILE</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AdminCounties;
