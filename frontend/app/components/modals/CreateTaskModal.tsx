"use client";

import { useMemo, useState } from "react";
import { X, Plus } from "lucide-react";
import { createTask } from "../../services/taskService";
import type { ProjectDetail } from "../../services/projectService";
import { ContributorSelect } from "../ContributorSelect";
import { FRONTEND_TO_BACKEND, getStatusInfo, statusOrder, type TaskStatus } from "../../../lib/taskStatus";

export function CreateTaskModal({
  project,
  onClose,
  onCreated,
}: {
  project: ProjectDetail;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<TaskStatus>("A_FAIRE");
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
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
      await createTask(project.id, {
        title: title.trim(),
        description: description.trim(),
        status: FRONTEND_TO_BACKEND[status],
        priority: "MEDIUM",
        dueDate,
        assigneeIds,
      });
      onCreated();
      onClose();
    } catch (error) {
        console.log("Erreur lors de la création de la tâche", error);
        alert("Erreur lors de la création de la tâche");
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

        <h2 className="text-xl font-semibold mb-6">Créer une tâche</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Titre*</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-black/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-dark-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Description*</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full border border-black/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-dark-orange resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Échéance*</label>
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
                 const isSelected= status === s;
                 return (
                    <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${className} ${isSelected
                        ? "opacity-100 ring-2 ring-offset-1 ring-black/20"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    >
                    {label}
                    </button>
                 )
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className={`px-[20px] rounded-lg py-3 text-sm font-medium flex items-center justify-center gap-2 mt-4 ${
              canSubmit
                ? "bg-black text-white hover:bg-black/90"
                : "bg-black/10 text-black/40 cursor-not-allowed"
            }`}
          >
            <Plus size={18} />
            Ajouter une tâche
          </button>
        </form>
      </div>
    </div>
  );
}