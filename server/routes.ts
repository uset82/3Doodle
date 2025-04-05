import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from 'zod';
import { generateImageSchema, GalleryItem } from '@shared/schema';
import { nanoid } from 'nanoid';

// In-memory storage for generated gallery items
let galleryItems: GalleryItem[] = [];

// Helper function to detect object from sketch (simplified implementation)
function detectObjectType(imageData: string): string {
  // In a real implementation, you would use Gemini API here to detect the object
  // For now, we'll randomly select from common objects
  const objects = ['apple', 'banana', 'cat', 'dog', 'flower', 'sun', 'house', 'table'];
  return objects[Math.floor(Math.random() * objects.length)];
}

// Helper function to generate a realistic 3D image URL (simulated)
// In production, this would use Gemini API to generate the actual 3D image
function generate3DImage(objectType: string): string {
  // For demo purposes using placeholder images based on object type
  const imageUrls: Record<string, string> = {
    apple: 'https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    cat: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    dog: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    flower: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    sun: 'https://images.unsplash.com/photo-1575881875475-31023242e3f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    house: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    table: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  };
  
  return imageUrls[objectType] || 'https://images.unsplash.com/photo-1575881875475-31023242e3f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
}

export async function registerRoutes(app: Express): Promise<Server> {
  // GET all gallery items
  app.get('/api/gallery', (req, res) => {
    res.json(galleryItems);
  });
  
  // Generate 3D image from a sketch
  app.post('/api/generate', async (req, res) => {
    try {
      // Validate request body
      const validatedData = generateImageSchema.parse(req.body);
      
      // Extract the base64 image data
      const imageData = validatedData.imageData;
      
      // Detect object type from the sketch (in real app, this would use Gemini API)
      const objectType = detectObjectType(imageData);
      
      // Generate 3D image (in real app, this would use Gemini API)
      const imageUrl = generate3DImage(objectType);
      
      // Create gallery item
      const newItem: GalleryItem = {
        id: nanoid(),
        objectType,
        imageUrl,
        created: new Date().toISOString()
      };
      
      // Store the gallery item in-memory
      galleryItems.unshift(newItem);
      
      // Simulate API processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Return the created item
      res.status(201).json(newItem);
    } catch (error) {
      console.error('Error generating 3D image:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid request data', 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        message: 'Failed to generate 3D image. Please try again.' 
      });
    }
  });
  
  // Delete a gallery item
  app.delete('/api/gallery/:id', (req, res) => {
    const { id } = req.params;
    
    // Find and remove the item
    const initialLength = galleryItems.length;
    galleryItems = galleryItems.filter(item => item.id !== id);
    
    if (galleryItems.length === initialLength) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    res.status(200).json({ message: 'Gallery item deleted successfully' });
  });
  
  // Clear all gallery items
  app.delete('/api/gallery', (req, res) => {
    galleryItems = [];
    res.status(200).json({ message: 'Gallery cleared successfully' });
  });

  const httpServer = createServer(app);
  
  return httpServer;
}
