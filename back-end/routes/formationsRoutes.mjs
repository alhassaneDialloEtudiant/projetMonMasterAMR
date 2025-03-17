import { Router } from "express";
import { baseDeDonnees } from "../db/baseDeDonnees.mjs";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import fs from "fs";
import path from "path";

const formationsRoutes = Router();

// 📌 Configuration pour l'upload de logo
const stockage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/formations/";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // Créer le dossier si inexistant
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: stockage });

/* 📌 Ajouter une formation */
formationsRoutes.post("/ajouter", upload.single("logo"), async (req, res) => {
    console.log("📥 Requête reçue pour ajouter une formation !");
    console.log("Données reçues :", req.body);
    console.log("Fichier reçu :", req.file ? req.file.filename : "Aucun fichier reçu");

    const { universite, nomFormation, typeFormation, capacite, tauxAcces, localisation } = req.body;
    if (!universite || !nomFormation || !typeFormation || !capacite || !tauxAcces || !localisation) {
        return res.status(400).json({ erreur: "Tous les champs sont obligatoires !" });
    }

    const logo = req.file ? req.file.filename : null;
    const idFormation = uuidv4();

    try {
        console.log("📌 Exécution de la requête SQL...");
        const [result] = await baseDeDonnees.query(
            "INSERT INTO formations (idFormation, universite, nomFormation, typeFormation, capacite, tauxAcces, localisation, logo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [idFormation, universite, nomFormation, typeFormation, capacite, tauxAcces, localisation, logo]
        );

        console.log("✅ Formation ajoutée avec succès !");
        res.status(201).json({ message: "Formation ajoutée avec succès.", idFormation });
    } catch (error) {
        console.error("❌ Erreur SQL :", error);
        res.status(500).json({ erreur: "Erreur serveur.", details: error.message });
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

/* 📌 Modifier une formation */
formationsRoutes.put("/modifier/:idFormation", upload.single("logo"), async (req, res) => {
    console.log("📤 Requête reçue pour modifier une formation !");
    const { idFormation } = req.params;
    const { universite, nomFormation, typeFormation, capacite, tauxAcces, localisation } = req.body;
    if (!universite || !nomFormation || !typeFormation || !capacite || !tauxAcces || !localisation) {
        return res.status(400).json({ erreur: "Tous les champs sont obligatoires pour la modification !" });
    }

    let logo = req.body.logo;
    if (req.file) {
        logo = req.file.filename;
    }

    try {
        console.log("📌 Exécution de la requête SQL...");
        const [result] = await baseDeDonnees.query(
            "UPDATE formations SET universite = ?, nomFormation = ?, typeFormation = ?, capacite = ?, tauxAcces = ?, localisation = ?, logo = ? WHERE idFormation = ?",
            [universite, nomFormation, typeFormation, capacite, tauxAcces, localisation, logo, idFormation]
        );

        console.log("✅ Formation mise à jour avec succès !");
        res.status(200).json({ message: "Formation mise à jour avec succès." });
    } catch (error) {
        console.error("❌ Erreur SQL :", error);
        res.status(500).json({ erreur: "Erreur serveur.", details: error.message });
    }
});

/* 📌 Supprimer une formation */
formationsRoutes.delete("/supprimer/:idFormation", async (req, res) => {
    console.log("🗑 Requête reçue pour supprimer une formation !");
    const { idFormation } = req.params;
    try {
        // Vérifier si la formation existe
        const [formation] = await baseDeDonnees.query("SELECT logo FROM formations WHERE idFormation = ?", [idFormation]);

        if (formation.length === 0) {
            return res.status(404).json({ erreur: "Formation non trouvée !" });
        }

        // Supprimer l'image associée
        if (formation[0].logo) {
            const logoPath = path.join("uploads/formations/", formation[0].logo);
            if (fs.existsSync(logoPath)) {
                fs.unlinkSync(logoPath); // Supprimer le fichier
                console.log("🗑 Logo supprimé :", logoPath);
            }
        }

        await baseDeDonnees.query("DELETE FROM formations WHERE idFormation = ?", [idFormation]);

        console.log("✅ Formation supprimée avec succès !");
        res.status(200).json({ message: "Formation supprimée avec succès !" });
    } catch (error) {
        console.error("❌ Erreur SQL :", error);
        res.status(500).json({ erreur: "Erreur serveur.", details: error.message });
    }
});

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
        console.error("Erreur lors de la recherche :", error);
        res.status(500).json({ erreur: "Erreur serveur." });
    }
});


export default formationsRoutes;
