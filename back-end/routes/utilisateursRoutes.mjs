import { Router } from 'express';
import { baseDeDonnees } from '../db/baseDeDonnees.mjs';
import bcrypt from 'bcrypt';

const routeurUtilisateurs = Router(); // Routeur spécifique à la table `utilisateurs`

// Ajouter un utilisateur
routeurUtilisateurs.post('/ajouter', async (req, res) => {
    const { emailUtilisateur, motDePasseUtilisateur, nomUtilisateur, prenomUtilisateur, roleUtilisateur } = req.body;

    try {
        // Validation des données reçues
        if (!emailUtilisateur || !motDePasseUtilisateur || !nomUtilisateur || !prenomUtilisateur || !roleUtilisateur) {
            return res.status(400).json({ erreur: 'Tous les champs sont requis.' });
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
        ]);

        res.status(201).json({ message: 'Utilisateur ajouté avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l’ajout de l’utilisateur :', error);
        res.status(500).json({ erreur: 'Erreur lors de l’ajout de l’utilisateur.', details: error.message });
    }
});

// Récupérer tous les utilisateurs
routeurUtilisateurs.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererTousUtilisateurs = 'SELECT * FROM utilisateurs';
        const [resultats] = await baseDeDonnees.query(requeteRecupererTousUtilisateurs);
        res.status(200).json(resultats);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération des utilisateurs.', details: error.message });
    }
});

// Récupérer un utilisateur par son ID
routeurUtilisateurs.get('/afficher/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const requeteRecupererUtilisateurParId = 'SELECT * FROM utilisateurs WHERE idUtilisateur = ?';
        const [resultats] = await baseDeDonnees.query(requeteRecupererUtilisateurParId, [id]);
        if (resultats.length === 0) {
            return res.status(404).json({ erreur: 'Utilisateur non trouvé.' });
        }
        res.status(200).json(resultats[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération de l’utilisateur :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération de l’utilisateur.', details: error.message });
    }
});

// Modifier un utilisateur
routeurUtilisateurs.put('/modifier/:id', async (req, res) => {
    const { id } = req.params;
    const { emailUtilisateur, nomUtilisateur, prenomUtilisateur, roleUtilisateur } = req.body;

    try {
        // Validation des données reçues
        if (!emailUtilisateur || !nomUtilisateur || !prenomUtilisateur || !roleUtilisateur) {
            return res.status(400).json({ erreur: 'Tous les champs sont requis.' });
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
        ]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Utilisateur non trouvé.' });
        }

        res.status(200).json({ message: 'Utilisateur mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l’utilisateur :', error);
        res.status(500).json({ erreur: 'Erreur lors de la mise à jour de l’utilisateur.', details: error.message });
    }
});

// Supprimer un utilisateur
routeurUtilisateurs.delete('/supprimer/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const requeteSupprimerUtilisateur = 'DELETE FROM utilisateurs WHERE idUtilisateur = ?';
        const [resultat] = await baseDeDonnees.query(requeteSupprimerUtilisateur, [id]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Utilisateur non trouvé.' });
        }

        res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l’utilisateur :', error);
        res.status(500).json({ erreur: 'Erreur lors de la suppression de l’utilisateur.', details: error.message });
    }
});

export default routeurUtilisateurs;
