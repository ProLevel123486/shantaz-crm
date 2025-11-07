# Database Setup Guide

## Prerequisites
You need PostgreSQL installed on your system.

### macOS Installation
```bash
# Install PostgreSQL using Homebrew
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify installation
psql --version
```

### Alternative: Using Docker
```bash
# Pull PostgreSQL image
docker pull postgres:15

# Run PostgreSQL container
docker run --name shantaz-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=shantaz_db \
  -p 5432:5432 \
  -d postgres:15

# Verify container is running
docker ps
```

## Database Creation

### Option 1: Using Homebrew PostgreSQL
```bash
# Connect to PostgreSQL
psql postgres

# In psql console, create database and user
CREATE DATABASE shantaz_db;
CREATE USER shantaz_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE shantaz_db TO shantaz_user;
\q
```

### Option 2: Using Docker PostgreSQL
The database is already created when you run the container with `POSTGRES_DB=shantaz_db`.

## Update Environment Variables

Update your `.env` file with the correct database connection string:

### For Homebrew PostgreSQL:
```env
DATABASE_URL="postgresql://shantaz_user:your_secure_password@localhost:5432/shantaz_db?schema=public"
```

### For Docker PostgreSQL:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/shantaz_db?schema=public"
```

## Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init

# Seed the database with initial data
npx prisma db seed

# Open Prisma Studio to view data
npx prisma studio
```

## Default Users

After seeding, you can login with these accounts:

### Super Admin
- **Email:** admin@shantaz.com
- **Password:** Admin@123
- **Access:** All organizations

### SHANTAZ SERVICE & SALES Admin
- **Email:** admin@shantazservice.com
- **Password:** Admin@123

### SHANTAZ L-1 Admin
- **Email:** admin@shantazl1.com
- **Password:** Admin@123

### Sales User
- **Email:** sales@shantazservice.com
- **Password:** Admin@123

### Service User
- **Email:** service@shantazservice.com
- **Password:** Admin@123

## Troubleshooting

### Connection Issues
```bash
# Check if PostgreSQL is running
brew services list  # For Homebrew
# OR
docker ps  # For Docker

# Test connection
psql -h localhost -U postgres -d shantaz_db
```

### Reset Database
```bash
# Reset entire database
npx prisma migrate reset

# This will:
# 1. Drop the database
# 2. Create a new database
# 3. Apply all migrations
# 4. Run seed script
```

### View Database Schema
```bash
# Open Prisma Studio (GUI)
npx prisma studio

# Or connect with psql
psql postgresql://postgres:password@localhost:5432/shantaz_db
```
