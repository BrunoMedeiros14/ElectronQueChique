import {Link} from "@tanstack/react-router";
import {ReactNode} from "react";

type SidebarLiProps = {
  texto: string;
  rota: string;
  icone: ReactNode;
};

export const SidebarLi = ({texto, rota, icone}: SidebarLiProps) => {
  return (
      <li>
        <Link
            to={rota}
            className="flex items-center p-2 text-gray-900 rounded-lg group [&.active]:bg-gray-200 [&.active]:bg-opacity-75 hover:bg-gray-200"
        >
          {icone}
          <span className="ms-3">{texto}</span>
        </Link>
      </li>
  );
};
