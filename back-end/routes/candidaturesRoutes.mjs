import { Router } from 'express'; // Importer le module Router d'Express pour créer des routes
import { baseDeDonnees } from '../db/baseDeDonnees.mjs'; // Importer la connexion à la base de données

const routeurCandidatures = Router(); // Créer un routeur spécifique à la table `candidatures`

// Route pour ajouter une candidature
routeurCandidatures.post('/ajouter', async (req, res) => {
    const { idProgramme, idUtilisateur, statutCandidature } = req.body; // Extraire les données du corps de la requête

    try {
        // Validation des données reçues
        if (!idProgramme || !idUtilisateur) {
            return res.status(400).json({ erreur: 'Les champs idProgramme et idUtilisateur sont obligatoires.' }); // Retourner une erreur si des champs sont manquants
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

        res.status(201).json({ message: 'Candidature ajoutée avec succès.', idCandidature: resultat.insertId }); // Retourner un message de succès avec l'ID de la candidature ajoutée
    } catch (error) {
        console.error('Erreur lors de l’ajout de la candidature :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de l’ajout de la candidature.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour récupérer toutes les candidatures
routeurCandidatures.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererToutesCandidatures = `
            SELECT * FROM candidatures
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererToutesCandidatures); // Exécuter la requête
        res.status(200).json(resultats); // Retourner les résultats au client
    } catch (error) {
        console.error('Erreur lors de la récupération des candidatures :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la récupération des candidatures.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour récupérer une candidature par son ID
routeurCandidatures.get('/afficher/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteRecupererCandidatureParId = `
            SELECT * FROM candidatures WHERE idCandidature = ?
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererCandidatureParId, [id]); // Exécuter la requête avec l'ID fourni
        if (resultats.length === 0) {
            return res.status(404).json({ erreur: 'Candidature non trouvée.' }); // Retourner une erreur si la candidature n'est pas trouvée
        }
        res.status(200).json(resultats[0]); // Retourner les résultats au client
    } catch (error) {
        console.error('Erreur lors de la récupération de la candidature :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la récupération de la candidature.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour modifier une candidature
routeurCandidatures.put('/modifier/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête
    const { idProgramme, idUtilisateur, statutCandidature } = req.body; // Extraire les données du corps de la requête

    try {
        // Validation des données reçues
        if (!idProgramme || !idUtilisateur || !statutCandidature) {
            return res.status(400).json({ erreur: 'Tous les champs sont requis.' }); // Retourner une erreur si des champs sont manquants
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
        ]); // Exécuter la requête avec les données fournies

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Candidature non trouvée.' }); // Retourner une erreur si la candidature n'est pas trouvée
        }

        res.status(200).json({ message: 'Candidature mise à jour avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la candidature :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la mise à jour de la candidature.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour supprimer une candidature
routeurCandidatures.delete('/supprimer/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteSupprimerCandidature = `
            DELETE FROM candidatures WHERE idCandidature = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteSupprimerCandidature, [id]); // Exécuter la requête avec l'ID fourni

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Candidature non trouvée.' }); // Retourner une erreur si la candidature n'est pas trouvée
        }

        res.status(200).json({ message: 'Candidature supprimée avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de la suppression de la candidature :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la suppression de la candidature.', details: error.message }); // Retourner une erreur au client
    }
});

export default routeurCandidatures; // Exporter le routeur pour l'utiliser dans d'autres fichiers