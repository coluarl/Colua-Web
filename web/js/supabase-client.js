// Almacén IndexedDB nativo para documentos grandes en el sistema (PDFs de 1MB a 100MB+)
const ColuaPdfStore = {
  dbPromise: null,
  getDb() {
    if (this.dbPromise) return this.dbPromise;
    this.dbPromise = new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open('ColuaSystemStorage', 1);
        request.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains('pdf_files')) {
            db.createObjectStore('pdf_files', { keyPath: 'id' });
          }
        };
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.target.error || new Error('No se pudo abrir IndexedDB'));
      } catch (err) {
        reject(err);
      }
    });
    return this.dbPromise;
  },

  async savePdf(id, fileOrBlob, fileName) {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('pdf_files', 'readwrite');
        const store = tx.objectStore('pdf_files');
        store.put({
          id: id,
          blob: fileOrBlob,
          name: fileName,
          size: fileOrBlob.size || 0,
          type: 'application/pdf',
          updatedAt: Date.now()
        });
        tx.oncomplete = () => resolve(true);
        tx.onerror = (e) => reject(e.target.error);
      });
    } catch (err) {
      console.error('[ColuaPdfStore] Error al guardar PDF:', err);
      return false;
    }
  },

  async getPdf(id) {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('pdf_files', 'readonly');
        const store = tx.objectStore('pdf_files');
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = (e) => reject(e.target.error);
      });
    } catch (err) {
      console.error('[ColuaPdfStore] Error al obtener PDF:', err);
      return null;
    }
  }
};
window.ColuaPdfStore = ColuaPdfStore;

// Cliente y Gestor de Almacenamiento Supabase Storage (Equivalente a SupabaseStorageManager.kt)
class SupabaseStorageManager {
  constructor() {
    this.url = window.COLUA_CONFIG.supabase.url;
    this.key = window.COLUA_CONFIG.supabase.anonKey;
    this.buckets = window.COLUA_CONFIG.supabase.buckets;
    this.defaultBucket = window.COLUA_CONFIG.supabase.defaultBucket;
  }

  // Comprimir imagen a JPEG con canvas antes de subir
  async compressImage(file, maxDimension = 800, quality = 0.75) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          const maxCurr = Math.max(width, height);
          if (maxCurr > maxDimension) {
            const scale = maxDimension / maxCurr;
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({ blob, dataUrl: canvas.toDataURL('image/jpeg', quality) });
              } else {
                reject(new Error('Fallo al comprimir imagen.'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => reject(new Error('Archivo de imagen no válido.'));
        img.src = event.target.result;
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo.'));
      reader.readAsDataURL(file);
    });
  }

  // Subir imagen a Supabase Storage con reintentos y fallback a Base64
  async uploadImage(file, onProgress = () => {}) {
    try {
      onProgress('Comprimiendo imagen...');
      const { blob, dataUrl } = await this.compressImage(file);

      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const fileName = `colua_${timestamp}_${randomStr}.jpg`;

      onProgress('Subiendo a Supabase Storage...');

      // Probar buckets configurados
      for (const bucket of this.buckets) {
        try {
          const uploadEndpoint = `${this.url}/storage/v1/object/${bucket}/${fileName}`;
          const response = await fetch(uploadEndpoint, {
            method: 'POST',
            headers: {
              'apikey': this.key,
              'Authorization': `Bearer ${this.key}`,
              'Content-Type': 'image/jpeg',
              'x-upsert': 'true'
            },
            body: blob
          });

          if (response.ok) {
            const publicUrl = `${this.url}/storage/v1/object/public/${bucket}/${fileName}`;
            console.log(`✓ Imagen subida exitosamente al bucket '${bucket}': ${publicUrl}`);
            return { success: true, url: publicUrl, type: 'cloud' };
          }
        } catch (bucketError) {
          console.warn(`Error en bucket '${bucket}':`, bucketError.message);
        }
      }

      // Fallback a Data URI en Base64 para garantizar que nunca se pierda la imagen
      console.warn('Supabase Storage restringido por RLS. Usando Cloud Data URI en Base64 como fallback.');
      return { success: true, url: dataUrl, type: 'data_uri' };

    } catch (e) {
      console.error('Error general al procesar imagen:', e);
      return { success: false, error: e.message };
    }
  }

