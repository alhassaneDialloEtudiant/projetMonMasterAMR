import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaStar, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal"; // ✅ Importation de React Modal
import "../styles/FormationCard.css";

// Configuration du modale pour éviter les erreurs
Modal.setAppElement("#root");

const FormationCardNonConnecte = ({ formation, onFavoriUpdate }) => {
  const navigate = useNavigate();
  const [favoris, setFavoris] = useState([]);
  const [modaleOuvert, setModaleOuvert] = useState(false); // ✅ État du modale

  // ✅ Charger les favoris depuis le localStorage
  useEffect(() => {
    const favorisStockes = JSON.parse(localStorage.getItem("favoris")) || [];
    setFavoris(favorisStockes);
  }, []);

  // ✅ Vérifier si la formation est dans les favoris
  const estDansFavoris = favoris.some((fav) => fav.idFormation === formation.idFormation);

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

    // ✅ Mettre à jour l'affichage immédiatement
    if (onFavoriUpdate) {
      onFavoriUpdate();
    }
  };

  // ✅ Ouvrir le modale au lieu d'une alerte
  const postuler = () => {
    setModaleOuvert(true);
  };

  // ✅ Redirection vers la page de connexion
  const allerConnexion = () => {
    localStorage.setItem("formationSelectionnee", JSON.stringify(formation));
    navigate("/pageConnexion");
  };

  return (
    <div className="formation-card">
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

      {/* ✅ Modale pour forcer la connexion */}
      <Modal
        isOpen={modaleOuvert}
        onRequestClose={() => setModaleOuvert(false)}
        className="modale"
        overlayClassName="modale-overlay"
      >
        <h2>🔒 Connexion requise</h2>
        <p>Vous devez être connecté pour candidater à cette formation.</p>
        <button className="btn-primary" onClick={allerConnexion}>
          Se connecter
        </button>
        <button className="btn-close" onClick={() => setModaleOuvert(false)}>
          Fermer
        </button>
      </Modal>
    </div>
  );
};

export default FormationCardNonConnecte;
