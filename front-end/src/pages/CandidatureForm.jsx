import React, { useState } from "react";
import axios from "axios";

const CandidatureForm = ({ idFormation, idUtilisateur }) => {
  const [lettreMotivation, setLettreMotivation] = useState(null);
  const [cv, setCv] = useState(null);
  const [releveNotes, setReleveNotes] = useState(null);
  const [diplome, setDiplome] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e, setter) => {
    setter(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!lettreMotivation || !cv || !releveNotes || !diplome) {
      alert("Veuillez télécharger tous les documents requis !");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("idFormation", idFormation);
    formData.append("idUtilisateur", idUtilisateur);
    formData.append("lettreMotivation", lettreMotivation);
    formData.append("cv", cv);
    formData.append("releveNotes", releveNotes);
    formData.append("diplome", diplome);

    try {
      await axios.post("http://localhost:5001/api/candidatures/ajouter", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Candidature envoyée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'envoi de la candidature :", error);
      alert("Une erreur est survenue !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="candidature-form" onSubmit={handleSubmit}>
      <h3>Soumettre une Candidature</h3>

      <label>Lettre de Motivation (PDF) :</label>
      <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, setLettreMotivation)} required />

      <label>CV (PDF) :</label>
      <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, setCv)} required />

      <label>Relevé de Notes (PDF) :</label>
      <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, setReleveNotes)} required />

      <label>Diplôme (PDF) :</label>
      <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, setDiplome)} required />

      <button type="submit" disabled={loading}>
        {loading ? "Envoi en cours..." : "Valider la candidature"}
      </button>
    </form>
  );
};

export default CandidatureForm;
