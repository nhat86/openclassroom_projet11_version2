"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { Logo } from "../components/Logo";
import { login } from "../services/authService";

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push("/dashboard/${user.id}");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Une erreur est survenue lors de la connexion"
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
          <h1 className="text-3xl font-bold text-dark-orange mb-8 text-center">Connexion</h1>
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm mb-1.5">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:border-dark-orange"
                required
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm mb-1.5">
                Mot de passe
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:border-dark-orange"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="block w-4/5 mx-auto py-3 rounded-lg font-medium bg-black text-white transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </button>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="text-center">
              <Link
                href="#"
                className="text-sm text-dark-orange underline underline-offset-2 "
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </form>

          <p className="text-sm mt-24 text-center">
            Pas encore de compte ?{" "}
            <Link
              href="/signup"
              className="text-dark-orange underline underline-offset-2 font-medium"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>

      <div
        className="hidden md:block bg-cover bg-center"
        style={{
          backgroundImage: "url('/login_image.jpg')",
        }}
      />
    </div>
  );
}
export default function LoginPage() 
{ return ( 
    <Suspense fallback={null}> 
        <LoginForm /> 
    </Suspense> 
    );
}