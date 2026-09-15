import React from 'react';
import { X, ExternalLink, CheckCircle2, ShieldCheck, Box } from 'lucide-react';

interface FigmaSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FigmaSpecModal: React.FC<FigmaSpecModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#131620] border border-[#2B3245] rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#252B3C] bg-[#181C2A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F]">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">HappyFox Figma Normalization Specification</h2>
              <p className="text-xs text-slate-400">Integration Cards template geometry & placement rules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#252B3C] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Rule Breakdown Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            
            {/* Large Card Spec */}
            <div className="bg-[#181C2B] p-4 rounded-xl border border-[#2B344B]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A1F] bg-[#FF5A1F]/10 px-2 py-0.5 rounded">
                  Large Logo Spec
                </span>
                <span className="text-xs font-mono text-slate-400">150 × 150 SVG</span>
              </div>
              <div className="bg-[#0D1017] p-3 rounded-lg border border-[#22283A] space-y-1.5 text-xs font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Outer Canvas:</span>
                  <span className="text-white font-semibold">150 × 150 px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Outer Inset:</span>
                  <span className="text-white font-semibold">19 px (all sides)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Inner Safe Area:</span>
                  <span className="text-[#FF7A45] font-semibold">112 × 112 px</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#22283A]">
                  <span className="text-slate-400">Offset Math:</span>
                  <span className="text-slate-300">(150 - 112) / 2 = 19px</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Artwork is proportionally scaled to fit 112×112 and centered at (19 + (112 - width)/2, 19 + (112 - height)/2).
              </p>
            </div>

            {/* Small Card Spec */}
            <div className="bg-[#181C2B] p-4 rounded-xl border border-[#2B344B]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                  Small Logo Spec
                </span>
                <span className="text-xs font-mono text-slate-400">56 × 56 SVG</span>
              </div>
              <div className="bg-[#0D1017] p-3 rounded-lg border border-[#22283A] space-y-1.5 text-xs font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Outer Canvas:</span>
                  <span className="text-white font-semibold">56 × 56 px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Outer Inset:</span>
                  <span className="text-white font-semibold">4 px (all sides)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Inner Safe Area:</span>
                  <span className="text-emerald-400 font-semibold">48 × 48 px</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#22283A]">
                  <span className="text-slate-400">Offset Math:</span>
                  <span className="text-slate-300">(56 - 48) / 2 = 4px</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Artwork is proportionally scaled to fit 48×48 and centered at (4 + (48 - width)/2, 4 + (48 - height)/2).
              </p>
            </div>
          </div>

          {/* Workflow details */}
          <div className="bg-[#181C2B]/60 p-4 rounded-xl border border-[#252C3E] space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Deterministic Normalization Rules</h3>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0 mt-0.5" />
                <span><strong className="text-slate-200">Alpha Padding Trimming:</strong> Raw images with large empty borders are automatically cropped to the true pixel bounding box.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0 mt-0.5" />
                <span><strong className="text-slate-200">Aspect Preservation:</strong> Wide logos (like Zapier 112×30, Wrike 112×70) or square logos (like Salesforce 112×112) retain exact proportions with vertical or horizontal centering.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0 mt-0.5" />
                <span><strong className="text-slate-200">Zero Third-Party Dependency:</strong> Processes entirely in-memory and outputs clean, production-ready SVGs.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#252B3C] bg-[#141824]">
          <a
            href="https://www.figma.com/design/7qQL2Mk5JjRQuxyNwS2KWC/Integration-Cards?node-id=1-81"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Figma Integration Cards (Node 1-81)</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-[#FF5A1F] hover:bg-[#E0460E] rounded-lg transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};
