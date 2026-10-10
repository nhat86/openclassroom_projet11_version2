const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  project: {
    id: string;
    name: string;
    description?: string | null;
  };
  assignees: Array<{
    user: { id: string; name: string | null; email: string };
  }>;
  comments: Array<{
    id: string;
    content: string;
    created_at: string;
    author: { name: string | null; email: string };
  }>;
}

export async function getUserTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/dashboard/tasks`, {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message ?? "Impossible de récupérer les tâches");
  }

  return result.data.tasks;
}

export async function createTask(
  project_id: string,
  data: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    due_date?: string;
    assigneeIds?: string[];
  }
): Promise<Task> {
  const res = await fetch(`${API_URL}/projects/${project_id}/tasks`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message ?? "Erreur");
  return result.data.task;
}

export async function updateTask(
  project_id: string,
  task_id: string,
  data: {
    title: string;
    description?: string;
    status: string;
    priority: string;
    due_date?: string;
    assigneeIds: string[];
  }
): Promise<Task>{
  const res = await fetch(`${API_URL}/projects/${project_id}/tasks/${task_id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result=await res.json();
  if(!res.ok) throw new Error(result.message ?? "Erreur");
  return result.data.task;
}

export async function deleteTask(
  project_id: string,
  task_id: string,
): Promise<void>{
  const res = await fetch(`${API_URL}/projects/${project_id}/tasks/${task_id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const result=await res.json();
  if(!res.ok) throw new Error(result.message ?? "Erreur");
}