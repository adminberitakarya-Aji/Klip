// @klip/api
// API layer backed by Supabase. Provides the same interface as before
// but queries the database directly instead of a REST endpoint.

import { getSupabase } from '@klip/supabase'
import type {
  ClipWithProfile,
  CommentWithProfile,
  ProfileWithStats,
} from '@klip/supabase'

// Re-export Supabase types for consumers
export type { Profile, Clip, Comment, Like, Follow } from '@klip/supabase'
export type { ClipWithProfile, CommentWithProfile, ProfileWithStats } from '@klip/supabase'

/**
 * Get paginated feed clips.
 * Returns clips ordered by newest first, with cursor-based pagination.
 */
export async function getFeed(params?: {
  cursor?: string
  limit?: number
  userId?: string
}): Promise<{ clips: ClipWithProfile[]; nextCursor?: string }> {
  const supabase = getSupabase()
  const limit = params?.limit ?? 10

  const { data, error } = await supabase.rpc('get_feed', {
    p_user_id: params?.userId ?? null,
    p_cursor: params?.cursor ?? null,
    p_limit: limit,
  })

  if (error) throw error

  const clips = (data ?? []) as ClipWithProfile[]
  const nextCursor =
    clips.length === limit ? clips[clips.length - 1]?.created_at : undefined

  return { clips, nextCursor }
}

/**
 * Get a user profile by handle, with their clips and stats.
 */
export async function getProfile(
  handle: string,
  currentUserId?: string
): Promise<{ profile: ProfileWithStats; clips: ClipWithProfile[] }> {
  const supabase = getSupabase()

  // Get profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('handle', handle)
    .single()

  if (profileError) throw profileError
  if (!profile) throw new Error(`Profile not found: ${handle}`)

  // Get stats
  const { data: stats, error: statsError } = await supabase.rpc(
    'get_profile_stats',
    {
      p_profile_id: profile.id,
      p_current_user_id: currentUserId ?? null,
    }
  )

  if (statsError) throw statsError

  const profileWithStats: ProfileWithStats = stats?.[0]
    ? { ...stats[0], ...profile }
    : {
        ...profile,
        followers_count: 0,
        following_count: 0,
        total_likes: 0,
        is_following: false,
      }

  // Get user's clips
  const { data: clips, error: clipsError } = await supabase
    .from('clips')
    .select('*, profiles(*)')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  if (clipsError) throw clipsError

  return {
    profile: profileWithStats,
    clips: (clips ?? []) as unknown as ClipWithProfile[],
  }
}

/**
 * Get comments for a clip.
 */
export async function getComments(
  clipId: string
): Promise<{ comments: CommentWithProfile[] }> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(id, handle, display_name, avatar_url, is_verified)')
    .eq('clip_id', clipId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return { comments: (data ?? []) as unknown as CommentWithProfile[] }
}

/**
 * Like a clip. If already liked, does nothing.
 */
export async function likeClip(
  clipId: string,
  userId: string
): Promise<{ success: boolean }> {
  const supabase = getSupabase()

  const { error } = await supabase
    .from('likes')
    .insert({ clip_id: clipId, user_id: userId })

  // Ignore duplicate (already liked)
  if (error && error.code !== '23505') throw error

  return { success: true }
}

/**
 * Unlike a clip.
 */
export async function unlikeClip(
  clipId: string,
  userId: string
): Promise<{ success: boolean }> {
  const supabase = getSupabase()

  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('clip_id', clipId)
    .eq('user_id', userId)

  if (error) throw error

  return { success: true }
}

/**
 * Add a comment to a clip.
 */
export async function addComment(
  clipId: string,
  userId: string,
  text: string
): Promise<{ comment: CommentWithProfile }> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('comments')
    .insert({ clip_id: clipId, user_id: userId, text })
    .select('*, profiles(id, handle, display_name, avatar_url, is_verified)')
    .single()

  if (error) throw error

  return { comment: data as unknown as CommentWithProfile }
}

/**
 * Follow a user.
 */
export async function followUser(
  followerId: string,
  followingId: string
): Promise<{ success: boolean }> {
  const supabase = getSupabase()

  const { error } = await supabase
    .from('follows')
    .insert({ follower_id: followerId, following_id: followingId })

  if (error && error.code !== '23505') throw error

  return { success: true }
}

/**
 * Unfollow a user.
 */
export async function unfollowUser(
  followerId: string,
  followingId: string
): Promise<{ success: boolean }> {
  const supabase = getSupabase()

  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId)

  if (error) throw error

  return { success: true }
}

// Legacy compatibility — keep the `api` object for existing consumers
export const api = {
  getFeed,
  getProfile,
  getComments,
  likeClip,
  addComment,
}
