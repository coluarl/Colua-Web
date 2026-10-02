// web/js/components/sidebar.js — Menú Lateral Sándwich (Drawer) Dinámico Multi-dispositivo COLUA MICOOPE

class SidebarComponent {
  constructor() {
    this.isOpen = false;
    this.expandedGroups = new Set();
  }

  // Resuelve el ícono apropiado para cada botón / pantalla asignada
  getIconHtml(targetSectionId = '', label = '', customIcon = '') {
    if (customIcon && (customIcon.startsWith('assets/') || customIcon.startsWith('http') || customIcon.startsWith('data:'))) {
      return `<img src="${customIcon}" alt="" style="width: 22px; height: 22px; object-fit: contain;" onerror="this.src='assets/distintivo_colua.png'" />`;
    }

    const clean = (targetSectionId || '').trim().toLowerCase();
    const cleanLabel = (label || '').trim().toLowerCase();

    if (clean === 'sec_home' || clean === 'inicio' || clean === 'home' || clean === '') {
      return `<img src="assets/distintivo_colua.png" alt="" style="padding: 2px; width: 22px; height: 22px; object-fit: contain;" />`;
    }
    if (clean === 'perfil' || clean.includes('perfil')) {
      return `<img src="assets/perfil.png" alt="" style="width: 22px; height: 22px; object-fit: contain;" onerror="this.src='assets/distintivo_colua.png'" />`;
    }
    if (clean === 'sec_ahorros' || clean.includes('ahorro') || cleanLabel.includes('ahorro')) {
      return `<img src="assets/ahorros.png" alt="" style="width: 22px; height: 22px; object-fit: contain;" />`;
    }
    if (clean === 'sec_creditos' || clean.includes('credito') || clean.includes('crédito') || cleanLabel.includes('crédit') || cleanLabel.includes('credit')) {
      return `<img src="assets/credito.png" alt="" style="width: 22px; height: 22px; object-fit: contain;" />`;
    }
    if (clean === 'sec_seguros' || clean.includes('seguro') || cleanLabel.includes('seguro')) {
      return `<img src="assets/seguro.png" alt="" style="width: 22px; height: 22px; object-fit: contain;" />`;
    }
    if (clean === 'sec_remesas' || clean.includes('remesa') || cleanLabel.includes('remesa')) {
      return `<img src="assets/remesa.png" alt="" style="width: 22px; height: 22px; object-fit: contain;" />`;
    }
    if (clean === 'sec_servicios' || clean.includes('servicio') || cleanLabel.includes('servicio')) {
      return `<img src="assets/servicios_digitales.png" alt="" style="width: 22px; height: 22px; object-fit: contain;" />`;
    }
    if (clean === 'sec_beneficios' || clean.includes('beneficio') || cleanLabel.includes('beneficio')) {
      return `<img src="assets/beneficios.png" alt="" style="width: 22px; height: 22px; object-fit: contain;" />`;
    }
    if (clean === 'sec_sostenibilidad' || clean.includes('sostenibilidad') || cleanLabel.includes('sostenibilidad') || cleanLabel.includes('responsabilidad')) {
      return `<img src="assets/sostenibilidad_cooperativa.png" alt="" style="width: 22px; height: 22px; object-fit: contain;" />`;
    }
    if (clean === 'sec_empleo' || clean.includes('empleo') || clean.includes('plaza') || clean.includes('vacante') || cleanLabel.includes('empleo') || cleanLabel.includes('plaza') || cleanLabel.includes('vacante') || cleanLabel.includes('trabaj')) {
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: #2563eb; flex-shrink: 0;"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`;
    }
    if (clean === 'sec_agencias' || clean.includes('agencia') || clean.includes('ubicacion') || cleanLabel.includes('agencia') || cleanLabel.includes('sede') || cleanLabel.includes('sucursal')) {
      return `<img src="assets/ubicacion.png" alt="" style="width: 22px; height: 22px; object-fit: contain;" />`;
    }
    if (clean === 'sec_noticias' || clean.includes('noticia') || clean.includes('evento') || cleanLabel.includes('noticia') || cleanLabel.includes('evento') || cleanLabel.includes('actualidad')) {
      return `<img src="assets/noticias_colua.png" alt="" style="width: 22px; height: 22px; object-fit: contain;" />`;
    }
    if (clean.includes('gobierno') || cleanLabel.includes('gobierno')) {
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: #173789; flex-shrink: 0;"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4"></path></svg>`;
    }
    if (clean === 'sec_nosotros' || clean.includes('nosotros') || cleanLabel.includes('nosotros') || cleanLabel.includes('quienes') || cleanLabel.includes('cooperativa')) {
      return `<img src="assets/distintivo_colua.png" alt="" style="padding: 2px; width: 22px; height: 22px; object-fit: contain;" />`;
    }

    // Ícono por defecto para cualquier botón nuevo o personalizado creado desde el CMS
    return `<img src="assets/distintivo_colua.png" alt="" style="width: 22px; height: 22px; object-fit: contain;" />`;
  }

