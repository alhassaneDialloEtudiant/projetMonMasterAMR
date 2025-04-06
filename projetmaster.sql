-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 06 avr. 2025 à 17:06
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
-- Structure de la table `baccalaureats`
--

CREATE TABLE `baccalaureats` (
  `baccalaureatId` varchar(10) NOT NULL,
  `idUtilisateur` varchar(10) NOT NULL,
  `anneeObtention` year(4) NOT NULL,
  `typeBaccalaureat` varchar(100) NOT NULL,
  `serieBaccalaureat` varchar(100) NOT NULL,
  `paysObtention` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `baccalaureats`
--

INSERT INTO `baccalaureats` (`baccalaureatId`, `idUtilisateur`, `anneeObtention`, `typeBaccalaureat`, `serieBaccalaureat`, `paysObtention`) VALUES
('BAC3611', 'USER70822', '2023', 'Général', 'Scientifique', 'France');

--
-- Déclencheurs `baccalaureats`
--
DELIMITER $$
CREATE TRIGGER `before_insert_baccalaureats` BEFORE INSERT ON `baccalaureats` FOR EACH ROW BEGIN
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
  `idFormation` varchar(10) NOT NULL,
  `lettreMotivation` text NOT NULL,
  `cv` varchar(255) NOT NULL,
  `releveNotes` varchar(255) NOT NULL,
  `diplome` varchar(255) NOT NULL,
  `justificatifSupplementaire` varchar(255) DEFAULT NULL,
  `commentaire` text DEFAULT NULL,
  `demandeSupplementaire` varchar(100) NOT NULL,
  `statut` enum('en attente','acceptée','refusée','liste d''attente') DEFAULT 'en attente',
  `dateLimiteReponse` date DEFAULT NULL,
  `rang` int(11) DEFAULT NULL,
  `decisionEtudiant` enum('accepte','refuse') DEFAULT NULL,
  `notificationEnvoyee` tinyint(1) DEFAULT 0,
  `dateNotification` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `candidatures`
--

INSERT INTO `candidatures` (`idCandidature`, `idUtilisateur`, `idFormation`, `lettreMotivation`, `cv`, `releveNotes`, `diplome`, `justificatifSupplementaire`, `commentaire`, `demandeSupplementaire`, `statut`, `dateLimiteReponse`, `rang`, `decisionEtudiant`, `notificationEnvoyee`, `dateNotification`) VALUES
('CAND2579', 'USER70822', 'FOR3258', '1743090601033-CV.pdf', '1743090601037-CV.pdf', '1743090601038-CV.pdf', '1743090601040-CV.pdf', NULL, NULL, '', 'acceptée', NULL, 1, 'accepte', 1, '2025-03-27 16:50:45'),
('CAND7183', 'USER70822', 'FOR3041', '1743089011612-CV.pdf', '1743089011616-CV.pdf', '1743089011618-CV.pdf', '1743089011620-CV.pdf', NULL, NULL, '', 'refusée', NULL, 2, 'refuse', 1, '2025-03-27 16:28:33');

--
-- Déclencheurs `candidatures`
--
DELIMITER $$
CREATE TRIGGER `before_insert_candidatures` BEFORE INSERT ON `candidatures` FOR EACH ROW BEGIN
    SET NEW.idCandidature = CONCAT('CAND', LPAD(FLOOR(RAND() * 9999), 4, '0'));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `coordonnees`
--

CREATE TABLE `coordonnees` (
  `coordonneesId` varchar(10) NOT NULL,
  `idUtilisateur` varchar(10) DEFAULT NULL,
  `telephone1` varchar(255) NOT NULL,
  `telephone2` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `coordonnees`
--

INSERT INTO `coordonnees` (`coordonneesId`, `idUtilisateur`, `telephone1`, `telephone2`) VALUES
('ADDR6645', 'USER70822', '+33753846170', '');

--
-- Déclencheurs `coordonnees`
--
DELIMITER $$
CREATE TRIGGER `before_insert_coordonnees` BEFORE INSERT ON `coordonnees` FOR EACH ROW BEGIN
    SET NEW.coordonneesId = CONCAT('ADDR', LPAD(FLOOR(RAND() * 9999), 4, '0'));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `cursuspostbac`
--

CREATE TABLE `cursuspostbac` (
  `cursusId` varchar(10) NOT NULL,
  `idUtilisateur` varchar(10) NOT NULL,
  `anneeUniversitaire` varchar(9) NOT NULL,
  `diplomeFrancais` enum('Oui','Non') NOT NULL,
  `niveauDiplome` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `cursuspostbac`
--

INSERT INTO `cursuspostbac` (`cursusId`, `idUtilisateur`, `anneeUniversitaire`, `diplomeFrancais`, `niveauDiplome`) VALUES
('CURS3612', 'USER70822', '2023', 'Non', 'Bac+2'),
('CURS6889', 'USER70822', '2023', 'Oui', 'Bac+1');

--
-- Déclencheurs `cursuspostbac`
--
DELIMITER $$
CREATE TRIGGER `before_insert_cursusPostBac` BEFORE INSERT ON `cursuspostbac` FOR EACH ROW BEGIN
    SET NEW.cursusId = CONCAT('CURS', LPAD(FLOOR(RAND() * 9999), 4, '0'));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `cv`
--

CREATE TABLE `cv` (
  `idCV` varchar(10) NOT NULL,
  `idUtilisateur` varchar(10) DEFAULT NULL,
  `nomFichier` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `cv`
--

INSERT INTO `cv` (`idCV`, `idUtilisateur`, `nomFichier`) VALUES
('CV3723', 'USER70822', 'cv_undefined.pdf');

--
-- Déclencheurs `cv`
--
DELIMITER $$
CREATE TRIGGER `before_insert_cv` BEFORE INSERT ON `cv` FOR EACH ROW BEGIN
    SET NEW.idCV = CONCAT('CV', LPAD(FLOOR(RAND() * 9999), 4, '0'));
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
  `expId` varchar(10) NOT NULL,
  `idUtilisateur` varchar(10) NOT NULL,
  `anneeDebut` year(4) NOT NULL,
  `dureeMois` int(11) NOT NULL,
  `tempsTravail` enum('Temps plein','Temps partiel') NOT NULL,
  `employeur` varchar(255) NOT NULL,
  `intitule` varchar(255) NOT NULL,
  `descriptif` text DEFAULT NULL,
  `fichierJustificatif` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `experiencespro`
--

INSERT INTO `experiencespro` (`expId`, `idUtilisateur`, `anneeDebut`, `dureeMois`, `tempsTravail`, `employeur`, `intitule`, `descriptif`, `fichierJustificatif`) VALUES
('EXP8499', 'USER70822', '2023', 14, 'Temps partiel', 'TOTO', 'INFORMATIQUE', 'FRONT END', '8abfa3f0325a64d81df48d3d25b19b37');

--
-- Déclencheurs `experiencespro`
--
DELIMITER $$
CREATE TRIGGER `before_insert_experiencesPro` BEFORE INSERT ON `experiencespro` FOR EACH ROW BEGIN
    SET NEW.expId = CONCAT('EXP', LPAD(FLOOR(RAND() * 9999), 4, '0'));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `formations`
--

CREATE TABLE `formations` (
  `idFormation` varchar(10) NOT NULL,
  `universite` varchar(255) NOT NULL,
  `nomFormation` varchar(255) NOT NULL,
  `typeFormation` enum('Formation initiale','Formation continue','Alternance') NOT NULL,
  `capacite` int(11) NOT NULL,
  `tauxAcces` decimal(5,2) NOT NULL,
  `localisation` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `idAdminUniversite` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `formations`
--

INSERT INTO `formations` (`idFormation`, `universite`, `nomFormation`, `typeFormation`, `capacite`, `tauxAcces`, `localisation`, `logo`, `idAdminUniversite`) VALUES
('FOR3041', 'université d\'evry', 'mathématique', 'Formation initiale', 1, 23.00, 'evry', '1743021102958-Capture d\'Ã©cran 2025-03-13 033411.png', 'USER06981'),
('FOR3258', 'université d\'evry', 'miage', 'Alternance', 11, 1.00, 'evry', '1742567279450-Capture d\'Ã©cran 2025-03-13 033411.png', 'USER06981');

--
-- Déclencheurs `formations`
--
DELIMITER $$
CREATE TRIGGER `before_insert_formations` BEFORE INSERT ON `formations` FOR EACH ROW BEGIN
    SET NEW.idFormation = CONCAT('FOR', LPAD(FLOOR(RAND() * 9999), 4, '0'));
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
  `idUtilisateur` varchar(10) NOT NULL,
  `fichierReleve` varchar(255) NOT NULL,
  `commentaire` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `relevesnotes`
--

INSERT INTO `relevesnotes` (`releveId`, `idUtilisateur`, `fichierReleve`, `commentaire`) VALUES
('REL7394', 'USER70822', 'releve_undefined_43a4cf60-fe5a-457c-a897-b3face32c65d.pdf', NULL);

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
  `idUtilisateur` varchar(10) DEFAULT NULL,
  `entreprise` varchar(255) NOT NULL,
  `duree` varchar(50) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `stages`
--

INSERT INTO `stages` (`stageId`, `idUtilisateur`, `entreprise`, `duree`, `description`) VALUES
('STG6136', 'USER70822', 'DIALLO', '2', 'DÉVELOPPEMENT WEB');

--
-- Déclencheurs `stages`
--
DELIMITER $$
CREATE TRIGGER `before_insert_stages` BEFORE INSERT ON `stages` FOR EACH ROW BEGIN
    SET NEW.stageId = CONCAT('STG', LPAD(FLOOR(RAND() * 9999), 4, '0'));
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
  `status` enum('actif','inactif','suspendu') DEFAULT 'actif',
  `civilite` varchar(10) DEFAULT NULL,
  `deuxiemePrenom` varchar(100) DEFAULT NULL,
  `nomUsage` varchar(100) DEFAULT NULL,
  `nationalite` varchar(50) NOT NULL,
  `dateNaissance` date DEFAULT NULL,
  `paysNaissance` varchar(50) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `complementAdresse` varchar(255) DEFAULT NULL,
  `codePostal` varchar(20) NOT NULL,
  `ville` varchar(100) NOT NULL,
  `ine` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`idUtilisateur`, `nomUtilisateur`, `prenomUtilisateur`, `emailUtilisateur`, `motDePasseUtilisateur`, `roleUtilisateur`, `status`, `civilite`, `deuxiemePrenom`, `nomUsage`, `nationalite`, `dateNaissance`, `paysNaissance`, `adresse`, `complementAdresse`, `codePostal`, `ville`, `ine`) VALUES
('USER05866', 'bah', 'houleymatou', 'hou@gmail.com', '$2b$10$cB4HlRaygaKeLxls.ldzA.yw6ZWjwtagJqIZ0FSR/QUBBw3jrMJA.', 'AdminUniversitaire', 'actif', NULL, NULL, NULL, '', NULL, '', '', NULL, '', '', NULL),
('USER06981', 'BAH', 'houleymatou', 'ba@gmail.com', '$2b$10$oRqrlaZPBSRKqwPHjwMt1.RRW4WXI3aQEyHZuzixegkXcuk.XvKUq', 'AdminUniversitaire', 'actif', NULL, NULL, NULL, '', NULL, '', '', NULL, '', '', NULL),
('USER55142', 'sow', 'mamadou', 'mama@gmail.com', '$2b$10$GZnuZBJwmTzTOdmyw17jAesHU6WfKGR8z2mqIURSM.f20j.KiPjhe', 'AdminGeneral', 'actif', NULL, NULL, NULL, '', NULL, '', '', NULL, '', '', NULL),
('USER70822', 'DIALLO', '', 'alascodiallo111@gmail.com', '$2b$10$IfEKr16O630c62EmVzG4fekn/RvxxGoY9ZC4ZUwUYvrkLeX3our/2', 'Etudiant', 'actif', 'M.', '', NULL, 'FRANCE', '2025-03-11', 'Guinée', '15 rue le bosquet', 'résidence bosquet les ulis,91940', '91310', 'LINAS', '123BHA');

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
-- Index pour la table `baccalaureats`
--
ALTER TABLE `baccalaureats`
  ADD PRIMARY KEY (`baccalaureatId`),
  ADD KEY `idUtilisateur` (`idUtilisateur`);

--
-- Index pour la table `candidatures`
--
ALTER TABLE `candidatures`
  ADD PRIMARY KEY (`idCandidature`),
  ADD KEY `idUtilisateur` (`idUtilisateur`),
  ADD KEY `idFormation` (`idFormation`);

--
-- Index pour la table `coordonnees`
--
ALTER TABLE `coordonnees`
  ADD PRIMARY KEY (`coordonneesId`),
  ADD KEY `idUtilisateur` (`idUtilisateur`);

--
-- Index pour la table `cursuspostbac`
--
ALTER TABLE `cursuspostbac`
  ADD PRIMARY KEY (`cursusId`),
  ADD KEY `idUtilisateur` (`idUtilisateur`);

--
-- Index pour la table `cv`
--
ALTER TABLE `cv`
  ADD PRIMARY KEY (`idCV`),
  ADD KEY `idUtilisateur` (`idUtilisateur`);

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
  ADD PRIMARY KEY (`expId`),
  ADD KEY `idUtilisateur` (`idUtilisateur`);

--
-- Index pour la table `formations`
--
ALTER TABLE `formations`
  ADD PRIMARY KEY (`idFormation`),
  ADD KEY `fk_adminUniversite` (`idAdminUniversite`);

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
  ADD KEY `idUtilisateur` (`idUtilisateur`);

--
-- Index pour la table `stages`
--
ALTER TABLE `stages`
  ADD PRIMARY KEY (`stageId`),
  ADD KEY `idUtilisateur` (`idUtilisateur`);

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
-- Contraintes pour la table `baccalaureats`
--
ALTER TABLE `baccalaureats`
  ADD CONSTRAINT `baccalaureats_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateurs` (`idUtilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `candidatures`
--
ALTER TABLE `candidatures`
  ADD CONSTRAINT `candidatures_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateurs` (`idUtilisateur`) ON DELETE CASCADE,
  ADD CONSTRAINT `candidatures_ibfk_2` FOREIGN KEY (`idFormation`) REFERENCES `formations` (`idFormation`) ON DELETE CASCADE;

--
-- Contraintes pour la table `coordonnees`
--
ALTER TABLE `coordonnees`
  ADD CONSTRAINT `coordonnees_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateurs` (`idUtilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `cursuspostbac`
--
ALTER TABLE `cursuspostbac`
  ADD CONSTRAINT `cursuspostbac_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateurs` (`idUtilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `cv`
--
ALTER TABLE `cv`
  ADD CONSTRAINT `cv_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateurs` (`idUtilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `etudiants`
--
ALTER TABLE `etudiants`
  ADD CONSTRAINT `etudiants_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateurs` (`idUtilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `experiencespro`
--
ALTER TABLE `experiencespro`
  ADD CONSTRAINT `experiencespro_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateurs` (`idUtilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `formations`
--
ALTER TABLE `formations`
  ADD CONSTRAINT `fk_adminUniversite` FOREIGN KEY (`idAdminUniversite`) REFERENCES `utilisateurs` (`idUtilisateur`) ON DELETE CASCADE;

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
  ADD CONSTRAINT `relevesnotes_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateurs` (`idUtilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `stages`
--
ALTER TABLE `stages`
  ADD CONSTRAINT `stages_ibfk_1` FOREIGN KEY (`idUtilisateur`) REFERENCES `utilisateurs` (`idUtilisateur`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
