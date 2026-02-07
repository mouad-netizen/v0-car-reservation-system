import { ReservationsTable } from '@/components/admin/reservations-table'
import { getReservations } from '@/app/actions'

export default async function ReservationsPage() {
  const reservations = await getReservations()

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>Réservations</h1>
        <p className='mt-1 text-muted-foreground'>
          Gérez toutes les réservations de véhicules
        </p>
      </div>

      <ReservationsTable showFilters reservations={reservations} />
    </div>
  )
}
