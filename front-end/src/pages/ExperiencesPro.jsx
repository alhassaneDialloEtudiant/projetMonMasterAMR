import React, { useState } from "react";

function ExperiencesPro({ utilisateurId }) {
  const [experienceData, setExperienceData] = useState({
    entreprise: "",
    poste: "",
    description: ""
  });

  const handleInputChange = (e) => {
    setExperienceData({ ...experienceData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...experienceData, utilisateurId })
      });

      if (response.ok) {
        alert("Expérience enregistrée avec succès !");
      } else {
        alert("Erreur lors de l'enregistrement de l'expérience.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur de connexion au serveur.");
    }
  };

  return (
    <div>
      <h2>Mes expériences professionnelles</h2>
      <div className="form-group">
        <label>Nom de l'entreprise :</label>
        <input type="text" name="entreprise" value={experienceData.entreprise} onChange={handleInputChange} />
      </div>
      <div className="form-group">
        <label>Poste occupé :</label>
        <input type="text" name="poste" value={experienceData.poste} onChange={handleInputChange} />
      </div>
      <div className="form-group">
        <label>Description :</label>
        <textarea name="description" value={experienceData.description} onChange={handleInputChange}></textarea>
      </div>
      <button className="btn-save" onClick={handleSubmit}>Enregistrer</button>
    </div>
  );
}

export default ExperiencesPro;
