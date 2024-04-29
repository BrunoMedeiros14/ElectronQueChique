import {useMutation, useQueryClient, useSuspenseQuery,} from "@tanstack/react-query";
import {createRoute, useNavigate} from "@tanstack/react-router";
import {Pencil, Search, Trash2, UserPlus} from "lucide-react";
import {useRef, useState} from "react";
import {contasRoute} from ".";
import {Button} from "../../../ui/components/ui/button";
import {Dialog, DialogTrigger} from "../../../ui/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/components/ui/table";
import {escutarCliqueTeclado} from "../../../ui/hooks/escutarCliqueTeclado";
import {DialogCadastrarConta, gerarStringPorData} from "./contasCadastro";
import {buscarContas, removerContaApi} from "./comunicacaoApi";

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
  const [searchValue, setSearchValue] = useState('');

  // @ts-ignore
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredContas = contas.filter(conta =>
      conta.nome.toLowerCase().includes(searchValue.toLowerCase())
  );

  const removerContaMutation = useMutation({
    mutationFn: removerContaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["contas"]});
    },
  });

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const irParaPaginaCadastro = (idConta: string) =>
      navigate({to: "/contas/$contaId", params: {contaId: idConta}});

  escutarCliqueTeclado(() => {
    refBotaoCadastro.current.click();
  }, ["F1"]);

  return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h1 className="font-semibold text-lg md:text-2xl">Contas</h1>

          <div className="flex-grow mx-4">
            <div
                className="flex items-center border rounded-md h-10">
              <Search className="ml-2"/>
              <input
                  type="search"
                  placeholder="Pesquisar contas..."
                  className="flex-grow px-2 py-1 outline-none"
                  value={searchValue}
                  onChange={handleSearchChange}
              />
            </div>
          </div>

          <Dialog onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button ref={refBotaoCadastro}
                      className="ml-auto h-10">
                <UserPlus className="mr-2"/>
                Adicionar novo (F1)
              </Button>
            </DialogTrigger>
            {/* @ts-ignore */}
            <DialogCadastrarConta isOpen={isOpen}/>
          </Dialog>
        </div>

        <div className="border shadow-sm rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow
                  className="bg-primary hover:bg-primary/90 [&>*]:text-white [&>*]:uppercase [&>*]:font-semibold">
                <TableHead className="max-w-4">Id</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">
                  Valor
                </TableHead>
                <TableHead className="hidden md:table-cell">Descrição</TableHead>
                <TableHead className="hidden md:table-cell">Data Vencimento</TableHead>
                <TableHead className="hidden md:table-cell">Data Pagamento</TableHead>
                <TableHead className="hidden md:table-cell">Pago</TableHead>
                <TableHead/>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContas.map(({
                                     id,
                                     nome,
                                     valor,
                                     descricao,
                                     dataVencimento,
                                     dataPagamento,
                                     pago
                                   }, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-normal">{id}</TableCell>
                    <TableCell>{nome}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {valor}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {descricao}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {gerarStringPorData(dataVencimento) ?? "Não cadastrado."}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {gerarStringPorData(dataPagamento) ?? "Não cadastrado."}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {pago ? "Sim" : "Não"}
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <Button
                          size="icon"
                          variant="outline"
                          onClick={() => irParaPaginaCadastro(id.toString())}
                          className="hover:text-yellow-500 hover:bg-background"
                      >
                        <Pencil className="h-4 w-4"/>
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                          onClick={() => {
                            const confirmDelete = window.confirm("Você deseja realmente excluir esta conta?");
                            if (confirmDelete) {
                              removerContaMutation.mutate(id);
                            }
                          }}
                          className="ml-2 hover:text-red-500 hover:bg-background"
                          size="icon"
                          variant="outline"
                      >
                        <Trash2
                            className="h-4 w-4 hover:text-red-500"
                            color="red"/>
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
              ))}
              {isFetched && filteredContas.length === 0 && (
                  <TableRow>
                    <TableCell
                        colSpan={7}
                        className="text-center uppercase text-slate-600 font-bold"
                    >
                      Nenhuma conta encontrada
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
  );
}