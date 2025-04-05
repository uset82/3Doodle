import { useRef, useEffect, RefObject, useState } from 'react';
import { motion } from 'framer-motion';

type DrawingCanvasProps = {
  canvasRef: RefObject<HTMLCanvasElement>;
  currentTool: string;
  currentColor: string;
  brushSize: number;
  isDrawn: boolean;
  setIsDrawn?: (isDrawn: boolean) => void;
};

const DrawingCanvas = ({ 
  canvasRef, 
  currentTool, 
  currentColor, 
  brushSize,
  isDrawn,
  setIsDrawn
}: DrawingCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  
  // Set canvas dimensions on resize
  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current && containerRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Save current canvas content
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        if (tempCtx) {
          tempCtx.drawImage(canvas, 0, 0);
        }
        
        // Resize canvas
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
        
        // Restore content with new dimensions
        if (ctx && tempCtx) {
          ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
        }
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [canvasRef]);
  
  // Drawing functionality
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Initialize canvas if empty
    if (!isDrawn) {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Event handlers
    const startDrawing = (e: MouseEvent | TouchEvent) => {
      const { x, y } = getCoordinates(e);
      setIsDrawing(true);
      setLastPosition({ x, y });
    };
    
    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      
      const { x, y } = getCoordinates(e);
      
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = brushSize;
      
      if (currentTool === 'brush') {
        ctx.strokeStyle = currentColor;
      } else if (currentTool === 'eraser') {
        ctx.strokeStyle = '#f8fafc';
      } else if (currentTool === 'fill') {
        // Fill logic would go here, but just using brush for now
        ctx.strokeStyle = currentColor;
      }
      
      ctx.beginPath();
      ctx.moveTo(lastPosition.x, lastPosition.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      setLastPosition({ x, y });
      if (setIsDrawn) setIsDrawn(true);
    };
    
    const stopDrawing = () => {
      setIsDrawing(false);
    };
    
    // Convert mouse/touch events to coordinates
    const getCoordinates = (e: MouseEvent | TouchEvent): { x: number, y: number } => {
      const rect = canvas.getBoundingClientRect();
      
      if ('touches' in e) {
        // Touch event
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      } else {
        // Mouse event
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      }
    };
    
    // Add event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    
    // Touch support
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startDrawing(e);
    });
    
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      draw(e);
    });
    
    canvas.addEventListener('touchend', stopDrawing);
    
    // Cleanup
    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing as any);
      canvas.removeEventListener('touchmove', draw as any);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [canvasRef, isDrawing, currentTool, currentColor, brushSize, lastPosition, isDrawn, setIsDrawn]);

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
