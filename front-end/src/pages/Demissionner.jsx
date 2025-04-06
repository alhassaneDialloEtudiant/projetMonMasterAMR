import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Demissionner.css";
import { toast } from "react-toastify";

function Demissionner() {
  const [showModal, setShowModal] = useState(false);
  const [idUtilisateur, setIdUtilisateur] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("idUtilisateur");
    console.log("ID utilisateur reçu:", id);
    if (id) {
      setIdUtilisateur(id);
    }
  }, []);

  const handleDeleteAccount = async () => {
    if (!idUtilisateur) {
      toast.error("Erreur : ID utilisateur introuvable.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/api/utilisateurs/suppression-definitive/${idUtilisateur}`);
      toast.success("✅ Votre compte a bien été supprimé. Vous allez être redirigé.");
      setTimeout(() => {
        localStorage.clear();
        navigate("/");
      }, 3000);
    } catch (error) {
      toast.error("❌ Erreur lors de la suppression de votre compte.");
      console.error(error);
    }
  };

  return (
    <div className="demissionner-container">
      <h2 className="demissionner-title">🗑️ Supprimer mon compte</h2>
      <p className="demissionner-text">
        Cette action est irréversible. Toutes vos candidatures, données et informations personnelles seront définitivement supprimées.
      </p>

      {!idUtilisateur ? (
        <p className="loading-message">Chargement de vos informations utilisateur...</p>
      ) : (
        <button className="btn-danger" onClick={() => setShowModal(true)}>
          Supprimer mon compte
        </button>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Êtes-vous sûr de vouloir supprimer votre compte ?</h3>
            <p className="modal-warning">Cette opération <strong className="highlight">ne peut pas être annulée</strong>.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Annuler
              </button>
              <button className="btn-confirm" onClick={handleDeleteAccount}>
                ✅ Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Demissionner;
