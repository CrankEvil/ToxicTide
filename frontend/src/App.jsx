// Import the routing components used to control page navigation
import { Routes, Route } from "react-router-dom";


// ---------- PUBLIC PAGES (anyone can open these) ----------

// Import the ToxicTide Home page
import Home from "./pages/Home";

// Import the Water Map page
import WaterMap from "./pages/WaterMap";

// Import the station details page
import StationDetails from "./pages/StationDetails";

// Import the Water Safety Check page
import SafetyCheck from "./pages/SafetyCheck";

// Import the ToxicTide dashboard
import Dashboard from "./pages/Dashboard";

// Import the public data pages (read-only)
import DataCenter from "./pages/DataCenter";
import WaterTypes from "./pages/WaterTypes";
import Counties from "./pages/Counties";
import Stations from "./pages/Stations";
import Measurements from "./pages/Measurements";
import SafetyStandards from "./pages/SafetyStandards";


// ---------- ADMIN PAGES (login required) ----------

import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminWaterTypes from "./admin/AdminWaterTypes";
import AdminCounties from "./admin/AdminCounties";
import AdminStations from "./admin/AdminStations";
import AdminMeasurements from "./admin/AdminMeasurements";
import AdminSafetyStandards from "./admin/AdminSafetyStandards";

// Sends people who are not logged in to the admin login page
import ProtectedRoute from "./components/ProtectedRoute";

import CommunityReport from "./pages/CommunityReport";
import AdminCommunityReports from "./admin/AdminCommunityReports";


function App() {
  return (
    // Routes contains all pages of the ToxicTide application
    <Routes>

      {/* ======================================
          PUBLIC ROUTES - no login needed
          ====================================== */}

      {/* Homepage */}
      <Route path="/" element={<Home />} />

      {/* ToxicTide dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Water monitoring map page */}
      <Route path="/map" element={<WaterMap />} />

      {/* Selected monitoring station details */}
      <Route path="/station" element={<StationDetails />} />

      {/* Water safety check page */}
      <Route path="/safety" element={<SafetyCheck />} />

      {/* ToxicTide database Data Center */}
      <Route path="/data" element={<DataCenter />} />

      {/* Read-only data pages */}
      <Route path="/data/water-types" element={<WaterTypes />} />
      <Route path="/data/counties" element={<Counties />} />
      <Route path="/data/stations" element={<Stations />} />
      <Route path="/data/measurements" element={<Measurements />} />
      <Route path="/data/safety-standards" element={<SafetyStandards />} />
<Route
    path="/report"
    element={<CommunityReport />}
/>


      {/* ======================================
          ADMIN ROUTES
          The login page is open. Every other admin
          page is wrapped in ProtectedRoute.
          ====================================== */}

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/water-types"
        element={
          <ProtectedRoute>
            <AdminWaterTypes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/counties"
        element={
          <ProtectedRoute>
            <AdminCounties />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/stations"
        element={
          <ProtectedRoute>
            <AdminStations />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/measurements"
        element={
          <ProtectedRoute>
            <AdminMeasurements />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/safety-standards"
        element={
          <ProtectedRoute>
            <AdminSafetyStandards />
          </ProtectedRoute>
        }
      />
      <Route
  path="/admin/community-reports"
  element={
    <ProtectedRoute>
      <AdminCommunityReports />
    </ProtectedRoute>
  }
/>

    </Routes>
  );
}


// Export the main application component
export default App;
