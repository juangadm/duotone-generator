'use client';

import { useState, useRef, useCallback } from 'react';
import ImageUploader from '@/components/ImageUploader';
import DuotoneCanvas from '@/components/DuotoneCanvas';
import ColorControls from '@/components/ColorControls';
import { COLOR_PRESETS } from '@/lib/color-presets';
import { downloadCanvas, clearCache } from '@/lib/canvas-renderer';

const DEFAULT_LINE_THICKNESS = 20;

export default function Home() {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [presetIndex, setPresetIndex] = useState(0);
  const [bgColor, setBgColor] = useState(COLOR_PRESETS[0].bg);
  const [duotoneColor, setDuotoneColor] = useState(COLOR_PRESETS[0].duotone);
  const [lineThickness, setLineThickness] = useState(DEFAULT_LINE_THICKNESS);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleImageProcessed = (imageUrl: string) => {
    setProcessedImage(imageUrl);
  };

  const handlePresetChange = (index: number) => {
    setPresetIndex(index);
    setBgColor(COLOR_PRESETS[index].bg);
    setDuotoneColor(COLOR_PRESETS[index].duotone);
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      downloadCanvas(canvasRef.current);
    }
  };

  const handleReset = () => {
    setBgColor(COLOR_PRESETS[presetIndex].bg);
    setDuotoneColor(COLOR_PRESETS[presetIndex].duotone);
    setLineThickness(DEFAULT_LINE_THICKNESS);
  };

  const handleUploadNew = () => {
    clearCache();
    setProcessedImage(null);
    setPresetIndex(0);
    setBgColor(COLOR_PRESETS[0].bg);
    setDuotoneColor(COLOR_PRESETS[0].duotone);
    setLineThickness(DEFAULT_LINE_THICKNESS);
  };

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  }, []);

  // Show upload view if no image processed
  if (!processedImage) {
    return <ImageUploader onImageProcessed={handleImageProcessed} />;
  }

  // Show editor view with processed image
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Canvas Area */}
          <div className="flex-1">
            <DuotoneCanvas
              imageUrl={processedImage}
              bgColor={bgColor}
              duotoneColor={duotoneColor}
              lineThickness={lineThickness}
              onCanvasReady={handleCanvasReady}
            />
            <button
              onClick={handleUploadNew}
              className="mt-4 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Upload New
            </button>
          </div>

          {/* Controls Panel */}
          <ColorControls
            presetIndex={presetIndex}
            bgColor={bgColor}
            duotoneColor={duotoneColor}
            lineThickness={lineThickness}
            onPresetChange={handlePresetChange}
            onBgColorChange={setBgColor}
            onDuotoneColorChange={setDuotoneColor}
            onLineThicknessChange={setLineThickness}
            onDownload={handleDownload}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
}
