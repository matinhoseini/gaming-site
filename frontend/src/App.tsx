import { useEffect, useState } from "react";
import "./App.css";

type Game = {
  id: number;
  title: string;
  description: string;
  genre: string;
  release_date: string | null;
  rating: string;
};

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/games/")
      .then((res) => {
        if (!res.ok) throw new Error("خطا در دریافت اطلاعات");
        return res.json();
      })
      .then((data) => setGames(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>در حال بارگذاری...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h1>🎮 Gaming Site</h1>
      <div className="grid">
        {games.map((game) => (
          <div className="card" key={game.id}>
            <h2>{game.title}</h2>
            <p className="genre">{game.genre}</p>
            <p>{game.description}</p>
            <p className="rating">⭐ {game.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;