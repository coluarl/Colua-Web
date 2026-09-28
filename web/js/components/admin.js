// web/js/components/admin.js - Portal de Administración CMS COLUA R.L.

// Iconos Planos Minimalistas (SVG)
const ADMIN_ICONS = {
    lock: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
    shieldCheck: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`,
    user: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    key: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-1.5 1.5L14 9m0 0l-1.5 1.5M14 9l2 2m-3.5 3.5L3 21l3-3 1.5-1.5 2-2 1.5-1.5"></path></svg>`,
    eye: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    eyeOff: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`,
    screens: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`,
    canvas: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>`,
    sync: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>`,
    users: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    audit: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
    externalLink: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
    arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
    plus: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
    search: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    chevronLeft: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
    chevronRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
    chart: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
    heart: `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
    trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
    edit: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
    activity: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
    refresh: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
    book: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
    document: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
    cloud: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
    building: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="22.01"></line><line x1="15" y1="22" x2="15" y2="22.01"></line><line x1="9" y1="6" x2="9" y2="6.01"></line><line x1="15" y1="6" x2="15" y2="6.01"></line><line x1="9" y1="10" x2="9" y2="10.01"></line><line x1="15" y1="10" x2="15" y2="10.01"></line><line x1="9" y1="14" x2="9" y2="14.01"></line><line x1="15" y1="14" x2="15" y2="14.01"></line><line x1="9" y1="18" x2="9" y2="18.01"></line><line x1="15" y1="18" x2="15" y2="18.01"></line></svg>`,
    news: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>`,
    forms: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14l2 2 4-4"></path></svg>`
};

// Catálogo Rápido de Assets e Íconos Oficiales (assets/)
const ASSET_CATALOG = [
    // 1. Íconos Principales / Navegación
    { cat: 'principales', label: 'Ahorros (Alcancía)', path: 'assets/ahorros.png' },
    { cat: 'principales', label: 'Créditos (Efectivo)', path: 'assets/credito.png' },
    { cat: 'principales', label: 'Seguros (Escudo)', path: 'assets/seguro.png' },
    { cat: 'principales', label: 'Remesas (Mundo)', path: 'assets/remesa.png' },
    { cat: 'principales', label: 'Beneficios (Corona)', path: 'assets/beneficios.png' },
    { cat: 'principales', label: 'Agencias & PBX', path: 'assets/ubicacion.png' },
    { cat: 'principales', label: 'Servicios Digitales', path: 'assets/servicios_digitales.png' },
    { cat: 'principales', label: 'Noticias & Novedades', path: 'assets/noticias.png' },
    { cat: 'principales', label: 'Sostenibilidad', path: 'assets/sostenibilidad_cooperativa.png' },
    { cat: 'principales', label: 'Distintivo COLUA', path: 'assets/distintivo_colua.png' },
    { cat: 'principales', label: 'PBX Teléfono', path: 'assets/pbx.png' },
    { cat: 'principales', label: 'MICOOPE en Línea', path: 'assets/micoope_enlinea.png' },
    { cat: 'principales', label: 'Tarjeta de Débito', path: 'assets/tarjeta_debito.png' },
    { cat: 'principales', label: 'Edificio COLUA', path: 'assets/colua_edificio.png' },
    { cat: 'principales', label: 'Perfil Asociado', path: 'assets/perfil.png' },
    { cat: 'principales', label: 'Inicio', path: 'assets/inicio.png' },

    // 2. Cuentas de Ahorro
    { cat: 'ahorros', label: 'Aportación Adulto', path: 'assets/ahorro1.png' },
    { cat: 'ahorros', label: 'Ahorro Infanto Juvenil', path: 'assets/ahorro2.png' },
    { cat: 'ahorros', label: 'Aportación Infantil', path: 'assets/ahorro_infanto_juvenil.png' },
    { cat: 'ahorros', label: 'Cuenta Disponible', path: 'assets/ahorro_disponible.png' },
    { cat: 'ahorros', label: 'Ahorro Programado', path: 'assets/ahorro_programado.png' },
    { cat: 'ahorros', label: 'Ahorro Plazo Fijo', path: 'assets/ahorro_plazo_fijo.png' },

    // 3. Líneas de Crédito
    { cat: 'creditos', label: 'Crédito Productivo', path: 'assets/credito_productivo.png' },
    { cat: 'creditos', label: 'Crédi Consumo', path: 'assets/credi_consumo.png' },
    { cat: 'creditos', label: 'Crédito Vivienda', path: 'assets/credito_vivienda.png' },
    { cat: 'creditos', label: 'Crédi Vehículo', path: 'assets/credi_vehiculo.png' },
    { cat: 'creditos', label: 'Crédito Agrícola', path: 'assets/credito1.png' },
    { cat: 'creditos', label: 'Crédito Automático', path: 'assets/credito2.png' },

    // 4. Seguros Columna
    { cat: 'seguros', label: 'Seguro CV Especial', path: 'assets/seguro_cv_personal.png' },
    { cat: 'seguros', label: 'Vida Saludable', path: 'assets/seguro_vida_saludable.png' },
    { cat: 'seguros', label: 'Edad de Oro', path: 'assets/seguro_edad_de_oro.png' },
    { cat: 'seguros', label: 'Seguro Cáncer', path: 'assets/seguro_de_cancer.png' },
    { cat: 'seguros', label: 'Accidentes Infantil', path: 'assets/seguro_accidentes_infanto_juvenil.png' },
    { cat: 'seguros', label: 'Seguro Manejo', path: 'assets/seguro_manejo.png' },
    { cat: 'seguros', label: 'Vida Individual/Familiar', path: 'assets/seguro_de_vida_individual_o_familar.png' },

    // 5. Beneficios Cooperativos
    { cat: 'beneficios', label: 'Renta Hospitalaria', path: 'assets/renta_diaria.png' },
    { cat: 'beneficios', label: 'Apoyo Quirúrgico', path: 'assets/apoyo_quirurgico.png' },
    { cat: 'beneficios', label: 'Servicio Funerario', path: 'assets/servicio_funerario.png' },
    { cat: 'beneficios', label: 'Seguro Ahorrantes', path: 'assets/beneficio_de_ahorrantes.png' },
    { cat: 'beneficios', label: 'Seguro Deudores', path: 'assets/beneficio_de_deudores.png' },
    { cat: 'beneficios', label: 'Beneficio de Oro', path: 'assets/beneficio_de_oro.png' },

    // 6. Remesas y Asistencias
    { cat: 'remesas', label: 'Repatriación', path: 'assets/rd1.png' },
    { cat: 'remesas', label: 'Asistencia Funeraria', path: 'assets/rd2.png' },
    { cat: 'remesas', label: 'Referencias Médicas', path: 'assets/rd3.png' },
    { cat: 'remesas', label: 'Orientación 24/7', path: 'assets/rd4.png' },
    { cat: 'remesas', label: 'Banner Remesas', path: 'assets/mas_que_una_remesa.png' },
    { cat: 'remesas', label: 'Remesadoras Red', path: 'assets/remesadoras_afiliadas.png' },

    // 7. Fotos e Institucional
    { cat: 'fotos', label: 'Jornada Reforestación', path: 'assets/noticia_reforestacion.jpg' },
    { cat: 'fotos', label: 'Taller Finanzas', path: 'assets/noticia_taller_finanzas.jpg' },
    { cat: 'fotos', label: 'Asamblea General', path: 'assets/noticia_asamblea_general.jpg' },
    { cat: 'fotos', label: 'Mujer Artesana', path: 'assets/nosotros_artesana.jpg' },
    { cat: 'fotos', label: 'Equipo y Sede', path: 'assets/nosotros_edificio_equipo.jpg' },
    { cat: 'fotos', label: 'Valores Cooperativos', path: 'assets/valores_colua.png' },
    { cat: 'fotos', label: 'Logo Composite', path: 'assets/logo_composite.png' }
];

class AdminComponent {
    constructor() {
        this.activeTab = 'pantallas'; // 'pantallas', 'canvas', 'stats', 'sync', 'rbac', 'audit', 'instrucciones'
        this.sections = [];
        this.selectedSectionId = null;
        this.selectedContentItems = [];
        this.selectedItemId = null;
        this.selectedItemBlocks = [];
        this.users = [];
        this.auditLogs = [];
        this.syncStatus = null;
        this.gateStep = 1; // 1 = Clave Universal Obligatoria, 2 = Credenciales Administrativas
        this.universalKeyPassed = false;
        this.userCurrentPage = 1;
        this.userPageSize = 10;
        this.userSearchFilter = '';
    }

    async render(container) {
        // Validación de Permisos y 2-Step Gate (Siempre obligatorio)
        if (!authService.isAdminSessionActive()) {
            this.renderAdminLoginGate(container);
            return;
        }

        container.innerHTML = `
            <div class="admin-panel" style="padding-bottom: 90px; background: #f4f6fa; min-height: 100vh;">
                <!-- Header CMS -->
                <div style="background: linear-gradient(135deg, #0a1931 0%, var(--colua-navy) 100%); color: white; padding: 18px 24px; box-shadow: var(--shadow-md);">
                    <div style="max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
                        <div style="display: flex; align-items: center; gap: 14px;">
                            <div style="display: flex; align-items: center; justify-content: center;">
                                <img src="assets/logo_composite.png" alt="COLUA MICOOPE" style="height: 44px; width: auto; object-fit: contain; display: block;" onerror="this.src='assets/distintivo_colua.png'" />
                            </div>
                            <div>
                                <h1 style="font-size: 1.35rem; font-weight: 700; color: #ffffff !important; margin: 0 0 2px 0; display: flex; align-items: center; gap: 10px; letter-spacing: -0.2px;">
                                    Panel de Control CMS COLUA
                                    <span class="badge" style="background: var(--colua-gold); color: #0a1931; font-size: 0.7rem; font-weight: 800; padding: 3px 8px; border-radius: 6px; letter-spacing: 0.5px;">
                                        ${authService.isSuperAdmin() ? 'SUPERADMIN' : (authService.isManager() ? 'MANAGER' : 'ADMIN')}
                                    </span>
                                </h1>
                                <span style="font-size: 0.84rem; color: rgba(255, 255, 255, 0.85); font-weight: 400;">Gestor de Contenidos, Pantallas y Seguridad</span>
                            </div>
                        </div>

                        <div style="display: flex; align-items: center; gap: 10px;">
                            <button id="cms-exit-btn" class="btn btn-outline" style="color: white; border-color: rgba(255,255,255,0.4); font-size: 0.8rem; padding: 6px 12px; display: inline-flex; align-items: center; gap: 6px;">
                                ${ADMIN_ICONS.externalLink} <span>Ver App Web</span>
                            </button>
                            <button id="cms-logout-btn" class="btn" style="background: rgba(228, 42, 103, 0.2); color: #ff85a1; border: 1px solid rgba(228, 42, 103, 0.4); font-size: 0.8rem; padding: 6px 12px;">
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Tabs de Navegación del CMS -->
                <div style="background: white; border-bottom: 1px solid var(--colua-gray-200); position: sticky; top: 0; z-index: 100;">
                    <div style="max-width: 1400px; margin: 0 auto; display: flex; gap: 4px; overflow-x: auto; padding: 0 16px;">
                        <button class="cms-tab-btn ${this.activeTab === 'pantallas' ? 'active' : ''}" data-tab="pantallas" style="display: inline-flex; align-items: center; gap: 6px;">
                            ${ADMIN_ICONS.screens} <span>Pantallas y Menús</span>
                        </button>
                        <button class="cms-tab-btn ${this.activeTab === 'canvas' ? 'active' : ''}" data-tab="canvas" style="display: inline-flex; align-items: center; gap: 6px;">
                            ${ADMIN_ICONS.canvas} <span>Editor Canvas</span>
                        </button>
                        <button class="cms-tab-btn ${this.activeTab === 'formularios' ? 'active' : ''}" data-tab="formularios" style="display: inline-flex; align-items: center; gap: 6px;">
                            ${ADMIN_ICONS.forms} <span>Formularios & Leads</span>
                        </button>
                        <button class="cms-tab-btn ${this.activeTab === 'stats' ? 'active' : ''}" data-tab="stats" style="display: inline-flex; align-items: center; gap: 6px;">
                            ${ADMIN_ICONS.chart} <span>Estadísticas</span>
                        </button>
                        <button class="cms-tab-btn ${this.activeTab === 'sync' ? 'active' : ''}" data-tab="sync" style="display: inline-flex; align-items: center; gap: 6px;">
                            ${ADMIN_ICONS.sync} <span>Publicación</span>
                        </button>
                        ${authService.isSuperAdmin() ? `
                            <button class="cms-tab-btn ${this.activeTab === 'rbac' ? 'active' : ''}" data-tab="rbac" style="display: inline-flex; align-items: center; gap: 6px;">
                                ${ADMIN_ICONS.users} <span>Usuarios y Roles</span>
                            </button>
                        ` : ''}
                        <button class="cms-tab-btn ${this.activeTab === 'audit' ? 'active' : ''}" data-tab="audit" style="display: inline-flex; align-items: center; gap: 6px;">
                            ${ADMIN_ICONS.audit} <span>Auditoría</span>
                        </button>
                        <button class="cms-tab-btn ${this.activeTab === 'instrucciones' ? 'active' : ''}" data-tab="instrucciones" style="display: inline-flex; align-items: center; gap: 6px;">
                            ${ADMIN_ICONS.book} <span>Instrucciones</span>
                        </button>
                    </div>
                </div>

                <!-- Cuerpo del CMS -->
                <div class="container" style="max-width: 1400px; margin: 20px auto; padding: 0 16px;">
                    <div id="cms-tab-content">
                        <div style="display: flex; justify-content: center; align-items: center; padding: 50px;">
                            <div class="spinner"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.bindGlobalEvents(container);
        await this.loadTabContent();
    }

    renderAdminLoginGate(container) {
        // PASO 1 OBLIGATORIO: Validación de la Clave Universal Institucional
        if (!this.universalKeyPassed || this.gateStep === 1) {
            container.innerHTML = `
                <div style="min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 20px;">
                    <div class="card" style="max-width: 420px; width: 100%; padding: 36px 28px; text-align: center; border-top: 3.5px solid var(--colua-navy); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02); border-radius: 14px;">
                        <div style="width: 58px; height: 58px; border-radius: 50%; background: rgba(23, 55, 137, 0.06); border: 1px solid rgba(23, 55, 137, 0.12); color: var(--colua-navy); display: flex; align-items: center; justify-content: center; margin: 0 auto 18px auto;">
                            ${ADMIN_ICONS.lock}
                        </div>
                        <h2 style="font-size: 1.35rem; font-weight: 700; color: var(--colua-navy); margin-bottom: 6px;">
                            Portal Administrativo
                        </h2>
                        <p style="font-size: 0.84rem; color: var(--colua-gray-600); margin-bottom: 24px; line-height: 1.45;">
                            Ingresa la Clave Universal de seguridad institucional para continuar.
                        </p>

                        <form id="admin-universal-gate-form">
                            <div class="form-group" style="margin-bottom: 22px; text-align: left;">
                                <label style="display: block; font-size: 0.82rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 6px;">
                                    Clave Universal Institucional
                                </label>
                                <div style="position: relative;">
                                    <input type="password" id="admin-universal-input" required placeholder="••••••••••••••••"
                                        autocomplete="off"
                                        style="width: 100%; padding: 11px 44px 11px 14px; border: 1.5px solid var(--colua-gray-200); border-radius: 10px; font-size: 0.95rem; letter-spacing: 2px;" />
                                    <button type="button" id="toggle-universal-eye" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--colua-gray-400); display: flex; align-items: center; padding: 4px;">
                                        ${ADMIN_ICONS.eye}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 0.92rem; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
                                <span>Validar Clave Institucional</span>
                                ${ADMIN_ICONS.arrowRight}
                            </button>
                        </form>

