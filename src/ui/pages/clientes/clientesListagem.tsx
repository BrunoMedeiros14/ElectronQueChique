import {useMutation, useQueryClient, useSuspenseQuery,} from "@tanstack/react-query";
import {createRoute, useNavigate} from "@tanstack/react-router";
import {Pencil, Search, Trash2, UserPlus} from "lucide-react";
import {useRef, useState} from "react";
import {clientesRoute} from ".";
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
import {DialogCadastrarCliente, gerarStringPorData} from "./clientesCadastro";
import {buscarClientes, removerClienteApi} from "./comunicacaoApi";

export const clientesListagemRoute = createRoute({
  getParentRoute: () => clientesRoute,
  path: "/",
  // @ts-ignore
  loader: ({context: {queryClient}}) =>
      queryClient.ensureQueryData(buscarClientes),
  component: ClientesListagem,
});

function ClientesListagem() {
  const {data: clientes, isFetched} = useSuspenseQuery(buscarClientes);
  const queryClient = useQueryClient();
  const refBotaoCadastro = useRef<HTMLButtonElement>();
  const [searchValue, setSearchValue] = useState(''); // Adicione um estado para o valor da pesquisa

  // @ts-ignore
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredClientes = clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(searchValue.toLowerCase())
  );

  const removerClienteMutation = useMutation({
    mutationFn: removerClienteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["clientes"]});
    },
  });

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const irParaPaginaCadastro = (idCliente: string) =>
      navigate({to: "/clientes/$clienteId", params: {clienteId: idCliente}});

  escutarCliqueTeclado(() => {
    refBotaoCadastro.current.click();
  }, ["F1"]);

  return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h1 className="font-semibold text-lg md:text-2xl h-10">Clientes</h1>

          <div className="flex-grow mx-4">
            <div className="flex items-center border rounded-md">
              <Search className="ml-2"/>
              <input
                  type="search"
                  placeholder="Pesquisar clientes..."
                  className="flex-grow px-2 py-1 outline-none"
                  value={searchValue}
                  onChange={handleSearchChange}
              />
            </div>
          </div>

          <Dialog onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button ref={refBotaoCadastro} className="ml-auto h-10">
                <UserPlus className="mr-2"/>
                Adicionar novo (F1)
              </Button>
            </DialogTrigger>
            <DialogCadastrarCliente isOpen={isOpen}/>
          </Dialog>
        </div>

        <div className="border shadow-sm rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow
                  className="bg-primary hover:bg-primary/90 [&>*]:text-white [&>*]:uppercase [&>*]:font-semibold">
                <TableHead className="max-w-4">id</TableHead>
                <TableHead>nome</TableHead>
                <TableHead className="hidden md:table-cell">
                  data de nascimento
                </TableHead>
                <TableHead className="hidden md:table-cell">endereço</TableHead>
                <TableHead className="hidden md:table-cell">telefone</TableHead>
                <TableHead className="hidden md:table-cell">email</TableHead>
                <TableHead/>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map(({id, dataNascimento, email, endereco, nome, telefone}, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-normal">{id}</TableCell>
                    <TableCell>{nome}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {gerarStringPorData(dataNascimento) ?? "Não cadastrado."}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {endereco === "" ? "Não cadastrado." : endereco}
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
                          onClick={() => irParaPaginaCadastro(id.toString())}
                          className="hover:text-yellow-500 hover:bg-background"
                      >
                        <Pencil className="h-4 w-4"/>
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                          onClick={() => {
                            const confirmDelete = window.confirm("Você deseja realmente excluir este cliente?");
                            if (confirmDelete) {
                              removerClienteMutation.mutate(id);
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
              {isFetched && filteredClientes.length === 0 && (
                  <TableRow>
                    <TableCell
                        colSpan={7}
                        className="text-center uppercase text-slate-600 font-bold"
                    >
                      Nenhum cliente encontrado
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
  );
}
