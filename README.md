# 3Doodle - AI-Powered Sketch to 3D Converter

## Project Overview

3Doodle is an interactive web application that transforms simple drawings into 3D images with generated sounds. It's designed to be kid-friendly, using Google's Gemini AI models to detect what's been drawn and generate a corresponding 3D representation of the object. This application bridges the gap between imagination and visualization, making it fun for children to see their drawings come to life!

## Functionality

The 3Doodle application works through a simple, user-friendly process:

1. **Draw**: Users create simple sketches on a digital canvas using the drawing tools provided.
2. **Detect**: Using Google's Gemini AI, the application identifies the object drawn.
3. **Generate**: Once identified, Gemini AI creates a 3D representation of the drawn object.
4. **Interact**: Users can view their creations in the gallery, where they can also hear sounds associated with each object and download their creations.

The application features:
- A simple and intuitive drawing interface with adjustable brush size and colors
- AI-powered object detection to identify the user's drawing
- 3D image generation based on the identified object
- A gallery to view, play sounds for, and download created 3D models

## APIs Used

3Doodle utilizes the following Google Gemini API models:
- **Gemini 2.5 Pro (gemini-2.5-pro-preview-03-25)**: Used for object detection in drawings
- **Gemini 2.0 Flash for Image Generation (gemini-2.0-flash-exp-image-generation)**: Used to generate 3D representations of identified objects

## Installation

### Prerequisites
- Node.js (version 16 or later)
- npm (comes with Node.js)
- A Google API key with access to Gemini models

### Steps to Install

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/3doodle.git
   cd 3doodle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Access the application**
   
   Open your browser and go to `http://localhost:5000`

## API Requirements

To use 3Doodle, you need:

1. A Google API key with access to Gemini models. You can obtain this from the [Google AI Studio](https://ai.google.dev/):
   - Create an account if you don't already have one
   - Create a new API key
   - Ensure the key has access to both required Gemini models:
     - Gemini 2.5 Pro (gemini-2.5-pro-preview-03-25)
     - Gemini 2.0 Flash for Image Generation (gemini-2.0-flash-exp-image-generation)

2. Store your API key securely in the `.env` file as mentioned in the installation steps.

## Security Note

- **Never commit your API keys to version control systems like Git.**
- The `.env` file is included in `.gitignore` to prevent accidental commits of sensitive information.
- For production deployments, consider using environment variables provided by your hosting platform instead of a `.env` file.
- Regularly rotate your API keys as a security best practice.

## Limitations

- The application has built-in fallback mechanisms for when API rate limits are reached or when the API cannot generate images.
- The quality of object detection and 3D generation is dependent on the clarity of the drawing and the capabilities of the underlying AI models.

## License

[Include your license information here]