import JSZip from 'jszip';
import { ProcessedLogoResult } from '../types';

/**
 * Creates and triggers download of a ZIP file containing both generated SVGs
 */
export async function downloadBothSvgsAsZip(result: ProcessedLogoResult): Promise<void> {
  const zip = new JSZip();

  // Add the 150x150 Large SVG
  zip.file(result.largeSvg.filename, result.largeSvg.svgString);

  // Add the 56x56 Small SVG
  zip.file(result.smallSvg.filename, result.smallSvg.svgString);

  // Generate zip file blob
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const zipUrl = URL.createObjectURL(zipBlob);

  const link = document.createElement('a');
  link.href = zipUrl;
  link.download = `${result.sanitizedFilename}-happyfox-logos.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(zipUrl), 1000);
}

/**
 * Triggers download of an individual SVG
 */
export function downloadSingleSvg(svgString: string, filename: string): void {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
