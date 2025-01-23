import { Router } from 'express';
import { baseDeDonnees } from '../db/baseDeDonnees.mjs';

const routeurCriteresAdmissions = Router(); // Routeur spécifique à la table `criteresadmissions`

// Ajouter un critère d'admission
routeurCriteresAdmissions.post('/ajouter', async (req, res) => {
    const { descriptionCritere, idProgramme } = req.body;

    try {
        // Validation des données reçues
        if (!descriptionCritere || !idProgramme) {
            return res.status(400).json({ erreur: 'Les champs descriptionCritere et idProgramme sont obligatoires.' });
        }

        // Requête SQL pour ajouter un critère
        const requeteAjoutCritere = `
            INSERT INTO criteresadmissions (descriptionCritere, idProgramme)
            VALUES (?, ?)
        `;
        const [resultat] = await baseDeDonnees.query(requeteAjoutCritere, [descriptionCritere, idProgramme]);

        res.status(201).json({ message: 'Critère ajouté avec succès.', idCritere: resultat.insertId });
    } catch (error) {
        console.error('Erreur lors de l’ajout du critère :', error);
        res.status(500).json({ erreur: 'Erreur lors de l’ajout du critère.', details: error.message });
    }
});

// Récupérer tous les critères d'admission
routeurCriteresAdmissions.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererTousCriteres = `
            SELECT * FROM criteresadmissions
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererTousCriteres);
        res.status(200).json(resultats);
    } catch (error) {
        console.error('Erreur lors de la récupération des critères :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération des critères.', details: error.message });
    }
});

// Récupérer un critère d'admission par son ID
routeurCriteresAdmissions.get('/afficher/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const requeteRecupererCritereParId = `
            SELECT * FROM criteresadmissions WHERE idCritere = ?
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererCritereParId, [id]);
        if (resultats.length === 0) {
            return res.status(404).json({ erreur: 'Critère non trouvé.' });
        }
        res.status(200).json(resultats[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération du critère :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération du critère.', details: error.message });
    }
});

// Modifier un critère d'admission
routeurCriteresAdmissions.put('/modifier/:id', async (req, res) => {
    const { id } = req.params;
    const { descriptionCritere, idProgramme } = req.body;

    try {
        // Validation des données reçues
        if (!descriptionCritere || !idProgramme) {
            return res.status(400).json({ erreur: 'Les champs descriptionCritere et idProgramme sont obligatoires.' });
        }

        const requeteModifierCritere = `
            UPDATE criteresadmissions
            SET descriptionCritere = ?, idProgramme = ?
            WHERE idCritere = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteModifierCritere, [descriptionCritere, idProgramme, id]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Critère non trouvé.' });
        }

        res.status(200).json({ message: 'Critère mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du critère :', error);
        res.status(500).json({ erreur: 'Erreur lors de la mise à jour du critère.', details: error.message });
    }
});

// Supprimer un critère d'admission
routeurCriteresAdmissions.delete('/supprimer/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const requeteSupprimerCritere = `
            DELETE FROM criteresadmissions WHERE idCritere = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteSupprimerCritere, [id]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Critère non trouvé.' });
        }

        res.status(200).json({ message: 'Critère supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression du critère :', error);
        res.status(500).json({ erreur: 'Erreur lors de la suppression du critère.', details: error.message });
    }
});

export default routeurCriteresAdmissions;
