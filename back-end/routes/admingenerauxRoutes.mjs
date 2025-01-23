import { Router } from 'express';
import { baseDeDonnees } from '../db/baseDeDonnees.mjs';

const routeurAdminGeneraux = Router(); // Routeur spécifique à la table `admingeneraux`

// Ajouter un administrateur général
routeurAdminGeneraux.post('/ajouter', async (req, res) => {
    const { idUtilisateur, pouvoirAdmin } = req.body;

    try {
        // Validation des données reçues
        if (!idUtilisateur || !pouvoirAdmin) {
            return res.status(400).json({ erreur: 'Tous les champs sont requis.' });
        }

        // Requête SQL pour ajouter un administrateur général
        const requeteAjoutAdmin = `
            INSERT INTO admingeneraux (idUtilisateur, pouvoirAdmin)
            VALUES (?, ?)
        `;
        await baseDeDonnees.query(requeteAjoutAdmin, [idUtilisateur, pouvoirAdmin]);

        res.status(201).json({ message: 'Administrateur général ajouté avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l’ajout de l’administrateur général :', error);
        res.status(500).json({ erreur: 'Erreur lors de l’ajout de l’administrateur général.', details: error.message });
    }
});

// Récupérer tous les administrateurs généraux
routeurAdminGeneraux.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererAdmins = 'SELECT * FROM admingeneraux';
        const [resultats] = await baseDeDonnees.query(requeteRecupererAdmins);
        res.status(200).json(resultats);
    } catch (error) {
        console.error('Erreur lors de la récupération des administrateurs généraux :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération des administrateurs généraux.', details: error.message });
    }
});

// Récupérer un administrateur général par son ID
routeurAdminGeneraux.get('/afficher/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const requeteRecupererAdminParId = 'SELECT * FROM admingeneraux WHERE idAdminGeneral = ?';
        const [resultats] = await baseDeDonnees.query(requeteRecupererAdminParId, [id]);
        if (resultats.length === 0) {
            return res.status(404).json({ erreur: 'Administrateur général non trouvé.' });
        }
        res.status(200).json(resultats[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération de l’administrateur général :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération de l’administrateur général.', details: error.message });
    }
});

// Modifier un administrateur général
routeurAdminGeneraux.put('/modifier/:id', async (req, res) => {
    const { id } = req.params;
    const { idUtilisateur, pouvoirAdmin } = req.body;

    try {
        // Validation des données reçues
        if (!idUtilisateur || !pouvoirAdmin) {
            return res.status(400).json({ erreur: 'Tous les champs sont requis.' });
        }

        const requeteModifierAdmin = `
            UPDATE admingeneraux
            SET idUtilisateur = ?, pouvoirAdmin = ?
            WHERE idAdminGeneral = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteModifierAdmin, [idUtilisateur, pouvoirAdmin, id]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Administrateur général non trouvé.' });
        }

        res.status(200).json({ message: 'Administrateur général mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l’administrateur général :', error);
        res.status(500).json({ erreur: 'Erreur lors de la mise à jour de l’administrateur général.', details: error.message });
    }
});

// Supprimer un administrateur général
routeurAdminGeneraux.delete('/supprimer/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const requeteSupprimerAdmin = 'DELETE FROM admingeneraux WHERE idAdminGeneral = ?';
        const [resultat] = await baseDeDonnees.query(requeteSupprimerAdmin, [id]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Administrateur général non trouvé.' });
        }

        res.status(200).json({ message: 'Administrateur général supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l’administrateur général :', error);
        res.status(500).json({ erreur: 'Erreur lors de la suppression de l’administrateur général.', details: error.message });
    }
});

export default routeurAdminGeneraux;
