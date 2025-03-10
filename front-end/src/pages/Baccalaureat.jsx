import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Baccalaureat.css"; 

const Baccalaureat = () => {
  const idUtilisateur = localStorage.getItem("idUtilisateur");

  const [formData, setFormData] = useState({
    typeBaccalaureat: "",
    serieBaccalaureat: "",
    paysObtention: "",
    anneeObtention: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBaccalaureat();
  }, []);

  const fetchBaccalaureat = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/baccalaureat/${idUtilisateur}`);
      if (response.status === 200) {
        setFormData(response.data);
      }
    } catch (error) {
      console.log("Aucune donnée existante.");
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5001/api/baccalaureat/enregistrer", {
        idUtilisateur,
        ...formData,
      });

      alert("Baccalauréat enregistré avec succès !");
    } catch (error) {
      alert("Erreur lors de l'enregistrement.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/baccalaureat/supprimer/${idUtilisateur}`);
      alert("Baccalauréat supprimé avec succès !");
      setFormData({
        typeBaccalaureat: "",
        serieBaccalaureat: "",
        paysObtention: "",
        anneeObtention: "",
      });
    } catch (error) {
      alert("Erreur lors de la suppression.");
    }
  };

  if (loading) {
    return <p>Chargement des données...</p>;
  }

  return (
    <div className="bac-container">
      <h1 className="bac-title">Mon baccalauréat</h1>
      <p className="bac-description">
        Indiquez les informations relatives à votre baccalauréat ou à votre titre admis en équivalence du baccalauréat.
      </p>

      <div className="info-obligatoire">
        <span className="obligatoire">|</span> Les informations suivies de * sont obligatoires.
      </div>

      <div className="bac-group">
        <label className="bac-label">Type de baccalauréat *</label>
        <select name="typeBaccalaureat" value={formData.typeBaccalaureat} onChange={handleInputChange} className="bac-input">
          <option value="">Sélectionnez un type</option>
          <option value="Général">Général</option>
          <option value="Technologique">Technologique</option>
          <option value="Professionnel">Professionnel</option>
        </select>
      </div>

      <div className="bac-group">
        <label className="bac-label">Série du Baccalauréat *</label>
        <select name="serieBaccalaureat" value={formData.serieBaccalaureat} onChange={handleInputChange} className="bac-input">
          <option value="">Sélectionnez une série</option>
          <option value="Scientifique">Scientifique</option>
          <option value="Littéraire">Littéraire</option>
          <option value="Économique">Économique</option>
          <option value="Technologique">Technologique</option>
        </select>
      </div>

      <div className="bac-group">
        <label className="bac-label">Pays d’obtention *</label>
        <input type="text" name="paysObtention" value={formData.paysObtention} onChange={handleInputChange} className="bac-input" />
      </div>

      <div className="bac-group">
        <label className="bac-label">Année d’obtention *</label>
        <input type="number" name="anneeObtention" value={formData.anneeObtention} onChange={handleInputChange} className="bac-input" />
      </div>

      <div className="bac-buttons">
        <button onClick={handleSubmit} className="bac-save-button">Enregistrer</button>
        <button onClick={handleDelete} className="bac-delete-button">Supprimer</button>
      </div>
    </div>
  );
};

export default Baccalaureat;
