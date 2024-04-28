import {Dialog, DialogTrigger} from "../../../ui/components/ui/dialog";
import {useMutation, useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import {createRoute, useNavigate} from "@tanstack/react-router";
import {Pencil, Table, Trash2, UserPlus} from "lucide-react";
import {contasRoute} from ".";
import {escutarCliqueTeclado} from "../../hooks/escutarCliqueTeclado";
import {buscarContas, removerContaApi} from "./comunicacaoApi";
import {useRef} from "react";
import {TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../components/ui/table";
import {DialogCadastrarConta2} from "../../../ui/pages/contas/contasCadastro";
import {Button} from "../../components/ui/button";

export const contasListagemRoute = createRoute({
  getParentRoute: () => contasRoute,
  path: "/",
  // @ts-ignore
  loader: ({context: {queryClient}}) =>
      queryClient.ensureQueryData(buscarContas),
  component: ContasListagem,
});

function ContasListagem() {
  const {data: contas, isFetched} = useSuspenseQuery(buscarContas);
  const queryClient = useQueryClient();
  const refBotaoCadastro = useRef<HTMLButtonElement>();

  const removerContaMutation = useMutation({
    mutationFn: removerContaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["contas"]});
    },
  });

  const navigate = useNavigate();

  const irParaPaginaCadastro = (idConta: string) =>
      navigate({to: "/conta/$contaId", params: {contaId: idConta}});

  escutarCliqueTeclado(() => {
    refBotaoCadastro.current.click()
  }, ["F1"]);


  return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h1 className="font-semibold text-lg md:text-2xl">Contas</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button ref={refBotaoCadastro} className="ml-auto">
                <UserPlus className="mr-2"/>
                Nova Conta (F1)
              </Button>
            </DialogTrigger>
            <DialogCadastrarConta2/>
          </Dialog>
        </div>

        <div className="border shadow-sm rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="max-w-4">id</TableHead>
                <TableHead className="">nome</TableHead>
                <TableHead className="hidden md:table-cell">
                  Descrição
                </TableHead>
                <TableHead className="hidden md:table-cell">Data Vencimento</TableHead>
                <TableHead className="hidden md:table-cell">Data Pagamento</TableHead>
                <TableHead className="hidden md:table-cell">Pago</TableHead>
                <TableHead/>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contas.map(
                  ({id, nome, descricao, dataVencimento, dataPagamento, pago}, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{id}</TableCell>
                        <TableCell className="hidden md:table-cell">{nome}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {descricao}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {dataVencimento.getFullYear()}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {dataPagamento.getFullYear()}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {pago}
                        </TableCell>
                        <TableCell className="flex justify-end">
                          <Button
                              // @ts-ignore
                              size="icon"
                              variant="outline"
                              onClick={() => irParaPaginaCadastro(id.toString())}
                              className="hover:text-yellow-500 hover:bg-background"
                          >
                            <Pencil className="h-4 w-4"/>
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                              onClick={() => removerContaMutation.mutate(id)}
                              className="ml-2 hover:text-red-500 hover:bg-background"
                              // @ts-ignore
                              size="icon"
                              variant="outline"
                          >
                            <Trash2 className="h-4 w-4"/>
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                  )
              )}
              {isFetched && contas.length === 0 && (
                  <TableRow>
                    <TableCell
                        colSpan={7}
                        className="text-center uppercase text-slate-600 font-bold"
                    >
                      Nenhuma conta cadastrada
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
  );
}
