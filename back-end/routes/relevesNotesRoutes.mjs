import { Router } from "express";
import multer from "multer";
import { baseDeDonnees } from "../db/baseDeDonnees.mjs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const relevesNotesRoutes = Router();

// 📌 Configuration de Multer pour l'upload des fichiers
const storage = multer.diskStorage({
  destination: "uploads/releves_notes/",
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4(); // Génère un identifiant unique
    cb(null, `releve_${req.body.idUtilisateur}_${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// 📌 Route pour enregistrer un relevé de notes
relevesNotesRoutes.post("/enregistrer", upload.single("fichierReleve"), async (req, res) => {
  const { idUtilisateur, commentaire } = req.body;
  const fichierReleve = req.file ? req.file.filename : null;

  if (!idUtilisateur || !fichierReleve) {
    return res.status(400).json({ message: "L'ID utilisateur et le fichier sont requis." });
  }

  try {
    const releveId = uuidv4(); // Générer un ID unique pour le relevé
    const sql = `
      INSERT INTO relevesnotes (releveId, idUtilisateur, fichierReleve, commentaire) 
      VALUES (?, ?, ?, ?)
    `;

    await baseDeDonnees.query(sql, [releveId, idUtilisateur, fichierReleve, commentaire || null]);

    res.status(201).json({ message: "Relevé de notes enregistré avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du relevé :", error);
    res.status(500).json({ erreur: "Erreur serveur." });
  }
});

// 📌 Route pour récupérer les relevés d'un utilisateur
relevesNotesRoutes.get("/:idUtilisateur", async (req, res) => {
  const { idUtilisateur } = req.params;

  try {
    const [result] = await baseDeDonnees.query(
      "SELECT * FROM relevesnotes WHERE idUtilisateur = ?",
      [idUtilisateur]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Aucun relevé trouvé." });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération des relevés :", error);
    res.status(500).json({ erreur: "Erreur serveur." });
  }
});

// 📌 Route pour supprimer un relevé de notes
relevesNotesRoutes.delete("/supprimer/:releveId", async (req, res) => {
  const { releveId } = req.params;

  try {
    await baseDeDonnees.query("DELETE FROM relevesnotes WHERE releveId = ?", [releveId]);
    res.status(200).json({ message: "Relevé supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression du relevé :", error);
    res.status(500).json({ erreur: "Erreur serveur." });
  }
});

export default relevesNotesRoutes;
