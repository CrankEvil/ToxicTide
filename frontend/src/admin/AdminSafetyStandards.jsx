// ======================================================
// 1. Imports
// ======================================================
import { useCallback, useEffect, useState } from "react";

import { adminFetch } from "../adminApi";
import "./AdminSafetyStandards.css";

// ======================================================
// 2. Component
// ======================================================
function AdminSafetyStandards() {

    // ==================================================
    // 3. State
    // ==================================================

    // Store the safety standards returned by the backend.
    const [standards, setStandards] = useState([]);

    // Store the ID of the standard currently being edited.
    const [editingId, setEditingId] = useState(null);

    // Keep all form values in one object.
    const [formData, setFormData] = useState({
        standardId: "",
        userGroup: "",
        threshold: "",
        advisoryMessage: "",
        citingAgency: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Track whether we are currently talking to the backend.
    // This only controls loading visuals, not the API behaviour.
    const [loading, setLoading] = useState(true);

    // Track which advisory messages are expanded ("read more") in the table.
    const [expandedRows, setExpandedRows] = useState({});

    // ==================================================
    // Navigation - go back to the Admin Command Center.
    // Change "/admin" below if your admin route is different.
    // ==================================================
    const handleBackToAdmin = useCallback(() => {
        window.location.href = "/admin";
    }, []);

    // ==================================================
    // 4. Load safety standards
    // ==================================================

    // Load the latest safety standards from the backend.
    const loadStandards = async () => {
        setLoading(true);

        try {
            const response = await adminFetch(
                "http://localhost:5000/api/admin/safety-standards"
            );

            if (!response.ok) {
                throw new Error("Failed to load safety standards");
            }

            const data = await response.json();
            setStandards(data);
        } catch (err) {
            setError("Failed to load safety standards.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStandards();
    }, []);

    // ==================================================
    // 5. Form handling
    // ==================================================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Toggle the "read more" state for a long advisory message.
    const toggleAdvisory = (standardId) => {
        setExpandedRows((prev) => ({
            ...prev,
            [standardId]: !prev[standardId]
        }));
    };

    // ==================================================
    // 6. Add / update logic
    // ==================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            let response;

            if (editingId) {
                // Send a PUT request when editing an existing standard.
                response = await adminFetch(
                    `http://localhost:5000/api/admin/safety-standards/${editingId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            userGroup: formData.userGroup,
                            threshold: formData.threshold,
                            advisoryMessage:
                                formData.advisoryMessage,
                            citingAgency:
                                formData.citingAgency
                        })
                    }
                );
            } else {
                // Send a POST request when adding a new standard.
                response = await adminFetch(
                    "http://localhost:5000/api/admin/safety-standards",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(formData)
                    }
                );
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Operation failed"
                );
            }

            setMessage(
                editingId
                    ? "Safety standard updated successfully."
                    : "Safety standard added successfully."
            );

            resetForm();
            loadStandards();

        } catch (err) {
            setError(err.message);
        }
    };

    // ==================================================
    // 7. Edit logic
    // ==================================================

    const handleEdit = (standard) => {
        setEditingId(standard.STANDARD_ID);

        setFormData({
            standardId: standard.STANDARD_ID,
            userGroup: standard.USER_GROUP,
            threshold: standard.THRESHOLD_UGL,
            advisoryMessage: standard.ADVISORY_MESSAGE,
            citingAgency: standard.CITING_AGENCY
        });

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // ==================================================
    // 8. Delete logic
    // ==================================================

    // Delete the selected standard after confirmation.
    const handleDelete = async (standardId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this safety standard? This action cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        setMessage("");
        setError("");

        try {
            const response = await adminFetch(
                `http://localhost:5000/api/admin/safety-standards/${standardId}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to delete safety standard"
                );
            }

            setMessage(
                "Safety standard deleted successfully."
            );

            loadStandards();

        } catch (err) {
            setError(err.message);
        }
    };

    // ==================================================
    // 9. Reset logic
    // ==================================================

    // Reset the form back to add mode.
    const resetForm = () => {
        setEditingId(null);

        setFormData({
            standardId: "",
            userGroup: "",
            threshold: "",
            advisoryMessage: "",
            citingAgency: ""
        });
    };

    // ==================================================
    // Derived stats - calculated ONLY from real backend data.
    // Nothing here is hard-coded or invented.
    // ==================================================
    const totalStandards = standards.length;

    const uniqueUserGroups = new Set(
        standards.map((s) => s.USER_GROUP)
    ).size;

    const uniqueAgencies = new Set(
        standards.map((s) => s.CITING_AGENCY)
    ).size;

    const thresholdValues = standards
        .map((s) => Number(s.THRESHOLD_UGL))
        .filter((n) => !isNaN(n));

    const highestThreshold = thresholdValues.length
        ? Math.max(...thresholdValues)
        : null;

    const lowestThreshold = thresholdValues.length
        ? Math.min(...thresholdValues)
        : null;

    // ==================================================
    // 10. JSX
    // ==================================================
    return (
        <div className="toxictide-safety-page">

            {/* Decorative background grid, purely visual */}
            <div
                className="toxictide-safety-grid-backdrop"
                aria-hidden="true"
            ></div>

            {/* Top navigation bar with back button */}
            <div className="toxictide-safety-navbar">
                <span className="toxictide-safety-navbar-system">
                    <span className="toxictide-safety-status-dot is-online"></span>
                    ADMIN INTERFACE ACTIVE
                </span>

                <button
                    type="button"
                    className="toxictide-safety-back-btn"
                    onClick={handleBackToAdmin}
                >
                    <span aria-hidden="true">&#8592;</span>
                    ADMIN COMMAND CENTER
                </button>
            </div>

            {/* Safety command center header */}
            <header className="toxictide-safety-hero">

                <div
                    className="toxictide-safety-hero-scanline"
                    aria-hidden="true"
                ></div>

                <div className="toxictide-safety-hero-content">

                    <span className="toxictide-safety-eyebrow">
                        TOXICTIDE // SAFETY INTELLIGENCE
                    </span>

                    <h1 className="toxictide-safety-title">
                        Environmental Safety Standards
                    </h1>

                    <p className="toxictide-safety-subtitle">
                        This module manages the environmental thresholds
                        and public-safety advisories used by ToxicTide.
                        Configure the limits that inform communities,
                        wildlife protection, and water-quality monitoring.
                    </p>

                    <div
                        className="toxictide-safety-status"
                        role="status"
                        aria-live="polite"
                    >
                        <span
                            className={`toxictide-safety-status-dot ${
                                error ? "is-error" : "is-online"
                            }`}
                        ></span>
                        {loading
                            ? "CONNECTING TO SAFETY DATABASE..."
                            : error
                            ? "SAFETY DATABASE CONNECTION ISSUE"
                            : "SAFETY DATABASE ONLINE"}
                    </div>

                </div>

                {/* Decorative "Safety Threshold Core" visualization.
                    This is an interface visualization only -
                    it does not represent live measurements. */}
                <div
                    className="toxictide-safety-core"
                    aria-hidden="true"
                >
                    <div className="toxictide-safety-core-ring toxictide-safety-core-ring--outer"></div>
                    <div className="toxictide-safety-core-ring toxictide-safety-core-ring--mid"></div>
                    <div className="toxictide-safety-core-ring toxictide-safety-core-ring--inner"></div>

                    <div className="toxictide-safety-core-ticks">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <span
                                key={i}
                                className="toxictide-safety-core-tick"
                                style={{
                                    transform: `rotate(${i * 30}deg)`
                                }}
                            ></span>
                        ))}
                    </div>

                    <div className="toxictide-safety-core-center">
                        <span className="toxictide-safety-core-label">
                            SAFETY LIMITS
                        </span>
                        <span className="toxictide-safety-core-value">
                            {totalStandards}
                        </span>
                        <span className="toxictide-safety-core-caption">
                            Interface Visualization
                        </span>
                    </div>
                </div>

            </header>

            {/* Safety intelligence overview */}
            <section
                className="toxictide-safety-overview"
                aria-label="Safety standards overview"
            >
                <div className="toxictide-safety-metric">
                    <span className="toxictide-safety-metric-label">
                        Configured Standards
                    </span>
                    <span className="toxictide-safety-metric-value">
                        {totalStandards}
                    </span>
                </div>

                <div className="toxictide-safety-metric">
                    <span className="toxictide-safety-metric-label">
                        Protected User Groups
                    </span>
                    <span className="toxictide-safety-metric-value">
                        {uniqueUserGroups}
                    </span>
                </div>

                <div className="toxictide-safety-metric">
                    <span className="toxictide-safety-metric-label">
                        Citing Agencies
                    </span>
                    <span className="toxictide-safety-metric-value">
                        {uniqueAgencies}
                    </span>
                </div>

                <div className="toxictide-safety-metric">
                    <span className="toxictide-safety-metric-label">
                        Threshold Range (µg/L)
                    </span>
                    <span className="toxictide-safety-metric-value">
                        {thresholdValues.length
                            ? `${lowestThreshold} - ${highestThreshold}`
                            : "-"}
                    </span>
                </div>
            </section>

            {/* System notifications */}
            {message && (
                <div
                    className="toxictide-safety-alert toxictide-safety-alert--success"
                    role="status"
                    aria-live="polite"
                >
                    <span
                        className="toxictide-safety-alert-icon"
                        aria-hidden="true"
                    >
                        &#10003;
                    </span>
                    <div>
                        <strong>SAFETY STANDARD UPDATED</strong>
                        <p>{message}</p>
                    </div>
                </div>
            )}

            {error && (
                <div
                    className="toxictide-safety-alert toxictide-safety-alert--error"
                    role="alert"
                    aria-live="assertive"
                >
                    <span
                        className="toxictide-safety-alert-icon"
                        aria-hidden="true"
                    >
                        &#9888;
                    </span>
                    <div>
                        <strong>SAFETY SYSTEM ERROR</strong>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {/* Add / edit safety standard console */}
            <section className="toxictide-safety-form-panel">

                <div className="toxictide-safety-panel-header">
                    <div>
                        <span className="toxictide-safety-panel-eyebrow">
                            STANDARD CONFIGURATION CONSOLE
                        </span>
                        <h2>
                            {editingId
                                ? `EDIT MODE // STANDARD #${editingId}`
                                : "Register New Safety Standard"}
                        </h2>
                        <p>
                            {editingId
                                ? "Update the details below and confirm the change."
                                : "Define a new environmental threshold and advisory."}
                        </p>
                    </div>
                </div>

                <form
                    className="toxictide-safety-form"
                    onSubmit={handleSubmit}
                >

                    <div className="toxictide-safety-field">
                        <label htmlFor="standardId">
                            Standard ID
                            <span className="toxictide-safety-field-tag">
                                PRIMARY IDENTIFIER
                            </span>
                        </label>
                        <input
                            id="standardId"
                            type="number"
                            name="standardId"
                            value={formData.standardId}
                            onChange={handleChange}
                            disabled={editingId !== null}
                            placeholder="Example: 4"
                            required
                        />
                    </div>

                    <div className="toxictide-safety-field">
                        <label htmlFor="userGroup">
                            Protected User Group
                        </label>
                        <input
                            id="userGroup"
                            type="text"
                            name="userGroup"
                            value={formData.userGroup}
                            onChange={handleChange}
                            placeholder="Example: Pet_Owners"
                            required
                        />
                    </div>

                    <div className="toxictide-safety-field">
                        <label htmlFor="threshold">
                            Safety Threshold
                        </label>
                        <div className="toxictide-safety-threshold-input">
                            <input
                                id="threshold"
                                type="number"
                                name="threshold"
                                value={formData.threshold}
                                onChange={handleChange}
                                step="0.001"
                                min="0"
                                placeholder="0.000"
                                required
                            />
                            <span className="toxictide-safety-unit">
                                µg/L
                            </span>
                        </div>
                        {/* Decorative live preview of the typed value.
                            This does NOT change what gets submitted. */}
                        <p className="toxictide-safety-field-hint">
                            Preview:{" "}
                            {formData.threshold !== ""
                                ? Number(formData.threshold).toFixed(3)
                                : "0.000"}{" "}
                            µg/L
                        </p>
                    </div>

                    <div className="toxictide-safety-field">
                        <label htmlFor="citingAgency">
                            Citing / Regulatory Agency
                        </label>
                        <input
                            id="citingAgency"
                            type="text"
                            name="citingAgency"
                            value={formData.citingAgency}
                            onChange={handleChange}
                            placeholder="Example: US EPA"
                            required
                        />
                    </div>

                    <div className="toxictide-safety-field toxictide-safety-field--wide">
                        <label htmlFor="advisoryMessage">
                            Advisory Message
                        </label>
                        <p className="toxictide-safety-field-hint">
                            Safety guidance associated with this threshold
                        </p>
                        <textarea
                            id="advisoryMessage"
                            name="advisoryMessage"
                            value={formData.advisoryMessage}
                            onChange={handleChange}
                            placeholder="Enter the health or safety advisory..."
                            rows="5"
                            required
                        />
                    </div>

                    <div className="toxictide-safety-actions-row">
                        <button
                            type="submit"
                            className="toxictide-safety-btn-primary"
                        >
                            {editingId
                                ? "UPDATE STANDARD"
                                : "ADD STANDARD"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="toxictide-safety-btn-secondary"
                                onClick={resetForm}
                            >
                                CANCEL EDIT
                            </button>
                        )}
                    </div>

                </form>

            </section>

            {/* Current safety standard registry */}
            <section className="toxictide-safety-registry">

                <div className="toxictide-safety-panel-header">
                    <div>
                        <span className="toxictide-safety-panel-eyebrow">
                            ACTIVE SAFETY STANDARD REGISTRY
                            {loading && (
                                <span className="toxictide-safety-syncing">
                                    <span className="toxictide-safety-sync-dot"></span>
                                    SYNCING SAFETY REGISTRY
                                </span>
                            )}
                        </span>
                        <h2>Configured Environmental Thresholds</h2>
                        <p>
                            {totalStandards} standard
                            {totalStandards !== 1 ? "s" : ""} currently
                            stored in the database
                        </p>
                    </div>

                    <button
                        type="button"
                        className="toxictide-safety-btn-secondary"
                        onClick={loadStandards}
                    >
                        SYNC REGISTRY
                    </button>
                </div>

                {/* Registry table */}
                <div className="toxictide-safety-table-wrapper">
                    <table className="toxictide-safety-table">
                        <thead>
                            <tr>
                                <th scope="col">Standard ID</th>
                                <th scope="col">User Group</th>
                                <th scope="col">Threshold (µg/L)</th>
                                <th scope="col">Advisory Message</th>
                                <th scope="col">Citing Agency</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                // Loading skeleton rows while syncing with the backend.
                                // No fake data is shown, only placeholder bars.
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr
                                        key={`skeleton-${i}`}
                                        className="toxictide-safety-skeleton-row"
                                    >
                                        <td colSpan="6">
                                            <div className="toxictide-safety-skeleton-bar"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : standards.length === 0 ? (
                                <tr>
                                    <td colSpan="6">
                                        {/* Empty state */}
                                        <div className="toxictide-safety-empty">
                                            <span
                                                className="toxictide-safety-empty-icon"
                                                aria-hidden="true"
                                            >
                                                0
                                            </span>
                                            <h3>SAFETY REGISTRY EMPTY</h3>
                                            <p>
                                                No environmental safety
                                                standards have been
                                                configured yet. Use the
                                                console above to add the
                                                first standard.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                // Registry table rows built from real backend data
                                standards.map((standard) => {
                                    const thresholdValue = Number(
                                        standard.THRESHOLD_UGL
                                    );

                                    // Relative visual scale only, based on real
                                    // configured values. This is not a safety claim.
                                    const barWidth = highestThreshold
                                        ? Math.max(
                                              6,
                                              (thresholdValue /
                                                  highestThreshold) *
                                                  100
                                          )
                                        : 0;

                                    const isExpanded =
                                        !!expandedRows[
                                            standard.STANDARD_ID
                                        ];

                                    const advisoryText =
                                        standard.ADVISORY_MESSAGE || "";

                                    const isLong =
                                        advisoryText.length > 140;

                                    const displayedText =
                                        isExpanded || !isLong
                                            ? advisoryText
                                            : advisoryText.slice(0, 140) +
                                              "...";

                                    return (
                                        <tr
                                            key={standard.STANDARD_ID}
                                            className={
                                                editingId ===
                                                standard.STANDARD_ID
                                                    ? "is-editing"
                                                    : ""
                                            }
                                        >
                                            <td data-label="Standard ID">
                                                <span className="toxictide-safety-id-chip">
                                                    #{standard.STANDARD_ID}
                                                </span>
                                            </td>

                                            <td data-label="User Group">
                                                <span className="toxictide-safety-badge">
                                                    {standard.USER_GROUP}
                                                </span>
                                            </td>

                                            <td data-label="Threshold">
                                                <div className="toxictide-safety-threshold-cell">
                                                    <span className="toxictide-safety-threshold-value">
                                                        {
                                                            standard.THRESHOLD_UGL
                                                        }
                                                    </span>
                                                    <span className="toxictide-safety-threshold-unit">
                                                        µg/L
                                                    </span>
                                                    <div
                                                        className="toxictide-safety-threshold-scale"
                                                        aria-hidden="true"
                                                    >
                                                        <span
                                                            className="toxictide-safety-threshold-fill"
                                                            style={{
                                                                width: `${barWidth}%`
                                                            }}
                                                        ></span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td data-label="Advisory Message">
                                                <div className="toxictide-safety-advisory">
                                                    <p>{displayedText}</p>
                                                    {isLong && (
                                                        <button
                                                            type="button"
                                                            className="toxictide-safety-readmore"
                                                            onClick={() =>
                                                                toggleAdvisory(
                                                                    standard.STANDARD_ID
                                                                )
                                                            }
                                                        >
                                                            {isExpanded
                                                                ? "SHOW LESS"
                                                                : "READ MORE"}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>

                                            <td data-label="Citing Agency">
                                                <span className="toxictide-safety-agency">
                                                    <span
                                                        className="toxictide-safety-agency-icon"
                                                        aria-hidden="true"
                                                    >
                                                        #
                                                    </span>
                                                    {standard.CITING_AGENCY}
                                                </span>
                                            </td>

                                            <td data-label="Actions">
                                                <div className="toxictide-safety-actions">
                                                    <button
                                                        type="button"
                                                        className="toxictide-safety-btn-edit"
                                                        onClick={() =>
                                                            handleEdit(
                                                                standard
                                                            )
                                                        }
                                                        aria-label={`Edit standard ${standard.STANDARD_ID}`}
                                                    >
                                                        EDIT
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="toxictide-safety-btn-delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                standard.STANDARD_ID
                                                            )
                                                        }
                                                        aria-label={`Delete standard ${standard.STANDARD_ID}`}
                                                    >
                                                        DELETE
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

            </section>

        </div>
    );
}

export default AdminSafetyStandards;