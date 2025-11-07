#!/bin/bash

# Shantaz Platform Setup Script

echo "🚀 Starting Shantaz Platform Setup..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if PostgreSQL is running
echo "📊 Checking PostgreSQL connection..."
if psql -h localhost -U postgres -d postgres -c '\q' 2>/dev/null; then
    echo -e "${GREEN}✓ PostgreSQL is running${NC}"
else
    echo -e "${RED}✗ PostgreSQL is not running${NC}"
    echo ""
    echo "Please start PostgreSQL first:"
    echo "  macOS: brew services start postgresql@15"
    echo "  Docker: docker run --name shantaz-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=shantaz_db -p 5432:5432 -d postgres:15"
    echo ""
    echo "See DATABASE_SETUP.md for detailed instructions."
    exit 1
fi

# Check if database exists
echo ""
echo "🗄️  Checking database..."
if psql -h localhost -U postgres -lqt | cut -d \| -f 1 | grep -qw shantaz_db; then
    echo -e "${YELLOW}⚠ Database 'shantaz_db' already exists${NC}"
    read -p "Do you want to reset it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Resetting database..."
        npx prisma migrate reset --force
    fi
else
    echo "Creating database..."
    psql -h localhost -U postgres -c "CREATE DATABASE shantaz_db;"
fi

# Generate Prisma Client
echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Run migrations
echo ""
echo "📦 Running database migrations..."
npx prisma migrate dev --name init

# Seed database
echo ""
echo "🌱 Seeding database with initial data..."
npx prisma db seed

# Install dependencies if needed
echo ""
echo "📚 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --legacy-peer-deps
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

echo ""
echo -e "${GREEN}✨ Setup complete!${NC}"
echo ""
echo "🎉 Your Shantaz platform is ready!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000"
echo ""
echo "Default login credentials:"
echo "  Email: admin@shantaz.com"
echo "  Password: Admin@123"
echo ""
echo "To view the database:"
echo "  npx prisma studio"
echo ""
