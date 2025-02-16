import React, { useState } from 'react'; 
import '../styles/Menu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'; // Importer Link de react-router-dom

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
                    <Link to="/" onClick={closeMenu}>Accueil</Link>
                </li>
                <li>
                    <Link to="/connexion" onClick={closeMenu}>Connexion</Link>
                </li>
                <li>
                    <Link to="/tableau-de-bord" onClick={closeMenu}>Tableau de bord</Link>
                </li>
                <li>
                    <Link to="/programmes" onClick={closeMenu}>Programmes</Link>
                </li>
                {/* Ajout du lien vers Admins Universitaires */}
                <li>
                    <Link to="/admins-universitaires" onClick={closeMenu}>Admins Universitaires</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Menu;

