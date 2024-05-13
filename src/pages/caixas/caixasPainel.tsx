import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Receipt } from 'lucide-react'
import { useRef, useState } from 'react'
import { FaCashRegister, FaMoneyBillWave } from 'react-icons/fa'
import { Caixa } from '../../../src-electron/models/Caixa'
import { buscarCaixas } from '../../api/CaixasApi'
import { buscarVendasPorCaixaId, removerVendaApi } from '../../api/VendasApi'
import { Button, buttonVariants } from '../../components/ui/button'
import { DataTable } from '../../components/ui/data-table'
import { Dialog, DialogTrigger } from '../../components/ui/dialog'
import { escutarCliqueTeclado } from '../../hooks/escutarCliqueTeclado'
import { DialogAtualizarVenda, DialogCadastrarCaixa, DialogFecharCaixa } from '../../pages/caixas/caixasDialog'
import { DialogCadastrarVendaBeta } from './cadastrarVendaDialog'
import { pegarColunasVenda } from './caixasColunas'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/components/lib/utils'
import { FormaPagamento } from '../../../src-electron/models/enums/FormaPagamento'
import { gerarStringReal } from '@/utils/conversores'

export function Component() {
  const refBotaoCadastro = useRef<HTMLButtonElement>()
  const refBotaoAtualizacao = useRef<HTMLButtonElement>()

  const [idParaExcluir, setIdParaExcluir] = useState<number>(null)
  const [idParaEditar, setIdParaEditar] = useState<number>(null)
  const [dialogAberto, setDialogAberto] = useState(false)

  const { data: caixas } = useSuspenseQuery(buscarCaixas)
  const caixaDoDia = caixas.find((caixa) => caixa.ativo === true)

  const { data: vendas } = useSuspenseQuery({
    queryKey: ['vendas', caixaDoDia.id],
    queryFn: () => buscarVendasPorCaixaId(caixaDoDia.id),
  })

  const queryClient = useQueryClient()

  const removerVendaMutation = useMutation({
    mutationFn: removerVendaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendas'] })
      setIdParaExcluir(null)
    },
  })

  const abrirEdicaoVenda = (vendaId: number) => {
    setIdParaEditar(vendaId)
    refBotaoAtualizacao.current.click()
  }

  const colunasVenda = pegarColunasVenda({
    setIdParaExcluir,
    abrirEdicaoVenda,
  })

  escutarCliqueTeclado(() => {
    refBotaoCadastro.current.click()
  }, ['F1'])

  type CaixaInfoProps = {
    title: string
    value: number
  }

  const caixaAberto = caixas.find((caixa) => caixa.ativo === true)
  const saldoInicial = caixaAberto?.valorInicial ? caixaAberto.valorInicial : 0

  let saidasDeCaixa = 0

  if (caixaAberto && caixaAberto.contas) {
    caixaAberto.contas.forEach((c) => {
      saidasDeCaixa += c.valor
    })
  }

  let recebidoDinheiro = 0
  let vendasDinheiro = vendas.filter(v => v.formaPagamento.length === FormaPagamento.Dinheiro.length)
  for (let venda of vendasDinheiro) {
    recebidoDinheiro += venda.valorTotal
  }

  let recebidoCartao = 0
  let vendasCartao = vendas.filter(v => v.formaPagamento.length === FormaPagamento.Cartao.length)
  for (let venda of vendasCartao) {
    recebidoCartao += venda.valorTotal
  }

  let valorTotal = vendas
    .reduce((total, venda) => total + venda.valorTotal, 0)

  function CaixaInfo({ title, value }: CaixaInfoProps) {
    const isNegative = value < 0
    const valueClass = isNegative ? 'text-red-500' : 'text-green-500'
    const sign = isNegative ? '-' : '+'

    return (
      <div className="flex flex-col p-4 m-2 rounded-45 w-full">
        <div className="flex justify-end bg-blue-500 p-2 border border-blue-500 rounded-t-2xl">
          <h2 className="text-white text-lg">{title}</h2>
        </div>
        <div className="flex justify-between p-2 border border-blue-500 rounded-b-45">
          <span className={`${valueClass} text-xl font-bold`}>{sign}</span>
          <p className={`${valueClass} text-xl font-bold`}>
            {gerarStringReal(value)}
          </p>
        </div>
      </div>
    )
  }

  const verificarStatusCaixas = () => {
    const caixaInativo =
      caixas.length === 0 ||
      caixas.every((caixa: Caixa) => caixa.ativo === false)

    return caixaInativo ? (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-5xl font-bold">Caixa Fechado, Abra Um Novo</h1>
        <div className="mt-20 flex items-center justify-between py-3 gap-2">
          <Dialog onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button
                ref={refBotaoCadastro}
                className="w-140 h-110 ml-auto text-white bg-blue-500 text-5xl p-4"
              >
                <FaCashRegister className="mr-4 text-5xl" />
                Abrir Caixa
              </Button>
            </DialogTrigger>
            <DialogCadastrarCaixa isOpen={dialogAberto} />
          </Dialog>
        </div>
      </div>
    ) : (
      <div className="overflow-y-auto">
        <main className="flex flex-1 flex-col p-4 md:p-6 mx-auto">
          <div>
            <div className="flex items-center">
              <h1 className="font-semibold text-lg md:text-2xl h-10">{`Caixa do Dia`}</h1>
            </div>

            <div className="flex items-end justify-end py-3 gap-2">
              <Dialog onOpenChange={setDialogAberto}>
                <DialogTrigger asChild>
                  <Button ref={refBotaoCadastro} className="ml-auto h-10">
                    <Receipt className="mr-2" />
                    Nova Venda (F1)
                  </Button>
                </DialogTrigger>
                <DialogCadastrarVendaBeta isOpen={dialogAberto} />
              </Dialog>

              <Dialog onOpenChange={setDialogAberto}>
                <DialogTrigger asChild>
                  <Button className="ml-auto h-10">
                    <FaMoneyBillWave className="mr-2" />
                    Adicionar Saída de Valores
                  </Button>
                </DialogTrigger>
                {/*<DialogAdicionarSaidaValores isOpen={dialogAberto} />*/}
              </Dialog>

              <Dialog onOpenChange={setDialogAberto}>
                <DialogTrigger asChild>
                  <Button className="ml-auto h-10">
                    <FaCashRegister className="mr-2" />
                    Fechar Caixa
                  </Button>
                </DialogTrigger>
                <DialogFecharCaixa caixaId={caixaAberto.id} />
              </Dialog>
            </div>

            <DataTable
              columns={colunasVenda}
              dados={vendas}
              colunaParaFiltrar="id"
              filtro={null}
            />
          </div>

          <AlertDialog open={idParaExcluir !== null}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>A Venda Será Apagada</AlertDialogTitle>
                <AlertDialogDescription>
                  Se essa ação for realizada, não será possível recuperar os
                  dados da venda, deseja continuar?
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
                  className={cn(buttonVariants({ variant: 'destructive' }))}
                  onClick={() => removerVendaMutation.mutate(idParaExcluir)}
                >
                  Apagar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Dialog>
            <DialogTrigger ref={refBotaoAtualizacao} />
            <DialogAtualizarVenda vendaId={idParaEditar} />
          </Dialog>

          <div className="grid grid-cols-5 gap-4 fixed bottom-0">
            <CaixaInfo title="Saldo Inicial" value={saldoInicial} />
            <CaixaInfo title="Saídas de Caixa" value={saidasDeCaixa} />
            <CaixaInfo title="Recebido Cartão" value={recebidoCartao} />
            <CaixaInfo title="Recebido Dinheiro" value={recebidoDinheiro} />
            <CaixaInfo title="Valor Total" value={valorTotal} />
          </div>

          <Dialog>
            <DialogTrigger ref={refBotaoAtualizacao} />
          </Dialog>
        </main>
      </div>
    )
  }

  return verificarStatusCaixas()
}
