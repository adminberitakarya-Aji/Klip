// @klip/supabase/client
// Shared Supabase client for the entire monorepo.
// Uses NEXT_PUBLIC_ env vars so it works in both client and server contexts.

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

const env: Record<string, string | undefined> =
  typeof globalThis !== 'undefined' &&
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).process?.env
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).process.env
    : {}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * Create a Supabase client instance.
 * Call this once at the app root and pass down, or use the singleton below.
 */
export function createClient() {
  return createSupabaseClient<Database>(
    supabaseUrl ?? 'http://localhost:54321',
    supabaseAnonKey ?? 'placeholder'
  )
}

/** Singleton client for convenience — safe for client-side usage. */
let _supabase: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient()
  }
  return _supabase
}
