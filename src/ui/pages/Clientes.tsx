import { UserPlus } from "lucide-react";

export function Clientes() {
  return (
    <>
      <div className="pb-2 flex justify-between items-center">
        <h1 className="font-bold text-2xl">Clientes</h1>
        <button
          type="button"
          className="text-white bg-gradient-to-r from-blue-400 to-blue-500 hover:bg-gradient-to-br flex gap-2 items-center
          focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          <UserPlus /> Adicionar novo
        </button>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-50 uppercase bg-blue-400">
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
              <th scope="col" className="px-6 py-3 rounded-e-lg" />
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-slate-50">
              <th
                scope="row"
                className="rounded-s-lg px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                1
              </th>
              <td className="px-6 py-4">Bruno</td>
              <td className="px-6 py-4">01/01/2000</td>
              <td className="px-6 py-4">Gotham City</td>
              <td className="px-6 py-4">31 11111-1234</td>
              <td className="px-6 py-4">burni@gmail.com</td>
              <td className="rounded-e-lg px-6 py-4">
                <a
                  href="#"
                  className="font-medium text-yellow-500 hover:underline me-2"
                >
                  Editar
                </a>
                <a
                  href="#"
                  className="font-medium text-red-600 hover:underline"
                >
                  Remove
                </a>
              </td>
            </tr>
            <tr className="hover:bg-slate-50">
              <th
                scope="row"
                className="rounded-s-lg px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                2
              </th>
              <td className="px-6 py-4">Bruno</td>
              <td className="px-6 py-4">01/01/2000</td>
              <td className="px-6 py-4">Gotham City</td>
              <td className="px-6 py-4">31 4002-8922</td>
              <td className="px-6 py-4">burni@gmail.com</td>
              <td className="rounded-e-lg px-6 py-4">
                <a
                  href="#"
                  className="font-medium text-yellow-500 hover:underline me-2"
                >
                  Editar
                </a>
                <a
                  href="#"
                  className="font-medium text-red-600 hover:underline"
                >
                  Remove
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
