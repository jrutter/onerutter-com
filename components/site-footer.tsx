import { profiles } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-name">Jake Rutter</p>
        <p className="footer-place">Barnes, London</p>
        <p className="footer-mail">
          <a href="mailto:jake@onerutter.com">jake@onerutter.com</a>
        </p>
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
