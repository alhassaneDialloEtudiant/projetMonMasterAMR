import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CandidaturesEnAttenteAdmin.css";

const CandidaturesEnAttenteAdmin = ({ idAdminUniversite }) => {
  const [universites, setUniversites] = useState([]);
  const [selectedUniversite, setSelectedUniversite] = useState("");
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentaires, setCommentaires] = useState({});
  const [demandesSupp, setDemandesSupp] = useState({});

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

  useEffect(() => {
    const fetchCandidatures = async () => {
      if (!selectedUniversite) return;

      setLoading(true);
      try {
        const universiteFormatted = selectedUniversite.trim().toLowerCase();

        const response = await axios.get(
          `http://localhost:5001/api/candidatures/en-attente/${universiteFormatted}`
        );
        setCandidatures(response.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des candidatures :", err);
        setError("Aucune candidature en attente pour cette université.");
        setCandidatures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatures();
  }, [selectedUniversite]);

  const handleUpdateStatus = async (idCandidature, statut) => {
    const demandeEnCours = demandesSupp[idCandidature];
    const candidature = candidatures.find(c => c.idCandidature === idCandidature);
    const justificatifPresent = candidature?.justificatifSupplementaire;

    if (demandeEnCours && !justificatifPresent) {
      alert("Le document demandé n'a pas encore été fourni par l'étudiant.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5001/api/candidatures/modifier/${idCandidature}`,
        { statut }
      );
      setCandidatures((prev) =>
        prev.filter((cand) => cand.idCandidature !== idCandidature)
      );
    } catch (error) {
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleCommentChange = (idCandidature, value) => {
    setCommentaires((prev) => ({ ...prev, [idCandidature]: value }));
  };

  const handleSaveComment = async (idCandidature) => {
    try {
      await axios.put(`http://localhost:5001/api/candidatures/commentaire/${idCandidature}`, {
        commentaire: commentaires[idCandidature] || ""
      });
      alert("Commentaire enregistré avec succès.");
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du commentaire :", err);
      alert("Erreur lors de l'enregistrement du commentaire.");
    }
  };

  const handleDemandeSupp = async (idCandidature) => {
    try {
      await axios.put(`http://localhost:5001/api/candidatures/demande-supplementaire/${idCandidature}`, {
        message: demandesSupp[idCandidature] || ""
      });
      alert("Demande envoyée à l'étudiant.");
    } catch (err) {
      console.error("Erreur lors de la demande de document supplémentaire :", err);
      alert("Erreur lors de la demande.");
    }
  };

  const handleChangeDemande = (id, value) => {
    setDemandesSupp((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="candidatures-container">
      <h2>📄 Candidatures en Attente</h2>

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
              <p><strong>Statut :</strong> <span className="status en-attente">En attente</span></p>
              <p><strong>Documents :</strong></p>
              <ul>
                {cand.cv && <li><a href={`/uploads/candidatures/${cand.cv}`} download>📄 CV</a></li>}
                {cand.releveNotes && <li><a href={`/uploads/candidatures/${cand.releveNotes}`} download>📄 Relevé de notes</a></li>}
                {cand.diplome && <li><a href={`/uploads/candidatures/${cand.diplome}`} download>📄 Diplôme</a></li>}
                {cand.lettreMotivation && <li><a href={`/uploads/candidatures/${cand.lettreMotivation}`} download>📄 Lettre de motivation</a></li>}
                {cand.justificatifSupplementaire && <li><a href={`/uploads/candidatures/${cand.justificatifSupplementaire}`} download>📄 Autre justificatif</a></li>}
              </ul>

              {cand.demandeSupp && (
                <p className="info-supp">
                  📩 Document demandé : <strong>{cand.demandeSupp}</strong><br/>
                  {cand.justificatifSupplementaire ? (
                    <span className="ok">✅ Document reçu</span>
                  ) : (
                    <span className="pending">❌ Document non reçu</span>
                  )}
                </p>
              )}

              <textarea
                placeholder="Ajouter un commentaire..."
                value={commentaires[cand.idCandidature] || ""}
                onChange={(e) => handleCommentChange(cand.idCandidature, e.target.value)}
              />
              <button onClick={() => handleSaveComment(cand.idCandidature)}>💾 Enregistrer le commentaire</button>

              <textarea
                placeholder="Demande de document complémentaire (ex: justificatif manquant)"
                value={demandesSupp[cand.idCandidature] || ""}
                onChange={(e) => handleChangeDemande(cand.idCandidature, e.target.value)}
              />
              <button onClick={() => handleDemandeSupp(cand.idCandidature)}>📩 Envoyer la demande</button>

              <div className="actions">
                <button 
                  className="accept-btn" 
                  onClick={() => handleUpdateStatus(cand.idCandidature, "acceptée")}
                  disabled={cand.demandeSupp && !cand.justificatifSupplementaire}
                >✅ Accepter</button>
                <button 
                  className="reject-btn" 
                  onClick={() => handleUpdateStatus(cand.idCandidature, "refusée")}
                  disabled={cand.demandeSupp && !cand.justificatifSupplementaire}
                >❌ Refuser</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {candidatures.length === 0 && selectedUniversite && !loading && (
        <p className="no-results">Aucune candidature en attente.</p>
      )}
    </div>
  );
};

export default CandidaturesEnAttenteAdmin;
