// src/pages/proyecto/ProjectInfoPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
    faHouseChimney, 
    faPaintBrush, 
    faTree, 
    faMoneyBillWave
} from "@fortawesome/free-solid-svg-icons"; 

import FeatureCard from "../../components/FeatureCard";
import InvestmentOverview from "../../components/InvestmentOverview";
import AmenityCard from "../../components/AmenityCard"; 
import ArchitecturalVision from "../../components/ArchitecturalVision"; 
import InteractiveMasterPlanMap from '../../components/InteractiveMasterPlanMap';
import BrochureDownloadButton from '../../components/BrochureDownloadButton';

import "./ProjectInfoPage.css"; 

const HERO_IMAGE = '/img/hero-granados.jpg'; 
const LAGOON_IMAGE = '/img/lagoon-club-main.jpg';
const CLUB_IMAGE = '/img/hero-granados.jpg'; 


const ProjectInfoPage = () => {
    return (
        <div className="project-info-page">
            
            {/* 1. Project Hero (Banner Principal) */}
            <section className="project-hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
                <div className="hero-content">
                    <h1 className="hero-title">Granados del Mediterráneo</h1>
                    <p className="hero-tagline">Club Residencial Campestre: Un Lienzo para Construir tu Legado.</p>
                    
                    <BrochureDownloadButton 
                        className="hero-cta-button" 
                        text="Descargar Brochure"
                    />
                </div>
            </section>

            {/* 2. Value Proposition (Propuesta de Valor) */}
            <section className="value-proposition-section">
                <div className="info-inner-container">
                    <h2 className="section-heading">Nuestro Concepto Integral</h2>
                    <p className="section-subheading">Más que un fraccionamiento, es un estilo de vida que eleva tu patrimonio y bienestar.</p>
                    
                    <div className="feature-cards-grid">
                        <FeatureCard 
                            icon={faPaintBrush} 
                            title="Arquitectura Mediterránea" 
                            description="Diseño de calidez que fusiona las vistas de la Sierra Madre con el lujo campestre."
                        />
                        <FeatureCard 
                            icon={faTree}
                            title="Más de 40 Amenidades" 
                            description="Espacios diseñados para el disfrute familiar, desde el Lagoon Club hasta la Casa del Árbol."
                        />
                        <FeatureCard 
                            icon={faMoneyBillWave}
                            title="Inversión y Plusvalía" 
                            description="Lotes proyectados como el punto de partida para una propuesta arquitectónica de alto valor."
                        />
                         <FeatureCard 
                            icon={faHouseChimney}
                            title="Ubicación Estratégica" 
                            description="A solo 2.5 km de Carretera Nacional en Montemorelos, con rápido acceso a la zona centro y servicios."
                        />
                    </div>
                </div>
            </section>
            
            {/* 3. Amenity Highlights (Amenidades Destacadas) */}
            <section className="amenity-highlights-section">
                <div className="info-inner-container">
                    <h2 className="section-heading">Nuestras Amenidades Estelares</h2>
                    <p className="section-subheading">Dos Clubes exclusivos diseñados para el bienestar y la recreación familiar.</p>
                    
                    <AmenityCard 
                        title="Casa Club Principal" 
                        description="El corazón del desarrollo. Este espacio arquitectónico con estilo mediterráneo alberga la alberca, gimnasio, salón de eventos y áreas de recreación social y familiar."
                        imageUrl={CLUB_IMAGE}
                        linkUrl="/amenidades/casa-club"
                        isReversed={true}
                    />
                    <AmenityCard 
                        title="Lagoon Club y Playa Privada" 
                        description="Disfruta de la vida de playa sin salir del club. Nuestro Lagoon Club ofrece una laguna cristalina, área de asadores, fogateros y canchas de arena."
                        imageUrl={LAGOON_IMAGE}
                        linkUrl="/amenidades/lagoon-club"
                        isReversed={false}
                    />
                    
                </div>
                <section>
                    <InteractiveMasterPlanMap/> 
                </section>
            </section>
            
            {/* 4. Visión Arquitectónica (Sección agregada previamente) */}
            <section className="vision-section">
                <div className="info-inner-container">
                    <ArchitecturalVision />
                </div>
            </section>

            {/* 5. Investment Overview (Precios y Etapas) */}
            <section className="investment-section">
                <div className="info-inner-container">
                    <h2 className="section-heading">Inversión y Etapas de Preventa</h2>
                    <InvestmentOverview />
                </div>
            </section>

            {/* 6. Contact CTA (Llamada a la Acción) */}
            <section className="contact-cta-section">
                <div className="info-inner-container cta-content">
                    <h2>Tu Legado Comienza Hoy</h2>
                    <p>Contacta a un asesor para recibir el catálogo completo y plan de financiamiento.</p>
                    <Link to="/contacto" className="hero-cta-button">
                        Agendar Asesoría Personalizada
                    </Link>
                </div>
            </section>

        </div>
    );
};

export default ProjectInfoPage;