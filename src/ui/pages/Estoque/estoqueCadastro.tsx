import {createRoute, Link} from "@tanstack/react-router";
import {estoqueRoute} from ".";

export const estoquesCadastroRoute = createRoute({
  getParentRoute: () => estoqueRoute,
  path: "$estoqueId",
  component: EstoqueCadastro,
});

function EstoqueCadastro() {
  const estoqueId =
      estoquesCadastroRoute.useParams().estoqueId === "new"
          ? null
          : estoquesCadastroRoute.useParams().estoqueId;

  return (
      <>
        <div className="pb-2 flex justify-between items-center">
          <h1 className="font-bold text-2xl">Cadastrar Estoque</h1>
        </div>

        <form className="mx-auto w-9/12 grid grid-cols-2 gap-3">
          {estoqueId && (
              <div className="col-span-2">
                <label htmlFor="id" className="block mb-2 text-sm font-medium text-gray-900">
                  Id
                </label>
                <input
                    type="text"
                    id="id"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5"
                    value={estoqueId}
                    disabled
                />
              </div>
          )}
          <div>
            <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900">
              Nome
            </label>
            <input
                type="text"
                id="nome"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Nome do Estoque"
                required
            />
          </div>
          <div>
            <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-900">
              Descrição
            </label>
            <input
                type="text"
                id="descricao"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Com arranhão e sem tampa"
                required
            />
          </div>
          <div>
            <label htmlFor="cor" className="block mb-2 text-sm font-medium text-gray-900">
              Cor
            </label>
            <input
                type="text"
                id="cor"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Preto, Branco, Verde, etc."
                required
            />
          </div>
          <div>
            <label htmlFor="tamanho" className="block mb-2 text-sm font-medium text-gray-900">
              Tamanho
            </label>
            <input
                type="text"
                id="tamanho"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="P, M, G, GG, 38, 42, 44 etc."
                required
            />
          </div>
          <div>
            <label htmlFor="quantidade" className="block mb-2 text-sm font-medium text-gray-900">
              Quantidade
            </label>
            <input
                type="number"
                id="quantidade"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="1 Par, 2 Unidades, 3 Caixas, etc."
                required
            />
          </div>
          <div>
            <label htmlFor="valorCompra" className="block mb-2 text-sm font-medium text-gray-900">
              Valor de Compra
            </label>
            <input
                type="number"
                id="valorCompra"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Valor de Compra"
                required
            />
          </div>
          <div>
            <label htmlFor="tecido" className="block mb-2 text-sm font-medium text-gray-900">
              Tecido
            </label>
            <input
                type="text"
                id="tecido"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Jeans, Algodão, Poliéster, etc."
            />
          </div>
          <div>
            <label htmlFor="fornecedor" className="block mb-2 text-sm font-medium text-gray-900">
              Fornecedor
            </label>
            <input
                type="text"
                id="fornecedor"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Nome do Fornecedor"
            />
          </div>
          <div>
            <label htmlFor="valorVenda" className="block mb-2 text-sm font-medium text-gray-900">
              Valor de Venda
            </label>
            <input
                type="number"
                id="valorVenda"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Valor de Venda"
            />
          </div>
          <div className="text-end col-span-2">
            <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2"
            >
              Cadastrar
            </button>
            <Link to="/estoque/">
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