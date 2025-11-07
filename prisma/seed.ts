import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Organizations
  const org1 = await prisma.organization.upsert({
    where: { code: 'SHANTAZ_SERVICE' },
    update: {},
    create: {
      name: 'SHANTAZ SERVICE & SALES',
      code: 'SHANTAZ_SERVICE',
      type: 'SERVICE_SALES',
      email: 'info@shantaz.com',
      phone: '+91-XXXXXXXXXX',
      address: 'Head Office Address',
      city: 'Your City',
      state: 'Your State',
      country: 'India',
      zipCode: '000000',
      isActive: true,
    },
  })

  const org2 = await prisma.organization.upsert({
    where: { code: 'SHANTAZ_L1' },
    update: {},
    create: {
      name: 'SHANTAZ TECHNOFOODS L1',
      code: 'SHANTAZ_L1',
      type: 'BOOKS_L1',
      email: 'l1@shantaz.com',
      phone: '+91-XXXXXXXXXX',
      address: 'L1 Office Address',
      city: 'Your City',
      state: 'Your State',
      country: 'India',
      zipCode: '000000',
      isActive: true,
    },
  })

  const org3 = await prisma.organization.upsert({
    where: { code: 'SHANTA_G_L1' },
    update: {},
    create: {
      name: 'SHANTA G TECHNOFOODS LLP L1',
      code: 'SHANTA_G_L1',
      type: 'BOOKS_L2',
      email: 'l2@shantaz.com',
      phone: '+91-XXXXXXXXXX',
      address: 'L2 Office Address',
      city: 'Your City',
      state: 'Your State',
      country: 'India',
      zipCode: '000000',
      isActive: true,
    },
  })

  console.log('✅ Organizations created')

  // Create Admin Users for each organization
  const hashedPassword = await bcrypt.hash('Admin@123', 10)

  const admin1 = await prisma.user.upsert({
    where: { email: 'admin@shantaz.com' },
    update: {},
    create: {
      email: 'admin@shantaz.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      position: 'System Administrator',
      department: 'IT',
      organizationId: org1.id,
      isActive: true,
    },
  })

  const admin2 = await prisma.user.upsert({
    where: { email: 'admin.l1@shantaz.com' },
    update: {},
    create: {
      email: 'admin.l1@shantaz.com',
      name: 'L1 Admin',
      password: hashedPassword,
      role: 'ADMIN',
      position: 'Administrator',
      department: 'Admin',
      organizationId: org2.id,
      isActive: true,
    },
  })

  const admin3 = await prisma.user.upsert({
    where: { email: 'admin.l2@shantaz.com' },
    update: {},
    create: {
      email: 'admin.l2@shantaz.com',
      name: 'L2 Admin',
      password: hashedPassword,
      role: 'ADMIN',
      position: 'Administrator',
      department: 'Admin',
      organizationId: org3.id,
      isActive: true,
    },
  })

  // Create sample users
  const salesUser = await prisma.user.upsert({
    where: { email: 'sales@shantaz.com' },
    update: {},
    create: {
      email: 'sales@shantaz.com',
      name: 'Sales Manager',
      password: hashedPassword,
      role: 'SALES',
      position: 'Sales Manager',
      department: 'Sales',
      organizationId: org1.id,
      isActive: true,
    },
  })

  const serviceUser = await prisma.user.upsert({
    where: { email: 'service@shantaz.com' },
    update: {},
    create: {
      email: 'service@shantaz.com',
      name: 'Service Engineer',
      password: hashedPassword,
      role: 'SERVICE_ENGINEER',
      position: 'Senior Engineer',
      department: 'Service',
      organizationId: org1.id,
      isActive: true,
    },
  })

  console.log('✅ Users created')

  // Create sample items
  const item1 = await prisma.item.create({
    data: {
      itemCode: 'PROD-001',
      name: 'Industrial Machine Model A',
      type: 'NORMAL',
      category: 'Machinery',
      description: 'High-performance industrial machine',
      unit: 'Unit',
      trackSerialNumber: true,
      sellingPrice: 500000,
      costPrice: 400000,
      taxRate: 18,
      stockOnHand: 10,
      organizationId: org1.id,
    },
  })

  const item2 = await prisma.item.create({
    data: {
      itemCode: 'PROD-002',
      name: 'Industrial Machine Model B',
      type: 'NORMAL',
      category: 'Machinery',
      description: 'Advanced industrial machine',
      unit: 'Unit',
      trackSerialNumber: true,
      sellingPrice: 750000,
      costPrice: 600000,
      taxRate: 18,
      stockOnHand: 5,
      organizationId: org1.id,
    },
  })

  console.log('✅ Sample items created')

  // Create sample serial numbers
  for (let i = 1; i <= 5; i++) {
    await prisma.serialNumber.create({
      data: {
        serialNumber: `SN${String(i).padStart(6, '0')}`,
        status: 'AVAILABLE',
        itemId: item1.id,
        organizationId: org1.id,
      },
    })
  }

  console.log('✅ Sample serial numbers created')

  console.log('🎉 Database seeded successfully!')
  console.log('\n📋 Login Credentials:')
  console.log('Super Admin: admin@shantaz.com / Admin@123')
  console.log('L1 Admin: admin.l1@shantaz.com / Admin@123')
  console.log('L2 Admin: admin.l2@shantaz.com / Admin@123')
  console.log('Sales User: sales@shantaz.com / Admin@123')
  console.log('Service User: service@shantaz.com / Admin@123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
