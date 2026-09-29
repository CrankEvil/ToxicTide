/* ============================================================================
 *  TOXICTIDE — COMMUNITY REPORT INTELLIGENCE COMMAND CENTER
 *
 *  FILE LOCATION:  src/admin/AdminCommunityReports.jsx   (replaces your file)
 *
 *  WHAT THIS FILE IS
 *    One file. The whole stylesheet lives in the CR_CSS string below, so there
 *    is nothing else to create. Every class starts with "cr-" (Community
 *    Reports), so it cannot collide with App.css or with the other admin
 *    pages. ZERO new npm packages: axios and react-router-dom are already
 *    used by your project.
 *
 *  WHAT CHANGED AND WHAT DID NOT
 *    Changed:   everything you SEE, plus one new button that returns to the
 *               Admin Command Center with navigate("/admin"). That needs
 *               useNavigate, which is the only new import.
 *    Unchanged: the state variables, loadReports, updateStatus, deleteReport,
 *               formatDate, the filteredReports search/status filter, the
 *               statistics, clearFilters, the confirm() before delete, the
 *               three axios calls and their URLs, the error messages, and the
 *               field names (REPORT_ID, STATION_ID, STATION_NAME, REPORT_DATE,
 *               REPORT_TYPE, DESCRIPTION, SEVERITY, STATUS, CREATED_AT).
 *
 *  WHAT THE PROJECT PDF REQUIRES (Use Case 8, FR-13, sections 17 and 20)
 *    - Show station, date, type, description, severity and status.   -> done
 *    - Change status; mark Reviewed or Resolved.                    -> done
 *    - Delete a report when necessary.                              -> done
 *    - Statuses are Pending, Reviewed and Resolved.                 -> done
 *    - Community data stays separate from official measurements, and
 *      the interface says so clearly.                               -> done
 *    - A report may have no linked station ("Not linked").          -> done
 *    - Return path to the admin area.                               -> done
 * ========================================================================== */

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Your global stylesheet. Every style this page needs is embedded below, so if
// this path is ever wrong you can simply delete this line.
import "../App.css";

/* ══════════════════════════════════════════════════════════════════════════
   SECTION 1 — EMBEDDED STYLESHEET
   ══════════════════════════════════════════════════════════════════════════ */

const CR_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

