import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/GestionCandidaturesAdmin.css";

const GestionCandidaturesAdmin = ({ idAdminUniversite }) => {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidatures = async () => {
        if (!idAdminUniversite) {
            console.error("ID Admin Université manquant !");
            return;
        }

        try {
            console.log(`🔍 Récupération des candidatures pour admin: ${idAdminUniversite}`);
            const response = await axios.get(`http://localhost:5001/api/candidatures/universite/${idAdminUniversite}`);
            setCandidatures(response.data);
        } catch (err) {
            console.error("Erreur lors du chargement des candidatures :", err);
            setError("Erreur lors du chargement des candidatures");
        } finally {
            setLoading(false);
        }
    };

    fetchCandidatures();
}, [idAdminUniversite]);


const handleUpdateStatus = async (idCandidature, statut) => {
  try {
      console.log("🔄 Mise à jour statut :", { idCandidature, statut });

      await axios.put(`http://localhost:5001/api/candidatures/modifier/${idCandidature}`, { statut });

      setCandidatures(prevCandidatures =>
          prevCandidatures.map(cand =>
              cand.idCandidature === idCandidature ? { ...cand, statut } : cand
          )
      );

      console.log("✅ Statut mis à jour avec succès");
  } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du statut :", error);
      alert("Erreur lors de la mise à jour du statut.");
  }
};

  if (loading) return <p className="loading">Chargement des candidatures...</p>;
  if (error) return <p className="error">{error}</p>;
  if (candidatures.length === 0) return <p className="no-results">Aucune candidature trouvée.</p>;

  return (
    <div className="candidatures-container">
      <h2>📄 Gestion des candidatures</h2>
      <div className="candidatures-list">
        {candidatures.map((cand) => (
          <div key={cand.idCandidature} className="candidature-card">
            <h3>{cand.nomEtudiant}</h3>
            <p><strong>Formation :</strong> {cand.nomFormation}</p>
            <p><strong>Université :</strong> {cand.universite}</p>
            <p><strong>Localisation :</strong> {cand.localisation}</p>
            <p><strong>Statut :</strong> <span className={`status ${cand.statut}`}>{cand.statut}</span></p>
            <div className="actions">
              <button className="accept-btn" onClick={() => handleUpdateStatus(cand.idCandidature, "acceptée")}>✅ Accepter</button>
              <button className="reject-btn" onClick={() => handleUpdateStatus(cand.idCandidature, "refusée")}>❌ Refuser</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestionCandidaturesAdmin;
