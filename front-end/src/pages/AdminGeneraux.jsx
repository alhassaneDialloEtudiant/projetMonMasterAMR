import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminGeneraux.css";

function AdminGeneraux() {
  const [admins, setAdmins] = useState([]);
  const [utilisateursDisponibles, setUtilisateursDisponibles] = useState([]);
  const [formData, setFormData] = useState({
    idUtilisateur: "",
    pouvoirAdmin: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const apiUrl = "http://localhost:5001/api/admingeneraux";

  useEffect(() => {
    fetchAdmins();
    fetchUtilisateursDisponibles();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${apiUrl}/afficher`);
      setAdmins(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des administrateurs :", error);
    }
  };

  const fetchUtilisateursDisponibles = async () => {
    try {
      const response = await axios.get(`${apiUrl}/utilisateurs-disponibles`);
      setUtilisateursDisponibles(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs disponibles :", error);
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
    const action = isEditMode ? "modifier" : "ajouter";
    setConfirmDialog({
      isOpen: true,
      message: `Êtes-vous sûr de vouloir ${action} cet administrateur ?`,
      onConfirm: async () => {
        try {
          if (isEditMode) {
            await axios.put(`${apiUrl}/modifier/${editId}`, formData);
            showInfoMessage("Administrateur modifié avec succès !");
          } else {
            await axios.post(`${apiUrl}/ajouter`, formData);
            showInfoMessage("Administrateur ajouté avec succès !");
          }
          fetchAdmins();
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
    setFormData({ idUtilisateur: "", pouvoirAdmin: "" });
    setIsEditMode(false);
    setEditId(null);
  };

  const handleEdit = (admin) => {
    setFormData({
      idUtilisateur: admin.idUtilisateur,
      pouvoirAdmin: admin.pouvoirAdmin,
    });
    setIsEditMode(true);
    setEditId(admin.idAdminGeneral);
  };

  const handleDelete = (id) => {
    setConfirmDialog({
      isOpen: true,
      message: "Êtes-vous sûr de vouloir supprimer cet administrateur ?",
      onConfirm: async () => {
        try {
          await axios.delete(`${apiUrl}/supprimer/${id}`);
          showInfoMessage("Administrateur supprimé avec succès !");
          fetchAdmins();
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
          showInfoMessage("Une erreur s'est produite.");
        }
        setConfirmDialog({ isOpen: false, message: "", onConfirm: () => {}, onCancel: () => {} });
      },
    });
  };

  const showInfoMessage = (message) => {
    setInfoMessage(message);
    setTimeout(() => {
      setInfoMessage(""); // Efface le message après 3 secondes
    }, 3000);
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.idUtilisateur.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="admin-container">
      <h1>Gestion des Administrateurs Généraux</h1>

      {infoMessage && <div className="info-message">{infoMessage}</div>}

      {confirmDialog.isOpen && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <p>{confirmDialog.message}</p>
            <div className="dialog-actions">
              <button onClick={confirmDialog.onConfirm} className="btn-confirm">
                Oui
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setConfirmDialog({ isOpen: false, message: "", onConfirm: () => {}, onCancel: () => {} });
                }}
                className="btn-cancel"
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        type="text"
        placeholder="Rechercher par utilisateur"
        value={searchValue}
        onChange={handleSearch}
        className="search-bar"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="admin-form"
      >
        {!isEditMode && (
          <select
            name="idUtilisateur"
            value={formData.idUtilisateur}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez un utilisateur</option>
            {utilisateursDisponibles.map((user) => (
              <option key={user.idUtilisateur} value={user.idUtilisateur}>
                {user.nomUtilisateur} {user.prenomUtilisateur}
              </option>
            ))}
          </select>
        )}
        <input
          type="text"
          name="pouvoirAdmin"
          value={formData.pouvoirAdmin}
          onChange={handleChange}
          placeholder="Pouvoir Admin"
          required
        />
        <button type="submit">{isEditMode ? "Modifier" : "Ajouter"}</button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID Administrateur</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th> 
            <th>ID Utilisateur</th>
            <th>Pouvoir Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdmins.map((admin) => (
            <tr key={admin.idAdminGeneral}>
              <td>{admin.idAdminGeneral}</td>
              <td>{admin.nomUtilisateur}</td>
              <td>{admin.prenomUtilisateur}</td>
              <td>{admin.emailUtilisateur}</td> 
              <td>{admin.idUtilisateur}</td>
              <td>{admin.pouvoirAdmin}</td>
              <td>
                <button onClick={() => handleEdit(admin)}>✏️</button>
                <button onClick={() => handleDelete(admin.idAdminGeneral)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminGeneraux;
