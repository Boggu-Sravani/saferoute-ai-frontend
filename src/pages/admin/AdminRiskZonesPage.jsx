// src/pages/admin/AdminRiskZonesPage.jsx
import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import { getRiskZonesApi, createRiskZoneApi } from "../../api/adminApi";
import AdminHeatmap from "../../components/admin/AdminHeatmap";

const AdminRiskZonesPage = () => {
    const navigate = useNavigate();

    const [riskZones, setRiskZones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        lat: "",
        lng: "",
        radiusMeters: 150,
        riskLevel: "medium",
        description: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const payload = {
            name: form.name,
            lat: Number(form.lat),
            lng: Number(form.lng),
            radiusMeters: Number(form.radiusMeters),
            riskLevel: form.riskLevel,
            description: form.description,
        };

        if (!payload.name || !payload.lat || !payload.lng) {
            setError("Name, latitude and longitude are required.");
            return;
        }

        try {
            const res = await createRiskZoneApi(payload);
            setRiskZones((prev) => [res.data, ...prev]);
            setSuccess("Risk zone created successfully.");
            setForm({
                name: "",
                lat: "",
                lng: "",
                radiusMeters: 150,
                riskLevel: "medium",
                description: "",
            });
        } catch (err) {
            console.error("Create risk zone error:", err);
            setError("Failed to create risk zone. Please try again.");
        }
    };

    return (
        <main className="sr-admin">
            <header className="sr-admin-header">
                <div>
                    <h1>Risk zones</h1>
                    <p>Configure and visualize high-risk areas on the map.</p>
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
                        <button className="sr-admin-sidebar-link sr-active">
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
                            <h2>Risk zones map</h2>
                            <span className="sr-admin-pill">{riskZones.length} zones</span>
                        </div>

                        {/* Map heatmap */}
                        <AdminHeatmap riskZones={riskZones} />

                        {/* Form */}
                        <form className="sr-admin-risk-form" onSubmit={handleSubmit}>
                            <div className="sr-admin-risk-form-grid">
                                <div className="sr-admin-field">
                                    <label>Zone name</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm((p) => ({ ...p, name: e.target.value }))
                                        }
                                        required
                                    />
                                </div>
                                <div className="sr-admin-field">
                                    <label>Latitude</label>
                                    <input
                                        type="number"
                                        step="0.000001"
                                        value={form.lat}
                                        onChange={(e) =>
                                            setForm((p) => ({ ...p, lat: e.target.value }))
                                        }
                                        required
                                    />
                                </div>
                                <div className="sr-admin-field">
                                    <label>Longitude</label>
                                    <input
                                        type="number"
                                        step="0.000001"
                                        value={form.lng}
                                        onChange={(e) =>
                                            setForm((p) => ({ ...p, lng: e.target.value }))
                                        }
                                        required
                                    />
                                </div>
                                <div className="sr-admin-field">
                                    <label>Radius (meters)</label>
                                    <input
                                        type="number"
                                        value={form.radiusMeters}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                radiusMeters: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="sr-admin-field">
                                    <label>Risk level</label>
                                    <select
                                        value={form.riskLevel}
                                        onChange={(e) =>
                                            setForm((p) => ({ ...p, riskLevel: e.target.value }))
                                        }
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="sr-admin-field">
                                <label>Description</label>
                                <textarea
                                    rows={2}
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            description: e.target.value,
                                        }))
                                    }
                                />
                            </div>

                            {error && (
                                <p
                                    style={{
                                        fontSize: "0.8rem",
                                        color: "#fca5a5",
                                        marginBottom: "0.3rem",
                                    }}
                                >
                                    {error}
                                </p>
                            )}
                            {success && (
                                <p
                                    style={{
                                        fontSize: "0.8rem",
                                        color: "#4ade80",
                                        marginBottom: "0.3rem",
                                    }}
                                >
                                    {success}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="sr-admin-btn sr-admin-btn-small"
                            >
                                Save risk zone
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default AdminRiskZonesPage;
