export type TaskStatus = "A_FAIRE" | "EN_COURS" | "TERMINEE";

export const BACKEND_STATUS_MAP: Record<string, TaskStatus> = {
  TODO: "A_FAIRE",
  IN_PROGRESS: "EN_COURS",
  DONE: "TERMINEE",
};

export const statusStyles: Record<TaskStatus, string> = {
  A_FAIRE:
    "bg-[var(--color-status-todo-bg)] text-[var(--color-status-todo-text)]",
  EN_COURS:
    "bg-[var(--color-status-progress-bg)] text-[var(--color-status-progress-text)]",
  TERMINEE:
    "bg-[var(--color-status-done-bg)] text-[var(--color-status-done-text)]",
};

export const statusLabels: Record<TaskStatus, string> = {
  A_FAIRE: "À faire",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
};

export const statusOrder: TaskStatus[] = ["A_FAIRE", "EN_COURS", "TERMINEE"];

export function getTaskStatus(backendStatus: string): TaskStatus {
  return BACKEND_STATUS_MAP[backendStatus] ?? (backendStatus as TaskStatus);
}

export function getStatusInfo(backendStatus: string) {
  const normalized = getTaskStatus(backendStatus);
  return {
    label: statusLabels[normalized as TaskStatus] ?? normalized,
    className: statusStyles[normalized as TaskStatus] ?? "bg-black/5 text-black/60",
  };
}

export const PRIORITY_ORDER: Record<string, number> = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};