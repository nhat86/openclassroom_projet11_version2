"use client";

import { Task } from "../services/taskService";
import { TaskCard } from "./TaskCard";

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <p>Aucune tâche trouvée.</p>;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} layout="list" />
      ))}
    </div>
  );
}
