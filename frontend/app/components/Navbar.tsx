"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Folder } from "lucide-react";
import { Logo } from "./Logo";
import { useState, useRef, useEffect, useCallback } from "react";
import { getProfile, logout, type User } from "../services/authService";
import { getInitials } from "@/lib/getInitialName";
import { EditAccountModal } from "./modals/UpdateProfileModal";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEditAccount, setShowEditAccount] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const loadUser = useCallback(async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch (error) {
      console.error("Erreur de récupération du profil :", error);
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isDashboard = pathname?.startsWith("/dashboard");
  const isProjects = pathname?.startsWith("/projects");
  const userId = user?.id ?? "";
  const initials = getInitials(user?.name ?? null);

  return (
    <header className="bg-white border-b border-black/5 px-6 md:px-10 py-4 flex items-center justify-between gap-4">
      <Link href={userId ? `/dashboard/${userId}` : "/login"}>
        <Logo className="text-2xl" />
      </Link>

      <nav className="hidden sm:flex items-center gap-2">
        <Link
          href={userId ? `/dashboard/${userId}` : "/login"}
          className={`group flex w-[248px] items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isDashboard
              ? "bg-black text-white"
              : "text-dark-orange hover:text-white hover:bg-black"
          }`}
        >
          <LayoutDashboard
            size={16}
            className={
              isDashboard
                ? "fill-white"
                : "fill-dark-orange group-hover:fill-white"
            }
          />
          Tableau de bord
        </Link>
        <Link
          href="/projects"
          className={`group flex w-[248px] items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isProjects
              ? "bg-black text-white"
              : "text-dark-orange hover:text-white hover:bg-black"
          }`}
        >
          <Folder
            size={16}
            className={
              isProjects
                ? "fill-white"
                : "fill-dark-orange group-hover:fill-white"
            }
          />
          Projets
        </Link>
      </nav>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="w-11 h-11 rounded-full bg-dark-orange/20 text-dark-orange-dark font-semibold flex items-center justify-center hover:bg-dark-orange transition-colors"
        >
          {initials}
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-black/5 py-1 z-20 text-sm">
            <button
              onClick={() => {
                setMenuOpen(false);
                setShowEditAccount(true);
              }}
              className="w-full text-left px-4 py-2.5 hover:bg-black/5"
            >
              Mon compte
            </button>
            <button
                onClick={async () => {
                    try {
                    await logout();
                    setMenuOpen(false);
                    router.push("/login");
                    } catch (error) {
                    console.error("Erreur de déconnexion :", error);
                    }
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-black/5 text-red-500"
                >
                Se déconnecter
            </button>
          </div>
        )}
      </div>

      {showEditAccount && (
        <EditAccountModal
          open={showEditAccount}
          onClose={() => setShowEditAccount(false)}
          onUpdated={loadUser}
        />
      )}
    </header>
  );
}
