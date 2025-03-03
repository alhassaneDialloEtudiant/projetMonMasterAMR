import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Etablissements.css";

function Etablissements() {
  const [etablissements, setEtablissements] = useState([]);
  const [formData, setFormData] = useState({
    nomEtablissement: "",
    adresseEtablissement: "",
    contactEtablissement: "",
    localisationEtablissement: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [infoMessage, setInfoMessage] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const apiUrl = "http://localhost:5001/api/etablissements";

  useEffect(() => {
    fetchEtablissements();
  }, []);

  const fetchEtablissements = async () => {
    try {
      const response = await axios.get(`${apiUrl}/afficher`);
      setEtablissements(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des établissements :", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSubmit = () => {
    const actionMessage = isEditMode
      ? "Êtes-vous sûr de vouloir modifier cet établissement ?"
      : "Êtes-vous sûr de vouloir ajouter cet établissement ?";

    setConfirmDialog({
      isOpen: true,
      message: actionMessage,
      onConfirm: async () => {
        if (isEditMode) {
          await handleUpdate();
        } else {
          await handleAdd();
        }
        setConfirmDialog({ isOpen: false, message: "", onConfirm: () => {}, onCancel: () => {} });
      },
      onCancel: () => {
        resetForm(); // Réinitialiser les champs si l'utilisateur clique sur "Non"
        setConfirmDialog({ isOpen: false, message: "", onConfirm: () => {}, onCancel: () => {} });
      },
    });
  };

  const handleAdd = async () => {
    try {
      if (!formData.nomEtablissement || !formData.adresseEtablissement || !formData.contactEtablissement || !formData.localisationEtablissement) {
        showInfoMessage("Tous les champs sont obligatoires !");
        return;
      }

      await axios.post(`${apiUrl}/ajouter`, formData);
      showInfoMessage("Établissement ajouté avec succès !");
      fetchEtablissements();
      resetForm();
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      showInfoMessage("Une erreur s'est produite lors de l'ajout.");
    }
  };

  const handleUpdate = async () => {
    try {
      if (!formData.nomEtablissement || !formData.adresseEtablissement || !formData.contactEtablissement || !formData.localisationEtablissement) {
        showInfoMessage("Tous les champs sont obligatoires !");
        return;
      }

      await axios.put(`${apiUrl}/modifier/${editId}`, formData);
      showInfoMessage("Établissement modifié avec succès !");
      fetchEtablissements();
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
      showInfoMessage("Une erreur s'est produite lors de la modification.");
    }
  };

  const resetForm = () => {
    setFormData({
      nomEtablissement: "",
      adresseEtablissement: "",
      contactEtablissement: "",
      localisationEtablissement: "",
    });
    setIsEditMode(false);
    setEditId(null);
  };

  const handleEdit = (etablissement) => {
    setFormData({
      nomEtablissement: etablissement.nomEtablissement,
      adresseEtablissement: etablissement.adresseEtablissement,
      contactEtablissement: etablissement.contactEtablissement,
      localisationEtablissement: etablissement.localisationEtablissement,
    });
    setIsEditMode(true);
    setEditId(etablissement.idEtablissement);
  };

  const handleDelete = (id) => {
    setConfirmDialog({
      isOpen: true,
      message: "Êtes-vous sûr de vouloir supprimer cet établissement ?",
      onConfirm: async () => {
        try {
          await axios.delete(`${apiUrl}/supprimer/${id}`);
          showInfoMessage("Établissement supprimé avec succès !");
          fetchEtablissements();
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
          showInfoMessage("Une erreur s'est produite lors de la suppression.");
        }
        setConfirmDialog({ isOpen: false, message: "", onConfirm: () => {}, onCancel: () => {} });
      },
      onCancel: () => {
        setConfirmDialog({ isOpen: false, message: "", onConfirm: () => {}, onCancel: () => {} });
      },
    });
  };

  const showInfoMessage = (message) => {
    setInfoMessage(message);
    setTimeout(() => setInfoMessage(""), 3000);
  };

  const filteredEtablissements = etablissements.filter((etablissement) =>
    etablissement.nomEtablissement.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="etablissements-container">
      <h1>Gestion des Établissements</h1>

      {infoMessage && <div className="info-message">{infoMessage}</div>}

      {confirmDialog.isOpen && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <p>{confirmDialog.message}</p>
            <div className="dialog-actions">
              <button onClick={confirmDialog.onConfirm} className="btn-confirm">
                Oui
              </button>
              <button onClick={confirmDialog.onCancel} className="btn-cancel">
                Non
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        type="text"
        placeholder="Rechercher par nom d'établissement"
        value={searchValue}
        onChange={handleSearch}
        className="search-bar"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="etablissements-form"
      >
        <input
          type="text"
          name="nomEtablissement"
          value={formData.nomEtablissement}
          onChange={handleChange}
          placeholder="Nom de l'établissement"
          required
        />
        <input
          type="text"
          name="adresseEtablissement"
          value={formData.adresseEtablissement}
          onChange={handleChange}
          placeholder="Adresse"
          required
        />
        <input
          type="text"
          name="contactEtablissement"
          value={formData.contactEtablissement}
          onChange={handleChange}
          placeholder="Contact"
          required
        />
        <input
          type="text"
          name="localisationEtablissement"
          value={formData.localisationEtablissement}
          onChange={handleChange}
          placeholder="Localisation"
          required
        />
        <button type="submit">
          {isEditMode ? "Modifier" : <span>➕</span>}
        </button>
      </form>

      <table className="etablissements-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Adresse</th>
            <th>Contact</th>
            <th>Localisation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEtablissements.map((etablissement) => (
            <tr key={etablissement.idEtablissement}>
              <td>{etablissement.nomEtablissement}</td>
              <td>{etablissement.adresseEtablissement}</td>
              <td>{etablissement.contactEtablissement}</td>
              <td>{etablissement.localisationEtablissement}</td>
              <td>
                <button onClick={() => handleEdit(etablissement)}>✏️</button>
                <button onClick={() => handleDelete(etablissement.idEtablissement)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Etablissements;
