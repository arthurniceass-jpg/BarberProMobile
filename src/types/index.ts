export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  icon: string;
}

export interface Barber {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  yearsExperience: number;
}

export interface Barbershop {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewsCount: number;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  openHours: string;
  isOpen: boolean;
  priceRange: '$' | '$$' | '$$$';
  services: Service[];
  barbers: Barber[];
}

export interface Appointment {
  id: string;
  shopId: string;
  shopName: string;
  serviceName: string;
  barberName: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  photoUri: string | null;
  appointments: Appointment[];
}
