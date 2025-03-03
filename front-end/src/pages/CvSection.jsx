import React, { useState } from "react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import "../styles/DossierCandidat.css";

function CvSection() {
  const [cvFile, setCvFile] = useState(null);
  const [cvValid, setCvValid] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
      setCvValid(true);
    } else {
      setCvFile(null);
      setCvValid(false);
      alert("Veuillez télécharger un fichier PDF valide.");
    }
  };

  return (
    <div className="dossier-content">
      
      
      <div className="content">
        <h1>Mon CV</h1>
        <p>Ajoutez votre CV au format PDF.</p>
        <div className="form-group">
          <input type="file" accept=".pdf" onChange={handleFileUpload} />
          {cvFile && <p>📄 {cvFile.name}</p>}
        </div>
        <button className="btn-save">Enregistrer</button>
      </div>
    </div>
  );
}

export default CvSection;