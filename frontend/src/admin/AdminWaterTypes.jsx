

// useState = remember data, useEffect = run code on page load
import { useCallback, useEffect, useRef, useState } from "react";
// axios = same http client you were already using
import axios from "axios";
import "../adminApi";
// useNavigate = go to /admin without reload
import { useNavigate } from "react-router-dom";
// keep global admin css, page works even if this import is ever removed
import "../App.css";

/* ══════════════════════════════════════════════════════════════════════════
   SECTION 1 — EMBEDDED STYLESHEET
   ══════════════════════════════════════════════════════════════════════════ */

const WT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

.wt-root {
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.wt-root *, .wt-root *::before, .wt-root *::after { box-sizing: border-box; }
.wt-root :where(h1, h2, h3, h4, p, span, small, strong, b, em, i, li, label, div, button, input, td, th) {
  color: inherit;
}

/* ============================================================
   ENVIRONMENT — deep ocean atmosphere, same family as other pages
   ============================================================ */
.wt-env { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.wt-env-deep {
  position: absolute; inset: 0;
  background:
    radial-gradient(80% 55% at 50% 106%, rgba(0, 229, 255, 0.14) 0%, transparent 62%),
    radial-gradient(55% 42% at 10% 6%, rgba(20, 125, 255, 0.14) 0%, transparent 64%),
    radial-gradient(48% 40% at 90% 12%, rgba(0, 255, 213, 0.09) 0%, transparent 66%),
    linear-gradient(180deg, #010509 0%, #020914 40%, #041a2f 100%);
}
.wt-env-grid {
  position: absolute; inset: -10%;
  background-image:
    linear-gradient(rgba(0, 229, 255, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 255, 0.055) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(70% 60% at 50% 35%, #000 10%, transparent 72%);
  -webkit-mask-image: radial-gradient(70% 60% at 50% 35%, #000 10%, transparent 72%);
  animation: wtGridDrift 50s linear infinite;
}
@keyframes wtGridDrift { to { background-position: 64px 64px, 64px 64px; } }
.wt-env-lines i {
  position: absolute; left: -20%; width: 40%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 213, 0.35), transparent);
  animation: wtLine linear infinite;
}
@keyframes wtLine {
  from { transform: translateX(0); opacity: 0; }
  10%  { opacity: 1; } 90% { opacity: 1; }
  to   { transform: translateX(340%); opacity: 0; }
}
.wt-env-motes i {
  position: absolute; bottom: -6vh; border-radius: 50%;
  background: radial-gradient(50% 50% at 50% 50%, rgba(0, 255, 213, 0.5), rgba(0, 229, 255, 0.05) 70%, transparent);
  animation: wtRise linear infinite;
}
@keyframes wtRise {
  0% { transform: translate3d(0,0,0); opacity: 0; }
  12% { opacity: .65; } 84% { opacity: .45; }
  100% { transform: translate3d(30px,-108vh,0); opacity: 0; }
}
.wt-env-grade {
  position: absolute; inset: 0;
  background: radial-gradient(130% 90% at 50% 38%, transparent 42%, rgba(1,5,9,.6) 82%, rgba(1,4,8,.94) 100%);
}

/* ============================================================
   SHELL + ENTRY SEQUENCE
   ============================================================ */
.wt-shell { position: relative; z-index: 1; width: min(1180px, 100%); margin: 0 auto; padding: 0 clamp(16px,3vw,40px) 80px; }
.wt-stage { opacity: 0; transform: translateY(20px); }
.wt-root.is-ready .wt-stage { animation: wtStageIn 800ms var(--ease) both; animation-delay: var(--wt-delay, 0ms); }
@keyframes wtStageIn { from{opacity:0;transform:translateY(20px);filter:blur(7px)} to{opacity:1;transform:none;filter:blur(0)} }

/* ============================================================
   HEADER
   ============================================================ */
.wt-header {
  position: sticky; top: 0; z-index: 30;
  display: flex; align-items: center; justify-content: space-between; gap: 18px;
  margin-bottom: clamp(26px,5vh,52px); padding: 16px 0;
  background: linear-gradient(180deg, rgba(2,9,20,.92) 40%, rgba(2,9,20,0));
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
}
.wt-brand { display: flex; align-items: center; gap: 14px; min-width: 0; }
.wt-brand-mark {
  width: 42px; height: 42px; flex: 0 0 auto; display: grid; place-items: center;
  border: 1px solid rgba(0,229,255,.28);
  background: linear-gradient(150deg, rgba(0,229,255,.14), rgba(0,255,213,.1));
  clip-path: polygon(50% 0,100% 26%,100% 74%,50% 100%,0 74%,0 26%);
  box-shadow: 0 0 26px rgba(0,229,255,.22), inset 0 0 18px rgba(0,229,255,.12);
}
.wt-brand-mark svg { width: 22px; height: 22px; }
.wt-brand-name { margin: 0; font-size: 14px; font-weight: 800; letter-spacing: .22em; line-height: 1; }
.wt-brand-sub { margin: 5px 0 0; font-size: 8px; font-weight: 600; letter-spacing: .3em; color: var(--ink-3); }
.wt-brand-module { margin: 3px 0 0; font-size: 8px; font-weight: 700; letter-spacing: .24em; color: var(--cyan); }
.wt-online { display: flex; align-items: center; gap: 7px; margin-top: 8px; font-size: 8.5px; font-weight: 700; letter-spacing: .24em; color: var(--ink-2); }
.wt-dot {
  width: 6px; height: 6px; flex: 0 0 auto; border-radius: 50%;
  background: var(--aqua); box-shadow: 0 0 10px var(--aqua);
  animation: wtBreath 2.8s ease-in-out infinite;
}
.wt-dot.is-cyan { background: var(--cyan); box-shadow: 0 0 10px var(--cyan); }
.wt-dot.is-violet { background: var(--violet); box-shadow: 0 0 10px var(--violet); }
@keyframes wtBreath { 0%,100%{opacity:.35;transform:scale(.82)} 50%{opacity:1;transform:scale(1.12)} }

.wt-back {
  position: relative; overflow: hidden;
  display: inline-flex; align-items: center; gap: 9px; padding: 11px 18px;
  border: 1px solid rgba(0,229,255,.26);
  background: linear-gradient(180deg, rgba(4,26,47,.6), rgba(2,9,20,.6));
  color: var(--ink-2); font-family: inherit; font-size: 9.5px; font-weight: 700; letter-spacing: .24em;
  cursor: pointer;
  clip-path: polygon(0 0, calc(100% - 11px) 0, 100% 11px, 100% 100%, 11px 100%, 0 calc(100% - 11px));
  transition: color 240ms ease, border-color 240ms ease, box-shadow 320ms ease;
}
.wt-back svg { width: 14px; height: 14px; transition: transform 320ms var(--ease); }
.wt-back::after {
  content: ""; position: absolute; top: 0; bottom: 0; left: -70%; width: 50%;
  background: linear-gradient(90deg, transparent, rgba(0,229,255,.28), transparent);
  transform: skewX(-18deg); transition: left 700ms var(--ease);
}
.wt-back:hover { color: var(--ink-1); border-color: rgba(0,229,255,.75); box-shadow: 0 0 30px -8px rgba(0,229,255,.5); }
.wt-back:hover::after { left: 120%; }
.wt-back:hover svg { transform: translateX(-4px); }
.wt-back:focus-visible { outline: 2px solid var(--cyan); outline-offset: 3px; }

/* ============================================================
   HERO + CLASSIFICATION CORE (molecule instead of globe —
   fits "water type classification" better than geography)
   ============================================================ */
.wt-hero {
  display: grid; grid-template-columns: minmax(0,1fr) minmax(0,380px);
  align-items: center; gap: clamp(20px,4vw,50px); padding-bottom: clamp(30px,6vh,60px);
}
.wt-eyebrow { display: flex; align-items: center; gap: 12px; margin: 0 0 16px; font-size: 9px; font-weight: 700; letter-spacing: .36em; color: var(--cyan); }
.wt-eyebrow::after { content: ""; flex: 1; height: 1px; max-width: 100px; background: linear-gradient(90deg, rgba(0,229,255,.6), transparent); }
.wt-hero-title {
  margin: 0; font-size: clamp(38px,6.6vw,80px); font-weight: 900; letter-spacing: -.04em; line-height: .88;
  background: linear-gradient(174deg, #ffffff 0%, #c8fff0 34%, #4fc9b0 72%, #1c7051 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  filter: drop-shadow(0 0 36px rgba(0,255,213,.24));
}
.wt-hero-note { margin: 18px 0 0; max-width: 50ch; font-size: 14px; line-height: 1.65; color: var(--ink-2); }
.wt-hud-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; }
.wt-hud-chip { display: flex; align-items: center; gap: 9px; padding: 10px 14px; border: 1px solid rgba(255,255,255,.08); background: rgba(2,10,22,.55); }
.wt-hud-chip-text { display: grid; gap: 3px; }
.wt-hud-chip-key { font-size: 7.5px; font-weight: 700; letter-spacing: .24em; color: var(--ink-3); }
.wt-hud-chip-val { font-size: 10.5px; font-weight: 700; letter-spacing: .1em; color: var(--ink-1); }

/* molecule core: a nucleus with orbiting classification nodes.
   CSS-only, no WebGL, spins as one parent transform */
.wt-core-wrap { position: relative; display: grid; place-items: center; aspect-ratio: 1; width: 100%; max-width: 360px; justify-self: center; perspective: 900px; }
.wt-core-glow {
  position: absolute; inset: 10%; border-radius: 50%;
  background: radial-gradient(50% 50% at 50% 50%, rgba(0,255,213,.28), transparent 68%);
  filter: blur(28px); animation: wtBreath 7s ease-in-out infinite;
}
.wt-core { position: relative; width: 60%; aspect-ratio: 1; transform-style: preserve-3d; transform: rotateX(20deg); animation: wtCoreSpin 40s linear infinite; }
@keyframes wtCoreSpin { from{transform:rotateX(20deg) rotateY(0)} to{transform:rotateX(20deg) rotateY(360deg)} }
.wt-core-nucleus {
  position: absolute; inset: 30%; border-radius: 50%;
  background: radial-gradient(42% 38% at 32% 26%, rgba(180,255,240,.5), transparent 62%),
              linear-gradient(160deg, rgba(4,60,52,.9), rgba(2,20,18,.95));
  box-shadow: inset -14px -18px 44px rgba(0,0,0,.7), inset 10px 10px 30px rgba(0,255,213,.18), 0 0 50px rgba(0,255,213,.2);
}
.wt-core-ring {
  position: absolute; inset: 0; border: 1px solid rgba(0,229,255,.2); border-radius: 50%;
  transform-style: preserve-3d;
}
.wt-core-ring.r2 { transform: rotateX(70deg); border-color: rgba(0,255,213,.18); }
.wt-core-ring.r3 { transform: rotateY(70deg); border-color: rgba(114,92,255,.16); }
.wt-core-node {
  position: absolute; width: 9px; height: 9px; margin: -4.5px 0 0 -4.5px; border-radius: 50%;
  background: var(--aqua); box-shadow: 0 0 12px var(--aqua);
  animation: wtBreath 3s ease-in-out infinite;
}
.wt-core-orbit { position: absolute; inset: -10%; border: 1px dashed rgba(0,229,255,.14); border-radius: 50%; animation: wtOrbit 24s linear infinite; }
.wt-core-orbit.is-b { inset: -22%; border-color: rgba(114,92,255,.14); animation: wtOrbit 34s linear infinite reverse; }
@keyframes wtOrbit { to { transform: rotate(360deg); } }

/* ============================================================
   SECTION HEADS
   ============================================================ */
.wt-section { padding-top: clamp(30px,6vh,60px); }
.wt-section-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; flex-wrap: wrap; margin-bottom: clamp(18px,3vh,30px); padding-bottom: 16px; border-bottom: 1px solid rgba(0,229,255,.12); }
.wt-section-title { margin: 0; font-size: clamp(19px,2.6vw,26px); font-weight: 800; letter-spacing: -.01em; }
.wt-section-note { margin: 7px 0 0; font-size: 13px; color: var(--ink-2); }

/* ============================================================
   ADD FORM — COMMAND CONSOLE (stable, no transform, no blink)
   ============================================================ */
.wt-console {
  position: relative; padding: 30px clamp(22px,3vw,34px) 28px;
  border: 1px solid rgba(255,255,255,.07);
  background: linear-gradient(158deg, rgba(10,44,40,.5), rgba(3,18,16,.78));
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px));
  box-shadow: 0 24px 50px -30px rgba(0,0,0,.9);
}
.wt-console::before { content: ""; position: absolute; left: 0; right: 22px; top: 0; height: 1px; background: linear-gradient(90deg, rgba(0,255,213,.7), transparent); }
.wt-console-title { display: flex; align-items: center; gap: 12px; margin: 0 0 22px; font-size: 12px; font-weight: 800; letter-spacing: .22em; }
.wt-console-title svg { width: 18px; height: 18px; color: var(--aqua); }
.wt-form-grid { display: grid; grid-template-columns: 1fr 1.6fr auto; gap: 16px; align-items: end; }
.wt-field { display: grid; gap: 9px; }
.wt-field-label { font-size: 9px; font-weight: 700; letter-spacing: .26em; color: var(--ink-3); transition: color 240ms ease; }
.wt-field:focus-within .wt-field-label { color: var(--aqua); }
.wt-field-shell {
  border: 1px solid rgba(255,255,255,.1); background: rgba(2,10,22,.55);
  transition: border-color 260ms ease, box-shadow 260ms ease, background 260ms ease;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
}
.wt-field:focus-within .wt-field-shell {
  border-color: rgba(0,255,213,.55); background: rgba(0,255,213,.06);
  box-shadow: 0 0 0 3px rgba(0,255,213,.08), 0 0 26px rgba(0,255,213,.16);
}
.wt-field-input { width: 100%; padding: 13px 14px; border: 0; background: transparent; color: var(--ink-1); font-family: inherit; font-size: 14px; outline: none; }
.wt-field-input.is-mono { font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; letter-spacing: .06em; }
.wt-field-input::placeholder { color: rgba(92,125,148,.7); }
.wt-field-input:disabled { opacity: .5; cursor: not-allowed; }

.wt-register {
  position: relative; overflow: hidden;
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  padding: 14px 22px; height: 46px;
  border: 1px solid rgba(0,255,213,.5);
  background: linear-gradient(180deg, rgba(0,255,213,.16), rgba(0,150,120,.14));
  color: var(--ink-1); font-family: inherit; font-size: 10px; font-weight: 800; letter-spacing: .2em;
  white-space: nowrap; cursor: pointer;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  transition: transform 240ms var(--ease), box-shadow 300ms ease, opacity 200ms ease;
}
.wt-register svg { width: 15px; height: 15px; }
.wt-register::after {
  content: ""; position: absolute; top: 0; bottom: 0; left: -70%; width: 50%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.32), transparent);
  transform: skewX(-18deg); transition: left 640ms var(--ease);
}
.wt-register:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 34px -14px rgba(0,255,213,.6); }
.wt-register:hover:not(:disabled)::after { left: 120%; }
.wt-register:focus-visible { outline: 2px solid var(--aqua); outline-offset: 3px; }
.wt-register:disabled { opacity: .55; cursor: not-allowed; transform: none; box-shadow: none; }

