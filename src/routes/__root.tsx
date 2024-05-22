import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type { AuthContext } from '@/hooks/auth'

interface ContextoDeRoteamento {
  auth: AuthContext
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<ContextoDeRoteamento>()({
  component: Outlet,
})
