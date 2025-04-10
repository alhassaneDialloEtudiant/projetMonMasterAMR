// Importation des modules nécessaires
import React, { useEffect, useState } from "react"; // React pour le composant, useEffect pour les effets secondaires, useState pour gérer l'état
import axios from "axios"; // Axios pour effectuer des requêtes HTTP
import { toast } from "react-toastify"; // Toastify pour afficher des notifications
import {
  BarChart, // Composant pour afficher un graphique en barres
  Bar, // Barre individuelle dans le graphique
  XAxis, // Axe X du graphique
  YAxis, // Axe Y du graphique
  Tooltip, // Infobulle pour afficher des détails au survol
  ResponsiveContainer, // Conteneur réactif pour adapter le graphique à la taille de l'écran
  LabelList // Liste des étiquettes pour les barres
} from "recharts"; // Bibliothèque pour les graphiques
import "../styles/StatistiquesGlobales.css"; // Importation des styles CSS spécifiques à ce composant

function StatistiquesGlobales() {
  // État pour stocker les statistiques globales
  const [stats, setStats] = useState({ totalUtilisateurs: 0, totalFormations: 0 });

  // Effet secondaire pour récupérer les statistiques lors du montage du composant
  useEffect(() => {
    const fetchStatistiques = async () => {
      try {
        // Effectuer deux requêtes HTTP en parallèle pour récupérer les utilisateurs et les formations
        const [utilisateursRes, formationsRes] = await Promise.all([
          axios.get("http://localhost:5001/api/utilisateurs"), // Requête pour récupérer les utilisateurs
          axios.get("http://localhost:5001/api/formations") // Requête pour récupérer les formations
        ]);

        // Mettre à jour l'état avec les données récupérées
        setStats({
          totalUtilisateurs: utilisateursRes.data.length, // Nombre total d'utilisateurs
          totalFormations: formationsRes.data.length // Nombre total de formations
        });
      } catch (error) {
        // Afficher une notification en cas d'erreur
        toast.error("Erreur lors du chargement des statistiques.");
      }
    };

    fetchStatistiques(); // Appeler la fonction pour récupérer les statistiques
  }, []); // Le tableau vide signifie que cet effet s'exécute uniquement lors du montage du composant

  // Préparer les données pour le graphique
  const data = [
    { name: "Utilisateurs", value: stats.totalUtilisateurs || 0 }, // Donnée pour les utilisateurs
    { name: "Formations", value: stats.totalFormations || 0 } // Donnée pour les formations
  ];

  return (
    <div className="statistiques-globales-container">
      {/* Titre de la section */}
      <h2 className="stats-title">📊 Statistiques globales</h2>

      {/* Cartes pour afficher les statistiques principales */}
      <div className="stats-cards">
        {/* Carte pour les utilisateurs */}
        <div className="stats-card">
          <div className="stats-icon">👥</div> {/* Icône pour les utilisateurs */}
          <div className="stats-info">
            <span className="stats-number">{stats.totalUtilisateurs}</span> {/* Nombre total d'utilisateurs */}
            <span className="stats-label">Utilisateurs inscrits</span> {/* Libellé */}
          </div>
        </div>

        {/* Carte pour les formations */}
        <div className="stats-card">
          <div className="stats-icon">🎓</div> {/* Icône pour les formations */}
          <div className="stats-info">
            <span className="stats-number">{stats.totalFormations}</span> {/* Nombre total de formations */}
            <span className="stats-label">Formations disponibles</span> {/* Libellé */}
          </div>
        </div>
      </div>

      {/* Section pour afficher le graphique */}
      <div className="stats-chart">
        {/* Si toutes les valeurs sont à 0, afficher un message */}
        {data.every((d) => d.value === 0) ? (
          <p style={{ textAlign: "center", color: "#999", marginTop: "20px" }}>
            Aucune donnée à afficher pour le moment.
          </p>
        ) : (
          // Sinon, afficher le graphique
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" /> {/* Axe X avec les noms des catégories */}
              <YAxis allowDecimals={false} /> {/* Axe Y sans décimales */}
              <Tooltip /> {/* Infobulle pour afficher les détails */}
              <Bar dataKey="value" fill="#0a2b61" radius={[5, 5, 0, 0]} animationDuration={1200}>
                <LabelList dataKey="value" position="top" /> {/* Étiquettes au-dessus des barres */}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default StatistiquesGlobales; // Exporter le composant pour l'utiliser ailleurs