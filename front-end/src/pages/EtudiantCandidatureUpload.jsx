import React, { useEffect, useState } from "react";
import axios from "axios";

const EtudiantCandidatureUpload = ({ idUtilisateur }) => {
  const [candidatures, setCandidatures] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/candidatures/utilisateur/${idUtilisateur}`);
        setCandidatures(res.data);
      } catch (err) {
        console.error("Erreur de chargement des candidatures", err);
      }
    };
    fetchCandidatures();
  }, [idUtilisateur]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (idCandidature) => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("justificatifSupplementaire", selectedFile);

    try {
      await axios.put(
        `http://localhost:5001/api/candidatures/upload-justificatif/${idCandidature}`,
        formData
      );
      setSuccess("Document envoyé avec succès !");
      setSelectedFile(null);
    } catch (err) {
      console.error("Erreur lors de l'envoi :", err);
      setSuccess("Erreur lors de l'envoi du document.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="etudiant-documents">
      <h2>📑 Mes Candidatures</h2>
      {candidatures.length === 0 && <p>Vous n'avez aucune candidature.</p>}

      {candidatures.map((c) => (
        <div key={c.idCandidature} className="candidature-etudiant">
          <p><strong>Formation :</strong> {c.nomFormation}</p>
          <p><strong>Statut :</strong> {c.statut}</p>

          {c.demandeSupp && (
            <>
              <p className="alert">📩 Demande de document : {c.demandeSupp}</p>
              <input type="file" onChange={handleFileChange} />
              <button onClick={() => handleUpload(c.idCandidature)} disabled={uploading}>
                {uploading ? "Envoi en cours..." : "📤 Envoyer justificatif"}
              </button>
            </>
          )}
        </div>
      ))}

      {success && <p className="status-message">{success}</p>}
    </div>
  );
};

export default EtudiantCandidatureUpload;
