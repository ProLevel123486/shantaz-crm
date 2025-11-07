# Shantaz Service & Sales Platform

Enterprise-level multi-organization platform for service management, sales CRM, inventory management, and contract administration.

## 🏢 System Overview

This platform manages 3 separate organizations:
1. **SHANTAZ SERVICE & SALES** - Main CRM and service management
2. **SHANTAZ TECHNOFOODS L1** - Books Elite with inventory
3. **SHANTA G TECHNOFOODS LLP L1** - Books Elite with inventory

## 🚀 Features

### Core Modules
- ✅ Multi-Organization Management
- ✅ CRM (Leads, Contacts, Accounts, Deals)
- ✅ Service Request Management
- ✅ Installation & Dispatch Management
- ✅ Contract Management with E-Signatures
- ✅ Inventory & Books Management
- ✅ Serial Number Tracking
- ✅ WhatsApp Business Integration
- ✅ Reports & Analytics
- ✅ Workflow Automation
- ✅ Role-Based Access Control

### Key Capabilities
- **Lead Management**: Multi-source lead capture with automated workflows
- **Service Requests**: Complete lifecycle from creation to resolution
- **Installation Management**: Pre-installation checklists, team assignment, feedback
- **Contract Lifecycle**: Draft → Sign → Approve → Activate
- **Inventory Tracking**: Multi-org serial number tracking and stock management
- **WhatsApp Chatbot**: Automated service request creation via WhatsApp
- **Comprehensive Reporting**: Sales, Service, Inventory, Financial reports

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Real-time**: Socket.io
- **Email**: Nodemailer
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts, Chart.js
- **State Management**: Zustand
- **Data Fetching**: TanStack Query

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn or pnpm

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shantaz-service-sales
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   - Database URL
   - NextAuth secret
   - Email configuration
   - WhatsApp API credentials
   - Other API keys

4. **Setup database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   
   # Seed initial data
   npm run prisma:seed
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard layout and pages
│   │   ├── leads/         # Lead management
│   │   ├── contacts/      # Contact management
│   │   ├── accounts/      # Account management
│   │   ├── deals/         # Deal pipeline
│   │   ├── service/       # Service requests
│   │   ├── installation/  # Installation management
│   │   ├── contracts/     # Contract management
│   │   ├── inventory/     # Inventory management
│   │   ├── quotes/        # Quotes/Estimates
│   │   ├── sales-orders/  # Sales orders
│   │   ├── invoices/      # Invoicing
│   │   ├── reports/       # Reports & Analytics
│   │   └── settings/      # System settings
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication
│   │   ├── crm/           # CRM endpoints
│   │   ├── service/       # Service management
│   │   ├── inventory/     # Inventory endpoints
│   │   ├── whatsapp/      # WhatsApp webhooks
│   │   └── webhooks/      # External webhooks
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components (shadcn)
│   ├── forms/            # Form components
│   ├── tables/           # Data tables
│   ├── charts/           # Chart components
│   └── layouts/          # Layout components
├── lib/                  # Utility libraries
│   ├── auth.ts          # Authentication utilities
│   ├── db.ts            # Database client
│   ├── email.ts         # Email utilities
│   ├── whatsapp.ts      # WhatsApp integration
│   └── utils.ts         # Common utilities
├── types/               # TypeScript types
├── hooks/               # Custom React hooks
└── constants/           # Constants and config

prisma/
├── schema.prisma        # Database schema
├── migrations/          # Database migrations
└── seed.ts             # Seed data

