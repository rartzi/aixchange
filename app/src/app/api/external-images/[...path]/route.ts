import { NextResponse } from "next/server";
import { join } from "path";
import fs from "fs/promises";

// Use the exact path from environment variable
const EXTERNAL_IMAGES_PATH = process.env.EXTERNAL_IMAGES_PATH || 'external-images';

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    // Reconstruct the path from the segments
    const imagePath = params.path.join("/");
    
    // Construct the full path using the environment variable
    const fullPath = join(process.cwd(), EXTERNAL_IMAGES_PATH, imagePath);

    // Try to read the file
    const file = await fs.readFile(fullPath);

    // Determine content type based on file extension
    const ext = imagePath.split(".").pop()?.toLowerCase();
    const contentType = ext === "png" ? "image/png" : 
                       ext === "jpg" || ext === "jpeg" ? "image/jpeg" : 
                       ext === "gif" ? "image/gif" : 
                       "application/octet-stream";

    // Return the file with appropriate headers
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error(`Error serving external image ${params.path.join("/")}: `, error);
    return new NextResponse("Image not found", { status: 404 });
  }
}