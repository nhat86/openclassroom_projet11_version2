"use client";

import Image from "next/image";
import { getInitials } from "@/lib/utils";
import type { Project } from "../services/projectService";

export function ProjectCard({ project }: { project: Project }) {
  const total = project.tasks.length;
  const done = project.tasks.filter((t) => t.status === "DONE").length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="bg-white border border-black/5 rounded-2xl p-6">
      <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
      <p className="text-sm text-black/50 mb-6 line-clamp-2">
        {project.description}
      </p>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-black/40">Progression</span>
          <span className="font-medium">{percent}%</span>
        </div>
        <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-black rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-black/40 mt-2">
          {done}/{total} tâches terminées
        </p>
      </div>

      <div className="mt-6">
        <p className="flex items-center gap-1.5 text-xs text-black/40 mb-2">
          <Image src="/equipe.png" alt="Équipe" width={16} height={16} />
          Équipe ({project.members.length + 1})
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-normal bg-light-orange text-gris">
            {getInitials(project.owner.name)}
          </span>
          <span className="items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-normal bg-light-orange text-dark-orange">Propriétaire</span>
          
          {project.members.map((m) => (
            <span
              key={m.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-normal bg-black/5 text-gris"
            >
              {getInitials(m.user.name)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}