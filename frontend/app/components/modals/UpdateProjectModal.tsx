"use client";

import { useEffect, useState } from "react";
import { getUsers, updateProject, type Project } from "../../services/projectService";
import { ContributorSelect } from "../ContributorSelect";
import { X } from "lucide-react";

export function UpdateProjectModal({
  project,
  onClose,
  onUpdated,
}: {
  project: Project;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [contributorIds, setContributorIds] = useState<string[]>(
    project.members.map((m) => m.userId)
  );
  const [users, setUsers] = useState<{ id: string; name: string | null; email: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProject(project.id, { name, description, contributorIds });
      onUpdated();
      onClose();
    } catch (error) {
        console.error("Erreur lors de la mise à jour du projet:", error);
        alert("Erreur lors de la mise à jour du projet");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-6">Modifier un projet</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre*</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-black/10 rounded-lg px-4 py-2.5"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description*</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-black/10 rounded-lg px-4 py-2.5"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contributeurs</label>
            <ContributorSelect
              users={users}
              selectedIds={contributorIds}
              onChange={setContributorIds}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg py-3 mt-4"
          >
            {loading ? "Chargement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}