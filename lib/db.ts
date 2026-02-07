import { createClient } from '@/lib/supabase/server'

export async function initializeDatabase() {
  const supabase = await createClient()

  try {
    // Create cars table if it doesn't exist
    const { error: carsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.cars (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          brand TEXT NOT NULL,
          model TEXT NOT NULL,
          year INTEGER NOT NULL,
          category TEXT NOT NULL,
          price_per_day DECIMAL(10, 2) NOT NULL,
          transmission TEXT NOT NULL,
          fuel TEXT NOT NULL,
          seats INTEGER NOT NULL,
          image TEXT,
          available BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `,
    })

    // Create reservations table
    const { error: reservationsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.reservations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          total_price DECIMAL(10, 2) NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `,
    })

    console.log('[v0] Database initialized')
  } catch (error) {
    console.error('[v0] Database initialization error:', error)
  }
}

export async function seedCars() {
  const supabase = await createClient()

  const carsData = [
    {
      name: 'Peugeot 3008',
      brand: 'Peugeot',
      model: '3008',
      year: 2024,
      category: 'SUV',
      price_per_day: 85,
      transmission: 'Automatique',
      fuel: 'Essence',
      seats: 5,
      image: '/cars/peugeot-3008.jpg',
    },
    {
      name: 'Renault Clio',
      brand: 'Renault',
      model: 'Clio',
      year: 2023,
      category: 'Citadine',
      price_per_day: 45,
      transmission: 'Manuelle',
      fuel: 'Essence',
      seats: 5,
      image: '/cars/renault-clio.jpg',
    },
    {
      name: 'BMW Série 3',
      brand: 'BMW',
      model: 'Série 3',
      year: 2024,
      category: 'Berline',
      price_per_day: 120,
      transmission: 'Automatique',
      fuel: 'Essence',
      seats: 5,
      image: '/cars/bmw-serie3.jpg',
    },
    {
      name: 'Mercedes Classe A',
      brand: 'Mercedes',
      model: 'Classe A',
      year: 2023,
      category: 'Berline',
      price_per_day: 110,
      transmission: 'Automatique',
      fuel: 'Essence',
      seats: 5,
      image: '/cars/mercedes-a.jpg',
    },
    {
      name: 'Tesla Model 3',
      brand: 'Tesla',
      model: 'Model 3',
      year: 2024,
      category: 'Berline',
      price_per_day: 130,
      transmission: 'Automatique',
      fuel: 'Électrique',
      seats: 5,
      image: '/cars/tesla-model3.jpg',
    },
    {
      name: 'Citroën C3',
      brand: 'Citroën',
      model: 'C3',
      year: 2023,
      category: 'Citadine',
      price_per_day: 40,
      transmission: 'Manuelle',
      fuel: 'Essence',
      seats: 5,
      image: '/cars/citroen-c3.jpg',
    },
    {
      name: 'Audi A4',
      brand: 'Audi',
      model: 'A4',
      year: 2024,
      category: 'Berline',
      price_per_day: 115,
      transmission: 'Automatique',
      fuel: 'Essence',
      seats: 5,
      image: '/cars/audi-a4.jpg',
    },
    {
      name: 'Volkswagen Golf',
      brand: 'Volkswagen',
      model: 'Golf',
      year: 2023,
      category: 'Berline',
      price_per_day: 65,
      transmission: 'Manuelle',
      fuel: 'Essence',
      seats: 5,
      image: '/cars/vw-golf.jpg',
    },
    {
      name: 'Porsche 911',
      brand: 'Porsche',
      model: '911',
      year: 2024,
      category: 'Sport',
      price_per_day: 250,
      transmission: 'Automatique',
      fuel: 'Essence',
      seats: 2,
      image: '/cars/porsche-911.jpg',
    },
    {
      name: 'Ford Transit',
      brand: 'Ford',
      model: 'Transit',
      year: 2023,
      category: 'Utilitaire',
      price_per_day: 95,
      transmission: 'Manuelle',
      fuel: 'Diesel',
      seats: 3,
      image: '/cars/ford-transit.jpg',
    },
  ]

  try {
    // Check if cars already exist
    const { data: existingCars } = await supabase
      .from('cars')
      .select('id')
      .limit(1)

    if (!existingCars || existingCars.length === 0) {
      const { error } = await supabase.from('cars').insert(carsData)

      if (error) {
        console.error('[v0] Error seeding cars:', error)
      } else {
        console.log('[v0] Cars seeded successfully')
      }
    } else {
      console.log('[v0] Cars already exist in database')
    }
  } catch (error) {
    console.error('[v0] Seeding error:', error)
  }
}
