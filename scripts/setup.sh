#!/usr/bin/env bash
# Setup script for On Aptos development environment

set -e

echo "🚀 Setting up On Aptos development environment..."
echo ""

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Please install it first:"
    echo "   curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

echo "✅ Bun found: $(bun --version)"
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists. Skipping environment setup."
    echo "   Delete .env if you want to start fresh."
else
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: You need to add API keys to .env:"
    echo ""
    echo "   Required:"
    echo "   - CMC_API_KEY      (from coinmarketcap.com/api)"
    echo "   - RWA_API_KEY      (contact RWA.xyz)"
    echo ""
    echo "   Optional (for better rate limits):"
    echo "   - APTOS_BUILD_SECRET"
    echo "   - PANORA_API_KEY"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
bun install
echo "✅ Dependencies installed"
echo ""

# Check for API keys
if grep -q "CMC_API_KEY=$" .env && grep -q "RWA_API_KEY=$" .env; then
    echo "⚠️  WARNING: API keys are not set in .env"
    echo "   The app will start but API calls may fail."
    echo ""
    echo "   Edit .env and add your API keys, then restart the dev server."
    echo ""
fi

echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Add API keys to .env (if not done already)"
echo "  2. Optionally customize branding in .env"
echo "  3. Run: bun dev"
echo ""
echo "For more information, see:"
echo "  - README.md for quick start"
echo "  - CONTRIBUTING.md for detailed setup"
echo "  - .env.example for all configuration options"
echo ""
