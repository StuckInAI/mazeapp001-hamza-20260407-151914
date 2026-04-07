'use client';

import { useState } from 'react';
import { Restaurant } from '@/lib/types';
import RestaurantCard from '@/components/RestaurantCard';

interface RestaurantGridProps {
  restaurants: Restaurant[];
}

export default function RestaurantGrid({ restaurants }: RestaurantGridProps) {
  const [filter, setFilter] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');

  const cuisines = Array.from(new Set(restaurants.map((r) => r.cuisine)));

  const filtered = restaurants.filter((r) => {
    const matchesSearch =
      !filter ||
      r.name.toLowerCase().includes(filter.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(filter.toLowerCase());
    const matchesCuisine = !cuisineFilter || r.cuisine === cuisineFilter;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div>
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Filter restaurants..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
        <div className="cuisine-filters">
          <button
            className={`cuisine-btn ${cuisineFilter === '' ? 'active' : ''}`}
            onClick={() => setCuisineFilter('')}
          >
            All
          </button>
          {cuisines.map((c) => (
            <button
              key={c}
              className={`cuisine-btn ${cuisineFilter === c ? 'active' : ''}`}
              onClick={() => setCuisineFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="restaurant-grid">
        {filtered.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}
