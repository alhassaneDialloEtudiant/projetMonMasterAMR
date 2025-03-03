import { Router } from 'express';
import { baseDeDonnees } from '../db/baseDeDonnees.mjs';

const routeurProgrammes = Router();

// Route pour ajouter un programme
routeurProgrammes.post('/ajouter', async (req, res) => {
    const { nomProgramme, descriptionProgramme, dureeProgramme, idEtablissement, placesDisponibles } = req.body;

    try {
        if (!nomProgramme || !descriptionProgramme || !dureeProgramme || !idEtablissement || !placesDisponibles) {
            return res.status(400).json({ erreur: 'Tous les champs sont obligatoires.' });
        }

        const requeteAjoutProgramme = `
            INSERT INTO programmes (nomProgramme, descriptionProgramme, dureeProgramme, idEtablissement, placesDisponibles)
            VALUES (?, ?, ?, ?, ?)
        `;
        await baseDeDonnees.query(requeteAjoutProgramme, [
            nomProgramme,
            descriptionProgramme,
            dureeProgramme,
            idEtablissement,
            placesDisponibles
        ]);

        res.status(201).json({ message: 'Programme ajouté avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l’ajout du programme :', error);
        res.status(500).json({ erreur: 'Erreur lors de l’ajout du programme.', details: error.message });
    }
});

// Route pour récupérer un programme par son ID
routeurProgrammes.get('/afficher/:idProgramme', async (req, res) => {
    const { idProgramme } = req.params;

    try {
        const requeteRecupererProgrammeParId = `
            SELECT * FROM programmes WHERE idProgramme = ?
        `;
        const [resultats] = await baseDeDonnees.query(requeteRecupererProgrammeParId, [idProgramme]);

        if (resultats.length === 0) {
            return res.status(404).json({ erreur: 'Programme non trouvé.' });
        }

        res.status(200).json(resultats[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération du programme :', error);
        res.status(500).json({ erreur: 'Erreur lors de la récupération du programme.', details: error.message });
    }
});

// Route pour modifier un programme
routeurProgrammes.put('/modifier/:idProgramme', async (req, res) => {
    const { idProgramme } = req.params;
    const { nomProgramme, descriptionProgramme, dureeProgramme, placesDisponibles } = req.body;

    if (!nomProgramme || !descriptionProgramme || !dureeProgramme || !placesDisponibles) {
        return res.status(400).json({ erreur: 'Tous les champs sont obligatoires.' });
    }

    try {
        const requeteModifierProgramme = `
            UPDATE programmes
            SET nomProgramme = ?, descriptionProgramme = ?, dureeProgramme = ?, placesDisponibles = ?
            WHERE idProgramme = ?
        `;
        const [resultat] = await baseDeDonnees.query(requeteModifierProgramme, [
            nomProgramme,
            descriptionProgramme,
            dureeProgramme,
            placesDisponibles,
            idProgramme,
        ]);

        if (resultat.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Programme non trouvé.' });
        }

        res.status(200).json({ message: 'Programme modifié avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du programme :', error);
        res.status(500).json({ erreur: 'Erreur lors de la mise à jour du programme.', details: error.message });
    }
});


// Route pour récupérer tous les programmes
routeurProgrammes.get('/afficher', async (req, res) => {
    try {
        const query = `
            SELECT p.idProgramme, p.nomProgramme, p.descriptionProgramme, p.dureeProgramme, p.placesDisponibles,
                   e.nomEtablissement
            FROM programmes p
            JOIN etablissements e ON p.idEtablissement = e.idEtablissement
        `;
        const [resultats] = await baseDeDonnees.query(query);
        res.status(200).json(resultats);
    } catch (error) {
        console.error("Erreur lors de la récupération des programmes :", error);
        res.status(500).json({ erreur: 'Erreur interne lors de la récupération des programmes.' });
    }
});

// Route pour récupérer les établissements
routeurProgrammes.get('/etablissements', async (req, res) => {
    try {
        const requete = `
            SELECT idEtablissement, nomEtablissement 
            FROM etablissements
        `;
        const [resultats] = await baseDeDonnees.query(requete);
        res.status(200).json(resultats);
    } catch (error) {
        console.error("Erreur lors de la récupération des établissements :", error);
        res.status(500).json({ erreur: "Erreur lors de la récupération des établissements." });
    }
});
// Route pour supprimer un programme
routeurProgrammes.delete('/supprimer/:idProgramme', async (req, res) => {
    const { idProgramme } = req.params;
  
    try {
      const requeteSupprimerProgramme = `
        DELETE FROM programmes WHERE idProgramme = ?
      `;
      const [resultat] = await baseDeDonnees.query(requeteSupprimerProgramme, [idProgramme]);
  
      if (resultat.affectedRows === 0) {
        return res.status(404).json({ erreur: 'Programme non trouvé.' });
      }
  
      res.status(200).json({ message: 'Programme supprimé avec succès.' });
    } catch (error) {
      console.error('Erreur lors de la suppression du programme :', error);
      res.status(500).json({ erreur: 'Erreur lors de la suppression du programme.', details: error.message });
    }
  });

export default routeurProgrammes;
