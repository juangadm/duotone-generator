'use client';

import { ChangeEvent } from 'react';
import PresetSelector from './PresetSelector';
import { COLOR_PRESETS } from '@/lib/color-presets';

interface ColorControlsProps {
  presetIndex: number;
  bgColor: string;
  duotoneColor: string;
  onPresetChange: (index: number) => void;
  onBgColorChange: (color: string) => void;
  onDuotoneColorChange: (color: string) => void;
  onDownload: () => void;
  onReset: () => void;
}

export default function ColorControls({
  presetIndex,
  bgColor,
  duotoneColor,
  onPresetChange,
  onBgColorChange,
  onDuotoneColorChange,
  onDownload,
  onReset,
}: ColorControlsProps) {
  const handleBgChange = (e: ChangeEvent<HTMLInputElement>) => {
    onBgColorChange(e.target.value);
  };

  const handleDuotoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    onDuotoneColorChange(e.target.value);
  };

  return (
    <div className="bg-white/5 rounded-2xl p-6 w-72 flex flex-col gap-6">
      {/* Preset Selector */}
      <div>
        <label className="block text-sm text-white/60 mb-2">Preset</label>
        <PresetSelector currentIndex={presetIndex} onChange={onPresetChange} />
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-sm text-white/60 mb-2">Background <span className="text-white/40">(darker)</span></label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={bgColor}
            onChange={handleBgChange}
          />
          <input
            type="text"
            value={bgColor.toUpperCase()}
            onChange={handleBgChange}
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm font-mono uppercase"
          />
        </div>
      </div>

      {/* Duotone Color */}
      <div>
        <label className="block text-sm text-white/60 mb-2">Duotone <span className="text-white/40">(lighter)</span></label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={duotoneColor}
            onChange={handleDuotoneChange}
          />
          <input
            type="text"
            value={duotoneColor.toUpperCase()}
            onChange={handleDuotoneChange}
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm font-mono uppercase"
          />
        </div>
      </div>

      <hr className="border-white/10" />

      {/* Download Button */}
      <button
        onClick={onDownload}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download PNG
      </button>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="text-sm text-white/50 hover:text-white/70 transition-colors"
      >
        Reset Colors
      </button>
    </div>
  );
}
