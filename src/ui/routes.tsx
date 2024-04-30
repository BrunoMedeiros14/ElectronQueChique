import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, createRoute, Outlet, } from "@tanstack/react-router";
import { contasRoute } from "../ui/pages/contas";
import { contasCadastroRoute } from "../ui/pages/contas/contasCadastro";
import { contasListagemRoute } from "../ui/pages/contas/contasListagem";
import { estoquesCadastroRoute } from "../ui/pages/Estoque/estoqueCadastro";
import { estoqueListagemRoute } from "../ui/pages/Estoque/estoqueListagem";
import { Sidebar } from "./components/Sidebar";
import { caixasRoute } from "./pages/caixas";
import { clientesRoute } from "./pages/clientes/clientesPainel";
import { estoqueRoute } from "./pages/Estoque";

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
    estoqueRoute.addChildren([estoqueListagemRoute, estoquesCadastroRoute]),
    clientesRoute,
    contasRoute.addChildren([contasListagemRoute, contasCadastroRoute]),
  ]),
]);
