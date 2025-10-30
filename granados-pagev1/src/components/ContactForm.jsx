// src/components/ContactForm.jsx
import React, { useState } from 'react';
import './ContactForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser, faPhone, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const ContactForm = ({ lotesData }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        loteInteres: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'error', 'idle'

    // Maneja los cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Lógica de envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('idle');

        // 🛑 Aquí debes reemplazar con la URL de tu endpoint de backend (ej. N8N o una API)
        const ENDPOINT_URL = 'https://n8n.srv894483.hstgr.cloud/webhook/form-contacto'; 

        try {
            const response = await fetch(ENDPOINT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', phone: '', message: '', loteInteres: '' }); // Limpiar formulario
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            setStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 🛑 CORRECCIÓN: Usamos lotesData || {} para evitar el error de TypeError
    const lotesOptions = Object.keys(lotesData || {}).filter(id => {
        const data = lotesData[id];
        return data && data.estado !== 'vendido';
    }).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })); // Ordenación numérica más robusta
    
    // Contenido dinámico del botón de envío
    const buttonContent = isSubmitting ? 'Enviando...' : (
        <>
            <FontAwesomeIcon icon={faPaperPlane} /> Enviar Mensaje
        </>
    );

    return (
        <section className="contact-section">
            <div className="contact-layout-container">
                <div className="contact-content-box">
                    <h2 className="contact-title">
                        Contáctanos e Inicia Tu Legado
                    </h2>
                    <p className="contact-subtitle">
                        Déjanos tus datos y un asesor se comunicará contigo de inmediato para brindarte información detallada sobre la disponibilidad y planes de financiamiento.
                    </p>
                    
                    {/* Mensajes de Estado */}
                    {status === 'success' && (
                        <div className="form-alert success">
                            ¡Mensaje enviado con éxito! Nos comunicaremos contigo a la brevedad.
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="form-alert error">
                            Ocurrió un error al enviar el mensaje. Por favor, inténtalo de nuevo o llámanos.
                        </div>
                    )}

                    <form className="contact-form" onSubmit={handleSubmit}>
                        
                        {/* Grupo 1: Nombre, Email, Teléfono */}
                        <div className="form-group-triple">
                            <div className="form-field">
                                <label htmlFor="name">Nombre Completo *</label>
                                <div className="input-with-icon">
                                    <FontAwesomeIcon icon={faUser} className="input-icon" />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Tu nombre completo"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="form-field">
                                <label htmlFor="email">Correo Electrónico *</label>
                                <div className="input-with-icon">
                                    <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="ejemplo@correo.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-field">
                                <label htmlFor="phone">Teléfono (WhatsApp)</label>
                                <div className="input-with-icon">
                                    <FontAwesomeIcon icon={faPhone} className="input-icon" />
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="(81) 1234 5678"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Campo Lote de Interés (Opcional, si tienes los datos) */}
                        {lotesOptions.length > 0 && (
                            <div className="form-field">
                                <label htmlFor="loteInteres">Lote de Interés (Opcional)</label>
                                <select
                                    id="loteInteres"
                                    name="loteInteres"
                                    value={formData.loteInteres}
                                    onChange={handleChange}
                                >
                                    <option value="">Selecciona un lote o deja vacío</option>
                                    {lotesOptions.map(id => (
                                        <option key={id} value={id}>Lote {id} - {lotesData[id]?.estado}</option>
                                    ))}
                                </select>
                            </div>
                        )}


                        {/* Campo de Mensaje */}
                        <div className="form-field">
                            <label htmlFor="message">Tu Mensaje</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Me gustaría saber más sobre la financiación o los lotes disponibles..."
                            ></textarea>
                        </div>

                        <button type="submit" className="submit-button" disabled={isSubmitting}>
                            {buttonContent}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactForm; 