'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled in RestaurantGrid via URL or state
  };

  return (
    <section className="hero-section">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">Discover & Reserve</h1>
          <p className="hero-subtitle">
            Book the finest restaurants with ease. Unforgettable dining experiences await.
          </p>
          <form onSubmit={handleSearch} className="hero-search">
            <input
              type="text"
              placeholder="Search restaurants, cuisines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="hero-search-input"
            />
            <button type="submit" className="hero-search-btn">Search</button>
          </form>
        </div>
      </div>
    </section>
  );
}
