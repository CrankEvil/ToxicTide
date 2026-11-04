import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../App.css";


// --------------------------------------------------
// Fix Leaflet's default marker images when using
// React/Vite.
// --------------------------------------------------

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


function WaterMap() {

  const navigate = useNavigate();


  // --------------------------------------------------
  // Main backend data
  // --------------------------------------------------

  const [stations, setStations] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [standards, setStandards] = useState([]);


  // --------------------------------------------------
  // Search and filters
  // --------------------------------------------------

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedWaterType, setSelectedWaterType] =
    useState("All");

  const [selectedCounty, setSelectedCounty] =
    useState("All");


  // Selected user group controls which
  // safety threshold is used.
  const [selectedUserGroup, setSelectedUserGroup] =
    useState("Swimmers_Families");


  // --------------------------------------------------
  // Loading and error
  // --------------------------------------------------

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // --------------------------------------------------
  // Load official backend data
  // --------------------------------------------------

  useEffect(() => {

    const loadMapData = async () => {

      try {

        setLoading(true);
        setError("");


        const [
          stationResponse,
          measurementResponse,
          standardResponse
        ] = await Promise.all([

          axios.get(
            "https://toxictide-backend.onrender.com/api/stations"
          ),

          axios.get(
            "https://toxictide-backend.onrender.com/api/measurements/all"
          ),

          axios.get(
            "https://toxictide-backend.onrender.com/api/safety-standards"
          )

        ]);


        setStations(
          stationResponse.data || []
        );

        setMeasurements(
          measurementResponse.data || []
        );

        setStandards(
          standardResponse.data || []
        );

      } catch (err) {

        console.error(
          "Error loading water map data:",
          err
        );

        setError(
          "Unable to load monitoring data. Please make sure the ToxicTide backend is running."
        );

      } finally {

        setLoading(false);

      }

    };


    loadMapData();

  }, []);


  // --------------------------------------------------
  // Create a lookup containing the latest available
  // non-null measurement for each station.
  // --------------------------------------------------

  const latestMeasurementsByStation = useMemo(() => {

    const latestMap = new Map();


    measurements.forEach((measurement) => {

      const value =
        measurement.MICROCYSTIN_UGL;


      // NULL / empty values are not treated as
      // measurements.
      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {

        return;

      }


      // Only actual numeric measurements should
      // participate in safety calculations.
      const numericValue =
        Number(value);


      if (!Number.isFinite(numericValue)) {

        return;

      }


      const stationId =
        String(measurement.STATION_ID);


      const existing =
        latestMap.get(stationId);


      if (!existing) {

        latestMap.set(
          stationId,
          measurement
        );

        return;

      }


      const currentDate =
        new Date(
          measurement.SAMPLE_DATE
        );


      const existingDate =
        new Date(
          existing.SAMPLE_DATE
        );


      if (
        Number.isFinite(currentDate.getTime()) &&
        Number.isFinite(existingDate.getTime()) &&
        currentDate > existingDate
      ) {

        latestMap.set(
          stationId,
          measurement
        );

      }

    });


    return latestMap;

  }, [measurements]);


  // --------------------------------------------------
  // Create a lookup for safety standards.
  // --------------------------------------------------

  const standardsByUserGroup = useMemo(() => {

    const standardMap = new Map();


    standards.forEach((standard) => {

      if (standard.USER_GROUP) {

        standardMap.set(
          standard.USER_GROUP,
          standard
        );

      }

    });


    return standardMap;

  }, [standards]);


  // --------------------------------------------------
  // Get the selected safety standard.
  // --------------------------------------------------

  const selectedStandard = useMemo(() => {

    return standardsByUserGroup.get(
      selectedUserGroup
    );

  }, [
    standardsByUserGroup,
    selectedUserGroup
  ]);


  // --------------------------------------------------
  // Get unique water types from actual station data.
  // --------------------------------------------------

  const waterTypes = useMemo(() => {

    const types = stations
      .map(
        (station) =>
          station.TYPE_NAME
      )
      .filter(Boolean);


    return [
      "All",
      ...new Set(types)
    ];

  }, [stations]);


  // --------------------------------------------------
  // Get unique county codes from actual station data.
  // --------------------------------------------------

  const counties = useMemo(() => {

    const countyCodes = stations
      .map(
        (station) =>
          station.COUNTY_CODE
      )
      .filter(
        (value) =>
          value !== null &&
          value !== undefined &&
          value !== ""
      );


    return [
      "All",
      ...new Set(countyCodes)
    ];

  }, [stations]);


  // --------------------------------------------------
  // Get readable user-group name.
  // --------------------------------------------------

  const getUserGroupName = () => {

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

  };


  // --------------------------------------------------
  // Calculate safety information for one station.
  // --------------------------------------------------

  const getSafetyInformation = (station) => {

    const latestMeasurement =
      latestMeasurementsByStation.get(
        String(station.STATION_ID)
      );


    const standard =
      selectedStandard;


    // ----------------------------------------------
    // No official measurement available
    // ----------------------------------------------

    if (!latestMeasurement) {

      return {

        measurement: null,

        threshold:
          standard?.THRESHOLD_UGL ??
          standard?.THRESHOLD ??
          standard?.threshold ??
          null,

        status: "NO DATA",

        advisory:
          "No microcystin measurement is available for this station. Safety cannot be determined from the available data."

      };

    }


    // ----------------------------------------------
    // Convert actual database value to number
    // ----------------------------------------------

    const value =
      Number(
        latestMeasurement.MICROCYSTIN_UGL
      );


    // ----------------------------------------------
    // Protect against invalid measurement values.
    // ----------------------------------------------

    if (
      !Number.isFinite(value)
    ) {

      return {

        measurement: null,

        threshold:
          standard?.THRESHOLD_UGL ??
          standard?.THRESHOLD ??
          standard?.threshold ??
          null,

        status: "NO DATA",

        advisory:
          "A valid microcystin measurement is not available for this station."

      };

    }


    // ----------------------------------------------
    // Get threshold from database
    // ----------------------------------------------

    const threshold =
      standard?.THRESHOLD_UGL ??
      standard?.THRESHOLD ??
      standard?.threshold ??
      null;


    // ----------------------------------------------
    // No threshold available
    // ----------------------------------------------

    if (
      threshold === null ||
      threshold === undefined ||
      threshold === ""
    ) {

      return {

        measurement: latestMeasurement,

        threshold: null,

        status: "NO STANDARD",

        advisory:
          "A safety threshold is not available for the selected user group."

      };

    }


    const numericThreshold =
      Number(threshold);


    // ----------------------------------------------
    // Invalid threshold protection
    // ----------------------------------------------

    if (
      !Number.isFinite(numericThreshold)
    ) {

      return {

        measurement: latestMeasurement,

        threshold: null,

        status: "NO STANDARD",

        advisory:
          "A valid safety threshold is not available for the selected user group."

      };

    }


    // ----------------------------------------------
    // Compare official measurement with
    // database threshold.
    // ----------------------------------------------

    if (
      value <= numericThreshold
    ) {

      return {

        measurement: latestMeasurement,

        threshold: numericThreshold,

        status: "WITHIN THRESHOLD",

        advisory:
          standard.ADVISORY_MESSAGE ||
          "The latest recorded measurement is within the selected database threshold."

      };

    }


    return {

      measurement: latestMeasurement,

      threshold: numericThreshold,

      status: "ABOVE THRESHOLD",

      advisory:
        standard.ADVISORY_MESSAGE ||
        "The latest recorded measurement is above the selected database threshold."

    };

  };


  // --------------------------------------------------
  // Filter stations.
  // --------------------------------------------------

  const filteredStations = useMemo(() => {

    const search =
      searchTerm
        .trim()
        .toLowerCase();


    return stations.filter((station) => {

      const stationName =
        String(
          station.STATION_NAME || ""
        ).toLowerCase();


      const stationId =
        String(
          station.STATION_ID || ""
        ).toLowerCase();


      const county =
        String(
          station.COUNTY_CODE || ""
        ).toLowerCase();


      const waterType =
        String(
          station.TYPE_NAME || ""
        ).toLowerCase();


      const state =
        String(
          station.STATE || ""
        ).toLowerCase();


      // Search supports station name,
      // station ID, county, water type and state.
      const matchesSearch =
        !search ||
        stationName.includes(search) ||
        stationId.includes(search) ||
        county.includes(search) ||
        waterType.includes(search) ||
        state.includes(search);


      const matchesWaterType =
        selectedWaterType === "All" ||
        station.TYPE_NAME ===
          selectedWaterType;


      const matchesCounty =
        selectedCounty === "All" ||
        String(
          station.COUNTY_CODE
        ) ===
          String(selectedCounty);


      return (
        matchesSearch &&
        matchesWaterType &&
        matchesCounty
      );

    });

  }, [
    stations,
    searchTerm,
    selectedWaterType,
    selectedCounty
  ]);


  // --------------------------------------------------
  // Count stations with valid coordinates.
  // --------------------------------------------------

  const mappedStationCount = useMemo(() => {

    return filteredStations.filter(
      (station) => {

        const latitude =
          Number(station.LATITUDE);

        const longitude =
          Number(station.LONGITUDE);


        return (
          Number.isFinite(latitude) &&
          Number.isFinite(longitude)
        );

      }
    ).length;

  }, [filteredStations]);


  // --------------------------------------------------
  // Reset filters.
  // --------------------------------------------------

  const clearFilters = () => {

    setSearchTerm("");
    setSelectedWaterType("All");
    setSelectedCounty("All");

  };


  // --------------------------------------------------
  // Loading screen
  // --------------------------------------------------

  if (loading) {

    return (

      <div className="page-container">

        <h2>
          Water Monitoring Map
        </h2>

        <p>
          Loading official monitoring station data...
        </p>

      </div>

    );

  }


  // --------------------------------------------------
  // Error screen
  // --------------------------------------------------

  if (error) {

    return (

      <div className="page-container">

        <h2>
          Water Monitoring Map
        </h2>

        <p>
          {error}
        </p>

      </div>

    );

  }


  // --------------------------------------------------
  // Main page
  // --------------------------------------------------

  return (

    <div className="page-container">


      {/* ------------------------------------------ */}
      {/* Back navigation                            */}
      {/* ------------------------------------------ */}

      <button
        onClick={() => navigate("/dashboard")}
        className="back-button"
      >
        ← Back to Dashboard
      </button>


      {/* ------------------------------------------ */}
      {/* Page heading                               */}
      {/* ------------------------------------------ */}

      <div
        style={{
          marginBottom: "20px"
        }}
      >

        <h1>
          Water Monitoring Map
        </h1>

        <p>
          Explore official water monitoring stations
          and check the latest available microcystin
          information.
        </p>

      </div>


      {/* ------------------------------------------ */}
      {/* Safety user group selector                 */}
      {/* ------------------------------------------ */}

      <div
        style={{
          padding: "18px",
          borderRadius: "12px",
          background: "#f5f8fc",
          marginBottom: "20px"
        }}
      >

        <h3
          style={{
            marginTop: 0
          }}
        >
          Check Safety For
        </h3>


        <p>
          Select the user group to compare available
          microcystin measurements with the corresponding
          database safety threshold.
        </p>


        <select
          value={selectedUserGroup}
          onChange={(e) =>
            setSelectedUserGroup(
              e.target.value
            )
          }
          style={{
            padding: "10px",
            minWidth: "250px",
            borderRadius: "8px",
            border: "1px solid #ccc"
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


      {/* ------------------------------------------ */}
      {/* Search and filters                         */}
      {/* ------------------------------------------ */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "15px"
        }}
      >

        <input
          type="text"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
          placeholder="Search station, ID, county, state, or water type..."
          style={{
            padding: "10px",
            minWidth: "280px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />


        <select
          value={selectedWaterType}
          onChange={(e) =>
            setSelectedWaterType(
              e.target.value
            )
          }
          style={{
            padding: "10px",
            borderRadius: "8px"
          }}
        >

          {waterTypes.map(
            (type) => (

              <option
                key={type}
                value={type}
              >
                {type === "All"
                  ? "All Water Types"
                  : type}
              </option>

            )
          )}

        </select>


        <select
          value={selectedCounty}
          onChange={(e) =>
            setSelectedCounty(
              e.target.value
            )
          }
          style={{
            padding: "10px",
            borderRadius: "8px"
          }}
        >

          {counties.map(
            (county) => (

              <option
                key={county}
                value={county}
              >
                {county === "All"
                  ? "All Counties"
                  : `County ${county}`}
              </option>

            )
          )}

        </select>


        <button
          onClick={clearFilters}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Clear Filters
        </button>

      </div>


      {/* ------------------------------------------ */}
      {/* Station count                              */}
      {/* ------------------------------------------ */}

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "15px"
        }}
      >

        <p style={{ margin: 0 }}>

          <strong>
            {filteredStations.length}
          </strong>{" "}

          monitoring stations matched

        </p>


        <p style={{ margin: 0 }}>

          <strong>
            {mappedStationCount}
          </strong>{" "}

          stations shown on map

        </p>

      </div>


      {/* ------------------------------------------ */}
      {/* Map legend                                 */}
      {/* ------------------------------------------ */}

      <div
        style={{
          display: "flex",
          gap: "18px",
          flexWrap: "wrap",
          marginBottom: "12px",
          fontSize: "14px"
        }}
      >

        <span>
          🟢 Within Selected Threshold
        </span>

        <span>
          🔴 Above Selected Threshold
        </span>

        <span>
          ⚪ No Measurement Available
        </span>

        <span>
          ⚫ No Standard Available
        </span>

      </div>


      {/* ------------------------------------------ */}
      {/* Interactive Leaflet map                    */}
      {/* ------------------------------------------ */}

      <MapContainer
        // Fit the initial view to Ohio with a small margin.
        // This does not restrict panning or zooming. All station records,
        // markers, filters, popups, and safety calculations remain available.
        bounds={[
          [38.35, -84.85],
          [42.05, -80.45]
        ]}
        boundsOptions={{
          padding: [20, 20]
        }}
        zoomSnap={0.25}
        style={{
          height: "600px",
          width: "100%",
          borderRadius: "12px",
          marginBottom: "20px"
        }}
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        {filteredStations.map(
          (station) => {

            // --------------------------------------
            // Validate coordinates
            // --------------------------------------

            const latitude =
              Number(
                station.LATITUDE
              );

            const longitude =
              Number(
                station.LONGITUDE
              );


            if (
              !Number.isFinite(latitude) ||
              !Number.isFinite(longitude)
            ) {

              return null;

            }


            // --------------------------------------
            // Calculate station safety information
            // --------------------------------------

            const safety =
              getSafetyInformation(
                station
              );


            return (

              <Marker
                key={
                  station.STATION_ID
                }
                position={[
                  latitude,
                  longitude
                ]}
                icon={markerIcon}
              >

                <Popup>

                  <div
                    style={{
                      minWidth: "250px"
                    }}
                  >


                    {/* Station name */}

                    <h3
                      style={{
                        marginBottom: "8px"
                      }}
                    >
                      {station.STATION_NAME ||
                        "Unnamed Station"}
                    </h3>


                    {/* Station ID */}

                    <p>

                      <strong>
                        Station ID:
                      </strong>{" "}

                      {station.STATION_ID ||
                        "N/A"}

                    </p>


                    {/* Water type */}

                    <p>

                      <strong>
                        Water Type:
                      </strong>{" "}

                      {station.TYPE_NAME ||
                        "N/A"}

                    </p>


                    {/* County */}

                    <p>

                      <strong>
                        County:
                      </strong>{" "}

                      {station.COUNTY_CODE ||
                        "N/A"}

                    </p>


                    {/* State */}

                    {station.STATE && (

                      <p>

                        <strong>
                          State:
                        </strong>{" "}

                        {station.STATE}

                      </p>

                    )}


                    <hr />


                    {/* Safety result */}

                    <h4>

                      Safety for{" "}

                      {getUserGroupName()}

                    </h4>


                    <p>

                      <strong>
                        Status:
                      </strong>{" "}

                      <span
                        style={{
                          fontWeight: "bold",

                          color:
                            safety.status ===
                            "WITHIN THRESHOLD"
                              ? "green"
                              : safety.status ===
                                "ABOVE THRESHOLD"
                              ? "red"
                              : "#666"
                        }}
                      >
                        {safety.status}
                      </span>

                    </p>


                    {/* Latest measurement */}

                    <p>

                      <strong>
                        Latest Microcystin:
                      </strong>{" "}

                      {safety.measurement
                        ? `${safety.measurement.MICROCYSTIN_UGL} µg/L`
                        : "N/A"}

                    </p>


                    {/* Sample date */}

                    <p>

                      <strong>
                        Sample Date:
                      </strong>{" "}

                      {safety.measurement
                        ? new Date(
                            safety.measurement.SAMPLE_DATE
                          ).toLocaleDateString()
                        : "N/A"}

                    </p>


                    {/* Selected threshold */}

                    <p>

                      <strong>
                        Selected Threshold:
                      </strong>{" "}

                      {safety.threshold !== null &&
                      safety.threshold !== undefined
                        ? `${safety.threshold} µg/L`
                        : "N/A"}

                    </p>


                    {/* Advisory */}

                    <p
                      style={{
                        fontSize: "13px",
                        lineHeight: "1.5"
                      }}
                    >
                      {safety.advisory}
                    </p>


                    {/* Station details */}

                    <button
                      onClick={() =>
                        navigate(
                          "/station",
                          {
                            state: {
                              station
                            }
                          }
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "9px",
                        marginTop: "8px",
                        cursor: "pointer",
                        borderRadius: "7px"
                      }}
                    >
                      View Station Details
                    </button>

                  </div>

                </Popup>

              </Marker>

            );

          }
        )}

      </MapContainer>


      {/* ------------------------------------------ */}
      {/* Data handling information                  */}
      {/* ------------------------------------------ */}

      <div
        style={{
          padding: "15px",
          background: "#f8f8f8",
          borderRadius: "10px",
          marginBottom: "30px"
        }}
      >

        <strong>
          Data note:
        </strong>

        <p
          style={{
            marginBottom: 0
          }}
        >
          ToxicTide does not assume a station is safe
          when a microcystin measurement is unavailable.
          Stations without an available measurement are
          shown as <strong>No Data</strong>. Safety
          comparisons use the selected user group's
          threshold stored in the database.
        </p>

      </div>


    </div>

  );

}


export default WaterMap;