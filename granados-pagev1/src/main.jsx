// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// Importamos BrowserRouter para habilitar el ruteo en toda la app
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Envolvemos <App /> para que todos los componentes hijos
        puedan usar las funcionalidades de React Router */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);