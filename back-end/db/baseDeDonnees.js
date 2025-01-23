import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const baseDeDonnees = mysql.createPool({
    host: process.env.hostDb,
    user: process.env.userDb,
    password: process.env.passwordDb,
    database: process.env.nameDb
});

// Tester la connexion
baseDeDonnees.getConnection()
    .then(() => {
        console.log('Connexion à la base de données réussie.');
    })
    .catch((err) => {
        console.error('Erreur lors de la connexion à la base de données :', err.message);
        console.error('Détails de l\'erreur :', err);
    });
