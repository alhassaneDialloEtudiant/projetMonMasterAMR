import React, { useEffect, useState } from "react";
import axios from "axios";
import FormationCard from "./FormationCard"; 
import "../styles/Formations.css";

const Formations = ({ searchQuery, zoneGeo, dernierDiplome, mention }) => {
    const [formations, setFormations] = useState([]);
    const [filteredFormations, setFilteredFormations] = useState([]);
    const [favoris, setFavoris] = useState(() => {
        return JSON.parse(localStorage.getItem("favoris")) || [];
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFormations();
    }, []);

    const fetchFormations = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:5001/api/formations");
            setFormations(response.data);
            setFilteredFormations(response.data);
        } catch (err) {
            setError("Erreur lors du chargement des formations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!searchQuery && !zoneGeo && !dernierDiplome && !mention) {
            setFilteredFormations(formations);
            return;
        }

        const filtered = formations.filter((formation) => {
            const matchesSearchQuery = searchQuery
                ? formation.nomFormation.toLowerCase().includes(searchQuery.toLowerCase())
                : true;

            const matchesZoneGeo = zoneGeo
                ? formation.zoneGeographique.toLowerCase().includes(zoneGeo.toLowerCase())
                : true;

            const matchesDiplome = dernierDiplome
                ? formation.diplome.toLowerCase() === dernierDiplome.toLowerCase()
                : true;

            const matchesMention = mention
                ? formation.mention.toLowerCase() === mention.toLowerCase()
                : true;

            return matchesSearchQuery && matchesZoneGeo && matchesDiplome && matchesMention;
        });

        setFilteredFormations(filtered);
    }, [searchQuery, zoneGeo, dernierDiplome, mention, formations]);

    // ✅ Fonction pour ajouter aux favoris
    const ajouterAuxFavoris = (formation) => {
        if (!favoris.some(fav => fav.idFormation === formation.idFormation)) {
            const newFavoris = [...favoris, formation];
            setFavoris(newFavoris);
            localStorage.setItem("favoris", JSON.stringify(newFavoris));
        }
    };

    return (
        <div className="formations-container">
            <h2 className="formations-title">
                {filteredFormations.length > 0
                    ? `Résultats de la recherche (${filteredFormations.length} formation${filteredFormations.length > 1 ? 's' : ''} trouvée${filteredFormations.length > 1 ? 's' : ''})`
                    : "Aucune formation trouvée."
                }
            </h2>

            {loading && <p className="loading">Chargement des formations...</p>}
            {error && <p className="error">{error}</p>}

            {filteredFormations.length > 0 ? (
                <div className="formations-grid">
                    {filteredFormations.map((formation) => (
                        <FormationCard
                            key={formation.idFormation}
                            formation={formation}
                            onAddFavori={() => ajouterAuxFavoris(formation)}
                        />
                    ))}
                </div>
            ) : (
                <p className="no-results">Aucune formation trouvée.</p>
            )}
        </div>
    );
};

export default Formations;
