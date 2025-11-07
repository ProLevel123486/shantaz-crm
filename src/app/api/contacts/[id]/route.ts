import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'

// GET /api/contacts/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const contact = await prisma.contact.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
      include: {
        account: true,
        deals: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        activities: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        comments: {
          include: {
            author: {
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

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Error fetching contact:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    )
  }
}

// PATCH /api/contacts/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const contact = await prisma.contact.updateMany({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    })

    if (contact.count === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    const updatedContact = await prisma.contact.findUnique({
      where: { id },
      include: {
        account: true,
      },
    })

    return NextResponse.json(updatedContact)
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    )
  }
}

// DELETE /api/contacts/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const contact = await prisma.contact.deleteMany({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
    })

    if (contact.count === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}
