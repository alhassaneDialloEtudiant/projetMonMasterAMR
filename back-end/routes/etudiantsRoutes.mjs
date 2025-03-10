import { Router } from 'express';
import { baseDeDonnees } from '../db/baseDeDonnees.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const etudiantsRoutes = Router();

// Route pour ajouter un étudiant
etudiantsRoutes.post('/ajouter', async (req, res) => {
    const { dateInscription, idUtilisateur, numeroEtudiant, niveauEtudiant } = req.body;

    try {
        if (!dateInscription?.trim() || !idUtilisateur?.trim() || !numeroEtudiant?.trim() || !niveauEtudiant?.trim()) {
            return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
        }

        const requeteVerificationNumero = 'SELECT * FROM etudiants WHERE numeroEtudiant = ?';
        const [etudiantAvecNumero] = await baseDeDonnees.query(requeteVerificationNumero, [numeroEtudiant.trim()]);
        if (etudiantAvecNumero.length > 0) {
            return res.status(400).json({ message: 'Un étudiant avec ce numéro existe déjà.' });
        }

        const requeteVerificationUtilisateur = 'SELECT * FROM etudiants WHERE idUtilisateur = ?';
        const [etudiantAvecUtilisateur] = await baseDeDonnees.query(requeteVerificationUtilisateur, [idUtilisateur.trim()]);
        if (etudiantAvecUtilisateur.length > 0) {
            return res.status(400).json({ message: 'Un étudiant avec cet utilisateur existe déjà.' });
        }

        const requeteAjoutEtudiant = `
            INSERT INTO etudiants (dateInscription, idUtilisateur, numeroEtudiant, niveauEtudiant)
            VALUES (?, ?, ?, ?)
        `;
        await baseDeDonnees.query(requeteAjoutEtudiant, [
            dateInscription.trim(),
            idUtilisateur.trim(),
            numeroEtudiant.trim(),
            niveauEtudiant.trim(),
        ]);

        res.status(201).json({ message: 'Étudiant ajouté avec succès.' });
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur lors de l’ajout de l’étudiant.', details: error.message });
    }
});

// Route pour récupérer tous les étudiants
etudiantsRoutes.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererTousEtudiants = `
            SELECT 
                e.idEtudiant, 
                e.numeroEtudiant, 
                e.dateInscription, 
                e.niveauEtudiant, 
                u.nomUtilisateur, 
                u.prenomUtilisateur, 
                u.emailUtilisateur, 
                u.roleUtilisateur
            FROM etudiants e
            JOIN utilisateurs u ON e.idUtilisateur = u.idUtilisateur
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererTousEtudiants);
        res.status(200).json(resultats);
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur lors de la récupération des étudiants.', details: error.message });
    }
});

// Route pour modifier un étudiant
etudiantsRoutes.put('/modifier/:id', async (req, res) => {
    const { id } = req.params;
    const { numeroEtudiant, dateInscription, niveauEtudiant } = req.body;
  
    try {
      if (!numeroEtudiant || !dateInscription || !niveauEtudiant) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires." });
      }
  
      const requeteModifierEtudiant = `
        UPDATE etudiants
        SET numeroEtudiant = ?, dateInscription = ?, niveauEtudiant = ?
        WHERE idEtudiant = ?
      `;
      const [resultats] = await baseDeDonnees.query(requeteModifierEtudiant, [
        numeroEtudiant.trim(),
        dateInscription.trim(),
        niveauEtudiant.trim(),
        id,
      ]);
  
      if (resultats.affectedRows === 0) {
        return res.status(404).json({ message: "Étudiant non trouvé." });
      }
  
      res.status(200).json({ message: "Étudiant mis à jour avec succès." });
    } catch (error) {
      res.status(500).json({ erreur: "Erreur lors de la mise à jour.", details: error.message });
    }
  });
  

// Route pour supprimer un étudiant
etudiantsRoutes.delete('/supprimer/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [etudiantExiste] = await baseDeDonnees.query('SELECT * FROM etudiants WHERE idEtudiant = ?', [id]);
        if (etudiantExiste.length === 0) {
            return res.status(404).json({ message: 'Étudiant non trouvé.' });
        }

        const requeteSupprimerEtudiant = 'DELETE FROM etudiants WHERE idEtudiant = ?';
        await baseDeDonnees.query(requeteSupprimerEtudiant, [id]);
        res.status(200).json({ message: 'Étudiant supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur lors de la suppression de l’étudiant.', details: error.message });
    }
});

// Nouvelle route : Récupérer uniquement les utilisateurs ayant le rôle "étudiant" et non inscrits
etudiantsRoutes.get('/utilisateurs-etudiants', async (req, res) => {
    try {
        const requeteRecupererUtilisateursDisponibles = `
            SELECT u.idUtilisateur, u.nomUtilisateur, u.prenomUtilisateur, u.emailUtilisateur, u.roleUtilisateur
            FROM utilisateurs u
            WHERE u.roleUtilisateur = 'Etudiant'
            AND u.idUtilisateur NOT IN (SELECT idUtilisateur FROM etudiants)
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererUtilisateursDisponibles);
        res.status(200).json(resultats);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs étudiants disponibles :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération des utilisateurs étudiants disponibles.', details: error.message });
    }
});

export default etudiantsRoutes;