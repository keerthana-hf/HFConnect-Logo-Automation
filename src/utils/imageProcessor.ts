import { ProcessedLogoResult } from '../types';

/**
 * Sanitizes a connector name into a URL and filesystem safe string:
 * e.g., "Salesforce CRM (v2)" -> "salesforce-crm-v2"
 */
export function sanitizeConnectorName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'connector';
}

/**
 * Validates the uploaded file type and size
 */
export function validateUploadFile(file: File): { valid: boolean; error?: string } {
  const validExtensions = ['.png', '.jpg', '.jpeg', '.svg'];
  const validMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];

  const fileName = file.name.toLowerCase();
  const hasValidExt = validExtensions.some(ext => fileName.endsWith(ext));
  const hasValidMime = validMimeTypes.includes(file.type) || file.type.startsWith('image/');

  if (!hasValidExt && !hasValidMime) {
    return {
      valid: false,
      error: 'Please upload a PNG, JPG, JPEG, or SVG file.'
    };
  }

  // 15MB limit
  const maxBytes = 15 * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: 'File size exceeds 15MB limit. Please upload a smaller image.'
    };
  }

  return { valid: true };
}

/**
 * Sanitizes raw SVG text by removing script tags, handlers, and external references
 */
export function sanitizeSvgText(rawSvg: string): string {
  let cleaned = rawSvg;
  // Remove script tags
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Remove inline event handlers like onclick, onload, onerror
  cleaned = cleaned.replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '');
  // Remove javascript: URLs
  cleaned = cleaned.replace(/href\s*=\s*(['"])javascript:.*?\1/gi, '');
  return cleaned;
}

/**
 * Loads an image file (PNG, JPG, SVG) into an HTMLImageElement
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const rawText = reader.result as string;
          const sanitized = sanitizeSvgText(rawText);
          const blob = new Blob([sanitized], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
          };
          img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Could not parse SVG image. Please check that it is a valid SVG.'));
          };
          img.src = url;
        } catch {
          reject(new Error('Error processing SVG content.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read SVG file.'));
      reader.readAsText(file);
    } else {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image. The file may be corrupt.'));
      };
      img.src = url;
    }
  });
}

/**
 * Loads an image from a Data URL
 */
export function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image from data URL'));
    img.src = dataUrl;
  });
}

interface AlphaDetectionResult {
  hasMeaningfulTransparency: boolean;
  transparentRatio: number;
}

/**
 * Checks if the image already contains meaningful transparent pixels
 */
function analyzeTransparency(imageData: ImageData): AlphaDetectionResult {
  const data = imageData.data;
  let transparentCount = 0;
  const totalPixels = imageData.width * imageData.height;

  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 240) {
      transparentCount++;
    }
  }

  const transparentRatio = transparentCount / totalPixels;
  // If more than 1% of pixels are transparent or semi-transparent
  const hasMeaningfulTransparency = transparentRatio > 0.01;

  return {
    hasMeaningfulTransparency,
    transparentRatio
  };
}

/**
 * Color distance calculation in RGB space
 */
function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr * 0.299 + dg * dg * 0.587 + db * db * 0.114);
}

/**
 * Removes solid/near-solid background from an opaque image with anti-aliasing feathering
 */
