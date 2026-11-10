import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../App.css";


// --------------------------------------------------
// Custom station markers.
//
// BLUE = at least one valid official measurement.
// RED  = no valid official measurement.
//
// Marker colors indicate data availability only.
// They do NOT indicate whether water is safe.
// --------------------------------------------------

const createStationIcon = (color) =>
  new L.DivIcon({
    className: "toxictide-station-marker",
    html: `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="42"
        viewBox="0 0 32 42"
        role="img"
        aria-label="${color === "#2585df" ? "Measurement available" : "No valid measurement"}"
      >
        <path
          d="M16 1C7.7 1 1 7.7 1 16c0 11 15 25 15 25s15-14 15-25C31 7.7 24.3 1 16 1Z"
          fill="${color}"
          stroke="#ffffff"
          stroke-width="2"
        />
        <circle
          cx="16"
          cy="16"
          r="5.5"
          fill="#ffffff"
        />
      </svg>
    `,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -38]
  });

const measurementAvailableIcon =
  createStationIcon("#2585df");

const noMeasurementIcon =
  createStationIcon("#dc4545");

const MAP_STATE_STORAGE_KEY = "toxictide-water-map-state";

function readSavedMapState() {
  try {
    const savedState = sessionStorage.getItem(MAP_STATE_STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  } catch (error) {
    console.warn("Could not restore the previous map state:", error);
    return null;
  }
}

function saveMapState(mapState) {
  try {
    sessionStorage.setItem(
      MAP_STATE_STORAGE_KEY,
      JSON.stringify(mapState)
    );
  } catch (error) {
    console.warn("Could not save the current map state:", error);
  }
}


// --------------------------------------------------
// Track map movements so the current map view can
// be passed to Station Details and restored later.
// --------------------------------------------------

function MapViewTracker({ mapViewRef, mapStateRef }) {
  const map = useMapEvents({
    // Leaflet fires moveend after a completed pan or zoom.
    // Recording the view in a ref avoids rerendering MapContainer
    // while the user is interacting with the map.
    moveend: () => {
      const center = map.getCenter();

      mapViewRef.current = {
        center: [center.lat, center.lng],
        zoom: map.getZoom()
      };

      const latestState = mapStateRef.current || {};

      mapStateRef.current = {
        ...latestState,
        center: mapViewRef.current.center,
        zoom: mapViewRef.current.zoom
      };

      saveMapState(mapStateRef.current);
    }
  });

  useEffect(() => {
    // Capture the actual initial map view once the map is ready.
    const center = map.getCenter();

    mapViewRef.current = {
      center: [center.lat, center.lng],
      zoom: map.getZoom()
    };

    const latestState = mapStateRef.current || {};

    mapStateRef.current = {
      ...latestState,
      center: mapViewRef.current.center,
      zoom: mapViewRef.current.zoom
    };

    saveMapState(mapStateRef.current);
  }, [map, mapViewRef, mapStateRef]);

  return null;
}

// --------------------------------------------------
// Individual station marker.
//
// The marker ref lets the selected station popup
// reopen automatically when returning to the map.
// --------------------------------------------------

function StationMapMarker({
  station,
  latitude,
  longitude,
  icon,
  selected,
  onSelect,
  onViewDetails,
  safety,
  userGroupName
}) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (selected && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [selected]);

  return (
    <Marker
      ref={markerRef}
      position={[latitude, longitude]}
      icon={icon}
      eventHandlers={{
        click: () => onSelect(String(station.STATION_ID))
      }}
    >
      <Popup>
        {/*
          The popup content is supplied by the parent
          through the station-specific render below.
        */}
        <div className="toxictide-map-popup">
          <h3>{station.STATION_NAME || "Unnamed Station"}</h3>

          <p>
            <strong>Station ID:</strong>{" "}
            {station.STATION_ID || "N/A"}
          </p>

          <p>
            <strong>Water Type:</strong>{" "}
            {station.TYPE_NAME || "N/A"}
          </p>

          <p>
            <strong>County:</strong>{" "}
            {station.COUNTY_CODE || "N/A"}
          </p>

          {station.STATE && (
            <p>
              <strong>State:</strong> {station.STATE}
            </p>
          )}

          <hr />

          <h4>Safety for {userGroupName}</h4>

          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                fontWeight: "bold",
                color:
                  safety.status === "WITHIN THRESHOLD"
                    ? "green"
                    : safety.status === "ABOVE THRESHOLD"
                    ? "red"
                    : "#666"
              }}
            >
              {safety.status}
            </span>
          </p>

          <p>
            <strong>Latest Microcystin:</strong>{" "}
            {safety.measurement
              ? `${safety.measurement.MICROCYSTIN_UGL} µg/L`
              : "N/A"}
          </p>

          <p>
            <strong>Sample Date:</strong>{" "}
            {safety.measurement
              ? new Date(
                  safety.measurement.SAMPLE_DATE
                ).toLocaleDateString()
              : "N/A"}
          </p>

          <p>
            <strong>Selected Threshold:</strong>{" "}
            {safety.threshold !== null &&
            safety.threshold !== undefined
              ? `${safety.threshold} µg/L`
              : "N/A"}
          </p>

          <p style={{ fontSize: "13px", lineHeight: "1.5" }}>
            {safety.advisory}
          </p>

          <button
            type="button"
            onClick={() => onViewDetails(station)}
            className="toxictide-map-details-button"
          >
            View Station Details
          </button>
        </div>
      </Popup>
    </Marker>
  );
}



