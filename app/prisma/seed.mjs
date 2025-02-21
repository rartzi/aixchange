import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ANONYMOUS_USER_ID = 'anonymous-user';
const ADMIN_USER_ID = 'admin-user';

// Available images in external-images/solutions with descriptive mapping
const solutionImages = {
  aiImageGenerator: 'promptpilot.png',
  translationBot: 'n8n-workflow-engine.png',
  sentimentAnalysis: 'dominodata-rag-chatbot--query-only-.png',
  objectDetection: 'flowise-builder.png',
  textGeneration: 'dominodata-rag-knowledgebase-manager.png'
};

// Function to generate random rating data
const getRandomRatingData = () => {
  const rating = Math.random() * 5; // Random rating between 0 and 5
  const totalVotes = Math.floor(Math.random() * 100) + 1; // 1 to 100 votes
  const upvotePercentage = 0.5 + (rating / 10); // Higher rating means more upvotes
  const upvotes = Math.floor(totalVotes * upvotePercentage);
  const downvotes = totalVotes - upvotes;

  return {
    rating: parseFloat(rating.toFixed(1)),
    totalVotes,
    upvotes,
    downvotes
  };
};

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { id: ADMIN_USER_ID },
    update: {},
    create: {
      id: ADMIN_USER_ID,
      email: 'admin@aixchange.ai',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', adminUser);

  // Create anonymous user if it doesn't exist
  const anonymousUser = await prisma.user.upsert({
    where: { id: ANONYMOUS_USER_ID },
    update: {},
    create: {
      id: ANONYMOUS_USER_ID,
      email: 'anonymous@aixchange.ai',
      name: 'Anonymous User',
      role: 'USER',
    },
  });

  console.log('Anonymous user created:', anonymousUser);

  // Create test solutions
  const solutions = [
    {
      title: 'AI Image Generator',
      description: 'Generate stunning images using state-of-the-art AI models',
      category: 'Computer Vision',
      provider: 'OpenAI',
      launchUrl: 'https://example.com/image-generator',
      tokenCost: 100,
      status: 'ACTIVE',
      imageUrl: `/images/${solutionImages.aiImageGenerator}`,
      tags: ['image-generation', 'ai-art', 'creative'],
      isPublished: true,
      ...getRandomRatingData(),
      metadata: {
        resourceConfig: {
          cpu: '2 cores',
          memory: '4GB',
          storage: '10GB',
          gpu: 'T4',
        },
        apiEndpoints: [
          {
            path: '/api/generate',
            method: 'POST',
            description: 'Generate an image from text prompt',
          }
        ],
      },
    },
    {
      title: 'Language Translation Bot',
      description: 'Translate text between multiple languages with high accuracy',
      category: 'Natural Language Processing',
      provider: 'Google',
      launchUrl: 'https://example.com/translator',
      tokenCost: 50,
      status: 'ACTIVE',
      imageUrl: `/images/${solutionImages.translationBot}`,
      tags: ['translation', 'nlp', 'language'],
      isPublished: true,
      ...getRandomRatingData(),
      metadata: {
        resourceConfig: {
          cpu: '1 core',
          memory: '2GB',
          storage: '5GB',
        },
        apiEndpoints: [
          {
            path: '/api/translate',
            method: 'POST',
            description: 'Translate text between languages',
          }
        ],
      },
    },
    {
      title: 'Sentiment Analysis Tool',
      description: 'Analyze text sentiment for customer feedback and social media',
      category: 'Natural Language Processing',
      provider: 'AWS',
      launchUrl: 'https://example.com/sentiment',
      tokenCost: 75,
      status: 'ACTIVE',
      imageUrl: `/images/${solutionImages.sentimentAnalysis}`,
      tags: ['sentiment', 'nlp', 'analytics'],
      isPublished: true,
      ...getRandomRatingData(),
      metadata: {
        resourceConfig: {
          cpu: '1 core',
          memory: '2GB',
          storage: '5GB',
        },
        apiEndpoints: [
          {
            path: '/api/analyze',
            method: 'POST',
            description: 'Analyze text sentiment',
          }
        ],
      },
    },
    {
      title: 'Object Detection API',
      description: 'Detect and classify objects in images and video streams',
      category: 'Computer Vision',
      provider: 'Microsoft',
      launchUrl: 'https://example.com/object-detection',
      tokenCost: 150,
      status: 'ACTIVE',
      imageUrl: `/images/${solutionImages.objectDetection}`,
      tags: ['computer-vision', 'object-detection', 'ml'],
      isPublished: true,
      ...getRandomRatingData(),
      metadata: {
        resourceConfig: {
          cpu: '4 cores',
          memory: '8GB',
          storage: '20GB',
          gpu: 'V100',
        },
        apiEndpoints: [
          {
            path: '/api/detect',
            method: 'POST',
            description: 'Detect objects in images',
          }
        ],
      },
    },
    {
      title: 'Text Generation Model',
      description: 'Generate human-like text for various applications',
      category: 'Machine Learning',
      provider: 'Anthropic',
      launchUrl: 'https://example.com/text-gen',
      tokenCost: 200,
      status: 'ACTIVE',
      imageUrl: `/images/${solutionImages.textGeneration}`,
      tags: ['text-generation', 'nlp', 'creative'],
      isPublished: true,
      ...getRandomRatingData(),
      metadata: {
        resourceConfig: {
          cpu: '8 cores',
          memory: '16GB',
          storage: '50GB',
          gpu: 'A100',
        },
        apiEndpoints: [
          {
            path: '/api/generate',
            method: 'POST',
            description: 'Generate text from prompt',
          }
        ],
      },
    },
  ];

  for (const solution of solutions) {
    await prisma.solution.create({
      data: {
        ...solution,
        author: {
          connect: { id: ANONYMOUS_USER_ID },
        },
      },
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });