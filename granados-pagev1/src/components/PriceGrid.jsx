// src/components/PriceGrid.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './PriceGrid.css';

// 🛑 DATOS DE PRECIOS POR ETAPA Y TIPO DE LOTE (Basado en brochure y proyecciones)
const LOT_PRICES = {
    // Friends and Family (El precio MÁS bajo, exclusiva fundadores)
    'Friends and Family': {
        tagline: 'El precio más bajo para inversionistas fundadores. ¡Última oportunidad!',
        lots: [
            { type: 'A', sizeRange: 'Desde 900 m²', priceM2: 900, detail: 'Lotes de alta plusvalía interior.' },
            { type: 'AA', sizeRange: 'Desde 1100 m²', priceM2: 1100, detail: 'Ubicación privilegiada cerca de amenidades.' },
            { type: 'AAA', sizeRange: 'Desde 1300 m²', priceM2: 1300, detail: 'Frente a áreas verdes o con vistas exclusivas.' }
        ]
    },
    // Early Bird (Precio de lanzamiento actual)
    'Early Bird': {
        tagline: 'Adquiere tu lote al precio especial de lanzamiento. Etapa actual de venta.',
        lots: [
            { type: 'A', sizeRange: 'Desde 600 m²', priceM2: 600, detail: 'Lotes de alta plusvalía interior.' },
            { type: 'AA', sizeRange: 'Desde 700 m²', priceM2: 700, detail: 'Ubicación privilegiada cerca de amenidades.' },
            { type: 'AAA', sizeRange: 'Desde 800 m²', priceM2: 800, detail: 'Frente a áreas verdes o con vistas exclusivas.' }
        ]
    },
    // Preventa (Precio más alto, futura)
    'Preventa': {
        tagline: 'Etapa estándar de comercialización. Precios sujetos a cambios por avance de obra.',
        lots: [
            { type: 'A', sizeRange: 'Desde 1400 m²', priceM2: 1400, detail: 'Lotes de alta plusvalía interior.' },
            { type: 'AA', sizeRange: 'Desde 1600 m²', priceM2: 1600, detail: 'Ubicación privilegiada cerca de amenidades.' },
            { type: 'AAA',  priceM2: 1800, detail: 'Frente a áreas verdes o con vistas exclusivas.' }
        ]
    }
};

// 🛑 ORDEN DE MUESTRA SOLICITADO: Early Bird -> Friends and Family -> Preventa
const STAGE_ORDER = ['Early Bird', 'Friends and Family', 'Preventa']; 


const PriceGrid = () => {
    return (
        <div className="price-grid-container">
            {STAGE_ORDER.map((stageName) => {
                const stageData = LOT_PRICES[stageName];
                
                if (!stageData) return null;

                return (
                    <div key={stageName} className="stage-section">
                        <div className="stage-header-wrapper">
                            {/* Resaltado del título de la etapa actual/atractiva */}
                            <h3 className={`stage-title ${stageName === 'Early Bird' ? 'stage-highlight' : ''}`}>
                                {stageName}
                            </h3>
                            <p className="stage-tagline">{stageData.tagline}</p>
                        </div>

                        <div className="lot-cards-wrapper">
                            {stageData.lots.map((lot) => (
                                <div key={lot.type} className={`lot-card lot-type-${lot.type.toLowerCase()}`}>
                                    <div className="lot-type-tag">LOTE TIPO {lot.type}</div>
                                    <p className="lot-size-range">{lot.sizeRange}</p>
                                    
                                    <div className="lot-price-box">
                                        <span className="price-label">Precio por M² (Desde)</span>
                                        <span className="price-value">${lot.priceM2}</span>
                                    </div>

                                    <p className="lot-detail">{lot.detail}</p>
                                    
                                    <Link 
                                        to="/contacto" 
                                        className="lot-cta-button"
                                    >
                                        Solicitar Asesoría
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PriceGrid;