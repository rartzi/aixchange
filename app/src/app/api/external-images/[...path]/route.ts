import { NextResponse } from "next/server";
import { join } from "path";
import fs from "fs/promises";

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    // Reconstruct the path from the segments
    const imagePath = params.path.join("/");
    
    // Construct the full path to the external images directory
    const fullPath = join(process.cwd(), "deploy", "external-images", imagePath);

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