import React, { useEffect, useRef, useCallback, useState } from 'react';
import './InteractiveMap.css';
// Asegúrate de que esta ruta sea correcta para tu JSON de respaldo
import fallbackData from '../assets/fallback-lotes.json'; 

// --- Configuración y Constantes ---
// NOTA: Se ha comentado la URL real por ahora y usamos fallbackData como marcador de posición.
const DATA_URL = fallbackData 
const WHATSAPP_BASE = 'https://wa.me/528123852034?text=enviarmensaje';  
const CONTACTO_URL = '/Contacto'; 
const MODAL_SEEN_KEY = 'mapa_interactivo_modal_visto'; 
const SVG_PATH = '/SVGmapa.svg'; 

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

const WELCOME_BANNER_CONTENT = `
  <div class="welcome-content">
    <div class="title" style="font-weight:700;">¡Bienvenido al Mapa Interactivo!</div>
    <div class="minor">Identifica la disponibilidad, haz clic en un lote para ver detalles y contactar a un asesor.</div>
    <div class="modal-button-wrapper"> 
      <button id="close-modal-btn" class="modal-close-btn">¡Empecemos!</button>
    </div>
  </div>
`;
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
// Función para simular la llamada a la API (solo usando datos de respaldo por ahora)
async function fetchData() {
  try {
    // Aquí deberías hacer un fetch real a tu DATA_URL
    // const r = await fetch(DATA_URL, { cache: 'no-store' });
    // const text = await r.text();
    // let j = JSON.parse(text);
    // return normalizeRows(j);
    
    // Por ahora, solo devolvemos los datos de respaldo normalizados
    return normalizeRows(fallbackData); 
  } catch (e) {
    console.error("Error al cargar datos:", e);
    return normalizeRows(fallbackData); 
  }
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
  const svgObjectRef = useRef(null);
  const modalRef = useRef(null);
  const cleanupRef = useRef(null); 
  
  // Inicialización de estado con datos de respaldo normalizados
  const initialData = normalizeRows(fallbackData); 
  const [data, setData] = useState(initialData); 
  
  const [svgDoc, setSvgDoc] = useState(null);
  const [activeEl, setActiveEl] = useState(null); // Elemento SVG seleccionado (clic)
  const [currentInfo, setCurrentInfo] = useState(INITIAL_LOT_INFO); // Info para el panel

  // Lógica para reiniciar el estado de selección
  const resetSelection = useCallback(() => {
    if (activeEl) {
      activeEl.style.filter = 'none';
    }
    setActiveEl(null);
    setCurrentInfo(INITIAL_LOT_INFO);
    
    document.getElementById('lot-info-sticky-panel')?.classList.remove('active');
    document.getElementById('lot-info-sticky-panel')?.classList.add('initial-state');
  }, [activeEl]);

  // Handlers
  const showModal = useCallback(() => {
    const modal = modalRef.current;
    if (!modal) return;
    
    // <<< NOTA: Dejar comentado para forzar aparición en desarrollo >>>
    /*
    if (sessionStorage.getItem(MODAL_SEEN_KEY) === 'true') {
      return;
    }
    */
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    const closeBtn = document.getElementById('close-modal-btn');
    // Esto asegura que el evento de cierre solo se aplique una vez
    const existingHandler = closeBtn.__clickHandler;
    if (existingHandler) {
        closeBtn.removeEventListener('click', existingHandler);
    }
    
    const handler = () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      sessionStorage.setItem(MODAL_SEEN_KEY, 'true'); 
      closeBtn.removeEventListener('click', handler);
      closeBtn.__clickHandler = null;
    };
    closeBtn.__clickHandler = handler; 
    closeBtn.addEventListener('click', handler);
  }, []);
  
  // Efectos de carga de datos y SVG
  
  // El useEffect de llamada a la API (fetchData) permanece COMENTADO por ahora.
  // useEffect(() => { fetchData().then(setData); }, []); 
  
  useEffect(() => {
    const svgObject = svgObjectRef.current;
    if (!svgObject) return;
    
    // Función de chequeo mejorada para disponibilidad del documento SVG
    const checkSvgReady = () => {
      const doc = svgObject.contentDocument;
      // Verificamos que el documento y su elemento raíz (documentElement) existan
      if (doc && doc.documentElement) { 
          setSvgDoc(doc); 
      } else { 
          // Reintento si no está listo (condición de carrera)
          setTimeout(checkSvgReady, 100); 
      }
    };

    if (svgObject.contentDocument) {
      checkSvgReady();
    } else {
      const onLoad = () => {
          // Pequeño delay después del evento 'load' para asegurar la disponibilidad del DOM interno
          setTimeout(checkSvgReady, 50);
      };
      svgObject.addEventListener('load', onLoad);
      return () => svgObject.removeEventListener('load', onLoad);
    }
    return () => { setSvgDoc(null); };
}, []);


  useEffect(() => {
    showModal();
    return () => {
      // Lógica de limpieza al desmontar el componente (si es necesario)
    };
  }, [showModal]); 


  const updateStickyPanel = useCallback((info, lotId, isClick = false) => {
    const panel = document.getElementById('lot-info-sticky-panel');
    
    const infoToUse = info && Object.keys(info).length > 0 ? info : INITIAL_LOT_INFO;
    
    // Si hay un lote activo y NO es un clic, ignoramos la actualización (Congelamiento)
    if (activeEl && !isClick) {
        return;
    }

    setCurrentInfo(infoToUse);

    if (!panel) return;
    
    // Si es un clic, activamos la clase para mostrar botones
    if (isClick) {
      panel.classList.add('active'); 
      panel.classList.remove('initial-state');
    } else {
      panel.classList.remove('active'); 
      panel.classList.add('initial-state');
    }
    
  }, [activeEl]); 
  
  
  const initSvgLogic = useCallback((doc, lotesData) => {
    if (!doc || !lotesData) return;
    
    const byId = new Map();
    lotesData.forEach(r => {
      const k = keyify(r.id ?? r.Id ?? ''); 
      if (k) byId.set(k, r);
    });

    const lotNodes = [...doc.querySelectorAll('[id]')]
      .map(node => ({ node, key: keyify(node.id) }))
      .filter(({ key }) => byId.has(key))
      .map(({ node, key }) => ({ node, info: byId.get(key) }));
    
    const cleanupHandlers = [];

    lotNodes.forEach(({ node, info }) => {
      // PINTAR LOTES
      const paintables = node.matches(SHAPE_SEL) ? [node] : [...node.querySelectorAll(SHAPE_SEL)].filter(isPaintable);
      const color = pickColor(info);

      paintables.forEach(s => {
        s.style.fill = color; 
        s.style.fillOpacity = '0.55';
        s.style.pointerEvents = 'auto';
        s.style.cursor = 'pointer';
      });
        node.style.pointerEvents = 'auto';

      // --- Handlers ---
      const onEnter = () => { 
        if (!activeEl) { 
          updateStickyPanel(info, node.id, false);
        }
        if (activeEl !== node) { node.style.filter = 'brightness(1.15)'; }
      };
      
      const onLeave = () => { 
        if (!activeEl) { 
          updateStickyPanel(INITIAL_LOT_INFO, null, false); 
        }
        if (activeEl !== node) { node.style.filter = 'none'; } 
      };

      const onClick = (ev) => {
        ev.stopPropagation();

        if (activeEl === node) {
          return; 
        }
        
        if (activeEl) { activeEl.style.filter = 'none'; }
        
        setActiveEl(node);
        node.style.filter = 'brightness(1.06)';
        
        updateStickyPanel(info, node.id, true); // true = clic
      };
      
      // Tooltip y Listeners se mantienen
      const sup = info.superficie_m2 ? `${Number(String(info.superficie_m2).replace(/[, ]/g, '')).toLocaleString('es-MX')} m²` : '';
      node.setAttribute('title', `${norm(info.titulo)} | ${sup} | ${norm(info.estado).toUpperCase()}`);

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

    // Lógica para resetear la selección al hacer clic fuera del mapa o panel
    const onDocClick = (e) => {
      if (!activeEl) return; 
      
      const clickedInPanel = document.getElementById('lot-info-sticky-panel')?.contains(e.target);
      const clickedInSVGObject = svgObjectRef.current?.contains(e.target);
      
      if (!clickedInSVGObject && !clickedInPanel) {
        resetSelection();
      }
    };

    document.addEventListener('click', onDocClick);
    cleanupHandlers.push(() => { document.removeEventListener('click', onDocClick); });

    return () => { cleanupHandlers.forEach(fn => fn()); };
  }, [activeEl, updateStickyPanel, resetSelection]);
  
  
  // === useEffect de Sincronización (CORRECCIÓN CLAVE: CON TIMEOUT) ===
  useEffect(() => {
    // 1. Verificación de dependencia: Si falta data o el SVG no está en el DOM, salimos.
    if (!data || !svgDoc) return;

    // Aseguramos que cualquier lógica previa se detenga
    cleanupRef.current?.();
    
    let timeoutId;

    // 2. CORRECCIÓN CLAVE: Ejecutamos la lógica principal con un pequeño delay de 100ms
    // Esto es crucial para la primera carga y para que el navegador termine de procesar el SVG.
    timeoutId = setTimeout(() => {
        // console.log("SVG y Data listos. Inicializando lógica del mapa."); // Opcional para debug
        cleanupRef.current = initSvgLogic(svgDoc, data);
        
        document.getElementById('lot-info-sticky-panel')?.classList.add('initial-state');
        updateStickyPanel(INITIAL_LOT_INFO, null, false); 
    }, 100); 

    // 3. Función de limpieza (Cleanup)
    return () => {
        // Limpiamos el timeout y la lógica del SVG al cambiar dependencias o desmontar
        clearTimeout(timeoutId); 
        cleanupRef.current?.();
        document.getElementById('lot-info-sticky-panel')?.classList.remove('active');
    };
  }, [data, svgDoc, initSvgLogic, updateStickyPanel]);

  
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

          {/* Columna Derecha: Mapa SVG */}
          <div className="map-column">
            <object
              id="svgmap"
              className="svgmap"
              type="image/svg+xml"
              data={SVG_PATH}
              ref={svgObjectRef}
              loading="eager"
            ></object>
          </div>
        </section>
        
        <footer className="mapa-footer">
          Información de contacto o Pie de página del componente
        </footer>
      </div>
      
      {/* VENTANA MODULAR FLOTANTE */}
      <div 
        id="welcome-modal" 
        className="welcome-modal" 
        aria-hidden="true"
        ref={modalRef} 
        dangerouslySetInnerHTML={{ __html: WELCOME_BANNER_CONTENT }}
      ></div>
    </div>
  );
}