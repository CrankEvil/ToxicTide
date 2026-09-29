import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../App.css";


function WaterTypes() {

    // ============================================
    // ROUTING
    // ============================================

    const navigate = useNavigate();


    // ============================================
    // DATA
    // ============================================

    const [waterTypes, setWaterTypes] =
        useState([]);


    // ============================================
    // PAGE STATE
    // ============================================

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ============================================
    // SEARCH
    // ============================================

    const [searchTerm, setSearchTerm] =
        useState("");


    // ============================================
    // LOAD WATER TYPES
    // ============================================

    useEffect(() => {

        const loadWaterTypes = async () => {

            try {

                setLoading(true);
                setError("");


                const response =
                    await axios.get(
                        "http://localhost:5000/api/water-types"
                    );


                setWaterTypes(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            } catch (err) {

                console.error(
                    "Failed to load water types:",
                    err
                );


                setError(
                    "Unable to load water types."
                );


                setWaterTypes([]);

            } finally {

                setLoading(false);

            }

        };


        loadWaterTypes();

    }, []);


    // ============================================
    // FILTER RECORDS
    // ============================================

    const filteredWaterTypes = useMemo(() => {

        const search =
            searchTerm
                .trim()
                .toLowerCase();


        if (!search) {

            return waterTypes;

        }


        return waterTypes.filter(
            (waterType) => {

                const id =
                    String(
                        waterType.TYPE_ID ?? ""
                    ).toLowerCase();


                const name =
                    String(
                        waterType.TYPE_NAME ?? ""
                    ).toLowerCase();


                return (
                    id.includes(search) ||
                    name.includes(search)
                );

            }
        );

    }, [
        waterTypes,
        searchTerm
    ]);


    // ============================================
    // CLEAR SEARCH
    // ============================================

    const clearSearch = () => {

        setSearchTerm("");

    };


    // ============================================
    // PAGE
    // ============================================

    return (

        <div className="wt-page">

            <style>{`
                .wt-page {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 28px 20px 80px;
                    animation: wtFadeIn .45s ease both;
                }

                @keyframes wtFadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .wt-back {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #fff;
                    border: 1px solid #e2e8f0;
                    color: #334155;
                    font-size: 13.5px;
                    font-weight: 600;
                    padding: 9px 16px;
                    border-radius: 999px;
                    cursor: pointer;
                    margin-bottom: 26px;
                    transition: all .2s ease;
                    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
                }

                .wt-back:hover {
                    background: #0f172a;
                    color: #fff;
                    border-color: #0f172a;
                    transform: translateX(-2px);
                }

                .wt-back svg {
                    transition: transform .2s ease;
                }

                .wt-back:hover svg {
                    transform: translateX(-3px);
                }

                .wt-header {
                    position: relative;
                    overflow: hidden;
                    background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 55%, #0891b2 100%);
                    border-radius: 22px;
                    padding: 40px 36px;
                    margin-bottom: 28px;
                    color: #fff;
                    box-shadow: 0 18px 40px -18px rgba(3, 105, 161, 0.55);
                }

                .wt-header::before {
                    content: "";
                    position: absolute;
                    width: 320px;
                    height: 320px;
                    background: radial-gradient(circle, rgba(255,255,255,0.16) 0%, transparent 70%);
                    top: -140px;
                    right: -80px;
                    border-radius: 50%;
                }

                .wt-header::after {
                    content: "";
                    position: absolute;
                    width: 220px;
                    height: 220px;
                    background: radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 70%);
                    bottom: -120px;
                    left: -60px;
                    border-radius: 50%;
                }

                .wt-header-content {
                    position: relative;
                    z-index: 1;
                    max-width: 680px;
                }

                .wt-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255,255,255,0.15);
                    backdrop-filter: blur(6px);
                    padding: 6px 14px;
                    border-radius: 999px;
                    font-size: 11.5px;
                    font-weight: 700;
                    letter-spacing: 0.14em;
                    margin-bottom: 16px;
                }

                .wt-header h1 {
                    font-size: 34px;
                    font-weight: 800;
                    margin: 0 0 12px;
                    letter-spacing: -0.02em;
                }

                .wt-header p {
                    font-size: 15px;
                    line-height: 1.65;
                    color: rgba(255,255,255,0.88);
                    margin: 0;
                }

                .wt-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
                    gap: 18px;
                    margin-bottom: 26px;
                }

                .wt-stat-card {
                    position: relative;
                    background: #fff;
                    border: 1px solid #e7ecf3;
                    border-radius: 18px;
                    padding: 22px 22px 20px;
                    overflow: hidden;
                    transition: transform .2s ease, box-shadow .2s ease;
                }

                .wt-stat-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 14px 30px -16px rgba(15, 23, 42, 0.18);
                }

                .wt-stat-card::before {
                    content: "";
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                    width: 4px;
                }

                .wt-stat-card.total::before { background: linear-gradient(180deg, #0284c7, #0ea5e9); }
                .wt-stat-card.shown::before { background: linear-gradient(180deg, #059669, #10b981); }

                .wt-stat-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 6px;
                }

                .wt-stat-icon {
                    width: 38px;
                    height: 38px;
                    border-radius: 11px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .wt-stat-card.total .wt-stat-icon { background: #e0f2fe; color: #0284c7; }
                .wt-stat-card.shown .wt-stat-icon { background: #d1fae5; color: #059669; }

                .wt-stat-label {
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    color: #94a3b8;
                    text-transform: uppercase;
                    margin: 0 0 2px;
                }

                .wt-stat-value {
                    font-size: 30px;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 2px 0 6px;
                    letter-spacing: -0.02em;
                }

                .wt-stat-desc {
                    font-size: 13px;
                    color: #64748b;
                    margin: 0;
                    line-height: 1.5;
                }

                .wt-section {
                    background: #fff;
                    border: 1px solid #e7ecf3;
                    border-radius: 20px;
                    padding: 26px 26px 10px;
                    margin-bottom: 24px;
                    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
                }

                .wt-section-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 16px;
                    flex-wrap: wrap;
                    margin-bottom: 20px;
                    padding-bottom: 18px;
                    border-bottom: 1px solid #eef2f7;
                }

                .wt-section-header p.wt-mini-label {
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    color: #0891b2;
                    text-transform: uppercase;
                    margin: 0 0 6px;
                }

                .wt-section-header h2 {
                    font-size: 20px;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 0;
                }

                .wt-count-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: #f0f9ff;
                    color: #0369a1;
                    border: 1px solid #bae6fd;
                    font-size: 12.5px;
                    font-weight: 700;
                    padding: 7px 14px;
                    border-radius: 999px;
                    white-space: nowrap;
                }

                .wt-searchbar {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                    align-items: center;
                    margin-bottom: 22px;
                }

                .wt-search-input-wrap {
                    flex: 1 1 320px;
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .wt-search-input-wrap svg.wt-search-icon {
                    position: absolute;
                    left: 14px;
                    color: #94a3b8;
                    pointer-events: none;
                }

                .wt-search-input {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 13px 42px 13px 40px;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 14px;
                    outline: none;
                    background: #f8fafc;
                    transition: all .2s ease;
                    color: #0f172a;
                }

                .wt-search-input::placeholder {
                    color: #94a3b8;
                }

                .wt-search-input:focus {
                    border-color: #0ea5e9;
                    background: #fff;
                    box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.12);
                }

                .wt-clear-inline {
                    position: absolute;
                    right: 10px;
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    border: none;
                    background: #e2e8f0;
                    color: #475569;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all .15s ease;
                }

                .wt-clear-inline:hover {
                    background: #cbd5e1;
                    color: #1e293b;
                }

                .wt-btn-secondary {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: #fff;
                    border: 1.5px solid #e2e8f0;
                    color: #334155;
                    font-size: 13.5px;
                    font-weight: 700;
                    padding: 11px 18px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all .2s ease;
                    white-space: nowrap;
                }

                .wt-btn-secondary:hover {
                    border-color: #0ea5e9;
                    color: #0369a1;
                    background: #f0f9ff;
                }

                .wt-message {
                    text-align: center;
                    padding: 56px 24px;
                    border-radius: 18px;
                    background: #f8fafc;
                    border: 1px dashed #cbd5e1;
                }

                .wt-message.wt-error {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                }

                .wt-message-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: #e0f2fe;
                    color: #0284c7;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px;
                }

                .wt-message.wt-error .wt-message-icon {
                    background: #fee2e2;
                    color: #dc2626;
                }

                .wt-message h3 {
                    font-size: 17px;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 0 0 8px;
                }

                .wt-message p {
                    font-size: 14px;
                    color: #64748b;
                    margin: 0 0 16px;
                    max-width: 420px;
                    margin-left: auto;
                    margin-right: auto;
                    line-height: 1.6;
                }

                .wt-table-wrap {
                    overflow-x: auto;
                    border: 1px solid #eef2f7;
                    border-radius: 14px;
                    margin-bottom: 22px;
                }

                .wt-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 14px;
                }

                .wt-table thead th {
                    position: sticky;
                    top: 0;
                    background: #f8fafc;
                    text-align: left;
                    font-size: 11.5px;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: #64748b;
                    padding: 14px 18px;
                    border-bottom: 1.5px solid #eef2f7;
                    white-space: nowrap;
                }

                .wt-table tbody tr {
                    transition: background .15s ease;
                }

                .wt-table tbody tr:not(:last-child) td {
                    border-bottom: 1px solid #f1f5f9;
                }

                .wt-table tbody tr:hover {
                    background: #f8fbff;
                }

                .wt-table td {
                    padding: 14px 18px;
                    color: #1e293b;
                    vertical-align: middle;
                }

                .wt-row-index {
                    color: #94a3b8;
                    font-weight: 600;
                    font-size: 13px;
                }

                .wt-id-chip {
                    display: inline-flex;
                    align-items: center;
                    font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
                    font-size: 12.5px;
                    font-weight: 700;
                    background: #eff6ff;
                    color: #1d4ed8;
                    border: 1px solid #dbeafe;
                    padding: 5px 10px;
                    border-radius: 8px;
                }

                .wt-name-cell {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 700;
                    color: #0f172a;
                }

                .wt-name-dot {
                    width: 9px;
                    height: 9px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #0ea5e9, #0284c7);
                    flex-shrink: 0;
                }

                .wt-name-empty {
                    color: #94a3b8;
                    font-style: italic;
                    font-weight: 500;
                }

                .wt-skel-row {
                    display: grid;
                    grid-template-columns: 40px 120px 1fr;
                    gap: 18px;
                    align-items: center;
                    padding: 16px 18px;
                    border-bottom: 1px solid #f1f5f9;
                }

                .wt-skel {
                    height: 14px;
                    border-radius: 6px;
                    background: linear-gradient(90deg, #eef2f7 25%, #f8fafc 37%, #eef2f7 63%);
                    background-size: 400% 100%;
                    animation: wtShimmer 1.4s ease infinite;
                }

                @keyframes wtShimmer {
                    0% { background-position: 100% 50%; }
                    100% { background-position: 0 50%; }
                }

                .wt-info-card {
                    background: linear-gradient(135deg, #f0f9ff 0%, #ecfeff 100%);
                    border: 1px solid #cffafe;
                    border-radius: 20px;
                    padding: 26px;
                }

                .wt-info-top {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                }

                .wt-info-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    background: #fff;
                    color: #0891b2;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
                }

                .wt-info-card h2 {
                    font-size: 18px;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 0;
                }

                .wt-info-card p {
                    font-size: 14px;
                    line-height: 1.7;
                    color: #475569;
                    margin: 0 0 10px;
                }

                .wt-info-card p:last-child {
                    margin-bottom: 0;
                }

                .wt-info-card strong {
                    color: #0f172a;
                }
            `}</style>


            {/* ======================================
                BACK TO DATA CENTER
                ====================================== */}

            <button
                className="wt-back"
                onClick={() => navigate("/data")}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to Data Center
            </button>


            {/* ======================================
                PAGE HEADER
                ====================================== */}

            <div className="wt-header">

                <div className="wt-header-content">

                    <span className="wt-eyebrow">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                            <path d="M12 21C16.5 17 20 13.4 20 9.5C20 5.9 17.3 3 12 3C6.7 3 4 5.9 4 9.5C4 13.4 7.5 17 12 21Z" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        DATA CENTER
                    </span>

                    <h1>Water Types</h1>

                    <p>
                        Browse the water body classifications
                        stored in the ToxicTide database.
                        These records are used to describe
                        the type of water associated with
                        monitoring stations.
                    </p>

                </div>

            </div>


            {/* ======================================
                LOADING
                ====================================== */}

            {loading && (

                <div className="wt-section" style={{ padding: "26px" }}>

                    <div style={{ marginBottom: "18px" }}>
                        <div className="wt-skel" style={{ width: "160px", height: "12px", marginBottom: "10px" }} />
                        <div className="wt-skel" style={{ width: "220px", height: "20px" }} />
                    </div>

                    <div className="wt-table-wrap">
                        {[...Array(6)].map((_, i) => (
                            <div className="wt-skel-row" key={i}>
                                <div className="wt-skel" style={{ width: "20px" }} />
                                <div className="wt-skel" style={{ width: "90px" }} />
                                <div className="wt-skel" style={{ width: "60%" }} />
                            </div>
                        ))}
                    </div>

                </div>

            )}


            {/* ======================================
                ERROR
                ====================================== */}

            {!loading && error && (

                <div className="wt-message wt-error">

                    <div className="wt-message-icon">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                            <path d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18A2 2 0 0 0 3.54 21H20.46A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <h3>Unable to Load Water Types</h3>

                    <p>{error}</p>

                    <button
                        className="wt-btn-secondary"
                        onClick={() => window.location.reload()}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path d="M4 4V9H4.58M20 20V15H19.42M4.58 9A8 8 0 0 1 19.42 15M4.58 9C6.03 6.14 8.79 4 12 4M19.42 15C17.97 17.86 15.21 20 12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
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
                        SUMMARY CARDS
                        ================================== */}

                    <div className="wt-stats">

                        {/* Total records */}

                        <div className="wt-stat-card total">

                            <div className="wt-stat-top">
                                <p className="wt-stat-label">Total Records</p>
                                <div className="wt-stat-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path d="M4 6C4 4.9 7.6 4 12 4C16.4 4 20 4.9 20 6C20 7.1 16.4 8 12 8C7.6 8 4 7.1 4 6Z" stroke="currentColor" strokeWidth="2" />
                                        <path d="M4 6V18C4 19.1 7.6 20 12 20C16.4 20 20 19.1 20 18V6" stroke="currentColor" strokeWidth="2" />
                                        <path d="M4 12C4 13.1 7.6 14 12 14C16.4 14 20 13.1 20 12" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                            </div>

                            <h2 className="wt-stat-value">{waterTypes.length}</h2>

                            <p className="wt-stat-desc">
                                Water type records currently
                                available in the database.
                            </p>

                        </div>


                        {/* Displayed records */}

                        <div className="wt-stat-card shown">

                            <div className="wt-stat-top">
                                <p className="wt-stat-label">Displayed</p>
                                <div className="wt-stat-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path d="M1 12S5 5 12 5S23 12 23 12S19 19 12 19S1 12 1 12Z" stroke="currentColor" strokeWidth="2" />
                                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                            </div>

                            <h2 className="wt-stat-value">{filteredWaterTypes.length}</h2>

                            <p className="wt-stat-desc">
                                Records matching the current
                                search.
                            </p>

                        </div>

                    </div>


                    {/* ==================================
                        SEARCH + DATABASE SECTION
                        ================================== */}

                    <div className="wt-section">


                        {/* Section header */}

                        <div className="wt-section-header">

                            <div>
                                <p className="wt-mini-label">WATER_TYPES</p>
                                <h2>Water Type Records</h2>
                            </div>


                            <span className="wt-count-pill">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                {filteredWaterTypes.length}{" "}
                                {filteredWaterTypes.length === 1 ? "record" : "records"}
                            </span>

                        </div>


                        {/* ==================================
                            SEARCH BAR
                            ================================== */}

                        <div className="wt-searchbar">

                            <div className="wt-search-input-wrap">

                                <svg className="wt-search-icon" width="17" height="17" viewBox="0 0 24 24" fill="none">
                                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(event.target.value)
                                    }
                                    placeholder="Search by water type name or Type ID..."
                                    aria-label="Search water types"
                                    className="wt-search-input"
                                />

                                {searchTerm && (
                                    <button
                                        className="wt-clear-inline"
                                        onClick={clearSearch}
                                        aria-label="Clear search"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                )}

                            </div>


                            {searchTerm && (

                                <button
                                    className="wt-btn-secondary"
                                    onClick={clearSearch}
                                >
                                    Clear Search
                                </button>

                            )}

                        </div>


                        {/* ==================================
                            NO RECORDS AT ALL
                            ================================== */}

                        {waterTypes.length === 0 && (

                            <div className="wt-message">

                                <div className="wt-message-icon">
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 21C16.5 17 20 13.4 20 9.5C20 5.9 17.3 3 12 3C6.7 3 4 5.9 4 9.5C4 13.4 7.5 17 12 21Z" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>

                                <h3>No Water Types Available</h3>

                                <p>
                                    No water type records are
                                    currently available in the
                                    ToxicTide database.
                                </p>

                            </div>

                        )}


                        {/* ==================================
                            NO SEARCH RESULTS
                            ================================== */}

                        {waterTypes.length > 0 &&
                            filteredWaterTypes.length === 0 && (

                                <div className="wt-message">

                                    <div className="wt-message-icon">
                                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                                            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                                            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </div>

                                    <h3>No Matching Water Types</h3>

                                    <p>
                                        No records match{" "}
                                        <strong>"{searchTerm}"</strong>.
                                    </p>

                                    <button
                                        className="wt-btn-secondary"
                                        onClick={clearSearch}
                                    >
                                        Clear Search
                                    </button>

                                </div>

                            )}


                        {/* ==================================
                            DATABASE TABLE
                            ================================== */}

                        {filteredWaterTypes.length > 0 && (

                            <div className="wt-table-wrap">

                                <table className="wt-table">

                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Type ID</th>
                                            <th>Water Type</th>
                                        </tr>
                                    </thead>


                                    <tbody>

                                        {filteredWaterTypes.map(
                                            (waterType, index) => (

                                                <tr key={waterType.TYPE_ID}>

                                                    <td className="wt-row-index">
                                                        {index + 1}
                                                    </td>

                                                    <td>
                                                        <span className="wt-id-chip">
                                                            {waterType.TYPE_ID}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {waterType.TYPE_NAME ? (
                                                            <div className="wt-name-cell">
                                                                <span className="wt-name-dot" />
                                                                {waterType.TYPE_NAME}
                                                            </div>
                                                        ) : (
                                                            <span className="wt-name-empty">
                                                                No name recorded
                                                            </span>
                                                        )}
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>


                    {/* ==================================
                        DATABASE INFORMATION
                        ================================== */}

                    <div className="wt-info-card">

                        <div className="wt-info-top">
                            <div className="wt-info-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 16V11M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h2>About Water Types</h2>
                        </div>

                        <p>
                            Water types are stored in the{" "}
                            <strong>WATER_TYPES</strong> table and are
                            referenced by monitoring stations through
                            their Type ID.
                        </p>

                        <p>
                            The records shown on this page
                            are loaded directly from the
                            ToxicTide backend. No water type
                            values are manually generated by
                            the interface.
                        </p>

                    </div>

                </>

            )}

        </div>

    );

}


export default WaterTypes;