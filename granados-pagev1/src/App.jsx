// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Importamos todas las páginas
import HomePage from './pages/Homepage';
import ContactPage from './pages/contacto/ContactPage';
import ProjectInfoPage from './pages/proyecto/ProjectInfoPage';
// NUEVA IMPORTACIÓN
import PricingPage from './pages/precios/PricingPag';
import PhotoGallery from './components/PhotoGallery';

function App() {
  return (
    <Routes>
      {/* El MainLayout contiene el Navbar y Footer y permanece fijo. */}
      <Route path="/" element={<MainLayout />}>
        
        {/* HOME (Ruta principal) */}
        <Route index element={<HomePage />} />
        
        {/* PÁGINAS DE NAVEGACIÓN PRINCIPAL */}
        {/* Ruta: /proyecto */}
        <Route path="proyecto" element={<ProjectInfoPage />} />
        {/* Ruta: /contacto */}
        <Route path="contacto" element={<ContactPage />} />
        {/* NUEVA RUTA: /precios */}
        <Route path="precios" element={<PricingPage />} />
        {/* NUEVA RUTA: /galeria */}
        <Route path="galeria" element={<PhotoGallery/>} />

        {/* Ruta 404 */}
        <Route path="*" element={<h1>404 | Página No Encontrada</h1>} />
      </Route>
    </Routes>
  );
}

export default App;