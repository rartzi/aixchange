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
      tags: ['image-generation', 'ai-art', 'creative'],
      isPublished: true,
      metadata: {
        category: 'cv',
        provider: 'OpenAI',
        launchUrl: 'https://example.com/image-generator',
        tokenCost: 100,
        imageUrl: '/placeholder-image.jpg',
        resourceConfig: {
          cpu: '2 cores',
          memory: '4GB',
          storage: '10GB',
          gpu: 'T4',
        },
        status: 'ACTIVE',
      },
    },
    {
      title: 'Language Translation Bot',
      description: 'Translate text between multiple languages with high accuracy',
      tags: ['translation', 'nlp', 'language'],
      isPublished: true,
      metadata: {
        category: 'nlp',
        provider: 'Google',
        launchUrl: 'https://example.com/translator',
        tokenCost: 50,
        imageUrl: '/placeholder-image.jpg',
        resourceConfig: {
          cpu: '1 core',
          memory: '2GB',
          storage: '5GB',
          gpu: '',
        },
        status: 'ACTIVE',
      },
    },
    {
      title: 'Sentiment Analysis Tool',
      description: 'Analyze text sentiment for customer feedback and social media',
      tags: ['sentiment', 'nlp', 'analytics'],
      isPublished: true,
      metadata: {
        category: 'nlp',
        provider: 'AWS',
        launchUrl: 'https://example.com/sentiment',
        tokenCost: 75,
        imageUrl: '/placeholder-image.jpg',
        resourceConfig: {
          cpu: '1 core',
          memory: '2GB',
          storage: '5GB',
          gpu: '',
        },
        status: 'ACTIVE',
      },
    },
    {
      title: 'Object Detection API',
      description: 'Detect and classify objects in images and video streams',
      tags: ['computer-vision', 'object-detection', 'ml'],
      isPublished: true,
      metadata: {
        category: 'cv',
        provider: 'Microsoft',
        launchUrl: 'https://example.com/object-detection',
        tokenCost: 150,
        imageUrl: '/placeholder-image.jpg',
        resourceConfig: {
          cpu: '4 cores',
          memory: '8GB',
          storage: '20GB',
          gpu: 'V100',
        },
        status: 'ACTIVE',
      },
    },
    {
      title: 'Text Generation Model',
      description: 'Generate human-like text for various applications',
      tags: ['text-generation', 'nlp', 'creative'],
      isPublished: true,
      metadata: {
        category: 'ml',
        provider: 'Anthropic',
        launchUrl: 'https://example.com/text-gen',
        tokenCost: 200,
        imageUrl: '/placeholder-image.jpg',
        resourceConfig: {
          cpu: '8 cores',
          memory: '16GB',
          storage: '50GB',
          gpu: 'A100',
        },
        status: 'ACTIVE',
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