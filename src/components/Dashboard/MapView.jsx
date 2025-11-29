// src/components/Dashboard/MapView.jsx
import React, { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Circle,
    Polyline,
    useMap,
    useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import "./MapView.css";

import { getPublicRiskZonesApi } from "../../api/riskZoneApi";
import { getNearbyFeedbackApi } from "../../api/feedbackApi";
import { getSafeRoutesApi } from "../../api/routesApi";
import AddFeedbackModal from "../feedback/AddFeedbackModal";
import axiosClient from "../../api/axiosClient";

// Default marker icon
const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

/**
 * HeatLayer component – attaches Leaflet heat layer to the map.
 */
const HeatLayer = ({ points }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        // remove previous heat layer if exists
        if (map._heatLayer) {
            map.removeLayer(map._heatLayer);
            map._heatLayer = null;
        }

        if (!points || !points.length) return;

        const heatPoints = points.map((p) => [
            p.lat,
            p.lng,
            Math.max(0, Math.min(1, p.intensity || 0.5)),
        ]);

        const heatLayer = L.heatLayer(heatPoints, {
            radius: 25,
            blur: 18,
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

// Handles click events on the map and notifies parent
const MapClickHandler = ({ onMapClick }) => {
    useMapEvent("click", (e) => {
        if (typeof onMapClick === "function") {
            onMapClick(e.latlng);
        }
    });
    return null;
};

// create score marker icon
const makeScoreIcon = (score) => {
    const value = Math.round(score);
    let bg = "#f59e0b"; // moderate
    if (value >= 70) bg = "#22c55e";
    else if (value < 40) bg = "#ef4444";

    return L.divIcon({
        className: "sr-score-marker",
        html: `<div class="sr-score-marker-inner" style="background:${bg}">${value}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });
};

const MapView = ({ source, destination }) => {
    // 🔹 Now this component uses ONLY what parent passes
    const src = source;
    const dest = destination;

    const [riskZones, setRiskZones] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [routes, setRoutes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [tempPin, setTempPin] = useState(null);

    // heatmap mode
    const [heatMode, setHeatMode] = useState("combined");

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError("");

            try {
                // 1️⃣ Always load zones + feedback
                const [zonesRes, feedbackRes] = await Promise.all([
                    getPublicRiskZonesApi(),
                    getNearbyFeedbackApi({ limit: 100 }),
                ]);

                setRiskZones(Array.isArray(zonesRes.data) ? zonesRes.data : []);
                setFeedback(Array.isArray(feedbackRes.data) ? feedbackRes.data : []);

                // 2️⃣ Only call ORS safe routes when we have both src & dest
                let routesFromApi = [];
                if (
                    src &&
                    dest &&
                    typeof src.lat === "number" &&
                    typeof src.lng === "number" &&
                    typeof dest.lat === "number" &&
                    typeof dest.lng === "number"
                ) {
                    try {
                        const routesRes = await getSafeRoutesApi({
                            source: { lat: src.lat, lng: src.lng },
                            destination: { lat: dest.lat, lng: dest.lng },
                        });

                        routesFromApi =
                            routesRes?.data && Array.isArray(routesRes.data.routes)
                                ? routesRes.data.routes
                                : [];
                    } catch (routeErr) {
                        console.error("Route fetch error:", routeErr);
                        setError(
                            routeErr?.response?.data?.message ||
                            routeErr?.message ||
                            "Unable to load safe routes right now."
                        );
                    }
                }

                setRoutes(routesFromApi);
            } catch (err) {
                console.error("Map data error:", err);
                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to load map safety data right now."
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
        // Re-run when route endpoints change
    }, [src?.lat, src?.lng, dest?.lat, dest?.lng]);

    const getZoneColor = (riskLevel) => {
        if (riskLevel === "high") return "#ef4444";
        if (riskLevel === "medium") return "#f97316";
        return "#eab308";
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

    const getRouteColor = (route) => {
        if (route.color) return route.color;
        if (route.safety === "safe") return "#22c55e";
        if (route.safety === "moderate") return "#f97316";
        if (route.safety === "risky") return "#ef4444";
        return "#3b82f6";
    };

    const getRouteWeight = (route) => {
        if (route.safety === "safe") return 6;
        if (route.safety === "moderate") return 5;
        if (route.safety === "risky") return 4;
        return 4;
    };

    const buildHeatPoints = () => {
        const points = [];

        if (heatMode === "feedback" || heatMode === "combined") {
            const fbWeight = (rating) => {
                if (rating === "very_safe") return 0.2;
                if (rating === "okay") return 0.5;
                if (rating === "risky") return 0.8;
                if (rating === "avoid") return 1.0;
                return 0.4;
            };

            if (Array.isArray(feedback)) {
                feedback.forEach((fb) => {
                    if (typeof fb.lat === "number" && typeof fb.lng === "number") {
                        points.push({
                            lat: fb.lat,
                            lng: fb.lng,
                            intensity: fbWeight(fb.rating),
                        });
                    }
                });
            }
        }

        if (heatMode === "zones" || heatMode === "combined") {
            const zoneWeight = (riskLevel) => {
                if (riskLevel === "high") return 1.0;
                if (riskLevel === "medium") return 0.8;
                return 0.6;
            };

            if (Array.isArray(riskZones)) {
                riskZones.forEach((zone) => {
                    if (typeof zone.lat === "number" && typeof zone.lng === "number") {
                        points.push({
                            lat: zone.lat,
                            lng: zone.lng,
                            intensity: zoneWeight(zone.riskLevel),
                        });
                    }
                });
            }
        }

        return points;
    };

    const heatPoints = buildHeatPoints();
    const isHeatMode = heatMode !== "none";

    const submitFeedback = async (details) => {
        try {
            await axiosClient.post("/feedback", details);
            setModalOpen(false);
            setTempPin(null);

            const fbRes = await getNearbyFeedbackApi({ limit: 100 });
            setFeedback(Array.isArray(fbRes.data) ? fbRes.data : []);
        } catch (err) {
            console.error("Submit feedback error:", err);
            alert("Failed to submit feedback.");
        }
    };

    const heatModeLabel =
        heatMode === "none"
            ? "Markers only"
            : heatMode === "feedback"
                ? "Feedback heat"
                : heatMode === "zones"
                    ? "Zones heat"
                    : "Combined";

    // Choose a safe default map center if src is missing
    const initialCenter = src && typeof src.lat === "number" && typeof src.lng === "number"
        ? [src.lat, src.lng]
        : [17.385, 78.486]; // fallback to Hyderabad-ish

    return (
        <div className="sr-map-wrapper">
            {loading && (
                <div className="sr-map-overlay">
                    <span>Loading safety layers & AI routes…</span>
                </div>
            )}
            {error && !loading && (
                <div className="sr-map-overlay sr-map-overlay-error">
                    <span>{error}</span>
                </div>
            )}

            {/* Summary bar */}
            <div className="sr-map-summary">
                <span>
                    Zones: <strong>{riskZones.length}</strong>
                </span>
                <span>·</span>
                <span>
                    Feedback: <strong>{feedback.length}</strong>
                </span>
                <span>·</span>
                <span>
                    Mode: <strong>{heatModeLabel}</strong>
                </span>
            </div>

            {/* Floating controls */}
            <div className="sr-map-controls">
                <button
                    type="button"
                    className={`sr-map-toggle ${heatMode === "none" ? "active" : ""}`}
                    onClick={() => setHeatMode("none")}
                >
                    Markers only
                </button>
                <button
                    type="button"
                    className={`sr-map-toggle ${heatMode === "feedback" ? "active" : ""}`}
                    onClick={() => setHeatMode("feedback")}
                >
                    Feedback heat
                </button>
                <button
                    type="button"
                    className={`sr-map-toggle ${heatMode === "zones" ? "active" : ""}`}
                    onClick={() => setHeatMode("zones")}
                >
                    Zones heat
                </button>
                <button
                    type="button"
                    className={`sr-map-toggle ${heatMode === "combined" ? "active" : ""}`}
                    onClick={() => setHeatMode("combined")}
                >
                    Combined
                </button>
            </div>

            <MapContainer
                key={`${initialCenter[0]}-${initialCenter[1]}`}
                center={initialCenter}
                zoom={14}
                scrollWheelZoom={false}
                className="sr-leaflet-map"
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapClickHandler
                    onMapClick={(latlng) => {
                        setTempPin({ lat: latlng.lat, lng: latlng.lng });
                        setModalOpen(true);
                    }}
                />

                {isHeatMode && heatPoints.length > 0 && <HeatLayer points={heatPoints} />}

                {/* Risk zones */}
                {Array.isArray(riskZones) &&
                    riskZones.map((zone) => (
                        <Circle
                            key={zone._id}
                            center={[zone.lat, zone.lng]}
                            radius={zone.radiusMeters || 150}
                            pathOptions={{
                                color: getZoneColor(zone.riskLevel),
                                fillColor: getZoneColor(zone.riskLevel),
                                fillOpacity: 0.15,
                                weight: 1.1,
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

                {/* Feedback markers */}
                {Array.isArray(feedback) &&
                    feedback.map((fb) => (
                        <Marker key={fb._id} position={[fb.lat, fb.lng]}>
                            <Popup>
                                <div style={{ fontSize: "0.78rem" }}>
                                    <strong style={{ color: getFeedbackColor(fb.rating) }}>
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

                {/* Routes */}
                {Array.isArray(routes) &&
                    routes.map((route) => {
                        const coordsArray = Array.isArray(route.geometry)
                            ? route.geometry
                            : [];
                        const positions = coordsArray.map((p) => [p.lat, p.lng]);
                        const midIndex =
                            positions.length > 0
                                ? Math.floor(positions.length / 2)
                                : null;

                        return (
                            <React.Fragment key={route.id}>
                                <Polyline
                                    positions={positions}
                                    pathOptions={{
                                        color: getRouteColor(route),
                                        weight: getRouteWeight(route),
                                        opacity: 0.85,
                                    }}
                                />
                                {typeof route.score === "number" && midIndex !== null && (
                                    <Marker
                                        position={positions[midIndex]}
                                        icon={makeScoreIcon(route.score)}
                                    >
                                        <Popup>
                                            <div style={{ fontSize: "0.78rem" }}>
                                                <strong>{route.label}</strong>
                                                <br />
                                                AI score: {Math.round(route.score)}/100 (
                                                {route.safety})
                                            </div>
                                        </Popup>
                                    </Marker>
                                )}
                            </React.Fragment>
                        );
                    })}

                {/* Temporary pin when user clicks to add feedback */}
                {tempPin && (
                    <Marker position={[tempPin.lat, tempPin.lng]}>
                        <Popup>New feedback location</Popup>
                    </Marker>
                )}

                {/* Source & destination markers (if provided) */}
                {src && typeof src.lat === "number" && typeof src.lng === "number" && (
                    <Marker position={[src.lat, src.lng]}>
                        <Popup>{src.name || "Source"}</Popup>
                    </Marker>
                )}
                {dest &&
                    typeof dest.lat === "number" &&
                    typeof dest.lng === "number" && (
                        <Marker position={[dest.lat, dest.lng]}>
                            <Popup>{dest.name || "Destination"}</Popup>
                        </Marker>
                    )}
            </MapContainer>

            {/* 🔍 Heatmap info overlay */}
            <div className="sr-map-heat-info">
                <div className="sr-map-heat-info-main">
                    <div className="sr-map-heat-title">Safety heatmap</div>
                    <div className="sr-map-heat-sub">
                        Visualizes combined risk from admin-defined zones and
                        crowd-sourced feedback. Red areas indicate higher reported risk.
                    </div>
                    <div className="sr-map-heat-meta">
                        Zones: {riskZones.length} · Feedback points: {feedback.length} ·
                        Mode: {heatModeLabel}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="sr-map-legend-box">
                <div className="sr-map-legend-row">
                    <span className="sr-map-dot zone-high" /> High risk zone
                </div>
                <div className="sr-map-legend-row">
                    <span className="sr-map-dot zone-medium" /> Medium risk
                </div>
                <div className="sr-map-legend-row">
                    <span className="sr-map-dot zone-low" /> Low risk
                </div>
                <div
                    className="sr-map-legend-row"
                    style={{
                        marginTop: "0.25rem",
                        borderTop: "1px solid #4b5563",
                        paddingTop: "0.25rem",
                    }}
                >
                    <span
                        className="sr-map-dot"
                        style={{
                            background: "#22c55e",
                            width: 14,
                            height: 4,
                            borderRadius: 999,
                        }}
                    />{" "}
                    Safe route
                </div>
                <div className="sr-map-legend-row">
                    <span
                        className="sr-map-dot"
                        style={{
                            background: "#f97316",
                            width: 14,
                            height: 4,
                            borderRadius: 999,
                        }}
                    />{" "}
                    Moderate route
                </div>
                <div className="sr-map-legend-row">
                    <span
                        className="sr-map-dot"
                        style={{
                            background: "#ef4444",
                            width: 14,
                            height: 4,
                            borderRadius: 999,
                        }}
                    />{" "}
                    Risky route
                </div>
            </div>

            {modalOpen && tempPin && (
                <AddFeedbackModal
                    lat={tempPin.lat}
                    lng={tempPin.lng}
                    onClose={() => {
                        setModalOpen(false);
                        setTempPin(null);
                    }}
                    onSubmit={submitFeedback}
                />
            )}
        </div>
    );
};

export default MapView;
