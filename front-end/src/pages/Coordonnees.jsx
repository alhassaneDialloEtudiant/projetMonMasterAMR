import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Coordonnees.css";

const Coordonnees = ({ utilisateurId: propUtilisateurId }) => {
  const [formData, setFormData] = useState({
    emailUtilisateur: "",
    telephone1: "",
    telephone2: "",
  });

  const [idUtilisateur, setIdUtilisateur] = useState(null);

  useEffect(() => {
    const id = propUtilisateurId || localStorage.getItem("idUtilisateur");
    if (!id) {
      console.error("ID utilisateur introuvable");
      return;
    }
    setIdUtilisateur(id);

    const fetchCoordonnees = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/coordonnees/${id}`);
        if (response.status === 200) {
          setFormData({
            emailUtilisateur: response.data.emailUtilisateur || "",
            telephone1: response.data.telephone1 || "",
            telephone2: response.data.telephone2 || "",
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des coordonnées :", error);
      }
    };

    fetchCoordonnees();
  }, [propUtilisateurId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!idUtilisateur) return;
    try {
      await axios.post(`http://localhost:5001/api/coordonnees/enregistrer/${idUtilisateur}`, formData);
      alert("Coordonnées enregistrées avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    }
  };

  return (
    <div className="coord-container">
      <h2 className="coord-title">Mes coordonnées</h2>

      <div className="coord-group">
        <label>Adresse électronique :</label>
        <input
          type="email"
          name="emailUtilisateur"
          value={formData.emailUtilisateur}
          readOnly
          className="coord-input"
        />
      </div>

      <div className="coord-group">
        <label>Téléphone 1 :</label>
        <input
          type="text"
          name="telephone1"
          value={formData.telephone1}
          onChange={handleInputChange}
          placeholder="Exemple : +337XXXXXXXX"
          className="coord-input"
        />
      </div>

      <div className="coord-group">
        <label>Téléphone 2 :</label>
        <input
          type="text"
          name="telephone2"
          value={formData.telephone2}
          onChange={handleInputChange}
          placeholder="Exemple : +224XXXXXXXX"
          className="coord-input"
        />
      </div>

      <button onClick={handleSubmit} className="coord-button">Enregistrer</button>
    </div>
  );
};

export default Coordonnees;
