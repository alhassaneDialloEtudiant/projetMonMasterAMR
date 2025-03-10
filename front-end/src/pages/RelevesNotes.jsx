import React, { useState } from "react";
import "../styles/RelevesNotes.css"; // Importation du fichier CSS

const RelevesNotes = ({ onSave }) => {
  const [file, setFile] = useState(null);
  const [selectedOption, setSelectedOption] = useState("mes-releves");
  const [commentaire, setCommentaire] = useState("");

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileDelete = () => {
    setFile(null);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = () => {
    if (!file) {
      alert("Veuillez télécharger un relevé de notes avant de soumettre.");
      return;
    }
    onSave("Mes relevés de notes", { fileName: file.name, commentaire });
  };

  return (
    <div className="releves-container">
      <h2 className="releves-main-title">Mes relevés de notes</h2>
      <p className="releves-subtitle">Complétez les informations demandées pour cette section.</p>

      <h3 className="releves-title">Mes relevés de notes</h3>
      <p className="releves-description">
        Vous devez fournir tous les relevés de notes de votre cursus post-baccalauréat.
        <br />
        Si certains de ces relevés sont en langue étrangère, vous devez en fournir une version traduite en français ou en anglais.
        <br />
        <strong>Attention :</strong> Toute fraude peut entraîner l'annulation de vos candidatures et propositions d'admission.
      </p>

      <div className="releves-radio-group">
        <p className="releves-label">Tous les relevés de notes de mon cursus post-baccalauréat *</p>
        <label>
          <input type="radio" name="option" value="mes-releves" checked={selectedOption === "mes-releves"} onChange={handleOptionChange} />
          Je dispose de mes relevés de notes
        </label>
        <label>
          <input type="radio" name="option" value="releves-etranger" checked={selectedOption === "releves-etranger"} onChange={handleOptionChange} />
          Je dispose de mes relevés de notes et ceux obtenus à l’étranger sont traduits en français ou en anglais
        </label>
        <label>
          <input type="radio" name="option" value="partiel" checked={selectedOption === "partiel"} onChange={handleOptionChange} />
          Je ne dispose pas de la totalité de mes relevés de notes
        </label>
        <label>
          <input type="radio" name="option" value="aucun" checked={selectedOption === "aucun"} onChange={handleOptionChange} />
          Je ne dispose d’aucun relevé de notes
        </label>
      </div>

      <div className="releves-group">
        <label>Vos relevés de notes *</label>
        <input type="file" accept=".pdf,.jpg,.png" onChange={handleFileUpload} className="releves-input" />
        <p className="releves-note">
          Le fichier doit être au format PDF, JPEG, JPG ou PNG avec une taille maximale de 2 Mo.
        </p>
      </div>

      {file && (
        <div className="releves-file">
          <a href="#" className="releves-file-link">📄 {file.name}</a>
          <span className="releves-file-size">PDF - {(file.size / 1024).toFixed(2)} Ko</span>
          <button className="releves-delete-button" onClick={handleFileDelete}>🗑 Supprimer le fichier</button>
        </div>
      )}

      <div className="releves-group">
        <label>Commentaire</label>
        <textarea
          className="releves-textarea"
          rows="4"
          placeholder="Ajoutez un commentaire sur vos relevés de notes..."
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
        ></textarea>
      </div>

      <div className="releves-buttons">
        <button onClick={handleSubmit} className="releves-save-button">Enregistrer</button>
        <button className="releves-cancel-button">Annuler les modifications</button>
      </div>
    </div>
  );
};

export default RelevesNotes;
