// src/pages/GalleryPage.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, 
    faChevronRight, 
    faChevronLeft, 
    faExpandAlt, // Nuevo ícono para expandir/abrir
} from '@fortawesome/free-solid-svg-icons';

import AmenityTrioHero from '../components/AmenityTrioHero';
import './GalleryPage.css';

// 🛑 Rutas de Imagen de Referencia (Mantenidas)
const IMG_REFERENCES = {
    HERO: '/img/hero/herogalery.jpg',
    LAGOON: [
        '/img/Galeria/LagoonClub/aereacasalago.jpg',
        '/img/Galeria/LagoonClub/albercanatural.jpg',
        '/img/Galeria/LagoonClub/casainterior2.jpg',
        '/img/Galeria/LagoonClub/croquet.jpg',
        '/img/Galeria/LagoonClub/fachada.jpg',
        '/img/Galeria/LagoonClub/dosfachada.jpg',
        '/img/Galeria/LagoonClub/fogateros.jpg',
        '/img/Galeria/LagoonClub/glamping2.jpg',
        '/img/Galeria/LagoonClub/hamacas.jpg',
        '/img/Galeria/LagoonClub/interior3.jpg',
        '/img/Galeria/LagoonClub/puente.jpg',
    ],
    
    CASA_CLUB: [
        '/img/Galeria/CasaClub/Alberca.jpg',
        '/img/Galeria/CasaClub/Asadores.jpg', 
        '/img/Galeria/CasaClub/asadores2.jpg',
        '/img/Galeria/CasaClub/Bar.jpg',
        '/img/Galeria/CasaClub/Escaleras.jpg',
        '/img/Galeria/CasaClub/Fachada.jpg',
        '/img/Galeria/CasaClub/Fachadaderecha.jpg',
        '/img/Galeria/CasaClub/Fachadafrontal.jpg',
        '/img/Galeria/CasaClub/Fachadaizquierda.jpg',
        '/img/Galeria/CasaClub/Fachadalateral.jpg',
        '/img/Galeria/CasaClub/Kids club.jpg',
        '/img/Galeria/CasaClub/Lounge.jpg',
        '/img/Galeria/CasaClub/Terraza.jpg',
        '/img/Galeria/CasaClub/vistaotro.jpg',
    ],
    
    LINEAL: [
        '/img/Galeria/ParqueLineal/AJEDREZ3.jpg',
        '/img/Galeria/ParqueLineal/ASADORES.jpg',
        '/img/Galeria/ParqueLineal/cine.jpg',
        '/img/Galeria/ParqueLineal/jardinComestible.jpg',
        '/img/Galeria/ParqueLineal/petpark.jpg',
        '/img/Galeria/ParqueLineal/pistas2.jpg',
        '/img/Galeria/ParqueLineal/XTREAM FUERTE2.jpg',
        '/img/Galeria/ParqueLineal/xtreamclub.jpg',
    ],
    
    HOGAR: [
        '/img/Galeria/CasaMuestra/casam1.jpeg',
        '/img/Galeria/CasaMuestra/casam2.jpeg',
        '/img/Galeria/CasaMuestra/casam3.jpeg',
        '/img/Galeria/CasaMuestra/casam4.jpeg',
        '/img/Galeria/CasaMuestra/casam5.jpeg',
    ],
};

