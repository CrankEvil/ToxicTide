import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// ============================================
// ICONS — no extra deps
// ============================================
const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
);
const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
);
const IconDroplet = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69s5.66 5.6 8.5 10.14A8.5 8.5 0 0 1 12 21.5a8.5 8.5 0 0 1-8.5-8.67C6.34 8.29 12 2.69 12 2.69z" /></svg>
);
const IconMapPin = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);
const IconMap = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>
);
const IconBeaker = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H15M10 3v6l-4 9a2 2 0 0 0 1.8 3h8.4a2 2 0 0 0 1.8-3l-4-9V3" /><path d="M8 14h8" /></svg>
);
const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);
const IconDatabase = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>
);
const IconAlert = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
);
const IconSpark = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.88 5.12L19 10l-5.12 1.88L12 17l-1.88-5.12L5 10l5.12-1.88L12 3zM19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2zM6 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" /></svg>
);


function DataCenter() {

    // Allows the Data Center cards to navigate
    // to their individual data pages.
    const navigate = useNavigate();


    // ============================================
    // DATABASE RECORD COUNTS
    // ============================================

    const [counts, setCounts] = useState({
        waterTypes: 0,
        counties: 0,
        stations: 0,
        measurements: 0,
        standards: 0
    });


    // ============================================
    // PAGE STATE
    // ============================================

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ============================================
    // LOAD DATABASE COUNTS
    // ============================================

    /*
     * FAST PATH
     *
     * The Data Center only displays five record counts, so it
     * now asks the backend for those five numbers directly.
     *
     * Previously it downloaded all five public tables in full -
     * including the entire measurement history - and then called
     * .length on each one. The numbers shown are identical, but
     * five large requests are replaced by one tiny one.
     */
    const loadCounts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "https://toxictide-backend.onrender.com/api/stats"
            );

            if (!response.ok) {
                throw new Error("Failed to load database information");
            }

            const stats = await response.json();

            if (!stats || typeof stats !== "object") {
                throw new Error("Unexpected statistics format");
            }

            setCounts({
                waterTypes: Number(stats.waterTypes) || 0,
                counties: Number(stats.counties) || 0,
                stations: Number(stats.stations) || 0,
                measurements: Number(stats.measurements) || 0,
                standards: Number(stats.standards) || 0
            });

        } catch (err) {

            /*
             * SAFETY NET
             *
             * If the statistics endpoint is not available - for
             * example the frontend is deployed before the backend
             * - fall back to the original behaviour and count the
             * five public tables on the client instead. The page
             * keeps working either way.
             */
            console.warn(
                "Using legacy Data Center counts:",
                err
            );

            await loadCountsLegacy();

        } finally {
            setLoading(false);
        }
    };


    /*
     * FALLBACK PATH
     *
     * This is the original Data Center loading logic, kept
     * unchanged so the page still works if /api/stats is
     * unavailable.
     */
    const loadCountsLegacy = async () => {
        try {
            setLoading(true);
            setError("");

            // Load the five public data sections
            // used by the Data Center.
            const [
                waterTypesResponse,
                countiesResponse,
                stationsResponse,
                measurementsResponse,
                standardsResponse
            ] = await Promise.all([
                fetch("https://toxictide-backend.onrender.com/api/water-types"),
                fetch("https://toxictide-backend.onrender.com/api/counties"),
                fetch("https://toxictide-backend.onrender.com/api/stations"),
                fetch("https://toxictide-backend.onrender.com/api/measurements/all"),
                fetch("https://toxictide-backend.onrender.com/api/safety-standards")
            ]);

            // Make sure all API requests succeeded.
            if (
                !waterTypesResponse.ok ||
                !countiesResponse.ok ||
                !stationsResponse.ok ||
                !measurementsResponse.ok ||
                !standardsResponse.ok
            ) {
                throw new Error("Failed to load database information");
            }

            // Convert API responses to JavaScript values.
            const waterTypes = await waterTypesResponse.json();
            const counties = await countiesResponse.json();
            const stations = await stationsResponse.json();
            const measurements = await measurementsResponse.json();
            const standards = await standardsResponse.json();

            // Only count actual array responses.
            setCounts({
                waterTypes: Array.isArray(waterTypes) ? waterTypes.length : 0,
                counties: Array.isArray(counties) ? counties.length : 0,
                stations: Array.isArray(stations) ? stations.length : 0,
                measurements: Array.isArray(measurements) ? measurements.length : 0,
                standards: Array.isArray(standards) ? standards.length : 0
            });

        } catch (err) {
            console.error("Failed to load Data Center:", err);
            setError("Unable to load database information.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCounts();
    }, []);


    // ============================================
    // DATA CENTER SECTIONS
    // ============================================

    const dataSections = [
        {
            title: "Water Types",
            description: "Explore the different types of water bodies represented in the monitoring dataset.",
            count: counts.waterTypes,
            label: "water types",
            path: "/data/water-types",
            icon: "💧"
        },
        {
            title: "Counties",
            description: "Browse the counties associated with ToxicTide monitoring locations.",
            count: counts.counties,
            label: "counties",
            path: "/data/counties",
            icon: "📍"
        },
        {
            title: "Monitoring Stations",
            description: "Explore official monitoring locations, water types, coordinates, and station information.",
            count: counts.stations,
            label: "stations",
            path: "/data/stations",
            icon: "🗺️"
        },
        {
            title: "Cyanotoxin Measurements",
            description: "View recorded microcystin concentrations collected from monitoring stations.",
            count: counts.measurements,
            label: "measurements",
            path: "/data/measurements",
            icon: "🧪"
        },
        {
            title: "Safety Standards",
            description: "Review the thresholds and advisories used by ToxicTide to interpret water safety.",
            count: counts.standards,
            label: "standards",
            path: "/data/safety-standards",
            icon: "🛡️"
        }
    ];

    const CARD_CONFIG = {
        "Water Types": { accent: "#0891b2", light: "#ecfeff", Icon: IconDroplet, grad: "linear-gradient(135deg,#06b6d4,#0891b2)" },
        "Counties": { accent: "#7c3aed", light: "#f5f3ff", Icon: IconMapPin, grad: "linear-gradient(135deg,#8b5cf6,#6d28d9)" },
        "Monitoring Stations": { accent: "#059669", light: "#ecfdf5", Icon: IconMap, grad: "linear-gradient(135deg,#10b981,#059669)" },
        "Cyanotoxin Measurements": { accent: "#d97706", light: "#fffbeb", Icon: IconBeaker, grad: "linear-gradient(135deg,#f59e0b,#d97706)" },
        "Safety Standards": { accent: "#2563eb", light: "#eff6ff", Icon: IconShield, grad: "linear-gradient(135deg,#3b82f6,#1d4ed8)" },
    };

    const totalRecords = Object.values(counts).reduce((a, b) => a + b, 0);


    // ============================================
    // PAGE
    // ============================================

    return (
        <div className="dc-page">
            <style>{`
                .dc-page {
                    min-height: 100vh;
                    background:
                        radial-gradient(1200px 600px at 0% -10%, rgba(6,182,212,0.12), transparent 60%),
                        radial-gradient(1000px 500px at 100% 0%, rgba(124,58,237,0.10), transparent 55%),
                        radial-gradient(800px 400px at 50% 120%, rgba(16,185,129,0.08), transparent 60%),
                        #f8fafc;
                    padding: 28px 18px 80px;
                    font-family: 'Inter', 'Geist', system-ui, -apple-system, sans-serif;
                    color: #0f172a;
                }
                .dc-shell { max-width: 1160px; margin: 0 auto; }

                .dc-back-btn {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 9px 16px; border-radius: 999px;
                    border: 1px solid #e2e8f0; background: #fff; color: #334155;
                    font-size: 13.5px; font-weight: 600; cursor: pointer;
                    box-shadow: 0 1px 2px rgba(15,23,42,0.05);
                    transition: all .18s ease; margin-bottom: 22px;
                }
                .dc-back-btn:hover { background:#0f172a; color:#fff; border-color:#0f172a; transform: translateX(-2px); }

                .dc-hero {
                    display: flex; gap: 20px; align-items: flex-start;
                    margin-bottom: 24px; animation: dcFadeUp .5s ease both;
                }
                .dc-hero-icon {
                    width: 64px; height: 64px; border-radius: 18px; flex-shrink:0;
                    display:flex; align-items:center; justify-content:center;
                    background: linear-gradient(135deg,#0f172a,#334155);
                    color: #fff; box-shadow: 0 16px 32px -12px rgba(15,23,42,0.5);
                    position: relative;
                }
                .dc-hero-icon:after {
                    content:''; position:absolute; inset:-1px; border-radius:18px;
                    background: linear-gradient(135deg,rgba(6,182,212,0.6),rgba(124,58,237,0.5));
                    filter: blur(14px); z-index:-1; opacity:.6;
                }
                .dc-eyebrow {
                    display:inline-flex; align-items:center; gap:6px;
                    font-size:11px; font-weight:800; letter-spacing:.1em;
                    color:#475569; background:#fff; border:1px solid #e2e8f0;
                    padding:5px 10px; border-radius:999px; margin-bottom:10px;
                }
                .dc-hero h1 {
                    font-size: 36px; font-weight: 900; letter-spacing:-0.03em;
                    line-height:1.05; margin:0 0 10px 0;
                }
                .dc-hero p {
                    margin:0; color:#5a6b7c; font-size:15.5px; line-height:1.65; max-width:620px;
                }
                .dc-meta-row {
                    display:flex; flex-wrap:wrap; gap:10px; margin-top:16px;
                }
                .dc-meta-pill {
                    display:inline-flex; align-items:center; gap:7px;
                    background:#fff; border:1px solid #e7ecf0; border-radius:999px;
                    padding:7px 12px; font-size:12.5px; font-weight:700; color:#334155;
                    box-shadow:0 1px 2px rgba(15,23,42,0.04);
                }
                .dc-meta-pill b { color:#0f172a; }
                .dc-dot { width:7px; height:7px; border-radius:999px; background:#10b981; box-shadow:0 0 0 4px rgba(16,185,129,0.15); animation: dcPulse 2s infinite; }

                .dc-skeleton-grid { display:grid; grid-template-columns: repeat(auto-fit,minmax(320px,1fr)); gap:18px; margin-top:8px; }
                .dc-skeleton-card {
                    height: 204px; border-radius:20px; background:#fff; border:1px solid #eef1f4;
                    padding:22px; position:relative; overflow:hidden;
                }
                .dc-skeleton-card:before {
                    content:''; position:absolute; inset:0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
                    transform: translateX(-100%); animation: dcShimmer 1.2s infinite;
                }
                .dc-sk-line { height:12px; border-radius:999px; background:#f1f5f9; margin-bottom:12px; }
                .dc-sk-line.w60 { width:60%; } .dc-sk-line.w40 { width:40%; } .dc-sk-line.w80 { width:80%; }
                .dc-sk-circle { width:48px; height:48px; border-radius:14px; background:#f1f5f9; margin-bottom:18px; }

                .dc-state-card {
                    background:#fff; border:1px solid #e7ecf0; border-radius:18px;
                    padding:22px; display:flex; align-items:center; gap:14px;
                    box-shadow:0 1px 3px rgba(15,23,42,0.04); animation: dcFadeUp .4s ease both;
                }
                .dc-spinner { width:26px; height:26px; border-radius:999px; border:3px solid #e2e8f0; border-top-color:#0f172a; animation: dcSpin .7s linear infinite; flex-shrink:0; }
                .dc-error-card {
                    background: linear-gradient(180deg,#fff,#fff5f5); border:1px solid #fecaca;
                    border-radius:20px; padding:28px; text-align:center; animation: dcFadeUp .4s ease both;
                }
                .dc-error-icon { width:60px; height:60px; border-radius:999px; background:#fee2e2; color:#dc2626; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; }
                .dc-error-card h3 { margin:0 0 6px 0; color:#991b1b; font-size:17px; }
                .dc-error-card p { margin:0 0 18px 0; color:#b45358; font-size:14px; }
                .dc-btn-primary {
                    display:inline-flex; align-items:center; gap:8px; background:#0f172a; color:#fff;
                    border:none; padding:10px 18px; border-radius:10px; font-size:13.5px; font-weight:700; cursor:pointer; transition: all .15s ease;
                }
                .dc-btn-primary:hover { transform: translateY(-1px); box-shadow:0 10px 20px -10px rgba(15,23,42,0.6); }

                .dc-grid { display:grid; grid-template-columns: repeat(auto-fit,minmax(320px,1fr)); gap:18px; margin-bottom:26px; }
                .dc-card {
                    position:relative; background:#ffffff; border:1px solid #e7ecf0; border-radius:22px;
                    padding:22px 22px 18px; cursor:pointer; overflow:hidden;
                    box-shadow:0 1px 3px rgba(15,23,42,0.04), 0 8px 24px -18px rgba(15,23,42,0.18);
                    transition: all .22s cubic-bezier(.16,1,.3,1);
                    animation: dcFadeUp .55s ease both;
                }
                .dc-card:hover { transform: translateY(-5px); box-shadow:0 20px 40px -18px rgba(15,23,42,0.28); border-color:#d6deea; }
                .dc-card-top-accent { position:absolute; top:0; left:0; right:0; height:4px; }
                .dc-card-head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; }
                .dc-card-icon {
                    width:50px; height:50px; border-radius:14px; display:flex; align-items:center; justify-content:center;
                    border:1px solid transparent; transition: transform .22s ease;
                }
                .dc-card:hover .dc-card-icon { transform: scale(1.05) rotate(-2deg); }
                .dc-card-count-badge {
                    display:inline-flex; align-items:center; gap:6px; padding:6px 10px; border-radius:999px;
                    font-size:12px; font-weight:800; border:1px solid; background:#fff;
                }
                .dc-card h2 { margin:0 0 8px 0; font-size:18px; font-weight:800; letter-spacing:-0.01em; color:#0f172a; }
                .dc-card p { margin:0 0 18px 0; color:#677788; font-size:13.8px; line-height:1.6; min-height:44px; }
                .dc-card-foot { display:flex; align-items:center; justify-content:space-between; padding-top:14px; border-top:1px solid #f1f4f7; }
                .dc-card-foot-left { display:flex; align-items:baseline; gap:8px; }
                .dc-card-foot-left strong { font-size:22px; font-weight:900; letter-spacing:-0.02em; color:#0f172a; line-height:1; }
                .dc-card-foot-left span { font-size:12px; font-weight:700; color:#8a9aad; text-transform:uppercase; letter-spacing:.06em; }
                .dc-card-arrow {
                    width:34px; height:34px; border-radius:999px; display:flex; align-items:center; justify-content:center;
                    background:#f8fafc; border:1px solid #e9eef3; color:#334155; transition: all .22s ease;
                }
                .dc-card:hover .dc-card-arrow { background:#0f172a; color:#fff; border-color:#0f172a; transform: translateX(3px); }

                .dc-about-card {
                    background: linear-gradient(180deg,#ffffff,#fbfdff);
                    border:1px solid #e7ecf0; border-radius:22px; padding:26px 26px 22px;
                    box-shadow:0 1px 3px rgba(15,23,42,0.04); animation: dcFadeUp .65s ease both;
                    position:relative; overflow:hidden;
                }
                .dc-about-card:before {
                    content:''; position:absolute; top:0; left:0; right:0; height:1px;
                    background: linear-gradient(90deg,transparent,rgba(14,165,233,0.4),transparent);
                }
                .dc-about-head { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
                .dc-about-head h2 { margin:0; font-size:18px; font-weight:800; }
                .dc-about-card p { margin:0 0 12px 0; color:#4a5a6b; font-size:14.5px; line-height:1.75; }
                .dc-about-card p:last-child { margin-bottom:0; }
                .dc-about-list { display:flex; flex-wrap:wrap; gap:10px; margin-top:16px; }
                .dc-about-tag { display:inline-flex; align-items:center; gap:6px; background:#f8fafc; border:1px solid #eef2f7; padding:6px 10px; border-radius:999px; font-size:12px; font-weight:700; color:#5a6b7c; }

                @keyframes dcFadeUp { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }
                @keyframes dcShimmer { 100% { transform: translateX(100%); } }
                @keyframes dcSpin { to { transform: rotate(360deg); } }
                @keyframes dcPulse { 0%,100% { transform:scale(1); opacity:1; } 50% { transform:scale(1.15); opacity:.8; } }

                @media (max-width: 720px) {
                    .dc-hero { flex-direction:column; }
                    .dc-hero h1 { font-size:30px; }
                    .dc-grid { grid-template-columns:1fr; }
                    .dc-about-card { padding:20px 18px; }
                }
            `}</style>

            <div className="dc-shell">

                <button className="dc-back-btn" onClick={() => navigate("/dashboard")}>
                    <IconArrowLeft /> Back to Dashboard
                </button>

                <div className="dc-hero">
                    <div className="dc-hero-icon"><IconDatabase /></div>
                    <div>
                        <span className="dc-eyebrow"><IconSpark /> DATA CENTER • LIVE DATABASE</span>
                        <h1>ToxicTide Data Center</h1>
                        <p>Explore the real monitoring data, water classifications, safety standards, and cyanotoxin records used by ToxicTide. Missing values are shown as unavailable — never as zero.</p>
                        <div className="dc-meta-row">
                            <span className="dc-meta-pill"><span className="dc-dot" /> Live • {totalRecords.toLocaleString()} total records</span>
                            <span className="dc-meta-pill">5 collections</span>
                            <span className="dc-meta-pill">Official sources</span>
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="dc-skeleton-grid">
                        {[0,1,2,3,4].map(i => (
                            <div key={i} className="dc-skeleton-card">
                                <div className="dc-sk-circle" />
                                <div className="dc-sk-line w60" />
                                <div className="dc-sk-line w80" />
                                <div className="dc-sk-line w40" />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="dc-error-card">
                        <div className="dc-error-icon"><IconAlert /></div>
                        <h3>Unable to load database</h3>
                        <p>{error}</p>
                        <button className="dc-btn-primary" onClick={loadCounts}>Try Again</button>
                    </div>
                )}

                {!loading && !error && (
                    <div className="dc-grid">
                        {dataSections.map((section, idx) => {
                            const cfg = CARD_CONFIG[section.title];
                            const Icon = cfg.Icon;
                            return (
                                <div
                                    key={section.title}
                                    className="dc-card"
                                    style={{ animationDelay: `${idx * 70}ms` }}
                                    onClick={() => navigate(section.path)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => { if (e.key === 'Enter') navigate(section.path); }}
                                >
                                    <div className="dc-card-top-accent" style={{ background: cfg.grad }} />
                                    <div className="dc-card-head">
                                        <div className="dc-card-icon" style={{ background: cfg.light, color: cfg.accent, borderColor: cfg.accent + '22' }}>
                                            <Icon />
                                        </div>
                                        <span className="dc-card-count-badge" style={{ color: cfg.accent, borderColor: cfg.accent + '33', background: cfg.light }}>
                                            {section.count.toLocaleString()} • {section.label}
                                        </span>
                                    </div>

                                    <h2>{section.title}</h2>
                                    <p>{section.description}</p>

                                    <div className="dc-card-foot">
                                        <div className="dc-card-foot-left">
                                            <strong>{section.count.toLocaleString()}</strong>
                                            <span>{section.label}</span>
                                        </div>
                                        <div className="dc-card-arrow"><IconArrowRight /></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="dc-about-card">
                    <div className="dc-about-head">
                        <span style={{ width:36, height:36, borderRadius:10, background:'#f0f9ff', color:'#0284c7', display:'flex', alignItems:'center', justifyContent:'center' }}><IconSpark /></span>
                        <h2>About the Data</h2>
                    </div>
                    <p>
                        ToxicTide presents monitoring records obtained from official environmental datasets. Missing measurement values are displayed as unavailable rather than being treated as zero.
                    </p>
                    <p>
                        Safety results are calculated using the standards stored in the ToxicTide database and the selected intended use of the water.
                    </p>
                    <div className="dc-about-list">
                        <span className="dc-about-tag"><IconDatabase /> No zero-fill</span>
                        <span className="dc-about-tag"><IconShield /> Standards-based safety</span>
                        <span className="dc-about-tag"><IconMap /> Geo-referenced stations</span>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default DataCenter;