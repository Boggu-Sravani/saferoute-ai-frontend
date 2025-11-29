import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const res = await login(email, password);
        if (!res.success) {
            setError(res.message || "Login failed. Please try again.");
            return;
        }

        // ✅ Successful login → go to dashboard (or page user tried to open)
        navigate(from, { replace: true });
    };

    return (
        <main className="sr-auth-page">
            <div className="sr-auth-panel">
                <div className="sr-auth-header">
                    <h1>Welcome back to SafeRoute</h1>
                    <p>
                        Log in to access AI-evaluated safe routes, SOS alerts and trusted
                        contacts.
                    </p>
                </div>

                <form className="sr-auth-form" onSubmit={handleSubmit}>
                    <div className="sr-auth-field">
                        <label htmlFor="email">Email address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="sr-auth-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p
                            style={{
                                fontSize: "0.8rem",
                                color: "#fca5a5",
                                marginTop: "0.3rem",
                            }}
                        >
                            {error}
                        </p>
                    )}

                    <div className="sr-auth-extra">
                        <label className="sr-checkbox">
                            <input type="checkbox" />
                            <span>Remember me on this device</span>
                        </label>
                        <button type="button" className="sr-auth-link-btn">
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="sr-auth-submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                </form>

                <p className="sr-auth-footer-text">
                    New to SafeRoute?{" "}
                    <Link to="/register" className="sr-auth-link">
                        Create an account
                    </Link>
                </p>
            </div>

            <div className="sr-auth-aside">
                <div className="sr-auth-aside-card">
                    <h2>Built for real safety</h2>
                    <p>
                        This system uses AI-assisted scoring plus admin risk zones to
                        highlight safer routes for women and vulnerable commuters.
                    </p>
                    <ul>
                        <li>✔ Safety-driven route scoring (XGBoost)</li>
                        <li>✔ SOS alerts to trusted contacts</li>
                        <li>✔ Admin heatmaps of unsafe zones</li>
                    </ul>
                </div>
            </div>
        </main>
    );
};

export default Login;
