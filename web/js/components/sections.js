// web/js/components/sections.js — Motor de Renderizado de Secciones Minimalistas COLUA MICOOPE

class SectionsComponent {
  async render(sectionId) {
    const cleanId = (sectionId || 'sec_home').toLowerCase();
    
    // Plantillas especializadas
    if (cleanId === 'sec_ahorros' || cleanId === 'ahorros') return this.renderAhorros();
    if (cleanId === 'sec_creditos' || cleanId === 'creditos') return this.renderCreditos();
    if (cleanId === 'sec_seguros' || cleanId === 'seguros') return this.renderSeguros();
    if (cleanId === 'sec_remesas' || cleanId === 'remesas') return this.renderRemesas();
    if (cleanId === 'sec_servicios' || cleanId === 'servicios') return this.renderServicios();
    if (cleanId === 'sec_beneficios' || cleanId === 'beneficios') return this.renderBeneficios();
    if (cleanId === 'sec_sostenibilidad' || cleanId === 'sostenibilidad') return this.renderSostenibilidad();
    if (cleanId === 'sec_nosotros' || cleanId === 'nosotros') return this.renderNosotros();
    if (cleanId === 'sec_empleo' || cleanId === 'empleo' || cleanId === 'mi_empleo' || cleanId === 'mi-empleo') return this.renderEmpleo();

    // Renderizador de Secciones Genéricas / Creadas dinámicamente en el CMS
    return this.renderDynamicGeneric(cleanId);
  }

