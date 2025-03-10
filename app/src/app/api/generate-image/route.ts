import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Use the exact path from environment variable
const EXTERNAL_IMAGES_PATH = process.env.EXTERNAL_IMAGES_PATH || '/app/public/external-images';
const IMAGE_SIZE = process.env.DALLE_IMAGE_SIZE || '1024x1024';
const IMAGE_QUALITY = process.env.DALLE_IMAGE_QUALITY || 'standard';
const IMAGE_FORMAT = process.env.DALLE_IMAGE_FORMAT || 'png';

function sanitizeFilename(title: string): string {
  // Replace spaces and special characters with underscores
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '_') // Replace non-alphanumeric chars with underscore
    .replace(/^_+|_+$/g, '')     // Remove leading/trailing underscores
    .replace(/_+/g, '_');        // Replace multiple underscores with single
}

export async function POST(request: NextRequest) {
  try {
    const { description, solutionId, title } = await request.json();

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required', status: 'error' },
        { status: 400 }
      );
    }

    // Enhance the prompt to generate more relevant images
    const enhancedPrompt = `Create a professional, modern visualization for an AI solution that ${description}. The image should be clean, minimalist, and suitable for a technology product card.`;

    try {
      // Generate image using DALL-E
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: IMAGE_SIZE as "1024x1024" | "1792x1024" | "1024x1792",
        quality: IMAGE_QUALITY as "standard" | "hd",
        response_format: 'b64_json',
      });

      if (!response.data[0]?.b64_json) {
        return NextResponse.json(
          { 
            error: 'Failed to generate image content',
            status: 'error',
            details: 'DALL-E did not return image data',
            useDefaultImage: true,
            defaultImagePath: '/placeholder-image.jpg'
          },
          { status: 500 }
        );
      }

      // Create solutions directory if it doesn't exist
      const solutionsDir = path.join(EXTERNAL_IMAGES_PATH, 'solutions');
      if (!fs.existsSync(solutionsDir)) {
        fs.mkdirSync(solutionsDir, { recursive: true });
      }

      // Generate filename using solution title or fallback to timestamp
      const timestamp = Date.now();
      const sanitizedTitle = title ? sanitizeFilename(title) : 'solution';
      const filename = `${sanitizedTitle}-${timestamp}.${IMAGE_FORMAT}`;
      const filepath = path.join(solutionsDir, filename);

      console.log('Image generation debug:', {
        EXTERNAL_IMAGES_PATH,
        solutionsDir,
        filename,
        filepath,
        exists: fs.existsSync(solutionsDir),
        dirContents: fs.existsSync(solutionsDir) ? fs.readdirSync(solutionsDir) : []
      });

      // Convert base64 to buffer
      const imageBuffer = Buffer.from(response.data[0].b64_json, 'base64');

      // Optimize and save image using sharp
      await sharp(imageBuffer)
        .toFormat(IMAGE_FORMAT as 'png' | 'jpeg' | 'webp')
        .toFile(filepath);

      console.log('Image saved successfully:', {
        filepath,
        fileExists: fs.existsSync(filepath),
        fileSize: fs.existsSync(filepath) ? fs.statSync(filepath).size : 0
      });

      // Return the relative path for the image URL with /api prefix for serving
      const imageUrl = `/api/external-images/solutions/${filename}`;

      return NextResponse.json({
        imageUrl,
        status: 'success',
        message: 'Image generated and saved successfully',
        filename,
        details: {
          size: IMAGE_SIZE,
          format: IMAGE_FORMAT,
          location: imageUrl
        }
      });

    } catch (openaiError) {
      console.error('DALL-E API error:', openaiError);
      return NextResponse.json(
        { 
          error: 'Failed to generate image with DALL-E',
          status: 'error',
          details: 'AI image generation failed, using default image instead',
          useDefaultImage: true,
          defaultImagePath: '/placeholder-image.jpg'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in generate-image API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        status: 'error',
        details: 'An unexpected error occurred, using default image',
        useDefaultImage: true,
        defaultImagePath: '/placeholder-image.jpg'
      },
      { status: 500 }
    );
  }
}

// Add rate limiting and validation
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed', status: 'error' },
    { status: 405 }
  );
}