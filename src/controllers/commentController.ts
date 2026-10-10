import {Request, Response} from "express";
import prisma from "../lib/prisma";
import {AuthRequest} from "../types";
import {sendSuccess, sendError, sendServerError} from "../utils/response";

const isProjectAdminOrOwner = async (project_id: string, user_id: string): Promise<boolean> => {
  const project = await prisma.project.findUnique({
    where: { id: project_id },
    include: {
      members: {
        where: { user_id },
      },
    },
  });
  if (!project) return false;
  return project.owner_id === user_id || project.members.some(member => member.role === "ADMIN");
};

const isProjectMember = async (project_id: string, user_id: string): Promise<boolean> => {
  const project = await prisma.project.findUnique({
    where: { id: project_id },   
    include: {
        members: {
            where: {user_id},
        },
    },
  });
  if (!project) return false;
  return project.owner_id === user_id || 
         project.members.some(member => member.user_id === user_id);
};


export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      sendError(res, "Utilisateur non authentifié", "UNAUTHORIZED", 401);
      return;
    }
    const { project_id, task_id } = req.params;
    const { content } = req.body;
    if (!content || content.trim().length < 1) {
      sendError(res, "Contenu du commentaire requis", "BAD_REQUEST", 400);
      return;
    }
    const isMember = await isProjectMember(project_id, authReq.user.id);
    if (!isMember) {
      sendError(res, "Vous n'êtes pas membre de ce projet", "FORBIDDEN", 403);
      return;
    }   
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        author_id: authReq.user.id,
        task_id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });
    sendSuccess(res, "Commentaire créé avec succès", {comment});
  } catch (error) {
    sendServerError(res, "Erreur lors de la création du commentaire");
  }
} 

export const updateComment = async(req: Request, res: Response): Promise<void> =>{
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      sendError(res, "Utilisateur non authentifié", "UNAUTHORIZED", 401);
      return;
    }
 
    const { commentId } = req.params;
    const { content } = req.body;
 
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        task: {
          include: {
            project: {
              include: { members: { where: { user_id: authReq.user.id } } },
            },
          },
        },
      },
    });
 
    if (!comment) {
      sendError(res, "Commentaire non trouvé", "NOT_FOUND", 404);
      return;
    }
    const isAuthor = comment.author_id === authReq.user.id;
    const isAdminOrOwner = await isProjectAdminOrOwner(
      comment.task.project_id,
      authReq.user.id
    );
    if (!isAuthor && !isAdminOrOwner) {
      sendError(res, "Non autorisé", "FORBIDDEN", 403);
      return;
    }
    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content: content.trim() },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });
 
    sendSuccess(res, "Commentaire mis à jour", { comment: updated });
  }catch (error) {
    console.error(error);
    sendServerError(res, "Erreur lors de la mise à jour du commentaire");
  }
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      sendError(res, "Utilisateur non authentifié", "UNAUTHORIZED", 401);
      return;
    }
 
    const { commentId } = req.params;
 
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        task: {
          include: {
            project: {
              include: { members: { where: { user_id: authReq.user.id } } },
            },
          },
        },
      },
    });
 
    if (!comment) {
      sendError(res, "Commentaire non trouvé", "NOT_FOUND", 404);
      return;
    }
 
    const isAuthor = comment.author_id === authReq.user.id;
    const isAdminOrOwner = await isProjectAdminOrOwner(
      comment.task.project_id,
      authReq.user.id
    );

    if (!isAuthor && !isAdminOrOwner) {
      sendError(res, "Non autorisé", "FORBIDDEN", 403);
      return;
    }
 
    await prisma.comment.delete({ where: { id: commentId } });
 
    sendSuccess(res, "Commentaire supprimé");
  } catch (error) {
    console.error(error);
    sendServerError(res, "Erreur lors de la suppression du commentaire");
  }
};