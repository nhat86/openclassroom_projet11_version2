import {
  DndContext,
  useDroppable,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { Task } from "../services/taskService";
import { getTaskStatus, statusOrder, getStatusInfo, FRONTEND_TO_BACKEND } from "../../lib/taskStatus";
import { TaskCard } from "./TaskCard";
import { updateTask } from "../services/taskService";

function KanbanColumn({
  status,
  label,
  className,
  tasks,
}: {
  status: string;
  label: string;
  className: string;
  tasks: Task[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `col-${status}` });

  return (
    <div
      ref={setNodeRef}
      className={`bg-white border border-black/5 rounded-2xl p-4 md:p-5 min-h-[200px] ${
        isOver ? "bg-orange-50" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{label}</h3>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${className}`}
        >
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} layout="kanban" />
        ))}
      </div>
    </div>
  );
}

export function Kanban({
  tasks,
  projectId,
  onUpdate,
}: {
  tasks: Task[];
  projectId: string;
  onUpdate?: () => void;
}) {
  const [items, setItems] = useState<Task[]>(tasks);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const task = active.data.current?.task as Task;
    const frontendStatus = (over.id as string).replace("col-", "");
    const newBackendStatus = FRONTEND_TO_BACKEND[frontendStatus as TaskStatus];

    const projectIdToUse = projectId ?? task.project?.id;

    if (!projectIdToUse || !task || !newBackendStatus) return;

    // Mise à jour optimiste du state
    setItems((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, status: newBackendStatus } : t
      )
    );

    await updateTask(projectIdToUse, task.id, {
      title: task.title,
      description: task.description ?? "",
      status: newBackendStatus,
      priority: task.priority,
      dueDate: task.dueDate,
      assigneeIds: task.assignees.map((a) => a.user.id),
    });

    onUpdate?.();
  }

  const columns = statusOrder.map((status) => ({
    status,
    label: getStatusInfo(status).label,
    className: getStatusInfo(status).className,
    tasks: items.filter((t) => getTaskStatus(t.status) === status),
  }));

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {columns.map((col) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            label={col.label}
            className={col.className}
            tasks={col.tasks}
          />
        ))}
      </div>
    </DndContext>
  );
}