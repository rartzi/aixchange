import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

interface RouteParams {
  path: string[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    // Get the full path from the URL parameters
    const filePath = path.join(
      process.env.EXTERNAL_IMAGES_PATH || '/app/public/external-images',
      ...params.path
    );

    console.log('External images route debug:', {
      requestedPath: params.path,
      fullPath: filePath,
      envPath: process.env.EXTERNAL_IMAGES_PATH,
      exists: fs.existsSync(filePath),
      parentDirExists: fs.existsSync(path.dirname(filePath)),
      parentDirContents: fs.existsSync(path.dirname(filePath))
        ? fs.readdirSync(path.dirname(filePath))
        : []
    });

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return new NextResponse(null, { status: 404 });
    }

    // Read file and return with appropriate content type
    const fileBuffer = fs.readFileSync(filePath);
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