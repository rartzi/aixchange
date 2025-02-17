# AIXchange Platform

AIXchange is a modern platform for discovering, sharing, and implementing AI solutions. This repository contains the source code for the AIXchange web application.

## Features

- 🎨 Modern UI with Light/Dark theme support
- 🔒 Secure authentication system
- 🏪 AI Solutions marketplace
- 🎮 Interactive AI playground
- 🤝 Community-driven platform
- 📱 Responsive design

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom theme system
- **Authentication**: NextAuth.js
- **Database**: Prisma with PostgreSQL
- **State Management**: React Context
- **Testing**: Jest and React Testing Library
- **Deployment**: Docker and Docker Compose

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn

### Docker Deployment (Recommended)

1. Prerequisites:
   - Docker Engine 24.0+
   - Docker Compose V2
   - Git

2. Clone the repository:
```bash
git clone https://github.com/yourusername/aixchange.git
cd aixchange/app
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your configuration.

4. Build and start the containers:
```bash
# Make sure you're in the app directory
docker compose up -d
```

5. Run database migrations:
```bash
docker compose exec app npx prisma migrate deploy
```

The application will be available at `http://localhost:3000`.

### Manual Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aixchange.git
cd aixchange/app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration.

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

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
│   ├── lib/                # Utility functions and configurations
│   └── types/              # TypeScript type definitions
├── prisma/                 # Database schema and migrations
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile             # Docker container definition
└── public/                # Static assets
```

## Theme System

The application uses a custom theme system built with CSS variables and Tailwind CSS:

- Light/Dark mode support
- CSS custom properties for colors
- Tailwind CSS for utility classes
- Smooth transitions between themes
- Persistent theme preference

### Theme Configuration

Colors are defined using RGB values for better opacity support:

```css
:root {
  --background: 246 247 251;
  --foreground: 15 23 42;
  --primary: 79 70 229;
  /* ... other colors */
}
```

### Usage

```tsx
// Using theme colors in components
<div className="bg-background text-foreground">
  <button className="btn-primary">Click me</button>
</div>
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We follow the conventional commits specification:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build process or auxiliary tool changes

## Documentation

Additional documentation can be found in the `docs` directory:

- [Architecture Decision Records](docs/core/architecture/)
- [Development Guide](docs/core/DEVELOPMENT.md)
- [Style Guide](docs/core/STYLE_GUIDE.md)
- [Deployment Guide](docs/core/DEPLOYMENT.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.