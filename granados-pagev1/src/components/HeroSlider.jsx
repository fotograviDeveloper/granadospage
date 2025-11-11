// src/components/HeroSlider.jsx
import React, { useState, useEffect, useCallback } from 'react'; 
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'; 
import './HeroSlider.css'; 

// Datos de las Diapositivas
const slides = [
  {
    id: 1,
    image: '/img/casa-club.png', 
    title: 'El Lujo Mediterráneo, Centro de tu Legado', // Usar minúsculas para coincidir con el estilo CSS
    subtitle: 'Nuestra Casa Club es el centro de reunión perfecto. Fusiona el diseño arquitectónico mediterráneo con amenidades de clase mundial. Disfruta de la alberca con carril de nado, jacuzzi, sauna/vapor y áreas sociales diseñadas para conectar y celebrar. Un espacio donde tu familia y vecinos crean memorias invaluables.',
    ctaText: 'Conoce más',
    ctaLink: '/proyecto',
    indicatorColor: '#FFFFFF' 
  },
  {
    id: 2,
    image: '/img/lagoon-club.jpg',
    title: 'Tu Escape Campestre, Todos los Días',
    subtitle: 'Tu Escape Campestre, Todos los DíasUn gran lago para la aventura y el descanso. Disfruta de Glamping, Palapas con asadores, canchas de arena y la exclusiva Cancha de Croquet. Es el paraíso natural de Montemorelos, diseñado para crear recuerdos únicos en familia.',
    ctaText: 'Ver Detalles',
    ctaLink: '/proyecto',
    indicatorColor: '#E4C59F'
  },
  {
    id: 3,
    image: '/img/parque-lineal.png',
    title: 'Inversión Inteligente en un Entorno Natural',
    subtitle: 'Granados del Mediterráneo es más que un fraccionamiento; es un proyecto que garantiza la plusvalía de tu patrimonio. Vive rodeado de la Sierra Madre y a solo 2.5 km de Carretera Nacional, con espacios verdes y seguros para toda la familia.',
    ctaText: 'Ver Detalles',
    ctaLink: '/proyecto',
    indicatorColor: '#BC7C74'
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  // Eliminamos isTransitioning ya que no usaremos la lógica de slides extendidos

  const totalSlides = slides.length;

  // Función para avanzar al siguiente slide
  const goToNextSlide = useCallback(() => {
    // 1. Activa la animación de salida del texto (desaparecerá en 0.5s)
    setIsAnimatingOut(true); 

    // 2. Después de 1 segundo (tiempo para que el texto desaparezca), cambiamos la imagen
    // La animación de la imagen dura 1s, por lo que el texto estará oculto antes, durante y
    // justo después del movimiento.
    setTimeout(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
      // 3. Desactiva la animación de salida para que la animación de entrada del nuevo texto inicie
      setIsAnimatingOut(false);
    }, 1000); 
  }, [totalSlides]);


  // Funciones de control manual
  const nextSlide = useCallback(() => {
    goToNextSlide();
  }, [goToNextSlide]);

  const prevSlide = useCallback(() => {
    // Para las flechas manuales, la transición es más rápida.
    setIsAnimatingOut(true);
    setTimeout(() => {
      setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
      setIsAnimatingOut(false);
    }, 500); // 0.5s para un cambio manual ágil
  }, [totalSlides]);


  // 🛑 Corrección 5: Lógica para el cambio automático de diapositivas (cada 5 segundos)
  useEffect(() => {
    // Ciclo total: 5000ms. El texto desaparece en 1000ms y la imagen se desliza en 1000ms.
    const intervalDuration = 5000; 
    
    const interval = setInterval(goToNextSlide, intervalDuration); 
    
    // Limpieza
    return () => clearInterval(interval); 
    
  }, [goToNextSlide]); 

  const goToSlide = (index) => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimatingOut(false);
    }, 500);
  };

  return (
    <section className="hero-slider-container">
      
      <div 
        className="slides-wrapper"
        style={{ 
          // Aplica el deslizamiento lateral
          transform: `translateX(-${currentSlide * 100}%)`,
          // 🛑 Corrección: Usamos la transición definida en el CSS, eliminando el control JS
          transition: 'transform 1s ease-in-out' 
        }}
        // Eliminamos onTransitionEnd ya que no usamos la lógica de slides extendidos
      >
        {slides.map((slide, index) => ( // Usamos slides (originales)
          <div
            key={slide.id} 
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ 
              backgroundImage: `url(${slide.image})` 
            }}
          >
            {/* Degradado Superior para unir con la Navbar */}
            <div className="slide-gradient-top"></div>
            
            {/* Overlay para legibilidad */}
            <div className="slide-overlay"></div>
            
            {/* 🛑 Corrección 6: Clase de animación de salida aplicada si está activo y animando */}
            <div className={`slide-content ${index === currentSlide ? 'active' : ''} ${isAnimatingOut ? 'animating-out' : ''}`}>
              <h1>{slide.title}</h1>
              <p>{slide.subtitle}</p>
              <Link to={slide.ctaLink} className="hero-cta-button">
                {slide.ctaText}
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {/* 🛑 Corrección 3: Flechas centradas (El CSS se encarga del centrado) */}
      <button className="nav-arrow left" onClick={prevSlide} aria-label="Anterior">
        <FontAwesomeIcon icon={faChevronLeft} /> 
      </button>
      <button className="nav-arrow right" onClick={nextSlide} aria-label="Siguiente">
        <FontAwesomeIcon icon={faChevronRight} />
      </button>

      {/* Indicadores de Diapositiva (Puntos) */}
      <div className="slide-indicators">
        {slides.map((slide, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir a la diapositiva ${index + 1}`}
            // 🛑 Corrección 4: Color dinámico del círculo activo
            style={index === currentSlide ? { backgroundColor: slide.indicatorColor, borderColor: slide.indicatorColor } : {}}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;