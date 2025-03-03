import React from "react";
import { sections } from "./DossierData";

function DossierSection({ sectionName }) {
  const section = sections.find((sec) => sec.title === sectionName);

  return (
    <div className="section-content">
      <h1>{section.title}</h1>
      <p>{section.description}</p>
      {section.component && <section.component />}
    </div>
  );
}

export default DossierSection;
