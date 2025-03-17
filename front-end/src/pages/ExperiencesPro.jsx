import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ExperiencesPro.css";

const ExperiencesPro = () => {
  const idUtilisateur = localStorage.getItem("idUtilisateur");

  const [experienceData, setExperienceData] = useState({
    anneeDebut: "",
    dureeMois: "",
    tempsTravail: "Temps plein",
    employeur: "",
    intitule: "",
    descriptif: "",
    fichierJustificatif: null,
  });

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  // 📌 Charger les expériences existantes
  const fetchExperiences = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/experiences/${idUtilisateur}`);
      setExperiences(response.data);
    } catch (error) {
      console.error("Erreur récupération expériences :", error);
    }
    setLoading(false);
  };

  // 📌 Gérer le changement des champs
  const handleInputChange = (e) => {
    setExperienceData({ ...experienceData, [e.target.name]: e.target.value });
  };

  // 📌 Gérer l'upload de fichier
  const handleFileUpload = (e) => {
    setExperienceData({ ...experienceData, fichierJustificatif: e.target.files[0] });
  };

  // 📌 Envoyer les données au backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(experienceData).forEach((key) => {
      formData.append(key, experienceData[key]);
    });

    formData.append("idUtilisateur", idUtilisateur);

    try {
      await axios.post("http://localhost:5001/api/experiences/enregistrer", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Expérience enregistrée !");
      fetchExperiences();
      setExperienceData({
        anneeDebut: "",
        dureeMois: "",
        tempsTravail: "Temps plein",
        employeur: "",
        intitule: "",
        descriptif: "",
        fichierJustificatif: null,
      });
    } catch (error) {
      alert("Erreur lors de l'enregistrement.");
    }
  };

  // 📌 Supprimer une expérience
  const handleDelete = async (expId) => {
    try {
      await axios.delete(`http://localhost:5001/api/experiences/supprimer/${expId}`);
      alert("Expérience supprimée !");
      fetchExperiences();
    } catch (error) {
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="experience-container">
      <h2 className="experience-title">Ajouter une expérience professionnelle</h2>
      <p className="experience-subtitle">
        Indiquez toutes les expériences professionnelles permettant d'éclairer votre parcours.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="experience-group">
          <label>Année de début *</label>
          <input type="number" name="anneeDebut" value={experienceData.anneeDebut} onChange={handleInputChange} required />
        </div>

        <div className="experience-group">
          <label>Durée en mois *</label>
          <input type="number" name="dureeMois" value={experienceData.dureeMois} onChange={handleInputChange} required />
        </div>

        <div className="experience-group">
          <label>Temps plein ou partiel *</label>
          <select name="tempsTravail" value={experienceData.tempsTravail} onChange={handleInputChange}>
            <option value="Temps plein">Temps plein</option>
            <option value="Temps partiel">Temps partiel</option>
          </select>
        </div>

        <div className="experience-group">
          <label>Employeur *</label>
          <input type="text" name="employeur" value={experienceData.employeur} onChange={handleInputChange} required />
        </div>

        <div className="experience-group">
          <label>Intitulé *</label>
          <input type="text" name="intitule" value={experienceData.intitule} onChange={handleInputChange} required />
        </div>

        <div className="experience-group">
          <label>Descriptif</label>
          <textarea name="descriptif" value={experienceData.descriptif} onChange={handleInputChange}></textarea>
        </div>

        <div className="experience-group">
          <label>Justificatif</label>
          <input type="file" accept=".pdf,.jpg,.png" onChange={handleFileUpload} />
        </div>

        <button type="submit">Enregistrer</button>
      </form>

      {/* Liste des expériences */}
      <h3>Expériences enregistrées</h3>
      <ul>
        {loading ? (
          <p>Chargement...</p>
        ) : experiences.length > 0 ? (
          experiences.map((exp) => (
            <li key={exp.expId}>
              <strong>{exp.intitule}</strong> chez {exp.employeur} ({exp.anneeDebut})
              <button onClick={() => handleDelete(exp.expId)}>Supprimer</button>
            </li>
          ))
        ) : (
          <p>Aucune expérience enregistrée.</p>
        )}
      </ul>
    </div>
  );
};

export default ExperiencesPro;
