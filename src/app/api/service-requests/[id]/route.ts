import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'

// GET /api/service-requests/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const serviceRequest = await prisma.serviceRequest.findFirst({
      where: {
        id: params.id,
        organizationId: session.user.organizationId,
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
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        activities: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        comments: {
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!serviceRequest) {
      return NextResponse.json({ error: 'Service request not found' }, { status: 404 })
    }

    return NextResponse.json(serviceRequest)
  } catch (error) {
    console.error('Error fetching service request:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service request' },
      { status: 500 }
    )
  }
}

// PATCH /api/service-requests/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status: newStatus, ...updateData } = body

    // Get current service request
    const current = await prisma.serviceRequest.findFirst({
      where: {
        id: params.id,
        organizationId: session.user.organizationId,
      },
    })

    if (!current) {
      return NextResponse.json({ error: 'Service request not found' }, { status: 404 })
    }

    // Update service request
    const serviceRequest = await prisma.serviceRequest.update({
      where: { id: params.id },
      data: {
        ...updateData,
        ...(newStatus && { status: newStatus }),
        updatedAt: new Date(),
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

    // Log status change
    if (newStatus && newStatus !== current.status) {
      await prisma.activity.create({
        data: {
          type: 'STATUS_CHANGE',
          title: `Status changed: ${current.status} → ${newStatus}`,
          description: `Service request status updated from ${current.status} to ${newStatus}`,
          entityType: 'SERVICE_REQUEST',
          entityId: serviceRequest.id,
          organizationId: session.user.organizationId,
          createdById: session.user.id,
        },
      })
    }

    return NextResponse.json(serviceRequest)
  } catch (error) {
    console.error('Error updating service request:', error)
    return NextResponse.json(
      { error: 'Failed to update service request' },
      { status: 500 }
    )
  }
}

// DELETE /api/service-requests/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const serviceRequest = await prisma.serviceRequest.deleteMany({
      where: {
        id: params.id,
        organizationId: session.user.organizationId,
      },
    })

    if (serviceRequest.count === 0) {
      return NextResponse.json({ error: 'Service request not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting service request:', error)
    return NextResponse.json(
      { error: 'Failed to delete service request' },
      { status: 500 }
    )
  }
}
