
type DragonProps = {
  className?: string;
  gradient?: boolean;
};

function FlyingDragon({
  className = "",
  gradient = false,
}: DragonProps) {
  return (
    <svg
      viewBox="0 0 400 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill={gradient ? "url(#dragonGradient)" : "currentColor"}
      style={{
        overflow: "visible",
        filter: gradient
          ? "drop-shadow(0 0 5px #f9731680) drop-shadow(0 0 12px #dc262640)"
          : "none",
      }}
    >
      {gradient && (
        <defs>
          <linearGradient
            id="dragonGradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="25%" stopColor="#fbbf24" />
            <stop offset="55%" stopColor="#f97316" />
            <stop offset="80%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
        </defs>
      )}

      <g
        stroke={gradient ? "#fed7aa" : "none"}
        strokeWidth={gradient ? "1.2" : "0"}
        strokeLinejoin="round"
      >
        {/* Original flying dragon silhouette */}
        <path d="M200 100 L172 62 L120 28 L52 10 L88 46 L60 52 L100 76 L82 90 L132 102 L172 112 L196 132 L200 150 L204 132 L228 112 L268 102 L318 90 L300 76 L340 52 L312 46 L348 10 L280 28 L228 62 Z" />

        {/* Original head details, without extra eye dots */}
        <path d="M200 100 L210 84 L226 78 L236 86 L222 94 L210 104 Z" />
        <path d="M226 78 L246 70 L242 82 L232 86 Z" />

        {/* Tail */}
        <path d="M200 150 L194 176 L186 196 L200 184 L214 196 L206 176 Z" />
      </g>
    </svg>
  );
}

export function DragonCrest({
  className = "h-14 w-20",
}: {
  className?: string;
}) {
  return <FlyingDragon className={className} gradient />;
}

export function DragonSilhouette({
  className = "",
}: {
  className?: string;
}) {
  return <FlyingDragon className={className} />;
}

export function ShieldMark({
  className = "h-14 w-20",
}: {
  className?: string;
}) {
  return <FlyingDragon className={className} gradient />;
}
