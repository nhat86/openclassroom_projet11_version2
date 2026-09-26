import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../types";
import { sendSuccess, sendError, sendServerError } from "../utils/response";


export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      sendError(res, "Non authentifié", "UNAUTHORIZED", 401);
      return;
    }

    const { projectId } = req.params;
    const {
      title,
      description,
      status = "TODO",
      priority = "MEDIUM",
      dueDate,
      assigneeIds = [],
    } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: { where: { userId: authReq.user.id } },
      },
    });

    if (!project) {
      sendError(res, "Projet non trouvé", "NOT_FOUND", 404);
      return;
    }

    const isMember =
      project.ownerId === authReq.user.id || project.members.length > 0;

    if (!isMember) {
      sendError(res, "Non autorisé", "FORBIDDEN", 403);
      return;
    }

    if (!title || title.trim().length < 2) {
      sendError(res, "Titre requis", "BAD_REQUEST", 400);
      return;
    }
    if (!description || description.trim().length < 1) {
        sendError(res, "Description requise", "BAD_REQUEST", 400);
        return;
    }
    if (!dueDate) {
        sendError(res, "Échéance requise", "BAD_REQUEST", 400);
        return;
    }
 
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate: new Date(dueDate),
        projectId,
        creatorId: authReq.user.id,
        assignees: {
          create: Array.isArray(assigneeIds)
            ? assigneeIds
                .filter((userId: string) => userId !== authReq.user!.id)
                .map((userId: string) => ({ userId }))
            : [],
        },
      },
      include: {
        project: { select: { id: true, name: true } },
        assignees: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        comments: {
          include: {
            author: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    sendSuccess(res, "Tâche créée avec succès", { task });
  } catch (error) {
    console.error("createTask error:", error);
    sendServerError(res, "Erreur lors de la création de la tâche");
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      sendError(res, "Non authentifié", "UNAUTHORIZED", 401);
      return;
    }

    const {projectId, taskId} = req.params;
    const {title, description, status, priority, dueDate, assigneeIds} = req.body;

    const task = await prisma.task.findUnique({
      where: {id: taskId},
      include: {
        project: {
          include: {
            members: {
              where: {
                userId: authReq.user.id
              }
            }
          }
        }
      } 
    })

    if (!task || task.projectId !== projectId){
      sendError(res, "Tâche non trouvé", "NOT FOUND", 404);
      return;
    }

    const isAuthor = task.creatorId === authReq.user.id;
    const isAdminOrOwner =
      task.project.ownerId === authReq.user.id ||
      task.project.members.some((m) => m.role === "ADMIN");
    
    if (!isAuthor && !isAdminOrOwner){
      sendError(res, "Non autorisé", "FORBIDDEN", 403);
      return;
    }

    await prisma.taskAssignee.deleteMany({where: {taskId}});
    if (!title || title.trim().length < 2) {
      sendError(res, "Titre requis", "BAD_REQUEST", 400);
      return;
    }

    if (!description || description.trim().length < 1) {
      sendError(res, "Description requise", "BAD_REQUEST", 400);
      return;
    }

    const updatedTask = await prisma.task.update({
      where: {id: taskId},
      data: {
        title: title?.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate: new Date(dueDate)?? undefined,
        assignees: {
          create: Array.isArray(assigneeIds)
          ? assigneeIds.map((userId:string) => ({userId}))
          : [],
        },
      },
      include:{
        project: { select: { id: true, name: true } },
        creator: { select: { id: true, name: true } },
        assignees: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        comments: {
          include: {
            author: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    sendSuccess(res, "Tâche mise a jour", {task: updatedTask});
  } catch(error){
    console.error("updatedTask error", error)
    sendServerError(res, "Erreur lors de la mise à jour de la tâche");
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      sendError(res, "Non authentifié", "UNAUTHORIZED", 401);
      return;
    }
 
    const { projectId, taskId } = req.params;
 
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          include: { members: { where: { userId: authReq.user.id } } },
        },
      },
    });
 
    if (!task || task.projectId !== projectId) {
      sendError(res, "Tâche non trouvée", "NOT_FOUND", 404);
      return;
    }
 
    const isAuthor = task.creatorId === authReq.user.id;
    const isAdminOrOwner =
      task.project.ownerId === authReq.user.id ||
      task.project.members.some((m) => m.role === "ADMIN");
 
    if (!isAuthor && !isAdminOrOwner) {
      sendError(res, "Non autorisé", "FORBIDDEN", 403);
      return;
    }
 
    await prisma.task.delete({ where: { id: taskId } });
 
    sendSuccess(res, "Tâche supprimée");
  } catch (error) {
    console.error("deleteTask error:", error);
    sendServerError(res, "Erreur lors de la suppression de la tâche");
  }
};