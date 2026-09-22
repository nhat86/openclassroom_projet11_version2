"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getInitials } from "@/lib/getInitialName";
import type { UserContributor } from "../services/projectService";

export function ContributorSelect({
  users,
  selectedIds,
  onChange,
  placeholder = "Choisir un ou plusieurs contributeurs",
}: {
  users: UserContributor[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  const label =
    selectedIds.length === 0
      ? placeholder
      : selectedIds.length === 1
      ? users.find((u) => u.id === selectedIds[0])?.name ?? placeholder
      : `${selectedIds.length} contributeurs`;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between border rounded-lg px-4 py-3 text-sm text-left transition-colors ${
          open ? "border-dark-orange" : "border-black/10"
        } ${selectedIds.length === 0 ? "text-black/40" : "text-black"}`}
      >
        <span className="truncate">{label}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-black/40 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-black/10 rounded-lg shadow-lg py-1 max-h-52 overflow-y-auto">
          {users.map((u) => (
            <label
              key={u.id}
              className="flex items-center gap-3 px-4 py-2 hover:bg-black/5 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(u.id)}
                onChange={() => toggle(u.id)}
                className="accent-dark-orange w-4 h-4"
              />
              <span className="w-7 h-7 rounded-full bg-light-orange text-dark-orange text-xs font-semibold flex items-center justify-center shrink-0">
                {getInitials(u.name)}
              </span>
              <span className="flex-1 truncate">
                {u.name ?? u.email} ({u.email})
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
