import { Link, createRoute } from "@tanstack/react-router";
import { clientesRoute } from ".";
import { Cliente } from "../../../shared/models/Cliente";

export const clientesCadastroRoute = createRoute({
  getParentRoute: () => clientesRoute,
  path: "$clienteId",
  component: ClientesCadastro,
});

function ClientesCadastro() {
  // const { clienteId } = clientesCadastroRoute.useParams()
  // useLinkProps({to})
  const cliente: Cliente = {dataNascimento: new Date, email: "", endereco: "", nome: "", telefone: ""}
  return (
    <>
      <div className="pb-2 flex justify-between items-center">
        <h1 className="font-bold text-2xl">Cadastrar Cliente</h1>
      </div>

      <form className="mx-auto w-9/12 grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label
            htmlFor="nome"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Id
          </label>
          <input
            type="text"
            id="id"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5"
            value={cliente.id}
            disabled
          />
        </div>
        <div>
          <label
            htmlFor="nome"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Nome
          </label>
          <input
            type="text"
            id="nome"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Fulano"
            required
          />
        </div>
        <div>
          <label
            htmlFor="telefone"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Telefone
          </label>
          <input
            type="text"
            id="telefone"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            E-mail
          </label>
          <input
            type="text"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div>
          <label
            htmlFor="nascimento"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Data de nascimento
          </label>
          <input
            type="date"
            id="nascimento"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>

        <div className="col-span-2">
          <label
            htmlFor="endereco"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Endereço
          </label>
          <input
            type="text"
            id="endereco"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>

        <div className="text-end col-span-2">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2"
          >
            Adicionar
          </button>
          <Link to="/clientes/">
            <button
              type="button"
              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Cancelar
            </button>
          </Link>
        </div>
      </form>
    </>
  );
}
