// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { useAuth } from "../../context/AuthContext";
import AdminHeatmap from "../../components/admin/AdminHeatmap";

import {
    getAdminDashboardStatsApi,
    getRiskZonesApi,
    createRiskZoneApi,
} from "../../api/adminApi";
import { getSosAlertsApi, updateSosStatusApi } from "../../api/sosApi";

const AdminDashboard = () => {
    const { user } = useAuth();

    const [stats, setStats] = useState({
        feedbackCount: 0,
        sosPending: 0,
        riskZonesCount: 0,
    });
    const [statsLoading, setStatsLoading] = useState(false);
    const [statsError, setStatsError] = useState("");

    const [sosAlerts, setSosAlerts] = useState([]);
    const [sosLoading, setSosLoading] = useState(false);
    const [sosError, setSosError] = useState("");

    const [riskZones, setRiskZones] = useState([]);
    const [riskZonesLoading, setRiskZonesLoading] = useState(false);

    const [showRiskForm, setShowRiskForm] = useState(false);
    const [riskForm, setRiskForm] = useState({
        name: "",
        lat: "",
        lng: "",
        radiusMeters: 150,
        riskLevel: "medium",
        description: "",
    });
    const [riskFormError, setRiskFormError] = useState("");
    const [riskFormSuccess, setRiskFormSuccess] = useState("");

    // 🔹 NEW: which sidebar item is active?
    // "dashboard" | "sos" | "risk-zones" | "feedback" | "settings"
    const [activeSection, setActiveSection] = useState("dashboard");

    const handleSosStatusChange = async (alertId, newStatus) => {
        try {
            const res = await updateSosStatusApi(alertId, newStatus);
            const updated = res.data;

            setSosAlerts((prev) =>
                prev.map((a) => (a._id === updated._id ? updated : a))
            );
        } catch (err) {
            console.error("Update SOS status error:", err);
            alert(
                err?.response?.data?.message ||
                "Failed to update SOS status. Please try again."
            );
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            setStatsLoading(true);
            setStatsError("");
            try {
                const res = await getAdminDashboardStatsApi();
                setStats(res.data || stats);
            } catch (err) {
                console.error("Admin stats error:", err);
                setStatsError(
                    err?.response?.data?.message || "Unable to load dashboard stats."
                );
            } finally {
                setStatsLoading(false);
            }
        };

        const fetchSos = async () => {
            setSosLoading(true);
            setSosError("");
            try {
                const res = await getSosAlertsApi();
                setSosAlerts(res.data || []);
            } catch (err) {
                console.error("SOS list error:", err);
                setSosError(
                    err?.response?.data?.message || "Unable to load SOS alerts."
                );
            } finally {
                setSosLoading(false);
            }
        };

        const fetchRiskZones = async () => {
            setRiskZonesLoading(true);
            try {
                const res = await getRiskZonesApi();
                setRiskZones(res.data || []);
            } catch (err) {
                console.error("Risk zones error:", err);
            } finally {
                setRiskZonesLoading(false);
            }
        };

        fetchStats();
        fetchSos();
        fetchRiskZones();
    }, []);

    // --- Small render helpers so we can reuse these panels ---

    const renderRiskZonesPanel = () => (
        <div className="sr-admin-panel">
            <div className="sr-admin-panel-header">
                <h2>Risk zones & heatmap</h2>
                <span className="sr-admin-pill">{riskZones.length} zones</span>
            </div>

            {/* Heatmap */}
            <AdminHeatmap riskZones={riskZones} />

            {/* Create risk zone form */}
            {showRiskForm && (
                <form
                    className="sr-admin-risk-form"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setRiskFormError("");
                        setRiskFormSuccess("");

                        const payload = {
                            name: riskForm.name,
                            lat: Number(riskForm.lat),
                            lng: Number(riskForm.lng),
                            radiusMeters: Number(riskForm.radiusMeters),
                            riskLevel: riskForm.riskLevel,
                            description: riskForm.description,
                        };

                        if (!payload.name || !payload.lat || !payload.lng) {
                            setRiskFormError(
                                "Name, latitude and longitude are required."
                            );
                            return;
                        }

                        try {
                            const res = await createRiskZoneApi(payload);
                            setRiskZones((prev) => [res.data, ...prev]);
                            setRiskFormSuccess("Risk zone created successfully.");
                            setRiskForm({
                                name: "",
                                lat: "",
                                lng: "",
                                radiusMeters: 150,
                                riskLevel: "medium",
                                description: "",
                            });
                        } catch (err) {
                            console.error("Create risk zone error:", err);
                            setRiskFormError(
                                err?.response?.data?.message ||
                                "Failed to create risk zone. Please try again."
                            );
                        }
                    }}
                >
                    <div className="sr-admin-risk-form-grid">
                        <div className="sr-admin-field">
                            <label>Zone name</label>
                            <input
                                type="text"
                                value={riskForm.name}
                                onChange={(e) =>
                                    setRiskForm((p) => ({ ...p, name: e.target.value }))
                                }
                                placeholder="Example: Dark stretch near bus stand"
                                required
                            />
                        </div>
                        <div className="sr-admin-field">
                            <label>Latitude</label>
                            <input
                                type="number"
                                step="0.000001"
                                value={riskForm.lat}
                                onChange={(e) =>
                                    setRiskForm((p) => ({ ...p, lat: e.target.value }))
                                }
                                placeholder="17.3850"
                                required
                            />
                        </div>
                        <div className="sr-admin-field">
                            <label>Longitude</label>
                            <input
                                type="number"
                                step="0.000001"
                                value={riskForm.lng}
                                onChange={(e) =>
                                    setRiskForm((p) => ({ ...p, lng: e.target.value }))
                                }
                                placeholder="78.4867"
                                required
                            />
                        </div>
                        <div className="sr-admin-field">
                            <label>Radius (meters)</label>
                            <input
                                type="number"
                                value={riskForm.radiusMeters}
                                onChange={(e) =>
                                    setRiskForm((p) => ({
                                        ...p,
                                        radiusMeters: e.target.value,
                                    }))
                                }
                                min={50}
                            />
                        </div>
                        <div className="sr-admin-field">
                            <label>Risk level</label>
                            <select
                                value={riskForm.riskLevel}
                                onChange={(e) =>
                                    setRiskForm((p) => ({
                                        ...p,
                                        riskLevel: e.target.value,
                                    }))
                                }
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="sr-admin-field">
                        <label>Description (optional)</label>
                        <textarea
                            rows={2}
                            value={riskForm.description}
                            onChange={(e) =>
                                setRiskForm((p) => ({
                                    ...p,
                                    description: e.target.value,
                                }))
                            }
                            placeholder="Short note about why this zone is marked as risky."
                        />
                    </div>

                    {riskFormError && (
                        <p
                            style={{
                                fontSize: "0.8rem",
                                color: "#fca5a5",
                                marginBottom: "0.3rem",
                            }}
                        >
                            {riskFormError}
                        </p>
                    )}
                    {riskFormSuccess && (
                        <p
                            style={{
                                fontSize: "0.8rem",
                                color: "#4ade80",
                                marginBottom: "0.3rem",
                            }}
                        >
                            {riskFormSuccess}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="sr-admin-btn sr-admin-btn-small"
                    >
                        Save risk zone
                    </button>
                </form>
            )}

            {/* List risk zones */}
            {riskZonesLoading && (
                <p
                    style={{
                        fontSize: "0.8rem",
                        color: "#9ca3af",
                        marginTop: "0.5rem",
                    }}
                >
                    Loading risk zones...
                </p>
            )}

            {!riskZonesLoading &&
                riskZones.length === 0 &&
                !showRiskForm && (
                    <p
                        style={{
                            fontSize: "0.8rem",
                            color: "#9ca3af",
                            marginTop: "0.5rem",
                        }}
                    >
                        No risk zones configured yet. Use “Mark risk zone” to add
                        areas that need attention.
                    </p>
                )}

            {!riskZonesLoading && riskZones.length > 0 && (
                <ul className="sr-admin-risk-list">
                    {riskZones.map((zone) => (
                        <li key={zone._id}>
                            <div className="sr-admin-risk-name">{zone.name}</div>
                            <div className="sr-admin-risk-meta">
                                {zone.riskLevel.toUpperCase()} · radius{" "}
                                {zone.radiusMeters} m
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    const renderSosPanel = () => (
        <div className="sr-admin-panel">
            <div className="sr-admin-panel-header">
                <h2>Live SOS alerts</h2>
                <span className="sr-admin-pill">
                    {sosAlerts.length} recent alerts
                </span>
            </div>

            {sosLoading && (
                <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                    Loading SOS alerts...
                </p>
            )}

            {sosError && (
                <p style={{ fontSize: "0.8rem", color: "#fca5a5" }}>{sosError}</p>
            )}

            {!sosLoading && !sosError && sosAlerts.length === 0 && (
                <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                    No SOS alerts recorded yet.
                </p>
            )}

            {!sosLoading && !sosError && sosAlerts.length > 0 && (
                <table className="sr-admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sosAlerts.map((alert) => (
                            <tr key={alert._id}>
                                <td>{alert.user?.name || "Unknown user"}</td>
                                <td>{alert.locationName}</td>
                                <td style={{ textTransform: "capitalize" }}>
                                    {alert.status}
                                </td>
                                <td>
                                    {alert.createdAt
                                        ? new Date(alert.createdAt).toLocaleString()
                                        : "-"}
                                </td>
                                <td>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "0.4rem",
                                        }}
                                    >
                                        {alert.status !== "acknowledged" &&
                                            alert.status !== "closed" && (
                                                <button
                                                    type="button"
                                                    className="sr-small-btn"
                                                    onClick={() =>
                                                        handleSosStatusChange(
                                                            alert._id,
                                                            "acknowledged"
                                                        )
                                                    }
                                                >
                                                    Acknowledge
                                                </button>
                                            )}
                                        {alert.status !== "closed" && (
                                            <button
                                                type="button"
                                                className="sr-small-btn sr-small-btn-danger"
                                                onClick={() =>
                                                    handleSosStatusChange(
                                                        alert._id,
                                                        "closed"
                                                    )
                                                }
                                            >
                                                Close
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );

    return (
        <main className="sr-admin">
            {/* HEADER */}
            <header className="sr-admin-header">
                <div>
                    <h1>Admin safety console</h1>
                    <p>
                        Monitor unsafe zones, review SOS alerts and update risk
                        areas for your city or campus.
                    </p>
                    {user && (
                        <p
                            style={{
                                fontSize: "0.78rem",
                                color: "#9ca3af",
                                marginTop: "0.2rem",
                            }}
                        >
                            Signed in as <strong>{user.name}</strong> ({user.email})
                        </p>
                    )}
                </div>
                <div className="sr-admin-header-right">
                    <select className="sr-admin-select">
                        <option>Today</option>
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                    </select>
                    <button
                        type="button"
                        className="sr-admin-btn"
                        onClick={() => setShowRiskForm((prev) => !prev)}
                    >
                        {showRiskForm ? "Close risk zone form" : "+ Mark risk zone"}
                    </button>
                </div>
            </header>

            <section className="sr-admin-layout">
                {/* SIDEBAR */}
                <aside className="sr-admin-sidebar">
                    <div className="sr-admin-sidebar-section">
                        <div className="sr-admin-sidebar-title">Overview</div>

                        <button
                            className={`sr-admin-sidebar-link ${activeSection === "dashboard" ? "sr-active" : ""
                                }`}
                            onClick={() => setActiveSection("dashboard")}
                        >
                            Dashboard
                        </button>

                        <button
                            className={`sr-admin-sidebar-link ${activeSection === "sos" ? "sr-active" : ""
                                }`}
                            onClick={() => setActiveSection("sos")}
                        >
                            SOS alerts
                        </button>

                        <button
                            className={`sr-admin-sidebar-link ${activeSection === "feedback" ? "sr-active" : ""
                                }`}
                            onClick={() => setActiveSection("feedback")}
                        >
                            Feedback heatmap
                        </button>
                    </div>

                    <div className="sr-admin-sidebar-section">
                        <div className="sr-admin-sidebar-title">Configuration</div>

                        <button
                            className={`sr-admin-sidebar-link ${activeSection === "risk-zones" ? "sr-active" : ""
                                }`}
                            onClick={() => setActiveSection("risk-zones")}
                        >
                            Risk zones
                        </button>

                        <button
                            className={`sr-admin-sidebar-link ${activeSection === "settings" ? "sr-active" : ""
                                }`}
                            onClick={() => setActiveSection("settings")}
                        >
                            Settings
                        </button>
                    </div>
                </aside>

                {/* MAIN */}
                <div className="sr-admin-main">
                    {/* TOP CARDS ALWAYS VISIBLE */}
                    <div className="sr-admin-cards-row">
                        <div className="sr-admin-card">
                            <div className="sr-admin-card-label">
                                Active high-risk zones
                            </div>
                            <div className="sr-admin-card-value">
                                {stats.riskZonesCount}
                            </div>
                            <div className="sr-admin-card-meta">
                                Across your mapped area
                            </div>
                        </div>
                        <div className="sr-admin-card">
                            <div className="sr-admin-card-label">
                                SOS alerts (pending)
                            </div>
                            <div className="sr-admin-card-value sr-danger">
                                {stats.sosPending}
                            </div>
                            <div className="sr-admin-card-meta">
                                Awaiting acknowledgement
                            </div>
                        </div>
                        <div className="sr-admin-card">
                            <div className="sr-admin-card-label">
                                Total feedback entries
                            </div>
                            <div className="sr-admin-card-value">
                                {stats.feedbackCount}
                            </div>
                            <div className="sr-admin-card-meta">
                                Submitted by users across the map
                            </div>
                        </div>
                    </div>

                    {statsLoading && (
                        <p
                            style={{
                                fontSize: "0.8rem",
                                color: "#9ca3af",
                                marginTop: "0.6rem",
                            }}
                        >
                            Loading dashboard stats...
                        </p>
                    )}
                    {statsError && (
                        <p
                            style={{
                                fontSize: "0.8rem",
                                color: "#fca5a5",
                                marginTop: "0.6rem",
                            }}
                        >
                            {statsError}
                        </p>
                    )}

                    {/* SECTION-SPECIFIC CONTENT */}
                    {activeSection === "dashboard" && (
                        <div className="sr-admin-panels-grid">
                            {renderRiskZonesPanel()}
                            {renderSosPanel()}
                        </div>
                    )}

                    {activeSection === "sos" && (
                        <div className="sr-admin-panels-grid">
                            {renderSosPanel()}
                        </div>
                    )}

                    {activeSection === "risk-zones" && (
                        <div className="sr-admin-panels-grid">
                            {renderRiskZonesPanel()}
                        </div>
                    )}

                    {activeSection === "feedback" && (
                        <div className="sr-admin-panels-grid">
                            <div className="sr-admin-panel">
                                <div className="sr-admin-panel-header">
                                    <h2>Feedback heatmap</h2>
                                    <span className="sr-admin-pill">
                                        Uses the same risk zones + user feedback
                                    </span>
                                </div>
                                <p
                                    style={{
                                        fontSize: "0.85rem",
                                        color: "#9ca3af",
                                        marginBottom: "0.6rem",
                                    }}
                                >
                                    This view focuses on the visual heatmap representation
                                    used in the user dashboard. You can explain in viva
                                    that admin can monitor how feedback and risk zones
                                    correlate on the map.
                                </p>
                                <AdminHeatmap riskZones={riskZones} />
                            </div>
                        </div>
                    )}

                    {activeSection === "settings" && (
                        <div className="sr-admin-panels-grid">
                            <div className="sr-admin-panel">
                                <div className="sr-admin-panel-header">
                                    <h2>System settings</h2>
                                </div>
                                <p
                                    style={{
                                        fontSize: "0.85rem",
                                        color: "#9ca3af",
                                        marginBottom: "0.6rem",
                                    }}
                                >
                                    In a production system, this page would allow admins to
                                    configure:
                                </p>
                                <ul className="sr-admin-settings-list">
                                    <li>• Email server / SMTP for SOS notifications</li>
                                    <li>• OpenRouteService / Maps API keys</li>
                                    <li>• Thresholds for marking zones as high risk</li>
                                    <li>• Auto-expiry rules for old SOS alerts</li>
                                </ul>
                                <p
                                    style={{
                                        fontSize: "0.8rem",
                                        color: "#9ca3af",
                                        marginTop: "0.8rem",
                                    }}
                                >
                                    For the project, this page works as a conceptual
                                    placeholder you can talk about in viva.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default AdminDashboard;
