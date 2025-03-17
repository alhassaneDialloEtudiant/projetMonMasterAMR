import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PageConnexionEtudiant.css";
import DossierCandidat from './DossierCandidat'; // Import du composant
import Formations from './Formations'; // Import du composant Formations

function PageTableauDeBordEtudiant() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState(""); // État pour la recherche
  const navigate = useNavigate();

  const tabs = [
    { id: "dashboard", label: "Mon tableau de bord" },
    { id: "dossier", label: "Mon dossier candidat" },
    { id: "candidatures", label: "Mes candidatures" },
    { id: "alternance", label: "Mes candidatures en alternance" },
    { id: "documents", label: "Mes documents" },
    { id: "formation", label: "Je sélectionne une formation" },
    { id: "demission", label: "Je démissionne" },
  ];

  const statuses = [
    { title: "Candidature", status: "En cours", date: "Du 26 février au 24 mars 2024", color: "green" },
    { title: "Examen des candidatures", status: "À venir", date: "Du 02 avril au 03 juin 2024", color: "blue" },
    { title: "Admission", status: "À venir", date: "Du 04 juin au 24 juin 2024", color: "blue" },
    { title: "Phase complémentaire et GDD", status: "À venir", date: "Du 25 juin au 15 septembre 2024", color: "blue" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="page-container">
      <div className="status-container">
        {statuses.map((status, index) => (
          <div key={index} className="status-card">
            <div className={`status-label ${status.color}`}>{status.status}</div>
            <h3>{status.title}</h3>
            <p>{status.date}</p>
          </div>
        ))}
      </div>

      <div className="tabs-container">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
        <button className="btn-deconnexion" onClick={handleLogout}>
          Se déconnecter
        </button>
      </div>

      <main className="main-content">
        {activeTab === "dashboard" && (
          <>
            <h1>Mon tableau de bord</h1>
            <p>Retrouvez ici les informations et outils importants concernant la procédure de Mon Master.</p>
            <div className="info-cards">
              <div className="info-card">
                <h2>Mes candidatures hors alternance</h2>
                <p>Nombre de vœux comptabilisés : 0 sur 15.</p>
                <p>Vous avez actuellement 0 candidature(s) non confirmée(s).</p>
                <p>Vous avez actuellement 0 candidature(s) complètes non confirmée(s).</p>
              </div>
              <div className="info-card">
                <h2>Mes candidatures en alternance</h2>
                <p>Nombre de vœux comptabilisés : 0 sur 15.</p>
                <p>Vous avez actuellement 0 candidature(s) non confirmée(s).</p>
                <p>Vous avez actuellement 0 candidature(s) complètes non confirmée(s).</p>
              </div>
            </div>
          </>
        )}

        {activeTab === "dossier" && <DossierCandidat />}

        {activeTab === "formation" && (
          <>
            <div className="recherche-formation">
              <input
                type="text"
                placeholder="Rechercher une formation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Formations searchQuery={searchQuery} />
          </>
        )}
      </main>
    </div>
  );
}

export default PageTableauDeBordEtudiant;