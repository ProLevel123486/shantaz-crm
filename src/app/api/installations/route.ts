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

    const installations = await prisma.installation.findMany({
      where,
      include: {
        contact: true,
        account: true,
        assignedTo: true,
        salesOrder: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(installations)
  } catch (error) {
    console.error("Error fetching installations:", error)
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
    const { contactId, accountId, salesOrderId, dispatchDate, engineerTeam, notes } = body

    // Generate work order number
    const date = new Date()
    const dateStr = date.toISOString().split("T")[0].replace(/-/g, "")
    const count = await prisma.installation.count({
      where: {
        organizationId: session.user.organizationId,
        createdAt: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        },
      },
    })
    const workOrderNumber = `WO-${dateStr}-${String(count + 1).padStart(4, "0")}`

    const installation = await prisma.installation.create({
      data: {
        workOrderNumber,
        contactId,
        accountId,
        salesOrderId,
        organizationId: session.user.organizationId,
        dispatchDate: dispatchDate ? new Date(dispatchDate) : null,
        status: "PLANNING",
        engineerTeam: engineerTeam || [],
        notes,
      },
      include: {
        contact: true,
        account: true,
        salesOrder: true,
      },
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        type: "NOTE",
        subject: "Installation Created",
        description: `Installation ${workOrderNumber} created`,
        installationId: installation.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json(installation, { status: 201 })
  } catch (error) {
    console.error("Error creating installation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
