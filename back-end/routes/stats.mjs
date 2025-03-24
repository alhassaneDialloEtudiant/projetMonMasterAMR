import { Router } from "express";
import { baseDeDonnees } from "../db/baseDeDonnees.mjs";

const routeurStats = Router();

routeurStats.get("/admin/:idAdminUniversite", async (req, res) => {
    const { idAdminUniversite } = req.params;

    try {
        const [[formations]] = await baseDeDonnees.query(
            "SELECT COUNT(*) AS total FROM formations WHERE idAdminUniversite = ?", 
            [idAdminUniversite]
        );

        const [[enAttente]] = await baseDeDonnees.query(
            "SELECT COUNT(*) AS total FROM candidatures WHERE statut = 'En attente' AND idFormation IN (SELECT idFormation FROM formations WHERE idAdminUniversite = ?)", 
            [idAdminUniversite]
        );

        const [[refusees]] = await baseDeDonnees.query(
            "SELECT COUNT(*) AS total FROM candidatures WHERE statut = 'refusée' AND idFormation IN (SELECT idFormation FROM formations WHERE idAdminUniversite = ?)", 
            [idAdminUniversite]
        );

        const [[acceptees]] = await baseDeDonnees.query(
            "SELECT COUNT(*) AS total FROM candidatures WHERE statut = 'acceptée' AND idFormation IN (SELECT idFormation FROM formations WHERE idAdminUniversite = ?)", 
            [idAdminUniversite]
        );

        res.json({
            formations: formations.total,
            enAttente: enAttente.total,
            refusees: refusees.total,
            acceptees: acceptees.total
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
        res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
});

export default routeurStats;
