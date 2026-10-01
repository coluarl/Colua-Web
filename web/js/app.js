// web/js/app.js — Bootstrap COLUA Web Digital

const App = {
    modalEl: null,
    toastContainer: null,
    deferredInstallPrompt: null,

    init() {
        console.log('[COLUA] Iniciando app...');

        // 1. Containers para modal y toasts
        try { this._setupContainers(); } catch (e) { console.error('Error setupContainers:', e); }

        // 2. Insertar navbar en el DOM
        try {
            const navEl = document.getElementById('navbar-root');
            if (navEl && window.navbarComponent) {
                navEl.innerHTML = window.navbarComponent.render();
                window.navbarComponent.attachEvents();
            }
        } catch (e) { console.error('Error navbar:', e); }

        // 3. Insertar sidebar en el DOM
        try {
            const sideEl = document.getElementById('sidebar-root');
            if (sideEl && window.sidebarComponent) {
                sideEl.innerHTML = window.sidebarComponent.render();
                window.sidebarComponent.attachEvents();
            }
        } catch (e) { console.error('Error sidebar:', e); }

        // 4. Insertar bottom-nav en el DOM
        try {
            const botEl = document.getElementById('bottom-nav-root');
            if (botEl && window.bottomNavComponent) {
                botEl.innerHTML = window.bottomNavComponent.render();
                window.bottomNavComponent.attachEvents();
            }
        } catch (e) { console.error('Error bottomNav:', e); }

        // 4.5. Insertar Pie de Página Global Minimalista
        try { this._setupFooter(); } catch (e) { console.error('Error footer:', e); }

        // 5. Chatbot
        try {
            if (window.chatbotComponent) window.chatbotComponent.init();
        } catch (e) { console.error('Error chatbot:', e); }

        // 6. Arrancar router (carga la primera vista)
        try {
            if (window.router) {
                window.router.init('main-content');
            }
        } catch (e) { console.error('Error router:', e); }

        // 7. PWA
        try {
            this._registerSW();
            this._setupInstallPrompt();
            window.addEventListener('offline', () => this.showToast('Sin conexión — usando datos en caché', 'warning'));
            window.addEventListener('online', () => this.showToast('Conexión restablecida', 'success'));
        } catch (e) { }

        // 8. Sincronización en la nube en tiempo real (Firestore)
        try {
            if (window.coluaRepository) {
                window.coluaRepository.syncAllFromCloud().then((synced) => {
                    if (window.navbarComponent && typeof window.navbarComponent.refresh === 'function') {
                        window.navbarComponent.refresh();
                    }
                    if (synced && window.router && (window.location.hash === '#inicio' || window.location.hash === '' || window.location.hash === '#/')) {
                        window.router.handleRouting();
                    }
                });
                window.coluaRepository.subscribeToPublishedConfig(() => {
                    if (window.navbarComponent && typeof window.navbarComponent.refresh === 'function') {
                        window.navbarComponent.refresh();
                    }
                    if (window.router) window.router.handleRouting();
                });
            }
        } catch (e) {
            console.warn('[COLUA] Error iniciando sincronización cloud:', e);
        }

        console.log('[COLUA] App lista.');
    },

    // ── Pie de Página Global Minimalista ───────────
    _setupFooter() {
        const footEl = document.getElementById('footer-root');
        if (!footEl) return;
        footEl.innerHTML = `
          <footer class="clean-footer">
            <div class="clean-footer-container">
              <!-- Columna 1 -->
              <div class="clean-footer-col">
                <div class="clean-footer-brand-title">
                  <img src="assets/logo_composite.png" alt="COLUA MICOOPE R.L." class="clean-footer-logo" />
                </div>
                <p class="clean-footer-desc">
                  Entidad cooperativa federada al Sistema MICOOPE. Solidez, confianza y desarrollo financiero cooperativo con sentido humano en Guatemala.
                </p>
              </div>

              <!-- Columna 2 -->
              <div class="clean-footer-col">
                <h4 class="clean-footer-col-header">SOLUCIONES FINANCIERAS</h4>
                <ul class="clean-footer-list">
                  <li><a href="#sec_ahorros">Cuentas de Ahorro Corriente y Plazo Fijo</a></li>
                  <li><a href="#sec_creditos">Préstamos Fiduciarios e Hipotecarios</a></li>
                  <li><a href="#sec_servicios">Tarjetas de Débito y Crédito MICOOPE</a></li>
                </ul>
              </div>

              <!-- Columna 3 -->
              <div class="clean-footer-col">
                <h4 class="clean-footer-col-header">ATENCIÓN AL ASOCIADO</h4>
                <ul class="clean-footer-list">
                  <li><a href="#sec_agencias">Red de Agencias y Cajeros 5B</a></li>
                  <li><a href="tel:77957795">Canales de Atención y PBX</a></li>
                  <li><a href="#sec_sostenibilidad">Educación y Gobernanza Cooperativa</a></li>
                </ul>
              </div>

              <!-- Columna 4 -->
              <div class="clean-footer-col">
                <h4 class="clean-footer-col-header">SEGURIDAD Y NORMATIVA</h4>
                <p class="clean-footer-normative-text">
                  Supervisados por la Inspección General de Cooperativas (INGECOP) y respaldados por el Fondo de Garantía MICOOPE.
                </p>
                <div>
                  <a href="tel:77957795" class="clean-footer-pbx-link">PBX: (502) 7795-7795</a>
                </div>
              </div>
            </div>

            <!-- Barra Inferior de Derechos y Enlaces Legales -->
            <div class="clean-footer-bottom-row">
              <div class="clean-footer-bottom-wrap">
                <span>© 2026 COLUA MICOOPE R.L. Todos los derechos reservados.</span>
                <div class="clean-footer-links-inline">
                  <a href="#terminos" onclick="event.preventDefault(); App.showModal({title:'Términos de Servicio', body:'Cooperativa COLUA R.L. opera bajo los estándares del Sistema MICOOPE y las leyes cooperativas vigentes en la República de Guatemala.'})">Términos de Servicio</a>
                  <a href="#privacidad" onclick="event.preventDefault(); App.showModal({title:'Políticas de Privacidad', body:'Tus datos personales y financieros están protegidos bajo estrictos protocolos de confidencialidad y secreto bancario cooperativo.'})">Políticas de Privacidad</a>
                </div>
              </div>
            </div>
          </footer>
        `;
    },

    // ── Containers & Historial ─────────────────────
    _isModalOpen: false,
    _historyPushedForModal: false,
    _historyNavInitialized: false,

    _setupContainers() {
        if (!document.getElementById('colua-global-modal')) {
            const m = document.createElement('div');
            m.id = 'colua-global-modal';
            m.className = 'modal-backdrop';
            m.style.display = 'none';
            m.innerHTML = `
                <div class="modal-card">
                    <div class="modal-drag-handle" title="Desliza hacia abajo para cerrar"></div>
                    <button class="modal-close-btn" onclick="app.closeModal()" aria-label="Cerrar">✕</button>
                    <div id="modal-inner-content"></div>
                </div>
            `;
            document.body.appendChild(m);
            m.addEventListener('click', e => {
                if (e.target === m) this.closeModal();
            });

            // Soporte de Gestos Táctiles Móviles / iPhone (Swipe down to dismiss)
            const card = m.querySelector('.modal-card');
            if (card) {
                let startY = 0;
                let currentY = 0;
                let isDragging = false;
                let startTime = 0;

                card.addEventListener('touchstart', (e) => {
                    if (card.scrollTop > 5) return;
                    startY = e.touches[0].clientY;
                    currentY = startY;
                    startTime = Date.now();
                    isDragging = true;
                    card.style.transition = 'none';
                }, { passive: true });

                card.addEventListener('touchmove', (e) => {
                    if (!isDragging) return;
                    currentY = e.touches[0].clientY;
                    const diffY = currentY - startY;
                    if (diffY > 0 && card.scrollTop <= 0) {
                        const translateY = Math.min(diffY, 320);
                        const opacity = Math.max(0.4, 1 - (translateY / 400));
                        card.style.transform = `translateY(${translateY}px)`;
                        m.style.backgroundColor = `rgba(15, 23, 42, ${0.65 * opacity})`;
                    } else if (diffY < 0) {
                        isDragging = false;
                        card.style.transform = '';
                    }
                }, { passive: true });

                card.addEventListener('touchend', (e) => {
                    if (!isDragging) return;
                    isDragging = false;
                    const diffY = currentY - startY;
                    const timeDiff = Date.now() - startTime;
                    const velocity = diffY / (timeDiff || 1);

                    card.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease';

                    if ((diffY > 75 && card.scrollTop <= 0) || (velocity > 0.45 && diffY > 25)) {
                        card.style.transform = 'translateY(100%)';
                        m.style.backgroundColor = 'transparent';
                        setTimeout(() => {
                            this.closeModal();
                            card.style.transform = '';
                            m.style.backgroundColor = '';
                            card.style.transition = '';
                        }, 220);
                    } else {
                        card.style.transform = '';
                        m.style.backgroundColor = '';
                        setTimeout(() => { card.style.transition = ''; }, 250);
                    }
                }, { passive: true });
            }

            this.modalEl = m;
        } else {
            this.modalEl = document.getElementById('colua-global-modal');
        }

        if (!document.getElementById('colua-toast-container')) {
            const t = document.createElement('div');
            t.id = 'colua-toast-container';
            t.className = 'toast-container';
            document.body.appendChild(t);
            this.toastContainer = t;
        } else {
            this.toastContainer = document.getElementById('colua-toast-container');
        }

        this._setupHistoryNavigation();
    },

    _setupHistoryNavigation() {
        if (this._historyNavInitialized) return;
        this._historyNavInitialized = true;

        // Soporte tecla Escape en computadoras y laptops para cerrar modales o menús
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const lightbox = document.getElementById('colua-news-lightbox');
                if (lightbox) {
                    if (window.noticiasComponent && typeof window.noticiasComponent.closeLightbox === 'function') {
                        window.noticiasComponent.closeLightbox();
                    } else {
                        lightbox.style.opacity = '0';
                        setTimeout(() => lightbox.remove(), 180);
                    }
                    return;
                }
                if (this._isModalOpen) {
                    this.closeModal();
                    return;
                }
                if (window.sidebarComponent && window.sidebarComponent.isOpen) {
                    window.sidebarComponent.close();
                    return;
                }
                if (window.chatbotComponent && window.chatbotComponent.isOpen) {
                    window.chatbotComponent.toggleChat(false);
                    return;
                }
            }
        });
    },

    // ── Modal ──────────────────────────────────────
    showModal(contentOrObj) {
        if (!this.modalEl) this._setupContainers();
        const inner = document.getElementById('modal-inner-content');
        if (!inner) return;

        if (typeof contentOrObj === 'string') {
            inner.innerHTML = contentOrObj;
        } else if (contentOrObj && typeof contentOrObj === 'object') {
            // Formato { title, body, confirmText, onConfirm }
            inner.innerHTML = `
                <h3 style="font-size:1.15rem;font-weight:700;color:var(--colua-navy);margin-bottom:12px;">${contentOrObj.title || ''}</h3>
                <div>${contentOrObj.body || ''}</div>
                ${contentOrObj.confirmText ? `<div style="margin-top:16px;text-align:right;"><button class="btn btn-primary" id="modal-confirm-action">${contentOrObj.confirmText}</button></div>` : ''}
            `;
            if (contentOrObj.onConfirm) {
                document.getElementById('modal-confirm-action')?.addEventListener('click', contentOrObj.onConfirm);
            }
        }

        const card = this.modalEl.querySelector('.modal-card');
        if (card) {
            card.style.transform = '';
            card.style.transition = '';
            card.scrollTop = 0;
        }
        this.modalEl.style.backgroundColor = '';
        this.modalEl.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this._isModalOpen = true;
    },

    closeModal() {
        if (this.modalEl) {
            this.modalEl.style.display = 'none';
            document.body.style.overflow = '';
            const card = this.modalEl.querySelector('.modal-card');
            if (card) {
                card.style.transform = '';
                card.style.transition = '';
            }
            this.modalEl.style.backgroundColor = '';
        }
        this._isModalOpen = false;
    },

    // ── Ficha Informativa Completa (Ver Más Detalles de Producto / Tarjeta) ─────
    async showItemInfoModal(itemIdOrItem) {
        let item = itemIdOrItem;
        if (typeof itemIdOrItem === 'string') {
            if (window.coluaRepository) {
                const db = window.coluaRepository.getLocalDb();
                item = (db.content_items || []).find(i => i.id === itemIdOrItem);
            }
        }
        if (!item) return;

        let blocks = [];
        try {
            if (window.coluaRepository && item.id) {
                blocks = await window.coluaRepository.getContentBlocksByItem(item.id);
            }
        } catch (e) { }

        const isPdf = item.type === 'pdf_document' || actionTarget.startsWith('pdf:') || actionTarget.toLowerCase().endsWith('.pdf') || (item.pdfUrl && item.pdfUrl.length > 0);
        const iconImg = item.imageUrl || item.imagePath || (isPdf ? 'assets/distintivo_colua.png' : 'assets/distintivo_colua.png');
        const subtitleParts = item.subtitle ? item.subtitle.split(',').map(s => s.trim()).filter(Boolean) : [];
        const actionTarget = item.buttonAction || item.targetSectionId || 'tel:77957795';
        const defaultActionText = isPdf ? 'Ver Documento PDF ↗' : (actionTarget.startsWith('tel:') ? 'Contactar por PBX: 7795-7795' : 'Gestionar Servicio');
        const actionText = item.buttonText || defaultActionText;

        const isTel = !isPdf && actionTarget.startsWith('tel:');
        const isHttp = !isPdf && actionTarget.startsWith('http');
        const isHash = !isPdf && actionTarget.startsWith('#');

        let ctaClick = `window.location.href='tel:77957795'`;
        if (isPdf) {
            const rawPdf = item.pdfUrl || (actionTarget.startsWith('pdf:') ? actionTarget.replace(/^pdf:/, '') : actionTarget);
            ctaClick = `app.openItemPdf('${item.id}', '${encodeURI(rawPdf).replace(/'/g, "\\'")}')`;
        } else if (isTel) {
            ctaClick = `window.location.href='${actionTarget}'`;
        } else if (isHttp) {
            ctaClick = `window.open('${actionTarget}','_blank')`;
        } else if (isHash) {
            ctaClick = `app.closeModal(); if(window.coluaRouter) window.coluaRouter.navigate('${actionTarget.replace('#', '')}'); else window.location.hash='${actionTarget}';`;
        }

        const modalHtml = `
            <div style="max-width: 540px; width: 100%; text-align: left;">
                <!-- Cabecera Institucional del Elemento -->
                <div style="display: flex; gap: 14px; align-items: flex-start; margin-bottom: 16px; border-bottom: 1px solid var(--colua-gray-200); padding-bottom: 16px;">
                    <div style="width: 58px; height: 58px; border-radius: 12px; background: ${isPdf ? '#fef2f2' : '#ffffff'}; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1.5px solid ${isPdf ? '#fecaca' : 'var(--colua-gray-200)'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; padding: 6px;">
                        ${isPdf ? `
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                        ` : `
                            <img src="${iconImg}" alt="${item.title}" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.src='assets/distintivo_colua.png'" />
                        `}
                    </div>
                    <div style="flex: 1;">
                        <span class="badge" style="background: ${isPdf ? '#fee2e2' : 'rgba(23, 55, 137, 0.08)'}; color: ${isPdf ? '#dc2626' : 'var(--colua-navy)'}; font-size: 0.72rem; font-weight: 700; margin-bottom: 4px; display: inline-block;">
                            ${isPdf ? '📄 Documento Oficial en PDF' : 'Información Detallada Oficial'}
                        </span>
                        <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--colua-navy); margin: 0 0 4px 0; line-height: 1.25;">
                            ${item.title}
                        </h3>
                        ${item.shortDescription || item.subtitle ? `
                            <p style="font-size: 0.86rem; color: var(--colua-gray-600); margin: 0; font-weight: 500;">
                                ${item.shortDescription || item.subtitle}
                            </p>
                        ` : ''}
                    </div>
                </div>

                <!-- Descripción Completa -->
                ${item.description ? `
                    <div style="margin-bottom: 16px; background: #f8fafc; border-radius: 10px; padding: 14px; border: 1px solid var(--colua-gray-200);">
                        <span style="font-size: 0.74rem; font-weight: 700; color: var(--colua-gray-500); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">
                            ${isPdf ? 'Detalles del Documento' : 'Acerca de este producto o servicio'}
                        </span>
                        <p style="font-size: 0.9rem; color: var(--colua-gray-800); margin: 0; line-height: 1.55;">
                            ${item.description}
                        </p>
                    </div>
                ` : ''}

                <!-- Atributos y Condiciones -->
                ${subtitleParts.length > 0 && !isPdf ? `
                    <div style="margin-bottom: 16px;">
                        <span style="font-size: 0.74rem; font-weight: 700; color: var(--colua-gray-500); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px;">
                            Características Principales & Beneficios
                        </span>
                        <div style="display: flex; flex-direction: column; gap: 6px;">
                            ${subtitleParts.map(part => `
                                <div style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; color: var(--colua-gray-700); background: #ffffff; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--colua-gray-200);">
                                    <span style="color: var(--colua-green); font-weight: 800; font-size: 1rem;">✓</span>
                                    <span>${part}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Bloques Atómicos Adjuntos (Requisitos, Notas, Destacados) -->
                ${blocks && blocks.length > 0 ? `
                    <div style="margin-bottom: 18px;">
                        <span style="font-size: 0.74rem; font-weight: 700; color: var(--colua-gray-500); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px;">
                            Requisitos e Información Complementaria
                        </span>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            ${blocks.map(b => `
                                <div style="padding: 10px 12px; background: ${b.blockType === 'callout' ? '#fef3c7' : (b.blockType === 'highlight' ? '#eff6ff' : '#f8fafc')}; border: 1px solid ${b.blockType === 'callout' ? '#fde68a' : (b.blockType === 'highlight' ? '#bfdbfe' : '#e2e8f0')}; border-radius: 8px; font-size: 0.86rem; color: var(--colua-gray-800); line-height: 1.45;">
                                    ${b.blockType === 'bullet' ? `• ` : ''}${b.content}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Botones de Acción -->
                <div style="display: flex; gap: 10px; justify-content: flex-end; border-top: 1px solid var(--colua-gray-200); padding-top: 16px; margin-top: 10px;">
                    <button type="button" class="btn btn-outline" onclick="app.closeModal()" style="padding: 9px 16px; font-size: 0.88rem;">
                        Cerrar
                    </button>
                    <button type="button" class="btn ${isPdf ? '' : 'btn-primary'}" onclick="${ctaClick}" style="padding: 9px 20px; font-size: 0.88rem; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; ${isPdf ? 'background: #dc2626; color: #ffffff; border: none; border-radius: 8px; box-shadow: 0 2px 6px rgba(220,38,38,0.25); cursor: pointer;' : ''}">
                        ${isTel ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>` : ''}
                        ${isPdf ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>` : ''}
                        <span>${actionText}</span>
                    </button>
                </div>
            </div>
        `;

        this.showModal(modalHtml);
    },

    // ── Abrir Documento PDF en Nueva Pestaña (Navegador adicional) ────────────
    async openItemPdf(itemId, fallbackUrl = '') {
        try {
            let pdfUrl = fallbackUrl ? decodeURI(fallbackUrl) : '';
            let title = 'Documento Oficial COLUA';

            if (window.coluaRepo && itemId) {
                try {
                    const item = await window.coluaRepo.getItemById(itemId);
                    if (item) {
                        title = item.title || title;
                        if (item.pdfUrl) {
                            pdfUrl = item.pdfUrl;
                        } else if (item.buttonAction && item.buttonAction.startsWith('pdf:')) {
                            pdfUrl = item.buttonAction.replace('pdf:', '').trim();
                        } else if (item.buttonAction && (item.buttonAction.toLowerCase().endsWith('.pdf') || item.buttonAction.startsWith('data:application/pdf') || item.buttonAction.includes('indexeddb:'))) {
                            pdfUrl = item.buttonAction.trim();
                        }
                    }
                } catch (errRepo) {
                    console.warn('[COLUA] Error obteniendo item por ID en openItemPdf:', errRepo);
                }
            }

            if (pdfUrl && pdfUrl.startsWith('pdf:')) {
                pdfUrl = pdfUrl.replace(/^pdf:/, '').trim();
            }

            if (window.openPdfDocument) {
                await window.openPdfDocument(pdfUrl, title, itemId);
            } else if (pdfUrl) {
                window.open(pdfUrl, '_blank', 'noopener,noreferrer');
            } else {
                if (this.showNotification) {
                    this.showNotification('No se encontró el archivo PDF en el almacenamiento.', 'error');
                } else {
                    alert('No se encontró el archivo PDF en el almacenamiento.');
                }
            }
        } catch (e) {
            console.error('Error al abrir PDF:', e);
            if (fallbackUrl) {
                if (window.openPdfDocument) {
                    window.openPdfDocument(fallbackUrl, 'Documento Oficial');
                } else {
                    window.open(decodeURI(fallbackUrl), '_blank');
                }
            }
        }
    },

    // ── Formulario Dinámico / Preguntas y Respuestas / Captación Directa ───────
    async showDynamicFormModal(formId = 'form_asociate') {
        let form = null;
        if (typeof formId === 'object' && formId !== null) {
            form = formId;
        } else if (window.coluaRepository) {
            form = await window.coluaRepository.getFormById(formId);
            if (!form) {
                const db = window.coluaRepository.getLocalDb();
                const item = (db.content_items || []).find(i => i.id === formId);
                if (item) {
                    form = {
                        id: item.id,
                        title: item.title,
                        subtitle: item.subtitle || item.description,
                        buttonText: item.buttonText || 'Enviar mis Respuestas',
                        leadWhatsapp: item.leadWhatsapp || '50277957795',
                        fields: (item.formQuestions || []).map(q => ({
                            id: q.id || 'field_' + Math.random().toString(36).substring(2, 7),
                            label: q.question || q.label || 'Campo',
                            type: q.type || 'text',
                            required: q.required !== false,
                            placeholder: q.placeholder || '',
                            options: q.options || []
                        })),
                        requirements: item.benefitItems || []
                    };
                }
            }
        }

        if (!form || !form.fields || form.fields.length === 0) {
            form = {
                id: form?.id || 'form_asociate',
                title: 'Solicitud para Asociarte a COLUA MICOOPE',
                subtitle: 'Requisitos: DPI, Recibo de Luz y Aportación Inicial de Q100.00. Completa tus datos para asociarte.',
                buttonText: 'Enviar Solicitud',
                leadWhatsapp: form?.leadWhatsapp || '50277957795',
                requirements: form?.requirements || [
                    'DPI vigente original o copia legible (o Certificado de Nacimiento)',
                    'Recibo de luz, agua o teléfono reciente',
                    'Aportación inicial mínima de Q 100.00'
                ],
                fields: [
                    { id: 'nombre', label: 'Nombre y Apellido', type: 'text', required: true, placeholder: 'Ej: Juan Gómez' },
                    { id: 'telefono', label: 'Teléfono / WhatsApp', type: 'tel', required: true, placeholder: 'Ej: 5555-1234' },
                    { id: 'email', label: 'Correo Electrónico', type: 'email', required: false, placeholder: 'Ej: juangomez@gmail.com' },
                    { id: 'dpi', label: 'Número de DPI / CUI', type: 'text', required: false, placeholder: 'Ej: 1234 56789 0101' },
                    { id: 'foto_dpi_frente', label: 'Foto de tu DPI - Frente (Anverso)', type: 'file', required: false },
                    { id: 'foto_dpi_reverso', label: 'Foto de tu DPI - Atrás (Reverso)', type: 'file', required: false },
                    { id: 'foto_recibo_luz', label: 'Foto de tu Recibo de Luz / Agua reciente', type: 'file', required: false },
                    { id: 'metodo_pago', label: 'Forma de pago de aportación inicial (Q100.00)', type: 'select', required: true, options: ['Pago en Efectivo en Agencia', 'Transferencia Bancaria', 'Coordinar con Asesor por WhatsApp'] },
                    { id: 'consulta', label: '¿Alguna duda o comentario adicional?', type: 'textarea', required: false, placeholder: 'Escribe aquí tu duda o mejor horario para llamarte...' }
                ]
            };
        } else {
            // Garantizar que el botón siempre sea 'Enviar Solicitud'
            form.buttonText = 'Enviar Solicitud';

            // Garantizar que si el formulario tiene foto_dpi antiguo, se descomponga en Frente y Reverso
            const hasDpiFrente = form.fields.some(f => f.id === 'foto_dpi_frente');
            if (!hasDpiFrente) {
                const oldIdx = form.fields.findIndex(f => f.id === 'foto_dpi');
                const dualFields = [
                    { id: 'foto_dpi_frente', label: 'Foto de tu DPI - Frente (Anverso)', type: 'file', required: false },
                    { id: 'foto_dpi_reverso', label: 'Foto de tu DPI - Atrás (Reverso)', type: 'file', required: false }
                ];
                if (oldIdx >= 0) {
                    form.fields.splice(oldIdx, 1, ...dualFields);
                } else {
                    const dpiIdx = form.fields.findIndex(f => f.id === 'dpi');
                    if (dpiIdx >= 0) {
                        form.fields.splice(dpiIdx + 1, 0, ...dualFields);
                    } else {
                        form.fields.push(...dualFields);
                    }
                }
            }

        if (form.id === 'form_asociate' || (form.title && form.title.toLowerCase().includes('consultas'))) {
            form.title = 'Solicitud para Asociarte a COLUA MICOOPE';
            form.subtitle = 'Requisitos: DPI, Recibo de Luz y Aportación Inicial de Q100.00. Completa tus datos para asociarte.';
        }

        this._formUploadedFiles = {};

        const modalHtml = `
            <div style="max-width: 580px; width: 100%; text-align: left;">
                <!-- Encabezado Institucional -->
                <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 14px; border-bottom: 1.5px solid var(--colua-gray-200); padding-bottom: 14px;">
                    <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(23, 55, 137, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <img src="assets/distintivo_colua.png" alt="COLUA" style="width: 32px; height: 32px; object-fit: contain;" />
                    </div>
                    <div>
                        <span class="badge" style="background: var(--colua-navy); color: white; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 6px; letter-spacing: 0.4px;">FORMULARIO INTERACTIVO</span>
                        <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--colua-navy); margin: 2px 0 0 0; line-height: 1.25;">
                            ${form.title}
                        </h2>
                    </div>
                </div>

                <p style="font-size: 0.86rem; color: #475569; margin: 0 0 16px 0; line-height: 1.45;">
                    ${form.subtitle || 'Por favor ingresa tus respuestas en los campos a continuación.'}
                </p>

                <!-- Caja Destacada de Requisitos / Instrucciones -->
                ${form.requirements && form.requirements.length > 0 ? `
                    <div style="background: linear-gradient(135deg, #f0f7ff 0%, #e0effe 100%); border: 1.5px solid #bae6fd; border-radius: 12px; padding: 12px 16px; margin-bottom: 16px;">
                        <div style="font-size: 0.8rem; font-weight: 800; color: #0369a1; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                            Requisitos Previos:
                        </div>
                        <ul style="margin: 0; padding-left: 20px; font-size: 0.84rem; color: #0f172a; line-height: 1.45; font-weight: 500;">
                            ${form.requirements.map(req => `<li style="margin-bottom: 3px;">${req}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                <!-- Formulario de Preguntas & Respuestas -->
                <form id="dynamic-lead-form" novalidate style="display: flex; flex-direction: column; gap: 12px; max-height: 52vh; overflow-y: auto; padding-right: 4px;">
                    ${form.fields.map(f => {
            if (f.id === 'foto_dpi_frente') {
                // Renderizar contenedor especializado para subir DOS fotos de DPI (Frente y Reverso)
                return `
                    <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 12px 14px; margin: 4px 0;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <label style="font-size: 0.84rem; font-weight: 800; color: var(--colua-navy); margin: 0; display: flex; align-items: center; gap: 6px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><line x1="15" y1="8" x2="17" y2="8"/><line x1="15" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="17" y2="16"/></svg>
                                Fotos de tu DPI (Ambos lados) ${f.required ? '<span style="color: #ef4444;">*</span>' : ''}
                            </label>
                            <span style="font-size: 0.7rem; color: #0369a1; background: #e0f2fe; padding: 2px 8px; border-radius: 10px; font-weight: 700;">2 Fotos</span>
                        </div>
                        <p style="font-size: 0.75rem; color: #64748b; margin: 0 0 10px 0;">Sube una foto clara del <strong>Anverso (Frente)</strong> y del <strong>Reverso (Atrás)</strong> de tu DPI.</p>
                        
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px;">
                            <!-- 1. DPI Frente (Anverso) -->
                            <div style="border: 2px dashed #93c5fd; border-radius: 10px; padding: 10px; text-align: center; background: #ffffff; transition: all 0.2s;" id="dropzone-foto_dpi_frente">
                                <input type="file" id="lead-foto_dpi_frente" name="foto_dpi_frente" data-label="Foto de tu DPI - Frente (Anverso)" accept="image/*,application/pdf" style="display: none;" onchange="app.handleFormFileUpload('foto_dpi_frente', this)" />
                                <label for="lead-foto_dpi_frente" style="cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; margin: 0;">
                                    <span class="badge" style="background: #173789; color: white; font-size: 0.68rem; font-weight: 800; padding: 2px 7px; border-radius: 4px;">1. ANVERSO (FRENTE)</span>
                                    <div style="display: flex; align-items: center; gap: 6px; color: #166534; font-weight: 700; font-size: 0.8rem;">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                                        <span id="preview-text-foto_dpi_frente">Foto del Frente</span>
                                    </div>
                                    <span style="font-size: 0.69rem; color: #64748b;">Lado con fotografía y CUI</span>
                                </label>
                                <div id="preview-img-container-foto_dpi_frente" style="display: none; margin-top: 6px; text-align: center;">
                                    <img id="preview-img-foto_dpi_frente" src="" style="max-height: 90px; max-width: 100%; border-radius: 6px; border: 1.5px solid #86efac; box-shadow: 0 2px 4px rgba(0,0,0,0.06); object-fit: contain;" />
                                    <span id="preview-filename-foto_dpi_frente" style="display: block; font-size: 0.68rem; color: #15803d; font-weight: 600; margin-top: 2px;"></span>
                                    <button type="button" onclick="app.clearFormFileUpload('foto_dpi_frente')" style="background: #fee2e2; color: #b91c1c; border: none; border-radius: 4px; font-size: 0.68rem; font-weight: 700; padding: 2px 8px; margin-top: 4px; cursor: pointer;">✕ Quitar foto</button>
                                </div>
                            </div>

                            <!-- 2. DPI Atrás (Reverso) -->
                            <div style="border: 2px dashed #93c5fd; border-radius: 10px; padding: 10px; text-align: center; background: #ffffff; transition: all 0.2s;" id="dropzone-foto_dpi_reverso">
                                <input type="file" id="lead-foto_dpi_reverso" name="foto_dpi_reverso" data-label="Foto de tu DPI - Atrás (Reverso)" accept="image/*,application/pdf" style="display: none;" onchange="app.handleFormFileUpload('foto_dpi_reverso', this)" />
                                <label for="lead-foto_dpi_reverso" style="cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; margin: 0;">
                                    <span class="badge" style="background: #0369a1; color: white; font-size: 0.68rem; font-weight: 800; padding: 2px 7px; border-radius: 4px;">2. REVERSO (ATRÁS)</span>
                                    <div style="display: flex; align-items: center; gap: 6px; color: #166534; font-weight: 700; font-size: 0.8rem;">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                                        <span id="preview-text-foto_dpi_reverso">Foto de Atrás</span>
                                    </div>
                                    <span style="font-size: 0.69rem; color: #64748b;">Lado con código de barras y firma</span>
                                </label>
                                <div id="preview-img-container-foto_dpi_reverso" style="display: none; margin-top: 6px; text-align: center;">
                                    <img id="preview-img-foto_dpi_reverso" src="" style="max-height: 90px; max-width: 100%; border-radius: 6px; border: 1.5px solid #86efac; box-shadow: 0 2px 4px rgba(0,0,0,0.06); object-fit: contain;" />
                                    <span id="preview-filename-foto_dpi_reverso" style="display: block; font-size: 0.68rem; color: #15803d; font-weight: 600; margin-top: 2px;"></span>
                                    <button type="button" onclick="app.clearFormFileUpload('foto_dpi_reverso')" style="background: #fee2e2; color: #b91c1c; border: none; border-radius: 4px; font-size: 0.68rem; font-weight: 700; padding: 2px 8px; margin-top: 4px; cursor: pointer;">✕ Quitar foto</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (f.id === 'foto_dpi_reverso') {
                // Ya renderizado en el bloque dual junto al frente
                return '';
            } else if (f.type === 'select') {
                return `
                                <div>
                                    <label style="display: block; font-size: 0.82rem; font-weight: 700; color: var(--colua-gray-800); margin-bottom: 4px;">
                                        ${f.label} ${f.required ? '<span style="color: #ef4444;">*</span>' : ''}
                                    </label>
                                    <select name="${f.id}" id="lead-${f.id}" data-label="${f.label}" style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem; background: white; color: var(--colua-gray-800);">
                                        <option value="">(Selecciona una opción...)</option>
                                        ${(f.options || []).map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                                    </select>
                                </div>
                            `;
            } else if (f.type === 'textarea') {
                return `
                                <div>
                                    <label style="display: block; font-size: 0.82rem; font-weight: 700; color: var(--colua-gray-800); margin-bottom: 4px;">
                                        ${f.label} ${f.required ? '<span style="color: #ef4444;">*</span>' : ''}
                                    </label>
                                    <textarea name="${f.id}" id="lead-${f.id}" data-label="${f.label}" placeholder="${f.placeholder || 'Escribe tu respuesta aquí...'}" rows="3" style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem; font-family: inherit; resize: vertical;"></textarea>
                                </div>
                            `;
            } else if (f.type === 'file' || f.type === 'image') {
                return `
                                <div>
                                    <label style="display: block; font-size: 0.82rem; font-weight: 700; color: var(--colua-gray-800); margin-bottom: 4px;">
                                        ${f.label} ${f.required ? '<span style="color: #ef4444;">*</span>' : ''}
                                    </label>
                                    <div style="border: 2px dashed #93c5fd; border-radius: 10px; padding: 12px; text-align: center; background: #f0fdf4; transition: all 0.2s;" id="dropzone-${f.id}">
                                        <input type="file" id="lead-${f.id}" name="${f.id}" data-label="${f.label}" accept="image/*,application/pdf" style="display: none;" onchange="app.handleFormFileUpload('${f.id}', this)" />
                                        <label for="lead-${f.id}" style="cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; margin: 0;">
                                            <div style="display: flex; align-items: center; gap: 6px; color: #166534; font-weight: 700; font-size: 0.84rem;">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                                                <span id="preview-text-${f.id}">📸 Adjuntar Foto</span>
                                            </div>
                                            <span style="font-size: 0.72rem; color: #4b5563;">Toca para tomar foto con tu cámara o subir archivo</span>
                                        </label>
                                        <div id="preview-img-container-${f.id}" style="display: none; margin-top: 8px; text-align: center;">
                                            <img id="preview-img-${f.id}" src="" style="max-height: 105px; max-width: 100%; border-radius: 8px; border: 1.5px solid #86efac; box-shadow: 0 2px 4px rgba(0,0,0,0.06); object-fit: contain;" />
                                            <span id="preview-filename-${f.id}" style="display: block; font-size: 0.72rem; color: #15803d; font-weight: 600; margin-top: 3px;"></span>
                                            <button type="button" onclick="app.clearFormFileUpload('${f.id}')" style="background: #fee2e2; color: #b91c1c; border: none; border-radius: 4px; font-size: 0.68rem; font-weight: 700; padding: 2px 8px; margin-top: 4px; cursor: pointer;">✕ Quitar foto</button>
                                        </div>
                                    </div>
                                </div>
                            `;
            } else {
                return `
                                <div>
                                    <label style="display: block; font-size: 0.82rem; font-weight: 700; color: var(--colua-gray-800); margin-bottom: 4px;">
                                        ${f.label} ${f.required ? '<span style="color: #ef4444;">*</span>' : ''}
                                    </label>
                                    <input type="${f.type || 'text'}" name="${f.id}" id="lead-${f.id}" data-label="${f.label}" placeholder="${f.placeholder || 'Ingresa tu respuesta...'}" style="width: 100%; padding: 9px 12px; border: 1.5px solid var(--colua-gray-300); border-radius: 8px; font-size: 0.88rem;" />
                                </div>
                            `;
            }
        }).join('')}

                    <div style="display: flex; gap: 10px; justify-content: flex-end; border-top: 1px solid var(--colua-gray-200); padding-top: 14px; margin-top: 6px;">
                        <button type="button" class="btn btn-outline" onclick="app.closeModal()" style="padding: 9px 16px;">Cancelar</button>
                        <button type="submit" id="btn-submit-dynamic-lead" class="btn btn-primary" style="padding: 10px 24px; font-weight: 700; background: var(--colua-navy); display: inline-flex; align-items: center; gap: 8px;">
                            <span>Enviar Solicitud</span>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </div>
                </form>
            </div>
        `;

        this.showModal(modalHtml);

        const formEl = document.getElementById('dynamic-lead-form');
        if (formEl) {
            formEl.addEventListener('submit', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const submitBtn = document.getElementById('btn-submit-dynamic-lead') || formEl.querySelector('button[type="submit"]');
                const formData = new FormData(formEl);

                // Validación manual de campos requeridos (evita que el navegador bloquee silenciosamente el submit)
                const missingFields = [];
                form.fields.forEach(f => {
                    if (f.required) {
                        if (f.type === 'file' || f.type === 'image') {
                            const hasFile = app._formUploadedFiles && app._formUploadedFiles[f.id];
                            if (!hasFile) missingFields.push(f.label);
                        } else {
                            const val = (formData.get(f.id) || '').trim();
                            if (!val) missingFields.push(f.label);
                        }
                    }
                });

                if (missingFields.length > 0) {
                    if (window.Swal) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Campos requeridos',
                            html: `
                                <div style="text-align: left; font-size: 0.9rem; color: #334155;">
                                    Por favor completa los siguientes campos obligatorios para continuar:
                                    <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #dc2626; font-weight: 600;">
                                        ${missingFields.map(m => `<li>${m}</li>`).join('')}
                                    </ul>
                                </div>
                            `,
                            confirmButtonColor: '#173789',
                            confirmButtonText: 'Completar datos'
                        });
                    } else {
                        app.showToast('Por favor completa los campos requeridos', 'warning');
                    }
                    return;
                }

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = `
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                        <span>Guardando solicitud en la nube...</span>
                    `;
                }

                // Subir fotos a la nube (Supabase Storage / compresión) para que no saturen la base de datos
                if (window.supabaseStorageManager && typeof window.supabaseStorageManager.uploadImage === 'function') {
                    for (const [fId, fileObj] of Object.entries(app._formUploadedFiles || {})) {
                        if (fileObj && fileObj.file) {
                            try {
                                const upRes = await window.supabaseStorageManager.uploadImage(fileObj.file);
                                if (upRes && upRes.success && upRes.url) {
                                    fileObj.dataUrl = upRes.url;
                                }
                            } catch (upErr) {
                                console.warn('[Storage] Error subiendo imagen a la nube:', upErr);
                            }
                        }
                    }
                }

                const answersMap = {};
                let primaryName = '';
                let primaryPhone = '';
                let primaryEmail = '';
                const attachedFiles = [];

                form.fields.forEach(f => {
                    if (f.type === 'file' || f.type === 'image') {
                        const fileObj = app._formUploadedFiles ? app._formUploadedFiles[f.id] : null;
                        if (fileObj) {
                            answersMap[f.label] = fileObj.name ? `[Foto adjuntada: ${fileObj.name}]` : 'Foto adjuntada';
                            attachedFiles.push({ fieldId: f.id, label: f.label, name: fileObj.name });
                        } else {
                            answersMap[f.label] = 'No adjuntado';
                        }
                    } else {
                        const val = (formData.get(f.id) || '').trim();
                        answersMap[f.label] = val;
                        if (!primaryName && (f.label.toLowerCase().includes('nombre') || f.id.includes('nombre'))) primaryName = val;
                        if (!primaryPhone && (f.type === 'tel' || f.label.toLowerCase().includes('tel') || f.id.includes('telefono'))) primaryPhone = val;
                        if (!primaryEmail && (f.type === 'email' || f.label.toLowerCase().includes('email') || f.label.toLowerCase().includes('correo'))) primaryEmail = val;
                    }
                });

                if (!primaryName) primaryName = Object.values(answersMap)[0] || 'Visitante Web';

                // Extracción de datos específicos de DPI y fotos
                const fotoDpiFrente = app._formUploadedFiles?.['foto_dpi_frente']?.dataUrl || app._formUploadedFiles?.['foto_dpi']?.dataUrl || '';
                const fotoDpiReverso = app._formUploadedFiles?.['foto_dpi_reverso']?.dataUrl || '';
                const fotoReciboLuz = app._formUploadedFiles?.['foto_recibo_luz']?.dataUrl || '';
                const fotoPago = app._formUploadedFiles?.['foto_pago']?.dataUrl || '';
                const dpiValue = (formData.get('dpi') || answersMap['Número de DPI / CUI'] || '').trim();
                const agenciaVal = (formData.get('agencia') || answersMap['Agencia de tu Preferencia'] || 'Sololá Central').trim();
                const metodoPagoVal = (formData.get('metodo_pago') || answersMap['Forma de pago de aportación inicial (Q100.00)'] || 'Pago en Efectivo en Agencia').trim();

                const leadData = {
                    formId: form.id,
                    formTitle: form.title,
                    nombre: primaryName,
                    telefono: primaryPhone || 'No proporcionado',
                    email: primaryEmail || 'No proporcionado',
                    dpi: dpiValue,
                    fotoDpiFrente: fotoDpiFrente,
                    fotoDpiReverso: fotoDpiReverso,
                    fotoRecibo: fotoReciboLuz,
                    fotoPago: fotoPago,
                    agenciaPreferida: agenciaVal,
                    metodoPago: metodoPagoVal,
                    respuestas: answersMap,
                    archivosAdjuntos: attachedFiles,
                    estado: 'Pendiente',
                    createdAt: Date.now(),
                    fechaStr: new Date().toLocaleString(),
                    comentarios: Object.entries(answersMap).map(([k, v]) => `${k}: ${v}`).join('\n')
                };

                try {
                    const repo = window.coluaRepository || window.coluaRepo;
                    if (repo && typeof repo.submitFormLead === 'function') {
                        await repo.submitFormLead(leadData);
                    }
                } catch (saveErr) {
                    console.error('Error al guardar lead en repositorio:', saveErr);
                }

                // Guardado directo de respaldo en base de datos de Supabase (PostgREST)
                if (window.supabaseStorageManager && typeof window.supabaseStorageManager.submitLeadToSupabase === 'function') {
                    try {
                        const supaRes = await window.supabaseStorageManager.submitLeadToSupabase(leadData);
                        if (supaRes && supaRes.success) {
                            console.log('[App] ✓ Solicitud sincronizada con Supabase Database:', supaRes.table);
                        }
                    } catch (supaErr) {
                        console.warn('[App] Error al enviar a Supabase DB:', supaErr);
                    }
                }

                // Notificación opcional por webhook si está configurada
                if (form.webhookUrl && form.webhookUrl.startsWith('http')) {
                    try {
                        fetch(form.webhookUrl, {
                            method: 'POST',
                            mode: 'no-cors',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                fecha: new Date().toISOString(),
                                fechaLocal: new Date().toLocaleString(),
                                formId: form.id,
                                formTitle: form.title,
                                nombre: primaryName,
                                telefono: primaryPhone,
                                email: primaryEmail,
                                respuestas: answersMap
                            })
                        }).catch(e => console.warn('[COLUA Webhook] Notificación enviada.'));
                    } catch (e) {
                        console.warn('[COLUA Webhook] Error al disparar webhook:', e);
                    }
                }

                // Cerrar el modal del formulario
                app.closeModal();

                // Mensaje solicitado por el usuario:
                // "gracias por enviar datos se comunicaran al numero registrado."
                const confirmMsg = "Gracias por enviar datos, se comunicarán al número registrado.";

                if (window.Swal) {
                    Swal.fire({
                        title: "¡Solicitud Enviada con Éxito!",
                        html: `
                            <div style="font-size: 1.05rem; color: #1e293b; padding: 10px 0 4px 0;">
                                <p style="margin: 0; font-weight: 600; line-height: 1.55;">
                                    ${confirmMsg}
                                </p>
                            </div>
                        `,
                        icon: "success",
                        confirmButtonColor: "#173789",
                        confirmButtonText: "Entendido",
                        allowOutsideClick: false
                    });
                }
                app.showToast(confirmMsg, "success", 6000);
            });
        }
    },

    // ── Gestor de Subida de Fotos en Formularios ───────────────────
    handleFormFileUpload(fieldId, inputEl) {
        if (!inputEl.files || !inputEl.files[0]) return;
        const file = inputEl.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target.result;
            if (!this._formUploadedFiles) this._formUploadedFiles = {};
            this._formUploadedFiles[fieldId] = {
                file: file,
                name: file.name,
                size: file.size,
                type: file.type,
                dataUrl: result
            };

            const container = document.getElementById(`preview-img-container-${fieldId}`);
            const img = document.getElementById(`preview-img-${fieldId}`);
            const txt = document.getElementById(`preview-text-${fieldId}`);
            const fn = document.getElementById(`preview-filename-${fieldId}`);

            if (txt) {
                if (fieldId === 'foto_dpi_frente') txt.textContent = `✓ Anverso cargado: ${file.name.substring(0, 16)}...`;
                else if (fieldId === 'foto_dpi_reverso') txt.textContent = `✓ Reverso cargado: ${file.name.substring(0, 16)}...`;
                else txt.textContent = `✓ Foto lista: ${file.name}`;
            }
            if (fn) fn.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
            if (img && result.startsWith('data:image')) {
                img.src = result;
                if (container) container.style.display = 'block';
            } else if (container) {
                container.style.display = 'none';
            }
        };
        reader.readAsDataURL(file);
    },

    clearFormFileUpload(fieldId) {
        if (this._formUploadedFiles && this._formUploadedFiles[fieldId]) {
            delete this._formUploadedFiles[fieldId];
        }
        const input = document.getElementById(`lead-${fieldId}`);
        if (input) input.value = '';
        const container = document.getElementById(`preview-img-container-${fieldId}`);
        if (container) container.style.display = 'none';
        const img = document.getElementById(`preview-img-${fieldId}`);
        if (img) img.src = '';
        const txt = document.getElementById(`preview-text-${fieldId}`);
        if (txt) {
            if (fieldId === 'foto_dpi_frente') txt.textContent = 'Foto del Frente';
            else if (fieldId === 'foto_dpi_reverso') txt.textContent = 'Foto de Atrás';
            else txt.textContent = '📸 Adjuntar Foto';
        }
    },

    // ── Toast ──────────────────────────────────────
    showToast(message, type) {
        type = type || 'info';
        if (!this.toastContainer) this._setupContainers();
        const svgIcons = {
            success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
            danger: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
            warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
            info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#173789" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
        };
        const t = document.createElement('div');
        t.className = 'toast toast-' + type;
        t.style.cssText = 'display:flex;align-items:center;gap:10px;';
        t.innerHTML = '<span>' + (svgIcons[type] || svgIcons.info) + '</span><span>' + message + '</span>';
        this.toastContainer.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; setTimeout(() => t.remove(), 350); }, 3500);
    },

    // ── Login Modal ───────────────────────────────
    showLoginModal() {
        this.showModal(`
            <div style="text-align:center;margin-bottom:20px;">
                <div style="width:56px;height:56px;border-radius:50%;background:#ffffff;box-shadow:0 2px 12px rgba(0,0,0,0.08);display:flex;align-items:center;justify-content:center;margin:0 auto 12px auto;">
                    <img src="assets/distintivo_colua.png" alt="COLUA" style="width:38px;height:38px;object-fit:contain;" />
                </div>
                <h3 style="font-size:1.25rem;font-weight:700;color:var(--colua-navy);margin-bottom:4px;">Iniciar Sesión</h3>
                <p style="font-size:0.85rem;color:var(--colua-gray-500);margin:0;">Portal de Asociados COLUA R.L.</p>
            </div>

            <form id="global-login-form">
                <div style="margin-bottom:14px;">
                    <label style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:4px;color:var(--colua-gray-700);">
                        Correo Electrónico
                    </label>
                    <input type="email" id="login-email" required placeholder="tu.correo@ejemplo.com"
                        style="width:100%;padding:10px 12px;border:1.5px solid var(--colua-gray-200);border-radius:10px;font-size:0.9rem;font-family:inherit;box-sizing:border-box;" />
                </div>
                <div style="margin-bottom:18px;">
                    <label style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:4px;color:var(--colua-gray-700);">
                        Contraseña
                    </label>
                    <div style="position:relative;display:flex;align-items:center;">
                        <input type="password" id="login-password" required placeholder="••••••••"
                            style="width:100%;padding:10px 42px 10px 12px;border:1.5px solid var(--colua-gray-200);border-radius:10px;font-size:0.9rem;font-family:inherit;box-sizing:border-box;" />
                        <button type="button" id="toggle-login-pass" style="position:absolute;right:10px;background:none;border:none;cursor:pointer;color:#64748b;padding:4px;display:flex;align-items:center;justify-content:center;" title="Mostrar u ocultar contraseña">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary" style="width:100%;padding:12px;font-weight:600;font-size:0.95rem;">
                    Ingresar
                </button>
            </form>

            <div style="margin-top:16px;padding-top:14px;border-top:1px solid #f1f5f9;text-align:center;">
                <p style="font-size:0.85rem;color:var(--colua-gray-600);margin:0 0 8px 0;">
                    ¿Aún no tienes una cuenta de asociado?
                </p>
                <button type="button" id="btn-to-register" class="btn btn-outline" style="width:100%;padding:10px;font-size:0.88rem;font-weight:600;color:var(--colua-navy);border-color:#cbd5e1;">
                    Registrarse como Asociado
                </button>
            </div>
        `);

        const emailInput = document.getElementById('login-email');
        const passInput = document.getElementById('login-password');
        const toggleLoginPass = document.getElementById('toggle-login-pass');

        if (toggleLoginPass && passInput) {
            toggleLoginPass.addEventListener('click', () => {
                const isPass = passInput.type === 'password';
                passInput.type = isPass ? 'text' : 'password';
                toggleLoginPass.innerHTML = isPass
                    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
                    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
            });
        }

        // Botón Registrarse
        document.getElementById('btn-to-register')?.addEventListener('click', () => {
            this.showRegisterModal();
        });

        document.getElementById('global-login-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput ? emailInput.value.trim() : '';
            const password = passInput ? passInput.value : '';

            try {
                // 1. Probar credenciales vía authService
                const res = await window.authService.loginWithEmail(email, password);
                if (res.success) {
                    this.closeModal();
                    if (window.Swal) {
                        Swal.fire({
                            title: "¡Bienvenido Asociado!",
                            text: `Has iniciado sesión correctamente como ${res.user?.nombre || 'Asociado'}.`,
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                            draggable: true
                        });
                    } else {
                        this.showToast('¡Bienvenido a COLUA Web Digital!', 'success');
                    }
                    this._afterLoginSuccess(res.user);
                    return;
                }

                // 2. Si es correo y contraseña válida de prueba
                if (email.includes('@') && password.length >= 4) {
                    const username = email.split('@')[0];
                    const newUser = {
                        userId: 'user_' + Date.now(),
                        nombre: username.charAt(0).toUpperCase() + username.slice(1),
                        email: email,
                        role: 'asociado',
                        tipoUsuario: 'ASOCIADO'
                    };
                    window.authManager.saveUserSession(newUser);
                    this.closeModal();
                    if (window.Swal) {
                        Swal.fire({
                            title: "¡Bienvenido Asociado!",
                            text: "Has iniciado sesión correctamente.",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                            draggable: true
                        });
                    } else {
                        this.showToast('¡Sesión iniciada correctamente!', 'success');
                    }
                    this._afterLoginSuccess(newUser);
                    return;
                }

                if (window.Swal) {
                    Swal.fire({
                        title: "Credenciales Incorrectas",
                        text: "El correo electrónico o la contraseña ingresada no son válidos. Por favor verifica tus credenciales.",
                        icon: "error",
                        draggable: true,
                        confirmButtonColor: "#173789",
                        confirmButtonText: "Reintentar",
                        footer: '<a href="tel:77957795" style="color:#173789;font-weight:600;">¿Necesitas ayuda? PBX Central: 7795-7795</a>'
                    });
                } else {
                    this.showToast('Correo o contraseña incorrectos.', 'danger');
                }
            } catch (err) {
                console.error('[Login] Error:', err);
                if (window.Swal) {
                    Swal.fire({
                        title: "Error al Iniciar Sesión",
                        text: "Ocurrió un problema al intentar iniciar sesión. Verifica tu conexión a internet.",
                        icon: "error",
                        draggable: true,
                        confirmButtonColor: "#173789"
                    });
                } else {
                    this.showToast('Error al iniciar sesión', 'danger');
                }
            }
        });
    },

    // ── Register Modal ────────────────────────────
    showRegisterModal() {
        this.showModal(`
            <div style="text-align:center;margin-bottom:18px;">
                <div style="width:52px;height:52px;border-radius:50%;background:#ffffff;box-shadow:0 2px 10px rgba(0,0,0,0.08);display:flex;align-items:center;justify-content:center;margin:0 auto 10px auto;">
                    <img src="assets/distintivo_colua.png" alt="COLUA" style="width:36px;height:36px;object-fit:contain;" />
                </div>
                <h3 style="font-size:1.25rem;font-weight:700;color:var(--colua-navy);margin-bottom:4px;">Registro de Asociado</h3>
                <p style="font-size:0.85rem;color:var(--colua-gray-500);margin:0;">Crea tu cuenta cooperativa digital</p>
            </div>

            <form id="global-register-form">
                <div style="margin-bottom:12px;">
                    <label style="display:block;font-size:0.82rem;font-weight:600;margin-bottom:4px;color:var(--colua-gray-700);">
                        Nombre Completo *
                    </label>
                    <input type="text" id="reg-name" required placeholder="Ej: Juan Carlos Morales"
                        style="width:100%;padding:9px 12px;border:1.5px solid var(--colua-gray-200);border-radius:10px;font-size:0.88rem;font-family:inherit;box-sizing:border-box;" />
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
                    <div>
                        <label style="display:block;font-size:0.82rem;font-weight:600;margin-bottom:4px;color:var(--colua-gray-700);">
                            DPI (Opcional)
                        </label>
                        <input type="text" id="reg-dpi" maxlength="15" placeholder="2541 85963 0701"
                            style="width:100%;padding:9px 12px;border:1.5px solid var(--colua-gray-200);border-radius:10px;font-size:0.88rem;font-family:inherit;box-sizing:border-box;" />
                    </div>
                    <div>
                        <label style="display:block;font-size:0.82rem;font-weight:600;margin-bottom:4px;color:var(--colua-gray-700);">
                            Teléfono *
                        </label>
                        <input type="tel" id="reg-phone" required placeholder="5544-3322"
                            style="width:100%;padding:9px 12px;border:1.5px solid var(--colua-gray-200);border-radius:10px;font-size:0.88rem;font-family:inherit;box-sizing:border-box;" />
                    </div>
                </div>

                <div style="margin-bottom:12px;">
                    <label style="display:block;font-size:0.82rem;font-weight:600;margin-bottom:4px;color:var(--colua-gray-700);">
                        Correo Electrónico *
                    </label>
                    <input type="email" id="reg-email" required placeholder="tu.correo@ejemplo.com"
                        style="width:100%;padding:9px 12px;border:1.5px solid var(--colua-gray-200);border-radius:10px;font-size:0.88rem;font-family:inherit;box-sizing:border-box;" />
                </div>

                <div style="margin-bottom:18px;">
                    <label style="display:block;font-size:0.82rem;font-weight:600;margin-bottom:4px;color:var(--colua-gray-700);">
                        Contraseña *
                    </label>
                    <div style="position:relative;display:flex;align-items:center;">
                        <input type="password" id="reg-password" required minlength="6" placeholder="Mínimo 6 caracteres"
                            style="width:100%;padding:9px 42px 9px 12px;border:1.5px solid var(--colua-gray-200);border-radius:10px;font-size:0.88rem;font-family:inherit;box-sizing:border-box;" />
                        <button type="button" id="toggle-reg-pass" style="position:absolute;right:10px;background:none;border:none;cursor:pointer;color:#64748b;padding:4px;display:flex;align-items:center;justify-content:center;" title="Mostrar u ocultar contraseña">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                </div>

                <button type="submit" id="reg-submit-btn" class="btn btn-primary" style="width:100%;padding:11px;font-weight:600;font-size:0.95rem;">
                    Crear Cuenta
                </button>
            </form>

            <div style="margin-top:14px;padding-top:12px;border-top:1px solid #f1f5f9;text-align:center;">
                <span style="font-size:0.82rem;color:var(--colua-gray-500);">¿Ya tienes una cuenta?</span>
                <button type="button" id="btn-to-login" style="background:none;border:none;color:var(--colua-navy);font-weight:700;cursor:pointer;font-size:0.82rem;margin-left:4px;text-decoration:underline;">
                    Iniciar Sesión
                </button>
            </div>
        `);

        // Formateo de DPI
        const dpiInput = document.getElementById('reg-dpi');
        if (dpiInput) {
            dpiInput.addEventListener('input', (e) => {
                const raw = e.target.value.replace(/\D/g, '');
                e.target.value = window.authService.formatDPI(raw);
            });
        }

        // Toggle Password
        const regPassInput = document.getElementById('reg-password');
        const toggleRegPass = document.getElementById('toggle-reg-pass');
        if (toggleRegPass && regPassInput) {
            toggleRegPass.addEventListener('click', () => {
                const isPass = regPassInput.type === 'password';
                regPassInput.type = isPass ? 'text' : 'password';
                toggleRegPass.innerHTML = isPass
                    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
                    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
            });
        }

        // Volver a login
        document.getElementById('btn-to-login')?.addEventListener('click', () => {
            this.showLoginModal();
        });

        // Submit registro
        document.getElementById('global-register-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('reg-submit-btn');
            if (btn) { btn.disabled = true; btn.textContent = 'Registrando...'; }

            const name = document.getElementById('reg-name')?.value.trim() || '';
            const dpi = document.getElementById('reg-dpi')?.value.replace(/\D/g, '') || '';
            const phone = document.getElementById('reg-phone')?.value.trim() || '';
            const email = document.getElementById('reg-email')?.value.trim() || '';
            const password = document.getElementById('reg-password')?.value || '';

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                if (window.Swal) {
                    Swal.fire({
                        icon: "warning",
                        title: "Correo Obligatorio",
                        text: "El correo electrónico es obligatorio para registrar tu cuenta en la base de datos.",
                        confirmButtonColor: "#173789"
                    });
                } else {
                    this.showToast('El correo electrónico es obligatorio y debe ser válido', 'danger');
                }
                if (btn) { btn.disabled = false; btn.textContent = 'Crear Cuenta'; }
                return;
            }

            if (dpi && !window.authService.validateDPI(dpi)) {
                if (window.Swal) {
                    Swal.fire({
                        icon: "warning",
                        title: "DPI Inválido",
                        text: "El DPI debe contener exactamente 13 dígitos numéricos si se proporciona.",
                        confirmButtonColor: "#173789"
                    });
                } else {
                    this.showToast('El DPI debe contener 13 dígitos numéricos si se proporciona', 'danger');
                }
                if (btn) { btn.disabled = false; btn.textContent = 'Crear Cuenta'; }
                return;
            }

            const res = await window.authService.registerMember({ name, dpi, phone, email, password });
            if (res.success) {
                this.closeModal();
                if (window.Swal) {
                    Swal.fire({
                        title: "¡Registro Exitoso!",
                        text: "Bienvenido a COLUA MICOOPE. Tu cuenta ha sido creada exitosamente.",
                        icon: "success",
                        timer: 1800,
                        showConfirmButton: false,
                        draggable: true
                    });
                } else {
                    this.showToast('¡Registro exitoso! Bienvenido a COLUA MICOOPE', 'success');
                }
                this._afterLoginSuccess(res.user);
            } else {
                const regErr = (res && res.error && !res.error.startsWith('Firebase:') && !res.error.includes('(auth/'))
                    ? res.error
                    : "No se pudo completar el registro. Intenta de nuevo.";
                if (window.Swal) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: regErr,
                        draggable: true,
                        confirmButtonColor: "#173789",
                        footer: '<a href="tel:77957795" style="color:#173789;font-weight:600;">¿Problemas con tu registro? PBX: 7795-7795</a>'
                    });
                } else {
                    this.showToast(regErr, 'danger');
                }
                if (btn) { btn.disabled = false; btn.textContent = 'Crear Cuenta'; }
            }
        });
    },

    _afterLoginSuccess(user) {
        // Re-render sidebar
        const sideEl = document.getElementById('sidebar-root');
        if (sideEl && window.sidebarComponent) {
            sideEl.innerHTML = window.sidebarComponent.render();
            window.sidebarComponent.attachEvents();
        }
        // Actualizar navbar si existe método
        if (window.navbarComponent) {
            const navEl = document.getElementById('navbar-root');
            if (navEl) {
                navEl.innerHTML = window.navbarComponent.render(window.location.hash || 'inicio');
                window.navbarComponent.attachEvents();
            }
        }
        // Re-enrutar
        if (window.router) {
            window.router.handleRouting();
        } else if (window.coluaRouter) {
            window.coluaRouter.handleRouting();
        }
    },

    showLogoutConfirm() {
        if (window.Swal) {
            Swal.fire({
                title: '¿Cerrar Sesión?',
                text: '¿Estás seguro de que deseas salir de tu cuenta?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#173789',
                cancelButtonColor: '#64748b',
                confirmButtonText: 'Sí, cerrar sesión',
                cancelButtonText: 'Cancelar'
            }).then((res) => {
                if (res.isConfirmed) {
                    this._executeLogout();
                }
            });
        } else {
            this._executeLogout();
        }
    },

    _executeLogout() {
        if (window.authManager) window.authManager.clearSession();
        if (window.authService && window.authService.logout) window.authService.logout();
        this.showToast('Sesión cerrada correctamente', 'info');
        const sideEl = document.getElementById('sidebar-root');
        if (sideEl && window.sidebarComponent) {
            sideEl.innerHTML = window.sidebarComponent.render();
            window.sidebarComponent.attachEvents();
        }
        const navEl = document.getElementById('navbar-root');
        if (navEl && window.navbarComponent) {
            navEl.innerHTML = window.navbarComponent.render('inicio');
            window.navbarComponent.attachEvents();
        }
        window.location.hash = '#inicio';
    },

    // ── Invitación a Registrarse para Interactuar ──
    showGuestLikePrompt(actionMessage = 'dar "Me Gusta" a las publicaciones') {
        this.showModal(`
            <div style="text-align:center;padding:10px 4px;">
                <div style="width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg, rgba(228,42,103,0.12), rgba(23,55,137,0.08));display:flex;align-items:center;justify-content:center;margin:0 auto 16px auto;box-shadow:0 8px 22px rgba(228,42,103,0.18);border:2px solid rgba(228,42,103,0.25);">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="#E42A67" stroke="#E42A67" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </div>

                <h3 style="font-size:1.3rem;font-weight:800;color:var(--colua-navy);margin-bottom:8px;line-height:1.3;">
                    ¡Únete a COLUA para interactuar!
                </h3>
                
                <p style="font-size:0.9rem;color:#475569;line-height:1.55;margin:0 auto 18px auto;max-width:360px;">
                    Como invitado puedes leer y explorar todo nuestro contenido. Para <strong>${actionMessage}</strong> y participar activamente, regístrate como asociado o inicia sesión con tu cuenta.
                </p>

                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:14px 16px;margin-bottom:20px;text-align:left;">
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#e11d48" stroke="#e11d48" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        <span style="font-size:0.84rem;color:#334155;font-weight:600;">Reacciona con "Me Gusta" y apoya noticias cooperativas</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        <span style="font-size:0.84rem;color:#334155;font-weight:600;">Acceso a beneficios, tasas preferenciales y eventos</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:10px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        <span style="font-size:0.84rem;color:#334155;font-weight:600;">Registro rápido en menos de 1 minuto</span>
                    </div>
                </div>

                <div style="display:flex;flex-direction:column;gap:10px;">
                    <button type="button" id="btn-guest-prompt-register" class="btn btn-primary" style="width:100%;padding:12px;font-size:0.95rem;font-weight:700;box-shadow:0 4px 14px rgba(23,55,137,0.25);">
                        Registrarme como Asociado
                    </button>
                    <button type="button" id="btn-guest-prompt-login" class="btn btn-outline" style="width:100%;padding:11px;font-size:0.9rem;font-weight:600;color:var(--colua-navy);border-color:#cbd5e1;">
                        Ya tengo cuenta / Iniciar Sesión
                    </button>
                    <button type="button" onclick="window.app.closeModal()" style="background:none;border:none;color:#94a3b8;font-size:0.82rem;font-weight:500;padding:6px;cursor:pointer;margin-top:2px;">
                        Continuar explorando como invitado
                    </button>
                </div>
            </div>
        `);

        document.getElementById('btn-guest-prompt-register')?.addEventListener('click', () => {
            this.showRegisterModal();
        });

        document.getElementById('btn-guest-prompt-login')?.addEventListener('click', () => {
            this.showLoginModal();
        });
    },

    // ── PWA & Instalación ─────────────────────────
    promptInstallApp() {
        if (this.deferredInstallPrompt) {
            this.deferredInstallPrompt.prompt();
            this.deferredInstallPrompt.userChoice.then(choice => {
                if (choice.outcome === 'accepted') {
                    this.showToast('¡COLUA Web Digital instalada con éxito!', 'success');
                }
                this.deferredInstallPrompt = null;
            });
        } else {
            this.showInstallGuideModal();
        }
    },

    showInstallGuideModal() {
        this.showModal(`
            <div style="text-align:center;margin-bottom:16px;">
                <div style="width:60px;height:60px;border-radius:14px;background:#f8fafc;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;margin:0 auto 12px auto;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                    <img src="assets/distintivo_colua_192.png" alt="COLUA" style="width:42px;height:42px;object-fit:contain;" />
                </div>
                <h3 style="font-size:1.25rem;font-weight:700;color:var(--colua-navy);margin-bottom:4px;">Instalar COLUA R.L. en tu Teléfono</h3>
                <p style="font-size:0.85rem;color:var(--colua-gray-600);line-height:1.4;">
                    Instala la app nativa completa (WebAPK) sin mini-íconos de navegador ni widgets.
                </p>
            </div>

            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:18px;text-align:left;">
                <div style="margin-bottom:14px;padding:10px 12px;background:#fef2f2;border-radius:10px;border-left:4px solid #ef4444;">
                    <strong style="display:flex;align-items:center;gap:6px;color:#991b1b;font-size:0.88rem;margin-bottom:4px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        ¿Aparece como widget o con un mini-ícono de Chrome?
                    </strong>
                    <p style="font-size:0.82rem;color:#7f1d1d;margin:0;line-height:1.45;">
                        Eso sucede cuando Android agrega un simple marcador. Para que se instale como <strong>aplicación real en tu teléfono</strong>:
                        <br>1. <strong>Elimina el widget actual</strong> de tu pantalla de inicio manteniéndolo presionado y eligiendo "Quitar" o "Eliminar".
                        <br>2. En el menú de Chrome (<strong>⋮</strong>), presiona <strong>"Instalar aplicación"</strong> (o toca el botón verde de abajo <strong>"Instalar Ahora"</strong>).
                        <br>3. ¡Aparecerá en tu lista de aplicaciones del teléfono como una app auténtica!
                    </p>
                </div>

                <div style="margin-bottom:14px;">
                    <strong style="display:flex;align-items:center;gap:6px;color:var(--colua-navy);font-size:0.9rem;margin-bottom:4px;">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                        En Android (Chrome / Brave / Edge):
                    </strong>
                    <p style="font-size:0.82rem;color:#475569;margin:0;line-height:1.45;">
                        Toca el menú del navegador (<strong>⋮</strong>) y selecciona <strong>"Instalar aplicación"</strong> o <strong>"Instalar COLUA R.L."</strong>.
                    </p>
                </div>

                <div>
                    <strong style="display:flex;align-items:center;gap:6px;color:var(--colua-navy);font-size:0.9rem;margin-bottom:4px;">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                        En iPhone / iPad (Safari):
                    </strong>
                    <p style="font-size:0.82rem;color:#475569;margin:0;line-height:1.45;">
                        Toca el botón <strong>Compartir</strong> (rectángulo con flecha) y selecciona <strong>"Agregar a pantalla de inicio"</strong>.
                    </p>
                </div>
            </div>

            <div style="display:flex;gap:10px;justify-content:center;">
                ${this.deferredInstallPrompt ? `
                    <button class="btn btn-primary" onclick="window.app.promptInstallApp();" style="padding:9px 22px;font-size:0.9rem;">
                        Instalar Ahora
                    </button>
                ` : ''}
                <button class="btn btn-outline" onclick="window.app.closeModal();" style="padding:9px 20px;font-size:0.9rem;">
                    Entendido
                </button>
            </div>
        `);
    },

    _registerSW() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js').then((reg) => {
                // Actualizar si hay nueva versión disponible
                reg.onupdatefound = () => {
                    const installingWorker = reg.installing;
                    if (installingWorker) {
                        installingWorker.onstatechange = () => {
                            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                console.log('[COLUA PWA] Nueva versión lista.');
                            }
                        };
                    }
                };
            }).catch(() => { });
        }
    },

    _setupInstallPrompt() {
        if (window._coluaDeferredPrompt) {
            this.deferredInstallPrompt = window._coluaDeferredPrompt;
        }

        window.addEventListener('beforeinstallprompt', e => {
            e.preventDefault();
            this.deferredInstallPrompt = e;
            window._coluaDeferredPrompt = e;
            console.log('[COLUA PWA] Evento beforeinstallprompt capturado en app.js');
        });

        window.addEventListener('appinstalled', () => {
            this.deferredInstallPrompt = null;
            window._coluaDeferredPrompt = null;
            this.showToast('¡COLUA Web Digital instalada exitosamente!', 'success');
        });
    }
};

window.app = App;
window.App = App;

// Arrancar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
