import { Router } from 'express';
import { baseDeDonnees } from '../db/baseDeDonnees.mjs';

const routeurProgrammes = Router(); // Routeur spécifique à la table `programmes`

// Ajouter un programme
routeurProgrammes.post('/ajouter', async (req, res) => {
    const { nomProgramme, descriptionProgramme, dureeProgramme, idEtablissement, placesDisponibles } = req.body;

    try {
        // Validation des données reçues
        if (!nomProgramme || !descriptionProgramme || !dureeProgramme || !idEtablissement || !placesDisponibles) {
            return res.status(400).json({ erreur: 'Tous les champs sont obligatoires.' });
        }

        // Requête SQL pour ajouter un programme
        const requeteAjoutProgramme = `
            INSERT INTO programmes (nomProgramme, descriptionProgramme, dureeProgramme, idEtablissement, placesDisponibles)
            VALUES (?, ?, ?, ?, ?)
        `;
        await baseDeDonnees.query(requeteAjoutProgramme, [
            nomProgramme,
            descriptionProgramme,
            dureeProgramme,
            idEtablissement,
            placesDisponibles
        ]);

        res.status(201).json({ message: 'Programme ajouté avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l’ajout du programme :', error);
        res.status(500).json({ erreur: 'Erreur lors de l’ajout du programme.', details: error.message });
    }
});

// Récupérer tous les programmes
routeurProgrammes.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererTousProgrammes = `
            SELECT * FROM programmes
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererTousProgrammes);
        res.status(200).json(resultats);
    } catch (error) {
        console.error('Erreur lors de la récupération des programmes :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération des programmes.', details: error.message });
    }
});

// Récupérer un programme par son ID
routeurProgrammes.get('/afficher/:idProgramme', async (req, res) => {
    const { idProgramme } = req.params;

    try {
        const requeteRecupererProgrammeParId = `
            SELECT * FROM programmes WHERE idProgramme = ?
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererProgrammeParId, [idProgramme]);

        if (resultats.length === 0) {
            return res.status(404).json({ erreur: 'Programme non trouvé.' });
        }

        res.status(200).json(resultats[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération du programme :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération du programme.', details: error.message });
    }
});

// Modifier un programme
routeurProgrammes.put('/modifier/:idProgramme', async (req, res) => {
    const { idProgramme } = req.params;
    const { nomProgramme, descriptionProgramme, dureeProgramme, placesDisponibles } = req.body;

    try {
        // Validation des données reçues
        if (!nomProgramme || !descriptionProgramme || !dureeProgramme || !placesDisponibles) {
            return res.status(400).json({ erreur: 'Tous les champs sont obligatoires.' });
        }

        const requeteModifierProgramme = `
            UPDATE programmes
            SET nomProgramme = ?, descriptionProgramme = ?, dureeProgramme = ?, placesDisponibles = ?
            WHERE idProgramme = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteModifierProgramme, [
            nomProgramme,
            descriptionProgramme,
            dureeProgramme,
            placesDisponibles,
            idProgramme
        ]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Programme non trouvé.' });
        }

        res.status(200).json({ message: 'Programme mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du programme :', error);
        res.status(500).json({ erreur: 'Erreur lors de la mise à jour du programme.', details: error.message });
    }
});

// Supprimer un programme
routeurProgrammes.delete('/supprimer/:idProgramme', async (req, res) => {
    const { idProgramme } = req.params;

    try {
        const requeteSupprimerProgramme = `
            DELETE FROM programmes WHERE idProgramme = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteSupprimerProgramme, [idProgramme]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Programme non trouvé.' });
        }

        res.status(200).json({ message: 'Programme supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression du programme :', error);
        res.status(500).json({ erreur: 'Erreur lors de la suppression du programme.', details: error.message });
    }
});

export default routeurProgrammes;
