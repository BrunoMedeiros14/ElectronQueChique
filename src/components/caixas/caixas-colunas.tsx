import { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import React from 'react'
import { Caixa } from '../../../src-electron/models/caixa'
import { Button } from '@/components/ui/button'
import { gerarStringPorDate, gerarStringReal } from '@/utils/conversores'

type ColunasCaixaProps = {
  setIdParaExcluir: React.Dispatch<React.SetStateAction<number>>
  abrirEdicaoCaixa: (caixaId: number) => void
}

export const pegarColunasCaixa = ({ setIdParaExcluir, abrirEdicaoCaixa }: ColunasCaixaProps): ColumnDef<Caixa>[] => [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'ativo',
    header: 'Ativo',
    cell: ({ row }) => {
      return row.getValue('ativo') ? 'Sim' : 'Não'
    },
  },
  {
    accessorKey: 'dataHoraAbertura',
    header: 'Data Abertura',
    cell: ({ row }) => {
      return row.getValue('dataPagamento') ? gerarStringPorDate(row.getValue('dataPagamento')) : 'Não inserido'
    },
  },
  {
    accessorKey: 'dataHoraFechamento',
    header: 'Data Fechamento',
    cell: ({ row }) => {
      return row.getValue('dataPagamento') ? gerarStringPorDate(row.getValue('dataPagamento')) : 'Não inserido'
    },
  },
  {
    accessorKey: 'valorInicial',
    header: 'Valor Inicial',
    cell: ({ row }) => {
      return gerarStringReal(row.getValue('valorInicial'))
    },
  },
  {
    accessorKey: 'vendas',
    header: 'Vendas',
  },
  {
    accessorKey: 'contas',
    header: 'Contas',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const caixaId = row.original.id

      return (
        <div className="flex justify-center w-full gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => abrirEdicaoCaixa(caixaId)}
            className="text-orange-400 hover:text-white hover:bg-orange-400">
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIdParaExcluir(caixaId)}
            className="text-red-500 hover:text-white hover:bg-red-500">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      )
    },
  },
]
