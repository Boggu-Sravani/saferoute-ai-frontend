// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { loginApi, registerApi, getCurrentUserApi, logoutApi } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("sr_user") || "null")
    );
    const [token, setToken] = useState(localStorage.getItem("sr_access") || "");
    const [refreshToken, setRefreshToken] = useState(
        localStorage.getItem("sr_refresh") || ""
    );
    const [loading, setLoading] = useState(false);

    // 🔄 Load current user if we have a token
    useEffect(() => {
        const loadUser = async () => {
            if (!token) return;
            try {
                const res = await getCurrentUserApi();
                setUser(res.data);
                localStorage.setItem("sr_user", JSON.stringify(res.data));
            } catch (err) {
                console.error("Failed to load user:", err);
                await logout();
            }
        };

        loadUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    // ✅ Handle auth success (used by login + register)
    const handleAuthSuccess = (data) => {
        const { accessToken, refreshToken, user } = data;

        setToken(accessToken);
        setRefreshToken(refreshToken);
        setUser(user);

        localStorage.setItem("sr_access", accessToken);
        localStorage.setItem("sr_refresh", refreshToken);
        localStorage.setItem("sr_user", JSON.stringify(user));
    };

    // 🔵 LOGIN
    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await loginApi({ email, password });
            handleAuthSuccess(res.data);
            return { success: true };
        } catch (err) {
            const msg =
                err?.response?.data?.message || "Login failed. Please try again.";
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    };

    // 🟢 REGISTER
    const register = async ({ name, email, password, gender }) => {
        setLoading(true);
        try {
            const res = await registerApi({ name, email, password, gender });
            handleAuthSuccess(res.data);
            return { success: true };
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Registration failed. Please try again.";
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    };

    // 🔴 LOGOUT
    const logout = async () => {
        try {
            await logoutApi(); // backend clears refreshToken
        } catch (err) {
            console.error("Logout API failed (clearing locally anyway):", err);
        } finally {
            setUser(null);
            setToken("");
            setRefreshToken("");

            localStorage.removeItem("sr_access");
            localStorage.removeItem("sr_refresh");
            localStorage.removeItem("sr_user");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,           // 👈 use this in ProtectedRoute
                refreshToken,
                loading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
