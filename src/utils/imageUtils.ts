/**
 * Utility functions for image handling and URL construction
 */

// Configuración para diferentes servicios de almacenamiento
const STORAGE_CONFIG = {
  // Para desarrollo local con servidor de archivos estáticos
  LOCAL: {
    baseUrl: import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000',
    uploadPath: '/uploads/'
  },
  
  // Para Cloudinary (ejemplo)
  CLOUDINARY: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    baseUrl: 'https://res.cloudinary.com'
  },
  
  // Para Firebase Storage (ejemplo)
  FIREBASE: {
    baseUrl: import.meta.env.VITE_FIREBASE_STORAGE_URL
  }
};

/**
 * Construye la URL correcta para mostrar una imagen
 * @param imagePath - Ruta almacenada en la base de datos
 * @param filename - Nombre del archivo
 * @returns URL accesible para el navegador
 */
export const buildImageUrl = (imagePath: string, filename: string): string => {
  // Si ya es una URL completa, devolverla tal cual
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Para rutas locales, construir URL del servidor
  if (imagePath.includes('\\') || imagePath.includes('/')) {
    // Extraer solo el nombre del archivo de la ruta completa
    const cleanFilename = filename || imagePath.split(/[\/\\]/).pop() || '';
    return `${STORAGE_CONFIG.LOCAL.baseUrl}${STORAGE_CONFIG.LOCAL.uploadPath}${cleanFilename}`;
  }
  
  // Para nombres de archivo simples
  return `${STORAGE_CONFIG.LOCAL.baseUrl}${STORAGE_CONFIG.LOCAL.uploadPath}${filename}`;
};

/**
 * Valida si una URL de imagen es accesible
 * @param url - URL a validar
 * @returns Promise<boolean>
 */
export const isImageUrlAccessible = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Maneja el fallback cuando una imagen no carga
 * @param event - Evento de error
 * @param fallbackElement - Elemento alternativo a mostrar
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>, fallbackElement?: HTMLElement): void => {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';
  
  // Mostrar elemento de fallback si existe
  if (fallbackElement) {
    fallbackElement.classList.remove('hidden');
  }
  
  // O mostrar un placeholder genérico
  const parent = img.parentElement;
  if (parent) {
    let placeholder = parent.querySelector('.image-placeholder');
    if (!placeholder) {
      placeholder = document.createElement('div');
      placeholder.className = 'image-placeholder absolute inset-0 flex items-center justify-center bg-muted';
      placeholder.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      `;
      parent.appendChild(placeholder);
    }
    placeholder.classList.remove('hidden');
  }
};

/**
 * Formatea el tamaño de archivo de forma legible
 * @param bytes - Tamaño en bytes
 * @returns String formateado
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};