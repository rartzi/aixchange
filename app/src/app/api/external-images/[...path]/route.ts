import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

interface RouteParams {
  path: string[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    // Get the full path from the URL parameters
    const pathSegments = Array.isArray(params.path) ? params.path : [params.path];
    const filePath = path.join(
      process.env.EXTERNAL_IMAGES_PATH || 'external-images',
      ...pathSegments
    );

    // Check if file exists
    try {
      const stats = await fs.stat(filePath);
      if (!stats.isFile()) {
        return new NextResponse(null, { status: 404 });
      }
    } catch (error) {
      console.log('File not found:', filePath);
      return new NextResponse(null, { status: 404 });
    }

    // Read file and return with appropriate content type
    const fileBuffer = await fs.readFile(filePath);
    const contentType = path.extname(filePath) === '.png'
      ? 'image/png'
      : path.extname(filePath) === '.jpg' || path.extname(filePath) === '.jpeg'
      ? 'image/jpeg'
      : 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error serving external image:', error);
    return new NextResponse(null, { status: 500 });
  }
}