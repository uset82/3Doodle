import { useLocation } from "wouter";
import { motion } from "framer-motion";

const LandingPage = () => {
  const [_, navigate] = useLocation();

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80')] bg-cover opacity-10 filter blur-5 -z-10"></div>
      <div className="absolute top-0 right-0 h-96 w-96 bg-primary-light rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 h-96 w-96 bg-pink-200 rounded-full filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-screen py-12">
          <div className="text-center mb-8">
            <motion.h1 
              className="font-nunito font-extrabold text-4xl md:text-5xl lg:text-6xl text-primary-600 mb-2 drop-shadow-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Welcome to 3Doodle
            </motion.h1>
            <motion.h2 
              className="font-nunito font-bold text-3xl md:text-4xl text-pink-500 mb-6 drop-shadow-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Where Your Doodles Come to Life!
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Draw, Create, Transform - Your Imagination in 3D!
            </motion.p>
          </div>
          
          <motion.div 
            className="max-w-4xl mx-auto mb-8 bg-white bg-opacity-80 rounded-xl p-4 shadow-xl overflow-hidden relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1679643256705-6cc33fd4cb67?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Children creating digital art" 
              className="w-full h-auto rounded-lg" 
            />
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="bg-white bg-opacity-90 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
              <div className="text-primary-600 text-4xl mb-4">
                <i className="ri-pencil-line"></i>
              </div>
              <h3 className="font-nunito font-bold text-xl mb-2">Draw</h3>
              <p className="text-gray-600">Create simple sketches using our kid-friendly drawing tools</p>
            </div>
            
            <div className="bg-white bg-opacity-90 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
              <div className="text-pink-500 text-4xl mb-4">
                <i className="ri-magic-line"></i>
              </div>
              <h3 className="font-nunito font-bold text-xl mb-2">Transform</h3>
              <p className="text-gray-600">Watch as our AI magic turns your doodles into amazing 3D models</p>
            </div>
            
            <div className="bg-white bg-opacity-90 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
              <div className="text-green-500 text-4xl mb-4">
                <i className="ri-volume-up-line"></i>
              </div>
              <h3 className="font-nunito font-bold text-xl mb-2">Play</h3>
              <p className="text-gray-600">Hear your creations come to life with fun, object-related sounds</p>
            </div>
          </motion.div>
          
          <motion.button 
            className="bg-primary-600 hover:bg-primary-500 text-white font-nunito font-bold text-xl py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-pulse"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/draw')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            Start Doodling!
          </motion.button>
          
          <motion.div 
            className="flex gap-6 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <a href="#" className="text-primary-600 hover:text-primary-500 transition-colors">How It Works</a>
            <a href="#" className="text-primary-600 hover:text-primary-500 transition-colors">Gallery</a>
            <a href="#" className="text-primary-600 hover:text-primary-500 transition-colors">About</a>
            <a href="#" className="text-primary-600 hover:text-primary-500 transition-colors">Contact</a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