function removeSolidBackground(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return false;

  const width = canvas.width;
  const height = canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Sample perimeter corner pixels to determine background colors
  const samplePoints = [
    { x: 0, y: 0 },
    { x: width - 1, y: 0 },
    { x: 0, y: height - 1 },
    { x: width - 1, y: height - 1 },
    { x: Math.floor(width / 2), y: 0 },
    { x: Math.floor(width / 2), y: height - 1 },
    { x: 0, y: Math.floor(height / 2) },
    { x: width - 1, y: Math.floor(height / 2) },
  ];

  const bgColors: { r: number; g: number; b: number; count: number }[] = [];

  for (const pt of samplePoints) {
    const idx = (pt.y * width + pt.x) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];

    if (a < 50) continue; // already transparent

    // Group close colors
    let found = false;
    for (const bg of bgColors) {
      if (colorDistance(r, g, b, bg.r, bg.g, bg.b) < 18) {
        bg.r = Math.round((bg.r * bg.count + r) / (bg.count + 1));
        bg.g = Math.round((bg.g * bg.count + g) / (bg.count + 1));
        bg.b = Math.round((bg.b * bg.count + b) / (bg.count + 1));
        bg.count++;
        found = true;
        break;
      }
    }

    if (!found) {
      bgColors.push({ r, g, b, count: 1 });
    }
  }

  if (bgColors.length === 0) {
    return false;
  }

  // Sort by frequency
  bgColors.sort((a, b) => b.count - a.count);
  const primaryBg = bgColors[0];

  // Flood fill / threshold edge mask
  // Color threshold: within threshold => transparent, with smooth alpha ramp
  const threshold = 22;
  const feather = 16;

  let pixelsChanged = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a === 0) continue;

    // Check distance to primary background or any other frequent perimeter background color
    let minDiff = 999;
    for (const bg of bgColors) {
      if (bg.count >= 1) {
        const diff = colorDistance(r, g, b, bg.r, bg.g, bg.b);
        if (diff < minDiff) minDiff = diff;
      }
    }

    if (minDiff <= threshold) {
      data[i + 3] = 0;
      pixelsChanged++;
    } else if (minDiff < threshold + feather) {
      const alphaFactor = (minDiff - threshold) / feather;
      data[i + 3] = Math.round(a * alphaFactor);
      pixelsChanged++;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return pixelsChanged > 0;
}

interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

/**
 * Finds the bounding box of non-transparent meaningful pixels (alpha > 15)
 */
function getAlphaBoundingBox(imageData: ImageData): BoundingBox | null {
  const { width, height, data } = imageData;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const alpha = data[idx + 3];

      if (alpha > 15) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    return null;
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1
  };
}

/**
 * Crops canvas to the meaningful bounding box
 */
function cropCanvasToBoundingBox(sourceCanvas: HTMLCanvasElement, bbox: BoundingBox): HTMLCanvasElement {
  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = bbox.width;
  croppedCanvas.height = bbox.height;
  const ctx = croppedCanvas.getContext('2d');
  if (!ctx) throw new Error('Could not create 2D canvas context');

  ctx.drawImage(
    sourceCanvas,
    bbox.minX,
    bbox.minY,
    bbox.width,
    bbox.height,
    0,
    0,
    bbox.width,
    bbox.height
  );

  return croppedCanvas;
}

/**
 * Master processing pipeline:
 * 1. Validates input
 * 2. Loads image
 * 3. Checks existing transparency vs solid background
 * 4. Strips background if needed
 * 5. Finds exact alpha bounding box
 * 6. Crops transparent padding
 * 7. Applies deterministic Figma normalization for 150x150 and 56x56
 * 8. Returns clean SVGs and metadata
 */
