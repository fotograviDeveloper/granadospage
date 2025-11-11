// src/components/InvestmentOverview.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './InvestmentOverview.css';

// Datos de Inversión (se mantienen, pero sin necesidad de CTA individual)
const investmentData = [
    {
        stage: 'Early Bird (1ª Etapa)',
        stageTag: '¡ÚLTIMOS LOTES!',
        date: 'Cierre Próximo',
        callout: '¡El Mejor Precio por m²! Asegura tu Lote.',
        lotTypes: [
            { type: 'Tipo A', price: '$600 m²' }, 
            { type: 'Tipo AA', price: '$700 m²' }, 
            { type: 'Tipo AAA', price: '$800 m²' } 
        ],
        benefits: ['Máximo Descuento por m²', 'Selección Preferencial de Lotes', 'Lotes desde 350 m²*'] 
    },
    {
        stage: 'Friends & Family (2ª Etapa)',
        stageTag: 'PRÓXIMA ETAPA',
        date: 'Enero 2026',
        callout: 'Ahorra Antes de la Preventa General',
        lotTypes: [
            { type: 'Tipo A', price: '$900 m²' }, 
            { type: 'Tipo AA', price: '$1,100 m²' }, 
            { type: 'Tipo AAA', price: '$1,300 m²' } 
        ],
        benefits: ['Inversión a Precio Preferencial', 'Planes de Financiamiento Flexibles', 'Lotes desde 350 m²*']
    },
    {
        stage: 'Preventa General (3ª Etapa)',
        stageTag: 'PROYECTADO',
        date: 'Mayo 2026',
        callout: 'Precio Sujeto a Incremento (Hasta $1,800 m²)', 
        lotTypes: [
            { type: 'Rango Estimado', price: 'Desde $1,400 m²*' }, 
        ],
        benefits: ['Amplios Planes de Financiamiento', 'Planes a Meses sin Intereses', 'Reserva con Menor Inversión Inicial']
    }
];


const InvestmentOverview = () => {
    
    return (
        <div className="investment-overview">
            <h3 className="investment-heading">Panorama de Inversión por Etapa y Tipo de Lote</h3>
            
            <div className="investment-grid">
                {investmentData.map((item, index) => {
                    
                    return (
                        <div key={index} className="investment-card">
                            <div className="card-stage-header">
                                <span className="stage-tag">{item.stageTag}</span>
                                <p className="stage-date">{item.date}</p>
                            </div>
                            
                            <div className="card-price-body">
                                
                                <div className="lot-price-details">
                                    {item.lotTypes.map((lot, lotIndex) => (
                                        <div key={lotIndex} className="lot-price-item">
                                            <span className="lot-type">{lot.type}:</span>
                                            <span className="price-tag">{lot.price}</span> 
                                        </div>
                                    ))}
                                </div>
                                <p className="callout">{item.callout}</p>
                            </div>
                            
                            <ul className="benefits-list">
                                {item.benefits.map((benefit, bIndex) => (
                                    <li key={bIndex}>{benefit}</li>
                                ))}
                            </ul>
                            
                            {/* 🛑 ELIMINADO EL CTA INDIVIDUAL */}
                        </div>
                    );
                })}
            </div>

            {/* 🛑 BOTÓN UNIFICADO AGREGADO ABAJO DEL GRID */}
            <div className="investment-cta-container">
                <Link to="/precios" className="global-investment-cta">
                    Ver Disponibilidad de Lotes
                </Link>
            </div>
            
            <p className="disclaimer">
                *Precios mostrados por metro cuadrado (m²) para lotes tipo A, AA y AAA según la etapa vigente. 
                El tamaño mínimo de lote es de 350 m² (Lote Tipo A), consulte existencias.
                Los precios y la disponibilidad están sujetos a cambio sin previo aviso.
            </p>
        </div>
    );
};

export default InvestmentOverview;