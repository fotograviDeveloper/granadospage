// src/components/InteractiveMasterPlanMap.jsx
import React, { useState, useRef } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faTimes, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'; 
import './InteractiveMasterPlanMap.css';

// 🛑 Rutas de imágenes específicas para cada formato
const MAP_IMAGE_VERTICAL = '/img/mapa-granados.png'; 
const MAP_IMAGE_HORIZONTAL = '/img/mapa-granados-horizontal.png'; // ASUMIDO: Debes tener esta imagen horizontal

/**
 * Componente de Mapa Maestro Interactivo con Zoom y Pan (Arrastre).
 * Muestra una vista base responsive y un modal a pantalla completa con todas las interacciones.
 */
const InteractiveMasterPlanMap = ({ title = "Mapa Maestro del Desarrollo" }) => {
    const [isMapFullscreen, setIsMapFullscreen] = useState(false);
    // Estado para el control de zoom y posición (Pan)
    const [zoomLevel, setZoomLevel] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // Ref para el control de arrastre
    const startDrag = useRef({ x: 0, y: 0 }); // Posición inicial del ratón
    const [isDragging, setIsDragging] = useState(false);
    const imageContainerRef = useRef(null);

    /**
     * Maneja el cierre del modal, restableciendo el zoom y la posición.
     */
    const closeFullscreen = () => {
        setZoomLevel(1); 
        setPosition({ x: 0, y: 0 });
        setIsMapFullscreen(false);
        // Restablece el scroll del body
        document.body.style.overflow = 'unset'; 
    };

    /**
     * Maneja la apertura del modal.
     */
    const openFullscreen = () => {
        setIsMapFullscreen(true);
        // Bloquea el scroll del body
        document.body.style.overflow = 'hidden'; 
    };
    
    // Manejo de Zoom
    const handleZoom = (direction) => {
        setZoomLevel(prevZoom => {
            let newZoom = prevZoom + (direction === 'in' ? 0.2 : -0.2);
            // Límites de zoom: 1x (no zoom) a 5x
            const finalZoom = Math.min(Math.max(newZoom, 1), 5); 

            // Si se aleja completamente, reseteamos la posición
            if (finalZoom === 1) {
                 setPosition({ x: 0, y: 0 });
            }
            return finalZoom;
        });
    };
    
    // Lógica de Drag/Pan (Movimiento del ratón)
    const onMouseDown = (e) => {
        // Solo permitir arrastrar si hay zoom activo
        if (zoomLevel > 1) {
            e.preventDefault();
            setIsDragging(true);
            startDrag.current = { 
                x: e.clientX - position.x, 
                y: e.clientY - position.y 
            };
        }
    };

    const onMouseMove = (e) => {
        if (!isDragging || zoomLevel <= 1) return;
        
        e.preventDefault();
        const newX = e.clientX - startDrag.current.x;
        const newY = e.clientY - startDrag.current.y;
        
        // Aquí podrías agregar lógica para limitar el arrastre a los bordes de la imagen
        // Por simplicidad, se permite el arrastre completo.
        setPosition({ x: newX, y: newY });
    };

    const onMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
        }
    };
    
    
    return (
        <div className="interactive-map-widget">
             <div className="map-header">
                <h3>{title}</h3>
                <button
                    onClick={openFullscreen}
                    className="fullscreen-button"
                    aria-label="Expandir mapa a pantalla completa"
                >
                    <FontAwesomeIcon icon={faExpand} /> Pantalla Completa
                </button>
            </div>
            
            {/* Contenedor de la Imagen del mapa (click para abrir modal) */}
            <div
              className="map-image-wrapper-small"
              onClick={openFullscreen}
              aria-label="Haz clic para ver mapa interactivo en pantalla completa"
            >
              <picture>
                  {/* Fuente para pantallas grandes (horizontal) */}
                  <source media="(min-width: 769px)" srcSet={MAP_IMAGE_HORIZONTAL} /> 
                  {/* Fuente por defecto (vertical para móvil) */}
                  <img
                    src={MAP_IMAGE_VERTICAL}
                    alt="Mapa Maestro de Granados del Mediterráneo"
                    className="map-image-small"
                    loading="lazy"
                  />
              </picture>
            </div>


            {/* 🛑 Modal para Pantalla Completa (Overlay) */}
            {isMapFullscreen && (
                <div className="fullscreen-modal" onClick={closeFullscreen}>
                    <div
                        className="modal-content-wrapper"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Botón de cierre */}
                        <button className="close-button" onClick={closeFullscreen}>
                            <FontAwesomeIcon icon={faTimes} /> Cerrar
                        </button>

                        {/* Controles de Zoom */}
                        <div className="zoom-controls">
                            <button
                                onClick={() => handleZoom("in")}
                                aria-label="Acercar mapa"
                                disabled={zoomLevel >= 5}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                            <button
                                onClick={() => handleZoom("out")}
                                aria-label="Alejar mapa"
                                disabled={zoomLevel <= 1}
                            >
                                <FontAwesomeIcon icon={faMinus} />
                            </button>
                        </div>

                        {/* Contenedor de la Imagen que aplica el Zoom/Pan */}
                        <div
                            className="fullscreen-image-container"
                            ref={imageContainerRef}
                            style={{
                                transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                                transition: isDragging ? 'none' : 'transform 0.2s ease-out', 
                                // Cursor condicional
                                cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default', 
                            }}
                            onMouseDown={onMouseDown}
                            onMouseMove={onMouseMove}
                            onMouseUp={onMouseUp}
                            onMouseLeave={onMouseUp} 
                        >
                            <img
                                src={MAP_IMAGE_HORIZONTAL} 
                                alt="Mapa Maestro Ampliado"
                                className="fullscreen-image"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InteractiveMasterPlanMap;