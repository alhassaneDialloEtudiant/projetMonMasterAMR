import { Router } from 'express'; // Importer le module Router d'Express pour créer des routes
import { baseDeDonnees } from '../db/baseDeDonnees.mjs'; // Importer la connexion à la base de données

const routeurNotifications = Router(); // Routeur spécifique à la table `notifications`

// Route pour ajouter une notification
routeurNotifications.post('/ajouter', async (req, res) => {
    const { idUtilisateur, messageNotification } = req.body; // Extraire les données du corps de la requête

    try {
        // Validation des données reçues
        if (!idUtilisateur || !messageNotification) {
            return res.status(400).json({ erreur: 'Tous les champs sont obligatoires.' }); // Retourner une erreur si des champs sont manquants
        }

        // Requête SQL pour ajouter une notification
        const requeteAjoutNotification = `
            INSERT INTO notifications (idUtilisateur, messageNotification)
            VALUES (?, ?)
        `;
        await baseDeDonnees.query(requeteAjoutNotification, [idUtilisateur, messageNotification]); // Exécuter la requête avec les données fournies

        res.status(201).json({ message: 'Notification ajoutée avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de l’ajout de la notification :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de l’ajout de la notification.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour récupérer toutes les notifications
routeurNotifications.get('/afficher', async (req, res) => {
    try {
        const requeteRecupererNotifications = `
            SELECT * FROM notifications
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererNotifications); // Exécuter la requête
        res.status(200).json(resultats); // Retourner les résultats au client
    } catch (error) {
        console.error('Erreur lors de la récupération des notifications :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la récupération des notifications.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour récupérer les notifications d’un utilisateur
routeurNotifications.get('/afficher/:idUtilisateur', async (req, res) => {
    const { idUtilisateur } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteNotificationsUtilisateur = `
            SELECT * FROM notifications WHERE idUtilisateur = ?
        `;
        const [resultats] = await baseDeDonnees.query(requeteNotificationsUtilisateur, [idUtilisateur]); // Exécuter la requête avec l'ID fourni

        if (resultats.length === 0) {
            return res.status(404).json({ erreur: 'Aucune notification trouvée pour cet utilisateur.' }); // Retourner une erreur si aucune notification n'est trouvée
        }

        res.status(200).json(resultats); // Retourner les résultats au client
    } catch (error) {
        console.error('Erreur lors de la récupération des notifications de l’utilisateur :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la récupération des notifications.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour modifier une notification
routeurNotifications.put('/modifier/:idNotification', async (req, res) => {
    const { idNotification } = req.params; // Extraire l'ID des paramètres de la requête
    const { messageNotification } = req.body; // Extraire les données du corps de la requête

    try {
        // Validation des données reçues
        if (!messageNotification) {
            return res.status(400).json({ erreur: 'Le message de notification est obligatoire.' }); // Retourner une erreur si le message est manquant
        }

        const requeteModifierNotification = `
            UPDATE notifications
            SET messageNotification = ?
            WHERE idNotification = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteModifierNotification, [messageNotification, idNotification]); // Exécuter la requête avec les données fournies

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Notification non trouvée.' }); // Retourner une erreur si la notification n'est pas trouvée
        }

        res.status(200).json({ message: 'Notification modifiée avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de la modification de la notification :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la modification de la notification.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour supprimer une notification
routeurNotifications.delete('/supprimer/:idNotification', async (req, res) => {
    const { idNotification } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteSupprimerNotification = `
            DELETE FROM notifications WHERE idNotification = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteSupprimerNotification, [idNotification]); // Exécuter la requête avec l'ID fourni

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Notification non trouvée.' }); // Retourner une erreur si la notification n'est pas trouvée
        }

        res.status(200).json({ message: 'Notification supprimée avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de la suppression de la notification :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la suppression de la notification.', details: error.message }); // Retourner une erreur au client
    }
});

export default routeurNotifications; // Exporter le routeur pour l'utiliser dans d'autres fichiers