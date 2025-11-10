import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!stripe) {
    return res.status(500).json({ error: 'Stripe is not configured' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return res.status(400).json({ error: 'No signature' });
    }

    const event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const users = await storage.getAllUsers();
        const user = users.find(u => u.stripeCustomerId === customerId);

        if (user) {
          await storage.updateUser(user.id, {
            isPremium: subscription.status === 'active' || subscription.status === 'trialing',
            stripeSubscriptionId: subscription.id,
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const users = await storage.getAllUsers();
        const user = users.find(u => u.stripeCustomerId === customerId);

        if (user) {
          await storage.updateUser(user.id, {
            isPremium: false,
          });
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
}
