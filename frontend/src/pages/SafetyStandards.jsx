import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// ============================================
// ICONS
// ============================================
const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
);
const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);
const IconSearch = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const IconX = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const IconAlert = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
);
const IconInbox = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>
);
const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const IconTarget = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
);
const IconClipboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2h6a1 1 0 0 1 1 1v2H8V3a1 1 0 0 1 1-1z" /><rect x="4" y="5" width="16" height="17" rx="2" /><line x1="8" y1="11" x2="16" y2="11" /><line x1="8" y1="15" x2="16" y2="15" /></svg>
);
const IconInfo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
);
const IconBuilding = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="1" /><line x1="9" y1="6" x2="9" y2="6.01" /><line x1="15" y1="6" x2="15" y2="6.01" /><line x1="9" y1="10" x2="9" y2="10.01" /><line x1="15" y1="10" x2="15" y2="10.01" /><line x1="9" y1="14" x2="9" y2="14.01" /><line x1="15" y1="14" x2="15" y2="14.01" /></svg>
);
const IconFileText = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" /></svg>
);


function SafetyStandards() {
    const navigate = useNavigate();

    // Stores safety standards loaded from the database
    const [standards, setStandards] = useState([]);

    // Search field
    const [search, setSearch] = useState("");

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadStandards = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "https://toxictide-backend.onrender.com/api/safety-standards"
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load safety standards"
                    );
                }

                const data = await response.json();

                setStandards(
                    Array.isArray(data) ? data : []
                );
            } catch (err) {
                console.error(
                    "Safety standards loading error:",
                    err
                );

                setError(
                    "Unable to load safety standards."
                );
            } finally {
                setLoading(false);
            }
        };

        loadStandards();
    }, []);

    /*
     * Search the real database records.
     */
    const filteredStandards = useMemo(() => {
        const searchText =
            search.trim().toLowerCase();

        if (!searchText) {
            return standards;
        }

        return standards.filter((standard) => {
            const userGroup = String(
                standard.USER_GROUP || ""
            ).toLowerCase();

            const threshold = String(
                standard.THRESHOLD_UGL ?? ""
            ).toLowerCase();

            const advisory = String(
                standard.ADVISORY_MESSAGE || ""
            ).toLowerCase();

            const agency = String(
                standard.CITING_AGENCY || ""
            ).toLowerCase();

            return (
                userGroup.includes(searchText) ||
                threshold.includes(searchText) ||
                advisory.includes(searchText) ||
                agency.includes(searchText)
            );
        });
    }, [standards, search]);

    /*
     * Count the distinct user groups represented
     * in the actual database records.
     */
    const userGroupCount = useMemo(() => {
        return new Set(
            standards
                .map(
                    (standard) =>
                        standard.USER_GROUP
                )
                .filter(Boolean)
        ).size;
    }, [standards]);

    /*
     * Count standards that contain an actual
     * numeric threshold.
     */
    const thresholdCount = useMemo(() => {
        return standards.filter(
            (standard) =>
                standard.THRESHOLD_UGL !== null &&
                standard.THRESHOLD_UGL !== undefined &&
                standard.THRESHOLD_UGL !== "" &&
                Number.isFinite(
                    Number(
                        standard.THRESHOLD_UGL
                    )
                )
        ).length;
    }, [standards]);

    /*
     * Format threshold values.
     */
    const formatThreshold = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "No threshold recorded";
        }

        const numericValue = Number(value);

        if (!Number.isFinite(numericValue)) {
            return "No threshold recorded";
        }

        return `${numericValue} µg/L`;
    };

    /*
     * Convert database user-group names into
     * readable labels without changing the
     * actual stored values.
     */
    const formatUserGroup = (value) => {
        if (!value) {
            return "User group not recorded";
        }

        return String(value)
            .replace(/_/g, " ")
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };

    /*
     * Clear search.
     */
    const clearSearch = () => {
        setSearch("");
    };

    /*
     * Purely presentational — pick an accent color
     * per user group for the badge. Uses the raw
     * database value, not a transformed one, so
     * data itself is untouched.
     */
    const getGroupAccent = (value) => {
        const key = String(value || "").toLowerCase();
        if (key.includes("pet")) return { bg: "#fffbeb", color: "#b45309", border: "#fde68a" };
        if (key.includes("swim") || key.includes("famil")) return { bg: "#ecfeff", color: "#0e7490", border: "#a5f3fc" };
        if (key.includes("drink")) return { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" };
        return { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" };
    };

    return (
        <div className="ss-page">

            <style>{`
                .ss-page {
                    min-height: 100vh;
                    background:
                        radial-gradient(1200px 500px at 10% -10%, rgba(37,99,235,0.09), transparent 60%),
                        radial-gradient(1000px 500px at 100% 0%, rgba(16,185,129,0.07), transparent 55%),
                        #f6f8fa;
                    padding: 28px 18px 80px;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    color: #0f172a;
                }
                .ss-shell { max-width: 1160px; margin: 0 auto; }

                .ss-back-btn {
                    display:inline-flex; align-items:center; gap:8px; padding:9px 16px; border-radius:999px;
                    border:1px solid #e2e8f0; background:#fff; color:#334155; font-size:13.5px; font-weight:600;
                    cursor:pointer; margin-bottom:20px; transition:all .18s ease; box-shadow:0 1px 2px rgba(15,23,42,0.05);
                }
                .ss-back-btn:hover { background:#0f172a; color:#fff; border-color:#0f172a; transform:translateX(-2px); }

                .ss-header {
                    display:flex; justify-content:space-between; align-items:flex-start; gap:18px; flex-wrap:wrap;
                    margin-bottom:22px; animation: ssFadeUp .5s ease both;
                }
                .ss-header-left { display:flex; gap:16px; align-items:flex-start; }
                .ss-header-icon {
                    width:54px; height:54px; border-radius:16px; flex-shrink:0;
                    display:flex; align-items:center; justify-content:center;
                    background:linear-gradient(135deg,#3b82f6,#1d4ed8); color:#fff;
                    box-shadow:0 12px 26px -10px rgba(29,78,216,0.5);
                }
                .ss-eyebrow {
                    display:inline-block; font-size:11.5px; font-weight:800; letter-spacing:.09em;
                    color:#1d4ed8; background:#eff6ff; padding:4px 10px; border-radius:999px; margin-bottom:8px;
                }
                .ss-header h1 { font-size:27px; font-weight:800; margin:0 0 6px 0; letter-spacing:-0.02em; }
                .ss-header p { margin:0; color:#5a6b7c; font-size:14.5px; line-height:1.6; max-width:560px; }
                .ss-badge {
                    display:inline-flex; align-items:center; gap:7px; background:#fff; border:1px solid #e2e8f0;
                    padding:9px 15px; border-radius:999px; font-size:12.5px; font-weight:700; color:#334155;
                    box-shadow:0 1px 2px rgba(15,23,42,0.05); white-space:nowrap;
                }

                .ss-stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:22px; animation: ssFadeUp .55s ease both; }
                .ss-stat-card {
                    background:#fff; border:1px solid #e7ecf0; border-radius:16px; padding:18px;
                    box-shadow:0 1px 3px rgba(15,23,42,0.04); transition:transform .18s ease, box-shadow .18s ease;
                }
                .ss-stat-card:hover { transform:translateY(-3px); box-shadow:0 14px 26px -16px rgba(15,23,42,0.22); }
                .ss-stat-card strong { display:block; font-size:22px; font-weight:800; color:#0f172a; line-height:1.1; }
                .ss-stat-card span { font-size:12px; font-weight:700; color:#8a9aad; text-transform:uppercase; letter-spacing:.05em; }

                .ss-explain-card {
                    display:flex; gap:16px; background:linear-gradient(180deg,#fff,#f8fbff);
                    border:1px solid #e7ecf0; border-radius:20px; padding:24px; margin-bottom:22px;
                    box-shadow:0 1px 3px rgba(15,23,42,0.04); animation: ssFadeUp .6s ease both;
                }
                .ss-explain-icon {
                    width:48px; height:48px; border-radius:14px; flex-shrink:0;
                    background:#eff6ff; color:#1d4ed8; display:flex; align-items:center; justify-content:center;
                }
                .ss-explain-card h3 { margin:0 0 10px 0; font-size:16.5px; font-weight:800; }
                .ss-explain-card p { margin:0 0 10px 0; color:#4a5563; font-size:14px; line-height:1.7; }
                .ss-explain-card p:last-child { margin-bottom:0; }

                .ss-card {
                    background:#fff; border:1px solid #e7ecf0; border-radius:20px; padding:24px;
                    box-shadow:0 1px 3px rgba(15,23,42,0.04), 0 12px 32px -22px rgba(15,23,42,0.12);
                    margin-bottom:22px; animation: ssFadeUp .65s ease both;
                }

                .ss-section-heading {
                    display:flex; justify-content:space-between; align-items:flex-start; gap:14px; flex-wrap:wrap;
                    margin-bottom:18px; padding-bottom:18px; border-bottom:1px solid #f0f2f5;
                }
                .ss-section-heading h2 { margin:0 0 5px 0; font-size:18px; font-weight:800; }
                .ss-section-heading p { margin:0; font-size:13.5px; color:#6b7683; }
                .ss-result-count {
                    display:inline-flex; align-items:center; background:#eff6ff; color:#1d4ed8;
                    padding:6px 14px; border-radius:999px; font-size:12.5px; font-weight:800; white-space:nowrap;
                }

                .ss-filter-panel { display:flex; gap:14px; align-items:flex-end; flex-wrap:wrap; margin-bottom:20px; }
                .ss-filter-group { display:flex; flex-direction:column; gap:6px; flex:1; min-width:260px; }
                .ss-filter-group label { font-size:12.5px; font-weight:700; color:#475569; }
                .ss-search-wrap { position:relative; }
                .ss-search-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#9aa5b1; }
                .ss-input {
                    width:100%; border:1.5px solid #e2e8f0; border-radius:11px; padding:10px 14px 10px 38px;
                    font-size:14px; background:#fbfcfd; transition:all .15s ease; box-sizing:border-box;
                }
                .ss-input:focus { outline:none; border-color:#2563eb; background:#fff; box-shadow:0 0 0 4px rgba(37,99,235,0.12); }
                .ss-clear-btn {
                    display:inline-flex; align-items:center; gap:7px; background:#fef2f2; color:#b91c1c;
                    border:1px solid #fecaca; padding:10px 16px; border-radius:11px; font-size:13.5px;
                    font-weight:700; cursor:pointer; transition:all .15s ease; white-space:nowrap;
                }
                .ss-clear-btn:hover { background:#fee2e2; }

                .ss-state-block { text-align:center; padding:60px 20px; }
                .ss-spin-icon { width:44px; height:44px; margin:0 auto 16px; border-radius:999px; border:3px solid #dbeafe; border-top-color:#2563eb; animation: ssSpin .7s linear infinite; }
                .ss-state-block h3 { margin:0 0 6px 0; font-size:16px; font-weight:800; }
                .ss-state-block p { margin:0; color:#8a9aad; font-size:13.5px; }

                .ss-error-block { text-align:center; padding:46px 20px; background:#fff5f5; border:1px solid #fecaca; border-radius:16px; }
                .ss-error-icon { width:54px; height:54px; border-radius:999px; background:#fee2e2; color:#dc2626; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; }
                .ss-error-block strong { display:block; font-size:15.5px; color:#991b1b; margin-bottom:5px; }
                .ss-error-block p { margin:0 0 16px 0; color:#b45358; font-size:13.5px; }

                .ss-empty-block { text-align:center; padding:60px 20px; }
                .ss-empty-icon { width:64px; height:64px; border-radius:999px; background:#f1f5f9; color:#94a3b8; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; }
                .ss-empty-block h3 { margin:0 0 6px 0; font-size:16px; font-weight:800; }
                .ss-empty-block p { margin:0 0 18px 0; color:#8a9aad; font-size:13.5px; }

                .ss-btn-dark {
                    display:inline-flex; align-items:center; gap:8px; background:#0f172a; color:#fff; border:none;
                    padding:10px 18px; border-radius:10px; font-size:13.5px; font-weight:700; cursor:pointer; transition:all .15s ease;
                }
                .ss-btn-dark:hover { transform:translateY(-1px); box-shadow:0 10px 20px -10px rgba(15,23,42,0.6); }

                .ss-table-wrapper { overflow-x:auto; border:1px solid #eef1f4; border-radius:14px; }
                .ss-table { width:100%; border-collapse:collapse; font-size:13.8px; min-width:820px; }
                .ss-table thead th {
                    background:#f8fafc; text-align:left; padding:13px 16px; font-size:11px; font-weight:800;
                    letter-spacing:.05em; text-transform:uppercase; color:#94a3b8; border-bottom:1px solid #eef1f4; white-space:nowrap;
                }
                .ss-table tbody tr { transition: background .12s ease; }
                .ss-table tbody tr:hover { background:#f8faff; }
                .ss-table tbody tr:not(:last-child) td { border-bottom:1px solid #f2f4f7; }
                .ss-table td { padding:14px 16px; color:#334155; vertical-align:top; }
                .ss-row-index { color:#c2cad4; font-weight:700; font-size:12px; width:36px; }

                .ss-group-badge {
                    display:inline-flex; align-items:center; gap:7px; padding:6px 13px; border-radius:999px;
                    font-size:12.5px; font-weight:800; border:1px solid; white-space:nowrap;
                }
                .ss-threshold-badge {
                    display:inline-flex; align-items:center; gap:6px; background:#f1f5f9; color:#0f172a;
                    padding:5px 12px; border-radius:8px; font-size:13px; font-weight:800; font-family:'SF Mono',monospace;
                    white-space:nowrap;
                }
                .ss-advisory-text { color:#334155; line-height:1.55; max-width:340px; display:inline-block; }
                .ss-agency-cell { display:flex; align-items:center; gap:6px; color:#5a6b7c; font-size:13px; }
                .ss-missing { color:#c2cad4; font-style:italic; }

                .ss-info-card {
                    display:flex; gap:16px; background:linear-gradient(180deg,#fff,#fafcff);
                    border:1px solid #e7ecf0; border-radius:20px; padding:24px;
                    box-shadow:0 1px 3px rgba(15,23,42,0.04); animation: ssFadeUp .7s ease both;
                }
                .ss-info-icon {
                    width:48px; height:48px; border-radius:14px; flex-shrink:0;
                    background:#f1f5f9; color:#475569; display:flex; align-items:center; justify-content:center;
                }
                .ss-info-card h3 { margin:0 0 10px 0; font-size:16.5px; font-weight:800; }
                .ss-info-card p { margin:0 0 10px 0; color:#4a5563; font-size:14px; line-height:1.7; }
                .ss-info-card p:last-child { margin-bottom:0; }
                .ss-info-card code {
                    background:#eff6ff; color:#1d4ed8; padding:2px 8px; border-radius:6px; font-weight:700; font-size:13.5px;
                }

                @keyframes ssFadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
                @keyframes ssSpin { to { transform: rotate(360deg); } }

                @media (max-width: 900px) {
                    .ss-stats-row { grid-template-columns:repeat(2,1fr); }
                }
                @media (max-width: 640px) {
                    .ss-header { flex-direction:column; }
                    .ss-explain-card, .ss-info-card { flex-direction:column; }
                    .ss-card { padding:18px; }
                    .ss-filter-panel { flex-direction:column; align-items:stretch; }
                }
            `}</style>

            <div className="ss-shell">

                {/* Back navigation */}
                <button type="button" className="ss-back-btn" onClick={() => navigate("/data")}>
                    <IconArrowLeft /> Back to Data Center
                </button>

                {/* Page Header */}
                <div className="ss-header">
                    <div className="ss-header-left">
                        <div className="ss-header-icon"><IconShield /></div>
                        <div>
                            <span className="ss-eyebrow">DATA CENTER</span>
                            <h1>Safety Standards</h1>
                            <p>Review the safety thresholds and advisories used by ToxicTide to interpret microcystin measurements.</p>
                        </div>
                    </div>
                    <div className="ss-badge">Safety Reference</div>
                </div>

                {/* Summary Statistics */}
                <div className="ss-stats-row">
                    <div className="ss-stat-card">
                        <strong>{standards.length}</strong>
                        <span>Safety Standards</span>
                    </div>
                    <div className="ss-stat-card">
                        <strong>{userGroupCount}</strong>
                        <span>User Groups</span>
                    </div>
                    <div className="ss-stat-card">
                        <strong>{thresholdCount}</strong>
                        <span>Recorded Thresholds</span>
                    </div>
                    <div className="ss-stat-card">
                        <strong>{filteredStandards.length}</strong>
                        <span>Displayed Records</span>
                    </div>
                </div>

                {/* Explanation Card */}
                <div className="ss-explain-card">
                    <div className="ss-explain-icon"><IconShield /></div>
                    <div>
                        <h3>How ToxicTide Uses These Standards</h3>
                        <p>
                            ToxicTide compares recorded microcystin concentrations with the safety threshold
                            associated with the selected user group and intended water use.
                        </p>
                        <p>
                            The applicable standard, advisory message, and citing agency are displayed so
                            users can understand how the safety result is determined.
                        </p>
                    </div>
                </div>

                {/* Main Standards Card */}
                <div className="ss-card">

                    {/* Section Header */}
                    <div className="ss-section-heading">
                        <div>
                            <h2>Current Standards</h2>
                            <p>Safety-standard records currently stored in the ToxicTide database.</p>
                        </div>
                        <div className="ss-result-count">
                            {filteredStandards.length} result{filteredStandards.length !== 1 ? "s" : ""}
                        </div>
                    </div>

                    {/* Search */}
                    <div className="ss-filter-panel">
                        <div className="ss-filter-group">
                            <label htmlFor="standard-search">Search Standards</label>
                            <div className="ss-search-wrap">
                                <span className="ss-search-icon"><IconSearch /></span>
                                <input
                                    id="standard-search"
                                    type="text"
                                    placeholder="Search user group, threshold, advisory or agency..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="ss-input"
                                />
                            </div>
                        </div>

                        {search && (
                            <button type="button" className="ss-clear-btn" onClick={clearSearch}>
                                <IconX /> Clear Search
                            </button>
                        )}
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="ss-state-block">
                            <div className="ss-spin-icon" />
                            <h3>Loading safety standards</h3>
                            <p>Please wait while ToxicTide retrieves the current database records.</p>
                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="ss-error-block">
                            <div className="ss-error-icon"><IconAlert /></div>
                            <strong>Unable to load safety standards</strong>
                            <p>{error}</p>
                            <button type="button" className="ss-btn-dark" onClick={() => window.location.reload()}>
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && filteredStandards.length === 0 && (
                        <div className="ss-empty-block">
                            <div className="ss-empty-icon"><IconInbox /></div>
                            <h3>No standards found</h3>
                            <p>No safety-standard records match your current search.</p>
                            <button type="button" className="ss-btn-dark" onClick={clearSearch}>
                                Clear Search
                            </button>
                        </div>
                    )}

                    {/* Standards Table */}
                    {!loading && !error && filteredStandards.length > 0 && (
                        <div className="ss-table-wrapper">
                            <table className="ss-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>User Group</th>
                                        <th>Threshold (µg/L)</th>
                                        <th>Advisory</th>
                                        <th>Citing Agency</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStandards.map((standard, index) => {
                                        const accent = getGroupAccent(standard.USER_GROUP);
                                        return (
                                            <tr key={standard.STANDARD_ID}>
                                                <td className="ss-row-index">{index + 1}</td>

                                                <td>
                                                    <span
                                                        className="ss-group-badge"
                                                        style={{ background: accent.bg, color: accent.color, borderColor: accent.border }}
                                                    >
                                                        <IconUsers /> {formatUserGroup(standard.USER_GROUP)}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="ss-threshold-badge">
                                                        <IconTarget /> {formatThreshold(standard.THRESHOLD_UGL)}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="ss-advisory-text">
                                                        {standard.ADVISORY_MESSAGE || (
                                                            <span className="ss-missing">No advisory recorded</span>
                                                        )}
                                                    </span>
                                                </td>

                                                <td>
                                                    {standard.CITING_AGENCY ? (
                                                        <span className="ss-agency-cell">
                                                            <IconBuilding /> {standard.CITING_AGENCY}
                                                        </span>
                                                    ) : (
                                                        <span className="ss-missing">No citing agency recorded</span>
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

                {/* Database Information */}
                <div className="ss-info-card">
                    <div className="ss-info-icon"><IconFileText /></div>
                    <div>
                        <h3>About these standards</h3>
                        <p>
                            The safety standards shown above are records stored in the ToxicTide{" "}
                            <code>SAFETY_STANDARDS</code> database table.
                        </p>
                        <p>
                            Each record contains a user group, microcystin threshold, advisory message,
                            and citing agency. These records are used by the application when performing
                            water-safety comparisons.
                        </p>
                        <p>
                            The standards shown here are reference information for the application and
                            do not replace official laboratory monitoring results.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default SafetyStandards;