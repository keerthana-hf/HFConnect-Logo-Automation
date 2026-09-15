export interface ProcessedLogoResult {
  connectorName: string;
  sanitizedFilename: string;
  originalFileName: string;
  originalFileType: string;
  originalDimensions: {
    width: number;
    height: number;
  };
  croppedDimensions: {
    width: number;
    height: number;
  };
  hasTransparencyInitially: boolean;
  backgroundRemoved: boolean;
  croppedDataUrl: string;
  largeSvg: {
    width: number;
    height: number;
    safeArea: number;
    outerInset: number;
    placedWidth: number;
    placedHeight: number;
    placedX: number;
    placedY: number;
    svgString: string;
    filename: string;
    blobUrl: string;
  };
  smallSvg: {
    width: number;
    height: number;
    safeArea: number;
    outerInset: number;
    placedWidth: number;
    placedHeight: number;
    placedX: number;
    placedY: number;
    svgString: string;
    filename: string;
    blobUrl: string;
  };
  processingTimeMs: number;
}

export interface SampleLogoItem {
  id: string;
  name: string;
  type: string;
  description: string;
  aspect: 'square' | 'wide' | 'tall' | 'padded' | 'colored-bg';
  dataUrl: string;
}

export type ProcessingStep = 
  | 'idle'
  | 'validating'
  | 'analyzing-alpha'
  | 'removing-background'
  | 'trimming-padding'
  | 'calculating-figma-bounds'
  | 'generating-svgs'
  | 'complete'
  | 'error';