const TAB_DATA = [
    
    { 
        id: 'casa', 
        name: 'Casa Club Principal', 
        images: IMG_REFERENCES.CASA_CLUB,
        description: "Lujo, comodidad y arquitectura mediterránea. La Casa Club es tu centro social y deportivo: alberca, gimnasio de última generación, salones privados y áreas de *coworking*. El diseño está pensado para elevar tu rutina diaria.",
    },
    { 
        id: 'lagoon', 
        name: 'Lagoon Club', 
        images: IMG_REFERENCES.LAGOON,
        description: "El corazón del desarrollo. Disfruta de la vida de playa sin salir de casa. Nuestras aguas cristalinas y la arena suave te esperan para atardeceres memorables, fogatas y deportes acuáticos. ¡Una amenidad única en la región!",
    },
    { 
        id: 'lineal', 
        name: 'Parque Lineal & Fitness', 
        images: IMG_REFERENCES.LINEAL,
        description: "Más de 5,000 m² dedicados al bienestar. Pista de jogging, áreas de yoga al aire libre, zona de calistenia y jardines de contemplación. Es el espacio ideal para reconectar con la naturaleza y tu salud.",
    },
    { 
        id: 'hogar', 
        name: 'Imagina tu Nuevo Hogar', 
        images: IMG_REFERENCES.HOGAR,
        description: "Inspírate con nuestros modelos de vivienda que reflejan la calidez del estilo Mediterráneo. Estos renders muestran el potencial arquitectónico que puedes alcanzar en tu lote, combinando diseño y funcionalidad.",
    }
];

