import { useState, useEffect } from 'react';

type BrushSizeControlProps = {
  brushSize: number;
  setBrushSize: (size: number) => void;
};

const BrushSizeControl = ({ brushSize, setBrushSize }: BrushSizeControlProps) => {
  const [displaySize, setDisplaySize] = useState(`${brushSize}px`);
  
  useEffect(() => {
    setDisplaySize(`${brushSize}px`);
  }, [brushSize]);
  
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setBrushSize(newSize);
  };
  
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <h3 className="text-sm text-gray-600">Brush Size</h3>
        <span className="text-sm text-gray-600">{displaySize}</span>
      </div>
      <input 
        type="range" 
        min="1" 
        max="20" 
        value={brushSize} 
        className="w-full accent-primary-500" 
        onChange={handleSizeChange}
      />
      <div className="flex justify-between text-xs text-gray-600">
        <span>Small</span>
        <span>Large</span>
      </div>
    </div>
  );
};

export default BrushSizeControl;
