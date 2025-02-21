import { NextRequest } from 'next/server';
import { join } from 'path';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Ensure path is within external-images directory
    const safePath = params.path.join('/');
    if (safePath.includes('..')) {
      return new Response('Invalid path', { status: 400 });
    }

    // Construct full path to image
    const imagePath = join(process.cwd(), 'external-images', safePath);
    
    // Check if file exists
    try {
      const stats = await stat(imagePath);
      if (!stats.isFile()) {
        console.error(`Not a file: ${imagePath}`);
        return new Response('Not found', { status: 404 });
      }
    } catch (error) {
      console.error(`File not found: ${imagePath}`);
      return new Response('Not found', { status: 404 });
    }

    // Get file extension
    const ext = imagePath.split('.').pop()?.toLowerCase();
    const contentType = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
    }[ext || ''] || 'application/octet-stream';

    // Create readable stream
    const stream = createReadStream(imagePath);

    // Log successful image serve
    console.log(`Serving image: ${safePath}`);

    return new Response(stream as any, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}