import prisma from "../lib/prisma";

/**
 * Récupère les commentaires d'une tâche avec les détails des auteurs
 * @param task_id - ID de la tâche
 * @returns Les commentaires avec les détails des auteurs
 */
export const getTaskComments = async (task_id: string) => {
  const comments = await prisma.comment.findMany({
    where: { task_id },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
    orderBy: { created_at: "asc" },
  });

  return comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    created_at: comment.created_at,
    updated_at: comment.updated_at,
    author: comment.author,
  }));
};
