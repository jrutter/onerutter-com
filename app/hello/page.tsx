import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Say hello",
  description: "Send Jake Rutter a note.",
  alternates: { canonical: "/hello" },
  openGraph: {
    url: "https://onerutter.com/hello",
    title: "Say hello — Jake Rutter",
    description: "Send Jake Rutter a note.",
  },
};

export default function HelloPage() {
  return (
    <main id="content">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">Contact</p>
          <h1 className="title">Say hello</h1>
          <p className="deck">A name, an email, and a note.</p>
        </header>
        <ContactForm />
      </div>
    </main>
  );
}
