import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerRequest } from "./api";
import { useAuth } from "./AuthContext";
import { DragonCrest } from "./logos";
import { DragonEyes } from "./components";

export default function AuthPage({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await registerRequest(username, email, password);
        await login(username, password);
      }
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-amber-700/25 bg-white/5 px-4 py-3 text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-amber-600 focus:shadow-lg focus:shadow-red-950/50";

  return (
    <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-16">
      {/* Blinking dragon eyes above the form */}
      <div className="mb-2">
        <DragonEyes />
      </div>

      <div className="w-full rounded-3xl border border-white/10 bg-black/50 p-8 backdrop-blur-xl">
        <div className="mb-6 flex flex-col items-center gap-3">
          <DragonCrest className="h-14 w-14" />
          <h2 className="font-display text-3xl font-black text-stone-100">
            {isLogin ? "Welcome Back" : "Join the Hoard"}
          </h2>
          <p className="text-sm text-stone-500">
            {isLogin ? "Sign in to continue" : "Create your account"}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            className={inputClass}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
          {!isLogin && (
            <input
              className={inputClass}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          )}
          <input
            className={inputClass}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isLogin ? "current-password" : "new-password"}
          />

          {error && (
            <p className="rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-gradient-to-r from-red-900 to-amber-700 py-3 font-semibold text-amber-50 shadow-lg shadow-red-950/50 transition hover:scale-[1.02] disabled:opacity-60"
          >
            {busy ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          {isLogin ? "New here? " : "Already have an account? "}
          <Link
            to={isLogin ? "/register" : "/login"}
            className="text-amber-500 hover:text-amber-300"
          >
            {isLogin ? "Create an account" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
}