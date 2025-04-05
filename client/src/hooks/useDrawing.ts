import { useRef, useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useDrawing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTool, setCurrentTool] = useState('brush');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawn, setIsDrawn] = useState(false);
  const { toast } = useToast();
  
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
    setIsDrawn, // Adding this so DrawingCanvas can update the drawn state
    clearCanvas,
    getCanvasImage
  };
};
