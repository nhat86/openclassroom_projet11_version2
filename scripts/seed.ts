import bcrypt from "bcryptjs";
import prisma from "../src/lib/prisma";

// Types pour les données de test
interface SeedUser {
  email: string;
  name: string;
  password: string;
}

interface SeedProject {
  name: string;
  description: string;
  ownerEmail: string;
  contributors: string[];
}

interface SeedTask {
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  due_date: Date;
  projectName: string;
  assignees: string[];
}

interface SeedComment {
  content: string;
  author_id: string;
}

// Données de test
const users: SeedUser[] = [
  { email: "alice@example.com", name: "Alice Martin", password: "P@ssword123" },
  { email: "bob@example.com", name: "Bob Dupont", password: "P@ssword123" },
  {
    email: "caroline@example.com",
    name: "Caroline Leroy",
    password: "P@ssword123",
  },
  { email: "david@example.com", name: "David Moreau", password: "P@ssword123" },
  { email: "emma@example.com", name: "Emma Rousseau", password: "P@ssword123" },
  {
    email: "francois@example.com",
    name: "François Dubois",
    password: "P@ssword123",
  },
  {
    email: "gabrielle@example.com",
    name: "Gabrielle Simon",
    password: "P@ssword123",
  },
  {
    email: "henri@example.com",
    name: "Henri Laurent",
    password: "P@ssword123",
  },
  {
    email: "isabelle@example.com",
    name: "Isabelle Petit",
    password: "P@ssword123",
  },
  {
    email: "jacques@example.com",
    name: "Jacques Durand",
    password: "P@ssword123",
  },
];

const projects: SeedProject[] = [
  {
    name: "Application E-commerce",
    description:
      "Développement d'une plateforme de vente en ligne moderne avec paiement sécurisé et gestion des stocks.",
    ownerEmail: "alice@example.com",
    contributors: [
      "bob@example.com",
      "caroline@example.com",
      "david@example.com",
    ],
  },
  {
    name: "Système de Gestion RH",
    description:
      "Application web pour la gestion des ressources humaines : congés, évaluations, planning.",
    ownerEmail: "emma@example.com",
    contributors: [
      "francois@example.com",
      "gabrielle@example.com",
    ],
  },
  {
    name: "Application Mobile Fitness",
    description:
      "App mobile pour le suivi d'entraînement, nutrition et objectifs fitness personnalisés.",
    ownerEmail: "henri@example.com",
    contributors: ["isabelle@example.com"],
  },
  {
    name: "Plateforme de Formation",
    description:
      "Système de gestion de cours en ligne avec vidéos, quiz et suivi des progrès.",
    ownerEmail: "jacques@example.com",
    contributors: ["alice@example.com"],
  },
  {
    name: "Dashboard Analytics",
    description:
      "Interface de visualisation de données avec graphiques interactifs et rapports automatisés.",
    ownerEmail: "bob@example.com",
    contributors: ["emma@example.com", "henri@example.com"],
  },
];

