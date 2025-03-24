import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/FormationsAdmin.css";

const FormationsAdminUniversite = ({ idAdminUniversite }) => {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingFormation, setEditingFormation] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/formations/${idAdminUniversite}`
        );
        setFormations(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des formations");
      } finally {
        setLoading(false);
      }
    };

    if (idAdminUniversite) {
      fetchFormations();
    }
  }, [idAdminUniversite]);

  /** ✅ SUPPRIMER UNE FORMATION */
  const handleDelete = async (idFormation) => {
    if (!idAdminUniversite) {
      alert("Erreur : ID Admin Universitaire manquant !");
      return;
    }

    if (window.confirm("Voulez-vous vraiment supprimer cette formation ?")) {
      try {
        const response = await axios.delete(
          `http://localhost:5001/api/formations/supprimer/${idFormation}/${idAdminUniversite}`
        );

        if (response.status === 200) {
          alert("✅ Formation supprimée !");
          setFormations((prev) =>
            prev.filter((formation) => formation.idFormation !== idFormation)
          );
        }
      } catch (error) {
        alert("❌ Erreur lors de la suppression !");
        console.error("Erreur suppression :", error);
      }
    }
  };

  /** ✅ MODIFIER UNE FORMATION */
  const handleEditClick = (formation) => {
    setEditingFormation(formation.idFormation);
    setEditFormData({ ...formation });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!idAdminUniversite) {
      alert("Erreur : ID Admin Universitaire manquant !");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5001/api/formations/modifier/${editingFormation}`,
        { ...editFormData, idAdminUniversite }
      );

      if (response.status === 200) {
        alert("✅ Formation mise à jour !");
        setFormations((prev) =>
          prev.map((f) =>
            f.idFormation === editingFormation ? { ...f, ...editFormData } : f
          )
        );
        setEditingFormation(null);
      }
    } catch (error) {
      alert("❌ Erreur lors de la modification !");
      console.error("Erreur modification :", error);
    }
  };

  if (loading) return <p className="loading">Chargement des formations...</p>;
  if (error) return <p className="error">{error}</p>;
  if (formations.length === 0) return <p className="no-results">Aucune formation trouvée.</p>;

  return (
    <div className="formations-admin-container">
      <h2>🎓 Mes formations</h2>
      <div className="formations-list">
        {formations.map((formation) => (
          <div key={formation.idFormation} className="formation-card">
            <img
              src={formation.logo ? `http://localhost:5001/uploads/formations/${formation.logo}` : "/images/default-logo.png"}
              alt={formation.nomFormation}
              className="formation-logo"
            />
            {editingFormation === formation.idFormation ? (
              <form onSubmit={handleEditSubmit} className="edit-form">
                <input type="text" name="nomFormation" value={editFormData.nomFormation} onChange={handleEditChange} required />
                <select name="typeFormation" value={editFormData.typeFormation} onChange={handleEditChange} required>
                  <option value="Formation initiale">Formation initiale</option>
                  <option value="Alternance">Alternance</option>
                  <option value="Continue">Continue</option>
                </select>
                <input type="text" name="localisation" value={editFormData.localisation} onChange={handleEditChange} required />
                <input type="number" name="capacite" value={editFormData.capacite} onChange={handleEditChange} required />
                <input type="number" name="tauxAcces" value={editFormData.tauxAcces} onChange={handleEditChange} required />
                <button type="submit">✅ Enregistrer</button>
                <button type="button" onClick={() => setEditingFormation(null)}>❌ Annuler</button>
              </form>
            ) : (
              <>
                <h3>{formation.nomFormation}</h3>
                <p><strong>Université :</strong> {formation.universite}</p>
                <p><strong>Type :</strong> {formation.typeFormation}</p>
                <p><strong>Localisation :</strong> {formation.localisation}</p>
                <p><strong>Capacité :</strong> {formation.capacite} étudiants</p>
                <p><strong>Taux d'accès :</strong> {formation.tauxAcces}%</p>
                <button className="edit-btn" onClick={() => handleEditClick(formation)}>✏️ Modifier</button>
                <button className="delete-btn" onClick={() => handleDelete(formation.idFormation)}>🗑 Supprimer</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormationsAdminUniversite;
