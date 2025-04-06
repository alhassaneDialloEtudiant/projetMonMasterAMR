import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PageConnexionEtudiant.css";
import DossierCandidat from "./DossierCandidat";
import Formations from "./Formations";
import MesCandidatures from "./MesCandidatures";
import Demissionner from "./Demissionner";
import TableauDeBordEtudiant from "./TableauDeBordEtudiant"; // ✅ Ajout pour afficher uniquement ce composant

function PageTableauDeBordEtudiant() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [utilisateurConnecte, setUtilisateurConnecte] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const idUtilisateur = localStorage.getItem("idUtilisateur");
    setUtilisateurConnecte(idUtilisateur ? idUtilisateur : null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("idUtilisateur");
    setUtilisateurConnecte(null);
    navigate("/");
  };

  const handleDeleteAccount = () => {
    console.log("Suppression du compte de l'utilisateur :", utilisateurConnecte);
    handleLogout();
    alert("Votre compte a été supprimé.");
  };

  const tabs = [
    { id: "dashboard", label: "Mon tableau de bord" },
    { id: "dossier", label: "Mon dossier candidat" },
    { id: "candidatures", label: "Mes candidatures" },
    { id: "formation", label: "Je sélectionne une formation" },
    { id: "demission", label: "Je démissionne" },
  ];

  const statuses = [
    { title: "Candidature", status: "En cours", date: "Du 26 février au 24 mars 2024", color: "green" },
    { title: "Examen des candidatures", status: "À venir", date: "Du 02 avril au 03 juin 2024", color: "blue" },
    { title: "Admission", status: "À venir", date: "Du 04 juin au 24 juin 2024", color: "blue" },
    { title: "Phase complémentaire et GDD", status: "À venir", date: "Du 25 juin au 15 septembre 2024", color: "blue" },
  ];

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
        {activeTab === "dashboard" && <TableauDeBordEtudiant />}
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
            <Formations searchQuery={searchQuery} isUserConnected={!!utilisateurConnecte} />
          </>
        )}
        {activeTab === "candidatures" && utilisateurConnecte && (
          <MesCandidatures idUtilisateur={utilisateurConnecte} />
        )}
        {activeTab === "demission" && (
          <Demissionner onDeleteAccount={handleDeleteAccount} />
        )}
      </main>
    </div>
  );
}

export default PageTableauDeBordEtudiant;
