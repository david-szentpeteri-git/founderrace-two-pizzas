"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createEvent } from "@/lib/data";
import { hasDatabase } from "@/lib/db";

export type CreateState = {
  errors: Partial<Record<"name" | "startsAt" | "description" | "organiserName" | "organiserEmail" | "form", string>>;
  values: Record<string, string>;
};

const schema = z.object({
  name: z.string().trim().min(1, "Give your event a name.").max(120, "Please keep the name under 120 characters."),
  startsAt: z.string().trim(),
  place: z.string().trim().max(160),
  description: z.string().trim().max(600, "Please keep the description under 600 characters."),
  organiserName: z.string().trim().min(1, "Add your name, guests will see it.").max(80),
  organiserEmail: z.email("That email doesn't look right.").max(160),
});

function field(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

export async function createEventAction(_prev: CreateState, formData: FormData): Promise<CreateState> {
  const values = {
    name: field(formData, "name"),
    startsAt: field(formData, "startsAtIso"),
    startsAtLocal: field(formData, "startsAtLocal"),
    place: field(formData, "place"),
    description: field(formData, "description"),
    organiserName: field(formData, "organiserName"),
    organiserEmail: field(formData, "organiserEmail").trim(),
  };

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const errors: CreateState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof CreateState["errors"];
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return { errors, values };
  }

  const startsAt = parsed.data.startsAt && !Number.isNaN(Date.parse(parsed.data.startsAt)) ? parsed.data.startsAt : null;

  if (!hasDatabase()) {
    return { errors: { form: "Event creation is not connected yet. Please try again in a few minutes." }, values };
  }

  let adminToken: string;
  try {
    ({ adminToken } = await createEvent({
      name: parsed.data.name,
      startsAt,
      place: parsed.data.place || null,
      description: parsed.data.description || null,
      organiserName: parsed.data.organiserName,
      organiserEmail: parsed.data.organiserEmail,
    }));
  } catch (error) {
    console.error("createEvent failed", error);
    return { errors: { form: "We couldn't create your event just now. Please try again in a moment." }, values };
  }

  redirect(`/o/${adminToken}?new=1`);
}
