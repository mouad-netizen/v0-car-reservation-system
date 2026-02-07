"use client"

import Image from "next/image"
import { Car } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Fuel, Settings2 } from "lucide-react"

interface CarCardProps {
  car: Car
  onReserve: (car: Car) => void
}

export function CarCard({ car, onReserve }: CarCardProps) {
  const categoryColors: Record<Car["category"], string> = {
    SUV: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    Berline: "bg-sky-500/10 text-sky-600 border-sky-200",
    Citadine: "bg-amber-500/10 text-amber-600 border-amber-200",
    Sport: "bg-rose-500/10 text-rose-600 border-rose-200",
    Utilitaire: "bg-slate-500/10 text-slate-600 border-slate-200",
  }

  return (
    <Card className="group overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={car.image || "/placeholder.svg"}
          alt={car.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge
          variant="outline"
          className={`absolute top-3 left-3 ${categoryColors[car.category]}`}
        >
          {car.category}
        </Badge>
      </div>
      <CardContent className="p-5">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{car.name}</h3>
            <p className="text-sm text-muted-foreground">{car.year}</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">{car.pricePerDay}</span>
            <span className="text-sm text-muted-foreground"> /jour</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{car.seats} places</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="h-4 w-4" />
            <span>{car.fuel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Settings2 className="h-4 w-4" />
            <span>{car.transmission}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button
          onClick={() => onReserve(car)}
          className="w-full"
          size="lg"
        >
          Réserver maintenant
        </Button>
      </CardFooter>
    </Card>
  )
}
