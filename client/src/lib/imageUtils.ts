/**
 * Utility functions for image processing and handling
 */

/**
 * Compresses and resizes a canvas image for API submission
 * @param dataUrl - Canvas data URL
 * @param maxWidth - Maximum width for resizing
 * @param maxHeight - Maximum height for resizing
 * @param quality - JPEG quality (0-1)
 * @returns Promise with compressed image as data URL
 */
export const compressImage = (
  dataUrl: string,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      
      // Create temporary canvas for resizing
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      // Draw resized image
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to JPEG with compression
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    
    img.onerror = () => {
      reject(new Error('Error loading image for compression'));
    };
    
    img.src = dataUrl;
  });
};

/**
 * Converts a data URL to a Blob object
 * @param dataUrl - Image data URL
 * @returns Blob object
 */
export const dataUrlToBlob = (dataUrl: string): Blob => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};

/**
 * Extracts the base64 data from a data URL
 * @param dataUrl - Image data URL
 * @returns Base64 string without the MIME prefix
 */
export const getBase64FromDataUrl = (dataUrl: string): string => {
  return dataUrl.split(',')[1];
};
