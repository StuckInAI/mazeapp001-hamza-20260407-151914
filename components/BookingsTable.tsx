'use client';

import { Booking } from '@/lib/types';

interface BookingsTableProps {
  bookings: Booking[];
  onStatusUpdate: (bookingId: string, status: Booking['status']) => void;
}

export default function BookingsTable({ bookings, onStatusUpdate }: BookingsTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h3>No bookings for this date</h3>
        <p>There are no reservations scheduled for the selected date.</p>
      </div>
    );
  }

  const getAllergyBadges = (allergies: string[]) => {
    if (allergies.length === 0) return <span className="no-allergies">None</span>;
    return (
      <div className="allergy-list">
        {allergies.map((a) => (
          <span key={a} className="allergy-badge">{a}</span>
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: Booking['status']) => {
    const colors: Record<string, string> = {
      confirmed: '#22c55e',
      cancelled: '#ef4444',
      completed: '#6b7280',
      pending: '#f59e0b',
    };
    return (
      <span
        className="status-badge"
        style={{ backgroundColor: colors[status] ?? '#6b7280' }}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="bookings-table-wrapper">
      <table className="bookings-table">
        <thead>
          <tr>
            <th>Guest</th>
            <th>Table</th>
            <th>Time</th>
            <th>Party</th>
            <th>Allergies</th>
            <th>Special Requests</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>
                <div className="guest-info">
                  <strong>{booking.userName}</strong>
                  <small>{booking.userEmail}</small>
                  <small>{booking.userPhone}</small>
                </div>
              </td>
              <td>
                <div>
                  <strong>{booking.tableName}</strong>
                  <small>{booking.tableLocation}</small>
                </div>
              </td>
              <td>{booking.time}</td>
              <td>{booking.partySize} guests</td>
              <td>{getAllergyBadges(booking.allergies)}</td>
              <td>
                <span className="special-requests">
                  {booking.specialRequests || '—'}
                </span>
              </td>
              <td>{getStatusBadge(booking.status)}</td>
              <td>
                <div className="action-buttons">
                  {booking.status === 'confirmed' && (
                    <>
                      <button
                        className="action-btn complete-btn"
                        onClick={() => onStatusUpdate(booking.id, 'completed')}
                      >
                        Complete
                      </button>
                      <button
                        className="action-btn cancel-btn"
                        onClick={() => onStatusUpdate(booking.id, 'cancelled')}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {booking.status === 'pending' && (
                    <button
                      className="action-btn confirm-btn"
                      onClick={() => onStatusUpdate(booking.id, 'confirmed')}
                    >
                      Confirm
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
