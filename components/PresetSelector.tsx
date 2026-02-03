'use client';

import { COLOR_PRESETS } from '@/lib/color-presets';

interface PresetSelectorProps {
  currentIndex: number;
  onChange: (index: number) => void;
}

export default function PresetSelector({ currentIndex, onChange }: PresetSelectorProps) {
  const handlePrev = () => {
    const newIndex = currentIndex === 0 ? COLOR_PRESETS.length - 1 : currentIndex - 1;
    onChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % COLOR_PRESETS.length;
    onChange(newIndex);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handlePrev}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Previous preset"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <select
        value={currentIndex}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm appearance-none cursor-pointer hover:bg-white/15 transition-colors"
      >
        {COLOR_PRESETS.map((preset, index) => (
          <option key={preset.name} value={index} className="bg-neutral-900">
            {preset.name}
          </option>
        ))}
      </select>

      <button
        onClick={handleNext}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Next preset"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
