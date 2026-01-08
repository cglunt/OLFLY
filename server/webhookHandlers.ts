import { getStripeSync } from './stripeClient';
import { storage } from './storage';
import { db } from './db';
import { sql } from 'drizzle-orm';

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'This usually means express.json() parsed the body before reaching this handler. ' +
        'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    const sync = await getStripeSync();
    
    const result = await sync.processWebhook(payload, signature);
    
    if (result && result.event) {
      const event = result.event;
      console.log(`Stripe event received: ${event.type}`);

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as any;
          if (session.mode === 'subscription') {
            const customerId = session.customer as string;
            const subscriptionId = session.subscription as string;
            await this.handleSubscriptionActivated(customerId, subscriptionId);
          }
          break;
        }

        case 'customer.subscription.updated':
        case 'customer.subscription.created': {
          const subscription = event.data.object as any;
          await this.handleSubscriptionUpdate(subscription);
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as any;
          await this.handleSubscriptionCanceled(subscription.customer as string);
          break;
        }
      }
    }
  }

  static async handleSubscriptionActivated(customerId: string, subscriptionId: string): Promise<void> {
    console.log(`Subscription activated: customer=${customerId}, sub=${subscriptionId}`);
    
    const user = await storage.getUserByStripeCustomerId(customerId);
    if (!user) {
      console.log(`No user found for Stripe customer ${customerId}`);
      return;
    }

    const subscriptionResult = await db.execute(
      sql`SELECT * FROM stripe.subscriptions WHERE id = ${subscriptionId}`
    );
    const subscription = subscriptionResult.rows[0] as any;

    if (subscription) {
      const currentPeriodEnd = subscription.current_period_end 
        ? new Date(subscription.current_period_end * 1000) 
        : null;

      await storage.updateUserSubscription(user.id, {
        plan: 'plus',
        plusActive: true,
        currentPeriodEnd,
      });
      console.log(`User ${user.id} upgraded to Plus`);
    }
  }

  static async handleSubscriptionUpdate(subscription: any): Promise<void> {
    const customerId = subscription.customer as string;
    const user = await storage.getUserByStripeCustomerId(customerId);
    
    if (!user) {
      console.log(`No user found for Stripe customer ${customerId}`);
      return;
    }

    const status = subscription.status;
    const isActive = status === 'active' || status === 'trialing';
    const currentPeriodEnd = subscription.current_period_end 
      ? new Date(subscription.current_period_end * 1000) 
      : null;

    await storage.updateUserSubscription(user.id, {
      plan: isActive ? 'plus' : 'free',
      plusActive: isActive,
      currentPeriodEnd,
    });
    console.log(`User ${user.id} subscription updated: active=${isActive}`);
  }

  static async handleSubscriptionCanceled(customerId: string): Promise<void> {
    const user = await storage.getUserByStripeCustomerId(customerId);
    
    if (!user) {
      console.log(`No user found for Stripe customer ${customerId}`);
      return;
    }

    await storage.updateUserSubscription(user.id, {
      plan: 'free',
      plusActive: false,
      currentPeriodEnd: null,
    });
    console.log(`User ${user.id} subscription canceled`);
  }
}
