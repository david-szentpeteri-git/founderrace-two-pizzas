import { customAlphabet, nanoid } from "nanoid";

// No look-alike characters (0/O, 1/l/I) so join codes can be read aloud.
const slugAlphabet = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", 8);

/** Public join code for an event, e.g. "k7m2xq9d". */
export const newSlug = () => slugAlphabet();

/** Secret token for dashboard and guest links (21 chars, about 126 bits). */
export const newToken = () => nanoid(21);
