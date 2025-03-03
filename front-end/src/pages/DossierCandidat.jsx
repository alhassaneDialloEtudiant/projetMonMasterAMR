import React, { useState } from "react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import "../styles/DossierCandidat.css";

function DossierCandidat() {
  const [activeSection, setActiveSection] = useState("Informations personnelles");
  const [sections, setSections] = useState({
    "Informations personnelles": false,
    "Mes coordonnées": false,
    "Mon CV": false,
    "Mon baccalauréat": false,
    "Mon cursus post-baccalauréat": false,
    "Mes relevés de notes": false,
    "Mes stages": false,
    "Mes expériences professionnelles": false
  });

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    email: "",
    telephone: ""
  });

  const [cv, setCv] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/candidats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Dossier enregistré avec succès !");
      } else {
        alert("Erreur lors de l'enregistrement.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur de connexion au serveur.");
    }
  };

  const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("cv", file);
    formData.append("email", formData.email);

    try {
      const response = await fetch("http://localhost:5000/api/upload/cv", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        alert("CV téléchargé avec succès !");
      } else {
        alert("Erreur lors du téléchargement du CV.");
      }
    } catch (error) {
      console.error("Erreur d'upload :", error);
      alert("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="dossier-container">
      <aside className="sidebar">
        <h2>Mon dossier</h2>
        <ul>
          {Object.keys(sections).map((section) => (
            <li 
              key={section} 
              className={`menu-item ${sections[section] ? "valid" : "warning"}`} 
              onClick={() => setActiveSection(section)}
            >
              {sections[section] ? <FaCheckCircle className="icon valid-icon" /> : <FaExclamationTriangle className="icon warning-icon" />} {section}
            </li>
          ))}
        </ul>
      </aside>

      <div className="content">
        <h1 className="section-title">{activeSection}</h1>
        <p className="section-description">Complétez les informations demandées pour cette section.</p>

        {activeSection === "Informations personnelles" && (
          <div className="form-group">
            <label>Nom :</label>
            <input type="text" name="nom" value={formData.nom} onChange={handleInputChange} />
            <label>Prénom :</label>
            <input type="text" name="prenom" value={formData.prenom} onChange={handleInputChange} />
            <label>Date de naissance :</label>
            <input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleInputChange} />
            <label>Email :</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
            <label>Téléphone :</label>
            <input type="tel" name="telephone" value={formData.telephone} onChange={handleInputChange} />
          </div>
        )}

        {activeSection === "Mon CV" && (
          <div className="form-group">
            <label>Téléchargez votre CV :</label>
            <input type="file" accept=".pdf" onChange={handleCvUpload} />
          </div>
        )}

        <button className="btn-save" onClick={handleSubmit}>Enregistrer</button>
      </div>
    </div>
  );
}
export default DossierCandidat;
