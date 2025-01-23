import { Router } from 'express';
import { baseDeDonnees } from '../db/baseDeDonnees.mjs';

const routeurAdminUniversitaires = Router(); // Routeur spécifique à la table `adminuniversitaires`

// Ajouter un administrateur universitaire
routeurAdminUniversitaires.post('/ajouter', async (req, res) => {
    const { idEtablissement, idUtilisateur, poste } = req.body;

    try {
        // Validation des données reçues
        if (!idEtablissement || !idUtilisateur || !poste) {
            return res.status(400).json({ erreur: 'Tous les champs sont requis.' });
        }

        // Requête SQL pour ajouter un administrateur universitaire
        const requeteAjoutAdminUniv = `
            INSERT INTO adminuniversitaires (idEtablissement, idUtilisateur, poste)
            VALUES (?, ?, ?)
        `;
        await baseDeDonnees.query(requeteAjoutAdminUniv, [idEtablissement, idUtilisateur, poste]);

        res.status(201).json({ message: 'Administrateur universitaire ajouté avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l’ajout de l’administrateur universitaire :', error);
        res.status(500).json({ erreur: 'Erreur lors de l’ajout de l’administrateur universitaire.', details: error.message });
    }
});

// Récupérer tous les administrateurs universitaires
routeurAdminUniversitaires.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererAdminsUniv = 'SELECT * FROM adminuniversitaires';
        const [resultats] = await baseDeDonnees.query(requeteRecupererAdminsUniv);
        res.status(200).json(resultats);
    } catch (error) {
        console.error('Erreur lors de la récupération des administrateurs universitaires :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération des administrateurs universitaires.', details: error.message });
    }
});

// Récupérer un administrateur universitaire par son ID
routeurAdminUniversitaires.get('/afficher/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const requeteRecupererAdminUnivParId = 'SELECT * FROM adminuniversitaires WHERE idAdminUniversitaire = ?';
        const [resultats] = await baseDeDonnees.query(requeteRecupererAdminUnivParId, [id]);
        if (resultats.length === 0) {
            return res.status(404).json({ erreur: 'Administrateur universitaire non trouvé.' });
        }
        res.status(200).json(resultats[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération de l’administrateur universitaire :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération de l’administrateur universitaire.', details: error.message });
    }
});

// Modifier un administrateur universitaire
routeurAdminUniversitaires.put('/modifier/:id', async (req, res) => {
    const { id } = req.params;
    const { idEtablissement, idUtilisateur, poste } = req.body;

    try {
        // Validation des données reçues
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

// Supprimer un administrateur universitaire
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

export default routeurAdminUniversitaires;