const tasks: SeedTask[] = [
  // Projet E-commerce
  {
    title: "Conception de la base de données",
    description:
      "Créer le schéma de base de données pour les produits, utilisateurs, commandes et paiements.",
    status: "DONE",
    priority: "HIGH",
    due_date: new Date("2024-01-15"),
    projectName: "Application E-commerce",
    assignees: ["bob@example.com", "caroline@example.com"],
  },
  {
    title: "Développement de l'API REST",
    description:
      "Implémenter les endpoints pour la gestion des produits, panier et commandes.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    due_date: new Date("2024-02-01"),
    projectName: "Application E-commerce",
    assignees: ["david@example.com"],
  },
  {
    title: "Interface utilisateur responsive",
    description:
      "Créer les composants React pour la liste des produits, panier et checkout.",
    status: "TODO",
    priority: "MEDIUM",
    due_date: new Date("2024-02-15"),
    projectName: "Application E-commerce",
    assignees: ["alice@example.com", "caroline@example.com"],
  },
  {
    title: "Intégration système de paiement",
    description: "Intégrer Stripe pour le traitement des paiements sécurisés.",
    status: "TODO",
    priority: "HIGH",
    due_date: new Date("2024-02-28"),
    projectName: "Application E-commerce",
    assignees: ["bob@example.com"],
  },
  {
    title: "Tests automatisés",
    description:
      "Écrire les tests unitaires et d'intégration pour l'API et l'interface.",
    status: "TODO",
    priority: "MEDIUM",
    due_date: new Date("2024-03-10"),
    projectName: "Application E-commerce",
    assignees: ["david@example.com", "caroline@example.com"],
  },

  // Projet RH
  {
    title: "Module de gestion des congés",
    description:
      "Développer le système de demande et validation des congés avec workflow d'approbation.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    due_date: new Date("2024-01-20"),
    projectName: "Système de Gestion RH",
    assignees: ["emma@example.com", "francois@example.com"],
  },
  {
    title: "Interface d'évaluation des employés",
    description:
      "Créer les formulaires d'évaluation et le système de notation.",
    status: "TODO",
    priority: "MEDIUM",
    due_date: new Date("2024-02-05"),
    projectName: "Système de Gestion RH",
    assignees: ["gabrielle@example.com"],
  },
  {
    title: "Tableau de bord RH",
    description:
      "Dashboard avec statistiques sur les effectifs, congés et performances.",
    status: "TODO",
    priority: "LOW",
    due_date: new Date("2024-02-20"),
    projectName: "Système de Gestion RH",
    assignees: ["emma@example.com"],
  },

  // Projet Fitness
  {
    title: "Design de l'interface mobile",
    description: "Créer les maquettes et prototypes pour l'application mobile.",
    status: "DONE",
    priority: "HIGH",
    due_date: new Date("2024-01-10"),
    projectName: "Application Mobile Fitness",
    assignees: ["henri@example.com"],
  },
  {
    title: "Développement des écrans principaux",
    description:
      "Implémenter les écrans d'accueil, profil utilisateur et suivi d'entraînement.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    due_date: new Date("2024-01-25"),
    projectName: "Application Mobile Fitness",
    assignees: ["isabelle@example.com", "henri@example.com"],
  },
  {
    title: "Intégration API nutrition",
    description:
      "Connecter l'app à une API de données nutritionnelles pour les calories et nutriments.",
    status: "TODO",
    priority: "MEDIUM",
    due_date: new Date("2024-02-10"),
    projectName: "Application Mobile Fitness",
    assignees: ["henri@example.com"],
  },

  // Projet Formation
  {
    title: "Système de gestion des cours",
    description:
      "Créer l'interface d'administration pour ajouter et organiser les cours.",
    status: "DONE",
    priority: "HIGH",
    due_date: new Date("2024-01-05"),
    projectName: "Plateforme de Formation",
    assignees: ["jacques@example.com"],
  },
  {
    title: "Lecteur vidéo personnalisé",
    description:
      "Développer un lecteur vidéo avec contrôles de progression et notes.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    due_date: new Date("2024-01-30"),
    projectName: "Plateforme de Formation",
    assignees: ["alice@example.com", "jacques@example.com"],
  },
  {
    title: "Système de quiz interactif",
    description:
      "Créer les quiz avec questions à choix multiples et évaluation automatique.",
    status: "TODO",
    priority: "MEDIUM",
    due_date: new Date("2024-02-15"),
    projectName: "Plateforme de Formation",
    assignees: ["alice@example.com"],
  },

  // Projet Analytics
  {
    title: "Architecture des données",
    description:
      "Concevoir l'architecture pour la collecte et le stockage des données analytiques.",
    status: "DONE",
    priority: "HIGH",
    due_date: new Date("2024-01-08"),
    projectName: "Dashboard Analytics",
    assignees: ["bob@example.com"],
  },
  {
    title: "Développement des graphiques",
    description:
      "Implémenter les composants de visualisation avec Chart.js ou D3.js.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    due_date: new Date("2024-01-22"),
    projectName: "Dashboard Analytics",
    assignees: ["emma@example.com", "henri@example.com"],
  },
  {
    title: "Système d'alertes",
    description:
      "Créer le système de notifications pour les seuils et anomalies détectées.",
    status: "TODO",
    priority: "MEDIUM",
    due_date: new Date("2024-02-08"),
    projectName: "Dashboard Analytics",
    assignees: ["bob@example.com"],
  },
];

