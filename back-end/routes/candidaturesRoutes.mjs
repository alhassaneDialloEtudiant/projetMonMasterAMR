import { Router } from 'express';
import { baseDeDonnees } from '../db/baseDeDonnees.mjs';

const routeurCandidatures = Router(); // Routeur spécifique à la table `candidatures`

// Ajouter une candidature
routeurCandidatures.post('/ajouter', async (req, res) => {
    const { idProgramme, idUtilisateur, statutCandidature } = req.body;

    try {
        // Validation des données reçues
        if (!idProgramme || !idUtilisateur) {
            return res.status(400).json({ erreur: 'Les champs idProgramme et idUtilisateur sont obligatoires.' });
        }

        // Requête SQL pour ajouter une candidature
        const requeteAjoutCandidature = `
            INSERT INTO candidatures (idProgramme, idUtilisateur, statutCandidature)
            VALUES (?, ?, ?)
        `;
        const [resultat] = await baseDeDonnees.query(requeteAjoutCandidature, [
            idProgramme,
            idUtilisateur,
            statutCandidature || 'enAttente', // Défaut à "enAttente" si non fourni
        ]);

        res.status(201).json({ message: 'Candidature ajoutée avec succès.', idCandidature: resultat.insertId });
    } catch (error) {
        console.error('Erreur lors de l’ajout de la candidature :', error);
        res.status(500).json({ erreur: 'Erreur lors de l’ajout de la candidature.', details: error.message });
    }
});

// Récupérer toutes les candidatures
routeurCandidatures.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererToutesCandidatures = `
            SELECT * FROM candidatures
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererToutesCandidatures);
        res.status(200).json(resultats);
    } catch (error) {
        console.error('Erreur lors de la récupération des candidatures :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération des candidatures.', details: error.message });
    }
});

// Récupérer une candidature par son ID
routeurCandidatures.get('/afficher/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const requeteRecupererCandidatureParId = `
            SELECT * FROM candidatures WHERE idCandidature = ?
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererCandidatureParId, [id]);
        if (resultats.length === 0) {
            return res.status(404).json({ erreur: 'Candidature non trouvée.' });
        }
        res.status(200).json(resultats[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération de la candidature :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération de la candidature.', details: error.message });
    }
});

// Modifier une candidature
routeurCandidatures.put('/modifier/:id', async (req, res) => {
    const { id } = req.params;
    const { idProgramme, idUtilisateur, statutCandidature } = req.body;

    try {
        // Validation des données reçues
        if (!idProgramme || !idUtilisateur || !statutCandidature) {
            return res.status(400).json({ erreur: 'Tous les champs sont requis.' });
        }

        const requeteModifierCandidature = `
            UPDATE candidatures
            SET idProgramme = ?, idUtilisateur = ?, statutCandidature = ?
            WHERE idCandidature = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteModifierCandidature, [
            idProgramme,
            idUtilisateur,
            statutCandidature,
            id,
        ]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Candidature non trouvée.' });
        }

        res.status(200).json({ message: 'Candidature mise à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la candidature :', error);
        res.status(500).json({ erreur: 'Erreur lors de la mise à jour de la candidature.', details: error.message });
    }
});

// Supprimer une candidature
routeurCandidatures.delete('/supprimer/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const requeteSupprimerCandidature = `
            DELETE FROM candidatures WHERE idCandidature = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteSupprimerCandidature, [id]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Candidature non trouvée.' });
        }

        res.status(200).json({ message: 'Candidature supprimée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la candidature :', error);
        res.status(500).json({ erreur: 'Erreur lors de la suppression de la candidature.', details: error.message });
    }
});

export default routeurCandidatures;
