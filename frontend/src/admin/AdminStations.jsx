// ============================================
// IMPORTS
// ============================================

// React tools we need: useEffect (run code on load), useState (store data that changes).
import { useEffect, useState } from "react";

// Lets us send the admin back to the main admin dashboard.
import { useNavigate } from "react-router-dom";

import { adminFetch } from "../adminApi";

// Shared base styles used across the whole admin system (kept exactly as before).
import "../App.css";

// New cinematic styling created ONLY for this page.
// All class names inside this file start with "stations-command-" so other
// admin pages (Counties, Water Types, Measurements, etc.) are never affected.
import "./AdminStations.css";


// ============================================
// SMALL ICON COMPONENTS (inline SVG, no emoji, no extra packages)
// ============================================

// Back arrow used in the header navigation button.
const IconArrowLeft = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Refresh / synchronize icon for the "Refresh" button.
const IconRefresh = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12a9 9 0 0 1 15.3-6.3L21 8M21 3v5h-5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12a9 9 0 0 1-15.3 6.3L3 16M3 21v-5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Plus icon for the "Register Station" submit button.
const IconPlus = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
);

// Checkmark icon for success messages.
const IconCheck = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Warning icon for error messages and delete warnings.
const IconWarning = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" strokeLinejoin="round" />
    </svg>
);

// Pencil icon for the Edit button.
const IconEdit = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 20h9" strokeLinecap="round" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinejoin="round" />
    </svg>
);

// Trash icon for the Delete button.
const IconTrash = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 6h18M8 6V4h8v2m-1 0v14H9V6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Save / commit icon.
const IconSave = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" strokeLinejoin="round" />
        <path d="M17 21v-8H7v8M7 3v5h8" strokeLinejoin="round" />
    </svg>
);

// Cancel / abort icon.
const IconX = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
);


