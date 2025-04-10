import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Tabs, Tab } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StatistiquesGlobales from "./StatistiquesGlobales";
import TableauUtilisateurs from "./TableauUtilisateurs";
import AjoutUtilisateur from "./AjoutUtilisateur";
import "../styles/EspaceAdminGeneral.css";

function EspaceAdminGeneral() {
  const [ongletActif, setOngletActif] = useState("stats");
  const [stats, setStats] = useState({});
  const [utilisateurs, setUtilisateurs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStatistiques();
    fetchUtilisateurs();
  }, []);

  const fetchStatistiques = async () => {
    try {
      const [utilisateursRes, formationsRes] = await Promise.all([
        axios.get("http://localhost:5001/api/utilisateurs"),
        axios.get("http://localhost:5001/api/formations")
      ]);

      setStats({
        totalUtilisateurs: utilisateursRes.data.length,
        totalFormations: formationsRes.data.length
      });
    } catch (error) {
      toast.error("Erreur lors du chargement des statistiques.");
    }
  };

  const fetchUtilisateurs = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/utilisateurs");
      setUtilisateurs(res.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des utilisateurs.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("idUtilisateur");
    navigate("/");
  };

  return (
    <div className="admin-general-container">
      <div className="header-bar">
        <h1 className="page-title">Espace Admin Général</h1>
        <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
      </div>

      <Tabs
        value={ongletActif}
        onChange={(e, newValue) => setOngletActif(newValue)}
        className="admin-tabs"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Utilisateurs" value="utilisateurs" />
        <Tab label="Statistiques" value="stats" />
      </Tabs>

      <div className="tab-content">
        {ongletActif === "utilisateurs" && (
          <>
            <AjoutUtilisateur onUtilisateurCree={fetchUtilisateurs} />
            <TableauUtilisateurs utilisateurs={utilisateurs} />
          </>
        )}
        {ongletActif === "stats" && <StatistiquesGlobales stats={stats} showCharts />}
      </div>
    </div>
  );
}

export default EspaceAdminGeneral;
