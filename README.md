# (AI)Xchange Platform

<div align="center">
  <img src="development-process-temp/mockups/robot-surfer.jpg" alt="(AI)Xchange Robot Surfer" width="600">

  **A Modern Platform for AI Solution Discovery and Implementation**

  [![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
  [![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC)](https://tailwindcss.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791)](https://www.postgresql.org/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

## Overview

(AI)Xchange is an innovative platform designed to revolutionize how developers discover, share, and implement AI solutions. Built with modern web technologies and a focus on developer experience, (AI)Xchange provides a robust marketplace for AI solutions with comprehensive documentation and seamless integration capabilities.

## Key Features

- **Modern Interface**: Responsive design with light/dark theme support
- **Secure Authentication**: Role-based access control with NextAuth.js
- **(AI)Xchange**: Discover and share AI implementations
- **(AI)Xperiment**: Test solutions in real-time
- **Community Platform**: Collaborate and contribute to solutions
- **Version Control**: Track and manage solution versions
- **Media Management**: External image storage with efficient serving

## Technology Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with role-based access
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: React Context API
- **Testing**: Jest, React Testing Library
- **Deployment**: Docker, Docker Compose
- **Media Storage**: External volume mounting with read-only access

## Installation

### Prerequisites

- Node.js 18+
- Git
- Docker and Docker Compose (for containerized setup)
- PostgreSQL (for local setup)

### Quick Start (Docker)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/(ai)xchange.git
cd (ai)xchange/app
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Create external images directory:
```bash
mkdir -p external-images/solutions external-images/profiles
```

4. Start the application:
```bash
docker compose up -d
docker compose exec app npx prisma migrate deploy
```

The application will be available at `http://localhost:3000`

### Development Environment Setup

Follow these steps exactly to set up a development environment from scratch:

1. **Install Prerequisites**
```bash
# Install Node.js 18+ from https://nodejs.org/
# Install PostgreSQL from https://www.postgresql.org/download/
# Verify installations
node --version  # Should be 18+
npm --version   # Should be 8+
psql --version  # Should be 14+
```

2. **Set Up PostgreSQL**
```bash
# Create database and user
psql postgres
CREATE USER aixchange_user WITH PASSWORD 'your_password_here';
CREATE DATABASE aixchange_db;
GRANT ALL PRIVILEGES ON DATABASE aixchange_db TO aixchange_user;
\q
```

3. **Clone and Install Project**
```bash
# Clone repository
git clone https://github.com/yourusername/aixchange-from-scratch.git
cd aixchange-from-scratch/app

# Install dependencies
npm install

# If you get any peer dependency warnings, fix them with:
npm install --legacy-peer-deps
```

4. **Configure Environment**
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your database credentials:
DATABASE_URL="postgresql://aixchange_user:your_password_here@localhost:5432/aixchange_db"

# Generate NextAuth secret
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env

# Add other required variables:
echo "NEXTAUTH_URL=http://localhost:3001" >> .env
echo "NEXT_PUBLIC_EXTERNAL_IMAGES_URL=http://localhost:3001/external-images" >> .env
echo "EXTERNAL_IMAGES_PATH=external-images" >> .env
```

5. **Set Up Image Storage**
```bash
# Create required directories
mkdir -p external-images/solutions external-images/profiles

# Set proper permissions
chmod 755 external-images external-images/solutions external-images/profiles
```

6. **Initialize Database**
```bash
# Run migrations
npx prisma generate
npx prisma migrate dev

# Verify database setup
npx prisma studio  # Should open database UI at http://localhost:5555
```

7. **Start Development Server**
```bash
# In one terminal, start the development server
npm run dev

# In another terminal, verify the server is running
curl http://localhost:3001  # Should return HTML content
```

8. **Verify Setup**
- Open http://localhost:3001 in your browser
- Create a solution to test image generation
- Check external-images/solutions directory for generated images
- Verify database entries in Prisma Studio

### Troubleshooting Common Setup Issues

1. **Database Connection Issues**
```bash
# Verify PostgreSQL is running
pg_isready

# Test connection
psql -U aixchange_user -d aixchange_db -h localhost
```

2. **Permission Issues**
```bash
# Fix external-images permissions
sudo chown -R $USER:$USER external-images/
chmod -R 755 external-images/
```

3. **Port Conflicts**
```bash
# Check if ports are in use
lsof -i :3001
lsof -i :5432

# Kill process if needed
kill -9 <PID>
```

4. **Node Modules Issues**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Debugging Image Generation

To debug image generation issues, follow these steps:

1. **Check DALL-E Configuration**
```bash
# Add to .env:
OPENAI_API_KEY=your_api_key_here
DALLE_IMAGE_SIZE=1024x1024
DALLE_IMAGE_QUALITY=standard
DALLE_IMAGE_FORMAT=png
```

2. **Monitor Image Generation Flow**
```bash
# In one terminal, watch the images directory
watch "ls -l external-images/solutions"

# In another terminal, tail the logs
tail -f .next/logs/error.log
```

3. **Test Image Generation API**
```bash
# Create a test request
curl -X POST http://localhost:3001/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{"description":"test image","title":"test"}'

# Check response and external-images/solutions directory
```

4. **Verify Database Storage**
```bash
# Open Prisma Studio
npx prisma studio

# Check Solution table for imageUrl format
# Should be: /api/external-images/solutions/filename.png
```

5. **Debug Browser Issues**
- Open browser dev tools (F12)
- Check Network tab for image requests
- Look for console errors during image load
- Verify image paths in rendered HTML

## Project Structure

```
app/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── features/       # Feature-specific components
│   │   ├── layout/         # Layout components
│   │   ├── theme/          # Theme components
│   │   └── ui/             # Reusable UI components
│   ├── lib/                # Utility functions
│   └── types/              # TypeScript types
├── prisma/                 # Database schema
├── docker-compose.yml      # Docker configuration
├── public/                # Static assets
└── external-images/       # External image storage
    ├── solutions/         # Solution images
    └── profiles/          # Profile images
```

## Debugging Setup

### Initial Setup for Debugging

1. Clone and set up the repository:
```bash
# Clone the repository
git clone https://github.com/yourusername/(ai)xchange.git
cd (ai)xchange/app

# Install dependencies
npm install

# Copy environment file and update with your values
cp .env.example .env
```

2. Set up the database:
```bash
# Create and migrate the database
npx prisma migrate dev
# Start Prisma Studio for database inspection
npx prisma studio
```

3. Set up image storage:
```bash
# Create required directories
mkdir -p external-images/solutions external-images/profiles

# Ensure proper permissions
chmod 755 external-images
chmod 755 external-images/solutions
chmod 755 external-images/profiles
```

4. Configure DALL-E (for image generation):
```bash
# Add to .env file:
OPENAI_API_KEY=your_api_key_here
DALLE_IMAGE_SIZE=1024x1024
DALLE_IMAGE_QUALITY=standard
DALLE_IMAGE_FORMAT=png
```

### Debugging Image Generation

To debug the image generation and storage flow:

1. Start the development server:
```bash
npm run dev
```

2. Monitor the image flow:
```bash
# In a new terminal, watch the external-images directory
watch "ls -l external-images/solutions"
```

3. Check logs in different places:
- Browser console: Shows image generation response and form submission
- Terminal: Shows API responses and file system operations
- Prisma Studio (http://localhost:5555): Inspect database records

4. Key files to check for image handling:
- `app/src/components/features/solutions/CreateSolutionForm.tsx`: Form handling and image generation
- `app/src/app/api/generate-image/route.ts`: DALL-E image generation
- `app/src/app/api/solutions/route.ts`: Solution creation with image URL
- `app/src/components/features/solutions/SolutionCard.tsx`: Image display

### Common Issues and Debugging Steps

1. Image not displaying:
- Check browser console for image load errors
- Verify image URL in database using Prisma Studio
- Confirm file exists in external-images/solutions directory
- Check image permissions and ownership

2. Image generation issues:
- Verify OPENAI_API_KEY in .env
- Check generate-image API response in browser console
- Look for errors in terminal output

3. Database issues:
- Use Prisma Studio to inspect solution records
- Check imageUrl field format in database
- Verify solution creation API response

## Documentation

- [Development Guide](docs/core/DEVELOPMENT.md)
- [Architecture Decisions](docs/core/architecture/API_ARCHITECTURE_DECISION.md)
- [API Documentation](docs/core/API.md)
- [Style Guide](docs/core/STYLE_GUIDE.md)
- [Deployment Guide](docs/core/DEPLOYMENT.md)
- [Image Guidelines](docs/core/IMAGE_GUIDELINES.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We follow the conventional commits specification:

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build process changes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.