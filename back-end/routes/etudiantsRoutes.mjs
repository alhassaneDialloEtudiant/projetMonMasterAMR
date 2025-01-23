import { Router } from 'express'; // Importer le module Router d'Express pour créer des routes
import { baseDeDonnees } from '../db/baseDeDonnees.mjs'; // Importer la connexion à la base de données

const routeurEtudiants = Router(); // Routeur spécifique à la table `etudiants`

// Route pour ajouter un étudiant
routeurEtudiants.post('/ajouter', async (req, res) => {
    const { dateInscription, idUtilisateur, matricule, niveauEtudiant } = req.body; // Extraire les données du corps de la requête

    try {
        // Requête SQL pour ajouter un étudiant
        const requeteAjoutEtudiant = `
            INSERT INTO etudiants (dateInscription, idUtilisateur, matricule, niveauEtudiant)
            VALUES (?, ?, ?, ?)
        `;
        await baseDeDonnees.query(requeteAjoutEtudiant, [
            dateInscription,
            idUtilisateur,
            matricule,
            niveauEtudiant,
        ]); // Exécuter la requête avec les données fournies

        res.status(201).json({ message: 'Étudiant ajouté avec succès.' }); // Retourner un message de succès
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur lors de l’ajout de l’étudiant.', details: error }); // Retourner une erreur au client
    }
});

// Route pour récupérer tous les étudiants
routeurEtudiants.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererTousEtudiants = 'SELECT * FROM etudiants'; // Requête SQL pour récupérer tous les étudiants
        const [resultats] = await baseDeDonnees.query(requeteRecupererTousEtudiants); // Exécuter la requête
        res.status(200).json(resultats); // Retourner les résultats au client
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur lors de la récupération des étudiants.', details: error }); // Retourner une erreur au client
    }
});

// Route pour récupérer un étudiant par son ID
routeurEtudiants.get('/afficher/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteRecupererEtudiantParId = 'SELECT * FROM etudiants WHERE idEtudiant = ?'; // Requête SQL pour récupérer un étudiant par ID
        const [resultats] = await baseDeDonnees.query(requeteRecupererEtudiantParId, [id]); // Exécuter la requête avec l'ID fourni
        if (resultats.length === 0) {
            res.status(404).json({ erreur: 'Étudiant non trouvé.' }); // Retourner une erreur si l'étudiant n'est pas trouvé
        } else {
            res.status(200).json(resultats[0]); // Retourner les résultats au client
        }
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur lors de la récupération de l’étudiant.', details: error }); // Retourner une erreur au client
    }
});

// Route pour modifier un étudiant
routeurEtudiants.put('/modifier/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête
    const { dateInscription, idUtilisateur, matricule, niveauEtudiant } = req.body; // Extraire les données du corps de la requête

    try {
        const requeteModifierEtudiant = `
            UPDATE etudiants
            SET dateInscription = ?, idUtilisateur = ?, matricule = ?, niveauEtudiant = ?
            WHERE idEtudiant = ?
        `;
        await baseDeDonnees.query(requeteModifierEtudiant, [
            dateInscription,
            idUtilisateur,
            matricule,
            niveauEtudiant,
            id,
        ]); // Exécuter la requête avec les données fournies

        res.status(200).json({ message: 'Étudiant mis à jour avec succès.' }); // Retourner un message de succès
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur lors de la mise à jour de l’étudiant.', details: error }); // Retourner une erreur au client
    }
});

// Route pour supprimer un étudiant
routeurEtudiants.delete('/supprimer/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteSupprimerEtudiant = 'DELETE FROM etudiants WHERE idEtudiant = ?'; // Requête SQL pour supprimer un étudiant par ID
        await baseDeDonnees.query(requeteSupprimerEtudiant, [id]); // Exécuter la requête avec l'ID fourni
        res.status(200).json({ message: 'Étudiant supprimé avec succès.' }); // Retourner un message de succès
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur lors de la suppression de l’étudiant.', details: error }); // Retourner une erreur au client
    }
});

export default routeurEtudiants; // Exporter le routeur pour l'utiliser dans d'autres fichiers