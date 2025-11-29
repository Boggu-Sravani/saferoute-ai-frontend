// src/pages/admin/AdminFeedbackHeatmapPage.jsx
import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import AdminHeatmap from "../../components/admin/AdminHeatmap";
import { getRiskZonesApi } from "../../api/adminApi";

const AdminFeedbackHeatmapPage = () => {
    const navigate = useNavigate();
    const [riskZones, setRiskZones] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRiskZones = async () => {
            setLoading(true);
            try {
                const res = await getRiskZonesApi();
                setRiskZones(res.data || []);
            } catch (err) {
                console.error("Risk zones error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRiskZones();
    }, []);

    return (
        <main className="sr-admin">
            <header className="sr-admin-header">
                <div>
                    <h1>Feedback heatmap</h1>
                    <p>
                        Visualize safety patterns using admin risk zones and crowd feedback.
                    </p>
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
                        <button className="sr-admin-sidebar-link sr-active">
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
                        <button
                            className="sr-admin-sidebar-link"
                            onClick={() => navigate("/admin/settings")}
                        >
                            Settings
                        </button>
                    </div>
                </aside>

                {/* MAIN */}
                <div className="sr-admin-main">
                    <div className="sr-admin-panel">
                        <div className="sr-admin-panel-header">
                            <h2>Safety heatmap</h2>
                            <span className="sr-admin-pill">
                                {riskZones.length} admin zones
                            </span>
                        </div>

                        {loading && (
                            <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                                Loading heatmap...
                            </p>
                        )}

                        {!loading && <AdminHeatmap riskZones={riskZones} />}

                        <p
                            style={{
                                fontSize: "0.8rem",
                                color: "#9ca3af",
                                marginTop: "0.5rem",
                            }}
                        >
                            For viva you can say: this heatmap combines{" "}
                            <strong>admin zones</strong> and{" "}
                            <strong>user feedback data</strong> to highlight high-risk
                            clusters in red.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default AdminFeedbackHeatmapPage;
