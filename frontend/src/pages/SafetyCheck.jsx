
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

// ============================================================
// ICONS
// ============================================================

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const IconShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconPaw = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7" cy="9" r="2" />
    <circle cx="12" cy="6" r="2" />
    <circle cx="17" cy="9" r="2" />
    <path d="M8 16c0-2.5 2-4 4-4s4 1.5 4 4-2 4-4 4-4-1.5-4-4z" />
  </svg>
);

const IconSwim = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1.5" />
    <path d="M5 12l3-2 3 2 3-2 3 2" />
    <path d="M2 18c1.5 1.5 3.5 1.5 5 0s3.5-1.5 5 0 3.5 1.5 5 0 3.5 1.5 5 0" />
  </svg>
);

const IconGlass = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l-1.5 16.5a2 2 0 0 1-2 1.5h-5a2 2 0 0 1-2-1.5L6 3z" />
    <path d="M6.5 9h11" />
  </svg>
);

const IconMapPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconDroplet = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69s5.66 5.6 8.5 10.14A8.5 8.5 0 0 1 12 21.5a8.5 8.5 0 0 1-8.5-8.67C6.34 8.29 12 2.69 12 2.69z" />
  </svg>
);

const IconGlobe = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconFlag = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

const IconCheckCircle = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="M22 4L12 14.01l-3-3" />
  </svg>
);

const IconAlertTriangle = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconInfo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const IconCalendar = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconBeaker = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3H15M10 3v6l-4 9a2 2 0 0 0 1.8 3h8.4a2 2 0 0 0 1.8-3l-4-9V3" />
  </svg>
);

const IconTarget = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const IconUsers = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconLightbulb = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.5.4.9 1 1 1.8h6c.1-.8.5-1.4 1-1.8A7 7 0 0 0 12 2z" />
  </svg>
);

const IconLoader = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

// ============================================================
// RESPONSIVE PAGE HEADER
// Back button is always above the title.
// ============================================================

