import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log("🔐 Login attempt for:", email)
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    })
    
    if (!user) {
      console.log("❌ User not found")
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    if (!user.isActive) {
      console.log("❌ User not active")
      return NextResponse.json({ error: "User not active" }, { status: 403 })
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    console.log("🔑 Password validation:", isPasswordValid)
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId,
        organizationName: user.organization.name,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
