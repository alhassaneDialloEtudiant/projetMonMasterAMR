import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/PageConnexion.css";
import { useNavigate } from "react-router-dom";

function PageConnexion() {
  const [vueActuelle, setVueActuelle] = useState("accueil");
  const [roles, setRoles] = useState([]);
  const [roleSelectionne, setRoleSelectionne] = useState("");
  const [questionsReponses, setQuestionsReponses] = useState({
    question1: "",
    question2: "",
    question3: "",
  });
  const [afficherQuestions, setAfficherQuestions] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
  });
  const [connexionData, setConnexionData] = useState({
    email: "",
    motDePasse: "",
  });
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [idUtilisateurReset, setIdUtilisateurReset] = useState(null);

  const apiUrlRoles = "http://localhost:5001/api/utilisateurs/roles";
  const apiUrlInscription = "http://localhost:5001/api/utilisateurs/inscrire";
  const apiUrlConnexion = "http://localhost:5001/api/utilisateurs/connexion";
  const apiUrlRechercheEmail = "http://localhost:5001/api/utilisateurs/recherche-email";
  const apiUrlNouveauMotDePasse = "http://localhost:5001/api/utilisateurs/nouveau-motdepasse";
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(apiUrlRoles);
      setRoles(response.data);
    } catch (error) {
      toast.error("Erreur lors de la récupération des rôles.");
    }
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setRoleSelectionne(role);
    setAfficherQuestions(role === "Etudiant");
    if (role !== "Etudiant") setVueActuelle("creationCompte");
  };

  const handleQuestionChange = (e) => {
    setQuestionsReponses({ ...questionsReponses, [e.target.name]: e.target.value });
  };

  const handleSubmitQuestions = () => {
    const { question1, question2, question3 } = questionsReponses;
    if (question1 && question2 && question3) {
      setVueActuelle("creationCompte");
      setAfficherQuestions(false);
    } else {
      toast.warn("Veuillez répondre à toutes les questions avant de continuer.");
    }
  };

  const handleFormDataChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConnexionDataChange = (e) => {
    setConnexionData({ ...connexionData, [e.target.name]: e.target.value });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiUrlInscription, {
        ...formData,
        role: roleSelectionne,
      });
      if (response.status === 201) {
        toast.success("Inscription réussie !");
        setVueActuelle("accueil");
        setFormData({ nom: "", prenom: "", email: "", motDePasse: "" });
        setRoleSelectionne("");
      }
    } catch (error) {
      toast.error("Une erreur s'est produite lors de l'inscription.");
    }
  };

  const handleSubmitConnexion = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiUrlConnexion, { ...connexionData });
      if (response.status === 200) {
        toast.success("Connexion réussie !");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("idUtilisateur", response.data.idUtilisateur);
        localStorage.setItem("role", response.data.role);

        if (response.data.role === "AdminUniversitaire") {
          localStorage.setItem("idAdminUniversite", response.data.idUtilisateur);
          navigate("/admin-universitaire");
        } else if (response.data.role === "AdminGeneral") {
          localStorage.setItem("idAdminGeneral", response.data.idUtilisateur);
          navigate("/admin-general");
        } else {
          navigate("/connexion-etudiant");
        }
      }
    } catch (error) {
      toast.error("Erreur lors de la connexion.");
    }
  };

  const handleRechercheEmail = async () => {
    try {
      const res = await axios.post(apiUrlRechercheEmail, { email: resetEmail });
      if (res.data.idUtilisateur) {
        setIdUtilisateurReset(res.data.idUtilisateur);
        toast.success("Utilisateur trouvé, veuillez entrer un nouveau mot de passe.");
      } else {
        toast.error("Aucun utilisateur trouvé avec cet email.");
      }
    } catch (error) {
      toast.error("Erreur lors de la vérification de l'email.");
    }
  };

  const handleNouveauMotDePasse = async () => {
    try {
      await axios.put(`${apiUrlNouveauMotDePasse}/${idUtilisateurReset}`, {
        nouveauMotDePasse,
      });
      toast.success("Mot de passe modifié avec succès !");
      setVueActuelle("connexion");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du mot de passe.");
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} />
      {vueActuelle === "accueil" && (
        <div className="choix-container">
          <h1>Bienvenue</h1>
          <p>Veuillez choisir une option :</p>
          <button onClick={() => setVueActuelle("connexion")}>Se connecter</button>
          <button onClick={() => setVueActuelle("inscription")}>S'inscrire</button>
          <button onClick={() => setResetPasswordMode(true)}>Mot de passe oublié ?</button>
        </div>
      )}

      {vueActuelle === "connexion" && (
        <div className="connexion-form-container">
          <h1>Connexion</h1>
          <form onSubmit={handleSubmitConnexion}>
            <label>Email</label>
            <input type="email" name="email" value={connexionData.email} onChange={handleConnexionDataChange} required />
            <label>Mot de passe</label>
            <input type="password" name="motDePasse" value={connexionData.motDePasse} onChange={handleConnexionDataChange} required />
            <button type="submit">Se connecter</button>
          </form>
          <button onClick={() => setVueActuelle("accueil")}>Retour</button>
        </div>
      )}

      {vueActuelle === "inscription" && (
        <div className="inscription-container">
          <h1>Inscription</h1>
          <label>Choisissez votre rôle</label>
          <select value={roleSelectionne} onChange={handleRoleChange}>
            <option value="">Sélectionnez un rôle</option>
            {roles
              .filter(role => role.nomRole !== "AdminUniversitaire" && role.nomRole !== "AdminGeneral")
              .map((role, index) => (
                <option key={index} value={role.nomRole}>
                  {role.nomRole}
                </option>
              ))}
          </select>

          {afficherQuestions && (
            <div className="questions-container">
              <h2>Répondez aux questions suivantes</h2>
              <div>
                <label>Êtes-vous concerné par la plateforme ?</label>
                <div>
                  <input type="radio" name="question1" value="Oui" onChange={handleQuestionChange} /> Oui
                  <input type="radio" name="question1" value="Non" onChange={handleQuestionChange} /> Non
                </div>
              </div>
              <div>
                <label>Avez-vous lu et accepté les conditions ?</label>
                <div>
                  <input type="radio" name="question2" value="Oui" onChange={handleQuestionChange} /> Oui
                  <input type="radio" name="question2" value="Non" onChange={handleQuestionChange} /> Non
                </div>
              </div>
              <div>
                <label>Êtes-vous titulaire d'un diplôme de licence ?</label>
                <div>
                  <input type="radio" name="question3" value="Oui" onChange={handleQuestionChange} /> Oui
                  <input type="radio" name="question3" value="Non" onChange={handleQuestionChange} /> Non
                </div>
              </div>
              <button onClick={handleSubmitQuestions}>Valider les réponses</button>
            </div>
          )}
          <button onClick={() => setVueActuelle("accueil")}>Retour</button>
        </div>
      )}

      {vueActuelle === "creationCompte" && (
        <div className="creation-compte-container">
          <h1>Création de compte</h1>
          <form onSubmit={handleSubmitForm}>
            <label>Nom</label>
            <input type="text" name="nom" value={formData.nom} onChange={handleFormDataChange} required />
            <label>Prénom</label>
            <input type="text" name="prenom" value={formData.prenom} onChange={handleFormDataChange} required />
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleFormDataChange} required />
            <label>Mot de passe</label>
            <input type="password" name="motDePasse" value={formData.motDePasse} onChange={handleFormDataChange} required />
            <button type="submit">Créer le compte</button>
          </form>
          <button onClick={() => setVueActuelle("accueil")}>Retour</button>
        </div>
      )}

      {resetPasswordMode && (
        <div className="reset-password-container">
          <h1>Réinitialisation du mot de passe</h1>
          {!idUtilisateurReset ? (
            <>
              <label>Email</label>
              <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="Entrez votre email" />
              <button onClick={handleRechercheEmail}>Vérifier</button>
              <button onClick={() => setResetPasswordMode(false)}>Retour</button>
            </>
          ) : (
            <>
              <label>Nouveau mot de passe</label>
              <input type="password" value={nouveauMotDePasse} onChange={(e) => setNouveauMotDePasse(e.target.value)} placeholder="Nouveau mot de passe" />
              <button onClick={handleNouveauMotDePasse}>Mettre à jour</button>
              <button onClick={() => setResetPasswordMode(false)}>Annuler</button>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default PageConnexion;
