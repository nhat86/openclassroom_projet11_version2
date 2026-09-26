import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../types";
import { sendSuccess, sendError, sendServerError } from "../utils/response";
import { getMistralEmbeddings, chatMistral } from "../lib/mistral";
import { cosineSimilarity } from "../utils/vector";

type DraftTask = {
  title: string;
  description: string;
  status?: string;
  priority?: string;
  dueDate?: string | null;
  assigneeIds?: string[];
};

function parseTasksFromText(raw: string): DraftTask[] {
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");

  if (start === -1 || end === -1 || end < start) {
    throw new Error("Aucun tableau JSON trouvé");
  }

  const json = raw.substring(start, end + 1);

  try {
    return JSON.parse(json) as DraftTask[];
  } catch {
    throw new Error("Le JSON généré par l'IA est invalide");
  }
}

export const generateTasks = async (req: Request, res: Response): Promise<void> => {
  console.log("MOCK_AI value:", process.env.MOCK_AI);
  if (process.env.MOCK_AI === "true") {
    const mockTasks = [
      {
        title: "Planifier le lancement",
        description: "Définir la date et le canal de communication",
        status: "TODO",
        priority: "HIGH",
        dueDate: "2026-10-01",
        assigneeIds: [],
      },
      {
        title: "Préparer la documentation",
        description: "Rédiger le guide utilisateur",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: null,
        assigneeIds: [],
      },
    ];
    sendSuccess(res, "Tâches générées (mock)", { tasks: mockTasks });
    return;
  }  
  try {
        const authReq = req as AuthRequest;
        if (!authReq.user) {
        sendError(res, "Non authentifié", "UNAUTHORIZED", 401);
        return;
        }
        const user = authReq.user;
        const { projectId } = req.params;
        const { prompt } = req.body;
        if(!prompt || prompt.trim().length<3){
            sendError(res, "Prompt requis", "BAD_REQUEST", 400);
            return;
        }
        const project = await prisma.project.findUnique({
            where: {id: projectId},
        })
        if (!project) {
            sendError(res, "Projet non trouvé", "NOT_FOUND", 404);
            return;
        }
        
        const existingTasks = await prisma.task.findMany({
            where: { projectId },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                priority: true,
                dueDate: true,
            },
        });

        let context = "Aucune tâche existante.";

        if (existingTasks.length >0){
            const taskTexts = existingTasks.map(
                (t) => 'Titre: ${t.title}. Description: ${t.description ?? ""}'
            );
            const embeddings = await getMistralEmbeddings([prompt,...taskTexts]);
            const [promptEmbedding, ...taskEmbeddings] = embeddings;
            const scored = existingTasks.map((t, i) => ({
                task: t,
                score: cosineSimilarity(promptEmbedding, taskEmbeddings[i]),
                }))
                .sort((a, b) => b.score - a.score)
                .slice(0, 5);

            context = scored.map(
                (s) =>
                `Titre: ${s.task.title}\nDescription: ${s.task.description ?? ""}`
            )
            .join("\n\n");
          }
        const systemPrompt = `
        Tu es un assistant de gestion de projet. Tu aides à générer des tâches pertinentes pour un projet à partir d'une demande utilisateur.
        
        Voici des tâches existantes dans le projet :
        ---
        ${context}
        ---
        
        Demande de l'utilisateur :
        "${prompt}"
        
        Génère une liste de tâches au format JSON STRICT. Pas de markdown, pas de texte hors du JSON. Uniquement un JSON array.
        
        Chaque tâche doit avoir cette forme :
        {
        "title": "Titre de la tâche",
        "description": "Description détaillée",
        }
        
        Règles :
        - "title" : au moins 2 caractères
        - "description" : obligatoire
        - Uniquement ces 2 champs
        `;

        await new Promise((resolve) => setTimeout(resolve, 1100));
        
        const raw = await chatMistral([
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
        ]);

        let tasks: DraftTask[] = [];
        try {
            tasks = parseTasksFromText(raw);
            } 
        catch (parseError) {
            console.error("Mistral raw response:", raw);
            sendError(res, "Format de réponse IA invalide", "UNPROCESSABLE_ENTITY", 422);
            return;
        }

        const valid = tasks
          .filter((t) => typeof t.title === "string" && t.title.trim().length >= 2)
          .map((t) => ({
            title: t.title.trim(),
            description: (t.description ?? "").trim(),
            status: "TODO",
            priority: "MEDIUM",
            dueDate: null,
            assigneeIds: [],
          }));

        sendSuccess(res, "Tâches générées", {
            tasks: valid.map((t) => ({
                ...t,
                title: t.title.trim(),
                description: (t.description ?? "").trim(),
            })),
        });
    } catch (error) {
        console.error("generateTasks error:", error);
        sendServerError(res, "Erreur lors de la génération des tâches");
    }
};


export const createTasksBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      sendError(res, "Non authentifié", "UNAUTHORIZED", 401);
      return;
    }
    const user = authReq.user;
    const { projectId } = req.params;
    const { tasks } = req.body as { tasks: DraftTask[] };
 
    if (!Array.isArray(tasks) || tasks.length === 0) {
      sendError(res, "Liste de tâches requise", "BAD_REQUEST", 400);
      return;
    }
 
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
 
    if (!project) {
      sendError(res, "Projet non trouvé", "NOT_FOUND", 404);
      return;
    }
 
    const created = await prisma.$transaction(
      tasks
        .filter((t) => t.title.trim().length >= 2)
        .map((t) =>
          prisma.task.create({
            data: {
              title: t.title.trim(),
              description: t.description?.trim() ?? null,
              status: "TODO",
              priority:"MEDIUM",
              dueDate: null,
              projectId,
              creatorId: user.id,
            },
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
                  author: { select: { id: true, name: true } },
                },
                orderBy: { createdAt: "asc" },
              },
            },
          })
        )
    );
 
    sendSuccess(res, "Tâches créées", { tasks: created });
  } catch (error) {
    console.error("createTasksBatch error:", error);
    sendServerError(res, "Erreur lors de la création des tâches");
  }
};

