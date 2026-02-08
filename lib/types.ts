export interface Car {
  id: string
  name: string
  brand: string
  model: string
  year: number
  category: "SUV" | "Berline" | "Citadine" | "Sport" | "Utilitaire"
  pricePerDay?: number
  daily_price?: number
  transmission: "Automatique" | "Manuelle"
  fuel?: "Essence" | "Diesel" | "Électrique" | "Hybride"
  fuel_type?: "Essence" | "Diesel" | "Électrique" | "Hybride"
  seats: number
  image?: string
  image_url?: string
  available: boolean
  description?: string
  created_at?: string
  price_per_day?: number
}

export interface Reservation {
  id: string
  car_id: string
  carId?: string
  car?: Car
  cars?: Car
  first_name: string
  firstName?: string
  last_name: string
  lastName?: string
  phone: string
  email?: string
  start_date: string
  startDate?: string
  end_date: string
  endDate?: string
  total_price: number
  totalPrice?: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  created_at?: string
  createdAt?: string
  updated_at?: string
}

export interface ReservationFormData {
  firstName: string
  lastName: string
  phone: string
  email?: string
  startDate: string
  endDate: string
}
