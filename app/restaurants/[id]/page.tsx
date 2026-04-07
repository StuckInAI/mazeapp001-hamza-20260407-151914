import { notFound } from 'next/navigation';
import { RESTAURANTS, REVIEWS } from '@/lib/data';
import RestaurantDetailClient from '@/components/RestaurantDetailClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export async function generateStaticParams() {
  return RESTAURANTS.map((r) => ({ id: r.id }));
}

export default function RestaurantDetailPage({ params }: { params: { id: string } }) {
  const restaurant = RESTAURANTS.find((r) => r.id === params.id);
  if (!restaurant) notFound();

  const reviews = REVIEWS.filter((r) => r.restaurantId === params.id);

  return (
    <div className="app-container">
      <Navbar />
      <RestaurantDetailClient restaurant={restaurant} reviews={reviews} />
      <Footer />
    </div>
  );
}
