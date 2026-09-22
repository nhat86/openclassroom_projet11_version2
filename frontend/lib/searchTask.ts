type SearchableTask = {
  title: string;
  description: string | null;
  project?: { name: string } | null;
};

export function filteredTasks<T extends SearchableTask>(
  tasks: T[],
  search: string
): T[] {
  const term = search.trim().toLowerCase();
  if (!term) return tasks;

  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(term) ||
      (task.description ?? "").toLowerCase().includes(term) ||
      (task.project?.name ?? "").toLowerCase().includes(term)
  );
}