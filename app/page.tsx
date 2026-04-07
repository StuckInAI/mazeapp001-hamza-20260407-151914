import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import RestaurantGrid from '@/components/RestaurantGrid';
import Footer from '@/components/Footer';
import { RESTAURANTS } from '@/lib/data';

export default function HomePage() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <HeroSection />
        <section className="restaurants-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Featured Restaurants</h2>
              <p className="section-subtitle">Discover exceptional dining experiences near you</p>
            </div>
            <Suspense fallback={<div className="loading">Loading restaurants...</div>}>
              <RestaurantGrid restaurants={RESTAURANTS} />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
