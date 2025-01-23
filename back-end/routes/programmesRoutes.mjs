import { Router } from 'express'; // Importer le module Router d'Express pour créer des routes
import { baseDeDonnees } from '../db/baseDeDonnees.mjs'; // Importer la connexion à la base de données

const routeurProgrammes = Router(); // Routeur spécifique à la table `programmes`

// Route pour ajouter un programme
routeurProgrammes.post('/ajouter', async (req, res) => {
    const { nomProgramme, descriptionProgramme, dureeProgramme, idEtablissement, placesDisponibles } = req.body; // Extraire les données du corps de la requête

    try {
        // Validation des données reçues
        if (!nomProgramme || !descriptionProgramme || !dureeProgramme || !idEtablissement || !placesDisponibles) {
            return res.status(400).json({ erreur: 'Tous les champs sont obligatoires.' }); // Retourner une erreur si des champs sont manquants
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
        ]); // Exécuter la requête avec les données fournies

        res.status(201).json({ message: 'Programme ajouté avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de l’ajout du programme :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de l’ajout du programme.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour récupérer tous les programmes
routeurProgrammes.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererTousProgrammes = `
            SELECT * FROM programmes
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererTousProgrammes); // Exécuter la requête
        res.status(200).json(resultats); // Retourner les résultats au client
    } catch (error) {
        console.error('Erreur lors de la récupération des programmes :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la récupération des programmes.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour récupérer un programme par son ID
routeurProgrammes.get('/afficher/:idProgramme', async (req, res) => {
    const { idProgramme } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteRecupererProgrammeParId = `
            SELECT * FROM programmes WHERE idProgramme = ?
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererProgrammeParId, [idProgramme]); // Exécuter la requête avec l'ID fourni

        if (resultats.length === 0) {
            return res.status(404).json({ erreur: 'Programme non trouvé.' }); // Retourner une erreur si le programme n'est pas trouvé
        }

        res.status(200).json(resultats[0]); // Retourner les résultats au client
    } catch (error) {
        console.error('Erreur lors de la récupération du programme :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la récupération du programme.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour modifier un programme
routeurProgrammes.put('/modifier/:idProgramme', async (req, res) => {
    const { idProgramme } = req.params; // Extraire l'ID des paramètres de la requête
    const { nomProgramme, descriptionProgramme, dureeProgramme, placesDisponibles } = req.body; // Extraire les données du corps de la requête

    try {
        // Validation des données reçues
        if (!nomProgramme || !descriptionProgramme || !dureeProgramme || !placesDisponibles) {
            return res.status(400).json({ erreur: 'Tous les champs sont obligatoires.' }); // Retourner une erreur si des champs sont manquants
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
        ]); // Exécuter la requête avec les données fournies

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Programme non trouvé.' }); // Retourner une erreur si le programme n'est pas trouvé
        }

        res.status(200).json({ message: 'Programme mis à jour avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de la mise à jour du programme :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la mise à jour du programme.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour supprimer un programme
routeurProgrammes.delete('/supprimer/:idProgramme', async (req, res) => {
    const { idProgramme } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteSupprimerProgramme = `
            DELETE FROM programmes WHERE idProgramme = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteSupprimerProgramme, [idProgramme]); // Exécuter la requête avec l'ID fourni

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Programme non trouvé.' }); // Retourner une erreur si le programme n'est pas trouvé
        }

        res.status(200).json({ message: 'Programme supprimé avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de la suppression du programme :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la suppression du programme.', details: error.message }); // Retourner une erreur au client
    }
});

export default routeurProgrammes; // Exporter le routeur pour l'utiliser dans d'autres fichiers