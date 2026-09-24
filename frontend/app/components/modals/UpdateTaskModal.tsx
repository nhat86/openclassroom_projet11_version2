"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { updateTask } from "../../services/taskService";
import type { ProjectDetail, ProjectDetailTask } from "../../services/projectService";
import { ContributorSelect } from "../ContributorSelect";
import { getStatusInfo, statusOrder, type TaskStatus } from "@/lib/taskStatus";

const BACKEND_TO_FRONTEND: Record<string, TaskStatus> = {
  TODO: "A_FAIRE",
  IN_PROGRESS: "EN_COURS",
  DONE: "TERMINEE",
};

const FRONTEND_TO_BACKEND: Record<TaskStatus, string> = {
  A_FAIRE: "TODO",
  EN_COURS: "IN_PROGRESS",
  TERMINEE: "DONE",
};

function toInputDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function UpdateTaskModal({
  project,
  task,
  onClose,
  onUpdated,
}: {
  project: ProjectDetail;
  task: ProjectDetailTask;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [dueDate, setDueDate] = useState(toInputDate(task.dueDate));
  const [status, setStatus] = useState<TaskStatus>(
    BACKEND_TO_FRONTEND[task.status] ?? "A_FAIRE"
  );
  const [assigneeIds, setAssigneeIds] = useState<string[]>(
    task.assignees.map((a) => a.user.id)
  );
  const [loading, setLoading] = useState(false);

  const users = useMemo(
    () => [project.owner, ...project.members.map((m) => m.user)],
    [project]
  );

  const canSubmit =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    dueDate.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    try {
      await updateTask(project.id, task.id, {
        title: title.trim(),
        description: description.trim(),
        status: FRONTEND_TO_BACKEND[status],
        priority: task.priority,
        dueDate,
        assigneeIds,
      });
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche", error);
      alert("Erreur lors de la mise à jour de la tâche");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-black/40 hover:text-black">
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6">Modifier</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Titre</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-black/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-dark-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full border border-black/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-dark-orange resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Échéance</label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full border border-black/10 rounded-lg px-4 py-2.5 pr-10 text-sm outline-none focus:border-dark-orange"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Assigné à :</label>
            <ContributorSelect
              users={users}
              selectedIds={assigneeIds}
              onChange={setAssigneeIds}
              placeholder="Choisir un ou plusieurs collaborateurs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Statut :</label>
            <div className="flex flex-wrap gap-2">
              {statusOrder.map((s) => {
                const { label, className } = getStatusInfo(s);
                const isSelected = status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${className} ${
                      isSelected
                        ? "opacity-100 ring-2 ring-offset-1 ring-black/20"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className={`w-full sm:w-auto rounded-lg py-3 px-8 text-sm font-medium ${
              canSubmit
                ? "bg-black text-white hover:bg-black/90"
                : "bg-black/10 text-black/40 cursor-not-allowed"
            }`}
          >
            {loading ? "Chargement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}