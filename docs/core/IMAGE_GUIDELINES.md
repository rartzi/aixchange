# Image Guidelines

## External Images Configuration

The AIXchange platform supports serving images from an external directory without copying them into the container. This is useful for managing large image collections or sharing images across multiple services.

### Directory Structure

Images should be placed in the `external-images` directory at the root of the application. This directory is mounted read-only in the Docker container.

```
aixchange/
├── app/
├── external-images/    # Place your images here
│   ├── solutions/     # Solution-related images
│   └── profiles/      # Profile images
└── ...
```

### Configuration

1. Environment Variables:
   - `NEXT_PUBLIC_EXTERNAL_IMAGES_URL`: Public URL for accessing images (default: http://localhost:3000/external-images)
   - `EXTERNAL_IMAGES_PATH`: Local mount path in the container (default: /external-images)

2. Using Images in Solutions:
   - When creating a solution, set the `imageUrl` to a path relative to the external-images directory
   - Example: If your image is in `external-images/solutions/my-solution.jpg`, set `imageUrl` to `/external-images/solutions/my-solution.jpg`

### Example

```typescript
const solution = {
  title: "My AI Solution",
  imageUrl: "/external-images/solutions/my-solution.jpg",
  // ... other fields
};
```

### Security Considerations

1. The external-images directory is mounted read-only in the container
2. Only image files should be placed in this directory
3. Implement proper access controls if needed for sensitive images
4. Consider using a CDN for production deployments

### Supported Image Formats

- JPEG/JPG
- PNG
- GIF
- WebP
- AVIF

### Best Practices

1. Organize images in subdirectories by type (solutions, profiles, etc.)
2. Use descriptive filenames
3. Optimize images for web use
4. Consider implementing image resizing for different use cases
5. Regular cleanup of unused images