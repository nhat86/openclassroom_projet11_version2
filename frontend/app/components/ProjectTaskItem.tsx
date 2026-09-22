"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { getStatusInfo } from "@/lib/taskStatus";
import { getInitials } from "@/lib/getInitialName";
import type { ProjectDetailTask } from "../services/projectService";

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

export function ProjectTaskItem({ task }: { task: ProjectDetailTask }) {
  const [showComments, setShowComments] = useState(false);
  const { label, className } = getStatusInfo(task.status);

  return (
    <div className="border border-black/5 rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{task.title}</h3>
            <span className={`text-xs px-2.5 py-1 rounded-full ${className}`}>
              {label}
            </span>
          </div>
          <p className="text-sm text-black/50 mb-3">{task.description}</p>
        </div>
        <button className="text-black/40 hover:text-black">⋮</button>
      </div>

      <div className="flex items-center gap-4 flex-wrap text-xs text-black/40">
        <span className="flex items-center gap-1">
          <Image src="/calendrier.png" alt="" width={14} height={14} />
          {formatDate(task.dueDate)}
        </span>
        <span className="flex items-center gap-1">
          Assigné à :
          {task.assignees.map((a) => (
            <span
              key={a.user.id}
              className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black/5 text-[10px] font-medium"
            >
              {getInitials(a.user.name)}
            </span>
          ))}
        </span>
      </div>

      <button
        onClick={() => setShowComments((v) => !v)}
        className="flex items-center justify-between w-full mt-4 pt-3 border-t border-black/5 text-sm text-black/60"
      >
        <span>Commentaires ({task.comments.length})</span>
        {showComments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {showComments && (
        <div className="mt-3 space-y-2">
          {task.comments.length === 0 && (
            <p className="text-sm text-black/40">Aucun commentaire</p>
          )}
          {task.comments.map((c) => (
            <div key={c.id} className="text-sm">
              <p className="font-medium">{c.author.name ?? "Utilisateur"}</p>
              <p className="text-black/60">{c.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}