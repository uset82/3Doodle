import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the Gemini API with the provided API key
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error('Missing required environment variable: GEMINI_API_KEY');
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Safety settings to comply with content policies
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

/**
 * Detect what kind of object is drawn in the provided image
 * 
 * @param imageData - Base64 encoded image data from canvas
 * @returns Detected object type (e.g., "apple", "dog", "flower")
 */
export async function detectObjectInDrawing(imageData: string): Promise<string> {
  try {
    // Extract base64 content (remove data URL prefix if present)
    const base64Image = imageData.includes('base64,') 
      ? imageData.split('base64,')[1] 
      : imageData;
    
    // Generate a random object for rate limit fallback
    const fallbackObjects = ['apple', 'dog', 'cat', 'flower', 'house', 'tree', 'car', 'sun', 'moon', 'ball'];
    const randomFallback = fallbackObjects[Math.floor(Math.random() * fallbackObjects.length)];
    
    try {
      // Initialize the model - using Gemini 2.5 Pro for better understanding
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-pro-preview-03-25",
        safetySettings,
      });
  
      // Send prompt with image data to detect object
      const prompt = `This is a simple sketch drawn by a child. Tell me what is drawn in this image.
      Only respond with a single word (like 'apple', 'dog', 'house', etc.) that best describes the object in the image.
      If you can't identify anything specific, just respond with 'object'.`;
  
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "image/png",
            data: base64Image
          }
        }
      ]);
  
      const response = result.response;
      const text = response.text().trim().toLowerCase();
      
      // Extract just the object name (in case there's extra text)
      // Find the first word or simple phrase without punctuation
      const objectMatch = text.match(/^[a-z]+$|^[a-z]+(?:\s[a-z]+)?/);
      const objectType = objectMatch ? objectMatch[0] : 'object';
      
      return objectType;
    } catch (apiError) {
      const err = apiError as { status?: number };
      console.log('API Error status:', err?.status);
      
      // If we hit rate limits, use a random object from our predefined list
      if (err?.status === 429) {
        console.log(`Rate limit reached. Using fallback object: ${randomFallback}`);
        return randomFallback;
      }
      
      // For other errors, rethrow
      throw apiError;
    }
  } catch (error) {
    console.error('Error detecting object in drawing:', error);
    return 'object'; // Default fallback
  }
}

/**
 * Generate a 3D representation of the detected object
 * 
 * @param objectType - The type of object to generate (e.g., "apple", "dog")
 * @returns Base64 encoded image data of the generated 3D model
 */
export async function generate3DModel(objectType: string): Promise<string> {
  try {
    // Define fallback images for common objects
    const fallbackImages: Record<string, string> = {
      'default': 'data:image/png;base64,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',
      'apple': 'data:image/png;base64,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',
      'dog': 'data:image/png;base64,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',
    };

    try {
      // Initialize the model - using Gemini 2.0 Flash for image generation
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp-image-generation",
        safetySettings,
      });

      // Create a prompt for 3D image generation
      const prompt = `A photorealistic 3D model of a ${objectType} rendered in a clean white studio environment with soft lighting. The 3D model should have a bit of a cartoon style appropriate for children, with vibrant colors and smooth textures. The ${objectType} should be the main focus of the image, centered, with slight shadows to emphasize its 3D nature.`;

      try {
        // Generate the image
        const result = await model.generateContent([prompt]);
        const response = result.response;
        
        // Access parts property which contains the generated image
        const parts = response.candidates?.[0]?.content?.parts;
        let imageData = null;
        
        if (parts && parts.length > 0) {
          for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
              imageData = part.inlineData.data;
              break;
            }
          }
        }
        
        if (!imageData) {
          throw new Error('No image was generated');
        }
        
        // Create data URL with the base64 image data
        const dataUrl = `data:image/png;base64,${imageData}`;
        
        return dataUrl;
      } catch (apiError) {
        const err = apiError as { status?: number };
        console.log('API Error status:', err?.status);
        
        // If we hit rate limits, use a fallback image
        if (err?.status === 429) {
          // Use specific fallback if available, otherwise use the default
          const fallbackImage = fallbackImages[objectType] || fallbackImages['default'];
          console.log(`Rate limit reached. Using fallback image for: ${objectType}`);
          return fallbackImage;
        }
        
        // For other errors, use fallback
        const fallbackImage = fallbackImages[objectType] || fallbackImages['default'];
        return fallbackImage;
      }
    } catch (error) {
      console.error('Error generating 3D model:', error);
      // Fallback to placeholder image in case of error
      const fallbackImage = fallbackImages[objectType] || fallbackImages['default'];
      return fallbackImage;
    }
  } catch (error) {
    console.error('Error generating 3D model:', error);
    throw new Error('Failed to generate 3D model');
  }
}
