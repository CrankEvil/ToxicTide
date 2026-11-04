import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// ============================================
// ICONS
// ============================================
const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
);
const IconChevronLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
);
const IconChevronRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
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
const IconBeaker = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H15M10 3v6l-4 9a2 2 0 0 0 1.8 3h8.4a2 2 0 0 0 1.8-3l-4-9V3" /><path d="M8 14h8" /></svg>
);
const IconInbox = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>
);
const IconDatabase = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>
);
const IconTag = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41L11.58 4.4A2 2 0 0 0 10.17 3.8H4a1 1 0 0 0-1 1v6.17a2 2 0 0 0 .59 1.42l9 9a2 2 0 0 0 2.83 0l5.17-5.17a2 2 0 0 0 0-2.83z" /><circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" /></svg>
);
const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
);


function Measurements() {
    const navigate = useNavigate();

    // Stores all measurement records
    const [measurements, setMeasurements] = useState([]);

    // Search and filter states
    const [search, setSearch] = useState("");
    const [stationFilter, setStationFilter] = useState("");

    // Page states
    const [currentPage, setCurrentPage] = useState(1);

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Number of records displayed per page
    const recordsPerPage = 25;

    /*
     * Load all official measurement records
     * from the ToxicTide backend.
     */
    useEffect(() => {
        const loadMeasurements = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "https://toxictide-backend.onrender.com/api/measurements/all"
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load measurements"
                    );
                }

                const data = await response.json();

                setMeasurements(
                    Array.isArray(data) ? data : []
                );
            } catch (err) {
                console.error(
                    "Measurement loading error:",
                    err
                );

                setError(
                    "Unable to load cyanotoxin measurement data."
                );
            } finally {
                setLoading(false);
            }
        };

        loadMeasurements();
    }, []);

    /*
     * Create a unique list of station IDs
     * for the station filter.
     */
    const stations = useMemo(() => {
        return [
            ...new Set(
                measurements
                    .map(
                        (measurement) =>
                            measurement.STATION_ID
                    )
                    .filter(Boolean)
            ),
        ].sort();
    }, [measurements]);

    /*
     * Calculate summary statistics.
     */
    const statistics = useMemo(() => {
        const recordedValues = measurements.filter(
            (measurement) =>
                measurement.MICROCYSTIN_UGL !== null &&
                measurement.MICROCYSTIN_UGL !== undefined &&
                measurement.MICROCYSTIN_UGL !== "" &&
                Number.isFinite(
                    Number(
                        measurement.MICROCYSTIN_UGL
                    )
                )
        );

        const missingValues =
            measurements.length -
            recordedValues.length;

        const numericValues =
            recordedValues.map((measurement) =>
                Number(
                    measurement.MICROCYSTIN_UGL
                )
            );

        const highestValue =
            numericValues.length > 0
                ? Math.max(...numericValues)
                : null;

        return {
            total: measurements.length,
            stations: stations.length,
            recorded: recordedValues.length,
            missing: missingValues,
            highest: highestValue,
        };
    }, [measurements, stations]);

    /*
     * Filter the complete dataset.
     *
     * Pagination happens AFTER filtering so that
     * search works across all measurement records.
     */
    const filteredMeasurements = useMemo(() => {
        const searchText =
            search.trim().toLowerCase();

        return measurements.filter(
            (measurement) => {
                const stationId = String(
                    measurement.STATION_ID || ""
                ).toLowerCase();

                const stationName = String(
                    measurement.STATION_NAME || ""
                ).toLowerCase();

                const sampleDate = String(
                    measurement.SAMPLE_DATE || ""
                ).toLowerCase();

                const sampleId = String(
                    measurement.SAMPLE_ID || ""
                ).toLowerCase();

                const matchesSearch =
                    searchText === "" ||
                    stationId.includes(
                        searchText
                    ) ||
                    stationName.includes(
                        searchText
                    ) ||
                    sampleDate.includes(
                        searchText
                    ) ||
                    sampleId.includes(
                        searchText
                    );

                const matchesStation =
                    stationFilter === "" ||
                    String(
                        measurement.STATION_ID
                    ) ===
                        String(stationFilter);

                return (
                    matchesSearch &&
                    matchesStation
                );
            }
        );
    }, [
        measurements,
        search,
        stationFilter,
    ]);

    /*
     * Pagination calculations.
     */
    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredMeasurements.length /
                recordsPerPage
        )
    );

    const safeCurrentPage = Math.min(
        currentPage,
        totalPages
    );

    const startIndex =
        (safeCurrentPage - 1) *
        recordsPerPage;

    const endIndex =
        startIndex + recordsPerPage;

    const displayedMeasurements =
        filteredMeasurements.slice(
            startIndex,
            endIndex
        );

    /*
     * Reset pagination whenever the user
     * changes search or station filter.
     */
    useEffect(() => {
        setCurrentPage(1);
    }, [search, stationFilter]);

    /*
     * Clear all filters.
     */
    const clearFilters = () => {
        setSearch("");
        setStationFilter("");
        setCurrentPage(1);
    };

    /*
     * Format sample date.
     */
    const formatDate = (date) => {
        if (!date) {
            return "No date recorded";
        }

        return String(date).substring(0, 10);
    };

    /*
     * Format microcystin value.
     */
    const formatMicrocystin = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "No value recorded";
        }

        const numericValue = Number(value);

        if (!Number.isFinite(numericValue)) {
            return "No value recorded";
        }

        return `${numericValue} µg/L`;
    };

    /*
     * Purely presentational — pick a color tier for
     * the microcystin badge. Does not affect any
     * calculation, filtering, or backend logic.
     */
    const getValueTier = (value) => {
        const num = Number(value);
        if (!Number.isFinite(num)) return null;
        if (num < 4) return { bg: "#ecfdf3", color: "#15803d", border: "#bbf7d0" };
        if (num < 8) return { bg: "#fffbeb", color: "#b45309", border: "#fde68a" };
        return { bg: "#fef2f2", color: "#b91c1c", border: "#fecaca" };
    };

    // Pagination page-number list (max 5 visible, centered on current)
    const pageNumbers = useMemo(() => {
        const pages = [];
        const windowSize = 5;
        let start = Math.max(1, safeCurrentPage - Math.floor(windowSize / 2));
        let end = Math.min(totalPages, start + windowSize - 1);
        start = Math.max(1, end - windowSize + 1);
        for (let p = start; p <= end; p++) pages.push(p);
        return pages;
    }, [safeCurrentPage, totalPages]);

    return (
        <div className="ms-page">
            <style>{`
                .ms-page {
                    min-height: 100vh;
                    background:
                        radial-gradient(1200px 500px at 10% -10%, rgba(217,119,6,0.08), transparent 60%),
                        radial-gradient(1000px 500px at 100% 0%, rgba(14,165,233,0.08), transparent 55%),
                        #f6f8fa;
                    padding: 28px 18px 80px;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    color: #0f172a;
                }
                .ms-shell { max-width: 1180px; margin: 0 auto; }

                .ms-back-btn {
                    display:inline-flex; align-items:center; gap:8px;
                    padding:9px 16px; border-radius:999px; border:1px solid #e2e8f0;
                    background:#fff; color:#334155; font-size:13.5px; font-weight:600;
                    cursor:pointer; box-shadow:0 1px 2px rgba(15,23,42,0.05);
                    transition:all .18s ease; margin-bottom:20px;
                }
                .ms-back-btn:hover { background:#0f172a; color:#fff; border-color:#0f172a; transform:translateX(-2px); }

                .ms-header {
                    display:flex; justify-content:space-between; align-items:flex-start;
                    gap:20px; flex-wrap:wrap; margin-bottom:22px; animation: msFadeUp .5s ease both;
                }
                .ms-header-left { display:flex; gap:16px; align-items:flex-start; }
                .ms-header-icon {
                    width:54px; height:54px; border-radius:16px; flex-shrink:0;
                    display:flex; align-items:center; justify-content:center;
                    background:linear-gradient(135deg,#f59e0b,#d97706); color:#fff;
                    box-shadow:0 12px 26px -10px rgba(217,119,6,0.55);
                }
                .ms-eyebrow {
                    display:inline-block; font-size:11.5px; font-weight:800; letter-spacing:.09em;
                    color:#b45309; background:#fffbeb; padding:4px 10px; border-radius:999px; margin-bottom:8px;
                }
                .ms-header h1 { font-size:27px; font-weight:800; margin:0 0 6px 0; letter-spacing:-0.02em; }
                .ms-header p { margin:0; color:#5a6b7c; font-size:14.5px; line-height:1.6; max-width:560px; }
                .ms-badge {
                    display:inline-flex; align-items:center; gap:7px; background:#fff;
                    border:1px solid #e2e8f0; padding:9px 15px; border-radius:999px;
                    font-size:12.5px; font-weight:700; color:#334155; box-shadow:0 1px 2px rgba(15,23,42,0.05);
                    white-space:nowrap;
                }
                .ms-badge .dot { width:7px; height:7px; border-radius:999px; background:#16a34a; animation: msPulse 1.6s infinite; }

                .ms-stats-row {
                    display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:22px;
                    animation: msFadeUp .55s ease both;
                }
                .ms-stat-card {
                    background:#fff; border:1px solid #e7ecf0; border-radius:16px; padding:18px;
                    box-shadow:0 1px 3px rgba(15,23,42,0.04); transition:transform .18s ease, box-shadow .18s ease;
                }
                .ms-stat-card:hover { transform:translateY(-3px); box-shadow:0 14px 26px -16px rgba(15,23,42,0.22); }
                .ms-stat-card strong { display:block; font-size:24px; font-weight:800; color:#0f172a; line-height:1.1; }
                .ms-stat-card span { font-size:12px; font-weight:700; color:#8a9aad; text-transform:uppercase; letter-spacing:.05em; }
                .ms-stat-card.recorded strong { color:#15803d; }
                .ms-stat-card.missing strong { color:#b45309; }

                .ms-card {
                    background:#fff; border:1px solid #e7ecf0; border-radius:20px; padding:24px;
                    box-shadow:0 1px 3px rgba(15,23,42,0.04), 0 12px 32px -22px rgba(15,23,42,0.12);
                    margin-bottom:22px; animation: msFadeUp .6s ease both;
                }

                .ms-section-heading {
                    display:flex; justify-content:space-between; align-items:flex-start;
                    gap:14px; flex-wrap:wrap; margin-bottom:18px; padding-bottom:18px;
                    border-bottom:1px solid #f0f2f5;
                }
                .ms-section-heading h2 { margin:0 0 5px 0; font-size:18px; font-weight:800; }
                .ms-section-heading p { margin:0; font-size:13.5px; color:#6b7683; }
                .ms-result-count {
                    display:inline-flex; align-items:center; background:#eef2ff; color:#4338ca;
                    padding:6px 14px; border-radius:999px; font-size:12.5px; font-weight:800; white-space:nowrap;
                }

                .ms-filter-panel {
                    display:flex; gap:14px; align-items:flex-end; flex-wrap:wrap; margin-bottom:20px;
                }
                .ms-filter-group { display:flex; flex-direction:column; gap:6px; flex:1; min-width:220px; }
                .ms-filter-group label { font-size:12.5px; font-weight:700; color:#475569; }
                .ms-search-wrap { position:relative; }
                .ms-search-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#9aa5b1; }
                .ms-input, .ms-select {
                    width:100%; border:1.5px solid #e2e8f0; border-radius:11px; padding:10px 14px;
                    font-size:14px; background:#fbfcfd; transition:all .15s ease; box-sizing:border-box;
                    font-family:inherit;
                }
                .ms-input { padding-left:38px; }
                .ms-select { cursor:pointer; appearance:none;
                    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5'><path d='M6 9l6 6 6-6'/></svg>");
                    background-repeat:no-repeat; background-position:right 12px center; padding-right:34px;
                }
                .ms-input:focus, .ms-select:focus { outline:none; border-color:#d97706; background:#fff; box-shadow:0 0 0 4px rgba(217,119,6,0.12); }
                .ms-clear-btn {
                    display:inline-flex; align-items:center; gap:7px; background:#fef2f2; color:#b91c1c;
                    border:1px solid #fecaca; padding:10px 16px; border-radius:11px; font-size:13.5px;
                    font-weight:700; cursor:pointer; transition:all .15s ease; white-space:nowrap;
                }
                .ms-clear-btn:hover { background:#fee2e2; }

                /* States */
                .ms-state-block { text-align:center; padding:60px 20px; }
                .ms-spin-icon { width:44px; height:44px; margin:0 auto 16px; border-radius:999px; border:3px solid #fef3e0; border-top-color:#d97706; animation: msSpin .7s linear infinite; }
                .ms-state-block h3 { margin:0 0 6px 0; font-size:16px; font-weight:800; }
                .ms-state-block p { margin:0; color:#8a9aad; font-size:13.5px; }

                .ms-error-block { text-align:center; padding:46px 20px; background:#fff5f5; border:1px solid #fecaca; border-radius:16px; }
                .ms-error-icon { width:54px; height:54px; border-radius:999px; background:#fee2e2; color:#dc2626; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; }
                .ms-error-block strong { display:block; font-size:15.5px; color:#991b1b; margin-bottom:5px; }
                .ms-error-block p { margin:0 0 16px 0; color:#b45358; font-size:13.5px; }

                .ms-empty-block { text-align:center; padding:60px 20px; }
                .ms-empty-icon { width:64px; height:64px; border-radius:999px; background:#f1f5f9; color:#94a3b8; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; }
                .ms-empty-block h3 { margin:0 0 6px 0; font-size:16px; font-weight:800; }
                .ms-empty-block p { margin:0 0 18px 0; color:#8a9aad; font-size:13.5px; }

                .ms-btn-dark {
                    display:inline-flex; align-items:center; gap:8px; background:#0f172a; color:#fff;
                    border:none; padding:10px 18px; border-radius:10px; font-size:13.5px; font-weight:700; cursor:pointer;
                    transition:all .15s ease;
                }
                .ms-btn-dark:hover { transform:translateY(-1px); box-shadow:0 10px 20px -10px rgba(15,23,42,0.6); }

                /* Table */
                .ms-table-wrapper { overflow-x:auto; border:1px solid #eef1f4; border-radius:14px; margin-bottom:18px; }
                .ms-table { width:100%; border-collapse:collapse; font-size:13.8px; min-width:760px; }
                .ms-table thead th {
                    background:#f8fafc; text-align:left; padding:12px 16px; font-size:11px; font-weight:800;
                    letter-spacing:.05em; text-transform:uppercase; color:#94a3b8; border-bottom:1px solid #eef1f4; white-space:nowrap;
                }
                .ms-table tbody tr { transition: background .12s ease; }
                .ms-table tbody tr:hover { background:#fffaf0; }
                .ms-table tbody tr:not(:last-child) td { border-bottom:1px solid #f2f4f7; }
                .ms-table td { padding:12px 16px; color:#334155; vertical-align:middle; }
                .ms-row-index { color:#c2cad4; font-weight:700; font-size:12px; width:36px; }

                .ms-id-badge {
                    display:inline-flex; align-items:center; gap:6px; background:#f1f5f9; color:#334155;
                    padding:4px 10px; border-radius:8px; font-size:12.5px; font-weight:700; font-family:'SF Mono',monospace;
                }
                .ms-station-id { color:#4f46e5; font-weight:700; font-size:12.8px; }
                .ms-primary-text { color:#0f172a; font-weight:600; }
                .ms-date-cell { display:inline-flex; align-items:center; gap:6px; color:#5a6b7c; font-size:13px; }
                .ms-missing { color:#c2cad4; font-style:italic; font-size:13px; }
                .ms-value-badge {
                    display:inline-flex; align-items:center; padding:4px 12px; border-radius:999px;
                    font-size:12.8px; font-weight:800; border:1px solid;
                }

                .ms-table-footer {
                    display:flex; justify-content:space-between; align-items:center; gap:14px; flex-wrap:wrap;
                    padding-top:6px; font-size:13.5px; color:#5a6b7c;
                }
                .ms-pagination { display:flex; align-items:center; gap:6px; }
                .ms-page-btn {
                    display:flex; align-items:center; justify-content:center; gap:6px;
                    min-width:34px; height:34px; padding:0 10px; border-radius:9px;
                    border:1.5px solid #e2e8f0; background:#fff; color:#334155;
                    font-size:13px; font-weight:700; cursor:pointer; transition:all .15s ease;
                }
                .ms-page-btn:hover:not(:disabled) { background:#0f172a; color:#fff; border-color:#0f172a; }
                .ms-page-btn:disabled { opacity:.4; cursor:not-allowed; }
                .ms-page-btn.active { background:#0f172a; color:#fff; border-color:#0f172a; }

                .ms-info-card {
                    display:flex; gap:16px; background:linear-gradient(180deg,#fff,#fffdf7);
                    border:1px solid #e7ecf0; border-radius:20px; padding:24px;
                    box-shadow:0 1px 3px rgba(15,23,42,0.04); animation: msFadeUp .65s ease both;
                }
                .ms-info-icon {
                    width:48px; height:48px; border-radius:14px; flex-shrink:0;
                    background:#fffbeb; color:#d97706; display:flex; align-items:center; justify-content:center;
                }
                .ms-info-card h3 { margin:0 0 10px 0; font-size:16.5px; font-weight:800; }
                .ms-info-card p { margin:0 0 10px 0; color:#4a5563; font-size:14px; line-height:1.7; }
                .ms-info-card p:last-child { margin-bottom:0; }
                .ms-info-card strong { color:#0f172a; }

                @keyframes msFadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
                @keyframes msSpin { to { transform: rotate(360deg); } }
                @keyframes msPulse { 0%,100% { opacity:1; } 50% { opacity:.3; } }

                @media (max-width: 900px) {
                    .ms-stats-row { grid-template-columns:repeat(2,1fr); }
                }
                @media (max-width: 640px) {
                    .ms-header { flex-direction:column; }
                    .ms-stats-row { grid-template-columns:1fr 1fr; }
                    .ms-card { padding:18px; }
                    .ms-filter-panel { flex-direction:column; align-items:stretch; }
                }
            `}</style>

            <div className="ms-shell">

                {/* Back navigation */}
                <button type="button" className="ms-back-btn" onClick={() => navigate("/data")}>
                    <IconArrowLeft /> Back to Data Center
                </button>

                {/* Page Header */}
                <div className="ms-header">
                    <div className="ms-header-left">
                        <div className="ms-header-icon"><IconBeaker /></div>
                        <div>
                            <span className="ms-eyebrow">DATA CENTER</span>
                            <h1>Cyanotoxin Measurements</h1>
                            <p>Explore official microcystin monitoring records used by ToxicTide for water-safety analysis.</p>
                        </div>
                    </div>
                    <div className="ms-badge"><span className="dot" /> Official Monitoring Data</div>
                </div>

                {/* Summary Statistics */}
                <div className="ms-stats-row">
                    <div className="ms-stat-card">
                        <strong>{statistics.total.toLocaleString()}</strong>
                        <span>Measurement Records</span>
                    </div>
                    <div className="ms-stat-card">
                        <strong>{statistics.stations.toLocaleString()}</strong>
                        <span>Stations With Records</span>
                    </div>
                    <div className="ms-stat-card recorded">
                        <strong>{statistics.recorded.toLocaleString()}</strong>
                        <span>Recorded Values</span>
                    </div>
                    <div className="ms-stat-card missing">
                        <strong>{statistics.missing.toLocaleString()}</strong>
                        <span>Missing Values</span>
                    </div>
                </div>

                {/* Main Data Card */}
                <div className="ms-card">

                    <div className="ms-section-heading">
                        <div>
                            <h2>Microcystin Records</h2>
                            <p>Search and filter the measurement records stored in the ToxicTide database.</p>
                        </div>
                        <div className="ms-result-count">
                            {filteredMeasurements.length} result{filteredMeasurements.length !== 1 ? "s" : ""}
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="ms-filter-panel">

                        <div className="ms-filter-group">
                            <label htmlFor="measurement-search">Search</label>
                            <div className="ms-search-wrap">
                                <span className="ms-search-icon"><IconSearch /></span>
                                <input
                                    id="measurement-search"
                                    type="text"
                                    placeholder="Search sample ID, station or date..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="ms-input"
                                />
                            </div>
                        </div>

                        <div className="ms-filter-group" style={{ maxWidth: "260px" }}>
                            <label htmlFor="station-filter">Station</label>
                            <select
                                id="station-filter"
                                value={stationFilter}
                                onChange={(e) => setStationFilter(e.target.value)}
                                className="ms-select"
                            >
                                <option value="">All Stations</option>
                                {stations.map((stationId) => (
                                    <option key={stationId} value={stationId}>{stationId}</option>
                                ))}
                            </select>
                        </div>

                        {(search || stationFilter) && (
                            <button type="button" className="ms-clear-btn" onClick={clearFilters}>
                                <IconX /> Clear Filters
                            </button>
                        )}

                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="ms-state-block">
                            <div className="ms-spin-icon" />
                            <h3>Loading measurement data</h3>
                            <p>Please wait while ToxicTide retrieves the official monitoring records.</p>
                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="ms-error-block">
                            <div className="ms-error-icon"><IconAlert /></div>
                            <strong>Unable to load measurements</strong>
                            <p>{error}</p>
                            <button type="button" className="ms-btn-dark" onClick={() => window.location.reload()}>
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Empty Search State */}
                    {!loading && !error && filteredMeasurements.length === 0 && (
                        <div className="ms-empty-block">
                            <div className="ms-empty-icon"><IconInbox /></div>
                            <h3>No measurements found</h3>
                            <p>No measurement records match the current search or station filter.</p>
                            <button type="button" className="ms-btn-dark" onClick={clearFilters}>
                                Clear Filters
                            </button>
                        </div>
                    )}

                    {/* Measurement Table */}
                    {!loading && !error && filteredMeasurements.length > 0 && (
                        <>
                            <div className="ms-table-wrapper">
                                <table className="ms-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Sample ID</th>
                                            <th>Station ID</th>
                                            <th>Station Name</th>
                                            <th>Sample Date</th>
                                            <th>Microcystin (µg/L)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedMeasurements.map((measurement, index) => {
                                            const tier = getValueTier(measurement.MICROCYSTIN_UGL);
                                            return (
                                                <tr key={measurement.SAMPLE_ID}>
                                                    <td className="ms-row-index">{startIndex + index + 1}</td>
                                                    <td>
                                                        <span className="ms-id-badge">
                                                            <IconTag /> {measurement.SAMPLE_ID}
                                                        </span>
                                                    </td>
                                                    <td><span className="ms-station-id">{measurement.STATION_ID}</span></td>
                                                    <td>
                                                        <span className="ms-primary-text">
                                                            {measurement.STATION_NAME || "No station name recorded"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="ms-date-cell">
                                                            <IconCalendar /> {formatDate(measurement.SAMPLE_DATE)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {measurement.MICROCYSTIN_UGL === null ||
                                                        measurement.MICROCYSTIN_UGL === undefined ||
                                                        measurement.MICROCYSTIN_UGL === "" ? (
                                                            <span className="ms-missing">No value recorded</span>
                                                        ) : (
                                                            <span
                                                                className="ms-value-badge"
                                                                style={tier ? {
                                                                    background: tier.bg,
                                                                    color: tier.color,
                                                                    borderColor: tier.border
                                                                } : {}}
                                                            >
                                                                {formatMicrocystin(measurement.MICROCYSTIN_UGL)}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Footer */}
                            <div className="ms-table-footer">
                                <div>
                                    Showing <strong>{startIndex + 1}</strong> to{" "}
                                    <strong>{Math.min(endIndex, filteredMeasurements.length)}</strong> of{" "}
                                    <strong>{filteredMeasurements.length}</strong> records
                                </div>

                                <div className="ms-pagination">
                                    <button
                                        type="button"
                                        className="ms-page-btn"
                                        disabled={safeCurrentPage === 1}
                                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                                    >
                                        <IconChevronLeft /> Prev
                                    </button>

                                    {pageNumbers[0] > 1 && (
                                        <>
                                            <button type="button" className="ms-page-btn" onClick={() => setCurrentPage(1)}>1</button>
                                            {pageNumbers[0] > 2 && <span style={{ color: "#c2cad4" }}>…</span>}
                                        </>
                                    )}

                                    {pageNumbers.map((p) => (
                                        <button
                                            type="button"
                                            key={p}
                                            className={"ms-page-btn" + (p === safeCurrentPage ? " active" : "")}
                                            onClick={() => setCurrentPage(p)}
                                        >
                                            {p}
                                        </button>
                                    ))}

                                    {pageNumbers[pageNumbers.length - 1] < totalPages && (
                                        <>
                                            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span style={{ color: "#c2cad4" }}>…</span>}
                                            <button type="button" className="ms-page-btn" onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
                                        </>
                                    )}

                                    <button
                                        type="button"
                                        className="ms-page-btn"
                                        disabled={safeCurrentPage === totalPages}
                                        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                                    >
                                        Next <IconChevronRight />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                </div>

                {/* Information Card */}
                <div className="ms-info-card">
                    <div className="ms-info-icon"><IconDatabase /></div>
                    <div>
                        <h3>About these measurements</h3>
                        <p>
                            These records contain cyanotoxin measurement data stored in the ToxicTide database.
                            Microcystin values are displayed in µg/L where a recorded value is available.
                        </p>
                        <p>
                            A missing value is shown as <strong>"No value recorded"</strong>. Missing measurements
                            are not treated as zero or automatically considered safe.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Measurements;