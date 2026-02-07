-- Add RLS policies for cars management (INSERT, UPDATE, DELETE)
-- Using anon key for admin operations (no auth)
CREATE POLICY "cars_insert_public" ON public.cars FOR INSERT WITH CHECK (true);
CREATE POLICY "cars_update_public" ON public.cars FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "cars_delete_public" ON public.cars FOR DELETE USING (true);

-- Add RLS policy for reservations UPDATE (to change status)
CREATE POLICY "reservations_update_public" ON public.reservations FOR UPDATE USING (true) WITH CHECK (true);
