-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 09 mars 2025 à 02:09
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `projetmaster`
--

-- --------------------------------------------------------

--
-- Structure de la table `admingeneraux`
--

CREATE TABLE `admingeneraux` (
  `idAdminGeneral` varchar(10) NOT NULL,
  `idUtilisateur` varchar(10) NOT NULL,
  `pouvoirAdmin` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admingeneraux`
--

INSERT INTO `admingeneraux` (`idAdminGeneral`, `idUtilisateur`, `pouvoirAdmin`) VALUES
('ADMGEN1157', 'USER16544', 'salaire 1'),
('ADMGEN9576', 'USER09289', 'general admin');

--
-- Déclencheurs `admingeneraux`
--
DELIMITER $$
CREATE TRIGGER `avantInsertionAdminGeneraux` BEFORE INSERT ON `admingeneraux` FOR EACH ROW BEGIN
    SET NEW.idAdminGeneral = CONCAT('ADMGEN', LPAD(FLOOR(RAND() * 99999), 5, '0')); -- Génère un ID aléatoire
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `adminuniversitaires`
--

CREATE TABLE `adminuniversitaires` (
  `idAdminUniversitaire` varchar(10) NOT NULL,
  `idUtilisateur` varchar(10) NOT NULL,
  `idEtablissement` varchar(10) NOT NULL,
  `poste` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `adminuniversitaires`
--

INSERT INTO `adminuniversitaires` (`idAdminUniversitaire`, `idUtilisateur`, `idEtablissement`, `poste`) VALUES
('ADMUNIV944', 'USER33040', 'ETAB17524', 'rosane');

--
-- Déclencheurs `adminuniversitaires`
--
DELIMITER $$
CREATE TRIGGER `avantInsertionAdminUniversitaires` BEFORE INSERT ON `adminuniversitaires` FOR EACH ROW BEGIN
    SET NEW.idAdminUniversitaire = CONCAT('ADMUNIV', LPAD(FLOOR(RAND() * 99999), 5, '0')); -- Génère un ID aléatoire
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `baccalaureat`
--

CREATE TABLE `baccalaureat` (
  `baccalaureatId` varchar(10) NOT NULL,
  `etudiantId` varchar(10) NOT NULL,
  `anneeObtention` year(4) NOT NULL,
  `typeBac` varchar(100) NOT NULL,
  `serie` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déclencheurs `baccalaureat`
--
DELIMITER $$
CREATE TRIGGER `before_insert_baccalaureat` BEFORE INSERT ON `baccalaureat` FOR EACH ROW BEGIN
    SET NEW.baccalaureatId = CONCAT('BAC', LPAD(FLOOR(RAND() * 9999), 4, '0'));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `candidatures`
--

CREATE TABLE `candidatures` (
  `idCandidature` varchar(10) NOT NULL,
  `idUtilisateur` varchar(10) NOT NULL,
  `idProgramme` varchar(10) NOT NULL,
  `statutCandidature` enum('enAttente','acceptee','refusee') DEFAULT 'enAttente',
  `dateSoumission` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déclencheurs `candidatures`
--
DELIMITER $$
CREATE TRIGGER `avantInsertionCandidatures` BEFORE INSERT ON `candidatures` FOR EACH ROW BEGIN
    SET NEW.idCandidature = CONCAT('CAND', LPAD(FLOOR(RAND() * 99999), 5, '0')); -- Génère un ID aléatoire
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `coordonnees`
--

CREATE TABLE `coordonnees` (
  `coordonneesId` varchar(10) NOT NULL,
  `etudiantId` varchar(10) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `ville` varchar(100) NOT NULL,
  `codePostal` varchar(10) NOT NULL,
  `pays` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déclencheurs `coordonnees`
--
DELIMITER $$
CREATE TRIGGER `before_insert_coordonnees` BEFORE INSERT ON `coordonnees` FOR EACH ROW BEGIN
    SET NEW.coordonneesId = CONCAT('COORD', LPAD(FLOOR(RAND() * 9999), 4, '0'));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `criteresadmissions`
--

CREATE TABLE `criteresadmissions` (
  `idCritere` varchar(10) NOT NULL,
  `idProgramme` varchar(10) NOT NULL,
  `descriptionCritere` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déclencheurs `criteresadmissions`
--
DELIMITER $$
CREATE TRIGGER `avantInsertionCriteres` BEFORE INSERT ON `criteresadmissions` FOR EACH ROW BEGIN
    SET NEW.idCritere = CONCAT('CRIT', LPAD(FLOOR(RAND() * 99999), 5, '0')); -- Génère un ID aléatoire
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `cv`
--

CREATE TABLE `cv` (
  `cvId` varchar(10) NOT NULL,
  `etudiantId` varchar(10) NOT NULL,
  `fichierCV` varchar(255) NOT NULL,
  `dateUpload` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déclencheurs `cv`
--
DELIMITER $$
CREATE TRIGGER `before_insert_cv` BEFORE INSERT ON `cv` FOR EACH ROW BEGIN
    SET NEW.cvId = CONCAT('CV', LPAD(FLOOR(RAND() * 9999), 4, '0'));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `documents`
--

CREATE TABLE `documents` (
  `idDocument` varchar(10) NOT NULL,
  `idCandidature` varchar(10) NOT NULL,
  `typeDocument` varchar(50) NOT NULL,
  `cheminFichier` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déclencheurs `documents`
--
DELIMITER $$
CREATE TRIGGER `avantInsertionDocuments` BEFORE INSERT ON `documents` FOR EACH ROW BEGIN
    SET NEW.idDocument = CONCAT('DOC', LPAD(FLOOR(RAND() * 99999), 5, '0')); -- Génère un ID aléatoire
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `etablissements`
--

CREATE TABLE `etablissements` (
  `idEtablissement` varchar(10) NOT NULL,
  `nomEtablissement` varchar(150) NOT NULL,
  `adresseEtablissement` varchar(255) DEFAULT NULL,
  `contactEtablissement` varchar(100) DEFAULT NULL,
  `localisationEtablissement` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `etablissements`
--

INSERT INTO `etablissements` (`idEtablissement`, `nomEtablissement`, `adresseEtablissement`, `contactEtablissement`, `localisationEtablissement`) VALUES
('ETAB17524', 'Université D\'Évry Val d\'essone', 'alascodiallo@gmail.com ', '075384617022', '15 rue le bosquet les Ulis,91940'),
('ETAB92393', 'Université D\'Évry Paris-Saclay', 'alascodiallo@gmail.com ', '0753846170', '15 rue le bosquet les Ulis,91940'),
('ETAB98409', 'Université D\'Évry Paris-Saclay', 'alascodiallo@gmail.com ', '0753846170', '15 rue le bosquet les Ulis,91940');

--
-- Déclencheurs `etablissements`
--
DELIMITER $$
CREATE TRIGGER `avantInsertionEtablissements` BEFORE INSERT ON `etablissements` FOR EACH ROW BEGIN
    SET NEW.idEtablissement = CONCAT('ETAB', LPAD(FLOOR(RAND() * 99999), 5, '0')); -- Génère un ID aléatoire
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `etudiants`
--

CREATE TABLE `etudiants` (
  `idEtudiant` varchar(10) NOT NULL,
  `idUtilisateur` varchar(10) NOT NULL,
  `numeroEtudiant` varchar(50) NOT NULL,
  `niveauEtudiant` varchar(50) NOT NULL,
  `dateInscription` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `etudiants`
--

INSERT INTO `etudiants` (`idEtudiant`, `idUtilisateur`, `numeroEtudiant`, `niveauEtudiant`, `dateInscription`) VALUES
('ETUD64192', 'USER42314', '1', 'L3 info', '2025-01-16'),
('ETUD64926', 'USER85117', '12345632', 'L3 CHIMIE ⚗', '2025-02-15');

--
-- Déclencheurs `etudiants`
--
DELIMITER $$
CREATE TRIGGER `avantInsertionEtudiants` BEFORE INSERT ON `etudiants` FOR EACH ROW BEGIN
    SET NEW.idEtudiant = CONCAT('ETUD', LPAD(FLOOR(RAND() * 99999), 5, '0')); -- Génère un ID aléatoire
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `experiencespro`
--

CREATE TABLE `experiencespro` (
  `experienceId` varchar(10) NOT NULL,
  `etudiantId` varchar(10) NOT NULL,
  `entreprise` varchar(255) NOT NULL,
  `poste` varchar(100) NOT NULL,
  `dateDebut` date NOT NULL,
  `dateFin` date DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déclencheurs `experiencespro`
--
DELIMITER $$
CREATE TRIGGER `before_insert_experiencesPro` BEFORE INSERT ON `experiencespro` FOR EACH ROW BEGIN
    SET NEW.experienceId = CONCAT('EXP', LPAD(FLOOR(RAND() * 9999), 4, '0'));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `idNotification` varchar(10) NOT NULL,
  `idUtilisateur` varchar(10) NOT NULL,
  `messageNotification` text NOT NULL,
  `dateEnvoi` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déclencheurs `notifications`
--
DELIMITER $$
CREATE TRIGGER `avantInsertionNotifications` BEFORE INSERT ON `notifications` FOR EACH ROW BEGIN
    SET NEW.idNotification = CONCAT('NOTIF', LPAD(FLOOR(RAND() * 99999), 5, '0')); -- Génère un ID aléatoire
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `programmes`
--

CREATE TABLE `programmes` (
  `idProgramme` varchar(10) NOT NULL,
  `idEtablissement` varchar(10) NOT NULL,
  `nomProgramme` varchar(150) NOT NULL,
  `descriptionProgramme` text DEFAULT NULL,
  `dureeProgramme` varchar(50) DEFAULT NULL,
  `placesDisponibles` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `programmes`
--

INSERT INTO `programmes` (`idProgramme`, `idEtablissement`, `nomProgramme`, `descriptionProgramme`, `dureeProgramme`, `placesDisponibles`) VALUES
('PROG35412', 'ETAB17524', 'Raissa ', 'rttrtr', '2 ans ', 14),
('PROG37887', 'ETAB17524', 'Diallo Alhassane DIALLO', 'ff', '2 ans ', 233),
('PROG40365', 'ETAB92393', 'Diallo Alhassane DIALLO', 'FF', '2 ans ', 233),
('PROG42268', 'ETAB92393', 'ALHASSANE DIALLO', 'DYYYDAYAYY', '2 ans ', 2),
('PROG58972', 'ETAB17524', 'Raissa ', 'ee', '2 ans ', 14),
('PROG64484', 'ETAB92393', 'Diallo Alhassane DIALLO', 'GG', '2 ans ', 233),
('PROG86374', 'ETAB17524', 'ALHASSANE DIALLO', 'rr', '3 ans', 2);

--
-- Déclencheurs `programmes`
--
DELIMITER $$
CREATE TRIGGER `avantInsertionProgrammes` BEFORE INSERT ON `programmes` FOR EACH ROW BEGIN
    SET NEW.idProgramme = CONCAT('PROG', LPAD(FLOOR(RAND() * 99999), 5, '0')); -- Génère un ID aléatoire
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `relevesnotes`
--

CREATE TABLE `relevesnotes` (
  `releveId` varchar(10) NOT NULL,
  `etudiantId` varchar(10) NOT NULL,
  `fichierReleve` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déclencheurs `relevesnotes`
--
DELIMITER $$
CREATE TRIGGER `before_insert_relevesNotes` BEFORE INSERT ON `relevesnotes` FOR EACH ROW BEGIN
    SET NEW.releveId = CONCAT('REL', LPAD(FLOOR(RAND() * 9999), 4, '0'));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `stages`
--

CREATE TABLE `stages` (
  `stageId` varchar(10) NOT NULL,
  `etudiantId` varchar(10) NOT NULL,
  `entreprise` varchar(255) NOT NULL,
  `poste` varchar(100) NOT NULL,
  `dateDebut` date NOT NULL,
  `dateFin` date DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déclencheurs `stages`
--
DELIMITER $$
CREATE TRIGGER `before_insert_stages` BEFORE INSERT ON `stages` FOR EACH ROW BEGIN
    SET NEW.stageId = CONCAT('STAGE', LPAD(FLOOR(RAND() * 9999), 4, '0'));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `idUtilisateur` varchar(10) NOT NULL,
  `nomUtilisateur` varchar(100) NOT NULL,
  `prenomUtilisateur` varchar(100) NOT NULL,
  `emailUtilisateur` varchar(150) NOT NULL,
  `motDePasseUtilisateur` varchar(255) NOT NULL,
  `roleUtilisateur` enum('Etudiant','AdminGeneral','AdminUniversitaire') DEFAULT 'Etudiant',
  `status` enum('actif','inactif','suspendu') DEFAULT 'actif'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`idUtilisateur`, `nomUtilisateur`, `prenomUtilisateur`, `emailUtilisateur`, `motDePasseUtilisateur`, `roleUtilisateur`, `status`) VALUES
('USER03767', 'DIALLO', ' Alhassane evry', 'alhassane.diallo1.etu@gmail.com', '$2b$10$ebOitPJ162W7qX1la3jtOu0QYgQAtgawknE.1dFw7FNZ3NbP6bzey', 'Etudiant', 'actif'),
('USER09289', 'CAMARA', 'Alhassane', 'alhassane.diallo41.etu@gmail.com', '$2b$10$V2ZZi3w0ghzaa7tf3srrqOMdLnY5utfCmJ7p9JHFpJ2Y36Doh2Iou', 'AdminGeneral', 'actif'),
('USER10801', 'barry ', 'atigou', 'atigou@gmail.com', '123456789', 'Etudiant', 'actif'),
('USER16544', 'BAH', 'soumah', 'alascodiallo1111@gmail.com', '$2b$10$2KT3K5dTfm8MoTNNCAL6XuQ9jzK6SNjZwIBszpiKExp5c1V3r/VN.', 'AdminGeneral', 'actif'),
('USER28599', 'barry ', 'atigou1', 'a@gmail.com', '$2b$10$fg59QL5ib8vs2axfwRZcXO1daYMCJsCOipRZeqeNR9ropR9dawoie', 'Etudiant', 'actif'),
('USER33040', 'SYLLA', 'Diallo Alhassane', 'alhassane.diallo.23etu@gmail.com', '$2b$10$E1UaHRwIlXD.vqTeko30D.q1vtT0tYxIypyJkyXOZM1pXzIe2VjB2', 'AdminUniversitaire', 'actif'),
('USER33851', 'Diallo  Alhassane', 'Président', 'alascodiallo@gmail.com', '$2b$10$zqwm4SN3MgkxzlP7PA4Zo.VzzbjNX/yUw8KRsQsOfOjK4VD/o3bbK', 'AdminGeneral', 'actif'),
('USER42314', 'Diallo', 'Alhassane', 'alhassane.diallo11.etu@gmail.com', '$2b$10$cpwufJLioqChPEbfvOm2G.aqy4PPInRtn0k13Cn5dT5/Utalpgc9q', 'Etudiant', 'actif'),
('USER51878', 'Raissa', 'camara', 'raissa@gmail.com', '$2b$10$jA8mfTg0iUQU8kxMWlBN/.bLWBcqAVgEYMI/igzZ8WM6bNBrLcBlK', 'Etudiant', 'actif'),
('USER53901', 'Diallo', 'Alseny', 'alascodiallo111@gmail.com', '$2b$10$bRMGnIJz5W/iYHE/sab21ejrcbPO4b3vHSShpeDLHTexttNT0Hc7a', 'Etudiant', 'actif'),
('USER66749', 'Diallo', 'Alhassane', 'diallo@gmail.com', '$2b$10$ZX5sZeFTvgM/gv7cGrzuMeC3vW8Wd4dCA8cMi/GjcEyG66ZWw95Li', 'Etudiant', 'actif'),
('USER69604', 'BAH', 'aplha', 'alpha@gmail.com', '&é\"\'(-', 'Etudiant', 'actif'),
('USER70385', 'sow', 'fatima', 'fatima@gmail.com', '$2b$10$7/oCmf0mL.7AXe1L.QFuB.FVYrGeslDdOUldPS/kB8Hj3TRdjihhm', 'Etudiant', 'actif'),
('USER85117', 'sow', 'oumar', 'alala@gmail.com', 'dill]@gm', 'Etudiant', 'actif'),
('USER97142', 'DIALLO', 'Diallo Alhassane', 'alhassane.diallo.etu@gmail.com', '$2b$10$EtCtTU.PUqxyJn4JME0pZ.tAGL.RYrBXeH9.9TE8kVnO9zH5MhkBq', 'Etudiant', 'actif');

--
-- Déclencheurs `utilisateurs`
--
DELIMITER $$
CREATE TRIGGER `avantInsertionUtilisateurs` BEFORE INSERT ON `utilisateurs` FOR EACH ROW BEGIN
    SET NEW.idUtilisateur = CONCAT('USER', LPAD(FLOOR(RAND() * 99999), 5, '0')); -- Génère un ID aléatoire
END
$$
DELIMITER ;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admingeneraux`
--
ALTER TABLE `admingeneraux`
  ADD PRIMARY KEY (`idAdminGeneral`),
  ADD KEY `idUtilisateur` (`idUtilisateur`);

--
-- Index pour la table `adminuniversitaires`
--
ALTER TABLE `adminuniversitaires`
  ADD PRIMARY KEY (`idAdminUniversitaire`),
  ADD KEY `idUtilisateur` (`idUtilisateur`),
  ADD KEY `idEtablissement` (`idEtablissement`);

--
-- Index pour la table `baccalaureat`
--
ALTER TABLE `baccalaureat`
  ADD PRIMARY KEY (`baccalaureatId`),
  ADD KEY `etudiantId` (`etudiantId`);

--
-- Index pour la table `candidatures`
--
ALTER TABLE `candidatures`
  ADD PRIMARY KEY (`idCandidature`),
  ADD KEY `idUtilisateur` (`idUtilisateur`),
  ADD KEY `idProgramme` (`idProgramme`);

--
-- Index pour la table `coordonnees`
--
ALTER TABLE `coordonnees`
  ADD PRIMARY KEY (`coordonneesId`),
  ADD KEY `etudiantId` (`etudiantId`);

--
-- Index pour la table `criteresadmissions`
--
ALTER TABLE `criteresadmissions`
  ADD PRIMARY KEY (`idCritere`),
  ADD KEY `idProgramme` (`idProgramme`);

--
-- Index pour la table `cv`
--
ALTER TABLE `cv`
  ADD PRIMARY KEY (`cvId`),
  ADD KEY `etudiantId` (`etudiantId`);

--
-- Index pour la table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`idDocument`),
  ADD KEY `idCandidature` (`idCandidature`);

