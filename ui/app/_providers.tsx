"use client"

import { Container } from "@/components/Container"
import { client } from "@/lib/client"
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query"
import { FC, ReactNode, useEffect, useState } from "react"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
})

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <HealthCheck>{children}</HealthCheck>
    </QueryClientProvider>
  )
}

const CenteredContainer: FC<{ children: ReactNode }> = (props) => {
  return (
    <Container
      className="flex justify-center items-center min-h-screen"
      {...props}
    />
  )
}

const HealthCheck: FC<{ children: ReactNode }> = ({ children }) => {
  const [error, setError] = useState<boolean>(false)

  const { isLoading, isError, isSuccess } = useQuery({
    queryKey: ["health"],
    queryFn: () =>
      client.get<{ message: string }>("/_health").then((r) => r.data),
    refetchInterval: error ? 1000 : false,
  })

  useEffect(() => {
    if (isError) {
      setError(true)
    } else if (isSuccess) {
      setError(false)
    }
  }, [isError])

  if (isLoading || isError) {
    return <CenteredContainer>Waiting for server...</CenteredContainer>
  }

  return <>{children}</>
}
