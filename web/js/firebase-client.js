// Conector e Inicializador del SDK de Firebase
class FirebaseClient {
  constructor() {
    this._app = null;
    this._auth = null;
    this._db = null;
    this.isInitialized = false;
    this.init();

    if (typeof window !== 'undefined') {
      window.addEventListener('DOMContentLoaded', () => this.init());
      window.addEventListener('load', () => this.init());
    }
  }

  init() {
    try {
      if (typeof firebase === 'undefined' || !window.COLUA_CONFIG || !window.COLUA_CONFIG.firebase) {
        return false;
      }
      if (!this._app) {
        if (!firebase.apps || !firebase.apps.length) {
          this._app = firebase.initializeApp(window.COLUA_CONFIG.firebase);
        } else {
          this._app = firebase.app();
        }
      }
      if (!this._auth && typeof firebase.auth === 'function') {
        this._auth = firebase.auth();
      }
      if (!this._db && typeof firebase.firestore === 'function') {
        this._db = firebase.firestore();
      }
      if (!this._storage && typeof firebase.storage === 'function') {
        this._storage = firebase.storage();
      }
      this.isInitialized = !!(this._app && this._db);
      return this.isInitialized;
    } catch (e) {
      console.warn('[FirebaseClient] Advertencia de inicialización:', e.message || e);
      return false;
    }
  }

  get app() {
    if (!this._app) this.init();
    return this._app;
  }
  set app(v) { this._app = v; }

  get auth() {
    if (!this._auth) this.init();
    return this._auth;
  }
  set auth(v) { this._auth = v; }

  get db() {
    if (!this._db) this.init();
    return this._db;
  }
  set db(v) { this._db = v; }

  get storage() {
    if (!this._storage) this.init();
    return this._storage;
  }
  set storage(v) { this._storage = v; }

  // --- MÉTODOS DE AUTENTICACIÓN ---
  async loginWithEmail(email, password) {
    const auth = this.auth;
    if (!auth) throw new Error('Firebase Auth no disponible.');
    return await auth.signInWithEmailAndPassword(email.trim(), password);
  }

  async registerWithEmail(email, password) {
    const auth = this.auth;
    if (!auth) throw new Error('Firebase Auth no disponible.');
    return await auth.createUserWithEmailAndPassword(email.trim(), password);
  }

  async loginAnonymously() {
    const auth = this.auth;
    if (!auth) throw new Error('Firebase Auth no disponible.');
    return await auth.signInAnonymously();
  }

  async sendPasswordReset(email) {
    const auth = this.auth;
    if (!auth) throw new Error('Firebase Auth no disponible.');
    return await auth.sendPasswordResetEmail(email.trim());
  }

  async updateUserPassword(currentPassword, newPassword) {
    const auth = this.auth;
    if (!auth || !auth.currentUser) throw new Error('No hay sesión activa para cambiar la contraseña.');
    const user = auth.currentUser;
    const email = user.email;
    if (email && currentPassword && typeof firebase !== 'undefined' && firebase.auth && firebase.auth.EmailAuthProvider) {
      const credential = firebase.auth.EmailAuthProvider.credential(email, currentPassword);
      await user.reauthenticateWithCredential(credential);
    }
    return await user.updatePassword(newPassword);
  }

  async logout() {
    const auth = this.auth;
    if (!auth) return;
    return await auth.signOut();
  }

  getCurrentUser() {
    const auth = this.auth;
    return auth ? auth.currentUser : null;
  }

  onAuthStateChanged(callback) {
    const auth = this.auth;
    if (!auth) return () => {};
    return auth.onAuthStateChanged(callback);
  }

  // --- HELPERS DE FIRESTORE ---
  collection(name) {
    const db = this.db;
    if (!db) throw new Error('Firestore no disponible.');
    return db.collection(name);
  }

  async runTransaction(updateFunction) {
    const db = this.db;
    if (!db) throw new Error('Firestore no disponible.');
    return await db.runTransaction(updateFunction);
  }

  serverTimestamp() {
    if (typeof firebase !== 'undefined' && firebase.firestore) {
      return firebase.firestore.FieldValue.serverTimestamp();
    }
    return new Date();
  }
}

window.firebaseClient = new FirebaseClient();
