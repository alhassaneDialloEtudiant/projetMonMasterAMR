import React, { useState } from "react";
import "../styles/Authentication.css";

function Authentication() {
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    additionalInfo: "",
  });

  const roles = [
    { value: "Admin", label: "Administrateur" },
    { value: "Etudiant", label: "Étudiant" },
    { value: "Professeur", label: "Professeur" },
  ];

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    setFormData({
      username: "",
      email: "",
      password: "",
      additionalInfo: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulaire soumis :", { role: selectedRole, ...formData });
    // Ajouter la logique pour envoyer les données au backend
    alert(`Inscription réussie en tant que ${selectedRole}`);
  };

  return (
    <div className="authentication-container">
      <h1>Connexion et Inscription</h1>
      <div className="role-selection">
        <label htmlFor="role">Sélectionnez votre rôle :</label>
        <select
          id="role"
          value={selectedRole}
          onChange={handleRoleChange}
          required
        >
          <option value="">-- Choisir un rôle --</option>
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </div>

      {selectedRole && (
        <form className="registration-form" onSubmit={handleSubmit}>
          <h2>Inscription en tant que {selectedRole}</h2>

          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur :</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe :</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Champ supplémentaire basé sur le rôle */}
          {selectedRole === "Etudiant" && (
            <div className="form-group">
              <label htmlFor="additionalInfo">Niveau d'étude :</label>
              <input
                type="text"
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Ex : Licence 3"
              />
            </div>
          )}

          {selectedRole === "Professeur" && (
            <div className="form-group">
              <label htmlFor="additionalInfo">Matière enseignée :</label>
              <input
                type="text"
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Ex : Mathématiques"
              />
            </div>
          )}

          <button type="submit" className="submit-button">
            S'inscrire
          </button>
        </form>
      )}
    </div>
  );
}

export default Authentication;
