import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Clip } from "@klip/api";

export function useFeed() {
  return useQuery({
    queryKey: ["feed"],
    queryFn: () => api.getFeed(),
    staleTime: 60 * 1000,
  });
}

export function useInfiniteFeed() {
  return useQuery({
    queryKey: ["feed", "infinite"],
    queryFn: async () => {
      const data = await api.getFeed();
      return data.clips;
    },
    staleTime: 60 * 1000,
  });
}

export function useLikeClip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clipId: string) => api.likeClip(clipId),
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

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clipId, text }: { clipId: string; text: string }) =>
      api.addComment(clipId, text),
    onSuccess: (_, { clipId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", clipId] });
    },
  });
}
