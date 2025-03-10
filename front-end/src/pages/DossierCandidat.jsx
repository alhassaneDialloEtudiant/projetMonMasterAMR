import React, { useState } from "react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import InformationsPersonnelles from "./InformationsPersonnelles";
import Coordonnees from "./Coordonnees";
import Cv from "./Cv";
import Baccalaureat from "./Baccalaureat";
import CursusPostBac from "./CursusPostBac";
import RelevesNotes from "./RelevesNotes";
import Stages from "./Stages";
import ExperiencesPro from "./ExperiencesPro";
import "../styles/DossierCandidat.css";

function DossierCandidat({ utilisateurId }) {
  const [activeSection, setActiveSection] = useState("Informations personnelles");

  const sections = [
    "Informations personnelles",
    "Mes coordonnées",
    "Mon CV",
    "Mon baccalauréat",
    "Mon cursus post-baccalauréat",
    "Mes relevés de notes",
    "Mes stages",
    "Mes expériences professionnelles"
  ];

  return (
    <div className="dossier-container">
      <aside className="sidebar">
        <h2>Mon dossier</h2>
        <ul>
          {sections.map((section) => (
            <li 
              key={section} 
              className={`menu-item ${activeSection === section ? "valid" : "warning"}`} 
              onClick={() => setActiveSection(section)}
            >
              {activeSection === section ? <FaCheckCircle className="icon valid-icon" /> : <FaExclamationTriangle className="icon warning-icon" />} {section}
            </li>
          ))}
        </ul>
      </aside>

      <div className="content">
        <h1 className="section-title">{activeSection}</h1>
        <p className="section-description">Complétez les informations demandées pour cette section.</p>

        {activeSection === "Informations personnelles" && <InformationsPersonnelles utilisateurId={utilisateurId} />}
        {activeSection === "Mes coordonnées" && <Coordonnees utilisateurId={utilisateurId} />}
        {activeSection === "Mon CV" && <Cv utilisateurId={utilisateurId} />}
        {activeSection === "Mon baccalauréat" && <Baccalaureat utilisateurId={utilisateurId} />}
        {activeSection === "Mon cursus post-baccalauréat" && <CursusPostBac utilisateurId={utilisateurId} />}
        {activeSection === "Mes relevés de notes" && <RelevesNotes utilisateurId={utilisateurId} />}
        {activeSection === "Mes stages" && <Stages utilisateurId={utilisateurId} />}
        {activeSection === "Mes expériences professionnelles" && <ExperiencesPro utilisateurId={utilisateurId} />}
      </div>
    </div>
  );
}

export default DossierCandidat;
