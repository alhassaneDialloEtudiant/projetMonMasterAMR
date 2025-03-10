import { Router } from "express";
import { baseDeDonnees } from "../db/baseDeDonnees.mjs";

const coordonneesRoutes = Router();

// 📌 Récupérer les coordonnées d'un utilisateur connecté
coordonneesRoutes.get("/:idUtilisateur", async (req, res) => {
    const { idUtilisateur } = req.params;
  
    try {
      // 🔥 Récupérer l'email de l'utilisateur + ses coordonnées
      const requete = `
        SELECT u.emailUtilisateur, c.telephone1, c.telephone2 
        FROM utilisateurs u
        LEFT JOIN coordonnees c ON u.idUtilisateur = c.idUtilisateur
        WHERE u.idUtilisateur = ?;
      `;
  
      const [resultats] = await baseDeDonnees.query(requete, [idUtilisateur]);
  
      if (resultats.length === 0) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
  
      res.status(200).json(resultats[0]); // Retourner l'email et les téléphones
    } catch (error) {
      console.error("Erreur lors de la récupération des coordonnées :", error);
      res.status(500).json({ erreur: "Erreur serveur." });
    }
  });

// 📌 Enregistrer ou mettre à jour les coordonnées
coordonneesRoutes.post("/enregistrer/:idUtilisateur", async (req, res) => {
  const { idUtilisateur } = req.params;
  const { telephone1, telephone2 } = req.body;

  try {
    // Vérifier si l'utilisateur a déjà des coordonnées
    const [existant] = await baseDeDonnees.query(
      "SELECT * FROM coordonnees WHERE idUtilisateur = ?",
      [idUtilisateur]
    );

    if (existant.length > 0) {
      // Mise à jour des coordonnées existantes
      await baseDeDonnees.query(`
        UPDATE coordonnees SET telephone1 = ?, telephone2 = ? WHERE idUtilisateur = ?
      `, [telephone1, telephone2, idUtilisateur]);

      return res.status(200).json({ message: "Coordonnées mises à jour avec succès." });
    }

    // Insérer de nouvelles coordonnées
    await baseDeDonnees.query(`
      INSERT INTO coordonnees (idUtilisateur, telephone1, telephone2) VALUES (?, ?, ?)
    `, [idUtilisateur, telephone1, telephone2]);

    res.status(201).json({ message: "Coordonnées enregistrées avec succès." });
  } catch (error) {
    res.status(500).json({ erreur: "Erreur serveur.", details: error.message });
  }
});

// 📌 Récupérer les coordonnées d'un utilisateur connecté
coordonneesRoutes.get("/:idUtilisateur", async (req, res) => {
  const { idUtilisateur } = req.params;

  try {
    // 🔥 Récupérer l'email de l'utilisateur + ses coordonnées
    const requete = `
      SELECT u.emailUtilisateur, c.telephone1, c.telephone2 
      FROM utilisateurs u
      LEFT JOIN coordonnees c ON u.idUtilisateur = c.idUtilisateur
      WHERE u.idUtilisateur = ?;
    `;

    const [resultats] = await baseDeDonnees.query(requete, [idUtilisateur]);

    if (resultats.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json(resultats[0]); // Retourner l'email et les téléphones
  } catch (error) {
    console.error("Erreur lors de la récupération des coordonnées :", error);
    res.status(500).json({ erreur: "Erreur serveur." });
  }
});

export default coordonneesRoutes;
