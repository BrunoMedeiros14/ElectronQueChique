import { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, createRoute } from "@tanstack/react-router";
import { Sidebar } from "./components/Sidebar";
import { caixaRoute } from "./pages/Caixa";
import { contasRoute } from "./pages/Contas";
import { estoqueRoute } from "./pages/Estoque";
import { clientesRoute } from "./pages/clientes";
import { clientesCadastroRoute } from "./pages/clientes/clientesCadastro";
import { clientesListagemRoute } from "./pages/clientes/clientesListagem";

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
    caixaRoute,
    estoqueRoute,
    clientesRoute.addChildren([clientesListagemRoute, clientesCadastroRoute]),
    contasRoute,
  ]),
]);
