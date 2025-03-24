import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/InformationsPersonnelles.css"; // Fichier CSS

function InformationsPersonnelles({ utilisateurId: propUtilisateurId }) {
    const [formData, setFormData] = useState({
        civilite: "M.",
        nomUtilisateur: "",
        prenomUtilisateur: "",
        deuxiemePrenom: "",
        nationalite: "",
        dateNaissance: "",
        paysNaissance: "",
        adresse: "",
        complementAdresse: "",
        codePostal: "",
        ville: "",
        ine: ""
    });

    const [idUtilisateur, setIdUtilisateur] = useState(null);

    useEffect(() => {
        const id = propUtilisateurId || localStorage.getItem("idUtilisateur");

        if (!id) {
            alert("Erreur : ID utilisateur introuvable.");
            return;
        }
        setIdUtilisateur(id);

        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/utilisateurs/informations/${id}`);
                if (response.status !== 200) throw new Error("Erreur de récupération des informations.");
                
                const data = response.data;
                console.log("✅ Données utilisateur reçues :", data);

                setFormData((prevData) => ({
                    ...prevData,
                    civilite: data.civilite || "M.",
                    nomUtilisateur: data.nomUtilisateur || "",
                    prenomUtilisateur: data.prenomUtilisateur || "",
                    deuxiemePrenom: data.deuxiemePrenom || "",
                    nationalite: data.nationalite || "",
                    dateNaissance: data.dateNaissance ? data.dateNaissance.split("T")[0] : "",
                    paysNaissance: data.paysNaissance || "",
                    adresse: data.adresse || "",
                    complementAdresse: data.complementAdresse || "",
                    codePostal: data.codePostal || "",
                    ville: data.ville || "",
                    ine: data.ine || "",
                }));
            } catch (error) {
                console.error("❌ Erreur récupération des informations :", error);
            }
        };

        fetchUserInfo();
    }, [propUtilisateurId]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!idUtilisateur) {
            alert("Erreur : Impossible d'enregistrer sans ID utilisateur.");
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:5001/api/utilisateurs/enregistrer-informations/${idUtilisateur}`,
                formData
            );

            if (response.status !== 200) throw new Error("Échec de l'enregistrement.");

            alert("✅ Informations mises à jour avec succès !");
        } catch (error) {
            console.error("❌ Erreur mise à jour :", error);
            alert("Erreur lors de l'enregistrement des informations.");
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Mes informations personnelles</h2>

            <div className="form-group">
                <label>Civilité :</label>
                <select name="civilite" value={formData.civilite} onChange={handleInputChange} className="form-select">
                    <option value="M.">M.</option>
                    <option value="Mme">Mme</option>
                </select>
            </div>

            <div className="form-row">
                <input type="text" name="nomUtilisateur" value={formData.nomUtilisateur} onChange={handleInputChange} placeholder="Nom" className="form-input" />
                <input type="text" name="prenomUtilisateur" value={formData.prenomUtilisateur} onChange={handleInputChange} placeholder="Prénom" className="form-input" />
            </div>

            <input type="text" name="deuxiemePrenom" value={formData.deuxiemePrenom} onChange={handleInputChange} placeholder="Deuxième prénom" className="form-input" />
            
            <div className="form-group">
                <label>Nationalité :</label>
                <input type="text" name="nationalite" value={formData.nationalite} onChange={handleInputChange} placeholder="Exemple : France" className="form-input" />
            </div>

            <div className="form-group">
                <label>Date de naissance :</label>
                <input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleInputChange} className="form-input" />
            </div>

            <div className="form-group">
                <label>Pays de naissance :</label>
                <input type="text" name="paysNaissance" value={formData.paysNaissance} onChange={handleInputChange} placeholder="Exemple : Guinée" className="form-input" />
            </div>

            <h3 className="form-subtitle">Mon adresse</h3>
            <div className="form-row">
                <input type="text" name="adresse" value={formData.adresse} onChange={handleInputChange} placeholder="Adresse" className="form-input" />
                <input type="text" name="complementAdresse" value={formData.complementAdresse} onChange={handleInputChange} placeholder="Complément d'adresse" className="form-input" />
            </div>

            <div className="form-row">
                <input type="text" name="codePostal" value={formData.codePostal} onChange={handleInputChange} placeholder="Code postal" className="form-input small-input" />
                <input type="text" name="ville" value={formData.ville} onChange={handleInputChange} placeholder="Ville" className="form-input small-input" />
            </div>

            <h3 className="form-subtitle">Mon identifiant étudiant</h3>
            <input type="text" name="ine" value={formData.ine} onChange={handleInputChange} placeholder="INE/BEA/INA" className="form-input" />

            <button onClick={handleSubmit} className="submit-button">Enregistrer</button>
        </div>
    );
};

export default InformationsPersonnelles;
