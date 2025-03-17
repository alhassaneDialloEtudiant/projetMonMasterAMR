import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Accueil.css";
import Formations from "./Formations"; // Composant pour afficher les résultats

// Importation des images
import image4 from "../assets/photos/1ylnlhgn.png";
import image5 from "../assets/photos/or6an8ce.png";
import image6 from "../assets/photos/qdmx2zms.png";

function Accueil() {
    const [showFormations, setShowFormations] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [zoneGeo, setZoneGeo] = useState("");
    const [dernierDiplome, setDernierDiplome] = useState("");
    const [mention, setMention] = useState("");

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
    };

    // ✅ Gestion de la recherche
    const handleSearch = () => {
        if (searchQuery.trim()) {
            setShowFormations(true);
        } else {
            alert("Veuillez entrer un mot-clé pour rechercher une formation.");
        }
    };

    // ✅ Fonction pour réinitialiser la recherche
    const handleNewSearch = () => {
        setShowFormations(false);
        setSearchQuery("");
        setZoneGeo("");
        setDernierDiplome("");
        setMention("");
    };

    return (
        <div className="accueil-container">
            {/* ✅ Bannière et Slider - Affiché uniquement si aucune recherche n'a été effectuée */}
            {!showFormations && (
                <>
                    <header className="hero-section">
                        <Slider {...sliderSettings} className="hero-slider">
                            <div className="slider-item">
                                <img src={image4} alt="Formation 1" className="slider-image" />
                                <div className="slider-caption">
                                    <h2 className="animated-text">Découvrez nos formations uniques</h2>
                                    <button className="cta-button animated-button" onClick={() => setShowFormations(true)}>
                                        Rechercher une formation
                                    </button>
                                </div>
                            </div>
                            <div className="slider-item">
                                <img src={image5} alt="Formation 2" className="slider-image" />
                                <div className="slider-caption">
                                    <h2 className="animated-text">Formez-vous avec les meilleurs experts</h2>
                                    <button className="cta-button animated-button" onClick={() => setShowFormations(true)}>
                                        Rechercher une formation
                                    </button>
                                </div>
                            </div>
                            <div className="slider-item">
                                <img src={image6} alt="Formation 3" className="slider-image" />
                                <div className="slider-caption">
                                    <h2 className="animated-text">Votre avenir commence ici</h2>
                                    <button className="cta-button animated-button" onClick={() => setShowFormations(true)}>
                                        Rechercher une formation
                                    </button>
                                </div>
                            </div>
                        </Slider>
                    </header>

                    {/* ✅ Bande d'information */}
                    <div className="header-info">
                        <p>
                            📅 L'offre de formation pour la rentrée 2025 est désormais disponible.{" "}
                            <a href="#" style={{ color: "#ffc107" }}>Consultez le calendrier 2025</a> de la procédure ici.
                        </p>
                    </div>
                </>
            )}

            {/* ✅ Section de recherche - Masquée après la recherche */}
            {!showFormations && (
                <section className="search-section">
                    <h2>Rechercher un master</h2>
                    <p>Formations ouvertes à la rentrée 2025</p>

                    <div className="search-form">
                        <input
                            type="text"
                            placeholder="Mention, établissement, mot-clé..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        <div className="search-filters">
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
                            <div className="filter">
                                <label>Mon dernier diplôme</label>
                                <select className="filter-select" value={dernierDiplome} onChange={(e) => setDernierDiplome(e.target.value)}>
                                    <option value="">Sélectionner</option>
                                    <option value="Licence">Licence</option>
                                    <option value="Master">Master</option>
                                    <option value="Doctorat">Doctorat</option>
                                </select>
                            </div>
                            <div className="filter">
                                <label>Mention</label>
                                <select className="filter-select" value={mention} onChange={(e) => setMention(e.target.value)}>
                                    <option value="">Sélectionner</option>
                                    <option value="Informatique">Informatique</option>
                                    <option value="Économie">Économie</option>
                                    <option value="Droit">Droit</option>
                                </select>
                            </div>
                        </div>

                        <button type="button" className="search-button" onClick={handleSearch}>Rechercher</button>
                    </div>
                </section>
            )}

            {/* ✅ Affichage des résultats de recherche */}
            {showFormations && (
                <>
                    <Formations
                        searchQuery={searchQuery}
                        zoneGeo={zoneGeo}
                        dernierDiplome={dernierDiplome}
                        mention={mention}
                    />

                    {/* ✅ Bouton pour relancer une nouvelle recherche */}
                    <div className="new-search">
                        <button className="search-button" onClick={handleNewSearch}>🔄 Nouvelle recherche</button>
                    </div>
                </>
            )}

            {/* ✅ Section d'information - Affichée uniquement si aucune recherche n'a été faite */}
            {!showFormations && (
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
                        <p>Utilisez les champs de recherche pour trouver les formations correspondant à votre projet.</p>
                    </div>
                    <div className="info-card">
                        <h3>Période d’information</h3>
                        <p>Du 3 février au 24 février, explorez les formations et préparez vos candidatures.</p>
                    </div>
                </section>
            )}
        </div>
    );
}

export default Accueil;
