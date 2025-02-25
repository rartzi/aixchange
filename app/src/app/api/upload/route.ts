import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';

// Use the exact path from environment variable
const EXTERNAL_IMAGES_PATH = process.env.EXTERNAL_IMAGES_PATH || '/app/public/external-images';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'solutions'; // Default to solutions if not specified

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Create directory if it doesn't exist
    const targetDir = path.join(EXTERNAL_IMAGES_PATH, type);
    await mkdir(targetDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.toLowerCase();
    const ext = path.extname(originalName);
    const sanitizedName = path.basename(originalName, ext)
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .replace(/_+/g, '_');
    const filename = `${sanitizedName}-${timestamp}${ext}`;
    const filepath = path.join(targetDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return the URL path that will work with our external-images API
    const url = `/api/external-images/${type}/${filename}`;

    return NextResponse.json({
      url,
      filename,
      status: 'success',
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Error in upload API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}