import OpenAI from 'openai';
import path from 'path';
import fs from 'fs/promises';
import { createHash } from 'crypto';
import fetch from 'node-fetch';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEventImage(prompt: string): Promise<string> {
  try {
    // Generate image with DALL-E
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a professional, modern event banner image for: ${prompt}. The image should be suitable for a tech event website.`,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error('No image URL returned from DALL-E');
    }

    // Download the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to download image from DALL-E');
    }
    const imageBuffer = await imageResponse.buffer();

    // Create a hash of the prompt to use as part of the filename
    const hash = createHash('md5').update(prompt).digest('hex').slice(0, 8);
    const filename = `event-${hash}.png`;

    // Ensure the events directory exists
    const eventsDir = path.join(process.cwd(), 'external-images', 'events');
    await fs.mkdir(eventsDir, { recursive: true });

    // Save the image
    const imagePath = path.join(eventsDir, filename);
    await fs.writeFile(imagePath, imageBuffer);

    // Return the relative path that will work with our external-images API
    return `/api/external-images/events/${filename}`;
  } catch (error) {
    console.error('Error generating event image:', error);
    return '';
  }
}