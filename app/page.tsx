'use client'

import { useState, useMemo, useEffect } from 'react'
import { Car } from '@/lib/types'
import { SiteHeader } from '@/components/site-header'
import { CarCard } from '@/components/car-card'
import { CarFilters } from '@/components/car-filters'
import { ReservationModal } from '@/components/reservation-modal'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Suspense } from 'react'
import { getCars } from '@/app/actions'

export default function HomePage() {
  const [cars, setCars] = useState<Car[]>([])
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Car['category'] | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadCars = async () => {
      const data = await getCars()
      setCars(data)
    }
    loadCars()
  }, [])

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(cars.map((car) => car.category))]
    return uniqueCategories
  }, [cars])

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesCategory = selectedCategory === 'all' || car.category === selectedCategory
      const matchesSearch =
        searchQuery === '' ||
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [cars, selectedCategory, searchQuery])

  const handleReserve = (car: Car) => {
    setSelectedCar(car)
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Louez la voiture de vos rêves
              </h1>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
                Découvrez notre flotte de véhicules premium disponibles à la location.
                Des citadines économiques aux voitures de sport, trouvez le véhicule parfait pour vos besoins.
              </p>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,var(--primary)_0%,transparent_100%)] opacity-[0.03]" />
      </section>

      {/* Cars Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Nos véhicules disponibles</h2>
              <p className="mt-1 text-muted-foreground">
                {filteredCars.length} véhicule{filteredCars.length > 1 ? "s" : ""} disponible{filteredCars.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un véhicule..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="mb-8">
            <CarFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} onReserve={handleReserve} />
            ))}
          </div>

          {filteredCars.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">Aucun véhicule ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>&copy; 2026 AutoLoc. Tous droits réservés.</p>
        </div>
      </footer>

      <Suspense fallback={null}>
        <ReservationModal
          car={selectedCar}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      </Suspense>
    </div>
  )
}
