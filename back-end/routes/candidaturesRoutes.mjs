import { Router } from "express";
import { baseDeDonnees } from "../db/baseDeDonnees.mjs";
import multer from "multer";
import fs from "fs";

const routeurCandidatures = Router();

// 📌 Création du dossier si nécessaire
const dossierCandidatures = "uploads/candidatures/";
if (!fs.existsSync(dossierCandidatures)) {
    fs.mkdirSync(dossierCandidatures, { recursive: true });
}

// 📌 Configuration Multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/candidatures/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// ✅ **1. Ajouter une candidature (Empêche les doublons)**
routeurCandidatures.post("/ajouter", upload.fields([
    { name: "cv" },
    { name: "releveNotes" },
    { name: "diplome" },
    { name: "lettreMotivation" },
    { name: "justificatifSupplementaire" }
]), async (req, res) => {
    const { idFormation, idUtilisateur } = req.body;

    if (!idUtilisateur || !idFormation) {
        return res.status(400).json({ erreur: "L'utilisateur ou la formation est manquant." });
    }

    try {
        // Vérification si l'utilisateur a déjà candidaté à cette formation
        const [existe] = await baseDeDonnees.query(
            "SELECT idCandidature FROM candidatures WHERE idUtilisateur = ? AND idFormation = ?",
            [idUtilisateur, idFormation]
        );

        if (existe.length > 0) {
            return res.status(400).json({ erreur: "Vous avez déjà candidaté à cette formation !" });
        }

        // Vérification de l'existence de la formation
        const [formation] = await baseDeDonnees.query(
            "SELECT idFormation FROM formations WHERE idFormation = ?",
            [idFormation]
        );

        if (formation.length === 0) {
            return res.status(404).json({ erreur: "La formation sélectionnée n'existe pas." });
        }

        // Récupération des fichiers uploadés
        const lettreMotivation = req.files["lettreMotivation"]?.[0]?.filename || null;
        const cv = req.files["cv"]?.[0]?.filename || null;
        const releveNotes = req.files["releveNotes"]?.[0]?.filename || null;
        const diplome = req.files["diplome"]?.[0]?.filename || null;
        const justificatifSupplementaire = req.files["justificatifSupplementaire"]?.[0]?.filename || null;

        // Insertion de la candidature
        const requeteAjout = `
            INSERT INTO candidatures (idUtilisateur, idFormation, lettreMotivation, cv, releveNotes, diplome, justificatifSupplementaire, statut)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'En attente')
        `;
        const [resultat] = await baseDeDonnees.query(requeteAjout, [
            idUtilisateur, idFormation, lettreMotivation, cv, releveNotes, diplome, justificatifSupplementaire
        ]);

        res.status(201).json({ message: "Candidature enregistrée avec succès.", idCandidature: resultat.insertId });

    } catch (error) {
        console.error("Erreur lors de l'ajout de la candidature :", error);
        res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
});

// ✅ **2. Modifier une candidature (Seulement le statut)**
routeurCandidatures.put("/modifier/:idCandidature", async (req, res) => {
    const { idCandidature } = req.params;
    const { statut } = req.body;

    if (!statut) {
        return res.status(400).json({ erreur: "Le statut est obligatoire." });
    }

    try {
        const requete = `
            UPDATE candidatures 
            SET statut = ? 
            WHERE idCandidature = ?
        `;
        await baseDeDonnees.query(requete, [statut, idCandidature]);

        res.status(200).json({ message: "Candidature mise à jour avec succès." });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la candidature :", error);
        res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
});

// ✅ **3. Récupérer toutes les candidatures d'un utilisateur**
routeurCandidatures.get("/utilisateur/:idUtilisateur", async (req, res) => {
    const { idUtilisateur } = req.params;

    try {
        console.log(`🔍 Récupération des candidatures pour l'utilisateur : ${idUtilisateur}`);

        const requete = `
            SELECT c.*, f.nomFormation, f.universite, f.localisation, f.logo, f.typeFormation
            FROM candidatures c
            JOIN formations f ON c.idFormation = f.idFormation
            WHERE c.idUtilisateur = ?
        `;
        
        const [resultats] = await baseDeDonnees.query(requete, [idUtilisateur]);

        if (resultats.length === 0) {
            return res.status(404).json({ message: "Aucune candidature trouvée pour cet utilisateur." });
        }

        res.status(200).json(resultats);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des candidatures utilisateur :", error);
        res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
});

// ✅ **4. Supprimer une candidature**
routeurCandidatures.delete("/supprimer/:idCandidature", async (req, res) => {
    const { idCandidature } = req.params;

    try {
        const requete = "DELETE FROM candidatures WHERE idCandidature = ?";
        const [resultat] = await baseDeDonnees.query(requete, [idCandidature]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: "Candidature non trouvée." });
        }

        res.status(200).json({ message: "Candidature supprimée avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression de la candidature :", error);
        res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
});

// ✅ **5. Récupérer les candidatures d'une université via l'admin**
routeurCandidatures.get("/universite/:idAdminUniversite", async (req, res) => {
    const { idAdminUniversite } = req.params;

    try {
        const requete = `
            SELECT c.*, f.nomFormation, f.universite, f.localisation, f.typeFormation, u.nomUtilisateur AS nomEtudiant
            FROM candidatures c
            JOIN formations f ON c.idFormation = f.idFormation
            JOIN utilisateurs u ON c.idUtilisateur = u.idUtilisateur
            WHERE f.idAdminUniversite = ?
        `;

        const [resultats] = await baseDeDonnees.query(requete, [idAdminUniversite]);

        if (resultats.length === 0) {
            return res.status(404).json({ message: "Aucune candidature trouvée pour cette université." });
        }

        res.status(200).json(resultats);
    } catch (error) {
        console.error("Erreur lors de la récupération des candidatures :", error);
        res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
});


routeurCandidatures.get("/universites/avec-candidatures/:idAdminUniversite", async (req, res) => {
    const { idAdminUniversite } = req.params;

    try {
        const requete = `
            SELECT DISTINCT f.universite
            FROM formations f
            JOIN candidatures c ON f.idFormation = c.idFormation
            WHERE f.idAdminUniversite = ? AND c.statut = 'En attente'
        `;
        const [resultats] = await baseDeDonnees.query(requete, [idAdminUniversite]);

        if (resultats.length === 0) {
            return res.status(404).json({ message: "Aucune université avec candidatures en attente." });
        }

        res.status(200).json(resultats);
    } catch (error) {
        console.error("Erreur lors de la récupération des universités avec candidatures en attente :", error);
        res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
});

// ✅ Nouvelle route pour récupérer les universités associées à un admin universitaire
routeurCandidatures.get("/admin-universites/:idAdminUniversite", async (req, res) => {
    const { idAdminUniversite } = req.params;

    try {
        const requete = `
            SELECT DISTINCT f.universite 
            FROM formations f
            WHERE f.idAdminUniversite = ?
        `;

        const [resultats] = await baseDeDonnees.query(requete, [idAdminUniversite]);

        if (resultats.length === 0) {
            return res.status(404).json({ message: "Aucune université trouvée pour cet administrateur." });
        }

        res.status(200).json(resultats);
    } catch (error) {
        console.error("Erreur lors de la récupération des universités :", error);
        res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
});
// ✅ Route pour récupérer les candidatures en attente pour une université spécifique
routeurCandidatures.get("/en-attente/:universite", async (req, res) => {
    let { universite } = req.params;

    try {
        console.log(`🔍 Requête reçue pour récupérer les candidatures en attente de : ${universite}`);

        // Normalisation du format de l'université pour éviter les erreurs de correspondance
        universite = universite.trim().toLowerCase();

        const requete = `
            SELECT c.*, f.nomFormation, f.universite, f.localisation, u.nomUtilisateur AS nomEtudiant
            FROM candidatures c
            JOIN formations f ON c.idFormation = f.idFormation
            JOIN utilisateurs u ON c.idUtilisateur = u.idUtilisateur
            WHERE LOWER(f.universite) = ? AND c.statut = 'En attente'
        `;

        const [resultats] = await baseDeDonnees.query(requete, [universite]);

        if (resultats.length === 0) {
            console.log("⚠️ Aucune candidature trouvée pour cette université !");
            return res.status(404).json({ message: "Aucune candidature en attente pour cette université." });
        }

        console.log("✅ Candidatures trouvées :", resultats.length);
        res.status(200).json(resultats);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des candidatures en attente :", error);
        res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
});

// ✅ Récupérer les candidatures acceptées pour une université spécifique
routeurCandidatures.get("/acceptees/:universite", async (req, res) => {
    const { universite } = req.params;

    try {
        const requete = `
            SELECT c.*, f.nomFormation, f.universite, f.localisation, u.nomUtilisateur AS nomEtudiant
            FROM candidatures c
            JOIN formations f ON c.idFormation = f.idFormation
            JOIN utilisateurs u ON c.idUtilisateur = u.idUtilisateur
            WHERE f.universite = ? AND c.statut = 'acceptée'
        `;

        const [resultats] = await baseDeDonnees.query(requete, [universite]);

        if (resultats.length === 0) {
            return res.status(404).json({ message: "Aucune candidature acceptée pour cette université." });
        }

        res.status(200).json(resultats);
    } catch (error) {
        console.error("Erreur lors de la récupération des candidatures acceptées :", error);
        res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
});

routeurCandidatures.get("/refusees/:universite", async (req, res) => {
    let { universite } = req.params;

    try {
        universite = universite.trim().toLowerCase();

        const requete = `
            SELECT c.*, f.nomFormation, f.universite, f.localisation, u.nomUtilisateur AS nomEtudiant
            FROM candidatures c
            JOIN formations f ON c.idFormation = f.idFormation
            JOIN utilisateurs u ON c.idUtilisateur = u.idUtilisateur
            WHERE LOWER(f.universite) = ? AND c.statut = 'refusée'
        `;

        const [resultats] = await baseDeDonnees.query(requete, [universite]);

        if (resultats.length === 0) {
            return res.status(404).json({ message: "Aucune candidature refusée pour cette université." });
        }

        res.status(200).json(resultats);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des candidatures refusées :", error);
        res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
});

routeurCandidatures.get("/formation/:idFormation", async (req, res) => {
    const { idFormation } = req.params;
    try {
        const requete = `
            SELECT u.idUtilisateur, u.nomUtilisateur, u.prenomUtilisateur, u.emailUtilisateur, c.statut
            FROM utilisateurs u
            JOIN candidatures c ON u.idUtilisateur = c.idUtilisateur
            WHERE c.idFormation = ?
        `;
        const [resultats] = await baseDeDonnees.query(requete, [idFormation]);

        if (resultats.length === 0) {
            return res.status(404).json({ message: "Aucun étudiant trouvé pour cette formation." });
        }
        res.status(200).json(resultats);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des étudiants :", error);
        res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
});
// 📌 Route à ajouter dans routeurCandidatures
// 📌 Mettre à jour le commentaire d'une candidature
routeurCandidatures.put("/commentaire/:idCandidature", async (req, res) => {
    const { idCandidature } = req.params;
    const { commentaire } = req.body;
  
    try {
      const [result] = await baseDeDonnees.query(
        "UPDATE candidatures SET commentaire = ? WHERE idCandidature = ?",
        [commentaire, idCandidature]
      );
  
      res.status(200).json({ message: "Commentaire mis à jour avec succès" });
    } catch (error) {
      console.error("Erreur commentaire :", error);
      res.status(500).json({ erreur: "Erreur serveur" });
    }
  });

  // ✅ Ajouter ou modifier une demande de document complémentaire
routeurCandidatures.put("/demande-supplementaire/:idCandidature", async (req, res) => {
    const { idCandidature } = req.params;
    const { message } = req.body;
  
    if (!message || !idCandidature) {
      return res.status(400).json({ erreur: "Le message est requis." });
    }
  
    try {
      const requete = `
        UPDATE candidatures
        SET demandeSupplementaire = ?
        WHERE idCandidature = ?
      `;
  
      const [resultat] = await baseDeDonnees.query(requete, [message, idCandidature]);
  
      if (resultat.affectedRows === 0) {
        return res.status(404).json({ erreur: "Candidature non trouvée." });
      }
  
      res.status(200).json({ message: "Demande de document complémentaire enregistrée." });
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande supplémentaire :", error);
      res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
  });
  // ✅ Route d'upload du justificatif complémentaire
routeurCandidatures.put(
    "/upload-justificatif/:idCandidature",
    upload.single("justificatifSupplementaire"),
    async (req, res) => {
      const { idCandidature } = req.params;
  
      if (!req.file) {
        return res.status(400).json({ erreur: "Aucun fichier reçu." });
      }
  
      try {
        const nomFichier = req.file.filename;
  
        const requete = `
          UPDATE candidatures
          SET justificatifSupplementaire = ?
          WHERE idCandidature = ?
        `;
        await baseDeDonnees.query(requete, [nomFichier, idCandidature]);
  
        res.status(200).json({
          message: "Justificatif complémentaire envoyé avec succès.",
          fichier: nomFichier,
        });
      } catch (error) {
        console.error("❌ Erreur lors de l'enregistrement du justificatif :", error);
        res.status(500).json({ erreur: "Erreur serveur lors de l'envoi du justificatif." });
      }
    }
  );

  
// ✅ Route POST : Upload du justificatif
routeurCandidatures.post("/upload-justificatif/:idCandidature", upload.single("justificatifSupplementaire"), async (req, res) => {
    const { idCandidature } = req.params;
  
    if (!req.file) {
      return res.status(400).json({ erreur: "Aucun fichier envoyé." });
    }
  
    try {
      const fichierNom = req.file.filename;
  
      const requete = `
        UPDATE candidatures
        SET justificatifSupplementaire = ?
        WHERE idCandidature = ?
      `;
  
      await baseDeDonnees.query(requete, [fichierNom, idCandidature]);
  
      res.status(200).json({ message: "Justificatif envoyé avec succès." });
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi du justificatif :", error);
      res.status(500).json({ erreur: "Erreur serveur lors de l'envoi du fichier." });
    }
  });
  
export default routeurCandidatures;