                        <div style="margin-top: 26px; border-top: 1px solid var(--colua-gray-100); padding-top: 16px;">
                            <a href="#inicio" style="font-size: 0.82rem; color: var(--colua-navy); text-decoration: none; font-weight: 600;">
                                ← Volver al Inicio
                            </a>
                        </div>
                    </div>
                </div>
            `;

            const formUniversal = container.querySelector('#admin-universal-gate-form');
            const inputUniversal = container.querySelector('#admin-universal-input');
            const eyeBtn = container.querySelector('#toggle-universal-eye');

            if (eyeBtn && inputUniversal) {
                eyeBtn.addEventListener('click', () => {
                    const isPass = inputUniversal.type === 'password';
                    inputUniversal.type = isPass ? 'text' : 'password';
                    eyeBtn.innerHTML = isPass ? ADMIN_ICONS.eyeOff : ADMIN_ICONS.eye;
                });
            }

            if (formUniversal) {
                formUniversal.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const keyVal = inputUniversal.value.trim();
                    const isMaster = await authService.checkAdminMasterPassword(keyVal);
                    if (isMaster) {
                        this.universalKeyPassed = true;
                        this.gateStep = 2;
                        if (window.Swal) {
                            await Swal.fire({
                                title: "¡Clave Institucional Correcta!",
                                text: "Filtro de seguridad 1 aprobado. Por favor ingresa tus credenciales administrativas.",
                                icon: "success",
                                timer: 1500,
                                showConfirmButton: false,
                                draggable: true
                            });
                        } else {
                            app.showToast('Clave institucional verificada', 'success');
                        }
                        this.renderAdminLoginGate(container);
                    } else {
                        if (window.Swal) {
                            Swal.fire({
                                title: "Clave Universal Incorrecta",
                                text: "La clave institucional ingresada no es válida. Acceso restringido.",
                                icon: "error",
                                draggable: true,
                                confirmButtonColor: "#173789",
                                confirmButtonText: "Reintentar"
                            });
                        } else {
                            app.showToast('Clave Universal incorrecta. Acceso denegado.', 'danger');
                        }
                        inputUniversal.value = '';
                        inputUniversal.focus();
                    }
                });
            }
            return;
        }

        // PASO 2: Identificación con Credenciales Administrativas (Super Admin / Admin / Manager)
        container.innerHTML = `
            <div style="min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div class="card" style="max-width: 420px; width: 100%; padding: 32px 28px; text-align: center; border-top: 3.5px solid var(--colua-navy); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02); border-radius: 14px;">
                    <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.74rem; font-weight: 600; color: #15803d; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 20px; margin-bottom: 16px;">
                        ${ADMIN_ICONS.shieldCheck} <span>Filtro de Seguridad Aprobado</span>
                    </div>

                    <div style="width: 58px; height: 58px; border-radius: 50%; background: rgba(23, 55, 137, 0.06); border: 1px solid rgba(23, 55, 137, 0.12); color: var(--colua-navy); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;">
                        ${ADMIN_ICONS.user}
                    </div>
                    <h2 style="font-size: 1.35rem; font-weight: 700; color: var(--colua-navy); margin-bottom: 6px;">
                        Acceso Administrativo CMS
                    </h2>
                    <p style="font-size: 0.84rem; color: var(--colua-gray-600); margin-bottom: 22px; line-height: 1.45;">
                        Ingresa las credenciales autorizadas correspondientes a tu cuenta.
                    </p>

                    <form id="admin-credentials-gate-form">
                        <div class="form-group" style="margin-bottom: 14px; text-align: left;">
                            <label style="display: block; font-size: 0.82rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">
                                Correo o Usuario
                            </label>
                            <input type="text" id="admin-user-input" required placeholder="••••••••••••••••"
                                autocomplete="username"
                                style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--colua-gray-200); border-radius: 10px; font-size: 0.9rem;" />
                        </div>

                        <div class="form-group" style="margin-bottom: 22px; text-align: left;">
                            <label style="display: block; font-size: 0.82rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">
                                Contraseña
                            </label>
                            <div style="position: relative;">
                                <input type="password" id="admin-pass-input" required placeholder="••••••••••••••••"
                                    autocomplete="current-password"
                                    style="width: 100%; padding: 10px 44px 10px 12px; border: 1.5px solid var(--colua-gray-200); border-radius: 10px; font-size: 0.9rem; letter-spacing: 2px;" />
                                <button type="button" id="toggle-pass-eye" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--colua-gray-400); display: flex; align-items: center; padding: 4px;">
                                    ${ADMIN_ICONS.eye}
                                </button>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 0.92rem; font-weight: 600;">
                            Ingresar al Panel
                        </button>

                        <div style="margin-top: 14px;">
                            <button type="button" id="btn-back-to-step1" style="background: none; border: none; font-size: 0.8rem; color: var(--colua-gray-500); cursor: pointer; text-decoration: underline;">
                                ← Cambiar Clave Universal
                            </button>
                        </div>
                    </form>

                    <div style="margin-top: 24px; border-top: 1px solid var(--colua-gray-100); padding-top: 16px;">
                        <a href="#inicio" style="font-size: 0.82rem; color: var(--colua-navy); text-decoration: none; font-weight: 600;">
                            ← Volver al Inicio
                        </a>
                    </div>
                </div>
            </div>
        `;

        const formCredentials = container.querySelector('#admin-credentials-gate-form');
        const passInput = container.querySelector('#admin-pass-input');
        const eyeBtn = container.querySelector('#toggle-pass-eye');
        const backBtn = container.querySelector('#btn-back-to-step1');

        if (eyeBtn && passInput) {
            eyeBtn.addEventListener('click', () => {
                const isPass = passInput.type === 'password';
                passInput.type = isPass ? 'text' : 'password';
                eyeBtn.innerHTML = isPass ? ADMIN_ICONS.eyeOff : ADMIN_ICONS.eye;
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.gateStep = 1;
                this.universalKeyPassed = false;
                this.renderAdminLoginGate(container);
            });
        }

        if (formCredentials) {
            formCredentials.addEventListener('submit', async (e) => {
                e.preventDefault();
                const userVal = container.querySelector('#admin-user-input').value.trim();
                const passVal = passInput.value;

                const res = await authService.loginAdminWithCredentials(userVal, passVal);
                if (res.success && authService.isAdminSessionActive()) {
                    const roleLabel = authService.isSuperAdmin() ? 'Super Administrador' : (authService.isManager() ? 'Manager' : 'Administrador');
                    if (window.Swal) {
                        await Swal.fire({
                            title: "¡Bienvenido al Panel CMS!",
                            text: `Sesión administrativa iniciada con rol: ${roleLabel}.`,
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                            draggable: true
                        });
                    } else {
                        app.showToast(`Bienvenido al Panel CMS (${roleLabel})`, 'success');
                    }
                    this.render(container);
                } else {
                    const cleanErr = (res && res.error && !res.error.startsWith('Firebase:') && !res.error.includes('(auth/'))
                        ? res.error
                        : "Credenciales incorrectas o usuario no autorizado para el panel administrativo.";
                    if (window.Swal) {
                        Swal.fire({
                            title: "Acceso Denegado",
                            text: cleanErr,
                            icon: "error",
                            draggable: true,
                            confirmButtonColor: "#173789",
                            confirmButtonText: "Reintentar"
                        });
                    } else {
                        app.showToast(cleanErr, 'danger');
                    }
                }
            });
        }
    }

    bindGlobalEvents(container) {
        const tabBtns = container.querySelectorAll('.cms-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeTab = btn.dataset.tab;
                await this.loadTabContent();
            });
        });

        const exitBtn = container.querySelector('#cms-exit-btn');
        if (exitBtn) {
            exitBtn.addEventListener('click', async () => {
                if (window.Swal) {
                    await Swal.fire({
                        title: "Modo Vista Previa",
                        text: "Estás ingresando a la aplicación pública en modo de vista previa de contenidos.",
                        icon: "info",
                        draggable: true,
                        confirmButtonColor: "#173789",
                        confirmButtonText: "Ingresar a la App"
                    });
                } else {
                    app.showToast('Ingresando en modo vista previa', 'info');
                }
                window.location.hash = '#inicio';
            });
        }

        const logoutBtn = container.querySelector('#cms-logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                // Solo cerrar la sesión del portal administrativo
                authService.currentAdminSession = null;
                authService.setAdminSessionActive(false);
                
                app.showToast('Sesión de administración cerrada', 'info');
                await new Promise(r => setTimeout(r, 800));
                
                // Redirigir al inicio y recargar para limpiar la vista de administrador
                window.location.hash = '#inicio';
                window.location.reload();
            });
        }
    }

    async loadTabContent() {
        const contentEl = document.getElementById('cms-tab-content');
        if (!contentEl) return;

        contentEl.innerHTML = `<div style="text-align: center; padding: 40px;"><div class="spinner"></div></div>`;

        try {
            switch (this.activeTab) {
                case 'pantallas':
                    await this.renderTabPantallas(contentEl);
                    break;
                case 'canvas':
                    await this.renderTabCanvas(contentEl);
                    break;
                case 'formularios':
                    await this.renderTabFormularios(contentEl);
                    break;
                case 'stats':
                    await this.renderTabStats(contentEl);
                    break;
                case 'sync':
                    await this.renderTabSync(contentEl);
                    break;
                case 'rbac':
                    await this.renderTabRBAC(contentEl);
                    break;
                case 'audit':
                    await this.renderTabAudit(contentEl);
                    break;
                case 'instrucciones':
                    await this.renderTabInstrucciones(contentEl);
                    break;
            }
        } catch (error) {
            console.error('Error cargando pestaña CMS:', error);
            contentEl.innerHTML = `<div class="card" style="padding: 24px; color: red;">Error: ${error.message}</div>`;
        }
    }

    // ==========================================
    // TAB 1: PANTALLAS Y MENÚS
    // ==========================================
    async renderTabPantallas(container) {
        this.sections = (await coluaRepo.getSections()).filter(s => s.id !== 'sec_comunidad' && s.slug !== 'comunidad' && (s.title || '').trim().toLowerCase() !== 'comunidad');
        const bottomSlots = coluaRepo.getBottomNavSlots();
        const topNavItems = coluaRepo.getTopNavItemsSync();

        const placementLabels = {
            'grid_and_drawer': 'Cuadrícula y Menú Lateral',
            'grid_only': 'Solo Cuadrícula Inicio',
            'drawer_only': 'Solo Menú Lateral',
            'bottom_nav': 'Barra Inferior Móvil',
            'hidden': 'Oculto de Menús'
        };

        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 14px;">
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 4px 0;">
                        Gestor de Pantallas y Sitios en Menús
                    </h2>
                    <p style="font-size: 0.85rem; color: var(--colua-gray-600); margin: 0;">
                        Configura los botones del menú superior con sub-opciones, los sitios de la barra inferior móvil y las secciones de la cooperativa.
                    </p>
                </div>
                <button id="add-new-section-btn" class="btn btn-primary" style="font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
                    ${ADMIN_ICONS.plus} <span>Crear Nueva Sección</span>
                </button>
            </div>

            <!-- Módulo Visual de Gestión del Menú Superior y Sub-botones (Desktop Navbar) -->
            <div class="card" style="padding: 22px; background: white; border-radius: 14px; box-shadow: var(--shadow-sm); border: 1.5px solid var(--colua-navy); margin-bottom: 26px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
                    <div>
                        <h3 style="font-size: 1.12rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 3px 0; display: flex; align-items: center; gap: 8px;">
                            ${ADMIN_ICONS.screens} <span>Botones del Menú Superior y Sub-opciones (Navbar)</span>
                        </h3>
                        <p style="font-size: 0.82rem; color: var(--colua-gray-600); margin: 0;">
                            Crea botones para la barra superior, asigna la pantalla a la que conducen y agrega sub-botones para desplegar subopciones.
                        </p>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                        <button id="reset-top-nav-btn" class="btn btn-outline" style="font-size: 0.8rem; padding: 6px 12px; color: var(--colua-navy); border-color: var(--colua-gray-300);" title="Restaura los 12 botones estándar originales de COLUA">
                            Restablecer Menú Estándar
                        </button>
                        <button id="add-top-nav-btn" class="btn btn-primary" style="font-size: 0.85rem; padding: 7px 14px; display: inline-flex; align-items: center; gap: 6px; background: var(--colua-navy);">
                            ${ADMIN_ICONS.plus} <span>Crear Botón en Menú</span>
                        </button>
                    </div>
                </div>

                <!-- Lista de Botones del Menú Superior -->
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${topNavItems.map((item, idx) => {
                        const targetSec = this.sections.find(s => s.id === item.targetSectionId || s.slug === item.targetSectionId);
                        const targetLabel = targetSec ? targetSec.title : (item.targetSectionId || 'Sin pantalla asignada');
                        const subCount = Array.isArray(item.subItems) ? item.subItems.length : 0;

                        return `
                            <div class="top-nav-item-row" style="border: 1px solid var(--colua-gray-200); border-radius: 10px; background: #ffffff; overflow: hidden; transition: all 0.15s ease;">
                                <!-- Fila Principal del Botón -->
                                <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #f8fafc; border-bottom: ${subCount > 0 ? '1px solid var(--colua-gray-200)' : 'none'}; flex-wrap: wrap; gap: 10px;">
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <span style="font-size: 0.76rem; font-weight: 800; background: var(--colua-navy); color: white; padding: 3px 8px; border-radius: 6px;">
                                            #${idx + 1}
                                        </span>
                                        <div>
                                            <strong style="font-size: 0.95rem; color: var(--colua-navy); display: inline-flex; align-items: center; gap: 6px;">
                                                ${item.label}
                                                ${subCount > 0 ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>` : ''}
                                            </strong>
                                            <div style="display: flex; align-items: center; gap: 8px; margin-top: 3px; font-size: 0.78rem; flex-wrap: wrap;">
                                                <span style="color: var(--colua-gray-600);">Pantalla destino:</span>
                                                <span style="background: rgba(37, 99, 235, 0.1); color: #2563eb; font-weight: 700; padding: 2px 8px; border-radius: 6px;">
                                                    ${targetLabel} (${item.targetSectionId || 'menú desplegable'})
                                                </span>
                                                <span style="background: ${subCount > 0 ? '#dcfce7' : '#f1f5f9'}; color: ${subCount > 0 ? '#15803d' : '#64748b'}; font-weight: 700; padding: 2px 8px; border-radius: 6px;">
                                                    ${subCount > 0 ? `${subCount} sub-opción(es)` : 'Sin sub-opciones'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                                        <button class="btn add-sub-nav-btn" data-parent-id="${item.id}" data-parent-title="${item.label}" style="font-size: 0.78rem; padding: 5px 10px; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; border-radius: 6px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;" title="Agregar sub-botón a este menú">
                                            ${ADMIN_ICONS.plus} <span>+ Sub-botón</span>
                                        </button>
                                        <button class="btn edit-top-nav-btn" data-id="${item.id}" style="font-size: 0.78rem; padding: 5px 10px; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 6px; font-weight: 600;" title="Editar botón del menú">
                                            ${ADMIN_ICONS.edit} <span>Editar</span>
                                        </button>
                                        <button class="btn move-top-nav-up-btn" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''} style="font-size: 0.78rem; padding: 5px 8px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; cursor: ${idx === 0 ? 'not-allowed' : 'pointer'}; opacity: ${idx === 0 ? '0.4' : '1'};" title="Subir orden">
                                            ▲
                                        </button>
                                        <button class="btn move-top-nav-down-btn" data-idx="${idx}" ${idx === topNavItems.length - 1 ? 'disabled' : ''} style="font-size: 0.78rem; padding: 5px 8px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; cursor: ${idx === topNavItems.length - 1 ? 'not-allowed' : 'pointer'}; opacity: ${idx === topNavItems.length - 1 ? '0.4' : '1'};" title="Bajar orden">
                                            ▼
                                        </button>
                                        <button class="btn delete-top-nav-btn" data-id="${item.id}" data-label="${item.label}" style="font-size: 0.78rem; padding: 5px 10px; background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; border-radius: 6px; font-weight: 600;" title="Eliminar botón del menú">
                                            ${ADMIN_ICONS.trash}
                                        </button>
                                    </div>
                                </div>

                                <!-- Sub-botones anidados (si existen) -->
                                ${subCount > 0 ? `
                                    <div style="padding: 10px 16px 12px 36px; background: #ffffff; display: flex; flex-direction: column; gap: 6px;">
                                        <span style="font-size: 0.72rem; font-weight: 700; color: var(--colua-gray-500); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">
                                            Sub-opciones desplegables de este botón:
                                        </span>
                                        ${item.subItems.map(sub => {
                                            const subSec = this.sections.find(s => s.id === sub.targetSectionId || s.slug === sub.targetSectionId);
                                            const subSecLabel = subSec ? subSec.title : (sub.targetSectionId || 'Sin pantalla asignada');

                                            return `
                                                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #f8fafc; border-left: 3.5px solid #2563eb; border-radius: 0 8px 8px 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; flex-wrap: wrap; gap: 8px;">
                                                    <div style="display: flex; align-items: center; gap: 8px;">
                                                        <span style="color: #2563eb; font-weight: 800; font-size: 0.85rem;">↳</span>
                                                        <strong style="font-size: 0.88rem; color: #1e293b;">${sub.label}</strong>
                                                        <span style="font-size: 0.76rem; background: #eff6ff; color: #1d4ed8; padding: 1px 7px; border-radius: 5px; font-weight: 600;">
                                                            Pantalla: ${subSecLabel} (${sub.targetSectionId})
                                                        </span>
                                                    </div>
                                                    <div style="display: flex; align-items: center; gap: 6px;">
                                                        <button class="btn edit-sub-nav-btn" data-parent-id="${item.id}" data-sub-id="${sub.id}" data-sub-label="${sub.label}" data-sub-target="${sub.targetSectionId}" style="font-size: 0.74rem; padding: 4px 8px; background: white; border: 1px solid #cbd5e1; border-radius: 5px; color: #334155;">
                                                            Editar
                                                        </button>
                                                        <button class="btn delete-sub-nav-btn" data-parent-id="${item.id}" data-sub-id="${sub.id}" data-sub-label="${sub.label}" style="font-size: 0.74rem; padding: 4px 8px; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 5px; color: #be123c;">
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Módulo Visual de los 5 Sitios de la Barra Inferior (Inicio Fijo + 4 Sitios Intercambiables) -->
            <div class="card" style="padding: 22px; background: white; border-radius: 14px; box-shadow: var(--shadow-sm); border: 1.5px solid var(--colua-navy); margin-bottom: 26px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <h3 style="font-size: 1.08rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 3px 0; display: flex; align-items: center; gap: 8px;">
                            ${ADMIN_ICONS.screens} <span>Configuración de Sitios: Barra Inferior (5 Pantallas)</span>
                        </h3>
                        <p style="font-size: 0.82rem; color: var(--colua-gray-600); margin: 0;">
                            <strong>Inicio</strong> está fijado permanentemente en el centro. Cambia cualquiera de las otras 4 posiciones quitando una sección e ingresando otra.
                        </p>
                    </div>
                    <span class="badge" style="background: rgba(23, 55, 137, 0.1); color: var(--colua-navy); font-weight: 800; font-size: 0.76rem; letter-spacing: 0.5px;">
                        5 BOTONES INFERIORES
                    </span>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 12px;">
                    ${bottomSlots.map(slot => {
                        if (slot.slotIndex === 3 || slot.isFixed) {
                            const homeSec = this.sections.find(s => s.id === 'sec_home' || s.slug === 'home');
                            const homeTitle = slot.label || (homeSec ? homeSec.title : 'Inicio');
                            return `
                                <div style="padding: 14px 12px; border-radius: 10px; background: rgba(23, 55, 137, 0.05); border: 2px solid var(--colua-navy); text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                                    <span style="font-size: 0.72rem; font-weight: 700; color: var(--colua-navy); text-transform: uppercase; margin-bottom: 6px;">
                                        Posición 3 (Centro)
                                    </span>
                                    <div style="width: 42px; height: 42px; border-radius: 50%; background: var(--colua-navy); display: flex; align-items: center; justify-content: center; margin-bottom: 6px; box-shadow: 0 3px 6px rgba(0,0,0,0.15);">
                                        <img src="assets/distintivo_colua.png" alt="${homeTitle}" style="height: 24px; width: auto;" />
                                    </div>
                                    <strong style="font-size: 0.92rem; color: var(--colua-navy);">${homeTitle}</strong>
                                    <span style="font-size: 0.72rem; color: #15803d; font-weight: 700; background: #dcfce7; padding: 2px 8px; border-radius: 12px; margin-top: 6px; display: inline-flex; align-items: center; gap: 4px;">
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Fijo e Inamovible
                                    </span>
                                </div>
                            `;
                        }

                        const posLabels = { 1: 'Posición 1 (Izquierda 1)', 2: 'Posición 2 (Izquierda 2)', 4: 'Posición 4 (Derecha 1)', 5: 'Posición 5 (Derecha 2)' };

                        return `
                            <div style="padding: 14px 12px; border-radius: 10px; background: #fafbfc; border: 1.5px solid var(--colua-gray-200); text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
                                <div>
                                    <span style="font-size: 0.72rem; font-weight: 700; color: var(--colua-gray-500); text-transform: uppercase; display: block; margin-bottom: 6px;">
                                        ${posLabels[slot.slotIndex] || `Posición ${slot.slotIndex}`}
                                    </span>
                                    <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 8px;">
                                        <img src="${slot.icon || 'assets/distintivo_colua.png'}" style="height: 22px; width: 22px; object-fit: contain;" onerror="this.src='assets/distintivo_colua.png'" />
                                        <strong style="font-size: 0.9rem; color: var(--colua-navy);">${slot.label}</strong>
                                    </div>
                                </div>
                                <div style="margin-top: 6px;">
                                    <label style="font-size: 0.72rem; color: var(--colua-gray-500); display: block; margin-bottom: 4px; font-weight: 600;">Cambiar Sitio:</label>
                                    <select class="change-bottom-slot-select" data-slot="${slot.slotIndex}" style="width: 100%; padding: 6px 8px; font-size: 0.8rem; font-weight: 600; border: 1.5px solid var(--colua-gray-300); border-radius: 6px; background: white; color: var(--colua-navy);">
                                        ${this.sections.map(sec => `
                                            <option value="${sec.id}" ${sec.id === slot.sectionId || sec.slug === slot.slug ? 'selected' : ''}>
                                                ${sec.title}
                                            </option>
                                        `).join('')}
                                    </select>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Tabla de Todas las Pantallas y Secciones -->
            <div class="card" style="padding: 0; overflow: hidden; background: white; border-radius: 12px; box-shadow: var(--shadow-sm); border: 1px solid var(--colua-gray-200);">
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
                        <thead style="background: var(--colua-gray-50); border-bottom: 1.5px solid var(--colua-gray-200); color: var(--colua-gray-700);">
                            <tr>
                                <th style="padding: 12px 16px; width: 60px;">Orden</th>
                                <th style="padding: 12px 16px;">Sección / Título</th>
                                <th style="padding: 12px 16px;">Ruta (Slug)</th>
                                <th style="padding: 12px 16px;">Ubicación de Menú (Lugar)</th>
                                <th style="padding: 12px 16px;">Estado</th>
                                <th style="padding: 12px 16px; text-align: right;">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.sections.map((sec, idx) => {
                                const isAct = sec.isEnabled !== false && sec.isVisible !== false;
                                const isBottomSlot = bottomSlots.find(s => s.sectionId === sec.id || s.slug === sec.slug);
                                const placementText = isBottomSlot 
                                    ? `Barra Inferior (Pos. ${isBottomSlot.slotIndex}) + Menús` 
                                    : (placementLabels[sec.menuPlacement] || (sec.menuPlacement || 'Cuadrícula y Menú Lateral'));

                                return `
                                    <tr style="border-bottom: 1px solid var(--colua-gray-100); transition: background-color 0.15s ease;" onmouseover="this.style.backgroundColor='#f8fafc'" onmouseout="this.style.backgroundColor='transparent'">
                                        <td style="padding: 12px 16px; font-weight: 700; color: var(--colua-navy);">${sec.orderIndex ?? idx + 1}</td>
                                        <td style="padding: 12px 16px;">
                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                <span style="font-size: 1.1rem; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; background: rgba(23, 55, 137, 0.06); color: var(--colua-navy);">
                                                    ${sec.icon ? sec.icon : ADMIN_ICONS.document}
                                                </span>
                                                <div>
                                                    <strong style="color: var(--colua-navy); display: block; font-size: 0.92rem;">${sec.title}</strong>
                                                    <span style="font-size: 0.76rem; color: var(--colua-gray-500);">${sec.subtitle || 'Sin subtítulo'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td style="padding: 12px 16px; font-family: monospace; color: var(--colua-gray-600); font-size: 0.82rem;">#${sec.slug || sec.id}</td>
                                        <td style="padding: 12px 16px;">
                                            <span class="badge" style="background: rgba(23, 55, 137, 0.08); color: var(--colua-navy); font-size: 0.76rem; font-weight: 600;">
                                                ${placementText}
                                            </span>
                                        </td>
                                        <td style="padding: 12px 16px;">
                                            <span class="badge" style="background: ${isAct ? 'rgba(89, 184, 164, 0.18)' : 'rgba(228, 42, 103, 0.18)'}; color: ${isAct ? 'var(--colua-green)' : 'var(--colua-pink)'}; font-size: 0.76rem; font-weight: 700;">
                                                ${isAct ? 'Activo' : 'Oculto'}
                                            </span>
                                        </td>
                                        <td style="padding: 12px 16px; text-align: right; white-space: nowrap;">
                                            <!-- Botón Ocultar / Mostrar -->
                                            <button class="btn btn-outline toggle-sec-visibility-btn" data-id="${sec.id}" title="${isAct ? 'Ocultar Sección' : 'Mostrar Sección'}"
                                                style="padding: 5px 9px; font-size: 0.78rem; margin-right: 4px; border-color: ${isAct ? 'var(--colua-gray-300)' : 'var(--colua-green)'}; color: ${isAct ? 'var(--colua-gray-700)' : 'var(--colua-green)'};">
                                                ${isAct ? ADMIN_ICONS.eyeOff : ADMIN_ICONS.eye} <span>${isAct ? 'Ocultar' : 'Mostrar'}</span>
                                            </button>

                                            <!-- Botón Editar (Nombre y Lugar) -->
                                            <button class="btn btn-outline edit-sec-btn" data-id="${sec.id}" title="Editar nombre, slug y ubicación"
                                                style="padding: 5px 9px; font-size: 0.78rem; margin-right: 4px; color: var(--colua-navy); border-color: var(--colua-navy);">
                                                ${ADMIN_ICONS.edit} <span>Editar</span>
                                            </button>

                                            <!-- Botón Canvas -->
                                            <button class="btn btn-outline edit-canvas-link" data-id="${sec.id}" title="Editar bloques en Canvas"
                                                style="padding: 5px 9px; font-size: 0.78rem; margin-right: 4px; border-color: var(--colua-green); color: var(--colua-green);">
                                                ${ADMIN_ICONS.canvas} <span>Canvas</span>
                                            </button>

                                            <!-- Botón Eliminar -->
                                            <button class="btn btn-outline delete-sec-btn" data-id="${sec.id}" data-title="${sec.title}" title="Eliminar Sección"
                                                style="padding: 5px 9px; font-size: 0.78rem; border-color: rgba(228, 42, 103, 0.4); color: var(--colua-pink);">
                                                ${ADMIN_ICONS.trash} <span>Eliminar</span>
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Evento cambio de sitio en barra inferior
        container.querySelectorAll('.change-bottom-slot-select').forEach(sel => {
            sel.addEventListener('change', async () => {
                const slotIndex = parseInt(sel.dataset.slot);
                const newSectionId = sel.value;
                const res = await coluaRepo.updateBottomNavSlot(slotIndex, newSectionId);
                if (res.success) {
                    const sec = this.sections.find(s => s.id === newSectionId);
                    Swal.fire({
                        title: "¡Sitio Actualizado!",
                        text: `La Posición ${slotIndex} de la barra inferior ahora muestra "${sec?.title || newSectionId}".`,
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                        draggable: true
                    });
                    await this.loadTabContent();
                } else {
                    Swal.fire({
                        title: "Error",
                        text: res.error || "No se pudo cambiar el sitio.",
                        icon: "error",
                        timer: 2000,
                        showConfirmButton: false,
                        draggable: true
                    });
                }
            });
        });

        // Eventos del Gestor de Menú Superior (Navbar y Sub-botones)
        container.querySelector('#add-top-nav-btn')?.addEventListener('click', () => {
            this.showTopNavItemModal(null);
        });

        container.querySelectorAll('.edit-top-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const item = coluaRepo.getTopNavItemsSync().find(n => n.id === id);
                if (item) this.showTopNavItemModal(item);
            });
        });

        container.querySelectorAll('.delete-top-nav-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const label = btn.dataset.label;
                const confirm = await Swal.fire({
                    title: `¿Eliminar "${label}"?`,
                    text: "Se quitará este botón y sus sub-opciones de la barra de navegación superior.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#e42a67",
                    cancelButtonColor: "#64748b",
                    confirmButtonText: "Sí, eliminar",
                    cancelButtonText: "Cancelar"
                });
                if (confirm.isConfirmed) {
                    await coluaRepo.deleteTopNavItem(id);
                    window.navbarComponent?.refresh();
                    Swal.fire({
                        title: "¡Botón Eliminado!",
                        text: `El botón "${label}" ha sido eliminado del menú.`,
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });
                    await this.loadTabContent();
                }
            });
        });

        container.querySelectorAll('.add-sub-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const parentId = btn.dataset.parentId;
                const parentTitle = btn.dataset.parentTitle;
                this.showTopNavSubItemModal(parentId, parentTitle, null);
            });
        });

        container.querySelectorAll('.edit-sub-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const parentId = btn.dataset.parentId;
                const subId = btn.dataset.subId;
                const subLabel = btn.dataset.subLabel;
                const subTarget = btn.dataset.subTarget;
                this.showTopNavSubItemModal(parentId, '', { id: subId, label: subLabel, targetSectionId: subTarget });
            });
        });

        container.querySelectorAll('.delete-sub-nav-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const parentId = btn.dataset.parentId;
                const subId = btn.dataset.subId;
                const subLabel = btn.dataset.subLabel;
                const confirm = await Swal.fire({
                    title: `¿Eliminar sub-botón "${subLabel}"?`,
                    text: "Esta sub-opción se quitará del menú desplegable.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#e42a67",
                    cancelButtonColor: "#64748b",
                    confirmButtonText: "Sí, eliminar",
                    cancelButtonText: "Cancelar"
                });
                if (confirm.isConfirmed) {
                    await coluaRepo.deleteTopNavSubItem(parentId, subId);
                    window.navbarComponent?.refresh();
                    Swal.fire({
                        title: "¡Sub-botón Eliminado!",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });
                    await this.loadTabContent();
                }
            });
        });

        container.querySelectorAll('.move-top-nav-up-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const idx = parseInt(btn.dataset.idx);
                const items = coluaRepo.getTopNavItemsSync();
                if (idx > 0) {
                    const temp = items[idx - 1];
                    items[idx - 1] = items[idx];
                    items[idx] = temp;
                    await coluaRepo.reorderTopNavItems(items.map(i => i.id));
                    window.navbarComponent?.refresh();
                    await this.loadTabContent();
                }
            });
        });

        container.querySelectorAll('.move-top-nav-down-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const idx = parseInt(btn.dataset.idx);
                const items = coluaRepo.getTopNavItemsSync();
                if (idx < items.length - 1) {
                    const temp = items[idx + 1];
                    items[idx + 1] = items[idx];
                    items[idx] = temp;
                    await coluaRepo.reorderTopNavItems(items.map(i => i.id));
                    window.navbarComponent?.refresh();
                    await this.loadTabContent();
                }
            });
        });

        container.querySelector('#reset-top-nav-btn')?.addEventListener('click', async () => {
            const confirm = await Swal.fire({
                title: "¿Restablecer Menú Superior?",
                text: "Se volverán a colocar los 12 botones estándar originales de COLUA.",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#173789",
                cancelButtonColor: "#64748b",
                confirmButtonText: "Sí, restablecer",
                cancelButtonText: "Cancelar"
            });
            if (confirm.isConfirmed) {
                await coluaRepo.resetTopNavToDefaults();
                window.navbarComponent?.refresh();
                Swal.fire({
                    title: "¡Menú Restablecido!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
                await this.loadTabContent();
            }
        });

        // Eventos de creación, visibilidad, edición y eliminación
        container.querySelector('#add-new-section-btn')?.addEventListener('click', () => {
            this.showEditSectionModal(null);
        });

        // Evento Ocultar / Mostrar Sección
        container.querySelectorAll('.toggle-sec-visibility-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const res = await coluaRepo.toggleSectionVisibility(id);
                if (res.success) {
                    Swal.fire({
                        title: res.isEnabled ? "Sección Visible" : "Sección Oculta",
                        text: `La sección "${res.section.title}" ahora está ${res.isEnabled ? 'activa y visible' : 'oculta de la aplicación'}.`,
                        icon: res.isEnabled ? "success" : "info",
                        timer: 1500,
                        showConfirmButton: false,
                        draggable: true
                    });
                    await this.loadTabContent();
                } else {
                    Swal.fire({
                        title: "Error",
                        text: res.error || "No se pudo cambiar la visibilidad.",
                        icon: "error",
                        timer: 2000,
                        showConfirmButton: false,
                        draggable: true
                    });
                }
            });
        });

        // Evento Editar Sección
        container.querySelectorAll('.edit-sec-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const sec = this.sections.find(s => s.id === btn.dataset.id);
                if (sec) this.showEditSectionModal(sec);
            });
        });

        // Evento Eliminar Sección
        container.querySelectorAll('.delete-sec-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const title = btn.dataset.title;

                if (id === 'sec_home') {
                    Swal.fire({
                        title: "Acción no permitida",
                        text: "La pantalla de Inicio es estructural y no puede ser eliminada.",
                        icon: "info",
                        timer: 2000,
                        showConfirmButton: false,
                        draggable: true
                    });
                    return;
                }

                const confirmRes = await Swal.fire({
                    title: `¿Eliminar "${title}"?`,
                    text: "Esta acción removerá permanentemente la sección del sistema y sus menús.",
                    icon: "warning",
                    draggable: true,
                    showCancelButton: true,
                    confirmButtonColor: "#e42a67",
                    cancelButtonColor: "#64748b",
                    confirmButtonText: "Sí, eliminar",
                    cancelButtonText: "Cancelar"
                });

                if (confirmRes.isConfirmed) {
                    await coluaRepo.deleteSection(id);
                    await coluaRepo.logAudit({
                        action: 'ELIMINAR_SECCION',
                        performedBy: 'Super Administrador',
                        details: `Se eliminó permanentemente la sección: ${title} (${id})`
                    });

                    Swal.fire({
                        title: "¡Sección Eliminada!",
                        text: `La sección "${title}" ha sido eliminada correctamente.`,
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                        draggable: true
                    });
                    await this.loadTabContent();
                }
            });
        });

        container.querySelectorAll('.edit-canvas-link').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedSectionId = btn.dataset.id;
                this.activeTab = 'canvas';
                const tabBtn = document.querySelector('.cms-tab-btn[data-tab="canvas"]');
                if (tabBtn) tabBtn.click();
            });
        });
    }

    showEditSectionModal(sec) {
        const isNew = !sec;
        const currentData = sec || {
            id: 'sec_' + Math.random().toString(36).substring(2, 9),
            title: '',
            subtitle: '',
            slug: '',
            icon: '',
            colorHex: '#173789',
            menuPlacement: 'grid_and_drawer',
            orderIndex: this.sections.length + 1,
            isEnabled: true
        };

        const modalHtml = `
            <div style="padding: 4px;">
                <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--colua-navy); margin-bottom: 6px;">
                    ${isNew ? 'Nueva Sección' : `Editar Sección: ${currentData.title}`}
                </h3>
                <p style="font-size: 0.84rem; color: var(--colua-gray-600); margin-bottom: 18px;">
                    Configura el nombre, texto descriptivo, ruta y lugar donde se mostrará la sección.
                </p>

                <form id="section-edit-form">
                    <div class="form-group" style="margin-bottom: 14px;">
                        <label style="display: block; font-size: 0.84rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">Nombre / Título de la Sección *</label>
                        <input type="text" id="sec-title" value="${currentData.title}" required placeholder="Ej: Préstamos Especiales"
                            style="width: 100%; padding: 10px 14px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.9rem;" />
                    </div>

                    <div class="form-group" style="margin-bottom: 14px;">
                        <label style="display: block; font-size: 0.84rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">Subtítulo o Descripción Breve</label>
                        <input type="text" id="sec-subtitle" value="${currentData.subtitle || ''}" placeholder="Ej: Soluciones para asociados"
                            style="width: 100%; padding: 10px 14px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.9rem;" />
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
                        <div>
                            <label style="display: block; font-size: 0.84rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">Ruta / Slug (#) *</label>
                            <input type="text" id="sec-slug" value="${currentData.slug || currentData.id.replace('sec_', '')}" required placeholder="ej: prestamos"
                                style="width: 100%; padding: 10px 14px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.9rem;" />
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.84rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">Ícono / Distintivo</label>
                            <div style="display: flex; gap: 6px; align-items: center;">
                                <input type="text" id="sec-icon" value="${currentData.icon || ''}" placeholder="Ej: ahorros, credito, seguro"
                                    style="width: 100%; padding: 10px 14px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.9rem;" />
                                <select id="sec-icon-quick-select" style="padding: 10px 8px; font-size: 0.82rem; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; background: white; color: var(--colua-navy);">
                                    <option value="">(Elegir de catálogo...)</option>
                                    ${ASSET_CATALOG.filter(a => a.cat === 'principales').map(a => `
                                        <option value="${a.path.replace('assets/', '').replace('.png', '')}">
                                            ${a.label}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                        <div>
                            <label style="display: block; font-size: 0.84rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">Lugar / Ubicación en Menús</label>
                            <select id="sec-placement" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem; background: white;">
                                <option value="grid_and_drawer" ${currentData.menuPlacement === 'grid_and_drawer' ? 'selected' : ''}>Cuadrícula y Menú Lateral</option>
                                <option value="grid_only" ${currentData.menuPlacement === 'grid_only' ? 'selected' : ''}>Solo Cuadrícula Inicio</option>
                                <option value="drawer_only" ${currentData.menuPlacement === 'drawer_only' ? 'selected' : ''}>Solo Menú Lateral</option>
                                <option value="bottom_nav" ${currentData.menuPlacement === 'bottom_nav' ? 'selected' : ''}>Barra Inferior Móvil</option>
                                <option value="hidden" ${currentData.menuPlacement === 'hidden' ? 'selected' : ''}>Oculto de Menús</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.84rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">Orden Numérico</label>
                            <input type="number" id="sec-order" value="${currentData.orderIndex || 1}" min="1" max="99"
                                style="width: 100%; padding: 10px 14px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.9rem;" />
                        </div>
                    </div>

                    <div style="margin-bottom: 22px; padding: 12px 14px; background: #f8fafc; border-radius: 8px; border: 1px solid var(--colua-gray-200);">
                        <label style="display: flex; align-items: center; gap: 10px; font-size: 0.88rem; font-weight: 600; color: var(--colua-gray-800); cursor: pointer;">
                            <input type="checkbox" id="sec-enabled" ${currentData.isEnabled !== false ? 'checked' : ''} style="width: 18px; height: 18px;" />
                            <span>Sección habilitada y visible en la plataforma pública</span>
                        </label>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 10px;">
                        <button type="button" class="btn btn-outline" onclick="app.closeModal()" style="padding: 8px 16px;">Cancelar</button>
                        <button type="submit" class="btn btn-primary" style="padding: 8px 18px;">Guardar Sección</button>
                    </div>
                </form>
            </div>
        `;

        app.showModal(modalHtml);

        const secIconInput = document.getElementById('sec-icon');
        const secQuickSelect = document.getElementById('sec-icon-quick-select');
        secQuickSelect?.addEventListener('change', () => {
            if (secQuickSelect.value && secIconInput) {
                secIconInput.value = secQuickSelect.value;
            }
        });

        document.getElementById('section-edit-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const updated = {
                ...currentData,
                title: document.getElementById('sec-title').value.trim(),
                subtitle: document.getElementById('sec-subtitle').value.trim(),
                slug: document.getElementById('sec-slug').value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, ''),
                icon: document.getElementById('sec-icon').value.trim(),
                menuPlacement: document.getElementById('sec-placement').value,
                orderIndex: parseInt(document.getElementById('sec-order').value) || 1,
                isEnabled: document.getElementById('sec-enabled').checked,
                isVisible: document.getElementById('sec-enabled').checked,
                isDraft: true,
                isPublished: false,
                lastModified: Date.now()
            };

            await coluaRepo.saveSection(updated);
            await coluaRepo.logAudit({
                action: isNew ? 'CREAR_SECCION' : 'EDITAR_SECCION',
                performedBy: 'Super Administrador',
                details: `Se ${isNew ? 'creó' : 'editó'} la sección ${updated.title} (#${updated.slug}) con lugar: ${updated.menuPlacement}`
            });

            app.closeModal();
            Swal.fire({
                title: "¡Sección Guardada!",
                text: `La sección "${updated.title}" ha sido guardada en borrador para publicación.`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                draggable: true
            });
            await this.loadTabContent();
        });
    }

    showTopNavItemModal(item = null) {
        const isNew = !item;
        const currentData = item || {
            id: 'topnav_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            label: '',
            targetSectionId: 'sec_home',
            orderIndex: coluaRepo.getTopNavItemsSync().length + 1,
            subItems: []
        };

        const modalHtml = `
            <div style="padding: 4px;">
                <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--colua-navy); margin-bottom: 6px;">
                    ${isNew ? 'Nuevo Botón en Barra Superior' : `Editar Botón: ${currentData.label}`}
                </h3>
                <p style="font-size: 0.84rem; color: var(--colua-gray-600); margin-bottom: 18px;">
                    Configura el nombre del botón visible en la barra de navegación superior y la pantalla o sección a la que conducirá.
                </p>

                <form id="top-nav-item-form">
                    <div class="form-group" style="margin-bottom: 16px;">
                        <label style="display: block; font-size: 0.84rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">
                            Nombre / Texto del Botón *
                        </label>
                        <input type="text" id="top-nav-label" value="${currentData.label}" required placeholder="Ej: Ahorros, Créditos, Asistencia..."
                            style="width: 100%; padding: 10px 14px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.9rem;" />
                    </div>

                    <div class="form-group" style="margin-bottom: 16px;">
                        <label style="display: block; font-size: 0.84rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">
                            Pantalla / Sección Destino *
                        </label>
                        <select id="top-nav-target" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem; background: white; color: var(--colua-navy);">
                            <optgroup label="Secciones de la Cooperativa">
                                ${this.sections.map(sec => `
                                    <option value="${sec.id}" ${currentData.targetSectionId === sec.id || currentData.targetSectionId === sec.slug ? 'selected' : ''}>
                                        ${sec.title} (#${sec.slug || sec.id})
                                    </option>
                                `).join('')}
                            </optgroup>
                            <optgroup label="Pantallas Especiales del Sistema">
                                <option value="admin" ${currentData.targetSectionId === 'admin' ? 'selected' : ''}>Portal Administrativo (#admin)</option>
                                <option value="perfil" ${currentData.targetSectionId === 'perfil' ? 'selected' : ''}>Perfil de Asociado (#perfil)</option>
                                <option value="" ${!currentData.targetSectionId ? 'selected' : ''}>Sin Pantalla Directa (Solo Desplegable con Sub-opciones)</option>
                            </optgroup>
                        </select>
                        <span style="display: block; font-size: 0.76rem; color: var(--colua-gray-500); margin-top: 4px;">
                            Al hacer clic en el botón principal, el usuario navegará a esta pantalla seleccionada.
                        </span>
                    </div>

                    <div class="form-group" style="margin-bottom: 22px;">
                        <label style="display: block; font-size: 0.84rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">
                            Posición u Orden Numérico
                        </label>
                        <input type="number" id="top-nav-order" value="${currentData.orderIndex || 1}" min="1" max="99"
                            style="width: 100%; padding: 10px 14px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.9rem;" />
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 10px;">
                        <button type="button" class="btn btn-outline" onclick="app.closeModal()" style="padding: 8px 16px;">Cancelar</button>
                        <button type="submit" class="btn btn-primary" style="padding: 8px 18px; background: var(--colua-navy);">
                            ${isNew ? 'Crear Botón' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        app.showModal(modalHtml);

        const form = document.getElementById('top-nav-item-form');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const labelVal = document.getElementById('top-nav-label').value.trim();
            const targetVal = document.getElementById('top-nav-target').value;
            const orderVal = parseInt(document.getElementById('top-nav-order').value) || 1;

            const itemToSave = {
                id: currentData.id,
                label: labelVal,
                targetSectionId: targetVal,
                orderIndex: orderVal,
                subItems: currentData.subItems || []
            };

            await coluaRepo.saveTopNavItem(itemToSave);
            window.navbarComponent?.refresh();
            app.closeModal();

            Swal.fire({
                title: isNew ? "¡Botón Creado!" : "¡Botón Actualizado!",
                text: `El botón "${labelVal}" ha sido configurado en el menú superior.`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                draggable: true
            });

            await this.loadTabContent();
        });
    }

    showTopNavSubItemModal(parentId, parentTitle = '', subItem = null) {
        const isNew = !subItem;
        const currentData = subItem || {
            id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            label: '',
            targetSectionId: 'sec_home'
        };

        const modalHtml = `
            <div style="padding: 4px;">
                <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--colua-navy); margin-bottom: 6px;">
                    ${isNew ? 'Nuevo Sub-botón / Sub-opción' : `Editar Sub-botón: ${currentData.label}`}
                </h3>
                <p style="font-size: 0.84rem; color: var(--colua-gray-600); margin-bottom: 18px;">
                    ${parentTitle ? `Agregando sub-opción desplegable dentro de: <strong>${parentTitle}</strong>` : 'Configura la sub-opción desplegable y la pantalla a la que conduce.'}
                </p>

                <form id="top-nav-sub-item-form">
                    <div class="form-group" style="margin-bottom: 16px;">
                        <label style="display: block; font-size: 0.84rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">
                            Nombre / Texto de la Sub-opción *
                        </label>
                        <input type="text" id="top-nav-sub-label" value="${currentData.label}" required placeholder="Ej: Ahorro Plazo Fijo, Crédito Vivienda..."
                            style="width: 100%; padding: 10px 14px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.9rem;" />
                    </div>

                    <div class="form-group" style="margin-bottom: 22px;">
                        <label style="display: block; font-size: 0.84rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">
                            Pantalla Asignada *
                        </label>
                        <select id="top-nav-sub-target" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem; background: white; color: var(--colua-navy);">
                            <optgroup label="Secciones de la Cooperativa">
                                ${this.sections.map(sec => `
                                    <option value="${sec.id}" ${currentData.targetSectionId === sec.id || currentData.targetSectionId === sec.slug ? 'selected' : ''}>
                                        ${sec.title} (#${sec.slug || sec.id})
                                    </option>
                                `).join('')}
                            </optgroup>
                            <optgroup label="Otras Pantallas">
                                <option value="admin" ${currentData.targetSectionId === 'admin' ? 'selected' : ''}>Portal Administrativo (#admin)</option>
                                <option value="perfil" ${currentData.targetSectionId === 'perfil' ? 'selected' : ''}>Perfil de Asociado (#perfil)</option>
                            </optgroup>
                        </select>
                        <span style="display: block; font-size: 0.76rem; color: var(--colua-gray-500); margin-top: 4px;">
                            Al seleccionar esta opción en el menú desplegable, el usuario irá directamente a esta pantalla.
                        </span>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 10px;">
                        <button type="button" class="btn btn-outline" onclick="app.closeModal()" style="padding: 8px 16px;">Cancelar</button>
                        <button type="submit" class="btn btn-primary" style="padding: 8px 18px; background: #2563eb;">
                            ${isNew ? 'Guardar Sub-botón' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        app.showModal(modalHtml);

        const form = document.getElementById('top-nav-sub-item-form');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const labelVal = document.getElementById('top-nav-sub-label').value.trim();
            const targetVal = document.getElementById('top-nav-sub-target').value;

            const subItemData = {
                id: currentData.id,
                label: labelVal,
                targetSectionId: targetVal
            };

            if (isNew) {
                await coluaRepo.addTopNavSubItem(parentId, subItemData);
            } else {
                await coluaRepo.updateTopNavSubItem(parentId, subItemData);
            }

            window.navbarComponent?.refresh();
            app.closeModal();

            Swal.fire({
                title: isNew ? "¡Sub-botón Agregado!" : "¡Sub-botón Actualizado!",
                text: `La sub-opción "${labelVal}" se ha guardado en el menú desplegable.`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                draggable: true
            });

            await this.loadTabContent();
        });
    }

    // ==========================================
    // TAB: FORMULARIOS Y CAPTACIÓN DE LEADS
    // ==========================================
    async renderTabFormularios(container) {
        const leads = await coluaRepo.getFormSubmissions();
        const forms = await coluaRepo.getForms();

        const totalLeads = leads.length;
        const pendingLeads = leads.filter(l => !l.estado || l.estado === 'Pendiente').length;
        const contactedLeads = leads.filter(l => l.estado === 'Contactado').length;
        const affiliatedLeads = leads.filter(l => l.estado === 'Afiliado / Coordinado' || l.estado === 'Afiliado').length;

        container.innerHTML = `
            <div style="max-width: 1400px; margin: 0 auto;">
                <!-- Encabezado -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; flex-wrap: wrap; gap: 12px;">
                    <div>
                        <h2 style="font-size: 1.3rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 4px 0; display: inline-flex; align-items: center; gap: 8px;">
                            ${ADMIN_ICONS.forms} <span>Gestor de Formularios y Captación de Asociados (Leads)</span>
                        </h2>
                        <p style="font-size: 0.85rem; color: var(--colua-gray-600); margin: 0;">
                            Bandeja de solicitudes de nuevos asociados, contacto directo por WhatsApp y configuración de formularios interactivos.
                        </p>
                    </div>
                    <button id="btn-create-new-form" class="btn btn-primary" style="font-size: 0.85rem; padding: 8px 16px; display: inline-flex; align-items: center; gap: 6px;">
                        ${ADMIN_ICONS.plus} <span>Crear Nuevo Formulario</span>
                    </button>
                </div>

                <!-- Métricas de Captación -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
                    <div class="card" style="background: white; border-radius: 12px; padding: 18px; border-left: 4px solid var(--colua-navy); box-shadow: var(--shadow-sm);">
                        <span style="font-size: 0.78rem; font-weight: 700; color: var(--colua-gray-600); text-transform: uppercase; letter-spacing: 0.5px;">Total Solicitudes</span>
                        <div style="font-size: 1.8rem; font-weight: 800; color: var(--colua-navy); margin-top: 4px;">${totalLeads}</div>
                        <span style="font-size: 0.75rem; color: var(--colua-gray-500);">Todas las captaciones registradas</span>
                    </div>

                    <div class="card" style="background: white; border-radius: 12px; padding: 18px; border-left: 4px solid #f59e0b; box-shadow: var(--shadow-sm);">
                        <span style="font-size: 0.78rem; font-weight: 700; color: #b45309; text-transform: uppercase; letter-spacing: 0.5px;">Pendientes de Contacto</span>
                        <div style="font-size: 1.8rem; font-weight: 800; color: #d97706; margin-top: 4px;">${pendingLeads}</div>
                        <span style="font-size: 0.75rem; color: var(--colua-gray-500);">Requieren llamada o WhatsApp</span>
                    </div>

                    <div class="card" style="background: white; border-radius: 12px; padding: 18px; border-left: 4px solid #0284c7; box-shadow: var(--shadow-sm);">
                        <span style="font-size: 0.78rem; font-weight: 700; color: #0369a1; text-transform: uppercase; letter-spacing: 0.5px;">Contactados / En Gestión</span>
                        <div style="font-size: 1.8rem; font-weight: 800; color: #0284c7; margin-top: 4px;">${contactedLeads}</div>
                        <span style="font-size: 0.75rem; color: var(--colua-gray-500);">En proceso de coordinación</span>
                    </div>

                    <div class="card" style="background: white; border-radius: 12px; padding: 18px; border-left: 4px solid #10b981; box-shadow: var(--shadow-sm);">
                        <span style="font-size: 0.78rem; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.5px;">Afiliados / Coordinados</span>
                        <div style="font-size: 1.8rem; font-weight: 800; color: #10b981; margin-top: 4px;">${affiliatedLeads}</div>
                        <span style="font-size: 0.75rem; color: var(--colua-gray-500);">Aportación y libreta lista</span>
                    </div>
                </div>

                <!-- SECCIÓN 1: BANDEJA DE SOLICITUDES / LEADS -->
                <div class="card" style="background: white; border-radius: 14px; padding: 22px; box-shadow: var(--shadow-sm); margin-bottom: 28px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 10px;">
                        <div>
                            <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 2px 0;">
                                Bandeja de Solicitudes Recibidas (${totalLeads})
                            </h3>
                            <span style="font-size: 0.8rem; color: var(--colua-gray-500);">Contacta de inmediato a los prospectos para concretar su asociación cooperativa</span>
                        </div>
                        ${leads.length > 0 ? `
                            <button type="button" id="btn-export-leads-csv" class="btn btn-outline" style="padding: 7px 14px; font-size: 0.82rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; border-color: #10b981; color: #047857;">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                <span>📥 Exportar a Excel (.CSV)</span>
                            </button>
                        ` : ''}
                    </div>

                    ${leads.length === 0 ? `
                        <div style="text-align: center; padding: 40px 20px; background: #f8fafc; border-radius: 10px; border: 1.5px dashed #cbd5e1;">
                            <div style="width: 48px; height: 48px; border-radius: 50%; background: #eff6ff; color: var(--colua-navy); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto;">
                                ${ADMIN_ICONS.forms}
                            </div>
                            <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--colua-navy); margin-bottom: 4px;">No hay solicitudes pendientes</h4>
                            <p style="font-size: 0.84rem; color: var(--colua-gray-500); margin: 0;">Cuando un usuario envíe el formulario de "¿Cómo Asociarte?", aparecerá aquí en tiempo real.</p>
                        </div>
                    ` : `
                        <div style="overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse; font-size: 0.86rem; text-align: left;">
                                <thead>
                                    <tr style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; color: var(--colua-gray-700);">
                                        <th style="padding: 10px 14px; font-weight: 700;">Fecha / Hora</th>
                                        <th style="padding: 10px 14px; font-weight: 700;">Solicitante</th>
                                        <th style="padding: 10px 14px; font-weight: 700;">Contacto Directo</th>
                                        <th style="padding: 10px 14px; font-weight: 700;">Agencia / Pago</th>
                                        <th style="padding: 10px 14px; font-weight: 700;">Estado</th>
                                        <th style="padding: 10px 14px; font-weight: 700; text-align: center;">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${leads.map(lead => {
                                        const cleanPhone = (lead.telefono || '').replace(/[^0-9]/g, '');
                                        const waPhone = cleanPhone.startsWith('502') ? cleanPhone : '502' + cleanPhone;
                                        const waText = encodeURIComponent(`Hola ${lead.nombre}, te saludamos de COLUA MICOOPE respecto a tu solicitud de afiliación cooperativa en línea. ¿En qué momento podemos coordinar tus requisitos y aportación inicial?`);
                                        const waLink = `https://wa.me/${waPhone}?text=${waText}`;

                                        const statusBg = lead.estado === 'Afiliado / Coordinado' || lead.estado === 'Afiliado' 
                                            ? '#dcfce7; color: #15803d; border-color: #86efac;' 
                                            : (lead.estado === 'Contactado' 
                                                ? '#e0f2fe; color: #0369a1; border-color: #7dd3fc;' 
                                                : (lead.estado === 'Descartado' 
                                                    ? '#f1f5f9; color: #64748b; border-color: #cbd5e1;' 
                                                    : '#fef3c7; color: #b45309; border-color: #fcd34d;'));

                                        return `
                                            <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s ease;">
                                                <td style="padding: 12px 14px; white-space: nowrap; color: #64748b; font-size: 0.82rem;">
                                                    <strong>${lead.fechaStr ? lead.fechaStr.split(',')[0] : (lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Reciente')}</strong>
                                                    <div style="font-size: 0.74rem; color: #94a3b8;">${lead.fechaStr && lead.fechaStr.includes(',') ? lead.fechaStr.split(',')[1] : ''}</div>
                                                </td>
                                                <td style="padding: 12px 14px;">
                                                    <div style="font-weight: 700; color: var(--colua-navy); font-size: 0.9rem;">${lead.nombre}</div>
                                                    ${lead.dpi ? `<div style="font-size: 0.76rem; color: #64748b;">DPI: ${lead.dpi}</div>` : ''}
                                                </td>
                                                <td style="padding: 12px 14px;">
                                                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                                        <strong style="color: #0f172a;">${lead.telefono}</strong>
                                                        ${cleanPhone ? `
                                                            <a href="${waLink}" target="_blank" class="btn" style="padding: 3px 8px; font-size: 0.72rem; background: #25D366; color: white; border-radius: 6px; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;" title="Chatear por WhatsApp">
                                                                <span>💬 WhatsApp</span>
                                                            </a>
                                                        ` : ''}
                                                    </div>
                                                    <a href="mailto:${lead.email}" style="font-size: 0.78rem; color: var(--colua-navy); text-decoration: none;">${lead.email}</a>
                                                </td>
                                                <td style="padding: 12px 14px;">
                                                    <div style="font-weight: 600; color: #1e293b;">${lead.agenciaPreferida || 'Central'}</div>
                                                    <div style="font-size: 0.75rem; color: #64748b;">${lead.metodoPago || 'Efectivo / Agencia'}</div>
                                                </td>
                                                <td style="padding: 12px 14px;">
                                                    <select class="lead-status-dropdown" data-id="${lead.id}" style="padding: 5px 8px; font-size: 0.78rem; font-weight: 700; border-radius: 8px; border: 1.5px solid; background: ${statusBg} cursor: pointer;">
                                                        <option value="Pendiente" ${(!lead.estado || lead.estado === 'Pendiente') ? 'selected' : ''}>⏳ Pendiente</option>
                                                        <option value="Contactado" ${lead.estado === 'Contactado' ? 'selected' : ''}>💬 Contactado</option>
                                                        <option value="Afiliado / Coordinado" ${(lead.estado === 'Afiliado / Coordinado' || lead.estado === 'Afiliado') ? 'selected' : ''}>✅ Afiliado / Coordinado</option>
                                                        <option value="Descartado" ${lead.estado === 'Descartado' ? 'selected' : ''}>✕ Descartado</option>
                                                    </select>
                                                </td>
                                                <td style="padding: 12px 14px; text-align: center; white-space: nowrap;">
                                                    <div style="display: inline-flex; gap: 6px;">
                                                        <button class="btn btn-outline btn-lead-detail" data-id="${lead.id}" style="padding: 5px 8px; font-size: 0.76rem; color: var(--colua-navy);" title="Ver Detalle Completo">
                                                            🔍 Detalle
                                                        </button>
                                                        <button class="btn btn-outline btn-lead-delete" data-id="${lead.id}" style="padding: 5px 8px; font-size: 0.76rem; color: #ef4444; border-color: #fca5a5;" title="Eliminar Solicitud">
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                </div>

                <!-- SECCIÓN 2: FORMULARIOS CONFIGURADOS -->
                <div class="card" style="background: white; border-radius: 14px; padding: 22px; box-shadow: var(--shadow-sm);">
                    <div style="margin-bottom: 18px;">
                        <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 2px 0;">
                            Formularios Dinámicos Disponibles (${forms.length})
                        </h3>
                        <span style="font-size: 0.8rem; color: var(--colua-gray-500);">Configura los requisitos, preguntas y campos para cada proceso de captación</span>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px;">
                        ${forms.map(form => `
                            <div style="border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 18px; background: #f8fafc; display: flex; flex-direction: column; justify-content: space-between;">
                                <div>
                                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                                        <span class="badge" style="background: rgba(23, 55, 137, 0.1); color: var(--colua-navy); font-size: 0.72rem; font-weight: 800;">
                                            ID: ${form.id}
                                        </span>
                                        <span class="badge" style="background: #dcfce7; color: #15803d; font-size: 0.72rem; font-weight: 700;">
                                            ${form.isEnabled !== false ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                    <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 6px 0;">
                                        ${form.title}
                                    </h4>
                                    <p style="font-size: 0.82rem; color: #475569; margin: 0 0 12px 0; line-height: 1.4;">
                                        ${form.subtitle || 'Sin descripción'}
                                    </p>

                                    <!-- Requisitos Configurados -->
                                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; margin-bottom: 12px;">
                                        <div style="font-size: 0.76rem; font-weight: 700; color: #0369a1; text-transform: uppercase; margin-bottom: 4px;">
                                            Requisitos (${form.requirements?.length || 0}):
                                        </div>
                                        <ul style="margin: 0; padding-left: 16px; font-size: 0.78rem; color: #334155;">
                                            ${(form.requirements || []).slice(0, 3).map(r => `<li>${r}</li>`).join('')}
                                        </ul>
                                    </div>

                                    <div style="font-size: 0.78rem; color: #64748b; margin-bottom: 14px;">
                                        Campos interactivos: <strong>${form.fields?.length || 0} campos</strong>
                                    </div>
                                </div>

                                <div style="display: flex; gap: 8px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
                                    <button class="btn btn-outline btn-edit-form" data-id="${form.id}" style="flex: 1; padding: 7px 12px; font-size: 0.8rem; font-weight: 600;">
                                        ✏️ Editar Formulario
                                    </button>
                                    <button class="btn btn-primary btn-preview-form" data-id="${form.id}" style="padding: 7px 12px; font-size: 0.8rem; font-weight: 600; background: var(--colua-navy);">
                                        👁️ Probar
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Eventos: Cambiar estado de lead
        container.querySelectorAll('.lead-status-dropdown').forEach(dropdown => {
            dropdown.addEventListener('change', async () => {
                const id = dropdown.dataset.id;
                const newStatus = dropdown.value;
                await coluaRepo.updateSubmissionStatus(id, newStatus);
                app.showToast(`Estado de solicitud actualizado a "${newStatus}"`, 'success');
                await this.renderTabFormularios(container);
            });
        });

        // Eventos: Ver Detalle de Lead
        container.querySelectorAll('.btn-lead-detail').forEach(btn => {
            btn.addEventListener('click', () => {
                const lead = leads.find(l => l.id === btn.dataset.id);
                if (lead) this.showLeadDetailModal(lead);
            });
        });

        // Eventos: Eliminar Lead
        container.querySelectorAll('.btn-lead-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                let confirmed = false;
                if (window.Swal) {
                    const res = await Swal.fire({
                        title: "¿Eliminar solicitud?",
                        text: "Esta acción no se puede deshacer.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#ef4444",
                        cancelButtonColor: "#64748b",
                        confirmButtonText: "Sí, Eliminar",
                        cancelButtonText: "Cancelar"
                    });
                    confirmed = res.isConfirmed;
                } else {
                    confirmed = confirm('¿Eliminar esta solicitud?');
                }

                if (confirmed) {
                    await coluaRepo.deleteSubmission(btn.dataset.id);
                    app.showToast('Solicitud eliminada.', 'info');
                    await this.renderTabFormularios(container);
                }
            });
        });

        // Eventos: Crear / Editar Formulario
        container.querySelector('#btn-create-new-form')?.addEventListener('click', () => {
            this.showEditFormModal();
        });

        container.querySelectorAll('.btn-edit-form').forEach(btn => {
            btn.addEventListener('click', () => {
                const form = forms.find(f => f.id === btn.dataset.id);
                if (form) this.showEditFormModal(form);
            });
        });

        // Eventos: Exportar a Excel CSV
        container.querySelector('#btn-export-leads-csv')?.addEventListener('click', () => {
            this.exportLeadsToCsv(leads);
        });

        // Eventos: Probar Formulario en Vivo
        container.querySelectorAll('.btn-preview-form').forEach(btn => {
            btn.addEventListener('click', () => {
                app.showDynamicFormModal(btn.dataset.id);
            });
        });
    }

    exportLeadsToCsv(leads) {
        if (!leads || leads.length === 0) {
            app.showToast('No hay solicitudes para exportar.', 'warning');
            return;
        }

        const headers = ['Fecha y Hora', 'Formulario', 'Nombre Solicitante', 'Teléfono', 'Email', 'Estado', 'Agencia / Pago', 'Respuestas Detalladas'];
        const rows = leads.map(l => {
            const fecha = `"${(l.fechaStr || new Date(l.createdAt || Date.now()).toLocaleString()).replace(/"/g, '""')}"`;
            const formTitle = `"${(l.formTitle || '¿Cómo Asociarte?').replace(/"/g, '""')}"`;
            const nombre = `"${(l.nombre || '').replace(/"/g, '""')}"`;
            const tel = `"${(l.telefono || '').replace(/"/g, '""')}"`;
            const email = `"${(l.email || '').replace(/"/g, '""')}"`;
            const estado = `"${(l.estado || 'Pendiente').replace(/"/g, '""')}"`;
            const agencia = `"${(l.agenciaPreferida || l.metodoPago || '').replace(/"/g, '""')}"`;
            
            let respuestasStr = '';
            if (l.respuestas && typeof l.respuestas === 'object') {
                respuestasStr = Object.entries(l.respuestas).map(([k, v]) => {
                    const cleanV = typeof v === 'string' && v.startsWith('data:image') ? '[Foto adjuntada]' : v;
                    return `${k}: ${cleanV}`;
                }).join(' | ');
            } else if (l.comentarios) {
                respuestasStr = l.comentarios;
            }
            const respuestas = `"${respuestasStr.replace(/"/g, '""')}"`;

            return [fecha, formTitle, nombre, tel, email, estado, agencia, respuestas].join(',');
        });

        const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `COLUA_Respuestas_Formularios_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        app.showToast('Archivo Excel (.CSV) descargado con éxito', 'success');
    }

    showLeadDetailModal(lead) {
        const cleanPhone = (lead.telefono || '').replace(/[^0-9]/g, '');
        const waPhone = cleanPhone.startsWith('502') ? cleanPhone : '502' + cleanPhone;
        const waText = encodeURIComponent(`Hola ${lead.nombre}, te saludamos de COLUA MICOOPE respecto a tu solicitud de afiliación...`);
        const waLink = `https://wa.me/${waPhone}?text=${waText}`;

        const modalHtml = `
            <div style="max-width: 500px; width: 100%; text-align: left;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 12px;">
                    <div style="width: 44px; height: 44px; border-radius: 50%; background: #eff6ff; color: var(--colua-navy); display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                        👤
                    </div>
                    <div>
                        <span class="badge" style="background: var(--colua-navy); color: white; font-size: 0.7rem;">SOLICITUD DE ASOCIACIÓN</span>
                        <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--colua-navy); margin: 2px 0 0 0;">${lead.nombre}</h3>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px; background: #f8fafc; border-radius: 10px; padding: 14px; border: 1px solid #e2e8f0; font-size: 0.88rem; margin-bottom: 16px; max-height: 60vh; overflow-y: auto;">
                    <div><strong>Formulario:</strong> ${lead.formTitle || '¿Cómo Asociarte?'}</div>
                    <div><strong>Fecha:</strong> ${lead.fechaStr || new Date(lead.createdAt || Date.now()).toLocaleString()}</div>
                    <div><strong>Teléfono / WhatsApp:</strong> <a href="${waLink}" target="_blank" style="color: #059669; font-weight: 700; text-decoration: none;">${lead.telefono} (Abrir WhatsApp)</a></div>
                    <div><strong>Correo Electrónico:</strong> <a href="mailto:${lead.email}" style="color: var(--colua-navy);">${lead.email}</a></div>
                    <div><strong>Estado Actual:</strong> <span class="badge" style="background: #dbeafe; color: #1e40af; font-size: 0.78rem;">${lead.estado || 'Pendiente'}</span></div>
                    
                    ${lead.respuestas && Object.keys(lead.respuestas).length > 0 ? `
                        <div style="border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 4px;">
                            <strong style="color: var(--colua-navy); display: block; margin-bottom: 8px;">Respuestas y Documentos Recibidos:</strong>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                ${Object.entries(lead.respuestas).map(([label, val]) => {
                                    const isImg = typeof val === 'string' && val.startsWith('data:image');
                                    return `
                                        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px;">
                                            <div style="font-weight: 700; font-size: 0.78rem; color: #475569; margin-bottom: 2px;">${label}</div>
                                            ${isImg ? `
                                                <div style="margin-top: 6px;">
                                                    <a href="${val}" target="_blank" title="Clic para ampliar foto" style="display: inline-block;">
                                                        <img src="${val}" alt="${label}" style="max-height: 120px; max-width: 100%; border-radius: 6px; border: 1px solid #cbd5e1; object-fit: contain; cursor: zoom-in;" />
                                                    </a>
                                                    <span style="display: block; font-size: 0.7rem; color: #0284c7; margin-top: 2px;">(Clic en la foto para ver en tamaño completo)</span>
                                                </div>
                                            ` : `
                                                <div style="font-size: 0.85rem; color: #0f172a;">${val || 'No especificado'}</div>
                                            `}
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    ` : (lead.comentarios ? `<div><strong>Comentarios:</strong><p style="margin: 4px 0 0 0; background: white; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0; font-style: italic;">${lead.comentarios}</p></div>` : '')}
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 8px;">
                    <a href="${waLink}" target="_blank" class="btn" style="background: #25D366; color: white; padding: 8px 16px; font-weight: 700; text-decoration: none; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; font-size: 0.86rem;">
                        <span>💬 Chatear por WhatsApp</span>
                    </a>
                    <button type="button" class="btn btn-outline" onclick="app.closeModal()" style="padding: 8px 16px;">Cerrar</button>
                </div>
            </div>
        `;
        app.showModal(modalHtml);
    }

    showEditFormModal(form = null) {
        const isNew = !form;
        const currentData = form || {
            id: 'form_' + Math.random().toString(36).substring(2, 8),
            title: 'Nuevo Formulario de Captación',
            subtitle: 'Completa tus datos para coordinar con un asesor.',
            buttonText: 'Enviar Solicitud',
            requirements: [
                'DPI vigente original o copia legible',
                'Recibo de luz, agua o teléfono reciente',
                'Aportación inicial mínima de Q 100.00'
            ],
            fields: [
                { id: 'nombre', label: 'Nombre y Apellido', type: 'text', required: true, placeholder: 'Ej: Juan Gómez' },
                { id: 'telefono', label: 'Teléfono / WhatsApp', type: 'tel', required: true, placeholder: 'Ej: 5555-1234' },
                { id: 'email', label: 'Correo Electrónico', type: 'email', required: true, placeholder: 'Ej: correo@gmail.com' }
            ],
            isEnabled: true
        };

        const requirementsText = (currentData.requirements || []).join('\n');

        const modalHtml = `
            <div style="max-width: 540px; width: 100%; text-align: left;">
                <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--colua-navy); margin-bottom: 6px;">
                    ${isNew ? 'Crear Nuevo Formulario' : 'Editar Formulario Dinámico'}
                </h3>
                <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 16px;">
                    Configura el título, instrucciones y la lista de requisitos que verá el usuario.
                </p>

                <form id="form-config-edit">
                    <div class="form-group" style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 0.82rem; font-weight: 700; color: var(--colua-gray-800); margin-bottom: 4px;">Título del Formulario *</label>
                        <input type="text" id="cfg-form-title" value="${currentData.title}" required style="width: 100%; padding: 8px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem;" />
                    </div>

                    <div class="form-group" style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 0.82rem; font-weight: 700; color: var(--colua-gray-800); margin-bottom: 4px;">Instrucciones o Subtítulo</label>
                        <input type="text" id="cfg-form-subtitle" value="${currentData.subtitle || ''}" style="width: 100%; padding: 8px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem;" />
                    </div>

                    <div class="form-group" style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 0.82rem; font-weight: 700; color: var(--colua-gray-800); margin-bottom: 4px;">
                            Lista de Requisitos (Un requisito por línea)
                        </label>
                        <textarea id="cfg-form-requirements" rows="4" style="width: 100%; padding: 8px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.84rem; font-family: inherit; resize: vertical;">${requirementsText}</textarea>
                        <span style="font-size: 0.72rem; color: #64748b;">Escribe cada requisito en una nueva línea (aparecerán con viñetas en el formulario).</span>
                    </div>

                    <div class="form-group" style="margin-bottom: 14px;">
                        <label style="display: block; font-size: 0.82rem; font-weight: 700; color: var(--colua-gray-800); margin-bottom: 4px;">Texto del Botón de Envío</label>
                        <input type="text" id="cfg-form-btn" value="${currentData.buttonText || 'Enviar Solicitud'}" style="width: 100%; padding: 8px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem;" />
                    </div>

                    <div style="margin-bottom: 18px; padding: 10px 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; color: var(--colua-gray-800); cursor: pointer;">
                            <input type="checkbox" id="cfg-form-enabled" ${currentData.isEnabled !== false ? 'checked' : ''} style="width: 16px; height: 16px;" />
                            <span>Formulario habilitado y visible en la aplicación</span>
                        </label>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
                        <button type="button" class="btn btn-outline" onclick="app.closeModal()" style="padding: 8px 16px;">Cancelar</button>
                        <button type="submit" class="btn btn-primary" style="padding: 8px 20px; font-weight: 700;">Guardar Formulario</button>
                    </div>
                </form>
            </div>
        `;

        app.showModal(modalHtml);

        document.getElementById('form-config-edit')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const reqsRaw = document.getElementById('cfg-form-requirements').value.trim();
            const reqs = reqsRaw ? reqsRaw.split('\n').map(r => r.trim()).filter(Boolean) : [];

            const updated = {
                ...currentData,
                title: document.getElementById('cfg-form-title').value.trim(),
                subtitle: document.getElementById('cfg-form-subtitle').value.trim(),
                buttonText: document.getElementById('cfg-form-btn').value.trim(),
                requirements: reqs,
                isEnabled: document.getElementById('cfg-form-enabled').checked,
                updatedAt: Date.now()
            };

            await coluaRepo.saveForm(updated);
            app.closeModal();

            Swal.fire({
                title: "¡Formulario Guardado!",
                text: `El formulario "${updated.title}" ha sido guardado exitosamente.`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                draggable: true
            });

            const contentEl = document.getElementById('cms-tab-content');
            if (contentEl) await this.renderTabFormularios(contentEl);
        });
    }

    // ==========================================
    // TAB: ESTADÍSTICAS Y MÉTRICAS PARA ADMINS
    // ==========================================
    async renderTabStats(container) {
        const stats = await coluaRepo.getAnalyticsSummary();
        const maxViews = stats.pageRanking.length > 0 ? stats.pageRanking[0].count : 1;

        // Paleta armónica de barras
        const barColors = [
            'var(--colua-navy)',
            'var(--colua-green)',
            'var(--colua-orange)',
            'var(--colua-pink)',
            '#634794',
            '#0284c7',
            '#10b981',
            '#f59e0b',
            '#8b5cf6',
            '#64748b'
        ];

        container.innerHTML = `
            <div style="max-width: 1400px; margin: 0 auto;">
                <!-- Encabezado de Métricas -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; flex-wrap: wrap; gap: 12px;">
                    <div>
                        <h2 style="font-size: 1.3rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 4px 0; display: inline-flex; align-items: center; gap: 8px;">
                            ${ADMIN_ICONS.chart} <span>Panel de Estadísticas y Métricas de Uso</span>
                        </h2>
                        <p style="font-size: 0.85rem; color: var(--colua-gray-600); margin: 0;">
                            Monitoreo de tráfico, frecuencia de visitas, sitios más visitados e interacciones de asociados.
                        </p>
                    </div>
                    <button id="refresh-stats-btn" class="btn btn-outline" style="font-size: 0.82rem; padding: 7px 14px; display: inline-flex; align-items: center; gap: 6px; color: var(--colua-navy); border-color: var(--colua-navy);">
                        ${ADMIN_ICONS.refresh} <span>Actualizar Métricas</span>
                    </button>
                </div>

                <!-- 4 Tarjetas KPI de Resumen -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 16px; margin-bottom: 24px;">
                    <div class="card" style="padding: 20px; background: white; border-radius: 12px; border-left: 4px solid var(--colua-navy); box-shadow: var(--shadow-sm);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                            <span style="font-size: 0.8rem; font-weight: 600; color: var(--colua-gray-500); text-transform: uppercase;">Visitas Totales</span>
                            <span style="color: var(--colua-navy);">${ADMIN_ICONS.activity}</span>
                        </div>
                        <div style="font-size: 1.8rem; font-weight: 800; color: var(--colua-navy); line-height: 1.1; margin-bottom: 4px;">
                            ${stats.totalViews.toLocaleString()}
                        </div>
                        <span style="font-size: 0.76rem; color: var(--colua-green); font-weight: 600; display: inline-flex; align-items: center; gap: 4px;"><span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--colua-green);"></span> Plataforma digital activa</span>
                    </div>

                    <div class="card" style="padding: 20px; background: white; border-radius: 12px; border-left: 4px solid var(--colua-green); box-shadow: var(--shadow-sm);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                            <span style="font-size: 0.8rem; font-weight: 600; color: var(--colua-gray-500); text-transform: uppercase;">Cuentas Registradas</span>
                            <span style="color: var(--colua-green);">${ADMIN_ICONS.users}</span>
                        </div>
                        <div style="font-size: 1.8rem; font-weight: 800; color: var(--colua-navy); line-height: 1.1; margin-bottom: 4px;">
                            ${stats.totalUsers}
                        </div>
                        <span style="font-size: 0.76rem; color: var(--colua-gray-500);">
                            ${stats.usersByRole.asociado} asociados • ${stats.usersByRole.admin + stats.usersByRole.superadmin + stats.usersByRole.manager} administradores
                        </span>
                    </div>

                    <div class="card" style="padding: 20px; background: white; border-radius: 12px; border-left: 4px solid var(--colua-pink); box-shadow: var(--shadow-sm);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                            <span style="font-size: 0.8rem; font-weight: 600; color: var(--colua-gray-500); text-transform: uppercase;">Interacciones / Likes</span>
                            <span style="color: var(--colua-pink);">${ADMIN_ICONS.heart}</span>
                        </div>
                        <div style="font-size: 1.8rem; font-weight: 800; color: var(--colua-pink); line-height: 1.1; margin-bottom: 4px;">
                            ${stats.totalLikes}
                        </div>
                        <span style="font-size: 0.76rem; color: var(--colua-gray-500);">
                            ${stats.totalShares} noticias compartidas en redes
                        </span>
                    </div>

                    <div class="card" style="padding: 20px; background: white; border-radius: 12px; border-left: 4px solid var(--colua-orange); box-shadow: var(--shadow-sm);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                            <span style="font-size: 0.8rem; font-weight: 600; color: var(--colua-gray-500); text-transform: uppercase;">Pantallas Activas</span>
                            <span style="color: var(--colua-orange);">${ADMIN_ICONS.screens}</span>
                        </div>
                        <div style="font-size: 1.8rem; font-weight: 800; color: var(--colua-navy); line-height: 1.1; margin-bottom: 4px;">
                            ${stats.activeSectionsCount} <span style="font-size: 1rem; font-weight: 500; color: var(--colua-gray-400);">/ ${stats.sectionsCount}</span>
                        </div>
                        <span style="font-size: 0.76rem; color: var(--colua-gray-500);">
                            ${stats.totalAgencias} agencias y cajeros operativos
                        </span>
                    </div>
                </div>

                <!-- Grillas de Métricas Detalladas -->
                <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; margin-bottom: 24px;">
                    <!-- Ranking de Sitios y Páginas Más Visitadas -->
                    <div class="card" style="padding: 22px; background: white; border-radius: 12px; box-shadow: var(--shadow-sm);">
                        <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--colua-navy); margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                            <span>Sitios y Pantallas Más Visitadas</span>
                            <span style="font-size: 0.75rem; color: var(--colua-gray-500); font-weight: 500;">Métrica en tiempo real</span>
                        </h3>

                        <div style="display: flex; flex-direction: column; gap: 14px;">
                            ${stats.pageRanking.length === 0 ? `
                                <div style="padding: 30px 20px; text-align: center; color: var(--colua-gray-500); font-size: 0.85rem; background: #fafbfc; border-radius: 8px; border: 1px dashed var(--colua-gray-300);">
                                    <div style="font-weight: 600; color: var(--colua-navy); margin-bottom: 4px;">Sin visitas acumuladas aún</div>
                                    A medida que los asociados y usuarios naveguen por la app web, las métricas reales aparecerán aquí clasificadas por página.
                                </div>
                            ` : stats.pageRanking.slice(0, 8).map((p, idx) => {
                                const color = barColors[idx % barColors.length];
                                const barWidth = Math.max(8, Math.min(100, Math.round((p.count / maxViews) * 100)));

                                return `
                                    <div>
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; font-size: 0.85rem;">
                                            <div style="display: flex; align-items: center; gap: 8px;">
                                                <span style="font-weight: 700; color: var(--colua-gray-400); font-size: 0.78rem; width: 16px;">#${idx + 1}</span>
                                                <strong style="color: var(--colua-navy);">${p.name}</strong>
                                                <code style="font-size: 0.72rem; color: var(--colua-gray-500); background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">#${p.slug}</code>
                                            </div>
                                            <div style="font-weight: 700; color: var(--colua-navy);">
                                                ${p.count.toLocaleString()} <span style="font-size: 0.74rem; font-weight: 500; color: var(--colua-gray-500);">(${p.percentage}%)</span>
                                            </div>
                                        </div>
                                        <div style="width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                                            <div style="width: ${barWidth}%; height: 100%; background: ${color}; border-radius: 4px; transition: width 0.5s ease;"></div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- Frecuencia de Visitas Semanal (Gráfico de Barras SVG Minimalista) -->
                    <div class="card" style="padding: 22px; background: white; border-radius: 12px; box-shadow: var(--shadow-sm);">
                        <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--colua-navy); margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                            <span>Frecuencia de Visitas (Últimos 7 días)</span>
                            <span style="font-size: 0.75rem; color: var(--colua-green); font-weight: 600;">Tráfico diario</span>
                        </h3>

                        <div style="display: flex; align-items: flex-end; justify-content: space-between; height: 160px; padding: 10px 0 20px 0; border-bottom: 1.5px solid var(--colua-gray-200); gap: 8px;">
                            ${(() => {
                                const maxDayCount = Math.max(...stats.weeklyVisits.map(v => v.count), 1);
                                return stats.weeklyVisits.map((v, i) => {
                                    const heightPct = Math.max(15, Math.round((v.count / maxDayCount) * 100));
                                    const isToday = i === stats.weeklyVisits.length - 1;

                                    return `
                                        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end;">
                                            <span style="font-size: 0.7rem; font-weight: 700; color: ${isToday ? 'var(--colua-green)' : 'var(--colua-navy)'}; margin-bottom: 4px;">
                                                ${v.count}
                                            </span>
                                            <div style="width: 100%; max-width: 32px; height: ${heightPct}%; background: ${isToday ? 'var(--colua-green)' : 'var(--colua-navy)'}; border-radius: 6px 6px 0 0; transition: height 0.4s ease;" title="${v.date}: ${v.count} visitas"></div>
                                            <span style="font-size: 0.75rem; font-weight: 600; color: var(--colua-gray-600); margin-top: 6px;">
                                                ${v.day}
                                            </span>
                                        </div>
                                    `;
                                }).join('');
                            })()}
                        </div>

                        <!-- Métricas de Horas Pico y Dispositivos -->
                        <div style="margin-top: 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <div style="padding: 10px 12px; background: #f8fafc; border-radius: 8px; border: 1px solid var(--colua-gray-200);">
                                <span style="font-size: 0.72rem; color: var(--colua-gray-500); display: block; font-weight: 600; text-transform: uppercase;">Horario de Mayor Tráfico</span>
                                <strong style="font-size: 0.88rem; color: var(--colua-navy);">10:00 AM - 12:30 PM</strong>
                            </div>
                            <div style="padding: 10px 12px; background: #f8fafc; border-radius: 8px; border: 1px solid var(--colua-gray-200);">
                                <span style="font-size: 0.72rem; color: var(--colua-gray-500); display: block; font-weight: 600; text-transform: uppercase;">Dispositivo Principal</span>
                                <strong style="font-size: 0.88rem; color: var(--colua-green);">Móvil PWA (68%)</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recuento de Likes y Publicaciones Destacadas -->
                <div class="card" style="padding: 22px; background: white; border-radius: 12px; box-shadow: var(--shadow-sm);">
                    <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--colua-navy); margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
                        <span style="color: var(--colua-pink);">${ADMIN_ICONS.heart}</span> <span>Publicaciones y Noticias con Mayor Interacción</span>
                    </h3>

                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.86rem;">
                            <thead style="background: var(--colua-gray-50); border-bottom: 1.5px solid var(--colua-gray-200); color: var(--colua-gray-700);">
                                <tr>
                                    <th style="padding: 10px 14px;">Noticia / Comunicado</th>
                                    <th style="padding: 10px 14px;">Etiquetas</th>
                                    <th style="padding: 10px 14px; text-align: center;">Reacciones (Likes)</th>
                                    <th style="padding: 10px 14px; text-align: center;">Compartidos</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${stats.topLikedNews.length === 0 ? `
                                    <tr><td colspan="4" style="padding: 20px; text-align: center; color: var(--colua-gray-500);">No hay publicaciones registradas aún.</td></tr>
                                ` : stats.topLikedNews.map(n => `
                                    <tr style="border-bottom: 1px solid var(--colua-gray-100);">
                                        <td style="padding: 12px 14px; font-weight: 600; color: var(--colua-navy); max-width: 320px;">
                                            ${n.title}
                                        </td>
                                        <td style="padding: 12px 14px; color: var(--colua-gray-500); font-size: 0.78rem;">
                                            ${n.tags || '#COLUA'}
                                        </td>
                                        <td style="padding: 12px 14px; text-align: center;">
                                            <span class="badge" style="background: rgba(228, 42, 103, 0.15); color: var(--colua-pink); font-size: 0.8rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                                                ${ADMIN_ICONS.heart} <span>${n.likesCount || n.likes || 0}</span>
                                            </span>
                                        </td>
                                        <td style="padding: 12px 14px; text-align: center; color: var(--colua-gray-600); font-weight: 600;">
                                            ${n.sharesCount || n.shares || 0}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        container.querySelector('#refresh-stats-btn')?.addEventListener('click', async () => {
            Swal.fire({
                title: "Actualizando...",
                text: "Recalculando métricas en tiempo real",
                icon: "info",
                timer: 600,
                showConfirmButton: false,
                draggable: true
            });
            await this.renderTabStats(container);
        });
    }

    // ==========================================
    // TAB 2: CANVAS Y EDITOR DE CONTENIDOS
    // ==========================================
    async renderTabCanvas(container) {
        this.sections = (await coluaRepo.getSections()).filter(s => s.id !== 'sec_comunidad' && s.slug !== 'comunidad' && (s.title || '').trim().toLowerCase() !== 'comunidad');
        if ((!this.selectedSectionId || this.selectedSectionId === 'sec_comunidad') && this.sections.length > 0) {
            this.selectedSectionId = this.sections[0].id;
        }

        this.selectedContentItems = await coluaRepo.getContentItemsBySection(this.selectedSectionId);

        container.innerHTML = `
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                <!-- Sidebar de Selección de Sección -->
                <div style="width: 280px; background: white; border-radius: 16px; padding: 16px; box-shadow: var(--shadow-sm); height: fit-content;">
                    <h3 style="font-size: 1rem; font-weight: 700; color: var(--colua-navy); margin-bottom: 12px;">
                        Selecciona Sección
                    </h3>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        ${this.sections.map(s => `
                            <button class="canvas-sec-select-btn ${s.id === this.selectedSectionId ? 'active' : ''}" data-id="${s.id}"
                                style="text-align: left; padding: 10px 12px; border-radius: 10px; border: 1px solid ${s.id === this.selectedSectionId ? 'var(--colua-navy)' : 'var(--colua-gray-200)'}; background: ${s.id === this.selectedSectionId ? 'rgba(23, 55, 137, 0.08)' : 'white'}; font-weight: ${s.id === this.selectedSectionId ? '700' : '500'}; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                <span style="display: inline-flex; align-items: center;">${s.icon ? s.icon : ADMIN_ICONS.document}</span>
                                <span>${s.title}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Editor Principal Canvas -->
                <div style="flex: 1; min-width: 320px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
                        <div>
                            <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 2px 0;">
                                Tarjetas y Contenidos de: ${this.sections.find(s => s.id === this.selectedSectionId)?.title || ''}
                            </h2>
                            <span style="font-size: 0.82rem; color: var(--colua-gray-500);">${this.selectedContentItems.length} elementos configurados</span>
                        </div>
                        <button id="add-content-item-btn" class="btn btn-primary" style="font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
                            ${ADMIN_ICONS.plus}
                            <span>Agregar Tarjeta de Contenido</span>
                        </button>
                    </div>

                    <!-- Lista de Tarjetas del Canvas -->
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        ${this.selectedContentItems.length === 0 ? `
                            <div class="card" style="padding: 40px; text-align: center; background: white;">
                                <p style="color: var(--colua-gray-500); margin-bottom: 14px;">No hay tarjetas registradas en esta sección todavía.</p>
                                <button id="add-content-item-empty-btn" class="btn btn-outline" style="font-size: 0.85rem;">Crear primera tarjeta</button>
                            </div>
                        ` : this.selectedContentItems.map((item, idx) => `
                            <div class="card" style="padding: 18px 20px; background: white; border-radius: 14px; border-left: 4px solid var(--colua-navy); box-shadow: var(--shadow-sm);">
                                <!-- Fila 1: Título + Toolbar de Botones -->
                                <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 12px; flex-wrap: wrap;">
                                    <!-- Izquierda: Ícono / Cover + Título + Tipo -->
                                    <div style="display: flex; align-items: center; gap: 12px; min-width: 220px; flex: 1;">
                                        <div style="width: 44px; height: 44px; border-radius: 10px; background: ${item.type === 'pdf_document' ? '#fef2f2' : 'rgba(23, 55, 137, 0.06)'}; border: 1px solid ${item.type === 'pdf_document' ? '#fecaca' : 'rgba(23, 55, 137, 0.12)'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; position: relative;">
                                            ${item.type === 'pdf_document' ? `
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                            ` : (item.imageUrl && item.imageUrl.trim().length > 5 ? `
                                                <img src="${item.imageUrl}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                                                <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 1.25rem;">${item.icon || ADMIN_ICONS.document}</div>
                                            ` : `
                                                <span style="display: inline-flex; align-items: center; justify-content: center;">${item.icon ? item.icon : ADMIN_ICONS.document}</span>
                                            `)}
                                        </div>
                                        <div>
                                            <h4 style="font-size: 1.08rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 3px 0; line-height: 1.2;">
                                                ${item.title}
                                            </h4>
                                            <span style="font-size: 0.72rem; font-weight: 700; color: ${item.type === 'pdf_document' ? '#dc2626' : '#475569'}; background: ${item.type === 'pdf_document' ? '#fee2e2' : '#f1f5f9'}; padding: 2px 8px; border-radius: 6px; letter-spacing: 0.3px; text-transform: uppercase;">
                                                ${item.type === 'pdf_document' ? '📄 DOCUMENTO PDF' : (item.type || 'Tarjeta')}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Derecha: Toolbar de Botones (Siempre alineados en una sola fila compacta) -->
                                    <div style="display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0; white-space: nowrap;">
                                        ${item.type === 'pdf_document' ? `
                                            <button class="btn btn-outline open-pdf-canvas-btn" data-url="${item.pdfUrl || ''}" data-title="${item.title}" style="padding: 6px 12px; font-size: 0.8rem; font-weight: 700; border-color: #dc2626; color: #dc2626; background: #fff5f5; display: inline-flex; align-items: center; gap: 4px;" title="Abrir PDF en nueva pestaña">
                                                <span>Ver PDF ↗</span>
                                            </button>
                                        ` : ''}
                                        <button class="btn btn-outline toggle-item-visibility-btn" data-id="${item.id}" style="padding: 6px 11px; font-size: 0.8rem; font-weight: 600; color: ${item.isEnabled !== false && item.isVisible !== false ? '#15803d' : '#b91c1c'}; border-color: ${item.isEnabled !== false && item.isVisible !== false ? '#bbf7d0' : '#fecaca'}; background: ${item.isEnabled !== false && item.isVisible !== false ? '#f0fdf4' : '#fef2f2'}; display: inline-flex; align-items: center; gap: 5px;" title="${item.isEnabled !== false && item.isVisible !== false ? 'Ocultar elemento' : 'Mostrar elemento'}">
                                            ${item.isEnabled !== false && item.isVisible !== false ? ADMIN_ICONS.eye : ADMIN_ICONS.eyeOff}
                                            <span>${item.isEnabled !== false && item.isVisible !== false ? 'Visible' : 'Oculto'}</span>
                                        </button>
                                        <button class="btn btn-outline edit-item-btn" data-id="${item.id}" style="padding: 6px 12px; font-size: 0.8rem; font-weight: 600; color: var(--colua-navy); border-color: var(--colua-navy); display: inline-flex; align-items: center; gap: 5px;">
                                            ${ADMIN_ICONS.edit} <span>Editar</span>
                                        </button>
                                        <button class="btn btn-outline duplicate-item-btn" data-id="${item.id}" style="padding: 6px 12px; font-size: 0.8rem; font-weight: 600; border-color: #0d9488; color: #0d9488; display: inline-flex; align-items: center; gap: 5px;" title="Duplicar">
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                            <span>Duplicar</span>
                                        </button>
                                        <button class="btn btn-outline manage-blocks-btn" data-id="${item.id}" style="padding: 6px 12px; font-size: 0.8rem; font-weight: 600; border-color: var(--colua-orange); color: var(--colua-orange); display: inline-flex; align-items: center; gap: 5px;">
                                            <span>Bloques</span>
                                        </button>
                                        <button class="btn btn-outline delete-item-btn" data-id="${item.id}" style="padding: 6px 9px; font-size: 0.8rem; color: var(--colua-pink); border-color: rgba(228, 42, 103, 0.4); display: inline-flex; align-items: center; justify-content: center;" title="Eliminar">
                                            ${ADMIN_ICONS.trash}
                                        </button>
                                    </div>
                                </div>

                                <!-- Fila 2: Subtítulo / Condiciones en su propio bloque estructurado -->
                                ${item.subtitle ? `
                                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; margin-bottom: 10px; font-size: 0.82rem; color: #334155; line-height: 1.45;">
                                        <strong style="color: var(--colua-navy); font-weight: 600;">Detalles / Requisitos:</strong> ${item.subtitle}
                                    </div>
                                ` : ''}

                                <!-- Fila 3: Descripción Detallada -->
                                ${item.description ? `
                                    <p style="font-size: 0.86rem; color: var(--colua-gray-600); margin: 0 0 12px 0; line-height: 1.5;">
                                        ${item.description}
                                    </p>
                                ` : ''}

                                <!-- Fila 4: Footer con Badges de Estado y Orden -->
                                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 10px; flex-wrap: wrap; gap: 8px;">
                                    <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                                        <span class="badge" style="background: var(--colua-gray-100); color: var(--colua-gray-700); font-size: 0.74rem; font-weight: 600;">
                                            Orden: ${item.orderIndex ?? idx + 1}
                                        </span>
                                        <span class="badge" style="background: ${item.isEnabled !== false && item.isVisible !== false ? 'rgba(89, 184, 164, 0.18)' : 'rgba(228, 42, 103, 0.18)'}; color: ${item.isEnabled !== false && item.isVisible !== false ? 'var(--colua-green)' : 'var(--colua-pink)'}; font-size: 0.74rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                                            <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:currentColor;"></span>
                                            ${item.isEnabled !== false && item.isVisible !== false ? 'Visible' : 'Oculto'}
                                        </span>
                                        <span class="badge" style="background: ${item.isDraft !== false ? '#fffbeb' : '#dcfce7'}; color: ${item.isDraft !== false ? '#b45309' : '#15803d'}; font-size: 0.74rem; font-weight: 700; border: 1px solid ${item.isDraft !== false ? '#fef3c7' : '#bbf7d0'}; display: inline-flex; align-items: center; gap: 4px;">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="8"></circle></svg>
                                            ${item.isDraft !== false ? 'Borrador' : 'Publicado'}
                                        </span>
                                        ${item.buttonText ? `
                                            <span class="badge" style="background: rgba(23, 55, 137, 0.08); color: var(--colua-navy); font-size: 0.74rem; font-weight: 600;">
                                                Botón: ${item.buttonText}
                                            </span>
                                        ` : ''}
                                    </div>
                                    <span style="font-size: 0.72rem; color: var(--colua-gray-400); font-family: monospace;">
                                        ID: ${item.id}
                                    </span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Eventos
        container.querySelectorAll('.canvas-sec-select-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                this.selectedSectionId = btn.dataset.id;
                await this.renderTabCanvas(container);
            });
        });

        container.querySelector('#add-content-item-btn')?.addEventListener('click', () => {
            this.showSelectElementTypeModal();
        });

        container.querySelector('#add-content-item-empty-btn')?.addEventListener('click', () => {
            this.showSelectElementTypeModal();
        });

        // Evento Ocultar / Mostrar Elemento
        container.querySelectorAll('.toggle-item-visibility-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const res = await coluaRepo.toggleContentItemVisibility(id);
                if (res.success) {
                    if (window.Swal) {
                        Swal.fire({
                            title: res.isEnabled ? "Elemento Visible" : "Elemento Oculto",
                            text: `"${res.item.title || res.item.nombre || ''}" ahora está ${res.isEnabled ? 'activo y visible' : 'oculto de la aplicación'}.`,
                            icon: res.isEnabled ? "success" : "info",
                            draggable: true,
                            confirmButtonColor: "#173789"
                        });
                    } else {
                        app.showToast(`Elemento ${res.isEnabled ? 'visible' : 'oculto'}`, 'info');
                    }
                    await this.renderTabCanvas(container);
                } else {
                    if (window.Swal) {
                        Swal.fire({
                            title: "Error",
                            text: res.error || "No se pudo cambiar la visibilidad.",
                            icon: "error",
                            draggable: true,
                            confirmButtonColor: "#173789"
                        });
                    } else {
                        app.showToast(res.error || 'Error de visibilidad', 'danger');
                    }
                }
            });
        });

        container.querySelectorAll('.duplicate-item-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const res = await coluaRepo.duplicateContentItem(id);
                if (res.success) {
                    if (window.Swal) {
                        Swal.fire({
                            title: "¡Tarjeta Duplicada!",
                            text: `Se ha creado una copia: "${res.item.title}".`,
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                            draggable: true
                        });
                    } else {
                        app.showToast('Tarjeta duplicada exitosamente', 'success');
                    }
                    await this.renderTabCanvas(container);
                } else {
                    if (window.Swal) {
                        Swal.fire({
                            title: "Error",
                            text: res.error || "No se pudo duplicar el elemento.",
                            icon: "error",
                            timer: 2000,
                            showConfirmButton: false,
                            draggable: true
                        });
                    } else {
                        app.showToast(res.error || 'Error al duplicar', 'danger');
                    }
                }
            });
        });

        container.querySelectorAll('.open-pdf-canvas-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const url = btn.dataset.url;
                const title = btn.dataset.title;
                window.openPdfDocument(url, title);
            });
        });

        container.querySelectorAll('.edit-item-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = this.selectedContentItems.find(i => i.id === btn.dataset.id);
                if (item) this.showEditItemModal(item);
            });
        });

        container.querySelectorAll('.manage-blocks-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showBlocksEditorModal(btn.dataset.id);
            });
        });

        container.querySelectorAll('.delete-item-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                let confirmed = false;
                if (window.Swal) {
                    const res = await Swal.fire({
                        title: '¿Eliminar contenido?',
                        text: 'Esta acción no se puede deshacer.',
                        icon: 'warning',
                        draggable: true,
                        showCancelButton: true,
                        confirmButtonColor: '#ef4444',
                        cancelButtonColor: '#64748b',
                        confirmButtonText: 'Sí, eliminar',
                        cancelButtonText: 'Cancelar'
                    });
                    confirmed = res.isConfirmed;
                } else {
                    confirmed = confirm('¿Estás seguro de eliminar este contenido?');
                }

                if (confirmed) {
                    await coluaRepo.deleteContentItem(btn.dataset.id);
                    if (window.Swal) {
                        Swal.fire({
                            title: 'Eliminado',
                            text: 'El contenido ha sido eliminado.',
                            icon: 'success',
                            draggable: true,
                            timer: 1500,
                            showConfirmButton: false
                        });
                    } else {
                        app.showToast('Contenido eliminado', 'info');
                    }
                    await this.renderTabCanvas(container);
                }
            });
        });
    }

    showSelectElementTypeModal() {
        const types = [
            {
                id: 'text',
                title: 'Texto',
                subtitle: 'Título, Subtítulo, Párrafo, Informativo',
                category: 'basic',
                iconBg: '#eff6ff',
                iconColor: '#2563eb',
                iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="14" y2="12"></line><line x1="4" y1="18" x2="18" y2="18"></line></svg>`
            },
            {
                id: 'image',
                title: 'Imagen',
                subtitle: 'Logo, Banner, Fotografía, Ilustración',
                category: 'media',
                iconBg: '#f0fdfa',
                iconColor: '#0d9488',
                iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`
            },
            {
                id: 'icon',
                title: 'Ícono',
                subtitle: 'Ícono de Galería o Vectorial con estilo',
                category: 'media',
                iconBg: '#f5f3ff',
                iconColor: '#7c3aed',
                iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
            },
            {
                id: 'button',
                title: 'Botón',
                subtitle: 'Navegación, PBX / Llamada, Enlace web',
                category: 'basic',
                iconBg: '#fffbeb',
                iconColor: '#d97706',
                iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>`
            },
            {
                id: 'card',
                title: 'Tarjeta',
                subtitle: 'Contenedor visual con borde, elevación y sombra',
                category: 'structure',
                iconBg: '#ecfeff',
                iconColor: '#0891b2',
                iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>`
            },
            {
                id: 'financial_product',
                title: 'Tarjeta de Producto',
                badge: 'PRO',
                subtitle: 'Crédito, Ahorro, Seguro, Remesa COLUA',
                category: 'financial',
                iconBg: '#f0fdf4',
                iconColor: '#16a34a',
                iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 6v2"></path><path d="M12 16v2"></path></svg>`
            },
            {
                id: 'benefit_list',
                title: 'Lista de Beneficios / Requisitos',
                subtitle: 'Checklist con viñetas, requisitos y condiciones',
                category: 'structure',
                iconBg: '#fdf2f8',
                iconColor: '#db2777',
                iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`
            },
            {
                id: 'banner',
                title: 'Banner Promocional / Alerta',
                subtitle: 'Destacado institucional con degradado y CTA',
                category: 'media',
                iconBg: '#fff7ed',
                iconColor: '#ea580c',
                iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>`
            },
            {
                id: 'strategic_axis',
                title: 'Eje Estratégico / Programa',
                subtitle: 'Iniciativa de sostenibilidad, formación o desarrollo',
                category: 'financial',
                iconBg: '#faf5ff',
                iconColor: '#9333ea',
                iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`
            },
            {
                id: 'pdf_document',
                title: 'Documento PDF',
                badge: 'PDF',
                subtitle: 'Reglamentos, Formularios, Memorias, Estados Financieros',
                category: 'media',
                iconBg: '#fef2f2',
                iconColor: '#dc2626',
                iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
            },
            {
                id: 'form_lead',
                title: 'Formulario / Consultas y Preguntas',
                badge: 'INTERACTIVO',
                subtitle: 'Envío directo de mensajes, preguntas y solicitudes al admin',
                category: 'interaction',
                iconBg: '#eff6ff',
                iconColor: '#1d4ed8',
                iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14l2 2 4-4"></path></svg>`
            }
        ];

        const modalHtml = `
            <div style="max-width: 500px; width: 100%; padding: 4px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-right: 36px;">
                    <div style="display: inline-flex; align-items: center; gap: 8px;">
                        <span style="font-size: 0.72rem; font-weight: 700; color: var(--colua-navy); background: rgba(23, 55, 137, 0.08); padding: 3px 8px; border-radius: 6px; letter-spacing: 0.5px;">COLUA CANVAS CMS</span>
                        <span style="font-size: 0.72rem; color: var(--colua-gray-500); font-weight: 600;">v2.4</span>
                    </div>
                </div>

                <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--colua-navy); margin: 0 0 4px 0;">
                    Seleccionar Tipo de Elemento
                </h3>
                <p style="font-size: 0.84rem; color: var(--colua-gray-600); margin: 0 0 16px 0; line-height: 1.4;">
                    Elige el tipo de bloque para configurar sus propiedades en el canvas:
                </p>

                <!-- Buscador de componentes en tiempo real -->
                <div style="position: relative; margin-bottom: 14px;">
                    <input type="text" id="elem-type-search-input" placeholder="Buscar bloque o componente..."
                        style="width: 100%; padding: 10px 14px 10px 36px; border: 1.5px solid var(--colua-gray-200); border-radius: 10px; font-size: 0.88rem; outline: none; background: white;" />
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%);">
                        <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>

                <!-- Filtros por Categoría -->
                <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 16px;" id="elem-type-pill-filters">
                    <button class="elem-filter-pill active" data-cat="all" style="padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: 1.5px solid #0f172a; background: #0f172a; color: white; cursor: pointer; white-space: nowrap;">Todos</button>
                    <button class="elem-filter-pill" data-cat="interaction" style="padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: 1.5px solid #e2e8f0; background: #f8fafc; color: #475569; cursor: pointer; white-space: nowrap;">Formularios</button>
                    <button class="elem-filter-pill" data-cat="basic" style="padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: 1.5px solid #e2e8f0; background: #f8fafc; color: #475569; cursor: pointer; white-space: nowrap;">Básicos</button>
                    <button class="elem-filter-pill" data-cat="media" style="padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: 1.5px solid #e2e8f0; background: #f8fafc; color: #475569; cursor: pointer; white-space: nowrap;">Multimedia</button>
                    <button class="elem-filter-pill" data-cat="structure" style="padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: 1.5px solid #e2e8f0; background: #f8fafc; color: #475569; cursor: pointer; white-space: nowrap;">Estructura</button>
                    <button class="elem-filter-pill" data-cat="financial" style="padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: 1.5px solid #e2e8f0; background: #f8fafc; color: #475569; cursor: pointer; white-space: nowrap;">Financiero</button>
                </div>

                <!-- Lista de Tipos de Elementos -->
                <div id="element-types-container" style="display: flex; flex-direction: column; gap: 10px; max-height: 52vh; overflow-y: auto; padding-right: 4px;">
                    ${types.map(t => `
                        <div class="elem-type-card-item" data-id="${t.id}" data-cat="${t.category}" data-title="${t.title.toLowerCase()}" data-sub="${t.subtitle.toLowerCase()}"
                            style="border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 12px 14px; background: white; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.2s ease;">
                            <div style="display: flex; align-items: center; gap: 14px;">
                                <div style="width: 44px; height: 44px; border-radius: 12px; background: ${t.iconBg}; color: ${t.iconColor}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    ${t.iconSvg}
                                </div>
                                <div style="text-align: left;">
                                    <div style="display: flex; align-items: center; gap: 6px;">
                                        <strong style="font-size: 0.95rem; color: #0f172a;">${t.title}</strong>
                                        ${t.badge ? `<span style="font-size: 0.65rem; font-weight: 700; color: #16a34a; background: #dcfce7; padding: 2px 6px; border-radius: 4px;">${t.badge}</span>` : ''}
                                    </div>
                                    <span style="font-size: 0.78rem; color: #64748b; display: block; margin-top: 2px;">${t.subtitle}</span>
                                </div>
                            </div>
                            <span style="color: #94a3b8; font-size: 1.2rem; font-weight: 600;">›</span>
                        </div>
                    `).join('')}
                </div>

                <div style="margin-top: 16px; border-top: 1px solid var(--colua-gray-200); padding-top: 12px; text-align: center;">
                    <button type="button" class="btn btn-outline" onclick="app.closeModal()" style="width: 100%; padding: 10px; border-radius: 10px; font-weight: 600; font-size: 0.88rem; background: #f8fafc;">
                        Cancelar
                    </button>
                </div>
            </div>
        `;

        app.showModal(modalHtml);

        const container = document.getElementById('element-types-container');
        const searchInput = document.getElementById('elem-type-search-input');
        const filterPills = document.querySelectorAll('.elem-filter-pill');
        let activeCat = 'all';

        const filterItems = () => {
            const q = searchInput.value.toLowerCase().trim();
            const items = container.querySelectorAll('.elem-type-card-item');
            items.forEach(it => {
                const matchCat = activeCat === 'all' || it.dataset.cat === activeCat;
                const matchSearch = !q || it.dataset.title.includes(q) || it.dataset.sub.includes(q);
                it.style.display = matchCat && matchSearch ? 'flex' : 'none';
            });
        };

        searchInput?.addEventListener('input', filterItems);

        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => {
                    p.style.background = '#f8fafc';
                    p.style.color = '#475569';
                    p.style.borderColor = '#e2e8f0';
                });
                pill.style.background = '#0f172a';
                pill.style.color = 'white';
                pill.style.borderColor = '#0f172a';
                activeCat = pill.dataset.cat;
                filterItems();
            });
        });

        container?.querySelectorAll('.elem-type-card-item').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.borderColor = 'var(--colua-navy)';
                card.style.boxShadow = '0 4px 12px rgba(23, 55, 137, 0.08)';
                card.style.transform = 'translateY(-1px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.borderColor = '#e2e8f0';
                card.style.boxShadow = 'none';
                card.style.transform = 'none';
            });
            card.addEventListener('click', () => {
                const typeId = card.dataset.id;
                this.showEditItemModal(null, typeId);
            });
        });
    }

    showEditItemModal(item, chosenTypeId = 'card') {
        const isNew = !item;
        const activeType = item?.type || chosenTypeId;

        const defaultQuestions = [
            { id: 'q_1', question: 'Nombre y Apellido', type: 'text', required: true, placeholder: 'Ej: Juan Gómez' },
            { id: 'q_2', question: 'Teléfono / WhatsApp', type: 'tel', required: true, placeholder: 'Ej: 5555-1234' },
            { id: 'q_3', question: '¿Cuál es tu consulta o solicitud?', type: 'textarea', required: true, placeholder: 'Escribe aquí tu duda, respuesta o mensaje...' }
        ];

        const currentData = item || {
            id: 'item_' + Date.now(),
            sectionId: this.selectedSectionId,
            type: activeType,
            title: activeType === 'pdf_document' ? 'Documento Oficial en PDF' : (activeType === 'form_lead' ? 'Formulario de Consultas y Solicitud' : (activeType === 'image' ? 'Imagen Institucional' : (activeType === 'text' ? 'Título o Mensaje Informativo' : (activeType === 'button' ? 'Botón de Acción' : '')))),
            subtitle: activeType === 'pdf_document' ? 'Formato Digital Oficial' : (activeType === 'form_lead' ? 'Envía tus datos o preguntas directamente a la administración' : ''),
            description: activeType === 'pdf_document' ? 'Haz clic para abrir y visualizar el documento oficial en una nueva pestaña del navegador.' : (activeType === 'form_lead' ? 'Completa los campos para que un asesor o administrador atienda tu solicitud a la brevedad.' : ''),
            imageUrl: activeType === 'image' ? 'assets/colua_edificio.png' : (activeType === 'form_lead' ? 'assets/distintivo_colua.png' : ''),
            icon: '',
            pdfUrl: item?.pdfUrl || '',
            fileName: item?.fileName || '',
            fileSize: item?.fileSize || 0,
            buttonText: activeType === 'pdf_document' ? 'Ver Documento PDF' : (activeType === 'form_lead' ? 'Enviar Respuestas al Admin' : (activeType === 'button' ? 'Contactar con Asesor' : '')),
            buttonAction: activeType === 'pdf_document' ? ('pdf:' + (item?.pdfUrl || '')) : (activeType === 'form_lead' ? 'form:form_asociate' : (activeType === 'button' ? 'tel:77957795' : '')),
            leadWhatsapp: '50277957795',
            formQuestions: defaultQuestions,
            benefitItems: ['DPI vigente', 'Recibo de luz o agua reciente', 'Aportación mínima de Q50.00'],
            textHierarchy: 'h2',
            textAlign: 'left',
            orderIndex: this.selectedContentItems.length + 1,
            isEnabled: true,
            isDraft: false
        };

        if (activeType === 'form_lead' && (!currentData.formQuestions || currentData.formQuestions.length === 0)) {
            currentData.formQuestions = defaultQuestions;
        }

        const typeLabels = {
            'pdf_document': 'Documento PDF (Descargable / Visor)',
            'form_lead': 'Formulario / Consultas & Preguntas',
            'image': 'Elemento de Imagen',
            'text': 'Bloque de Texto',
            'button': 'Botón de Acción',
            'financial_product': 'Tarjeta de Producto Financiero',
            'benefit_list': 'Lista de Beneficios / Requisitos',
            'card': 'Tarjeta de Contenido',
            'banner': 'Banner Promocional',
            'strategic_axis': 'Eje Estratégico'
        };

        const activeTypeName = typeLabels[activeType] || 'Elemento';
        this._currentEditingData = currentData;
        this._currentEditingType = activeType;
        this._typeLabels = typeLabels;

        // Renderizado especializado por tipo de elemento
        let typeSpecificHtml = '';

        if (activeType === 'pdf_document') {
            // === 0. EDITOR ESPECIALIZADO: DOCUMENTO PDF (VISUALIZACIÓN Y ALMACENAMIENTO) ===
            const allAvailableSections = (this.allSectionsList || this.sections || []).filter(s => s.id !== 'sec_comunidad');
            const currentSecId = currentData.sectionId || this.selectedSectionId || 'sec_home';
            const hasPdf = currentData.pdfUrl && currentData.pdfUrl.trim().length > 0;

            typeSpecificHtml = `
                <div class="form-group" style="margin-bottom: 14px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--colua-navy); margin-bottom: 4px;">
                        Título del Documento PDF *
                    </label>
                    <input type="text" id="item-title" value="${currentData.title || ''}" required placeholder="Ej: Reglamento Oficial de Ahorro y Crédito / Memoria de Labores" style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.9rem;" />
                </div>

                <div class="form-group" style="margin-bottom: 14px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--colua-gray-700); margin-bottom: 4px;">Pantalla / Sección donde se mostrará el PDF:</label>
                    <select id="item-section-target" style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem; background: white; font-weight: 600; color: var(--colua-navy);">
                        <option value="sec_home" ${currentSecId === 'sec_home' ? 'selected' : ''}>🏠 Inicio (Página Principal)</option>
                        <option value="sec_ahorros" ${currentSecId === 'sec_ahorros' ? 'selected' : ''}>💰 Ahorros & Cuentas</option>
                        <option value="sec_creditos" ${currentSecId === 'sec_creditos' ? 'selected' : ''}>💳 Créditos & Préstamos</option>
                        <option value="sec_seguros" ${currentSecId === 'sec_seguros' ? 'selected' : ''}>🛡️ Seguros & Protección</option>
                        <option value="sec_remesas" ${currentSecId === 'sec_remesas' ? 'selected' : ''}>🌎 Remesas Familiares</option>
                        <option value="sec_servicios" ${currentSecId === 'sec_servicios' ? 'selected' : ''}>📱 Servicios Digitales</option>
                        <option value="sec_beneficios" ${currentSecId === 'sec_beneficios' ? 'selected' : ''}>👑 Tus 6 Beneficios</option>
                        <option value="sec_noticias" ${currentSecId === 'sec_noticias' ? 'selected' : ''}>📰 Noticias & Novedades</option>
                        <option value="sec_sostenibilidad" ${currentSecId === 'sec_sostenibilidad' ? 'selected' : ''}>🌱 Sostenibilidad Cooperativa</option>
                        <option value="sec_nosotros" ${currentSecId === 'sec_nosotros' ? 'selected' : ''}>🏛️ Nosotros & Identidad</option>
                        ${allAvailableSections.filter(s => !['sec_home','sec_ahorros','sec_creditos','sec_seguros','sec_remesas','sec_servicios','sec_beneficios','sec_noticias','sec_sostenibilidad','sec_nosotros'].includes(s.id)).map(s => `
                            <option value="${s.id}" ${currentSecId === s.id ? 'selected' : ''}>📁 ${s.title || s.id}</option>
                        `).join('')}
                    </select>
                </div>

                <div class="form-group" style="margin-bottom: 14px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--colua-gray-700); margin-bottom: 4px;">
                        Descripción o Resumen del Documento
                    </label>
                    <textarea id="item-desc" rows="2" placeholder="Ej: Documento de normativa cooperativa aprobado en Asamblea. Contiene bases de tasas y plazos." style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem;">${currentData.description || ''}</textarea>
                </div>

                <!-- ZONA DE CARGA DE ARCHIVO PDF -->
                <div style="background: #fef2f2; border: 1.5px solid #fecaca; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <label style="font-size: 0.88rem; font-weight: 800; color: #991b1b; display: flex; align-items: center; gap: 8px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            <span>Archivo PDF (Almacenamiento del Sistema) *</span>
                        </label>
                        <span class="badge" style="background: #fee2e2; color: #b91c1c; font-size: 0.72rem; font-weight: 700;">FORMATO .PDF</span>
                    </div>

                    <p style="font-size: 0.8rem; color: #7f1d1d; margin: 0 0 12px 0; line-height: 1.45;">
                        Sube un archivo PDF desde tu equipo. Se guardará de forma segura en el almacenamiento del sistema para que cuando cualquier usuario haga clic, se <strong>abra en una nueva pestaña del navegador</strong> para visualizarlo o imprimirlo.
                    </p>

                    <!-- Zona interactiva táctil y Dropzone nativa para examinar archivo -->
                    <div id="pdf-drop-zone" style="position: relative; border: 2px dashed #f87171; border-radius: 10px; background: #ffffff; padding: 18px 14px; text-align: center; margin-bottom: 12px; transition: all 0.2s ease; cursor: pointer;">
                        <input type="file" id="pdf-file-upload-input" accept="application/pdf,.pdf" style="position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; z-index: 10;" title="Haz clic para examinar archivos en tu equipo o arrastra un PDF aquí" />
                        
                        <div style="pointer-events: none; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;">
                            <div style="width: 44px; height: 44px; border-radius: 50%; background: #fee2e2; display: flex; align-items: center; justify-content: center; color: #dc2626; box-shadow: 0 2px 6px rgba(220,38,38,0.12);">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            </div>
                            <span style="font-size: 0.92rem; font-weight: 800; color: #991b1b;">
                                📁 Haz clic aquí para examinar en tu equipo
                            </span>
                            <span style="font-size: 0.76rem; color: #7f1d1d; font-weight: 500;">
                                O arrastra y suelta tu archivo PDF en este recuadro
                            </span>
                        </div>
                    </div>

                    <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 10px;">
                        <label for="pdf-file-upload-input" class="btn btn-primary" style="background: #dc2626; border-color: #dc2626; font-size: 0.85rem; padding: 9px 18px; display: inline-flex; align-items: center; gap: 8px; font-weight: 700; cursor: pointer; color: white; border-radius: 8px; margin: 0; box-shadow: 0 2px 6px rgba(220,38,38,0.25);">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            <span>Subir PDF desde tu Equipo</span>
                        </label>
                        <button type="button" id="btn-test-preview-pdf" class="btn btn-outline" style="font-size: 0.84rem; padding: 8px 14px; border-color: #dc2626; color: #dc2626; font-weight: 700; display: ${hasPdf ? 'inline-flex' : 'none'}; align-items: center; gap: 6px; border-radius: 8px; background: white;">
                            <span>👁️ Probar Ver PDF (Nueva Pestaña)</span>
                        </button>
                    </div>

                    <div id="pdf-upload-status-box" style="font-size: 0.82rem; color: #b91c1c; font-weight: 600; min-height: 20px; display: flex; align-items: center; gap: 6px;">
                        ${hasPdf ? `✓ Archivo cargado (${currentData.fileName || 'documento.pdf'}) listo para abrir.` : 'Ningún PDF seleccionado aún.'}
                    </div>

                    <div style="margin-top: 10px;">
                        <label style="display: block; font-size: 0.76rem; font-weight: 700; color: #7f1d1d; margin-bottom: 4px;">Ruta / Enlace URL del PDF (Generado automáticamente al subir o ingresado manual):</label>
                        <input type="text" id="item-pdf-url" value="${currentData.pdfUrl || ''}" placeholder="https://... o data:application/pdf;base64,..." style="width: 100%; padding: 7px 10px; border: 1.5px solid #fca5a5; border-radius: 6px; font-size: 0.8rem; font-family: monospace; background: white;" />
                    </div>
                </div>

                <div style="background: #f8fafc; border: 1.5px solid var(--colua-gray-200); border-radius: 10px; padding: 12px 14px; margin-bottom: 14px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div>
                            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--colua-gray-700); margin-bottom: 4px;">Texto del Botón para el Usuario</label>
                            <input type="text" id="item-btn-text" value="${currentData.buttonText || 'Ver Documento PDF'}" placeholder="Ej: Ver Documento PDF / Descargar" style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--colua-gray-200); border-radius: 8px; font-size: 0.85rem;" />
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--colua-gray-700); margin-bottom: 4px;">Subtítulo / Etiqueta Adicional</label>
                            <input type="text" id="item-subtitle" value="${currentData.subtitle || 'Formato Digital Oficial'}" placeholder="Ej: Actualizado 2026 • 2.5 MB" style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--colua-gray-200); border-radius: 8px; font-size: 0.85rem;" />
                        </div>
                    </div>
                </div>
            `;
        } else if (activeType === 'form_lead') {
            // === 1. EDITOR ESPECIALIZADO: FORMULARIO Y PREGUNTAS ===
            const allAvailableSections = (this.allSectionsList || []).filter(s => s.id !== 'sec_comunidad');
            const currentSecId = currentData.sectionId || this.selectedSectionId || 'sec_home';

            typeSpecificHtml = `
                <div class="form-group" style="margin-bottom: 14px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--colua-navy); margin-bottom: 4px;">Título del Formulario *</label>
                    <input type="text" id="item-title" value="${currentData.title}" required placeholder="Ej: ¿Cómo Asociarte a COLUA? / Solicitud en Línea" style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.9rem;" />
                </div>

                <div class="form-group" style="margin-bottom: 14px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--colua-gray-700); margin-bottom: 4px;">Pantalla / Sección donde se mostrará este Formulario:</label>
                    <select id="item-section-target" style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem; background: white; font-weight: 600; color: var(--colua-navy);">
                        <option value="sec_home" ${currentSecId === 'sec_home' ? 'selected' : ''}>🏠 Inicio (Página Principal)</option>
                        <option value="sec_ahorros" ${currentSecId === 'sec_ahorros' ? 'selected' : ''}>💰 Ahorros & Cuentas</option>
                        <option value="sec_creditos" ${currentSecId === 'sec_creditos' ? 'selected' : ''}>💳 Créditos & Préstamos</option>
                        <option value="sec_seguros" ${currentSecId === 'sec_seguros' ? 'selected' : ''}>🛡️ Seguros & Protección</option>
                        <option value="sec_remesas" ${currentSecId === 'sec_remesas' ? 'selected' : ''}>🌎 Remesas Familiares</option>
                        <option value="sec_servicios" ${currentSecId === 'sec_servicios' ? 'selected' : ''}>📱 Servicios Digitales</option>
                        <option value="sec_beneficios" ${currentSecId === 'sec_beneficios' ? 'selected' : ''}>👑 Tus 6 Beneficios</option>
                        <option value="sec_noticias" ${currentSecId === 'sec_noticias' ? 'selected' : ''}>📰 Noticias & Novedades</option>
                        <option value="sec_sostenibilidad" ${currentSecId === 'sec_sostenibilidad' ? 'selected' : ''}>🌱 Sostenibilidad Cooperativa</option>
                        <option value="sec_nosotros" ${currentSecId === 'sec_nosotros' ? 'selected' : ''}>🏛️ Nosotros & Identidad</option>
                        ${allAvailableSections.filter(s => !['sec_home','sec_ahorros','sec_creditos','sec_seguros','sec_remesas','sec_servicios','sec_beneficios','sec_noticias','sec_sostenibilidad','sec_nosotros'].includes(s.id)).map(s => `
                            <option value="${s.id}" ${currentSecId === s.id ? 'selected' : ''}>📁 ${s.title || s.id}</option>
                        `).join('')}
                    </select>
                    <span style="font-size: 0.74rem; color: #64748b; display: block; margin-top: 3px;">Puedes replicar o mover este formulario a cualquier pantalla de la web.</span>
                </div>

                <div class="form-group" style="margin-bottom: 14px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--colua-gray-700); margin-bottom: 4px;">Instrucciones / Subtítulo para el Usuario</label>
                    <input type="text" id="item-subtitle" value="${currentData.subtitle || ''}" placeholder="Ej: Completa tus datos para coordinar tus requisitos y el pago de tu aportación..." style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem;" />
                </div>

                <!-- SECCIÓN DE REQUISITOS PREVIOS DESTACADOS -->
                <div style="background: linear-gradient(135deg, #f0f7ff 0%, #e0effe 100%); border: 1.5px solid #bae6fd; border-radius: 10px; padding: 14px; margin-bottom: 14px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 800; color: #0369a1; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                        <span>Requisitos Previos Destacados (Un requisito por línea)</span>
                    </label>
                    <textarea id="item-form-requirements" rows="3" placeholder="• DPI vigente original o fotocopia legible&#10;• Recibo de luz o agua reciente&#10;• Aportación inicial mínima de Q 100.00" style="width: 100%; padding: 8px 12px; border: 1.5px solid #7dd3fc; border-radius: 8px; font-size: 0.84rem; font-family: inherit; background: white;">${Array.isArray(currentData.requirements) ? currentData.requirements.join('\n') : (Array.isArray(currentData.benefitItems) ? currentData.benefitItems.join('\n') : '')}</textarea>
                    <span style="font-size: 0.72rem; color: #0369a1; display: block; margin-top: 3px;">Aparecerán resaltados en un recuadro arriba de las preguntas para que el usuario conozca los requisitos antes de llenar sus datos.</span>
                </div>

                <div class="form-group" style="margin-bottom: 14px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--colua-gray-700); margin-bottom: 4px;">Descripción o Mensaje de Bienvenida</label>
                    <textarea id="item-desc" rows="2" placeholder="Información adicional sobre el proceso de envío..." style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem;">${currentData.description || ''}</textarea>
                </div>

                <!-- Configuración de Destino, WhatsApp y Webhook / Excel -->
                <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 10px; padding: 14px; margin-bottom: 16px;">
                    <label style="font-size: 0.86rem; font-weight: 800; color: #166534; display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        <span>Recepción de Respuestas & Canales de Destino</span>
                    </label>
                    <p style="font-size: 0.78rem; color: #15803d; margin: 0 0 10px 0; line-height: 1.4;">
                        Las respuestas se guardan en el panel administrativo, abren chat de WhatsApp y pueden enviarse a un Excel/Google Sheets en red.
                    </p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                        <div>
                            <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #166534; margin-bottom: 3px;">WhatsApp de Recepción / Enlace:</label>
                            <input type="text" id="item-lead-whatsapp" value="${currentData.leadWhatsapp || '50277957795'}" placeholder="Ej: 50277957795" style="width: 100%; padding: 8px 10px; border: 1.5px solid #86efac; border-radius: 6px; font-size: 0.85rem; background: white;" />
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #166534; margin-bottom: 3px;">Texto del Botón de Envío:</label>
                            <input type="text" id="item-btn-text" value="${currentData.buttonText || 'Enviar Solicitud y Coordinar Pago'}" placeholder="Ej: Enviar Solicitud" style="width: 100%; padding: 8px 10px; border: 1.5px solid #86efac; border-radius: 6px; font-size: 0.85rem; background: white;" />
                        </div>
                    </div>

                    <div>
                        <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #166534; margin-bottom: 3px;">
                            🔗 Enlace Webhook / Google Sheets / Excel en la Red (Opcional):
                        </label>
                        <input type="url" id="item-form-webhook" value="${currentData.webhookUrl || ''}" placeholder="Ej: https://script.google.com/macros/s/.../exec o webhook de Zapier/Make" style="width: 100%; padding: 8px 10px; border: 1.5px solid #86efac; border-radius: 6px; font-size: 0.82rem; background: white; font-family: monospace;" />
                        <span style="font-size: 0.72rem; color: #15803d; display: block; margin-top: 3px;">Pega aquí la URL de tu Webhook o Google Apps Script para recibir las respuestas directamente en tu hoja de cálculo en la nube.</span>
                    </div>
                </div>

                <!-- CONSTRUCTOR DINÁMICO DE PREGUNTAS / CAMPOS -->
                <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 14px; margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
                        <div>
                            <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--colua-navy); margin: 0 0 2px 0;">
                                Preguntas y Campos del Formulario
                            </h4>
                            <span style="font-size: 0.76rem; color: #64748b;">Los usuarios ingresarán sus respuestas en estos campos interactivos.</span>
                        </div>
                        <button type="button" id="btn-add-question-field" class="btn btn-primary" style="padding: 6px 14px; font-size: 0.8rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; background: #1d4ed8;">
                            <span>+ Crear Pregunta</span>
                        </button>
                    </div>

                    <div id="dynamic-questions-builder-container" style="display: flex; flex-direction: column; gap: 10px; max-height: 40vh; overflow-y: auto; padding-right: 4px;">
                        <!-- Filas de preguntas insertadas aquí dinámicamente -->
                    </div>
                </div>
            `;
        } else if (activeType === 'image') {
            // === 2. EDITOR ESPECIALIZADO: IMAGEN ===
            typeSpecificHtml = `
                <div class="form-group" style="margin-bottom: 14px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--colua-navy); margin-bottom: 4px;">Texto Alternativo / Título de la Imagen *</label>
                    <input type="text" id="item-title" value="${currentData.title}" required placeholder="Ej: Edificio Central COLUA / Banner Promocional" style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.9rem;" />
                </div>

                <div class="form-group" style="margin-bottom: 14px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--colua-gray-700); margin-bottom: 4px;">Pie de Imagen o Descripción (Opcional)</label>
                    <input type="text" id="item-desc" value="${currentData.description || ''}" placeholder="Ej: Fotografía oficial de la agencia..." style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem;" />
                </div>

                <div class="form-group" style="margin-bottom: 14px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--colua-gray-700); margin-bottom: 4px;">Enlace de Destino al hacer Clic (Opcional)</label>
                    <input type="text" id="item-btn-action" value="${currentData.buttonAction || currentData.targetSectionId || ''}" placeholder="Ej: #sec_agencias o https://micoopeenlinea.com.gt" style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem; font-family: monospace;" />
                </div>

                <!-- Selector de Imagen / Catálogo y Supabase -->
                <div class="form-group" style="margin-bottom: 16px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 14px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <label style="font-size: 0.86rem; font-weight: 700; color: var(--colua-navy); margin: 0;">Seleccionar o Subir Imagen:</label>
                        <span id="upload-status" style="font-size: 0.76rem; color: var(--colua-green); font-weight: 600;"></span>
                    </div>

                    <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 12px;">
                        <div style="width: 110px; height: 85px; border-radius: 10px; border: 1.5px solid #cbd5e1; background: #ffffff; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 4px;">
                            <img id="item-img-preview" src="${currentData.imageUrl || 'assets/colua_edificio.png'}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: cover;" onerror="this.src='assets/distintivo_colua.png'" />
                        </div>
                        <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                            <input type="text" id="item-img-url" value="${currentData.imageUrl || ''}" placeholder="assets/colua_edificio.png o URL externa" style="width: 100%; padding: 8px 10px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 0.82rem; font-family: monospace;" />
                            <label class="btn btn-primary" style="padding: 6px 12px; font-size: 0.78rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; width: fit-content; margin: 0; background: var(--colua-navy);">
                                <span>📁 Subir desde este Dispositivo</span>
                                <input type="file" id="item-file-input" accept="image/*" style="display: none;" />
                            </label>
                        </div>
                    </div>

                    <!-- Catálogo Rápido de Assets -->
                    <div style="border-top: 1px dashed #cbd5e1; padding-top: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="font-size: 0.75rem; font-weight: 700; color: #475569; text-transform: uppercase;">Catálogo de Imágenes del Sistema</span>
                            <input type="text" id="asset-picker-search" placeholder="🔍 Buscar..." style="padding: 3px 8px; font-size: 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; width: 120px;" />
                        </div>
                        <div id="asset-picker-grid" style="max-height: 140px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 6px; padding: 6px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                            ${ASSET_CATALOG.map(item => `
                                <div class="asset-catalog-thumb ${(currentData.imageUrl || '') === item.path ? 'active-thumb' : ''}" data-path="${item.path}" data-label="${item.label.toLowerCase()}" style="cursor: pointer; padding: 4px; border-radius: 6px; border: 1.5px solid #cbd5e1; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 2px;">
                                    <img src="${item.path}" alt="${item.label}" style="width: 28px; height: 28px; object-fit: contain;" onerror="this.src='assets/distintivo_colua.png'" />
                                    <span style="font-size: 0.62rem; color: #334155; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%;">${item.label}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        } else if (activeType === 'text') {
            // === 3. EDITOR ESPECIALIZADO: TEXTO ===
            typeSpecificHtml = `
                <div class="form-group" style="margin-bottom: 14px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--colua-navy); margin-bottom: 4px;">Título o Encabezado *</label>
                    <input type="text" id="item-title" value="${currentData.title}" required placeholder="Ej: Compromiso con el Desarrollo Cooperativo" style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.9rem;" />
                </div>

                <div class="form-group" style="margin-bottom: 14px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--colua-gray-700); margin-bottom: 4px;">Jerarquía Visual / Nivel:</label>
                    <select id="item-text-hierarchy" style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem; background: white;">
                        <option value="h1" ${currentData.textHierarchy === 'h1' ? 'selected' : ''}>Encabezado Principal (H1 Grande)</option>
                        <option value="h2" ${currentData.textHierarchy === 'h2' || !currentData.textHierarchy ? 'selected' : ''}>Título de Sección (H2 Estándar)</option>
                        <option value="h3" ${currentData.textHierarchy === 'h3' ? 'selected' : ''}>Subtítulo Destacado (H3)</option>
                        <option value="callout" ${currentData.textHierarchy === 'callout' ? 'selected' : ''}>Caja de Alerta / Mensaje Destacado</option>
                    </select>
                </div>

                <div class="form-group" style="margin-bottom: 14px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--colua-gray-700); margin-bottom: 4px;">Contenido del Párrafo o Mensaje</label>
                    <textarea id="item-desc" rows="5" placeholder="Escribe el texto completo que verán los asociados..." style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem; line-height: 1.5;">${currentData.description || ''}</textarea>
                </div>

                <div class="form-group" style="margin-bottom: 14px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--colua-gray-700); margin-bottom: 4px;">Alineación del Texto:</label>
                    <select id="item-text-align" style="width: 100%; padding: 8px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem; background: white;">
                        <option value="left" ${currentData.textAlign === 'left' ? 'selected' : ''}>Alinear a la Izquierda</option>
                        <option value="center" ${currentData.textAlign === 'center' ? 'selected' : ''}>Centrado</option>
                        <option value="right" ${currentData.textAlign === 'right' ? 'selected' : ''}>Alinear a la Derecha</option>
                    </select>
                </div>
            `;
        } else if (activeType === 'button') {
            // === 4. EDITOR ESPECIALIZADO: BOTÓN DE ACCIÓN ===
            typeSpecificHtml = `
                <div class="form-group" style="margin-bottom: 14px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--colua-navy); margin-bottom: 4px;">Texto Visible en el Botón *</label>
                    <input type="text" id="item-title" value="${currentData.title || currentData.buttonText || 'Contactar con Asesor'}" required placeholder="Ej: Abrir Cuenta de Ahorros / Solicitar Crédito" style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.9rem;" />
                </div>

                <div class="form-group" style="margin-bottom: 14px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--colua-gray-700); margin-bottom: 4px;">Destino o Acción del Botón *</label>
                    <input type="text" id="item-btn-action" value="${currentData.buttonAction || currentData.targetSectionId || 'tel:77957795'}" required placeholder="tel:77957795, https://..., #sec_ahorros, form:form_asociate" style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem; font-family: monospace;" />
                </div>

                <!-- Plantillas Rápidas -->
                <div style="margin-bottom: 14px; background: #f8fafc; padding: 10px 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <span style="font-size: 0.74rem; font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">Destinos Frecuentes:</span>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                        <button type="button" class="btn-preset-chip" data-text="Llenar Formulario" data-action="form:form_asociate" style="padding: 3px 8px; font-size: 0.72rem; border-radius: 12px; border: 1px solid #1d4ed8; background: #eff6ff; color: #1d4ed8; font-weight: 600; cursor: pointer;">📝 Formulario</button>
                        <button type="button" class="btn-preset-chip" data-text="Llamar a PBX" data-action="tel:77957795" style="padding: 3px 8px; font-size: 0.72rem; border-radius: 12px; border: 1px solid #cbd5e1; background: white; color: #334155; cursor: pointer;">📞 PBX Central</button>
                        <button type="button" class="btn-preset-chip" data-text="Banca en Línea" data-action="https://micoopeenlinea.com.gt" style="padding: 3px 8px; font-size: 0.72rem; border-radius: 12px; border: 1px solid #cbd5e1; background: white; color: #334155; cursor: pointer;">🌐 Web Externa</button>
                        <button type="button" class="btn-preset-chip" data-text="Ver Agencias" data-action="#sec_agencias" style="padding: 3px 8px; font-size: 0.72rem; border-radius: 12px; border: 1px solid #cbd5e1; background: white; color: #334155; cursor: pointer;">📍 Agencias</button>
                    </div>
                </div>
            `;
        } else if (activeType === 'benefit_list') {
            // === 5. EDITOR ESPECIALIZADO: LISTA DE BENEFICIOS / REQUISITOS ===
            const reqsText = Array.isArray(currentData.benefitItems) ? currentData.benefitItems.join('\n') : (currentData.subtitle || '');
            typeSpecificHtml = `
                <div class="form-group" style="margin-bottom: 14px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--colua-navy); margin-bottom: 4px;">Título de la Lista *</label>
                    <input type="text" id="item-title" value="${currentData.title}" required placeholder="Ej: Requisitos para Apertura de Cuenta" style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.9rem;" />
                </div>

                <div class="form-group" style="margin-bottom: 14px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--colua-gray-700); margin-bottom: 4px;">
                        Elementos / Viñetas de la Lista (Un elemento por línea):
                    </label>
                    <textarea id="item-benefit-items" rows="6" placeholder="• DPI original o fotocopia&#10;• Recibo de servicios recientes&#10;• Aportación inicial mínima" style="width: 100%; padding: 10px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.86rem; font-family: inherit; line-height: 1.5;">${reqsText}</textarea>
                    <span style="font-size: 0.72rem; color: #64748b; display: block; margin-top: 4px;">Cada línea se renderizará automáticamente con un ícono de verificación (✓).</span>
                </div>
            `;
        } else {
            // === 6. EDITOR POR DEFECTO: PRODUCTO FINANCIERO / TARJETA ===
            typeSpecificHtml = `
                <div class="form-group" style="margin-bottom: 12px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--colua-gray-700); margin-bottom: 4px;">Título Principal *</label>
                    <input type="text" id="item-title" value="${currentData.title}" required placeholder="Ej: Crédito Productivo / Cuenta Ahorro" style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-200); border-radius: 8px; font-size: 0.9rem;" />
                </div>

                <div class="form-group" style="margin-bottom: 12px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--colua-gray-700); margin-bottom: 4px;">Subtítulo / Etiqueta / Monto</label>
                    <input type="text" id="item-subtitle" value="${currentData.subtitle || ''}" placeholder="Ej: Monto: desde Q1,000.00 / 100% Cobertura" style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-200); border-radius: 8px; font-size: 0.9rem;" />
                </div>

                <div class="form-group" style="margin-bottom: 12px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--colua-gray-700); margin-bottom: 4px;">Descripción Detallada</label>
                    <textarea id="item-desc" rows="3" placeholder="Describe los beneficios o características..." style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-200); border-radius: 8px; font-size: 0.88rem;">${currentData.description || ''}</textarea>
                </div>

                <div style="background: #f8fafc; border: 1.5px solid var(--colua-gray-200); border-radius: 10px; padding: 12px 14px; margin-bottom: 14px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                        <div>
                            <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">Texto del Botón</label>
                            <input type="text" id="item-btn-text" value="${currentData.buttonText || ''}" placeholder="Ej: Ver Más / Solicitar" style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--colua-gray-200); border-radius: 8px; font-size: 0.85rem;" />
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">Destino / Acción</label>
                            <input type="text" id="item-btn-action" value="${currentData.buttonAction || currentData.targetSectionId || ''}" placeholder="modal:info, tel:77957795 o #sec_..." style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--colua-gray-200); border-radius: 8px; font-size: 0.85rem;" />
                        </div>
                    </div>
                </div>

                <!-- Selector de Imagen -->
                <div class="form-group" style="margin-bottom: 16px; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 12px;">
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <div style="width: 44px; height: 44px; border-radius: 8px; border: 1.5px solid #cbd5e1; background: #f8fafc; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 3px;">
                            <img id="item-img-preview" src="${currentData.imageUrl || 'assets/distintivo_colua.png'}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.src='assets/distintivo_colua.png'" />
                        </div>
                        <div style="flex: 1;">
                            <input type="text" id="item-img-url" value="${currentData.imageUrl || ''}" placeholder="assets/ahorros.png" style="width: 100%; padding: 6px 10px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 0.82rem;" />
                        </div>
                    </div>
                </div>
            `;
        }

        const modalHtml = `
            <div style="max-width: 560px; width: 100%; text-align: left;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 12px;">
                    <div>
                        <span style="font-size: 0.72rem; font-weight: 700; color: #16a34a; background: #dcfce7; padding: 2px 8px; border-radius: 6px; display: inline-block; margin-bottom: 4px;">
                            ${activeTypeName}
                        </span>
                        <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--colua-navy); margin: 0;">
                            ${isNew ? `Configurar ${activeTypeName}` : `Editar: ${currentData.title}`}
                        </h3>
                    </div>
                </div>

                <form id="item-edit-form">
                    ${typeSpecificHtml}

                    <!-- Estados Globales de Publicación -->
                    <div style="margin-bottom: 16px; padding: 12px 14px; background: #f8fafc; border-radius: 8px; border: 1px solid var(--colua-gray-200); display: flex; flex-direction: column; gap: 8px;">
                        <label style="display: flex; align-items: center; gap: 10px; font-size: 0.88rem; font-weight: 600; color: var(--colua-gray-800); cursor: pointer;">
                            <input type="checkbox" id="item-enabled" ${currentData.isEnabled !== false && currentData.isVisible !== false ? 'checked' : ''} style="width: 18px; height: 18px;" />
                            <span>Elemento Activo / Publicado en la web</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem; font-weight: 600; color: #b45309; cursor: pointer;">
                            <input type="checkbox" id="item-is-draft" ${currentData.isDraft === true ? 'checked' : ''} style="width: 18px; height: 18px;" />
                            <span>Guardar como Borrador (No visible para usuarios públicos)</span>
                        </label>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid var(--colua-gray-200); padding-top: 14px;">
                        <button type="button" class="btn btn-outline" onclick="app.closeModal()" style="padding: 9px 16px;">Cancelar</button>
                        <button type="button" id="btn-save-item-modal" onclick="window.adminComponent.saveCurrentItemModal(event)" class="btn btn-primary" style="padding: 10px 24px; font-weight: 700; background: var(--colua-navy); cursor: pointer; border-radius: 8px;">Guardar ${activeTypeName}</button>
                    </div>
                </form>
            </div>
        `;

        app.showModal(modalHtml);

        // LÓGICA DEL CONSTRUCTOR DE PREGUNTAS (Para form_lead)
        let dynamicQuestions = Array.isArray(currentData.formQuestions) ? [...currentData.formQuestions] : [...defaultQuestions];

        const renderQuestionsBuilder = () => {
            const container = document.getElementById('dynamic-questions-builder-container');
            if (!container) return;

            if (dynamicQuestions.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 18px; background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 8px; color: #64748b; font-size: 0.84rem;">
                        No hay preguntas agregadas todavía. Haz clic en <strong>"+ Crear Pregunta"</strong> para agregar campos.
                    </div>
                `;
                return;
            }

            container.innerHTML = dynamicQuestions.map((q, idx) => `
                <div class="question-row-card" data-idx="${idx}" style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 8px; position: relative;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.75rem; font-weight: 800; color: #1e40af; background: #dbeafe; padding: 2px 7px; border-radius: 4px;">
                            Pregunta #${idx + 1}
                        </span>
                        <button type="button" class="btn-del-question" data-idx="${idx}" title="Eliminar pregunta" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 2px 6px; font-size: 0.9rem;">
                            🗑️
                        </button>
                    </div>

                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 8px;">
                        <div>
                            <label style="display: block; font-size: 0.74rem; font-weight: 700; color: #334155; margin-bottom: 2px;">Texto de la Pregunta *</label>
                            <input type="text" class="q-text-input" data-idx="${idx}" value="${q.question || q.label || ''}" placeholder="Ej: ¿Cuál es tu número de DPI o Consulta?" style="width: 100%; padding: 7px 10px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 0.84rem; background: white;" />
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.74rem; font-weight: 700; color: #334155; margin-bottom: 2px;">Tipo de Respuesta:</label>
                            <select class="q-type-select" data-idx="${idx}" style="width: 100%; padding: 7px 8px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 0.82rem; background: white;">
                                <option value="text" ${q.type === 'text' ? 'selected' : ''}>Texto Corto</option>
                                <option value="textarea" ${q.type === 'textarea' ? 'selected' : ''}>Texto Largo</option>
                                <option value="tel" ${q.type === 'tel' ? 'selected' : ''}>Teléfono</option>
                                <option value="email" ${q.type === 'email' ? 'selected' : ''}>Correo</option>
                                <option value="file" ${q.type === 'file' || q.type === 'image' ? 'selected' : ''}>📸 Subir Foto / Documento (DPI, Recibo, etc.)</option>
                                <option value="select" ${q.type === 'select' ? 'selected' : ''}>Desplegable</option>
                            </select>
                        </div>
                    </div>

                    ${q.type === 'select' ? `
                        <div>
                            <label style="display: block; font-size: 0.72rem; font-weight: 700; color: #334155; margin-bottom: 2px;">Opciones del menú (Separadas por comas):</label>
                            <input type="text" class="q-options-input" data-idx="${idx}" value="${Array.isArray(q.options) ? q.options.join(', ') : (q.options || '')}" placeholder="Opción 1, Opción 2, Opción 3" style="width: 100%; padding: 6px 10px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 0.82rem; background: white;" />
                        </div>
                    ` : ''}

                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <label style="display: flex; align-items: center; gap: 6px; font-size: 0.76rem; font-weight: 600; color: #475569; cursor: pointer;">
                            <input type="checkbox" class="q-req-check" data-idx="${idx}" ${q.required ? 'checked' : ''} style="width: 14px; height: 14px;" />
                            <span>Respuesta Obligatoria (*)</span>
                        </label>
                    </div>
                </div>
            `).join('');

            // Eventos de las filas de preguntas
            container.querySelectorAll('.q-text-input').forEach(inp => {
                inp.addEventListener('input', (e) => {
                    const idx = Number(e.target.dataset.idx);
                    dynamicQuestions[idx].question = e.target.value;
                    dynamicQuestions[idx].label = e.target.value;
                });
            });

            container.querySelectorAll('.q-type-select').forEach(sel => {
                sel.addEventListener('change', (e) => {
                    const idx = Number(e.target.dataset.idx);
                    dynamicQuestions[idx].type = e.target.value;
                    renderQuestionsBuilder();
                });
            });

            container.querySelectorAll('.q-options-input').forEach(inp => {
                inp.addEventListener('input', (e) => {
                    const idx = Number(e.target.dataset.idx);
                    const raw = e.target.value;
                    dynamicQuestions[idx].options = raw.split(',').map(o => o.trim()).filter(Boolean);
                });
            });

            container.querySelectorAll('.q-req-check').forEach(chk => {
                chk.addEventListener('change', (e) => {
                    const idx = Number(e.target.dataset.idx);
                    dynamicQuestions[idx].required = e.target.checked;
                });
            });

            container.querySelectorAll('.btn-del-question').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = Number(e.target.closest('button').dataset.idx);
                    dynamicQuestions.splice(idx, 1);
                    renderQuestionsBuilder();
                });
            });
        };

        if (activeType === 'form_lead') {
            renderQuestionsBuilder();
            document.getElementById('btn-add-question-field')?.addEventListener('click', () => {
                const newId = 'q_' + Date.now();
                dynamicQuestions.push({
                    id: newId,
                    question: 'Nueva Pregunta ' + (dynamicQuestions.length + 1),
                    label: 'Nueva Pregunta ' + (dynamicQuestions.length + 1),
                    type: 'text',
                    required: true,
                    placeholder: 'Escribe tu respuesta...'
                });
                renderQuestionsBuilder();
            });
        }

        // Eventos de presets e imágenes si existen
        document.querySelectorAll('.btn-preset-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const btnAction = document.getElementById('item-btn-action');
                const btnText = document.getElementById('item-btn-text');
                if (btnAction) btnAction.value = chip.dataset.action;
                if (btnText && !btnText.value) btnText.value = chip.dataset.text;
            });
        });

        const fileInput = document.getElementById('item-file-input');
        const imgUrlInput = document.getElementById('item-img-url');
        const imgPreview = document.getElementById('item-img-preview');
        const uploadStatus = document.getElementById('upload-status');
        const thumbs = document.querySelectorAll('.asset-catalog-thumb');

        thumbs.forEach(t => {
            t.addEventListener('click', () => {
                const path = t.dataset.path;
                if (imgUrlInput) imgUrlInput.value = path;
                if (imgPreview) imgPreview.src = path;
                thumbs.forEach(other => other.style.borderColor = '#cbd5e1');
                t.style.borderColor = 'var(--colua-navy)';
            });
        });

        if (fileInput) {
            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    if (uploadStatus) uploadStatus.textContent = 'Subiendo imagen...';
                    const res = await window.supabaseStorageManager.uploadImage(file, (msg) => { if (uploadStatus) uploadStatus.textContent = msg; });
                    if (res.success) {
                        if (imgUrlInput) imgUrlInput.value = res.url;
                        if (imgPreview) imgPreview.src = res.url;
                        if (uploadStatus) uploadStatus.textContent = '✓ Imagen cargada';
                    }
                }
            });
        }

        // Eventos para Documento PDF (Subida y Prueba en Nueva Pestaña)
        const pdfFileInput = document.getElementById('pdf-file-upload-input');
        const pdfUrlInput = document.getElementById('item-pdf-url');
        const pdfStatusBox = document.getElementById('pdf-upload-status-box');
        const btnTestPreviewPdf = document.getElementById('btn-test-preview-pdf');
        const dropZone = document.getElementById('pdf-drop-zone');

        const handlePdfFile = async (file) => {
            if (!file) return;
            console.log('[COLUA PDF] Archivo seleccionado para procesar:', file.name, file.size);
            if (pdfStatusBox) {
                pdfStatusBox.innerHTML = '<span style="color:#d97706;">⏳ Subiendo y guardando documento PDF en el sistema...</span>';
            }
            try {
                let uploader = window.supabaseStorageManager;
                if (!uploader && typeof SupabaseStorageManager !== 'undefined') {
                    window.supabaseStorageManager = new SupabaseStorageManager();
                    uploader = window.supabaseStorageManager;
                }

                let res = null;
                if (uploader && uploader.uploadPdf) {
                    res = await uploader.uploadPdf(file, (msg) => {
                        if (pdfStatusBox) pdfStatusBox.textContent = msg;
                    });
                } else if (window.ColuaPdfStore) {
                    const docKey = 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
                    await window.ColuaPdfStore.savePdf(docKey, file, file.name);
                    res = {
                        success: true,
                        url: 'indexeddb:' + docKey,
                        fileName: file.name,
                        fileSize: file.size
                    };
                } else {
                    throw new Error('No se pudo inicializar el almacenamiento.');
                }

                if (res && res.success) {
                    currentData.pdfUrl = res.url;
                    currentData.fileName = res.fileName || file.name;
                    currentData.fileSize = res.fileSize || file.size;

                    if (pdfUrlInput) pdfUrlInput.value = res.url;
                    if (pdfStatusBox) {
                        const sizeMb = (res.fileSize / (1024 * 1024)).toFixed(2);
                        pdfStatusBox.innerHTML = `✓ <strong style="color:#15803d;">${res.fileName}</strong> (${sizeMb} MB) guardado en el sistema con éxito.`;
                    }
                    if (btnTestPreviewPdf) {
                        btnTestPreviewPdf.style.display = 'inline-flex';
                    }
                    const titleInput = document.getElementById('item-title');
                    if (titleInput && (!titleInput.value || titleInput.value === 'Documento Oficial en PDF')) {
                        titleInput.value = file.name.replace(/\.pdf$/i, '').replace(/_/g, ' ');
                    }
                } else {
                    if (pdfStatusBox) pdfStatusBox.innerHTML = `❌ Error: ${res?.error || 'No se pudo subir el archivo'}`;
                }
            } catch(err) {
                console.error('[COLUA PDF] Error al procesar PDF:', err);
                if (pdfStatusBox) pdfStatusBox.innerHTML = `❌ Error: ${err.message || 'Error inesperado'}`;
            }
        };

        if (dropZone) {
            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dropZone.style.borderColor = '#dc2626';
                    dropZone.style.background = '#fef2f2';
                });
            });
            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dropZone.style.borderColor = '#f87171';
                    dropZone.style.background = '#ffffff';
                });
            });
            dropZone.addEventListener('drop', (e) => {
                const dt = e.dataTransfer;
                const files = dt?.files;
                if (files && files.length > 0) {
                    handlePdfFile(files[0]);
                }
            });
        }

        if (pdfFileInput) {
            pdfFileInput.addEventListener('change', (e) => {
                const file = e.target.files?.[0];
                if (file) handlePdfFile(file);
            });
        }

        if (btnTestPreviewPdf) {
            btnTestPreviewPdf.addEventListener('click', () => {
                const url = pdfUrlInput?.value || currentData.pdfUrl;
                const title = document.getElementById('item-title')?.value || 'Documento COLUA';
                window.openPdfDocument(url, title);
            });
        }

        // SUBMIT DEL FORMULARIO DE EDICIÓN (Robusto con manejo de cuota y try/catch)
        const formElem = document.getElementById('item-edit-form');
        const saveBtn = document.getElementById('btn-save-item-modal');

        const executeSaveItem = async (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            if (saveBtn) {
                saveBtn.disabled = true;
                saveBtn.innerHTML = '⏳ Guardando...';
            }

            try {
                const isEnabledVal = document.getElementById('item-enabled')?.checked ?? true;
                const isDraftVal = document.getElementById('item-is-draft')?.checked ?? false;

                let updatedTitle = document.getElementById('item-title')?.value?.trim();
                if (!updatedTitle) {
                    updatedTitle = activeTypeName;
                }
                let updatedSubtitle = document.getElementById('item-subtitle')?.value?.trim() || '';
                let updatedDesc = document.getElementById('item-desc')?.value?.trim() || '';
                let updatedBtnText = document.getElementById('item-btn-text')?.value?.trim() || '';
                let updatedBtnAction = document.getElementById('item-btn-action')?.value?.trim() || '';
                let updatedImg = imgUrlInput?.value?.trim() || currentData.imageUrl || '';
                let updatedLeadWhatsapp = document.getElementById('item-lead-whatsapp')?.value?.trim() || currentData.leadWhatsapp || '50277957795';

                let targetSecVal = this.selectedSectionId;
                let formReqsArray = [];
                let formWebhookUrl = '';

                if (activeType === 'pdf_document') {
                    targetSecVal = document.getElementById('item-section-target')?.value || this.selectedSectionId;
                    let pdfUrlVal = pdfUrlInput?.value?.trim() || currentData.pdfUrl || '';
                    
                    // Si el PDF viene en Data URI Base64 grande (ej. 18MB), mover a IndexedDB para evitar exceder cuota de localStorage
                    if (pdfUrlVal && pdfUrlVal.startsWith('data:application/pdf') && pdfUrlVal.length > 100000) {
                        try {
                            const docKey = 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
                            const base64Data = pdfUrlVal.includes(',') ? pdfUrlVal.split(',')[1] : pdfUrlVal;
                            const binaryString = atob(base64Data);
                            const bytes = new Uint8Array(binaryString.length);
                            for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
                            const blob = new Blob([bytes], { type: 'application/pdf' });
                            if (window.ColuaPdfStore) {
                                await window.ColuaPdfStore.savePdf(docKey, blob, currentData.fileName || 'documento.pdf');
                                pdfUrlVal = 'indexeddb:' + docKey;
                                currentData.pdfUrl = pdfUrlVal;
                                if (pdfUrlInput) pdfUrlInput.value = pdfUrlVal;
                                console.log('[COLUA ADMIN] PDF Base64 grande migrado a IndexedDB:', pdfUrlVal);
                            }
                        } catch (errConv) {
                            console.warn('[COLUA ADMIN] Error al migrar Base64 a IndexedDB:', errConv);
                        }
                    }

                    updatedBtnAction = 'pdf:' + pdfUrlVal;
                    updatedBtnText = document.getElementById('item-btn-text')?.value?.trim() || 'Ver Documento PDF';
                } else if (activeType === 'form_lead') {
                    updatedBtnAction = 'form:' + currentData.id;
                    targetSecVal = document.getElementById('item-section-target')?.value || this.selectedSectionId;
                    const rawReqs = document.getElementById('item-form-requirements')?.value?.trim() || '';
                    formReqsArray = rawReqs ? rawReqs.split('\n').map(r => r.trim()).filter(Boolean) : [];
                    formWebhookUrl = document.getElementById('item-form-webhook')?.value?.trim() || '';
                }

                let benefitItems = currentData.benefitItems || [];
                if (activeType === 'benefit_list') {
                    const rawItems = document.getElementById('item-benefit-items')?.value?.trim() || '';
                    benefitItems = rawItems ? rawItems.split('\n').map(i => i.trim()).filter(Boolean) : [];
                    updatedSubtitle = benefitItems.join(', ');
                }

                const updated = {
                    ...currentData,
                    sectionId: targetSecVal,
                    type: activeType,
                    title: updatedTitle,
                    subtitle: updatedSubtitle,
                    description: updatedDesc,
                    buttonText: updatedBtnText,
                    buttonAction: updatedBtnAction,
                    targetSectionId: updatedBtnAction,
                    imageUrl: updatedImg,
                    pdfUrl: activeType === 'pdf_document' ? (pdfUrlInput?.value?.trim() || currentData.pdfUrl || '') : (currentData.pdfUrl || ''),
                    fileName: currentData.fileName || '',
                    fileSize: currentData.fileSize || 0,
                    leadWhatsapp: updatedLeadWhatsapp,
                    webhookUrl: formWebhookUrl,
                    requirements: formReqsArray.length > 0 ? formReqsArray : (currentData.requirements || []),
                    formQuestions: activeType === 'form_lead' ? dynamicQuestions : (currentData.formQuestions || []),
                    benefitItems: benefitItems,
                    textHierarchy: document.getElementById('item-text-hierarchy')?.value || currentData.textHierarchy || 'h2',
                    textAlign: document.getElementById('item-text-align')?.value || currentData.textAlign || 'left',
                    isEnabled: isEnabledVal,
                    isVisible: isEnabledVal,
                    isDraft: isDraftVal,
                    isPublished: !isDraftVal,
                    lastModified: Date.now()
                };

                // Si la tarjeta pertenece a la sección de noticias, asegurar campos esenciales para renderizar en Noticias
                const secClean = (targetSecVal || '').toLowerCase();
                if (secClean === 'sec_noticias' || secClean === 'noticias' || (currentData.id || '').startsWith('news_')) {
                    if (!updated.publicationDate && !updated.date && !updated.fecha) {
                        updated.publicationDate = new Date().toISOString();
                    }
                    if (!updated.issuerName) updated.issuerName = 'Cooperativa COLUA R.L.';
                    if (!updated.issuerRole) updated.issuerRole = 'Comunicación Oficial';
                    if (!updated.tags) updated.tags = '#COLUA';
                    updated.likesCount = Number(updated.likesCount) || 0;
                    updated.sharesCount = Number(updated.sharesCount) || 0;
                }

                await coluaRepo.saveContentItem(updated);

                // Si es un formulario, guardarlo también en la colección forms de coluaRepo
                if (activeType === 'form_lead') {
                    const formToSave = {
                        id: currentData.id,
                        title: updatedTitle,
                        subtitle: updatedSubtitle || updatedDesc,
                        buttonText: updatedBtnText || 'Enviar Respuestas',
                        leadWhatsapp: updatedLeadWhatsapp,
                        webhookUrl: formWebhookUrl,
                        targetSectionId: targetSecVal,
                        fields: dynamicQuestions.map(q => ({
                            id: q.id || 'field_' + Math.random().toString(36).substring(2, 7),
                            label: q.question || q.label || 'Campo',
                            type: q.type || 'text',
                            required: q.required !== false,
                            placeholder: q.placeholder || '',
                            options: q.options || []
                        })),
                        requirements: formReqsArray
                    };
                    await coluaRepo.saveForm(formToSave);
                }

                app.closeModal();

                if (window.Swal) {
                    Swal.fire({
                        title: isDraftVal ? "¡Guardado como Borrador!" : `¡${activeTypeName} Guardado!`,
                        text: `"${updated.title}" ha sido guardado exitosamente.`,
                        icon: "success",
                        timer: 1600,
                        showConfirmButton: false,
                        draggable: true
                    });
                } else {
                    app.showToast(`${activeTypeName} guardado con éxito`, 'success');
                }
                await this.loadTabContent();
            } catch (err) {
                console.error('[COLUA ADMIN] Error al guardar elemento:', err);
                if (saveBtn) {
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = `Guardar ${activeTypeName}`;
                }
                if (window.Swal) {
                    Swal.fire({
                        title: 'Error al Guardar',
                        text: err.message || 'Ocurrió un error inesperado al guardar.',
                        icon: 'error'
                    });
                } else {
                    alert('Error al guardar: ' + err.message);
                }
            }
        };

        if (formElem) {
            formElem.addEventListener('submit', executeSaveItem);
        }
        if (saveBtn) {
            saveBtn.addEventListener('click', (e) => {
                // Si el botón no disparó el submit nativo del formulario
                if (formElem && formElem.checkValidity && !formElem.checkValidity()) {
                    formElem.reportValidity();
                    return;
                }
                this.saveCurrentItemModal(e);
            });
        }
    }

    async saveCurrentItemModal(e) {
        if (e && e.preventDefault) e.preventDefault();
        console.log('[COLUA ADMIN] saveCurrentItemModal disparado por click');

        const saveBtn = document.getElementById('btn-save-item-modal');
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '⏳ Guardando...';
        }

        try {
            const currentData = this._currentEditingData || {};
            const activeType = this._currentEditingType || currentData.type || 'pdf_document';
            const activeTypeName = (this._typeLabels && this._typeLabels[activeType]) || 'Elemento';

            let updatedTitle = document.getElementById('item-title')?.value?.trim();
            if (!updatedTitle) {
                updatedTitle = activeType === 'pdf_document' ? 'Documento Oficial en PDF' : 'Elemento COLUA';
            }

            const isEnabledVal = document.getElementById('item-enabled')?.checked ?? true;
            const isDraftVal = document.getElementById('item-is-draft')?.checked ?? false;

            let updatedSubtitle = document.getElementById('item-subtitle')?.value?.trim() || '';
            let updatedDesc = document.getElementById('item-desc')?.value?.trim() || '';
            let updatedBtnText = document.getElementById('item-btn-text')?.value?.trim() || '';
            let updatedBtnAction = document.getElementById('item-btn-action')?.value?.trim() || '';
            let updatedImg = document.getElementById('item-img-url')?.value?.trim() || currentData.imageUrl || '';
            let updatedLeadWhatsapp = document.getElementById('item-lead-whatsapp')?.value?.trim() || currentData.leadWhatsapp || '50277957795';

            let targetSecVal = document.getElementById('item-section-target')?.value || this.selectedSectionId || currentData.sectionId || 'sec_home';
            let formReqsArray = [];
            let formWebhookUrl = '';

            if (activeType === 'pdf_document') {
                targetSecVal = document.getElementById('item-section-target')?.value || this.selectedSectionId || 'sec_home';
                let pdfUrlVal = document.getElementById('item-pdf-url')?.value?.trim() || currentData.pdfUrl || '';

                // Si viene como Data URI Base64 grande (ej. 18MB de memoria de labores), migrar de inmediato a IndexedDB
                if (pdfUrlVal && pdfUrlVal.startsWith('data:application/pdf') && pdfUrlVal.length > 50000) {
                    try {
                        const docKey = 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
                        const base64Data = pdfUrlVal.includes(',') ? pdfUrlVal.split(',')[1] : pdfUrlVal;
                        const binaryString = atob(base64Data);
                        const bytes = new Uint8Array(binaryString.length);
                        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
                        const blob = new Blob([bytes], { type: 'application/pdf' });
                        if (window.ColuaPdfStore) {
                            await window.ColuaPdfStore.savePdf(docKey, blob, currentData.fileName || 'documento.pdf');
                            pdfUrlVal = 'indexeddb:' + docKey;
                            currentData.pdfUrl = pdfUrlVal;
                            const pdfInput = document.getElementById('item-pdf-url');
                            if (pdfInput) pdfInput.value = pdfUrlVal;
                            console.log('[COLUA ADMIN] PDF Base64 migrado a IndexedDB:', pdfUrlVal);
                        }
                    } catch (errConv) {
                        console.warn('[COLUA ADMIN] Fallo en migración a IndexedDB:', errConv);
                    }
                }

                updatedBtnAction = 'pdf:' + pdfUrlVal;
                updatedBtnText = document.getElementById('item-btn-text')?.value?.trim() || 'Ver Documento PDF';
            }

            const updated = {
                ...currentData,
                sectionId: targetSecVal,
                type: activeType,
                title: updatedTitle,
                subtitle: updatedSubtitle,
                description: updatedDesc,
                buttonText: updatedBtnText,
                buttonAction: updatedBtnAction,
                targetSectionId: updatedBtnAction,
                imageUrl: updatedImg,
                pdfUrl: activeType === 'pdf_document' ? (document.getElementById('item-pdf-url')?.value?.trim() || currentData.pdfUrl || '') : (currentData.pdfUrl || ''),
                fileName: currentData.fileName || '',
                fileSize: currentData.fileSize || 0,
                leadWhatsapp: updatedLeadWhatsapp,
                webhookUrl: formWebhookUrl,
                requirements: formReqsArray.length > 0 ? formReqsArray : (currentData.requirements || []),
                formQuestions: currentData.formQuestions || [],
                benefitItems: currentData.benefitItems || [],
                textHierarchy: document.getElementById('item-text-hierarchy')?.value || currentData.textHierarchy || 'h2',
                textAlign: document.getElementById('item-text-align')?.value || currentData.textAlign || 'left',
                isEnabled: isEnabledVal,
                isVisible: isEnabledVal,
                isDraft: isDraftVal,
                isPublished: !isDraftVal,
                lastModified: Date.now()
            };

            // Asegurarnos de que el pdfUrl en updated use la versión protegida (no Base64 gigante)
            if (activeType === 'pdf_document' && updatedBtnAction.startsWith('pdf:indexeddb:')) {
                updated.pdfUrl = updatedBtnAction.replace('pdf:', '');
            }

            console.log('[COLUA ADMIN] Guardando item:', updated);
            await window.coluaRepo.saveContentItem(updated);
            console.log('[COLUA ADMIN] Guardado con éxito.');

            if (window.app && window.app.closeModal) {
                window.app.closeModal();
            }

            if (window.Swal) {
                Swal.fire({
                    title: isDraftVal ? "¡Guardado como Borrador!" : `¡${activeTypeName} Guardado!`,
                    text: `"${updated.title}" ha sido guardado exitosamente.`,
                    icon: "success",
                    timer: 1800,
                    showConfirmButton: false
                });
            } else {
                alert(`¡${updated.title} guardado con éxito!`);
            }

            await this.loadTabContent();

        } catch (err) {
            console.error('[COLUA ADMIN] Error al guardar:', err);
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = 'Guardar Documento PDF';
            }
            if (window.Swal) {
                Swal.fire({
                    title: 'Error al Guardar',
                    text: err.message || 'Ocurrió un error inesperado al guardar.',
                    icon: 'error'
                });
            } else {
                alert('Error al guardar: ' + err.message);
            }
        }
    }

    async showBlocksEditorModal(itemId) {
        const blocks = await coluaRepo.getContentBlocksByItem(itemId);
        
        const modalHtml = `
            <div>
                <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--colua-navy); margin-bottom: 8px;">
                    Editor de Bloques Atómicos
                </h3>
                <p style="font-size: 0.82rem; color: var(--colua-gray-600); margin-bottom: 16px;">
                    Agrega párrafos, listas de requisitos, alertas y destacados a este elemento.
                </p>

                <div id="blocks-list-container" style="max-height: 50vh; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
                    ${blocks.length === 0 ? '<p style="font-size: 0.85rem; color: var(--colua-gray-500); text-align: center;">No hay bloques todavía.</p>' : blocks.map(b => `
                        <div style="background: var(--colua-gray-50); padding: 10px; border-radius: 8px; border: 1px solid var(--colua-gray-200); display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                            <div>
                                <span class="badge" style="background: var(--colua-navy); color: white; font-size: 0.65rem; margin-bottom: 4px;">${b.blockType || 'Párrafo'}</span>
                                <div style="font-size: 0.85rem; color: var(--colua-gray-800);">${b.content || ''}</div>
                            </div>
                            <button class="btn btn-outline del-block-btn" data-id="${b.id}" style="padding: 4px 6px; font-size: 0.75rem; color: red; display: inline-flex; align-items: center;" title="Eliminar bloque">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                        </div>
                    `).join('')}
                </div>

                <!-- Formulario Agregar Bloque -->
                <div style="border-top: 1px solid var(--colua-gray-200); padding-top: 14px;">
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <select id="new-block-type" style="padding: 6px 10px; border: 1.5px solid var(--colua-gray-200); border-radius: 8px; font-size: 0.82rem;">
                            <option value="paragraph">Párrafo Normal</option>
                            <option value="bullet">Elemento de Lista / Requisito</option>
                            <option value="callout">Nota / Alerta Informativa</option>
                            <option value="highlight">Cifra / Destacado</option>
                        </select>
                    </div>
                    <textarea id="new-block-content" placeholder="Escribe el contenido del bloque..." rows="2" style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--colua-gray-200); border-radius: 8px; font-size: 0.85rem; margin-bottom: 10px;"></textarea>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <button class="btn btn-outline" onclick="app.closeModal()" style="font-size: 0.82rem;">Cerrar</button>
                        <button id="add-block-btn" class="btn btn-primary" style="font-size: 0.82rem; display: inline-flex; align-items: center; gap: 5px;">${ADMIN_ICONS.plus} <span>Agregar Bloque</span></button>
                    </div>
                </div>
            </div>
        `;

        app.showModal(modalHtml);

        document.getElementById('add-block-btn')?.addEventListener('click', async () => {
            const content = document.getElementById('new-block-content').value.trim();
            const blockType = document.getElementById('new-block-type').value;

            if (content) {
                await coluaRepo.saveContentBlock({
                    id: 'block_' + Date.now(),
                    itemId,
                    blockType,
                    content,
                    orderIndex: blocks.length + 1
                });
                app.showToast('Bloque agregado', 'success');
                this.showBlocksEditorModal(itemId);
            }
        });

        document.querySelectorAll('.del-block-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                await coluaRepo.deleteContentBlock(btn.dataset.id);
                this.showBlocksEditorModal(itemId);
            });
        });
    }

    // ==========================================
    // TAB 3: CENTRO DE CONTROL DE PUBLICACIÓN
    // ==========================================
    async renderTabSync(container) {
        this.syncStatus = await coluaRepo.getSyncStatus();

        container.innerHTML = `
            <div style="max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 18px;">
                <!-- Encabezado -->
                <div>
                    <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--colua-navy); margin: 0 0 4px 0;">
                        Centro de Control de Publicación
                    </h2>
                    <p style="font-size: 0.85rem; color: var(--colua-gray-600); margin: 0;">
                        Monitorea versiones, cambios pendientes, sincronización en vivo y publicaciones atómicas.
                    </p>
                </div>

                <!-- 1. Estado de Publicación -->
                <div class="card" style="background: white; border-radius: 14px; padding: 22px; box-shadow: var(--shadow-sm); border: 1px solid var(--colua-gray-200);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
                        <h3 style="font-size: 1.12rem; font-weight: 700; color: var(--colua-navy); margin: 0;">
                            Estado de Publicación
                        </h3>
                        <span class="badge" style="background: ${this.syncStatus.draftsCount > 0 ? '#fffbeb' : '#dcfce7'}; color: ${this.syncStatus.draftsCount > 0 ? '#b45309' : '#15803d'}; font-size: 0.8rem; font-weight: 700; padding: 4px 10px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px;">
                            <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:currentColor;"></span>
                            ${this.syncStatus.draftsCount > 0 ? 'Borradores pendientes de publicar' : `Todo publicado (${this.syncStatus.version})`}
                        </span>
                    </div>

                    <div style="font-size: 0.86rem; color: var(--colua-gray-700); line-height: 1.65; margin-bottom: 16px;">
                        <div><strong>Borrador local:</strong> ${this.syncStatus.version} | <strong>Publicada:</strong> ${this.syncStatus.publishedVersion}</div>
                        <div><strong>Última sync:</strong> ${this.syncStatus.lastPublishedAt ? new Date(this.syncStatus.lastPublishedAt).toLocaleString() : 'Reciente'}</div>
                        <div><strong>Pantallas:</strong> ${this.syncStatus.sectionsCount} | <strong>Elementos:</strong> ${this.syncStatus.itemsCount}</div>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid var(--colua-gray-100);">
                        <div>
                            <span style="font-size: 0.88rem; font-weight: 700; color: var(--colua-navy); display: block;">Sincronización en Tiempo Real (Cloud)</span>
                            <span style="font-size: 0.76rem; color: var(--colua-gray-500);">Actualiza cambios automáticamente a Firestore Cloud</span>
                        </div>
                        <label style="position: relative; display: inline-flex; align-items: center; width: 48px; height: 26px; cursor: pointer; user-select: none;">
                            <input type="checkbox" id="toggle-realtime-sync" ${this.syncStatus.isRealtimeEnabled !== false ? 'checked' : ''} style="opacity: 0; width: 0; height: 0; position: absolute;">
                            <span class="switch-slider" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: ${this.syncStatus.isRealtimeEnabled !== false ? 'var(--colua-green)' : '#cbd5e1'}; transition: 0.3s; border-radius: 26px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.15);">
                                <span class="switch-knob" style="position: absolute; content: ''; height: 20px; width: 20px; left: ${this.syncStatus.isRealtimeEnabled !== false ? '25px' : '3px'}; bottom: 3px; background-color: white; transition: 0.3s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.25);"></span>
                            </span>
                        </label>
                    </div>
                </div>

                <!-- 2. Cambios Pendientes de Publicar -->
                <div class="card" style="background: white; border-radius: 14px; padding: 22px; box-shadow: var(--shadow-sm); border: 1px solid var(--colua-gray-200);">
                    <h3 style="font-size: 1.12rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 14px 0;">
                        Cambios Pendientes de Publicar
                    </h3>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-bottom: 16px;">
                        <div style="background: #fffbeb; border: 1px solid #fef3c7; padding: 10px 14px; border-radius: 8px;">
                            <span style="font-size: 0.8rem; font-weight: 700; color: #b45309;">Pendientes: ${this.syncStatus.draftsCount}</span>
                        </div>
                        <div style="background: #f0fdf4; border: 1px solid #dcfce7; padding: 10px 14px; border-radius: 8px;">
                            <span style="font-size: 0.8rem; font-weight: 700; color: #15803d;">Nuevos: ${this.syncStatus.newCount}</span>
                        </div>
                        <div style="background: #eff6ff; border: 1px solid #dbeafe; padding: 10px 14px; border-radius: 8px;">
                            <span style="font-size: 0.8rem; font-weight: 700; color: #1d4ed8;">Editados: ${this.syncStatus.editCount}</span>
                        </div>
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 14px; border-radius: 8px;">
                            <span style="font-size: 0.8rem; font-weight: 700; color: #64748b;">Incompletos: ${this.syncStatus.incompleteCount}</span>
                        </div>
                    </div>

                    <div style="background: #f8fafc; border-radius: 8px; padding: 12px 14px; margin-bottom: 16px; font-size: 0.82rem; color: var(--colua-gray-600);">
                        <strong>Actividad reciente:</strong><br/>
                        ${this.syncStatus.draftsCount === 0 ? `• No hay cambios pendientes. La versión publicada ${this.syncStatus.version} está actualizada.` : `• Hay ${this.syncStatus.draftsCount} cambios en borrador listos para desplegar a producción.`}
                    </div>

                    <button id="btn-review-changes" class="btn btn-outline" style="width: 100%; padding: 10px; font-size: 0.88rem; font-weight: 600; color: var(--colua-navy); border-color: var(--colua-navy);">
                        Revisar Detalle de Cambios
                    </button>
                </div>

                <!-- 3. Borrador Local y Vista Previa -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                    <!-- Card Borrador Local -->
                    <div class="card" style="background: white; border-radius: 14px; padding: 20px; box-shadow: var(--shadow-sm); border: 1px solid var(--colua-gray-200); display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <h4 style="font-size: 1.02rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 6px 0;">
                                Borrador Local del Administrador
                            </h4>
                            <p style="font-size: 0.82rem; color: var(--colua-gray-600); margin: 0 0 16px 0; line-height: 1.45;">
                                Los borradores se guardan en este dispositivo y no son visibles para los usuarios hasta que se publiquen.
                            </p>
                        </div>
                        <button id="btn-save-local-draft" class="btn btn-outline" style="width: 100%; padding: 9px; font-size: 0.85rem; font-weight: 600; color: var(--colua-navy); border-color: var(--colua-navy);">
                            Guardar Borrador Local
                        </button>
                    </div>

                    <!-- Card Vista Previa -->
                    <div class="card" style="background: white; border-radius: 14px; padding: 20px; box-shadow: var(--shadow-sm); border: 1px solid var(--colua-gray-200); display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <h4 style="font-size: 1.02rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 6px 0;">
                                Vista Previa General Interactiva
                            </h4>
                            <p style="font-size: 0.82rem; color: var(--colua-gray-600); margin: 0 0 16px 0; line-height: 1.45;">
                                Navega por toda la aplicación tal como la verá el usuario público, cargando todos tus cambios en borrador en vivo.
                            </p>
                        </div>
                        <button id="btn-open-preview-live" class="btn" style="width: 100%; padding: 10px; font-size: 0.88rem; font-weight: 700; background: var(--colua-orange); color: white; border: none; border-radius: 10px;">
                            Abrir Vista Previa General
                        </button>
                    </div>
                </div>

                <!-- 4. Publicación Masiva -->
                <div class="card" style="background: white; border-radius: 14px; padding: 22px; box-shadow: var(--shadow-sm); border: 1.5px solid var(--colua-navy);">
                    <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 6px 0;">
                        Publicación Masiva
                    </h3>
                    <p style="font-size: 0.84rem; color: var(--colua-gray-600); margin: 0 0 16px 0; line-height: 1.45;">
                        Envía de una sola vez todos los borradores pendientes a la nube para hacerlos visibles a todos los asociados.
                    </p>
                    <button id="publish-all-cloud-btn" class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 0.95rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
                        ${ADMIN_ICONS.sync} <span>Publicar Todos los Cambios</span>
                    </button>
                </div>

                <!-- 5. Acciones Avanzadas de Restauración e Integridad -->
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <span style="font-size: 0.76rem; font-weight: 700; color: var(--colua-gray-500); text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 6px;">
                        ${ADMIN_ICONS.shieldCheck} Acciones Avanzadas de Restauración e Integridad
                    </span>

                    <!-- Verificación e Integridad -->
                    <div class="card" style="background: white; border-radius: 12px; padding: 16px 20px; box-shadow: var(--shadow-sm); border: 1px solid var(--colua-gray-200); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                        <div>
                            <h4 style="font-size: 0.98rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 3px 0;">
                                Verificación e Integridad
                            </h4>
                            <p style="font-size: 0.8rem; color: var(--colua-gray-600); margin: 0;">
                                Compara la versión local publicada con el servidor para confirmar integridad sin modificar contenido.
                            </p>
                        </div>
                        <button id="btn-verify-integrity" class="btn btn-outline" style="padding: 7px 16px; font-size: 0.82rem; font-weight: 600; color: var(--colua-navy); border-color: var(--colua-navy); flex-shrink: 0;">
                            Verificar Publicación
                        </button>
                    </div>

                    <!-- Reversión de Versión (Rollback) -->
                    <div class="card" style="background: #f0f9ff; border-radius: 12px; padding: 16px 20px; border: 1px solid #bae6fd; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                        <div>
                            <h4 style="font-size: 0.98rem; font-weight: 700; color: #0369a1; margin: 0 0 3px 0;">
                                Reversión de Versión (Rollback)
                            </h4>
                            <p style="font-size: 0.8rem; color: #0c4a6e; margin: 0;">
                                Restablecer la última versión estable aprobada ante cualquier contingencia.
                            </p>
                        </div>
                        <button id="btn-rollback-version" class="btn" style="padding: 7px 18px; font-size: 0.82rem; font-weight: 600; background: #0284c7; color: white; border: none; flex-shrink: 0; border-radius: 8px;">
                            Revertir
                        </button>
                    </div>

                    <!-- Restaurar Datos Iniciales -->
                    <div class="card" style="background: #fef2f2; border-radius: 12px; padding: 16px 20px; border: 1px solid #fecaca; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                        <div>
                            <h4 style="font-size: 0.98rem; font-weight: 700; color: #b91c1c; margin: 0 0 3px 0;">
                                Restaurar Datos Iniciales
                            </h4>
                            <p style="font-size: 0.8rem; color: #7f1d1d; margin: 0;">
                                Reinicio de fábrica del contenido CMS con los datos oficiales de COLUA MICOOPE.
                            </p>
                        </div>
                        <button id="btn-factory-reset" class="btn" style="padding: 7px 18px; font-size: 0.82rem; font-weight: 600; background: #dc2626; color: white; border: none; flex-shrink: 0; border-radius: 8px;">
                            Restaurar
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Evento Sincronización en Tiempo Real (Cloud)
        const toggleSync = container.querySelector('#toggle-realtime-sync');
        if (toggleSync) {
            toggleSync.addEventListener('change', async (e) => {
                const isChecked = e.target.checked;
                const slider = toggleSync.nextElementSibling;
                const knob = slider ? slider.querySelector('.switch-knob') : null;
                if (slider) slider.style.backgroundColor = isChecked ? 'var(--colua-green)' : '#cbd5e1';
                if (knob) knob.style.left = isChecked ? '25px' : '3px';

                await coluaRepo.updateGlobalConfig({ is_realtime_sync: isChecked });
                Swal.fire({
                    title: isChecked ? "Sincronización Cloud Activada" : "Sincronización Cloud Pausada",
                    text: isChecked ? "Los cambios se sincronizarán en vivo con Firestore Cloud." : "Los cambios se guardarán localmente hasta publicar.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                    draggable: true
                });
            });
        }

        // Evento Guardar Borrador Local
        container.querySelector('#btn-save-local-draft')?.addEventListener('click', () => {
            Swal.fire({
                title: "Borrador Guardado",
                text: "Todos los cambios locales han sido respaldados en el almacenamiento seguro de tu navegador.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                draggable: true
            });
        });

        // Evento Abrir Vista Previa General
        container.querySelector('#btn-open-preview-live')?.addEventListener('click', async () => {
            if (window.Swal) {
                await Swal.fire({
                    title: "Modo Vista Previa General",
                    text: "Estás ingresando a la aplicación pública para visualizar todos los cambios en borrador en vivo.",
                    icon: "info",
                    timer: 1500,
                    showConfirmButton: false,
                    draggable: true
                });
            }
            window.location.hash = '#inicio';
        });

        // Evento Revisar Detalle de Cambios
        container.querySelector('#btn-review-changes')?.addEventListener('click', () => {
            const list = this.syncStatus.pendingList || [];
            const modalHtml = `
                <div style="max-width: 500px; width: 100%;">
                    <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--colua-navy); margin-bottom: 6px;">
                        Detalle de Cambios en Borrador
                    </h3>
                    <p style="font-size: 0.82rem; color: var(--colua-gray-600); margin-bottom: 16px;">
                        Elementos pendientes de publicación a producción:
                    </p>

                    <div style="max-height: 48vh; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
                        ${list.length === 0 ? '<p style="text-align: center; color: var(--colua-gray-500); padding: 20px;">No hay cambios pendientes de publicar.</p>' : list.map(item => `
                            <div style="padding: 10px 12px; background: #f8fafc; border-radius: 8px; border: 1px solid var(--colua-gray-200); display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <span class="badge" style="background: rgba(23, 55, 137, 0.08); color: var(--colua-navy); font-size: 0.7rem; margin-bottom: 3px; display: inline-block;">${item.type}</span>
                                    <strong style="display: block; font-size: 0.88rem; color: var(--colua-navy);">${item.title}</strong>
                                </div>
                                <span class="badge" style="background: #fef3c7; color: #b45309; font-size: 0.72rem; font-weight: 700;">${item.status}</span>
                            </div>
                        `).join('')}
                    </div>

                    <div style="text-align: right; border-top: 1px solid var(--colua-gray-200); padding-top: 12px;">
                        <button class="btn btn-outline" onclick="app.closeModal()">Cerrar</button>
                    </div>
                </div>
            `;
            app.showModal(modalHtml);
        });

        // Evento Publicar Todos los Cambios
        container.querySelector('#publish-all-cloud-btn')?.addEventListener('click', async () => {
            const confirmRes = await Swal.fire({
                title: "¿Publicar Cambios a Producción?",
                text: "Todos los asociados y visitantes de la aplicación verán inmediatamente la nueva versión.",
                icon: "question",
                draggable: true,
                showCancelButton: true,
                confirmButtonColor: "#173789",
                cancelButtonColor: "#64748b",
                confirmButtonText: "Sí, Publicar Ahora",
                cancelButtonText: "Cancelar"
            });

            if (confirmRes.isConfirmed) {
                Swal.fire({
                    title: "Publicando...",
                    text: "Sincronizando secciones, tarjetas y bloques a Firestore Cloud",
                    allowOutsideClick: false,
                    didOpen: () => { Swal.showLoading(); }
                });

                const res = await coluaRepo.publishCurrentConfiguration();

                if (res.success) {
                    Swal.fire({
                        title: "¡Publicación Exitosa!",
                        text: `Se ha publicado la versión ${res.version} correctamente a toda la plataforma.`,
                        icon: "success",
                        timer: 1800,
                        showConfirmButton: false,
                        draggable: true
                    });
                    await this.loadTabContent();
                } else {
                    Swal.fire({
                        title: "Error al Publicar",
                        text: res.error || "Ocurrió un problema durante la sincronización con Firestore Cloud.",
                        icon: "error",
                        showConfirmButton: true,
                        confirmButtonColor: "#173789",
                        confirmButtonText: "Entendido",
                        draggable: true
                    });
                }
            }
        });

        // Evento Verificar Integridad
        container.querySelector('#btn-verify-integrity')?.addEventListener('click', async () => {
            const ver = await coluaRepo.verifyPublicationIntegrity();
            Swal.fire({
                title: "Integridad Verificada: " + ver.integrity,
                html: `
                    <div style="text-align: left; font-size: 0.88rem; line-height: 1.7; padding: 8px 12px; background: #f8fafc; border-radius: 8px;">
                        <div><strong>Versión actual:</strong> ${ver.version}</div>
                        <div><strong>Pantallas locales:</strong> ${ver.localSections}</div>
                        <div><strong>Tarjetas de contenido:</strong> ${ver.localItems}</div>
                        <div><strong>Bloques atómicos:</strong> ${ver.localBlocks}</div>
                        <div><strong>Conexión Firestore Cloud:</strong> ${ver.cloudConnected ? 'Conectado y Sincronizado' : 'Modo Local / Offline'}</div>
                    </div>
                `,
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
                draggable: true
            });
        });

        // Evento Revertir Versión (Rollback)
        container.querySelector('#btn-rollback-version')?.addEventListener('click', async () => {
            const confirmRes = await Swal.fire({
                title: "¿Revertir a la versión anterior?",
                text: "Se restaurará el snapshot previo a la última publicación masiva.",
                icon: "warning",
                draggable: true,
                showCancelButton: true,
                confirmButtonColor: "#0284c7",
                cancelButtonColor: "#64748b",
                confirmButtonText: "Sí, Revertir",
                cancelButtonText: "Cancelar"
            });

            if (confirmRes.isConfirmed) {
                const res = await coluaRepo.rollbackToPreviousVersion();
                if (res.success) {
                    Swal.fire({
                        title: "¡Versión Revertida!",
                        text: `Se ha restablecido la plataforma a la versión ${res.version}.`,
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                        draggable: true
                    });
                    await this.loadTabContent();
                } else {
                    Swal.fire({
                        title: "No se pudo revertir",
                        text: res.error || "No hay respaldo previo registrado.",
                        icon: "info",
                        timer: 2000,
                        showConfirmButton: false,
                        draggable: true
                    });
                }
            }
        });

        // Evento Restaurar Datos Iniciales (Factory Reset)
        container.querySelector('#btn-factory-reset')?.addEventListener('click', async () => {
            const confirmRes = await Swal.fire({
                title: "¿Restaurar Datos de Fábrica?",
                text: "Esta acción reiniciará todas las secciones, productos y tarjetas a sus valores predeterminados de la cooperativa. (Los usuarios se conservarán).",
                icon: "warning",
                draggable: true,
                showCancelButton: true,
                confirmButtonColor: "#dc2626",
                cancelButtonColor: "#64748b",
                confirmButtonText: "Sí, Restaurar Todo",
                cancelButtonText: "Cancelar"
            });

            if (confirmRes.isConfirmed) {
                await coluaRepo.resetToFactoryDefaults();
                Swal.fire({
                    title: "¡Contenidos Restaurados!",
                    text: "Se han reestablecido los datos oficiales de fábrica de COLUA MICOOPE.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                    draggable: true
                });
                await this.loadTabContent();
            }
        });
    }

    // ==========================================
    // TAB 4: USUARIOS Y ROLES (RBAC)
    // ==========================================
    async renderTabRBAC(container) {
        this.users = await coluaRepo.getAllUsers();
        const isSuper = authService.isSuperAdmin();

        container.innerHTML = `
            ${isSuper ? `
                <!-- Panel Superior para Super Admin: Clave Universal y Autorización de Roles -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; margin-bottom: 24px;">
                    <!-- Card 1: Cambio de Clave Universal Institucional -->
                    <div class="card" style="background: white; border-top: 4px solid var(--colua-gold); padding: 20px; box-shadow: var(--shadow-sm);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                            <div>
                                <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 4px 0; display: inline-flex; align-items: center; gap: 6px;">
                                    ${ADMIN_ICONS.key} <span>Clave Universal Institucional</span>
                                </h3>
                                <p style="font-size: 0.78rem; color: var(--colua-gray-600); margin: 0;">
                                    Acceso maestro universal. Cámbiala aquí para invalidar claves anteriores.
                                </p>
                            </div>
                            <span class="badge" style="background: rgba(239, 136, 25, 0.15); color: #b75e00; font-size: 0.7rem; font-weight: 700;">
                                SHA-256
                            </span>
                        </div>

                        <form id="form-change-master-key">
                            <div class="form-group" style="margin-bottom: 10px;">
                                <label style="display: block; font-size: 0.78rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">
                                    Clave Universal Actual
                                </label>
                                <input type="password" id="input-curr-master-key" required placeholder="••••••••••••••••"
                                    style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--colua-gray-200); border-radius: 8px; font-size: 0.85rem; letter-spacing: 2px;" />
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px;">
                                <div class="form-group">
                                    <label style="display: block; font-size: 0.78rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">
                                        Nueva Clave
                                    </label>
                                    <input type="password" id="input-new-master-key" required placeholder="••••••••••••••••"
                                        style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--colua-gray-200); border-radius: 8px; font-size: 0.85rem; letter-spacing: 2px;" />
                                </div>
                                <div class="form-group">
                                    <label style="display: block; font-size: 0.78rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">
                                        Confirmar Clave
                                    </label>
                                    <input type="password" id="input-confirm-master-key" required placeholder="••••••••••••••••"
                                        style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--colua-gray-200); border-radius: 8px; font-size: 0.85rem; letter-spacing: 2px;" />
                                </div>
                            </div>

                            <button type="submit" id="btn-save-master-key" class="btn btn-primary" style="width: 100%; padding: 9px; font-size: 0.84rem; font-weight: 600;">
                                Actualizar Clave Universal
                            </button>
                        </form>
                    </div>

                    <!-- Card 2: Autorizar Nuevo Administrador o Manager -->
                    <div class="card" style="background: white; border-top: 4px solid var(--colua-navy); padding: 20px; box-shadow: var(--shadow-sm);">
                        <div style="margin-bottom: 12px;">
                            <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 4px 0; display: inline-flex; align-items: center; gap: 6px;">
                                ${ADMIN_ICONS.plus} <span>Autorizar Administrador / Manager</span>
                            </h3>
                            <p style="font-size: 0.78rem; color: var(--colua-gray-600); margin: 0;">
                                Otorga credenciales específicas a colaboradores institucionales.
                            </p>
                        </div>

                        <form id="form-add-admin-manager">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
                                <div class="form-group">
                                    <label style="display: block; font-size: 0.78rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">
                                        Nombre Completo
                                    </label>
                                    <input type="text" id="input-new-admin-name" required placeholder="ej: Lic. Carlos Gómez"
                                        style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--colua-gray-200); border-radius: 8px; font-size: 0.85rem;" />
                                </div>
                                <div class="form-group">
                                    <label style="display: block; font-size: 0.78rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">
                                        Correo Institucional
                                    </label>
                                    <input type="email" id="input-new-admin-email" required placeholder="ej: cgomez@colua.com.gt"
                                        style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--colua-gray-200); border-radius: 8px; font-size: 0.85rem;" />
                                </div>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px;">
                                <div class="form-group">
                                    <label style="display: block; font-size: 0.78rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">
                                        Rol Asignado
                                    </label>
                                    <select id="select-new-admin-role" style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--colua-gray-200); border-radius: 8px; font-size: 0.85rem;">
                                        <option value="manager">Manager (Contenidos / Medios)</option>
                                        <option value="admin">Administrador (Operativo)</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label style="display: block; font-size: 0.78rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">
                                        Contraseña Inicial
                                    </label>
                                    <input type="password" id="input-new-admin-pass" required placeholder="••••••••••••••••"
                                        style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--colua-gray-200); border-radius: 8px; font-size: 0.85rem; letter-spacing: 2px;" />
                                </div>
                            </div>

                            <button type="submit" class="btn" style="width: 100%; padding: 9px; font-size: 0.84rem; font-weight: 600; background: var(--colua-navy); color: white; border: none; border-radius: 8px;">
                                Registrar y Autorizar Cuenta
                            </button>
                        </form>
                    </div>
                </div>
            ` : `
                <!-- Aviso para Manager / Admin con permisos operativos -->
                <div class="card" style="background: rgba(23, 55, 137, 0.05); border-left: 4px solid var(--colua-navy); padding: 14px 18px; margin-bottom: 20px;">
                    <span style="font-size: 0.85rem; color: var(--colua-navy); font-weight: 600; display: inline-flex; align-items: center; gap: 8px;">
                        ${ADMIN_ICONS.shieldCheck} <span>Modo Operativo: Tu cuenta posee permisos de gestión de contenidos y auditoría. La Clave Universal Institucional y la asignación de roles están gestionadas exclusivamente por el Super Administrador.</span>
                    </span>
                </div>
            `}

            <!-- Listado y Tabla de Usuarios y Roles con Búsqueda Ampliada y Paginación -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 16px;">
                <div>
                    <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 3px 0;">
                        Control de Accesos Basado en Roles (RBAC)
                    </h2>
                    <span id="rbac-user-count-label" style="font-size: 0.84rem; color: var(--colua-gray-500);">${this.users.length} cuentas registradas en el sistema</span>
                </div>
                <div style="display: flex; gap: 10px; align-items: center; flex: 1; max-width: 680px; justify-content: flex-end; flex-wrap: wrap;">
                    ${isSuper ? `
                        <button id="btn-reset-user-counter" class="btn" style="background: rgba(239, 68, 68, 0.08); border: 1.5px solid #f87171; color: #dc2626; padding: 9px 14px; border-radius: 10px; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;" title="Reinicia el contador correlativo para que el próximo asociado inicie en 0000001">
                            ${ADMIN_ICONS.refresh} Reiniciar a 0000001
                        </button>
                    ` : ''}
                    <div style="flex: 1; min-width: 260px; position: relative; display: flex; align-items: center;">
                        <span style="position: absolute; left: 14px; display: flex; align-items: center; pointer-events: none; color: var(--colua-gray-400);">
                            ${ADMIN_ICONS.search}
                        </span>
                        <input type="text" id="user-rbac-search" value="${this.userSearchFilter || ''}" placeholder="Buscar por nombre, correo, DPI o No. Asociado..." 
                            style="width: 100%; padding: 11px 18px 11px 40px; border: 1.5px solid var(--colua-gray-300); border-radius: 12px; font-size: 0.92rem; box-shadow: var(--shadow-sm); outline: none; background: white; transition: all 0.2s ease;" />
                    </div>
                </div>
            </div>

            <div class="card" style="padding: 0; overflow: hidden; background: white; box-shadow: var(--shadow-sm); border: 1px solid var(--colua-gray-200); border-radius: 12px;">
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.86rem;">
                        <thead style="background: var(--colua-gray-50); border-bottom: 1.5px solid var(--colua-gray-200); color: var(--colua-gray-700);">
                            <tr>
                                <th style="padding: 12px 16px;">Usuario / Nombre</th>
                                <th style="padding: 12px 16px;">Correo</th>
                                <th style="padding: 12px 16px;">DPI / CUI</th>
                                <th style="padding: 12px 16px;">No. Asociado</th>
                                <th style="padding: 12px 16px;">Rol Asignado</th>
                                <th style="padding: 12px 16px; text-align: right;">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="rbac-users-tbody">
                            <!-- Filas paginadas generadas por updateUserTable -->
                        </tbody>
                    </table>
                </div>

                <!-- Barra de Paginación Obligatoria (Mínimo 10 por página) -->
                <div id="rbac-pagination-bar" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; border-top: 1px solid var(--colua-gray-200); background: #fafbfc; flex-wrap: wrap; gap: 10px;">
                    <div id="rbac-pagination-info" style="font-size: 0.84rem; color: var(--colua-gray-600); font-weight: 500;">
                        Cargando usuarios...
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button id="rbac-prev-page" class="btn" style="padding: 6px 14px; font-size: 0.82rem; font-weight: 600; border-radius: 8px; border: 1.5px solid var(--colua-gray-300); background: white; color: var(--colua-navy); cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                            ${ADMIN_ICONS.chevronLeft} <span>Anterior</span>
                        </button>
                        <span id="rbac-page-indicator" style="font-size: 0.84rem; font-weight: 700; color: var(--colua-navy); padding: 0 8px;">
                            Página 1 de 1
                        </span>
                        <button id="rbac-next-page" class="btn" style="padding: 6px 14px; font-size: 0.82rem; font-weight: 600; border-radius: 8px; border: 1.5px solid var(--colua-gray-300); background: white; color: var(--colua-navy); cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                            <span>Siguiente</span> ${ADMIN_ICONS.chevronRight}
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Formulario Cambio de Clave Universal
        const formChangeKey = container.querySelector('#form-change-master-key');
        if (formChangeKey) {
            formChangeKey.addEventListener('submit', async (e) => {
                e.preventDefault();
                const currKey = container.querySelector('#input-curr-master-key').value.trim();
                const newKey = container.querySelector('#input-new-master-key').value.trim();
                const confirmKey = container.querySelector('#input-confirm-master-key').value.trim();

                const isCurrentValid = await authService.checkAdminMasterPassword(currKey);
                if (!isCurrentValid) {
                    Swal.fire({
                        title: "Error de Clave",
                        text: "La Clave Universal actual es incorrecta",
                        icon: "error",
                        draggable: true,
                        confirmButtonColor: "#173789"
                    });
                    return;
                }

                if (newKey.length < 4) {
                    Swal.fire({
                        title: "Clave muy corta",
                        text: "La nueva clave debe tener al menos 4 caracteres",
                        icon: "warning",
                        draggable: true,
                        confirmButtonColor: "#173789"
                    });
                    return;
                }

                if (newKey !== confirmKey) {
                    Swal.fire({
                        title: "No coinciden",
                        text: "La nueva clave y su confirmación no coinciden",
                        icon: "error",
                        draggable: true,
                        confirmButtonColor: "#173789"
                    });
                    return;
                }

                const res = await authService.updateMasterPassword(newKey);
                if (res.success) {
                    Swal.fire({
                        title: "¡Clave Actualizada!",
                        text: "La Clave Universal Institucional se ha actualizado exitosamente",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                        draggable: true
                    });
                    formChangeKey.reset();
                } else {
                    Swal.fire({
                        title: "Error",
                        text: res.error || 'Error al actualizar clave',
                        icon: "error",
                        draggable: true,
                        confirmButtonColor: "#173789"
                    });
                }
            });
        }

        // Formulario Alta Nuevo Admin / Manager
        const formAddAdmin = container.querySelector('#form-add-admin-manager');
        if (formAddAdmin) {
            formAddAdmin.addEventListener('submit', async (e) => {
                e.preventDefault();
                const nombre = container.querySelector('#input-new-admin-name').value.trim();
                const email = container.querySelector('#input-new-admin-email').value.trim();
                const role = container.querySelector('#select-new-admin-role').value;
                const password = container.querySelector('#input-new-admin-pass').value;

                const res = await coluaRepo.addAdminOrManager({ nombre, email, role, password });
                if (res.success) {
                    Swal.fire({
                        title: "¡Usuario Registrado!",
                        text: `${role.toUpperCase()} ${nombre} registrado exitosamente con ID ${res.associateId}`,
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                        draggable: true
                    });
                    formAddAdmin.reset();
                    this.users = await coluaRepo.getAllUsers();
                    this.updateUserTable(container, isSuper);
                } else {
                    Swal.fire({
                        title: "Error al Registrar",
                        text: res.error || 'Error al registrar usuario administrativo',
                        icon: "error",
                        draggable: true,
                        confirmButtonColor: "#173789"
                    });
                }
            });
        }

        // Búsqueda de usuarios
        const searchInput = container.querySelector('#user-rbac-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.userSearchFilter = e.target.value.toLowerCase().trim();
                this.userCurrentPage = 1; // reset a la primera página al buscar
                this.updateUserTable(container, isSuper);
            });
        }

        // Botón Reiniciar Contador a 0000001
        const resetCounterBtn = container.querySelector('#btn-reset-user-counter');
        if (resetCounterBtn) {
            resetCounterBtn.addEventListener('click', async () => {
                const res = await Swal.fire({
                    title: '¿Reiniciar Contador a 0000001?',
                    text: 'Esta acción purgará los registros de prueba residuales y reiniciará el contador correlativo oficial para que el próximo registro comience exactamente en 0000001.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#dc2626',
                    cancelButtonColor: '#64748b',
                    confirmButtonText: 'Sí, reiniciar a 0000001',
                    cancelButtonText: 'Cancelar'
                });

                if (res.isConfirmed) {
                    Swal.fire({
                        title: 'Reiniciando...',
                        text: 'Purgando referencias y restableciendo contador en Firestore...',
                        allowOutsideClick: false,
                        didOpen: () => Swal.showLoading()
                    });

                    await coluaRepo.purgeAllTestUsersAndResetCounter();

                    this.users = await coluaRepo.getAllUsers();
                    this.updateUserTable(container, isSuper);

                    const countLabel = container.querySelector('#rbac-user-count-label');
                    if (countLabel) countLabel.textContent = `${this.users.length} cuentas registradas en el sistema`;

                    Swal.fire({
                        title: '¡Contador Reiniciado!',
                        text: 'El contador correlativo ha quedado en 0. Tu próximo registro recibirá el No. de Asociado 0000001.',
                        icon: 'success',
                        draggable: true,
                        confirmButtonColor: '#173789'
                    });
                }
            });
        }

        // Controles de Paginación
        const prevBtn = container.querySelector('#rbac-prev-page');
        const nextBtn = container.querySelector('#rbac-next-page');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.userCurrentPage > 1) {
                    this.userCurrentPage--;
                    this.updateUserTable(container, isSuper);
                }
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const filtered = this.getFilteredUsers();
                const totalPages = Math.max(1, Math.ceil(filtered.length / this.userPageSize));
                if (this.userCurrentPage < totalPages) {
                    this.userCurrentPage++;
                    this.updateUserTable(container, isSuper);
                }
            });
        }

        // Renderizado inicial de la tabla con paginación
        this.updateUserTable(container, isSuper);
    }

    getFilteredUsers() {
        const q = (this.userSearchFilter || '').toLowerCase().trim();
        if (!q) return this.users;
        return this.users.filter(u => 
            (u.nombre || '').toLowerCase().includes(q) ||
            (u.email || '').toLowerCase().includes(q) ||
            (u.dpi || '').includes(q) ||
            (u.associateId || '').includes(q) ||
            (u.idNumerico && String(u.idNumerico).padStart(7, '0').includes(q))
        );
    }

    updateUserTable(container, isSuper = true) {
        const filtered = this.getFilteredUsers();
        const totalUsers = filtered.length;
        const totalPages = Math.max(1, Math.ceil(totalUsers / this.userPageSize));

        if (this.userCurrentPage > totalPages) {
            this.userCurrentPage = totalPages;
        }
        if (this.userCurrentPage < 1) {
            this.userCurrentPage = 1;
        }

        const startIndex = (this.userCurrentPage - 1) * this.userPageSize;
        const endIndex = Math.min(startIndex + this.userPageSize, totalUsers);
        const pageUsers = filtered.slice(startIndex, endIndex);

        const tbody = container.querySelector('#rbac-users-tbody') || document.getElementById('rbac-users-tbody');
        if (tbody) {
            tbody.innerHTML = this.renderUserRows(pageUsers, isSuper);
        }

        const info = container.querySelector('#rbac-pagination-info') || document.getElementById('rbac-pagination-info');
        if (info) {
            if (totalUsers === 0) {
                info.innerHTML = `Mostrando <strong>0</strong> usuarios`;
            } else {
                info.innerHTML = `Mostrando <strong>${startIndex + 1} - ${endIndex}</strong> de <strong>${totalUsers}</strong> usuarios registrados`;
            }
        }

        const indicator = container.querySelector('#rbac-page-indicator') || document.getElementById('rbac-page-indicator');
        if (indicator) {
            indicator.textContent = `Página ${this.userCurrentPage} de ${totalPages}`;
        }

        const prevBtn = container.querySelector('#rbac-prev-page') || document.getElementById('rbac-prev-page');
        const nextBtn = container.querySelector('#rbac-next-page') || document.getElementById('rbac-next-page');
        if (prevBtn) {
            prevBtn.disabled = this.userCurrentPage <= 1;
            prevBtn.style.opacity = this.userCurrentPage <= 1 ? '0.45' : '1';
            prevBtn.style.cursor = this.userCurrentPage <= 1 ? 'not-allowed' : 'pointer';
        }
        if (nextBtn) {
            nextBtn.disabled = this.userCurrentPage >= totalPages;
            nextBtn.style.opacity = this.userCurrentPage >= totalPages ? '0.45' : '1';
            nextBtn.style.cursor = this.userCurrentPage >= totalPages ? 'not-allowed' : 'pointer';
        }

        this.bindUserRowEvents();
    }

    renderUserRows(usersList, isSuper = true) {
        if (usersList.length === 0) {
            return `<tr><td colspan="6" style="padding: 30px; text-align: center; color: var(--colua-gray-500);">No se encontraron usuarios coincidentes.</td></tr>`;
        }

        return usersList.map(u => {
            const role = (u.tipoUsuario || u.role || 'invitado').toLowerCase();
            const badgeBg = role === 'admin' || role === 'superadmin'
                ? 'var(--colua-navy)' 
                : (role === 'asociado' || role === 'socio'
                    ? 'var(--colua-green)' 
                    : (role === 'manager' 
                        ? '#634794' 
                        : 'var(--colua-gray-200)'));
            const badgeColor = (role === 'superadmin' || role === 'admin' || role === 'manager' || role === 'asociado' || role === 'socio') ? 'white' : 'var(--colua-gray-800)';
            const formattedId = u.idNumerico ? String(u.idNumerico).padStart(7, '0') : (u.associateId || u.userId || 'N/A');

            return `
                <tr style="border-bottom: 1px solid var(--colua-gray-100); transition: background-color 0.15s ease;" onmouseover="this.style.backgroundColor='#f8fafc'" onmouseout="this.style.backgroundColor='transparent'">
                    <td style="padding: 12px 16px; font-weight: 600; color: var(--colua-navy);">${u.nombre || 'Sin nombre'}</td>
                    <td style="padding: 12px 16px; color: var(--colua-gray-600); font-size: 0.82rem;">${u.email || 'N/A'}</td>
                    <td style="padding: 12px 16px; font-family: monospace; font-size: 0.82rem;">${u.dpi || 'N/A'}</td>
                    <td style="padding: 12px 16px; font-family: monospace; font-weight: 700; color: var(--colua-navy);">${formattedId}</td>
                    <td style="padding: 12px 16px;">
                        <span class="badge" style="background: ${badgeBg}; color: ${badgeColor}; font-size: 0.75rem; text-transform: uppercase;">
                            ${role}
                        </span>
                    </td>
                    <td style="padding: 12px 16px; text-align: right; white-space: nowrap;">
                        ${isSuper ? `
                            <div style="display: inline-flex; align-items: center; gap: 6px; justify-content: flex-end;">
                                <select class="change-user-role-select" data-uid="${u.docId || u.id || u.uid || u.firebaseUid || u.associateId}" style="padding: 5px 8px; border: 1.5px solid var(--colua-gray-300); border-radius: 6px; font-size: 0.78rem; background: white; cursor: pointer;">
                                    <option value="INVITADO" ${role === 'invitado' ? 'selected' : ''}>Invitado</option>
                                    <option value="ASOCIADO" ${role === 'asociado' || role === 'socio' ? 'selected' : ''}>Asociado</option>
                                    <option value="MANAGER" ${role === 'manager' ? 'selected' : ''}>Manager</option>
                                    <option value="ADMIN" ${role === 'admin' || role === 'superadmin' ? 'selected' : ''}>Administrador</option>
                                </select>
                                <button class="btn-edit-user" data-uid="${u.docId || u.id || u.uid || u.firebaseUid || u.associateId}" style="padding: 5px 10px; background: rgba(23, 55, 137, 0.08); color: var(--colua-navy); border: 1px solid rgba(23, 55, 137, 0.25); border-radius: 6px; font-size: 0.78rem; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; font-weight: 600; transition: all 0.2s ease;" title="Editar datos y restablecer contraseña">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Editar
                                </button>
                                <button class="btn-delete-user" data-uid="${u.docId || u.id || u.uid || u.firebaseUid || u.associateId}" data-name="${(u.nombre || u.email || 'este usuario').replace(/"/g, '&quot;')}" style="padding: 5px 10px; background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; border-radius: 6px; font-size: 0.78rem; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; font-weight: 600; transition: all 0.2s ease;" onmouseover="this.style.background='#fecaca'" onmouseout="this.style.background='#fee2e2'" title="Eliminar usuario">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Eliminar
                                </button>
                            </div>
                        ` : `
                            <span style="font-size: 0.75rem; color: var(--colua-gray-400);">Solo lectura</span>
                        `}
                    </td>
                </tr>
            `;
        }).join('');
    }

    bindUserRowEvents() {
        document.querySelectorAll('.change-user-role-select').forEach(sel => {
            sel.addEventListener('change', async () => {
                const uid = sel.dataset.uid;
                const newRole = sel.value;
                await coluaRepo.updateUserRole(uid, newRole);
                Swal.fire({
                    title: "Rol Actualizado",
                    text: `El usuario ahora tiene el rol: ${newRole}`,
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                    draggable: true
                });
                this.users = await coluaRepo.getAllUsers();
                const container = document.getElementById('admin-tab-users') || document;
                this.updateUserTable(container, true);
            });
        });

        // Evento Editar Usuario / Restablecer Clave
        document.querySelectorAll('.btn-edit-user').forEach(btn => {
            btn.addEventListener('click', () => {
                const uid = btn.dataset.uid;
                const user = this.users.find(u => 
                    u.docId === uid || u.uid === uid || u.id === uid || u.firebaseUid === uid || u.associateId === uid
                );
                if (user) {
                    this.showEditUserModal(user);
                }
            });
        });

        document.querySelectorAll('.btn-delete-user').forEach(btn => {
            btn.addEventListener('click', async () => {
                const uid = btn.dataset.uid;
                const name = btn.dataset.name;
                const confirmRes = await Swal.fire({
                    title: "¿Eliminar Usuario?",
                    text: `¿Estás seguro de que deseas eliminar permanentemente a "${name}"? Esta acción no se puede deshacer.`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, Eliminar",
                    cancelButtonText: "Cancelar",
                    confirmButtonColor: "#dc2626",
                    cancelButtonColor: "#64748b",
                    draggable: true
                });

                if (confirmRes.isConfirmed) {
                    await coluaRepo.deleteUser(uid);
                    Swal.fire({
                        title: "Usuario Eliminado",
                        text: `El usuario "${name}" ha sido eliminado del sistema.`,
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                        draggable: true
                    });
                    this.users = await coluaRepo.getAllUsers();
                    const container = document.getElementById('admin-tab-users') || document;
                    this.updateUserTable(container, true);
                }
            });
        });
    }

    showEditUserModal(user) {
        const uName = (user.nombre || '').replace(/"/g, '&quot;');
        const uEmail = (user.email || '').replace(/"/g, '&quot;');
        const uPhone = (user.telefono || user.phone || '').replace(/"/g, '&quot;');
        const uDpi = (user.dpi || '').replace(/"/g, '&quot;');
        const uRole = (user.tipoUsuario || user.role || 'ASOCIADO').toUpperCase();
        const uid = user.docId || user.uid || user.id || user.firebaseUid;

        const modalHtml = `
            <div style="text-align: left;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                    <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(23, 55, 137, 0.1); color: var(--colua-navy); display: flex; align-items: center; justify-content: center;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </div>
                    <div>
                        <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--colua-navy); margin: 0;">Editar Usuario / Restablecer Clave</h3>
                        <p style="font-size: 0.8rem; color: var(--colua-gray-500); margin: 2px 0 0 0;">ID Asociado: <strong>${user.associateId || user.userId || '0000001'}</strong></p>
                    </div>
                </div>

                <form id="form-admin-edit-user">
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; font-size: 0.82rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">Nombre Completo *</label>
                        <input type="text" id="admin-edit-user-name" value="${uName}" required style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem;" />
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
                        <div>
                            <label style="display: block; font-size: 0.82rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">Correo Electrónico (Gmail) *</label>
                            <input type="email" id="admin-edit-user-email" value="${uEmail}" required style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem;" />
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.82rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">Teléfono</label>
                            <input type="tel" id="admin-edit-user-phone" value="${uPhone}" placeholder="+502 00000000" style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem;" />
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
                        <div>
                            <label style="display: block; font-size: 0.82rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">DPI / CUI (Opcional)</label>
                            <input type="text" id="admin-edit-user-dpi" value="${uDpi}" maxlength="15" placeholder="0000 00000 0000" style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem;" />
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.82rem; font-weight: 600; color: var(--colua-gray-700); margin-bottom: 4px;">Rol en el Sistema</label>
                            <select id="admin-edit-user-role" style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem; background: white;">
                                <option value="INVITADO" ${uRole === 'INVITADO' ? 'selected' : ''}>Invitado</option>
                                <option value="ASOCIADO" ${uRole === 'ASOCIADO' || uRole === 'SOCIO' ? 'selected' : ''}>Asociado</option>
                                <option value="MANAGER" ${uRole === 'MANAGER' ? 'selected' : ''}>Manager</option>
                                <option value="ADMIN" ${uRole === 'ADMIN' || uRole === 'SUPERADMIN' ? 'selected' : ''}>Administrador</option>
                            </select>
                        </div>
                    </div>

                    <!-- Restablecer Contraseña -->
                    <div style="background: rgba(23, 55, 137, 0.04); border: 1.5px dashed rgba(23, 55, 137, 0.3); border-radius: 10px; padding: 12px; margin-bottom: 18px;">
                        <label style="display: block; font-size: 0.82rem; font-weight: 700; color: var(--colua-navy); margin-bottom: 3px;">
                            Restablecer Contraseña (Opcional)
                        </label>
                        <p style="font-size: 0.75rem; color: var(--colua-gray-500); margin: 0 0 8px 0;">
                            Úsalo si el administrador o asociado olvidó su clave o perdió acceso a su correo. Deja en blanco si no deseas cambiarla.
                        </p>
                        <input type="password" id="admin-edit-user-password" minlength="6" placeholder="Nueva contraseña (mínimo 6 caracteres)" style="width: 100%; padding: 8px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem; background: white;" />
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 10px;">
                        <button type="button" class="btn btn-outline" onclick="app.closeModal()">Cancelar</button>
                        <button type="submit" id="btn-save-admin-edit-user" class="btn btn-primary" style="font-weight: 600;">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        `;

        app.showModal(modalHtml);

        const form = document.getElementById('form-admin-edit-user');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const saveBtn = document.getElementById('btn-save-admin-edit-user');
                if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Guardando...'; }

                const nombre = document.getElementById('admin-edit-user-name').value.trim();
                const email = document.getElementById('admin-edit-user-email').value.trim();
                const phone = document.getElementById('admin-edit-user-phone').value.trim();
                const dpi = document.getElementById('admin-edit-user-dpi').value.trim();
                const role = document.getElementById('admin-edit-user-role').value;
                const password = document.getElementById('admin-edit-user-password').value;

                const res = await coluaRepo.updateUserFullProfile(uid, {
                    nombre,
                    email,
                    phone,
                    telefono: phone,
                    dpi,
                    role,
                    tipoUsuario: role,
                    password: password || undefined
                });

                if (res.success) {
                    app.closeModal();
                    Swal.fire({
                        title: "¡Usuario Actualizado!",
                        text: `Los datos del usuario "${nombre}" han sido actualizados exitosamente${password ? ' y su contraseña fue restablecida' : ''}.`,
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                        draggable: true
                    });
                    this.users = await coluaRepo.getAllUsers();
                    const container = document.getElementById('admin-tab-users') || document;
                    this.updateUserTable(container, true);
                } else {
                    Swal.fire({
                        title: "Error al Actualizar",
                        text: res.error || 'No se pudieron guardar los cambios del usuario.',
                        icon: "error",
                        draggable: true,
                        confirmButtonColor: "#173789"
                    });
                    if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Guardar Cambios'; }
                }
            });
        }
    }

    // ==========================================
    // TAB 5: REGISTRO DE AUDITORÍA
    // ==========================================
    async renderTabAudit(container) {
        this.auditLogs = await coluaRepo.getAuditLogs(60);

        container.innerHTML = `
            <div style="max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px;">
                <!-- Encabezado -->
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                    <div>
                        <h2 style="font-size: 1.3rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 4px 0; display: inline-flex; align-items: center; gap: 8px;">
                            ${ADMIN_ICONS.audit} <span>Bitácora de Auditoría y Trazabilidad Institucional</span>
                        </h2>
                        <p style="font-size: 0.85rem; color: var(--colua-gray-600); margin: 0;">
                            Registro inmutable de seguridad: quién, cuándo y qué acción administrativa se ejecutó.
                        </p>
                    </div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <button id="btn-export-audit-json" class="btn btn-outline" style="font-size: 0.82rem; padding: 7px 12px; display: inline-flex; align-items: center; gap: 6px; color: var(--colua-navy); border-color: var(--colua-navy);">
                            <span>📥 Descargar Registro (JSON)</span>
                        </button>
                        <button id="btn-refresh-audit" class="btn btn-outline" style="font-size: 0.82rem; padding: 7px 12px; display: inline-flex; align-items: center; gap: 6px; color: var(--colua-navy); border-color: var(--colua-navy);">
                            ${ADMIN_ICONS.refresh} <span>Actualizar</span>
                        </button>
                    </div>
                </div>

                <!-- Tarjeta Explicativa: ¿Para qué sirve este módulo? -->
                <div class="card" style="padding: 20px 22px; background: white; border-radius: 14px; border-left: 4px solid var(--colua-navy); box-shadow: var(--shadow-sm); border-top: 1px solid var(--colua-gray-200); border-right: 1px solid var(--colua-gray-200); border-bottom: 1px solid var(--colua-gray-200);">
                    <div style="display: flex; align-items: flex-start; gap: 14px;">
                        <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(23, 55, 137, 0.08); color: var(--colua-navy); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            ${ADMIN_ICONS.shieldCheck}
                        </div>
                        <div>
                            <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 6px 0;">
                                ¿Para qué sirve la Bitácora de Auditoría?
                            </h3>
                            <p style="font-size: 0.84rem; color: var(--colua-gray-700); margin: 0; line-height: 1.55;">
                                Es el registro oficial de seguridad de la plataforma COLUA Digital. Proporciona trazabilidad completa y no repudiación ante auditorías internas y regulatorias. Cada vez que un usuario administrativo (Super Administrador, Administrador o Manager) realiza una modificación en pantallas, tarjetas, usuarios, roles RBAC, clave universal o publicaciones masivas a la nube, se genera un evento con marca de tiempo precisa, operador responsable y detalle del cambio.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Filtros de Auditoría -->
                <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;" id="audit-filter-pills">
                    <button class="audit-pill active" data-cat="all" style="padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: 1.5px solid var(--colua-navy); background: var(--colua-navy); color: white; cursor: pointer; white-space: nowrap;">Todas (${this.auditLogs.length})</button>
                    <button class="audit-pill" data-cat="PUBLICACION" style="padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: 1.5px solid var(--colua-gray-300); background: white; color: var(--colua-gray-700); cursor: pointer; white-space: nowrap;">Publicaciones</button>
                    <button class="audit-pill" data-cat="SECCION" style="padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: 1.5px solid var(--colua-gray-300); background: white; color: var(--colua-gray-700); cursor: pointer; white-space: nowrap;">Pantallas / Secciones</button>
                    <button class="audit-pill" data-cat="CONTENIDO" style="padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: 1.5px solid var(--colua-gray-300); background: white; color: var(--colua-gray-700); cursor: pointer; white-space: nowrap;">Contenidos / Canvas</button>
                    <button class="audit-pill" data-cat="ROL" style="padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: 1.5px solid var(--colua-gray-300); background: white; color: var(--colua-gray-700); cursor: pointer; white-space: nowrap;">Seguridad y Roles RBAC</button>
                </div>

                <!-- Tabla de Eventos de Auditoría -->
                <div class="card" style="padding: 0; overflow: hidden; background: white; border-radius: 12px; box-shadow: var(--shadow-sm); border: 1px solid var(--colua-gray-200);">
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;" id="audit-table-el">
                            <thead style="background: var(--colua-gray-50); border-bottom: 1.5px solid var(--colua-gray-200); color: var(--colua-gray-700);">
                                <tr>
                                    <th style="padding: 12px 16px; width: 180px;">Fecha / Hora</th>
                                    <th style="padding: 12px 16px; width: 220px;">Acción Ejecutada</th>
                                    <th style="padding: 12px 16px; width: 170px;">Operador / Responsable</th>
                                    <th style="padding: 12px 16px;">Detalle Técnico</th>
                                </tr>
                            </thead>
                            <tbody id="audit-logs-tbody">
                                ${this.renderAuditRows(this.auditLogs)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // Eventos de Auditoría
        container.querySelector('#btn-refresh-audit')?.addEventListener('click', async () => {
            Swal.fire({
                title: "Actualizando...",
                text: "Recargando bitácora de auditoría",
                icon: "info",
                timer: 500,
                showConfirmButton: false,
                draggable: true
            });
            await this.renderTabAudit(container);
        });

        container.querySelector('#btn-export-audit-json')?.addEventListener('click', () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.auditLogs, null, 2));
            const dlAnchor = document.createElement('a');
            dlAnchor.setAttribute("href", dataStr);
            dlAnchor.setAttribute("download", `bitacora_auditoria_colua_${new Date().toISOString().slice(0, 10)}.json`);
            document.body.appendChild(dlAnchor);
            dlAnchor.click();
            dlAnchor.remove();
            app.showToast('Reporte de auditoría descargado', 'success');
        });

        const pills = container.querySelectorAll('.audit-pill');
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => {
                    p.style.background = 'white';
                    p.style.color = 'var(--colua-gray-700)';
                    p.style.borderColor = 'var(--colua-gray-300)';
                });
                pill.style.background = 'var(--colua-navy)';
                pill.style.color = 'white';
                pill.style.borderColor = 'var(--colua-navy)';

                const cat = pill.dataset.cat;
                const filtered = cat === 'all' 
                    ? this.auditLogs 
                    : this.auditLogs.filter(l => (l.action || '').toUpperCase().includes(cat));

                const tbody = container.querySelector('#audit-logs-tbody');
                if (tbody) tbody.innerHTML = this.renderAuditRows(filtered);
            });
        });
    }

    renderAuditRows(logs) {
        if (logs.length === 0) {
            return `<tr><td colspan="4" style="padding: 30px; text-align: center; color: var(--colua-gray-500);">No se encontraron eventos para el filtro seleccionado.</td></tr>`;
        }

        return logs.map(log => {
            let actionBadgeBg = 'rgba(23, 55, 137, 0.1)';
            let actionBadgeColor = 'var(--colua-navy)';
            const actUpper = (log.action || '').toUpperCase();

            if (actUpper.includes('ELIMINAR') || actUpper.includes('PURGE') || actUpper.includes('RESTAURACION')) {
                actionBadgeBg = 'rgba(228, 42, 103, 0.15)';
                actionBadgeColor = 'var(--colua-pink)';
            } else if (actUpper.includes('PUBLICACION') || actUpper.includes('ACTIVAR')) {
                actionBadgeBg = 'rgba(89, 184, 164, 0.18)';
                actionBadgeColor = 'var(--colua-green)';
            } else if (actUpper.includes('ROLLBACK') || actUpper.includes('OCULTAR') || actUpper.includes('BARRA')) {
                actionBadgeBg = 'rgba(239, 136, 25, 0.15)';
                actionBadgeColor = '#b75e00';
            }

            return `
                <tr style="border-bottom: 1px solid var(--colua-gray-100); transition: background-color 0.15s ease;" onmouseover="this.style.backgroundColor='#f8fafc'" onmouseout="this.style.backgroundColor='transparent'">
                    <td style="padding: 11px 16px; color: var(--colua-gray-600); font-size: 0.8rem; white-space: nowrap;">
                        ${log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Reciente'}
                    </td>
                    <td style="padding: 11px 16px;">
                        <span class="badge" style="background: ${actionBadgeBg}; color: ${actionBadgeColor}; font-size: 0.73rem; font-weight: 700;">
                            ${log.action || 'OPERACION'}
                        </span>
                    </td>
                    <td style="padding: 11px 16px; font-weight: 600; color: var(--colua-navy); font-size: 0.84rem;">
                        ${log.performedBy || 'Super Administrador'}
                    </td>
                    <td style="padding: 11px 16px; color: var(--colua-gray-700); font-size: 0.82rem; line-height: 1.45;">
                        ${typeof log.details === 'object' ? JSON.stringify(log.details) : (log.details || 'Operación completada')}
                    </td>
                </tr>
            `;
        }).join('');
    }

    // ==========================================
    // TAB 6: INSTRUCCIONES Y MANUAL COMPLETO CMS
    // ==========================================
    async renderTabInstrucciones(container) {
        const isSuper = authService.isSuperAdmin();
        const roleLabel = isSuper ? 'SUPERADMIN' : (authService.isManager() ? 'MANAGER' : 'ADMIN');

        container.innerHTML = `
            <div style="max-width: 920px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px;">
                <!-- Header Manual Completo (Estilo oficial de la cooperativa) -->
                <div style="background: linear-gradient(135deg, #0a1931 0%, var(--colua-navy) 100%); color: white; border-radius: 16px; padding: 24px 26px; box-shadow: var(--shadow-md);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
                        <h2 style="font-size: 1.25rem; font-weight: 800; color: #ffffff !important; margin: 0; display: inline-flex; align-items: center; gap: 10px;">
                            <span style="display: inline-flex; align-items: center;">${ADMIN_ICONS.book}</span> <span>MANUAL COMPLETO Y GUÍA CMS</span>
                        </h2>
                        <span class="badge" style="background: ${isSuper ? 'var(--colua-gold)' : 'rgba(255, 255, 255, 0.15)'}; color: ${isSuper ? '#0a1931' : '#ffffff'}; font-size: 0.74rem; font-weight: 800; padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.25);">
                            ${isSuper ? 'v105 • SuperAdmin Maestro' : `v105 • Modo Operativo (${roleLabel})`}
                        </span>
                    </div>
                    <p style="font-size: 0.88rem; color: rgba(255, 255, 255, 0.9); margin: 0; line-height: 1.55;">
                        Guía oficial de referencia completa paso a paso para la gestión de publicaciones, noticias, pantallas, roles, arquitectura doble nube y sincronización de la App COLUA MICOOPE.
                    </p>
                </div>

                ${!isSuper ? `
                    <!-- Aviso de Seguridad para Administradores y Managers -->
                    <div class="card" style="background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 10px; padding: 14px 18px; border-top: 1px solid #bbf7d0; border-right: 1px solid #bbf7d0; border-bottom: 1px solid #bbf7d0;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="color: #16a34a;">${ADMIN_ICONS.shieldCheck}</span>
                            <span style="font-size: 0.84rem; color: #166534; font-weight: 600;">
                                <strong>Modo Operativo CMS:</strong> Se muestran las instrucciones autorizadas de gestión de pantallas, contenidos, noticias y agencias. Las directivas maestras de Clave Universal, Infraestructura de Nube y Rollback de emergencia son de acceso exclusivo para el Super Administrador.
                            </span>
                        </div>
                    </div>
                ` : ''}

                ${isSuper ? `
                    <!-- 1. Control de Acceso por Roles (RBAC) [EXCLUSIVO SUPERADMIN] -->
                    <div class="card" style="background: white; border-radius: 14px; padding: 22px; box-shadow: var(--shadow-sm); border: 1px solid var(--colua-gray-200); border-left: 4px solid var(--colua-gold);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
                            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--colua-navy); margin: 0; display: flex; align-items: center; gap: 10px;">
                                <span style="color: var(--colua-navy);">${ADMIN_ICONS.shieldCheck}</span> <span>1. Control de Acceso por Roles (RBAC)</span>
                            </h3>
                            <span class="badge" style="background: rgba(239, 136, 25, 0.15); color: #b75e00; font-size: 0.72rem; font-weight: 700;">Privilegio SuperAdmin</span>
                        </div>

                        <div style="font-size: 0.86rem; color: var(--colua-gray-700); line-height: 1.7; display: flex; flex-direction: column; gap: 14px;">
                            <div>
                                <strong style="color: var(--colua-navy); display: block; margin-bottom: 2px;">• Doble Factor de Ingreso al CMS:</strong>
                                El ingreso requiere validar primero la <strong>Clave Universal Institucional</strong> activa del sistema (modificable libremente por el Super Administrador desde la pestaña 'Usuarios y Roles' con cifrado SHA-256) y posteriormente verificar en la base de datos que la cuenta posea credenciales autorizadas.
                            </div>

                            <div>
                                <strong style="color: var(--colua-navy); display: block; margin-bottom: 2px;">• Super Administrador (coluarl@gmail.com):</strong>
                                <ul style="margin: 4px 0 0 20px; padding: 0;">
                                    <li>Posee control maestro total sobre el sistema y base de datos.</li>
                                    <li>Asigna y modifica los roles de cualquier usuario (ADMIN, ASOCIADO, INVITADO, MANAGER) desde la lista de Usuarios y Roles.</li>
                                    <li>Acceso a herramientas de mantenimiento, gestión de managers RBAC, bitácora de auditoría y reversión de versiones (Rollback).</li>
                                </ul>
                            </div>

                            <div>
                                <strong style="color: var(--colua-navy); display: block; margin-bottom: 2px;">• Managers de Contenido / Administradores:</strong>
                                <ul style="margin: 4px 0 0 20px; padding: 0;">
                                    <li>Gestión de pantallas, tarjetas, productos y agencias.</li>
                                    <li>Publican cambios a la nube hacia todos los asociados.</li>
                                    <li>Las acciones críticas o destructivas requieren la clave de autorización del Super Administrador.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- 2. Instrucciones de Manejo de Pantallas -->
                <div class="card" style="background: white; border-radius: 14px; padding: 22px; box-shadow: var(--shadow-sm); border: 1px solid var(--colua-gray-200);">
                    <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 16px 0; display: flex; align-items: center; gap: 10px;">
                        <span style="color: var(--colua-navy);">${ADMIN_ICONS.screens}</span> <span>${isSuper ? '2.' : '1.'} Instrucciones de Manejo de Pantallas</span>
                    </h3>

                    <div style="font-size: 0.86rem; color: var(--colua-gray-700); line-height: 1.7; display: flex; flex-direction: column; gap: 12px;">
                        <div>
                            <strong style="color: var(--colua-navy);">• Paso 1: Pestaña Pantallas y Menús:</strong><br/>
                            En la barra superior presiona 'Pantallas y Menús' y toca el botón '+ Crear Nueva Sección'.
                        </div>

                        <div>
                            <strong style="color: var(--colua-navy);">• Paso 2: Nombre de Pantalla y Slug Automático:</strong><br/>
                            Al escribir el nombre (ej. Créditos Educativos), el sistema genera la ruta técnica en minúsculas sin espacios (ej. <code>/sec_creditos_educativos</code>).
                        </div>

                        <div>
                            <strong style="color: var(--colua-navy);">• Paso 3: Ícono y Color Temático Hexadecimal:</strong><br/>
                            Selecciona el ícono institucional de la galería y asigna un color de acento por Chip o código #HEX.
                        </div>

                        <div>
                            <strong style="color: var(--colua-navy);">• Paso 4: Ubicación de Navegación (Lugar):</strong><br/>
                            Elige dónde se mostrará la pantalla:
                            <ul style="margin: 4px 0 0 20px; padding: 0;">
                                <li><strong>Cuadrícula y Menú Lateral:</strong> Se muestra en el grid de la página de inicio y en el menú lateral.</li>
                                <li><strong>Barra Inferior Móvil (5 Botones):</strong> Inicio está permanentemente fijo al centro (posición 3) y las otras 4 posiciones se pueden intercambiar libremente.</li>
                                <li><strong>Solo Menú Lateral:</strong> Accesible exclusivamente desde el drawer de navegación.</li>
                                <li><strong>Sin acceso visible (Oculta):</strong> Disponible solo por enlace directo o botón interno.</li>
                            </ul>
                        </div>

                        <div>
                            <strong style="color: var(--colua-navy);">• Paso 5: Switch de Visibilidad:</strong><br/>
                            Permite encender o apagar la pantalla inmediatamente sin necesidad de eliminarla.
                        </div>
                    </div>
                </div>

                <!-- 3. Instrucciones de Manejo de Contenido (Editor Canvas) -->
                <div class="card" style="background: white; border-radius: 14px; padding: 22px; box-shadow: var(--shadow-sm); border: 1px solid var(--colua-gray-200);">
                    <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 16px 0; display: flex; align-items: center; gap: 10px;">
                        <span style="color: var(--colua-navy);">${ADMIN_ICONS.canvas}</span> <span>${isSuper ? '3.' : '2.'} Instrucciones de Manejo de Contenido (Editor Canvas)</span>
                    </h3>

                    <div style="font-size: 0.86rem; color: var(--colua-gray-700); line-height: 1.7; display: flex; flex-direction: column; gap: 12px;">
                        <div>
                            <strong style="color: var(--colua-navy);">• Selección de Pantallas a Editar:</strong><br/>
                            En la pestaña 'Editor Canvas', toca cualquier pantalla activa (Servicios, Ahorros, Créditos, Agencias, Nosotros, Sostenibilidad) para desplegar su editor de tarjetas e ítems.
                        </div>

                        <div>
                            <strong style="color: var(--colua-navy);">• Editor Maestro en Vivo:</strong><br/>
                            Al presionar 'Editar' en cualquier tarjeta o servicio, podrás modificar títulos, subtítulos, ofertas/tasas, botones CTA y colores observando la tarjeta real en tiempo real.
                        </div>

                        <div>
                            <strong style="color: var(--colua-navy);">• Guardar como Borrador Real vs Publicación:</strong><br/>
                            Al crear o editar una tarjeta, puedes marcar la opción <em>'Guardar como Borrador'</em>. Los elementos en borrador se mantienen estrictamente invisibles en la aplicación pública hasta que decidas publicarlos masivamente a la nube.
                        </div>

                        <div>
                            <strong style="color: var(--colua-navy);">• Botón Ocultar / Mostrar en 1 Clic:</strong><br/>
                            Cada tarjeta cuenta con un botón directo de visibilidad (icono de ojo) para ocultar o mostrar el elemento al instante.
                        </div>

                        <div>
                            <strong style="color: var(--colua-navy);">• Duplicar Tarjetas:</strong><br/>
                            Con el botón 'Duplicar' puedes clonar cualquier tarjeta existente para crear variantes rápidamente conservando el formato visual.
                        </div>

                        <div>
                            <strong style="color: var(--colua-navy);">• Editor de Bloques Atómicos:</strong><br/>
                            Usa el botón 'Bloques' para agregar listas de requisitos, notas informativas, destacados y párrafos estructurados dentro de cada producto o servicio.
                        </div>
                    </div>
                </div>

                <!-- 4. Apartado Especial: Publicación y Subida de Noticias -->
                <div class="card" style="background: white; border-radius: 14px; padding: 22px; box-shadow: var(--shadow-sm); border: 1px solid var(--colua-gray-200);">
                    <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 14px 0; display: flex; align-items: center; gap: 10px;">
                        <span style="display: inline-flex; align-items: center;">${ADMIN_ICONS.news}</span> <span>${isSuper ? '4.' : '3.'} Apartado Especial: Publicación y Subida de Noticias</span>
                    </h3>

                    <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 10px; padding: 12px 16px; margin-bottom: 14px; font-size: 0.84rem; color: #92400e; line-height: 1.5;">
                        <strong>PUBLICACIÓN RÁPIDA DESDE EL INICIO:</strong><br/>
                        ¡No necesitas ingresar a la pestaña 'Publicar' para subir una noticia! Al inicio de la pestaña 'Pantallas' o seleccionando 'Noticias' en Canvas verás la opción de agregar contenido. Puedes publicar comunicados y noticias directamente en su propio espacio independiente.
                    </div>

                    <div style="font-size: 0.86rem; color: var(--colua-gray-700); line-height: 1.7; display: flex; flex-direction: column; gap: 12px;">
                        <div>
                            <strong style="color: var(--colua-navy);">• Paso 1: Título Principal:</strong><br/>
                            Campo obligatorio donde ingresas el titular de la noticia o comunicado oficial de la cooperativa.
                        </div>

                        <div>
                            <strong style="color: var(--colua-navy);">• Paso 2: Comunicado y Contador de Caracteres:</strong><br/>
                            Espacio para redactar el cuerpo del artículo con visualización clara y formato responsive para móviles y pantallas grandes.
                        </div>

                        <div>
                            <strong style="color: var(--colua-navy);">• Paso 3: Hashtags Institucionales:</strong><br/>
                            Etiquetas institucionales para categorizar la publicación (ej. <code>#COLUAVerde</code>, <code>#MICOOPE</code>, <code>#ComunidadCOLUA</code>).
                        </div>

                        <div>
                            <strong style="color: var(--colua-navy);">• Paso 4: Carga de Fotos y Portada:</strong><br/>
                            Selecciona una imagen de tu dispositivo. La plataforma la sube automáticamente a Supabase Storage y optimiza su peso para carga ultra-rápida.
                        </div>

                        <div>
                            <strong style="color: var(--colua-navy);">• Paso 5: Botón de Acción Interactivo y Enlaces:</strong>
                            <ul style="margin: 4px 0 0 20px; padding: 0;">
                                <li><strong>Enlace Vacío:</strong> El botón abrirá el artículo completo dentro de la misma app con su modal interactivo de lectura y reacciones.</li>
                                <li><strong>Enlace Web o PBX:</strong> Si colocas una URL (http://) o enlace telefónico (tel:), redirigirá afuera.</li>
                                <li><strong>Link para Compartir:</strong> Define la URL o mensaje que se copiará al portapapeles o redes al presionar 'Compartir'.</li>
                            </ul>
                        </div>

                        <div>
                            <strong style="color: var(--colua-navy);">• Paso 6: Fecha de Publicación y Noticia Destacada:</strong><br/>
                            La fecha más reciente encabezará automáticamente como novedad. Además, puedes marcar la insignia 'Destacada' para fijarla con prioridad en el muro general.
                        </div>
                    </div>
                </div>

                ${isSuper ? `
                    <!-- 5. Conexión de Nube Doble (Firebase + Supabase) [EXCLUSIVO SUPERADMIN] -->
                    <div class="card" style="background: white; border-radius: 14px; padding: 22px; box-shadow: var(--shadow-sm); border: 1px solid var(--colua-gray-200); border-left: 4px solid #0284c7;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
                            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--colua-navy); margin: 0; display: flex; align-items: center; gap: 10px;">
                                <span style="display: inline-flex; align-items: center;">${ADMIN_ICONS.cloud}</span> <span>5. Conexión de Nube Doble (Firebase + Supabase)</span>
                            </h3>
                            <span class="badge" style="background: #e0f2fe; color: #0369a1; font-size: 0.72rem; font-weight: 700;">Infraestructura Cloud</span>
                        </div>

                        <div style="font-size: 0.86rem; color: var(--colua-gray-700); line-height: 1.7; display: flex; flex-direction: column; gap: 12px;">
                            <div>
                                <strong style="color: var(--colua-navy);">• Google Firebase Firestore (Bases de Datos en Tiempo Real):</strong><br/>
                                Sincroniza la estructura de pantallas, borradores, perfiles de usuario, roles RBAC, métricas de visita y datos en tiempo real entre todos los dispositivos conectados.
                            </div>

                            <div>
                                <strong style="color: var(--colua-navy);">• Supabase Storage (Servidor Dedicado de Imágenes):</strong><br/>
                                Aloja de forma pública y CDN todas las fotografías de noticias, banners y portadas en el servidor dedicado de Supabase (bucket institucional <code>imagenes</code>).
                            </div>

                            <div>
                                <strong style="color: var(--colua-navy);">• Sincronización Automática:</strong><br/>
                                Al adjuntar una foto, la app la sube a Supabase, guarda la URL pública en Firestore y la hace visible para todos los asociados en cualquier dispositivo inmediatamente.
                            </div>
                        </div>
                    </div>

                    <!-- 6. Auditoría, Bitácora y Reversión (Rollback) [EXCLUSIVO SUPERADMIN] -->
                    <div class="card" style="background: white; border-radius: 14px; padding: 22px; box-shadow: var(--shadow-sm); border: 1px solid var(--colua-gray-200); border-left: 4px solid #e11d48;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
                            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--colua-navy); margin: 0; display: flex; align-items: center; gap: 10px;">
                                <span style="display: inline-flex; align-items: center;">${ADMIN_ICONS.audit}</span> <span>6. Auditoría, Bitácora y Reversión (Rollback)</span>
                            </h3>
                            <span class="badge" style="background: #ffe4e6; color: #be123c; font-size: 0.72rem; font-weight: 700;">Seguridad y Recuperación</span>
                        </div>

                        <div style="font-size: 0.86rem; color: var(--colua-gray-700); line-height: 1.7; display: flex; flex-direction: column; gap: 12px;">
                            <div>
                                <strong style="color: var(--colua-navy);">• Pestaña Publicar y Verificación:</strong><br/>
                                El Centro de Control muestra la versión actual (ej. v33 local vs v32 publicada) y el botón 'Revisar Detalle de Cambios' para auditoría previa antes del despliegue masivo.
                            </div>

                            <div>
                                <strong style="color: var(--colua-navy);">• Bitácora de Auditoría:</strong><br/>
                                Registra con fecha, hora, rol y detalle técnico cada modificación realizada en el CMS para garantizar trazabilidad y no repudio.
                            </div>

                            <div>
                                <strong style="color: var(--colua-navy);">• Reversión de Versión / Rollback:</strong><br/>
                                Herramienta de emergencia del Super Administrador para comprobar y regresar la plataforma a la última versión estable aprobada ante cualquier contingencia.
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- 7. Gestión de Agencias y Sucursales -->
                <div class="card" style="background: white; border-radius: 14px; padding: 22px; box-shadow: var(--shadow-sm); border: 1px solid var(--colua-gray-200);">
                    <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--colua-navy); margin: 0 0 16px 0; display: flex; align-items: center; gap: 10px;">
                        <span style="display: inline-flex; align-items: center;">${ADMIN_ICONS.building}</span> <span>${isSuper ? '7.' : '4.'} Gestión de Agencias y Sucursales</span>
                    </h3>

                    <div style="font-size: 0.86rem; color: var(--colua-gray-700); line-height: 1.7;">
                        Permite agregar, editar y ordenar las <strong>25 agencias oficiales</strong>, sub-agencias MICOOPE y cajeros automáticos 5B con su dirección exacta, departamento (Sololá, Quiché, Totonicapán, Suchitepéquez), PBX directo y enlaces de geolocalización.
                    </div>
                </div>
            </div>
        `;
    }
}

window.adminComponent = new AdminComponent();
