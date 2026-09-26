"use client";

import { useEffect, useState } from "react";
import {
  createProject,
  getUsers,
  type UserContributor,
} from "../../services/projectService";
import { ContributorSelect } from "../ContributorSelect";
import { Modal } from "../Modal";

export function CreateProjectModal({
  onClose,
  onProjectCreated,
}: {
  onClose: () => void;
  onProjectCreated?: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contributors, setContributors] = useState<UserContributor[]>([]);
  const [selectedContributors, setSelectedContributors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getUsers()
      .then(setContributors)
      .catch(() => setError("Erreur lors de la récupération des utilisateurs"));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createProject(
        name.trim(),
        description.trim(),
        selectedContributors
      );
      onProjectCreated?.();
      onClose();
      setName("");
      setDescription("");
      setSelectedContributors([]);
    } catch (err: any) {
      setError(err.message ?? "Erreur lors de la création du projet");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit =
    name.trim() && description.trim() && selectedContributors.length > 0;

  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-semibold mb-6">Créer un projet</h2>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm mb-1.5">Titre *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            data-testid="project-name"
            className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-dark-orange"
          />
        </div>

        <div>
          <label className="block text-sm mb-1.5">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
            data-testid="project-description"
            className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-dark-orange"
          />
        </div>

        <div>
          <label className="block text-sm mb-1.5">Contributeurs</label>
          <ContributorSelect
            users={contributors}
            selectedIds={selectedContributors}
            onChange={setSelectedContributors}
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loading}
          data-testid="project-submit"
          className={`block text-center pt-[13px] pr-[74px] pb-[13px] pl-[74px] rounded-lg font-medium transition-colors ${
            canSubmit && !loading
              ? "bg-black text-white hover:bg-black/80"
              : "bg-black/10 text-black/40 cursor-not-allowed"
          }`}
        >
          {loading ? "Création..." : "Ajouter un projet"}
        </button>
      </form>
    </Modal>
  );
}
