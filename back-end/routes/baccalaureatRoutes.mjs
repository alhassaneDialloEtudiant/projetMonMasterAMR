import { Router } from "express";
import { baseDeDonnees } from "../db/baseDeDonnees.mjs";

const baccalaureatRoutes = Router();

// 📌 Récupérer les informations du baccalauréat d'un utilisateur
baccalaureatRoutes.get("/:idUtilisateur", async (req, res) => {
    const { idUtilisateur } = req.params;

    try {
        const [result] = await baseDeDonnees.query(
            "SELECT * FROM baccalaureats WHERE idUtilisateur = ?",
            [idUtilisateur]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Aucune donnée trouvée pour cet utilisateur." });
        }

        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ erreur: "Erreur serveur." });
    }
});

// 📌 Enregistrer ou mettre à jour le baccalauréat
baccalaureatRoutes.post("/enregistrer", async (req, res) => {
    const { idUtilisateur, anneeObtention, paysObtention, serieBaccalaureat, typeBaccalaureat } = req.body;

    try {
        // Vérifier si l'utilisateur a déjà des données enregistrées
        const [existant] = await baseDeDonnees.query(
            "SELECT * FROM baccalaureats WHERE idUtilisateur = ?",
            [idUtilisateur]
        );

        if (existant.length > 0) {
            // Mise à jour
            await baseDeDonnees.query(
                `UPDATE baccalaureats 
                SET anneeObtention = ?, paysObtention = ?, serieBaccalaureat = ?, typeBaccalaureat = ? 
                WHERE idUtilisateur = ?`,
                [anneeObtention, paysObtention, serieBaccalaureat, typeBaccalaureat, idUtilisateur]
            );
            return res.status(200).json({ message: "Informations mises à jour avec succès." });
        }

        // Insertion
        await baseDeDonnees.query(
            `INSERT INTO baccalaureats (idUtilisateur, anneeObtention, paysObtention, serieBaccalaureat, typeBaccalaureat)
            VALUES (?, ?, ?, ?, ?)`,
            [idUtilisateur, anneeObtention, paysObtention, serieBaccalaureat, typeBaccalaureat]
        );

        res.status(201).json({ message: "Informations enregistrées avec succès." });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ erreur: "Erreur serveur." });
    }
});

// 📌 Supprimer les données d'un utilisateur
baccalaureatRoutes.delete("/supprimer/:idUtilisateur", async (req, res) => {
    const { idUtilisateur } = req.params;

    try {
        const [existant] = await baseDeDonnees.query(
            "SELECT * FROM baccalaureats WHERE idUtilisateur = ?",
            [idUtilisateur]
        );

        if (existant.length === 0) {
            return res.status(404).json({ message: "Aucune donnée trouvée à supprimer." });
        }

        await baseDeDonnees.query("DELETE FROM baccalaureats WHERE idUtilisateur = ?", [idUtilisateur]);

        res.status(200).json({ message: "Données supprimées avec succès." });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ erreur: "Erreur serveur." });
    }
});

export default baccalaureatRoutes;
