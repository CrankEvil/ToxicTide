// ============================================================
// TOXICTIDE — MAIN DASHBOARD
// ============================================================
//
// Dashboard responsibilities:
// 1. Show official database statistics
// 2. Show monitoring-station statistics
// 3. Show microcystin measurement statistics
// 4. Show stored safety standards
// 5. Show yearly measurement activity
// 6. Show the latest measurement record
// 7. Show recent measurement records
// 8. Provide navigation to major ToxicTide features
// 9. Explain missing-data handling
//
// IMPORTANT:
// - All environmental information comes from the backend/database.
// - Missing microcystin values are NOT treated as zero.
// - The dashboard does NOT make a global safety decision.
// - User-specific safety decisions are handled by Safety Check.
// - Safety Check requires a selected monitoring station.
// ============================================================

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

// ============================================================
// API CONFIGURATION
// ============================================================

const API_BASE = "https://toxictide-backend.onrender.com/api";

// ============================================================
// NUMBER FORMATTERS
// ============================================================

const FORMAT_INT = new Intl.NumberFormat("en-US");

const FORMAT_1DP = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1
});

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function toNumber(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const cleaned = String(value).trim();

  if (cleaned === "") {
    return null;
  }

  const number = Number(cleaned);

  return Number.isFinite(number) ? number : null;
}

// ------------------------------------------------------------
// Format microcystin values
// ------------------------------------------------------------

function formatMicrocystin(value) {
  const number = toNumber(value);

  if (number === null) {
    return "N/A";
  }

  if (number >= 10000) {
    return FORMAT_INT.format(Math.round(number));
  }

  return FORMAT_1DP.format(number);
}

// ------------------------------------------------------------
// Format dates safely
// ------------------------------------------------------------

