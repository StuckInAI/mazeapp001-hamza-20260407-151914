'use client';

import { useState, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Restaurant, BookingFormData } from '@/lib/types';

interface BookingModalProps {
  restaurant: Restaurant;
  onClose: () => void;
}

const ALLERGY_OPTIONS = ['gluten', 'nuts', 'dairy', 'shellfish', 'peanuts', 'eggs', 'soy'];

export default function BookingModal({ restaurant, onClose }: BookingModalProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<BookingFormData>({
    restaurantId: restaurant.id,
    date: today,
    time: restaurant.availableSlots[0] ?? '19:00',
    partySize: 2,
    tableId: '',
    tableName: '',
    tableLocation: '',
    allergies: [],
    specialRequests: '',
    userName: session?.user?.name ?? '',
    userEmail: session?.user?.email ?? '',
    userPhone: '',
  });

  const suitableTables = restaurant.tables.filter(
    (t) => t.capacity >= formData.partySize
  );

  const handleAllergyToggle = (allergy: string) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter((a) => a !== allergy)
        : [...prev.allergies, allergy],
    }));
  };

  const handleTableSelect = (tableId: string) => {
    const table = restaurant.tables.find((t) => t.id === tableId);
    if (table) {
      setFormData((prev) => ({
        ...prev,
        tableId: table.id,
        tableName: table.name,
        tableLocation: table.location,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.tableId) {
      setError('Please select a table');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: session?.user?.email ?? 'anonymous',
          duration: 90,
        }),
      });
      if (!res.ok) throw new Error('Failed to create booking');
      setSuccess(true);
    } catch {
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="success-state">
            <div className="success-icon">✅</div>
            <h2>Reservation Confirmed!</h2>
            <p>Your table at {restaurant.name} has been booked.</p>
            <p>{formData.date} at {formData.time} for {formData.partySize} guests</p>
            <div className="success-actions">
              <button className="btn-primary" onClick={() => router.push('/my-bookings')}>
                View My Bookings
              </button>
              <button className="btn-outline" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Reserve at {restaurant.name}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-steps">
          <span className={`step ${step >= 1 ? 'active' : ''}`}>1. Date & Party</span>
          <span className="step-divider">›</span>
          <span className={`step ${step >= 2 ? 'active' : ''}`}>2. Table</span>
          <span className="step-divider">›</span>
          <span className={`step ${step >= 3 ? 'active' : ''}`}>3. Details</span>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}

          {step === 1 && (
            <div className="step-content">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  min={today}
                  onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData((p) => ({ ...p, time: e.target.value }))}
                >
                  {restaurant.availableSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Party Size</label>
                <select
                  value={formData.partySize}
                  onChange={(e) => setFormData((p) => ({ ...p, partySize: Number(e.target.value), tableId: '' }))}
                >
                  {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                  ))}
                </select>
              </div>
              <button type="button" className="btn-primary" onClick={() => setStep(2)}>
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h3>Select a Table</h3>
              {suitableTables.length === 0 ? (
                <p>No tables available for {formData.partySize} guests.</p>
              ) : (
                <div className="tables-grid">
                  {suitableTables.map((table) => (
                    <div
                      key={table.id}
                      className={`table-option ${formData.tableId === table.id ? 'selected' : ''}`}
                      onClick={() => handleTableSelect(table.id)}
                    >
                      <strong>{table.name}</strong>
                      <span>{table.location}</span>
                      <span>Capacity: {table.capacity}</span>
                      <span>Floor: {table.floor}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="step-actions">
                <button type="button" className="btn-outline" onClick={() => setStep(1)}>Back</button>
                <button type="button" className="btn-primary" onClick={() => { if (formData.tableId) setStep(3); else setError('Please select a table'); }}>
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData((p) => ({ ...p, userName: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) => setFormData((p) => ({ ...p, userEmail: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.userPhone}
                  onChange={(e) => setFormData((p) => ({ ...p, userPhone: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Allergies</label>
                <div className="allergy-options">
                  {ALLERGY_OPTIONS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      className={`allergy-toggle ${formData.allergies.includes(a) ? 'active' : ''}`}
                      onClick={() => handleAllergyToggle(a)}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Special Requests</label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData((p) => ({ ...p, specialRequests: e.target.value }))}
                  rows={3}
                  placeholder="Any special requests or notes..."
                />
              </div>
              <div className="step-actions">
                <button type="button" className="btn-outline" onClick={() => setStep(2)}>Back</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Confirming...' : 'Confirm Reservation'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
