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
      const prompt = "What kind of object is drawn in this image? Please respond with just a single word that best describes the object. For example: 'apple', 'car', 'house', 'dog', etc.";
      
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
      
      // Remove any punctuation and extract just the object name
      const objectType = text.replace(/[^\w\s]/gi, '').split(/\s+/)[0];
      
      console.log('Detected object type:', objectType);
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

// Fallback images for common objects
const fallbackImages: Record<string, string> = {
  'apple': 'data:image/png;base64,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',
  'dog': 'data:image/png;base64,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',
  'flower': 'data:image/png;base64,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',
  'default': 'data:image/png;base64,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'
};

/**
 * Generate a 3D representation of the detected object
 * 
 * @param objectType - The type of object to generate (e.g., "apple", "dog")
 * @returns Base64 encoded image data of the generated 3D model
 */
export async function generate3DModel(objectType: string): Promise<string> {
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
      console.log(`Sending prompt to generate 3D model for ${objectType}`);
      const result = await model.generateContent([prompt]);
      console.log('Received response from Gemini');
      const response = result.response;
      
      // Access parts property which contains the generated image
      const parts = response.candidates?.[0]?.content?.parts;
      console.log('Response parts:', JSON.stringify(parts));
      
      let imageData = null;
      
      if (parts && parts.length > 0) {
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            console.log('Found image data in response');
            imageData = part.inlineData.data;
            break;
          }
        }
      }
      
      if (!imageData) {
        console.log('No image data found in response');
        throw new Error('No image was generated');
      }
      
      // Create data URL with the base64 image data
      const dataUrl = `data:image/png;base64,${imageData}`;
      console.log('Created data URL for generated image');
      
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
}
