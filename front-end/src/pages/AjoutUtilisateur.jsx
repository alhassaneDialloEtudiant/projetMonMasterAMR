import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function AjoutUtilisateur({ onUtilisateurAjoute }) {
  const [roles, setRoles] = useState([]);
  const formInitial = {
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    role: "",
  };
  const [formData, setFormData] = useState(formInitial);
  const [resetKey, setResetKey] = useState(0); // Pour forcer le reset du formulaire

  useEffect(() => {
    axios.get("http://localhost:5001/api/utilisateurs/roles")
      .then(res => setRoles(res.data))
      .catch(() => toast.error("Erreur lors du chargement des rôles"));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/utilisateurs/inscrire", formData);
      toast.success("Utilisateur ajouté !");
      setFormData(formInitial);     // Reset les valeurs
      setResetKey(prev => prev + 1); // Force la reconstruction du form
      if (onUtilisateurAjoute) onUtilisateurAjoute();
    } catch {
      toast.error("Échec de la création d'utilisateur");
    }
  };

  return (
    <form key={resetKey} onSubmit={handleSubmit} className="ajout-utilisateur-form">
      <h3>Ajouter un utilisateur</h3>
      <input
        type="text"
        name="nom"
        placeholder="Nom"
        value={formData.nom}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="prenom"
        placeholder="Prénom"
        value={formData.prenom}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="motDePasse"
        placeholder="Mot de passe"
        value={formData.motDePasse}
        onChange={handleChange}
        required
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        required
      >
        <option value="">Choisir un rôle</option>
        {roles.map((r, idx) => (
          <option key={idx} value={r.nomRole}>{r.nomRole}</option>
        ))}
      </select>
      <button type="submit">Créer</button>
    </form>
  );
}

export default AjoutUtilisateur;
