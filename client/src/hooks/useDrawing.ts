import { useRef, useState, useEffect, RefObject } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useDrawing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTool, setCurrentTool] = useState('brush');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawn, setIsDrawn] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const { toast } = useToast();
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Initial setup
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
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
      setIsDrawn(true);
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
  }, [canvasRef, isDrawing, currentTool, currentColor, brushSize, lastPosition]);
  
  const clearCanvas = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setIsDrawn(false);
  };
  
  const getCanvasImage = (): string => {
    if (!canvasRef.current) {
      toast({
        title: "Error",
        description: "Canvas not available",
        variant: "destructive"
      });
      return '';
    }
    
    return canvasRef.current.toDataURL('image/png');
  };
  
  return {
    canvasRef,
    currentTool,
    currentColor,
    brushSize,
    isDrawn,
    setCurrentTool,
    setCurrentColor,
    setBrushSize,
    clearCanvas,
    getCanvasImage
  };
};
