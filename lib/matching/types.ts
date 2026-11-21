export type MatchGuest = {
  id: string; // database id
  key: string; // short id shown to the model, e.g. "g12"
  name: string;
  role: string;
  interests: string[];
  lookingFor: string | null;
  askMeAbout: string | null;
};

export type ProposedHello = {
  matchId: string; // database id of the other guest
  reason: string;
  opener: string;
  source: "ai" | "fallback";
};

/** guest id -> up to three proposed hellos, in order */
export type Proposal = Map<string, ProposedHello[]>;

export const HELLOS_PER_GUEST = 3;
/** Nobody should be suggested to more than this many guests. */
export const MAX_TIMES_SUGGESTED = 5;
