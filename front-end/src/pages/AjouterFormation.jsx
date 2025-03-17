import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AjouterFormation.css";

const AjouterFormation = ({ formationModif }) => {
    const [formData, setFormData] = useState({
        universite: "",
        nomFormation: "",
        typeFormation: "Formation initiale",
        capacite: "",
        tauxAcces: "",
        localisation: "",
        logo: null,
    });

    useEffect(() => {
        if (formationModif) {
            setFormData(formationModif);
        }
    }, [formationModif]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, logo: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        try {
            if (formationModif) {
                await axios.put(`http://localhost:5001/api/formations/modifier/${formationModif.idFormation}`, data);
                alert("Formation modifiée !");
            } else {
                await axios.post("http://localhost:5001/api/formations/ajouter", data);
                alert("Formation ajoutée !");
            }
        } catch (error) {
            console.error("Erreur :", error);
            alert("Erreur lors de l'enregistrement !");
        }
    };

    return (
        <form className="ajouter-formation" onSubmit={handleSubmit}>
            <h2>{formationModif ? "Modifier une formation" : "Ajouter une formation"}</h2>
            <input type="text" name="universite" placeholder="Université" onChange={handleChange} value={formData.universite} required />
            <input type="text" name="nomFormation" placeholder="Nom de la formation" onChange={handleChange} value={formData.nomFormation} required />
            <select name="typeFormation" onChange={handleChange} value={formData.typeFormation}>
                <option value="Formation initiale">Formation initiale</option>
                <option value="Formation continue">Formation continue</option>
                <option value="Alternance">Alternance</option>
            </select>
            <input type="number" name="capacite" placeholder="Capacité" onChange={handleChange} value={formData.capacite} required />
            <input type="number" step="0.1" name="tauxAcces" placeholder="Taux d'accès (%)" onChange={handleChange} value={formData.tauxAcces} required />
            <input type="text" name="localisation" placeholder="Localisation" onChange={handleChange} value={formData.localisation} required />
            <input type="file" name="logo" onChange={handleFileChange} />
            <button type="submit">{formationModif ? "Modifier" : "Ajouter"}</button>
        </form>
    );
};

export default AjouterFormation;
