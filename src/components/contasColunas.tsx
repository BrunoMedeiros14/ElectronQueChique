import { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { Conta } from '../../src-electron/models/Conta'
import { gerarStringPorDate, gerarStringReal } from '../utils/conversores'
import { Button } from './ui/button'

type ColunasContaProps = {
  setIdParaExcluir: React.Dispatch<React.SetStateAction<number>>
  abrirEdicaoConta: (contaId: number) => void
}

export const pegarColunasConta = ({ setIdParaExcluir, abrirEdicaoConta }: ColunasContaProps): ColumnDef<Conta>[] => [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'nome',
    header: 'Nome',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'descricao',
    header: 'Descrição',
  },
  {
    accessorKey: 'dataVencimento',
    header: 'Data de Vencimento',
    cell: ({ row }) => {
      return row.getValue('dataVencimento') ? gerarStringPorDate(row.getValue('dataVencimento')) : 'Não inserido'
    },
  },
  {
    id: 'vencido',
    header: 'Vencido',
    cell: ({ row }) => {
      const pago: boolean = row.getValue('pago')
      const dataVencimento: string = row.getValue('dataVencimento')
      const dataVencimentoDate = new Date(dataVencimento)
      const hoje = new Date()

      dataVencimentoDate.setHours(8, 0, 0, 0)
      hoje.setHours(8, 0, 0, 0)
      hoje.setDate(hoje.getDate() - 1)

      const vencido = !pago && dataVencimentoDate < hoje

      return (
        <div
          className={`badge ${
            vencido ? 'bg-red-600 text-white hover:bg-red-600/80' : 'bg-green-600 text-white hover:bg-green-600/80'
          }`}>
          {vencido ? 'Atrasado' : 'Não'}
        </div>
      )
    },
  },
  {
    accessorKey: 'valor',
    header: 'Valor',
    cell: ({ row }) => {
      const valor = parseFloat(row.getValue('valor'))
      const formatted = gerarStringReal(valor)
      return <div className='font-medium'>{formatted}</div>
    },
  },
  {
    accessorKey: 'dataPagamento',
    header: 'Data de Pagamento',
    cell: ({ row }) => {
      return row.getValue('dataPagamento') ? gerarStringPorDate(row.getValue('dataPagamento')) : 'Não inserido'
    },
  },
  {
    accessorKey: 'pago',
    header: 'Pago',
    cell: ({ row }) => {
      const pago: boolean = row.getValue('pago')
      const texto = pago ? 'Sim' : 'Não'
      return (
        <div
          className={`badge ${
            pago
              ? 'bg-green-600 text-white hover:bg-green-600/80'
              : 'bg-destructive text-destructive-foreground hover:bg-destructive/80'
          }`}>
          {texto}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const contaId = row.original.id

      return (
        <div className='flex justify-center w-full gap-1'>
          <Button
            size='icon'
            variant='ghost'
            onClick={() => abrirEdicaoConta(contaId)}
            className='text-orange-400 hover:text-white hover:bg-orange-400'>
            <Pencil className='h-4 w-4' />
            <span className='sr-only'>Edit</span>
          </Button>

          <Button
            size='icon'
            variant='ghost'
            onClick={() => setIdParaExcluir(contaId)}
            className='text-red-500 hover:text-white hover:bg-red-500'>
            <Trash2 className='h-4 w-4' />
            <span className='sr-only'>Delete</span>
          </Button>
        </div>
      )
    },
  },
]
