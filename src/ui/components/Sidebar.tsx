import { SidebarLi } from "@/components/SidebarLi";
import { Outlet } from "@tanstack/react-router";
import { Menu, Package2, ShoppingBag, Users, Wallet } from "lucide-react";
import { useState } from "react";

export const Sidebar = () => {
  const [menuAtivo, setMenuAtivo] = useState(true);

  return (
    <>
      <aside
        id="sidebar-multi-level-sidebar"
        className={`transition-all ease-linear fixed top-0 left-0 z-40 ${menuAtivo ? "w-64" : "w-16"} h-screen`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-100">
          <ul className="space-y-2 font-medium">
            <li className="flex h-12 justify-between items-center">
              {menuAtivo && (
                <img
                  src="/assets/images/Logo.png"
                  alt="Logomarca que Chique"
                  className="ps-2 h-full"
                />
              )}
              <a
                onClick={() => setMenuAtivo(!menuAtivo)}
                className="flex items-center p-2 text-gray-900 rounded-lg group [&.active]:bg-gray-200 [&.active]:bg-opacity-75 hover:bg-gray-200 w-fit right-0"
              >
                <Menu />
              </a>
            </li>
            <SidebarLi
              icone={<ShoppingBag />}
              texto="Caixa"
              rota="/caixa"
              ativo={menuAtivo}
            />
            <SidebarLi
              icone={<Package2 />}
              texto="Estoque"
              rota="/estoque"
              ativo={menuAtivo}
            />
            <SidebarLi
              icone={<Users />}
              texto="Clientes"
              rota="/clientes"
              ativo={menuAtivo}
            />
            <SidebarLi
              icone={<Wallet />}
              texto="Contas"
              rota="/contas"
              ativo={menuAtivo}
            />
          </ul>
        </div>
      </aside>

      <div className={`p-4 ${menuAtivo ? "ml-64" : "ml-16"}`}>
        <Outlet />
      </div>
    </>
  );
};
