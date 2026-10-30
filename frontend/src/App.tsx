import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { useTypewriter } from "./hooks";
import { useAuth } from "./AuthContext";
import AuthPage from "./AuthPage";
import { default as GamePage } from "./GamePage.tsx";
import { DragonCrest, DragonSilhouette, ShieldMark } from "./logos";
import {
  DragonEyes,
  Embers,
  RatingRing,
  Reveal,
  SkeletonCard,
  Stat,
  TiltCard,
} from "./components";

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

const marqueeWords = [
  "RPG", "ADVENTURE", "HORROR", "STRATEGY", "RACING", "INDIE", "SOULSLIKE", "OPEN WORLD",
];

const heroWords = ["Legendary Quest", "Dragon Slayer RPG", "Next Obsession", "Fire-Forged Co-op"];

function rarity(rating: number) {
  if (rating >= 9) return { label: "LEGENDARY", style: "bg-amber-300/90 text-black" };
  if (rating >= 8) return { label: "EPIC", style: "bg-purple-700 text-white" };
  return { label: "RARE", style: "bg-sky-700 text-white" };
}

/* Simple, elegant, single-row marquee */
function MarqueeBand() {
  return (
    <div className="relative z-10 my-12 overflow-hidden border-y border-amber-700/20 py-5">
      <div className="marquee-mask">
        <div className="font-display flex w-max animate-marquee items-center text-sm font-semibold tracking-[0.5em] text-amber-100/35 sm:text-base">
          {[...marqueeWords, ...marqueeWords, ...marqueeWords, ...marqueeWords].map((w, i) => (
            <span key={i} className="flex items-center">
              <span>{w}</span>
              <span className="mx-12 h-1.5 w-1.5 rotate-45 bg-amber-700/60" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Atmospheric fire background */
function Atmosphere({ mouse }: { mouse: { x: number; y: number } }) {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,rgba(127,29,29,0.20),transparent_60%)]" />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-[32rem] w-[32rem] animate-orb-a rounded-full bg-red-900/30 blur-[120px]" />
        <div className="absolute top-1/3 -right-24 h-[30rem] w-[30rem] animate-orb-b rounded-full bg-amber-800/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[34rem] w-[34rem] animate-orb-c rounded-full bg-orange-900/20 blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 h-[26rem] w-[26rem] animate-orb-d rounded-full bg-purple-900/25 blur-[110px]" />
      </div>

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="fog h-full w-[200%] animate-fog" />
      </div>

      <div className="pointer-events-none fixed right-0 bottom-0 left-0 z-0 h-72 origin-bottom animate-breathe bg-gradient-to-t from-red-900/25 via-orange-950/10 to-transparent" />

      <Embers />

      <div
        className="pointer-events-none fixed top-0 left-0 z-0 h-[28rem] w-[28rem] rounded-full bg-amber-700/15 blur-3xl transition-transform duration-500 ease-out"
        style={{ transform: `translate(${mouse.x - 224}px, ${mouse.y - 224}px)` }}
      />

      <div className="grain pointer-events-none fixed inset-0 z-[1]" />
      <div className="vignette pointer-events-none fixed inset-0 z-[2]" />
    </>
  );
}

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-amber-700/20 bg-black/55 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <DragonCrest />
          <h1 className="font-display animate-gradient bg-gradient-to-r from-amber-200 via-amber-600 to-amber-200 bg-[length:200%_auto] bg-clip-text text-2xl font-black tracking-widest text-transparent">
            DRAGONFORGE
          </h1>
        </Link>
        <div className="flex items-center gap-6 text-sm text-stone-400">
          <Link to="/" className="transition hover:text-amber-200">Home</Link>
          <a href="/#games" className="transition hover:text-amber-200">Games</a>
          {user ? (
            <>
              <span className="text-amber-200/80">{user.username}</span>
              <button
                onClick={logout}
                className="rounded-full border border-amber-700/40 px-5 py-2 font-semibold text-amber-100 transition hover:scale-105 hover:border-amber-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-red-900 to-amber-700 px-5 py-2 font-semibold text-amber-50 shadow-lg shadow-red-950/50 transition hover:scale-105"
            >
              <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");

  const typed = useTypewriter(heroWords);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/games/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load games");
        return res.json();
      })
      .then((data) => setGames(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const genres = useMemo(
    () => ["All", ...Array.from(new Set(games.map((g) => g.genre)))],
    [games]
  );

  const filtered = games.filter(
    (g) =>
      (genre === "All" || g.genre === genre) &&
      g.title.toLowerCase().includes(search.toLowerCase())
  );

  const avgRating = games.length
    ? games.reduce((sum, g) => sum + parseFloat(g.rating), 0) / games.length
    : 0;

  return (
    <>
      <header className="relative z-10 mx-auto max-w-6xl px-6 pt-20 pb-12 text-center">
        <DragonSilhouette className="pointer-events-none absolute top-4 left-0 h-24 w-48 animate-fly text-red-950/70" />

        <DragonEyes />

        <p className="mx-auto mb-6 w-fit animate-glow rounded-full border border-amber-700/40 bg-amber-900/10 px-4 py-1 text-sm text-amber-200/80">
          Where legendary games are forged
        </p>
        <h2 className="font-display text-5xl leading-tight font-black text-stone-100 sm:text-7xl">
          Find Your
          <span className="mt-2 block min-h-[1.2em] animate-gradient bg-gradient-to-r from-amber-200 via-amber-600 to-red-800 bg-[length:200%_auto] bg-clip-text text-transparent">
            {typed}
            <span className="animate-blink text-amber-200">|</span>
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-stone-400">
          Hunt down top-rated games, track fresh releases, and claim your next legend.
        </p>

        <div className="mx-auto mt-10 flex max-w-xl items-center gap-3 rounded-2xl border border-amber-700/25 bg-white/5 p-2 backdrop-blur transition focus-within:scale-105 focus-within:border-amber-600 focus-within:shadow-lg focus-within:shadow-red-950/50">
          <span className="pl-3 text-xl text-amber-600">⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the dragon's hoard..."
            className="w-full bg-transparent py-2 text-stone-100 outline-none placeholder:text-stone-500"
          />
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-6">
          <Stat value={games.length} label="Games" />
          <Stat value={genres.length - 1} label="Realms" />
          <Stat value={avgRating} label="Avg Rating" decimals={1} />
        </div>
      </header>

      <MarqueeBand />

      <main id="games" className="relative z-10 mx-auto max-w-6xl px-6 pt-8 pb-24">
        <Reveal>
          <h3 className="font-display mb-6 text-3xl font-black text-stone-100">Latest Games</h3>
        </Reveal>

        <div className="mb-8 flex flex-wrap items-center gap-3">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition hover:scale-105 active:scale-95 ${
                genre === g
                  ? "bg-gradient-to-r from-red-900 to-amber-700 text-amber-50 shadow-lg shadow-red-950/50"
                  : "border border-white/10 bg-white/5 text-stone-400 hover:border-amber-700/50"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {error && <p className="text-red-400">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="text-stone-500">No games found in the hoard.</p>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading && [1, 2, 3].map((n) => <SkeletonCard key={n} />)}

          {filtered.map((game, i) => {
            const rating = parseFloat(game.rating);
            const tier = rarity(rating);
            return (
              <Reveal key={game.id} delay={(i % 3) * 120}>
                <TiltCard>
                  <Link
                    to={`/games/${game.id}`}
                    className="group block h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:border-amber-700/60 hover:shadow-2xl hover:shadow-red-950/60"
                  >
                    <div
                      className={`relative flex h-44 items-end overflow-hidden bg-gradient-to-br p-5 ${
                        banners[game.id % banners.length]
                      }`}
                    >
                      <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      <span className="relative rounded-full bg-black/50 px-3 py-1 text-xs font-semibold backdrop-blur">
                        {game.genre}
                      </span>
                      <RatingRing rating={rating} />
                      <ShieldMark className="absolute top-3 left-4 h-16 w-16 text-black/30 transition duration-500 group-hover:scale-110 group-hover:text-black/50" />
                    </div>
                    <div className="p-5">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-black tracking-widest ${tier.style}`}
                      >
                        {tier.label}
                      </span>
                      <h3 className="font-display mt-3 text-xl font-extrabold text-stone-100 transition group-hover:text-amber-200">
                        {game.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-stone-400">
                        {game.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="text-amber-500">
                          {"★".repeat(Math.round(rating / 2))}
                        </span>
                        <span className="text-stone-500">{game.release_date ?? "—"}</span>
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </main>
    </>
  );
}

function App() {
  const [mouse, setMouse] = useState({ x: -500, y: -500 });
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onMove = (e: globalThis.MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0506] text-stone-200">
      <div
        className="fixed top-0 left-0 z-[60] h-1 bg-gradient-to-r from-red-900 via-amber-700 to-amber-200"
        style={{ width: `${scrollPct}%` }}
      />

      <Atmosphere mouse={mouse} />
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/games/:id" element={<GamePage />} />
      </Routes>

      <footer className="font-display relative z-10 border-t border-amber-700/20 py-8 text-center text-sm text-stone-500">
        © 2026 DragonForge. Forged with React, Django & Tailwind.
      </footer>
    </div>
  );
}

export default App;