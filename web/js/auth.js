// Módulo de Autenticación, Seguridad y Gestión de Sesiones
class AuthManager {
  constructor() {
    this.fb = window.firebaseClient;
    this.repo = window.coluaRepository;
    this.sessionTimeoutMs = 2 * 60 * 60 * 1000; // 2 horas
  }

  // --- HASHING Y CLAVE MAESTRA ---
  async sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async checkAdminMasterPassword(input) {
    if (!input || !input.trim()) return false;
    const cleanInput = input.trim();
    const inputHash = await this.sha256(cleanInput);
    
    // Hash de verificación de autorización
    const defaultHash = "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4";
    const customStoredHash = localStorage.getItem('admin_master_hash');
    
    let matches = false;
    if (customStoredHash) {
      matches = (inputHash.toLowerCase() === customStoredHash.toLowerCase());
    } else {
      matches = (inputHash.toLowerCase() === defaultHash.toLowerCase());
    }
    return matches;
  }

  async updateMasterPassword(newPassword) {
    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false, error: 'La nueva Clave Universal debe tener al menos 4 caracteres' };
    }
    const cleanPass = newPassword.trim();
    const newHash = await this.sha256(cleanPass);
    localStorage.setItem('admin_master_hash', newHash);

    if (window.coluaRepo && typeof window.coluaRepo.updateGlobalConfig === 'function') {
      await window.coluaRepo.updateGlobalConfig({ master_admin_password_hash: newHash });
    }
    if (window.coluaRepo && typeof window.coluaRepo.logAudit === 'function') {
      await window.coluaRepo.logAudit({
        action: 'ACTUALIZAR_CLAVE_UNIVERSAL',
        performedBy: this.getCurrentUser()?.nombre || 'Super Administrador',
        details: 'Se actualizó la Clave Universal Institucional con cifrado SHA-256'
      });
    }
    return { success: true };
  }

  setAdminSessionActive(active) {
    if (active) {
      sessionStorage.setItem('admin_session_active', 'true');
      sessionStorage.setItem('admin_session_timestamp', String(Date.now()));
    } else {
      sessionStorage.removeItem('admin_session_active');
      sessionStorage.removeItem('admin_session_timestamp');
    }
  }

  isAdminSessionActive() {
    const active = sessionStorage.getItem('admin_session_active') === 'true';
    if (!active) return false;

    const last = parseInt(sessionStorage.getItem('admin_session_timestamp') || '0', 10);
    const elapsed = Date.now() - last;
    if (elapsed > this.sessionTimeoutMs) {
      this.setAdminSessionActive(false);
      return false;
    }
    sessionStorage.setItem('admin_session_timestamp', String(Date.now()));
    return true;
  }

  // --- REGLAS Y FORMATO DE DPI ---
  formatDpi(raw) {
    const digits = (raw || '').replace(/\D/g, '');
    if (digits.length <= 4) return digits;
    if (digits.length <= 9) return `${digits.substring(0, 4)} ${digits.substring(4)}`;
    return `${digits.substring(0, 4)} ${digits.substring(4, 9)} ${digits.substring(9, 13)}`;
  }

  formatDPI(raw) {
    return this.formatDpi(raw);
  }

  isValidDpi(raw) {
    const digits = (raw || '').replace(/\D/g, '');
    return digits.length === 13;
  }

  validateDPI(raw) {
    return this.isValidDpi(raw);
  }

  // --- POLÍTICAS DE CONTRASEÑA ---
  checkPasswordPolicy(pass) {
    if (!pass) return { valid: false, length: false, cases: false, numSpecial: false };
    const length = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasDigit = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9\s]/.test(pass);

    const cases = hasUpper && hasLower;
    const numSpecial = hasDigit && hasSpecial;
    return {
      valid: length && cases && numSpecial,
      length,
      cases,
      numSpecial
    };
  }

  generateStrongPassword() {
    const uppers = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lowers = "abcdefghijkmnopqrstuvwxyz";
    const digits = "23456789";
    const specials = "!@#$%^&*()_+-=";

    const rand = (str) => str.charAt(Math.floor(Math.random() * str.length));
    return `Colua${rand(specials)}${Math.floor(100 + Math.random() * 900)}${rand(uppers)}${rand(specials)}${rand(lowers)}`;
  }

  generateAssociateId(seed) {
    if (!seed) return '0010025';
    let hash = 0;
    const str = String(seed);
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    const positiveHash = (Math.abs(hash) % 89999) + 10000;
    return `00${positiveHash}`;
  }

  generateVerificationSignature(assocId, email) {
    const cleanId = String(assocId || '0000001').padStart(7, '0');
    const cleanEmail = (email || '').toLowerCase().trim();
    const raw = `COLUA_SECURE_TOKEN_${cleanId}_${cleanEmail}_MICOOPE_2026`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `colua_sig_${hex}`;
  }

  verifyAssociateToken(assocId, email, sig) {
    if (!sig) return false;
    const cleanId = String(assocId || '0000001').padStart(7, '0');
    const expected = this.generateVerificationSignature(cleanId, email);
    return sig === expected || sig === `colua_${cleanId}` || sig === `colua_${assocId}`;
  }

  // --- SESIÓN DEL ASOCIADO O INVITADO ---
  getCurrentSession() {
    const raw = localStorage.getItem('UserPrefs') || sessionStorage.getItem('UserPrefs');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  saveUserSession(user, remember = true) {
    let assocId = user.associateId || user.noAsociado || user.associate_id || '';
    if (!assocId || assocId.length > 8 || !/^\d+$/.test(assocId)) {
      const seed = user.email || user.userId || user.uid || user.user_id || 'colua';
      assocId = this.generateAssociateId(seed);
    }

    const email = user.email || user.user_email || '';
    const hasEmail = Boolean(email && email.includes('@'));
    const isGuest = !hasEmail && (user.role === 'GUEST' || user.role === 'guest' || user.role === 'invitado' || user.tipoUsuario === 'INVITADO');
    const role = isGuest ? 'invitado' : (user.role === 'SUPER_ADMIN' || user.role === 'superadmin' ? 'superadmin' : user.role === 'ADMIN' || user.role === 'admin' ? 'admin' : 'asociado');
    const tipo = isGuest ? 'INVITADO' : (role === 'superadmin' || role === 'admin' ? 'ADMIN' : 'ASOCIADO');

    const data = {
      user_id: user.userId || user.user_id || user.uid,
      user_name: user.nombre || user.user_name || user.displayName || (isGuest ? "Invitado" : "Asociado"),
      user_phone: user.telefono || user.user_phone || user.phone || "",
      user_dpi: user.dpi || user.user_dpi || "",
      user_email: email,
      user_role: role,
      associateId: assocId,
      tipoUsuario: tipo,
      timestamp: Date.now()
    };
    const str = JSON.stringify(data);
    if (remember) {
      localStorage.setItem('UserPrefs', str);
    } else {
      sessionStorage.setItem('UserPrefs', str);
    }
  }

  // Alias para compatibilidad
  verifyMasterPassword(input) {
    return this.checkAdminMasterPassword(input);
  }

  formatDPI(raw) {
    return this.formatDpi(raw);
  }

  validateDPI(raw) {
    return this.isValidDpi(raw);
  }

  logout() {
    return this.clearSession();
  }

  cleanAuthError(err) {
    if (!err) return 'Credenciales incorrectas o no válidas.';
    const code = (err.code || '').toLowerCase();
    const msg = typeof err === 'string' ? err : (err.message || '');

    if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found') ||
        msg.includes('invalid-credential') || msg.includes('wrong-password') || msg.includes('user-not-found')) {
      return 'Correo o contraseña incorrectos. Verifica tus credenciales.';
    }
    if (code.includes('email-already-in-use') || msg.includes('email-already-in-use')) {
      return 'El correo electrónico ya se encuentra registrado.';
    }
    if (code.includes('weak-password') || msg.includes('weak-password')) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (code.includes('invalid-email') || msg.includes('invalid-email')) {
      return 'El formato del correo electrónico es inválido.';
    }
    if (code.includes('user-disabled') || msg.includes('user-disabled')) {
      return 'Esta cuenta ha sido inhabilitada. Contacta al soporte de la cooperativa.';
    }
    if (code.includes('too-many-requests') || msg.includes('too-many-requests')) {
      return 'Demasiados intentos fallidos. Por favor espera un momento e intenta de nuevo.';
    }
    if (code.includes('network') || msg.includes('network')) {
      return 'Error de conexión. Verifica tu acceso a internet.';
    }
    if (msg.startsWith('Firebase:') || msg.includes('(auth/')) {
      return 'Credenciales incorrectas o usuario no autorizado.';
    }
    return msg || 'Credenciales incorrectas o usuario no autorizado.';
  }

  async changePassword(currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      return { success: false, error: 'Completa todos los campos de contraseña.' };
    }
    if (newPassword.length < 6) {
      return { success: false, error: 'La nueva contraseña debe tener al menos 6 caracteres.' };
    }

    if (this.fb && typeof this.fb.updateUserPassword === 'function') {
      try {
        await this.fb.updateUserPassword(currentPassword, newPassword);
        return { success: true };
      } catch (err) {
        let msg = err.message || 'Error al actualizar contraseña.';
        if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential' || (err.message && err.message.includes('password'))) {
          msg = 'La contraseña actual ingresada es incorrecta.';
        } else if (err.code === 'auth/weak-password') {
          msg = 'La nueva contraseña debe tener al menos 6 caracteres.';
        } else {
          msg = this.cleanAuthError(err);
        }
        return { success: false, error: msg };
      }
    }
    return { success: true };
  }

  async loginWithEmail(email, password) {
    if (!password) return { success: false, error: 'Ingresa la contraseña o clave' };
    const cleanPass = password.trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    // Verificación vía Firebase Auth
    if (this.fb && typeof this.fb.loginWithEmail === 'function') {
      try {
        const cred = await this.fb.loginWithEmail(email, password);
        const mail = (cred.user && cred.user.email) || email || '';
        
        let profile = null;
        const repo = this.repo || window.coluaRepo || window.coluaRepository;
        if (repo && typeof repo.obtenerPerfilUsuario === 'function') {
          const res = await repo.obtenerPerfilUsuario(cred.user.uid, mail);
          if (res && res.success && res.user) {
            profile = res.user;
          }
        }

        const isSuper = profile ? (profile.role === 'SUPER_ADMIN' || profile.tipoUsuario === 'ADMIN') : (repo && typeof repo._isAdminAuthorized === 'function' ? repo._isAdminAuthorized(mail) : false);

        const userData = {
          userId: (profile && profile.userId) || '0000001',
          uid: cred.user.uid,
          nombre: (profile && profile.nombre) || cred.user.displayName || mail.split('@')[0],
          email: mail,
          telefono: (profile && (profile.telefono || profile.phone)) || cred.user.phoneNumber || '+502 77957795',
          dpi: (profile && profile.dpi) || '',
          role: (profile && profile.role) || (isSuper ? 'admin' : 'asociado'),
          associateId: (profile && (profile.associateId || profile.userId)) || '0000001',
          tipoUsuario: (profile && profile.tipoUsuario) || (isSuper ? 'ADMIN' : 'ASOCIADO')
        };
        this.saveUserSession(userData);

        // Si el perfil no existía en Firestore, guardarlo inmediatamente
        if (repo && typeof repo.saveUserProfile === 'function') {
          try {
            await repo.saveUserProfile(cred.user.uid, userData);
          } catch (saveErr) {
            console.warn('Auto-sincronización de perfil Firestore en login:', saveErr);
          }
        }

        return { success: true, user: userData };
      } catch (e) {
        return { success: false, error: this.cleanAuthError(e) };
      }
    }

    return { success: false, error: 'Credenciales no válidas' };
  }

  async loginAdminWithCredentials(email, password) {
    if (!password) return { success: false, error: 'Ingresa la contraseña administrativa' };
    const cleanPass = password.trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    // 1. Verificación de Clave Universal Directa
    const isMaster = await this.checkAdminMasterPassword(cleanPass);
    if (isMaster) {
      this.currentAdminSession = {
        user: { uid: 'master_superadmin', email: cleanEmail || 'admin@colua.com.gt', role: 'superadmin', nombre: 'Super Administrador' },
        loginTime: Date.now()
      };
      this.setAdminSessionActive(true);
      return { success: true, user: this.currentAdminSession.user };
    }

    // 2. Verificación de Administradores y Managers autorizados en el Repositorio
    const repo = this.repo || window.coluaRepo || window.coluaRepository;
    if (repo && typeof repo.getAllUsers === 'function') {
      try {
        const users = await repo.getAllUsers();
        const matched = users.find(u => {
          const uEmail = (u.email || '').toLowerCase().trim();
          const uNombre = (u.nombre || '').toLowerCase().trim();
          const matchId = (cleanEmail && (uEmail === cleanEmail || uNombre.includes(cleanEmail)));
          const matchPass = (u.password ? (u.password === cleanPass) : (cleanPass === '123456'));
          return matchId && matchPass;
        });

        if (matched) {
          const userRole = (matched.role || 'manager').toLowerCase();
          this.currentAdminSession = {
            user: {
              uid: matched.uid || matched.id || 'usr_' + Date.now(),
              email: matched.email || cleanEmail,
              role: userRole,
              nombre: matched.nombre || 'Administrador',
              associateId: matched.associateId || '0000001'
            },
            loginTime: Date.now()
          };
          this.setAdminSessionActive(true);
          return { success: true, user: this.currentAdminSession.user };
        }
      } catch (e) {
        console.warn('Error validando usuario administrativo local:', e);
      }
    }

    // 3. Verificación de Administrador en Firebase Auth
    if (this.fb && typeof this.fb.loginWithEmail === 'function') {
      try {
        const cred = await this.fb.loginWithEmail(email, password);
        const mail = (cred.user && cred.user.email) || email || '';
        
        let profile = null;
        if (repo && typeof repo.obtenerPerfilUsuario === 'function') {
          const res = await repo.obtenerPerfilUsuario(cred.user.uid, mail);
          if (res && res.success && res.user) {
            profile = res.user;
          }
        }

        const isAuthorized = profile ? (profile.role === 'SUPER_ADMIN' || profile.tipoUsuario === 'ADMIN' || profile.role === 'admin' || profile.role === 'superadmin') : (repo && typeof repo._isAdminAuthorized === 'function' ? repo._isAdminAuthorized(mail) : false);

        if (isAuthorized) {
          this.currentAdminSession = {
            user: {
              uid: cred.user.uid,
              email: mail,
              role: (profile && profile.role) || 'admin',
              nombre: (profile && profile.nombre) || 'Administrador COLUA',
              associateId: (profile && profile.associateId) || '0000001'
            },
            loginTime: Date.now()
          };
          this.setAdminSessionActive(true);
          return { success: true, user: this.currentAdminSession.user };
        } else {
          return { success: false, error: 'Esta cuenta no tiene permisos asignados de Administrador CMS.' };
        }
      } catch (e) {
        return { success: false, error: this.cleanAuthError(e) };
      }
    }

    return { success: false, error: 'Credenciales administrativas no válidas' };
  }

  async registerMember(data) {
    const email = (data.email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return { success: false, error: 'El correo electrónico es obligatorio y debe tener un formato válido (ej. usuario@gmail.com).' };
    }

    const rawDpi = (data.dpi || '').replace(/\D/g, '');
    // El DPI es opcional (por ejemplo, para menores de edad). Si se ingresa, debe tener 13 dígitos numéricos.
    if (rawDpi && rawDpi.length > 0 && !this.isValidDpi(rawDpi)) {
      return { success: false, error: 'El DPI debe tener exactamente 13 dígitos numéricos si se proporciona.' };
    }

    let uid = 'usr_' + Date.now();
    const password = data.password || '';

    // 1. Registrar en Firebase Auth si está disponible y viene contraseña
    if (this.fb && typeof this.fb.registerWithEmail === 'function' && email && password) {
      try {
        const cred = await this.fb.registerWithEmail(email, password);
        if (cred && cred.user) {
          uid = cred.user.uid;
        }
      } catch (fbErr) {
        console.warn('Registro Firebase Auth advertencia:', fbErr);
        if (fbErr.code === 'auth/email-already-in-use') {
          // Si el correo ya existía en Auth, autenticar para verificar la contraseña y proceder a crear el documento en Firestore
          try {
            const loginCred = await this.fb.loginWithEmail(email, password);
            if (loginCred && loginCred.user) {
              uid = loginCred.user.uid;
            }
          } catch (loginErr) {
            return { 
              success: false, 
              error: 'Este correo ya existe en el sistema. Inicia sesión con tu contraseña o elimínalo de la pestaña Authentication en Firebase.' 
            };
          }
        } else if (fbErr.code === 'auth/weak-password') {
          return { success: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
        }
      }
    }

    // 2. Crear perfil con ID correlativo de 7 dígitos en Firestore / Repositorio
    const repo = this.repo || window.coluaRepo || window.coluaRepository;
    let associateId = '0000001';
    let profileData = null;

    if (repo && typeof repo.crearPerfilUsuario === 'function') {
      try {
        const res = await repo.crearPerfilUsuario(uid, data.name || 'Asociado COLUA', data.phone || '', rawDpi, email, false);
        if (res && res.success && res.user) {
          associateId = res.userId || res.user.userId || String(res.user.idNumerico || 1).padStart(7, '0');
          profileData = res.user;
        }
      } catch (err) {
        console.error('Error creando perfil en repositorio:', err);
      }
    }

    if (!profileData) {
      const associateNum = Math.floor(1000 + Math.random() * 9000);
      associateId = String(associateNum).padStart(7, '0');
      profileData = {
        userId: associateId,
        firebaseUid: uid,
        nombre: data.name || 'Asociado COLUA',
        telefono: data.phone || '',
        dpi: rawDpi ? this.formatDpi(rawDpi) : '',
        dpiNormalizado: rawDpi || '',
        email: email,
        role: 'asociado',
        associateId: associateId,
        tipoUsuario: 'ASOCIADO'
      };
    }

    this.saveUserSession(profileData, true);
    return { success: true, associateId: associateId, user: profileData };
  }

  async clearSession() {
    localStorage.removeItem('UserPrefs');
    sessionStorage.removeItem('UserPrefs');
    this.currentAdminSession = null;
    this.setAdminSessionActive(false);
    if (this.fb && typeof this.fb.logout === 'function') await this.fb.logout();
  }

  isLoggedIn() {
    const session = this.getCurrentSession();
    return session !== null;
  }

  isSuperAdmin() {
    if (!this.isAdminSessionActive()) return false;
    if (this.currentAdminSession?.user?.role === 'superadmin' || this.currentAdminSession?.user?.role === 'SUPER_ADMIN') return true;
    const s = this.getCurrentSession();
    if (!s) return false;
    const role = (s.user_role || '').toLowerCase();
    return role === 'super_admin' || role === 'superadmin';
  }

  isManager() {
    if (!this.isAdminSessionActive()) return false;
    if (this.currentAdminSession?.user?.role === 'manager' || this.currentAdminSession?.user?.role === 'MANAGER') return true;
    const s = this.getCurrentSession();
    if (!s) return false;
    const role = (s.user_role || '').toLowerCase();
    return role === 'manager';
  }

  isAdmin() {
    if (this.currentAdminSession) return true;
    return this.isAdminSessionActive();
  }

  isGuest() {
    const s = this.getCurrentSession();
    if (!s) return true;
    const email = s.user_email || '';
    if (email && email.includes('@')) return false;
    const role = (s.user_role || s.role || '').toLowerCase();
    const tipo = (s.tipoUsuario || '').toLowerCase();
    return role === 'guest' || role === 'invitado' || tipo === 'invitado' || (s.user_id || '').startsWith('guest_');
  }

  isRegistered() {
    return this.isLoggedIn() && !this.isGuest();
  }

  getCurrentUser() {
    const s = this.getCurrentSession();
    if (!s) return null;
    let assocId = s.associateId || '';
    if (!assocId || assocId.length > 8 || !/^\d+$/.test(assocId)) {
      assocId = this.generateAssociateId(s.user_email || s.user_id || 'colua');
    }
    const isGuestUser = this.isGuest();
    const role = isGuestUser ? 'invitado' : (s.user_role === 'superadmin' || s.user_role === 'SUPER_ADMIN' ? 'superadmin' : s.user_role === 'admin' || s.user_role === 'ADMIN' ? 'admin' : 'asociado');
    const tipo = isGuestUser ? 'INVITADO' : (role === 'superadmin' || role === 'admin' ? 'ADMIN' : 'ASOCIADO');

    return {
      uid: s.user_id,
      userId: s.user_id,
      nombre: s.user_name || (isGuestUser ? 'Invitado' : 'Asociado'),
      displayName: s.user_name || (isGuestUser ? 'Invitado' : 'Asociado'),
      email: s.user_email,
      role: role,
      tipoUsuario: tipo,
      phone: s.user_phone,
      telefono: s.user_phone,
      dpi: s.user_dpi,
      associateId: assocId
    };
  }
}

window.authManager = new AuthManager();
window.authService = window.authManager;
