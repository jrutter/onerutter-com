import Link from "next/link";

export default function NotFound() {
  return (
    <main id="content">
      <div className="wrap">
        <p className="kicker">404</p>
        <h1 className="title">That page isn&apos;t here.</h1>
        <p className="deck">The note may still be a draft, or the link is old.</p>
        <p className="hero-links">
          <Link href="/">→ Home</Link>
          <Link href="/notes">→ Notes</Link>
        </p>
      </div>
    </main>
  );
}
