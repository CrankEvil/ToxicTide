import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";


// ============================================
// ICONS (inline SVG — no extra dependencies)
// ============================================

const IconArrowLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
);

const IconMap = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
    </svg>
);

const IconSearch = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const IconX = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const IconAlert = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const IconDatabase = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
);

const IconPin = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const IconFlag = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
);

const IconInbox = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
);

const IconLayers = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
    </svg>
);


function Counties() {

    const navigate = useNavigate();

    // ============================================
    // DATA
    // ============================================

    const [counties, setCounties] = useState([]);

    // ============================================
    // PAGE STATE
    // ============================================

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ============================================
    // LOAD COUNTY DATA
    // ============================================

    useEffect(() => {

        const loadCounties = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await fetch(
                    "https://toxictide-backend.onrender.com/api/counties"
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load counties"
                    );
                }

                const data = await response.json();

                setCounties(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (err) {

                console.error(
                    "Failed to load county data:",
                    err
                );

                setError(
                    "Unable to load county data."
                );

                setCounties([]);

            } finally {

                setLoading(false);

            }

        };

        loadCounties();

    }, []);


    // ============================================
    // UNIQUE STATES
    // ============================================

    const stateCount = useMemo(() => {

        return new Set(
            counties
                .map((county) => county.STATE)
                .filter(
                    (state) =>
                        state !== null &&
                        state !== undefined &&
                        String(state).trim() !== ""
                )
        ).size;

    }, [counties]);


    // ============================================
    // FILTER COUNTIES
    // ============================================

    const filteredCounties = useMemo(() => {

        const searchText =
            search.trim().toLowerCase();

        if (!searchText) {
            return counties;
        }

        return counties.filter((county) => {

            const countyCode =
                String(
                    county.COUNTY_CODE ?? ""
                ).toLowerCase();

            const state =
                String(
                    county.STATE ?? ""
                ).toLowerCase();

            return (
                countyCode.includes(searchText) ||
                state.includes(searchText)
            );

        });

    }, [counties, search]);


    // ============================================
    // CLEAR SEARCH
    // ============================================

    const clearSearch = () => {
        setSearch("");
    };


    // ============================================
    // PAGE
    // ============================================

    return (

        <div className="cty-page">

            <style>{`
                .cty-page {
                    min-height: 100vh;
                    background:
                        radial-gradient(1200px 500px at 8% -10%, rgba(14,165,233,0.10), transparent 60%),
                        radial-gradient(1000px 500px at 100% 0%, rgba(99,102,241,0.07), transparent 55%),
                        #f6f8fa;
                    padding: 32px 20px 80px;
                    font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
                    color: #0f172a;
                }

                .cty-shell {
                    max-width: 1080px;
                    margin: 0 auto;
                }

                .cty-back-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 9px 16px;
                    border: 1px solid #dfe6ec;
                    border-radius: 999px;
                    background: #ffffff;
                    color: #334155;
                    cursor: pointer;
                    font-size: 13.5px;
                    font-weight: 600;
                    margin-bottom: 22px;
                    transition: all 0.18s ease;
                    box-shadow: 0 1px 2px rgba(15,23,42,0.04);
                }
                .cty-back-btn:hover {
                    background: #0f172a;
                    color: #fff;
                    border-color: #0f172a;
                    transform: translateX(-2px);
                }

                .cty-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 18px;
                    margin-bottom: 28px;
                    animation: ctyFadeUp 0.5s ease both;
                }

                .cty-header-icon {
                    flex-shrink: 0;
                    width: 56px;
                    height: 56px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #6366f1, #4338ca);
                    color: #fff;
                    box-shadow: 0 10px 24px -8px rgba(67,56,202,0.5);
                }

                .cty-eyebrow {
                    display: inline-block;
                    font-size: 11.5px;
                    font-weight: 800;
                    letter-spacing: 0.09em;
                    color: #4338ca;
                    background: #eef2ff;
                    padding: 4px 10px;
                    border-radius: 999px;
                    margin-bottom: 8px;
                }

                .cty-header h1 {
                    font-size: 28px;
                    font-weight: 800;
                    margin: 0 0 8px 0;
                    letter-spacing: -0.02em;
                }

                .cty-header p {
                    margin: 0;
                    color: #55636f;
                    font-size: 15px;
                    line-height: 1.65;
                    max-width: 640px;
                }

                /* ===== STATE MESSAGES ===== */

                .cty-state-card {
                    background: #fff;
                    border: 1px solid #e7ecf0;
                    border-radius: 18px;
                    padding: 28px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    animation: ctyFadeUp 0.4s ease both;
                    box-shadow: 0 1px 3px rgba(15,23,42,0.04);
                }

                .cty-spinner-lg {
                    width: 30px; height: 30px;
                    border-radius: 999px;
                    border: 3px solid #e0e7ff;
                    border-top-color: #4f46e5;
                    animation: ctySpin 0.7s linear infinite;
                    flex-shrink: 0;
                }

                .cty-state-card strong { display: block; font-size: 15.5px; margin-bottom: 3px; }
                .cty-state-card p { margin: 0; font-size: 13.5px; color: #6b7683; }

                .cty-error-card {
                    background: #fff5f5;
                    border: 1px solid #fecaca;
                    border-radius: 18px;
                    padding: 30px;
                    text-align: center;
                    animation: ctyFadeUp 0.4s ease both;
                }
                .cty-error-card .cty-error-icon {
                    width: 56px; height: 56px;
                    border-radius: 999px;
                    background: #fee2e2;
                    color: #dc2626;
                    display: flex; align-items: center; justify-content: center;
                    margin: 0 auto 14px;
                }
                .cty-error-card h3 { margin: 0 0 6px 0; font-size: 17px; color: #991b1b; }
                .cty-error-card p { margin: 0 0 18px 0; color: #b45358; font-size: 14px; }

                .cty-btn-secondary {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #fff;
                    border: 1.5px solid #e2e8f0;
                    color: #334155;
                    padding: 9px 18px;
                    border-radius: 10px;
                    font-size: 13.5px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.15s ease;
                }
                .cty-btn-secondary:hover {
                    background: #0f172a;
                    color: #fff;
                    border-color: #0f172a;
                }

                /* ===== SUMMARY STAT CARDS ===== */

                .cty-summary-row {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                    margin-bottom: 22px;
                    animation: ctyFadeUp 0.5s ease both;
                }

                .cty-stat-card {
                    background: #fff;
                    border: 1px solid #e7ecf0;
                    border-radius: 16px;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    box-shadow: 0 1px 3px rgba(15,23,42,0.04);
                    transition: transform 0.18s ease, box-shadow 0.18s ease;
                }
                .cty-stat-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 14px 26px -16px rgba(15,23,42,0.25);
                }

                .cty-stat-icon {
                    width: 42px; height: 42px;
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }
                .cty-stat-icon.blue { background: #e0f2fe; color: #0284c7; }
                .cty-stat-icon.purple { background: #eef2ff; color: #4f46e5; }
                .cty-stat-icon.green { background: #ecfdf3; color: #16a34a; }

                .cty-stat-card strong {
                    display: block;
                    font-size: 22px;
                    font-weight: 800;
                    line-height: 1.1;
                    color: #0f172a;
                }
                .cty-stat-card span {
                    font-size: 12.5px;
                    color: #8792a0;
                    font-weight: 600;
                }

                /* ===== MAIN DIRECTORY CARD ===== */

                .cty-card {
                    background: #ffffff;
                    border: 1px solid #e7ecf0;
                    border-radius: 20px;
                    padding: 26px 26px 10px;
                    margin-bottom: 22px;
                    box-shadow: 0 1px 3px rgba(15,23,42,0.04), 0 12px 32px -20px rgba(15,23,42,0.12);
                    animation: ctyFadeUp 0.55s ease both;
                }

                .cty-toolbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 20px;
                    flex-wrap: wrap;
                    margin-bottom: 20px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #f0f2f5;
                }

                .cty-toolbar .cty-eyebrow-sm {
                    display: inline-block;
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.08em;
                    color: #94a3b8;
                    margin-bottom: 6px;
                }
                .cty-toolbar h2 { margin: 0 0 6px 0; font-size: 19px; font-weight: 800; }
                .cty-toolbar p { margin: 0; font-size: 13.5px; color: #6b7683; }

                .cty-search-wrap {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .cty-search-icon {
                    position: absolute;
                    left: 13px;
                    color: #9aa5b1;
                    pointer-events: none;
                }
                .cty-search-input {
                    padding: 10px 14px 10px 38px;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 14px;
                    width: 260px;
                    background: #fbfcfd;
                    transition: all 0.15s ease;
                }
                .cty-search-input:focus {
                    outline: none;
                    border-color: #6366f1;
                    background: #fff;
                    box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
                }
                .cty-clear-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: #f1f5f9;
                    border: none;
                    color: #475569;
                    padding: 10px 14px;
                    border-radius: 10px;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.15s ease;
                }
                .cty-clear-btn:hover { background: #e2e8f0; }

                .cty-result-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                    flex-wrap: wrap;
                    margin-bottom: 16px;
                }
                .cty-result-row p { margin: 0; font-size: 13.5px; color: #6b7683; }
                .cty-badge-active {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: #eef2ff;
                    color: #4338ca;
                    padding: 4px 12px;
                    border-radius: 999px;
                    font-size: 12px;
                    font-weight: 700;
                }
                .cty-badge-active .dot {
                    width: 6px; height: 6px;
                    border-radius: 999px;
                    background: #4f46e5;
                    animation: ctyPulse 1.4s ease-in-out infinite;
                }

                /* ===== TABLE ===== */

                .cty-table-wrapper {
                    overflow-x: auto;
                    border: 1px solid #eef1f4;
                    border-radius: 14px;
                    margin-bottom: 20px;
                }

                .cty-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 14px;
                }

                .cty-table thead th {
                    position: sticky;
                    top: 0;
                    background: #f8fafc;
                    text-align: left;
                    padding: 13px 18px;
                    font-size: 11.5px;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    color: #94a3b8;
                    border-bottom: 1px solid #eef1f4;
                    white-space: nowrap;
                }

                .cty-table tbody tr {
                    transition: background 0.12s ease;
                }
                .cty-table tbody tr:hover {
                    background: #f8faff;
                }
                .cty-table tbody tr:not(:last-child) td {
                    border-bottom: 1px solid #f2f4f7;
                }

                .cty-table td {
                    padding: 14px 18px;
                    color: #334155;
                    vertical-align: middle;
                }

                .cty-row-index {
                    color: #b3bcc6;
                    font-weight: 700;
                    font-size: 12.5px;
                    width: 40px;
                }

                .cty-code-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 700;
                    color: #0f172a;
                }
                .cty-code-pill .cty-code-icon {
                    width: 30px; height: 30px;
                    border-radius: 9px;
                    background: #eef2ff;
                    color: #4f46e5;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }

                .cty-state-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: #f0fdf4;
                    color: #15803d;
                    padding: 4px 11px;
                    border-radius: 999px;
                    font-size: 12.5px;
                    font-weight: 700;
                }
                .cty-state-pill.muted {
                    background: #f1f5f9;
                    color: #94a3b8;
                }

                .cty-missing {
                    color: #b0bac5;
                    font-style: italic;
                    font-size: 13.5px;
                }

                .cty-empty-cell {
                    text-align: center;
                    padding: 56px 20px;
                }
                .cty-empty-icon {
                    width: 64px; height: 64px;
                    border-radius: 999px;
                    background: #f1f5f9;
                    color: #94a3b8;
                    display: flex; align-items: center; justify-content: center;
                    margin: 0 auto 16px;
                }
                .cty-empty-cell strong { display: block; font-size: 15.5px; color: #334155; margin-bottom: 6px; }
                .cty-empty-cell p { margin: 0 0 16px 0; color: #8792a0; font-size: 13.5px; }

                /* ===== INFO CARD ===== */

                .cty-info-card {
                    background: #ffffff;
                    border: 1px solid #e7ecf0;
                    border-radius: 20px;
                    padding: 26px;
                    box-shadow: 0 1px 3px rgba(15,23,42,0.04);
                    animation: ctyFadeUp 0.6s ease both;
                }
                .cty-info-card .cty-eyebrow-sm {
                    display: inline-block;
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.08em;
                    color: #94a3b8;
                    margin-bottom: 6px;
                }
                .cty-info-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 18px;
                    font-weight: 800;
                    margin: 0 0 14px 0;
                }
                .cty-info-card p {
                    color: #4a5563;
                    font-size: 14.5px;
                    line-height: 1.75;
                    margin: 0 0 12px 0;
                }
                .cty-info-card p:last-child { margin-bottom: 0; }
                .cty-info-card code {
                    background: #eef2ff;
                    color: #4338ca;
                    padding: 2px 8px;
                    border-radius: 6px;
                    font-weight: 700;
                    font-size: 13.5px;
                }

                @keyframes ctyFadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes ctySpin { to { transform: rotate(360deg); } }
                @keyframes ctyPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }

                @media (max-width: 720px) {
                    .cty-summary-row { grid-template-columns: 1fr; }
                    .cty-toolbar { flex-direction: column; }
                    .cty-search-input { width: 100%; }
                    .cty-search-wrap { width: 100%; }
                    .cty-card { padding: 20px 16px; }
                }
            `}</style>


            <div className="cty-shell">


                {/* ======================================
                    BACK TO DATA CENTER
                    ====================================== */}

                <button
                    className="cty-back-btn"
                    onClick={() => navigate("/data")}
                >
                    <IconArrowLeft />
                    Back to Data Center
                </button>


                {/* ======================================
                    PAGE HEADER
                    ====================================== */}

                <div className="cty-header">

                    <div className="cty-header-icon">
                        <IconMap />
                    </div>

                    <div>
                        <span className="cty-eyebrow">
                            DATA CENTER
                        </span>

                        <h1>
                            County Data
                        </h1>

                        <p>
                            Browse the county records associated with
                            ToxicTide monitoring stations. County information
                            helps identify the geographic area associated
                            with each monitoring location.
                        </p>
                    </div>

                </div>


                {/* ======================================
                    LOADING STATE
                    ====================================== */}

                {loading && (

                    <div className="cty-state-card">

                        <div className="cty-spinner-lg" />

                        <div>
                            <strong>
                                Loading county data...
                            </strong>
                            <p>
                                Retrieving county records from the
                                ToxicTide database.
                            </p>
                        </div>

                    </div>

                )}


                {/* ======================================
                    ERROR STATE
                    ====================================== */}

                {!loading && error && (

                    <div className="cty-error-card">

                        <div className="cty-error-icon">
                            <IconAlert />
                        </div>

                        <h3>
                            Unable to Load County Data
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            className="cty-btn-secondary"
                            onClick={() =>
                                window.location.reload()
                            }
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* ======================================
                    MAIN CONTENT
                    ====================================== */}

                {!loading && !error && (

                    <>

                        {/* ==================================
                            SUMMARY
                            ================================== */}

                        <div className="cty-summary-row">

                            <div className="cty-stat-card">
                                <div className="cty-stat-icon blue">
                                    <IconDatabase />
                                </div>
                                <div>
                                    <strong>{counties.length}</strong>
                                    <span>County Records</span>
                                </div>
                            </div>

                            <div className="cty-stat-card">
                                <div className="cty-stat-icon purple">
                                    <IconLayers />
                                </div>
                                <div>
                                    <strong>{stateCount}</strong>
                                    <span>States</span>
                                </div>
                            </div>

                            <div className="cty-stat-card">
                                <div className="cty-stat-icon green">
                                    <IconMap />
                                </div>
                                <div>
                                    <strong>{filteredCounties.length}</strong>
                                    <span>Displayed</span>
                                </div>
                            </div>

                        </div>


                        {/* ==================================
                            COUNTY DIRECTORY
                            ================================== */}

                        <div className="cty-card">


                            {/* HEADER + SEARCH */}

                            <div className="cty-toolbar">

                                <div>
                                    <span className="cty-eyebrow-sm">
                                        COUNTIES TABLE
                                    </span>
                                    <h2>
                                        County Directory
                                    </h2>
                                    <p>
                                        Geographic records used by ToxicTide
                                        monitoring stations.
                                    </p>
                                </div>


                                {/* SEARCH */}

                                <div className="cty-search-wrap">

                                    <span className="cty-search-icon">
                                        <IconSearch />
                                    </span>

                                    <input
                                        type="text"
                                        placeholder="Search county code or state..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(
                                                e.target.value
                                            )
                                        }
                                        className="cty-search-input"
                                        aria-label="Search counties"
                                    />


                                    {search && (

                                        <button
                                            className="cty-clear-btn"
                                            onClick={clearSearch}
                                        >
                                            <IconX />
                                            Clear
                                        </button>

                                    )}

                                </div>

                            </div>


                            {/* ==================================
                                RESULT INFORMATION
                                ================================== */}

                            <div className="cty-result-row">

                                <p>
                                    Showing{" "}
                                    <strong>
                                        {filteredCounties.length}
                                    </strong>{" "}
                                    of{" "}
                                    <strong>
                                        {counties.length}
                                    </strong>{" "}
                                    county records
                                </p>


                                {search && (

                                    <span className="cty-badge-active">
                                        <span className="dot" />
                                        Search active
                                    </span>

                                )}

                            </div>


                            {/* ==================================
                                TABLE
                                ================================== */}

                            <div className="cty-table-wrapper">

                                <table className="cty-table">

                                    <thead>

                                        <tr>
                                            <th>#</th>
                                            <th>County Code</th>
                                            <th>State</th>
                                        </tr>

                                    </thead>


                                    <tbody>

                                        {filteredCounties.length === 0 ? (

                                            <tr>

                                                <td colSpan="3" className="cty-empty-cell">

                                                    <div className="cty-empty-icon">
                                                        <IconInbox />
                                                    </div>

                                                    <strong>
                                                        No matching counties found
                                                    </strong>

                                                    <p>
                                                        Try searching with a different
                                                        county code or state.
                                                    </p>

                                                    <button
                                                        className="cty-btn-secondary"
                                                        onClick={clearSearch}
                                                    >
                                                        <IconX />
                                                        Clear Search
                                                    </button>

                                                </td>

                                            </tr>

                                        ) : (

                                            filteredCounties.map(
                                                (county, index) => (

                                                    <tr key={county.COUNTY_CODE}>

                                                        <td className="cty-row-index">
                                                            {index + 1}
                                                        </td>


                                                        <td>

                                                            {county.COUNTY_CODE ? (
                                                                <span className="cty-code-pill">
                                                                    <span className="cty-code-icon">
                                                                        <IconPin />
                                                                    </span>
                                                                    {county.COUNTY_CODE}
                                                                </span>
                                                            ) : (
                                                                <span className="cty-missing">
                                                                    No code recorded
                                                                </span>
                                                            )}

                                                        </td>


                                                        <td>

                                                            {county.STATE ? (
                                                                <span className="cty-state-pill">
                                                                    <IconFlag />
                                                                    {county.STATE}
                                                                </span>
                                                            ) : (
                                                                <span className="cty-state-pill muted">
                                                                    <IconFlag />
                                                                    No state recorded
                                                                </span>
                                                            )}

                                                        </td>

                                                    </tr>

                                                )
                                            )

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>


                        {/* ==================================
                            DATABASE INFORMATION
                            ================================== */}

                        <div className="cty-info-card">

                            <span className="cty-eyebrow-sm">
                                DATABASE INFORMATION
                            </span>

                            <h2 className="cty-info-title">
                                <IconDatabase />
                                About County Data
                            </h2>

                            <p>
                                County records are stored in the{" "}
                                <code>COUNTIES</code> table. Each county is
                                identified by its County Code and associated
                                state.
                            </p>

                            <p>
                                Monitoring stations reference these county
                                records through the county code, allowing
                                station information to remain connected to
                                its geographic area without duplicating
                                county details.
                            </p>

                        </div>

                    </>

                )}

            </div>

        </div>

    );

}


export default Counties;