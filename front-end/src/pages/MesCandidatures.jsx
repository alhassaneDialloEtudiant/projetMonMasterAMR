import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/MesCandidatures.css";
import {
  FaUniversity,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClipboardList,
  FaBookOpen,
} from "react-icons/fa";

const MesCandidatures = ({ idUtilisateur }) => {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});

  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/candidatures/utilisateur/${idUtilisateur}`
        );
        setCandidatures(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des candidatures");
      } finally {
        setLoading(false);
      }
    };

    if (idUtilisateur) {
      fetchCandidatures();
    }
  }, [idUtilisateur]);

  const handleFileUpload = (e, idCandidature) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [idCandidature]: e.target.files[0],
    }));
  };

  const handleSubmitFile = async (idCandidature) => {
    if (!selectedFiles[idCandidature]) return;

    const formData = new FormData();
    formData.append("justificatifSupplementaire", selectedFiles[idCandidature]);

    try {
      await axios.put(
        `http://localhost:5001/api/candidatures/upload-justificatif/${idCandidature}`,
        formData
      );
      alert("✅ Document envoyé !");
      window.location.reload();
    } catch (err) {
      alert("❌ Erreur lors de l'envoi.");
    }
  };

  if (loading) return <p className="loading">Chargement des candidatures...</p>;
  if (error) return <p className="error">{error}</p>;
  if (candidatures.length === 0)
    return <p className="no-results">Aucune candidature trouvée.</p>;

  return (
    <div className="mes-candidatures-container">
      <h2><FaClipboardList className="icon" /> Mes candidatures</h2>
      <div className="candidatures-list">
        {candidatures.map((candidature) => (
          <div key={candidature.idCandidature} className="candidature-card">
            <div className="logo-container">
              <img
                src={candidature.logo ? `http://localhost:5001/uploads/formations/${candidature.logo}` : "/images/default-logo.png"}
                alt="Logo Université"
                className="university-logo"
              />
            </div>

            <h3 className="formation-name">{candidature.nomFormation}</h3>

            <p><FaUniversity className="icon" /><strong> Université :</strong> {candidature.universite}</p>
            <p><FaMapMarkerAlt className="icon" /><strong> Localisation :</strong> {candidature.localisation || "Non spécifiée"}</p>
            <p><FaBookOpen className="icon" /><strong> Type :</strong> {candidature.typeFormation || "Non spécifié"}</p>
            <p><FaClipboardList className="icon" /><strong> Statut :</strong> {candidature.statut}</p>
            <p><FaCalendarAlt className="icon" /><strong> Date de candidature :</strong> 
              {candidature.dateSoumission ? new Date(candidature.dateSoumission).toLocaleDateString() : "Non disponible"}
            </p>

            {candidature.commentaire && candidature.statut.toLowerCase() === "refusée" && (
              <p className="motif-refus">❌ <strong>Motif du refus :</strong> {candidature.commentaire}</p>
            )}

            {candidature.demandeSupplementaire && (
              <div className="demande-supplementaire">
                <p className="demande-message">
                  📩 <strong>Demande complémentaire :</strong> {candidature.demandeSupplementaire}
                </p>

                {!candidature.justificatifSupplementaire ? (
                  <div className="upload-section">
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, candidature.idCandidature)}
                    />
                    <button onClick={() => handleSubmitFile(candidature.idCandidature)}>
                      📤 Envoyer le document
                    </button>
                  </div>
                ) : (
                  <p className="ok">✅ Document envoyé</p>
                )}
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default MesCandidatures;
