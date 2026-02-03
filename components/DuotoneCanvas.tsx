'use client';

import { useEffect, useRef, useState } from 'react';
import { prepareImage, renderColors, downloadCanvas } from '@/lib/canvas-renderer';

interface DuotoneCanvasProps {
  imageUrl: string;
  bgColor: string;
  duotoneColor: string;
  lineThickness: number;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export default function DuotoneCanvas({
  imageUrl,
  bgColor,
  duotoneColor,
  lineThickness,
  onCanvasReady,
}: DuotoneCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPreparing, setIsPreparing] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Prepare image data once when image URL changes
  useEffect(() => {
    setIsPreparing(true);
    setIsReady(false);

    prepareImage(imageUrl, '/logo.png')
      .then(() => {
        setIsPreparing(false);
        setIsReady(true);
      })
      .catch((err) => {
        console.error('Error preparing image:', err);
        setIsPreparing(false);
      });
  }, [imageUrl]);

  // Render when ready or when colors/thickness change
  useEffect(() => {
    if (!isReady || !canvasRef.current) return;
    renderColors(canvasRef.current, bgColor, duotoneColor, lineThickness);
    onCanvasReady?.(canvasRef.current);
  }, [isReady, bgColor, duotoneColor, lineThickness, onCanvasReady]);

  return (
    <div className="relative flex items-center justify-center bg-neutral-900 rounded-2xl overflow-hidden min-h-[400px]">
      {isPreparing && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/80 z-10">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-[70vh] object-contain"
      />
    </div>
  );
}

export { downloadCanvas };
