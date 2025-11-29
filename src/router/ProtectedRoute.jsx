// src/router/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = () => {
    const { user, token } = useAuth();   // ✅ use token (not accessToken)
    const location = useLocation();

    // Not logged in
    if (!token || !user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}   // so we can come back here after login
            />
        );
    }

    // Logged in → allow child route
    return <Outlet />;
};

export const AdminRoute = () => {
    const { user, token } = useAuth();   // ✅ use token
    const location = useLocation();

    if (!token || !user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    if (user.role !== "admin") {
        return <Navigate to="/access-denied" replace />;
    }

    return <Outlet />;
};
