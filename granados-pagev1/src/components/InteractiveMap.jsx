import React, { useEffect, useRef, useCallback, useState } from 'react';
import './InteractiveMap.css';
import fallbackData from '../assets/fallback-lotes.json'; // Importa el JSON local de fallback

// -----------------------------------------------------------
// Configuración y Constantes
// -----------------------------------------------------------
const DATA_URL = 'https://n8n.srv894483.hstgr.cloud/webhook/lotes-json';
const WHATSAPP_BASE = 'https://wa.me/528123852034?text=';
const COLOR_BY_STATUS = { disponible: '#66bb6a', reservado: '#fde68a', vendido: '#ef5350', bloqueado: '#e5e7eb', 'n/a': '#e5e7eb' };
const COLOR_PRESETS = { verde: '#66bb6a', amarillo: '#fde68a', rojo: '#ef5350', gris: '#e5e7eb' };
const FALLBACK_COLOR = '#d1e7dd';
const HIDE_DELAY = 300;
const SHAPE_SEL = 'path,polygon,rect,ellipse';
const TOOLTIP_FIXED_CLASS = 'is-fixed';
const TOOLTIP_GAP_Y = -30;
const BANNER_GAP_X = 20;
const BANNER_GAP_Y = 20;
const WELCOME_BANNER_CONTENT = `
  <div class="title" style="font-weight:700;">Da click para abrir</div>
  <div class="minor">selecciona tu lote de interés, y comunícate con un asesor</div>
`;
const DEFAULT_TOOLTIP_CONTENT = WELCOME_BANNER_CONTENT;

