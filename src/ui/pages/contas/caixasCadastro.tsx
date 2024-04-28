import {createRoute, Link} from "@tanstack/react-router";
import {caixasRoute} from ".";

export const caixasCadastroRoute = createRoute({
  getParentRoute: () => caixasRoute,
  path: "$caixaId",
  component: CaixasCadastro,
});

function CaixasCadastro() {
  const caixaId =
      caixasCadastroRoute.useParams().caixaId === "new"
          ? null
          : caixasCadastroRoute.useParams().caixaId;

  return (
      <>
        <div className="pb-2 flex justify-between items-center">
          <h1 className="font-bold text-2xl">Cadastrar Caixa</h1>
        </div>

        <form className="mx-auto w-9/12 grid grid-cols-2 gap-3">
          {caixaId && (
              <div className="col-span-2">
                <label
                    htmlFor="id"
                    className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Id
                </label>
                <input
                    type="text"
                    id="id"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5"
                    value={caixaId}
                    disabled
                />
              </div>
          )}
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
                placeholder="Nome do Caixa"
                required
            />
          </div>
          <div>
            <label
                htmlFor="saldo"
                className="block mb-2 text-sm font-medium text-gray-900"
            >
              Saldo
            </label>
            <input
                type="number"
                id="saldo"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
            />
          </div>
          <div>
            <label
                htmlFor="dataAbertura"
                className="block mb-2 text-sm font-medium text-gray-900"
            >
              Data de Abertura
            </label>
            <input
                type="date"
                id="dataAbertura"
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
            <Link to="/caixas/">
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