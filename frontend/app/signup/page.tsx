"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "../components/Logo";
import { register } from "../services/authService";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const passwordIsValid =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      );
    if (!passwordIsValid) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await register(email, password, name);
      router.push("/login?registered=1");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Une erreur est survenue lors de l'inscription"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_2fr] min-h-screen">
      <div className="flex flex-col items-center justify-center px-10 sm:px-20 py-16 bg-white">
        <Logo className="text-3xl mb-24" />

        <div className="max-w-sm w-full">
          <h1 className="text-3xl font-bold text-dark-orange mb-8 text-center">
            Inscription
          </h1>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label htmlFor="signup-name" className="block text-sm mb-1.5">
                Nom
              </label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:border-dark-orange"
                required
              />
            </div>
            <div>
              <label htmlFor="signup-email" className="block text-sm mb-1.5">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:border-dark-orange"
                required
              />
            </div>
            <div>
              <label htmlFor="signup-password" className="block text-sm mb-1.5">
                Mot de passe
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:border-dark-orange"
                required
              />
              <p className="mt-1.5 text-xs text-black/60">
                8 caractères minimum, avec majuscule, minuscule, chiffre et caractère spécial.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="block w-4/5 mx-auto py-3 rounded-lg font-medium bg-black text-white transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Création..." : "S'inscrire"}
            </button>

            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>

          <p className="text-sm mt-24 text-center">
            Déjà inscrit ?{" "}
            <Link
              href="/login"
              className="text-dark-orange underline underline-offset-2 font-medium"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>

      <div
        className="hidden md:block bg-cover bg-center"
        style={{
          backgroundImage: "url('/signup_image.jpg')",
        }}
      />
    </div>
  );
}