public/
├── uploads/            # File uploads
└── assets/             # Static assets
```

## 🔐 Authentication & Authorization

The system uses NextAuth.js with the following roles:
- **SUPER_ADMIN**: Full system access
- **ADMIN**: Organization-level admin
- **MANAGER**: Department manager
- **SALES**: Sales team member
- **SERVICE_ENGINEER**: Service engineer
- **INSTALLATION_TEAM**: Installation team member
- **DISPATCH_TEAM**: Dispatch team member
- **PURCHASE_MANAGER**: Purchase manager
- **FINANCE**: Finance team member
- **USER**: Basic user

## 📊 Database Schema

The system uses a comprehensive PostgreSQL database with the following main entities:
- Organizations (3 orgs with isolated data)
- Users (multi-org support)
- Leads, Contacts, Accounts, Deals
- Service Requests
- Installations
- Contracts with E-Signatures
- Items/Products with Serial Numbers
- Quotes, Sales Orders, Invoices
- Purchase Orders, Bills, Payments
- Activities, Tasks, Meetings
- Notifications, Comments
- Custom Fields

## 🔄 Workflows

### Lead to Deal Conversion
```
Lead → Contacted → Qualified → Proposal → Negotiation → Deal Won
```

### Service Request Flow
```
New Request → Analysis → Video Call/On-Site → Resolution → Feedback → Closed
```

### Installation Process
```
Planning → Material Check → Dispatch → Pre-Checklist → Installation → Feedback → Closed
```

### Contract Lifecycle
```
Draft → Sent → Viewed → Signed → Approved → Active
```

## 🔌 Integrations

### WhatsApp Business API
- Automated chatbot for service requests
- Notifications for orders, installations, payments
- Two-way communication

### Indiamart Integration
- Automatic lead capture
- Real-time lead sync

### Email Integration
- Transactional emails
- Notifications
- Document sharing

### Payment Gateway (Optional)
- Razorpay integration
- Online payment collection

## 📱 WhatsApp Chatbot Flows

### Service Request Flow
1. Customer initiates chat
2. Collect customer details (Name, Mobile, Email)
3. Collect machine details (Serial number, Problem description)
4. Collect problem images/videos
5. Verify details
6. Auto-create service request ticket
7. Send confirmation

### Installation Schedule Flow
1. Send pre-installation checklist
2. Collect checklist confirmation
3. Schedule installation date
4. Send meeting link
5. Notify installation team

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server

# Building
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run database migrations
npm run prisma:studio   # Open Prisma Studio
npm run prisma:seed     # Seed database

# Testing
npm run test           # Run tests
npm run test:watch     # Run tests in watch mode

# Code Quality
npm run lint           # Run ESLint
npm run type-check     # TypeScript type checking
```

## 🚀 Deployment

### Production Checklist
- [ ] Set up PostgreSQL database
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Set up file storage (S3 or similar)
- [ ] Configure WhatsApp Business API
- [ ] Set up email server
- [ ] Configure domain and SSL
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

### Deployment Platforms
- Vercel (Recommended for Next.js)
- AWS
- Digital Ocean
- Google Cloud Platform

## 📈 Roadmap

### Phase 1 (Current)
- [x] Core CRM modules
- [x] Service request management
- [x] Installation management
- [x] Contract management
- [x] Inventory tracking
- [x] WhatsApp integration

### Phase 2 (Planned)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics with AI
- [ ] Multi-language support
- [ ] Advanced workflow automation
- [ ] Integration marketplace
- [ ] Custom report builder

### Phase 3 (Future)
- [ ] IoT device integration
- [ ] Predictive maintenance
- [ ] Customer portal
- [ ] Vendor portal
- [ ] Advanced forecasting
- [ ] Machine learning insights

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is proprietary software owned by Shantaz Service & Sales.

## 🆘 Support

For support, email support@shantaz.com or create an issue in the repository.

## 👥 Team

**Development Team**: TEAM SHANTAZ

## 📝 Notes

- This is an enterprise-level system requiring proper configuration
- Multi-organization data is strictly isolated
- Serial number tracking works across all 3 organizations
- WhatsApp integration requires Business API approval
- Regular backups are essential
- Follow security best practices for production deployment

## 🔍 Key Features Explained

### Multi-Organization Architecture
- Data isolation per organization
- Cross-organization serial number lookup
- Organization-specific settings
- Unified reporting across organizations (where permitted)

### Serial Number Tracking
- Track from purchase to sale
- Warranty and AMC management
- Customer association
- Multi-organization lookup
- Status tracking (Available, Sold, Under Warranty, etc.)

### Workflow Automation
- Lead nurturing automation
- Service request routing
- Installation scheduling
- Contract approval workflows
- Payment reminders
- SLA monitoring

### Custom Fields
- Add custom fields to any module
- Field types: Text, Number, Date, Dropdown, etc.
- Organization-specific custom fields
- Field validation rules

---

**Built with ❤️ by Team Shantaz**
