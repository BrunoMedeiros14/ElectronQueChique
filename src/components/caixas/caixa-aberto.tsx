import { buscarTodasContas } from '@/api/contas-api'
import { buscarVendasPorCaixaId, removerVendaApi } from '@/api/vendas-api'
import { DialogAtualizarVenda } from '@/components/caixas/atualizar-venda-dialog'
import { DialogAdicionarSaidaDeValores } from '@/components/caixas/cadastrar-conta-dialog'
import { DialogCadastrarVendaBeta } from '@/components/caixas/cadastrar-venda-dialog'
import { DialogFecharCaixa } from '@/components/caixas/fechar-caixa-dialog'
import { pegarColunasVenda } from '@/components/caixas/vendas-colunas'
import { FormaPagamento } from '@/enums/forma-pagamento'
import { useEscutarCliqueTeclado } from '@/hooks/escutar-clique-teclado'
import { gerarStringReal } from '@/utils/conversores'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Receipt } from 'lucide-react'
import { useRef, useState } from 'react'
import { FaCashRegister, FaMoneyBillWave } from 'react-icons/fa'
import { Caixa } from '../../../src-electron/models/caixa'
import { Conta } from '../../../src-electron/models/conta'
import { Venda } from '../../../src-electron/models/venda'
import { cn } from '../lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'
import { Button, buttonVariants } from '../ui/button'
import { DataTable } from '../ui/data-table'
import { Dialog, DialogTrigger } from '../ui/dialog'

type CaixaInfoProps = {
  title: string
  value: number
}

