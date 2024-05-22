import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from './button'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  dados: TData[]
  colunaParaFiltrar?: string
  filtro?: string
  textoParaVazio?: string
}

export function DataTable<TData, TValue>({
                                           columns,
                                           dados,
                                           colunaParaFiltrar,
                                           filtro = '',
                                           textoParaVazio = 'Sem Dados Registrados',
                                         }: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data: dados,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    onColumnFiltersChange: setColumnFilters,
  })

  useEffect(() => {
    if (colunaParaFiltrar) table.getColumn(colunaParaFiltrar).setFilterValue(filtro)
  }, [filtro])

  return (
    <div>
      <div className="rounded-md border overflow-hidden">

        <Table>
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="bg-primary hover:bg-primary/90" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-white font-semibold" key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-12 text-center">
                  {textoParaVazio}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex w-[100px] whitespace-nowrap items-center justify-center text-sm font-medium">
            {`Página ${table.getState().pagination.pageIndex + 1} de ${table.getPageCount()}`}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-2"></div>
    </div>
  )
}
