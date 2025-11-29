import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="sr-footer">
            <div className="sr-footer-container">

                {/* LEFT SECTION */}
                <div className="sr-footer-brand">
                    <h3 className="sr-footer-logo">SafeRoute AI</h3>
                    <p className="sr-footer-desc">
                        Academic prototype · For demonstration and learning purposes only.
                    </p>
                </div>

                {/* MIDDLE NAV LINKS */}
                <div className="sr-footer-links">
                    <h4>Navigation</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><a href="#how-it-works">How it works</a></li>
                        <li><a href="#features">Features</a></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </ul>
                </div>

                {/* RIGHT CONTACT / SOCIAL */}
                <div className="sr-footer-contact">
                    <h4>Contact</h4>
                    <ul>
                        <li>Email: saferoute.ai@example.com</li>
                        <li>GitHub: <a href="#" target="_blank">Coming Soon</a></li>
                        <li>Version: v1.0 Prototype</li>
                    </ul>
                </div>

            </div>

            {/* BOTTOM BAR */}
            <div className="sr-footer-bottom">
                © {new Date().getFullYear()} SafeRoute AI — Academic Project
            </div>
        </footer>
    );
};

export default Footer;
