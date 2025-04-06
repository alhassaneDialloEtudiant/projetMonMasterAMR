import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPasswordForm = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [idUtilisateur, setIdUtilisateur] = useState(null);
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/utilisateurs/reset-password", { email });
      setIdUtilisateur(res.data.idUtilisateur);
      setStep(2);
      toast.success("Email reconnu. Veuillez définir un nouveau mot de passe.");
    } catch (err) {
      toast.error("Email non reconnu.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (nouveauMotDePasse !== confirmation) {
      return toast.error("Les mots de passe ne correspondent pas.");
    }
    try {
      await axios.put(`http://localhost:5001/api/utilisateurs/nouveau-motdepasse/${idUtilisateur}`, {
        nouveauMotDePasse,
      });
      toast.success("Mot de passe mis à jour avec succès !");
      setStep(1);
      setEmail("");
      setNouveauMotDePasse("");
      setConfirmation("");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du mot de passe.");
    }
  };

  return (
    <div className="reset-password-container">
      <ToastContainer />
      {step === 1 && (
        <form onSubmit={handleCheckEmail}>
          <h2>🔐 Réinitialiser votre mot de passe</h2>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Valider l'email</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleChangePassword}>
          <h2>🔁 Nouveau mot de passe</h2>
          <label>Nouveau mot de passe</label>
          <input
            type="password"
            value={nouveauMotDePasse}
            onChange={(e) => setNouveauMotDePasse(e.target.value)}
            required
          />
          <label>Confirmer le mot de passe</label>
          <input
            type="password"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            required
          />
          <button type="submit">Changer le mot de passe</button>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordForm;
