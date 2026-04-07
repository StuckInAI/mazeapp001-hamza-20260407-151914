import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getBookings, addBooking } from '@/lib/store';
import { Booking } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get('restaurantId');
  const userId = searchParams.get('userId');

  let bookings = getBookings();

  if (restaurantId) {
    bookings = bookings.filter((b) => b.restaurantId === restaurantId);
  }
  if (userId) {
    bookings = bookings.filter((b) => b.userId === userId);
  }

  return NextResponse.json(bookings);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const booking: Booking = {
      id: uuidv4(),
      restaurantId: body.restaurantId,
      userId: body.userId ?? 'anonymous',
      userName: body.userName,
      userEmail: body.userEmail,
      userPhone: body.userPhone,
      tableId: body.tableId,
      tableName: body.tableName,
      tableLocation: body.tableLocation,
      date: body.date,
      time: body.time,
      duration: body.duration ?? 90,
      partySize: body.partySize,
      status: 'confirmed',
      allergies: body.allergies ?? [],
      specialRequests: body.specialRequests ?? '',
      createdAt: new Date().toISOString(),
    };
    addBooking(booking);
    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
