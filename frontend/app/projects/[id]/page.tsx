"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProjectById, deleteProject, type ProjectDetail } from "../../services/projectService";
import { ProjectTaskItem } from "../../components/ProjectTaskItem";
import { Navbar } from "../../components/Navbar";
import { getInitials } from "../../../lib/getInitialName";
import { filteredTasks as filterTask } from "../../../lib/searchTask";
import { BACKEND_STATUS_MAP, PRIORITY_ORDER } from "../../../lib/taskStatus";
import { Search, ArrowLeft } from "lucide-react";
import Image from "next/image";
import  {getProfile, type User} from "../../services/authService";
import { UpdateProjectModal } from "../../components/modals/UpdateProjectModal";
import {CreateTaskModal} from "../../components/modals/CreateTaskModal";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState<"liste" | "calendrier">("liste");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("TOUS");
  const [user, setUser] = useState<User | null> (null)
  const [showEditProject, setShowEditProject] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const displayedTasks = useMemo(() => {
    if (!project) return [];

    const list = [...project.tasks];
    if (view === "calendrier") {
      list.sort(
        (a, b) =>
          new Date(a.dueDate ?? "9999-12-31").getTime() -
          new Date(b.dueDate ?? "9999-12-31").getTime()
      );
    } else {
      list.sort(
        (a, b) =>
          (PRIORITY_ORDER[a.priority] ?? 999) -
          (PRIORITY_ORDER[b.priority] ?? 999)
      );
    }

    const statusFiltered =
      statusFilter === "TOUS"
        ? list
        : list.filter(
            (task) => (BACKEND_STATUS_MAP[task.status] ?? task.status) === statusFilter
          );

    return filterTask(statusFiltered, search);
  }, [project, view, statusFilter, search]);

    

  useEffect(() => {
    if (!id) return;
    getProjectById(id)
      .then(setProject)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Erreur");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    getProfile()
    .then(setUser)
    .catch(()=> setUser(null));
  }, []);


  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!project) return <p>Projet introuvable.</p>;

  const isAdmin =
      project.ownerId === user?.id ||
      project.members.some(
        (m) => m.userId === user?.id && m.role === "ADMIN"
      );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="px-6 md:px-10 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
            <div>
              <div className="flex items-center gap-2">
                <button
                    onClick={() => router.push("/projects")}
                    className="p-2 rounded-lg border border-black/10 bg-white hover:bg-black/5 transition"
                >
                    <ArrowLeft size={18} />
                </button>
                <h1 className="text-2xl font-semibold">{project.name}</h1>
                <button
                  onClick={() => setShowEditProject(true)}
                  className="text-xs text-dark-orange underline"
                >
                  Modifier
                </button>
                <button
                  onClick={async () => {
                    if (!confirm("Voulez-vous vraiment supprimer ce projet ?")) return;
                    try {
                      await deleteProject(project.id);
                      router.push("/projects");
                    } catch (error) {
                      alert("Erreur lors de la suppression");
                    }
                  }}
                  className="text-xs text-red-500 underline"
                >
                  Supprimer
                </button>
              </div>
              <p className="text-black/60 mt-1 max-w-2xl">{project.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateTask(true)}
                className="bg-black text-white text-sm px-4 py-2.5 rounded-lg"
              >
                Créer une tâche
              </button>
              <button className="bg-dark-orange text-white text-sm px-4 py-2.5 rounded-lg">
                IA
              </button>
            </div>
          </div>
        </div>

        {/* Contributeurs */}
        <div className="bg-[#F3F4F6] border border-black/5 rounded-2xl py-[20px] px-[50px] mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-sm mb-3">
            <h2 className="font-semibold text-lg">
              Contributeurs 
            </h2>
            <span className="text-black/40 text-sm">
                {project.members.length + 1} personnes
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-normal bg-light-orange text-gris">
            {getInitials(project.owner.name)}
            </span>
            <span className="items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-normal bg-light-orange text-dark-orange">Propriétaire</span>
            
            {project.members.map((m) => (
              <div key={m.id} className="inline-flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center rounded-full bg-black/5 px-2.5 py-1 text-xs font-normal text-gris">
                  {getInitials(m.user.name ?? m.user.email)}
                </span>
                <span className="inline-flex items-center justify-center rounded-full bg-black/5 px-2.5 py-1 font-normal text-xs text-black/60">{m.user.name ?? m.user.email}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tâches */}
        <div className="bg-white border border-black/5 rounded-2xl p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <div>
              <h2 className="font-semibold text-lg">Tâches</h2>
              <p className="text-sm text-black/40">Par ordre de priorité</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("liste")}
                className={`px-4 py-2 text-sm rounded-lg text-dark-orange ${
                  view === "liste" ? "bg-light-orange" : "bg-none"
                }`}
              >
                <span className="flex items-center gap-1">
                    <Image src="/Group.png" alt="" width={16} height={16} />
                    Liste
                </span>
              </button>
              <button
                onClick={() => setView("calendrier")}
                className={`px-4 py-2 text-sm rounded-lg text-dark-orange ${
                  view === "calendrier" ? "bg-light-orange " : "bg-none"
                }`}
              >
                <span className="flex items-center gap-1">
                    <Image
                        src="/calendrier_orange.png"
                        alt="Échéance"
                        width={16}
                        height={16}
                        color="dark-orange"
                    />
                    Calendrier
                </span>
              </button>
              <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-black/10 rounded-lg px-4 py-2 text-sm"
                    >
                    <option value="TOUS">Statut</option>
                    <option value="A_FAIRE">À faire</option>
                    <option value="EN_COURS">En cours</option>
                    <option value="TERMINEE">Terminée</option>
               </select>
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
          </div>

          <div className="space-y-4">
            {displayedTasks.length === 0 && (
                <p className="text-sm text-black/40">Aucune tâche trouvée.</p>
            )}
            {displayedTasks.map((task) => (
                <ProjectTaskItem 
                    key={task.id} 
                    task={task} 
                    currentUser={user}
                    isAdmin={isAdmin}
                    onCommentUpdated={()=> id && getProjectById(id).then(setProject)}/>
            ))}
          </div>
        </div>

        {/* Modale modifier project */}
        {showEditProject && (
          <UpdateProjectModal
            project={project}
            onClose={() => setShowEditProject(false)}
            onUpdated={() => id && getProjectById(id).then(setProject)}
          />
        )}

        {/* Modale create task */}
        {showCreateTask && (
          <CreateTaskModal
            project={project}
            onClose={() => setShowCreateTask(false)}
            onCreated={() => id && getProjectById(id).then(setProject)}
          />
        )}
      </main>
    </div>
  );
}