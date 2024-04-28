import {createRoute, Outlet} from "@tanstack/react-router";
import {painelRoute} from "../../routes";

export const caixasRoute = createRoute({
  getParentRoute: () => painelRoute,
  path: '/caixas',
  component: CaixasRouteComponent,
})

function CaixasRouteComponent() {
  return <>
    <Outlet/>
  </>
}