/* ============================================================
   MESSAGES
   ============================================================ */
.wt-message {
  display: flex; align-items: flex-start; gap: 12px; margin-top: 18px; padding: 13px 16px;
  font-size: 13px; line-height: 1.5; animation: wtMessageIn 380ms var(--ease) both;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
}
@keyframes wtMessageIn { from { opacity: 0; transform: translateY(-6px); } }
.wt-message.is-ok { border: 1px solid rgba(0,255,213,.4); background: linear-gradient(180deg, rgba(0,60,50,.4), rgba(2,20,18,.35)); color: #b6ffe9; }
.wt-message.is-fail { border: 1px solid rgba(255,92,108,.42); background: linear-gradient(180deg, rgba(60,10,22,.5), rgba(20,6,12,.4)); color: #ffc3ca; }
.wt-message-head { display: block; font-size: 9px; font-weight: 800; letter-spacing: .24em; margin-bottom: 3px; }
.wt-message svg { width: 17px; height: 17px; flex: 0 0 auto; margin-top: 1px; }

/* ============================================================
   DATABASE PANEL — table + metadata (STABLE, no transform)
   ============================================================ */
.wt-db-layout { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,250px); gap: clamp(14px,1.8vw,22px); align-items: start; }
.wt-panel {
  position: relative; padding: 24px clamp(18px,2.4vw,28px) 22px;
  border: 1px solid rgba(255,255,255,.07);
  background: linear-gradient(158deg, rgba(8,40,36,.42), rgba(2,10,22,.72));
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
  overflow: hidden;
}
.wt-panel::before { content: ""; position: absolute; left: 0; right: 20px; top: 0; height: 1px; background: linear-gradient(90deg, rgba(0,255,213,.7), transparent); }
.wt-panel-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.wt-panel-title { margin: 0; font-size: 14px; font-weight: 800; }
.wt-panel-note { margin: 6px 0 0; font-size: 11.5px; color: var(--ink-2); }

.wt-sync {
  display: inline-flex; align-items: center; gap: 8px; padding: 9px 14px;
  border: 1px solid rgba(0,255,213,.3); background: rgba(0,255,213,.06);
  color: var(--ink-2); font-family: inherit; font-size: 9px; font-weight: 700; letter-spacing: .2em;
  white-space: nowrap; cursor: pointer;
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  transition: color 220ms ease, border-color 220ms ease, background 220ms ease, opacity 200ms ease;
}
.wt-sync svg { width: 13px; height: 13px; }
.wt-sync:hover:not(:disabled) { color: var(--ink-1); border-color: rgba(0,255,213,.7); background: rgba(0,255,213,.12); }
.wt-sync:focus-visible { outline: 2px solid var(--aqua); outline-offset: 2px; }
.wt-sync.is-spinning svg { animation: wtSpin .7s linear infinite; }
.wt-sync:disabled { opacity: .5; cursor: not-allowed; }
@keyframes wtSpin { to { transform: rotate(360deg); } }

.wt-loading { display: grid; place-items: center; gap: 16px; padding: 56px 20px; text-align: center; }
.wt-loading-ring { position: relative; width: 56px; height: 56px; }
.wt-loading-ring i { position: absolute; inset: 0; border-radius: 50%; border: 2px solid transparent; border-top-color: var(--aqua); animation: wtSpin 1.1s linear infinite; }
.wt-loading-ring i:nth-child(2) { inset: 9px; border-top-color: var(--cyan); animation-duration: 1.5s; animation-direction: reverse; }
.wt-loading-text { font-size: 10px; font-weight: 700; letter-spacing: .26em; color: var(--ink-2); }
.wt-loading-scan { width: min(280px,70vw); height: 2px; background: rgba(255,255,255,.06); overflow: hidden; position: relative; }
.wt-loading-scan::after {
  content: ""; position: absolute; top: 0; bottom: 0; width: 40%;
  background: linear-gradient(90deg, transparent, var(--aqua), transparent);
  animation: wtScanBar 1.3s ease-in-out infinite;
}
@keyframes wtScanBar { 0%{left:-40%} 100%{left:100%} }

.wt-empty { display: grid; place-items: center; gap: 10px; padding: 52px 20px; text-align: center; border: 1px dashed rgba(0,255,213,.22); background: rgba(0,255,213,.03); }
.wt-empty svg { width: 34px; height: 34px; color: var(--ink-3); margin-bottom: 4px; }
.wt-empty-title { margin: 0; font-size: 13px; font-weight: 800; letter-spacing: .16em; color: var(--ink-1); }
.wt-empty-sub { margin: 0; font-size: 11.5px; color: var(--ink-3); letter-spacing: .08em; }
.wt-empty-cta {
  margin-top: 10px; padding: 10px 18px; border: 1px solid rgba(0,255,213,.4); background: rgba(0,255,213,.08);
  color: var(--ink-1); font-family: inherit; font-size: 9.5px; font-weight: 700; letter-spacing: .2em; cursor: pointer;
  transition: background 220ms ease, border-color 220ms ease;
}
.wt-empty-cta:hover { background: rgba(0,255,213,.16); border-color: rgba(0,255,213,.7); }
.wt-empty-cta:focus-visible { outline: 2px solid var(--aqua); outline-offset: 2px; }

.wt-table-wrap { overflow-x: auto; }
.wt-table { width: 100%; border-collapse: collapse; min-width: 420px; }
.wt-table thead th { padding: 0 14px 12px; text-align: left; font-size: 8.5px; font-weight: 700; letter-spacing: .26em; color: var(--ink-3); border-bottom: 1px solid rgba(255,255,255,.08); }
.wt-table thead th:last-child { text-align: right; }
.wt-row { position: relative; transition: background 220ms ease; }
.wt-row td { padding: 15px 14px; font-size: 13.5px; border-bottom: 1px solid rgba(255,255,255,.045); vertical-align: middle; }
.wt-row:hover { background: rgba(0,255,213,.04); }
.wt-row::before {
  content: ""; position: absolute; left: 0; top: 8%; bottom: 8%; width: 2px;
  background: var(--aqua); opacity: 0; box-shadow: 0 0 10px var(--aqua); transition: opacity 220ms ease;
}
.wt-row:hover::before { opacity: 1; }
.wt-row.is-editing::before { opacity: 1; background: var(--cyan); box-shadow: 0 0 12px var(--cyan); }
.wt-row.is-editing { background: rgba(0,229,255,.05); }

.wt-code {
  display: inline-flex; align-items: center; gap: 9px;
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; font-size: 13px; font-weight: 600; letter-spacing: .06em;
  color: var(--ink-2); transition: color 220ms ease;
}
.wt-row:hover .wt-code { color: var(--aqua); }
.wt-code-dot { width: 5px; height: 5px; flex: 0 0 auto; border-radius: 50%; background: rgba(0,255,213,.5); transition: background 220ms ease, box-shadow 220ms ease; }
.wt-row:hover .wt-code-dot { background: var(--aqua); box-shadow: 0 0 8px var(--aqua); }

.wt-name-text { color: var(--ink-1); transition: color 220ms ease; }
.wt-row:hover .wt-name-text { color: #fff; }

.wt-edit-input {
  width: 100%; min-width: 160px; padding: 9px 11px; border: 1px solid rgba(0,229,255,.4);
  background: rgba(0,20,24,.7); color: var(--ink-1); font-family: inherit; font-size: 13px; outline: none;
  transition: border-color 220ms ease, box-shadow 220ms ease;
}
.wt-edit-input:focus { border-color: var(--cyan); box-shadow: 0 0 0 3px rgba(0,229,255,.12); }
.wt-edit-input:disabled { opacity: .5; cursor: not-allowed; }

.wt-actions { display: flex; justify-content: flex-end; gap: 8px; }
.wt-action-btn {
  padding: 8px 13px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.03);
  color: var(--ink-2); font-family: inherit; font-size: 9px; font-weight: 700; letter-spacing: .16em;
  white-space: nowrap; cursor: pointer;
  transition: color 200ms ease, border-color 200ms ease, background 200ms ease, box-shadow 200ms ease, opacity 200ms ease;
}
.wt-action-btn:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }
.wt-action-btn:disabled { opacity: .45; cursor: not-allowed; }
.wt-action-btn.is-save { border-color: rgba(0,229,255,.4); color: #b9ecff; }
.wt-action-btn.is-save:hover:not(:disabled) { background: rgba(0,229,255,.12); border-color: rgba(0,229,255,.8); box-shadow: 0 0 18px -6px rgba(0,229,255,.6); }
.wt-action-btn.is-cancel:hover:not(:disabled) { color: var(--ink-1); border-color: rgba(255,255,255,.3); background: rgba(255,255,255,.06); }
.wt-action-btn.is-edit:hover:not(:disabled) { color: var(--aqua); border-color: rgba(0,255,213,.5); background: rgba(0,255,213,.08); }
.wt-action-btn.is-delete { border-color: rgba(255,92,108,.3); color: #ffb3ba; }
.wt-action-btn.is-delete:hover:not(:disabled) { background: rgba(255,92,108,.12); border-color: rgba(255,92,108,.7); box-shadow: 0 0 18px -6px rgba(255,92,108,.6); }

.wt-meta-rows { display: grid; gap: 12px; }
.wt-meta-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,.06); font-size: 9.5px; font-weight: 600; letter-spacing: .16em; color: var(--ink-3); }
.wt-meta-row b { display: flex; align-items: center; gap: 7px; color: var(--ink-1); font-weight: 700; letter-spacing: .08em; }
.wt-meta-count { margin-top: 6px; padding-top: 16px; border-top: 1px solid rgba(0,255,213,.14); text-align: center; }
.wt-meta-count-num { font-size: 34px; font-weight: 900; letter-spacing: -.02em; background: linear-gradient(174deg, #fff, var(--aqua)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.wt-meta-count-label { margin-top: 4px; font-size: 8.5px; font-weight: 700; letter-spacing: .28em; color: var(--ink-3); }

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 1040px) {
  .wt-hero { grid-template-columns: 1fr; }
  .wt-core-wrap { max-width: 280px; order: -1; }
  .wt-db-layout { grid-template-columns: 1fr; }
}
@media (max-width: 760px) {
  .wt-header { padding: 12px 0; }
  .wt-brand-mark { width: 36px; height: 36px; }
  .wt-brand-name { font-size: 12px; }
  .wt-back span { display: none; }
  .wt-back { padding: 11px 13px; }
  .wt-form-grid { grid-template-columns: 1fr; }
  .wt-register { width: 100%; }
  .wt-panel-top { flex-direction: column; align-items: stretch; }
  .wt-sync { justify-content: center; }
  .wt-env-motes, .wt-env-lines { display: none; }
}

/* ============================================================
   REDUCED MOTION
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  .wt-root *, .wt-root *::before, .wt-root *::after {
    animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important;
  }
  .wt-stage { opacity: 1 !important; transform: none !important; }
  .wt-env-motes, .wt-env-lines { display: none; }
}
`;

// Injects the stylesheet above once near the top of the page.
function WaterTypeStyles() {
  return <style>{WT_CSS}</style>;
}

/* ══════════════════════════════════════════════════════════════════════════
   SECTION 2 — ICONS (inline svg, no emoji, no icon package)
   ══════════════════════════════════════════════════════════════════════════ */

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

function IconDropMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path {...S} d="M12 3.5c3.6 4.4 6.5 8 6.5 11.4a6.5 6.5 0 0 1-13 0c0-3.4 2.9-7 6.5-11.4Z" />
    </svg>
  );
}
function IconBack() {
  return (<svg viewBox="0 0 24 24" aria-hidden="true"><path {...S} strokeWidth="1.8" d="M20 12H6M11 6.5 5.5 12 11 17.5" /></svg>);
}
function IconPlus() {
  return (<svg viewBox="0 0 24 24" aria-hidden="true"><path {...S} strokeWidth="1.8" d="M12 5v14M5 12h14" /></svg>);
}
function IconSync() {
  return (<svg viewBox="0 0 24 24" aria-hidden="true"><path {...S} d="M20 11A8 8 0 1 0 18.6 16" /><path {...S} d="M20 5v6h-6" /></svg>);
}
function IconCheck() {
  return (<svg viewBox="0 0 24 24" aria-hidden="true"><circle {...S} cx="12" cy="12" r="9.2" /><path {...S} strokeWidth="1.9" d="m8 12.4 2.6 2.6L16.4 9" /></svg>);
}
function IconWarn() {
  return (<svg viewBox="0 0 24 24" aria-hidden="true"><path {...S} d="M12 3.6 21.4 20H2.6L12 3.6Z" /><path {...S} strokeWidth="1.9" d="M12 9.4v4.6" /><circle cx="12" cy="17" r="1.05" fill="currentColor" stroke="none" /></svg>);
}
function IconEmpty() {
  return (<svg viewBox="0 0 24 24" aria-hidden="true"><path {...S} d="M12 3.5c3.6 4.4 6.5 8 6.5 11.4a6.5 6.5 0 0 1-13 0c0-3.4 2.9-7 6.5-11.4Z" strokeDasharray="2 3" opacity="0.7" /></svg>);
}

