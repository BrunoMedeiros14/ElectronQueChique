import {createRoute, Outlet} from "@tanstack/react-router";
import {painelRoute} from "../../routes";

export const estoqueRoute = createRoute({
  getParentRoute: () => painelRoute,
  path: '/estoque',
  component: EstoqueRouteComponent,
})

function EstoqueRouteComponent() {
  return <>
    <Outlet/>
  </>
}