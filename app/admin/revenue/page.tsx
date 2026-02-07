'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import { TrendingUp, TrendingDown, Euro, Calendar, Car } from 'lucide-react'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

export default function RevenuePage() {
  const [reservations, setReservations] = useState<any[]>([])
  const [cars, setCars] = useState<any[]>([])
  const [revenueByCategory, setRevenueByCategory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRes, carsRes] = await Promise.all([
          fetch('/api/reservations'),
          fetch('/api/cars'),
        ])
        
        if (resRes.ok && carsRes.ok) {
          const reservationsData = await resRes.json()
          const carsData = await carsRes.json()
          setReservations(reservationsData)
          setCars(carsData)

          // Calculate revenue by category
          const categoryMap = new Map()
          reservationsData.forEach((r: any) => {
            if (r.status === 'completed' || r.status === 'confirmed') {
              const car = carsData.find((c: any) => c.id === r.car_id)
              const category = car?.category || 'Unknown'
              const current = categoryMap.get(category) || 0
              categoryMap.set(category, current + (r.total_price || 0))
            }
          })
          
          const categoryData = Array.from(categoryMap.entries()).map(([category, revenue]) => ({
            category,
            revenue,
          }))
          setRevenueByCategory(categoryData)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Chargement des données...</p>
      </div>
    )
  }

  const validReservations = reservations.filter(
    (r) => r.status === 'completed' || r.status === 'confirmed'
  )

  // Monthly revenue data (last 6 months)
  const now = new Date()
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    const monthReservations = validReservations.filter((r) => {
      const rDate = new Date(r.created_at || r.createdAt)
      return rDate.getMonth() === date.getMonth() && rDate.getFullYear() === date.getFullYear()
    })
    const revenue = monthReservations.reduce((sum, r) => sum + (r.total_price || r.totalPrice || 0), 0)
    return {
      month: date.toLocaleDateString('fr-FR', { month: 'short' }),
      revenue: Math.round(revenue),
      reservations: monthReservations.length,
    }
  })

  // Totals
  const totalRevenue = validReservations.reduce((sum, r) => sum + (r.total_price || r.totalPrice || 0), 0)
  const averagePerReservation = validReservations.length > 0 ? Math.round(totalRevenue / validReservations.length) : 0

  // This month vs last month
  const thisMonthReservations = validReservations.filter((r) => {
    const date = new Date(r.created_at || r.createdAt)
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  })
  const lastMonthReservations = validReservations.filter((r) => {
    const date = new Date(r.created_at || r.createdAt)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear()
  })

  const thisMonthRevenue = thisMonthReservations.reduce((sum, r) => sum + (r.total_price || r.totalPrice || 0), 0)
  const lastMonthRevenue = lastMonthReservations.reduce((sum, r) => sum + (r.total_price || r.totalPrice || 0), 0)
  const growthPercent = lastMonthRevenue > 0 ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) : 0

  // Top performing cars
  const carRevenueMap = new Map<string, { revenue: number; count: number; name: string }>()
  validReservations.forEach((r) => {
    const carId = r.car_id || r.carId
    const carName = r.cars?.name || r.car?.name || 'Unknown'
    const current = carRevenueMap.get(carId) || { revenue: 0, count: 0, name: carName }
    carRevenueMap.set(carId, {
      revenue: current.revenue + (r.total_price || r.totalPrice || 0),
      count: current.count + 1,
      name: carName,
    })
  })
  const topCars = Array.from(carRevenueMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>Revenus</h1>
        <p className='mt-1 text-muted-foreground'>
          Analyse détaillée de vos revenus et performances
        </p>
      </div>

      {/* Summary Cards */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card className='border-border/50'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>Revenus totaux</p>
                <p className='mt-1 text-2xl font-bold'>{Math.round(totalRevenue).toLocaleString('fr-FR')} EUR</p>
              </div>
              <div className='rounded-lg bg-emerald-50 p-2.5'>
                <Euro className='h-5 w-5 text-emerald-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-border/50'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>Ce mois</p>
                <p className='mt-1 text-2xl font-bold'>{Math.round(thisMonthRevenue).toLocaleString('fr-FR')} EUR</p>
                <div className={`mt-1 flex items-center gap-1 text-xs ${growthPercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {growthPercent >= 0 ? (
                    <TrendingUp className='h-3 w-3' />
                  ) : (
                    <TrendingDown className='h-3 w-3' />
                  )}
                  <span>
                    {growthPercent >= 0 ? '+' : ''}
                    {growthPercent}% vs mois dernier
                  </span>
                </div>
              </div>
              <div className='rounded-lg bg-sky-50 p-2.5'>
                <Calendar className='h-5 w-5 text-sky-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-border/50'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>Moyenne / réservation</p>
                <p className='mt-1 text-2xl font-bold'>{averagePerReservation} EUR</p>
              </div>
              <div className='rounded-lg bg-amber-50 p-2.5'>
                <TrendingUp className='h-5 w-5 text-amber-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-border/50'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>Véhicules actifs</p>
                <p className='mt-1 text-2xl font-bold'>{cars.length}</p>
              </div>
              <div className='rounded-lg bg-rose-50 p-2.5'>
                <Car className='h-5 w-5 text-rose-600' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Monthly Revenue Chart */}
        <Card className='border-border/50'>
          <CardHeader>
            <CardTitle>Revenus mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray='3 3' className='stroke-border' />
                  <XAxis dataKey='month' className='text-xs' tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className='text-xs' tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value} EUR`, 'Revenus']}
                  />
                  <Bar dataKey='revenue' fill='#10b981' radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Category */}
        <Card className='border-border/50'>
          <CardHeader>
            <CardTitle>Revenus par catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={revenueByCategory}
                    cx='50%'
                    cy='50%'
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey='revenue'
                    label={({ category, revenue }) => `${category} (${Math.round(revenue)} EUR)`}
                  >
                    {revenueByCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value} EUR`, 'Revenus']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reservations Trend */}
      <Card className='border-border/50'>
        <CardHeader>
          <CardTitle>Tendance des réservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray='3 3' className='stroke-border' />
                <XAxis dataKey='month' className='text-xs' tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis yAxisId='left' className='text-xs' tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis
                  yAxisId='right'
                  orientation='right'
                  className='text-xs'
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  yAxisId='left'
                  type='monotone'
                  dataKey='revenue'
                  name='Revenus (EUR)'
                  stroke='#10b981'
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                />
                <Line
                  yAxisId='right'
                  type='monotone'
                  dataKey='reservations'
                  name='Réservations'
                  stroke='#3b82f6'
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Cars */}
      <Card className='border-border/50'>
        <CardHeader>
          <CardTitle>Véhicules les plus rentables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {topCars.map((car, index) => (
              <div key={car.name} className='flex items-center gap-4'>
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground'>
                  {index + 1}
                </div>
                <div className='flex-1'>
                  <p className='font-medium text-foreground'>{car.name}</p>
                  <p className='text-sm text-muted-foreground'>
                    {car.count} réservation{car.count > 1 ? 's' : ''}
                  </p>
                </div>
                <p className='text-lg font-bold text-emerald-600'>{Math.round(car.revenue).toLocaleString('fr-FR')} EUR</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
