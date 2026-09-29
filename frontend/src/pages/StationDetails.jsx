import { useEffect, useMemo, useState } from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import axios from "axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import "../App.css";


function StationDetails() {

  // ============================================
  // ROUTING
  // ============================================

  const location = useLocation();
  const navigate = useNavigate();

  // The Water Map and Stations pages send the
  // complete station object through route state.
  const station = location.state?.station;


  // ============================================
  // MEASUREMENT DATA
  // ============================================

  const [measurements, setMeasurements] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ============================================
  // SAFETY DATA
  // ============================================

  const [standards, setStandards] =
    useState([]);

  const [selectedUserGroup, setSelectedUserGroup] =
    useState("Swimmers_Families");


  // ============================================
  // DATE FILTER
  // ============================================

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");


  // ============================================
  // LOAD STATION MEASUREMENTS
  // ============================================

  useEffect(() => {

    if (!station?.STATION_ID) {
      return;
    }


    const loadMeasurements = async () => {

      try {

        setLoading(true);
        setError("");


        const response =
          await axios.get(
            `http://localhost:5000/api/measurements?stationId=${encodeURIComponent(
              station.STATION_ID
            )}`
          );


        setMeasurements(
          Array.isArray(response.data)
            ? response.data
            : []
        );

      } catch (err) {

        console.error(
          "Failed to load measurements:",
          err
        );


        setError(
          "Unable to load measurement records."
        );


        setMeasurements([]);

      } finally {

        setLoading(false);

      }

    };


    loadMeasurements();

  }, [station]);


  // ============================================
  // LOAD SAFETY STANDARDS
  // ============================================

  useEffect(() => {

    const loadStandards = async () => {

      try {

        const response =
          await axios.get(
            "http://localhost:5000/api/safety-standards"
          );


        setStandards(
          Array.isArray(response.data)
            ? response.data
            : []
        );

      } catch (err) {

        console.error(
          "Failed to load safety standards:",
          err
        );


        setStandards([]);

      }

    };


    loadStandards();

  }, []);


  // ============================================
  // FIND SELECTED SAFETY STANDARD
  // ============================================

  const selectedStandard = useMemo(() => {

    return standards.find(
      (standard) =>
        standard.USER_GROUP ===
        selectedUserGroup
    );

  }, [
    standards,
    selectedUserGroup
  ]);


  // ============================================
  // FILTER MEASUREMENTS BY DATE
  // ============================================

  const filteredMeasurements = useMemo(() => {

    return measurements.filter(
      (measurement) => {

        const measurementDate =
          String(
            measurement.SAMPLE_DATE || ""
          ).split("T")[0];


        const matchesStartDate =
          !startDate ||
          measurementDate >= startDate;


        const matchesEndDate =
          !endDate ||
          measurementDate <= endDate;


        return (
          matchesStartDate &&
          matchesEndDate
        );

      }
    );

  }, [
    measurements,
    startDate,
    endDate
  ]);


  // ============================================
  // CHART DATA
  // ============================================

  const chartData = useMemo(() => {

    return filteredMeasurements

      // Do not plot NULL or invalid values.
      .filter(
        (measurement) => {

          const value =
            measurement.MICROCYSTIN_UGL;


          if (
            value === null ||
            value === undefined ||
            value === ""
          ) {

            return false;

          }


          return Number.isFinite(
            Number(value)
          );

        }
      )

      .map(
        (measurement) => {

          const date =
            String(
              measurement.SAMPLE_DATE || ""
            ).split("T")[0];


          return {

            date,

            microcystin:
              Number(
                measurement.MICROCYSTIN_UGL
              )

          };

        }
      )

      .filter(
        (measurement) =>
          Number.isFinite(
            new Date(
              measurement.date
            ).getTime()
          )
      )

      .sort(
        (a, b) =>
          new Date(a.date) -
          new Date(b.date)
      );

  }, [
    filteredMeasurements
  ]);


  // ============================================
  // FIND LATEST AVAILABLE MEASUREMENT
  // ============================================

  const latestMeasurement = useMemo(() => {

    const availableMeasurements =
      measurements.filter(
        (measurement) => {

          const value =
            measurement.MICROCYSTIN_UGL;


          return (
            value !== null &&
            value !== undefined &&
            value !== "" &&
            Number.isFinite(
              Number(value)
            ) &&
            Number.isFinite(
              new Date(
                measurement.SAMPLE_DATE
              ).getTime()
            )
          );

        }
      );


    if (
      availableMeasurements.length === 0
    ) {

      return null;

    }


    // Create a new sorted array so the original
    // measurements state is not mutated.
    return [
      ...availableMeasurements
    ].sort(
      (a, b) =>
        new Date(
          b.SAMPLE_DATE
        ) -
        new Date(
          a.SAMPLE_DATE
        )
    )[0];

  }, [
    measurements
  ]);


  // ============================================
  // CALCULATE SAFETY STATUS
  // ============================================

  const safetyResult = useMemo(() => {

    // ------------------------------------------
    // No measurement
    // ------------------------------------------

    if (!latestMeasurement) {

      return {

        status: "NO DATA",

        message:
          "No microcystin measurement is available for this station. Safety cannot be determined from the available data."

      };

    }


    // ------------------------------------------
    // No safety standard
    // ------------------------------------------

    if (!selectedStandard) {

      return {

        status: "NO STANDARD",

        message:
          "A safety threshold is not available for the selected user group."

      };

    }


    // ------------------------------------------
    // Get actual measurement
    // ------------------------------------------

    const value =
      Number(
        latestMeasurement.MICROCYSTIN_UGL
      );


    if (
      !Number.isFinite(value)
    ) {

      return {

        status: "NO DATA",

        message:
          "The latest measurement does not contain a valid microcystin value."

      };

    }


    // ------------------------------------------
    // Get actual database threshold
    // ------------------------------------------

    const threshold =
      Number(
        selectedStandard.THRESHOLD_UGL
      );


    if (
      !Number.isFinite(threshold)
    ) {

      return {

        status: "NO STANDARD",

        message:
          "A valid safety threshold is not available for the selected user group."

      };

    }


    // ------------------------------------------
    // Compare measurement with threshold
    // ------------------------------------------

    if (
      value <= threshold
    ) {

      return {

        status:
          "WITHIN THRESHOLD",

        message:
          selectedStandard.ADVISORY_MESSAGE ||
          "The latest measurement is within the selected threshold."

      };

    }


    return {

      status:
        "ABOVE THRESHOLD",

      message:
        selectedStandard.ADVISORY_MESSAGE ||
        "The latest measurement is above the selected threshold."

    };

  }, [
    latestMeasurement,
    selectedStandard
  ]);


  // ============================================
  // USER GROUP DISPLAY NAME
  // ============================================

  const userGroupName = useMemo(() => {

    if (
      selectedUserGroup ===
      "Pet_Owners"
    ) {

      return "Pet Owners";

    }


    if (
      selectedUserGroup ===
      "Swimmers_Families"
    ) {

      return "Swimmers & Families";

    }


    return "Drinking Water";

  }, [
    selectedUserGroup
  ]);


  // ============================================
  // SAFETY CARD BACKGROUND
  // ============================================

  const safetyBackground =
    safetyResult.status ===
    "WITHIN THRESHOLD"

      ? "#eef9f0"

      : safetyResult.status ===
        "ABOVE THRESHOLD"

      ? "#fff0f0"

      : "#f4f4f4";


  // ============================================
  // CLEAR DATE FILTER
  // ============================================

  const clearDateFilter = () => {

    setStartDate("");
    setEndDate("");

  };


  // ============================================
  // HANDLE MISSING STATION
  // ============================================

  if (!station) {

    return (

      <div className="map-page">

        <button
          className="back-button"
          onClick={() =>
            navigate("/map")
          }
        >
          ← Back to Water Map
        </button>


        <div className="map-message error-message">

          <h3>
            No Monitoring Station Selected
          </h3>

          <p>
            Please choose a monitoring station
            from the Water Map before opening
            station details.
          </p>


          <button
            className="primary-button"
            onClick={() =>
              navigate("/map")
            }
          >
            Choose a Monitoring Station
          </button>

        </div>

      </div>

    );

  }


  // ============================================
  // MAIN PAGE
  // ============================================

  return (

    <div className="map-page">


      {/* ========================================
          BACK TO WATER MAP
          ======================================== */}

      <button
        className="back-button"
        onClick={() =>
          navigate("/map")
        }
      >
        ← Back to Water Map
      </button>


      {/* ========================================
          STATION HEADER
          ======================================== */}

      <div className="map-header station-page-header">

        <div className="map-heading-content">

          <p className="section-label">
            MONITORING STATION
          </p>

          <h1>
            {station.STATION_NAME ||
              "Monitoring Station"}
          </h1>

          <p>
            Detailed station information,
            microcystin monitoring records,
            and user-specific water safety
            information.
          </p>

        </div>

      </div>


      {/* ========================================
          STATION INFORMATION
          ======================================== */}

      <div className="station-details">

        <div className="station-details-header">

          <div>

            <p className="section-label">
              STATION INFORMATION
            </p>

            <h2>
              Monitoring Details
            </h2>

          </div>

        </div>


        <div className="station-details-grid">


          {/* Station ID */}

          <div className="detail-item">

            <span>
              Station ID
            </span>

            <strong>
              {station.STATION_ID ||
                "N/A"}
            </strong>

          </div>


          {/* Water Type */}

          <div className="detail-item">

            <span>
              Water Type
            </span>

            <strong>
              {station.TYPE_NAME ||
                "N/A"}
            </strong>

          </div>


          {/* County */}

          <div className="detail-item">

            <span>
              County
            </span>

            <strong>
              {station.COUNTY_CODE ||
                "N/A"}
            </strong>

          </div>


          {/* State */}

          <div className="detail-item">

            <span>
              State
            </span>

            <strong>
              {station.STATE ||
                "N/A"}
            </strong>

          </div>


          {/* Latitude */}

          <div className="detail-item">

            <span>
              Latitude
            </span>

            <strong>
              {station.LATITUDE ??
                "N/A"}
            </strong>

          </div>


          {/* Longitude */}

          <div className="detail-item">

            <span>
              Longitude
            </span>

            <strong>
              {station.LONGITUDE ??
                "N/A"}
            </strong>

          </div>

        </div>


        {/* ======================================
            ACTION BUTTONS
            ====================================== */}

        <div className="station-actions">

          <button
            className="secondary-button"
            onClick={() =>
              navigate(
                "/safety",
                {
                  state: {
                    station
                  }
                }
              )
            }
          >
            Open Full Safety Check
          </button>


          <button
            className="secondary-button"
            onClick={() =>
              navigate(
                "/report",
                {
                  state: {
                    station
                  }
                }
              )
            }
          >
            Report an Issue
          </button>

        </div>

      </div>


      {/* ========================================
          USER-SPECIFIC SAFETY
          ======================================== */}

      <div className="station-details">

        <div className="measurement-history-header">

          <div>

            <p className="section-label">
              WATER SAFETY
            </p>

            <h2>
              Safety for Selected User
            </h2>

          </div>

        </div>


        {/* User group selection */}

        <div
          style={{
            marginBottom: "20px"
          }}
        >

          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "8px"
            }}
          >
            Select User Group
          </label>


          <select
            value={selectedUserGroup}
            onChange={(event) =>
              setSelectedUserGroup(
                event.target.value
              )
            }
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              minWidth: "260px"
            }}
          >

            <option value="Pet_Owners">
              Pet Owners
            </option>

            <option value="Swimmers_Families">
              Swimmers & Families
            </option>

            <option value="Drinking_Water">
              Drinking Water
            </option>

          </select>

        </div>


        {/* Safety result */}

        <div
          style={{
            padding: "18px",
            borderRadius: "10px",
            background:
              safetyBackground
          }}
        >

          <h3>
            {userGroupName}
          </h3>


          <p>

            <strong>
              Status:
            </strong>{" "}

            <span
              style={{
                fontWeight: "bold",

                color:
                  safetyResult.status ===
                  "WITHIN THRESHOLD"

                    ? "green"

                    : safetyResult.status ===
                      "ABOVE THRESHOLD"

                    ? "red"

                    : "#666"
              }}
            >
              {safetyResult.status}
            </span>

          </p>


          <p>

            <strong>
              Latest Microcystin:
            </strong>{" "}

            {latestMeasurement

              ? `${latestMeasurement.MICROCYSTIN_UGL} µg/L`

              : "No value available"}

          </p>


          <p>

            <strong>
              Latest Sample Date:
            </strong>{" "}

            {latestMeasurement

              ? String(
                  latestMeasurement.SAMPLE_DATE
                ).split("T")[0]

              : "N/A"}

          </p>


          <p>

            <strong>
              Selected Threshold:
            </strong>{" "}

            {selectedStandard &&
            Number.isFinite(
              Number(
                selectedStandard.THRESHOLD_UGL
              )
            )

              ? `${selectedStandard.THRESHOLD_UGL} µg/L`

              : "N/A"}

          </p>


          <p
            style={{
              lineHeight: "1.6"
            }}
          >

            <strong>
              Advisory:
            </strong>{" "}

            {safetyResult.message}

          </p>


          {/* Citing agency */}

          {selectedStandard?.CITING_AGENCY && (

            <p
              style={{
                fontSize: "13px"
              }}
            >

              <strong>
                Citing Agency:
              </strong>{" "}

              {selectedStandard.CITING_AGENCY}

            </p>

          )}

        </div>

      </div>


      {/* ========================================
          MEASUREMENT HISTORY
          ======================================== */}

      <div className="station-details">

        <div className="measurement-history-header">

          <div>

            <p className="section-label">
              MONITORING RECORDS
            </p>

            <h2>
              Microcystin Measurements
            </h2>

          </div>


          {filteredMeasurements.length > 0 && (

            <span className="measurement-count">

              {filteredMeasurements.length} records

            </span>

          )}

        </div>


        {/* ======================================
            DATE FILTER
            ====================================== */}

        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            alignItems: "end",
            marginBottom: "20px"
          }}
        >

          <div>

            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600"
              }}
            >
              From
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(event) =>
                setStartDate(
                  event.target.value
                )
              }
              style={{
                padding: "9px",
                borderRadius: "7px",
                border: "1px solid #ccc"
              }}
            />

          </div>


          <div>

            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600"
              }}
            >
              To
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(event) =>
                setEndDate(
                  event.target.value
                )
              }
              style={{
                padding: "9px",
                borderRadius: "7px",
                border: "1px solid #ccc"
              }}
            />

          </div>


          <button
            onClick={clearDateFilter}
            className="secondary-button"
          >
            Clear Date Filter
          </button>

        </div>


        {/* ======================================
            LOADING STATE
            ====================================== */}

        {loading && (

          <div className="map-message">

            Loading measurement records...

          </div>

        )}


        {/* ======================================
            ERROR STATE
            ====================================== */}

        {error && (

          <div className="map-message error-message">

            {error}

          </div>

        )}


        {/* ======================================
            MEASUREMENT RECORDS
            ====================================== */}

        {!loading &&
          !error &&
          filteredMeasurements.length > 0 && (

            <div className="measurement-list">

              {filteredMeasurements.map(
                (measurement) => (

                  <div
                    className="measurement-row"
                    key={
                      measurement.SAMPLE_ID
                    }
                  >


                    <div>

                      <span className="measurement-label">
                        Sample Date
                      </span>

                      <strong>

                        {String(
                          measurement.SAMPLE_DATE
                        )
                          .split("T")[0]
                          .replace(
                            /-/g,
                            "/"
                          )}

                      </strong>

                    </div>


                    <div className="measurement-value">

                      <span className="measurement-label">
                        Microcystin
                      </span>

                      <strong>

                        {measurement.MICROCYSTIN_UGL ===
                          null ||
                        measurement.MICROCYSTIN_UGL ===
                          undefined ||
                        measurement.MICROCYSTIN_UGL ===
                          ""

                          ? "No value recorded"

                          : `${measurement.MICROCYSTIN_UGL} µg/L`}

                      </strong>

                    </div>

                  </div>

                )
              )}

            </div>

          )}


        {/* ======================================
            NO DATA AFTER FILTER
            ====================================== */}

        {!loading &&
          !error &&
          filteredMeasurements.length === 0 && (

            <div className="map-message">

              {measurements.length === 0

                ? "No measurement records are available for this station."

                : "No measurement records match the selected date range."}

            </div>

          )}

      </div>


      {/* ========================================
          MICROCYSTIN TREND
          ======================================== */}

      {!loading &&
        !error &&
        chartData.length > 0 && (

          <div className="station-details">

            <div className="measurement-history-header">

              <div>

                <p className="section-label">
                  TREND
                </p>

                <h2>
                  Microcystin Over Time
                </h2>

                <p>
                  The chart uses available recorded
                  microcystin measurements only.
                  Missing values are not treated
                  as zero.
                </p>

              </div>

            </div>


            <div className="chart-wrapper">

              <ResponsiveContainer
                width="100%"
                height={350}
              >

                <LineChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 10,
                    bottom: 20
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />


                  <XAxis
                    dataKey="date"
                    label={{
                      value:
                        "Sample Date",
                      position:
                        "insideBottom",
                      offset: -10
                    }}
                  />


                  <YAxis
                    label={{
                      value:
                        "Microcystin (µg/L)",
                      angle: -90,
                      position:
                        "insideLeft"
                    }}
                  />


                  <Tooltip
                    formatter={(value) => [
                      `${value} µg/L`,
                      "Microcystin"
                    ]}
                  />


                  <Line
                    type="monotone"
                    dataKey="microcystin"
                    name="Microcystin"
                    strokeWidth={3}
                    dot={{
                      r: 5
                    }}
                    activeDot={{
                      r: 7
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

        )}


      {/* ========================================
          NO CHART DATA
          ======================================== */}

      {!loading &&
        !error &&
        chartData.length === 0 &&
        filteredMeasurements.length > 0 && (

          <div className="station-details">

            <p className="section-label">
              TREND
            </p>

            <h2>
              Microcystin Over Time
            </h2>

            <div className="map-message">

              No numeric microcystin values are
              available for the selected date range,
              so a trend cannot be displayed.

            </div>

          </div>

        )}

    </div>

  );

}


export default StationDetails;