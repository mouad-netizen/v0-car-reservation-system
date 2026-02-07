import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error

    return Response.json(data || [])
  } catch (error) {
    console.error('[v0] Error fetching cars:', error)
    return Response.json({ error: 'Failed to fetch cars' }, { status: 500 })
  }
}
