# 3Doodle - AI-Powered Sketch to 3D Converter

## Project Overview

3Doodle is an interactive web application that transforms simple drawings into 3D images with generated sounds. It's designed to be kid-friendly, using OpenRouter models to chat with users, detect what's been drawn, and generate a corresponding 3D representation of the object. This application bridges the gap between imagination and visualization, making it fun for children to see their drawings come to life!

## Functionality

The 3Doodle application works through a simple, user-friendly process:

1. **Draw**: Users create simple sketches on a digital canvas using the drawing tools provided.
2. **Chat**: Users can ask the built-in OpenRouter chat helper for drawing ideas, simple tips, or direct generated objects such as "pintame un gato".
3. **Detect**: Using OpenRouter's free model router, the application identifies the object drawn.
4. **Generate**: Once identified, Sourceful Riverflow creates a 3D representation of the drawn object.
5. **Interact**: Users can view their creations in the gallery, where they can also hear sounds associated with each object and download their creations.

The application features:
- A simple and intuitive drawing interface with adjustable brush size and colors
- A compact chat helper powered by OpenRouter's free model router, with direct image requests sent to Sourceful Riverflow
- AI-powered object detection to identify the user's drawing
- 3D image generation based on the identified object
- A gallery to view, play sounds for, and download created 3D models

## APIs Used

3Doodle uses OpenRouter API keys plus two model IDs:
- **OPENROUTER_API_KEY**: one OpenRouter secret key for the whole app
- **OPENROUTER_CHAT_API_KEY**: optional key for chat and Kimi-based doodle detection
- **OPENROUTER_IMAGE_API_KEY**: optional key for Riverflow image generation
- **OPENROUTER_CHAT_MODEL**: defaults to **moonshotai/kimi-k2.6:free**
- **OPENROUTER_IMAGE_MODEL**: defaults to **sourceful/riverflow-v2.5-pro:free**

If you set the specific chat and image keys, the app uses those first. Otherwise, it falls back to **OPENROUTER_API_KEY**.

## Installation

### Prerequisites
- Node.js (version 20 or later)
- npm (comes with Node.js)
- An OpenRouter API key

### Steps to Install

1. **Clone the repository**
   ```bash
   git clone https://github.com/uset82/3Doodle.git
   cd 3Doodle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add your OpenRouter key plus optional model overrides:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENROUTER_CHAT_API_KEY=your_chat_api_key_here
   OPENROUTER_IMAGE_API_KEY=your_image_api_key_here
   OPENROUTER_CHAT_MODEL=moonshotai/kimi-k2.6:free
   OPENROUTER_IMAGE_MODEL=sourceful/riverflow-v2.5-pro:free
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Access the application**
   
   Open your browser and go to `http://localhost:5000`

## Deploying

This project now deploys with Canner instead of Netlify.

1. Sign in once:
   ```bash
   npx @canner-ca/cli@latest login
   ```

2. The repo already includes `canner.json` with the project slug.

3. Deploy from the repo root:
   ```bash
   npx @canner-ca/cli@latest deploy --follow
   ```

   Or run the CLI directly:
   ```bash
   npm run deploy
   ```

4. Set your OpenRouter keys in the Canner dashboard environment variables.

## API Requirements

To use 3Doodle, you need:

1. OpenRouter API key configuration. You can obtain keys from [OpenRouter](https://openrouter.ai/):
   - Create an account if you don't already have one
   - Set `OPENROUTER_API_KEY` to use one key for the whole app
   - Or set `OPENROUTER_CHAT_API_KEY` and `OPENROUTER_IMAGE_API_KEY` if you want separate keys
   - Optionally override the chat or image model with `OPENROUTER_CHAT_MODEL` and `OPENROUTER_IMAGE_MODEL`

For Canner deployments, add `OPENROUTER_API_KEY`, or add both `OPENROUTER_CHAT_API_KEY` and `OPENROUTER_IMAGE_API_KEY`, in the Canner environment variable settings. You can also set `OPENROUTER_CHAT_MODEL` and `OPENROUTER_IMAGE_MODEL` there if you want to override the defaults. Do not put secret API keys in the repo.

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
