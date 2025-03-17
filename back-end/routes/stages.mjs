import { Router } from "express";
import { baseDeDonnees } from "../db/baseDeDonnees.mjs";

const stagesRoutes = Router();

/* 📌 1️⃣ Récupérer les stages d'un utilisateur */
stagesRoutes.get("/:idUtilisateur", async (req, res) => {
  const { idUtilisateur } = req.params;

  try {
    const [stages] = await baseDeDonnees.query(
      "SELECT * FROM stages WHERE idUtilisateur = ?",
      [idUtilisateur]
    );

    if (stages.length === 0) {
      return res.status(404).json({ message: "Aucun stage trouvé." });
    }

    res.status(200).json(stages);
  } catch (error) {
    console.error("Erreur récupération des stages :", error);
    res.status(500).json({ erreur: "Erreur serveur." });
  }
});

/* 📌 2️⃣ Ajouter un stage */
stagesRoutes.post("/ajouter", async (req, res) => {
  const { idUtilisateur, duree, entreprise, description } = req.body;

  if (!idUtilisateur || !duree || !entreprise) {
    return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
  }

  try {
    await baseDeDonnees.query(
      "INSERT INTO stages (idUtilisateur, duree, entreprise, description) VALUES (?, ?, ?, ?)",
      [idUtilisateur, duree, entreprise, description]
    );

    res.status(201).json({ message: "Stage ajouté avec succès." });
  } catch (error) {
    console.error("Erreur ajout du stage :", error);
    res.status(500).json({ erreur: "Erreur serveur." });
  }
});

/* 📌 3️⃣ Modifier un stage */
stagesRoutes.put("/modifier/:stageId", async (req, res) => {
  const { stageId } = req.params;
  const { duree, entreprise, description } = req.body;

  try {
    const [result] = await baseDeDonnees.query(
      "UPDATE stages SET duree = ?, entreprise = ?, description = ? WHERE stageId = ?",
      [duree, entreprise, description, stageId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Stage non trouvé." });
    }

    res.status(200).json({ message: "Stage mis à jour avec succès." });
  } catch (error) {
    console.error("Erreur mise à jour du stage :", error);
    res.status(500).json({ erreur: "Erreur serveur." });
  }
});

/* 📌 4️⃣ Supprimer un stage */
stagesRoutes.delete("/supprimer/:stageId", async (req, res) => {
  const { stageId } = req.params;

  try {
    const [result] = await baseDeDonnees.query(
      "DELETE FROM stages WHERE stageId = ?",
      [stageId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Stage non trouvé." });
    }

    res.status(200).json({ message: "Stage supprimé avec succès." });
  } catch (error) {
    console.error("Erreur suppression du stage :", error);
    res.status(500).json({ erreur: "Erreur serveur." });
  }
});

export default stagesRoutes;
