import { Router } from "express";
import { baseDeDonnees } from "../db/baseDeDonnees.mjs";
import multer from "multer";

const routeurCandidatures = Router();

// 📌 Configuration de l'upload de fichiers avec Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/candidatures/"); // 📂 Stockage des fichiers
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// ✅ Middleware pour protéger les routes (nécessite une authentification)
const verifierConnexion = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ erreur: "Utilisateur non authentifié. Veuillez vous connecter." });
    }
    next();
};

// ✅ 1. Ajouter une candidature (avec vérification de l'existence de la formation)
routeurCandidatures.post("/ajouter", verifierConnexion, upload.fields([
    { name: "cv" }, { name: "releveNotes" }, { name: "diplome" }, { name: "lettreMotivation" }
]), async (req, res) => {
    const { idFormation } = req.body;
    const idUtilisateur = req.user.idUtilisateur; // 📌 Récupération de l'utilisateur connecté

    if (!idUtilisateur || !idFormation) {
        return res.status(400).json({ erreur: "Utilisateur ou formation non renseignés." });
    }

    // Vérification de l'existence de la formation
    try {
        const [formation] = await baseDeDonnees.query(
            "SELECT idFormation FROM formations WHERE idFormation = ?",
            [idFormation]
        );

        if (formation.length === 0) {
            return res.status(404).json({ erreur: "La formation sélectionnée n'existe pas." });
        }

        // Récupération des fichiers uploadés
        const lettreMotivation = req.files["lettreMotivation"] ? req.files["lettreMotivation"][0].filename : null;
        const cv = req.files["cv"] ? req.files["cv"][0].filename : null;
        const releveNotes = req.files["releveNotes"] ? req.files["releveNotes"][0].filename : null;
        const diplome = req.files["diplome"] ? req.files["diplome"][0].filename : null;

        // Insertion dans la base de données
        const requeteAjout = `
            INSERT INTO candidatures (idUtilisateur, idFormation, lettreMotivation, cv, releveNotes, diplome)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [resultat] = await baseDeDonnees.query(requeteAjout, [
            idUtilisateur, idFormation, lettreMotivation, cv, releveNotes, diplome
        ]);

        res.status(201).json({ message: "Candidature enregistrée avec succès.", idCandidature: resultat.insertId });

    } catch (error) {
        console.error("Erreur lors de l'ajout de la candidature :", error);
        res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
});

// ✅ 2. Récupérer toutes les candidatures d'un utilisateur
routeurCandidatures.get("/utilisateur/:idUtilisateur", async (req, res) => {
    const { idUtilisateur } = req.params;

    try {
        const requete = `
            SELECT c.*, f.nomFormation, f.universite, f.typeFormation
            FROM candidatures c
            JOIN formations f ON c.idFormation = f.idFormation
            WHERE c.idUtilisateur = ?
        `;
        const [resultats] = await baseDeDonnees.query(requete, [idUtilisateur]);

        res.status(200).json(resultats);
    } catch (error) {
        console.error("Erreur lors de la récupération des candidatures :", error);
        res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
});

// ✅ 3. Supprimer une candidature
routeurCandidatures.delete("/supprimer/:idCandidature", async (req, res) => {
    const { idCandidature } = req.params;

    try {
        const requete = `DELETE FROM candidatures WHERE idCandidature = ?`;
        const [resultat] = await baseDeDonnees.query(requete, [idCandidature]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: "Candidature non trouvée." });
        }

        res.status(200).json({ message: "Candidature supprimée avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression de la candidature :", error);
        res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
});

export default routeurCandidatures;
