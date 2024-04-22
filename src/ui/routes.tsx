import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Package2, ShoppingBag, Users, Wallet } from "lucide-react";
import { SidebarLi } from "./components/SidebarLi/SidebarLi";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <aside
        id="sidebar-multi-level-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-100">
          <ul className="space-y-2 font-medium">
            <SidebarLi icone={<ShoppingBag />} texto="Caixa" rota="/caixa" />
            <SidebarLi icone={<Package2 />} texto="Estoque" rota="/estoque" />
            <SidebarLi icone={<Users />} texto="Clientes" rota="/clientes" />
            <SidebarLi icone={<Wallet />} texto="Contas" rota="/contas" />
          </ul>
        </div>
      </aside>

      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
          <Outlet />
        </div>
      </div>
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function Index() {
    return <div>/</div>;
  },
});

const caixaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/caixa",
  component: function About() {
    return <div>caixa</div>;
  },
});

const estoqueRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/estoque",
  component: function About() {
    return <div>estoque</div>;
  },
});

const clientesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clientes",
  component: function About() {
    return <div>clientes</div>;
  },
});

const contasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contas",
  component: function About() {
    return <div>contas</div>;
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  caixaRoute,
  estoqueRoute,
  clientesRoute,
  contasRoute,
]);

export const router = createRouter({ routeTree });
