import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/GestionCandidaturesAdmin.css";

const GestionCandidaturesAdmin = ({ idAdminUniversite }) => {
  const [candidatures, setCandidatures] = useState([]);
  const [capacites, setCapacites] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔍 Récupération des candidatures
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
        console.error("❌ Erreur lors du chargement des candidatures :", err);
        setError("Erreur lors du chargement des candidatures.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatures();
  }, [idAdminUniversite]);

  // 🔄 Mise à jour du statut d'une candidature
  const handleUpdateStatus = async (idCandidature, statut, idFormation) => {
    try {
      console.log("🔄 Mise à jour du statut :", { idCandidature, statut });

      await axios.put(`http://localhost:5001/api/candidatures/modifier/${idCandidature}`, { statut });

      setCandidatures((prevCandidatures) =>
        prevCandidatures.map((cand) =>
          cand.idCandidature === idCandidature ? { ...cand, statut } : cand
        )
      );

      // Si la candidature est acceptée, décrémenter la capacité
      if (statut == "acceptée" && idFormation) {
        try {
            await axios.put(`http://localhost:5001/api/formations/decrement_place/${idFormation}`);
            console.log(`${idFormation} : -1`)
        } catch (error) {
            console.error("Erreur lors de la décrémentation de la capacité :", error);
        }
    }
      console.log("✅ Statut mis à jour avec succès");
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du statut :", error);
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  // 📊 Récupération des places restantes
  useEffect(() => {
    const fetchCapacites = async () => {
      const nouvellesCapacites = {};
      for (const cand of candidatures) {
        try {
          const response = await axios.get(`http://localhost:5001/api/formations/getFormation/${cand.idFormation}`);
          nouvellesCapacites[cand.idFormation] = response.data[0].capacite;
        } catch (error) {
          console.error(`❌ Erreur lors de la récupération des places pour ${cand.idFormation} :`, error);
          nouvellesCapacites[cand.idFormation] = "Erreur";
        }
      }
      setCapacites(nouvellesCapacites);
    };

    if (candidatures.length > 0) {
      fetchCapacites();
    }
  }, [candidatures]);

  // 🎨 Gestion des états de chargement et erreurs
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
            <p>
              <strong>Formation :</strong> {cand.nomFormation}
            </p>
            <p>
              <strong>Place disponible :</strong> {capacites[cand.idFormation] ?? "Chargement..."}
            </p>
            <p><strong>Université :</strong> {cand.universite}</p>
            <p><strong>Localisation :</strong> {cand.localisation}</p>
            <p><strong>Statut :</strong> <span className={`status ${cand.statut}`}>{cand.statut}</span></p>
            {cand.statut !== "Refusée" && cand.statut !== "acceptée" && (
              <div className="actions">
                {capacites[cand.idFormation] !== 0 && (
                   <button className="accept-btn" onClick={() => handleUpdateStatus(cand.idCandidature, "acceptée", cand.idFormation)}>
                   ✅ Accepter
                 </button>
                )}
                <button className="reject-btn" onClick={() => handleUpdateStatus(cand.idCandidature, "refusée", cand.idFormation)}>
                  ❌ Refuser
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestionCandidaturesAdmin;
