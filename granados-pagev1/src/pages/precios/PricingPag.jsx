// src/pages/precios/PricingPage.jsx
import React from 'react';
// Asegúrate de que esta ruta sea correcta para tu componente
import PriceGrid from '../../components/PriceGrid'; 
import './PricingPag.css';

// 🛑 RUTA DE IMAGEN: Usa la ruta de tu nuevo mapa de masterplan
const MASTERPLAN_IMAGE = '/img/masterplan.jpg'; 

const PricingPage = () => {
    return (
        <div className="pricing-page">
            
            {/* Sección de Encabezado y Mapa */}
            <section className="map-section">
                <div className="page-heading-container">
                    <h1 className="page-title">Lotes Disponibles y Precios</h1>
                    <p className="page-subtitle">Visualiza la distribución del club residencial y el valor de inversión por etapa.</p>
                </div>

                <div className="masterplan-wrapper">
                    <img 
                        src={MASTERPLAN_IMAGE} 
                        alt="Masterplan de Granados del Mediterráneo" 
                        className="masterplan-image"
                        loading="lazy"
                    />
                </div>
            </section>

            {/* Sección de Precios (usando el PriceGrid) */}
            <section className="prices-section">
                <div className="prices-inner-container">
                    <h2 className="prices-section-title">Inversión por Etapa y Tipología de Lote</h2>
                    
                    {/* 🛑 COMPONENTE PRINCIPAL */}
                    <PriceGrid />

                    <div className="prices-disclaimer-box">
                        <p className="disclaimer-text">
                            <strong>Nota importante:</strong> Los precios por m² aquí mostrados son precios base y están expresados en pesos mexicanos. 
                            La disponibilidad de lotes, así como los precios y condiciones de venta, están **sujetos a cambios sin previo aviso**. 
                            Para recibir un plan de financiamiento personalizado y confirmar existencias, por favor, contacta a un asesor.
                        </p>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default PricingPage;