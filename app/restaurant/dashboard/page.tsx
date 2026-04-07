'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RestaurantNavbar from '@/components/RestaurantNavbar';
import BookingsTable from '@/components/BookingsTable';
import GanttChart from '@/components/GanttChart';
import { Booking } from '@/lib/types';
import { RESTAURANTS } from '@/lib/data';

export default function RestaurantDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'table' | 'gantt'>('table');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const userRole = (session?.user as { role?: string })?.role;
  const restaurantId = (session?.user as { restaurantId?: string })?.restaurantId ?? '1';
  const restaurant = RESTAURANTS.find((r) => r.id === restaurantId);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    if (status === 'authenticated') {
      if (userRole !== 'restaurant') {
        router.push('/');
        return;
      }
      fetchBookings();
    }
  }, [status, userRole, router]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`/api/bookings?restaurantId=${restaurantId}`);
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchBookings();
    } catch {
      console.error('Failed to update booking');
    }
  };

  const filteredBookings = bookings.filter((b) => b.date === selectedDate);

  const stats = {
    total: filteredBookings.length,
    confirmed: filteredBookings.filter((b) => b.status === 'confirmed').length,
    cancelled: filteredBookings.filter((b) => b.status === 'cancelled').length,
    withAllergies: filteredBookings.filter((b) => b.allergies.length > 0).length,
    totalGuests: filteredBookings
      .filter((b) => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.partySize, 0),
  };

  if (status === 'loading' || loading) {
    return (
      <div className="restaurant-app">
        <RestaurantNavbar />
        <div className="loading-screen">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="restaurant-app">
      <RestaurantNavbar />
      <main className="restaurant-dashboard">
        <div className="dashboard-header">
          <div>
            <h1>{restaurant?.name ?? 'Restaurant'} Dashboard</h1>
            <p>Manage your reservations and table bookings</p>
          </div>
          <div className="date-selector">
            <label>Viewing:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <div className="stat-card confirmed">
            <div className="stat-value">{stats.confirmed}</div>
            <div className="stat-label">Confirmed</div>
          </div>
          <div className="stat-card cancelled">
            <div className="stat-value">{stats.cancelled}</div>
            <div className="stat-label">Cancelled</div>
          </div>
          <div className="stat-card guests">
            <div className="stat-value">{stats.totalGuests}</div>
            <div className="stat-label">Total Guests</div>
          </div>
          <div className="stat-card allergies">
            <div className="stat-value">{stats.withAllergies}</div>
            <div className="stat-label">Allergy Notices</div>
          </div>
        </div>

        <div className="view-toggle">
          <button
            className={`toggle-btn ${activeView === 'table' ? 'active' : ''}`}
            onClick={() => setActiveView('table')}
          >
            📋 Table View
          </button>
          <button
            className={`toggle-btn ${activeView === 'gantt' ? 'active' : ''}`}
            onClick={() => setActiveView('gantt')}
          >
            📊 Gantt Chart
          </button>
        </div>

        {activeView === 'table' ? (
          <BookingsTable
            bookings={filteredBookings}
            onStatusUpdate={handleStatusUpdate}
          />
        ) : (
          <GanttChart
            bookings={filteredBookings}
            restaurant={restaurant}
          />
        )}
      </main>
    </div>
  );
}
