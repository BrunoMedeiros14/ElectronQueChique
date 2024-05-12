import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { Receipt } from 'lucide-react'
import { useRef, useState } from 'react'
import { FaCashRegister } from 'react-icons/fa'
import { Caixa } from '../../../src-electron/models/Caixa'
import { buscarCaixas, removerCaixaApi } from '../../api/CaixasApi'
import { buscarVendas, removerVendaApi } from '../../api/VendasApi'
import { Button } from '../../components/ui/button'
import { DataTable } from '../../components/ui/data-table'
import { Dialog, DialogTrigger } from '../../components/ui/dialog'
import { escutarCliqueTeclado } from '../../hooks/escutarCliqueTeclado'
import { DialogCadastrarCaixa } from '../../pages/caixas/caixasDialog'
import { DialogCadastrarVendaBeta } from './cadastrarVendaDialog'
import { pegarColunasCaixa, pegarColunasVenda } from './caixasColunas'

export function Component() {
  const refBotaoCadastro = useRef<HTMLButtonElement>()
  const refBotaoAtualizacao = useRef<HTMLButtonElement>()

  const [idParaExcluir, setIdParaExcluir] = useState<number>(null)
  const [idParaEditar, setIdParaEditar] = useState<number>(null)
  const [dialogAberto, setDialogAberto] = useState(false)

  const { data: caixas } = useSuspenseQuery(buscarCaixas)
  const { data: vendas } = useSuspenseQuery(buscarVendas)

  const queryClient = useQueryClient()

  const removerCaixaMutation = useMutation({
    mutationFn: removerCaixaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caixas'] })
      setIdParaExcluir(null)
    },
  })
  const removerVendaMutation = useMutation({
    mutationFn: removerVendaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendas'] })
      setIdParaExcluir(null)
    },
  })

  const abrirEdicaoCaixa = (caixaId: number) => {
    setIdParaEditar(caixaId)
    refBotaoAtualizacao.current.click()
  }
  const abrirEdicaoVenda = (vendaId: number) => {
    setIdParaEditar(vendaId)
    refBotaoAtualizacao.current.click()
  }

  const colunasCaixa = pegarColunasCaixa({
    setIdParaExcluir,
    abrirEdicaoCaixa,
  })
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
          <p className={`${valueClass} text-xl font-bold`}>{Math.abs(value)}</p>
        </div>
      </div>
    )
  }

  const verificarStatusCaixas = () => {
    const caixaInativo =
      caixas.length === 0 ||
      caixas.every((caixa: Caixa) => caixa.ativo === false)

    return caixaInativo ? (
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-5xl font-bold'>Caixa Fechado, Abra Um Novo</h1>
        <div className='mt-20 flex items-center justify-between py-3 gap-2'>
          <Dialog onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button
                ref={refBotaoCadastro}
                className='w-140 h-110 ml-auto text-white bg-blue-500 text-5xl p-4'
              >
                <FaCashRegister className='mr-4 text-5xl' />
                Abrir Caixa
              </Button>
            </DialogTrigger>
            <DialogCadastrarCaixa isOpen={dialogAberto} />
          </Dialog>
        </div>
      </div>
    ) : (
      <div className='overflow-y-auto'>
        <main className='flex flex-1 flex-col p-4 md:p-6 mx-auto'>
          <div>
            <div className='flex items-center'>
              <h1 className='font-semibold text-lg md:text-2xl h-10'>{`Caixa do Dia`}</h1>
            </div>

            <div className='flex items-center justify-between py-3 gap-2'>
              <Dialog onOpenChange={setDialogAberto}>
                <DialogTrigger asChild>
                  <Button ref={refBotaoCadastro} className='ml-auto h-10'>
                    <Receipt className='mr-2' />
                    Nova Venda (F1)
                  </Button>
                </DialogTrigger>
                <DialogCadastrarVendaBeta isOpen={dialogAberto} />
              </Dialog>
            </div>

            <DataTable
              columns={colunasVenda}
              dados={vendas}
              colunaParaFiltrar='id'
              filtro={null}
            />
          </div>

          <div className='grid grid-cols-5 gap-4 fixed bottom-0'>
            <CaixaInfo title='Saldo Inicial' value={20.0} />
            <CaixaInfo title='Saídas de Caixa' value={-13} />
            <CaixaInfo title='Recebido Cartão' value={12} />
            <CaixaInfo title='Recebido Dinheiro' value={-11} />
            <CaixaInfo title='Valor Total' value={10} />
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
