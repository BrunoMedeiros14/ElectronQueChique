import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter
} from "@tanstack/react-router";
import { Package2, ShoppingBag, UserPlus, Users, Wallet } from "lucide-react";
import { SidebarLi } from "./components/SidebarLi";

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
        <Outlet />
      </div>
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function Index() {
    return <h1>Home page</h1>
  },
});

const caixaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/caixa",
  component: function About() {
    return (
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
        caixa
      </div>
    );
  },
});

const estoqueRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/estoque",
  component: function About() {
    return (
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
        estoque
      </div>
    );
  },
});

const clientesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clientes",
  component: function About() {
    return (
      <>
        <div className="pb-2 flex justify-between items-center">
          <h1 className="font-bold text-2xl">Clientes</h1>
          <button
            type="button"
            className="text-white bg-gradient-to-r from-blue-400 to-blue-500 hover:bg-gradient-to-br flex gap-2 items-center
            focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            <UserPlus /> Adicionar novo
          </button>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-50 uppercase bg-blue-400">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-s-lg">
                  id
                </th>
                <th scope="col" className="px-6 py-3">
                  nome
                </th>
                <th scope="col" className="px-6 py-3">
                  data nascimento
                </th>
                <th scope="col" className="px-6 py-3">
                  endereço
                </th>
                <th scope="col" className="px-6 py-3">
                  telefone
                </th>
                <th scope="col" className="px-6 py-3">
                  email
                </th>
                <th scope="col" className="px-6 py-3 rounded-e-lg"/>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-slate-50">
                <th
                  scope="row"
                  className="rounded-s-lg px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  1
                </th>
                <td className="px-6 py-4">Bruno</td>
                <td className="px-6 py-4">01/01/2000</td>
                <td className="px-6 py-4">Gotham City</td>
                <td className="px-6 py-4">31 11111-1234</td>
                <td className="px-6 py-4">burni@gmail.com</td>
                <td className="rounded-e-lg px-6 py-4">
                  <a href="#" className="font-medium text-yellow-500 hover:underline me-2">Editar</a>
                  <a href="#" className="font-medium text-red-600 hover:underline">Remove</a>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <th
                  scope="row"
                  className="rounded-s-lg px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  2
                </th>
                <td className="px-6 py-4">Bruno</td>
                <td className="px-6 py-4">01/01/2000</td>
                <td className="px-6 py-4">Gotham City</td>
                <td className="px-6 py-4">31 4002-8922</td>
                <td className="px-6 py-4">burni@gmail.com</td>
                <td className="rounded-e-lg px-6 py-4">
                  <a href="#" className="font-medium text-yellow-500 hover:underline me-2">Editar</a>
                  <a href="#" className="font-medium text-red-600 hover:underline">Remove</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  },
});

const contasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contas",
  component: function About() {
    return (
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
        contas
      </div>
    );
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
