// src/components/InteractiveMasterPlanMap.jsx (Versión Estática, Completa y Ajustada)

import React from 'react'; 
import './InteractiveMasterPlanMap.css';

// 🛑 Rutas de imágenes específicas (Mantenemos las definidas por el usuario)
const MAP_IMAGE_VERTICAL = '/img/mapa-granados.png'; 
const MAP_IMAGE_HORIZONTAL = '/img/mapa-granados-horizontal.png'; 

/**
 * Componente de Mapa Maestro Estático. 
 * Muestra una foto atractiva del masterplan sin interacción.
 */
const InteractiveMasterPlanMap = ({ title = "Plano Maestro del Desarrollo" }) => {
    // 🛑 Se eliminan todos los estados, refs y funciones de interactividad.
    
    return (
        <div className="interactive-map-widget">
            <div className="map-header">
                <h3>{title}</h3>
                {/* 🛑 El botón de Pantalla Completa sigue eliminado */}
            </div>
            
            <div className="map-image-wrapper-static">
                {/* 🛑 CORRECCIÓN 3: Uso de <picture> para cargar la imagen correcta */}
                <picture>
                    {/* Fuente para pantallas grandes (Horizontal) */}
                    <source media="(min-width: 769px)" srcSet={MAP_IMAGE_HORIZONTAL} /> 
                    {/* Fuente por defecto (Vertical para móvil) */}
                    <img
                        src={MAP_IMAGE_VERTICAL}
                        alt="Plano Maestro de Granados del Mediterráneo"
                        className="map-image-static"
                        loading="lazy"
                    />
                </picture>
            </div>
            {/* 🛑 El Modal Fullscreen sigue eliminado */}
        </div>
    );
};

export default InteractiveMasterPlanMap;