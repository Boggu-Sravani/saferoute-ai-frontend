// src/pages/admin/AdminSettingsPage.jsx
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

const AdminSettingsPage = () => {
    const navigate = useNavigate();

    return (
        <main className="sr-admin">
            <header className="sr-admin-header">
                <div>
                    <h1>Admin settings</h1>
                    <p>High-level configuration for SOS and safety logic.</p>
                </div>
                <div className="sr-admin-header-right">
                    <button
                        type="button"
                        className="sr-admin-btn"
                        onClick={() => navigate("/admin")}
                    >
                        ← Back to dashboard
                    </button>
                </div>
            </header>

            <section className="sr-admin-layout">
                {/* SIDEBAR */}
                <aside className="sr-admin-sidebar">
                    <div className="sr-admin-sidebar-section">
                        <div className="sr-admin-sidebar-title">Overview</div>
                        <button
                            className="sr-admin-sidebar-link"
                            onClick={() => navigate("/admin")}
                        >
                            Dashboard
                        </button>
                        <button
                            className="sr-admin-sidebar-link"
                            onClick={() => navigate("/admin/sos")}
                        >
                            SOS alerts
                        </button>
                        <button
                            className="sr-admin-sidebar-link"
                            onClick={() => navigate("/admin/feedback")}
                        >
                            Feedback heatmap
                        </button>
                    </div>

                    <div className="sr-admin-sidebar-section">
                        <div className="sr-admin-sidebar-title">Configuration</div>
                        <button
                            className="sr-admin-sidebar-link"
                            onClick={() => navigate("/admin/risk-zones")}
                        >
                            Risk zones
                        </button>
                        <button className="sr-admin-sidebar-link sr-active">
                            Settings
                        </button>
                    </div>
                </aside>

                {/* MAIN */}
                <div className="sr-admin-main">
                    <div className="sr-admin-panel">
                        <div className="sr-admin-panel-header">
                            <h2>Project settings (demo)</h2>
                        </div>

                        <p style={{ fontSize: "0.9rem", color: "#e5e7eb" }}>
                            Right now these options are mostly for viva explanation, not fully
                            wired:
                        </p>
                        <ul
                            style={{
                                fontSize: "0.85rem",
                                color: "#9ca3af",
                                marginTop: "0.5rem",
                            }}
                        >
                            <li>• Toggle auto-refresh for SOS table (e.g., every 10 seconds).</li>
                            <li>
                                • Enable / disable email & SMS notifications to trusted contacts.
                            </li>
                            <li>
                                • Night mode where route scoring becomes stricter after 9 PM.
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default AdminSettingsPage;
