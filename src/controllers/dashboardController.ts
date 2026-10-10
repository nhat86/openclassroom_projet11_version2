import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../types";
import { sendSuccess, sendError, sendServerError } from "../utils/response";
export const getUserTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    sendError(res, "Utilisateur non authentifié", "UNAUTHORIZED", 401);
    return;
  }
  try {
    const tasks = await prisma.task.findMany({
    where:{
      project:{
        OR:[
          {owner_id:authReq.user.id},
          {members:{some:{user_id:authReq.user.id}}},
        ],
      },
    },
    include:{
      project:{
        select:{
          id:true,
          name:true,
          description:true,
        }
      },
      assignees:{
        include:{
          user:{
            select:{
              id:true,
              name: true,
              email: true
            },
          },
        },
      },
      comments:{
        include:{
          author:{
            select:{
              id:true,
              name: true,
              email: true
            }
          }
        },
      },
    },
    orderBy: { created_at: "desc" },
    });
    const priorityOrder: Record<string, number> = {
    URGENT: 1,
    HIGH: 2,
    MEDIUM: 3,
    LOW: 4,
    };
    const sortedTasks= tasks.slice().sort((a, b) => {
      const priorityA = priorityOrder[a.priority] || 5;
      const priorityB = priorityOrder[b.priority] || 5;
      if (priorityA !== priorityB) return priorityA - priorityB;
      else {
        const dueA = a.due_date ? new Date(a.due_date).getTime() : Infinity;
        const dueB = b.due_date ? new Date(b.due_date).getTime() : Infinity;
        return dueA - dueB;
      }
    }); 
  
    sendSuccess(res, "Tâches récupérées", { tasks: sortedTasks });
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    sendServerError(res, "Erreur lors de la récupération des tâches");
  }
};