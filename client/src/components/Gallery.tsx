import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { GalleryItem } from '@/shared/schema';
import { useToast } from '@/hooks/use-toast';
import { playSound } from '@/lib/sounds';

type GalleryProps = {
  items: GalleryItem[];
  onDelete: (id: string) => void;
};

const Gallery = ({ items, onDelete }: GalleryProps) => {
  const { toast } = useToast();
  const [activeSound, setActiveSound] = useState<string | null>(null);
  
  const handlePlaySound = (item: GalleryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSound(item.id);
    
    playSound(item.objectType)
      .then(() => {
        setTimeout(() => setActiveSound(null), 1000);
      })
      .catch((error) => {
        console.error('Error playing sound:', error);
        setActiveSound(null);
        toast({
          title: 'Sound Error',
          description: 'Could not play the sound for this object.',
          variant: 'destructive'
        });
      });
  };
  
  const handleDownload = (item: GalleryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = item.imageUrl;
    link.download = `3doodle-${item.objectType}-${item.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Download Started',
      description: `Your ${item.objectType} 3D image is downloading.`
    });
  };
  
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };
  
  return (
    <div>
      <AnimatePresence>
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400"
          >
            <i className="ri-gallery-line text-5xl mb-3 opacity-50"></i>
            <p className="text-center max-w-xs">Your 3D creations will appear here after you draw and generate!</p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                className="gallery-item bg-gray-100 rounded-xl overflow-hidden shadow-md transition-all duration-300 cursor-pointer"
                onClick={(e) => handlePlaySound(item, e)}
              >
                <div className="relative pb-[100%]">
                  <img 
                    src={item.imageUrl} 
                    alt={`Generated 3D ${item.objectType}`} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="font-nunito font-medium text-sm">{item.objectType}</span>
                  <div className="flex space-x-1">
                    <button 
                      className={`p-1.5 transition-colors ${activeSound === item.id ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}
                      title="Play Sound"
                      onClick={(e) => handlePlaySound(item, e)}
                    >
                      <i className="ri-volume-up-line"></i>
                    </button>
                    <button 
                      className="p-1.5 text-gray-600 hover:text-primary-600 transition-colors" 
                      title="Download"
                      onClick={(e) => handleDownload(item, e)}
                    >
                      <i className="ri-download-line"></i>
                    </button>
                    <button 
                      className="p-1.5 text-gray-600 hover:text-rose-600 transition-colors" 
                      title="Delete"
                      onClick={(e) => handleDelete(item.id, e)}
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
