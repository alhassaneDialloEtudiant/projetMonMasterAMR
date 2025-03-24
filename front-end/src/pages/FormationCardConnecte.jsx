import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaStar, FaCheck } from "react-icons/fa";
import "../styles/FormationCard.css";
import CandidatureForm from "./CandidatureForm";
import axios from "axios";
import Modal from "react-modal"; // ✅ Importation de la librairie pour le modale

// Configuration du modale
Modal.setAppElement("#root");

const FormationCardConnecte = ({ formation, utilisateurConnecte, onFavoriUpdate }) => {
  const [favoris, setFavoris] = useState([]);
  const [afficherForm, setAfficherForm] = useState(false);
  const [candidatureExistante, setCandidatureExistante] = useState(false);
  const [modaleOuvert, setModaleOuvert] = useState(false); // ✅ État pour le modale

  // ✅ Vérifier si l'utilisateur a déjà candidaté à cette formation
  useEffect(() => {
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
  }, [utilisateurConnecte, formation.idFormation]);

  // ✅ Chargement des favoris depuis le stockage local
  useEffect(() => {
    try {
      const favorisStockes = JSON.parse(localStorage.getItem("favoris")) || [];
      setFavoris(favorisStockes);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des favoris :", error);
      setFavoris([]);
    }
  }, []);

  // ✅ Vérifier si la formation est dans les favoris
  const estDansFavoris = favoris.some((fav) => fav.idFormation === formation.idFormation);

  // ✅ Gérer la candidature (empêcher les doublons)
  const postuler = () => {
    if (candidatureExistante) {
      setModaleOuvert(true); // ✅ Ouvrir le modale si déjà candidaté
      return;
    }
    setAfficherForm(true);
  };

  // ✅ Ajouter/retirer des favoris sans actualiser la page
  const ajouterRetirerFavoris = () => {
    let newFavoris;
    if (estDansFavoris) {
      newFavoris = favoris.filter((fav) => fav.idFormation !== formation.idFormation);
    } else {
      newFavoris = [...favoris, formation];
    }

    setFavoris(newFavoris);
    localStorage.setItem("favoris", JSON.stringify(newFavoris));

    // ✅ Notifier le parent (`Formations.jsx`) du changement de favoris
    if (onFavoriUpdate) {
      onFavoriUpdate();
    }
  };

  return (
    <div className="formation-card">
      {/* ✅ Affichage du logo avec une image par défaut */}
      <img
        src={formation.logo ? `http://localhost:5001/uploads/formations/${formation.logo}` : "/images/default-logo.png"}
        alt={formation.nomFormation}
        className="formation-logo"
      />

      <h3 className="formation-universite">{formation.universite}</h3>
      <h2 className="formation-titre">{formation.nomFormation}</h2>

      <div className="formation-type">
        <span>{formation.typeFormation}</span>
      </div>

      <div className="formation-infos">
        <p className="formation-capacite">
          <strong>Capacité :</strong> {formation.capacite} étudiant(s)
        </p>
        <p className="formation-taux">
          <strong>Taux d'accès :</strong> {formation.tauxAcces}%
        </p>
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

        <button className="btn-candidater" onClick={postuler} disabled={candidatureExistante}>
          <FaCheck /> {candidatureExistante ? "Déjà candidaté" : "Candidater"}
        </button>
      </div>

      {/* ✅ Modale pour informer que l'utilisateur a déjà candidaté */}
      <Modal
        isOpen={modaleOuvert}
        onRequestClose={() => setModaleOuvert(false)}
        className="modale"
        overlayClassName="modale-overlay"
      >
        <h2>📌 Déjà candidaté</h2>
        <p>Vous avez déjà soumis une candidature pour cette formation.</p>
        <button className="btn-close" onClick={() => setModaleOuvert(false)}>Fermer</button>
      </Modal>

      {/* ✅ Affichage du formulaire de candidature seulement si l'utilisateur est connecté et pas encore candidat */}
      {afficherForm && !candidatureExistante && (
        <CandidatureForm
          idFormation={formation.idFormation}
          idUtilisateur={utilisateurConnecte}
          fermerFormulaire={() => setAfficherForm(false)}
        />
      )}
    </div>
  );
};

export default FormationCardConnecte;
