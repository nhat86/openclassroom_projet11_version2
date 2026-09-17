"use client";

import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

export function Modal({
  onClose,
  children,
  maxWidth = "max-w-[520px]",
}: {
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/40 p-4 overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-xl p-8 my-8 max-h-[90vh] overflow-y-auto scrollbar-thin`}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-black/40 hover:text-black transition-colors"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}
