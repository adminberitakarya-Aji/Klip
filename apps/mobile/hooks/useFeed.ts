import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@klip/api";

export function useFeed(userId?: string) {
  return useQuery({
    queryKey: ["feed"],
    queryFn: () => api.getFeed({ userId }),
    staleTime: 60 * 1000,
  });
}

export function useInfiniteFeed(userId?: string) {
  return useQuery({
    queryKey: ["feed", "infinite"],
    queryFn: async () => {
      const data = await api.getFeed({ userId });
      return data.clips;
    },
    staleTime: 60 * 1000,
  });
}

export function useLikeClip(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clipId: string) => {
      if (!userId) throw new Error("Must be logged in to like");
      return api.likeClip(clipId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}

export function useComments(clipId: string) {
  return useQuery({
    queryKey: ["comments", clipId],
    queryFn: () => api.getComments(clipId),
    enabled: !!clipId,
  });
}

export function useAddComment(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clipId, text }: { clipId: string; text: string }) => {
      if (!userId) throw new Error("Must be logged in to comment");
      return api.addComment(clipId, userId, text);
    },
    onSuccess: (_, { clipId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", clipId] });
    },
  });
}
