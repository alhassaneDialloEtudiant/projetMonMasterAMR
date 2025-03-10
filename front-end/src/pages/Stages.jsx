import React, { useState } from "react";
import "../styles/stage.css"; // Assurez-vous d'inclure ce fichier CSS

function Stages({ utilisateurId }) {
  const [stageData, setStageData] = useState({
    anneeDebut: "",
    dureeSemaines: "",
    heuresParSemaine: "",
    entreprise: "",
    intitule: "",
    description: "",
    attestation: null,
  });

  const [aucunStage, setAucunStage] = useState(false);

  const handleInputChange = (e) => {
    setStageData({ ...stageData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    setStageData({ ...stageData, attestation: e.target.files[0] });
  };

  const handleSubmit = async () => {
    try {
      if (aucunStage) {
        alert("Vous avez choisi de ne déclarer aucun stage.");
        return;
      }

      const formData = new FormData();
      Object.keys(stageData).forEach((key) => {
        formData.append(key, stageData[key]);
      });

      const response = await fetch("http://localhost:5001/api/stages", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Stage enregistré avec succès !");
      } else {
        alert("Erreur lors de l'enregistrement du stage.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="stage-container">
      <h2>Ajouter un stage</h2>
      <p className="stage-description">
        Vous pouvez indiquer l’ensemble des stages effectués durant votre cursus en détaillant votre rôle, vos réalisations et l’impact sur votre projet d’études.
      </p>

      <div className="form-group">
        <input
          type="checkbox"
          id="aucunStage"
          checked={aucunStage}
          onChange={() => setAucunStage(!aucunStage)}
        />
        <label htmlFor="aucunStage">Je ne déclare aucun stage.</label>
      </div>

      {!aucunStage && (
        <>
          <h3>J’ajoute un stage.</h3>

          <div className="form-group">
            <label>Année du début *</label>
            <input
              type="text"
              name="anneeDebut"
              value={stageData.anneeDebut}
              onChange={handleInputChange}
              placeholder="Exemple : 2022"
            />
          </div>

          <div className="form-group">
            <label>Durée en semaines *</label>
            <input
              type="text"
              name="dureeSemaines"
              value={stageData.dureeSemaines}
              onChange={handleInputChange}
              placeholder="Exemple : 8"
            />
          </div>

          <div className="form-group">
            <label>Nombre d'heures par semaine</label>
            <input
              type="text"
              name="heuresParSemaine"
              value={stageData.heuresParSemaine}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Employeur ou organisme *</label>
            <input
              type="text"
              name="entreprise"
              value={stageData.entreprise}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Intitulé du stage *</label>
            <input
              type="text"
              name="intitule"
              value={stageData.intitule}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Descriptif</label>
            <textarea
              name="description"
              value={stageData.description}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Attestation de stage</label>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              onChange={handleFileUpload}
            />
          </div>

          <div className="button-container">
            <button className="btn-save" onClick={handleSubmit}>
              Enregistrer
            </button>
            <button className="btn-cancel">
              Annuler les modifications
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Stages;