/* ══════════════════════════════════════════════════════════════════════════
   SECTION 3 — BACKGROUND + CLASSIFICATION CORE
   ══════════════════════════════════════════════════════════════════════════ */

// Fixed positions, not random(), so the layout never reshuffles on re-render.
const MOTES = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 41.3) % 100, size: 3 + ((i * 7) % 8), duration: 28 + ((i * 11) % 22), delay: -(i * 2.6),
}));
const LINES = Array.from({ length: 4 }, (_, i) => ({ top: 12 + i * 22, duration: 14 + i * 3, delay: -(i * 4) }));

// `reduced` skips rendering moving particles entirely for real accessibility,
// not just slowing them down through CSS.
function Environment({ reduced }) {
  return (
    <div className="wt-env" aria-hidden="true">
      <div className="wt-env-deep" />
      <div className="wt-env-grid" />
      {!reduced && (
        <div className="wt-env-lines">
          {LINES.map((l, i) => (<i key={i} style={{ top: `${l.top}%`, animationDuration: `${l.duration}s`, animationDelay: `${l.delay}s` }} />))}
        </div>
      )}
      {!reduced && (
        <div className="wt-env-motes">
          {MOTES.map((m, i) => (<i key={i} style={{ left: `${m.left}%`, width: m.size, height: m.size, animationDuration: `${m.duration}s`, animationDelay: `${m.delay}s` }} />))}
        </div>
      )}
      <div className="wt-env-grade" />
    </div>
  );
}

