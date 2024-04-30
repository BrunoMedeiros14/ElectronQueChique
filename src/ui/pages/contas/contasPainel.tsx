import { buscarContas } from "@/ui/api/contasApi";
import { Button } from "@/ui/components/ui/button";
import { DataTable } from "@/ui/components/ui/data-table";
import { Dialog, DialogTrigger } from "@/ui/components/ui/dialog";
import { Input } from "@/ui/components/ui/input";
import { escutarCliqueTeclado } from "@/ui/hooks/escutarCliqueTeclado";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createRoute } from "@tanstack/react-router";
import { Receipt } from "lucide-react";
import { useRef, useState } from "react";
import { painelRoute } from "../../routes";
import { pegarColunasConta } from "./contasColunas";
import { DialogCadastrarConta } from "./contasDialog";

export const contasRoute = createRoute({
  getParentRoute: () => painelRoute,
  path: "/contas",
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(buscarContas),
  component: ContasComponent,
});

function ContasComponent() {
  const refBotaoCadastro = useRef<HTMLButtonElement>();

  const [searchValue, setSearchValue] = useState("");
  const [dialogAberto, setDialogAberto] = useState(false);

  const { data: contas } = useSuspenseQuery(buscarContas);
  const colunasConta = pegarColunasConta();

  // const refBotaoAtuailacao = useRef<HTMLButtonElement>();
  // const [idParaExcluir, setIdParaExcluir] = useState<number>(null);
  // const [idParaEditar, setIdParaEditar] = useState<number>(null);

  // const queryClient = useQueryClient();
  // const removerContaMutation = useMutation({
  //   mutationFn: removerContaApi,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["contas"] });
  //     setIdParaExcluir(null);
  //   },
  // });

  // const abrirEdicaoConta = (contaId: number) => {
  //   setIdParaEditar(contaId);
  //   refBotaoAtuailacao.current.click();
  // };

  //   {
  //   setIdParaExcluir,
  //   abrirEdicaoConta,
  // }

  escutarCliqueTeclado(() => {
    refBotaoCadastro.current.click();
  }, ["F1"]);

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 max-w-[96rem] mx-auto">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl h-10">Contas</h1>
      </div>
      <div className="flex items-center justify-between py-3 gap-2">
        <Input
          placeholder="Pesquisar contas..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="max-w-lg"
        />
        <Dialog onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button ref={refBotaoCadastro} className="ml-auto h-10">
              <Receipt className="mr-2" />
              Adicionar nova (F1)
            </Button>
          </DialogTrigger>
          <DialogCadastrarConta isOpen={dialogAberto} />
        </Dialog>
      </div>
      <DataTable
        columns={colunasConta}
        dados={contas}
        colunaParaFiltrar="nome"
        filtro={searchValue}
        textoParaVazio="Sem contas registrada"
      />
      {/* <AlertDialog open={idParaExcluir !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>O cliente será apagado</AlertDialogTitle>
            <AlertDialogDescription>
              Se essa ação for realizada, não será possível recuperar os dados
              do cliente, deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setIdParaExcluir(null)}
              className="destructive"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(buttonVariants({ variant: "destructive" }))}
              onClick={() => removerClienteMutation.mutate(idParaExcluir)}
            >
              Apagar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
      {/* <Dialog>
        <DialogTrigger ref={refBotaoAtuailacao} />
        <DialogAtualizarCliente clienteId={idParaEditar} />
      </Dialog> */}
    </main>
  );
}
