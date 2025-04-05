import { useRef, useEffect, RefObject } from 'react';
import { motion } from 'framer-motion';

type DrawingCanvasProps = {
  canvasRef: RefObject<HTMLCanvasElement>;
  currentTool: string;
  currentColor: string;
  brushSize: number;
  isDrawn: boolean;
};

const DrawingCanvas = ({ 
  canvasRef, 
  currentTool, 
  currentColor, 
  brushSize,
  isDrawn 
}: DrawingCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Set canvas dimensions on resize
  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [canvasRef]);

  return (
    <div 
      ref={containerRef}
      className="canvas-container relative bg-gray-50 rounded-xl border-2 border-gray-200 overflow-hidden touch-none"
      style={{ aspectRatio: '4/3' }}
    >
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
      />
      
      {/* Placeholder content when canvas is empty */}
      {!isDrawn && (
        <motion.div 
          initial={{ opacity: 0.7 }}
          animate={{ opacity: [0.7, 0.5, 0.7] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none"
        >
          <i className="ri-pencil-line text-5xl mb-2"></i>
          <p className="font-nunito text-lg">Draw something here!</p>
          <p className="text-sm">Try a simple apple, cat, or flower</p>
        </motion.div>
      )}
    </div>
  );
};

export default DrawingCanvas;
