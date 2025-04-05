import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import DrawingCanvas from '@/components/DrawingCanvas';
import ColorPicker from '@/components/ColorPicker';
import BrushSizeControl from '@/components/BrushSizeControl';
import ToolSelector from '@/components/ToolSelector';
import Gallery from '@/components/Gallery';
import HelpModal from '@/components/HelpModal';
import ProcessingIndicator from '@/components/ProcessingIndicator';
import { useDrawing } from '@/hooks/useDrawing';
import { apiRequest } from '@/lib/queryClient';
import { GalleryItem } from '../../../shared/schema';

const DrawingApp = () => {
  const { toast } = useToast();
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  
  const {
    canvasRef,
    currentTool,
    currentColor,
    brushSize,
    clearCanvas,
    setCurrentTool,
    setCurrentColor,
    setBrushSize,
    isDrawn,
    setIsDrawn,
    getCanvasImage
  } = useDrawing();

  const handleNewDoodle = () => {
    clearCanvas();
  };

  const handleGenerateImage = async () => {
    if (!isDrawn) {
      toast({
        title: "Canvas is empty",
        description: "Please draw something first!",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Get the image data from canvas
      const imageData = getCanvasImage();
      
      // Send image to server for processing with Gemini API
      const response = await apiRequest('POST', '/api/generate', {
        imageData,
      });
      
      const result = await response.json();
      
      // Add new item to gallery
      setGalleryItems(prev => [result, ...prev]);
      
      toast({
        title: "3D image generated!",
        description: `Your ${result.objectType} has been created!`,
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Generation failed",
        description: "Couldn't transform your drawing. Please try again!",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteGalleryItem = (id: string) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearGallery = () => {
    setGalleryItems([]);
  };

  // Fetch existing gallery items on component mount
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const items = await response.json();
          setGalleryItems(items);
        }
      } catch (error) {
        console.error("Error fetching gallery items:", error);
      }
    };

    fetchGalleryItems();
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80')] bg-cover opacity-10 filter blur-5 -z-10"></div>
      <div className="absolute top-0 right-0 h-96 w-96 bg-primary-light rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 h-96 w-96 bg-pink-200 rounded-full filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <h1 className="font-nunito font-bold text-2xl md:text-3xl text-primary-600 flex items-center">
              <span className="mr-2">3Doodle</span>
              <i className="ri-magic-line text-pink-500 animate-pulse"></i>
            </h1>
          </div>
          
          <nav className="flex space-x-4">
            <button
              onClick={handleNewDoodle}
              className="flex items-center px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm hover:bg-primary-200 transition-colors"
            >
              <i className="ri-file-add-line mr-1"></i> New
            </button>
            <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-primary-100 hover:text-primary-600 transition-colors">
              <i className="ri-gallery-line mr-1"></i> Gallery
            </button>
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-primary-100 hover:text-primary-600 transition-colors"
            >
              <i className="ri-question-line mr-1"></i> Help
            </button>
          </nav>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Drawing Canvas Section */}
          <div className="lg:col-span-9 bg-white rounded-2xl shadow-lg p-4 relative">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="font-nunito font-bold text-xl text-primary-600">Drawing Canvas</h2>
              <div className="text-gray-600 text-sm">
                <span>Draw a simple object: apple, banana, dog, cat, flower, etc.</span>
              </div>
            </div>
            
            <DrawingCanvas
              canvasRef={canvasRef}
              currentTool={currentTool}
              currentColor={currentColor}
              brushSize={brushSize}
              isDrawn={isDrawn}
              setIsDrawn={setIsDrawn}
            />
            
            <div className="mt-4 flex flex-wrap justify-between gap-4">
              <div className="flex items-center space-x-3">
                <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-colors">
                  <i className="ri-arrow-go-back-line"></i>
                </button>
                <button
                  onClick={clearCanvas}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                >
                  <i className="ri-eraser-line"></i>
                </button>
              </div>
              
              <button
                onClick={handleGenerateImage}
                className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-full font-nunito font-bold shadow-md hover:bg-primary-500 transition-colors transform hover:-translate-y-1 hover:shadow-lg"
              >
                <i className="ri-magic-line mr-2"></i>
                <span>Generate 3D!</span>
              </button>
            </div>
          </div>
          
          {/* Tools Panel */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-4">
            <h2 className="font-nunito font-bold text-lg text-primary-600 mb-4">Drawing Tools</h2>
            
            <ColorPicker 
              currentColor={currentColor}
              setCurrentColor={setCurrentColor}
            />
            
            <BrushSizeControl 
              brushSize={brushSize}
              setBrushSize={setBrushSize}
            />
            
            <ToolSelector 
              currentTool={currentTool}
              setCurrentTool={setCurrentTool}
            />
            
            <div>
              <h3 className="text-sm text-gray-600 mb-2">Try Drawing</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-100 p-2 rounded-lg text-center hover:bg-primary-50 cursor-pointer transition-colors">
                  <span className="text-sm">Apple</span>
                </div>
                <div className="bg-gray-100 p-2 rounded-lg text-center hover:bg-primary-50 cursor-pointer transition-colors">
                  <span className="text-sm">Cat</span>
                </div>
                <div className="bg-gray-100 p-2 rounded-lg text-center hover:bg-primary-50 cursor-pointer transition-colors">
                  <span className="text-sm">Flower</span>
                </div>
                <div className="bg-gray-100 p-2 rounded-lg text-center hover:bg-primary-50 cursor-pointer transition-colors">
                  <span className="text-sm">House</span>
                </div>
                <div className="bg-gray-100 p-2 rounded-lg text-center hover:bg-primary-50 cursor-pointer transition-colors">
                  <span className="text-sm">Dog</span>
                </div>
                <div className="bg-gray-100 p-2 rounded-lg text-center hover:bg-primary-50 cursor-pointer transition-colors">
                  <span className="text-sm">Car</span>
                </div>
                <div className="bg-gray-100 p-2 rounded-lg text-center hover:bg-primary-50 cursor-pointer transition-colors">
                  <span className="text-sm">Sun</span>
                </div>
                <div className="bg-gray-100 p-2 rounded-lg text-center hover:bg-primary-50 cursor-pointer transition-colors">
                  <span className="text-sm">Tree</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                <p className="text-xs text-primary-700">
                  <i className="ri-lightbulb-line mr-1"></i>
                  <strong>Tip:</strong> Draw a simple outline. The AI is great at recognizing basic shapes!
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Generated Images Gallery */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-nunito font-bold text-xl text-primary-600">Your 3D Gallery</h2>
            <button
              onClick={handleClearGallery}
              className="flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
              disabled={galleryItems.length === 0}
            >
              <i className="ri-delete-bin-line mr-1"></i> Clear All
            </button>
          </div>
          
          <Gallery 
            items={galleryItems}
            onDelete={handleDeleteGalleryItem}
          />
        </div>
      </div>
      
      {/* Modals */}
      {isHelpModalOpen && (
        <HelpModal onClose={() => setIsHelpModalOpen(false)} />
      )}
      
      {isProcessing && (
        <ProcessingIndicator />
      )}
    </div>
  );
};

export default DrawingApp;
