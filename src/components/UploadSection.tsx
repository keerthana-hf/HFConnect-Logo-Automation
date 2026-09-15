import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Sparkles, FileCheck, AlertCircle, X, ArrowRight } from 'lucide-react';
import { sanitizeConnectorName, validateUploadFile } from '../utils/imageProcessor';
import { SAMPLE_LOGOS, dataUrlToFile } from '../utils/sampleLogos';
import { SampleLogoItem } from '../types';

interface UploadSectionProps {
  onGenerate: (file: File, connectorName: string) => void;
  isLoading: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onGenerate, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [connectorName, setConnectorName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    setErrorMessage(null);
    const validation = validateUploadFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid file.');
      return;
    }

    setSelectedFile(file);

    // Auto populate connector name if empty from file name
    if (!connectorName.trim()) {
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
      // Capitalize words
      const capitalized = baseName
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      setConnectorName(capitalized);
    }

    // Generate local preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleSelectSample = async (sample: SampleLogoItem) => {
    try {
      setErrorMessage(null);
      const file = await dataUrlToFile(sample.dataUrl, `${sample.id}.svg`);
      setSelectedFile(file);
      setConnectorName(sample.name);
      setPreviewUrl(sample.dataUrl);
    } catch {
      setErrorMessage('Failed to load sample logo.');
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedFile) {
      setErrorMessage('Please upload or select an integration logo.');
      return;
    }

    if (!connectorName.trim()) {
      setErrorMessage('Please enter the connector name (e.g. Salesforce).');
      return;
    }

    onGenerate(selectedFile, connectorName);
  };

  const sanitizedSlug = connectorName.trim() ? sanitizeConnectorName(connectorName) : 'connector';

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* Title & Introduction */}
      <div className="text-center space-y-2 pt-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          HappyFox Connector Logo Generator
        </h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Generate production-ready connector logos for HappyFox integration cards with automatic background removal and deterministic Figma normalization.
        </p>
      </div>

      {/* Main Upload Card */}
      <div className="bg-[#121622] border border-[#23293B] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs sm:text-sm animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Upload Area */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              1. Upload Connector Logo
            </label>

            {!selectedFile ? (
              <div
                id="dropzone"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragOver
                    ? 'border-[#FF5A1F] bg-[#FF5A1F]/5 scale-[1.01]'
                    : 'border-[#2D354B] hover:border-[#FF5A1F]/60 bg-[#161B2B]/60 hover:bg-[#181E30]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml"
                  onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-xl bg-[#1F2538] border border-[#2D364E] mx-auto flex items-center justify-center text-slate-300 mb-3 group-hover:text-[#FF5A1F] transition-colors">
                  <Upload className="w-6 h-6 text-[#FF5A1F]" />
                </div>

                <p className="text-sm font-semibold text-slate-200">
                  Upload connector logo
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Drag & drop or <span className="text-[#FF5A1F] font-medium underline underline-offset-2">Browse file</span>
                </p>

                <div className="flex items-center justify-center gap-2 mt-4 text-[11px] font-mono text-slate-400">
                  <span className="bg-[#1E2436] px-2 py-0.5 rounded border border-[#2B344D]">PNG</span>
                  <span className="bg-[#1E2436] px-2 py-0.5 rounded border border-[#2B344D]">JPG</span>
                  <span className="bg-[#1E2436] px-2 py-0.5 rounded border border-[#2B344D]">JPEG</span>
                  <span className="bg-[#1E2436] px-2 py-0.5 rounded border border-[#2B344D]">SVG</span>
                  <span className="text-slate-400">• Max 15MB</span>
                </div>
              </div>
            ) : (
              /* Selected File Preview Box */
              <div className="relative border border-[#2E374E] bg-[#161B2A] rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-lg bg-[#0E111A] border border-[#262D40] flex items-center justify-center p-2 shrink-0 overflow-hidden"
                       style={{
                         backgroundImage: `linear-gradient(45deg, #181C26 25%, transparent 25%), linear-gradient(-45deg, #181C26 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #181C26 75%), linear-gradient(-45deg, transparent 75%, #181C26 75%)`,
                         backgroundSize: '12px 12px',
                         backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px'
                       }}>
                    {previewUrl ? (
                      <img src={previewUrl} alt="Selected" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{selectedFile.name}</p>
                    <p className="text-xs text-slate-400">
                      {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'SVG/Image'}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
                      <FileCheck className="w-3 h-3" /> Ready for normalization
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClearFile}
                  className="p-2 text-slate-400 hover:text-white hover:bg-[#252C3E] rounded-lg transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Connector Name Input */}
          <div>
            <label htmlFor="input-connector-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              2. Connector Name
            </label>
            <div className="relative">
              <input
                id="input-connector-name"
                type="text"
                value={connectorName}
                onChange={e => setConnectorName(e.target.value)}
                placeholder="e.g. Salesforce, Zapier, Jira, Make..."
                className="w-full bg-[#161B2A] border border-[#2D364D] focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] text-white text-sm rounded-xl px-4 py-3 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Versioning / File Name Warning Notice */}
            <div className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
              <strong className="text-amber-400 font-semibold block mb-0.5">⚠️ Update Notice:</strong>
              If this is an update to an existing connector logo, do not use the same file name as the existing file. Use standard versioning to prevent caching and conflict issues (e.g., if <code className="text-[#FF5A1F] bg-[#FF5A1F]/5 px-1.5 py-0.5 rounded font-mono text-[11px]">iru-logo.svg</code> exists, use <code className="text-[#FF5A1F] bg-[#FF5A1F]/5 px-1.5 py-0.5 rounded font-mono text-[11px]">iru-logo-v1.svg</code>).
            </div>

            {/* Generated Filenames Preview */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span>Outputs:</span>
              <span className="bg-[#181C2B] text-slate-300 px-2 py-0.5 rounded border border-[#262D42]">
                {sanitizedSlug}-150x150.svg
              </span>
              <span className="bg-[#181C2B] text-slate-300 px-2 py-0.5 rounded border border-[#262D42]">
                {sanitizedSlug}-56x56.svg
              </span>
            </div>
          </div>

          {/* Preset Test Logos */}
          <div className="pt-2 border-t border-[#222838]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Or test with representative logos:
              </span>
              <span className="text-[11px] text-slate-400">Figma Specs Reference</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_LOGOS.map(sample => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedFile?.name === `${sample.id}.svg`
                      ? 'border-[#FF5A1F] bg-[#FF5A1F]/10 text-white'
                      : 'border-[#242B3E] bg-[#151927]/60 hover:bg-[#1C2133] text-slate-300 hover:border-[#333C54]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-semibold">{sample.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{sample.aspect}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 line-clamp-1">{sample.type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            id="btn-generate"
            type="submit"
            disabled={isLoading || !selectedFile || !connectorName.trim()}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
              isLoading || !selectedFile || !connectorName.trim()
                ? 'bg-[#2A3144] text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-[#FF5A1F] to-[#E5450B] hover:from-[#FF6A33] hover:to-[#EF4E15] text-white shadow-[#FF5A1F]/25 hover:shadow-[#FF5A1F]/40 active:scale-[0.99]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Logos</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>
      </div>

    </div>
  );
};