const comments: SeedComment[] = [
  // Commentaires pour différentes tâches
  {
    content:
      "Base de données créée avec succès. Toutes les tables sont en place et les relations sont correctes.",
    author_id: "",
  },
  {
    content:
      "API REST en cours de développement. Les endpoints produits et utilisateurs sont terminés.",
    author_id: "",
  },
  {
    content:
      "Interface responsive en cours. Les composants de base sont créés, reste à implémenter le panier.",
    author_id: "",
  },
  {
    content:
      "Intégration Stripe prévue pour la semaine prochaine. Documentation consultée.",
    author_id: "",
  },
  {
    content:
      "Tests unitaires écrits pour 80% des fonctions. Tests d'intégration à venir.",
    author_id: "",
  },
  {
    content: "Module congés bien avancé. Workflow d'approbation fonctionnel.",
    author_id: "",
  },
  {
    content:
      "Formulaires d'évaluation créés. Interface intuitive et responsive.",
    author_id: "",
  },
  {
    content: "Dashboard RH en cours. Statistiques de base affichées.",
    author_id: "",
  },
  {
    content:
      "Design mobile terminé et validé par le client. Interface moderne et intuitive.",
    author_id: "",
  },
  {
    content:
      "Écrans principaux en développement. Navigation fluide entre les sections.",
    author_id: "",
  },
  {
    content:
      "API nutrition identifiée. Documentation reçue, intégration prévue.",
    author_id: "",
  },
  {
    content:
      "Système de cours opérationnel. Interface d'administration complète.",
    author_id: "",
  },
  {
    content: "Lecteur vidéo en cours. Contrôles de base implémentés.",
    author_id: "",
  },
  {
    content: "Quiz interactif en développement. Système de notation en place.",
    author_id: "",
  },
  {
    content:
      "Architecture données validée. Performance optimisée pour les gros volumes.",
    author_id: "",
  },
  {
    content:
      "Graphiques en cours. Chart.js intégré, premiers graphiques affichés.",
    author_id: "",
  },
  {
    content:
      "Système d'alertes planifié. Notifications par email et push prévues.",
    author_id: "",
  },
  {
    content:
      "Excellent travail sur cette tâche ! Le code est propre et bien documenté.",
    author_id: "",
  },
  {
    content:
      "Attention à la sécurité des données. Vérifier les permissions utilisateur.",
    author_id: "",
  },
  { content: "Deadline respectée, bravo à toute l'équipe !", author_id: "" },
  {
    content: "Petit bug détecté sur mobile. À corriger avant la livraison.",
    author_id: "",
  },
  {
    content: "Documentation mise à jour. Tutoriel d'utilisation créé.",
    author_id: "",
  },
  {
    content: "Tests de charge effectués. Performance satisfaisante.",
    author_id: "",
  },
  {
    content: "Code review terminée. Quelques améliorations mineures suggérées.",
    author_id: "",
  },
  {
    content: "Déploiement en production réussi. Monitoring en place.",
    author_id: "",
  },
];