  // Renderiza el botón de acción de la tarjeta soportando Ficha Informativa Emergente (Ver Más), Teléfono, Enlaces, PDF y Rutas
  _renderCardButton(buttonText, buttonAction, itemId, defaultText = 'Ver Más Información', defaultAction = 'tel:77957795') {
    const text = buttonText || defaultText;
    const action = (buttonAction || defaultAction || '').trim();

    // Soporte para PDF: si la acción empieza con 'pdf:' o es una url pdf o base64 pdf o tiene extensión .pdf o indexeddb
    if (action.startsWith('pdf:') || action.toLowerCase().endsWith('.pdf') || action.startsWith('data:application/pdf') || action.includes('indexeddb:')) {
      const pdfTarget = action.replace(/^pdf:/, '').trim();
      const escapedTitle = (text || 'Documento Oficial').replace(/'/g, "\\'");
      return `
        <button type="button" onclick="event.preventDefault(); event.stopPropagation(); if(window.openPdfDocument){ window.openPdfDocument('${pdfTarget}', '${escapedTitle}', '${itemId || ''}'); } else if(window.app && window.app.openItemPdf){ window.app.openItemPdf('${itemId || ''}', '${pdfTarget}'); } else { window.open('${pdfTarget}', '_blank'); }" class="clean-btn-card-action" style="cursor: pointer; border: none; width: 100%; text-align: center; display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #dc2626; color: #ffffff; font-weight: 700; border-radius: 8px; padding: 11px 16px; box-shadow: 0 2px 6px rgba(220,38,38,0.25); transition: all 0.2s;" onmouseover="this.style.background='#b91c1c'" onmouseout="this.style.background='#dc2626'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <span>${text || 'Ver Documento PDF'} ↗</span>
        </button>
      `;
    }

    if (action.startsWith('form:') || action === 'modal:form' || action === 'form_asociate' || action === 'form_lead') {
      const fId = action.replace('form:', '').trim() || 'form_asociate';
      return `
        <button type="button" onclick="app.showDynamicFormModal('${fId}')" class="clean-btn-card-action" style="cursor: pointer; border: none; width: 100%; text-align: center; display: inline-flex; align-items: center; justify-content: center; gap: 6px; background: var(--colua-navy); color: white; font-weight: 700;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14l2 2 4-4"></path></svg>
          <span>${text || 'Enviar Solicitud / Consultas'}</span>
        </button>
      `;
    }

    if (!action || action === 'info' || action === 'modal' || action.startsWith('modal:') || action === '#info') {
      return `
        <button type="button" onclick="app.showItemInfoModal('${itemId}')" class="clean-btn-card-action" style="cursor: pointer; border: none; width: 100%; text-align: center; display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <span>${text}</span>
        </button>
      `;
    }
    if (action.startsWith('http')) {
      return `
        <a href="${action}" target="_blank" rel="noopener noreferrer" class="clean-btn-card-action" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
          <span>${text}</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      `;
    }
    if (action.startsWith('tel:')) {
      return `
        <a href="${action}" class="clean-btn-card-action" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>${text}</span>
        </a>
      `;
    }
    if (action.startsWith('#')) {
      return `
        <a href="${action}" class="clean-btn-card-action" onclick="if(window.coluaRouter){window.coluaRouter.navigate('${action.replace('#','')}');return false;}">
          <span>${text}</span>
        </a>
      `;
    }
    return `<a href="${action}" class="clean-btn-card-action">${text}</a>`;
  }

  // --- 1. CUENTAS DE AHORRO ---
  async renderAhorros(sectionId) {
    const secId = sectionId || 'sec_ahorros';
    let headerItem = null;
    let cuentas = [];

    try {
      const dbItems = await window.coluaRepository.getItemsBySection(secId);
      if (dbItems && dbItems.length > 0) {
        headerItem = dbItems.find(i => i.id === 'item_ahorro_header');
        const cardItems = dbItems.filter(i => i.id !== 'item_ahorro_header' && i.isVisible !== false && i.isEnabled !== false);
        if (cardItems.length > 0) {
          cuentas = cardItems.map(i => {
            const hasExplicitImgTitle = i.id === 'item_ahorro_aportacion_infanto' || i.id === 'item_ahorro_disponible' || i.id === 'item_ahorro_programado' || i.id === 'item_ahorro_plazo_fijo';
            return {
              id: i.id,
              titulo: i.title,
              desc: i.description || i.shortDescription || '',
              detalles: i.subtitle ? i.subtitle.split(',').map(s => s.trim()).filter(Boolean) : [],
              img: i.imageUrl || i.imagePath || 'assets/ahorros.png',
              hasImageTitle: i.hasImageTitle !== undefined ? i.hasImageTitle : hasExplicitImgTitle,
              buttonText: i.buttonText || 'Solicitar Apertura (PBX)',
              buttonAction: i.buttonAction || i.targetSectionId || 'tel:77957795'
            };
          });
        }
      }
    } catch(e) { console.error(e); }

    if (cuentas.length === 0) {
      cuentas = [
        {
          id: "item_ahorro_aportacion_adulto",
          titulo: "Cuenta Aportación Adulto",
          desc: "Otorga el derecho a la persona natural a asociarse a la cooperativa, convirtiéndolo en dueño con voz y voto en la asamblea general.",
          detalles: ["Monto de apertura: desde Q50.00", "Tasa de interés: 5% anual afecto a ISR", "Intereses: capitalizables anualmente"],
          img: "assets/ahorro1.png",
          hasImageTitle: false,
          buttonText: "Solicitar Apertura (PBX)",
          buttonAction: "tel:77957795"
        },
        {
          id: "item_ahorro_aportacion_infanto",
          titulo: "Cuenta Aportación Infanto Juvenil",
          desc: "Otorga el derecho al menor de edad a asociarse a la cooperativa e iniciar el hábito del ahorro con beneficios educativos.",
          detalles: ["Monto de apertura: desde Q50.00", "Tasa de interés: 5% anual afecto a ISR", "Intereses: capitalizables anualmente"],
          img: "assets/ahorro_infanto_juvenil.png",
          hasImageTitle: true,
          buttonText: "Solicitar Apertura (PBX)",
          buttonAction: "tel:77957795"
        },
        {
          id: "item_ahorro_infanto_juvenil",
          titulo: "Cuenta Ahorro Infanto Juvenil",
          desc: "Diseñada para motivar y fomentar en los niños y adolescentes la cultura del ahorro y educación financiera.",
          detalles: ["Monto de apertura: desde Q10.00", "Tasa de interés: 3% anual afecto a ISR", "5 Beneficios al mantener mínimo Q500.00"],
          img: "assets/ahorro2.png",
          hasImageTitle: false,
          buttonText: "Solicitar Apertura (PBX)",
          buttonAction: "tel:77957795"
        },
        {
          id: "item_ahorro_disponible",
          titulo: "Cuenta Ahorro Disponible",
          desc: "Cuenta que el asociado podrá utilizar para darle movimiento diario a sus fondos con total disponibilidad.",
          detalles: ["Apertura: desde Q50.00 o $100.00", "Tasa: 3% anual en Q y 1.50% en $", "Intereses: capitalizables mensualmente", "Acceso a canales digitales sin costo"],
          img: "assets/ahorro_disponible.png",
          hasImageTitle: true,
          buttonText: "Solicitar Apertura (PBX)",
          buttonAction: "tel:77957795"
        },
        {
          id: "item_ahorro_programado",
          titulo: "Cuenta Ahorro Programado",
          desc: "Permite a los asociados aportar cuotas fijas mensuales para metas y proyectos futuros con tasas preferenciales.",
          detalles: ["Apertura: desde Q25.00", "Tasa de interés: 7.50% anual afecto a ISR", "Plazos de 3, 5, 10, 15 o 20 años", "Intereses mensuales"],
          img: "assets/ahorro_programado.png",
          hasImageTitle: true,
          buttonText: "Solicitar Apertura (PBX)",
          buttonAction: "tel:77957795"
        },
        {
          id: "item_ahorro_plazo_fijo",
          titulo: "Cuenta Ahorro Plazo Fijo",
          desc: "Obtén el máximo rendimiento y seguridad garantizada sobre tus inversiones a plazo fijo.",
          detalles: ["Apertura: desde Q1,000.00 o $200.00", "Plazos de 90, 180 y 365 días", "Intereses capitalizables trimestralmente"],
          img: "assets/ahorro_plazo_fijo.png",
          hasImageTitle: true,
          buttonText: "Solicitar Apertura (PBX)",
          buttonAction: "tel:77957795"
        }
      ];
    }

    const headerTitle = headerItem ? headerItem.title : "Cuentas de Ahorro COLUA";
    const headerDesc = headerItem ? (headerItem.subtitle || headerItem.description) : "Construye un futuro financiero sólido con nuestras opciones de ahorro adaptadas a cada etapa de tu vida. Cero comisiones de manejo y total respaldo del sistema cooperativo MICOOPE.";

    return `
      <div class="clean-subpage-container">
        <header class="clean-subpage-header">
          <h1 class="clean-subpage-title">${headerTitle}</h1>
          <p class="clean-subpage-desc">${headerDesc}</p>
        </header>

        <div class="clean-product-grid">
          ${cuentas.map(c => `
            <div class="clean-product-card">
              <div>
                ${c.hasImageTitle ? `
                  <div class="clean-product-brand-box">
                    <img src="${c.img}" alt="${c.titulo}" title="${c.titulo}" onerror="this.src='assets/ahorros.png'" />
                  </div>
                  <h3 class="sr-only">${c.titulo}</h3>
                ` : `
                  <div class="clean-product-icon-wrap">
                    <img src="${c.img}" alt="${c.titulo}" onerror="this.src='assets/ahorros.png'" />
                  </div>
                  <h3 class="clean-product-name">${c.titulo}</h3>
                `}
                <p class="clean-product-desc">${c.desc}</p>
                ${c.detalles && c.detalles.length > 0 ? `
                <ul class="clean-product-bullets">
                  ${c.detalles.map(d => `
                    <li>
                      <span class="clean-bullet-check">✓</span>
                      <span>${d}</span>
                    </li>
                  `).join('')}
                </ul>
                ` : ''}
              </div>
              ${this._renderCardButton(c.buttonText, c.buttonAction, c.id || 'item_ahorro', 'Solicitar Apertura (PBX)', 'tel:77957795')}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- 2. CRÉDITOS ---
  async renderCreditos(sectionId) {
    const secId = sectionId || 'sec_creditos';
    let headerItem = null;
    let lineas = [];

    try {
      const dbItems = await window.coluaRepository.getItemsBySection(secId);
      if (dbItems && dbItems.length > 0) {
        headerItem = dbItems.find(i => i.id === 'item_cred_header');
        const cardItems = dbItems.filter(i => i.id !== 'item_cred_header' && i.isVisible !== false && i.isEnabled !== false);
        if (cardItems.length > 0) {
          lineas = cardItems.map(i => {
            const hasExplicitImgTitle = i.id === 'item_cred_productivo' || i.id === 'item_cred_consumo' || i.id === 'item_cred_vivienda' || i.id === 'item_cred_vehiculo';
            return {
              id: i.id,
              titulo: i.title,
              sub: i.description || i.shortDescription || '',
              monto: i.subtitle || 'Monto: desde Q1,000.00 en adelante',
              img: i.imageUrl || i.imagePath || 'assets/credito.png',
              hasImageTitle: i.hasImageTitle !== undefined ? i.hasImageTitle : hasExplicitImgTitle,
              buttonText: i.buttonText || 'Cotizar Crédito (PBX)',
              buttonAction: i.buttonAction || i.targetSectionId || 'tel:77957795'
            };
          });
        }
      }
    } catch(e) { console.error(e); }

    if (lineas.length === 0) {
      lineas = [
        { titulo: "Crédito Productivo", sub: "Para capital de trabajo, inventario, mercadería y maquinaria.", img: "assets/credito_productivo.png", hasImageTitle: true, monto: "Monto: desde Q1,000.00 en adelante", buttonText: "Cotizar Crédito (PBX)", buttonAction: "tel:77957795" },
        { titulo: "Crédito Consumo", sub: "Gastos personales, consolidación de deudas, menaje de casa o estudios.", img: "assets/credi_consumo.png", hasImageTitle: true, monto: "Monto: desde Q1,000.00 en adelante", buttonText: "Cotizar Crédito (PBX)", buttonAction: "tel:77957795" },
        { titulo: "Crédito Vivienda", sub: "Construcción, compra de terreno, vivienda nueva o remodelación.", img: "assets/credito_vivienda.png", hasImageTitle: true, monto: "Monto: desde Q5,000.00 en adelante", buttonText: "Cotizar Crédito (PBX)", buttonAction: "tel:77957795" },
        { titulo: "Crédi Vehículo", sub: "Adquisición de vehículos o motocicletas para uso comercial o personal.", img: "assets/credi_vehiculo.png", hasImageTitle: true, monto: "Monto: desde Q5,000.00 en adelante", buttonText: "Cotizar Crédito (PBX)", buttonAction: "tel:77957795" },
        { titulo: "Crédito MIPYMES", sub: "Financiamiento para pequeñas y medianas empresas en crecimiento.", img: "assets/credito.png", hasImageTitle: false, monto: "Monto: desde Q2,000.00 en adelante", buttonText: "Cotizar Crédito (PBX)", buttonAction: "tel:77957795" },
        { titulo: "Crédito Agrícola", sub: "Siembra, renovación de cultivos, fertilizantes y tecnificación agrícola.", img: "assets/credito1.png", hasImageTitle: false, monto: "Monto: adaptado al ciclo de cultivo", buttonText: "Cotizar Crédito (PBX)", buttonAction: "tel:77957795" },
        { titulo: "Crédito Automático", sub: "Crédito inmediato respaldado sobre tus cuentas de ahorro en la cooperativa.", img: "assets/credito2.png", hasImageTitle: false, monto: "Monto: hasta 90% de tus aportaciones", buttonText: "Cotizar Crédito (PBX)", buttonAction: "tel:77957795" },
        { titulo: "Microcréditos", sub: "Impulso financiero ágil para pequeños emprendedores y comerciantes.", img: "assets/credito.png", hasImageTitle: false, monto: "Monto: ágil y sin complicaciones", buttonText: "Cotizar Crédito (PBX)", buttonAction: "tel:77957795" }
      ];
    }

    const headerTitle = headerItem ? headerItem.title : "Líneas de Crédito COLUA";
    const headerDesc = headerItem ? (headerItem.subtitle || headerItem.description) : "Soluciones financieras a tu medida con tasas justas, cuotas niveladas y asesoría personalizada para alcanzar tus metas personales y empresariales.";

    return `
      <div class="clean-subpage-container">
        <header class="clean-subpage-header">
          <h1 class="clean-subpage-title">${headerTitle}</h1>
          <p class="clean-subpage-desc">${headerDesc}</p>
        </header>

        <div class="clean-product-grid">
          ${lineas.map(l => `
            <div class="clean-product-card">
              <div>
                ${l.hasImageTitle ? `
                  <div class="clean-product-brand-box">
                    <img src="${l.img}" alt="${l.titulo}" title="${l.titulo}" onerror="this.src='assets/credito.png'" />
                  </div>
                  <h3 class="sr-only">${l.titulo}</h3>
                ` : `
                  <div class="clean-product-icon-wrap">
                    <img src="${l.img}" alt="${l.titulo}" onerror="this.src='assets/credito.png'" />
                  </div>
                  <h3 class="clean-product-name">${l.titulo}</h3>
                `}
                <p class="clean-product-desc">${l.sub}</p>
                <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:0.5rem 0.75rem;border-radius:8px;font-size:0.82rem;font-weight:600;color:#0f172a;margin-bottom:1.25rem;">
                  ${l.monto || 'Monto: desde Q1,000.00 en adelante'}
                </div>
              </div>
              ${this._renderCardButton(l.buttonText, l.buttonAction, l.id || 'item_cred', 'Cotizar Crédito (PBX)', 'tel:77957795')}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- 3. SEGUROS COLUMNA ---
  async renderSeguros(sectionId) {
    const secId = sectionId || 'sec_seguros';
    let headerItem = null;
    let polizas = [];

    try {
      const dbItems = await window.coluaRepository.getItemsBySection(secId);
      if (dbItems && dbItems.length > 0) {
        headerItem = dbItems.find(i => i.id === 'item_seg_header');
        const cardItems = dbItems.filter(i => i.id !== 'item_seg_header' && i.isVisible !== false && i.isEnabled !== false);
        if (cardItems.length > 0) {
          polizas = cardItems.map(i => ({
            id: i.id,
            titulo: i.title,
            desc: i.description || i.shortDescription || '',
            img: i.imageUrl || i.imagePath || 'assets/seguro.png',
            hasImageTitle: true,
            leyenda: i.subtitle || 'Primas solidarias y accesibles',
            buttonText: i.buttonText || 'Solicitar Póliza (PBX)',
            buttonAction: i.buttonAction || i.targetSectionId || 'tel:77957795'
          }));
        }
      }
    } catch(e) { console.error(e); }

    if (polizas.length === 0) {
      polizas = [
        { titulo: "Seguro CV Especial", desc: "Cobertura de vida con indemnización y respaldo solidario inmediato.", img: "assets/seguro_cv_personal.png", hasImageTitle: true, leyenda: "Primas solidarias y accesibles", buttonText: "Solicitar Póliza (PBX)", buttonAction: "tel:77957795" },
        { titulo: "Seguro Vida Saludable", desc: "Protección integral para gastos médicos y asistencia preventiva.", img: "assets/seguro_vida_saludable.png", hasImageTitle: true, leyenda: "Cobertura médica y preventiva", buttonText: "Solicitar Póliza (PBX)", buttonAction: "tel:77957795" },
        { titulo: "Seguro de Accidentes Edad de Oro", desc: "Diseñado especialmente para asociados de la tercera edad.", img: "assets/seguro_edad_de_oro.png", hasImageTitle: true, leyenda: "Para mayores de 60 años", buttonText: "Solicitar Póliza (PBX)", buttonAction: "tel:77957795" },
        { titulo: "Seguro de Cáncer", desc: "Indemnización directa al primer diagnóstico de patología oncológica.", img: "assets/seguro_de_cancer.png", hasImageTitle: true, leyenda: "Indemnización al primer diagnóstico", buttonText: "Solicitar Póliza (PBX)", buttonAction: "tel:77957795" },
        { titulo: "Seguro Accidentes Infanto Juvenil", desc: "Protección escolar y de recreación para los hijos de asociados.", img: "assets/seguro_accidentes_infanto_juvenil.png", hasImageTitle: true, leyenda: "Protección escolar 365 días", buttonText: "Solicitar Póliza (PBX)", buttonAction: "tel:77957795" },
        { titulo: "Seguro de Manejo", desc: "Asistencia vial y respaldo ante incidentes en carretera en todo el país.", img: "assets/seguro_manejo.png", hasImageTitle: true, leyenda: "Asistencia vial nacional", buttonText: "Solicitar Póliza (PBX)", buttonAction: "tel:77957795" },
        { titulo: "Seguro de Vida Individual o Familiar", desc: "Tranquilidad financiera a largo plazo para el bienestar de tu familia.", img: "assets/seguro_de_vida_individual_o_familar.png", hasImageTitle: true, leyenda: "Tranquilidad a largo plazo", buttonText: "Solicitar Póliza (PBX)", buttonAction: "tel:77957795" }
      ];
    }

    const headerTitle = headerItem ? headerItem.title : "Seguros Columna";
    const headerDesc = headerItem ? (headerItem.subtitle || headerItem.description) : "Tranquilidad para ti y tu familia con coberturas de vida, salud y accidentes con el respaldo de Aseguradora Columna y el Sistema MICOOPE.";

    return `
      <div class="clean-subpage-container">
        <header class="clean-subpage-header">
          <h1 class="clean-subpage-title">${headerTitle}</h1>
          <p class="clean-subpage-desc">${headerDesc}</p>
        </header>

        <div class="clean-product-grid">
          ${polizas.map(p => `
            <div class="clean-product-card">
              <div>
                <div class="clean-product-brand-box">
                  <img src="${p.img}" alt="${p.titulo}" title="${p.titulo}" onerror="this.src='assets/seguro.png'" />
                </div>
                <h3 class="sr-only">${p.titulo}</h3>
                <p class="clean-product-desc">${p.desc}</p>
                <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:0.45rem 0.75rem;border-radius:8px;font-size:0.8rem;color:#64748b;margin-bottom:1.25rem;">
                  ${p.leyenda || 'Primas solidarias y accesibles'}
                </div>
              </div>
              ${this._renderCardButton(p.buttonText, p.buttonAction, p.id || 'item_seg', 'Solicitar Póliza (PBX)', 'tel:77957795')}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- 4. REMESAS FAMILIARES Y NUEVA REMESA DIRIGIDA ---
  async renderRemesas(sectionId) {
    const secId = sectionId || 'sec_remesas';
    let heroItem = null;
    let bannerDirigida = null;
    let familiasHeader = null;
    let asistencias = [];

    try {
      const dbItems = await window.coluaRepository.getItemsBySection(secId);
      if (dbItems && dbItems.length > 0) {
        heroItem = dbItems.find(i => i.id === 'item_rem_hero');
        bannerDirigida = dbItems.find(i => i.id === 'item_rem_banner_dirigida');
        familiasHeader = dbItems.find(i => i.id === 'item_rem_familias_header');

        const cardItems = dbItems.filter(i => 
          i.id !== 'item_rem_hero' && 
          i.id !== 'item_rem_banner_dirigida' && 
          i.id !== 'item_rem_familias_header' && 
          i.isVisible !== false && 
          i.isEnabled !== false
        );

        if (cardItems.length > 0) {
          asistencias = cardItems.map(i => ({
            id: i.id,
            titulo: i.title,
            desc: i.description || i.shortDescription || '',
            cat: i.subtitle || 'ASISTENCIA INTERNACIONAL',
            img: i.imageUrl || i.imagePath || 'assets/rd1.png',
            tag: i.buttonText || '100% Cobertura'
          }));
        }
      }
    } catch(e) { console.error(e); }

    if (asistencias.length === 0) {
      asistencias = [
        { cat: "TRÁMITE CONSULAR Y VUELO", img: "assets/rd1.png", titulo: "Asistencia de repatriación para remitente", desc: "Gestión integral y cobertura sin costo. Asesoramiento en trámites legales y coordinación total del retorno aéreo de restos mortales a Guatemala.", tag: "100% Cobertura" },
        { cat: "ACOMPAÑAMIENTO FAMILIAR", img: "assets/rd2.png", titulo: "Asistencia funeraria para remitente", desc: "Apoyo y trámites de coordinación. Preparación, capilla ardiente, servicio religioso y traslado terrestre hacia cualquier municipio del país.", tag: "Red Funeraria Nacional" },
        { cat: "RED DE SALUD", img: "assets/rd3.png", titulo: "Referencias médicas y clínicas", desc: "Directorio e información verificada de médicos especialistas, clínicas, farmacias y laboratorios clínicos con convenios preferenciales para asociados.", tag: "Acceso Inmediato" },
        { cat: "ATENCIÓN TELEFÓNICA 24/7", img: "assets/rd4.png", titulo: "Orientación médica telefónica", desc: "Apoyo profesional en interpretación de pruebas de laboratorio, dosificación segura de medicamentos y primeros auxilios a distancia las 24 horas.", tag: "Sin Límite de Llamadas" }
      ];
    }

    const heroTitle = heroItem ? heroItem.title : "Remesas Familiares";
    const heroDesc = heroItem ? (heroItem.description || heroItem.subtitle) : "Recibe tu dinero de forma segura, rápida y sin complicaciones a través de nuestra red de remesadoras aliadas. Ponemos a tu alcance disponibilidad inmediata en ventanilla y depósito directo en tu cuenta cooperativa.";
    const heroImg = heroItem ? (heroItem.imageUrl || heroItem.imagePath || "assets/mas_que_una_remesa.png") : "assets/mas_que_una_remesa.png";

    const bannerTitle = bannerDirigida ? bannerDirigida.title : "Beneficio al recibir tu remesa dirigida a tu Cuenta Disponible";
    const bannerDesc = bannerDirigida ? (bannerDirigida.description || bannerDirigida.subtitle) : "En caso de fallecimiento en el extranjero, te ofrecemos el <strong>BENEFICIO DE REPATRIACIÓN</strong>, garantizando que tu último viaje sea de regreso a casa, <strong>sin costo alguno para tu familia</strong>. Tu cuenta activa en COLUA abre las puertas a este respaldo exclusivo y a la acreditación inmediata de tus fondos 24/7 sin hacer filas.";
    const bannerBtn = bannerDirigida ? (bannerDirigida.buttonText || "Abrir Cuenta Disponible") : "Abrir Cuenta Disponible";
    const bannerAction = bannerDirigida ? (bannerDirigida.buttonAction || "#sec_ahorros") : "#sec_ahorros";

    const famTitle = familiasHeader ? familiasHeader.title : "Más que una remesa, unimos familias";
    const famSub = familiasHeader ? (familiasHeader.description || familiasHeader.subtitle) : "En COLUA reconocemos el esfuerzo incansable de nuestros connacionales en el extranjero. Por ello, cada envío gestionado a través de nuestra red incluye asistencias humanitarias directas y sin costo para quien envía.";
    const famImg = familiasHeader ? (familiasHeader.imageUrl || familiasHeader.imagePath || "assets/remesadoras_afiliadas.png") : "assets/remesadoras_afiliadas.png";

    return `
      <div class="clean-subpage-container">
        <!-- 1. Hero Remesas Familiares -->
        <div class="remesa-hero-card">
          <div class="remesa-hero-grid">
            <div class="remesa-hero-content">
              <h1 class="remesa-hero-title">${heroTitle}</h1>
              <p class="remesa-hero-desc">${heroDesc}</p>
              <div class="remesa-hero-actions" style="margin-bottom: 0;">
                <button class="remesa-btn-navy" onclick="window.coluaRouter ? window.coluaRouter.navigate('sec_agencias') : (window.location.hash='#sec_agencias')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Buscar Agencia
                </button>
                <button class="remesa-btn-outline" onclick="window.coluaRouter ? window.coluaRouter.navigate('sec_ahorros') : (window.location.hash='#sec_ahorros')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="14" y1="8" x2="18" y2="12"/><line x1="14" y1="16" x2="18" y2="12"/></svg>
                  Acreditar Directo a Cuenta de Ahorro
                </button>
              </div>
            </div>

            <div class="remesa-hero-media">
              <div class="remesa-hero-media-card">
                <img src="${heroImg}" alt="${heroTitle}" class="remesa-hero-img" onerror="this.src='assets/mas_que_una_remesa.png'" />
                <div class="remesa-hero-badge-footer">
                  <div class="remesa-hero-badge-shield">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#173789" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <div>
                    <strong style="color:#0f172a;font-size:0.86rem;display:block;">Red MICOOPE R.L.</strong>
                    <span style="font-size:0.75rem;color:#64748b;">Garantía institucional y validez • FENACOAC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. GRAN BANNER PROMOCIONAL: NUEVA REMESA DIRIGIDA A TU CUENTA DISPONIBLE -->
        <div class="remesa-dirigida-banner">
          <div class="remesa-dirigida-grid">
            <div class="remesa-dirigida-main">
              <h2 class="remesa-dirigida-title">${bannerTitle}</h2>
              <p class="remesa-dirigida-desc">${bannerDesc}</p>

              <div class="remesa-dirigida-pills">
                <div class="remesa-pill-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#59B8A4" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Acreditación Inmediata a Libreta o Cuenta Disponible</span>
                </div>
                <div class="remesa-pill-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#59B8A4" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Repatriación 100% Gratuita para el Remitente</span>
                </div>
                <div class="remesa-pill-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#59B8A4" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Retiros en Red de Cajeros 5B y Tarjeta de Débito Visa</span>
                </div>
              </div>

              <div class="remesa-dirigida-actions">
                <button class="remesa-btn-white" onclick="window.coluaRouter ? window.coluaRouter.navigate('${bannerAction.replace('#', '')}') : (window.location.hash='${bannerAction}')">
                  ${bannerBtn}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
                <a href="tel:77957795" class="remesa-btn-translucent">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Solicitar Información (PBX)
                </a>
              </div>
            </div>

            <div class="remesa-dirigida-side">
              <div class="remesa-side-card">
                <div class="remesa-side-shield">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h4 class="remesa-side-title">Cobertura Sin Deducciones</h4>
                <p class="remesa-side-text">
                  Disponible automáticamente para asociados que mantengan el flujo de acreditación directa a su libreta o cuenta de ahorro disponible COLUA.
                </p>
                <div class="remesa-side-link">
                  Consulta términos y condiciones en agencias
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Cobertura y Protección Integral: Más que una remesa, unimos familias -->
        <div class="remesa-families-section">
          <div class="remesa-families-grid">
            <div class="remesa-families-text">
              <h2 class="remesa-section-heading">${famTitle}</h2>
              <p class="remesa-section-sub">${famSub}</p>

              <div class="remesa-free-box">
                <h4 class="remesa-free-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#173789" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  Tu familiar que envía la remesa recibe gratis:
                </h4>
                <ul class="remesa-free-list">
                  <li>
                    <div class="remesa-free-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#173789" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <div>
                      <strong>Telellamadas al médico:</strong> Consultas a distancia para el remitente en cualquier momento ante dudas de salud o malestares cotidianos.
                    </div>
                  </li>
                  <li>
                    <div class="remesa-free-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#173789" stroke-width="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
                    </div>
                    <div>
                      <strong>Servicio de repatriación a Guatemala por fallecimiento:</strong> Gestión integral de trámites consulares, legales y traslado aéreo hasta suelo patrio sin costo.
                    </div>
                  </li>
                  <li>
                    <div class="remesa-free-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#173789" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div>
                      <strong>Servicio funerario en toda Guatemala:</strong> Apoyo completo de velación, féretro y coordinación local para su descanso en su comunidad de origen.
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div class="remesa-families-photo">
              <div class="remesa-families-img-card">
                <img src="${famImg}" alt="${famTitle}" class="remesa-families-img" onerror="this.src='assets/remesadoras_afiliadas.png'" />
                <div class="remesa-intl-line-badge">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#173789" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  <div>
                    <strong style="display:block;font-size:0.86rem;color:#0f172a;">Línea de Asistencia Internacional</strong>
                    <span style="font-size:0.75rem;color:#64748b;">Atención coordinada 24 horas para remitentes y beneficiarios</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Asistencias Complementarias (Tarjetas dinámicas) -->
        <div class="remesa-section-wrap">
          <div style="text-align:center;margin-bottom:2.25rem;">
            <h2 class="remesa-section-heading">Paquete de Asistencias Integradas al Remitente</h2>
            <p class="remesa-section-sub" style="margin:0 auto;">
              Servicios activos diseñados para proteger la salud, el bienestar y la dignidad de nuestros hermanos cooperativistas en el extranjero y sus beneficiarios en Guatemala.
            </p>
          </div>

          <div class="remesa-cards-grid-4">
            ${asistencias.map(a => `
              <div class="remesa-asistencia-card">
                <span class="remesa-asistencia-cat">${a.cat}</span>
                <div class="remesa-asistencia-icon-wrap">
                  <img src="${a.img}" alt="${a.titulo}" onerror="this.src='assets/rd1.png'" />
                </div>
                <h4 class="remesa-asistencia-title">${a.titulo}</h4>
                <p class="remesa-asistencia-desc">${a.desc}</p>
                <div class="remesa-asistencia-tag">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#173789" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  ${a.tag}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 6. Red de Remesadoras Aliadas -->
        <div class="remesa-section-wrap">
          <div style="margin-bottom:2rem;">
            <h2 class="remesa-section-heading" style="margin-bottom:0.35rem;">Red de Remesadoras Aliadas</h2>
            <p class="remesa-section-sub">
              Cobra tus envíos con las principales compañías financieras y de transferencias internacionales del mundo.
            </p>
          </div>

          <div style="border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 16px rgba(0,0,0,0.04);">
            <img src="assets/remesadoras_afiliadas2.png" alt="Cobro mi Remesa en COLUA MICOOPE - Directo a tu cuenta" style="width:100%;height:auto;display:block;" />
          </div>
        </div>
      </div>
    `;
  }

  // --- 5. SERVICIOS DIGITALES Y FINANCIEROS ---
  async renderServicios(sectionId) {
    const secId = sectionId || 'sec_servicios';
    let headerItem = null;
    let servicios = [];
    let energiaItem = null;
    let telItem = null;
    let cajerosRedItem = null;

    try {
      const dbItems = await window.coluaRepository.getItemsBySection(secId);
      if (dbItems && dbItems.length > 0) {
        headerItem = dbItems.find(i => i.id === 'item_serv_header');
        energiaItem = dbItems.find(i => i.id === 'item_serv_energia');
        telItem = dbItems.find(i => i.id === 'item_serv_telefono');
        cajerosRedItem = dbItems.find(i => i.id === 'item_serv_cajeros_red');

        const cardItems = dbItems.filter(i => 
          i.id !== 'item_serv_header' && 
          i.id !== 'item_serv_energia' && 
          i.id !== 'item_serv_telefono' && 
          i.id !== 'item_serv_cajeros_red' && 
          i.isVisible !== false && 
          i.isEnabled !== false
        );

        if (cardItems.length > 0) {
          servicios = cardItems.map(i => ({
            id: i.id,
            titulo: i.title,
            desc: i.description || i.shortDescription || '',
            img: i.imageUrl || i.imagePath || 'assets/servicios_digitales.png',
            linkText: i.buttonText || (i.targetSectionId?.startsWith('http') ? 'Ingresar a la Plataforma' : 'Solicitar Información (PBX)'),
            linkUrl: i.buttonAction || i.targetSectionId || 'tel:77957795'
          }));
        }
      }
    } catch(e) { console.error(e); }

    if (servicios.length === 0) {
      servicios = [
        { titulo: "Tarjeta de Débito MICOOPE Visa", desc: "Realiza compras en comercios afiliados a VISA en Guatemala y el extranjero, notificaciones por mensajes de texto y cobertura integral contra fraude.", img: "assets/tarjeta_debito.png", linkText: "Solicitar Tarjeta (PBX)", linkUrl: "tel:77957795" },
        { titulo: "Descarga la App MICOOPE en Línea", desc: "Banca web y móvil 24/7. Realiza consultas de saldos, transferencias directas, pago de préstamos y servicios básicos al instante sin hacer filas.", img: "assets/micoope_enlinea.png", linkText: "Ingresar a la Plataforma", linkUrl: "https://micoopeenlinea.com.gt" },
        { titulo: "Tarjeta de Crédito MICOOPE Visa", desc: "Tienes hasta 55 días para pagar, membresía gratis de por vida, tarjeta VISA internacional, cobertura por fraude o extravío y la tasa más baja.", img: "assets/tarjeta_debito.png", linkText: "Solicitar Crédito (PBX)", linkUrl: "tel:77957795" },
        { titulo: "Cajeros Modernos Automáticos", desc: "Consulta de saldos, retiros y depósitos en efectivo; sin cobros por comisión en cajeros propios COLUA. Disponible 24/7.", img: "assets/servicios_digitales.png", linkText: "Ver Agencias con Cajero", linkUrl: "#sec_agencias" },
        { titulo: "Descarga la App Fri", desc: "Envía, recibe y solicita dinero de forma rápida e inmediata entre tu cooperativa y bancos del sistema usando únicamente tu celular.", img: "assets/logo_fri.png", linkText: "Conocer App Fri", linkUrl: "https://fri.gt" },
        { titulo: "Red de Agentes COLUA MICOOPE", desc: "Cobra tus remesas, paga tu préstamo y tarjeta de crédito, realiza depósitos y retiros en puntos autorizados cerca de tu hogar.", img: "assets/servicios_digitales.png", linkText: "Localizar Red de Agentes", linkUrl: "#sec_agencias" }
      ];
    }

    const headerTitle = headerItem ? headerItem.title : "Servicios Digitales y Financieros COLUA";
    const headerDesc = headerItem ? (headerItem.subtitle || headerItem.description) : "Gestiona tus cuentas, consulta saldos y realiza operaciones 24/7 sin salir de casa con nuestras herramientas tecnológicas cooperativas y nuestra amplia red de atención.";

    const energiaTitle = energiaItem ? energiaItem.title : "Pago de Energía Eléctrica";
    const energiaDesc = energiaItem ? (energiaItem.description || "DEOCSA y DEORSA. Realiza el pago ágil y al día de tus facturas de energía eléctrica directamente en ventanillas de nuestras agencias.") : "DEOCSA y DEORSA. Realiza el pago ágil y al día de tus facturas de energía eléctrica directamente en ventanillas de nuestras agencias.";

    const telTitle = telItem ? telItem.title : "Pago de Servicio Telefónico";
    const telDesc = telItem ? (telItem.description || "Pre y Pospago: CLARO y TIGO. Recargas electrónicas y pago de mensualidades telefónicas sin demoras ni recargos adicionales.") : "Pre y Pospago: CLARO y TIGO. Recargas electrónicas y pago de mensualidades telefónicas sin demoras ni recargos adicionales.";

    const cajerosTitle = cajerosRedItem ? cajerosRedItem.title : "Cajeros Red 5B, BI y BAC";
    const cajerosDesc = cajerosRedItem ? (cajerosRedItem.description || "Consulta de saldos y retiros en efectivo en más de 3,500 cajeros interbancarios de la red con recargo de Q5.00 por transacción.") : "Consulta de saldos y retiros en efectivo en más de 3,500 cajeros interbancarios de la red con recargo de Q5.00 por transacción.";

    return `
      <div class="clean-subpage-container">
        <header class="clean-subpage-header">
          <h1 class="clean-subpage-title">${headerTitle}</h1>
          <p class="clean-subpage-desc">${headerDesc}</p>
        </header>

        <!-- SERVICIOS DINÁMICOS -->
        <div class="clean-product-grid">
          ${servicios.map(s => `
            <div class="clean-product-card">
              <div>
                <div class="clean-product-icon-wrap" style="background: #ffffff;">
                  <img src="${s.img}" alt="${s.titulo}" onerror="this.src='assets/servicios_digitales.png'" />
                </div>
                <h3 class="clean-product-name">${s.titulo}</h3>
                <p class="clean-product-desc">${s.desc}</p>
              </div>
              ${this._renderCardButton(s.linkText, s.linkUrl, s.id || 'item_serv', 'Solicitar Información (PBX)', 'tel:77957795')}
            </div>
          `).join('')}
        </div>

        <!-- ==============================================
             SECCIÓN: OTROS SERVICIOS (3 SERVICIOS ADICIONALES)
             ============================================== -->
        <section class="clean-other-services-section">
          <div class="clean-other-services-header">
            <h2 class="clean-other-services-title">Otros Servicios</h2>
            <p class="clean-other-services-desc">
              Facilitamos tus pagos diarios de servicios básicos y ampliamos tus opciones de retiro en toda la república.
            </p>
          </div>

          <div class="clean-other-services-grid">
            <!-- 1. Pago de Energía Eléctrica -->
            <div class="clean-other-service-card">
              <div class="clean-other-service-accent-bar" style="background: #FACC15;"></div>
              <div class="clean-other-service-icon-box" style="background: #fefce8; border: 1.5px solid #fef08a;">
                <svg viewBox="0 0 24 24" fill="#ca8a04">
                  <path d="M9,21c0,0.55 0.45,1 1,1h4c0.55,0 1,-0.45 1,-1v-1H9V21zM12,2C8.14,2 5,5.14 5,9c0,2.38 1.19,4.47 3,5.74V17c0,0.55 0.45,1 1,1h6c0.55,0 1,-0.45 1,-1v-2.26c1.81,-1.27 3,-3.36 3,-5.74c0,-3.86 -3.14,-7 -7,-7zM14.85,13.1l-0.85,0.6V16h-4v-2.3l-0.85,-0.6C7.8,12.16 7,10.63 7,9c0,-2.76 2.24,-5 5,-5s5,2.24 5,5c0,1.63 -0.8,3.16 -2.15,4.1z" />
                </svg>
              </div>
              <h4 class="clean-other-service-title">${energiaTitle}</h4>
              <p class="clean-other-service-desc">${energiaDesc}</p>
            </div>

            <!-- 2. Pago de Servicio Telefónico -->
            <div class="clean-other-service-card">
              <div class="clean-other-service-accent-bar" style="background: #59B8A4;"></div>
              <div class="clean-other-service-icon-box" style="background: #f0fdfa; border: 1.5px solid #ccfbf1;">
                <svg viewBox="0 0 24 24" fill="#0d9488">
                  <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
                </svg>
              </div>
              <h4 class="clean-other-service-title">${telTitle}</h4>
              <p class="clean-other-service-desc">${telDesc}</p>
            </div>

            <!-- 3. Cajeros 5B, BI y BAC -->
            <div class="clean-other-service-card">
              <div class="clean-other-service-accent-bar" style="background: #DB2777;"></div>
              <div class="clean-other-service-icon-box" style="background: #fdf2f8; border: 1.5px solid #fbcfe8;">
                <svg viewBox="0 0 24 24" fill="#db2777">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                </svg>
              </div>
              <h4 class="clean-other-service-title">${cajerosTitle}</h4>
              <p class="clean-other-service-desc">${cajerosDesc}</p>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  // --- 6. TUS 6 BENEFICIOS ---
  async renderBeneficios(sectionId) {
    const secId = sectionId || 'sec_beneficios';
    let headerItem = null;
    let beneficios = [];

    try {
      const dbItems = await window.coluaRepository.getItemsBySection(secId);
      if (dbItems && dbItems.length > 0) {
        headerItem = dbItems.find(i => i.id === 'item_ben_header');
        const cardItems = dbItems.filter(i => i.id !== 'item_ben_header' && i.isVisible !== false && i.isEnabled !== false);
        if (cardItems.length > 0) {
          beneficios = cardItems.map(i => {
            const isPdf = i.type === 'pdf_document' || (i.buttonAction && i.buttonAction.startsWith('pdf:')) || (i.pdfUrl && i.pdfUrl.length > 0);
            return {
              id: i.id,
              titulo: i.title,
              desc: i.description || i.shortDescription || '',
              img: i.imageUrl || i.imagePath || 'assets/beneficios.png',
              tag: i.subtitle || '✓ Incluido al ser Asociado',
              buttonText: i.buttonText || (isPdf ? 'Ver Documento PDF' : 'Ver Más Información'),
              buttonAction: i.buttonAction || (isPdf ? ('pdf:' + (i.pdfUrl || '')) : 'modal:info'),
              pdfUrl: i.pdfUrl || '',
              isPdf: isPdf
            };
          });
        }
      }
    } catch(e) { console.error(e); }

    if (beneficios.length === 0) {
      beneficios = [
        { id: "ben_hosp", titulo: "Renta Diaria por Hospitalización", desc: "Apoyo económico diario en caso de ser internado en hospital público o privado.", img: "assets/renta_diaria.png", tag: "✓ Incluido al ser Asociado" },
        { id: "ben_quir", titulo: "Apoyo Quirúrgico", desc: "Apoyo económico para cubrir gastos médicos incurridos por intervenciones quirúrgicas.", img: "assets/apoyo_quirurgico.png", tag: "✓ Incluido al ser Asociado" },
        { id: "ben_fune", titulo: "Servicio Funerario", desc: "Sepelio digno y ataúd fúnebre para tranquilidad de la familia del asociado.", img: "assets/servicio_funerario.png", tag: "✓ Incluido al ser Asociado" },
        { id: "ben_ahorr", titulo: "Seguro de Ahorrantes", desc: "Devolución de ahorros más seguro sobre depósitos hasta por Q150,000.00.", img: "assets/beneficio_de_ahorrantes.png", tag: "✓ Hasta Q150,000.00" },
        { id: "ben_deud", titulo: "Seguro de Deudores", desc: "Cobertura de saldos insolutos de crédito vigente hasta por Q200,000.00 en siniestro.", img: "assets/beneficio_de_deudores.png", tag: "✓ Hasta Q200,000.00" },
        { id: "ben_oro", titulo: "Beneficio de Oro", desc: "Apoyo económico único para asociados mayores de 70 años con lealtad cooperativa.", img: "assets/beneficio_de_oro.png", tag: "✓ Mayores de 70 años" }
      ];
    }

    const headerTitle = headerItem ? headerItem.title : "Tus 6 Beneficios de Asociado";
    const headerDesc = headerItem ? (headerItem.subtitle || headerItem.description) : "Al abrir tu cuenta de Aportación en COLUA R.L., tú y tu familia cuentan con el respaldo automático de nuestro programa integral de solidaridad.";

    return `
      <div class="clean-subpage-container">
        <header class="clean-subpage-header">
          <h1 class="clean-subpage-title">${headerTitle}</h1>
          <p class="clean-subpage-desc">${headerDesc}</p>
        </header>

        <div class="clean-product-grid">
          ${beneficios.map(b => {
            const rawPdf = b.pdfUrl || (b.buttonAction && b.buttonAction.startsWith('pdf:') ? b.buttonAction.replace('pdf:', '') : '');
            return `
              <div class="clean-product-card" ${b.isPdf ? `onclick="if(event.target.closest('button')) return; window.openPdfDocument('${rawPdf}', '${(b.titulo || 'Documento').replace(/'/g, "\\'")}', '${b.id}')" style="cursor: pointer; border-top: 4px solid #dc2626; display: flex; flex-direction: column; justify-content: space-between;"` : 'style="display: flex; flex-direction: column; justify-content: space-between;"'}>
                <div>
                  <div class="clean-product-icon-wrap" ${b.isPdf ? 'style="background: #fef2f2; border: 1.5px solid #fecaca; height: 68px; display: flex; align-items: center; justify-content: center;"' : ''}>
                    ${b.isPdf ? `
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    ` : `
                      <img src="${b.img}" alt="${b.titulo}" onerror="this.src='assets/beneficios.png'" />
                    `}
                  </div>
                  <h3 class="clean-product-name">${b.titulo}</h3>
                  <p class="clean-product-desc">${b.desc}</p>
                </div>
                <div>
                  ${b.isPdf || (b.buttonAction && b.buttonAction !== 'modal:info') ? `
                    <div style="margin-top: 14px;">
                      ${this._renderCardButton(b.buttonText || (b.isPdf ? 'Ver Documento PDF' : 'Ver Más'), b.buttonAction, b.id, 'Ver Más Información')}
                    </div>
                  ` : `
                    <div style="font-size:0.78rem;font-weight:600;color:#2563eb;margin-top: 8px;">
                      ${b.tag || '✓ Incluido al ser Asociado'}
                    </div>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // --- 7. SOSTENIBILIDAD COOPERATIVA (4 EJES ESTRATÉGICOS) ---
  async renderSostenibilidad(sectionId) {
    const secId = sectionId || 'sec_sostenibilidad';
    let headerItem = null;
    let bannerItem = null;
    let customItems = [];

    try {
      const dbItems = await window.coluaRepository.getItemsBySection(secId);
      if (dbItems && dbItems.length > 0) {
        headerItem = dbItems.find(i => i.id === 'item_sost_header');
        bannerItem = dbItems.find(i => i.id === 'item_sost_banner_contacto');
        customItems = dbItems.filter(i => i.id !== 'item_sost_header' && i.id !== 'item_sost_banner_contacto' && i.isVisible !== false && i.isEnabled !== false);
      }
    } catch(e) { console.error(e); }

    const colors = [
      { color: "#634794", bg: "#f5f3ff", border: "#ddd6fe" },
      { color: "#0284C7", bg: "#f0f9ff", border: "#bae6fd" },
      { color: "#E42A67", bg: "#fdf2f8", border: "#fbcfe8" },
      { color: "#EF8819", bg: "#fff7ed", border: "#fed7aa" }
    ];

    const headerTitle = headerItem ? headerItem.title : "Sostenibilidad Cooperativa";
    const headerLead = headerItem ? (headerItem.subtitle || headerItem.description) : "Impulsamos acciones orientadas al desarrollo social, educativo, cultural y productivo con el propósito de fortalecer el bienestar de nuestros asociados y comunidades. A través de espacios de participación, formación y convivencia, promovemos la cooperación, la solidaridad y el compromiso comunitario.";
    
    const bannerEyebrow = bannerItem ? (bannerItem.subtitle || "PARTICIPACIÓN COMUNITARIA") : "PARTICIPACIÓN COMUNITARIA";
    const bannerTitle = bannerItem ? bannerItem.title : "¿Deseas vincular a tu comunidad o escuela?";
    const bannerDesc = bannerItem ? (bannerItem.description || "Comunícate a nuestro PBX central o visita tu agencia COLUA más cercana para conocer fechas y convocatorias de nuestros talleres, cursos y programas de becas.") : "Comunícate a nuestro PBX central o visita tu agencia COLUA más cercana para conocer fechas y convocatorias de nuestros talleres, cursos y programas de becas.";
    const bannerBtn = bannerItem ? (bannerItem.buttonText || "PBX: 7795-7795") : "PBX: 7795-7795";
    const bannerAction = bannerItem ? (bannerItem.buttonAction || "tel:77957795") : "tel:77957795";

    if (customItems && customItems.length > 0) {
      const itemsWithBlocks = await Promise.all(customItems.map(async (item, idx) => {
        const blocks = await window.coluaRepository.getBlocksByItemId(item.id);
        const style = colors[idx % colors.length];
        return { item, blocks, style, idx };
      }));

      return `
        <div class="sostenibilidad-page-wrapper">
          <!-- Encabezado Institucional -->
          <header class="sostenibilidad-hero">
            <h1 class="sostenibilidad-hero-title">${headerTitle}</h1>
            <p class="sostenibilidad-hero-lead">${headerLead}</p>
            <p class="sostenibilidad-hero-sub">
              Nuestras iniciativas se organizan en ejes estratégicos:
            </p>
          </header>

          <!-- Los Ejes Estratégicos Dinámicos con sus Bloques/Programas -->
          <div class="sostenibilidad-ejes-list">
            ${itemsWithBlocks.map(({ item, blocks, style, idx }) => `
              <article class="sostenibilidad-eje-card" style="--eje-color: ${style.color}; --eje-soft-bg: ${style.bg}; --eje-soft-border: ${style.border};">
                <div class="sostenibilidad-eje-img-box">
                  <img src="${item.imageUrl || 'assets/noticia_taller_finanzas.jpg'}" alt="${item.title}" class="sostenibilidad-eje-img" onerror="this.src='assets/programa_wachalal.png'" />
                </div>
                <div class="sostenibilidad-eje-content">
                  <div class="sostenibilidad-eje-header">
                    <span class="sostenibilidad-eje-kicker">${item.subtitle || `Eje Estratégico 0${idx + 1}`}</span>
                    <h2 class="sostenibilidad-eje-title">${item.title}</h2>
                    <p class="sostenibilidad-eje-desc">${item.description || ''}</p>
                  </div>

                  ${blocks.length > 0 ? `
                    <div class="sostenibilidad-programas-grid">
                      ${blocks.map(b => {
                        const parts = (b.content || '').split(':');
                        const bTitle = parts.length > 1 ? parts[0].trim() : (b.title || 'Iniciativa');
                        const bDesc = parts.length > 1 ? parts.slice(1).join(':').trim() : b.content;
                        return `
                          <div class="sostenibilidad-programa-item">
                            <div class="sostenibilidad-prog-icon">
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                            </div>
                            <div class="sostenibilidad-prog-info">
                              <h3 class="sostenibilidad-prog-title">${bTitle}</h3>
                              <p class="sostenibilidad-prog-desc">${bDesc}</p>
                            </div>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  ` : ''}
                </div>
              </article>
            `).join('')}
          </div>

          <!-- Banner de Participación y Convocatoria -->
          <section class="nosotros-contact-banner">
            <div class="nosotros-contact-top">
              <div class="nosotros-contact-left">
                <span class="nosotros-sec-eyebrow" style="color:#173789;">${bannerEyebrow}</span>
                <h2 class="nosotros-sec-title" style="margin-bottom:0.4rem;">${bannerTitle}</h2>
                <p style="font-size:0.9rem;color:#64748b;line-height:1.55;">${bannerDesc}</p>
              </div>
              <div class="nosotros-contact-actions">
                <a href="${bannerAction}" class="nosotros-btn-pbx">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  ${bannerBtn}
                </a>
                <button class="nosotros-btn-agencias" onclick="window.coluaRouter ? window.coluaRouter.navigate('sec_agencias') : (window.location.hash='#sec_agencias')">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Ver Agencias
                </button>
              </div>
            </div>
          </section>
        </div>
      `;
    }

    return `
      <div class="sostenibilidad-page-wrapper">
        <header class="sostenibilidad-hero">
          <h1 class="sostenibilidad-hero-title">${headerTitle}</h1>
          <p class="sostenibilidad-hero-lead">${headerLead}</p>
        </header>
      </div>
    `;
  }

  // --- 8. NOSOTROS (IDENTIDAD Y GOBERNANZA COOPERATIVA) ---
  async renderNosotros(sectionId) {
    const secId = sectionId || 'sec_nosotros';
    let headerItem = null;
    let pilar1 = null;
    let pilar2 = null;
    let pilar3 = null;
    let presencia = null;
    let valIntegridad = null;
    let valCooperacion = null;
    let valResponsabilidad = null;
    let valEnfoque = null;
    let galArraigo = null;
    let galGobernanza = null;
    let contactBanner = null;
    let customNosItems = [];

    try {
      const dbItems = await window.coluaRepository.getItemsBySection(secId);
      if (dbItems && dbItems.length > 0) {
        headerItem = dbItems.find(i => i.id === 'item_nos_header');
        pilar1 = dbItems.find(i => i.id === 'item_nos_mision_vision');
        pilar2 = dbItems.find(i => i.id === 'item_nos_vision');
        pilar3 = dbItems.find(i => i.id === 'item_nos_proposito');
        presencia = dbItems.find(i => i.id === 'item_nos_presencia');
        valIntegridad = dbItems.find(i => i.id === 'item_nos_val_integridad');
        valCooperacion = dbItems.find(i => i.id === 'item_nos_val_cooperacion');
        valResponsabilidad = dbItems.find(i => i.id === 'item_nos_val_responsabilidad');
        valEnfoque = dbItems.find(i => i.id === 'item_nos_val_enfoque');
        galArraigo = dbItems.find(i => i.id === 'item_nos_gal_arraigo');
        galGobernanza = dbItems.find(i => i.id === 'item_nos_gal_gobernanza');
        contactBanner = dbItems.find(i => i.id === 'item_nos_banner_contacto');

        const standardNosIds = new Set([
          'item_nos_header', 'item_nos_mision_vision', 'item_nos_vision', 'item_nos_proposito',
          'item_nos_presencia', 'item_nos_val_integridad', 'item_nos_val_cooperacion',
          'item_nos_val_responsabilidad', 'item_nos_val_enfoque', 'item_nos_gal_arraigo',
          'item_nos_gal_gobernanza', 'item_nos_banner_contacto'
        ]);
        customNosItems = dbItems.filter(i => !standardNosIds.has(i.id) && i.isVisible !== false && i.isEnabled !== false && i.isDraft !== true);
      }
    } catch(e) { console.error(e); }

    const headerTitle = headerItem ? headerItem.title : "Nosotros: El lado humano de los ahorros y créditos";
    const headerSub = headerItem ? (headerItem.subtitle || headerItem.description) : "Más de 50 años construyendo desarrollo socioeconómico, confianza y bienestar integral para las comunidades y familias de Quiché, Sololá y el suroccidente de Guatemala.";

    const p1Title = pilar1 ? pilar1.title : "Propuesta de Valor";
    const p1Tag = pilar1 ? (pilar1.subtitle || "PILAR ESTRATÉGICO 01") : "PILAR ESTRATÉGICO 01";
    const p1Quote = pilar1 ? pilar1.description : "“En COLUA reconocemos tu valor como persona para alcanzar tu bienestar integral y el de tu familia, a través de productos y servicios financieros éticos, ágiles y accesibles, basados en el poder de la cooperación.”";

    const p2Title = pilar2 ? pilar2.title : "Visión Institucional";
    const p2Tag = pilar2 ? (pilar2.subtitle || "PILAR ESTRATÉGICO 02") : "PILAR ESTRATÉGICO 02";
    const p2Quote = pilar2 ? pilar2.description : "“Ser un modelo de desarrollo y sostenibilidad integral de las comunidades basado en la cooperación mutua, solvencia técnica y transparencia comunitaria.”";

    const p3Title = pilar3 ? pilar3.title : "Propósito Visionario";
    const p3Tag = pilar3 ? (pilar3.subtitle || "PILAR ESTRATÉGICO 03") : "PILAR ESTRATÉGICO 03";
    const p3Quote = pilar3 ? pilar3.description : "“Ser la cooperativa financiera que mejora sostenidamente la calidad de vida de sus asociados y comunidades de Guatemala, protegiendo su patrimonio intergeneracional.”";

    const presTitle = presencia ? presencia.title : "Una institución financiera con rostro solidario y solidez técnica";
    const presEyebrow = presencia ? (presencia.subtitle || "PRESENCIA Y TRATO HUMANO") : "PRESENCIA Y TRATO HUMANO";
    const presDesc = presencia ? presencia.description : "A diferencia del sistema bancario tradicional, en COLUA cada asociado es co-propietario de la entidad. Los excedentes generados se reinvierten directamente en mejores tasas de interés para el ahorro, créditos productivos accesibles y programas de asistencia comunitaria sin intermediarios.";
    const presImg = presencia ? (presencia.imageUrl || "assets/nosotros_edificio_equipo.jpg") : "assets/nosotros_edificio_equipo.jpg";

    const val1Title = valIntegridad ? valIntegridad.title : "Integridad";
    const val1Tag = valIntegridad ? (valIntegridad.subtitle || "PILAR ÉTICO CENTRAL") : "PILAR ÉTICO CENTRAL";
    const val1Desc = valIntegridad ? valIntegridad.description : "Actuar con coherencia con nuestros valores, manteniendo transparencia en todo lo que hacemos y fomentando la cooperación en cada acción.";

    const val2Title = valCooperacion ? valCooperacion.title : "Cooperación";
    const val2Tag = valCooperacion ? (valCooperacion.subtitle || "PRINCIPIO COMUNITARIO") : "PRINCIPIO COMUNITARIO";
    const val2Desc = valCooperacion ? valCooperacion.description : "Trabajar juntos para alcanzar un objetivo común, basada en la ayuda mutua, la solidaridad y el esfuerzo compartido por el bien colectivo.";

    const val3Title = valResponsabilidad ? valResponsabilidad.title : "Responsabilidad";
    const val3Tag = valResponsabilidad ? (valResponsabilidad.subtitle || "DISCIPLINA FIDUCIARIA") : "DISCIPLINA FIDUCIARIA";
    const val3Desc = valResponsabilidad ? valResponsabilidad.description : "Administramos y cuidamos los ahorros de nuestros asociados que nos han confiado con rigurosa prudencia técnica y máxima solvencia.";

    const val4Title = valEnfoque ? valEnfoque.title : "Enfoque al Asociado";
    const val4Tag = valEnfoque ? (valEnfoque.subtitle || "VOCACIÓN DE SERVICIO") : "VOCACIÓN DE SERVICIO";
    const val4Desc = valEnfoque ? valEnfoque.description : "El centro de atención de nuestros esfuerzos y nuestra lealtad son los asociados, a quienes entregamos siempre soluciones de calidad y trato humano.";

    const gal1Title = galArraigo ? galArraigo.title : "Identidad Cultural y Comunitaria en el Altiplano";
    const gal1Tag = galArraigo ? (galArraigo.subtitle || "ARRAIGO TERRITORIAL") : "ARRAIGO TERRITORIAL";
    const gal1Img = galArraigo ? (galArraigo.imageUrl || "assets/nosotros_artesana.jpg") : "assets/nosotros_artesana.jpg";

    const gal2Title = galGobernanza ? galGobernanza.title : "Participación Democrática y Solidez del Sistema MICOOPE";
    const gal2Tag = galGobernanza ? (galGobernanza.subtitle || "GOBERNANZA COOPERATIVA") : "GOBERNANZA COOPERATIVA";
    const gal2Img = galGobernanza ? (galGobernanza.imageUrl || "assets/noticia_asamblea_general.jpg") : "assets/noticia_asamblea_general.jpg";

    const contactTitle = contactBanner ? contactBanner.title : "¿Necesitas ayuda adicional o deseas afiliarte?";
    const contactEyebrow = contactBanner ? (contactBanner.subtitle || "ATENCIÓN AL ASOCIADO Y PÚBLICO") : "ATENCIÓN AL ASOCIADO Y PÚBLICO";
    const contactDesc = contactBanner ? (contactBanner.description || "Comunícate a nuestro PBX central o visítanos en cualquiera de nuestras 18 agencias departamentales para abrir tu cuenta de aportaciones y disfrutar de los beneficios cooperativos.") : "Comunícate a nuestro PBX central o visítanos en cualquiera de nuestras 18 agencias departamentales para abrir tu cuenta de aportaciones y disfrutar de los beneficios cooperativos.";
    const contactBtn = contactBanner ? (contactBanner.buttonText || "PBX: 7795-7795") : "PBX: 7795-7795";
    const contactAction = contactBanner ? (contactBanner.buttonAction || "tel:77957795") : "tel:77957795";

    return `
      <div class="nosotros-page-wrapper">
        <!-- Encabezado Principal de Identidad -->
        <header class="nosotros-header-block">
          <span class="nosotros-kicker">IDENTIDAD Y GOBERNANZA COOPERATIVA / Memoria Institucional & Propósito</span>
          <div class="nosotros-header-row">
            <div class="nosotros-header-left">
              <h1 class="nosotros-main-title">${headerTitle}</h1>
              <p class="nosotros-main-sub">${headerSub}</p>
            </div>
            <div class="nosotros-header-badges">
              <div class="nosotros-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#173789" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>Federada MICOOPE</span>
              </div>
              <div class="nosotros-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#173789" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12l2 2 4-4"/></svg>
                <span>Supervisada INGECOP</span>
              </div>
            </div>
          </div>
        </header>

        <!-- 1. FUNDAMENTOS DE OPERACIÓN (3 PILARES ESTRATÉGICOS) -->
        <section class="nosotros-section-block">
          <div class="nosotros-section-heading-bar">
            <div>
              <span class="nosotros-sec-eyebrow">FUNDAMENTOS DE OPERACIÓN</span>
              <h2 class="nosotros-sec-title">Marco Filosófico y Compromiso</h2>
            </div>
            <span class="nosotros-sec-meta">Sistema Federado MICOOPE R.L.</span>
          </div>

          <div class="nosotros-pillars-grid">
            <!-- Pilar 01 -->
            <div class="nosotros-pillar-card" style="--pillar-accent: #59B8A4;">
              <div>
                <div class="nosotros-pillar-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                </div>
                <span class="nosotros-pillar-tag">${p1Tag}</span>
                <h3 class="nosotros-pillar-title">${p1Title}</h3>
                <p class="nosotros-pillar-quote">${p1Quote}</p>
              </div>
              <span class="nosotros-pillar-link">
                Enfoque Fiduciario
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </span>
            </div>

            <!-- Pilar 02 -->
            <div class="nosotros-pillar-card" style="--pillar-accent: #173789;">
              <div>
                <div class="nosotros-pillar-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                </div>
                <span class="nosotros-pillar-tag">${p2Tag}</span>
                <h3 class="nosotros-pillar-title">${p2Title}</h3>
                <p class="nosotros-pillar-quote">${p2Quote}</p>
              </div>
              <span class="nosotros-pillar-link">
                Proyección 2025-2030
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </span>
            </div>

            <!-- Pilar 03 -->
            <div class="nosotros-pillar-card" style="--pillar-accent: #E42A67;">
              <div>
                <div class="nosotros-pillar-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                </div>
                <span class="nosotros-pillar-tag">${p3Tag}</span>
                <h3 class="nosotros-pillar-title">${p3Title}</h3>
                <p class="nosotros-pillar-quote">${p3Quote}</p>
              </div>
              <span class="nosotros-pillar-link">
                Impacto Territorial
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </span>
            </div>
          </div>
        </section>

        <!-- 2. PRESENCIA Y TRATO HUMANO (SPLIT CARD CON FOTO) -->
        <section class="nosotros-presence-card">
          <div class="nosotros-presence-img-wrap">
            <img src="${presImg}" alt="${presTitle}" class="nosotros-presence-img" onerror="this.src='assets/colua_edificio.png'" />
          </div>
          <div class="nosotros-presence-content">
            <span class="nosotros-sec-eyebrow" style="color:#173789;">${presEyebrow}</span>
            <h2 class="nosotros-sec-title" style="margin-bottom:0.75rem;">${presTitle}</h2>
            <p style="font-size:0.92rem;color:#475569;line-height:1.65;margin-bottom:0.75rem;">
              ${presDesc}
            </p>
            <p style="font-size:0.88rem;color:#64748b;line-height:1.6;">
              Fomentamos un trato cercano, digno y transparente en cada una de nuestras agencias y canales cooperativos, acompañando el esfuerzo de emprendedores, familias y comunidades guatemaltecas.
            </p>
          </div>
        </section>

        <!-- 3. IDENTIDAD COOPERATIVA (VALORES & ARCO SEMICIRCULAR) -->
        <section class="nosotros-section-block">
          <div class="nosotros-section-heading-bar" style="text-align:left;">
            <div>
              <span class="nosotros-sec-eyebrow">IDENTIDAD COOPERATIVA</span>
              <h2 class="nosotros-sec-title">Nuestros Valores Cooperativos</h2>
              <p class="nosotros-sec-desc">
                Principios inmutables que guían las decisiones de crédito, custodia de depósitos y relación directa con cada familia cooperativista.
              </p>
            </div>
          </div>

          <!-- Arco Semicircular de Valores COLUA MICOOPE -->
          <div class="nosotros-arch-graphic-wrap">
            <img src="assets/valores_colua.png" alt="Valores de COLUA MICOOPE" class="nosotros-arch-graphic" onerror="this.src='assets/valores_colua_1.png'" />
          </div>

          <!-- 4 Tarjetas de Valores -->
          <div class="nosotros-valores-grid">
            <!-- Integridad -->
            <div class="nosotros-valor-card" style="--val-color: #634794;">
              <div>
                <div class="nosotros-valor-icon-wrap">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h3 class="nosotros-valor-title">${val1Title}</h3>
                <p class="nosotros-valor-desc">${val1Desc}</p>
              </div>
              <span class="nosotros-valor-tag">${val1Tag}</span>
            </div>

            <!-- Cooperación -->
            <div class="nosotros-valor-card" style="--val-color: #59B8A4;">
              <div>
                <div class="nosotros-valor-icon-wrap">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3 class="nosotros-valor-title">${val2Title}</h3>
                <p class="nosotros-valor-desc">${val2Desc}</p>
              </div>
              <span class="nosotros-valor-tag">${val2Tag}</span>
            </div>

            <!-- Responsabilidad -->
            <div class="nosotros-valor-card" style="--val-color: #E42A67;">
              <div>
                <div class="nosotros-valor-icon-wrap">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <h3 class="nosotros-valor-title">${val3Title}</h3>
                <p class="nosotros-valor-desc">${val3Desc}</p>
              </div>
              <span class="nosotros-valor-tag">${val3Tag}</span>
            </div>

            <!-- Enfoque al Asociado -->
            <div class="nosotros-valor-card" style="--val-color: #173789;">
              <div>
                <div class="nosotros-valor-icon-wrap">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </div>
                <h3 class="nosotros-valor-title">${val4Title}</h3>
                <p class="nosotros-valor-desc">${val4Desc}</p>
              </div>
              <span class="nosotros-valor-tag">${val4Tag}</span>
            </div>
          </div>
        </section>

        <!-- 4. GALERÍA FOTOGRÁFICA DE IMPACTO (2 FOTOS) -->
        <section class="nosotros-gallery-grid">
          <!-- Foto 1: Arraigo Territorial -->
          <div class="nosotros-gallery-card">
            <img src="${gal1Img}" alt="${gal1Title}" class="nosotros-gallery-img" onerror="this.src='assets/colua_edificio.png'" />
            <div class="nosotros-gallery-overlay">
              <span class="nosotros-gallery-tag">${gal1Tag}</span>
              <h4 class="nosotros-gallery-title">${gal1Title}</h4>
            </div>
          </div>

          <!-- Foto 2: Gobernanza Democrática -->
          <div class="nosotros-gallery-card">
            <img src="${gal2Img}" alt="${gal2Title}" class="nosotros-gallery-img" onerror="this.src='assets/colua_edificio.png'" />
            <div class="nosotros-gallery-overlay">
              <span class="nosotros-gallery-tag">${gal2Tag}</span>
              <h4 class="nosotros-gallery-title">${gal2Title}</h4>
            </div>
          </div>
        </section>

        ${customNosItems && customNosItems.length > 0 ? `
        <!-- Documentos Oficiales, Memorias de Labores y Publicaciones -->
        <section class="nosotros-section-block">
          <div class="nosotros-section-heading-bar">
            <div>
              <span class="nosotros-sec-eyebrow">DOCUMENTOS OFICIALES & MEMORIAS</span>
              <h2 class="nosotros-sec-title">Publicaciones y Memorias de Labores</h2>
              <p class="nosotros-sec-desc">Documentos oficiales, informes de rendición de cuentas y memorias institucionales de COLUA R.L.</p>
            </div>
          </div>

          <div class="clean-product-grid">
            ${customNosItems.map(i => {
              const isPdf = i.type === 'pdf_document' || (i.buttonAction && i.buttonAction.startsWith('pdf:')) || (i.pdfUrl && i.pdfUrl.length > 0);
              const rawPdf = i.pdfUrl || (i.buttonAction && i.buttonAction.startsWith('pdf:') ? i.buttonAction.replace('pdf:', '') : '');
              const sizeFormatted = i.fileSize ? ` • ${(i.fileSize / (1024 * 1024)).toFixed(2)} MB` : '';
              const hasCover = isPdf && !!(i.imageUrl && (i.imageUrl.startsWith('data:image') || i.imageUrl.startsWith('http') || i.imageUrl.startsWith('assets/')));
              return `
                <div class="clean-product-card" ${isPdf ? `onclick="if(event.target.closest('button')) return; window.openPdfDocument('${rawPdf}', '${(i.title || 'Documento Oficial').replace(/'/g, "\\'")}', '${i.id}')" style="cursor: pointer; border-top: 4px solid #dc2626; display: flex; flex-direction: column; justify-content: space-between;"` : 'style="display: flex; flex-direction: column; justify-content: space-between;"'}>
                  <div>
                    ${isPdf ? `
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                        <span style="font-size: 0.72rem; font-weight: 800; color: #dc2626; background: #fee2e2; padding: 3px 8px; border-radius: 6px; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 4px;">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                          DOCUMENTO OFICIAL
                        </span>
                        <span style="font-size: 0.74rem; color: #64748b; font-weight: 600;">PDF${sizeFormatted}</span>
                      </div>
                      ${hasCover ? `
                        <div class="pdf-cover-wrap" style="position: relative; margin-bottom: 14px; border-radius: 10px; overflow: hidden; background: #f8fafc; border: 1.5px solid #e2e8f0; height: 190px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
                          <img src="${i.imageUrl}" alt="${i.title}" style="width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block;" onerror="this.parentElement.style.display='none'" />
                          <div style="position: absolute; bottom: 8px; right: 8px; background: rgba(15, 23, 42, 0.85); color: white; padding: 3px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; gap: 4px; backdrop-filter: blur(4px);">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                            <span>Página 1</span>
                          </div>
                        </div>
                      ` : `
                        <div class="clean-product-icon-wrap" style="margin-bottom: 12px; background: #fef2f2; border: 1.5px solid #fecaca; height: 68px; display: flex; align-items: center; justify-content: center;">
                          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </div>
                      `}
                    ` : ''}
                    <h3 class="clean-product-name">${i.title}</h3>
                    ${i.subtitle ? `<span style="font-size:0.8rem;font-weight:600;color:#475569;display:block;margin-bottom:6px;">${i.subtitle}</span>` : ''}
                    <p class="clean-product-desc">${i.description || 'Haz clic para abrir y visualizar el documento oficial en una nueva pestaña.'}</p>
                  </div>
                  <div style="margin-top: 14px;">
                    ${this._renderCardButton(i.buttonText || (isPdf ? 'Ver Documento PDF' : 'Ver Más'), i.buttonAction || (isPdf ? ('pdf:' + rawPdf) : 'modal:info'), i.id, 'Ver Documento PDF')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>
        ` : ''}

        <!-- 6. ATENCIÓN AL ASOCIADO Y PÚBLICO (BANNER PBX) -->
        <section class="nosotros-contact-banner">
          <div class="nosotros-contact-top">
            <div class="nosotros-contact-left">
              <span class="nosotros-sec-eyebrow" style="color:#173789;">${contactEyebrow}</span>
              <h3 style="font-size:1.35rem;font-weight:800;color:#0f172a;margin-bottom:0.4rem;">${contactTitle}</h3>
              <p style="font-size:0.88rem;color:#475569;line-height:1.55;margin:0;">${contactDesc}</p>
            </div>
            <div class="nosotros-contact-actions">
              <a href="${contactAction}" class="nosotros-btn-pbx">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                ${contactBtn}
              </a>
              <button class="nosotros-btn-agencias" onclick="window.coluaRouter ? window.coluaRouter.navigate('sec_agencias') : (window.location.hash='#sec_agencias')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Ver Agencias
              </button>
            </div>
          </div>
          <div class="nosotros-legal-row">
            <div class="nosotros-legal-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>Entidad supervisada por la Inspección General de Cooperativas (INGECOP)</span>
            </div>
            <div class="nosotros-legal-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Depósitos protegidos por el Fondo de Garantía de Ahorros MICOOPE R.L.</span>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  renderBlocksHtml(blocks) {
    if (!blocks || blocks.length === 0) return '';
    
    return blocks.map(b => {
      // Devolver los bloques como texto simple sin estilos invasivos, tal como solicitó el usuario
      return `
        <div style="margin-bottom: 16px; padding: 0 1rem;">
          ${b.title ? `<h3 style="color: #0f172a; margin: 0 0 8px 0; font-size: 1.15rem;">${b.title}</h3>` : ''}
          <p style="color: #475569; font-size: 0.95rem; line-height: 1.6; margin: 0;">${b.content || ''}</p>
        </div>
      `;
    }).join('');
  }

  // --- 9. RENDERIZADOR GENÉRICO CMS ---
  async renderDynamicGeneric(sectionId) {
    const repo = window.coluaRepository;
    const sections = await repo.getAllSections();
    const sec = sections.find(s => s.id === sectionId || s.slug === sectionId);

    const title = sec ? sec.title : sectionId;
    const desc = sec ? sec.description : '';

    const items = await repo.getItemsBySection(sec ? sec.id : sectionId);
    const visibleItems = (items || []).filter(i => i.isVisible !== false && i.isEnabled !== false);

    // Separar elementos que requieren formato enriquecido
    const strategicItems = [];
    const jobVacancyItems = [];
    const bannerItems = [];
    const regularItems = [];

    for (const i of visibleItems) {
      if (i.type === 'strategic_axis') {
        strategicItems.push(i);
      } else if (i.type === 'job_vacancy') {
        jobVacancyItems.push(i);
      } else if (i.type === 'banner') {
        bannerItems.push(i);
      } else {
        regularItems.push(i);
      }
    }

    // Renderizado especializado de Ejes Estratégicos (Diseño institucional con sub-programas / checks)
    const strategicHtml = (await Promise.all(strategicItems.map(async (i, idx) => {
      let blocks = [];
      try {
        blocks = await repo.getBlocksByItemId(i.id);
      } catch(e) {}

      if ((!blocks || blocks.length === 0) && Array.isArray(i.benefitItems) && i.benefitItems.length > 0) {
        blocks = i.benefitItems.map((b, bIdx) => ({ id: `b_${i.id}_${bIdx}`, content: b }));
      }

      const colors = [
        { color: "#634794", bg: "#f5f3ff", border: "#ddd6fe" },
        { color: "#0284C7", bg: "#f0f9ff", border: "#bae6fd" },
        { color: "#E42A67", bg: "#fdf2f8", border: "#fbcfe8" },
        { color: "#EF8819", bg: "#fff7ed", border: "#fed7aa" }
      ];
      const style = colors[idx % colors.length];

      return `
        <article class="sostenibilidad-eje-card" style="margin-bottom: 24px; --eje-color: ${style.color}; --eje-soft-bg: ${style.bg}; --eje-soft-border: ${style.border};">
          <div class="sostenibilidad-eje-img-box">
            <img src="${i.imageUrl || 'assets/noticia_taller_finanzas.jpg'}" alt="${i.title}" class="sostenibilidad-eje-img" onerror="this.src='assets/programa_wachalal.png'" />
          </div>
          <div class="sostenibilidad-eje-content">
            <div class="sostenibilidad-eje-header">
              <span class="sostenibilidad-eje-kicker">${i.subtitle || `Eje Estratégico 0${idx + 1}`}</span>
              <h2 class="sostenibilidad-eje-title">${i.title}</h2>
              <p class="sostenibilidad-eje-desc">${i.description || ''}</p>
            </div>

            ${blocks.length > 0 ? `
              <div class="sostenibilidad-programas-grid">
                ${blocks.map(b => {
                  const parts = (b.content || '').split(':');
                  const bTitle = parts.length > 1 ? parts[0].trim() : (b.title || 'Iniciativa');
                  const bDesc = parts.length > 1 ? parts.slice(1).join(':').trim() : b.content;
                  return `
                    <div class="sostenibilidad-programa-item">
                      <div class="sostenibilidad-prog-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                      </div>
                      <div class="sostenibilidad-prog-info">
                        <h3 class="sostenibilidad-prog-title">${bTitle}</h3>
                        <p class="sostenibilidad-prog-desc">${bDesc}</p>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            ` : ''}
          </div>
        </article>
      `;
    }))).join('');

    // Renderizado especializado de Plazas Vacantes / Empleo (Diseño oficial COLUA con buscador, contador y acordeón)
    const jobVacancyHtml = jobVacancyItems.length > 0 ? this._renderJobVacanciesHtml(jobVacancyItems) : '';

    // Renderizado de Banners
    const bannerHtml = bannerItems.map(b => `
      <section class="nosotros-contact-banner" style="margin-bottom: 24px;">
        <div class="nosotros-contact-top">
          <div class="nosotros-contact-left">
            <span class="nosotros-sec-eyebrow" style="color:#173789;">${b.subtitle || 'DESTACADO'}</span>
            <h2 class="nosotros-sec-title" style="margin-bottom:0.4rem;">${b.title}</h2>
            <p style="font-size:0.9rem;color:#64748b;line-height:1.55;">${b.description || ''}</p>
          </div>
          ${b.buttonText ? `
            <div class="nosotros-contact-actions">
              <a href="${b.buttonAction || 'tel:77957795'}" class="nosotros-btn-pbx">
                ${b.buttonText}
              </a>
            </div>
          ` : ''}
        </div>
      </section>
    `).join('');

    // Renderizado de Tarjetas Regulares (Productos, Beneficios, PDFs, etc.)
    const itemsHtml = regularItems.map(i => {
      const isPdf = i.type === 'pdf_document' || (i.buttonAction && i.buttonAction.startsWith('pdf:')) || (i.pdfUrl && i.pdfUrl.length > 0);
      if (isPdf) {
        const rawPdfUrl = i.pdfUrl || (i.buttonAction && i.buttonAction.startsWith('pdf:') ? i.buttonAction.replace('pdf:', '') : '');
        const sizeFormatted = i.fileSize ? ` • ${(i.fileSize / (1024 * 1024)).toFixed(2)} MB` : '';
        const hasCover = isPdf && !!(i.imageUrl && (i.imageUrl.startsWith('data:image') || i.imageUrl.startsWith('http') || i.imageUrl.startsWith('assets/')));
        return `
          <div class="clean-product-card" onclick="if(event.target.closest('button')) return; window.openPdfDocument ? window.openPdfDocument('${rawPdfUrl}', '${(i.title || 'Documento Oficial').replace(/'/g, "\\'")}', '${i.id}') : null" style="cursor: pointer; border-top: 4px solid #dc2626; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-size: 0.72rem; font-weight: 800; color: #dc2626; background: #fee2e2; padding: 3px 8px; border-radius: 6px; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 4px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  DOCUMENTO OFICIAL
                </span>
                <span style="font-size: 0.74rem; color: #64748b; font-weight: 600;">PDF${sizeFormatted}</span>
              </div>
              ${hasCover ? `
                <div class="pdf-cover-wrap" style="position: relative; margin-bottom: 14px; border-radius: 10px; overflow: hidden; background: #f8fafc; border: 1.5px solid #e2e8f0; height: 190px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
                  <img src="${i.imageUrl}" alt="${i.title}" style="width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block;" onerror="this.parentElement.style.display='none'" />
                  <div style="position: absolute; bottom: 8px; right: 8px; background: rgba(15, 23, 42, 0.85); color: white; padding: 3px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; gap: 4px; backdrop-filter: blur(4px);">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                    <span>Página 1</span>
                  </div>
                </div>
              ` : `
                <div class="clean-product-icon-wrap" style="margin-bottom: 12px; border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #fef2f2; border: 1.5px solid #fecaca; height: 68px;">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
              `}
              <h3 class="clean-product-name" style="font-size: 1.12rem; color: #0f172a; margin-bottom: 6px;">${i.title}</h3>
              ${i.subtitle ? `<span style="font-size: 0.8rem; font-weight: 600; color: #475569; display: block; margin-bottom: 6px;">${i.subtitle}</span>` : ''}
              <p class="clean-product-desc" style="margin-top: 0.5rem; color: #64748b; font-size: 0.88rem; line-height: 1.5;">${i.description || i.shortDescription || 'Documento oficial disponible para lectura y descarga en nueva pestaña.'}</p>
            </div>
            <div style="margin-top: 14px;">
              ${this._renderCardButton(i.buttonText || 'Ver Documento PDF', i.buttonAction || ('pdf:' + rawPdfUrl), i.id, 'Ver Documento PDF', 'pdf:' + rawPdfUrl)}
            </div>
          </div>
        `;
      }

      if (i.type === 'benefit_list') {
        const reqs = Array.isArray(i.benefitItems) && i.benefitItems.length > 0 ? i.benefitItems : (i.subtitle ? i.subtitle.split(',').map(s => s.trim()) : []);
        return `
          <div class="clean-product-card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="clean-product-icon-wrap" style="background: #fdf2f8; border: 1.5px solid #fbcfe8; height: 60px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; border-radius: 10px;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#db2777" stroke-width="2.2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
              </div>
              <h3 class="clean-product-name">${i.title}</h3>
              ${i.description ? `<p class="clean-product-desc" style="margin-top:0.4rem; margin-bottom: 10px;">${i.description}</p>` : ''}
              <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px;">
                ${reqs.map(r => `
                  <div style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #334155; background: #f8fafc; padding: 6px 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
                    <span style="color: #16a34a; font-weight: 800;">✓</span>
                    <span>${r}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            ${this._renderCardButton(i.buttonText, i.buttonAction, i.id, 'Ver Más Información', 'modal:info')}
          </div>
        `;
      }

      return `
        <div class="clean-product-card">
          <div>
            ${i.imageUrl || i.imagePath || i.icon ? `
              <div class="clean-product-icon-wrap" style="margin-bottom: 12px; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #f1f5f9;">
                ${i.imageUrl || i.imagePath ? `<img src="${i.imageUrl || i.imagePath}" alt="${i.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'"/>` : `<span style="font-size: 2rem;">${i.icon}</span>`}
              </div>
            ` : ''}
            <h3 class="clean-product-name">${i.title}</h3>
            ${i.subtitle ? `<span style="font-size:0.8rem;font-weight:600;color:#2563eb;">${i.subtitle}</span>` : ''}
            <p class="clean-product-desc" style="margin-top:0.5rem;">${i.description || i.shortDescription || ''}</p>
          </div>
          ${this._renderCardButton(i.buttonText, i.buttonAction, i.id, 'Ver Más Información', 'modal:info')}
        </div>
      `;
    }).join('');

    return `
      <div class="clean-subpage-container">
        <header class="clean-subpage-header">
          <h1 class="clean-subpage-title">${title}</h1>
          ${desc ? `<p class="clean-subpage-desc">${desc}</p>` : ''}
        </header>

        ${strategicHtml ? `<div class="sostenibilidad-ejes-list" style="margin-bottom: 2rem;">${strategicHtml}</div>` : ''}
        ${jobVacancyHtml ? `<div class="colua-job-vacancies-list" style="margin-bottom: 2rem;">${jobVacancyHtml}</div>` : ''}
        ${bannerHtml ? `<div style="margin-bottom: 2rem;">${bannerHtml}</div>` : ''}

        ${regularItems.length > 0 ? `
          <div class="clean-product-grid">
            ${itemsHtml}
          </div>
        ` : ''}

        ${visibleItems.length === 0 ? `
          <div style="text-align:center;padding:3rem 1rem;color:#64748b;background:#f8fafc;border-radius:12px;border:1px dashed #e2e8f0;">
            <p>No hay contenido publicado en esta sección todavía.</p>
          </div>
        ` : ''}
      </div>
    `;
  }

  // --- 10. BOLSA DE EMPLEO / PLAZAS VACANTES (Especializado) ---
  async renderEmpleo() {
    const repo = window.coluaRepository;
    const sections = await repo.getAllSections();
    const sec = sections.find(s => s.id === 'sec_empleo' || s.slug === 'empleo') || {
      id: 'sec_empleo',
      title: 'Bolsa de Empleo COLUA',
      description: 'Oportunidades laborales y plazas vacantes en Cooperativa COLUA R.L. Consulta nuestras convocatorias oficiales y postúlate.'
    };

    let items = await repo.getItemsBySection('sec_empleo');
    let visibleItems = (items || []).filter(i => i.isVisible !== false && i.isEnabled !== false && i.isDraft !== true);

    // Si no hay elementos en la sección sec_empleo, buscar cualquier elemento de tipo job_vacancy
    if (visibleItems.length === 0) {
      try {
        const allItems = await repo.getAllItems ? await repo.getAllItems() : (repo.getLocalDb().content_items || []);
        visibleItems = allItems.filter(i => i.type === 'job_vacancy' && i.isVisible !== false && i.isEnabled !== false && i.isDraft !== true);
      } catch(e) {}
    }

    const jobVacancyItems = [];
    const bannerItems = [];
    const regularItems = [];

    for (const i of visibleItems) {
      if (i.type === 'job_vacancy') {
        jobVacancyItems.push(i);
      } else if (i.type === 'banner') {
        bannerItems.push(i);
      } else {
        regularItems.push(i);
      }
    }

    // Si aún no hay vacantes en la BD, extraer las vacantes canónicas por defecto
    if (jobVacancyItems.length === 0) {
      const defData = repo._getDefaultData ? repo._getDefaultData() : null;
      if (defData && Array.isArray(defData.content_items)) {
        defData.content_items.filter(i => i.type === 'job_vacancy').forEach(v => jobVacancyItems.push(v));
      }
    }

    const bannerHtml = bannerItems.map(b => `
      <section class="nosotros-contact-banner" style="margin-bottom: 24px;">
        <div class="nosotros-contact-top">
          <div class="nosotros-contact-left">
            <span class="nosotros-sec-eyebrow" style="color:#173789;">${b.subtitle || 'DESTACADO'}</span>
            <h2 class="nosotros-sec-title" style="margin-bottom:0.4rem;">${b.title}</h2>
            <p style="font-size:0.9rem;color:#64748b;line-height:1.55;">${b.description || ''}</p>
          </div>
          ${b.buttonText ? `
            <div class="nosotros-contact-actions">
              <a href="${b.buttonAction || 'tel:77957795'}" class="nosotros-btn-pbx">
                ${b.buttonText}
              </a>
            </div>
          ` : ''}
        </div>
      </section>
    `).join('');

    const regularHtml = regularItems.map(i => `
      <div class="clean-product-card">
        <div>
          ${i.imageUrl || i.imagePath || i.icon ? `
            <div class="clean-product-icon-wrap" style="margin-bottom: 12px; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #f1f5f9;">
              ${i.imageUrl || i.imagePath ? `<img src="${i.imageUrl || i.imagePath}" alt="${i.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'"/>` : `<span style="font-size: 2rem;">${i.icon}</span>`}
            </div>
          ` : ''}
          <h3 class="clean-product-name">${i.title}</h3>
          ${i.subtitle ? `<span style="font-size:0.8rem;font-weight:600;color:#2563eb;">${i.subtitle}</span>` : ''}
          <p class="clean-product-desc" style="margin-top:0.5rem;">${i.description || i.shortDescription || ''}</p>
        </div>
        ${this._renderCardButton(i.buttonText, i.buttonAction, i.id, 'Ver Más Información', 'modal:info')}
      </div>
    `).join('');

    return `
      <div class="clean-subpage-container">
        <header class="clean-subpage-header">
          <h1 class="clean-subpage-title">${sec.title || 'Bolsa de Empleo COLUA'}</h1>
          <p class="clean-subpage-desc">${sec.description || 'Oportunidades laborales y plazas vacantes en Cooperativa COLUA R.L. Consulta nuestras convocatorias oficiales y postúlate.'}</p>
        </header>

        ${bannerHtml ? `<div style="margin-bottom: 2rem;">${bannerHtml}</div>` : ''}
        ${this._renderJobVacanciesHtml(jobVacancyItems)}
        ${regularItems.length > 0 ? `<div class="clean-product-grid" style="margin-top: 2rem;">${regularHtml}</div>` : ''}
      </div>
    `;
  }

  // Renderizado maestro de Plazas Vacantes con Buscador, Contador, Acordeón y Vista Móvil Optimizada
  _renderJobVacanciesHtml(jobVacancyItems) {
    if (!jobVacancyItems || jobVacancyItems.length === 0) {
      return `
        <div style="text-align:center;padding:3rem 1rem;color:#64748b;background:#f8fafc;border-radius:12px;border:1px dashed #e2e8f0;margin-bottom:2rem;">
          <p style="margin:0;font-size:1.05rem;font-weight:700;color:#173789;">No hay plazas vacantes publicadas en este momento.</p>
          <span style="font-size:0.88rem;color:#64748b;display:block;margin-top:6px;">Te invitamos a consultar periódicamente nuestras convocatorias laborales oficiales.</span>
        </div>
      `;
    }

    const totalCount = jobVacancyItems.length;
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    const cardsHtml = jobVacancyItems.map((job, index) => {
      // Regla: mostrar como acordeón desde la segunda plaza (index >= 1 colapsadas, index 0 expandida en desktop).
      // En móvil: todas inician colapsadas mostrando SOLO el nombre de la plaza y botón 'Mostrar más'.
      const isExpanded = (!isMobile && index === 0);
      const cardClass = isExpanded ? 'is-expanded is-first-card' : 'is-collapsed';

      const reqs = Array.isArray(job.requirements) ? job.requirements : [];
      const skills = Array.isArray(job.skillsList) ? job.skillsList : [];
      const benefits = Array.isArray(job.benefitItems) ? job.benefitItems : [];
      const deadline = job.deadline || '';
      const email = job.leadEmail || 'talentoh@coluarl.com.gt';
      const hasImage = !!(job.imageUrl && job.imageUrl.length > 0);
      const applyMailto = job.buttonAction && job.buttonAction.startsWith('mailto:') 
        ? job.buttonAction 
        : `mailto:${email}?subject=${encodeURIComponent('Postulación: ' + job.title)}`;

      // Texto searchable completo para filtrado en tiempo real
      const searchable = this._normalizeText([
        job.title,
        job.subtitle,
        job.description,
        ...reqs,
        ...skills,
        ...benefits,
        deadline,
        email
      ].join(' '));

      return `
        <article 
          class="colua-job-vacancy-card ${cardClass}" 
          id="job-card-${job.id}" 
          data-job-id="${job.id}" 
          data-search="${this._escapeAttr(searchable)}"
        >
          <!-- Encabezado Acordeón:
               - En desktop: Nombre de plaza, Sede, Convocatoria Oficial, Fecha límite y Botón Ver detalles
               - En móvil (<= 768px): SOLO Nombre de la plaza y Botón Mostrar más -->
          <header 
            class="colua-job-card-header" 
            onclick="window.sectionsComponent.toggleJobAccordion('${job.id}', event)"
            role="button" 
            tabindex="0"
            aria-expanded="${isExpanded ? 'true' : 'false'}"
            aria-controls="job-body-${job.id}"
            onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.sectionsComponent.toggleJobAccordion('${job.id}', event);}"
          >
            <div class="colua-job-header-left">
              <span class="colua-job-briefcase-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              </span>
              
              <div class="colua-job-header-titles">
                <!-- Nombre de la plaza (Visible en móvil y desktop) -->
                <h3 class="colua-job-card-title">${job.title}</h3>
                
                <!-- Metadatos de escritorio (Ocultos en móvil por CSS para cumplir 'en vista móvil solo mostrar el nombre') -->
                <div class="colua-job-header-meta">
                  <span class="colua-job-meta-pill colua-job-meta-sede">
                    📍 ${job.subtitle || 'Sede Central'}
                  </span>
                  <span class="colua-job-meta-pill colua-job-meta-tipo">
                    Convocatoria Oficial
                  </span>
                  ${deadline ? `
                    <span class="colua-job-meta-pill colua-job-meta-deadline">
                      ⏰ Límite: ${deadline}
                    </span>
                  ` : ''}
                </div>
              </div>
            </div>

            <!-- Botón de Toggle Acordeón:
                 - En desktop: 'Ver detalles' / 'Ocultar detalles'
                 - En móvil: 'Mostrar más' / 'Mostrar menos' -->
            <button 
              type="button" 
              class="colua-job-toggle-btn" 
              onclick="event.stopPropagation(); window.sectionsComponent.toggleJobAccordion('${job.id}', event);"
              aria-label="Expandir o contraer detalles de la plaza ${job.title}"
            >
              <span class="colua-job-btn-text-desktop">${isExpanded ? 'Ocultar detalles' : 'Ver detalles'}</span>
              <span class="colua-job-btn-text-mobile">${isExpanded ? 'Mostrar menos' : 'Mostrar más'}</span>
              <svg class="colua-job-toggle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </header>

          <!-- Cuerpo Completo con Toda la Información (Colapsable / Acordeón) -->
          <div class="colua-job-card-body" id="job-body-${job.id}">
            <div class="colua-job-card-grid">
              
              <!-- Columna Izquierda: Identidad Institucional de Vacante -->
              <div class="colua-job-card-left-col">
                <div>
                  <div class="colua-job-official-badge">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                  </div>
                  <span class="colua-job-kicker">CONVOCATORIA OFICIAL</span>
                  <div class="colua-job-badge-heading">
                    PLAZA<br/><span style="color: #60a5fa;">VACANTE</span>
                  </div>
                </div>

                <!-- Logo COLUA -->
                <div class="colua-job-logo-divider">
                  <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <img src="assets/distintivo_colua.png" alt="COLUA" style="width: 28px; height: 28px; object-fit: contain;" onerror="this.src='assets/logo_colua.png'" />
                    <span style="font-size: 0.85rem; font-weight: 800; color: white; letter-spacing: 0.5px;">COLUA MICOOPE</span>
                  </div>
                </div>

                <!-- Acciones de afiche / fecha límite -->
                <div class="colua-job-deadline-wrap">
                  ${deadline ? `
                    <div class="colua-job-deadline-box">
                      <span style="font-size: 0.68rem; color: #fef08a; font-weight: 800; display: block; text-transform: uppercase;">FECHA LÍMITE:</span>
                      <strong style="font-size: 0.88rem; color: #fde047;">${deadline}</strong>
                    </div>
                  ` : ''}

                  ${hasImage ? `
                    <button type="button" class="btn-view-job-flyer colua-job-flyer-btn" onclick="window.sectionsComponent.viewJobFlyer('${job.imageUrl}', '${job.title.replace(/'/g, "\\'")}')">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      <span>Ver Afiche Oficial</span>
                    </button>
                  ` : ''}
                </div>
              </div>

              <!-- Columna Derecha: Contenido Detallado del Puesto -->
              <div class="colua-job-card-right-col">
                <div>
                  <!-- Header interno de la plaza -->
                  <div class="colua-job-meta-top">
                    <span class="colua-job-sede-tag">
                      📍 Sede: <strong>${job.subtitle || 'Oficinas Centrales'}</strong>
                    </span>
                    <span style="font-size: 0.72rem; color: #64748b; font-weight: 600;">Oportunidad Laboral</span>
                  </div>

                  <h2 class="colua-job-title-large">
                    ${job.title}
                  </h2>

                  ${job.description ? `
                    <p class="colua-job-description">${job.description}</p>
                  ` : ''}

                  <!-- Grilla de Requisitos, Habilidades y Ofrecemos -->
                  <div class="colua-job-details-grid">
                    
                    <!-- Requisitos -->
                    ${reqs.length > 0 ? `
                      <div class="colua-job-detail-card colua-job-reqs-card">
                        <div class="colua-job-detail-head">
                          <span style="font-size: 0.9rem;">📋</span>
                          <strong>Requisitos</strong>
                        </div>
                        <ul class="colua-job-detail-list">
                          ${reqs.map(r => `<li>${r.replace(/^[•\-*]\s*/, '')}</li>`).join('')}
                        </ul>
                      </div>
                    ` : ''}

                    <!-- Habilidades -->
                    ${skills.length > 0 ? `
                      <div class="colua-job-detail-card colua-job-skills-card">
                        <div class="colua-job-detail-head">
                          <span style="font-size: 0.9rem;">💡</span>
                          <strong>Habilidades</strong>
                        </div>
                        <ul class="colua-job-detail-list">
                          ${skills.map(s => `<li>${s.replace(/^[•\-*]\s*/, '')}</li>`).join('')}
                        </ul>
                      </div>
                    ` : ''}

                    <!-- Ofrecemos -->
                    ${benefits.length > 0 ? `
                      <div class="colua-job-detail-card colua-job-benefits-card">
                        <div class="colua-job-detail-head" style="color: #166534;">
                          <span style="font-size: 0.9rem;">🌟</span>
                          <strong style="color: #166534;">Ofrecemos</strong>
                        </div>
                        <ul class="colua-job-detail-list" style="color: #14532d;">
                          ${benefits.map(b => `<li>${b.replace(/^[•\-*]\s*/, '')}</li>`).join('')}
                        </ul>
                      </div>
                    ` : ''}
                  </div>
                </div>

                <!-- Banner Inferior de Aplicación Directa -->
                <div class="colua-job-apply-banner">
                  <div>
                    <span style="font-size: 0.75rem; color: #0369a1; font-weight: 700; display: block;">Aplica enviando tu hoja de vida / CV a:</span>
                    <a href="${applyMailto}" class="colua-job-apply-email">
                      ✉️ ${email}
                    </a>
                  </div>
                  <div>
                    <a href="${applyMailto}" class="btn btn-primary colua-job-apply-btn">
                      <span>${job.buttonText || 'Enviar CV por Correo'}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    return `
      <section class="colua-jobs-section" aria-label="Bolsa de Empleo">
        <!-- Barra de Herramientas: Buscador en tiempo real y Contador de Plazas -->
        <div class="colua-jobs-toolbar">
          <div class="colua-jobs-search-box">
            <span class="colua-jobs-search-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input 
              type="text" 
              id="colua-job-search-input" 
              class="colua-job-search-input" 
              placeholder="Buscar plaza por puesto, sede, profesión o palabra clave..." 
              aria-label="Buscar plazas vacantes" 
              oninput="window.sectionsComponent && window.sectionsComponent.filterJobs(this.value)"
              onkeyup="if(event.key==='Escape') window.sectionsComponent && window.sectionsComponent.clearJobSearch()"
            />
            <button 
              type="button" 
              id="colua-job-search-clear" 
              class="colua-job-search-clear" 
              aria-label="Limpiar búsqueda" 
              onclick="window.sectionsComponent && window.sectionsComponent.clearJobSearch()"
              style="display: none;"
            >✕</button>
          </div>
          
          <div class="colua-jobs-counter-wrap">
            <div class="colua-jobs-counter-pill" id="colua-jobs-counter" data-total="${totalCount}">
              <span class="colua-jobs-counter-icon">💼</span>
              <span id="colua-jobs-counter-text"><strong>${totalCount}</strong> ${totalCount === 1 ? 'plaza vacante disponible' : 'plazas vacantes disponibles'}</span>
            </div>
          </div>
        </div>

        <!-- Lista de Plazas en Acordeón -->
        <div class="colua-job-vacancies-list" id="colua-job-vacancies-list">
          ${cardsHtml}
        </div>

        <!-- Estado Vacío cuando la búsqueda no coincide -->
        <div class="colua-job-no-results" id="colua-job-no-results" style="display: none;">
          <div class="colua-job-no-results-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">No se encontraron plazas vacantes</h3>
          <p style="font-size: 0.88rem; color: #64748b; margin: 0 0 16px 0;">No encontramos coincidencias para el criterio buscado. Puedes revisar todas las convocatorias activas.</p>
          <button type="button" class="btn btn-primary" onclick="window.sectionsComponent && window.sectionsComponent.clearJobSearch()" style="padding: 9px 20px; font-size: 0.85rem; font-weight: 700; border-radius: 8px; background: var(--colua-navy); color: white; border: none; cursor: pointer;">
            Ver todas las plazas vacantes
          </button>
        </div>
      </section>
    `;
  }

  // Métodos interactivos del Buscador y Acordeón
  _normalizeText(str) {
    return (str || '')
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  _escapeAttr(str) {
    return (str || '').replace(/"/g, '&quot;');
  }

  filterJobs(query) {
    const q = this._normalizeText(query);
    const clearBtn = document.getElementById('colua-job-search-clear');
    if (clearBtn) {
      clearBtn.style.display = q ? 'flex' : 'none';
    }

    const cards = document.querySelectorAll('.colua-job-vacancy-card');
    const noResults = document.getElementById('colua-job-no-results');
    const counterText = document.getElementById('colua-jobs-counter-text');
    const counterPill = document.getElementById('colua-jobs-counter');
    const totalCount = counterPill ? parseInt(counterPill.getAttribute('data-total') || '0', 10) : cards.length;

    let matchCount = 0;
    const tokens = q.split(/\s+/).filter(Boolean);

    cards.forEach(card => {
      const searchData = card.getAttribute('data-search') || '';
      const matches = tokens.length === 0 || tokens.every(token => searchData.includes(token));

      if (matches) {
        card.classList.remove('is-search-hidden');
        matchCount++;
        // Si hay búsqueda activa, expandir la tarjeta para que el usuario vea el contenido coincidente
        if (tokens.length > 0) {
          card.classList.remove('is-collapsed');
          card.classList.add('is-expanded');
          const header = card.querySelector('.colua-job-card-header');
          if (header) header.setAttribute('aria-expanded', 'true');
          const desktopText = card.querySelector('.colua-job-btn-text-desktop');
          const mobileText = card.querySelector('.colua-job-btn-text-mobile');
          if (desktopText) desktopText.textContent = 'Ocultar detalles';
          if (mobileText) mobileText.textContent = 'Mostrar menos';
        }
      } else {
        card.classList.add('is-search-hidden');
      }
    });

    if (noResults) {
      noResults.style.display = (matchCount === 0 && tokens.length > 0) ? 'block' : 'none';
    }

    if (counterText) {
      if (tokens.length === 0) {
        counterText.innerHTML = `<strong>${totalCount}</strong> ${totalCount === 1 ? 'plaza vacante disponible' : 'plazas vacantes disponibles'}`;
      } else {
        counterText.innerHTML = `<strong>${matchCount}</strong> de <strong>${totalCount}</strong> ${matchCount === 1 ? 'plaza encontrada' : 'plazas encontradas'}`;
      }
    }
  }

  clearJobSearch() {
    const input = document.getElementById('colua-job-search-input');
    if (input) {
      input.value = '';
      input.focus();
    }
    this.filterJobs('');
    this._resetAccordionState();
  }

  _resetAccordionState() {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const cards = document.querySelectorAll('.colua-job-vacancy-card');
    cards.forEach((card, index) => {
      card.classList.remove('is-search-hidden');
      const isFirst = index === 0;
      // En desktop: plaza 1 expandida, plaza 2+ colapsadas en acordeón.
      // En móvil: todas colapsadas mostrando solo nombre de la plaza y botón mostrar más.
      const shouldExpand = !isMobile && isFirst;
      if (shouldExpand) {
        card.classList.remove('is-collapsed');
        card.classList.add('is-expanded');
      } else {
        card.classList.remove('is-expanded');
        card.classList.add('is-collapsed');
      }
      const header = card.querySelector('.colua-job-card-header');
      if (header) header.setAttribute('aria-expanded', shouldExpand ? 'true' : 'false');
      const desktopText = card.querySelector('.colua-job-btn-text-desktop');
      const mobileText = card.querySelector('.colua-job-btn-text-mobile');
      if (desktopText) desktopText.textContent = shouldExpand ? 'Ocultar detalles' : 'Ver detalles';
      if (mobileText) mobileText.textContent = shouldExpand ? 'Mostrar menos' : 'Mostrar más';
    });
  }

  toggleJobAccordion(jobId, event) {
    if (event) {
      // Si el clic fue en un enlace interactivo interior, no interferir
      if (event.target && event.target.tagName === 'A') return;
    }
    const card = document.getElementById(`job-card-${jobId}`);
    if (!card) return;

    card.setAttribute('data-user-interacted', 'true');
    const isCollapsed = card.classList.contains('is-collapsed');
    const header = card.querySelector('.colua-job-card-header');
    const desktopText = card.querySelector('.colua-job-btn-text-desktop');
    const mobileText = card.querySelector('.colua-job-btn-text-mobile');

    if (isCollapsed) {
      card.classList.remove('is-collapsed');
      card.classList.add('is-expanded');
      if (header) header.setAttribute('aria-expanded', 'true');
      if (desktopText) desktopText.textContent = 'Ocultar detalles';
      if (mobileText) mobileText.textContent = 'Mostrar menos';
    } else {
      card.classList.remove('is-expanded');
      card.classList.add('is-collapsed');
      if (header) header.setAttribute('aria-expanded', 'false');
      if (desktopText) desktopText.textContent = 'Ver detalles';
      if (mobileText) mobileText.textContent = 'Mostrar más';
    }
  }

  viewJobFlyer(imgUrl, title) {
    window.app?.showModal(`
      <div style="text-align: center; max-width: 580px; width: 100%; padding: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
          <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--colua-navy); margin: 0;">${title}</h3>
          <button type="button" class="btn btn-outline" onclick="app.closeModal()" style="padding: 4px 10px; font-size: 0.78rem;">✕ Cerrar</button>
        </div>
        <div style="border-radius: 12px; overflow: hidden; box-shadow: 0 4px 18px rgba(0,0,0,0.12); margin-bottom: 14px; max-height: 72vh; display: flex; justify-content: center; background: #0f172a;">
          <img src="${imgUrl}" alt="${title}" style="max-width: 100%; max-height: 72vh; object-fit: contain; display: block;" onerror="this.src='assets/distintivo_colua.png'" />
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 12px;">
          <a href="${imgUrl}" download="Convocatoria_${title}.jpg" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.82rem; background: var(--colua-navy); text-decoration: none; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px;">
            <span>Descargar Afiche Oficial</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </a>
          <button type="button" class="btn btn-outline" onclick="app.closeModal()" style="padding: 8px 16px; font-size: 0.82rem;">Cerrar</button>
        </div>
      </div>
    `);
  }

  attachEvents() {
    // Si estamos en vista móvil (<= 768px), garantizar que las tarjetas inicien colapsadas mostrando solo nombre y botón
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      const cards = document.querySelectorAll('.colua-job-vacancy-card');
      cards.forEach(card => {
        if (!card.hasAttribute('data-user-interacted')) {
          card.classList.remove('is-expanded');
          card.classList.add('is-collapsed');
          const header = card.querySelector('.colua-job-card-header');
          if (header) header.setAttribute('aria-expanded', 'false');
          const mobileText = card.querySelector('.colua-job-btn-text-mobile');
          if (mobileText) mobileText.textContent = 'Mostrar más';
        }
      });
    }
  }
}

window.sectionsComponent = new SectionsComponent();
