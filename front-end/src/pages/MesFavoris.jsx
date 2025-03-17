import React, { useState, useEffect } from "react";
import FormationCard from "./FormationCard";
import "../styles/MesFavoris.css";

const MesFavoris = () => {
  const [favoris, setFavoris] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoris")) || [];
    setFavoris(storedFavorites);
  }, []);

  return (
    <div className="mes-favoris-container">
      <h2 className="mes-favoris-title">⭐ Mes Favoris ({favoris.length})</h2>

      {favoris.length > 0 ? (
        <div className="mes-favoris-grid">
          {favoris.map((formation) => (
            <FormationCard key={formation.idFormation} formation={formation} />
          ))}
        </div>
      ) : (
        <p className="no-favoris">Aucune formation en favori.</p>
      )}
    </div>
  );
};

export default MesFavoris;
