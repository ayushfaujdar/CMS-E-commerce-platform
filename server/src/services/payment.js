// Payment gateway abstraction.
// Currently a stub that simulates a successful charge. Swap the implementation
// here (or branch on PAYMENT_PROVIDER) to integrate Stripe / Razorpay once real
// API keys are provided via environment variables.

export async function charge({ amount, currency = 'INR', method = 'stub' }) {
  const provider = process.env.PAYMENT_PROVIDER || 'stub';

  if (provider === 'stub') {
    return {
      success: true,
      id: `stub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      status: 'paid',
      provider: 'stub',
      amount,
      currency,
      method,
    };
  }

  // Placeholder for real providers.
  throw new Error(`Payment provider "${provider}" is not configured`);
}
