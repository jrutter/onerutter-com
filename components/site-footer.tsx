import Link from "next/link";
import { profiles } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-identity">
          <p className="footer-name">Jake Rutter</p>
          <p className="footer-place">Barnes, London</p>
          <p className="footer-mail">
            <Link href="/hello">Say hello</Link>
          </p>
        </div>
        <ul className="footer-links">
          {profiles.map((profile) => (
            <li key={profile.href}>
              <a href={profile.href} rel="noopener noreferrer">
                {profile.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