--
-- Index pour la table `etablissements`
--
ALTER TABLE `etablissements`
  ADD PRIMARY KEY (`idEtablissement`);

--
-- Index pour la table `etudiants`
--
ALTER TABLE `etudiants`
  ADD PRIMARY KEY (`idEtudiant`),
  ADD UNIQUE KEY `matricule` (`numeroEtudiant`),
  ADD KEY `idUtilisateur` (`idUtilisateur`);

--
-- Index pour la table `experiencespro`
--
ALTER TABLE `experiencespro`
  ADD PRIMARY KEY (`experienceId`),
  ADD KEY `etudiantId` (`etudiantId`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`idNotification`),
  ADD KEY `idUtilisateur` (`idUtilisateur`);

--
-- Index pour la table `programmes`
--
ALTER TABLE `programmes`
  ADD PRIMARY KEY (`idProgramme`),
  ADD KEY `idEtablissement` (`idEtablissement`);

--
-- Index pour la table `relevesnotes`
--
ALTER TABLE `relevesnotes`
  ADD PRIMARY KEY (`releveId`),
  ADD KEY `etudiantId` (`etudiantId`);

--
-- Index pour la table `stages`
--
ALTER TABLE `stages`
  ADD PRIMARY KEY (`stageId`),
  ADD KEY `etudiantId` (`etudiantId`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`idUtilisateur`),
  ADD UNIQUE KEY `emailUtilisateur` (`emailUtilisateur`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `admingeneraux`
--
ALTER TABLE `admingeneraux`
  ADD CONSTRAINT `admingeneraux_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateurs` (`idUtilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `adminuniversitaires`
--
ALTER TABLE `adminuniversitaires`
  ADD CONSTRAINT `adminuniversitaires_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateurs` (`idUtilisateur`) ON DELETE CASCADE,
  ADD CONSTRAINT `adminuniversitaires_ibfk_2` FOREIGN KEY (`idEtablissement`) REFERENCES `etablissements` (`idEtablissement`) ON DELETE CASCADE;

--
-- Contraintes pour la table `baccalaureat`
--
ALTER TABLE `baccalaureat`
  ADD CONSTRAINT `baccalaureat_ibfk_1` FOREIGN KEY (`etudiantId`) REFERENCES `etudiants` (`idEtudiant`) ON DELETE CASCADE;

--
-- Contraintes pour la table `candidatures`
--
ALTER TABLE `candidatures`
  ADD CONSTRAINT `candidatures_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateurs` (`idUtilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `coordonnees`
--
ALTER TABLE `coordonnees`
  ADD CONSTRAINT `coordonnees_ibfk_1` FOREIGN KEY (`etudiantId`) REFERENCES `etudiants` (`idEtudiant`) ON DELETE CASCADE;

--
-- Contraintes pour la table `criteresadmissions`
--
ALTER TABLE `criteresadmissions`
  ADD CONSTRAINT `criteresadmissions_ibfk_1` FOREIGN KEY (`idProgramme`) REFERENCES `programmes` (`idProgramme`) ON DELETE CASCADE;

--
-- Contraintes pour la table `cv`
--
ALTER TABLE `cv`
  ADD CONSTRAINT `cv_ibfk_1` FOREIGN KEY (`etudiantId`) REFERENCES `etudiants` (`idEtudiant`) ON DELETE CASCADE;

--
-- Contraintes pour la table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`idCandidature`) REFERENCES `candidatures` (`idCandidature`) ON DELETE CASCADE;

--
-- Contraintes pour la table `etudiants`
--
ALTER TABLE `etudiants`
  ADD CONSTRAINT `etudiants_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateurs` (`idUtilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `experiencespro`
--
ALTER TABLE `experiencespro`
  ADD CONSTRAINT `experiencespro_ibfk_1` FOREIGN KEY (`etudiantId`) REFERENCES `etudiants` (`idEtudiant`) ON DELETE CASCADE;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateurs` (`idUtilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `programmes`
--
ALTER TABLE `programmes`
  ADD CONSTRAINT `programmes_ibfk_1` FOREIGN KEY (`idEtablissement`) REFERENCES `etablissements` (`idEtablissement`) ON DELETE CASCADE;

--
-- Contraintes pour la table `relevesnotes`
--
ALTER TABLE `relevesnotes`
  ADD CONSTRAINT `relevesnotes_ibfk_1` FOREIGN KEY (`etudiantId`) REFERENCES `etudiants` (`idEtudiant`) ON DELETE CASCADE;

--
-- Contraintes pour la table `stages`
--
ALTER TABLE `stages`
  ADD CONSTRAINT `stages_ibfk_1` FOREIGN KEY (`etudiantId`) REFERENCES `etudiants` (`idEtudiant`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
