export interface Car {
  id: string
  name: string
  brand: string
  model: string
  year: number
  category: "SUV" | "Berline" | "Citadine" | "Sport" | "Utilitaire"
  pricePerDay: number
  transmission: "Automatique" | "Manuelle"
  fuel: "Essence" | "Diesel" | "Électrique" | "Hybride"
  seats: number
  image: string
  available: boolean
}

export interface Reservation {
  id: string
  carId: string
  car: Car
  firstName: string
  lastName: string
  phone: string
  email?: string
  startDate: string
  endDate: string
  totalPrice: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  createdAt: string
}

export interface ReservationFormData {
  firstName: string
  lastName: string
  phone: string
  email?: string
  startDate: string
  endDate: string
}
