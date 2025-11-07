# Quick Start Guide

## 🚀 Getting Started

### 1. Install PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Or use Docker:**
```bash
docker run --name shantaz-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=shantaz_db \
  -p 5432:5432 \
  -d postgres:15
```

### 2. Run Setup Script

```bash
chmod +x setup.sh
./setup.sh
```

This will:
- ✅ Create the database
- ✅ Run migrations
- ✅ Seed initial data
- ✅ Generate Prisma client

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Login

**Super Admin:**
- Email: `admin@shantaz.com`
- Password: `Admin@123`

**Organization Admin (SHANTAZ SERVICE):**
- Email: `admin@shantazservice.com`
- Password: `Admin@123`

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack

# Database
npx prisma studio    # Open database GUI
npx prisma generate  # Generate Prisma client
npx prisma migrate dev # Run migrations
npx prisma db seed   # Seed database

# Production
npm run build        # Build for production
npm run start        # Start production server
```

## 🗄️ Database Schema

The platform includes:
- **Organizations** - Multi-tenant setup (3 organizations)
- **Users** - Role-based access control
- **CRM** - Leads, Contacts, Accounts, Deals
- **Service** - Service Requests, Installations
- **Contracts** - Contract management with e-signatures
- **Inventory** - Items, Serial Numbers
- **Books** - Quotes, Sales Orders, Invoices, Purchase Orders, Bills
- **Activities** - Tasks, Meetings, Comments, Notifications

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard pages
│   │   ├── leads/
│   │   ├── contacts/
│   │   ├── service-requests/
│   │   └── ...
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── layout/           # Layout components
│   └── providers/        # Context providers
├── lib/
│   ├── auth.ts           # NextAuth config
│   ├── db.ts             # Prisma client
│   └── utils.ts          # Utilities
└── types/                # TypeScript types
```

## 🔐 Environment Variables

Copy `.env.example` to `.env` and update:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/shantaz_db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## 📚 Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js v5
- **UI:** Tailwind CSS + shadcn/ui
- **State:** Zustand + TanStack Query
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts + Chart.js

## 🐛 Troubleshooting

**Database connection failed:**
```bash
# Check PostgreSQL is running
brew services list  # macOS
docker ps          # Docker

# Verify connection
psql -h localhost -U postgres -d shantaz_db
```

**Port 3000 already in use:**
```bash
# Use different port
npm run dev -- -p 3001
```

**Prisma errors:**
```bash
# Reset and regenerate
npx prisma generate
npx prisma migrate reset
```

## 📖 Documentation

- [Full README](README.md) - Complete documentation
- [Database Setup](DATABASE_SETUP.md) - Detailed database guide
- [API Documentation](docs/API.md) - API reference (coming soon)

## 🎯 Next Steps

1. ✅ Complete authentication flow
2. ✅ Build CRM modules (Leads, Contacts, Accounts)
3. 🔄 Implement Service Request workflow
4. 🔄 Add Installation management
5. 🔄 Build Contract management
6. 🔄 Integrate WhatsApp API
7. 🔄 Add reporting & analytics

## 🤝 Support

For issues or questions, refer to:
- README.md for detailed information
- DATABASE_SETUP.md for database help
- Check TypeScript errors with `npm run build`

---

**Happy coding! 🎉**
