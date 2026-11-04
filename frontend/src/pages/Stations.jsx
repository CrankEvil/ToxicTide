import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

// ============================================
// ICONS
// ============================================
const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
);
const IconMap = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>
);
const IconSearch = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const IconDatabase = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>
);
const IconDroplet = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69s5.66 5.6 8.5 10.14A8.5 8.5 0 0 1 12 21.5a8.5 8.5 0 0 1-8.5-8.67C6.34 8.29 12 2.69 12 2.69z" /></svg>
);
const IconMapPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);
const IconNavigation = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
);
const IconInbox = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>
);
const IconAlert = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
);
const IconChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
);
const IconGlobe = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
);


function Stations() {

    // Stores all monitoring stations received from MySQL
    const [stations, setStations] = useState([]);

    // Stores all official water types from the WATER_TYPES table
    const [waterTypes, setWaterTypes] = useState([]);

    // Stores all counties from the COUNTIES table
    const [counties, setCounties] = useState([]);

    // Stores the text entered into the search box
    const [search, setSearch] = useState("");

    // Controls the loading message while data is being fetched
    const [loading, setLoading] = useState(true);

    // Stores an error message if an API request fails
    const [error, setError] = useState("");

    // Allows navigation to other pages
    const navigate = useNavigate();


    // ============================================
    // LOAD STATION DATA
    // ============================================

    useEffect(() => {

        const loadStationData = async () => {

            try {

                /*
                 * Load the normalized database data.
                 *
                 * Stations come from STATION.
                 * Water types come from WATER_TYPES.
                 * Counties come from COUNTIES.
                 */
                const [
                    stationsResponse,
                    waterTypesResponse,
                    countiesResponse
                ] = await Promise.all([

                    fetch(
                        "https://toxictide-backend.onrender.com/api/stations"
                    ),

                    fetch(
                        "https://toxictide-backend.onrender.com/api/water-types"
                    ),

                    fetch(
                        "https://toxictide-backend.onrender.com/api/counties"
                    )

                ]);


                // Make sure all requests were successful
                if (
                    !stationsResponse.ok ||
                    !waterTypesResponse.ok ||
                    !countiesResponse.ok
                ) {
                    throw new Error(
                        "Failed to load station data"
                    );
                }


                // Convert API responses into JavaScript data
                const [
                    stationsData,
                    waterTypesData,
                    countiesData
                ] = await Promise.all([

                    stationsResponse.json(),
                    waterTypesResponse.json(),
                    countiesResponse.json()

                ]);


                // Store station records
                setStations(
                    Array.isArray(stationsData)
                        ? stationsData
                        : []
                );


                // Store all official water types
                setWaterTypes(
                    Array.isArray(waterTypesData)
                        ? waterTypesData
                        : []
                );


                // Store all counties
                setCounties(
                    Array.isArray(countiesData)
                        ? countiesData
                        : []
                );


            } catch (err) {

                console.error(
                    "Station data loading error:",
                    err
                );

                setError(
                    "Unable to load monitoring station data."
                );


            } finally {

                setLoading(false);

            }

        };


        loadStationData();

    }, []);


    // ============================================
    // COUNTY INFORMATION
    // ============================================

    /*
     * Find the county record connected to a station.
     *
     * STATION stores COUNTY_CODE as a foreign key.
     * The county information itself is stored in COUNTIES.
     */
    const getCountyRecord = (countyCode) => {

        return counties.find(
            (county) =>
                String(county.COUNTY_CODE) ===
                String(countyCode)
        );

    };


    /*
     * Get a readable county value.
     *
     * The current database may primarily provide COUNTY_CODE
     * and STATE, so the code is safely used when no county
     * name field exists.
     */
    const getCountyName = (countyCode) => {

        const county =
            getCountyRecord(countyCode);


        if (!county) {

            return String(
                countyCode ?? "N/A"
            );

        }


        return (
            county.COUNTY_NAME ??
            county.NAME ??
            county.COUNTY ??
            String(
                county.COUNTY_CODE ??
                "N/A"
            )
        );

    };


    /*
     * Get the state connected to the county.
     *
     * State is not added as a duplicate field to STATION.
     * It remains part of the normalized COUNTIES table.
     */
    const getCountyState = (countyCode) => {

        const county =
            getCountyRecord(countyCode);


        return String(
            county?.STATE ?? ""
        );

    };


    // ============================================
    // SEARCH / FILTER
    // ============================================

    /*
     * Search monitoring stations by:
     *
     * - Station ID
     * - Station Name
     * - Water Type
     * - County Code
     * - County Name, when available
     * - State
     */
    const filteredStations = stations.filter(
        (station) => {

            const searchText =
                search.trim().toLowerCase();


            // Display all stations when there is no search text
            if (!searchText) {

                return true;

            }


            const stationId =
                String(
                    station.STATION_ID ?? ""
                ).toLowerCase();


            const stationName =
                String(
                    station.STATION_NAME ?? ""
                ).toLowerCase();


            const waterType =
                String(
                    station.TYPE_NAME ?? ""
                ).toLowerCase();


            const countyCode =
                String(
                    station.COUNTY_CODE ?? ""
                ).toLowerCase();


            const countyName =
                getCountyName(
                    station.COUNTY_CODE
                ).toLowerCase();


            const countyState =
                getCountyState(
                    station.COUNTY_CODE
                ).toLowerCase();


            return (

                stationId.includes(searchText) ||

                stationName.includes(searchText) ||

                waterType.includes(searchText) ||

                countyCode.includes(searchText) ||

                countyName.includes(searchText) ||

                countyState.includes(searchText)

            );

        }
    );


    // ============================================
    // STATION STATISTICS
    // ============================================

    /*
     * Count stations that contain both latitude
     * and longitude values.
     */
    const locatedStationCount =
        stations.filter(
            (station) =>

                station.LATITUDE !== null &&
                station.LATITUDE !== undefined &&
                station.LONGITUDE !== null &&
                station.LONGITUDE !== undefined

        ).length;


    // ============================================
    // OPEN STATION DETAILS
    // ============================================

    /*
     * IMPORTANT:
     *
     * StationDetails.jsx expects:
     *
     * location.state.station
     *
     * Therefore we send the complete station object,
     * not only the station ID.
     */
    const openStationDetails = (station) => {

        navigate(
            "/station",
            {
                state: {
                    station
                }
            }
        );

    };


    // ============================================
    // PAGE
    // ============================================

    return (

        <div className="stn-page">

            <style>{`
                .stn-page {
                    min-height: 100vh;
                    background:
                        radial-gradient(1200px 500px at 10% -10%, rgba(16,185,129,0.09), transparent 60%),
                        radial-gradient(1000px 500px at 100% 0%, rgba(14,165,233,0.08), transparent 55%),
                        #f6f8fa;
                    padding: 28px 18px 80px;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    color: #0f172a;
                }
                .stn-shell { max-width: 1200px; margin: 0 auto; }

                .stn-back-btn {
                    display:inline-flex; align-items:center; gap:8px;
                    padding:9px 16px; border-radius:999px; border:1px solid #e2e8f0;
                    background:#fff; color:#334155; font-size:13.5px; font-weight:600;
                    cursor:pointer; box-shadow:0 1px 2px rgba(15,23,42,0.05);
                    transition:all .18s ease; margin-bottom:20px;
                }
                .stn-back-btn:hover { background:#0f172a; color:#fff; border-color:#0f172a; transform:translateX(-2px); }

                .stn-header { display:flex; gap:16px; align-items:flex-start; margin-bottom:24px; animation: stnFadeUp .5s ease both; }
                .stn-header-icon {
                    width:54px; height:54px; border-radius:16px; flex-shrink:0;
                    display:flex; align-items:center; justify-content:center;
                    background:linear-gradient(135deg,#10b981,#059669); color:#fff;
                    box-shadow:0 12px 26px -10px rgba(5,150,105,0.5);
                }
                .stn-eyebrow {
                    display:inline-block; font-size:11.5px; font-weight:800; letter-spacing:.09em;
                    color:#059669; background:#ecfdf5; padding:4px 10px; border-radius:999px; margin-bottom:8px;
                }
                .stn-header h1 { font-size:28px; font-weight:800; margin:0 0 6px 0; letter-spacing:-0.02em; }
                .stn-header p { margin:0; color:#5a6b7c; font-size:14.5px; line-height:1.6; max-width:600px; }

                .stn-stats-row {
                    display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:22px;
                    animation: stnFadeUp .55s ease both;
                }
                .stn-stat-card {
                    background:#fff; border:1px solid #e7ecf0; border-radius:16px; padding:18px;
                    display:flex; align-items:center; gap:13px;
                    box-shadow:0 1px 3px rgba(15,23,42,0.04); transition:transform .18s ease, box-shadow .18s ease;
                }
                .stn-stat-card:hover { transform:translateY(-3px); box-shadow:0 14px 26px -16px rgba(15,23,42,0.22); }
                .stn-stat-icon { width:40px; height:40px; border-radius:11px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
                .stn-stat-card strong { display:block; font-size:22px; font-weight:800; color:#0f172a; line-height:1.1; }
                .stn-stat-card span { font-size:11.5px; font-weight:700; color:#8a9aad; text-transform:uppercase; letter-spacing:.05em; }

                .stn-card {
                    background:#fff; border:1px solid #e7ecf0; border-radius:20px; padding:24px;
                    box-shadow:0 1px 3px rgba(15,23,42,0.04), 0 12px 32px -22px rgba(15,23,42,0.12);
                    animation: stnFadeUp .6s ease both;
                }

                .stn-toolbar {
                    display:flex; justify-content:space-between; align-items:flex-start; gap:16px;
                    flex-wrap:wrap; margin-bottom:20px; padding-bottom:20px; border-bottom:1px solid #f0f2f5;
                }
                .stn-toolbar h2 { margin:0 0 6px 0; font-size:19px; font-weight:800; }
                .stn-toolbar p { margin:0; font-size:13.5px; color:#6b7683; }

                .stn-search-wrap { position:relative; min-width:280px; }
                .stn-search-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#9aa5b1; }
                .stn-search-input {
                    width:100%; padding:11px 14px 11px 38px; border:1.5px solid #e2e8f0; border-radius:11px;
                    font-size:14px; background:#fbfcfd; transition:all .15s ease; box-sizing:border-box;
                }
                .stn-search-input:focus { outline:none; border-color:#10b981; background:#fff; box-shadow:0 0 0 4px rgba(16,185,129,0.12); }

                .stn-result-line {
                    padding:0 0 16px 0; color:#6b7683; font-size:13.8px;
                    display:flex; align-items:center; gap:8px; flex-wrap:wrap;
                }
                .stn-search-tag {
                    display:inline-flex; align-items:center; gap:6px; background:#ecfdf5; color:#059669;
                    padding:3px 10px; border-radius:999px; font-size:12px; font-weight:700;
                }

                .stn-table-wrapper { overflow-x:auto; border:1px solid #eef1f4; border-radius:14px; }
                .stn-table { width:100%; border-collapse:collapse; font-size:13.8px; min-width:920px; }
                .stn-table thead th {
                    background:#f8fafc; text-align:left; padding:13px 16px; font-size:11px; font-weight:800;
                    letter-spacing:.05em; text-transform:uppercase; color:#94a3b8; border-bottom:1px solid #eef1f4; white-space:nowrap;
                }
                .stn-table tbody tr { transition: background .12s ease; }
                .stn-table tbody tr:hover { background:#f6fdf9; }
                .stn-table tbody tr:not(:last-child) td { border-bottom:1px solid #f2f4f7; }
                .stn-table td { padding:13px 16px; color:#334155; vertical-align:middle; }

                .stn-id-badge {
                    display:inline-flex; align-items:center; gap:6px; background:#f1f5f9; color:#334155;
                    padding:4px 10px; border-radius:8px; font-size:12.5px; font-weight:700; font-family:'SF Mono',monospace;
                }
                .stn-name-cell { display:flex; align-items:center; gap:9px; font-weight:600; color:#0f172a; }
                .stn-name-icon { width:28px; height:28px; border-radius:8px; background:#ecfdf5; color:#059669; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

                .stn-type-pill {
                    display:inline-flex; align-items:center; gap:6px; background:#eff6ff; color:#1d4ed8;
                    padding:4px 11px; border-radius:999px; font-size:12.3px; font-weight:700;
                }
                .stn-type-pill.muted { background:#f1f5f9; color:#94a3b8; }

                .stn-county-name { font-weight:600; color:#0f172a; display:flex; align-items:center; gap:6px; }
                .stn-county-meta { color:#94a3b8; font-size:11.8px; margin-top:2px; display:flex; align-items:center; gap:4px; }

                .stn-coord { font-family:'SF Mono',monospace; font-size:12.8px; color:#475569; }
                .stn-coord.missing { color:#c2cad4; font-family:inherit; font-style:italic; }

                .stn-detail-btn {
                    display:inline-flex; align-items:center; gap:6px;
                    padding:7px 13px; border:1.5px solid #d1fae5; border-radius:9px;
                    background:#ecfdf5; color:#059669; cursor:pointer; font-size:12.8px; font-weight:700;
                    transition:all .15s ease;
                }
                .stn-detail-btn:hover { background:#059669; color:#fff; border-color:#059669; transform:translateX(2px); }

                .stn-empty-cell { text-align:center; padding:56px 20px; }
                .stn-empty-icon { width:64px; height:64px; border-radius:999px; background:#f1f5f9; color:#94a3b8; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; }
                .stn-empty-cell strong { display:block; font-size:15.5px; color:#334155; margin-bottom:6px; }
                .stn-empty-cell p { margin:0; color:#8a9aad; font-size:13.5px; }

                .stn-state-block { text-align:center; padding:60px 20px; }
                .stn-spin-icon { width:44px; height:44px; margin:0 auto 16px; border-radius:999px; border:3px solid #d1fae5; border-top-color:#059669; animation: stnSpin .7s linear infinite; }
                .stn-state-block h3 { margin:0 0 6px 0; font-size:16px; font-weight:800; }
                .stn-state-block p { margin:0; color:#8a9aad; font-size:13.5px; }

                .stn-error-block { text-align:center; padding:46px 20px; background:#fff5f5; border:1px solid #fecaca; border-radius:16px; }
                .stn-error-icon { width:54px; height:54px; border-radius:999px; background:#fee2e2; color:#dc2626; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; }
                .stn-error-block p { margin:0; color:#991b1b; font-size:14.5px; font-weight:600; }

                @keyframes stnFadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
                @keyframes stnSpin { to { transform: rotate(360deg); } }

                @media (max-width: 900px) {
                    .stn-stats-row { grid-template-columns:repeat(2,1fr); }
                }
                @media (max-width: 640px) {
                    .stn-header { flex-direction:column; }
                    .stn-toolbar { flex-direction:column; align-items:stretch; }
                    .stn-search-wrap { min-width:100%; }
                    .stn-card { padding:18px; }
                }
            `}</style>


            <div className="stn-shell">


                {/* ========================================
                    PAGE HEADER
                    ======================================== */}

                <button
                    type="button"
                    className="stn-back-btn"
                    onClick={() => navigate("/data")}
                >
                    <IconArrowLeft /> Back to Data Center
                </button>

                <div className="stn-header">
                    <div className="stn-header-icon"><IconMap /></div>
                    <div>
                        <span className="stn-eyebrow">DATA CENTER</span>
                        <h1>Monitoring Stations</h1>
                        <p>Explore official water monitoring stations included in the ToxicTide database.</p>
                    </div>
                </div>


                {/* ========================================
                    SUMMARY CARDS
                    ======================================== */}

                <div className="stn-stats-row">

                    <div className="stn-stat-card">
                        <div className="stn-stat-icon" style={{ background: "#ecfdf5", color: "#059669" }}><IconMap /></div>
                        <div>
                            <strong>{stations.length}</strong>
                            <span>Total Stations</span>
                        </div>
                    </div>

                    <div className="stn-stat-card">
                        <div className="stn-stat-icon" style={{ background: "#eff6ff", color: "#1d4ed8" }}><IconDroplet /></div>
                        <div>
                            <strong>{waterTypes.length}</strong>
                            <span>Water Types</span>
                        </div>
                    </div>

                    <div className="stn-stat-card">
                        <div className="stn-stat-icon" style={{ background: "#f5f3ff", color: "#7c3aed" }}><IconMapPin /></div>
                        <div>
                            <strong>{counties.length}</strong>
                            <span>Counties</span>
                        </div>
                    </div>

                    <div className="stn-stat-card">
                        <div className="stn-stat-icon" style={{ background: "#fffbeb", color: "#d97706" }}><IconNavigation /></div>
                        <div>
                            <strong>{locatedStationCount}</strong>
                            <span>Located Stations</span>
                        </div>
                    </div>

                </div>


                {/* ========================================
                    STATION DIRECTORY
                    ======================================== */}

                <div className="stn-card">


                    {/* Toolbar */}
                    <div className="stn-toolbar">

                        <div>
                            <h2>Station Directory</h2>
                            <p>Search by station, water type, county, or state.</p>
                        </div>


                        {/* Search input */}
                        <div className="stn-search-wrap">
                            <span className="stn-search-icon"><IconSearch /></span>
                            <input
                                type="text"
                                placeholder="Search station, water type, county..."
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                className="stn-search-input"
                                aria-label="Search monitoring stations"
                            />
                        </div>

                    </div>


                    {/* ====================================
                        LOADING STATE
                        ==================================== */}

                    {loading && (
                        <div className="stn-state-block">
                            <div className="stn-spin-icon" />
                            <h3>Loading monitoring stations</h3>
                            <p>Retrieving station records from the ToxicTide database.</p>
                        </div>
                    )}


                    {/* ====================================
                        ERROR STATE
                        ==================================== */}

                    {error && (
                        <div className="stn-error-block">
                            <div className="stn-error-icon"><IconAlert /></div>
                            <p>{error}</p>
                        </div>
                    )}


                    {/* ====================================
                        LOADED CONTENT
                        ==================================== */}

                    {!loading && !error && (

                        <>

                            {/* Search result count */}
                            <div className="stn-result-line">

                                Showing <strong>{filteredStations.length}</strong> of{" "}
                                <strong>{stations.length}</strong> monitoring stations

                                {search.trim() && (
                                    <span className="stn-search-tag">
                                        <IconSearch /> "{search}"
                                    </span>
                                )}

                            </div>


                            {/* ==================================
                                TABLE
                                ================================== */}

                            <div className="stn-table-wrapper">

                                <table className="stn-table">

                                    <thead>
                                        <tr>
                                            <th>Station ID</th>
                                            <th>Station Name</th>
                                            <th>Water Type</th>
                                            <th>County</th>
                                            <th>Latitude</th>
                                            <th>Longitude</th>
                                            <th>Details</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {filteredStations.length === 0 ? (

                                            <tr>
                                                <td colSpan="7" className="stn-empty-cell">
                                                    <div className="stn-empty-icon"><IconInbox /></div>
                                                    <strong>No matching stations found</strong>
                                                    <p>Try adjusting your search terms.</p>
                                                </td>
                                            </tr>

                                        ) : (

                                            filteredStations.map((station) => (

                                                <tr key={station.STATION_ID}>

                                                    <td>
                                                        <span className="stn-id-badge">
                                                            {station.STATION_ID ?? "N/A"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <span className="stn-name-cell">
                                                            <span className="stn-name-icon"><IconMapPin /></span>
                                                            {station.STATION_NAME ?? "N/A"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {station.TYPE_NAME ? (
                                                            <span className="stn-type-pill">
                                                                <IconDroplet /> {station.TYPE_NAME}
                                                            </span>
                                                        ) : (
                                                            <span className="stn-type-pill muted">N/A</span>
                                                        )}
                                                    </td>

                                                    <td>
                                                        <div className="stn-county-name">
                                                            <IconGlobe /> {getCountyName(station.COUNTY_CODE)}
                                                        </div>
                                                        <div className="stn-county-meta">
                                                            Code: {station.COUNTY_CODE ?? "N/A"}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        {station.LATITUDE !== null && station.LATITUDE !== undefined ? (
                                                            <span className="stn-coord">{station.LATITUDE}</span>
                                                        ) : (
                                                            <span className="stn-coord missing">N/A</span>
                                                        )}
                                                    </td>

                                                    <td>
                                                        {station.LONGITUDE !== null && station.LONGITUDE !== undefined ? (
                                                            <span className="stn-coord">{station.LONGITUDE}</span>
                                                        ) : (
                                                            <span className="stn-coord missing">N/A</span>
                                                        )}
                                                    </td>

                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="stn-detail-btn"
                                                            onClick={() => openStationDetails(station)}
                                                        >
                                                            View <IconChevronRight />
                                                        </button>
                                                    </td>

                                                </tr>

                                            ))

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </>

                    )}

                </div>

            </div>

        </div>

    );

}

export default Stations;