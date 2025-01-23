import { Router } from 'express'; // Importer le module Router d'Express pour créer des routes
import { baseDeDonnees } from '../db/baseDeDonnees.mjs'; // Importer la connexion à la base de données
import bcrypt from 'bcrypt'; // Importer bcrypt pour hacher les mots de passe

const routeurUtilisateurs = Router(); // Routeur spécifique à la table `utilisateurs`

// Route pour ajouter un utilisateur
routeurUtilisateurs.post('/ajouter', async (req, res) => {
    const { emailUtilisateur, motDePasseUtilisateur, nomUtilisateur, prenomUtilisateur, roleUtilisateur } = req.body; // Extraire les données du corps de la requête

    try {
        // Validation des données reçues
        if (!emailUtilisateur || !motDePasseUtilisateur || !nomUtilisateur || !prenomUtilisateur || !roleUtilisateur) {
            return res.status(400).json({ erreur: 'Tous les champs sont requis.' }); // Retourner une erreur si des champs sont manquants
        }

        // Hacher le mot de passe
        const motDePasseHache = await bcrypt.hash(motDePasseUtilisateur, 10);

        // Requête SQL pour ajouter un utilisateur
        const requeteAjoutUtilisateur = `
            INSERT INTO utilisateurs (emailUtilisateur, motDePasseUtilisateur, nomUtilisateur, prenomUtilisateur, roleUtilisateur)
            VALUES (?, ?, ?, ?, ?)
        `;
        await baseDeDonnees.query(requeteAjoutUtilisateur, [
            emailUtilisateur,
            motDePasseHache,
            nomUtilisateur,
            prenomUtilisateur,
            roleUtilisateur
        ]); // Exécuter la requête avec les données fournies

        res.status(201).json({ message: 'Utilisateur ajouté avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de l’ajout de l’utilisateur :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de l’ajout de l’utilisateur.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour récupérer tous les utilisateurs
routeurUtilisateurs.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererTousUtilisateurs = 'SELECT * FROM utilisateurs'; // Requête SQL pour récupérer tous les utilisateurs
        const [resultats] = await baseDeDonnees.query(requeteRecupererTousUtilisateurs); // Exécuter la requête
        res.status(200).json(resultats); // Retourner les résultats au client
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la récupération des utilisateurs.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour récupérer un utilisateur par son ID
routeurUtilisateurs.get('/afficher/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteRecupererUtilisateurParId = 'SELECT * FROM utilisateurs WHERE idUtilisateur = ?'; // Requête SQL pour récupérer un utilisateur par ID
        const [resultats] = await baseDeDonnees.query(requeteRecupererUtilisateurParId, [id]); // Exécuter la requête avec l'ID fourni
        if (resultats.length === 0) {
            return res.status(404).json({ erreur: 'Utilisateur non trouvé.' }); // Retourner une erreur si l'utilisateur n'est pas trouvé
        }
        res.status(200).json(resultats[0]); // Retourner les résultats au client
    } catch (error) {
        console.error('Erreur lors de la récupération de l’utilisateur :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la récupération de l’utilisateur.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour modifier un utilisateur
routeurUtilisateurs.put('/modifier/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête
    const { emailUtilisateur, nomUtilisateur, prenomUtilisateur, roleUtilisateur } = req.body; // Extraire les données du corps de la requête

    try {
        // Validation des données reçues
        if (!emailUtilisateur || !nomUtilisateur || !prenomUtilisateur || !roleUtilisateur) {
            return res.status(400).json({ erreur: 'Tous les champs sont requis.' }); // Retourner une erreur si des champs sont manquants
        }

        const requeteModifierUtilisateur = `
            UPDATE utilisateurs
            SET emailUtilisateur = ?, nomUtilisateur = ?, prenomUtilisateur = ?, roleUtilisateur = ?
            WHERE idUtilisateur = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteModifierUtilisateur, [
            emailUtilisateur,
            nomUtilisateur,
            prenomUtilisateur,
            roleUtilisateur,
            id
        ]); // Exécuter la requête avec les données fournies

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Utilisateur non trouvé.' }); // Retourner une erreur si l'utilisateur n'est pas trouvé
        }

        res.status(200).json({ message: 'Utilisateur mis à jour avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l’utilisateur :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la mise à jour de l’utilisateur.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour supprimer un utilisateur
routeurUtilisateurs.delete('/supprimer/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteSupprimerUtilisateur = 'DELETE FROM utilisateurs WHERE idUtilisateur = ?'; // Requête SQL pour supprimer un utilisateur par ID
        const [resultat] = await baseDeDonnees.query(requeteSupprimerUtilisateur, [id]); // Exécuter la requête avec l'ID fourni

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Utilisateur non trouvé.' }); // Retourner une erreur si l'utilisateur n'est pas trouvé
        }

        res.status(200).json({ message: 'Utilisateur supprimé avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de la suppression de l’utilisateur :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la suppression de l’utilisateur.', details: error.message }); // Retourner une erreur au client
    }
});

export default routeurUtilisateurs; // Exporter le routeur pour l'utiliser dans d'autres fichiers