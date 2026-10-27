export const API_URL = "http://127.0.0.1:8000/api";

export type User = {
  id: number;
  username: string;
  email: string;
};

type Tokens = { access: string; refresh: string };

export async function loginRequest(username: string, password: string): Promise<Tokens> {
  const res = await fetch(`${API_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Invalid username or password");
  return res.json();
}

export async function registerRequest(
  username: string,
  email: string,
  password: string
): Promise<void> {
  const res = await fetch(`${API_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const first = Object.values(data)[0];
    const message = Array.isArray(first) ? String(first[0]) : "Registration failed";
    throw new Error(message);
  }
}

export async function fetchMe(access: string): Promise<User> {
  const res = await fetch(`${API_URL}/auth/me/`, {
    headers: { Authorization: `Bearer ${access}` },
  });
  if (!res.ok) throw new Error("Session expired");
  return res.json();
}