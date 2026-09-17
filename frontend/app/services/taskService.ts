const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
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
    createdAt: string;
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