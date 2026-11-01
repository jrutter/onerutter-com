export type ContactFields = {
  name: string;
  email: string;
  message: string;
};

export type ContactFieldErrors = Partial<Record<keyof ContactFields, string>>;

export type HelloFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: ContactFieldErrors;
};

export const helloInitialState: HelloFormState = { status: "idle" };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(input: ContactFields): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (!name) errors.name = "Please add your name.";
  else if (name.length > 80) errors.name = "That name is a bit long. Shorten it and try again.";

  if (!email) errors.email = "Please add your email.";
  else if (email.length > 254 || !emailPattern.test(email)) {
    errors.email = "That email doesn't look quite right.";
  }

  if (!message) errors.message = "Please write a message.";
  else if (message.length > 5000) errors.message = "That message is a bit long. Shorten it and try again.";

  return errors;
}

/** Accepts `name@domain` or `Name <name@domain>` so the sender string can stay in env. */
export function isMailAddress(value: string | undefined): value is string {
  if (!value?.trim()) return false;
  const trimmed = value.trim();
  const wrapped = trimmed.match(/^[^<>]*<([^<>]+)>$/);
  const email = (wrapped ? wrapped[1] : trimmed).trim();
  return email.length <= 254 && emailPattern.test(email);
}

export function contactConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();

  if (!apiKey || !isMailAddress(to) || !isMailAddress(from)) return null;
  return { apiKey, to, from };
}
