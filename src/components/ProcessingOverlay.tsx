import React from 'react';
import { Loader2, Sparkles, Check } from 'lucide-react';

interface ProcessingOverlayProps {
  currentStepMessage: string;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ currentStepMessage }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#121622] border border-[#2B344D] p-8 rounded-2xl max-w-md w-full shadow-2xl text-center space-y-6">
        
        {/* Animated Icon */}
        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#FF5A1F]/20 animate-ping opacity-75"></div>
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF5A1F] to-[#E0460E] flex items-center justify-center shadow-lg shadow-[#FF5A1F]/30 border border-[#FF7A45]/30">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        </div>

        {/* Status text */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white tracking-tight">
            Normalizing Integration Logo
          </h3>
          <p className="text-xs sm:text-sm text-[#FF7A45] font-medium animate-pulse">
            {currentStepMessage || 'Processing logo artwork...'}
          </p>
        </div>

        {/* Visual Progress Steps Checklist */}
        <div className="bg-[#181D2D] p-4 rounded-xl border border-[#242C3E] space-y-2.5 text-left text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Detecting transparency & alpha bounds</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Trimming empty transparent padding</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Check className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0" />
            <span>Calculating 150×150 & 56×56 Figma safe areas</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          Deterministic zero-distortion scaling according to HappyFox spec
        </p>

      </div>
    </div>
  );
};
