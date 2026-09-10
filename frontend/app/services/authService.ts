const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface User {
  id: string;
  email: string;
  name?: string | null;
}

// Connexion
export async function login(
  email: string,
  password: string
): Promise<User> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ?? "Email ou mot de passe incorrect"
    );
  }

  return result.data.user;
}

// Inscription
export async function register(
  email: string,
  password: string,
  name: string
): Promise<User> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ?? "Impossible de créer le compte"
    );
  }

  return result.data.user;
}

// Déconnexion
export async function logout(): Promise<void> {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ?? "Erreur lors de la déconnexion"
    );
  }
}

// Récupérer le profil de l'utilisateur connecté
export async function getProfile(): Promise<User> {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ?? "Utilisateur non authentifié"
    );
  }

  return result.data.user;
}