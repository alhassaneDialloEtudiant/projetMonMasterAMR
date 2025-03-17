import React, { useState, useEffect } from "react";
import axios from "axios";
import FormationCard from "./FormationCard";
import "../styles/FormationsList.css";

const FormationsList = () => {
  const [formations, setFormations] = useState([]);

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/formations/");
      setFormations(response.data);
    } catch (error) {
      console.error("Erreur récupération formations :", error);
    }
  };

  return (
    <div className="formations-container">

      {/* Liste des formations */}
      <div className="formations-list">
        {formations.length > 0 ? (
          formations.map((formation) => (
            <FormationCard key={formation.idFormation} formation={formation} />
          ))
        ) : (
          <p>Aucune formation trouvée.</p>
        )}
      </div>
    </div>
  );
};

export default FormationsList;
