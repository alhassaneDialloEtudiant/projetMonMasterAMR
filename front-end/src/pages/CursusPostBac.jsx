import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CursusPostBac.css";

const CursusPostBac = () => {
  const idUtilisateur = localStorage.getItem("idUtilisateur");
  const [cursusList, setCursusList] = useState([]);
  const [formData, setFormData] = useState({
    anneeUniversitaire: "",
    diplomeFrancais: "Non",
    niveauDiplome: "",
  });

  useEffect(() => {
    fetchCursus();
  }, []);

  // 📌 Récupérer la liste des cursus enregistrés
  const fetchCursus = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/cursusPostBac/${idUtilisateur}`);
      setCursusList(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des cursus post-bac :", error);
    }
  };

  // 📌 Gestion du changement des champs
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📌 Enregistrement des données
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/cursusPostBac/enregistrer", {
        idUtilisateur,
        ...formData,
      });

      setFormData({ anneeUniversitaire: "", diplomeFrancais: "Non", niveauDiplome: "" });
      fetchCursus();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    }
  };

  return (
    <div>
      <h2>Mon cursus post-baccalauréat</h2>
      <p>Ajoutez et visualisez vos années de cursus post-bac.</p>

      <form onSubmit={handleSubmit}>
        <label>Année universitaire *</label>
        <input type="text" name="anneeUniversitaire" value={formData.anneeUniversitaire} onChange={handleInputChange} required />

        <label>S'agit-il d'un diplôme français ? *</label>
        <div>
          <label><input type="radio" name="diplomeFrancais" value="Oui" checked={formData.diplomeFrancais === "Oui"} onChange={handleInputChange} /> Oui</label>
          <label><input type="radio" name="diplomeFrancais" value="Non" checked={formData.diplomeFrancais === "Non"} onChange={handleInputChange} /> Non</label>
        </div>

        <label>Niveau du diplôme *</label>
        <select name="niveauDiplome" value={formData.niveauDiplome} onChange={handleInputChange} required>
          <option value="">Sélectionnez...</option>
          <option value="Bac+1">Bac+1</option>
          <option value="Bac+2">Bac+2</option>
          <option value="Licence 3">Licence 3</option>
          <option value="Master">Master</option>
        </select>

        <button type="submit">Enregistrer</button>
      </form>

      <h3>Années enregistrées</h3>
      <ul>
        {cursusList.map((cursus) => (
          <li key={cursus.cursusId}>
            {cursus.anneeUniversitaire} - {cursus.niveauDiplome}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CursusPostBac;
