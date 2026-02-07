import Link from 'next/link'
import { StatsCards } from '@/components/admin/stats-cards'
import { ReservationsTable } from '@/components/admin/reservations-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import { getReservations } from '@/app/actions'

export default async function AdminDashboardPage() {
  const reservations = await getReservations()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tableau de bord</h1>
        <p className="mt-1 text-muted-foreground">
          Vue d{"'"}ensemble de votre activité de location
        </p>
      </div>

      <StatsCards />

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Dernières réservations</CardTitle>
          <Link href="/admin/reservations">
            <Button variant="ghost" size="sm" className="gap-1">
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <ReservationsTable limit={5} reservations={reservations} />
        </CardContent>
      </Card>
    </div>
  )
}
