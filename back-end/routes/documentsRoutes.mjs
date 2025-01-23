import { Router } from 'express'; // Importer le module Router d'Express pour créer des routes
import { baseDeDonnees } from '../db/baseDeDonnees.mjs'; // Importer la connexion à la base de données

const routeurDocuments = Router(); // Routeur spécifique à la table `documents`

// Route pour ajouter un document
routeurDocuments.post('/ajouter', async (req, res) => {
    const { cheminFichier, idCandidature, typeDocument } = req.body; // Extraire les données du corps de la requête

    try {
        // Validation des données reçues
        if (!cheminFichier || !idCandidature || !typeDocument) {
            return res.status(400).json({ erreur: 'Les champs cheminFichier, idCandidature et typeDocument sont obligatoires.' }); // Retourner une erreur si des champs sont manquants
        }

        // Requête SQL pour ajouter un document
        const requeteAjoutDocument = `
            INSERT INTO documents (cheminFichier, idCandidature, typeDocument)
            VALUES (?, ?, ?)
        `;
        const [resultat] = await baseDeDonnees.query(requeteAjoutDocument, [cheminFichier, idCandidature, typeDocument]); // Exécuter la requête avec les données fournies

        res.status(201).json({ message: 'Document ajouté avec succès.', idDocument: resultat.insertId }); // Retourner un message de succès avec l'ID du document ajouté
    } catch (error) {
        console.error('Erreur lors de l’ajout du document :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de l’ajout du document.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour récupérer tous les documents
routeurDocuments.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererTousDocuments = `
            SELECT * FROM documents
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererTousDocuments); // Exécuter la requête
        res.status(200).json(resultats); // Retourner les résultats au client
    } catch (error) {
        console.error('Erreur lors de la récupération des documents :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la récupération des documents.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour récupérer un document par son ID
routeurDocuments.get('/afficher/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteRecupererDocumentParId = `
            SELECT * FROM documents WHERE idDocument = ?
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererDocumentParId, [id]); // Exécuter la requête avec l'ID fourni
        if (resultats.length === 0) {
            return res.status(404).json({ erreur: 'Document non trouvé.' }); // Retourner une erreur si le document n'est pas trouvé
        }
        res.status(200).json(resultats[0]); // Retourner les résultats au client
    } catch (error) {
        console.error('Erreur lors de la récupération du document :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la récupération du document.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour modifier un document
routeurDocuments.put('/modifier/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête
    const { cheminFichier, idCandidature, typeDocument } = req.body; // Extraire les données du corps de la requête

    try {
        // Validation des données reçues
        if (!cheminFichier || !idCandidature || !typeDocument) {
            return res.status(400).json({ erreur: 'Les champs cheminFichier, idCandidature et typeDocument sont obligatoires.' }); // Retourner une erreur si des champs sont manquants
        }

        const requeteModifierDocument = `
            UPDATE documents
            SET cheminFichier = ?, idCandidature = ?, typeDocument = ?
            WHERE idDocument = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteModifierDocument, [cheminFichier, idCandidature, typeDocument, id]); // Exécuter la requête avec les données fournies

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Document non trouvé.' }); // Retourner une erreur si le document n'est pas trouvé
        }

        res.status(200).json({ message: 'Document mis à jour avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de la mise à jour du document :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la mise à jour du document.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour supprimer un document
routeurDocuments.delete('/supprimer/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteSupprimerDocument = `
            DELETE FROM documents WHERE idDocument = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteSupprimerDocument, [id]); // Exécuter la requête avec l'ID fourni

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Document non trouvé.' }); // Retourner une erreur si le document n'est pas trouvé
        }

        res.status(200).json({ message: 'Document supprimé avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de la suppression du document :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la suppression du document.', details: error.message }); // Retourner une erreur au client
    }
});

export default routeurDocuments; // Exporter le routeur pour l'utiliser dans d'autres fichiers