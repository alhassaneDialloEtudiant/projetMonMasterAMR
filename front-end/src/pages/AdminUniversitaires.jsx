import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminUniversitaires.css";

function AdminUniversitaires() {
  const [adminUniversitaires, setAdminUniversitaires] = useState([]);
  const [etablissements, setEtablissements] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [formData, setFormData] = useState({
    idEtablissement: "",
    idUtilisateur: "",
    poste: "",
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

  const apiUrl = "http://localhost:5001/api/adminuniversitaires";
  const etablissementsUrl = "http://localhost:5001/api/adminuniversitaires/etablissements";
  const utilisateursUrl = "http://localhost:5001/api/adminuniversitaires/utilisateurs-admins";

  useEffect(() => {
    fetchAdminUniversitaires();
    fetchEtablissements();
    fetchUtilisateurs();
  }, []);

  const fetchAdminUniversitaires = async () => {
    try {
      const response = await axios.get(`${apiUrl}/afficher`);
      console.log("Données adminUniversitaires :", response.data); // Log des données récupérées
      setAdminUniversitaires(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des administrateurs universitaires :", error);
    }
  };
  const fetchEtablissements = async () => {
    try {
      const response = await axios.get(etablissementsUrl);
      console.log("Réponse des établissements :", response.data); // Log des données récupérées
      setEtablissements(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des établissements :", error);
      setEtablissements([]); // Réinitialiser en cas d'erreur
    }
  };
  

  const fetchUtilisateurs = async () => {
    try {
      const response = await axios.get(utilisateursUrl);
      console.log("Données utilisateurs :", response.data); // Log des données récupérées
      setUtilisateurs(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs :", error);
      setUtilisateurs([]);
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
    if (!formData.idEtablissement || !formData.idUtilisateur || !formData.poste) {
        showInfoMessage("Tous les champs sont obligatoires.");
        return;
    }

    setConfirmDialog({
        isOpen: true,
        message: isEditMode
            ? "Êtes-vous sûr de vouloir modifier cet administrateur universitaire ?"
            : "Êtes-vous sûr de vouloir ajouter cet administrateur universitaire ?",
        onConfirm: async () => {
            try {
                console.log("Données envoyées :", formData); // Ajout de log des données envoyées
                if (isEditMode) {
                    await axios.put(`${apiUrl}/modifier/${editId}`, formData);
                    showInfoMessage("Administrateur universitaire modifié avec succès !");
                } else {
                    await axios.post(`${apiUrl}/ajouter`, formData);
                    showInfoMessage("Administrateur universitaire ajouté avec succès !");
                }
                fetchAdminUniversitaires();
                resetForm();
            } catch (error) {
                console.error("Erreur lors de la soumission :", error); // Log de l'erreur
                showInfoMessage("Une erreur s'est produite lors de la soumission.");
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
      idEtablissement: "",
      idUtilisateur: "",
      poste: "",
    });
    setIsEditMode(false);
    setEditId(null);
  };

  const handleEdit = (adminUniv) => {
    setFormData({
      idEtablissement: adminUniv.idEtablissement,
      idUtilisateur: adminUniv.idUtilisateur,
      poste: adminUniv.poste,
    });
    setIsEditMode(true);
    setEditId(adminUniv.idAdminUniversitaire);
  };

  const handleDelete = (id) => {
    setConfirmDialog({
      isOpen: true,
      message: "Êtes-vous sûr de vouloir supprimer cet administrateur universitaire ?",
      onConfirm: async () => {
        try {
          await axios.delete(`${apiUrl}/supprimer/${id}`);
          showInfoMessage("Administrateur universitaire supprimé avec succès !");
          fetchAdminUniversitaires();
          fetchUtilisateurs();
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
  const filteredAdmins = adminUniversitaires.filter((admin) =>
    admin.poste?.toLowerCase().includes(searchValue?.toLowerCase() || "")
  );
  return (
    <div className="adminuniversitaires-container">
      <h1>Gestion des Administrateurs Universitaires</h1>

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
        placeholder="Rechercher par poste"
        value={searchValue}
        onChange={handleSearch}
        className="search-bar"
      />

<form
  onSubmit={(e) => {
    e.preventDefault();
    handleSubmit();
  }}
  className="adminuniversitaires-form"
>
  {isEditMode ? (
    <div className="edit-mode-display">
      <p>
        <strong>Établissement :</strong>{" "}
        {etablissements.find((etab) => etab.idEtablissement === formData.idEtablissement)?.nomEtablissement || "Non spécifié"}
      </p>
    </div>
  ) : (
    <>
      <select
        name="idEtablissement"
        value={formData.idEtablissement}
        onChange={handleChange}
        required
      >
        <option value="">Sélectionnez un établissement</option>
        {etablissements.length > 0 ? (
          etablissements.map((etablissement) => (
            <option key={etablissement.idEtablissement} value={etablissement.idEtablissement}>
              {etablissement.nomEtablissement}
            </option>
          ))
        ) : (
          <option disabled>Aucun établissement disponible</option>
        )}
      </select>

      <select
        name="idUtilisateur"
        value={formData.idUtilisateur}
        onChange={handleChange}
        required
      >
        <option value="">Sélectionnez un utilisateur</option>
        {utilisateurs.length > 0 ? (
          utilisateurs.map((user) => (
            <option key={user.idUtilisateur} value={user.idUtilisateur}>
              {user.nomUtilisateur} {user.prenomUtilisateur}
            </option>
          ))
        ) : (
          <option disabled>Aucun utilisateur disponible</option>
        )}
      </select>
    </>
  )}

  <input
    type="text"
    name="poste"
    value={formData.poste}
    onChange={handleChange}
    placeholder="Poste"
    required
  />
  <button type="submit">
    {isEditMode ? "Modifier" : <span>➕</span>}
  </button>
</form>


      <table className="adminuniversitaires-table">
        <thead>
          <tr>
            <th>Établissement</th>
            <th>Adresse Etab</th>
            <th>Contact</th>
            <th>Localisation</th>
            <th>nom</th>
            <th>Prénom </th>
            <th>Email</th>
            <th>Poste</th>
            <th>Actions</th>
          </tr>
        </thead>
                    <tbody>
              {filteredAdmins.map((admin) => (
                <tr key={admin.idAdminUniversitaire}>
                  <td>{admin.nomEtablissement || "Non défini"}</td>
                  <td>{admin.adresseEtablissement || "Non défini"}</td>
                  <td>{admin.contactEtablissement || "Non défini"}</td>
                  <td>{admin.localisationEtablissement || "Non défini"}</td>
                  <td>{admin.nomUtilisateur || "Non défini"}</td>
                  <td>{admin.prenomUtilisateur || "Non défini"}</td>
                  <td>{admin.emailUtilisateur || "Non défini"}</td>
                  <td>{admin.poste || "Non défini"}</td>
                  <td>
                    <button onClick={() => handleEdit(admin)}>✏️</button>
                    <button onClick={() => handleDelete(admin.idAdminUniversitaire)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>

      </table>
    </div>
  );
}

export default AdminUniversitaires;