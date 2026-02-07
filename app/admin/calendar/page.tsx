'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getCars, getReservations } from '@/app/actions'

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

interface CalendarPageProps {
  initialCars: any[]
  initialReservations: any[]
}

export default function CalendarPage({ initialCars = [], initialReservations = [] }: CalendarPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedCarId, setSelectedCarId] = useState<string>('all')
  const [cars] = useState(initialCars)
  const [reservations] = useState(initialReservations)

  const { daysInMonth, firstDayOfMonth, calendarReservations } = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    const firstDayOfMonth = firstDay === 0 ? 6 : firstDay - 1

    const filtered =
      selectedCarId === 'all'
        ? reservations
        : reservations.filter((r) => r.car_id === selectedCarId)

    const calendarReservations = filtered.filter((r) => {
      const start = new Date(r.start_date || r.startDate)
      const end = new Date(r.end_date || r.endDate)
      const monthStart = new Date(year, month, 1)
      const monthEnd = new Date(year, month + 1, 0)
      return start <= monthEnd && end >= monthStart
    })

    return { daysInMonth, firstDayOfMonth, calendarReservations }
  }, [currentDate, reservations, selectedCarId])

  const getReservationsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return calendarReservations.filter((r) => {
      const start = new Date(r.start_date || r.startDate)
      const end = new Date(r.end_date || r.endDate)
      return date >= start && date <= end
    })
  }

  const navigateMonth = (direction: number) => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1))
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-500',
    confirmed: 'bg-emerald-500',
    completed: 'bg-sky-500',
    cancelled: 'bg-rose-500',
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>Calendrier</h1>
        <p className='mt-1 text-muted-foreground'>
          Visualisez les réservations par date et par véhicule
        </p>
      </div>

      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='icon' onClick={() => navigateMonth(-1)}>
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <h2 className='min-w-48 text-center text-xl font-semibold'>
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button variant='outline' size='icon' onClick={() => navigateMonth(1)}>
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
        <Select value={selectedCarId} onValueChange={setSelectedCarId}>
          <SelectTrigger className='w-52'>
            <SelectValue placeholder='Tous les véhicules' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tous les véhicules</SelectItem>
            {cars.map((car) => (
              <SelectItem key={car.id} value={car.id}>
                {car.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className='border-border/50'>
        <CardContent className='p-4'>
          {/* Calendar header */}
          <div className='mb-2 grid grid-cols-7 gap-1'>
            {DAYS.map((day) => (
              <div
                key={day}
                className='py-2 text-center text-sm font-medium text-muted-foreground'
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className='grid grid-cols-7 gap-1'>
            {/* Empty cells for days before the first day of the month */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className='min-h-24 rounded-lg bg-muted/30 p-2' />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dayReservations = getReservationsForDay(day)
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear()

              return (
                <div
                  key={day}
                  className={`min-h-24 rounded-lg border p-2 transition-colors ${
                    isToday
                      ? 'border-primary bg-primary/5'
                      : 'border-border/50 bg-card hover:bg-muted/30'
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      isToday ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {day}
                  </span>
                  <div className='mt-1 space-y-1'>
                    {dayReservations.slice(0, 2).map((r) => {
                      const firstName = r.first_name || r.firstName || ''
                      const lastName = r.last_name || r.lastName || ''
                      const carName = r.cars?.name || r.car?.name || ''
                      const carBrand = r.cars?.brand || r.car?.brand || ''
                      return (
                        <div
                          key={r.id}
                          className={`rounded px-1.5 py-0.5 text-xs text-white ${statusColors[r.status]}`}
                          title={`${firstName} ${lastName} - ${carName}`}
                        >
                          <span className='hidden sm:inline'>{carName.split(' ')[0]}</span>
                          <span className='sm:hidden'>{carBrand.slice(0, 3)}</span>
                        </div>
                      )
                    })}
                    {dayReservations.length > 2 && (
                      <div className='text-xs text-muted-foreground'>
                        +{dayReservations.length - 2} autres
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className='border-border/50'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>Légende</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-4'>
            <div className='flex items-center gap-2'>
              <div className='h-3 w-3 rounded bg-amber-500' />
              <span className='text-sm text-muted-foreground'>En attente</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='h-3 w-3 rounded bg-emerald-500' />
              <span className='text-sm text-muted-foreground'>Confirmée</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='h-3 w-3 rounded bg-sky-500' />
              <span className='text-sm text-muted-foreground'>Terminée</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='h-3 w-3 rounded bg-rose-500' />
              <span className='text-sm text-muted-foreground'>Annulée</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
