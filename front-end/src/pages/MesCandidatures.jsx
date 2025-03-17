import React, { useState, useEffect } from "react";
import FormationCard from "./FormationCard";
import "../styles/MesCandidatures.css";

const MesCandidatures = () => {
  const [candidatures, setCandidatures] = useState([]);

  useEffect(() => {
    const storedCandidatures = JSON.parse(localStorage.getItem("candidatures")) || [];
    setCandidatures(storedCandidatures);
    console.log("Candidatures chargées :", storedCandidatures); // 🔎 DEBUG
  }, []);

  // ✅ Fonction pour retirer une candidature et actualiser
  const retirerCandidature = (idFormation) => {
    const nouvellesCandidatures = candidatures.filter(cand => cand.idFormation !== idFormation);
    setCandidatures(nouvellesCandidatures);
    localStorage.setItem("candidatures", JSON.stringify(nouvellesCandidatures));
  };

  return (
    <div className="mes-candidatures-container">
      <h2 className="mes-candidatures-title">📌 Mes Candidatures ({candidatures.length})</h2>

      {candidatures.length > 0 ? (
        <div className="mes-candidatures-grid">
          {candidatures.map((formation) => (
            <div key={formation.idFormation} className="formation-card">
              <FormationCard formation={formation} />
              <button className="btn-retirer" onClick={() => retirerCandidature(formation.idFormation)}>
                ❌ Retirer la candidature
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-candidatures">🚨 Aucune candidature envoyée. Postulez à une formation !</p>
      )}
    </div>
  );
};

export default MesCandidatures;
