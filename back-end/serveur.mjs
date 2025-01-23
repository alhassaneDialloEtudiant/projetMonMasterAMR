import express from 'express';
import dotenv from 'dotenv';
import { baseDeDonnees } from './db/baseDeDonnees.mjs';
import utilisateursRoutes from './routes/utilisateursRoutes.mjs';
import etudiantsRoutes from './routes/etudiantsRoutes.mjs';
import adminGenerauxRoutes from './routes/admingenerauxRoutes.mjs';
import adminUniversitairesRoutes from './routes/adminUniversitairesRoutes.mjs';
import candidaturesRoutes from './routes/candidaturesRoutes.mjs';
import criteresAdmissionsRoutes from './routes/criteresAdmissionsRoutes.mjs';
import documentsRoutes from './routes/documentsRoutes.mjs';
import etablissementsRoutes from './routes/etablissementsRoutes.mjs';
import notificationsRoutes from './routes/notificationsRoutes.mjs';
import programmesRoutes from './routes/programmesRoutes.mjs';


dotenv.config();

const app = express();

// Middleware pour analyser les requêtes JSON
app.use(express.json());

// Tester la connexion à la base de données
(async () => {
    try {
        await baseDeDonnees.query('SELECT 1'); // Exécuter une requête simple pour valider la connexion
        console.log('Connexion à la base de données réussie.');
    } catch (err) {
        console.error('Erreur lors de la connexion à la base de données :', err.message);
        process.exit(1); // Arrêter le serveur en cas d'erreur critique de connexion
    }
})();

// Point de test pour vérifier le serveur
app.get('/', (req, res) => {
    res.send('Serveur est opérationnel !');
});

// Routes pour les utilisateurs
app.use('/api/utilisateurs', utilisateursRoutes);

// Routes pour les étudiants
app.use('/api/etudiants', etudiantsRoutes);

app.use('/api/admingeneraux', adminGenerauxRoutes);

app.use('/api/adminuniversitaires', adminUniversitairesRoutes);

app.use('/api/candidatures', candidaturesRoutes);

app.use('/api/criteresadmissions', criteresAdmissionsRoutes);

app.use('/api/documents', documentsRoutes);

app.use('/api/etablissements', etablissementsRoutes);

app.use('/api/notifications', notificationsRoutes);

app.use('/api/programmes', programmesRoutes);


// Démarrer le serveur
const port = process.env.port || 5001;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
