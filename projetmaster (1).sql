-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 01 fév. 2025 à 00:28
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
('ADMGEN1116', 'USER33851', 'general'),
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
  ` poste` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
('ETUD11075', 'USER85117', '432123', 'L3 BIO', '2025-01-17'),
('ETUD64192', 'USER42314', '123456', 'L3 info', '2025-01-16');

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
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `idUtilisateur` varchar(10) NOT NULL,
  `nomUtilisateur` varchar(100) NOT NULL,
  `prenomUtilisateur` varchar(100) NOT NULL,
  `emailUtilisateur` varchar(150) NOT NULL,
  `motDePasseUtilisateur` varchar(255) NOT NULL,
  `roleUtilisateur` enum('Etudiant','AdminGeneral','AdminUniversitaire') DEFAULT 'Etudiant'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`idUtilisateur`, `nomUtilisateur`, `prenomUtilisateur`, `emailUtilisateur`, `motDePasseUtilisateur`, `roleUtilisateur`) VALUES
('USER05899', 'Diallo', 'Alhassane', 'alhassane.diallo.etu@gmail.com', '$2b$10$dXzby2IBmW.hYEDWrdQQLOF6flsehX0HwHv75JlHtzyXi6b5TDb4W', 'AdminUniversitaire'),
('USER09289', 'CAMARA', 'Alhassane', 'alhassane.diallo41.etu@gmail.com', '$2b$10$V2ZZi3w0ghzaa7tf3srrqOMdLnY5utfCmJ7p9JHFpJ2Y36Doh2Iou', 'AdminGeneral'),
('USER16544', 'BAH', 'soumah', 'alascodiallo1111@gmail.com', '$2b$10$2KT3K5dTfm8MoTNNCAL6XuQ9jzK6SNjZwIBszpiKExp5c1V3r/VN.', 'AdminGeneral'),
('USER33851', 'Diallo  Alhassane', 'Président', 'alascodiallo@gmail.com', '$2b$10$zqwm4SN3MgkxzlP7PA4Zo.VzzbjNX/yUw8KRsQsOfOjK4VD/o3bbK', 'AdminGeneral'),
('USER42314', 'Diallo', 'Alhassane', 'alhassane.diallo11.etu@gmail.com', '$2b$10$cpwufJLioqChPEbfvOm2G.aqy4PPInRtn0k13Cn5dT5/Utalpgc9q', 'Etudiant'),
('USER85117', 'sow', 'oumar', 'alala@gmail.com', 'dill]@gm', 'Etudiant');

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
-- Index pour la table `candidatures`
--
ALTER TABLE `candidatures`
  ADD PRIMARY KEY (`idCandidature`),
  ADD KEY `idUtilisateur` (`idUtilisateur`),
  ADD KEY `idProgramme` (`idProgramme`);

--
-- Index pour la table `criteresadmissions`
--
ALTER TABLE `criteresadmissions`
  ADD PRIMARY KEY (`idCritere`),
  ADD KEY `idProgramme` (`idProgramme`);

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
-- Contraintes pour la table `candidatures`
--
ALTER TABLE `candidatures`
  ADD CONSTRAINT `candidatures_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateurs` (`idUtilisateur`) ON DELETE CASCADE,
  ADD CONSTRAINT `candidatures_ibfk_2` FOREIGN KEY (`idProgramme`) REFERENCES `programmes` (`idProgramme`) ON DELETE CASCADE;

--
-- Contraintes pour la table `criteresadmissions`
--
ALTER TABLE `criteresadmissions`
  ADD CONSTRAINT `criteresadmissions_ibfk_1` FOREIGN KEY (`idProgramme`) REFERENCES `programmes` (`idProgramme`) ON DELETE CASCADE;

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
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateurs` (`idUtilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `programmes`
--
ALTER TABLE `programmes`
  ADD CONSTRAINT `programmes_ibfk_1` FOREIGN KEY (`idEtablissement`) REFERENCES `etablissements` (`idEtablissement`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
