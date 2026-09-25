export type TaskStatus = "A_FAIRE" | "EN_COURS" | "TERMINEE" | "ANNULEE";

export const BACKEND_STATUS_MAP: Record<string, TaskStatus> = {
  TODO: "A_FAIRE",
  IN_PROGRESS: "EN_COURS",
  DONE: "TERMINEE",
  CANCELLED: "ANNULEE",
};

export const statusStyles: Record<TaskStatus, string> = {
  A_FAIRE:
    "bg-[var(--color-status-todo-bg)] text-[var(--color-status-todo-text)]",
  EN_COURS:
    "bg-[var(--color-status-progress-bg)] text-[var(--color-status-progress-text)]",
  TERMINEE:
    "bg-[var(--color-status-done-bg)] text-[var(--color-status-done-text)]",
  ANNULEE:
    "bg-[var(--color-status-cancel-bg)] text-[var(--color-status-cancel-text)]",
};

export const statusLabels: Record<TaskStatus, string> = {
  A_FAIRE: "À faire",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
  ANNULEE: "Annulée",
};

export const statusOrder: TaskStatus[] = ["A_FAIRE", "EN_COURS", "TERMINEE", "ANNULEE"];

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
export const FRONTEND_TO_BACKEND: Record<TaskStatus, string> = {
  A_FAIRE: "TODO",
  EN_COURS: "IN_PROGRESS",
  TERMINEE: "DONE",
  ANNULEE: "CANCELLED",
};
export const PRIORITY_ORDER: Record<string, number> = {
  URGENT: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4,
};
