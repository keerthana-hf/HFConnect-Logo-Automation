import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { ResultSection } from './components/ResultSection';
import { ProcessingOverlay } from './components/ProcessingOverlay';
import { FigmaSpecModal } from './components/FigmaSpecModal';
import { ProcessedLogoResult } from './types';
import { processConnectorLogo } from './utils/imageProcessor';

export default function App() {
  const [result, setResult] = useState<ProcessedLogoResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stepMessage, setStepMessage] = useState<string>('');
  const [isFigmaSpecOpen, setIsFigmaSpecOpen] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleGenerate = async (file: File, connectorName: string) => {
    try {
      setGlobalError(null);
      setIsLoading(true);
      setStepMessage('Initializing image processing...');

      const processed = await processConnectorLogo(file, connectorName, (step) => {
        setStepMessage(step);
      });

      setResult(processed);
    } catch (err: unknown) {
      console.error('Logo generation error:', err);
      const message = err instanceof Error ? err.message : 'Something went wrong while processing the logo. Please try again.';
      setGlobalError(message);
    } finally {
      setIsLoading(false);
      setStepMessage('');
    }
  };

  const handleReset = () => {
    if (result) {
      if (result.largeSvg.blobUrl) URL.revokeObjectURL(result.largeSvg.blobUrl);
      if (result.smallSvg.blobUrl) URL.revokeObjectURL(result.smallSvg.blobUrl);
    }
    setResult(null);
    setGlobalError(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0C13] text-slate-100 flex flex-col selection:bg-[#FF5A1F] selection:text-white font-sans antialiased">
      
      {/* Header */}
      <Header onOpenFigmaSpec={() => setIsFigmaSpecOpen(true)} />

      {/* Main Content Stage */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        
        {/* Global Error Banner */}
        {globalError && (
          <div className="max-w-2xl mx-auto w-full mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between gap-3">
            <span>{globalError}</span>
            <button
              onClick={() => setGlobalError(null)}
              className="text-xs font-semibold text-rose-300 hover:text-white underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Switching: Upload Screen vs. Generated Results */}
        {!result ? (
          <UploadSection onGenerate={handleGenerate} isLoading={isLoading} />
        ) : (
          <ResultSection result={result} onReset={handleReset} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#1C2130] bg-[#090B10] py-6 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>HappyFox Connector Logo Generator</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>HappyFox Integration Card Specification V1</span>
            <span>•</span>
            <button
              onClick={() => setIsFigmaSpecOpen(true)}
              className="hover:text-slate-300 text-slate-400 underline cursor-pointer"
            >
              Figma 150×150 & 56×56 rules
            </button>
          </div>
        </div>
      </footer>

      {/* Animated Loading Overlay */}
      {isLoading && <ProcessingOverlay currentStepMessage={stepMessage} />}

      {/* Figma Spec Reference Modal */}
      <FigmaSpecModal
        isOpen={isFigmaSpecOpen}
        onClose={() => setIsFigmaSpecOpen(false)}
      />

    </div>
  );
}
