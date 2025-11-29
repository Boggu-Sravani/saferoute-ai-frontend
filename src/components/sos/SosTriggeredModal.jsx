import "./SosTriggeredModal.css";

const SosTriggeredModal = ({ onClose }) => {
    return (
        <div className="sr-sos-overlay">
            <div className="sr-sos-modal">
                <div className="sr-sos-icon">🔴</div>
                <h2 className="sr-sos-title">SOS Triggered!</h2>

                <p className="sr-sos-text">
                    Your emergency alert has been sent successfully.
                </p>

                <ul className="sr-sos-list">
                    <li>📍 Location shared</li>
                    <li>📡 Trusted contacts notified</li>
                    <li>🛡️ Admin safety dashboard updated</li>
                    <li>✉️ Email alerts sent</li>
                </ul>

                <button className="sr-sos-btn" onClick={onClose}>
                    OKAY
                </button>
            </div>
        </div>
    );
};

export default SosTriggeredModal;
