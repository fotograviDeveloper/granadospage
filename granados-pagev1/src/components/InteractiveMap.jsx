import React, { useEffect, useRef, useCallback, useState } from 'react';
import './InteractiveMap.css';
// Asegúrate de que esta ruta sea correcta para tu JSON de respaldo
import fallbackData from '../assets/fallback-lotes.json'; 

// --- Configuración y Constantes ---
const WHATSAPP_BASE = 'https://wa.me/528123852034?text=';  
const CONTACTO_URL = '/Contacto'; 
const SVG_PATH = '/SVGmapa.svg'; // Asegúrate de que esto apunte al mismo SVG que en plain JS (renómbralo si es necesario)
const DATA_STORAGE_KEY = 'map_data'; // Para persistir en localStorage

const COLOR_BY_STATUS = { 
    disponible: '#2a5a54',
    reservado: '#ffc107',
    vendido: '#ef5350',
    bloqueado: '#e5e7eb',
    'n/a': '#e5e7eb'
};
const COLOR_PRESETS = { 
    verde: '#2a5a54', 
    amarillo: '#ffc107', 
    rojo: '#ef5350', 
    gris: '#e5e7eb' 
};
const FALLBACK_COLOR = '#d1e7dd';
const SHAPE_SEL = 'path,polygon,rect,ellipse'; 

// COMENTADO: Contenido de la ventana modal
/*
const WELCOME_BANNER_CONTENT = `
  <div class="welcome-content">
    <div class="title" style="font-weight:700;">¡Bienvenido al Mapa Interactivo!</div>
    <div class="minor">Identifica la disponibilidad, haz clic en un lote para ver detalles y contactar a un asesor.</div>
    <div class="modal-button-wrapper"> 
      <button id="close-modal-btn" class="modal-close-btn">¡Empecemos!</button>
    </div>
  </div>
`;
*/

const INITIAL_LOT_INFO = { 
    titulo: 'PASA EL CURSOR POR EL MAPA', 
    superficie_m2: null, 
    estado: 'n/a',
    tipo: 'Tipo',
    costo_m2: null,
    nota: 'Da click en el lote para seleccionar' 
};

// --- Utils ---
function norm(s) { return String(s ?? '').trim(); }
function keyify(s) { return norm(s).toLowerCase().replace(/lote[\s_:-]*/g, 'lote').replace(/[^a-z0-9]/g, ''); }
function pickColor(info) {
  if (!info) return FALLBACK_COLOR;
  const estado = norm(info.estado).toLowerCase();
  const c = norm(info.color);
  if (c) {
    if (c.startsWith('#') || /^rgb|^hsl/i.test(c)) return c;
    if (COLOR_PRESETS[c.toLowerCase()]) return COLOR_PRESETS[c.toLowerCase()];
  }
  return COLOR_BY_STATUS[estado] || FALLBACK_COLOR;
}
function normalizeRows(j) {
  if (Array.isArray(j)) return j[0]?.json ? j.map(x => x.json) : j;
  if (j?.data) return j.data;
  if (j?.items) return j.items.map(x => x.json ?? x);
  if (j?.rows) return j.rows;
  return Array.isArray(j) ? j : [];
}

function isPaintable(el) {
  const tag = el.tagName.toLowerCase();
  if (!/^(path|polygon|rect|ellipse)$/i.test(tag)) return false;
  try {
    const cs = el.ownerDocument.defaultView.getComputedStyle(el);
    return cs.fill && cs.fill !== 'none';
  } catch (e) { return true; }
}

function formatCurrency(value) {
    if (!value) return 'Consultar';
    
    const rawValue = String(value).replace(/[$, ]/g, '');
    const numberValue = parseFloat(rawValue);

    if (isNaN(numberValue)) return 'Consultar';

    // Formato estándar MXN
    return `$${numberValue.toLocaleString('es-MX', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2,
        useGrouping: true
    })}`;
}