function formatDate(value) {
  if (!value) {
    return "N/A";
  }

  const text = String(value);

  const isoMatch = text.match(
    /^(\d{4})-(\d{2})-(\d{2})/
  );

  if (isoMatch) {
    const [, year, month, day] = isoMatch;

    return `${month}/${day}/${year}`;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-US");
}

// ------------------------------------------------------------
// Get year from date
// ------------------------------------------------------------

function getYear(value) {
  if (!value) {
    return null;
  }

  const text = String(value);

  const match = text.match(/^(\d{4})/);

  if (match) {
    return Number(match[1]);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.getFullYear();
}

// ------------------------------------------------------------
// Format user group names
// ------------------------------------------------------------

function formatUserGroup(value) {
  if (!value) {
    return "Unknown";
  }

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  label,
  value,
  description,
  icon,
  className = ""
}) {
  return (
    <article
      className={`tt-dashboard-stat ${className}`}
    >
      <div className="tt-dashboard-stat-top">
        <span className="tt-dashboard-stat-icon">
          {icon}
        </span>

        <span className="tt-dashboard-stat-label">
          {label}
        </span>
      </div>

      <strong className="tt-dashboard-stat-value">
        {value}
      </strong>

      <p className="tt-dashboard-stat-description">
        {description}
      </p>
    </article>
  );
}

// ============================================================
// QUICK ACTION
// ============================================================

function QuickAction({
  icon,
  title,
  description,
  onClick
}) {
  return (
    <button
      type="button"
      className="tt-dashboard-action"
      onClick={onClick}
    >
      <span
        className="tt-dashboard-action-icon"
        aria-hidden="true"
      >
        {icon}
      </span>

      <span className="tt-dashboard-action-content">
        <strong>
          {title}
        </strong>

        <span>
          {description}
        </span>
      </span>

      <span
        className="tt-dashboard-action-arrow"
        aria-hidden="true"
      >
        →
      </span>
    </button>
  );
}

// ============================================================
// LOADING CARD
// ============================================================

function LoadingCard() {
  return (
    <div className="tt-dashboard-loading-card">
      <div className="tt-dashboard-loading-line large" />
      <div className="tt-dashboard-loading-line medium" />
      <div className="tt-dashboard-loading-line small" />
    </div>
  );
}

// ============================================================
// MAIN DASHBOARD
// ============================================================

function Dashboard() {
  const navigate = useNavigate();

  // ==========================================================
  // DATABASE DATA
  // ==========================================================

  const [stations, setStations] = useState([]);

  const [measurements, setMeasurements] = useState([]);

  const [safetyStandards, setSafetyStandards] = useState([]);

  const [waterTypes, setWaterTypes] = useState([]);

  const [counties, setCounties] = useState([]);

  // ==========================================================
  // UI STATE
  // ==========================================================

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [measurementSearch, setMeasurementSearch] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  // ==========================================================
  // LOAD DASHBOARD DATA
  // ==========================================================

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboardData() {
      try {
        setLoading(true);
        setError("");

        const [
          stationsResponse,
          measurementsResponse,
          standardsResponse,
          waterTypesResponse,
          countiesResponse
        ] = await Promise.all([
          axios.get(
            `${API_BASE}/stations`,
            {
              signal: controller.signal
            }
          ),

          axios.get(
            `${API_BASE}/measurements/all`,
            {
              signal: controller.signal
            }
          ),

          axios.get(
            `${API_BASE}/safety-standards`,
            {
              signal: controller.signal
            }
          ),

          axios.get(
            `${API_BASE}/water-types`,
            {
              signal: controller.signal
            }
          ),

          axios.get(
            `${API_BASE}/counties`,
            {
              signal: controller.signal
            }
          )
        ]);

        // ------------------------------------------------------
        // Stations
        // ------------------------------------------------------

        setStations(
          Array.isArray(stationsResponse.data)
            ? stationsResponse.data
            : []
        );

        // ------------------------------------------------------
        // Measurements
        // ------------------------------------------------------

        setMeasurements(
          Array.isArray(measurementsResponse.data)
            ? measurementsResponse.data
            : []
        );

        // ------------------------------------------------------
        // Safety standards
        // ------------------------------------------------------

        setSafetyStandards(
          Array.isArray(standardsResponse.data)
            ? standardsResponse.data
            : []
        );

        // ------------------------------------------------------
        // Water types
        // ------------------------------------------------------

        setWaterTypes(
          Array.isArray(waterTypesResponse.data)
            ? waterTypesResponse.data
            : []
        );

        // ------------------------------------------------------
        // Counties
        // ------------------------------------------------------

        setCounties(
          Array.isArray(countiesResponse.data)
            ? countiesResponse.data
            : []
        );
      } catch (requestError) {
        if (
          requestError.code === "ERR_CANCELED" ||
          requestError.name === "CanceledError"
        ) {
          return;
        }

        console.error(
          "Dashboard data loading failed:",
          requestError
        );

        setError(
          "Unable to load dashboard information. Please make sure the ToxicTide backend is running."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      controller.abort();
    };
  }, [reloadKey]);

  // ==========================================================
  // PREPARE MEASUREMENTS
  // ==========================================================

  const preparedMeasurements = useMemo(() => {
    return measurements.map((measurement) => {
      const value = toNumber(
        measurement.MICROCYSTIN_UGL
      );

      return {
        ...measurement,
        numericValue: value,
        year: getYear(
          measurement.SAMPLE_DATE
        )
      };
    });
  }, [measurements]);

  // ==========================================================
  // MEASURED RECORDS
  // ==========================================================

  const measuredRecords = useMemo(() => {
    return preparedMeasurements.filter(
      (measurement) =>
        measurement.numericValue !== null
    );
  }, [preparedMeasurements]);

  // ==========================================================
  // MISSING MEASUREMENT VALUES
  // ==========================================================

  const missingMeasurementCount =
    Math.max(
      measurements.length -
        measuredRecords.length,
      0
    );

  // ==========================================================
  // HIGHEST RECORDED MEASUREMENT
  // ==========================================================

  const highestMeasurement = useMemo(() => {
    if (measuredRecords.length === 0) {
      return null;
    }

    return measuredRecords.reduce(
      (highest, current) => {
        if (
          highest === null ||
          current.numericValue >
            highest.numericValue
        ) {
          return current;
        }

        return highest;
      },
      null
    );
  }, [measuredRecords]);

  // ==========================================================
  // LATEST MEASUREMENT
  // ==========================================================

  const latestMeasurement = useMemo(() => {
    if (preparedMeasurements.length === 0) {
      return null;
    }

    const sorted = [...preparedMeasurements]
      .filter(
        (measurement) =>
          measurement.SAMPLE_DATE
      )
      .sort(
        (a, b) =>
          String(
            b.SAMPLE_DATE
          ).localeCompare(
            String(
              a.SAMPLE_DATE
            )
          )
      );

    return sorted[0] || null;
  }, [preparedMeasurements]);

  // ==========================================================
  // YEARLY MEASUREMENT COUNTS
  // ==========================================================

  const yearlyData = useMemo(() => {
    const yearlyMap = new Map();

    measuredRecords.forEach(
      (measurement) => {
        if (!measurement.year) {
          return;
        }

        if (
          !yearlyMap.has(
            measurement.year
          )
        ) {
          yearlyMap.set(
            measurement.year,
            {
              year: measurement.year,
              measured: 0
            }
          );
        }

        const row =
          yearlyMap.get(
            measurement.year
          );

        row.measured += 1;
      }
    );

    return Array.from(
      yearlyMap.values()
    ).sort(
      (a, b) =>
        a.year - b.year
    );
  }, [measuredRecords]);

  // ==========================================================
  // MAX YEARLY COUNT
  // ==========================================================

  const maximumYearlyCount = useMemo(() => {
    if (yearlyData.length === 0) {
      return 1;
    }

    return Math.max(
      ...yearlyData.map(
        (row) =>
          row.measured
      ),
      1
    );
  }, [yearlyData]);

  // ==========================================================
  // RECENT MEASUREMENT SEARCH
  // ==========================================================

  const filteredRecentMeasurements =
    useMemo(() => {
      const search =
        measurementSearch
          .trim()
          .toLowerCase();

      const filtered =
        search === ""
          ? preparedMeasurements
          : preparedMeasurements.filter(
              (measurement) => {
                const stationId =
                  String(
                    measurement.STATION_ID ||
                      ""
                  ).toLowerCase();

                const sampleId =
                  String(
                    measurement.SAMPLE_ID ||
                      ""
                  ).toLowerCase();

                const date =
                  String(
                    measurement.SAMPLE_DATE ||
                      ""
                  ).toLowerCase();

                return (
                  stationId.includes(search) ||
                  sampleId.includes(search) ||
                  date.includes(search)
                );
              }
            );

      return [...filtered]
        .sort(
          (a, b) =>
            String(
              b.SAMPLE_DATE || ""
            ).localeCompare(
              String(
                a.SAMPLE_DATE || ""
              )
            )
        )
        .slice(0, 10);
    }, [
      preparedMeasurements,
      measurementSearch
    ]);

  // ==========================================================
  // DASHBOARD STATUS
  // ==========================================================

  const dashboardStatus = useMemo(() => {
    if (
      stations.length === 0 &&
      measurements.length === 0
    ) {
      return {
        type: "neutral",
        title:
          "No monitoring records available",
        message:
          "The dashboard is connected, but no monitoring records are currently available."
      };
    }

    if (
      measuredRecords.length === 0
    ) {
      return {
        type: "neutral",
        title:
          "No numeric measurements available",
        message:
          "Monitoring records are available, but there is currently no numeric microcystin value to summarize."
      };
    }

    return {
      type: "normal",
      title:
        "Official monitoring data loaded",
      message:
        `${FORMAT_INT.format(
          measuredRecords.length
        )} records contain numeric microcystin measurements.`
    };
  }, [
    stations.length,
    measurements.length,
    measuredRecords.length
  ]);

  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

  if (loading) {
    return (
      <div className="map-page tt-dashboard">
        <style>{DASHBOARD_STYLES}</style>

        <button
          type="button"
          className="tt-dashboard-back"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

        <header className="tt-dashboard-hero tt-dashboard-sticky-hero">
          <div>
            <p className="tt-dashboard-eyebrow">
              TOXICTIDE OVERVIEW
            </p>

            <h1>
              Water Safety{" "}
              <span>
                Dashboard
              </span>
            </h1>

            <p>
              Loading official monitoring
              information and database summaries...
            </p>
          </div>
        </header>

        <div className="tt-dashboard-stat-grid">
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </div>

        <LoadingCard />
        <LoadingCard />
      </div>
    );
  }

  // ==========================================================
  // ERROR SCREEN
  // ==========================================================

  if (error) {
    return (
      <div className="map-page tt-dashboard">
        <style>{DASHBOARD_STYLES}</style>

        <button
          type="button"
          className="tt-dashboard-back"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

        <div className="tt-dashboard-error">
          <div className="tt-dashboard-error-icon">
            ⚠
          </div>

          <h1>
            Dashboard unavailable
          </h1>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="tt-dashboard-primary-button"
            onClick={() =>
              setReloadKey(
                (current) =>
                  current + 1
              )
            }
          >
            ↻ Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MAIN DASHBOARD
  // ==========================================================

  return (
    <div className="map-page tt-dashboard">
      <style>{DASHBOARD_STYLES}</style>

      {/* ======================================================
          BACK BUTTON
      ====================================================== */}

      <button
        type="button"
        className="tt-dashboard-back"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      {/* ======================================================
          HERO
      ====================================================== */}

      <header className="tt-dashboard-hero tt-dashboard-sticky-hero">
        <div className="tt-dashboard-hero-copy">
          <p className="tt-dashboard-eyebrow">
            TOXICTIDE OVERVIEW
          </p>

          <h1>
            Water Safety{" "}
            <span>
              Dashboard
            </span>
          </h1>

          <p>
            Overview of official monitoring stations,
            recorded microcystin measurements, and
            user-specific safety standards stored in
            the ToxicTide database.
          </p>
        </div>

        <div
          className={`tt-dashboard-status tt-dashboard-status-${dashboardStatus.type}`}
        >
          <span className="tt-dashboard-status-dot" />

          <div>
            <strong>
              {dashboardStatus.title}
            </strong>

            <small>
              {dashboardStatus.message}
            </small>
          </div>
        </div>
      </header>

      {/* ======================================================
          MAIN STATISTICS
      ====================================================== */}

      <section
        className="tt-dashboard-stat-grid"
        aria-label="ToxicTide statistics"
      >
        <StatCard
          icon="📍"
          label="Monitoring Stations"
          value={FORMAT_INT.format(
            stations.length
          )}
          description="Stations available in the ToxicTide database."
          className="cyan"
        />

        <StatCard
          icon="🧪"
          label="Measurement Records"
          value={FORMAT_INT.format(
            measurements.length
          )}
          description="Stored cyanotoxin monitoring records."
          className="violet"
        />

        <StatCard
          icon="📈"
          label="Measured Values"
          value={FORMAT_INT.format(
            measuredRecords.length
          )}
          description="Records containing a numeric microcystin result."
          className="amber"
        />

        <StatCard
          icon="⚠️"
          label="Unavailable Values"
          value={FORMAT_INT.format(
            missingMeasurementCount
          )}
          description="Records without a usable microcystin result."
          className="rose"
        />
      </section>

      {/* ======================================================
          DATABASE SUMMARY
      ====================================================== */}

      <section
        className="tt-dashboard-mini-stats"
        aria-label="Database summary"
      >
        <div>
          <span>
            WATER TYPES
          </span>

          <strong>
            {FORMAT_INT.format(
              waterTypes.length
            )}
          </strong>
        </div>

        <div>
          <span>
            COUNTIES
          </span>

          <strong>
            {FORMAT_INT.format(
              counties.length
            )}
          </strong>
        </div>

        <div>
          <span>
            SAFETY STANDARDS
          </span>

          <strong>
            {FORMAT_INT.format(
              safetyStandards.length
            )}
          </strong>
        </div>

        <div>
          <span>
            HIGHEST RECORDED VALUE
          </span>

          <strong>
            {highestMeasurement
              ? `${formatMicrocystin(
                  highestMeasurement.numericValue
                )} µg/L`
              : "N/A"}
          </strong>
        </div>
      </section>

      {/* ======================================================
          QUICK ACTIONS
      ====================================================== */}

      <section className="tt-dashboard-panel">
        <div className="tt-dashboard-panel-header">
          <div>
            <p className="tt-dashboard-label">
              EXPLORE TOXICTIDE
            </p>

            <h2>
              What would you like to do?
            </h2>

            <p>
              Explore monitoring stations, check
              water safety, review project data,
              or submit a community observation.
            </p>
          </div>
        </div>

        <div className="tt-dashboard-action-grid">
          <QuickAction
            icon="🗺️"
            title="Explore Water Map"
            description="Find monitoring stations and explore their recorded information."
            onClick={() =>
              navigate("/map")
            }
          />

          <QuickAction
            icon="🛡️"
            title="Check Water Safety"
            description="Select a monitoring station first, then check its water safety according to the selected user group and stored threshold."
            onClick={() =>
              navigate("/map")
            }
          />

          <QuickAction
            icon="📊"
            title="Explore Data"
            description="View water types, counties, stations, measurements, and safety standards."
            onClick={() =>
              navigate("/data")
            }
          />

          <QuickAction
            icon="📢"
            title="Report an Issue"
            description="Submit a community observation about unusual water conditions or possible algae-related issues."
            onClick={() =>
              navigate("/report")
            }
          />
        </div>
      </section>

      {/* ======================================================
          YEARLY ACTIVITY + LATEST RECORD
      ====================================================== */}

      <div className="tt-dashboard-two-column">
        {/* ====================================================
            YEARLY MEASUREMENT ACTIVITY
        ==================================================== */}

        <section className="tt-dashboard-panel">
          <div className="tt-dashboard-panel-header">
            <div>
              <p className="tt-dashboard-label">
                MEASUREMENT ACTIVITY
              </p>

              <h2>
                Recorded Measurements by Year
              </h2>
            </div>

            <span className="tt-dashboard-chip">
              {FORMAT_INT.format(
                measuredRecords.length
              )}{" "}
              measured
            </span>
          </div>

          {yearlyData.length === 0 ? (
            <div className="tt-dashboard-empty">
              No dated numeric measurements are available.
            </div>
          ) : (
            <div className="tt-dashboard-year-chart">
              {yearlyData.map((row) => {
                const height =
                  (row.measured /
                    maximumYearlyCount) *
                  100;

                return (
                  <div
                    className="tt-dashboard-year"
                    key={row.year}
                  >
                    <div className="tt-dashboard-year-value">
                      {FORMAT_INT.format(
                        row.measured
                      )}
                    </div>

                    <div className="tt-dashboard-year-bar-area">
                      <div
                        className="tt-dashboard-year-bar"
                        style={{
                          height: `${Math.max(
                            height,
                            3
                          )}%`
                        }}
                        title={`${row.year}: ${row.measured} measured records`}
                      />
                    </div>

                    <span>
                      {row.year}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="tt-dashboard-chart-note">
            <span className="tt-dashboard-dot cyan" />
            Numeric microcystin measurement records
          </div>
        </section>

        {/* ====================================================
            LATEST RECORD
        ==================================================== */}

        <section className="tt-dashboard-panel">
          <div className="tt-dashboard-panel-header">
            <div>
              <p className="tt-dashboard-label">
                LATEST RECORD
              </p>

              <h2>
                Most Recent Measurement
              </h2>
            </div>
          </div>

          {!latestMeasurement ? (
            <div className="tt-dashboard-empty">
              No measurement records are
              currently available.
            </div>
          ) : (
            <div className="tt-dashboard-latest">
              <div>
                <span>
                  SAMPLE DATE
                </span>

                <strong>
                  {formatDate(
                    latestMeasurement.SAMPLE_DATE
                  )}
                </strong>
              </div>

              <div>
                <span>
                  MICROCYSTIN
                </span>

                <strong>
                  {formatMicrocystin(
                    latestMeasurement.numericValue
                  )}

                  {latestMeasurement.numericValue !==
                    null &&
                    " µg/L"}
                </strong>
              </div>

              <div>
                <span>
                  STATION ID
                </span>

                <strong className="mono">
                  {latestMeasurement.STATION_ID ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>
                  SAMPLE ID
                </span>

                <strong className="mono">
                  {latestMeasurement.SAMPLE_ID ||
                    "N/A"}
                </strong>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ======================================================
          SAFETY STANDARDS
      ====================================================== */}

      <section className="tt-dashboard-panel">
        <div className="tt-dashboard-panel-header">
          <div>
            <p className="tt-dashboard-label">
              STORED SAFETY GUIDANCE
            </p>

            <h2>
              User-Specific Safety Standards
            </h2>

            <p>
              These standards are stored in the
              ToxicTide database and are used by
              the Safety Check process.
            </p>
          </div>
        </div>

        {safetyStandards.length === 0 ? (
          <div className="tt-dashboard-empty">
            No safety standards are currently available.
          </div>
        ) : (
          <div className="tt-dashboard-standard-grid">
            {safetyStandards.map(
              (standard) => {
                const threshold =
                  toNumber(
                    standard.THRESHOLD_UGL
                  );

                return (
                  <article
                    className="tt-dashboard-standard"
                    key={
                      standard.STANDARD_ID ||
                      standard.USER_GROUP
                    }
                  >
                    <div className="tt-dashboard-standard-top">
                      <div>
                        <span className="tt-dashboard-standard-caption">
                          USER GROUP
                        </span>

                        <h3>
                          {formatUserGroup(
                            standard.USER_GROUP
                          )}
                        </h3>
                      </div>

                      <strong>
                        {threshold !== null
                          ? `${formatMicrocystin(
                              threshold
                            )} µg/L`
                          : "N/A"}
                      </strong>
                    </div>

                    <div className="tt-dashboard-threshold-line">
                      <span
                        style={{
                          width:
                            threshold !== null
                              ? "100%"
                              : "0%"
                        }}
                      />
                    </div>

                    <p>
                      {standard.ADVISORY_MESSAGE ||
                        "No advisory message available."}
                    </p>

                    <footer>
                      {standard.CITING_AGENCY
                        ? `Source: ${standard.CITING_AGENCY}`
                        : "No citing agency recorded."}
                    </footer>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>

      {/* ======================================================
          RECENT MEASUREMENTS
      ====================================================== */}

      <section className="tt-dashboard-panel">
        <div className="tt-dashboard-panel-header">
          <div>
            <p className="tt-dashboard-label">
              RECENT RECORDS
            </p>

            <h2>
              Recent Microcystin Measurements
            </h2>

            <p>
              Missing measurement values are displayed
              as unavailable and are not treated as zero.
            </p>
          </div>

          <div className="tt-dashboard-panel-tools">
            <input
              type="search"
              value={measurementSearch}
              onChange={(event) =>
                setMeasurementSearch(
                  event.target.value
                )
              }
              placeholder="Search station or sample..."
              className="tt-dashboard-search"
              aria-label="Search recent measurements"
            />
          </div>
        </div>

        {filteredRecentMeasurements.length === 0 ? (
          <div className="tt-dashboard-empty">
            No matching measurement records found.
          </div>
        ) : (
          <div className="tt-dashboard-table-wrapper">
            <table className="tt-dashboard-table">
              <thead>
                <tr>
                  <th>
                    Sample ID
                  </th>

                  <th>
                    Station ID
                  </th>

                  <th>
                    Sample Date
                  </th>

                  <th>
                    Microcystin
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRecentMeasurements.map(
                  (measurement) => {
                    const value =
                      measurement.numericValue;

                    return (
                      <tr
                        key={
                          measurement.SAMPLE_ID
                        }
                      >
                        <td>
                          <span className="tt-dashboard-mono">
                            {measurement.SAMPLE_ID ||
                              "N/A"}
                          </span>
                        </td>

                        <td>
                          <span className="tt-dashboard-mono">
                            {measurement.STATION_ID ||
                              "N/A"}
                          </span>
                        </td>

                        <td>
                          {formatDate(
                            measurement.SAMPLE_DATE
                          )}
                        </td>

                        <td>
                          {value === null ? (
                            <span className="tt-dashboard-unavailable">
                              No value
                            </span>
                          ) : (
                            <span className="tt-dashboard-value-badge">
                              {formatMicrocystin(
                                value
                              )}{" "}
                              µg/L
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ======================================================
          DATA QUALITY NOTE
      ====================================================== */}

      <section className="tt-dashboard-data-note">
        <div className="tt-dashboard-data-note-icon">
          ℹ
        </div>

        <div>
          <strong>
            About the dashboard data
          </strong>

          <p>
            ToxicTide uses stored monitoring records
            and safety standards from the project database.
            A missing microcystin value is not interpreted
            as zero and is not automatically considered safe.
            User-specific safety decisions are made on the
            Safety Check page using the selected user group
            and stored safety threshold.
          </p>
        </div>
      </section>

      {/* ======================================================
          NAVIGATION NOTE

          The duplicate "final navigation" button row that used
          to repeat the four Quick Actions has been removed.
          The Quick Actions panel above is now the single place
          for moving to Water Map, Safety Check, Data Center,
          and Community Report.
      ====================================================== */}
    </div>
  );
}

// ============================================================
// DASHBOARD-SPECIFIC CSS
// ============================================================

const DASHBOARD_STYLES = `

/* ============================================================
   DASHBOARD PAGE
============================================================ */

.tt-dashboard.tt-dashboard {

  --tt-bg: #040a17;
  --tt-panel: rgba(13, 26, 46, 0.86);
  --tt-panel-solid: #0d1a2e;
  --tt-border: rgba(120, 220, 232, 0.16);
  --tt-border-strong: rgba(120, 220, 232, 0.34);

  --tt-text: #e9f5ff;
  --tt-muted: #9db8d6;
  --tt-faint: #7d97b6;

  --tt-cyan: #22d3ee;
  --tt-violet: #a78bfa;
  --tt-amber: #fbbf24;
  --tt-rose: #f43f5e;

  background:
    radial-gradient(
      1200px 600px at 50% -14%,
      rgba(34, 211, 238, 0.10),
      transparent 64%
    ),
    radial-gradient(
      1000px 560px at 100% 106%,
      rgba(167, 139, 250, 0.07),
      transparent 62%
    ),
    linear-gradient(
      180deg,
      #071229 0%,
      #040a17 52%,
      #03070e 100%
    ) !important;

  background-attachment: fixed !important;

  color: var(--tt-text) !important;

  min-height: 100vh;

  padding: 28px 34px 80px;

  box-sizing: border-box;

  color-scheme: dark;
}


/* ============================================================
   FORCE READABLE TEXT
============================================================ */

.tt-dashboard.tt-dashboard
  :where(
    h1, h2, h3, h4, h5, h6,
    p, span, small, strong,
    label, th, td, div
  ) {

  color: inherit;
}


/* ============================================================
   BACK BUTTON
============================================================ */

.tt-dashboard-back {

  display: inline-flex;

  align-items: center;

  gap: 8px;

  padding: 9px 14px;

  border: 1px solid var(--tt-border);

  border-radius: 10px;

  background: rgba(255, 255, 255, 0.035);

  color: var(--tt-text) !important;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}


.tt-dashboard-back:hover {

  background: rgba(255, 255, 255, 0.075);

  transform: translateX(-2px);
}


/* ============================================================
   HERO
============================================================ */

.tt-dashboard-hero {

  max-width: 1600px;

  margin: 28px auto 30px;

  display: flex;

  flex-wrap: wrap;

  align-items: flex-end;

  justify-content: space-between;

  gap: 24px;
}


.tt-dashboard-hero-copy {

  flex: 1 1 520px;
}


.tt-dashboard-eyebrow {

  margin: 0 0 8px;

  color: var(--tt-cyan) !important;

  font-size: 0.73rem;

  font-weight: 800;

  letter-spacing: 0.13em;
}


.tt-dashboard-hero h1 {

  margin: 0 0 12px;

  font-size: clamp(
    2.1rem,
    5vw,
    3.5rem
  );

  line-height: 1.05;

  font-weight: 850;

  letter-spacing: -0.03em;
}


.tt-dashboard-hero h1 span {

  background:
    linear-gradient(
      100deg,
      #22d3ee,
      #67e8f9,
      #a78bfa
    );

  -webkit-background-clip: text;

  background-clip: text;

  color: transparent !important;
}


.tt-dashboard-hero-copy > p:last-child {

  max-width: 720px;

  margin: 0;

  color: var(--tt-muted) !important;

  line-height: 1.7;
}


/* ============================================================
   STATUS
============================================================ */

.tt-dashboard-status {

  min-width: 310px;

  max-width: 440px;

  display: flex;

  gap: 13px;

  padding: 16px 18px;

  border: 1px solid var(--tt-border);

  border-left: 3px solid var(--tt-cyan);

  border-radius: 16px;

  background: var(--tt-panel);

  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.18);
}


.tt-dashboard-status-neutral {

  border-left-color:
    var(--tt-faint);
}


.tt-dashboard-status-dot {

  width: 10px;

  height: 10px;

  flex: 0 0 auto;

  margin-top: 6px;

  border-radius: 50%;

  background: var(--tt-cyan);
}


.tt-dashboard-status-neutral
.tt-dashboard-status-dot {

  background: var(--tt-faint);
}


.tt-dashboard-status strong {

  display: block;

  margin-bottom: 4px;
}


.tt-dashboard-status small {

  display: block;

  color: var(--tt-muted) !important;

  line-height: 1.5;
}


/* ============================================================
   STAT CARDS
============================================================ */

.tt-dashboard-stat-grid {

  max-width: 1600px;

  margin: 0 auto 18px;

  display: grid;

  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );

  gap: 18px;
}


.tt-dashboard-stat {

  position: relative;

  overflow: hidden;

  padding: 21px;

  border:
    1px solid var(--tt-border);

  border-radius: 18px;

  background: var(--tt-panel);

  transition:
    transform 0.22s ease,
    border-color 0.22s ease;
}


.tt-dashboard-stat:hover {

  transform: translateY(-3px);

  border-color:
    var(--tt-border-strong);
}


.tt-dashboard-stat::before {

  content: "";

  position: absolute;

  top: 0;

  left: 0;

  right: 0;

  height: 2px;

  background: currentColor;

  opacity: 0.7;
}


.tt-dashboard-stat.cyan {
  color: var(--tt-cyan);
}


.tt-dashboard-stat.violet {
  color: var(--tt-violet);
}


.tt-dashboard-stat.amber {
  color: var(--tt-amber);
}


.tt-dashboard-stat.rose {
  color: var(--tt-rose);
}


.tt-dashboard-stat-top {

  display: flex;

  align-items: center;

  gap: 9px;
}


.tt-dashboard-stat-icon {
  font-size: 1.2rem;
}


.tt-dashboard-stat-label {

  color: var(--tt-muted) !important;

  font-size: 0.72rem;

  font-weight: 750;

  letter-spacing: 0.09em;
}


.tt-dashboard-stat-value {

  display: block;

  margin-top: 13px;

  color: var(--tt-text) !important;

  font-size: 2.35rem;

  line-height: 1;

  font-variant-numeric:
    tabular-nums;
}


.tt-dashboard-stat-description {

  min-height: 42px;

  margin: 12px 0 0;

  color: var(--tt-muted) !important;

  font-size: 0.81rem;

  line-height: 1.5;
}


/* ============================================================
   MINI DATABASE SUMMARY
============================================================ */

.tt-dashboard-mini-stats {

  max-width: 1600px;

  margin: 0 auto 18px;

  display: grid;

  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );

  border:
    1px solid var(--tt-border);

  border-radius: 16px;

  overflow: hidden;

  background: rgba(
    13,
    26,
    46,
    0.6
  );
}


.tt-dashboard-mini-stats > div {

  padding: 17px 20px;

  border-right:
    1px solid var(--tt-border);
}


.tt-dashboard-mini-stats
> div:last-child {

  border-right: none;
}


.tt-dashboard-mini-stats span {

  display: block;

  color: var(--tt-faint) !important;

  font-size: 0.67rem;

  font-weight: 750;

  letter-spacing: 0.09em;
}


.tt-dashboard-mini-stats strong {

  display: block;

  margin-top: 5px;

  color: var(--tt-text) !important;

  font-size: 1.25rem;
}


/* ============================================================
   GENERAL PANELS
============================================================ */

.tt-dashboard-panel {

  max-width: 1600px;

  margin: 0 auto 18px;

  padding: 23px 24px;

  border:
    1px solid var(--tt-border);

  border-radius: 18px;

  background: var(--tt-panel);
}


.tt-dashboard-panel-header {

  display: flex;

  flex-wrap: wrap;

  justify-content: space-between;

  align-items: flex-start;

  gap: 15px;

  margin-bottom: 20px;
}


.tt-dashboard-label {

  margin: 0 0 5px;

  color: var(--tt-cyan) !important;

  font-size: 0.69rem;

  font-weight: 800;

  letter-spacing: 0.11em;
}


.tt-dashboard-panel-header h2 {

  margin: 0;

  color: var(--tt-text) !important;

  font-size: 1.3rem;
}


.tt-dashboard-panel-header p:last-child {

  max-width: 720px;

  margin: 8px 0 0;

  color: var(--tt-muted) !important;

  line-height: 1.55;
}


.tt-dashboard-chip {

  padding: 6px 11px;

  border:
    1px solid var(--tt-border);

  border-radius: 999px;

  color: var(--tt-cyan) !important;

  background:
    rgba(
      34,
      211,
      238,
      0.07
    );

  font-size: 0.74rem;

  font-weight: 750;
}


/* ============================================================
   QUICK ACTIONS
============================================================ */

.tt-dashboard-action-grid {

  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  gap: 15px;
}


.tt-dashboard-action {

  display: flex;

  align-items: center;

  gap: 15px;

  width: 100%;

  padding: 19px;

  border:
    1px solid var(--tt-border);

  border-radius: 15px;

  background:
    rgba(
      255,
      255,
      255,
      0.025
    );

  text-align: left;

  color: var(--tt-text) !important;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}


.tt-dashboard-action:hover {

  transform: translateY(-3px);

  background:
    rgba(
      255,
      255,
      255,
      0.055
    );

  border-color:
    var(--tt-border-strong);
}


.tt-dashboard-action-icon {

  width: 50px;

  height: 50px;

  flex: 0 0 auto;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 13px;

  background:
    rgba(
      255,
      255,
      255,
      0.06
    );

  font-size: 1.35rem;
}


.tt-dashboard-action-content {

  flex: 1;

  min-width: 0;
}


.tt-dashboard-action-content strong {

  display: block;

  color: var(--tt-text) !important;

  margin-bottom: 5px;
}


.tt-dashboard-action-content span {

  display: block;

  color: var(--tt-muted) !important;

  font-size: 0.82rem;

  line-height: 1.5;
}


.tt-dashboard-action-arrow {

  color: var(--tt-cyan) !important;

  font-size: 1.35rem;
}


/* ============================================================
   TWO COLUMN
============================================================ */

.tt-dashboard-two-column {

  max-width: 1600px;

  margin: 0 auto;

  display: grid;

  grid-template-columns:
    minmax(0, 1.25fr)
    minmax(320px, 0.75fr);

  gap: 18px;
}


.tt-dashboard-two-column
.tt-dashboard-panel {

  width: 100%;
}


/* ============================================================
   YEAR CHART
============================================================ */

.tt-dashboard-year-chart {

  min-height: 230px;

  display: flex;

  align-items: flex-end;

  gap: 10px;

  padding: 20px 10px 5px;

  overflow-x: auto;

  border-top:
    1px solid var(--tt-border);

  border-bottom:
    1px solid var(--tt-border);
}


.tt-dashboard-year {

  min-width: 43px;

  flex: 1;

  max-width: 70px;

  height: 205px;

  display: flex;

  flex-direction: column;

  justify-content: flex-end;

  align-items: center;

  gap: 7px;
}


.tt-dashboard-year-value {

  color: var(--tt-faint) !important;

  font-size: 0.68rem;

  font-weight: 700;
}


.tt-dashboard-year-bar-area {

  width: 100%;

  height: 165px;

  display: flex;

  align-items: flex-end;
}


.tt-dashboard-year-bar {

  width: 100%;

  min-height: 4px;

  border-radius:
    6px 6px 3px 3px;

  background:
    linear-gradient(
      180deg,
      #22d3ee,
      #4f46e5
    );

  transition:
    height 0.45s ease;
}


.tt-dashboard-year span {

  color: var(--tt-faint) !important;

  font-size: 0.68rem;

  font-weight: 700;
}


.tt-dashboard-chart-note {

  display: flex;

  flex-wrap: wrap;

  align-items: center;

  gap: 7px 12px;

  margin-top: 15px;

  color: var(--tt-muted) !important;

  font-size: 0.74rem;
}


.tt-dashboard-dot {

  width: 9px;

  height: 9px;

  border-radius: 50%;
}


.tt-dashboard-dot.cyan {

  background: var(--tt-cyan);
}


/* ============================================================
   LATEST RECORD
============================================================ */

.tt-dashboard-latest {

  display: grid;

  gap: 1px;

  overflow: hidden;

  border:
    1px solid var(--tt-border);

  border-radius: 13px;
}


.tt-dashboard-latest > div {

  padding: 15px;

  background:
    rgba(
      255,
      255,
      255,
      0.025
    );

  border-bottom:
    1px solid var(--tt-border);
}


.tt-dashboard-latest
> div:last-child {

  border-bottom: none;
}


.tt-dashboard-latest span {

  display: block;

  margin-bottom: 5px;

  color: var(--tt-faint) !important;

  font-size: 0.66rem;

  font-weight: 750;

  letter-spacing: 0.08em;
}


.tt-dashboard-latest strong {

  color: var(--tt-text) !important;

  font-size: 1rem;
}


.tt-dashboard-latest
strong.mono {

  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;

  font-size: 0.77rem;

  word-break: break-all;
}


/* ============================================================
   SAFETY STANDARD CARDS
============================================================ */

.tt-dashboard-standard-grid {

  display: grid;

  grid-template-columns:
    repeat(
      auto-fit,
      minmax(250px, 1fr)
    );

  gap: 15px;
}


.tt-dashboard-standard {

  padding: 18px;

  border:
    1px solid var(--tt-border);

  border-radius: 14px;

  background:
    linear-gradient(
      145deg,
      rgba(
        34,
        211,
        238,
        0.045
      ),
      rgba(
        167,
        139,
        250,
        0.045
      )
    );
}


.tt-dashboard-standard-top {

  display: flex;

  justify-content: space-between;

  align-items: flex-start;

  gap: 12px;
}


.tt-dashboard-standard-caption {

  display: block;

  margin-bottom: 5px;

  color: var(--tt-faint) !important;

  font-size: 0.64rem;

  font-weight: 750;

  letter-spacing: 0.08em;
}


.tt-dashboard-standard h3 {

  margin: 0;

  color: var(--tt-text) !important;

  font-size: 0.98rem;
}


.tt-dashboard-standard-top
> strong {

  color: var(--tt-cyan) !important;

  white-space: nowrap;

  font-size: 1.02rem;
}


.tt-dashboard-threshold-line {

  height: 5px;

  margin: 15px 0;

  overflow: hidden;

  border-radius: 999px;

  background:
    rgba(
      139,
      167,
      199,
      0.14
    );
}


.tt-dashboard-threshold-line span {

  display: block;

  height: 100%;

  min-width: 10%;

  border-radius: inherit;

  background:
    linear-gradient(
      90deg,
      #22d3ee,
      #a78bfa
    );
}


.tt-dashboard-standard p {

  min-height: 65px;

  margin: 0;

  color: var(--tt-muted) !important;

  font-size: 0.79rem;

  line-height: 1.5;
}


.tt-dashboard-standard footer {

  margin-top: 14px;

  padding-top: 11px;

  border-top:
    1px solid var(--tt-border);

  color: var(--tt-faint) !important;

  font-size: 0.72rem;

  line-height: 1.4;
}


/* ============================================================
   SEARCH
============================================================ */

.tt-dashboard-panel-tools {

  display: flex;

  align-items: center;

  gap: 10px;
}


.tt-dashboard-search {

  width: min(
    280px,
    100%
  );

  padding: 10px 13px;

  border:
    1px solid var(--tt-border);

  border-radius: 10px;

  background:
    rgba(
      255,
      255,
      255,
      0.045
    );

  color: var(--tt-text) !important;

  outline: none;
}


.tt-dashboard-search::placeholder {

  color: var(--tt-faint);
}


.tt-dashboard-search:focus {

  border-color:
    var(--tt-border-strong);

  box-shadow:
    0 0 0 3px
    rgba(
      34,
      211,
      238,
      0.07
    );
}


/* ============================================================
   TABLE
============================================================ */

.tt-dashboard-table-wrapper {

  width: 100%;

  overflow-x: auto;

  border:
    1px solid var(--tt-border);

  border-radius: 13px;
}


.tt-dashboard-table {

  width: 100%;

  min-width: 700px;

  border-collapse: collapse;
}


.tt-dashboard-table th {

  padding: 12px 14px;

  text-align: left;

  background:
    var(--tt-panel-solid);

  color: var(--tt-faint) !important;

  border-bottom:
    1px solid var(--tt-border);

  font-size: 0.68rem;

  letter-spacing: 0.08em;

  text-transform: uppercase;
}


.tt-dashboard-table td {

  padding: 13px 14px;

  color: var(--tt-muted) !important;

  border-bottom:
    1px solid
    rgba(
      139,
      167,
      199,
      0.08
    );

  font-size: 0.82rem;
}


.tt-dashboard-table tr:last-child td {

  border-bottom: none;
}


.tt-dashboard-table tbody tr:hover {

  background:
    rgba(
      34,
      211,
      238,
      0.045
    );
}


.tt-dashboard-mono {

  color: var(--tt-text) !important;

  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;

  font-size: 0.72rem;
}


.tt-dashboard-value-badge {

  display: inline-flex;

  padding: 5px 9px;

  border-radius: 999px;

  background:
    rgba(
      34,
      211,
      238,
      0.09
    );

  border:
    1px solid
    rgba(
      34,
      211,
      238,
      0.25
    );

  color: var(--tt-cyan) !important;

  font-weight: 700;
}


.tt-dashboard-unavailable {

  color: var(--tt-faint) !important;

  font-style: italic;
}


/* ============================================================
   EMPTY STATE
============================================================ */

.tt-dashboard-empty {

  padding: 35px 15px;

  text-align: center;

  color: var(--tt-faint) !important;
}


/* ============================================================
   DATA QUALITY NOTICE
============================================================ */

.tt-dashboard-data-note {

  max-width: 1600px;

  margin: 0 auto 22px;

  display: flex;

  gap: 13px;

  padding: 17px 19px;

  border:
    1px solid
    rgba(
      34,
      211,
      238,
      0.18
    );

  border-radius: 14px;

  background:
    rgba(
      34,
      211,
      238,
      0.035
    );
}


.tt-dashboard-data-note-icon {

  width: 28px;

  height: 28px;

  flex: 0 0 auto;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background:
    rgba(
      34,
      211,
      238,
      0.12
    );

  color: var(--tt-cyan) !important;

  font-weight: 800;
}


.tt-dashboard-data-note strong {

  display: block;

  margin-bottom: 4px;

  color: var(--tt-text) !important;
}


.tt-dashboard-data-note p {

  margin: 0;

  color: var(--tt-muted) !important;

  font-size: 0.8rem;

  line-height: 1.55;
}


/* ============================================================
   ERROR
============================================================ */

.tt-dashboard-error {

  max-width: 650px;

  margin: 90px auto;

  padding: 35px;

  text-align: center;

  border:
    1px solid
    rgba(
      244,
      63,
      94,
      0.25
    );

  border-radius: 18px;

  background:
    rgba(
      244,
      63,
      94,
      0.05
    );
}


.tt-dashboard-error-icon {

  font-size: 2.5rem;
}


.tt-dashboard-error h1 {

  margin: 12px 0 8px;

  color: var(--tt-text) !important;
}


.tt-dashboard-error p {

  color: var(--tt-muted) !important;

  line-height: 1.6;
}


.tt-dashboard-primary-button {

  margin-top: 12px;

  padding: 11px 17px;

  border: none;

  border-radius: 10px;

  background:
    linear-gradient(
      100deg,
      #22d3ee,
      #6366f1
    );

  color: white !important;

  font-weight: 750;

  cursor: pointer;
}


/* ============================================================
   LOADING
============================================================ */

.tt-dashboard-loading-card {

  min-height: 150px;

  padding: 22px;

  margin-bottom: 18px;

  border:
    1px solid var(--tt-border);

  border-radius: 18px;

  background:
    rgba(
      13,
      26,
      46,
      0.7
    );
}


.tt-dashboard-loading-line {

  height: 13px;

  margin-bottom: 14px;

  border-radius: 999px;

  background:
    linear-gradient(
      90deg,
      rgba(
        255,
        255,
        255,
        0.04
      ),
      rgba(
        255,
        255,
        255,
        0.10
      ),
      rgba(
        255,
        255,
        255,
        0.04
      )
    );

  background-size: 200% 100%;

  animation:
    tt-dashboard-shimmer
    1.5s infinite;
}


.tt-dashboard-loading-line.large {

  width: 45%;

  height: 25px;
}


.tt-dashboard-loading-line.medium {

  width: 75%;
}


.tt-dashboard-loading-line.small {

  width: 55%;
}


@keyframes tt-dashboard-shimmer {

  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }

}


/* ============================================================
   RESPONSIVE DESIGN
============================================================ */

@media (max-width: 1100px) {

  .tt-dashboard-stat-grid {

    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }


  .tt-dashboard-mini-stats {

    grid-template-columns:
      repeat(
        2,
        1fr
      );
  }


  .tt-dashboard-mini-stats
  > div:nth-child(2) {

    border-right: none;
  }


  .tt-dashboard-two-column {

    grid-template-columns: 1fr;
  }

}


@media (max-width: 800px) {

  .tt-dashboard.tt-dashboard {

    padding:
      22px 18px 60px;
  }


  .tt-dashboard-action-grid {

    grid-template-columns: 1fr;
  }


  .tt-dashboard-hero {

    margin-top: 22px;
  }

}


@media (max-width: 600px) {

  .tt-dashboard-stat-grid {

    grid-template-columns: 1fr;
  }


  .tt-dashboard-mini-stats {

    grid-template-columns: 1fr;
  }


  .tt-dashboard-mini-stats
  > div {

    border-right: none;

    border-bottom:
      1px solid var(--tt-border);
  }


  .tt-dashboard-mini-stats
  > div:last-child {

    border-bottom: none;
  }


  .tt-dashboard-status {

    min-width: 0;

    width: 100%;
  }


  .tt-dashboard-panel {

    padding:
      18px 15px;
  }


  .tt-dashboard-panel-tools {

    width: 100%;
  }


  .tt-dashboard-search {

    width: 100%;
  }


  .tt-dashboard-data-note {

    padding: 14px;
  }

}


/* ============================================================
   REDUCED MOTION
============================================================ */

@media (prefers-reduced-motion: reduce) {

  .tt-dashboard.tt-dashboard *,
  .tt-dashboard.tt-dashboard *::before,
  .tt-dashboard.tt-dashboard *::after {

    animation-duration: 0.001ms !important;

    animation-iteration-count: 1 !important;

    transition-duration: 0.001ms !important;
  }

}


/* ============================================================
   STICKY DASHBOARD HERO
   Keep the title, description, and status card visible while
   scrolling. This rule is deliberately placed after responsive
   rules so they cannot override the sticky positioning.
============================================================ */

.tt-dashboard .tt-dashboard-sticky-hero {
  position: sticky !important;
  top: 0 !important;
  z-index: 1000 !important;
  width: 100%;
  margin: 0 auto 30px !important;
  padding: 18px 0 20px;
  background: #071229;
  border-bottom: 1px solid var(--tt-border);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

@media (max-width: 800px) {
  .tt-dashboard .tt-dashboard-sticky-hero {
    padding: 14px 0 16px;
    margin-bottom: 24px !important;
  }
}

`;

// ============================================================
// EXPORT
// ============================================================

export default Dashboard;