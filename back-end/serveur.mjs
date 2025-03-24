import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import du package CORS
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
import coordonneesRoutes from "./routes/coordonneesRoutes.mjs"; // 💡 Assure-toi que le chemin est correct
import cvRoutes from "./routes/cvRoutes.mjs";
import baccalaureatRoutes from "./routes/baccalaureatRoutes.mjs"; // 📌 Importation des routes Baccalauréat
import cursusRoutes from "./routes/cursusPostBac.mjs";
import relevesNotesRoutes from "./routes/relevesNotesRoutes.mjs";
import stagesRoutes from "./routes/stages.mjs";
import experiencesRoutes from "./routes/experiencesRoutes.mjs"; // 📌 Importation des route s
import formationsRoutes from "./routes/formationsRoutes.mjs"; // 📌 Importation des routes
import routeurCandidatures from "./routes/candidaturesRoutes.mjs";
import routeurStats from "./routes/stats.mjs";


dotenv.config();

const app = express();

// Middleware pour analyser les requêtes JSON
app.use(express.json());

// **Ajout du middleware CORS**
app.use(cors()); // Active CORS pour toutes les origines par défaut

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
app.use("/api/coordonnees", coordonneesRoutes); // 👈 Ajout de la nouvelle route

app.use("/api/cv", cvRoutes);
app.use("/uploads", express.static("uploads"));  // Permet d'accéder aux fichiers téléchargés

// 📌 Définition des routes API
app.use("/api/baccalaureat", baccalaureatRoutes); // 📌 Intégration de la route Baccalauréat

app.use("/api/cursuspostbac", cursusRoutes);

app.use("/api/relevesnotes", relevesNotesRoutes);

app.use("/api/stages", stagesRoutes);

// 📌 Intégration des routes
app.use("/api/experiences", experiencesRoutes);

app.use("/uploads", express.static("uploads")); // Pour les fichiers statiques

// Routes API
app.use("/api/formations", formationsRoutes);


app.use("/api/candidatures", routeurCandidatures);

app.use("/api/stats", routeurStats);


// Démarrer le serveur
const port = process.env.port || 5001;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
