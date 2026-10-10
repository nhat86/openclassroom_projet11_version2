import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../types";
import { sendSuccess, sendError, sendServerError } from "../utils/response";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    sendSuccess(res, "Utilisateurs récupérés avec succès", { users });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    sendServerError(res, "Erreur lors de la récupération des utilisateurs");
  }
};

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      sendError(res, "Utilisateur non authentifié", "UNAUTHORIZED", 401);
      return;
    }
    const { name, description, contributorIds } = req.body;
    if (!name || name.trim().length < 2) {
      sendError(res, "Nom du projet requis", "BAD_REQUEST", 400);
      return;
    }
    const members = Array.isArray(contributorIds)
      ? contributorIds
          .filter((id: string) => id !== authReq.user!.id)
          .map((user_id: string) => ({ user_id, role: "CONTRIBUTOR" }))
      : [];
    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() ?? "",
        owner_id: authReq.user.id,
        members: {
          create: members,
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
    sendSuccess(res, "Projet créé avec succès", { project });
  } catch (error) {
    console.error("Erreur lors de la création du projet:", error);
    sendServerError(res, "Erreur lors de la création du projet");
  }
};

export const getProject= async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      sendError(res, "Utilisateur non authentifié", "UNAUTHORIZED", 401);
      return;
    }  
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { owner_id: authReq.user.id },
          { members: { some: { user_id: authReq.user.id } } },
        ],
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        tasks: { select: { id: true, status: true } },
      },
      orderBy: { created_at: "desc" },
    });
    sendSuccess(res, "Projets récupérés avec succès", { projects });
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
    sendServerError(res, "Erreur lors de la récupération des projets");
  }
};

export const getProjectById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      sendError(res, "Utilisateur non authentifié", "UNAUTHORIZED", 401);
      return;
    }

    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        tasks: {
          include: {
            project: { select: { id: true, name: true } },
            creator: { select: { id: true, name: true } },
            assignees: {
              include: {
                user: { select: { id: true, name: true, email: true } },
              },
            },
            comments: {
              include: {
                author: { select: { id: true, name: true, email: true } },
              },
              orderBy: { created_at: "asc" },
            },
          },
          orderBy: { created_at: "desc" },
        },
      },
    });

    if (!project) {
      sendError(res, "Projet non trouvé", "NOT_FOUND", 404);
      return;
    }

    const isMember = project.members.some(
      (member) => member.user_id === authReq.user!.id
    );
    if (project.owner_id !== authReq.user.id && !isMember) {
      sendError(res, "Accès refusé", "FORBIDDEN", 403);
      return;
    }

    sendSuccess(res, "Projet récupéré avec succès", { project });
  } catch (error) {
    console.error("Erreur lors de la récupération du projet:", error);
    sendServerError(res, "Erreur lors de la récupération du projet");
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      sendError(res, "Non authentifié", "UNAUTHORIZED", 401);
      return;
    }

    const { id } = req.params;
    const { name, description, contributorIds } = req.body;

    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      sendError(res, "Projet non trouvé", "NOT_FOUND", 404);
      return;
    }

    if (existingProject.owner_id !== authReq.user.id) {
      sendError(res, "Non autorisé", "FORBIDDEN", 403);
      return;
    }

    if (!name || name.trim().length < 2) {
      sendError(res, "Nom requis", "BAD_REQUEST", 400);
      return;
    }

    const members = Array.isArray(contributorIds)
      ? contributorIds
          .filter((user_id: string) => user_id !== authReq.user!.id)
          .map((user_id: string) => ({ user_id, role: "CONTRIBUTOR" }))
      : [];

    await prisma.projectMember.deleteMany({
      where: { project_id: id },
    });

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() ?? "",
        members: {
          create: members,
        },
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    sendSuccess(res, "Projet mis à jour avec succès", { updatedProject });
  } catch (error) {
    console.error(error);
    sendServerError(res, "Erreur lors de la mise à jour du projet");
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      sendError(res, "Non authentifié", "UNAUTHORIZED", 401);
      return;
    }
 
    const { id } = req.params;
 
    const project = await prisma.project.findUnique({
      where: { id },
    });
 
    if (!project) {
      sendError(res, "Projet non trouvé", "NOT_FOUND", 404);
      return;
    }
 
    if (project.owner_id !== authReq.user.id) {
      sendError(res, "Non autorisé", "FORBIDDEN", 403);
      return;
    }
 
    await prisma.project.delete({
      where: { id },
    });
 
    sendSuccess(res, "Projet supprimé avec succès");
  } catch (error) {
    console.error(error);
    sendServerError(res, "Erreur lors de la suppression du projet");
  }
};