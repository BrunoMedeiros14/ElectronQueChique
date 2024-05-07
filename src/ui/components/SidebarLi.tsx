import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type SidebarLiProps = {
  texto: string;
  rota: string;
  icone: ReactNode;
  ativo?: boolean;
};

export const SidebarLi = ({ texto, rota, icone, ativo }: SidebarLiProps) => {
  return (
    <li>
      <NavLink
        to={rota}
        className="flex items-center p-2 text-gray-900 rounded-lg group [&.active]:bg-gray-200 [&.active]:bg-opacity-75 hover:bg-gray-200"
      >
        {icone}
        {ativo && <span className="ms-3">{texto}</span>}
      </NavLink>
    </li>
  );
};
