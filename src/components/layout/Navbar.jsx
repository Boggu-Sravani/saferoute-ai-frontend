// src/components/layout/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";
import SafeRouteLogo from "../../assets/images/safeRoute-ai.png";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isAuthPage =
        location.pathname.startsWith("/login") ||
        location.pathname.startsWith("/register");

    const handleLogoClick = () => {
        navigate("/");
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isDashboard = location.pathname.startsWith("/dashboard");
    const isAdmin = location.pathname.startsWith("/admin");
    const isContacts = location.pathname.startsWith("/trusted-contacts");

    return (
        <header className="sr-navbar">
            <div className="sr-navbar-left" onClick={handleLogoClick}>
                {/* Logo image */}
                <img
                    src={SafeRouteLogo}
                    alt="SafeRoute AI"
                    className="sr-nav-logo-img"
                />

                {/* Brand text */}
                <div>
                    <div className="sr-logo-text">SafeRoute AI</div>
                    <div className="sr-logo-sub">Safety-aware navigation</div>
                </div>
            </div>

            <nav className="sr-navbar-right">
                <Link to="/" className="sr-nav-link">
                    Home
                </Link>

                {/* User links */}
                {user && (
                    <>
                        <Link
                            to="/dashboard"
                            className={`sr-nav-link ${isDashboard ? "active" : ""}`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/trusted-contacts"
                            className={`sr-nav-link ${isContacts ? "active" : ""}`}
                        >
                            Contacts
                        </Link>
                    </>
                )}

                {/* Admin link */}
                {user && user.role === "admin" && (
                    <Link
                        to="/admin"
                        className={`sr-nav-link ${isAdmin ? "active" : ""}`}
                    >
                        Admin
                    </Link>


                )}

                {/* Auth buttons (when logged out and not on login/register) */}
                {!user && !isAuthPage && (
                    <>
                        <Link to="/login" className="sr-nav-btn sr-nav-btn-outline">
                            Log in
                        </Link>
                        <Link to="/register" className="sr-nav-btn sr-nav-btn-primary">
                            Get Started
                        </Link>
                    </>
                )}

                {/* User chip + logout */}
                {user && (
                    <div className="sr-nav-user-area">
                        <div className="sr-nav-user-chip">
                            <span className="sr-nav-user-avatar">
                                {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                            <div className="sr-nav-user-meta">
                                <span className="sr-nav-user-name">
                                    {user.name || "User"}
                                </span>
                                <span className="sr-nav-user-role">
                                    {user.role === "admin" ? "Admin" : "User"}
                                </span>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="sr-nav-btn sr-nav-btn-outline"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
