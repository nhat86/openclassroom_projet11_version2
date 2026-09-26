"use client";

import { useState } from "react";
import { X, Plus, Sparkle, Trash2, Pencil } from "lucide-react";
import {
  generateTasks,
  createTasksBatch,
  type GeneratedTask,
} from "../../services/aiTaskService";

function emptyTask(): GeneratedTask {
  return {
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: null,
    assigneeIds: [],
  };
}

export function GenerateAITasksModal({
  projectId,
  onClose,
  onCreated,
}: {
  projectId: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [drafts, setDrafts] = useState<GeneratedTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  
  async function handleGenerate() {
    const p = prompt.trim();
    if (!p) return;
    setLoading(true);
    try {
      const tasks = await generateTasks(projectId, p);
      const newDrafts = tasks.length > 0 ? tasks : [emptyTask()];
      setDrafts((prev) =>
        prev.length === 0 ? newDrafts : [...prev, ...newDrafts]
      );
      setPrompt("");
    } catch (error) {
      alert("Erreur lors de la génération");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(index: number) {
    setEditingIndex(index);
    setEditTitle(drafts[index].title);
    setEditDescription(drafts[index].description);
    }

  function saveEdit() {
    if (editingIndex === null) return;
    setDrafts((prev) =>
        prev.map((t, i) =>
        i === editingIndex
            ? { ...t, title: editTitle, description: editDescription }
            : t
        )
    );
    setEditingIndex(null);
    }

  function cancelEdit() {
    setEditingIndex(null);
    }

  function removeDraft(index: number) {
    setDrafts((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    const valid = drafts.filter(
      (t) => t.title.trim().length >= 2 && t.description.trim().length >= 1
    );
    if (valid.length === 0) {
      alert("Au moins une tâche avec titre et description est requise");
      return;
    }
    setSaving(true);
    try {
      await createTasksBatch(projectId, valid);
      onCreated();
      onClose();
    } catch (error) {
      alert("Erreur lors de la création");
    } finally {
      setSaving(false);
    }
  }

  const hasDrafts = drafts.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl h-[85vh] flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="p-6 flex items-center gap-2 relative">
          <Sparkle size={20} className="text-[#FF8B42] fill-[#FF8B42]" />
          <h2 className="text-xl font-semibold">
            {hasDrafts ? "Vos tâches..." : "Créer une tâche"}
          </h2>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-black/40 hover:text-black"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6">
          {hasDrafts ? (
            <div className="space-y-4 pb-4">
              {drafts.map((t, i) => (
                <div
                    key={i}
                    className="border border-black/10 rounded-xl p-4 space-y-3"
                >
                    {editingIndex === i ? (
                    <>
                        <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Nom de la tâche"
                        className="w-full font-semibold text-black placeholder:text-black/40 outline-none bg-transparent"
                        />
                        <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Description de la tâche"
                        rows={3}
                        className="w-full text-sm text-black/60 placeholder:text-black/40 outline-none bg-transparent resize-none"
                        />
                        <div className="flex items-center justify-end gap-3 text-sm">
                        <button
                            onClick={cancelEdit}
                            className="text-black/40 hover:text-black"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={saveEdit}
                            className="text-dark-orange font-medium"
                        >
                            Enregistrer
                        </button>
                        </div>
                    </>
                    ) : (
                    <>
                        <h3 className="font-semibold text-black">
                        {t.title || "Nom de la tâche"}
                        </h3>
                        <p className="text-sm text-black/60">
                        {t.description || "Description de la tâche"}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-black/40">
                        <button
                            onClick={() => removeDraft(i)}
                            className="flex items-center gap-1 hover:text-red-500"
                        >
                            <Trash2 size={14} />
                            <span>Supprimer</span>
                        </button>
                        <span className="text-black/20">|</span>
                        <button
                            onClick={() => startEdit(i)}
                            className="flex items-center gap-1 hover:text-dark-orange"
                        >
                            <Pencil size={14} />
                            <span>Modifier</span>
                        </button>
                        </div>
                    </>
                    )}
                </div>
                ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-black/30 text-sm">
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-black/10 space-y-4">
          {hasDrafts && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium disabled:opacity-50"
            >
              {saving ? "Chargement..." : "+ Ajouter les tâches"}
            </button>
          )}
          <div className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGenerate();
              }}
              placeholder="Décrivez les tâches que vous souhaitez ajouter..."
              disabled={loading}
              className="w-full rounded-full border border-black/10 bg-gray-50 px-4 py-3 pr-12 text-sm outline-none focus:border-dark-orange disabled:opacity-50"
            />
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark-orange text-white flex items-center justify-center disabled:opacity-50"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}