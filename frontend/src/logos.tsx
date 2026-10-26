export function DragonCrest({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <defs>
        <linearGradient id="crestGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
      </defs>
      <path
        d="M32 3 L57 14 V34 C57 48 46 58 32 61 C18 58 7 48 7 34 V14 Z"
        fill="#140706"
        stroke="url(#crestGrad)"
        strokeWidth="2.5"
      />
      <path
        d="M20 40 L24 28 L21 18 L29 24 L32 14 L35 24 L43 18 L40 28 L44 40 L37 36 L32 46 L27 36 Z"
        fill="url(#crestGrad)"
      />
      <path d="M26 30 L30 32 L28 34 Z" fill="#140706" />
      <path d="M38 30 L34 32 L36 34 Z" fill="#140706" />
    </svg>
  );
}

export function DragonSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" className={className} fill="currentColor">
      <path d="M200 100 L172 62 L120 28 L52 10 L88 46 L60 52 L100 76 L82 90 L132 102 L172 112 L196 132 L200 150 L204 132 L228 112 L268 102 L318 90 L300 76 L340 52 L312 46 L348 10 L280 28 L228 62 Z" />
      <path d="M200 100 L210 84 L226 78 L236 86 L222 94 L210 104 Z" />
      <path d="M226 78 L246 70 L242 82 L232 86 Z" />
      <path d="M200 150 L194 176 L186 196 L200 184 L214 196 L206 176 Z" />
    </svg>
  );
}

export function ShieldMark({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <path
        d="M32 4 L56 14 V34 C56 47 46 57 32 60 C18 57 8 47 8 34 V14 Z"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M22 38 L26 28 L23 20 L30 25 L32 16 L34 25 L41 20 L38 28 L42 38 L36 35 L32 43 L28 35 Z"
        fill="currentColor"
      />
    </svg>
  );
}