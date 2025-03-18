import React from 'react';
import '../styles/PiedDePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faUniversity, faInfoCircle, faGavel } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

function PiedDePage() {
    return (
        <footer className="footer-container">
            {/* Section Contact */}
            <div className="footer-section">
                <h3>
                    <FontAwesomeIcon icon={faEnvelope} className="footer-icon" /> Contact
                </h3>
                <p>
                    <FontAwesomeIcon icon={faEnvelope} className="footer-icon" /> Email :{' '}
                    <a href="mailto:contact@projetmaster.com">contact@projetmaster.com</a>
                </p>
                <p>
                    <FontAwesomeIcon icon={faPhone} className="footer-icon" /> Téléphone : +33 6 12 34 56 78
                </p>
                <p>
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="footer-icon" /> Adresse : 12 rue des Écoles, 75005 Paris, France
                </p>
            </div>

            {/* Section Partenaires */}
            <div className="footer-section">
                <h3>
                    <FontAwesomeIcon icon={faUniversity} className="footer-icon" /> Partenaires
                </h3>
                <p>Université de Paris</p>
                <p>Ministère de l'Éducation</p>
                <p>Programme Erasmus+</p>
            </div>

            {/* Section À propos */}
            <div className="footer-section">
                <h3>
                    <FontAwesomeIcon icon={faInfoCircle} className="footer-icon" /> À propos
                </h3>
                <p>
                    Le Projet Master est une plateforme dédiée à la gestion et à la recherche de programmes éducatifs.
                    Notre mission est de simplifier l'accès à l'éducation.
                </p>
            </div>

            {/* Section Suivez-nous */}
            <div className="footer-section">
                <h3>
                    <FontAwesomeIcon icon={faFacebook} className="footer-icon" /> Suivez-nous
                </h3>
                <p>
                    <a href="https://facebook.com/projetmaster" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faFacebook} className="footer-icon" /> Facebook
                    </a>
                </p>
                <p>
                    <a href="https://twitter.com/projetmaster" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faTwitter} className="footer-icon" /> Twitter
                    </a>
                </p>
                <p>
                    <a href="https://instagram.com/projetmaster" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faInstagram} className="footer-icon" /> Instagram
                    </a>
                </p>
            </div>

            {/* Section Newsletter */}
            <div className="footer-section">
                <h3>
                    <FontAwesomeIcon icon={faEnvelope} className="footer-icon" /> Recevez nos actualités
                </h3>
                <p>Recevez nos dernières actualités et mises à jour directement par email.</p>
                <form className="newsletter-form">
                    <input
                        type="email"
                        placeholder="Entrez votre email"
                        className="newsletter-input"
                    />
                    <button type="submit" className="newsletter-button">S'abonner</button>
                </form>
            </div>

            {/* Section Informations légales */}
            <div className="footer-section">
                <h3>
                    <FontAwesomeIcon icon={faGavel} className="footer-icon" /> Informations légales
                </h3>
                <p>© 2025 Projet Master - Tous droits réservés.</p>
                <p>
                    <a href="/mentions-legales">Mentions légales</a> |{' '}
                    <a href="/confidentialite">Politique de confidentialité</a>
                </p>
            </div>
        </footer>
    );
}

export default PiedDePage;
