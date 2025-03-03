import React, { useState } from "react";

function BacSection() {
  const [bacType, setBacType] = useState("");
  const [year, setYear] = useState("");

  return (
    <div>
      <h2>Mon Baccalauréat</h2>
      <p>Indiquez les informations relatives à votre Bac.</p>

      <label>Année d'obtention *</label>
      <input type="number" value={year} onChange={(e) => setYear(e.target.value)} />

      <label>Type de Baccalauréat *</label>
      <input type="text" value={bacType} onChange={(e) => setBacType(e.target.value)} />

      <button className="btn-save">Sauvegarder</button>
    </div>
  );
}

export default BacSection;
