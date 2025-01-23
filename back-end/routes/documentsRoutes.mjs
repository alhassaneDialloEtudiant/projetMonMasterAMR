import { Router } from 'express';
import { baseDeDonnees } from '../db/baseDeDonnees.mjs';

const routeurDocuments = Router(); // Routeur spécifique à la table `documents`

// Ajouter un document
routeurDocuments.post('/ajouter', async (req, res) => {
    const { cheminFichier, idCandidature, typeDocument } = req.body;

    try {
        // Validation des données reçues
        if (!cheminFichier || !idCandidature || !typeDocument) {
            return res.status(400).json({ erreur: 'Les champs cheminFichier, idCandidature et typeDocument sont obligatoires.' });
        }

        // Requête SQL pour ajouter un document
        const requeteAjoutDocument = `
            INSERT INTO documents (cheminFichier, idCandidature, typeDocument)
            VALUES (?, ?, ?)
        `;
        const [resultat] = await baseDeDonnees.query(requeteAjoutDocument, [cheminFichier, idCandidature, typeDocument]);

        res.status(201).json({ message: 'Document ajouté avec succès.', idDocument: resultat.insertId });
    } catch (error) {
        console.error('Erreur lors de l’ajout du document :', error);
        res.status(500).json({ erreur: 'Erreur lors de l’ajout du document.', details: error.message });
    }
});

// Récupérer tous les documents
routeurDocuments.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererTousDocuments = `
            SELECT * FROM documents
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererTousDocuments);
        res.status(200).json(resultats);
    } catch (error) {
        console.error('Erreur lors de la récupération des documents :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération des documents.', details: error.message });
    }
});

// Récupérer un document par son ID
routeurDocuments.get('/afficher/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const requeteRecupererDocumentParId = `
            SELECT * FROM documents WHERE idDocument = ?
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererDocumentParId, [id]);
        if (resultats.length === 0) {
            return res.status(404).json({ erreur: 'Document non trouvé.' });
        }
        res.status(200).json(resultats[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération du document :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération du document.', details: error.message });
    }
});

// Modifier un document
routeurDocuments.put('/modifier/:id', async (req, res) => {
    const { id } = req.params;
    const { cheminFichier, idCandidature, typeDocument } = req.body;

    try {
        // Validation des données reçues
        if (!cheminFichier || !idCandidature || !typeDocument) {
            return res.status(400).json({ erreur: 'Les champs cheminFichier, idCandidature et typeDocument sont obligatoires.' });
        }

        const requeteModifierDocument = `
            UPDATE documents
            SET cheminFichier = ?, idCandidature = ?, typeDocument = ?
            WHERE idDocument = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteModifierDocument, [cheminFichier, idCandidature, typeDocument, id]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Document non trouvé.' });
        }

        res.status(200).json({ message: 'Document mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du document :', error);
        res.status(500).json({ erreur: 'Erreur lors de la mise à jour du document.', details: error.message });
    }
});

// Supprimer un document
routeurDocuments.delete('/supprimer/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const requeteSupprimerDocument = `
            DELETE FROM documents WHERE idDocument = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteSupprimerDocument, [id]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Document non trouvé.' });
        }

        res.status(200).json({ message: 'Document supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression du document :', error);
        res.status(500).json({ erreur: 'Erreur lors de la suppression du document.', details: error.message });
    }
});

export default routeurDocuments;