function WaterMap() {
  const navigate = useNavigate();
  const location = useLocation();

  // --------------------------------------------------
  // Restore map context passed back from Station Details.
  // --------------------------------------------------

  const restoredMapState =
    location.state?.mapState || readSavedMapState() || null;

  // Keep the live map view in a ref, not React state.
  // This prevents map gestures from triggering a React rerender,
  // which can make Leaflet appear to jump or change zoom unexpectedly.
  const mapViewRef = useRef({
    center: restoredMapState?.center ?? null,
    zoom: restoredMapState?.zoom ?? null
  });

  const [selectedStationId, setSelectedStationId] = useState(
    restoredMapState?.selectedStationId
      ? String(restoredMapState.selectedStationId)
      : null
  );


  // --------------------------------------------------
  // Main backend data
  // --------------------------------------------------

  const [stations, setStations] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [standards, setStandards] = useState([]);


  // --------------------------------------------------
  // Search and filters
  // --------------------------------------------------

  const [searchTerm, setSearchTerm] = useState(
    restoredMapState?.searchTerm || ""
  );

  const [selectedWaterType, setSelectedWaterType] = useState(
    restoredMapState?.selectedWaterType || "All"
  );

  const [selectedCounty, setSelectedCounty] = useState(
    restoredMapState?.selectedCounty || "All"
  );

  const [selectedUserGroup, setSelectedUserGroup] = useState(
    restoredMapState?.selectedUserGroup || "Swimmers_Families"
  );

  // The tracker reads this ref so map gestures can save the latest
  // filters and selected station without triggering React rerenders.
  const mapStateRef = useRef(restoredMapState || {});


  // --------------------------------------------------
  // Loading and error
  // --------------------------------------------------

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // --------------------------------------------------
  // Load official backend data.
  //
  // IMPORTANT:
  // Existing backend endpoints are unchanged.
  // --------------------------------------------------

  useEffect(() => {
    let isMounted = true;

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

        if (!isMounted) return;

        setStations(stationResponse.data || []);
        setMeasurements(measurementResponse.data || []);
        setStandards(standardResponse.data || []);
      } catch (err) {
        console.error("Error loading water map data:", err);

        if (isMounted) {
          setError(
            "Unable to load monitoring data. Please make sure the ToxicTide backend is running."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMapData();

    return () => {
      isMounted = false;
    };
  }, []);


  // --------------------------------------------------
  // Create a lookup of the latest valid official
  // measurement for each station.
  //
  // A numeric zero is valid.
  // NULL, undefined, empty and non-numeric values
  // are unavailable and are ignored.
  // --------------------------------------------------

  const latestMeasurementsByStation = useMemo(() => {
    const latestMap = new Map();

    measurements.forEach((measurement) => {
      const rawValue = measurement.MICROCYSTIN_UGL;

      if (
        rawValue === null ||
        rawValue === undefined ||
        rawValue === ""
      ) {
        return;
      }

      const numericValue = Number(rawValue);

      if (!Number.isFinite(numericValue)) {
        return;
      }

      if (
        measurement.STATION_ID === null ||
        measurement.STATION_ID === undefined
      ) {
        return;
      }

      const stationId = String(measurement.STATION_ID);
      const existing = latestMap.get(stationId);

      if (!existing) {
        latestMap.set(stationId, measurement);
        return;
      }

      const currentTime = new Date(
        measurement.SAMPLE_DATE
      ).getTime();

      const existingTime = new Date(
        existing.SAMPLE_DATE
      ).getTime();

      // Prefer a measurement with a valid, newer sample date.
      if (
        Number.isFinite(currentTime) &&
        (
          !Number.isFinite(existingTime) ||
          currentTime > existingTime
        )
      ) {
        latestMap.set(stationId, measurement);
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
    return standardsByUserGroup.get(selectedUserGroup);
  }, [standardsByUserGroup, selectedUserGroup]);


  // --------------------------------------------------
  // Get unique water types from actual station data.
  // --------------------------------------------------

  const waterTypes = useMemo(() => {
    const types = stations
      .map((station) => station.TYPE_NAME)
      .filter(Boolean);

    return ["All", ...new Set(types)];
  }, [stations]);


  // --------------------------------------------------
  // Get unique county codes from actual station data.
  // --------------------------------------------------

  const counties = useMemo(() => {
    const countyCodes = stations
      .map((station) => station.COUNTY_CODE)
      .filter(
        (value) =>
          value !== null &&
          value !== undefined &&
          value !== ""
      );

    return ["All", ...new Set(countyCodes)];
  }, [stations]);


  // --------------------------------------------------
  // Get readable user-group name.
  // --------------------------------------------------

  const getUserGroupName = () => {
    if (selectedUserGroup === "Pet_Owners") {
      return "Pet Owners";
    }

    if (selectedUserGroup === "Swimmers_Families") {
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

    const standard = selectedStandard;

    const thresholdValue =
      standard?.THRESHOLD_UGL ??
      standard?.THRESHOLD ??
      standard?.threshold ??
      null;

    if (!latestMeasurement) {
      return {
        measurement: null,
        threshold: thresholdValue,
        status: "NO DATA",
        advisory:
          "No microcystin measurement is available for this station. Safety cannot be determined from the available data."
      };
    }

    const value = Number(
      latestMeasurement.MICROCYSTIN_UGL
    );

    if (!Number.isFinite(value)) {
      return {
        measurement: null,
        threshold: thresholdValue,
        status: "NO DATA",
        advisory:
          "A valid microcystin measurement is not available for this station."
      };
    }

    if (
      thresholdValue === null ||
      thresholdValue === undefined ||
      thresholdValue === ""
    ) {
      return {
        measurement: latestMeasurement,
        threshold: null,
        status: "NO STANDARD",
        advisory:
          "A safety threshold is not available for the selected user group."
      };
    }

    const numericThreshold = Number(thresholdValue);

    if (!Number.isFinite(numericThreshold)) {
      return {
        measurement: latestMeasurement,
        threshold: null,
        status: "NO STANDARD",
        advisory:
          "A valid safety threshold is not available for the selected user group."
      };
    }

    if (value <= numericThreshold) {
      return {
        measurement: latestMeasurement,
        threshold: numericThreshold,
        status: "WITHIN THRESHOLD",
        advisory:
          standard?.ADVISORY_MESSAGE ||
          "The latest recorded measurement is within the selected database threshold."
      };
    }

    return {
      measurement: latestMeasurement,
      threshold: numericThreshold,
      status: "ABOVE THRESHOLD",
      advisory:
        standard?.ADVISORY_MESSAGE ||
        "The latest recorded measurement is above the selected database threshold."
    };
  };


  // --------------------------------------------------
  // Filter stations.
  // --------------------------------------------------

  const filteredStations = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return stations.filter((station) => {
      const stationName = String(
        station.STATION_NAME || ""
      ).toLowerCase();

      const stationId = String(
        station.STATION_ID || ""
      ).toLowerCase();

      const county = String(
        station.COUNTY_CODE || ""
      ).toLowerCase();

      const waterType = String(
        station.TYPE_NAME || ""
      ).toLowerCase();

      const state = String(
        station.STATE || ""
      ).toLowerCase();

      const matchesSearch =
        !search ||
        stationName.includes(search) ||
        stationId.includes(search) ||
        county.includes(search) ||
        waterType.includes(search) ||
        state.includes(search);

      const matchesWaterType =
        selectedWaterType === "All" ||
        station.TYPE_NAME === selectedWaterType;

      const matchesCounty =
        selectedCounty === "All" ||
        String(station.COUNTY_CODE) ===
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
    return filteredStations.filter((station) => {
      const latitude = Number(station.LATITUDE);
      const longitude = Number(station.LONGITUDE);

      return (
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180
      );
    }).length;
  }, [filteredStations]);


  // --------------------------------------------------
  // Save current map view.
  // --------------------------------------------------

  // The MapViewTracker writes directly to mapViewRef.
  // No state update is needed while the user pans or zooms.


  // --------------------------------------------------
  // Build the complete map state to pass to Station
  // Details. This includes map view, selected station,
  // search, filters and selected user group.
  // --------------------------------------------------

  const buildMapState = (stationId = selectedStationId) => ({
    center: mapViewRef.current.center,
    zoom: mapViewRef.current.zoom,
    selectedStationId: stationId,
    searchTerm,
    selectedWaterType,
    selectedCounty,
    selectedUserGroup
  });

  // Keep the latest non-map controls available to MapViewTracker.
  mapStateRef.current = buildMapState();

  // Persist selected station and filters when they change. This also
  // restores the previously open popup if the map route is remounted.
  useEffect(() => {
    const currentState = buildMapState();
    mapStateRef.current = currentState;
    saveMapState(currentState);
  }, [
    selectedStationId,
    searchTerm,
    selectedWaterType,
    selectedCounty,
    selectedUserGroup
  ]);


  // --------------------------------------------------
  // Open Station Details while preserving map state.
  // --------------------------------------------------

  const openStationDetails = (station) => {
    const stationId = String(station.STATION_ID);

    setSelectedStationId(stationId);

    const mapState = buildMapState(stationId);
    mapStateRef.current = mapState;
    saveMapState(mapState);

    navigate("/station", {
      state: {
        station,
        mapState
      }
    });
  };


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
        <h2>Water Monitoring Map</h2>
        <p>Loading official monitoring station data...</p>
      </div>
    );
  }


  // --------------------------------------------------
  // Error screen
  // --------------------------------------------------

  if (error) {
    return (
      <div className="page-container">
        <h2>Water Monitoring Map</h2>
        <p>{error}</p>
      </div>
    );
  }


  // --------------------------------------------------
  // Main page
  // --------------------------------------------------

  return (
    <div className="page-container">

      {/* ------------------------------------------ */}
      {/* STICKY PAGE HEADER                         */}
      {/* The Back button and page heading remain    */}
      {/* visible while the user scrolls.            */}
      {/* All public pages will use the same         */}
      {/* shared header and Back-button styling.     */}
      {/* ------------------------------------------ */}

      <div
        className="toxictide-page-sticky-header"
        style={{
          position: "sticky",
          top: "72px",
          zIndex: 900,
          background: "#ffffff",
          padding: "12px 0 14px",
          marginBottom: "20px"
        }}
      >

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="back-button toxictide-page-back-button"
        >
          ← Back to Dashboard
        </button>

        <div className="toxictide-page-heading">
          <h1>Water Monitoring Map</h1>

          <p>
            Explore official water monitoring stations
            and check the latest available microcystin
            information.
          </p>
        </div>

      </div>


      {/* Safety user group selector */}
      <div
        style={{
          padding: "18px",
          borderRadius: "12px",
          background: "#f5f8fc",
          marginBottom: "20px"
        }}
      >
        <h3 style={{ marginTop: 0 }}>
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
            setSelectedUserGroup(e.target.value)
          }
          style={{
            padding: "10px",
            minWidth: "250px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        >
          <option value="Pet_Owners">Pet Owners</option>
          <option value="Swimmers_Families">
            Swimmers & Families
          </option>
          <option value="Drinking_Water">
            Drinking Water
          </option>
        </select>
      </div>


      {/* Search and filters */}
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
          onChange={(e) => setSearchTerm(e.target.value)}
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
            setSelectedWaterType(e.target.value)
          }
          style={{
            padding: "10px",
            borderRadius: "8px"
          }}
        >
          {waterTypes.map((type) => (
            <option key={type} value={type}>
              {type === "All" ? "All Water Types" : type}
            </option>
          ))}
        </select>

        <select
          value={selectedCounty}
          onChange={(e) =>
            setSelectedCounty(e.target.value)
          }
          style={{
            padding: "10px",
            borderRadius: "8px"
          }}
        >
          {counties.map((county) => (
            <option key={county} value={county}>
              {county === "All"
                ? "All Counties"
                : `County ${county}`}
            </option>
          ))}
        </select>

        <button
          type="button"
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


      {/* Station count */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "15px"
        }}
      >
        <p style={{ margin: 0 }}>
          <strong>{filteredStations.length}</strong>{" "}
          monitoring stations matched
        </p>

        <p style={{ margin: 0 }}>
          <strong>{mappedStationCount}</strong>{" "}
          stations shown on map
        </p>
      </div>


      {/* Map legend */}
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
          <span style={{ color: "#2585df", fontWeight: "bold" }}>
            ●
          </span>{" "}
          Valid Official Measurement Available
        </span>

        <span>
          <span style={{ color: "#dc4545", fontWeight: "bold" }}>
            ●
          </span>{" "}
          No Valid Official Measurement
        </span>
      </div>


      {/* Interactive Leaflet map */}
      <MapContainer
        {...(
          mapViewRef.current.center &&
          mapViewRef.current.zoom !== null &&
          mapViewRef.current.zoom !== undefined
            ? {
                center: mapViewRef.current.center,
                zoom: mapViewRef.current.zoom
              }
            : {
                bounds: [
                  [38.35, -84.85],
                  [42.05, -80.45]
                ],
                boundsOptions: {
                  padding: [20, 20]
                }
              }
        )}
        minZoom={4}
        maxZoom={18}
        zoomSnap={1}
        zoomDelta={1}
        wheelPxPerZoomLevel={120}
        touchZoom="center"
        bounceAtZoomLimits={false}
        scrollWheelZoom={true}
        doubleClickZoom={true}
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

        <MapViewTracker
          mapViewRef={mapViewRef}
          mapStateRef={mapStateRef}
        />

        {filteredStations.map((station) => {
          const latitude = Number(station.LATITUDE);
          const longitude = Number(station.LONGITUDE);

          if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
          ) {
            return null;
          }

          const stationId = String(station.STATION_ID);

          const hasValidMeasurement =
            latestMeasurementsByStation.has(stationId);

          const safety = getSafetyInformation(station);

          return (
            <StationMapMarker
              key={station.STATION_ID}
              station={station}
              latitude={latitude}
              longitude={longitude}
              icon={
                hasValidMeasurement
                  ? measurementAvailableIcon
                  : noMeasurementIcon
              }
              selected={selectedStationId === stationId}
              onSelect={setSelectedStationId}
              onViewDetails={openStationDetails}
              safety={safety}
              userGroupName={getUserGroupName()}
            />
          );
        })}
      </MapContainer>


      {/* Data handling information */}
      <div
        style={{
          padding: "15px",
          background: "#f8f8f8",
          borderRadius: "10px",
          marginBottom: "30px"
        }}
      >
        <strong>Data note:</strong>

        <p style={{ marginBottom: 0 }}>
          Blue markers indicate stations with at least one
          valid official microcystin measurement. Red markers
          indicate stations without a valid official
          measurement. A recorded value of zero is valid.
          Missing or invalid data is never treated as safe.
          Marker colors show measurement availability, not
          the safety result. Safety comparisons use the
          selected user group's threshold stored in the
          database.
        </p>
      </div>

    </div>
  );
}

export default WaterMap;
