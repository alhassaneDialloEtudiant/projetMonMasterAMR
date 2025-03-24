import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/EtudiantsParFormation.css";

const EtudiantsParFormation = ({ idAdminUniversite }) => {
  const [universites, setUniversites] = useState([]);
  const [formations, setFormations] = useState([]);
  const [selectedUniversite, setSelectedUniversite] = useState("");
  const [selectedFormation, setSelectedFormation] = useState("");
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [acceptes, setAcceptes] = useState(0);
  const [refuses, setRefuses] = useState(0);

  // ✅ Récupérer les universités associées à l'admin
  useEffect(() => {
    const fetchUniversites = async () => {
      try {
        console.log("🔍 Récupération des universités pour l'admin :", idAdminUniversite);
        const response = await axios.get(
          `http://localhost:5001/api/candidatures/admin-universites/${idAdminUniversite}`
        );
        setUniversites(response.data);
        setError(null);
      } catch (err) {
        console.error("❌ Erreur lors de la récupération des universités :", err);
        setError("Impossible de charger les universités.");
      }
    };

    if (idAdminUniversite) {
      fetchUniversites();
    }
  }, [idAdminUniversite]);

  // ✅ Récupérer les formations selon l'université sélectionnée
  useEffect(() => {
    const fetchFormations = async () => {
      if (!selectedUniversite) return;

      try {
        console.log("🔍 Récupération des formations pour l'université :", selectedUniversite);
        const encodedUniversite = encodeURIComponent(selectedUniversite.trim());
        const response = await axios.get(
          `http://localhost:5001/api/formations/universite/${encodedUniversite}`
        );
        setFormations(response.data);
        setError(null);
      } catch (err) {
        console.error("❌ Erreur lors de la récupération des formations :", err);
        setError("Impossible de charger les formations.");
        setFormations([]);
      }
    };

    fetchFormations();
  }, [selectedUniversite]);

  // ✅ Récupérer les étudiants ayant candidaté à la formation sélectionnée
  useEffect(() => {
    const fetchEtudiants = async () => {
      if (!selectedFormation) return;
  
      setLoading(true);
      try {
        console.log("🔍 Récupération des étudiants pour la formation :", selectedFormation);
        const response = await axios.get(
          `http://localhost:5001/api/candidatures/formation/${selectedFormation}`
        );
        setEtudiants(response.data);
        setError(null);
        
        // Mise à jour des compteurs acceptés et refusés
        const nbAcceptes = response.data.filter(etudiant => etudiant.statut.toLowerCase() === "acceptée").length;
        const nbRefuses = response.data.filter(etudiant => etudiant.statut.toLowerCase() === "refusée").length;
        setAcceptes(nbAcceptes);
        setRefuses(nbRefuses);
      } catch (err) {
        console.error("❌ Erreur lors du chargement des étudiants :", err);
        setError("Aucun étudiant trouvé pour cette formation.");
        setEtudiants([]);
        setAcceptes(0);
        setRefuses(0);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEtudiants();
  }, [selectedFormation]);  

  return (
    <div className="etudiants-container">
      <h2>🎓 Liste des Étudiants par Formation</h2>

      <div className="selectors-container">
        {/* ✅ Sélecteur d'université */}
        <div className="selector-container">
          <label>📍 Sélectionner une université :</label>
          <select
            value={selectedUniversite}
            onChange={(e) => setSelectedUniversite(e.target.value)}
          >
            <option value="">-- Choisissez une université --</option>
            {universites.map((uni) => (
              <option key={uni.universite} value={uni.universite}>
                {uni.universite}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Sélecteur de formation */}
        <div className="selector-container">
          <label>📚 Sélectionner une formation :</label>
          <select
            value={selectedFormation}
            onChange={(e) => setSelectedFormation(e.target.value)}
          >
            <option value="">-- Choisissez une formation --</option>
            {formations.length > 0 ? (
              formations.map((formation) => (
                <option key={formation.idFormation} value={formation.idFormation}>
                  {formation.nomFormation}
                </option>
              ))
            ) : (
              <option disabled>Aucune formation trouvée</option>
            )}
          </select>
        </div>
      </div>

      {/* ✅ Boutons de comptage des statuts */}
      <div className="statuts-container">
        <p>Acceptés : {acceptes}</p>
        <p>Refusés : {refuses}</p>
      </div>

      {/* ✅ Tableau des étudiants avec leur statut */}
      {loading && <p className="loading">Chargement des étudiants...</p>}
      {error && <p className="error">{error}</p>}

      {etudiants.length > 0 && (
        <table className="etudiants-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {etudiants.map((etudiant) => (
              <tr key={etudiant.idEtudiant}>
                <td>{etudiant.nomUtilisateur}</td>
                <td>{etudiant.prenomUtilisateur}</td>
                <td>{etudiant.emailUtilisateur}</td>
                <td className={`status ${etudiant.statut.toLowerCase()}`}>{etudiant.statut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {etudiants.length === 0 && selectedFormation && !loading && (
        <p className="no-results">Aucun étudiant trouvé pour cette formation.</p>
      )}
    </div>
  );  
};

export default EtudiantsParFormation;
