import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons"; // Import de l'icône faPlus
import "../styles/Utilisateurs.css";

function Utilisateurs() {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [formData, setFormData] = useState({
        emailUtilisateur: "",
        motDePasseUtilisateur: "",
        nomUtilisateur: "",
        prenomUtilisateur: "",
        roleUtilisateur: "",
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [dialogue, setDialogue] = useState({
        isOpen: false,
        message: "",
        action: null,
    });
    const [infoMessage, setInfoMessage] = useState("");

    const apiUrl = "http://localhost:5001/api/utilisateurs";

    // Charger les utilisateurs
    const fetchUtilisateurs = async () => {
        try {
            const response = await axios.get(apiUrl);
            setUtilisateurs(response.data);
        } catch (error) {
            console.error("❌ Erreur lors du chargement des utilisateurs :", error);
        }
    };

    useEffect(() => {
        fetchUtilisateurs();
    }, []);

    // Gestion des champs du formulaire
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        try {
            if (isEditMode) {
                await axios.put(`${apiUrl}/modifier/${editId}`, formData);
                showInfoMessage("✅ Utilisateur modifié avec succès !");
                fetchUtilisateurs();
                resetForm();
            } else {
                await axios.post(`${apiUrl}/ajouter`, formData);
                showInfoMessage("✅ Utilisateur ajouté avec succès !");
                fetchUtilisateurs();
                resetForm();
            }
        } catch (error) {
            console.error("❌ Erreur :", error.response?.data?.message || error.message);
            showInfoMessage("❌ Une erreur s'est produite.");
        }
    };

    const resetForm = () => {
        setFormData({
            emailUtilisateur: "",
            motDePasseUtilisateur: "",
            nomUtilisateur: "",
            prenomUtilisateur: "",
            roleUtilisateur: "",
        });
        setIsEditMode(false);
        setEditId(null);
    };

    const handleEdit = (utilisateur) => {
        setFormData({
            emailUtilisateur: utilisateur.emailUtilisateur,
            motDePasseUtilisateur: "", // Mot de passe vide pour éviter de l'afficher
            nomUtilisateur: utilisateur.nomUtilisateur,
            prenomUtilisateur: utilisateur.prenomUtilisateur,
            roleUtilisateur: utilisateur.roleUtilisateur,
        });
        setIsEditMode(true);
        setEditId(utilisateur.idUtilisateur);
        openDialogue(
            "📝 Êtes-vous sûr de vouloir modifier cet utilisateur ?",
        );
    };

    const handleDelete = (id) => {
        openDialogue(
            "⚠️ Êtes-vous sûr de vouloir supprimer cet utilisateur ?",
            async () => {
                try {
                    await axios.delete(`${apiUrl}/supprimer/${id}`);
                    showInfoMessage("✅ Utilisateur supprimé avec succès !");
                    fetchUtilisateurs();
                } catch (error) {
                    console.error("❌ Erreur :", error);
                    showInfoMessage("❌ Une erreur s'est produite.");
                }
            }
        );
    };

    // Gestion des messages d'information
    const showInfoMessage = (message) => {
        setInfoMessage(message);
        setTimeout(() => {
            setInfoMessage("");
        }, 3000);
    };

    // Gestion de la boîte de dialogue
    const openDialogue = (message, action) => {
        setDialogue({
            isOpen: true,
            message,
            action,
        });
    };

    const closeDialogue = () => {
        if (isEditMode) {
            setIsEditMode(false);
            setEditId(null);
            resetForm(); // Réinitialiser les champs uniquement si l'utilisateur clique sur "Non"
        }
        setDialogue({
            isOpen: false,
            message: "",
            action: null,
        });
    };

    const confirmAction = async () => {
        if (dialogue.action) {
            await dialogue.action();
        }
        setDialogue({
            isOpen: false,
            message: "",
            action: null,
        });
    };

    return (
        <div className="utilisateurs-container">
            <h1>Gestion des Utilisateurs</h1>

            {/* Affichage des messages d'information */}
            {infoMessage && <div className="info-message">{infoMessage}</div>}

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    openDialogue(
                        isEditMode
                            ? "📝 Êtes-vous sûr de vouloir modifier cet utilisateur ?"
                            : "➕ Êtes-vous sûr de vouloir ajouter cet utilisateur ?",
                        handleSubmit
                    );
                }}
                className="utilisateurs-form"
            >
                <input
                    type="email"
                    name="emailUtilisateur"
                    value={formData.emailUtilisateur}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="motDePasseUtilisateur"
                    value={formData.motDePasseUtilisateur}
                    onChange={handleChange}
                    placeholder="Mot de passe"
                    required={!isEditMode}
                />
                <input
                    type="text"
                    name="nomUtilisateur"
                    value={formData.nomUtilisateur}
                    onChange={handleChange}
                    placeholder="Nom"
                    required
                />
                <input
                    type="text"
                    name="prenomUtilisateur"
                    value={formData.prenomUtilisateur}
                    onChange={handleChange}
                    placeholder="Prénom"
                    required
                />
                <select
                    name="roleUtilisateur"
                    value={formData.roleUtilisateur}
                    onChange={handleChange}
                    required
                >
                    <option value="">Sélectionnez un rôle</option>
                    <option value="Etudiant">Étudiant</option>
                    <option value="AdminGeneral">Admin Général</option>
                    <option value="AdminUniversitaire">Admin Universitaire</option>
                </select>
                <button type="submit">
                    <FontAwesomeIcon icon={faPlus} /> {/* Ajout de l'icône faPlus */}
                </button>
            </form>

            <table className="utilisateurs-table">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Rôle</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {utilisateurs.map((utilisateur) => (
                        <tr key={utilisateur.idUtilisateur}>
                            <td>{utilisateur.emailUtilisateur}</td>
                            <td>{utilisateur.nomUtilisateur}</td>
                            <td>{utilisateur.prenomUtilisateur}</td>
                            <td>{utilisateur.roleUtilisateur}</td>
                            <td>
                                <button onClick={() => handleEdit(utilisateur)}>
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button onClick={() => handleDelete(utilisateur.idUtilisateur)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Boîte de dialogue */}
            {dialogue.isOpen && (
                <div className="dialogue-overlay">
                    <div className="dialogue-box">
                        <p>{dialogue.message}</p>
                        <div className="dialogue-actions">
                            <button onClick={confirmAction} className="dialogue-confirm">
                                Oui
                            </button>
                            <button onClick={closeDialogue} className="dialogue-cancel">
                                Non
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Utilisateurs;
