import { Router } from 'express'; // Importer le module Router d'Express pour créer des routes
import { baseDeDonnees } from '../db/baseDeDonnees.mjs'; // Importer la connexion à la base de données

const routeurCriteresAdmissions = Router(); // Créer un routeur spécifique à la table `criteresadmissions`

// Route pour ajouter un critère d'admission
routeurCriteresAdmissions.post('/ajouter', async (req, res) => {
    const { descriptionCritere, idProgramme } = req.body; // Extraire les données du corps de la requête

    try {
        // Validation des données reçues
        if (!descriptionCritere || !idProgramme) {
            return res.status(400).json({ erreur: 'Les champs descriptionCritere et idProgramme sont obligatoires.' }); // Retourner une erreur si des champs sont manquants
        }

        // Requête SQL pour ajouter un critère
        const requeteAjoutCritere = `
            INSERT INTO criteresadmissions (descriptionCritere, idProgramme)
            VALUES (?, ?)
        `;
        const [resultat] = await baseDeDonnees.query(requeteAjoutCritere, [descriptionCritere, idProgramme]); // Exécuter la requête avec les données fournies

        res.status(201).json({ message: 'Critère ajouté avec succès.', idCritere: resultat.insertId }); // Retourner un message de succès avec l'ID du critère ajouté
    } catch (error) {
        console.error('Erreur lors de l’ajout du critère :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de l’ajout du critère.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour récupérer tous les critères d'admission
routeurCriteresAdmissions.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererTousCriteres = `
            SELECT * FROM criteresadmissions
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererTousCriteres); // Exécuter la requête
        res.status(200).json(resultats); // Retourner les résultats au client
    } catch (error) {
        console.error('Erreur lors de la récupération des critères :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la récupération des critères.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour récupérer un critère d'admission par son ID
routeurCriteresAdmissions.get('/afficher/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteRecupererCritereParId = `
            SELECT * FROM criteresadmissions WHERE idCritere = ?
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererCritereParId, [id]); // Exécuter la requête avec l'ID fourni
        if (resultats.length === 0) {
            return res.status(404).json({ erreur: 'Critère non trouvé.' }); // Retourner une erreur si le critère n'est pas trouvé
        }
        res.status(200).json(resultats[0]); // Retourner les résultats au client
    } catch (error) {
        console.error('Erreur lors de la récupération du critère :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la récupération du critère.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour modifier un critère d'admission
routeurCriteresAdmissions.put('/modifier/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête
    const { descriptionCritere, idProgramme } = req.body; // Extraire les données du corps de la requête

    try {
        // Validation des données reçues
        if (!descriptionCritere || !idProgramme) {
            return res.status(400).json({ erreur: 'Les champs descriptionCritere et idProgramme sont obligatoires.' }); // Retourner une erreur si des champs sont manquants
        }

        const requeteModifierCritere = `
            UPDATE criteresadmissions
            SET descriptionCritere = ?, idProgramme = ?
            WHERE idCritere = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteModifierCritere, [descriptionCritere, idProgramme, id]); // Exécuter la requête avec les données fournies

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Critère non trouvé.' }); // Retourner une erreur si le critère n'est pas trouvé
        }

        res.status(200).json({ message: 'Critère mis à jour avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de la mise à jour du critère :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la mise à jour du critère.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour supprimer un critère d'admission
routeurCriteresAdmissions.delete('/supprimer/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteSupprimerCritere = `
            DELETE FROM criteresadmissions WHERE idCritere = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteSupprimerCritere, [id]); // Exécuter la requête avec l'ID fourni

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Critère non trouvé.' }); // Retourner une erreur si le critère n'est pas trouvé
        }

        res.status(200).json({ message: 'Critère supprimé avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de la suppression du critère :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la suppression du critère.', details: error.message }); // Retourner une erreur au client
    }
});

export default routeurCriteresAdmissions; // Exporter le routeur pour l'utiliser dans d'autres fichiers