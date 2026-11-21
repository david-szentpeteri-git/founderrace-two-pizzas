"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Field, Input, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/organiser/client";
import { createEventAction, type CreateState } from "./actions";

const initial: CreateState = { errors: {}, values: {} };

function FieldError({ id, text }: { id: string; text?: string }) {
  return text ? (
    <p id={id} role="alert" className="text-sm font-medium text-red-700">
      {text}
    </p>
  ) : null;
}

/** aria props that tie a field to its error message. */
function invalid(id: string, text?: string) {
  return text ? { "aria-invalid": true as const, "aria-describedby": `${id}-error` } : {};
}

export function CreateEventForm() {
  const [state, action] = useActionState(createEventAction, initial);
  const [local, setLocal] = useState(state.values.startsAtLocal ?? "");
  const formRef = useRef<HTMLFormElement>(null);
  // datetime-local has no time zone, so convert in the browser, where the organiser's zone is known.
  const iso = local && !Number.isNaN(new Date(local).getTime()) ? new Date(local).toISOString() : "";

  // After a failed submit, move focus to the first field with an error.
  useEffect(() => {
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  const e = state.errors;

  return (
    <form ref={formRef} action={action} className="space-y-6" noValidate>
      {e.form ? (
        <p role="alert" className="rounded-2xl bg-red-50 p-4 text-base font-medium text-red-700">
          {e.form}
        </p>
      ) : null}

      <Field label="Event name" htmlFor="name">
        <Input
          id="name"
          name="name"
          required
          maxLength={120}
          autoComplete="off"
          defaultValue={state.values.name}
          placeholder="Winter social…"
          {...invalid("name", e.name)}
        />
        <FieldError id="name-error" text={e.name} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Date and time" htmlFor="startsAtLocal" hint="Optional">
          <Input
            id="startsAtLocal"
            name="startsAtLocal"
            type="datetime-local"
            value={local}
            onChange={(ev) => setLocal(ev.target.value)}
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
          <Input
            id="place"
            name="place"
            maxLength={160}
            autoComplete="off"
            defaultValue={state.values.place}
            placeholder="Student union, room 2…"
          />
        </Field>
      </div>

      <Field label="What is the event about?" htmlFor="description" hint="One or two sentences. It helps the intros fit the room.">
        <Textarea
          id="description"
          name="description"
          maxLength={600}
          autoComplete="off"
          defaultValue={state.values.description}
          placeholder="End of term mixer for members and new joiners. Mostly students, a few alumni…"
          {...invalid("description", e.description)}
        />
        <FieldError id="description-error" text={e.description} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" htmlFor="organiserName" hint="Guests see it on the sign-up page.">
          <Input
            id="organiserName"
            name="organiserName"
            required
            maxLength={80}
            autoComplete="name"
            defaultValue={state.values.organiserName}
            {...invalid("organiserName", e.organiserName)}
          />
          <FieldError id="organiserName-error" text={e.organiserName} />
        </Field>
        <Field label="Your email" htmlFor="organiserEmail" hint="Never shown to guests.">
          <Input
            id="organiserEmail"
            name="organiserEmail"
            type="email"
            inputMode="email"
            required
            maxLength={160}
            autoComplete="email"
            spellCheck={false}
            defaultValue={state.values.organiserEmail}
            {...invalid("organiserEmail", e.organiserEmail)}
          />
          <FieldError id="organiserEmail-error" text={e.organiserEmail} />
        </Field>
      </div>

      <div className="space-y-3">
        <SubmitButton pendingLabel="Creating your event…">Create event</SubmitButton>
        <p className="text-sm text-zinc-500">Free with up to 4 guests, then €1 a guest or €9 for 30 days. No account needed: you get a private link to manage it.</p>
      </div>
    </form>
  );
}
