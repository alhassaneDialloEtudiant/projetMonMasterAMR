import React, { useState } from "react";
import axios from "axios";

const CandidatureForm = ({ idFormation, idUtilisateur, fermerFormulaire }) => {
  const [lettreMotivation, setLettreMotivation] = useState(null);
  const [cv, setCv] = useState(null);
  const [releveNotes, setReleveNotes] = useState(null);
  const [diplome, setDiplome] = useState(null);
  const [justificatifSupplementaire, setJustificatifSupplementaire] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e, setter) => {
    setter(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!idUtilisateur) {
      setMessage("Vous devez être connecté pour candidater !");
      setLoading(false);
      return;
    }

    if (!lettreMotivation || !cv || !releveNotes || !diplome) {
      setMessage("Veuillez télécharger tous les documents requis !");
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
    if (justificatifSupplementaire) {
      formData.append("justificatifSupplementaire", justificatifSupplementaire);
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/candidatures/ajouter",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        setMessage("✅ Candidature envoyée avec succès !");
        fermerFormulaire();
      } else {
        setMessage("❌ Une erreur est survenue lors de la soumission.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la candidature :", error);
      setMessage("❌ Une erreur interne est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="candidature-form" onSubmit={handleSubmit}>
      <h3>📑 Soumettre une Candidature</h3>

      {message && <p className="error-message">{message}</p>}

      <label>Lettre de Motivation (PDF) :</label>
      <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, setLettreMotivation)} required />

      <label>CV (PDF) :</label>
      <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, setCv)} required />

      <label>Relevé de Notes (PDF) :</label>
      <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, setReleveNotes)} required />

      <label>Diplôme (PDF) :</label>
      <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, setDiplome)} required />

      <label>Justificatif Supplémentaire (Facultatif) :</label>
      <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, setJustificatifSupplementaire)} />

      <button type="submit" disabled={loading}>
        {loading ? "🔄 Envoi en cours..." : "✅ Valider la candidature"}
      </button>
    </form>
  );
};

export default CandidatureForm;
