import { Role } from "../types";
import prisma from "../lib/prisma";

/**
 * Vérifie si un utilisateur a accès à un projet
 * @param user_id - ID de l'utilisateur
 * @param project_id - ID du projet
 * @returns true si l'utilisateur a accès, false sinon
 */
export const hasProjectAccess = async (
  user_id: string,
  project_id: string
): Promise<boolean> => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: project_id,
        OR: [
          { owner_id: user_id },
          {
            members: {
              some: {
                user_id: user_id,
              },
            },
          },
        ],
      },
    });

    return !!project;
  } catch (error) {
    console.error("Erreur lors de la vérification d'accès au projet:", error);
    return false;
  }
};

/**
 * Vérifie si un utilisateur est administrateur d'un projet
 * @param user_id - ID de l'utilisateur
 * @param project_id - ID du projet
 * @returns true si l'utilisateur est admin, false sinon
 */
export const isProjectAdmin = async (
  user_id: string,
  project_id: string
): Promise<boolean> => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: project_id,
        OR: [
          { owner_id: user_id },
          {
            members: {
              some: {
                user_id: user_id,
                role: Role.ADMIN,
              },
            },
          },
        ],
      },
    });

    return !!project;
  } catch (error) {
    console.error("Erreur lors de la vérification des droits d'admin:", error);
    return false;
  }
};

/**
 * Vérifie si un utilisateur est propriétaire d'un projet
 * @param user_id - ID de l'utilisateur
 * @param project_id - ID du projet
 * @returns true si l'utilisateur est propriétaire, false sinon
 */
export const isProjectOwner = async (
  user_id: string,
  project_id: string
): Promise<boolean> => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: project_id,
        owner_id: user_id,
      },
    });

    return !!project;
  } catch (error) {
    console.error("Erreur lors de la vérification de propriété:", error);
    return false;
  }
};

/**
 * Vérifie si un utilisateur peut créer des tâches dans un projet
 * @param user_id - ID de l'utilisateur
 * @param project_id - ID du projet
 * @returns true si l'utilisateur peut créer des tâches, false sinon
 */
export const canCreateTasks = async (
  user_id: string,
  project_id: string
): Promise<boolean> => {
  return await hasProjectAccess(user_id, project_id);
};

/**
 * Vérifie si un utilisateur peut modifier/supprimer des tâches dans un projet
 * @param user_id - ID de l'utilisateur
 * @param project_id - ID du projet
 * @returns true si l'utilisateur peut modifier des tâches, false sinon
 */
export const canModifyTasks = async (
  user_id: string,
  project_id: string
): Promise<boolean> => {
  return await hasProjectAccess(user_id, project_id);
};

/**
 * Vérifie si un utilisateur peut modifier un projet
 * @param user_id - ID de l'utilisateur
 * @param project_id - ID du projet
 * @returns true si l'utilisateur peut modifier le projet, false sinon
 */
export const canModifyProject = async (
  user_id: string,
  project_id: string
): Promise<boolean> => {
  return await isProjectAdmin(user_id, project_id);
};

/**
 * Vérifie si un utilisateur peut supprimer un projet
 * @param user_id - ID de l'utilisateur
 * @param project_id - ID du projet
 * @returns true si l'utilisateur peut supprimer le projet, false sinon
 */
export const canDeleteProject = async (
  user_id: string,
  project_id: string
): Promise<boolean> => {
  return await isProjectOwner(user_id, project_id);
};

/**
 * Récupère le rôle d'un utilisateur dans un projet
 * @param user_id - ID de l'utilisateur
 * @param project_id - ID du projet
 * @returns Le rôle de l'utilisateur ou null s'il n'a pas accès
 */
export const getUserProjectRole = async (
  user_id: string,
  project_id: string
): Promise<Role | null> => {
  try {
    // Vérifier si l'utilisateur est propriétaire
    const isOwner = await isProjectOwner(user_id, project_id);
    if (isOwner) {
      return Role.ADMIN;
    }

    // Vérifier le rôle dans les membres
    const membership = await prisma.projectMember.findFirst({
      where: {
        user_id: user_id,
        project_id: project_id,
      },
    });

    return membership ? (membership.role as Role) : null;
  } catch (error) {
    console.error("Erreur lors de la récupération du rôle:", error);
    return null;
  }
};
