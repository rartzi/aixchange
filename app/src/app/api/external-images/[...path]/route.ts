import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Get the full path from the URL parameters
    const filePath = path.join(process.env.EXTERNAL_IMAGES_PATH || '/app/public/external-images', ...params.path);

    console.log('External images route debug:', {
      requestedPath: params.path,
      fullPath: filePath,
      envPath: process.env.EXTERNAL_IMAGES_PATH,
      exists: fs.existsSync(filePath),
      parentDirExists: fs.existsSync(path.dirname(filePath)),
      parentDirContents: fs.existsSync(path.dirname(filePath)) ? fs.readdirSync(path.dirname(filePath)) : []
    });

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return new NextResponse('File not found', { status: 404 });
    }

    // Read file
    const fileBuffer = fs.readFileSync(filePath);

    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentType = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    }[ext] || 'application/octet-stream';

    // Return file with proper content type
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable' // Cache for 1 year
      }
    });
  } catch (error) {
    console.error('Error serving external image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}