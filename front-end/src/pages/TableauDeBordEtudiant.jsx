import React, { useState, useEffect } from "react";
import "../styles/TableauDeBordEtudiant.css";
import axios from "axios";
import FormationCard from "./FormationCard";
import Formations from "./Formations";

function TableauDeBordEtudiant() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [formations, setFormations] = useState([]);
  const [afficherFormations, setAfficherFormations] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("utilisateur"));
    if (user) {
      setUtilisateur(user);

      const lastFormation = JSON.parse(localStorage.getItem("lastFormation"));
      if (lastFormation) {
        setAfficherFormations(true);
        localStorage.removeItem("lastFormation");
      }
    }
  }, []);

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
      <div className="dashboard-navigation">
        <div className="navigation-item">Mon tableau de bord</div>
        <div className="navigation-item">Mon dossier candidat</div>
        <div className="navigation-item">Mes candidatures</div>
        <div className="navigation-item">Mes candidatures en alternance</div>
        <div className="navigation-item">Mes documents</div>

        <div
          className={`navigation-item ${afficherFormations ? "active" : ""}`}
          onClick={() => setAfficherFormations(true)}
        >
          Je sélectionne une formation
        </div>

        <div className="navigation-item">Je démissionne</div>
      </div>

      <div className="dashboard-content">
        <h1>Mon tableau de bord</h1>
        <p>Retrouvez ici les informations et outils importants concernant la procédure de Mon Master.</p>

        {afficherFormations ? (
          <div className="formations-list">
            <Formations
              formations={formations}
              loading={loading}
              erreur={erreur}
              idUtilisateur={utilisateur?.idUtilisateur}
            />
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