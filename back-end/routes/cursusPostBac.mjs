import { Router } from "express";
import { baseDeDonnees } from "../db/baseDeDonnees.mjs";

const cursusRoutes = Router();

/* 📌 Récupérer les années de cursus */
cursusRoutes.get("/:idUtilisateur", async (req, res) => {
  const { idUtilisateur } = req.params;

  try {
    const [result] = await baseDeDonnees.query(
      "SELECT * FROM cursuspostbac WHERE idUtilisateur = ?",
      [idUtilisateur]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Aucune année enregistrée." });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération du cursus :", error);
    res.status(500).json({ erreur: "Erreur serveur." });
  }
});

/* 📌 Ajouter une année de cursus */
cursusRoutes.post("/enregistrer", async (req, res) => {
  const { idUtilisateur, anneeUniversitaire, diplomeFrancais, niveauDiplome } = req.body;

  try {
    const requeteInsert = `
      INSERT INTO cursuspostbac (idUtilisateur, anneeUniversitaire, diplomeFrancais, niveauDiplome) 
      VALUES (?, ?, ?, ?)
    `;

    await baseDeDonnees.query(requeteInsert, [
      idUtilisateur,
      anneeUniversitaire,
      diplomeFrancais,
      niveauDiplome,
    ]);

    res.status(201).json({ message: "Année enregistrée avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du cursus :", error);
    res.status(500).json({ erreur: "Erreur serveur." });
  }
});

/* 📌 Supprimer une année */
cursusRoutes.delete("/supprimer/:cursusId", async (req, res) => {
  const { cursusId } = req.params;

  try {
    await baseDeDonnees.query("DELETE FROM cursuspostbac WHERE cursusId = ?", [cursusId]);
    res.status(200).json({ message: "Année supprimée avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ erreur: "Erreur serveur." });
  }
});

export default cursusRoutes;
