import { useQuery } from "@tanstack/react-query"

export function useUser(username: string | undefined) {
  return useQuery({
    queryKey: ["user", username], // The cache key
    queryFn: async () => {
      const res = await fetch(`/api/user/${username}`)
      if (!res.ok) throw new Error("Failed to fetch user data")
      return res.json()
    },
    enabled: !!username, // Don't run the query until we have a username
  })
}