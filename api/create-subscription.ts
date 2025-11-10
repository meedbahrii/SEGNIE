import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { withSession, requireAuth, handleCORS } from './_middleware';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCORS(req, res)) return;
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe is not configured' });
    }

    await withSession(req, res);

    if (!requireAuth(req, res)) return;

    const userId = req.session.userId!;
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isPremium && user.stripeSubscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId, {
        expand: ['latest_invoice.payment_intent']
      });
      
      if (subscription.status === 'active' || subscription.status === 'trialing') {
        const invoice = subscription.latest_invoice as Stripe.Invoice;
        const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;
        
        return res.json({
          subscriptionId: subscription.id,
          clientSecret: paymentIntent?.client_secret || null,
        });
      }
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: {
          userId: user.id,
          username: user.username,
        },
      });
      customerId = customer.id;
      await storage.updateUser(user.id, { stripeCustomerId: customerId });
    }

    const priceId = process.env.STRIPE_PRICE_ID || await (async () => {
      const price = await stripe.prices.create({
        currency: 'usd',
        unit_amount: 999,
        recurring: {
          interval: 'month',
        },
        product_data: {
          name: 'SaveTo Premium',
          description: 'Unlimited saves and premium features',
        },
      });
      return price.id;
    })();

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    await storage.updateUser(user.id, {
      stripeSubscriptionId: subscription.id,
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
}
