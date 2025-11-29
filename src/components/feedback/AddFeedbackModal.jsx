import "./AddFeedbackModal.css";
import { useState, useMemo } from "react";

const AddFeedbackModal = ({ onClose, onSubmit, lat, lng }) => {
    const [locationName, setLocationName] = useState("");
    const [rating, setRating] = useState("okay");
    const [comment, setComment] = useState("");

    // Rounded coordinates for display only
    const coordLabel = useMemo(() => {
        if (typeof lat !== "number" || typeof lng !== "number") return "";
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }, [lat, lng]);

    const submitHandler = (e) => {
        e.preventDefault();

        if (!locationName || !rating) {
            alert("Please fill all required fields.");
            return;
        }

        onSubmit({ lat, lng, locationName, rating, comment });
    };

    return (
        <div className="fb-modal-backdrop">
            <div className="fb-modal-card">
                <div className="fb-modal-header">
                    <h2>Mark safety for this spot</h2>
                    <p className="fb-sub">
                        You’re helping others choose safer paths by sharing what you
                        observed at this location.
                    </p>

                    {coordLabel && (
                        <div className="fb-coords-pill">
                            Approx. location: <span>{coordLabel}</span>
                        </div>
                    )}
                </div>

                <form onSubmit={submitHandler} className="fb-form">
                    {/* Location name */}
                    <div className="fb-field">
                        <label>
                            Location name <span className="fb-req">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Ex: Dark lane near hostel gate"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Rating */}
                    <div className="fb-field">
                        <label>
                            How safe did it feel? <span className="fb-req">*</span>
                        </label>

                        <div className="fb-rating-row">
                            <button
                                type="button"
                                className={`fb-rating-chip ${rating === "very_safe" ? "active" : ""
                                    }`}
                                onClick={() => setRating("very_safe")}
                            >
                                😊 Very safe
                            </button>
                            <button
                                type="button"
                                className={`fb-rating-chip ${rating === "okay" ? "active" : ""
                                    }`}
                                onClick={() => setRating("okay")}
                            >
                                🙂 Okay
                            </button>
                            <button
                                type="button"
                                className={`fb-rating-chip ${rating === "risky" ? "active" : ""
                                    }`}
                                onClick={() => setRating("risky")}
                            >
                                ⚠️ Risky
                            </button>
                            <button
                                type="button"
                                className={`fb-rating-chip ${rating === "avoid" ? "active" : ""
                                    }`}
                                onClick={() => setRating("avoid")}
                            >
                                🚫 Avoid
                            </button>
                        </div>

                        {/* Hidden select just to keep required validation & compatibility (optional) */}
                        <select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            style={{ display: "none" }}
                            required
                        >
                            <option value="very_safe">Very safe</option>
                            <option value="okay">Okay</option>
                            <option value="risky">Risky</option>
                            <option value="avoid">Avoid</option>
                        </select>
                    </div>

                    {/* Comment */}
                    <div className="fb-field">
                        <label>Short note (optional)</label>
                        <textarea
                            placeholder="Ex: Street is very dark after 9 PM, very few people around."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Footer / hint */}
                    <p className="fb-privacy-note">
                        Please avoid sharing personal details. This feedback is used only
                        to improve route safety scores.
                    </p>

                    {/* Actions */}
                    <div className="fb-actions">
                        <button
                            type="button"
                            className="fb-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="fb-submit">
                            Submit feedback
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFeedbackModal;
