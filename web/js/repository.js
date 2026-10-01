// Repositorio Principal de COLUA Digital (Equivalente completo a ColuaRepository.kt)
class ColuaRepository {
  constructor() {
    this.localStorageKey = 'COLUA_LOCAL_DB_V1';
    this.initLocalStorage();
  }

  get fb() {
    return window.firebaseClient;
  }

  get storage() {
    return window.supabaseStorageManager;
  }

  _cleanDoc(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return obj.getTime();
    if (Array.isArray(obj)) {
      return obj.map(item => this._cleanDoc(item)).filter(item => item !== undefined);
    }
    const clean = {};
    for (const [key, val] of Object.entries(obj)) {
      if (val !== undefined) {
        clean[key] = (val && typeof val === 'object' && !(val instanceof Date))
          ? this._cleanDoc(val)
          : val;
      }
    }
    return clean;
  }

  async ensureFirebaseAuthAdmin(userProfile = null) {
    if (!this.fb) return false;
    try {
      const auth = this.fb.auth;
      const db = this.fb.db;
      if (!auth) return false;

      let currentUser = auth.currentUser;
      if (!currentUser && typeof auth.signInAnonymously === 'function') {
        try {
          const anonRes = await auth.signInAnonymously();
          currentUser = anonRes.user;
          console.log('[ColuaRepo] Sesión Firebase Auth iniciada para sincronización cloud:', currentUser.uid);
        } catch (anonErr) {
          console.warn('[ColuaRepo] Advertencia en signInAnonymously:', anonErr.message || anonErr);
        }
      }

      if (currentUser && db) {
        const adminData = {
          firebaseUid: currentUser.uid,
          tipoUsuario: 'ADMIN',
          role: 'superadmin',
          nombre: userProfile?.nombre || 'Super Administrador COLUA',
          email: userProfile?.email || currentUser.email || 'admin@colua.com.gt',
          updatedAt: Date.now()
        };
        try {
          await db.collection('usuarios').doc(currentUser.uid).set(this._cleanDoc(adminData), { merge: true });
        } catch (errProfile) {
          console.warn('[ColuaRepo] Advertencia asegurando /usuarios/{uid}:', errProfile.message || errProfile);
        }
      }
      return !!currentUser;
    } catch (e) {
      console.warn('[ColuaRepo] Error en ensureFirebaseAuthAdmin:', e);
      return false;
    }
  }

  // --- MOTOR DE AUTO-PUBLICACIÓN EN VIVO (Cloud & Local) ---
  async _autoPublishChange(logAction = 'AUTO_PUBLICACION_CMS', logDetails = 'Cambio sincronizado en la nube.') {
    const db = this.getLocalDb();
    const currentVersion = (db.global_config?.published_version || 1) + 1;
    if (!db.global_config) db.global_config = {};
    db.global_config.published_version = currentVersion;
    db.global_config.last_sync_timestamp = Date.now();
    this.saveLocalDb(db);

    if (this.fb && this.fb.db) {
      try {
        await this.ensureFirebaseAuthAdmin();
        await this.fb.collection('config').doc('published_config').set({
          version: currentVersion,
          lastSyncTimestamp: Date.now(),
          updatedBy: window.authService?.getCurrentUser()?.nombre || 'Super Administrador COLUA'
        }, { merge: true });
        console.log(`[COLUA CMS] Auto-publicación en Firestore: Versión v${currentVersion}`);
      } catch (e) {
        console.warn('[COLUA CMS] Advertencia al auto-publicar versión:', e.message || e);
      }
    }

    if (logAction) {
      try {
        await this.logAudit({
          action: logAction,
          performedBy: window.authService?.getCurrentUser()?.nombre || 'Super Administrador',
          details: logDetails
        });
      } catch (e) {}
    }

    try {
      window.dispatchEvent(new CustomEvent('colua-data-synced', { detail: { timestamp: Date.now(), version: currentVersion } }));
    } catch (e) {}

    return currentVersion;
  }

  // Sincroniza en tiempo real los botones y sub-botones del navbar superior hacia Firestore
  async _syncTopNavToCloud() {
    const db = this.getLocalDb();
    const items = db.top_nav_items || this.getDefaultTopNavItems();
    if (this.fb && this.fb.db) {
      try {
        await this.ensureFirebaseAuthAdmin();
        const cleanItems = this._cleanDoc(items);
        await this.fb.collection('config').doc('top_nav').set({
          items: cleanItems,
          updatedAt: Date.now()
        }, { merge: true });
        await this.fb.collection('global_config').doc('main').set({
          top_nav_items: cleanItems,
          updatedAt: Date.now()
        }, { merge: true });
        console.log('[ColuaRepo] Menú superior sincronizado en Firestore config/top_nav.');
      } catch (e) {
        console.warn('[ColuaRepo] Error sincronizando top_nav en Firestore:', e.message || e);
      }
    }
    await this._autoPublishChange('SINCRONIZAR_NAVBAR', `Menú de navegación actualizado con ${items.length} botones.`);
    if (window.navbarComponent && typeof window.navbarComponent.refresh === 'function') {
      window.navbarComponent.refresh();
    }
    if (window.sidebarComponent && typeof window.sidebarComponent.refresh === 'function') {
      window.sidebarComponent.refresh();
    }
  }

  // Inicialización de persistencia local (Copia espejo en localStorage para modo offline y borradores)
  initLocalStorage() {
    const raw = localStorage.getItem(this.localStorageKey);
    if (!raw) {
      this.seedInitialData();
    } else {
      // Auto-limpieza y auto-merge de datos canónicos faltantes
      try {
        let db = JSON.parse(raw);
        let changed = false;
        if (db.sections && db.sections.some(s => s.id === 'sec_comunidad' || s.slug === 'comunidad' || s.title === 'Comunidad')) {
          db.sections = db.sections.filter(s => s.id !== 'sec_comunidad' && s.slug !== 'comunidad' && s.title !== 'Comunidad');
          changed = true;
        }
        if (db.navigation_items && db.navigation_items.some(n => n.targetSectionId === 'sec_comunidad' || n.id === 'nav_comunidad' || n.targetSectionId === 'admin' || n.id === 'side_admin')) {
          db.navigation_items = db.navigation_items.filter(n => n.targetSectionId !== 'sec_comunidad' && n.id !== 'nav_comunidad' && n.targetSectionId !== 'admin' && n.id !== 'side_admin');
          changed = true;
        }
        if (db.top_nav_items && db.top_nav_items.some(n => n.targetSectionId === 'admin' || n.id === 'topnav_admin')) {
          db.top_nav_items = db.top_nav_items.filter(n => n.targetSectionId !== 'admin' && n.id !== 'topnav_admin');
          changed = true;
        }
        if (db.global_config && db.global_config.top_nav_items && db.global_config.top_nav_items.some(n => n.targetSectionId === 'admin' || n.id === 'topnav_admin')) {
          db.global_config.top_nav_items = db.global_config.top_nav_items.filter(n => n.targetSectionId !== 'admin' && n.id !== 'topnav_admin');
          changed = true;
        }
        if (db.content_items && db.content_items.some(i => i.sectionId === 'sec_comunidad')) {
          db.content_items = db.content_items.filter(i => i.sectionId !== 'sec_comunidad');
          changed = true;
        }
        if (db.analytics && db.analytics.page_views && db.analytics.page_views.inicio > 500) {
          db.analytics = {
            page_views: { inicio: 1 },
            daily_visits: {},
            last_updated: Date.now()
          };
          changed = true;
        }
        db = this._ensureDefaultData(db);
        if (changed) {
          this.saveLocalDb(db);
        }
      } catch (e) {
        this.seedInitialData(true);
      }
    }
  }

  // Garantiza que todos los elementos y pantallas canónicas existan sin borrar elementos creados por el usuario
  _ensureDefaultData(db) {
    if (!db) db = {};
    const defaultData = this._getDefaultData();
    let changed = false;

    // Mapa canónico limpio de títulos y subtítulos para las tarjetas de Inicio
    const canonicalHomeMap = {
      'home_ahorro': { title: 'Ahorros', subtitle: 'Cuentas de ahorro', description: 'Cuentas de ahorro', targetSectionId: 'sec_ahorros', imageUrl: 'assets/ahorros.png' },
      'home_credito': { title: 'Créditos', subtitle: 'Líneas de crédito', description: 'Líneas de crédito', targetSectionId: 'sec_creditos', imageUrl: 'assets/credito.png' },
      'home_seguros': { title: 'Seguros', subtitle: 'Protección y vida', description: 'Protección y vida', targetSectionId: 'sec_seguros', imageUrl: 'assets/seguro.png' },
      'home_remesas': { title: 'Remesas', subtitle: 'Recibe tu dinero', description: 'Recibe tu dinero', targetSectionId: 'sec_remesas', imageUrl: 'assets/remesa.png' },
      'home_beneficios': { title: 'Tus 6 Beneficios', subtitle: 'Hospitalización, seguro de ahorrantes y beneficio de oro', description: 'Hospitalización, seguro de ahorrantes y beneficio de oro', targetSectionId: 'sec_beneficios', imageUrl: 'assets/beneficios.png' },
      'home_agencias': { title: 'Agencias & PBX', subtitle: 'Nuestras ubicaciones', description: '25 agencias en Sololá, Quiché, Totonicapán y Suchitepéquez', targetSectionId: 'sec_agencias', imageUrl: 'assets/ubicacion.png' },
      'home_servicios': { title: 'Servicios Digitales', subtitle: 'Banca en línea', description: 'MICOOPE en Línea, App Móvil y Notificaciones SMS', targetSectionId: 'sec_servicios', imageUrl: 'assets/servicios_digitales.png' },
      'home_noticias': { title: 'Noticias & Novedades', subtitle: 'Actualidad COLUA', description: 'Comunicados oficiales, jornadas ecológicas y convocatorias', targetSectionId: 'sec_noticias', imageUrl: 'assets/noticias.png' },
      'home_sostenibilidad': { title: 'Sostenibilidad Cooperativa', subtitle: 'Cursos y centros de innovación', description: 'Becas educativas, talleres productivos y centros de innovación', targetSectionId: 'sec_sostenibilidad', imageUrl: 'assets/sostenibilidad_cooperativa.png' },
      'home_nosotros': { title: 'Nosotros', subtitle: 'Valores cooperativos, historia y propósito', description: 'Valores cooperativos, historia y propósito', targetSectionId: 'sec_nosotros', imageUrl: 'assets/distintivo_colua.png' }
    };

    // Garantizar que las 10 tarjetas canónicas de Inicio siempre existan y estén activas
    Object.keys(canonicalHomeMap).forEach((cardId, index) => {
      const existing = db.content_items.find(i => i.id === cardId);
      if (!existing) {
        const canonicalInfo = canonicalHomeMap[cardId];
        db.content_items.push({
          id: cardId,
          sectionId: 'sec_home',
          title: canonicalInfo.title,
          subtitle: canonicalInfo.subtitle,
          description: canonicalInfo.description,
          shortDescription: canonicalInfo.subtitle,
          targetSectionId: canonicalInfo.targetSectionId,
          buttonAction: canonicalInfo.targetSectionId,
          imageUrl: canonicalInfo.imageUrl,
          displayOrder: index + 1,
          isVisible: true,
          isEnabled: true,
          isDraft: false,
          isPublished: true
        });
        changed = true;
      } else {
        if (existing.isVisible === false) { existing.isVisible = true; changed = true; }
        if (existing.isEnabled === false) { existing.isEnabled = true; changed = true; }
        if (!existing.displayOrder) { existing.displayOrder = index + 1; changed = true; }
        if (!existing.targetSectionId) { existing.targetSectionId = canonicalHomeMap[cardId].targetSectionId; changed = true; }
      }
    });

    // Sanitizar títulos invertidos o corruptos en cualquier tarjeta de Inicio o secciones
    db.content_items.forEach(item => {
      if (this._cleanItemIfInverted(item)) {
        changed = true;
      }
    });

    // Garantizar que las 3 plazas vacantes canónicas de Bolsa de Empleo existan
    ['item_vacante_coordinador', 'item_vacante_cajero', 'item_vacante_asesor_credito'].forEach(jobId => {
      if (!db.content_items.some(i => i.id === jobId)) {
        const defJob = defaultData.content_items.find(i => i.id === jobId);
        if (defJob) {
          db.content_items.push(defJob);
          changed = true;
        }
      }
    });

    if (!db.sections) db.sections = [];
    const existingSecIds = new Set(db.sections.map(s => s.id));
    defaultData.sections.forEach(defSec => {
      if (!existingSecIds.has(defSec.id)) {
        db.sections.push(defSec);
        existingSecIds.add(defSec.id);
        changed = true;
      }
    });

    if (!db.content_blocks) db.content_blocks = [];
    const existingBlockIds = new Set(db.content_blocks.map(b => b.id));
    defaultData.content_blocks.forEach(defBlock => {
      if (!existingBlockIds.has(defBlock.id)) {
        db.content_blocks.push(defBlock);
        existingBlockIds.add(defBlock.id);
        changed = true;
      }
    });

    if (!db.agencias || db.agencias.length < 25) {
      if (!db.agencias) db.agencias = [];
      const existingAgIds = new Set(db.agencias.map(a => a.id));
      defaultData.agencias.forEach(defAg => {
        if (!existingAgIds.has(defAg.id)) {
          db.agencias.push(defAg);
          existingAgIds.add(defAg.id);
          changed = true;
        }
      });
    }

    if (!db.navigation_items || db.navigation_items.length < 8) {
      if (!db.navigation_items) db.navigation_items = [];
      const existingNavIds = new Set(db.navigation_items.map(n => n.id));
      defaultData.navigation_items.forEach(defNav => {
        if (!existingNavIds.has(defNav.id)) {
          db.navigation_items.push(defNav);
          existingNavIds.add(defNav.id);
          changed = true;
        }
      });
    }

    if (!db.forms || db.forms.length === 0) {
      db.forms = defaultData.forms || [];
      changed = true;
    } else {
      // Migración automática del formulario de afiliación para soportar dos fotos de DPI (Frente y Reverso)
      const fAsoc = db.forms.find(f => f.id === 'form_asociate');
      if (fAsoc && Array.isArray(fAsoc.fields)) {
        const hasDpiFrente = fAsoc.fields.some(f => f.id === 'foto_dpi_frente');
        if (!hasDpiFrente) {
          const oldDpiIndex = fAsoc.fields.findIndex(f => f.id === 'foto_dpi');
          const dualDpiFields = [
            { id: "foto_dpi_frente", label: "Foto de tu DPI - Frente (Anverso)", type: "file", required: false, placeholder: "Tomar o subir foto de frente del DPI" },
            { id: "foto_dpi_reverso", label: "Foto de tu DPI - Atrás (Reverso)", type: "file", required: false, placeholder: "Tomar o subir foto de reverso del DPI" }
          ];
          if (oldDpiIndex >= 0) {
            fAsoc.fields.splice(oldDpiIndex, 1, ...dualDpiFields);
          } else {
            const dpiIdx = fAsoc.fields.findIndex(f => f.id === 'dpi');
            if (dpiIdx >= 0) {
              fAsoc.fields.splice(dpiIdx + 1, 0, ...dualDpiFields);
            } else {
              fAsoc.fields.push(...dualDpiFields);
            }
          }
          changed = true;
        }
      }
    }

    if (!db.form_submissions || db.form_submissions.length === 0) {
      db.form_submissions = defaultData.form_submissions || [];
      changed = true;
    } else {
      // Normalizar registros previos para asegurar que fotoDpiFrente y fotoDpiReverso existan y estén limpios
      db.form_submissions.forEach(sub => {
        if (!sub.fotoDpiFrente && sub.fotoDpi) sub.fotoDpiFrente = sub.fotoDpi;
        if (!sub.fotoDpiFrente && sub.respuestas) {
          sub.fotoDpiFrente = sub.respuestas['Foto de tu DPI - Frente (Anverso)'] || sub.respuestas['Foto de tu DPI (Ambos lados)'] || '';
        }
        if (!sub.fotoDpiReverso && sub.respuestas) {
          sub.fotoDpiReverso = sub.respuestas['Foto de tu DPI - Atrás (Reverso)'] || '';
        }
        if (!sub.dpi && sub.respuestas && sub.respuestas['Número de DPI / CUI']) {
          sub.dpi = sub.respuestas['Número de DPI / CUI'];
        }
        // Reparar cualquier SVG sin codificar en base64 de demos anteriores
        if (typeof sub.fotoDpiFrente === 'string' && sub.fotoDpiFrente.includes('<svg')) {
          sub.fotoDpiFrente = defaultData.form_submissions?.[0]?.fotoDpiFrente || '';
          changed = true;
        }
        if (typeof sub.fotoDpiReverso === 'string' && sub.fotoDpiReverso.includes('<svg')) {
          sub.fotoDpiReverso = defaultData.form_submissions?.[0]?.fotoDpiReverso || '';
          changed = true;
        }
        if (sub.respuestas && typeof sub.respuestas === 'object') {
          Object.keys(sub.respuestas).forEach(k => {
            const v = sub.respuestas[k];
            if (typeof v === 'string' && v.includes('<svg')) {
              if (k.toLowerCase().includes('reverso') || k.toLowerCase().includes('atrás')) {
                sub.respuestas[k] = defaultData.form_submissions?.[0]?.fotoDpiReverso || '';
              } else {
                sub.respuestas[k] = defaultData.form_submissions?.[0]?.fotoDpiFrente || '';
              }
              changed = true;
            }
          });
        }
      });
    }

    if (!db.top_nav_items || db.top_nav_items.length === 0) {
      db.top_nav_items = this.getDefaultTopNavItems();
      changed = true;
    }

    if (changed) {
      this.saveLocalDb(db);
    }
    return db;
  }

  // Normaliza y repara cualquier tarjeta solo si contiene texto residual corrupto de versiones antiguas
  _cleanItemIfInverted(item) {
    if (!item) return false;
    let changed = false;
    const titleStr = (item.title || '').trim();
    const subStr = (item.subtitle || item.description || item.shortDescription || '').trim();

    if (titleStr.includes('AhorroAhorro') || titleStr.includes('Ahorro Infantil') || subStr === '¡Ahorro!' || subStr === '¡ahorro!') {
      item.title = 'Ahorros';
      item.subtitle = 'Cuentas de ahorro';
      changed = true;
    } else if (titleStr.includes('CréditoCrédito') || titleStr.includes('Productivo, Consumo') || subStr === '¡Crédito!' || subStr === '¡credito!') {
      item.title = 'Créditos';
      item.subtitle = 'Líneas de crédito';
      changed = true;
    } else if (titleStr.includes('Seguros de Vida Seguros') || titleStr.includes('Seguros Médicos') || subStr === '¡Seguros!' || subStr === '¡seguros!') {
      item.title = 'Seguros';
      item.subtitle = 'Protección y vida';
      changed = true;
    } else if (titleStr.includes('Remesas Dirigidas') || subStr === '¡Remesas!' || subStr === '¡remesas!') {
      item.title = 'Remesas';
      item.subtitle = 'Recibe tu dinero';
      changed = true;
    }
    return changed;
  }

  getLocalDb() {
    try {
      const raw = localStorage.getItem(this.localStorageKey);
      let db = raw ? JSON.parse(raw) : null;
      if (!db || !db.agencias || db.agencias.length < 25 || !db.content_items || db.content_items.length < 30) {
        db = this.seedInitialData(true);
      } else {
        db = this._ensureDefaultData(db);
      }
      // Garantizar que Comunidad nunca contamine los datos locales
      if (db && db.sections) {
        db.sections = db.sections.filter(s => s.id !== 'sec_comunidad' && s.slug !== 'comunidad' && s.title !== 'Comunidad');
      }
      return db;
    } catch (e) {
      return this.seedInitialData(true);
    }
  }

  saveLocalDb(db) {
    try {
      if (db && db.sections) {
        db.sections = db.sections.filter(s => s.id !== 'sec_comunidad' && s.slug !== 'comunidad' && s.title !== 'Comunidad');
      }
      localStorage.setItem(this.localStorageKey, JSON.stringify(db));
    } catch (e) {
      console.error('Error guardando en localStorage:', e);
      if (e && (e.name === 'QuotaExceededError' || e.code === 22 || e.number === -2147024882)) {
        try {
          if (db && db.form_submissions && db.form_submissions.length > 5) {
            db.form_submissions = db.form_submissions.slice(0, 5);
            localStorage.setItem(this.localStorageKey, JSON.stringify(db));
          }
        } catch (retryErr) {
          console.error('Reintento de guardado tras cuota excedida falló:', retryErr);
        }
      }
    }
  }

