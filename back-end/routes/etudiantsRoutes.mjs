import { Router } from 'express'; // Importer le module Router d'Express pour créer des routes
import { baseDeDonnees } from '../db/baseDeDonnees.mjs'; // Importer la connexion à la base de données

const routeurEtudiant = Router(); // Routeur spécifique à la table `etudiant`

// Route pour récupérer tous les étudiants
routeurEtudiant.get('/afficher', async (req, res) => {
    try {
        const requeteGetAllEtudiant = `SELECT nomUtilisateur, prenomUtilisateur, emailUtilisateur, niveauEtudiant, dateInscription 
                                        FROM utilisateurs, etudiants
                                        WHERE utilisateurs.idUtilisateur = etudiants.idUtilisateur`;
        const [resultats] = await baseDeDonnees.query(requeteGetAllEtudiant); // Exécuter la requête
        res.status(200).json(resultats); // Retourner les résultats au client
    } catch (error) {
        console.error('Erreur lors de la récupération des étudiants :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la récupération des étudiant.', details: error.message }); // Retourner une erreur au client
    }
});

routeurEtudiant.post('/ajouter', async (req, res) => {
    const { idUtilisateur, numeroEtudiant, niveauEtudiant, dateInscription } = req.body; // Extraire les données du corps de la requête

    try {
        // Validation des données reçues
        if (!idUtilisateur || !numeroEtudiant || !niveauEtudiant || !dateInscription) {
            return res.status(400).json({ erreur: 'Tous les champs sont requis.' }); // Retourner une erreur si des champs sont manquants
        }

        // Requête SQL pour ajouter un utilisateur
        const requeteAddEtudiant = `
            INSERT INTO etudiants (idUtilisateur, numeroEtudiant, niveauEtudiant, dateInscription)
            VALUES (?, ?, ?, ?)
        `;
        await baseDeDonnees.query(requeteAddEtudiant, [
            idUtilisateur, numeroEtudiant, niveauEtudiant, dateInscription
        ]); // Exécuter la requête avec les données fournies

        res.status(201).json({ message: 'Etudiant ajouté avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de l’ajout de l’étudiant :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de l’ajout de l’étudiant.', details: error.message }); // Retourner une erreur au client
    }
});

routeurEtudiant.post('/supprimer/:id', async (req, res) => {
    const { id } = req.params; // Récupérer l'id depuis les paramètres de l'URL

    try {
        if (!id) {
            return res.status(400).json({ erreur: 'Veuillez rentrer un identifiant utilisateur.' });
        }

        const requeteDeleteEtudiant = `
            DELETE FROM etudiants
            WHERE idUtilisateur = ?
        `;
        
        // Exécuter la requête SQL avec l'idUtilisateur passé dans l'URL
        await baseDeDonnees.query(requeteDeleteEtudiant, [id]);

        res.status(200).json({ message: "Utilisateur supprimé avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'étudiant :", error);
        res.status(500).json({ erreur: "Erreur lors de la suppression de l’étudiant.", details: error.message });
    }
});


export default routeurEtudiant;