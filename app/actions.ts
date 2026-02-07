'use server'

import { createClient } from '@/lib/supabase/server'
import { seedCars } from '@/lib/db'

export async function getCars() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error

    // If no cars exist, seed them
    if (!data || data.length === 0) {
      await seedCars()
      const { data: seededData, error: seedError } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: true })

      if (seedError) throw seedError
      return seededData || []
    }

    return data || []
  } catch (error) {
    console.error('[v0] Error fetching cars:', error)
    return []
  }
}

export async function createReservation(
  carId: string,
  firstName: string,
  lastName: string,
  phone: string,
  email: string | null,
  startDate: string,
  endDate: string,
  totalPrice: number
) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('reservations')
      .insert([
        {
          car_id: carId,
          first_name: firstName,
          last_name: lastName,
          phone,
          email: email || null,
          start_date: startDate,
          end_date: endDate,
          total_price: totalPrice,
          status: 'pending',
        },
      ])
      .select()

    if (error) throw error

    return { success: true, data: data?.[0] }
  } catch (error) {
    console.error('[v0] Error creating reservation:', error)
    return { success: false, error: 'Failed to create reservation' }
  }
}

export async function getReservations(status?: string) {
  const supabase = await createClient()

  try {
    let query = supabase
      .from('reservations')
      .select(
        `
        *,
        cars:car_id (*)
      `
      )
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('[v0] Error fetching reservations:', error)
    return []
  }
}

export async function updateReservationStatus(id: string, status: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('reservations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error

    return { success: true, data: data?.[0] }
  } catch (error) {
    console.error('[v0] Error updating reservation:', error)
    return { success: false, error: 'Failed to update reservation' }
  }
}

export async function getRevenueStats() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('total_price, status, start_date')

    if (error) throw error

    const reservations = data || []

    const totalRevenue = reservations.reduce((sum, r) => sum + (r.total_price || 0), 0)
    const confirmedRevenue = reservations
      .filter((r) => r.status === 'confirmed')
      .reduce((sum, r) => sum + (r.total_price || 0), 0)
    const activeReservations = reservations.filter((r) => r.status === 'confirmed').length
    const pendingReservations = reservations.filter((r) => r.status === 'pending').length

    return {
      totalRevenue,
      confirmedRevenue,
      activeReservations,
      pendingReservations,
      totalReservations: reservations.length,
    }
  } catch (error) {
    console.error('[v0] Error fetching revenue stats:', error)
    return {
      totalRevenue: 0,
      confirmedRevenue: 0,
      activeReservations: 0,
      pendingReservations: 0,
      totalReservations: 0,
    }
  }
}

export async function getRevenueByDay() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('total_price, start_date, status')
      .eq('status', 'confirmed')

    if (error) throw error

    const revenueByDay: { [key: string]: number } = {}

    ;(data || []).forEach((reservation) => {
      const date = reservation.start_date
      revenueByDay[date] = (revenueByDay[date] || 0) + (reservation.total_price || 0)
    })

    return Object.entries(revenueByDay)
      .map(([date, revenue]) => ({
        date,
        revenue,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  } catch (error) {
    console.error('[v0] Error fetching revenue by day:', error)
    return []
  }
}

export async function getRevenueByCategory() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(
        `
        total_price,
        cars:car_id (category)
      `
      )
      .eq('status', 'confirmed')

    if (error) throw error

    const revenueByCategory: { [key: string]: number } = {}

    ;(data || []).forEach((reservation: any) => {
      const category = reservation.cars?.category || 'Unknown'
      revenueByCategory[category] = (revenueByCategory[category] || 0) + (reservation.total_price || 0)
    })

    return Object.entries(revenueByCategory).map(([category, revenue]) => ({
      category,
      revenue,
    }))
  } catch (error) {
    console.error('[v0] Error fetching revenue by category:', error)
    return []
  }
}

export async function getCarReservations(carId: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('car_id', carId)
      .order('start_date', { ascending: true })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('[v0] Error fetching car reservations:', error)
    return []
  }
}
