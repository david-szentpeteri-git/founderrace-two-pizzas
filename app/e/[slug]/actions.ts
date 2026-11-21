"use server";

import { redirect } from "next/navigation";
import { joinEvent } from "./source";
import type { JoinInput } from "@/lib/types";
import { JOIN_LIMITS, type JoinState, type JoinValues } from "@/components/guest/joinState";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

export async function joinAction(prev: JoinState, formData: FormData): Promise<JoinState> {
  const slug = text(formData, "slug");

  const values: JoinValues = {
    name: text(formData, "name"),
    email: text(formData, "email"),
    role: text(formData, "role"),
    interest1: text(formData, "interest1"),
    interest2: text(formData, "interest2"),
    interest3: text(formData, "interest3"),
    lookingFor: text(formData, "lookingFor"),
    askMeAbout: text(formData, "askMeAbout"),
    consent: formData.get("consent") === "yes",
  };

  // Honeypot: bots fill every field. Pretend it worked and store nothing.
  if (text(formData, "website") !== "") {
    return { attempt: prev.attempt + 1, errors: {}, values, done: true };
  }

  const errors: JoinState["errors"] = {};
  const L = JOIN_LIMITS;

  if (!values.name) errors.name = "Please add your name.";
  else if (values.name.length > L.name) errors.name = `Please keep it under ${L.name} characters.`;

  if (values.email) {
    if (values.email.length > L.email || !EMAIL_RE.test(values.email))
      errors.email = "That email doesn’t look right. You can also leave it empty.";
  }

  if (!values.role) errors.role = "Tell people what you do, in a few words.";
  else if (values.role.length > L.role) errors.role = `Please keep it under ${L.role} characters.`;

  const interests = [values.interest1, values.interest2, values.interest3].filter(Boolean);
  const uniqueInterests = Array.from(new Set(interests.map((i) => i.toLowerCase()))).map(
    (lower) => interests.find((i) => i.toLowerCase() === lower)!,
  );
  if (uniqueInterests.length === 0) errors.interests = "Add at least one interest.";
  else if (uniqueInterests.some((i) => i.length > L.interest))
    errors.interests = `Keep each interest under ${L.interest} characters.`;

  if (values.lookingFor.length > L.lookingFor)
    errors.lookingFor = `Please keep it under ${L.lookingFor} characters.`;
  if (values.askMeAbout.length > L.askMeAbout)
    errors.askMeAbout = `Please keep it under ${L.askMeAbout} characters.`;

  if (!values.consent) errors.consent = "Please tick this box so we can share your answers.";

  if (!slug) errors.form = "This event link is incomplete. Please scan the code again.";

  if (Object.keys(errors).length > 0) {
    return { attempt: prev.attempt + 1, errors, values };
  }

  const input: JoinInput = {
    name: values.name,
    role: values.role,
    interests: uniqueInterests,
    consent: true,
    ...(values.email ? { email: values.email } : {}),
    ...(values.lookingFor ? { lookingFor: values.lookingFor } : {}),
    ...(values.askMeAbout ? { askMeAbout: values.askMeAbout } : {}),
  };

  let guestToken: string;
  try {
    ({ guestToken } = await joinEvent(slug, input));
  } catch {
    return {
      attempt: prev.attempt + 1,
      errors: { form: "We couldn’t save your answers just now. Please try again in a moment." },
      values,
    };
  }

  // redirect() throws on purpose, so it stays outside the try block.
  redirect(`/g/${encodeURIComponent(guestToken)}`);
}