function AdminStations() {

    // ============================================
    // COMPONENT STATE
    // ============================================

    // Store all monitoring stations returned by the backend.
    const [stations, setStations] = useState([]);

    // Store the list of valid water types (used to fill the dropdown).
    const [waterTypes, setWaterTypes] = useState([]);

    // Store the list of valid counties (used to fill the dropdown).
    const [counties, setCounties] = useState([]);

    // These hold the values typed into the "Register Monitoring Station" form.
    const [stationId, setStationId] = useState("");
    const [stationName, setStationName] = useState("");
    const [typeId, setTypeId] = useState("");
    const [countyCode, setCountyCode] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    // editingId tracks WHICH station row is currently being edited.
    // editingStation holds the temporary edited values for that row.
    const [editingId, setEditingId] = useState(null);
    const [editingStation, setEditingStation] = useState({});

    // loading = true while stations are being fetched from the backend.
    const [loading, setLoading] = useState(true);

    // error holds a human readable error message when something goes wrong.
    const [error, setError] = useState("");

    // message holds a human readable success message after add/update/delete.
    const [message, setMessage] = useState("");

    // isRefreshing is ONLY a visual flag so the refresh icon can spin.
    // It never changes any backend data, it just makes the UI feel alive.
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Lets us send the admin back to "/admin" when they click the back button.
    const navigate = useNavigate();


    // ============================================
    // STATION API OPERATIONS
    // ============================================

    // Load all monitoring stations from the backend.
    const fetchStations = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await adminFetch(
                "http://localhost:5000/api/admin/stations"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to load monitoring stations"
                );
            }

            setStations(data);

        } catch (error) {

            console.error(error);
            setError(error.message);

        } finally {

            setLoading(false);
        }
    };


    // ============================================
    // REFERENCE DATA OPERATIONS
    // ============================================

    // Load water types so the admin can choose a valid type for a station.
    const fetchWaterTypes = async () => {

        try {

            const response = await adminFetch(
                "http://localhost:5000/api/admin/water-types"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to load water types"
                );
            }

            setWaterTypes(data);

        } catch (error) {

            console.error(error);
            setError(error.message);
        }
    };


    // Load counties so each station can be connected to a real county.
    const fetchCounties = async () => {

        try {

            const response = await adminFetch(
                "http://localhost:5000/api/admin/counties"
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
        }
    };


    // Load stations, water types, and counties as soon as the page opens.
    useEffect(() => {

        fetchStations();
        fetchWaterTypes();
        fetchCounties();

    }, []);


    // ============================================
    // ADD / EDIT / DELETE LOGIC
    // ============================================

    // Send a new monitoring station to the backend.
    const handleAdd = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");

        try {

            const response = await adminFetch(
                "http://localhost:5000/api/admin/stations",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        stationId: stationId.trim(),
                        stationName: stationName.trim(),
                        typeId: Number(typeId),
                        countyCode: countyCode,
                        latitude: latitude === ""
                            ? null
                            : Number(latitude),
                        longitude: longitude === ""
                            ? null
                            : Number(longitude)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to add monitoring station"
                );
            }

            setMessage(
                "Monitoring station added successfully."
            );

            // Clear the form so the admin can register another station.
            setStationId("");
            setStationName("");
            setTypeId("");
            setCountyCode("");
            setLatitude("");
            setLongitude("");

            fetchStations();

        } catch (error) {

            console.error(error);
            setError(error.message);
        }
    };


    // Put a station row into "edit mode" and preload its current values.
    const startEdit = (station) => {

        setEditingId(station.STATION_ID);

        setEditingStation({
            stationName: station.STATION_NAME,
            typeId: station.TYPE_ID,
            countyCode: station.COUNTY_CODE,
            latitude: station.LATITUDE ?? "",
            longitude: station.LONGITUDE ?? ""
        });

        setError("");
        setMessage("");
    };


    // Leave edit mode without saving any changes.
    const cancelEdit = () => {

        setEditingId(null);
        setEditingStation({});
    };


    // Send the edited station values to the backend to update the record.
    const handleUpdate = async (id) => {

        setError("");
        setMessage("");

        try {

            const response = await adminFetch(
                `http://localhost:5000/api/admin/stations/${encodeURIComponent(id)}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        stationName:
                            editingStation.stationName.trim(),

                        typeId:
                            Number(editingStation.typeId),

                        countyCode:
                            editingStation.countyCode,

                        latitude:
                            editingStation.latitude === ""
                                ? null
                                : Number(editingStation.latitude),

                        longitude:
                            editingStation.longitude === ""
                                ? null
                                : Number(editingStation.longitude)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to update monitoring station"
                );
            }

            setMessage(
                "Monitoring station updated successfully."
            );

            cancelEdit();
            fetchStations();

        } catch (error) {

            console.error(error);
            setError(error.message);
        }
    };


    // Delete a monitoring station after the admin confirms the warning.
    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Delete this monitoring station? Its linked measurement records may prevent deletion."
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setMessage("");

        try {

            const response = await adminFetch(
                `http://localhost:5000/api/admin/stations/${encodeURIComponent(id)}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to delete monitoring station"
                );
            }

            setMessage(
                "Monitoring station deleted successfully."
            );

            fetchStations();

        } catch (error) {

            console.error(error);
            setError(error.message);
        }
    };


    // Wraps fetchStations with a short visual "spin" for the refresh icon.
    // This does NOT change any data logic, it only affects the animation.
    const handleRefreshClick = async () => {
        setIsRefreshing(true);
        await fetchStations();
        setIsRefreshing(false);
    };


    // ============================================
    // 3D TILT MICRO-INTERACTION (visual only)
    // ============================================
    // These two functions give major panels a very subtle 3D tilt that
    // follows the mouse. The rotation is capped at a couple of degrees
    // so it stays elegant instead of feeling like a spinning toy.

    const handleCardTilt = (event) => {
        const card = event.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -2;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 2;
        card.style.setProperty("--tilt-x", `${rotateX}deg`);
        card.style.setProperty("--tilt-y", `${rotateY}deg`);
    };

    const resetCardTilt = (event) => {
        event.currentTarget.style.setProperty("--tilt-x", "0deg");
        event.currentTarget.style.setProperty("--tilt-y", "0deg");
    };


    // ============================================
    // DERIVED STATUS FLAGS (based on REAL loaded data, nothing invented)
    // ============================================

    const isNetworkActive = !loading && !error;
    const isTypesLoaded = waterTypes.length > 0;
    const isCountiesLoaded = counties.length > 0;

    // Used to place a limited number of real station nodes around the
    // decorative network globe. This is a visual layout, not new data.
    const visualNodes = stations.slice(0, 12);


    return (
        <div className="stations-command-page">

            {/* ============================================
                CINEMATIC BACKGROUND LAYERS
            ============================================ */}
            <div className="stations-command-bg" aria-hidden="true">
                <div className="stations-command-bg-grid" />
                <div className="stations-command-bg-glow stations-command-bg-glow-1" />
                <div className="stations-command-bg-glow stations-command-bg-glow-2" />
                <div className="stations-command-scan-sweep" />
                <div className="stations-command-particles">
                    {Array.from({ length: 18 }).map((_, i) => (
                        <span key={i} className="stations-command-particle" />
                    ))}
                </div>
            </div>

            <div className="stations-command-content">

                {/* ============================================
                    COMMAND CENTER HEADER
                ============================================ */}
                <header className="stations-command-header">

                    <div className="stations-command-brand">
                        <span className="stations-command-brand-main">TOXICTIDE</span>
                        <span className="stations-command-brand-sub">MONITORING NETWORK</span>
                    </div>

                    <div className="stations-command-header-right">

                        <div className={`stations-command-status ${isNetworkActive ? "is-online" : "is-warning"}`}>
                            <span className="stations-command-status-dot" />
                            {isNetworkActive ? "SYSTEM ONLINE" : "SYSTEM ATTENTION"}
                        </div>

                        {/* This button keeps the exact original navigation behavior. */}
                        <button
                            type="button"
                            className="stations-command-back-button"
                            onClick={() => navigate("/admin")}
                        >
                            <IconArrowLeft />
                            ADMIN COMMAND CENTER
                        </button>

                    </div>

                </header>


                {/* ============================================
                    MONITORING NETWORK HERO
                ============================================ */}
                <section className="stations-command-hero">

                    <div className="stations-command-hero-text">

                        <p className="stations-command-eyebrow">
                            <span className="stations-command-status-dot small" />
                            NETWORK ONLINE
                        </p>

                        <h1 className="stations-command-title">
                            MONITORING
                            <br />
                            STATION NETWORK
                        </h1>

                        <p className="stations-command-subtitle">
                            OFFICIAL TOXICTIDE ENVIRONMENTAL MONITORING NETWORK
                        </p>

                        <p className="stations-command-description">
                            Manage official ToxicTide environmental monitoring stations.
                        </p>

                        {/* Real system numbers pulled straight from the loaded arrays. */}
                        <div className="stations-command-stat-row">

                            <div className="stations-command-stat">
                                <span className="stations-command-stat-value">{stations.length}</span>
                                <span className="stations-command-stat-label">STATIONS</span>
                            </div>

                            <div className="stations-command-stat">
                                <span className="stations-command-stat-value">{waterTypes.length}</span>
                                <span className="stations-command-stat-label">WATER TYPES</span>
                            </div>

                            <div className="stations-command-stat">
                                <span className="stations-command-stat-value">{counties.length}</span>
                                <span className="stations-command-stat-label">COUNTIES</span>
                            </div>

                        </div>

                    </div>


                    {/* ============================================
                        3D MONITORING NETWORK VISUALIZATION
                    ============================================ */}
                    <div
                        className="stations-command-network-panel stations-command-tilt"
                        onMouseMove={handleCardTilt}
                        onMouseLeave={resetCardTilt}
                    >

                        <div className="stations-command-network-visual" aria-hidden="true">

                            <div className="stations-command-globe">
                                <div className="stations-command-globe-core" />
                                <div className="stations-command-globe-grid-h" />
                                <div className="stations-command-globe-grid-v" />
                                <div className="stations-command-ring ring-1" />
                                <div className="stations-command-ring ring-2" />
                                <div className="stations-command-ring ring-3" />
                                <div className="stations-command-globe-scan" />

                                {/* One glowing node per real monitoring station (capped for clarity). */}
                                {visualNodes.map((station, index) => {
                                    const angle = (360 / Math.max(visualNodes.length, 1)) * index;
                                    return (
                                        <div
                                            key={station.STATION_ID}
                                            className="stations-command-node"
                                            style={{ transform: `rotate(${angle}deg) translateX(115px) rotate(${-angle}deg)` }}
                                            title={station.STATION_ID}
                                        >
                                            <span className="stations-command-node-dot" />
                                        </div>
                                    );
                                })}
                            </div>

                        </div>

                        {/* ============================================
                            NETWORK STATUS HUD
                        ============================================ */}
                        <div className="stations-command-hud">

                            <div className={`stations-command-hud-item ${isNetworkActive ? "is-active" : ""}`}>
                                <span className="stations-command-hud-label">MONITORING NETWORK</span>
                                <span className="stations-command-hud-value">{isNetworkActive ? "ACTIVE" : "SYNCING"}</span>
                            </div>

                            <div className={`stations-command-hud-item ${isTypesLoaded ? "is-active" : ""}`}>
                                <span className="stations-command-hud-label">REFERENCE TYPES</span>
                                <span className="stations-command-hud-value">{isTypesLoaded ? "LOADED" : "PENDING"}</span>
                            </div>

                            <div className={`stations-command-hud-item ${isCountiesLoaded ? "is-active" : ""}`}>
                                <span className="stations-command-hud-label">COUNTY DATA</span>
                                <span className="stations-command-hud-value">{isCountiesLoaded ? "LOADED" : "PENDING"}</span>
                            </div>

                            <div className="stations-command-hud-item is-active">
                                <span className="stations-command-hud-label">ADMIN ACCESS</span>
                                <span className="stations-command-hud-value">AUTHORIZED</span>
                            </div>

                        </div>

                    </div>

                </section>


                {/* ============================================
                    MESSAGES — SUCCESS / ERROR FEEDBACK
                ============================================ */}
                {message && (
                    <div className="stations-command-message success">
                        <IconCheck />
                        <span><strong>NETWORK NODE REGISTERED</strong> — {message}</span>
                    </div>
                )}

                {error && (
                    <div className="stations-command-message error">
                        <IconWarning />
                        <span><strong>TRANSACTION FAILED</strong> — {error}</span>
                    </div>
                )}


                {/* ============================================
                    STATION REGISTRATION CONSOLE
                ============================================ */}
                <section
                    className="stations-command-panel stations-command-tilt"
                    onMouseMove={handleCardTilt}
                    onMouseLeave={resetCardTilt}
                >

                    <div className="stations-command-panel-heading">
                        <h2>REGISTER MONITORING STATION</h2>
                        <p>Add a new official ToxicTide monitoring node to the network.</p>
                    </div>

                    <form onSubmit={handleAdd} className="stations-command-form">

                        {/* --- IDENTITY GROUP --- */}
                        <div className="stations-command-form-section">

                            <p className="stations-command-form-section-label">IDENTITY</p>

                            <div className="stations-command-form-grid">

                                <div className="stations-command-field">
                                    <label htmlFor="stationId">Station ID</label>
                                    <input
                                        id="stationId"
                                        type="text"
                                        className="stations-command-input mono"
                                        value={stationId}
                                        onChange={(event) => setStationId(event.target.value)}
                                        placeholder="Example: USGS-03216070"
                                        required
                                    />
                                </div>

                                <div className="stations-command-field">
                                    <label htmlFor="stationName">Station Name</label>
                                    <input
                                        id="stationName"
                                        type="text"
                                        className="stations-command-input"
                                        value={stationName}
                                        onChange={(event) => setStationName(event.target.value)}
                                        placeholder="Enter station name"
                                        required
                                    />
                                </div>

                            </div>

                        </div>

                        {/* --- CLASSIFICATION GROUP --- */}
                        <div className="stations-command-form-section">

                            <p className="stations-command-form-section-label">CLASSIFICATION</p>

                            <div className="stations-command-form-grid">

                                <div className="stations-command-field">
                                    <label htmlFor="typeId">Water Type</label>
                                    <select
                                        id="typeId"
                                        className="stations-command-input"
                                        value={typeId}
                                        onChange={(event) => setTypeId(event.target.value)}
                                        required
                                    >
                                        <option value="">Select water type</option>
                                        {waterTypes.map((type) => (
                                            <option key={type.TYPE_ID} value={type.TYPE_ID}>
                                                {type.TYPE_NAME}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="stations-command-field">
                                    <label htmlFor="countyCode">County</label>
                                    <select
                                        id="countyCode"
                                        className="stations-command-input"
                                        value={countyCode}
                                        onChange={(event) => setCountyCode(event.target.value)}
                                        required
                                    >
                                        <option value="">Select county</option>
                                        {counties.map((county) => (
                                            <option key={county.COUNTY_CODE} value={county.COUNTY_CODE}>
                                                {county.COUNTY_CODE} — {county.STATE}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                            </div>

                        </div>

                        {/* --- GEOGRAPHICAL POSITION GROUP --- */}
                        <div className="stations-command-form-section">

                            <p className="stations-command-form-section-label">GEOGRAPHICAL POSITION</p>

                            <div className="stations-command-form-grid">

                                <div className="stations-command-field">
                                    <label htmlFor="latitude">Latitude</label>
                                    <input
                                        id="latitude"
                                        type="number"
                                        step="any"
                                        className="stations-command-input mono"
                                        value={latitude}
                                        onChange={(event) => setLatitude(event.target.value)}
                                        placeholder="Example: 38.532056"
                                    />
                                </div>

                                <div className="stations-command-field">
                                    <label htmlFor="longitude">Longitude</label>
                                    <input
                                        id="longitude"
                                        type="number"
                                        step="any"
                                        className="stations-command-input mono"
                                        value={longitude}
                                        onChange={(event) => setLongitude(event.target.value)}
                                        placeholder="Example: -82.685944"
                                    />
                                </div>

                            </div>

                        </div>

                        <button type="submit" className="stations-command-primary-button">
                            <IconPlus />
                            REGISTER STATION
                        </button>

                    </form>

                </section>


                {/* ============================================
                    MONITORING STATION DATABASE
                ============================================ */}
                <section
                    className="stations-command-panel stations-command-tilt"
                    onMouseMove={handleCardTilt}
                    onMouseLeave={resetCardTilt}
                >

                    <div className="stations-command-panel-heading row">

                        <div>
                            <h2>MONITORING STATION DATABASE</h2>
                            <p>{stations.length} station record{stations.length === 1 ? "" : "s"} in the network</p>
                        </div>

                        <button
                            type="button"
                            className={`stations-command-secondary-button ${isRefreshing ? "is-spinning" : ""}`}
                            onClick={handleRefreshClick}
                        >
                            <span className="stations-command-refresh-icon"><IconRefresh /></span>
                            SYNCHRONIZE NETWORK
                        </button>

                    </div>


                    {/* ============================================
                        LOADING STATE
                    ============================================ */}
                    {loading ? (

                        <div className="stations-command-loading">
                            <div className="stations-command-loading-scanner">
                                <div className="stations-command-loading-ring" />
                                <div className="stations-command-loading-core" />
                            </div>
                            <p>SYNCING MONITORING NETWORK</p>
                            <span>Retrieving station records from the ToxicTide database…</span>
                        </div>

                    ) : stations.length === 0 ? (

                        /* ============================================
                            EMPTY STATE
                        ============================================ */
                        <div className="stations-command-empty">
                            <p className="stations-command-empty-title">NO MONITORING STATIONS</p>
                            <p className="stations-command-empty-subtitle">NETWORK READY FOR INITIALIZATION</p>
                            <p className="stations-command-empty-hint">
                                Use the registration console above to add the first monitoring node.
                            </p>
                        </div>

                    ) : (

                        /* ============================================
                            STATION TABLE (data comes straight from `stations`)
                        ============================================ */
                        <div className="stations-command-table-wrap">

                            <table className="stations-command-table">

                                <thead>
                                    <tr>
                                        <th>Station ID</th>
                                        <th>Station Name</th>
                                        <th>Water Type</th>
                                        <th>County</th>
                                        <th>State</th>
                                        <th>Latitude</th>
                                        <th>Longitude</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {stations.map((station) => {
                                        const isEditing = editingId === station.STATION_ID;

                                        return (
                                            <tr
                                                key={station.STATION_ID}
                                                className={isEditing ? "stations-command-row-editing" : "stations-command-row"}
                                            >

                                                {/* Station ID displayed like a technical network identifier. */}
                                                <td data-label="Station ID">
                                                    <span className="stations-command-id">
                                                        <span className="stations-command-id-dot" />
                                                        {station.STATION_ID}
                                                    </span>

                                                    {isEditing && (
                                                        <span className="stations-command-editing-tag">EDITING NODE</span>
                                                    )}
                                                </td>


                                                {/* Station name — editable field. */}
                                                <td data-label="Station Name">
                                                    {isEditing ? (
                                                        <input
                                                            className="stations-command-inline-input"
                                                            type="text"
                                                            value={editingStation.stationName}
                                                            onChange={(event) =>
                                                                setEditingStation({
                                                                    ...editingStation,
                                                                    stationName: event.target.value
                                                                })
                                                            }
                                                        />
                                                    ) : (
                                                        station.STATION_NAME
                                                    )}
                                                </td>


                                                {/* Water type — editable dropdown using real backend list. */}
                                                <td data-label="Water Type">
                                                    {isEditing ? (
                                                        <select
                                                            className="stations-command-inline-input"
                                                            value={editingStation.typeId}
                                                            onChange={(event) =>
                                                                setEditingStation({
                                                                    ...editingStation,
                                                                    typeId: event.target.value
                                                                })
                                                            }
                                                        >
                                                            {waterTypes.map((type) => (
                                                                <option key={type.TYPE_ID} value={type.TYPE_ID}>
                                                                    {type.TYPE_NAME}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        station.TYPE_NAME
                                                    )}
                                                </td>


                                                {/* County — editable dropdown using real backend list. */}
                                                <td data-label="County">
                                                    {isEditing ? (
                                                        <select
                                                            className="stations-command-inline-input"
                                                            value={editingStation.countyCode}
                                                            onChange={(event) =>
                                                                setEditingStation({
                                                                    ...editingStation,
                                                                    countyCode: event.target.value
                                                                })
                                                            }
                                                        >
                                                            {counties.map((county) => (
                                                                <option key={county.COUNTY_CODE} value={county.COUNTY_CODE}>
                                                                    {county.COUNTY_CODE}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        station.COUNTY_CODE
                                                    )}
                                                </td>


                                                <td data-label="State">
                                                    {station.STATE}
                                                </td>


                                                {/* Latitude — editable, shown with a small coordinate label. */}
                                                <td data-label="Latitude">
                                                    {isEditing ? (
                                                        <input
                                                            className="stations-command-inline-input mono"
                                                            type="number"
                                                            step="any"
                                                            value={editingStation.latitude}
                                                            onChange={(event) =>
                                                                setEditingStation({
                                                                    ...editingStation,
                                                                    latitude: event.target.value
                                                                })
                                                            }
                                                        />
                                                    ) : station.LATITUDE !== null && station.LATITUDE !== undefined ? (
                                                        <span className="stations-command-coord">
                                                            <span className="stations-command-coord-tag">LAT</span>
                                                            {station.LATITUDE}
                                                        </span>
                                                    ) : (
                                                        "—"
                                                    )}
                                                </td>


                                                {/* Longitude — editable, shown with a small coordinate label. */}
                                                <td data-label="Longitude">
                                                    {isEditing ? (
                                                        <input
                                                            className="stations-command-inline-input mono"
                                                            type="number"
                                                            step="any"
                                                            value={editingStation.longitude}
                                                            onChange={(event) =>
                                                                setEditingStation({
                                                                    ...editingStation,
                                                                    longitude: event.target.value
                                                                })
                                                            }
                                                        />
                                                    ) : station.LONGITUDE !== null && station.LONGITUDE !== undefined ? (
                                                        <span className="stations-command-coord">
                                                            <span className="stations-command-coord-tag">LON</span>
                                                            {station.LONGITUDE}
                                                        </span>
                                                    ) : (
                                                        "—"
                                                    )}
                                                </td>


                                                {/* Action buttons: Save/Cancel while editing, Edit/Delete otherwise. */}
                                                <td data-label="Actions">
                                                    {isEditing ? (
                                                        <div className="stations-command-action-buttons">
                                                            <button
                                                                type="button"
                                                                className="stations-command-save-button"
                                                                onClick={() => handleUpdate(station.STATION_ID)}
                                                            >
                                                                <IconSave />
                                                                SAVE CONFIGURATION
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="stations-command-cancel-button"
                                                                onClick={cancelEdit}
                                                            >
                                                                <IconX />
                                                                ABORT
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="stations-command-action-buttons">
                                                            <button
                                                                type="button"
                                                                className="stations-command-edit-button"
                                                                onClick={() => startEdit(station)}
                                                            >
                                                                <IconEdit />
                                                                EDIT
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="stations-command-delete-button"
                                                                onClick={() => handleDelete(station.STATION_ID)}
                                                            >
                                                                <IconTrash />
                                                                REMOVE NODE
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

                </section>

            </div>

        </div>
    );
}

export default AdminStations;