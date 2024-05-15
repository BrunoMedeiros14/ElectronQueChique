import { cn } from '@/components/lib/utils'
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
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Receipt } from 'lucide-react'
import { useRef, useState } from 'react'
import { FaCashRegister, FaMoneyBillWave } from 'react-icons/fa'
import { Navigate } from 'react-router-dom'
import { Caixa } from '../../../src-electron/models/Caixa'
import { Venda } from '../../../src-electron/models/Venda'
import { buscarCaixaAtivo } from '../../api/CaixasApi'
import { buscarVendasPorCaixaId, removerVendaApi } from '../../api/VendasApi'
import { Button, buttonVariants } from '../../components/ui/button'
import { DataTable } from '../../components/ui/data-table'
import { Dialog, DialogTrigger } from '../../components/ui/dialog'
import { FormaPagamento } from '../../enums/FormaPagamento'
import { escutarCliqueTeclado } from '../../hooks/escutarCliqueTeclado'
import { DialogFecharCaixa } from '../../pages/caixas/caixasDialog'
import { gerarStringReal } from '../../utils/conversores'
import { DialogAtualizarVenda } from './atualizarVendaDialog'
import { DialogCadastrarVendaBeta } from './cadastrarVendaDialog'
import { pegarColunasVenda } from './vendasColunas'

type CaixaInfoProps = {
  title: string
  value: number
}

export function Component() {
  const queryClient = useQueryClient()

  const { data: caixaDoDia } = useSuspenseQuery<Caixa>({
    queryKey: ['caixas'],
    queryFn: buscarCaixaAtivo,
    refetchOnWindowFocus: true,
  })

  const [dialogAberto, setDialogAberto] = useState(false)
  const [idParaExcluir, setIdParaExcluir] = useState<number>(null)
  const [idParaEditar, setIdParaEditar] = useState<number>(null)
  const refBotaoAtualizacao = useRef<HTMLButtonElement>()
  const refBotaoCadastro = useRef<HTMLButtonElement>()

  const vendas = useQuery<Venda[]>({
    queryKey: ['vendas', caixaDoDia],
    queryFn: () => buscarVendasPorCaixaId(caixaDoDia),
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

  escutarCliqueTeclado(() => {
    refBotaoCadastro.current.click()
  }, ['F1'])

  const saldoInicial = caixaDoDia?.valorInicial ?? 0

  const saidasDeCaixa = caixaDoDia?.contas?.reduce((total, contaAtual) => total + contaAtual.valor, 0) ?? 0

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
    const sign = isNegative ? '-' : '+'

    return (
      <div className='flex flex-col p-4 m-2 rounded-45 w-full'>
        <div className='flex justify-end bg-blue-500 p-2 border border-blue-500 rounded-t-2xl'>
          <h2 className='text-white text-lg'>{title}</h2>
        </div>
        <div className='flex justify-between p-2 border border-blue-500 rounded-b-45'>
          <span className={`${valueClass} text-xl font-bold`}>{sign}</span>
          <p className={`${valueClass} text-xl font-bold`}>{gerarStringReal(value)}</p>
        </div>
      </div>
    )
  }

  return !caixaDoDia ? (
    <Navigate to='/app/caixa' replace />
  ) : (
    <div className='overflow-y-auto'>
      <main className='flex flex-1 flex-col p-4 md:p-6 mx-auto'>
        <div>
          <div className='flex items-center'>
            <h1 className='font-semibold text-lg md:text-2xl h-10'>{`Caixa do Dia`}</h1>
          </div>

          <div className='flex justify-end py-3 gap-4'>
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
              {/*<DialogAdicionarSaidaValores isOpen={dialogAberto} />*/}
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

        <div className='flex gap-2 fixed bottom-0'>
          <CaixaInfo title='Saldo Inicial' value={saldoInicial} />
          <CaixaInfo title='Saídas de Caixa' value={saidasDeCaixa} />
          <CaixaInfo title='Recebido Cartão' value={recebidoCartao} />
          <CaixaInfo title='Recebido Dinheiro' value={recebidoDinheiro} />
          <CaixaInfo title='Valor Total' value={valorTotal} />
        </div>
      </main>
    </div>
  )
}
