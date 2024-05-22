import { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { Estoque } from '../../../src-electron/models/estoque'
import { gerarStringReal } from '@/utils/conversores'
import { Button } from '../ui/button'

type ColunasEstoqueProps = {
  setIdParaExcluir: React.Dispatch<React.SetStateAction<number>>
  abrirEdicaoEstoque: (estoqueId: number) => void
}

export const pegarColunasEstoque = ({
                                      setIdParaExcluir,
                                      abrirEdicaoEstoque,
                                    }: ColunasEstoqueProps): ColumnDef<Estoque>[] => [
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
    accessorKey: 'cor',
    header: 'Cor',
  },
  {
    accessorKey: 'tamanho',
    header: 'Tamanho',
  },
  {
    accessorKey: 'vendido',
    header: 'Vendido',
    cell: ({ row }) => {
      const vendido: boolean = row.getValue('vendido')
      const texto = vendido ? 'Sim' : 'Não'
      return (
        <div
          className={`badge ${
            vendido
              ? 'bg-green-600 text-white hover:bg-green-600/80'
              : 'bg-destructive text-destructive-foreground hover:bg-destructive/80'
          }`}>
          {texto}
        </div>
      )
    },
  },
  {
    accessorKey: 'tecido',
    header: 'Tecido',
  },
  {
    accessorKey: 'fornecedor',
    header: 'Marca',
  },
  {
    accessorKey: 'valorCompra',
    header: 'Valor da compra',
    cell: ({ row }) => {
      const valor = parseFloat(row.getValue('valorCompra'))
      const formatted = gerarStringReal(valor)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'valorVenda',
    header: 'Valor da Venda',
    cell: ({ row }) => {
      const valor = parseFloat(row.getValue('valorVenda'))
      const formatted = gerarStringReal(valor)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const estoqueId = row.original.id

      return (
        <div className="flex justify-center w-full gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => abrirEdicaoEstoque(estoqueId)}
            className="text-orange-400 hover:text-white hover:bg-orange-400">
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIdParaExcluir(estoqueId)}
            className="text-red-500 hover:text-white hover:bg-red-500">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      )
    },
  },
]
