import { motion } from 'framer-motion';

type HelpModalProps = {
  onClose: () => void;
};

const HelpModal = ({ onClose }: HelpModalProps) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-nunito font-bold text-xl text-primary-600">How to Use 3Doodle</h3>
          <button 
            className="text-gray-600 hover:text-primary-600 transition-colors"
            onClick={onClose}
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-primary-100 rounded-full p-2 mr-3 text-primary-600">
              <i className="ri-pencil-line"></i>
            </div>
            <div>
              <h4 className="font-medium mb-1">Draw a Simple Object</h4>
              <p className="text-sm text-gray-600">Use the drawing tools to sketch a simple object like an apple, dog, or flower.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-pink-100 rounded-full p-2 mr-3 text-pink-500">
              <i className="ri-magic-line"></i>
            </div>
            <div>
              <h4 className="font-medium mb-1">Generate a 3D Model</h4>
              <p className="text-sm text-gray-600">Click the "Generate 3D!" button to transform your drawing into a 3D model.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-green-100 rounded-full p-2 mr-3 text-green-500">
              <i className="ri-volume-up-line"></i>
            </div>
            <div>
              <h4 className="font-medium mb-1">Hear Your Creation</h4>
              <p className="text-sm text-gray-600">Click on any 3D model in your gallery to hear its sound!</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HelpModal;
