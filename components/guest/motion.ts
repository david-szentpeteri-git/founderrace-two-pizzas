import "./motion.css";

// Class names for motion.css (plain CSS: this project treats every .css file as global).
const m = {
  breathe: "thg-breathe",
  enter: "thg-enter",
  enterLate: "thg-enter-late",
  hello: "thg-hello",
  land: "thg-land",
} as const;

export default m;
