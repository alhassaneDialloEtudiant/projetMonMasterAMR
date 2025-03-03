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

  const apiUrlRoles = "http://localhost:5001/api/utilisateurs/roles";
  const apiUrlInscription = "http://localhost:5001/api/utilisateurs/inscrire";
  const apiUrlConnexion = "http://localhost:5001/api/utilisateurs/connexion";
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
      console.error("Erreur lors de la récupération des rôles :", error);
    }
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setRoleSelectionne(role);
    if (role === "Etudiant") {
      setAfficherQuestions(true);
    } else {
      setAfficherQuestions(false);
      setVueActuelle("creationCompte");
    }
  };

  const handleQuestionChange = (e) => {
    setQuestionsReponses({
      ...questionsReponses,
      [e.target.name]: e.target.value,
    });
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleConnexionDataChange = (e) => {
    setConnexionData({
      ...connexionData,
      [e.target.name]: e.target.value,
    });
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
      console.error("Erreur lors de l'inscription :", error);
    }
  };

  const handleSubmitConnexion = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiUrlConnexion, {
        ...connexionData,
      });

      if (response.status === 200) {
        toast.success("Connexion réussie !");
        localStorage.setItem("token", response.data.token);
        navigate("/connexion-etudiant");
      } else {
        toast.error("Erreur lors de la connexion.");
      }
    } catch (error) {
      toast.error("Une erreur s'est produite lors de la connexion.");
      console.error("Erreur lors de la connexion :", error);
    }
  };

  return (
    <div className="connexion-container">
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {vueActuelle === "accueil" && (
        <div className="choix-container">
          <h1>Bienvenue</h1>
          <p>Veuillez choisir une option :</p>
          <button onClick={() => setVueActuelle("connexion")}>Se connecter</button>
          <button onClick={() => setVueActuelle("inscription")}>S'inscrire</button>
        </div>
      )}

      {vueActuelle === "connexion" && (
        <div className="connexion-form-container">
          <h1>Connexion</h1>
          <form onSubmit={handleSubmitConnexion}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={connexionData.email}
              onChange={handleConnexionDataChange}
              placeholder="Entrez votre email"
              required
            />
            <label>Mot de passe</label>
            <input
              type="password"
              name="motDePasse"
              value={connexionData.motDePasse}
              onChange={handleConnexionDataChange}
              placeholder="Entrez votre mot de passe"
              required
            />
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
            {roles.map((role, index) => (
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
                  <input
                    type="radio"
                    name="question1"
                    value="Oui"
                    onChange={handleQuestionChange}
                  />
                  Oui
                  <input
                    type="radio"
                    name="question1"
                    value="Non"
                    onChange={handleQuestionChange}
                  />
                  Non
                </div>
              </div>
              <div>
                <label>Avez-vous lu et accepté les conditions ?</label>
                <div>
                  <input
                    type="radio"
                    name="question2"
                    value="Oui"
                    onChange={handleQuestionChange}
                  />
                  Oui
                  <input
                    type="radio"
                    name="question2"
                    value="Non"
                    onChange={handleQuestionChange}
                  />
                  Non
                </div>
              </div>
              <div>
                <label>Êtes-vous titulaire d'un diplôme de licence ?</label>
                <div>
                  <input
                    type="radio"
                    name="question3"
                    value="Oui"
                    onChange={handleQuestionChange}
                  />
                  Oui
                  <input
                    type="radio"
                    name="question3"
                    value="Non"
                    onChange={handleQuestionChange}
                  />
                  Non
                </div>
              </div>
              <button onClick={handleSubmitQuestions}>
                Valider les réponses
              </button>
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
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleFormDataChange}
              placeholder="Entrez votre nom"
              required
            />
            <label>Prénom</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleFormDataChange}
              placeholder="Entrez votre prénom"
              required
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormDataChange}
              placeholder="Entrez votre email"
              required
            />
            <label>Mot de passe</label>
            <input
              type="password"
              name="motDePasse"
              value={formData.motDePasse}
              onChange={handleFormDataChange}
              placeholder="Entrez votre mot de passe"
              required
            />
            <button type="submit">Créer le compte</button>
          </form>
          <button onClick={() => setVueActuelle("accueil")}>Retour</button>
        </div>
      )}
    </div>
  );
}

export default PageConnexion;