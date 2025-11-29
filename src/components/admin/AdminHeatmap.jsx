// src/components/admin/AdminHeatmap.jsx
import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Circle,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import "./AdminHeatmap.css";
import { getNearbyFeedbackApi } from "../../api/feedbackApi";

// Fix default marker icon for Leaflet + Vite
const defaultIcon = L.icon({
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const DEFAULT_CENTER = [17.385, 78.486]; // adjust later if needed

// 🔥 HeatLayer component: attaches a Leaflet heat layer to the map
const HeatLayer = ({ points }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        // remove existing heat layer if any
        if (map._heatLayer) {
            map.removeLayer(map._heatLayer);
            map._heatLayer = null;
        }

        if (!points || points.length === 0) return;

        const heatPoints = points.map((p) => [p.lat, p.lng, p.intensity]);

        const heatLayer = L.heatLayer(heatPoints, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
        });

        heatLayer.addTo(map);
        map._heatLayer = heatLayer;

        return () => {
            if (map._heatLayer) {
                map.removeLayer(map._heatLayer);
                map._heatLayer = null;
            }
        };
    }, [map, points]);

    return null;
};

const AdminHeatmap = ({ riskZones = [] }) => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showHeatmap, setShowHeatmap] = useState(true);
    const [showZones, setShowZones] = useState(true);
    const [showPoints, setShowPoints] = useState(false);

    useEffect(() => {
        const loadFeedback = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await getNearbyFeedbackApi({ limit: 200 });
                setFeedback(res.data || []);
            } catch (err) {
                console.error("Admin heatmap feedback error:", err);
                setError(
                    err?.response?.data?.message ||
                    "Unable to load feedback data for heatmap."
                );
            } finally {
                setLoading(false);
            }
        };

        loadFeedback();
    }, []);

    // convert feedback → heatPoints with intensity
    const heatPoints = feedback.map((fb) => {
        let intensity = 0.4;
        if (fb.rating === "very_safe") intensity = 0.2;
        if (fb.rating === "okay") intensity = 0.3;
        if (fb.rating === "risky") intensity = 0.7;
        if (fb.rating === "avoid") intensity = 1.0;

        return {
            lat: fb.lat,
            lng: fb.lng,
            intensity,
        };
    });

    const getZoneColor = (riskLevel) => {
        if (riskLevel === "high") return "#ef4444";
        if (riskLevel === "medium") return "#f97316";
        return "#22c55e";
    };

    const getFeedbackColor = (rating) => {
        if (rating === "very_safe") return "#22c55e";
        if (rating === "okay") return "#3b82f6";
        if (rating === "risky") return "#f97316";
        if (rating === "avoid") return "#ef4444";
        return "#6b7280";
    };

    const getFeedbackLabel = (rating) => {
        if (rating === "very_safe") return "Very safe";
        if (rating === "okay") return "Okay";
        if (rating === "risky") return "Risky";
        if (rating === "avoid") return "Avoid";
        return "Feedback";
    };

    return (
        <div className="sr-admin-heatmap">
            {/* small toggles row */}
            <div className="sr-admin-heatmap-toggles">
                <button
                    type="button"
                    className={`sr-admin-toggle-btn ${showHeatmap ? "active" : ""
                        }`}
                    onClick={() => setShowHeatmap((v) => !v)}
                >
                    Heatmap
                </button>
                <button
                    type="button"
                    className={`sr-admin-toggle-btn ${showZones ? "active" : ""
                        }`}
                    onClick={() => setShowZones((v) => !v)}
                >
                    Risk zones
                </button>
                <button
                    type="button"
                    className={`sr-admin-toggle-btn ${showPoints ? "active" : ""
                        }`}
                    onClick={() => setShowPoints((v) => !v)}
                >
                    Feedback points
                </button>
            </div>

            <div className="sr-admin-heatmap-map-wrapper">
                {loading && (
                    <div className="sr-admin-heatmap-overlay">
                        <span>Loading heatmap data…</span>
                    </div>
                )}
                {error && (
                    <div className="sr-admin-heatmap-overlay error">
                        <span>{error}</span>
                    </div>
                )}

                <MapContainer
                    center={DEFAULT_CENTER}
                    zoom={14}
                    scrollWheelZoom={false}
                    className="sr-admin-heatmap-map"
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Heat layer */}
                    {showHeatmap && heatPoints.length > 0 && (
                        <HeatLayer points={heatPoints} />
                    )}

                    {/* Risk zones as circles */}
                    {showZones &&
                        riskZones.map((zone) => (
                            <Circle
                                key={zone._id}
                                center={[zone.lat, zone.lng]}
                                radius={zone.radiusMeters || 150}
                                pathOptions={{
                                    color: getZoneColor(zone.riskLevel),
                                    fillColor: getZoneColor(zone.riskLevel),
                                    fillOpacity: 0.15,
                                    weight: 1.2,
                                }}
                            >
                                <Popup>
                                    <div style={{ fontSize: "0.78rem" }}>
                                        <strong>{zone.name}</strong>
                                        <br />
                                        Risk: {zone.riskLevel?.toUpperCase()}
                                        {zone.description && (
                                            <>
                                                <br />
                                                <span>{zone.description}</span>
                                            </>
                                        )}
                                    </div>
                                </Popup>
                            </Circle>
                        ))}

                    {/* Feedback points as markers */}
                    {showPoints &&
                        feedback.map((fb) => (
                            <Marker key={fb._id} position={[fb.lat, fb.lng]}>
                                <Popup>
                                    <div style={{ fontSize: "0.78rem" }}>
                                        <strong
                                            style={{ color: getFeedbackColor(fb.rating) }}
                                        >
                                            {getFeedbackLabel(fb.rating)}
                                        </strong>
                                        <br />
                                        {fb.locationName}
                                        {fb.comment && (
                                            <>
                                                <br />
                                                <span>{fb.comment}</span>
                                            </>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default AdminHeatmap;
