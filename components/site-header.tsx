"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { travelSectionPublic } from "@/lib/site";

const links = [
  { href: "/story", label: "Story" },
  { href: "/lab", label: "Lab" },
  { href: "/notes", label: "Notes" },
  { href: "/travel", label: "Travel" },
] as const;

const visibleLinks = links.filter((link) => travelSectionPublic || link.href !== "/travel");

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
          {visibleLinks.map((link) => {
            const current = path === link.href || path.startsWith(`${link.href}/`);
            return (
              <Link key={link.href} href={link.href} aria-current={current ? "page" : undefined}>
                {link.label}
              </Link>
            );
          })}
          <Link className="hello" href="/hello" aria-current={path === "/hello" ? "page" : undefined}>
            Say hello
          </Link>
        </nav>
      </div>
    </header>
  );
}
