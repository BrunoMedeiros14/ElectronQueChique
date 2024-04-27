import { Outlet, createRoute } from "@tanstack/react-router";
import { painelRoute } from "../../routes";

export const clientesRoute = createRoute({
  getParentRoute: () => painelRoute,
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