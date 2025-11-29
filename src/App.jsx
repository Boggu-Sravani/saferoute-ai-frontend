import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./pages/LandingPage.jsx";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AccessDenied from "./pages/AccessDenied";
import { ProtectedRoute, AdminRoute } from "./router/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import TrustedContacts from "./pages/user/TrustedContacts.jsx";
import AdminActivityLog from "./pages/admin/AdminActivityLog";
import AdminSosPage from "./pages/admin/AdminSosPage";
import AdminRiskZonesPage from "./pages/admin/AdminRiskZonesPage";
import AdminFeedbackHeatmapPage from "./pages/admin/AdminFeedbackHeatmapPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
// or
// import ForgotPassword from "./pages/auth/ForgotPassword.jsx";

// or
// import ForgotPassword from "./pages/auth/ForgotPassword.jsx";

const App = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/access-denied" element={<AccessDenied />} />
                {/* we will add /login, /register, /dashboard etc later */}
                {/* Protected user pages */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/trusted-contacts" element={<TrustedContacts />} />
                </Route>

                {/* Admin-only pages */}
                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/activity-log" element={<AdminActivityLog />} />
                </Route>
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/admin/sos" element={<AdminSosPage />} />
                <Route path="/admin/risk-zones" element={<AdminRiskZonesPage />} />
<Route path="/admin/feedback" element={<AdminFeedbackHeatmapPage />} />
<Route path="/admin/settings" element={<AdminSettingsPage />} />
            </Routes>
        </>
    );
};

export default App;
