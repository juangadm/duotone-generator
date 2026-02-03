import { hexToRgb, loadImage } from './utils';

// Cached data that doesn't change between renders
interface CachedImageData {
  width: number;
  height: number;
  luminance: Float32Array;
  alpha: Uint8Array;
  mask: Uint8Array;  // Binary mask for outline computation
  logo: HTMLImageElement | null;
  logoWidth: number;
  logoHeight: number;
  logoPadding: number;
}

// Cache for computed outlines at different thicknesses
const outlineCache = new Map<number, HTMLCanvasElement>();

let cache: CachedImageData | null = null;
let cachedImageUrl: string | null = null;

export async function prepareImage(
  imageUrl: string,
  logoUrl?: string
): Promise<{ width: number; height: number }> {
  // Skip if already cached
  if (cachedImageUrl === imageUrl && cache) {
    return { width: cache.width, height: cache.height };
  }

  const img = await loadImage(imageUrl);
  const { width, height } = img;

  // Create temp canvas to read pixels
  const temp = document.createElement('canvas');
  temp.width = width;
  temp.height = height;
  const ctx = temp.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  // Pre-compute luminance, alpha, and binary mask
  const pixelCount = width * height;
  const luminance = new Float32Array(pixelCount);
  const alpha = new Uint8Array(pixelCount);
  const mask = new Uint8Array(pixelCount);

  for (let i = 0; i < pixelCount; i++) {
    const idx = i * 4;
    alpha[i] = pixels[idx + 3];
    mask[i] = alpha[i] > 128 ? 1 : 0;
    if (alpha[i] > 0) {
      luminance[i] = (0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2]) / 255;
    }
  }

  // Load logo
  let logo: HTMLImageElement | null = null;
  let logoWidth = 0, logoHeight = 0, logoPadding = 0;
  if (logoUrl) {
    try {
      logo = await loadImage(logoUrl);
      logoWidth = width * 0.18;
      logoHeight = (logo.height / logo.width) * logoWidth;
      logoPadding = width * 0.03;
    } catch (e) {
      console.warn('Could not load logo:', e);
    }
  }

  // Clear outline cache when image changes
  outlineCache.clear();

  cache = { width, height, luminance, alpha, mask, logo, logoWidth, logoHeight, logoPadding };
  cachedImageUrl = imageUrl;

  return { width, height };
}

export function renderColors(
  canvas: HTMLCanvasElement,
  bgColor: string,
  duotoneColor: string,
  lineThickness: number = 20
): void {
  if (!cache) return;

  const { width, height, luminance, alpha, mask, logo, logoWidth, logoHeight, logoPadding } = cache;
  const ctx = canvas.getContext('2d')!;

  // Resize canvas if needed
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const bgRgb = hexToRgb(bgColor);
  const duotoneRgb = hexToRgb(duotoneColor);

  // 1. Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // 2. Draw outline (get from cache or compute)
  if (lineThickness > 0) {
    let outlineCanvas = outlineCache.get(lineThickness);
    if (!outlineCanvas) {
      outlineCanvas = createOutlineCanvas(mask, width, height, lineThickness);
      outlineCache.set(lineThickness, outlineCanvas);
    }
    ctx.drawImage(outlineCanvas, 0, 0);
  }

  // 3. Create duotoned subject
  const subjectData = ctx.createImageData(width, height);
  const out = subjectData.data;

  for (let i = 0; i < luminance.length; i++) {
    const a = alpha[i];
    if (a === 0) continue;

    const t = luminance[i];
    const idx = i * 4;
    out[idx] = bgRgb.r + (duotoneRgb.r - bgRgb.r) * t;
    out[idx + 1] = bgRgb.g + (duotoneRgb.g - bgRgb.g) * t;
    out[idx + 2] = bgRgb.b + (duotoneRgb.b - bgRgb.b) * t;
    out[idx + 3] = a;
  }

  // Composite subject over background+outline
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.putImageData(subjectData, 0, 0);
  ctx.drawImage(tempCanvas, 0, 0);

  // 4. Draw logo
  if (logo) {
    ctx.drawImage(logo, width - logoWidth - logoPadding, logoPadding, logoWidth, logoHeight);
  }
}

function createOutlineCanvas(
  mask: Uint8Array,
  width: number,
  height: number,
  thickness: number
): HTMLCanvasElement {
  const dilated = dilateFast(mask, width, height, thickness);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < dilated.length; i++) {
    if (dilated[i] && !mask[i]) {
      const idx = i * 4;
      data[idx] = data[idx + 1] = data[idx + 2] = data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

function dilateFast(
  mask: Uint8Array,
  width: number,
  height: number,
  radius: number
): Uint8Array {
  const size = width * height;
  const temp = new Uint8Array(size);
  const result = new Uint8Array(size);

  // Horizontal pass
  for (let y = 0; y < height; y++) {
    const row = y * width;
    let count = 0;

    for (let x = 0; x < radius && x < width; x++) {
      if (mask[row + x]) count++;
    }

    for (let x = 0; x < width; x++) {
      const right = x + radius;
      if (right < width && mask[row + right]) count++;

      const left = x - radius - 1;
      if (left >= 0 && mask[row + left]) count--;

      temp[row + x] = count > 0 ? 1 : 0;
    }
  }

  // Vertical pass
  for (let x = 0; x < width; x++) {
    let count = 0;

    for (let y = 0; y < radius && y < height; y++) {
      if (temp[y * width + x]) count++;
    }

    for (let y = 0; y < height; y++) {
      const bottom = y + radius;
      if (bottom < height && temp[bottom * width + x]) count++;

      const top = y - radius - 1;
      if (top >= 0 && temp[top * width + x]) count--;

      result[y * width + x] = count > 0 ? 1 : 0;
    }
  }

  return result;
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string = 'duotone-portrait.png'): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function clearCache(): void {
  cache = null;
  cachedImageUrl = null;
  outlineCache.clear();
}
