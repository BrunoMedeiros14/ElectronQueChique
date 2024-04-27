import { caixaRoute } from "./pages/Caixa";
import { clientesRoute } from "./pages/clientes";
import { clientesCadastroRoute } from "./pages/clientes/clientesCadastro";
import { clientesListagemRoute } from "./pages/clientes/clientesListagem";
import { contasRoute } from "./pages/Contas";
import { estoqueRoute } from "./pages/Estoque";
import { indexRoute } from "./pages/Home";
import { rootRoute } from "./pages/Root";

export const routeTree = rootRoute.addChildren([
  indexRoute,
  caixaRoute,
  estoqueRoute,
  clientesRoute.addChildren([clientesListagemRoute, clientesCadastroRoute]),
  contasRoute,
]);