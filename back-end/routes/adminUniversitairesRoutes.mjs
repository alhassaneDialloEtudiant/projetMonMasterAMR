import { Router } from 'express'; // Importer le module Router d'Express pour créer des routes
import { baseDeDonnees } from '../db/baseDeDonnees.mjs'; // Importer la connexion à la base de données

const routeurAdminUniversitaires = Router(); // Créer un routeur spécifique à la table `adminuniversitaires`

// Route pour ajouter un administrateur universitaire
routeurAdminUniversitaires.post('/ajouter', async (req, res) => {
    const { idEtablissement, idUtilisateur, poste } = req.body; // Extraire les données du corps de la requête

    try {
        // Validation des données reçues
        if (!idEtablissement || !idUtilisateur || !poste) {
            return res.status(400).json({ erreur: 'Tous les champs sont requis.' }); // Retourner une erreur si des champs sont manquants
        }

        // Requête SQL pour ajouter un administrateur universitaire
        const requeteAjoutAdminUniv = `
            INSERT INTO adminuniversitaires (idEtablissement, idUtilisateur, poste)
            VALUES (?, ?, ?)
        `;
        await baseDeDonnees.query(requeteAjoutAdminUniv, [idEtablissement, idUtilisateur, poste]); // Exécuter la requête avec les données fournies

        res.status(201).json({ message: 'Administrateur universitaire ajouté avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de l’ajout de l’administrateur universitaire :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de l’ajout de l’administrateur universitaire.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour récupérer tous les administrateurs universitaires
routeurAdminUniversitaires.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererAdminsUniv = 'SELECT * FROM adminuniversitaires'; // Requête SQL pour récupérer tous les administrateurs universitaires
        const [resultats] = await baseDeDonnees.query(requeteRecupererAdminsUniv); // Exécuter la requête
        res.status(200).json(resultats); // Retourner les résultats au client
    } catch (error) {
        console.error('Erreur lors de la récupération des administrateurs universitaires :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la récupération des administrateurs universitaires.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour récupérer un administrateur universitaire par son ID
routeurAdminUniversitaires.get('/afficher/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteRecupererAdminUnivParId = 'SELECT * FROM adminuniversitaires WHERE idAdminUniversitaire = ?'; // Requête SQL pour récupérer un administrateur universitaire par ID
        const [resultats] = await baseDeDonnees.query(requeteRecupererAdminUnivParId, [id]); // Exécuter la requête avec l'ID fourni
        if (resultats.length === 0) {
            return res.status(404).json({ erreur: 'Administrateur universitaire non trouvé.' }); // Retourner une erreur si l'administrateur n'est pas trouvé
        }
        res.status(200).json(resultats[0]); // Retourner les résultats au client
    } catch (error) {
        console.error('Erreur lors de la récupération de l’administrateur universitaire :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la récupération de l’administrateur universitaire.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour modifier un administrateur universitaire
routeurAdminUniversitaires.put('/modifier/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête
    const { idEtablissement, idUtilisateur, poste } = req.body; // Extraire les données du corps de la requête

    try {
        // Validation des données reçues
        if (!idEtablissement || !idUtilisateur || !poste) {
            return res.status(400).json({ erreur: 'Tous les champs sont requis.' }); // Retourner une erreur si des champs sont manquants
        }

        const requeteModifierAdminUniv = `
            UPDATE adminuniversitaires
            SET idEtablissement = ?, idUtilisateur = ?, poste = ?
            WHERE idAdminUniversitaire = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteModifierAdminUniv, [idEtablissement, idUtilisateur, poste, id]); // Exécuter la requête avec les données fournies

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Administrateur universitaire non trouvé.' }); // Retourner une erreur si l'administrateur n'est pas trouvé
        }

        res.status(200).json({ message: 'Administrateur universitaire mis à jour avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l’administrateur universitaire :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la mise à jour de l’administrateur universitaire.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour supprimer un administrateur universitaire
routeurAdminUniversitaires.delete('/supprimer/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteSupprimerAdminUniv = 'DELETE FROM adminuniversitaires WHERE idAdminUniversitaire = ?'; // Requête SQL pour supprimer un administrateur universitaire par ID
        const [resultat] = await baseDeDonnees.query(requeteSupprimerAdminUniv, [id]); // Exécuter la requête avec l'ID fourni

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Administrateur universitaire non trouvé.' }); // Retourner une erreur si l'administrateur n'est pas trouvé
        }

        res.status(200).json({ message: 'Administrateur universitaire supprimé avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de la suppression de l’administrateur universitaire :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la suppression de l’administrateur universitaire.', details: error.message }); // Retourner une erreur au client
    }
});

export default routeurAdminUniversitaires; // Exporter le routeur pour l'utiliser dans d'autres fichiers