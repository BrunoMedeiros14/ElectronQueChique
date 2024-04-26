import {
  createRootRoute,
  createRoute,
  createRouter
} from "@tanstack/react-router";
import { Sidebar } from "./components/Sidebar";
import { Caixa } from "./pages/Caixa";
import { Clientes } from "./pages/Clientes";
import { Contas } from "./pages/Contas";
import { Estoque } from "./pages/Estoque";

const rootRoute = createRootRoute({
  component: () => <Sidebar />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function Index() {
    return <h1>Tela de boas vindas!</h1>;
  },
});

const caixaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/caixa",
  component: () => <Caixa />,
});

const estoqueRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/estoque",
  component: () => <Estoque />,
});

const clientesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clientes",
  component: () => <Clientes />,
});

const contasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contas",
  component: () => <Contas />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  caixaRoute,
  estoqueRoute,
  clientesRoute,
  contasRoute,
]);

export const router = createRouter({ routeTree });
