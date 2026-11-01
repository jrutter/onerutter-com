"use client";

import Link from "next/link";
import { useRef, type KeyboardEvent } from "react";

export function NoteFilters({ tags, active }: { tags: string[]; active?: string }) {
  const listRef = useRef<HTMLUListElement>(null);

  function onKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") {
      return;
    }
    const links = [...(listRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [])];
    const current = links.findIndex((link) => link === document.activeElement);
    if (current === -1 || links.length === 0) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? links.length - 1
          : event.key === "ArrowRight"
            ? (current + 1) % links.length
            : (current - 1 + links.length) % links.length;
    links[next]?.focus();
  }

  return (
    <nav className="note-filters" aria-label="Filter notes by tag">
      <ul ref={listRef} onKeyDown={onKeyDown}>
        <li>
          <Link href="/notes" aria-current={active ? undefined : "true"}>
            All
          </Link>
        </li>
        {tags.map((tag) => (
          <li key={tag}>
            <Link
              href={active === tag ? "/notes" : `/notes?tag=${encodeURIComponent(tag)}`}
              aria-current={active === tag ? "true" : undefined}
            >
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
