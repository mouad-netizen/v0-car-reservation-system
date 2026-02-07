"use client"

import React from "react"
import { useState } from 'react'
import Image from 'next/image'
import { Car, ReservationFormData } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Calendar, Euro } from "lucide-react"
import { createReservation } from '@/lib/api' // Import createReservation function

interface ReservationModalProps {
  car: Car | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReservationModal({ car, open, onOpenChange }: ReservationModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ReservationFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    startDate: '',
    endDate: '',
  })

  const today = new Date().toISOString().split('T')[0]

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
  }

  const days = calculateDays()
  const totalPrice = car ? days * car.pricePerDay : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!car) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          car_id: car.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          email: formData.email || null,
          start_date: formData.startDate,
          end_date: formData.endDate,
          total_price: totalPrice,
        }),
      })

      if (response.ok) {
        setStep('success')
      } else {
        alert('Erreur lors de la création de la réservation')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Erreur lors de la création de la réservation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setStep('form')
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        startDate: '',
        endDate: '',
      })
    }, 200)
  }

  if (!car) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Réserver {car.name}</DialogTitle>
              <DialogDescription>
                Remplissez le formulaire ci-dessous pour réserver ce véhicule
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={car.image || "/placeholder.svg"}
                    alt={car.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-medium">{car.name}</span>
                    <Badge variant="secondary">{car.category}</Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Prix par jour</span>
                      <span className="font-medium text-foreground">{car.pricePerDay} EUR</span>
                    </div>
                    {days > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span>Durée</span>
                          <span className="font-medium text-foreground">{days} jour{days > 1 ? "s" : ""}</span>
                        </div>
                        <div className="border-t border-border pt-2">
                          <div className="flex justify-between text-base">
                            <span className="font-semibold text-foreground">Total</span>
                            <span className="font-bold text-primary">{totalPrice} EUR</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Jean"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Dupont"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="06 12 34 56 78"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (optionnel)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jean.dupont@email.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Date de début *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      required
                      min={today}
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Date de fin *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      required
                      min={formData.startDate || today}
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={days === 0 || isLoading}>
                  <Calendar className="mr-2 h-4 w-4" />
                  {isLoading ? 'Traitement...' : 'Confirmer la réservation'}
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <DialogTitle className="mb-2 text-2xl">Réservation confirmée !</DialogTitle>
            <DialogDescription className="mb-6">
              Votre demande de réservation pour la {car.name} a été enregistrée avec succès.
              Nous vous contacterons très prochainement pour confirmer les détails.
            </DialogDescription>
            <div className="mx-auto max-w-xs rounded-lg border border-border bg-muted/30 p-4">
              <div className="mb-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formData.startDate} - {formData.endDate}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-lg font-bold text-primary">
                <Euro className="h-5 w-5" />
                <span>{totalPrice} EUR</span>
              </div>
            </div>
            <Button onClick={handleClose} className="mt-6" size="lg">
              Fermer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
