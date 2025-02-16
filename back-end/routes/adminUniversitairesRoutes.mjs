import express from "express";
import { 
    getAdminsUniversitaires, 
    addAdminUniversitaire, 
    updateAdminUniversitaire, 
    deleteAdminUniversitaire 
} from "../controllers/adminUniversitairesController.mjs";

const router = express.Router();

router.get("/", getAdminsUniversitaires);  // Récupérer tous les admins universitaires
router.post("/", addAdminUniversitaire);  // Ajouter un admin universitaire
router.put("/:id", updateAdminUniversitaire);  // Modifier un admin universitaire
router.delete("/:id", deleteAdminUniversitaire);  // Supprimer un admin universitaire

export default router;
