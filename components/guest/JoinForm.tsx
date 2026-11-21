"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Marker } from "./Marker";
import { initialJoinState, JOIN_LIMITS, type JoinState } from "./joinState";

type JoinAction = (prev: JoinState, formData: FormData) => Promise<JoinState>;

const inputClass =
  "mt-2 block w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 aria-[invalid=true]:border-red-500";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm font-medium text-red-600">
      {message}
    </p>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex min-h-14 w-full items-center justify-center rounded-full bg-zinc-900 px-6 text-lg font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving your answers…" : "Join and get my three hellos"}
    </button>
  );
}

export function JoinForm({ slug, action }: { slug: string; action: JoinAction }) {
  const [state, formAction] = useActionState(action, initialJoinState);
  const { errors, values } = state;

  if (state.done) {
    return (
      <div className="rounded-3xl bg-zinc-50 p-6 ring-1 ring-zinc-200">
        <h2 className="font-display text-2xl font-semibold tracking-tight">You’re in.</h2>
        <p className="mt-2 text-lg text-zinc-500">Thanks for joining. See you at the event.</p>
      </div>
    );
  }

  return (
    <form key={state.attempt} action={formAction} noValidate className="space-y-8">
      <input type="hidden" name="slug" value={slug} />

      {/* Honeypot: hidden from people, tempting for bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {errors.form && (
        <p role="alert" className="rounded-2xl bg-red-50 p-4 text-base font-medium text-red-700">
          {errors.form}
        </p>
      )}

      <div>
        <label htmlFor="name" className="text-base font-medium">
          Your name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={JOIN_LIMITS.name}
          defaultValue={values.name}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={inputClass}
        />
        <FieldError id="name-error" message={errors.name} />
      </div>

      <div>
        <label htmlFor="email" className="text-base font-medium">
          Email <span className="font-normal text-zinc-500">(optional)</span>
        </label>
        <p className="mt-1 text-sm text-zinc-500">Only used to send you your link.</p>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={JOIN_LIMITS.email}
          defaultValue={values.email}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={inputClass}
        />
        <FieldError id="email-error" message={errors.email} />
      </div>

      <div>
        <label htmlFor="role" className="text-base font-medium">
          What do you do?
        </label>
        <input
          id="role"
          name="role"
          type="text"
          required
          maxLength={JOIN_LIMITS.role}
          placeholder="Second year law student, product designer…"
          defaultValue={values.role}
          aria-invalid={!!errors.role}
          aria-describedby={errors.role ? "role-error" : undefined}
          className={inputClass}
        />
        <FieldError id="role-error" message={errors.role} />
      </div>

      <fieldset aria-describedby={errors.interests ? "interests-error" : undefined}>
        <legend className="text-base font-medium">Three things you’re into</legend>
        <p className="mt-1 text-sm text-zinc-500">At least one. A word or two each.</p>
        {(["interest1", "interest2", "interest3"] as const).map((key, i) => (
          <input
            key={key}
            name={key}
            type="text"
            maxLength={JOIN_LIMITS.interest}
            aria-label={`Interest ${i + 1}`}
            placeholder={["Climbing", "Jazz", "Startups"][i]}
            defaultValue={values[key]}
            aria-invalid={!!errors.interests && i === 0}
            className={inputClass}
          />
        ))}
        <FieldError id="interests-error" message={errors.interests} />
      </fieldset>

      <div>
        <label htmlFor="lookingFor" className="text-base font-medium">
          Who would you love to meet? <span className="font-normal text-zinc-500">(optional)</span>
        </label>
        <textarea
          id="lookingFor"
          name="lookingFor"
          rows={2}
          maxLength={JOIN_LIMITS.lookingFor}
          placeholder="Someone who has started a company, a fellow runner…"
          defaultValue={values.lookingFor}
          aria-invalid={!!errors.lookingFor}
          aria-describedby={errors.lookingFor ? "lookingFor-error" : undefined}
          className={inputClass}
        />
        <FieldError id="lookingFor-error" message={errors.lookingFor} />
      </div>

      <div>
        <label htmlFor="askMeAbout" className="text-base font-medium">
          Ask me about <span className="font-normal text-zinc-500">(optional)</span>
        </label>
        <input
          id="askMeAbout"
          name="askMeAbout"
          type="text"
          maxLength={JOIN_LIMITS.askMeAbout}
          placeholder="My year in Japan"
          defaultValue={values.askMeAbout}
          aria-invalid={!!errors.askMeAbout}
          aria-describedby={errors.askMeAbout ? "askMeAbout-error" : undefined}
          className={inputClass}
        />
        <FieldError id="askMeAbout-error" message={errors.askMeAbout} />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-zinc-200 p-4">
          <input
            name="consent"
            type="checkbox"
            value="yes"
            required
            defaultChecked={values.consent}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-0.5 size-6 shrink-0 accent-zinc-900"
          />
          <span className="text-base leading-snug">
            Your answers are shared with other guests of this event and used to suggest introductions
          </span>
        </label>
        <FieldError id="consent-error" message={errors.consent} />
      </div>

      <div className="space-y-3">
        <SubmitButton />
        <p className="text-center text-sm text-zinc-500">
          Takes a minute. Next comes your guest page, where your <Marker>three hellos</Marker> appear when
          the doors open.
        </p>
      </div>
    </form>
  );
}
