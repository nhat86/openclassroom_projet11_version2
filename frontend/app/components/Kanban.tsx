"use client";

import { Task } from "../services/taskService";
import { getStatusInfo, getTaskStatus, statusOrder } from "../../lib/taskStatus";
import { TaskCard } from "./TaskCard";

export function Kanban({ tasks }: { tasks: Task[] }) {
  const columns = statusOrder.map((status) => ({
    status,
    label: getStatusInfo(status).label,
    className: getStatusInfo(status).className,
    tasks: tasks.filter((t) => getTaskStatus(t.status) === status),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map((col) => (
        <div
          key={col.status}
          className="bg-white border border-black/5 rounded-2xl p-4 md:p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{col.label}</h3>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${col.className}`}
            >
              {col.tasks.length}
            </span>
          </div>

          <div className="space-y-3">
            {col.tasks.map((task) => (
              <TaskCard key={task.id} task={task} layout="kanban" />
            ))}

            {col.tasks.length === 0 && (
              <p className="text-sm text-black/40 text-center py-4">
                Aucune tâche
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
