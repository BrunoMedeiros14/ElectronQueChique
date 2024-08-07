import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Shirt } from 'lucide-react'
import { useRef, useState } from 'react'
import { buscarEstoques, removerEstoqueApi } from '../api/estoques-api'
import { pegarColunasEstoque } from '../components/estoques/estoque-colunas'
import { DialogAtualizarEstoque, DialogCadastrarEstoque } from '../components/estoques/estoque-dialog'
import { cn } from '../components/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog'
import { Button, buttonVariants } from '../components/ui/button'
import { DataTable } from '../components/ui/data-table'
import { Dialog, DialogTrigger } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { useEscutarCliqueTeclado } from '../hooks/escutar-clique-teclado'

export const Route = createLazyFileRoute('/_auth/estoque')({
  component: Component,
  pendingComponent: () => <div>Loading...</div>,
})

export function Component() {
  const refBotaoCadastro = useRef<HTMLButtonElement>()
  const refBotaoAtuailacao = useRef<HTMLButtonElement>()

  const [searchValue, setSearchValue] = useState('')
  const [idParaExcluir, setIdParaExcluir] = useState<number>(null)
  const [idParaEditar, setIdParaEditar] = useState<number>(null)
  const [dialogAberto, setDialogAberto] = useState(false)

  const { data: estoques } = useSuspenseQuery(buscarEstoques)
  const queryEstoque = useQueryClient()
  const removerEstoqueMutation = useMutation({
    mutationFn: removerEstoqueApi,
    onSuccess: () => {
      queryEstoque.invalidateQueries({ queryKey: ['estoques'] })
      setIdParaExcluir(null)
    },
  })

  const abrirEdicaoEstoque = (estoqueId: number) => {
    setIdParaEditar(estoqueId)
    refBotaoAtuailacao.current.click()
  }

  const colunasEstoque = pegarColunasEstoque({
    setIdParaExcluir,
    abrirEdicaoEstoque,
  })

  useEscutarCliqueTeclado(() => {
    refBotaoCadastro.current.click()
  }, ['F1'])

  return (
    <main className='mx-auto flex max-w-[96rem] flex-1 flex-col p-4 md:p-6'>
      <div className='flex items-center'>
        <h1 className='h-10 text-lg font-semibold md:text-2xl'>Estoque</h1>
      </div>

      <div className='flex items-center justify-between gap-2 py-3'>
        <Input
          placeholder='Pesquisar itens...'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className='max-w-lg'
        />
        <Dialog onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button ref={refBotaoCadastro} className='ml-auto h-10'>
              <Shirt className='mr-2' />
              Adicionar novo (F1)
            </Button>
          </DialogTrigger>
          <DialogCadastrarEstoque isOpen={dialogAberto} />
        </Dialog>
      </div>

      <DataTable columns={colunasEstoque} dados={estoques} colunaParaFiltrar='nome' filtro={searchValue} />

      <AlertDialog open={idParaExcluir !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>O Produto Será Apagado</AlertDialogTitle>
            <AlertDialogDescription>
              Se essa ação for realizada, não será possível recuperar os dados do produto, deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIdParaExcluir(null)} className='destructive'>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(buttonVariants({ variant: 'destructive' }))}
              onClick={() => removerEstoqueMutation.mutate(idParaExcluir)}>
              Apagar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog>
        <DialogTrigger ref={refBotaoAtuailacao} />
        <DialogAtualizarEstoque estoqueId={idParaEditar} />
      </Dialog>
    </main>
  )
}
