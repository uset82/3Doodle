import { motion } from 'framer-motion';

const ProcessingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 max-w-md text-center shadow-xl"
      >
        <motion.div 
          className="rounded-full h-16 w-16 border-t-4 border-primary-600 mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <h3 className="font-nunito font-bold text-xl text-primary-600 mb-2">Magic in Progress!</h3>
        <p className="text-gray-600">Transforming your doodle into 3D...</p>
      </motion.div>
    </motion.div>
  );
};

export default ProcessingIndicator;
