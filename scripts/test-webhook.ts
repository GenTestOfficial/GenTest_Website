import { Webhook } from 'svix';
import { PrismaClient } from '@prisma/client';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

async function testWebhook() {
  try {
    // Create a test webhook event
    const testEvent = {
      type: 'user.created',
      data: {
        id: 'test-user-456',
        email_addresses: [{
          id: 'test-email-id',
          email_address: 'test@example.com',
          object: 'email_address',
          verification: { status: 'verified' },
          linked_to: []
        }],
        created_at: Date.now(),
        updated_at: Date.now(),
      },
      object: 'event',
    };

    // Create a new Svix instance
    const wh = new Webhook(webhookSecret!);

    // Sign the event
    const signedEvent = wh.sign(
      'test-id',
      new Date(),
      JSON.stringify(testEvent)
    );

    // Make a request to our webhook endpoint
    const response = await fetch('http://localhost:3000/api/webhooks/clerk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'svix-id': 'test-id',
        'svix-timestamp': Date.now().toString(),
        'svix-signature': signedEvent,
      },
      body: JSON.stringify(testEvent),
    });

    console.log('Webhook response status:', response.status);
    const data = await response.json();
    console.log('Webhook response:', data);

    // Check if the user was created in the database
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: { id: 'test-user-456' },
    });
    console.log('User in database:', user);

    // Clean up
    await prisma.user.delete({
      where: { id: 'test-user-456' },
    });
    console.log('Cleaned up test user');

  } catch (error) {
    console.error('Error testing webhook:', error);
  }
}

testWebhook(); 