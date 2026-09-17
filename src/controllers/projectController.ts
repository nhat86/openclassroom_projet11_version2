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
          .map((userId: string) => ({ userId, role: "CONTRIBUTOR" }))
      : [];
    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() ?? "",
        ownerId: authReq.user.id,
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
          { ownerId: authReq.user.id },
          { members: { some: { userId: authReq.user.id } } },
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
      orderBy: { createdAt: "desc" },
    });
    sendSuccess(res, "Projets récupérés avec succès", { projects });
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
    sendServerError(res, "Erreur lors de la récupération des projets");
  }
};
