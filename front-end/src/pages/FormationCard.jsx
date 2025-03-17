import React, { useState, useEffect } from "react";
import "../styles/FormationCard.css";
import { FaMapMarkerAlt, FaStar, FaCheck } from "react-icons/fa";
import CandidatureForm from "./CandidatureForm";
import { useNavigate } from "react-router-dom";

const FormationCard = ({ formation }) => {
  const [favoris, setFavoris] = useState([]);
  const [candidatures, setCandidatures] = useState([]);
  const [showCandidatureForm, setShowCandidatureForm] = useState(false);
  const navigate = useNavigate();

  // ✅ Récupérer l'utilisateur connecté
  const utilisateurConnecte = JSON.parse(localStorage.getItem("utilisateur"));
  const idUtilisateur = utilisateurConnecte?.idUtilisateur;

  useEffect(() => {
    setFavoris(JSON.parse(localStorage.getItem("favoris")) || []);
    setCandidatures(JSON.parse(localStorage.getItem("candidatures")) || []);
  }, []);

  const estDansFavoris = favoris.some((fav) => fav.idFormation === formation.idFormation);
  const estCandidatee = candidatures.some((cand) => cand.idFormation === formation.idFormation);

  // ✅ Vérifie si l'utilisateur est connecté avant de postuler
  const postuler = () => {
    if (!idUtilisateur) {
      // 📌 Sauvegarde la formation sélectionnée pour la redirection après connexion
      localStorage.setItem("lastFormation", JSON.stringify(formation));

      alert("Vous devez être connecté pour candidater !");
      navigate("/pageConnexion"); // 📌 Redirige vers la page de connexion
      return;
    }

    setShowCandidatureForm(true);
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

        <button className={`btn-secondary ${estDansFavoris ? "active" : ""}`} onClick={() => alert("Ajouté aux favoris")}>
          <FaStar /> {estDansFavoris ? "Retirer des favoris" : "Ajouter aux favoris"}
        </button>

        <button className="btn-candidater" onClick={postuler}>
          <FaCheck /> Candidater
        </button>
      </div>

      {/* 📌 Affiche le formulaire de candidature si l'utilisateur clique sur "Candidater" */}
      {showCandidatureForm && <CandidatureForm idFormation={formation.idFormation} idUtilisateur={idUtilisateur} />}
    </div>
  );
};

export default FormationCard;
