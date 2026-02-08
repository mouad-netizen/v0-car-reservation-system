-- Create Cars Table
CREATE TABLE IF NOT EXISTS public.cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  category TEXT NOT NULL,
  year INTEGER NOT NULL,
  daily_price DECIMAL(10, 2) NOT NULL,
  seats INTEGER NOT NULL,
  transmission TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Reservations Table
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

-- Create Profiles Table for Admin Users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on Cars Table
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Cars policies (public can view all)
CREATE POLICY "Cars are viewable by everyone" ON public.cars
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert cars" ON public.cars
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update cars" ON public.cars
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Enable RLS on Reservations Table
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Reservations policies
CREATE POLICY "Anyone can insert reservations" ON public.reservations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Reservations are viewable by everyone for now" ON public.reservations
  FOR SELECT USING (true);

CREATE POLICY "Only admins can update reservation status" ON public.reservations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Enable RLS on Profiles Table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
