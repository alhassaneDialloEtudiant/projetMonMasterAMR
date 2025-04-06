import React from 'react';
import '../styles/InformezVous.css'; // Fichier CSS à compléter pour le style
import bannerImage from '../assets/photos/a.png'; // Chemin correct pour l'image
import cardImage1 from '../assets/photos/e.png'; // Images pour les cartes
import cardImage2 from '../assets/photos/d.png';
import cardImage3 from '../assets/photos/c.png';

function InformezVous() {
  return (
    <div className="informez-vous-container">
      {/* Bannière d'information */}
      <div className="info-banner">
        <p>
          📅 L'offre de formation pour la rentrée 2025 est désormais disponible. 
          Il vous sera possible de candidater, via Mon Master, à partir du 25 février. 
          <a href="#"> Consultez le calendrier 2025</a> de la procédure ici.
        </p>
      </div>

      {/* Titre principal */}
      <h1 className="main-title">Informez-vous sur la plateforme Mon Master</h1>

      {/* Section principale avec image et texte */}
      <div className="main-section">
        <div className="main-image-wrapper">
          <img src={bannerImage} alt="Mon Master" className="main-image" />
        </div>
        <div className="main-description">
          <h2>Mon Master est la plateforme nationale des masters</h2>
          <ul>
            <li>Retrouver l'intégralité des formations conduisant au diplôme national de master.</li>
            <li>Déposer vos candidatures pour l'accès en première année de master.</li>
            <li>Être accompagné par les services rectoraux dans le cas où vous n'auriez reçu aucune réponse positive.</li>
          </ul>
          <a href="#" className="main-link">En savoir plus</a>
        </div>
      </div>

      {/* Grille d'informations */}
      <div className="info-grid">
        <div className="info-card">
          <img src={cardImage1} alt="La candidature" className="card-image" />
          <h3>La candidature</h3>
          <p>Comment trouver une formation sur Mon Master ? Comment préparer vos candidatures pour candidater ?</p>
          <a href="#" className="card-link">En savoir plus →</a>
        </div>
        <div className="info-card">
          <img src={cardImage2} alt="L'admission" className="card-image" />
          <h3>L'admission</h3>
          <p>Comment se déroule la phase d’admission, hors alternance et en alternance ?</p>
          <a href="#" className="card-link">En savoir plus →</a>
        </div>
        <div className="info-card">
          <img src={cardImage3} alt="La phase complémentaire" className="card-image" />
          <h3>La phase complémentaire</h3>
          <p>Comment se déroulent la phase complémentaire et la gestion des désistements ?</p>
          <a href="#" className="card-link">En savoir plus →</a>
        </div>
      </div>
    </div>
  );
}

export default InformezVous;
