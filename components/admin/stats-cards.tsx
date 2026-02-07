import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, Calendar, Car, Euro } from 'lucide-react'
import { getRevenueStats, getCars, getReservations } from '@/app/actions'

export async function StatsCards() {
  const [revenueStats, reservations, cars] = await Promise.all([
    getRevenueStats(),
    getReservations(),
    getCars(),
  ])

  const now = new Date()
  const thisMonth = reservations.filter((r) => {
    const date = new Date(r.created_at || r.createdAt)
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  })

  const monthlyRevenue = thisMonth
    .filter((r) => r.status === 'confirmed')
    .reduce((sum, r) => sum + (r.total_price || r.totalPrice || 0), 0)

  const stats = {
    totalRevenue: revenueStats.confirmedRevenue,
    monthlyRevenue,
    activeReservations: revenueStats.activeReservations,
    pendingReservations: revenueStats.pendingReservations,
    totalCars: cars.length,
    availableCars: cars.length,
  }

  const statItems = [
    {
      label: 'Revenus total',
      value: `${Math.round(stats.totalRevenue).toLocaleString('fr-FR')} EUR`,
      sublabel: `${Math.round(stats.monthlyRevenue).toLocaleString('fr-FR')} EUR ce mois`,
      icon: Euro,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Réservations actives',
      value: stats.activeReservations,
      sublabel: `${stats.pendingReservations} en attente`,
      icon: Calendar,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
    },
    {
      label: 'Flotte de véhicules',
      value: stats.totalCars,
      sublabel: `${stats.availableCars} disponibles`,
      icon: Car,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Taux de réservation',
      value: `${stats.totalCars > 0 ? Math.round((stats.activeReservations / stats.totalCars) * 100) : 0}%`,
      sublabel: 'Véhicules réservés',
      icon: TrendingUp,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat) => (
        <Card key={stat.label} className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.sublabel}</p>
              </div>
              <div className={`rounded-lg p-2.5 ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
