// Utility functions

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Get the base path from Next.js configuration
 * Returns empty string for Vercel deployment (root URL)
 */
export function getBasePath(): string {
  return '';
}

/**
 * Prefix an asset path with the base path
 * @param path - The asset path (e.g., '/images/logo.png')
 * @returns The full path with base path prefix
 */
export function getAssetPath(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const basePath = getBasePath();
  if (basePath && path.startsWith(basePath)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}

/**
 * Get the full URL including origin and base path
 * @param path - The path to append (e.g., '/gym/1')
 * @returns The full URL
 */
export function getFullUrl(path: string = ''): string {
  if (typeof window === 'undefined') {
    return getAssetPath(path);
  }

  const basePath = getBasePath();
  const origin = window.location.origin;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${origin}${basePath}${normalizedPath}`;
}





