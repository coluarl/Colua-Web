// web/js/router.js — Enrutador SPA COLUA Web Digital

class Router {
    constructor() {
        this.currentRoute = '';
        this.container = null;
        this._routingId = 0;
    }

    init(containerId) {
        this.container = document.getElementById(containerId || 'main-content');
        window.addEventListener('hashchange', () => this.handleRouting());
        // Carga inicial
        this.handleRouting();
    }

    async handleRouting() {
        const routingId = ++this._routingId;
        let rawHash = (window.location.hash || '').replace(/^#\/?/, '').trim();
        let hash = rawHash.split('?')[0].trim().toLowerCase();
        if (!hash || hash === '/' || hash === '') hash = 'inicio';
        if (hash === 'mi_empleo' || hash === 'mi-empleo') hash = 'sec_empleo';

        this.currentRoute = hash;

        // Registrar analítica de visitas
        if (window.coluaRepo && window.coluaRepo.trackPageView) {
            window.coluaRepo.trackPageView(hash);
        }

        // Cerrar sidebar
        if (window.sidebarComponent && window.sidebarComponent.close) {
            window.sidebarComponent.close(false, true);
        }

        // Actualizar navbar desktop, menú lateral sándwich y bottom-nav móvil
        if (window.navbarComponent && window.navbarComponent.updateActive) {
            window.navbarComponent.updateActive(hash);
        }
        if (window.sidebarComponent && window.sidebarComponent.updateActive) {
            window.sidebarComponent.updateActive(hash);
        }
        if (window.bottomNavComponent && window.bottomNavComponent.updateActive) {
            window.bottomNavComponent.updateActive(hash);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (!this.container) this.container = document.getElementById('main-content');
        if (!this.container) return;

        let html = '';
        let component = null;

        try {
            switch (hash) {
                case 'inicio':
                case 'home':
                case 'sec_home':
                    if (window.homeComponent) {
                        html = await window.homeComponent.render(this.container);
                        component = window.homeComponent;
                    }
                    break;
                case 'asociate':
                case 'como-asociarte':
                case 'form_asociate':
                case 'solicitud':
                    if (window.app && window.app.showDynamicFormModal) {
                        window.app.showDynamicFormModal('form_asociate');
                    }
                    if (window.homeComponent) {
                        html = await window.homeComponent.render(this.container);
                        component = window.homeComponent;
                    }
                    break;
                case 'noticias':
                case 'news':
                case 'sec_noticias':
                    if (window.noticiasComponent) {
                        html = await window.noticiasComponent.render(this.container);
                        component = window.noticiasComponent;
                    }
                    break;
                case 'agencias':
                case 'ubicaciones':
                case 'sec_agencias':
                    if (window.agenciasComponent) {
                        html = await window.agenciasComponent.render(this.container);
                        component = window.agenciasComponent;
                    }
                    break;
                case 'perfil':
                case 'cuenta':
                case 'carne':
                    if (window.perfilComponent) {
                        html = await window.perfilComponent.render(this.container);
                        component = window.perfilComponent;
                    }
                    break;
                case 'verificar':
                case 'validar':
                case 'verify':
                    if (window.perfilComponent && typeof window.perfilComponent.renderVerificationPage === 'function') {
                        html = await window.perfilComponent.renderVerificationPage(this.container);
                        component = window.perfilComponent;
                    }
                    break;
                case 'admin':
                case 'cms':
                case 'administracion':
                    if (window.adminComponent) {
                        html = await window.adminComponent.render(this.container);
                        component = window.adminComponent;
                    }
                    break;
                default:
                    // Secciones dinámicas: ahorros, creditos, seguros, remesas, servicios, beneficios, etc.
                    if (window.sectionsComponent) {
                        html = await window.sectionsComponent.render(hash);
                        component = window.sectionsComponent;
                    }
                    break;
            }
        } catch (err) {
            console.error('[Router] Error al renderizar "' + hash + '":', err);
            if (routingId !== this._routingId) return;
            if (window.Swal) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "No se pudo cargar esta sección. Verifica tu conexión.",
                    confirmButtonColor: "#173789",
                    confirmButtonText: "Entendido",
                    footer: '<a href="#inicio" style="color:#173789;font-weight:600;text-decoration:none;">Ir a la página de Inicio</a>'
                });
            }
            html = `
                <div style="min-height:60vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:2rem;">
                    <div style="max-width:440px;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;padding:2.5rem 2rem;box-shadow:0 8px 30px rgba(0,0,0,0.06);">
                        <div style="width:64px;height:64px;margin:0 auto 1.25rem;border-radius:50%;background:#fee2e2;display:flex;align-items:center;justify-content:center;">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <h2 style="font-size:1.35rem;font-weight:800;color:var(--colua-navy);margin-bottom:8px;">Error al cargar</h2>
                        <p style="font-size:0.92rem;color:#64748b;line-height:1.6;margin-bottom:1.5rem;">No se pudo cargar esta sección. Verifica tu conexión o intenta nuevamente.</p>
                        <button class="btn btn-primary" onclick="window.location.hash='#inicio'" style="background:#173789;color:#fff;border-radius:10px;padding:0.65rem 1.4rem;font-weight:700;display:inline-flex;align-items:center;gap:8px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            Ir al Inicio
                        </button>
                    </div>
                </div>
            `;
        }

        // Si llegó una nueva solicitud de navegación mientras esta cargaba, descartar la obsoleta
        if (routingId !== this._routingId) {
            return;
        }

        // Insertar HTML en el contenedor si el componente retornó un string
        if (typeof html === 'string' && html.trim().length > 0) {
            this.container.innerHTML = html;
        }

        // Ejecutar attachEvents del componente activo
        if (component && typeof component.attachEvents === 'function') {
            component.attachEvents();
        }
    }

    navigate(route) {
        const r = (route || 'inicio').replace(/^#\/?/, '').trim();
        const targetHash = '#' + r;
        if (window.location.hash === targetHash) {
            this.handleRouting();
        } else {
            window.location.hash = targetHash;
        }
    }
}

window.router = new Router();
// Alias para compatibilidad con los componentes que usan window.coluaRouter
window.coluaRouter = window.router;
