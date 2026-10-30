import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { RatingRing, Reveal } from "./components";
import { ShieldMark } from "./logos";

type Game = {
  id: number;
  title: string;
  description: string;
  genre: string;
  release_date: string | null;
  rating: string;
};

const banners = [
  "from-red-900 via-rose-800 to-amber-700",
  "from-rose-950 via-red-900 to-orange-800",
  "from-amber-800 via-orange-800 to-red-950",
  "from-purple-950 via-rose-900 to-orange-800",
  "from-stone-900 via-red-900 to-amber-800",
];

function rarity(rating: number) {
  if (rating >= 9) return { label: "LEGENDARY", style: "bg-amber-300/90 text-black" };
  if (rating >= 8) return { label: "EPIC", style: "bg-purple-700 text-white" };
  return { label: "RARE", style: "bg-sky-700 text-white" };
}

export default function GamePage() {
  const { id } = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`http://127.0.0.1:8000/api/games/${id}/`)
      .then((res) => {
        if (res.status === 404) throw new Error("Game not found");
        if (!res.ok) throw new Error("Failed to load game");
        return res.json();
      })
      .then((data) => setGame(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20">
        <div className="h-72 animate-pulse rounded-3xl bg-white/10" />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="font-display text-3xl font-black text-stone-100">
          {error || "Game not found"}
        </h2>
        <Link to="/" className="mt-6 inline-block text-amber-500 hover:text-amber-300">
          ← Back to the hoard
        </Link>
      </div>
    );
  }

  const rating = parseFloat(game.rating);
  const tier = rarity(rating);

  return (
    <div className="relative z-10 mx-auto max-w-4xl px-6 py-12">
      <Link to="/" className="text-sm text-stone-400 transition hover:text-amber-200">
        ← Back to games
      </Link>

      <Reveal>
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
          <div
            className={`relative flex h-64 items-end bg-gradient-to-br p-8 ${
              banners[game.id % banners.length]
            }`}
          >
            <ShieldMark className="absolute top-4 left-6 h-20 w-28 opacity-40" />
            <span className="relative rounded-full bg-black/50 px-4 py-1.5 text-sm font-semibold backdrop-blur">
              {game.genre}
            </span>
            <RatingRing rating={rating} />
          </div>

          <div className="p-8">
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-black tracking-widest ${tier.style}`}
            >
              {tier.label}
            </span>
            <h1 className="font-display mt-4 text-4xl font-black text-stone-100 sm:text-5xl">
              {game.title}
            </h1>

            <div className="mt-6 grid grid-cols-3 gap-4 border-y border-white/10 py-5 text-center">
              <div>
                <p className="text-xs tracking-widest text-stone-500 uppercase">Rating</p>
                <p className="font-display mt-1 text-2xl font-black text-amber-300">
                  {rating.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-xs tracking-widest text-stone-500 uppercase">Genre</p>
                <p className="font-display mt-1 text-2xl font-black text-stone-100">
                  {game.genre}
                </p>
              </div>
              <div>
                <p className="text-xs tracking-widest text-stone-500 uppercase">Released</p>
                <p className="font-display mt-1 text-2xl font-black text-stone-100">
                  {game.release_date ?? "—"}
                </p>
              </div>
            </div>

            <h2 className="font-display mt-8 text-xl font-bold text-stone-100">About</h2>
            <p className="mt-3 leading-relaxed whitespace-pre-line text-stone-400">
              {game.description || "No description yet."}
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}