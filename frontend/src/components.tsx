import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { useCountUp } from "./hooks";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function TiltCard({ children }: { children: ReactNode }) {
  const [style, setStyle] = useState("");

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle(
      `perspective(900px) rotateX(${-y * 14}deg) rotateY(${x * 14}deg) scale(1.04)`
    );
  };

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={() => setStyle("")}
      style={{ transform: style || "perspective(900px)" }}
      className="h-full transition-transform duration-200 ease-out will-change-transform"
    >
      {children}
    </div>
  );
}

export function RatingRing({ rating }: { rating: number }) {
  const [filled, setFilled] = useState(false);
  const radius = 24;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const t = setTimeout(() => setFilled(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="absolute top-4 right-4 flex h-16 w-16 items-center justify-center rounded-full bg-black/60 backdrop-blur">
      <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="#fbbf24"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={filled ? circumference * (1 - rating / 10) : circumference}
          style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
        />
      </svg>
      <span className="font-display text-sm font-extrabold text-amber-300">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export function Stat({
  value,
  label,
  decimals = 0,
}: {
  value: number;
  label: string;
  decimals?: number;
}) {
  const animated = useCountUp(value);
  return (
    <div className="text-center">
      <p className="font-display animate-gradient bg-gradient-to-r from-amber-300 via-orange-500 to-red-500 bg-[length:200%_auto] bg-clip-text text-4xl font-black text-transparent sm:text-5xl">
        {animated.toFixed(decimals)}
      </p>
      <p className="mt-1 text-sm tracking-widest text-stone-500 uppercase">{label}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="h-44 bg-white/10" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 rounded bg-white/10" />
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-3 w-4/5 rounded bg-white/10" />
      </div>
    </div>
  );
}

/* Floating fire sparks rising from the bottom of the screen */
export function Embers() {
  const embers = Array.from({ length: 32 }, (_, i) => ({
    left: (i * 37) % 100,
    size: 2 + ((i * 7) % 5),
    duration: 6 + ((i * 13) % 9),
    delay: -((i * 5) % 12),
    drift: ((i * 29) % 120) - 60,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {embers.map((e, i) => (
        <span
          key={i}
          className="absolute bottom-0 animate-ember rounded-full bg-orange-400 shadow-[0_0_10px_2px_rgba(251,146,60,0.8)]"
          style={
            {
              left: `${e.left}%`,
              width: e.size,
              height: e.size,
              animationDuration: `${e.duration}s`,
              animationDelay: `${e.delay}s`,
              "--drift": `${e.drift}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* Sharp, predatory dragon eyes that blink */
export function DragonEyes() {
  return (
    <div className="mx-auto mb-8 flex w-fit gap-10">
      {[-12, 12].map((angle) => (
        <div key={angle} style={{ transform: `rotate(${angle}deg)` }}>
          <div
            className="relative flex h-9 w-24 animate-eye items-center justify-center overflow-hidden bg-gradient-to-b from-amber-300 via-orange-500 to-red-800 shadow-[0_0_30px_6px_rgba(249,115,22,0.5)]"
            style={{ clipPath: "polygon(0 50%, 25% 0, 100% 30%, 75% 100%)" }}
          >
            <div className="h-full w-1.5 bg-black" />
          </div>
        </div>
      ))}
    </div>
  );
}