// Importer le module mysql2/promise pour utiliser les promesses avec MySQL
import mysql from 'mysql2/promise';
// Importer le module dotenv pour charger les variables d'environnement depuis un fichier .env
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// Créer une pool de connexions à la base de données MySQL
export const baseDeDonnees = mysql.createPool({
    host: process.env.hostDb,        // Hôte de la base de données (par exemple : localhost)
    user: process.env.userDb,        // Nom d'utilisateur de la base de données
    password: process.env.passwordDb, // Mot de passe de la base de données
    database: process.env.nameDb      // Nom de la base de données
});

// Tester la connexion à la base de données
baseDeDonnees.getConnection()
    .then(() => {
        console.log('Connexion à la base de données réussie.'); // Message de succès si la connexion est établie
    })
    .catch((err) => {
        console.error('Erreur lors de la connexion à la base de données :', err.message); // Message d'erreur si la connexion échoue
        console.error('Détails de l\'erreur :', err); // Afficher les détails de l'erreur
    });