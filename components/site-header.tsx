"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/story", label: "Story" },
  { href: "/lab", label: "Lab" },
  { href: "/notes", label: "Notes" },
] as const;

export function SiteHeader() {
  const path = usePathname();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="wordmark" href="/">
          <i aria-hidden="true" />
          Jake Rutter
        </Link>
        <nav className="nav" aria-label="Primary">
          {links.map((link) => {
            const current = path === link.href || path.startsWith(`${link.href}/`);
            return (
              <Link key={link.href} href={link.href} aria-current={current ? "page" : undefined}>
                {link.label}
              </Link>
            );
          })}
          <a className="hello" href="mailto:jake@onerutter.com">
            Say hello
          </a>
        </nav>
      </div>
    </header>
  );
}