// Componente del Modal Lightbox
const LightboxModal = ({ images, currentIndex, onClose, onPrev, onNext, onThumbnailClick }) => {
    if (images.length === 0) return null;

    // Hook para cerrar con tecla ESC
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div className="lightbox-modal-overlay">
            <div className="lightbox-modal-content">
                
                {/* Botón de Cerrar */}
                <button className="lightbox-close-btn" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                {/* Contenedor de Imagen Principal */}
                <div className="lightbox-main-image-container">
                    {/* Botón Anterior */}
                    <button className="lightbox-nav-btn prev" onClick={onPrev}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    
                    {/* Imagen Actual */}
                    <img 
                        src={images[currentIndex]} 
                        alt={`Galería - Imagen ${currentIndex + 1}`} 
                        className="lightbox-main-image"
                    />

                    {/* Botón Siguiente */}
                    <button className="lightbox-nav-btn next" onClick={onNext}>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
                
                {/* Carrusel de Miniaturas */}
                <div className="lightbox-thumbnail-carousel">
                    {images.map((imgUrl, index) => (
                        <img
                            key={index}
                            src={imgUrl}
                            alt={`Miniatura ${index + 1}`}
                            className={`lightbox-thumbnail ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => onThumbnailClick(index)}
                            loading="lazy"
                        />
                    ))}
                </div>

                {/* Contador */}
                <div className="lightbox-counter">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>
        </div>
    );
};

// Componente de Colage Dinámico (Modificado para ser interactivo)
const DynamicImageCollage = ({ images, onImageClick }) => (
    <div className="image-collage-grid">
        {images.slice(0, 10).map((imgUrl, index) => (
            <div 
                key={index} 
                className={`collage-item item-${index + 1}`} 
                onClick={() => onImageClick(index)} // 🛑 Nuevo manejador de click
            >
                <img 
                    src={imgUrl} 
                    alt={`Amenidad ${index + 1}`} 
                    loading="lazy"
                    className={
                        index === 0 ? 'span-row-2' : 
                        index === 3 ? 'span-col-2' : 
                        ''
                    }
                />
                {/* Ícono de "Expandir" para indicar interactividad */}
                <div className="image-expand-overlay">
                    <FontAwesomeIcon icon={faExpandAlt} className="expand-icon" />
                </div>
            </div>
        ))}
    </div>
);


// Componente Principal
const GalleryPage = () => {
    const [activeTab, setActiveTab] = useState(TAB_DATA[0].id);
    const [isPopupOpen, setIsPopupOpen] = useState(true);
    
    // 🛑 Estados para el Lightbox
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageIndex, setModalImageIndex] = useState(0);

    const currentTab = TAB_DATA.find(tab => tab.id === activeTab);
    const imagesInTab = currentTab ? currentTab.images : [];

    // 🛑 Funciones para Lightbox
    const openModal = useCallback((index) => {
        setModalImageIndex(index);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const showPrev = () => {
        setModalImageIndex((prevIndex) => 
            (prevIndex - 1 + imagesInTab.length) % imagesInTab.length
        );
    };

    const showNext = () => {
        setModalImageIndex((prevIndex) => 
            (prevIndex + 1) % imagesInTab.length
        );
    };

    // Función para manejar el cambio de pestaña y restablecer el popup
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        // Opcional: Reabrir el popup descriptivo al cambiar de pestaña
        // setIsPopupOpen(true); 
    };

    return (
        <div className="gallery-page">
            
            {/* 1. Portada */}
            <section className="gallery-hero-cover" style={{ backgroundImage: `url(${IMG_REFERENCES.HERO})` }}>
                <div className="hero-content-gallery">
                    <h1 className="hero-title">Tu Legado en Imágenes: Vive Granados</h1>
                    <p className="hero-tagline">
                        Más que renders, la visión completa de tu próximo hogar. 
                        Enamórate de cada rincón, desde la laguna cristalina hasta los senderos de la Sierra Madre.
                    </p>
                    <Link to="/contacto" className="hero-cta-button-gallery">
                        Agendar Visita al Desarrollo <FontAwesomeIcon icon={faChevronRight} className="cta-icon-right"/>
                    </Link>
                </div>
            </section>

            {/* 2. Galería por Secciones */}
            <section className="gallery-tabs-section">
                
                {/* 🛑 POPUP FLOTANTE (Modal Descriptivo) */}
                {isPopupOpen && (
                    <div className="descriptive-popup">
                        <button className="popup-close-btn" onClick={() => setIsPopupOpen(false)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <h3 className="popup-title">Navega por las secciones clave...</h3>
                        <p>
                            Utiliza el menú de abajo para explorar cada amenidad en detalle. Haz **clic en cualquier imagen** para verla a pantalla completa en la galería interactiva.
                        </p>
                    </div>
                )}

                <div className="section-header-gallery">
                    <h2 className="section-heading">Detalles que Enamoran</h2>
                </div>

                <div className="gallery-tabs-nav">
                    {TAB_DATA.map(tab => (
                        <button
                            key={tab.id}
                            className={`gallery-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => handleTabChange(tab.id)}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>
                
                {/* 🛑 TEXTO DESCRIPTIVO DINÁMICO */}
                <div className="dynamic-description-container">
                    <p className="dynamic-description-text">
                        **{currentTab.name}:** {currentTab.description}
                    </p>
                </div>

                <div className="gallery-content-display">
                    <DynamicImageCollage 
                        images={imagesInTab} 
                        onImageClick={openModal} // Pasa la función para abrir el modal
                    />
                </div>
            </section>
            
            {/* 3. Componente Amenity Trio para Desglose */}
            <section className="amenity-trio-integration">
                <div className="info-inner-container">
                    <h2 className="section-heading">Explora a Profundidad</h2>
                    <p className="section-subheading">Accede al detalle de cada una de nuestras zonas exclusivas.</p>
                </div>
                <AmenityTrioHero /> 
            </section>


            {/* 4. Contact CTA */}
            <section className="contact-cta-section-gallery">
                <div className="cta-content-gallery">
                    <h2>¿Listo para Construir tu Legado?</h2>
                    <p>Contáctanos para recibir el brochure completo y plan de financiamiento.</p>
                    <Link to="/contacto" className="hero-cta-button-gallery">
                        Solicitar Información <FontAwesomeIcon icon={faChevronRight} className="cta-icon-right"/>
                    </Link>
                </div>
            </section>

            {/* 🛑 Lightbox Modal */}
            {isModalOpen && (
                <LightboxModal
                    images={imagesInTab}
                    currentIndex={modalImageIndex}
                    onClose={closeModal}
                    onPrev={showPrev}
                    onNext={showNext}
                    onThumbnailClick={setModalImageIndex}
                />
            )}
        </div>
    );
};

export default GalleryPage;