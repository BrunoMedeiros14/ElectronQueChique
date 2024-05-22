import { lazy } from 'react'

export const TanStackRouterDevtools = lazy(() =>
  import('@tanstack/router-devtools').then((res) => ({
    default: res.TanStackRouterDevtools,
  })),
)
