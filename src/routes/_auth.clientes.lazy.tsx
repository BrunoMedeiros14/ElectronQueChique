import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { UserPlus } from 'lucide-react'
import { lazy, Suspense, useRef, useState } from 'react'
import { buscarClientes, removerClienteApi } from '../api/clientes-api'
import { pegarColunasCliente } from '../components/clientes/clientes-colunas'
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

export const Route = createLazyFileRoute('/_auth/clientes')({
  component: Component,
  pendingComponent: () => <div>Loading...</div>,
})

const DialogCadastrarCliente = lazy(() => import('../components/clientes/cadastrar-dialog'))
const DialogAtualizarCliente = lazy(() => import('../components/clientes/atualizar-dialog'))

export function Component() {
  const refBotaoCadastro = useRef<HTMLButtonElement>()
  const refBotaoAtualizacao = useRef<HTMLButtonElement>()

  const [searchValue, setSearchValue] = useState('')
  const [idParaExcluir, setIdParaExcluir] = useState<number>(null)
  const [idParaEditar, setIdParaEditar] = useState<number>(null)
  const [dialogAberto, setDialogAberto] = useState(false)

  const { data: clientes } = useSuspenseQuery(buscarClientes)
  const queryClient = useQueryClient()
  const removerClienteMutation = useMutation({
    mutationFn: removerClienteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      setIdParaExcluir(null)
    },
  })

  const abrirEdicaoCliente = (clienteId: number) => {
    setIdParaEditar(clienteId)
    refBotaoAtualizacao.current.click()
  }

  const colunasCliente = pegarColunasCliente({
    setIdParaExcluir,
    abrirEdicaoCliente,
  })

  useEscutarCliqueTeclado(() => {
    refBotaoCadastro.current.click()
  }, ['F1'])

  return (
    <main className='mx-auto flex max-w-[96rem] flex-1 flex-col p-4 md:p-6'>
      <div className='flex items-center'>
        <h1 className='h-10 text-lg font-semibold md:text-2xl'>Clientes</h1>
      </div>

      <div className='flex items-center justify-between gap-2 py-3'>
        <Input
          placeholder='Pesquisar clientes...'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className='max-w-lg'
        />

        <Dialog onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button ref={refBotaoCadastro} className='ml-auto h-10'>
              <UserPlus className='mr-2' />
              Adicionar novo (F1)
            </Button>
          </DialogTrigger>
          {dialogAberto && (
            <Suspense>
              <DialogCadastrarCliente />
            </Suspense>
          )}
        </Dialog>
      </div>

      <DataTable columns={colunasCliente} dados={clientes} colunaParaFiltrar='nome' filtro={searchValue} />
      <AlertDialog open={idParaExcluir !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>O Cliente Será Apagado</AlertDialogTitle>
            <AlertDialogDescription>
              Se essa ação for realizada, não será possível recuperar os dados do cliente, deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIdParaExcluir(null)} className='destructive'>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(buttonVariants({ variant: 'destructive' }))}
              onClick={() => removerClienteMutation.mutate(idParaExcluir)}>
              Apagar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog>
        <DialogTrigger ref={refBotaoAtualizacao} />
        {!!idParaEditar && (
          <Suspense>
            <DialogAtualizarCliente clienteId={idParaEditar} />
          </Suspense>
        )}
      </Dialog>
    </main>
  )
}