async function seed() {
  console.log("🌱 Début du seeding de la base de données...");

  try {
    // Nettoyer la base de données
    console.log("🧹 Nettoyage de la base de données...");
    await prisma.comment.deleteMany();
    await prisma.taskAssignee.deleteMany();
    await prisma.task.deleteMany();
    await prisma.projectMember.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();

    // Créer les utilisateurs
    console.log("👥 Création des utilisateurs...");
    const createdUsers: { [email: string]: string } = {};

    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password: hashedPassword,
        },
      });
      createdUsers[userData.email] = user.id;
      console.log(`✅ Utilisateur créé: ${userData.name} (${userData.email})`);
    }

    // Créer les projets
    console.log("📁 Création des projets...");
    const createdProjects: { [name: string]: string } = {};

    for (const projectData of projects) {
      const owner_id = createdUsers[projectData.ownerEmail];
      if (!owner_id) {
        throw new Error(
          `Owner introuvable pour le projet ${projectData.name}: ${projectData.ownerEmail}`
        );
      }

      const project = await prisma.project.create({
        data: {
          name: projectData.name,
          description: projectData.description,
          owner_id,
        },
      });
      createdProjects[projectData.name] = project.id;
      console.log(
        `✅ Projet créé: ${projectData.name} (owner: ${projectData.ownerEmail})`
      );

      // Ajouter les contributeurs
      for (const contributorEmail of projectData.contributors) {
        if (createdUsers[contributorEmail]) {
          await prisma.projectMember.create({
            data: {
              user_id: createdUsers[contributorEmail],
              project_id: project.id,
              role: "CONTRIBUTOR",
            },
          });
          console.log(`  👤 Contributeur ajouté: ${contributorEmail}`);
        }
      }
    }

    // Créer les tâches
    console.log("📋 Création des tâches...");
    let taskIndex = 0;

    for (const taskData of tasks) {
      const project_id = createdProjects[taskData.projectName];
      if (!project_id) {
        throw new Error(
          `Projet introuvable pour la tâche "${taskData.title}": ${taskData.projectName}`
        );
      }

      // Le créateur de la tâche est l'owner du projet
      const projectData = projects.find((p) => p.name === taskData.projectName);
      const creator_id = createdUsers[projectData!.ownerEmail];

      const task = await prisma.task.create({
        data: {
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          due_date: taskData.due_date,
          project_id,
          creator_id,
        },
      });
      console.log(`✅ Tâche créée: ${taskData.title}`);

      // Assigner les utilisateurs
      for (const assigneeEmail of taskData.assignees) {
        if (createdUsers[assigneeEmail]) {
          await prisma.taskAssignee.create({
            data: {
              user_id: createdUsers[assigneeEmail],
              task_id: task.id,
            },
          });
          console.log(`  👤 Assigné: ${assigneeEmail}`);
        }
      }

      // Ajouter des commentaires
      const commentCount = Math.floor(Math.random() * 3) + 1; // 1 à 3 commentaires par tâche
      for (let i = 0; i < commentCount; i++) {
        const commentIndex = (taskIndex * commentCount + i) % comments.length;
        const commentData = comments[commentIndex];

        // Sélectionner un auteur aléatoire parmi les assignés ou l'owner du projet
        const possibleAuthors = [...taskData.assignees, projectData!.ownerEmail];
        const authorEmail =
          possibleAuthors[Math.floor(Math.random() * possibleAuthors.length)];

        if (createdUsers[authorEmail]) {
          await prisma.comment.create({
            data: {
              content: commentData.content,
              author_id: createdUsers[authorEmail],
              task_id: task.id,
            },
          });
          console.log(`  💬 Commentaire ajouté par ${authorEmail}`);
        }
      }

      taskIndex++;
    }

    console.log("🎉 Seeding terminé avec succès !");
    console.log(`📊 Résumé:`);
    console.log(`  - ${users.length} utilisateurs créés`);
    console.log(`  - ${projects.length} projets créés`);
    console.log(`  - ${tasks.length} tâches créées`);
    console.log(`  - ${comments.length} commentaires disponibles`);
  } catch (error) {
    console.error("❌ Erreur lors du seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le seeding
seed()
  .then(() => {
    console.log("✅ Script de seeding exécuté avec succès");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erreur lors de l'exécution du script:", error);
    process.exit(1);
  });
