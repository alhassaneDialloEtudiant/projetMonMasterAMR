import React, { useState, useEffect } from "react";
import "../styles/TableauDeBordEtudiant.css";
import axios from "axios";
import FormationCard from "./Formations";

function TableauDeBordEtudiant() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [formations, setFormations] = useState([]);
  const [afficherFormations, setAfficherFormations] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(null);

  // ✅ Vérifier si l'utilisateur est connecté et activer "Je sélectionne une formation" si nécessaire
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("utilisateur"));
    if (user) {
      setUtilisateur(user);

      // 📌 Vérifier si une formation était en attente après connexion
      const lastFormation = JSON.parse(localStorage.getItem("lastFormation"));
      if (lastFormation) {
        setAfficherFormations(true);
        localStorage.removeItem("lastFormation"); // Nettoyage après affichage
      }
    }
  }, []);

  // ✅ Charger les formations si l'onglet "Je sélectionne une formation" est activé
  useEffect(() => {
    if (afficherFormations) {
      setLoading(true);
      axios
        .get("http://localhost:5001/api/formations")
        .then((response) => {
          setFormations(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erreur API formations :", error);
          setErreur("Impossible de récupérer les formations.");
          setLoading(false);
        });
    }
  }, [afficherFormations]);

  return (
    <div className="dashboard-container">
      {/* Barre de navigation */}
      <div className="dashboard-navigation">
        <div className="navigation-item">Mon tableau de bord</div>
        <div className="navigation-item">Mon dossier candidat</div>
        <div className="navigation-item">Mes candidatures</div>
        <div className="navigation-item">Mes candidatures en alternance</div>
        <div className="navigation-item">Mes documents</div>

        {/* ✅ Active automatiquement "Je sélectionne une formation" après connexion */}
        <div 
          className={`navigation-item ${afficherFormations ? "active" : ""}`} 
          onClick={() => setAfficherFormations(true)}
        >
          Je sélectionne une formation
        </div>

        <div className="navigation-item">Je démissionne</div>
      </div>

      {/* Section principale */}
      <div className="dashboard-content">
        <h1>Mon tableau de bord</h1>
        <p>Retrouvez ici les informations et outils importants concernant la procédure de Mon Master.</p>

        {/* ✅ Affichage des formations si "Je sélectionne une formation" est activé */}
        {afficherFormations ? (
          <div className="formations-list">
            <h2>Formations disponibles</h2>

            {loading && <p>Chargement des formations...</p>}
            {erreur && <p className="error-message">{erreur}</p>}

            <div className="formations-grid">
              {formations.length > 0 ? (
                formations.map((formation) => (
                  <FormationCard 
                    key={formation.idFormation} 
                    formation={formation} 
                    idUtilisateur={utilisateur?.idUtilisateur} 
                  />
                ))
              ) : (
                !loading && <p>Aucune formation trouvée.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="dashboard-info">
            <div className="info-card">
              <h2>Mes candidatures hors alternance</h2>
              <p>Nombre de vœux comptabilisés : 0 sur 15.</p>
              <p>Vous avez actuellement 0 candidature(s) non confirmée(s).</p>
              <p>Vous avez actuellement 0 candidature(s) complètes non confirmée(s).</p>
            </div>
            <div className="info-card">
              <h2>Mes candidatures en alternance</h2>
              <p>Nombre de vœux comptabilisés : 0 sur 15.</p>
              <p>Vous avez actuellement 0 candidature(s) non confirmée(s).</p>
              <p>Vous avez actuellement 0 candidature(s) complètes non confirmée(s).</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TableauDeBordEtudiant;
