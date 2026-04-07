import { Booking } from './types';
import { SAMPLE_BOOKINGS } from './data';

let bookings: Booking[] = [...SAMPLE_BOOKINGS];

export function getBookings(): Booking[] {
  return bookings;
}

export function getBookingsByRestaurant(restaurantId: string): Booking[] {
  return bookings.filter((b) => b.restaurantId === restaurantId);
}

export function getBookingsByUser(userId: string): Booking[] {
  return bookings.filter((b) => b.userId === userId);
}

export function addBooking(booking: Booking): void {
  bookings = [...bookings, booking];
}

export function updateBookingStatus(bookingId: string, status: Booking['status']): boolean {
  const index = bookings.findIndex((b) => b.id === bookingId);
  if (index === -1) return false;
  bookings[index] = { ...bookings[index], status };
  return true;
}

export function deleteBooking(bookingId: string): boolean {
  const index = bookings.findIndex((b) => b.id === bookingId);
  if (index === -1) return false;
  bookings = bookings.filter((b) => b.id !== bookingId);
  return true;
}
