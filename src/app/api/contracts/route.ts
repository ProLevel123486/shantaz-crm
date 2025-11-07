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
    const status = searchParams.get("status")

    const where: any = {
      organizationId: session.user.organizationId,
    }

    if (status) {
      where.status = status
    }

    const contracts = await prisma.contract.findMany({
      where,
      include: {
        account: {
          select: {
            name: true,
          },
        },
        deal: {
          select: {
            id: true,
            stage: true,
          },
        },
        createdBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(contracts)
  } catch (error) {
    console.error("Error fetching contracts:", error)
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
    const { name, type, accountId, dealId, effectiveDate, endDate, value, terms } = body

    // Generate contract number
    const date = new Date()
    const dateStr = date.toISOString().split("T")[0].replace(/-/g, "")
    const count = await prisma.contract.count({
      where: {
        organizationId: session.user.organizationId,
        createdAt: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        },
      },
    })
    const contractNumber = `CON-${dateStr}-${String(count + 1).padStart(4, "0")}`

    const contract = await prisma.contract.create({
      data: {
        contractNumber,
        name,
        type,
        accountId,
        dealId,
        effectiveDate: effectiveDate ? new Date(effectiveDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        value: value ? parseFloat(value) : null,
        terms,
        status: "DRAFT",
        organizationId: session.user.organizationId,
        createdById: session.user.id,
      },
      include: {
        account: true,
        deal: true,
      },
    })

    return NextResponse.json(contract, { status: 201 })
  } catch (error) {
    console.error("Error creating contract:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
