import prisma from "../lib/prisma";

/**
 * Vérifie si les utilisateurs sont membres du projet (owner inclus)
 * @param project_id - ID du projet
 * @param user_ids - IDs des utilisateurs à vérifier
 * @returns true si tous les utilisateurs sont membres ou owner, false sinon
 */
export const validateProjectMembers = async (
  project_id: string,
  user_ids: string[]
): Promise<boolean> => {
  if (user_ids.length === 0) return true;

  const project = await prisma.project.findUnique({
    where: { id: project_id },
    select: { owner_id: true },
  });

  if (!project) return false;

  const remainingIds = user_ids.filter((id) => id !== project.owner_id);
  if (remainingIds.length === 0) return true;

  const projectMembers = await prisma.projectMember.findMany({
    where: {
      project_id,
      user_id: { in: remainingIds },
    },
  });

  return projectMembers.length === remainingIds.length;
};

/**
 * Met à jour les assignations d'une tâche
 * @param task_id - ID de la tâche
 * @param assigneeIds - IDs des utilisateurs à assigner
 */
export const updateTaskAssignments = async (
  task_id: string,
  assigneeIds: string[]
): Promise<void> => {
  // Supprimer toutes les assignations existantes
  await prisma.taskAssignee.deleteMany({
    where: { task_id },
  });

  // Ajouter les nouvelles assignations
  if (assigneeIds.length > 0) {
    await prisma.taskAssignee.createMany({
      data: assigneeIds.map((user_id) => ({
        task_id,
        user_id,
      })),
    });
  }
};

/**
 * Récupère les assignations d'une tâche avec les détails des utilisateurs
 * @param task_id - ID de la tâche
 * @returns Les assignations avec les détails des utilisateurs
 */
export const getTaskAssignments = async (task_id: string) => {
  const assignees = await prisma.taskAssignee.findMany({
    where: { task_id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  return assignees.map((assignee) => ({
    id: assignee.id,
    assignedAt: assignee.assignedAt,
    user: assignee.user,
  }));
};
