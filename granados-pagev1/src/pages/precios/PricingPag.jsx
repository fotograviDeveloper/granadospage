// src/pages/precios/PricingPag.jsx
import React from 'react';
import PriceCard from '../../components/PriceCard'; // Importamos el componente
import './PricingPag.css'; // Estilos para la página

// Datos de Lotes
const lotesData = [
  {
    title: "Lote Tipo A",
    price: "150",
    size: "500",
    features: ["Ubicación Estándar", "Acceso a Club Social", "Servicios a pie de lote", "Seguridad 24/7"],
    type: "Preventa",
    isFeatured: true,
  },
  {
    title: "Lote Tipo AA",
    price: "185",
    size: "750",
    features: ["Ubicación Privilegiada", "Acceso Preferente a Club", "Vistas Panorámicas", "Servicios Subterráneos"],
    type: "Early Bird",
    isFeatured: true, // Destacamos este como el de Early Bird
  },
  {
    title: "Lote Tipo AAA",
    price: "220",
    size: "1000",
    features: ["Frente a Lago o Reserva Natural", "Membresía VIP Club", "Máxima Plusvalía", "Diseño de Paisajismo Incluido"],
    type: "Friends & Family",
    isFeatured: true,
  },
];

const PricingPag = () => {
  return (
    <section className="pricing-page-section">
      <header className="pricing-header">
        <h1>Planes de Inversión y Precios de Lotes</h1>
        <p>Elige el lote ideal en Montemorelos que se adapte a tus sueños y tu inversión. Precios por tiempo limitado.</p>
      </header>
      
      {/* Contenedor de las Tarjetas de Precios */}
      <div className="pricing-grid">
        {lotesData.map((lote) => (
          <PriceCard
            key={lote.title}
            title={lote.title}
            price={lote.price}
            size={lote.size}
            features={lote.features}
            type={lote.type}
            isFeatured={lote.isFeatured}
          />
        ))}
      </div>
    </section>
  );
};

export default PricingPag;