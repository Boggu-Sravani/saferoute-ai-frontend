// src/components/common/ScoreBadge.jsx
import "./ScoreBadge.css";

const ScoreBadge = ({ score, safety }) => {
  if (score === undefined || score === null || Number.isNaN(score)) return null;

  const value = Math.round(score);
  let cls = "sr-score-badge sr-score-moderate";

  if (value >= 70) cls = "sr-score-badge sr-score-safe";
  else if (value < 40) cls = "sr-score-badge sr-score-risky";

  const label = `AI safety score: ${value}/100 (${safety || "unknown"})`;

  return <span className={cls} title={label}>{value}</span>;
};

export default ScoreBadge;
