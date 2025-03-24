import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaStar, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/FormationCard.css";
import CandidatureForm from "./CandidatureForm";
import axios from "axios";

const FormationCard = ({ formation }) => {
  const [favoris, setFavoris] = useState([]);
  const [afficherForm, setAfficherForm] = useState(false);
  const [utilisateurConnecte, setUtilisateurConnecte] = useState(null);
  const [candidatureExistante, setCandidatureExistante] = useState(false);
  const navigate = useNavigate();

  // ✅ Récupération de l'utilisateur une seule fois au chargement
  useEffect(() => {
    try {
      const utilisateurStorage = localStorage.getItem("idUtilisateur");
      if (utilisateurStorage && utilisateurStorage !== "undefined") {
        setUtilisateurConnecte(utilisateurStorage);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la récupération de l'utilisateur :", error);
    }
  }, []);

  // ✅ Vérifier si l'utilisateur a déjà candidaté à cette formation
  useEffect(() => {
    if (!utilisateurConnecte) return;

    const verifierCandidature = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/candidatures/utilisateur/${utilisateurConnecte}`
        );

        const candidatures = response.data;
        const dejaCandidate = candidatures.some(
          (candidature) => candidature.idFormation === formation.idFormation
        );

        setCandidatureExistante(dejaCandidate);
      } catch (error) {
        console.error("❌ Erreur lors de la vérification des candidatures :", error);
      }
    };

    verifierCandidature();
  }, [utilisateurConnecte]);

  // ✅ Chargement des favoris depuis le stockage local
  useEffect(() => {
    try {
      const favorisStockes = localStorage.getItem("favoris");
      setFavoris(favorisStockes ? JSON.parse(favorisStockes) : []);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des favoris :", error);
      setFavoris([]);
    }
  }, []);

  const estDansFavoris = favoris.some((fav) => fav.idFormation === formation.idFormation);

  // ✅ Gérer la candidature (connexion requise)
  const postuler = () => {
    if (!utilisateurConnecte) {
      alert("⚠️ Vous devez être connecté pour candidater !");
      localStorage.setItem("formationSelectionnee", JSON.stringify(formation));
      navigate("/connexion-etudiant"); // 🔄 Redirection vers la connexion
      return;
    }

    if (candidatureExistante) {
      alert("⚠️ Vous avez déjà candidaté à cette formation !");
      return;
    }

    // ✅ Si connecté et pas encore candidaté, ouvrir le formulaire
    setAfficherForm(true);
  };

  // ✅ Ajout/retrait des favoris
  const ajouterRetirerFavoris = () => {
    let newFavoris;
    if (estDansFavoris) {
      newFavoris = favoris.filter((fav) => fav.idFormation !== formation.idFormation);
    } else {
      newFavoris = [...favoris, formation];
    }
    setFavoris(newFavoris);
    localStorage.setItem("favoris", JSON.stringify(newFavoris));
  };

  return (
    <div className="formation-card">
      {formation.logo && (
        <img
          src={`http://localhost:5001/uploads/formations/${formation.logo}`}
          alt={formation.nomFormation}
          className="formation-logo"
        />
      )}

      <h3 className="formation-universite">{formation.universite}</h3>
      <h2 className="formation-titre">{formation.nomFormation}</h2>

      <div className="formation-type">
        <span>{formation.typeFormation}</span>
      </div>

      <div className="formation-infos">
        <p className="formation-capacite">
          CAPACITÉ D’ACCUEIL : {formation.capacite} ÉTUDIANT(S)
        </p>
        <p className="formation-taux">TAUX D’ACCÈS : {formation.tauxAcces} %</p>
      </div>

      <div className="formation-localisation">
        <FaMapMarkerAlt /> {formation.localisation}
      </div>

      <div className="formation-actions">
        <button className="btn-primary">En savoir plus</button>

        <button
          className={`btn-secondary ${estDansFavoris ? "active" : ""}`}
          onClick={ajouterRetirerFavoris}
        >
          <FaStar /> {estDansFavoris ? "Retirer des favoris" : "Ajouter aux favoris"}
        </button>

        <button
          className="btn-candidater"
          onClick={postuler}
          disabled={candidatureExistante}
        >
          <FaCheck /> {candidatureExistante ? "Déjà candidaté" : "Candidater"}
        </button>
      </div>

      {/* ✅ Affichage du formulaire uniquement si l'utilisateur est connecté */}
      {afficherForm && utilisateurConnecte && (
        <CandidatureForm
          idFormation={formation.idFormation}
          idUtilisateur={utilisateurConnecte}
          fermerFormulaire={() => setAfficherForm(false)}
        />
      )}
    </div>
  );
};

export default FormationCard;
