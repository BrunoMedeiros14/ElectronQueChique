import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, createRoute, Outlet, } from "@tanstack/react-router";
import { Sidebar } from "./components/Sidebar";
import { caixasRoute } from "./pages/caixas";
import { clientesRoute } from "./pages/clientes/clientesPainel";
import { contasRoute } from "./pages/contas/contasPainel";
import { estoqueRoute } from "./pages/Estoque/estoquePainel";

export const rootRoute = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: Outlet,
});

export const painelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Sidebar,
});

export const routeTree = rootRoute.addChildren([
  painelRoute.addChildren([
    caixasRoute,
    estoqueRoute,
    clientesRoute,
    contasRoute
  ]),
]);
