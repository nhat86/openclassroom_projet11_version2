const API_URL = process.env.API_URL ?? "http://localhost:8000";

export interface UserContributor {
    id: string;
    name: string | null;
    email: string;
}
export interface ProjectMember {
  id: string;
  role: string;
  joinedAt: string;
  user_id: string;
  project_id: string;
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
  created_at: string;
  updated_at: string;
  owner_id: string;
  owner: UserContributor;
  members: ProjectMember[];
  tasks: ProjectTask[];
}

export interface ProjectDetailMember{
    id: string;
    role: string;
    joinedAt: string;
    user_id: string;
    project_id: string;
    user: UserContributor;
}
 
export interface ProjectDetailTaskAssignee {
  user: UserContributor;
}
 
export interface ProjectDetailTaskComment {
  id: string;
  content: string;
  created_at: string;
  author: { id: string; name: string | null };
}
 
export interface ProjectDetailTask {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  created_at: string;
  project: { id: string; name: string };
  creator: { id: string; name: string | null };
  assignees: ProjectDetailTaskAssignee[];
  comments: ProjectDetailTaskComment[];
}
 
export interface ProjectDetail {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
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

export async function getProjectById(project_id: string): Promise<ProjectDetail> {
  const res = await fetch(`${API_URL}/projects/${project_id}`, {
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
  project_id: string,
  data: {
    name: string;
    description: string;
    contributorIds: string[];
  }
): Promise<Project> {
  const res = await fetch(`${API_URL}/projects/${project_id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message ?? "Erreur");
  return result.data.project;
}

export async function deleteProject(project_id: string): Promise<void> {
  const res = await fetch(`${API_URL}/projects/${project_id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message ?? "Erreur");
}