import { Router } from "express";
import { baseDeDonnees } from "../db/baseDeDonnees.mjs";
import multer from "multer";
import fs from "fs";

const upload = multer({ dest: "uploads/experiences/" });
const experiencesRoutes = Router();

/* 📌 Récupérer les expériences de l'utilisateur */
experiencesRoutes.get("/:idUtilisateur", async (req, res) => {
  try {
    const { idUtilisateur } = req.params;
    const [result] = await baseDeDonnees.query(
      "SELECT * FROM experiencespro WHERE idUtilisateur = ?", 
      [idUtilisateur]
    );

    res.json(result);
  } catch (error) {
    console.error("Erreur récupération des expériences :", error);
    res.status(500).json({ erreur: "Erreur serveur." });
  }
});

/* 📌 Ajouter une nouvelle expérience */
experiencesRoutes.post("/enregistrer", upload.single("fichierJustificatif"), async (req, res) => {
  try {
    const { idUtilisateur, anneeDebut, dureeMois, tempsTravail, employeur, intitule, descriptif } = req.body;
    const fichierJustificatif = req.file ? req.file.filename : null;

    await baseDeDonnees.query("INSERT INTO experiencespro SET ?", {
      idUtilisateur,
      anneeDebut,
      dureeMois,
      tempsTravail,
      employeur,
      intitule,
      descriptif,
      fichierJustificatif,
    });

    res.json({ message: "Expérience enregistrée avec succès !" });
  } catch (error) {
    console.error("Erreur lors de l'ajout :", error);
    res.status(500).json({ erreur: "Erreur serveur." });
  }
});

/* 📌 Modifier une expérience */
experiencesRoutes.put("/modifier/:expId", upload.single("fichierJustificatif"), async (req, res) => {
  try {
    const { expId } = req.params;
    const { anneeDebut, dureeMois, tempsTravail, employeur, intitule, descriptif } = req.body;
    const fichierJustificatif = req.file ? req.file.filename : null;

    // Récupérer l'ancienne expérience pour supprimer le fichier précédent si nécessaire
    const [oldExperience] = await baseDeDonnees.query(
      "SELECT fichierJustificatif FROM experiencespro WHERE expId = ?",
      [expId]
    );

    if (oldExperience.length > 0 && fichierJustificatif) {
      const oldFile = oldExperience[0].fichierJustificatif;
      if (oldFile) {
        fs.unlink(`uploads/experiences/${oldFile}`, (err) => {
          if (err) console.error("Erreur suppression fichier :", err);
        });
      }
    }

    await baseDeDonnees.query(
      `UPDATE experiencespro 
      SET anneeDebut=?, dureeMois=?, tempsTravail=?, employeur=?, intitule=?, descriptif=?, fichierJustificatif=IFNULL(?, fichierJustificatif)
      WHERE expId=?`,
      [anneeDebut, dureeMois, tempsTravail, employeur, intitule, descriptif, fichierJustificatif, expId]
    );

    res.json({ message: "Expérience mise à jour avec succès !" });
  } catch (error) {
    console.error("Erreur lors de la modification :", error);
    res.status(500).json({ erreur: "Erreur serveur." });
  }
});

/* 📌 Supprimer une expérience */
experiencesRoutes.delete("/supprimer/:expId", async (req, res) => {
  try {
    const { expId } = req.params;

    // Récupérer l'expérience pour supprimer le fichier associé
    const [experience] = await baseDeDonnees.query(
      "SELECT fichierJustificatif FROM experiencespro WHERE expId = ?",
      [expId]
    );

    if (experience.length > 0 && experience[0].fichierJustificatif) {
      fs.unlink(`uploads/experiences/${experience[0].fichierJustificatif}`, (err) => {
        if (err) console.error("Erreur suppression fichier :", err);
      });
    }

    await baseDeDonnees.query("DELETE FROM experiencespro WHERE expId = ?", [expId]);
    res.json({ message: "Expérience supprimée avec succès !" });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ erreur: "Erreur serveur." });
  }
});

export default experiencesRoutes;
