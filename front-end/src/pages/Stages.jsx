import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/stage.css"; // Assurez-vous d'inclure ce fichier CSS

const Stages = ({ utilisateurId }) => {
  const resolvedId = utilisateurId || localStorage.getItem("idUtilisateur");

  const [stages, setStages] = useState([]);
  const [stageData, setStageData] = useState({
    duree: "",
    entreprise: "",
    description: "",
  });

  const [aucunStage, setAucunStage] = useState(false);

  useEffect(() => {
    if (resolvedId) fetchStages();
  }, [resolvedId]);

  const fetchStages = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/stages/${resolvedId}`);
      setStages(response.data);
    } catch (error) {
      console.error("Erreur récupération stages :", error);
    }
  };

  const handleInputChange = (e) => {
    setStageData({ ...stageData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (aucunStage) {
      alert("Vous avez choisi de ne déclarer aucun stage.");
      return;
    }

    try {
      await axios.post("http://localhost:5001/api/stages/ajouter", {
        idUtilisateur: resolvedId,
        ...stageData,
      });

      alert("Stage enregistré avec succès !");
      fetchStages();
      setStageData({ duree: "", entreprise: "", description: "" });
    } catch (error) {
      console.error("Erreur ajout stage :", error);
      alert("Erreur lors de l'enregistrement.");
    }
  };

  const handleDelete = async (stageId) => {
    try {
      await axios.delete(`http://localhost:5001/api/stages/supprimer/${stageId}`);
      alert("Stage supprimé !");
      fetchStages();
    } catch (error) {
      console.error("Erreur suppression stage :", error);
      alert("Erreur lors de la suppression.");
    }
  };

  const isEditable = !utilisateurId; // On autorise la modification uniquement pour l'utilisateur connecté

  return (
    <>
      <h2>Mes stages</h2>

      {isEditable && (
        <>
          <input
            type="checkbox"
            id="aucunStage"
            checked={aucunStage}
            onChange={() => setAucunStage(!aucunStage)}
          />
          <label htmlFor="aucunStage">Je ne déclare aucun stage.</label>

          {!aucunStage && (
            <>
              <input type="text" name="duree" placeholder="Durée" value={stageData.duree} onChange={handleInputChange} />
              <input type="text" name="entreprise" placeholder="Entreprise" value={stageData.entreprise} onChange={handleInputChange} />
              <textarea name="description" placeholder="Description" value={stageData.description} onChange={handleInputChange} />
              <button onClick={handleSubmit}>Enregistrer</button>
            </>
          )}
        </>
      )}

      <h3>Stages enregistrés</h3>
      <ul>
        {stages.length > 0 ? (
          stages.map((stage) => (
            <li key={stage.stageId}>
              <span>{stage.duree} - {stage.entreprise} ({stage.description})</span>
              {isEditable && (
                <button onClick={() => handleDelete(stage.stageId)}>🗑 Supprimer</button>
              )}
            </li>
          ))
        ) : (
          <p>Aucun stage enregistré.</p>
        )}
      </ul>
    </>
  );
};

export default Stages;
