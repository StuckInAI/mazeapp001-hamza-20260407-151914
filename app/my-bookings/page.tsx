'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Booking } from '@/lib/types';
import { RESTAURANTS } from '@/lib/data';
import { format } from 'date-fns';

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/my-bookings');
      return;
    }
    if (status === 'authenticated') {
      fetchBookings();
    }
  }, [status, router]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`/api/bookings?userId=${session?.user?.email}`);
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      fetchBookings();
    } catch {
      console.error('Failed to cancel booking');
    }
  };

  const getRestaurantName = (restaurantId: string) => {
    return RESTAURANTS.find((r) => r.id === restaurantId)?.name ?? 'Unknown Restaurant';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#22c55e';
      case 'cancelled': return '#ef4444';
      case 'completed': return '#6b7280';
      default: return '#f59e0b';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="loading-screen">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="my-bookings-page">
        <div className="container">
          <div className="page-header">
            <h1>My Reservations</h1>
            <p>Manage your dining reservations</p>
          </div>

          {bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🍽️</div>
              <h3>No reservations yet</h3>
              <p>Start exploring restaurants and make your first booking!</p>
              <button
                className="btn-primary"
                onClick={() => router.push('/')}
              >
                Explore Restaurants
              </button>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <h3>{getRestaurantName(booking.restaurantId)}</h3>
                    <span
                      className="booking-status"
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="booking-details">
                    <div className="detail-row">
                      <span className="detail-icon">📅</span>
                      <span>{booking.date} at {booking.time}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-icon">👥</span>
                      <span>{booking.partySize} guests</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-icon">🪑</span>
                      <span>{booking.tableName} ({booking.tableLocation})</span>
                    </div>
                    {booking.allergies.length > 0 && (
                      <div className="detail-row">
                        <span className="detail-icon">⚠️</span>
                        <span>Allergies: {booking.allergies.join(', ')}</span>
                      </div>
                    )}
                    {booking.specialRequests && (
                      <div className="detail-row">
                        <span className="detail-icon">📝</span>
                        <span>{booking.specialRequests}</span>
                      </div>
                    )}
                  </div>
                  {booking.status === 'confirmed' && (
                    <div className="booking-actions">
                      <button
                        className="btn-danger"
                        onClick={() => handleCancel(booking.id)}
                      >
                        Cancel Reservation
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
