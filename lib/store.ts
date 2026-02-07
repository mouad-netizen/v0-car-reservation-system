"use client"

import { create } from "zustand"
import { Car, Reservation, ReservationFormData } from "./types"
import { cars as initialCars, mockReservations } from "./data"

interface Store {
  cars: Car[]
  reservations: Reservation[]
  addReservation: (carId: string, data: ReservationFormData) => Reservation
  updateReservationStatus: (id: string, status: Reservation["status"]) => void
  getCarById: (id: string) => Car | undefined
  getReservationsByCarId: (carId: string) => Reservation[]
}

export const useStore = create<Store>((set, get) => ({
  cars: initialCars,
  reservations: mockReservations,
  
  addReservation: (carId: string, data: ReservationFormData) => {
    const car = get().cars.find((c) => c.id === carId)
    if (!car) throw new Error("Car not found")
    
    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    const newReservation: Reservation = {
      id: `RES-${String(get().reservations.length + 1).padStart(4, "0")}`,
      carId,
      car,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      startDate: data.startDate,
      endDate: data.endDate,
      totalPrice: days * car.pricePerDay,
      status: "pending",
      createdAt: new Date().toISOString(),
    }
    
    set((state) => ({
      reservations: [newReservation, ...state.reservations],
    }))
    
    return newReservation
  },
  
  updateReservationStatus: (id: string, status: Reservation["status"]) => {
    set((state) => ({
      reservations: state.reservations.map((r) =>
        r.id === id ? { ...r, status } : r
      ),
    }))
  },
  
  getCarById: (id: string) => get().cars.find((c) => c.id === id),
  
  getReservationsByCarId: (carId: string) =>
    get().reservations.filter((r) => r.carId === carId),
}))
