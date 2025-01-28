import React from "react";
import Slider from "react-slick"; // Importer le composant Slider
import "slick-carousel/slick/slick.css"; // Importer les styles de base de Slick
import "slick-carousel/slick/slick-theme.css"; // Importer le thème de Slick
import "../styles/Accueil.css"; // Vos styles supplémentaires

// Importer les images correctement
/*import image1 from "../assets/photos/c2ndjnve-removebg-preview.png";
import image2 from "../assets/photos/ceb9o30y-removebg-preview.png";
import image3 from "../assets/photos/cxhk53sh-removebg-preview.png";*/
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
                    </div>
                    <div className="slider-item">
                        <img
                            src={image5}
                            alt="Formation 2"
                            className="slider-image"
                        />
                    </div>
                    <div className="slider-item">
                        <img
                            src={image6}
                            alt="Formation 3"
                            className="slider-image"
                        />
                    </div>
                </Slider>
                <div className="hero-content">
                    <h1>Trouvez Votre Formation Idéale</h1>
                    <p>
                        Explorez une large gamme de programmes académiques adaptés à vos besoins et commencez votre parcours vers le succès aujourd'hui.
                    </p>
                    <button className="cta-button">Découvrir les formations</button>
                </div>
            </header>

            {/* Section de recherche */}
            <section className="search-section">
                <h2>Rechercher une formation</h2>
                <form className="search-form">
                    <input
                        type="text"
                        placeholder="Entrez un mot-clé ou une discipline"
                        className="search-input"
                    />
                    <select className="search-select">
                        <option>Choisir une catégorie</option>
                        <option>Licence</option>
                        <option>Master</option>
                        <option>Doctorat</option>
                    </select>
                    <button type="submit" className="search-button">
                        Rechercher
                    </button>
                </form>
            </section>

            {/* Section à propos */}
            <section className="about-section">
                <h2>À propos de notre plateforme</h2>
                <p>
                    Nous vous aidons à trouver les meilleures formations adaptées à vos besoins. Notre mission est de simplifier
                    votre accès à l'éducation supérieure et de vous accompagner dans vos démarches académiques.
                </p>
                <blockquote>
                    "L'éducation est l'arme la plus puissante pour changer le monde." - Nelson Mandela
                </blockquote>
            </section>
        </div>
    );
}

export default Accueil;
