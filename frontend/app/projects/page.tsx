"use client";

import { useEffect, useState } from "react";
import { getProjects, type Project } from "../services/projectService";
import { ProjectCard } from "../components/ProjectCard";
import { CreateProjectModal } from "../components/modals/CreateProjectModal";
import { Navbar } from "../components/Navbar";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateProject, setShowCreateProject] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.message ?? "Erreur");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="px-6 md:px-10 py-10">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Mes projets</h1>
            <p className="text-black/60">Gérez vos projets</p>
          </div>
          <button
            onClick={() => setShowCreateProject(true)}
            className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-5 py-3 rounded-lg hover:bg-black/80 transition-colors"
          >
            + Créer un projet
          </button>
        </div>

        {loading && <p>Chargement...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && projects.length === 0 && (
          <p className="text-black/40">Aucun projet trouvé.</p>
        )}

        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>

      {showCreateProject && (
        <CreateProjectModal
          onClose={() => setShowCreateProject(false)}
          onProjectCreated={() => {
            setShowCreateProject(false);
            load();
          }}
        />
      )}
    </div>
  );
}