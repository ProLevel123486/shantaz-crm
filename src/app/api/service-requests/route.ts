import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'

// GET /api/service-requests
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const accountId = searchParams.get('accountId')
    const search = searchParams.get('search')

    const where: any = {
      organizationId: session.user.organizationId,
    }

    if (status) {
      where.status = status
    }

    if (priority) {
      where.priority = priority
    }

    if (accountId) {
      where.accountId = accountId
    }

    if (search) {
      where.OR = [
        { ticketNumber: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
      ]
    }

    const serviceRequests = await prisma.serviceRequest.findMany({
      where,
      include: {
        account: {
          select: {
            id: true,
            name: true,
          },
        },
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(serviceRequests)
  } catch (error) {
    console.error('Error fetching service requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service requests' },
      { status: 500 }
    )
  }
}

// POST /api/service-requests
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Generate ticket number (SR-YYYYMMDD-XXXX format)
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const count = await prisma.serviceRequest.count({
      where: {
        organizationId: session.user.organizationId,
        ticketNumber: {
          startsWith: `SR-${dateStr}`,
        },
      },
    })
    const ticketNumber = `SR-${dateStr}-${String(count + 1).padStart(4, '0')}`
    
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        ...body,
        ticketNumber,
        organizationId: session.user.organizationId,
        createdById: session.user.id,
      },
      include: {
        account: true,
        contact: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'SERVICE_REQUEST_CREATED',
        title: `Service Request Created: ${ticketNumber}`,
        description: `Service request "${serviceRequest.title}" was created`,
        entityType: 'SERVICE_REQUEST',
        entityId: serviceRequest.id,
        organizationId: session.user.organizationId,
        createdById: session.user.id,
      },
    })

    return NextResponse.json(serviceRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating service request:', error)
    return NextResponse.json(
      { error: 'Failed to create service request' },
      { status: 500 }
    )
  }
}
