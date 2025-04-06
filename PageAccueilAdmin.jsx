import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/PageAccueilAdmin.css";
import GestionCandidaturesAdmin from "./GestionCandidaturesAdmin";
import FormationsAdminUniversite from "./FormationsAdminUniversite";
import AjouterFormation from "./AjouterFormation";
import CandidaturesEnAttenteAdmin from "./CandidaturesEnAttenteAdmin";
import CandidaturesAccepteesAdmin from "./CandidaturesAccepteesAdmin"; // ✅ Ajout du composant
import CandidaturesRefuseesAdmin from "./CandidaturesRefuseesAdmin";
import EtudiantsParFormation from "./EtudiantsParFormation";
import Administration from "./administration";

const PageAccueilAdmin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminUniversite, setAdminUniversite] = useState(null);
  const [showUniversites, setShowUniversites] = useState(false);
  const [selectedUniversite, setSelectedUniversite] = useState(null);
  const [stats, setStats] = useState({ formations: 0, enAttente: 0, refusees: 0, acceptees: 0 });
  const navigate = useNavigate();

  // ✅ Vérifier si l'admin universitaire est connecté
  useEffect(() => {
    const idAdmin = localStorage.getItem("idAdminUniversite");
    console.log("ID Admin Université récupéré :", idAdmin);
    if (idAdmin) {
      setAdminUniversite(idAdmin);
      fetchStats(idAdmin);
    } else {
      navigate("/admin-login"); // Redirection si pas connecté
    }
  }, [navigate]);

  const fetchStats = async (idAdmin) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/stats/admin/${idAdmin}`);
      setStats(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques :", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("idAdminUniversite");
    setAdminUniversite(null);
    navigate("/"); 
  };

  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <div 
          className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`} 
          onClick={() => setActiveTab("dashboard")}
        >
          Tableau de bord
        </div>
        <div 
          className={`nav-item ${activeTab === "candidatures" ? "active" : ""}`} 
          onClick={() => setActiveTab("candidatures")}
        >
          Gérer les candidatures
        </div>
        <div 
          className={`nav-item ${activeTab === "formations" ? "active" : ""}`} 
          onClick={() => setActiveTab("formations")}
        >
          Gérer mes formations
        </div>
        <div 
          className={`nav-item ${activeTab === "ajouterFormation" ? "active" : ""}`} 
          onClick={() => setActiveTab("ajouterFormation")}
        >
          ➕ Ajouter une formation
        </div>
        <div 
          className={`nav-item ${activeTab === "candidaturesEnAttente" ? "active" : ""}`} 
          onClick={() => setActiveTab("candidaturesEnAttente")}
        >
          📄 Candidatures en attente
        </div>
        <div 
          className={`nav-item ${activeTab === "candidaturesAcceptees" ? "active" : ""}`} 
          onClick={() => setActiveTab("candidaturesAcceptees")}
        >
          📜 Candidatures Acceptées
        </div>
        <div 
            className={`nav-item ${activeTab === "candidaturesRefusees" ? "active" : ""}`} 
            onClick={() => setActiveTab("candidaturesRefusees")}
          >
            ❌ Candidatures Refusées
        </div>

          <div 
              className={`nav-item ${activeTab === "etudiantsParFormation" ? "active" : ""}`} 
              onClick={() => setActiveTab("etudiantsParFormation")}
            >
          🎓 Étudiants par Formation
          </div>
          <div 
              className={`nav-item ${activeTab === "administration" ? "active" : ""}`} 
              onClick={() => setActiveTab("administration")}
            >
          Administration
          </div>



        <button className="btn-deconnexion" onClick={handleLogout}>
          Se déconnecter
        </button>

      </nav>

      <main className="admin-content">
        {activeTab === "dashboard" && (
          <div className="dashboard">
            <h1>🎓 Tableau de Bord</h1>
            <div className="stats-container">
              <div className="stat-card">🎓 Formations créées : {stats.formations}</div>
              <div className="stat-card">📄 Candidatures en attente : {stats.enAttente}</div>
              <div className="stat-card">❌ Candidatures refusées : {stats.refusees}</div>
              <div className="stat-card">✅ Candidatures acceptées : {stats.acceptees}</div>
            </div>
          </div>
        )}




        {/* 📌 Gestion des candidatures en attente */}
        {activeTab === "candidaturesEnAttente" && adminUniversite && (
          <CandidaturesEnAttenteAdmin idAdminUniversite={adminUniversite} />
        )}

        {/* 📌 Gestion des candidatures acceptées */}
        {activeTab === "candidaturesAcceptees" && adminUniversite && (
          <CandidaturesAccepteesAdmin idAdminUniversite={adminUniversite} />
        )}

        {/* 📌 Gestion des candidatures générales */}
        {activeTab === "candidatures" && adminUniversite && (
          <GestionCandidaturesAdmin idAdminUniversite={adminUniversite} />
        )}
        
        {/* 📌 Gestion des formations */}
        {activeTab === "formations" && adminUniversite && (
          <FormationsAdminUniversite idAdminUniversite={adminUniversite} />
        )}

        {/* 📌 Ajouter une formation */}
        {activeTab === "ajouterFormation" && adminUniversite && (
          <AjouterFormation idAdminUniversite={adminUniversite} />
        )}
        {activeTab === "candidaturesRefusees" && adminUniversite && (
        <CandidaturesRefuseesAdmin idAdminUniversite={adminUniversite} />
      )}
        {activeTab === "etudiantsParFormation" && adminUniversite && (
        <EtudiantsParFormation idAdminUniversite={adminUniversite} />
      )} 
      { // Administration
      activeTab === "administration" && adminUniversite && (
        <Administration idAdminUniversite={adminUniversite} />
      )}

      </main>
    </div>
  );
};

export default PageAccueilAdmin;
