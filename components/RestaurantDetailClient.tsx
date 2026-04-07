'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Restaurant, Review } from '@/lib/types';
import StarRating from '@/components/StarRating';
import BookingModal from '@/components/BookingModal';

interface RestaurantDetailClientProps {
  restaurant: Restaurant;
  reviews: Review[];
}

export default function RestaurantDetailClient({
  restaurant,
  reviews,
}: RestaurantDetailClientProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleBookNow = () => {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=/restaurants/${restaurant.id}`);
      return;
    }
    setShowBookingModal(true);
  };

  return (
    <main className="restaurant-detail">
      <div className="detail-hero">
        <div className="detail-image-wrapper">
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className="detail-image"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div className="detail-hero-content">
          <h1>{restaurant.name}</h1>
          <p>{restaurant.cuisine} · {restaurant.priceRange}</p>
          <StarRating rating={restaurant.rating} />
          <span>({restaurant.reviewCount} reviews)</span>
        </div>
      </div>

      <div className="detail-body container">
        <div className="detail-main">
          <section className="detail-section">
            <h2>About</h2>
            <p>{restaurant.description}</p>
          </section>

          <section className="detail-section">
            <h2>Info</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-icon">📍</span>
                <span>{restaurant.address}</span>
              </div>
              <div className="info-item">
                <span className="info-icon">📞</span>
                <span>{restaurant.phone}</span>
              </div>
              <div className="info-item">
                <span className="info-icon">🕐</span>
                <span>{restaurant.openTime} - {restaurant.closeTime}</span>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <h2>Reviews</h2>
            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <strong>{review.userName}</strong>
                      <StarRating rating={review.rating} />
                      <span className="review-date">{review.date}</span>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="detail-sidebar">
          <div className="booking-cta">
            <h3>Make a Reservation</h3>
            <p>Available slots today</p>
            <div className="slots-list">
              {restaurant.availableSlots.slice(0, 6).map((slot) => (
                <span key={slot} className="slot-chip">{slot}</span>
              ))}
            </div>
            <button className="btn-primary" onClick={handleBookNow}>
              Book Now
            </button>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          restaurant={restaurant}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </main>
  );
}
