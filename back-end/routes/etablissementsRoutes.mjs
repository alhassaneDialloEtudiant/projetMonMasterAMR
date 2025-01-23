import { Router } from 'express';
import { baseDeDonnees } from '../db/baseDeDonnees.mjs';

const routeurEtablissements = Router(); // Routeur spécifique à la table `etablissements`

// Ajouter un établissement
routeurEtablissements.post('/ajouter', async (req, res) => {
    const { nomEtablissement, adresseEtablissement, contactEtablissement, localisationEtablissement } = req.body;

    try {
        // Validation des données reçues
        if (!nomEtablissement || !adresseEtablissement || !contactEtablissement || !localisationEtablissement) {
            return res.status(400).json({ erreur: 'Tous les champs sont obligatoires.' });
        }

        // Requête SQL pour ajouter un établissement
        const requeteAjoutEtablissement = `
            INSERT INTO etablissements (nomEtablissement, adresseEtablissement, contactEtablissement, localisationEtablissement)
            VALUES (?, ?, ?, ?)
        `;
        const [resultat] = await baseDeDonnees.query(requeteAjoutEtablissement, [
            nomEtablissement,
            adresseEtablissement,
            contactEtablissement,
            localisationEtablissement,
        ]);

        res.status(201).json({ message: 'Établissement ajouté avec succès.', idEtablissement: resultat.insertId });
    } catch (error) {
        console.error('Erreur lors de l’ajout de l’établissement :', error);
        res.status(500).json({ erreur: 'Erreur lors de l’ajout de l’établissement.', details: error.message });
    }
});

// Récupérer tous les établissements
routeurEtablissements.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererTousEtablissements = `
            SELECT * FROM etablissements
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererTousEtablissements);
        res.status(200).json(resultats);
    } catch (error) {
        console.error('Erreur lors de la récupération des établissements :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération des établissements.', details: error.message });
    }
});

// Récupérer un établissement par son ID
routeurEtablissements.get('/afficher/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const requeteRecupererEtablissementParId = `
            SELECT * FROM etablissements WHERE idEtablissement = ?
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererEtablissementParId, [id]);
        if (resultats.length === 0) {
            return res.status(404).json({ erreur: 'Établissement non trouvé.' });
        }
        res.status(200).json(resultats[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération de l’établissement :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération de l’établissement.', details: error.message });
    }
});

// Modifier un établissement
routeurEtablissements.put('/modifier/:id', async (req, res) => {
    const { id } = req.params;
    const { nomEtablissement, adresseEtablissement, contactEtablissement, localisationEtablissement } = req.body;

    try {
        // Validation des données reçues
        if (!nomEtablissement || !adresseEtablissement || !contactEtablissement || !localisationEtablissement) {
            return res.status(400).json({ erreur: 'Tous les champs sont obligatoires.' });
        }

        const requeteModifierEtablissement = `
            UPDATE etablissements
            SET nomEtablissement = ?, adresseEtablissement = ?, contactEtablissement = ?, localisationEtablissement = ?
            WHERE idEtablissement = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteModifierEtablissement, [
            nomEtablissement,
            adresseEtablissement,
            contactEtablissement,
            localisationEtablissement,
            id,
        ]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Établissement non trouvé.' });
        }

        res.status(200).json({ message: 'Établissement mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l’établissement :', error);
        res.status(500).json({ erreur: 'Erreur lors de la mise à jour de l’établissement.', details: error.message });
    }
});

// Supprimer un établissement
routeurEtablissements.delete('/supprimer/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const requeteSupprimerEtablissement = `
            DELETE FROM etablissements WHERE idEtablissement = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteSupprimerEtablissement, [id]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Établissement non trouvé.' });
        }

        res.status(200).json({ message: 'Établissement supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l’établissement :', error);
        res.status(500).json({ erreur: 'Erreur lors de la suppression de l’établissement.', details: error.message });
    }
});

export default routeurEtablissements;
