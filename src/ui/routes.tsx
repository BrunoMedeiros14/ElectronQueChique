import { caixaRoute } from "./pages/Caixa";
import { clientesRoute } from "./pages/Clientes";
import { contasRoute } from "./pages/Contas";
import { estoqueRoute } from "./pages/Estoque";
import { indexRoute } from "./pages/Home";
import { rootRoute } from "./pages/Root";

export const routeTree = rootRoute.addChildren([
  indexRoute,
  caixaRoute,
  estoqueRoute,
  clientesRoute,
  contasRoute,
]);