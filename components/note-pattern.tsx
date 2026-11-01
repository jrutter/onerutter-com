const palettes = [
  { bg: "#0A1045", a: "#00C2D1", b: "#F9E900", c: "#F6AF65" },
  { bg: "#1E4A42", a: "#F6E2C4", b: "#C45C32", c: "#FBF7F1" },
  { bg: "#F9E900", a: "#0A1045", b: "#ED33B9", c: "#00C2D1" },
  { bg: "#F6AF65", a: "#0A1045", b: "#1E4A42", c: "#FBF7F1" },
  { bg: "#ED33B9", a: "#0A1045", b: "#F9E900", c: "#FBF7F1" },
  { bg: "#00C2D1", a: "#0A1045", b: "#F9E900", c: "#F3EEE6" },
  { bg: "#14352F", a: "#F6AF65", b: "#F9E900", c: "#FBF7F1" },
  { bg: "#F3EEE6", a: "#1E4A42", b: "#C45C32", c: "#0A1045" },
] as const;

function patternSeed(title: string, tags: string[]) {
  const input = `${title}\n${tags.join("\n")}`;
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function Marks({ color }: { color: string }) {
  const dots = [];
  for (let row = 0; row < 5; row += 1) {
    for (let column = 0; column < 8; column += 1) {
      dots.push(
        <circle key={`${row}-${column}`} cx={120 + column * 140} cy={110 + row * 130} r={row % 2 === column % 2 ? 10 : 5} fill={color} />,
      );
    }
  }
  return <>{dots}</>;
}

export function NotePattern({ title, tags }: { title: string; tags: string[] }) {
  const seed = patternSeed(title, tags);
  const palette = palettes[seed % palettes.length];
  const kind = seed % 4;

  return (
    <svg className="note-pattern" viewBox="0 0 1200 750" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="1200" height="750" fill={palette.bg} />
      {kind === 0 ? (
        <>
          <circle cx="180" cy="580" r="300" fill={palette.a} />
          <circle cx="980" cy="150" r="190" fill={palette.b} />
          <circle cx="640" cy="390" r="168" fill="none" stroke={palette.c} strokeWidth="28" />
          <circle cx="640" cy="390" r="72" fill={palette.c} />
        </>
      ) : null}
      {kind === 1 ? (
        <>
          <rect x="70" y="80" width="500" height="280" rx="48" fill={palette.a} />
          <rect x="640" y="80" width="480" height="210" rx="48" fill={palette.b} />
          <rect x="160" y="420" width="460" height="250" rx="48" fill={palette.c} />
          <rect x="700" y="360" width="400" height="300" rx="56" fill={palette.a} />
          <circle cx="560" cy="390" r="78" fill={palette.bg} />
        </>
      ) : null}
      {kind === 2 ? (
        <>
          <rect x="-80" y="80" width="900" height="120" rx="60" fill={palette.a} transform="rotate(-8 400 140)" />
          <rect x="200" y="280" width="1100" height="110" rx="55" fill={palette.b} transform="rotate(6 700 335)" />
          <rect x="-40" y="480" width="860" height="130" rx="65" fill={palette.c} transform="rotate(-4 400 545)" />
          <circle cx="980" cy="200" r="70" fill={palette.bg} />
        </>
      ) : null}
      {kind === 3 ? (
        <>
          <Marks color={palette.a} />
          <circle cx="280" cy="250" r="120" fill={palette.b} />
          <circle cx="860" cy="480" r="160" fill={palette.c} />
          <circle cx="640" cy="180" r="48" fill={palette.bg} />
        </>
      ) : null}
    </svg>
  );
}
