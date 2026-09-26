const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface GeneratedTask {
  title: string;
  description: string;
  status?: string
  priority?: string;
  dueDate?: string | null;
  assigneeIds?: string[];
}

export async function generateTasks(
  projectId: string,
  prompt: string
): Promise<GeneratedTask[]> {
  const res = await fetch(`${API_URL}/projects/${projectId}/tasks/generate`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message ?? "Erreur");
  return result.data.tasks;
}

export async function createTasksBatch(
  projectId: string,
  tasks: GeneratedTask[]
): Promise<void> {
  const res = await fetch(`${API_URL}/projects/${projectId}/tasks/batch`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tasks }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message ?? "Erreur");
}