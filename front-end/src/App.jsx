import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from '../src/components/menu';
import PiedDePage from '../src/components/PiedDePage';
import Accueil from './pages/Accueil'; // Page d'accueil
import Construction from '../src/pages/PageEnConstruction'; // Page en construction
//import Utilisateurs from '../src/pages/utilisateurs'; // Importer la nouvelle page
//import Etudiants from '../src/pages/Etudiants'; // Importer la page des étudiants
//import AdminGeneraux from './pages/AdminGeneraux'; // Importer la page Administrateurs Généraux
//import Etablissements from './pages/Etablissements'; // Importer la page Établissements
//import AdminUniversitaires from './pages/AdminUniversitaires'; // Importer la page Administrateurs Universitaires
//import Authentication from './pages/Authentication'; // Page d'authentification
import InformezVous from './pages/InformezVous'; // Page Informez-vous
import Programmes from './pages/Programmes'; // Page Programmes
import PageConnexion from './pages/PageConnexion';
import ConnexionEtudiant from './pages/PageConnexionEtudiant';
import DossierCandidat from './pages/DossierCandidat';

function App() {
    return (
        <Router>
            <div className="app-container">
                {/* Menu fixe en haut */}
                <Menu />

                {/* Contenu principal */}
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Accueil />} />
                        {/* Pages redirigées vers la page de construction */}
                        <Route path="/connexion" element={<Construction />} />
                        <Route path="/tableau-de-bord" element={<Construction />} />
                        <Route path="/programmes" element={<Construction />} />
                        <Route path="/testes" element={<Programmes />} />
                        <Route path="/s-informer" element={<InformezVous />} />
                       
                        {/* Nouvelle page pour la gestion des utilisateurs */}
                        {/*<Route path="/utilisateurs" element={<Utilisateurs />} />*/}
                        {/*<Route path="/etudiants" element={<Etudiants />} />*/}
                        {/*<Route path="/admin-generaux" element={<AdminGeneraux />} />*/}
                        {/*<Route path="/etablissements" element={<Etablissements />} />*/}
                        {/*<Route path="/admin-universitaires" element={<AdminUniversitaires />} />*/}
                        {/*<Route path="/authentication" element={<Authentication />} />*/}
                        <Route path="/connexion-etudiant" element={<ConnexionEtudiant/>} />
                        <Route path="/pageConnexion" element={<PageConnexion />} />
                        <Route path="/teste" element={<DossierCandidat/>} />
                        <Route path="/dossier-candidat" element={<DossierCandidat />} />
                        
                    </Routes>
                </main>

                {/* Pied de page fixe */}
                <PiedDePage />
            </div>
        </Router>
    );
}

export default App;
