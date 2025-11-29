// src/components/common/AIReasonTooltip.jsx
import "./AIReasonTooltip.css";

const buildExplanation = (safety, score) => {
    const rounded = score !== undefined && score !== null ? Math.round(score) : null;

    if (safety === "safe") {
        return `This route is classified as SAFE by SafeRoute AI. The model found fewer nearby high-risk zones, more positive feedback and lower recent SOS activity. Score ≈ ${rounded}/100.`;
    }
    if (safety === "moderate") {
        return `This route is MODERATE. It may pass near some risk zones or mixed feedback at certain segments, especially at night. Score ≈ ${rounded}/100.`;
    }
    if (safety === "risky") {
        return `This route is RISKY. SafeRoute AI detected multiple risk indicators such as high-risk zones, negative feedback or nearby SOS alerts. Score ≈ ${rounded}/100.`;
    }
    return `Score is computed by SafeRoute AI using XGBoost on factors like risk zones, user feedback, SOS alerts and time of day.`;
};

const AIReasonTooltip = ({ safety, score }) => {
    const text = buildExplanation(safety, score);

    return (
        <span className="sr-ai-tooltip">
            <span className="sr-ai-icon">AI</span>
            <span className="sr-ai-tooltip-content">{text}</span>
        </span>
    );
};

export default AIReasonTooltip;