function SafetyPageHeader({ title, description, onBack, backLabel, icon }) {
  return (
    <>
      <style>{`
        .toxictide-page-sticky-header {
          position: sticky;
          top: 72px;
          z-index: 900;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 14px;
          width: 100%;
          box-sizing: border-box;
          padding: 12px 0 16px;
          margin-bottom: 22px;
          background: #f6f8fa;
          border-bottom: 1px solid #e2e8f0;
        }

        .toxictide-page-back-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 40px;
          width: fit-content;
          max-width: 100%;
          box-sizing: border-box;
          padding: 9px 15px;
          border: 1px solid #dbe4ec;
          border-radius: 9px;
          background: #ffffff;
          color: #334155;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 650;
          line-height: 1.3;
          cursor: pointer;
          flex-shrink: 0;
          transition: background .18s ease, border-color .18s ease, color .18s ease;
        }

        .toxictide-page-back-button:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .toxictide-page-back-button:focus-visible {
          outline: 3px solid rgba(14, 165, 233, .25);
          outline-offset: 2px;
        }

        .toxictide-page-heading {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          width: 100%;
          min-width: 0;
        }

        .toxictide-page-heading-content {
          min-width: 0;
          max-width: 100%;
        }

        .toxictide-page-heading h1 {
          margin: 0 0 5px;
          color: #0f172a;
          font-size: clamp(1.25rem, 2.4vw, 1.75rem);
          line-height: 1.25;
          font-weight: 800;
          overflow-wrap: anywhere;
        }

        .toxictide-page-heading p {
          margin: 0;
          max-width: 650px;
          color: #5a6b7c;
          font-size: 14px;
          line-height: 1.55;
          overflow-wrap: anywhere;
        }

        @media (max-width: 768px) {
          .toxictide-page-sticky-header {
            top: 64px;
            gap: 12px;
            padding-top: 10px;
            padding-bottom: 14px;
            margin-bottom: 18px;
          }

          .toxictide-page-heading {
            gap: 10px;
          }

          .toxictide-page-heading h1 {
            font-size: clamp(1.2rem, 5vw, 1.55rem);
          }

          .toxictide-page-heading p {
            font-size: 13.5px;
          }
        }

        @media (max-width: 420px) {
          .toxictide-page-sticky-header {
            top: 60px;
            gap: 10px;
            padding-top: 8px;
            padding-bottom: 12px;
          }

          .toxictide-page-back-button {
            min-height: 38px;
            padding: 8px 12px;
            font-size: 12.5px;
          }

          .toxictide-page-heading {
            gap: 9px;
          }

          .toxictide-page-heading h1 {
            font-size: 1.2rem;
          }

          .toxictide-page-heading p {
            font-size: 13px;
            line-height: 1.5;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .toxictide-page-back-button {
            transition: none;
          }
        }
      `}</style>

      <div className="toxictide-page-sticky-header">
        <button
          type="button"
          className="back-button toxictide-page-back-button"
          onClick={onBack}
        >
          <IconArrowLeft />
          <span>{backLabel}</span>
        </button>

        <div className="toxictide-page-heading">
          {icon && (
            <div className="sc-header-icon" style={{ flexShrink: 0 }}>
              {icon}
            </div>
          )}

          <div className="toxictide-page-heading-content">
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
// MAIN SAFETY CHECK PAGE
// ============================================================

function SafetyCheck() {
  const location = useLocation();
  const navigate = useNavigate();

  const station = location.state?.station;

  // ----------------------------------------------------------
  // USER GROUP
  // ----------------------------------------------------------

  const [userGroup, setUserGroup] = useState("");

  // ----------------------------------------------------------
  // SAFETY RESULT
  // ----------------------------------------------------------

  const [safetyResult, setSafetyResult] = useState(null);

  // ----------------------------------------------------------
  // PAGE STATUS
  // ----------------------------------------------------------

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [measurementStatus, setMeasurementStatus] = useState(
    station?.STATION_ID ? "checking" : "missing-station"
  );

  const [measurementError, setMeasurementError] = useState("");

  // ==========================================================
  // VERIFY MEASUREMENT AVAILABILITY
  // ==========================================================

  useEffect(() => {
    if (!station?.STATION_ID) {
      setMeasurementStatus("missing-station");
      return;
    }

    let isCurrent = true;

    setMeasurementStatus("checking");
    setMeasurementError("");

    axios
      .get(
        `https://toxictide-backend.onrender.com/api/measurements?stationId=${encodeURIComponent(
          station.STATION_ID
        )}`
      )
      .then((response) => {
        if (!isCurrent) return;

        const records = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.measurements)
            ? response.data.measurements
            : [];

        const hasValidMeasurement = records.some((record) => {
          const value = record?.MICROCYSTIN_UGL;

          const hasNumericValue =
            value !== null &&
            value !== undefined &&
            String(value).trim() !== "" &&
            Number.isFinite(Number(value));

          const sampleDate = record?.SAMPLE_DATE;

          const hasValidDate =
            sampleDate !== null &&
            sampleDate !== undefined &&
            String(sampleDate).trim() !== "" &&
            !Number.isNaN(new Date(sampleDate).getTime());

          return hasNumericValue && hasValidDate;
        });

        setMeasurementStatus(
          hasValidMeasurement ? "available" : "unavailable"
        );
      })
      .catch((requestError) => {
        console.error(
          "Failed to verify station measurement availability:",
          requestError
        );

        if (!isCurrent) return;

        setMeasurementStatus("error");

        setMeasurementError(
          "ToxicTide could not verify the station's measurement records. Please try again later. The application will not assume that missing or unverified data is safe."
        );
      });

    return () => {
      isCurrent = false;
    };
  }, [station?.STATION_ID]);

  // ==========================================================
  // CHECK WATER SAFETY
  // ==========================================================

  const checkSafety = () => {
    if (!station?.STATION_ID) {
      setError(
        "No monitoring station was selected. Please choose a station from the Water Map."
      );
      return;
    }

    if (measurementStatus !== "available") {
      setError(
        "A valid official microcystin measurement is not available for this station. The safety check cannot be completed."
      );
      return;
    }

    if (!userGroup) {
      setError(
        "Please select a user group before checking water safety."
      );
      return;
    }

    setLoading(true);
    setError("");
    setSafetyResult(null);

    axios
      .get(
        `https://toxictide-backend.onrender.com/api/safety?stationId=${encodeURIComponent(
          station.STATION_ID
        )}&userGroup=${encodeURIComponent(userGroup)}`
      )
      .then((response) => {
        setSafetyResult(response.data);
      })
      .catch((requestError) => {
        console.error(
          "Failed to check water safety:",
          requestError
        );

        setError(
          "Unable to complete the safety check. Please try again."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // ==========================================================
  // USER GROUP INFORMATION
  // ==========================================================

  const GROUP_META = {
    Pet_Owners: {
      label: "Pet Owners",
      icon: <IconPaw />,
      color: "#d97706",
      light: "#fffbeb"
    },
    Swimmers_Families: {
      label: "Swimmers & Families",
      icon: <IconSwim />,
      color: "#0891b2",
      light: "#ecfeff"
    },
    Drinking_Water: {
      label: "Drinking Water",
      icon: <IconGlass />,
      color: "#2563eb",
      light: "#eff6ff"
    }
  };

  const isSafe = safetyResult?.STATUS === "WITHIN THRESHOLD";

  // ==========================================================
  // SHARED PAGE STYLES
  // ==========================================================

  const sharedStyles = `
    .sc-page {
      min-height: 100vh;
      box-sizing: border-box;
      background: #f6f8fa;
      padding: 28px 18px 80px;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #0f172a;
    }

    .sc-shell {
      width: 100%;
      max-width: 880px;
      margin: 0 auto;
    }

    .sc-card {
      box-sizing: border-box;
      width: 100%;
      background: #fff;
      border: 1px solid #e7ecf0;
      border-radius: 20px;
      padding: 26px;
      box-shadow: 0 1px 3px rgba(15,23,42,0.04), 0 12px 32px -22px rgba(15,23,42,0.12);
      margin-bottom: 20px;
      animation: scFadeUp .55s ease both;
    }

    .sc-header-icon {
      width: 54px;
      height: 54px;
      border-radius: 16px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg,#0ea5e9,#0369a1);
      color: #fff;
      box-shadow: 0 12px 26px -10px rgba(3,105,161,0.5);
    }

    .sc-eyebrow-sm {
      display: block;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .08em;
      color: #94a3b8;
      margin-bottom: 4px;
    }

    .sc-station-head {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 18px;
      padding-bottom: 18px;
      border-bottom: 1px solid #f0f2f5;
    }

    .sc-station-icon {
      width: 46px;
      height: 46px;
      border-radius: 13px;
      background: #ecfdf5;
      color: #059669;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .sc-station-head h2 {
      margin: 0;
      font-size: 19px;
      font-weight: 800;
      overflow-wrap: anywhere;
    }

    .sc-meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 22px;
    }

    .sc-meta-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: #f8fafc;
      border: 1px solid #eef2f7;
      padding: 7px 13px;
      border-radius: 999px;
      font-size: 12.8px;
      font-weight: 600;
      color: #475569;
      overflow-wrap: anywhere;
      max-width: 100%;
    }

    .sc-meta-pill strong {
      color: #0f172a;
      font-weight: 700;
      overflow-wrap: anywhere;
    }

    .sc-section-title {
      font-size: 16.5px;
      font-weight: 800;
      margin: 0 0 6px 0;
    }

    .sc-section-sub {
      font-size: 13.8px;
      color: #6b7683;
      margin: 0 0 18px 0;
    }

    .sc-group-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin-bottom: 22px;
    }

    .sc-group-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 10px;
      min-width: 0;
      border: 1.5px solid #e2e8f0;
      border-radius: 16px;
      background: #fbfcfd;
      padding: 20px 14px;
      cursor: pointer;
      transition: all .18s ease;
      font-family: inherit;
    }

    .sc-group-card:hover {
      transform: translateY(-3px);
      border-color: #bae6fd;
      background: #f0f9ff;
    }

    .sc-group-card.active {
      box-shadow: 0 0 0 3px var(--gc-color, rgba(14,165,233,0.18));
    }

    .sc-group-icon-wrap {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all .18s ease;
    }

    .sc-group-card strong {
      font-size: 14px;
      color: #0f172a;
      overflow-wrap: anywhere;
    }

    .sc-run-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: linear-gradient(135deg,#0ea5e9,#0369a1);
      color: #fff;
      border: none;
      padding: 15px;
      border-radius: 13px;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 14px 28px -12px rgba(3,105,161,0.55);
      transition: all .18s ease;
      font-family: inherit;
    }

    .sc-run-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 18px 32px -12px rgba(3,105,161,0.65);
    }

    .sc-run-btn:disabled {
      opacity: .75;
      cursor: not-allowed;
    }

    .sc-spin {
      display: inline-flex;
      animation: scSpin 1s linear infinite;
    }

    .sc-error-box {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
      padding: 14px 16px;
      border-radius: 12px;
      margin-top: 16px;
      font-size: 13.8px;
      line-height: 1.55;
      animation: scFadeUp .3s ease both;
    }

    .sc-result-missing {
      display: flex;
      gap: 14px;
      align-items: flex-start;
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 16px;
      padding: 22px;
    }

    .sc-result-missing-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: #fef3c7;
      color: #b45309;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .sc-result-missing h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 800;
      color: #92400e;
    }

    .sc-result-missing p {
      margin: 0 0 8px 0;
      color: #a16207;
      font-size: 13.8px;
      line-height: 1.6;
    }

    .sc-result-missing p:last-child {
      margin-bottom: 0;
    }

    .sc-status-hero {
      border-radius: 18px;
      padding: 26px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 18px;
      position: relative;
      overflow: hidden;
    }

    .sc-status-hero.safe {
      background: linear-gradient(135deg,#ecfdf3,#f0fdf4);
      border: 1px solid #bbf7d0;
    }

    .sc-status-hero.unsafe {
      background: linear-gradient(135deg,#fef2f2,#fff1f2);
      border: 1px solid #fecaca;
    }

    .sc-status-icon-wrap {
      width: 64px;
      height: 64px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .sc-status-icon-wrap.safe {
      background: #dcfce7;
      color: #16a34a;
    }

    .sc-status-icon-wrap.unsafe {
      background: #fee2e2;
      color: #dc2626;
    }

    .sc-status-hero h2 {
      margin: 0 0 4px 0;
      font-size: 23px;
      font-weight: 900;
      letter-spacing: -0.01em;
      overflow-wrap: anywhere;
    }

    .sc-status-hero.safe h2 {
      color: #15803d;
    }

    .sc-status-hero.unsafe h2 {
      color: #b91c1c;
    }

    .sc-status-hero p {
      margin: 0;
      font-size: 13.8px;
      color: #4a5a6b;
      line-height: 1.55;
      max-width: 460px;
    }

    .sc-detail-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 22px;
    }

    .sc-detail-item {
      min-width: 0;
      background: #f8fafc;
      border: 1px solid #eef2f7;
      border-radius: 14px;
      padding: 16px;
    }

    .sc-detail-item .sc-detail-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11.5px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: .05em;
      margin-bottom: 8px;
    }

    .sc-detail-item strong {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      overflow-wrap: anywhere;
    }

    .sc-advisory-box {
      background: #fff;
      border: 1.5px solid #e2e8f0;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .sc-advisory-box h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 10px 0;
      font-size: 15.5px;
      font-weight: 800;
    }

    .sc-advisory-box p {
      margin: 0;
      color: #4a5a6b;
      font-size: 14px;
      line-height: 1.65;
      overflow-wrap: anywhere;
    }

    .sc-advisory-box small {
      display: block;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #f1f4f7;
      color: #8a9aad;
      font-size: 12.5px;
    }

    .sc-info-block {
      background: #f5f8fc;
      border-radius: 14px;
      padding: 18px;
      margin-bottom: 20px;
    }

    .sc-info-block h3 {
      margin: 0 0 10px 0;
      font-size: 15px;
      font-weight: 800;
    }

    .sc-info-block p {
      margin: 0 0 10px 0;
      color: #4a5a6b;
      font-size: 13.8px;
      line-height: 1.65;
    }

    .sc-info-block p:last-child {
      margin-bottom: 0;
    }

    .sc-panel-white {
      background: #fff;
      border: 1px solid #e1e7ef;
      border-radius: 16px;
      padding: 24px;
    }

    .sc-panel-white h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 8px 0 10px 0;
      font-size: 16px;
      font-weight: 800;
    }

    .sc-panel-white p {
      margin: 0 0 12px 0;
      color: #4a5a6b;
      font-size: 14px;
      line-height: 1.7;
    }

    .sc-sub-box {
      margin-top: 16px;
      padding: 16px;
      border-radius: 12px;
      background: #f5f8fc;
    }

    .sc-sub-box h4 {
      margin: 0 0 6px 0;
      font-size: 13.8px;
      font-weight: 800;
      color: #334155;
    }

    .sc-sub-box p {
      margin: 0 0 8px 0;
      font-size: 13.5px;
    }

    .sc-sub-box p:last-child {
      margin-bottom: 0;
    }

    .sc-state-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 38px 30px;
      text-align: center;
      box-shadow: 0 1px 3px rgba(15,23,42,.05);
    }

    .sc-state-icon {
      width: 62px;
      height: 62px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 18px;
      background: #e0f2fe;
      color: #0369a1;
    }

    .sc-state-icon.warning {
      background: #fef3c7;
      color: #b45309;
    }

    .sc-state-icon.error {
      background: #fee2e2;
      color: #dc2626;
    }

    .sc-state-card h2 {
      margin: 0 0 10px;
      font-size: 20px;
      font-weight: 800;
    }

    .sc-state-card p {
      margin: 0 0 20px;
      color: #64748b;
      font-size: 14px;
      line-height: 1.65;
    }

    .sc-state-spin {
      animation: scSpin 1s linear infinite;
    }

    .sc-missing-card {
      background: #fff;
      border: 1px solid #fecaca;
      border-radius: 20px;
      padding: 40px 32px;
      text-align: center;
      box-shadow: 0 1px 3px rgba(15,23,42,0.05);
    }

    .sc-missing-icon {
      width: 64px;
      height: 64px;
      border-radius: 999px;
      background: #fee2e2;
      color: #dc2626;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 18px;
    }

    .sc-missing-card h3 {
      margin: 0 0 10px;
      font-size: 19px;
      font-weight: 800;
      color: #0f172a;
    }

    .sc-missing-card p {
      margin: 0 0 22px;
      color: #64748b;
      font-size: 14.5px;
      line-height: 1.6;
    }

    .sc-primary-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #0f172a;
      color: #fff;
      border: none;
      padding: 12px 22px;
      border-radius: 11px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all .18s ease;
      font-family: inherit;
    }

    .sc-primary-btn:hover {
      background: #1e293b;
      transform: translateY(-1px);
    }

    @keyframes scFadeUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes scSpin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 720px) {
      .sc-page {
        padding: 20px 14px 60px;
      }

      .sc-group-grid {
        grid-template-columns: 1fr;
      }

      .sc-detail-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .sc-status-hero {
        flex-direction: column;
        text-align: center;
      }

      .sc-card {
        padding: 20px;
      }
    }

    @media (max-width: 480px) {
      .sc-page {
        padding-left: 12px;
        padding-right: 12px;
      }

      .sc-card {
        padding: 17px;
        border-radius: 16px;
      }

      .sc-station-head h2 {
        font-size: 16px;
      }

      .sc-meta-row {
        gap: 8px;
      }

      .sc-meta-pill {
        font-size: 11.5px;
        padding: 6px 10px;
      }

      .sc-detail-grid {
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .sc-detail-item {
        padding: 12px;
      }

      .sc-detail-item strong {
        font-size: 14px;
      }

      .sc-detail-item .sc-detail-label {
        font-size: 10px;
        flex-wrap: wrap;
      }

      .sc-status-hero {
        padding: 20px 16px;
      }

      .sc-status-hero h2 {
        font-size: 20px;
      }

      .sc-panel-white {
        padding: 18px;
      }

      .sc-state-card,
      .sc-missing-card {
        padding: 26px 18px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .sc-card,
      .sc-group-card,
      .sc-state-spin,
      .sc-spin {
        animation: none;
        transition: none;
      }
    }
  `;

  // ==========================================================
  // HANDLE MISSING STATION
  // ==========================================================

  if (!station) {
    return (
      <div className="sc-page">
        <style>{sharedStyles}</style>

        <div className="sc-shell">
          <SafetyPageHeader
            title="Safety Check"
            description="Choose a monitoring station before checking water safety."
            backLabel="Back to Water Map"
            onBack={() => navigate("/map")}
          />

          <div className="sc-missing-card">
            <div className="sc-missing-icon">
              <IconAlertTriangle />
            </div>

            <h3>No Monitoring Station Selected</h3>

            <p>
              Please choose a monitoring station from the Water Map before
              checking water safety.
            </p>

            <button
              className="sc-primary-btn"
              onClick={() => navigate("/map")}
            >
              Choose a Monitoring Station
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // CHECKING MEASUREMENT STATE
  // ==========================================================

  if (measurementStatus === "checking") {
    return (
      <div className="sc-page">
        <style>{sharedStyles}</style>

        <div className="sc-shell">
          <SafetyPageHeader
            title="Checking Station Measurements"
            description="ToxicTide is verifying official microcystin data for the selected station."
            backLabel="Back to Station Details"
            onBack={() =>
              navigate("/station", {
                state: { station }
              })
            }
          />

          <div className="sc-state-card">
            <div className="sc-state-icon sc-state-spin">
              <IconLoader />
            </div>

            <h2>Checking Station Measurements...</h2>

            <p>
              ToxicTide is verifying whether this station has a valid official
              microcystin measurement before opening the safety check.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MEASUREMENT UNAVAILABLE STATE
  // ==========================================================

  if (measurementStatus === "unavailable") {
    return (
      <div className="sc-page">
        <style>{sharedStyles}</style>

        <div className="sc-shell">
          <SafetyPageHeader
            title="Measurement Not Available"
            description="The selected station does not have a valid official microcystin measurement."
            backLabel="Back to Station Details"
            onBack={() =>
              navigate("/station", {
                state: { station }
              })
            }
          />

          <div className="sc-state-card">
            <div className="sc-state-icon warning">
              <IconAlertTriangle />
            </div>

            <h2>NO MEASUREMENT AVAILABLE</h2>

            <p>
              No valid official microcystin measurement is available for this
              station. A safety check cannot be completed without a recorded
              measurement.
            </p>

            <button
              className="sc-primary-btn"
              onClick={() =>
                navigate("/station", {
                  state: { station }
                })
              }
            >
              Return to Station Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MEASUREMENT VERIFICATION ERROR STATE
  // ==========================================================

  if (measurementStatus === "error") {
    return (
      <div className="sc-page">
        <style>{sharedStyles}</style>

        <div className="sc-shell">
          <SafetyPageHeader
            title="Unable to Verify Measurements"
            description="ToxicTide could not confirm measurement availability for this station."
            backLabel="Back to Station Details"
            onBack={() =>
              navigate("/station", {
                state: { station }
              })
            }
          />

          <div className="sc-state-card">
            <div className="sc-state-icon error">
              <IconAlertTriangle />
            </div>

            <h2>Unable to Verify Measurements</h2>

            <p>{measurementError}</p>

            <button
              className="sc-primary-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MAIN SAFETY CHECK PAGE
  // ==========================================================

  return (
    <div className="sc-page">
      <style>{sharedStyles}</style>

      <div className="sc-shell">
        <SafetyPageHeader
          title="Safety Check"
          description="Select a user group to compare the latest available microcystin measurement with the corresponding safety standard."
          backLabel="Back to Station Details"
          onBack={() =>
            navigate("/station", {
              state: { station }
            })
          }
          icon={<IconShield />}
        />

        {/* ======================================
            SELECTED STATION + SELECTION
        ====================================== */}

        <div className="sc-card">
          <div className="sc-station-head">
            <div className="sc-station-icon">
              <IconMapPin />
            </div>

            <div>
              <span className="sc-eyebrow-sm">
                SELECTED STATION
              </span>

              <h2>
                {station.STATION_NAME || "Unnamed Station"}
              </h2>
            </div>
          </div>

          <div className="sc-meta-row">
            <span className="sc-meta-pill">
              Station ID: <strong>{station.STATION_ID}</strong>
            </span>

            <span className="sc-meta-pill">
              <IconDroplet />
              Water Type: <strong>{station.TYPE_NAME || "N/A"}</strong>
            </span>

            <span className="sc-meta-pill">
              <IconGlobe />
              County: <strong>{station.COUNTY_CODE || "N/A"}</strong>
            </span>

            {station.STATE && (
              <span className="sc-meta-pill">
                <IconFlag />
                State: <strong>{station.STATE}</strong>
              </span>
            )}
          </div>

          {/* ==================================
              USER GROUP SELECTION
          ================================== */}

          <h3 className="sc-section-title">
            Who are you checking for?
          </h3>

          <p className="sc-section-sub">
            Choose the group that matches the intended water use.
          </p>

          <div className="sc-group-grid">
            {Object.entries(GROUP_META).map(([key, meta]) => (
              <button
                key={key}
                type="button"
                className={
                  "sc-group-card" +
                  (userGroup === key ? " active" : "")
                }
                style={{
                  "--gc-color": meta.color + "33"
                }}
                onClick={() => {
                  setUserGroup(key);
                  setSafetyResult(null);
                  setError("");
                }}
              >
                <div
                  className="sc-group-icon-wrap"
                  style={{
                    background:
                      userGroup === key ? meta.color : meta.light,
                    color:
                      userGroup === key ? "#fff" : meta.color
                  }}
                >
                  {meta.icon}
                </div>

                <strong>{meta.label}</strong>
              </button>
            ))}
          </div>

          {/* ==================================
              RUN SAFETY CHECK
          ================================== */}

          <button
            className="sc-run-btn"
            onClick={checkSafety}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="sc-spin">
                  <IconLoader />
                </span>
                Checking Water Safety...
              </>
            ) : (
              <>
                <IconShield />
                Check Water Safety
              </>
            )}
          </button>

          {/* ==================================
              ERROR MESSAGE
          ================================== */}

          {error && (
            <div className="sc-error-box">
              <IconAlertTriangle />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* ======================================
            SAFETY RESULT
        ====================================== */}

        {safetyResult && (
          <div className="sc-card">
            <span
              className="sc-eyebrow-sm"
              style={{
                marginBottom: "14px",
                display: "block"
              }}
            >
              SAFETY RESULT
            </span>

            {/* ==================================
                MISSING DATA
            ================================== */}

            {safetyResult.message ? (
              <div className="sc-result-missing">
                <div className="sc-result-missing-icon">
                  <IconInfo />
                </div>

                <div>
                  <h3>Measurement Not Available</h3>

                  <p>{safetyResult.message}</p>

                  <p>
                    ToxicTide does not assume that the water is safe when
                    an official microcystin measurement is unavailable.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* ==================================
                    CURRENT STATUS
                ================================== */}

                <div
                  className={
                    "sc-status-hero " +
                    (isSafe ? "safe" : "unsafe")
                  }
                >
                  <div
                    className={
                      "sc-status-icon-wrap " +
                      (isSafe ? "safe" : "unsafe")
                    }
                  >
                    {isSafe ? (
                      <IconCheckCircle />
                    ) : (
                      <IconAlertTriangle />
                    )}
                  </div>

                  <div>
                    <h2>{safetyResult.STATUS}</h2>

                    <p>
                      The latest available microcystin measurement has
                      been compared with the selected user group's
                      database threshold.
                    </p>
                  </div>
                </div>

                {/* ==================================
                    SAFETY DETAILS
                ================================== */}

                <div className="sc-detail-grid">
                  <div className="sc-detail-item">
                    <div className="sc-detail-label">
                      <IconCalendar />
                      Latest Sample
                    </div>

                    <strong>
                      {safetyResult.SAMPLE_DATE
                        ? String(safetyResult.SAMPLE_DATE)
                            .split("T")[0]
                            .replace(/-/g, "/")
                        : "N/A"}
                    </strong>
                  </div>

                  <div className="sc-detail-item">
                    <div className="sc-detail-label">
                      <IconBeaker />
                      Microcystin
                    </div>

                    <strong>
                      {safetyResult.MICROCYSTIN_UGL !== null &&
                      safetyResult.MICROCYSTIN_UGL !== undefined
                        ? `${safetyResult.MICROCYSTIN_UGL} µg/L`
                        : "N/A"}
                    </strong>
                  </div>

                  <div className="sc-detail-item">
                    <div className="sc-detail-label">
                      <IconTarget />
                      Safety Threshold
                    </div>

                    <strong>
                      {safetyResult.THRESHOLD_UGL !== null &&
                      safetyResult.THRESHOLD_UGL !== undefined
                        ? `${safetyResult.THRESHOLD_UGL} µg/L`
                        : "N/A"}
                    </strong>
                  </div>

                  <div className="sc-detail-item">
                    <div className="sc-detail-label">
                      <IconUsers />
                      User Group
                    </div>

                    <strong>{safetyResult.USER_GROUP}</strong>
                  </div>
                </div>

                {/* ==================================
                    OFFICIAL ADVISORY
                ================================== */}

                <div className="sc-advisory-box">
                  <h3>
                    <IconInfo />
                    Safety Advisory
                  </h3>

                  <p>
                    {safetyResult.ADVISORY_MESSAGE ||
                      "No advisory message is available."}
                  </p>

                  {safetyResult.CITING_AGENCY && (
                    <small>
                      <strong>Citing Agency:</strong>{" "}
                      {safetyResult.CITING_AGENCY}
                    </small>
                  )}
                </div>

                {/* ==================================
                    HOW THE RESULT IS CALCULATED
                ================================== */}

                <div className="sc-info-block">
                  <h3>How this result is calculated</h3>

                  <p>
                    ToxicTide uses the latest available official
                    microcystin measurement for this monitoring station.
                  </p>

                  <p>
                    The measured concentration is compared with the
                    safety threshold stored for the selected user group.
                  </p>

                  <p>
                    If the measurement is at or below the selected
                    threshold, the result is shown as{" "}
                    <strong>WITHIN THRESHOLD</strong>. If the measurement
                    is above the threshold, the result is shown as{" "}
                    <strong>ABOVE THRESHOLD</strong>.
                  </p>

                  <p>
                    If an official measurement is unavailable, ToxicTide
                    does not assume that the water is safe.
                  </p>
                </div>

                {/* ==================================
                    WATER SAFETY INFORMATION
                    FR-12
                ================================== */}

                <div className="sc-panel-white">
                  <span className="sc-eyebrow-sm">
                    WATER SAFETY INFORMATION
                  </span>

                  <h3>
                    <IconLightbulb />
                    Understanding Microcystin Safety
                  </h3>

                  <p>
                    Microcystin is a toxin that can be produced by
                    cyanobacteria during harmful algal bloom events.
                    ToxicTide uses available monitoring measurements to
                    help users understand the recorded condition of a
                    monitoring station.
                  </p>

                  <p>
                    Safety standards can differ depending on the intended
                    water use. For this reason, ToxicTide allows users to
                    select a specific user group before checking the result.
                  </p>

                  <div className="sc-sub-box">
                    <h4>Selected User Group</h4>

                    <p>
                      <strong>{safetyResult.USER_GROUP}</strong>
                    </p>

                    <p>
                      The threshold displayed above comes directly from
                      the ToxicTide safety standards stored in the database.
                    </p>
                  </div>

                  <div
                    className="sc-sub-box"
                    style={{ marginTop: "12px" }}
                  >
                    <h4>Important Data Note</h4>

                    <p>
                      ToxicTide only uses available monitoring records.
                      A missing measurement does not mean that the water
                      is safe or unsafe. Users should refer to the
                      available official monitoring information and
                      advisory shown by the application.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// EXPORT THE SAFETY CHECK PAGE
// ============================================================

export default SafetyCheck;
