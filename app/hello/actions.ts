"use server";

import { contactConfig, validateContact, type HelloFormState } from "@/lib/contact";

const notReady = "I can't send notes from here yet. Please try again later.";
const sendFailed = "That didn't send. Please try again in a moment.";

export async function sendHello(_prev: HelloFormState, formData: FormData): Promise<HelloFormState> {
  try {
    const trap = String(formData.get("hp_field") ?? "").trim();
    if (trap) return { status: "success" };

    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const message = String(formData.get("message") ?? "");
    const fieldErrors = validateContact({ name, email, message });

    if (Object.keys(fieldErrors).length > 0) {
      return {
        status: "error",
        message: "Check the fields below and try again.",
        fieldErrors,
      };
    }

    const config = contactConfig();
    if (!config) return { status: "error", message: notReady };

    const cleanName = name.trim().replace(/[\r\n]+/g, " ");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        reply_to: email.trim(),
        subject: `Say hello from ${cleanName}`.slice(0, 200),
        text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
      }),
    });

    if (!response.ok) {
      console.error("Contact form send failed", response.status);
      return { status: "error", message: sendFailed };
    }

    return { status: "success" };
  } catch {
    console.error("Contact form send failed");
    return { status: "error", message: sendFailed };
  }
}
