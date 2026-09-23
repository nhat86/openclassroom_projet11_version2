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

export interface ProjectDetailMember{
    id: string;
    role: string;
    joinedAt: string;
    userId: string;
    projectId: string;
    user: UserContributor;
}
 
export interface ProjectDetailTaskAssignee {
  user: UserContributor;
}
 
export interface ProjectDetailTaskComment {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string | null };
}
 
export interface ProjectDetailTask {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  createdAt: string;
  project: { id: string; name: string };
  assignees: ProjectDetailTaskAssignee[];
  comments: ProjectDetailTaskComment[];
}
 
export interface ProjectDetail {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner: UserContributor;
  members: ProjectDetailMember[];
  tasks: ProjectDetailTask[];
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

export async function getProjectById(projectId: string): Promise<ProjectDetail> {
  const res = await fetch(`${API_URL}/projects/${projectId}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Erreur lors de la récupération du projet");
  }
  const result = await res.json();
  return result.data.project;
}

export async function updateProject(
  projectId: string,
  data: {
    name: string;
    description: string;
    contributorIds: string[];
  }
): Promise<Project> {
  const res = await fetch(`${API_URL}/projects/${projectId}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message ?? "Erreur");
  return result.data.project;
}

export async function deleteProject(projectId: string): Promise<void> {
  const res = await fetch(`${API_URL}/projects/${projectId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message ?? "Erreur");
}