export function CaixaAberto({ caixaDoDia }: { caixaDoDia: Caixa }) {
  const [dialogAberto, setDialogAberto] = useState(false)
  const [idParaExcluir, setIdParaExcluir] = useState<number>(null)
  const [idParaEditar, setIdParaEditar] = useState<number>(null)
  const refBotaoAtualizacao = useRef<HTMLButtonElement>()
  const refBotaoCadastro = useRef<HTMLButtonElement>()

  const queryClient = useQueryClient()

  const vendas = useQuery<Venda[]>({
    queryKey: ['vendas', caixaDoDia],
    queryFn: () => buscarVendasPorCaixaId(caixaDoDia),
    staleTime: 5 * 1000,
  })

  const contas = useQuery<Conta[]>({
    queryKey: ['contas'],
    queryFn: () => buscarTodasContas(),
    staleTime: 5 * 1000,
  })

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

  useEscutarCliqueTeclado(() => {
    refBotaoCadastro.current.click()
  }, ['F1'])

  const saldoInicial = caixaDoDia?.valorInicial ?? 0

  const dataHoje = new Date()
  dataHoje.setHours(0, 0, 0, 0)

  let contasComDataPagamentoHoje: Conta[] = []

  if (contas.data) {
    contasComDataPagamentoHoje = contas.data.filter((conta) => {
      const dataPagamento = new Date(conta.dataPagamento)
      dataPagamento.setHours(0, 0, 0, 0)

      return dataPagamento.getTime() === dataHoje.getTime()
    })
  }

  const saidasDeCaixa = contasComDataPagamentoHoje.reduce((total, conta) => total + conta.valor, 0)

  const recebidoDinheiro = vendas.data
    ? vendas.data
        .filter((v) => v.formaPagamento === FormaPagamento.Dinheiro)
        .reduce((total, venda) => total + venda.valorTotal, 0)
    : 0

  const recebidoCartao = vendas.data
    ? vendas.data
        .filter((v) => v.formaPagamento === FormaPagamento.Cartao)
        .reduce((total, venda) => total + venda.valorTotal, 0)
    : 0

  const valorTotal = vendas.data ? vendas.data.reduce((total, venda) => total + venda.valorTotal, 0) : 0

  function CaixaInfo({ title, value }: CaixaInfoProps) {
    const isNegative = value < 0
    const valueClass = isNegative ? 'text-red-500' : 'text-green-500'

    return (
      <div className='rounded-45 m-2 flex w-full flex-col p-4'>
        <div className='flex justify-end rounded-t-2xl border border-blue-500 bg-blue-500 p-2'>
          <h2 className='text-lg text-white' style={{ whiteSpace: 'nowrap' }}>
            {title}
          </h2>
        </div>
        <div className='rounded-b-45 flex justify-between border border-blue-500 p-2'>
          <p className={`${valueClass} text-lg font-bold`}>{gerarStringReal(value)}</p>
        </div>
      </div>
    )
  }

  function CaixaInfoSaida({ title, value }: CaixaInfoProps) {
    return (
      <div className='rounded-45 m-2 flex w-full flex-col p-4'>
        <div className='flex justify-end rounded-t-2xl border border-blue-500 bg-blue-500 p-2'>
          <h2 className='text-lg text-white' style={{ whiteSpace: 'nowrap' }}>
            {title}
          </h2>
        </div>
        <div className='rounded-b-45 flex justify-between border border-blue-500 p-2'>
          <span className={`${'text-red-500'} text-xl font-bold`}>{'-'}</span>
          <p className={`${'text-red-500'} text-lg font-bold`}>{gerarStringReal(value)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='overflow-y-auto'>
      <main className='mx-auto flex flex-1 flex-col p-4 md:p-6'>
        <div>
          <div className='flex items-center'>
            <h1 className='h-10 text-lg font-semibold md:text-2xl'>{`Caixa do Dia`}</h1>
          </div>

          <div className='flex justify-end gap-4 py-3'>
            <Dialog onOpenChange={setDialogAberto}>
              <DialogTrigger asChild>
                <Button ref={refBotaoCadastro} className='h-10'>
                  <Receipt className='mr-2' />
                  Nova Venda (F1)
                </Button>
              </DialogTrigger>
              <DialogCadastrarVendaBeta isOpen={dialogAberto} />
            </Dialog>

            <Dialog onOpenChange={setDialogAberto}>
              <DialogTrigger asChild>
                <Button className='h-10'>
                  <FaMoneyBillWave className='mr-2' />
                  Adicionar Saída de Valores
                </Button>
              </DialogTrigger>
              <DialogAdicionarSaidaDeValores isOpen={dialogAberto} />
            </Dialog>

            <Dialog onOpenChange={setDialogAberto}>
              <DialogTrigger asChild>
                <Button className='h-10'>
                  <FaCashRegister className='mr-2' />
                  Fechar Caixa
                </Button>
              </DialogTrigger>
              <DialogFecharCaixa caixaId={caixaDoDia.id} />
            </Dialog>
          </div>

          {vendas.data && <DataTable columns={colunasVenda} dados={vendas.data} />}
        </div>

        <AlertDialog open={idParaExcluir !== null}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>A Venda Será Apagada</AlertDialogTitle>
              <AlertDialogDescription>
                Se essa ação for realizada, não será possível recuperar os dados da venda, deseja continuar?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIdParaExcluir(null)} className='destructive'>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                className={cn(buttonVariants({ variant: 'destructive' }))}
                onClick={() => removerVendaMutation.mutate(idParaExcluir)}>
                Apagar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog>
          <DialogTrigger ref={refBotaoAtualizacao} />
          <DialogAtualizarVenda vendaId={idParaEditar} />
        </Dialog>

        <div className='fixed bottom-0 flex gap-2'>
          <CaixaInfo title='Saldo Inicial' value={saldoInicial} />
          <CaixaInfoSaida title='Saídas de Caixa' value={saidasDeCaixa} />
          <CaixaInfo title='Recebido Cartão' value={recebidoCartao} />
          <CaixaInfo title='Recebido Dinheiro' value={recebidoDinheiro} />
          <CaixaInfo title='Valor Total' value={valorTotal - saidasDeCaixa} />
        </div>
      </main>
    </div>
  )
}
