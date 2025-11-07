import prisma from "./src/lib/db"
import bcrypt from "bcryptjs"

async function checkUser() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      password: true,
    },
  })

  console.log("\n=== Users in Database ===")
  for (const user of users) {
    console.log(`\nEmail: ${user.email}`)
    console.log(`Name: ${user.name}`)
    console.log(`Role: ${user.role}`)
    console.log(`Active: ${user.isActive}`)
    console.log(`Password Hash: ${user.password.substring(0, 20)}...`)
    
    // Test if password is "Admin@123"
    const isValid = await bcrypt.compare("Admin@123", user.password)
    console.log(`Password "Admin@123" valid: ${isValid}`)
  }

  await prisma.$disconnect()
}

checkUser().catch(console.error)
