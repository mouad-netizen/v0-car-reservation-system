-- Create cars table
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

-- Create reservations table
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

-- Enable RLS on cars table
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Enable RLS on reservations table
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Create policies for cars (public read)
CREATE POLICY "cars_select_public" ON public.cars FOR SELECT USING (true);

-- Create policies for reservations (public insert, public select)
CREATE POLICY "reservations_insert_public" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "reservations_select_public" ON public.reservations FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reservations_car_id ON public.reservations(car_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_start_date ON public.reservations(start_date);
