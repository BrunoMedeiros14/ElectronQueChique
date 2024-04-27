import {useSuspenseQuery} from "@tanstack/react-query";
import {createRoute, useNavigate} from "@tanstack/react-router";
import {Pencil, Trash2, UserPlus} from "lucide-react";
import {caixasRoute} from ".";
import {escutarCliqueTeclado} from "../../hooks/escutarCliqueTeclado";
import {buscarClientes} from "./comunicacaoApiCaixa";

export const clientesListagemRoute = createRoute({
  getParentRoute: () => caixasRoute,
  path: "/caixa",
  loader: ({context: {queryCaixa}}) =>
      queryCaixa.ensureQueryData(buscarCaixas),
  component: CaixasListagem,
});

function CaixasListagem() {
  const clientesQuery = useSuspenseQuery(buscarClientes);

  const navigate = useNavigate();

  const deletarCliente = (clienteId: number) =>
      window.apiCliente.removerCliente(clienteId);

  const irParaPaginaCadastro = () =>
      navigate({to: "/clientes/$clienteId", params: {clienteId: "new"}});

  escutarCliqueTeclado(() => {
    irParaPaginaCadastro();
  }, ["F1"]);

  return (
      <>
        <div className="pb-2 flex justify-between items-center">
          <h1 className="font-bold text-2xl">Clientes</h1>
          <button
              onClick={irParaPaginaCadastro}
              type="button"
              className="text-white bg-gradient-to-r from-blue-400 to-blue-500 hover:bg-gradient-to-br flex gap-2 items-center
              focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center"
          >
            <UserPlus/> Adicionar novo (F1)
          </button>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead
                className="text-xs text-gray-50 uppercase bg-gradient-to-r from-blue-400 to-blue-500">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-s-lg">
                id
              </th>
              <th scope="col" className="px-6 py-3">
                nome
              </th>
              <th scope="col" className="px-6 py-3">
                data de nascimento
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
            {clientesQuery.data.map(
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
                            onClick={() => deletarCliente(id)}
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
