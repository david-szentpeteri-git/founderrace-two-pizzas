export type JoinField =
  | "name"
  | "email"
  | "role"
  | "interests"
  | "lookingFor"
  | "askMeAbout"
  | "consent";

export type JoinValues = {
  name: string;
  email: string;
  role: string;
  interest1: string;
  interest2: string;
  interest3: string;
  lookingFor: string;
  askMeAbout: string;
  consent: boolean;
};

export type JoinState = {
  /** Bumped on every failed submit so the form remounts with the returned values. */
  attempt: number;
  errors: Partial<Record<JoinField | "form", string>>;
  values: JoinValues;
  /** Set when the submission was accepted without a guest link (honeypot path). */
  done?: boolean;
};

export const emptyJoinValues: JoinValues = {
  name: "",
  email: "",
  role: "",
  interest1: "",
  interest2: "",
  interest3: "",
  lookingFor: "",
  askMeAbout: "",
  consent: false,
};

export const initialJoinState: JoinState = { attempt: 0, errors: {}, values: emptyJoinValues };

export const JOIN_LIMITS = {
  name: 60,
  email: 254,
  role: 120,
  interest: 40,
  lookingFor: 200,
  askMeAbout: 120,
} as const;
