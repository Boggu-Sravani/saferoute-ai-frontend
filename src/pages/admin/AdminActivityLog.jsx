import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { getAdminActivityLogApi } from "../../api/adminApi";

const typeLabel = (type) => {
    if (type === "feedback") return "Feedback";
    if (type === "risk_zone") return "Risk zone";
    if (type === "sos") return "SOS alert";
    if (type === "user") return "User";
    return "Event";
};

const typeBadgeClass = (type) => {
    if (type === "feedback") return "sr-admin-pill";
    if (type === "risk_zone") return "sr-admin-pill sr-admin-pill-warn";
    if (type === "sos") return "sr-admin-pill sr-admin-pill-danger";
    if (type === "user") return "sr-admin-pill sr-admin-pill-info";
    return "sr-admin-pill";
};

const AdminActivityLog = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await getAdminActivityLogApi();
                setEvents(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Activity log error:", err);
                setError(
                    err?.response?.data?.message || "Unable to load activity log."
                );
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <main className="sr-admin">
            <header className="sr-admin-header">
                <div>
                    <h1>Activity log</h1>
                    <p>
                        Timeline of recent feedback, risk zones, SOS alerts and user
                        registrations.
                    </p>
                </div>
            </header>

            <section className="sr-admin-layout">
                <div className="sr-admin-main">
                    <div className="sr-admin-panel">
                        <div className="sr-admin-panel-header">
                            <h2>Recent events</h2>
                            <span className="sr-admin-pill">{events.length} entries</span>
                        </div>

                        {loading && (
                            <p className="sr-admin-card-meta">Loading activity…</p>
                        )}

                        {error && (
                            <p
                                className="sr-admin-card-meta"
                                style={{ color: "#fca5a5" }}
                            >
                                {error}
                            </p>
                        )}

                        {!loading && !error && events.length === 0 && (
                            <p className="sr-admin-card-meta">
                                No activity recorded yet.
                            </p>
                        )}

                        {!loading && !error && events.length > 0 && (
                            <table className="sr-admin-table">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Summary</th>
                                        <th>Actor</th>
                                        <th>Details</th>
                                        <th>When</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((e, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <span className={typeBadgeClass(e.type)}>
                                                    {typeLabel(e.type)}
                                                </span>
                                            </td>
                                            <td>{e.summary}</td>
                                            <td>{e.actor || "-"}</td>
                                            <td>{e.details || "-"}</td>
                                            <td>
                                                {e.when
                                                    ? new Date(e.when).toLocaleString()
                                                    : "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default AdminActivityLog;
