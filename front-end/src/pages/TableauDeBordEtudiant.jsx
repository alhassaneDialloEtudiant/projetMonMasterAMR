import React from "react";
import "../styles/TableauDeBordEtudiant.css";

function TableauDeBordEtudiant() {
  return (
    <div className="dashboard-container">
      {/* Barre de navigation */}
      <div className="dashboard-navigation">
        <div className="navigation-item active">Mon tableau de bord</div>
        <div className="navigation-item">Mon dossier candidat</div>
        <div className="navigation-item">Mes candidatures</div>
        <div className="navigation-item">Mes candidatures en alternance</div>
        <div className="navigation-item">Mes documents</div>
        <div className="navigation-item">Je sélectionne une formation</div>
        <div className="navigation-item">Je démissionne</div>
      </div>

      {/* Section principale */}
      <div className="dashboard-content">
        <h1>Mon tableau de bord</h1>
        <p>
          Retrouvez ici les informations et outils importants concernant la
          procédure de Mon Master.
        </p>

        {/* Informations principales */}
        <div className="dashboard-info">
          <div className="info-card">
            <h2>Mes candidatures hors alternance</h2>
            <p>Nombre de vœux comptabilisés : 0 sur 15.</p>
            <p>Vous avez actuellement 0 candidature(s) non confirmée(s).</p>
            <p>
              Vous avez actuellement 0 candidature(s) complètes non
              confirmée(s).
            </p>
          </div>
          <div className="info-card">
            <h2>Mes candidatures en alternance</h2>
            <p>Nombre de vœux comptabilisés : 0 sur 15.</p>
            <p>Vous avez actuellement 0 candidature(s) non confirmée(s).</p>
            <p>
              Vous avez actuellement 0 candidature(s) complètes non
              confirmée(s).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableauDeBordEtudiant;
