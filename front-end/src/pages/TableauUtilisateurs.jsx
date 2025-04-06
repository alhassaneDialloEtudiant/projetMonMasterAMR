import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/TableauUtilisateurs.css";

function TableauUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    emailUtilisateur: "",
    nomUtilisateur: "",
    prenomUtilisateur: "",
    roleUtilisateur: "",
  });

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const fetchUtilisateurs = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/utilisateurs");
      setUtilisateurs(res.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des utilisateurs.");
    }
  };

  const handleDelete = (id) => {
    setUserToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/utilisateurs/supprimer/${userToDelete}`);
      toast.success("Utilisateur supprimé !");
      fetchUtilisateurs();
    } catch (error) {
      toast.error("Erreur lors de la suppression.");
    } finally {
      setShowModal(false);
      setUserToDelete(null);
    }
  };

  const handleEditClick = (utilisateur) => {
    setEditingUserId(utilisateur.idUtilisateur);
    setFormData({
      emailUtilisateur: utilisateur.emailUtilisateur,
      nomUtilisateur: utilisateur.nomUtilisateur,
      prenomUtilisateur: utilisateur.prenomUtilisateur,
      roleUtilisateur: utilisateur.roleUtilisateur,
    });
  };

  const handleUpdate = async () => {
    const { emailUtilisateur, nomUtilisateur, prenomUtilisateur, roleUtilisateur } = formData;
    if (!emailUtilisateur || !nomUtilisateur || !prenomUtilisateur || !roleUtilisateur) {
      return toast.warn("Tous les champs sont requis pour la modification.");
    }

    try {
      await axios.put(`http://localhost:5001/api/utilisateurs/modifier/${editingUserId}`, formData);
      toast.success("Utilisateur modifié avec succès !");
      fetchUtilisateurs();
      setEditingUserId(null);
    } catch (error) {
      toast.error("Erreur lors de la modification.");
    }
  };

  const utilisateursFiltres = utilisateurs.filter((u) =>
    u.emailUtilisateur?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="tableau-utilisateurs">
      <h2>Liste des utilisateurs</h2>

      <input
        type="text"
        placeholder="Rechercher par email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <table className="table-style">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {utilisateursFiltres.map((u) => (
            <tr key={u.idUtilisateur}>
              <td>{u.idUtilisateur}</td>
              <td>
                {editingUserId === u.idUtilisateur ? (
                  <input
                    type="text"
                    value={formData.nomUtilisateur}
                    onChange={(e) => setFormData({ ...formData, nomUtilisateur: e.target.value })}
                  />
                ) : (
                  u.nomUtilisateur
                )}
              </td>
              <td>
                {editingUserId === u.idUtilisateur ? (
                  <input
                    type="text"
                    value={formData.prenomUtilisateur}
                    onChange={(e) => setFormData({ ...formData, prenomUtilisateur: e.target.value })}
                  />
                ) : (
                  u.prenomUtilisateur
                )}
              </td>
              <td>
                {editingUserId === u.idUtilisateur ? (
                  <input
                    type="email"
                    value={formData.emailUtilisateur}
                    onChange={(e) => setFormData({ ...formData, emailUtilisateur: e.target.value })}
                  />
                ) : (
                  u.emailUtilisateur
                )}
              </td>
              <td>
                {editingUserId === u.idUtilisateur ? (
                  <select
                    value={formData.roleUtilisateur}
                    onChange={(e) => setFormData({ ...formData, roleUtilisateur: e.target.value })}
                  >
                    <option value="Etudiant">Etudiant</option>
                    <option value="AdminUniversitaire">AdminUniversitaire</option>
                    <option value="AdminGeneral">AdminGeneral</option>
                  </select>
                ) : (
                  u.roleUtilisateur
                )}
              </td>
              <td>
                {editingUserId === u.idUtilisateur ? (
                  <button className="btn-edit" onClick={handleUpdate}>Enregistrer</button>
                ) : (
                  <button className="btn-edit" onClick={() => handleEditClick(u)}>Modifier</button>
                )}
                <button className="btn-delete" onClick={() => handleDelete(u.idUtilisateur)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmation</h3>
            <p>Voulez-vous vraiment supprimer cet utilisateur ?</p>
            <div className="modal-buttons">
              <button className="btn-delete" onClick={confirmDelete}>Confirmer</button>
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableauUtilisateurs;