// --- COMPONENTE PRINCIPAL ---
export default function InteractiveMap() {
  // Refs y Estado
  const svgContainerRef = useRef(null); // Ref para el div contenedor del SVG inline
  // COMENTADO: Ref para la ventana modal
  // const modalRef = useRef(null); 
  const cleanupRef = useRef(null); 
  
  const [data, setData] = useState([]); 
  const [svgContent, setSvgContent] = useState(''); // Estado para el contenido SVG inline
  const [activeEl, setActiveEl] = useState(null); 
  const [currentInfo, setCurrentInfo] = useState(INITIAL_LOT_INFO); 
  
  // Lógica para reiniciar el estado de selección
  const resetSelection = useCallback(() => {
    if (activeEl) { activeEl.style.filter = 'none'; }
    setActiveEl(null);
    setCurrentInfo(INITIAL_LOT_INFO);
    
    document.getElementById('lot-info-sticky-panel')?.classList.remove('active');
    document.getElementById('lot-info-sticky-panel')?.classList.add('initial-state');
  }, [activeEl]);

  // COMENTADO: HANDLER DEL MODAL COMPLETO
  /*
  const showModal = useCallback(() => {
    const modal = modalRef.current;
    if (!modal) return;
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    const closeBtn = document.getElementById('close-modal-btn');
    // Limpiar handler anterior para evitar múltiples ejecuciones
    const existingHandler = closeBtn?.__clickHandler;
    if (existingHandler) { closeBtn.removeEventListener('click', existingHandler); }
    
    // Lógica al presionar "¡Empecemos!" (solo cierra modal)
    const handler = () => {
      // 1. Ocultar Modal
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      
      // Desactivar listener
      if (closeBtn) {
        closeBtn.removeEventListener('click', handler);
        closeBtn.__clickHandler = null;
      }
    };
    
    if (closeBtn) {
        closeBtn.__clickHandler = handler; 
        closeBtn.addEventListener('click', handler);
    }
  }, []);
  */
  
  // Cargar SVG como texto y renderizar inline
  useEffect(() => {
    console.log('DEBUG: Cargando SVG inline desde', SVG_PATH);
    fetch(SVG_PATH)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then(text => {
        setSvgContent(text);
        console.log('DEBUG: SVG contenido cargado exitosamente. Longitud:', text.length);
      })
      .catch(err => console.error('DEBUG: Error cargando SVG:', err));
  }, []);

  // COMENTADO: useEffect para mostrar el modal inmediatamente al cargar
  /*
  useEffect(() => {
    console.log('DEBUG: Mostrando modal al mount.');
    // showModal(); 
  }, [showModal]); 
  */

  // useEffect para cargar datos locales automáticamente al mounting (con persistencia)
  useEffect(() => {
    console.log('DEBUG: Iniciando carga de datos al mount.');
    const storedData = localStorage.getItem(DATA_STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setData(parsedData);
        console.log('DEBUG: Datos cargados desde localStorage exitosamente. Longitud:', parsedData.length);
        console.log('DEBUG: Muestra de datos del localStorage (primeros 5):', parsedData.slice(0, 5));
      } catch (error) {
        console.error('DEBUG: Error al parsear datos de localStorage:', error);
      }
    } else {
      console.log('DEBUG: No hay datos en localStorage. Cargando desde fallbackData.');
      console.log('DEBUG: fallbackData raw (primeros 5):', fallbackData.slice(0, 5)); // Verificar import
      const processedData = normalizeRows(fallbackData);
      console.log('DEBUG: Datos procesados con normalizeRows. Longitud:', processedData.length);
      console.log('DEBUG: Muestra de datos procesados (primeros 5):', processedData.slice(0, 5));
      setData(processedData);
      try {
        localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(processedData));
        console.log('DEBUG: Datos guardados en localStorage exitosamente.');
      } catch (error) {
        console.error('DEBUG: Error al guardar en localStorage:', error);
      }
    }
  }, []); // Solo corre una vez al mount

  // updateStickyPanel y initSvgLogic con logs
  const updateStickyPanel = useCallback((info, lotId, isClick = false) => {
    console.log('DEBUG: Actualizando panel sticky. isClick:', isClick, 'Info:', info);
    const panel = document.getElementById('lot-info-sticky-panel');
    const infoToUse = info && Object.keys(info).length > 0 ? info : INITIAL_LOT_INFO;
    
    if (activeEl && !isClick) { 
      console.log('DEBUG: Skip update - activeEl existe y no es click.');
      return; 
    }

    setCurrentInfo(infoToUse);

    if (!panel) {
      console.log('DEBUG: Panel no encontrado.');
      return;
    }
    
    if (isClick) {
      panel.classList.add('active'); 
      panel.classList.remove('initial-state');
      console.log('DEBUG: Panel activado (click).');
    } else {
      panel.classList.remove('active'); 
      panel.classList.add('initial-state');
      console.log('DEBUG: Panel en estado inicial (hover).');
    }
    
  }, [activeEl]); 
  
  
  const initSvgLogic = useCallback((svgRoot, lotesData) => {
    console.log('DEBUG: Iniciando initSvgLogic. Longitud de lotesData:', lotesData.length);
    if (!svgRoot || !lotesData.length) {
      console.log('DEBUG: Skip initSvgLogic - svgRoot o lotesData vacíos.');
      return;
    }
    
    // Log total elementos con ID en SVG (ahora directamente en DOM)
    const allIdElements = [...svgRoot.querySelectorAll('[id]')];
    console.log('DEBUG: Total elementos con ID en SVG:', allIdElements.length);
    // Muestra de IDs raw del SVG (primeros 5)
    const sampleSvgIds = allIdElements.slice(0, 5).map(el => el.id);
    console.log('DEBUG: Muestra de IDs raw del SVG (primeros 5):', sampleSvgIds);
    // Muestra de keys procesadas del SVG (primeros 5)
    const sampleSvgKeys = sampleSvgIds.map(keyify);
    console.log('DEBUG: Muestra de keys procesadas del SVG (primeros 5):', sampleSvgKeys);
    // Muestra de keys procesadas del JSON (primeros 5)
    const sampleJsonKeys = lotesData.slice(0, 5).map(r => keyify(r.id ?? r.Id ?? ''));
    console.log('DEBUG: Muestra de keys procesadas del JSON (primeros 5):', sampleJsonKeys);
    
    // Crear mapa byId del JSON
    const byId = new Map();
    lotesData.forEach(r => {
      const k = keyify(r.id ?? r.Id ?? '');
      if (k) byId.set(k, r);
    });
    console.log('DEBUG: Mapa byId creado. Tamaño:', byId.size);
    
    // Filtrar nodos con coincidencia en byId
    const lotNodes = allIdElements.filter(n => byId.has(keyify(n.id)));
    console.log('DEBUG: lotNodes encontrados:', lotNodes.length);
    
    if (!lotNodes.length) {
      console.log('DEBUG: No hay coincidencias de IDs. Verifica si keyify coincide entre JSON y SVG IDs.');
    }
    
    const cleanupHandlers = [];
    
    lotNodes.forEach(node => {
      const lotIdRaw = node.id;
      const info = byId.get(keyify(lotIdRaw)) || null;
      
      // PINTAR LOTES
      const paintables = node.matches(SHAPE_SEL) ? [node] : [...node.querySelectorAll(SHAPE_SEL)].filter(isPaintable);
      const color = pickColor(info);
      console.log('DEBUG: Pintando nodo:', lotIdRaw || 'sin ID (index)', 'Color:', color);

      paintables.forEach(s => {
        s.style.fill = color; 
        s.style.fillOpacity = '0.55';
        s.style.pointerEvents = 'auto';
        s.style.cursor = 'pointer';
      });
      node.style.pointerEvents = 'auto';

      // --- Handlers ---
      const onEnter = () => { 
        if (!activeEl) { updateStickyPanel(info, lotIdRaw, false); }
        if (activeEl !== node) { node.style.filter = 'brightness(1.15)'; }
      };
      
      const onLeave = () => { 
        if (!activeEl) { updateStickyPanel(INITIAL_LOT_INFO, null, false); }
        if (activeEl !== node) { node.style.filter = 'none'; } 
      };

      const onClick = (ev) => {
        ev.stopPropagation();

        if (activeEl === node) { return; }
        
        if (activeEl) { activeEl.style.filter = 'none'; }
        
        setActiveEl(node);
        node.style.filter = 'brightness(1.06)';
        
        updateStickyPanel(info, lotIdRaw, true); // true = clic
      };
      
      // Tooltip y Listeners
      const sup = info ? (info.superficie_m2 ? `${Number(String(info.superficie_m2).replace(/[, ]/g, '')).toLocaleString('es-MX')} m²` : '') : '';
      node.setAttribute('title', `${norm(info ? info.titulo : '')} | ${sup} | ${norm(info ? info.estado : '').toUpperCase()}`);

      node.addEventListener('mouseenter', onEnter);
      node.addEventListener('mouseleave', onLeave);
      node.addEventListener('click', onClick);
      node.addEventListener('touchend', onClick, { passive: true });
      
      cleanupHandlers.push(() => {
        node.removeEventListener('mouseenter', onEnter);
        node.removeEventListener('mouseleave', onLeave);
        node.removeEventListener('click', onClick);
        node.removeEventListener('touchend', onClick);
        node.style.filter = 'none';
      });
    });

    // Lógica para resetear la selección al hacer clic fuera
    const onDocClick = (e) => {
      if (!activeEl) return; 
      
      const clickedInPanel = document.getElementById('lot-info-sticky-panel')?.contains(e.target);
      const clickedInSVG = svgContainerRef.current?.contains(e.target);
      
      if (!clickedInSVG && !clickedInPanel) {
        resetSelection();
      }
    };

    document.addEventListener('click', onDocClick);
    cleanupHandlers.push(() => { document.removeEventListener('click', onDocClick); });

    return () => { cleanupHandlers.forEach(fn => fn()); };
  }, [activeEl, updateStickyPanel, resetSelection]);
  
  
  // === useEffect de Sincronización ===
  useEffect(() => {
    console.log('DEBUG: Sincronización useEffect activado. data.length:', data.length, 'svgContent:', !!svgContent);
    if (!data.length || !svgContent || !svgContainerRef.current) {
      console.log('DEBUG: Skip sincronización - data vacía, svgContent no listo o ref no disponible.');
      return;
    }

    cleanupRef.current?.();
    
    const timeoutId = setTimeout(() => {
        console.log('DEBUG: Ejecutando initSvgLogic dentro del timeout.');
        // Pasamos svgContainerRef.current como svgRoot (el div contiene el SVG inline)
        cleanupRef.current = initSvgLogic(svgContainerRef.current, data);
        
        document.getElementById('lot-info-sticky-panel')?.classList.add('initial-state');
        updateStickyPanel(INITIAL_LOT_INFO, null, false); 
    }, 100); 

    return () => {
        clearTimeout(timeoutId); 
        cleanupRef.current?.();
        document.getElementById('lot-info-sticky-panel')?.classList.remove('active');
    };
  }, [data, svgContent, initSvgLogic, updateStickyPanel]); // Añadido svgContent como dependencia

  
  // Desestructuración y Lógica de Enlaces para el Render
  const { titulo, superficie_m2, estado, tipo, costo_m2, nota, link } = currentInfo;
  const isInitial = currentInfo === INITIAL_LOT_INFO;
  const isPanelActive = activeEl !== null; 
  
  const numero = norm(titulo) || 'Lote';
  const currentStatus = norm(estado).toUpperCase() || 'VE LOS DATOS AQUÍ';
  
  const formattedCosto = formatCurrency(costo_m2);
  const sup = superficie_m2 ? `${Number(String(superficie_m2).replace(/[, ]/g, '')).toLocaleString('es-MX')} m²` : 'm² no disponible';
  
  
  // Lógica de botones y enlaces
  const estadoLowerCase = norm(estado).toLowerCase();
  const isDisabled = ['vendido', 'bloqueado'].includes(estadoLowerCase);
  const cotizarText = estadoLowerCase === 'reservado' ? 'Contactarme si se libera' : 'COTIZAR';

  // Generación de enlace de WhatsApp
  let cotizarLink = '#';
  let cotizarTarget = '_self';

  if (isDisabled) {
    cotizarLink = '#'; 
  } else if (estadoLowerCase === 'reservado') {
    cotizarLink = norm(link) || CONTACTO_URL;
    cotizarTarget = '_self'; 
  } else {
    const waMessage = `Hola, me interesa el lote ${numero}, con superficie de ${sup} y costo por m² de ${formattedCosto}. Estado: ${currentStatus}.`;
    cotizarLink = `${WHATSAPP_BASE}${encodeURIComponent(waMessage)}`;
    cotizarTarget = '_blank';
  }


  // --- Render ---
  return (
    <div id="mapa-wrapper" className="mapa-wrapper"> 
     
      <div id="mapa-main-container" className="mapa-main-container">

        <header className="map-header">
          <div className="map-legend-panel">
            <h2 className="legend-title">Disponibilidad de Terrenos</h2>
            <p className="legend-subtitle">Identifica rápidamente el estado de cada lote. Haz clic en el mapa para ver precios y detalles de venta.</p>
            <div className="status-legend">
              <div className="status-item"><span className="status-color sold"></span>VENDIDO</div>
              <div className="status-item"><span className="status-color reserved"></span>SEPARADO</div>
              <div className="status-item"><span className="status-color available"></span>DISPONIBLE</div>
              <div className="status-item"><span className="status-color blocked"></span>PRÓXIMAMENTE</div>
            </div>
          </div>
        </header>

        <section id="mapa-section" className="mapa-section">
          
          {/* Columna Izquierda: Panel de Info Sticky */}
          <aside className="info-sticky-wrapper"> 
            <div 
              id="lot-info-sticky-panel" 
              className={`lot-info-sticky-panel ${isPanelActive ? 'active' : ''} ${isInitial ? 'initial-state' : ''}`}
            >
                <div className="panel-title">{!isInitial ? 'TU LOTE SELECCIONADO' : 'INFORMACIÓN'}</div>
              
              <React.Fragment>
                      <div id="lot-number" className="lot-number">
                          {numero}
                      </div>
                      
                      {/* Detalles del lote: Se muestran si NO es el estado inicial */}
                      {!isInitial && (
                          <div className="lot-details">
                              <p><strong>Superficie:</strong> {sup}</p>
                              <p><strong>Tipo:</strong> {norm(tipo)}</p>
                              <p><strong>Costo m²:</strong> {formattedCosto}</p>
                          </div>
                      )}
                      
                      {/* Mostrar mensaje de "PASA EL CURSOR" solo en estado inicial */}
                      {isInitial && (
                          <div className="initial-instructions">
                              <p className="large-text">PASA EL CURSOR POR EL MAPA</p>
                              <p className="small-text">Da click en el lote para seleccionar</p>
                          </div>
                      )}


                      <div id="lot-status" className="lot-status" style={{ color: pickColor({ estado }) }}>
                          {currentStatus}
                      </div>
                      
                      <div className="lot-note">{norm(nota)}</div>
              </React.Fragment>
              
              {/* Mostrar botones SOLO si hay un lote SELECCIONADO (isPanelActive es true) */}
              {isPanelActive && ( 
                <>
                  <a 
                    id="cotizar-btn" 
                    className={`btn cotizar-btn ${isDisabled ? 'disabled-btn' : ''}`} 
                    href={cotizarLink} 
                    target={cotizarTarget} 
                    rel="noopener noreferrer"
                  >{cotizarText}</a>
                  
                  <button 
                    id="change-lot-btn" 
                    className={`btn change-lot-btn`}
                    onClick={resetSelection}
                  >Cambiar de Lote</button>
                </>
              )}
            </div>
          </aside>

          {/* Columna Derecha: Mapa SVG (inline en un div) */}
          <div className="map-column">
            <div
              id="svgmap"
              className="svgmap"
              ref={svgContainerRef}
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          </div>
        </section>
        
       
      </div>
      
      {/* COMENTADO: VENTANA MODULAR FLOTANTE - Deshabilitada permanentemente. 
      <div 
        id="welcome-modal" 
        className="welcome-modal" 
        aria-hidden="true"
        ref={modalRef} 
        dangerouslySetInnerHTML={{ __html: WELCOME_BANNER_CONTENT }}
      ></div>
      */}
    </div>
  );
}