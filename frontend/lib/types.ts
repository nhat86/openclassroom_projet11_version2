export type TaskStatus = "A_FAIRE" | "EN_COURS" | "TERMINEE";

export type ProjectRole = "ADMIN" | "CONTRIBUTEUR";

export const ROLE_LABEL: Record<ProjectRole, string> = {
  ADMIN: "Administrateur",
  CONTRIBUTEUR: "Contributeur",
};

export type Collaborator = {
  id: string;
  name: string;
  initials: string;
};

// Un membre est un collaborateur associé à un rôle pour un projet donné.
export type ProjectMember = Collaborator & {
  role: ProjectRole;
};

export type Comment = {
  id: string;
  authorInitials: string;
  authorName: string;
  content: string;
  createdAt: string;
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  assigneeIds: string[];
  comments: Comment[];
};

export type Project = {
  id: string;
  title: string;
  description: string;
  // Liste unique des membres du projet, chacun avec son rôle.
  // L'administrateur (créateur) est le membre avec role === "ADMIN".
  members: ProjectMember[];
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  initials: string;
};


