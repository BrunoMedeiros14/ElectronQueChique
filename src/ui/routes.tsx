import {QueryClient} from "@tanstack/react-query";
import {createRootRouteWithContext, createRoute, Outlet,} from "@tanstack/react-router";
import {Sidebar} from "./components/Sidebar";
import {caixasRoute} from "./pages/caixas";
import {estoqueRoute} from "./pages/Estoque";
import {clientesRoute} from "./pages/clientes";
import {clientesCadastroRoute} from "./pages/clientes/clientesCadastro";
import {clientesListagemRoute} from "./pages/clientes/clientesListagem";
import {estoqueListagemRoute} from "../ui/pages/Estoque/estoqueListagem";
import {estoquesCadastroRoute} from "../ui/pages/Estoque/estoqueCadastro";
import {contasRoute} from "../ui/pages/contas";
import {contasListagemRoute} from "../ui/pages/contas/contasListagem";
import {contasCadastroRoute} from "../ui/pages/contas/contasCadastro";

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
    clientesRoute.addChildren([clientesListagemRoute, clientesCadastroRoute]),
    contasRoute.addChildren([contasListagemRoute, contasCadastroRoute]),
  ]),
]);
