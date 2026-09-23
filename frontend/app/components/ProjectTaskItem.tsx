"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { getStatusInfo } from "@/lib/taskStatus";
import { getInitials } from "@/lib/getInitialName";
import type { ProjectDetailTask } from "../services/projectService";
import type {User} from "../services/authService";
import { createComment } from "../services/commentService";

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

export function ProjectTaskItem({ 
    task,
    currentUser,
    onCommentUpdated,
}: { 
    task: ProjectDetailTask;
    currentUser: User | null;
    onCommentUpdated: ()=>void;
}) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { label, className } = getStatusInfo(task.status);
  async function handleAddComment() {
    if (!newComment.trim()) return;
    await createComment(task.id, task.project.id, newComment.trim());
    setNewComment("");
    setShowComments(true);
    onCommentUpdated();
  }
  const canAddComment = currentUser !== null;
  
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
          <p className="text-sm text-black/50 mb-10">{task.description}</p>
        </div>
        <button className="text-black/40 hover:text-black">⋮</button>
      </div>

      <div className="text-xs text-black/40">
        <div className="flex items-center gap-2 mb-4">
            <span>
                Échéance :
            </span>
            <span className="flex items-center gap-2">
            <Image src="/calendrier.png" alt="" width={14} height={14} />
            {formatDate(task.dueDate)}
            </span>
        </div>
        <div className="flex items-center gap-2">
            Assigné à :
            {task.assignees.map((m) => (
                <div key={m.id} className="inline-flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center rounded-full bg-black/5 px-2.5 py-1 text-xs font-normal text-gris">
                  {getInitials(m.user.name ?? m.user.email)}
                </span>
                <span className="inline-flex items-center justify-center rounded-full bg-black/5 px-2.5 py-1 font-normal text-xs text-black/60">{m.user.name ?? m.user.email}</span>
              </div>
            ))}
        </div>
        
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
            {canAddComment && (
                <div className="mt-4 flex gap-2">
                    <input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Ajouter un commentaire"
                        className="flex-1 border border-black/10 rounded-lg px-3 py-2 text-sm"
                    />
                    <button
                        onClick={handleAddComment}
                        className="bg-black text-white text-sm px-3 py-2 rounded-lg"
                    >
                        Ajouter
                    </button>
                </div> 
            )}
        </div>
      )}
    </div>
  );
}