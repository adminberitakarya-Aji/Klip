// @klip/supabase
// Main entry point — re-export everything.

export { createClient, getSupabase } from './client'
export { signUp, signIn, signOut, getCurrentUser, getCurrentProfile, onAuthStateChange } from './auth'
export type {
  Database,
  Profile,
  Clip,
  Comment,
  Like,
  Follow,
  ClipWithProfile,
  CommentWithProfile,
  ProfileWithStats,
} from './types'
