import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";
import "../styles/Etudiants.css";

function Etudiants() {
  const [etudiants, setEtudiants] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [formData, setFormData] = useState({
    numeroEtudiant: "",
    dateInscription: "",
    niveauEtudiant: "",
    idUtilisateur: "",
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

  const apiUrl = "http://localhost:5001/api/etudiants";
  const apiUtilisateursUrl = "http://localhost:5001/api/etudiants/utilisateurs-etudiants";

  useEffect(() => {
    fetchEtudiants();
    updateUtilisateursDisponibles();
  }, []);

  const fetchEtudiants = async () => {
    try {
      const response = await axios.get(`${apiUrl}/afficher`);
      setEtudiants(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des étudiants :", error);
    }
  };

  const updateUtilisateursDisponibles = async () => {
    try {
      const response = await axios.get(apiUtilisateursUrl);
      const utilisateursAjoutables = response.data.filter(
        (user) =>
          !etudiants.some(
            (etudiant) => etudiant.idUtilisateur === user.idUtilisateur
          )
      );
      setUtilisateurs(utilisateursAjoutables);
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des utilisateurs disponibles :",
        error
      );
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
    setConfirmDialog({
      isOpen: true,
      message: isEditMode
        ? "Êtes-vous sûr de vouloir modifier cet étudiant ?"
        : "Êtes-vous sûr de vouloir ajouter cet étudiant ?",
      onConfirm: async () => {
        try {
          if (isEditMode) {
            const dataToUpdate = {
              numeroEtudiant: formData.numeroEtudiant,
              dateInscription: formData.dateInscription,
              niveauEtudiant: formData.niveauEtudiant,
            };
            await axios.put(`${apiUrl}/modifier/${editId}`, dataToUpdate);
            showInfoMessage("Étudiant modifié avec succès !");
          } else {
            await axios.post(`${apiUrl}/ajouter`, formData);
            showInfoMessage("Étudiant ajouté avec succès !");
          }
          await fetchEtudiants();
          await updateUtilisateursDisponibles();
          resetForm();
        } catch (error) {
          console.error("Erreur lors de la soumission :", error);
          showInfoMessage("Une erreur s'est produite.");
        }
        setConfirmDialog({ isOpen: false, message: "", onConfirm: () => {}, onCancel: () => {} });
      },
      onCancel: () => {
        resetForm();
        setConfirmDialog({ isOpen: false, message: "", onConfirm: () => {}, onCancel: () => {} });
      },
    });
  };

  const resetForm = () => {
    setFormData({
      numeroEtudiant: "",
      dateInscription: "",
      niveauEtudiant: "",
      idUtilisateur: "",
    });
    setIsEditMode(false);
    setEditId(null);
  };

  const handleEdit = (etudiant) => {
    setFormData({
      numeroEtudiant: etudiant.numeroEtudiant,
      dateInscription: format(parseISO(etudiant.dateInscription), "yyyy-MM-dd"),
      niveauEtudiant: etudiant.niveauEtudiant,
      idUtilisateur: etudiant.idUtilisateur,
    });
    setIsEditMode(true);
    setEditId(etudiant.idEtudiant);
  };

  const handleDelete = (id) => {
    setConfirmDialog({
      isOpen: true,
      message: "Êtes-vous sûr de vouloir supprimer cet étudiant ?",
      onConfirm: async () => {
        try {
          await axios.delete(`${apiUrl}/supprimer/${id}`);
          showInfoMessage("Étudiant supprimé avec succès !");
          await fetchEtudiants();
          await updateUtilisateursDisponibles();
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
          showInfoMessage("Une erreur s'est produite.");
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

  const filteredEtudiants = etudiants.filter((etudiant) =>
    etudiant.numeroEtudiant.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="etudiants-container">
      <h1>Gestion des Étudiants</h1>

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
        placeholder="Rechercher par numéro d'étudiant"
        value={searchValue}
        onChange={handleSearch}
        className="search-bar"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="etudiants-form"
      >
        <input
          type="text"
          name="numeroEtudiant"
          value={formData.numeroEtudiant}
          onChange={handleChange}
          placeholder="Numéro Étudiant"
          required
        />
        <input
          type="date"
          name="dateInscription"
          value={formData.dateInscription}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="niveauEtudiant"
          value={formData.niveauEtudiant}
          onChange={handleChange}
          placeholder="Niveau (ex: Licence 1)"
          required
        />
        {!isEditMode && (
          <select
            name="idUtilisateur"
            value={formData.idUtilisateur}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez un utilisateur</option>
            {utilisateurs.map((user) => (
              <option key={user.idUtilisateur} value={user.idUtilisateur}>
                {user.nomUtilisateur} {user.prenomUtilisateur} - {user.emailUtilisateur}
              </option>
            ))}
          </select>
        )}
        <button type="submit">
          {isEditMode ? "Modifier" : <span>➕</span>}
        </button>
      </form>

      <table className="etudiants-table">
        <thead>
          <tr>
            <th>Numéro Étudiant</th>
            <th>Date d'inscription</th>
            <th>Niveau</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEtudiants.map((etudiant) => (
            <tr key={etudiant.idEtudiant}>
              <td>{etudiant.numeroEtudiant}</td>
              <td>{format(parseISO(etudiant.dateInscription), "dd/MM/yyyy")}</td>
              <td>{etudiant.niveauEtudiant}</td>
              <td>{etudiant.nomUtilisateur}</td>
              <td>{etudiant.prenomUtilisateur}</td>
              <td>{etudiant.emailUtilisateur}</td>
              <td>{etudiant.roleUtilisateur}</td>
              <td>
                <button onClick={() => handleEdit(etudiant)}>✏️</button>
                <button onClick={() => handleDelete(etudiant.idEtudiant)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Etudiants;
