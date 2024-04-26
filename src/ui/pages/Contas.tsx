import { Banknote, Pencil, Trash2 } from "lucide-react";

export function Contas() {
  return (
      <>
        <div className="pb-2 flex justify-between items-center">
          <h1 className="font-bold text-2xl">Contas</h1>
          <button
              type="button"
              className="text-white bg-gradient-to-r from-blue-400 to-blue-500 hover:bg-gradient-to-br flex gap-2 items-center
          focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center"
          >
            <Banknote /> Adicionar conta
          </button>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-50 uppercase bg-gradient-to-r from-blue-400 to-blue-500">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-s-lg">
                id
              </th>
              <th scope="col" className="px-6 py-3">
                nome
              </th>
              <th scope="col" className="px-6 py-3">
                descrição
              </th>
              <th scope="col" className="px-6 py-3">
                data de vencimento
              </th>
              <th scope="col" className="px-6 py-3">
                data de pagamento
              </th>
              <th scope="col" className="px-6 py-3">
                pago
              </th>
              <th scope="col" className="px-6 py-3 rounded-e-lg"/>
            </tr>
            </thead>
            <tbody>
            {Array.from({length: 5}, (_, i) => (
                <tr className="hover:bg-slate-50" key={i}>
                  <th
                      scope="row"
                      className="rounded-s-lg px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {i + 1}
                  </th>
                  <td className="px-6 py-4">Conta {i + 1}</td>
                  <td className="px-6 py-4">Descrição da conta {i + 1}</td>
                  <td className="px-6 py-4">01/01/2023</td>
                  <td className="px-6 py-4">01/02/2023</td>
                  <td className="px-6 py-4">{i % 2 === 0 ? 'Sim' : 'Não'}</td>
                  <td className="rounded-e-lg px-6 py-4">
                    <a
                        href="#"
                        className="font-medium text-yellow-500 hover:underline me-2 inline-flex items-center"
                    >
                      <Pencil size={15} strokeWidth={2} className="me-1"/> Editar
                    </a>

                    <a
                        href="#"
                        className="font-medium text-red-600 hover:underline inline-flex items-center"
                    >
                      <Trash2 size={15} strokeWidth={2} className="me-1"/> Apagar
                    </a>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </>
  );
}