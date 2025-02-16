import { baseDeDonnees } from "../db/baseDeDonnees.mjs"; // Importer la connexion à la base de données 

// ✅ 1. Récupérer tous les admins universitaires filtrés par le rôle "admin universitaire"
export const getAdminsUniversitaires = async (req, res) => {
    try {
        const [resultats] = await baseDeDonnees.query(`
            SELECT 
                adminuniversitaires.idAdminUniversitaire, 
                utilisateurs.nomUtilisateur, 
                utilisateurs.prenomUtilisateur, 
                etablissements.nomEtablissement AS universiteSupervisee,
                adminuniversitaires.poste
            FROM adminuniversitaires
            JOIN utilisateurs ON adminuniversitaires.idUtilisateur = utilisateurs.idUtilisateur
            JOIN etablissements ON adminuniversitaires.idEtablissement = etablissements.idEtablissement
            WHERE utilisateurs.roleUtilisateur = 'AdminUniversitaire'
        `);
        
        res.status(200).json(resultats);
    } catch (error) {
        console.error("Erreur lors de la récupération des admins universitaires :", error);
        res.status(500).json({ erreur: "Erreur serveur", details: error.message });
    }
};

// ✅ 2. Ajouter un admin universitaire avec conversion des noms en ID
export const addAdminUniversitaire = async (req, res) => {
    const { nomUtilisateur, prenomUtilisateur, universiteSupervisee, poste } = req.body;

    if (!nomUtilisateur || !prenomUtilisateur || !universiteSupervisee || !poste) {
        return res.status(400).json({ erreur: "Tous les champs sont requis." });
    }

    try {
        // 🔍 Trouver l'ID utilisateur
        const [utilisateur] = await baseDeDonnees.query(
            "SELECT idUtilisateur FROM utilisateurs WHERE nomUtilisateur = ? AND prenomUtilisateur = ?", 
            [nomUtilisateur, prenomUtilisateur]
        );

        if (!utilisateur || utilisateur.length === 0) {
            return res.status(404).json({ erreur: "Utilisateur non trouvé." });
        }
        const idUtilisateur = utilisateur[0].idUtilisateur;

        // 🔍 Trouver l'ID établissement
        const [etablissement] = await baseDeDonnees.query(
            "SELECT idEtablissement FROM etablissements WHERE nomEtablissement = ?", 
            [universiteSupervisee]
        );

        if (!etablissement || etablissement.length === 0) {
            return res.status(404).json({ erreur: "Établissement non trouvé." });
        }
        const idEtablissement = etablissement[0].idEtablissement;

        // 🔹 Insérer les données avec les IDs retrouvés
        const requete = "INSERT INTO adminuniversitaires (idEtablissement, idUtilisateur, poste) VALUES (?, ?, ?)";
        const [resultat] = await baseDeDonnees.query(requete, [idEtablissement, idUtilisateur, poste]);

        // Renvoyer les infos complètes pour mise à jour du frontend
        res.status(201).json({
            idAdminUniversitaire: resultat.insertId,
            nomUtilisateur,
            prenomUtilisateur,
            universiteSupervisee,
            poste
        });
    } catch (error) {
        console.error("Erreur lors de l’ajout :", error);
        res.status(500).json({ erreur: "Erreur serveur", details: error.message });
    }
};

// ✅ 3. Modifier un admin universitaire
export const updateAdminUniversitaire = async (req, res) => {
    const { id } = req.params;
    const { nomUtilisateur, prenomUtilisateur, universiteSupervisee, poste } = req.body;

    if (!nomUtilisateur || !prenomUtilisateur || !universiteSupervisee || !poste) {
        return res.status(400).json({ erreur: "Tous les champs sont requis." });
    }

    try {
        // 🔍 Trouver l'ID utilisateur
        const [utilisateur] = await baseDeDonnees.query(
            "SELECT idUtilisateur FROM utilisateurs WHERE nomUtilisateur = ? AND prenomUtilisateur = ?", 
            [nomUtilisateur, prenomUtilisateur]
        );

        if (!utilisateur || utilisateur.length === 0) {
            return res.status(404).json({ erreur: "Utilisateur non trouvé." });
        }
        const idUtilisateur = utilisateur[0].idUtilisateur;

        // 🔍 Trouver l'ID établissement
        const [etablissement] = await baseDeDonnees.query(
            "SELECT idEtablissement FROM etablissements WHERE nomEtablissement = ?", 
            [universiteSupervisee]
        );

        if (!etablissement || etablissement.length === 0) {
            return res.status(404).json({ erreur: "Établissement non trouvé." });
        }
        const idEtablissement = etablissement[0].idEtablissement;

        // Mettre à jour l'admin universitaire
        const requete = "UPDATE adminuniversitaires SET idEtablissement = ?, idUtilisateur = ?, poste = ? WHERE idAdminUniversitaire = ?";
        const [resultat] = await baseDeDonnees.query(requete, [idEtablissement, idUtilisateur, poste, id]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: "Admin universitaire non trouvé." });
        }

        res.status(200).json({ message: "Admin universitaire mis à jour avec succès." });
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        res.status(500).json({ erreur: "Erreur serveur", details: error.message });
    }
};

// ✅ 4. Supprimer un admin universitaire
export const deleteAdminUniversitaire = async (req, res) => {
    const { id } = req.params;
    console.log("ID reçu pour suppression :", id);
    try {
        console.log(`Tentative de suppression de l'admin universitaire avec l'ID: ${id}`);

        const requete = "DELETE FROM adminuniversitaires WHERE idAdminUniversitaire = ?";
        const [resultat] = await baseDeDonnees.query(requete, [id]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: "Admin universitaire non trouvé." });
        }

        res.status(200).json({ message: "Admin universitaire supprimé avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        res.status(500).json({ erreur: "Erreur serveur", details: error.message });
    }
};
