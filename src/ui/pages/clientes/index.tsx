import { Outlet, createRoute } from "@tanstack/react-router";
import { rootRoute } from "../Root";

export const clientesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/clientes',
  // loader: ({ context: { queryClient } }) =>
  //   queryClient.ensureQueryData(postsQueryOptions),
  component: ClientesRouteComponent,
})

function ClientesRouteComponent() {
  return <>
    <Outlet/>
  </>
}