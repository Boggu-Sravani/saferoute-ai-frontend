import { Link } from "react-router-dom";
import "./AccessDenied.css";

const AccessDenied = () => {
    return (
        <main className="sr-denied">
            <div className="sr-denied-card">
                <h1>Access denied</h1>
                <p>
                    You don&apos;t have permission to view this page. This area is
                    restricted to SafeRoute admin users only.
                </p>
                <div className="sr-denied-actions">
                    <Link to="/dashboard" className="sr-denied-btn">
                        Go to dashboard
                    </Link>
                    <Link to="/" className="sr-denied-link">
                        Back to home
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default AccessDenied;
