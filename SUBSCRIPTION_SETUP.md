# Subscription System Setup Guide

This guide will help you set up the Lemon Squeezy subscription system for GrantFinder.

## Overview

The subscription system includes:
- **3 Plans**: Free, Starter (£29/mo), Professional (£99/mo)
- **Feature Gating**: Automatic enforcement of search and save limits
- **Billing Portal**: Users can manage subscriptions via Lemon Squeezy's portal
- **Webhooks**: Automatic synchronization of subscription status

## Prerequisites

1. A Lemon Squeezy account ([sign up here](https://lemonsqueezy.com))
2. PostgreSQL database set up
3. Node.js and npm installed

## Step 1: Create Products in Lemon Squeezy

1. **Log in to Lemon Squeezy Dashboard**
   - Go to [app.lemonsqueezy.com](https://app.lemonsqueezy.com)

2. **Create Your Store** (if you haven't already)
   - Navigate to Settings → Stores
   - Create a new store or select an existing one
   - Note your **Store ID** (you'll need this later)

3. **Create Products**

   Create two subscription products:

   **Starter Plan:**
   - Name: "Starter"
   - Price: £29/month
   - Billing: Recurring monthly
   - After creating, note the **Variant ID**

   **Professional Plan:**
   - Name: "Professional"
   - Price: £99/month
   - Billing: Recurring monthly
   - After creating, note the **Variant ID**

4. **Get Your API Key**
   - Go to Settings → API
   - Create a new API key
   - Copy and save it securely

5. **Set Up Webhook**
   - Go to Settings → Webhooks
   - Click "+" to add a new webhook
   - URL: `https://your-domain.com/api/webhooks/lemonsqueezy`
     - For local development: Use [ngrok](https://ngrok.com) or similar to expose localhost
   - Events to subscribe to:
     - `subscription_created`
     - `subscription_updated`
     - `subscription_cancelled`
     - `subscription_expired`
     - `subscription_resumed`
     - `subscription_paused`
     - `subscription_unpaused`
   - Copy the **Signing Secret** that's generated

## Step 2: Configure Environment Variables

Update your `.env` file with the following:

```env
# Lemon Squeezy Configuration
LEMONSQUEEZY_API_KEY="your-api-key-here"
LEMONSQUEEZY_STORE_ID="your-store-id"
LEMONSQUEEZY_WEBHOOK_SECRET="your-webhook-signing-secret"
LEMONSQUEEZY_STARTER_VARIANT_ID="starter-variant-id"
LEMONSQUEEZY_PROFESSIONAL_VARIANT_ID="professional-variant-id"
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # Change to your production URL when deploying
```

**Where to find these values:**
- **API Key**: Settings → API
- **Store ID**: Settings → Stores (numeric ID in URL or dashboard)
- **Webhook Secret**: Settings → Webhooks (shown after creating webhook)
- **Variant IDs**: Products → [Product Name] → Variants section

## Step 3: Run Database Migration

The subscription tables need to be added to your database:

```bash
# Generate Prisma client with new schema
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add_subscriptions

# Or if you're in production
npx prisma migrate deploy
```

This will create the following tables:
- `Subscription` - Stores user subscription data
- Enum types: `SubscriptionPlan` and `SubscriptionStatus`

## Step 4: Test the Integration

### Local Testing with ngrok

1. **Install ngrok** (if not already installed):
   ```bash
   npm install -g ngrok
   ```

2. **Start your Next.js development server**:
   ```bash
   npm run dev
   ```

3. **In a new terminal, start ngrok**:
   ```bash
   ngrok http 3000
   ```

4. **Update webhook URL** in Lemon Squeezy:
   - Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
   - Update webhook in Lemon Squeezy to: `https://abc123.ngrok.io/api/webhooks/lemonsqueezy`

5. **Test subscription flow**:
   - Navigate to `/pricing` in your app
   - Click "Get Started" on a paid plan
   - Complete checkout with test card: `4242 4242 4242 4242`
   - Verify webhook is received and subscription is created

### Verify Database

Check that the subscription was created:

```bash
npx prisma studio
```

Look in the `Subscription` table to see the new record.

## Step 5: Configure Test Mode

Lemon Squeezy has a test mode for development:

1. Enable test mode in Lemon Squeezy dashboard (toggle at top of screen)
2. All test transactions are free and won't charge real cards
3. Use test card: `4242 4242 4242 4242` with any future expiry date

## Features Included

### 1. **Pricing Page** (`/pricing`)
- Displays all available plans
- Allows users to subscribe to paid plans
- Shows current plan status

### 2. **Billing Page** (`/billing`)
- View current subscription details
- See usage statistics (searches, saved grants)
- Manage subscription (cancel, update payment method)
- Visual progress bars for usage limits

### 3. **Feature Gating**

Automatically enforced limits:

| Feature | Free | Starter | Professional |
|---------|------|---------|--------------|
| Searches/month | 5 | 50 | Unlimited |
| Saved Grants | 10 | Unlimited | Unlimited |

When users hit limits, they see upgrade prompts.

### 4. **Subscription Badge**
- Plan badge shown in navbar
- Links to billing page
- Updates automatically when plan changes

### 5. **Customer Portal**
- Users can manage their subscription through Lemon Squeezy's hosted portal
- Cancel subscriptions
- Update payment methods
- View billing history

## Customizing Plans

To modify plan features or limits, edit:

**`src/lib/lemonsqueezy.ts`**:
```typescript
export const SUBSCRIPTION_PLANS = {
  FREE: {
    // ... modify features and limits
  },
  // ... other plans
}
```

## Webhook Security

The webhook handler verifies signatures to ensure requests come from Lemon Squeezy:

- Signatures are validated using HMAC SHA256
- Invalid signatures return 401 Unauthorized
- Never expose your webhook secret

## Production Deployment

Before deploying to production:

1. **Disable Test Mode** in Lemon Squeezy
2. **Update webhook URL** to your production domain
3. **Set production environment variables**
4. **Run database migration** on production database:
   ```bash
   npx prisma migrate deploy
   ```
5. **Test end-to-end** with real card (in test mode first!)

## Troubleshooting

### Webhook not receiving events
- Check webhook URL is publicly accessible
- Verify webhook secret matches
- Check webhook logs in Lemon Squeezy dashboard
- Test with ngrok for local development

### Subscription not updating
- Check webhook is being received
- Look at server logs for errors
- Verify database connection
- Check Prisma schema is up to date

### User can't subscribe
- Verify variant IDs are correct
- Check API key has correct permissions
- Ensure store is active in Lemon Squeezy
- Check for JavaScript errors in browser console

### Limits not enforcing
- Verify subscription status in database
- Check `canPerformSearch` and `canSaveGrant` functions
- Ensure search/save APIs are calling limit checks
- Verify search history is being recorded

## Support

For Lemon Squeezy issues:
- [Lemon Squeezy Documentation](https://docs.lemonsqueezy.com)
- [Lemon Squeezy Support](https://lemonsqueezy.com/support)

For implementation issues:
- Check server logs
- Use `npx prisma studio` to inspect database
- Review webhook logs in Lemon Squeezy dashboard

## Next Steps

Consider adding:
- Email notifications for subscription events
- Annual billing options (discounted)
- Enterprise plan with custom pricing
- Trial periods (Lemon Squeezy supports this)
- Usage analytics and reporting
- Subscription metrics dashboard
