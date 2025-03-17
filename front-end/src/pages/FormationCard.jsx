import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaStar, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/FormationCard.css";
import CandidatureForm from "./CandidatureForm";

const FormationCard = ({ formation }) => {
  const [favoris, setFavoris] = useState([]);
  const [afficherForm, setAfficherForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFavoris(JSON.parse(localStorage.getItem("favoris")) || []);
  }, []);

  const utilisateurConnecte = JSON.parse(localStorage.getItem("utilisateur"));
  const idUtilisateur = utilisateurConnecte?.idUtilisateur;

  const estDansFavoris = favoris.some(
    (fav) => fav.idFormation === formation.idFormation
  );

  const postuler = () => {
    if (!idUtilisateur) {
      localStorage.setItem("formationSelectionnee", JSON.stringify(formation));
      alert("Vous devez être connecté pour candidater !");
      navigate("/connexion");
    } else {
      setAfficherForm(true);
    }
  };

  const ajouterRetirerFavoris = () => {
    let newFavoris;
    if (estDansFavoris) {
      newFavoris = favoris.filter(fav => fav.idFormation !== formation.idFormation);
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

        <button className="btn-candidater" onClick={postuler}>
          <FaCheck /> Candidater
        </button>
      </div>

      {afficherForm && idUtilisateur && (
        <CandidatureForm
          idFormation={formation.idFormation}
          idUtilisateur={idUtilisateur}
          fermerFormulaire={() => setAfficherForm(false)}
        />
      )}
    </div>
  );
};

export default FormationCard;
