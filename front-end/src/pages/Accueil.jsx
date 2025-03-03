import React from "react";
import Slider from "react-slick"; // Importer le composant Slider
import "slick-carousel/slick/slick.css"; // Importer les styles de base de Slick
import "slick-carousel/slick/slick-theme.css"; // Importer le thème de Slick
import "../styles/Accueil.css"; // Vos styles supplémentaires

// Importer les images correctement
import image4 from "../assets/photos/1ylnlhgn.png";
import image5 from "../assets/photos/or6an8ce.png";
import image6 from "../assets/photos/qdmx2zms.png";

function Accueil() {
    const sliderSettings = {
        dots: true, // Activer les points de navigation
        infinite: true, // Activer le défilement infini
        speed: 500, // Vitesse de transition
        slidesToShow: 1, // Nombre d'images affichées
        slidesToScroll: 1, // Nombre d'images défilées à chaque clic
        autoplay: true, // Activer la lecture automatique
        autoplaySpeed: 4000, // Vitesse de défilement automatique (ms)
        arrows: false, // Désactiver les flèches
    };

    return (
        <div className="accueil-container">
            {/* Section bannière principale */}
            <header className="hero-section">
                <Slider {...sliderSettings} className="hero-slider">
                    <div className="slider-item">
                        <img
                            src={image4}
                            alt="Formation 1"
                            className="slider-image"
                        />
                        <div className="slider-caption">
                            <h2 className="animated-text">Découvrez nos formations uniques</h2>
                            <button className="cta-button animated-button">Chercher une formation</button>
                        </div>
                    </div>
                    <div className="slider-item">
                        <img
                            src={image5}
                            alt="Formation 2"
                            className="slider-image"
                        />
                        <div className="slider-caption">
                            <h2 className="animated-text">Formez-vous avec les meilleurs experts</h2>
                            <button className="cta-button animated-button">Chercher une formation</button>
                        </div>
                    </div>
                    <div className="slider-item">
                        <img
                            src={image6}
                            alt="Formation 3"
                            className="slider-image"
                        />
                        <div className="slider-caption">
                            <h2 className="animated-text">Votre avenir commence ici</h2>
                            <button className="cta-button animated-button">Chercher une formation</button>
                        </div>
                    </div>
                </Slider>
            </header>

            {/* En-tête déplacée en bas et mise à jour des couleurs */}
            <div className="header-info">
                <p>
                    📅 L'offre de formation pour la rentrée 2025 est désormais disponible. <a href="#" style={{ color: "#ffc107" }}>Consultez le calendrier 2025</a> de la procédure ici.
                </p>
            </div>

            {/* Section de recherche */}
            <section className="search-section">
                <h2>Rechercher un master</h2>
                <p>Formations ouvertes à la rentrée 2025</p>
                <form className="search-form">
                    <input
                        type="text"
                        placeholder="Mention, établissement, mot-clé..."
                        className="search-input"
                    />
                    <div className="search-filters">
                        <div className="filter">
                            <label>Zone géographique</label>
                            <input type="text" placeholder="Région, département, ville" className="filter-input" />
                        </div>
                        <div className="filter">
                            <label>Mon dernier diplôme</label>
                            <select className="filter-select">
                                <option>Sélectionner</option>
                                <option>Licence</option>
                                <option>Master</option>
                                <option>Doctorat</option>
                            </select>
                        </div>
                        <div className="filter">
                            <label>Mention</label>
                            <select className="filter-select">
                                <option>Sélectionner</option>
                                <option>Informatique</option>
                                <option>Économie</option>
                                <option>Droit</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="search-button">Rechercher</button>
                </form>
            </section>

            {/* Section d'information */}
            <section className="info-section">
                <div className="info-card">
                    <h3>Bienvenue sur Mon Master</h3>
                    <ul>
                        <li>L'ensemble des formations conduisant au diplôme national de master (DNM).</li>
                        <li>Un espace candidat pour candidater à ces formations.</li>
                        <li>Toutes les informations sur la procédure et son déroulé.</li>
                    </ul>
                </div>
                <div className="info-card">
                    <h3>Rechercher un master</h3>
                    <p>
                        Utilisez les champs de recherche pour trouver les formations correspondant à votre projet.
                    </p>
                </div>
                <div className="info-card">
                    <h3>Période d’information</h3>
                    <p>
                        Du 3 février au 24 février, explorez les formations et préparez vos candidatures.
                    </p>
                </div>
            </section>
        </div>
    );
}

export default Accueil;