export async function processConnectorLogo(
  file: File,
  connectorName: string,
  onProgress?: (step: string) => void
): Promise<ProcessedLogoResult> {
  const startTime = performance.now();

  const trimmedName = connectorName.trim();
  if (!trimmedName) {
    throw new Error('Please enter a connector name (e.g. Salesforce, Zapier).');
  }

  const validation = validateUploadFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid file format.');
  }

  onProgress?.('Loading image file...');
  const img = await loadImageFromFile(file);

  const origWidth = img.naturalWidth || img.width;
  const origHeight = img.naturalHeight || img.height;

  if (origWidth === 0 || origHeight === 0) {
    throw new Error('Image has zero dimensions or could not be rendered.');
  }

  // Draw into working canvas
  onProgress?.('Analyzing transparency and background...');
  const workCanvas = document.createElement('canvas');
  workCanvas.width = origWidth;
  workCanvas.height = origHeight;
  const workCtx = workCanvas.getContext('2d', { willReadFrequently: true });
  if (!workCtx) throw new Error('Failed to initialize canvas.');

  workCtx.drawImage(img, 0, 0);
  const initialImageData = workCtx.getImageData(0, 0, origWidth, origHeight);

  const { hasMeaningfulTransparency } = analyzeTransparency(initialImageData);
  let backgroundRemoved = false;

  if (!hasMeaningfulTransparency) {
    onProgress?.('Removing solid background...');
    backgroundRemoved = removeSolidBackground(workCanvas);
  }

  onProgress?.('Detecting logo artwork bounds & cropping padding...');
  const updatedImageData = workCtx.getImageData(0, 0, origWidth, origHeight);
  const bbox = getAlphaBoundingBox(updatedImageData);

  if (!bbox) {
    throw new Error(
      "We couldn't detect a logo in this image. Please upload an image with visible artwork."
    );
  }

  const croppedCanvas = cropCanvasToBoundingBox(workCanvas, bbox);
  const croppedDataUrl = croppedCanvas.toDataURL('image/png');

  onProgress?.('Calculating Figma safe-area geometry...');
  const cropW = bbox.width;
  const cropH = bbox.height;
  const aspect = cropW / cropH;

  // ----------------------------------------------------
  // Large Logo Specification:
  // Viewport: 150 x 150
  // Safe Area: 112 x 112
  // Outer Inset: 19px
  // ----------------------------------------------------
  let largePlacedW: number;
  let largePlacedH: number;

  if (cropW >= cropH) {
    largePlacedW = 112;
    largePlacedH = Math.round((112 / aspect) * 100) / 100;
  } else {
    largePlacedH = 112;
    largePlacedW = Math.round((112 * aspect) * 100) / 100;
  }

  const largeX = Math.round((19 + (112 - largePlacedW) / 2) * 100) / 100;
  const largeY = Math.round((19 + (112 - largePlacedH) / 2) * 100) / 100;

  // ----------------------------------------------------
  // Small Logo Specification:
  // Viewport: 56 x 56
  // Safe Area: 48 x 48
  // Outer Inset: 4px
  // ----------------------------------------------------
  let smallPlacedW: number;
  let smallPlacedH: number;

  if (cropW >= cropH) {
    smallPlacedW = 48;
    smallPlacedH = Math.round((48 / aspect) * 100) / 100;
  } else {
    smallPlacedH = 48;
    smallPlacedW = Math.round((48 * aspect) * 100) / 100;
  }

  const smallX = Math.round((4 + (48 - smallPlacedW) / 2) * 100) / 100;
  const smallY = Math.round((4 + (48 - smallPlacedH) / 2) * 100) / 100;

  onProgress?.('Generating production SVG outputs...');

  const sanitizedSlug = sanitizeConnectorName(trimmedName);
  const largeFilename = `${sanitizedSlug}-150x150.svg`;
  const smallFilename = `${sanitizedSlug}-56x56.svg`;

  const largeSvgString = `<svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <!-- HappyFox Integration Card: Large 150x150 (112x112 Safe Area with 19px Inset) -->
  <image x="${largeX}" y="${largeY}" width="${largePlacedW}" height="${largePlacedH}" preserveAspectRatio="xMidYMid meet" xlink:href="${croppedDataUrl}" href="${croppedDataUrl}"/>
</svg>`;

  const smallSvgString = `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <!-- HappyFox Integration Card: Small 56x56 (48x48 Safe Area with 4px Inset) -->
  <image x="${smallX}" y="${smallY}" width="${smallPlacedW}" height="${smallPlacedH}" preserveAspectRatio="xMidYMid meet" xlink:href="${croppedDataUrl}" href="${croppedDataUrl}"/>
</svg>`;

  const largeBlob = new Blob([largeSvgString], { type: 'image/svg+xml;charset=utf-8' });
  const smallBlob = new Blob([smallSvgString], { type: 'image/svg+xml;charset=utf-8' });

  const largeBlobUrl = URL.createObjectURL(largeBlob);
  const smallBlobUrl = URL.createObjectURL(smallBlob);

  const processingTimeMs = Math.round(performance.now() - startTime);

  return {
    connectorName: trimmedName,
    sanitizedFilename: sanitizedSlug,
    originalFileName: file.name,
    originalFileType: file.type || 'image',
    originalDimensions: {
      width: origWidth,
      height: origHeight,
    },
    croppedDimensions: {
      width: cropW,
      height: cropH,
    },
    hasTransparencyInitially: hasMeaningfulTransparency,
    backgroundRemoved,
    croppedDataUrl,
    largeSvg: {
      width: 150,
      height: 150,
      safeArea: 112,
      outerInset: 19,
      placedWidth: largePlacedW,
      placedHeight: largePlacedH,
      placedX: largeX,
      placedY: largeY,
      svgString: largeSvgString,
      filename: largeFilename,
      blobUrl: largeBlobUrl,
    },
    smallSvg: {
      width: 56,
      height: 56,
      safeArea: 48,
      outerInset: 4,
      placedWidth: smallPlacedW,
      placedHeight: smallPlacedH,
      placedX: smallX,
      placedY: smallY,
      svgString: smallSvgString,
      filename: smallFilename,
      blobUrl: smallBlobUrl,
    },
    processingTimeMs,
  };
}
