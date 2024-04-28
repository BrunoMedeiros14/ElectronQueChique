import {createRoute, Outlet} from "@tanstack/react-router";
import {painelRoute} from "../../routes";

export const clientesRoute = createRoute({
  getParentRoute: () => painelRoute,
  path: '/clientes',
  component: ClientesRouteComponent,
})

function ClientesRouteComponent() {
  return <>
    <Outlet/>
  </>
}