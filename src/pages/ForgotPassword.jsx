import { useState } from "react";
import axiosClient from "../api/axiosClient";
import "./ForgotPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const res = await axiosClient.post("/auth/forgot-password", { email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err?.response?.data?.message || "Error sending OTP");
        }
    };

    return (
        <main className="sr-auth-page">
            <div className="sr-auth-panel">
                <h1>Forgot Password</h1>
                <p>Enter your email to receive a reset OTP.</p>

                <form className="sr-auth-form" onSubmit={handleSubmit}>
                    <div className="sr-auth-field">
                        <label>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {error && <p className="sr-error">{error}</p>}
                    {message && <p className="sr-success">{message}</p>}

                    <button type="submit" className="sr-auth-submit">
                        Send OTP
                    </button>
                </form>
            </div>
        </main>
    );
};

export default ForgotPassword;
