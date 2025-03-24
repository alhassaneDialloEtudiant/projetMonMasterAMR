import React, { useState } from "react";
import { Link } from "react-router-dom"; // ✅ Ajout de Link pour la navigation SPA
import "../styles/Menu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faStar } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/photos/logo.png"; // Assurez-vous que le chemin est correct

function Menu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false); // Ferme le menu lors de la navigation
    };

    return (
        <nav className="menu-container">
            {/* 🟢 Logo et Titre */}
            <div className="menu-left">
                <Link to="/" className="logo-link">
                    <img src={logo} alt="Logo Mon Maître" className="logo" />
                </Link>
                <div className="menu-title">
                    <h1>Mon Master</h1>
                    <p>La plateforme nationale des masters</p>
                </div>
            </div>

            {/* 🟢 Bouton Hamburger */}
            <button className="menu-toggle" onClick={toggleMenu}>
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
            </button>

            {/* 🟢 Menu principal */}
            <ul className={`menu-list ${isOpen ? "menu-open" : ""}`}>
                
                <li>
                    <Link to="/s-informer" onClick={closeMenu}>
                        S'informer
                    </Link>
                </li>
                
                <li>
                    <Link to="/pageConnexion" onClick={closeMenu}>
                        Mon space candidat
                    </Link>
                </li>
                <li>
                    <Link to="/informer" onClick={closeMenu}>
                        Se décider
                    </Link>
                </li>
                <li>
                    <Link to="/teste" onClick={closeMenu}>
                        TESTE
                    </Link>
                </li>
            </ul>

            {/* 🟢 Bouton Voir mes favoris */}
            <div className="menu-right">
                <Link to="/mes-favoris" className="favorites-button">
                    <FontAwesomeIcon icon={faStar} /> Mes Favoris
                </Link>
            </div>
        </nav>
    );
}

export default Menu;