// -----------------------------------------------------------
// Utils
// -----------------------------------------------------------
const norm = s => String(s ?? '').trim();
const keyify = s => norm(s).toLowerCase().replace(/lote[\s_:-]*/g, 'lote').replace(/[^a-z0-9]/g, '');
function currencyMXN(n) {
  if (n === null || n === undefined || n === '') return '';
  const num = Number(String(n).replace(/[, ]/g, ''));
  if (Number.isNaN(num)) return String(n);
  return num.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
}
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
  return [];
}
async function fetchData() {
  try {
    const r = await fetch(DATA_URL, { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const text = await r.text();
    if (!text.trim()) {
      console.warn('fetchData: Respuesta vacía, usando fallback');
      return fallbackData; // Usa fallback si vacío
    }
    let j;
    try {
      j = JSON.parse(text);
    } catch (e) {
      console.error('JSON inválido', e);
      return fallbackData; // Usa fallback si parse falla
    }
    const normalized = normalizeRows(j);
    if (normalized.length === 0) {
      console.warn('fetchData: Datos normalizados vacíos, usando fallback');
      return fallbackData;
    }
    return normalized;
  } catch (e) {
    console.warn('fetchData error, usando fallback', e);
    return fallbackData; // Usa fallback en cualquier error
  }
}
function isPaintable(el) {
  const tag = el.tagName.toLowerCase();
  if (!/^(path|polygon|rect|ellipse)$/.test(tag)) return false;
  const cs = el.ownerDocument.defaultView.getComputedStyle(el);
  return cs.fill && cs.fill !== 'none';
}

// -----------------------------------------------------------
// COMPONENTE PRINCIPAL
// -----------------------------------------------------------
export default function InteractiveMap() {
  // Refs
  const tooltipRef = useRef(null);
  const svgObjectRef = useRef(null);
  const containerMapElRef = useRef(null);
  const welcomeBannerRef = useRef(null);
  const delimiterElRef = useRef(null);

  // Estado reactivo
  const [data, setData] = useState(null);
  const [svgDoc, setSvgDoc] = useState(null);
  const [activeEl, setActiveEl] = useState(null);
  const [isTooltipFixed, setIsTooltipFixed] = useState(false);
  const [overTooltip, setOverTooltip] = useState(false);
  const [isOverSvg, setIsOverSvg] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const hideTimerRef = useRef(null);

  // Detectar móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // -------------------------------------------------------
  // Cargar datos (con fallback)
  // -------------------------------------------------------
  useEffect(() => {
    fetchData().then(setData);
  }, []);

  // -------------------------------------------------------
  // Cargar SVG
  // -------------------------------------------------------
  useEffect(() => {
    const svgObject = svgObjectRef.current;
    if (!svgObject) return;

    const checkSvgReady = () => {
      const doc = svgObject.contentDocument;
      const hasLotes = doc && (doc.querySelector('[id*="lote"], [id*="Lote"], [id^="L"]') || doc.querySelectorAll('[id]').length > 5);
      if (doc && hasLotes) {
        setSvgDoc(doc);
      } else {
        setTimeout(checkSvgReady, 100);
      }
    };

    if (svgObject.contentDocument) {
      checkSvgReady();
    } else {
      const onLoad = () => checkSvgReady();
      svgObject.addEventListener('load', onLoad);
      return () => svgObject.removeEventListener('load', onLoad);
    }
  }, []);

  // -------------------------------------------------------
  // Inicializar lógica cuando ambos estén listos
  // -------------------------------------------------------
  const initSvgLogic = useCallback((doc, lotesData) => {
    const byId = new Map();
    lotesData.forEach(r => {
      const k = keyify(r.id ?? r.Id ?? '');
      if (k) byId.set(k, r);
    });

    const candidates = [...doc.querySelectorAll('[id]')];
    const lotNodes = [];

    candidates.forEach(node => {
      const key = keyify(node.id);
      if (byId.has(key)) {
        lotNodes.push({ node, info: byId.get(key) });
      }
    });

    // Limpiar listeners anteriores
    lotNodes.forEach(({ node }) => {
      node.replaceWith(node.cloneNode(true));
    });

    // Obtener nodos limpios
    const refreshedNodes = lotNodes.map(({ node, info }) => {
      const newNode = doc.getElementById(node.id);
      return { node: newNode, info };
    }).filter(Boolean);

    refreshedNodes.forEach(({ node, info }) => {
      const paintables = node.matches(SHAPE_SEL) ? [node] : [...node.querySelectorAll(SHAPE_SEL)].filter(isPaintable);
      const color = pickColor(info);

      paintables.forEach(s => {
        s.style.fill = color;
        s.style.fillOpacity = '0.55';
        s.style.pointerEvents = 'auto';
        s.style.cursor = 'pointer';
      });

      const onMove = (ev) => {
        setIsOverSvg(true);
        if (welcomeBannerRef.current?.style.opacity === '1') hideBanner();
        
        moveTooltipFollower(ev);
        
        if (isTooltipFixed) return; // No actualizar si fijo
        
        if (activeEl !== node) {
          if (activeEl) activeEl.style.filter = 'none';
          setActiveEl(node);
          node.style.filter = 'brightness(1.06)';
          setTooltipContent(info, node.id);
        }
        showTooltip(false);
      };

      const onLeave = () => {
        setIsOverSvg(false);
        if (!isTooltipFixed) scheduleHide();
      };

      const onClick = (ev) => {
        ev.stopPropagation();
        hideBanner();
        moveTooltipFollower(ev);
        
        if (isTooltipFixed && activeEl === node) {
          hideTooltip(true);
          return;
        }
        
        if (activeEl && activeEl !== node) activeEl.style.filter = 'none';
        setActiveEl(node);
        node.style.filter = 'brightness(1.06)';
        setTooltipContent(info, node.id);
        setIsTooltipFixed(true);
        showTooltip(true);
      };

      node.addEventListener('mousemove', onMove);
      node.addEventListener('mouseleave', onLeave);
      node.addEventListener('click', onClick);
      node.addEventListener('touchstart', onMove, { passive: false });
      node.addEventListener('touchmove', onMove, { passive: false });
    });

    // Eventos globales del SVG
    const onSvgEnter = (ev) => {
      if (!tooltipRef.current?.classList.contains('show')) moveBanner(ev);
    };
    const onSvgMove = (ev) => moveBanner(ev);
    const onSvgLeave = () => hideBanner();

    doc.addEventListener('mouseenter', onSvgEnter);
    doc.addEventListener('mousemove', onSvgMove);
    doc.addEventListener('mouseleave', onSvgLeave);

    return () => {
      refreshedNodes.forEach(({ node }) => {
        ['mousemove', 'mouseleave', 'click', 'touchstart', 'touchmove'].forEach(evt =>
          node.removeEventListener(evt, () => {})
        );
      });
      doc.removeEventListener('mouseenter', onSvgEnter);
      doc.removeEventListener('mousemove', onSvgMove);
      doc.removeEventListener('mouseleave', onSvgLeave);
    };
  }, [activeEl, isTooltipFixed, isOverSvg]);

  // -------------------------------------------------------
  // Tooltip y Banner Helpers
  // -------------------------------------------------------
  const setTooltipContent = useCallback((info, lotId, isDefault = false) => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    if (isDefault) {
      tooltip.innerHTML = DEFAULT_TOOLTIP_CONTENT;
      return;
    }

    const numero = norm(info?.titulo) || lotId || 'Lote';
    const tipo = norm(info?.tipo);
    const sup = info?.superficie_m2 ? `${Number(String(info.superficie_m2).replace(/[, ]/g, '')).toLocaleString('es-MX')} m²` : '';
    const costo = (info?.costo_m2 ?? '') !== '' ? `${currencyMXN(info.costo_m2)} / m²` : '';
    const detalles = [tipo, sup, costo].filter(Boolean).join(' • ');
    const nota = norm(info?.nota) || 'Quiero este lote';
    const linkH = norm(info?.link || '');
    const wa = `${WHATSAPP_BASE}${encodeURIComponent(`Hola, me interesa el ${numero}`)}`;
    const link = linkH || wa;

    tooltip.innerHTML = '';
    const close = document.createElement('div');
    close.className = 'close-btn';
    close.id = 'tt-close';
    close.innerHTML = '×';
    close.onclick = (e) => {
      e.stopPropagation();
      hideTooltip(true);
      showBanner();
    };

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = numero;

    const minor = document.createElement('div');
    minor.className = 'minor';
    minor.textContent = detalles;

    const btn = document.createElement('a');
    btn.className = 'btn';
    btn.href = link;
    btn.target = '_blank';
    btn.rel = 'noopener';
    btn.textContent = nota;

    const center = document.createElement('div');
    center.style.textAlign = 'center';
    center.appendChild(btn);

    tooltip.append(close, title);
    if (detalles) tooltip.appendChild(minor);
    tooltip.appendChild(center);
  }, []);

  const showTooltip = useCallback((fixed = false) => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;
    clearTimeout(hideTimerRef.current);
    hideBanner();
    setIsTooltipFixed(fixed);
    tooltip.classList.toggle(TOOLTIP_FIXED_CLASS, fixed);
    tooltip.style.display = 'block';
    requestAnimationFrame(() => {
      tooltip.classList.add('show');
      tooltip.style.opacity = '1';
    });
  }, []);

  const hideTooltip = useCallback((force = false) => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;
    if (!force && isTooltipFixed) return;
    tooltip.classList.remove('show', TOOLTIP_FIXED_CLASS);
    tooltip.style.opacity = '0';
    setTimeout(() => {
      if (tooltip.style.opacity === '0') tooltip.style.display = 'none';
    }, 200);
    setIsTooltipFixed(false);
    if (activeEl) {
      activeEl.style.filter = 'none';
      setActiveEl(null);
    }
  }, [isTooltipFixed, activeEl]);

  const scheduleHide = useCallback(() => {
    if (isTooltipFixed) return;
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (overTooltip) return;
      hideTooltip();
    }, HIDE_DELAY);
  }, [isTooltipFixed, overTooltip, hideTooltip]);

  const showBanner = useCallback(() => {
    const banner = welcomeBannerRef.current;
    if (!banner) return;
    banner.innerHTML = WELCOME_BANNER_CONTENT; // Inyectar contenido
    banner.style.display = 'block';
    requestAnimationFrame(() => {
      banner.classList.add('show');
      banner.style.opacity = '1';
    });
  }, []);

  const hideBanner = useCallback(() => {
    const banner = welcomeBannerRef.current;
    if (!banner) return;
    banner.classList.remove('show');
    banner.style.opacity = '0';
    setTimeout(() => {
      if (banner.style.opacity === '0') banner.style.display = 'none';
    }, 200);
  }, []);

  const moveBanner = useCallback((ev) => {
    const banner = welcomeBannerRef.current;
    const delimiter = delimiterElRef.current;
    if (!banner || !delimiter || !ev) return;

    let clientX = ev.clientX, clientY = ev.clientY;
    if (ev.touches?.[0]) {
      clientX = ev.touches[0].clientX;
      clientY = ev.touches[0].clientY;
    }

    const rect = delimiter.getBoundingClientRect();
    const isOverSvg = svgObjectRef.current && (ev.target.ownerSVGElement || (svgObjectRef.current.contentDocument?.contains(ev.target)));
    banner.classList.toggle('minimized', isOverSvg);

    let x = clientX - rect.left + (isOverSvg ? -BANNER_GAP_X - (banner.offsetWidth || 250) : BANNER_GAP_X);
    let y = clientY - rect.top + BANNER_GAP_Y;

    const w = banner.offsetWidth || 250;
    const h = banner.offsetHeight || 80;

    x = Math.max(10, Math.min(x, rect.width - w - 10));
    y = Math.max(10, Math.min(y, rect.height - h - 10));

    banner.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
    banner.setAttribute('aria-hidden', 'false');
    showBanner();
  }, [showBanner]);

  const moveTooltipFollower = useCallback((ev) => {
    const tooltip = tooltipRef.current;
    const containerRect = containerMapElRef.current?.getBoundingClientRect();
    if (!tooltip || !containerRect || !ev) return;

    let clientY = ev.clientY;
    if (ev.touches?.[0]) {
      clientY = ev.touches[0].clientY;
    }

    // Posición fija en el costado derecho, solo seguir Y (vertical)
    const tooltipWidth = tooltip.offsetWidth || 200;
    const tooltipHeight = tooltip.offsetHeight || 100;
    let finalX = containerRect.width - tooltipWidth - 10; // Fijo a la derecha, con margen
    let finalY = clientY - containerRect.top + TOOLTIP_GAP_Y;

    if (finalY + tooltipHeight > containerRect.height) {
      finalY = containerRect.height - tooltipHeight - 10;
    }
    finalY = Math.max(10, finalY);

    tooltip.style.position = 'absolute';
    tooltip.style.left = `${finalX}px`;
    tooltip.style.top = `${finalY}px`;

    if (isOverSvg && !isTooltipFixed && !activeEl) {
      setTooltipContent(null, null, true);
    }
  }, [isOverSvg, isTooltipFixed, activeEl]);

  // -------------------------------------------------------
  // Efecto principal (inicia banner por default)
  // -------------------------------------------------------
  useEffect(() => {
    if (!data || !svgDoc) return;

    const cleanup = initSvgLogic(svgDoc, data);

    const tooltip = tooltipRef.current;
    const onEnter = () => setOverTooltip(true);
    const onLeave = () => { setOverTooltip(false); scheduleHide(); };
    tooltip.addEventListener('mouseenter', onEnter);
    tooltip.addEventListener('mouseleave', onLeave);

    const delimiter = delimiterElRef.current;
    delimiter.addEventListener('mouseenter', showBanner);
    delimiter.addEventListener('mousemove', moveBanner);
    delimiter.addEventListener('mouseleave', hideBanner);
    delimiter.addEventListener('touchstart', moveBanner, { passive: true });
    delimiter.addEventListener('touchmove', moveBanner, { passive: true });
    delimiter.addEventListener('touchend', hideBanner);

    const onDocClick = (e) => {
      const inTooltip = tooltip.contains(e.target);
      const inSvg = svgObjectRef.current?.contentDocument?.contains(e.target);
      if (!inTooltip && !inSvg) {
        hideTooltip(true);
        showBanner();
      } else if (inSvg && isTooltipFixed) {
        hideTooltip(true);
        showBanner();
      }
    };
    document.addEventListener('click', onDocClick);

    // Mostrar banner al inicio
    showBanner();

    return () => {
      cleanup?.();
      tooltip.removeEventListener('mouseenter', onEnter);
      tooltip.removeEventListener('mouseleave', onLeave);
      delimiter.removeEventListener('mouseenter', showBanner);
      delimiter.removeEventListener('mousemove', moveBanner);
      delimiter.removeEventListener('mouseleave', hideBanner);
      delimiter.removeEventListener('touchstart', moveBanner);
      delimiter.removeEventListener('touchmove', moveBanner);
      delimiter.removeEventListener('touchend', hideBanner);
      document.removeEventListener('click', onDocClick);
    };
  }, [data, svgDoc, initSvgLogic, showBanner, hideBanner, moveBanner, hideTooltip, scheduleHide]);

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------
  return (
    <main id="mapa" className="mapa">
      <div className="layout-container">
        <div id="sector-info" className="sector-info">
          <div className="layout-container">
            <div id="sector-info2" className="sector-info2">
              <h2 className="sector-title">Disponibilidad de Terrenos</h2>
              <p className="sector-subtitle">Identifica rápidamente el estado de cada lote. Haz clic en el mapa para ver precios y detalles de venta.</p>
              <div className="status-legend">
                <div className="status-item">
                  <span className="status-color sold"></span>
                  <span className="status-label">Vendido</span>
                </div>
                <div className="status-item">
                  <span className="status-color reserved"></span>
                  <span className="status-label">Separado / Reservado</span>
                </div>
                <div className="status-item">
                  <span className="status-color available"></span>
                  <span className="status-label">Disponible</span>
                </div>
                <div className="status-item">
                  <span className="status-color blocked"></span>
                  <span className="status-label">Próximamente / Bloqueado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="delimiter" className="delimiter" ref={delimiterElRef}>
          <div className="container-map" ref={containerMapElRef}>
            <object
              id="svgmap"
              className="svgmap"
              type="image/svg+xml"
              data="/SVGmapa.svg"
              ref={svgObjectRef}
              loading="eager"
              style={{ width: '100%', height: '100%', border: 'none' }}
            ></object>
            <div id="tooltip" className="tooltip" ref={tooltipRef}></div>
            <div id="welcome-banner" className="welcome-banner" aria-hidden="true" ref={welcomeBannerRef} onClick={() => isMobile && setShowMobileModal(true)}></div>
          </div>
        </div>
      </div>
      {isMobile && showMobileModal && (
        <div className="mobile-modal">
          <div className="mobile-modal-content">
            <div className="close-btn" onClick={() => setShowMobileModal(false)}>&times;</div>
            <object
              id="svgmap-mobile"
              className="svgmap"
              type="image/svg+xml"
              data="/SVGmapa.svg"
              loading="eager"
              style={{ width: '100%', height: '100%', border: 'none' }}
            ></object>
            <div id="tooltip-mobile" className="tooltip" ref={tooltipRef}></div>
          </div>
        </div>
      )}
    </main>
  );
}