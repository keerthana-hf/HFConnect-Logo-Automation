import React, { useState } from 'react';
import { 
  Download, 
  RotateCcw, 
  Check, 
  Copy, 
  Layers, 
  Maximize2, 
  ShieldCheck, 
  Archive, 
  Eye, 
  Sparkles,
  Info,
  ExternalLink
} from 'lucide-react';
import { ProcessedLogoResult } from '../types';
import { downloadBothSvgsAsZip, downloadSingleSvg } from '../utils/zipExport';

interface ResultSectionProps {
  result: ProcessedLogoResult;
  onReset: () => void;
}

export const ResultSection: React.FC<ResultSectionProps> = ({ result, onReset }) => {
  const [showGuidelines, setShowGuidelines] = useState<boolean>(true);
  const [previewBg, setPreviewBg] = useState<'checker' | 'dark' | 'light'>('checker');
  const [copiedLarge, setCopiedLarge] = useState<boolean>(false);
  const [copiedSmall, setCopiedSmall] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const handleCopySvg = (svgString: string, type: 'large' | 'small') => {
    navigator.clipboard.writeText(svgString);
    if (type === 'large') {
      setCopiedLarge(true);
      setTimeout(() => setCopiedLarge(false), 2000);
    } else {
      setCopiedSmall(true);
      setTimeout(() => setCopiedSmall(false), 2000);
    }
  };

  const handleDownloadBoth = async () => {
    try {
      setIsZipping(true);
      await downloadBothSvgsAsZip(result);
    } catch (e) {
      console.error(e);
      // Fallback: download both sequentially
      downloadSingleSvg(result.largeSvg.svgString, result.largeSvg.filename);
      setTimeout(() => {
        downloadSingleSvg(result.smallSvg.svgString, result.smallSvg.filename);
      }, 300);
    } finally {
      setIsZipping(false);
    }
  };

  const getCheckerboardStyle = () => {
    if (previewBg === 'dark') return { backgroundColor: '#131722' };
    if (previewBg === 'light') return { backgroundColor: '#F4F5F7' };
    return {
      backgroundImage: `linear-gradient(45deg, #181C28 25%, transparent 25%), linear-gradient(-45deg, #181C28 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #181C28 75%), linear-gradient(-45deg, transparent 75%, #181C28 75%)`,
      backgroundSize: '12px 12px',
      backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
      backgroundColor: '#0D1017'
    };
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header bar with connector title and metadata */}
      <div className="bg-[#121622] border border-[#23293C] rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Normalized & Ready
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {result.processingTimeMs}ms
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {result.connectorName}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cropped bounds: <span className="text-slate-300 font-mono">{result.croppedDimensions.width} × {result.croppedDimensions.height} px</span>
            {result.backgroundRemoved && ' • Solid background auto-removed'}
            {result.hasTransparencyInitially && ' • Transparency preserved'}
          </p>
        </div>

        {/* Global Action: Download Both & Reset */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            id="btn-download-both"
            onClick={handleDownloadBoth}
            disabled={isZipping}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#FF5A1F] to-[#E0460E] hover:from-[#FF6A33] hover:to-[#EF4E15] text-white shadow-lg shadow-[#FF5A1F]/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Archive className="w-4 h-4" />
            <span>{isZipping ? 'Packaging ZIP...' : 'Download Both'}</span>
          </button>

          <button
            id="btn-generate-another"
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#1A1F2E] hover:bg-[#232A3E] border border-[#2B344D] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Generate Another</span>
          </button>
        </div>
      </div>

      {/* Preview Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Preview Background:</span>
          <div className="bg-[#141824] p-1 rounded-lg border border-[#252B3C] flex items-center gap-1">
            <button
              onClick={() => setPreviewBg('checker')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                previewBg === 'checker' ? 'bg-[#FF5A1F] text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Checkerboard
            </button>
            <button
              onClick={() => setPreviewBg('dark')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                previewBg === 'dark' ? 'bg-[#FF5A1F] text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dark Card
            </button>
            <button
              onClick={() => setPreviewBg('light')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                previewBg === 'light' ? 'bg-[#FF5A1F] text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Light Card
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowGuidelines(!showGuidelines)}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
            showGuidelines
              ? 'bg-[#FF5A1F]/10 border-[#FF5A1F]/30 text-[#FF7A45]'
              : 'bg-[#151926] border-[#252C3E] text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{showGuidelines ? 'Hide Safe-Area Outlines' : 'Show Figma Safe-Area Outlines'}</span>
        </button>
      </div>

      {/* Generated Logos Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* 1. Large Logo Card (150x150) */}
        <div className="bg-[#121622] border border-[#23293C] rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A1F] bg-[#FF5A1F]/10 px-2 py-0.5 rounded border border-[#FF5A1F]/20">
                  Large SVG
                </span>
                <span className="text-xs font-semibold text-white">150 × 150 px</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">112×112 Safe Area</span>
            </div>

            {/* Preview Box Container */}
            <div className="flex flex-col items-center justify-center p-8 bg-[#0B0E14] border border-[#1F2536] rounded-xl relative overflow-hidden">
              
              {/* 150x150 Viewport Stage */}
              <div 
                className="relative rounded-lg border border-[#2F374E] shadow-2xl flex items-center justify-center transition-all"
                style={{
                  width: '150px',
                  height: '150px',
                  ...getCheckerboardStyle()
                }}
              >
                {/* Visual Figma Safe Area Guide (112x112 positioned at 19,19) */}
                {showGuidelines && (
                  <div 
                    className="absolute border border-dashed border-[#FF5A1F]/50 pointer-events-none rounded-sm"
                    style={{
                      left: '19px',
                      top: '19px',
                      width: '112px',
                      height: '112px',
                    }}
                  >
                    <span className="absolute -top-4 left-0 text-[9px] text-[#FF7A45] font-mono leading-none">
                      112×112 (19px inset)
                    </span>
                  </div>
                )}

                {/* SVG Render */}
                <img
                  src={result.largeSvg.blobUrl}
                  alt={`${result.connectorName} Large 150x150`}
                  className="w-[150px] h-[150px] object-contain relative z-10"
                />
              </div>

              {/* Geometry specs tooltip */}
              <div className="mt-4 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-center gap-2">
                <span className="bg-[#161B2B] px-2 py-0.5 rounded border border-[#242C3E]">
                  Artwork: {result.largeSvg.placedWidth} × {result.largeSvg.placedHeight} px
                </span>
                <span className="bg-[#161B2B] px-2 py-0.5 rounded border border-[#242C3E]">
                  x: {result.largeSvg.placedX}, y: {result.largeSvg.placedY}
                </span>
              </div>
            </div>
          </div>

          {/* Actions for Large SVG */}
          <div className="space-y-2 pt-2 border-t border-[#1F2536]">
            <div className="text-xs font-mono text-slate-400 truncate mb-1">
              File: <span className="text-slate-300">{result.largeSvg.filename}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-download-large"
                onClick={() => downloadSingleSvg(result.largeSvg.svgString, result.largeSvg.filename)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-[#1C2233] hover:bg-[#252C40] border border-[#2B354C] text-white transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>Download SVG</span>
              </button>

              <button
                onClick={() => handleCopySvg(result.largeSvg.svgString, 'large')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium bg-[#141824] hover:bg-[#1C2233] border border-[#252C3E] text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {copiedLarge ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy XML</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 2. Small Logo Card (56x56) */}
        <div className="bg-[#121622] border border-[#23293C] rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                  Small SVG
                </span>
                <span className="text-xs font-semibold text-white">56 × 56 px</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">48×48 Safe Area</span>
            </div>

            {/* Preview Box Container */}
            <div className="flex flex-col items-center justify-center p-8 bg-[#0B0E14] border border-[#1F2536] rounded-xl relative overflow-hidden min-h-[240px]">
              
              {/* Scaled/Zoomed presentation for 56x56 with 1x & 2x reference */}
              <div className="flex items-center gap-8">
                
                {/* 1x Real Size Preview (56x56) */}
                <div className="text-center space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-mono">1× Actual</span>
                  <div 
                    className="relative rounded border border-[#2F374E] shadow-md flex items-center justify-center"
                    style={{
                      width: '56px',
                      height: '56px',
                      ...getCheckerboardStyle()
                    }}
                  >
                    <img
                      src={result.smallSvg.blobUrl}
                      alt={`${result.connectorName} Small 56x56`}
                      className="w-[56px] h-[56px] object-contain"
                    />
                  </div>
                </div>

                {/* 2.5x Zoomed Inspection Box */}
                <div className="text-center space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-mono">Zoomed View</span>
                  <div 
                    className="relative rounded-lg border border-[#2F374E] shadow-2xl flex items-center justify-center transition-all"
                    style={{
                      width: '140px',
                      height: '140px',
                      ...getCheckerboardStyle()
                    }}
                  >
                    {/* Visual Figma Safe Area Guide (48x48 scaled by 140/56 = 2.5) */}
                    {showGuidelines && (
                      <div 
                        className="absolute border border-dashed border-emerald-400/60 pointer-events-none rounded-sm"
                        style={{
                          left: '10px',
                          top: '10px',
                          width: '120px',
                          height: '120px',
                        }}
                      >
                        <span className="absolute -top-4 left-0 text-[9px] text-emerald-400 font-mono leading-none">
                          48×48 (4px inset)
                        </span>
                      </div>
                    )}

                    <img
                      src={result.smallSvg.blobUrl}
                      alt={`${result.connectorName} Small 56x56 Zoomed`}
                      className="w-[140px] h-[140px] object-contain relative z-10"
                    />
                  </div>
                </div>

              </div>

              {/* Geometry specs tooltip */}
              <div className="mt-4 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-center gap-2">
                <span className="bg-[#161B2B] px-2 py-0.5 rounded border border-[#242C3E]">
                  Artwork: {result.smallSvg.placedWidth} × {result.smallSvg.placedHeight} px
                </span>
                <span className="bg-[#161B2B] px-2 py-0.5 rounded border border-[#242C3E]">
                  x: {result.smallSvg.placedX}, y: {result.smallSvg.placedY}
                </span>
              </div>
            </div>
          </div>

          {/* Actions for Small SVG */}
          <div className="space-y-2 pt-2 border-t border-[#1F2536]">
            <div className="text-xs font-mono text-slate-400 truncate mb-1">
              File: <span className="text-slate-300">{result.smallSvg.filename}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-download-small"
                onClick={() => downloadSingleSvg(result.smallSvg.svgString, result.smallSvg.filename)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-[#1C2233] hover:bg-[#252C40] border border-[#2B354C] text-white transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Download SVG</span>
              </button>

              <button
                onClick={() => handleCopySvg(result.smallSvg.svgString, 'small')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium bg-[#141824] hover:bg-[#1C2233] border border-[#252C3E] text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {copiedSmall ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy XML</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Live Integration Card Simulation Preview */}
      <div className="bg-[#121622] border border-[#23293C] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF5A1F]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Simulated HappyFox Integration Card
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Real-world UI appearance verification
          </span>
        </div>

        {/* Integration Card Mockup */}
        <div className="grid sm:grid-cols-2 gap-4">
          
          {/* Card Mockup 1: Large Card Variant */}
          <div className="bg-[#181C2B] border border-[#2B3347] rounded-2xl p-5 hover:border-[#FF5A1F]/40 transition-colors flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-16 h-16 rounded-xl bg-[#0F121C] border border-[#252C3E] p-2 flex items-center justify-center overflow-hidden shadow-inner">
                <img
                  src={result.largeSvg.blobUrl}
                  alt={result.connectorName}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Connected
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white">{result.connectorName}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Sync tickets, contacts, and customer interactions directly with HappyFox help desk workflows.
              </p>
            </div>

            <div className="pt-3 border-t border-[#252C3E] flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Large Card (150×150)</span>
              <button className="text-xs font-semibold text-[#FF5A1F] hover:text-[#FF7A45] transition-colors">
                Configure →
              </button>
            </div>
          </div>

          {/* Card Mockup 2: Compact List Variant */}
          <div className="bg-[#181C2B] border border-[#2B3347] rounded-2xl p-5 hover:border-[#FF5A1F]/40 transition-colors flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-[#0F121C] border border-[#252C3E] p-1.5 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                <img
                  src={result.smallSvg.blobUrl}
                  alt={result.connectorName}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{result.connectorName}</h4>
                <p className="text-xs text-slate-400">HappyFox Connector</p>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Compact navigation & sidebar icon view using the 56×56 normalized SVG specification.
            </p>

            <div className="pt-3 border-t border-[#252C3E] flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Small List View (56×56)</span>
              <span className="text-xs text-slate-300 font-mono">Status: Active</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
