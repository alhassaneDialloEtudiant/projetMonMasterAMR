import React, { useState } from 'react';
import '../styles/Menu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

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
            {/* Titre ou bouton hamburger */}
            <div className="menu-header">
                <button className="menu-toggle" onClick={toggleMenu}>
                    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
                </button>
            </div>

            {/* Liens du menu */}
            <ul className={`menu-list ${isOpen ? 'menu-open' : ''}`}>
                <li>
                    <a href="/" onClick={closeMenu}>Accueil</a>
                </li>
                <li>
                    <a href="/connexion" onClick={closeMenu}>Connexion</a>
                </li>
                <li>
                    <a href="/tableau-de-bord" onClick={closeMenu}>Tableau de bord</a>
                </li>
                <li>
                    <a href="/programmes" onClick={closeMenu}>Programmes</a>
                </li>
            </ul>
        </nav>
    );
}

export default Menu;
