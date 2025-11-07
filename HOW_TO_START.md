# 🚀 Getting Your Shantaz Platform Running

## Step-by-Step Guide to Start the Application

### Step 1: Install PostgreSQL

Choose one option:

**Option A: Homebrew (Recommended for macOS)**
```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify it's running
brew services list | grep postgresql
```

**Option B: Docker (Alternative)**
```bash
# Run PostgreSQL in Docker
docker run --name shantaz-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=shantaz_db \
  -p 5432:5432 \
  -d postgres:15

# Verify container is running
docker ps
```

### Step 2: Initialize the Database

**Automated (Recommended):**
```bash
cd "/Users/jash/SHANTAZ PVT LTD"
chmod +x setup.sh
./setup.sh
```

**Manual (if automated fails):**
```bash
cd "/Users/jash/SHANTAZ PVT LTD"

# Generate Prisma Client
npx prisma generate

# Run migrations (creates all tables)
npx prisma migrate dev --name init

# Seed database with initial data
npx prisma db seed
```

### Step 3: Start the Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 15.0.3
- Local:        http://localhost:3000
- Experiments (use with caution):
  · turbotrace
```

### Step 4: Open in Browser

Navigate to: **http://localhost:3000**

You'll be redirected to the login page.

### Step 5: Login

Use these credentials:

**Super Admin (Full Access):**
- Email: `admin@shantaz.com`
- Password: `Admin@123`

**Other Test Users:**
- `admin@shantazservice.com` / `Admin@123` (SHANTAZ SERVICE admin)
- `sales@shantazservice.com` / `Admin@123` (Sales user)
- `service@shantazservice.com` / `Admin@123` (Service user)

### Step 6: Explore the Dashboard

After login, you'll see:
- 📊 Dashboard overview with stats
- 📋 Sidebar navigation
- 👥 CRM modules (Leads, Contacts, Accounts, Deals)
- 🔧 Service modules
- 📄 Sales modules
- 📦 Inventory
- 📋 Contracts

## 🔍 Troubleshooting

### Problem: "Can't reach database server"

**Solution:**
```bash
# Check if PostgreSQL is running
brew services list  # For Homebrew
# OR
docker ps          # For Docker

# If not running, start it
brew services start postgresql@15  # Homebrew
# OR
docker start shantaz-postgres      # Docker
```

### Problem: "Port 3000 already in use"

**Solution:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Problem: "Prisma Client not generated"

**Solution:**
```bash
npx prisma generate
```

### Problem: "Module not found" errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## 📊 View Your Database

Open Prisma Studio to see your data:
```bash
npx prisma studio
```

This opens a GUI at http://localhost:5555 where you can:
- View all tables
- Edit data directly
- See relationships
- Test queries

## 🎯 What To Do After Setup

### 1. Test Authentication
- Try logging in with different users
- Check role-based access
- Test logout functionality

### 2. Explore Existing Pages
- Dashboard home
- Leads list page
- Check navigation

### 3. Check Database
- Open Prisma Studio
- View the seeded data:
  - 3 Organizations
  - 5 Users
  - 2 Sample Items
  - 5 Serial Numbers

### 4. Start Building Features

The foundation is ready! Now you can build:

**For Leads Management:**
1. Create `/src/app/api/leads/route.ts` for API endpoints
2. Create `/src/app/dashboard/leads/new/page.tsx` for form
3. Create `/src/app/dashboard/leads/[id]/page.tsx` for details

**For Service Requests:**
1. Similar structure as Leads
2. Add WhatsApp integration
3. Implement status workflow

## 🛠️ Development Workflow

```bash
# Terminal 1: Run dev server
npm run dev

# Terminal 2: Watch database
npx prisma studio

# Terminal 3: Run commands as needed
npx prisma migrate dev  # After schema changes
npx prisma db seed      # To reseed data
```

## 📚 Quick Reference

**Key Files:**
- `/src/lib/auth.ts` - Authentication config
- `/prisma/schema.prisma` - Database schema
- `/src/app/dashboard/` - All dashboard pages
- `/.env` - Environment variables

**Useful Commands:**
```bash
npm run dev          # Start development
npm run build        # Build for production
npx prisma studio    # Open database GUI
npx prisma generate  # Generate Prisma client
npx prisma migrate dev  # Run migrations
npx prisma db seed   # Seed database
```

## 🎉 You're All Set!

Your Shantaz platform is ready for development. The authentication works, the database is structured, and the UI framework is in place.

**Next:** Start building out the CRUD operations for each module!

---

**Questions?** Check:
- `STATUS.md` - Current project status
- `README.md` - Full documentation
- `QUICKSTART.md` - Quick reference
- `DATABASE_SETUP.md` - Database help
