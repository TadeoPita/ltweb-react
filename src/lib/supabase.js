import { createClient } from '@supabase/supabase-js'
import { auth } from './firebase'

/* El cliente pide el token de Firebase en cada request (Third-Party Auth).
   Sin sesión de Firebase, Supabase no reconoce al usuario como autenticado
   y las políticas de escritura (RLS) lo rechazan. */
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    accessToken: async () => (await auth.currentUser?.getIdToken()) ?? null,
  },
)
