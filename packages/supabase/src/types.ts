// @klip/supabase/types
// Database types matching the Supabase schema.
// After running the migration, regenerate with:
//   npx supabase gen types typescript --local > src/types.ts

export type Profile = {
  id: string
  handle: string
  display_name: string
  avatar_url: string | null
  bio: string | null
  is_verified: boolean
  created_at: string
}

export type Clip = {
  id: string
  user_id: string
  video_url: string
  thumbnail_url: string | null
  caption: string | null
  song: string | null
  created_at: string
}

export type Comment = {
  id: string
  clip_id: string
  user_id: string
  text: string
  created_at: string
}

export type Like = {
  clip_id: string
  user_id: string
  created_at: string
}

export type Follow = {
  follower_id: string
  following_id: string
  created_at: string
}

// Extended types with joins
export type ClipWithProfile = Clip & {
  profiles: Profile
  likes_count: number
  comments_count: number
  is_liked: boolean
}

export type CommentWithProfile = Comment & {
  profiles: Pick<Profile, 'id' | 'handle' | 'display_name' | 'avatar_url' | 'is_verified'>
}

export type ProfileWithStats = Profile & {
  followers_count: number
  following_count: number
  total_likes: number
  is_following: boolean
}

// Database interface for Supabase client generic
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Pick<Profile, 'id' | 'handle' | 'display_name'> &
          Partial<Pick<Profile, 'avatar_url' | 'bio' | 'is_verified'>> &
          { created_at?: string }
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      clips: {
        Row: Clip
        Insert: Omit<Clip, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Omit<Clip, 'id' | 'user_id' | 'created_at'>>
        Relationships: [
          {
            foreignKeyName: 'clips_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      comments: {
        Row: Comment
        Insert: Omit<Comment, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Pick<Comment, 'text'>
        Relationships: [
          {
            foreignKeyName: 'comments_clip_id_fkey'
            columns: ['clip_id']
            isOneToOne: false
            referencedRelation: 'clips'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comments_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      likes: {
        Row: Like
        Insert: Omit<Like, 'created_at'> & { created_at?: string }
        Update: Record<string, never>
        Relationships: [
          {
            foreignKeyName: 'likes_clip_id_fkey'
            columns: ['clip_id']
            isOneToOne: false
            referencedRelation: 'clips'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'likes_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      follows: {
        Row: Follow
        Insert: Omit<Follow, 'created_at'> & { created_at?: string }
        Update: Record<string, never>
        Relationships: [
          {
            foreignKeyName: 'follows_follower_id_fkey'
            columns: ['follower_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'follows_following_id_fkey'
            columns: ['following_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      get_feed: {
        Args: {
          p_user_id: string | null
          p_cursor: string | null
          p_limit: number
        }
        Returns: ClipWithProfile[]
      }
      get_profile_stats: {
        Args: {
          p_profile_id: string
          p_current_user_id: string | null
        }
        Returns: ProfileWithStats[]
      }
    }
    Enums: Record<string, never>
  }
}
