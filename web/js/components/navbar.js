// web/js/components/navbar.js — Barra de Navegación Institucional Minimalista COLUA MICOOPE

class NavbarComponent {
  render(currentRoute = 'sec_home') {
    const clean = (currentRoute || 'sec_home').replace(/^#/, '').toLowerCase();
    const isHome = clean === 'sec_home' || clean === 'inicio' || clean === 'home' || clean === '';
    const user = window.authService?.getCurrentUser();
    const isLoggedIn = window.authService?.isLoggedIn() && !window.authService?.isGuest();
    const isAdmin = window.authService?.isAdmin();

    return `
      <!-- Encabezado Principal de Navegación en Dos Líneas -->
      <header class="navbar-top" id="navbar-top">
        <!-- Fila 1: Marca, Identidad y Acceso Digital -->
        <div class="navbar-top-row">
          <div class="navbar-container">
            <!-- Logo y Toggle Móvil -->
            <div class="navbar-brand-section">
              <button class="btn-menu-toggle mobile-only" id="btn-open-sidebar" aria-label="Abrir Menú Lateral" style="color:#0f172a;margin-right:8px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
              <div class="clean-brand-logo" id="btn-brand-home" title="Ir al Inicio de COLUA MICOOPE">
                <img src="assets/distintivo_colua.png" alt="COLUA R.L." class="clean-brand-badge-img" />
                <div class="clean-brand-text">
                  <span class="clean-brand-colua">COLUA</span>
                  <span class="clean-brand-micoope">MICOOPE</span>
                </div>
              </div>
            </div>

            <!-- Acciones Principales Derecha -->
            <div class="navbar-actions">
              <!-- Botón Instalar App Web -->
              <button class="btn-nav-utility" id="btn-top-install" title="Instalar o agregar COLUA Web Digital a tu dispositivo">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span class="nav-utility-text">Instalar App</span>
              </button>

              <!-- Botón MICOOPE en Línea -->
              <a href="https://micoopeenlinea.com.gt" target="_blank" rel="noopener noreferrer" class="btn-micoope-pill" title="Ingresar a MICOOPE en Línea">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>MICOOPE en Línea</span>
              </a>

              <!-- Botón Iniciar Sesión / Estado de Cuenta (Al lado del icono de perfil) -->
              ${!isLoggedIn ? `
                <button class="btn-nav-utility highlight" id="btn-top-login" title="Iniciar sesión como asociado o administrador">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  <span class="nav-utility-text">Iniciar Sesión</span>
                </button>
              ` : `
                <button class="btn-nav-utility success" id="btn-top-user-status" title="Sesión activa: ${user?.nombre || 'Asociado'}">
                  <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#10b981;"></span>
                  <span class="nav-utility-text">${(user?.nombre || 'Mi Cuenta').split(' ')[0]}</span>
                </button>
              `}

              <!-- Botón Perfil Circular -->
              <button class="btn-user-avatar-circle" id="btn-top-perfil" title="Mi Carné y Perfil de Asociado" aria-label="Perfil de Asociado">
                <img src="assets/perfil.png" alt="Perfil" style="width: 20px; height: 20px; object-fit: contain; filter: brightness(0) invert(1);" />
              </button>
            </div>
          </div>
        </div>

        <!-- Fila 2: Menú de Navegación con Todas las Pantallas -->
        <div class="navbar-menu-row">
          <div class="navbar-container">
            <nav class="desktop-nav-menu" aria-label="Navegación Principal">
              ${this.renderNavItems(clean, isHome)}
            </nav>
          </div>
        </div>
      </header>
    `;
  }

  renderNavItems(clean, isHome) {
    const rawItems = window.coluaRepository ? window.coluaRepository.getTopNavItemsSync() : [];
    const items = (rawItems || []).filter(item => {
      const tgt = (item.targetSectionId || '').trim().toLowerCase();
      const id = (item.id || '').trim().toLowerCase();
      return tgt !== 'admin' && tgt !== 'cms' && tgt !== 'administracion' && id !== 'topnav_admin';
    });

    if (!items || items.length === 0) {
      return `
        <button class="nav-link-btn ${isHome ? 'active' : ''}" data-nav="sec_home" onclick="window.coluaRouter ? window.coluaRouter.navigate('sec_home') : (window.location.hash='#sec_home')">Inicio</button>
        <button class="nav-link-btn ${clean === 'sec_ahorros' || clean === 'ahorros' ? 'active' : ''}" data-nav="sec_ahorros" onclick="window.coluaRouter ? window.coluaRouter.navigate('sec_ahorros') : (window.location.hash='#sec_ahorros')">Ahorros</button>
        <button class="nav-link-btn ${clean === 'sec_creditos' || clean === 'creditos' ? 'active' : ''}" data-nav="sec_creditos" onclick="window.coluaRouter ? window.coluaRouter.navigate('sec_creditos') : (window.location.hash='#sec_creditos')">Créditos</button>
        <button class="nav-link-btn ${clean === 'sec_seguros' || clean === 'seguros' ? 'active' : ''}" data-nav="sec_seguros" onclick="window.coluaRouter ? window.coluaRouter.navigate('sec_seguros') : (window.location.hash='#sec_seguros')">Seguros</button>
        <button class="nav-link-btn ${clean === 'sec_remesas' || clean === 'remesas' ? 'active' : ''}" data-nav="sec_remesas" onclick="window.coluaRouter ? window.coluaRouter.navigate('sec_remesas') : (window.location.hash='#sec_remesas')">Remesas</button>
        <button class="nav-link-btn ${clean === 'sec_servicios' || clean === 'servicios' ? 'active' : ''}" data-nav="sec_servicios" onclick="window.coluaRouter ? window.coluaRouter.navigate('sec_servicios') : (window.location.hash='#sec_servicios')">Servicios</button>
        <button class="nav-link-btn ${clean === 'sec_beneficios' || clean === 'beneficios' ? 'active' : ''}" data-nav="sec_beneficios" onclick="window.coluaRouter ? window.coluaRouter.navigate('sec_beneficios') : (window.location.hash='#sec_beneficios')">Beneficios</button>
        <button class="nav-link-btn ${clean === 'sec_sostenibilidad' || clean === 'sostenibilidad' ? 'active' : ''}" data-nav="sec_sostenibilidad" onclick="window.coluaRouter ? window.coluaRouter.navigate('sec_sostenibilidad') : (window.location.hash='#sec_sostenibilidad')">Sostenibilidad</button>
        <button class="nav-link-btn ${clean === 'sec_noticias' || clean === 'noticias' ? 'active' : ''}" data-nav="sec_noticias" onclick="window.coluaRouter ? window.coluaRouter.navigate('sec_noticias') : (window.location.hash='#sec_noticias')">Noticias</button>
        <button class="nav-link-btn ${clean === 'sec_agencias' || clean === 'agencias' ? 'active' : ''}" data-nav="sec_agencias" onclick="window.coluaRouter ? window.coluaRouter.navigate('sec_agencias') : (window.location.hash='#sec_agencias')">Agencias</button>
        <button class="nav-link-btn ${clean === 'sec_nosotros' || clean === 'nosotros' ? 'active' : ''}" data-nav="sec_nosotros" onclick="window.coluaRouter ? window.coluaRouter.navigate('sec_nosotros') : (window.location.hash='#sec_nosotros')">Nosotros</button>
        <button class="nav-link-btn ${clean === 'sec_nosotros' ? 'active' : ''}" data-nav="sec_nosotros" onclick="window.coluaRouter ? window.coluaRouter.navigate('sec_nosotros') : (window.location.hash='#sec_nosotros')">Gobierno Cooperativo</button>
        <button class="nav-link-btn ${clean === 'sec_empleo' || clean === 'empleo' ? 'active' : ''}" data-nav="sec_empleo" onclick="window.coluaRouter ? window.coluaRouter.navigate('sec_empleo') : (window.location.hash='#sec_empleo')">Mi empleo</button>
      `;
    }

    return items.map(item => {
      const tgt = (item.targetSectionId || '').trim();
      const tgtClean = tgt.replace(/^sec_/, '').toLowerCase();
      const hasSub = Array.isArray(item.subItems) && item.subItems.length > 0;
      
      let isSubActive = false;
      if (hasSub) {
        isSubActive = item.subItems.some(sub => {
          const sTgt = (sub.targetSectionId || '').trim().replace(/^sec_/, '').toLowerCase();
          return sTgt === clean || sub.targetSectionId === clean;
        });
      }

      const isActive = (tgt === 'sec_home' && isHome) || (tgtClean === clean) || (tgt.toLowerCase() === clean) || isSubActive;

      if (hasSub) {
        return `
          <div class="nav-dropdown-wrapper">
            <button class="nav-link-btn nav-has-dropdown ${isActive ? 'active' : ''}" data-nav="${tgt}" onclick="if('${tgt}'){ window.coluaRouter ? window.coluaRouter.navigate('${tgt}') : (window.location.hash='#${tgt}') }">
              <span>${item.label}</span>
              <svg class="dropdown-chevron-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="nav-dropdown-content">
              ${tgt ? `
                <a href="#${tgt}" class="nav-dropdown-item main-link" onclick="event.preventDefault(); window.coluaRouter ? window.coluaRouter.navigate('${tgt}') : (window.location.hash='#${tgt}')">
                  Ver ${item.label} →
                </a>
                <div class="nav-dropdown-divider"></div>
              ` : ''}
              ${(item.subItems || []).filter(sub => sub.isVisible !== false).map(sub => `
                <a href="#${sub.targetSectionId}" class="nav-dropdown-item" onclick="event.preventDefault(); window.coluaRouter ? window.coluaRouter.navigate('${sub.targetSectionId}') : (window.location.hash='#${sub.targetSectionId}')">
                  ${sub.label}
                </a>
              `).join('')}
            </div>
          </div>
        `;
      } else {
        return `
          <button class="nav-link-btn ${isActive ? 'active' : ''}" data-nav="${tgt}" onclick="window.coluaRouter ? window.coluaRouter.navigate('${tgt}') : (window.location.hash='#${tgt}')">
            ${item.label}
          </button>
        `;
      }
    }).join('');
  }

  refresh() {
    const navEl = document.getElementById('navbar-root');
    if (navEl) {
      const currentRoute = window.router?.currentRoute || window.location.hash || 'sec_home';
      navEl.innerHTML = this.render(currentRoute);
      this.attachEvents();
    }
    // Sincronizar automáticamente el menú sándwich lateral para móviles y tablets
    window.sidebarComponent?.refresh();
  }

  attachEvents() {
    // Sidebar toggle (móvil)
    const btnOpen = document.getElementById('btn-open-sidebar');
    if (btnOpen) {
      btnOpen.onclick = () => window.sidebarComponent?.open();
    }

    // Clic en el logo
    const brand = document.getElementById('btn-brand-home');
    if (brand) {
      brand.onclick = () => window.coluaRouter?.navigate('sec_home');
    }

    // Botón Instalar App
    const btnInstall = document.getElementById('btn-top-install');
    if (btnInstall) {
      btnInstall.onclick = () => window.app?.promptInstallApp();
    }

    // Botón Iniciar Sesión
    const btnLogin = document.getElementById('btn-top-login');
    if (btnLogin) {
      btnLogin.onclick = () => window.app?.showLoginModal();
    }

    // Botón Estado de Usuario
    const btnUserStatus = document.getElementById('btn-top-user-status');
    if (btnUserStatus) {
      btnUserStatus.onclick = () => window.coluaRouter?.navigate('perfil');
    }

    // Botones de navegación desktop
    document.querySelectorAll('.desktop-nav-menu .nav-link-btn[data-nav]').forEach(btn => {
      btn.onclick = () => {
        const target = btn.getAttribute('data-nav');
        if (target) window.coluaRouter?.navigate(target);
      };
    });

    // Botón perfil
    const btnPerfil = document.getElementById('btn-top-perfil');
    if (btnPerfil) {
      btnPerfil.onclick = () => window.coluaRouter?.navigate('perfil');
    }
  }

  updateActive(route) {
    const raw = (route || 'sec_home').replace(/^#/, '').toLowerCase();
    const isHome = raw === 'sec_home' || raw === 'inicio' || raw === 'home' || raw === '';

    document.querySelectorAll('.desktop-nav-menu .nav-link-btn').forEach(btn => {
      const target = btn.getAttribute('data-nav');
      if (!target) return;
      const targetClean = target.replace(/^sec_/, '');
      const rawClean = raw.replace(/^sec_/, '');

      if ((target === 'sec_home' && isHome) || target === raw || targetClean === rawClean) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

window.navbarComponent = new NavbarComponent();

