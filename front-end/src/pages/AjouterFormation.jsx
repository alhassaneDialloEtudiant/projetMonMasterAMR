import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal"; // 📌 Importation de la boîte modale
import "../styles/AjouterFormation.css";

Modal.setAppElement("#root"); // 🔥 Configuration de la modale

const AjouterFormation = ({ formationModif, closeModal }) => {
    const [formData, setFormData] = useState({
        universite: "",
        nomFormation: "",
        typeFormation: "Formation initiale",
        capacite: "",
        tauxAcces: "",
        localisation: "",
        logo: null,
    });

    const [idAdminUniversite, setIdAdminUniversite] = useState(null);
    const [modalMessage, setModalMessage] = useState(""); // ✅ Gestion du message de la modale
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 📌 Récupération de l'ID de l'admin connecté
    useEffect(() => {
        const id = localStorage.getItem("idAdminUniversite");
        if (id) {
            setIdAdminUniversite(id);
        } else {
            setModalMessage("⚠️ Erreur : Aucun administrateur connecté !");
            setIsModalOpen(true);
        }

        if (formationModif) {
            setFormData({ ...formationModif, logo: null });
        }
    }, [formationModif]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, logo: e.target.files[0] });
    };

    const resetForm = () => {
        setFormData({
            universite: "",
            nomFormation: "",
            typeFormation: "Formation initiale",
            capacite: "",
            tauxAcces: "",
            localisation: "",
            logo: null,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!idAdminUniversite) {
            setModalMessage("⚠️ Erreur : Impossible d'ajouter une formation sans administrateur !");
            setIsModalOpen(true);
            return;
        }

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });
        data.append("idAdminUniversite", idAdminUniversite); // ✅ Ajout de l'ID de l'admin connecté

        try {
            let response;
            if (formationModif) {
                response = await axios.put(
                    `http://localhost:5001/api/formations/modifier/${formationModif.idFormation}`,
                    data
                );
                setModalMessage("✅ Formation modifiée avec succès !");
            } else {
                response = await axios.post("http://localhost:5001/api/formations/ajouter", data);
                setModalMessage("✅ Formation ajoutée avec succès !");
                resetForm(); // ✅ Réinitialisation des champs après l'ajout
            }

            setIsModalOpen(true);
            console.log("📌 Réponse serveur :", response.data);
        } catch (error) {
            console.error("❌ Erreur :", error);
            setModalMessage("❌ Une erreur est survenue lors de l'enregistrement !");
            setIsModalOpen(true);
        }
    };

    return (
        <div>
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
                <button type="button" className="btn-annuler" onClick={closeModal}>Annuler</button>
            </form>

            {/* 📌 Boîte Modale pour afficher les messages */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="custom-modal"
                overlayClassName="custom-overlay"
            >
                <h2>📢 Message</h2>
                <p>{modalMessage}</p>
                <button onClick={() => setIsModalOpen(false)}>OK</button>
            </Modal>
        </div>
    );
};

export default AjouterFormation;
