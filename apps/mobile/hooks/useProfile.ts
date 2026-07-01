import { useQuery } from "@tanstack/react-query";
import { api } from "@klip/api";

export function useProfile(handle: string) {
  return useQuery({
    queryKey: ["profile", handle],
    queryFn: () => api.getProfile(handle),
    enabled: !!handle,
    staleTime: 5 * 60 * 1000,
  });
}
