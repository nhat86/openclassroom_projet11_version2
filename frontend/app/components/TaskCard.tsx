"use client";

import Image from "next/image";
import Link from "next/link";
import { Task } from "../services/taskService";
import { getStatusInfo } from "../../lib/taskStatus";

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });
}

type TaskCardLayout = "list" | "kanban";

export function TaskCard({
  task,
  layout = "list",
}: {
  task: Task;
  layout?: TaskCardLayout;
}) {
  const { label, className } = getStatusInfo(task.status);

  if (layout === "kanban") {
    return (
      <div className="border border-black/5 rounded-xl p-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-medium">{task.title}</h4>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                className
              }`}
            >
              {label}
            </span>
          </div>
          <p className="text-sm text-black/50 mb-3">
            {task.description ?? "Aucune description"}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-black/40 flex-wrap mb-3">
          <span className="flex items-center gap-1">
            <Image
              src="/projet.png"
              alt="Projet"
              width={14}
              height={14}
            />
            {task.project?.name ?? "Projet inconnu"}
          </span>
          <span>|</span>
          <span className="flex items-center gap-1">
            <Image
              src="/calendrier.png"
              alt="Échéance"
              width={14}
              height={14}
            />
            {formatDate(task.dueDate)}
          </span>
          <span>|</span>
          <span className="flex items-center gap-1">
            <Image
              src="/comment.png"
              alt="Commentaires"
              width={14}
              height={14}
            />
            {task.comments.length}
          </span>
        </div>
        <Link
          href={`/projects/${task.project?.id ?? ""}`}
          className="inline-flex w-[121px] h-[50px] items-center justify-center gap-[10px] bg-black text-white text-[16px] font-normal pt-[13px] pr-[74px] pb-[13px] pl-[74px] rounded-[10px] opacity-100 hover:bg-black transition-colors"
        >
          Voir
        </Link>

        
      </div>
    );
  }

  return (
    <div className="border border-black/5 rounded-xl px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold">{task.title}</h3>
        </div>
        <p className="text-sm text-black/50 mb-3">
          {task.description ?? "Aucune description"}
        </p>
        <div className="flex items-center gap-3 text-xs text-black/40 flex-wrap">
          <span className="flex items-center gap-1">
            <Image src="/projet.png" alt="Projet" width={16} height={16} />
            {task.project?.name ?? "Projet inconnu"}
          </span>
          <span className="flex items-center gap-1">
            <Image
              src="/calendrier.png"
              alt="Échéance"
              width={16}
              height={16}
            />
            {formatDate(task.dueDate)}
          </span>
          <span>|</span>
          <span className="flex items-center gap-1">
            <Image
              src="/comment.png"
              alt="Commentaires"
              width={16}
              height={16}
            />
            {task.comments.length}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 shrink-0">
        <div
          className={`inline-flex self-end items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            className ?? "bg-black/5 text-black/60"
          }`}
        >
          {label}
        </div>
        <Link
          href={`/projects/${task.project?.id ?? ""}`}
          className="inline-flex w-[121px] h-[50px] items-center justify-center gap-[10px] bg-black text-white text-[16px] font-normal pt-[13px] pr-[74px] pb-[13px] pl-[74px] rounded-[10px] opacity-100 hover:bg-black transition-colors"
        >
          Voir
        </Link>
      </div>
    </div>
  );
}
