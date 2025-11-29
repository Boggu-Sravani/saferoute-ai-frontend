// frontend/src/pages/admin/AdminSosPage.jsx
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import "./AdminSosPage.css"; // optional, create if you want custom styling

const POLL_INTERVAL_MS = 10000; // 10 seconds

const statusColors = {
  pending: "#f97316", // orange
  acknowledged: "#3b82f6", // blue
  closed: "#22c55e", // green
};

const AdminSosPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // derived: how many pending alerts
  const pendingCount = alerts.filter((a) => a.status === "pending").length;

  const fetchAlerts = async () => {
    try {
      setError("");
      const res = await axiosClient.get("/sos");
      if (Array.isArray(res.data)) {
        setAlerts(res.data);
        setLastUpdated(new Date());
      } else {
        setAlerts([]);
      }
    } catch (err) {
      console.error("Failed to fetch SOS alerts:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load SOS alerts"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axiosClient.patch(`/sos/${id}/status`, { status });
      // refresh list after update
      await fetchAlerts();
    } catch (err) {
      console.error("Failed to update SOS status:", err);
      alert(
        err?.response?.data?.message ||
          "Failed to update SOS status. Please try again."
      );
    }
  };

  useEffect(() => {
    // initial load
    fetchAlerts();

    if (!polling) return;

    const intervalId = setInterval(() => {
      fetchAlerts();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polling]);

  const formatTime = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    return d.toLocaleString();
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return "Never";
    return lastUpdated.toLocaleTimeString();
  };

  return (
    <div className="sos-admin-page">
      {/* Header */}
      <div className="sos-admin-header">
        <div>
          <h1 className="sos-admin-title">SOS Alerts (Live)</h1>
          <p className="sos-admin-subtitle">
            Incoming SOS alerts from users. This table auto-refreshes every{" "}
            {POLL_INTERVAL_MS / 1000} seconds.
          </p>
        </div>

        <div className="sos-admin-meta">
          <div className="sos-admin-badge">
            <span className="dot-live" />
            Live polling {polling ? "ON" : "OFF"}
          </div>
          <div className="sos-admin-meta-text">
            Last updated: <strong>{formatLastUpdated()}</strong>
          </div>
          <button
            type="button"
            className="sos-admin-refresh-btn"
            onClick={fetchAlerts}
          >
            ⟳ Refresh now
          </button>
          <button
            type="button"
            className="sos-admin-toggle-btn"
            onClick={() => setPolling((p) => !p)}
          >
            {polling ? "Pause auto-refresh" : "Resume auto-refresh"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="sos-admin-stats">
        <div className="sos-admin-stat-card">
          <div className="label">Total alerts</div>
          <div className="value">{alerts.length}</div>
        </div>
        <div className="sos-admin-stat-card">
          <div className="label">Pending</div>
          <div className="value warning">{pendingCount}</div>
        </div>
      </div>

      {/* Error / loading */}
      {loading && <div className="sos-admin-info">Loading SOS alerts…</div>}
      {error && !loading && (
        <div className="sos-admin-error">{error}</div>
      )}

      {/* Table */}
      <div className="sos-admin-table-wrapper">
        <table className="sos-admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Location</th>
              <th>Coordinates</th>
              <th>Created at</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 && !loading && (
              <tr>
                <td colSpan="7" className="sos-admin-empty">
                  No SOS alerts found.
                </td>
              </tr>
            )}

            {alerts.map((alert, idx) => (
              <tr key={alert._id}>
                <td>{idx + 1}</td>
                <td>
                  {alert.user?.name || "Unknown user"}
                  {alert.user?.email && (
                    <div className="sos-admin-user-email">
                      {alert.user.email}
                    </div>
                  )}
                </td>
                <td>{alert.locationName}</td>
                <td>
                  {alert.lat?.toFixed(4)}, {alert.lng?.toFixed(4)}
                </td>
                <td>{formatTime(alert.createdAt)}</td>
                <td>
                  <span
                    className="sos-admin-status-pill"
                    style={{ backgroundColor: statusColors[alert.status] }}
                  >
                    {alert.status}
                  </span>
                </td>
                <td className="sos-admin-actions">
                  <button
                    type="button"
                    className="sos-admin-action-btn"
                    disabled={alert.status === "pending"}
                    onClick={() =>
                      handleStatusChange(alert._id, "pending")
                    }
                  >
                    Mark pending
                  </button>
                  <button
                    type="button"
                    className="sos-admin-action-btn"
                    disabled={alert.status === "acknowledged"}
                    onClick={() =>
                      handleStatusChange(alert._id, "acknowledged")
                    }
                  >
                    Acknowledge
                  </button>
                  <button
                    type="button"
                    className="sos-admin-action-btn danger"
                    disabled={alert.status === "closed"}
                    onClick={() =>
                      handleStatusChange(alert._id, "closed")
                    }
                  >
                    Close
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSosPage;
