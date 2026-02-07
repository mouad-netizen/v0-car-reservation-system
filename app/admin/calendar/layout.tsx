import React from "react"
import { getCars, getReservations } from '@/app/actions'
import CalendarPage from './page'

export default async function CalendarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [cars, reservations] = await Promise.all([getCars(), getReservations()])

  return <CalendarPage initialCars={cars} initialReservations={reservations} />
}
