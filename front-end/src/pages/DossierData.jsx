import React from "react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import BacSection from "./BacSection";
import CvSection from "./CvSection";

export const sections = [
  {
    id: 1,
    title: "Informations personnelles",
    description: "Renseignez vos informations personnelles.",
    icon: <FaCheckCircle style={{ color: "green" }} />,
  },
  {
    id: 2,
    title: "Mes coordonnées",
    description: "Ajoutez vos coordonnées.",
    icon: <FaCheckCircle style={{ color: "green" }} />,
  },
  {
    id: 3,
    title: "Mon CV",
    description: "Téléchargez votre CV.",
    component: CvSection,
    icon: <FaExclamationTriangle style={{ color: "orange" }} />,
  },
  {
    id: 4,
    title: "Mon baccalauréat",
    description: "Ajoutez les informations sur votre Bac.",
    component: BacSection,
    icon: <FaExclamationTriangle style={{ color: "orange" }} />,
  },
];
