// src/components/LocationAndMap.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faRoad, faHospital, faExpand } from '@fortawesome/free-solid-svg-icons';
import './LocationAndMap.css';

// 🛑 NOTA: Asumo que la imagen del mapa (image_a7f204.png) está en la carpeta public/img/
const MAP_IMAGE = '/img/mapa-granados.png'; 

// Datos clave de ubicación del PDF (Página 3)
const keyFacts = [
  { icon: faRoad, title: 'Carretera Nacional', detail: 'A solo 2.5 km', description: 'Acceso rápido a la vía principal.' },
  { icon: faMapMarkerAlt, title: 'Centro', detail: '6.5 km', description: 'Cercanía al corazón social y comercial de Montemorelos.' },
  { icon: faHospital, title: 'Servicios de Salud', detail: '4.5 km', description: 'Hospital General de Montemorelos.' },
];

// Datos de las imágenes para la galería (Usaremos imágenes del Lagoon/Casa Club)
const galleryImages = [
  { id: 1, src: '/img/amenidades/AJEDREZ.jpg', alt: 'Vista general del Lagoon Club' },
  { id: 2, src: '/img/amenidades/2Bar.png', alt: 'Interior de la Casa Club' },
  { id: 3, src: '/img/amenidades/asadores.jpg', alt: 'Palapas y áreas de asadores' },
];

const LocationAndMap = () => {
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsMapFullscreen(!isMapFullscreen);
  };

  return (
    <section className="location-section">
      
      <h2 className="section-title">Ubicación y Amenidades</h2>
      
      {/* Parte 1: Tarjetas de Datos Clave (Key Facts) */}
      <div className="location-facts-container">
        {keyFacts.map((fact, index) => (
          <div key={index} className="fact-card">
            <FontAwesomeIcon icon={fact.icon} className="fact-icon" />
            <h3>{fact.title}</h3>
            <p className="fact-detail">**{fact.detail}**</p>
            <p className="fact-description">{fact.description}</p>
          </div>
        ))}
      </div>

      <hr className="divider" />

      {/* Parte 2: Mapa y Galería */}
      <div className="map-gallery-layout">
        
        {/* Columna Izquierda: Mapa Interactivo */}
        <div className="map-container">
          <div className="map-header">
            <h3>Mapa Maestro de Granados</h3>
            <button 
              onClick={toggleFullscreen} 
              className="fullscreen-button" 
              aria-label="Expandir mapa a pantalla completa"
            >
              <FontAwesomeIcon icon={faExpand} /> Pantalla Completa
            </button>
          </div>
          
          <div className="map-image-wrapper" onClick={toggleFullscreen}>
            {/*  */}
            <img 
              src={MAP_IMAGE} 
              alt="Mapa Maestro de Granados del Mediterráneo" 
              className="map-image"
            />
          </div>
        </div>

        {/* Columna Derecha: Galería de Amenidades */}
        <div className="amenities-gallery-container">
          <h3>Explora las Amenidades Únicas</h3>
          <div className="amenities-grid">
            {galleryImages.map((image) => (
              <div key={image.id} className="gallery-item">
                <img src={image.src} alt={image.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal para Pantalla Completa */}
      {isMapFullscreen && (
        <div className="fullscreen-modal" onClick={toggleFullscreen}>
          <button className="close-button">X</button>
          {/* Implementación de zoom: Puedes usar una librería o CSS para 'transform: scale()' */}
          <img 
            src={MAP_IMAGE} 
            alt="Mapa Maestro Ampliado" 
            className="fullscreen-image"
          />
        </div>
      )}
    </section>
  );
};

export default LocationAndMap;