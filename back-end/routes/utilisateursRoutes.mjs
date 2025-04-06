import { Router } from 'express'; // Importer le module Router d'Express pour créer des routes
import { baseDeDonnees } from '../db/baseDeDonnees.mjs'; // Importer la connexion à la base de données
import bcrypt from 'bcrypt'; // Importer bcrypt pour hacher les mots de passe
import jwt from 'jsonwebtoken'; // Importer jsonwebtoken pour gérer les tokens JWT

const routeurUtilisateurs = Router(); // Routeur spécifique à la table `utilisateurs`

// Route pour ajouter un utilisateur
routeurUtilisateurs.post('/ajouter', async (req, res) => {
    const { emailUtilisateur, motDePasseUtilisateur, nomUtilisateur, prenomUtilisateur, roleUtilisateur } = req.body; // Extraire les données du corps de la requête

    try {
        // Validation des données reçues
        if (!emailUtilisateur || !motDePasseUtilisateur || !nomUtilisateur || !prenomUtilisateur || !roleUtilisateur) {
            return res.status(400).json({ erreur: 'Tous les champs sont requis.' }); // Retourner une erreur si des champs sont manquants
        }

        // Hacher le mot de passe
        const motDePasseHache = await bcrypt.hash(motDePasseUtilisateur, 10);

        // Requête SQL pour ajouter un utilisateur
        const requeteAjoutUtilisateur = `
            INSERT INTO utilisateurs (emailUtilisateur, motDePasseUtilisateur, nomUtilisateur, prenomUtilisateur, roleUtilisateur)
            VALUES (?, ?, ?, ?, ?)
        `;
        await baseDeDonnees.query(requeteAjoutUtilisateur, [
            emailUtilisateur,
            motDePasseHache,
            nomUtilisateur,
            prenomUtilisateur,
            roleUtilisateur
        ]); // Exécuter la requête avec les données fournies

        res.status(201).json({ message: 'Utilisateur ajouté avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de l’ajout de l’utilisateur :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de l’ajout de l’utilisateur.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour récupérer tous les utilisateurs
routeurUtilisateurs.get('/', async (req, res) => {
    try {
        const requeteRecupererTousUtilisateurs = 'SELECT * FROM utilisateurs'; // Requête SQL pour récupérer tous les utilisateurs
        const [resultats] = await baseDeDonnees.query(requeteRecupererTousUtilisateurs); // Exécuter la requête
        res.status(200).json(resultats); // Retourner les résultats au client
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la récupération des utilisateurs.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour récupérer un utilisateur par son ID
routeurUtilisateurs.get('/afficher/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteRecupererUtilisateurParId = 'SELECT * FROM utilisateurs WHERE idUtilisateur = ?'; // Requête SQL pour récupérer un utilisateur par ID
        const [resultats] = await baseDeDonnees.query(requeteRecupererUtilisateurParId, [id]); // Exécuter la requête avec l'ID fourni
        if (resultats.length === 0) {
            return res.status(404).json({ erreur: 'Utilisateur non trouvé.' }); // Retourner une erreur si l'utilisateur n'est pas trouvé
        }
        res.status(200).json(resultats[0]); // Retourner les résultats au client
    } catch (error) {
        console.error('Erreur lors de la récupération de l’utilisateur :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la récupération de l’utilisateur.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour modifier un utilisateur
routeurUtilisateurs.put('/modifier/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête
    const { emailUtilisateur, nomUtilisateur, prenomUtilisateur, roleUtilisateur } = req.body; // Extraire les données du corps de la requête

    try {
        // Validation des données reçues
        if (!emailUtilisateur || !nomUtilisateur || !prenomUtilisateur || !roleUtilisateur) {
            return res.status(400).json({ erreur: 'Tous les champs sont requis.' }); // Retourner une erreur si des champs sont manquants
        }

        const requeteModifierUtilisateur = `
            UPDATE utilisateurs
            SET emailUtilisateur = ?, nomUtilisateur = ?, prenomUtilisateur = ?, roleUtilisateur = ?
            WHERE idUtilisateur = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteModifierUtilisateur, [
            emailUtilisateur,
            nomUtilisateur,
            prenomUtilisateur,
            roleUtilisateur,
            id
        ]); // Exécuter la requête avec les données fournies

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Utilisateur non trouvé.' }); // Retourner une erreur si l'utilisateur n'est pas trouvé
        }

        res.status(200).json({ message: 'Utilisateur mis à jour avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l’utilisateur :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la mise à jour de l’utilisateur.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour supprimer un utilisateur
routeurUtilisateurs.delete('/supprimer/:id', async (req, res) => {
    const { id } = req.params; // Extraire l'ID des paramètres de la requête

    try {
        const requeteSupprimerUtilisateur = 'DELETE FROM utilisateurs WHERE idUtilisateur = ?'; // Requête SQL pour supprimer un utilisateur par ID
        const [resultat] = await baseDeDonnees.query(requeteSupprimerUtilisateur, [id]); // Exécuter la requête avec l'ID fourni

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Utilisateur non trouvé.' }); // Retourner une erreur si l'utilisateur n'est pas trouvé
        }

        res.status(200).json({ message: 'Utilisateur supprimé avec succès.' }); // Retourner un message de succès
    } catch (error) {
        console.error('Erreur lors de la suppression de l’utilisateur :', error); // Afficher l'erreur dans la console
        res.status(500).json({ erreur: 'Erreur lors de la suppression de l’utilisateur.', details: error.message }); // Retourner une erreur au client
    }
});

// Route pour récupérer les rôles uniques
routeurUtilisateurs.get('/roles', async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT roleUtilisateur AS nomRole
            FROM utilisateurs
            WHERE roleUtilisateur IS NOT NULL
        `;
        const [resultats] = await baseDeDonnees.query(query);
        res.status(200).json(resultats);
    } catch (error) {
        console.error("Erreur lors de la récupération des rôles :", error);
        res.status(500).json({ erreur: "Erreur lors de la récupération des rôles." });
    }
});

// Route pour inscrire un utilisateur
routeurUtilisateurs.post("/inscrire", async (req, res) => {
    const { nom, prenom, email, motDePasse, role } = req.body;
  
    try {
      // Validation des champs obligatoires
      if (!nom || !prenom || !email || !motDePasse || !role) {
        return res.status(400).json({ erreur: "Tous les champs sont obligatoires." });
      }
  
      // Hachage du mot de passe
      const motDePasseHache = await bcrypt.hash(motDePasse, 10);
  
      // Insertion dans la base de données
      const requeteAjoutUtilisateur = `
        INSERT INTO utilisateurs (nomUtilisateur, prenomUtilisateur, emailUtilisateur, motDePasseUtilisateur, roleUtilisateur, status)
        VALUES (?, ?, ?, ?, ?, 'actif')
      `;
      await baseDeDonnees.query(requeteAjoutUtilisateur, [
        nom,
        prenom,
        email,
        motDePasseHache,
        role,
      ]);
  
      res.status(201).json({ message: "Utilisateur inscrit avec succès." });
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      res.status(500).json({ erreur: "Erreur interne lors de l'inscription." });
    }
});

// Route pour la connexion des étudiants
// Route pour la connexion des utilisateurs (Étudiants + Admins Universitaires)
routeurUtilisateurs.post("/connexion", async (req, res) => {
    const { email, motDePasse } = req.body;

    try {
        // 🔹 Rechercher l'utilisateur en base
        const [resultats] = await baseDeDonnees.query(
            "SELECT * FROM utilisateurs WHERE emailUtilisateur = ?",
            [email]
        );

        if (resultats.length === 0) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        const utilisateur = resultats[0];

        // 🔹 Vérifier le mot de passe
        const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasseUtilisateur);

        if (!motDePasseValide) {
            return res.status(401).json({ message: "Mot de passe incorrect." });
        }

        // 🔹 Générer un token JWT avec le rôle inclus
        const token = jwt.sign(
            { id: utilisateur.idUtilisateur, role: utilisateur.roleUtilisateur },
            process.env.JWT_SECRET || "diallo",
            { expiresIn: "2h" }
        );

        // 📌 Retourne aussi `idUtilisateur` et `role` pour la redirection
        res.status(200).json({ 
            message: "Connexion réussie.", 
            token, 
            idUtilisateur: utilisateur.idUtilisateur,
            role: utilisateur.roleUtilisateur // ✅ Ajout du rôle pour le front-end
        });

    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});


routeurUtilisateurs.put('/enregistrer-informations/:id', async (req, res) => {
    const { id } = req.params;
    const {
        civilite, prenom, deuxiemePrenom, nomUsage, nationalite,
        dateNaissance, paysNaissance, adresse, complementAdresse,
        codePostal, ville, ine
    } = req.body;

    try {
        const requeteCheck = `SELECT idUtilisateur FROM utilisateurs WHERE idUtilisateur = ?`;
        const [resultats] = await baseDeDonnees.query(requeteCheck, [id]);

        if (resultats.length > 0) {
            const requeteUpdate = `
                UPDATE utilisateurs SET 
                    civilite = ?, prenomUtilisateur = ?, 
                    deuxiemePrenom = ?, nomUsage = ?, nationalite = ?, 
                    dateNaissance = ?, paysNaissance = ?, adresse = ?, 
                    complementAdresse = ?, codePostal = ?, ville = ?, ine = ? 
                WHERE idUtilisateur = ?
            `;
            await baseDeDonnees.query(requeteUpdate, [
                civilite, prenom, deuxiemePrenom, nomUsage, nationalite,
                dateNaissance, paysNaissance, adresse, complementAdresse,
                codePostal, ville, ine, id
            ]);
            return res.status(200).json({ message: "Informations mises à jour avec succès." });
        } else {
            return res.status(404).json({ erreur: "Utilisateur non trouvé." });
        }
    } catch (error) {
        console.error("Erreur lors de l'enregistrement des informations :", error);
        res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
});

// Route pour récupérer les informations personnelles d'un utilisateur par ID
routeurUtilisateurs.get('/informations/:id', async (req, res) => {
    const { id } = req.params; // Récupération de l'ID utilisateur

    try {
        // Vérifier si l'ID est valide
        if (!id) {
            return res.status(400).json({ erreur: "ID utilisateur manquant." });
        }

        const requete = `
            SELECT civilite, nomUtilisateur, prenomUtilisateur, deuxiemePrenom, 
                   nomUsage, nationalite, dateNaissance, paysNaissance, 
                   adresse, complementAdresse, codePostal, ville, ine
            FROM utilisateurs
            WHERE idUtilisateur = ?
        `;

        const [resultats] = await baseDeDonnees.query(requete, [id]);

        if (resultats.length === 0) {
            return res.status(404).json({ erreur: "Utilisateur non trouvé." });
        }

        res.status(200).json(resultats[0]); // Retourne les données sous forme JSON
    } catch (error) {
        console.error("Erreur récupération des infos utilisateur :", error);
        res.status(500).json({ erreur: "Erreur serveur." });
    }
});

  // routes/utilisateurs.js ou routeurUtilisateurs.js

routeurUtilisateurs.post("/recherche-email", async (req, res) => {
    const { email } = req.body;
  
    try {
      const [result] = await baseDeDonnees.query(
        "SELECT idUtilisateur FROM utilisateurs WHERE emailUtilisateur = ?",
        [email]
      );
  
      if (result.length === 0) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
  
      return res.json({ idUtilisateur: result[0].idUtilisateur });
    } catch (error) {
      console.error("Erreur recherche email :", error);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  });

  // ✅ Mise à jour sécurisée du mot de passe (haché avec bcrypt)
  routeurUtilisateurs.put("/nouveau-motdepasse/:idUtilisateur", async (req, res) => {
    const { idUtilisateur } = req.params;
    const { nouveauMotDePasse } = req.body;
  
    if (!nouveauMotDePasse) {
      return res.status(400).json({ message: "Mot de passe requis." });
    }
  
    try {
      // 🔐 Hachage avec bcrypt
      const motDePasseHashe = await bcrypt.hash(nouveauMotDePasse, 10);
  
      // 🔁 Mise à jour dans la base
      await baseDeDonnees.query(
        "UPDATE utilisateurs SET motDePasseUtilisateur = ? WHERE idUtilisateur = ?",
        [motDePasseHashe, idUtilisateur]
      );
  
      res.json({ message: "Mot de passe mis à jour." });
    } catch (error) {
      console.error("Erreur update mot de passe :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  });
  
  // Suppression définitive de l'utilisateur et de ses données
routeurUtilisateurs.delete("/suppression-definitive/:id", async (req, res) => {
    const idUtilisateur = req.params.id;
  
    try {
      // Supprimer les candidatures liées
      await baseDeDonnees.query("DELETE FROM candidatures WHERE idUtilisateur = ?", [idUtilisateur]);
  
      // Supprimer d'autres données associées (ajoute d'autres tables si nécessaire)
  
      // Supprimer le compte utilisateur
      await baseDeDonnees.query("DELETE FROM utilisateurs WHERE idUtilisateur = ?", [idUtilisateur]);
  
      res.status(200).json({ message: "Compte et données supprimés avec succès." });
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      res.status(500).json({ message: "Une erreur est survenue lors de la suppression." });
    }
  });
  

export default routeurUtilisateurs; // Exporter le routeur pour l'utiliser dans d'autres fichiers