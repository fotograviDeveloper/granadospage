// src/pages/ContactPage.jsx - VERSIÓN FINAL: 3 SECCIONES INDEPENDIENTES Y APILADAS

import React from 'react';
import ContactForm from '../../components/ContactForm';
import LocationMap from '../../components/LocationMap';
import OfficeInvitationSection from '../../components/OfficeInvitationSection'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapMarkerAlt, faPhoneAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons'; 
import './ContactPage.css';

const CONTACT_DETAILS = [
    { icon: faPhoneAlt, label: 'Llámanos', detail: '+52 81 4166 0969', link: 'tel:+52 81 4166 0969' },
    { icon: faEnvelope, label: 'Escríbenos', detail: 'ventas@granadosdelmediterraneo.com', link: 'mailto:ventas@granadosdelmediterraneo.com' },
    { icon: faMapMarkerAlt, label: 'Ubicación', detail: 'Edificio Connexity, Av. Alfonso Reyes Local 11, Monterrey Sur, 64920 Monterrey, N.L.' },
];

const VALUE_PROPOSITION = [
    'Recibe el Brochure Digital Completo y Actualizado.',
    'Consulta Planes de Financiamiento Directo y Descuentos.',
    'Agenda un Tour Virtual o Visita Presencial del Desarrollo.',
    'Conoce el Precio Exacto por m² de los Lotes disponibles.'
];

const ContactPage = () => {
    return (
        <div className="contact-page">
            
            <div className="contact-hero">
                <h1>Hablemos de tu Mejor Inversión en Nuevo León.</h1>
            </div>

            {/* 🛑 1. SECCIÓN EXPERTOS / CONTACTO DIRECTO (Fondo Claro) */}
            <section className="contact-section-wrapper contact-info-panel">
                <div className="contact-panel-content">
                    <h2>Nuestros Expertos están Listos para Asesorarte.</h2>
                    <p className="subtitle">
                        Comunícate directamente con nuestro equipo de asesores inmobiliarios 
                        para resolver todas tus dudas sobre Granados.
                    </p>
                    <div className="direct-contact-details">
                        {CONTACT_DETAILS.map((item, index) => (
                            <div key={index} className="contact-detail-item">
                                <FontAwesomeIcon icon={item.icon} className="detail-icon" />
                                <div>
                                    <strong>{item.label}  :    </strong>
                                    <a href={item.link}>{item.detail}</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 🛑 2. SECCIÓN PROPUESTA DE VALOR / LO QUE OBTIENES (Fondo Blanco) */}
            <section className="contact-section-wrapper value-list-panel">
                <div className="value-list">
                    <h3>Accede a la Información Exclusiva al Contactarnos:</h3>
                    <ul>
                        {VALUE_PROPOSITION.map((item, index) => (
                            <li key={index}>
                                <FontAwesomeIcon icon={faCheckCircle} className="check-icon" /> {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* 🛑 3. SECCIÓN FORMULARIO DE ACCIÓN (Fondo Oscuro) */}
            <section className="contact-section-wrapper contact-form-panel">
                <h2 className="form-title">Completa el Formulario</h2>
                <p className="form-subtitle">Te contactaremos **en menos de 10 minutos** con la información solicitada.</p>
                
                <ContactForm />
            </section>
            
            {/* SECCIÓN DE MAPA/UBICACIÓN (Se mantiene separada) */}
            <section className="location-section" id="map">
              <OfficeInvitationSection/>
                <LocationMap />
            </section>
        </div>
    );
};

export default ContactPage;