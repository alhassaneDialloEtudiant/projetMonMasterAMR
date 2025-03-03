import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Programmes.css";

function Programmes() {
  const [programmes, setProgrammes] = useState([]);
  const [etablissements, setEtablissements] = useState([]);
  const [formData, setFormData] = useState({
    nomProgramme: "",
    descriptionProgramme: "",
    dureeProgramme: "",
    placesDisponibles: "",
    idEtablissement: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [infoMessage, setInfoMessage] = useState("");
  const [dialog, setDialog] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  const apiUrl = "http://localhost:5001/api/programmes";
  const etablissementsUrl = "http://localhost:5001/api/programmes/etablissements";

  useEffect(() => {
    fetchProgrammes();
    fetchEtablissements();
  }, []);

  const fetchProgrammes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/afficher`);
      setProgrammes(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des programmes :", error);
    }
  };

  const fetchEtablissements = async () => {
    try {
      const response = await axios.get(etablissementsUrl);
      setEtablissements(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des établissements :", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDialog = (message, onConfirm) => {
    setDialog({ isOpen: true, message, onConfirm });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!formData.nomProgramme || !formData.descriptionProgramme || !formData.dureeProgramme || !formData.placesDisponibles || (!formData.idEtablissement && !isEditMode)) {
      setInfoMessage("Tous les champs sont obligatoires !");
      return;
    }
  
    const dataToSubmit = {
      nomProgramme: formData.nomProgramme,
      descriptionProgramme: formData.descriptionProgramme,
      dureeProgramme: formData.dureeProgramme,
      placesDisponibles: formData.placesDisponibles,
      ...(isEditMode ? {} : { idEtablissement: formData.idEtablissement }), // Inclure idEtablissement seulement en mode ajout
    };
  
    const action = isEditMode
      ? async () => {
          try {
            await axios.put(`${apiUrl}/modifier/${editId}`, dataToSubmit);
            setInfoMessage("Programme modifié avec succès !");
            fetchProgrammes();
            resetForm();
          } catch (error) {
            console.error("Erreur lors de la modification :", error);
            setInfoMessage("Une erreur s'est produite lors de la modification.");
          }
        }
      : async () => {
          try {
            await axios.post(`${apiUrl}/ajouter`, dataToSubmit);
            setInfoMessage("Programme ajouté avec succès !");
            fetchProgrammes();
            resetForm();
          } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
            setInfoMessage("Une erreur s'est produite lors de l'ajout.");
          }
        };

    handleDialog(
      isEditMode
        ? "Êtes-vous sûr de vouloir modifier ce programme ?"
        : "Êtes-vous sûr de vouloir ajouter ce programme ?",
      action
    );
  };

  const resetForm = () => {
    setFormData({
      nomProgramme: "",
      descriptionProgramme: "",
      dureeProgramme: "",
      placesDisponibles: "",
      idEtablissement: "",
    });
    setIsEditMode(false);
    setEditId(null);
  };

  const handleEdit = (programme) => {
    setFormData({
      nomProgramme: programme.nomProgramme,
      descriptionProgramme: programme.descriptionProgramme,
      dureeProgramme: programme.dureeProgramme,
      placesDisponibles: programme.placesDisponibles,
      idEtablissement: programme.idEtablissement,
    });
    setIsEditMode(true);
    setEditId(programme.idProgramme);
  };

  const handleDelete = (id) => {
    handleDialog(
      "Êtes-vous sûr de vouloir supprimer ce programme ?",
      async () => {
        try {
          await axios.delete(`${apiUrl}/supprimer/${id}`);
          setInfoMessage("Programme supprimé avec succès !");
          fetchProgrammes();
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
        }
      }
    );
  };

  return (
    <div className="programmes-container">
      <h1>Gestion des Programmes</h1>

      {infoMessage && <div className="info-message">{infoMessage}</div>}

      {dialog.isOpen && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <p>{dialog.message}</p>
            <div className="dialog-actions">
              <button
                className="btn-confirm"
                onClick={() => {
                  dialog.onConfirm();
                  setDialog({ isOpen: false, message: "", onConfirm: null });
                }}
              >
                Oui
              </button>
              <button
                className="btn-cancel"
                onClick={() => {
                  setDialog({ isOpen: false, message: "", onConfirm: null });
                  resetForm(); // Réinitialiser le formulaire lorsque l'utilisateur clique sur "Non"
                }}
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}

      <form className="programmes-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nomProgramme"
          value={formData.nomProgramme}
          onChange={handleChange}
          placeholder="Nom Programme"
          required
        />
        <textarea
          name="descriptionProgramme"
          value={formData.descriptionProgramme}
          onChange={handleChange}
          placeholder="Description Programme"
          required
        ></textarea>
        <input
          type="text"
          name="dureeProgramme"
          value={formData.dureeProgramme}
          onChange={handleChange}
          placeholder="Durée Programme"
          required
        />
        <input
          type="number"
          name="placesDisponibles"
          value={formData.placesDisponibles}
          onChange={handleChange}
          placeholder="Places Disponibles"
          required
        />
        {!isEditMode ? (
          <select
            name="idEtablissement"
            value={formData.idEtablissement}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez un établissement</option>
            {etablissements.map((etablissement) => (
              <option key={etablissement.idEtablissement} value={etablissement.idEtablissement}>
                {etablissement.nomEtablissement}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            name="nomEtablissement"
            value={etablissements.find(e => e.idEtablissement === formData.idEtablissement)?.nomEtablissement || ""}
            readOnly
            placeholder="Établissement"
          />
        )}
        <button type="submit">{isEditMode ? "Modifier" : "Ajouter"}</button>
      </form>

      <table className="programmes-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Durée</th>
            <th>Places</th>
            <th>Établissement</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {programmes.map((programme) => (
            <tr key={programme.idProgramme}>
              <td>{programme.nomProgramme}</td>
              <td>{programme.descriptionProgramme}</td>
              <td>{programme.dureeProgramme}</td>
              <td>{programme.placesDisponibles}</td>
              <td>{programme.nomEtablissement}</td>
              <td>
                <button onClick={() => handleEdit(programme)}>✏️</button>
                <button onClick={() => handleDelete(programme.idProgramme)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Programmes;