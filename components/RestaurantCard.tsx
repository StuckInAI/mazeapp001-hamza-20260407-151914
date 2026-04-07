'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Restaurant } from '@/lib/types';
import StarRating from '@/components/StarRating';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <div className="restaurant-card">
      <div className="card-image-wrapper">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          className="card-image"
          style={{ objectFit: 'cover' }}
        />
        <span className="card-price">{restaurant.priceRange}</span>
      </div>
      <div className="card-body">
        <div className="card-header-row">
          <h3 className="card-name">{restaurant.name}</h3>
          <span className="card-cuisine">{restaurant.cuisine}</span>
        </div>
        <div className="card-rating">
          <StarRating rating={restaurant.rating} />
          <span className="rating-count">({restaurant.reviewCount})</span>
        </div>
        <p className="card-description">{restaurant.description}</p>
        <div className="card-tags">
          {restaurant.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <div className="card-footer">
          <span className="card-hours">{restaurant.openTime} - {restaurant.closeTime}</span>
          <Link href={`/restaurants/${restaurant.id}`} className="btn-primary-sm">
            Reserve
          </Link>
        </div>
      </div>
    </div>
  );
}
