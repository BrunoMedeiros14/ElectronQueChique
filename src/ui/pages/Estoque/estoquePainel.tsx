import {buscarEstoques, removerEstoqueApi} from "../../../ui/api/estoquesApi";
import {cn} from "../../../ui/components/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../ui/components/ui/alert-dialog";
import {Button, buttonVariants} from "../../../ui/components/ui/button";
import {Dialog, DialogTrigger} from "../../../ui/components/ui/dialog";
import {Input} from "../../../ui/components/ui/input";
import {useMutation, useQueryClient, useSuspenseQuery,} from "@tanstack/react-query";
import {createRoute} from "@tanstack/react-router";
import {Shirt} from "lucide-react";
import {useRef, useState} from "react";
import {DataTable} from "../../components/ui/data-table";
import {escutarCliqueTeclado} from "../../hooks/escutarCliqueTeclado";
import {painelRoute} from "../../routes";
import {pegarColunasEstoque} from "./estoqueColunas";
import {DialogAtualizarEstoque, DialogCadastrarEstoque} from "./estoqueDialog";

export const estoqueRoute = createRoute({
  getParentRoute: () => painelRoute,
  path: "/estoque",
  //@ts-ignore
  loader: ({context: {queryClient}}) =>
      queryClient.ensureQueryData(buscarEstoques),
  component: EstoquesComponent,
});

function EstoquesComponent() {
  const refBotaoCadastro = useRef<HTMLButtonElement>();
  const refBotaoAtuailacao = useRef<HTMLButtonElement>();

  const [searchValue, setSearchValue] = useState("");
  const [idParaExcluir, setIdParaExcluir] = useState<number>(null);
  const [idParaEditar, setIdParaEditar] = useState<number>(null);
  const [dialogAberto, setDialogAberto] = useState(false);

  const {data: estoques} = useSuspenseQuery(buscarEstoques);
  const queryEstoque = useQueryClient();
  const removerEstoqueMutation = useMutation({
    mutationFn: removerEstoqueApi,
    onSuccess: () => {
      queryEstoque.invalidateQueries({queryKey: ["estoques"]});
      setIdParaExcluir(null);
    },
  });

  const abrirEdicaoEstoque = (estoqueId: number) => {
    setIdParaEditar(estoqueId);
    refBotaoAtuailacao.current.click();
  };

  const colunasEstoque = pegarColunasEstoque({
    setIdParaExcluir,
    abrirEdicaoEstoque,
  });

  escutarCliqueTeclado(() => {
    refBotaoCadastro.current.click();
  }, ["F1"]);

  return (
      <main className="flex flex-1 flex-col p-4 md:p-6 max-w-[96rem] mx-auto">
        <div className="flex items-center">
          <h1 className="font-semibold text-lg md:text-2xl h-10">Estoque</h1>
        </div>
        <div className="flex items-center justify-between py-3 gap-2">
          <Input
              placeholder="Pesquisar itens..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="max-w-lg"
          />
          <Dialog onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button ref={refBotaoCadastro} className="ml-auto h-10">
                <Shirt className="mr-2"/>
                Adicionar novo (F1)
              </Button>
            </DialogTrigger>
            <DialogCadastrarEstoque isOpen={dialogAberto}/>
          </Dialog>
        </div>
        <DataTable
            columns={colunasEstoque}
            dados={estoques}
            colunaParaFiltrar="nome"
            filtro={searchValue}
        />

        <AlertDialog open={idParaExcluir !== null}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>O Produto Será Apagado</AlertDialogTitle>
              <AlertDialogDescription>
                Se essa ação for realizada, não será possível recuperar os dados
                do produto, deseja continuar?
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
                  className={cn(buttonVariants({variant: "destructive"}))}
                  onClick={() => removerEstoqueMutation.mutate(idParaExcluir)}
              >
                Apagar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Dialog>
          <DialogTrigger ref={refBotaoAtuailacao}/>
          <DialogAtualizarEstoque estoqueId={idParaEditar}/>
        </Dialog>
      </main>
  );
}
