import { motion } from 'framer-motion';

type ColorPickerProps = {
  currentColor: string;
  setCurrentColor: (color: string) => void;
};

const COLORS = [
  '#000000', // Black
  '#FF5C9E', // Pink
  '#4F9DE9', // Blue
  '#7EE6A5', // Green
  '#FF8A00', // Orange
  '#9C6ADE', // Purple
  '#FF4D4D', // Red
  '#64748B'  // Gray
];

const ColorPicker = ({ currentColor, setCurrentColor }: ColorPickerProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm text-gray-600 mb-2">Colors</h3>
      <div className="grid grid-cols-4 gap-2">
        {COLORS.map((color) => (
          <motion.button
            key={color}
            className={`color-option w-8 h-8 rounded-full transition-transform`}
            style={{ backgroundColor: color }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={currentColor === color ? { scale: 1.2, boxShadow: '0 0 0 2px white, 0 0 0 4px ' + color } : { scale: 1 }}
            onClick={() => setCurrentColor(color)}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
