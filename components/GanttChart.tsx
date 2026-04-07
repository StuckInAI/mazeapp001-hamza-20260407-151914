'use client';

import { Booking } from '@/lib/types';
import { Restaurant } from '@/lib/types';

interface GanttChartProps {
  bookings: Booking[];
  restaurant?: Restaurant;
}

export default function GanttChart({ bookings, restaurant }: GanttChartProps) {
  const hours = Array.from({ length: 13 }, (_, i) => i + 10);

  const getBookingLeft = (time: string): number => {
    const [h, m] = time.split(':').map(Number);
    const startHour = 10;
    const totalMinutes = (h - startHour) * 60 + (m || 0);
    return (totalMinutes / (13 * 60)) * 100;
  };

  const getBookingWidth = (duration: number): number => {
    return (duration / (13 * 60)) * 100;
  };

  const tables = restaurant?.tables ?? [];

  const statusColors: Record<string, string> = {
    confirmed: '#22c55e',
    cancelled: '#ef4444',
    completed: '#6b7280',
    pending: '#f59e0b',
  };

  return (
    <div className="gantt-chart">
      <h3 className="gantt-title">Table Availability</h3>
      <div className="gantt-wrapper">
        <div className="gantt-header">
          <div className="gantt-label-col"></div>
          <div className="gantt-timeline">
            {hours.map((h) => (
              <div key={h} className="gantt-hour">
                {h}:00
              </div>
            ))}
          </div>
        </div>
        {tables.map((table) => {
          const tableBookings = bookings.filter(
            (b) => b.tableId === table.id && b.status !== 'cancelled'
          );
          return (
            <div key={table.id} className="gantt-row">
              <div className="gantt-label">
                <strong>{table.name}</strong>
                <small>{table.location}</small>
              </div>
              <div className="gantt-bars">
                {tableBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="gantt-bar"
                    style={{
                      left: `${getBookingLeft(booking.time)}%`,
                      width: `${getBookingWidth(booking.duration)}%`,
                      backgroundColor: statusColors[booking.status] ?? '#6b7280',
                    }}
                    title={`${booking.userName} - ${booking.time} (${booking.partySize} guests)`}
                  >
                    <span className="gantt-bar-label">
                      {booking.userName} ({booking.partySize})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
