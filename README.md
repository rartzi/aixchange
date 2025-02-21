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

### Local Development

1. Clone and install dependencies:
```bash
git clone https://github.com/yourusername/(ai)xchange.git
cd (ai)xchange/app
npm install
```

2. Configure environment:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. Create external images directory:
```bash
mkdir -p external-images/solutions external-images/profiles
```

4. Initialize database:
```bash
# For PostgreSQL
npx prisma migrate dev

# For SQLite (alternative for local development)
# Set DATABASE_URL="file:./dev.db" in .env.local
npx prisma migrate dev
```

5. Start development server:
```bash
npm run dev
```

Visit `http://localhost:3000`

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