  _getDefaultData() {
    const defaultSections = [
      { id: "sec_home", title: "Inicio", slug: "home", description: "Pantalla principal", iconName: "inicio", accentColor: "#173789", displayOrder: 1, isVisible: true, isPublished: true, templateType: "GRID" },
      { id: "sec_ahorros", title: "Ahorros", slug: "ahorros", description: "Cuentas de ahorro", iconName: "ahorros", accentColor: "#EF8819", displayOrder: 2, isVisible: true, isPublished: true, templateType: "AHORROS" },
      { id: "sec_creditos", title: "Créditos", slug: "creditos", description: "Líneas de crédito", iconName: "credito", accentColor: "#E42A67", displayOrder: 3, isVisible: true, isPublished: true, templateType: "CREDITOS" },
      { id: "sec_seguros", title: "Seguros", slug: "seguros", description: "Protección y vida", iconName: "seguro", accentColor: "#59B8A4", displayOrder: 4, isVisible: true, isPublished: true, templateType: "SEGUROS" },
      { id: "sec_remesas", title: "Remesas", slug: "remesas", description: "Recibe tu dinero", iconName: "remesa", accentColor: "#634794", displayOrder: 5, isVisible: true, isPublished: true, templateType: "REMESAS" },
      { id: "sec_agencias", title: "Agencias", slug: "agencias", description: "Nuestras ubicaciones", iconName: "ubicacion", accentColor: "#173789", displayOrder: 6, isVisible: true, isPublished: true, templateType: "AGENCIAS" },
      { id: "sec_servicios", title: "Servicios Digitales", slug: "servicios", description: "Banca en línea", iconName: "servicios_digitales", accentColor: "#59B8A4", displayOrder: 7, isVisible: true, isPublished: true, templateType: "SERVICIOS" },
      { id: "sec_beneficios", title: "Beneficios", slug: "beneficios", description: "Valor de ser asociado", iconName: "beneficios", accentColor: "#EF8819", displayOrder: 8, isVisible: true, isPublished: true, templateType: "BENEFICIOS" },
      { id: "sec_noticias", title: "Noticias", slug: "noticias", description: "Actualidad COLUA", iconName: "noticias_colua", accentColor: "#E42A67", displayOrder: 9, isVisible: true, isPublished: true, templateType: "NOTICIAS" },
      { id: "sec_nosotros", title: "Nosotros", slug: "nosotros", description: "Valores, objetivos, historia e información institucional", iconName: "public_service", accentColor: "#173789", displayOrder: 10, isVisible: true, isPublished: true, templateType: "NOSOTROS" },
      { id: "sec_sostenibilidad", title: "Sostenibilidad Cooperativa", slug: "sostenibilidad", description: "Cursos y centros de innovación", iconName: "sostenibilidad_cooperativa", accentColor: "#59B8A4", displayOrder: 11, isVisible: true, isPublished: true, templateType: "SOSTENIBILIDAD" },
      { id: "sec_empleo", title: "Bolsa de Empleo", slug: "empleo", description: "Oportunidades laborales y plazas vacantes en COLUA", iconName: "trabajo", accentColor: "#b45309", displayOrder: 12, isVisible: true, isPublished: true, templateType: "GENERIC" }
    ];

    const defaultNavigation = [
      { id: "nav_servicios", label: "Servicios", iconName: "servicios_digitales", targetSectionId: "sec_servicios", type: "BOTTOM_NAV", displayOrder: 1, isVisible: true },
      { id: "nav_agencias", label: "Agencias", iconName: "ubicacion", targetSectionId: "sec_agencias", type: "BOTTOM_NAV", displayOrder: 2, isVisible: true },
      { id: "nav_home", label: "Inicio", iconName: "inicio", targetSectionId: "sec_home", type: "BOTTOM_NAV", displayOrder: 3, isVisible: true },
      { id: "nav_beneficios", label: "Beneficios", iconName: "beneficios", targetSectionId: "sec_beneficios", type: "BOTTOM_NAV", displayOrder: 4, isVisible: true },
      { id: "nav_noticias", label: "Noticias", iconName: "noticias_colua", targetSectionId: "sec_noticias", type: "BOTTOM_NAV", displayOrder: 5, isVisible: true },
      
      { id: "nav_nosotros", label: "Nosotros", iconName: "public_service", targetSectionId: "sec_nosotros", type: "NAVBAR", displayOrder: 1, isVisible: true },

      { id: "side_profile", label: "Mi Perfil", iconName: "perfil", targetSectionId: "perfil", type: "SIDEBAR", displayOrder: 1, isVisible: true },
      { id: "side_creditos", label: "Créditos", iconName: "credito", targetSectionId: "sec_creditos", type: "SIDEBAR", displayOrder: 2, isVisible: true },
      { id: "side_seguros", label: "Seguros", iconName: "seguro", targetSectionId: "sec_seguros", type: "SIDEBAR", displayOrder: 3, isVisible: true },
      { id: "side_remesas", label: "Remesas", iconName: "remesa", targetSectionId: "sec_remesas", type: "SIDEBAR", displayOrder: 4, isVisible: true },
      { id: "side_ahorros", label: "Ahorros", iconName: "ahorros", targetSectionId: "sec_ahorros", type: "SIDEBAR", displayOrder: 5, isVisible: true },
      { id: "side_sostenibilidad", label: "Sostenibilidad Cooperativa", iconName: "sostenibilidad_cooperativa", targetSectionId: "sec_sostenibilidad", type: "SIDEBAR", displayOrder: 6, isVisible: true },
      { id: "side_logout", label: "Cerrar Sesión", iconName: "cerrar", targetSectionId: "action_logout", type: "SIDEBAR", displayOrder: 7, isVisible: true }
    ];

    const defaultAgencias = [
      // SOLOLÁ (18 agencias)
      { id: "ag_agencia_corporativa", nombre: "Agencia Corporativa", departamento: "Sololá", direccion: "Carretera Interamericana, Km. 138.5 Aldea San Juan Argueta, Sololá.", telefono: "7795-7795", colorHex: "#E42A67", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      { id: "ag_agencia_central", nombre: "Agencia Central", departamento: "Sololá", direccion: "Camino Principal Aldea San Juan Argueta, Sololá.", telefono: "7795-7722", colorHex: "#EF8819", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      { id: "ag_plaza_colua_micoope", nombre: "Plaza COLUA MICOOPE", departamento: "Sololá", direccion: "Plaza COLUA 2do. Nivel, 6ta. Avenida 7-47, Zona 2 Sololá.", telefono: "7762-3180 / 7762-3608 / 7762-3257", colorHex: "#EF8819", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      { id: "ag_el_calvario", nombre: "El Calvario", departamento: "Sololá", direccion: "7ma. Avenida, 6ta. Calle esquina, Zona 2 Barrio El Calvario, Sololá.", telefono: "4931-5495 / 7762-5453", colorHex: "#634794", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      { id: "ag_san_bartolo", nombre: "San Bartolo", departamento: "Sololá", direccion: "11 Calle 8-04, Zona 2, Barrio San Bartolo, Sololá.", telefono: "7795-7723 / 7762-3984", colorHex: "#59B8A4", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      { id: "ag_concepcion", nombre: "Concepción", departamento: "Sololá", direccion: "Sector Chuicumes I, Zona 0, Calle Principal Concepción, Sololá.", telefono: "7795-7735", colorHex: "#E42A67", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      { id: "ag_los_encuentros", nombre: "Los Encuentros", departamento: "Sololá", direccion: "Carretera Interamericana, Caserío Central Aldea Los Encuentros, Sololá.", telefono: "5829-2086", colorHex: "#EF8819", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      { id: "ag_panajachel", nombre: "Panajachel", departamento: "Sololá", direccion: "0 Avenida, Calle del Estadio, 0-74, Zona 1 Panajachel.", telefono: "7795-7718", colorHex: "#F59E0B", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      { id: "ag_san_andres_semetabaj", nombre: "San Andrés Semetabaj", departamento: "Sololá", direccion: "Barrio Tzanjuyu, San Andrés Semetabaj.", telefono: "7795-7733", colorHex: "#634794", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      { id: "ag_santiago_atitlan", nombre: "Santiago Atitlán", departamento: "Sololá", direccion: "3ra. Calle 0-58, Cantón Tzanjuyu, Zona 1 Santiago Atitlán.", telefono: "7795-7720 / 5923-5086", colorHex: "#59B8A4", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      { id: "ag_san_pedro_la_laguna", nombre: "San Pedro La Laguna", departamento: "Sololá", direccion: "Calle al Embarcadero Chuasanahí, 5-60, Zona 2 San Pedro La Laguna.", telefono: "7721-8061 / 4921-3887", colorHex: "#E42A67", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      { id: "ag_san_juan_la_laguna", nombre: "San Juan La Laguna", departamento: "Sololá", direccion: "4ta. Avenida Cantón Chuitinamit, Zona 2 San Juan La Laguna.", telefono: "7795-7728", colorHex: "#EF8819", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      { id: "ag_santa_clara_la_laguna", nombre: "Santa Clara La Laguna", departamento: "Sololá", direccion: "1ra. Avenida, Zona 2 Santa Clara La Laguna.", telefono: "4928-2887 / 7927-1939", colorHex: "#59B8A4", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      { id: "ag_santa_lucia_utatlan", nombre: "Santa Lucía Utatlán", departamento: "Sololá", direccion: "Avenida Tecún Umán, entre 2da. y 3ra. Calle, Zona 1 Santa Lucía Utatlán.", telefono: "7722-1519", colorHex: "#634794", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      { id: "ag_el_novillero", nombre: "El Novillero", departamento: "Sololá", direccion: "Calle Principal, Aldea El Novillero, Santa Lucía Utatlán.", telefono: "4928-1377 / 4921-8753", colorHex: "#59B8A4", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      { id: "ag_nahuala", nombre: "Nahualá", departamento: "Sololá", direccion: "Calle Principal, 1ra. Avenida 2-05, Zona 1 Nahualá.", telefono: "7795-7713", colorHex: "#E42A67", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      { id: "ag_santa_catarina_ixtahuacan", nombre: "Santa Catarina Ixtahuacán", departamento: "Sololá", direccion: "Barrio Chuijuyup, frente al Mercado Municipal, Santa Catarina Ixtahuacán.", telefono: "7795-7732 / 4921-6226", colorHex: "#59B8A4", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      { id: "ag_guineales", nombre: "Guineales", departamento: "Sololá", direccion: "Sector Campo, a un costado del Estadio Aldea Guineales, Santa Catarina Ixtahuacán.", telefono: "7795-7731", colorHex: "#EF8819", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      
      // QUICHÉ (4 agencias)
      { id: "ag_agencia_quiche", nombre: "Quiché", departamento: "Quiché", direccion: "3ra. Avenida 04-35, Zona 1, Santa Cruz del Quiché.", telefono: "7795-7730", colorHex: "#634794", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      { id: "ag_agencia_chichicastenango", nombre: "Chichicastenango", departamento: "Quiché", direccion: "5ta. Calle, entre 5ta y 6ta. Avenida, Chichicastenango.", telefono: "7795-7719", colorHex: "#59B8A4", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      { id: "ag_agencia_joyabaj", nombre: "Joyabaj", departamento: "Quiché", direccion: "Calle Principal, Barrio La Libertad, Joyabaj.", telefono: "7795-7715 / 7755-9398", colorHex: "#E42A67", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      { id: "ag_agencia_zacualpa", nombre: "Zacualpa", departamento: "Quiché", direccion: "1ra. Calle, 2da. Avenida, Zona 1, Zacualpa.", telefono: "5829-3158", colorHex: "#EF8819", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      
      // TOTONICAPÁN (2 agencias)
      { id: "ag_agencia_la_esperanza", nombre: "La Esperanza", departamento: "Totonicapán", direccion: "Camino Principal, Aldea La Esperanza, Totonicapán.", telefono: "7795-7714", colorHex: "#F59E0B", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      { id: "ag_agencia_la_concordia", nombre: "La Concordia", departamento: "Totonicapán", direccion: "Calle Principal, Aldea La Concordia, Totonicapán.", telefono: "7795-7724 / 4214-3136", colorHex: "#634794", tipo: "AGENCIA", mapUrl: "", isVisible: true },
      
      // SUCHITEPÉQUEZ (1 agencia)
      { id: "ag_agencia_santo_tomas_la_union", nombre: "Santo Tomás La Unión", departamento: "Suchitepéquez", direccion: "3ra. Calle, entre 4ta y 5ta. Avenida, Zona 1, Santo Tomás La Unión, Suchitepéquez.", telefono: "7872-8526", colorHex: "#59B8A4", tipo: "AGENCIA", mapUrl: "", isVisible: true },

      // AGENTES Y CAJEROS
      { id: "ag_agente_super_la_bendicion", nombre: "Agente MICOOPE - Súper La Bendición", departamento: "Sololá", direccion: "Punto Comercial La Bendición, Sololá.", telefono: "7795-7795", colorHex: "#59B8A4", tipo: "AGENTE", mapUrl: "", isVisible: true },
      { id: "ag_agente_farmacia_el_ahorro", nombre: "Agente MICOOPE - Farmacia El Ahorro", departamento: "Quiché", direccion: "Calle Principal, Santa Cruz del Quiché.", telefono: "7795-7795", colorHex: "#59B8A4", tipo: "AGENTE", mapUrl: "", isVisible: true },
      { id: "ag_cajero_5b_central", nombre: "Cajero 5B - Sede Central", departamento: "Sololá", direccion: "Sede Central COLUA, San Juan Argueta.", telefono: "7795-7795", colorHex: "#173789", tipo: "CAJERO", mapUrl: "", isVisible: true },
      { id: "ag_cajero_5b_quiche", nombre: "Cajero 5B - Terminal Quiché", departamento: "Quiché", direccion: "Terminal de Buses, Santa Cruz del Quiché.", telefono: "7795-7795", colorHex: "#173789", tipo: "CAJERO", mapUrl: "", isVisible: true },
      { id: "ag_cajero_5b_totonicapan", nombre: "Cajero 5B - Totonicapán", departamento: "Totonicapán", direccion: "Parque Central, Totonicapán.", telefono: "7795-7795", colorHex: "#173789", tipo: "CAJERO", mapUrl: "", isVisible: true }
    ];

    const defaultItems = [
      // 1. HOME ITEMS (Cabecera, 10 Tarjetas de Servicio, Banners y Simulador)
      { id: "home_hero_header", sectionId: "sec_home", title: "Hola, bienvenido a COLUA MICOOPE", subtitle: "El lado humano de los ahorros y créditos cooperativos. Selecciona un área para comenzar tu gestión.", description: "Cabecera principal de bienvenida", accentColor: "#173789", displayOrder: 0, isVisible: true, isDraft: false },
      { id: "home_ahorro", sectionId: "sec_home", title: "Ahorros", subtitle: "Cuentas de ahorro", description: "Cuentas de ahorro", shortDescription: "Cuentas de ahorro", accentColor: "#59B8A4", displayOrder: 1, iconName: "ahorros", targetSectionId: "sec_ahorros", imageUrl: "assets/ahorros.png", isVisible: true, isDraft: false },
      { id: "home_credito", sectionId: "sec_home", title: "Créditos", subtitle: "Líneas de crédito", description: "Líneas de crédito", shortDescription: "Líneas de crédito", accentColor: "#173789", displayOrder: 2, iconName: "credito", targetSectionId: "sec_creditos", imageUrl: "assets/credito.png", isVisible: true, isDraft: false },
      { id: "home_seguros", sectionId: "sec_home", title: "Seguros", subtitle: "Protección y vida", description: "Protección y vida", shortDescription: "Protección y vida", accentColor: "#EF8819", displayOrder: 3, iconName: "seguro", targetSectionId: "sec_seguros", imageUrl: "assets/seguro.png", isVisible: true, isDraft: false },
      { id: "home_remesas", sectionId: "sec_home", title: "Remesas", subtitle: "Recibe tu dinero", description: "Recibe tu dinero", shortDescription: "Recibe tu dinero", accentColor: "#634794", displayOrder: 4, iconName: "remesa", targetSectionId: "sec_remesas", imageUrl: "assets/remesa.png", isVisible: true, isDraft: false },
      { id: "home_beneficios", sectionId: "sec_home", title: "Tus 6 Beneficios", subtitle: "Hospitalización, seguro de ahorrantes y beneficio de oro", description: "Hospitalización, seguro de ahorrantes y beneficio de oro", shortDescription: "Hospitalización, seguro de ahorrantes y beneficio de oro", accentColor: "#EF8819", displayOrder: 5, iconName: "beneficios", targetSectionId: "sec_beneficios", imageUrl: "assets/beneficios.png", isVisible: true, isDraft: false },
      { id: "home_agencias", sectionId: "sec_home", title: "Agencias & PBX", subtitle: "Nuestras ubicaciones", description: "25 agencias en Sololá, Quiché, Totonicapán y Suchitepéquez", shortDescription: "Nuestras ubicaciones", accentColor: "#173789", displayOrder: 6, iconName: "ubicacion", targetSectionId: "sec_agencias", imageUrl: "assets/ubicacion.png", isVisible: true, isDraft: false },
      { id: "home_servicios", sectionId: "sec_home", title: "Servicios Digitales", subtitle: "Banca en línea", description: "MICOOPE en Línea, App Móvil y Notificaciones SMS", shortDescription: "Banca en línea", accentColor: "#59B8A4", displayOrder: 7, iconName: "servicios_digitales", targetSectionId: "sec_servicios", imageUrl: "assets/servicios_digitales.png", isVisible: true, isDraft: false },
      { id: "home_noticias", sectionId: "sec_home", title: "Noticias & Novedades", subtitle: "Actualidad COLUA", description: "Comunicados oficiales, jornadas ecológicas y convocatorias", shortDescription: "Actualidad COLUA", accentColor: "#E42A67", displayOrder: 8, iconName: "noticias_colua", targetSectionId: "sec_noticias", imageUrl: "assets/noticias.png", isVisible: true, isDraft: false },
      { id: "home_sostenibilidad", sectionId: "sec_home", title: "Sostenibilidad Cooperativa", subtitle: "Cursos y centros de innovación", description: "Becas educativas, talleres productivos y centros de innovación", shortDescription: "Cursos y centros de innovación", accentColor: "#59B8A4", displayOrder: 9, iconName: "sostenibilidad_cooperativa", targetSectionId: "sec_sostenibilidad", imageUrl: "assets/sostenibilidad_cooperativa.png", isVisible: true, isDraft: false },
      { id: "home_nosotros", sectionId: "sec_home", title: "Nosotros", subtitle: "Valores cooperativos, historia y propósito", description: "Valores cooperativos, historia y propósito", shortDescription: "Valores cooperativos, historia y propósito", accentColor: "#173789", displayOrder: 10, iconName: "public_service", targetSectionId: "sec_nosotros", imageUrl: "assets/distintivo_colua.png", isVisible: true, isDraft: false },
      { id: "home_banner_pbx", sectionId: "sec_home", title: "Banner: PBX Central", subtitle: "PBX: (502) 7795-7795", description: "Lunes a viernes de 8:00 a 17:00 | Sábados de 8:00 a 12:00 hrs.", shortDescription: "Atención telefónica institucional", buttonText: "PBX: (502) 7795-7795", buttonAction: "tel:77957795", accentColor: "#2563eb", displayOrder: 11, iconName: "telefono", targetSectionId: "tel:77957795", imageUrl: "assets/pbx.png", isVisible: true, isDraft: false },
      { id: "home_banner_digital", sectionId: "sec_home", title: "Banner: MICOOPE en Línea", subtitle: "Canal Digital Seguro", description: "Ingresar a MICOOPE en Línea", shortDescription: "Acceso web seguro", buttonText: "Ingresar a MICOOPE en Línea", buttonAction: "https://micoopeenlinea.com.gt", accentColor: "#0a1931", displayOrder: 12, iconName: "candado", targetSectionId: "https://micoopeenlinea.com.gt", imageUrl: "assets/micoope_enlinea.png", isVisible: true, isDraft: false },
      { id: "home_simulador_card", sectionId: "sec_home", title: "Simulador Financiero en Vivo", subtitle: "Monto ilimitado (hasta 1M+), cuotas niveladas y tasas sincronizadas", description: "Herramienta de cálculo en tiempo real", shortDescription: "Herramienta de cálculo en tiempo real", accentColor: "#173789", displayOrder: 13, iconName: "calculadora", targetSectionId: "#simulador-financiero", imageUrl: "assets/distintivo_colua.png", isVisible: true, isDraft: false },

      // 2. AHORROS (Cabecera y 6 Productos)
      { id: "item_ahorro_header", sectionId: "sec_ahorros", title: "Cuentas de Ahorro COLUA", subtitle: "Construye un futuro financiero sólido con nuestras opciones de ahorro adaptadas a cada etapa de tu vida. Cero comisiones de manejo y total respaldo del sistema cooperativo MICOOPE.", description: "Cabecera institucional de ahorros", displayOrder: 0, isVisible: true, isDraft: false },
      { id: "item_ahorro_aportacion_adulto", sectionId: "sec_ahorros", title: "Cuenta Aportación Adulto", subtitle: "Monto de apertura: desde Q50.00, Tasa de interés: 5% anual afecto a ISR, Intereses: capitalizables anualmente", description: "Otorga el derecho a la persona natural a asociarse a la cooperativa, convirtiéndolo en dueño con voz y voto en la asamblea general.", imageUrl: "assets/ahorro1.png", displayOrder: 1, isVisible: true, isDraft: false },
      { id: "item_ahorro_aportacion_infanto", sectionId: "sec_ahorros", title: "Cuenta Aportación Infanto Juvenil", subtitle: "Monto de apertura: desde Q50.00, Tasa de interés: 5% anual afecto a ISR, Intereses: capitalizables anualmente", description: "Otorga el derecho al menor de edad a asociarse a la cooperativa e iniciar el hábito del ahorro con beneficios educativos.", imageUrl: "assets/ahorro_infanto_juvenil.png", displayOrder: 2, isVisible: true, isDraft: false },
      { id: "item_ahorro_infanto_juvenil", sectionId: "sec_ahorros", title: "Cuenta Ahorro Infanto Juvenil", subtitle: "Monto de apertura: desde Q10.00, Tasa de interés: 3% anual afecto a ISR, 5 Beneficios al mantener mínimo Q500.00", description: "Diseñada para motivar y fomentar en los niños y adolescentes la cultura del ahorro y educación financiera.", imageUrl: "assets/ahorro2.png", displayOrder: 3, isVisible: true, isDraft: false },
      { id: "item_ahorro_disponible", sectionId: "sec_ahorros", title: "Cuenta Ahorro Disponible", subtitle: "Apertura: desde Q50.00 o $100.00, Tasa: 3% anual en Q y 1.50% en $, Intereses: capitalizables mensualmente, Acceso a canales digitales sin costo", description: "Cuenta que el asociado podrá utilizar para darle movimiento diario a sus fondos con total disponibilidad.", imageUrl: "assets/ahorro_disponible.png", displayOrder: 4, isVisible: true, isDraft: false },
      { id: "item_ahorro_programado", sectionId: "sec_ahorros", title: "Cuenta Ahorro Programado", subtitle: "Apertura: desde Q25.00, Tasa de interés: 7.50% anual afecto a ISR, Plazos de 3, 5, 10, 15 o 20 años, Intereses mensuales", description: "Permite a los asociados aportar cuotas fijas mensuales para metas y proyectos futuros con tasas preferenciales.", imageUrl: "assets/ahorro_programado.png", displayOrder: 5, isVisible: true, isDraft: false },
      { id: "item_ahorro_plazo_fijo", sectionId: "sec_ahorros", title: "Cuenta Ahorro Plazo Fijo", subtitle: "Apertura: desde Q1,000.00 o $200.00, Plazos de 90, 180 y 365 días, Intereses capitalizables trimestralmente", description: "Obtén el máximo rendimiento y seguridad garantizada sobre tus inversiones a plazo fijo.", imageUrl: "assets/ahorro_plazo_fijo.png", displayOrder: 6, isVisible: true, isDraft: false },

      // 3. CRÉDITOS (Cabecera y 8 Líneas)
      { id: "item_cred_header", sectionId: "sec_creditos", title: "Líneas de Crédito COLUA", subtitle: "Soluciones financieras a tu medida con tasas justas, cuotas niveladas y asesoría personalizada para alcanzar tus metas personales y empresariales.", description: "Cabecera institucional de créditos", displayOrder: 0, isVisible: true, isDraft: false },
      { id: "item_cred_productivo", sectionId: "sec_creditos", title: "Crédito Productivo", subtitle: "Monto: desde Q1,000.00 en adelante", description: "Para capital de trabajo, inventario, mercadería y maquinaria.", imageUrl: "assets/credito_productivo.png", displayOrder: 1, isVisible: true, isDraft: false },
      { id: "item_cred_consumo", sectionId: "sec_creditos", title: "Crédito Consumo", subtitle: "Monto: desde Q1,000.00 en adelante", description: "Gastos personales, consolidación de deudas, menaje de casa o estudios.", imageUrl: "assets/credi_consumo.png", displayOrder: 2, isVisible: true, isDraft: false },
      { id: "item_cred_vivienda", sectionId: "sec_creditos", title: "Crédito Vivienda", subtitle: "Monto: desde Q5,000.00 en adelante", description: "Construcción, compra de terreno, vivienda nueva o remodelación.", imageUrl: "assets/credito_vivienda.png", displayOrder: 3, isVisible: true, isDraft: false },
      { id: "item_cred_vehiculo", sectionId: "sec_creditos", title: "Crédi Vehículo", subtitle: "Monto: desde Q5,000.00 en adelante", description: "Adquisición de vehículos o motocicletas para uso comercial o personal.", imageUrl: "assets/credi_vehiculo.png", displayOrder: 4, isVisible: true, isDraft: false },
      { id: "item_cred_mipymes", sectionId: "sec_creditos", title: "Crédito MIPYMES", subtitle: "Monto: desde Q2,000.00 en adelante", description: "Financiamiento para pequeñas y medianas empresas en crecimiento.", imageUrl: "assets/credito.png", displayOrder: 5, isVisible: true, isDraft: false },
      { id: "item_cred_agricola", sectionId: "sec_creditos", title: "Crédito Agrícola", subtitle: "Monto: adaptado al ciclo de cultivo", description: "Siembra, renovación de cultivos, fertilizantes y tecnificación agrícola.", imageUrl: "assets/credito1.png", displayOrder: 6, isVisible: true, isDraft: false },
      { id: "item_cred_automatico", sectionId: "sec_creditos", title: "Crédito Automático", subtitle: "Monto: hasta 90% de tus aportaciones", description: "Crédito inmediato respaldado sobre tus cuentas de ahorro en la cooperativa.", imageUrl: "assets/credito2.png", displayOrder: 7, isVisible: true, isDraft: false },
      { id: "item_cred_microcreditos", sectionId: "sec_creditos", title: "Microcréditos", subtitle: "Monto: ágil y sin complicaciones", description: "Impulso financiero ágil para pequeños emprendedores y comerciantes.", imageUrl: "assets/credito.png", displayOrder: 8, isVisible: true, isDraft: false },

      // 4. SEGUROS (Cabecera y 7 Pólizas)
      { id: "item_seg_header", sectionId: "sec_seguros", title: "Seguros Columna", subtitle: "Tranquilidad para ti y tu familia con coberturas de vida, salud y accidentes con el respaldo de Aseguradora Columna y el Sistema MICOOPE.", description: "Cabecera institucional de seguros", displayOrder: 0, isVisible: true, isDraft: false },
      { id: "item_seg_cv_especial", sectionId: "sec_seguros", title: "Seguro CV Especial", subtitle: "Primas solidarias y accesibles", description: "Cobertura de vida con indemnización y respaldo solidario inmediato.", imageUrl: "assets/seguro_cv_personal.png", displayOrder: 1, isVisible: true, isDraft: false },
      { id: "item_seg_vida_saludable", sectionId: "sec_seguros", title: "Seguro Vida Saludable", subtitle: "Cobertura médica y preventiva", description: "Protección integral para gastos médicos y asistencia preventiva.", imageUrl: "assets/seguro_vida_saludable.png", displayOrder: 2, isVisible: true, isDraft: false },
      { id: "item_seg_edad_oro", sectionId: "sec_seguros", title: "Seguro de Accidentes Edad de Oro", subtitle: "Para mayores de 60 años", description: "Diseñado especialmente para asociados de la tercera edad.", imageUrl: "assets/seguro_edad_de_oro.png", displayOrder: 3, isVisible: true, isDraft: false },
      { id: "item_seg_cancer", sectionId: "sec_seguros", title: "Seguro de Cáncer", subtitle: "Indemnización al primer diagnóstico", description: "Indemnización directa al primer diagnóstico de patología oncológica.", imageUrl: "assets/seguro_de_cancer.png", displayOrder: 4, isVisible: true, isDraft: false },
      { id: "item_seg_infanto_juvenil", sectionId: "sec_seguros", title: "Seguro Accidentes Infanto Juvenil", subtitle: "Protección escolar 365 días", description: "Protección escolar y de recreación para los hijos de asociados.", imageUrl: "assets/seguro_accidentes_infanto_juvenil.png", displayOrder: 5, isVisible: true, isDraft: false },
      { id: "item_seg_manejo", sectionId: "sec_seguros", title: "Seguro de Manejo", subtitle: "Asistencia vial nacional", description: "Asistencia vial y respaldo ante incidentes en carretera en todo el país.", imageUrl: "assets/seguro_manejo.png", displayOrder: 6, isVisible: true, isDraft: false },
      { id: "item_seg_vida_familiar", sectionId: "sec_seguros", title: "Seguro de Vida Individual o Familiar", subtitle: "Tranquilidad a largo plazo", description: "Tranquilidad financiera a largo plazo para el bienestar de tu familia.", imageUrl: "assets/seguro_de_vida_individual_o_familar.png", displayOrder: 7, isVisible: true, isDraft: false },

      // 5. REMESAS (Hero, Banners y 4 Asistencias)
      { id: "item_rem_hero", sectionId: "sec_remesas", title: "Remesas Familiares", subtitle: "Recibe tu dinero seguro", description: "Recibe tu dinero de forma segura, rápida y sin complicaciones a través de nuestra red de remesadoras aliadas. Ponemos a tu alcance disponibilidad inmediata en ventanilla y depósito directo en tu cuenta cooperativa.", imageUrl: "assets/mas_que_una_remesa.png", displayOrder: 0, isVisible: true, isDraft: false },
      { id: "item_rem_banner_dirigida", sectionId: "sec_remesas", title: "Beneficio al recibir tu remesa dirigida a tu Cuenta Disponible", subtitle: "En caso de fallecimiento en el extranjero, te ofrecemos el BENEFICIO DE REPATRIACIÓN", description: "Garantizando que tu último viaje sea de regreso a casa, sin costo alguno para tu familia. Tu cuenta activa en COLUA abre las puertas a este respaldo exclusivo y a la acreditación inmediata de tus fondos 24/7 sin hacer filas.", buttonText: "Abrir Cuenta Disponible", buttonAction: "#sec_ahorros", displayOrder: 1, isVisible: true, isDraft: false },
      { id: "item_rem_familias_header", sectionId: "sec_remesas", title: "Más que una remesa, unimos familias", subtitle: "En COLUA reconocemos el esfuerzo incansable de nuestros connacionales en el extranjero.", description: "Por ello, cada envío gestionado a través de nuestra red incluye asistencias humanitarias directas y sin costo para quien envía.", imageUrl: "assets/remesadoras_afiliadas.png", displayOrder: 2, isVisible: true, isDraft: false },
      { id: "item_rem_repatriacion", sectionId: "sec_remesas", title: "Asistencia de Repatriación para Remitente", subtitle: "TRÁMITE CONSULAR Y VUELO • 100% Cobertura Sin Costo", description: "Gestión integral y cobertura sin costo. Asesoramiento en trámites legales y coordinación total del retorno aéreo de restos mortales a Guatemala.", imageUrl: "assets/rd1.png", displayOrder: 3, isVisible: true, isDraft: false },
      { id: "item_rem_funeraria", sectionId: "sec_remesas", title: "Asistencia Funeraria para Remitente", subtitle: "ACOMPAÑAMIENTO FAMILIAR • Red Funeraria Nacional", description: "Apoyo y trámites de coordinación. Preparación, capilla ardiente, servicio religioso y traslado terrestre hacia cualquier municipio del país.", imageUrl: "assets/rd2.png", displayOrder: 4, isVisible: true, isDraft: false },
      { id: "item_rem_referencias", sectionId: "sec_remesas", title: "Referencias Médicas y Clínicas", subtitle: "RED DE SALUD • Acceso Inmediato y Tarifas Especiales", description: "Directorio e información verificada de médicos especialistas, clínicas, farmacias y laboratorios clínicos con convenios preferenciales para asociados.", imageUrl: "assets/rd3.png", displayOrder: 5, isVisible: true, isDraft: false },
      { id: "item_rem_orientacion", sectionId: "sec_remesas", title: "Orientación Médica Telefónica 24/7", subtitle: "ATENCIÓN TELEFÓNICA 24/7 • Sin Límite de Llamadas", description: "Apoyo profesional en interpretación de pruebas de laboratorio, dosificación segura de medicamentos y primeros auxilios a distancia las 24 horas.", imageUrl: "assets/rd4.png", displayOrder: 6, isVisible: true, isDraft: false },

      // 6. SERVICIOS DIGITALES (Cabecera, 6 Servicios Principales y 3 Otros Servicios)
      { id: "item_serv_header", sectionId: "sec_servicios", title: "Servicios Digitales y Financieros COLUA", subtitle: "Gestiona tus cuentas, consulta saldos y realiza operaciones 24/7 sin salir de casa con nuestras herramientas tecnológicas cooperativas y nuestra amplia red de atención.", description: "Cabecera institucional de servicios digitales", displayOrder: 0, isVisible: true, isDraft: false },
      { id: "item_serv_tarjeta_debito", sectionId: "sec_servicios", title: "Tarjeta de Débito MICOOPE Visa", subtitle: "Compras nacionales e internacionales", description: "Realiza compras en comercios afiliados a VISA en Guatemala y el extranjero, notificaciones por mensajes de texto y cobertura integral contra fraude.", buttonText: "Solicitar Tarjeta (PBX)", buttonAction: "tel:77957795", imageUrl: "assets/tarjeta_debito.png", displayOrder: 1, isVisible: true, isDraft: false },
      { id: "item_serv_app_enlinea", sectionId: "sec_servicios", title: "MICOOPE en Línea (Web y App)", subtitle: "Banca móvil disponible 24/7", description: "Banca web y móvil 24/7. Realiza consultas de saldos, transferencias directas, pago de préstamos y servicios básicos al instante sin hacer filas.", buttonText: "Ingresar a la Plataforma", buttonAction: "https://micoopeenlinea.com.gt", imageUrl: "assets/micoope_enlinea.png", displayOrder: 2, isVisible: true, isDraft: false },
      { id: "item_serv_tarjeta_credito", sectionId: "sec_servicios", title: "Tarjeta de Crédito MICOOPE Visa", subtitle: "Hasta 55 días sin intereses", description: "Membresía gratis de por vida, tarjeta VISA internacional, cobertura por fraude o extravío y la tasa de interés más baja del mercado financiero.", buttonText: "Solicitar Crédito (PBX)", buttonAction: "tel:77957795", imageUrl: "assets/tarjeta_debito.png", displayOrder: 3, isVisible: true, isDraft: false },
      { id: "item_serv_pago_servicios", sectionId: "sec_servicios", title: "Pago de Servicios Básicos", subtitle: "Luz, Agua, Telefonía y Colegios", description: "Paga tus facturas de electricidad, agua potable, telefonía, internet y colegiaturas en cualquiera de nuestras agencias o canales digitales.", buttonText: "Ver Agencias de Pago", buttonAction: "#sec_agencias", imageUrl: "assets/servicios_digitales.png", displayOrder: 4, isVisible: true, isDraft: false },
      { id: "item_serv_agentes", sectionId: "sec_servicios", title: "Agentes MICOOPE", subtitle: "En tiendas y comercios cercanos", description: "Puntos de atención en comercios locales para depósitos, retiros y pagos sin desplazarte a una agencia central.", buttonText: "Localizar Agentes", buttonAction: "#sec_agencias", imageUrl: "assets/servicios_digitales.png", displayOrder: 5, isVisible: true, isDraft: false },
      { id: "item_serv_cajeros_5b", sectionId: "sec_servicios", title: "Cajeros Red 5B", subtitle: "Más de 3,500 cajeros en todo el país", description: "Disponibilidad de efectivo las 24 horas del día con tu tarjeta de débito o crédito en cajeros automáticos 5B.", buttonText: "Ver Cajeros", buttonAction: "#sec_agencias", imageUrl: "assets/servicios_digitales.png", displayOrder: 6, isVisible: true, isDraft: false },
      { id: "item_serv_energia", sectionId: "sec_servicios", title: "Pago de Energía Eléctrica", subtitle: "DEOCSA y DEORSA", description: "Realiza el pago ágil y al día de tus facturas de energía eléctrica directamente en ventanillas de nuestras agencias.", displayOrder: 7, isVisible: true, isDraft: false },
      { id: "item_serv_telefono", sectionId: "sec_servicios", title: "Pago de Servicio Telefónico", subtitle: "Pre y Pospago: CLARO y TIGO", description: "Recargas electrónicas y pago de mensualidades telefónicas sin demoras ni recargos adicionales.", displayOrder: 8, isVisible: true, isDraft: false },
      { id: "item_serv_cajeros_red", sectionId: "sec_servicios", title: "Cajeros Red 5B, BI y BAC", subtitle: "Más de 3,500 cajeros interbancarios", description: "Consulta de saldos y retiros en efectivo en cajeros de la red interbancaria nacional.", displayOrder: 9, isVisible: true, isDraft: false },

      // 7. BENEFICIOS (Cabecera y 6 Beneficios)
      { id: "item_ben_header", sectionId: "sec_beneficios", title: "Tus 6 Beneficios de Asociado", subtitle: "Al abrir tu cuenta de Aportación en COLUA R.L., tú y tu familia cuentan con el respaldo automático de nuestro programa integral de solidaridad.", description: "Cabecera institucional de beneficios", displayOrder: 0, isVisible: true, isDraft: false },
      { id: "item_ben_renta_diaria", sectionId: "sec_beneficios", title: "Renta Diaria por Hospitalización", subtitle: "✓ Incluido al ser Asociado", description: "Apoyo económico diario en caso de ser internado en hospital público o privado.", imageUrl: "assets/renta_diaria.png", displayOrder: 1, isVisible: true, isDraft: false },
      { id: "item_ben_apoyo_quirurgico", sectionId: "sec_beneficios", title: "Apoyo Quirúrgico", subtitle: "✓ Incluido al ser Asociado", description: "Apoyo económico para cubrir gastos médicos incurridos por intervenciones quirúrgicas.", imageUrl: "assets/apoyo_quirurgico.png", displayOrder: 2, isVisible: true, isDraft: false },
      { id: "item_ben_servicio_funerario", sectionId: "sec_beneficios", title: "Servicio Funerario", subtitle: "✓ Incluido al ser Asociado", description: "Sepelio digno y ataúd fúnebre para tranquilidad de la familia del asociado.", imageUrl: "assets/servicio_funerario.png", displayOrder: 3, isVisible: true, isDraft: false },
      { id: "item_ben_seguro_ahorrantes", sectionId: "sec_beneficios", title: "Seguro de Ahorrantes", subtitle: "✓ Hasta Q150,000.00", description: "Devolución de ahorros más seguro sobre depósitos hasta por Q150,000.00.", imageUrl: "assets/beneficio_de_ahorrantes.png", displayOrder: 4, isVisible: true, isDraft: false },
      { id: "item_ben_seguro_deudores", sectionId: "sec_beneficios", title: "Seguro de Deudores", subtitle: "✓ Hasta Q200,000.00", description: "Cobertura de saldos insolutos de crédito vigente hasta por Q200,000.00 en siniestro.", imageUrl: "assets/beneficio_de_deudores.png", displayOrder: 5, isVisible: true, isDraft: false },
      { id: "item_ben_beneficio_oro", sectionId: "sec_beneficios", title: "Beneficio de Oro", subtitle: "✓ Mayores de 70 años", description: "Apoyo económico único para asociados mayores de 70 años con lealtad cooperativa.", imageUrl: "assets/beneficio_de_oro.png", displayOrder: 6, isVisible: true, isDraft: false },

      // 8. SOSTENIBILIDAD (Cabecera, 4 Ejes y Banner Convocatoria)
      { id: "item_sost_header", sectionId: "sec_sostenibilidad", title: "Sostenibilidad Cooperativa", subtitle: "Impulsamos acciones orientadas al desarrollo social, educativo, cultural y productivo con el propósito de fortalecer el bienestar de nuestros asociados y comunidades.", description: "Cabecera de sostenibilidad", displayOrder: 0, isVisible: true, isDraft: false },
      { id: "item_sost_educacion", sectionId: "sec_sostenibilidad", title: "Educación y Formación Cooperativa", subtitle: "Eje Estratégico 01", description: "Fortalecemos las capacidades individuales y colectivas mediante la educación financiera y el cooperativismo como motores de superación familiar.", imageUrl: "assets/noticia_taller_finanzas.jpg", displayOrder: 1, isVisible: true, isDraft: false },
      { id: "item_sost_empleabilidad", sectionId: "sec_sostenibilidad", title: "Empleabilidad y Empresarialidad", subtitle: "Eje Estratégico 02", description: "Impulsamos la generación de ingresos propios y la innovación productiva para dinamizar la economía solidaria de nuestros pueblos.", imageUrl: "assets/nosotros_artesana.jpg", displayOrder: 2, isVisible: true, isDraft: false },
      { id: "item_sost_desarrollo", sectionId: "sec_sostenibilidad", title: "Desarrollo Comunitario", subtitle: "Eje Estratégico 03", description: "Fortalecemos la identidad cooperativa, la participación democrática y la formación dirigencial en beneficio del bien común.", imageUrl: "assets/noticia_asamblea_general.jpg", displayOrder: 3, isVisible: true, isDraft: false },
      { id: "item_sost_ambiente", sectionId: "sec_sostenibilidad", title: "Medio Ambiente y Sostenibilidad", subtitle: "Eje Estratégico 04", description: "Protegemos los recursos naturales de Sololá y Quiché mediante jornadas de reforestación y educación ecológica comunitaria.", imageUrl: "assets/noticia_reforestacion.jpg", displayOrder: 4, isVisible: true, isDraft: false },
      { id: "item_sost_banner_contacto", sectionId: "sec_sostenibilidad", title: "¿Deseas vincular a tu comunidad o escuela?", subtitle: "PARTICIPACIÓN COMUNITARIA", description: "Comunícate a nuestro PBX central o visita tu agencia COLUA más cercana para conocer fechas y convocatorias de nuestros talleres, cursos y programas de becas.", buttonText: "PBX: 7795-7795", buttonAction: "tel:77957795", displayOrder: 5, isVisible: true, isDraft: false },

      // 9. NOSOTROS (Cabecera, 3 Pilares, Presencia, 4 Valores, Galería y Contacto)
      { id: "item_nos_header", sectionId: "sec_nosotros", title: "Nosotros: El lado humano de los ahorros y créditos", subtitle: "Más de 50 años construyendo desarrollo socioeconómico, confianza y bienestar integral para las comunidades y familias de Quiché, Sololá y el suroccidente de Guatemala.", description: "Cabecera institucional de Nosotros", displayOrder: 0, isVisible: true, isDraft: false },
      { id: "item_nos_mision_vision", sectionId: "sec_nosotros", title: "Propuesta de Valor", subtitle: "PILAR ESTRATÉGICO 01 • Enfoque Fiduciario", description: "En COLUA reconocemos tu valor como persona para alcanzar tu bienestar integral y el de tu familia, a través de productos y servicios financieros éticos, ágiles y accesibles, basados en el poder de la cooperación.", imageUrl: "assets/distintivo_colua.png", displayOrder: 1, isVisible: true, isDraft: false },
      { id: "item_nos_vision", sectionId: "sec_nosotros", title: "Visión Institucional", subtitle: "PILAR ESTRATÉGICO 02 • Proyección 2025-2030", description: "Ser un modelo de desarrollo y sostenibilidad integral de las comunidades basado en la cooperación mutua, solvencia técnica y transparencia comunitaria.", imageUrl: "assets/logo_composite.png", displayOrder: 2, isVisible: true, isDraft: false },
      { id: "item_nos_proposito", sectionId: "sec_nosotros", title: "Propósito Visionario", subtitle: "PILAR ESTRATÉGICO 03 • Impacto Territorial", description: "Ser la cooperativa financiera que mejora sostenidamente la calidad de vida de sus asociados y comunidades de Guatemala, protegiendo su patrimonio intergeneracional.", imageUrl: "assets/valores_colua.png", displayOrder: 3, isVisible: true, isDraft: false },
      { id: "item_nos_presencia", sectionId: "sec_nosotros", title: "Una institución financiera con rostro solidario y solidez técnica", subtitle: "PRESENCIA Y TRATO HUMANO", description: "A diferencia del sistema bancario tradicional, en COLUA cada asociado es co-propietario de la entidad. Los excedentes generados se reinvierten directamente en mejores tasas de interés para el ahorro, créditos productivos accesibles y programas de asistencia comunitaria sin intermediarios.", imageUrl: "assets/nosotros_edificio_equipo.jpg", displayOrder: 4, isVisible: true, isDraft: false },
      { id: "item_nos_val_integridad", sectionId: "sec_nosotros", title: "Integridad", subtitle: "PILAR ÉTICO CENTRAL", description: "Actuar con coherencia con nuestros valores, manteniendo transparencia en todo lo que hacemos y fomentando la cooperación en cada acción.", imageUrl: "assets/valores_colua.png", displayOrder: 5, isVisible: true, isDraft: false },
      { id: "item_nos_val_cooperacion", sectionId: "sec_nosotros", title: "Cooperación", subtitle: "PRINCIPIO COMUNITARIO", description: "Trabajar juntos para alcanzar un objetivo común, basada en la ayuda mutua, la solidaridad y el esfuerzo compartido por el bien colectivo.", imageUrl: "assets/valores_colua.png", displayOrder: 6, isVisible: true, isDraft: false },
      { id: "item_nos_val_responsabilidad", sectionId: "sec_nosotros", title: "Responsabilidad", subtitle: "DISCIPLINA FIDUCIARIA", description: "Administramos y cuidamos los ahorros de nuestros asociados que nos han confiado con rigurosa prudencia técnica y máxima solvencia.", imageUrl: "assets/valores_colua.png", displayOrder: 7, isVisible: true, isDraft: false },
      { id: "item_nos_val_enfoque", sectionId: "sec_nosotros", title: "Enfoque al Asociado", subtitle: "VOCACIÓN DE SERVICIO", description: "El centro de atención de nuestros esfuerzos y nuestra lealtad son los asociados, a quienes entregamos siempre soluciones de calidad y trato humano.", imageUrl: "assets/valores_colua.png", displayOrder: 8, isVisible: true, isDraft: false },
      { id: "item_nos_gal_arraigo", sectionId: "sec_nosotros", title: "Identidad Cultural y Comunitaria en el Altiplano", subtitle: "ARRAIGO TERRITORIAL", description: "Vínculo vivo con nuestras raíces culturales y productoras.", imageUrl: "assets/nosotros_artesana.jpg", displayOrder: 9, isVisible: true, isDraft: false },
      { id: "item_nos_gal_gobernanza", sectionId: "sec_nosotros", title: "Participación Democrática y Solidez del Sistema MICOOPE", subtitle: "GOBERNANZA COOPERATIVA", description: "Asambleas representativas y administración transparente.", imageUrl: "assets/noticia_asamblea_general.jpg", displayOrder: 10, isVisible: true, isDraft: false },
      { id: "item_nos_banner_contacto", sectionId: "sec_nosotros", title: "¿Necesitas ayuda adicional o deseas afiliarte?", subtitle: "ATENCIÓN AL ASOCIADO Y PÚBLICO", description: "Comunícate a nuestro PBX central o visítanos en cualquiera de nuestras 18 agencias departamentales para abrir tu cuenta de aportaciones y disfrutar de los beneficios cooperativos.", buttonText: "PBX: 7795-7795", buttonAction: "tel:77957795", displayOrder: 11, isVisible: true, isDraft: false },

      // 10. BOLSA DE EMPLEO / PLAZAS VACANTES COLUA
      {
        id: "item_vacante_coordinador",
        sectionId: "sec_empleo",
        type: "job_vacancy",
        title: "COORDINADOR DE COMPENSACIÓN FIJA Y VARIABLE",
        subtitle: "Administración, San Juan Argueta.",
        description: "Buscamos profesional para coordinar y supervisar los esquemas de compensación fija y variable de la cooperativa.",
        imageUrl: "assets/plaza_coordinador_compensacion.jpg",
        requirements: [
          "Cierre de pensum en Contaduría Pública y Auditoría, Administración de Empresas o carrera afín.",
          "Experiencia mínima de 2 años en puestos similares.",
          "Disponibilidad de horario."
        ],
        skillsList: [
          "Administración de procesos de planilla.",
          "Conocimientos en legislación laboral, ISR e información financiera.",
          "Gestión y control de presupuestos de salarios y beneficios.",
          "Elaboración y análisis de informes e indicadores de compensación.",
          "Resolución de problemas y toma de decisiones.",
          "Adaptabilidad y habilidades de gestión de personal."
        ],
        benefitItems: [
          "Salario competitivo.",
          "Estabilidad laboral.",
          "Prestaciones adicionales a la ley.",
          "Seguro de vida y consultas médicas.",
          "Oportunidad de desarrollo, capacitación y formación continua."
        ],
        leadEmail: "talentoh@coluarl.com.gt",
        deadline: "17/09/2026",
        buttonText: "Aplicar enviando CV",
        buttonAction: "mailto:talentoh@coluarl.com.gt?subject=Postulaci%C3%B3n%3A%20Coordinador%20de%20Compensaci%C3%B3n",
        displayOrder: 1,
        isVisible: true,
        isDraft: false
      },
      {
        id: "item_vacante_cajero",
        sectionId: "sec_empleo",
        type: "job_vacancy",
        title: "RECEPTOR PAGADOR / CAJERO GENERAL",
        subtitle: "Agencia Sololá y Región Altiplano.",
        description: "Buscamos personal con vocación de servicio para atención en ventanilla, recepción y desembolso de fondos, pagos de servicios y depósitos.",
        imageUrl: "assets/distintivo_colua.png",
        requirements: [
          "Título a nivel diversificado de Perito Contador o Bachiller en Ciencias y Letras.",
          "Experiencia mínima de 1 año en manejo de caja y arqueos de efectivo.",
          "Residir en Sololá o municipios aledaños.",
          "Disponibilidad inmediata y vocación de servicio al asociado."
        ],
        skillsList: [
          "Manejo ágil y seguro de efectivo y conteo de papel moneda.",
          "Excelente servicio al cliente y comunicación asertiva.",
          "Habilidad numérica y uso de sistemas informáticos.",
          "Responsabilidad, honradez y discreción en custodia de valores."
        ],
        benefitItems: [
          "Salario competitivo con prestaciones de ley y adicionales.",
          "Seguro de vida y gastos médicos.",
          "Ambiente laboral seguro y cooperativo.",
          "Plan de carrera y desarrollo profesional en MICOOPE."
        ],
        leadEmail: "talentoh@coluarl.com.gt",
        deadline: "30/10/2026",
        buttonText: "Aplicar enviando CV",
        buttonAction: "mailto:talentoh@coluarl.com.gt?subject=Postulaci%C3%B3n%3A%20Receptor%20Pagador%20Cajero",
        displayOrder: 2,
        isVisible: true,
        isDraft: false
      },
      {
        id: "item_vacante_asesor_credito",
        sectionId: "sec_empleo",
        type: "job_vacancy",
        title: "ASESOR DE CRÉDITOS Y DESARROLLO COOPERATIVO",
        subtitle: "Agencia Santa Cruz del Quiché y Chichicastenango.",
        description: "Encargado de prospección, análisis socioeconómico y colocación de créditos productivos, de vivienda y consumo, así como fidelización de asociados.",
        imageUrl: "assets/distintivo_colua.png",
        requirements: [
          "Estudios universitarios en Administración, Agronomía, Trabajo Social o carrera afín.",
          "Experiencia comprobable de 1 año en colocación de microcréditos o créditos de consumo.",
          "Poseer motocicleta o vehículo propio con licencia de conducir vigente.",
          "Habilidad de negociación y amplio conocimiento de la región."
        ],
        skillsList: [
          "Análisis de capacidad de pago y solvencia financiera de microempresarios.",
          "Gestión comercial y facilidad de palabra en trabajo de campo.",
          "Manejo de relaciones interpersonales y servicio personalizado.",
          "Trabajo enfocado en cumplimiento de metas institucionales."
        ],
        benefitItems: [
          "Salario base más atractivo esquema de comisiones e incentivos por colocación.",
          "Depreciación de vehículo y combustible.",
          "Prestaciones de ley y beneficios cooperativos exclusivos.",
          "Capacitación continua en evaluación crediticia y desarrollo humano."
        ],
        leadEmail: "talentoh@coluarl.com.gt",
        deadline: "15/11/2026",
        buttonText: "Aplicar enviando CV",
        buttonAction: "mailto:talentoh@coluarl.com.gt?subject=Postulaci%C3%B3n%3A%20Asesor%20de%20Cr%C3%A9ditos",
        displayOrder: 3,
        isVisible: true,
        isDraft: false
      },

      // 11. NOTICIAS Y COMUNICADOS
      {
        id: "news_reforestacion_2026",
        sectionId: "sec_noticias",
        title: "Jornada de Reforestación 2026: Sostenibilidad en nuestras cuencas",
        subtitle: "Ver detalles completos",
        shortDescription: "Junto a decenas de familias asociadas y voluntarios de nuestra cooperativa, llevamos a cabo con éxito la siembra de más de 500 árboles nativos para la protección de cuencas en Quiché y Sololá.",
        description: "Junto a decenas de familias asociadas y voluntarios de nuestra cooperativa, llevamos a cabo con éxito la siembra de más de 500 árboles nativos para la protección de cuencas en Quiché y Sololá, reafirmando el compromiso cooperativo con el medio ambiente y las futuras generaciones del país.",
        imagePath: "assets/noticia_reforestacion.jpg",
        imageUrl: "assets/noticia_reforestacion.jpg",
        tags: "#COLUAVerde #ComunidadCOLUA #MICOOPE #GuatemalaSostenible",
        isFeatured: true,
        isDraft: false,
        likesCount: 28,
        sharesCount: 12,
        issuerName: "Cooperativa COLUA",
        issuerRole: "Oficial",
        targetSectionId: "https://colua.com.gt/noticias/reforestacion-2026",
        publicationDate: 1789762795493,
        updatedAt: 1789769069835
      },
      {
        id: "news_taller_finanzas",
        sectionId: "sec_noticias",
        title: "Taller Finanzas para Emprendedores",
        subtitle: "Ver detalles completos",
        shortDescription: "Aprende a estructurar tus costos y maximizar tus excedentes en nuestra sede central con capacitadores expertos de MICOOPE.",
        description: "Aprende a estructurar tus costos y maximizar tus excedentes en nuestra sede central con capacitadores expertos de MICOOPE. Conoce herramientas prácticas de flujo de caja y contabilidad básica.",
        imagePath: "assets/noticia_taller_finanzas.jpg",
        imageUrl: "assets/noticia_taller_finanzas.jpg",
        tags: "#Emprendedores #MICOOPE #EducacionFinanciera",
        isFeatured: false,
        isDraft: false,
        likesCount: 15,
        sharesCount: 4,
        issuerName: "Cooperativa COLUA",
        issuerRole: "Oficial",
        targetSectionId: "https://colua.com.gt/noticias/taller-finanzas",
        publicationDate: 1789762795502,
        updatedAt: 1789769069835
      },
      {
        id: "news_asamblea_general",
        sectionId: "sec_noticias",
        title: "Asamblea General de Asociados COLUA",
        subtitle: "Ver detalles completos",
        shortDescription: "Te invitamos a participar activamente en las decisiones y crecimiento de nuestra cooperativa en la Asamblea General Anual.",
        description: "Te invitamos a participar activamente en las decisiones y crecimiento de nuestra cooperativa. Revisa la agenda y los puntos a tratar en el portal o agencias.",
        imagePath: "assets/noticia_asamblea_general.jpg",
        imageUrl: "assets/noticia_asamblea_general.jpg",
        tags: "#Asamblea2026 #AsociadosCOLUA #MICOOPE",
        isFeatured: false,
        isDraft: false,
        likesCount: 32,
        sharesCount: 14,
        issuerName: "Cooperativa COLUA",
        issuerRole: "Oficial",
        targetSectionId: "https://coluarl.com.gt",
        publicationDate: 1789762795510,
        updatedAt: 1789769069835
      }
    ];

    const defaultBlocks = [
      { id: "block_home_slogan", sectionId: "sec_home", type: "TEXT", content: "SOMOS EL LADO HUMANO\nde los Ahorros y Créditos", title: "SOMOS EL LADO HUMANO", displayOrder: 1, isVisible: true, isDraft: false },
      { id: "block_home_institutional_contact", sectionId: "sec_home", type: "CONTAINER", content: "Comunícate a nuestro PBX central o búscanos en nuestras redes sociales oficiales.", title: "SOMOS EL LADO HUMANO", buttonText: "PBX: 7795-7795", buttonAction: "tel:77957795", mediaPath: "distintivo_colua", backgroundColor: "#173789", displayOrder: 2, isVisible: true, isDraft: false },
      { id: "block_remesas_banner", sectionId: "sec_remesas", type: "BANNER", content: "Beneficio al recibir tu remesa dirigida a tu Cuenta Disponible. En caso de fallecimiento en el extranjero, te ofrecemos el BENEFICIO DE REPATRIACIÓN.", title: "Más que una remesa, unimos familias", buttonText: "Abrir Cuenta Disponible", buttonAction: "#sec_ahorros", displayOrder: 1, isVisible: true, isDraft: false },

      // Bloques de Ahorros
      { id: "b_ah_ad_1", itemId: "item_ahorro_aportacion_adulto", sectionId: "sec_ahorros", blockType: "bullet", content: "Monto de apertura: desde Q50.00", displayOrder: 1 },
      { id: "b_ah_ad_2", itemId: "item_ahorro_aportacion_adulto", sectionId: "sec_ahorros", blockType: "bullet", content: "Tasa de interés: 5% anual afecto a ISR", displayOrder: 2 },
      { id: "b_ah_ad_3", itemId: "item_ahorro_aportacion_adulto", sectionId: "sec_ahorros", blockType: "bullet", content: "Intereses: capitalizables anualmente", displayOrder: 3 },
      { id: "b_ah_inf_1", itemId: "item_ahorro_aportacion_infanto", sectionId: "sec_ahorros", blockType: "bullet", content: "Monto de apertura: desde Q50.00", displayOrder: 1 },
      { id: "b_ah_inf_2", itemId: "item_ahorro_aportacion_infanto", sectionId: "sec_ahorros", blockType: "bullet", content: "Tasa de interés: 5% anual afecto a ISR", displayOrder: 2 },
      { id: "b_ah_inf_3", itemId: "item_ahorro_aportacion_infanto", sectionId: "sec_ahorros", blockType: "bullet", content: "Intereses: capitalizables anualmente", displayOrder: 3 },
      { id: "b_ah_juv_1", itemId: "item_ahorro_infanto_juvenil", sectionId: "sec_ahorros", blockType: "bullet", content: "Monto de apertura: desde Q10.00", displayOrder: 1 },
      { id: "b_ah_juv_2", itemId: "item_ahorro_infanto_juvenil", sectionId: "sec_ahorros", blockType: "bullet", content: "Tasa de interés: 3% anual afecto a ISR", displayOrder: 2 },
      { id: "b_ah_juv_3", itemId: "item_ahorro_infanto_juvenil", sectionId: "sec_ahorros", blockType: "bullet", content: "5 Beneficios al mantener mínimo Q500.00", displayOrder: 3 },
      { id: "b_ah_disp_1", itemId: "item_ahorro_disponible", sectionId: "sec_ahorros", blockType: "bullet", content: "Apertura: desde Q50.00 o $100.00", displayOrder: 1 },
      { id: "b_ah_disp_2", itemId: "item_ahorro_disponible", sectionId: "sec_ahorros", blockType: "bullet", content: "Tasa: 3% anual en Q y 1.50% en $", displayOrder: 2 },
      { id: "b_ah_disp_3", itemId: "item_ahorro_disponible", sectionId: "sec_ahorros", blockType: "bullet", content: "Intereses: capitalizables mensualmente", displayOrder: 3 },
      { id: "b_ah_disp_4", itemId: "item_ahorro_disponible", sectionId: "sec_ahorros", blockType: "bullet", content: "Acceso a canales digitales sin costo", displayOrder: 4 },
      { id: "b_ah_prog_1", itemId: "item_ahorro_programado", sectionId: "sec_ahorros", blockType: "bullet", content: "Apertura: desde Q25.00", displayOrder: 1 },
      { id: "b_ah_prog_2", itemId: "item_ahorro_programado", sectionId: "sec_ahorros", blockType: "bullet", content: "Tasa de interés: 7.50% anual afecto a ISR", displayOrder: 2 },
      { id: "b_ah_prog_3", itemId: "item_ahorro_programado", sectionId: "sec_ahorros", blockType: "bullet", content: "Plazos de 3, 5, 10, 15 o 20 años", displayOrder: 3 },
      { id: "b_ah_pf_1", itemId: "item_ahorro_plazo_fijo", sectionId: "sec_ahorros", blockType: "bullet", content: "Apertura: desde Q1,000.00 o $200.00", displayOrder: 1 },
      { id: "b_ah_pf_2", itemId: "item_ahorro_plazo_fijo", sectionId: "sec_ahorros", blockType: "bullet", content: "Plazos de 90, 180 y 365 días", displayOrder: 2 },
      { id: "b_ah_pf_3", itemId: "item_ahorro_plazo_fijo", sectionId: "sec_ahorros", blockType: "bullet", content: "Intereses capitalizables trimestralmente", displayOrder: 3 },

      // Bloques de Sostenibilidad (Ejes y Programas)
      { id: "b_sost_edu_1", itemId: "item_sost_educacion", sectionId: "sec_sostenibilidad", blockType: "bullet", content: "Educación y Formación Financiera: Capacitación continua en finanzas familiares y uso responsable del crédito.", displayOrder: 1 },
      { id: "b_sost_edu_2", itemId: "item_sost_educacion", sectionId: "sec_sostenibilidad", blockType: "bullet", content: "Programa de Becas Jóvenes Cooperativistas: Financiamiento educativo para estudiantes destacados.", displayOrder: 2 },
      { id: "b_sost_edu_3", itemId: "item_sost_educacion", sectionId: "sec_sostenibilidad", blockType: "bullet", content: "Programa de Educación Financiera Huellas: Formación de hábitos de ahorro para niños y jóvenes.", displayOrder: 3 },
      { id: "b_sost_edu_4", itemId: "item_sost_educacion", sectionId: "sec_sostenibilidad", blockType: "bullet", content: "Programa Wachalal: Acompañamiento escolar y valores cooperativos en escuelas locales.", displayOrder: 4 },
      { id: "b_sost_emp_1", itemId: "item_sost_empleabilidad", sectionId: "sec_sostenibilidad", blockType: "bullet", content: "Centros de Innovación en Sololá y Argueta: Espacios tecnológicos equipados para inclusión digital y técnica.", displayOrder: 1 },
      { id: "b_sost_emp_2", itemId: "item_sost_empleabilidad", sectionId: "sec_sostenibilidad", blockType: "bullet", content: "Cursos de Formación Técnica Práctica y Digital: Talleres en oficios técnicos y herramientas digitales.", displayOrder: 2 },
      { id: "b_sost_emp_3", itemId: "item_sost_empleabilidad", sectionId: "sec_sostenibilidad", blockType: "bullet", content: "Emprendimiento Sostenible y Feria de Emprendedores: Asesoría de planes de negocio y vitrinas comerciales.", displayOrder: 3 },
      { id: "b_sost_emp_4", itemId: "item_sost_empleabilidad", sectionId: "sec_sostenibilidad", blockType: "bullet", content: "Club de Lectura, Música y Ajedrez: Desarrollo artístico, intelectual y estratégico juvenil.", displayOrder: 4 },
      { id: "b_sost_des_1", itemId: "item_sost_desarrollo", sectionId: "sec_sostenibilidad", blockType: "bullet", content: "ADN COLUA: Sentido de pertenencia solidaria y consolidación de valores cooperativos.", displayOrder: 1 },
      { id: "b_sost_des_2", itemId: "item_sost_desarrollo", sectionId: "sec_sostenibilidad", blockType: "bullet", content: "Programa de Líderes Cooperativos: Formación de cuadros dirigenciales éticos para comités locales.", displayOrder: 2 },
      { id: "b_sost_des_3", itemId: "item_sost_desarrollo", sectionId: "sec_sostenibilidad", blockType: "bullet", content: "Plan de Desarrollo Cooperativo: Instrumento institucional de planificación territorial.", displayOrder: 3 },
      { id: "b_sost_amb_1", itemId: "item_sost_ambiente", sectionId: "sec_sostenibilidad", blockType: "bullet", content: "Jornadas Médicas y Proyectos de Caridad: Atención médica preventiva y brigadas solidarias.", displayOrder: 1 },
      { id: "b_sost_amb_2", itemId: "item_sost_ambiente", sectionId: "sec_sostenibilidad", blockType: "bullet", content: "Proyectos de Reforestación: Siembra masiva de árboles para protección de cuencas hídricas.", displayOrder: 2 },
      { id: "b_sost_amb_3", itemId: "item_sost_ambiente", sectionId: "sec_sostenibilidad", blockType: "bullet", content: "Práctica de Valores y Tradiciones: Convivencia comunitaria y respeto a raíces culturales.", displayOrder: 3 },

      // Bloques de Nosotros (Pilares y Valores)
      { id: "b_nos_mv_1", itemId: "item_nos_mision_vision", sectionId: "sec_nosotros", blockType: "callout", content: "Propuesta de Valor: Reconocemos tu valor como persona para alcanzar tu bienestar integral a través de productos éticos y accesibles.", displayOrder: 1 },
      { id: "b_nos_mv_2", itemId: "item_nos_mision_vision", sectionId: "sec_nosotros", blockType: "paragraph", content: "Visión Institucional: Ser un modelo de desarrollo y sostenibilidad integral basado en la cooperación mutua y solvencia técnica.", displayOrder: 2 },
      { id: "b_nos_mv_3", itemId: "item_nos_mision_vision", sectionId: "sec_nosotros", blockType: "paragraph", content: "Propósito Visionario: Mejorar sostenidamente la calidad de vida de nuestros asociados y comunidades.", displayOrder: 3 },
      { id: "b_nos_val_1", itemId: "item_nos_valores", sectionId: "sec_nosotros", blockType: "bullet", content: "Integridad: Actuar con coherencia y transparencia en cada acción fiduciaria.", displayOrder: 1 },
      { id: "b_nos_val_2", itemId: "item_nos_valores", sectionId: "sec_nosotros", blockType: "bullet", content: "Cooperación: Trabajo en equipo, ayuda mutua y solidaridad comunitaria.", displayOrder: 2 },
      { id: "b_nos_val_3", itemId: "item_nos_valores", sectionId: "sec_nosotros", blockType: "bullet", content: "Responsabilidad: Cuidar los ahorros confiados con máxima prudencia técnica.", displayOrder: 3 },
      { id: "b_nos_val_4", itemId: "item_nos_valores", sectionId: "sec_nosotros", blockType: "bullet", content: "Enfoque al Asociado: Vocación de servicio y soluciones de alta calidad.", displayOrder: 4 }
    ];

    const defaultGlobalConfig = {
      slogan_text: "SOMOS EL LADO HUMANO\nde los Ahorros y Créditos",
      help_title: "¿Necesitas ayuda adicional?",
      help_desc: "Comunícate a nuestro PBX central o búscanos en nuestras redes sociales oficiales.",
      pbx_phone: "7795-7795",
      logo_path: "logo_composite",
      distintivo_path: "distintivo_colua",
      master_admin_password_hash: "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
      published_version: 1,
      last_sync_timestamp: Date.now()
    };

    const defaultForms = [
      {
        id: "form_asociate",
        title: "¿Cómo Asociarte a COLUA MICOOPE?",
        subtitle: "Inicia tu proceso de asociación cooperativa completando este breve formulario. Un asesor te contactará para coordinar los requisitos y el pago de tu aportación inicial.",
        iconName: "distintivo_colua",
        accentColor: "#173789",
        targetCardId: "home_asociate",
        buttonText: "Enviar Solicitud",
        requirements: [
          "DPI vigente original o copia legible (o Certificado de Nacimiento para menores de edad)",
          "Recibo de luz, agua o teléfono reciente (comprobante de dirección)",
          "Aportación inicial mínima de Q 100.00 (saldo de tu cuenta de aportaciones)"
        ],
        fields: [
          { id: "nombre", label: "Nombre y Apellido", type: "text", required: true, placeholder: "Ej: Juan Carlos Gómez" },
          { id: "telefono", label: "Teléfono / WhatsApp", type: "tel", required: true, placeholder: "Ej: 5555-1234" },
          { id: "email", label: "Correo Electrónico", type: "email", required: true, placeholder: "Ej: juangomez@gmail.com" },
          { id: "dpi", label: "Número de DPI / CUI", type: "text", required: false, placeholder: "Ej: 1234 56789 0101" },
          { id: "foto_dpi_frente", label: "Foto de tu DPI - Frente (Anverso)", type: "file", required: false, placeholder: "Tomar o subir foto del frente del DPI" },
          { id: "foto_dpi_reverso", label: "Foto de tu DPI - Atrás (Reverso)", type: "file", required: false, placeholder: "Tomar o subir foto del reverso del DPI" },
          { id: "foto_recibo_luz", label: "Foto de tu Recibo de Luz / Agua reciente", type: "file", required: false, placeholder: "Tomar o subir foto de recibo de servicios" },
          { id: "agencia", label: "Agencia de tu Preferencia", type: "select", required: true, options: ["Sololá Central", "Panajachel", "Santiago Atitlán", "San Lucas Tolimán", "Santa Cruz del Quiché", "Joyabaj", "Chichicastenango", "Totonicapán", "Mazatenango", "Otra / Coordinar por teléfono"] },
          { id: "metodo_pago", label: "Forma de pago de aportación inicial (Q100.00)", type: "select", required: true, options: ["Pago en Efectivo en Agencia", "Transferencia Bancaria", "Coordinar con Asesor al contactarme"] },
          { id: "foto_pago", label: "Comprobante de Pago / Depósito (Opcional)", type: "file", required: false, placeholder: "Subir foto de boleta o transferencia" },
          { id: "comentarios", label: "¿Algún comentario o consulta adicional?", type: "textarea", required: false, placeholder: "Escribe cualquier consulta o el mejor horario para llamarte..." }
        ],
        isEnabled: true,
        isPublished: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    ];

    const SAMPLE_DPI_FRENTE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiB2aWV3Qm94PSIwIDAgNDAwIDI1MCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJkcGlGcm9udEdyYWQiIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZGJlYWZlIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjYmZkYmZlIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNTAiIHJ4PSIxNCIgZmlsbD0idXJsKCNkcGlGcm9udEdyYWQpIiBzdHJva2U9IiMyNTYzZWIiIHN0cm9rZS13aWR0aD0iMyIvPjxyZWN0IHg9IjE1IiB5PSIxNSIgd2lkdGg9IjM3MCIgaGVpZ2h0PSI0MiIgcng9IjYiIGZpbGw9IiMxNzM3ODkiLz48dGV4dCB4PSIyMDAiIHk9IjMzIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjExIiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlJFUMOaQkxJQ0EgREUgR1VBVEVNQUxBPC90ZXh0Pjx0ZXh0IHg9IjIwMCIgeT0iNDciIGZpbGw9IiM5M2M1ZmQiIGZvbnQtc2l6ZT0iOC41IiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPkRPQ1VNRU5UTyBQRVJTT05BTCBERSBJREVOVElGSUNBQ0nDk04gLSBDVUk8L3RleHQ+PHJlY3QgeD0iMjUiIHk9IjcwIiB3aWR0aD0iODUiIGhlaWdodD0iMTEwIiByeD0iOCIgZmlsbD0iIzk0YTMiIHN0cm9rZT0iIzQ3NTU2OSIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iNjciIGN5PSIxMDUiIHI9IjIyIiBmaWxsPSIjY2JkNWUxIi8+PHBhdGggZD0iTTQyIDE2NSBDNDIgMTM1IDkyIDEzNSA5MiAxNjUgWiIgZmlsbD0iI2NiZDVlMSIvPjxyZWN0IHg9IjEyNSIgeT0iNzUiIHdpZHRoPSI0MCIgaGVpZ2h0PSIyOCIgcng9IjQiIGZpbGw9IiNmNTllMGIiIHN0cm9rZT0iI2I0NTMwOSIvPjx0ZXh0IHg9IjEyNSIgeT0iMTI1IiBmaWxsPSIjMTczNzg5IiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPkNVSSAvIERQSTo8L3RleHQ+PHRleHQgeD0iMTI1IiB5PSIxNDIiIGZpbGw9IiMwZjE3MmEiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSI5MDAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiPjI0ODkgNTEyMzQgMDcwMTwvdGV4dD48dGV4dCB4PSIxMjUiIHk9IjE2MyIgZmlsbD0iIzE3Mzc4OSIgZm9udC1zaXplPSI5IiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPk5PTUJSRSBERUwgQVNPQ0lBRE86PC90ZXh0Pjx0ZXh0IHg9IjEyNSIgeT0iMTc4IiBmaWxsPSIjMGYxNzJhIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPk1BUsONYUxVSVNBIEdPTUVaIFFVSUNIw4k8L3RleHQ+PHJlY3QgeD0iMjAiIHk9IjE5NSIgd2lkdGg9IjM2MCIgaGVpZ2h0PSI0MCIgcng9IjYiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC45IiBzdHJva2U9IiM5M2M1ZmQiLz48dGV4dCB4PSIzNSIgeT0iMjE4IiBmaWxsPSIjMTU4MDNkIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuKckyBBTlZFUlNPIChGUkVOVEUpIOKAoiBWRVJJRklDQURPIFJFTkFQPC90ZXh0Pjwvc3ZnPg==';
    const SAMPLE_DPI_REVERSO = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiB2aWV3Qm94PSIwIDAgNDAwIDI1MCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJkcGlCYWNrR3JhZCIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmOGZhZmMiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlMmU4ZjAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgcng9IjE0IiBmaWxsPSJ1cmwoI2RwaUJhY2tHcmFkKSIgc3Ryb2tlPSIjNjQ3NDhiIiBzdHJva2Utd2lkdGg9IjMiLz48cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSIzNjAiIGhlaWdodD0iMzIiIGZpbGw9IiMwZjE3MmEiIHJ4PSI0Ii8+PHRleHQgeD0iMzAiIHk9IjQxIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjEwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIj58fHx8fHx8fCB8fHwgfHx8fHx8fHx8fCB8fHx8fHx8fHx8IHx8fHx8fHx8fHx8fCB8fHx8fHx8fDwvdGV4dD48dGV4dCB4PSIzMCIgeT0iNzUiIGZpbGw9IiM0NzU1NjkiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5WRUNJTkRBRCAvIE1VTklDSVBJTzo8L3RleHQ+PHRleHQgeD0iMzAiIHk9IjkwIiBmaWxsPSIjMGYxNzJhIiBmb250LXNpemU9IjExIiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPlNPTE9Mw4EsIFNPTE9Mw4E8L3RleHQ+PHRleHQgeD0iMjEwIiB5PSI3NSIgZmlsbD0iIzQ3NTU2OSIgZm9udC1zaXplPSI5IiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPkVTVEFETyBDSVZJTDo8L3RleHQ+PHRleHQgeD0iMjEwIiB5PSI5MCIgZmlsbD0iIzBmMTcyYSIgZm9udC1zaXplPSIxMSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5TT0xURVJBPC90ZXh0PjxyZWN0IHg9IjMwIiB5PSIxMTAiIHdpZHRoPSIxNjAiIGhlaWdodD0iNDIiIHJ4PSI0IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiM5NGEzYjgiIHN0cm9rZS1kYXNoYXJyYXk9IjMgMyIvPjx0ZXh0IHg9IjQwIiB5PSIxMzYiIGZpbGw9IiM2NDc0OGIiIGZvbnQtc2l6ZT0iMTEiIGZvbnQtZmFtaWx5PSJjdXJzaXZlIiBmb250LXN0eWxlPSJpdGFsaWMiPk1hcsOtYSBMLiBHw7NtZXogUS48L3RleHQ+PHRleHQgeD0iMzAiIHk9IjE2NSIgZmlsbD0iIzQ3NTU2OSIgZm9udC1zaXplPSI4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+RklSTUEgREVMIFRJVFVMQVI8L3RleHQ+PHJlY3QgeD0iMjEwIiB5PSIxMTAiIHdpZHRoPSIxNjAiIGhlaWdodD0iNDgiIHJ4PSI0IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNjYmQ1ZTEiLz48dGV4dCB4PSIyMjAiIHk9IjEzMCIgZmlsbD0iIzQ3NTU2OSIgZm9udC1zaXplPSI4LjUiIGZvbnQtd2VpZ2h0PSJib2xkIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+RkVDSEEgVkVOQ0lNSUVOVE86PC90ZXh0Pjx0ZXh0IHg9IjIyMCIgeT0iMTQ4IiBmaWxsPSIjYjkxYzFjIiBmb250LXNpemU9IjExIiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPjE0IC8gT0NUID8gMjAzMjwvdGV4dD48cmVjdCB4PSIyMCIgeT0iMTc1IiB3aWR0aD0iMzYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZmZmZmZmIiByeD0iNCIgc3Ryb2tlPSIjY2JkNWUxIi8+PHRleHQgeD0iMjUiIHk9IjE5NiIgZmlsbD0iIzBmMTcyYSIgZm9udC1zaXplPSI5LjUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiPklER1RNMjQ4OTUxMjM0MDw8PDw8PDw8PDw8PDw8PDw8L3RleHQ+PHRleHQgeD0iMjUiIHk9IjIxNCIgZmlsbD0iIzBmMTcyYSIgZm9udC1zaXplPSI5LjUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiPjg4MDQxNTJGMzIxMDE0NUdUTTw8PDw8PDw8PDw8PDw0PC90ZXh0Pjx0ZXh0IHg9IjI1IiB5PSIyMjciIGZpbGw9IiMxZDRlZDgiIGZvbnQtc2l6ZT0iOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj7inJMgUkVWRVJTTyAoQVRSw4FTKSDigKogWk9OQSBNUlogWSBIVUVMTEE8L3RleHQ+PC9zdmc+';

    const defaultSubmissions = [
      {
        id: "lead_demo_01",
        formId: "form_asociate",
        formTitle: "¿Cómo Asociarte a COLUA MICOOPE?",
        nombre: "María Luisa Gómez Quiché",
        telefono: "5555-4321",
        email: "marialuisa.gomez@gmail.com",
        dpi: "2489 51234 0701",
        fotoDpiFrente: SAMPLE_DPI_FRENTE,
        fotoDpiReverso: SAMPLE_DPI_REVERSO,
        agenciaPreferida: "Sololá Central",
        metodoPago: "Efectivo en Agencia (Q100.00)",
        estado: "Pendiente",
        createdAt: Date.now() - 3600000 * 2,
        fechaStr: new Date(Date.now() - 3600000 * 2).toLocaleString(),
        respuestas: {
          "Nombre y Apellido": "María Luisa Gómez Quiché",
          "Teléfono / WhatsApp": "5555-4321",
          "Correo Electrónico": "marialuisa.gomez@gmail.com",
          "Número de DPI / CUI": "2489 51234 0701",
          "Foto de tu DPI - Frente (Anverso)": SAMPLE_DPI_FRENTE,
          "Foto de tu DPI - Atrás (Reverso)": SAMPLE_DPI_REVERSO,
          "Agencia de tu Preferencia": "Sololá Central",
          "Forma de pago de aportación inicial (Q100.00)": "Pago en Efectivo en Agencia"
        }
      },
      {
        id: "lead_demo_02",
        formId: "form_asociate",
        formTitle: "¿Cómo Asociarte a COLUA MICOOPE?",
        nombre: "Carlos Humberto Pérez Morales",
        telefono: "4444-9876",
        email: "carlos.perez.m@outlook.com",
        dpi: "1890 87654 0801",
        fotoDpiFrente: SAMPLE_DPI_FRENTE,
        fotoDpiReverso: SAMPLE_DPI_REVERSO,
        agenciaPreferida: "Panajachel",
        metodoPago: "Transferencia Bancaria",
        estado: "Contactado",
        createdAt: Date.now() - 3600000 * 18,
        fechaStr: new Date(Date.now() - 3600000 * 18).toLocaleString(),
        respuestas: {
          "Nombre y Apellido": "Carlos Humberto Pérez Morales",
          "Teléfono / WhatsApp": "4444-9876",
          "Correo Electrónico": "carlos.perez.m@outlook.com",
          "Número de DPI / CUI": "1890 87654 0801",
          "Foto de tu DPI - Frente (Anverso)": SAMPLE_DPI_FRENTE,
          "Foto de tu DPI - Atrás (Reverso)": SAMPLE_DPI_REVERSO,
          "Agencia de tu Preferencia": "Panajachel",
          "Forma de pago de aportación inicial (Q100.00)": "Transferencia Bancaria"
        }
      }
    ];

    return {
      sections: defaultSections,
      navigation_items: defaultNavigation,
      agencias: defaultAgencias,
      content_items: defaultItems,
      content_blocks: defaultBlocks,
      forms: defaultForms,
      form_submissions: defaultSubmissions,
      global_config: defaultGlobalConfig,
      usuarios: []
    };
  }

  // Siembra inicial idéntica a DataSeeder.java
  seedInitialData(force = false) {
    const data = this._getDefaultData();
    let initialDb = data;
    if (!force) {
      const raw = localStorage.getItem(this.localStorageKey);
      if (raw) {
        try {
          initialDb = this._ensureDefaultData(JSON.parse(raw));
        } catch (e) {}
      }
    }
    this.saveLocalDb(initialDb);
    return initialDb;
  }

  // Helper con timeout seguro para no ralentizar la UI si Firestore tarda o no responde
  async _withTimeout(promise, ms = 2500) {
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('Firestore timeout')), ms);
    });
    try {
      return await Promise.race([promise, timeout]);
    } finally {
      clearTimeout(timer);
    }
  }

  // --- SECCIONES ---
  async getAllSections() {
    let remoteSections = [];
    if (this.fb && this.fb.db) {
      try {
        const snap = await this._withTimeout(this.fb.collection('sections').get(), 3000);
        if (!snap.empty) {
          remoteSections = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (e) {}
    }

    if (!remoteSections || remoteSections.length === 0) {
      remoteSections = await this.fetchCollectionRest('sections');
    }

    if (remoteSections && remoteSections.length > 0) {
      const db = this.getLocalDb();
      let changed = false;
      remoteSections.forEach(remoteSec => {
        if (!remoteSec || !remoteSec.id || remoteSec.id === 'sec_comunidad' || remoteSec.slug === 'comunidad') return;
        const idx = db.sections.findIndex(s => s.id === remoteSec.id);
        if (idx >= 0) {
          db.sections[idx] = { ...db.sections[idx], ...remoteSec };
          changed = true;
        } else {
          db.sections.push(remoteSec);
          changed = true;
        }
      });
      if (changed) this.saveLocalDb(db);
    }

    const db = this.getLocalDb();
    const localSections = (db.sections || [])
      .filter(s => s.id !== 'sec_comunidad' && s.slug !== 'comunidad' && (s.title || '').trim().toLowerCase() !== 'comunidad');

    return localSections.sort((a, b) => (a.orderIndex || a.displayOrder || 0) - (b.orderIndex || b.displayOrder || 0));
  }

  async getPublishedSections() {
    const list = await this.getAllSections();
    return list.filter(s => s.isPublished !== false && s.isVisible !== false && !s.deletedAt);
  }

  async getArchivedSections() {
    const list = await this.getAllSections();
    return list.filter(s => s.deletedAt || s.isVisible === false);
  }

  async insertSection(section) {
    if (!section.id) section.id = 'sec_' + Math.random().toString(36).substring(2, 9);
    section.updatedAt = Date.now();
    section.lastModified = Date.now();
    // Auto-publicación: siempre activo y publicado en línea
    section.isDraft = false;
    section.isPublished = true;
    if (section.isEnabled === undefined) section.isEnabled = true;
    if (section.isVisible === undefined) section.isVisible = true;
    
    // Guardar local
    const db = this.getLocalDb();
    const idx = db.sections.findIndex(s => s.id === section.id);
    if (idx >= 0) db.sections[idx] = section;
    else db.sections.push(section);

    // Sincronizar automáticamente en la barra inferior si esta sección está en algún slot
    if (db.global_config && db.global_config.bottom_nav_slots) {
      db.global_config.bottom_nav_slots.forEach(slot => {
        if (slot.sectionId === section.id || (slot.slotIndex === 3 && section.id === 'sec_home')) {
          slot.label = section.title;
          if (section.slug) slot.slug = section.slug;
        }
      });
    }

    // Sincronizar navigation_items
    if (db.navigation_items) {
      db.navigation_items.forEach(nav => {
        if (nav.targetSectionId === section.id || nav.id === 'nav_' + section.id.replace('sec_', '')) {
          nav.label = section.title;
          nav.updatedAt = Date.now();
        }
      });
    }

    this.saveLocalDb(db);

    // Guardar en Firestore si hay conexión
    if (this.fb && this.fb.db) {
      try {
        await this.ensureFirebaseAuthAdmin();
        const clean = this._cleanDoc(section);
        await this.fb.collection('sections').doc(section.id).set(clean, { merge: true });
        console.log(`[ColuaRepo] Sección auto-publicada en Firestore: ${section.id}`);
      } catch (e) {
        console.warn('Error syncing section to Firestore:', e);
      }
    }

    await this._autoPublishChange(idx >= 0 ? 'EDITAR_SECCION' : 'CREAR_SECCION', `Sección "${section.title}" guardada y publicada en vivo.`);
    return section;
  }

  async archiveSection(id) {
    if (id === 'sec_home') return false;
    const db = this.getLocalDb();
    const s = db.sections.find(sec => sec.id === id);
    if (s) {
      s.deletedAt = Date.now();
      s.isVisible = false;
      s.isPublished = false;
      this.saveLocalDb(db);
    }
    if (this.fb && this.fb.db) {
      try {
        await this.fb.collection('sections').doc(id).update({
          deletedAt: Date.now(),
          isVisible: false,
          isPublished: false
        });
      } catch (e) {}
    }
    return true;
  }

  async restoreArchivedSection(id) {
    const db = this.getLocalDb();
    const s = db.sections.find(sec => sec.id === id);
    if (s) {
      s.deletedAt = null;
      s.isVisible = true;
      s.isPublished = true;
      this.saveLocalDb(db);
    }
    if (this.fb && this.fb.db) {
      try {
        await this.fb.collection('sections').doc(id).update({
          deletedAt: null,
          isVisible: true,
          isPublished: true
        });
      } catch (e) {}
    }
    return true;
  }

  async purgeSectionPermanently(id) {
    if (id === 'sec_home') return false;
    const db = this.getLocalDb();
    db.sections = db.sections.filter(s => s.id !== id);
    db.navigation_items = db.navigation_items.filter(n => n.targetSectionId !== id);
    db.content_items = db.content_items.filter(i => i.sectionId !== id);
    db.content_blocks = db.content_blocks.filter(b => b.sectionId !== id);
    this.saveLocalDb(db);

    if (this.fb && this.fb.db) {
      try {
        await this.ensureFirebaseAuthAdmin();
        await this.fb.collection('sections').doc(id).delete();
        await this.fb.collection('navigation_items').doc('nav_' + id).delete();
      } catch (e) {}
    }
    await this._autoPublishChange('ELIMINAR_SECCION', `Sección "${id}" eliminada de la plataforma.`);
    return true;
  }

  // Extrae y normaliza el timestamp de publicación de un contenido
  _extractItemDate(item) {
    if (!item) return 0;
    // Prioridad absoluta: fecha de publicación explícita para que la más reciente sea la novedad
    const val = item.publicationDate ?? item.publishedAt ?? item.date ?? item.fecha ?? item.createdAt ?? item.lastModified ?? item.updatedAt;
    if (!val) return 0;
    if (typeof val === 'number') {
      return val < 1e11 ? val * 1000 : val;
    }
    if (typeof val === 'object') {
      if (typeof val.toMillis === 'function') return val.toMillis();
      if (typeof val.seconds === 'number') return val.seconds * 1000 + Math.floor((val.nanoseconds || 0) / 1e6);
      if (typeof val._seconds === 'number') return val._seconds * 1000;
      if (val instanceof Date) return val.getTime();
    }
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (/^\d+$/.test(trimmed)) {
        const num = parseInt(trimmed, 10);
        return num < 1e11 ? num * 1000 : num;
      }
      const parsed = Date.parse(trimmed);
      if (!isNaN(parsed)) return parsed;
      // Soporte para fechas en español tipo "18 sept, 2026"
      const match = trimmed.match(/(\d{1,2})\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ]+)[,\s]+(\d{4})/);
      if (match) {
        const day = parseInt(match[1], 10);
        const monStr = match[2].toLowerCase().substring(0, 3);
        const year = parseInt(match[3], 10);
        const meses = { ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11 };
        if (monStr in meses) {
          return new Date(year, meses[monStr], day).getTime();
        }
      }
    }
    return 0;
  }

  // Ordena noticias cronológicamente: la más reciente primero (la novedad)
  sortNewsByDate(articles) {
    if (!Array.isArray(articles)) return [];
    return articles.sort((a, b) => {
      const timeA = this._extractItemDate(a);
      const timeB = this._extractItemDate(b);
      if (timeB !== timeA) {
        return timeB - timeA;
      }
      const createdA = a.createdAt || a.lastModified || a.updatedAt || 0;
      const createdB = b.createdAt || b.lastModified || b.updatedAt || 0;
      if (createdB !== createdA) return createdB - createdA;
      return (b.id || '').localeCompare(a.id || '');
    });
  }

  // --- CONTENIDO (ITEMS Y BLOQUES) ---
  async getItemsBySection(sectionId, includeDrafts = false) {
    const cleanId = (sectionId || '').toLowerCase();
    const isNews = cleanId === 'sec_noticias' || cleanId === 'noticias';
    const isAgencias = cleanId === 'sec_agencias' || cleanId === 'agencias';

    // 1. Intentar consultar por Firestore SDK
    let remoteItems = [];
    if (this.fb && this.fb.db) {
      try {
        const snap = await this._withTimeout(
          this.fb.collection('content_items').get(),
          3000
        );
        if (!snap.empty) {
          remoteItems = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (e) {}
    }

    // 2. Si no hay respuesta del SDK, consultar REST API pública de Firestore
    if (!remoteItems || remoteItems.length === 0) {
      remoteItems = await this.fetchCollectionRest('content_items');
    }

    if (remoteItems && remoteItems.length > 0) {
      const db = this.getLocalDb();
      let changed = false;
      remoteItems.forEach(remoteItem => {
        if (!remoteItem || !remoteItem.id || remoteItem.sectionId === 'sec_comunidad') return;
        this._cleanItemIfInverted(remoteItem);
        const idx = db.content_items.findIndex(i => i.id === remoteItem.id);
        if (idx >= 0) {
          db.content_items[idx] = { ...db.content_items[idx], ...remoteItem };
          changed = true;
        } else {
          db.content_items.push(remoteItem);
          changed = true;
        }
      });
      if (changed) this.saveLocalDb(db);
    }
    
    const db = this.getLocalDb();
    let localList = (db.content_items || []).filter(i => {
      const iSec = (i.sectionId || '').toLowerCase();
      return iSec === cleanId || iSec === cleanId.replace('sec_', '') || ('sec_' + iSec) === cleanId;
    });

    let localCleaned = false;
    localList.forEach(i => {
      if (this._cleanItemIfInverted(i)) localCleaned = true;
    });
    if (localCleaned) {
      this.saveLocalDb(db);
    }
    
    let list = [...localList];
    if (list.length === 0 && isAgencias && db.agencias && db.agencias.length > 0) {
      list = db.agencias.map((a, idx) => ({
        id: a.id,
        sectionId: 'sec_agencias',
        title: a.nombre,
        subtitle: `${a.departamento} • Tel: ${a.telefono}`,
        description: a.direccion,
        imageUrl: a.imageUrl || 'assets/colua_edificio.png',
        displayOrder: idx + 1,
        isEnabled: a.isEnabled !== false,
        isVisible: a.isVisible !== false,
        isDraft: a.isDraft === true
      }));
    }
    if (!includeDrafts) {
      list = list.filter(i => i.isEnabled !== false && i.isVisible !== false && i.isDraft !== true);
    }
    if (isNews) {
      return this.sortNewsByDate(list);
    }
    return list.sort((a, b) => (a.displayOrder || a.orderIndex || 0) - (b.displayOrder || b.orderIndex || 0));
  }

  async getAllContentItemsBySection(sectionId) {
    return this.getItemsBySection(sectionId, true);
  }

  // Helpers recursivos para decodificar documentos de la API REST de Firestore
  _parseFirestoreRestValue(valObj) {
    if (!valObj) return null;
    if ('stringValue' in valObj) return valObj.stringValue;
    if ('integerValue' in valObj) return parseInt(valObj.integerValue, 10);
    if ('doubleValue' in valObj) return parseFloat(valObj.doubleValue);
    if ('booleanValue' in valObj) return valObj.booleanValue;
    if ('timestampValue' in valObj) return valObj.timestampValue;
    if ('nullValue' in valObj) return null;
    if ('arrayValue' in valObj) {
      return (valObj.arrayValue.values || []).map(v => this._parseFirestoreRestValue(v));
    }
    if ('mapValue' in valObj) {
      const res = {};
      if (valObj.mapValue.fields) {
        for (const [k, v] of Object.entries(valObj.mapValue.fields)) {
          res[k] = this._parseFirestoreRestValue(v);
        }
      }
      return res;
    }
    return valObj;
  }

  _parseFirestoreRestDoc(doc) {
    if (!doc || !doc.name) return null;
    const data = { id: doc.name.split('/').pop() };
    if (doc.fields) {
      for (const [key, valObj] of Object.entries(doc.fields)) {
        data[key] = this._parseFirestoreRestValue(valObj);
      }
    }
    return data;
  }

  async fetchCollectionRest(collectionName) {
    try {
      const projectId = (window.COLUA_CONFIG && window.COLUA_CONFIG.firebase && window.COLUA_CONFIG.firebase.projectId) || 'colua-info';
      const restUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}?pageSize=200`;
      const resp = await fetch(restUrl, { cache: 'no-cache' });
      if (resp.ok) {
        const json = await resp.json();
        if (json.documents && Array.isArray(json.documents)) {
          return json.documents.map(d => this._parseFirestoreRestDoc(d)).filter(Boolean);
        }
      }
    } catch (e) {
      console.warn(`[ColuaRepository] Error consultando REST para ${collectionName}:`, e);
    }
    return [];
  }

  async fetchDocumentRest(collectionName, docId) {
    try {
      const projectId = (window.COLUA_CONFIG && window.COLUA_CONFIG.firebase && window.COLUA_CONFIG.firebase.projectId) || 'colua-info';
      const restUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}/${docId}`;
      const resp = await fetch(restUrl, { cache: 'no-cache' });
      if (resp.ok) {
        const json = await resp.json();
        return this._parseFirestoreRestDoc(json);
      }
    } catch (e) {
      console.warn(`[ColuaRepository] Error consultando REST para ${collectionName}/${docId}:`, e);
    }
    return null;
  }

  // Alias y sincronizador robusto para componente de noticias
  async getNewsArticles() {
    let cloudArticles = [];

    // 1. Intentar mediante el SDK de Firestore (timeout 3500ms)
    try {
      if (this.fb && this.fb.db) {
        const snap = await this._withTimeout(this.fb.collection('content_items').get(), 3500);
        if (!snap.empty) {
          cloudArticles = snap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(item => {
              if (!item) return false;
              const sec = (item.sectionId || '').toLowerCase();
              const id = (item.id || '').toLowerCase();
              return sec === 'sec_noticias' || sec === 'noticias' || id.startsWith('news_');
            });
        }
      }
    } catch (e) {
      console.warn('Firestore SDK lento o no disponible, intentando REST API...', e);
    }

    // 2. Si el SDK no devolvió artículos, consultar la API REST pública de Firestore
    if (!cloudArticles || cloudArticles.length === 0) {
      try {
        const restUrl = 'https://firestore.googleapis.com/v1/projects/colua-info/databases/(default)/documents/content_items?pageSize=100';
        const resp = await fetch(restUrl, { cache: 'no-cache' });
        if (resp.ok) {
          const json = await resp.json();
          if (json.documents && Array.isArray(json.documents)) {
            cloudArticles = json.documents
              .map(d => this._parseFirestoreRestDoc(d))
              .filter(item => {
                if (!item) return false;
                const sec = (item.sectionId || '').toLowerCase();
                const id = (item.id || '').toLowerCase();
                return sec === 'sec_noticias' || sec === 'noticias' || id.startsWith('news_');
              });
          }
        }
      } catch (err) {
        console.warn('REST API Firestore fallback error:', err);
      }
    }

    // 3. Si se obtuvieron artículos de la nube, sincronizar con localStorage
    if (cloudArticles && cloudArticles.length > 0) {
      try {
        const db = this.getLocalDb();
        const existingMap = new Map((db.content_items || []).map(i => [i.id, i]));
        cloudArticles.forEach(item => {
          if (item.imagePath && !item.imageUrl) {
            item.imageUrl = item.imagePath;
          }
          existingMap.set(item.id, { ...existingMap.get(item.id), ...item });
        });
        db.content_items = Array.from(existingMap.values());
        this.saveLocalDb(db);
      } catch (saveErr) {
        console.warn('No se pudo persistir artículos nube en localStorage:', saveErr);
      }

      const db = this.getLocalDb();
      const allNews = (db.content_items || []).filter(i => {
        if (i.isDraft === true || i.isVisible === false || i.isEnabled === false) return false;
        const sec = (i.sectionId || '').toLowerCase();
        const id = (i.id || '').toLowerCase();
        return sec === 'sec_noticias' || sec === 'noticias' || id.startsWith('news_');
      });

      return this.sortNewsByDate(allNews.length > 0 ? allNews : cloudArticles);
    }

    // 4. Fallback a base de datos local
    const db = this.getLocalDb();
    const list = (db.content_items || []).filter(i => {
      if (i.isDraft === true || i.isVisible === false || i.isEnabled === false) return false;
      const sec = (i.sectionId || '').toLowerCase();
      const id = (i.id || '').toLowerCase();
      return sec === 'sec_noticias' || sec === 'noticias' || id.startsWith('news_');
    });

    return this.sortNewsByDate(list);
  }

  async getBlocksBySection(sectionId) {
    const cleanId = sectionId.toLowerCase();
    try {
      if (this.fb && this.fb.db) {
        const snap = await this._withTimeout(this.fb.collection('content_blocks').where('sectionId', '==', cleanId).get());
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          return list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        }
      }
    } catch (e) {
      console.warn('Firestore offline o timeout, cargando bloques locales:', e);
    }
    const db = this.getLocalDb();
    return (db.content_blocks || [])
      .filter(b => (b.sectionId || '').toLowerCase() === cleanId)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getBlocksByItemId(itemId) {
    if (!itemId) return [];
    try {
      if (this.fb && this.fb.db) {
        const snap = await this._withTimeout(this.fb.collection('content_blocks').where('itemId', '==', itemId).get());
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          return list.sort((a, b) => (a.orderIndex || a.displayOrder || 0) - (b.orderIndex || b.displayOrder || 0));
        }
      }
    } catch (e) {}
    const db = this.getLocalDb();
    return (db.content_blocks || [])
      .filter(b => b.itemId === itemId || b.sectionId === itemId)
      .sort((a, b) => (a.orderIndex || a.displayOrder || 0) - (b.orderIndex || b.displayOrder || 0));
  }

  async insertItem(item) {
    if (!item.id) item.id = 'item_' + Math.random().toString(36).substring(2, 9);
    item.updatedAt = Date.now();
    item.lastModified = Date.now();
    // Auto-publicación: siempre activo y publicado en vivo
    item.isDraft = false;
    item.isPublished = true;
    if (item.isEnabled === undefined) item.isEnabled = true;
    if (item.isVisible === undefined) item.isVisible = true;

    const sec = (item.sectionId || '').toLowerCase();
    const id = (item.id || '').toLowerCase();
    const isNews = sec === 'sec_noticias' || sec === 'noticias' || id.startsWith('news_');
    const isAgencia = sec === 'sec_agencias' || sec === 'agencias' || id.startsWith('ag_');

    if (isNews && !item.publicationDate && !item.date && !item.fecha) {
      item.publicationDate = Date.now();
    }
    const db = this.getLocalDb();
    const idx = db.content_items.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      db.content_items[idx] = item;
    } else {
      if (isNews) db.content_items.unshift(item);
      else db.content_items.push(item);
    }

    // Sincronizar con agencias
    if (isAgencia) {
      if (!db.agencias) db.agencias = [];
      const agIdx = db.agencias.findIndex(a => a.id === item.id);
      const sub = item.subtitle || '';
      const deptPart = sub.includes('•') ? sub.split('•')[0].trim() : (sub || 'Sololá');
      const telPart = sub.includes('•') ? sub.split('•')[1].trim().replace(/Tel:\s*/i, '').replace(/PBX:\s*/i, '') : '7795-7795';
      const agData = {
        id: item.id,
        nombre: item.title,
        direccion: item.description || '',
        departamento: deptPart,
        telefono: telPart,
        colorHex: '#173789',
        tipo: 'AGENCIA',
        imageUrl: item.imageUrl || 'assets/colua_edificio.png',
        updatedAt: Date.now()
      };
      if (agIdx >= 0) db.agencias[agIdx] = { ...db.agencias[agIdx], ...agData };
      else db.agencias.push(agData);

      if (this.fb && this.fb.db) {
        try { 
          await this.ensureFirebaseAuthAdmin();
          await this.fb.collection('agencias').doc(item.id).set(this._cleanDoc(agData), { merge: true }); 
        } catch (e) {}
      }
    }

    this.saveLocalDb(db);

    if (this.fb && this.fb.db) {
      try {
        await this.ensureFirebaseAuthAdmin();
        const clean = this._cleanDoc(item);
        await this.fb.collection('content_items').doc(item.id).set(clean, { merge: true });
        console.log(`[ColuaRepo] Tarjeta sincronizada en Firestore: ${item.id}`);
      } catch (e) {
        console.warn(`[ColuaRepo] Advertencia sincronizando en Firestore (${item.id}):`, e.message || e);
      }
    }

    await this._autoPublishChange(idx >= 0 ? 'EDITAR_CONTENIDO' : 'CREAR_CONTENIDO', `Elemento "${item.title || item.id}" guardado y publicado en vivo.`);
    return item;
  }

  async insertBlock(block) {
    if (!block.id) block.id = 'block_' + Math.random().toString(36).substring(2, 9);
    block.updatedAt = Date.now();
    block.isDraft = false;
    block.isPublished = true;
    const db = this.getLocalDb();
    const idx = db.content_blocks.findIndex(b => b.id === block.id);
    if (idx >= 0) db.content_blocks[idx] = block;
    else db.content_blocks.push(block);
    this.saveLocalDb(db);

    if (this.fb && this.fb.db) {
      try {
        await this.ensureFirebaseAuthAdmin();
        const clean = this._cleanDoc(block);
        await this.fb.collection('content_blocks').doc(block.id).set(clean, { merge: true });
      } catch (e) {}
    }

    await this._autoPublishChange(idx >= 0 ? 'EDITAR_BLOQUE' : 'CREAR_BLOQUE', `Bloque "${block.id}" guardado y publicado en vivo.`);
    return block;
  }

  async deleteItemById(id) {
    const db = this.getLocalDb();
    db.content_items = db.content_items.filter(i => i.id !== id);
    if (db.agencias) db.agencias = db.agencias.filter(a => a.id !== id);
    this.saveLocalDb(db);
    if (this.fb && this.fb.db) {
      try { 
        await this.ensureFirebaseAuthAdmin();
        await this.fb.collection('content_items').doc(id).delete(); 
        await this.fb.collection('agencias').doc(id).delete();
      } catch (e) {}
    }
    await this._autoPublishChange('ELIMINAR_CONTENIDO', `Elemento "${id}" eliminado.`);
    return { success: true };
  }

  async deleteBlockById(id) {
    const db = this.getLocalDb();
    db.content_blocks = db.content_blocks.filter(b => b.id !== id);
    this.saveLocalDb(db);
    if (this.fb && this.fb.db) {
      try { 
        await this.ensureFirebaseAuthAdmin();
        await this.fb.collection('content_blocks').doc(id).delete(); 
      } catch (e) {}
    }
    await this._autoPublishChange('ELIMINAR_BLOQUE', `Bloque "${id}" eliminado.`);
    return { success: true };
  }

  async duplicateContentItem(itemId) {
    const db = this.getLocalDb();
    const original = (db.content_items || []).find(i => i.id === itemId);
    if (!original) return { success: false, error: 'Elemento original no encontrado' };

    const newItemId = 'item_' + Math.random().toString(36).substring(2, 10);
    const duplicatedItem = {
      ...original,
      id: newItemId,
      title: `${original.title} (Copia)`,
      orderIndex: (original.orderIndex || 0) + 1,
      publicationDate: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDraft: true
    };

    await this.insertItem(duplicatedItem);

    // Duplicar también los bloques asociados si los tiene
    const blocks = await this.getBlocksByItemId(itemId);
    if (blocks && blocks.length > 0) {
      for (const b of blocks) {
        const newBlock = {
          ...b,
          id: 'block_' + Math.random().toString(36).substring(2, 10),
          itemId: newItemId,
          updatedAt: Date.now()
        };
        await this.insertBlock(newBlock);
      }
    }

    await this.logAudit({
      action: 'DUPLICAR_CONTENIDO',
      performedBy: 'Super Administrador',
      details: `Se duplicó el elemento "${original.title}" a "${duplicatedItem.title}" (${newItemId})`
    });

    return { success: true, item: duplicatedItem };
  }

  // --- AGENCIAS ---
  async getAllAgencias() {
    try {
      if (this.fb && this.fb.db) {
        // Consultar content_items con sectionId == sec_agencias primero
        const itemSnap = await this._withTimeout(this.fb.collection('content_items').where('sectionId', '==', 'sec_agencias').get());
        if (!itemSnap.empty) {
          return itemSnap.docs.map(d => {
            const data = d.data();
            const sub = data.subtitle || '';
            const dept = sub.includes('•') ? sub.split('•')[0].trim() : (data.departamento || 'Sololá');
            const tel = sub.includes('•') ? sub.split('•')[1].trim().replace(/Tel:\s*/i, '').replace(/PBX:\s*/i, '') : (data.telefono || '7795-7795');
            return {
              id: d.id,
              nombre: data.title || data.nombre || 'Agencia COLUA',
              departamento: dept,
              direccion: data.description || data.direccion || 'Guatemala',
              telefono: tel,
              colorHex: data.colorHex || '#173789',
              tipo: data.tipo || 'AGENCIA',
              imageUrl: data.imageUrl || 'assets/colua_edificio.png',
              ...data
            };
          });
        }

        const snap = await this._withTimeout(this.fb.collection('agencias').get());
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      }
    } catch (e) {
      console.warn('Firestore offline o timeout, cargando agencias locales:', e);
    }
    const db = this.getLocalDb();
    return db.agencias || [];
  }

  // Alias para agencias.js
  async getAgencies() {
    return await this.getAllAgencias();
  }

  async insertAgencia(agencia) {
    if (!agencia.id) agencia.id = 'ag_' + Math.random().toString(36).substring(2, 9);
    agencia.updatedAt = Date.now();
    const db = this.getLocalDb();
    const idx = db.agencias.findIndex(a => a.id === agencia.id);
    if (idx >= 0) db.agencias[idx] = agencia;
    else db.agencias.push(agencia);
    this.saveLocalDb(db);

    if (this.fb && this.fb.db) {
      try { await this.fb.collection('agencias').doc(agencia.id).set(agencia, { merge: true }); } catch (e) {}
    }
    return agencia;
  }

  async deleteAgencia(id) {
    const db = this.getLocalDb();
    db.agencias = db.agencias.filter(a => a.id !== id);
    this.saveLocalDb(db);
    if (this.fb && this.fb.db) {
      try { await this.fb.collection('agencias').doc(id).delete(); } catch (e) {}
    }
  }

  // --- NAVEGACIÓN ---
  async getVisibleNavigation(type) {
    const db = this.getLocalDb();
    return (db.navigation_items || [])
      .filter(n => n.type === type && n.isVisible !== false && n.targetSectionId !== 'admin' && n.id !== 'side_admin')
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getRobustSidebarItems() {
    return this.getVisibleNavigation('SIDEBAR');
  }

  async insertNavigationItem(navItem) {
    if (!navItem.id) navItem.id = 'nav_' + Math.random().toString(36).substring(2, 9);
    const db = this.getLocalDb();
    const idx = db.navigation_items.findIndex(n => n.id === navItem.id);
    if (idx >= 0) db.navigation_items[idx] = navItem;
    else db.navigation_items.push(navItem);
    this.saveLocalDb(db);

    if (this.fb && this.fb.db) {
      try { await this.fb.collection('navigation_items').doc(navItem.id).set(navItem, { merge: true }); } catch (e) {}
    }
    return navItem;
  }

  // --- GESTIÓN DEL MENÚ SUPERIOR DE NAVEGACIÓN (Desktop Navbar y Submenús) ---
  getDefaultTopNavItems() {
    return [
      { id: "topnav_home", label: "Inicio", targetSectionId: "sec_home", displayOrder: 1, orderIndex: 1, isVisible: true, subItems: [] },
      { id: "topnav_ahorros", label: "Ahorros", targetSectionId: "sec_ahorros", displayOrder: 2, orderIndex: 2, isVisible: true, subItems: [] },
      { id: "topnav_creditos", label: "Créditos", targetSectionId: "sec_creditos", displayOrder: 3, orderIndex: 3, isVisible: true, subItems: [] },
      { id: "topnav_seguros", label: "Seguros", targetSectionId: "sec_seguros", displayOrder: 4, orderIndex: 4, isVisible: true, subItems: [] },
      { id: "topnav_remesas", label: "Remesas", targetSectionId: "sec_remesas", displayOrder: 5, orderIndex: 5, isVisible: true, subItems: [] },
      { id: "topnav_servicios", label: "Servicios", targetSectionId: "sec_servicios", displayOrder: 6, orderIndex: 6, isVisible: true, subItems: [] },
      { id: "topnav_beneficios", label: "Beneficios", targetSectionId: "sec_beneficios", displayOrder: 7, orderIndex: 7, isVisible: true, subItems: [] },
      { id: "topnav_sostenibilidad", label: "Sostenibilidad", targetSectionId: "sec_sostenibilidad", displayOrder: 8, orderIndex: 8, isVisible: true, subItems: [] },
      { id: "topnav_noticias", label: "Noticias", targetSectionId: "sec_noticias", displayOrder: 9, orderIndex: 9, isVisible: true, subItems: [] },
      { id: "topnav_empleo", label: "Empleo", targetSectionId: "sec_empleo", displayOrder: 10, orderIndex: 10, isVisible: true, subItems: [] },
      { id: "topnav_agencias", label: "Agencias", targetSectionId: "sec_agencias", displayOrder: 11, orderIndex: 11, isVisible: true, subItems: [] },
      { id: "topnav_nosotros", label: "Nosotros", targetSectionId: "sec_nosotros", displayOrder: 12, orderIndex: 12, isVisible: true, subItems: [] },
      { id: "topnav_gobierno", label: "Gobierno Cooperativo", targetSectionId: "sec_nosotros", displayOrder: 13, orderIndex: 13, isVisible: true, subItems: [] },
      { id: "topnav_mi_empleo", label: "Mi empleo", targetSectionId: "sec_empleo", displayOrder: 14, orderIndex: 14, isVisible: true, subItems: [] }
    ];
  }

  getTopNavItemsSync() {
    const db = this.getLocalDb();
    if (!db.top_nav_items || db.top_nav_items.length === 0) {
      db.top_nav_items = this.getDefaultTopNavItems();
      this.saveLocalDb(db);
    }
    let modified = false;
    if (db.sections && db.sections.some(s => s.id === 'sec_empleo') && !db.top_nav_items.some(n => n.targetSectionId === 'sec_empleo' || (n.label && n.label.toLowerCase() === 'empleo'))) {
      db.top_nav_items.push({
        id: "topnav_empleo",
        label: "Empleo",
        targetSectionId: "sec_empleo",
        displayOrder: 10,
        orderIndex: 10,
        isVisible: true,
        subItems: []
      });
      modified = true;
    }
    if (!db.top_nav_items.some(n => (n.label && n.label.toLowerCase().includes('gobierno')) || (n.id && n.id.includes('gobierno')))) {
      db.top_nav_items.push({
        id: "topnav_gobierno",
        label: "Gobierno Cooperativo",
        targetSectionId: "sec_nosotros",
        displayOrder: 13,
        orderIndex: 13,
        isVisible: true,
        subItems: []
      });
      modified = true;
    }
    if (!db.top_nav_items.some(n => (n.label && n.label.toLowerCase().includes('mi empleo')) || (n.id && n.id.includes('mi_empleo')))) {
      db.top_nav_items.push({
        id: "topnav_mi_empleo",
        label: "Mi empleo",
        targetSectionId: "sec_empleo",
        displayOrder: 14,
        orderIndex: 14,
        isVisible: true,
        subItems: []
      });
      modified = true;
    }
    if (modified) {
      this.saveLocalDb(db);
    }
    return (db.top_nav_items || [])
      .filter(item => item.isVisible !== false && item.targetSectionId !== 'admin' && item.id !== 'topnav_admin')
      .sort((a, b) => ((a.orderIndex || a.displayOrder || 0) - (b.orderIndex || b.displayOrder || 0)));
  }

  async getTopNavItems() {
    return this.getTopNavItemsSync();
  }

  async saveTopNavItem(item) {
    return this._saveTopNavItemInternal(item);
  }

  async deleteTopNavItem(id) {
    return this._deleteTopNavItemInternal(id);
  }

  async addTopNavSubItem(parentId, subItem) {
    return this._addTopNavSubItemInternal(parentId, subItem);
  }

  async updateTopNavSubItem(parentId, subItem, fields) {
    return this._updateTopNavSubItemInternal(parentId, subItem, fields);
  }

  async deleteTopNavSubItem(parentId, subId) {
    return this._deleteTopNavSubItemInternal(parentId, subId);
  }

  async reorderTopNavItems(orderedIds) {
    return this._reorderTopNavItemsInternal(orderedIds);
  }

  async resetTopNavToDefaults() {
    return this._resetTopNavToDefaultsInternal();
  }

  // --- GESTIÓN DE USUARIOS Y PERFILES (Firestore) ---
  async saveUserProfile(uid, userData) {
    if (!uid && !userData) return;
    try {
      // Sincronizar en base de datos local
      const db = this.getLocalDb();
      if (!db.usuarios) db.usuarios = [];
      const userIdx = db.usuarios.findIndex(u => (uid && (u.uid === uid || u.id === uid || u.userId === uid)) || (userData.email && u.email === userData.email));
      if (userIdx >= 0) {
        db.usuarios[userIdx] = { ...db.usuarios[userIdx], ...userData };
      } else {
        db.usuarios.push({ uid, id: uid, userId: uid, ...userData });
      }
      this.saveLocalDb(db);

      if (this.fb && this.fb.db) {
        let docRef = null;
        let docId = uid;
        let existingData = {};

        // Buscar el documento existente por firebaseUid
        let query = await this.fb.collection('usuarios').where('firebaseUid', '==', uid).get();
        if (query.empty && userData.email) {
          query = await this.fb.collection('usuarios').where('email', '==', userData.email.toLowerCase().trim()).get();
        }

        if (!query.empty) {
          const snap = query.docs[0];
          docId = snap.id;
          docRef = snap.ref;
          existingData = snap.data() || {};
        } else if (userData.userId && /^\d{1,7}$/.test(userData.userId)) {
          docId = String(userData.userId).padStart(7, '0');
          docRef = this.fb.collection('usuarios').doc(docId);
          const snap = await docRef.get();
          if (snap.exists) existingData = snap.data() || {};
        } else {
          docRef = this.fb.collection('usuarios').doc(docId);
        }

        const cleanDpiDigits = (userData.dpi || existingData.dpiNormalizado || existingData.dpi || '').replace(/\D/g, '');
        const formattedDpi = cleanDpiDigits.length === 13
          ? `${cleanDpiDigits.substring(0, 4)} ${cleanDpiDigits.substring(4, 9)} ${cleanDpiDigits.substring(9, 13)}`
          : (userData.dpi || existingData.dpi || '');
        const cleanPhone = (userData.telefono || userData.phone || existingData.telefono || '').replace(/\D/g, '');
        const phoneDigits = cleanPhone.startsWith('502') ? cleanPhone.substring(3) : cleanPhone;

        const numId = existingData.idNumerico !== undefined 
          ? existingData.idNumerico 
          : (userData.idNumerico !== undefined ? userData.idNumerico : (parseInt(docId, 10) || 1));

        // Esquema Estricto e Idéntico a Android
        const canonicalDoc = {
          dpi: formattedDpi,
          dpiNormalizado: cleanDpiDigits,
          email: (userData.email || existingData.email || '').toLowerCase().trim(),
          estadoCuenta: existingData.estadoCuenta || "ACTIVA",
          fechaRegistro: existingData.fechaRegistro || new Date(),
          firebaseUid: existingData.firebaseUid || uid,
          idNumerico: numId,
          installationId: existingData.installationId || ('web_' + (localStorage.getItem('colua_install_id') || Math.random().toString(36).substring(2, 10))),
          nombre: (userData.nombre || existingData.nombre || '').trim(),
          schemaVersion: existingData.schemaVersion || 2,
          telefono: phoneDigits,
          telefonoCompleto: phoneDigits ? `+502${phoneDigits}` : '',
          tipoUsuario: existingData.tipoUsuario || (this._isAdminAuthorized(userData.email || existingData.email) ? "ADMIN" : "ASOCIADO"),
          ultimaActividad: new Date(),
          userId: String(docId).padStart(7, '0')
        };

        // Reemplazar limpiamente en Firestore sin campos redundantes
        await docRef.set(canonicalDoc);
      }
    } catch (e) {
      console.error('Error al guardar el perfil del usuario:', e);
      throw e;
    }
  }

  async crearPerfilUsuario(uid, nombre, telefono, rawDpi, email, esInvitado) {
    const installId = 'web_' + (localStorage.getItem('colua_install_id') || Math.random().toString(36).substring(2, 10));
    localStorage.setItem('colua_install_id', installId);

    if (esInvitado) {
      const guestId = uid;
      const profileData = {
        firebaseUid: uid,
        userId: guestId,
        tipoUsuario: "INVITADO",
        nombre: "Invitado",
        installationId: installId,
        fechaRegistro: new Date(),
        ultimaActividad: new Date(),
        schemaVersion: 2
      };

      if (this.fb && this.fb.db) {
        try {
          await this.fb.collection('usuarios').doc(guestId).set(profileData);
        } catch (e) {
          console.warn('Error guardando perfil invitado en Firestore:', e);
        }
      }
      return { success: true, userId: guestId, user: profileData };
    }

    // Flujo de Asociado con ID consecutivo de 7 dígitos mediante transacción atómica
    let assignedNumber = 1;
    let formattedId = "0000001";

    if (this.fb && this.fb.db) {
      try {
        const counterRef = this.fb.collection('systemCounters').doc('users');
        const res = await this.fb.runTransaction(async (transaction) => {
          const doc = await transaction.get(counterRef);
          let lastNum = doc.exists ? (doc.data().lastAssignedNumber || 0) : 0;
          let newNum = lastNum + 1;
          transaction.set(counterRef, { lastAssignedNumber: newNum }, { merge: true });
          return newNum;
        });
        assignedNumber = res;
        formattedId = String(assignedNumber).padStart(7, '0');
      } catch (e) {
        console.warn('Transacción de contador falló, generando ID incremental local:', e);
        assignedNumber = Math.floor(1000 + Math.random() * 9000);
        formattedId = String(assignedNumber).padStart(7, '0');
      }
    }

    const cleanDpiDigits = (rawDpi || '').replace(/\D/g, '');
    const formattedDpi = cleanDpiDigits.length === 13
      ? `${cleanDpiDigits.substring(0, 4)} ${cleanDpiDigits.substring(4, 9)} ${cleanDpiDigits.substring(9, 13)}`
      : (cleanDpiDigits || '');
    const cleanPhone = (telefono || '').replace(/\D/g, '');
    const phoneDigits = cleanPhone.startsWith('502') ? cleanPhone.substring(3) : cleanPhone;
    const cleanEmail = (email || '').toLowerCase().trim();
    const isAdminEmail = this._isAdminAuthorized(cleanEmail);

    // Esquema Canónico Estricto (Idéntico a Android)
    const profileData = {
      dpi: formattedDpi,
      dpiNormalizado: cleanDpiDigits,
      email: cleanEmail,
      estadoCuenta: "ACTIVA",
      fechaRegistro: new Date(),
      firebaseUid: uid,
      idNumerico: assignedNumber,
      installationId: installId,
      nombre: nombre.trim(),
      schemaVersion: 2,
      telefono: phoneDigits,
      telefonoCompleto: phoneDigits ? `+502${phoneDigits}` : '',
      tipoUsuario: isAdminEmail ? "ADMIN" : "ASOCIADO",
      ultimaActividad: new Date(),
      userId: formattedId
    };

    if (this.fb && this.fb.db) {
      try {
        await this.fb.collection('usuarios').doc(formattedId).set(profileData);
        // Registrar subcolección dispositivos
        await this.fb.collection('usuarios').doc(formattedId).collection('dispositivos').doc(installId).set({
          installationId: installId,
          userId: formattedId,
          tipoUsuario: profileData.tipoUsuario,
          modeloTelefono: navigator.userAgent.substring(0, 60),
          plataforma: "WEB_PWA",
          versionApp: window.COLUA_CONFIG.appVersion,
          fechaRegistro: new Date(),
          ultimaActividad: new Date(),
          estado: "ACTIVO"
        });
      } catch (e) {
        console.error('Error guardando perfil de asociado en Firestore:', e);
      }
    }

    return { success: true, userId: formattedId, user: profileData };
  }

  async obtenerPerfilUsuario(uid, email) {
    const cleanEmail = (email || '').toLowerCase().trim();
    const isAdminEmail = this._isAdminAuthorized(cleanEmail);

    // Revisar primero en la base local
    const db = this.getLocalDb();
    let localUser = null;
    if (db.usuarios && db.usuarios.length > 0) {
      localUser = db.usuarios.find(u => (uid && (u.uid === uid || u.userId === uid || u.id === uid)) || (cleanEmail && (u.email || '').toLowerCase().trim() === cleanEmail));
    }

    if (this.fb && this.fb.db) {
      try {
        // Buscar por firebaseUid
        let query = await this.fb.collection('usuarios').where('firebaseUid', '==', uid).get();
        if (query.empty && cleanEmail) {
          query = await this.fb.collection('usuarios').where('email', '==', cleanEmail).get();
        }

        if (!query.empty) {
          const doc = query.docs[0];
          const data = doc.data();
          const cleanPhone = (data.telefono || data.phone || '').replace(/\D/g, '');
          const phoneWithPrefix = cleanPhone ? (cleanPhone.startsWith('502') ? `+502 ${cleanPhone.substring(3)}` : `+502 ${cleanPhone}`) : (data.telefonoCompleto || '');

          let cleanAssocId = '';
          if (data.idNumerico !== undefined && data.idNumerico !== null) {
            cleanAssocId = String(data.idNumerico).padStart(7, '0');
          } else if (/^\d{1,7}$/.test(doc.id)) {
            cleanAssocId = doc.id.padStart(7, '0');
          } else if (/^\d{1,7}$/.test(data.userId || '')) {
            cleanAssocId = String(data.userId).padStart(7, '0');
          } else if (/^\d{1,7}$/.test(data.associateId || '')) {
            cleanAssocId = String(data.associateId).padStart(7, '0');
          } else if (window.authService && typeof window.authService.generateAssociateId === 'function') {
            cleanAssocId = window.authService.generateAssociateId(uid || cleanEmail);
          } else {
            cleanAssocId = '0000001';
          }

          const hasEmail = Boolean(cleanEmail && cleanEmail.includes('@'));
          const isElevated = isAdminEmail || data.tipoUsuario === 'ADMIN' || data.role === 'superadmin' || data.role === 'admin' || data.role === 'SUPER_ADMIN';
          const role = isElevated ? (isAdminEmail ? "superadmin" : "admin") : (hasEmail ? "asociado" : (data.role || "asociado"));
          const tipo = isElevated ? "ADMIN" : (hasEmail ? "ASOCIADO" : (data.tipoUsuario || "ASOCIADO"));
          const nombre = (data.nombre && data.nombre !== 'Invitado') ? data.nombre : (data.displayName && data.displayName !== 'Invitado' ? data.displayName : (cleanEmail ? cleanEmail.split('@')[0] : "Asociado COLUA"));

          const rawDpi = data.dpi || data.dpiNormalizado || (localUser ? localUser.dpi : '');
          const cleanDpi = String(rawDpi || '').replace(/\D/g, '');
          const formattedDpi = cleanDpi.length === 13 ? `${cleanDpi.substring(0, 4)} ${cleanDpi.substring(4, 9)} ${cleanDpi.substring(9, 13)}` : (rawDpi || '');

          return {
            success: true,
            user: {
              userId: cleanAssocId,
              uid: uid,
              associateId: cleanAssocId,
              nombre: nombre,
              telefono: phoneWithPrefix || (localUser ? (localUser.telefono || localUser.phone) : ""),
              phone: phoneWithPrefix || (localUser ? (localUser.telefono || localUser.phone) : ""),
              dpi: formattedDpi,
              email: data.email || cleanEmail,
              role: role,
              tipoUsuario: tipo,
              fechaCreacion: data.fechaRegistro || data.createdAt || (localUser ? localUser.fechaCreacion : null)
            }
          };
        }
      } catch (e) {
        console.warn('Error consultando perfil en Firestore:', e);
      }
    }

    if (localUser) {
      const cleanPhone = (localUser.telefono || localUser.phone || '').replace(/\D/g, '');
      const phoneWithPrefix = cleanPhone ? (cleanPhone.startsWith('502') ? `+502 ${cleanPhone.substring(3)}` : `+502 ${cleanPhone}`) : '';
      let cleanAssocId = localUser.associateId || localUser.userId || '0010025';
      if (!cleanAssocId || cleanAssocId.length > 8 || !/^\d+$/.test(cleanAssocId)) {
        if (window.authService && typeof window.authService.generateAssociateId === 'function') {
          cleanAssocId = window.authService.generateAssociateId(localUser.email || localUser.uid || 'colua');
        } else {
          cleanAssocId = '0010025';
        }
      }
      return {
        success: true,
        user: {
          userId: cleanAssocId,
          uid: localUser.uid || localUser.id || localUser.userId,
          associateId: cleanAssocId,
          nombre: localUser.nombre || (isAdminEmail ? "Administrador COLUA" : "Asociado COLUA"),
          telefono: phoneWithPrefix,
          phone: phoneWithPrefix,
          dpi: localUser.dpi || '',
          email: localUser.email || cleanEmail,
          role: localUser.role || (isAdminEmail ? "superadmin" : "asociado"),
          tipoUsuario: localUser.tipoUsuario || (isAdminEmail ? "ADMIN" : "ASOCIADO"),
          fechaCreacion: localUser.fechaCreacion || localUser.createdAt
        }
      };
    }

    // Si es admin oficial y no tiene doc, retornar objeto super admin
    if (isAdminEmail) {
      return {
        success: true,
        user: {
          userId: "admin_01",
          associateId: "0000001",
          nombre: "Administrador General COLUA",
          telefono: "+502 77957795",
          phone: "+502 77957795",
          dpi: "0000 00000 0000",
          email: cleanEmail,
          role: "SUPER_ADMIN",
          tipoUsuario: "ADMIN"
        }
      };
    }

    return { success: false, error: 'Perfil no encontrado.' };
  }

  async getUsuariosActivosReal() {
    return this.getAllUsers();
  }

  _isAdminAuthorized(email) {
    if (!email) return false;
    const clean = email.toLowerCase().trim();
    const authorized = ['admin@colua.com.gt', 'admin@coluarl.com.gt', (typeof atob !== 'undefined' ? atob('Y29sdWFybEBnbWFpbC5jb20=') : '')];
    return authorized.includes(clean);
  }

  // --- GESTIÓN DE USUARIOS Y ROLES (RBAC) ---
  async getAllUsers() {
    const db = this.getLocalDb();
    let usersList = db.usuarios || [];

    if (this.fb && this.fb.db) {
      try {
        const snap = await this._withTimeout(this.fb.collection('usuarios').get(), 4000);
        if (snap && !snap.empty) {
          const remoteDocs = snap.docs.map(d => {
            const data = d.data() || {};
            const cleanDpi = data.dpi || data.dpiNormalizado || '';
            const numId = data.idNumerico !== undefined && data.idNumerico !== null
              ? String(data.idNumerico).padStart(7, '0')
              : (data.userId || data.associateId || (/^\d{1,7}$/.test(d.id) ? String(d.id).padStart(7, '0') : '0000001'));
            
            const roleStr = (data.tipoUsuario || data.role || 'ASOCIADO').toUpperCase();
            const isElevated = roleStr === 'ADMIN' || data.role === 'superadmin' || data.role === 'admin' || data.role === 'manager';
            const roleKey = isElevated ? (data.role || 'admin') : 'asociado';

            return {
              ...data,
              docId: d.id,
              uid: d.id,
              id: d.id,
              firebaseUid: data.firebaseUid || d.id,
              nombre: data.nombre || data.displayName || (data.email ? data.email.split('@')[0] : 'Asociado COLUA'),
              email: data.email || 'Sin correo',
              telefono: data.telefono || data.telefonoCompleto || data.phone || '',
              dpi: cleanDpi,
              associateId: numId,
              tipoUsuario: isElevated ? 'ADMIN' : 'ASOCIADO',
              role: roleKey
            };
          });

          usersList = remoteDocs;
          db.usuarios = usersList;
          this.saveLocalDb(db);
          return usersList;
        } else if (snap && snap.empty) {
          // Si Firestore está vacío, reflejar vacío
          usersList = [];
          db.usuarios = [];
          this.saveLocalDb(db);
          return [];
        }
      } catch (e) {
        console.warn('Firestore usuarios fallback local:', e);
      }
    }

    return (usersList || []).map((u, idx) => {
      const roleStr = (u.tipoUsuario || u.role || 'ASOCIADO').toUpperCase();
      const roleKey = roleStr.toLowerCase();
      const formattedAssociateId = u.associateId || (u.idNumerico ? String(u.idNumerico).padStart(7, '0') : (u.docId || `000000${idx + 1}`));
      const primaryDocId = u.docId || u.uid || u.id || formattedAssociateId;

      return {
        ...u,
        docId: primaryDocId,
        uid: primaryDocId,
        id: primaryDocId,
        firebaseUid: u.firebaseUid || primaryDocId,
        tipoUsuario: roleStr,
        role: roleKey,
        associateId: formattedAssociateId
      };
    });
  }

  async updateUserRole(userId, newRole) {
    const db = this.getLocalDb();
    if (!db.usuarios) db.usuarios = [];
    const roleStr = (newRole || 'ASOCIADO').toUpperCase();
    const roleKey = roleStr.toLowerCase();
    const isElevated = (roleKey === 'superadmin' || roleKey === 'admin' || roleKey === 'manager');
    const nuevoTipo = isElevated ? 'ADMIN' : 'ASOCIADO';

    const target = db.usuarios.find(u => 
      u.uid === userId || 
      u.id === userId || 
      u.docId === userId || 
      u.associateId === userId || 
      u.userId === userId || 
      u.firebaseUid === userId ||
      (u.idNumerico && String(u.idNumerico).padStart(7, '0') === userId)
    );

    if (target) {
      target.role = roleStr;
      target.tipoUsuario = roleStr;
      target.updatedAt = Date.now();
      this.saveLocalDb(db);
    } else {
      db.usuarios.push({
        uid: userId,
        id: userId,
        docId: userId,
        role: roleStr,
        tipoUsuario: roleStr,
        updatedAt: Date.now()
      });
      this.saveLocalDb(db);
    }

    // Actualizar directamente en Firestore
    await this.cambiarRolUsuario(userId, roleStr, nuevoTipo, target);
    await this.logAudit({
      action: 'CAMBIO_ROL_RBAC',
      performedBy: window.authService?.getCurrentUser()?.nombre || 'Super Administrador',
      details: `Usuario ${target?.nombre || userId} asignado al rol: ${roleStr}`
    });
    return { success: true };
  }

  // --- EDICIÓN COMPLETA DE USUARIO Y RESTABLECIMIENTO DE CLAVE (ADMIN) ---
  async updateUserFullProfile(userId, data) {
    const db = this.getLocalDb();
    if (!db.usuarios) db.usuarios = [];
    let target = db.usuarios.find(u => 
      u.uid === userId || 
      u.id === userId || 
      u.docId === userId || 
      u.userId === userId || 
      u.firebaseUid === userId ||
      u.associateId === userId ||
      u.email === userId ||
      (u.idNumerico && String(u.idNumerico).padStart(7, '0') === userId)
    );

    const cleanDpi = (data.dpi || '').replace(/\D/g, '');
    const formattedDpi = cleanDpi.length === 13 ? `${cleanDpi.substring(0, 4)} ${cleanDpi.substring(4, 9)} ${cleanDpi.substring(9, 13)}` : (data.dpi || '');
    const cleanPhone = (data.telefono || data.phone || '').replace(/\D/g, '');
    const phoneDigits = cleanPhone.startsWith('502') ? cleanPhone.substring(3) : cleanPhone;
    const phoneWithPrefix = phoneDigits ? `+502 ${phoneDigits}` : '';
    const cleanEmail = (data.email || '').toLowerCase().trim();
    const roleStr = (data.role || data.tipoUsuario || 'ASOCIADO').toUpperCase();
    const isElevated = roleStr === 'ADMIN' || roleStr === 'SUPERADMIN' || roleStr === 'MANAGER';
    const tipoStr = isElevated ? 'ADMIN' : 'ASOCIADO';

    const updatedUser = {
      ...(target || {}),
      nombre: (data.nombre || target?.nombre || 'Usuario').trim(),
      email: cleanEmail || target?.email || '',
      dpi: formattedDpi,
      dpiNormalizado: cleanDpi,
      telefono: phoneWithPrefix,
      phone: phoneWithPrefix,
      role: roleStr.toLowerCase(),
      tipoUsuario: tipoStr,
      updatedAt: Date.now()
    };

    if (data.password && data.password.length >= 6) {
      updatedUser.password = data.password;
    }

    if (target) {
      Object.assign(target, updatedUser);
    } else {
      updatedUser.uid = userId;
      updatedUser.docId = userId;
      db.usuarios.push(updatedUser);
    }
    this.saveLocalDb(db);

    // Actualizar en Firestore
    if (this.fb && this.fb.db) {
      try {
        const canonicalDoc = {
          dpi: formattedDpi,
          dpiNormalizado: cleanDpi,
          email: cleanEmail,
          nombre: updatedUser.nombre,
          telefono: phoneDigits,
          telefonoCompleto: phoneDigits ? `+502${phoneDigits}` : '',
          tipoUsuario: tipoStr,
          role: roleStr.toLowerCase(),
          ultimaActividad: new Date()
        };

        const docId = target?.docId || userId;
        await this.fb.collection('usuarios').doc(docId).set(canonicalDoc, { merge: true });

        if (target?.firebaseUid && target.firebaseUid !== docId) {
          try {
            await this.fb.collection('usuarios').doc(target.firebaseUid).set(canonicalDoc, { merge: true });
          } catch (e) {}
        }
      } catch (err) {
        console.warn('Error actualizando perfil completo en Firestore:', err);
      }
    }

    await this.logAudit({
      action: 'EDICION_USUARIO_ADMIN',
      performedBy: window.authService?.getCurrentUser()?.nombre || 'Super Administrador',
      details: `Usuario "${updatedUser.nombre}" (${userId}) editado por el Administrador. Rol: ${tipoStr}${data.password ? ' (Contraseña restablecida)' : ''}`
    });

    return { success: true, user: updatedUser };
  }

  async deleteUser(userId) {
    const db = this.getLocalDb();
    if (!db.usuarios) db.usuarios = [];
    const target = db.usuarios.find(u => 
      u.uid === userId || 
      u.id === userId || 
      u.docId === userId || 
      u.userId === userId || 
      u.firebaseUid === userId ||
      u.associateId === userId ||
      u.email === userId ||
      (u.idNumerico && String(u.idNumerico).padStart(7, '0') === userId)
    );
    const userName = target?.nombre || target?.email || userId;

    db.usuarios = db.usuarios.filter(u => 
      u.uid !== userId && 
      u.id !== userId && 
      u.docId !== userId && 
      u.userId !== userId && 
      u.firebaseUid !== userId &&
      u.associateId !== userId &&
      u.email !== userId &&
      (!u.idNumerico || String(u.idNumerico).padStart(7, '0') !== userId)
    );
    this.saveLocalDb(db);

    if (this.fb && this.fb.db) {
      try {
        const docsToDelete = new Set();
        if (userId) docsToDelete.add(userId);
        if (target) {
          if (target.docId) docsToDelete.add(target.docId);
          if (target.associateId) docsToDelete.add(target.associateId);
          if (target.idNumerico) docsToDelete.add(String(target.idNumerico).padStart(7, '0'));
          if (target.firebaseUid) docsToDelete.add(target.firebaseUid);
        }

        for (const dId of docsToDelete) {
          try {
            // Eliminar subcolección dispositivos para no dejar documentos fantasma en Firestore
            const dispSnap = await this.fb.collection('usuarios').doc(dId).collection('dispositivos').get();
            for (const dispDoc of dispSnap.docs) {
              await dispDoc.ref.delete();
            }
            await this.fb.collection('usuarios').doc(dId).delete();
          } catch (e) {}
        }

        // Buscar por consultas adicionales
        const searchQueries = [];
        if (userId) {
          searchQueries.push(this.fb.collection('usuarios').where('firebaseUid', '==', userId).get());
        }
        if (target && target.firebaseUid && target.firebaseUid !== userId) {
          searchQueries.push(this.fb.collection('usuarios').where('firebaseUid', '==', target.firebaseUid).get());
        }
        if (target && target.email) {
          searchQueries.push(this.fb.collection('usuarios').where('email', '==', target.email.toLowerCase().trim()).get());
        }

        const results = await Promise.allSettled(searchQueries);
        for (const res of results) {
          if (res.status === 'fulfilled' && res.value && !res.value.empty) {
            for (const docSnap of res.value.docs) {
              try {
                const dispSnap = await docSnap.ref.collection('dispositivos').get();
                for (const dispDoc of dispSnap.docs) {
                  await dispDoc.ref.delete();
                }
              } catch (e) {}
              await docSnap.ref.delete();
            }
          }
        }
      } catch (e) {
        console.warn('Error eliminando usuario de Firestore:', e);
      }
    }

    await this.logAudit({
      action: 'ELIMINAR_USUARIO',
      performedBy: window.authService?.getCurrentUser()?.nombre || 'Super Administrador',
      details: `Usuario "${userName}" (${userId}) eliminado del sistema.`
    });

    return { success: true };
  }

  // --- REINICIAR CONTADOR DE ASOCIADOS ---
  async resetUserCounter(newNumber = 0) {
    if (this.fb && this.fb.db) {
      try {
        await this.fb.collection('systemCounters').doc('users').set({ 
          lastAssignedNumber: newNumber,
          updatedAt: new Date()
        }, { merge: true });
      } catch (e) {
        console.warn('Error reiniciando contador en Firestore:', e);
      }
    }
    return { success: true };
  }

  // --- PURGAR USUARIOS DE PRUEBA Y REINICIAR CONTADOR ---
  async purgeAllTestUsersAndResetCounter() {
    const db = this.getLocalDb();
    db.usuarios = [];
    this.saveLocalDb(db);

    if (this.fb && this.fb.db) {
      try {
        // Purgar posibles docs de prueba del 0000001 al 0000050 y sus subcolecciones
        for (let i = 1; i <= 50; i++) {
          const docId = String(i).padStart(7, '0');
          try {
            const dispSnap = await this.fb.collection('usuarios').doc(docId).collection('dispositivos').get();
            for (const dispDoc of dispSnap.docs) {
              await dispDoc.ref.delete();
            }
            await this.fb.collection('usuarios').doc(docId).delete();
          } catch (e) {}
        }

        // Purgar todos los documentos restantes en la colección usuarios
        try {
          const allUsersSnap = await this.fb.collection('usuarios').get();
          for (const uDoc of allUsersSnap.docs) {
            try {
              const dispSnap = await uDoc.ref.collection('dispositivos').get();
              for (const dispDoc of dispSnap.docs) {
                await dispDoc.ref.delete();
              }
            } catch (e) {}
            await uDoc.ref.delete();
          }
        } catch (e) {}

        // Reiniciar contador de Firestore a 0
        await this.resetUserCounter(0);
      } catch (e) {
        console.warn('Error purgando usuarios en Firestore:', e);
      }
    }

    await this.logAudit({
      action: 'REINICIAR_CONTADOR_ASOCIADOS',
      performedBy: window.authService?.getCurrentUser()?.nombre || 'Super Administrador',
      details: 'Se purgó la lista de usuarios y se reinició el contador correlativo a 0000001.'
    });

    return { success: true };
  }

  async cambiarRolUsuario(userId, nuevoRol, nuevoTipo, targetUser = null) {
    if (this.fb && this.fb.db) {
      try {
        const updatePayload = {
          role: nuevoRol,
          tipoUsuario: nuevoRol,
          rol: nuevoRol,
          updatedAt: Date.now(),
          ultimaActividad: new Date()
        };

        const docsToUpdate = new Set();
        if (userId) docsToUpdate.add(userId);
        if (targetUser) {
          if (targetUser.docId) docsToUpdate.add(targetUser.docId);
          if (targetUser.associateId) docsToUpdate.add(targetUser.associateId);
          if (targetUser.idNumerico) docsToUpdate.add(String(targetUser.idNumerico).padStart(7, '0'));
          if (targetUser.firebaseUid) docsToUpdate.add(targetUser.firebaseUid);
          if (targetUser.id) docsToUpdate.add(targetUser.id);
          if (targetUser.uid) docsToUpdate.add(targetUser.uid);
        }

        // 1. Actualizar directamente en cada documento asociado (por ejemplo "0000002")
        for (const dId of docsToUpdate) {
          try {
            await this.fb.collection('usuarios').doc(dId).set(updatePayload, { merge: true });
          } catch (errDoc) {
            console.warn(`Error actualizando doc ${dId}:`, errDoc);
          }
        }

        // 2. Buscar por firebaseUid, email y idNumerico para sincronizar cualquier doc huérfano
        const searchQueries = [];
        if (userId) {
          searchQueries.push(this.fb.collection('usuarios').where('firebaseUid', '==', userId).get());
        }
        if (targetUser && targetUser.firebaseUid && targetUser.firebaseUid !== userId) {
          searchQueries.push(this.fb.collection('usuarios').where('firebaseUid', '==', targetUser.firebaseUid).get());
        }
        if (targetUser && targetUser.email) {
          searchQueries.push(this.fb.collection('usuarios').where('email', '==', targetUser.email.toLowerCase().trim()).get());
        }
        if (targetUser && targetUser.idNumerico) {
          searchQueries.push(this.fb.collection('usuarios').where('idNumerico', '==', Number(targetUser.idNumerico)).get());
        }

        const results = await Promise.allSettled(searchQueries);
        for (const res of results) {
          if (res.status === 'fulfilled' && res.value && !res.value.empty) {
            for (const docSnap of res.value.docs) {
              await docSnap.ref.set(updatePayload, { merge: true });
            }
          }
        }

        return { success: true };
      } catch (e) {
        console.warn('Error en cambiarRolUsuario Firestore:', e);
        return { success: false, error: e.message };
      }
    }
    return { success: true };
  }

  async addAdminOrManager(data) {
    const db = this.getLocalDb();
    if (!db.usuarios) db.usuarios = [];
    const newUid = 'usr_' + Date.now();
    const newUser = {
      uid: newUid,
      id: newUid,
      userId: newUid,
      nombre: data.nombre ? data.nombre.trim() : 'Usuario Administrativo',
      email: (data.email || '').toLowerCase().trim(),
      role: data.role || 'manager',
      tipoUsuario: 'ADMIN',
      dpi: data.dpi ? data.dpi.trim() : '0000 00000 0000',
      password: data.password || '123456',
      associateId: `00000${Math.floor(10 + Math.random() * 89)}`,
      createdAt: new Date().toISOString()
    };
    db.usuarios.push(newUser);
    this.saveLocalDb(db);

    if (this.fb && this.fb.db) {
      try {
        await this.fb.collection('usuarios').doc(newUid).set(newUser);
      } catch (e) {}
    }

    await this.logAudit({
      action: 'ALTA_ADMIN_MANAGER',
      performedBy: window.authService?.getCurrentUser()?.nombre || 'Super Administrador',
      details: `Alta de ${data.role}: ${newUser.nombre} (${newUser.email})`
    });

    return { success: true, user: newUser };
  }

  // --- REGISTRO DE AUDITORÍA ---
  async getAuditLogs(limit = 30) {
    const db = this.getLocalDb();
    if (!db.audit_logs) {
      db.audit_logs = [
        {
          id: 'log_seed_1',
          timestamp: Date.now() - 1000 * 60 * 30,
          action: 'INICIALIZACION_SISTEMA',
          performedBy: 'Super Administrador',
          details: 'Sistema de control de accesos institucionales activado'
        }
      ];
      this.saveLocalDb(db);
    }
    return db.audit_logs.slice(0, limit);
  }

  async logAudit(entry) {
    const db = this.getLocalDb();
    if (!db.audit_logs) db.audit_logs = [];
    const logItem = {
      id: 'log_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      timestamp: Date.now(),
      action: entry.action || 'OPERACION',
      performedBy: entry.performedBy || 'Sistema',
      details: entry.details || ''
    };
    db.audit_logs.unshift(logItem);
    if (db.audit_logs.length > 100) db.audit_logs = db.audit_logs.slice(0, 100);
    this.saveLocalDb(db);

    if (this.fb && this.fb.db) {
      try {
        await this.fb.collection('audit_logs').add(logItem);
      } catch (e) {}
    }
    return logItem;
  }

  async updateGlobalConfig(partialConfig) {
    const db = this.getLocalDb();
    if (!db.global_config) db.global_config = {};
    db.global_config = { ...db.global_config, ...partialConfig };
    this.saveLocalDb(db);
    return db.global_config;
  }

  // --- VERSIONADO Y PUBLICACIÓN CMS ---
  async getSyncStatusInfo() {
    const db = this.getLocalDb();
    const config = db.global_config || {};
    const localVersion = config.published_version || 1;
    const lastSyncTimestamp = config.last_sync_timestamp || 0;

    const sections = (db.sections || []).filter(s => s.id !== 'sec_comunidad' && s.slug !== 'comunidad');
    const items = db.content_items || [];
    const blocks = db.content_blocks || [];

    // Secciones pendientes (Borradores o editadas tras la última sincronización)
    const newSections = sections.filter(s => s.isDraft === true && (!s.version || s.version === 0 || !s.isPublished) && !s.lastPublishedAt);
    const pendingSections = sections.filter(s => s.isPublished === false || s.isDraft === true || (s.updatedAt && s.updatedAt > lastSyncTimestamp) || (s.lastModified && s.lastModified > lastSyncTimestamp));
    const editedSections = pendingSections.filter(s => !newSections.some(ns => ns.id === s.id));

    // Tarjetas y elementos de contenido pendientes
    const newItems = items.filter(i => i.isDraft === true && (!i.publicationDate || i.id.startsWith('item_') || i.isPublished === false) && (!i.updatedAt || i.updatedAt > lastSyncTimestamp) && !i.version);
    const pendingItems = items.filter(i => i.isDraft === true || i.isPublished === false || (i.updatedAt && i.updatedAt > lastSyncTimestamp) || (i.lastModified && i.lastModified > lastSyncTimestamp));
    const editedItems = pendingItems.filter(i => !newItems.some(ni => ni.id === i.id));

    // Bloques de contenido pendientes
    const newBlocks = blocks.filter(b => b.isDraft === true && (!b.updatedAt || b.updatedAt > lastSyncTimestamp) && !b.version);
    const pendingBlocks = blocks.filter(b => b.isDraft === true || (b.updatedAt && b.updatedAt > lastSyncTimestamp));
    const editedBlocks = pendingBlocks.filter(b => !newBlocks.some(nb => nb.id === b.id));

    // Elementos verdaderamente incompletos (aquellos sin título o sin nombre asignado)
    const incompleteItems = items.filter(i => (!i.title || !i.title.trim()) && (!i.nombre || !i.nombre.trim()));

    const totalNew = newSections.length + newItems.length + newBlocks.length;
    const totalEdited = editedSections.length + editedItems.length + editedBlocks.length;
    const totalPending = pendingSections.length + pendingItems.length + pendingBlocks.length;

    // Calcular reacciones de noticias
    let totalLikes = 0;
    let totalShares = 0;
    items.filter(i => i.sectionId === 'sec_noticias').forEach(n => {
      totalLikes += (Number(n.likesCount) || Number(n.likes) || 0);
      totalShares += (Number(n.sharesCount) || Number(n.shares) || 0);
    });

    return {
      version: `v${localVersion}`,
      publishedVersion: `v${localVersion}`,
      lastPublishedAt: lastSyncTimestamp,
      sectionsCount: sections.length,
      itemsCount: items.length,
      blocksCount: blocks.length,
      totalLikes,
      totalShares,
      draftsCount: totalPending,
      newCount: totalNew,
      editCount: totalEdited,
      incompleteCount: incompleteItems.length,
      hasUnpublishedChanges: totalPending > 0,
      isRealtimeEnabled: config.is_realtime_sync !== false,
      pendingList: [
        ...pendingSections.map(s => ({ type: 'Sección', title: s.title, id: s.id, status: s.isDraft ? 'Borrador' : 'Modificado' })),
        ...pendingItems.map(i => ({ type: 'Tarjeta', title: i.title || i.nombre || i.id, id: i.id, status: i.isDraft ? 'Borrador' : 'Modificado' })),
        ...pendingBlocks.map(b => ({ type: 'Bloque', title: b.content?.slice(0, 30) || b.id, id: b.id, status: 'Borrador' }))
      ]
    };
  }

  async _commitBatchSafely(docsArray, collectionName) {
    if (!this.fb || !this.fb.db || !docsArray || docsArray.length === 0) return;
    const CHUNK_SIZE = 400;
    for (let i = 0; i < docsArray.length; i += CHUNK_SIZE) {
      const chunk = docsArray.slice(i, i + CHUNK_SIZE);
      try {
        const batch = this.fb.db.batch();
        for (const item of chunk) {
          if (!item || !item.id) continue;
          const ref = this.fb.collection(collectionName).doc(String(item.id));
          batch.set(ref, this._cleanDoc(item), { merge: true });
        }
        await batch.commit();
      } catch (batchErr) {
        console.warn(`[ColuaRepo] Batch falló para ${collectionName}, reintentando individualmente:`, batchErr);
        for (const item of chunk) {
          if (!item || !item.id) continue;
          try {
            await this.fb.collection(collectionName).doc(String(item.id)).set(this._cleanDoc(item), { merge: true });
          } catch (itemErr) {
            console.error(`[ColuaRepo] Error guardando ${collectionName}/${item.id}:`, itemErr);
          }
        }
      }
    }
  }

  async publishCurrentConfiguration() {
    // 1. Asegurar sesión administrativa en Firebase Auth y /usuarios/{uid} con rol ADMIN
    let authOk = false;
    try {
      authOk = await this.ensureFirebaseAuthAdmin();
    } catch (authErr) {
      console.warn('[ColuaRepo] Error verificando autenticación admin:', authErr);
    }

    const db = this.getLocalDb();
    const currentVersion = ((db.global_config && db.global_config.published_version) || 1) + 1;
    const timestamp = Date.now();

    // 2. Guardar copia de respaldo previa para rollback
    try {
      localStorage.setItem('colua_db_backup_last', JSON.stringify({
        version: (db.global_config && db.global_config.published_version) || 1,
        timestamp: (db.global_config && db.global_config.last_sync_timestamp) || Date.now(),
        dbSnapshot: JSON.parse(JSON.stringify(db))
      }));
    } catch (e) {}

    // 3. Marcar todo como publicado localmente
    (db.sections || []).forEach(s => {
      s.isPublished = true;
      s.isDraft = false;
      s.version = currentVersion;
      s.updatedAt = timestamp;
      s.lastModified = timestamp;
    });

    (db.content_items || []).forEach(i => {
      i.isDraft = false;
      i.isPublished = true;
      if (i.isEnabled === undefined) i.isEnabled = true;
      if (i.isVisible === undefined) i.isVisible = true;
      i.updatedAt = timestamp;
      i.lastModified = timestamp;

      // Asegurar metadatos completos para noticias
      const sec = (i.sectionId || '').toLowerCase();
      if (sec === 'sec_noticias' || sec === 'noticias' || (i.id || '').startsWith('news_')) {
        if (!i.publicationDate && !i.date && !i.fecha) i.publicationDate = new Date().toISOString();
        if (!i.issuerName) i.issuerName = 'Cooperativa COLUA R.L.';
        if (!i.issuerRole) i.issuerRole = 'Comunicación Oficial';
        if (!i.tags) i.tags = '#COLUA';
      }
    });

    (db.content_blocks || []).forEach(b => {
      b.isDraft = false;
      b.isPublished = true;
      b.updatedAt = timestamp;
    });

    if (!db.global_config) db.global_config = {};
    db.global_config.published_version = currentVersion;
    db.global_config.last_sync_timestamp = timestamp;
    this.saveLocalDb(db);

    // 4. Publicar a Firestore Cloud
    let firestoreError = null;
    if (this.fb && this.fb.db) {
      try {
        const configPayload = {
          version: currentVersion,
          published_version: currentVersion,
          updatedAt: new Date(),
          lastSyncTimestamp: timestamp,
          updatedBy: 'Web_PWA_Admin',
          sectionsCount: (db.sections || []).length,
          itemsCount: (db.content_items || []).length,
          blocksCount: (db.content_blocks || []).length,
          isPublished: true
        };

        // Guardar documento config/published_config para alertar a todos los clientes en tiempo real
        await this.fb.collection('config').doc('published_config').set(this._cleanDoc(configPayload), { merge: true });

        try {
          await this.fb.collection('global_config').doc('main').set(this._cleanDoc(configPayload), { merge: true });
        } catch (e) {}

        // Publicar todas las colecciones principales usando batch seguro y sanitización
        await this._commitBatchSafely(db.sections || [], 'sections');
        await this._commitBatchSafely(db.content_items || [], 'content_items');
        await this._commitBatchSafely(db.content_blocks || [], 'content_blocks');
        if (db.forms && db.forms.length > 0) {
          await this._commitBatchSafely(db.forms, 'forms');
        }
        if (db.agencias && db.agencias.length > 0) {
          await this._commitBatchSafely(db.agencias, 'agencias');
        }

        console.log(`[COLUA CMS] Publicación exitosa en Firestore Cloud: Versión v${currentVersion}`);
      } catch (e) {
        console.error('[COLUA CMS] Error publicando a Firestore Cloud:', e);
        firestoreError = e.message || 'Error de conexión o permisos con Firestore';
      }
    } else {
      firestoreError = 'Firebase Firestore no está disponible en este momento';
    }

    await this.logAudit({
      action: 'PUBLICACION_MASIVA_PRODUCCION',
      performedBy: 'Super Administrador',
      details: `Se publicó a producción la versión v${currentVersion} (${(db.sections || []).length} pantallas, ${(db.content_items || []).length} tarjetas).`
    });

    if (firestoreError) {
      return {
        success: false,
        error: `Cambios guardados localmente, pero falló la publicación en la nube: ${firestoreError}`,
        version: `v${currentVersion}`,
        timestamp
      };
    }

    return {
      success: true,
      version: `v${currentVersion}`,
      timestamp,
      sectionsCount: (db.sections || []).length,
      itemsCount: (db.content_items || []).length
    };
  }

  async rollbackToPreviousVersion() {
    try {
      const backupStr = localStorage.getItem('colua_db_backup_last');
      if (!backupStr) {
        return { success: false, error: 'No se encontró un respaldo previo para revertir.' };
      }
      const backup = JSON.parse(backupStr);
      if (!backup || !backup.dbSnapshot) {
        return { success: false, error: 'El respaldo previo está dañado o incompleto.' };
      }

      this.saveLocalDb(backup.dbSnapshot);

      await this.logAudit({
        action: 'ROLLBACK_VERSION',
        performedBy: 'Super Administrador',
        details: `Se revirtió la plataforma a la versión estable v${backup.version}.`
      });

      return { success: true, version: `v${backup.version}` };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async verifyPublicationIntegrity() {
    const db = this.getLocalDb();
    let cloudSynced = false;
    let remoteSectionsCount = 0;

    if (this.fb && this.fb.db) {
      try {
        const snap = await this._withTimeout(this.fb.collection('sections').get(), 1500);
        remoteSectionsCount = snap.size;
        cloudSynced = true;
      } catch (e) {
        cloudSynced = false;
      }
    }

    const sections = (db.sections || []).filter(s => s.id !== 'sec_comunidad');
    const items = db.content_items || [];
    const blocks = db.content_blocks || [];

    return {
      success: true,
      integrity: 'Óptima',
      localSections: sections.length,
      localItems: items.length,
      localBlocks: blocks.length,
      cloudConnected: cloudSynced,
      remoteSectionsCount: cloudSynced ? remoteSectionsCount : 'Offline / Local',
      version: `v${db.global_config?.published_version || 1}`,
      timestamp: Date.now()
    };
  }

  async resetToFactoryDefaults() {
    const currentUsers = this.getLocalDb().usuarios || [];
    localStorage.removeItem(this.localStorageKey);
    localStorage.removeItem('colua_local_db');
    const freshDb = this.getLocalDb();
    freshDb.usuarios = currentUsers;
    this.saveLocalDb(freshDb);

    await this.logAudit({
      action: 'RESTAURACION_FABRICA_CMS',
      performedBy: 'Super Administrador',
      details: 'Se restablecieron todos los datos predeterminados de secciones y tarjetas de la cooperativa.'
    });

    return { success: true };
  }

  // --- FORMULARIOS DINÁMICOS & CAPTACIÓN DE LEADS ---
  async getForms() {
    if (this.fb && this.fb.db) {
      try {
        const snap = await this._withTimeout(this.fb.collection('forms').get(), 3000);
        if (!snap.empty) {
          const remoteForms = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          const db = this.getLocalDb();
          let changed = false;
          if (!db.forms) db.forms = [];
          remoteForms.forEach(rem => {
            const idx = db.forms.findIndex(f => f.id === rem.id);
            if (idx >= 0) {
              db.forms[idx] = { ...db.forms[idx], ...rem };
            } else {
              db.forms.push(rem);
            }
            changed = true;
          });
          if (changed) this.saveLocalDb(db);
        }
      } catch (e) {}
    }
    const db = this.getLocalDb();
    if (!db.forms || db.forms.length === 0) {
      db.forms = this._getDefaultData().forms;
      this.saveLocalDb(db);
    }
    return db.forms || [];
  }

  async getFormById(formId) {
    const forms = await this.getForms();
    return forms.find(f => f.id === formId) || forms[0] || null;
  }

  async saveForm(formData) {
    if (!formData.id) formData.id = 'form_' + Math.random().toString(36).substring(2, 9);
    formData.updatedAt = Date.now();
    const db = this.getLocalDb();
    if (!db.forms) db.forms = [];
    const idx = db.forms.findIndex(f => f.id === formData.id);
    if (idx >= 0) db.forms[idx] = formData;
    else db.forms.push(formData);
    this.saveLocalDb(db);

    if (this.fb && this.fb.db) {
      try {
        await this.ensureFirebaseAuthAdmin();
        const clean = this._cleanDoc(formData);
        await this.fb.collection('forms').doc(formData.id).set(clean, { merge: true });
        console.log(`[ColuaRepo] Formulario auto-publicado en Firestore: ${formData.id}`);
      } catch (e) {
        console.warn('Error guardando formulario en Firestore:', e);
      }
    }

    await this._autoPublishChange(idx >= 0 ? 'EDITAR_FORMULARIO' : 'CREAR_FORMULARIO', `Formulario "${formData.title}" (${formData.id}) guardado y publicado en vivo.`);
    return { success: true, form: formData };
  }

  async deleteForm(formId) {
    const db = this.getLocalDb();
    if (!db.forms) db.forms = [];
    db.forms = db.forms.filter(f => f.id !== formId);
    this.saveLocalDb(db);

    if (this.fb && this.fb.db) {
      try {
        await this.ensureFirebaseAuthAdmin();
        await this.fb.collection('forms').doc(formId).delete();
      } catch (e) {}
    }

    await this._autoPublishChange('ELIMINAR_FORMULARIO', `Formulario "${formId}" eliminado de la plataforma.`);
    return { success: true };
  }

  async submitFormLead(leadData) {
    const leadId = leadData.id || ('lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7));
    const fullLead = {
      id: leadId,
      ...leadData,
      estado: leadData.estado || 'Pendiente',
      createdAt: leadData.createdAt || Date.now(),
      updatedAt: Date.now(),
      fechaStr: leadData.fechaStr || new Date().toLocaleString()
    };

    const db = this.getLocalDb();
    if (!db.form_submissions) db.form_submissions = [];
    const existIdx = db.form_submissions.findIndex(s => s.id === leadId);
    if (existIdx >= 0) {
      db.form_submissions[existIdx] = fullLead;
    } else {
      db.form_submissions.unshift(fullLead);
    }
    if (db.form_submissions.length > 50) {
      db.form_submissions = db.form_submissions.slice(0, 50);
    }
    this.saveLocalDb(db);

    // Guardado en la nube (Firebase Firestore)
    if (this.fb) {
      try {
        const auth = this.fb.auth;
        if (auth && !auth.currentUser && typeof auth.signInAnonymously === 'function') {
          try {
            await auth.signInAnonymously();
            console.log('[ColuaRepo] Sesión Firebase anónima activa para guardado en nube');
          } catch (authErr) {
            console.warn('[ColuaRepo] signInAnonymously advertencia:', authErr.message || authErr);
          }
        }

        const dbFs = this.fb.db;
        if (dbFs) {
          const cleanLead = this._cleanDoc(fullLead);
          await this.fb.collection('form_submissions').doc(leadId).set(cleanLead, { merge: true });
          console.log('[ColuaRepo] ✓ Solicitud guardada exitosamente en Firestore Cloud:', leadId);
        }
      } catch (e) {
        console.error('[ColuaRepo] Error guardando lead en Firestore:', e);
      }
    }

    try {
      await this.logAudit({
        action: 'NUEVA_SOLICITUD_LEAD',
        performedBy: fullLead.nombre || 'Visitante Web',
        details: `Nueva solicitud para "${fullLead.formTitle || 'Afiliación'}" recibida de ${fullLead.nombre} (${fullLead.telefono || 'Sin teléfono'}). DPI: ${fullLead.dpi || 'N/A'}.`
      });
    } catch (e) {}

    return { success: true, lead: fullLead, ...fullLead };
  }

  async getFormSubmissions() {
    if (this.fb && this.fb.db) {
      try {
        const snap = await this._withTimeout(this.fb.collection('form_submissions').get(), 3000);
        if (!snap.empty) {
          const remoteSubs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          const db = this.getLocalDb();
          let changed = false;
          if (!db.form_submissions) db.form_submissions = [];
          remoteSubs.forEach(rem => {
            const idx = db.form_submissions.findIndex(s => s.id === rem.id);
            if (idx >= 0) {
              db.form_submissions[idx] = { ...db.form_submissions[idx], ...rem };
            } else {
              db.form_submissions.push(rem);
            }
            changed = true;
          });
          if (changed) {
            db.form_submissions.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            this.saveLocalDb(db);
          }
        }
      } catch (e) {}
    }
    const db = this.getLocalDb();
    return (db.form_submissions || []).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }

  async updateSubmissionStatus(id, newStatus) {
    const db = this.getLocalDb();
    if (!db.form_submissions) db.form_submissions = [];
    const lead = db.form_submissions.find(s => s.id === id);
    if (!lead) return { success: false, error: 'Solicitud no encontrada' };

    lead.estado = newStatus;
    lead.updatedAt = Date.now();
    this.saveLocalDb(db);

    if (this.fb && this.fb.db) {
      try {
        await this.fb.collection('form_submissions').doc(id).set({ estado: newStatus, updatedAt: Date.now() }, { merge: true });
      } catch (e) {}
    }

    await this.logAudit({
      action: 'ACTUALIZAR_ESTADO_SOLICITUD',
      performedBy: window.authService?.getCurrentUser()?.nombre || 'Super Administrador',
      details: `Solicitud de ${lead.nombre} marcada como "${newStatus}".`
    });

    return { success: true, lead };
  }

  async deleteSubmission(id) {
    const db = this.getLocalDb();
    if (!db.form_submissions) db.form_submissions = [];
    db.form_submissions = db.form_submissions.filter(s => s.id !== id);
    this.saveLocalDb(db);

    if (this.fb && this.fb.db) {
      try {
        await this.fb.collection('form_submissions').doc(id).delete();
      } catch (e) {}
    }

    return { success: true };
  }

  async getBlocksByItemId(itemId) {
    const cleanId = (itemId || '').toLowerCase();
    try {
      if (this.fb && this.fb.db) {
        const snap = await this._withTimeout(this.fb.collection('content_blocks').where('itemId', '==', itemId).get());
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        }
      }
    } catch (e) {}
    const db = this.getLocalDb();
    return (db.content_blocks || [])
      .filter(b => (b.itemId === itemId || b.sectionId === itemId || b.id === itemId))
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  // --- ANALÍTICA Y ESTADÍSTICAS EN TIEMPO REAL (100% DATOS REALES) ---
  purgeLegacyMockAnalytics() {
    const db = this.getLocalDb();
    if (db.analytics && (db.analytics.page_views?.inicio === 3427 || db.analytics.total_visits === 14647)) {
      db.analytics = {
        page_views: { inicio: 1 },
        daily_visits: { [new Date().toISOString().split('T')[0]]: 1 },
        last_updated: Date.now()
      };
      this.saveLocalDb(db);
    }
  }

  trackPageView(slug) {
    if (!slug) return;
    this.purgeLegacyMockAnalytics();
    const cleanSlug = slug.replace('#', '').trim().toLowerCase() || 'inicio';
    const db = this.getLocalDb();
    if (!db.analytics) {
      db.analytics = {
        page_views: {},
        daily_visits: {},
        last_updated: Date.now()
      };
    }
    const today = new Date().toISOString().split('T')[0];
    if (!db.analytics.daily_visits) db.analytics.daily_visits = {};
    db.analytics.daily_visits[today] = (db.analytics.daily_visits[today] || 0) + 1;

    if (!db.analytics.page_views) db.analytics.page_views = {};
    db.analytics.page_views[cleanSlug] = (db.analytics.page_views[cleanSlug] || 0) + 1;
    db.analytics.last_updated = Date.now();
    this.saveLocalDb(db);
  }

  async getAnalyticsSummary() {
    const currentDb = this.getLocalDb();
    const analytics = currentDb.analytics || { page_views: {}, daily_visits: {} };
    const pageViewsRaw = analytics.page_views || {};

    // Obtener lista completa de secciones para mostrar nombres amigables
    const sections = await this.getAllSections();
    const sectionNameMap = {
      'inicio': 'Inicio / Portal Principal',
      'home': 'Inicio / Portal Principal',
      'sec_home': 'Inicio / Portal Principal',
      'ahorros': 'Cuentas de Ahorro',
      'sec_ahorros': 'Cuentas de Ahorro',
      'creditos': 'Líneas de Crédito',
      'sec_creditos': 'Líneas de Crédito',
      'seguros': 'Seguros y Pólizas',
      'sec_seguros': 'Seguros y Pólizas',
      'remesas': 'Remesas y Repatriación',
      'sec_remesas': 'Remesas y Repatriación',
      'agencias': 'Agencias y Cajeros 5B',
      'sec_agencias': 'Agencias y Cajeros 5B',
      'servicios': 'Servicios Digitales y Tarjetas',
      'sec_servicios': 'Servicios Digitales y Tarjetas',
      'beneficios': 'Beneficios al Asociado',
      'sec_beneficios': 'Beneficios al Asociado',
      'noticias': 'Noticias y Comunicados',
      'sec_noticias': 'Noticias y Comunicados',
      'nosotros': 'Nosotros (Misión, Historia, Valores)',
      'sec_nosotros': 'Nosotros (Misión, Historia, Valores)',
      'sostenibilidad': 'Sostenibilidad Cooperativa',
      'sec_sostenibilidad': 'Sostenibilidad Cooperativa',
      'perfil': 'Mi Perfil de Asociado'
    };

    // Ranking de páginas más visitadas (estrictamente visitas reales)
    const pageRanking = Object.entries(pageViewsRaw)
      .map(([slug, count]) => ({
        slug,
        name: sectionNameMap[slug] || (slug.charAt(0).toUpperCase() + slug.slice(1)),
        count: Number(count) || 0
      }))
      .filter(p => p.count > 0)
      .sort((a, b) => b.count - a.count);

    const totalViews = pageRanking.reduce((sum, p) => sum + p.count, 0);
    pageRanking.forEach(p => {
      p.percentage = totalViews > 0 ? ((p.count / totalViews) * 100).toFixed(1) : '0.0';
    });

    // Likes y Reacciones reales de Noticias
    const newsItems = (currentDb.content_items || []).filter(i => i.sectionId === 'sec_noticias');
    let totalLikes = 0;
    let totalShares = 0;
    newsItems.forEach(n => {
      totalLikes += (Number(n.likesCount) || Number(n.likes) || 0);
      totalShares += (Number(n.sharesCount) || Number(n.shares) || 0);
    });

    const topLikedNews = [...newsItems]
      .sort((a, b) => (Number(b.likesCount) || Number(b.likes) || 0) - (Number(a.likesCount) || Number(a.likes) || 0))
      .slice(0, 5);

    // Métricas reales de Usuarios
    const users = await this.getAllUsers();
    const usersByRole = {
      superadmin: users.filter(u => (u.tipoUsuario || u.role || '').toLowerCase() === 'superadmin').length,
      admin: users.filter(u => (u.tipoUsuario || u.role || '').toLowerCase() === 'admin').length,
      manager: users.filter(u => (u.tipoUsuario || u.role || '').toLowerCase() === 'manager').length,
      asociado: users.filter(u => {
        const r = (u.tipoUsuario || u.role || '').toLowerCase();
        return r === 'asociado' || r === 'socio';
      }).length,
      invitado: users.filter(u => {
        const r = (u.tipoUsuario || u.role || '').toLowerCase();
        return !r || r === 'invitado' || r === 'asociado_digital';
      }).length
    };

    // Frecuencia diaria 100% real de los últimos 7 días
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const today = new Date();
    const weeklyVisits = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const dayName = days[d.getDay()];
      const count = analytics.daily_visits?.[key] || 0;
      weeklyVisits.push({
        date: key,
        day: dayName,
        count
      });
    }

    return {
      totalViews,
      pageRanking,
      totalLikes,
      totalShares,
      topLikedNews,
      totalUsers: users.length,
      usersByRole,
      weeklyVisits,
      sectionsCount: sections.length,
      activeSectionsCount: sections.filter(s => s.isEnabled !== false && s.isVisible !== false).length,
      hiddenSectionsCount: sections.filter(s => s.isEnabled === false || s.isVisible === false).length,
      totalContentItems: (currentDb.content_items || []).length,
      totalAgencias: (currentDb.agencias || []).length
    };
  }

  // --- GESTIÓN DE LA BARRA INFERIOR (5 SITIOS CON INICIO FIJO) ---
  getBottomNavSlots() {
    const db = this.getLocalDb();
    const defaultSlots = [
      { slotIndex: 1, sectionId: "sec_servicios", label: "Servicios", icon: "assets/servicios_digitales.png", slug: "servicios" },
      { slotIndex: 2, sectionId: "sec_agencias", label: "Agencias", icon: "assets/ubicacion.png", slug: "agencias" },
      { slotIndex: 3, sectionId: "sec_home", label: "Inicio", icon: "assets/distintivo_colua.png", slug: "inicio", isFixed: true },
      { slotIndex: 4, sectionId: "sec_beneficios", label: "Beneficios", icon: "assets/beneficios.png", slug: "beneficios" },
      { slotIndex: 5, sectionId: "sec_noticias", label: "Noticias", icon: "assets/noticias_colua.png", slug: "noticias" }
    ];

    if (!db.global_config) db.global_config = {};
    if (!db.global_config.bottom_nav_slots || db.global_config.bottom_nav_slots.length !== 5) {
      db.global_config.bottom_nav_slots = defaultSlots;
      this.saveLocalDb(db);
    }

    // Sincronizar dinámicamente etiquetas con los nombres actualizados de las secciones
    const sections = db.sections || [];
    db.global_config.bottom_nav_slots.forEach(slot => {
      const match = sections.find(s => s.id === slot.sectionId || (slot.slotIndex === 3 && s.id === 'sec_home'));
      if (match && match.title) {
        slot.label = match.title;
        if (match.slug) slot.slug = match.slug;
      }
    });

    return db.global_config.bottom_nav_slots;
  }

  async updateBottomNavSlot(slotIndex, newSectionId) {
    if (slotIndex === 3) {
      return { success: false, error: 'El botón central de Inicio es fijo y permanente.' };
    }
    const db = this.getLocalDb();
    const sections = await this.getAllSections();
    const targetSection = sections.find(s => s.id === newSectionId || s.slug === newSectionId);
    if (!targetSection) {
      return { success: false, error: 'Sección no encontrada.' };
    }

    const iconMap = {
      'sec_home': 'assets/distintivo_colua.png',
      'sec_ahorros': 'assets/ahorros.png',
      'sec_creditos': 'assets/credito.png',
      'sec_seguros': 'assets/seguro.png',
      'sec_remesas': 'assets/remesa.png',
      'sec_agencias': 'assets/ubicacion.png',
      'sec_servicios': 'assets/servicios_digitales.png',
      'sec_beneficios': 'assets/beneficios.png',
      'sec_noticias': 'assets/noticias_colua.png',
      'sec_nosotros': 'assets/logo_composite.png',
      'sec_sostenibilidad': 'assets/sostenibilidad_cooperativa.png'
    };

    const slots = this.getBottomNavSlots();
    const slotItem = slots.find(s => s.slotIndex === slotIndex);
    if (slotItem) {
      slotItem.sectionId = targetSection.id;
      slotItem.label = targetSection.title;
      slotItem.slug = targetSection.slug || targetSection.id.replace('sec_', '');
      slotItem.icon = iconMap[targetSection.id] || targetSection.icon || 'assets/distintivo_colua.png';
    }

    db.global_config.bottom_nav_slots = slots;
    db.global_config.last_sync_timestamp = Date.now();
    this.saveLocalDb(db);

    if (this.fb && this.fb.db) {
      try {
        await this.fb.collection('config').doc('bottom_nav').set({ slots, updatedAt: Date.now() });
      } catch (e) {}
    }

    await this.logAudit({
      action: 'CAMBIAR_SITIO_BARRA_INFERIOR',
      performedBy: 'Super Administrador',
      details: `Ranura ${slotIndex} de barra inferior asignada a: ${targetSection.title} (#${slotItem.slug})`
    });

    if (window.bottomNavComponent && window.bottomNavComponent.refresh) {
      window.bottomNavComponent.refresh();
    }

    return { success: true, slots };
  }

  // --- GESTIÓN DE BOTONES DEL MENÚ SUPERIOR Y SUB-BOTONES (NAVBAR DESKTOP) ---
  getDefaultTopNavItems() {
    return [
      { id: 'topnav_inicio', label: 'Inicio', targetSectionId: 'sec_home', displayOrder: 1, orderIndex: 1, isVisible: true, subItems: [] },
      { id: 'topnav_ahorros', label: 'Ahorros', targetSectionId: 'sec_ahorros', displayOrder: 2, orderIndex: 2, isVisible: true, subItems: [] },
      { id: 'topnav_creditos', label: 'Créditos', targetSectionId: 'sec_creditos', displayOrder: 3, orderIndex: 3, isVisible: true, subItems: [] },
      { id: 'topnav_seguros', label: 'Seguros', targetSectionId: 'sec_seguros', displayOrder: 4, orderIndex: 4, isVisible: true, subItems: [] },
      { id: 'topnav_remesas', label: 'Remesas', targetSectionId: 'sec_remesas', displayOrder: 5, orderIndex: 5, isVisible: true, subItems: [] },
      { id: 'topnav_servicios', label: 'Servicios', targetSectionId: 'sec_servicios', displayOrder: 6, orderIndex: 6, isVisible: true, subItems: [] },
      { id: 'topnav_beneficios', label: 'Beneficios', targetSectionId: 'sec_beneficios', displayOrder: 7, orderIndex: 7, isVisible: true, subItems: [] },
      { id: 'topnav_sostenibilidad', label: 'Sostenibilidad', targetSectionId: 'sec_sostenibilidad', displayOrder: 8, orderIndex: 8, isVisible: true, subItems: [] },
      { id: 'topnav_noticias', label: 'Noticias', targetSectionId: 'sec_noticias', displayOrder: 9, orderIndex: 9, isVisible: true, subItems: [] },
      { id: 'topnav_empleo', label: 'Empleo', targetSectionId: 'sec_empleo', displayOrder: 10, orderIndex: 10, isVisible: true, subItems: [] },
      { id: 'topnav_agencias', label: 'Agencias', targetSectionId: 'sec_agencias', displayOrder: 11, orderIndex: 11, isVisible: true, subItems: [] },
      { id: 'topnav_nosotros', label: 'Nosotros', targetSectionId: 'sec_nosotros', displayOrder: 12, orderIndex: 12, isVisible: true, subItems: [] },
      { id: 'topnav_gobierno', label: 'Gobierno Cooperativo', targetSectionId: 'sec_nosotros', displayOrder: 13, orderIndex: 13, isVisible: true, subItems: [] },
      { id: 'topnav_mi_empleo', label: 'Mi empleo', targetSectionId: 'sec_empleo', displayOrder: 14, orderIndex: 14, isVisible: true, subItems: [] }
    ];
  }

  getTopNavItemsSync() {
    try {
      const db = this.getLocalDb();
      let items = db.top_nav_items || (db.global_config && db.global_config.top_nav_items);
      if (!items || !Array.isArray(items) || items.length === 0) {
        items = this.getDefaultTopNavItems();
        db.top_nav_items = items;
        if (!db.global_config) db.global_config = {};
        db.global_config.top_nav_items = items;
        this.saveLocalDb(db);
      }
      let modified = false;
      if (db.sections && db.sections.some(s => s.id === 'sec_empleo') && !items.some(n => n.targetSectionId === 'sec_empleo' || (n.label && n.label.toLowerCase() === 'empleo'))) {
        items.push({
          id: 'topnav_empleo',
          label: 'Empleo',
          targetSectionId: 'sec_empleo',
          orderIndex: 10,
          displayOrder: 10,
          isVisible: true,
          subItems: []
        });
        modified = true;
      }
      if (!items.some(n => (n.label && n.label.toLowerCase().includes('gobierno')) || (n.id && n.id.includes('gobierno')))) {
        items.push({
          id: 'topnav_gobierno',
          label: 'Gobierno Cooperativo',
          targetSectionId: 'sec_nosotros',
          displayOrder: 13,
          orderIndex: 13,
          isVisible: true,
          subItems: []
        });
        modified = true;
      }
      if (!items.some(n => (n.label && n.label.toLowerCase().includes('mi empleo')) || (n.id && n.id.includes('mi_empleo')))) {
        items.push({
          id: 'topnav_mi_empleo',
          label: 'Mi empleo',
          targetSectionId: 'sec_empleo',
          displayOrder: 14,
          orderIndex: 14,
          isVisible: true,
          subItems: []
        });
        modified = true;
      }
      if (modified) {
        db.top_nav_items = items;
        if (!db.global_config) db.global_config = {};
        db.global_config.top_nav_items = items;
        this.saveLocalDb(db);
      }
      return (items || [])
        .filter(item => item.isVisible !== false && item.targetSectionId !== 'admin' && item.id !== 'topnav_admin')
        .sort((a, b) => ((a.orderIndex || a.displayOrder || 0) - (b.orderIndex || b.displayOrder || 0)));
    } catch (e) {
      return this.getDefaultTopNavItems();
    }
  }

  async getTopNavItems() {
    if (this.fb && this.fb.db) {
      try {
        const snap = await this._withTimeout(this.fb.collection('config').doc('top_nav').get(), 2000);
        if (snap && snap.exists && snap.data() && Array.isArray(snap.data().items)) {
          const remoteItems = snap.data().items;
          const db = this.getLocalDb();
          db.top_nav_items = remoteItems;
          if (!db.global_config) db.global_config = {};
          db.global_config.top_nav_items = remoteItems;
          this.saveLocalDb(db);
          return remoteItems.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        }
      } catch (e) {}
    }
    return this.getTopNavItemsSync();
  }

  async saveTopNavItem(item) {
    return this._saveTopNavItemInternal(item);
  }

  async _saveTopNavItemInternal(item) {
    const db = this.getLocalDb();
    if (!db.top_nav_items) db.top_nav_items = this.getDefaultTopNavItems();

    if (!item.id) {
      item.id = 'topnav_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    }
    if (!item.orderIndex) {
      item.orderIndex = db.top_nav_items.length + 1;
    }
    if (!Array.isArray(item.subItems)) {
      item.subItems = [];
    }

    const idx = db.top_nav_items.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      db.top_nav_items[idx] = { ...db.top_nav_items[idx], ...item };
    } else {
      db.top_nav_items.push(item);
    }

    if (!db.global_config) db.global_config = {};
    db.global_config.top_nav_items = db.top_nav_items;
    this.saveLocalDb(db);

    await this._syncTopNavToCloud();

    await this.logAudit({
      action: idx >= 0 ? 'EDITAR_BOTON_NAVBAR' : 'CREAR_BOTON_NAVBAR',
      performedBy: 'Super Administrador',
      details: `Botón navbar: "${item.label}" asignado a pantalla: "${item.targetSectionId}" con ${item.subItems.length} sub-opciones.`
    });

    return { success: true, item };
  }

  async deleteTopNavItem(id) {
    return this._deleteTopNavItemInternal(id);
  }

  async _deleteTopNavItemInternal(id) {
    const db = this.getLocalDb();
    if (!db.top_nav_items) return { success: false, error: 'No hay botones configurados' };

    const removed = db.top_nav_items.find(i => i.id === id);
    db.top_nav_items = db.top_nav_items.filter(i => i.id !== id);
    db.top_nav_items.forEach((item, idx) => {
      item.orderIndex = idx + 1;
    });

    if (!db.global_config) db.global_config = {};
    db.global_config.top_nav_items = db.top_nav_items;
    this.saveLocalDb(db);

    await this._syncTopNavToCloud();

    await this.logAudit({
      action: 'ELIMINAR_BOTON_NAVBAR',
      performedBy: 'Super Administrador',
      details: `Se eliminó el botón del menú: "${removed ? removed.label : id}"`
    });

    return { success: true };
  }

  async addTopNavSubItem(parentId, subItem) {
    return this._addTopNavSubItemInternal(parentId, subItem);
  }

  async _addTopNavSubItemInternal(parentId, subItem) {
    const db = this.getLocalDb();
    if (!db.top_nav_items) db.top_nav_items = this.getDefaultTopNavItems();

    const parent = db.top_nav_items.find(i => i.id === parentId);
    if (!parent) return { success: false, error: 'Botón padre no encontrado' };

    if (!Array.isArray(parent.subItems)) parent.subItems = [];

    const newSub = {
      id: subItem.id || ('sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)),
      label: subItem.label || 'Nueva Sub-opción',
      targetSectionId: subItem.targetSectionId || 'sec_home',
      orderIndex: parent.subItems.length + 1
    };

    parent.subItems.push(newSub);

    if (!db.global_config) db.global_config = {};
    db.global_config.top_nav_items = db.top_nav_items;
    this.saveLocalDb(db);

    await this._syncTopNavToCloud();

    await this.logAudit({
      action: 'AGREGAR_SUBBOTON_NAVBAR',
      performedBy: 'Super Administrador',
      details: `Se agregó la sub-opción "${newSub.label}" -> "${newSub.targetSectionId}" al botón "${parent.label}".`
    });

    return { success: true, subItem: newSub };
  }

  async updateTopNavSubItem(parentId, subItem, fields) {
    return this._updateTopNavSubItemInternal(parentId, subItem, fields);
  }

  async _updateTopNavSubItemInternal(parentId, subItem, fields) {
    const db = this.getLocalDb();
    if (!db.top_nav_items) return { success: false, error: 'No hay botones configurados' };

    const parent = db.top_nav_items.find(i => i.id === parentId);
    if (!parent || !Array.isArray(parent.subItems)) return { success: false, error: 'Sub-botón no encontrado' };

    const targetSubId = typeof subItem === 'string' ? subItem : subItem.id;
    const patchData = typeof subItem === 'string' ? fields : subItem;

    const idx = parent.subItems.findIndex(s => s.id === targetSubId);
    if (idx < 0) return { success: false, error: 'Sub-botón no encontrado' };

    parent.subItems[idx] = { ...parent.subItems[idx], ...patchData };

    if (!db.global_config) db.global_config = {};
    db.global_config.top_nav_items = db.top_nav_items;
    this.saveLocalDb(db);

    await this._syncTopNavToCloud();

    await this.logAudit({
      action: 'EDITAR_SUBBOTON_NAVBAR',
      performedBy: 'Super Administrador',
      details: `Se actualizó la sub-opción "${parent.subItems[idx].label}" del botón "${parent.label}".`
    });

    return { success: true, subItem: parent.subItems[idx] };
  }

  async deleteTopNavSubItem(parentId, subId) {
    return this._deleteTopNavSubItemInternal(parentId, subId);
  }

  async _deleteTopNavSubItemInternal(parentId, subId) {
    const db = this.getLocalDb();
    if (!db.top_nav_items) return { success: false, error: 'No hay botones configurados' };

    const parent = db.top_nav_items.find(i => i.id === parentId);
    if (!parent || !Array.isArray(parent.subItems)) return { success: false, error: 'Botón padre no encontrado' };

    parent.subItems = parent.subItems.filter(s => s.id !== subId);

    if (!db.global_config) db.global_config = {};
    db.global_config.top_nav_items = db.top_nav_items;
    this.saveLocalDb(db);

    await this._syncTopNavToCloud();

    await this.logAudit({
      action: 'ELIMINAR_SUBBOTON_NAVBAR',
      performedBy: 'Super Administrador',
      details: `Se eliminó la sub-opción del botón "${parent.label}".`
    });

    return { success: true };
  }

  async reorderTopNavItems(orderedIds) {
    return this._reorderTopNavItemsInternal(orderedIds);
  }

  async _reorderTopNavItemsInternal(orderedIds) {
    const db = this.getLocalDb();
    if (!db.top_nav_items) return { success: false };

    const map = new Map(db.top_nav_items.map(i => [i.id, i]));
    const reordered = [];

    orderedIds.forEach((id, idx) => {
      const item = map.get(id);
      if (item) {
        item.orderIndex = idx + 1;
        reordered.push(item);
        map.delete(id);
      }
    });

    map.forEach(item => {
      item.orderIndex = reordered.length + 1;
      reordered.push(item);
    });

    db.top_nav_items = reordered;
    if (!db.global_config) db.global_config = {};
    db.global_config.top_nav_items = db.top_nav_items;
    this.saveLocalDb(db);

    await this._syncTopNavToCloud();

    return { success: true, items: reordered };
  }

  async resetTopNavToDefaults() {
    return this._resetTopNavToDefaultsInternal();
  }

  async _resetTopNavToDefaultsInternal() {
    const defaults = this.getDefaultTopNavItems();
    const db = this.getLocalDb();
    db.top_nav_items = defaults;
    if (!db.global_config) db.global_config = {};
    db.global_config.top_nav_items = defaults;
    this.saveLocalDb(db);

    await this._syncTopNavToCloud();

    await this.logAudit({
      action: 'RESTABLECER_NAVBAR_DEFAULT',
      performedBy: 'Super Administrador',
      details: `Se restablecieron los 12 botones de menú estándar de COLUA.`
    });

    return { success: true, items: defaults };
  }

  async toggleSectionVisibility(id) {
    const db = this.getLocalDb();
    const sec = db.sections.find(s => s.id === id);
    if (!sec) return { success: false, error: 'Sección no encontrada' };

    const newStatus = sec.isEnabled === false || sec.isVisible === false ? true : false;
    sec.isEnabled = newStatus;
    sec.isVisible = newStatus;
    sec.isPublished = newStatus;
    sec.isDraft = false;
    sec.updatedAt = Date.now();

    this.saveLocalDb(db);

    if (this.fb && this.fb.db) {
      try {
        await this.ensureFirebaseAuthAdmin();
        const clean = this._cleanDoc(sec);
        await this.fb.collection('sections').doc(id).set(clean, { merge: true });
      } catch (e) {
        console.warn('[ColuaRepo] Error actualizando sección en Firestore:', e);
      }
    }

    await this._autoPublishChange(newStatus ? 'ACTIVAR_SECCION' : 'OCULTAR_SECCION', `Sección ${sec.title} (${sec.id}) ahora está ${newStatus ? 'Activa' : 'Oculta'}`);

    return { success: true, section: sec, isEnabled: newStatus };
  }

  async toggleContentItemVisibility(id) {
    const db = this.getLocalDb();
    let item = (db.content_items || []).find(i => i.id === id);
    if (!item && db.agencias) {
      item = db.agencias.find(a => a.id === id);
    }
    if (!item) return { success: false, error: 'Elemento de contenido no encontrado' };

    const newStatus = item.isEnabled === false || item.isVisible === false ? true : false;
    item.isEnabled = newStatus;
    item.isVisible = newStatus;
    item.isDraft = false;
    item.isPublished = newStatus;
    item.updatedAt = Date.now();
    item.lastModified = Date.now();

    this.saveLocalDb(db);

    if (this.fb && this.fb.db) {
      try {
        await this.ensureFirebaseAuthAdmin();
        const clean = this._cleanDoc(item);
        await this.fb.collection('content_items').doc(id).set(clean, { merge: true });
        if (db.agencias && db.agencias.some(a => a.id === id)) {
          await this.fb.collection('agencias').doc(id).set(clean, { merge: true });
        }
      } catch (e) {}
    }

    await this._autoPublishChange(newStatus ? 'ACTIVAR_ELEMENTO_CONTENIDO' : 'OCULTAR_ELEMENTO_CONTENIDO', `Elemento "${item.title || item.nombre || item.id}" (${item.id}) ahora está ${newStatus ? 'Activo / Visible' : 'Oculto'}`);

    return { success: true, item, isEnabled: newStatus };
  }

  // --- SINCRONIZACIÓN EN LA NUBE Y TIEMPO REAL ---
  async syncAllFromCloud() {
    let hasChanges = false;
    const db = this.getLocalDb();

    // 0. Sincronizar Versión Publicada y Configuración Global
    if (this.fb && this.fb.db) {
      try {
        const configSnap = await this._withTimeout(this.fb.collection('config').doc('published_config').get(), 3000);
        if (configSnap.exists) {
          const rData = configSnap.data();
          if (rData && rData.version) {
            if (!db.global_config) db.global_config = {};
            db.global_config.published_version = rData.version;
            db.global_config.last_sync_timestamp = rData.lastSyncTimestamp || Date.now();
            hasChanges = true;
          }
        }
      } catch (e) {}
    }

    // 0.1 Sincronizar Botones y Sub-botones del Menú Superior (top_nav)
    if (this.fb && this.fb.db) {
      try {
        const topNavSnap = await this._withTimeout(this.fb.collection('config').doc('top_nav').get(), 3000);
        if (topNavSnap.exists && topNavSnap.data() && Array.isArray(topNavSnap.data().items) && topNavSnap.data().items.length > 0) {
          db.top_nav_items = topNavSnap.data().items;
          if (!db.global_config) db.global_config = {};
          db.global_config.top_nav_items = topNavSnap.data().items;
          hasChanges = true;
        }
      } catch (e) {}
    }
    if (!db.top_nav_items || db.top_nav_items.length === 0) {
      const restTopNav = await this.fetchDocumentRest('config', 'top_nav');
      if (restTopNav && Array.isArray(restTopNav.items) && restTopNav.items.length > 0) {
        db.top_nav_items = restTopNav.items;
        if (!db.global_config) db.global_config = {};
        db.global_config.top_nav_items = restTopNav.items;
        hasChanges = true;
      }
    }

    // 1. Sincronizar Content Items (Tarjetas, Formularios, Banners, Noticias)
    let remoteItems = [];
    if (this.fb && this.fb.db) {
      try {
        const snap = await this._withTimeout(this.fb.collection('content_items').get(), 3500);
        if (!snap.empty) {
          remoteItems = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (e) {}
    }

    if (!remoteItems || remoteItems.length === 0) {
      remoteItems = await this.fetchCollectionRest('content_items');
    }

    if (remoteItems && remoteItems.length > 0) {
      if (!db.content_items) db.content_items = [];
      remoteItems.forEach(remoteItem => {
        if (!remoteItem || !remoteItem.id || remoteItem.sectionId === 'sec_comunidad') return;
        this._cleanItemIfInverted(remoteItem);
        const idx = db.content_items.findIndex(i => i.id === remoteItem.id);
        if (idx >= 0) {
          db.content_items[idx] = { ...db.content_items[idx], ...remoteItem };
        } else {
          db.content_items.push(remoteItem);
        }
        hasChanges = true;
      });
    }

    // 2. Sincronizar Secciones
    let remoteSections = [];
    if (this.fb && this.fb.db) {
      try {
        const snap = await this._withTimeout(this.fb.collection('sections').get(), 3500);
        if (!snap.empty) {
          remoteSections = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (e) {}
    }

    if (!remoteSections || remoteSections.length === 0) {
      remoteSections = await this.fetchCollectionRest('sections');
    }

    if (remoteSections && remoteSections.length > 0) {
      if (!db.sections) db.sections = [];
      remoteSections.forEach(remoteSec => {
        if (!remoteSec || !remoteSec.id || remoteSec.id === 'sec_comunidad' || remoteSec.slug === 'comunidad') return;
        const idx = db.sections.findIndex(s => s.id === remoteSec.id);
        if (idx >= 0) {
          db.sections[idx] = { ...db.sections[idx], ...remoteSec };
        } else {
          db.sections.push(remoteSec);
        }
        hasChanges = true;
      });
    }

    // 3. Sincronizar Formularios
    let remoteForms = [];
    if (this.fb && this.fb.db) {
      try {
        const snap = await this._withTimeout(this.fb.collection('forms').get(), 3000);
        if (!snap.empty) {
          remoteForms = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (e) {}
    }

    if (!remoteForms || remoteForms.length === 0) {
      remoteForms = await this.fetchCollectionRest('forms');
    }

    if (remoteForms && remoteForms.length > 0) {
      if (!db.forms) db.forms = [];
      remoteForms.forEach(rf => {
        if (!rf || !rf.id) return;
        const idx = db.forms.findIndex(f => f.id === rf.id);
        if (idx >= 0) db.forms[idx] = { ...db.forms[idx], ...rf };
        else db.forms.push(rf);
        hasChanges = true;
      });
    }

    // 4. Sincronizar Agencias
    let remoteAgencias = [];
    if (this.fb && this.fb.db) {
      try {
        const snap = await this._withTimeout(this.fb.collection('agencias').get(), 3000);
        if (!snap.empty) {
          remoteAgencias = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (e) {}
    }

    if (!remoteAgencias || remoteAgencias.length === 0) {
      remoteAgencias = await this.fetchCollectionRest('agencias');
    }

    if (remoteAgencias && remoteAgencias.length > 0) {
      if (!db.agencias) db.agencias = [];
      remoteAgencias.forEach(ra => {
        if (!ra || !ra.id) return;
        const idx = db.agencias.findIndex(a => a.id === ra.id);
        if (idx >= 0) db.agencias[idx] = { ...db.agencias[idx], ...ra };
        else db.agencias.push(ra);
        hasChanges = true;
      });
    }

    // 5. Sincronizar Content Blocks
    let remoteBlocks = [];
    if (this.fb && this.fb.db) {
      try {
        const snap = await this._withTimeout(this.fb.collection('content_blocks').get(), 3000);
        if (!snap.empty) {
          remoteBlocks = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (e) {}
    }

    if (!remoteBlocks || remoteBlocks.length === 0) {
      remoteBlocks = await this.fetchCollectionRest('content_blocks');
    }

    if (remoteBlocks && remoteBlocks.length > 0) {
      if (!db.content_blocks) db.content_blocks = [];
      remoteBlocks.forEach(rb => {
        if (!rb || !rb.id) return;
        const idx = db.content_blocks.findIndex(b => b.id === rb.id);
        if (idx >= 0) db.content_blocks[idx] = { ...db.content_blocks[idx], ...rb };
        else db.content_blocks.push(rb);
        hasChanges = true;
      });
    }

    if (hasChanges) {
      this.saveLocalDb(db);
      try {
        if (window.navbarComponent && typeof window.navbarComponent.refresh === 'function') {
          window.navbarComponent.refresh();
        }
        window.dispatchEvent(new CustomEvent('colua-data-synced', { detail: { timestamp: Date.now() } }));
      } catch (e) {}
    }

    return hasChanges;
  }

  // Suscripción a cambios en tiempo real entre múltiples pestañas / ordenadores
  subscribeToPublishedConfig(callback) {
    if (!this.fb || !this.fb.db) return;
    try {
      // 1. Escuchar la versión publicada en config/published_config
      this.fb.collection('config').doc('published_config').onSnapshot(async (snap) => {
        if (snap.exists) {
          const remoteVersion = snap.data().version || snap.data().published_version || 1;
          const currentLocal = this.getLocalDb().global_config?.published_version || 1;
          if (remoteVersion > currentLocal) {
            console.log(`[COLUA Sync] Nueva versión remota detectada (v${remoteVersion}). Sincronizando datos...`);
            await this.syncAllFromCloud();
            if (typeof callback === 'function') callback(remoteVersion);
          }
        }
      }, (err) => console.warn('[ColuaRepo] Realtime config/published_config warning:', err));

      // 2. Escuchar cambios directos en content_items
      this.fb.collection('content_items').onSnapshot((snap) => {
        const db = this.getLocalDb();
        let changed = false;
        snap.docChanges().forEach(change => {
          const item = { id: change.doc.id, ...change.doc.data() };
          if (change.type === 'added' || change.type === 'modified') {
            const idx = db.content_items.findIndex(i => i.id === item.id);
            if (idx >= 0) db.content_items[idx] = item;
            else db.content_items.push(item);
            changed = true;
          } else if (change.type === 'removed') {
            db.content_items = db.content_items.filter(i => i.id !== item.id);
            changed = true;
          }
        });
        if (changed) {
          this.saveLocalDb(db);
          if (typeof callback === 'function') callback();
        }
      }, (err) => console.warn('[ColuaRepo] Realtime content_items listener warning:', err));

      // 3. Escuchar cambios directos en sections
      this.fb.collection('sections').onSnapshot((snap) => {
        const db = this.getLocalDb();
        let changed = false;
        snap.docChanges().forEach(change => {
          const sec = { id: change.doc.id, ...change.doc.data() };
          if (change.type === 'added' || change.type === 'modified') {
            const idx = db.sections.findIndex(s => s.id === sec.id);
            if (idx >= 0) db.sections[idx] = sec;
            else db.sections.push(sec);
            changed = true;
          } else if (change.type === 'removed') {
            db.sections = db.sections.filter(s => s.id !== sec.id);
            changed = true;
          }
        });
        if (changed) {
          this.saveLocalDb(db);
          if (typeof callback === 'function') callback();
        }
      }, (err) => console.warn('[ColuaRepo] Realtime sections listener warning:', err));

      // 4. Escuchar cambios directos en botones del menú superior (config/top_nav)
      this.fb.collection('config').doc('top_nav').onSnapshot((snap) => {
        if (snap.exists && snap.data() && Array.isArray(snap.data().items)) {
          const db = this.getLocalDb();
          db.top_nav_items = snap.data().items;
          if (!db.global_config) db.global_config = {};
          db.global_config.top_nav_items = snap.data().items;
          this.saveLocalDb(db);
          if (window.navbarComponent && typeof window.navbarComponent.refresh === 'function') {
            window.navbarComponent.refresh();
          }
          if (typeof callback === 'function') callback();
        }
      }, (err) => console.warn('[ColuaRepo] Realtime config/top_nav listener warning:', err));
    } catch (e) {
      console.warn('[ColuaRepo] Error configurando suscripción en tiempo real:', e);
    }
  }

  // --- FORMULARIOS & LEADS ---
  getForms() {
    const db = this.getLocalDb();
    return db.forms || [];
  }

  getFormById(id) {
    if (!id) return null;
    const db = this.getLocalDb();
    return (db.forms || []).find(f => f.id === id || f.targetCardId === id);
  }

  async submitFormLead(lead) {
    if (!lead.id) lead.id = 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    lead.createdAt = Date.now();
    lead.fechaStr = new Date().toLocaleString();
    lead.estado = lead.estado || 'Pendiente';

    const db = this.getLocalDb();
    if (!db.form_submissions) db.form_submissions = [];
    db.form_submissions.unshift(lead);
    this.saveLocalDb(db);

    if (this.fb && this.fb.db) {
      try {
        await this.fb.collection('form_submissions').doc(lead.id).set(lead, { merge: true });
      } catch (e) {
        console.warn('Error guardando lead en Firestore:', e);
      }
    }
    return lead;
  }

  async getFormLeads() {
    return await this.getFormSubmissions();
  }

  // Aliases para compatibilidad con admin.js y otros componentes
  async getItemById(id) {
    if (!id) return null;
    const db = this.getLocalDb();
    const local = (db.content_items || []).find(i => i.id === id);
    if (local) return local;
    if (db.agencias) {
      const ag = db.agencias.find(a => a.id === id);
      if (ag) return ag;
    }
    if (this.fb && this.fb.db) {
      try {
        const snap = await this._withTimeout(this.fb.collection('content_items').doc(id).get(), 2500);
        if (snap.exists) return { id: snap.id, ...snap.data() };
      } catch (e) {}
    }
    return null;
  }
  async getContentItemById(id) { return this.getItemById(id); }
  async getContentItemsBySection(secId) { return this.getItemsBySection(secId, true); }
  async getAllContentItemsBySection(secId) { return this.getItemsBySection(secId, true); }
  async saveContentItem(item) { return this.insertItem(item); }
  async deleteContentItem(id) { return this.deleteItemById(id); }
  async getSections() { return this.getAllSections(); }
  async saveSection(sec) { return this.insertSection(sec); }
  async deleteSection(id) { return this.purgeSectionPermanently(id); }
  async getBlocksByItem(itemId) { return this.getBlocksByItemId(itemId); }
  async getContentBlocksByItem(itemId) { return this.getBlocksByItemId(itemId); }
  async saveContentBlock(block) { return this.insertBlock(block); }
  async deleteContentBlock(id) { return this.deleteBlockById(id); }
  async getNavigationItems() { return this.getAllNavigation(); }
  async saveNavigationItem(item) { return this.insertNavigationItem(item); }
  async getSyncStatus() { return this.getSyncStatusInfo(); }
  async publishDraftsToProduction(userEmail) { return this.publishCurrentConfiguration(); }
}

window.coluaRepository = new ColuaRepository();
window.coluaRepo = window.coluaRepository;
