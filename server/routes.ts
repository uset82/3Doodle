import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from 'zod';
import { chatRequestSchema, generateImageSchema, GalleryItem } from '@shared/schema';
import { nanoid } from 'nanoid';
import {
  chatWithOpenRouter,
  getFallbackChatReply,
  generate3DModel,
  getRequestedImageObject,
  isOpenRouterConfigError,
} from './openrouter';

// In-memory storage for generated gallery items
let galleryItems: GalleryItem[] = [];

type GenerationJob = {
  status: "processing" | "complete" | "failed";
  created: string;
  updated: string;
  galleryItem?: GalleryItem;
  message?: string;
};

const generationJobs = new Map<string, GenerationJob>();

function createGalleryItem(objectType: string, imageUrl: string): GalleryItem {
  return {
    id: nanoid(),
    objectType,
    imageUrl,
    created: new Date().toISOString()
  };
}

function getOpenRouterSetupMessage(error: Error): string {
  return `${error.message}. Add OPENROUTER_API_KEY, or set OPENROUTER_CHAT_API_KEY and OPENROUTER_IMAGE_API_KEY. You can also set OPENROUTER_CHAT_MODEL and OPENROUTER_IMAGE_MODEL to override the defaults.`;
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message.trim() ? error.message : fallback;
}

function setGenerationJob(jobId: string, job: GenerationJob) {
  generationJobs.set(jobId, job);
}

async function runGenerationJob(jobId: string, imageData: string) {
  try {
    console.log(`Generating 3D model from drawing with Sourceful Riverflow for job ${jobId}...`);
    const imageUrl = await generate3DModel("doodle", imageData);
    const now = new Date().toISOString();
    const existingJob = generationJobs.get(jobId);
    const newItem = createGalleryItem("doodle", imageUrl);

    galleryItems.unshift(newItem);
    setGenerationJob(jobId, {
      status: "complete",
      created: existingJob?.created ?? now,
      updated: now,
      galleryItem: newItem,
    });

    console.log(`Successfully created 3D model for job ${jobId}`);
  } catch (error) {
    console.error(`Error generating 3D image for job ${jobId}:`, error);
    const now = new Date().toISOString();
    const existingJob = generationJobs.get(jobId);

    setGenerationJob(jobId, {
      status: "failed",
      created: existingJob?.created ?? now,
      updated: now,
      message: isOpenRouterConfigError(error)
        ? getOpenRouterSetupMessage(error)
        : getErrorMessage(error, "Failed to generate 3D image. Please try again."),
    });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // GET all gallery items
  app.get('/api/gallery', (req, res) => {
    res.json(galleryItems);
  });
  
  app.post('/api/chat', async (req, res) => {
    try {
      const validatedData = chatRequestSchema.parse(req.body);
      const requestedObject = getRequestedImageObject(validatedData.messages);

      if (requestedObject) {
        console.log(`Generating 3D model from chat for: ${requestedObject}`);
        const imageUrl = await generate3DModel(requestedObject);
        const newItem = createGalleryItem(requestedObject, imageUrl);
        galleryItems.unshift(newItem);

        return res.status(200).json({
          message: {
            role: 'assistant',
            content: `Done! I made a 3D ${requestedObject} and added it to your gallery.`,
          },
          galleryItem: newItem,
        });
      }

      let content: string;

      try {
        content = await chatWithOpenRouter(validatedData.messages);
      } catch (error) {
        if (isOpenRouterConfigError(error)) {
          throw error;
        }

        console.error('OpenRouter chat unavailable, using local reply:', error);
        content = getFallbackChatReply(validatedData.messages);
      }

      res.status(200).json({
        message: {
          role: 'assistant',
          content: content || "I am here to help with your next doodle.",
        },
      });
    } catch (error) {
      console.error('Error chatting with OpenRouter:', error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Invalid chat request data',
          errors: error.errors
        });
      }

      if (isOpenRouterConfigError(error)) {
        return res.status(503).json({
          message: getOpenRouterSetupMessage(error)
        });
      }

      res.status(502).json({
        message: getErrorMessage(error, 'Failed to send chat message. Please try again.')
      });
    }
  });
  
  // Generate 3D image from a sketch using OpenRouter AI
  app.post('/api/generate', async (req, res) => {
    try {
      // Validate request body
      const validatedData = generateImageSchema.parse(req.body);
      
      // Extract the base64 image data
      const imageData = validatedData.imageData;
      const jobId = nanoid();
      const now = new Date().toISOString();

      setGenerationJob(jobId, {
        status: "processing",
        created: now,
        updated: now,
      });
      void runGenerationJob(jobId, imageData);

      res.status(202).json({ jobId, status: "processing" });
    } catch (error) {
      console.error('Error generating 3D image:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid request data', 
          errors: error.errors 
        });
      }

      if (isOpenRouterConfigError(error)) {
        return res.status(503).json({
          message: getOpenRouterSetupMessage(error)
        });
      }
      
      res.status(502).json({
        message: getErrorMessage(error, 'Failed to generate 3D image. Please try again.')
      });
    }
  });

  app.get('/api/generate/:jobId', (req, res) => {
    const job = generationJobs.get(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Generation job not found." });
    }

    res.json(job);
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
