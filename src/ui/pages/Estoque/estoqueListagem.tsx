import {useSuspenseQuery} from "@tanstack/react-query";
import {createRoute, useNavigate} from "@tanstack/react-router";
import {Pencil, Trash2, UserPlus} from "lucide-react";
import {escutarCliqueTeclado} from "../../hooks/escutarCliqueTeclado";
import {buscarEstoque} from "./comunicacaoApiEstoque";
import {estoqueRoute} from "../../../ui/pages/Estoque/index";

export const estoqueListagemRoute = createRoute({
  getParentRoute: () => estoqueRoute,
  path: "/",
  // @ts-ignore
  loader: ({context: {queryClient}}) =>
      queryClient.ensureQueryData(buscarEstoque),
  component: EstoqueListagem,
});

function EstoqueListagem() {
  const caixasQuery = useSuspenseQuery(buscarEstoque);

  const navigate = useNavigate();

  const deletarEstoque = (estoqueId: number) =>
      window.apiEstoque.removerEstoque(estoqueId);

  const irParaPaginaCadastro = () =>
      navigate({to: "/estoque/estoqueId", params: {estoqueId: "new"}});

  escutarCliqueTeclado(() => {
    irParaPaginaCadastro();
  }, ["F1"]);

  return (
      <>
        <div className="pb-2 flex justify-between items-center">
          <h1 className="font-bold text-2xl">Caixas</h1>
          <button
              onClick={irParaPaginaCadastro}
              type="button"
              className="text-white bg-gradient-to-r from-blue-400 to-blue-500 hover:bg-gradient-to-br flex gap-2 items-center
              focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center"
          >
            <UserPlus/> Novo Item (F1)
          </button>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead
                className="text-xs text-gray-50 uppercase bg-gradient-to-r from-blue-400 to-blue-500">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-s-lg">
                Id
              </th>
              <th scope="col" className="px-6 py-3">
                Nome
              </th>
              <th scope="col" className="px-6 py-3">
                Descrição
              </th>
              <th scope="col" className="px-6 py-3">
                Cor
              </th>
              <th scope="col" className="px-6 py-3">
                Tamanho
              </th>
              <th scope="col" className="px-6 py-3">
                Vendido
              </th>
              <th scope="col" className="px-6 py-3">
                Tecido
              </th>
              <th scope="col" className="px-6 py-3">
                Fornecedor
              </th>
              <th scope="col" className="px-6 py-3">
                Quantidade
              </th>
              <th scope="col" className="px-6 py-3">
                Valor de Compra
              </th>
              <th scope="col" className="px-6 py-3">
                Valor de Venda
              </th>
              <th scope="col" className="px-6 py-3 rounded-e-lg"/>
            </tr>
            </thead>
            <tbody>
            {caixasQuery.data.map(
                ({id, dataNascimento, email, endereco, nome, telefone}, i) => (
                    <tr className="hover:bg-slate-50" key={i}>
                      <th
                          scope="row"
                          className="rounded-s-lg px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {id}
                      </th>
                      <td className="px-6 py-4">{nome}</td>
                      <td className="px-6 py-4">{dataNascimento.getFullYear()}</td>
                      <td className="px-6 py-4">{endereco}</td>
                      <td className="px-6 py-4">{telefone}</td>
                      <td className="px-6 py-4">{email}</td>
                      <td className="rounded-e-lg px-6 py-4">
                        <button
                            className="font-medium text-yellow-500 hover:underline me-2 inline-flex items-center">
                          <Pencil size={15} strokeWidth={2} className="me-1"/>{" "}
                          Editar
                        </button>

                        <button
                            onClick={() => deletarEstoque(id)}
                            className="font-medium text-red-600 hover:underline inline-flex items-center"
                        >
                          <Trash2 size={15} strokeWidth={2} className="me-1"/>
                          Apagar
                        </button>
                      </td>
                    </tr>
                )
            )}
            </tbody>
          </table>
        </div>
      </>
  );
}
