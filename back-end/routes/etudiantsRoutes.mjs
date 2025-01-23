import { Router } from 'express';
import { baseDeDonnees } from '../db/baseDeDonnees.mjs';

const routeurEtudiants = Router(); // Routeur spécifique à la table `etudiants`

// Ajouter un étudiant
routeurEtudiants.post('/ajouter', async (req, res) => {
    const { dateInscription, idUtilisateur, matricule, niveauEtudiant } = req.body;

    try {
        const requeteAjoutEtudiant = `
            INSERT INTO etudiants (dateInscription, idUtilisateur, matricule, niveauEtudiant)
            VALUES (?, ?, ?, ?)
        `;
        await baseDeDonnees.query(requeteAjoutEtudiant, [
            dateInscription,
            idUtilisateur,
            matricule,
            niveauEtudiant,
        ]);

        res.status(201).json({ message: 'Étudiant ajouté avec succès.' });
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur lors de l’ajout de l’étudiant.', details: error });
    }
});

// Récupérer tous les étudiants
routeurEtudiants.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererTousEtudiants = 'SELECT * FROM etudiants';
        const [resultats] = await baseDeDonnees.query(requeteRecupererTousEtudiants);
        res.status(200).json(resultats);
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur lors de la récupération des étudiants.', details: error });
    }
});

// Récupérer un étudiant par son ID
routeurEtudiants.get('/afficher/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const requeteRecupererEtudiantParId = 'SELECT * FROM etudiants WHERE idEtudiant = ?';
        const [resultats] = await baseDeDonnees.query(requeteRecupererEtudiantParId, [id]);
        if (resultats.length === 0) {
            res.status(404).json({ erreur: 'Étudiant non trouvé.' });
        } else {
            res.status(200).json(resultats[0]);
        }
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur lors de la récupération de l’étudiant.', details: error });
    }
});

// Modifier un étudiant
routeurEtudiants.put('/modifier/:id', async (req, res) => {
    const { id } = req.params;
    const { dateInscription, idUtilisateur, matricule, niveauEtudiant } = req.body;

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
        ]);

        res.status(200).json({ message: 'Étudiant mis à jour avec succès.' });
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur lors de la mise à jour de l’étudiant.', details: error });
    }
});

// Supprimer un étudiant
routeurEtudiants.delete('/supprimer/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const requeteSupprimerEtudiant = 'DELETE FROM etudiants WHERE idEtudiant = ?';
        await baseDeDonnees.query(requeteSupprimerEtudiant, [id]);
        res.status(200).json({ message: 'Étudiant supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur lors de la suppression de l’étudiant.', details: error });
    }
});

export default routeurEtudiants;
