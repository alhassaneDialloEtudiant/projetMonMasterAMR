import React, { useState, useEffect } from "react";
import "../styles/TableauDeBordEtudiant.css";
import axios from "axios";
import Formations from "./Formations";

function TableauDeBordEtudiant() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [formations, setFormations] = useState([]);
  const [afficherFormations, setAfficherFormations] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [voeux, setVoeux] = useState({ classique: 0, alternance: 0 });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("utilisateur"));
    if (user) {
      setUtilisateur(user);

      // 🔄 Requête vers le back-end pour récupérer le nombre de vœux par type
      axios
        .get(`http://localhost:5001/api/candidatures/statistiques/voeux/${user.idUtilisateur}`)
        .then((res) => setVoeux(res.data))
        .catch((err) => console.error("Erreur lors du chargement des voeux:", err));

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
    <div className="dashboard-content">
      <h1>MON TABLEAU DE BORD</h1>
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
            <p>Nombre de vœux comptabilisés : {voeux.classique ?? 0} sur 15.</p>
          </div>
          <div className="info-card">
            <h2>Mes candidatures en alternance</h2>
            <p>Nombre de vœux comptabilisés : {voeux.alternance ?? 0} sur 15.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableauDeBordEtudiant;
