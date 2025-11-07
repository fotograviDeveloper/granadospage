// src/components/InvestmentOverview.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de tener Link importado
import './InvestmentOverview.css';

const InvestmentOverview = () => {
    // Datos actualizados incluyendo Friends and Family, precios "Desde" y ajustes en CTAs
    const investmentData = [
        {
            stage: 'Early Bird',
            date: 'Enero 2026',
            price: '$000 m²',
            benefits: ['Precio Exclusivo', 'Selección Preferencial de Lotes', 'Planes de Financiamiento'],
            callout: '¡Próxima Etapa de Cierre!',
            ctaText: 'Me Interesa' // CTA especial para Early Bird
        },
        {
            stage: 'Friends and Family',
            date: 'Ya Disponible', // Ajuste basado en el contexto de Early Bird
            price: '$000 m²', 
            benefits: ['Precio Exclusivo Fundador', 'Máximo Descuento', 'Selección Prioritaria de Lotes'],
            callout: '¡Solo por Tiempo Limitado!'
        },
        
        {
            stage: 'Preventa',
            date: 'Mayo 2026',
            price: '$000 m²',
            benefits: ['Amplios Planes de Financiamiento', 'Planes a Meses sin Intereses', 'Menor Inversión Inicial'],
            callout: 'Próxima Subida de Precios'
        }
    ];
    
    // Función para determinar el texto del botón y la ruta
    const getCtaDetails = (stage) => {
        if (stage === 'Early Bird' || stage === 'Friends and Family') {
            return { 
                text: 'Me Interesa',
                link: '/contacto' 
            };
        }
        return { 
            text: 'Hablar con un Asesor',
            link: '/contacto' 
        };
    };

    return (
        <div className="investment-overview">
            <h3 className="investment-heading">Panorama de Inversión por Etapa</h3>
            
            <div className="investment-grid">
                {investmentData.map((item, index) => {
                    const cta = getCtaDetails(item.stage);
                    
                    return (
                        <div key={index} className="investment-card">
                            <div className="card-stage-header">
                                <span className="stage-tag">{item.stage}</span>
                                <p className="stage-date">{item.date}</p>
                            </div>
                            
                            <div className="card-price-body">
                                <span className="price-tag">Desde {item.price}</span> 
                                <p className="callout">{item.callout}</p>
                            </div>
                            
                            <ul className="benefits-list">
                                {item.benefits.map((benefit, bIndex) => (
                                    <li key={bIndex}>{benefit}</li>
                                ))}
                            </ul>
                            
                            <Link to={cta.link} className="investment-cta">
                                {cta.text}
                            </Link>
                        </div>
                    );
                })}
            </div>
            
            {/* 🛑 AVISO LEGAL AÑADIDO */}
            <p className="disclaimer">
                *Precios de lotes tipo A. Consulta con tu asesor las existencias y condiciones. 
                Los precios y la disponibilidad están sujetos a cambio sin previo aviso.
            </p>
        </div>
    );
};

export default InvestmentOverview;