  // Subir documento PDF a Supabase Storage con respaldo seguro en IndexedDB del sistema
  async uploadPdf(file, onProgress = () => {}) {
    try {
      if (!file) throw new Error('No se seleccionó ningún archivo PDF.');
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        throw new Error('El archivo seleccionado no es un formato PDF válido.');
      }

      const timestamp = Date.now();
      const cleanBaseName = file.name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
      const fileName = `colua_doc_${timestamp}_${cleanBaseName}`;
      const docKey = `doc_${timestamp}_${Math.random().toString(36).substring(2, 7)}`;

      onProgress('Almacenando documento en el sistema local...');

      // 1. Guardar en IndexedDB del sistema (garantiza persistencia de archivos de 1MB a 100MB+ sin límite de localStorage)
      await ColuaPdfStore.savePdf(docKey, file, file.name);
      console.log(`✓ PDF almacenado con éxito en el sistema local (IndexedDB): ${docKey}`);

      onProgress('Verificando respaldo en la nube...');

      // 2. Intentar subir a Supabase Storage si está disponible
      for (const bucket of this.buckets) {
        try {
          const uploadEndpoint = `${this.url}/storage/v1/object/${bucket}/${fileName}`;
          const response = await fetch(uploadEndpoint, {
            method: 'POST',
            headers: {
              'apikey': this.key,
              'Authorization': `Bearer ${this.key}`,
              'Content-Type': 'application/pdf',
              'x-upsert': 'true'
            },
            body: file
          });

          if (response.ok) {
            const publicUrl = `${this.url}/storage/v1/object/public/${bucket}/${fileName}`;
            console.log(`✓ PDF subido exitosamente a la nube (${bucket}): ${publicUrl}`);
            return {
              success: true,
              url: publicUrl,
              docKey: docKey,
              type: 'cloud',
              fileName: file.name,
              fileSize: file.size
            };
          }
        } catch (bucketError) {
          console.warn(`Bucket '${bucket}' no disponible:`, bucketError.message);
        }
      }

      // 3. Si no sube a la nube, la URL es la referencia limpia a IndexedDB (solo 30 caracteres)
      const localDocUrl = 'indexeddb:' + docKey;
      console.log('✓ PDF listo en almacenamiento seguro del sistema:', localDocUrl);
      return {
        success: true,
        url: localDocUrl,
        docKey: docKey,
        type: 'indexeddb',
        fileName: file.name,
        fileSize: file.size
      };

    } catch (e) {
      console.error('Error al procesar PDF:', e);
      return { success: false, error: e.message };
    }
  }

  // Limpiar y formatear etiqueta para visualización amigable
  getShortDisplayLabel(path) {
    if (!path || !path.trim()) return '';
    const clean = path.trim();
    if (clean.startsWith('data:image/')) return 'imagen_subida_nube.jpg';
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      const last = clean.split('/').pop() || '';
      return (last.length > 25 ? last.substring(0, 22) + '...' : last);
    }
    return clean;
  }

  // Resolver ruta de imagen (sea URL remota, Data URI, JSON o Drawable fotográfico)
  resolveImageUrl(path, fallbackDrawable = 'assets/noticia_reforestacion.jpg') {
    if (!path || !path.trim()) return fallbackDrawable;
    let clean = path.trim();

    // Si viene empaquetado como JSON o array de fotos: e.g. "[data:image/jpeg;base64,...]"
    if (clean.startsWith('[') && clean.endsWith(']')) {
      try {
        const parsed = JSON.parse(clean);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]) {
          clean = parsed[0].trim();
        }
      } catch (e) {
        // En caso de formato semi-json no estándar "[data:...]"
        const match = clean.match(/(data:image\/[a-zA-Z0-9+]+;base64,[^\s,\]]+|https?:\/\/[^\s,\]]+)/);
        if (match && match[1]) {
          clean = match[1];
        }
      }
    }

    if (clean.startsWith('data:image/') || clean.startsWith('http://') || clean.startsWith('https://')) {
      return clean;
    }

    // Mapeo contextual de nombres clave a fotos de alta resolución
    const lower = clean.toLowerCase();
    if (lower === 'grupo' || lower.includes('reforesta')) {
      return 'assets/noticia_reforestacion.jpg';
    }
    if (lower === 'sostenibilidad_cooperativa' || lower.includes('taller') || lower.includes('finanza')) {
      return 'assets/noticia_taller_finanzas.jpg';
    }
    if (lower === 'noticias_colua' || lower.includes('asamblea')) {
      return 'assets/noticia_asamblea_general.jpg';
    }
    if (lower === 'valores_colua' || lower === 'valores_colua_1') {
      return 'assets/valores_colua.png';
    }

    // Si ya incluye ruta assets
    if (clean.startsWith('assets/')) return clean;
    return `assets/${clean}.png`;
  }
}

window.supabaseStorageManager = new SupabaseStorageManager();