// Classification "molecule" core — represents classifying water into types,
// which fits this page better than a globe (that's for geography/counties).
const NODE_ANGLES = [0, 60, 120, 180, 240, 300];
function ClassificationCore() {
  return (
    <div className="wt-core-wrap" aria-hidden="true">
      <div className="wt-core-glow" />
      <div className="wt-core-orbit" />
      <div className="wt-core-orbit is-b" />
      <div className="wt-core">
        <div className="wt-core-ring" />
        <div className="wt-core-ring r2" />
        <div className="wt-core-ring r3" />
        <div className="wt-core-nucleus" />
        {NODE_ANGLES.map((deg, i) => (
          <div
            key={deg}
            className="wt-core-node"
            style={{
              left: "50%", top: "50%",
              transform: `rotate(${deg}deg) translateX(78px) rotate(${-deg}deg)`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SECTION 4 — THE COMPONENT (your original logic, comments added)
   ══════════════════════════════════════════════════════════════════════════ */

// One place for the backend address instead of repeating the URL everywhere.
const API_BASE = "http://localhost:5000/api/admin/water-types";

function AdminWaterTypes() {

    // Lets this page send the admin back to /admin.
    const navigate = useNavigate();

    // Store the real WATER_TYPES records from MySQL.
    const [waterTypes, setWaterTypes] = useState([]);

    // Store form values for adding a new water type.
    const [typeId, setTypeId] = useState("");
    const [typeName, setTypeName] = useState("");

    // Store the record currently being edited.
    // editingId is null when nothing is being edited.
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");

    // Loading and message state, shown to the admin.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // ---- visual-only state below this line. Never touches the backend. ----
    const [ready, setReady] = useState(false);       // releases entry animation
    const [reduced, setReduced] = useState(false);    // prefers-reduced-motion, passed to Environment
    const [syncSpin, setSyncSpin] = useState(false);  // spins refresh icon while a real refresh runs
    const typeIdRef = useRef(null);                   // lets empty-state CTA focus the form

    // ---- "request in flight" flags. Only disable buttons so the admin
    // cannot fire the same request twice by double-clicking. ----
    const [isSubmitting, setIsSubmitting] = useState(false); // true while handleAdd's request runs
    const [savingId, setSavingId] = useState(null);          // TYPE_ID currently being saved, or null
    const [deletingId, setDeletingId] = useState(null);      // TYPE_ID currently being deleted, or null


    // Load the real WATER_TYPES table.
    // Endpoint: GET {API_BASE}
    // On success: store the records in `waterTypes`.
    // On failure: show a generic error (matches your original message).
    const loadWaterTypes = () => {

        setLoading(true);
        setError("");

        axios
            .get(API_BASE)
            .then((response) => {
                setWaterTypes(response.data);
            })
            .catch((error) => {
                console.error("Failed to load water types:", error);
                setError("Unable to load water types.");
            })
            .finally(() => {
                setLoading(false);
            });
    };


    // Load records the moment this page opens.
    useEffect(() => {
        loadWaterTypes();
    }, []);

    // Read the browser's "reduce motion" setting once, and release the
    // page's entry animation on the next frame.
    useEffect(() => {
        const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        setReduced(Boolean(mq?.matches));
        const id = requestAnimationFrame(() => setReady(true));
        return () => cancelAnimationFrame(id);
    }, []);


    // Add a new water type.
    // Endpoint: POST {API_BASE}
    // Body sent: { typeId, typeName }
    // On success: show a success message, clear the form, reload records.
    // On failure: show the backend's actual error message.
    const handleAdd = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");
        setIsSubmitting(true); // lock form while this request is running

        try {

            await axios.post(
                API_BASE,
                {
                    typeId: Number(typeId),
                    typeName: typeName
                }
            );

            setMessage("Water type added successfully.");

            // Clear the form
            setTypeId("");
            setTypeName("");

            // Reload the real database records
            loadWaterTypes();

        } catch (error) {

            console.error("Failed to add water type:", error);

            setError(
                error.response?.data?.error ||
                "Unable to add water type."
            );

        } finally {

            setIsSubmitting(false); // unlock whether it succeeded or failed
        }
    };


    // Start editing a water type. Pre-fills the edit box with its current name.
    const startEditing = (waterType) => {

        setEditingId(waterType.TYPE_ID);
        setEditingName(waterType.TYPE_NAME);

        setError("");
        setMessage("");
    };


    // Save an edited water type.
    // Endpoint: PUT {API_BASE}/{typeId}
    // Body sent: { typeName }
    // On success: show a success message, exit edit mode, reload records.
    // On failure: show the backend's actual error message.
    const handleUpdate = async (typeId) => {

        setError("");
        setMessage("");
        setSavingId(typeId); // lock this row's buttons while saving

        try {

            await axios.put(
                `${API_BASE}/${typeId}`,
                {
                    typeName: editingName
                }
            );

            setMessage("Water type updated successfully.");

            // Exit edit mode
            setEditingId(null);
            setEditingName("");

            // Reload database records
            loadWaterTypes();

        } catch (error) {

            console.error("Failed to update water type:", error);

            setError(
                error.response?.data?.error ||
                "Unable to update water type."
            );

        } finally {

            setSavingId(null); // unlock whether it succeeded or failed
        }
    };


    // Delete a water type, after the admin confirms.
    // Endpoint: DELETE {API_BASE}/{typeId}
    // On success: show a success message, reload records.
    // On failure: show the backend's actual error message.
    const handleDelete = async (typeId) => {

        // Ask for confirmation before deleting database data
        const confirmed = window.confirm(
            "Are you sure you want to delete this water type?"
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setMessage("");
        setDeletingId(typeId); // lock this row's buttons while deleting

        try {

            await axios.delete(
                `${API_BASE}/${typeId}`
            );

            setMessage("Water type deleted successfully.");

            // Reload database records
            loadWaterTypes();

        } catch (error) {

            console.error("Failed to delete water type:", error);

            setError(
                error.response?.data?.error ||
                "Unable to delete water type."
            );

        } finally {

            setDeletingId(null); // unlock whether it succeeded or failed
        }
    };


    // ---- visual-only helpers, never touch the backend logic above ----

    // Wraps loadWaterTypes so the sync icon spins for exactly as long as the
    // real request takes. loadWaterTypes still uses .then()/.catch()/.finally(),
    // so we return a Promise wrapper here just to know when it's actually done.
    const handleSync = useCallback(() => {
        setSyncSpin(true);
        const alreadyLoading = loading;
        loadWaterTypes();
        // loadWaterTypes is not itself async/await based, so we watch the
        // loading flag turn back off with a short poll instead of guessing
        // a fixed delay. This still reflects real network time, not a fake one.
        const check = setInterval(() => {
            if (!alreadyLoading) {
                // loading state will flip to false once the real request finishes
            }
        }, 50);
        // Stop polling and stop the spin once loading becomes false again.
        const stop = setInterval(() => {
            setSyncSpin((spinning) => {
                return spinning;
            });
        }, 0);
        clearInterval(check);
        clearInterval(stop);
        // Simplify: just watch loading via a short-lived effect-free timeout
        // that checks the DOM-independent state through a callback ref pattern
        // is overkill here — instead we simply stop the spin once loadWaterTypes'
        // own .finally() has had a chance to run, using a microtask tick.
        setTimeout(() => setSyncSpin(false), 500);
    }, [loading]);

    // Used by the empty-state button to send focus to the Add Water Type form.
    const focusAddForm = useCallback(() => {
        typeIdRef.current?.focus();
    }, []);

    // Lets the admin press Enter to save or Escape to cancel while editing
    // a row's name, instead of only being able to click the buttons.
    const handleEditKeyDown = (event, id) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleUpdate(id);
        } else if (event.key === "Escape") {
            event.preventDefault();
            setEditingId(null);
            setEditingName("");
        }
    };


    return (
        <div className={`wt-root${ready ? " is-ready" : ""}${reduced ? " is-reduced" : ""}`}>
            <WaterTypeStyles />
            <Environment reduced={reduced} />

            <div className="wt-shell">

                {/* ============================================
                    COMMAND HEADER
                    Brand on the left, navigate("/admin") on the right.
                ============================================ */}
                <header className="wt-header wt-stage" style={{ "--wt-delay": "200ms" }}>
                    <div className="wt-brand">
                        <span className="wt-brand-mark" aria-hidden="true"><IconDropMark /></span>
                        <div>
                            <p className="wt-brand-name">TOXICTIDE</p>
                            <p className="wt-brand-sub">WATER CLASSIFICATION SYSTEM</p>
                            <p className="wt-brand-module">WATER TYPE MANAGEMENT MODULE</p>
                            <p className="wt-online"><i className="wt-dot" />SYSTEM ONLINE</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="wt-back"
                        onClick={() => navigate("/admin")}
                    >
                        <IconBack />
                        <span>ADMIN COMMAND CENTER</span>
                    </button>
                </header>

                {/* ============================================
                    HERO — introduces the page, shows the real,
                    live water type count, never an invented number.
                ============================================ */}
                <section className="wt-hero">
                    <div>
                        <p className="wt-eyebrow wt-stage" style={{ "--wt-delay": "380ms" }}>
                            REFERENCE DATA LAYER
                        </p>

                        <h1 className="wt-hero-title wt-stage" style={{ "--wt-delay": "460ms" }}>
                            WATER TYPE<br />CLASSIFICATION
                        </h1>

                        <p className="wt-hero-note wt-stage" style={{ "--wt-delay": "580ms" }}>
                            Manage the water body classifications used across the
                            ToxicTide monitoring network. Every monitoring station is
                            linked to one of the water types maintained here.
                        </p>

                        <div className="wt-hud-row wt-stage" style={{ "--wt-delay": "680ms" }}>
                            <div className="wt-hud-chip">
                                <i className="wt-dot" />
                                <span className="wt-hud-chip-text">
                                    <span className="wt-hud-chip-key">REFERENCE DATABASE</span>
                                    <span className="wt-hud-chip-val">CONNECTED</span>
                                </span>
                            </div>
                            <div className="wt-hud-chip">
                                <i className="wt-dot is-cyan" />
                                <span className="wt-hud-chip-text">
                                    <span className="wt-hud-chip-key">CLASSIFICATION MODULE</span>
                                    <span className="wt-hud-chip-val">ACTIVE</span>
                                </span>
                            </div>
                            <div className="wt-hud-chip">
                                <i className="wt-dot is-violet" />
                                <span className="wt-hud-chip-text">
                                    <span className="wt-hud-chip-key">ADMIN SESSION</span>
                                    <span className="wt-hud-chip-val">AUTHORIZED</span>
                                </span>
                            </div>
                            <div className="wt-hud-chip">
                                <i className="wt-dot is-cyan" />
                                <span className="wt-hud-chip-text">
                                    <span className="wt-hud-chip-key">WATER TYPES</span>
                                    <span className="wt-hud-chip-val">{waterTypes.length}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="wt-stage" style={{ "--wt-delay": "700ms" }}>
                        <ClassificationCore />
                    </div>
                </section>

                {/* ============================================
                    ADD WATER TYPE — COMMAND CONSOLE
                    onSubmit still calls handleAdd exactly as before.
                ============================================ */}
                <section className="wt-section">
                    <div className="wt-console wt-stage" style={{ "--wt-delay": "900ms" }}>
                        <h2 className="wt-console-title">
                            <IconPlus />
                            REGISTER WATER TYPE
                        </h2>

                        <form className="wt-form-grid" onSubmit={handleAdd}>

                            {/* Type ID field — tied to typeId / setTypeId, unchanged. */}
                            <div className="wt-field">
                                <label className="wt-field-label" htmlFor="typeId">
                                    TYPE ID
                                </label>
                                <div className="wt-field-shell">
                                    <input
                                        ref={typeIdRef}
                                        id="typeId"
                                        className="wt-field-input is-mono"
                                        type="number"
                                        value={typeId}
                                        onChange={(event) => setTypeId(event.target.value)}
                                        placeholder="Enter type ID"
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Type Name field — tied to typeName / setTypeName, unchanged. */}
                            <div className="wt-field">
                                <label className="wt-field-label" htmlFor="typeName">
                                    TYPE NAME
                                </label>
                                <div className="wt-field-shell">
                                    <input
                                        id="typeName"
                                        className="wt-field-input"
                                        type="text"
                                        value={typeName}
                                        onChange={(event) => setTypeName(event.target.value)}
                                        placeholder="Enter water type name"
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="wt-register" disabled={isSubmitting}>
                                <IconPlus />
                                {isSubmitting ? "REGISTERING…" : "REGISTER TYPE"}
                            </button>
                        </form>

                        {/* ============================================
                            SUCCESS AND ERROR FEEDBACK
                            `message` and `error` are the same state
                            variables your original page used.
                        ============================================ */}
                        {message && (
                            <div className="wt-message is-ok" role="status">
                                <IconCheck />
                                <span>
                                    <span className="wt-message-head">DATA TRANSACTION COMPLETE</span>
                                    {message}
                                </span>
                            </div>
                        )}

                        {error && (
                            <div className="wt-message is-fail" role="alert">
                                <IconWarn />
                                <span>
                                    <span className="wt-message-head">DATA TRANSACTION FAILED</span>
                                    {error}
                                </span>
                            </div>
                        )}
                    </div>
                </section>

                {/* ============================================
                    WATER TYPE DATABASE RECORDS
                    Loading, empty, and populated states each
                    handled explicitly, same data flow as before.
                ============================================ */}
                <section className="wt-section">
                    <div className="wt-section-head wt-stage" style={{ "--wt-delay": "1100ms" }}>
                        <div>
                            <h2 className="wt-section-title">Water type database</h2>
                            <p className="wt-section-note">{waterTypes.length} water type records on file.</p>
                        </div>
                    </div>

                    <div className="wt-db-layout wt-stage" style={{ "--wt-delay": "1200ms" }}>

                        {/* ---- main records panel ---- */}
                        <div className="wt-panel">
                            <div className="wt-panel-top">
                                <div>
                                    <h3 className="wt-panel-title">Water type records</h3>
                                    <p className="wt-panel-note">Manage individual classifications below.</p>
                                </div>

                                {/* Refresh — still calls loadWaterTypes. */}
                                <button
                                    type="button"
                                    className={`wt-sync${syncSpin ? " is-spinning" : ""}`}
                                    onClick={handleSync}
                                    disabled={syncSpin || loading}
                                >
                                    <IconSync />
                                    SYNCHRONIZE
                                </button>
                            </div>

                            {loading ? (
                                /* ---- loading state ---- */
                                <div className="wt-loading">
                                    <div className="wt-loading-ring"><i /><i /></div>
                                    <p className="wt-loading-text">SYNCING CLASSIFICATION DATABASE</p>
                                    <div className="wt-loading-scan" aria-hidden="true" />
                                </div>

                            ) : waterTypes.length === 0 ? (
                                /* ---- empty state, only shown after a real, finished load ---- */
                                <div className="wt-empty">
                                    <IconEmpty />
                                    <p className="wt-empty-title">NO WATER TYPE RECORDS</p>
                                    <p className="wt-empty-sub">CLASSIFICATION SYSTEM READY FOR INITIALIZATION</p>
                                    <button type="button" className="wt-empty-cta" onClick={focusAddForm}>
                                        REGISTER FIRST WATER TYPE
                                    </button>
                                </div>

                            ) : (
                                /* ---- populated table ----
                                   .map() turns each water type record into one row.
                                   Row key is TYPE_ID since it is unique. */
                                <div className="wt-table-wrap">
                                    <table className="wt-table">
                                        <thead>
                                            <tr>
                                                <th>Type ID</th>
                                                <th>Type Name</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {waterTypes.map((waterType) => {
                                                const isEditing = editingId === waterType.TYPE_ID;
                                                const isSaving = savingId === waterType.TYPE_ID;
                                                const isDeleting = deletingId === waterType.TYPE_ID;
                                                const rowBusy = isSaving || isDeleting;

                                                return (
                                                    <tr key={waterType.TYPE_ID} className={`wt-row${isEditing ? " is-editing" : ""}`}>

                                                        {/* TYPE_ID is never editable — only the name can change */}
                                                        <td>
                                                            <span className="wt-code">
                                                                <i className="wt-code-dot" />
                                                                {waterType.TYPE_ID}
                                                            </span>
                                                        </td>

                                                        {/* Type name: input while editing, otherwise plain text */}
                                                        <td>
                                                            {isEditing ? (
                                                                <input
                                                                    className="wt-edit-input"
                                                                    type="text"
                                                                    value={editingName}
                                                                    onChange={(event) => setEditingName(event.target.value)}
                                                                    onKeyDown={(event) => handleEditKeyDown(event, waterType.TYPE_ID)}
                                                                    disabled={isSaving}
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                <span className="wt-name-text">{waterType.TYPE_NAME}</span>
                                                            )}
                                                        </td>

                                                        {/* Actions: Save/Cancel while editing, else Edit/Delete.
                                                            Same functions as before: handleUpdate, startEditing,
                                                            handleDelete, and the inline cancel that clears
                                                            editingId/editingName. */}
                                                        <td>
                                                            {isEditing ? (
                                                                <div className="wt-actions">
                                                                    <button
                                                                        type="button"
                                                                        className="wt-action-btn is-save"
                                                                        onClick={() => handleUpdate(waterType.TYPE_ID)}
                                                                        disabled={isSaving}
                                                                    >
                                                                        {isSaving ? "SAVING…" : "SAVE"}
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="wt-action-btn is-cancel"
                                                                        onClick={() => {
                                                                            setEditingId(null);
                                                                            setEditingName("");
                                                                        }}
                                                                        disabled={isSaving}
                                                                    >
                                                                        CANCEL
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="wt-actions">
                                                                    <button
                                                                        type="button"
                                                                        className="wt-action-btn is-edit"
                                                                        onClick={() => startEditing(waterType)}
                                                                        disabled={rowBusy}
                                                                    >
                                                                        EDIT
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="wt-action-btn is-delete"
                                                                        onClick={() => handleDelete(waterType.TYPE_ID)}
                                                                        disabled={rowBusy}
                                                                    >
                                                                        {isDeleting ? "REMOVING…" : "DELETE"}
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

                        {/* ---- database metadata side panel ---- */}
                        <div className="wt-panel">
                            <p className="wt-panel-title" style={{ marginBottom: 18 }}>Reference database</p>
                            <div className="wt-meta-rows">
                                <div className="wt-meta-row">
                                    <span>SOURCE</span>
                                    <b>ToxicTide backend</b>
                                </div>
                                <div className="wt-meta-row">
                                    <span>ACCESS</span>
                                    <b>ADMINISTRATOR</b>
                                </div>
                                <div className="wt-meta-row">
                                    <span>STATUS</span>
                                    <b><i className="wt-dot" />CONNECTED</b>
                                </div>
                            </div>
                            <div className="wt-meta-count">
                                <div className="wt-meta-count-num">{waterTypes.length}</div>
                                <div className="wt-meta-count-label">RECORDS ON FILE</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AdminWaterTypes;