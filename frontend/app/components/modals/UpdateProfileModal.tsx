"use client";

import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  updatePassword,
  type User,
} from "../../services/authService";
import { Modal } from "../Modal";

const PASSWORD_PLACEHOLDER = "••••••••••••";

export function EditAccountModal({
  open,
  onClose,
  onUpdated,
}: {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(PASSWORD_PLACEHOLDER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    getProfile()
      .then((user: User) => {
        const [fn = "", ln = ""] = (user.name ?? "").split(" ");
        setFirstName(fn);
        setLastName(ln);
        setEmail(user.email);
        setPassword(PASSWORD_PLACEHOLDER);
      })
      .catch(() => setError("Impossible de charger le profil"));
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fullName = `${firstName} ${lastName}`.trim();
    if (!email.trim()) {
      setError("L'email est requis");
      setLoading(false);
      return;
    }

    try {
      await updateProfile({ name: fullName, email });

      if (password && password !== PASSWORD_PLACEHOLDER) {
        await updatePassword(password);
      }

      onUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message ?? "Erreur");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-semibold mb-1">Mon compte</h2>
      <p className="text-black/40 mb-6">
        {firstName} {lastName}
      </p>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm mb-1.5">Nom</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-dark-orange"
          />
        </div>

        <div>
          <label className="block text-sm mb-1.5">Prénom</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-dark-orange"
          />
        </div>

        <div>
          <label className="block text-sm mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-dark-orange"
          />
        </div>

        <div>
          <label className="block text-sm mb-1.5">Mot de passe</label>
          <input
            type="password"
            value={password}
            onFocus={(e) => {
              if (password === PASSWORD_PLACEHOLDER) {
                setPassword("");
                e.target.value = "";
              }
            }}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-dark-orange"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="bg-black text-white text-sm font-normal px-5 py-3 rounded-lg hover:bg-black/80 disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Modifier les informations"}
        </button>
      </form>
    </Modal>
  );
}
