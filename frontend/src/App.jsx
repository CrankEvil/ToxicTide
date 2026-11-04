
// ============================================================
// TOXICTIDE — MAIN APPLICATION ROUTER
// ============================================================
//
// PERFORMANCE OPTIMIZATION:
// 1. Public pages load only when visited.
// 2. Admin pages load only when visited.
// 3. Admin Login does not download the Admin Dashboard.
// 4. Maps, charts, and data pages are split into separate chunks.
// 5. Existing routes and ProtectedRoute behavior are preserved.
//
// IMPORTANT:
// - No UI redesign.
// - No route URL changes.
// - No authentication logic changes.
// ============================================================

import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// ============================================================
// PUBLIC PAGES — LAZY LOADING
// ============================================================

const Home = lazy(() => import("./pages/Home"));

const WaterMap = lazy(() => import("./pages/WaterMap"));

const StationDetails = lazy(() => import("./pages/StationDetails"));

const SafetyCheck = lazy(() => import("./pages/SafetyCheck"));

const Dashboard = lazy(() => import("./pages/Dashboard"));

const DataCenter = lazy(() => import("./pages/DataCenter"));

const WaterTypes = lazy(() => import("./pages/WaterTypes"));

const Counties = lazy(() => import("./pages/Counties"));

const Stations = lazy(() => import("./pages/Stations"));

const Measurements = lazy(() => import("./pages/Measurements"));

const SafetyStandards = lazy(() => import("./pages/SafetyStandards"));

const CommunityReport = lazy(() => import("./pages/CommunityReport"));

// ============================================================
// ADMIN PAGES — LAZY LOADING
// ============================================================

const AdminLogin = lazy(() => import("./admin/AdminLogin"));

const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));

const AdminWaterTypes = lazy(() => import("./admin/AdminWaterTypes"));

const AdminCounties = lazy(() => import("./admin/AdminCounties"));

const AdminStations = lazy(() => import("./admin/AdminStations"));

const AdminMeasurements = lazy(() => import("./admin/AdminMeasurements"));

const AdminSafetyStandards = lazy(() => import("./admin/AdminSafetyStandards"));

const AdminCommunityReports = lazy(() => import("./admin/AdminCommunityReports"));

// ============================================================
// AUTHENTICATION
// ============================================================

import ProtectedRoute from "./components/ProtectedRoute";

// ============================================================
// MAIN APPLICATION
// ============================================================

function App() {
  return (
    <Suspense fallback={null}>
      <Routes>

        {/* ======================================
            PUBLIC ROUTES
            ====================================== */}

        <Route path="/" element={<Home />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/map" element={<WaterMap />} />

        <Route path="/station" element={<StationDetails />} />

        <Route path="/safety" element={<SafetyCheck />} />

        <Route path="/data" element={<DataCenter />} />

        <Route path="/data/water-types" element={<WaterTypes />} />

        <Route path="/data/counties" element={<Counties />} />

        <Route path="/data/stations" element={<Stations />} />

        <Route path="/data/measurements" element={<Measurements />} />

        <Route path="/data/safety-standards" element={<SafetyStandards />} />

        <Route path="/report" element={<CommunityReport />} />

        {/* ======================================
            ADMIN LOGIN
            Login remains publicly accessible.
            ====================================== */}

        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ======================================
            PROTECTED ADMIN ROUTES
            ====================================== */}

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
    </Suspense>
  );
}

// ============================================================
// EXPORT
// ============================================================

export default App;
