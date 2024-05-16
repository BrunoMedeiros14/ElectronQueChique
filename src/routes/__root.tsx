import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router'
import type { AuthContext } from '../hooks/auth'

interface ContextoDeRoteamento {
  auth: AuthContext
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<ContextoDeRoteamento>()({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
      })
    } else {
      throw redirect({
        to: '/caixa',
      })
    }
  },
  component: () => (
    <>
      <Outlet />
      {/* <TanStackRouterDevtools initialIsOpen={false} /> */}
    </>
  ),
})
