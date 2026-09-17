"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { getProfile, type User } from "../../services/authService";
import { Navbar } from "../../components/Navbar";
import { getUserTasks, type Task } from "../../services/taskService";
import { TaskList } from "../../components/TaskList";
import { Kanban } from "../../components/Kanban";
import { CreateProjectModal } from "../../components/modals/CreateProjectModal";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<"liste" | "kanban">("liste");
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [errorTasks, setErrorTasks] = useState("");
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    getProfile().then(setUser).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    getUserTasks()
      .then(setTasks)
      .catch((error) => {
        console.error("Erreur lors de la récupération des tâches:", error);
        setErrorTasks("Impossible de récupérer les tâches");
      })
      .finally(() => setLoadingTasks(false));
  }, []);

  const filteredTasks = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return tasks;
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(term) ||
        (task.project?.name ?? "").toLowerCase().includes(term)
    );
  }, [search, tasks]);

  if (!user) {
    return (
      <main className="p-8">
        <p>Chargement...</p>
      </main>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-6 md:px-10 py-10">
        
        {/* Bar de presentation et bouton de création de projet */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Tableau de bord</h1>
            <p className="text-black text-[18px]">
              Bonjour {user.name ?? "utilisateur"}, voici un aperçu de vos
              projets et tâches
            </p>
          </div>
          <button
            onClick={() => setShowCreateProject(true)}
            className="bg-black text-white text-sm font-medium px-5 py-3 rounded-lg hover:bg-black transition-colors shrink-0"
          >
            + Créer un projet
          </button>
        </div>
        {/* Bar de liste et kanban */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => setView("liste")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              view === "liste"
                ? "bg-light-orange text-dark-orange"
                : "bg-white text-dark-orange hover:bg-black/5"
            }`}
          >
            <Image src="/Group.png" alt="" width={16} height={16} />
            Liste
          </button>
          <button
            onClick={() => setView("kanban")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              view === "kanban"
                ? "bg-light-orange text-dark-orange"
                : "bg-white text-dark-orange hover:bg-black/5"
            }`}
          >
            <Image src="/Union.png" alt="" width={16} height={16} />
            Kanban
          </button>
        </div>
        {/* Liste des projets */}
        {view === "liste" ? (
          <div className="bg-white border border-black/5 rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
              <div>
                <h2 className="font-semibold text-lg">Mes tâches assignées</h2>
                <p className="text-sm text-black/40">Par ordre de priorité</p>
              </div>
              <div className="relative">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher une tâche"
                  className="border border-black/10 rounded-lg pl-4 pr-10 py-2.5 text-sm outline-none focus:border-dark-orange w-64"
                />
                <Search
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="space-y-4">
              {loadingTasks && <p>Chargement des tâches...</p>}
              {errorTasks && <p className="text-red-600">{errorTasks}</p>}
              {!loadingTasks && <TaskList tasks={filteredTasks} />}
            </div>
          </div>
        ):(
          <div className="bg-white border border-black/5 rounded-2xl p-6 md:p-8">
            {loadingTasks && <p>Chargement des tâches...</p>}
            {errorTasks && <p className="text-red-600">{errorTasks}</p>}
            {!loadingTasks && <Kanban tasks={tasks} />}
          </div>
        )}
      </main>

      {showCreateProject && (
        <CreateProjectModal
          onClose={() => setShowCreateProject(false)}
          onProjectCreated={() => getUserTasks().then(setTasks)}
        />
      )}
    </div>
  );
}
