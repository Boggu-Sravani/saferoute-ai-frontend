import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        gender: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setError("");
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const res = await register({
            name: form.name,
            email: form.email,
            password: form.password,
            gender: form.gender,
        });

        if (!res.success) {
            setError(res.message || "Registration failed. Please try again.");
            return;
        }

        // ✅ After successful register → go straight to dashboard
        navigate("/dashboard", { replace: true });
    };

    return (
        <main className="sr-auth-page">
            <div className="sr-auth-panel">
                <div className="sr-auth-header">
                    <h1>Create your SafeRoute account</h1>
                    <p>
                        SafeRoute is designed primarily for women and vulnerable commuters,
                        but anyone who feels unsafe while travelling can use it.
                    </p>
                </div>

                <form className="sr-auth-form" onSubmit={handleSubmit}>
                    <div className="sr-auth-field">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Your name"
                            required
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="sr-auth-field">
                        <label htmlFor="email">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="sr-auth-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            required
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="sr-auth-field">
                        <label htmlFor="gender">
                            Gender (optional – not used for access control)
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                        >
                            <option value="">Prefer not to say</option>
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                            <option value="other">Other</option>
                        </select>
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

                    <button
                        type="submit"
                        className="sr-auth-submit"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="sr-auth-footer-text">
                    Already have an account?{" "}
                    <Link to="/login" className="sr-auth-link">
                        Log in
                    </Link>
                </p>
            </div>

            <div className="sr-auth-aside">
                <div className="sr-auth-aside-card">
                    <h2>Why create an account?</h2>
                    <p>
                        Your account lets SafeRoute store basic details so that features
                        like SOS alerts, trusted contacts and safety feedback can work
                        properly.
                    </p>
                    <ul>
                        <li>✔ Save home, college and work locations</li>
                        <li>✔ Configure trusted contacts for emergencies</li>
                        <li>✔ Contribute feedback to help others stay safe</li>
                    </ul>
                </div>
            </div>
        </main>
    );
};

export default Register;
