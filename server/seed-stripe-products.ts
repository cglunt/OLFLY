import { getUncachableStripeClient } from './stripeClient';

async function createProducts() {
  console.log('Creating Stripe products...');
  
  const stripe = await getUncachableStripeClient();

  const existingProducts = await stripe.products.search({ query: "name:'Olfly Plus'" });
  if (existingProducts.data.length > 0) {
    console.log('Olfly Plus product already exists:', existingProducts.data[0].id);
    const prices = await stripe.prices.list({ product: existingProducts.data[0].id, active: true });
    console.log('Existing prices:', prices.data.map(p => ({ id: p.id, amount: p.unit_amount })));
    return;
  }

  const product = await stripe.products.create({
    name: 'Olfly Plus',
    description: 'Premium olfactory training features including progress analytics, personalized training plans, and priority support.',
    metadata: {
      plan: 'plus',
    },
  });
  console.log('Created product:', product.id);

  const monthlyPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 699,
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: {
      plan: 'plus',
      interval: 'monthly',
    },
  });
  console.log('Created monthly price:', monthlyPrice.id, '- $6.99/month');

  console.log('\n=== Stripe Products Created ===');
  console.log('Product ID:', product.id);
  console.log('Price ID:', monthlyPrice.id);
  console.log('\nUse this price ID for checkout.');
}

createProducts().catch(console.error);
