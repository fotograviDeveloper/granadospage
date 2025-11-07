// src/components/BrochureDownloadButton.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons'; 
import './BrochureDownloadButton.css'; // Opcional si solo usas el className

// 🛑 RUTA DEL ARCHIVO PDF (debe ser la misma que usamos antes)
// Esta ruta debe ser la misma para toda la aplicación.
const BROCHURE_PATH = '../assets/brochure.pdf'; 

/**
 * Componente reutilizable para descargar el Brochure.
 * @param {string} className - Clase CSS adicional para estilizado contextual.
 * @param {string} text - Texto del botón (por defecto: "Descargar Brochure").
 */
const BrochureDownloadButton = ({ className = '', text = 'Descargar Brochure' }) => {
    return (
        <a 
            href={BROCHURE_PATH} 
            download
            className={`download-button ${className}`} // Aplica la clase base y la clase contextual
            target="_blank"
            rel="noopener noreferrer"
        >
            <FontAwesomeIcon icon={faDownload} style={{ marginRight: '10px' }} />
            {text}
        </a>
    );
};

export default BrochureDownloadButton;