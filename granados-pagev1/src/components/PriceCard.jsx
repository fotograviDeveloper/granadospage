// src/components/PriceCard.jsx
import React from 'react';
import './PriceCard.css';

const PriceCard = ({ title, price, size, features, type, isFeatured }) => {
  return (
    <div className={`price-card ${isFeatured ? 'featured' : ''}`}>
      
      {/* Etiqueta de Destacado (Early Bird) */}
      {isFeatured && <div className="card-badge">{type}</div>}
      
      {/* Título y Tipo de Lote */}
      <h3 className="card-title">{title}</h3>
      <p className="card-size">{size} M²</p>

      {/* Precio */}
      <div className="card-price-container">
        <span className="price-currency">$</span>
        <span className="price-amount">{price}</span>
        <span className="price-suffix">/ m²</span>
      </div>

      {/* Características del Lote */}
      <ul className="card-features-list">
        {features.map((feature, index) => (
          <li key={index} className="feature-item">
            <span className="feature-icon">✅</span> {feature}
          </li>
        ))}
      </ul>

      {/* Llamada a la Acción */}
      <a href="/contacto" className="card-button">
        Solicitar Información
      </a>
    </div>
  );
};

export default PriceCard;