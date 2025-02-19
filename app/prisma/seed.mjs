import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ANONYMOUS_USER_ID = 'anonymous-user';

async function main() {
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
      imageUrl: '/placeholder-image.jpg',
      tags: ['image-generation', 'ai-art', 'creative'],
      isPublished: true,
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
      imageUrl: '/placeholder-image.jpg',
      tags: ['translation', 'nlp', 'language'],
      isPublished: true,
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
      imageUrl: '/placeholder-image.jpg',
      tags: ['sentiment', 'nlp', 'analytics'],
      isPublished: true,
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
      imageUrl: '/placeholder-image.jpg',
      tags: ['computer-vision', 'object-detection', 'ml'],
      isPublished: true,
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
      imageUrl: '/placeholder-image.jpg',
      tags: ['text-generation', 'nlp', 'creative'],
      isPublished: true,
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