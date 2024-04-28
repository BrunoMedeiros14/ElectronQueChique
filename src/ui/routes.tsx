import {QueryClient} from "@tanstack/react-query";
import {createRootRouteWithContext, createRoute, Outlet,} from "@tanstack/react-router";
import {Sidebar} from "./components/Sidebar";
import {caixasRoute} from "./pages/caixas";
import {contasRoute} from "./pages/contas/Contas";
import {estoqueRoute} from "./pages/Produtos/Estoque";
import {clientesRoute} from "./pages/clientes";
import {clientesCadastroRoute} from "./pages/clientes/clientesCadastro";
import {clientesListagemRoute} from "./pages/clientes/clientesListagem";
import {caixasListagemRoute} from "../ui/pages/caixas/caixasListagem";
import {caixasCadastroRoute} from "../ui/pages/caixas/caixasCadastro";

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
    caixasRoute.addChildren([caixasListagemRoute, caixasCadastroRoute]),
    estoqueRoute,
    clientesRoute.addChildren([clientesListagemRoute, clientesCadastroRoute]),
    contasRoute,
  ]),
]);
