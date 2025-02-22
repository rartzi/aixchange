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

## 🚀 Quick Start

Choose your preferred installation method:

### 🐳 Docker Installation (Recommended)

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/aixchange.git
   cd aixchange/app
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration:
   # - Set DATABASE_URL
   # - Add OPENAI_API_KEY for image generation
   # - Configure NextAuth settings
   ```

3. **Start the Application**
   ```bash
   # Start all services
   docker compose up -d

   # Run database migrations
   docker compose exec app npx prisma migrate deploy

   # Create admin user (optional)
   docker compose exec app node scripts/create-admin.js
   ```

The application will be available at `http://localhost:3000`

### 💻 Local Installation

1. **Prerequisites**
   - Node.js 18+
   - PostgreSQL 14+
   - Git

2. **Database Setup**
   ```bash
   # Create database and user
   psql postgres
   CREATE USER aixchange_user WITH PASSWORD 'your_password';
   CREATE DATABASE aixchange_db;
   GRANT ALL PRIVILEGES ON DATABASE aixchange_db TO aixchange_user;
   \q
   ```

3. **Application Setup**
   ```bash
   # Clone and install
   git clone https://github.com/yourusername/aixchange.git
   cd aixchange/app
   npm install

   # Configure environment
   cp .env.example .env
   # Edit .env with your configuration:
   # DATABASE_URL="postgresql://aixchange_user:your_password@localhost:5432/aixchange_db"
   # Add other required variables

   # Setup database
   npx prisma generate
   npx prisma migrate dev

   # Start the application
   npm run dev
   ```

The application will be available at `http://localhost:3001`

## 🔧 Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Authentication
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Image Generation
OPENAI_API_KEY="your-openai-key"
DALLE_IMAGE_SIZE="1024x1024"
DALLE_IMAGE_QUALITY="standard"
DALLE_IMAGE_FORMAT="png"

# File Storage
EXTERNAL_IMAGES_PATH="external-images"
NEXT_PUBLIC_EXTERNAL_IMAGES_URL="http://localhost:3000/external-images"
```

### Optional Features

- **OAuth Providers**: Configure additional providers in `.env`
- **Custom Ports**: Modify port settings in `docker-compose.yml` or `.env`
- **SSL**: Enable HTTPS by configuring SSL certificates

## 🌟 Key Features

- **Modern Interface**: Responsive design with light/dark theme support
- **Secure Authentication**: Role-based access control with NextAuth.js
- **(AI)Xchange**: Discover and share AI implementations
- **(AI)Xperiment**: Test solutions in real-time
- **Community Platform**: Collaborate and contribute to solutions
- **Version Control**: Track and manage solution versions
- **Media Management**: External image storage with efficient serving

## 🛠 Technology Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with role-based access
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: React Context API
- **Testing**: Jest, React Testing Library
- **Deployment**: Docker, Docker Compose
- **Media Storage**: External volume mounting with read-only access

## 📁 Project Structure

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
├── public/                 # Static assets
└── external-images/        # External image storage
    ├── solutions/          # Solution images
    └── profiles/          # Profile images
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection**
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
   lsof -i :3000
   lsof -i :5432
   ```

### Docker-Specific Issues

1. **Container Access**
   ```bash
   # View logs
   docker compose logs app

   # Access container shell
   docker compose exec app sh
   ```

2. **Volume Mounting**
   ```bash
   # Verify volume permissions
   docker compose exec app ls -la /app/external-images
   ```

## 📚 Documentation

- [Development Guide](docs/core/DEVELOPMENT.md)
- [Architecture Decisions](docs/core/architecture/API_ARCHITECTURE_DECISION.md)
- [API Documentation](docs/core/API.md)
- [Style Guide](docs/core/STYLE_GUIDE.md)
- [Deployment Guide](docs/core/DEPLOYMENT.md)
- [Image Guidelines](docs/core/IMAGE_GUIDELINES.md)

## 🤝 Contributing

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.