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
    // Initialize the model - using Gemini 2.0 Flash for image generation
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp-image-generation",
      safetySettings,
    });

    // Create a prompt for 3D image generation
    const prompt = `A photorealistic 3D model of a ${objectType} rendered in a clean white studio environment with soft lighting. The 3D model should have a bit of a cartoon style appropriate for children, with vibrant colors and smooth textures. The ${objectType} should be the main focus of the image, centered, with slight shadows to emphasize its 3D nature.`;

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
  } catch (error) {
    console.error('Error generating 3D model:', error);
    // Fallback to placeholder image in case of error
    throw new Error('Failed to generate 3D model');
  }
}