import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/gestion.css';
import { format } from 'date-fns'

const routeGetAllUtilisateur = `http://localhost:5001/api/etudiants/afficher`;
const routeAjouterUtilisateur = `http://localhost:5001/api/etudiants/ajouter`;
const routeDeleteUtilisateur = `http://localhost:5001/api/etudiants/supprimer`;

function Gestion() {
    const nDate = new Date();
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [erreur, setErreur] = useState(null);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        idUtilisateur: '',
        numeroEtudiant: '',
        niveauEtudiant: '',
        dateInscription: format(nDate, 'yyyy-MM-dd'),
    });

    // Charger la liste des étudiants
    useEffect(() => {
        axios.get(routeGetAllUtilisateur)
            .then(response => setUtilisateurs(response.data))
            .catch(error => setErreur(error.message));
    }, []);

    // Gérer la modification des champs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Gérer la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page

        try {
            const response = await axios.post(routeAjouterUtilisateur, formData);
            setMessage(response.data.message);
            setErreur(null);

            // Rafraîchir la liste après l'ajout
            const newResponse = await axios.get(routeGetAllUtilisateur);
            setUtilisateurs(newResponse.data);

            // Réinitialiser le formulaire
            setFormData({
                idUtilisateur: '',
                numeroEtudiant: '',
                niveauEtudiant: '',
                dateInscription: format(nDate, 'yyyy-MM-dd'),
            });
        } catch (error) {
            setErreur(error.response?.data?.erreur || 'Une erreur est survenue.');
            setMessage(null);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        const id = formData.idUtilisateur2;
        
        if (!id) {
            setErreur('Veuillez entrer un identifiant utilisateur.');
            return;
        }
    
        try {
            // Send POST request to delete the student
            await axios.post(`${routeDeleteUtilisateur}/${id}`);
            setMessage('Étudiant supprimé avec succès.');
            setErreur(null);
            
            // Refresh the list of users
            const response = await axios.get(routeGetAllUtilisateur);
            setUtilisateurs(response.data);
            
            // Clear the input field
            setFormData(prev => ({ ...prev, idUtilisateur2: '' }));
        } catch (error) {
            setErreur(error.response?.data?.erreur || 'Erreur lors de la suppression.');
            setMessage(null);
        }
    };

    return (
        <div className="gestion-container">
            {/* Section Gestion des étudiants */}
            <div className="liste-container">
                <h1>Gestion des étudiants</h1>
                
                {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
                {message && <p style={{ color: 'green' }}>{message}</p>}

                <ul>
                    {utilisateurs.map(user => (
                        <li key={user.idUtilisateur}>
                            👤 {user.nomUtilisateur} {user.prenomUtilisateur} • 📧 {user.emailUtilisateur} • 🎓 {user.niveauEtudiant} • 📅 {format(user.dateInscription, "dd/MM/yyyy")}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Section Ajout d'un étudiant */}
            <div className="add-container">
                <h1>Ajouter un étudiant</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="idUtilisateur" placeholder="Identifiant utilisateur" value={formData.idUtilisateur} onChange={handleChange} required />
                    <input type="text" name="numeroEtudiant" placeholder="Numéro étudiant" value={formData.numeroEtudiant} onChange={handleChange} required />
                    <input type="text" name="niveauEtudiant" placeholder="Niveau étudiant" value={formData.niveauEtudiant} onChange={handleChange} required />
                    <input type="text" name="dateInscription" value={formData.dateInscription} readOnly // Si la date ne doit pas être modifiable
                        />
                    <button type="submit">Créer étudiant</button>
                </form>
            </div>

            {/* Section Suppression d'un étudiant*/}
            <div className="delete-container">
                <h1>Supprimer un étudiant</h1>
                <form onSubmit={handleDelete}>
                    <input
                        type="text"
                        name="idUtilisateur2"
                        placeholder="Identifiant Utilisateur"
                        value={formData.idUtilisateur2}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Supprimer étudiant</button>
                </form>
            </div>
        </div>
    );
}

export default Gestion;