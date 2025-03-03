import { Router } from 'express';
import { baseDeDonnees } from '../db/baseDeDonnees.mjs';

const routeurAdminGeneraux = Router();

// Route pour ajouter un administrateur général
routeurAdminGeneraux.post('/ajouter', async (req, res) => {
    const { idUtilisateur, pouvoirAdmin } = req.body;

    try {
        if (!idUtilisateur || !pouvoirAdmin) {
            return res.status(400).json({ erreur: 'Tous les champs sont requis.' });
        }

        const requeteAjoutAdmin = `
            INSERT INTO admingeneraux (idUtilisateur, pouvoirAdmin)
            VALUES (?, ?)
        `;
        await baseDeDonnees.query(requeteAjoutAdmin, [idUtilisateur, pouvoirAdmin]);

        res.status(201).json({ message: 'Administrateur général ajouté avec succès.' });
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur lors de l’ajout de l’administrateur général.', details: error.message });
    }
});

// Route pour récupérer tous les administrateurs généraux (avec les informations utilisateur)
routeurAdminGeneraux.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererAdmins = `
            SELECT admingeneraux.idAdminGeneral, 
                   admingeneraux.idUtilisateur, 
                   admingeneraux.pouvoirAdmin, 
                   utilisateurs.nomUtilisateur, 
                   utilisateurs.prenomUtilisateur,
                   utilisateurs.emailUtilisateur
            FROM admingeneraux
            JOIN utilisateurs ON admingeneraux.idUtilisateur = utilisateurs.idUtilisateur
            WHERE utilisateurs.roleUtilisateur = 'AdminGeneral'
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererAdmins);

        res.status(200).json(resultats);
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur lors de la récupération des administrateurs généraux.', details: error.message });
    }
});

// Route pour récupérer les utilisateurs disponibles pour devenir administrateurs généraux
routeurAdminGeneraux.get('/utilisateurs-disponibles', async (req, res) => {
    try {
        const requeteUtilisateursDisponibles = `
            SELECT idUtilisateur, nomUtilisateur, prenomUtilisateur, emailUtilisateur
            FROM utilisateurs
            WHERE roleUtilisateur = 'AdminGeneral'
              AND idUtilisateur NOT IN (SELECT idUtilisateur FROM admingeneraux)
        `;
        const [utilisateurs] = await baseDeDonnees.query(requeteUtilisateursDisponibles);

        res.status(200).json(utilisateurs);
    } catch (error) {
        res.status(500).json({
            erreur: 'Erreur lors de la récupération des utilisateurs disponibles.',
            details: error.message,
        });
    }
});

// Route pour modifier un administrateur général
routeurAdminGeneraux.put('/modifier/:id', async (req, res) => {
    const { id } = req.params;
    const { pouvoirAdmin } = req.body;

    try {
        if (!pouvoirAdmin) {
            return res.status(400).json({ erreur: 'Le champ "pouvoirAdmin" est requis.' });
        }

        const requeteModifierAdmin = `
            UPDATE admingeneraux
            SET pouvoirAdmin = ?
            WHERE idAdminGeneral = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteModifierAdmin, [pouvoirAdmin, id]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Administrateur général non trouvé.' });
        }

        res.status(200).json({ message: 'Administrateur général mis à jour avec succès.' });
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur lors de la mise à jour de l’administrateur général.', details: error.message });
    }
});

// Route pour supprimer un administrateur général
routeurAdminGeneraux.delete('/supprimer/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const requeteSupprimerAdmin = 'DELETE FROM admingeneraux WHERE idAdminGeneral = ?';
        const [resultat] = await baseDeDonnees.query(requeteSupprimerAdmin, [id]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Administrateur général non trouvé.' });
        }

        res.status(200).json({ message: 'Administrateur général supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur lors de la suppression de l’administrateur général.', details: error.message });
    }
});

export default routeurAdminGeneraux;
