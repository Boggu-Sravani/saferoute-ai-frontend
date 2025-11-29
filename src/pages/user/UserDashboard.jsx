// src/pages/user/UserDashboard.jsx
import { useEffect, useState } from "react";
import "./UserDashboard.css";
import MapView from "../../components/Dashboard/MapView";
import { triggerSosApi } from "../../api/sosApi";
import { getSafeRoutesApi } from "../../api/routesApi";
import { getNearbyFeedbackApi } from "../../api/feedbackApi";
import ScoreBadge from "../../components/common/ScoreBadge";
import AIReasonTooltip from "../../components/common/AIReasonTooltip";
import SafeRouteLogo from "../../assets/images/safeRoute-ai.png";
import { getContactsApi } from "../../api/contactApi";
import SosTriggeredModal from "../../components/sos/SosTriggeredModal";

// ❌ Removed DEMO_SOURCE, DEMO_DEST

const UserDashboard = () => {
    // ✅ NEW: source/destination start as null
    const [source, setSource] = useState(null);
    const [destination, setDestination] = useState(null);

    // NEW: manual input fields
    const [sourceInput, setSourceInput] = useState("");
    const [destInput, setDestInput] = useState("");

    const [geoLoading, setGeoLoading] = useState(false);
    const [geoError, setGeoError] = useState("");

    const [routes, setRoutes] = useState([]);
    const [routesLoading, setRoutesLoading] = useState(false);
    const [routesError, setRoutesError] = useState("");

    const [sosLoading, setSosLoading] = useState(false);
    const [sosMessage, setSosMessage] = useState("");
    const [sosError, setSosError] = useState("");
    const [sosPopup, setSosPopup] = useState(false);

    const [feedback, setFeedback] = useState([]);
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [feedbackError, setFeedbackError] = useState("");

    const [contactsCount, setContactsCount] = useState(0);

    // --------------------------------------
    // 1️⃣ Fetch contacts count
    // --------------------------------------
    useEffect(() => {
        const fetchContactsCount = async () => {
            try {
                const res = await getContactsApi();
                setContactsCount(Array.isArray(res.data) ? res.data.length : 0);
            } catch (err) {
                console.error("Contacts fetch error:", err);
            }
        };
        fetchContactsCount();
    }, []);

    // --------------------------------------
    // 2️⃣ ROUTE LOADING (runs whenever source or destination changes)
    // --------------------------------------
    useEffect(() => {
        const loadRoutes = async () => {
            if (!source || !destination) return;

            setRoutesLoading(true);
            setRoutesError("");

            try {
                const res = await getSafeRoutesApi({
                    source: { lat: source.lat, lng: source.lng },
                    destination: { lat: destination.lat, lng: destination.lng },
                });

                setRoutes(
                    res?.data?.routes && Array.isArray(res.data.routes)
                        ? res.data.routes
                        : []
                );
            } catch (err) {
                setRoutesError(
                    err?.response?.data?.message || "Unable to load safe routes."
                );
            } finally {
                setRoutesLoading(false);
            }
        };

        loadRoutes();
    }, [source, destination]);

    // --------------------------------------
    // 3️⃣ FEEDBACK loading
    // --------------------------------------
    useEffect(() => {
        const loadFeedback = async () => {
            setFeedbackLoading(true);
            setFeedbackError("");
            try {
                const res = await getNearbyFeedbackApi({ limit: 10 });
                setFeedback(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                setFeedbackError(
                    err?.response?.data?.message || "Unable to load feedback."
                );
            } finally {
                setFeedbackLoading(false);
            }
        };
        loadFeedback();
    }, []);

    // --------------------------------------
    // 4️⃣ SOS HANDLER
    // --------------------------------------
    const handleSos = async () => {
        const confirmSend = window.confirm("Send SOS alert to your trusted contacts?");
        if (!confirmSend) return;

        setSosLoading(true);
        setSosMessage("");
        setSosError("");

        try {
            const payload = {
                locationName: source?.name || "Unknown location",
                lat: source?.lat,
                lng: source?.lng,
                note: "SOS triggered from dashboard",
            };

            const res = await triggerSosApi(payload);

            setSosMessage(res.data?.message || "SOS alert sent.");
            setSosPopup(true);
        } catch (err) {
            setSosError(err?.response?.data?.message || "Failed to send SOS alert.");
        } finally {
            setSosLoading(false);
        }
    };

    // --------------------------------------
    // 5️⃣ NEW — Manual geocoding using OSM
    // --------------------------------------
    const geocodeLocation = async (placeName) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            placeName
        )}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!data.length) throw new Error("Location not found");

        return {
            lat: Number(data[0].lat),
            lng: Number(data[0].lon),
            name: placeName,
        };
    };

    // --------------------------------------
    // 6️⃣ NEW — Handle Manual Route Search
    // --------------------------------------
    const handleManualRoute = async () => {
        try {
            const src = await geocodeLocation(sourceInput);
            const dst = await geocodeLocation(destInput);

            setSource(src);
            setDestination(dst);
        } catch (err) {
            alert("Could not find one of the locations. Try a different place name.");
        }
    };

    // --------------------------------------
    // 7️⃣ Use My Current Location
    // --------------------------------------
    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            setGeoError("Browser does not support location access.");
            return;
        }

        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setSource({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    name: "My Location",
                });
                setGeoLoading(false);
            },
            () => {
                setGeoError("Unable to fetch location.");
                setGeoLoading(false);
            }
        );
    };

    // Helpers for route UI
    const routePill = (s) =>
        s === "safe"
            ? "sr-route-pill safe"
            : s === "moderate"
                ? "sr-route-pill moderate"
                : "sr-route-pill risky";

    const routeOption = (s) =>
        s === "safe"
            ? "sr-route-option safe"
            : s === "moderate"
                ? "sr-route-option moderate"
                : "sr-route-option risky";

    const ratingLabel = (r) =>
        r === "very_safe"
            ? "Very safe"
            : r === "okay"
                ? "Okay"
                : r === "risky"
                    ? "Risky"
                    : "Avoid";

    const ratingTag = (r) =>
        r === "avoid" || r === "risky"
            ? "sr-feedback-tag risky"
            : "sr-feedback-tag safe";

    return (
        <main className="sr-dashboard">
            {/* HEADER */}
            <header className="sr-dashboard-header">
                <div>
                    <img src={SafeRouteLogo} alt="SafeRoute AI" className="sr-logo-small" />
                    <h1>SafeRoute Dashboard</h1>
                    <p>Choose your route and see AI-based safety scoring.</p>
                </div>
                <div className="sr-dashboard-status">
                    <span className="sr-status-dot" /> Connected
                </div>
            </header>

            <section className="sr-dashboard-grid">

                {/* LEFT COLUMN */}
                <div className="sr-column-left">

                    {/* NEW: Manual Route Inputs */}
                    <div className="sr-card">
                        <h2>Choose your route</h2>

                        <label>Source</label>
                        <input
                            type="text"
                            value={sourceInput}
                            onChange={(e) => setSourceInput(e.target.value)}
                            placeholder="Enter source place"
                        />

                        <label>Destination</label>
                        <input
                            type="text"
                            value={destInput}
                            onChange={(e) => setDestInput(e.target.value)}
                            placeholder="Enter destination place"
                        />

                        <button
                            className="sr-map-loc-btn"
                            disabled={!sourceInput || !destInput}
                            onClick={handleManualRoute}
                        >
                            Get Safe Routes
                        </button>
                    </div>

                    {/* SOS CARD */}
                    <div className="sr-card sr-sos-card">
                        <h2>Emergency SOS</h2>
                        <button
                            className="sr-sos-btn"
                            onClick={handleSos}
                            disabled={sosLoading}
                        >
                            {sosLoading ? "Sending..." : "⚠ Send SOS Alert"}
                        </button>

                        {sosError && <p className="sr-error">{sosError}</p>}
                        {sosMessage && <p className="sr-success">{sosMessage}</p>}
                    </div>
                </div>

                {/* CENTER MAP */}
                <div className="sr-column-center">
                    <div className="sr-card sr-map-card">
                        <h2>Map</h2>
                        <button onClick={handleUseMyLocation} className="sr-map-loc-btn">
                            {geoLoading ? "Locating..." : "Use My Location"}
                        </button>

                        {source && destination ? (
                            <MapView source={source} destination={destination} />
                        ) : (
                            <p style={{ padding: "1rem" }}>
                                Enter source & destination to view routes.
                            </p>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="sr-column-right">
                    <div className="sr-card">
                        <h2>Route Suggestions</h2>

                        {routesLoading && <p>Loading...</p>}
                        {routesError && <p className="sr-error">{routesError}</p>}

                        {!routesLoading &&
                            !routesError &&
                            routes.map((r) => (
                                <div key={r.id} className={routeOption(r.safety)}>
                                    <div>
                                        <div className="sr-route-title">{r.label}</div>
                                        <div className="sr-route-meta">
                                            {r.durationMin} min · {r.distanceKm} km · {r.safety}
                                        </div>
                                    </div>
                                    <div className="sr-route-actions">
                                        <ScoreBadge score={r.score} safety={r.safety} />
                                        <span className={routePill(r.safety)}>
                                            {r.safety}
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* FEEDBACK */}
                    <div className="sr-card">
                        <h2>Nearby Feedback</h2>
                        {feedbackLoading && <p>Loading…</p>}
                        {feedbackError && (
                            <p className="sr-error">{feedbackError}</p>
                        )}
                        {feedback.map((f) => (
                            <li key={f._id} className="sr-feedback-item">
                                <span className={ratingTag(f.rating)}>
                                    {ratingLabel(f.rating)}
                                </span>
                                <div>
                                    <div className="sr-feedback-text">
                                        {f.comment || f.locationName}
                                    </div>
                                    <div className="sr-feedback-meta">{f.locationName}</div>
                                </div>
                            </li>
                        ))}
                    </div>
                </div>
            </section>

            {/* SOS POPUP */}
            {sosPopup && (
                <SosTriggeredModal
                    onClose={() => {
                        setSosPopup(false);
                        setSosMessage("");
                        setSosError("");
                    }}
                />
            )}
        </main>
    );
};

export default UserDashboard;
