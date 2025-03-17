import { Router } from "express";
import { baseDeDonnees } from "../db/baseDeDonnees.mjs";
import multer from "multer";
import { verifierConnexion } from "../middlewares/verifierConnexion.mjs";

const routeurCandidatures = Router();

// 📌 Configuration de l'upload de fichiers avec Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/candidatures/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// ✅ Ajouter une candidature avec vérification de l'existence de la formation et de l'utilisateur
routeurCandidatures.post("/ajouter", verifierConnexion, upload.fields([
    { name: "cv" }, { name: "releveNotes" }, { name: "diplome" }, { name: "lettreMotivation" }
]), async (req, res) => {
    try {
        const { idFormation } = req.body;
        const idUtilisateur = req.user.idUtilisateur;

        if (!idUtilisateur || !idFormation) {
            return res.status(400).json({ erreur: "Utilisateur ou formation manquant." });
        }

        // Vérification de l'existence de la formation
        const [formation] = await baseDeDonnees.query(
            "SELECT idFormation FROM formations WHERE idFormation = ?",
            [idFormation]
        );

        if (formation.length === 0) {
            return res.status(404).json({ erreur: "La formation sélectionnée n'existe pas." });
        }

        // Vérification de l'existence de l'utilisateur
        const [utilisateur] = await baseDeDonnees.query(
            "SELECT idUtilisateur FROM utilisateurs WHERE idUtilisateur = ?",
            [idUtilisateur]
        );

        if (utilisateur.length === 0) {
            return res.status(404).json({ erreur: "Utilisateur introuvable." });
        }

        // Vérification si l'utilisateur a déjà postulé à cette formation
        const [existe] = await baseDeDonnees.query(
            "SELECT idCandidature FROM candidatures WHERE idUtilisateur = ? AND idFormation = ?",
            [idUtilisateur, idFormation]
        );

        if (existe.length > 0) {
            return res.status(400).json({ erreur: "Vous avez déjà candidaté à cette formation." });
        }

        // Récupération des fichiers uploadés
        const lettreMotivation = req.files["lettreMotivation"] ? req.files["lettreMotivation"][0].filename : null;
        const cv = req.files["cv"] ? req.files["cv"][0].filename : null;
        const releveNotes = req.files["releveNotes"] ? req.files["releveNotes"][0].filename : null;
        const diplome = req.files["diplome"] ? req.files["diplome"][0].filename : null;

        // Insertion de la candidature
        const requeteAjout = `
            INSERT INTO candidatures (idUtilisateur, idFormation, lettreMotivation, cv, releveNotes, diplome, dateCandidature, statut)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), 'En attente')
        `;

        const [resultat] = await baseDeDonnees.query(requeteAjout, [
            idUtilisateur, idFormation, lettreMotivation, cv, releveNotes, diplome
        ]);

        res.status(201).json({
            message: "Candidature enregistrée avec succès.",
            idCandidature: resultat.insertId
        });

    } catch (error) {
        console.error("Erreur lors de l'ajout de la candidature :", error);
        res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
});

// ✅ Récupérer toutes les candidatures d'un utilisateur
routeurCandidatures.get("/utilisateur/:idUtilisateur", async (req, res) => {
    try {
        const { idUtilisateur } = req.params;

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

// ✅ Supprimer une candidature
routeurCandidatures.delete("/supprimer/:idCandidature", async (req, res) => {
    try {
        const { idCandidature } = req.params;

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
