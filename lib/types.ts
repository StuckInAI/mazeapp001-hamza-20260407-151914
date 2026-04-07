export interface TableInfo {
  id: string;
  name: string;
  location: string;
  capacity: number;
  floor: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  image: string;
  address: string;
  phone: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  openTime: string;
  closeTime: string;
  tables: TableInfo[];
  availableSlots: string[];
  tags: string[];
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  visitDate: string;
}

export interface Booking {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  tableId: string;
  tableName: string;
  tableLocation: string;
  date: string;
  time: string;
  duration: number;
  partySize: number;
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  allergies: string[];
  specialRequests: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'consumer' | 'restaurant';
  restaurantId?: string;
}

export interface BookingFormData {
  restaurantId: string;
  date: string;
  time: string;
  partySize: number;
  tableId: string;
  tableName: string;
  tableLocation: string;
  allergies: string[];
  specialRequests: string;
  userName: string;
  userEmail: string;
  userPhone: string;
}
