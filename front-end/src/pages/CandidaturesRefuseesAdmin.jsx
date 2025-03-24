import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CandidaturesRefuseesAdmin.css";

const CandidaturesRefuseesAdmin = ({ idAdminUniversite }) => {
  const [universites, setUniversites] = useState([]);
  const [selectedUniversite, setSelectedUniversite] = useState("");
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Récupérer les universités associées à l'admin
  useEffect(() => {
    const fetchUniversites = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/candidatures/admin-universites/${idAdminUniversite}`
        );
        setUniversites(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des universités :", err);
        setError("Impossible de charger les universités.");
      }
    };

    if (idAdminUniversite) {
      fetchUniversites();
    }
  }, [idAdminUniversite]);

  // ✅ Récupérer les candidatures refusées après la sélection d'une université
  useEffect(() => {
    const fetchCandidatures = async () => {
      if (!selectedUniversite) return;

      setLoading(true);
      try {
        console.log(`🔍 Chargement des candidatures refusées pour : ${selectedUniversite}`);
        const universiteFormatted = selectedUniversite.trim().toLowerCase();

        const response = await axios.get(
          `http://localhost:5001/api/candidatures/refusees/${universiteFormatted}`
        );
        setCandidatures(response.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des candidatures :", err);
        setError("Aucune candidature refusée pour cette université.");
        setCandidatures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatures();
  }, [selectedUniversite]);

  return (
    <div className="candidatures-refusees-container">
      <h2>❌ Candidatures Refusées</h2>

      {/* ✅ Sélecteur d'université */}
      <div className="universite-selector">
        <label>📍 Sélectionner une université :</label>
        <select
          value={selectedUniversite}
          onChange={(e) => setSelectedUniversite(e.target.value)}
        >
          <option value="">-- Choisissez une université --</option>
          {universites.map((uni, index) => (
            <option key={index} value={uni.universite}>
              {uni.universite}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Affichage des candidatures refusées */}
      {loading && <p className="loading">Chargement des candidatures...</p>}
      {error && <p className="error">{error}</p>}

      {candidatures.length > 0 && (
        <div className="candidatures-list">
          {candidatures.map((cand) => (
            <div key={cand.idCandidature} className="candidature-card">
              <h3>{cand.nomEtudiant}</h3>
              <p><strong>Formation :</strong> {cand.nomFormation}</p>
              <p><strong>Université :</strong> {cand.universite}</p>
              <p><strong>Localisation :</strong> {cand.localisation}</p>
              <p><strong>Statut :</strong> <span className="status refusee">Refusée</span></p>
            </div>
          ))}
        </div>
      )}

      {candidatures.length === 0 && selectedUniversite && !loading && (
        <p className="no-results">Aucune candidature refusée.</p>
      )}
    </div>
  );
};

export default CandidaturesRefuseesAdmin;
