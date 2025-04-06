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

  // Modifier le rang d'une candidature
  routeurCandidatures.put("/rang/:idCandidature", async (req, res) => {
    const { idCandidature } = req.params;
    const { rang } = req.body;
  
    try {
      await baseDeDonnees.query(
        "UPDATE candidatures SET rang = ? WHERE idCandidature = ?",
        [rang, idCandidature]
      );
      res.status(200).json({ message: "Rang mis à jour avec succès." });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rang :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  });
  

  // ✅ Route pour attribuer automatiquement les candidatures à une formation
routeurCandidatures.post("/attribuer/:idFormation", async (req, res) => {
    const { idFormation } = req.params;
  
    try {
      // 1. Obtenir la capacité
      const [[formation]] = await baseDeDonnees.query(
        "SELECT capacite FROM formations WHERE idFormation = ?",
        [idFormation]
      );
  
      const capacite = formation?.capacite;
      if (!capacite) {
        return res.status(404).json({ erreur: "Formation non trouvée ou capacité non définie." });
      }
  
      // 2. Récupérer les candidatures triées par date (ou autre critère de mérite)
      const [candidatures] = await baseDeDonnees.query(
        `SELECT idCandidature FROM candidatures 
         WHERE idFormation = ? AND statut = 'En attente'
         ORDER BY dateSoumission ASC`, // à adapter si tri par note/score
        [idFormation]
      );
  
      const acceptes = candidatures.slice(0, capacite);
      const enAttente = candidatures.slice(capacite);
  
      for (const c of acceptes) {
        await baseDeDonnees.query(
          "UPDATE candidatures SET statut = 'acceptée' WHERE idCandidature = ?",
          [c.idCandidature]
        );
      }
  
      for (const c of enAttente) {
        await baseDeDonnees.query(
          "UPDATE candidatures SET statut = 'liste d\'attente' WHERE idCandidature = ?",
          [c.idCandidature]
        );
      }
  
      res.status(200).json({
        message: "Attribution des candidatures effectuée.",
        acceptes: acceptes.length,
        listeAttente: enAttente.length
      });
    } catch (error) {
      console.error("Erreur attribution des candidatures:", error);
      res.status(500).json({ erreur: "Erreur lors de l'attribution des candidatures." });
    }
  });

  // 📌 L'étudiant répond à une proposition
routeurCandidatures.put("/reponse/:idCandidature", async (req, res) => {
  const { idCandidature } = req.params;
  const { reponse } = req.body; // "acceptée", "refusée"

  if (!["acceptée", "refusée"].includes(reponse)) {
    return res.status(400).json({ message: "Réponse invalide." });
  }

  try {
    await baseDeDonnees.query(
      "UPDATE candidature SET statut = ? WHERE idCandidature = ?",
      [reponse, idCandidature]
    );
    res.status(200).json({ message: `Candidature ${reponse}` });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réponse :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});
routeurCandidatures.put("/decision-etudiant/:idCandidature", async (req, res) => {
  const { idCandidature } = req.params;
  const { decision } = req.body;

  if (!["accepte", "refuse"].includes(decision)) {
    return res.status(400).json({ message: "Décision invalide." });
  }

  try {
    // 🔍 Récupérer la candidature ciblée
    const [[candidature]] = await baseDeDonnees.query(
      "SELECT idFormation, statut FROM candidatures WHERE idCandidature = ?",
      [idCandidature]
    );

    if (!candidature) {
      return res.status(404).json({ message: "Candidature introuvable." });
    }

    const { idFormation, statut } = candidature;

    // 📝 Mettre à jour la décision de l'étudiant (accepte/refuse)
    await baseDeDonnees.query(
      "UPDATE candidatures SET decisionEtudiant = ? WHERE idCandidature = ?",
      [decision, idCandidature]
    );

    // ❌ Si l'étudiant refuse l'admission et qu'il avait été accepté
    if (decision === "refuse" && statut === "acceptée") {
      // ✅ a. Libérer une place dans la formation
      await baseDeDonnees.query(
        "UPDATE formations SET capacite = capacite + 1 WHERE idFormation = ?",
        [idFormation]
      );

      // ❗ b. Marquer cette candidature comme refusée
      await baseDeDonnees.query(
        "UPDATE candidatures SET statut = 'refusée' WHERE idCandidature = ?",
        [idCandidature]
      );

      // 🎯 c. Trouver le prochain candidat en attente pour cette formation
      const [[prochain]] = await baseDeDonnees.query(
        `SELECT idCandidature FROM candidatures 
         WHERE idFormation = ? AND statut = 'en attente'
         ORDER BY rang ASC LIMIT 1`,
        [idFormation]
      );

      // ✅ d. Si un candidat est trouvé, on lui attribue la place
      if (prochain) {
        const now = new Date();

        // (Optionnel) Tu peux ici notifier ou prioriser le prochain candidat du rang suivant
        await baseDeDonnees.query(
          `UPDATE candidatures 
           SET statut = 'acceptée', 
               notificationEnvoyee = 1, 
               dateNotification = ?
           WHERE idCandidature = ?`,
          [now, prochain.idCandidature]
        );

        // 🔻 e. Réduire la capacité car une place vient d'être réattribuée
        await baseDeDonnees.query(
          "UPDATE formations SET capacite = capacite - 1 WHERE idFormation = ?",
          [idFormation]
        );
      }
    }

    res.json({ message: "Décision enregistrée avec succès." });
  } catch (error) {
    console.error("Erreur décision étudiant :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

  // ✅ Envoyer la notification d’admission à un étudiant
routeurCandidatures.put("/envoyer-notification/:idCandidature", async (req, res) => {
  const { idCandidature } = req.params;

  try {
    // Mettre à jour la table candidatures
    const [result] = await baseDeDonnees.query(
      "UPDATE candidatures SET notificationEnvoyee = 1, dateNotification = NOW() WHERE idCandidature = ?",
      [idCandidature]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Candidature non trouvée" });
    }

    res.json({ message: "Notification envoyée à l'étudiant." });
  } catch (err) {
    console.error("Erreur lors de l'envoi de la notification :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
routeurCandidatures.get('/statistiques/voeux/:idUtilisateur', async (req, res) => {
  const { idUtilisateur } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT f.typeFormation, COUNT(*) AS total_voeux
      FROM candidatures c
      JOIN formations f ON c.idFormation = f.idFormation
      WHERE c.idUtilisateur = ?
      GROUP BY f.typeFormation
    `, [idUtilisateur]);

    const result = { classique: 0, alternance: 0 };
    rows.forEach((row) => {
      if (row.typeFormation === 'Formation initiale') result.classique = row.total_voeux;
      if (row.typeFormation === 'Alternance') result.alternance = row.total_voeux;
    });

    res.json(result);
  } catch (error) {
    console.error("Erreur API vœux:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

  
export default routeurCandidatures;
