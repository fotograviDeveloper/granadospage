// src/pages/ContactPage.jsx

import React from 'react';
import ContactForm from '../../components/ContactForm';
import LocationMap from '../../components/LocationMap'; // Componente de mapa
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapMarkerAlt, faPhoneAlt, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import './ContactPage.css';

// Datos de contacto y argumentos de venta
const CONTACT_INFO = [
    { icon: faPhoneAlt, label: 'Llámanos', detail: '+52 81 0000 0000', link: 'tel:+528100000000' },
    { icon: faEnvelope, label: 'Escríbenos', detail: 'asesores@granados.com', link: 'mailto:asesores@granados.com' },
    { icon: faMapMarkerAlt, label: 'Ubicación', detail: 'Montemorelos, NL (Ver Mapa)', link: '#map' },
];

const VALUE_PROPOSITION = [
    'Recibe el Brochure Digital Completo.',
    'Consulta Planes de Financiamiento Directo.',
    'Agenda un Tour Virtual o Presencial.',
    'Conoce el Precio Exacto por m² de Lotes disponibles.'
];

const ContactPage = () => {
    return (
        <div className="contact-page">
            
            <div className="contact-hero">
                <h1>Hablemos de tu mejor Inversión</h1>
            </div>

            {/* SECCIÓN PRINCIPAL: CONFIANZA (IZQ) Y FORMULARIO (DER) */}
            <section className="contact-main-grid">
                
                {/* LADO IZQUIERDO: CONFIANZA Y ARGUMENTOS DE VENTA */}
                <div className="contact-info-panel">
                    
                    <div className="contact-panel-content">
                        <h2>¡Estás a un paso de asegurar tu Inversión!</h2>
                        <p className="subtitle">
                            Contacta a uno de nuestros asesores expertos para recibir información personalizada 
                            y la guía completa para invertir en Granados.
                        </p>

                        <div className="value-list">
                            <h3>Al contactarnos, obtendrás:</h3>
                            <ul>
                                {VALUE_PROPOSITION.map((item, index) => (
                                    <li key={index}>
                                        <FontAwesomeIcon icon={faCalendarCheck} className="check-icon" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="direct-contact-details">
                            {CONTACT_INFO.map((item, index) => (
                                <div key={index} className="contact-detail-item">
                                    <FontAwesomeIcon icon={item.icon} className="detail-icon" />
                                    <a href={item.link}>{item.detail}</a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* LADO DERECHO: FORMULARIO DE ACCIÓN */}
                <div className="contact-form-panel">
                    <h2 className="form-title">Completa el Formulario</h2>
                    <p className="form-subtitle">Te contactaremos en menos de 10 minutos.</p>
                    
                    <ContactForm />
                </div>
            </section>
            
            {/* SECCIÓN DE MAPA/UBICACIÓN (Usando el componente LocationMap) */}
            <section className="location-section" id="map">
                <LocationMap />
            </section>
        </div>
    );
};

export default ContactPage;