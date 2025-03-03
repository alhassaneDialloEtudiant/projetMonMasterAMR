import { Router } from 'express';
import { baseDeDonnees } from '../db/baseDeDonnees.mjs';

const routeurAdminUniversitaires = Router();

// Route pour ajouter un administrateur universitaire
routeurAdminUniversitaires.post('/ajouter', async (req, res) => {
    const { idEtablissement, idUtilisateur, poste } = req.body;
    console.log("Données reçues pour insertion :", { idEtablissement, idUtilisateur, poste });

    try {
        // Vérifiez les champs obligatoires
        if (!idEtablissement || !idUtilisateur || !poste) {
            console.error("Validation échouée : champs manquants");
            return res.status(400).json({ erreur: 'Tous les champs sont requis.' });
        }

        // Requête SQL pour ajouter un administrateur universitaire
        const requeteAjout = `
            INSERT INTO adminuniversitaires (idEtablissement, idUtilisateur, poste)
            VALUES (?, ?, ?)
        `;

        const [resultat] = await baseDeDonnees.query(requeteAjout, [
            idEtablissement,
            idUtilisateur,
            poste,
        ]);

        console.log("Résultat de la requête :", resultat);

        res.status(201).json({ message: 'Administrateur universitaire ajouté avec succès.' });
    } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
        res.status(500).json({ erreur: 'Erreur interne.', details: error.message });
    }
});

// Route pour récupérer tous les administrateurs universitaires
routeurAdminUniversitaires.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererAdminsUniv = `
            SELECT a.*, e.nomEtablissement, e.adresseEtablissement, 
                   e.contactEtablissement, e.localisationEtablissement, 
                   u.nomUtilisateur, u.prenomUtilisateur, u.emailUtilisateur
            FROM adminuniversitaires a
            JOIN etablissements e ON a.idEtablissement = e.idEtablissement
            JOIN utilisateurs u ON a.idUtilisateur = u.idUtilisateur
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererAdminsUniv);
        console.log("Données retournées :", resultats); // Ajoutez ce log
        res.status(200).json(resultats);
    } catch (error) {
        console.error('Erreur lors de la récupération des administrateurs universitaires :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération des administrateurs universitaires.', details: error.message });
    }
});

// Route pour modifier un administrateur universitaire
routeurAdminUniversitaires.put('/modifier/:id', async (req, res) => {
    const { id } = req.params;
    const { idEtablissement, idUtilisateur, poste } = req.body;

    try {
        if (!idEtablissement || !idUtilisateur || !poste) {
            return res.status(400).json({ erreur: 'Tous les champs sont requis.' });
        }

        const requeteModifierAdminUniv = `
            UPDATE adminuniversitaires
            SET idEtablissement = ?, idUtilisateur = ?, poste = ?
            WHERE idAdminUniversitaire = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteModifierAdminUniv, [idEtablissement, idUtilisateur, poste, id]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Administrateur universitaire non trouvé.' });
        }

        res.status(200).json({ message: 'Administrateur universitaire mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l’administrateur universitaire :', error);
        res.status(500).json({ erreur: 'Erreur lors de la mise à jour de l’administrateur universitaire.', details: error.message });
    }
});

// Route pour supprimer un administrateur universitaire
routeurAdminUniversitaires.delete('/supprimer/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const requeteSupprimerAdminUniv = 'DELETE FROM adminuniversitaires WHERE idAdminUniversitaire = ?';
        const [resultat] = await baseDeDonnees.query(requeteSupprimerAdminUniv, [id]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Administrateur universitaire non trouvé.' });
        }

        res.status(200).json({ message: 'Administrateur universitaire supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l’administrateur universitaire :', error);
        res.status(500).json({ erreur: 'Erreur lors de la suppression de l’administrateur universitaire.', details: error.message });
    }
});

// Nouvelle route pour récupérer uniquement les utilisateurs ayant le rôle 'AdminUniversitaire'
routeurAdminUniversitaires.get('/utilisateurs-admins', async (req, res) => {
    try {
        const requeteRecupererAdmins = `
            SELECT idUtilisateur, nomUtilisateur, prenomUtilisateur, emailUtilisateur
            FROM utilisateurs
            WHERE roleUtilisateur = 'AdminUniversitaire'
            AND idUtilisateur NOT IN (
                SELECT idUtilisateur FROM adminuniversitaires
            )
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererAdmins);
        res.status(200).json(resultats);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs administrateurs universitaires :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération des utilisateurs.', details: error.message });
    }
});

// Route pour récupérer tous les établissements
routeurAdminUniversitaires.get('/etablissements', async (req, res) => {
    try {
      const requeteRecupererEtablissements = `
        SELECT idEtablissement, nomEtablissement, adresseEtablissement, contactEtablissement, localisationEtablissement 
        FROM etablissements
      `;
      const [resultats] = await baseDeDonnees.query(requeteRecupererEtablissements);
      res.status(200).json(resultats);
    } catch (error) {
      console.error('Erreur lors de la récupération des établissements :', error);
      res.status(500).json({ erreur: 'Erreur lors de la récupération des établissements.', details: error.message });
    }
  });
  

export default routeurAdminUniversitaires;