.cr-root {
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

.cr-root *, .cr-root *::before, .cr-root *::after { box-sizing: border-box; }

.cr-root :where(h1, h2, h3, h4, p, span, small, strong, b, em, i, li, label, div, button, input, select, option) {
  color: inherit;
}

/* ============================================================
   ENVIRONMENT
   ============================================================ */

.cr-env { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }

.cr-env-deep {
  position: absolute; inset: 0;
  background:
    radial-gradient(80% 55% at 50% 106%, rgba(0, 229, 255, 0.14) 0%, transparent 62%),
    radial-gradient(55% 42% at 10% 6%, rgba(20, 125, 255, 0.14) 0%, transparent 64%),
    radial-gradient(48% 40% at 90% 12%, rgba(114, 92, 255, 0.1) 0%, transparent 66%),
    linear-gradient(180deg, #010509 0%, #020914 40%, #041a2f 100%);
}

.cr-env-grid {
  position: absolute; inset: -10%;
  background-image:
    linear-gradient(rgba(0, 229, 255, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 255, 0.055) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(70% 60% at 50% 35%, #000 10%, transparent 72%);
  -webkit-mask-image: radial-gradient(70% 60% at 50% 35%, #000 10%, transparent 72%);
  animation: crGridDrift 50s linear infinite;
}
@keyframes crGridDrift {
  from { background-position: 0 0, 0 0; }
  to   { background-position: 64px 64px, 64px 64px; }
}

.cr-env-lines { position: absolute; inset: 0; }
.cr-env-lines i {
  position: absolute; left: -20%;
  width: 40%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 213, 0.35), transparent);
  animation: crLine linear infinite;
}
@keyframes crLine {
  from { transform: translateX(0); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  to   { transform: translateX(340%); opacity: 0; }
}

.cr-env-motes { position: absolute; inset: 0; }
.cr-env-motes i {
  position: absolute; bottom: -6vh; border-radius: 50%;
  background: radial-gradient(50% 50% at 50% 50%, rgba(0, 255, 213, 0.5), rgba(0, 229, 255, 0.05) 70%, transparent);
  animation: crRise linear infinite;
}
@keyframes crRise {
  0%   { transform: translate3d(0, 0, 0); opacity: 0; }
  12%  { opacity: 0.65; }
  84%  { opacity: 0.45; }
  100% { transform: translate3d(30px, -108vh, 0); opacity: 0; }
}

.cr-env-grade {
  position: absolute; inset: 0;
  background: radial-gradient(130% 90% at 50% 38%, transparent 42%, rgba(1, 5, 9, 0.6) 82%, rgba(1, 4, 8, 0.94) 100%);
}

/* ============================================================
   SHELL + ENTRY SEQUENCE
   ============================================================ */

.cr-shell {
  position: relative; z-index: 1;
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: 0 clamp(16px, 3vw, 40px) 80px;
}

.cr-stage { opacity: 0; transform: translateY(20px); }
.cr-root.is-ready .cr-stage {
  animation: crStageIn 800ms var(--ease) both;
  animation-delay: var(--cr-delay, 0ms);
}
@keyframes crStageIn {
  from { opacity: 0; transform: translateY(20px); filter: blur(7px); }
  to   { opacity: 1; transform: none; filter: blur(0); }
}

/* ============================================================
   HEADER
   ============================================================ */

.cr-header {
  position: sticky; top: 0; z-index: 30;
  display: flex; align-items: center; justify-content: space-between;
  gap: 18px;
  margin-bottom: clamp(26px, 5vh, 52px);
  padding: 16px 0;
  background: linear-gradient(180deg, rgba(2, 9, 20, 0.92) 40%, rgba(2, 9, 20, 0));
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.cr-brand { display: flex; align-items: center; gap: 14px; min-width: 0; }
.cr-brand-mark {
  width: 42px; height: 42px; flex: 0 0 auto;
  display: grid; place-items: center;
  border: 1px solid rgba(0, 229, 255, 0.28);
  background: linear-gradient(150deg, rgba(0, 229, 255, 0.14), rgba(114, 92, 255, 0.1));
  clip-path: polygon(50% 0, 100% 26%, 100% 74%, 50% 100%, 0 74%, 0 26%);
  box-shadow: 0 0 26px rgba(0, 229, 255, 0.22), inset 0 0 18px rgba(0, 229, 255, 0.12);
}
.cr-brand-mark svg { width: 22px; height: 22px; }
.cr-brand-name { margin: 0; font-size: 14px; font-weight: 800; letter-spacing: 0.22em; line-height: 1; }
.cr-brand-sub { margin: 5px 0 0; font-size: 8px; font-weight: 600; letter-spacing: 0.3em; color: var(--ink-3); }

.cr-online {
  display: flex; align-items: center; gap: 7px;
  margin-top: 8px;
  font-size: 8.5px; font-weight: 700; letter-spacing: 0.24em; color: var(--ink-2);
}

.cr-dot {
  width: 6px; height: 6px; flex: 0 0 auto; border-radius: 50%;
  background: var(--aqua); box-shadow: 0 0 10px var(--aqua);
  animation: crBreath 2.8s ease-in-out infinite;
}
.cr-dot.is-cyan { background: var(--cyan); box-shadow: 0 0 10px var(--cyan); }
.cr-dot.is-violet { background: var(--violet); box-shadow: 0 0 10px var(--violet); }
.cr-dot.is-warn { background: var(--warn); box-shadow: 0 0 10px var(--warn); }
.cr-dot.is-danger { background: var(--danger); box-shadow: 0 0 10px var(--danger); }
@keyframes crBreath {
  0%, 100% { opacity: 0.35; transform: scale(0.82); }
  50%      { opacity: 1; transform: scale(1.12); }
}

.cr-back {
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
.cr-back svg { width: 14px; height: 14px; transition: transform 320ms var(--ease); }
.cr-back::after {
  content: ""; position: absolute; top: 0; bottom: 0; left: -70%; width: 50%;
  background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.28), transparent);
  transform: skewX(-18deg);
  transition: left 700ms var(--ease);
}
.cr-back:hover { color: var(--ink-1); border-color: rgba(0, 229, 255, 0.75); box-shadow: 0 0 30px -8px rgba(0, 229, 255, 0.5); }
.cr-back:hover::after { left: 120%; }
.cr-back:hover svg { transform: translateX(-4px); }
.cr-back:focus-visible { outline: 2px solid var(--cyan); outline-offset: 3px; }

/* ============================================================
   HERO + CORE
   ============================================================ */

.cr-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 360px);
  align-items: center;
  gap: clamp(20px, 4vw, 50px);
  padding-bottom: clamp(30px, 6vh, 56px);
}

.cr-eyebrow {
  display: flex; align-items: center; gap: 12px;
  margin: 0 0 16px;
  font-size: 9px; font-weight: 700; letter-spacing: 0.36em; color: var(--cyan);
}
.cr-eyebrow::after {
  content: ""; flex: 1; height: 1px; max-width: 100px;
  background: linear-gradient(90deg, rgba(0, 229, 255, 0.6), transparent);
}

.cr-hero-title {
  margin: 0;
  font-size: clamp(38px, 6.6vw, 76px);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 0.9;
  background: linear-gradient(174deg, #ffffff 0%, #c8f6ff 34%, #4fa9c9 72%, #1c5170 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  filter: drop-shadow(0 0 36px rgba(0, 229, 255, 0.26));
}

.cr-hero-note {
  margin: 18px 0 0;
  max-width: 54ch;
  font-size: 14px; line-height: 1.65;
  color: var(--ink-2);
}

/* the four real counts — each one is computed from the reports array */
.cr-stat-row { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: 26px; }
.cr-stat {
  display: flex; flex-direction: column; gap: 5px;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(2, 10, 22, 0.55);
  border-left: 2px solid var(--cr-tone, var(--cyan));
}
.cr-stat-num {
  font-size: 26px; font-weight: 900; letter-spacing: -0.02em;
  background: linear-gradient(174deg, #ffffff, var(--cr-tone, var(--cyan)));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.cr-stat-label { font-size: 8px; font-weight: 700; letter-spacing: 0.24em; color: var(--ink-3); }

.cr-hud-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 14px; }
.cr-hud-chip {
  display: flex; align-items: center; gap: 9px;
  padding: 9px 13px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(2, 10, 22, 0.5);
}
.cr-hud-chip-text { display: grid; gap: 3px; }
.cr-hud-chip-key { font-size: 7.5px; font-weight: 700; letter-spacing: 0.22em; color: var(--ink-3); }
.cr-hud-chip-val { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: var(--ink-1); }

/* the signal core: a wireframe sphere with broadcast rings, standing for
   observations arriving from the public */
.cr-core-wrap {
  position: relative; display: grid; place-items: center;
  aspect-ratio: 1; width: 100%; max-width: 340px; justify-self: center;
  perspective: 900px;
}
.cr-core-glow {
  position: absolute; inset: 8%; border-radius: 50%;
  background:
    radial-gradient(50% 50% at 50% 50%, rgba(0, 229, 255, 0.26), transparent 68%),
    radial-gradient(60% 60% at 42% 74%, rgba(114, 92, 255, 0.2), transparent 72%);
  filter: blur(28px);
  animation: crBreath 7s ease-in-out infinite;
}
.cr-core {
  position: relative; width: 62%; aspect-ratio: 1;
  transform-style: preserve-3d;
  transform: rotateX(18deg) rotateZ(-6deg);
  animation: crCoreSpin 52s linear infinite;
}
@keyframes crCoreSpin {
  from { transform: rotateX(18deg) rotateZ(-6deg) rotateY(0deg); }
  to   { transform: rotateX(18deg) rotateZ(-6deg) rotateY(360deg); }
}
.cr-core-meridian {
  position: absolute; inset: 0;
  border: 1px solid rgba(0, 229, 255, 0.18);
  border-radius: 50%;
  transform-style: preserve-3d;
}
.cr-core-meridian:nth-child(odd) { border-color: rgba(114, 92, 255, 0.16); }
.cr-core-body {
  position: absolute; inset: 6%; border-radius: 50%;
  background:
    radial-gradient(42% 38% at 32% 26%, rgba(180, 250, 255, 0.42), transparent 62%),
    radial-gradient(70% 70% at 62% 74%, rgba(60, 60, 160, 0.4), transparent 72%),
    linear-gradient(160deg, rgba(4, 40, 62, 0.86), rgba(2, 12, 26, 0.94));
  box-shadow:
    inset -18px -22px 60px rgba(0, 0, 0, 0.75),
    inset 12px 14px 44px rgba(0, 229, 255, 0.14),
    0 0 60px rgba(0, 229, 255, 0.16);
}
/* broadcast rings expanding outward from the centre */
.cr-core-ring {
  position: absolute; inset: 0; border-radius: 50%;
  border: 1px solid rgba(0, 255, 213, 0.4);
  opacity: 0;
  animation: crBroadcast 5.4s ease-out infinite;
}
.cr-core-ring:nth-of-type(2) { animation-delay: 1.8s; }
.cr-core-ring:nth-of-type(3) { animation-delay: 3.6s; }
@keyframes crBroadcast {
  0%   { transform: scale(0.55); opacity: 0.7; }
  100% { transform: scale(1.35); opacity: 0; }
}
.cr-core-orbit {
  position: absolute; inset: 0; border: 1px solid rgba(0, 229, 255, 0.15);
  border-radius: 50%; animation: crOrbit 30s linear infinite;
}
.cr-core-orbit::before {
  content: ""; position: absolute; left: 50%; top: -3.5px;
  width: 7px; height: 7px; margin-left: -3.5px; border-radius: 50%;
  background: var(--cyan); box-shadow: 0 0 14px var(--cyan);
}
@keyframes crOrbit { to { transform: rotate(360deg); } }

/* ============================================================
   SECTIONS + PANELS
   ============================================================ */

.cr-section { padding-top: clamp(24px, 5vh, 48px); }

.cr-panel {
  position: relative;
  padding: 26px clamp(18px, 2.6vw, 30px) 24px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: linear-gradient(158deg, rgba(8, 26, 44, 0.5), rgba(2, 10, 22, 0.72));
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px));
  overflow: hidden;
}
.cr-panel::before {
  content: ""; position: absolute; left: 0; right: 22px; top: 0; height: 1px;
  background: linear-gradient(90deg, rgba(0, 229, 255, 0.7), transparent);
}

.cr-panel-head {
  margin-bottom: 20px; padding-bottom: 18px;
  border-bottom: 1px solid rgba(0, 229, 255, 0.12);
}
.cr-panel-title { margin: 0 0 6px; font-size: clamp(17px, 2.2vw, 22px); font-weight: 800; letter-spacing: -0.01em; }
.cr-panel-note { margin: 0; font-size: 13px; color: var(--ink-2); }

/* ============================================================
   ERROR BANNER
   ============================================================ */

.cr-error {
  display: flex; align-items: flex-start; gap: 12px;
  margin-bottom: 18px;
  padding: 14px 16px;
  border: 1px solid rgba(255, 92, 108, 0.42);
  background: linear-gradient(180deg, rgba(60, 10, 22, 0.5), rgba(20, 6, 12, 0.4));
  color: #ffc3ca;
  font-size: 13px; line-height: 1.5;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  animation: crMessageIn 380ms var(--ease) both;
}
@keyframes crMessageIn { from { opacity: 0; transform: translateY(-6px); } }
.cr-error svg { width: 18px; height: 18px; flex: 0 0 auto; margin-top: 1px; }
.cr-error-head { display: block; font-size: 9px; font-weight: 800; letter-spacing: 0.24em; margin-bottom: 3px; }

/* ============================================================
   FILTERS
   ============================================================ */

.cr-filters { display: flex; gap: 14px; align-items: flex-end; flex-wrap: wrap; margin-bottom: 16px; }
.cr-filter { display: grid; gap: 9px; flex: 1; min-width: 220px; }
.cr-filter.is-narrow { flex: 0 1 240px; }
.cr-filter-label {
  font-size: 9px; font-weight: 700; letter-spacing: 0.24em; color: var(--ink-3);
  transition: color 240ms ease;
}
.cr-filter:focus-within .cr-filter-label { color: var(--cyan); }

.cr-shell-box {
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(2, 10, 22, 0.55);
  transition: border-color 260ms ease, box-shadow 260ms ease, background 260ms ease;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
}
.cr-shell-box::after {
  content: ""; position: absolute; left: 0; bottom: 0; height: 1px; width: 0;
  background: linear-gradient(90deg, var(--cyan), var(--aqua), transparent);
  transition: width 460ms var(--ease);
}
.cr-filter:focus-within .cr-shell-box {
  border-color: rgba(0, 229, 255, 0.55);
  background: rgba(0, 229, 255, 0.06);
  box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.08), 0 0 26px rgba(0, 229, 255, 0.18);
}
.cr-filter:focus-within .cr-shell-box::after { width: 100%; }

.cr-search-icon {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  width: 16px; height: 16px; color: var(--ink-3); pointer-events: none;
}
.cr-input, .cr-select {
  width: 100%;
  padding: 13px 14px;
  border: 0; background: transparent;
  color: var(--ink-1);
  font-family: inherit; font-size: 14px; font-weight: 500; letter-spacing: 0.02em;
  outline: none;
}
.cr-input { padding-left: 40px; }
.cr-input::placeholder { color: rgba(92, 125, 148, 0.7); }
.cr-select { appearance: none; cursor: pointer; padding-right: 36px; }
.cr-select option { background: #041426; color: var(--ink-1); }

/* CSS chevron for dropdowns, so no icon or extra element is needed */
.cr-shell-box.has-select::before {
  content: ""; position: absolute; right: 14px; top: 50%;
  width: 8px; height: 8px; margin-top: -5px;
  border-right: 1.5px solid var(--ink-3); border-bottom: 1.5px solid var(--ink-3);
  transform: rotate(45deg); pointer-events: none;
}

.cr-tool-btn {
  position: relative; overflow: hidden;
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 16px;
  border: 1px solid rgba(0, 229, 255, 0.3);
  background: rgba(0, 229, 255, 0.06);
  color: var(--ink-2);
  font-family: inherit; font-size: 9.5px; font-weight: 700; letter-spacing: 0.2em;
  white-space: nowrap; cursor: pointer;
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  transition: color 220ms ease, border-color 220ms ease, background 220ms ease;
}
.cr-tool-btn svg { width: 14px; height: 14px; }
.cr-tool-btn:hover:not(:disabled) { color: var(--ink-1); border-color: rgba(0, 229, 255, 0.7); background: rgba(0, 229, 255, 0.12); }
.cr-tool-btn:disabled { opacity: 0.65; cursor: not-allowed; }
.cr-tool-btn:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }
.cr-tool-btn.is-danger { border-color: rgba(255, 92, 108, 0.35); background: rgba(255, 92, 108, 0.06); color: #ffb3ba; }
.cr-tool-btn.is-danger:hover { border-color: rgba(255, 92, 108, 0.75); background: rgba(255, 92, 108, 0.12); }
.cr-tool-btn.is-spinning svg { animation: crSpin 900ms linear infinite; }
@keyframes crSpin { to { transform: rotate(360deg); } }

.cr-result-line { margin: 0 0 16px; font-size: 12.5px; color: var(--ink-2); }
.cr-result-line strong { color: var(--ink-1); }

/* ============================================================
   LOADING + EMPTY STATES
   ============================================================ */

.cr-loading { display: grid; place-items: center; gap: 16px; padding: 56px 20px; text-align: center; }
.cr-loading-ring { position: relative; width: 56px; height: 56px; }
.cr-loading-ring i {
  position: absolute; inset: 0; border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: var(--cyan);
  border-right-color: rgba(0, 229, 255, 0.25);
  animation: crSpin 1.1s linear infinite;
}
.cr-loading-ring i:nth-child(2) { inset: 9px; border-top-color: var(--aqua); animation-duration: 1.5s; animation-direction: reverse; }
.cr-loading-text { margin: 0; font-size: 10px; font-weight: 700; letter-spacing: 0.26em; color: var(--ink-2); }
.cr-loading-sub { margin: 0; font-size: 11.5px; color: var(--ink-3); }
.cr-loading-scan {
  width: min(280px, 70vw); height: 2px;
  background: rgba(255, 255, 255, 0.06); overflow: hidden; position: relative;
}
.cr-loading-scan::after {
  content: ""; position: absolute; top: 0; bottom: 0; width: 40%;
  background: linear-gradient(90deg, transparent, var(--cyan), transparent);
  animation: crScanBar 1.3s ease-in-out infinite;
}
@keyframes crScanBar { 0% { left: -40%; } 100% { left: 100%; } }

.cr-empty {
  display: grid; place-items: center; gap: 10px;
  padding: 52px 20px; text-align: center;
  border: 1px dashed rgba(0, 229, 255, 0.22);
  background: rgba(0, 229, 255, 0.03);
}
.cr-empty svg { width: 34px; height: 34px; color: var(--ink-3); margin-bottom: 4px; }
.cr-empty-title { margin: 0; font-size: 13px; font-weight: 800; letter-spacing: 0.16em; color: var(--ink-1); }
.cr-empty-sub { margin: 0; font-size: 11.5px; color: var(--ink-3); letter-spacing: 0.06em; max-width: 42ch; line-height: 1.6; }

/* ============================================================
   REPORT RECORDS — every field stacked, label above value
   ============================================================ */

.cr-records { display: flex; flex-direction: column; gap: 12px; }

.cr-record {
  --cr-tone: var(--warn);
  position: relative;
  padding: 18px 18px 16px 22px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(2, 10, 22, 0.4);
  transition: background 220ms ease, border-color 220ms ease;
}
.cr-record.is-reviewed { --cr-tone: var(--cyan); }
.cr-record.is-resolved { --cr-tone: var(--aqua); }
.cr-record:hover { background: rgba(0, 229, 255, 0.05); border-color: rgba(0, 229, 255, 0.16); }

/* the left edge always shows the report's status colour */
.cr-record::before {
  content: ""; position: absolute; left: 0; top: 6%; bottom: 6%; width: 2px;
  background: var(--cr-tone);
  box-shadow: 0 0 10px var(--cr-tone);
  opacity: 0.75;
  transition: opacity 220ms ease;
}
.cr-record:hover::before { opacity: 1; }

.cr-record-head {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  margin-bottom: 8px; padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}
.cr-id {
  display: inline-flex; align-items: center;
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 14px; font-weight: 700; letter-spacing: 0.06em; color: var(--cyan);
}
.cr-chip {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 5px 11px;
  border: 1px solid;
  font-size: 9px; font-weight: 800; letter-spacing: 0.2em;
  white-space: nowrap;
}
.cr-chip i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; box-shadow: 0 0 8px currentColor; }
.cr-chip.is-pending  { color: #ffd08a; border-color: rgba(255, 181, 71, 0.45); background: rgba(255, 181, 71, 0.08); }
.cr-chip.is-reviewed { color: #8ff2ff; border-color: rgba(0, 229, 255, 0.45); background: rgba(0, 229, 255, 0.08); }
.cr-chip.is-resolved { color: #9dffe9; border-color: rgba(0, 255, 213, 0.45); background: rgba(0, 255, 213, 0.08); }
.cr-chip.is-low      { color: #9dffe9; border-color: rgba(0, 255, 213, 0.4); background: rgba(0, 255, 213, 0.07); }
.cr-chip.is-moderate { color: #ffd08a; border-color: rgba(255, 181, 71, 0.45); background: rgba(255, 181, 71, 0.08); }
.cr-chip.is-high     { color: #ffb3ba; border-color: rgba(255, 92, 108, 0.5); background: rgba(255, 92, 108, 0.09); }
.cr-chip.is-plain    { color: var(--ink-2); border-color: rgba(255, 255, 255, 0.14); background: rgba(255, 255, 255, 0.03); }

.cr-field { padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.cr-field:last-child { border-bottom: 0; padding-bottom: 0; }
.cr-field-label {
  display: block; margin-bottom: 6px;
  font-size: 8.5px; font-weight: 700; letter-spacing: 0.24em; color: var(--ink-3);
}
.cr-field-text { display: block; font-size: 14px; color: var(--ink-1); line-height: 1.6; }
.cr-field-text.is-muted { color: var(--ink-3); }
.cr-field-sub { display: block; margin-top: 3px; font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 11.5px; color: var(--ink-3); }

.cr-with-icon { display: flex; align-items: center; gap: 8px; }
.cr-with-icon svg { width: 14px; height: 14px; flex: 0 0 auto; color: var(--cyan); }

/* the description can be long, so it gets its own readable block */
.cr-description {
  display: block; margin: 0;
  padding: 12px 14px;
  border-left: 2px solid rgba(0, 229, 255, 0.35);
  background: rgba(0, 229, 255, 0.035);
  font-size: 13.5px; line-height: 1.7; color: var(--ink-1);
  white-space: pre-wrap; word-break: break-word;
}
.cr-description.is-muted { color: var(--ink-3); border-left-color: rgba(255, 255, 255, 0.12); background: transparent; }

/* status dropdown — the same control as the original, restyled */
.cr-status-box {
  position: relative; display: inline-block; min-width: 190px; max-width: 100%;
  border: 1px solid var(--cr-tone);
  background: rgba(2, 10, 22, 0.6);
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  transition: box-shadow 220ms ease;
}
.cr-status-box:hover:not(.is-disabled) { box-shadow: 0 0 20px -6px var(--cr-tone); }
.cr-status-box::before {
  content: ""; position: absolute; right: 13px; top: 50%;
  width: 7px; height: 7px; margin-top: -5px;
  border-right: 1.5px solid var(--ink-2); border-bottom: 1.5px solid var(--ink-2);
  transform: rotate(45deg); pointer-events: none;
}
.cr-status-select {
  width: 100%;
  padding: 10px 34px 10px 14px;
  border: 0; background: transparent;
  color: var(--ink-1);
  font-family: inherit; font-size: 12px; font-weight: 700; letter-spacing: 0.1em;
  outline: none; appearance: none; cursor: pointer;
}
.cr-status-select:disabled { cursor: not-allowed; opacity: 0.6; }
.cr-status-select:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }
.cr-status-select option { background: #041426; color: var(--ink-1); }

.cr-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.cr-act {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  color: var(--ink-2);
  font-family: inherit; font-size: 9px; font-weight: 700; letter-spacing: 0.16em;
  white-space: nowrap; cursor: pointer;
  transition: color 200ms ease, border-color 200ms ease, background 200ms ease, box-shadow 200ms ease;
}
.cr-act svg { width: 13px; height: 13px; }
.cr-act:disabled { opacity: 0.5; cursor: not-allowed; }
.cr-act:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }
.cr-act.is-review { border-color: rgba(0, 229, 255, 0.35); color: #8ff2ff; }
.cr-act.is-review:hover:not(:disabled) { background: rgba(0, 229, 255, 0.12); border-color: rgba(0, 229, 255, 0.8); box-shadow: 0 0 18px -6px rgba(0, 229, 255, 0.6); }
.cr-act.is-resolve { border-color: rgba(0, 255, 213, 0.35); color: #9dffe9; }
.cr-act.is-resolve:hover:not(:disabled) { background: rgba(0, 255, 213, 0.12); border-color: rgba(0, 255, 213, 0.8); box-shadow: 0 0 18px -6px rgba(0, 255, 213, 0.6); }
.cr-act.is-delete { border-color: rgba(255, 92, 108, 0.3); color: #ffb3ba; }
.cr-act.is-delete:hover:not(:disabled) { background: rgba(255, 92, 108, 0.12); border-color: rgba(255, 92, 108, 0.7); box-shadow: 0 0 18px -6px rgba(255, 92, 108, 0.6); }

/* ============================================================
   DATA SEPARATION PANEL
   ============================================================ */

.cr-lanes { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); gap: 16px; align-items: stretch; margin-bottom: 20px; }
.cr-lane {
  padding: 16px 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(2, 10, 22, 0.5);
}
.cr-lane.is-community { border-color: rgba(114, 92, 255, 0.35); }
.cr-lane.is-official { border-color: rgba(0, 229, 255, 0.3); }
.cr-lane-key { display: block; font-size: 8px; font-weight: 700; letter-spacing: 0.26em; color: var(--ink-3); margin-bottom: 8px; }
.cr-lane-name { display: block; font-size: 13px; font-weight: 800; letter-spacing: 0.04em; margin-bottom: 4px; }
.cr-lane-table { display: block; font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 11px; color: var(--ink-2); }
.cr-lane-gap {
  display: grid; place-items: center;
  font-size: 8px; font-weight: 700; letter-spacing: 0.24em; color: var(--warn);
  writing-mode: vertical-rl; text-orientation: mixed;
}

.cr-info-rows { display: grid; gap: 12px; }
.cr-info-row {
  display: flex; gap: 12px; align-items: flex-start;
  font-size: 13px; line-height: 1.65; color: var(--ink-2);
}
.cr-info-row svg { width: 16px; height: 16px; flex: 0 0 auto; margin-top: 3px; color: var(--cyan); }
.cr-info-row strong { color: var(--ink-1); }

/* ============================================================
   RESPONSIVE
   ============================================================ */

@media (max-width: 1040px) {
  .cr-hero { grid-template-columns: 1fr; }
  .cr-core-wrap { max-width: 280px; order: -1; }
}

@media (max-width: 760px) {
  .cr-header { padding: 12px 0; }
  .cr-brand-mark { width: 36px; height: 36px; }
  .cr-brand-name { font-size: 12px; }
  .cr-back span { display: none; }
  .cr-back { padding: 11px 13px; }
  .cr-stat-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cr-filter, .cr-filter.is-narrow { flex: 1 1 100%; }
  .cr-tool-btn { justify-content: center; }
  .cr-lanes { grid-template-columns: 1fr; }
  .cr-lane-gap { writing-mode: horizontal-tb; padding: 2px 0; }
  .cr-env-motes, .cr-env-lines { display: none; }
}

/* ============================================================
   REDUCED MOTION
   ============================================================ */

@media (prefers-reduced-motion: reduce) {
  .cr-root *, .cr-root *::before, .cr-root *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
  .cr-stage { opacity: 1 !important; transform: none !important; }
  .cr-env-motes, .cr-env-lines { display: none; }
}
`;

// Renders the stylesheet above. Called once, near the top of the page markup.
function ReportStyles() {
  return <style>{CR_CSS}</style>;
}

/* ══════════════════════════════════════════════════════════════════════════
   SECTION 2 — ICONS  (inline SVG, no package, no emoji)
   ══════════════════════════════════════════════════════════════════════════ */

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };

const IconReports = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path {...S} d="M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1Z" />
    <rect {...S} x="4.5" y="5" width="15" height="16" rx="2" />
    <path {...S} d="M8.5 11h7M8.5 15h7" />
  </svg>
);
const IconBack = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path {...S} strokeWidth="1.8" d="M20 12H6M11 6.5 5.5 12 11 17.5" />
  </svg>
);
const IconRefresh = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path {...S} d="M20 11A8 8 0 1 0 18.6 16" />
    <path {...S} d="M20 5v6h-6" />
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle {...S} cx="11" cy="11" r="7" />
    <path {...S} d="m20.5 20.5-4.2-4.2" />
  </svg>
);
const IconClose = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path {...S} strokeWidth="2" d="M18 6 6 18M6 6l12 12" />
  </svg>
);
const IconWarn = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path {...S} d="M12 3.6 21.4 20H2.6L12 3.6Z" />
    <path {...S} strokeWidth="1.9" d="M12 9.4v4.6" />
    <circle cx="12" cy="17" r="1.05" fill="currentColor" stroke="none" />
  </svg>
);
const IconEye = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path {...S} d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12Z" />
    <circle {...S} cx="12" cy="12" r="2.9" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle {...S} cx="12" cy="12" r="9.2" />
    <path {...S} strokeWidth="1.9" d="m8 12.4 2.6 2.6L16.4 9" />
  </svg>
);
const IconTrash = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path {...S} d="M4 7h16M9.5 7V4.5h5V7M6.5 7l.8 12.5h9.4L17.5 7" />
  </svg>
);
const IconPin = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path {...S} d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
    <circle {...S} cx="12" cy="9.5" r="2.4" />
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect {...S} x="3.5" y="5" width="17" height="15.5" rx="2" />
    <path {...S} d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);
const IconInbox = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path {...S} d="M3 13h5l1.5 2.5h5L16 13h5" />
    <path {...S} d="M5.5 5.5 3 13v5a1.5 1.5 0 0 0 1.5 1.5h15A1.5 1.5 0 0 0 21 18v-5l-2.5-7.5a1.5 1.5 0 0 0-1.4-1H6.9a1.5 1.5 0 0 0-1.4 1Z" />
  </svg>
);
const IconInfo = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle {...S} cx="12" cy="12" r="9.2" />
    <path {...S} d="M12 11v5.5" />
    <circle cx="12" cy="7.8" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════
   SECTION 3 — DECORATIVE ENVIRONMENT + CORE
   These are fixed lists, not random(): random values would reshuffle on
   every render.
   ══════════════════════════════════════════════════════════════════════════ */

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
    <div className="cr-env" aria-hidden="true">
      <div className="cr-env-deep" />
      <div className="cr-env-grid" />
      <div className="cr-env-lines">
        {LINES.map((l, i) => (
          <i key={i} style={{ top: `${l.top}%`, animationDuration: `${l.duration}s`, animationDelay: `${l.delay}s` }} />
        ))}
      </div>
      <div className="cr-env-motes">
        {MOTES.map((m, i) => (
          <i key={i} style={{ left: `${m.left}%`, width: m.size, height: m.size, animationDuration: `${m.duration}s`, animationDelay: `${m.delay}s` }} />
        ))}
      </div>
      <div className="cr-env-grade" />
    </div>
  );
}

// A CSS-only wireframe sphere with broadcast rings, built like the cores on
// the other admin pages so the whole admin area feels like one system.
const MERIDIANS = Array.from({ length: 8 }, (_, i) => i * 22.5);

function SignalCore() {
  return (
    <div className="cr-core-wrap" aria-hidden="true">
      <div className="cr-core-glow" />
      <div className="cr-core-orbit" />
      <div className="cr-core">
        <div className="cr-core-body" />
        {MERIDIANS.map((deg) => (
          <div key={deg} className="cr-core-meridian" style={{ transform: `rotateY(${deg}deg)` }} />
        ))}
      </div>
      <span className="cr-core-ring" />
      <span className="cr-core-ring" />
      <span className="cr-core-ring" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SECTION 4 — THE COMPONENT
   From here down is your original logic. Every state variable and function
   keeps its original name and job; only the JSX it returns has changed.
   ══════════════════════════════════════════════════════════════════════════ */

function AdminCommunityReports() {

    // ========================================================
    // COMPONENT STATE
    // ========================================================

    // Stores all community reports received from the backend.
    const [reports, setReports] = useState([]);

    // Search text and status filter typed or chosen by the admin.
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Loading and error states.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Remembers which report is being changed or deleted right now, so its
    // buttons are disabled and it cannot be clicked twice.
    const [processingId, setProcessingId] = useState(null);

    // useNavigate sends the admin back to the Admin Command Center without a
    // full page reload. This is the only new hook compared with your original.
    const navigate = useNavigate();

    // Visual-only: releases the page's entry animation. It never touches the
    // backend or any report data.
    const [ready, setReady] = useState(false);


    // ========================================================
    // COMMUNITY REPORT API OPERATIONS
    // ========================================================

    // Load all community reports.
    // Endpoint: GET http://localhost:5000/api/community-reports
    // On success: store the array in `reports` (or an empty array if the
    // backend ever returns something that is not an array).
    // On failure: show the same error message as before.
    const loadReports = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/admin/community-reports"
            );

            setReports(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (err) {
            console.error(
                "Error loading community reports:",
                err
            );

            setError(
                "Unable to load community reports."
            );
        } finally {
            setLoading(false);
        }
    };

    // Load the reports when the page opens, so the admin sees the current
    // data immediately without pressing a button.
    useEffect(() => {
        loadReports();
    }, []);

    // Release the entry animation on the next frame. Reduced-motion users are
    // handled in the stylesheet, so no JavaScript check is needed.
    useEffect(() => {
        const id = requestAnimationFrame(() => setReady(true));
        return () => cancelAnimationFrame(id);
    }, []);

    // Update the status of one community report.
    // Endpoint: PUT http://localhost:5000/api/community-reports/{reportId}/status
    // Body sent: { status } — one of Pending, Reviewed or Resolved.
    // On success: reload the list so the page shows the saved value.
    // On failure: show the same error message as before.
    const updateStatus = async (
        reportId,
        status
    ) => {
        try {
            setProcessingId(reportId);
            setError("");

            await axios.put(
               `http://localhost:5000/api/admin/community-reports/${reportId}/status`,
                {
                    status,
                }
            );

            await loadReports();
        } catch (err) {
            console.error(
                "Error updating report:",
                err
            );

            setError(
                "Unable to update the report status."
            );
        } finally {
            setProcessingId(null);
        }
    };

    // Delete one community report.
    // A confirm() dialog is shown first because a deleted report cannot be
    // recovered. Nothing is sent to the backend unless the admin agrees.
    // Endpoint: DELETE http://localhost:5000/api/community-reports/{reportId}
    // On success: reload the list. On failure: show the same error message.
    const deleteReport = async (reportId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this community report?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setProcessingId(reportId);
            setError("");

            await axios.delete(
               `http://localhost:5000/api/admin/community-reports/${reportId}`
            );

            await loadReports();
        } catch (err) {
            console.error(
                "Error deleting report:",
                err
            );

            setError(
                "Unable to delete the community report."
            );
        } finally {
            setProcessingId(null);
        }
    };


    // ========================================================
    // DISPLAY HELPERS, FILTERING AND STATISTICS
    // ========================================================

    // Turn a database date into a readable date, or "N/A" when the value is
    // missing or is not a valid date.
    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "N/A";
        }

        return parsedDate.toLocaleDateString();
    };

    // Filter the reports by the search text and by the chosen status.
    // useMemo means the filtering only runs again when the reports, the
    // search text or the status filter actually change.
    const filteredReports = useMemo(() => {
        const searchText =
            search.trim().toLowerCase();

        return reports.filter((report) => {
            const reportId = String(
                report.REPORT_ID || ""
            ).toLowerCase();

            const stationId = String(
                report.STATION_ID || ""
            ).toLowerCase();

            const stationName = String(
                report.STATION_NAME || ""
            ).toLowerCase();

            const reportType = String(
                report.REPORT_TYPE || ""
            ).toLowerCase();

            const description = String(
                report.DESCRIPTION || ""
            ).toLowerCase();

            const severity = String(
                report.SEVERITY || ""
            ).toLowerCase();

            const matchesSearch =
                searchText === "" ||
                reportId.includes(searchText) ||
                stationId.includes(searchText) ||
                stationName.includes(searchText) ||
                reportType.includes(searchText) ||
                description.includes(searchText) ||
                severity.includes(searchText);

            const matchesStatus =
                statusFilter === "" ||
                report.STATUS === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [
        reports,
        search,
        statusFilter,
    ]);

    // Report statistics. Each number is counted from the real reports array.
    const totalReports = reports.length;

    const pendingReports =
        reports.filter(
            (report) =>
                report.STATUS === "Pending"
        ).length;

    const reviewedReports =
        reports.filter(
            (report) =>
                report.STATUS === "Reviewed"
        ).length;

    const resolvedReports =
        reports.filter(
            (report) =>
                report.STATUS === "Resolved"
        ).length;

    // Clear the search text and the status filter.
    const clearFilters = () => {
        setSearch("");
        setStatusFilter("");
    };

    // Visual-only: turns a STATUS or SEVERITY value into a CSS class name such
    // as "is-pending". It never changes the value that is sent to the backend.
    const toneClass = (value) => "is-" + String(value || "").toLowerCase();


    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className={`cr-root${ready ? " is-ready" : ""}`}>
            <ReportStyles />
            <Environment />

            <div className="cr-shell">

                {/* ============================================
                    COMMAND CENTER HEADER
                    Identity on the left. On the right, the button that
                    returns to the Admin Command Center with navigate("/admin").
                ============================================ */}
                <header className="cr-header cr-stage" style={{ "--cr-delay": "200ms" }}>
                    <div className="cr-brand">
                        <span className="cr-brand-mark" aria-hidden="true"><IconReports /></span>
                        <div>
                            <p className="cr-brand-name">TOXICTIDE</p>
                            <p className="cr-brand-sub">COMMUNITY REPORT MODULE</p>
                            <p className="cr-online"><i className="cr-dot" />SYSTEM ONLINE</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="cr-back"
                        onClick={() => navigate("/admin")}
                    >
                        <IconBack />
                        <span>ADMIN COMMAND CENTER</span>
                    </button>
                </header>

                {/* ============================================
                    COMMUNITY REPORT HERO
                    Explains the page and shows the four real counts,
                    all calculated from the reports array.
                ============================================ */}
                <section className="cr-hero">
                    <div>
                        <p className="cr-eyebrow cr-stage" style={{ "--cr-delay": "380ms" }}>
                            ADMINISTRATION
                        </p>

                        <h1 className="cr-hero-title cr-stage" style={{ "--cr-delay": "460ms" }}>
                            COMMUNITY<br />REPORTS
                        </h1>

                        <p className="cr-hero-note cr-stage" style={{ "--cr-delay": "580ms" }}>
                            Review observations submitted by the public. Community reports
                            are stored separately from official monitoring data.
                        </p>

                        <div className="cr-stat-row cr-stage" style={{ "--cr-delay": "660ms" }}>
                            <div className="cr-stat" style={{ "--cr-tone": "var(--cyan)" }}>
                                <span className="cr-stat-num">{totalReports}</span>
                                <span className="cr-stat-label">TOTAL REPORTS</span>
                            </div>
                            <div className="cr-stat" style={{ "--cr-tone": "var(--warn)" }}>
                                <span className="cr-stat-num">{pendingReports}</span>
                                <span className="cr-stat-label">PENDING</span>
                            </div>
                            <div className="cr-stat" style={{ "--cr-tone": "var(--electric)" }}>
                                <span className="cr-stat-num">{reviewedReports}</span>
                                <span className="cr-stat-label">REVIEWED</span>
                            </div>
                            <div className="cr-stat" style={{ "--cr-tone": "var(--aqua)" }}>
                                <span className="cr-stat-num">{resolvedReports}</span>
                                <span className="cr-stat-label">RESOLVED</span>
                            </div>
                        </div>

                        {/* Status HUD — only states the page can verify. The report
                            feed shows what the last request actually did. */}
                        <div className="cr-hud-row cr-stage" style={{ "--cr-delay": "740ms" }}>
                            <div className="cr-hud-chip">
                                <i className={`cr-dot ${error ? "is-danger" : loading ? "is-warn" : ""}`} />
                                <span className="cr-hud-chip-text">
                                    <span className="cr-hud-chip-key">REPORT FEED</span>
                                    <span className="cr-hud-chip-val">
                                        {error ? "UNAVAILABLE" : loading ? "SYNCING" : "LOADED"}
                                    </span>
                                </span>
                            </div>
                            <div className="cr-hud-chip">
                                <i className="cr-dot is-violet" />
                                <span className="cr-hud-chip-text">
                                    <span className="cr-hud-chip-key">DATA SEPARATION</span>
                                    <span className="cr-hud-chip-val">ENFORCED</span>
                                </span>
                            </div>
                            <div className="cr-hud-chip">
                                <i className="cr-dot is-cyan" />
                                <span className="cr-hud-chip-text">
                                    <span className="cr-hud-chip-key">ADMIN ACCESS</span>
                                    <span className="cr-hud-chip-val">AUTHORIZED</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="cr-stage" style={{ "--cr-delay": "700ms" }}>
                        <SignalCore />
                    </div>
                </section>

                {/* ============================================
                    SUBMITTED REPORTS
                    Search, status filter, refresh, and the report list.
                    Loading, no-reports, no-match and populated states
                    are each handled explicitly below.
                ============================================ */}
                <section className="cr-section">
                    <div className="cr-panel cr-stage" style={{ "--cr-delay": "900ms" }}>

                        <div className="cr-panel-head">
                            <h2 className="cr-panel-title">Submitted reports</h2>
                            <p className="cr-panel-note">Review reports and update their current status.</p>
                        </div>

                        {/* Error message — same `error` state as before, with
                            the same wording, in a new presentation. */}
                        {error && (
                            <div className="cr-error" role="alert">
                                <IconWarn />
                                <span>
                                    <span className="cr-error-head">COMMUNITY REPORT ERROR</span>
                                    {error}
                                </span>
                            </div>
                        )}

                        {/* Filters and refresh */}
                        <div className="cr-filters">

                            <div className="cr-filter">
                                <label className="cr-filter-label" htmlFor="report-search">SEARCH REPORTS</label>
                                <div className="cr-shell-box">
                                    <span className="cr-search-icon"><IconSearch /></span>
                                    <input
                                        id="report-search"
                                        type="text"
                                        className="cr-input"
                                        placeholder="Search station, report type, description..."
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="cr-filter is-narrow">
                                <label className="cr-filter-label" htmlFor="report-status">STATUS</label>
                                <div className="cr-shell-box has-select">
                                    <select
                                        id="report-status"
                                        className="cr-select"
                                        value={statusFilter}
                                        onChange={(event) => setStatusFilter(event.target.value)}
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Reviewed">Reviewed</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </div>
                            </div>

                            {(search || statusFilter) && (
                                <button type="button" className="cr-tool-btn is-danger" onClick={clearFilters}>
                                    <IconClose /> CLEAR FILTERS
                                </button>
                            )}

                            {/* Refresh — still calls loadReports and is still
                                disabled while a load is in progress. */}
                            <button
                                type="button"
                                className={`cr-tool-btn${loading ? " is-spinning" : ""}`}
                                onClick={loadReports}
                                disabled={loading}
                            >
                                <IconRefresh />
                                {loading ? "REFRESHING..." : "REFRESH REPORTS"}
                            </button>

                        </div>

                        {/* Result information */}
                        {!loading && reports.length > 0 && (
                            <p className="cr-result-line">
                                Showing <strong>{filteredReports.length}</strong> of{" "}
                                <strong>{reports.length}</strong> reports
                            </p>
                        )}

                        {loading ? (

                            /* ---- loading state ---- */
                            <div className="cr-loading">
                                <div className="cr-loading-ring"><i /><i /></div>
                                <p className="cr-loading-text">LOADING COMMUNITY REPORTS</p>
                                <div className="cr-loading-scan" aria-hidden="true" />
                                <p className="cr-loading-sub">Please wait while the latest reports are retrieved.</p>
                            </div>

                        ) : reports.length === 0 ? (

                            /* ---- no reports at all ---- */
                            <div className="cr-empty">
                                <IconInbox />
                                <p className="cr-empty-title">NO COMMUNITY REPORTS</p>
                                <p className="cr-empty-sub">No community reports have been submitted yet.</p>
                            </div>

                        ) : filteredReports.length === 0 ? (

                            /* ---- reports exist, but none match the filters ---- */
                            <div className="cr-empty">
                                <IconSearch />
                                <p className="cr-empty-title">NO MATCHING REPORTS</p>
                                <p className="cr-empty-sub">No reports match the current search or status filter.</p>
                                <button type="button" className="cr-tool-btn" onClick={clearFilters}>
                                    CLEAR FILTERS
                                </button>
                            </div>

                        ) : (

                            /* ---- populated report list ----
                               .map() turns each report into one card. Each card's
                               key is report.REPORT_ID, which is unique. Every field
                               is stacked: a small label, then the value under it.
                               A card's left edge takes its colour from the report's
                               status: amber for Pending, cyan for Reviewed, aqua
                               for Resolved. */
                            <div className="cr-records">
                                {filteredReports.map((report) => {
                                    // True while this one report is being updated
                                    // or deleted.
                                    const isProcessing = processingId === report.REPORT_ID;
                                    const currentStatus = report.STATUS || "Pending";

                                    return (
                                        <article
                                            key={report.REPORT_ID}
                                            className={`cr-record ${toneClass(currentStatus)}`}
                                        >

                                            <div className="cr-record-head">
                                                <span className="cr-id">#{report.REPORT_ID}</span>
                                                <span className={`cr-chip ${toneClass(currentStatus)}`}>
                                                    <i />{currentStatus.toUpperCase()}
                                                </span>
                                            </div>

                                            {/* station — a report may have no linked station,
                                                so "Not linked" is shown in that case */}
                                            <div className="cr-field">
                                                <span className="cr-field-label">STATION</span>
                                                <span className="cr-field-text cr-with-icon">
                                                    <IconPin />
                                                    {report.STATION_NAME || "Not linked"}
                                                </span>
                                                {report.STATION_ID && (
                                                    <span className="cr-field-sub">{report.STATION_ID}</span>
                                                )}
                                            </div>

                                            <div className="cr-field">
                                                <span className="cr-field-label">REPORT DATE</span>
                                                <span className="cr-field-text cr-with-icon">
                                                    <IconCalendar />
                                                    {formatDate(report.REPORT_DATE)}
                                                </span>
                                            </div>

                                            <div className="cr-field">
                                                <span className="cr-field-label">REPORT TYPE</span>
                                                {report.REPORT_TYPE ? (
                                                    <span className="cr-chip is-plain">{report.REPORT_TYPE}</span>
                                                ) : (
                                                    <span className="cr-field-text is-muted">Not recorded</span>
                                                )}
                                            </div>

                                            <div className="cr-field">
                                                <span className="cr-field-label">DESCRIPTION</span>
                                                <p className={`cr-description${report.DESCRIPTION ? "" : " is-muted"}`}>
                                                    {report.DESCRIPTION || "No description recorded"}
                                                </p>
                                            </div>

                                            <div className="cr-field">
                                                <span className="cr-field-label">SEVERITY</span>
                                                {report.SEVERITY ? (
                                                    <span className={`cr-chip ${toneClass(report.SEVERITY)}`}>
                                                        {report.SEVERITY.toUpperCase()}
                                                    </span>
                                                ) : (
                                                    <span className="cr-field-text is-muted">Not recorded</span>
                                                )}
                                            </div>

                                            {/* status dropdown — choosing a value calls
                                                updateStatus straight away, as before */}
                                            <div className="cr-field">
                                                <label className="cr-field-label" htmlFor={`status-${report.REPORT_ID}`}>
                                                    STATUS
                                                </label>
                                                <div className={`cr-status-box${isProcessing ? " is-disabled" : ""}`}>
                                                    <select
                                                        id={`status-${report.REPORT_ID}`}
                                                        className="cr-status-select"
                                                        value={currentStatus}
                                                        disabled={isProcessing}
                                                        onChange={(event) =>
                                                            updateStatus(report.REPORT_ID, event.target.value)
                                                        }
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Reviewed">Reviewed</option>
                                                        <option value="Resolved">Resolved</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="cr-field">
                                                <span className="cr-field-label">SUBMITTED</span>
                                                <span className="cr-field-text cr-with-icon">
                                                    <IconCalendar />
                                                    {formatDate(report.CREATED_AT)}
                                                </span>
                                            </div>

                                            {/* actions — Review and Resolve call updateStatus,
                                                Delete calls deleteReport (which asks first) */}
                                            <div className="cr-field">
                                                <span className="cr-field-label">ACTIONS</span>
                                                <div className="cr-actions">
                                                    <button
                                                        type="button"
                                                        className="cr-act is-review"
                                                        disabled={isProcessing}
                                                        onClick={() => updateStatus(report.REPORT_ID, "Reviewed")}
                                                    >
                                                        <IconEye /> {isProcessing ? "UPDATING..." : "REVIEW"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="cr-act is-resolve"
                                                        disabled={isProcessing}
                                                        onClick={() => updateStatus(report.REPORT_ID, "Resolved")}
                                                    >
                                                        <IconCheck /> RESOLVE
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="cr-act is-delete"
                                                        disabled={isProcessing}
                                                        onClick={() => deleteReport(report.REPORT_ID)}
                                                    >
                                                        <IconTrash /> DELETE
                                                    </button>
                                                </div>
                                            </div>

                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* ============================================
                    COMMUNITY DATA HANDLING
                    Reflects the project PDF: community reports live in
                    COMMUNITY_REPORTS, official measurements live in
                    CYANOTOXINS_MEASUREMENTS, and the two never mix.
                ============================================ */}
                <section className="cr-section">
                    <div className="cr-panel cr-stage" style={{ "--cr-delay": "1100ms" }}>
                        <div className="cr-panel-head">
                            <h2 className="cr-panel-title">Community data handling</h2>
                            <p className="cr-panel-note">How community reports relate to official monitoring data.</p>
                        </div>

                        <div className="cr-lanes">
                            <div className="cr-lane is-community">
                                <span className="cr-lane-key">PUBLIC OBSERVATIONS</span>
                                <span className="cr-lane-name">Community reports</span>
                                <span className="cr-lane-table">COMMUNITY_REPORTS</span>
                            </div>
                            <div className="cr-lane-gap" aria-hidden="true">SEPARATE</div>
                            <div className="cr-lane is-official">
                                <span className="cr-lane-key">OFFICIAL MONITORING</span>
                                <span className="cr-lane-name">Cyanotoxin measurements</span>
                                <span className="cr-lane-table">CYANOTOXINS_MEASUREMENTS</span>
                            </div>
                        </div>

                        <div className="cr-info-rows">
                            <div className="cr-info-row">
                                <IconInfo />
                                <span>
                                    Community reports contain observations submitted by users, such as unusual
                                    water colour, algal blooms, dead fish, unusual odour, or animal illness.
                                    These observations are kept separate from official cyanotoxin measurements
                                    and do not automatically change the water-safety classification.
                                </span>
                            </div>
                            <div className="cr-info-row">
                                <IconInfo />
                                <span>
                                    Changing a report status does not modify cyanotoxin measurements or safety
                                    standards. The administrator workflow supports the statuses{" "}
                                    <strong>Pending</strong>, <strong>Reviewed</strong> and{" "}
                                    <strong>Resolved</strong>.
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}

export default AdminCommunityReports;
