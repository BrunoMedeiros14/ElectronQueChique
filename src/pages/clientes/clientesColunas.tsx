import {ColumnDef} from '@tanstack/react-table'
import {Pencil, Trash2} from 'lucide-react'
import {Cliente} from '../../../src-electron/models/Cliente'
import {Button} from '../../components/ui/button'
import {gerarStringPorDate} from '../../utils/conversores'

type ColunasClienteProps = {
  setIdParaExcluir: React.Dispatch<React.SetStateAction<number>>
  abrirEdicaoCliente: (clienteId: number) => void
}

export const pegarColunasCliente = ({
                                      setIdParaExcluir,
                                      abrirEdicaoCliente,
                                    }: ColunasClienteProps): ColumnDef<Cliente>[] => [
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
    accessorKey: 'telefone',
    header: 'Telefone',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'dataNascimento',
    header: 'Data de Nascimento',
    cell: ({row}) => {
      return row.getValue('dataNascimento') === null
        ? 'Não cadastrado'
        : gerarStringPorDate(row.getValue('dataNascimento'))
    },
  },
  {
    accessorKey: 'endereco',
    header: 'Endereço',
    cell: ({row}) => {
      return row?.getValue('endereco') === ''
        ? 'Não cadastrado'
        : row?.getValue('endereco')
    },
  },
  {
    id: 'actions',
    cell: ({row}) => {
      const clienteId = row.original.id

      return (
        <div className='flex justify-center w-full gap-1'>
          <Button
            size='icon'
            variant='ghost'
            onClick={() => abrirEdicaoCliente(clienteId)}
            className='text-orange-400 hover:text-white hover:bg-orange-400'
          >
            <Pencil className='h-4 w-4'/>
            <span className='sr-only'>Edit</span>
          </Button>

          <Button
            size='icon'
            variant='ghost'
            onClick={() => setIdParaExcluir(clienteId)}
            className='text-red-500 hover:text-white hover:bg-red-500'
          >
            <Trash2 className='h-4 w-4'/>
            <span className='sr-only'>Delete</span>
          </Button>
        </div>
      )
    },
  },
]
