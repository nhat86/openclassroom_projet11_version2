const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface UserContributor {
    id: string;
    name: string | null;
    email: string;
}
export interface ProjectMember {
  id: string;
  role: string;
  joinedAt: string;
  userId: string;
  projectId: string;
  user: UserContributor;
}
 
export interface ProjectTask {
  id: string;
  status: string;
}
 
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner: UserContributor;
  members: ProjectMember[];
  tasks: ProjectTask[];
}
 
export async function getUsers(): Promise<UserContributor[]> {
    const res = await fetch(`${API_URL}/projects/users`, {
        method: "GET",
        credentials: "include",
    });
    if (!res.ok) {
        throw new Error("Erreur lors de la recherche d'utilisateurs");
    }
    const result = await res.json();
    return result.data.users;
}

export async function createProject(
    name: string,
    description: string,    
    contributorIds: string[]
) {
    const res = await fetch(`${API_URL}/projects`, {   
        method: "POST",
        headers: {
            "Content-Type": "application/json", 
        },
        body: JSON.stringify({ name, description, contributorIds }),
        credentials: "include",
    });
    if (!res.ok) {
        throw new Error("Erreur lors de la création du projet");    
    }
    const data = await res.json();
    if (!data.success) {
        throw new Error(data.message || "Erreur lors de la création du projet");
    }
    return data.data.project;
}

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API_URL}/projects`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des projets");
  }
  const result = await res.json();
  return result.data.projects;
}