import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from "recharts";
import "../styles/StatistiquesGlobales.css";

function StatistiquesGlobales() {
  const [stats, setStats] = useState({ totalUtilisateurs: 0, totalFormations: 0 });

  useEffect(() => {
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

    fetchStatistiques();
  }, []);

  const data = [
    { name: "Utilisateurs", value: stats.totalUtilisateurs || 0 },
    { name: "Formations", value: stats.totalFormations || 0 }
  ];

  return (
    <div className="statistiques-globales-container">
      <h2 className="stats-title">📊 Statistiques globales</h2>

      <div className="stats-cards">
        <div className="stats-card">
          <div className="stats-icon">👥</div>
          <div className="stats-info">
            <span className="stats-number">{stats.totalUtilisateurs}</span>
            <span className="stats-label">Utilisateurs inscrits</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-icon">🎓</div>
          <div className="stats-info">
            <span className="stats-number">{stats.totalFormations}</span>
            <span className="stats-label">Formations disponibles</span>
          </div>
        </div>
      </div>

      <div className="stats-chart">
        {data.every((d) => d.value === 0) ? (
          <p style={{ textAlign: "center", color: "#999", marginTop: "20px" }}>
            Aucune donnée à afficher pour le moment.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#0a2b61" radius={[5, 5, 0, 0]} animationDuration={1200}>
                <LabelList dataKey="value" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default StatistiquesGlobales;
