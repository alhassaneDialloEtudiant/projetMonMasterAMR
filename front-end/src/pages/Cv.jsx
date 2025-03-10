import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CV.css";
import { FaFilePdf, FaTrash, FaUpload } from "react-icons/fa"; // Ajout d'icônes

const CV = () => {
  const [cv, setCv] = useState(null);
  const [cvUrl, setCvUrl] = useState("");
  const idUtilisateur = localStorage.getItem("idUtilisateur");

  useEffect(() => {
    fetchCv();
  }, []);

  // 📌 Récupérer le CV existant
  const fetchCv = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/cv/${idUtilisateur}`);
      if (response.data.cv) {
        setCvUrl(`http://localhost:5001/uploads/${response.data.cv}`);
      }
    } catch (error) {
      console.error("Erreur récupération CV :", error);
    }
  };

  // 📌 Upload du CV
  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("cv", cv);
    formData.append("idUtilisateur", idUtilisateur);

    try {
      const response = await axios.post("http://localhost:5001/api/cv/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(response.data.message);
      fetchCv();
    } catch (error) {
      alert("Erreur lors de l'upload du CV.");
    }
  };

  // 📌 Supprimer le CV
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/cv/supprimer/${idUtilisateur}`);
      alert("CV supprimé avec succès !");
      setCvUrl("");
    } catch (error) {
      alert("Erreur lors de la suppression du CV.");
    }
  };

  return (
    <>
      <h2 className="cv-title">📄 Mon CV</h2>

      {cvUrl ? (
        <>
          <p className="cv-success">✅ CV enregistré avec succès.</p>
          <div className="cv-file">
            <FaFilePdf className="cv-icon" />
            <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="cv-link">
              Voir mon CV
            </a>
          </div>

          {/* 📌 Boutons alignés à droite */}
          <div className="button-container">
            <button className="delete-button" onClick={handleDelete}>
              <FaTrash /> Supprimer
            </button>
          </div>
        </>
      ) : (
        <>
          <label htmlFor="cv"><strong>Télécharger votre CV :</strong></label>
          <input
            type="file"
            id="cv"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setCv(e.target.files[0])}
            required
          />

          {/* 📌 Boutons alignés à droite */}
          <div className="button-container">
            <button type="submit" className="cv-button" onClick={handleUpload}>
              <FaUpload /> Enregistrer
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default CV;
