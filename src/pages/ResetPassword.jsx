import { useState } from "react";
import axiosClient from "../api/axiosClient";
import "./ResetPassword.css";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            // 1. Verify OTP
            await axiosClient.post("/auth/verify-otp", { email, otp });

            // 2. Reset password
            const res = await axiosClient.post("/auth/reset-password", {
                email,
                newPassword,
            });

            setMessage(res.data.message);
        } catch (err) {
            setError(err?.response?.data?.message || "Reset failed");
        }
    };

    return (
        <main className="sr-auth-page">
            <div className="sr-auth-panel">
                <h1>Reset Password</h1>

                <form className="sr-auth-form" onSubmit={handleReset}>
                    <div className="sr-auth-field">
                        <label>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="sr-auth-field">
                        <label>OTP</label>
                        <input
                            type="text"
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>

                    <div className="sr-auth-field">
                        <label>New Password</label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="sr-error">{error}</p>}
                    {message && <p className="sr-success">{message}</p>}

                    <button type="submit" className="sr-auth-submit">
                        Reset Password
                    </button>
                </form>
            </div>
        </main>
    );
};

export default ResetPassword;
