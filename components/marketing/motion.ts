import "./motion.css";

// Class names for motion.css (plain CSS: this project treats every .css file as global).
const m = {
  answersIn: "thm-answers-in",
  cardIn: "thm-card-in",
  drift: "thm-drift",
  driftSlow: "thm-drift-slow",
  glow: "thm-glow",
  in: "thm-in",
  inStagger: "thm-in-stagger",
  markerDraw: "thm-marker-draw",
  num: "thm-num",
  pending: "thm-pending",
  pendingStagger: "thm-pending-stagger",
  phoneIn: "thm-phone-in",
  pillPop: "thm-pill-pop",
} as const;

export default m;
