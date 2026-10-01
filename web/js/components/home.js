// web/js/components/home.js — Portal Corporativo Minimalista COLUA MICOOPE

class HomeComponent {
  async render() {
    let homeItems = [];
    try {
      if (window.coluaRepository) {
        homeItems = await window.coluaRepository.getItemsBySection('sec_home');
      }
    } catch (e) {
      console.error('Error cargando items dinámicos de sec_home:', e);
    }

    const iconMap = {
      'inicio': 'assets/distintivo_colua.png',
      'ahorros': 'assets/ahorros.png',
      'credito': 'assets/credito.png',
      'seguro': 'assets/seguro.png',
      'remesa': 'assets/remesa.png',
      'ubicacion': 'assets/ubicacion.png',
      'servicios_digitales': 'assets/servicios_digitales.png',
      'beneficios': 'assets/beneficios.png',
      'noticias_colua': 'assets/noticias.png',
      'public_service': 'assets/distintivo_colua.png',
      'sostenibilidad_cooperativa': 'assets/sostenibilidad_cooperativa.png',
      'sec_ahorros': 'assets/ahorros.png',
      'sec_creditos': 'assets/credito.png',
      'sec_seguros': 'assets/seguro.png',
      'sec_remesas': 'assets/remesa.png',
      'sec_agencias': 'assets/ubicacion.png',
      'sec_servicios': 'assets/servicios_digitales.png',
      'sec_beneficios': 'assets/beneficios.png',
      'sec_noticias': 'assets/noticias.png',
      'sec_nosotros': 'assets/distintivo_colua.png',
      'sec_sostenibilidad': 'assets/sostenibilidad_cooperativa.png'
    };

    // 1. Obtener todas las secciones activas registradas en el sistema (incluyendo nuevas secciones creadas)
    let allSections = [];
    try {
      if (window.coluaRepository) {
        allSections = await window.coluaRepository.getAllSections();
      }
    } catch (e) {
      console.error('Error cargando secciones en Home:', e);
    }

    // 2. Tarjetas canónicas base aseguradas (11 pantallas fijas)
    const canonicalBaseCards = [
      { id: "home_asociate", title: "Como asociarte", subtitle: "DPI, Recibo de Luz, Q100.00", description: "DPI, Recibo de Luz, Q100.00", iconName: "ahorros", targetSectionId: "form:form_asociate", buttonAction: "form:form_asociate", imageUrl: "assets/ahorros.png", displayOrder: 1, orderIndex: 1 },
      { id: "home_ahorro", title: "Cuentas de Ahorros Infantil y Juvenil", subtitle: "Cuentas de ahorro", description: "Cuentas de ahorro", iconName: "ahorros", targetSectionId: "sec_ahorros", buttonAction: "sec_ahorros", imageUrl: "assets/ahorros.png", displayOrder: 2, orderIndex: 2 },
      { id: "home_credito", title: "Créditos", subtitle: "Líneas de crédito", description: "Líneas de crédito", iconName: "credito", targetSectionId: "sec_creditos", buttonAction: "sec_creditos", imageUrl: "assets/credito.png", displayOrder: 3, orderIndex: 3 },
      { id: "home_seguros", title: "Seguros", subtitle: "Protección y vida", description: "Protección y vida", iconName: "seguro", targetSectionId: "sec_seguros", buttonAction: "sec_seguros", imageUrl: "assets/seguro.png", displayOrder: 4, orderIndex: 4 },
      { id: "home_remesas", title: "Remesas", subtitle: "Recibe tu dinero", description: "Recibe tu dinero", iconName: "remesa", targetSectionId: "sec_remesas", buttonAction: "sec_remesas", imageUrl: "assets/remesa.png", displayOrder: 5, orderIndex: 5 },
      { id: "home_beneficios", title: "Tus 6 Beneficios", subtitle: "Hospitalización, seguro de ahorrantes y beneficio de oro", description: "Hospitalización, seguro de ahorrantes y beneficio de oro", iconName: "beneficios", targetSectionId: "sec_beneficios", buttonAction: "sec_beneficios", imageUrl: "assets/beneficios.png", displayOrder: 6, orderIndex: 6 },
      { id: "home_agencias", title: "Agencias & PBX", subtitle: "Nuestras ubicaciones", description: "25 agencias en Sololá, Quiché, Totonicapán y Suchitepéquez", iconName: "ubicacion", targetSectionId: "sec_agencias", buttonAction: "sec_agencias", imageUrl: "assets/ubicacion.png", displayOrder: 7, orderIndex: 7 },
      { id: "home_servicios", title: "Servicios Digitales", subtitle: "Banca en línea", description: "MICOOPE en Línea, App Móvil y Notificaciones SMS", iconName: "servicios_digitales", targetSectionId: "sec_servicios", buttonAction: "sec_servicios", imageUrl: "assets/servicios_digitales.png", displayOrder: 8, orderIndex: 8 },
      { id: "home_noticias", title: "Noticias & Novedades", subtitle: "Actualidad COLUA", description: "Comunicados oficiales, jornadas ecológicas y convocatorias", iconName: "noticias_colua", targetSectionId: "sec_noticias", buttonAction: "sec_noticias", imageUrl: "assets/noticias.png", displayOrder: 9, orderIndex: 9 },
      { id: "home_sostenibilidad", title: "Sostenibilidad Cooperativa", subtitle: "Cursos y centros de innovación", description: "Becas educativas, talleres productivos y centros de innovación", iconName: "sostenibilidad_cooperativa", targetSectionId: "sec_sostenibilidad", buttonAction: "sec_sostenibilidad", imageUrl: "assets/sostenibilidad_cooperativa.png", displayOrder: 10, orderIndex: 10 },
      { id: "home_nosotros", title: "Nosotros", subtitle: "Valores cooperativos, historia y propósito", description: "Valores cooperativos, historia y propósito", iconName: "public_service", targetSectionId: "sec_nosotros", buttonAction: "sec_nosotros", imageUrl: "assets/distintivo_colua.png", displayOrder: 11, orderIndex: 11 }
    ];

    // 3. Tarjetas activas registradas en sec_home (excluyendo cabecera y banners)
    let displayCards = [];
    const usedTargetSections = new Set();

    if (homeItems && homeItems.length > 0) {
      const activeHomeItems = homeItems.filter(i =>
        i.isEnabled !== false &&
        i.isVisible !== false &&
        i.isDraft !== true &&
        i.id !== 'home_hero_header' &&
        !i.id.startsWith('home_banner_') &&
        !i.id.startsWith('home_simulador_')
      );
      activeHomeItems.forEach(item => {
        displayCards.push(item);
        const tgt = item.targetSectionId || item.id || '';
        if (tgt) usedTargetSections.add(tgt.toLowerCase());
      });
    }

    // 4. Asegurar que las 10 tarjetas canónicas estén representadas
    canonicalBaseCards.forEach(base => {
      const tgt = base.targetSectionId.toLowerCase();
      const hasCard = displayCards.some(c =>
        (c.targetSectionId && c.targetSectionId.toLowerCase() === tgt) ||
        (c.id && c.id.toLowerCase() === base.id.toLowerCase()) ||
        (c.id && c.id.toLowerCase() === tgt)
      );
      if (!hasCard) {
        displayCards.push(base);
        usedTargetSections.add(tgt);
      }
    });

    // 5. Incluir dinámicamente cualquier NUEVA pantalla/sección creada en el CMS (la 11va, 12va, etc.)
    if (allSections && allSections.length > 0) {
      allSections.forEach(sec => {
        if (
          sec.id === 'sec_home' ||
          sec.slug === 'home' ||
          sec.id === 'sec_comunidad' ||
          sec.slug === 'comunidad' ||
          sec.isVisible === false ||
          sec.isEnabled === false ||
          sec.menuPlacement === 'hidden'
        ) {
          return;
        }
        const secIdLower = (sec.id || '').toLowerCase();
        const secSlugLower = (sec.slug || '').toLowerCase();
        const isRepresented = displayCards.some(c => {
          const cTgt = (c.targetSectionId || '').toLowerCase();
          const cId = (c.id || '').toLowerCase();
          return cTgt === secIdLower || cTgt === '#' + secIdLower || cTgt === secSlugLower || cId === secIdLower || cId === 'home_' + secSlugLower;
        });

        if (!isRepresented) {
          displayCards.push({
            id: sec.id,
            title: sec.title || 'Nueva Sección',
            subtitle: sec.description || sec.shortDescription || 'Área de gestión cooperativa',
            description: sec.description || 'Área de gestión cooperativa',
            iconName: sec.iconName || 'distintivo_colua',
            targetSectionId: sec.id,
            imageUrl: sec.imageUrl || iconMap[sec.iconName] || iconMap[sec.id] || 'assets/distintivo_colua.png',
            displayOrder: sec.displayOrder || sec.orderIndex || 99
          });
        }
      });
    }

    displayCards.sort((a, b) => (a.displayOrder || a.orderIndex || 99) - (b.displayOrder || b.orderIndex || 99));

    // Hero, Banners y Simulación dinámicos desde sec_home
    const heroItem = homeItems.find(i => i.id === 'home_hero_header');
    const heroTitle = heroItem?.title || 'Hola, bienvenido a COLUA MICOOPE';
    const heroSubtitle = heroItem?.subtitle || 'El lado humano de los ahorros y créditos cooperativos. Selecciona un área para comenzar tu gestión.';

    const pbxItem = homeItems.find(i => i.id === 'home_banner_pbx');
    const pbxTitle = pbxItem?.shortDescription || 'ATENCIÓN TELEFÓNICA';
    const pbxPhone = pbxItem?.buttonText || pbxItem?.subtitle || 'PBX: (502) 7795-7795';
    const pbxAction = pbxItem?.buttonAction || pbxItem?.targetSectionId || 'tel:77957795';
    const pbxHours = pbxItem?.description || 'Lunes a viernes de 8:00 a 17:00 | Sábados de 8:00 a 12:00 hrs.';

    const digitalItem = homeItems.find(i => i.id === 'home_banner_digital');
    const digitalTag = digitalItem?.subtitle || 'CANAL DIGITAL SEGURO';
    const digitalTitle = digitalItem?.buttonText || digitalItem?.title || 'Ingresar a MICOOPE en Línea';
    const digitalAction = digitalItem?.buttonAction || digitalItem?.targetSectionId || 'https://micoopeenlinea.com.gt';

    return `
      <div class="clean-page-container">
        
        <!-- ==============================================
             1. HERO MINIMALISTA: CABECERA INSTITUCIONAL
             ============================================== -->
        <header class="clean-hero-header">
          <h1 class="clean-hero-title">
            ${heroTitle}
          </h1>
          <p class="clean-hero-subtitle">
            ${heroSubtitle}
          </p>
        </header>

        <!-- ==============================================
             2. CUADRÍCULA DINÁMICA DE SECCIONES DE GESTIÓN
             ============================================== -->
        <section class="clean-cards-grid" aria-label="Áreas de Gestión Cooperativa">
          ${displayCards.map(s => {
      const rawRoute = (s.buttonAction || s.targetSectionId || s.id || '').trim();
      const isPdf = s.type === 'pdf_document' || rawRoute.startsWith('pdf:') || rawRoute.includes('indexeddb:') || (s.pdfUrl && s.pdfUrl.length > 0);
      const isFormModal = !isPdf && (rawRoute.startsWith('form:') || rawRoute === 'modal:form' || rawRoute === 'form_asociate' || s.id === 'home_asociate' || (s.title || '').toLowerCase().includes('asociarte'));
      const isInfoModal = !isPdf && !isFormModal && (rawRoute === 'modal:info' || rawRoute === 'info_modal' || s.buttonAction === 'modal:info');

      let targetRoute = rawRoute;
      if (!isInfoModal && !isFormModal && !isPdf) {
        if (rawRoute.startsWith('http') || rawRoute.startsWith('tel:') || rawRoute.startsWith('#') || rawRoute.startsWith('sec_')) {
          targetRoute = rawRoute;
        } else if (rawRoute.startsWith('home_')) {
          targetRoute = rawRoute.replace('home_', 'sec_');
        } else if (s.targetSectionId && (s.targetSectionId.startsWith('sec_') || s.targetSectionId.startsWith('#'))) {
          targetRoute = s.targetSectionId;
        } else if (s.id && s.id.startsWith('sec_')) {
          targetRoute = s.id;
        } else {
          targetRoute = s.targetSectionId || 'sec_ahorros';
        }
      }

      const iconImg = s.imageUrl || iconMap[s.id] || iconMap[s.iconName] || iconMap[s.targetSectionId] || 'assets/distintivo_colua.png';

      let clickAction = '';
      if (isPdf) {
        const pUrl = s.pdfUrl || (rawRoute.startsWith('pdf:') ? rawRoute.replace(/^pdf:/, '') : rawRoute);
        clickAction = `window.openPdfDocument ? window.openPdfDocument('${pUrl}', '${(s.title || 'Documento Oficial').replace(/'/g, "\\'")}', '${s.id}') : (window.app && window.app.openItemPdf ? window.app.openItemPdf('${s.id}', '${pUrl}') : null)`;
      } else if (isFormModal) {
        const fId = rawRoute.replace('form:', '').trim() || 'form_asociate';
        clickAction = `app.showDynamicFormModal ? app.showDynamicFormModal('${fId}') : null`;
      } else if (isInfoModal) {
        clickAction = `app.showItemInfoModal ? app.showItemInfoModal('${s.id}') : (window.location.hash='#${s.targetSectionId || s.id}')`;
      } else if (targetRoute.startsWith('http')) {
        clickAction = `window.open('${targetRoute}', '_blank')`;
      } else if (targetRoute.startsWith('tel:')) {
        clickAction = `window.location.href='${targetRoute}'`;
      } else if (targetRoute.startsWith('#')) {
        clickAction = `window.location.hash='${targetRoute}'`;
      } else {
        clickAction = `window.coluaRouter ? window.coluaRouter.navigate('${targetRoute}') : (window.location.hash='#${targetRoute}')`;
      }

      let cardTitle = (s.title || '').trim();
      let cardSubtitle = (s.subtitle || s.description || s.shortDescription || '').trim();

      const lowerTitle = cardTitle.toLowerCase();
      const lowerSub = cardSubtitle.toLowerCase();
      const rawId = (s.id || '').toLowerCase();
      // Sanitizar solo si contiene strings residuales de versiones anteriores
      if (lowerSub.includes('ahorro!') || lowerTitle.includes('ahorroahorro')) {
        cardTitle = cardTitle.replace(/ahorroahorro/gi, 'Ahorros');
        if (lowerSub.includes('ahorro!')) cardSubtitle = 'Cuentas de ahorro';
      } else if (lowerSub.includes('crédito!') || lowerSub.includes('credito!') || lowerTitle.includes('créditocrédito') || lowerTitle.includes('productivo, consumo')) {
        cardTitle = cardTitle.includes('productivo, consumo') ? 'Créditos' : cardTitle.replace(/créditocrédito/gi, 'Créditos');
        if (lowerSub.includes('crédito!') || lowerSub.includes('credito!') || lowerTitle.includes('productivo, consumo')) cardSubtitle = 'Líneas de crédito';
      } else if (lowerSub.includes('seguro!') || lowerTitle.includes('seguros de vida seguros') || lowerTitle.includes('seguros médicos')) {
        cardTitle = cardTitle.includes('seguros médicos') ? 'Seguros' : cardTitle.replace(/seguros de vida seguros/gi, 'Seguros');
        if (lowerSub.includes('seguro!') || lowerTitle.includes('seguros médicos')) cardSubtitle = 'Protección y vida';
      } else if (lowerSub.includes('remesa!') || lowerTitle.includes('remesas dirigidas')) {
        cardTitle = cardTitle.replace(/remesas dirigidas/gi, 'Remesas');
        if (lowerSub.includes('remesa!')) cardSubtitle = 'Recibe tu dinero';
      }

      return `
              <div class="clean-item-card" onclick="${clickAction}" role="button" tabindex="0" title="Ver ${cardTitle}">
                <div class="clean-card-top-row">
                  <div class="clean-card-icon-box">
                    ${iconImg && (iconImg.startsWith('assets/') || iconImg.startsWith('http') || iconImg.startsWith('data:')) ? `
                      <img src="${iconImg}" alt="${cardTitle}" class="clean-card-icon-img" onerror="this.src='assets/distintivo_colua.png'" />
                    ` : `
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#173789" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12l2 2 4-4"/></svg>
                    `}
                  </div>
                  <span class="clean-card-arrow-icon">→</span>
                </div>
                <div class="clean-card-info-bottom">
                  <h3 class="clean-card-title-text">${cardTitle}</h3>
                  <p class="clean-card-desc-text">${cardSubtitle}</p>
                </div>
              </div>
            `;
    }).join('')}
        </section>

        <!-- ==============================================
             3. BANNERS DE ATENCIÓN Y BANCA DIGITAL
             ============================================== -->
        <section class="clean-banners-container">
          <!-- Banner Blanco: Atención Telefónica -->
          <div class="clean-banner-white-card">
            <div class="clean-banner-phone-icon">
              <img src="assets/pbx.png" alt="PBX" />
            </div>
            <div class="clean-banner-white-info">
              <span class="clean-banner-tag-blue">${pbxTitle}</span>
              <a href="${pbxAction}" class="clean-banner-pbx-number">${pbxPhone}</a>
              <span class="clean-banner-pbx-hours">${pbxHours}</span>
            </div>
          </div>

          <!-- Banner Dark Navy: Canal Digital Seguro -->
          <a href="${digitalAction}" target="_blank" rel="noopener noreferrer" class="clean-banner-dark-card" title="Ingresar a MICOOPE en Línea">
            <div class="clean-banner-dark-left">
              <div class="clean-banner-dark-icon">
                <img src="assets/micoope_enlinea.png" alt="MICOOPE en Línea" />
              </div>
              <div class="clean-banner-white-info">
                <span class="clean-banner-dark-tag">${digitalTag}</span>
                <h4 class="clean-banner-dark-title">${digitalTitle}</h4>
              </div>
            </div>
            <span class="clean-banner-dark-arrow">→</span>
          </a>
        </section>

        <!-- ==============================================
             4. SELLOS DE SUPERVISIÓN Y CONFIANZA
             ============================================== -->
        <div class="clean-trust-strip-row">
          <div class="clean-trust-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>Entidad supervisada por la Inspección General de Cooperativas (INGECOP)</span>
          </div>
          <div class="clean-trust-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Fondo de Garantía MICOOPE</span>
          </div>
        </div>

        <!-- ==============================================
             5. SIMULADOR FINANCIERO DINÁMICO & EDITABLE
             ============================================== -->
        <section class="clean-simulator-wrapper" id="simulador-financiero">
          <div class="clean-sim-header-row">
            <div>
              <span style="font-size:0.75rem;font-weight:800;color:#173789;text-transform:uppercase;letter-spacing:0.8px;display:block;margin-bottom:4px;">HERRAMIENTA FINANCIERA EN VIVO</span>
              <h2 style="font-size:1.45rem;font-weight:800;color:#0f172a;margin:0 0 0.25rem 0;">Calcula tu Cuota o Rendimiento</h2>
              <p style="font-size:0.88rem;color:#64748b;margin:0;">Simula tu préstamo o inversión a plazo fijo con montos ilimitados y tasas oficiales actualizadas.</p>
            </div>
            <div class="clean-sim-tabs">
              <button class="clean-sim-tab-btn active" id="sim-tab-credito">Simulador de Crédito</button>
              <button class="clean-sim-tab-btn" id="sim-tab-ahorro">Simulador de Ahorro</button>
            </div>
          </div>

          <!-- Panel 1: Crédito -->
          <div id="sim-panel-credito">
            <div class="clean-sim-grid">
              
              <!-- Controles Formulario Crédito -->
              <div class="clean-sim-form-col">
                <!-- Línea de Crédito & Tasa -->
                <div style="margin-bottom:1.35rem;">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;flex-wrap:wrap;gap:6px;">
                    <label style="font-size:0.88rem;font-weight:700;color:#1e293b;">Tipo de Crédito y Tasa Oficial</label>
                    <span id="badge-tasa-credito" style="font-size:0.76rem;font-weight:800;color:#15803d;background:#dcfce7;padding:3px 9px;border-radius:8px;">
                      1.25% mensual (15.00% anual)
                    </span>
                  </div>
                  <select id="select-credito-destino" style="width:100%;box-sizing:border-box;padding:0.65rem 0.85rem;border:1.5px solid #cbd5e1;border-radius:10px;font-family:inherit;font-size:0.9rem;background:#ffffff;color:#0f172a;font-weight:600;outline:none;transition:border-color 0.2s;">
                    <option value="1.25" data-tasa-anual="15.00" data-name="Crédito Productivo">Crédito Productivo — Capital de trabajo e inversión (1.25% mes / 15.00% año)</option>
                    <option value="1.35" data-tasa-anual="16.20" data-name="Crédito Consumo">Crédito Consumo — Gastos personales, estudios y menaje (1.35% mes / 16.20% año)</option>
                    <option value="1.15" data-tasa-anual="13.80" data-name="Crédito Vivienda">Crédito Vivienda — Compra, construcción o remodelación (1.15% mes / 13.80% año)</option>
                    <option value="1.20" data-tasa-anual="14.40" data-name="Crédi Vehículo">Crédi Vehículo — Vehículo o motocicleta nueva/usada (1.20% mes / 14.40% año)</option>
                    <option value="1.30" data-tasa-anual="15.60" data-name="Crédito MIPYMES">Crédito MIPYMES — Negocios y comercio en crecimiento (1.30% mes / 15.60% año)</option>
                    <option value="1.25" data-tasa-anual="15.00" data-name="Crédito Agrícola">Crédito Agrícola — Siembra, cosecha y tecnificación (1.25% mes / 15.00% año)</option>
                    <option value="1.00" data-tasa-anual="12.00" data-name="Crédito Automático">Crédito Automático — Respaldo sobre aportaciones (1.00% mes / 12.00% año)</option>
                    <option value="1.40" data-tasa-anual="16.80" data-name="Microcréditos">Microcréditos — Emprendimiento ágil sin trámites largos (1.40% mes / 16.80% año)</option>
                  </select>
                </div>

                <!-- Monto a Solicitar (Entrada Directa + Rango) -->
                <div style="margin-bottom:1.35rem;">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;flex-wrap:wrap;gap:4px;">
                    <label style="font-size:0.88rem;font-weight:700;color:#1e293b;">Monto a Solicitar (Escribe o desliza)</label>
                    <span style="font-size:0.75rem;color:#64748b;">(Separación automática con comas)</span>
                  </div>
                  
                  <!-- Input Numérico Principal con Formateo de Comas -->
                  <div style="position:relative;margin-bottom:0.75rem;">
                    <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-weight:800;color:#173789;font-size:1.1rem;">Q</span>
                    <input type="text" id="input-credito-monto" value="25,000" placeholder="Ej. 1,000,000" style="width:100%;box-sizing:border-box;padding:0.7rem 0.85rem 0.7rem 2.2rem;border:2px solid #2563eb;border-radius:10px;font-family:inherit;font-size:1.15rem;font-weight:800;color:#0f172a;outline:none;background:#f8faff;" />
                  </div>

                  <!-- Barrita Deslizadora Sincronizada -->
                  <input type="range" id="range-credito-monto" min="1000" max="1000000" step="1000" value="25000" style="width:100%;box-sizing:border-box;accent-color:#2563eb;cursor:pointer;" />
                  
                  <!-- Entradas de Mínimo y Máximo Editables -->
                  <div class="clean-sim-minmax-grid">
                    <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:6px 10px;border-radius:8px;box-sizing:border-box;min-width:0;">
                      <label style="font-size:0.7rem;font-weight:700;color:#64748b;display:block;text-transform:uppercase;">Monto Mínimo</label>
                      <div style="display:flex;align-items:center;gap:4px;">
                        <span style="font-weight:700;color:#64748b;font-size:0.8rem;">Q</span>
                        <input type="text" id="input-credito-min" value="1,000" style="width:100%;border:none;background:transparent;font-weight:700;color:#334155;font-size:0.85rem;padding:0;outline:none;" />
                      </div>
                    </div>
                    <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:6px 10px;border-radius:8px;box-sizing:border-box;min-width:0;">
                      <label style="font-size:0.7rem;font-weight:700;color:#64748b;display:block;text-transform:uppercase;">Monto Máximo (Hasta 1M+)</label>
                      <div style="display:flex;align-items:center;gap:4px;">
                        <span style="font-weight:700;color:#64748b;font-size:0.8rem;">Q</span>
                        <input type="text" id="input-credito-max" value="1,000,000" style="width:100%;border:none;background:transparent;font-weight:700;color:#334155;font-size:0.85rem;padding:0;outline:none;" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Plazo del Crédito -->
                <div style="margin-bottom:1rem;">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;flex-wrap:wrap;gap:4px;">
                    <label style="font-size:0.88rem;font-weight:700;color:#1e293b;">Plazo del Financiamiento</label>
                    <span id="disp-credito-plazo" style="font-size:0.95rem;font-weight:800;color:#2563eb;">24 Meses (2.0 Años)</span>
                  </div>
                  <input type="range" id="range-credito-plazo" min="6" max="120" step="6" value="24" style="width:100%;box-sizing:border-box;accent-color:#2563eb;cursor:pointer;" />
                  <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:#94a3b8;margin-top:2px;">
                    <span>6 Meses</span><span>60 Meses (5 Años)</span><span>120 Meses (10 Años)</span>
                  </div>
                </div>
              </div>

              <!-- Resultado del Cálculo (Fórmula Francesa Oficial) -->
              <div class="clean-sim-result-card credito">
                <span style="font-size:0.76rem;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:0.8px;display:block;margin-bottom:2px;">Cuota Mensual Nivelada</span>
                <div id="calc-credito-cuota" class="clean-sim-quote-amount" style="color:#173789;">Q 1,354.17</div>
                
                <div class="clean-sim-details-list" style="color:#475569;border-top:1.5px solid #cbd5e1;">
                  <div class="clean-sim-details-row">
                    <span>Monto Solicitado:</span>
                    <strong id="calc-credito-monto-res" style="color:#0f172a;font-weight:800;">Q 25,000.00</strong>
                  </div>
                  <div class="clean-sim-details-row">
                    <span>Plazo de Amortización:</span>
                    <strong id="calc-credito-plazo-res" style="color:#0f172a;font-weight:700;">24 meses</strong>
                  </div>
                  <div class="clean-sim-details-row">
                    <span>Tasa Aplicada:</span>
                    <strong id="calc-credito-tasa-res" style="color:#15803d;font-weight:800;">1.25% mes (15.00% anual)</strong>
                  </div>
                  <div class="clean-sim-details-row">
                    <span>Total Intereses Estimados:</span>
                    <strong id="calc-credito-intereses-res" style="color:#0f172a;font-weight:700;">Q 7,500.00</strong>
                  </div>
                  <div class="clean-sim-details-row">
                    <span>Póliza y Seguro de Deudores:</span>
                    <strong style="color:#2563eb;font-weight:800;">100% Cubierta por COLUA</strong>
                  </div>
                </div>

                <div style="display:flex;flex-direction:column;gap:8px;">
                  <button class="clean-btn-card-action" onclick="window.coluaRouter ? window.coluaRouter.navigate('sec_creditos') : (window.location.hash='#sec_creditos')" style="background:#173789;color:#ffffff;border-color:#173789;font-weight:700;font-size:0.92rem;padding:0.75rem 1.25rem;border-radius:10px;cursor:pointer;transition:all 0.2s;width:100%;box-sizing:border-box;">
                    Solicitar este Crédito en Agencia
                  </button>
                  <a href="tel:77957795" style="font-size:0.8rem;font-weight:700;color:#173789;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:6px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>O cotiza con un asesor al PBX: 7795-7795</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          <!-- Panel 2: Ahorro Plazo Fijo -->
          <div id="sim-panel-ahorro" style="display:none;">
            <div class="clean-sim-grid">
              
              <!-- Controles Ahorro -->
              <div class="clean-sim-form-col">
                <!-- Monto de Inversión -->
                <div style="margin-bottom:1.35rem;">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;flex-wrap:wrap;gap:4px;">
                    <label style="font-size:0.88rem;font-weight:700;color:#1e293b;">Monto de Inversión (Escribe o desliza)</label>
                    <span style="font-size:0.75rem;color:#64748b;">(Separación automática con comas)</span>
                  </div>
                  
                  <div style="position:relative;margin-bottom:0.75rem;">
                    <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-weight:800;color:#173789;font-size:1.1rem;">Q</span>
                    <input type="text" id="input-ahorro-monto" value="10,000" placeholder="Ej. 500,000" style="width:100%;box-sizing:border-box;padding:0.7rem 0.85rem 0.7rem 2.2rem;border:2px solid #59B8A4;border-radius:10px;font-family:inherit;font-size:1.15rem;font-weight:800;color:#0f172a;outline:none;background:#f8faff;" />
                  </div>

                  <input type="range" id="range-ahorro-monto" min="1000" max="1000000" step="1000" value="10000" style="width:100%;box-sizing:border-box;accent-color:#59B8A4;cursor:pointer;" />
                  
                  <div class="clean-sim-minmax-grid">
                    <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:6px 10px;border-radius:8px;box-sizing:border-box;min-width:0;">
                      <label style="font-size:0.7rem;font-weight:700;color:#64748b;display:block;text-transform:uppercase;">Inversión Mínima</label>
                      <div style="display:flex;align-items:center;gap:4px;">
                        <span style="font-weight:700;color:#64748b;font-size:0.8rem;">Q</span>
                        <input type="text" id="input-ahorro-min" value="1,000" style="width:100%;border:none;background:transparent;font-weight:700;color:#334155;font-size:0.85rem;padding:0;outline:none;" />
                      </div>
                    </div>
                    <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:6px 10px;border-radius:8px;box-sizing:border-box;min-width:0;">
                      <label style="font-size:0.7rem;font-weight:700;color:#64748b;display:block;text-transform:uppercase;">Inversión Máxima</label>
                      <div style="display:flex;align-items:center;gap:4px;">
                        <span style="font-weight:700;color:#64748b;font-size:0.8rem;">Q</span>
                        <input type="text" id="input-ahorro-max" value="1,000,000" style="width:100%;border:none;background:transparent;font-weight:700;color:#334155;font-size:0.85rem;padding:0;outline:none;" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Plazo de la Inversión -->
                <div style="margin-bottom:1rem;">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;flex-wrap:wrap;gap:4px;">
                    <label style="font-size:0.88rem;font-weight:700;color:#1e293b;">Plazo de la Inversión</label>
                    <span id="disp-ahorro-plazo" style="font-size:0.95rem;font-weight:800;color:#0d9488;">365 Días (1 Año)</span>
                  </div>
                  <input type="range" id="range-ahorro-plazo" min="90" max="1825" step="90" value="365" style="width:100%;box-sizing:border-box;accent-color:#59B8A4;cursor:pointer;" />
                  <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:#94a3b8;margin-top:2px;">
                    <span>90 Días</span><span>365 Días (1 Año)</span><span>1,825 Días (5 Años)</span>
                  </div>
                </div>
              </div>

              <!-- Resultado Ahorro -->
              <div class="clean-sim-result-card ahorro">
                <span style="font-size:0.76rem;font-weight:800;color:#047857;text-transform:uppercase;letter-spacing:0.8px;display:block;margin-bottom:2px;">Ganancia Estimada en Intereses</span>
                <div id="calc-ahorro-ganancia" class="clean-sim-quote-amount" style="color:#065f46;">Q 650.00</div>
                
                <div class="clean-sim-details-list" style="color:#334155;border-top:1.5px solid #a7f3d0;">
                  <div class="clean-sim-details-row">
                    <span>Capital al Vencimiento:</span>
                    <strong id="calc-ahorro-total" style="color:#065f46;font-weight:800;">Q 10,650.00</strong>
                  </div>
                  <div class="clean-sim-details-row">
                    <span>Tasa Preferencial MICOOPE:</span>
                    <strong id="calc-ahorro-tasa" style="color:#0d9488;font-weight:800;">6.50% Anual</strong>
                  </div>
                  <div class="clean-sim-details-row">
                    <span>Protección y Solvencia:</span>
                    <strong style="color:#0f172a;font-weight:700;">Fondo de Garantía MICOOPE</strong>
                  </div>
                  <div class="clean-sim-details-row">
                    <span>Disponibilidad de Pago:</span>
                    <strong style="color:#0f172a;font-weight:700;">Mensual o al Vencimiento</strong>
                  </div>
                </div>

                <button class="clean-btn-card-action" onclick="window.coluaRouter ? window.coluaRouter.navigate('sec_ahorros') : (window.location.hash='#sec_ahorros')" style="background:#059669;color:#ffffff;border-color:#059669;font-weight:700;font-size:0.92rem;padding:0.75rem 1.25rem;border-radius:10px;cursor:pointer;width:100%;box-sizing:border-box;">
                  Abrir Cuenta a Plazo Fijo
                </button>
              </div>

            </div>
          </div>
        </section>

      </div>
    `;
  }

  attachEvents() {
    this.initSimulatorEvents();
  }

  // Lógica del Simulador Financiero en Vivo con Comas cada 3 dígitos y montos ilimitados
  initSimulatorEvents() {
    const tabCredito = document.getElementById('sim-tab-credito');
    const tabAhorro = document.getElementById('sim-tab-ahorro');
    const panelCredito = document.getElementById('sim-panel-credito');
    const panelAhorro = document.getElementById('sim-panel-ahorro');

    if (tabCredito && tabAhorro) {
      tabCredito.onclick = () => {
        tabCredito.classList.add('active');
        tabAhorro.classList.remove('active');
        tabCredito.style.background = '#ffffff';
        tabCredito.style.color = '#173789';
        tabAhorro.style.background = 'transparent';
        tabAhorro.style.color = '#64748b';
        if (panelCredito) panelCredito.style.display = 'block';
        if (panelAhorro) panelAhorro.style.display = 'none';
      };

      tabAhorro.onclick = () => {
        tabAhorro.classList.add('active');
        tabCredito.classList.remove('active');
        tabAhorro.style.background = '#ffffff';
        tabAhorro.style.color = '#173789';
        tabCredito.style.background = 'transparent';
        tabCredito.style.color = '#64748b';
        if (panelAhorro) panelAhorro.style.display = 'block';
        if (panelCredito) panelCredito.style.display = 'none';
      };
    }

    // Helper para formatear números con comas cada 3 dígitos
    const formatNumberWithCommas = (val) => {
      if (val === undefined || val === null || isNaN(val)) return '0';
      const parts = val.toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    };

    const parseNumberFromFormatted = (str) => {
      if (!str) return 0;
      const clean = str.toString().replace(/[^\d.]/g, '');
      const parsed = parseFloat(clean);
      return isNaN(parsed) ? 0 : parsed;
    };

    // ── SIMULADOR DE CRÉDITO ────────────────────────────
    const inputMonto = document.getElementById('input-credito-monto');
    const rangeMonto = document.getElementById('range-credito-monto');
    const inputMin = document.getElementById('input-credito-min');
    const inputMax = document.getElementById('input-credito-max');
    const rangePlazo = document.getElementById('range-credito-plazo');
    const selectDestino = document.getElementById('select-credito-destino');
    const badgeTasa = document.getElementById('badge-tasa-credito');

    const updateCredito = (fromSource) => {
      let minVal = parseNumberFromFormatted(inputMin?.value || '1000');
      let maxVal = parseNumberFromFormatted(inputMax?.value || '1000000');
      if (minVal < 100) minVal = 100;
      if (maxVal < minVal) maxVal = minVal + 1000;

      if (rangeMonto) {
        rangeMonto.min = minVal;
        rangeMonto.max = maxVal;
      }

      let currentMonto = 25000;
      if (fromSource === 'slider' && rangeMonto) {
        currentMonto = parseFloat(rangeMonto.value) || minVal;
        if (inputMonto) inputMonto.value = formatNumberWithCommas(Math.round(currentMonto));
      } else if (fromSource === 'input' && inputMonto) {
        currentMonto = parseNumberFromFormatted(inputMonto.value);
        if (currentMonto > maxVal) {
          maxVal = currentMonto;
          if (inputMax) inputMax.value = formatNumberWithCommas(maxVal);
          if (rangeMonto) rangeMonto.max = maxVal;
        }
        if (rangeMonto) rangeMonto.value = currentMonto;
      } else {
        currentMonto = parseNumberFromFormatted(inputMonto?.value || '25000');
      }

      const meses = parseInt(rangePlazo?.value || '24', 10);
      const opt = selectDestino?.selectedOptions?.[0];
      const tasaMensual = opt ? parseFloat(opt.value) / 100 : 0.0125;
      const tasaAnual = opt?.dataset?.tasaAnual || (tasaMensual * 12 * 100).toFixed(2);

      if (badgeTasa) {
        badgeTasa.textContent = `${(tasaMensual * 100).toFixed(2)}% mensual (${tasaAnual}% anual)`;
      }

      // Fórmula Francesa Cuota Nivelada: C = M * (i / (1 - (1+i)^-n))
      let cuota = 0;
      if (tasaMensual > 0 && meses > 0 && currentMonto > 0) {
        cuota = currentMonto * (tasaMensual / (1 - Math.pow(1 + tasaMensual, -meses)));
      }
      const totalPagar = cuota * meses;
      const totalIntereses = Math.max(0, totalPagar - currentMonto);

      const dispPlazo = document.getElementById('disp-credito-plazo');
      const calcCuota = document.getElementById('calc-credito-cuota');
      const calcMontoRes = document.getElementById('calc-credito-monto-res');
      const calcPlazoRes = document.getElementById('calc-credito-plazo-res');
      const calcTasaRes = document.getElementById('calc-credito-tasa-res');
      const calcInteresesRes = document.getElementById('calc-credito-intereses-res');

      if (dispPlazo) dispPlazo.innerText = `${meses} Meses (${(meses / 12).toFixed(1)} Años)`;
      if (calcCuota) calcCuota.innerText = `Q ${formatNumberWithCommas(cuota.toFixed(2))}`;
      if (calcMontoRes) calcMontoRes.innerText = `Q ${formatNumberWithCommas(currentMonto.toFixed(2))}`;
      if (calcPlazoRes) calcPlazoRes.innerText = `${meses} meses (${(meses / 12).toFixed(1)} años)`;
      if (calcTasaRes) calcTasaRes.innerText = `${(tasaMensual * 100).toFixed(2)}% mes (${tasaAnual}% anual)`;
      if (calcInteresesRes) calcInteresesRes.innerText = `Q ${formatNumberWithCommas(totalIntereses.toFixed(2))}`;
    };

    if (inputMonto) {
      inputMonto.addEventListener('input', (e) => {
        const raw = parseNumberFromFormatted(e.target.value);
        e.target.value = formatNumberWithCommas(raw);
        updateCredito('input');
      });
      inputMonto.addEventListener('blur', (e) => {
        const raw = parseNumberFromFormatted(e.target.value);
        e.target.value = formatNumberWithCommas(raw || 1000);
        updateCredito('input');
      });
    }

    if (inputMin) {
      inputMin.addEventListener('change', (e) => {
        const raw = parseNumberFromFormatted(e.target.value);
        e.target.value = formatNumberWithCommas(raw);
        updateCredito('limits');
      });
    }

    if (inputMax) {
      inputMax.addEventListener('change', (e) => {
        const raw = parseNumberFromFormatted(e.target.value);
        e.target.value = formatNumberWithCommas(raw);
        updateCredito('limits');
      });
    }

    if (rangeMonto) {
      rangeMonto.addEventListener('input', () => updateCredito('slider'));
    }

    if (rangePlazo) {
      rangePlazo.addEventListener('input', () => updateCredito('plazo'));
    }

    if (selectDestino) {
      selectDestino.addEventListener('change', () => updateCredito('tasa'));
    }

    // ── SIMULADOR DE AHORRO PLAZO FIJO ─────────────────
    const inputAhorroMonto = document.getElementById('input-ahorro-monto');
    const rangeAhorroMonto = document.getElementById('range-ahorro-monto');
    const inputAhorroMin = document.getElementById('input-ahorro-min');
    const inputAhorroMax = document.getElementById('input-ahorro-max');
    const rangeAhorroPlazo = document.getElementById('range-ahorro-plazo');

    const updateAhorro = (fromSource) => {
      let minVal = parseNumberFromFormatted(inputAhorroMin?.value || '1000');
      let maxVal = parseNumberFromFormatted(inputAhorroMax?.value || '1000000');
      if (minVal < 100) minVal = 100;
      if (maxVal < minVal) maxVal = minVal + 1000;

      if (rangeAhorroMonto) {
        rangeAhorroMonto.min = minVal;
        rangeAhorroMonto.max = maxVal;
      }

      let currentMonto = 10000;
      if (fromSource === 'slider' && rangeAhorroMonto) {
        currentMonto = parseFloat(rangeAhorroMonto.value) || minVal;
        if (inputAhorroMonto) inputAhorroMonto.value = formatNumberWithCommas(Math.round(currentMonto));
      } else if (fromSource === 'input' && inputAhorroMonto) {
        currentMonto = parseNumberFromFormatted(inputAhorroMonto.value);
        if (currentMonto > maxVal) {
          maxVal = currentMonto;
          if (inputAhorroMax) inputAhorroMax.value = formatNumberWithCommas(maxVal);
          if (rangeAhorroMonto) rangeAhorroMonto.max = maxVal;
        }
        if (rangeAhorroMonto) rangeAhorroMonto.value = currentMonto;
      } else {
        currentMonto = parseNumberFromFormatted(inputAhorroMonto?.value || '10000');
      }

      const dias = parseInt(rangeAhorroPlazo?.value || '365', 10);

      // Tasas preferenciales según el plazo
      let tasaAnual = 0.055;
      if (dias >= 180) tasaAnual = 0.060;
      if (dias >= 365) tasaAnual = 0.065;
      if (dias >= 730) tasaAnual = 0.075;
      if (dias >= 1095) tasaAnual = 0.080;

      const ganancia = currentMonto * (tasaAnual * (dias / 365));
      const total = currentMonto + ganancia;

      const dispPlazo = document.getElementById('disp-ahorro-plazo');
      const calcGanancia = document.getElementById('calc-ahorro-ganancia');
      const calcTotal = document.getElementById('calc-ahorro-total');
      const calcTasa = document.getElementById('calc-ahorro-tasa');

      if (dispPlazo) dispPlazo.innerText = `${dias} Días (${(dias / 365).toFixed(1)} Años)`;
      if (calcGanancia) calcGanancia.innerText = `Q ${formatNumberWithCommas(ganancia.toFixed(2))}`;
      if (calcTotal) calcTotal.innerText = `Q ${formatNumberWithCommas(total.toFixed(2))}`;
      if (calcTasa) calcTasa.innerText = `${(tasaAnual * 100).toFixed(2)}% Anual`;
    };

    if (inputAhorroMonto) {
      inputAhorroMonto.addEventListener('input', (e) => {
        const raw = parseNumberFromFormatted(e.target.value);
        e.target.value = formatNumberWithCommas(raw);
        updateAhorro('input');
      });
      inputAhorroMonto.addEventListener('blur', (e) => {
        const raw = parseNumberFromFormatted(e.target.value);
        e.target.value = formatNumberWithCommas(raw || 1000);
        updateAhorro('input');
      });
    }

    if (inputAhorroMin) {
      inputAhorroMin.addEventListener('change', (e) => {
        const raw = parseNumberFromFormatted(e.target.value);
        e.target.value = formatNumberWithCommas(raw);
        updateAhorro('limits');
      });
    }

    if (inputAhorroMax) {
      inputAhorroMax.addEventListener('change', (e) => {
        const raw = parseNumberFromFormatted(e.target.value);
        e.target.value = formatNumberWithCommas(raw);
        updateAhorro('limits');
      });
    }

    if (rangeAhorroMonto) {
      rangeAhorroMonto.addEventListener('input', () => updateAhorro('slider'));
    }

    if (rangeAhorroPlazo) {
      rangeAhorroPlazo.addEventListener('input', () => updateAhorro('plazo'));
    }

    // Inicializar cálculos inmediatos
    updateCredito('init');
    updateAhorro('init');
  }
}

window.homeComponent = new HomeComponent();
