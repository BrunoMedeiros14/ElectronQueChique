import {useMutation, useQueryClient, useSuspenseQuery,} from "@tanstack/react-query";
import {createRoute} from "@tanstack/react-router";
import React, {useRef, useState} from "react";
import {escutarCliqueTeclado} from "../../hooks/escutarCliqueTeclado";
import {painelRoute} from "../../routes";
import {pegarColunasCaixa, pegarColunasVenda} from "./caixasColunas";
import {buscarCaixas, removerCaixaApi} from "../../../ui/api/CaixasApi";
import {Dialog, DialogTrigger} from "../../components/ui/dialog";
import {Button} from "../../components/ui/button";
import {DataTable} from "../../components/ui/data-table";
import {FaCashRegister} from 'react-icons/fa';
import {buscarVendas, removerVendaApi} from "../../../ui/api/VendasApi";
import {DialogCadastrarCaixa, DialogCadastrarVenda} from "../../../ui/pages/caixas/caixasDialog";
import {Receipt} from "lucide-react";

export const caixasRoute = createRoute({
  getParentRoute: () => painelRoute,
  path: "/caixas",
  //@ts-ignore
  loader: ({context: {queryClient}}) =>
      queryClient.ensureQueryData(buscarCaixas),
  component: CaixasComponent,
});

function CaixasComponent() {
  const refBotaoCadastro = useRef<HTMLButtonElement>();
  const refBotaoAtualizacao = useRef<HTMLButtonElement>();

  const [searchValue, setSearchValue] = useState("");
  const [idParaExcluir, setIdParaExcluir] = useState<number>(null);
  const [idParaEditar, setIdParaEditar] = useState<number>(null);
  const [dialogAberto, setDialogAberto] = useState(false);

  const {data: caixas} = useSuspenseQuery(buscarCaixas);
  const {data: vendas} = useSuspenseQuery(buscarVendas);

  const queryClient = useQueryClient();

  const removerCaixaMutation = useMutation({
    mutationFn: removerCaixaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["caixas"]});
      setIdParaExcluir(null);
    },
  });
  const removerVendaMutation = useMutation({
    mutationFn: removerVendaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["vendas"]});
      setIdParaExcluir(null);
    },
  });

  const abrirEdicaoCaixa = (caixaId: number) => {
    setIdParaEditar(caixaId);
    refBotaoAtualizacao.current.click();
  };
  const abrirEdicaoVenda = (vendaId: number) => {
    setIdParaEditar(vendaId);
    refBotaoAtualizacao.current.click();
  };

  const colunasCaixa = pegarColunasCaixa({
    setIdParaExcluir,
    abrirEdicaoCaixa,
  });
  const colunasVenda = pegarColunasVenda({
    setIdParaExcluir,
    abrirEdicaoVenda,
  });

  escutarCliqueTeclado(() => {
    refBotaoCadastro.current.click();
  }, ["F1"]);

  type CaixaInfoProps = {
    title: string;
    value: number;
  };

  function CaixaInfo({title, value}: CaixaInfoProps) {
    const isNegative = value < 0;
    const valueClass = isNegative ? 'text-red-500' : 'text-green-500';
    const sign = isNegative ? '-' : '+';

    return (
        <div className="flex flex-col p-4 m-2 rounded-45 w-full">
          <div className="flex justify-end bg-blue-500 p-2 border border-blue-500 rounded-t-2xl">
            <h2 className="text-white text-lg">{title}</h2>
          </div>
          <div className="flex justify-between p-2 border border-blue-500 rounded-b-45">
            <span className={`${valueClass} text-xl font-bold`}>{sign}</span>
            <p className={`${valueClass} text-xl font-bold`}>{Math.abs(value)}</p>
          </div>
        </div>
    );
  }

  const verificarStatusCaixas = () => {
    const caixaInativo = caixas.length === 0 || caixas.every(caixa => caixa.ativo === false);
    if (caixaInativo) {
      const [fontSize, setFontSize] = useState('text-5xl');
      const [boxWidth, setBoxWidth] = useState('w-140');
      const [boxHeight, setBoxHeight] = useState('h-110');
      const [marginTop, setMarginTop] = useState('mt-20');
      const [buttonSize, setButtonSize] = useState('p-4');

      return (
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className={`${fontSize} font-bold`}>Caixa Fechado, Abra Um Novo</h1>
            <div className={`${marginTop} flex items-center justify-between py-3 gap-2`}>
              <Dialog onOpenChange={setDialogAberto}>
                <DialogTrigger asChild>
                  <Button ref={refBotaoCadastro}
                          className={`${boxWidth} ${boxHeight} ml-auto text-white bg-blue-500 ${fontSize} ${buttonSize}`}>
                    <FaCashRegister className={`mr-4 ${fontSize}`}/>
                    Abrir Caixa
                  </Button>
                </DialogTrigger>
                <DialogCadastrarCaixa isOpen={dialogAberto}/>
              </Dialog>
            </div>
          </div>
      );
    } else {
      return (
          <div className="overflow-y-auto">
            <main className="flex flex-1 flex-col p-4 md:p-6 mx-auto">
              <div>
                <div className="flex items-center">
                  <h1 className="font-semibold text-lg md:text-2xl h-10">{`Caixa do Dia`}</h1>
                </div>

                <div className="flex items-center justify-between py-3 gap-2">
                  <Dialog onOpenChange={setDialogAberto}>
                    <DialogTrigger asChild>
                      <Button ref={refBotaoCadastro} className="ml-auto h-10">
                        <Receipt className="mr-2"/>
                        Nova Venda (F1)
                      </Button>
                    </DialogTrigger>
                    <DialogCadastrarVenda isOpen={dialogAberto}/>
                  </Dialog>
                </div>

                <DataTable
                    columns={colunasVenda}
                    dados={vendas}
                    colunaParaFiltrar="id"
                    filtro={null}
                />
              </div>


              <div className="grid grid-cols-5 gap-4 fixed bottom-0">
                <CaixaInfo title="Saldo Inicial" value={20.00}/>
                <CaixaInfo title="Saídas de Caixa" value={-13}/>
                <CaixaInfo title="Recebido Cartão" value={12}/>
                <CaixaInfo title="Recebido Dinheiro" value={-11}/>
                <CaixaInfo title="Valor Total" value={10}/>
              </div>

              <Dialog>
                <DialogTrigger ref={refBotaoAtualizacao}/>
              </Dialog>
            </main>
          </div>
      );
    }
  };

  return verificarStatusCaixas();
}

