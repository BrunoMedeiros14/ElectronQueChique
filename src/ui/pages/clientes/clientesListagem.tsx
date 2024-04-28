import {Button} from "../../../ui/components/ui/button";
import {Dialog, DialogTrigger} from "../../../ui/components/ui/dialog";
import {Table, TableBody, TableCell, TableRow,} from "../../../ui/components/ui/table";
import {escutarCliqueTeclado} from "../../../ui/hooks/escutarCliqueTeclado";
import {useMutation, useQueryClient, useSuspenseQuery,} from "@tanstack/react-query";
import {createRoute, useNavigate} from "@tanstack/react-router";
import {Pencil, Trash2, UserPlus} from "lucide-react";
import {useRef, useState} from "react";
import {clientesRoute} from ".";
import {DialogCadastrarCliente2, gerarStringPorData,} from "./clientesCadastro";
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
    refBotaoCadastro.current.click()
  }, ["F1"]);

  return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h1 className="font-semibold text-lg md:text-2xl">Clientes</h1>
          {/* <Button onClick={() => irParaPaginaCadastro("new")} className="ml-auto">
          <UserPlus className="mr-2" />
          Adicionar novo (F1)
        </Button> */}
          <Dialog onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button ref={refBotaoCadastro} className="ml-auto">
                <UserPlus className="mr-2"/>
                Adicionar novo (F1)
              </Button>
            </DialogTrigger>
            <DialogCadastrarCliente2 isOpen={isOpen}/>
          </Dialog>
        </div>

        <div className="border shadow-sm rounded-lg">
          <Table>
            <thead
                className="text-xs text-gray-50 uppercase bg-gradient-to-r from-blue-400 to-blue-500">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-s-lg">
                Id
              </th>
              <th scope="col" className="px-6 py-3">
                Nome
              </th>
              <th scope="col" className="px-6 py-3">
                Data de Nascimento
              </th>
              <th scope="col" className="px-6 py-3">
                Endereço
              </th>
              <th scope="col" className="px-6 py-3">
                Telefone
              </th>
              <th scope="col" className="px-6 py-3">
                E-mail
              </th>
              <th scope="col" className="px-6 py-3 rounded-e-lg"/>
            </tr>
            </thead>
            <TableBody>
              {clientes.map(
                  ({id, dataNascimento, email, endereco, nome, telefone}, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{id}</TableCell>
                        <TableCell className="hidden md:table-cell">{nome}</TableCell>
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
                              onClick={() => removerClienteMutation.mutate(id)}
                              className="ml-2 hover:text-red-500 hover:bg-background"
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
              {isFetched && clientes.length === 0 && (
                  <TableRow>
                    <TableCell
                        colSpan={7}
                        className="text-center uppercase text-slate-600 font-bold"
                    >
                      Nenhum cliente cadastrado
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
  );
}
