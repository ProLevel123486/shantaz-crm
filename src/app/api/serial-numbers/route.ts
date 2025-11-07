import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const serialNumbers = await prisma.serialNumber.findMany({
      where: {
        organizationId: session.user.organizationId,
      },
      include: {
        item: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(serialNumbers)
  } catch (error) {
    console.error('Error fetching serial numbers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch serial numbers' },
      { status: 500 }
    )
  }
}
