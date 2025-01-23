import { Router } from 'express';
import { baseDeDonnees } from '../db/baseDeDonnees.mjs';

const routeurNotifications = Router(); // Routeur spécifique à la table `notifications`

// Ajouter une notification
routeurNotifications.post('/ajouter', async (req, res) => {
    const { idUtilisateur, messageNotification } = req.body;

    try {
        // Validation des données reçues
        if (!idUtilisateur || !messageNotification) {
            return res.status(400).json({ erreur: 'Tous les champs sont obligatoires.' });
        }

        // Requête SQL pour ajouter une notification
        const requeteAjoutNotification = `
            INSERT INTO notifications (idUtilisateur, messageNotification)
            VALUES (?, ?)
        `;
        await baseDeDonnees.query(requeteAjoutNotification, [idUtilisateur, messageNotification]);

        res.status(201).json({ message: 'Notification ajoutée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l’ajout de la notification :', error);
        res.status(500).json({ erreur: 'Erreur lors de l’ajout de la notification.', details: error.message });
    }
});

// Récupérer toutes les notifications
routeurNotifications.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererNotifications = `
            SELECT * FROM notifications
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererNotifications);
        res.status(200).json(resultats);
    } catch (error) {
        console.error('Erreur lors de la récupération des notifications :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération des notifications.', details: error.message });
    }
});

// Récupérer les notifications d’un utilisateur
routeurNotifications.get('/afficher/:idUtilisateur', async (req, res) => {
    const { idUtilisateur } = req.params;

    try {
        const requeteNotificationsUtilisateur = `
            SELECT * FROM notifications WHERE idUtilisateur = ?
        `;
        const [resultats] = await baseDeDonnees.query(requeteNotificationsUtilisateur, [idUtilisateur]);

        if (resultats.length === 0) {
            return res.status(404).json({ erreur: 'Aucune notification trouvée pour cet utilisateur.' });
        }

        res.status(200).json(resultats);
    } catch (error) {
        console.error('Erreur lors de la récupération des notifications de l’utilisateur :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération des notifications.', details: error.message });
    }
});

// Modifier une notification
routeurNotifications.put('/modifier/:idNotification', async (req, res) => {
    const { idNotification } = req.params;
    const { messageNotification } = req.body;

    try {
        // Validation des données reçues
        if (!messageNotification) {
            return res.status(400).json({ erreur: 'Le message de notification est obligatoire.' });
        }

        const requeteModifierNotification = `
            UPDATE notifications
            SET messageNotification = ?
            WHERE idNotification = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteModifierNotification, [messageNotification, idNotification]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Notification non trouvée.' });
        }

        res.status(200).json({ message: 'Notification modifiée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la modification de la notification :', error);
        res.status(500).json({ erreur: 'Erreur lors de la modification de la notification.', details: error.message });
    }
});

// Supprimer une notification
routeurNotifications.delete('/supprimer/:idNotification', async (req, res) => {
    const { idNotification } = req.params;

    try {
        const requeteSupprimerNotification = `
            DELETE FROM notifications WHERE idNotification = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteSupprimerNotification, [idNotification]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Notification non trouvée.' });
        }

        res.status(200).json({ message: 'Notification supprimée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la notification :', error);
        res.status(500).json({ erreur: 'Erreur lors de la suppression de la notification.', details: error.message });
    }
});

export default routeurNotifications;
