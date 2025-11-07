// src/components/AmenityTrioHero.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './AmenityTrioHero.css';
import InteractiveMasterPlanMap from './InteractiveMasterPlanMap';

// Datos de las Amenidades para la vista Hero
const AMENITIES_DATA = [
       {
        title: "Parque Lineal",
        tagline: "Senderos, naturaleza y áreas de recreación al aire libre.",
        image: '/img/amenidades/parque_lineal/jardin.jpg',
        path: '/amenidades/parque-lineal',
    },
    {
        title: "Casa Club",
        tagline: "El corazón social y deportivo del desarrollo.",
        image: '/img/amenidades/casa_club/casaclub.jpeg', // Reemplazar con imagen de alta calidad
        path: '/amenidades/casa-club',
    },
 
    {
        title: "Lagoon Club",
        tagline: "Playa artificial, deportes acuáticos y fogateros.",
        image: '/img/amenidades/lagoon_club/lagoclubaerea.jpg',
        path: '/amenidades/lagoon-club',
    },
];

const AmenityTrioHero = () => {
    return (
        <div className="amenity-trio-section">
            <h2 className="sr-only">Explora nuestras Amenidades Principales</h2> {/* Título para accesibilidad */}

            {/* 1. División en 3 (Hero) */}
            <div className="amenity-trio-container">
                {AMENITIES_DATA.map((amenity, index) => (
                    <Link 
                        key={amenity.title}
                        to={amenity.path}
                        className="amenity-trio-card"
                        style={{ backgroundImage: `url(${amenity.image})` }}
                    >
                        <div className="trio-overlay">
                            <h3>{amenity.title}</h3>
                            <p>{amenity.tagline}</p>
                            <span className="view-more">Ver Detalle &rarr;</span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* 2. Mapa Grande Horizontal */}
           <InteractiveMasterPlanMap/>
        </div>
    );
};

export default AmenityTrioHero;