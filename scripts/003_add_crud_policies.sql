-- Drop existing policies if they exist, then recreate
DO $$ BEGIN
  DROP POLICY IF EXISTS "cars_insert_public" ON public.cars;
  DROP POLICY IF EXISTS "cars_update_public" ON public.cars;
  DROP POLICY IF EXISTS "cars_delete_public" ON public.cars;
  DROP POLICY IF EXISTS "reservations_update_public" ON public.reservations;
  DROP POLICY IF EXISTS "reservations_delete_public" ON public.reservations;
END $$;

-- Add RLS policies for cars management (INSERT, UPDATE, DELETE)
CREATE POLICY "cars_insert_public" ON public.cars FOR INSERT WITH CHECK (true);
CREATE POLICY "cars_update_public" ON public.cars FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "cars_delete_public" ON public.cars FOR DELETE USING (true);

-- Add RLS policy for reservations UPDATE and DELETE
CREATE POLICY "reservations_update_public" ON public.reservations FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "reservations_delete_public" ON public.reservations FOR DELETE USING (true);
