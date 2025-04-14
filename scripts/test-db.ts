import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Try to create a test user
    const user = await prisma.user.create({
      data: {
        id: 'test-user-123',
        tier: 'free',
        token_usage: 0,
        token_limit: 4000,
      },
    });
    console.log('Successfully created test user:', user);

    // Try to read the user back
    const readUser = await prisma.user.findUnique({
      where: { id: 'test-user-123' },
    });
    console.log('Successfully read test user:', readUser);

    // Clean up
    await prisma.user.delete({
      where: { id: 'test-user-123' },
    });
    console.log('Successfully cleaned up test user');
  } catch (error) {
    console.error('Error testing database connection:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 