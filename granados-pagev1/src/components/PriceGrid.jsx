// src/components/PriceGrid.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './PriceGrid.css';

// 🛑 DATOS DE PRECIOS POR TIPO DE LOTE (PRECIOS ACTUALES)
const CURRENT_PRICES = {
    title: 'Precios de Lanzamiento: Tu Oportunidad Exclusiva',
    tagline: 'Asegura tu inversión con las tarifas vigentes por metro cuadrado. ¡Cupo limitado!',
    lots: [
        { 
            type: 'A', 
            sizeRange: 'Lotes dispinibles desde 1500 m²', 
            priceM2: 600, 
            detail: 'Lotes de alta plusvalía interior con acceso rápido a vialidades principales.' 
        },
        { 
            type: 'AA', 
            sizeRange: 'Lotes dispinibles desde 1500 m²', 
            priceM2: 700, 
            detail: 'Ubicación privilegiada cerca de las principales amenidades y áreas verdes.' 
        },
        { 
            type: 'AAA', 
            sizeRange: 'Lotes dispinibles desde 1500 m²', 
            priceM2: 800, 
            detail: 'Frente a áreas verdes, con vistas panorámicas o en esquinas exclusivas.' 
        }
    ]
};


const PriceGrid = () => {
    // Solo renderizamos la única sección de precios
    const { title, tagline, lots } = CURRENT_PRICES;

    return (
        <div className="price-grid-container">
            {/* Contenedor principal para la única etapa (ahora 'Precios Actuales') */}
            {/* IMPORTANTE: Usamos la clase 'current-stage' para el estilo */}
            <div className="stage-section current-stage">
                
                <div className="stage-header-wrapper">
                    {/* Título y Tagline */}
                    <h2 className="stage-title price-highlight">
                        {title}
                    </h2>
                    <p className="stage-tagline">{tagline}</p>

                    {/* Botón de Agendar Visita - Cerca de los precios */}
                    <Link 
                        to="/Contacto" 
                        className="agenda-visit-btn" /* Clase estilizada en CSS */
                    >
                        📅 Agendar una Visita al Desarrollo
                    </Link>
                </div>

                <div className="lot-cards-wrapper">
                    {lots.map((lot) => (
                        <div key={lot.type} className={`lot-card lot-type-${lot.type.toLowerCase()}`}>
                            
                            <div className="lot-type-tag">LOTE TIPO {lot.type}</div>
                            
                            {/* Rango de tamaño */}
                            <p className="lot-size-range">{lot.sizeRange}</p>
                            
                            {/* Caja de Precio por M² */}
                            <div className="lot-price-box">
                                <span className="price-label">Precio M²</span>
                                <span className="price-value">${lot.priceM2.toLocaleString('es-MX')}</span>
                            </div>

                            {/* Descripción del lote */}
                            <p className="lot-detail">{lot.detail}</p>
                            
                       
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PriceGrid;