  render() {
    const session = window.authManager?.getCurrentSession();
    const isGuest = window.authService ? window.authService.isGuest() : (!session || session.user_role === 'GUEST');
    const userName = session ? session.user_name : 'Invitado';
    let assocId = session ? (session.associateId || '') : '';
    if (!assocId || assocId.length > 8 || !/^\d+$/.test(assocId)) {
      assocId = window.authService ? window.authService.generateAssociateId(session?.user_email || session?.user_id) : '0010025';
    }
    const userRoleText = isGuest ? 'Modo Consulta (Invitado)' : `Asociado No. ${assocId}`;

    // Obtener dinámicamente todos los botones de navegación configurados en la web
    const repo = window.coluaRepository || window.coluaRepo;
    const rawItems = repo && typeof repo.getTopNavItemsSync === 'function' ? repo.getTopNavItemsSync() : [];
    const items = (rawItems || []).filter(item => {
      const tgt = (item.targetSectionId || '').trim().toLowerCase();
      const id = (item.id || '').trim().toLowerCase();
      return tgt !== 'admin' && tgt !== 'cms' && tgt !== 'administracion' && id !== 'topnav_admin';
    });

    // Fallback de botones estándar si aún no carga el repositorio
    const finalItems = (items && items.length > 0) ? items : [
      { id: "topnav_home", label: "Inicio", targetSectionId: "sec_home" },
      { id: "topnav_ahorros", label: "Ahorros", targetSectionId: "sec_ahorros" },
      { id: "topnav_creditos", label: "Créditos", targetSectionId: "sec_creditos" },
      { id: "topnav_seguros", label: "Seguros", targetSectionId: "sec_seguros" },
      { id: "topnav_remesas", label: "Remesas", targetSectionId: "sec_remesas" },
      { id: "topnav_servicios", label: "Servicios", targetSectionId: "sec_servicios" },
      { id: "topnav_beneficios", label: "Beneficios", targetSectionId: "sec_beneficios" },
      { id: "topnav_sostenibilidad", label: "Sostenibilidad", targetSectionId: "sec_sostenibilidad" },
      { id: "topnav_noticias", label: "Noticias", targetSectionId: "sec_noticias" },
      { id: "topnav_agencias", label: "Agencias", targetSectionId: "sec_agencias" },
      { id: "topnav_nosotros", label: "Nosotros", targetSectionId: "sec_nosotros" },
      { id: "topnav_gobierno", label: "Gobierno Cooperativo", targetSectionId: "sec_nosotros" },
      { id: "topnav_mi_empleo", label: "Mi empleo", targetSectionId: "sec_empleo" }
    ];

    // Excluir Inicio y Perfil de los botones secundarios dinámicos para colocarlos fijamente al inicio
    const navItemsToRender = finalItems.filter(item => {
      const tgt = (item.targetSectionId || '').trim().toLowerCase();
      const id = (item.id || '').trim().toLowerCase();
      return tgt !== 'sec_home' && tgt !== 'inicio' && tgt !== 'home' && id !== 'topnav_home' && id !== 'topnav_inicio' && tgt !== 'perfil';
    });

    return `
      <div class="drawer-overlay" id="drawer-overlay"></div>
      <aside class="sidebar-drawer" id="sidebar-drawer" aria-label="Menú de Navegación Lateral">
        <!-- Cabecera del Usuario / Carné -->
        <div class="drawer-header">
          <div class="drawer-user-info" id="btn-sidebar-profile-header" title="Ver mi carné y perfil">
            <div class="drawer-user-avatar" style="background: transparent; display: flex; align-items: center; justify-content: center; padding: 0;">
              <img src="assets/distintivo_colua.png" alt="COLUA" style="width: 36px; height: 36px; object-fit: contain;" />
            </div>
            <div class="drawer-user-text">
              <h4>${userName}</h4>
              <span>${userRoleText}</span>
            </div>
          </div>
          <button class="btn-close-drawer" id="btn-close-sidebar" aria-label="Cerrar Menú">✕</button>
        </div>

        <!-- Cuerpo del Menú Sándwich con Todos los Botones Dinámicos -->
        <div class="drawer-body">
          
          <!-- Botón Directo al Inicio -->
          <div class="drawer-menu-item" data-route="sec_home">
            <img src="assets/distintivo_colua.png" alt="" style="padding: 2px; width: 22px; height: 22px; object-fit: contain;" />
            <span class="drawer-item-label">Inicio</span>
          </div>

          <!-- Botón Directo al Perfil del Asociado -->
          <div class="drawer-menu-item" data-route="perfil">
            <img src="assets/perfil.png" alt="" onerror="this.src='assets/ic_person.png'" style="width: 22px; height: 22px; object-fit: contain;" />
            <span class="drawer-item-label">Mi Perfil</span>
          </div>

          <div class="drawer-divider-line" style="height: 1px; background: #e2e8f0; margin: 6px 1.2rem;"></div>

          <!-- Botones Dinámicos de la Web (Sincronizados en Tiempo Real con la Barra Superior) -->
          ${navItemsToRender.map(item => {
            const hasSub = Array.isArray(item.subItems) && item.subItems.length > 0;
            const secObj = repo && typeof repo.getAllSectionsSync === 'function'
              ? repo.getAllSectionsSync().find(s => s.id === item.targetSectionId || s.slug === item.targetSectionId)
              : null;
            const effectiveIcon = item.icon || (secObj ? (secObj.icon || secObj.imageUrl) : '');
            const iconHtml = this.getIconHtml(item.targetSectionId, item.label, effectiveIcon);
            const isExpanded = this.expandedGroups.has(item.id);

            if (hasSub) {
              return `
                <div class="drawer-nav-group" id="nav-group-${item.id}">
                  <div class="drawer-menu-item has-subitems ${isExpanded ? 'expanded' : ''}" data-route="${item.targetSectionId || ''}" data-parent-id="${item.id}">
                    ${iconHtml}
                    <span class="drawer-item-label">${item.label}</span>
                    <button type="button" class="drawer-accordion-btn" aria-label="Desplegar sub-opciones" onclick="event.stopPropagation(); window.sidebarComponent?.toggleSubmenu('${item.id}');">
                      <svg class="drawer-menu-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="transform: ${isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'}; transition: transform 0.2s;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                  </div>
                  <div class="drawer-submenu-container" id="drawer-sub-${item.id}" style="display: ${isExpanded ? 'block' : 'none'};">
                    ${item.targetSectionId ? `
                      <div class="drawer-submenu-item main-sublink" data-route="${item.targetSectionId}">
                        <span>Ver ${item.label} Principal →</span>
                      </div>
                    ` : ''}
                    ${item.subItems.map(sub => `
                      <div class="drawer-submenu-item" data-route="${sub.targetSectionId}">
                        <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #2563eb; flex-shrink: 0;"></span>
                        <span>${sub.label}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `;
            } else {
              return `
                <div class="drawer-menu-item" data-route="${item.targetSectionId}">
                  ${iconHtml}
                  <span class="drawer-item-label">${item.label}</span>
                </div>
              `;
            }
          }).join('')}

