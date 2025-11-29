// src/pages/LandingPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LandingPage.css";
import heroImage from "../assets/images/safety-hero.jpg";
import Footer from "../components/layout/Footer";

const Landing = () => {
    const navigate = useNavigate();

    // ✅ Video modal state
    const [videoOpen, setVideoOpen] = useState(false);

    const handleTryDemo = () => {
        // if user is logged in they'll see their dashboard,
        // if not, ProtectedRoute will send them to /login
        navigate("/dashboard");
    };

    const scrollToHowItWorks = () => {
        const section = document.getElementById("how-it-works");
        if (section) section.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <main className="sr-landing">
            {/* HERO SECTION */}
            <section className="sr-hero">
                <div className="sr-hero-left">
                    <div className="sr-pill">Women safety • Smart navigation</div>

                    <h1 className="sr-hero-title">
                        Choose <span>safer routes</span>, not just shorter ones.
                    </h1>

                    <p className="sr-hero-subtitle">
                        SafeRoute AI combines maps, crowd feedback and a safety score engine
                        to help women avoid dark, isolated streets and reach home safely
                        with confidence.
                    </p>

                    <div className="sr-hero-cta">
                        <button
                            className="sr-btn sr-btn-primary"
                            type="button"
                            onClick={handleTryDemo}
                        >
                            Try SafeRoute demo
                        </button>

                        <button
                            className="sr-btn sr-btn-outline"
                            type="button"
                            onClick={scrollToHowItWorks}
                        >
                            How it works
                        </button>
                    </div>

                    <div className="sr-hero-metrics">
                        <div>
                            <div className="sr-metric-number">3x</div>
                            <div className="sr-metric-label">More safety awareness</div>
                        </div>
                        <div>
                            <div className="sr-metric-number">24/7</div>
                            <div className="sr-metric-label">SOS alert availability</div>
                        </div>
                        <div>
                            <div className="sr-metric-number">Crowd</div>
                            <div className="sr-metric-label">powered feedback</div>
                        </div>
                    </div>

                    {/* Small, professional auth shortcut links */}
                    <div
                        style={{
                            marginTop: "0.75rem",
                            fontSize: "0.8rem",
                            color: "#9ca3af",
                        }}
                    >
                        <span>Ready to use it? </span>
                        <Link
                            to="/login"
                            style={{
                                color: "#38bdf8",
                                textDecoration: "none",
                                marginRight: "0.75rem",
                            }}
                        >
                            Log in
                        </Link>
                        <span>or </span>
                        <Link
                            to="/register"
                            style={{ color: "#a855f7", textDecoration: "none" }}
                        >
                            create an account
                        </Link>
                    </div>
                </div>

                {/* RIGHT: IMAGE + DEMO VIDEO CARD */}
                <div className="sr-hero-right">
                    <div className="sr-hero-image-wrapper">
                        <img
                            src={heroImage}
                            alt="Woman using safe navigation at night"
                            className="sr-hero-image"
                        />
                        <div className="sr-hero-image-badge">
                            <span className="dot-safe" />
                            Safer route suggested
                        </div>
                    </div>

                    {/* ✅ Clickable video preview card */}
                    <div
                        className="sr-hero-video-card"
                        onClick={() => setVideoOpen(true)}
                    >
                        <div className="sr-video-header">
                            <div className="sr-video-title">SafeRoute in action</div>

                            <div className="sr-video-tag">Demo preview</div>

                        </div>
                        <div className="sr-video-body">
                            <div className="sr-video-thumbnail clickable">
                                <div className="sr-video-play-button">▶</div>
                            </div>
                            <div className="sr-video-text">
                                <video controls autoPlay className="sr-video-player">
                                    {/* Put demo.mp4 in frontend/public/demo.mp4 */}
                                    <source src="/demo.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                ×
                                <p>
                                    This short demo shows how SafeRoute highlights safer vs
                                    risky paths in a real city scenario.
                                </p>
                                <p className="sr-video-note">
                                    Click to watch the demo. You can replace this with your own
                                    recorded project video.
                                </p>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section id="how-it-works" className="sr-section">
                <h2 className="sr-section-title">How SafeRoute AI works</h2>
                <p className="sr-section-subtitle">
                    Behind a simple interface, your project runs multiple intelligent
                    modules to compute safer routes.
                </p>

                <div className="sr-steps-grid">
                    <div className="sr-step-card">
                        <div className="sr-step-number">01</div>
                        <h3>Route detection</h3>
                        <p>
                            The system collects multiple routes between source and destination
                            using a mapping service.
                        </p>
                    </div>
                    <div className="sr-step-card">
                        <div className="sr-step-number">02</div>
                        <h3>Safety scoring</h3>
                        <p>
                            Each route is scored based on time of day, crowd feedback and admin
                            risk zones using a safety score engine.
                        </p>
                    </div>
                    <div className="sr-step-card">
                        <div className="sr-step-number">03</div>
                        <h3>Crowd feedback</h3>
                        <p>
                            Users mark locations as Very Safe, Okay, Risky or Avoid, helping
                            the system learn over time.
                        </p>
                    </div>
                    <div className="sr-step-card">
                        <div className="sr-step-number">04</div>
                        <h3>SOS & dashboard</h3>
                        <p>
                            In emergencies, SOS alerts notify trusted contacts and admins see
                            unsafe areas on a dashboard.
                        </p>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="sr-section sr-section-alt">
                <h2 className="sr-section-title">Key project features</h2>
                <div className="sr-feature-grid">
                    <div className="sr-feature-card">
                        <h3>Safety-aware routing</h3>
                        <p>
                            Not just shortest path—your system labels routes as Safe, Moderate
                            or Risky based on multiple signals.
                        </p>
                    </div>
                    <div className="sr-feature-card">
                        <h3>Panic / SOS alerts</h3>
                        <p>
                            With one click, users can send an alert to trusted contacts with
                            their current location.
                        </p>
                    </div>
                    <div className="sr-feature-card">
                        <h3>Admin heatmap</h3>
                        <p>
                            Admins or police can view a heatmap of unsafe zones and manage
                            high-risk areas.
                        </p>
                    </div>
                    <div className="sr-feature-card">
                        <h3>ML-ready design</h3>
                        <p>
                            The architecture is prepared to plug in a machine learning model
                            for smarter risk prediction.
                        </p>
                    </div>
                </div>
            </section>

            {/* ✅ DEMO VIDEO MODAL */}
            {videoOpen && (
                <div className="sr-video-modal-overlay">
                    <div className="sr-video-modal">
                        <button
                            className="sr-video-close"
                            onClick={() => setVideoOpen(false)}
                        >

                        </button>

                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
};

export default Landing;
