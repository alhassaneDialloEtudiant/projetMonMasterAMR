import React, { useState, useEffect } from "react";
import axios from "axios";
import DossierCandidat from "./DossierCandidat";
import "../styles/CandidaturesEnAttenteAdmin.css";

const CandidaturesEnAttenteAdmin = ({ idAdminUniversite }) => {
  const [universites, setUniversites] = useState([]);
  const [selectedUniversite, setSelectedUniversite] = useState("");
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentaires, setCommentaires] = useState({});
  const [demandesSupp, setDemandesSupp] = useState({});
  const [selectedEtudiant, setSelectedEtudiant] = useState(null); // Remplace modal
  const [capacitesParFormation, setCapacitesParFormation] = useState({});

  const refreshCapacite = async (idFormation) => {
    try {
      const resCap = await axios.get(
        `http://localhost:5001/api/formations/capacite-par-formation/${idFormation}`
      );
      setCapacitesParFormation((prev) => ({
        ...prev,
        [idFormation]: resCap.data.capacite,
      }));
    } catch (error) {
      console.error(`Erreur en rechargeant la capacité (${idFormation}) :`, error);
    }
  };

  const envoyerNotificationAdmission = async (idCandidature) => {
    try {
      await axios.put(`http://localhost:5001/api/candidatures/envoyer-notification/${idCandidature}`);
      alert("Notification envoyée à l'étudiant.");
      setCandidatures((prev) =>
        prev.map((c) =>
          c.idCandidature === idCandidature
            ? { ...c, notificationEnvoyee: true, dateNotification: new Date().toISOString() }
            : c
        )
      );
    } catch (err) {
      console.error("Erreur lors de l'envoi de la notification :", err);
      alert("Erreur lors de l'envoi de la notification.");
    }
  };

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

        const candidaturesGroupees = {};

        response.data.forEach((cand) => {
          const key = cand.idFormation;
          if (!candidaturesGroupees[key]) candidaturesGroupees[key] = [];
          candidaturesGroupees[key].push(cand);
        });

        let toutesCandidatures = [];

        for (const [idFormation, liste] of Object.entries(candidaturesGroupees)) {
          const triees = liste
            .sort((a, b) => new Date(a.dateCandidature) - new Date(b.dateCandidature))
            .map((c, index) => ({ ...c, rang: index + 1 }));

          for (const cand of triees) {
            await axios.put(`http://localhost:5001/api/candidatures/rang/${cand.idCandidature}`, {
              rang: cand.rang,
            });
          }

          try {
            const resCap = await axios.get(
              `http://localhost:5001/api/formations/capacite-par-formation/${idFormation}`
            );
            setCapacitesParFormation((prev) => ({
              ...prev,
              [idFormation]: resCap.data.capacite,
            }));
          } catch (err) {
            console.error(`Erreur récupération capacité pour formation ${idFormation}`, err);
          }

          toutesCandidatures = toutesCandidatures.concat(triees);
        }

        setCandidatures(toutesCandidatures);
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
    const candidature = candidatures.find(c => c.idCandidature === idCandidature);
    const idFormation = candidature?.idFormation;
    const justificatifPresent = candidature?.justificatifSupplementaire;

    if (candidature?.demandeSupplementaire && !justificatifPresent) {
      alert("Le document demandé n'a pas encore été fourni par l'étudiant.");
      return;
    }

    const capaciteFormation = capacitesParFormation[idFormation] || 0;
    if (statut === "acceptée" && capaciteFormation <= 0) {
      alert("Aucune place disponible pour cette formation.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5001/api/candidatures/modifier/${idCandidature}`,
        { statut }
      );

      await axios.put(`http://localhost:5001/api/formations/capacite/${idFormation}`, {
        operation: statut === "acceptée" ? "decrement" : "increment"
      });

      await refreshCapacite(idFormation);

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

  const handleVoirDossier = (idUtilisateur) => {
    setSelectedEtudiant(idUtilisateur);
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
            <div key={cand.idCandidature} className={`candidature-card ${cand.demandeSupplementaire && !cand.justificatifSupplementaire ? "highlight-warning" : ""}`}>
              <div className="card-header">
                <h3>{cand.nomEtudiant}</h3>
                {cand.demandeSupplementaire && !cand.justificatifSupplementaire && (
                  <span className="badge-alert">⚠️ Suivi requis</span>
                )}
              </div>

              <p><strong>Formation :</strong> {cand.nomFormation}</p>
              <p><strong>Université :</strong> {cand.universite}</p>
              <p><strong>Localisation :</strong> {cand.localisation}</p>
              <p><strong>Rang :</strong> {cand.rang}</p>
              <p><strong>Places restantes :</strong> {capacitesParFormation[cand.idFormation] ?? "?"}</p>
              <p><strong>Décision de l'étudiant :</strong> {cand.decisionEtudiant === "accepte" ? "✅ A accepté l'admission" : cand.decisionEtudiant === "refuse" ? "❌ A refusé l'admission" : "⏳ En attente de réponse"}</p>
              <p><strong>Notification :</strong> {cand.notificationEnvoyee ? `📤 Envoyée le ${new Date(cand.dateNotification).toLocaleDateString()}` : "⏳ Pas encore envoyée"}</p>

              <button onClick={() => envoyerNotificationAdmission(cand.idCandidature)} disabled={cand.notificationEnvoyee}>📤 Envoyer la notification</button>

              <p><strong>Documents :</strong></p>
              <ul>
                {cand.cv && <li><a href={`http://localhost:5001/uploads/candidatures/${cand.cv}`} target="_blank" rel="noopener noreferrer">📄 CV</a></li>}
                {cand.releveNotes && <li><a href={`http://localhost:5001/uploads/candidatures/${cand.releveNotes}`} target="_blank" rel="noopener noreferrer">📄 Relevé de notes</a></li>}
                {cand.diplome && <li><a href={`http://localhost:5001/uploads/candidatures/${cand.diplome}`} target="_blank" rel="noopener noreferrer">📄 Diplôme</a></li>}
                {cand.lettreMotivation && <li><a href={`http://localhost:5001/uploads/candidatures/${cand.lettreMotivation}`} target="_blank" rel="noopener noreferrer">📄 Lettre de motivation</a></li>}
                {cand.justificatifSupplementaire && <li><a href={`http://localhost:5001/uploads/candidatures/${cand.justificatifSupplementaire}`} target="_blank" rel="noopener noreferrer">📄 Autre justificatif</a></li>}
              </ul>

              {cand.demandeSupplementaire && (
                <p className="info-supp">
                  📩 Document demandé : <strong>{cand.demandeSupplementaire}</strong><br />
                  {cand.justificatifSupplementaire ? (
                    <span className="ok">✅ Document reçu</span>
                  ) : (
                    <span className="pending">⚠️ En attente du document</span>
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
                placeholder="Demande de document complémentaire..."
                value={demandesSupp[cand.idCandidature] || ""}
                onChange={(e) => handleChangeDemande(cand.idCandidature, e.target.value)}
              />
              <button onClick={() => handleDemandeSupp(cand.idCandidature)}>📩 Envoyer la demande</button>

              <button className="btn-voir" onClick={() => handleVoirDossier(cand.idUtilisateur)}>
                📂 Voir le dossier complet
              </button>

              <div className="actions">
                <button
                  className="accept-btn"
                  onClick={() => handleUpdateStatus(cand.idCandidature, "acceptée")}
                  disabled={cand.demandeSupplementaire && !cand.justificatifSupplementaire}
                >
                  ✅ Accepter
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleUpdateStatus(cand.idCandidature, "refusée")}
                  disabled={cand.demandeSupplementaire && !cand.justificatifSupplementaire}
                >
                  ❌ Refuser
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {candidatures.length === 0 && selectedUniversite && !loading && (
        <p className="no-results">Aucune candidature en attente.</p>
      )}

      {selectedEtudiant && (
        <div className="dossier-complet-container">
          <h3>📂 Dossier Complet de l'Étudiant</h3>
          <DossierCandidat utilisateurId={selectedEtudiant} />
        </div>
      )}
    </div>
  );
};

export default CandidaturesEnAttenteAdmin;
