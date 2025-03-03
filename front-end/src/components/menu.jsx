import React, { useState } from "react";
import "../styles/Menu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faStar } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/photos/logo.png"; // Chemin correct pour le logo

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
            {/* Logo et Titre */}
            <div className="menu-left">
                <a href="/" className="logo-link">
                    <img src={logo} alt="Logo Mon Maître" className="logo" />
                </a>
                <div className="menu-title">
                    <h1>Mon Maître</h1>
                    <p>La plateforme nationale des masters</p>
                </div>
            </div>

            {/* Bouton Hamburger */}
            <button className="menu-toggle" onClick={toggleMenu}>
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
            </button>

            {/* Menu principal */}
            <ul className={`menu-list ${isOpen ? "menu-open" : ""}`}>
                <li>
                    <a href="/rechercher" onClick={closeMenu}>
                        Rechercher une formation
                    </a>
                </li>
                
                <li>
                    <a href="/s-informer" onClick={closeMenu}>S'informer</a>
                </li>
                
                <li>
                        <a href="/candidater" onClick={closeMenu}>Candidater</a>
                </li>
                <li>
                    <a href="/pageConnexion" onClick={closeMenu}>Connexion</a>
                </li>
                <li>
                    <a href="/informer" onClick={closeMenu}>se décider</a>
                </li>
                <li>
                    <a href="/calendrier" onClick={closeMenu}>
                        Calendrier
                    </a>
                </li>
                <li>
                    <a href="/teste" onClick={closeMenu}>
                        TESTE
                    </a>
                </li>
            </ul>

            {/* Bouton Voir mes favoris */}
            <div className="menu-right">
                <a href="/favoris" className="favorites-button">
                    <FontAwesomeIcon icon={faStar} /> Voir mes favoris
                </a>
            </div>
        </nav>
    );
}

export default Menu;
