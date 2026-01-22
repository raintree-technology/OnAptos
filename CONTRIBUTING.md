# Contributing to On Aptos

Thank you for considering contributing to On Aptos! This document provides guidelines and setup instructions for contributors.

## Quick Start

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/on-aptos.git`
3. Install dependencies: `bun install`
4. Copy environment file: `cp .env.example .env`
5. Add required API keys to `.env` (see below)
6. Start development: `bun dev`

## Environment Setup

### Required API Keys

To run the project locally, you need these API keys:

1. **CoinMarketCap API** (Required for price data)
   - Sign up at [coinmarketcap.com/api](https://coinmarketcap.com/api/)
   - Free tier available
   - Add to `.env`: `CMC_API_KEY=your_key`

2. **RWA API** (Required for RWA data)
   - Contact RWA.xyz for API access
   - Add to `.env`: `RWA_API_KEY=your_key`

### Optional API Keys

3. **Aptos Build Secret** (Optional - for better rate limits)
   - Get from [developers.aptoslabs.com](https://developers.aptoslabs.com/)
   - Add to `.env`: `APTOS_BUILD_SECRET=your_key`

4. **Panora API** (Optional - public key used by default)
   - Leave empty to use the public key
   - Add to `.env` only if you have a private key: `PANORA_API_KEY=your_key`

### Customization

All branding and developer attribution is configurable via environment variables:

```env
NEXT_PUBLIC_SITE_NAME=On Aptos
NEXT_PUBLIC_DEVELOPER_NAME=Your Name
NEXT_PUBLIC_DEVELOPER_EMAIL=your@email.com
NEXT_PUBLIC_DEVELOPER_WEBSITE=https://yoursite.com
NEXT_PUBLIC_DEVELOPER_GITHUB=https://github.com/yourusername/on-aptos
```

See `.env.example` for all available options.

## Development Workflow

### Code Style

We use Biome for linting and formatting:

```bash
bun run lint      # Check for issues
bun run lint:fix  # Auto-fix issues
```

### Type Safety

Always maintain type safety:

```bash
bun run typecheck # Run TypeScript compiler
```

### Testing

Run tests before submitting PRs:

```bash
bun run test
```

### Git Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes with clear, atomic commits:
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve issue with..."
   ```

3. Keep your fork updated:
   ```bash
   git remote add upstream https://github.com/original-owner/on-aptos.git
   git fetch upstream
   git rebase upstream/main
   ```

4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a Pull Request on GitHub

## Project Structure

```
on-aptos/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── markets/           # Market pages (tokens, stables, btc, rwas)
│   ├── protocols/         # Protocol pages (defi, yields, lst)
│   └── tools/             # Tools (portfolio)
├── components/            # React components
│   ├── layout/           # Layout components (header, footer)
│   ├── pages/            # Page-specific components
│   ├── shared/           # Shared/reusable components
│   └── ui/               # UI primitives
├── lib/                   # Core business logic
│   ├── config/           # Configuration files
│   ├── constants/        # Constants and definitions
│   ├── hooks/            # React hooks
│   ├── protocols/        # DeFi protocol adapters
│   ├── services/         # API services
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
└── public/               # Static assets
```

## Configuration Architecture

The project uses a layered configuration system:

1. **Environment Variables** (`.env`)
   - API keys and secrets
   - Site-specific settings
   - Optional branding/attribution

2. **Static Configuration** (`lib/config/`)
   - `site.ts` - Site metadata and developer info (reads from env)
   - `app.ts` - Application runtime config
   - `tokens/` - Token definitions
   - `protocols/` - Protocol configurations

3. **Constants** (`lib/constants/`)
   - Known addresses
   - Protocol definitions
   - Network configurations

## Adding New Features

### Adding a New Token

1. Add token definition to `lib/config/tokens/`
2. Update token service in `lib/services/asset-types/`
3. Add UI components in `components/pages/markets/`
4. Create page in `app/markets/`

### Adding a New Protocol

1. Define protocol in `lib/constants/aptos/protocols.ts`
2. Create adapter in `lib/protocols/definitions/`
3. Register in protocol detector
4. Add to DeFi page components

### Adding a New API Endpoint

1. Create route in `app/api/`
2. Implement service logic in `lib/services/`
3. Add types in `lib/types/`
4. Update API documentation

## Code Standards

### TypeScript

- Use explicit types over `any`
- Prefer `interface` for object shapes
- Use `type` for unions and intersections
- Export types from `/types` directory

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use TypeScript for props

### Naming Conventions

- Components: PascalCase (`TokenCard.tsx`)
- Hooks: camelCase with `use` prefix (`useTokenPrice.ts`)
- Utils: camelCase (`formatCurrency.ts`)
- Types: PascalCase (`TokenData`, `ProtocolMetrics`)
- Constants: SCREAMING_SNAKE_CASE (`API_BASE_URL`)

### File Organization

- One component per file
- Co-locate related files (component, styles, tests)
- Keep files under 300 lines (split if larger)
- Use barrel exports (`index.ts`) for cleaner imports

## API Guidelines

### Response Format

All API responses should follow this format:

```typescript
{
  success: boolean;
  data: T | null;
  error?: string;
  metadata?: {
    timestamp: string;
    cached: boolean;
  };
}
```

### Error Handling

- Use try-catch blocks
- Log errors appropriately
- Return user-friendly error messages
- Include error codes for debugging

### Caching

- Use appropriate cache headers
- Implement stale-while-revalidate
- Document cache durations
- Clear cache when necessary

## Performance

- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Lazy load components and data
- Optimize images and assets
- Monitor bundle size

## Security

- Never commit `.env` files
- Validate all user inputs
- Sanitize data before rendering
- Use environment variables for secrets
- Follow OWASP guidelines

## Getting Help

- Check existing issues before creating new ones
- Use clear, descriptive issue titles
- Provide reproduction steps for bugs
- Include system information and error messages

## License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers this project.
