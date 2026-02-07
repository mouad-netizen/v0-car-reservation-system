'use client'

import React from "react"
import { useState } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search, Check, X, Clock, CheckCircle2 } from 'lucide-react'

interface ReservationsTableProps {
  limit?: number
  showFilters?: boolean
  reservations?: any[]
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }> = {
  pending: { label: 'En attente', variant: 'secondary', icon: Clock },
  confirmed: { label: 'Confirmée', variant: 'default', icon: Check },
  completed: { label: 'Terminée', variant: 'outline', icon: CheckCircle2 },
  cancelled: { label: 'Annulée', variant: 'destructive', icon: X },
}

export function ReservationsTable({ limit, showFilters = false, reservations: initialReservations = [] }: ReservationsTableProps) {
  const [reservations, setReservations] = useState(initialReservations.map((r: any) => ({
    id: r.id,
    car_id: r.car_id,
    first_name: r.first_name || r.firstName || '',
    last_name: r.last_name || r.lastName || '',
    phone: r.phone || '',
    email: r.email || '',
    start_date: r.start_date || r.startDate || '',
    end_date: r.end_date || r.endDate || '',
    total_price: r.total_price || r.totalPrice || 0,
    status: r.status || 'pending',
    created_at: r.created_at || r.createdAt || '',
    cars: r.cars || r.car || null,
  })))
  const [statusFilter, setStatusFilter] = useState<string | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredReservations = reservations
    .filter((r) => statusFilter === 'all' || r.status === statusFilter)
    .filter((r) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      const firstName = r.first_name || r.firstName || ''
      const lastName = r.last_name || r.lastName || ''
      const carName = r.cars?.name || r.car?.name || ''
      const id = r.id || ''
      return (
        firstName.toLowerCase().includes(query) ||
        lastName.toLowerCase().includes(query) ||
        carName.toLowerCase().includes(query) ||
        id.toLowerCase().includes(query)
      )
    })
    .slice(0, limit || undefined)

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        setReservations(
          reservations.map((r) => (r.id === id ? { ...r, status } : r))
        )
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tous les statuts</SelectItem>
              <SelectItem value='pending'>En attente</SelectItem>
              <SelectItem value='confirmed'>Confirmée</SelectItem>
              <SelectItem value='completed'>Terminée</SelectItem>
              <SelectItem value='cancelled'>Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="hidden md:table-cell">Véhicule</TableHead>
              <TableHead className="hidden sm:table-cell">Dates</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.map((reservation) => {
              const status = statusConfig[reservation.status]
              const StatusIcon = status.icon
              const firstName = reservation.first_name || reservation.firstName || ''
              const lastName = reservation.last_name || reservation.lastName || ''
              const phone = reservation.phone || ''
              const carName = reservation.cars?.name || reservation.car?.name || ''
              const startDate = reservation.start_date || reservation.startDate || ''
              const endDate = reservation.end_date || reservation.endDate || ''
              const totalPrice = reservation.total_price || reservation.totalPrice || 0

              return (
                <TableRow key={reservation.id}>
                  <TableCell className="font-mono text-xs">{reservation.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {firstName} {lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{phone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="font-medium">{carName}</p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <p className="text-sm">
                      {new Date(startDate).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      au {new Date(endDate).toLocaleDateString('fr-FR')}
                    </p>
                  </TableCell>
                  <TableCell className="font-medium">{Math.round(totalPrice)} EUR</TableCell>
                  <TableCell>
                    <Badge variant={status.variant} className="gap-1">
                      <StatusIcon className="h-3 w-3" />
                      <span className="hidden sm:inline">{status.label}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => handleStatusChange(reservation.id, 'confirmed')}>
                          <Check className='mr-2 h-4 w-4' />
                          Confirmer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(reservation.id, 'completed')}>
                          <CheckCircle2 className='mr-2 h-4 w-4' />
                          Terminer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                          className='text-destructive'
                        >
                          <X className='mr-2 h-4 w-4' />
                          Annuler
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
            {filteredReservations.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  Aucune réservation trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
