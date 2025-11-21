// src/components/Pano360Viewer.jsx

import React from 'react';
// Importamos el componente Wrapper oficial para React
import { PhotoSphereViewer } from 'react-photo-sphere-viewer'; 
import './Pano360Viewer.css';

/**
 * Componente Visor Panorámico 360° utilizando Photo Sphere Viewer (PSV) y Three.js.
 * Soporta control de mouse y giroscopio móvil.
 * * @param {string} imageUrl - Ruta de la imagen 360 (equirrectangular).
 * @param {string} panoId - ID único para el visor (crucial si hay múltiples en una página).
 * @param {string} height - Altura del visor (por defecto 500px).
 */
const Pano360Viewer = ({ imageUrl, panoId, height = '500px' }) => {
    
    // Configuración recomendada para Inmobiliaria
    const viewerOptions = {
        // La imagen panorámica
        src: imageUrl, 
        
        // Configuración de la vista inicial
        defaultYaw: 0,       
        defaultPitch: 0,     
        defaultZoomLvl: 50,  

        // Interacciones
        mousewheel: true,    
        keyboard: true,      
        
        // GIROSCOPIO Y BARRA DE NAVEGACIÓN
        // Incluimos todos los botones necesarios
        navbar: [
            'autorotate', // Control de rotación automática
            'zoom',       // Control de zoom
            'move',       // Control de movimiento (mouse)
            'gyroscope',  // Botón para activar/desactivar giroscopio
            'caption',
            'fullscreen', // Botón de pantalla completa
        ],
        
        panoramaQuality: 'high',
    };

    return (
        // Usamos 'key' con panoId para asegurar que React maneje múltiples instancias
        <div className="psv-viewer-wrapper" key={panoId} style={{ height: height }}>
            
            {/* Componente React que inicializa el visor */}
            <PhotoSphereViewer
                {...viewerOptions}
                height={height}
                width={'100%'}
            />
            
            <div className="pano-controls-overlay">
                <p>Arrastra, usa la barra inferior o mueve tu móvil para explorar la vista 360°.</p>
            </div>
        </div>
    );
};

export default Pano360Viewer;