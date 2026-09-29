// Import React hooks for state management and loading station data
import { useEffect, useState } from "react";

// Import navigation location so we can receive a selected station
// from the Station Details page
import { useLocation, useNavigate } from "react-router-dom";

// Import Axios for communication with the ToxicTide backend
import axios from "axios";

// Import application styling
import "../App.css";


// ============================================
// ICONS (inline SVG — no extra dependencies)
// ============================================

const IconArrowLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
);

const IconDroplet = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69s5.66 5.6 8.5 10.14A8.5 8.5 0 0 1 12 21.5a8.5 8.5 0 0 1-8.5-8.67C6.34 8.29 12 2.69 12 2.69z" />
    </svg>
);

const IconLeaf = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 4 13c0-7 9-11 15-11 0 6-4 15-11 15-1 0-2-.17-3-.5" />
        <path d="M4 20c3-3 5-6 8-10" />
    </svg>
);

const IconWaves = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 6c1.5 1.5 3.5 1.5 5 0s3.5-1.5 5 0 3.5 1.5 5 0 3.5-1.5 5 0" />
        <path d="M2 12c1.5 1.5 3.5 1.5 5 0s3.5-1.5 5 0 3.5 1.5 5 0 3.5-1.5 5 0" />
        <path d="M2 18c1.5 1.5 3.5 1.5 5 0s3.5-1.5 5 0 3.5 1.5 5 0 3.5-1.5 5 0" />
    </svg>
);

const IconFish = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.06 7 4-1 2-3.44 4-7 4-3.56 0-7.56-2.54-8.5-2z" />
        <path d="M18 10.5c1-1 2-1 3 0M2 12l3-2v4l-3-2z" />
        <circle cx="15" cy="11" r=".6" fill="currentColor" />
    </svg>
);

const IconWind = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 4.5A2.5 2.5 0 1 1 12 7H2" />
        <path d="M12.5 19.5A2.5 2.5 0 1 0 15 17H2" />
        <path d="M18 10.5A2.5 2.5 0 1 1 20.5 13H2" />
    </svg>
);

const IconPaw = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="9" r="2" /><circle cx="12" cy="6" r="2" /><circle cx="17" cy="9" r="2" />
        <path d="M8 16c0-2.5 2-4 4-4s4 1.5 4 4-2 4-4 4-4-1.5-4-4z" />
    </svg>
);

const IconDots = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
);

const IconPin = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const IconAlert = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const IconCheck = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
    </svg>
);

const IconX = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
);

const IconInfo = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);

const IconSend = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const IconClipboard = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 2h6a1 1 0 0 1 1 1v2H8V3a1 1 0 0 1 1-1z" />
        <rect x="4" y="5" width="16" height="17" rx="2" />
        <line x1="8" y1="11" x2="16" y2="11" /><line x1="8" y1="15" x2="16" y2="15" />
    </svg>
);


// ============================================
// STATIC OPTIONS (values identical to the original <select> options)
// ============================================

const REPORT_TYPES = [
    { value: "Algal Bloom", label: "Algal Bloom", desc: "Green scum, foam, or bloom on the surface", icon: <IconLeaf /> },
    { value: "Unusual Water Color", label: "Unusual Water Color", desc: "Discolored, murky, or cloudy water", icon: <IconWaves /> },
    { value: "Dead Fish", label: "Dead Fish", desc: "Fish kill or distressed aquatic life", icon: <IconFish /> },
    { value: "Water Odor", label: "Unusual Water Odor", desc: "Foul, chemical, or musty smell", icon: <IconWind /> },
    { value: "Animal Illness", label: "Animal Illness", desc: "Pets or wildlife showing symptoms", icon: <IconPaw /> },
    { value: "Other", label: "Other", desc: "Something else worth reporting", icon: <IconDots /> },
];

