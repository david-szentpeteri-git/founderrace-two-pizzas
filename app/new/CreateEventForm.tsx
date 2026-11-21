"use client";

import { useActionState, useState } from "react";
import { Field, Input, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/organiser/client";
import { createEventAction, type CreateState } from "./actions";

const initial: CreateState = { errors: {}, values: {} };

function FieldError({ text }: { text?: string }) {
  return text ? <p className="text-sm font-medium text-red-600">{text}</p> : null;
}

export function CreateEventForm() {
  const [state, action] = useActionState(createEventAction, initial);
  const [local, setLocal] = useState(state.values.startsAtLocal ?? "");
  // datetime-local has no time zone, so convert in the browser, where the organiser's zone is known.
  const iso = local && !Number.isNaN(new Date(local).getTime()) ? new Date(local).toISOString() : "";

  return (
    <form action={action} className="space-y-6">
      {state.errors.form ? (
        <p className="rounded-2xl bg-red-50 p-4 text-base font-medium text-red-700">{state.errors.form}</p>
      ) : null}

      <Field label="Event name" htmlFor="name">
        <Input id="name" name="name" required maxLength={120} defaultValue={state.values.name} placeholder="Winter social" />
        <FieldError text={state.errors.name} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Date and time" htmlFor="startsAtLocal" hint="Optional">
          <Input
            id="startsAtLocal"
            name="startsAtLocal"
            type="datetime-local"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
          />
          <input type="hidden" name="startsAtIso" value={iso} />
          {/* Filled in the browser after mount, where the organiser's time zone is known. */}
          <input
            type="hidden"
            name="timeZone"
            defaultValue=""
            ref={(el) => {
              if (el && !el.value) el.value = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
            }}
          />
        </Field>
        <Field label="Place" htmlFor="place" hint="Optional">
          <Input id="place" name="place" maxLength={160} defaultValue={state.values.place} placeholder="Student union, room 2" />
        </Field>
      </div>

      <Field
        label="What is the event about?"
        htmlFor="description"
        hint="One or two sentences. It helps the intros fit the room."
      >
        <Textarea
          id="description"
          name="description"
          maxLength={600}
          defaultValue={state.values.description}
          placeholder="End of term mixer for members and new joiners. Mostly students, a few alumni."
        />
        <FieldError text={state.errors.description} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" htmlFor="organiserName" hint="Guests see it on the sign-up page.">
          <Input id="organiserName" name="organiserName" required maxLength={80} defaultValue={state.values.organiserName} />
          <FieldError text={state.errors.organiserName} />
        </Field>
        <Field label="Your email" htmlFor="organiserEmail" hint="Never shown to guests.">
          <Input
            id="organiserEmail"
            name="organiserEmail"
            type="email"
            required
            maxLength={160}
            defaultValue={state.values.organiserEmail}
          />
          <FieldError text={state.errors.organiserEmail} />
        </Field>
      </div>

      <div className="space-y-3">
        <SubmitButton pendingLabel="Creating your event...">Create event</SubmitButton>
        <p className="text-sm text-zinc-500">Free up to 15 guests. No account needed: you get a private link to manage it.</p>
      </div>
    </form>
  );
}
