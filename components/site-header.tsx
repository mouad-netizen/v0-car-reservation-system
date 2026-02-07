"use client"

import Link from "next/link"
import { Car, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">AutoLoc</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>01 23 45 67 89</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Paris, France</span>
          </div>
        </div>

        <Link href="/admin">
          <Button variant="outline" size="sm">
            Espace Admin
          </Button>
        </Link>
      </div>
    </header>
  )
}
