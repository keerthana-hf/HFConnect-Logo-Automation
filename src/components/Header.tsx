import React from 'react';
import { ExternalLink, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenFigmaSpec: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenFigmaSpec }) => {
  return (
    <header className="border-b border-[#262B38] bg-[#0E1117]/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* HappyFox Official Logo */}
          <div className="w-10 h-10 rounded-xl bg-[#141824] border border-[#252C3E] flex items-center justify-center p-1.5 shadow-md shadow-black/40">
            <img
              src="/hf-logo.png"
              alt="HappyFox Logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF5A1F] bg-[#FF5A1F]/10 px-2 py-0.5 rounded-full border border-[#FF5A1F]/20">
                HappyFox Internal Tool
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Connector Logo Generator
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-figma-spec"
            onClick={onOpenFigmaSpec}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#1A1F2C] hover:bg-[#23293B] border border-[#2B3347] px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>Figma Spec Rules</span>
          </button>
          
          <a
            id="link-figma-file"
            href="https://www.figma.com/design/7qQL2Mk5JjRQuxyNwS2KWC/Integration-Cards?node-id=1-81"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-[#141824] hover:bg-[#1E2333] border border-[#262C3E] px-3 py-2 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Figma Template</span>
          </a>
        </div>
      </div>
    </header>
  );
};
