'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // We use useState to ensure the QueryClient is created only once per session
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // Data is "fresh" for 5 minutes
        gcTime: 1000 * 60 * 30,    // Cache is kept for 30 minutes
        retry: 1,                 // Retry failed requests once
        refetchOnWindowFocus: false, // Don't refetch when user switches tabs
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}