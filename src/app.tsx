import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { AuthProvider } from './hooks/auth'
import { useAuth } from './hooks/use-auth'
import { routeTree } from './routeTree.gen'

const memoryHistory = createMemoryHistory({
  initialEntries: ['/'],
})

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    auth: undefined,
    queryClient,
  },
  history: memoryHistory,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </QueryClientProvider>
  )
}
