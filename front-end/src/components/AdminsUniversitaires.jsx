import React, { useState, useEffect } from 'react';     
import axios from 'axios';

const AdminsUniversitaires = () => {
    const [admins, setAdmins] = useState([]);
    const [newAdmin, setNewAdmin] = useState({
        nomUtilisateur: '',
        prenomUtilisateur: '',
        poste: '',
        universiteSupervisee: '',
        role: 'AdminUniversitaire',  // Rôle fixé
    });
    const [editingAdmin, setEditingAdmin] = useState({
        nomUtilisateur: '',
        prenomUtilisateur: '',
        poste: '',
        universiteSupervisee: '',
    });

    // Récupérer les admins universitaires depuis l'API
    const fetchAdmins = async () => {
        try {
            const response = await axios.get('/api/adminuniversitaires');
            console.log("Données reçues :", response.data); // 🔍 Vérification des données reçues
            setAdmins(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des admins universitaires", error);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    // Supprimer un admin universitaire
    const deleteAdmin = async (id) => {
        try {
            await axios.delete(`/api/adminuniversitaires/${id}`);
            setAdmins(admins.filter(admin => admin.idAdminUniversitaire !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression de l'admin", error);
        }
    };

    // Gérer les changements dans le formulaire d'ajout
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAdmin({ ...newAdmin, [name]: value });
    };

    // Ajouter un nouvel admin universitaire
    const addAdmin = async (e) => {
        e.preventDefault();

        // Vérification que tous les champs sont remplis
        if (!newAdmin.nomUtilisateur || !newAdmin.prenomUtilisateur || !newAdmin.poste || !newAdmin.universiteSupervisee) {
            console.error("Tous les champs doivent être remplis");
            return;
        }

        try {
            const response = await axios.post('/api/adminuniversitaires', newAdmin);
            setAdmins([...admins, response.data]);
            setNewAdmin({
                nomUtilisateur: '',
                prenomUtilisateur: '',
                poste: '',
                universiteSupervisee: '',
                role: 'AdminUniversitaire',
            });
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'admin", error);
        }
    };

    // Préparer l'édition d'un admin universitaire
    const handleEdit = (admin) => {
        setEditingAdmin({
            ...admin,
        });
    };

    // Mettre à jour un admin universitaire
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updatedAdmin = await axios.put(
                `/api/adminuniversitaires/${editingAdmin.idAdminUniversitaire}`,
                editingAdmin
            );
            setAdmins(admins.map(admin =>
                admin.idAdminUniversitaire === editingAdmin.idAdminUniversitaire
                    ? updatedAdmin.data
                    : admin
            ));
            setEditingAdmin({
                nomUtilisateur: '',
                prenomUtilisateur: '',
                poste: '',
                universiteSupervisee: '',
            });
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'admin", error);
        }
    };

    return (
        <div>
            <h1>Gestion des Admins Universitaires</h1>

            {/* Formulaire d'ajout d'un admin */}
            <div>
                <h2>Ajouter un Admin Universitaire</h2>
                <form onSubmit={addAdmin}>
                    <input
                        type="text"
                        name="nomUtilisateur"
                        value={newAdmin.nomUtilisateur}
                        onChange={handleInputChange}
                        placeholder="Nom de l'utilisateur"
                        required
                    />
                    <input
                        type="text"
                        name="prenomUtilisateur"
                        value={newAdmin.prenomUtilisateur}
                        onChange={handleInputChange}
                        placeholder="Prénom de l'utilisateur"
                        required
                    />
                    <input
                        type="text"
                        name="poste"
                        value={newAdmin.poste}
                        onChange={handleInputChange}
                        placeholder="Poste"
                        required
                    />
                    <input
                        type="text"
                        name="universiteSupervisee"
                        value={newAdmin.universiteSupervisee}
                        onChange={handleInputChange}
                        placeholder="Université supervisée"
                        required
                    />
                    <button type="submit">Ajouter</button>
                </form>
            </div>

            {/* Liste des admins */}
            <div>
                <h2>Liste des Admins Universitaires</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Poste</th>
                            <th>Université</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map(admin => (
                            <tr key={admin.idAdminUniversitaire}>
                                <td>{admin.nomUtilisateur}</td>
                                <td>{admin.prenomUtilisateur}</td>
                                <td>{admin.poste}</td>
                                <td>{admin.universiteSupervisee}</td>
                                <td>
                                    <button onClick={() => handleEdit(admin)}>Éditer</button>
                                    <button onClick={() => deleteAdmin(admin.idAdminUniversitaire)}>Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Formulaire de mise à jour d'un admin */}
            {editingAdmin.idAdminUniversitaire && (
                <div>
                    <h2>Modifier l'Admin Universitaire</h2>
                    <form onSubmit={handleUpdate}>
                        <input
                            type="text"
                            name="nomUtilisateur"
                            value={editingAdmin.nomUtilisateur}
                            onChange={(e) => setEditingAdmin({ ...editingAdmin, nomUtilisateur: e.target.value })}
                            placeholder="Nom de l'utilisateur"
                            required
                        />
                        <input
                            type="text"
                            name="prenomUtilisateur"
                            value={editingAdmin.prenomUtilisateur}
                            onChange={(e) => setEditingAdmin({ ...editingAdmin, prenomUtilisateur: e.target.value })}
                            placeholder="Prénom de l'utilisateur"
                            required
                        />
                        <input
                            type="text"
                            name="poste"
                            value={editingAdmin.poste}
                            onChange={(e) => setEditingAdmin({ ...editingAdmin, poste: e.target.value })}
                            placeholder="Poste"
                            required
                        />
                        <input
                            type="text"
                            name="universiteSupervisee"
                            value={editingAdmin.universiteSupervisee}
                            onChange={(e) => setEditingAdmin({ ...editingAdmin, universiteSupervisee: e.target.value })}
                            placeholder="Université supervisée"
                            required
                        />
                        <button type="submit">Mettre à jour</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminsUniversitaires;
