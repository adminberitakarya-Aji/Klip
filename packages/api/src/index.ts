export interface User {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;
  followers: number;
  following: number;
  likes: number;
  isVerified?: boolean;
}

export interface Clip {
  id: string;
  userId: string;
  user: User;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  user: Pick<User, "id" | "handle" | "displayName" | "avatarUrl">;
  text: string;
  likes: number;
  createdAt: string;
}

declare const process: { env: { [key: string]: string | undefined } } | undefined;

const API_BASE =
  typeof process !== "undefined" && process?.env?.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "https://api.klip.app";

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

export const api = {
  getFeed: (cursor?: string) =>
    fetchApi<{ clips: Clip[]; nextCursor?: string }>(
      `/feed${cursor ? `?cursor=${cursor}` : ""}`
    ),

  getProfile: (handle: string) =>
    fetchApi<{ user: User; clips: Clip[] }>(`/users/${handle}`),

  getComments: (clipId: string) =>
    fetchApi<{ comments: Comment[] }>(`/clips/${clipId}/comments`),

  likeClip: (clipId: string) =>
    fetchApi<{ success: boolean }>(`/clips/${clipId}/like`, { method: "POST" }),

  addComment: (clipId: string, text: string) =>
    fetchApi<{ comment: Comment }>(`/clips/${clipId}/comments`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
};
