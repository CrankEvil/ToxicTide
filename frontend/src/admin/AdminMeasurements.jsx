

import { useCallback, useEffect, useRef, useState } from "react";
import { adminFetch } from "../adminApi";

/* ==========================================================================
   SECTION 1 - EMBEDDED STYLESHEET
   ========================================================================== */

const MM_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

.mm-root {
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
.mm-root *, .mm-root *::before, .mm-root *::after { box-sizing: border-box; }
.mm-root :where(h1, h2, h3, h4, p, span, small, strong, b, em, i, li, label, div, button, input, select, td, th) {
  color: inherit;
}
.mm-env { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.mm-env-deep {
  position: absolute; inset: 0;
  background:
    radial-gradient(80% 55% at 50% 106%, rgba(0, 229, 255, 0.14) 0%, transparent 62%),
    radial-gradient(55% 42% at 10% 6%, rgba(20, 125, 255, 0.14) 0%, transparent 64%),
    radial-gradient(48% 40% at 90% 12%, rgba(255, 92, 108, 0.06) 0%, transparent 66%),
    linear-gradient(180deg, #010509 0%, #020914 40%, #041a2f 100%);
}
.mm-env-grid {
  position: absolute; inset: -10%;
  background-image:
    linear-gradient(rgba(0, 229, 255, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 255, 0.055) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(70% 60% at 50% 35%, #000 10%, transparent 72%);
  -webkit-mask-image: radial-gradient(70% 60% at 50% 35%, #000 10%, transparent 72%);
  animation: mmGridDrift 50s linear infinite;
}
@keyframes mmGridDrift { to { background-position: 64px 64px, 64px 64px; } }
.mm-env-lines i {
  position: absolute; left: -20%; width: 40%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 213, 0.35), transparent);
  animation: mmLine linear infinite;
}
@keyframes mmLine {
  from { transform: translateX(0); opacity: 0; }
  10%  { opacity: 1; } 90% { opacity: 1; }
  to   { transform: translateX(340%); opacity: 0; }
}
.mm-env-motes i {
  position: absolute; bottom: -6vh; border-radius: 50%;
  background: radial-gradient(50% 50% at 50% 50%, rgba(0, 255, 213, 0.5), rgba(0, 229, 255, 0.05) 70%, transparent);
  animation: mmRise linear infinite;
}
@keyframes mmRise {
  0% { transform: translate3d(0,0,0); opacity: 0; }
  12% { opacity: .65; } 84% { opacity: .45; }
  100% { transform: translate3d(30px,-108vh,0); opacity: 0; }
}
.mm-env-grade {
  position: absolute; inset: 0;
  background: radial-gradient(130% 90% at 50% 38%, transparent 42%, rgba(1,5,9,.6) 82%, rgba(1,4,8,.94) 100%);
}
.mm-shell { position: relative; z-index: 1; width: min(1180px, 100%); margin: 0 auto; padding: 0 clamp(16px,3vw,40px) 80px; }
.mm-stage { opacity: 0; transform: translateY(20px); }
.mm-root.is-ready .mm-stage { animation: mmStageIn 800ms var(--ease) both; animation-delay: var(--mm-delay, 0ms); }
@keyframes mmStageIn { from{opacity:0;transform:translateY(20px);filter:blur(7px)} to{opacity:1;transform:none;filter:blur(0)} }

.mm-header {
  position: sticky; top: 0; z-index: 30;
  display: flex; align-items: center; justify-content: space-between; gap: 18px;
  margin-bottom: clamp(26px,5vh,52px); padding: 16px 0;
  background: linear-gradient(180deg, rgba(2,9,20,.92) 40%, rgba(2,9,20,0));
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(0,229,255,.08);
}
.mm-brand { display: flex; align-items: center; gap: 14px; min-width: 0; }
.mm-brand-mark {
  width: 42px; height: 42px; flex: 0 0 auto; display: grid; place-items: center;
  border: 1px solid rgba(0,229,255,.28);
  background: linear-gradient(150deg, rgba(0,229,255,.14), rgba(255,92,108,.08));
  clip-path: polygon(50% 0,100% 26%,100% 74%,50% 100%,0 74%,0 26%);
  box-shadow: 0 0 26px rgba(0,229,255,.22), inset 0 0 18px rgba(0,229,255,.12);
}
.mm-brand-mark svg { width: 22px; height: 22px; }
.mm-brand-name { margin: 0; font-size: 14px; font-weight: 800; letter-spacing: .22em; line-height: 1; }
.mm-brand-sub { margin: 5px 0 0; font-size: 8px; font-weight: 600; letter-spacing: .3em; color: var(--ink-3); }
.mm-brand-module { margin: 3px 0 0; font-size: 8px; font-weight: 700; letter-spacing: .24em; color: var(--cyan); }
.mm-online { display: flex; align-items: center; gap: 7px; margin-top: 8px; font-size: 8.5px; font-weight: 700; letter-spacing: .24em; color: var(--ink-2); }
.mm-dot {
  width: 6px; height: 6px; flex: 0 0 auto; border-radius: 50%;
  background: var(--aqua); box-shadow: 0 0 10px var(--aqua);
  animation: mmBreath 2.8s ease-in-out infinite;
}
.mm-dot.is-cyan { background: var(--cyan); box-shadow: 0 0 10px var(--cyan); }
.mm-dot.is-violet { background: var(--violet); box-shadow: 0 0 10px var(--violet); }
.mm-dot.is-danger { background: var(--danger); box-shadow: 0 0 10px var(--danger); }
@keyframes mmBreath { 0%,100%{opacity:.35;transform:scale(.82)} 50%{opacity:1;transform:scale(1.12)} }

.mm-header-actions { display: flex; align-items: center; gap: 16px; margin-left: auto; }
.mm-system-pill { display: inline-flex; align-items: center; gap: 8px; font-size: 9.5px; font-weight: 800; letter-spacing: .22em; color: var(--aqua); }
.mm-back-btn {
  display: inline-flex; align-items: center; gap: 9px;
  padding: 10px 18px; height: 40px;
  border: 1px solid rgba(0,229,255,.24);
  background: linear-gradient(180deg, rgba(6,28,44,.92), rgba(2,16,28,.92));
  color: var(--ink-1); font-family: inherit; font-size: 10px; font-weight: 800; letter-spacing: .16em;
  cursor: pointer; border-radius: 10px;
  box-shadow: 0 0 0 1px rgba(0,229,255,.06) inset, 0 8px 24px -16px rgba(0,229,255,.6);
  transition: transform 220ms var(--ease), border-color 220ms ease, background 220ms ease, box-shadow 220ms ease;
  white-space: nowrap;
}
.mm-back-btn:hover { transform: translateY(-1px); border-color: rgba(0,229,255,.52); background: linear-gradient(180deg, rgba(0,229,255,.14), rgba(4,28,44,.92)); box-shadow: 0 0 0 1px rgba(0,229,255,.14) inset, 0 12px 30px -16px rgba(0,229,255,.8); }
.mm-back-btn:focus-visible { outline: 2px solid var(--cyan); outline-offset: 3px; }
.mm-back-btn svg { width: 14px; height: 14px; }

.mm-eyebrow { display: flex; align-items: center; gap: 12px; margin: 0 0 16px; font-size: 9px; font-weight: 700; letter-spacing: .36em; color: var(--cyan); }
.mm-eyebrow::after { content: ""; flex: 1; height: 1px; max-width: 100px; background: linear-gradient(90deg, rgba(0,229,255,.6), transparent); }
.mm-hero {
  display: grid; grid-template-columns: minmax(0,1fr) minmax(0,380px);
  align-items: center; gap: clamp(20px,4vw,50px); padding-bottom: clamp(30px,6vh,60px);
}
.mm-hero-title {
  margin: 0; font-size: clamp(36px,6.2vw,74px); font-weight: 900; letter-spacing: -.04em; line-height: .9;
  background: linear-gradient(174deg, #ffffff 0%, #c8f6ff 34%, #4fa9c9 72%, #1c5170 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  filter: drop-shadow(0 0 36px rgba(0,229,255,.26));
}
.mm-hero-note { margin: 18px 0 0; max-width: 52ch; font-size: 14px; line-height: 1.65; color: var(--ink-2); }
.mm-hud-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; }
.mm-hud-chip { display: flex; align-items: center; gap: 9px; padding: 10px 14px; border: 1px solid rgba(255,255,255,.08); background: rgba(2,10,22,.55); }
.mm-hud-chip-text { display: grid; gap: 3px; }
.mm-hud-chip-key { font-size: 7.5px; font-weight: 700; letter-spacing: .24em; color: var(--ink-3); }
.mm-hud-chip-val { font-size: 10.5px; font-weight: 700; letter-spacing: .1em; color: var(--ink-1); }
.mm-core-wrap {
  position: relative; display: grid; place-items: center;
  width: 100%; max-width: 380px; height: 260px; justify-self: center;
  border: 1px solid rgba(0,229,255,.16);
  background: linear-gradient(180deg, rgba(4,26,47,.5), rgba(2,10,22,.75));
  clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px));
  overflow: hidden;
}
.mm-core-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(0,229,255,.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,229,255,.08) 1px, transparent 1px);
  background-size: 24px 24px;
}
.mm-core-wave {
  position: absolute; left: -10%; right: -10%; height: 2px; top: 50%;
  background: linear-gradient(90deg, transparent, var(--cyan), var(--aqua), var(--cyan), transparent);
  filter: drop-shadow(0 0 6px rgba(0,229,255,.6));
  animation: mmWaveMove 5s ease-in-out infinite;
}
.mm-core-wave.is-b { top: 62%; opacity: .5; animation-duration: 7s; animation-direction: reverse; }
.mm-core-wave.is-c { top: 38%; opacity: .35; animation-duration: 9s; }
@keyframes mmWaveMove {
  0%, 100% { clip-path: polygon(0 40%, 10% 60%, 20% 30%, 30% 70%, 40% 20%, 50% 55%, 60% 35%, 70% 65%, 80% 25%, 90% 50%, 100% 40%, 100% 100%, 0 100%); }
  50%      { clip-path: polygon(0 55%, 10% 25%, 20% 65%, 30% 35%, 40% 70%, 50% 30%, 60% 60%, 70% 20%, 80% 55%, 90% 30%, 100% 60%, 100% 100%, 0 100%); }
}
.mm-core-readout { position: relative; z-index: 1; text-align: center; }
.mm-core-readout-label { font-size: 8px; font-weight: 800; letter-spacing: .3em; color: var(--ink-3); }
.mm-core-readout-value { font-size: 30px; font-weight: 900; color: var(--aqua); text-shadow: 0 0 20px rgba(0,255,213,.5); }
.mm-core-scan {
  position: absolute; left: 0; right: 0; height: 30%;
  background: linear-gradient(180deg, transparent, rgba(0,255,213,.12), transparent);
  animation: mmScanSweep 4s linear infinite;
}
@keyframes mmScanSweep { 0% { top: -30%; } 100% { top: 100%; } }
.mm-section { padding-top: clamp(30px,6vh,60px); }
.mm-section-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; flex-wrap: wrap; margin-bottom: clamp(18px,3vh,30px); padding-bottom: 16px; border-bottom: 1px solid rgba(0,229,255,.12); }
.mm-section-title { margin: 0; font-size: clamp(19px,2.6vw,26px); font-weight: 800; letter-spacing: -.01em; }
.mm-section-note { margin: 7px 0 0; font-size: 13px; color: var(--ink-2); }
.mm-console {
  position: relative; padding: 30px clamp(22px,3vw,34px) 28px;
  border: 1px solid rgba(255,255,255,.07);
  background: linear-gradient(158deg, rgba(10,32,54,.6), rgba(3,12,26,.78));
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px));
  box-shadow: 0 24px 50px -30px rgba(0,0,0,.9);
  transform: none;
}
.mm-console::before { content: ""; position: absolute; left: 0; right: 22px; top: 0; height: 1px; background: linear-gradient(90deg, rgba(0,229,255,.7), transparent); }
.mm-console-title { display: flex; align-items: center; gap: 12px; margin: 0 0 22px; font-size: 12px; font-weight: 800; letter-spacing: .22em; }
.mm-console-title svg { width: 18px; height: 18px; color: var(--cyan); }
.mm-form-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; align-items: end; }
.mm-field { display: grid; gap: 9px; }
.mm-field-label { font-size: 9px; font-weight: 700; letter-spacing: .24em; color: var(--ink-3); transition: color 240ms ease; }
.mm-field:focus-within .mm-field-label { color: var(--cyan); }
.mm-field-shell {
  border: 1px solid rgba(255,255,255,.1); background: rgba(2,10,22,.55);
  transition: border-color 260ms ease, box-shadow 260ms ease, background 260ms ease;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
}
.mm-field:focus-within .mm-field-shell {
  border-color: rgba(0,229,255,.55); background: rgba(0,229,255,.06);
  box-shadow: 0 0 0 3px rgba(0,229,255,.08), 0 0 26px rgba(0,229,255,.18);
}
.mm-field-input, .mm-field-select {
  width: 100%; padding: 13px 14px; border: 0; background: transparent;
  color: var(--ink-1); font-family: inherit; font-size: 14px; outline: none;
}
.mm-field-input.is-mono { font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; }
.mm-field-input::placeholder { color: rgba(92,125,148,.7); }
.mm-field-input:disabled, .mm-field-select:disabled { opacity: .5; cursor: not-allowed; }
.mm-field-select option { background: #041a2f; color: var(--ink-1); }
.mm-form-actions { display: flex; gap: 12px; margin-top: 22px; flex-wrap: wrap; }
.mm-submit {
  position: relative; overflow: hidden;
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  padding: 14px 22px; height: 46px;
  border: 1px solid rgba(0,229,255,.5);
  background: linear-gradient(180deg, rgba(0,229,255,.16), rgba(0,120,150,.14));
  color: var(--ink-1); font-family: inherit; font-size: 10px; font-weight: 800; letter-spacing: .2em;
  white-space: nowrap; cursor: pointer;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  transition: transform 240ms var(--ease), box-shadow 300ms ease, opacity 200ms ease;
}
.mm-submit svg { width: 15px; height: 15px; }
.mm-submit::after {
  content: ""; position: absolute; top: 0; bottom: 0; left: -70%; width: 50%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.32), transparent);
  transform: skewX(-18deg); transition: left 640ms var(--ease);
}
.mm-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 34px -14px rgba(0,229,255,.6); }
.mm-submit:hover:not(:disabled)::after { left: 120%; }
.mm-submit:focus-visible { outline: 2px solid var(--cyan); outline-offset: 3px; }
.mm-submit:disabled { opacity: .55; cursor: not-allowed; transform: none; box-shadow: none; }
.mm-submit.is-editing { border-color: rgba(0,255,213,.55); background: linear-gradient(180deg, rgba(0,255,213,.18), rgba(0,150,120,.14)); }
.mm-cancel-edit {
  display: inline-flex; align-items: center; gap: 8px; padding: 13px 18px; height: 46px;
  border: 1px solid rgba(255,255,255,.15); background: rgba(255,255,255,.04);
  color: var(--ink-2); font-family: inherit; font-size: 10px; font-weight: 800; letter-spacing: .18em;
  cursor: pointer;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  transition: color 200ms ease, border-color 200ms ease, background 200ms ease;
}
.mm-cancel-edit:hover { color: var(--ink-1); border-color: rgba(255,255,255,.35); background: rgba(255,255,255,.08); }
.mm-cancel-edit:focus-visible { outline: 2px solid var(--cyan); outline-offset: 3px; }
.mm-editing-flag {
  display: flex; align-items: center; gap: 10px; margin-bottom: 18px; padding: 10px 14px;
  border: 1px solid rgba(0,255,213,.35); background: rgba(0,255,213,.06);
  font-size: 10px; font-weight: 700; letter-spacing: .18em; color: var(--aqua);
}
.mm-message {
  display: flex; align-items: flex-start; gap: 12px; margin-top: 18px; padding: 13px 16px;
  font-size: 13px; line-height: 1.5; animation: mmMessageIn 380ms var(--ease) both;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
}
@keyframes mmMessageIn { from { opacity: 0; transform: translateY(-6px); } }
.mm-message.is-ok { border: 1px solid rgba(0,255,213,.4); background: linear-gradient(180deg, rgba(0,60,50,.4), rgba(2,20,18,.35)); color: #b6ffe9; }
.mm-message.is-fail { border: 1px solid rgba(255,92,108,.42); background: linear-gradient(180deg, rgba(60,10,22,.5), rgba(20,6,12,.4)); color: #ffc3ca; }
.mm-message-head { display: block; font-size: 9px; font-weight: 800; letter-spacing: .24em; margin-bottom: 3px; }
.mm-message svg { width: 17px; height: 17px; flex: 0 0 auto; margin-top: 1px; }
.mm-db-layout { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,250px); gap: clamp(14px,1.8vw,22px); align-items: start; }
.mm-panel {
  position: relative; padding: 24px clamp(18px,2.4vw,28px) 22px;
  border: 1px solid rgba(255,255,255,.07);
  background: linear-gradient(158deg, rgba(8,26,44,.5), rgba(2,10,22,.72));
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
  overflow: hidden; transform: none;
}
.mm-panel::before { content: ""; position: absolute; left: 0; right: 20px; top: 0; height: 1px; background: linear-gradient(90deg, rgba(0,229,255,.7), transparent); }
.mm-panel-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.mm-panel-title { margin: 0; font-size: 14px; font-weight: 800; }
.mm-panel-note { margin: 6px 0 0; font-size: 11.5px; color: var(--ink-2); }
.mm-table-wrap { overflow-x: auto; }
.mm-table { width: 100%; border-collapse: collapse; min-width: 700px; }
.mm-table thead th { padding: 0 14px 12px; text-align: left; font-size: 8.5px; font-weight: 700; letter-spacing: .22em; color: var(--ink-3); border-bottom: 1px solid rgba(255,255,255,.08); white-space: nowrap; }
.mm-table thead th:last-child { text-align: right; }
.mm-row { position: relative; transition: background 220ms ease; }
.mm-row td { padding: 14px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,.045); vertical-align: middle; }
.mm-row:hover { background: rgba(0,229,255,.045); }
.mm-row::before {
  content: ""; position: absolute; left: 0; top: 8%; bottom: 8%; width: 2px;
  background: var(--cyan); opacity: 0; box-shadow: 0 0 10px var(--cyan); transition: opacity 220ms ease;
}
.mm-row:hover::before { opacity: 1; }
.mm-row.is-editing { background: rgba(0,255,213,.05); }
.mm-row.is-editing::before { opacity: 1; background: var(--aqua); box-shadow: 0 0 12px var(--aqua); }
.mm-sample-id {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px;
  color: var(--ink-2); transition: color 220ms ease;
}
.mm-row:hover .mm-sample-id { color: var(--cyan); }
.mm-sample-dot { width: 5px; height: 5px; flex: 0 0 auto; border-radius: 50%; background: rgba(0,229,255,.5); }
.mm-row:hover .mm-sample-dot { background: var(--cyan); box-shadow: 0 0 8px var(--cyan); }
.mm-reading { display: inline-flex; align-items: center; gap: 6px; font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 12.5px; }
.mm-reading-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ink-3); }
.mm-reading.is-value .mm-reading-dot { background: var(--aqua); box-shadow: 0 0 8px var(--aqua); }
.mm-reading-na { color: var(--ink-3); font-style: italic; }
.mm-actions { display: flex; justify-content: flex-end; gap: 8px; flex-wrap: wrap; }
.mm-action-btn {
  padding: 8px 13px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.03);
  color: var(--ink-2); font-family: inherit; font-size: 9px; font-weight: 700; letter-spacing: .16em;
  white-space: nowrap; cursor: pointer;
  transition: color 200ms ease, border-color 200ms ease, background 200ms ease, box-shadow 200ms ease, opacity 200ms ease;
}
.mm-action-btn:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }
.mm-action-btn:disabled { opacity: .45; cursor: not-allowed; }
.mm-action-btn.is-edit:hover:not(:disabled) { color: var(--cyan); border-color: rgba(0,229,255,.5); background: rgba(0,229,255,.08); }
.mm-action-btn.is-delete { border-color: rgba(255,92,108,.3); color: #ffb3ba; }
.mm-action-btn.is-delete:hover:not(:disabled) { background: rgba(255,92,108,.12); border-color: rgba(255,92,108,.7); box-shadow: 0 0 18px -6px rgba(255,92,108,.6); }
.mm-empty-row td { text-align: center; padding: 48px 20px; color: var(--ink-3); font-size: 12px; letter-spacing: .1em; }
.mm-meta-rows { display: grid; gap: 12px; }
.mm-meta-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,.06); font-size: 9.5px; font-weight: 600; letter-spacing: .16em; color: var(--ink-3); }
.mm-meta-row b { display: flex; align-items: center; gap: 7px; color: var(--ink-1); font-weight: 700; letter-spacing: .08em; }
.mm-meta-count { margin-top: 6px; padding-top: 16px; border-top: 1px solid rgba(0,229,255,.14); text-align: center; }
.mm-meta-count-num { font-size: 34px; font-weight: 900; letter-spacing: -.02em; background: linear-gradient(174deg, #fff, var(--cyan)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.mm-meta-count-label { margin-top: 4px; font-size: 8.5px; font-weight: 700; letter-spacing: .28em; color: var(--ink-3); }
@media (max-width: 1040px) {
  .mm-hero { grid-template-columns: 1fr; }
  .mm-core-wrap { max-width: 320px; order: -1; }
  .mm-db-layout { grid-template-columns: 1fr; }
  .mm-form-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 760px) {
  .mm-header { flex-direction: column; align-items: stretch; }
  .mm-header-actions { width: 100%; justify-content: space-between; }
  .mm-form-grid { grid-template-columns: 1fr; }
  .mm-submit, .mm-cancel-edit { width: 100%; }
  .mm-panel-top { flex-direction: column; align-items: stretch; }
  .mm-env-motes, .mm-env-lines { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .mm-root *, .mm-root *::before, .mm-root *::after {
    animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important;
  }
  .mm-stage { opacity: 1 !important; transform: none !important; }
  .mm-env-motes, .mm-env-lines { display: none; }
}
`;

function MeasurementStyles() {
  return <style>{MM_CSS}</style>;
}

/* ==========================================================================
   SECTION 2 - ICONS
   ========================================================================== */

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

function IconFlask() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path {...S} d="M9 3h6M10 3v6l-5.2 9a1.8 1.8 0 0 0 1.6 2.6h11.2a1.8 1.8 0 0 0 1.6-2.6L14 9V3" />
    </svg>
  );
}
function IconPlus() {
  return (<svg viewBox="0 0 24 24" aria-hidden="true"><path {...S} strokeWidth="1.8" d="M12 5v14M5 12h14" /></svg>);
}
function IconEditMode() {
  return (<svg viewBox="0 0 24 24" aria-hidden="true"><path {...S} d="M12 20h9" /><path {...S} d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>);
}
function IconCheck() {
  return (<svg viewBox="0 0 24 24" aria-hidden="true"><circle {...S} cx="12" cy="12" r="9.2" /><path {...S} strokeWidth="1.9" d="m8 12.4 2.6 2.6L16.4 9" /></svg>);
}
function IconWarn() {
  return (<svg viewBox="0 0 24 24" aria-hidden="true"><path {...S} d="M12 3.6 21.4 20H2.6L12 3.6Z" /><path {...S} strokeWidth="1.9" d="M12 9.4v4.6" /><circle cx="12" cy="17" r="1.05" fill="currentColor" stroke="none" /></svg>);
}
function IconBack() {
  return (<svg viewBox="0 0 24 24" aria-hidden="true"><path {...S} strokeWidth={1.9} d="M19 12H5M12 5l-7 7 7 7" /></svg>);
}

/* ==========================================================================
   SECTION 3 - BACKGROUND DECORATION
   ========================================================================== */

const MOTES = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 41.3) % 100, size: 3 + ((i * 7) % 8), duration: 28 + ((i * 11) % 22), delay: -(i * 2.6),
}));
const LINES = Array.from({ length: 4 }, (_, i) => ({ top: 12 + i * 22, duration: 14 + i * 3, delay: -(i * 4) }));

function Environment({ reduced }) {
  return (
    <div className="mm-env" aria-hidden="true">
      <div className="mm-env-deep" />
      <div className="mm-env-grid" />
      {!reduced && (
        <div className="mm-env-lines">
          {LINES.map((l, i) => (<i key={i} style={{ top: `${l.top}%`, animationDuration: `${l.duration}s`, animationDelay: `${l.delay}s` }} />))}
        </div>
      )}
      {!reduced && (
        <div className="mm-env-motes">
          {MOTES.map((m, i) => (<i key={i} style={{ left: `${m.left}%`, width: m.size, height: m.size, animationDuration: `${m.duration}s`, animationDelay: `${m.delay}s` }} />))}
        </div>
      )}
      <div className="mm-env-grade" />
    </div>
  );
}

function WaveformCore({ recordCount }) {
  return (
    <div className="mm-core-wrap" aria-hidden="true">
      <div className="mm-core-grid" />
      <div className="mm-core-wave" />
      <div className="mm-core-wave is-b" />
      <div className="mm-core-wave is-c" />
      <div className="mm-core-scan" />
      <div className="mm-core-readout">
        <div className="mm-core-readout-label">RECORDS TRACKED</div>
        <div className="mm-core-readout-value">{recordCount}</div>
      </div>
    </div>
  );
}

/* ==========================================================================
   SECTION 4 - THE COMPONENT
   ========================================================================== */

function AdminMeasurements() {

    const [measurements, setMeasurements] = useState([]);
    const [stations, setStations] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        sampleId: "",
        stationId: "",
        sampleDate: "",
        microcystin: ""
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [ready, setReady] = useState(false);
    const [reduced, setReduced] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const sampleIdRef = useRef(null);

    const handleBackToAdmin = useCallback(() => {
        window.location.href = "/admin";
    }, []);

    const loadData = async () => {
        try {
            const [measurementResponse, stationResponse] = await Promise.all([
                adminFetch("https://toxictide-backend.onrender.com/api/admin/measurements"),
                adminFetch("https://toxictide-backend.onrender.com/api/admin/stations")
            ]);
            if (!measurementResponse.ok || !stationResponse.ok) {
                throw new Error("Failed to load data");
            }
            const measurementData = await measurementResponse.json();
            const stationData = await stationResponse.json();
            setMeasurements(measurementData);
            setStations(stationData);
        } catch (err) {
            setError("Failed to load cyanotoxin measurements.");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const mq = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(Boolean(mq && mq.matches));
        const id = requestAnimationFrame(() => setReady(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setIsSubmitting(true);
        try {
            let response;
            if (editingId) {
                response = await adminFetch(
                    `https://toxictide-backend.onrender.com/api/admin/measurements/${editingId}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            stationId: formData.stationId,
                            sampleDate: formData.sampleDate,
                            microcystin: formData.microcystin
                        })
                    }
                );
            } else {
                response = await adminFetch(
                    "https://toxictide-backend.onrender.com/api/admin/measurements",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(formData)
                    }
                );
            }
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Operation failed");
            }
            setMessage(
                editingId
                    ? "Measurement updated successfully."
                    : "Measurement added successfully."
            );
            resetForm();
            loadData();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (measurement) => {
        setEditingId(measurement.SAMPLE_ID);
        setFormData({
            sampleId: measurement.SAMPLE_ID,
            stationId: measurement.STATION_ID,
            sampleDate: measurement.SAMPLE_DATE
                ? measurement.SAMPLE_DATE.substring(0, 10)
                : "",
            microcystin:
                measurement.MICROCYSTIN_UGL === null
                    ? ""
                    : measurement.MICROCYSTIN_UGL
        });
        setMessage("");
        setError("");
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (sampleId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this measurement?"
        );
        if (!confirmed) {
            return;
        }
        setMessage("");
        setError("");
        setDeletingId(sampleId);
        try {
            const response = await adminFetch(
                `https://toxictide-backend.onrender.com/api/admin/measurements/${sampleId}`,
                {
                    method: "DELETE"
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to delete measurement"
                );
            }
            setMessage("Measurement deleted successfully.");
            loadData();
        } catch (err) {
            setError(err.message);
        } finally {
            setDeletingId(null);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            sampleId: "",
            stationId: "",
            sampleDate: "",
            microcystin: ""
        });
    };

    return (
        <div className={`mm-root${ready ? " is-ready" : ""}`}>
            <MeasurementStyles />
            <Environment reduced={reduced} />

            <div className="mm-shell">

                <header className="mm-header mm-stage" style={{ "--mm-delay": "200ms" }}>
                    <div className="mm-brand">
                        <span className="mm-brand-mark" aria-hidden="true"><IconFlask /></span>
                        <div>
                            <p className="mm-brand-name">TOXICTIDE</p>
                            <p className="mm-brand-sub">CYANOTOXIN MONITORING SYSTEM</p>
                            <p className="mm-brand-module">MEASUREMENT MANAGEMENT MODULE</p>
                            <p className="mm-online"><i className="mm-dot" />SYSTEM ONLINE</p>
                        </div>
                    </div>

                    <div className="mm-header-actions">
                        <span className="mm-system-pill" aria-hidden="true">
                            <i className="mm-dot" /> SYSTEM ONLINE
                        </span>
                        <button type="button" className="mm-back-btn" onClick={handleBackToAdmin}>
                            <IconBack /> ADMIN COMMAND CENTER
                        </button>
                    </div>
                </header>

                <section className="mm-hero">
                    <div>
                        <p className="mm-eyebrow mm-stage" style={{ "--mm-delay": "380ms" }}>
                            WATER QUALITY DATA LAYER
                        </p>

                        <h1 className="mm-hero-title mm-stage" style={{ "--mm-delay": "460ms" }}>
                            CYANOTOXIN<br />MEASUREMENTS
                        </h1>

                        <p className="mm-hero-note mm-stage" style={{ "--mm-delay": "580ms" }}>
                            Manage official microcystin monitoring records stored in the
                            ToxicTide database. Every measurement below is linked to a
                            real monitoring station and sample date.
                        </p>

                        <div className="mm-hud-row mm-stage" style={{ "--mm-delay": "680ms" }}>
                            <div className="mm-hud-chip">
                                <i className="mm-dot" />
                                <span className="mm-hud-chip-text">
                                    <span className="mm-hud-chip-key">MEASUREMENT DATABASE</span>
                                    <span className="mm-hud-chip-val">CONNECTED</span>
                                </span>
                            </div>
                            <div className="mm-hud-chip">
                                <i className="mm-dot is-cyan" />
                                <span className="mm-hud-chip-text">
                                    <span className="mm-hud-chip-key">MONITORING STATIONS</span>
                                    <span className="mm-hud-chip-val">{stations.length}</span>
                                </span>
                            </div>
                            <div className="mm-hud-chip">
                                <i className="mm-dot is-violet" />
                                <span className="mm-hud-chip-text">
                                    <span className="mm-hud-chip-key">ADMIN SESSION</span>
                                    <span className="mm-hud-chip-val">AUTHORIZED</span>
                                </span>
                            </div>
                            <div className="mm-hud-chip">
                                <i className={`mm-dot ${editingId ? "is-danger" : "is-cyan"}`} />
                                <span className="mm-hud-chip-text">
                                    <span className="mm-hud-chip-key">FORM MODE</span>
                                    <span className="mm-hud-chip-val">{editingId ? "EDITING" : "ADD NEW"}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mm-stage" style={{ "--mm-delay": "700ms" }}>
                        <WaveformCore recordCount={measurements.length} />
                    </div>
                </section>

                <section className="mm-section">
                    <div className="mm-console mm-stage" style={{ "--mm-delay": "900ms" }}>

                        <h2 className="mm-console-title">
                            {editingId ? <IconEditMode /> : <IconPlus />}
                            {editingId ? "EDIT MEASUREMENT" : "ADD MEASUREMENT"}
                        </h2>

                        {editingId && (
                            <div className="mm-editing-flag">
                                <i className="mm-dot is-cyan" />
                                EDITING SAMPLE #{editingId} - changes will overwrite this record
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mm-form-grid">

                                <div className="mm-field">
                                    <label className="mm-field-label" htmlFor="sampleId">SAMPLE ID</label>
                                    <div className="mm-field-shell">
                                        <input
                                            ref={sampleIdRef}
                                            id="sampleId"
                                            className="mm-field-input is-mono"
                                            type="number"
                                            name="sampleId"
                                            value={formData.sampleId}
                                            onChange={handleChange}
                                            disabled={editingId !== null || isSubmitting}
                                            placeholder="Example: 1638"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mm-field">
                                    <label className="mm-field-label" htmlFor="stationId">MONITORING STATION</label>
                                    <div className="mm-field-shell">
                                        <select
                                            id="stationId"
                                            className="mm-field-select"
                                            name="stationId"
                                            value={formData.stationId}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                            required
                                        >
                                            <option value="">Select station</option>
                                            {stations.map((station) => (
                                                <option key={station.STATION_ID} value={station.STATION_ID}>
                                                    {station.STATION_ID} - {station.STATION_NAME}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mm-field">
                                    <label className="mm-field-label" htmlFor="sampleDate">SAMPLE DATE</label>
                                    <div className="mm-field-shell">
                                        <input
                                            id="sampleDate"
                                            className="mm-field-input"
                                            type="date"
                                            name="sampleDate"
                                            value={formData.sampleDate}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mm-field">
                                    <label className="mm-field-label" htmlFor="microcystin">MICROCYSTIN (ug/L)</label>
                                    <div className="mm-field-shell">
                                        <input
                                            id="microcystin"
                                            className="mm-field-input is-mono"
                                            type="number"
                                            step="0.001"
                                            min="0"
                                            name="microcystin"
                                            value={formData.microcystin}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                            placeholder="Leave empty if unavailable"
                                        />
                                    </div>
                                </div>

                            </div>

                            <div className="mm-form-actions">

                                <button
                                    type="submit"
                                    className={`mm-submit${editingId ? " is-editing" : ""}`}
                                    disabled={isSubmitting}
                                >
                                    {editingId ? <IconEditMode /> : <IconPlus />}
                                    {isSubmitting
                                        ? "SAVING..."
                                        : editingId
                                            ? "UPDATE MEASUREMENT"
                                            : "ADD MEASUREMENT"}
                                </button>

                                {editingId && (
                                    <button
                                        type="button"
                                        className="mm-cancel-edit"
                                        onClick={resetForm}
                                        disabled={isSubmitting}
                                    >
                                        CANCEL EDIT
                                    </button>
                                )}

                            </div>
                        </form>

                        {message && (
                            <div className="mm-message is-ok" role="status">
                                <IconCheck />
                                <span>
                                    <span className="mm-message-head">DATA TRANSACTION COMPLETE</span>
                                    {message}
                                </span>
                            </div>
                        )}

                        {error && (
                            <div className="mm-message is-fail" role="alert">
                                <IconWarn />
                                <span>
                                    <span className="mm-message-head">DATA TRANSACTION FAILED</span>
                                    {error}
                                </span>
                            </div>
                        )}
                    </div>
                </section>

                <section className="mm-section">
                    <div className="mm-section-head mm-stage" style={{ "--mm-delay": "1100ms" }}>
                        <div>
                            <h2 className="mm-section-title">Monitoring records</h2>
                            <p className="mm-section-note">{measurements.length} records in the database.</p>
                        </div>
                    </div>

                    <div className="mm-db-layout mm-stage" style={{ "--mm-delay": "1200ms" }}>

                        <div className="mm-panel">
                            <div className="mm-panel-top">
                                <div>
                                    <h3 className="mm-panel-title">Measurement records</h3>
                                    <p className="mm-panel-note">Click Edit to load a record into the form above.</p>
                                </div>
                            </div>

                            <div className="mm-table-wrap">
                                <table className="mm-table">
                                    <thead>
                                        <tr>
                                            <th>Sample ID</th>
                                            <th>Station ID</th>
                                            <th>Station Name</th>
                                            <th>Sample Date</th>
                                            <th>Microcystin (ug/L)</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {measurements.length === 0 ? (
                                            <tr className="mm-empty-row">
                                                <td colSpan="6">No measurement records found.</td>
                                            </tr>
                                        ) : (
                                            measurements.map((measurement) => {
                                                const isEditingRow = editingId === measurement.SAMPLE_ID;
                                                const isDeleting = deletingId === measurement.SAMPLE_ID;
                                                const hasReading = measurement.MICROCYSTIN_UGL !== null;

                                                return (
                                                    <tr
                                                        key={measurement.SAMPLE_ID}
                                                        className={`mm-row${isEditingRow ? " is-editing" : ""}`}
                                                    >
                                                        <td>
                                                            <span className="mm-sample-id">
                                                                <i className="mm-sample-dot" />
                                                                {measurement.SAMPLE_ID}
                                                            </span>
                                                        </td>

                                                        <td>{measurement.STATION_ID}</td>

                                                        <td>{measurement.STATION_NAME}</td>

                                                        <td>
                                                            {measurement.SAMPLE_DATE
                                                                ? measurement.SAMPLE_DATE.substring(0, 10)
                                                                : "-"}
                                                        </td>

                                                        <td>
                                                            {hasReading ? (
                                                                <span className="mm-reading is-value">
                                                                    <i className="mm-reading-dot" />
                                                                    {measurement.MICROCYSTIN_UGL}
                                                                </span>
                                                            ) : (
                                                                <span className="mm-reading-na">N/A</span>
                                                            )}
                                                        </td>

                                                        <td>
                                                            <div className="mm-actions">
                                                                <button
                                                                    type="button"
                                                                    className="mm-action-btn is-edit"
                                                                    onClick={() => handleEdit(measurement)}
                                                                    disabled={isDeleting}
                                                                >
                                                                    EDIT
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    className="mm-action-btn is-delete"
                                                                    onClick={() => handleDelete(measurement.SAMPLE_ID)}
                                                                    disabled={isDeleting}
                                                                >
                                                                    {isDeleting ? "REMOVING..." : "DELETE"}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}

                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mm-panel">
                            <p className="mm-panel-title" style={{ marginBottom: 18 }}>Measurement database</p>
                            <div className="mm-meta-rows">
                                <div className="mm-meta-row">
                                    <span>SOURCE</span>
                                    <b>ToxicTide backend</b>
                                </div>
                                <div className="mm-meta-row">
                                    <span>ACCESS</span>
                                    <b>ADMINISTRATOR</b>
                                </div>
                                <div className="mm-meta-row">
                                    <span>STATUS</span>
                                    <b><i className="mm-dot" />CONNECTED</b>
                                </div>
                            </div>
                            <div className="mm-meta-count">
                                <div className="mm-meta-count-num">{measurements.length}</div>
                                <div className="mm-meta-count-label">RECORDS ON FILE</div>
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        </div>
    );
}

export default AdminMeasurements;