# GrantFinder

Find UK business grants matched to your company profile.

## Features

- **User Authentication** - Sign up and sign in with email/password
- **Companies House Integration** - Search and link your company to auto-populate SIC codes, industry classification, and business profile
- **Multi-Source Grant Search** - Search across UKRI Gateway to Research and Data.gov.uk simultaneously
- **Smart Matching** - Get personalised grant recommendations based on your company's SIC codes and industry sector
- **Save & Track** - Bookmark interesting grants for later review
- **Extensible Provider Architecture** - Easily add new grant data sources (paid or free) via the pluggable provider pattern

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js v5 (Auth.js) with credentials provider
- **External APIs**: Companies House API, UKRI Gateway to Research, Data.gov.uk

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Companies House API key ([register here](https://developer.company-information.service.gov.uk/))

### Setup

1. Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd grantfinder
npm install
```

2. Copy the environment file and fill in your values:

```bash
cp .env.example .env.local
```

3. Set up the database:

```bash
npx prisma migrate dev
npx prisma db seed
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── (auth)/             # Auth pages (sign-in, sign-up)
│   ├── (dashboard)/        # Protected pages (dashboard, search, grants, company, settings)
│   └── api/                # API routes (auth, company, grants, user)
├── components/             # React components
│   ├── ui/                 # Reusable UI components (button, input, card, badge, etc.)
│   ├── layout/             # Layout components (navbar, sidebar)
│   ├── auth/               # Auth forms
│   ├── company/            # Company search and profile components
│   ├── grants/             # Grant search, list, card, and detail components
│   └── dashboard/          # Dashboard widgets
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities, constants, validation schemas
├── services/               # External API service layer
│   ├── companies-house/    # Companies House API client
│   └── grants/             # Grant provider registry and providers
│       └── providers/      # Individual grant source implementations
└── types/                  # TypeScript type definitions
```

## Adding a New Grant Provider

1. Create a new file in `src/services/grants/providers/`
2. Implement the `GrantProvider` interface from `src/services/grants/types.ts`
3. Register it in `src/services/grants/index.ts`:

```typescript
grantRegistry.register(new YourNewProvider());
```

No changes to API routes or UI components are needed.

## External APIs

| API | Auth | Rate Limit | Cost |
|-----|------|------------|------|
| Companies House | API Key (Basic Auth) | 600 req / 5 min | Free |
| UKRI Gateway to Research | None | Unlimited | Free |
| Data.gov.uk | None | Unlimited | Free |