const SEVERITY_LEVELS = [
    { value: "Low", label: "Low", desc: "Minor, barely noticeable", color: "#16a34a", tint: "#ecfdf3" },
    { value: "Moderate", label: "Moderate", desc: "Noticeable, worth monitoring", color: "#d97706", tint: "#fffbeb" },
    { value: "High", label: "High", desc: "Severe or urgent concern", color: "#dc2626", tint: "#fef2f2" },
];


function CommunityReport() {

    // Get information passed from another page.
    // StationDetails sends the selected station here when
    // the user clicks "Report an Issue".
    const location = useLocation();

    // Allows navigation back to Station Details
    const navigate = useNavigate();

    // Store the station received from Station Details.
    const selectedStation = location.state?.station;


    // ============================================
    // STATIONS
    // ============================================

    // Stores the available monitoring stations
    // loaded from the real ToxicTide database.
    const [stations, setStations] = useState([]);

    // Tracks whether the station list is loading.
    const [stationsLoading, setStationsLoading] = useState(false);

    // Stores an error if the station request fails.
    const [stationsError, setStationsError] = useState("");


    // ============================================
    // FORM DATA
    // ============================================

    // Stores all values entered by the user.
    //
    // If the user came from Station Details,
    // the selected station is automatically assigned.
    const [formData, setFormData] = useState({
        stationId: selectedStation?.STATION_ID || "",
        reportDate: "",
        reportType: "",
        description: "",
        severity: ""
    });


    // ============================================
    // FORM MESSAGE
    // ============================================

    // Used to display success or error messages
    // after the user submits the report.
    const [message, setMessage] = useState("");

    // Keeps track of whether the current message
    // represents success or an error.
    const [messageType, setMessageType] = useState("");

    // Purely presentational — disables the submit button
    // and shows a spinner while the request is in flight.
    const [isSubmitting, setIsSubmitting] = useState(false);


    // ============================================
    // LOAD MONITORING STATIONS
    // ============================================

    useEffect(() => {

        // Show loading state while stations are being requested.
        setStationsLoading(true);

        setStationsError("");

        // Load real monitoring stations from the backend.
        axios
            .get("http://localhost:5000/api/stations")

            .then((response) => {

                // Store the returned station records.
                setStations(response.data || []);

            })

            .catch((error) => {

                console.error(
                    "Error loading stations:",
                    error
                );

                // Show a clear message instead of leaving
                // the station selector looking broken.
                setStationsError(
                    "Unable to load monitoring stations."
                );

            })

            .finally(() => {

                // Stop the loading indicator.
                setStationsLoading(false);

            });

    }, []);


    // ============================================
    // RECEIVE SELECTED STATION
    // ============================================

    useEffect(() => {

        // If Station Details sent a station,
        // automatically place its ID into the form.
        if (selectedStation?.STATION_ID) {

            setFormData((previousData) => ({
                ...previousData,
                stationId: selectedStation.STATION_ID
            }));

        }

    }, [selectedStation]);


    // ============================================
    // HANDLE FORM INPUT
    // ============================================

    const handleChange = (event) => {

        // Get the name and value of the changed field.
        const { name, value } = event.target;

        // Update only that field while keeping
        // all other form values unchanged.
        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

        // Clear the previous message when
        // the user starts editing the form again.
        setMessage("");
        setMessageType("");

    };


    // ============================================
    // SUBMIT COMMUNITY REPORT
    // ============================================

    const handleSubmit = async (event) => {

        // Prevent the browser from refreshing the page.
        event.preventDefault();

        // Clear previous messages.
        setMessage("");
        setMessageType("");


        // ============================================
        // FRONTEND VALIDATION
        // ============================================

        // These fields are required for a valid report.
        if (
            !formData.reportDate ||
            !formData.reportType ||
            !formData.description.trim() ||
            !formData.severity
        ) {

            setMessage(
                "Please complete all required fields."
            );

            setMessageType("error");

            return;
        }


        // ============================================
        // SEND REPORT TO BACKEND
        // ============================================

        try {

            setIsSubmitting(true);

            // Send the community observation to the
            // existing ToxicTide community-report API.
            await axios.post(
                "http://localhost:5000/api/community-reports",
                {
                    stationId: formData.stationId || null,
                    reportDate: formData.reportDate,
                    reportType: formData.reportType,
                    description: formData.description.trim(),
                    severity: formData.severity
                }
            );


            // Clear the form after successful submission.
            //
            // We keep the selected station if the user
            // arrived here from Station Details so they
            // can easily submit another observation for
            // the same station.
            setFormData({
                stationId: selectedStation?.STATION_ID || "",
                reportDate: "",
                reportType: "",
                description: "",
                severity: ""
            });


            // Show the successful submission message.
            setMessage(
                "Your report has been submitted successfully. Thank you for helping monitor recreational water safety."
            );

            setMessageType("success");

        }

        catch (error) {

            // Log the actual backend error for development.
            console.error(
                "Error submitting report:",
                error
            );

            // Show a user-friendly message.
            setMessage(
                "Unable to submit the report. Please try again."
            );

            setMessageType("error");

        }

        finally {

            setIsSubmitting(false);

        }

    };


    // ============================================
    // FIND SELECTED STATION NAME
    // ============================================

    // Find the complete station record using the
    // selected station ID.
    const selectedStationRecord = stations.find(
        (station) =>
            station.STATION_ID === formData.stationId
    );


    // ============================================
    // PAGE
    // ============================================

    return (

        <div className="cr-page">

            <style>{`
                .cr-page {
                    min-height: 100vh;
                    background:
                        radial-gradient(1200px 500px at 10% -10%, rgba(14,165,233,0.10), transparent 60%),
                        radial-gradient(1000px 500px at 100% 0%, rgba(34,197,94,0.08), transparent 55%),
                        #f6f8fa;
                    padding: 32px 20px 80px;
                    font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
                    color: #0f172a;
                }

                .cr-shell {
                    max-width: 960px;
                    margin: 0 auto;
                }

                .cr-back-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 9px 16px;
                    border: 1px solid #dfe6ec;
                    border-radius: 999px;
                    background: #ffffff;
                    color: #334155;
                    cursor: pointer;
                    font-size: 13.5px;
                    font-weight: 600;
                    margin-bottom: 22px;
                    transition: all 0.18s ease;
                    box-shadow: 0 1px 2px rgba(15,23,42,0.04);
                }
                .cr-back-btn:hover {
                    background: #0f172a;
                    color: #fff;
                    border-color: #0f172a;
                    transform: translateX(-2px);
                }

                .cr-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 18px;
                    margin-bottom: 28px;
                    animation: crFadeUp 0.5s ease both;
                }

                .cr-header-icon {
                    flex-shrink: 0;
                    width: 56px;
                    height: 56px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #0ea5e9, #0284c7);
                    color: #fff;
                    box-shadow: 0 10px 24px -8px rgba(2,132,199,0.55);
                }

                .cr-eyebrow {
                    display: inline-block;
                    font-size: 11.5px;
                    font-weight: 800;
                    letter-spacing: 0.09em;
                    color: #0284c7;
                    background: #e0f2fe;
                    padding: 4px 10px;
                    border-radius: 999px;
                    margin-bottom: 8px;
                }

                .cr-header h1 {
                    font-size: 28px;
                    font-weight: 800;
                    margin: 0 0 8px 0;
                    letter-spacing: -0.02em;
                    color: #0f172a;
                }

                .cr-header p {
                    margin: 0;
                    color: #55636f;
                    font-size: 15px;
                    line-height: 1.65;
                    max-width: 640px;
                }

                .cr-card {
                    background: #ffffff;
                    border: 1px solid #e7ecf0;
                    border-radius: 20px;
                    padding: 28px 28px 30px;
                    margin-bottom: 22px;
                    box-shadow: 0 1px 3px rgba(15,23,42,0.04), 0 12px 32px -20px rgba(15,23,42,0.12);
                    animation: crFadeUp 0.55s ease both;
                }

                .cr-card-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 18px;
                    font-weight: 800;
                    margin: 0 0 6px 0;
                    color: #0f172a;
                }

                .cr-card-sub {
                    color: #6b7683;
                    font-size: 14px;
                    margin: 0 0 22px 0;
                    line-height: 1.6;
                }

                .cr-notice {
                    display: flex;
                    gap: 12px;
                    align-items: flex-start;
                    background: #fff8e6;
                    border: 1px solid #fbe4a4;
                    border-radius: 14px;
                    padding: 14px 16px;
                    margin-bottom: 26px;
                }
                .cr-notice svg { color: #b7791f; flex-shrink: 0; margin-top: 2px; }
                .cr-notice strong { display: block; font-size: 13.5px; color: #92650f; margin-bottom: 2px; }
                .cr-notice p { margin: 0; font-size: 13.5px; color: #8a6c2c; line-height: 1.6; }

                .cr-section-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 12.5px;
                    font-weight: 800;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    margin: 28px 0 14px 0;
                }
                .cr-section-label:first-of-type { margin-top: 0; }
                .cr-section-label .cr-step-num {
                    width: 20px; height: 20px;
                    border-radius: 999px;
                    background: #0f172a;
                    color: #fff;
                    font-size: 11px;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 800;
                }

                .cr-grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 18px;
                }

                .cr-field label {
                    display: block;
                    font-size: 13.5px;
                    font-weight: 700;
                    color: #334155;
                    margin-bottom: 7px;
                }

                .cr-select, .cr-input, .cr-textarea {
                    width: 100%;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 12px 14px;
                    font-size: 14.5px;
                    color: #0f172a;
                    background: #fbfcfd;
                    transition: all 0.15s ease;
                    font-family: inherit;
                    box-sizing: border-box;
                }
                .cr-select:focus, .cr-input:focus, .cr-textarea:focus {
                    outline: none;
                    border-color: #0ea5e9;
                    background: #ffffff;
                    box-shadow: 0 0 0 4px rgba(14,165,233,0.12);
                }
                .cr-select { cursor: pointer; appearance: none;
                    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5'><path d='M6 9l6 6 6-6'/></svg>");
                    background-repeat: no-repeat;
                    background-position: right 14px center;
                    padding-right: 38px;
                }
                .cr-textarea { resize: vertical; line-height: 1.6; min-height: 130px; }

                .cr-hint { font-size: 12.5px; color: #94a3b8; margin-top: 6px; display: block; }
                .cr-hint.error { color: #dc2626; font-weight: 600; }

                .cr-station-preview {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
                    border: 1px solid #bae6fd;
                    border-radius: 14px;
                    padding: 14px 16px;
                    margin-top: 14px;
                    animation: crFadeUp 0.3s ease both;
                }
                .cr-station-preview .cr-pin {
                    width: 36px; height: 36px;
                    border-radius: 10px;
                    background: #0284c7;
                    color: #fff;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }
                .cr-station-preview strong { display: block; font-size: 14.5px; color: #0c4a6e; }
                .cr-station-preview span { font-size: 12.5px; color: #0369a1; }

                .cr-option-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                }

                .cr-option-card {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    align-items: flex-start;
                    text-align: left;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 14px;
                    background: #fbfcfd;
                    padding: 14px;
                    cursor: pointer;
                    transition: all 0.15s ease;
                    font-family: inherit;
                }
                .cr-option-card:hover {
                    border-color: #94d3f2;
                    background: #f0f9ff;
                    transform: translateY(-1px);
                }
                .cr-option-card.active {
                    border-color: #0ea5e9;
                    background: #e0f2fe;
                    box-shadow: 0 0 0 3px rgba(14,165,233,0.15);
                }
                .cr-option-icon {
                    width: 34px; height: 34px;
                    border-radius: 9px;
                    display: flex; align-items: center; justify-content: center;
                    background: #e2e8f0;
                    color: #475569;
                    transition: all 0.15s ease;
                }
                .cr-option-card.active .cr-option-icon {
                    background: #0ea5e9;
                    color: #fff;
                }
                .cr-option-card strong { font-size: 13.5px; color: #0f172a; }
                .cr-option-card small { font-size: 11.5px; color: #7c8894; line-height: 1.4; }

                .cr-severity-row {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                }
                .cr-severity-card {
                    border: 1.5px solid #e2e8f0;
                    border-radius: 14px;
                    padding: 14px;
                    cursor: pointer;
                    background: #fbfcfd;
                    text-align: left;
                    font-family: inherit;
                    transition: all 0.15s ease;
                }
                .cr-severity-card:hover { transform: translateY(-1px); }
                .cr-severity-dot {
                    width: 10px; height: 10px; border-radius: 999px;
                    display: inline-block; margin-right: 8px;
                }
                .cr-severity-card strong { font-size: 14px; }
                .cr-severity-card small { display: block; font-size: 11.5px; color: #7c8894; margin-top: 4px; }

                .cr-char-count {
                    display: flex;
                    justify-content: flex-end;
                    font-size: 11.5px;
                    color: #a2acb5;
                    margin-top: 6px;
                }

                .cr-submit-row {
                    margin-top: 28px;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    flex-wrap: wrap;
                }

                .cr-submit-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: linear-gradient(135deg, #0ea5e9, #0369a1);
                    color: #fff;
                    border: none;
                    padding: 14px 26px;
                    border-radius: 12px;
                    font-size: 15px;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 12px 24px -10px rgba(3,105,161,0.6);
                    transition: all 0.18s ease;
                }
                .cr-submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 16px 28px -10px rgba(3,105,161,0.7); }
                .cr-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

                .cr-spinner {
                    width: 16px; height: 16px;
                    border-radius: 999px;
                    border: 2.5px solid rgba(255,255,255,0.4);
                    border-top-color: #fff;
                    animation: crSpin 0.7s linear infinite;
                }

                .cr-message {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    margin-top: 22px;
                    padding: 14px 16px;
                    border-radius: 12px;
                    font-size: 14px;
                    line-height: 1.55;
                    animation: crFadeUp 0.3s ease both;
                }
                .cr-message.success { background: #ecfdf3; border: 1px solid #b6ebc7; color: #166534; }
                .cr-message.error { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
                .cr-message svg { flex-shrink: 0; margin-top: 1px; }

                .cr-info-list {
                    list-style: none;
                    margin: 0; padding: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .cr-info-list li {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    font-size: 14px;
                    color: #4a5563;
                    line-height: 1.6;
                }
                .cr-info-list li .cr-bullet-icon {
                    width: 22px; height: 22px;
                    border-radius: 7px;
                    background: #e0f2fe;
                    color: #0284c7;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                    margin-top: 1px;
                }

                .cr-body-text {
                    color: #4a5563;
                    font-size: 14.5px;
                    line-height: 1.75;
                    margin: 0 0 14px 0;
                }
                .cr-body-text:last-child { margin-bottom: 0; }

                @keyframes crFadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes crSpin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 720px) {
                    .cr-grid-2 { grid-template-columns: 1fr; }
                    .cr-option-grid { grid-template-columns: repeat(2, 1fr); }
                    .cr-severity-row { grid-template-columns: 1fr; }
                    .cr-header { flex-direction: column; }
                    .cr-card { padding: 22px 18px; }
                }
            `}</style>


            <div className="cr-shell">


                {/* ========================================
                    PAGE HEADER
                    ======================================== */}

                <button
                    type="button"
                    className="cr-back-btn"
                    onClick={() => navigate("/dashboard")}
                >
                    <IconArrowLeft />
                    Back to Dashboard
                </button>

                <div className="cr-header">

                    <div className="cr-header-icon">
                        <IconDroplet />
                    </div>

                    <div>
                        <span className="cr-eyebrow">
                            COMMUNITY OBSERVATION
                        </span>

                        <h1>
                            Community Water Report
                        </h1>

                        <p>
                            Report unusual water conditions, suspected algal
                            blooms, dead fish, unusual water color, or other
                            observations near a monitoring location.
                        </p>
                    </div>

                </div>


                {/* ========================================
                    REPORT FORM
                    ======================================== */}

                <div className="cr-card">

                    <h2 className="cr-card-title">
                        <IconClipboard />
                        Submit an Observation
                    </h2>

                    <p className="cr-card-sub">
                        Community reports are reviewed separately from
                        official monitoring data and do not replace
                        laboratory test results.
                    </p>


                    {/* ====================================
                        STATION INFORMATION
                        ==================================== */}

                    <div className="cr-notice">
                        <IconInfo />
                        <div>
                            <strong>Important</strong>
                            <p>
                                This form records a community observation.
                                It does not create or modify an official
                                microcystin measurement.
                            </p>
                        </div>
                    </div>


                    <form onSubmit={handleSubmit}>


                        {/* ==================================
                            LOCATION
                            ================================== */}

                        <div className="cr-section-label">
                            <span className="cr-step-num">1</span>
                            Location (optional)
                        </div>

                        <div className="cr-field">

                            <label htmlFor="stationId">
                                Monitoring Station
                            </label>

                            <select
                                id="stationId"
                                name="stationId"
                                className="cr-select"
                                value={formData.stationId}
                                onChange={handleChange}
                            >

                                <option value="">
                                    No specific station
                                </option>


                                {stations.map((station) => (

                                    <option
                                        key={station.STATION_ID}
                                        value={station.STATION_ID}
                                    >

                                        {station.STATION_NAME}
                                        {" ("}
                                        {station.STATION_ID}
                                        {")"}

                                    </option>

                                ))}

                            </select>


                            {/* Loading message for station list */}
                            {stationsLoading && (
                                <span className="cr-hint">
                                    Loading monitoring stations...
                                </span>
                            )}


                            {/* Error message for station list */}
                            {stationsError && (
                                <span className="cr-hint error">
                                    {stationsError}
                                </span>
                            )}


                            {/* ==============================
                                SELECTED STATION INFORMATION
                                ============================== */}

                            {selectedStationRecord && (
                                <div className="cr-station-preview">
                                    <div className="cr-pin">
                                        <IconPin />
                                    </div>
                                    <div>
                                        <strong>
                                            {selectedStationRecord.STATION_NAME}
                                        </strong>
                                        <span>
                                            ID: {selectedStationRecord.STATION_ID}
                                        </span>
                                    </div>
                                </div>
                            )}

                        </div>


                        {/* ==================================
                            DATE + REPORT TYPE
                            ================================== */}

                        <div className="cr-section-label">
                            <span className="cr-step-num">2</span>
                            What did you observe?
                        </div>

                        <div className="cr-grid-2">

                            <div className="cr-field">
                                <label htmlFor="reportDate">
                                    Observation Date *
                                </label>
                                <input
                                    id="reportDate"
                                    type="date"
                                    name="reportDate"
                                    className="cr-input"
                                    value={formData.reportDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        </div>


                        <div className="cr-field" style={{ marginTop: "18px" }}>

                            <label>
                                Report Type *
                            </label>

                            <div className="cr-option-grid">

                                {REPORT_TYPES.map((option) => (
                                    <button
                                        type="button"
                                        key={option.value}
                                        className={
                                            "cr-option-card" +
                                            (formData.reportType === option.value ? " active" : "")
                                        }
                                        onClick={() =>
                                            handleChange({
                                                target: {
                                                    name: "reportType",
                                                    value: option.value
                                                }
                                            })
                                        }
                                    >
                                        <div className="cr-option-icon">
                                            {option.icon}
                                        </div>
                                        <strong>{option.label}</strong>
                                        <small>{option.desc}</small>
                                    </button>
                                ))}

                            </div>

                        </div>


                        {/* ==================================
                            SEVERITY
                            ================================== */}

                        <div className="cr-section-label">
                            <span className="cr-step-num">3</span>
                            How severe is it?
                        </div>

                        <div className="cr-field">

                            <label>
                                Severity *
                            </label>

                            <div className="cr-severity-row">

                                {SEVERITY_LEVELS.map((level) => (
                                    <button
                                        type="button"
                                        key={level.value}
                                        className="cr-severity-card"
                                        style={{
                                            borderColor: formData.severity === level.value ? level.color : "#e2e8f0",
                                            background: formData.severity === level.value ? level.tint : "#fbfcfd",
                                            boxShadow: formData.severity === level.value
                                                ? `0 0 0 3px ${level.color}22`
                                                : "none"
                                        }}
                                        onClick={() =>
                                            handleChange({
                                                target: {
                                                    name: "severity",
                                                    value: level.value
                                                }
                                            })
                                        }
                                    >
                                        <strong style={{ color: level.color }}>
                                            <span
                                                className="cr-severity-dot"
                                                style={{ background: level.color }}
                                            />
                                            {level.label}
                                        </strong>
                                        <small>{level.desc}</small>
                                    </button>
                                ))}

                            </div>

                        </div>


                        {/* ==================================
                            DESCRIPTION
                            ================================== */}

                        <div className="cr-field" style={{ marginTop: "18px" }}>

                            <label htmlFor="description">
                                Description *
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                className="cr-textarea"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe what you observed — location details, appearance, timing, and anything else that might help..."
                                rows="6"
                                required
                            />

                            <div className="cr-char-count">
                                {formData.description.length} characters
                            </div>

                        </div>


                        {/* ==================================
                            SUBMIT BUTTON
                            ================================== */}

                        <div className="cr-submit-row">

                            <button
                                type="submit"
                                className="cr-submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="cr-spinner" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <IconSend />
                                        Submit Community Report
                                    </>
                                )}
                            </button>

                        </div>

                    </form>


                    {/* ====================================
                        SUBMISSION MESSAGE
                        ==================================== */}

                    {message && (
                        <div className={"cr-message " + messageType}>
                            {messageType === "success" ? <IconCheck /> : <IconX />}
                            <span>{message}</span>
                        </div>
                    )}

                </div>


                {/* ========================================
                    IMPORTANT INFORMATION
                    ======================================== */}

                <div className="cr-card">

                    <h2 className="cr-card-title">
                        <IconInfo />
                        Important Information
                    </h2>

                    <ul className="cr-info-list">

                        <li>
                            <span className="cr-bullet-icon"><IconCheck /></span>
                            Community reports are user observations.
                        </li>

                        <li>
                            <span className="cr-bullet-icon"><IconCheck /></span>
                            Reports are separate from official water-quality measurements.
                        </li>

                        <li>
                            <span className="cr-bullet-icon"><IconCheck /></span>
                            A report does not automatically change an official ToxicTide safety classification.
                        </li>

                        <li>
                            <span className="cr-bullet-icon"><IconCheck /></span>
                            Official monitoring results are based on recorded cyanotoxin measurements.
                        </li>

                        <li>
                            <span className="cr-bullet-icon"><IconCheck /></span>
                            Community reports can be reviewed separately by the data manager.
                        </li>

                    </ul>

                </div>


                {/* ========================================
                    REPORT WORKFLOW INFORMATION
                    ======================================== */}

                <div className="cr-card">

                    <h2 className="cr-card-title">
                        <IconWaves />
                        How Community Reports Are Used
                    </h2>

                    <p className="cr-body-text">
                        Community observations provide additional information
                        about conditions noticed at or near monitoring
                        locations. They are stored separately so that user
                        observations do not get confused with official
                        laboratory monitoring measurements.
                    </p>

                    <p className="cr-body-text">
                        Submitted reports can be reviewed by the ToxicTide
                        data manager through the administrator
                        community-report section.
                    </p>

                </div>

            </div>

        </div>

    );

}


// Export the Community Report page
export default CommunityReport;