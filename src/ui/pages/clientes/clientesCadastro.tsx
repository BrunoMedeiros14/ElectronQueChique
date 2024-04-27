import { Link, createRoute } from "@tanstack/react-router";
import { IMaskInput } from 'react-imask';
import { clientesRoute } from ".";

export const clientesCadastroRoute = createRoute({
  getParentRoute: () => clientesRoute,
  path: "$clienteId",
  component: ClientesCadastro,
});

// const gerarClienteEmBranco = (): Cliente => ({
//   dataNascimento: new Date(),
//   email: "",
//   endereco: "",
//   nome: "",
//   telefone: "",
// });

function ClientesCadastro() {
  const clienteId =
    clientesCadastroRoute.useParams().clienteId === "new"
      ? null
      : clientesCadastroRoute.useParams().clienteId;

  return (
    <>
      <div className="pb-2 flex justify-between items-center">
        <h1 className="font-bold text-2xl">Cadastrar Cliente</h1>
      </div>

      <form className="mx-auto w-9/12 grid grid-cols-2 gap-3">
        {clienteId && (
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
              value={clienteId}
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
            placeholder="Fulano"
            required
          />
        </div>
        <div>

        
        <label
          htmlFor="tel"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Telephone mask
        </label>
        <IMaskInput
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          mask={"(00) 00000-0000"}
          
          radix="."
          value=""
          unmask={true} // true|false|'typed'
          // ref={ref}
          // inputRef={inputRef}  // access to nested input
          // DO NOT USE onChange TO HANDLE CHANGES!
          // USE onAccept INSTEAD
          onAccept={
            // depending on prop above first argument is
            // `value` if `unmask=false`,
            // `unmaskedValue` if `unmask=true`,
            // `typedValue` if `unmask='typed'`
            (value, mask) => console.log(value, mask)
          }
          // ...and more mask props in a guide

          // input props also available
          // placeholder='Enter number here'
        />
        </div>
        {/* <input
          type="text"
          name="input-mask"
          className="form-control"
          data-mask="(00) 0000-0000"
          data-mask-visible="true"
          placeholder="(00) 0000-0000"
          autocomplete="off"
        /> */}

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
