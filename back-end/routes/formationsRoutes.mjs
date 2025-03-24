
import { Router } from "express";
import { baseDeDonnees } from "../db/baseDeDonnees.mjs";
import multer from "multer";
import fs from "fs";
import path from "path";

const formationsRoutes = Router();

// 📌 Configuration pour l'upload des logos
const stockage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/formations/";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: stockage });

/* ✅ 📌 Ajouter une formation (Admin Université) */
formationsRoutes.post("/ajouter", upload.single("logo"), async (req, res) => {
    console.log("📥 Requête reçue pour ajouter une formation !");
    
    const { idAdminUniversite, universite, nomFormation, typeFormation, capacite, tauxAcces, localisation } = req.body;

    // Vérification des champs requis
    if (!idAdminUniversite || !universite || !nomFormation || !typeFormation || !capacite || !tauxAcces || !localisation) {
        return res.status(400).json({ erreur: "Tous les champs sont obligatoires !" });
    }

    const logo = req.file ? req.file.filename : null;

    try {
        console.log("📌 Exécution de la requête SQL...");
        const [result] = await baseDeDonnees.query(
            "INSERT INTO formations (idAdminUniversite, universite, nomFormation, typeFormation, capacite, tauxAcces, localisation, logo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [idAdminUniversite, universite, nomFormation, typeFormation, capacite, tauxAcces, localisation, logo]
        );

        console.log("✅ Formation ajoutée avec succès !");
        res.status(201).json({ message: "Formation ajoutée avec succès.", idFormation: result.insertId });
    } catch (error) {
        console.error("❌ Erreur SQL :", error);
        res.status(500).json({ erreur: "Erreur serveur.", details: error.message });
    }
});

/* ✅ 📌 Récupérer les formations d'un Admin Université */
formationsRoutes.get("/:idAdminUniversite", async (req, res) => {
    const { idAdminUniversite } = req.params;

    try {
        console.log("📤 Récupération des formations pour l'Admin :", idAdminUniversite);
        const [formations] = await baseDeDonnees.query(
            "SELECT * FROM formations WHERE idAdminUniversite = ?",
            [idAdminUniversite]
        );

        res.status(200).json(formations);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération :", error);
        res.status(500).json({ erreur: "Erreur serveur.", details: error.message });
    }
});

/* ✅ 📌 Modifier une formation */
formationsRoutes.put("/modifier/:idFormation", upload.single("logo"), async (req, res) => {
    console.log("📤 Requête reçue pour modifier une formation !");
    const { idFormation } = req.params;
    const { idAdminUniversite, universite, nomFormation, typeFormation, capacite, tauxAcces, localisation } = req.body;

    if (!idAdminUniversite || !universite || !nomFormation || !typeFormation || !capacite || !tauxAcces || !localisation) {
        return res.status(400).json({ erreur: "Tous les champs sont obligatoires pour la modification !" });
    }

    let logo = req.body.logo;
    if (req.file) {
        logo = req.file.filename;
    }

    try {
        console.log("📌 Exécution de la requête SQL...");
        const [result] = await baseDeDonnees.query(
            "UPDATE formations SET universite = ?, nomFormation = ?, typeFormation = ?, capacite = ?, tauxAcces = ?, localisation = ?, logo = ? WHERE idFormation = ? AND idAdminUniversite = ?",
            [universite, nomFormation, typeFormation, capacite, tauxAcces, localisation, logo, idFormation, idAdminUniversite]
        );

        if (result.affectedRows === 0) {
            return res.status(403).json({ erreur: "Modification non autorisée ou formation introuvable !" });
        }

        console.log("✅ Formation mise à jour avec succès !");
        res.status(200).json({ message: "Formation mise à jour avec succès." });
    } catch (error) {
        console.error("❌ Erreur SQL :", error);
        res.status(500).json({ erreur: "Erreur serveur.", details: error.message });
    }
});

/* ✅ 📌 Supprimer une formation */
formationsRoutes.delete("/supprimer/:idFormation/:idAdminUniversite", async (req, res) => {
    console.log("🗑 Requête reçue pour supprimer une formation !");
    const { idFormation, idAdminUniversite } = req.params;

    try {
        console.log(`📌 Vérification si l'admin (${idAdminUniversite}) possède la formation (${idFormation})...`);
        
        const [formation] = await baseDeDonnees.query(
            "SELECT logo FROM formations WHERE idFormation = ? AND idAdminUniversite = ?",
            [idFormation, idAdminUniversite]
        );

        if (formation.length === 0) {
            return res.status(404).json({ erreur: "Formation non trouvée ou accès non autorisé !" });
        }

        // ✅ Supprimer le fichier logo si existe
        if (formation[0].logo) {
            const logoPath = path.join("uploads/formations/", formation[0].logo);
            if (fs.existsSync(logoPath)) {
                fs.unlinkSync(logoPath);
                console.log("🗑 Logo supprimé :", logoPath);
            }
        }

        await baseDeDonnees.query("DELETE FROM formations WHERE idFormation = ? AND idAdminUniversite = ?", 
            [idFormation, idAdminUniversite]
        );

        console.log("✅ Formation supprimée avec succès !");
        res.status(200).json({ message: "Formation supprimée avec succès !" });
    } catch (error) {
        console.error("❌ Erreur SQL :", error);
        res.status(500).json({ erreur: "Erreur serveur.", details: error.message });
    }
});

/* ✅ 📌 Rechercher une formation */
formationsRoutes.get("/rechercher", async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ erreur: "Le paramètre 'query' est requis." });
    }

    try {
        const [formations] = await baseDeDonnees.query(
            "SELECT * FROM formations WHERE nomFormation LIKE ?",
            [`%${query}%`]
        );
        res.status(200).json(formations);
    } catch (error) {
        console.error("❌ Erreur lors de la recherche :", error);
        res.status(500).json({ erreur: "Erreur serveur." });
    }
});


/* 📌 Récupérer toutes les formations */
formationsRoutes.get("/", async (req, res) => {
    try {
        console.log("📤 Récupération des formations...");
        const [formations] = await baseDeDonnees.query("SELECT * FROM formations");
        res.status(200).json(formations);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération :", error);
        res.status(500).json({ erreur: "Erreur serveur.", details: error.message });
    }
});

formationsRoutes.get("/universite/:universite", async (req, res) => {
    const { universite } = req.params;
    try {
        const requete = `SELECT * FROM formations WHERE universite = ?`;
        const [resultats] = await baseDeDonnees.query(requete, [universite]);

        if (resultats.length === 0) {
            return res.status(404).json({ message: "Aucune formation trouvée pour cette université." });
        }

        res.status(200).json(resultats);
    } catch (error) {
        console.error("Erreur lors de la récupération des formations :", error);
        res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
});


export default formationsRoutes;
