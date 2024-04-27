import { Button } from "@/ui/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/ui/table";
import { escutarCliqueTeclado } from "@/ui/hooks/escutarCliqueTeclado";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import { clientesRoute } from ".";
import { buscarClientes } from "./comunicacaoApi";

export const clientesListagemRoute = createRoute({
  getParentRoute: () => clientesRoute,
  path: "/",
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(buscarClientes),
  component: ClientesListagem,
});

function ClientesListagem() {
  const clientesQuery = useSuspenseQuery(buscarClientes);

  const navigate = useNavigate();

  const deletarCliente = (clienteId: number) =>
    window.apiCliente.removerCliente(clienteId);

  const irParaPaginaCadastro = () =>
    navigate({ to: "/clientes/$clienteId", params: { clienteId: "new" } }); // router useNavigate()(to, {from: '/clientes/$clienteId',})//{ to: "/clientes/$clienteId", params: { clienteId: "new" } });

  escutarCliqueTeclado(() => {
    irParaPaginaCadastro();
  }, ["F1"]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Clientes</h1>
        <Button onClick={irParaPaginaCadastro} className="ml-auto" size="sm">
          <UserPlus className="mr-2" />
          Adicionar novo (F1)
        </Button>
      </div>
      <div className="border shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-4">id</TableHead>
              <TableHead className="">nome</TableHead>
              <TableHead className="hidden md:table-cell">
                data de nascimento
              </TableHead>
              <TableHead className="hidden md:table-cell">endereço</TableHead>
              <TableHead className="hidden md:table-cell">telefone</TableHead>
              <TableHead className="hidden md:table-cell">email</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientesQuery.data.map(
              ({ id, dataNascimento, email, endereco, nome, telefone }, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{id}</TableCell>
                  <TableCell className="hidden md:table-cell">{nome}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {dataNascimento.getFullYear()}
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
                    <Button size="icon" variant="outline">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button onClick={() => deletarCliente(id)} className="ml-2" size="icon" variant="outline">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
