"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { TripPhoto } from "@/lib/trip-types";

type Frame =
  | { kind: "feature" | "offset-left" | "offset-right"; index: number }
  | { kind: "pair"; indexes: [number, number] };

function framesFor(count: number): Frame[] {
  const frames: Frame[] = [{ kind: "feature", index: 0 }];
  let index = 1;
  let pairNext = true;
  while (index < count) {
    if (pairNext && index + 1 < count) {
      frames.push({ kind: "pair", indexes: [index, index + 1] });
      index += 2;
    } else {
      frames.push({ kind: index % 2 === 0 ? "offset-right" : "offset-left", index });
      index += 1;
    }
    pairNext = !pairNext;
  }
  return frames;
}

function sizesFor(kind: Frame["kind"]) {
  if (kind === "feature") return "(max-width: 760px) calc(100vw - 40px), 1120px";
  if (kind === "pair") return "(max-width: 760px) calc(100vw - 40px), 540px";
  return "(max-width: 760px) calc(100vw - 40px), 780px";
}

export function TripGallery({ photos, startAt = null }: { photos: TripPhoto[]; startAt?: number | null }) {
  const [active, setActive] = useState<number | null>(startAt);
  const triggers = useRef<Array<HTMLButtonElement | null>>([]);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const skipFocusRestore = useRef(true);
  const frames = framesFor(photos.length);

  useEffect(() => {
    if (startAt == null) return;
    const node = triggers.current[startAt];
    restoreFocus.current = node;
    node?.scrollIntoView({ block: "center" });
  }, [startAt]);

  useEffect(() => {
    if (skipFocusRestore.current) {
      skipFocusRestore.current = false;
      return;
    }
    if (active == null) restoreFocus.current?.focus();
  }, [active]);

  function open(index: number) {
    restoreFocus.current = triggers.current[index];
    setActive(index);
  }

  return (
    <>
      <div className={photos.length === 3 ? "trip-essay trip-essay-three" : "trip-essay"}>
        {frames.map((frame) => {
          if (frame.kind === "pair") {
            return (
              <div className="trip-pair" key={frame.indexes.join("-")}>
                {frame.indexes.map((index) => (
                  <PhotoFrame
                    key={photos[index].src}
                    photo={photos[index]}
                    index={index}
                    kind="pair"
                    preload={index === 0}
                    buttonRef={(node) => {
                      triggers.current[index] = node;
                    }}
                    onOpen={open}
                  />
                ))}
              </div>
            );
          }

          return (
            <PhotoFrame
              key={photos[frame.index].src}
              photo={photos[frame.index]}
              index={frame.index}
              kind={frame.kind}
              preload={frame.index === 0}
              buttonRef={(node) => {
                triggers.current[frame.index] = node;
              }}
              onOpen={open}
            />
          );
        })}
      </div>
      {active != null ? (
        <Lightbox
          photos={photos}
          index={active}
          onIndex={setActive}
          onClose={() => setActive(null)}
        />
      ) : null}
    </>
  );
}

function PhotoFrame({
  photo,
  index,
  kind,
  preload,
  buttonRef,
  onOpen,
}: {
  photo: TripPhoto;
  index: number;
  kind: Frame["kind"];
  preload: boolean;
  buttonRef: (node: HTMLButtonElement | null) => void;
  onOpen: (index: number) => void;
}) {
  return (
    <figure id={`photo-${index + 1}`} className={`trip-figure trip-figure-${kind}`}>
      <button ref={buttonRef} type="button" className="trip-shot" onClick={() => onOpen(index)}>
        <span className="vh">Enlarge</span>
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes={sizesFor(kind)}
          placeholder="blur"
          blurDataURL={photo.blurDataURL}
          preload={preload}
          style={{ width: "100%", height: "auto" }}
        />
      </button>
      {photo.caption ? <figcaption className="trip-caption">{photo.caption}</figcaption> : null}
    </figure>
  );
}

function Lightbox({
  photos,
  index,
  onIndex,
  onClose,
}: {
  photos: TripPhoto[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const photo = photos[index];
  const swipe = useRef<{ x: number; y: number; id: number } | null>(null);
  const swiped = useRef(false);
  const opened = useRef(false);
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  function show(next: number) {
    if (next < 0 || next >= photos.length) return;
    onIndex(next);
  }

  useEffect(() => {
    const header = document.querySelector(".site-header");
    const footer = document.querySelector(".site-footer");
    const content = document.getElementById("content");
    const skip = document.querySelector(".skip");
    const locked = [header, footer, content, skip];
    for (const node of locked) node?.setAttribute("inert", "");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      for (const node of locked) node?.removeAttribute("inert");
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (!opened.current) closeRef.current?.focus();
    opened.current = true;
  }, [index, isClient]);

  useEffect(() => {
    const activeEl = document.activeElement;
    if (activeEl instanceof HTMLButtonElement && activeEl.disabled) closeRef.current?.focus();
  }, [index]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (index + 1 < photos.length) onIndex(index + 1);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (index > 0) onIndex(index - 1);
        return;
      }
      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const items = [...dialog.querySelectorAll<HTMLElement>("button:not(:disabled)")];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, onClose, onIndex, photos.length]);

  if (!isClient) return null;

  return createPortal(
    <div
      ref={dialogRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <p id={titleId} className="vh" aria-live="polite">
        {photo.alt}
        {photo.caption ? `. ${photo.caption}` : ""}. Photograph {index + 1} of {photos.length}.
      </p>
      <div className="lightbox-bar">
        <p className="lightbox-count">
          {index + 1} <span aria-hidden="true">/</span> {photos.length}
        </p>
        <button ref={closeRef} type="button" onClick={onClose}>
          Close
        </button>
      </div>
      <div
        className="lightbox-stage"
        onPointerDown={(event) => {
          if (event.target instanceof Element && event.target.closest("button")) return;
          swipe.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          const start = swipe.current;
          swipe.current = null;
          if (!start || start.id !== event.pointerId) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
          swiped.current = true;
          show(dx < 0 ? index + 1 : index - 1);
        }}
        onClickCapture={(event) => {
          if (!swiped.current) return;
          event.preventDefault();
          event.stopPropagation();
          swiped.current = false;
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div className="lightbox-frame">
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="100vw"
            placeholder="blur"
            blurDataURL={photo.blurDataURL}
            loading="eager"
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
      <div className="lightbox-foot">
        {photo.caption ? <p className="lightbox-caption">{photo.caption}</p> : <div className="lightbox-caption" />}
        <div className="lightbox-moves">
          <button type="button" onClick={() => show(index - 1)} disabled={index === 0}>
            Previous
          </button>
          <button type="button" onClick={() => show(index + 1)} disabled={index === photos.length - 1}>
            Next
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
