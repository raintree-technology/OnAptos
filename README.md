# On Aptos

A comprehensive blockchain analytics platform for the Aptos ecosystem, providing real-time insights into DeFi protocols, stablecoins, Bitcoin on Aptos, RWAs, and portfolio management.

## Features

- **Portfolio** - Wallet analytics with tokens, NFTs, DeFi positions, and yield opportunities
- **Tokens** - Comprehensive token analytics and market data across the Aptos ecosystem
- **Yields** - Discover and compare yield opportunities across DeFi protocols
- **Stablecoins** - Track 12+ stablecoins with supply and price metrics
- **Bitcoin** - Monitor wrapped BTC variants (aBTC, xBTC, WBTC, SBTC)
- **RWAs** - Real-world asset tokenization analytics
- **DeFi** - Protocol TVL, fees, volume, and APY tracking

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Data**: Aptos Indexer, Panora API, CoinMarketCap, RWA.xyz, DeFi Llama
- **Performance**: Virtual scrolling, PWA, code splitting, multi-tier caching

## Getting Started

### Prerequisites

- Node.js 18+ and Bun
- API keys (see below)

### Installation

#### Option 1: Automated Setup (Recommended)

```bash
git clone https://github.com/yourusername/on-aptos.git
cd on-aptos
bun run setup
```

The setup script will install dependencies and create your `.env` file.

#### Option 2: Manual Setup

1. Clone and install:

```bash
git clone https://github.com/yourusername/on-aptos.git
cd on-aptos
bun install
```

2. Configure environment:

```bash
cp .env.example .env
```

3. Add required API keys to `.env`:

```env
# Required
CMC_API_KEY=your_key           # From coinmarketcap.com/api
RWA_API_KEY=your_key           # Contact RWA.xyz for access

# Optional (for better rate limits)
APTOS_BUILD_SECRET=your_key    # From developers.aptoslabs.com
PANORA_API_KEY=your_key        # Leave empty for public key
```

4. (Optional) Customize branding in `.env`:

```env
NEXT_PUBLIC_SITE_NAME=Your Site Name
NEXT_PUBLIC_DEVELOPER_NAME=Your Name
NEXT_PUBLIC_DEVELOPER_EMAIL=your@email.com
NEXT_PUBLIC_DEVELOPER_GITHUB=https://github.com/yourusername/your-repo
# See .env.example for all customization options
```

4. Start development:

```bash
bun dev
```

## Development

```bash
bun dev           # Start development server
bun run build     # Create production build
bun run lint      # Run linting with Biome
bun run typecheck # TypeScript checking
bun run test      # Run tests
```

## Forking & Customization

This project is designed to be easily forked and customized:

1. **Branding**: All site branding (name, description, developer info) is controlled via environment variables in `.env`
2. **Configuration**: Core configs are in `lib/config/`:
   - `site.ts` - Site and developer settings
   - `app.ts` - Application configuration
   - `tokens/` - Token definitions and metadata
   - `protocols/` - DeFi protocol configurations
3. **Styling**: Customize colors and themes in `tailwind.config.ts` and `app/globals.css`
4. **No hardcoded personal info**: All attribution is environment-based

To fully customize your fork:
- Update `.env` with your information (see `.env.example`)
- Replace `public/favicon.ico` and `public/og-image.png` with your branding
- Update `package.json` name, description, and repository URLs
- Modify color schemes in Tailwind config

## Security

Multi-layer security with automated secret detection, pre-commit hooks, and CI/CD scanning. See `.github/SECURITY_SETUP.md` for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- Issues: [GitHub Issues](https://github.com/yourusername/on-aptos/issues)
- Community: [Discord](https://discord.gg/aptos)