          <div class="drawer-divider-line" style="height: 1px; background: #e2e8f0; margin: 10px 1.2rem;"></div>

          <!-- Acciones de Utilidad (Instalar App y Sesión) -->
          <div class="drawer-menu-item" id="btn-sidebar-install" style="color: #059669; font-weight: 600;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 2px;">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span class="drawer-item-label">Instalar App Web</span>
          </div>

          ${isGuest ? `
            <div class="drawer-menu-item" id="btn-sidebar-login" style="color: var(--colua-navy); font-weight: 600;">
              <img src="assets/perfil.png" alt="" onerror="this.src='assets/ic_person.png'" />
              <span class="drawer-item-label">Iniciar Sesión / Registro</span>
            </div>
          ` : `
            <div class="drawer-menu-item logout" id="btn-sidebar-logout">
              <img src="assets/cerrar.png" alt="" />
              <span class="drawer-item-label">Cerrar Sesión</span>
            </div>
          `}
        </div>
      </aside>
    `;
  }

  // Alterna el acordeón de sub-opciones
  toggleSubmenu(parentId) {
    const subContainer = document.getElementById(`drawer-sub-${parentId}`);
    const navGroup = document.getElementById(`nav-group-${parentId}`);
    const parentRow = navGroup?.querySelector('.drawer-menu-item.has-subitems');
    const chevron = parentRow?.querySelector('.drawer-menu-chevron');

    if (!subContainer) return;

    if (this.expandedGroups.has(parentId)) {
      this.expandedGroups.delete(parentId);
      subContainer.style.display = 'none';
      if (parentRow) parentRow.classList.remove('expanded');
      if (chevron) chevron.style.transform = 'rotate(0deg)';
    } else {
      this.expandedGroups.add(parentId);
      subContainer.style.display = 'block';
      if (parentRow) parentRow.classList.add('expanded');
      if (chevron) chevron.style.transform = 'rotate(180deg)';
    }
  }

  open() {
    // Sincronizar el contenido antes de abrir para asegurar que cualquier botón nuevo se muestre
    const currentRoute = window.coluaRouter?.currentRoute || window.location.hash || 'sec_home';
    this.refresh();
    this.updateActive(currentRoute);

    this.isOpen = true;
    const overlay = document.getElementById('drawer-overlay');
    const drawer = document.getElementById('sidebar-drawer');
    if (overlay && drawer) {
      overlay.classList.add('open');
      drawer.classList.add('open');
    }
  }

  close(event, instant = false) {
    this.isOpen = false;
    const overlay = document.getElementById('drawer-overlay');
    const drawer = document.getElementById('sidebar-drawer');
    if (overlay && drawer) {
      overlay.classList.remove('open');
      drawer.classList.remove('open');
    }
  }

  refresh() {
    const sideEl = document.getElementById('sidebar-root');
    if (sideEl) {
      sideEl.innerHTML = this.render();
      this.attachEvents();
      this.updateActive(window.coluaRouter?.currentRoute || window.location.hash);
    }
  }

  updateActive(route) {
    const raw = (route || 'sec_home').replace(/^#/, '').toLowerCase();
    const isHome = raw === 'sec_home' || raw === 'inicio' || raw === 'home' || raw === '';

    document.querySelectorAll('#sidebar-drawer [data-route]').forEach(el => {
      const target = el.getAttribute('data-route');
      if (!target) return;
      const targetClean = target.replace(/^sec_/, '').toLowerCase();
      const rawClean = raw.replace(/^sec_/, '').toLowerCase();

      if ((target === 'sec_home' && isHome) || target === raw || targetClean === rawClean) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  attachEvents() {
    const overlay = document.getElementById('drawer-overlay');
    const btnClose = document.getElementById('btn-close-sidebar');

    if (overlay) overlay.onclick = () => this.close();
    if (btnClose) btnClose.onclick = () => this.close();

    // Eventos de clic para todos los botones de ruta (principales y sub-botones)
    document.querySelectorAll('#sidebar-drawer [data-route]').forEach(el => {
      el.addEventListener('click', (e) => {
        // Si se hizo clic en el botón de chevron de acordeón, no navegar
        if (e.target.closest('.drawer-accordion-btn')) return;

        const route = el.getAttribute('data-route');
        if (route) {
          this.close(false, true);
          if (window.coluaRouter) {
            window.coluaRouter.navigate(route);
          } else {
            window.location.hash = '#' + route;
          }
        }
      });
    });

    // Clic en información del perfil de usuario en la cabecera
    const profileHeader = document.getElementById('btn-sidebar-profile-header');
    if (profileHeader) {
      profileHeader.onclick = () => {
        this.close(false, true);
        window.coluaRouter ? window.coluaRouter.navigate('perfil') : (window.location.hash = '#perfil');
      };
    }

    // Botón instalar app
    const btnInstall = document.getElementById('btn-sidebar-install');
    if (btnInstall) {
      btnInstall.onclick = () => {
        this.close(false, true);
        window.app?.promptInstallApp();
      };
    }

    // Botón iniciar sesión
    const btnLogin = document.getElementById('btn-sidebar-login');
    if (btnLogin) {
      btnLogin.onclick = () => {
        this.close(false, true);
        window.app?.showLoginModal();
      };
    }

    // Botón cerrar sesión
    const btnLogout = document.getElementById('btn-sidebar-logout');
    if (btnLogout) {
      btnLogout.onclick = () => {
        this.close(false, true);
        window.app?.showLogoutConfirm && window.app.showLogoutConfirm();
      };
    }
  }
}

window.sidebarComponent = new SidebarComponent();
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.sidebarComponent?.refresh();
    });
  } else {
    window.sidebarComponent?.refresh();
  }
}
