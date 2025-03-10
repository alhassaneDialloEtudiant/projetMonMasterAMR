import multer from "multer";
import { Router } from "express";
import { baseDeDonnees } from "../db/baseDeDonnees.mjs";
import path from "path";
import fs from "fs";

const cvRoutes = Router();

// 📌 Définir le stockage avec Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "uploads/";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir); // Création du dossier s'il n'existe pas
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `cv_${req.body.idUtilisateur}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// 📌 Route pour uploader un CV
cvRoutes.post("/upload", upload.single("cv"), async (req, res) => {
    const { idUtilisateur } = req.body;
    const nomFichier = req.file.filename; // Vérifier si ce nom est bien défini

    try {
        // Vérification si le CV existe déjà
        const [existant] = await baseDeDonnees.query("SELECT * FROM cv WHERE idUtilisateur = ?", [idUtilisateur]);

        if (existant.length > 0) {
            await baseDeDonnees.query("UPDATE cv SET nomFichier = ? WHERE idUtilisateur = ?", [nomFichier, idUtilisateur]);
            return res.status(200).json({ message: "CV mis à jour avec succès." });
        }

        // Insertion du CV si aucun n'existe
        await baseDeDonnees.query("INSERT INTO cv (idUtilisateur, nomFichier) VALUES (?, ?)", [idUtilisateur, nomFichier]);
        res.status(201).json({ message: "CV enregistré avec succès." });

    } catch (error) {
        console.error("Erreur lors de l'upload du CV :", error);
        res.status(500).json({ erreur: "Erreur serveur." });
    }
});


// 📌 Route pour récupérer le CV
cvRoutes.get("/:idUtilisateur", async (req, res) => {
    const { idUtilisateur } = req.params;

    try {
        const [result] = await baseDeDonnees.query("SELECT nomFichier FROM cv WHERE idUtilisateur = ?", [idUtilisateur]);

        if (result.length === 0) {
            return res.status(404).json({ message: "CV non trouvé." });
        }

        res.status(200).json({ cv: result[0].nomFichier });
    } catch (error) {
        console.error("Erreur récupération CV :", error);
        res.status(500).json({ erreur: "Erreur serveur." });
    }
});

// 📌 Route pour supprimer un CV
cvRoutes.delete("/supprimer/:idUtilisateur", async (req, res) => {
    const { idUtilisateur } = req.params;

    try {
        const [result] = await baseDeDonnees.query("SELECT nomFichier FROM cv WHERE idUtilisateur = ?", [idUtilisateur]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Aucun CV à supprimer." });
        }

        const filePath = path.join("uploads", result[0].nomFichier);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Supprime le fichier
        }

        await baseDeDonnees.query("DELETE FROM cv WHERE idUtilisateur = ?", [idUtilisateur]);
        res.status(200).json({ message: "CV supprimé avec succès." });
    } catch (error) {
        console.error("Erreur suppression CV :", error);
        res.status(500).json({ erreur: "Erreur serveur." });
    }
});

export default cvRoutes;
