import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Accueil.css";
import Formations from "./Formations";

// Images du slider
import image1 from "../assets/photos/e.png";
import image2 from "../assets/photos/qdmx2zms.png";
import image3 from "../assets/photos/qdmx2zms.png";
import image4 from "../assets/photos/c.png";
import image5 from "../assets/photos/d.png";
import image6 from "../assets/photos/e.png";

function Accueil() {
    const [showFormations, setShowFormations] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [zoneGeo, setZoneGeo] = useState("");

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
        fade: true,
        pauseOnHover: false,
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            setShowFormations(true);
        } else {
            alert("Veuillez entrer un mot-clé pour rechercher une formation.");
        }
    };

    const handleNewSearch = () => {
        setShowFormations(false);
        setSearchQuery("");
        setZoneGeo("");
    };

    const sliderImages = [
        { src: image1, text: "Découvrez nos formations uniques" },
        { src: image2, text: "Formez-vous avec les meilleurs experts" },
        { src: image3, text: "Votre avenir commence ici" },
        { src: image4, text: "Des opportunités dans toute la France" },
        { src: image5, text: "Une formation adaptée à votre projet" },
        { src: image6, text: "Rejoignez une communauté d'apprenants" },
    ];

    return (
        <div className="accueil-container">
            {!showFormations && (
                <>
                    <header className="hero-section">
                        <div className="hero-wrapper">
                            <Slider {...sliderSettings} className="hero-slider">
                                {sliderImages.map((img, index) => (
                                    <div className="slider-item" key={index}>
                                        <img src={img.src} alt={`Slide ${index + 1}`} className="slider-image" />
                                        <div className="slider-caption animate__animated animate__fadeInDown">
                                            <h2 className="animated-text">{img.text}</h2>
                                            <button
                                                className="cta-button animated-button"
                                                onClick={() => setShowFormations(true)}
                                            >
                                                Rechercher une formation
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </header>
                </>
            )}

            {!showFormations && (
                <section className="search-section animate__animated animate__fadeInUp">
                    <div className="search-wrapper">
                        <h2>Rechercher un master</h2>
                        <p className="search-sub">Formations ouvertes à la rentrée 2025</p>

                        <div className="search-form">
                            <div className="search-filters search-filters-inline">
                                <div className="filter">
                                    <label>Mot-clé</label>
                                    <input
                                        type="text"
                                        placeholder="Mention, établissement, mot-clé..."
                                        className="filter-input"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <div className="filter">
                                    <label>Zone géographique</label>
                                    <input
                                        type="text"
                                        placeholder="Région, département, ville"
                                        className="filter-input"
                                        value={zoneGeo}
                                        onChange={(e) => setZoneGeo(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button type="button" className="search-button" onClick={handleSearch}>
                                Rechercher
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {showFormations && (
                <>
                    <Formations searchQuery={searchQuery} zoneGeo={zoneGeo} />
                    <div className="new-search">
                        <button className="search-button" onClick={handleNewSearch}>
                            🔄 Nouvelle recherche
                        </button>
                    </div>
                </>
            )}

            {!showFormations && (
                <section className="info-section animate__animated animate__fadeInUp">
                    <div className="info-card animate__animated animate__fadeInLeft">
                        <h3>Bienvenue sur Mon Master</h3>
                        <ul>
                            <li>L'ensemble des formations conduisant au diplôme national de master (DNM).</li>
                            <li>Un espace candidat pour candidater à ces formations.</li>
                            <li>Toutes les informations sur la procédure et son déroulé.</li>
                        </ul>
                    </div>
                    <div className="info-card animate__animated animate__fadeInRight">
                        <h3>Rechercher un master</h3>
                        <p>Utilisez les champs de recherche pour trouver les formations correspondant à votre projet.</p>
                    </div>
                    <div className="info-card animate__animated animate__fadeInUp">
                        <h3>Période d’information</h3>
                        <p>Du 3 février au 24 février, explorez les formations et préparez vos candidatures.</p>
                    </div>
                </section>
            )}
        </div>
    );
}

export default Accueil;
