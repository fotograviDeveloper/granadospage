// src/components/ProjectSummary.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMountain, faHome, faPalette, faRulerCombined } from '@fortawesome/free-solid-svg-icons';
import './ProjectSummary.css';

// 🛑 NOTA: Asumo que la imagen principal está en public/img/summary-main.jpg
const MAIN_IMAGE = '/img/casa-club.png'; 

// Datos clave extraídos del PDF (Páginas 2 y 4)
const keyFeatures = [
  { 
    icon: faMountain, 
    title: 'Entorno Natural', 
    detail: 'Vistas a la Sierra Madre', 
    description: 'Ubicado en Montemorelos, fusionando naturaleza y nuevas oportunidades.' 
  },
  { 
    icon: faRulerCombined, 
    title: 'Exclusividad', 
    detail: 'Lotes desde 600 m²', 
    description: 'Espacios amplios para construir un legado y garantizar privacidad.' 
  },
  { 
    icon: faPalette, 
    title: 'Arquitectura', 
    detail: 'Estilo Mediterráneo', 
    description: 'Calidez y diseño que complementan el paisaje natural del área.' 
  },
  { 
    icon: faHome, 
    title: 'Amenidades', 
    detail: '+40 Experiencias', 
    description: 'Lagoon Club, Casa Club, Parques, Canchas y mucho más para toda la familia.' 
  },
];

const ProjectSummary = () => {
  return (
    <section className="summary-section">
      <div className="summary-layout-grid">
        
        {/* Columna Izquierda: Presentación y Concepto */}
        <div className="summary-concept-container">
          <h2 className="summary-title">
            <span className="accent-text">Granados:</span> Un Legado en la Sierra Madre
          </h2>
          
          <p className="summary-intro-text">
            En Montemorelos, donde la **Sierra Madre** se encuentra con nuevas oportunidades, nace Granados del Mediterráneo desde un concepto integral. Más que un fraccionamiento, es un lienzo para construir un legado.
          </p>
          
          <p className="summary-main-text">
            Un refugio que fusiona las imponentes vistas y la calidez de la **arquitectura mediterránea** con más de **40 amenidades** exclusivas para crear una experiencia de club residencial campestre única.
          </p>
          
          {/* Imagen de Apoyo para Desktop */}
          <div className="summary-image-desktop">
            <img src={MAIN_IMAGE} alt="Vista del Club Residencial Granados del Mediterráneo" loading="lazy" />
          </div>
        </div>

        {/* Columna Derecha: Tarjetas de Datos Clave */}
        <div className="summary-features-container">
          {keyFeatures.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="card-header">
                <FontAwesomeIcon icon={feature.icon} className="feature-icon" />
                <h3 className="card-title">{feature.title}</h3>
              </div>
              <p className="card-detail">{feature.detail}</p>
              <p className="card-description">{feature.description}</p>
            </div>
          ))}
          
          {/* Botón CTA Fijo en la parte inferior */}
          <div className="summary-cta-box">
             <a href="#contacto" className="summary-cta-button">
                Agenda una Visita
             </a>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default ProjectSummary;