"use client";

import { startTransition, useActionState, useEffect, useRef, type FormEvent } from "react";
import Link from "next/link";
import { sendHello } from "@/app/hello/actions";
import { helloInitialState, type ContactFields } from "@/lib/contact";

const fields: { name: keyof ContactFields; label: string; type: "text" | "email"; autoComplete: string }[] = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
];

export function ContactForm() {
  const [state, action, pending] = useActionState(sendHello, helloInitialState);
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      statusRef.current?.focus();
      return;
    }
    if (state.status !== "error" || !state.fieldErrors) return;
    const first = fields
      .map((field) => field.name)
      .concat("message")
      .find((name) => state.fieldErrors?.[name as keyof ContactFields]);
    if (!first) return;
    formRef.current?.querySelector<HTMLElement>(`#${first}`)?.focus();
  }, [state]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => {
      action(data);
    });
  }

  if (state.status === "success") {
    return (
      <div className="form-success" role="status" tabIndex={-1} ref={statusRef}>
        <p className="kicker">Sent</p>
        <p>Thanks. Your note is on its way.</p>
        <p className="more">
          <Link className="text-link" href="/">
            Back home →
          </Link>
        </p>
      </div>
    );
  }

  const formError = state.status === "error" && !state.fieldErrors ? state.message : undefined;
  const summary = state.status === "error" && state.fieldErrors ? state.message : undefined;

  return (
    <form ref={formRef} className="hello-form" onSubmit={onSubmit} noValidate aria-busy={pending}>
      {summary ? (
        <p className="form-alert" role="alert">
          {summary}
        </p>
      ) : null}
      {formError ? (
        <p className="form-alert" role="alert">
          {formError}
        </p>
      ) : null}

      {fields.map((field) => {
        const error = state.fieldErrors?.[field.name];
        const errorId = `${field.name}-error`;
        return (
          <div className="field" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              required
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              maxLength={field.name === "name" ? 80 : 254}
            />
            {error ? (
              <p className="field-error" id={errorId}>
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={5000}
          aria-invalid={state.fieldErrors?.message ? true : undefined}
          aria-describedby={state.fieldErrors?.message ? "message-error" : undefined}
        />
        {state.fieldErrors?.message ? (
          <p className="field-error" id="message-error">
            {state.fieldErrors.message}
          </p>
        ) : null}
      </div>

      <div className="company-field" aria-hidden="true">
        <label htmlFor="hp_field">Leave this blank</label>
        <input id="hp_field" name="hp_field" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
