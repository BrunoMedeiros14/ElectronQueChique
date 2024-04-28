import {createRoute, Outlet} from "@tanstack/react-router";
import {painelRoute} from "../../routes";

export const contasRoute = createRoute({
  getParentRoute: () => painelRoute,
  path: '/contas',
  component: ContasRouteComponent,
})

function ContasRouteComponent() {
  return <>
    <Outlet/>
  </>
}