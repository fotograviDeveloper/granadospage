// src/layouts/Footer.jsx
import React from 'react';
// (Opcional: puedes crear un src/layouts/Footer.css)

const Footer = () => {
  return (
    <footer style={{ padding: '2rem', backgroundColor: '#20232a', color: 'white', textAlign: 'center' }}>
      <p>Derechos Reservados © {new Date().getFullYear()} Granados Page V1</p>
    </footer>
  );
};

export default Footer;