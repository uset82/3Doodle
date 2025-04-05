import { motion } from 'framer-motion';

type ToolSelectorProps = {
  currentTool: string;
  setCurrentTool: (tool: string) => void;
};

const tools = [
  { id: 'brush', icon: 'ri-brush-line', label: 'Brush' },
  { id: 'eraser', icon: 'ri-eraser-line', label: 'Eraser' },
  { id: 'fill', icon: 'ri-paint-fill', label: 'Fill' }
];

const ToolSelector = ({ currentTool, setCurrentTool }: ToolSelectorProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm text-gray-600 mb-2">Tools</h3>
      <div className="flex justify-around">
        {tools.map((tool) => (
          <motion.button
            key={tool.id}
            className={`tool-btn flex flex-col items-center p-2 rounded-lg ${
              currentTool === tool.id 
                ? 'bg-primary-100' 
                : 'hover:bg-primary-50'
            } transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentTool(tool.id)}
          >
            <i className={`${tool.icon} text-xl ${
              currentTool === tool.id 
                ? 'text-primary-600' 
                : 'text-gray-600'
            }`}></i>
            <span className="text-xs mt-1">{tool.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ToolSelector;
