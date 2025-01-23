import { Router } from 'express'; // Importer le module Router d'Express pour créer des routes
import { baseDeDonnees } from '../db/baseDeDonnees.mjs'; // Importer la connexion à la base de données

const routeurAdminGeneraux = Router(); // Créer un routeur spécifique à la table `admingeneraux`

// Route pour ajouter un administrateur général
routeurAdminGeneraux.post('/ajouter', async (req, res) => {
    const { idUtilisateur, pouvoirAdmin } = req.body; // Extraire les données du corps de la requête

    try {
        // Validation des données reçues
        if (!idUtilisateur || !pouvoirAdmin) {
            return res.status(400).json({ erreur: 'Tous les champs sont requis.' }); // Retourner une erreur si des champs sont manquants
        }

        // Requête SQL pour ajouter un administrateur général
        const requeteAjoutAdmin = `
            INSERT INTO admingeneraux (idUtilisateur, pouvoirAdmin)
            VALUES (?, ?)
        `;
        await baseDeDonnees.query(requeteAjoutAdmin, [idUtilisateur, pouvoirAdmin]); // Exécuter la requête avec les données fournies

        res.status(201).json({ message: 'Administrateur général ajouté avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de l’ajout de l’administrateur général :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de l’ajout de l’administrateur général.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour récupérer tous les administrateurs généraux
routeurAdminGeneraux.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererAdmins = 'SELECT * FROM admingeneraux'; // Requête SQL pour récupérer tous les administrateurs généraux
        const [resultats] = await baseDeDonnees.query(requeteRecupererAdmins); // Exécuter la requête
        res.status(200).json(resultats); // Retourner les résultats au client
    } catch (error) {
        console.error('Erreur lors de la récupération des administrateurs généraux :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la récupération des administrateurs généraux.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour récupérer un administrateur général par son ID
routeurAdminGeneraux.get('/afficher/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteRecupererAdminParId = 'SELECT * FROM admingeneraux WHERE idAdminGeneral = ?'; // Requête SQL pour récupérer un administrateur général par ID
        const [resultats] = await baseDeDonnees.query(requeteRecupererAdminParId, [id]); // Exécuter la requête avec l'ID fourni
        if (resultats.length === 0) {
            return res.status(404).json({ erreur: 'Administrateur général non trouvé.' }); // Retourner une erreur si l'administrateur n'est pas trouvé
        }
        res.status(200).json(resultats[0]); // Retourner les résultats au client
    } catch (error) {
        console.error('Erreur lors de la récupération de l’administrateur général :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la récupération de l’administrateur général.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour modifier un administrateur général
routeurAdminGeneraux.put('/modifier/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête
    const { idUtilisateur, pouvoirAdmin } = req.body; // Extraire les données du corps de la requête

    try {
        // Validation des données reçues
        if (!idUtilisateur || !pouvoirAdmin) {
            return res.status(400).json({ erreur: 'Tous les champs sont requis.' }); // Retourner une erreur si des champs sont manquants
        }

        const requeteModifierAdmin = `
            UPDATE admingeneraux
            SET idUtilisateur = ?, pouvoirAdmin = ?
            WHERE idAdminGeneral = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteModifierAdmin, [idUtilisateur, pouvoirAdmin, id]); // Exécuter la requête avec les données fournies

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Administrateur général non trouvé.' }); // Retourner une erreur si l'administrateur n'est pas trouvé
        }

        res.status(200).json({ message: 'Administrateur général mis à jour avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l’administrateur général :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la mise à jour de l’administrateur général.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour supprimer un administrateur général
routeurAdminGeneraux.delete('/supprimer/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteSupprimerAdmin = 'DELETE FROM admingeneraux WHERE idAdminGeneral = ?'; // Requête SQL pour supprimer un administrateur général par ID
        const [resultat] = await baseDeDonnees.query(requeteSupprimerAdmin, [id]); // Exécuter la requête avec l'ID fourni

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Administrateur général non trouvé.' }); // Retourner une erreur si l'administrateur n'est pas trouvé
        }

        res.status(200).json({ message: 'Administrateur général supprimé avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de la suppression de l’administrateur général :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la suppression de l’administrateur général.', details: error.message }); // Retourner une erreur au client
    }
});

export default routeurAdminGeneraux; // Exporter le routeur pour l'utiliser dans d'autres fichiers