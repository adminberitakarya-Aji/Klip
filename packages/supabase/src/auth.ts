// @klip/supabase/auth
// Auth helpers wrapping Supabase Auth.

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Profile } from './types'

type Client = SupabaseClient<Database>

/** Sign up with email + password, then create a profile row. */
export async function signUp(
  client: Client,
  params: { email: string; password: string; handle: string; displayName: string }
) {
  const { data, error } = await client.auth.signUp({
    email: params.email,
    password: params.password,
  })
  if (error) throw error
  if (!data.user) throw new Error('Sign up failed: no user returned')

  // Create profile row
  const { error: profileError } = await client.from('profiles').insert({
    id: data.user.id,
    handle: params.handle,
    display_name: params.displayName,
  })
  if (profileError) throw profileError

  return data
}

/** Sign in with email + password. */
export async function signIn(
  client: Client,
  params: { email: string; password: string }
) {
  const { data, error } = await client.auth.signInWithPassword({
    email: params.email,
    password: params.password,
  })
  if (error) throw error
  return data
}

/** Sign out the current user. */
export async function signOut(client: Client) {
  const { error } = await client.auth.signOut()
  if (error) throw error
}

/** Get the current authenticated user (from session). */
export async function getCurrentUser(client: Client) {
  const {
    data: { user },
    error,
  } = await client.auth.getUser()
  if (error) throw error
  return user
}

/** Get the current user's profile from the profiles table. */
export async function getCurrentProfile(client: Client): Promise<Profile | null> {
  const user = await getCurrentUser(client)
  if (!user) return null

  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

/** Listen to auth state changes. Returns an unsubscribe function. */
export function onAuthStateChange(
  client: Client,
  callback: (event: string, session: import('@supabase/supabase-js').Session | null) => void
) {
  const {
    data: { subscription },
  } = client.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
  return () => subscription.unsubscribe()
}
