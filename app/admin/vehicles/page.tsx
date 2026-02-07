import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Fuel, Settings2 } from 'lucide-react'
import { getCars, getReservations } from '@/app/actions'

export default async function VehiclesPage() {
  const [cars, reservations] = await Promise.all([getCars(), getReservations()])

  const getCarStats = (carId: string) => {
    const carReservations = reservations.filter((r) => r.car_id === carId)
    const activeReservations = carReservations.filter(
      (r) => r.status === 'pending' || r.status === 'confirmed'
    ).length
    const totalRevenue = carReservations
      .filter((r) => r.status === 'completed' || r.status === 'confirmed')
      .reduce((sum, r) => sum + (r.total_price || 0), 0)
    return { activeReservations, totalRevenue, totalReservations: carReservations.length }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>Véhicules</h1>
        <p className='mt-1 text-muted-foreground'>
          Gérez votre flotte de {cars.length} véhicules
        </p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {cars.map((car) => {
          const stats = getCarStats(car.id)
          const pricePerDay = car.price_per_day || car.pricePerDay || 0

          return (
            <Card key={car.id} className='overflow-hidden border-border/50'>
              <div className='relative aspect-video bg-muted'>
                <Image
                  src={car.image || '/placeholder.svg'}
                  alt={car.name}
                  fill
                  className='object-cover'
                />
                <Badge
                  variant={car.available ? 'default' : 'secondary'}
                  className='absolute top-3 right-3'
                >
                  {car.available ? 'Disponible' : 'Indisponible'}
                </Badge>
              </div>
              <CardContent className='p-4'>
                <div className='mb-3 flex items-start justify-between'>
                  <div>
                    <h3 className='font-semibold text-foreground'>{car.name}</h3>
                    <p className='text-sm text-muted-foreground'>{car.category} - {car.year}</p>
                  </div>
                  <p className='text-lg font-bold text-primary'>{pricePerDay} EUR/j</p>
                </div>

                <div className='mb-4 flex items-center gap-4 text-xs text-muted-foreground'>
                  <div className='flex items-center gap-1'>
                    <Users className='h-3.5 w-3.5' />
                    <span>{car.seats}</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Fuel className='h-3.5 w-3.5' />
                    <span>{car.fuel}</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Settings2 className='h-3.5 w-3.5' />
                    <span>{car.transmission}</span>
                  </div>
                </div>

                <div className='grid grid-cols-3 gap-2 rounded-lg bg-muted/50 p-3 text-center'>
                  <div>
                    <p className='text-lg font-bold text-foreground'>{stats.totalReservations}</p>
                    <p className='text-xs text-muted-foreground'>Réservations</p>
                  </div>
                  <div>
                    <p className='text-lg font-bold text-foreground'>{stats.activeReservations}</p>
                    <p className='text-xs text-muted-foreground'>Actives</p>
                  </div>
                  <div>
                    <p className='text-lg font-bold text-emerald-600'>{Math.round(stats.totalRevenue)}</p>
                    <p className='text-xs text-muted-foreground'>EUR</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
