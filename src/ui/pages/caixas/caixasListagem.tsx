import {Button} from "../../../ui/components/ui/button";
import {Table, TableBody, TableCell, TableRow,} from "../../../ui/components/ui/table";
import {escutarCliqueTeclado} from "../../../ui/hooks/escutarCliqueTeclado";
import {useMutation, useQueryClient, useSuspenseQuery,} from "@tanstack/react-query";
import {createRoute, useNavigate} from "@tanstack/react-router";
import {Trash2, UserPlus} from "lucide-react";
import {caixasRoute} from ".";
import {buscarVendas, removerVendaApi} from "./comunicacaoApiCaixa";

export const vendasListagemRoute = createRoute({
  getParentRoute: () => caixasRoute,
  path: "/",
  // @ts-ignore
  loader: ({context: {queryClient}}) =>
      queryClient.ensureQueryData(buscarVendas),
  component: VendasListagem,
});

function VendasListagem() {
  const {data: vendas, isFetched} = useSuspenseQuery(buscarVendas);
  const queryClient = useQueryClient();

  const removerVendaMutation = useMutation({
    mutationFn: removerVendaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["vendas"]});
    },
  });

  const navigate = useNavigate();

  const abrirCaixaCadastro = () => {
    window.open('/caminho/para/caixasCadastro', '_blank'); // substitua pelo caminho correto para a página de cadastro de caixa
  };

  escutarCliqueTeclado(abrirCaixaCadastro, ["F1"]);

  return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h1 className="font-semibold text-lg md:text-2xl">Vendas</h1>
          <Button onClick={abrirCaixaCadastro} className="ml-auto">
            <UserPlus className="mr-2"/>
            Abrir Caixa (F1)
          </Button>
        </div>
        <div className="border shadow-sm rounded-lg">
          <Table>
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
            <TableBody>
              {vendas.map(
                  ({id, dataVenda, email, endereco, nome, telefone}, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{id}</TableCell>
                        <TableCell className="hidden md:table-cell">{nome}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {gerarStringPorData(dataVenda) ?? "Não cadastrado."}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {endereco}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {telefone}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {email}
                        </TableCell>
                        <TableCell className="flex justify-end">
                          <Button
                              size="icon"
                              variant="outline"
                              onClick={() => removerVendaMutation.mutate(id)}
                              className="hover:text-red-500 hover:bg-background"
                          >
                            <Trash2 className="h-4 w-4"/>
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                  )
              )}
              {isFetched && vendas.length === 0 && (
                  <TableRow>
                    <TableCell
                        colSpan={7}
                        className="text-center uppercase text-slate-600 font-bold"
                    >
                      Nenhuma venda cadastrada
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
  );
}