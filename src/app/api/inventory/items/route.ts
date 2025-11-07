import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    const where: any = {
      organizationId: session.user.organizationId,
      isActive: true,
    }

    if (category) {
      where.category = category
    }

    const items = await prisma.item.findMany({
      where,
      include: {
        _count: {
          select: { serialNumbers: true },
        },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching items:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, itemCode, category, description, sellingPrice, costPrice, quantity, reorderLevel } = body

    const item = await prisma.item.create({
      data: {
        name,
        itemCode,
        category,
        description,
        sellingPrice: parseFloat(sellingPrice),
        costPrice: costPrice ? parseFloat(costPrice) : null,
        stockOnHand: parseInt(quantity) || 0,
        reorderLevel: parseInt(reorderLevel) || null,
        organizationId: session.user.organizationId,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("Error creating item:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
