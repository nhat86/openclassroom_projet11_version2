"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google?: any;
  }
}

type GoogleCredential = {
  credential: string;
};

export default function GoogleSignInButton() {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.google || !divRef.current) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (!window.google || !divRef.current) return;

      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async (response: GoogleCredential) => {
          if (!response?.credential) return;

          try {
            const res = await fetch(`${API_URL}/auth/google`, {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ credential: response.credential }),
            });

            const data = await res.json();
            if (res.ok) {
              const userId = data.data?.user?.id;
              if (userId) {
                window.location.href = `/dashboard/${userId}`;
              } else {
                alert("Erreur: id utilisateur manquant");
              }
            } else {
              alert(data.message ?? "Erreur de connexion Google");
            }
          } catch (error) {
            console.error("Google login error:", error);
          }
        },
      });

      window.google.accounts.id.renderButton(divRef.current, {
        type: "standard",
        size: "large",
        theme: "outline",
        text: "sign_in_with",
        shape: "rectangular",
        locale: "fr",
      });
    };

    document.body.appendChild(script);
  }, []);

  return <div ref={divRef} />;
}