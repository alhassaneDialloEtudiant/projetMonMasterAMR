// Importation des modules nécessaires
import express from 'express'; // Framework pour créer des applications web et API
import dotenv from 'dotenv'; // Module pour gérer les variables d'environnement
import cors from 'cors'; // Middleware pour gérer les politiques de partage des ressources entre origines (CORS)

// Importation de la connexion à la base de données
import { baseDeDonnees } from './db/baseDeDonnees.mjs';

// Importation des fichiers de routes
import utilisateursRoutes from './routes/utilisateursRoutes.mjs'; // Routes pour les utilisateurs
import etudiantsRoutes from './routes/etudiantsRoutes.mjs'; // Routes pour les étudiants
import adminGenerauxRoutes from './routes/admingenerauxRoutes.mjs'; // Routes pour les administrateurs généraux
import adminUniversitairesRoutes from './routes/adminUniversitairesRoutes.mjs'; // Routes pour les administrateurs universitaires
import candidaturesRoutes from './routes/candidaturesRoutes.mjs'; // Routes pour les candidatures
import criteresAdmissionsRoutes from './routes/criteresAdmissionsRoutes.mjs'; // Routes pour les critères d'admission
import documentsRoutes from './routes/documentsRoutes.mjs'; // Routes pour les documents
import etablissementsRoutes from './routes/etablissementsRoutes.mjs'; // Routes pour les établissements
import notificationsRoutes from './routes/notificationsRoutes.mjs'; // Routes pour les notifications
import programmesRoutes from './routes/programmesRoutes.mjs'; // Routes pour les programmes
import coordonneesRoutes from "./routes/coordonneesRoutes.mjs"; // Routes pour les coordonnées
import cvRoutes from "./routes/cvRoutes.mjs"; // Routes pour les CV
import baccalaureatRoutes from "./routes/baccalaureatRoutes.mjs"; // Routes pour le baccalauréat
import cursusRoutes from "./routes/cursusPostBac.mjs"; // Routes pour le cursus post-bac
import relevesNotesRoutes from "./routes/relevesNotesRoutes.mjs"; // Routes pour les relevés de notes
import stagesRoutes from "./routes/stages.mjs"; // Routes pour les stages
import experiencesRoutes from "./routes/experiencesRoutes.mjs"; // Routes pour les expériences professionnelles
import formationsRoutes from "./routes/formationsRoutes.mjs"; // Routes pour les formations
import routeurCandidatures from "./routes/candidaturesRoutes.mjs"; // Routes pour les candidatures (redondant)
import routeurStats from "./routes/stats.mjs"; // Routes pour les statistiques

// Chargement des variables d'environnement
dotenv.config();

// Création de l'application Express
const app = express();

// Middleware pour analyser les requêtes JSON
app.use(express.json()); // Permet de lire les données JSON envoyées dans les requêtes

// Middleware pour activer CORS
app.use(cors()); // Autorise les requêtes provenant d'autres origines

// Tester la connexion à la base de données
(async () => {
    try {
        // Exécute une requête simple pour vérifier la connexion
        await baseDeDonnees.query('SELECT 1');
        console.log('Connexion à la base de données réussie.');
    } catch (err) {
        // Affiche une erreur si la connexion échoue
        console.error('Erreur lors de la connexion à la base de données :', err.message);
        process.exit(1); // Arrête le serveur en cas d'erreur critique
    }
})();

// Route de test pour vérifier si le serveur fonctionne
app.get('/', (req, res) => {
    res.send('Serveur est opérationnel !'); // Répond avec un message simple
});

// Définition des routes pour chaque fonctionnalité
app.use('/api/utilisateurs', utilisateursRoutes); // Routes pour les utilisateurs
app.use('/api/etudiants', etudiantsRoutes); // Routes pour les étudiants
app.use('/api/admingeneraux', adminGenerauxRoutes); // Routes pour les administrateurs généraux
app.use('/api/adminuniversitaires', adminUniversitairesRoutes); // Routes pour les administrateurs universitaires
app.use('/api/candidatures', candidaturesRoutes); // Routes pour les candidatures
app.use('/api/criteresadmissions', criteresAdmissionsRoutes); // Routes pour les critères d'admission
app.use('/api/documents', documentsRoutes); // Routes pour les documents
app.use('/api/etablissements', etablissementsRoutes); // Routes pour les établissements
app.use('/api/notifications', notificationsRoutes); // Routes pour les notifications
app.use('/api/programmes', programmesRoutes); // Routes pour les programmes
app.use("/api/coordonnees", coordonneesRoutes); // Routes pour les coordonnées
app.use("/api/cv", cvRoutes); // Routes pour les CV
app.use("/uploads", express.static("uploads")); // Permet d'accéder aux fichiers téléchargés
app.use("/api/baccalaureat", baccalaureatRoutes); // Routes pour le baccalauréat
app.use("/api/cursuspostbac", cursusRoutes); // Routes pour le cursus post-bac
app.use("/api/relevesnotes", relevesNotesRoutes); // Routes pour les relevés de notes
app.use("/api/stages", stagesRoutes); // Routes pour les stages
app.use("/api/experiences", experiencesRoutes); // Routes pour les expériences professionnelles
app.use("/api/formations", formationsRoutes); // Routes pour les formations
app.use("/api/candidatures", routeurCandidatures); // Routes pour les candidatures (redondant)
app.use("/api/stats", routeurStats); // Routes pour les statistiques

// Démarrage du serveur
const port = process.env.port || 5001; // Définit le port à partir des variables d'environnement ou utilise 5001 par défaut
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`); // Affiche un message lorsque le serveur démarre
});