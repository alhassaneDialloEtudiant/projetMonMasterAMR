import React, { useState, useEffect } from "react";
import axios from "axios";

const RelevesNotes = () => {
  const [file, setFile] = useState(null);
  const [commentaire, setCommentaire] = useState("");
  const [selectedOption, setSelectedOption] = useState("mes-releves");
  const [releves, setReleves] = useState([]);
  const idUtilisateur = localStorage.getItem("idUtilisateur");

  useEffect(() => {
    fetchReleves();
  }, []);

  // 📌 Récupérer les relevés de notes enregistrés
  const fetchReleves = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/relevesnotes/${idUtilisateur}`);
      setReleves(response.data);
    } catch (error) {
      console.error("Erreur récupération relevés :", error);
    }
  };

  // 📌 Gestion de l'upload de fichier
  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  // 📌 Supprimer le fichier sélectionné avant l'enregistrement
  const handleFileDelete = () => {
    setFile(null);
  };

  // 📌 Changer l'option sélectionnée
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  // 📌 Enregistrer un relevé de notes
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Veuillez sélectionner un fichier !");
      return;
    }

    const formData = new FormData();
    formData.append("fichierReleve", file);
    formData.append("idUtilisateur", idUtilisateur);
    formData.append("commentaire", commentaire);

    try {
      await axios.post("http://localhost:5001/api/relevesnotes/enregistrer", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Relevé enregistré !");
      fetchReleves(); // Rafraîchir la liste des relevés
      setFile(null);
      setCommentaire("");
    } catch (error) {
      alert("Erreur lors de l'upload.");
    }
  };

  // 📌 Supprimer un relevé enregistré
  const handleDelete = async (releveId) => {
    try {
      await axios.delete(`http://localhost:5001/api/relevesnotes/supprimer/${releveId}`);
      alert("Relevé supprimé !");
      fetchReleves(); // Rafraîchir la liste après suppression
    } catch (error) {
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="releves-container">
      <h2 className="releves-main-title">Mes relevés de notes</h2>
      <p className="releves-subtitle">Complétez les informations demandées pour cette section.</p>

      <h3 className="releves-title">Mes relevés de notes</h3>
      <p className="releves-description">
        Vous devez fournir tous les relevés de notes de votre cursus post-baccalauréat. 
        Si certains de ces relevés sont en langue étrangère, vous devez en fournir une version traduite en français ou en anglais.
      </p>

      {/* Options de relevés */}
      <div className="releves-radio-group">
        <p className="releves-label">Tous les relevés de notes de mon cursus post-baccalauréat *</p>
        <label>
          <input type="radio" name="option" value="mes-releves" checked={selectedOption === "mes-releves"} onChange={handleOptionChange} />
          Je dispose de mes relevés de notes
        </label>
        <label>
          <input type="radio" name="option" value="releves-etranger" checked={selectedOption === "releves-etranger"} onChange={handleOptionChange} />
          Mes relevés de notes étrangers sont traduits en français ou en anglais
        </label>
        <label>
          <input type="radio" name="option" value="partiel" checked={selectedOption === "partiel"} onChange={handleOptionChange} />
          Je ne dispose pas de tous mes relevés
        </label>
        <label>
          <input type="radio" name="option" value="aucun" checked={selectedOption === "aucun"} onChange={handleOptionChange} />
          Je ne dispose d’aucun relevé
        </label>
      </div>

      {/* Formulaire d'upload */}
      <form onSubmit={handleSubmit}>
        <div className="releves-group">
          <label>Vos relevés de notes *</label>
          <input type="file" accept=".pdf,.jpg,.png" onChange={handleFileUpload} className="releves-input" />
          <p className="releves-note">Le fichier doit être au format PDF, JPEG, JPG ou PNG (max. 2 Mo).</p>
        </div>

        {file && (
          <div className="releves-file">
            <span className="releves-file-name">📄 {file.name} ({(file.size / 1024).toFixed(2)} Ko)</span>
            <button type="button" className="releves-delete-button" onClick={handleFileDelete}>🗑 Supprimer</button>
          </div>
        )}

        {/* Champ commentaire */}
        <div className="releves-group">
          <label>Commentaire</label>
          <textarea
            className="releves-textarea"
            rows="4"
            placeholder="Ajoutez un commentaire..."
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
          ></textarea>
        </div>

        {/* Boutons */}
        <div className="releves-buttons">
          <button type="submit" className="releves-save-button">Enregistrer</button>
          <button type="button" className="releves-cancel-button">Annuler</button>
        </div>
      </form>

      {/* Liste des relevés enregistrés */}
      <h3 className="releves-registered-title">Relevés enregistrés</h3>
      <ul className="releves-list">
        {releves.length > 0 ? (
          releves.map((releve) => (
            <li key={releve.releveId} className="releves-item">
              <a
                href={`http://localhost:5001/uploads/releves_notes/${releve.fichierReleve}`}
                target="_blank"
                rel="noopener noreferrer"
                className="releves-file-link"
              >
                📄 {releve.fichierReleve}
              </a>
              <span className="releves-comment">📝 {releve.commentaire || "Pas de commentaire"}</span>
              <button className="releves-delete-button" onClick={() => handleDelete(releve.releveId)}>🗑 Supprimer</button>
            </li>
          ))
        ) : (
          <p className="releves-no-data">Aucun relevé enregistré.</p>
        )}
      </ul>
    </div>
  );
};

export default RelevesNotes;
