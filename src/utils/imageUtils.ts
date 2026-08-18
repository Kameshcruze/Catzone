/**
 * Normalizes and converts various image URLs (Google Drive, Dropbox, Imgur, etc.)
 * into directly embeddable image sources.
 */

export const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=1000&q=80';

/**
 * Extracts Google Drive ID if present in the link
 */
export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // Pattern 1: /file/d/FILE_ID/view or /file/u/0/d/FILE_ID
  const matchFileD = trimmed.match(/\/file\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]+)/i);
  if (matchFileD && matchFileD[1]) {
    return matchFileD[1];
  }

  // Pattern 2: ?id=FILE_ID or &id=FILE_ID
  const matchIdParam = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if (matchIdParam && matchIdParam[1]) {
    return matchIdParam[1];
  }

  // Pattern 3: /thumbnail?id=FILE_ID
  const matchThumbnail = trimmed.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/i);
  if (matchThumbnail && matchThumbnail[1]) {
    return matchThumbnail[1];
  }

  return null;
}

/**
 * Converts any URL (Google Drive, Dropbox, Imgur, Data URL, etc.)
 * into a directly embeddable <img> src string.
 */
export function normalizeImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') return DEFAULT_FALLBACK_IMAGE;

  let trimmed = url.trim();
  if (!trimmed) return DEFAULT_FALLBACK_IMAGE;

  // Already a base64 / data URL
  if (trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  // Google Drive Detection
  if (
    trimmed.includes('drive.google.com') ||
    trimmed.includes('docs.google.com') ||
    trimmed.includes('googleusercontent.com/d/')
  ) {
    const driveId = extractGoogleDriveId(trimmed);
    if (driveId) {
      // Primary direct CDN endpoint for Google Drive images (high resolution thumbnail)
      return `https://lh3.googleusercontent.com/d/${driveId}`;
    }
  }

  // Dropbox Detection
  if (trimmed.includes('dropbox.com')) {
    if (trimmed.includes('?dl=0')) {
      return trimmed.replace('?dl=0', '?raw=1');
    }
    if (trimmed.includes('&dl=0')) {
      return trimmed.replace('&dl=0', '&raw=1');
    }
    if (!trimmed.includes('raw=1') && !trimmed.includes('dl=1')) {
      return trimmed.includes('?') ? `${trimmed}&raw=1` : `${trimmed}?raw=1`;
    }
  }

  // Imgur Detection (non-direct link to image)
  if (trimmed.includes('imgur.com') && !trimmed.includes('i.imgur.com') && !trimmed.includes('/a/')) {
    const imgurMatch = trimmed.match(/imgur\.com\/([a-zA-Z0-9]+)$/);
    if (imgurMatch && imgurMatch[1]) {
      return `https://i.imgur.com/${imgurMatch[1]}.jpg`;
    }
  }

  return trimmed;
}

/**
 * Compresses an image file from user's device to a compact Base64 data URL
 */
export function processImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image file'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
