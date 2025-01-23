import { Router } from 'express'; // Importer le module Router d'Express pour créer des routes
import { baseDeDonnees } from '../db/baseDeDonnees.mjs'; // Importer la connexion à la base de données

const routeurEtablissements = Router(); // Routeur spécifique à la table `etablissements`

// Route pour ajouter un établissement
routeurEtablissements.post('/ajouter', async (req, res) => {
    const { nomEtablissement, adresseEtablissement, contactEtablissement, localisationEtablissement } = req.body; // Extraire les données du corps de la requête

    try {
        // Validation des données reçues
        if (!nomEtablissement || !adresseEtablissement || !contactEtablissement || !localisationEtablissement) {
            return res.status(400).json({ erreur: 'Tous les champs sont obligatoires.' }); // Retourner une erreur si des champs sont manquants
        }

        // Requête SQL pour ajouter un établissement
        const requeteAjoutEtablissement = `
            INSERT INTO etablissements (nomEtablissement, adresseEtablissement, contactEtablissement, localisationEtablissement)
            VALUES (?, ?, ?, ?)
        `;
        const [resultat] = await baseDeDonnees.query(requeteAjoutEtablissement, [
            nomEtablissement,
            adresseEtablissement,
            contactEtablissement,
            localisationEtablissement,
        ]); // Exécuter la requête avec les données fournies

        res.status(201).json({ message: 'Établissement ajouté avec succès.', idEtablissement: resultat.insertId }); // Retourner un message de succès avec l'ID de l'établissement ajouté
    } catch (error) {
        console.error('Erreur lors de l’ajout de l’établissement :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de l’ajout de l’établissement.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour récupérer tous les établissements
routeurEtablissements.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererTousEtablissements = `
            SELECT * FROM etablissements
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererTousEtablissements); // Exécuter la requête
        res.status(200).json(resultats); // Retourner les résultats au client
    } catch (error) {
        console.error('Erreur lors de la récupération des établissements :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la récupération des établissements.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour récupérer un établissement par son ID
routeurEtablissements.get('/afficher/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteRecupererEtablissementParId = `
            SELECT * FROM etablissements WHERE idEtablissement = ?
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererEtablissementParId, [id]); // Exécuter la requête avec l'ID fourni
        if (resultats.length === 0) {
            return res.status(404).json({ erreur: 'Établissement non trouvé.' }); // Retourner une erreur si l'établissement n'est pas trouvé
        }
        res.status(200).json(resultats[0]); // Retourner les résultats au client
    } catch (error) {
        console.error('Erreur lors de la récupération de l’établissement :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la récupération de l’établissement.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour modifier un établissement
routeurEtablissements.put('/modifier/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête
    const { nomEtablissement, adresseEtablissement, contactEtablissement, localisationEtablissement } = req.body; // Extraire les données du corps de la requête

    try {
        // Validation des données reçues
        if (!nomEtablissement || !adresseEtablissement || !contactEtablissement || !localisationEtablissement) {
            return res.status(400).json({ erreur: 'Tous les champs sont obligatoires.' }); // Retourner une erreur si des champs sont manquants
        }

        const requeteModifierEtablissement = `
            UPDATE etablissements
            SET nomEtablissement = ?, adresseEtablissement = ?, contactEtablissement = ?, localisationEtablissement = ?
            WHERE idEtablissement = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteModifierEtablissement, [
            nomEtablissement,
            adresseEtablissement,
            contactEtablissement,
            localisationEtablissement,
            id,
        ]); // Exécuter la requête avec les données fournies

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Établissement non trouvé.' }); // Retourner une erreur si l'établissement n'est pas trouvé
        }

        res.status(200).json({ message: 'Établissement mis à jour avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l’établissement :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la mise à jour de l’établissement.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour supprimer un établissement
routeurEtablissements.delete('/supprimer/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteSupprimerEtablissement = `
            DELETE FROM etablissements WHERE idEtablissement = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteSupprimerEtablissement, [id]); // Exécuter la requête avec l'ID fourni

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Établissement non trouvé.' }); // Retourner une erreur si l'établissement n'est pas trouvé
        }

        res.status(200).json({ message: 'Établissement supprimé avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de la suppression de l’établissement :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la suppression de l’établissement.', details: error.message }); // Retourner une erreur au client
    }
});

export default routeurEtablissements; // Exporter le routeur pour l'utiliser dans d'autres fichiers