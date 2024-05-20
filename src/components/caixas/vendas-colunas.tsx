import { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import React from 'react'
import { Cliente } from '../../../src-electron/models/cliente'
import { Venda } from '../../../src-electron/models/venda'
import { gerarStringPorcentagemPorNumeroInteiro, gerarStringReal } from '@/utils/conversores'
import { Button } from '../ui/button'
import { buscarVendaPorId } from '@/api/vendas-api'

type ColunasVendaProps = {
  setIdParaExcluir: React.Dispatch<React.SetStateAction<number>>
  abrirEdicaoVenda: (vendaId: number) => void
}

export const pegarColunasVenda = ({ setIdParaExcluir, abrirEdicaoVenda }: ColunasVendaProps): ColumnDef<Venda>[] => [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'estoque',
    header: 'Produtos',
    cell: ({ row }) => {
      const [estoques, setEstoque] = React.useState([])

      React.useEffect(() => {
        const fetchEstoque = async () => {
          const venda = await buscarVendaPorId(row.getValue('id'))
          setEstoque(venda && venda.estoque ? venda.estoque : [])
        }

        fetchEstoque()
      }, [row])

      return estoques.length > 0 ? estoques.map((estoque: any) => estoque.nome).join(', ') : 'Sem item cadastrado'
    },
  },
  {
    accessorKey: 'cliente',
    header: 'Cliente',
    cell: ({ row }) => {
      const [cliente, setCliente] = React.useState(null)

      React.useEffect(() => {
        const fetchCliente = async () => {
          const venda = await buscarVendaPorId(row.getValue('id'))
          setCliente(venda && venda.cliente ? venda.cliente.nome : 'Cliente não informado')
        }

        fetchCliente()
      }, [row])

      return <>{cliente}</>
    },
  },
  {
    accessorKey: 'formaPagamento',
    header: 'Forma de Pagamento',
  },
  {
    accessorKey: 'desconto',
    header: 'Desconto',
    cell: ({ row }) => {
      return gerarStringPorcentagemPorNumeroInteiro(row.getValue('desconto'))
    },
  },
  {
    accessorKey: 'valorTotal',
    header: 'Valor Total',
    cell: ({ row }) => {
      return gerarStringReal(row.getValue('valorTotal'))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const vendaId = row.original.id

      return (
        <div className="flex justify-center w-full gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => abrirEdicaoVenda(vendaId)}
            className="text-orange-400 hover:text-white hover:bg-orange-400">
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIdParaExcluir(vendaId)}
            className="text-red-500 hover:text-white hover:bg-red-500">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      )
    },
  },
]