// Visualizador universal de documentos PDF en una nueva pestaña del navegador
window.openPdfDocument = async function(pdfUrl, title = 'Documento Oficial COLUA', itemId = null) {
  let cleanUrl = (pdfUrl || '').trim();

  // Si no se proporcionó pdfUrl o viene vacío pero hay itemId, buscar en el repositorio
  if ((!cleanUrl || cleanUrl === 'pdf:') && itemId && window.coluaRepo) {
    try {
      const item = await window.coluaRepo.getItemById(itemId);
      if (item) {
        title = item.title || title;
        cleanUrl = (item.pdfUrl || item.buttonAction || '').trim();
      }
    } catch (e) {
      console.warn('[ColuaPDF] Error recuperando item por ID:', e);
    }
  }

  if (cleanUrl.startsWith('pdf:')) {
    cleanUrl = cleanUrl.replace(/^pdf:/, '').trim();
  }

  if (!cleanUrl) {
    if (window.Swal) {
      Swal.fire({
        title: 'Documento no disponible',
        text: 'Este elemento aún no tiene un archivo PDF adjunto en el sistema.',
        icon: 'info',
        confirmButtonColor: '#173789'
      });
    } else {
      alert('Documento PDF no disponible.');
    }
    return;
  }

  // 1. Si es un documento almacenado en el sistema local (IndexedDB)
  if (cleanUrl.startsWith('indexeddb:')) {
    const docId = cleanUrl.replace('indexeddb:', '').trim();
    try {
      if (!window.ColuaPdfStore) {
        throw new Error('Almacén IndexedDB no inicializado');
      }
      const record = await window.ColuaPdfStore.getPdf(docId);
      if (record && record.blob) {
        let finalBlob = record.blob;
        if (!(finalBlob instanceof Blob)) {
          finalBlob = new Blob([record.blob], { type: 'application/pdf' });
        } else if (finalBlob.type !== 'application/pdf') {
          finalBlob = new Blob([finalBlob], { type: 'application/pdf' });
        }

        const blobUrl = URL.createObjectURL(finalBlob);
        const fileName = (record.name || title || 'documento_oficial_colua').replace(/\.pdf$/i, '') + '.pdf';

        // Intento 1: abrir en nueva ventana
        const newWin = window.open(blobUrl, '_blank');
        
        // Si el navegador bloqueó la ventana emergente asíncrona
        if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
          const a = document.createElement('a');
          a.href = blobUrl;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          document.body.appendChild(a);
          a.click();
          setTimeout(() => { document.body.removeChild(a); }, 300);

          // Aviso amigable con enlace directo en caso de bloqueo estricto del navegador
          if (window.Swal) {
            Swal.fire({
              title: title || 'Documento Oficial',
              text: 'Tu navegador bloqueó la apertura automática de la nueva pestaña.',
              icon: 'info',
              confirmButtonText: 'Abrir PDF en Nueva Pestaña ↗',
              confirmButtonColor: '#dc2626',
              showCancelButton: true,
              cancelButtonText: 'Descargar PDF',
              cancelButtonColor: '#173789'
            }).then((result) => {
              if (result.isConfirmed) {
                window.open(blobUrl, '_blank');
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                const dl = document.createElement('a');
                dl.href = blobUrl;
                dl.download = fileName;
                document.body.appendChild(dl);
                dl.click();
                setTimeout(() => { document.body.removeChild(dl); }, 300);
              }
            });
          }
        }
        return;
      } else {
        console.warn(`[ColuaPdfStore] Documento ${docId} no encontrado en IndexedDB`);
        if (window.Swal) {
          Swal.fire({
            title: 'Documento no encontrado',
            text: 'El archivo PDF no está disponible en este navegador. Puedes volver a cargarlo desde el Portal Administrativo.',
            icon: 'warning',
            confirmButtonColor: '#173789'
          });
        } else {
          alert('El archivo PDF no se encuentra en el almacenamiento local.');
        }
        return;
      }
    } catch (err) {
      console.error('[ColuaPDF] Error al abrir PDF de IndexedDB:', err);
    }
  }

  // 2. Si es una URL web externa o en la nube (http/https)
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    const newWindow = window.open(cleanUrl, '_blank', 'noopener,noreferrer');
    if (!newWindow) {
      const link = document.createElement('a');
      link.href = cleanUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => { document.body.removeChild(link); }, 300);
    }
    return;
  }

  // 3. Si es un Data URI en Base64
  if (cleanUrl.startsWith('data:application/pdf') || cleanUrl.startsWith('data:')) {
    try {
      const base64Data = cleanUrl.includes(',') ? cleanUrl.split(',')[1] : cleanUrl;
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      
      const newWin = window.open(blobUrl, '_blank');
      if (!newWin) {
        const a = document.createElement('a');
        a.href = blobUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { document.body.removeChild(a); }, 300);
      }
    } catch (e) {
      console.error('[ColuaPDF] Error al procesar Base64:', e);
      window.open(cleanUrl, '_blank');
    }
    return;
  }

  // 4. Enlace relativo a assets
  window.open(cleanUrl, '_blank');
};

