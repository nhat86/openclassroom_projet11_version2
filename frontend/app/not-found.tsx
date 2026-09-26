import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-black/60 mb-8">Page non trouvée</p>
      <Link
        href="/"
        className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}