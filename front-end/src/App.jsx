import React from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from '../src/components/menu';
import PiedDePage from '../src/components/PiedDePage';
import Accueil from './pages/Accueil'; // Page d'accueil
import Construction from '../src/pages/PageEnConstruction'; // Page en construction
import AdminsUniversitaires from './components/AdminsUniversitaires'; // Import de AdminsUniversitaires

function App() {
    return (
        <Router>
            <div className="app-container">
                {/* Menu fixe en haut */}
                <Menu />

                {/* Routes principales */}
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Accueil />} />
                        {/* Pages redirigées vers la page de construction */}
                        <Route path="/connexion" element={<Construction />} />
                        <Route path="/tableau-de-bord" element={<Construction />} />
                        <Route path="/programmes" element={<Construction />} />
                        {/* Nouvelle route pour la gestion des Admins Universitaires */}
                        <Route path="/admins-universitaires" element={<AdminsUniversitaires />} />
                    </Routes>
                </main>

                {/* Pied de page fixe */}
                <PiedDePage />
            </div>
        </Router>
    );
}

export default App;
